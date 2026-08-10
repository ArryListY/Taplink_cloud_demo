import asyncio
import base64
import hashlib
import hmac
import json
import os
import time
from collections import deque
from dataclasses import dataclass
from typing import Any, Optional
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

WEBHOOK_SECRET = os.getenv("SUNBAY_WEBHOOK_SECRET", "")

# Fixed forwarding target: no runtime configuration required.
DINGTALK_WEBHOOK_URL = "https://oapi.dingtalk.com/robot/send?access_token=1062a51ee471dcb80c04556865df3cdcb401d5dd584d5d279d882e3da6102eb9"
DINGTALK_SECRET = "SECaeb51382d214d34dee20691a4d7b6ddc4cfe2b81a3bf76207567c1945264ec97"
DINGTALK_AT_ALL = False


class EventBus:
    def __init__(self) -> None:
        self._queues: set[asyncio.Queue[str]] = set()
        self._history: deque[dict[str, Any]] = deque(maxlen=200)

    async def publish(self, event_type: str, payload: dict[str, Any]) -> None:
        item = {
            "type": event_type,
            "ts": int(time.time() * 1000),
            "payload": payload,
        }
        self._history.append(item)
        encoded = self._encode(event_type, item)
        for queue in list(self._queues):
            try:
                queue.put_nowait(encoded)
            except asyncio.QueueFull:
                self._queues.discard(queue)

    async def subscribe(self) -> asyncio.Queue[str]:
        queue: asyncio.Queue[str] = asyncio.Queue(maxsize=200)
        self._queues.add(queue)
        return queue

    async def unsubscribe(self, queue: asyncio.Queue[str]) -> None:
        self._queues.discard(queue)

    def recent(self) -> list[dict[str, Any]]:
        return list(self._history)

    @staticmethod
    def _encode(event_type: str, item: dict[str, Any]) -> str:
        return f"event: {event_type}\ndata: {json.dumps(item, ensure_ascii=False)}\n\n"


@dataclass
class TerminalSubscriptionState:
    task: Optional[asyncio.Task] = None
    stop_event: Optional[asyncio.Event] = None
    mode: str = "idle"


class ProxyRequest(BaseModel):
    mode: str = Field(default="real")
    base_url: str = Field(default="https://open.sunbay-uat.us")
    method: str
    path: str
    headers: dict[str, str] = Field(default_factory=dict)
    payload: dict[str, Any] = Field(default_factory=dict)
    query: dict[str, Any] = Field(default_factory=dict)


class SubscribeRequest(BaseModel):
    mode: str = Field(default="real")
    base_url: str = Field(default="https://open.sunbay-uat.us")
    event_path: str = Field(default="/v1/semi-integration/terminal-events/subscribe")
    merchant_id: str
    terminal_sn: str
    authorization: Optional[str] = None


app = FastAPI(title="TapLink Cloud Demo Backend", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bus = EventBus()
terminal_state = TerminalSubscriptionState()


async def _publish_system(message: str) -> None:
    await bus.publish("system", {"message": message})


def _normalize_url(base_url: str, path: str, query: dict[str, Any]) -> str:
    base = base_url.rstrip("/")
    fixed_path = path if path.startswith("/") else f"/{path}"
    full = f"{base}{fixed_path}"
    if not query:
        return full
    parts = urlsplit(full)
    merged = dict(parse_qsl(parts.query, keep_blank_values=True))
    for key, value in query.items():
        merged[key] = str(value)
    query_str = urlencode(merged)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, query_str, parts.fragment))


def _mask_headers(headers: dict[str, str]) -> dict[str, str]:
    masked: dict[str, str] = {}
    for key, value in headers.items():
        if key.lower() == "authorization" and value:
            masked[key] = value[:10] + "***"
        else:
            masked[key] = value
    return masked


def _build_dingtalk_signed_url(webhook_url: str, secret: str) -> str:
    if not webhook_url:
        return ""
    if not secret:
        return webhook_url

    timestamp = str(int(time.time() * 1000))
    sign_input = f"{timestamp}\n{secret}".encode("utf-8")
    sign = base64.b64encode(hmac.new(secret.encode("utf-8"), sign_input, hashlib.sha256).digest()).decode("utf-8")

    parts = urlsplit(webhook_url)
    merged = dict(parse_qsl(parts.query, keep_blank_values=True))
    merged["timestamp"] = timestamp
    merged["sign"] = sign
    query_str = urlencode(merged)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, query_str, parts.fragment))


async def _forward_to_dingtalk(source_payload: dict[str, Any], event_type: str) -> dict[str, Any]:
    signed_url = _build_dingtalk_signed_url(DINGTALK_WEBHOOK_URL, DINGTALK_SECRET)
    content = json.dumps(source_payload, ensure_ascii=False, indent=2)
    title = f"Sunbay Webhook {event_type}"
    text = (
        f"### {title}\n"
        f"- Time: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())}\n"
        f"- Event: {event_type}\n"
        f"\n"
        f"```json\n{content}\n```"
    )
    body = {
        "msgtype": "markdown",
        "markdown": {
            "title": title,
            "text": text,
        },
        "at": {
            "isAtAll": DINGTALK_AT_ALL,
        },
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(signed_url, json=body)
    result_text = response.text
    try:
        result_data: Any = response.json()
    except Exception:  # noqa: BLE001
        result_data = result_text

    return {
        "ok": response.is_success,
        "statusCode": response.status_code,
        "data": result_data,
    }


@app.post("/api/proxy")
async def api_proxy(req: ProxyRequest) -> JSONResponse:
    method = req.method.upper()
    path = req.path

    if req.mode == "mock":
        result = {
            "mode": "mock",
            "endpoint": f"{method} {path}",
            "acceptedAt": int(time.time() * 1000),
            "status": "PROCESSING",
            "transactionId": f"TXN_{int(time.time() * 1000)}",
            "note": "Request accepted in mock mode. Use terminal event stream or query API for final status.",
            "requestPreview": req.payload,
        }
        await bus.publish("api_response", result)
        return JSONResponse(result)

    request_url = _normalize_url(req.base_url, path, req.query)
    headers = req.headers or {}

    await bus.publish(
        "api_request",
        {
            "endpoint": f"{method} {path}",
            "baseUrl": req.base_url,
            "requestUrl": request_url,
            "headers": _mask_headers(headers),
        },
    )

    async with httpx.AsyncClient(timeout=45.0) as client:
        try:
            response = await client.request(
                method=method,
                url=request_url,
                headers=headers,
                json=req.payload if method != "GET" else None,
            )
        except Exception as exc:  # noqa: BLE001
            await bus.publish("api_error", {"endpoint": f"{method} {path}", "error": str(exc)})
            raise HTTPException(status_code=502, detail=f"proxy request failed: {exc}") from exc

    raw_text = response.text
    try:
        data: Any = response.json()
    except Exception:  # noqa: BLE001
        data = raw_text

    payload = {
        "mode": "real",
        "endpoint": f"{method} {path}",
        "requestUrl": request_url,
        "httpStatus": response.status_code,
        "ok": response.is_success,
        "data": data,
    }
    await bus.publish("api_response", payload)
    return JSONResponse(payload, status_code=response.status_code)


async def _terminal_mock_loop(stop_event: asyncio.Event, terminal_sn: str) -> None:
    stages = [
        "REQUEST_DISPATCHED",
        "TERMINAL_ONLINE",
        "CARD_TAPPED",
        "PIN_ENTRY",
        "ONLINE_PROCESSING",
        "APPROVED",
    ]
    idx = 0
    await bus.publish("terminal_status", {"state": "connected", "mode": "mock"})
    while not stop_event.is_set():
        await bus.publish(
            "terminal_event",
            {"terminalSn": terminal_sn, "event": stages[idx % len(stages)], "mode": "mock"},
        )
        idx += 1
        await asyncio.sleep(1.4)


async def _terminal_real_loop(stop_event: asyncio.Event, cfg: SubscribeRequest) -> None:
    base = cfg.base_url.rstrip("/")
    path = cfg.event_path if cfg.event_path.startswith("/") else f"/{cfg.event_path}"
    params = {
        "merchantId": cfg.merchant_id,
        "terminalSn": cfg.terminal_sn,
    }
    request_url = _normalize_url(base, path, params)
    headers: dict[str, str] = {"Accept": "text/event-stream"}
    if cfg.authorization:
        headers["Authorization"] = cfg.authorization

    await bus.publish(
        "terminal_status",
        {
            "state": "connecting",
            "mode": "real",
            "url": request_url,
            "eventPath": path,
            "hasAuthorization": bool(cfg.authorization),
        },
    )

    event_name = "message"
    data_lines: list[str] = []
    async with httpx.AsyncClient(timeout=None) as client:
        while not stop_event.is_set():
            try:
                async with client.stream("GET", request_url, headers=headers) as response:
                    if response.status_code >= 400:
                        body_preview = ""
                        try:
                            body_preview = (await response.aread()).decode("utf-8", errors="replace")[:500]
                        except Exception:  # noqa: BLE001
                            body_preview = ""
                        await bus.publish(
                            "terminal_status",
                            {
                                "state": "error",
                                "mode": "real",
                                "statusCode": response.status_code,
                                "url": request_url,
                                "eventPath": path,
                                "hasAuthorization": bool(cfg.authorization),
                                "responseBody": body_preview,
                            },
                        )
                        await asyncio.sleep(2.0)
                        continue

                    await bus.publish(
                        "terminal_status",
                        {
                            "state": "connected",
                            "mode": "real",
                            "url": request_url,
                        },
                    )

                    async for line in response.aiter_lines():
                        if stop_event.is_set():
                            break
                        if line == "":
                            if data_lines:
                                payload_data = "\n".join(data_lines)
                                await bus.publish(
                                    "terminal_event",
                                    {
                                        "terminalSn": cfg.terminal_sn,
                                        "event": event_name,
                                        "data": payload_data,
                                        "mode": "real",
                                    },
                                )
                            event_name = "message"
                            data_lines = []
                            continue

                        if line.startswith("event:"):
                            event_name = line.split(":", 1)[1].strip() or "message"
                            continue

                        if line.startswith("data:"):
                            data_lines.append(line.split(":", 1)[1].lstrip())
                            continue

                    if data_lines:
                        payload_data = "\n".join(data_lines)
                        await bus.publish(
                            "terminal_event",
                            {
                                "terminalSn": cfg.terminal_sn,
                                "event": event_name,
                                "data": payload_data,
                                "mode": "real",
                            },
                        )
                        event_name = "message"
                        data_lines = []
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001
                await bus.publish("terminal_status", {"state": "error", "mode": "real", "error": str(exc)})
                await asyncio.sleep(2.0)


async def _stop_terminal_subscription() -> None:
    if terminal_state.stop_event:
        terminal_state.stop_event.set()
    if terminal_state.task:
        terminal_state.task.cancel()
        try:
            await terminal_state.task
        except asyncio.CancelledError:
            pass
        except Exception:  # noqa: BLE001
            pass
    terminal_state.task = None
    terminal_state.stop_event = None
    terminal_state.mode = "idle"


@app.post("/api/terminal-events/subscribe")
async def subscribe_terminal_events(req: SubscribeRequest) -> JSONResponse:
    await _stop_terminal_subscription()

    stop_event = asyncio.Event()
    terminal_state.stop_event = stop_event
    terminal_state.mode = req.mode

    if req.mode == "mock":
        terminal_state.task = asyncio.create_task(_terminal_mock_loop(stop_event, req.terminal_sn))
    else:
        terminal_state.task = asyncio.create_task(_terminal_real_loop(stop_event, req))

    await _publish_system("terminal subscription started")
    return JSONResponse({"ok": True, "mode": req.mode})


@app.post("/api/terminal-events/unsubscribe")
async def unsubscribe_terminal_events() -> JSONResponse:
    await _stop_terminal_subscription()
    await bus.publish("terminal_status", {"state": "idle", "mode": "idle"})
    await _publish_system("terminal subscription stopped")
    return JSONResponse({"ok": True})


@app.get("/api/events/recent")
async def recent_events() -> JSONResponse:
    return JSONResponse({"items": bus.recent()})


@app.get("/api/events/stream")
async def stream_events() -> StreamingResponse:
    queue = await bus.subscribe()

    async def event_gen() -> Any:
        try:
            yield "event: hello\ndata: {\"ok\": true}\n\n"
            while True:
                try:
                    item = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield item
                except asyncio.TimeoutError:
                    yield "event: ping\ndata: {}\n\n"
        finally:
            await bus.unsubscribe(queue)

    return StreamingResponse(event_gen(), media_type="text/event-stream")


def _is_signature_valid(raw_body: bytes, received_signature: str) -> bool:
    if not WEBHOOK_SECRET:
        return True
    if not received_signature:
        return False

    digest = hmac.new(WEBHOOK_SECRET.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    if received_signature.startswith("sha256="):
        received_signature = received_signature.replace("sha256=", "", 1)
    return hmac.compare_digest(digest, received_signature)


@app.post("/webhook/sunbay")
async def webhook_sunbay(request: Request) -> JSONResponse:
    raw = await request.body()
    signature = request.headers.get("X-Sunbay-Signature", "")

    if not _is_signature_valid(raw, signature):
        await bus.publish("webhook_error", {"message": "signature verification failed"})
        raise HTTPException(status_code=401, detail="invalid webhook signature")

    try:
        payload = json.loads(raw.decode("utf-8")) if raw else {}
    except Exception:  # noqa: BLE001
        payload = {"raw": raw.decode("utf-8", errors="replace")}

    webhook_event = {
        "headers": {
            "x-request-id": request.headers.get("x-request-id", ""),
            "x-event-type": request.headers.get("x-event-type", ""),
            "x-sunbay-signature": "present" if signature else "",
        },
        "payload": payload,
    }

    await bus.publish("webhook_received", webhook_event)

    event_type = webhook_event["headers"].get("x-event-type") or "unknown"
    try:
        forward_result = await _forward_to_dingtalk(webhook_event, event_type)
        await bus.publish("dingtalk_forward", forward_result)
    except Exception as exc:  # noqa: BLE001
        await bus.publish("dingtalk_forward_error", {"error": str(exc)})

    return JSONResponse({"code": "0", "message": "received"})


@app.get("/api/healthz")
async def healthz() -> JSONResponse:
    return JSONResponse({"ok": True, "time": int(time.time())})


FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

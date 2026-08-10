const API_ITEMS = [
  {
    id: "sale",
    label: "收款",
    group: "primary",
    method: "POST",
    path: "/v1/semi-integration/transaction/sale",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      description: ctx.description,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "void",
    label: "撤销",
    group: "primary",
    method: "POST",
    path: "/v1/semi-integration/transaction/void",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "refund",
    label: "退款",
    group: "primary",
    method: "POST",
    path: "/v1/semi-integration/transaction/refund",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: { orderAmount: ctx.amount.orderAmount, priceCurrency: ctx.amount.priceCurrency },
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
      reason: "Customer request",
    }),
  },
  {
    id: "query",
    label: "查单",
    group: "primary",
    method: "GET",
    path: "/v1/semi-integration/query",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      terminalSn: ctx.terminalSn,
    }),
  },
  {
    id: "auth",
    label: "Auth",
    group: "secondary",
    method: "POST",
    path: "/v1/semi-integration/transaction/auth",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      description: ctx.description,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "forced-auth",
    label: "Forced Auth",
    group: "secondary",
    method: "POST",
    path: "/v1/semi-integration/transaction/forced-auth",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      description: ctx.description,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "incremental-auth",
    label: "Incremental Auth",
    group: "secondary",
    method: "POST",
    path: "/v1/semi-integration/transaction/incremental-auth",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: { orderAmount: ctx.amount.orderAmount, priceCurrency: ctx.amount.priceCurrency },
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "post-auth",
    label: "Post Auth",
    group: "secondary",
    method: "POST",
    path: "/v1/semi-integration/transaction/post-auth",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "abort",
    label: "Abort",
    group: "secondary",
    method: "POST",
    path: "/v1/semi-integration/transaction/abort",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      terminalSn: ctx.terminalSn,
      reason: "USER_CANCEL",
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "tip-adjust",
    label: "Tip Adjust",
    group: "secondary",
    method: "POST",
    path: "/v1/semi-integration/transaction/tip-adjust",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: {
        tipAmount: 0,
        priceCurrency: ctx.amount.priceCurrency,
      },
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "batch-query",
    label: "Batch Query",
    group: "secondary",
    method: "GET",
    path: "/v1/semi-integration/settlement/batch-query",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      terminalSn: ctx.terminalSn,
      date: new Date().toISOString().slice(0, 10),
    }),
  },
  {
    id: "batch-close",
    label: "Batch Close",
    group: "secondary",
    method: "POST",
    path: "/v1/semi-integration/settlement/batch-close",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      transactionRequestId: ctx.requestId,
      terminalSn: ctx.terminalSn,
      printReceipt: "AUTO",
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "checkout-create-session",
    label: "Create Checkout Session",
    group: "secondary",
    method: "POST",
    path: "/v1/checkout/create-session",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      description: ctx.description,
      productList: ctx.productList,
      merchantReturnUrl: ctx.returnUrl,
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "checkout-sale",
    label: "Direct Payment",
    group: "secondary",
    method: "POST",
    path: "/v1/payment",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      description: ctx.description,
      paymentMethod: { category: "CARD", id: "VISA" },
      token: "DIGITAL_WALLET_TOKEN",
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "checkout-refund",
    label: "Online Refund",
    group: "secondary",
    method: "POST",
    path: "/v1/refund",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: {
        orderAmount: ctx.amount.orderAmount,
        priceCurrency: ctx.amount.priceCurrency,
      },
      reason: "Customer request",
      notifyUrl: ctx.notifyUrl,
      terminalEventNotifyUrl: ctx.notifyUrl,
    }),
  },
];

const LINK_GROUPS = [
  {
    title: "Cloud 模式核心",
    links: [
      ["云端集成", "https://docs.sunbay.us/zh/docs/integration/in-person/tapro-semi-integration/cloud-integration"],
      ["订阅终端事件", "https://docs.sunbay.us/zh/docs/integration/in-person/tapro-semi-integration/cloud-integration/terminal-events"],
      ["API 参考总览", "https://docs.sunbay.us/zh/refspec"],
    ],
  },
  {
    title: "常用接口参考",
    links: [
      ["Sale", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/sale"],
      ["Void", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/void"],
      ["Refund", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/refund"],
      ["Query", "https://docs.sunbay.us/zh/refspec/query/query-transaction"],
    ],
  },
];

const PRODUCTS = [
  { id: "p1", name: "Americano", priceCents: 550, qty: 1 },
  { id: "p2", name: "Blueberry Muffin", priceCents: 420, qty: 0 },
  { id: "p3", name: "Croissant", priceCents: 390, qty: 0 },
  { id: "p4", name: "Cold Brew", priceCents: 680, qty: 0 },
];

let selectedApiId = "sale";
let eventSource = null;
let activeTxn = null;
const STORAGE_KEY = "taplink_cloud_demo_config_v1";

const el = {
  backendUrl: document.getElementById("backendUrl"),
  envType: document.getElementById("envType"),
  customBaseUrl: document.getElementById("customBaseUrl"),
  apiKey: document.getElementById("apiKey"),
  appId: document.getElementById("appId"),
  merchantId: document.getElementById("merchantId"),
  terminalSn: document.getElementById("terminalSn"),
  currency: document.getElementById("currency"),
  notifyUrl: document.getElementById("notifyUrl"),
  returnUrl: document.getElementById("returnUrl"),
  productList: document.getElementById("productList"),
  orderAmountText: document.getElementById("orderAmountText"),
  totalAmountText: document.getElementById("totalAmountText"),
  primaryActions: document.getElementById("primaryActions"),
  secondaryApi: document.getElementById("secondaryApi"),
  runSecondaryBtn: document.getElementById("runSecondaryBtn"),
  endpointHint: document.getElementById("endpointHint"),
  requestPayload: document.getElementById("requestPayload"),
  responsePayload: document.getElementById("responsePayload"),
  rebuildBtn: document.getElementById("rebuildBtn"),
  runBtn: document.getElementById("runBtn"),
  modeBadge: document.getElementById("modeBadge"),
  eventBadge: document.getElementById("eventBadge"),
  eventUrl: document.getElementById("eventUrl"),
  subBtn: document.getElementById("subBtn"),
  unsubBtn: document.getElementById("unsubBtn"),
  clearEventsBtn: document.getElementById("clearEventsBtn"),
  eventLog: document.getElementById("eventLog"),
  linkGroups: document.getElementById("linkGroups"),
  txnStatusPanel: document.getElementById("txnStatusPanel"),
  txnRef: document.getElementById("txnRef"),
  txnReq: document.getElementById("txnReq"),
  txnState: document.getElementById("txnState"),
};

function loadPersistedConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const cfg = JSON.parse(raw);
    if (cfg.backendUrl) el.backendUrl.value = cfg.backendUrl;
    if (cfg.envType) el.envType.value = cfg.envType;
    if (cfg.customBaseUrl) el.customBaseUrl.value = cfg.customBaseUrl;
    if (cfg.apiKey) el.apiKey.value = cfg.apiKey;
    if (cfg.appId) el.appId.value = cfg.appId;
    if (cfg.merchantId) el.merchantId.value = cfg.merchantId;
    if (cfg.terminalSn) el.terminalSn.value = cfg.terminalSn;
    if (cfg.currency) el.currency.value = cfg.currency;
    if (cfg.returnUrl) el.returnUrl.value = cfg.returnUrl;
    if (cfg.eventUrl) el.eventUrl.value = cfg.eventUrl;
  } catch {
    // ignore malformed local storage
  }
}

function persistConfig() {
  const cfg = {
    backendUrl: el.backendUrl.value,
    envType: el.envType.value,
    customBaseUrl: el.customBaseUrl.value,
    apiKey: el.apiKey.value,
    appId: el.appId.value,
    merchantId: el.merchantId.value,
    terminalSn: el.terminalSn.value,
    currency: el.currency.value,
    returnUrl: el.returnUrl.value,
    eventUrl: el.eventUrl.value,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // storage may be unavailable in private mode
  }
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

function getCurrency() {
  return (el.currency.value || "USD").toUpperCase();
}

function formatMoney(amountCents) {
  const currency = getCurrency();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${currency}`;
  }
}

function getBaseUrl() {
  const env = el.envType.value;
  if (env === "uat") return "https://open.sunbay-uat.us";
  if (env === "production") return "https://open.sunbay.us";
  if (env === "sandbox") return "https://open-sandbox.sunbay.us";
  return el.customBaseUrl.value || "";
}

function getBackendUrl() {
  return (el.backendUrl.value || "http://127.0.0.1:8000").trim().replace(/\/$/, "");
}

function buildAuthorization() {
  const key = (el.apiKey.value || "").trim();
  if (!key) return "";
  return key.startsWith("Bearer ") ? key : `Bearer ${key}`;
}

function computeAmount() {
  const orderAmount = PRODUCTS.reduce((sum, p) => sum + p.priceCents * p.qty, 0);
  const totalAmount = orderAmount;

  el.orderAmountText.textContent = formatMoney(orderAmount);
  el.totalAmountText.textContent = formatMoney(totalAmount);

  return {
    orderAmount,
    taxAmount: 0,
    tipAmount: 0,
    surchargeAmount: 0,
    totalAmount,
    priceCurrency: getCurrency(),
  };
}

function productListPayload() {
  return PRODUCTS.filter((p) => p.qty > 0).map((p) => ({
    amount: p.priceCents,
    name: p.name,
    num: p.qty,
  }));
}

function buildContext() {
  const amount = computeAmount();
  const productList = productListPayload();
  const description = productList.length
    ? productList.map((it) => `${it.name} x${it.num}`).join(", ")
    : "Cloud checkout payment";

  return {
    appId: el.appId.value,
    merchantId: el.merchantId.value,
    terminalSn: el.terminalSn.value,
    notifyUrl: el.notifyUrl.value,
    returnUrl: el.returnUrl.value,
    amount,
    description,
    productList,
    orderId: uid("ORDER"),
    requestId: uid("REQ"),
  };
}

function selectedApi() {
  return API_ITEMS.find((api) => api.id === selectedApiId) || API_ITEMS[0];
}

function rebuildRequest(apiId = selectedApiId) {
  selectedApiId = apiId;
  const api = selectedApi();
  const payload = api.build(buildContext());
  el.requestPayload.value = JSON.stringify(payload, null, 2);
  el.endpointHint.textContent = `${api.method} ${getBaseUrl()}${api.path}`;
}

function renderProducts() {
  el.productList.innerHTML = "";
  for (const p of PRODUCTS) {
    const node = document.createElement("article");
    node.className = "product";
    node.innerHTML = `
      <div class="product-top">
        <strong>${p.name}</strong>
        <span class="price">${formatMoney(p.priceCents)}</span>
      </div>
      <div class="stepper">
        <button data-op="sub" data-id="${p.id}" type="button">-</button>
        <span>${p.qty}</span>
        <button data-op="add" data-id="${p.id}" type="button">+</button>
      </div>
    `;
    el.productList.appendChild(node);
  }
}

function renderSecondaryMenu() {
  const secondaryItems = API_ITEMS.filter((item) => item.group === "secondary");
  el.secondaryApi.innerHTML = "";
  for (const item of secondaryItems) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.label} (${item.method} ${item.path})`;
    el.secondaryApi.appendChild(option);
  }
}

function renderLinks() {
  el.linkGroups.innerHTML = "";
  for (const group of LINK_GROUPS) {
    const wrap = document.createElement("section");
    wrap.className = "link-group";
    const list = group.links
      .map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noreferrer">${name}</a></li>`)
      .join("");
    wrap.innerHTML = `<h3>${group.title}</h3><ul>${list}</ul>`;
    el.linkGroups.appendChild(wrap);
  }
}

function setEventBadge(state) {
  const textMap = {
    idle: "事件状态: 未订阅",
    connecting: "事件状态: 连接中",
    connected: "事件状态: 已连接",
    error: "事件状态: 连接异常",
  };
  el.eventBadge.className = `badge ${state}`;
  el.eventBadge.textContent = textMap[state] || textMap.idle;
}

function logEvent(text) {
  const item = document.createElement("div");
  item.className = "event-item";
  item.innerHTML = `<div class="event-time">${new Date().toLocaleTimeString()}</div><div class="event-text">${text}</div>`;
  el.eventLog.prepend(item);
}

function updateTxnStatus(state, payload = {}) {
  const status = String(state || "").toUpperCase();
  const isSuccess = ["S", "SUCCESS", "APPROVED", "COMPLETED"].includes(status);
  const isFailed = ["F", "FAILED", "DECLINED", "CANCELLED", "VOIDED", "ABORTED"].includes(status);

  el.txnRef.textContent = payload.referenceOrderId || (activeTxn && activeTxn.referenceOrderId) || "-";
  el.txnReq.textContent = payload.transactionRequestId || (activeTxn && activeTxn.transactionRequestId) || "-";

  if (isSuccess) {
    el.txnState.textContent = `已完成(${status})`;
    el.txnStatusPanel.className = "txn-status success";
    return;
  }
  if (isFailed) {
    el.txnState.textContent = `失败/终止(${status})`;
    el.txnStatusPanel.className = "txn-status failed";
    return;
  }

  el.txnState.textContent = status ? `进行中(${status})` : "处理中";
  el.txnStatusPanel.className = "txn-status processing";
}

function parsePayloadJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function handleEventData(raw) {
  const parsed = parsePayloadJson(raw);
  if (!parsed || !parsed.type) return;

  if (parsed.type === "terminal_event") {
    const payload = parsed.payload || {};
    const embedded = typeof payload.data === "string" ? parsePayloadJson(payload.data) : null;
    const txn = embedded && typeof embedded === "object" ? embedded : payload;
    const state = txn.transactionStatus || txn.event || "PROCESSING";
    if (activeTxn) {
      updateTxnStatus(state, txn);
    }
  }

  if (parsed.type === "webhook_received") {
    const body = (parsed.payload && parsed.payload.payload) || {};
    const matchesTxn =
      !activeTxn ||
      body.transactionRequestId === activeTxn.transactionRequestId ||
      body.referenceOrderId === activeTxn.referenceOrderId;

    if (matchesTxn) {
      const state = body.transactionStatus || body.transactionResultCode || "PROCESSING";
      updateTxnStatus(state, body);
      logEvent(`[交易状态] ${state} requestId=${body.transactionRequestId || "-"}`);
    }
  }
}

function parseRequestPayload() {
  const text = el.requestPayload.value.trim();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("请求参数不是有效 JSON");
  }
}

function buildGetQuery(payload) {
  const query = {};
  for (const [key, value] of Object.entries(payload || {})) {
    if (value === null || value === undefined) continue;
    if (typeof value === "object") continue;
    if (String(value).trim() === "") continue;
    query[key] = value;
  }
  return query;
}

async function runRequest(apiId = selectedApiId) {
  selectedApiId = apiId;
  const api = selectedApi();

  let payload;
  try {
    payload = parseRequestPayload();
  } catch (err) {
    el.responsePayload.value = JSON.stringify({ error: err.message }, null, 2);
    return;
  }

  // Keep request identifiers fresh at execution time.
  const freshContext = buildContext();
  payload.transactionRequestId = freshContext.requestId;
  if (api.id !== "query" && api.id !== "batch-query") {
    payload.referenceOrderId = freshContext.orderId;
  }
  if (payload.notifyUrl !== undefined) payload.notifyUrl = freshContext.notifyUrl;
  if (payload.terminalEventNotifyUrl !== undefined) payload.terminalEventNotifyUrl = freshContext.notifyUrl;

  el.requestPayload.value = JSON.stringify(payload, null, 2);

  activeTxn = {
    referenceOrderId: payload.referenceOrderId || "-",
    transactionRequestId: payload.transactionRequestId || "-",
  };
  updateTxnStatus("PROCESSING", activeTxn);

  el.runBtn.disabled = true;
  el.runBtn.textContent = "执行中...";

  const headers = {
    "Content-Type": "application/json",
    "X-Timestamp": `${Date.now()}`,
    "X-Client-Request-Id": uid("CID"),
  };

  const auth = buildAuthorization();
  if (auth) headers.Authorization = auth;

  const backend = getBackendUrl();
  const query = api.method === "GET" ? buildGetQuery(payload) : {};
  const requestBody = api.method === "GET" ? {} : payload;

  try {
    const response = await fetch(`${backend}/api/proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "real",
        base_url: getBaseUrl(),
        method: api.method,
        path: api.path,
        headers,
        payload: requestBody,
        query,
      }),
    });

    const raw = await response.text();
    let data = raw;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw;
    }

    el.responsePayload.value = JSON.stringify(
      {
        mode: "real",
        endpoint: `${api.method} ${api.path}`,
        httpStatus: response.status,
        ok: response.ok,
        data,
      },
      null,
      2,
    );

    logEvent(`HTTP ${response.status}: ${api.method} ${api.path}`);

    const business = data && data.data ? data.data : data;
    const earlyState = business && (business.transactionStatus || business.status || business.code);
    if (earlyState) {
      updateTxnStatus(earlyState, {
        referenceOrderId: payload.referenceOrderId,
        transactionRequestId: payload.transactionRequestId,
      });
    }
  } catch (err) {
    el.responsePayload.value = JSON.stringify(
      {
        mode: "real",
        endpoint: `${api.method} ${api.path}`,
        error: err.message || "请求失败",
      },
      null,
      2,
    );
    logEvent("真实请求失败，请检查后端、鉴权和网络可达性");
    updateTxnStatus("FAILED", activeTxn || {});
  } finally {
    el.runBtn.disabled = false;
    el.runBtn.textContent = "发起当前交易";
  }
}

function stopEvents() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}

function subscribeEvents() {
  stopEvents();
  setEventBadge("connecting");
  logEvent("开始订阅终端事件");

  const backend = getBackendUrl();
  const auth = buildAuthorization();

  fetch(`${backend}/api/terminal-events/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "real",
      base_url: getBaseUrl(),
      event_path: el.eventUrl.value.trim(),
      merchant_id: el.merchantId.value,
      terminal_sn: el.terminalSn.value,
      authorization: auth || null,
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`订阅接口失败: HTTP ${res.status} ${body}`);
      }

      eventSource = new EventSource(`${backend}/api/events/stream`);
      eventSource.onopen = () => {
        setEventBadge("connected");
        logEvent("SSE 已连接，等待终端与 webhook 状态");
      };
      eventSource.onmessage = (ev) => {
        if (ev.data && ev.data !== "{}") {
          handleEventData(ev.data);
        }
      };
      eventSource.addEventListener("terminal_status", (ev) => {
        logEvent(`[terminal_status] ${ev.data}`);
        handleEventData(ev.data);
      });
      eventSource.addEventListener("terminal_event", (ev) => {
        logEvent(`[terminal_event] ${ev.data}`);
        handleEventData(ev.data);
      });
      eventSource.addEventListener("webhook_received", (ev) => {
        logEvent(`[webhook_received] ${ev.data}`);
        handleEventData(ev.data);
      });
      eventSource.onerror = () => {
        setEventBadge("error");
        logEvent("SSE 连接异常，请检查后端可达性、云端鉴权和事件地址");
      };
    })
    .catch((err) => {
      setEventBadge("error");
      logEvent(err.message || "创建事件订阅失败");
    });
}

function bindEvents() {
  el.productList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.tagName !== "BUTTON") return;

    const product = PRODUCTS.find((p) => p.id === target.dataset.id);
    if (!product) return;

    if (target.dataset.op === "add") product.qty += 1;
    if (target.dataset.op === "sub") product.qty = Math.max(0, product.qty - 1);

    renderProducts();
    computeAmount();
    rebuildRequest(selectedApiId);
  });

  el.primaryActions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-action]");
    if (!button) return;

    const apiId = button.getAttribute("data-action");
    if (!apiId) return;

    rebuildRequest(apiId);
    runRequest(apiId);
  });

  el.runSecondaryBtn.addEventListener("click", () => {
    const apiId = el.secondaryApi.value;
    if (!apiId) return;
    rebuildRequest(apiId);
    runRequest(apiId);
  });

  [el.envType, el.customBaseUrl, el.appId, el.merchantId, el.terminalSn, el.currency, el.notifyUrl, el.returnUrl].forEach((node) => {
    node.addEventListener("input", () => {
      computeAmount();
      rebuildRequest(selectedApiId);
      persistConfig();
    });
    node.addEventListener("change", () => {
      computeAmount();
      rebuildRequest(selectedApiId);
      persistConfig();
    });
  });

  [el.backendUrl, el.apiKey, el.eventUrl].forEach((node) => {
    node.addEventListener("input", persistConfig);
    node.addEventListener("change", persistConfig);
  });

  el.rebuildBtn.addEventListener("click", () => rebuildRequest(selectedApiId));
  el.runBtn.addEventListener("click", () => runRequest(selectedApiId));

  el.subBtn.addEventListener("click", subscribeEvents);
  el.unsubBtn.addEventListener("click", async () => {
    stopEvents();
    setEventBadge("idle");
    logEvent("终端事件订阅已停止");
    try {
      await fetch(`${getBackendUrl()}/api/terminal-events/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      logEvent("后端取消订阅调用失败（已停止前端流）");
    }
  });

  el.clearEventsBtn.addEventListener("click", () => {
    el.eventLog.innerHTML = "";
  });

  el.secondaryApi.addEventListener("change", () => {
    rebuildRequest(el.secondaryApi.value);
  });
}

function bootstrap() {
  loadPersistedConfig();
  renderProducts();
  renderSecondaryMenu();
  renderLinks();
  computeAmount();
  rebuildRequest("sale");
  bindEvents();
  setEventBadge("idle");
  el.modeBadge.textContent = "收银模式: REAL";
  updateTxnStatus("IDLE", {});
  logEvent("商户收银 Demo 已就绪。请先点击“开始订阅”，再发起收款/撤销/退款/查单。交易状态将通过 terminalEventNotifyUrl 通知实时更新。");
}

bootstrap();

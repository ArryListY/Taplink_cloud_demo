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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
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
      terminalEventNotifyUrl: ctx.terminalEventNotifyUrl,
    }),
  },
];

const LINK_GROUPS = [
  {
    title: "Cloud 模式核心",
    links: [
      ["云端集成", "https://docs.sunbay-dev.com/zh/docs/integration/in-person/tapro-semi-integration/cloud-integration"],
      ["订阅终端事件", "https://docs.sunbay-dev.com/zh/docs/integration/in-person/tapro-semi-integration/cloud-integration/terminal-events"],
      ["API 参考总览", "https://docs.sunbay-dev.com/zh/refspec"],
    ],
  },
];

const PRODUCTS = [
  { id: "p1", name: "Americano", priceCents: 550, qty: 1 },
  { id: "p2", name: "Blueberry Muffin", priceCents: 420, qty: 0 },
  { id: "p3", name: "Croissant", priceCents: 390, qty: 0 },
  { id: "p4", name: "Cold Brew", priceCents: 680, qty: 0 },
];

const LIFECYCLE_PHASES = ["PLACED", "PRESENTED", "PROCESSING", "RESULT"];
const STORAGE_KEY = "taplink_cloud_demo_config_v1";
const FIXED_PUBLIC_WEBHOOK_URL = "http://47.77.239.198/webhook/sunbay";

let selectedApiId = "sale";
let eventSource = null;
let activeTxn = null;

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
  statusModal: document.getElementById("statusModal"),
  closeStatusModal: document.getElementById("closeStatusModal"),
  modalRef: document.getElementById("modalRef"),
  modalReq: document.getElementById("modalReq"),
  modalState: document.getElementById("modalState"),
  modalTimeline: document.getElementById("modalTimeline"),
  statusModalTitle: document.getElementById("statusModalTitle"),
  stepPlaced: document.getElementById("stepPlaced"),
  stepPresented: document.getElementById("stepPresented"),
  stepProcessing: document.getElementById("stepProcessing"),
  stepResult: document.getElementById("stepResult"),
};

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

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
  } catch {
    // ignore malformed storage
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
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // storage may be unavailable
  }
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

function getTerminalEventNotifyUrl() {
  return FIXED_PUBLIC_WEBHOOK_URL;
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
  return PRODUCTS.filter((p) => p.qty > 0).map((p) => ({ amount: p.priceCents, name: p.name, num: p.qty }));
}

function buildContext() {
  const amount = computeAmount();
  const productList = productListPayload();
  const description = productList.length ? productList.map((it) => `${it.name} x${it.num}`).join(", ") : "Cloud checkout payment";
  return {
    appId: el.appId.value,
    merchantId: el.merchantId.value,
    terminalSn: el.terminalSn.value,
    notifyUrl: el.notifyUrl.value,
    terminalEventNotifyUrl: getTerminalEventNotifyUrl(),
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
  el.eventUrl.value = getTerminalEventNotifyUrl();
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
  el.secondaryApi.innerHTML = "";
  for (const item of API_ITEMS.filter((it) => it.group === "secondary")) {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = `${item.label} (${item.method} ${item.path})`;
    el.secondaryApi.appendChild(opt);
  }
}

function renderLinks() {
  el.linkGroups.innerHTML = "";
  for (const group of LINK_GROUPS) {
    const wrap = document.createElement("section");
    wrap.className = "link-group";
    wrap.innerHTML = `<h3>${group.title}</h3><ul>${group.links.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noreferrer">${n}</a></li>`).join("")}</ul>`;
    el.linkGroups.appendChild(wrap);
  }
}

function setEventBadge(state) {
  const textMap = {
    idle: "事件状态: 未连接",
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

function setStepState(node, state) {
  if (!node) return;
  node.classList.remove("active", "done", "fail");
  if (state) node.classList.add(state);
}

function setLifecyclePhase(phase, failed = false) {
  const idx = LIFECYCLE_PHASES.indexOf(phase);
  const steps = [el.stepPlaced, el.stepPresented, el.stepProcessing, el.stepResult];
  steps.forEach((node, i) => {
    if (idx < 0) {
      setStepState(node, "");
      return;
    }
    if (i < idx) {
      setStepState(node, "done");
      return;
    }
    if (i === idx) {
      if (phase === "RESULT") {
        setStepState(node, failed ? "fail" : "done");
      } else {
        setStepState(node, "active");
      }
      return;
    }
    setStepState(node, "");
  });
}

function applyLifecycleByEventType(eventType) {
  const et = String(eventType || "").toUpperCase();
  if (!et) return;
  if (et === "ORDER_RECEIVED") return setLifecyclePhase("PLACED");
  if (et === "PAYMENT_PRESENTED" || et === "PIN_ENTERING") return setLifecyclePhase("PRESENTED");
  if (["PAYMENT_PROCESSING", "SIGNATURE_CAPTURED", "PRINTING", "PRINT_COMPLETED"].includes(et)) return setLifecyclePhase("PROCESSING");
  if (et === "TRANSACTION_ENDED") return setLifecyclePhase("RESULT");
}

function isFinalTxnStatus(state) {
  const status = String(state || "").toUpperCase();
  return ["S", "SUCCESS", "APPROVED", "COMPLETED", "F", "FAILED", "DECLINED", "CANCELLED", "VOIDED", "ABORTED"].includes(status);
}

function showStatusModal() {
  el.statusModal.classList.remove("hidden");
}

function appendModalTimeline(text) {
  const row = document.createElement("div");
  row.className = "timeline-item";
  row.textContent = `${new Date().toLocaleTimeString()} ${text}`;
  el.modalTimeline.prepend(row);
}

function updateTxnStatus(state, payload = {}) {
  const status = String(state || "").toUpperCase();
  const isSuccess = ["S", "SUCCESS", "APPROVED", "COMPLETED"].includes(status);
  const isFailed = ["F", "FAILED", "DECLINED", "CANCELLED", "VOIDED", "ABORTED"].includes(status);

  el.txnRef.textContent = payload.referenceOrderId || (activeTxn && activeTxn.referenceOrderId) || "-";
  el.txnReq.textContent = payload.transactionRequestId || (activeTxn && activeTxn.transactionRequestId) || "-";
  el.modalRef.textContent = el.txnRef.textContent;
  el.modalReq.textContent = el.txnReq.textContent;

  if (isSuccess) {
    el.txnState.textContent = `已完成(${status})`;
    el.txnStatusPanel.className = "txn-status success";
    el.modalState.textContent = `已完成(${status})`;
    el.statusModalTitle.textContent = "交易完成";
    setLifecyclePhase("RESULT", false);
    return;
  }
  if (isFailed) {
    el.txnState.textContent = `失败/终止(${status})`;
    el.txnStatusPanel.className = "txn-status failed";
    el.modalState.textContent = `失败/终止(${status})`;
    el.statusModalTitle.textContent = "交易失败";
    setLifecyclePhase("RESULT", true);
    return;
  }

  el.txnState.textContent = status ? `进行中(${status})` : "处理中";
  el.txnStatusPanel.className = "txn-status processing";
  el.modalState.textContent = status ? `进行中(${status})` : "处理中";
  el.statusModalTitle.textContent = "交易处理中";
}

function resetModalForTxn(payload) {
  el.modalRef.textContent = payload.referenceOrderId || "-";
  el.modalReq.textContent = payload.transactionRequestId || "-";
  el.modalState.textContent = "进行中";
  el.modalTimeline.innerHTML = "";
  setLifecyclePhase("PLACED");
  appendModalTimeline("已发起交易，等待终端和回调状态...");
  showStatusModal();
}

function parsePayloadJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function deriveStateFromTerminalNotify(body, envelopePayload) {
  const explicitStatus = envelopePayload.transactionStatus || body.transactionStatus || "";
  if (explicitStatus) return String(explicitStatus).toUpperCase();

  const resultCode = envelopePayload.transactionResultCode || body.transactionResultCode || "";
  if (String(resultCode) === "000") return "S";
  if (resultCode) return "F";
  return "";
}

function handleEventData(raw) {
  const parsed = parsePayloadJson(raw);
  if (!parsed || !parsed.type) return;

  if (parsed.type === "terminal_notify_received") {
    const body = (parsed.payload && parsed.payload.payload) || {};
    const envelopePayload = body.payload && typeof body.payload === "object" ? body.payload : {};
    const eventType = envelopePayload.eventType || body.eventType || "";
    const requestId = envelopePayload.transactionRequestId || body.transactionRequestId || "";
    const referenceOrderId = envelopePayload.referenceOrderId || body.referenceOrderId || "";
    const matchesTxn =
      !activeTxn ||
      requestId === activeTxn.transactionRequestId ||
      referenceOrderId === activeTxn.referenceOrderId;

    if (matchesTxn) {
      if (eventType) {
        applyLifecycleByEventType(eventType);
        appendModalTimeline(`terminalEventNotifyUrl event -> ${eventType}`);
      }

      const stateFromTerminal = deriveStateFromTerminalNotify(body, envelopePayload);
      if (stateFromTerminal) {
        const statusPayload = {
          referenceOrderId: referenceOrderId || (activeTxn && activeTxn.referenceOrderId) || "-",
          transactionRequestId: requestId || (activeTxn && activeTxn.transactionRequestId) || "-",
        };
        updateTxnStatus(stateFromTerminal, statusPayload);
        appendModalTimeline(`terminalEventNotifyUrl 状态 -> ${stateFromTerminal}`);
        if (activeTxn && isFinalTxnStatus(stateFromTerminal)) {
          activeTxn.finalFromTerminalNotify = true;
        }
      }
    }
  }

  if (parsed.type === "webhook_received") {
    const body = (parsed.payload && parsed.payload.payload) || {};
    const matchesTxn = !activeTxn || body.transactionRequestId === activeTxn.transactionRequestId || body.referenceOrderId === activeTxn.referenceOrderId;
    if (matchesTxn) {
      if (activeTxn && activeTxn.finalFromTerminalNotify) {
        appendModalTimeline("交易结果 webhook 已收到（状态以 terminalEventNotifyUrl 为准）");
        return;
      }
      const state = body.transactionStatus || body.transactionResultCode || "PROCESSING";
      updateTxnStatus(state, body);
      appendModalTimeline(`交易结果 webhook -> ${state}`);
      logEvent(`[交易状态] ${state} requestId=${body.transactionRequestId || "-"}`);
      if (isFinalTxnStatus(state)) {
        appendModalTimeline("交易已到终态，可关闭弹窗");
      }
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

function connectEventStream() {
  if (eventSource) return;
  const backend = getBackendUrl();
  setEventBadge("connecting");
  eventSource = new EventSource(`${backend}/api/events/stream`);
  eventSource.onopen = () => {
    setEventBadge("connected");
    logEvent("实时状态流已连接，等待 webhook 推送...");
  };
  eventSource.onmessage = (ev) => {
    if (ev.data && ev.data !== "{}") {
      handleEventData(ev.data);
    }
  };
  eventSource.addEventListener("webhook_received", (ev) => {
    logEvent(`[webhook_received] ${ev.data}`);
    handleEventData(ev.data);
  });
  eventSource.addEventListener("terminal_notify_received", (ev) => {
    logEvent(`[terminal_notify_received] ${ev.data}`);
    handleEventData(ev.data);
  });
  eventSource.addEventListener("dingtalk_forward", (ev) => {
    logEvent(`[dingtalk_forward] ${ev.data}`);
  });
  eventSource.onerror = () => {
    setEventBadge("error");
    logEvent("实时状态流连接异常，请检查后端服务");
  };
}

function disconnectEventStream() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  setEventBadge("idle");
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

  const fresh = buildContext();
  payload.transactionRequestId = fresh.requestId;
  if (api.id !== "query" && api.id !== "batch-query") {
    payload.referenceOrderId = fresh.orderId;
  }
  if (payload.notifyUrl !== undefined) payload.notifyUrl = fresh.notifyUrl;
  if (payload.terminalEventNotifyUrl !== undefined) payload.terminalEventNotifyUrl = fresh.terminalEventNotifyUrl;

  el.requestPayload.value = JSON.stringify(payload, null, 2);

  activeTxn = {
    referenceOrderId: payload.referenceOrderId || "-",
    transactionRequestId: payload.transactionRequestId || "-",
    finalFromTerminalNotify: false,
  };
  updateTxnStatus("PROCESSING", activeTxn);
  resetModalForTxn(activeTxn);

  connectEventStream();

  el.runBtn.disabled = true;
  el.runBtn.textContent = "执行中...";

  const headers = {
    "Content-Type": "application/json",
    "X-Timestamp": `${Date.now()}`,
    "X-Client-Request-Id": uid("CID"),
  };
  const auth = buildAuthorization();
  if (auth) headers.Authorization = auth;

  try {
    const response = await fetch(`${getBackendUrl()}/api/proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "real",
        base_url: getBaseUrl(),
        method: api.method,
        path: api.path,
        headers,
        payload: api.method === "GET" ? {} : payload,
        query: api.method === "GET" ? buildGetQuery(payload) : {},
      }),
    });

    const raw = await response.text();
    let data = raw;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw;
    }

    el.responsePayload.value = JSON.stringify({
      mode: "real",
      endpoint: `${api.method} ${api.path}`,
      httpStatus: response.status,
      ok: response.ok,
      data,
    }, null, 2);

    appendModalTimeline(`网关响应 HTTP ${response.status}`);
    logEvent(`HTTP ${response.status}: ${api.method} ${api.path}`);
  } catch (err) {
    el.responsePayload.value = JSON.stringify({
      mode: "real",
      endpoint: `${api.method} ${api.path}`,
      error: err.message || "请求失败",
    }, null, 2);
    appendModalTimeline(`请求失败: ${err.message || "unknown"}`);
    updateTxnStatus("FAILED", activeTxn || {});
  } finally {
    el.runBtn.disabled = false;
    el.runBtn.textContent = "发起当前交易";
  }
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

  [el.envType, el.customBaseUrl, el.appId, el.merchantId, el.terminalSn, el.currency, el.returnUrl, el.backendUrl, el.apiKey].forEach((node) => {
    node.addEventListener("input", () => {
      persistConfig();
      rebuildRequest(selectedApiId);
    });
    node.addEventListener("change", () => {
      persistConfig();
      rebuildRequest(selectedApiId);
    });
  });

  el.rebuildBtn.addEventListener("click", () => rebuildRequest(selectedApiId));
  el.runBtn.addEventListener("click", () => runRequest(selectedApiId));

  el.subBtn.addEventListener("click", connectEventStream);
  el.unsubBtn.addEventListener("click", () => {
    disconnectEventStream();
    logEvent("已断开实时状态流");
  });
  el.clearEventsBtn.addEventListener("click", () => {
    el.eventLog.innerHTML = "";
  });

  el.closeStatusModal.addEventListener("click", () => {
    el.statusModal.classList.add("hidden");
  });
  el.statusModal.addEventListener("click", (event) => {
    if (event.target === el.statusModal) {
      el.statusModal.classList.add("hidden");
    }
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
  setLifecyclePhase("");
  el.modeBadge.textContent = "线上模式: REAL";
  updateTxnStatus("IDLE", {});
  connectEventStream();
  logEvent("线上收银台已就绪。系统仅接收 webhook 推送更新状态，不主动订阅终端事件接口。");
}

bootstrap();

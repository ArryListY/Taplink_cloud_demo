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
    path: "/v1/transaction/query",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      transactionRequestId: (activeTxn && activeTxn.transactionRequestId && activeTxn.transactionRequestId !== "-") ? activeTxn.transactionRequestId : ctx.requestId,
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
const FIXED_NOTIFY_WEBHOOK_URL = "http://47.77.239.198/webhook/sunbay";
const FIXED_TERMINAL_EVENT_NOTIFY_URL = "http://47.77.239.198/terminal-events/sunbay";

let selectedApiId = "sale";
let eventSource = null;
let recentEventTimer = null;
let activeTxn = null;
let activeModal = null;
let modalOpener = null;

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
  configEventUrl: document.getElementById("configEventUrl"),
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
  runAuthBtn: document.getElementById("runAuthBtn"),
  queryTxnBtn: document.getElementById("queryTxnBtn"),
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
  modalQueryTxnBtn: document.getElementById("modalQueryTxnBtn"),
  modalRef: document.getElementById("modalRef"),
  modalReq: document.getElementById("modalReq"),
  modalState: document.getElementById("modalState"),
  modalTerminalEvent: document.getElementById("modalTerminalEvent"),
  modalNotifyStatus: document.getElementById("modalNotifyStatus"),
  modalTimeline: document.getElementById("modalTimeline"),
  statusModalTitle: document.getElementById("statusModalTitle"),
  stepPlaced: document.getElementById("stepPlaced"),
  stepPresented: document.getElementById("stepPresented"),
  stepProcessing: document.getElementById("stepProcessing"),
  stepResult: document.getElementById("stepResult"),
  openStatusModalBtn: document.getElementById("openStatusModalBtn"),
  openConfigModalBtn: document.getElementById("openConfigModalBtn"),
  openOpsModalBtn: document.getElementById("openOpsModalBtn"),
  openObserveModalBtn: document.getElementById("openObserveModalBtn"),
  statusPanelModal: document.getElementById("statusPanelModal"),
  configModal: document.getElementById("configModal"),
  opsModal: document.getElementById("opsModal"),
  observeModal: document.getElementById("observeModal"),
};

const PANEL_MODALS = {
  status: el.statusPanelModal,
  config: el.configModal,
  ops: el.opsModal,
  observe: el.observeModal,
};

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

function requestIdUuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
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

function getDefaultBackendUrl() {
  if (typeof window !== "undefined" && window.location && /^https?:$/.test(window.location.protocol)) {
    const host = window.location.hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `${window.location.protocol}//${host}:8000`;
    }
  }
  return "http://127.0.0.1:8000";
}

function getBackendUrl() {
  return (el.backendUrl.value || getDefaultBackendUrl()).trim().replace(/\/$/, "");
}

function getNotifyUrl() {
  return FIXED_NOTIFY_WEBHOOK_URL;
}

function getTerminalEventNotifyUrl() {
  return FIXED_TERMINAL_EVENT_NOTIFY_URL;
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
    notifyUrl: getNotifyUrl(),
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
  el.configEventUrl.value = getTerminalEventNotifyUrl();
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
  openModal(el.statusModal);
}

function appendModalTimeline(text) {
  const row = document.createElement("div");
  row.className = "timeline-item";
  row.textContent = `${new Date().toLocaleTimeString()} ${text}`;
  el.modalTimeline.prepend(row);
}

function hasRequiredFinalCallbacks() {
  return Boolean(activeTxn && activeTxn.terminalEnded && activeTxn.notifyStatus && isFinalTxnStatus(activeTxn.notifyStatus));
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
    if (!hasRequiredFinalCallbacks()) {
      el.txnState.textContent = `已收到结果(${status})，等待双回调确认`;
      el.txnStatusPanel.className = "txn-status processing";
      el.modalState.textContent = `已收到结果(${status})，等待双回调确认`;
      el.statusModalTitle.textContent = "等待交易确认";
      return;
    }
    el.txnState.textContent = `已完成(${status})`;
    el.txnStatusPanel.className = "txn-status success";
    el.modalState.textContent = `已完成(${status})`;
    el.statusModalTitle.textContent = "交易完成";
    setLifecyclePhase("RESULT", false);
    return;
  }
  if (isFailed) {
    if (!hasRequiredFinalCallbacks()) {
      el.txnState.textContent = `已收到结果(${status})，等待双回调确认`;
      el.txnStatusPanel.className = "txn-status processing";
      el.modalState.textContent = `已收到结果(${status})，等待双回调确认`;
      el.statusModalTitle.textContent = "等待交易确认";
      return;
    }
    el.txnState.textContent = `失败/终止(${status})`;
    el.txnStatusPanel.className = "txn-status failed";
    el.modalState.textContent = `失败/终止(${status})`;
    el.statusModalTitle.textContent = "交易失败";
    setLifecyclePhase("RESULT", true);
    return;
  }

  if (status === "TERMINAL_ENDED") {
    el.txnState.textContent = "终端已结束(待交易结果回调)";
    el.txnStatusPanel.className = "txn-status processing";
    el.modalState.textContent = "终端已结束(待交易结果回调)";
    el.statusModalTitle.textContent = "等待最终结果";
    setLifecyclePhase("RESULT", false);
    return;
  }

  el.txnState.textContent = status ? `进行中(${status})` : "处理中";
  el.txnStatusPanel.className = "txn-status processing";
  el.modalState.textContent = status ? `进行中(${status})` : "处理中";
  el.statusModalTitle.textContent = "交易处理中";
}

function applyNotifyFinalState(state, snap, webhookEventType) {
  const normalizedState = String(state || "").toUpperCase();
  if (!activeTxn || !activeTxn.terminalEnded || !isFinalTxnStatus(normalizedState)) {
    appendModalTimeline(`notifyUrl 已收到 transactionStatus=${normalizedState || "-"}，但仍等待双回调条件满足`);
    return;
  }

  activeTxn.notifyStatus = normalizedState;
  updateTxnStatus(normalizedState, {
    referenceOrderId: snap.referenceOrderId || activeTxn.referenceOrderId || "-",
    transactionRequestId: snap.transactionRequestId || activeTxn.transactionRequestId || "-",
  });
  appendModalTimeline(`notifyUrl 最终状态 -> ${normalizedState} (reqId=${snap.transactionRequestId || "-"}, eventType=${webhookEventType})`);
  logEvent(`[notify最终状态] reqId=${snap.transactionRequestId || "-"} eventType=${webhookEventType} status=${normalizedState}`);
  activeTxn.finalFromNotify = true;
  stopRecentEventPolling();
  appendModalTimeline("已满足 TRANSACTION_ENDED + transactionStatus，交易确认结束");
}

function resetModalForTxn(payload) {
  el.modalRef.textContent = payload.referenceOrderId || "-";
  el.modalReq.textContent = payload.transactionRequestId || "-";
  el.modalState.textContent = "进行中";
  el.modalTerminalEvent.textContent = "等待事件";
  el.modalNotifyStatus.textContent = "等待 transactionStatus";
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

function deriveProgressStateFromTerminalEvent(eventType, eventStage) {
  const et = String(eventType || "").toUpperCase();

  // 只有明确的 TRANSACTION_ENDED 才能打开“终端已结束”闸门；eventStage=END 不足以替代协议事件。
  if (et === "TRANSACTION_ENDED") return "TERMINAL_ENDED";
  if (et === "PAYMENT_PRESENTED" || et === "PIN_ENTERING") return "PRESENTED";
  if (["PAYMENT_PROCESSING", "SIGNATURE_CAPTURED", "PRINTING", "PRINT_COMPLETED"].includes(et)) return "PROCESSING";
  if (et === "ORDER_RECEIVED") return "ORDER_RECEIVED";
  return "";
}

function matchActiveTxnByIds(requestId, referenceOrderId, transactionId = "") {
  if (!activeTxn) return true;

  const activeReqId = activeTxn.transactionRequestId && activeTxn.transactionRequestId !== "-" ? activeTxn.transactionRequestId : "";
  const activeRefId = activeTxn.referenceOrderId && activeTxn.referenceOrderId !== "-" ? activeTxn.referenceOrderId : "";
  const activeTxnId = activeTxn.transactionId && activeTxn.transactionId !== "-" ? activeTxn.transactionId : "";

  if (activeReqId && requestId && requestId === activeReqId) return true;
  if (activeRefId && referenceOrderId && referenceOrderId === activeRefId) return true;
  if (activeTxnId && transactionId && transactionId === activeTxnId) return true;

  // 回调可能只携带其中一个业务标识；有标识但全部不匹配时才忽略。
  if (requestId || referenceOrderId || transactionId) return false;
  return false;
}

function normalizeTerminalEventType(value) {
  const normalized = String(value || "").trim().toUpperCase();
  return normalized.startsWith("TERMINAL.") ? normalized.slice("TERMINAL.".length) : normalized;
}

function extractTerminalEventType(parsed, terminalSnapshot) {
  const headerEventType = parsed?.payload?.headers?.["x-event-type"] || parsed?.payload?.headers?.["X-Event-Type"] || "";
  return normalizeTerminalEventType(terminalSnapshot.eventType || headerEventType);
}

function extractTerminalNotifySnapshot(body) {
  const nodes = collectPlainObjects(body);
  let eventType = "";
  let eventStage = "";
  let transactionId = "";
  let transactionRequestId = "";
  let referenceOrderId = "";
  let transactionStatus = "";
  let transactionResultCode = "";

  for (const node of nodes) {
    if (!eventType && node.eventType) eventType = String(node.eventType).toUpperCase();
    if (!eventStage && node.eventStage) eventStage = String(node.eventStage).toUpperCase();
    if (!transactionId && node.transactionId) transactionId = String(node.transactionId);
    if (!transactionRequestId && node.transactionRequestId) transactionRequestId = String(node.transactionRequestId);
    if (!referenceOrderId && node.referenceOrderId) referenceOrderId = String(node.referenceOrderId);
    if (!transactionStatus && node.transactionStatus) transactionStatus = String(node.transactionStatus).toUpperCase();
    if (!transactionResultCode && node.transactionResultCode) transactionResultCode = String(node.transactionResultCode);
  }

  return {
    eventType,
    eventStage,
    transactionId,
    transactionRequestId,
    referenceOrderId,
    transactionStatus,
    transactionResultCode,
  };
}

function extractWebhookTxnSnapshot(body) {
  const nodes = collectPlainObjects(body);
  let transactionId = "";
  let transactionRequestId = "";
  let referenceOrderId = "";
  let transactionStatus = "";
  let transactionResultCode = "";
  let eventType = "";

  for (const node of nodes) {
    if (!transactionId && node.transactionId) transactionId = String(node.transactionId);
    if (!transactionRequestId && node.transactionRequestId) transactionRequestId = String(node.transactionRequestId);
    if (!referenceOrderId && node.referenceOrderId) referenceOrderId = String(node.referenceOrderId);
    if (!transactionStatus && node.transactionStatus) transactionStatus = String(node.transactionStatus).toUpperCase();
    if (!transactionResultCode && node.transactionResultCode) transactionResultCode = String(node.transactionResultCode);
    if (!eventType && node.eventType) eventType = String(node.eventType).toUpperCase();

    if (transactionId && transactionRequestId && referenceOrderId && (transactionStatus || transactionResultCode) && eventType) {
      break;
    }
  }

  return {
    transactionId,
    transactionRequestId,
    referenceOrderId,
    transactionStatus,
    transactionResultCode,
    eventType,
  };
}

function extractWebhookEventType(parsed) {
  const headerEventType = String(parsed?.payload?.headers?.["x-event-type"] || "").toUpperCase();
  if (headerEventType) return headerEventType;

  const body = parsed?.payload?.payload;
  const snap = extractWebhookTxnSnapshot(body);
  if (snap.eventType) return snap.eventType;

  return "TRANSACTION_RESULT";
}

function handleEventData(raw) {
  const parsed = parsePayloadJson(raw);
  if (!parsed || !parsed.type) return;

  if (activeTxn && parsed.ts) {
    const eventKey = `${parsed.type}:${parsed.ts}:${JSON.stringify(parsed.payload || {})}`;
    if (activeTxn.seenEventKeys.has(eventKey)) return;
    activeTxn.seenEventKeys.add(eventKey);
  }

  if (parsed.type === "terminal_notify_received") {
    const body = (parsed.payload && parsed.payload.payload) || {};
    const term = extractTerminalNotifySnapshot(body);
    const eventType = extractTerminalEventType(parsed, term);
    const eventStage = term.eventStage || "";
    const transactionId = term.transactionId || "";
    const requestId = term.transactionRequestId || "";
    const referenceOrderId = term.referenceOrderId || "";
    const matchesTxn = matchActiveTxnByIds(requestId, referenceOrderId, transactionId);

    if (matchesTxn) {
      if (activeTxn && transactionId) {
        activeTxn.transactionId = transactionId;
      }
      if (eventType) {
        el.modalTerminalEvent.textContent = eventType;
        applyLifecycleByEventType(eventType);
        appendModalTimeline(`terminalEventNotifyUrl event -> ${eventType} (reqId=${requestId || "-"})`);
        logEvent(`[terminal事件] reqId=${requestId || "-"} eventType=${String(eventType || "-").toUpperCase()} stage=${String(eventStage || "-").toUpperCase()}`);
      }

      const progressState = deriveProgressStateFromTerminalEvent(eventType, eventStage);
      const visibleProgressState = progressState || (eventType ? `EVENT_${eventType}` : "");
      if (visibleProgressState) {
        updateTxnStatus(progressState, {
          referenceOrderId: referenceOrderId || (activeTxn && activeTxn.referenceOrderId) || "-",
          transactionRequestId: requestId || (activeTxn && activeTxn.transactionRequestId) || "-",
        });
        if (!progressState) {
          updateTxnStatus(visibleProgressState, {
            referenceOrderId: referenceOrderId || (activeTxn && activeTxn.referenceOrderId) || "-",
            transactionRequestId: requestId || (activeTxn && activeTxn.transactionRequestId) || "-",
          });
        }
        appendModalTimeline(`terminalEventNotifyUrl 阶段 -> ${visibleProgressState} (reqId=${requestId || "-"})`);
      }

      if (activeTxn && progressState === "TERMINAL_ENDED") {
        activeTxn.terminalEnded = true;
        appendModalTimeline("终端事件已结束，等待 notifyUrl 回调最终交易结果");
        if (activeTxn.pendingNotifyState) {
          applyNotifyFinalState(
            activeTxn.pendingNotifyState,
            {
              transactionRequestId: activeTxn.transactionRequestId,
              referenceOrderId: activeTxn.referenceOrderId,
            },
            activeTxn.pendingNotifyEventType || "TRANSACTION_RESULT",
          );
          activeTxn.pendingNotifyState = "";
          activeTxn.pendingNotifyEventType = "";
        }
      }
    } else if (eventType || requestId || transactionId) {
      logEvent(`[terminal忽略] 当前交易reqId=${activeTxn?.transactionRequestId || "-"} 收到reqId=${requestId || "-"} txnId=${transactionId || "-"} eventType=${eventType || "-"}`);
    }
  }

  if (parsed.type === "webhook_received") {
    const body = (parsed.payload && parsed.payload.payload) || {};
    if (body && body.test === true) {
      appendModalTimeline("收到 webhook 测试通知，已忽略");
      logEvent("[webhook测试] payload.test=true，未更新交易状态");
      return;
    }
    const snap = extractWebhookTxnSnapshot(body);
    const matchesTxn = matchActiveTxnByIds(snap.transactionRequestId, snap.referenceOrderId, snap.transactionId);
    if (matchesTxn) {
      if (activeTxn && snap.transactionId) {
        activeTxn.transactionId = snap.transactionId;
      }
      if (activeTxn && snap.referenceOrderId) {
        activeTxn.referenceOrderId = snap.referenceOrderId;
      }
      if (activeTxn && snap.transactionRequestId) {
        activeTxn.transactionRequestId = snap.transactionRequestId;
      }

      if (!snap.transactionStatus) {
        appendModalTimeline("notifyUrl 已收到回调，但缺少 transactionStatus；不会据此结束交易");
        logEvent(`[notify忽略] reqId=${snap.transactionRequestId || "-"} 缺少 transactionStatus`);
        return;
      }

      const state = snap.transactionStatus;
      el.modalNotifyStatus.textContent = state;
      const webhookEventType = extractWebhookEventType(parsed);

      if (activeTxn && !activeTxn.terminalEnded) {
        activeTxn.pendingNotifyState = state;
        activeTxn.pendingNotifyEventType = webhookEventType;
        appendModalTimeline(`notifyUrl transactionStatus -> ${state} (reqId=${snap.transactionRequestId || "-"})`);
        appendModalTimeline("已收到交易结果，但等待 terminalEventNotifyUrl 的 TRANSACTION_ENDED");
        logEvent(`[notify待确认] reqId=${snap.transactionRequestId || "-"} eventType=${webhookEventType} status=${state}`);
      } else {
        applyNotifyFinalState(state, snap, webhookEventType);
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

function openModal(modal, opener = document.activeElement) {
  if (!modal) return;
  if (activeModal && activeModal !== modal) closeModal(activeModal, false);
  activeModal = modal;
  modalOpener = opener instanceof HTMLElement ? opener : null;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    if (activeModal === modal) modal.classList.add("is-open");
  });
  const dismissControl = modal.querySelector(".icon-button, .modal-actions-row [data-modal-close]");
  if (dismissControl instanceof HTMLElement) {
    window.setTimeout(() => dismissControl.focus(), 210);
  }
}

function closeModal(modal = activeModal, restoreFocus = true) {
  if (!modal || modal.classList.contains("hidden")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (activeModal === modal) activeModal = null;
  window.setTimeout(() => {
    if (!modal.classList.contains("is-open")) modal.classList.add("hidden");
  }, 190);
  if (restoreFocus && modalOpener && document.contains(modalOpener)) {
    const opener = modalOpener;
    modalOpener = null;
    window.setTimeout(() => opener.focus(), 200);
  }
}

function openPanelModal(sectionKey, opener) {
  openModal(PANEL_MODALS[sectionKey], opener);
}

function collectPlainObjects(root, maxNodes = 40) {
  const out = [];
  const queue = [root];
  while (queue.length && out.length < maxNodes) {
    const cur = queue.shift();
    if (!cur || typeof cur !== "object" || Array.isArray(cur)) continue;
    out.push(cur);
    for (const value of Object.values(cur)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        queue.push(value);
      }
    }
  }
  return out;
}

function extractStatusFromQueryResponse(root) {
  const nodes = collectPlainObjects(root);
  for (const node of nodes) {
    const direct = node.transactionStatus || node.status || "";
    if (direct) return String(direct).toUpperCase();

    const resultCode = node.transactionResultCode || node.resultCode || "";
    if (String(resultCode) === "000") return "S";
    if (resultCode) return "F";
  }
  return "";
}

function extractTxnIdsFromResponse(root) {
  const nodes = collectPlainObjects(root);
  let transactionId = "";
  let referenceOrderId = "";
  let transactionRequestId = "";
  for (const node of nodes) {
    if (!transactionId && node.transactionId) {
      transactionId = String(node.transactionId);
    }
    if (!referenceOrderId && node.referenceOrderId) {
      referenceOrderId = String(node.referenceOrderId);
    }
    if (!transactionRequestId && node.transactionRequestId) {
      transactionRequestId = String(node.transactionRequestId);
    }
    if (transactionId && referenceOrderId && transactionRequestId) break;
  }
  return { transactionId, referenceOrderId, transactionRequestId };
}

function extractCodeMessageFromResponse(root) {
  const nodes = collectPlainObjects(root);
  let code = "";
  let msg = "";
  for (const node of nodes) {
    if (!code && node.code) code = String(node.code);
    if (!msg && node.msg) msg = String(node.msg);
    if (code && msg) break;
  }
  return { code, msg };
}

async function proxyQueryTransaction(headers, queryPayload) {
  const response = await fetch(`${getBackendUrl()}/api/proxy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "real",
      base_url: getBaseUrl(),
      method: "GET",
      path: "/v1/transaction/query",
      headers,
      payload: {},
      query: queryPayload,
    }),
  });

  const raw = await response.text();
  let data = raw;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  return { response, data };
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
  stopRecentEventPolling();
  setEventBadge("idle");
}

function stopRecentEventPolling() {
  if (recentEventTimer) {
    clearInterval(recentEventTimer);
    recentEventTimer = null;
  }
}

async function replayRecentEventsForActiveTxn() {
  if (!activeTxn || activeTxn.finalFromNotify) return;
  try {
    const response = await fetch(`${getBackendUrl()}/api/events/recent`);
    if (!response.ok) return;
    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    let replayed = 0;
    for (const item of items) {
      if (item && (item.type === "terminal_notify_received" || item.type === "webhook_received")) {
        const before = activeTxn.seenEventKeys.size;
        handleEventData(JSON.stringify(item));
        if (activeTxn.seenEventKeys.size > before) replayed += 1;
      }
    }
    if (replayed) {
      logEvent(`已回放 ${replayed} 条服务端回调事件，补齐可能错过的实时通知`);
    }
  } catch (err) {
    logEvent(`回放服务端事件失败: ${err.message || "unknown"}`);
  }
}

function startRecentEventPolling() {
  if (recentEventTimer) clearInterval(recentEventTimer);
  recentEventTimer = setInterval(() => {
    void replayRecentEventsForActiveTxn();
  }, 1500);
}

async function runSupplementQuery() {
  if (!activeTxn || (!activeTxn.transactionId && !activeTxn.transactionRequestId)) {
    appendModalTimeline("暂无可查询交易，请先发起交易");
    return;
  }

  const transactionId = activeTxn.transactionId && activeTxn.transactionId !== "-" ? activeTxn.transactionId : "";
  const transactionRequestId = activeTxn.transactionRequestId && activeTxn.transactionRequestId !== "-" ? activeTxn.transactionRequestId : "";

  const headers = {
    "X-Timestamp": `${Date.now()}`,
    "X-Client-Request-Id": requestIdUuid(),
  };
  const auth = buildAuthorization();
  if (auth) headers.Authorization = auth;

  el.queryTxnBtn.disabled = true;
  el.queryTxnBtn.textContent = "查询中...";
  el.modalQueryTxnBtn.disabled = true;
  el.modalQueryTxnBtn.textContent = "查询中...";
  appendModalTimeline("发起补充查询: /v1/transaction/query");

  try {
    const attempts = [
      {
        label: "transactionId",
        query: {
          appId: el.appId.value,
          merchantId: el.merchantId.value,
          transactionId,
        },
      },
      {
        label: "transactionRequestId",
        query: {
          appId: el.appId.value,
          merchantId: el.merchantId.value,
          transactionRequestId,
        },
      },
    ].filter((item) => item.query.transactionId || item.query.transactionRequestId);

    let matchedStatus = "";
    let lastResult = null;

    for (const attempt of attempts) {
      const { response, data } = await proxyQueryTransaction(headers, attempt.query);
      const wrapped = {
        mode: "real",
        endpoint: "GET /v1/transaction/query",
        attempt: attempt.label,
        httpStatus: response.status,
        ok: response.ok,
        data,
      };
      el.responsePayload.value = JSON.stringify(wrapped, null, 2);
      appendModalTimeline(`补充查询(${attempt.label})响应 HTTP ${response.status}`);

      lastResult = data;
      const statusFromQuery = extractStatusFromQueryResponse(data);
      const idsFromQuery = extractTxnIdsFromResponse(data);

      if (activeTxn) {
        if (idsFromQuery.transactionId) activeTxn.transactionId = idsFromQuery.transactionId;
        if (idsFromQuery.referenceOrderId) activeTxn.referenceOrderId = idsFromQuery.referenceOrderId;
        if (idsFromQuery.transactionRequestId) activeTxn.transactionRequestId = idsFromQuery.transactionRequestId;
      }

      if (statusFromQuery) {
        matchedStatus = statusFromQuery;
        break;
      }
    }

    if (matchedStatus) {
      appendModalTimeline(`查询观察到状态 -> ${matchedStatus}；查询结果不会替代 notifyUrl.transactionStatus`);
      logEvent(`[查询仅供参考] status=${matchedStatus}，等待双回调确认`);
    } else {
      const idsFromQuery = extractTxnIdsFromResponse(lastResult || {});
      const queryCodeInfo = extractCodeMessageFromResponse(lastResult || {});
      if (activeTxn) {
        if (idsFromQuery.transactionId) activeTxn.transactionId = idsFromQuery.transactionId;
        if (idsFromQuery.referenceOrderId) activeTxn.referenceOrderId = idsFromQuery.referenceOrderId;
        if (idsFromQuery.transactionRequestId) activeTxn.transactionRequestId = idsFromQuery.transactionRequestId;
      }
      if (queryCodeInfo.code && (!activeTxn || !activeTxn.finalFromNotify)) {
        const tip = queryCodeInfo.msg ? `${queryCodeInfo.code}:${queryCodeInfo.msg}` : queryCodeInfo.code;
        el.txnState.textContent = `待回调(查询:${tip})`;
        el.modalState.textContent = `待回调(查询:${tip})`;
        el.txnStatusPanel.className = "txn-status processing";
      }
      appendModalTimeline("查询未返回可识别交易状态，已保留当前状态");
    }
  } catch (err) {
    appendModalTimeline(`补充查询失败: ${err.message || "unknown"}`);
  } finally {
    el.queryTxnBtn.disabled = false;
    el.queryTxnBtn.textContent = "补充查询交易结果";
    el.modalQueryTxnBtn.disabled = false;
    el.modalQueryTxnBtn.textContent = "补充查询";
  }
}

async function runRequest(apiId = selectedApiId) {
  selectedApiId = apiId;
  const api = selectedApi();

  if (api.id === "query") {
    await runSupplementQuery();
    return;
  }

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
    transactionId: "-",
    referenceOrderId: payload.referenceOrderId || "-",
    transactionRequestId: payload.transactionRequestId || "-",
    terminalEnded: false,
    notifyStatus: "",
    finalFromNotify: false,
    pendingNotifyState: "",
    pendingNotifyEventType: "",
    seenEventKeys: new Set(),
  };
  updateTxnStatus("PROCESSING", activeTxn);
  resetModalForTxn(activeTxn);

  connectEventStream();
  void replayRecentEventsForActiveTxn();
  startRecentEventPolling();

  el.runBtn.disabled = true;
  el.runAuthBtn.disabled = true;
  el.runBtn.textContent = "执行中...";

  const headers = {
    "Content-Type": "application/json",
    "X-Timestamp": `${Date.now()}`,
    "X-Client-Request-Id": requestIdUuid(),
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

    const idsFromResp = extractTxnIdsFromResponse(data);
    if (activeTxn) {
      if (idsFromResp.transactionId) activeTxn.transactionId = idsFromResp.transactionId;
      if (idsFromResp.referenceOrderId) activeTxn.referenceOrderId = idsFromResp.referenceOrderId;
      if (idsFromResp.transactionRequestId) activeTxn.transactionRequestId = idsFromResp.transactionRequestId;
    }

    appendModalTimeline(`网关响应 HTTP ${response.status}`);
    logEvent(`HTTP ${response.status}: ${api.method} ${api.path}`);
  } catch (err) {
    el.responsePayload.value = JSON.stringify({
      mode: "real",
      endpoint: `${api.method} ${api.path}`,
      error: err.message || "请求失败",
    }, null, 2);
    appendModalTimeline(`请求失败: ${err.message || "unknown"}；通信失败不代表交易失败，仍等待服务端回调`);
    logEvent(`请求失败: ${api.method} ${api.path}，未将其标记为交易失败`);
    updateTxnStatus("PROCESSING", activeTxn || {});
  } finally {
    el.runBtn.disabled = false;
    el.runAuthBtn.disabled = false;
    el.runBtn.textContent = "Sale · 收款";
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
  el.runBtn.addEventListener("click", () => {
    rebuildRequest("sale");
    runRequest("sale");
  });
  el.runAuthBtn.addEventListener("click", () => {
    rebuildRequest("auth");
    runRequest("auth");
  });
  el.queryTxnBtn.addEventListener("click", runSupplementQuery);
  el.modalQueryTxnBtn.addEventListener("click", runSupplementQuery);

  el.openStatusModalBtn.addEventListener("click", (event) => openPanelModal("status", event.currentTarget));
  el.openConfigModalBtn.addEventListener("click", (event) => openPanelModal("config", event.currentTarget));
  el.openOpsModalBtn.addEventListener("click", (event) => openPanelModal("ops", event.currentTarget));
  el.openObserveModalBtn.addEventListener("click", (event) => openPanelModal("observe", event.currentTarget));
  [...Object.values(PANEL_MODALS), el.statusModal].forEach((modal) => {
    modal.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-modal-close]")) closeModal(modal);
    });
  });

  el.subBtn.addEventListener("click", connectEventStream);
  el.unsubBtn.addEventListener("click", () => {
    disconnectEventStream();
    logEvent("已断开实时状态流");
  });
  el.clearEventsBtn.addEventListener("click", () => {
    el.eventLog.innerHTML = "";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  el.secondaryApi.addEventListener("change", () => {
    rebuildRequest(el.secondaryApi.value);
  });
}

function bootstrap() {
  loadPersistedConfig();
  const defaultBackendUrl = getDefaultBackendUrl();
  if (el.backendUrl.value === "http://127.0.0.1:8000" && defaultBackendUrl !== "http://127.0.0.1:8000") {
    el.backendUrl.value = defaultBackendUrl;
    persistConfig();
  }
  renderProducts();
  renderSecondaryMenu();
  renderLinks();
  computeAmount();
  el.notifyUrl.value = getNotifyUrl();
  el.eventUrl.value = getTerminalEventNotifyUrl();
  el.configEventUrl.value = getTerminalEventNotifyUrl();
  rebuildRequest("sale");
  bindEvents();
  setEventBadge("idle");
  setLifecyclePhase("");
  el.modeBadge.textContent = "线上模式: REAL";
  updateTxnStatus("IDLE", {});
  el.queryTxnBtn.disabled = false;
  connectEventStream();
  logEvent("线上收银台已就绪。系统仅接收 webhook 推送更新状态，不主动订阅终端事件接口。");
}

bootstrap();

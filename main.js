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
  { id: "p1", name: "Americano", icon: "☕️", desc: "Fresh pulled espresso with hot water", priceCents: 550, qty: 0 },
  { id: "p2", name: "Blueberry Muffin", icon: "🧁", desc: "Freshly baked every morning", priceCents: 420, qty: 0 },
  { id: "p3", name: "Croissant", icon: "🥐", desc: "Classic buttery French pastry", priceCents: 390, qty: 0 },
  { id: "p4", name: "Cold Brew", icon: "🧊", desc: "Slow steeped for 24 hours", priceCents: 680, qty: 0 },
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
  loadingLifecycle: document.getElementById("loadingLifecycle"),
  currentEventStep: document.getElementById("currentEventStep"),
  currentEventTitle: document.getElementById("currentEventTitle"),
  currentEventSub: document.getElementById("currentEventSub"),
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
  if (el.menuGrid) el.menuGrid.innerHTML = "";
  if (el.cartList) el.cartList.innerHTML = "";

  for (const p of PRODUCTS) {
    if (el.menuGrid) {
      const node = document.createElement("div");
      node.className = "menu-card";
      node.innerHTML = `
        <div class="menu-icon">${p.icon}</div>
        <div class="menu-info">
           <h4>${p.name}</h4>
           <p>${p.desc}</p>
           <div class="menu-action">
              <span class="price">${formatMoney(p.priceCents)}</span>
              ${p.qty === 0 
                  ? `<button class="add-btn" data-op="add" data-id="${p.id}" type="button">Add</button>` 
                  : `<div class="stepper-ui"><button data-op="sub" data-id="${p.id}" type="button">-</button><span>${p.qty}</span><button data-op="add" data-id="${p.id}" type="button">+</button></div>`
              }
           </div>
        </div>
      `;
      el.menuGrid.appendChild(node);
    }
    
    if (el.cartList && p.qty > 0) {
      const cnode = document.createElement("div");
      cnode.className = "cart-item";
      cnode.innerHTML = `
          <div class="cart-item-info">
             <div class="cart-item-icon">${p.icon}</div>
             <div>
                <div class="cart-item-name">${p.name}</div>
                <div class="cart-item-price">${formatMoney(p.priceCents)}</div>
             </div>
          </div>
          <div class="stepper-mini">
              <button data-op="sub" data-id="${p.id}" type="button">-</button>
              <span>${p.qty}</span>
              <button data-op="add" data-id="${p.id}" type="button">+</button>
          </div>
      `;
      el.cartList.appendChild(cnode);
    }
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

function applyLifecycleByEventType(eventType) {
  const et = String(eventType || "").toUpperCase();
  if (!et) return;
  
  if (el.currentEventTitle) {
      // Just keep it simple & professional
      el.currentEventTitle.textContent = "Processing Payment";
  }
  
  const descMap = {
      "ORDER_RECEIVED": "Cloud Connected",
      "PAYMENT_PRESENTED": "Waiting for Payment",
      "PIN_ENTERING": "Waiting for Payment",
      "PAYMENT_PROCESSING": "Processing",
      "SIGNATURE_CAPTURED": "Processing",
      "PRINTING": "Processing",
      "PRINT_COMPLETED": "Processing",
      "TRANSACTION_ENDED": "Finalizing..."
  };
  
  if (el.currentEventSub) {
      el.currentEventSub.textContent = descMap[et] || "Processing";
  }
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
  if(document.getElementById("modalReq")) document.getElementById("modalReq").textContent = el.txnReq.textContent;

  if (isSuccess) {
    el.txnState.textContent = `Completed (${status})`;
    el.txnStatusPanel.className = "txn-status success";
    if (el.loadingLifecycle) el.loadingLifecycle.style.display = "none";
    if (document.getElementById("errorView")) document.getElementById("errorView").style.display = "none";
    
    // Show success view
    const successView = document.getElementById("successView");
    if(successView) {
        successView.style.display = "block";
        document.getElementById("successAmountText").textContent = formatMoney(activeTxn ? (activeTxn.reqAmount ? activeTxn.reqAmount.orderAmount : 0) : 0);
    }
    return;
  }
  
  if (isFailed) {
    el.txnState.textContent = `Failed/Aborted (${status})`;
    el.txnStatusPanel.className = "txn-status failed";
    if (el.loadingLifecycle) el.loadingLifecycle.style.display = "none";
    if (document.getElementById("successView")) document.getElementById("successView").style.display = "none";
    
    // Show error view
    const errorView = document.getElementById("errorView");
    if(errorView) {
        errorView.style.display = "block";
    }
    return;
  }

  el.txnState.textContent = status ? `Processing (${status})` : "Processing";
  el.txnStatusPanel.className = "txn-status processing";
  
  // Show loading view
  if (el.loadingLifecycle) el.loadingLifecycle.style.display = "flex";
  if (document.getElementById("successView")) document.getElementById("successView").style.display = "none";
  if (document.getElementById("errorView")) document.getElementById("errorView").style.display = "none";
}

function applyNotifyFinalState(state, snap, webhookEventType) {
  const normalizedState = String(state || "").toUpperCase();

  activeTxn.notifyStatus = normalizedState;
  updateTxnStatus(normalizedState, {
    referenceOrderId: snap.referenceOrderId || activeTxn.referenceOrderId || "-",
    transactionRequestId: snap.transactionRequestId || activeTxn.transactionRequestId || "-",
  });
  appendModalTimeline(`收到服务器状态回调 -> ${normalizedState} (reqId=${snap.transactionRequestId || "-"}, eventType=${webhookEventType})`);
  logEvent(`[notify最终状态] reqId=${snap.transactionRequestId || "-"} eventType=${webhookEventType} status=${normalizedState}`);
  activeTxn.finalFromNotify = true;
  stopRecentEventPolling();
  appendModalTimeline("交易由服务器状态回调或查询结果结束");
}

function resetModalForTxn(payload) {
  el.modalRef.textContent = payload.referenceOrderId || "-";
  if(document.getElementById("modalReq")) document.getElementById("modalReq").textContent = payload.transactionRequestId || "-";
  el.modalState.textContent = "Processing";
  if(document.getElementById("modalTerminalEvent")) document.getElementById("modalTerminalEvent").textContent = "Waiting for Event";
  
  if (el.loadingLifecycle) el.loadingLifecycle.style.display = "flex";
  if (document.getElementById("successView")) document.getElementById("successView").style.display = "none";
  if (document.getElementById("errorView")) document.getElementById("errorView").style.display = "none";
  if (el.currentEventTitle) el.currentEventTitle.textContent = "Processing Payment";
  if (el.currentEventSub) el.currentEventSub.textContent = "Connecting payment terminal...";

  appendModalTimeline("Transaction initiated...");
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
        appendModalTimeline("终端事件已结束，等待最终交易结果");
      }
    } else if (eventType || requestId || transactionId) {
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

      if (false) {
        activeTxn.pendingNotifyState = state;
        activeTxn.pendingNotifyEventType = webhookEventType;
        appendModalTimeline(`notifyUrl transactionStatus -> ${state} (reqId=${snap.transactionRequestId || "-"})`);
        appendModalTimeline("已收到交易结果，但等待 terminalEventNotifyUrl 的 TRANSACTION_ENDED");
        logEvent(`[notify待确认] reqId=${snap.transactionRequestId || "-"} eventType=${webhookEventType} status=${state}`);
      if (statusFromQuery) {
        matchedStatus = statusFromQuery;
        break;
      }
    }

    if (matchedStatus) {
      appendModalTimeline(`查询观察到状态 -> ${matchedStatus}；依据此查询结果直接更新交易状态`);
      logEvent(`[查询更新状态] status=${matchedStatus}`);
      applyNotifyFinalState(matchedStatus, activeTxn, "MANUAL_QUERY");
    } else {
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
  el.runBtn.innerHTML = "Processing...";

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
    el.runBtn.innerHTML = `Pay <span id="payBtnAmount">${formatMoney(computeAmount().grandTotal)}</span>`;
  }
}

function bindEvents() {
  const handleProductClick = (event) => {
    const target = event.target.closest("button[data-op]");
    if (!target) return;
    const product = PRODUCTS.find((p) => p.id === target.dataset.id);
    if (!product) return;
    if (target.dataset.op === "add") product.qty += 1;
    if (target.dataset.op === "sub") product.qty = Math.max(0, product.qty - 1);
    renderProducts();
    computeAmount();
    rebuildRequest(selectedApiId);
  };
  
  if(el.menuGrid) el.menuGrid.addEventListener("click", handleProductClick);
  if(el.cartList) el.cartList.addEventListener("click", handleProductClick);

  if(el.goToCheckoutBtn) {
      el.goToCheckoutBtn.addEventListener("click", () => {
          el.menuView.classList.add("hidden");
          el.floatingCart.classList.add("hidden");
          el.checkoutView.classList.remove("hidden");
          window.scrollTo(0, 0);
      });
  }

  if(el.backToMenuBtn) {
      el.backToMenuBtn.addEventListener("click", () => {
          el.checkoutView.classList.add("hidden");
          el.menuView.classList.remove("hidden");
          computeAmount(); 
          window.scrollTo(0, 0);
      });
  }

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

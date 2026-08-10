const API_ITEMS = [
  {
    id: "sale",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/sale",
    summary: "Sale",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      description: ctx.description,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "auth",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/auth",
    summary: "Auth",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      description: ctx.description,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "forced-auth",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/forced-auth",
    summary: "Forced Auth",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      description: ctx.description,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "incremental-auth",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/incremental-auth",
    summary: "Incremental Auth",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: { orderAmount: ctx.amount.orderAmount, priceCurrency: ctx.amount.priceCurrency },
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "post-auth",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/post-auth",
    summary: "Post Auth",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: ctx.amount,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "refund",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/refund",
    summary: "Refund",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: { orderAmount: ctx.amount.orderAmount, priceCurrency: ctx.amount.priceCurrency },
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
      reason: "Customer request",
    }),
  },
  {
    id: "void",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/void",
    summary: "Void",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "abort",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/abort",
    summary: "Abort",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      terminalSn: ctx.terminalSn,
      reason: "USER_CANCEL",
    }),
  },
  {
    id: "tip-adjust",
    group: "In-Person / Semi-Integration",
    method: "POST",
    path: "/v1/semi-integration/transaction/tip-adjust",
    summary: "Tip Adjust",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      transactionRequestId: ctx.requestId,
      amount: {
        tipAmount: ctx.amount.tipAmount,
        priceCurrency: ctx.amount.priceCurrency,
      },
      terminalSn: ctx.terminalSn,
      notifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "batch-query",
    group: "In-Person / Settlement",
    method: "GET",
    path: "/v1/semi-integration/settlement/batch-query",
    summary: "Batch Query",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      terminalSn: ctx.terminalSn,
      date: new Date().toISOString().slice(0, 10),
    }),
  },
  {
    id: "batch-close",
    group: "In-Person / Settlement",
    method: "POST",
    path: "/v1/semi-integration/settlement/batch-close",
    summary: "Batch Close",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      transactionRequestId: ctx.requestId,
      terminalSn: ctx.terminalSn,
      printReceipt: "AUTO",
      notifyUrl: ctx.notifyUrl,
    }),
  },
  {
    id: "query",
    group: "In-Person / Query",
    method: "GET",
    path: "/v1/semi-integration/query",
    summary: "Query Transaction",
    build: (ctx) => ({
      appId: ctx.appId,
      merchantId: ctx.merchantId,
      referenceOrderId: ctx.orderId,
      terminalSn: ctx.terminalSn,
    }),
  },
  {
    id: "checkout-create-session",
    group: "Online / Checkout",
    method: "POST",
    path: "/v1/checkout/create-session",
    summary: "Create Checkout Session",
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
    }),
  },
  {
    id: "checkout-sale",
    group: "Online / Direct Payment",
    method: "POST",
    path: "/v1/payment",
    summary: "Direct Payment",
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
    }),
  },
  {
    id: "checkout-refund",
    group: "Online / Refund",
    method: "POST",
    path: "/v1/refund",
    summary: "Online Refund",
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
    title: "线下支付 API",
    links: [
      ["Sale", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/sale"],
      ["Auth", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/auth"],
      ["Forced Auth", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/forced-auth"],
      ["Incremental Auth", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/incremental-auth"],
      ["Post Auth", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/post-auth"],
      ["Refund", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/refund"],
      ["Void", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/void"],
      ["Abort", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/abort"],
      ["Tip Adjust", "https://docs.sunbay.us/zh/refspec/in-person/semi-integration/tip-adjust"],
    ],
  },
  {
    title: "线上支付 API",
    links: [
      ["创建支付会话", "https://docs.sunbay.us/zh/refspec/online/checkout/checkout-api-integration"],
      ["主动关闭会话", "https://docs.sunbay.us/zh/refspec/online/checkout/expire-session"],
      ["直接支付", "https://docs.sunbay.us/zh/refspec/online/direct-payment"],
      ["线上退款", "https://docs.sunbay.us/zh/refspec/online/refund"],
    ],
  },
  {
    title: "查询与商户能力",
    links: [
      ["查询交易明细", "https://docs.sunbay.us/zh/refspec/query/query-transaction"],
      ["查询商户信息", "https://docs.sunbay.us/zh/refspec/merchants/retrieve-merchant"],
      ["查询商户终端列表", "https://docs.sunbay.us/zh/refspec/merchants/list-merchant-terminals"],
      ["下载交易对账单", "https://docs.sunbay.us/zh/refspec/reconciliation/transaction-statement"],
      ["下载结算对账单", "https://docs.sunbay.us/zh/refspec/reconciliation/settlement-statement"],
    ],
  },
];

const PRODUCTS = [
  { id: "p1", name: "Americano", priceCents: 550, qty: 1 },
  { id: "p2", name: "Blueberry Muffin", priceCents: 420, qty: 0 },
  { id: "p3", name: "Croissant", priceCents: 390, qty: 0 },
  { id: "p4", name: "Cold Brew", priceCents: 680, qty: 0 },
];

let selectedApiId = API_ITEMS[0].id;
let eventTimer = null;
let eventSource = null;

const el = {
  runMode: document.getElementById("runMode"),
  envType: document.getElementById("envType"),
  customBaseUrl: document.getElementById("customBaseUrl"),
  apiKey: document.getElementById("apiKey"),
  appId: document.getElementById("appId"),
  merchantId: document.getElementById("merchantId"),
  terminalSn: document.getElementById("terminalSn"),
  currency: document.getElementById("currency"),
  notifyUrl: document.getElementById("notifyUrl"),
  returnUrl: document.getElementById("returnUrl"),
  taxAmount: document.getElementById("taxAmount"),
  tipAmount: document.getElementById("tipAmount"),
  surchargeAmount: document.getElementById("surchargeAmount"),
  productList: document.getElementById("productList"),
  orderAmountText: document.getElementById("orderAmountText"),
  totalAmountText: document.getElementById("totalAmountText"),
  apiList: document.getElementById("apiList"),
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
};

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

function cents(value) {
  return Math.max(0, Number(value) || 0);
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

function computeAmount() {
  const orderAmount = PRODUCTS.reduce((sum, p) => sum + p.priceCents * p.qty, 0);
  const taxAmount = cents(el.taxAmount.value);
  const tipAmount = cents(el.tipAmount.value);
  const surchargeAmount = cents(el.surchargeAmount.value);
  const totalAmount = orderAmount + taxAmount + tipAmount + surchargeAmount;

  el.orderAmountText.textContent = formatMoney(orderAmount);
  el.totalAmountText.textContent = formatMoney(totalAmount);

  return {
    orderAmount,
    taxAmount,
    tipAmount,
    surchargeAmount,
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
  const list = productListPayload();
  const description = list.length
    ? list.map((it) => `${it.name} x${it.num}`).join(", ")
    : "Cloud checkout payment";

  return {
    appId: el.appId.value,
    merchantId: el.merchantId.value,
    terminalSn: el.terminalSn.value,
    notifyUrl: el.notifyUrl.value,
    returnUrl: el.returnUrl.value,
    amount,
    description,
    productList: list,
    orderId: uid("ORDER"),
    requestId: uid("REQ"),
  };
}

function groupedApis() {
  const map = new Map();
  for (const item of API_ITEMS) {
    if (!map.has(item.group)) map.set(item.group, []);
    map.get(item.group).push(item);
  }
  return Array.from(map.entries());
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

function renderApiList() {
  el.apiList.innerHTML = "";
  for (const [group, list] of groupedApis()) {
    const title = document.createElement("div");
    title.className = "api-group";
    title.textContent = group;
    el.apiList.appendChild(title);

    for (const api of list) {
      const b = document.createElement("button");
      b.className = `api-item ${api.id === selectedApiId ? "active" : ""}`;
      b.type = "button";
      b.dataset.id = api.id;
      b.innerHTML = `
        <span class="method ${api.method.toLowerCase()}">${api.method}</span>
        <span>
          <strong>${api.summary}</strong>
          <span class="path">${api.path}</span>
        </span>
      `;
      el.apiList.appendChild(b);
    }
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

function selectedApi() {
  return API_ITEMS.find((api) => api.id === selectedApiId) || API_ITEMS[0];
}

function rebuildRequest() {
  const api = selectedApi();
  const ctx = buildContext();
  const body = api.build(ctx);
  el.requestPayload.value = JSON.stringify(body, null, 2);
  el.endpointHint.textContent = `${api.method} ${getBaseUrl()}${api.path}`;
}

function setModeBadge() {
  const mode = el.runMode.value.toUpperCase();
  el.modeBadge.textContent = `Mode: ${mode}`;
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

function parsePayload() {
  const text = el.requestPayload.value.trim();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("请求载荷不是有效 JSON");
  }
}

async function runRequest() {
  const api = selectedApi();
  const mode = el.runMode.value;
  let payload;

  try {
    payload = parsePayload();
  } catch (err) {
    el.responsePayload.value = JSON.stringify({ error: err.message }, null, 2);
    return;
  }

  el.runBtn.disabled = true;
  el.runBtn.textContent = "执行中...";

  if (mode === "mock") {
    await new Promise((r) => setTimeout(r, 450));
    const mock = {
      mode: "mock",
      endpoint: `${api.method} ${api.path}`,
      acceptedAt: new Date().toISOString(),
      note: "请求已受理（不代表交易成功），请通过事件流或 query 接口确认最终状态",
      requestPreview: payload,
      transactionId: uid("TXN"),
      status: "PROCESSING",
    };
    el.responsePayload.value = JSON.stringify(mock, null, 2);
    logEvent(`请求已派发: ${api.method} ${api.path}`);
    el.runBtn.disabled = false;
    el.runBtn.textContent = "执行接口";
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Timestamp": `${Date.now()}`,
    "X-Client-Request-Id": uid("CID"),
  };

  if (el.apiKey.value.trim()) {
    headers.Authorization = `Bearer ${el.apiKey.value.trim()}`;
  }

  const url = `${getBaseUrl()}${api.path}`;
  try {
    const res = await fetch(url, {
      method: api.method,
      headers,
      body: api.method === "GET" ? undefined : JSON.stringify(payload),
    });
    const raw = await res.text();
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
        httpStatus: res.status,
        ok: res.ok,
        data,
      },
      null,
      2
    );
    logEvent(`HTTP ${res.status}: ${api.method} ${api.path}`);
  } catch (err) {
    el.responsePayload.value = JSON.stringify(
      {
        mode: "real",
        endpoint: `${api.method} ${api.path}`,
        error: err.message || "请求失败",
      },
      null,
      2
    );
    logEvent("真实请求失败，请检查 CORS、鉴权和网络可达性");
  } finally {
    el.runBtn.disabled = false;
    el.runBtn.textContent = "执行接口";
  }
}

function stopEvents() {
  if (eventTimer) {
    clearInterval(eventTimer);
    eventTimer = null;
  }
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}

function subscribeEvents() {
  stopEvents();
  setEventBadge("connecting");
  logEvent("开始订阅终端事件");

  const mode = el.runMode.value;
  if (mode === "mock") {
    const seq = [
      "REQUEST_DISPATCHED",
      "TERMINAL_ONLINE",
      "CARD_TAPPED",
      "PIN_ENTRY",
      "ONLINE_PROCESSING",
      "APPROVED",
    ];
    let index = 0;
    setEventBadge("connected");
    logEvent("Mock 事件连接成功");
    eventTimer = setInterval(() => {
      logEvent(`[${el.terminalSn.value}] ${seq[index % seq.length]}`);
      index += 1;
    }, 1400);
    return;
  }

  try {
    const eventUrl = el.eventUrl.value.trim();
    const base = eventUrl.startsWith("http") ? eventUrl : `${getBaseUrl()}${eventUrl}`;
    const sep = base.includes("?") ? "&" : "?";
    const full = `${base}${sep}merchantId=${encodeURIComponent(el.merchantId.value)}&terminalSn=${encodeURIComponent(el.terminalSn.value)}`;

    eventSource = new EventSource(full);
    eventSource.onopen = () => {
      setEventBadge("connected");
      logEvent(`SSE connected: ${full}`);
    };
    eventSource.onmessage = (ev) => {
      logEvent(`[${el.terminalSn.value}] ${ev.data}`);
    };
    eventSource.onerror = () => {
      setEventBadge("error");
      logEvent("SSE 连接异常，请检查事件地址、鉴权和跨域");
    };
  } catch {
    setEventBadge("error");
    logEvent("创建事件订阅失败");
  }
}

function bindEvents() {
  el.productList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName !== "BUTTON") return;

    const id = target.dataset.id;
    const op = target.dataset.op;
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    if (op === "add") product.qty += 1;
    if (op === "sub") product.qty = Math.max(0, product.qty - 1);

    renderProducts();
    computeAmount();
    rebuildRequest();
  });

  el.apiList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button.api-item");
    if (!button) return;
    selectedApiId = button.dataset.id;
    renderApiList();
    rebuildRequest();
  });

  [
    el.runMode,
    el.envType,
    el.customBaseUrl,
    el.appId,
    el.merchantId,
    el.terminalSn,
    el.currency,
    el.notifyUrl,
    el.returnUrl,
    el.taxAmount,
    el.tipAmount,
    el.surchargeAmount,
  ].forEach((node) => {
    node.addEventListener("input", () => {
      setModeBadge();
      computeAmount();
      rebuildRequest();
    });
    node.addEventListener("change", () => {
      setModeBadge();
      computeAmount();
      rebuildRequest();
    });
  });

  el.rebuildBtn.addEventListener("click", rebuildRequest);
  el.runBtn.addEventListener("click", runRequest);

  el.subBtn.addEventListener("click", subscribeEvents);
  el.unsubBtn.addEventListener("click", () => {
    stopEvents();
    setEventBadge("idle");
    logEvent("终端事件订阅已停止");
  });
  el.clearEventsBtn.addEventListener("click", () => {
    el.eventLog.innerHTML = "";
  });
}

function bootstrap() {
  renderProducts();
  renderApiList();
  renderLinks();
  setModeBadge();
  setEventBadge("idle");
  computeAmount();
  rebuildRequest();
  bindEvents();
  logEvent("Demo 已就绪。建议先用 Mock 模式验证流程，再切换 Real 模式。\n提示：onSuccess 不等于 approved，请结合 Query/事件流确认终态。");
}

bootstrap();

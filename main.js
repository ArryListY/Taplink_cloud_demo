// ============================================================
// SUNBAY Coffee Store - Cloud Demo
// UI logic aligned with taplinkdemo/app-compose module
// Views: Menu → Checkout → Progress → Detail → History
// ============================================================

// === Constants ===
const FIXED_NOTIFY_WEBHOOK_URL = 'http://47.77.239.198/webhook/sunbay';
const FIXED_TERMINAL_EVENT_NOTIFY_URL = 'http://47.77.239.198/terminal-events/sunbay';
const STORAGE_KEY = 'taplink_cloud_demo_config_v2';
const HISTORY_STORAGE_KEY = 'taplink_cloud_demo_history_v1';

const PRODUCTS = [
  { id: 'p1', name: 'Americano', icon: '☕️', desc: 'Fresh pulled espresso with hot water', priceCents: 550 },
  { id: 'p2', name: 'Blueberry Muffin', icon: '🧁', desc: 'Freshly baked every morning', priceCents: 420 },
  { id: 'p3', name: 'Croissant', icon: '🥐', desc: 'Classic buttery French pastry', priceCents: 390 },
  { id: 'p4', name: 'Cold Brew', icon: '🧊', desc: 'Slow steeped for 24 hours', priceCents: 680 },
];

// === App State (MVI-like) ===
const AppView = { MENU: 'menu', CHECKOUT: 'checkout', PROGRESS: 'progress', DETAIL: 'detail', HISTORY: 'history' };
const TxnStatus = { PENDING: 'PENDING', PROCESSING: 'PROCESSING', SUCCESS: 'SUCCESS', FAILED: 'FAILED' };

let currentView = AppView.MENU;
let cart = {}; // { productId: qty }
let transactions = []; // All transaction records
let activeTxn = null; // Current active transaction
let currentDetailTxnId = null; // Transaction ID being viewed in detail
let historyFilter = 'all';
let eventSource = null;
let recentEventTimer = null;

// === DOM Elements ===
const el = {};
function initElements() {
  const ids = [
    'menuView', 'checkoutView', 'progressView', 'detailView', 'historyView',
    'menuGrid', 'floatingCart', 'cartCountBadge', 'cartTotalFloat', 'goToCheckoutBtn',
    'backToMenuBtn', 'checkoutCartList', 'checkoutSubtotal', 'checkoutTax', 'checkoutTotal', 'payBtn', 'payBtnAmount',
    'progressType', 'progressAmount', 'progressTitle', 'progressSubtitle', 'progressTimeline', 'abortBtn',
    'detailResult', 'detailFields', 'detailActions',
    'historyBackBtn', 'historyFilters', 'historyList', 'historyEmpty', 'historyBtn',
    'devConsole', 'openDevConsoleBtn', 'closeDevConsoleBtn',
    'txnRef', 'txnReq', 'txnState', 'txnStatusPanel', 'queryTxnBtn',
    'eventBadge', 'subBtn', 'unsubBtn', 'clearEventsBtn', 'eventLog',
    'openConfigModalBtn', 'configModal',
    'backendUrl', 'envType', 'customBaseUrl', 'apiKey', 'appId', 'merchantId', 'terminalSn', 'currency', 'notifyUrl', 'configEventUrl', 'returnUrl',
  ];
  ids.forEach(id => { el[id] = document.getElementById(id); });
}

// === Utility Functions ===
function uid(prefix) { return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`; }

function formatMoney(cents) {
  const cur = getConfig().currency || 'USD';
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(cents / 100); }
  catch { return `${(cents / 100).toFixed(2)} ${cur}`; }
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(ts) {
  return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getConfig() {
  return {
    backendUrl: (el.backendUrl?.value || getDefaultBackendUrl()).trim().replace(/\/$/, ''),
    baseUrl: getBaseUrl(),
    apiKey: el.apiKey?.value || '',
    appId: el.appId?.value || '',
    merchantId: el.merchantId?.value || '',
    terminalSn: el.terminalSn?.value || '',
    currency: (el.currency?.value || 'USD').toUpperCase(),
    returnUrl: el.returnUrl?.value || '',
  };
}

function getDefaultBackendUrl() {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return 'http://127.0.0.1:8000';
    return `${window.location.protocol}//${host}:8000`;
  }
  return 'http://127.0.0.1:8000';
}

function getBaseUrl() {
  const env = el.envType?.value || 'uat';
  if (env === 'uat') return 'https://open.sunbay-uat.us';
  if (env === 'production') return 'https://open.sunbay.us';
  if (env === 'sandbox') return 'https://open-sandbox.sunbay.us';
  return el.customBaseUrl?.value || '';
}

function buildAuth() {
  const key = (el.apiKey?.value || '').trim();
  if (!key) return '';
  return key.startsWith('Bearer ') ? key : `Bearer ${key}`;
}

function getCartTotal() {
  return Object.entries(cart).reduce((sum, [pid, qty]) => {
    const p = PRODUCTS.find(x => x.id === pid);
    return sum + (p ? p.priceCents * qty : 0);
  }, 0);
}

function getCartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

// === Persistence ===
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const cfg = JSON.parse(raw);
    if (cfg.backendUrl && el.backendUrl) el.backendUrl.value = cfg.backendUrl;
    if (cfg.envType && el.envType) el.envType.value = cfg.envType;
    if (cfg.customBaseUrl && el.customBaseUrl) el.customBaseUrl.value = cfg.customBaseUrl;
    if (cfg.apiKey && el.apiKey) el.apiKey.value = cfg.apiKey;
    if (cfg.appId && el.appId) el.appId.value = cfg.appId;
    if (cfg.merchantId && el.merchantId) el.merchantId.value = cfg.merchantId;
    if (cfg.terminalSn && el.terminalSn) el.terminalSn.value = cfg.terminalSn;
    if (cfg.currency && el.currency) el.currency.value = cfg.currency;
    if (cfg.returnUrl && el.returnUrl) el.returnUrl.value = cfg.returnUrl;
  } catch { /* ignore */ }
}

function saveConfig() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      backendUrl: el.backendUrl?.value, envType: el.envType?.value, customBaseUrl: el.customBaseUrl?.value,
      apiKey: el.apiKey?.value, appId: el.appId?.value, merchantId: el.merchantId?.value,
      terminalSn: el.terminalSn?.value, currency: el.currency?.value, returnUrl: el.returnUrl?.value,
    }));
  } catch { /* ignore */ }
}

function loadTransactions() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) transactions = JSON.parse(raw);
  } catch { transactions = []; }
}

function saveTransactions() {
  try { localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(transactions)); } catch { /* ignore */ }
}

// ============================================================
// View Navigation & Rendering
// ============================================================

function navigateTo(view, opts = {}) {
  currentView = view;
  const views = ['menuView', 'checkoutView', 'progressView', 'detailView', 'historyView'];
  views.forEach(v => { if (el[v]) el[v].classList.add('hidden'); });
  
  // Show/hide floating cart only on menu view
  if (el.floatingCart) {
    if (view === AppView.MENU && getCartCount() > 0) el.floatingCart.classList.remove('hidden');
    else el.floatingCart.classList.add('hidden');
  }

  switch (view) {
    case AppView.MENU:
      el.menuView.classList.remove('hidden');
      renderMenu();
      break;
    case AppView.CHECKOUT:
      el.checkoutView.classList.remove('hidden');
      renderCheckout();
      break;
    case AppView.PROGRESS:
      el.progressView.classList.remove('hidden');
      renderProgress();
      break;
    case AppView.DETAIL:
      currentDetailTxnId = opts.txnId || currentDetailTxnId;
      el.detailView.classList.remove('hidden');
      renderDetail();
      break;
    case AppView.HISTORY:
      el.historyView.classList.remove('hidden');
      renderHistory();
      break;
  }
}

// --- Menu Rendering ---
function renderMenu() {
  if (!el.menuGrid) return;
  el.menuGrid.innerHTML = '';
  for (const p of PRODUCTS) {
    const qty = cart[p.id] || 0;
    const node = document.createElement('div');
    node.className = 'menu-card';
    node.innerHTML = `
      <div class="menu-icon">${p.icon}</div>
      <div class="menu-info">
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <div class="menu-action">
          <span class="price">${formatMoney(p.priceCents)}</span>
          ${qty === 0
            ? `<button class="add-btn" data-op="add" data-id="${p.id}" type="button">Add</button>`
            : `<div class="stepper-ui"><button data-op="sub" data-id="${p.id}" type="button">−</button><span>${qty}</span><button data-op="add" data-id="${p.id}" type="button">+</button></div>`
          }
        </div>
      </div>`;
    el.menuGrid.appendChild(node);
  }
  updateFloatingCart();
}

function updateFloatingCart() {
  const count = getCartCount();
  const total = getCartTotal();
  if (el.cartCountBadge) el.cartCountBadge.textContent = count;
  if (el.cartTotalFloat) el.cartTotalFloat.textContent = formatMoney(total);
  if (el.floatingCart) {
    if (count > 0 && currentView === AppView.MENU) el.floatingCart.classList.remove('hidden');
    else el.floatingCart.classList.add('hidden');
  }
}

// --- Checkout Rendering ---
function renderCheckout() {
  if (!el.checkoutCartList) return;
  el.checkoutCartList.innerHTML = '';
  let subtotal = 0;
  for (const [pid, qty] of Object.entries(cart)) {
    if (qty <= 0) continue;
    const p = PRODUCTS.find(x => x.id === pid);
    if (!p) continue;
    subtotal += p.priceCents * qty;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-icon">${p.icon}</div>
        <div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${formatMoney(p.priceCents)} × ${qty}</div>
        </div>
      </div>
      <div class="cart-item-qty">${formatMoney(p.priceCents * qty)}</div>`;
    el.checkoutCartList.appendChild(item);
  }
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;
  if (el.checkoutSubtotal) el.checkoutSubtotal.textContent = formatMoney(subtotal);
  if (el.checkoutTax) el.checkoutTax.textContent = formatMoney(tax);
  if (el.checkoutTotal) el.checkoutTotal.textContent = formatMoney(total);
  if (el.payBtnAmount) el.payBtnAmount.textContent = formatMoney(total);
  if (el.payBtn) el.payBtn.disabled = total <= 0;
}

// --- Progress Rendering ---
function renderProgress() {
  if (!activeTxn) return;
  if (el.progressType) el.progressType.textContent = activeTxn.type || 'Sale';
  if (el.progressAmount) el.progressAmount.textContent = formatMoney(activeTxn.totalCents || 0);
  
  const status = activeTxn.status;
  const spinner = document.querySelector('.progress-spinner');
  
  if (status === TxnStatus.SUCCESS) {
    if (el.progressTitle) el.progressTitle.textContent = 'Payment Successful';
    if (el.progressSubtitle) el.progressSubtitle.textContent = 'Transaction completed.';
    if (spinner) { spinner.classList.add('done'); spinner.classList.remove('error'); }
    if (el.abortBtn) el.abortBtn.classList.add('hidden');
    showViewDetailBtn();
  } else if (status === TxnStatus.FAILED) {
    if (el.progressTitle) el.progressTitle.textContent = 'Payment Failed';
    if (el.progressSubtitle) el.progressSubtitle.textContent = activeTxn.errorMessage || 'Transaction was declined or aborted.';
    if (spinner) { spinner.classList.add('error'); spinner.classList.remove('done'); }
    if (el.abortBtn) el.abortBtn.classList.add('hidden');
    showViewDetailBtn();
  } else {
    if (el.progressTitle) el.progressTitle.textContent = 'Processing Payment';
    if (el.progressSubtitle) el.progressSubtitle.textContent = activeTxn.progressMessage || 'Connecting to payment terminal...';
    if (spinner) { spinner.classList.remove('done', 'error'); }
    if (el.abortBtn) {
      el.abortBtn.classList.remove('hidden');
      el.abortBtn.disabled = false;
      el.abortBtn.textContent = activeTxn.channel === 'online' ? 'Close Session' : 'Abort Transaction';
    }
    removeViewDetailBtn();
  }
}

function showViewDetailBtn() {
  if (document.getElementById('viewDetailBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'viewDetailBtn';
  btn.className = 'view-detail-btn';
  btn.textContent = 'View Details';
  btn.onclick = () => navigateTo(AppView.DETAIL, { txnId: activeTxn?.id });
  el.progressView.querySelector('.progress-actions')?.appendChild(btn);
}

function removeViewDetailBtn() {
  const btn = document.getElementById('viewDetailBtn');
  if (btn) btn.remove();
}

function addTimelineItem(text) {
  if (!el.progressTimeline) return;
  const item = document.createElement('div');
  item.className = 'timeline-item';
  item.innerHTML = `<span class="timeline-time">${formatTime(Date.now())}</span><span class="timeline-text">${text}</span>`;
  el.progressTimeline.prepend(item);
}

// --- Detail Rendering ---
function renderDetail() {
  const txn = transactions.find(t => t.id === currentDetailTxnId);
  if (!txn) { navigateTo(AppView.MENU); return; }

  // Result icon
  let iconClass = 'processing', iconChar = '⏳', title = 'Processing', subtitle = '';
  if (txn.status === TxnStatus.SUCCESS) { iconClass = 'success'; iconChar = '✓'; title = 'Payment Successful'; }
  else if (txn.status === TxnStatus.FAILED) { iconClass = 'error'; iconChar = '✕'; title = 'Payment Failed'; subtitle = txn.errorMessage || ''; }

  el.detailResult.innerHTML = `
    <div class="result-icon ${iconClass}">${iconChar}</div>
    <h2>${title}</h2>
    ${subtitle ? `<p class="text-muted">${subtitle}</p>` : ''}
    <div class="result-amount">${formatMoney(txn.totalCents || 0)}</div>`;

  // Fields
  const fields = [
    ['Type', txn.type || 'Sale'],
    ['Status', txn.status],
    ['Order ID', txn.orderId || '-'],
    ['Request ID', txn.requestId || '-'],
    ['Transaction ID', txn.transactionId || '-'],
    ['Created', formatDate(txn.createdAt)],
  ];
  if (txn.result?.transactionResultCode) fields.push(['Result Code', txn.result.transactionResultCode]);
  if (txn.result?.cardBrand) fields.push(['Card Brand', txn.result.cardBrand]);
  if (txn.result?.maskedPan) fields.push(['Card Number', txn.result.maskedPan]);

  el.detailFields.innerHTML = fields.map(([label, value]) =>
    `<div class="detail-field"><span class="detail-field-label">${label}</span><span class="detail-field-value">${value}</span></div>`
  ).join('');

  // Actions
  let actionsHtml = '';
  if (txn.status === TxnStatus.SUCCESS) {
    if (txn.channel === 'online') {
      actionsHtml += `<button class="primary-btn refund-btn" id="detailExpireBtn" type="button">Close Session (Expire)</button>`;
    } else {
      actionsHtml += `<button class="primary-btn refund-btn" id="detailRefundBtn" type="button">Refund</button>`;
    }
  }
  if (txn.status === TxnStatus.PROCESSING) {
    if (txn.channel === 'online') {
      actionsHtml += `<button class="primary-btn refund-btn" id="detailExpireBtn" type="button">Close Session (Expire)</button>`;
    } else {
      actionsHtml += `<button class="primary-btn refund-btn" id="detailAbortBtn" type="button">Abort</button>`;
    }
  }
  actionsHtml += `<button class="ghost-btn" id="detailQueryBtn" type="button">Query Status</button>`;
  actionsHtml += `<button class="ghost-btn" id="detailBackBtn" type="button">Back to Menu</button>`;
  actionsHtml += `<button class="ghost-btn" id="detailHistoryBtn" type="button">View All Transactions</button>`;
  el.detailActions.innerHTML = actionsHtml;

  // Bind detail action events
  document.getElementById('detailRefundBtn')?.addEventListener('click', () => executeRefund(txn));
  document.getElementById('detailExpireBtn')?.addEventListener('click', () => executeExpireSession(txn));
  document.getElementById('detailAbortBtn')?.addEventListener('click', () => { activeTxn = txn; executeAbort(); });
  document.getElementById('detailQueryBtn')?.addEventListener('click', () => executeQuery(txn));
  document.getElementById('detailBackBtn')?.addEventListener('click', () => { cart = {}; navigateTo(AppView.MENU); });
  document.getElementById('detailHistoryBtn')?.addEventListener('click', () => navigateTo(AppView.HISTORY));
}

// --- History Rendering ---
function renderHistory() {
  if (!el.historyList) return;
  const filtered = historyFilter === 'all' ? transactions : transactions.filter(t => t.status === historyFilter);
  
  if (filtered.length === 0) {
    el.historyList.innerHTML = `<div class="empty-state"><span class="empty-icon">📋</span><p>No transactions yet</p></div>`;
    return;
  }

  el.historyList.innerHTML = filtered.sort((a, b) => b.createdAt - a.createdAt).map(txn => {
    const statusClass = txn.status === TxnStatus.SUCCESS ? 'success' : txn.status === TxnStatus.FAILED ? 'error' : txn.status === TxnStatus.PROCESSING ? 'processing' : 'pending';
    return `
      <div class="history-card" data-txn-id="${txn.id}">
        <div class="history-card-status ${statusClass}"></div>
        <div class="history-card-body">
          <div class="history-card-title">${txn.type || 'Sale'} <span class="status-badge ${statusClass}">${txn.status}</span></div>
          <div class="history-card-sub">${txn.requestId || '-'}</div>
        </div>
        <div class="history-card-right">
          <div class="history-card-amount">${formatMoney(txn.totalCents || 0)}</div>
          <div class="history-card-time">${formatDate(txn.createdAt)}</div>
        </div>
      </div>`;
  }).join('');
}

// ============================================================
// API Calls (via /api/proxy → SUNBAY Cloud)
// ============================================================

async function callProxy(method, path, payload, query = {}) {
  const cfg = getConfig();
  const headers = { 'Content-Type': 'application/json', 'X-Timestamp': `${Date.now()}`, 'X-Client-Request-Id': uid('CID') };
  const auth = buildAuth();
  if (auth) headers['Authorization'] = auth;

  const body = {
    mode: 'real',
    base_url: cfg.baseUrl,
    method,
    path,
    headers,
    payload: method === 'GET' ? {} : payload,
    query: method === 'GET' ? payload : query,
  };

  const response = await fetch(`${cfg.backendUrl || window.location.origin}/api/proxy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
}

// --- Get selected payment channel ---
function getSelectedChannel() {
  const radio = document.querySelector('input[name="payChannel"]:checked');
  return radio ? radio.value : 'terminal';
}

// --- Execute Sale (Terminal: semi-integration) ---
async function executeSale() {
  const cfg = getConfig();
  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const orderId = uid('ORDER');
  const requestId = uid('REQ');
  const productList = Object.entries(cart).filter(([, q]) => q > 0).map(([pid, qty]) => {
    const p = PRODUCTS.find(x => x.id === pid);
    return { amount: p.priceCents * qty, name: p.name, num: qty };
  });
  const description = productList.map(it => `${it.name} x${it.num}`).join(', ');

  // Create transaction record
  const txn = {
    id: requestId,
    orderId,
    requestId,
    transactionId: null,
    type: 'Sale',
    channel: 'terminal', // 'terminal' = semi-integration, 'online' = checkout session
    totalCents: total,
    amount: { orderAmount: total, taxAmount: tax, tipAmount: 0, surchargeAmount: 0, totalAmount: total, priceCurrency: cfg.currency },
    status: TxnStatus.PROCESSING,
    progressMessage: 'Sending to terminal...',
    errorMessage: null,
    events: [],
    result: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
    terminalEnded: false,
    notifyStatus: null,
    seenEventKeys: [],
  };

  activeTxn = txn;
  transactions.push(txn);
  saveTransactions();

  // Navigate to progress
  navigateTo(AppView.PROGRESS);
  addTimelineItem('Transaction initiated');

  // Connect SSE
  connectEventStream();
  startRecentEventPolling();

  // Update dev console
  updateDevConsole();

  const payload = {
    appId: cfg.appId,
    merchantId: cfg.merchantId,
    referenceOrderId: orderId,
    transactionRequestId: requestId,
    amount: txn.amount,
    description,
    terminalSn: cfg.terminalSn,
    notifyUrl: FIXED_NOTIFY_WEBHOOK_URL,
    terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL,
  };

  try {
    const result = await callProxy('POST', '/v1/semi-integration/transaction/sale', payload);
    addTimelineItem(`Gateway responded: HTTP ${result.httpStatus || '?'}`);
    logEvent(`HTTP ${result.httpStatus}: POST /v1/semi-integration/transaction/sale`);

    // Extract IDs from response
    const ids = extractIdsFromResponse(result.data);
    if (ids.transactionId) { txn.transactionId = ids.transactionId; }
    if (ids.transactionRequestId) { txn.requestId = ids.transactionRequestId; }
    updateDevConsole();
  } catch (err) {
    addTimelineItem(`Request failed: ${err.message}. Waiting for webhook callback...`);
    logEvent(`Request failed: ${err.message}`);
  }
}

// --- Execute Online Checkout (Create Checkout Session) ---
async function executeOnlineCheckout() {
  const cfg = getConfig();
  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const orderId = uid('ORDER');
  const requestId = uid('REQ');
  const productList = Object.entries(cart).filter(([, q]) => q > 0).map(([pid, qty]) => {
    const p = PRODUCTS.find(x => x.id === pid);
    return { amount: p.priceCents * qty, name: p.name, num: qty };
  });
  const description = productList.map(it => `${it.name} x${it.num}`).join(', ');

  // Create transaction record
  const txn = {
    id: requestId,
    orderId,
    requestId,
    transactionId: null,
    type: 'Checkout Session',
    channel: 'online', // online checkout session
    totalCents: total,
    amount: { orderAmount: total, taxAmount: tax, tipAmount: 0, surchargeAmount: 0, totalAmount: total, priceCurrency: cfg.currency },
    status: TxnStatus.PROCESSING,
    progressMessage: 'Creating checkout session...',
    errorMessage: null,
    events: [],
    result: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
    terminalEnded: false,
    notifyStatus: null,
    seenEventKeys: [],
  };

  activeTxn = txn;
  transactions.push(txn);
  saveTransactions();

  navigateTo(AppView.PROGRESS);
  addTimelineItem('Creating online checkout session...');
  connectEventStream();
  startRecentEventPolling();
  updateDevConsole();

  const payload = {
    appId: cfg.appId,
    merchantId: cfg.merchantId,
    referenceOrderId: orderId,
    transactionRequestId: requestId,
    amount: txn.amount,
    description,
    productList,
    merchantReturnUrl: cfg.returnUrl,
    notifyUrl: FIXED_NOTIFY_WEBHOOK_URL,
    terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL,
  };

  try {
    const result = await callProxy('POST', '/v1/checkout/create-session', payload);
    addTimelineItem(`Gateway responded: HTTP ${result.httpStatus || '?'}`);
    logEvent(`HTTP ${result.httpStatus}: POST /v1/checkout/create-session`);

    const ids = extractIdsFromResponse(result.data);
    if (ids.transactionId) { txn.transactionId = ids.transactionId; }
    if (ids.transactionRequestId) { txn.requestId = ids.transactionRequestId; }

    // Extract checkout URL if present
    const nodes = collectPlainObjects(result.data);
    for (const node of nodes) {
      if (node.checkoutUrl) { txn.checkoutUrl = node.checkoutUrl; break; }
    }

    updateDevConsole();
  } catch (err) {
    addTimelineItem(`Request failed: ${err.message}. Waiting for webhook callback...`);
    logEvent(`Request failed: ${err.message}`);
  }
}

// --- Execute Abort (channel-aware) ---
// Terminal transactions: POST /v1/semi-integration/transaction/abort
// Online transactions:  POST /v1/checkout/expire-session
async function executeAbort() {
  if (!activeTxn) return;
  const cfg = getConfig();
  const isOnline = activeTxn.channel === 'online';

  if (el.abortBtn) { el.abortBtn.disabled = true; el.abortBtn.textContent = isOnline ? 'Closing session...' : 'Aborting...'; }
  addTimelineItem(isOnline ? 'Sending expire-session request...' : 'Sending abort request...');

  let path, payload;
  if (isOnline) {
    // Online checkout: expire/close the session
    path = '/v1/checkout/expire-session';
    payload = {
      appId: cfg.appId,
      merchantId: cfg.merchantId,
      transactionRequestId: activeTxn.requestId || undefined,
      referenceOrderId: activeTxn.orderId || undefined,
    };
  } else {
    // Terminal semi-integration: abort the transaction
    path = '/v1/semi-integration/transaction/abort';
    payload = {
      appId: cfg.appId,
      merchantId: cfg.merchantId,
      terminalSn: cfg.terminalSn,
      originalTransactionId: activeTxn.transactionId || undefined,
      originalTransactionRequestId: activeTxn.requestId || undefined,
      description: 'User cancelled',
    };
  }

  try {
    const result = await callProxy('POST', path, payload);
    addTimelineItem(`${isOnline ? 'Expire-session' : 'Abort'} response: HTTP ${result.httpStatus || '?'}`);
    logEvent(`${isOnline ? 'Expire-session' : 'Abort'} response: HTTP ${result.httpStatus}`);

    // Mark as failed
    activeTxn.status = TxnStatus.FAILED;
    activeTxn.errorMessage = isOnline ? 'Checkout session expired/closed' : 'Transaction aborted by user';
    activeTxn.updatedAt = Date.now();
    saveTransactions();
    renderProgress();
    updateDevConsole();
  } catch (err) {
    addTimelineItem(`${isOnline ? 'Expire-session' : 'Abort'} failed: ${err.message}`);
    if (el.abortBtn) { el.abortBtn.disabled = false; el.abortBtn.textContent = isOnline ? 'Close Session' : 'Abort Transaction'; }
  }
}

// --- Execute Expire Session (Close online checkout) ---
// POST /v1/checkout/expire-session
async function executeExpireSession(txn) {
  if (!txn) return;
  const cfg = getConfig();

  const btn = document.getElementById('detailExpireBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Closing...'; }

  const payload = {
    appId: cfg.appId,
    merchantId: cfg.merchantId,
    transactionRequestId: txn.requestId || undefined,
    referenceOrderId: txn.orderId || undefined,
  };

  try {
    const result = await callProxy('POST', '/v1/checkout/expire-session', payload);
    logEvent(`Expire-session response: HTTP ${result.httpStatus}`);

    txn.status = TxnStatus.FAILED;
    txn.errorMessage = 'Checkout session expired/closed';
    txn.updatedAt = Date.now();
    saveTransactions();
    renderDetail();
    updateDevConsole();
  } catch (err) {
    logEvent(`Expire-session failed: ${err.message}`);
    if (btn) { btn.disabled = false; btn.textContent = 'Close Session (Expire)'; }
  }
}

// --- Execute Refund / Close (for terminal transactions) ---
async function executeRefund(txn) {
  if (!txn) return;
  const cfg = getConfig();

  const btn = document.getElementById('detailRefundBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

  const payload = {
    appId: cfg.appId,
    merchantId: cfg.merchantId,
    referenceOrderId: uid('ORDER'),
    transactionRequestId: uid('REQ'),
    amount: { orderAmount: txn.totalCents, priceCurrency: cfg.currency },
    originalTransactionId: txn.transactionId || undefined,
    originalTransactionRequestId: txn.requestId || undefined,
    reason: 'Customer request',
    notifyUrl: FIXED_NOTIFY_WEBHOOK_URL,
    terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL,
  };

  try {
    // Use /v1/refund for online, /v1/semi-integration/transaction/refund for semi-integrated
    const path = '/v1/semi-integration/transaction/refund';
    const result = await callProxy('POST', path, payload);
    logEvent(`Refund response: HTTP ${result.httpStatus}`);

    if (result.ok || result.httpStatus === 200) {
      // Create refund transaction record
      const refundTxn = {
        id: payload.transactionRequestId,
        orderId: payload.referenceOrderId,
        requestId: payload.transactionRequestId,
        transactionId: null,
        type: 'Refund',
        totalCents: txn.totalCents,
        amount: payload.amount,
        status: TxnStatus.PROCESSING,
        progressMessage: 'Refund processing...',
        errorMessage: null,
        events: [],
        result: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        terminalEnded: false,
        notifyStatus: null,
        seenEventKeys: [],
      };
      transactions.push(refundTxn);
      saveTransactions();
      activeTxn = refundTxn;
      navigateTo(AppView.PROGRESS);
      addTimelineItem('Refund request sent');
    }
  } catch (err) {
    logEvent(`Refund failed: ${err.message}`);
    if (btn) { btn.disabled = false; btn.textContent = 'Refund / Close'; }
  }
}

// --- Execute Query ---
async function executeQuery(txn) {
  if (!txn) return;
  const cfg = getConfig();

  const queryBtn = document.getElementById('detailQueryBtn') || el.queryTxnBtn;
  if (queryBtn) { queryBtn.disabled = true; queryBtn.textContent = 'Querying...'; }

  const payload = {
    appId: cfg.appId,
    merchantId: cfg.merchantId,
    transactionRequestId: txn.requestId,
  };

  try {
    const result = await callProxy('GET', '/v1/transaction/query', payload);
    logEvent(`Query response: HTTP ${result.httpStatus}`);

    const status = extractStatusFromResponse(result.data);
    if (status) {
      txn.status = status;
      txn.updatedAt = Date.now();
      const ids = extractIdsFromResponse(result.data);
      if (ids.transactionId) txn.transactionId = ids.transactionId;
      saveTransactions();
      renderDetail();
      updateDevConsole();
    }
  } catch (err) {
    logEvent(`Query failed: ${err.message}`);
  } finally {
    if (queryBtn) { queryBtn.disabled = false; queryBtn.textContent = queryBtn.id === 'queryTxnBtn' ? 'Manual Query' : 'Query Status'; }
  }
}

// === Response Parsing Helpers ===
function extractIdsFromResponse(data) {
  const result = { transactionId: '', transactionRequestId: '', referenceOrderId: '' };
  if (!data) return result;
  const nodes = collectPlainObjects(data);
  for (const node of nodes) {
    if (!result.transactionId && node.transactionId) result.transactionId = String(node.transactionId);
    if (!result.transactionRequestId && node.transactionRequestId) result.transactionRequestId = String(node.transactionRequestId);
    if (!result.referenceOrderId && node.referenceOrderId) result.referenceOrderId = String(node.referenceOrderId);
  }
  return result;
}

function extractStatusFromResponse(data) {
  if (!data) return null;
  const nodes = collectPlainObjects(data);
  for (const node of nodes) {
    const s = node.transactionStatus || node.status;
    if (s) {
      const upper = String(s).toUpperCase();
      if (['S', 'SUCCESS', 'APPROVED', 'COMPLETED'].includes(upper)) return TxnStatus.SUCCESS;
      if (['F', 'FAILED', 'DECLINED', 'CANCELLED', 'VOIDED', 'ABORTED'].includes(upper)) return TxnStatus.FAILED;
      if (['P', 'I', 'PROCESSING'].includes(upper)) return TxnStatus.PROCESSING;
    }
  }
  return null;
}

function collectPlainObjects(obj, acc = []) {
  if (!obj || typeof obj !== 'object') return acc;
  if (Array.isArray(obj)) { obj.forEach(item => collectPlainObjects(item, acc)); }
  else { acc.push(obj); Object.values(obj).forEach(v => { if (v && typeof v === 'object') collectPlainObjects(v, acc); }); }
  return acc;
}

// ============================================================
// SSE Event Stream & Webhook Handling
// ============================================================

function connectEventStream() {
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) return;
  const cfg = getConfig();
  try {
    eventSource = new EventSource(`${cfg.backendUrl || window.location.origin}/api/events/stream`);
    eventSource.onopen = () => setEventBadge('connected');
    eventSource.onerror = () => setEventBadge('error');
    eventSource.onmessage = (e) => handleEventData(e.data);
    eventSource.addEventListener('terminal_notify_received', (e) => handleEventData(e.data));
    eventSource.addEventListener('webhook_received', (e) => handleEventData(e.data));
    eventSource.addEventListener('api_response', (e) => handleEventData(e.data));
    setEventBadge('connected');
  } catch { setEventBadge('error'); }
}

function disconnectEventStream() {
  if (eventSource) { eventSource.close(); eventSource = null; }
  setEventBadge('idle');
  stopRecentEventPolling();
}

function startRecentEventPolling() {
  stopRecentEventPolling();
  recentEventTimer = setInterval(() => replayRecentEvents(), 3000);
}

function stopRecentEventPolling() {
  if (recentEventTimer) { clearInterval(recentEventTimer); recentEventTimer = null; }
}

async function replayRecentEvents() {
  if (!activeTxn || activeTxn.status === TxnStatus.SUCCESS || activeTxn.status === TxnStatus.FAILED) {
    stopRecentEventPolling();
    return;
  }
  try {
    const cfg = getConfig();
    const resp = await fetch(`${cfg.backendUrl}/api/events/recent`);
    const data = await resp.json();
    if (data.items) data.items.forEach(item => handleEventData(JSON.stringify(item)));
  } catch { /* ignore */ }
}

function handleEventData(raw) {
  let parsed;
  try { parsed = JSON.parse(raw); } catch { return; }
  if (!parsed || !parsed.type) return;
  if (!activeTxn) return;

  // Dedup
  const eventKey = `${parsed.type}:${parsed.ts}`;
  if (activeTxn.seenEventKeys.includes(eventKey)) return;
  activeTxn.seenEventKeys.push(eventKey);
  if (activeTxn.seenEventKeys.length > 500) activeTxn.seenEventKeys = activeTxn.seenEventKeys.slice(-200);

  if (parsed.type === 'terminal_notify_received') {
    handleTerminalEvent(parsed);
  } else if (parsed.type === 'webhook_received') {
    handleWebhookEvent(parsed);
  }
}

function handleTerminalEvent(parsed) {
  const body = parsed?.payload?.payload || {};
  const snap = extractTerminalSnapshot(body);
  const eventType = snap.eventType || '';

  // Match by IDs
  if (!matchesActiveTxn(snap.transactionRequestId, snap.referenceOrderId, snap.transactionId)) return;

  if (snap.transactionId && activeTxn) activeTxn.transactionId = snap.transactionId;

  if (eventType) {
    const desc = terminalEventDescription(eventType);
    if (currentView === AppView.PROGRESS) {
      addTimelineItem(`Terminal: ${eventType}${desc ? ' - ' + desc : ''}`);
      if (el.progressSubtitle) el.progressSubtitle.textContent = desc || eventType;
    }
    logEvent(`[terminal] ${eventType}`);
  }

  if (eventType === 'TRANSACTION_ENDED') {
    activeTxn.terminalEnded = true;
    if (currentView === AppView.PROGRESS) addTimelineItem('Terminal ended. Waiting for final result...');
    checkFinalState();
  }

  updateDevConsole();
}

function handleWebhookEvent(parsed) {
  const body = parsed?.payload?.payload || {};
  if (body && body.test === true) return; // Ignore test webhooks

  const snap = extractWebhookSnapshot(body);
  if (!matchesActiveTxn(snap.transactionRequestId, snap.referenceOrderId, snap.transactionId)) return;

  if (snap.transactionId && activeTxn) activeTxn.transactionId = snap.transactionId;
  if (snap.referenceOrderId && activeTxn) activeTxn.orderId = snap.referenceOrderId;

  if (!snap.transactionStatus) return;

  const normalizedStatus = normalizeStatus(snap.transactionStatus);
  activeTxn.notifyStatus = normalizedStatus;

  if (currentView === AppView.PROGRESS) {
    addTimelineItem(`Webhook: status=${snap.transactionStatus} (${normalizedStatus})`);
  }
  logEvent(`[webhook] status=${snap.transactionStatus}`);

  checkFinalState();
}

function checkFinalState() {
  if (!activeTxn) return;
  const status = activeTxn.notifyStatus;
  if (!status) return;

  // Final if we have a terminal status from webhook
  if (status === TxnStatus.SUCCESS || status === TxnStatus.FAILED) {
    activeTxn.status = status;
    activeTxn.updatedAt = Date.now();
    saveTransactions();
    stopRecentEventPolling();
    renderProgress();
    updateDevConsole();
  }
}

function matchesActiveTxn(requestId, referenceOrderId, transactionId) {
  if (!activeTxn) return false;
  if (activeTxn.requestId && requestId && requestId === activeTxn.requestId) return true;
  if (activeTxn.orderId && referenceOrderId && referenceOrderId === activeTxn.orderId) return true;
  if (activeTxn.transactionId && transactionId && transactionId === activeTxn.transactionId) return true;
  // If no IDs to compare, don't match
  if (!requestId && !referenceOrderId && !transactionId) return false;
  return false;
}

function normalizeStatus(raw) {
  const s = String(raw).toUpperCase();
  if (['S', 'SUCCESS', 'APPROVED', 'COMPLETED'].includes(s)) return TxnStatus.SUCCESS;
  if (['F', 'FAILED', 'DECLINED', 'CANCELLED', 'VOIDED', 'ABORTED', 'C'].includes(s)) return TxnStatus.FAILED;
  return TxnStatus.PROCESSING;
}

function terminalEventDescription(eventType) {
  const map = {
    'ORDER_RECEIVED': 'Cloud connected',
    'PAYMENT_PRESENTED': 'Waiting for card tap/insert',
    'PIN_ENTERING': 'Waiting for PIN entry',
    'PAYMENT_PROCESSING': 'Processing payment',
    'SIGNATURE_CAPTURED': 'Signature captured',
    'PRINTING': 'Printing receipt',
    'PRINT_COMPLETED': 'Receipt printed',
    'TRANSACTION_ENDED': 'Transaction ended',
  };
  return map[String(eventType).toUpperCase()] || '';
}

function extractTerminalSnapshot(body) {
  const nodes = collectPlainObjects(body);
  let eventType = '', transactionId = '', transactionRequestId = '', referenceOrderId = '';
  for (const node of nodes) {
    if (!eventType && node.eventType) eventType = String(node.eventType).toUpperCase();
    if (!transactionId && node.transactionId) transactionId = String(node.transactionId);
    if (!transactionRequestId && node.transactionRequestId) transactionRequestId = String(node.transactionRequestId);
    if (!referenceOrderId && node.referenceOrderId) referenceOrderId = String(node.referenceOrderId);
  }
  return { eventType, transactionId, transactionRequestId, referenceOrderId };
}

function extractWebhookSnapshot(body) {
  const nodes = collectPlainObjects(body);
  let transactionId = '', transactionRequestId = '', referenceOrderId = '', transactionStatus = '';
  for (const node of nodes) {
    if (!transactionId && node.transactionId) transactionId = String(node.transactionId);
    if (!transactionRequestId && node.transactionRequestId) transactionRequestId = String(node.transactionRequestId);
    if (!referenceOrderId && node.referenceOrderId) referenceOrderId = String(node.referenceOrderId);
    if (!transactionStatus && node.transactionStatus) transactionStatus = String(node.transactionStatus).toUpperCase();
  }
  return { transactionId, transactionRequestId, referenceOrderId, transactionStatus };
}

// ============================================================
// Developer Console
// ============================================================

function setEventBadge(state) {
  if (!el.eventBadge) return;
  const textMap = { idle: 'Disconnected', connected: 'Connected', error: 'Error' };
  el.eventBadge.className = `dev-badge ${state}`;
  el.eventBadge.textContent = textMap[state] || 'Disconnected';
}

function logEvent(text) {
  if (!el.eventLog) return;
  const item = document.createElement('div');
  item.className = 'event-item';
  item.innerHTML = `<div class="event-time">${formatTime(Date.now())}</div><div class="event-text">${text}</div>`;
  el.eventLog.prepend(item);
}

function updateDevConsole() {
  if (!activeTxn) return;
  if (el.txnRef) el.txnRef.textContent = activeTxn.orderId || '-';
  if (el.txnReq) el.txnReq.textContent = activeTxn.requestId || '-';
  if (el.txnState) el.txnState.textContent = activeTxn.status || 'Idle';
}

// ============================================================
// Event Binding
// ============================================================

function bindEvents() {
  // Menu product clicks
  el.menuGrid?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-op]');
    if (!btn) return;
    const pid = btn.dataset.id;
    if (btn.dataset.op === 'add') cart[pid] = (cart[pid] || 0) + 1;
    if (btn.dataset.op === 'sub') { cart[pid] = Math.max(0, (cart[pid] || 0) - 1); if (cart[pid] === 0) delete cart[pid]; }
    renderMenu();
  });

  // Go to checkout
  el.goToCheckoutBtn?.addEventListener('click', () => navigateTo(AppView.CHECKOUT));

  // Payment channel radio selection
  document.querySelectorAll('input[name="payChannel"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
      radio.closest('.payment-option')?.classList.add('active');
    });
  });

  // Back to menu
  el.backToMenuBtn?.addEventListener('click', () => navigateTo(AppView.MENU));

  // Pay button - dispatch based on selected channel
  el.payBtn?.addEventListener('click', () => {
    const channel = getSelectedChannel();
    if (channel === 'online') executeOnlineCheckout();
    else executeSale();
  });

  // Abort button
  el.abortBtn?.addEventListener('click', () => executeAbort());

  // History button (header)
  el.historyBtn?.addEventListener('click', () => navigateTo(AppView.HISTORY));

  // History back button
  el.historyBackBtn?.addEventListener('click', () => navigateTo(AppView.MENU));

  // History filter chips
  el.historyFilters?.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    historyFilter = chip.dataset.filter;
    el.historyFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    renderHistory();
  });

  // History card clicks
  el.historyList?.addEventListener('click', (e) => {
    const card = e.target.closest('.history-card');
    if (!card) return;
    navigateTo(AppView.DETAIL, { txnId: card.dataset.txnId });
  });

  // Dev Console toggle
  el.openDevConsoleBtn?.addEventListener('click', () => el.devConsole?.classList.add('visible'));
  el.closeDevConsoleBtn?.addEventListener('click', () => el.devConsole?.classList.remove('visible'));

  // Dev console actions
  el.subBtn?.addEventListener('click', () => connectEventStream());
  el.unsubBtn?.addEventListener('click', () => disconnectEventStream());
  el.clearEventsBtn?.addEventListener('click', () => { if (el.eventLog) el.eventLog.innerHTML = ''; });
  el.queryTxnBtn?.addEventListener('click', () => { if (activeTxn) executeQuery(activeTxn); });

  // Config modal
  el.openConfigModalBtn?.addEventListener('click', () => openModal(el.configModal));
  el.configModal?.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal-close]')) closeModal(el.configModal);
  });

  // Config inputs save on change
  ['backendUrl', 'envType', 'customBaseUrl', 'apiKey', 'appId', 'merchantId', 'terminalSn', 'currency', 'returnUrl'].forEach(id => {
    const node = el[id];
    if (!node) return;
    node.addEventListener('input', saveConfig);
    node.addEventListener('change', saveConfig);
  });

  // ESC to close modal
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(el.configModal); });
}

// === Modal Helpers ===
function openModal(modal) { if (modal) modal.classList.remove('hidden'); }
function closeModal(modal) { if (modal) modal.classList.add('hidden'); }

// ============================================================
// Bootstrap
// ============================================================

function bootstrap() {
  initElements();
  loadConfig();
  loadTransactions();

  // Set default backend URL
  const defaultBackend = getDefaultBackendUrl();
  if (el.backendUrl && el.backendUrl.value === 'http://127.0.0.1:8000' && defaultBackend !== 'http://127.0.0.1:8000') {
    el.backendUrl.value = defaultBackend;
    saveConfig();
  }

  bindEvents();
  navigateTo(AppView.MENU);
  setEventBadge('idle');
  connectEventStream();
  logEvent('☀️ SUNBAY Cloud Demo ready.');
}

bootstrap();

// ============================================================
// SUNBAY Coffee Store - Cloud Demo
// Aligned with taplinkdemo/app-compose + lib_service CloudPaymentService
// ============================================================

// === Constants ===
const FIXED_NOTIFY_WEBHOOK_URL = 'http://47.77.239.198/webhook/sunbay';
const FIXED_TERMINAL_EVENT_NOTIFY_URL = 'http://47.77.239.198/terminal-events/sunbay';
const STORAGE_KEY = 'taplink_cloud_demo_config_v2';
const HISTORY_STORAGE_KEY = 'taplink_cloud_demo_history_v1';
const SETTINGS_STORAGE_KEY = 'taplink_cloud_demo_settings_v1';

const PRODUCTS = [
  { id: 'p1', name: 'Americano', icon: '☕️', desc: 'Classic espresso + hot water', priceCents: 550 },
  { id: 'p2', name: 'Blueberry Muffin', icon: '🧁', desc: 'Freshly baked every morning', priceCents: 420 },
  { id: 'p3', name: 'Croissant', icon: '🥐', desc: 'Buttery French pastry', priceCents: 390 },
  { id: 'p4', name: 'Cold Brew', icon: '🧊', desc: 'Slow steeped 24 hours', priceCents: 680 },
  { id: 'p5', name: 'Cappuccino', icon: '☕', desc: 'Espresso with steamed milk foam', priceCents: 620 },
  { id: 'p6', name: 'Matcha Latte', icon: '🍵', desc: 'Organic ceremonial grade matcha', priceCents: 720 },
  { id: 'p7', name: 'Avocado Toast', icon: '🥑', desc: 'Sourdough with fresh avocado', priceCents: 950 },
  { id: 'p8', name: 'Bagel & Cream Cheese', icon: '🥯', desc: 'New York style bagel', priceCents: 480 },
];

// All supported transaction types (aligned with CloudPaymentService paths)
const TxnType = {
  SALE: 'Sale',
  AUTH: 'Auth',
  FORCED_AUTH: 'Forced Auth',
  REFUND: 'Refund',
  VOID: 'Void',
  POST_AUTH: 'Post Auth',
  INCREMENTAL_AUTH: 'Incremental Auth',
  TIP_ADJUST: 'Tip Adjust',
  BATCH_CLOSE: 'Batch Close',
  QUERY: 'Query',
  CHECKOUT_SESSION: 'Checkout Session',
};

const API_PATHS = {
  SALE: '/v1/semi-integration/transaction/sale',
  AUTH: '/v1/semi-integration/transaction/auth',
  FORCED_AUTH: '/v1/semi-integration/transaction/forced-auth',
  REFUND: '/v1/semi-integration/transaction/refund',
  VOID: '/v1/semi-integration/transaction/void',
  POST_AUTH: '/v1/semi-integration/transaction/post-auth',
  INCREMENTAL_AUTH: '/v1/semi-integration/transaction/incremental-auth',
  TIP_ADJUST: '/v1/semi-integration/transaction/tip-adjust',
  ABORT: '/v1/semi-integration/transaction/abort',
  QUERY: '/v1/transaction/query',
  BATCH_QUERY: '/v1/settlement/batch-query',
  BATCH_CLOSE: '/v1/settlement/batch-close',
  CHECKOUT_CREATE: '/v1/checkout/create-session',
  CHECKOUT_EXPIRE: '/v1/checkout/expire-session',
  MERCHANT_QUERY: '/v1/merchant/query',
  MERCHANT_TERMINALS: '/v1/merchant/terminals/query',
};

// === App State ===
const AppView = { MENU: 'menu', CHECKOUT: 'checkout', PROGRESS: 'progress', DETAIL: 'detail', HISTORY: 'history' };
const TxnStatus = { PENDING: 'PENDING', PROCESSING: 'PROCESSING', SUCCESS: 'SUCCESS', FAILED: 'FAILED' };

let currentView = AppView.MENU;
let cart = {}; // { productId: qty }
let orderAmounts = { tipAmount: 0, taxAmount: 0, surchargeAmount: 0, cashbackAmount: 0 }; // Additional amounts in cents
let selectedTxnType = TxnType.SALE; // Current selected transaction type
let transactions = [];
let activeTxn = null;
let currentDetailTxnId = null;
let historyFilter = 'all';
let eventSource = null;
let recentEventTimer = null;

// === DOM Elements ===
const el = {};
function initElements() {
  const ids = [
    'menuView', 'checkoutView', 'progressView', 'detailView', 'historyView',
    'menuGrid', 'floatingCart', 'cartCountBadge', 'cartTotalFloat', 'goToCheckoutBtn',
    'backToMenuBtn', 'checkoutCartList', 'checkoutSubtotal', 'checkoutTax', 'checkoutTotal', 'payBtn', 'payBtnAmount', 'checkoutTaxLabel',
    'progressType', 'progressAmount', 'progressTitle', 'progressSubtitle', 'abortBtn',
    'detailResult', 'detailFields', 'detailActions',
    'historyBackBtn', 'historyFilters', 'historyList', 'historyEmpty', 'historyBtn',
    'devConsole', 'openDevConsoleBtn', 'closeDevConsoleBtn',
    'txnRef', 'txnReq', 'txnState', 'txnStatusPanel', 'queryTxnBtn',
    'eventBadge', 'subBtn', 'unsubBtn', 'clearEventsBtn', 'eventLog',
    'openConfigModalBtn', 'configModal',
    'backendUrl', 'envType', 'customBaseUrl', 'apiKey', 'appId', 'merchantId', 'terminalSn', 'currency', 'notifyUrl', 'configEventUrl', 'returnUrl',
    'txnTypeSelect', 'additionalAmounts', 'tipAmountInput', 'taxAmountInput', 'surchargeInput', 'cashbackInput',
  ];
  ids.forEach(id => { el[id] = document.getElementById(id); });
}

// === Utilities ===
function uid(prefix) { return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`; }

function formatMoney(cents) {
  const cur = getConfig().currency || 'USD';
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(cents / 100); }
  catch { return `${(cents / 100).toFixed(2)} ${cur}`; }
}

function formatTime(ts) { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function formatDate(ts) { return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }

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
    const port = window.location.port ? ':' + window.location.port : '';
    return `${window.location.protocol}//${host}${port}`;
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

function getCartSubtotal() {
  return Object.entries(cart).reduce((sum, [pid, qty]) => {
    const p = PRODUCTS.find(x => x.id === pid);
    return sum + (p ? p.priceCents * qty : 0);
  }, 0);
}

function getCartCount() { return Object.values(cart).reduce((s, q) => s + q, 0); }

function getOrderTotal() {
  const subtotal = getCartSubtotal();
  return subtotal + (orderAmounts.taxAmount || 0) + (orderAmounts.tipAmount || 0) + (orderAmounts.surchargeAmount || 0) + (orderAmounts.cashbackAmount || 0);
}

// Get display amount for a transaction: prefer transAmount from response, fallback to totalCents
function getDisplayAmount(txn) {
  const data = txn.webhookData || txn.queryData;
  if (data?.amount?.transAmount) return data.amount.transAmount;
  if (data?.transAmount) return data.transAmount;
  return txn.totalCents || 0;
}

// === Persistence ===
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const cfg = JSON.parse(raw);
    ['backendUrl','envType','customBaseUrl','apiKey','appId','merchantId','terminalSn','currency','returnUrl'].forEach(k => {
      if (cfg[k] && el[k]) el[k].value = cfg[k];
    });
  } catch { /* ignore */ }
}
function saveConfig() {
  try {
    const o = {};
    ['backendUrl','envType','customBaseUrl','apiKey','appId','merchantId','terminalSn','currency','returnUrl'].forEach(k => { o[k] = el[k]?.value || ''; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
  } catch { /* ignore */ }
}
function loadTransactions() { try { const r = localStorage.getItem(HISTORY_STORAGE_KEY); if (r) transactions = JSON.parse(r); } catch { transactions = []; } }
function saveTransactions() { try { localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(transactions)); } catch {} }

// === Settings (Tip config, Signature config, Print) ===
function getSettings() {
  return {
    tipEnabled: document.getElementById('tipEnabled')?.checked || false,
    tipMode: document.getElementById('tipMode')?.value || 'ON_SALE',
    tipOnScreenTip: document.getElementById('tipOnScreenTip')?.checked ?? true,
    tipWithTax: document.getElementById('tipWithTax')?.checked || false,
    tipSuggestionsEnabled: document.getElementById('tipSuggestionsEnabled')?.checked || false,
    tipFeeMode: document.getElementById('tipFeeMode')?.value || 'RATE',
    tipSuggestion1: parseInt(document.getElementById('tipSuggestion1')?.value) || 15,
    tipSuggestion2: parseInt(document.getElementById('tipSuggestion2')?.value) || 18,
    tipSuggestion3: parseInt(document.getElementById('tipSuggestion3')?.value) || 20,
    taxEnabled: document.getElementById('taxEnabled')?.checked || false,
    taxRate: parseInt(document.getElementById('taxRate')?.value) || 8,
    printReceipt: document.getElementById('printReceipt')?.value || 'NONE',
    signatureEnabled: document.getElementById('signatureEnabled')?.checked || false,
    signatureMode: document.getElementById('signatureMode')?.value || 'ON_SCREEN',
    signatureThresholdEnabled: document.getElementById('signatureThresholdEnabled')?.checked || false,
    signatureThreshold: parseInt(document.getElementById('signatureThreshold')?.value) || 5000,
  };
}
function saveSettings() { try { localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(getSettings())); } catch {} }
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY); if (!raw) return;
    const s = JSON.parse(raw);
    const chk = (id, v) => { const e = document.getElementById(id); if (e) e.checked = !!v; };
    const val = (id, v) => { const e = document.getElementById(id); if (e && v !== undefined) e.value = v; };
    chk('tipEnabled', s.tipEnabled); val('tipMode', s.tipMode); chk('tipOnScreenTip', s.tipOnScreenTip);
    chk('tipWithTax', s.tipWithTax); chk('tipSuggestionsEnabled', s.tipSuggestionsEnabled);
    val('tipFeeMode', s.tipFeeMode); val('tipSuggestion1', s.tipSuggestion1); val('tipSuggestion2', s.tipSuggestion2); val('tipSuggestion3', s.tipSuggestion3);
    chk('taxEnabled', s.taxEnabled); val('taxRate', s.taxRate); val('printReceipt', s.printReceipt);
    chk('signatureEnabled', s.signatureEnabled); val('signatureMode', s.signatureMode);
    chk('signatureThresholdEnabled', s.signatureThresholdEnabled); val('signatureThreshold', s.signatureThreshold);
    toggleSubSettings();
  } catch {}
}
function toggleSubSettings() {
  const toggle = (panelId, checkId) => { const p = document.getElementById(panelId); if (p) p.classList.toggle('hidden', !document.getElementById(checkId)?.checked); };
  toggle('tipSettings', 'tipEnabled'); toggle('tipSuggestionsPanel', 'tipSuggestionsEnabled');
  toggle('taxSettings', 'taxEnabled'); toggle('signatureSettings', 'signatureEnabled');
}

function buildTipConfig() {
  const s = getSettings();
  if (!s.tipEnabled) return undefined;
  const c = { useHostConfig: false, onScreenTip: s.tipOnScreenTip, tipMode: s.tipMode, tipWithTax: s.tipWithTax };
  if (s.tipSuggestionsEnabled) c.suggestions = { feeMode: s.tipFeeMode, values: [s.tipSuggestion1, s.tipSuggestion2, s.tipSuggestion3] };
  return c;
}
function buildSignatureConfig() {
  const s = getSettings();
  if (!s.signatureEnabled) return undefined;
  const c = { useHostConfig: false, entryLocation: s.signatureMode };
  if (s.signatureThresholdEnabled && s.signatureThreshold > 0) c.threshold = s.signatureThreshold;
  return c;
}

// === View Navigation ===
function navigateTo(view, opts = {}) {
  currentView = view;
  ['menuView','checkoutView','progressView','detailView','historyView'].forEach(v => { if (el[v]) el[v].classList.add('hidden'); });
  if (el.floatingCart) el.floatingCart.classList.toggle('hidden', !(view === AppView.MENU && getCartCount() > 0));
  switch (view) {
    case AppView.MENU: el.menuView.classList.remove('hidden'); renderMenu(); break;
    case AppView.CHECKOUT: el.checkoutView.classList.remove('hidden'); renderCheckout(); break;
    case AppView.PROGRESS: el.progressView.classList.remove('hidden'); renderProgress(); break;
    case AppView.DETAIL: currentDetailTxnId = opts.txnId || currentDetailTxnId; el.detailView.classList.remove('hidden'); renderDetail(); break;
    case AppView.HISTORY: el.historyView.classList.remove('hidden'); renderHistory(); break;
  }
}

// === Render Functions ===
function renderMenu() {
  if (!el.menuGrid) return;
  el.menuGrid.innerHTML = '';
  for (const p of PRODUCTS) {
    const qty = cart[p.id] || 0;
    const node = document.createElement('div');
    node.className = 'menu-card';
    node.innerHTML = `<div class="menu-icon">${p.icon}</div><div class="menu-info"><h4>${p.name}</h4><p>${p.desc}</p><div class="menu-action"><span class="price">${formatMoney(p.priceCents)}</span>${qty === 0 ? `<button class="add-btn" data-op="add" data-id="${p.id}">Add</button>` : `<div class="stepper-ui"><button data-op="sub" data-id="${p.id}">−</button><span>${qty}</span><button data-op="add" data-id="${p.id}">+</button></div>`}</div></div>`;
    el.menuGrid.appendChild(node);
  }
  updateFloatingCart();
}

function updateFloatingCart() {
  const count = getCartCount();
  if (el.cartCountBadge) el.cartCountBadge.textContent = count;
  if (el.cartTotalFloat) el.cartTotalFloat.textContent = formatMoney(getOrderTotal());
  if (el.floatingCart) el.floatingCart.classList.toggle('hidden', !(count > 0 && currentView === AppView.MENU));
}

function renderCheckout() {
  if (!el.checkoutCartList) return;
  el.checkoutCartList.innerHTML = '';
  const subtotal = getCartSubtotal();
  for (const [pid, qty] of Object.entries(cart)) {
    if (qty <= 0) continue;
    const p = PRODUCTS.find(x => x.id === pid);
    if (!p) continue;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `<div class="cart-item-info"><div class="cart-item-icon">${p.icon}</div><div><div class="cart-item-name">${p.name}</div><div class="cart-item-price">${formatMoney(p.priceCents)} × ${qty}</div></div></div><div class="cart-item-qty">${formatMoney(p.priceCents * qty)}</div>`;
    el.checkoutCartList.appendChild(item);
  }
  // Read additional amounts from inputs
  orderAmounts.tipAmount = parseInt(el.tipAmountInput?.value) || 0;
  orderAmounts.taxAmount = parseInt(el.taxAmountInput?.value) || 0;
  orderAmounts.surchargeAmount = parseInt(el.surchargeInput?.value) || 0;
  orderAmounts.cashbackAmount = parseInt(el.cashbackInput?.value) || 0;
  const total = getOrderTotal();
  if (el.checkoutSubtotal) el.checkoutSubtotal.textContent = formatMoney(subtotal);
  const taxLabel = document.getElementById('checkoutTaxLabel');
  if (taxLabel) taxLabel.textContent = 'Tax';
  if (el.checkoutTax) el.checkoutTax.textContent = formatMoney(orderAmounts.taxAmount);
  if (el.checkoutTotal) el.checkoutTotal.textContent = formatMoney(total);
  if (el.payBtnAmount) el.payBtnAmount.textContent = formatMoney(total);
  if (el.payBtn) el.payBtn.disabled = total <= 0;
}

function renderProgress() {
  if (!activeTxn) return;
  if (el.progressType) el.progressType.textContent = activeTxn.type || 'Sale';
  if (el.progressAmount) el.progressAmount.textContent = formatMoney(activeTxn.totalCents || 0);
  const status = activeTxn.status;
  const spinner = document.querySelector('.progress-spinner');
  if (status === TxnStatus.SUCCESS) {
    if (el.progressTitle) el.progressTitle.textContent = 'Transaction Successful';
    if (el.progressSubtitle) el.progressSubtitle.textContent = 'Completed.';
    if (spinner) { spinner.classList.add('done'); spinner.classList.remove('error'); }
    if (el.abortBtn) el.abortBtn.classList.add('hidden');
    removeCheckoutLink(); showViewDetailBtn();
  } else if (status === TxnStatus.FAILED) {
    if (el.progressTitle) el.progressTitle.textContent = 'Transaction Failed';
    if (el.progressSubtitle) el.progressSubtitle.textContent = activeTxn.errorMessage || 'Declined or aborted.';
    if (spinner) { spinner.classList.add('error'); spinner.classList.remove('done'); }
    if (el.abortBtn) el.abortBtn.classList.add('hidden');
    removeCheckoutLink(); showViewDetailBtn();
  } else {
    if (el.progressTitle) el.progressTitle.textContent = 'Processing...';
    if (el.progressSubtitle) el.progressSubtitle.textContent = activeTxn.progressMessage || 'Waiting for terminal...';
    if (spinner) { spinner.classList.remove('done', 'error'); }
    if (el.abortBtn) { el.abortBtn.classList.remove('hidden'); el.abortBtn.disabled = false; el.abortBtn.textContent = activeTxn.channel === 'online' ? 'Close Session' : 'Abort Transaction'; }
    removeViewDetailBtn();
  }
}

function showViewDetailBtn() { if (document.getElementById('viewDetailBtn')) return; const b = document.createElement('button'); b.id = 'viewDetailBtn'; b.className = 'view-detail-btn'; b.textContent = 'View Details'; b.onclick = () => navigateTo(AppView.DETAIL, { txnId: activeTxn?.id }); el.progressView?.querySelector('.progress-actions')?.appendChild(b); }
function removeViewDetailBtn() { document.getElementById('viewDetailBtn')?.remove(); }
function showCheckoutLink(url) { removeCheckoutLink(); const c = document.createElement('div'); c.id = 'checkoutLinkContainer'; c.className = 'checkout-link-container'; c.innerHTML = `<p class="checkout-link-label">Payment page ready:</p><a href="${url}" target="_blank" rel="noopener" class="checkout-link-btn">Open Checkout ↗</a><p class="checkout-link-url">${url}</p>`; const a = el.progressView?.querySelector('.progress-animation'); if (a) a.after(c); }
function removeCheckoutLink() { document.getElementById('checkoutLinkContainer')?.remove(); }

function renderDetail() {
  const txn = transactions.find(t => t.id === currentDetailTxnId);
  if (!txn) { navigateTo(AppView.MENU); return; }
  let iconClass = 'processing', iconChar = '⏳', title = 'Processing';
  if (txn.status === TxnStatus.SUCCESS) { iconClass = 'success'; iconChar = '✓'; title = 'Successful'; }
  else if (txn.status === TxnStatus.FAILED) { iconClass = 'error'; iconChar = '✕'; title = 'Failed'; }
  el.detailResult.innerHTML = `<div class="result-icon ${iconClass}">${iconChar}</div><h2>${txn.type} - ${title}</h2>${txn.errorMessage ? `<p class="text-muted">${txn.errorMessage}</p>` : ''}<div class="result-amount">${formatMoney(getDisplayAmount(txn))}</div>`;
  const fields = [['Type', txn.type], ['Status', txn.status], ['Order ID', txn.orderId || '-'], ['Request ID', txn.requestId || '-'], ['Transaction ID', txn.transactionId || '-'], ['Channel', txn.channel || '-'], ['Created', formatDate(txn.createdAt)]];

  // Merge fields from webhook/query response
  const responseData = txn.webhookData || txn.queryData;
  if (responseData && typeof responseData === 'object') {
    const displayedKeys = new Set(['transactionId', 'transactionRequestId', 'referenceOrderId']);
    for (const [key, value] of Object.entries(responseData)) {
      if (displayedKeys.has(key)) continue; // Already shown above
      if (value === null || value === undefined || value === '') continue;
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Expand object sub-fields (e.g. amount → orderAmount, tipAmount, etc.)
        for (const [subKey, subValue] of Object.entries(value)) {
          if (subValue === null || subValue === undefined || subValue === '') continue;
          fields.push([`${key}.${subKey}`, String(subValue)]);
        }
      } else if (Array.isArray(value)) {
        fields.push([key, JSON.stringify(value)]);
      } else {
        fields.push([key, String(value)]);
      }
    }
  }

  el.detailFields.innerHTML = fields.map(([l, v]) => `<div class="detail-field"><span class="detail-field-label">${l}</span><span class="detail-field-value">${v}</span></div>`).join('');

  // Show full raw response JSON
  if (responseData) {
    const rawHtml = `<div class="detail-webhook"><h3>Full Response Data</h3><pre class="webhook-json">${JSON.stringify(responseData, null, 2)}</pre></div>`;
    el.detailFields.insertAdjacentHTML('beforeend', rawHtml);
  }

  // Build actions based on transaction type & status
  let actions = '';

  if (txn.status === TxnStatus.SUCCESS) {
    if (txn.channel === 'online') {
      actions += `<button class="primary-btn refund-btn" id="detailExpireBtn">Close Session</button>`;
    } else {
      // Sale success → Void, Refund, Tip Adjust
      if (txn.type === TxnType.SALE || txn.type === TxnType.FORCED_AUTH) {
        actions += `<button class="primary-btn" id="detailVoidBtn">Void</button>`;
        actions += `<button class="primary-btn refund-btn" id="detailRefundBtn">Refund</button>`;
        actions += `<button class="ghost-btn" id="detailTipAdjustBtn">Tip Adjust</button>`;
      }
      // Auth success → Void, Post Auth, Incremental Auth
      if (txn.type === TxnType.AUTH) {
        actions += `<button class="primary-btn" id="detailVoidBtn">Void</button>`;
        actions += `<button class="primary-btn" id="detailPostAuthBtn">Post Auth (Capture)</button>`;
        actions += `<button class="ghost-btn" id="detailIncrAuthBtn">Incremental Auth</button>`;
      }
    }
  }

  if (txn.status === TxnStatus.PROCESSING) {
    if (txn.channel === 'online') {
      actions += `<button class="primary-btn refund-btn" id="detailExpireBtn">Close Session</button>`;
    }
  }

  actions += `<button class="ghost-btn" id="detailQueryBtn">Query Status</button>`;
  actions += `<button class="ghost-btn" id="detailBackBtn">Back to Menu</button>`;
  actions += `<button class="ghost-btn" id="detailHistoryBtn">All Transactions</button>`;
  el.detailActions.innerHTML = actions;

  // Bind events
  document.getElementById('detailRefundBtn')?.addEventListener('click', () => executeRefund(txn));
  document.getElementById('detailExpireBtn')?.addEventListener('click', () => executeExpireSession(txn));
  document.getElementById('detailVoidBtn')?.addEventListener('click', () => executeVoidFromDetail(txn));
  document.getElementById('detailTipAdjustBtn')?.addEventListener('click', () => executeTipAdjustFromDetail(txn));
  document.getElementById('detailPostAuthBtn')?.addEventListener('click', () => executePostAuthFromDetail(txn));
  document.getElementById('detailIncrAuthBtn')?.addEventListener('click', () => executeIncrementalAuthFromDetail(txn));
  document.getElementById('detailQueryBtn')?.addEventListener('click', () => runQuery(txn.requestId));
  document.getElementById('detailBackBtn')?.addEventListener('click', () => { cart = {}; navigateTo(AppView.MENU); });
  document.getElementById('detailHistoryBtn')?.addEventListener('click', () => navigateTo(AppView.HISTORY));
}

function renderHistory() {
  if (!el.historyList) return;
  const filtered = historyFilter === 'all' ? transactions : transactions.filter(t => t.status === historyFilter);
  if (filtered.length === 0) { el.historyList.innerHTML = `<div class="empty-state"><span class="empty-icon">📋</span><p>No transactions yet</p></div>`; return; }
  el.historyList.innerHTML = filtered.sort((a, b) => b.createdAt - a.createdAt).map(txn => {
    const sc = txn.status === TxnStatus.SUCCESS ? 'success' : txn.status === TxnStatus.FAILED ? 'error' : 'processing';
    return `<div class="history-card" data-txn-id="${txn.id}"><div class="history-card-status ${sc}"></div><div class="history-card-body"><div class="history-card-title">${txn.type} <span class="status-badge ${sc}">${txn.status}</span></div><div class="history-card-sub">${txn.requestId || '-'}</div></div><div class="history-card-right"><div class="history-card-amount">${formatMoney(getDisplayAmount(txn))}</div><div class="history-card-time">${formatDate(txn.createdAt)}</div></div></div>`;
  }).join('');
}

// ============================================================
// API Layer (aligned with CloudPaymentService)
// ============================================================
async function callProxy(method, path, payload, query = {}) {
  const cfg = getConfig();
  const headers = { 'X-Timestamp': `${Date.now()}`, 'X-Client-Request-Id': uid('CID') };
  if (method !== 'GET') headers['Content-Type'] = 'application/json';
  const auth = buildAuth(); if (auth) headers['Authorization'] = auth;
  const body = { mode: 'real', base_url: cfg.baseUrl, method, path, headers, payload: method === 'GET' ? {} : payload, query: method === 'GET' ? payload : query };
  const resp = await fetch(`${cfg.backendUrl}/api/proxy`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return await resp.json();
}

function basePayload() {
  const cfg = getConfig();
  return { appId: cfg.appId, merchantId: cfg.merchantId, terminalSn: cfg.terminalSn };
}

function buildAmountObj() {
  const subtotal = getCartSubtotal();
  const obj = { orderAmount: subtotal, priceCurrency: getConfig().currency };
  // Only include non-zero additional amounts; tipConfig and tipAmount are mutually exclusive
  const tipConfig = buildTipConfig();
  if (!tipConfig && orderAmounts.tipAmount > 0) obj.tipAmount = orderAmounts.tipAmount;
  if (orderAmounts.taxAmount > 0) obj.taxAmount = orderAmounts.taxAmount;
  if (orderAmounts.surchargeAmount > 0) obj.surchargeAmount = orderAmounts.surchargeAmount;
  if (orderAmounts.cashbackAmount > 0) obj.cashbackAmount = orderAmounts.cashbackAmount;
  // totalAmount = sum of all
  obj.totalAmount = subtotal + (obj.tipAmount || 0) + (obj.taxAmount || 0) + (obj.surchargeAmount || 0) + (obj.cashbackAmount || 0);
  return obj;
}

function createTxnRecord(type, channel = 'terminal') {
  const requestId = uid('REQ');
  const txn = { id: requestId, orderId: uid('ORDER'), requestId, transactionId: null, type, channel, totalCents: getOrderTotal(), amount: buildAmountObj(), status: TxnStatus.PROCESSING, progressMessage: 'Sending request...', errorMessage: null, events: [], result: {}, createdAt: Date.now(), updatedAt: Date.now(), terminalEnded: false, notifyStatus: null, seenEventKeys: [] };
  activeTxn = txn; transactions.push(txn); saveTransactions();
  return txn;
}

function startTxnProgress(txn) {
  navigateTo(AppView.PROGRESS); logEvent(`${txn.type} initiated`); connectEventStream(); startRecentEventPolling(); updateDevConsole();
}

async function handleApiResult(result, txn) {
  const code = extractCodeFromResponse(result.data);
  const msg = extractMsgFromResponse(result.data);
  logEvent(`HTTP ${result.httpStatus}: code=${code || '0'}, msg=${msg}`);
  if (code && code !== '0') {
    txn.status = TxnStatus.FAILED; txn.errorMessage = `[${code}] ${msg}`; txn.updatedAt = Date.now();
    saveTransactions(); renderProgress(); updateDevConsole(); return false;
  }
  const ids = extractIdsFromResponse(result.data);
  if (ids.transactionId) txn.transactionId = ids.transactionId;
  if (ids.transactionRequestId) txn.requestId = ids.transactionRequestId;
  updateDevConsole();
  // Replay recent events once to catch anything that arrived during the API call
  replayRecentEvents();
  return true;
}

// --- Sale ---
async function executeSale() {
  const cfg = getConfig(); const s = getSettings();
  const txn = createTxnRecord(TxnType.SALE); startTxnProgress(txn);
  const description = Object.entries(cart).filter(([,q]) => q > 0).map(([pid, qty]) => { const p = PRODUCTS.find(x => x.id === pid); return `${p.name} x${qty}`; }).join(', ') || 'Sale';
  const payload = { ...basePayload(), referenceOrderId: txn.orderId, transactionRequestId: txn.requestId, amount: txn.amount, description, notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL, printReceipt: s.printReceipt !== 'NONE' ? s.printReceipt : undefined, tipConfig: buildTipConfig(), signatureConfig: buildSignatureConfig() };
  try { const r = await callProxy('POST', API_PATHS.SALE, payload); await handleApiResult(r, txn); } catch (e) { logEvent(`Request failed: ${e.message}`); }
}

// --- Auth ---
async function executeAuth() {
  const txn = createTxnRecord(TxnType.AUTH); startTxnProgress(txn);
  const payload = { ...basePayload(), referenceOrderId: txn.orderId, transactionRequestId: txn.requestId, amount: txn.amount, description: 'Auth', printReceipt: getSettings().printReceipt !== 'NONE' ? getSettings().printReceipt : undefined, signatureConfig: buildSignatureConfig(), notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL };
  try { const r = await callProxy('POST', API_PATHS.AUTH, payload); await handleApiResult(r, txn); } catch (e) { logEvent(`Request failed: ${e.message}`); }
}

// --- Forced Auth ---
async function executeForcedAuth() {
  const txn = createTxnRecord(TxnType.FORCED_AUTH); startTxnProgress(txn);
  const payload = { ...basePayload(), referenceOrderId: txn.orderId, transactionRequestId: txn.requestId, amount: txn.amount, description: 'Forced Auth', printReceipt: getSettings().printReceipt !== 'NONE' ? getSettings().printReceipt : undefined, notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL };
  try { const r = await callProxy('POST', API_PATHS.FORCED_AUTH, payload); await handleApiResult(r, txn); } catch (e) { logEvent(`Request failed: ${e.message}`); }
}

// --- Refund (referenced, from Detail) ---
async function executeRefund(origTxn) {
  if (!origTxn?.transactionId && !origTxn?.requestId) { logEvent('Refund requires original transaction'); return; }
  const txn = createTxnRecord(TxnType.REFUND); startTxnProgress(txn);
  const payload = { ...basePayload(), transactionRequestId: txn.requestId, amount: { orderAmount: origTxn.totalCents || txn.amount.orderAmount, priceCurrency: getConfig().currency }, description: 'Refund', printReceipt: getSettings().printReceipt !== 'NONE' ? getSettings().printReceipt : undefined, notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL, pushToTerminal: true };
  if (origTxn.transactionId) payload.originalTransactionId = origTxn.transactionId;
  else if (origTxn.requestId) payload.originalTransactionRequestId = origTxn.requestId;
  try { const r = await callProxy('POST', API_PATHS.REFUND, payload); await handleApiResult(r, txn); } catch (e) { logEvent(`Failed: ${e.message}`); }
}

// --- Batch Close ---
async function executeBatchClose() {
  const txn = createTxnRecord(TxnType.BATCH_CLOSE); startTxnProgress(txn);
  const cfg = getConfig();
  // Step 1: Query batch to get channelCode list
  const queryPayload = { appId: cfg.appId, merchantId: cfg.merchantId, terminalSn: cfg.terminalSn };
  try {
    const qr = await callProxy('GET', API_PATHS.BATCH_QUERY, queryPayload);
    const qCode = extractCodeFromResponse(qr.data);
    if (qCode && qCode !== '0') { txn.status = TxnStatus.FAILED; txn.errorMessage = `Batch query: [${qCode}] ${extractMsgFromResponse(qr.data)}`; txn.updatedAt = Date.now(); saveTransactions(); renderProgress(); return; }

    // Extract channelCodes from batchList
    const batchList = qr.data?.data?.data?.batchList || qr.data?.data?.batchList || [];
    if (!batchList || batchList.length === 0) { txn.status = TxnStatus.FAILED; txn.errorMessage = 'No batch data found. No transactions to settle.'; txn.updatedAt = Date.now(); saveTransactions(); renderProgress(); return; }

    const channelCodes = [...new Set(batchList.map(item => item.channelCode).filter(Boolean))];
    logEvent(`Batch query OK: ${channelCodes.length} channel(s) - ${channelCodes.join(', ')}`);

    // Step 2: Close each channel
    let successCount = 0;
    let failCount = 0;
    const batchResults = [];
    for (const channelCode of channelCodes) {
      const closeRequestId = channelCodes.length > 1 ? `${txn.requestId}_${channelCode}` : txn.requestId;
      const closePayload = { ...basePayload(), transactionRequestId: closeRequestId, channelCode, description: 'Batch Close', printReceipt: getSettings().printReceipt !== 'NONE' ? getSettings().printReceipt : 'AUTO', notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL };
      try {
        const r = await callProxy('POST', API_PATHS.BATCH_CLOSE, closePayload);
        const code = extractCodeFromResponse(r.data);
        if (!code || code === '0') {
          successCount++; logEvent(`Batch close [${channelCode}]: OK`);
          const respData = r.data?.data?.data || r.data?.data || r.data;
          batchResults.push({ channelCode, ...respData });
        }
        else { failCount++; logEvent(`Batch close [${channelCode}]: [${code}] ${extractMsgFromResponse(r.data)}`); }
      } catch (e) { failCount++; logEvent(`Batch close [${channelCode}] failed: ${e.message}`); }
    }

    // Save batch results for detail display
    txn.queryData = batchResults.length === 1 ? batchResults[0] : { channels: batchResults };
    txn.webhookData = txn.queryData;

    // Final result
    if (failCount === 0) { txn.status = TxnStatus.SUCCESS; txn.errorMessage = null; }
    else if (successCount > 0) { txn.status = TxnStatus.SUCCESS; txn.errorMessage = `Partial: ${successCount} OK, ${failCount} failed`; }
    else { txn.status = TxnStatus.FAILED; txn.errorMessage = `All ${failCount} channel(s) failed`; }
    txn.updatedAt = Date.now(); saveTransactions(); renderProgress(); updateDevConsole();
  } catch (e) { logEvent(`Batch close failed: ${e.message}`); txn.status = TxnStatus.FAILED; txn.errorMessage = e.message; txn.updatedAt = Date.now(); saveTransactions(); renderProgress(); }
}

// --- Query ---
async function runQuery(requestId) {
  const cfg = getConfig();
  // Find the transaction to query - prefer transactionId over transactionRequestId
  const targetTxn = transactions.find(t => t.requestId === requestId) || activeTxn;
  const payload = { appId: cfg.appId, merchantId: cfg.merchantId };
  if (targetTxn?.transactionId) {
    payload.transactionId = targetTxn.transactionId;
  } else {
    payload.transactionRequestId = requestId || activeTxn?.requestId || '';
  }
  try {
    const r = await callProxy('GET', API_PATHS.QUERY, payload);
    const code = extractCodeFromResponse(r.data);
    logEvent(`Query: HTTP ${r.httpStatus}, code=${code || '0'}`);
    if (code && code !== '0') { logEvent(`Query error: [${code}] ${extractMsgFromResponse(r.data)}`); return; }
    const status = extractStatusFromResponse(r.data);
    if (status && targetTxn) {
      targetTxn.status = status; targetTxn.updatedAt = Date.now();
      const ids = extractIdsFromResponse(r.data); if (ids.transactionId) targetTxn.transactionId = ids.transactionId;
      // Save full query response data for detail display
      const queryData = r.data?.data?.data || r.data?.data || r.data;
      targetTxn.queryData = queryData;
      // Query returns the latest state, always use it as the display source
      targetTxn.webhookData = queryData;
      saveTransactions(); if (currentView === AppView.PROGRESS) renderProgress(); if (currentView === AppView.DETAIL) renderDetail(); updateDevConsole();
    }
  } catch (e) { logEvent(`Query failed: ${e.message}`); }
}

// --- Online Checkout ---
async function executeOnlineCheckout() {
  const cfg = getConfig();
  const txn = createTxnRecord(TxnType.CHECKOUT_SESSION, 'online'); startTxnProgress(txn);
  const productList = Object.entries(cart).filter(([,q]) => q > 0).map(([pid, qty]) => { const p = PRODUCTS.find(x => x.id === pid); return { amount: p.priceCents, name: p.name, num: qty }; });
  const description = productList.map(it => `${it.name} x${it.num}`).join(', ') || 'Checkout';
  const returnBaseUrl = `${window.location.origin}/return.html`;
  const payload = { appId: cfg.appId, merchantId: cfg.merchantId, referenceOrderId: txn.orderId, transactionRequestId: txn.requestId, amount: txn.amount, description, productList, merchantReturnUrl: cfg.returnUrl || returnBaseUrl, notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL };
  try {
    const r = await callProxy('POST', API_PATHS.CHECKOUT_CREATE, payload);
    if (!(await handleApiResult(r, txn))) return;
    const nodes = collectPlainObjects(r.data);
    for (const n of nodes) {
      if (n.checkoutUrl && !txn.checkoutUrl) txn.checkoutUrl = n.checkoutUrl;
      if (n.sessionId && !txn.sessionId) txn.sessionId = n.sessionId;
    }
    if (txn.checkoutUrl) { showCheckoutLink(txn.checkoutUrl); if (el.progressSubtitle) el.progressSubtitle.textContent = 'Checkout session created. Complete payment in new tab.'; }
  } catch (e) { logEvent(`Request failed: ${e.message}`); }
}

// --- Abort (channel-aware) ---
async function executeAbort() {
  if (!activeTxn) return;
  const cfg = getConfig(); const isOnline = activeTxn.channel === 'online';
  if (el.abortBtn) { el.abortBtn.disabled = true; el.abortBtn.textContent = 'Processing...'; }
  const path = isOnline ? API_PATHS.CHECKOUT_EXPIRE : API_PATHS.ABORT;
  const payload = isOnline
    ? { appId: cfg.appId, merchantId: cfg.merchantId, sessionId: activeTxn.sessionId || undefined, transactionRequestId: activeTxn.requestId, referenceOrderId: activeTxn.orderId }
    : { ...basePayload(), originalTransactionId: activeTxn.transactionId || undefined, originalTransactionRequestId: activeTxn.requestId || undefined, description: 'User cancelled' };
  try {
    const r = await callProxy('POST', path, payload);
    const code = extractCodeFromResponse(r.data);
    logEvent(`${isOnline ? 'Expire' : 'Abort'}: code=${code || '0'}`);
    if (!code || code === '0') { activeTxn.status = TxnStatus.FAILED; activeTxn.errorMessage = isOnline ? 'Session closed' : 'Aborted'; activeTxn.updatedAt = Date.now(); saveTransactions(); renderProgress(); updateDevConsole(); }
    else { logEvent(`Failed: [${code}] ${extractMsgFromResponse(r.data)}`); if (el.abortBtn) { el.abortBtn.disabled = false; el.abortBtn.textContent = isOnline ? 'Close Session' : 'Abort Transaction'; } }
  } catch (e) { logEvent(`Failed: ${e.message}`); if (el.abortBtn) { el.abortBtn.disabled = false; } }
}

// --- Expire Session (Detail view) ---
async function executeExpireSession(txn) {
  if (!txn) return;
  const cfg = getConfig(); const btn = document.getElementById('detailExpireBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Closing...'; }
  const payload = { appId: cfg.appId, merchantId: cfg.merchantId, sessionId: txn.sessionId || undefined, transactionRequestId: txn.requestId, referenceOrderId: txn.orderId };
  try {
    const r = await callProxy('POST', API_PATHS.CHECKOUT_EXPIRE, payload);
    const code = extractCodeFromResponse(r.data);
    if (!code || code === '0') { txn.status = TxnStatus.FAILED; txn.errorMessage = 'Session expired'; txn.updatedAt = Date.now(); saveTransactions(); renderDetail(); }
    else { logEvent(`Expire failed: [${code}] ${extractMsgFromResponse(r.data)}`); if (btn) { btn.disabled = false; btn.textContent = 'Close Session'; } }
  } catch (e) { logEvent(`Failed: ${e.message}`); if (btn) { btn.disabled = false; btn.textContent = 'Close Session'; } }
}

// --- Void from Detail ---
async function executeVoidFromDetail(origTxn) {
  if (!origTxn?.transactionId) { logEvent('Void requires transactionId'); return; }
  const txn = createTxnRecord(TxnType.VOID); startTxnProgress(txn);
  const payload = { ...basePayload(), transactionRequestId: txn.requestId, originalTransactionId: origTxn.transactionId, description: 'Void', printReceipt: getSettings().printReceipt !== 'NONE' ? getSettings().printReceipt : undefined, pushToTerminal: true, notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL };
  try { const r = await callProxy('POST', API_PATHS.VOID, payload); await handleApiResult(r, txn); } catch (e) { logEvent(`Failed: ${e.message}`); }
}

// --- Tip Adjust from Detail ---
async function executeTipAdjustFromDetail(origTxn) {
  if (!origTxn?.transactionId) { logEvent('Tip Adjust requires transactionId'); return; }
  const tipAmount = parseInt(prompt('Enter tip amount (cents):', '100')) || 0;
  if (tipAmount <= 0) return;
  const txn = createTxnRecord(TxnType.TIP_ADJUST); txn.totalCents = tipAmount; startTxnProgress(txn);
  const payload = { ...basePayload(), originalTransactionId: origTxn.transactionId, tipAmount, pushToTerminal: true };
  try {
    const r = await callProxy('POST', API_PATHS.TIP_ADJUST, payload);
    const code = extractCodeFromResponse(r.data);
    const msg = extractMsgFromResponse(r.data);
    logEvent(`Tip Adjust: code=${code || '0'}, msg=${msg}`);
    if (code && code !== '0') {
      txn.status = TxnStatus.FAILED; txn.errorMessage = `[${code}] ${msg}`;
    } else {
      txn.status = TxnStatus.SUCCESS;
      txn.queryData = r.data?.data?.data || r.data?.data || r.data;
      txn.webhookData = txn.queryData;
    }
    txn.updatedAt = Date.now(); saveTransactions(); stopRecentEventPolling(); renderProgress(); updateDevConsole();
  } catch (e) { logEvent(`Failed: ${e.message}`); }
}

// --- Post Auth (Capture) from Detail ---
async function executePostAuthFromDetail(origTxn) {
  if (!origTxn?.transactionId) { logEvent('Post Auth requires transactionId'); return; }
  const txn = createTxnRecord(TxnType.POST_AUTH); startTxnProgress(txn);
  const payload = { ...basePayload(), transactionRequestId: txn.requestId, originalTransactionId: origTxn.transactionId, amount: txn.amount, description: 'Post Auth', printReceipt: getSettings().printReceipt !== 'NONE' ? getSettings().printReceipt : undefined, pushToTerminal: true, tipConfig: buildTipConfig(), notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL };
  try { const r = await callProxy('POST', API_PATHS.POST_AUTH, payload); await handleApiResult(r, txn); } catch (e) { logEvent(`Failed: ${e.message}`); }
}

// --- Incremental Auth from Detail ---
async function executeIncrementalAuthFromDetail(origTxn) {
  if (!origTxn?.transactionId) { logEvent('Incremental Auth requires transactionId'); return; }
  const addAmountStr = prompt('Enter additional auth amount (cents):', String(origTxn.totalCents || 500));
  const addAmount = parseInt(addAmountStr) || 0;
  if (addAmount <= 0) return;
  const txn = createTxnRecord(TxnType.INCREMENTAL_AUTH); txn.totalCents = addAmount;
  txn.amount = { orderAmount: addAmount, priceCurrency: getConfig().currency, totalAmount: addAmount };
  startTxnProgress(txn);
  const payload = { ...basePayload(), transactionRequestId: txn.requestId, originalTransactionId: origTxn.transactionId, amount: txn.amount, description: 'Incremental Auth', printReceipt: getSettings().printReceipt !== 'NONE' ? getSettings().printReceipt : undefined, pushToTerminal: true, notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL };
  try { const r = await callProxy('POST', API_PATHS.INCREMENTAL_AUTH, payload); await handleApiResult(r, txn); } catch (e) { logEvent(`Failed: ${e.message}`); }
}

// --- Unreferenced Refund (from Checkout, no originalTransactionId) ---
async function executeUnreferencedRefund() {
  const txn = createTxnRecord(TxnType.REFUND); startTxnProgress(txn);
  const payload = { ...basePayload(), referenceOrderId: txn.orderId, transactionRequestId: txn.requestId, amount: { orderAmount: txn.amount.orderAmount, priceCurrency: txn.amount.priceCurrency }, description: 'Unreferenced Refund', printReceipt: getSettings().printReceipt !== 'NONE' ? getSettings().printReceipt : undefined, signatureConfig: buildSignatureConfig(), notifyUrl: FIXED_NOTIFY_WEBHOOK_URL, terminalEventNotifyUrl: FIXED_TERMINAL_EVENT_NOTIFY_URL };
  try { const r = await callProxy('POST', API_PATHS.REFUND, payload); await handleApiResult(r, txn); } catch (e) { logEvent(`Failed: ${e.message}`); }
}

// --- Merchant Query ---
async function queryMerchant() {
  const cfg = getConfig();
  const payload = { appId: cfg.appId, merchantId: cfg.merchantId };
  try {
    const r = await callProxy('GET', API_PATHS.MERCHANT_QUERY, payload);
    const code = extractCodeFromResponse(r.data);
    if (code && code !== '0') { showMerchantResult(`Error: [${code}] ${extractMsgFromResponse(r.data)}`); return; }
    const data = r.data?.data?.data || r.data?.data || r.data;
    showMerchantResult(JSON.stringify(data, null, 2));
    logEvent('Merchant query OK');
  } catch (e) { showMerchantResult(`Failed: ${e.message}`); }
}

// --- Merchant Terminals Query ---
async function queryMerchantTerminals() {
  const cfg = getConfig();
  const payload = { appId: cfg.appId, merchantId: cfg.merchantId };
  try {
    const r = await callProxy('GET', API_PATHS.MERCHANT_TERMINALS, payload);
    const code = extractCodeFromResponse(r.data);
    if (code && code !== '0') { showMerchantResult(`Error: [${code}] ${extractMsgFromResponse(r.data)}`); return; }
    const data = r.data?.data?.data || r.data?.data || r.data;
    showMerchantResult(JSON.stringify(data, null, 2));
    logEvent('Terminals query OK');
  } catch (e) { showMerchantResult(`Failed: ${e.message}`); }
}

function showMerchantResult(text) {
  let panel = document.getElementById('merchantResultPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'merchantResultPanel';
    panel.className = 'merchant-result-panel';
    panel.innerHTML = `<div class="merchant-result-header"><h3>Query Result</h3><button id="closeMerchantResult" class="icon-button">✕</button></div><pre class="merchant-result-json"></pre>`;
    document.body.appendChild(panel);
    document.getElementById('closeMerchantResult')?.addEventListener('click', () => panel.classList.add('hidden'));
  }
  panel.querySelector('.merchant-result-json').textContent = text;
  panel.classList.remove('hidden');
}

// ============================================================
// SSE Event Stream
// ============================================================
function connectEventStream() {
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) return;
  try {
    eventSource = new EventSource(`${getConfig().backendUrl}/api/events/stream`);
    eventSource.onopen = () => setEventBadge('connected');
    eventSource.onerror = () => setEventBadge('error');
    // Listen to all event types from backend
    eventSource.onmessage = (e) => handleEventData(e.data);
    eventSource.addEventListener('terminal_notify_received', (e) => handleEventData(e.data));
    eventSource.addEventListener('webhook_received', (e) => handleEventData(e.data));
    eventSource.addEventListener('api_response', (e) => handleEventData(e.data));
    eventSource.addEventListener('terminal_event', (e) => handleEventData(e.data));
    eventSource.addEventListener('terminal_status', (e) => handleEventData(e.data));
    setEventBadge('connected');
  } catch { setEventBadge('error'); }
}
function disconnectEventStream() { if (eventSource) { eventSource.close(); eventSource = null; } setEventBadge('idle'); stopRecentEventPolling(); }
function startRecentEventPolling() { stopRecentEventPolling(); recentEventTimer = setInterval(() => replayRecentEvents(), 10000); }
function stopRecentEventPolling() { if (recentEventTimer) { clearInterval(recentEventTimer); recentEventTimer = null; } }
// Fallback polling: replay recent events every 10s in case SSE missed them
async function replayRecentEvents() {
  if (!activeTxn || activeTxn.status === TxnStatus.SUCCESS || activeTxn.status === TxnStatus.FAILED) { stopRecentEventPolling(); return; }
  try { const r = await fetch(`${getConfig().backendUrl}/api/events/recent`); const d = await r.json(); if (d.items) d.items.forEach(i => handleEventData(JSON.stringify(i))); } catch {}
}

function handleEventData(raw) {
  let parsed; try { parsed = JSON.parse(raw); } catch { return; }
  if (!parsed?.type || !activeTxn) return;
  const key = `${parsed.type}:${parsed.ts}`;
  if (activeTxn.seenEventKeys.includes(key)) return;
  activeTxn.seenEventKeys.push(key);
  if (activeTxn.seenEventKeys.length > 500) activeTxn.seenEventKeys = activeTxn.seenEventKeys.slice(-200);
  if (parsed.type === 'terminal_notify_received') handleTerminalEvent(parsed);
  else if (parsed.type === 'webhook_received') handleWebhookEvent(parsed);
}

function handleTerminalEvent(parsed) {
  const body = parsed?.payload?.payload || {};
  const snap = extractTerminalSnapshot(body);
  if (!matchesActiveTxn(snap.transactionRequestId, snap.referenceOrderId, snap.transactionId)) return;
  if (snap.transactionId && activeTxn) activeTxn.transactionId = snap.transactionId;
  if (snap.eventType) { const desc = terminalEventDesc(snap.eventType); logEvent(`[terminal] ${snap.eventType}${desc ? ' - ' + desc : ''}`); if (el.progressSubtitle) el.progressSubtitle.textContent = desc || snap.eventType; }
  if (snap.eventType === 'TRANSACTION_ENDED') { activeTxn.terminalEnded = true; logEvent('Terminal ended, waiting for webhook...'); checkFinalState(); }
  updateDevConsole();
}

function handleWebhookEvent(parsed) {
  const body = parsed?.payload?.payload || {};
  if (body?.test === true) return;
  const snap = extractWebhookSnapshot(body);
  if (!matchesActiveTxn(snap.transactionRequestId, snap.referenceOrderId, snap.transactionId)) return;
  if (snap.transactionId && activeTxn) activeTxn.transactionId = snap.transactionId;
  if (!snap.transactionStatus) return;
  activeTxn.notifyStatus = normalizeStatus(snap.transactionStatus);
  // Save full webhook data for detail display
  activeTxn.webhookData = body;
  saveTransactions();
  logEvent(`[webhook] status=${snap.transactionStatus}`);
  checkFinalState();
}

function checkFinalState() {
  if (!activeTxn) return;
  const status = activeTxn.notifyStatus;
  if (!status) return;
  if (status !== TxnStatus.SUCCESS && status !== TxnStatus.FAILED) return;

  // Both conditions met: terminal ended + webhook final status → confirm immediately
  if (activeTxn.terminalEnded) {
    confirmFinalState(status);
    return;
  }

  // Only webhook arrived, terminal not ended yet → wait up to 8s for terminal event
  // This gives the UI time to display terminal status updates
  if (!activeTxn._finalTimer) {
    logEvent(`[checkFinal] Webhook status=${status}, waiting for TRANSACTION_ENDED (max 8s)...`);
    activeTxn._finalTimer = setTimeout(() => {
      if (activeTxn && activeTxn.notifyStatus && !activeTxn._finalized) {
        logEvent('[checkFinal] Timeout waiting for TRANSACTION_ENDED, confirming from webhook');
        confirmFinalState(activeTxn.notifyStatus);
      }
    }, 8000);
  }
}

function confirmFinalState(status) {
  if (!activeTxn || activeTxn._finalized) return;
  activeTxn._finalized = true;
  if (activeTxn._finalTimer) { clearTimeout(activeTxn._finalTimer); activeTxn._finalTimer = null; }
  activeTxn.status = status; activeTxn.updatedAt = Date.now();
  saveTransactions(); stopRecentEventPolling(); renderProgress(); updateDevConsole();
}

function matchesActiveTxn(reqId, refId, txnId) {
  if (!activeTxn) return false;
  if (activeTxn.requestId && reqId && reqId === activeTxn.requestId) return true;
  if (activeTxn.orderId && refId && refId === activeTxn.orderId) return true;
  if (activeTxn.transactionId && txnId && txnId === activeTxn.transactionId) return true;
  return false;
}

function normalizeStatus(raw) { const s = String(raw).toUpperCase(); if (['S','SUCCESS','APPROVED','COMPLETED'].includes(s)) return TxnStatus.SUCCESS; if (['F','FAILED','DECLINED','CANCELLED','VOIDED','ABORTED','C'].includes(s)) return TxnStatus.FAILED; return TxnStatus.PROCESSING; }
function terminalEventDesc(et) { return { 'ORDER_RECEIVED': 'Cloud connected', 'PAYMENT_PRESENTED': 'Waiting for card', 'PIN_ENTERING': 'PIN entry', 'PAYMENT_PROCESSING': 'Processing', 'SIGNATURE_CAPTURED': 'Signature captured', 'PRINTING': 'Printing', 'PRINT_COMPLETED': 'Printed', 'TRANSACTION_ENDED': 'Ended' }[String(et).toUpperCase()] || ''; }

// === Response Helpers ===
function extractIdsFromResponse(data) { const r = { transactionId: '', transactionRequestId: '', referenceOrderId: '' }; if (!data) return r; for (const n of collectPlainObjects(data)) { if (!r.transactionId && n.transactionId) r.transactionId = String(n.transactionId); if (!r.transactionRequestId && n.transactionRequestId) r.transactionRequestId = String(n.transactionRequestId); if (!r.referenceOrderId && n.referenceOrderId) r.referenceOrderId = String(n.referenceOrderId); } return r; }
function extractStatusFromResponse(data) { if (!data) return null; for (const n of collectPlainObjects(data)) { const s = n.transactionStatus || n.status; if (s) { const u = String(s).toUpperCase(); if (['S','SUCCESS','APPROVED','COMPLETED'].includes(u)) return TxnStatus.SUCCESS; if (['F','FAILED','DECLINED','CANCELLED','VOIDED','ABORTED'].includes(u)) return TxnStatus.FAILED; if (['P','I','PROCESSING'].includes(u)) return TxnStatus.PROCESSING; } } return null; }
function extractCodeFromResponse(data) { if (!data) return ''; for (const n of collectPlainObjects(data)) { if (n.code !== undefined) return String(n.code); } return ''; }
function extractMsgFromResponse(data) { if (!data) return ''; for (const n of collectPlainObjects(data)) { if (n.msg) return String(n.msg); if (n.message) return String(n.message); } return ''; }
function extractTerminalSnapshot(body) { let eventType='', transactionId='', transactionRequestId='', referenceOrderId=''; for (const n of collectPlainObjects(body)) { if (!eventType && n.eventType) eventType = String(n.eventType).toUpperCase(); if (!transactionId && n.transactionId) transactionId = String(n.transactionId); if (!transactionRequestId && n.transactionRequestId) transactionRequestId = String(n.transactionRequestId); if (!referenceOrderId && n.referenceOrderId) referenceOrderId = String(n.referenceOrderId); } return { eventType, transactionId, transactionRequestId, referenceOrderId }; }
function extractWebhookSnapshot(body) { let transactionId='', transactionRequestId='', referenceOrderId='', transactionStatus=''; for (const n of collectPlainObjects(body)) { if (!transactionId && n.transactionId) transactionId = String(n.transactionId); if (!transactionRequestId && n.transactionRequestId) transactionRequestId = String(n.transactionRequestId); if (!referenceOrderId && n.referenceOrderId) referenceOrderId = String(n.referenceOrderId); if (!transactionStatus && n.transactionStatus) transactionStatus = String(n.transactionStatus).toUpperCase(); } return { transactionId, transactionRequestId, referenceOrderId, transactionStatus }; }
function collectPlainObjects(obj, acc = []) { if (!obj || typeof obj !== 'object') return acc; if (Array.isArray(obj)) obj.forEach(i => collectPlainObjects(i, acc)); else { acc.push(obj); Object.values(obj).forEach(v => { if (v && typeof v === 'object') collectPlainObjects(v, acc); }); } return acc; }

// === Dev Console ===
function setEventBadge(state) { if (!el.eventBadge) return; el.eventBadge.className = `dev-badge ${state}`; el.eventBadge.textContent = { idle: 'Disconnected', connected: 'Connected', error: 'Error' }[state] || 'Disconnected'; }
function logEvent(text) { if (!el.eventLog) return; const i = document.createElement('div'); i.className = 'event-item'; i.innerHTML = `<div class="event-time">${formatTime(Date.now())}</div><div class="event-text">${text}</div>`; el.eventLog.prepend(i); }
function updateDevConsole() { if (!activeTxn) return; if (el.txnRef) el.txnRef.textContent = activeTxn.orderId || '-'; if (el.txnReq) el.txnReq.textContent = activeTxn.requestId || '-'; if (el.txnState) el.txnState.textContent = activeTxn.status || 'Idle'; }

// === Modal ===
function openModal(m) { if (m) m.classList.remove('hidden'); }
function closeModal(m) { if (m) m.classList.add('hidden'); }

// ============================================================
// Event Binding & Bootstrap
// ============================================================
function bindEvents() {
  el.menuGrid?.addEventListener('click', (e) => { const b = e.target.closest('button[data-op]'); if (!b) return; const pid = b.dataset.id; if (b.dataset.op === 'add') cart[pid] = (cart[pid] || 0) + 1; if (b.dataset.op === 'sub') { cart[pid] = Math.max(0, (cart[pid] || 0) - 1); if (!cart[pid]) delete cart[pid]; } renderMenu(); });
  // Logo click → back to menu
  document.getElementById('logoHome')?.addEventListener('click', () => navigateTo(AppView.MENU));
  el.goToCheckoutBtn?.addEventListener('click', () => navigateTo(AppView.CHECKOUT));
  el.backToMenuBtn?.addEventListener('click', () => navigateTo(AppView.MENU));
  // Transaction type select
  el.txnTypeSelect?.addEventListener('change', () => { selectedTxnType = el.txnTypeSelect.value; renderCheckout(); });
  // Additional amounts auto-update
  ['tipAmountInput', 'taxAmountInput', 'surchargeInput', 'cashbackInput'].forEach(id => { document.getElementById(id)?.addEventListener('input', () => renderCheckout()); });
  // Payment channel radio
  document.querySelectorAll('input[name="payChannel"]').forEach(r => { r.addEventListener('change', () => { document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active')); r.closest('.payment-option')?.classList.add('active'); }); });
  // Pay button - dispatch based on selected type and channel
  el.payBtn?.addEventListener('click', () => {
    const channel = document.querySelector('input[name="payChannel"]:checked')?.value || 'terminal';
    if (channel === 'online') { executeOnlineCheckout(); return; }
    switch (selectedTxnType) {
      case TxnType.SALE: executeSale(); break;
      case TxnType.AUTH: executeAuth(); break;
      case TxnType.FORCED_AUTH: executeForcedAuth(); break;
      case TxnType.REFUND: executeUnreferencedRefund(); break;
      default: executeSale();
    }
  });
  el.abortBtn?.addEventListener('click', () => executeAbort());
  el.historyBtn?.addEventListener('click', () => navigateTo(AppView.HISTORY));
  el.historyBackBtn?.addEventListener('click', () => navigateTo(AppView.MENU));
  document.getElementById('batchCloseBtn')?.addEventListener('click', () => executeBatchClose());
  el.historyFilters?.addEventListener('click', (e) => { const c = e.target.closest('.filter-chip'); if (!c) return; historyFilter = c.dataset.filter; el.historyFilters.querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active')); c.classList.add('active'); renderHistory(); });
  el.historyList?.addEventListener('click', (e) => { const c = e.target.closest('.history-card'); if (c) navigateTo(AppView.DETAIL, { txnId: c.dataset.txnId }); });
  el.openDevConsoleBtn?.addEventListener('click', () => el.devConsole?.classList.add('visible'));
  el.closeDevConsoleBtn?.addEventListener('click', () => el.devConsole?.classList.remove('visible'));
  el.subBtn?.addEventListener('click', connectEventStream);
  el.unsubBtn?.addEventListener('click', disconnectEventStream);
  el.clearEventsBtn?.addEventListener('click', () => { if (el.eventLog) el.eventLog.innerHTML = ''; });
  el.queryTxnBtn?.addEventListener('click', () => { if (activeTxn) runQuery(activeTxn.requestId); });
  el.openConfigModalBtn?.addEventListener('click', () => openModal(el.configModal));
  el.configModal?.addEventListener('click', (e) => { if (e.target.closest('[data-modal-close]')) closeModal(el.configModal); });
  document.getElementById('queryMerchantBtn')?.addEventListener('click', queryMerchant);
  document.getElementById('queryTerminalsBtn')?.addEventListener('click', queryMerchantTerminals);
  ['backendUrl','envType','customBaseUrl','apiKey','appId','merchantId','terminalSn','currency','returnUrl'].forEach(id => { const n = el[id]; if (n) { n.addEventListener('input', saveConfig); n.addEventListener('change', saveConfig); } });
  ['tipEnabled','tipSuggestionsEnabled','taxEnabled','signatureEnabled'].forEach(id => { document.getElementById(id)?.addEventListener('change', () => { toggleSubSettings(); saveSettings(); }); });
  ['tipMode','tipOnScreenTip','tipWithTax','tipFeeMode','tipSuggestion1','tipSuggestion2','tipSuggestion3','taxRate','printReceipt','signatureMode','signatureThresholdEnabled','signatureThreshold'].forEach(id => { const n = document.getElementById(id); if (n) { n.addEventListener('change', saveSettings); n.addEventListener('input', saveSettings); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(el.configModal); });
}

function bootstrap() {
  initElements(); loadConfig(); loadTransactions(); loadSettings();
  const defaultBackend = getDefaultBackendUrl();
  if (el.backendUrl) { const cur = el.backendUrl.value; const isDeployed = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'; if (!cur || (isDeployed && cur.includes(':8000'))) { el.backendUrl.value = defaultBackend; saveConfig(); } }
  bindEvents(); navigateTo(AppView.MENU); setEventBadge('idle'); connectEventStream(); logEvent('☀️ SUNBAY Cloud Demo ready.');
}

bootstrap();

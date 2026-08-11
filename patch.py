import re

html_content = """<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SUNBAY Coffee Store Checkout</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  
  <header class="store-header">
    <div class="header-inner">
      <div class="logo">SUNBAY COFFEE</div>
      <button id="openDevConsoleBtn" class="dev-btn" title="Developer Console">{}</button>
    </div>
  </header>

  <main class="store-layout">
    <div class="checkout-grid">
      <!-- Left Column: Customer Information -->
      <section class="checkout-left">
        <h2>Checkout</h2>
        <div class="info-section">
          <h3>Customer Information</h3>
          <div class="field-list">
            <input type="email" placeholder="Email address" value="customer@example.com" />
          </div>
        </div>
        
        <div class="info-section">
          <h3>Billing Address</h3>
          <div class="field-list">
            <input type="text" placeholder="First Name" value="John" />
            <input type="text" placeholder="Last Name" value="Doe" />
            <select><option>United States</option></select>
            <input type="text" placeholder="Address" value="123 Coffee St" />
            <div class="field-row">
                <input type="text" placeholder="City" value="Seattle" />
                <input type="text" placeholder="State" value="WA" />
                <input type="text" placeholder="ZIP Code" value="98101" />
            </div>
          </div>
        </div>

        <div class="info-section">
            <h3>Payment Method</h3>
            <div class="payment-selection">
                <div class="payment-option border-active">
                    <label>
                        <input type="radio" checked disabled />
                        <span>Pay via SUNBAY Terminal</span>
                    </label>
                </div>
            </div>
        </div>
      </section>

      <!-- Right Column: Order Summary -->
      <section class="checkout-right">
        <div class="order-summary card">
          <h3>Order Summary</h3>
          <div id="productList" class="product-list"></div>
          
          <div class="divider"></div>
          
          <div class="summary-line">
            <span>Subtotal</span>
            <span id="orderAmountText">$0.00</span>
          </div>
          <div class="summary-line">
            <span>Tax (Estimated)</span>
            <span id="taxAmountText">$0.00</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="summary-line total-line">
            <span>Total</span>
            <span id="totalAmountText">$0.00</span>
          </div>
          
          <button id="runBtn" class="pay-button" type="button">Pay <span id="payBtnAmount">$0.00</span></button>
          
          <!-- Hidden auth button to keep logic valid -->
          <button id="runAuthBtn" style="display:none;" type="button">Auth</button>
        </div>
      </section>
    </div>
  </main>

  <!-- Payment Processing & Success Modal -->
  <div id="statusModal" class="modal hidden" aria-hidden="true">
    <button class="modal-backdrop" data-modal-close type="button"></button>
    <section class="modal-card payment-modal" role="dialog" aria-modal="true">
      
      <div id="loadingLifecycle" class="lifecycle">
        <div class="loader-spinner"></div>
        <div class="lifecycle-step active" id="currentEventStep">
           <h2 class="step-title" id="currentEventTitle">Processing Payment</h2>
           <p class="step-sub" id="currentEventSub">Connecting payment terminal...</p>
        </div>
        <p class="instruction-text">Please complete payment on the device.</p>
      </div>
      
      <div id="successView" style="display:none;" class="success-view">
         <div class="success-icon">✓</div>
         <h2>Payment Successful</h2>
         <p>Order #<span id="modalRef">-</span></p>
         <div class="success-amount" id="successAmountText">$0.00</div>
         
         <div class="success-actions">
           <button class="ghost-btn" data-modal-close>View Receipt</button>
           <button class="primary-btn" data-modal-close onclick="location.reload()">Continue Shopping</button>
         </div>
      </div>
      
      <div id="errorView" style="display:none;" class="error-view">
         <div class="error-icon">×</div>
         <h2>Payment Failed</h2>
         <p id="errorMsgText">Transaction declined or cancelled.</p>
         <button class="primary-btn" data-modal-close>Try Again</button>
      </div>
      
      <button id="closeStatusModal" class="hidden-btn" data-modal-close type="button">×</button>
      <!-- Needed for internal references -->
      <span id="statusModalTitle" style="display:none;"></span>
      <span id="modalReq" style="display:none;"></span>
      <span id="modalState" style="display:none;"></span>
      <span id="modalTerminalEvent" style="display:none;"></span>
      <span id="modalNotifyStatus" style="display:none;"></span>
      <div id="modalTimeline" style="display:none;"></div>
      <button id="modalQueryTxnBtn" style="display:none;"></button>
    </section>
  </div>

  <!-- Developer Console Sidebar -->
  <aside id="devConsole" class="dev-console">
    <div class="dev-console-header">
        <h3>Developer Console</h3>
        <button id="closeDevConsoleBtn" class="dev-btn">×</button>
    </div>
    <div class="dev-console-body">
        
        <div class="dev-section">
            <h4>Live Transaction</h4>
            <div id="txnStatusPanel" class="txn-status">
                <div><strong>Ref:</strong> <span id="txnRef">-</span></div>
                <div><strong>Req:</strong> <span id="txnReq">-</span></div>
                <div><strong>Status:</strong> <span id="txnState">Idle</span></div>
            </div>
            <button id="queryTxnBtn" class="dev-action-btn">Manual Query</button>
        </div>

        <div class="dev-section">
            <h4>Events Connection</h4>
            <span id="eventBadge" class="dev-badge idle">Disconnected</span>
            <div class="dev-btns-row">
                <button id="subBtn" class="dev-action-btn">Connect</button>
                <button id="unsubBtn" class="dev-action-btn">Disconnect</button>
                <button id="clearEventsBtn" class="dev-action-btn">Clear Flow</button>
            </div>
        </div>

        <div class="dev-section">
            <h4>Event Flow</h4>
            <div id="eventLog" class="event-log-container"></div>
        </div>
        
        <div class="dev-section">
            <h4>Configuration</h4>
            <button id="openConfigModalBtn" class="dev-action-btn">View Settings</button>
            <!-- Hide unneeded buttons -->
            <button id="openStatusModalBtn" style="display:none;"></button>
            <button id="openOpsModalBtn" style="display:none;"></button>
            <button id="openObserveModalBtn" style="display:none;"></button>
            <span id="modeBadge" style="display:none;"></span>
        </div>

        <div class="dev-section" style="display:none;">
            <!-- Hidden payload textareas so logic continues to work -->
            <textarea id="responsePayload"></textarea>
            <textarea id="requestPayload"></textarea>
            <div id="linkGroups"></div>
            <button id="rebuildBtn"></button>
            <span id="endpointHint"></span>
            <input id="eventUrl" />
        </div>
    </div>
  </aside>

  <!-- Configuration Modal (Kept for dev setup) -->
  <div id="configModal" class="modal hidden" aria-hidden="true">
    <button class="modal-backdrop" data-modal-close type="button"></button>
    <section class="modal-card modal-card--wide" role="dialog" aria-modal="true">
      <div class="modal-head">
        <h2>Configuration (Dev)</h2>
        <button class="icon-button" data-modal-close type="button">×</button>
      </div>
      <div class="field-grid">
        <label>Backend URL<input id="backendUrl" value="http://127.0.0.1:8000" /></label>
        <label>Env<select id="envType"><option value="uat" selected>UAT</option><option value="sandbox">Sandbox</option><option value="production">Production</option><option value="custom">Custom</option></select></label>
        <label>Custom Base URL<input id="customBaseUrl" value="https://open.sunbay-uat.us" /></label>
        <label>API Key<input id="apiKey" /></label>
        <label>App ID<input id="appId" value="smfut73g9wbwj9eb" /></label>
        <label>Merchant ID<input id="merchantId" value="M1263029001" /></label>
        <label>Terminal SN<input id="terminalSn" value="P339252L11100" /></label>
        <label>Currency<input id="currency" value="USD" /></label>
        <label>Notify URL<input id="notifyUrl" value="http://47.77.239.198/webhook/sunbay" readonly /></label>
        <label>Event URL<input id="configEventUrl" value="http://47.77.239.198/terminal-events/sunbay" readonly /></label>
        <label>Webhook Secret<input id="webhookSecret" /></label>
        <label>Return URL<input id="returnUrl" value="https://merchant.example.com/result" /></label>
      </div>
    </section>
  </div>
  
  <div id="opsModal" style="display:none;">
    <div id="primaryActions"></div>
    <select id="secondaryApi"></select>
    <button id="runSecondaryBtn"></button>
  </div>
  <div id="observeModal" style="display:none;"></div>
  <div id="statusPanelModal" style="display:none;"></div>

  <script src="./main.js"></script>
  <script>
    document.getElementById('openDevConsoleBtn').addEventListener('click', function() {
        document.getElementById('devConsole').classList.add('visible');
    });
    document.getElementById('closeDevConsoleBtn').addEventListener('click', function() {
        document.getElementById('devConsole').classList.remove('visible');
    });
  </script>
</body>
</html>"""
open("index.html", "w", encoding="utf-8").write(html_content)

css_content = """:root {
  --primary: #FF5A1F;
  --primary-hover: #E04812;
  --primary-transparent: rgba(255, 90, 31, 0.1);
  --background: #FFFFFF;
  --surface: #F9FAFB;
  --border: #E5E7EB;
  --text-main: #111827;
  --text-muted: #6B7280;
  --success: #10B981;
  --error: #EF4444;
}

* { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
body { margin: 0; background: var(--surface); color: var(--text-main); font-size: 14px; }
h1, h2, h3, h4 { margin: 0; color: var(--text-main); font-weight: 600; }
a { color: var(--primary); text-decoration: none; }
button { cursor: pointer; border: none; font: inherit; }
input, select { font: inherit; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px; width: 100%; outline: none; }
input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-transparent); }

/* Header */
.store-header { background: var(--background); border-bottom: 1px solid var(--border); padding: 16px 32px; display: flex; justify-content: center; }
.header-inner { width: 100%; max-width: 1080px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 18px; font-weight: 800; letter-spacing: 1px; color: var(--primary); }
.dev-btn { background: transparent; padding: 6px; border: 1px solid var(--border); border-radius: 4px; color: var(--text-muted); font-size: 12px; }

/* Layout */
.store-layout { max-width: 1080px; margin: 40px auto; padding: 0 20px; }
.checkout-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; }
@media (max-width: 768px) {
  .checkout-grid { grid-template-columns: 1fr; display: flex; flex-direction: column-reverse; }
}

/* Left Column */
.checkout-left h2 { font-size: 24px; margin-bottom: 24px; }
.info-section { margin-bottom: 32px; }
.info-section h3 { font-size: 16px; margin-bottom: 16px; }
.field-list { display: grid; gap: 12px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

.payment-selection { display: grid; gap: 10px; }
.payment-option { border: 1px solid var(--border); border-radius: 6px; padding: 14px; background: var(--background); display: flex; align-items: center; }
.payment-option.border-active { border-color: var(--primary); background: var(--primary-transparent); }
.payment-option label { display: flex; align-items: center; gap: 10px; cursor: pointer; width:100%; font-weight: 500;}
.payment-option input { width: auto; margin:0; accent-color: var(--primary); }
.payment-option input:disabled { opacity: 1; }

/* Right Column (Summary) */
.order-summary { background: var(--background); border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.04); border: 1px solid var(--border); position: sticky; top: 40px; }
.order-summary h3 { font-size: 18px; margin-bottom: 24px; }
.divider { height: 1px; background: var(--border); margin: 16px 0; }

.product-list { display: grid; gap: 16px; margin-bottom: 24px; }
.product { display: flex; align-items: center; justify-content: space-between; }
.product-info { display: flex; align-items: center; gap: 12px; }
.product-icon { width: 48px; height: 48px; border-radius: 8px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size:24px;}
.product-name { font-weight: 500; margin-bottom: 4px; }
.product-desc { font-size: 12px; color: var(--text-muted); }
.stepper-mini { display: inline-flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 2px; }
.stepper-mini button { width: 24px; height: 24px; background: transparent; color: var(--text-main); font-weight: 600; font-size: 14px; border-radius: 3px; }
.stepper-mini button:hover { background: #E5E7EB; }
.stepper-mini span { min-width: 14px; text-align: center; font-size: 13px; font-weight: 500; }
.product-price { font-weight: 600; }

.summary-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; color: var(--text-muted); }
.total-line { color: var(--text-main); font-size: 18px; font-weight: 700; margin-top: 4px; margin-bottom: 24px; }

.pay-button { width: 100%; padding: 14px; background: var(--primary); color: white; font-weight: 600; font-size: 16px; border-radius: 8px; transition: background 0.2s; }
.pay-button:hover { background: var(--primary-hover); }
.pay-button:disabled { opacity: 0.6; cursor: not-allowed; }

/* Modals */
.modal { position: fixed; inset: 0; z-index: 999; display: flex; align-items: center; justify-content: center; visibility: hidden; opacity: 0; transition: all 0.2s; }
.modal:not(.hidden) { visibility: visible; opacity: 1; display:flex;}
.modal.hidden { display: none !important; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.4); width: 100%; border: none; cursor: default; }
.payment-modal { position: relative; background: var(--background); border-radius: 12px; padding: 32px; width: 400px; max-width: 90vw; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.modal-card--wide { width: 700px; max-width: 95vw; background: var(--background); padding: 24px; border-radius: 12px; position:relative; z-index: 1000; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;}
.icon-button { background:transparent; font-size:24px; color:var(--text-muted);}
.hidden-btn { display: none; }

/* Loading State */
.lifecycle { display: flex; flex-direction: column; align-items: center; }
.loader-spinner { width: 48px; height: 48px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 24px; }
@keyframes spin { to { transform: rotate(360deg); } }
.step-title { font-size: 18px; margin-bottom: 8px; }
.step-sub { color: var(--text-muted); font-size: 14px; margin-bottom: 16px; font-weight: 500;}
.instruction-text { background: var(--surface); padding: 12px 16px; border-radius: 6px; font-size: 13px; color: var(--text-main); font-weight: 500; border: 1px dashed var(--border);}

/* Success & Error State */
.success-icon { width: 56px; height: 56px; background: var(--success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; }
.error-icon { width: 56px; height: 56px; background: var(--error); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px; }
.success-view p, .error-view p { color: var(--text-muted); margin-top: 8px; margin-bottom: 8px; }
.success-amount { font-size: 32px; font-weight: 700; margin: 16px 0 24px; }
.success-actions { display: flex; flex-direction: column; gap: 10px; }
.primary-btn { width: 100%; padding: 12px; background: var(--primary); color: white; font-weight: 600; border-radius: 8px; }
.ghost-btn { width: 100%; padding: 12px; background: var(--background); color: var(--text-main); border: 1px solid var(--border); font-weight: 600; border-radius: 8px; }

/* Developer Console */
.dev-console { position: fixed; right: 0; top: 0; bottom: 0; width: 340px; background: #FAFAFA; border-left: 1px solid var(--border); z-index: 1000; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s; box-shadow: -4px 0 15px rgba(0,0,0,0.05);}
.dev-console.visible { transform: translateX(0); }
.dev-console-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #fff; }
.dev-console-body { flex: 1; overflow-y: auto; padding: 20px; }
.dev-section { margin-bottom: 24px; }
.dev-section h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 12px; }
.txn-status { background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: 12px; font-family: monospace; font-size: 12px; margin-bottom: 10px; display: grid; gap: 6px; }
.dev-action-btn { background: #F3F4F6; border: 1px solid var(--border); border-radius: 4px; padding: 6px 12px; font-size: 12px; font-weight: 600; margin-right: 6px; margin-bottom: 6px; }
.dev-action-btn:hover { background: #E5E7EB; }
.dev-badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; border: 1px solid; display: inline-block; margin-bottom: 12px; }
.dev-badge.idle { background: #F3F4F6; border-color: var(--border); }
.dev-badge.connecting { background: #FEF3C7; border-color: #FCD34D; color: #92400E; }
.dev-badge.connected { background: #D1FAE5; border-color: #34D399; color: #065F46; }
.dev-badge.error { background: #FEE2E2; border-color: #F87171; color: #991B1B; }
.event-log-container { background: #1E1E1E; border-radius: 6px; height: 300px; overflow-y: auto; padding: 12px; color: #fff; font-family: monospace; font-size: 11px; }
.event-item { margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 8px; }
.event-item:last-child { border-bottom: none; }
.event-time { color: #888; font-size: 10px; margin-bottom: 2px; }

.field-grid { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
.field-grid label { display: flex; flex-direction: column; gap: 4px; font-weight: 500; }
"""
open("style.css", "w", encoding="utf-8").write(css_content)

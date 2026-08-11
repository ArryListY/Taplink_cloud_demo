import re

html_content = """<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SUNBAY Coffee Store</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  
  <header class="store-header">
    <div class="header-inner">
      <div class="logo">
         <span class="logo-icon">☀️</span> SUNBAY COFFEE
      </div>
      <button id="openDevConsoleBtn" class="dev-btn" title="Developer Console">{}</button>
    </div>
  </header>

  <!-- View 1: Menu Selection -->
  <main id="menuView" class="store-layout">
    <div class="hero-banner">
      <h1>Order Ahead</h1>
      <p>Freshly brewed and ready for pickup.</p>
    </div>
    
    <h2 class="section-title">Menu</h2>
    <div class="menu-grid" id="menuGrid"></div>
  </main>

  <!-- Floating Cart -->
  <div id="floatingCart" class="floating-cart hidden">
     <div class="floating-cart-inner">
        <div class="cart-info">
           <span id="cartCountBadge" class="cart-badge">0</span>
           <span class="cart-label">Items selected</span>
        </div>
        <button id="goToCheckoutBtn" class="pay-button">View Cart - <span id="cartTotalFloat">$0.00</span></button>
     </div>
  </div>

  <!-- View 2: Checkout -->
  <main id="checkoutView" class="store-layout hidden">
    <button id="backToMenuBtn" class="back-btn">&#8592; Back to Menu</button>
    
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
            <div class="field-row">
                <input type="text" placeholder="First Name" value="John" />
                <input type="text" placeholder="Last Name" value="Doe" />
            </div>
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
          <!-- The Cart Items go here -->
          <div id="cartList" class="cart-list"></div>
          
          <div class="divider"></div>
          
          <div class="summary-line">
            <span>Subtotal</span>
            <span id="orderAmountText">$0.00</span>
          </div>
          <div class="summary-line">
            <span>Tax (Estimated 8%)</span>
            <span id="taxAmountText">$0.00</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="summary-line total-line">
            <span>Total</span>
            <span id="totalAmountText">$0.00</span>
          </div>
          
          <button id="runBtn" class="pay-button" type="button" disabled>Pay <span id="payBtnAmount">$0.00</span></button>
          
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
         <div class="success-icon">&#10003;</div>
         <h2>Payment Successful</h2>
         <p>Order #<span id="modalRef">-</span></p>
         <div class="success-amount" id="successAmountText">$0.00</div>
         
         <div class="success-actions">
           <button class="ghost-btn" data-modal-close>View Receipt</button>
           <button class="primary-btn" data-modal-close onclick="location.reload()">Continue Shopping</button>
         </div>
      </div>
      
      <div id="errorView" style="display:none;" class="error-view">
         <div class="error-icon">&#10005;</div>
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
        <button id="closeDevConsoleBtn" class="dev-btn">&#10005;</button>
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
        <button class="icon-button" data-modal-close type="button">&#10005;</button>
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
  --primary: #F05C35;
  --primary-hover: #D9461F;
  --primary-transparent: rgba(240, 92, 53, 0.1);
  --background: #FDFBF7;
  --surface: #FFFFFF;
  --border: #E8E3DF;
  --text-main: #2A2421;
  --text-muted: #756D69;
  --text-light: #A39B97;
  --success: #1E9E61;
  --error: #E03B3B;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

* { box-sizing: border-box; font-family: var(--font-body); }
body { margin: 0; background: var(--background); color: var(--text-main); font-size: 14px; -webkit-font-smoothing: antialiased;}
h1, h2, h3, h4 { margin: 0; color: var(--text-main); font-weight: 700; }
a { color: var(--primary); text-decoration: none; }
button { cursor: pointer; border: none; font: inherit; }
input, select { font: inherit; padding: 12px 14px; border: 1px solid var(--border); border-radius: 8px; width: 100%; outline: none; background: #fff;}
input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-transparent); }

/* Header */
.store-header { background: var(--background); padding: 24px 32px 16px; display: flex; justify-content: center; }
.header-inner { width: 100%; max-width: 1080px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 20px; font-weight: 800; letter-spacing: 0.5px; color: var(--primary); display: flex; align-items: center; gap: 8px;}
.dev-btn { background: transparent; padding: 8px; border: 1px solid transparent; border-radius: 6px; color: var(--text-muted); font-size: 14px; display:flex; align-items:center; justify-content:center;}
.dev-btn:hover { background: rgba(0,0,0,0.05); }

/* Layout */
.store-layout { max-width: 1080px; margin: 0 auto; padding: 20px; }
.checkout-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 60px; }
@media (max-width: 800px) {
  .checkout-grid { grid-template-columns: 1fr; display: flex; flex-direction: column-reverse; gap: 40px;}
}

/* Menu Page */
.hero-banner { 
    padding: 60px 40px; 
    background: linear-gradient(135deg, #FCEFE9 0%, #F5D3C8 100%);
    border-radius: 20px;
    margin-bottom: 48px;
    text-align: center;
    color: #5C2210;
}
.hero-banner h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; letter-spacing:-0.5px;}
.hero-banner p { font-size: 18px; opacity: 0.85; margin:0;}

.section-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; padding-left: 4px; }

.menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; margin-bottom: 120px; }
.menu-card { 
    background: var(--surface); 
    border-radius: 20px; 
    overflow: hidden; 
    box-shadow: 0 4px 16px rgba(0,0,0,0.03); 
    border: 1px solid var(--border);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; flex-direction: column;
}
.menu-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
.menu-icon { 
    background: #F8F5F1; 
    height: 160px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 72px; 
}
.menu-info { padding: 20px; display: flex; flex-direction: column; flex: 1;}
.menu-info h4 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.menu-info p { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; line-height: 1.5; flex: 1;}

.menu-action { display: flex; justify-content: space-between; align-items: center; margin-top: auto;}
.menu-action .price { font-weight: 700; font-size: 16px; color: var(--text-main);}
.add-btn { 
    background: var(--surface); 
    border: 1px solid #D5CEC8; 
    padding: 8px 20px; 
    border-radius: 99px; 
    font-weight: 600; 
    color: var(--text-main);
    transition: all 0.2s;
}
.add-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-transparent);}

.stepper-mini, .stepper-ui { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid #D5CEC8; border-radius: 99px; padding: 4px; }
.stepper-mini button, .stepper-ui button { width: 32px; height: 32px; border-radius: 50%; background: transparent; color: var(--text-main); font-weight: 600; font-size: 18px; display:flex; align-items:center; justify-content:center; padding-bottom: 2px;}
.stepper-mini button:hover, .stepper-ui button:hover { background: #F3F0EC; }
.stepper-mini span, .stepper-ui span { min-width: 16px; text-align: center; font-weight: 600; font-size: 14px; }

/* Floating Cart */
.floating-cart { 
    position: fixed; bottom: 0; left: 0; right: 0; 
    pointer-events: none; 
    padding: 24px;
    display: flex; justify-content: center;
    z-index: 100;
    transition: transform 0.4s cubic-bezier(0.2, 0, 0, 1), opacity 0.4s;
}
.floating-cart.hidden { transform: translateY(120px); opacity: 0; }
.floating-cart-inner { 
    pointer-events: auto;
    background: #1A1614; 
    color: white; 
    padding: 16px 16px 16px 32px; 
    border-radius: 99px; 
    display: flex; 
    align-items: center; 
    gap: 32px; 
    box-shadow: 0 16px 40px rgba(0,0,0,0.3); 
}
.cart-info { display: flex; align-items: center; gap: 12px; }
.cart-badge { background: var(--primary); color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
.cart-label { font-weight: 600; font-size: 15px;}
.floating-cart-inner .pay-button { margin-top: 0; padding: 14px 32px; border-radius: 99px; width: auto;}

/* Checkout Left Column */
.back-btn { background: transparent; color: var(--text-muted); padding: 8px 0; margin-bottom: 24px; display: inline-block; font-weight: 600; font-size: 15px;}
.back-btn:hover { color: var(--text-main); }

.checkout-left h2 { font-size: 28px; margin-bottom: 32px; letter-spacing: -0.5px;}
.info-section { margin-bottom: 40px; }
.info-section h3 { font-size: 18px; margin-bottom: 20px; }
.field-list { display: grid; gap: 16px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.payment-selection { display: grid; gap: 12px; }
.payment-option { border: 1px solid var(--border); border-radius: 12px; padding: 18px; background: var(--surface); display: flex; align-items: center; }
.payment-option.border-active { border-color: var(--primary); background: var(--primary-transparent); }
.payment-option label { display: flex; align-items: center; gap: 12px; cursor: pointer; width:100%; font-weight: 500; font-size: 15px;}
.payment-option input { width: auto; margin:0; accent-color: var(--primary); transform: scale(1.2);}
.payment-option input:disabled { opacity: 1; }

/* Checkout Right Column (Summary) */
.order-summary { 
    background: var(--surface); 
    border-radius: 20px; 
    padding: 32px; 
    box-shadow: 0 8px 24px rgba(0,0,0,0.04); 
    border: 1px solid #E8E3DF; 
    position: sticky; top: 40px; 
}
.order-summary h3 { font-size: 20px; margin-bottom: 24px; }
.divider { height: 1px; background: var(--border); margin: 24px 0; }

.cart-list { display: grid; gap: 20px; }
.cart-item { display: flex; justify-content: space-between; align-items: center; }
.cart-item-info { display: flex; gap: 16px; align-items: center;}
.cart-item-icon { width: 56px; height: 56px; background: #F8F5F1; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px;}
.cart-item-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; color: var(--text-main);}
.cart-item-price { font-size: 14px; color: var(--text-muted); }
.cart-item .stepper-mini { background: transparent; border: 1px solid var(--border);}

.summary-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: var(--text-muted); font-size: 15px;}
.total-line { color: var(--text-main); font-size: 20px; font-weight: 800; margin-top: 8px; margin-bottom: 32px; }

.pay-button { width: 100%; padding: 18px; background: var(--primary); color: white; font-weight: 700; font-size: 18px; border-radius: 12px; transition: background 0.2s, transform 0.1s; margin-top: 10px;}
.pay-button:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px);}
.pay-button:disabled { opacity: 0.5; cursor: not-allowed; }

/* Modals */
.modal { position: fixed; inset: 0; z-index: 999; display: flex; align-items: center; justify-content: center; visibility: hidden; opacity: 0; transition: all 0.2s; }
.modal:not(.hidden) { visibility: visible; opacity: 1; display:flex;}
.modal.hidden { display: none !important; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(26, 22, 20, 0.6); width: 100%; border: none; cursor: default; }
.payment-modal { position: relative; background: var(--surface); border-radius: 24px; padding: 40px; width: 440px; max-width: 90vw; text-align: center; box-shadow: 0 24px 48px rgba(0,0,0,0.15); }
.modal-card--wide { width: 700px; max-width: 95vw; background: var(--surface); padding: 32px; border-radius: 20px; position:relative; z-index: 1000; box-shadow: 0 24px 48px rgba(0,0,0,0.15); }
.modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;}
.icon-button { background:transparent; font-size:24px; color:var(--text-muted);}
.hidden-btn { display: none; }

/* Loading State */
.lifecycle { display: flex; flex-direction: column; align-items: center; padding: 20px 0;}
.loader-spinner { width: 56px; height: 56px; border: 4px solid #F3F0EC; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 32px; }
@keyframes spin { to { transform: rotate(360deg); } }
.step-title { font-size: 22px; margin-bottom: 12px; font-weight: 700;}
.step-sub { color: var(--text-muted); font-size: 15px; margin-bottom: 24px; font-weight: 500;}
.instruction-text { background: #F8F5F1; padding: 16px 20px; border-radius: 12px; font-size: 14px; color: var(--text-main); font-weight: 500; border: 1px dashed #D5CEC8;}

/* Success & Error State */
.success-icon { width: 64px; height: 64px; background: var(--success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 24px; box-shadow: 0 8px 16px rgba(30, 158, 97, 0.2);}
.error-icon { width: 64px; height: 64px; background: var(--error); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 24px; box-shadow: 0 8px 16px rgba(224, 59, 59, 0.2); }
.success-view p, .error-view p { color: var(--text-muted); margin-top: 8px; margin-bottom: 8px; font-size: 15px;}
.success-amount { font-size: 40px; font-weight: 800; margin: 16px 0 32px; color: var(--text-main); letter-spacing: -1px;}
.success-actions, .error-view { display: flex; flex-direction: column; gap: 12px; width: 100%;}
.primary-btn { width: 100%; padding: 16px; background: var(--primary); color: white; font-weight: 700; border-radius: 12px; font-size: 16px; transition: background 0.2s;}
.primary-btn:hover { background: var(--primary-hover); }
.ghost-btn { width: 100%; padding: 16px; background: var(--surface); color: var(--text-main); border: 1px solid var(--border); font-weight: 600; border-radius: 12px; font-size: 16px; transition: background 0.2s;}
.ghost-btn:hover { background: #F8F5F1; }

/* Developer Console */
.dev-console { position: fixed; right: 0; top: 0; bottom: 0; width: 380px; background: #FAFAFA; border-left: 1px solid var(--border); z-index: 1000; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1); box-shadow: -8px 0 24px rgba(0,0,0,0.05);}
.dev-console.visible { transform: translateX(0); }
.dev-console-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #fff; }
.dev-console-header h3 { font-size: 16px; color: var(--text-main); }
.dev-console-body { flex: 1; overflow-y: auto; padding: 24px; }
.dev-section { margin-bottom: 32px; }
.dev-section h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 16px; font-weight: 700;}
.txn-status { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; margin-bottom: 12px; display: grid; gap: 8px; }
.txn-status strong { color: var(--text-muted); font-weight: normal; }
.dev-action-btn { background: #E5E7EB; color: #374151; border: none; border-radius: 6px; padding: 8px 16px; font-size: 13px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; transition: background 0.2s;}
.dev-action-btn:hover { background: #D1D5DB; }
.dev-badge { padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; border: 1px solid; display: inline-block; margin-bottom: 16px; }
.dev-badge.idle { background: #F3F4F6; border-color: var(--border); }
.dev-badge.connecting { background: #FEF3C7; border-color: #FCD34D; color: #92400E; }
.dev-badge.connected { background: #D1FAE5; border-color: #34D399; color: #065F46; }
.dev-badge.error { background: #FEE2E2; border-color: #F87171; color: #991B1B; }
.event-log-container { background: #1A1A1A; border-radius: 8px; height: 320px; overflow-y: auto; padding: 16px; color: #E5E5E5; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; }
.event-item { margin-bottom: 12px; border-bottom: 1px dashed #333; padding-bottom: 12px; }
.event-item:last-child { border-bottom: none; padding-bottom: 0px;}
.event-time { color: #888; font-size: 11px; margin-bottom: 4px; }

.field-grid { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }
.field-grid label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: var(--text-muted); font-size: 13px;}
"""
open("style.css", "w", encoding="utf-8").write(css_content)

mainJs = open('main.js', 'r', encoding='utf-8').read()

# 1. Update PRODUCTS
new_products = """const PRODUCTS = [
  { id: "p1", name: "Americano", icon: "☕️", desc: "Fresh pulled espresso with hot water", priceCents: 550, qty: 0 },
  { id: "p2", name: "Blueberry Muffin", icon: "🧁", desc: "Freshly baked every morning", priceCents: 420, qty: 0 },
  { id: "p3", name: "Croissant", icon: "🥐", desc: "Classic buttery French pastry", priceCents: 390, qty: 0 },
  { id: "p4", name: "Cold Brew", icon: "🧊", desc: "Slow steeped for 24 hours", priceCents: 680, qty: 0 },
];"""
mainJs = re.sub(r'const PRODUCTS = \[[\s\S]*?\];', new_products, mainJs)

# 2. Extract DOM variables
# We'll just replace the entire const el = { ... } object to guarantee the maps are exact
el_new = """const el = {
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
  webhookSecret: document.getElementById("webhookSecret"),
  returnUrl: document.getElementById("returnUrl"),

  modeBadge: document.getElementById("modeBadge"),
  eventBadge: document.getElementById("eventBadge"),
  openStatusModalBtn: document.getElementById("openStatusModalBtn"),
  openConfigModalBtn: document.getElementById("openConfigModalBtn"),
  openOpsModalBtn: document.getElementById("openOpsModalBtn"),
  openObserveModalBtn: document.getElementById("openObserveModalBtn"),

  orderAmountText: document.getElementById("orderAmountText"),
  totalAmountText: document.getElementById("totalAmountText"),
  runBtn: document.getElementById("runBtn"),
  runAuthBtn: document.getElementById("runAuthBtn"),

  // Views & Lists
  menuView: document.getElementById("menuView"),
  checkoutView: document.getElementById("checkoutView"),
  menuGrid: document.getElementById("menuGrid"),
  cartList: document.getElementById("cartList"),
  floatingCart: document.getElementById("floatingCart"),
  cartCountBadge: document.getElementById("cartCountBadge"),
  cartTotalFloat: document.getElementById("cartTotalFloat"),
  goToCheckoutBtn: document.getElementById("goToCheckoutBtn"),
  backToMenuBtn: document.getElementById("backToMenuBtn"),

  // Modals
  statusPanelModal: document.getElementById("statusPanelModal"),
  txnRef: document.getElementById("txnRef"),
  txnReq: document.getElementById("txnReq"),
  txnState: document.getElementById("txnState"),
  txnStatusPanel: document.getElementById("txnStatusPanel"),
  queryTxnBtn: document.getElementById("queryTxnBtn"),

  configModal: document.getElementById("configModal"),
  configFields: {
    backendUrl: document.getElementById("backendUrl"),
    envType: document.getElementById("envType"),
    customBaseUrl: document.getElementById("customBaseUrl"),
    apiKey: document.getElementById("apiKey"),
    appId: document.getElementById("appId"),
    merchantId: document.getElementById("merchantId"),
    terminalSn: document.getElementById("terminalSn"),
    currency: document.getElementById("currency"),
    webhookSecret: document.getElementById("webhookSecret"),
    returnUrl: document.getElementById("returnUrl"),
  },

  opsModal: document.getElementById("opsModal"),
  primaryActions: document.getElementById("primaryActions"),
  secondaryApi: document.getElementById("secondaryApi"),
  runSecondaryBtn: document.getElementById("runSecondaryBtn"),

  observeModal: document.getElementById("observeModal"),
  rebuildBtn: document.getElementById("rebuildBtn"),
  endpointHint: document.getElementById("endpointHint"),
  eventUrl: document.getElementById("eventUrl"),
  subBtn: document.getElementById("subBtn"),
  unsubBtn: document.getElementById("unsubBtn"),
  clearEventsBtn: document.getElementById("clearEventsBtn"),
  responsePayload: document.getElementById("responsePayload"),
  requestPayload: document.getElementById("requestPayload"),
  eventLog: document.getElementById("eventLog"),
  linkGroups: document.getElementById("linkGroups"),

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
};"""
mainJs = re.sub(r'const el = \{[\s\S]*?modalQueryTxnBtn.*?,\n\};', el_new, mainJs)

# 3. Handle Render Products
render_products_new = """function renderProducts() {
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
}"""
mainJs = re.sub(r'function renderProducts\(\) \{[\s\S]*?\}\n\}', render_products_new, mainJs)


# 4. Handle Compute Amount
compute_amount_new = """function computeAmount() {
  const total = PRODUCTS.reduce((sum, p) => sum + p.priceCents * p.qty, 0);
  const totalQty = PRODUCTS.reduce((sum, p) => sum + p.qty, 0);
  // estimated tax 8%
  const tax = Math.round(total * 0.08); 
  const grandTotal = total + tax;

  if (el.orderAmountText) el.orderAmountText.textContent = formatMoney(total);
  const taxAmountText = document.getElementById("taxAmountText");
  if (taxAmountText) taxAmountText.textContent = formatMoney(tax);
  if (el.totalAmountText) el.totalAmountText.textContent = formatMoney(grandTotal);
  
  const payBtnAmount = document.getElementById("payBtnAmount");
  if(payBtnAmount) payBtnAmount.textContent = formatMoney(grandTotal);

  if (el.cartTotalFloat) el.cartTotalFloat.textContent = formatMoney(grandTotal);
  if (el.cartCountBadge) el.cartCountBadge.textContent = totalQty;

  // Toggle run button
  if (el.runBtn) {
     el.runBtn.disabled = totalQty === 0;
  }

  // Toggle floating cart
  if (el.floatingCart) {
     if (totalQty > 0 && el.checkoutView && el.checkoutView.classList.contains("hidden")) {
         el.floatingCart.classList.remove("hidden");
     } else {
         el.floatingCart.classList.add("hidden");
     }
  }

  return { total, tax, grandTotal };
}"""
mainJs = re.sub(r'function computeAmount\(\) \{[\s\S]*?return \{ total, tax, grandTotal \};\n\}', compute_amount_new, mainJs)


# 5. Fix UI bindings
bind_events_new = """function bindEvents() {
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

  el.primaryActions.addEventListener("click", (event) => {"""
mainJs = re.sub(r'function bindEvents\(\) \{\n  el\.productList\.addEventListener\("click", \(event\) => \{[\s\S]*?rebuildRequest\(selectedApiId\);\n  \}\);\n\n  el\.primaryActions\.addEventListener\("click", \(event\) => \{', bind_events_new, mainJs)

open('main.js', 'w', encoding='utf-8').write(mainJs)

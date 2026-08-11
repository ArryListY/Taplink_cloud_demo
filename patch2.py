import re

mainJs = open('main.js', 'r', encoding='utf-8').read()

# Update product rendering to match the new UI
render_products_new = """function renderProducts() {
  el.productList.innerHTML = "";
  for (const p of PRODUCTS) {
    const node = document.createElement("div");
    node.className = "product";
    node.innerHTML = `
      <div class="product-info">
        <div class="product-icon">☕️</div>
        <div>
           <div class="product-name">${p.name}</div>
           <div class="stepper-mini">
              <button data-op="sub" data-id="${p.id}" type="button">-</button>
              <span>${p.qty}</span>
              <button data-op="add" data-id="${p.id}" type="button">+</button>
           </div>
        </div>
      </div>
      <div class="product-price">${formatMoney(p.priceCents)}</div>
    `;
    el.productList.appendChild(node);
  }
}"""
mainJs = re.sub(r'function renderProducts\(\) \{[\s\S]*?el\.productList\.appendChild\(node\);\n  \}\n\}', render_products_new, mainJs)

# Support showing Success View properly and updating checkout button amount
update_txn_status_new = """function updateTxnStatus(state, payload = {}) {
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
}"""

mainJs = re.sub(r'function updateTxnStatus\(state, payload = \{\}\) \{[\s\S]*?if \(el\.loadingLifecycle\) el\.loadingLifecycle\.style\.display = "flex";\n\}', update_txn_status_new, mainJs)

# Fix computing amount text format
compute_amount_new = """function computeAmount() {
  const total = PRODUCTS.reduce((sum, p) => sum + p.priceCents * p.qty, 0);
  // Optional tax logic (eg. 8%)
  const tax = Math.round(total * 0.08); 
  const grandTotal = total + tax;

  if (el.orderAmountText) el.orderAmountText.textContent = formatMoney(total);
  const taxAmountText = document.getElementById("taxAmountText");
  if (taxAmountText) taxAmountText.textContent = formatMoney(tax);
  if (el.totalAmountText) el.totalAmountText.textContent = formatMoney(grandTotal);
  
  const payBtnAmount = document.getElementById("payBtnAmount");
  if(payBtnAmount) payBtnAmount.textContent = formatMoney(grandTotal);

  return { total, tax, grandTotal };
}"""
mainJs = re.sub(r'function computeAmount\(\) \{[\s\S]*?return total;\n\}', compute_amount_new, mainJs)

# Update the amount value mapped inside buildContext to be the grandtotal
build_context_new = """function buildContext() {
  const amounts = computeAmount();
  const total = amounts.grandTotal;
  const requestId = requestIdUuid();
  const orderId = `OID-${Date.now().toString().slice(-6)}`;
  return {
    appId: el.configFields.appId.value.trim(),
    merchantId: el.configFields.merchantId.value.trim(),
    amount: { orderAmount: total, priceCurrency: el.configFields.currency.value.trim() },
    orderId,
    requestId,
    terminalSn: el.configFields.terminalSn.value.trim(),
    description: "SUNBAY Coffee Store Order",
    notifyUrl: getNotifyUrl(),
    terminalEventNotifyUrl: getTerminalEventNotifyUrl(),
  };
}"""
mainJs = re.sub(r'function buildContext\(\) \{[\s\S]*?terminalEventNotifyUrl: getTerminalEventNotifyUrl\(\),\n  \};\n\}', build_context_new, mainJs)

open('main.js', 'w', encoding='utf-8').write(mainJs)

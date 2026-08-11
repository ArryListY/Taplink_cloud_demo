import re

mainJs = open('main.js', 'r', encoding='utf-8').read()

# Fix button text when resetting
mainJs = mainJs.replace('el.runBtn.textContent = "执行中...";', 'el.runBtn.innerHTML = "Processing...";')
mainJs = mainJs.replace('el.runBtn.textContent = "Sale · 收款";', 'el.runBtn.innerHTML = `Pay <span id="payBtnAmount">${formatMoney(computeAmount().grandTotal)}</span>`;')

# Ensure resetting modal hides everything properly
reset_modal_new = """function resetModalForTxn(payload) {
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
}"""
mainJs = re.sub(r'function resetModalForTxn\(payload\) \{[\s\S]*?showStatusModal\(\);\n\}', reset_modal_new, mainJs)

# Fix openModal to add .is-open
open_modal_new = """function openModal(modal, opener = document.activeElement) {
  if (!modal) return;
  activeModal = modal;
  modalOpener = opener;
  modal.classList.remove("hidden");
  // force reflow
  void modal.offsetWidth;
  modal.classList.add("is-open");
}"""
mainJs = re.sub(r'function openModal\(modal, opener = document\.activeElement\) \{[\s\S]*?modal\.classList\.add\("is-open"\);\n\}', open_modal_new, mainJs)

open('main.js', 'w', encoding='utf-8').write(mainJs)

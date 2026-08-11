import re

indexHtml = open('index.html', 'r', encoding='utf-8').read()
indexHtml = indexHtml.replace('<p>选择商品后直接发起 Sale 或 Auth；交易最终状态以服务端回调为准。</p>', '<p>选择商品后直接发起收款。终端事件将实时显示，收到终态即结束订单。</p>')

pattern = r'<div class="lifecycle">\n\s*<div class="lifecycle-step" id="stepPlaced">[\s\S]*?</div>\n\s*</div>'
replacement = """<div class="lifecycle" id="loadingLifecycle">
        <div class="loader-spinner"></div>
        <div class="lifecycle-step active" id="currentEventStep">
           <div class="step-title" id="currentEventTitle">拉起支付...</div>
           <div class="step-sub" id="currentEventSub">等待终端响应</div>
        </div>
      </div>"""
indexHtml = re.sub(pattern, replacement, indexHtml)
open('index.html', 'w', encoding='utf-8').write(indexHtml)


styleCss = open('style.css', 'r', encoding='utf-8').read()
pattern_lifecycle_css = r'\.lifecycle { display: grid; grid-template-columns: repeat\(4, minmax\(0, 1fr\)\); ga\np: 9px; margin-top: 14px; }'
replacement_lifecycle_css = '.lifecycle { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; margin-top: 24px; padding: 24px 0; }'
styleCss = re.sub(pattern_lifecycle_css, replacement_lifecycle_css, styleCss)

pattern_step_css1 = r'\.lifecycle-step { border: 1px solid var\(--outline-variant\); border-radius: 12px;\n padding: 10px; background: var\(--surface-variant\); }'
pattern_step_css2 = r'\.lifecycle-step { border: 1px solid var\(--outline-variant\); border-radius: 12px; padding: 10px; background: var\(--surface-variant\); }'
replacement_step_css = '.lifecycle-step { width: 100%; max-width: 400px; text-align: center; border: 1px solid var(--outline-variant); border-radius: 12px; padding: 16px; background: var(--surface-variant); transition: all 0.3s ease; }'
styleCss = re.sub(pattern_step_css1, replacement_step_css, styleCss)
styleCss = re.sub(pattern_step_css2, replacement_step_css, styleCss)

styleCss = styleCss.replace('.lifecycle-step .step-title { font-size: 0.79rem; font-weight: 800; }', '.lifecycle-step .step-title { font-size: 1rem; font-weight: 800; }')
styleCss = re.sub(r'\.lifecycle-step \.step-sub \{ margin-top: 4px; color: var\(--muted\); font-size: 0\.6\n7rem; line-height: 1\.35; \}', '.lifecycle-step .step-sub { margin-top: 8px; color: var(--muted); font-size: 0.85rem; line-height: 1.4; }', styleCss)
styleCss = styleCss.replace('.lifecycle-step .step-sub { margin-top: 4px; color: var(--muted); font-size: 0.67rem; line-height: 1.35; }', '.lifecycle-step .step-sub { margin-top: 8px; color: var(--muted); font-size: 0.85rem; line-height: 1.4; }')
styleCss = re.sub(r'\.field-grid, \.totals, \.checkout-paybar, \.modal-meta, \.lifecycle \{ grid-templat\ne-columns: 1fr; \}', '.field-grid, .totals, .checkout-paybar, .modal-meta { grid-template-columns: 1fr; }', styleCss)
styleCss = styleCss.replace('.field-grid, .totals, .checkout-paybar, .modal-meta, .lifecycle { grid-template-columns: 1fr; }', '.field-grid, .totals, .checkout-paybar, .modal-meta { grid-template-columns: 1fr; }')

styleCss = styleCss.replace('.lifecycle.hidden { display: none; }', '') + '\n.loader-spinner { width: 40px; height: 40px; border: 4px solid var(--outline-variant); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }'
open('style.css', 'w', encoding='utf-8').write(styleCss)


mainJs = open('main.js', 'r', encoding='utf-8').read()
mainJs = mainJs.replace('stepPlaced: document.getElementById("stepPlaced"),', 'loadingLifecycle: document.getElementById("loadingLifecycle"),\n  currentEventStep: document.getElementById("currentEventStep"),\n  currentEventTitle: document.getElementById("currentEventTitle"),\n  currentEventSub: document.getElementById("currentEventSub"),')
mainJs = re.sub(r'\s*stepPresented: document\.getElementById\("stepPresented"\),\n\s*stepProcessing: document\.getElementById\("stepProcessing"\),\n\s*stepResult: document\.getElementById\("stepResult"\),', '', mainJs)


updateTxnStatusNew = """function updateTxnStatus(state, payload = {}) {
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
    el.statusModalTitle.textContent = "交易成功";
    if (el.loadingLifecycle) el.loadingLifecycle.style.display = "none";
    if (el.currentEventStep) {
        el.currentEventStep.className = "lifecycle-step done";
        if (el.currentEventTitle) el.currentEventTitle.textContent = "交易成功";
        if (el.currentEventSub) el.currentEventSub.textContent = status;
    }
    return;
  }
  if (isFailed) {
    el.txnState.textContent = `失败/终止(${status})`;
    el.txnStatusPanel.className = "txn-status failed";
    el.modalState.textContent = `失败/终止(${status})`;
    el.statusModalTitle.textContent = "交易失败";
    if (el.loadingLifecycle) el.loadingLifecycle.style.display = "none";
    if (el.currentEventStep) {
        el.currentEventStep.className = "lifecycle-step fail";
        if (el.currentEventTitle) el.currentEventTitle.textContent = "交易失败";
        if (el.currentEventSub) el.currentEventSub.textContent = status;
    }
    return;
  }

  el.txnState.textContent = status ? `进行中(${status})` : "处理中";
  el.txnStatusPanel.className = "txn-status processing";
  el.modalState.textContent = status ? `进行中(${status})` : "处理中";
  el.statusModalTitle.textContent = "交易处理中";
  if (el.loadingLifecycle) el.loadingLifecycle.style.display = "flex";
}

function applyNotifyFinalState"""

mainJs = re.sub(r'function updateTxnStatus\(state, payload = \{\}\) \{[\s\S]*?function applyNotifyFinalState', updateTxnStatusNew, mainJs)

applyLifecycleByEventTypeNew = """function applyLifecycleByEventType(eventType) {
  const et = String(eventType || "").toUpperCase();
  if (!et) return;
  
  if (el.currentEventTitle) {
      el.currentEventTitle.textContent = et;
  }
  
  const descMap = {
      "ORDER_RECEIVED": "等待顾客操作",
      "PAYMENT_PRESENTED": "请顾客刷卡/挥卡/插卡",
      "PIN_ENTERING": "正在输入密码",
      "PAYMENT_PROCESSING": "支付处理中",
      "SIGNATURE_CAPTURED": "签名已采集",
      "PRINTING": "正在打印小票",
      "PRINT_COMPLETED": "打印完成",
      "TRANSACTION_ENDED": "流程结束，查询最终结果..."
  };
  
  if (el.currentEventSub) {
      el.currentEventSub.textContent = descMap[et] || "处理中";
  }
}

function isFinalTxnStatus"""
mainJs = re.sub(r'function applyLifecycleByEventType\(eventType\) \{[\s\S]*?function isFinalTxnStatus', applyLifecycleByEventTypeNew, mainJs)


applyNotifyFinalStateNew = """function applyNotifyFinalState(state, snap, webhookEventType) {
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

function resetModalForTxn"""
mainJs = re.sub(r'function applyNotifyFinalState[\s\S]*?function resetModalForTxn', applyNotifyFinalStateNew, mainJs)

mainJs = re.sub(r'if \(activeTxn && progressState === "TERMINAL_ENDED"\) \{[\s\S]*?\} else if \(eventType \|\| requestId', 'if (activeTxn && progressState === "TERMINAL_ENDED") {\\n        activeTxn.terminalEnded = true;\\n        appendModalTimeline("终端事件已结束，等待最终交易结果");\\n      }\\n    } else if (eventType || requestId', mainJs)
mainJs = mainJs.replace('if (activeTxn && !activeTxn.terminalEnded) {', 'if (false) {')

mainJs = mainJs.replace('setLifecyclePhase("PLACED");', '')

open('main.js', 'w', encoding='utf-8').write(mainJs)


      el.currentEventTitle.textContent = et;
  }
  
  const descMap = {
      "ORDER_RECEIVED": "等待刷卡/插卡/挥卡",
      "PAYMENT_PRESENTED": "请顾客操作",
      "PIN_ENTERING": "正在输入密码",
      "PAYMENT_PROCESSING": "交易处理中",
      "SIGNATURE_CAPTURED": "签名已采集",
      "PRINTING": "正在打印小票",
      "PRINT_COMPLETED": "打印完成",
      "TRANSACTION_ENDED": "流程结束，等待最终结果"
  };
  
  if (el.currentEventSub) {
      el.currentEventSub.textContent = descMap[et] || "处理中";
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

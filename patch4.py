import re

mainJs = open('main.js', 'r', encoding='utf-8').read()

applyLifecycleByEventTypeNew = """function applyLifecycleByEventType(eventType) {
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
}"""
mainJs = re.sub(r'function applyLifecycleByEventType\(eventType\) \{[\s\S]*?if \(el\.currentEventSub\) \{\n      el\.currentEventSub\.textContent = descMap\[et\] \|\| ".*?";\n  \}\n\}', applyLifecycleByEventTypeNew, mainJs)

open('main.js', 'w', encoding='utf-8').write(mainJs)

import re

with open("main.js", "r") as f:
    text = f.read()

# Make optional binding safe
replacements = [
    (r'el\.primaryActions\.addEventListener', r'if (el.primaryActions) el.primaryActions.addEventListener'),
    (r'el\.runSecondaryBtn\.addEventListener', r'if (el.runSecondaryBtn) el.runSecondaryBtn.addEventListener'),
    (r'el\.rebuildBtn\.addEventListener', r'if (el.rebuildBtn) el.rebuildBtn.addEventListener'),
    (r'el\.queryTxnBtn\.addEventListener', r'if (el.queryTxnBtn) el.queryTxnBtn.addEventListener'),
    (r'el\.modalQueryTxnBtn\.addEventListener', r'if (el.modalQueryTxnBtn) el.modalQueryTxnBtn.addEventListener'),
    (r'el\.openStatusModalBtn\.addEventListener', r'if (el.openStatusModalBtn) el.openStatusModalBtn.addEventListener'),
    (r'el\.openConfigModalBtn\.addEventListener', r'if (el.openConfigModalBtn) el.openConfigModalBtn.addEventListener'),
    (r'el\.openOpsModalBtn\.addEventListener', r'if (el.openOpsModalBtn) el.openOpsModalBtn.addEventListener'),
    (r'el\.openObserveModalBtn\.addEventListener', r'if (el.openObserveModalBtn) el.openObserveModalBtn.addEventListener'),
    (r'el\.subBtn\.addEventListener', r'if (el.subBtn) el.subBtn.addEventListener'),
    (r'el\.unsubBtn\.addEventListener', r'if (el.subBtn) el.unsubBtn.addEventListener'),
    (r'el\.clearEventsBtn\.addEventListener', r'if (el.clearEventsBtn) el.clearEventsBtn.addEventListener'),
    (r'el\.secondaryApi\.addEventListener', r'if (el.secondaryApi) el.secondaryApi.addEventListener'),
    (r'el\.runAuthBtn\.addEventListener', r'if (el.runAuthBtn) el.runAuthBtn.addEventListener')
]

for old, new in replacements:
    text = re.sub(old, new, text)

# Add missing DOM elements to the el map that were added in index.html like menuGrid
# But actually, doing safe access is enough

with open("main.js", "w") as f:
    f.write(text)

print("Patch applied to main.js")

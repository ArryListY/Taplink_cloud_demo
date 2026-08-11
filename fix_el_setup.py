import re

with open("main.js", "r") as f:
    text = f.read()

# Make the elements array safe
old_loop = r'\[el\.envType,\s*el\.customBaseUrl,\s*el\.appId,\s*el\.merchantId,\s*el\.terminalSn,\s*el\.currency,\s*el\.returnUrl,\s*el\.backendUrl,\s*el\.apiKey\]\.forEach\(\(node\) => \{'

new_loop = """[el.envType, el.customBaseUrl, el.appId, el.merchantId, el.terminalSn, el.currency, el.returnUrl, el.backendUrl, el.apiKey].forEach((node) => {
    if(!node) return;"""

text = re.sub(old_loop, new_loop, text)

# Also fix the modals loop binding
old_modal_bind = r'PANEL_MODALS\.forEach\(\(id\) => \{[\s\S]*?const modal = el\[id\];[\s\S]*?modal\.addEventListener'
new_modal_bind = """PANEL_MODALS.forEach((id) => {
    const modal = el[id];
    if (!modal) return;
    modal.addEventListener"""

text = re.sub(old_modal_bind, new_modal_bind, text)

# Inject the missing elements into `el` object mapping in main.js
# like menuGrid, cartList, goToCheckoutBtn, backToMenuBtn

el_block_end = r'(observeModal:\s*document\.getElementById\("observeModal"\),)'
el_additions = r'''\1
  menuGrid: document.getElementById("menuGrid"),
  cartList: document.getElementById("cartList"),
  goToCheckoutBtn: document.getElementById("goToCheckoutBtn"),
  backToMenuBtn: document.getElementById("backToMenuBtn"),'''

text = re.sub(el_block_end, el_additions, text)

with open("main.js", "w") as f:
    f.write(text)

print("Second patch applied.")

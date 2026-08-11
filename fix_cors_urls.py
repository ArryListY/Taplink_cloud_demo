import re

with open("main.js", "r") as f:
    text = f.read()

# Fix backendUrl logic so it uses relative paths (Nginx proxy) when backendUrl is empty
old_fetch = r'fetch\(cfg\.backendUrl \+ "/api/proxy", \{'
new_fetch = r"""
    const baseUrl = cfg.backendUrl || window.location.origin;
    fetch(baseUrl + "/api/proxy", {"""
text = re.sub(old_fetch, new_fetch, text)

old_es = r'new EventSource\(`\$\{cfg\.backendUrl\}/api/events/stream`\)'
new_es = r'new EventSource(`${cfg.backendUrl || window.location.origin}/api/events/stream`)'
text = re.sub(old_es, new_es, text)


with open("main.js", "w") as f:
    f.write(text)
print("JavaScript updated.")

html = open('index.html', 'r', encoding='utf-8').read()
html = html.replace('{}</button>', '&lt;/&gt;</button>')
open('index.html', 'w', encoding='utf-8').write(html)

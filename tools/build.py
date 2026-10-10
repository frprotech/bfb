"""Inline assets/ into a single self-contained index.html at the repo root."""
import base64, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'src' / 'index.html').read_text(encoding='utf-8')

def inline(m):
    data = base64.b64encode((root / m.group(1)).read_bytes()).decode()
    return f'src="data:image/png;base64,{data}"'

html = re.sub(r'src="(assets/[^"]+\.png)"', inline, html)
(root / 'index.html').write_text(html, encoding='utf-8')
print(f'index.html: {len(html.encode()) // 1024} KB')

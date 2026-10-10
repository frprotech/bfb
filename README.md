# Buure für Biendli – Landing Page

- `index.html` – self-contained build (fonts via Google Fonts, images inlined). Open directly in a browser.
- `src/index.html` – source with semantic markup, CSS tokens and minimal vanilla JS; references `assets/`.
- `assets/` – logo (colour + negative, background removed), partner logos, Infomaniak logo.
- `tools/build.py` – regenerates `index.html` from `src/`: `python3 tools/build.py`

Photo placeholders (hero, newsletter background) are marked in the source with a comment showing the `<img>` to drop in. The newsletter form is a stand-in for the Infomaniak embed. Partner logos sit in a track that becomes a slider with arrows once the logos no longer fit (up to 9).

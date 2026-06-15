# usp-store

Design reference pack + **gift shop** front-end for **Union Stage Presents**
(https://www.unionstagepresents.com/) — DC's live-music venue group.

## Contents

| Path | What |
|------|------|
| [`shop/`](shop/) | The gift shop front-end (`index.html`, `styles.css`, `app.js`). Open `shop/index.html` in a browser. |
| [`docs/`](docs/) | Full site teardown — design system, page templates, content, sitemap. Start at [`docs/00-README.md`](docs/00-README.md). |
| `docs/design-tokens.css` / `.json` | Drop-in design tokens (colors, type, spacing). |
| `raw/` | Captured source: full page archive (442 HTML), stylesheet, fonts, brand assets, show catalog. |
| `homepage.html` | Saved homepage markup. |
| `crawl.py`, `fetch_assets.py` | Re-runnable capture scripts. |

## The gift shop

A self-contained storefront built directly from the captured design system:

- **LFT Etica Mono** uppercase display type, system-ui body, Special Elite accent
- Black / white / cream `#e7decd` palette, **0px corner radius**, chunky uppercase buttons
- Signature **pizza-slice cursor**, **SOLD OUT** / **LAST CALL** stamp badges
- Category filter (T-Shirts / Hoodies / Hats / Accessories), working cart with localStorage
- Plain-white blank product mocks (tee, hoodie, cap, tote) as item photos

```bash
open shop/index.html   # macOS
```

## Notes

- **Fonts:** LFT Etica Mono (self-hosted woff2) is Adobe-licensed — license it under your own
  account for production. Special Elite is free on Google Fonts.
- The reference docs reflect the site as captured on 2026-06-15; programming changes frequently.

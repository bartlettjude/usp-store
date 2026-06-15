# Content Archive, Structured Data & Assets

This doc covers the **deep capture** pass: a full crawl of every page, a structured
show catalog, and the downloaded asset library. Raw outputs live in `../raw/`.

---

## 1. Full page archive — `raw/pages/` (442 HTML files)

Every internal page was crawled (BFS from the homepage + venue seeds) and saved as raw HTML.

| Category | Count |
|----------|-------|
| Event pages (`/shows/*`) | 393 |
| Venue sub-pages | 37 |
| Top-level pages | 13 |
| Homepage | 1 |
| **Total** | **444** (442 files + homepage.html + a couple redirects) |

Index of every page with title + OG metadata: **`raw/crawl-manifest.json`**
(434 pages carry Open Graph tags). Filenames map URL paths with `/` → `__`
(e.g. `/union-stage/shows` → `union-stage__shows.html`).

> Note: the public `/sitemap.xml` 404s, so this crawl is the authoritative page list.
> `/shows` (singular index) exists as a near-empty page; real listings are per-venue.

---

## 2. Show catalog — `raw/shows-catalog.json` (393 shows)

Structured data extracted from every event page's Open Graph / meta tags.
Each entry: `slug`, `title`, `date`, `venue`, `opendateId`, `image`, `private`.

- **393** events; **all 393** have date + venue; **368** carry an Opendate event ID.
- Date format on-site: `Mon DD, YYYY` (e.g. `Jul 19, 2026`).
- **Price, door/show times, and inventory are NOT in the HTML** — they load client-side
  from the Opendate widget (`app.opendate.io/confirms/<opendateId>/...`). The `opendateId`
  in the catalog is the key to pull that data from Opendate if needed.

### Shows by venue (current programming snapshot)
| Venue | # shows |
|-------|--------:|
| Pearl Street Warehouse | 100 |
| Union Stage | 99 |
| Jammin' Java | 79 |
| The Howard Theatre | 78 |
| The Miracle Theatre | 22 |
| Capital Turnaround | 8 |
| Plaza Stage at Nationals Park | 7 |

> Venue names as they appear in content: "Pearl Street Warehouse", "The Howard Theatre",
> "The Miracle Theatre", "Plaza Stage at Nationals Park", "Jammin' Java" (note: page body
> also renders it "Jammin Java" without apostrophe in some spots).

---

## 3. Asset library — `raw/assets/` (~520 files, 45 MB)

| Folder | Files | What it holds |
|--------|------:|---------------|
| `fonts/` | 6 | **LFT Etica Mono** woff2 — weights n4/n5/n7 (regular/medium/bold) + italics i4/i5/i7 |
| `ui/` | 8 | UI SVGs: `sold-out.svg`, `last-call.svg`, `check*.svg`, `untitled-ui-logomark.svg`, checkbox + bg svg |
| `headers/` | 5 | Page hero images: Homepage, Mission, Venues, Contact, FAQ headers (webp) |
| `brand/` | 29 | Logo (`USP_logo_white`), **`Pizza_Cursor_USP_64`**, venue logos, `*-PE-Ad` private-event ads, App Store / Google Play badges, "Note From USP" |
| `js/` | 13 | Front-end JS bundles (Webflow chunks, Opendate `od_embed.js`, webfont loader) |
| `images/` | 460 | All other webp graphics — venue photos + show-card artwork |

- **Complete asset URL list** (all 1,434 unique, including the 918 jpeg social-share
  duplicates that were *not* downloaded): **`raw/assets-manifest.txt`**. Pull any with curl.
- We downloaded **every webp** the site actually renders + all SVGs/fonts/JS. The skipped
  918 are redundant `.jpg` Open Graph versions of show art (same images, social-card sizing).
- Webflow responsive variants are suffixed `-p-500 / -p-800 / -p-1080 / -p-1600` (the
  un-suffixed file is the original/largest).

### Fonts — how to self-host
The 6 woff2 files in `fonts/` are LFT Etica Mono pulled from Typekit. Typekit's license is
subscription-based, so for a real build either keep the Typekit kit
(`https://use.typekit.net/gqh8elb.css`) under your own Adobe Fonts account, or license
LFT Etica Mono directly. `Special Elite` (accent) is free on Google Fonts.

---

## 4. Reproducing scripts (kept for re-runs)

| Script | Purpose |
|--------|---------|
| `../crawl.py` | BFS crawler → `raw/pages/` + `raw/crawl-manifest.json` |
| `../fetch_assets.py` | Classify + download assets into `raw/assets/` |

Re-run any time to refresh the snapshot (programming changes frequently).

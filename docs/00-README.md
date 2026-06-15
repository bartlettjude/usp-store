# Union Stage Presents — Site Reference Pack

A complete teardown of **https://www.unionstagepresents.com/** captured for recreating its
theme/aesthetic in a new section/site. The live site is a **Webflow** build on the
**Untitled UI** component kit, with a custom per-venue color system and **Opendate** ticketing.

## How to use this pack
Start with `01-design-system.md` + the token files for the look-and-feel, then read the
page docs for structure/content. Raw source (CSS, fonts, brand assets) is in `../raw/`.

## Documents

| File | Covers |
|------|--------|
| **01-design-system.md** | Colors, per-venue palette, typography, buttons, spacing, radius, breakpoints, assets, tech stack |
| **design-tokens.css** | Drop-in `:root` custom properties (copy/paste to theme a new build) |
| **design-tokens.json** | Same tokens, machine-readable (for Tailwind config, JS, etc.) |
| **02-homepage.md** | Homepage section order: knockout-text hero, show-search + 4-col card grid, Load More, footer |
| **03-navigation-footer.md** | Top nav (logo, links, venue pills, socials, hamburger) + footer (directory, newsletter, legal) |
| **04-show-detail-template.md** | Event page template: banner, date/time, Doors/Show/Ages, Opendate ticket embed, description, cal links |
| **05-show-listing.md** | Venue `/shows` listing pages: Finsweet filters, show-card anatomy, Load More |
| **06-venues.md** | All 7 venues, accent colors, addresses/capacity, venue micro-site structure, private-events templates |
| **07-info-pages.md** | About (brand voice/tagline), Contact, FAQs accordion, Careers, Accessibility, Private Events hub |
| **08-content-and-assets.md** | Deep capture: full 444-page archive, 393-show structured catalog, 45 MB asset library |
| **99-sitemap.md** | Full URL map of every page |

## Quick facts

- **Tagline:** "Creative Expression By Anyone, For Everyone" · About-page motto: "IF NOT NOW, WHEN?"
- **Type:** LFT Etica Mono (mono, UPPERCASE display) · system-ui (body) · Special Elite (typewriter accent)
- **Base palette:** black `#000` / white `#fff` / cream `#e7decd` / gray `#d7d7d7`; **0px corner radius**
- **Signature touch:** custom **pizza-slice cursor**; hand-stamped SOLD OUT / LAST CALL badges
- **Ticketing:** Opendate (embedded iframe); The Howard uses TicketWeb in places
- **No `/shows` master listing** — listings are per-venue (e.g. `/union-stage/shows`)

## Per-venue accent colors
| Venue | Hex | | Venue | Hex |
|-------|-----|-|-------|-----|
| Union Stage | `#e7d355` gold | | Jammin' Java | `#ff3c3b` red |
| The Howard | `#437cbf` blue | | Miracle Theatre | `#b25b24` rust |
| Pearl Street | `#ea798b` pink | | Capital Turnaround | `#00b36c` green |
| | | | Nationals Park | `#d7d7d7` gray |

See `99-sitemap.md` for the full URL map.

## Raw source files (`../raw/`)
| Path | What |
|------|------|
| `raw/site.css` | Full production stylesheet (356 KB) — ground truth for any value |
| `raw/typekit.css` | Adobe Typekit font CSS (loads LFT Etica Mono) |
| `raw/pages/` | **Full archive: 442 saved HTML pages** (every event + venue + info page) |
| `raw/crawl-manifest.json` | Index of all 444 pages with titles + OG metadata |
| `raw/shows-catalog.json` | **393 shows** structured (title/date/venue/Opendate ID/image) |
| `raw/assets-manifest.txt` | Complete list of all 1,434 asset URLs |
| `raw/assets/fonts/` | LFT Etica Mono woff2 (6 weights) |
| `raw/assets/ui/` | UI SVGs incl. `sold-out.svg`, `last-call.svg`, check icons |
| `raw/assets/brand/` | Logo, **pizza cursor**, venue logos, private-event ads, app badges |
| `raw/assets/headers/` | Page hero images · `raw/assets/images/` (460 venue/show graphics) |
| `../homepage.html` | Saved homepage markup (973 KB) |
| `../crawl.py`, `../fetch_assets.py` | Re-runnable capture scripts |

> See `08-content-and-assets.md` for the deep-capture details.

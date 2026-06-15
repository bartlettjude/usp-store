# Union Stage Presents — Design System

> Source: https://www.unionstagepresents.com/ — a **Webflow** site built on the
> **Untitled UI** ("uui-") component library, with custom show-card components and
> a per-venue color system. Ticketing runs on **Opendate**. Fonts via **Adobe Typekit**.
> All values below are extracted verbatim from the production stylesheet
> (`raw/site.css`, 356 KB) and font CSS (`raw/typekit.css`).

---

## 1. Brand at a glance

- **Aesthetic:** bold, monospaced, all-caps headlines on a stark black/white base, warm off-white "cream" accent, square corners (0px radius), heavy uppercase buttons, and a playful streak (custom **pizza cursor**, hand-stamped "Special Elite" typewriter serif for accents).
- **Personality:** indie/DIY live-music, gritty but friendly. Tagline: **"Creative Expression By Anyone, For Everyone."**
- **Layout:** generous whitespace, max content width ~80rem (1280px), 4-column show-card grids, alternating black/white/cream section bands.

---

## 2. Color palette

### Core / base
| Token | Value | Use |
|-------|-------|-----|
| `--colors--base-dark` | `black` (#000) | Primary background bands, body text, button fill |
| `--colors--base-light` | `white` (#fff) | Light section backgrounds, text on dark |
| `--colors--primary-accent` | `#e7decd` | **Cream / off-white** — primary brand accent (button text on dark, accents) |
| `--colors--primary-accent-50` | `#e9c73e80` | accent @ 50% (note: a gold tint) |
| `--colors--primary-accent-25` | `#e9c73e40` | accent @ 25% |
| `--colors--secondary-accent` | `#d7d7d7` | Secondary / gray accent |
| `--colors--background-gray` | `#d7d7d7` | Gray section background |
| `--colors--light-gray` | `#ccc` | Muted text / borders |
| `--colors--secondary-25` | `#dcd4bb40` | secondary tint |
| `--colors--white-10` | `#ffffff1a` | 10% white overlay |
| `--colors--white-20` | `#ffffff33` | 20% white overlay (hover states) |
| `--colors--transparent` | `#ffffff00` | transparent |

### Per-venue accent colors  ⭐ (the signature system)
Each venue has a signature color that drives nav pills, show-card backgrounds, and active subnav states.

| Venue | Token (`--_venues---`) | Legacy var | Hex | Swatch desc |
|-------|------------------------|-----------|-----|-------------|
| **Union Stage** | `--_venues---us` | `---us` | `#e7d355` | gold / yellow |
| **The Howard** | `--_venues---th` | `---th` | `#437cbf` | blue |
| **Pearl Street** | `--_venues---ps` | `---ps` | `#ea798b` | pink |
| **Jammin' Java** | `--_venues---jj` | `---jj` | `#ff3c3b` | red |
| **Miracle Theatre** | `--_venues---mt` | `---mt` | `#b25b24` | rust / orange-brown |
| **Capital Turnaround** | `--_venues---ct` | `---ct` | `#00b36c` | green |
| **Nationals Park** | `--_venues---np` | `---np` | `#d7d7d7` | gray |

> These are applied through utility classes like `*-bg` (solid color background on cards/pills)
> and the active subnav border/accent on each venue's listing page.

### Font color tokens
| Token | Maps to |
|-------|---------|
| `--font-colors--dark-font-color` | `--colors--base-dark` (black) |
| `--font-colors--light-font-color` | `--colors--base-light` (white) |
| `--font-colors--text-link-hover` | `--colors--background-gray` |

---

## 3. Typography

### Font families
| Role | `--fonts--*` | Stack |
|------|--------------|-------|
| **Headers / display** | `--fonts--header-font` | `lft-etica-mono, sans-serif` — **LFT Etica Mono** (Typekit). Monospaced; nearly all headings & buttons are **UPPERCASE**. |
| **Body** | `--fonts--body-font` | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, … sans-serif` (native system stack) |
| **Specialty / accent** | `--fonts--specialty-serif` | `"Special Elite", sans-serif` — Google font, typewriter/stamped look, for decorative accents |

- Typekit kit: `https://use.typekit.net/gqh8elb.css` (loads `lft-etica-mono`).
- `Special Elite` loaded via Google Fonts.

### Heading utility scale (`.uui-heading-*`) — the real display scale
| Class | font-size | weight | line-height | notes |
|-------|-----------|--------|-------------|-------|
| `.uui-heading-large` | `3rem` (48px) | — | 1.2 | white, **-webkit-text-stroke: 1px** (outlined/knockout look), header font |
| `.uui-heading-medium` | `2rem` (32px) | 600 | 1.3 | text-transform: none |
| `.uui-heading-small` | `1.75rem` (28px) | 600 | 1.0 | white |
| `.uui-heading-xsmall` | `1.5rem` (24px) | 600 | 1.4 | black |
| `.uui-heading-xxsmall` | `1.25rem` (20px) | 600 | 1.5 | white |
| `.show-card-header` (xxsmall variant) | `1.5rem` | — | — | header font, UPPERCASE, padding-top 1rem |

### Body text utilities
| Class | size | line-height |
|-------|------|-------------|
| `.uui-text-size-large` | `1.125rem` (18px) | 1.5 |
| (default body) | `1rem` (16px) | — |
| `.uui-text-size-small` | `0.875rem` (14px) | 1.5 |

### Text-link style (`.uui-text-style-link`)
```css
font-family: var(--fonts--header-font);   /* mono */
text-transform: uppercase;
font-size: 1.5rem; font-weight: 500;
text-decoration: underline;
text-decoration-thickness: 4px;            /* chunky underline */
text-underline-offset: 12px;               /* big offset */
transition: color .3s;
```
Footer variant `.grid-footer-link`: white, font-size 1.25rem, underline thickness 2px, offset 4px, flex with 0.5em gap.

### Global type traits
- **`text-transform: uppercase`** appears 57× — uppercase is the dominant heading treatment.
- Letter-spacing mostly `normal`; buttons/labels use `2px` or `.08em` tracking.
- Webflow base headings (h1=2em, h2=32px, h3=24px, h4=18px, h5=14px, h6=12px, all `bold`) exist but the **uui-heading utility classes are what's actually used** in layouts.

---

## 4. Buttons

### Primary — `.uui-button`
```css
border: 2px solid var(--buttons--primary-btn-color);   /* cream */
border-radius: var(--size--border-radius);             /* 0px — square */
background-color: var(--colors--base-dark);            /* black fill */
color: var(--colors--base-light);                      /* white text */
text-transform: uppercase;
padding: 1rem 2rem;
font-size: 1rem; font-weight: 600; line-height: 1;
white-space: nowrap;
transition: all .3s;
box-shadow: 0 1px 2px #1018280d;
```
Hover: stays dark bg, text → cream (`--buttons--primary-btn-hover-font-color`).

### Variants
- `.uui-button.dark` — black bg, **cream text**, on hover inverts to cream bg / black text.
- `.uui-button.clear-button` — no shadow, 2px solid border, `border-radius: 6px`.
- `.uui-button-secondary-gray` — white bg, gray text (#344054), subtle.
- `.uui-button-tertiary-gray` — transparent, gray text, ghost style.
- Legacy `.button-primary` — `#1a1b1f` bg, white, `letter-spacing: 2px`, padding `12px 25px`, font-size 12px (older Webflow default; uui-button is the modern one).

### Button token map
| Token | Value |
|-------|-------|
| `--buttons--primary-btn-color` | `--colors--primary-accent` (cream) |
| `--buttons--primary-btn-font-color` | `--colors--base-dark` |
| `--buttons--primary-btn-hover-color` | `--colors--base-dark` |
| `--buttons--primary-btn-hover-font-color` | `--colors--base-light` |
| `--buttons--secondary-btn-color` | `--colors--transparent` |
| `--buttons--secondary-btn-border-color` | `--colors--primary-accent` |
| `--buttons--secondary-btn-font-color` | `--colors--primary-accent` |

---

## 5. Layout, spacing & radius

| Token / value | Meaning |
|---------------|---------|
| `--size--border-radius` | **`0px`** — square corners everywhere (cards, buttons, inputs) |
| `.uui-container-large-2/3` | `max-width: 80rem` (1280px) — main page container, centered |
| `.uui-container-small` | `max-width: 48rem` (768px) — narrow text columns |
| common `max-width: 35rem` | (560px) narrow blocks |
| Show grid | 4 columns (desktop) of show-cards |
| Section pattern | alternating **black / white / cream (#e7decd) / gray (#d7d7d7)** bands |

### Cards / components
- **`.show-card-link`** — flex column, full height, `box-shadow: 0 2px 5px #00001459`, no border-radius. Background = venue accent color.
- **`.show-info-container`** — `padding-top: 1.5rem`, the inner text block of a card; carries a `venue-color` attribute driving the accent.
- **`.uui-badge-small-success`** — pill badge, `border-radius: 10rem`, green (#027a48 on #ecfdf3) — generic; the brand uses custom **SOLD OUT** / **LAST CALL** SVG badges instead (see assets).

---

## 6. Responsive breakpoints

Webflow's standard breakpoints (from `@media` queries):
| Breakpoint | Target |
|------------|--------|
| `1440px` | large desktop / above-desktop |
| `991px` | tablet (≤991px) |
| `767px` / `768px` | landscape mobile |
| `479px` | portrait mobile |

Nav collapses to hamburger at `data-collapse="medium"` (≤991px).

---

## 7. Brand assets (saved in `raw/assets/`)

| File | What it is |
|------|------------|
| `USP_logo_white.webp` | Primary wordmark/logo, white, used in header & footer |
| `Pizza_Cursor_USP_64.webp` | **Custom pizza-slice mouse cursor** (64px) — signature playful touch |
| `sold-out.svg` | "SOLD OUT" stamp badge for show cards |
| `last-call.svg` | "LAST CALL" stamp badge for show cards |

CDN base path: `https://cdn.prod.website-files.com/6902734080a4b345f41078da/`

---

## 8. Tech stack notes (for faithful recreation)

- **Webflow** front-end + **Untitled UI** (`uui-`) Webflow component kit.
- **Opendate** = ticketing/RSVP platform (embedded `app.opendate.io` iframe on event pages; newsletter posts to Opendate). The Howard uses **TicketWeb** in places.
- **Finsweet Attributes** powers the listing filters (Month / Search / Clear / Load More).
- jQuery 3.5.1, Google reCAPTCHA, WebFont loader.
- No framework needed to copy the *look* — it's plain HTML/CSS. Recreate with the tokens in `design-tokens.css` / `design-tokens.json`.

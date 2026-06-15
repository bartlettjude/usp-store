# Show Detail Page Template

URL pattern: `/shows/{slug}` — e.g. `/shows/an-evening-with-ira-glass-11-jul`,
`/shows/wale-smino-everything-is-tour-20-jun`, `/shows/flamingosis-04-jul`.

This is a **Webflow CMS Collection page** (the "Shows" collection). Ticketing is
**Opendate** (`app.opendate.io`) — embedded as an iframe, not etix/eventbrite/seetickets.
The site footer reads "Powered by Opendate".

> Global design tokens (colors, fonts) are documented elsewhere. This file covers
> layout, fields, copy, and component structure only.

---

## Page structure, top to bottom

| # | Section | Wrapping element / class | Notes |
|---|---------|--------------------------|-------|
| 1 | Global nav | `.uui-navbar07_component` | Shared site header (logo, Shows/About/Booking/FAQs/Contact + venue list). Not part of this template. |
| 2 | **Show hero** | `<header id="top" class="show-hero-section no-bg-image">` | Image + event meta + add-to-calendar + (hidden) GET TICKETS button. |
| 3 | **Ticketing block** | `<header class="uui-section_blogpost02">` containing `#tickets` | Opendate order iframe + an SEO `#event-data` embed that injects JSON-LD. |
| 4 | **About the event** | `<section class="about-show-section">` | Per-artist social links + rich-text description body. |
| 5 | "This show is at {venue}" address blocks | inside about section | Seven venue address blocks, all rendered; only the matching one is shown (Webflow `w-condition-invisible`). |
| 6 | Mailing-list signup | footer area | Email + Phone opt-in form (SMS consent copy). Global, not template-specific. |
| 7 | Global footer | `.uui-footer02_component` | Venue directory, Privacy/Accessibility, "Powered by Opendate". |

There is **no** separate "related shows" carousel and **no** explicit "share buttons"
row on the detail template. The only sharing affordance is the **Add to Calendar**
links (Google Cal / iCal) generated client-side.

---

## 2. Show hero (`.show-hero-section.no-bg-image`)

Rendered inside a Webflow Collection-item wrapper:
`.show-collection-wrapper.show-template-wrapper` → `.w-dyn-list` → `.w-dyn-item`
→ grid `.uui-blogpost03_header`.

### 2a. Hero image
```html
<div class="uui-blogpost03_image-wrapper">
  <img class="uui-blogpost03_image-2" loading="lazy"
       src="...{event_image}.jpeg" alt="{Event title}">
  <div class="sold-out">
    <!-- sold-out.svg overlay, hidden by default via w-condition-invisible -->
    <img class="w-condition-invisible" src=".../sold-out.svg" alt="">
  </div>
</div>
```
- Promo image (CMS field). On all 3 samples the `class="no-bg-image"` modifier is on
  the header, so the image renders as a standard inline image (no full-bleed bg).
- A **SOLD OUT** badge SVG overlays the image; toggled by a Webflow condition
  (`.w-condition-invisible` when the show is not sold out). All 3 samples were not sold out.

### 2b. Event meta (`.show-content-wrapper`)

**Header block** `.show-info-container.info-header`:

```html
<div class="date-tag date-tag-small">
  <div class="event-day-day">Sat</div>   <!-- weekday -->
  <div class="event-month">Jul</div>      <!-- month abbr -->
  <div class="event-day">11</div>         <!-- day of month -->
</div>
<div class="event-grid-presenter">WAMU x Union Stage Present:</div>
<h3 class="uui-heading-large-6 show-card-header">{Event title}</h3>
<div class="uui-text-size-medium dark-caps w-dyn-bind-empty"></div>
```

**Footer block** `.show-info-container.info-footer` — two `.show-info.show-template` rows:

Row 1 (venue · age):
```html
<div class="show-info show-template">
  <div class="location-icon ..."> [pin svg] </div>
  <div class="base-text-size-caps truncate more-width">Capital Turnaround</div>
  <div class="dot-icon ..."> [dot svg] </div>
  <div class="base-text-size-caps">All Ages</div>
</div>
```

Row 2 (doors / show times):
```html
<div class="show-info show-template">
  <div class="base-text-size-caps text-gap light-weight">Doors</div>
  <div class="base-text-size-caps light-weight">7:00 pm</div>
  <div class="base-text-size-caps line-gap light-weight">|</div>
  <div class="base-text-size-caps text-gap light-weight">Show</div>
  <div class="base-text-size-caps light-weight">8:00 pm</div>
</div>
```

### 2c. Add to Calendar (`.add-to-calendar`)

A hidden data block plus a script that builds Google Cal + iCal links on `DOMContentLoaded`:

```html
<div id="calendar-links">
  <span id="event-title">Stories for a Saturday Night: An Evening with Ira Glass</span>
  <span id="event-description">Ira Glass</span>
  <span id="event-location">1700 M Street SE, Washington, DC, 20003, US</span>
  <span id="event-start">07/11/2026 08:00 PM</span>
  <span id="event-end">07/11/2026 11:59 PM</span>
</div>
```
The script renders two links: **`+ Google Cal`** and **`+ iCal`** (bold, underlined,
black). Date format parsed is `MM/DD/YYYY hh:mm AM/PM`. End time defaults to start if empty.

### 2d. GET TICKETS button (hero) — usually hidden

```html
<div class="ticketweb w-condition-invisible">
  <a href="#" class="link-block-2 horizontal-flex w-inline-block">
    <div class="text-block-60">GET TICKETS</div>
    <div class="external-link-icon black-font ...">[external-link svg]</div>
  </a>
</div>
```
- Label: **`GET TICKETS`** (the hero CTA; uppercase).
- This is the **external-ticketing fallback** (class `.ticketweb`) and is wrapped in
  `.w-condition-invisible` on all 3 samples — i.e. hidden when the show uses the
  embedded Opendate checkout (section 3). `href` is a placeholder `#` in static HTML.

---

## 3. Ticketing block (`#tickets`, Opendate embed)

The primary purchase flow is an **embedded Opendate iframe**, inside
`<header class="uui-section_blogpost02">` → `.uui-page-padding-4` → `#tickets`:

```html
<div id="tickets" class="w-embed w-iframe w-script">
  <script src="https://app.opendate.io/packs/od_embed.js"></script>
  <iframe src="https://app.opendate.io/confirms/{CONFIRM_ID}/web_orders/new"
          id="od-confirm-{CONFIRM_ID}-iframe"
          title="{Event title}" scrolling="no"
          allowpaymentrequest="true" allow="payment"
          style="border:none; width:1px; min-width:100%;" height:600px;></iframe>
  <script>ODEmbed("od-confirm-{CONFIRM_ID}-iframe");</script>
</div>
```

Per-sample confirm IDs (the only page-specific value here):

| Page | Opendate confirm id |
|------|--------------------|
| Ira Glass | `635587` |
| Wale & Smino | `668833` |
| Flamingosis | `703562` |

### `#event-data` (SEO / JSON-LD)
A sibling `.event-search-embed` block carries `data-*` attributes
(`data-id`, `data-name`, …) that a script serialises into an
`application/ld+json` `<script>` appended to `<head>` (schema.org Event).

---

## 4. About the event (`.about-show-section`)

```html
<section class="about-show-section">
  <div class="show-collection-wrapper">
    <div class="about-container">
      <div class="about-event-header"><h3>About the event</h3></div>
      <div class="about-content">
        <div class="artist-social-links"> ... per-artist links ... </div>
        <!-- rich-text description body follows -->
```

- Heading copy: **`About the event`** (exact).

### 4a. Artist social links (`.artist-social-links`)
One row per artist (headliner + each supporting act). Each row has a **fixed set of
five slots** in order — **Website, Instagram, Facebook, Spotify, Youtube** — and any
slot without a URL is hidden via `.w-condition-invisible`:

```html
<a href="{url}" target="_blank" class="artist-social-link w-inline-block">
  <div class="uui-footer02_social-icon ...">[icon svg]</div>
  <div>Website</div>
</a>
<!-- Instagram, Facebook, Spotify, then Youtube (class artistyoutube) -->
```
- Ira Glass (single artist) → one social row.
- Wale & Smino (two artists) → two social rows (≈11 link nodes incl. footer socials).
- Slot labels are the literal visible text: `Website`, `Instagram`, `Facebook`,
  `Spotify`, `Youtube`.

### 4b. Description body
Webflow rich-text from the CMS `Description` field. Page-specific. Ira Glass example
includes multiple pull-quotes (The New Yorker, The Guardian, New York Magazine).
Supporting acts are surfaced via their own social rows, not a separate "supporting" list.

---

## 5. Venue address block ("This show is at {venue}")

All seven venue address blocks are rendered into the page; Webflow conditional
visibility shows only the one matching the show's venue:

```
This show is at Union Stage / 740 Water Street SW / Washington, DC 20024
This show is at Jammin Java / 227 Maple Ave East / Vienna, VA 22180 (703) 255-1566
This show is at Pearl Street Warehouse / 33 Pearl Street SW / Washington, DC 20024
This show is at The Howard Theatre / 620 T Street NW / Washington, DC 20001
This show is at The Miracle Theatre / 535 8th St SE / Washington, DC 20003 (202) 400-3210
This show is at The Theatre at Capital Turnaround / 770 M St SE / Washington, DC 20003
This show is at Nationals Park / 740 Water Street SW / Washington, DC 20024
```
Copy template: **`This show is at {Venue full name}`** + street + city/state/zip (+ phone where present).

---

## Field consistency across the 3 samples

| Field | Class / id | Consistent (template)? | Per-page value example |
|-------|-----------|------------------------|-------------------------|
| Weekday / Month / Day | `.date-tag` (`.event-day-day` / `.event-month` / `.event-day`) | Yes | Sat / Jul / 11 |
| Presented-by | `.event-grid-presenter` | **Conditional** — present for Ira Glass (`WAMU x Union Stage Present:`); empty (`w-dyn-bind-empty`) for Wale & Smino and Flamingosis | "WAMU x Union Stage Present:" |
| Event title | `h3.show-card-header` | Yes | "Stories for a Saturday Night: An Evening with Ira Glass" |
| Venue | `.base-text-size-caps.truncate.more-width` | Yes | Capital Turnaround / Plaza Stage at Nationals Park / Union Stage |
| Age restriction | `.base-text-size-caps` (after dot icon) | Yes — all 3 = **`All Ages`** | All Ages |
| Doors label | literal text **`Doors`** | Yes | Doors |
| Show label | literal text **`Show`** | Yes | Show |
| Doors / Show times | `.show-info.show-template` row | Yes | 7:00 pm / 8:00 pm |
| Ticket price | — | **Not on the page** | Pricing lives entirely inside the Opendate iframe |
| Primary CTA | Opendate iframe `#tickets` | Yes | confirm id per show |
| Hero CTA `GET TICKETS` | `.ticketweb` | Yes (present but hidden) | href `#` (fallback only) |
| Add to Calendar | `#calendar-links` + script | Yes | `+ Google Cal`, `+ iCal` |
| Sold-out badge | `.sold-out img` | Yes (present, hidden unless sold out) | not shown on samples |
| About heading | `About the event` | Yes | — |
| Artist social rows | `.artist-social-links` | Yes (1 row per artist) | Website/Instagram/Facebook/Spotify/Youtube |
| Description body | rich text | Per-page | — |
| Venue address | "This show is at …" | Yes (matched block shown) | per venue |

### Exact labels to reuse
`GET TICKETS` · `Doors` · `Show` · `All Ages` · `About the event` ·
`This show is at {venue}` · `+ Google Cal` · `+ iCal` ·
social slots `Website` / `Instagram` / `Facebook` / `Spotify` / `Youtube`.

> Note: there is **no `Ages` or `Buy Tickets`** literal label on this template — age is
> just the value (`All Ages`) and the ticket CTA reads `GET TICKETS` (hero fallback)
> while the live purchase is the embedded Opendate widget.

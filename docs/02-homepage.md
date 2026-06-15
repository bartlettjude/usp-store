# Homepage Structure — unionstagepresents.com

Reference for recreating the **homepage layout and content** of the Union Stage Presents site (Webflow + Opendate ticketing). Global design tokens (colors / fonts) are documented separately — this file covers **structure, copy, and section-level behavior only**.

> Source: `/Users/judebartlett/usp-store/homepage.html` (saved render). The homepage is a single Webflow page wrapping a CMS Collection List of shows fed by the Opendate platform.

---

## 1. Top-to-bottom section order

The homepage is intentionally minimal — it is essentially a **giant filterable show grid** bracketed by a hero and the global footer. There is **no separate "venue showcase" band, no testimonial/CTA bands, and no inline newsletter band** in the page body; venues are surfaced via the search dropdown, the venue sub-nav, and the footer venue directory. Email signup lives only in the global footer.

| # | Section | Wrapper class | Background | Contents |
|---|---------|---------------|------------|----------|
| 1 | Global top nav | `.main-nav-container.w-nav` (`role="banner"`) | Dark (logo is white) | Logo, primary links, venue sub-nav, social icons, hamburger. See `03-navigation-footer.md`. |
| 2 | Venue sub-nav strip | `.main-sub-nav` | Per-venue color chips | 7 venue links rendered as colored pills (desktop strip below nav; also duplicated inside mobile menu) |
| 3 | Nav spacer | `#top.top-nav-space` | — | Empty spacer / scroll anchor (`#top`) |
| 4 | **Hero** | `section.home-hero-section` > `.hero-background-image` | Background image with overlaid stroked text | Large stacked headline + subhead. No buttons. |
| 5 | **Show search + grid** | `section.show-section.light-background` | Light background | Search/filter bar (`.search-section`) followed by a 4-column show card grid (`.show-list.show-4-col`) and a "Load More" paginator |
| 6 | Global footer | `footer.uui-footer02_component` | Dark | Logo, social, 6-venue directory, newsletter signup, legal links, copyright, "Powered by Opendate". See `03-navigation-footer.md`. |
| 7 | Scroll-to-top FAB | `.jump-link` (`ms-code-scroll-top`) | — | Floating up-arrow button, appears after 300px scroll, smooth-scrolls to top |

---

## 2. Hero section

```html
<section class="home-hero-section">
  <div class="hero-background-image"> ... </div>
</section>
```

- **Background media:** a full-bleed background image applied to `.hero-background-image` (set via Webflow CSS, not an inline `<img>`). No video.
- **Headline + subhead text use a "stroked/outline" treatment** — each line is wrapped in `<span class="background-text">`, a Webflow style that renders text as an outline filled by the background image (knockout effect). This is the hero's defining aesthetic.
- **No CTA buttons in the hero.** The only interactive elements below the hero are the search filters.

### Headline copy (H1 — `.hero-h1`)

Four stacked lines, each its own `.background-text` span separated by `<br>`:

```
Creative
Expression
By Anyone,
For Everyone.
```

### Subhead copy (H2 — `.hero-h2`)

```
Find Your Shows
At Union Stage Presents
```

> The full phrase "Creative Expression By Anyone, For Everyone" is also the site `<title>` tagline.

---

## 3. Show search + grid section

```html
<section class="show-section light-background">
  <div class="search-section"> ...filters... </div>
  <div class="show-page-padding">
    <div id="main-content" class="show-container">
      <div class="show-collection-wrapper cms-list w-dyn-list">
        <div class="show-list show-4-col w-dyn-items"> ...cards... </div>
        ...pagination...
      </div>
    </div>
  </div>
</section>
```

Background: `light-background` (light section, contrasting with the dark nav/footer).

### 3a. Search / filter bar (`.search-section`)

A `GET` form (`#wf-form-Show-Search`) wired to Finsweet List filtering (`fs-list-field` attributes). Layout: a red magnifying-glass icon, two `<select>` dropdowns + a Clear button in `.selects-container`, and a free-text search input.

| Control | Type | Field | Options / placeholder |
|---------|------|-------|-----------------------|
| Search icon | SVG | — | Magnifying glass, fill `#FF4C56` (brand red) |
| **Venue filter** | `<select id="Venue-Filter">` | `fs-list-field="venues"` | `All Venues`, Union Stage, Jammin Java, The Howard Theatre, Pearl Street, Miracle Theatre, Capital Turnaround, Nationals Park |
| **Month filter** | `<select id="Month-Filter">` | `fs-list-field="date"` | `Month` (default) + January–December |
| **Clear** | link `.clear-button` | `fs-list-element="clear"` | Label: `Clear` |
| **Search** | `<input type="text" id="Search">` | `fs-list-field="search"` | Placeholder: `Search` |

Native select arrows are removed via inline CSS (`appearance: none`).

### 3b. Show card grid (`.show-list.show-4-col`)

- A **4-column responsive grid** of CMS items (`.show-item`). The saved page contains ~100 shows on page 1.
- Each rendered card is actually **two stacked `<a class="show-card-link">` variants** — a primary (with real data) and a conditionally hidden fallback (`w-condition-invisible`) used for empty-binding states. Treat them as one logical card.
- **Card background color is keyed to the venue** via a `venue-color="<Venue Name>"` attribute and the per-venue CSS injected in the nav `<style>` block (see color map below). Card text is forced to black on these colored backgrounds.

#### Card anatomy

```
.show-card-link[venue-color="..."]   ← whole card is one link to /shows/<slug>
└─ .uui-layout88_item-content
   ├─ .show-image-wrapper > img.image-40           ← event poster/photo (lazy)
   └─ .show-content-wrapper
      ├─ .show-info-container.info-header
      │  ├─ .date-tag.date-tag-small               ← stacked date chip
      │  │  ├─ .event-day-day   "Mon"              ← weekday
      │  │  ├─ .event-month     "Jun"              ← month abbrev
      │  │  └─ .event-day       "15"               ← day-of-month
      │  ├─ .event-grid-presenter                  ← "Presented by ..." (often empty)
      │  ├─ h3.show-card-header "Future Nobodies"  ← artist / event title
      │  └─ .dark-caps          "Secret Attraction"← support act / subtitle
      └─ .show-info-container.info-footer
         ├─ .show-info  (row 1: location)
         │  ├─ pin icon · venue name · dot · age policy ("All Ages")
         ├─ .show-info  (row 2: times)
         │  └─ "DOORS 7:00 pm | Show 8:00 pm"
.show-grid-footer
└─ .uui-button-row.space-between-row
   ├─ .grid-footer-link  → text swaps: "Tickets" / "FREE RSVP" / "Learn More" + external-link icon
   └─ .info-icon                                   ← circled "i" info glyph
[overlay tags, siblings of the link:]
   img.event-tag.sold-out      ← "SOLD OUT" SVG badge (shown when sold out)
   img.event-tag.last-call     ← "LAST CALL" SVG badge (shown when nearly sold out)
   .message-tag.message-tag-small ← optional custom message ribbon
```

#### Card field reference

| Field | Class / attr | Example value | Notes |
|-------|--------------|---------------|-------|
| Image | `img.image-40` | event photo | `loading="lazy"` |
| Date (weekday) | `.event-day-day` | `Mon` | |
| Date (month) | `.event-month` | `Jun` | `fs-list-field="date"` |
| Date (day) | `.event-day` | `15` | |
| Presenter | `.event-grid-presenter` | `Presented by NPR`, `Presented by the Historic Howard Theatre Foundation & Reggie Van Lee` | Hidden when empty |
| Title | `h3.show-card-header` | `Future Nobodies` | `fs-list-field="search"` |
| Subtitle / support | `.dark-caps` | `Secret Attraction` | |
| Venue | `.truncate` w/ pin icon | `Pearl Street Warehouse` | `fs-list-field="venues"` |
| Age policy | `.base-text-size-caps` | `All Ages` | |
| Doors time | `.show-info` row 2 | `7:00 pm` | preceded by label `DOORS` |
| Show time | `.show-info` row 2 | `8:00 pm` | preceded by `\|` then label `Show` |
| Price | — | **not shown on the card** | Price is not surfaced in the grid; only on the show detail page |
| CTA | `.grid-footer-link` | `Tickets` / `FREE RSVP` / `Learn More` | One of three label states + external-link arrow |
| Status badges | `img.event-tag` | `SOLD OUT`, `LAST CALL` | Image badges overlaid on the card |

> Note: the **whole card is a single anchor** to `/shows/<event-slug>` (e.g. `/shows/future-nobodies-15-jun`). The "Tickets" text is decorative within that link rather than a separate button.

#### Per-venue card color map

Injected via `<style>` in the nav. `.show-card-link[venue-color="X"]` and `.show-template-body[venue-color="X"]` both get the background; text is `#000000`.

| Venue (`venue-color` value) | Background |
|------------------------------|-----------|
| Union Stage | `#e7d355` (yellow) |
| Jammin' Java | `#ff3c3b` (red) |
| Pearl Street Warehouse | `#ea798b` (pink) |
| The Howard Theatre | `#437cbf` (blue) |
| The Miracle Theatre | `#b25b24` (rust/orange) |
| Capital Turnaround | `#00b36c` (green) |
| Plaza Stage at Nationals Park | `#d7d7d7` (light grey) |

### 3c. Pagination ("Load More")

```html
<div class="w-pagination-wrapper pagination-3" role="navigation" aria-label="List">
  <a href="?82df348e_page=2" aria-label="Next Page" class="w-pagination-next pagination-button">
    <div class="w-inline-block">Load More</div>
  </a>
  <link rel="prerender" href="?82df348e_page=2"/>
  <div class="w-page-count" role="heading">1 / 4</div>
</div>
```

- Webflow CMS pagination, label **`Load More`**.
- Page counter shows `1 / 4` (4 pages total on this snapshot).
- Next page is prerendered for speed.

---

## 4. Venue showcase

There is **no dedicated venue showcase section in the homepage body.** Venues appear in three places instead:
1. **Venue sub-nav** strip directly under the nav (colored pills) — see nav doc.
2. **Venue filter dropdown** in the search bar (section 3a).
3. **Footer venue directory** (6 venues with addresses + per-venue social) — see footer doc.

The 7 venues referenced across the site:

| Venue | Shows link | City |
|-------|-----------|------|
| Union Stage | `/union-stage/shows` | Washington, DC |
| Jammin Java | `/jammin-java/shows` | Vienna, VA |
| Pearl Street (Warehouse) | `/pearl-street/shows` | Washington, DC |
| The Howard (Theatre) | `/the-howard/shows` | Washington, DC |
| Miracle Theatre | `/miracle-theatre/shows` | Washington, DC |
| Capital Turnaround | `/capital-turnaround/shows` | Washington, DC |
| Nationals Park (Plaza Stage) | `/nationals-park/shows` | Washington, DC |

---

## 5. Newsletter / email signup

No newsletter block exists in the homepage body. The only signup is in the **global footer** (`#wf-form-Newsletter-Form`), documented in `03-navigation-footer.md`. A footer "envelope" social icon and the nav envelope icon both jump to `#wf-form-Newsletter-Form`.

---

## 6. Background / color pattern summary

| Region | Treatment |
|--------|-----------|
| Nav | Dark, white logo |
| Venue sub-nav pills | Each venue's brand color |
| Hero | Background photo; headline/subhead are outline text filled by the image (knockout) |
| Show section | `light-background` (light) |
| Show cards | Solid per-venue brand color, black text |
| Footer | Dark, white logo |

The page deliberately alternates **dark nav → image hero → light grid → dark footer**, with the only vivid color coming from the per-venue card backgrounds and sub-nav pills.

---

## 7. Exact marketing copy strings (quote-ready)

```
Creative Expression By Anyone, For Everyone.   (hero H1, line-broken: Creative / Expression / By Anyone, / For Everyone.)
Find Your Shows At Union Stage Presents         (hero H2)
All Venues                                       (venue filter default)
Month                                            (month filter default)
Search                                           (search input placeholder)
Clear                                            (filter reset)
Tickets  /  FREE RSVP  /  Learn More             (card CTA states)
DOORS  ·  Show                                   (card time labels)
All Ages                                         (card age policy example)
SOLD OUT  /  LAST CALL                           (card status badges)
Load More                                        (pagination)
Thank you! Your submission has been received!    (form success)
Oops! Something went wrong while submitting the form.   (form error)
```

# Show Listing Pages

## URLs and routing

| URL | Page | Notes |
|-----|------|-------|
| `/union-stage/shows` | Union Stage listing | Venue-scoped |
| `/the-howard/shows` | The Howard listing | Venue-scoped |
| `/jammin-java/shows`, `/pearl-street/shows`, `/the-miracle/shows`, `/capital-turnaround/shows`, etc. | one per venue | Same pattern |
| `/shows` | **404 (Not Found)** | The top-nav "Shows" link points to `/shows`, but the raw page returns Webflow's "Page Not Found" template. There is no single combined grid at this exact path (it likely redirects or is JS-routed in the browser). |

Listings are **per-venue**: there is one listing page per venue, each titled
`{Venue} Shows | Union Stage Presents`.

Tech: **Webflow CMS Collection list** + **Finsweet Attributes v2** (`fs-list`) for
client-side search / filter / load-more. No server pagination.

> Global tokens (colors/fonts) are documented elsewhere; this file covers layout,
> the card component, filters, and per-venue differences.

---

## Page layout (top to bottom)

1. Global nav (`.uui-navbar07_component`).
2. **Venue subnav** — `.venue-subnav.{venue}-subnav` (e.g. `us-subnav`). A
   secondary bar with a **Shows** link (`aria-current="page"`, `.w--current`) and an
   **Info** dropdown (FAQ, Private Events, Getting Here, Box Office, etc.). The
   dropdown panel carries the venue accent class (e.g. `.us-bg`).
3. **Filter bar** — see below.
4. **Show grid** — `fs-list-element="wrapper"` → `.show-collection-wrapper.cms-list`
   → `.show-list` (`fs-list-element="list"`, `role="list"`) of `.show-item` cards.
5. **Load More** control (`fs-list-load="more"`).
6. Venue ad / directory + global footer.

There is **no calendar view** — listings are a responsive card **grid** only.

---

## Filter / sort bar

Wrapped in a Webflow form `#wf-form-Show-Search` with `fs-list-element="filters"`.

```html
<form id="wf-form-Show-Search" fs-list-element="filters" class="form" method="get">
  <div class="selects-container">
    <select id="Month-Filter" name="Month-Filter"
            fs-list-field="date" class="select-field venue-select w-select">
      <option value="">Month</option>
      <option value="jan">January</option> ... <option value="dec">December</option>
    </select>
    <div class="uui-button-wrapper">
      <a fs-list-element="clear" href="#" class="clear-clear clear-button">
        <div>Clear</div>
      </a>
    </div>
  </div>
  <input class="search-field w-input" placeholder="Search" type="text"
         id="Search" name="Search" fs-list-field="search">
</form>
```

| Control | Field | Mechanism | Copy |
|---------|-------|-----------|------|
| Month dropdown | `fs-list-field="date"` | filters by month | placeholder option **`Month`**, then `January … December` |
| Search text box | `fs-list-field="search"` | matches the event title | placeholder **`Search`** |
| Clear button | `fs-list-element="clear"` | resets filters | **`Clear`** |

- **No genre filter** and **no explicit venue filter on a venue page** (the page is
  already scoped to one venue). The card field `fs-list-field="venues"` exists for
  filtering but is not surfaced as a control on the per-venue pages.
- Native select arrow is removed (`appearance: none`).
- **Sort order:** chronological (soonest first) by show date — driven by the
  Webflow Collection-list sort, not a user-facing sort control.
- **Filter accent:** the filter/search area uses a coral-red search icon
  (`fill="#FF4C56"`) — colour is a global token, noted only for placement.

---

## Show card component (`.show-item` / `.show-card-link`)

The card is the **same component as the detail hero meta block** (`.show-info-container`),
so they share class names. Anatomy:

```html
<div fs-list-element="item" role="listitem" class="show-item w-dyn-item">
  <a venue-color="Union Stage" href="/shows/dead-calm-15-jun"
     class="show-card-link w-inline-block">
    <div class="uui-layout88_item-content">

      <!-- IMAGE -->
      <div class="show-image-wrapper">
        <img class="image-40" loading="lazy" src="...promo.jpeg" alt="">
      </div>

      <!-- META -->
      <div class="show-content-wrapper">
        <div class="show-info-container info-header">
          <div class="date-tag date-tag-small">
            <div class="event-day-day">Mon</div>
            <div fs-list-field="date" class="event-month">Jun</div>
            <div class="event-day">15</div>
          </div>
          <div class="event-grid-presenter w-dyn-bind-empty"></div>   <!-- "presented by", optional -->
          <h3 fs-list-field="search" class="uui-heading-xxsmall-2 show-card-header">Dead Calm</h3>
          <div class="uui-text-size-medium dark-caps">Mabel June, Boat Water</div>  <!-- supporting acts -->
        </div>
        <div class="show-info-container info-footer">
          <div class="show-info">
            <div class="location-icon ...">[pin svg]</div>
            <div fs-list-field="venues" class="base-text-size-caps truncate">Union Stage</div>
            <div class="dot-icon ...">[dot svg]</div>
            <div class="base-text-size-caps">All Ages</div>
          </div>
          <div class="show-info">
            <div class="base-text-size-caps text-gap">DOORS</div>
            <div class="base-text-size-caps">7:00 pm</div>
            <div class="base-text-size-caps line-gap">|</div>
            <div class="base-text-size-caps text-gap">Show</div>
            <div class="base-text-size-caps">8:00 pm</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER / CTA -->
    <div class="show-grid-footer">
      <div class="uui-button-row space-between-row">
        <div class="uui-button-wrapper">
          <div class="uui-text-style-link grid-footer-link">
            <div class="text-block-60">Tickets</div>
            <div class="text-block-60 w-condition-invisible">FREE RSVP</div>
            <div class="text-block-60 w-condition-invisible">Learn More</div>
            <div class="external-link-icon w-condition-invisible ...">[ext-link svg]</div>
          </div>
        </div>
      </div>
    </div>
  </a>
</div>
```

### Card fields

| Element | Class / attr | Content |
|---------|--------------|---------|
| Whole card link | `a.show-card-link[venue-color][href="/shows/{slug}"]` | Wraps the entire card → links to the detail page |
| Date stack | `.date-tag.date-tag-small` | Weekday / Month / Day (e.g. Mon / Jun / 15) |
| Presented-by | `.event-grid-presenter` | Optional; hidden when empty (`w-dyn-bind-empty`) |
| Title | `h3.show-card-header` (`fs-list-field="search"`) | Event name — this is the searchable field |
| Supporting acts | `.uui-text-size-medium.dark-caps` | Comma-separated support, e.g. "Mabel June, Boat Water" |
| Venue | `.base-text-size-caps.truncate` (`fs-list-field="venues"`) | Venue name, with pin icon |
| Age | `.base-text-size-caps` (after dot) | e.g. "All Ages" |
| Doors / Show | `.show-info` row | `DOORS` … `|` … `Show` … times |
| CTA | `.grid-footer-link` → `.text-block-60` | **`Tickets`** (default); hidden variants **`FREE RSVP`** and **`Learn More`**; optional external-link icon |

Exact card labels: **`DOORS`** (uppercase on cards), **`Show`**, **`Tickets`**,
**`FREE RSVP`**, **`Learn More`**.
> Note the casing difference vs the detail page, which uses **`Doors`** (title case).

### Image
- Source: the event's promo image (CMS), `loading="lazy"`, class `.image-40`,
  inside `.show-image-wrapper`.
- Aspect ratio is controlled by `.show-image-wrapper` CSS (fixed ratio crop); the
  `<img>` itself has no inline width/height — it fills the wrapper (object-fit cover style).

### Venue colour accent
- Each card carries `venue-color="{Venue full name}"` on the `<a>`.
- Observed values: `Union Stage`, `Jammin' Java`, `Pearl Street Warehouse`,
  `The Howard Theatre`, `The Miracle Theatre`, `The Theatre at Capital Turnaround` /
  `Capital Turnaround`, `Plaza Stage at Nationals Park`.
- Accent colours come from CSS variables `--_venues---{us|th|jj|ps|mt|ct|np}` and are
  applied via the per-venue `*-bg` classes (e.g. `.th-bg { background-color: var(--_venues---th) }`)
  used on the date tag / subnav. The `venue-color` attribute is the hook that maps a
  card to its venue's accent.

### Hover behaviour
- The card is one big anchor; hover is a link-style interaction (Webflow
  `.w-inline-block`). The CTA text is `.uui-text-style-link` (underline-on-link style).
- No dedicated JS-driven image zoom was found in the static markup; hover styling is
  CSS/Webflow-interaction driven.

---

## Pagination / load-more

- **Load More**, not numbered pagination: `fs-list-load="more"` on the list element
  (Finsweet). Webflow's own pagination is explicitly disabled (`pagination: false`).
- The static HTML pre-renders a large batch of items (≈100 for Union Stage, ≈78 for
  The Howard) and Finsweet handles incremental reveal + filtering on the client.

---

## Differences between venue listing pages

Union Stage (`/union-stage/shows`) vs The Howard (`/the-howard/shows`) are **structurally
identical**; only data and the active-venue highlight differ:

| Aspect | Union Stage | The Howard |
|--------|-------------|------------|
| `<title>` | `Union Stage Shows \| Union Stage Presents` | `The Howard Shows \| Union Stage Presents` |
| Active subnav highlight | `.us-bg ... w--current` | `.th-bg ... w--current` |
| Subnav root class | `.venue-subnav` (same `us-subnav` token observed in both source dumps) | same |
| Rendered item count | ~100 | ~78 |
| Card `venue-color` values present | all 7 venues appear in source, but the live grid is scoped to that venue's shows | same |
| Filters | identical (Month, Search, Clear) | identical |
| Load More | yes | yes |

Everything else — filter bar, card component, CTA copy, grid layout, Load More — is
shared across all venue listing pages. The venue identity surfaces through (a) the
active `*-bg` accent on the subnav and date tags, (b) the page title, and (c) the
CMS-scoped set of events.

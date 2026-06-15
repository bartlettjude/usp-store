# 06 — Venues

How Union Stage Presents (USP) presents its **seven venues** as a branded group, the per-venue accent-color system, the venue data (address / capacity / description), and the structure of the per-venue private-events sub-pages.

> Global design tokens (base colors, fonts, button styles) are documented elsewhere. This file focuses only on venue-specific theming and content.

---

## 1. The venue group

USP is the umbrella brand ("masthead") for a family-owned DC-area live-music ecosystem run by the **Brindley Brothers** (Daniel, Luke, Jonathan). The group is consistently described as **seven venues** plus side ventures (Union Pie pizza, a music school).

The seven venues, in the canonical site order (this exact order recurs in the top nav, the venue dropdown, and the homepage venue filter):

1. Union Stage
2. Jammin Java (a.k.a. "Jammin' Java")
3. Pearl Street (Pearl Street Warehouse)
4. The Howard (Howard Theatre)
5. Miracle Theatre
6. Capital Turnaround (The Theatre at Capital Turnaround)
7. Nationals Park (Plaza Stage at Nationals Park)

The brand also lists non-venue **ventures**: **Union Pie** (Jersey-style pizza at Union Stage & Jammin Java) and the **Jammin Java Music School**.

---

## 2. Per-venue accent-color system

This is the single most important venue-theming mechanism. Each venue has **one signature accent color**, defined as a CSS custom property and applied via a 2-letter venue-code class.

### Color tokens (from `unionstagepresents.shared.*.css`)

| Venue | Code | CSS variable | Hex | Swatch description |
|-------|------|--------------|-----|--------------------|
| Union Stage | `us` | `--_venues---us` | `#e7d355` | Mustard / gold-yellow |
| Jammin Java | `jj` | `--_venues---jj` | `#ff3c3b` | Bright red |
| Pearl Street | `ps` | `--_venues---ps` | `#ea798b` | Pink / rose |
| The Howard | `th` | `--_venues---th` | `#437cbf` | Mid blue |
| Miracle Theatre | `mt` | `--_venues---mt` | `#b25b24` | Burnt orange / terracotta |
| Capital Turnaround | `ct` | `--_venues---ct` | `#00b36c` | Green |
| Nationals Park | `np` | `--_venues---np` | `#d7d7d7` | Light grey / silver |

### How the colors are applied

The accent is applied through helper classes that all reference the venue variable, so the same component can be re-skinned per venue by swapping the 2-letter code:

```css
.us-bg { background-color: var(--_venues---us); }
.jj-bg { background-color: var(--_venues---jj); }
.ps-bg { background-color: var(--_venues---ps); }
.th-bg { background-color: var(--_venues---th); }
.mt-bg { background-color: var(--_venues---mt); }
.ct-bg { background-color: var(--_venues---ct); }
.np-bg { background-color: var(--_venues---np); }

/* nav / dropdown link variants */
.venue-link.us { background-color: var(--_venues---us); }
.venue-link.jj { background-color: var(--_venues---jj); }
/* ...etc... */
```

Usage seen in markup:

- **Top-nav venue dropdown links** carry the venue-code background class, e.g.
  `<a href="/union-stage/shows" class="venue-link us-bg full-opacity w-nav-link">Union Stage</a>`
  giving each venue link its own colored pill/background.
- The same `*-bg` classes are reused on the **About-page timeline** containers (`timeline-sizing-container us-bg` etc.) to color-code timeline blocks by venue.
- `.venue-link` base style: `opacity: .6`, header font, uppercase, centered; `:hover`/`.full-opacity` raise opacity to 1; `.w--current` underlines (2px) the active venue.

### Separate venue hero background **images** (not colors)

Distinct from the accent colors, each venue's show-listing hero uses a `*-bg-image` photo:

| Code | Hero image class | File |
|------|------------------|------|
| `us` | `.show-hero-section` (default) | `..._us-bg-image.webp` |
| `jj` | `.show-hero-section.jj-bg-image` | `...jj2.webp` |
| `ps` | `.show-hero-section.ps-bg-image` | `...psw.webp` |
| `th` | `.show-hero-section.th-bg-image` | `...ht-1.webp` |
| `mt` | `.show-hero-section.mt-bg-image` | `...4.webp` |
| `ct` | `.show-hero-section.ct-bg-image` | `...ct-bg.webp` |
| `np` | `.show-hero-section.np-bg-image` | `...Group-341.webp` |

So a venue is themed two ways: (1) flat accent color via `*-bg`, (2) hero photo via `*-bg-image`.

---

## 3. Venues presented as a group

### Top nav
A persistent row lists all seven venue names: `Union Stage · Jammin Java · Pearl Street · The Howard · Miracle Theatre · Capital Turnaround · Nationals Park`, plus the info links (`About · Contact · Private Events · Careers · FAQ`). Each venue links to its `/<venue>/shows` page. The venue links sit in a sub-nav (`venue-link` pills) that picks up the per-venue accent color.

### Homepage venue filter
The homepage show feed has a venue `<select>` filter (`select-field venue-select w-select`) with options:
`All Venues / Union Stage / Jammin Java / The Howard Theatre / Pearl Street / Miracle Theatre / Capital Turnaround / Nationals Park` (plus a Month filter). Each event card in the feed labels its venue (e.g. "Pearl Street Warehouse", "Jammin' Java", "The Howard Theatre", "The Miracle Theatre").

### Footer venue directory
The footer contains a `footer-venue-directory` → `venue-directory-grid` of `venue-info-container` cards. Each card has:
- `footer-venue-title` (linked to `/<venue>/shows`)
- `footer-address` (street + city/zip on two lines)
- a per-venue Instagram social list

This footer directory appears on **every** page and is the canonical address block:

| Venue (footer label) | Address |
|----------------------|---------|
| Union Stage | 740 Water Street SW, Washington, DC 20024 |
| Jammin Java | 227 Maple Ave E, Vienna, VA 22180 |
| The Howard | 620 T Street NW, Washington, DC 20001 |
| Miracle Theatre | 535 8th St SE, Washington, DC 20003 |
| Capital Turnaround | 770 M St SE, Washington, DC 20003 |
| Pearl Street Warehouse | 33 Pearl Street SW, Washington, DC 20024 |

### About-page "Our Venues (and Ventures)" gallery
The About page has a full venue-by-venue showcase section, each with **Venue Capacity**, **Location**, and a **Tickets** link. (Copy quoted in section 4.)

---

## 4. Per-venue detail (from About page "Our Venues (and Ventures)")

Each venue block uses the same template: descriptive paragraph → **Venue Capacity** → **Location** → **Tickets** CTA.

### Howard Theatre — accent `#437cbf` (blue)
> Since The Howard opened its doors in 1910, this vibrant hub for artistic expression has hosted heavy-hitting legends such as Duke Ellington, Ella Fitzgerald, Louis Armstrong, Billie Holliday, The Supremes, and James Brown. … the Union Stage Presents team is proud to have taken over the operations of the venue in 2022, returning it to a place of its original energy and spirit. Today we host breakout talent like Ari Lenox, Giveon, Rina Sawayama, Feid, and Royel Otis, and remain the premier home of DC's Go-Go scene…

- **Capacity:** 1200 (mostly) standing / 600 seated
- **Location:** 620 T Street NW, Washington, DC 20001

### Union Stage — accent `#e7d355` (mustard/gold)
> Born in 2017, our marquee namesake is your go-to hub for quality entertainment and a great night out at The Wharf. Home to wish-you'd-been-there early career shows from the likes of Brent Faiyaz, Orville Peck, Doja Cat, and Ethel Cain … underplays from established mainstays like The Hives, and a range of comedy, podcasts, open mics, drag shows, and more, this intimate space right on the Potomac has something exciting for any live entertainment fan.

- **Capacity:** 500 (mostly) standing / 200 seated
- **Location:** 740 Water St SW, Washington, DC 20024

### Plaza Stage at Nationals Park — accent `#d7d7d7` (silver/grey)
> A standout addition to DC's lively Navy Yard, Plaza Stage at Nationals Park brings fresh energy to the city's concert scene. As DC's only outdoor venue, it combines an intimate atmosphere with the thrill of a stadium setting. With Nationals Park as its backdrop, Plaza Stage offers music lovers unforgettable nights in an unbeatable location.

- **Capacity:** 4000 (mostly) standing
- **Location:** Nationals Park

### Jammin Java — accent `#ff3c3b` (red)
> The spot that started it all for the Union Stage Presents crew, Jammin Java is a longstanding community hub for music-making, live entertainment, and overall good vibes. Since 2001, the space has hosted countless up-and-coming bands who've gone on to become household names like Paramore, The Lumineers, and Bon Iver, and is still fostering the next generation of show-stopping musicians with our Music School. … this beloved venue remains a storied institution in Vienna, Virginia.

- **Capacity:** 240 (mostly) standing / 180 seated
- **Location:** 227 Maple Ave E, Vienna, VA 22180

### Miracle Theatre — accent `#b25b24` (burnt orange)
> This legendary Capitol Hill venue dates back to the tail end of 1909; originally the Meader Theater, it thrived as a vaudeville and later movie theater until the 1960s. … now the Brindley Brothers are giving the oldest operational movie theater in Washington, DC a breath of fresh air via thoughtful and exciting live programming.

- **Capacity:** 355 seated
- **Location:** 535 8th St SE, Washington, DC 20003

### Pearl Street Warehouse — accent `#ea798b` (pink/rose)
> A longtime fixture of the Wharf's nightlife scene and one of the original trio of music venues on the revitalized waterfront, Pearl Street Warehouse is Union Stage Presents' newest un-hidden gem. Right next door to our flagship venue Union Stage, Pearl Street continues Union Stage Present's DMV-wide tradition of hosting smaller shows that pack a big-time punch…

- **Capacity:** 250 (mostly) standing / 150 seated
- **Location:** 33 Pearl Street SW, Washington, DC 20024

### Capital Turnaround — accent `#00b36c` (green)
> What started as a historic car barn from the 1800s has been transformed into a state-of-the-art, live entertainment venue in Capitol Hill. The Main Hall is at the heart of it all, welcoming you to the Auditorium, the 900-seat performance space where you can catch anything from stand up titans like Ali Siddiq, Tim Heidecker, Hannibal Buress, and Ari Shaffir, live music from the likes of Bill Callahan and Warpaint, podcasting from Betches and Ride, and more.

- **Capacity:** 850 seated
- **Location:** 770 M St SE, Washington, DC 20003

### Union Pie (venture, not a venue)
> We take food and beverage so seriously that we started our own pizza company. If you're at Union Stage or Jammin Java, make your visit twice as nice with a slice from Union Pie, our Jersey-style pizza joint.

---

## 5. Per-venue site structure (venue micro-site)

Each venue is effectively its own micro-site under `/<venue-slug>/...`. Slugs:
`/union-stage`, `/jammin-java`, `/pearl-street`, `/the-howard`, `/miracle-theatre`, `/capital-turnaround`, plus Nationals Park.

The venue pages carry a **local secondary nav** (separate from the global nav). Observed on Pearl Street and The Howard:

- **Shows** (`/<venue>/shows`) — the default landing for each venue
- **Info** (dropdown) containing:
  - FAQ
  - Box Office
  - Private Events (`/<venue>/private-events`)
  - Our Mission (label renders as "Our MIssion" — typo in source)
  - Careers
  - Getting Here (`/<venue>/getting-here`)
  - Food / Drink (`/<venue>/food-drink`)
  - Our Story (`/<venue>/our-story`)

Confirmed live sub-routes: `shows`, `private-events`, `getting-here`, `food-drink`, `our-story` (all return content). The venue's accent color and hero image theme these pages.

---

## 6. Per-venue Private-Events pages

Pattern URL: `/<venue>/private-events/`. Confirmed to exist for at least Pearl Street, The Howard, Union Stage, Jammin Java (all return 200). Each detailed page follows the **same template**:

```
[Venue local nav]
H1: Private Events
CTA line: "Click here to fill out our private event submission form!"  (→ Tripleseat form)
Intro paragraph (venue-specific pitch)
Capacity block (3 modes: Standing Reception | Theater Seating | Banquet Seating)
Key Features (bulleted list)
Testimonials (3 quoted reviews, attributed)
Past Clients: (logo strip)
The Space: (photo gallery)
[Global footer]
```

### Pearl Street Warehouse private events
- **Intro:** "A longtime fixture of The Wharf's nightlife scene and one of the original trio of music venues on the revitalized waterfront, Pearl Street Warehouse is Union Stage Presents' newest un-hidden gem. Whether you are looking to host a corporate mixer, your company's holiday party, or a wedding reception your guests are sure to remember, Pearl Street Warehouse offers an unconventional backdrop for your next event."
- **Capacity:** Standing Reception: 300 | Theater Seating: 150 | Banquet Seating: 100
- **Key Features:**
  - Daytime & evening event rentals, plus outdoor patio
  - Flexible layout options
  - 23-foot built-in stage + state-of-the-art sound & lighting system
  - Two (2) full-service bars + in-house catering
  - Two (2) VIP green room areas
  - Wi-Fi available
- **Testimonials (3):** Jeffrey Ketron, Sr. (Private Event Attendee); a Birthday Party Host (sweet sixteen); Tom A. (Corporate Event Host).
- **Submission form:** Tripleseat — `https://unionstagepresents.tripleseat.com/dynamic_party_request/1128`

### The Howard Theatre private events
- **Intro:** "Staying true to its roots as 'The Theatre for the People,' the 12,000 square foot historic venue features two distinct floors with a horseshoe-shaped balcony overlooking a 30′ stage and comes fully equipped with state-of-the-art production, lighting and A/V systems. Cement your event in The Howard's storied history."
- **Capacity:** Standing Reception: 800 | Theater Seating: 600 | Banquet Seating: 300
- **Key Features:**
  - Daytime & evening event rentals
  - Flexible layout options
  - 30-foot built-in stage + state-of-the-art sound & lighting system included in room rental fee
  - Three (3) projectors and screens plus customizable digital screens on both levels
  - Two (2) full-service bars
  - Four (4) VIP green rooms
  - Complimentary reserved onsite parking for client & vendors
  - Accessible via MetroRail and MetroBus
  - Wi-Fi available
  - "Check out the complete Private Event Rental Guide for The Howard Theatre for more information"
- **Testimonials (3):** MS Tabu Winslow Morris (National Republican Party Trailblazer Awards attendee); Miriam E. (fundraiser organizer); Latoya M. (family reunion).
- **Past Clients / photographers credited:** Brian Dozier for Center for American Progress; Jenifer Morris Photography; An Endless Pursuit; Rodney Bailey Event Photography.
- **Submission form:** Tripleseat — `https://bbkingblues.tripleseat.com/party_request/8549` (note the legacy "bbkingblues" Tripleseat account on The Howard's page).

> The top-level `/private-events` hub (see `07-info-pages.md`) summarizes four bookable venues (Union Stage, The Howard, Jammin Java, Pearl Street) and links into these per-venue detail pages.

---

## 7. Recreation notes / takeaways

- Model venue accent colors as **7 CSS custom properties** keyed by 2-letter code, then apply via reusable `*-bg` utility classes — never hard-code per component.
- Each venue is a **mini-site** (`/<slug>/{shows,private-events,getting-here,food-drink,our-story}`) with a local nav + an "Info" dropdown, themed by the venue's accent color and a venue hero photo.
- Private-events pages are a **single reusable template** parameterized per venue (intro copy, 3-mode capacity, key features bullets, 3 testimonials, past-clients logo strip, photo gallery, Tripleseat CTA).
- Canonical venue ordering is fixed: US, JJ, PS, TH, MT, CT, NP — preserve it everywhere (nav, filter, footer).

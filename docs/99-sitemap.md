# Site Map — Union Stage Presents

Discovered from homepage links (the public `/sitemap.xml` returns 404). The site is a
venue group with a shared shell and per-venue micro-sites.

## Top-level / global pages
| URL | Purpose |
|-----|---------|
| `/` | Homepage — hero + show grid |
| `/about` | About / brand story |
| `/contact` | Contact + per-venue email directory |
| `/private-events` | Private events hub |
| `/careers` | Careers (hands off to external ATS) |
| `/faqs` | FAQ accordion (~23 Q&As) |
| `/accessibility` | Accessibility statement |
| `/privacy` | Privacy policy |
| `/terms` | Terms |

## Venues (each is a micro-site)
Pattern per venue: `/<slug>/shows`, plus some of
`/<slug>/private-events`, `/<slug>/getting-here`, `/<slug>/food-drink`, `/<slug>/our-story`.

| Venue | Listing URL | Accent |
|-------|-------------|--------|
| Union Stage | `/union-stage/shows` | `#e7d355` |
| The Howard | `/the-howard/shows` · `/the-howard/private-events/` | `#437cbf` |
| Pearl Street | `/pearl-street/shows` · `/pearl-street/private-events/` | `#ea798b` |
| Jammin' Java | `/jammin-java/shows` | `#ff3c3b` |
| Miracle Theatre | `/miracle-theatre/shows` | `#b25b24` |
| Capital Turnaround | `/capital-turnaround/shows` | `#00b36c` |
| Nationals Park | `/nationals-park/shows` | `#d7d7d7` |

> Note: there is **no** global `/shows` listing — it 404s. Listings are per-venue.

## Event detail pages
Pattern: `/shows/<artist-slug>-<dd>-<mon>` (e.g. `/shows/an-evening-with-ira-glass-11-jul`).
~100+ live event pages were linked from the homepage at capture time. Private bookings appear as
`/shows/private-event-#####`. See `04-show-detail-template.md` for the template.

## Hosting / platform
- Webflow CDN: `https://cdn.prod.website-files.com/6902734080a4b345f41078da/`
- Ticketing: Opendate (`app.opendate.io`) embedded iframes; TicketWeb for some Howard shows
- Filters: Finsweet Attributes (Month / Search / Clear / Load More)

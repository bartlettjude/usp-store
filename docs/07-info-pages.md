# 07 — Informational / Static Pages

Layout, section structure, key copy, forms, and unique components for the static/info pages of unionstagepresents.com: **About, Contact, Private Events, FAQs, Careers, Accessibility**.

> Built on Webflow; ticketing is "Powered by Opendate" (TicketWeb for The Howard). Global design tokens documented elsewhere.

---

## Shared chrome (every info page)

**Header / nav** (`Skip to Main Content` link first, for a11y):
- Info links: `About · Contact · Private Events · Careers · FAQ`
- Venue links (with per-venue accent pills): `Union Stage · Jammin Java · Pearl Street · The Howard · Miracle Theatre · Capital Turnaround · Nationals Park`

**Footer** (consistent on all pages):
1. **Venue directory grid** — each of the 6 DC/VA venues with name (linked to `/<venue>/shows`), address, and Instagram link:
   - Union Stage — 740 Water Street SW, Washington, DC 20024
   - Jammin Java — 227 Maple Ave E, Vienna, VA 22180
   - The Howard — 620 T Street NW, Washington, DC 20001
   - Miracle Theatre — 535 8th St SE, Washington, DC 20003
   - Capital Turnaround — 770 M St SE, Washington, DC 20003
   - Pearl Street Warehouse — 33 Pearl Street SW, Washington, DC 20024
2. **Newsletter / SMS signup** ("Subscribe to our mailing list") — documented under Contact below; appears in footer site-wide.
3. **Legal row:** `© , Union Stage Presents · Privacy · Accessibility · Powered by Opendate`

---

## Brand voice & tone (from About)

The voice is **warm, scrappy, communal, slightly irreverent, mission-driven**. It leans on a family-business / underdog origin story and name-drops famous alumni to signal credibility. Signature recurring rallying cry: **"IF NOT NOW, WHEN?"** (opens and closes the About narrative: "Because if not now, when?").

**Tagline (homepage `<title>` and hero):**
```
Creative Expression By Anyone, For Everyone
```
Rendered in the hero as two lines: "Creative Expression / By Anyone, For Everyone." with a CTA "Find Your Shows At Union Stage Presents".

**Mission statement (About page) — slightly different wording, note "for anyone" vs the tagline's "for everyone":**
> "…creative expression by anyone, for anyone — inclusive places to find yourself. We are a family business started by musicians and music lovers. We believe in the power of being with community in a room, enjoying an experience together, and creating lifelong memories that stick with anyone who walks through our doors."

Tone keywords to reproduce: *family business, community hub, inclusive, world-class, dreamers and doers, lore, vibes, breakout/early-career talent, "the Brindley way of life."*

---

## 1. About (`/about`)

**Page label / sections:** "A Note From USP" · "Our Venues (And Ventures)" · "Mission" · "Our Timeline" · "Our Venues (and Ventures)".

### Layout / section structure
1. **Hero / Note from USP** — headline **"IF NOT NOW, WHEN?"** + origin-story narrative.
2. **Mission** block (quoted above).
3. **Our Timeline** — vertical timeline of milestones (2001 → 2025). Timeline blocks are color-coded using the per-venue `*-bg` classes (see `06-venues.md`). Each entry is duplicated in source (Webflow slider/duplication pattern).
4. **Our Venues (and Ventures)** — venue-by-venue showcase (full copy + Capacity + Location + Tickets per venue; see `06-venues.md`), ending with **Union Pie**.
5. CTA: "Want to work with us? Got a business idea? Find us here."

### Key copy
**Origin story (lead):**
> "It's this attitude that's landed Daniel, Luke, and Jonathan – the Brindley Brothers – atop a growing venue ecosystem that remains a family business through and through. It all started with now-legendary Jammin Java, a strip mall hole-in-the-wall the brothers fatefully snapped up in 2001. Utterly transformed by the Brindleys from a failing to thriving business, the space would go on to become a community hub … as well as a cherished early-career stop for acts who've gone on to become household names, including Paramore, Bon Iver, and The Lumineers. 23 years later, it's still a go-to stop for acts before they hit it big."

**Portfolio summary:**
> "Currently, Union Stage Presents' masthead includes seven venues (Union Stage, Jammin Java, The Howard, Pearl Street, Miracle Theatre, The Theatre at Capital Turnaround, and the brand new, 4000 capacity outdoor venue Plaza Stage at Nationals Park), a pizza place (Union Pie), and a community-centered vision that continues to push the boundaries of how great the show-going experience can be."

**Values close:**
> "As they've shown for more than two decades, creating meaningful, inclusive, world-class experiences is the Brindley way of life. … one thing is for certain – you'll find the vibes you're looking for. Because if not now, when?"

### Timeline content (Our Timeline)
| Year | Milestone |
|------|-----------|
| 2001 | The Brindley Brothers take over Jammin Java |
| 2002 | Jammin Java builds a new stage, gets a liquor license, starts to gain recognition |
| 2007 | Paste Magazine names Jammin Java one of "America's 40 Best Music Venues" |
| 2009 & 2010 | Pollstar names Jammin Java a Top 100 Club in the World (back-to-back) |
| 2014 | Jammin Java unveils "Music Makes Life Better" community program |
| 2017 | Brindleys announce & open Union Stage |
| 2017 | Under the USP name, Brindleys start presenting concerts at DC's Miracle Theatre |
| 2018 | Brindleys open Jersey-style pizza joint Union Pie at The Wharf |
| 2020 | USP starts presenting live events at the Theatre at Capital Turnaround |
| 2020 | Brindleys open a Union Pie location inside Jammin Java |
| 2022 | Pollstar names Union Stage a Top 50 Club in the World |
| 2022 | USP takes over booking, promotions & operations at DC's Howard Theatre |
| 2023 | Pollstar ranks Howard Theatre #24 in Global Ticket Sales (in one year) |
| 2024 | USP formally announced; Pearl Street Warehouse added to the portfolio |
| 2025 | Plaza Stage at Nationals Park opens with a sold-out "Adobo DMV" party |

### Unique components
- Color-coded vertical **timeline** keyed to venue accent colors.
- Venue showcase cards with Capacity / Location / Tickets triplet.

---

## 2. Contact (`/contact`)

### Layout / section structure
Per-venue **contact directory** (a block per venue listing role-based emails + address), followed by a condensed venue address list, then the footer newsletter/SMS form.

### Contact directory (role → email, per venue)
**Union Stage** — 740 Water Street SW, Washington, DC 20024
- GM: kaitlin@unionstage.com · Booking: jon@ / ryan@ / db@unionstage.com · Private Events: dana@ / lana@unionstage.com · Ticketing: support@opendate.io · Website & Marketing: jake@ / moira@unionstage.com · General: us@unionstage.com

**Jammin Java** — 227 Maple Ave E, Vienna, VA 22180
- GM: izzy@jamminjava.com · Booking: zeeshan@ / db@unionstage.com · Private Events: lana@unionstage.com · Lessons: jjmusicschool@gmail.com · Website & Marketing: jake@ / moira@unionstage.com · Ticketing: support@opendate.io · General: us@unionstage.com

**The Howard** — 620 T Street NW, Washington, DC 20001
- GM: diamone@unionstage.com · Booking: jon@ / ryan@ / db@unionstage.com · Private Events: dana@unionstage.com · Website & Marketing: jake@ / moira@unionstage.com · Ticketing: info@ticketweb.com · General: us@unionstage.com

**Pearl Street** — 33 Pearl Street SW, Washington, DC 20024
- GM: hannah@unionstage.com · Booking: jon@ / zeeshan@ / db@unionstage.com · Private Events: dana@ / lana@unionstage.com · Website & Marketing: luke@ / jake@unionstage.com · Ticketing: support@opendate.io · General: us@unionstage.com

**Miracle Theatre** — 535 8th Street SE, Washington, DC 20003
- Booking: jon@ / ryan@ / db@unionstage.com · Ticketing: support@opendate.io · General: us@unionstage.com

**The Theatre At Capital Turnaround** — 770 M Street SE, Washington, DC 20003
- Booking: jon@ / ryan@ / db@unionstage.com · Ticketing: support@opendate.io · General: us@unionstage.com

> Pattern: each venue exposes role-based emails (GM, Booking, Private Events, Website & Marketing, Ticketing, General). Most route to `@unionstage.com`; ticketing is split — **Opendate** (support@opendate.io) for everything except **The Howard**, which uses **TicketWeb** (info@ticketweb.com).

### Newsletter / SMS signup form (the site-wide footer form)
- **Form:** `wf-form-Newsletter-Form` · `method=POST` · action → `https://heroku-recaptcha-49b596afbb76.herokuapp.com/union-stage-recaptcha` (a custom reCAPTCHA-validating Heroku endpoint that posts to Opendate).
- **Heading:** "Subscribe to our mailing list"
- **Fields:**

| Field | name | type | placeholder | required |
|-------|------|------|-------------|----------|
| Email | `fan[email]` | email | "Enter an email..." | yes |
| Phone Number | `fan[phone_number]` | tel | "Enter a phone number..." | yes |
| SMS consent checkbox | `SMS-Agreement` | checkbox | — | yes |

- **Hidden fields:** `fan[venue_ids][]` ×7 (one UUID per venue — subscribes to all venues), `fan[subscribe_to_marketing]=true`, `fan[tags][]=website`, `request` (reCAPTCHA token), `redirect_url=thanks`.
- **SMS consent copy (required, quoted verbatim):**
  > "I agree to receive text messages from Union Stage Presents related to events I attend, including event reminders, schedule updates, and venue information (such as parking, entry instructions, or delays). These messages are informational and not promotional. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase."
  > "I accept the Terms of Service and Privacy Policy"
- **Success / error states:** "Thank you! Your submission has been received!" / "Oops! Something went wrong while submitting the form."

> There is **no free-text "contact us" message form** — the Contact page is a directory of emails; the only form is the newsletter/SMS signup.

---

## 3. Private Events (`/private-events`) — top-level hub

### Layout / section structure
1. **H1:** "Private Events"
2. **Hero pitch (all caps):**
   > "PLAN YOUR NEXT PARTY AT ONE OF OUR VENUES – WE GUARANTEE YOU'LL WALK AWAY FEELING LIKE A ROCKSTAR!"
3. **Intro paragraph:**
   > "You already know that Union Stage Presents clubs are world-class venues for live entertainment, presenting over a thousand shows a year. Now you can host your own private event at Howard Theatre, Union Stage, Pearl Street Warehouse, or Jammin Java – some of the most versatile and accommodating spaces in the Washington, DC area. You'll have full access to state-of-the-art A/V capabilities, flexible floor plans, our expert event team, and more."
4. **Four venue cards**, each with a short pitch + CTA "<Venue> Private Events" linking to the per-venue detail page (`/<venue>/private-events`):
   - **Union Stage** → "Set the stage for special occasions like social gatherings, corporate events, or the wedding of your dreams…"
   - **The Howard** → "…the 12,000 square foot theatre offers two-tiered horseshoe-shaped seating (booths and tables) centered on a 30-foot stage, making even the largest event seem intimate."
   - **Jammin' Java** → "…imagine getting to plan one of these nights for yourself, inviting your friends, and partying away without a care in the world."
   - **Pearl Street** → "With a 250 person capacity, two large bars, full A/V capabilities, and the opportunity to work with our expert booking team…"

### Unique components
- Hub → spoke pattern: links to four per-venue private-events pages (full detail of those pages, including Tripleseat booking forms, in `06-venues.md` §6).
- Bookable venues are a **subset** (Union Stage, The Howard, Jammin Java, Pearl Street) — Miracle, Capital Turnaround, Nationals Park are not pitched for private events here.

---

## 4. FAQs (`/faqs`)

### Layout
**H1:** "Frequently Asked Questions" followed by an **accordion** — each item is a question (toggle header) revealing the answer. Single-column, full list (~22 items). Webflow toggle/accordion interaction.

### Accordion items (Q → answer summary)
| Question | Answer gist |
|----------|-------------|
| I bought a ticket. Now what? | Confirmation email from hello@mail.opendate.io (or info@ticketweb.com for Howard) with QR codes; show QR or photo ID. |
| Do you have a box office? Hours? | Yes — Pearl Street Warehouse (33 Pearl St SW). Mon–Fri 12–6 PM. See `/box-office`. |
| Sold-out show — resale tickets? | No official resale platform; can't verify third-party tickets. |
| Refund / transfer? | Non-refundable unless canceled/rescheduled. Transfers via email (info@ticketweb.com for Howard, support@opendate.io otherwise), ≥2 business days before show. |
| Lost confirmation email? | Use resend link (non-Howard); or look up by name + photo ID at box office. |
| Can I upgrade my ticket? | Buy the upgrade, then email for refund of old order ≥2 business days prior. |
| What time should I arrive? | Door/show times on Shows page, vary per show; subject to change; line up at own discretion (no security until later, at own risk; first come first served). |
| Bag policy? | Small bags OK (need not be clear); large bags prohibited; all bags searched. |
| Camera? | Nonprofessional (point-and-shoot, no detachable lens) at most shows; no audio/video recording; NO FLASH. |
| ADA accessible? | Yes; contact venue GM (Contact page) in advance. |
| My band wants to play? | Email talent buyer (see Contact page). |
| Age restrictions? | Mostly all-ages; valid non-expired govt photo ID required (alcohol sold). Kids ≤1 free, 2+ need ticket. |
| How to get updates? | Email list + Instagram, Facebook, X. |
| Are you hiring? | Yes — kitchen/bar/serving (Jammin Java); online application. |
| Dress code? | Dressed + shoes; comfortable closed-toe encouraged. |
| Payment forms? | Cards, Apple Pay, cash. |
| Will there be a seat? | Capital Turnaround & Miracle Theatre are seated; US/Howard/JJ/Pearl mixed — see show page. |
| Table minimum spend? | Jammin Java Premier/Premier Plus: 2-item consumption min; no minimums elsewhere. |
| Can I eat during a show / outside food? | Eat/drink OK; no outside food or beverages. |
| Dietary needs (vegan, GF)? | Will do our best to accommodate. |
| Book a private event? | Yes — "More info here." |
| Lost & found? | Contact the venue's GM (Contact page). |
| Bag/merch storage? | The Howard has "Venue Vault" smart lockers (9"H × 15.5"W × 18"D) in basement lobby (entertainmentlockers.com). |
| Can I call the venue? | No monitored phone line. Email support@opendate.io (daily 10 AM–8 PM ET, after-hours chatbot); info@ticketweb.com for Howard; us@unionstage.com for other questions. |

### Unique components
- Question/answer **accordion** (toggle) — the page's defining component.
- Recurring split-routing note: **Opendate** vs **TicketWeb (Howard)** appears throughout.

---

## 5. Careers (`/careers`)

### Layout
Minimal single-section page.
- **H1:** "Join our team!"
- **Body:**
  > "For careers at Union Stage Presents – Click here or use the link below to see and apply for our currently available positions!"
- **CTA:** "Union Stage Presents Jobs & Careers" → external ATS at `https://union-stage-presents.theindustry365.com/careers`
- Footer (standard).

> No on-page application form — purely a hand-off to the external careers portal (theindustry365.com).

---

## 6. Accessibility (`/accessibility`)

### Layout
Long-form text/legal page. "Last Updated: January 2nd, 2026."

### Sections (headings)
1. **Accessibility Statement** — "Union Stage Presents is committed to ensuring digital accessibility for all users…"
2. **Conformance Status** — aims to conform to WCAG; acknowledges some content may not yet be fully accessible.
3. **Accessibility Features** (bulleted):
   - Logical heading structure and readable text
   - Keyboard navigation support
   - Use of alternative text for meaningful images
   - Color contrast considerations for readability
   - Responsive layouts for assistive technologies
4. **Ongoing Efforts** — regular review; welcomes feedback.
5. **Feedback & Assistance:**
   > Email: us@unionstage.com — Subject line: "Website Accessibility". Include: the page URL, a description of the issue, and the assistive technology used (if applicable).

### Unique components
- None beyond standard prose; reflects the "Skip to Main Content" link present in the global header.

---

## 7. Recreation notes / takeaways

- **Voice:** family-owned, community-first, underdog-made-good; rally cry **"IF NOT NOW, WHEN?"**; tagline **"Creative Expression By Anyone, For Everyone."**
- **Forms:** only two real forms site-wide — (1) the footer **newsletter/SMS** signup (Webflow → Heroku reCAPTCHA → Opendate, subscribes to all 7 venues via hidden `fan[venue_ids][]`), and (2) per-venue **Tripleseat** private-event request forms. Contact is an email directory, not a message form; Careers hands off to an external ATS.
- **Ticketing split is a recurring content pattern:** Opendate everywhere except The Howard (TicketWeb). Reproduce this conditional wording on ticket/FAQ/transfer copy.
- **FAQ** is an accordion; **About** features a venue-color-coded timeline; **Private Events** is a hub linking to per-venue spokes.
- Static pages reuse a single layout shell (a11y skip link, full venue nav with accent pills, venue-directory footer, newsletter form, legal row "Powered by Opendate").

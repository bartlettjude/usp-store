# USP Brand Book Audit — Spec + Gap Report

Source: **USP Brand Book (Internal Copy)**, "Brand Guidelines — Summer 2024" (`brand/brandbook.pdf`).
Extracted copy: `brand/brandbook-clean.txt`. Audited target: our **gift shop** (`shop/`).
Method: text + font + color extraction from the PDF, then 3 parallel audits (color/type, creative system, voice).

> Disk was full so the PDF couldn't be rendered to images — this is built from extracted **text, embedded fonts, and hex values**. Visual-only details (exact spacing, logo clear-space) aren't captured here.

---

## PART 1 — What the brand book actually specifies

### Contents
`01 Color palette · 02 Display typeface · 03 Paragraph typeface · 04 Photography style · 05–06 Anatomy of creative · 07–08 Frame system · 09–11 Brand in use (Newsletter, Website, Instagram)`

### Color
- Foundation: **black `#000000` & white `#ffffff`** — "a black & white glimpse that contains multitudes."
- **PRIMARY** (seen most): Union Stage **Yellow `#e7d355`**, Jammin' Java **"Orange"**, Howard Theatre **Blue `#427cbf`**.
- **SECONDARY** (seen less, coordinating): Capital Turnaround **green `#00b36c`**, Miracle Theatre **rust `#b25b24`**, Pearl Street **pink `#ea798b`**.
- Only hexes printed in the book: `#000000`, `#ffffff`, `#e7d355`, `#427cbf`, `#00b36c`, `#b25b24`, `#ea798b`. **No cream, no gold.**

### Typography
- **Display: LFT Etica Mono** — Light / Book / Regular / **Semibold (main)** / Bold. Monospaced slab.
  - **Rule (signature):** display type *always* sits on a **color highlight** — white-on-black, black-on-white, or black-on-colored block.
- **Paragraph: Arial** — Regular / Bold / Black. "to coordinate with the type used in the logo."
  - **Rule:** copy shorter than 3 lines → **bold italic, all lowercase** (evokes the logo type).
- `XenaraRg-Regular` is embedded in the PDF (role unconfirmed; not named in copy). **Special Elite is NOT in the book.**

### Creative system
- **Frames:** loose structure; photo + text placed anywhere, **room at the bottom for the logo** (centered or right-aligned). Every frame has **a color variation per venue**.
- **Logo:** recolored to the **corresponding venue color**; single-color for max visibility.
- **Show KV anatomy:** artist name **broken across lines for impact**, venue name, **"Show at 8PM" / "Doors at 7PM" / "Tonight"**, CTA **"Tickets on sale now at unionstagepresents.com"**, text highlight in venue color.
- **Photography:** high energy, real candid moments; **diverse & inclusive — "the audience needs to see themselves."**

### Voice
Loud, lowercase, Gen-Z, emoji-friendly, internet-speak. Evidence: *"HAPPY JUNE BESTIANA!"*, *"ya dig?"*, *"\*OLIVIA RODRIGO VOICE\*"*, *"USE CODE 'MUMBO' FOR EARLY ACCESS"*, *"the vibiest local vibes."*
- **Signature line / IG bio: "5 venues. 1000s of shows. Endless vibes."**

---

## PART 2 — Where OUR shop misses the brand (prioritized)

### 🔴 Critical / High
| # | Gap | Brand says | Our shop does | Fix |
|---|-----|-----------|---------------|-----|
| 1 | **No highlight/marker text** | Display type *always* on a color highlight block | Hero uses an **outlined knockout stroke** (`styles.css:127-131`); no heading has a marker | Add a `.hl` highlight utility (`box-decoration-break: clone`); apply to hero, card titles, newsletter h2; remove the stroke |
| 2 | **Invented cream accent** | Palette is B/W + venue colors only; **no cream** | `--accent-cream: #e7decd` (`styles.css:29`) used everywhere (nav, hero, filter bar, footer, toast) | Remove cream; use black/white as the accent, or Union Stage Yellow where one accent color is needed |
| 3 | **Invented gold** | No gold in palette | `--accent-gold: #e9c73e` + `#e9c73e` tints | Delete; use `#e7d355` if a yellow is needed |
| 4 | **Body font wrong** | Paragraph = **Arial** | `--font-body: system-ui, …` (`styles.css:47`) | Set body to `Arial, "Helvetica Neue", Helvetica, sans-serif` |
| 5 | **Logo never recolored** | Logo in corresponding venue color | One static **white raster** `.webp`, can't be tinted | Ship logo as inline SVG or CSS mask so `currentColor`/venue token drives it |
| 6 | **No people photography** | High-energy, diverse, candid — "see themselves" | Zero people; flat black hero + blank product mocks | Add a candid crowd/show hero image + on-model lifestyle shots |

### 🟡 Medium
| # | Gap | Brand says | Our shop does | Fix |
|---|-----|-----------|---------------|-----|
| 7 | **Howard Blue hex off** | `#427cbf` | `--th: #437cbf` | Change to `#427cbf` |
| 8 | **Jammin' Java named "Orange"** | "Orange" | `--jj: #ff3c3b` (red) | Re-confirm shade; shift toward orange / relabel |
| 9 | **No primary/secondary hierarchy** | 3 primaries seen most, rest less | All venue colors equal; cards hardcoded to cream | Encode roles; bias defaults to US/JJ/TH; drop non-brand `--np` |
| 10 | **Semibold not default** | Etica Mono **Semibold** = main display | Everything defaults to weight 700 (Bold) | Load + default display to 600 |
| 11 | **Short-copy rule missing** | <3 lines → bold italic lowercase | Not implemented (we use uppercase) | Add Arial bold-italic-lowercase style for kickers/captions |
| 12 | **Special Elite off-brand** | Not in book | Imported + used on hero kicker/footer | Remove; replace with rule #11 |
| 13 | **Frame system unused** | Cards as venue-colored frames, logo at bottom | Conventional cards; `.card__venue` tag & `--card-accent` are dead code | Drive `--card-accent` per venue; emit venue tag; bottom logo strip |
| 14 | **Voice is generic** | Loud Gen-Z internet-speak | "Never Miss A Drop", "Take a little of the rooms you love home" | Re-voice hero/newsletter/microcopy |
| 15 | **Signature line missing** | "5 venues. 1000s of shows. Endless vibes" | Used **nowhere** | Add to footer and/or hero kicker |

### 🟢 Low
- Tagline styled with corporate quote marks instead of book's lowercase bold-italic.
- Product names flat ("Classic Logo Tee", "Heavyweight Hoodie") — could be re-voiced ("The OG Tee", "Built-Different Hoodie").
- Nav says "Gift Shop / Gifts"; the book only ever says "merch."
- Microcopy ("Subscribe", "Your Cart", "Checkout", "Added to cart") could carry brand energy ("I'm in", "Your Stash", "Cop It", "In the bag ✓").

---

## Top 6 highest-impact fixes (if we act)
1. **Add the highlight/marker treatment** to all display type (the single most recognizable brand device).
2. **Kill cream + gold**, restore the black/white + venue-color palette.
3. **Switch body font to Arial.**
4. **Recolorable SVG logo** driven by venue color.
5. **Add candid, inclusive photography** (hero + on-model).
6. **Inject the voice + "5 venues. 1000s of shows. Endless vibes"** across hero/newsletter/footer.

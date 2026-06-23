# USP Gift Shop — Showcase & Shopify Roadmap

How to **demo the site now** (no real data needed) and the **step-by-step path to a real
Shopify-powered store** once Union Stage Presents provides product data.

- **Live demo:** https://usp-store-coral.vercel.app
- **Repo:** github.com/bartlettjude/usp-store
- **Front-end today:** static `shop/` (HTML/CSS/JS), brand-aligned to the USP Brand Book.
- **Commerce today:** none — products are placeholder data in `shop/app.js`; the cart is a
  local mockup (no payment).

---

## Phase 0 — Showcase the demo NOW (this week, no Shopify)

The build is presentable as-is. Steps to put it in front of the client:

1. **Confirm the live link works** — `usp-store-coral.vercel.app` (already deployed on Vercel).
2. **Mark it clearly as a demo** so placeholder products aren't mistaken for real inventory:
   - Add a small "Sample products — preview only" note near the filter bar, and/or
   - Turn on Vercel password protection if the client wants it private.
3. **Record a walkthrough** (GIF/screen recording) for async sharing — flow below.
4. **Walkthrough script (≈90s):**
   1. Hero — brand-accurate type/color, the "GIFT SHOP" knockout, pizza cursor.
   2. Filter by category (T-Shirts → Hoodies → Accessories).
   3. Show the SOLD OUT / LAST CALL stamps (real brand stamps).
   4. Add to cart → open the cart drawer → quantity + subtotal.
   5. Newsletter band + footer (brand voice, venue directory).
   6. Resize to mobile to show responsiveness.
5. **Talking points** (why it's on-brand): palette, LFT Etica Mono + Arial, the highlight
   device, the playful voice ("ya dig?"), per the brand book audit (`brand/brand-audit.md`).
6. **Collect feedback + the data we need** (Phase 1 checklist).

> Deliverable of Phase 0: client sign-off on the design direction + the filled-in Phase 1 checklist.

---

## Phase 1 — What we need from USP before Shopify

Hand this checklist to the client:

**Store & commerce**
- [ ] Shopify store created (any paid plan supports the Storefront API).
- [ ] Shopify Payments (or chosen gateway) configured.
- [ ] Shipping zones/rates + tax settings.
- [ ] Refund / shipping / privacy policies.
- [ ] Domain for the shop (e.g. shop.unionstagepresents.com).

**Catalog (the big one)**
- [ ] Product list: title, description, **price**, **SKU**.
- [ ] **Variants**: sizes (S–3XL), colors.
- [ ] **Inventory** counts per variant (drives SOLD OUT / LAST CALL).
- [ ] Real **product photography** (flat-lay + on-model; brand wants candid/inclusive).
- [ ] How products group into **collections** (T-Shirts / Hoodies / Hats / Accessories / Posters / Stickers).
- [ ] **Venue association** per product (for the accent color), if any.

**Brand assets**
- [ ] Logo as **SVG** (so it can recolor per venue — current logo is a flat raster).
- [ ] Approved hero / lifestyle photography.

---

## Phase 2 — Pick the Shopify architecture

| Option | What it is | Pros | Cons | Fit |
|--------|-----------|------|------|-----|
| **A. Headless (Storefront API)** ⭐ | Keep our custom front-end; pull products + checkout from Shopify via GraphQL | Full design control (keeps everything we built), same stack as your **CUE** project | We port `shop/` to a framework (Next.js) | **Recommended** |
| B. Shopify theme (Liquid) | Rebuild the design as a Shopify-hosted theme | No separate hosting; built-in everything | Re-implement our CSS in Liquid; less control | If client wants to self-manage in Shopify admin |
| C. Hydrogen + Oxygen | Shopify's React framework + hosting | First-class Shopify integration | New stack, Oxygen hosting lock-in | Overkill here |

**Recommendation: Option A (headless Storefront API + Next.js on Vercel)** — it preserves the
exact look we built and matches your existing CUE setup. The rest of this roadmap assumes A.

---

## Phase 3 — Build (headless path)

**3a. Shopify side**
1. Create the store; add products, variants, images, inventory.
2. Create collections matching our categories; add a `venue` tag (or metafield) per product.
3. (Optional) Metafield `status` for manual LAST CALL, else derive from inventory.
4. Configure Shopify Payments, shipping, taxes, policies.
5. Install a **headless / Storefront API** app → generate a **Storefront API access token**.

**3b. Front-end side (port `shop/` → Next.js App Router)**
1. Scaffold Next.js; **reuse `shop/styles.css` + `docs/design-tokens.css` verbatim** (the design is done).
2. Componentize what already exists: `Hero`, `FilterBar`, `ProductGrid`, `ProductCard`,
   `CartDrawer`, `Newsletter`, `Footer` — lift markup straight from `index.html`.
3. Replace the hardcoded `PRODUCTS` array with **Storefront API GraphQL** queries
   (products, collections, variants, images, `availableForSale`, inventory).
4. Wire the cart to the **Shopify Cart API**; "Cop It" → Shopify **hosted checkout** (redirect).
5. Map data (see cheat sheet below); keep the stamps, filters, and voice intact.
6. Env vars on Vercel: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`. Link the domain.

**3c. Data mapping — our demo → Shopify**
| Demo field (`app.js`) | Shopify source |
|----------------------|----------------|
| `name` | `product.title` |
| `price` | `variant.price` |
| `cat` (tee/hoodie/…) | Collection or `product.productType` → drives the filter chips |
| `venue` (accent color) | Product `tag` or metafield → drives `--card-accent` |
| `status: soldout` | `variant.availableForSale === false` / inventory 0 |
| `status: lastcall` | Low-inventory threshold, or a `status` metafield |
| `photo` | `product.featuredImage` / `images` |
| `meta` (sizing/specs) | Product description or metafields |
| `kind: poster/sticker` | `productType` (keeps the full-art display treatment) |

---

## Phase 4 — Launch

- [ ] QA every flow against the real catalog; test checkout in Shopify **test mode**.
- [ ] OG/meta tags, favicon, sitemap; analytics (GA4 / Shopify).
- [ ] Accessibility pass (focus states, alt text, contrast).
- [ ] Connect production domain; remove the "demo" note.
- [ ] Soft launch → announce via the newsletter band we already built.

---

## Sequencing summary

```
Phase 0  Showcase demo  ──►  Phase 1  Collect data  ──►  Phase 2  Pick arch (A)
                                                              │
                                   Phase 4  Launch  ◄──  Phase 3  Build headless
```

We can sit in **Phase 0** indefinitely — the demo is ready to show today. Nothing else
starts until the client returns the Phase 1 checklist (especially the catalog + photography).

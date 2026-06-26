# Shopify Storefront API — Setup

The shop is wired to pull its catalog live from Shopify, but it ships in **demo mode**
until you add two values. Behaviour today:

| State | What the shop shows |
|-------|--------------------|
| No domain / token (now) | The mock catalog in `data.js` — nothing changes. |
| Domain + token, **0 products** | Still the mock catalog (so the demo stays presentable). |
| Domain + token, **products exist** | The **live Shopify catalog**; checkout hands off to Shopify. |

All the plumbing lives in **`shopify.js`**. You don't touch any other file.

---

## Step 1 — Find your store domain

In Shopify admin the domain is the `*.myshopify.com` one (NOT a custom domain):
**Settings → Domains**. It looks like `union-stage-presents.myshopify.com`.

## Step 2 — Create a headless / custom app + Storefront token

The Storefront API token is **public and read-only** — it's *designed* to live in
browser JavaScript, so it's safe to commit. (This is different from the Admin API token,
which is secret — don't use that one.)

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**.
   (If it's the first time: click **Allow custom app development**.)
2. **Create an app** → name it e.g. `USP Storefront`.
3. Open the app → **Configuration** → **Storefront API** → **Configure**.
4. Tick these Storefront API access scopes:
   - `unauthenticated_read_product_listings` (products + collections)
   - `unauthenticated_read_product_inventory` (drives SOLD OUT / LAST CALL)
   - `unauthenticated_write_checkouts` + `unauthenticated_read_checkouts` (hosted checkout)
5. **Save**, then **API credentials** tab → **Install app**.
6. Copy the **Storefront API access token** (a long hex string). This is the public token.

> Alternative: install the **Headless** sales channel from the Shopify App Store — it
> generates the same Storefront token under "Manage API access".

## Step 3 — Paste both values into `shopify.js`

```js
const SHOPIFY = {
  domain: "union-stage-presents.myshopify.com",  // ← Step 1
  storefrontToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // ← Step 2 (public, OK to commit)
  apiVersion: "2025-01",
  productLimit: 100,
};
```

Save, hard-refresh the page. With 0 products you'll still see the demo; the console logs
`[shopify] connected, 0 products — keeping demo catalog.` Once products exist it logs
`[shopify] loaded N live products.`

> On Vercel the token is just baked into the static JS — no env var needed because it's
> public. (If you'd rather not commit it, keep it out of git and inject it at build time;
> not necessary for a Storefront token.)

---

## Step 4 — Structure the catalog so it maps correctly

The connector maps each Shopify product onto the shop's card shape. Set products up like
this and it "just works" (rules are in `shopify.js` → `mapProduct`):

| Shop field | Where it comes from in Shopify | Notes |
|-----------|-------------------------------|-------|
| **name / price / photo** | Title, variant price, featured image | automatic |
| **category chip** (Tees/Hoodies/Hats/Accessories) | **Product type** | `T-Shirt`→Tees, `Hoodie`→Hoodies, `Hat`/`Cap`/`Beanie`→Hats, everything else→Accessories. Override with a `cat:tee` tag. |
| **SOLD OUT** | Variant out of stock (`availableForSale` false) | track inventory in Shopify |
| **LAST CALL** | Inventory ≤ 5, **or** a `lastcall` tag | threshold is `LASTCALL_THRESHOLD` in `shopify.js` |
| **poster / sticker art treatment** | Product type `Poster` / `Sticker`, or a `kind:poster` tag | keeps the full-art card layout |
| **venue accent** (optional) | Tag `venue:us`, `venue:th`, `venue:ps`, `venue:jj`, `venue:mt`, `venue:ct`, `venue:np` | defaults to Union Stage if omitted |

Tag cheat-sheet (add as Shopify product tags): `venue:us`, `cat:tee`, `kind:poster`, `lastcall`.

## Step 5 — Checkout

When the catalog is live, the cart's **"Cop It"** button automatically calls
`shopifyCheckout()`, which creates a Shopify cart and redirects to **Shopify's hosted,
secure checkout** (real payment, shipping, tax). The mock `checkout.html` is only used in
demo mode. Configure **Shopify Payments, shipping zones, and tax** in admin for this to work.

---

## Notes

- **CORS:** the Storefront API allows direct browser requests — no proxy/server needed.
- **API version** (`2025-01`) can be bumped quarterly; Shopify supports each for ~12 months.
- To go back to pure demo, blank out `domain` / `storefrontToken` again.

# USP Gift Shop — Handoff

**Status: built, connected to Shopify, and verified end to end.**
The shop cannot take real orders yet — that needs four decisions on the Shopify
account, listed below. None of them require development work.

Live site: https://usp-store-coral.vercel.app
Shopify store: `n06dbw-hu.myshopify.com`

---

## What's built

A two-page storefront — product grid and product detail page — pulling its
catalog live from Shopify. Nothing about the products lives in the code: titles,
prices, photos, and stock all come from the Shopify admin, so adding or editing
merch never needs a developer.

- **Product grid** with photography, pricing, and add-to-cart
- **Product pages** with a thumbnail gallery, size and quantity selectors
- **Cart** that persists between visits
- **Checkout** handled by Shopify's own secure hosted checkout

Currently live: **25th Tee** and **25th Tote Bag**, $25 each.

---

## What's been verified

A complete test purchase was run on 24 July 2026 using Shopify's test payment
gateway — order **#R88JPXDG9**, $33.00 ($25 product + shipping + Tennessee tax).

Confirmed working: catalog loads from Shopify, cart builds correctly, checkout
hands off to Shopify, shipping rates calculate, tax calculates, the order lands
in the admin, and inventory decrements. The test order was cancelled and the
stock restored.

---

## What's needed before launch

### 1. Choose a payment provider  *(see options below)*
The store currently has no real payment method — only Shopify's test gateway.
**No customer can pay until this is set up.**

### 2. Choose a Shopify plan and remove the store password
The storefront currently shows "Opening soon" to the public. Removing that
password generally requires an active paid plan.

### 3. Rename the store
It's currently **"My Store"**, which customers see on the checkout page. Should
be "Union Stage Presents" (Settings → General).

### 4. Review the marketing consent checkbox
"Email me with news and offers" is **pre-ticked** at checkout. Pre-checked
marketing consent is discouraged and restricted in some jurisdictions. Worth a
look from whoever handles the mailing list.

---

## Payment setup options

Choose one primary method. They can be combined — many stores run Shopify
Payments alongside PayPal.

| Option | How it works | Best when |
|---|---|---|
| **Shopify Payments** *(recommended)* | Shopify's built-in processor. Cards, Apple Pay, Google Pay, Shop Pay. No extra Shopify transaction fee. | You want the simplest setup and the lowest total cost. |
| **PayPal** | Customers pay via PayPal balance or card. Payouts land in a separate PayPal account. | You want a familiar option alongside cards. Rarely the only method. |
| **Third-party gateway** (Stripe, Authorize.net, etc.) | Any external processor. Shopify adds its own transaction fee **on top of** the gateway's fees. | You already have a processor you're contractually tied to. |
| **Manual / offline** | Cash, bank transfer, or **pay-at-venue pickup**. No card processing. | Merch is collected at the venue and paid for in person. |

**Recommendation: Shopify Payments.** It's the cheapest path because it's the
only option with no additional Shopify transaction fee, and it enables Shop Pay,
Apple Pay, and Google Pay with no extra work — which measurably reduces
abandoned checkouts on mobile.

**Setup requires:** business legal name and address, EIN or SSN, and a bank
account for payouts. Allow time — verification isn't always instant.

**Worth considering given the venues:** a *manual* "pick up at the venue" method
can run alongside cards, letting fans skip shipping costs and collect merch at a
show. Sensible if shipping small orders isn't worth the overhead.

> Processing rates vary by plan, country, and card type, and change over time.
> Confirm current rates in the Shopify admin at signup rather than relying on
> any figure quoted elsewhere.

---

## Notes

**Inventory** is tracked in Shopify. Products automatically show SOLD OUT when
stock hits zero. A "LAST CALL" badge for low stock is built and ready but needs
one permission added to the store's API access — ask the developer to enable it
if wanted.

**Adding products.** Set the title, price, photos, and stock as normal. Two
conventions matter:
- Tag each product `venue:us` (or `th`, `ps`, `jj`, `mt`, `ct`, `np`) to set its
  venue accent colour.
- Set Product Type to `Tote`, `Poster`, or `Sticker` where relevant — it picks
  the right subtitle. Anything else falls back to a garment description.
- A `custom.subtitle` metafield overrides the subtitle if you want custom copy.

**Publishing.** New products must be published to the **Headless** sales channel
or the shop won't show them.

**Hosting.** The site deploys automatically from the `main` branch on GitHub to
Vercel. A custom domain can be pointed at it whenever you're ready.

/* Union Stage Presents — Gift Shop · SHOPIFY STOREFRONT API CONNECTOR
   ----------------------------------------------------------------------------
   Pulls the live catalog from Shopify and swaps it in for the mock data.js
   array. Designed for "ready now, products later":

     • No domain/token configured  → does nothing, site runs on data.js mock.
     • Configured but 0 products    → keeps the mock so the demo still shows.
     • Configured + products exist  → window.PRODUCTS becomes the live catalog.

   This file MUST load BEFORE data.js and app.js (see index.html).
   The Storefront API token is PUBLIC by design (read-only) — safe to ship in
   client JS. See SHOPIFY-SETUP.md for how to generate it + structure the catalog.
   ============================================================================ */
(function () {
  "use strict";

  /* ======== 1. CONFIG — fill these in once you have them (SHOPIFY-SETUP.md) === */
  const SHOPIFY = {
    domain: "",          // e.g. "union-stage-presents.myshopify.com"
    storefrontToken: "", // public Storefront API access token
    apiVersion: "2025-01",
    productLimit: 100,    // first N products to pull
  };
  window.SHOPIFY = SHOPIFY;

  const configured = !!(SHOPIFY.domain && SHOPIFY.storefrontToken);

  /* ======== 2. CATALOG MAPPING RULES =========================================
     How a Shopify product maps onto our shape ({venue, cat, kind, status...}).
     Set these up in Shopify and the storefront "just works". Details in the doc. */

  // productType (lowercased) -> our category chip. Falls back to "acc".
  const CAT_FROM_TYPE = {
    "t-shirt": "tee", "tshirt": "tee", "tee": "tee", "shirt": "tee",
    "hoodie": "hoodie", "sweatshirt": "hoodie", "crewneck": "hoodie",
    "hat": "hat", "cap": "hat", "beanie": "hat",
    "poster": "acc", "sticker": "acc", "tote": "acc", "accessory": "acc", "accessories": "acc",
  };
  // productType (lowercased) -> special display "kind" (drives the art treatment).
  const KIND_FROM_TYPE = { "poster": "poster", "sticker": "sticker" };

  const LASTCALL_THRESHOLD = 5; // qty at/below this (when inventory is exposed) = LAST CALL

  // tiny stable string -> positive int hash, so cart ids survive reorders
  function hashId(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h) || 1;
  }

  function tagValue(tags, prefix) {
    const t = tags.find((x) => x.toLowerCase().startsWith(prefix));
    return t ? t.slice(prefix.length).trim().toLowerCase() : null;
  }

  function mapProduct(node) {
    const tags = (node.tags || []).map(String);
    const variant = node.variants?.edges?.[0]?.node;
    const type = (node.productType || "").toLowerCase();

    // category: explicit `cat:xx` tag wins, else productType, else accessories
    const cat = tagValue(tags, "cat:") || CAT_FROM_TYPE[type] || "acc";
    // kind: explicit `kind:xx` tag wins, else derived from type
    const kind = tagValue(tags, "kind:") || KIND_FROM_TYPE[type] || undefined;
    // venue: `venue:xx` tag (matches data.js VENUES keys); defaults to Union Stage
    const venue = tagValue(tags, "venue:") || "us";

    // status: out of stock > low stock (last call) > in stock
    const available = variant ? variant.availableForSale : node.availableForSale;
    const qty = typeof variant?.quantityAvailable === "number" ? variant.quantityAvailable : null;
    let status = "in";
    if (!available) status = "soldout";
    else if (tags.some((t) => t.toLowerCase() === "lastcall")) status = "lastcall";
    else if (qty !== null && qty > 0 && qty <= LASTCALL_THRESHOLD) status = "lastcall";

    const variantId = variant?.id || null;
    return {
      id: hashId(variantId || node.id),
      variantId,                                   // Shopify gid — used at checkout
      name: node.title,
      venue,
      cat,
      kind,
      price: variant ? Number(variant.price.amount) : 0,
      status,
      photo: node.featuredImage?.url || undefined, // undefined -> photoOf() uses category art
    };
  }

  /* ======== 3. STOREFRONT API FETCH ========================================== */
  const QUERY = `
    query Catalog($n:Int!){
      products(first:$n){
        edges{ node{
          id title handle productType tags availableForSale
          featuredImage{ url }
          variants(first:1){ edges{ node{
            id availableForSale quantityAvailable
            price{ amount currencyCode }
          }}}
        }}
      }
    }`;

  async function storefront(query, variables) {
    const res = await fetch(
      `https://${SHOPIFY.domain}/api/${SHOPIFY.apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY.storefrontToken,
        },
        body: JSON.stringify({ query, variables }),
      }
    );
    if (!res.ok) throw new Error(`Storefront API ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data;
  }

  async function loadCatalog() {
    if (!configured) return false; // not set up yet — stay on mock
    try {
      const data = await storefront(QUERY, { n: SHOPIFY.productLimit });
      const nodes = (data.products?.edges || []).map((e) => e.node);
      if (!nodes.length) {
        console.info("[shopify] connected, 0 products — keeping demo catalog.");
        return false;
      }
      window.PRODUCTS = nodes.map(mapProduct);
      window.SHOPIFY_LIVE = true;
      console.info(`[shopify] loaded ${window.PRODUCTS.length} live products.`);
      return true;
    } catch (err) {
      console.warn("[shopify] catalog fetch failed — falling back to demo:", err.message);
      return false;
    }
  }

  /* ======== 4. CHECKOUT HAND-OFF (used once products are live) ================
     Creates a Shopify cart from our local lines and returns the hosted
     checkout URL. Wire the cart's "Cop It" button to this when ready:
        const url = await window.shopifyCheckout(cart);
        if (url) window.location.href = url;                                    */
  const CART_CREATE = `
    mutation Create($lines:[CartLineInput!]!){
      cartCreate(input:{lines:$lines}){
        cart{ checkoutUrl }
        userErrors{ message }
      }
    }`;

  window.shopifyCheckout = async function (lines) {
    if (!configured || !window.SHOPIFY_LIVE) return null; // not live -> use mock checkout
    const cartLines = lines
      .map((l) => {
        const p = window.byId(l.id);
        return p && p.variantId ? { merchandiseId: p.variantId, quantity: l.qty } : null;
      })
      .filter(Boolean);
    if (!cartLines.length) return null;
    const data = await storefront(CART_CREATE, { lines: cartLines });
    const errs = data.cartCreate?.userErrors;
    if (errs && errs.length) throw new Error(errs.map((e) => e.message).join("; "));
    return data.cartCreate?.cart?.checkoutUrl || null;
  };

  /* ======== 5. KICK OFF — pages await this before first paint ================ */
  window.ShopifyReady = loadCatalog();
})();

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
    domain: "n06dbw-hu.myshopify.com",
    storefrontToken: "09847a1424324a4c53ffc2f1f4b5b611", // public Storefront API access token
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

  /* Card subtitle. Priority: a `custom.subtitle` metafield, then the first line
     of the product description, then this table, then the cotton default in
     app.js. Quotes are HTML entities because the card is built with innerHTML. */
  const META_FROM_TYPE = {
    "tote":    "Heavyweight Canvas · 15&quot; × 16&quot;",
    "poster":  "Giclée Print · 18&quot; × 24&quot;",
    "sticker": "Die-Cut Vinyl · Weatherproof",
  };

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

  // A variant's size = its "Size" option value (falls back to the variant title
  // for a multi-variant product with no explicitly-named Size option).
  function sizeOf(vNode, multi) {
    const opt = (vNode.selectedOptions || []).find((o) => o.name.toLowerCase() === "size");
    if (opt) return opt.value;
    return multi && vNode.title && vNode.title !== "Default Title" ? vNode.title : null;
  }

  // Canonical apparel size order, so the picker always reads S → 3XL no matter
  // what order Shopify returns the variants in. Unknown sizes sort to the end.
  const SIZE_RANK = { xxs: 0, xs: 1, s: 2, m: 3, l: 4, xl: 5, "2xl": 6, xxl: 6, "3xl": 7, xxxl: 7, "4xl": 8, "5xl": 9 };
  const sizeRank = (s) => {
    const k = String(s).toLowerCase().replace(/[\s.]/g, "");
    return k in SIZE_RANK ? SIZE_RANK[k] : 99;
  };

  // Last-resort category guess from the title, used only when a product has no
  // productType and no `cat:` tag — keeps e.g. a bare "…Tee" out of Accessories.
  function catFromTitle(title) {
    const t = (title || "").toLowerCase();
    if (/\b(tee|t-shirt|tshirt|shirt)\b/.test(t)) return "tee";
    if (/\b(hoodie|sweatshirt|crewneck)\b/.test(t)) return "hoodie";
    if (/\b(hat|cap|beanie)\b/.test(t)) return "hat";
    return null;
  }

  function mapProduct(node) {
    const tags = (node.tags || []).map(String);
    const variant = node.variants?.edges?.[0]?.node;
    const type = (node.productType || "").toLowerCase();

    // category: explicit `cat:xx` tag wins, else productType, else title guess, else accessories
    const cat = tagValue(tags, "cat:") || CAT_FROM_TYPE[type] || catFromTitle(node.title) || "acc";
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

    // subtitle: metafield > first line of description > productType table
    const escape = (s) => s.replace(/"/g, "&quot;").replace(/</g, "&lt;");
    const firstLine = (node.description || "").split("\n")[0].trim();
    const meta =
      node.metafield?.value?.trim() ? escape(node.metafield.value.trim())
      : firstLine ? escape(firstLine)
      : META_FROM_TYPE[type] || undefined;

    // gallery: featured image first, then the rest, de-duped
    const all = (node.images?.edges || []).map((e) => e.node.url);
    const featured = node.featuredImage?.url;
    const photos = [...new Set(featured ? [featured, ...all] : all)];

    // Per-size variants → size picker + per-size checkout. Products with no Size
    // option (e.g. the tote) get no sizes and check out as their single variant.
    const variantNodes = (node.variants?.edges || []).map((e) => e.node);
    const multi = variantNodes.length > 1;
    const variants = variantNodes.map((vn) => ({
      size: sizeOf(vn, multi),
      variantId: vn.id,
      available: vn.availableForSale,
    }));
    const sizes = variants.map((v) => v.size).filter(Boolean)
      .sort((a, b) => sizeRank(a) - sizeRank(b));

    const variantId = variant?.id || null;
    return {
      id: hashId(variantId || node.id),
      variantId,                                   // first variant — used for sizeless items
      variants,                                    // [{size, variantId, available}] — checkout uses this
      sizes: sizes.length ? sizes : undefined,     // drives sizesOf() → the size picker
      name: node.title,
      venue,
      cat,
      kind,
      price: variant ? Number(variant.price.amount) : 0,
      status,
      photo: node.featuredImage?.url || undefined, // undefined -> photoOf() uses category art
      photos,                                      // drives the PDP thumbnail gallery
      meta,                                        // card subtitle; undefined -> cotton default
    };
  }

  // Resolve a cart line's size to the right Shopify variant gid for checkout.
  window.variantIdFor = function (p, size) {
    if (p && p.variants && p.variants.length) {
      const m = (size && p.variants.find((v) => v.size === size)) || p.variants[0];
      return m ? m.variantId : null;
    }
    return (p && p.variantId) || null;
  };

  /* ======== 3. STOREFRONT API FETCH ========================================== */
  /* `quantityAvailable` needs the `unauthenticated_read_product_inventory`
     scope. Tokens without it get the whole request rejected, not just that
     field — so build the query both ways and fall back if the scope is
     missing. Without inventory we lose the ≤5 LAST CALL threshold; the
     `lastcall` tag and SOLD OUT still work off `availableForSale`. */
  const buildQuery = (withInventory) => `
    query Catalog($n:Int!){
      products(first:$n){
        edges{ node{
          id title handle productType tags availableForSale
          description
          metafield(namespace:"custom", key:"subtitle"){ value }
          featuredImage{ url }
          images(first:10){ edges{ node{ url } } }
          variants(first:25){ edges{ node{
            id title availableForSale${withInventory ? " quantityAvailable" : ""}
            selectedOptions{ name value }
            price{ amount currencyCode }
          }}}
        }}
      }
    }`;

  const isInventoryScopeError = (msg) =>
    /quantityAvailable/i.test(msg) || /read_product_inventory/i.test(msg);

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
      let data;
      try {
        data = await storefront(buildQuery(true), { n: SHOPIFY.productLimit });
      } catch (err) {
        if (!isInventoryScopeError(err.message)) throw err;
        console.info(
          "[shopify] no inventory scope — retrying without quantityAvailable. " +
          "SOLD OUT still works; add `unauthenticated_read_product_inventory` " +
          "to the Storefront token to re-enable the LAST CALL threshold."
        );
        data = await storefront(buildQuery(false), { n: SHOPIFY.productLimit });
      }
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
        const vid = p ? window.variantIdFor(p, l.size) : null;
        return vid ? { merchandiseId: vid, quantity: l.qty } : null;
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

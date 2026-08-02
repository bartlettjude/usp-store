/* Union Stage Presents — Gift Shop · SHARED CATALOG + CART HELPERS
   Offline fallback catalog + cart helpers, used by app.js and product.js.
   Live Shopify data replaces window.PRODUCTS whenever the store is reachable.
   Declared as globals so the non-module page scripts can all read them. */

window.VENUES = {
  us: { name: "Union Stage",        color: "var(--us)" },
  th: { name: "The Howard",         color: "var(--th)" },
  ps: { name: "Pearl Street",       color: "var(--ps)" },
  jj: { name: "Jammin' Java",       color: "var(--jj)" },
  mt: { name: "Miracle Theatre",    color: "var(--mt)" },
  ct: { name: "Capital Turnaround", color: "var(--ct)" },
  np: { name: "Nationals Park",     color: "var(--np)" },
};

// category -> default product photo + label. A product may override with its own `photo`.
// Every category the Shopify connector can emit (see CAT_FROM_TYPE in shopify.js)
// must have an entry here. Filter chips are built from whichever of these the
// live catalog actually uses, so unused ones simply don't show up.
window.CATEGORIES = {
  tee:    { label: "T-Shirts",    photo: "assets/tshirt.svg" },
  hoodie: { label: "Hoodies",     photo: "assets/hoodie.svg" },
  hat:    { label: "Hats",        photo: "assets/hat.svg" },
  acc:    { label: "Accessories", photo: "assets/tote.svg" },
};

// status: "in" | "lastcall" | "soldout"
window.PRODUCTS = [
  { id: 20, name: "25th Tee", venue: "us", cat: "tee", price: 25, status: "in",
    sizes: ["S", "M", "L", "XL"],
    photo: "assets/tee-25th-front.jpg",
    photos: ["assets/tee-25th-front.jpg", "assets/tee-25th-angle.jpg", "assets/tee-25th-tag.jpg", "assets/tee-25th-worn.jpg"] },
  { id: 22, name: "25th Tote Bag", venue: "us", cat: "acc", price: 25, status: "in",
    photo: "assets/tote-25th-front.jpg", meta: "Heavyweight Canvas · 15&quot; × 16&quot;",
    photos: ["assets/tote-25th-front.jpg", "assets/tote-25th-detail.jpg", "assets/tote-25th-detail2.jpg", "assets/tote-25th-strap.jpg", "assets/tote-25th-worn.jpg"] },
];

window.STAMP   = { soldout: "assets/sold-out.svg", lastcall: "assets/sold-out.svg" };
window.byId    = (id) => window.PRODUCTS.find(p => p.id === id);
window.money   = (n) => `$${n.toFixed(2)}`;
// Falls back to Accessories art if a live product carries an unknown `cat:` tag,
// so a stray category can never blow up the grid render.
window.photoOf = (p) =>
  p.photo || (window.CATEGORIES[p.cat] || window.CATEGORIES.acc).photo;
// Sizes for a product, or null if it has none (e.g. the tote). Works for both
// the live Shopify catalog (variants → sizes) and this offline fallback.
window.sizesOf = (p) => (p && p.sizes && p.sizes.length) ? p.sizes : null;
// Is a given size in stock? Live products carry per-variant availability; the
// offline fallback has no variants, so its sizes are always treated as in-stock.
window.sizeAvailable = (p, size) => {
  if (p && p.variants && p.variants.length) {
    const v = p.variants.find(x => x.size === size);
    return v ? v.available !== false : true;
  }
  return true;
};

/* ---- cart storage (shared keys) ---- */
window.CART_KEY  = "usp-cart";       // [{id, size, qty}] — id+size is the line identity

window.loadCart = function () {
  try {
    const raw = JSON.parse(localStorage.getItem(window.CART_KEY) || "[]");
    return Array.isArray(raw)
      ? raw.filter(l => window.byId(l.id) && l.qty > 0)
            .map(l => ({ id: l.id, size: l.size || null, qty: l.qty | 0 }))
      : [];
  } catch { return []; }
};

/* Shipping and tax are Shopify's job now — they're calculated at the hosted
   checkout, not here. The old mock rates lived here until that went live. */

/* Union Stage Presents — Gift Shop · SHARED CATALOG + CART HELPERS
   Single source of truth used by app.js (shop), checkout.js, confirmation.js.
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
window.CATEGORIES = {
  tee:    { label: "T-Shirts",    photo: "assets/tshirt.svg" },
  hoodie: { label: "Hoodies",     photo: "assets/hoodie.svg" },
  hat:    { label: "Hats",        photo: "assets/hat.svg" },
  acc:    { label: "Accessories", photo: "assets/tote.svg" },
};

// status: "in" | "lastcall" | "soldout"
window.PRODUCTS = [
  { id: 20, name: "Natives 25th Anniversary Tee", venue: "us", cat: "tee", kind: "print", price: 35, status: "in",
    photo: "assets/tee-25th.jpg" },
  { id: 1,  name: "Classic Logo Tee",          venue: "us", cat: "tee",    price: 28, status: "in" },
  { id: 2,  name: "Marquee Tee",               venue: "th", cat: "tee",    price: 32, status: "in" },
  { id: 3,  name: "Warehouse Tee",             venue: "ps", cat: "tee",    price: 28, status: "lastcall" },
  { id: 4,  name: "Acoustic Sessions Tee",     venue: "jj", cat: "tee",    price: 26, status: "in" },
  { id: 5,  name: "Creative Expression Tee",   venue: "us", cat: "tee",    price: 26, status: "in" },
  { id: 6,  name: "Heritage Tee",              venue: "mt", cat: "tee",    price: 30, status: "in" },
  { id: 7,  name: "Heavyweight Hoodie",        venue: "us", cat: "hoodie", price: 58, status: "in" },
  { id: 8,  name: "Live From DC Hoodie",       venue: "th", cat: "hoodie", price: 62, status: "in" },
  { id: 9,  name: "Pullover Hoodie",           venue: "ps", cat: "hoodie", price: 58, status: "soldout" },
  { id: 10, name: "Full-Zip Hoodie",           venue: "jj", cat: "hoodie", price: 64, status: "soldout" },
  { id: 11, name: "Embroidered Dad Cap",       venue: "us", cat: "hat",    price: 30, status: "in" },
  { id: 12, name: "Soul Series Cap",           venue: "th", cat: "hat",    price: 32, status: "in" },
  { id: 13, name: "Trucker Cap",               venue: "ct", cat: "hat",    price: 30, status: "in" },
  { id: 14, name: "Cuffed Beanie",             venue: "ps", cat: "hat",    price: 26, status: "soldout" },
  { id: 16, name: "Enamel Pin Set",            venue: "jj", cat: "acc",    price: 14, status: "in" },
  { id: 17, name: "Sticker Pack",              venue: "th", cat: "acc",    price: 10, status: "in" },
  { id: 22, name: "Natives 25th Anniversary Tote", venue: "us", cat: "acc", kind: "print", price: 24, status: "in",
    photo: "assets/tote-25th.jpg", meta: "Heavyweight Canvas · 15&quot; × 16&quot;" },
  { id: 19, name: "Natives 25th Anniversary Poster", venue: "us", cat: "acc", kind: "poster", price: 35, status: "in",
    photo: "assets/posters/natives-poster.jpg" },
  { id: 21, name: "Natives 25th Anniversary Sticker", venue: "us", cat: "acc", kind: "sticker", price: 5, status: "in",
    photo: "assets/stickers/natives-sticker.png" },
];

window.STAMP   = { soldout: "assets/sold-out.svg", lastcall: "assets/sold-out.svg" };
window.byId    = (id) => window.PRODUCTS.find(p => p.id === id);
window.money   = (n) => `$${n.toFixed(2)}`;
window.photoOf = (p) => p.photo || window.CATEGORIES[p.cat].photo;

/* ---- cart storage (shared keys) ---- */
window.CART_KEY  = "usp-cart";       // [{id, qty}]
window.ORDER_KEY = "usp-last-order"; // last placed order (for confirmation page)

window.loadCart = function () {
  try {
    const raw = JSON.parse(localStorage.getItem(window.CART_KEY) || "[]");
    return Array.isArray(raw)
      ? raw.filter(l => window.byId(l.id) && l.qty > 0).map(l => ({ id: l.id, qty: l.qty | 0 }))
      : [];
  } catch { return []; }
};

/* ---- shared money math (mock rates) ---- */
window.SHIPPING = { standard: { label: "Standard (5–7 days)", price: 6 },
                    express:  { label: "Express (2–3 days)",  price: 14 } };
window.TAX_RATE = 0.06; // DC sales tax (mock)

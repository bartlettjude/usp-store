/* Union Stage Presents — Gift Shop
   Product data, venue + category filtering, and a working cart (line items,
   quantities, subtotal, localStorage). All item photos use plain category
   mocks (assets/*.svg) per spec. */

const VENUES = {
  us: { name: "Union Stage",        color: "var(--us)" },
  th: { name: "The Howard",         color: "var(--th)" },
  ps: { name: "Pearl Street",       color: "var(--ps)" },
  jj: { name: "Jammin' Java",       color: "var(--jj)" },
  mt: { name: "Miracle Theatre",    color: "var(--mt)" },
  ct: { name: "Capital Turnaround", color: "var(--ct)" },
  np: { name: "Nationals Park",     color: "var(--np)" },
};

// category -> default product photo + label. A product may override with its own `photo`.
const CATEGORIES = {
  tee:    { label: "T-Shirts",    photo: "assets/tshirt.svg" },
  hoodie: { label: "Hoodies",     photo: "assets/hoodie.svg" },
  hat:    { label: "Hats",        photo: "assets/hat.svg" },
  acc:    { label: "Accessories", photo: "assets/tote.svg" },
};

// status: "in" | "lastcall" | "soldout"
const PRODUCTS = [
  { id: 20, name: "Natives 25th Anniversary Tee", venue: "us", cat: "tee", price: 35, status: "in",
    photo: "assets/tee-25th.webp" },
  { id: 1,  name: "Classic Logo Tee",          venue: "us", cat: "tee",    price: 28, status: "in" },
  { id: 2,  name: "Marquee Tee",               venue: "th", cat: "tee",    price: 32, status: "in" },
  { id: 3,  name: "Warehouse Tee",             venue: "ps", cat: "tee",    price: 28, status: "lastcall" },
  { id: 4,  name: "Acoustic Sessions Tee",     venue: "jj", cat: "tee",    price: 26, status: "in" },
  { id: 5,  name: "Creative Expression Tee",   venue: "us", cat: "tee",    price: 26, status: "in" },
  { id: 6,  name: "Heritage Tee",              venue: "mt", cat: "tee",    price: 30, status: "in" },
  { id: 7,  name: "Heavyweight Hoodie",        venue: "us", cat: "hoodie", price: 58, status: "in" },
  { id: 8,  name: "Live From DC Hoodie",       venue: "th", cat: "hoodie", price: 62, status: "in" },
  { id: 9,  name: "Pullover Hoodie",           venue: "ps", cat: "hoodie", price: 58, status: "lastcall" },
  { id: 10, name: "Full-Zip Hoodie",           venue: "jj", cat: "hoodie", price: 64, status: "soldout" },
  { id: 11, name: "Embroidered Dad Cap",       venue: "us", cat: "hat",    price: 30, status: "in" },
  { id: 12, name: "Soul Series Cap",           venue: "th", cat: "hat",    price: 32, status: "in" },
  { id: 13, name: "Trucker Cap",               venue: "ct", cat: "hat",    price: 30, status: "in" },
  { id: 14, name: "Cuffed Beanie",             venue: "ps", cat: "hat",    price: 26, status: "soldout" },
  { id: 16, name: "Enamel Pin Set",            venue: "jj", cat: "acc",    price: 14, status: "in" },
  { id: 17, name: "Sticker Pack",              venue: "th", cat: "acc",    price: 10, status: "in" },
  { id: 22, name: "Natives 25th Anniversary Tote", venue: "us", cat: "acc", price: 24, status: "in",
    photo: "assets/tote-25th.webp", meta: "Heavyweight Canvas · 15&quot; × 16&quot;" },
  { id: 19, name: "Natives 25th Anniversary Poster", venue: "us", cat: "acc", kind: "poster", price: 35, status: "in",
    photo: "assets/posters/natives-poster.jpg" },
  { id: 21, name: "Natives 25th Anniversary Sticker", venue: "us", cat: "acc", kind: "sticker", price: 5, status: "in",
    photo: "assets/stickers/natives-sticker.png" },
];

const STAMP = { soldout: "assets/sold-out.svg", lastcall: "assets/last-call.svg" };
const byId = (id) => PRODUCTS.find(p => p.id === id);
const money = (n) => `$${n.toFixed(2)}`;

/* ============================================================
   STATE
   ============================================================ */
const grid        = document.getElementById("grid");
const resultCount = document.getElementById("resultCount");
let activeCat = "all";

// cart: array of { id, qty }, persisted to localStorage
const CART_KEY = "usp-cart";
let cart = loadCart();

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(raw)
      ? raw.filter(l => byId(l.id) && l.qty > 0).map(l => ({ id: l.id, qty: l.qty | 0 }))
      : [];
  } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}
const cartQty   = () => cart.reduce((n, l) => n + l.qty, 0);
const cartTotal = () => cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0);

/* ============================================================
   PRODUCT GRID
   ============================================================ */
function cardHTML(p) {
  const v = VENUES[p.venue];
  const stamp = STAMP[p.status]
    ? `<img class="card__stamp" src="${STAMP[p.status]}" alt="${p.status === "soldout" ? "Sold out" : "Last call"}" />`
    : "";
  const soldout = p.status === "soldout";
  const photo = p.photo || CATEGORIES[p.cat].photo;
  const META = {
    poster:  "Giclée Print · 18&quot; × 24&quot;",
    sticker: "Die-Cut Vinyl · Weatherproof",
  };
  const meta = p.meta || META[p.kind] || "100% Cotton · Unisex · S–3XL";
  const mediaMod = p.kind === "poster" ? "card__media--poster"
                 : p.kind === "sticker" ? "card__media--sticker" : "";
  return `
    <article class="card ${soldout ? "is-soldout" : ""}" style="--card-accent:${v.color}" data-venue="${p.venue}">
      <div class="card__media ${mediaMod}">
        <img src="${photo}" alt="${p.name}" />
        ${stamp}
      </div>
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <p class="card__meta">${meta}</p>
        <div class="card__foot">
          <span class="card__price">$${p.price}</span>
          <button class="btn-add" data-id="${p.id}">
            ${soldout ? "Sold Out" : "Add +"}
          </button>
        </div>
      </div>
    </article>`;
}

function render() {
  const list = PRODUCTS.filter(p => activeCat === "all" || p.cat === activeCat);
  grid.innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<p class="grid__empty">No items match these filters.</p>`;
  resultCount.textContent = `${list.length} item${list.length === 1 ? "" : "s"}`;
}

/* ---- Category filter chips ---- */
document.getElementById("filterBar").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll("#filterBar .chip").forEach(c => c.setAttribute("aria-pressed", "false"));
  chip.setAttribute("aria-pressed", "true");
  activeCat = chip.dataset.cat;
  render();
});

/* ============================================================
   CART
   ============================================================ */
const cartCount   = document.getElementById("cartCount");
const drawer      = document.getElementById("cartDrawer");
const overlay     = document.getElementById("overlay");
const cartItems   = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast       = document.getElementById("toast");
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

function addToCart(id) {
  const line = cart.find(l => l.id === id);
  if (line) line.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  syncCart();
  showToast("Added to cart ✓");
}

function setQty(id, delta) {
  const line = cart.find(l => l.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter(l => l.id !== id);
  saveCart();
  syncCart();
}

function removeLine(id) {
  cart = cart.filter(l => l.id !== id);
  saveCart();
  syncCart();
}

function lineHTML(line) {
  const p = byId(line.id);
  const v = VENUES[p.venue];
  return `
    <li class="line" data-id="${p.id}">
      <div class="line__thumb" style="--card-accent:${v.color}">
        <img src="${p.photo || CATEGORIES[p.cat].photo}" alt="" />
      </div>
      <div class="line__info">
        <p class="line__name">${p.name}</p>
        <p class="line__venue">${v.name} · ${money(p.price)}</p>
        <div class="line__qty">
          <button class="qty-btn" data-act="dec" aria-label="Decrease quantity">–</button>
          <span class="qty-val">${line.qty}</span>
          <button class="qty-btn" data-act="inc" aria-label="Increase quantity">+</button>
          <button class="line__remove" data-act="remove">Remove</button>
        </div>
      </div>
      <span class="line__total">${money(p.price * line.qty)}</span>
    </li>`;
}

function syncCart() {
  cartCount.textContent = cartQty();
  cartItems.innerHTML = cart.length
    ? cart.map(lineHTML).join("")
    : `<li class="cart__empty">Your cart is empty.<br><span>Add some gifts to get started.</span></li>`;
  cartTotalEl.textContent = money(cartTotal());
  checkoutBtn.disabled = cart.length === 0;
}

function openCart()  { drawer.classList.add("open"); overlay.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); }
function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); }

/* ---- Add-to-cart from grid ---- */
grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn || btn.closest(".is-soldout")) return;
  addToCart(Number(btn.dataset.id));
});

/* ---- Cart line controls (delegated) ---- */
cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const id = Number(btn.closest(".line").dataset.id);
  if (btn.dataset.act === "inc") setQty(id, 1);
  else if (btn.dataset.act === "dec") setQty(id, -1);
  else if (btn.dataset.act === "remove") removeLine(id);
});

/* ---- Open / close ---- */
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) return;
  showToast(`Checkout — ${cartQty()} item${cartQty() === 1 ? "" : "s"}, ${money(cartTotal())}`);
});

/* ============================================================
   INIT
   ============================================================ */
render();
syncCart();

/* Union Stage Presents — Gift Shop · SHOP PAGE
   Catalog + cart helpers live in data.js (shared). This handles the grid,
   filtering, and cart drawer. Edit products in data.js, not here. */

/* ============================================================
   STATE
   ============================================================ */
const grid        = document.getElementById("grid");
const resultCount = document.getElementById("resultCount");
let activeCat = "all";

// cart: array of { id, qty }, persisted to localStorage
let cart = loadCart();

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
                 : p.kind === "sticker" ? "card__media--sticker"
                 : p.kind === "print"   ? "card__media--print" : "";
  return `
    <article class="card ${soldout ? "is-soldout" : ""}" style="--card-accent:var(--base-light)" data-venue="${p.venue}">
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
  if (!grid) return;                 // product page has no grid — skip
  const list = PRODUCTS.filter(p => activeCat === "all" || p.cat === activeCat);
  grid.innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<p class="grid__empty">No items match these filters.</p>`;
  resultCount.textContent = `${list.length} item${list.length === 1 ? "" : "s"}`;
}

/* ---- Category filter chips ---- */
document.getElementById("filterBar")?.addEventListener("click", (e) => {
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
  showToast("in the bag ✓");
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
      <div class="line__thumb" style="--card-accent:var(--base-light)">
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
    : `<li class="cart__empty">nothing here yet 👀<br><span>go grab some merch, bestie.</span></li>`;
  cartTotalEl.textContent = money(cartTotal());
  checkoutBtn.disabled = cart.length === 0;
}

function openCart()  { drawer.classList.add("open"); overlay.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); }
function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); }

/* ---- Add-to-cart from grid ---- */
grid?.addEventListener("click", (e) => {
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
  window.location.href = "checkout.html";
});

/* ============================================================
   INIT
   ============================================================ */
render();
syncCart();

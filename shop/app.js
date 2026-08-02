/* Union Stage Presents — Gift Shop · SHOP PAGE
   Catalog + cart helpers live in data.js (shared). This handles the grid,
   filtering, and cart drawer. Edit products in data.js, not here. */

/* ============================================================
   STATE
   ============================================================ */
const grid = document.getElementById("grid");

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
  const photo = photoOf(p);
  const META = {
    poster:  "Giclée Print · 18&quot; × 24&quot;",
    sticker: "Die-Cut Vinyl · Weatherproof",
  };
  const meta = p.meta || META[p.kind] || "100% Cotton · Unisex · S–3XL";
  const mediaMod = p.kind === "poster" ? "card__media--poster"
                 : p.kind === "sticker" ? "card__media--sticker"
                 : p.kind === "print"   ? "card__media--print" : "";
  const sizes = sizesOf(p);
  // Inline size tray — hidden until "Add +" is tapped (see grid click handler).
  const sizeTray = (sizes && !soldout) ? `
        <div class="card__sizes" data-id="${p.id}">
          <span class="card__sizes-label">Pick a size</span>
          <div class="card__sizes-row">
            ${sizes.map(s => {
              const avail = sizeAvailable(p, s);
              return `<button class="size-chip${avail ? "" : " is-out"}" data-id="${p.id}" data-size="${s}"${avail ? "" : ' disabled aria-disabled="true"'}>${s}</button>`;
            }).join("")}
          </div>
        </div>` : "";
  return `
    <article class="card ${soldout ? "is-soldout" : ""}" style="--card-accent:var(--base-light)" data-id="${p.id}" data-venue="${p.venue}">
      <div class="card__media ${mediaMod}">
        <img src="${photo}" alt="${p.name}" />
        ${stamp}
      </div>
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <p class="card__meta">${meta}</p>
        <div class="card__foot">
          <span class="card__price">$${p.price}</span>
          <button class="btn-add" data-id="${p.id}"${sizes && !soldout ? ' aria-expanded="false"' : ''}>
            ${soldout ? "Sold Out" : "Add +"}
          </button>
        </div>${sizeTray}
      </div>
    </article>`;
}

function render() {
  if (!grid) return;                 // product page has no grid — skip
  grid.innerHTML = PRODUCTS.length
    ? PRODUCTS.map(cardHTML).join("")
    : `<p class="grid__empty">Nothing in the shop right now.</p>`;
}

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

function addToCart(id, size = null) {
  const line = cart.find(l => l.id === id && (l.size || null) === size);
  if (line) line.qty += 1;
  else cart.push({ id, size, qty: 1 });
  saveCart();
  syncCart();
  showToast(size ? `${size} in the bag ✓` : "in the bag ✓");
}

function setQty(id, size, delta) {
  const line = cart.find(l => l.id === id && (l.size || null) === size);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter(l => l !== line);
  saveCart();
  syncCart();
}

function removeLine(id, size) {
  cart = cart.filter(l => !(l.id === id && (l.size || null) === size));
  saveCart();
  syncCart();
}

function lineHTML(line) {
  const p = byId(line.id);
  const v = VENUES[p.venue];
  const sizeTag = line.size ? ` · Size ${line.size}` : "";
  return `
    <li class="line" data-id="${p.id}" data-size="${line.size || ""}">
      <div class="line__thumb" style="--card-accent:var(--base-light)">
        <img src="${photoOf(p)}" alt="" />
      </div>
      <div class="line__info">
        <p class="line__name">${p.name}</p>
        <p class="line__venue">${v.name}${sizeTag} · ${money(p.price)}</p>
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

/* ---- Add-to-cart from grid ----
   Sized products: "Add +" reveals an inline size tray on the card; tapping a
   size adds it and closes the tray — all without leaving the page. Sizeless
   products add straight to the cart on the first tap. ---- */
function closePickers(except) {
  grid?.querySelectorAll(".card.is-picking").forEach(c => {
    if (c === except) return;
    c.classList.remove("is-picking");
    c.querySelector(".btn-add")?.setAttribute("aria-expanded", "false");
  });
}

grid?.addEventListener("click", (e) => {
  // 1) A size chip inside an open tray → add that size, then close.
  const chip = e.target.closest(".size-chip");
  if (chip) {
    addToCart(Number(chip.dataset.id), chip.dataset.size);
    closePickers();
    return;
  }
  // 2) The Add button.
  const btn = e.target.closest(".btn-add");
  if (!btn || btn.closest(".is-soldout")) return;
  const id = Number(btn.dataset.id);
  const sizes = sizesOf(byId(id));
  if (sizes) {
    const card = btn.closest(".card");
    const open = card.classList.contains("is-picking");
    closePickers(open ? null : card);       // close others; toggle this one
    card.classList.toggle("is-picking", !open);
    btn.setAttribute("aria-expanded", String(!open));
    return;
  }
  addToCart(id, null);
});

// Tapping elsewhere on the page closes any open size tray.
document.addEventListener("click", (e) => {
  if (!e.target.closest(".card")) closePickers();
});

/* ---- Cart line controls (delegated) ---- */
cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const li = btn.closest(".line");
  const id = Number(li.dataset.id);
  const size = li.dataset.size || null;
  if (btn.dataset.act === "inc") setQty(id, size, 1);
  else if (btn.dataset.act === "dec") setQty(id, size, -1);
  else if (btn.dataset.act === "remove") removeLine(id, size);
});

/* ---- Open / close ---- */
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

checkoutBtn.addEventListener("click", async () => {
  if (!cart.length) return;
  // Shopify's hosted checkout is the only checkout — there's no mock flow to
  // fall back to, so surface a failure rather than silently going nowhere.
  if (!window.SHOPIFY_LIVE || typeof window.shopifyCheckout !== "function") {
    console.warn("[shopify] catalog isn't live — checkout unavailable.");
    showToast("Checkout unavailable — try again shortly");
    return;
  }
  const original = checkoutBtn.textContent;
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "Taking you to checkout…";
  try {
    const url = await window.shopifyCheckout(cart);
    if (url) { window.location.href = url; return; }
    throw new Error("no checkout URL returned");
  } catch (err) {
    console.warn("[shopify] checkout failed:", err.message);
    showToast("Checkout unavailable — try again shortly");
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = original;
  }
});

/* ============================================================
   INIT — wait for the live Shopify catalog (if configured) before the
   first paint, then re-filter the cart against whatever catalog is live.
   window.ShopifyReady is undefined when Shopify isn't set up → renders
   immediately on the data.js mock catalog.
   ============================================================ */
Promise.resolve(window.ShopifyReady).then(() => {
  cart = loadCart();
  render();
  syncCart();
});

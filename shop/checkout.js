/* Union Stage Presents — Gift Shop · CHECKOUT
   Renders the order summary from the cart, computes mock totals, and on
   "Place Order" saves a mock order + clears the cart, then → confirmation. */

const cart = loadCart();

// empty cart → bounce back to the shop
if (!cart.length) window.location.replace("index.html");

const coItems  = document.getElementById("coItems");
const coTotals = document.getElementById("coTotals");
const form     = document.getElementById("checkoutForm");

const subtotal = () => cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0);
const shipKey  = () => (form.elements.ship.value || "standard");
const shipCost = () => SHIPPING[shipKey()].price;
const taxCost  = () => subtotal() * TAX_RATE;
const grand    = () => subtotal() + shipCost() + taxCost();

function itemHTML(line) {
  const p = byId(line.id);
  const v = VENUES[p.venue];
  return `
    <li class="co__item">
      <div class="co__item-thumb"><img src="${photoOf(p)}" alt="" />
        <span class="co__item-qty">${line.qty}</span>
      </div>
      <div class="co__item-info">
        <p class="co__item-name">${p.name}</p>
        <p class="co__item-venue">${v.name}</p>
      </div>
      <span class="co__item-price">${money(p.price * line.qty)}</span>
    </li>`;
}

function renderTotals() {
  coTotals.innerHTML = `
    <div class="co__total-row"><span>Subtotal</span><span>${money(subtotal())}</span></div>
    <div class="co__total-row"><span>Shipping</span><span>${money(shipCost())}</span></div>
    <div class="co__total-row"><span>Tax (est.)</span><span>${money(taxCost())}</span></div>
    <div class="co__total-row co__total-row--grand"><span>Total</span><span>${money(grand())}</span></div>`;
}

coItems.innerHTML = cart.map(itemHTML).join("");
renderTotals();
form.querySelectorAll('[name="ship"]').forEach(r => r.addEventListener("change", renderTotals));

/* ---- place order ---- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // minimal validation
  const required = ["email", "first", "last", "address", "city", "state", "zip"];
  for (const name of required) {
    const el = form.elements[name];
    if (!el.value.trim()) { el.focus(); el.classList.add("co__field--err"); return; }
  }

  const d = new Date();
  const rand = Math.floor(1000 + Math.random() * 9000);
  const order = {
    number: `USP-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${rand}`,
    placedAt: d.toISOString(),
    email: form.elements.email.value.trim(),
    name: `${form.elements.first.value.trim()} ${form.elements.last.value.trim()}`,
    address: {
      line1: form.elements.address.value.trim(),
      line2: form.elements.address2.value.trim(),
      city: form.elements.city.value.trim(),
      state: form.elements.state.value.trim(),
      zip: form.elements.zip.value.trim(),
    },
    shipping: { key: shipKey(), label: SHIPPING[shipKey()].label, price: shipCost() },
    items: cart.map(l => {
      const p = byId(l.id);
      return { id: p.id, name: p.name, venue: VENUES[p.venue].name, qty: l.qty,
               price: p.price, photo: photoOf(p) };
    }),
    totals: { subtotal: subtotal(), shipping: shipCost(), tax: taxCost(), grand: grand() },
  };

  try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch {}
  try { localStorage.removeItem(CART_KEY); } catch {}   // clear cart after purchase
  window.location.href = "confirmation.html";
});

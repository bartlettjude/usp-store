/* Union Stage Presents — Gift Shop · ORDER CONFIRMATION
   Reads the last mock order from localStorage and renders the thank-you screen. */

const conf = document.getElementById("conf");

let order = null;
try { order = JSON.parse(localStorage.getItem(ORDER_KEY) || "null"); } catch {}

if (!order) {
  conf.innerHTML = `
    <div class="conf__empty">
      <h1 class="conf__title"><span class="hl hl--invert">NO ORDER YET</span></h1>
      <p class="short-copy">looks like you haven't placed an order. go grab some merch, bestie.</p>
      <a class="co__place conf__cta" href="index.html">Back to the shop</a>
    </div>`;
} else {
  const placed = new Date(order.placedAt);
  const eta = new Date(placed.getTime() + (order.shipping.key === "express" ? 3 : 7) * 864e5);
  const fmt = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const a = order.address;

  const itemsHTML = order.items.map(it => `
    <li class="co__item">
      <div class="co__item-thumb"><img src="${it.photo}" alt="" /><span class="co__item-qty">${it.qty}</span></div>
      <div class="co__item-info">
        <p class="co__item-name">${it.name}</p>
        <p class="co__item-venue">${it.venue}</p>
      </div>
      <span class="co__item-price">${money(it.price * it.qty)}</span>
    </li>`).join("");

  conf.innerHTML = `
    <div class="conf__head">
      <p class="conf__kicker mono-up">✓ Order Confirmed</p>
      <h1 class="conf__title"><span class="hl hl--accent">YOU'RE IN.</span></h1>
      <p class="conf__sub short-copy">
        nice taste. a confirmation is on its way to <strong>${order.email}</strong> —
        check your inbox (and spam, just in case). ya dig?
      </p>
    </div>

    <div class="conf__grid">
      <section class="conf__card">
        <h2 class="conf__card-title mono-up">Order ${order.number}</h2>
        <ul class="co__items">${itemsHTML}</ul>
        <div class="co__totals">
          <div class="co__total-row"><span>Subtotal</span><span>${money(order.totals.subtotal)}</span></div>
          <div class="co__total-row"><span>Shipping</span><span>${money(order.totals.shipping)}</span></div>
          <div class="co__total-row"><span>Tax</span><span>${money(order.totals.tax)}</span></div>
          <div class="co__total-row co__total-row--grand"><span>Total</span><span>${money(order.totals.grand)}</span></div>
        </div>
      </section>

      <section class="conf__card">
        <h2 class="conf__card-title mono-up">Shipping to</h2>
        <address class="conf__addr">
          ${order.name}<br>
          ${a.line1}${a.line2 ? "<br>" + a.line2 : ""}<br>
          ${a.city}, ${a.state} ${a.zip}
        </address>
        <h3 class="conf__addr-h mono-up">Method</h3>
        <p>${order.shipping.label}</p>
        <h3 class="conf__addr-h mono-up">Estimated delivery</h3>
        <p>${fmt(eta)}</p>
        <div class="conf__steps">
          <h3 class="conf__addr-h mono-up">What's next</h3>
          <ol class="conf__steps-list">
            <li>order confirmation email (now)</li>
            <li>we pack your fit (1–2 days)</li>
            <li>tracking link when it ships</li>
          </ol>
        </div>
      </section>
    </div>

    <div class="conf__foot">
      <a class="co__place conf__cta" href="index.html">Keep Shopping</a>
      <p class="conf__demo short-copy">demo order — nothing was charged or shipped.</p>
    </div>`;
}

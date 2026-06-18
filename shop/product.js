/* Product detail page (PDP).
   Reuses the catalog + cart globals defined in app.js (byId, VENUES,
   CATEGORIES, STAMP, money, addToCart, openCart, cardHTML). */
(function () {
  const root = document.getElementById("pdp");
  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = byId(id);

  /* ---- not found ---- */
  if (!p) {
    root.innerHTML = `
      <div class="pdp__missing">
        <h1>can't find that one 😵‍💫</h1>
        <p>this item straight up ghosted us. head back and grab something else.</p>
        <a class="pdp__add" href="index.html">← back to the shop</a>
      </div>`;
    return;
  }

  const v        = VENUES[p.venue];
  const photo    = p.photo || CATEGORIES[p.cat].photo;
  const META     = { poster: "Giclée Print · 18&quot; × 24&quot;", sticker: "Die-Cut Vinyl · Weatherproof" };
  const meta     = p.meta || META[p.kind] || "100% Cotton · Unisex · S–3XL";
  const soldout  = p.status === "soldout";
  const lastcall = p.status === "lastcall";

  const SIZES = {
    tee:    ["S", "M", "L", "XL", "2XL", "3XL"],
    hoodie: ["S", "M", "L", "XL", "2XL", "3XL"],
    hat:    ["One Size"],
  };
  const sizes = SIZES[p.cat] || null;

  const DESC = {
    tee:     "Soft, heavyweight cotton with a true-to-size unisex fit. Screen-printed loud, made to be worn 'til it's vintage.",
    hoodie:  "Cozy heavyweight fleece with a roomy hood and kangaroo pocket. Built for green-room chills and front-row sweat alike.",
    hat:     "Structured, adjustable, and ready for any pit. One size, all vibes.",
    poster:  "Museum-grade giclée print on heavy matte stock. Frame it, tape it, whatever — just don't sleep on it.",
    sticker: "Weatherproof die-cut vinyl. Slap it on your laptop, your case, your bumper. It's earned its spot.",
    acc:     "Everyday carry with USP all over it. Goes with the merch, the records, the whole lifestyle.",
  };
  const desc = DESC[p.kind] || DESC[p.cat] || "Official Union Stage Presents merch. Wear the rooms you love.";

  document.title = `${p.name} | Union Stage Presents`;

  const badge = soldout
    ? `<span class="pdp__badge pdp__badge--out">Sold Out</span>`
    : lastcall
      ? `<span class="pdp__badge pdp__badge--last">Last Call</span>`
      : `<span class="pdp__badge pdp__badge--in">In Stock</span>`;

  const stamp = STAMP[p.status]
    ? `<img class="pdp__stamp" src="${STAMP[p.status]}" alt="${soldout ? "Sold out" : "Last call"}" />`
    : "";

  const sizeBlock = sizes ? `
    <div class="pdp__field">
      <span class="pdp__label">Size</span>
      <div class="size-row" id="sizeRow">
        ${sizes.map((s, i) => `<button class="size-btn${i === 0 ? " is-active" : ""}" data-size="${s}">${s}</button>`).join("")}
      </div>
    </div>` : "";

  root.innerHTML = `
    <a class="pdp__back" href="index.html">← back to the shop</a>
    <div class="pdp__layout">
      <div class="pdp__media" style="--card-accent:var(--base-light)">
        <img src="${photo}" alt="${p.name}" />
        ${stamp}
      </div>
      <div class="pdp__info">
        <a class="pdp__venue" href="index.html"><span class="chip__dot" style="background:${v.color}"></span>${v.name}</a>
        <h1 class="pdp__title">${p.name}</h1>
        <div class="pdp__price-row">
          <span class="pdp__price">${money(p.price)}</span>
          ${badge}
        </div>
        <p class="pdp__meta">${meta}</p>
        <p class="pdp__desc">${desc}</p>
        ${sizeBlock}
        <div class="pdp__buy">
          <div class="pdp__qty">
            <button class="qty-btn" id="qtyDec" aria-label="Decrease quantity">–</button>
            <span class="qty-val" id="qtyVal">1</span>
            <button class="qty-btn" id="qtyInc" aria-label="Increase quantity">+</button>
          </div>
          <button class="pdp__add" id="pdpAdd" ${soldout ? "disabled" : ""}>
            ${soldout ? "Sold Out" : "Add to Bag"}
          </button>
        </div>
        <ul class="pdp__perks">
          <li>free local pickup at any USP venue</li>
          <li>ships in 3–5 biz days</li>
          <li>30-day no-stress returns</li>
        </ul>
      </div>
    </div>`;

  /* ---- quantity stepper ---- */
  let qty = 1;
  const qtyVal = document.getElementById("qtyVal");
  document.getElementById("qtyInc").addEventListener("click", () => { qty++; qtyVal.textContent = qty; });
  document.getElementById("qtyDec").addEventListener("click", () => { if (qty > 1) { qty--; qtyVal.textContent = qty; } });

  /* ---- size picker ---- */
  const sizeRow = document.getElementById("sizeRow");
  sizeRow?.addEventListener("click", (e) => {
    const b = e.target.closest(".size-btn");
    if (!b) return;
    sizeRow.querySelectorAll(".size-btn").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
  });

  /* ---- add to bag ---- */
  document.getElementById("pdpAdd").addEventListener("click", () => {
    if (soldout) return;
    for (let i = 0; i < qty; i++) addToCart(p.id);
    openCart();
  });

  /* ---- you might also like ---- */
  const related = PRODUCTS
    .filter(x => x.id !== p.id && (x.cat === p.cat || x.venue === p.venue))
    .slice(0, 4);
  const rail = document.getElementById("related");
  const railSection = document.getElementById("relatedSection");
  if (related.length) {
    rail.innerHTML = related.map(cardHTML).join("");
  } else {
    railSection.style.display = "none";
  }
})();

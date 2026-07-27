/* Click a product card to open its detail page.
   Works on the home grid and the "you might also like" rail. The home grid's
   Add button is left to app.js (we bail on it); everywhere else the whole card
   is a link into product.html?id=<id>. */
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  // Inside the main grid, let app.js own the Add button AND the inline size
  // tray (add-to-cart, no navigation) — only clicks elsewhere on the card open
  // the product page.
  if (card.closest("#grid") && (e.target.closest(".btn-add") || e.target.closest(".card__sizes"))) return;

  const id = card.dataset.id || card.querySelector(".btn-add")?.dataset.id;
  if (id) location.href = `product.html?id=${id}`;
});

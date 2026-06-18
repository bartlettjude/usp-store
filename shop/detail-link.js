/* Click a product card to open its detail page.
   Works on the home grid and the "you might also like" rail. The home grid's
   Add button is left to app.js (we bail on it); everywhere else the whole card
   is a link into product.html?id=<id>. */
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  // Let app.js handle the Add button inside the main grid (add-to-cart, no nav)
  const addBtn = e.target.closest(".btn-add");
  if (addBtn && card.closest("#grid")) return;

  const id = card.dataset.id || card.querySelector(".btn-add")?.dataset.id;
  if (id) location.href = `product.html?id=${id}`;
});

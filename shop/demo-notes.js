/* ============================================================
   DEMO ANNOTATIONS — injects red "DEMO NOTE" boxes per section.
   Self-contained: only annotates selectors that exist on the page,
   so the same file works across index / product / checkout / confirmation.
   Remove this file (+ its <link>/<script>) for production.
   ============================================================ */
(function () {
  const NOTES = [
    { sel: ".nav", place: "after", title: "Global Navigation",
      body: "Recreated from the live <b>unionstagepresents.com</b> header. Logo is the official USP wordmark (brand assets). The cart opens a slide-out drawer." },

    { sel: ".hero", place: "prepend", title: "Hero",
      body: "Display type = <b>LFT Etica Mono</b> (the brand book's display font). 'Knockout' outlined title. Palette = black / white + <b>Union Stage Yellow #e7d355</b> (brand book primary). Headline voice ('ya dig?') follows the brand book's playful tone. The pizza cursor is a real brand asset scraped from the live site." },

    { sel: ".anniv", place: "prepend", title: "25th Anniversary Collection band",
      body: "Built from the <b>brand bible</b> (USP 25th Final Files): the gritty '25 Years of Independent Music' wordmark + the campaign artwork. Yellow accent + the brand's highlight device." },

    { sel: ".filters", place: "prepend", title: "Category Filters",
      body: "B/W 'highlight-block' buttons = the brand book's signature <b>display-on-a-highlight</b> rule. Categories (Tees / Hoodies / Hats / Accessories) will map to <b>Shopify collections</b>." },

    { sel: ".shop", place: "prepend", title: "Product Grid — MOCK DATA",
      body: "Products are <b>placeholder data</b> in <b>data.js</b> until Shopify provides the real catalog. Card accent colors = brand book per-venue palette. <b>SOLD OUT / LAST CALL</b> stamps are the real brand stamps scraped from the live site. The 25th tee / tote / poster / sticker use real artwork from the brand bible." },

    { sel: ".news", place: "prepend", title: "Newsletter",
      body: "Highlight-block headline + brand-voice copy. Mock form for now — connects to the real mailing list (<b>Opendate</b>, per the live site) at launch." },

    { sel: ".footer", place: "prepend", title: "Footer",
      body: "Tagline 'creative expression by anyone, for everyone' + '5 venues. 1000s of shows. endless vibes.' from the brand book. Venue directory mirrors the live site." },

    { sel: ".cart", place: "prepend", title: "Cart — MOCK",
      body: "Client-side cart (saved in your browser). 'Cop It' → the checkout flow. At launch this hands off to <b>Shopify's secure checkout</b>." },

    { sel: ".co", place: "prepend", title: "Checkout — DEMO",
      body: "Mock checkout to show the full purchase flow. <b>No real payment</b> — production replaces this step with Shopify's hosted secure checkout. Shipping + tax are placeholder rates in data.js." },

    { sel: ".conf", place: "prepend", title: "Order Confirmation — DEMO",
      body: "Generated from the mock order saved in your browser. The real version = a Shopify order + an emailed receipt." },

    { sel: ".pdp", place: "prepend", title: "Product Detail — DEMO",
      body: "Built from the same mock catalog (data.js): size selector + related items. The real version pulls product data from <b>Shopify</b>." },
  ];

  function makeNote(n) {
    const el = document.createElement("div");
    el.className = "demo-note demo-note--block";
    el.innerHTML =
      `<span class="demo-note__label">Demo note</span><br>` +
      `<span class="demo-note__title">${n.title}.</span> ${n.body}`;
    return el;
  }

  NOTES.forEach((n) => {
    const target = document.querySelector(n.sel);
    if (!target) return;
    const note = makeNote(n);
    if (n.place === "after") target.parentNode.insertBefore(note, target.nextSibling);
    else target.insertBefore(note, target.firstChild);
  });

  // toggle
  const btn = document.createElement("button");
  btn.id = "demoToggle";
  const setLabel = () =>
    (btn.textContent = document.body.classList.contains("notes-off")
      ? "● Demo notes: OFF"
      : "● Demo notes: ON");
  btn.addEventListener("click", () => {
    document.body.classList.toggle("notes-off");
    setLabel();
  });
  document.body.appendChild(btn);
  setLabel();
})();

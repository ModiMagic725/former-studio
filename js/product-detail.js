/* Product detail page. Product comes from ?id= (stable ID). Every state has a recovery action. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data;
  if (document.body.dataset.page !== 'product') return;

  const EDITORIAL = { minimalist: 'camp5', 'street-uniform': 'street1', 'after-hours': 'camp7', 'soft-structure': 'camp4' };
  const COLL_NAMES = { 'outside-the-lines': 'Outside the Lines', essentials: 'Essentials', 'soft-structure': 'Soft Structure', 'after-hours': 'After Hours' };
  const AESTHETIC_NAMES = { minimalist: 'Minimalist', 'street-uniform': 'Street Uniform', 'after-hours': 'After Hours', 'soft-structure': 'Soft Structure' };

  /* ---------- Size guide modal (also reused from other pages) ---------- */
  F.openSizeGuide = function (p, trigger) {
    let m = document.getElementById('sgModal');
    if (!m) {
      m = document.createElement('div'); m.id = 'sgModal'; m.className = 'f-modal f-modal--wide'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'sgTitle'); m.setAttribute('aria-hidden', 'true');
      m.innerHTML = `<div class="f-modal__panel"><button type="button" class="icon-btn f-modal__close" data-close aria-label="Close size guide"><i data-lucide="x"></i></button><div class="f-modal__pad" id="sgBody"></div></div>`;
      document.body.appendChild(m);
    }
    const keys = (p && window.FORME_SIZE_MAP[p.category]) || ['tops'];
    const tbl = (k) => { const t = window.FORME_SIZES[k]; return `<h3 class="sg__h">${t.label}</h3><p class="soft" style="margin-bottom:10px;font-size:var(--fs-sm)">${F.esc(t.note)}</p><div class="tbl-wrap"><table class="tbl"><thead><tr>${t.cols.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; };
    document.getElementById('sgBody').innerHTML = `<h2 id="sgTitle">Size guide</h2>${p ? `<p style="margin-bottom:6px"><b>${F.esc(p.name)}</b>: ${F.esc(p.fit)}</p>${p.model ? `<p class="soft" style="font-size:var(--fs-sm)">${F.esc(p.model)}</p>` : ''}` : ''}
<p class="demo-note" style="margin:8px 0 18px">Illustrative sample sizing, not verified manufacturer measurements.</p>${keys.map(tbl).join('')}<p style="margin-top:20px"><a class="link-u" href="${F.url('pages/size-guide.html')}">Open the full size guide</a></p>`;
    F.icons(m); F.overlay.open(m, { returnTo: trigger, focus: '.f-modal__close' });
  };
  document.addEventListener('click', (e) => { const t = e.target.closest('[data-size-guide]'); if (t) { e.preventDefault(); F.openSizeGuide(F.byId(t.dataset.sizeGuide), t); } });

  /* ---------- Helpers ---------- */
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function addWorking(n) { const d = new Date(); let c = 0; while (c < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) c++; } return d; }
  const fmt = (d) => `${DAYS[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;

  const root = document.getElementById('pdpRoot');
  const params = new URLSearchParams(location.search);
  const p = F.byId(params.get('id') || '') || D.products.find((x) => x.slug === params.get('slug'));

  function missing() {
    document.title = 'Product not found — FORME / STUDIO 09';
    document.getElementById('crumbs').innerHTML = `<a href="${F.url('index.html')}">Home</a><span aria-hidden="true">/</span><a href="${F.url('pages/shop.html')}">Shop</a><span aria-hidden="true">/</span><span aria-current="page">Not found</span>`;
    root.innerHTML = `<section class="state wrap"><p class="mono soft">Error / product not found</p><h1 class="display">We can't find that piece</h1><p class="soft">The link may be old, or the product ID is incorrect. These are some pieces you might be looking for.</p>
<div class="empty__cta"><a class="fbtn fbtn--ink" href="${F.url('pages/shop.html')}">Shop all products</a><button type="button" class="fbtn fbtn--line" data-open-search>Search</button></div></section>
<section class="wrap section"><ul class="cgrid" data-cols="4" id="missRel"></ul></section>`;
    document.getElementById('missRel').innerHTML = D.products.filter((x) => x.labels.includes('bestseller')).slice(0, 4).map((x) => `<li class="cgrid__item">${F.productCard(x)}</li>`).join('');
    F.icons(root); F.watchImages(root);
  }
  if (!p) { document.addEventListener('DOMContentLoaded', missing); return; }

  document.addEventListener('DOMContentLoaded', () => {
    document.title = `${p.name} — FORME / STUDIO 09`;
    const sold = F.isSold(p), one = p.sizes.length === 1;
    const cat = D.categories[p.category];
    const edKey = EDITORIAL[p.aesthetic] || 'camp5', edImg = D.images.img(edKey, 1600);
    const gallery = [...p.images.map((src, i) => ({ src, alt: `${p.name}, view ${i + 1}`, cap: '', k: 'product' })), { src: edImg, alt: `${AESTHETIC_NAMES[p.aesthetic]} campaign photograph`, cap: `Campaign photograph from the ${AESTHETIC_NAMES[p.aesthetic]} story. Styling reference, not a product view.`, k: 'editorial' }];
    const state = { color: 0, size: one ? p.sizes[0] : null, qty: 1 };

    /* Crumbs */
    const ref = document.referrer && new URL(document.referrer, location.href).origin === location.origin ? document.referrer : '';
    const back = /(shop|collection|search)\.html/.test(ref) ? ref : F.url('pages/shop.html?cat=' + p.category);
    document.getElementById('crumbs').innerHTML = `<a href="${F.url('index.html')}">Home</a><span aria-hidden="true">/</span><a href="${F.url('pages/shop.html')}">Shop</a><span aria-hidden="true">/</span><a href="${F.url('pages/shop.html?cat=' + p.category)}">${cat}</a><span aria-hidden="true">/</span><span aria-current="page">${F.esc(p.name)}</span>`;

    const stockLine = () => {
      if (sold) return '<span class="stock stock--out">Sold out</span>';
      if (state.size && !one) { const max = F.cart.stockFor(p, state.size); return max <= 3 ? `<span class="stock stock--low">Only ${max} left in ${F.esc(state.size)}</span>` : '<span class="stock">In stock</span>'; }
      return p.stock <= 3 ? `<span class="stock stock--low">Low stock</span>` : '<span class="stock">In stock</span>';
    };
    const sizeBtns = () => p.sizes.map((s) => { const out = p.soldOutSizes.includes(s) || p.stock === 0; return `<button type="button" class="size-btn size-btn--lg" data-size="${F.esc(s)}" aria-pressed="${state.size === s}" ${out ? 'disabled' : ''}>${F.esc(s)}${out ? '<span class="vh"> (sold out)</span>' : ''}</button>`; }).join('');
    const hasRecycled = /recycled/i.test(p.material + ' ' + p.desc);
    const acc = [
      ['Description', `<p>${F.esc(p.desc)}</p>`], ['Fit and sizing', `<p>${F.esc(p.fit)}</p>${p.model ? `<p class="soft">${F.esc(p.model)}</p>` : ''}<p><a class="link-u" href="${F.url('pages/size-guide.html')}">Full size guide</a></p>`],
      ['Fabric and composition', `<p>${F.esc(p.material)}</p>`], ['Care', `<p>${F.esc(p.care)}</p>`],
      ['Shipping and returns', `<p>Sample policy: free shipping above ${F.money(D.shipping.freeThreshold)}, otherwise ${F.money(D.shipping.flat)}. Unworn items with tags can be returned within 7 days.</p><p class="demo-note">Demo content. Replace with real terms before launch. <a class="link-u" href="${F.url('pages/shipping-returns.html')}">Details</a></p>`]
    ];
    if (hasRecycled) acc.push(['Sustainability', `<p>This piece contains recycled fibre, listed in the composition above. We do not make any further sustainability claims for it.</p>`]);

    root.innerHTML = `
<div class="pdp__grid wrap">
  <div class="pdp__gallery" aria-label="Product images">
    <ol class="pdp__thumbs" aria-label="Image thumbnails">${gallery.map((g, i) => `<li><button type="button" class="thumb${i === 0 ? ' is-active' : ''}" data-thumb="${i}" aria-label="Show image ${i + 1} of ${gallery.length}"><span class="media">${F.img(g.src, '', { w: 120, h: 150 })}</span></button></li>`).join('')}</ol>
    <div class="pdp__tiles">${gallery.map((g, i) => `<figure class="tile-p tile-p--${g.k}${gallery.length === 2 && i === 1 ? ' tile-p--wide' : ''}${i === 0 ? ' tile-p--lead' : ''}" id="tile${i}"><button type="button" class="media tile-p__btn" data-lightbox="${i}" aria-label="Open image ${i + 1} full screen">${F.img(g.src, g.alt, { eager: i < 2, w: 1200, h: 1500, priority: i === 0 })}</button>${g.cap ? `<figcaption class="mono">${F.esc(g.cap)}</figcaption>` : ''}</figure>`).join('')}</div>
    <div class="swiper pdp__swiper" id="pdpSwiper" aria-label="Product images"><div class="swiper-wrapper">${gallery.map((g, i) => `<div class="swiper-slide"><button type="button" class="media" data-lightbox="${i}" aria-label="Open image ${i + 1} full screen" style="display:block;width:100%;aspect-ratio:4/5">${F.img(g.src, g.alt, { eager: i === 0, w: 900, h: 1125 })}</button></div>`).join('')}</div><div class="pdp__frac mono" id="pdpPag" aria-live="polite">01 / ${String(gallery.length).padStart(2, '0')}</div></div>
  </div>

  <aside class="pdp__panel" aria-label="Purchase options"><div class="pdp__panel-in">
    <p class="mono soft pdp__id"><span>${p.id}</span><span>${F.esc(COLL_NAMES[p.collection] || '')}</span></p>
    <h1 class="pdp__name display">${F.esc(p.name)}</h1>
    <div class="pdp__price">${F.priceHtml(p)}<span class="pdp__labels">${F.labelsFor(p)}</span></div>
    <p class="pdp__stock" id="pdpStock">${stockLine()}</p>

    <div class="pdp__opt"><div class="pdp__optl"><span>Colour: <b id="colorName">${F.esc(p.colors[0].name)}</b></span></div>${F.swatchesHtml(p, 0, 'data-color').replace('class="swatches"', 'class="swatches swatches--lg"')}</div>

    ${one ? '' : `<div class="pdp__opt" id="sizeBox"><div class="pdp__optl"><span>Size</span><button type="button" class="link-u" data-size-guide="${p.id}" style="font-weight:500;font-size:var(--fs-sm)">Size guide</button></div>
      <div class="size-row size-row--lg" role="group" aria-label="Size" id="sizeRow">${sizeBtns()}</div><p class="pdp__err" id="sizeErr" role="alert"></p></div>`}

    <div class="pdp__opt pdp__qtyrow"><div class="pdp__optl"><span>Quantity</span></div>
      <div class="qty" role="group" aria-label="Quantity"><button type="button" data-q="-1" aria-label="Decrease quantity">−</button><output id="qtyOut" aria-live="polite">1</output><button type="button" data-q="1" aria-label="Increase quantity">+</button></div><p class="pdp__err" id="qtyErr" role="alert"></p></div>

    <div class="pdp__cta"><button type="button" class="fbtn fbtn--ink fbtn--block" id="addBtn" ${sold ? 'disabled' : ''}><span class="addbtn__a">${sold ? 'Sold out' : 'Add to bag'}</span><span class="addbtn__b" aria-hidden="true"><i data-lucide="check"></i> Added</span></button>
      <button type="button" class="fbtn fbtn--line pdp__wish" data-wish="${p.id}" aria-pressed="${F.wishlist.has(p.id)}" aria-label="Add ${F.esc(p.name)} to wishlist"><i data-lucide="heart"></i></button></div>
    ${sold ? `<p class="soft" style="margin-top:10px">This piece is sold out. See similar pieces below.</p>` : ''}

    <div class="pdp__ship"><p class="mono">Estimated delivery <span class="soft">(demo)</span></p><p id="etaTxt"><b>${fmt(addWorking(3))} – ${fmt(addWorking(6))}</b></p>
      <form id="pinForm" novalidate class="pin"><label class="vh" for="pinIn">PIN code</label><input id="pinIn" inputmode="numeric" maxlength="6" placeholder="PIN code" autocomplete="postal-code"><button type="submit" class="link-u">Check</button></form><p class="pdp__err" id="pinMsg" role="status"></p>
      <p class="demo-note">Based on a local demo assumption of 3 to 6 working days. Not a live courier promise.</p></div>

    <div class="acc">${acc.map(([t, b], i) => `<div class="acc__item"><h2><button type="button" class="acc__btn" aria-expanded="${i === 0}" aria-controls="acc${i}" id="accb${i}">${t}<i aria-hidden="true"></i></button></h2><div class="acc__panel${i === 0 ? ' is-open' : ''}" id="acc${i}" role="region" aria-labelledby="accb${i}"><div><div class="acc__in">${b}</div></div></div></div>`).join('')}</div>
  </div></aside>
</div>

<section class="pdp__style" aria-labelledby="styleH"><div class="wrap pdp__style-grid">
  <div class="pdp__style-img media" data-clip><img src="${edImg}" alt="${AESTHETIC_NAMES[p.aesthetic]} campaign photograph" loading="lazy" width="1600" height="1100"></div>
  <div class="pdp__style-txt"><p class="mono soft">Styled in / ${F.esc(AESTHETIC_NAMES[p.aesthetic])}</p><h2 class="display" id="styleH">Worn the way<br>it was made</h2><p>${F.esc(p.name)} sits in our ${F.esc(AESTHETIC_NAMES[p.aesthetic])} edit. See the full story in the lookbook, or shop the rest of the edit.</p>
  <div class="empty__cta" style="justify-content:flex-start"><a class="fbtn fbtn--ink" href="${F.url('pages/collection.html?c=' + p.aesthetic)}">Shop ${F.esc(AESTHETIC_NAMES[p.aesthetic])}</a><a class="link-u" href="${F.url('pages/lookbook.html')}">Open the lookbook</a></div></div></div></section>

<section class="section wrap" id="lookSec" hidden aria-labelledby="lookH"><div class="sec-head"><h2 class="display" id="lookH">Complete<br>the look</h2><p>Pieces that sit well with this one.</p></div><div class="swiper" id="lookSw"><div class="swiper-wrapper" id="lookWr"></div></div></section>
<section class="section wrap" id="relSec" style="padding-top:0" hidden aria-labelledby="relH"><div class="sec-head"><h2 class="display" id="relH">You may<br>also like</h2></div><ul class="cgrid" data-cols="4" id="relGrid"></ul></section>
<section class="section wrap" id="rvSec" style="padding-top:0" hidden aria-labelledby="rvH"><div class="sec-head"><h2 class="display" id="rvH">Recently<br>viewed</h2></div><ul class="cgrid" data-cols="4" id="rvGrid"></ul></section>

<section class="pdp__craft"><div class="wrap"><p class="display pdp__craft-t">Made to be worn, mended and worn again.</p>
  <dl class="pdp__craft-dl"><div><dt class="mono">Fabric</dt><dd>${F.esc(p.material)}</dd></div><div><dt class="mono">Care</dt><dd>${F.esc(p.care)}</dd></div><div><dt class="mono">Fit</dt><dd>${F.esc(p.fit)}</dd></div></dl>
  <a class="link-u" href="${back}">← Back to ${/collection/.test(back) ? 'collection' : 'shop'}</a></div></section>

<div class="pdp__bar" id="pdpBar" aria-hidden="true"><div><b>${F.esc(p.name)}</b><span class="soft"> ${F.money(p.price)}</span></div><button type="button" class="fbtn fbtn--ink" id="barBtn" ${sold ? 'disabled' : ''} tabindex="-1">${sold ? 'Sold out' : 'Add to bag'}</button></div>`;

    F.icons(root); F.watchImages(root);

    /* ---------- Gallery ---------- */
    const thumbs = [...root.querySelectorAll('[data-thumb]')];
    const setActive = (i) => { thumbs.forEach((t, j) => t.classList.toggle('is-active', i === j)); };
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-thumb]'); if (t) { const el = document.getElementById('tile' + t.dataset.thumb); if (el) el.scrollIntoView({ behavior: F.reducedMotion() ? 'auto' : 'smooth', block: 'center' }); setActive(+t.dataset.thumb); }
    });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) setActive(+x.target.id.replace('tile', '')); }), { rootMargin: '-45% 0px -45% 0px' });
      root.querySelectorAll('.tile-p').forEach((n) => io.observe(n));
    }
    let sw = null;
    if (window.Swiper) sw = new Swiper('#pdpSwiper', { slidesPerView: 1, spaceBetween: 8, a11y: { enabled: true }, on: { slideChange(s) { document.getElementById('pdpPag').textContent = `${String(s.activeIndex + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`; } } });

    /* Lightbox */
    let lb = null, li = 0;
    function lightbox(i) {
      if (!lb) {
        lb = document.createElement('div'); lb.className = 'lb on-dark'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer'); lb.setAttribute('aria-hidden', 'true');
        lb.innerHTML = `<button type="button" class="icon-btn lb__x" data-close aria-label="Close image viewer"><i data-lucide="x"></i></button><button type="button" class="icon-btn lb__n lb__n--p" data-lb="-1" aria-label="Previous image"><i data-lucide="arrow-left"></i></button><button type="button" class="icon-btn lb__n lb__n--n" data-lb="1" aria-label="Next image"><i data-lucide="arrow-right"></i></button><figure class="lb__fig"><img alt=""><figcaption class="mono"></figcaption></figure><div class="lb__count mono" aria-live="polite"></div>`;
        document.body.appendChild(lb); F.icons(lb);
        lb.addEventListener('click', (e) => { const b = e.target.closest('[data-lb]'); if (b) go(+b.dataset.lb); else if (e.target === lb || e.target.classList.contains('lb__fig')) F.overlay.close(lb); });
        let x0 = null; lb.addEventListener('pointerdown', (e) => { x0 = e.clientX; }); lb.addEventListener('pointerup', (e) => { if (x0 != null && Math.abs(e.clientX - x0) > 50) go(e.clientX < x0 ? 1 : -1); x0 = null; });
        document.addEventListener('keydown', (e) => { if (!lb.classList.contains('is-open')) return; if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
      }
      li = i; show(); F.overlay.open(lb, { focus: '.lb__x' });
    }
    function show() { const g = gallery[li], im = lb.querySelector('img'); im.classList.remove('is-in'); im.src = g.src.replace(/w=\d+/, 'w=1800'); im.alt = g.alt; lb.querySelector('figcaption').textContent = g.cap; lb.querySelector('.lb__count').textContent = `${String(li + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`; requestAnimationFrame(() => im.classList.add('is-in')); }
    function go(d) { li = (li + d + gallery.length) % gallery.length; show(); }
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-lightbox]'); if (b) lightbox(+b.dataset.lightbox); });

    /* ---------- Options ---------- */
    const $ = (id) => document.getElementById(id);
    const updStock = () => { $('pdpStock').innerHTML = stockLine(); };
    root.addEventListener('click', (e) => {
      const c = e.target.closest('[data-color]');
      if (c && c.classList.contains('swatch')) { state.color = +c.dataset.color; root.querySelectorAll('[data-color].swatch').forEach((b) => b.setAttribute('aria-pressed', b === c)); $('colorName').textContent = p.colors[state.color].name; return; }
      const s = e.target.closest('[data-size]');
      if (s) { state.size = s.dataset.size; root.querySelectorAll('[data-size]').forEach((b) => b.setAttribute('aria-pressed', b === s)); $('sizeErr').textContent = ''; $('sizeBox').classList.remove('is-err'); clampQty(); updStock(); return; }
      const q = e.target.closest('[data-q]');
      if (q) { state.qty += +q.dataset.q; clampQty(true); return; }
    });
    function maxQty() { return state.size ? F.cart.stockFor(p, state.size) : Math.min(p.stock, D.maxPerLine); }
    function clampQty(warn) {
      const max = Math.max(1, maxQty()), err = $('qtyErr'); err.textContent = '';
      if (state.qty < 1) state.qty = 1;
      if (state.qty > max) state.qty = max;
      if (warn && state.qty >= max) err.textContent = `Maximum ${max} per order${state.size ? ' in ' + state.size : ''}.`;
      $('qtyOut').textContent = state.qty;
      root.querySelector('[data-q="-1"]').disabled = state.qty <= 1; root.querySelector('[data-q="1"]').disabled = state.qty >= max;
    }
    clampQty();

    function add() {
      if (sold) return;
      if (!state.size) { const box = $('sizeBox'); $('sizeErr').textContent = 'Please select a size.'; box.classList.remove('is-err'); void box.offsetWidth; box.classList.add('is-err'); box.scrollIntoView({ block: 'center', behavior: F.reducedMotion() ? 'auto' : 'smooth' }); const f = box.querySelector('.size-btn:not([disabled])'); if (f) f.focus({ preventScroll: true }); return; }
      const r = F.cart.add(p.id, state.color, state.size, state.qty);
      if (!r.ok) { $('qtyErr').textContent = r.error; F.toast(r.error, { type: 'error' }); return; }
      const b = $('addBtn'); b.classList.add('is-added'); setTimeout(() => b.classList.remove('is-added'), 1800);
      F.cart.openDrawer({ added: true });
    }
    $('addBtn').addEventListener('click', add);
    $('barBtn').addEventListener('click', add);
    F.on('wishlist', () => { const b = root.querySelector('.pdp__wish'); if (b) { const on = F.wishlist.has(p.id); b.setAttribute('aria-pressed', on); b.classList.toggle('is-on', on); } });

    /* Delivery check (demo) */
    $('pinForm').addEventListener('submit', (e) => {
      e.preventDefault(); const v = $('pinIn').value.trim(), msg = $('pinMsg'); msg.className = 'pdp__err';
      if (!/^[1-9][0-9]{5}$/.test(v)) { msg.textContent = 'Enter a valid 6-digit PIN code.'; $('pinIn').setAttribute('aria-invalid', 'true'); return; }
      $('pinIn').removeAttribute('aria-invalid'); msg.className = 'pdp__ok'; msg.textContent = `Demo estimate for ${v}: ${fmt(addWorking(3))} to ${fmt(addWorking(6))}.`;
    });

    /* Sticky mobile bar */
    const bar = $('pdpBar');
    const barState = () => { const top = $('addBtn').getBoundingClientRect(); const show = top.bottom < 0; if (show === bar.classList.contains('is-on')) return; bar.classList.toggle('is-on', show); bar.setAttribute('aria-hidden', !show); $('barBtn').tabIndex = show ? 0 : -1; };
    let barRaf = 0; window.addEventListener('scroll', () => { if (!barRaf) barRaf = requestAnimationFrame(() => { barRaf = 0; barState(); }); }, { passive: true }); window.addEventListener('resize', barState); barState();

    /* ---------- Recommendation sections ---------- */
    const rel = p.related.map(F.byId).filter(Boolean);
    const complete = rel.filter((x) => x.category !== p.category).slice(0, 4);
    if (complete.length) {
      $('lookSec').hidden = false; $('lookWr').innerHTML = complete.map((x) => `<div class="swiper-slide">${F.productCard(x)}</div>`).join('');
      if (window.Swiper) new Swiper('#lookSw', { slidesPerView: 1.6, spaceBetween: 12, a11y: { enabled: true }, breakpoints: { 576: { slidesPerView: 2.4 }, 992: { slidesPerView: 4, spaceBetween: 20 } } });
    }
    const relIds = new Set([p.id, ...complete.map((x) => x.id)]);
    const similar = [...rel, ...D.products.filter((x) => x.category === p.category || x.aesthetic === p.aesthetic)].filter((x) => !relIds.has(x.id)).filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i).slice(0, 4);
    if (similar.length) { $('relSec').hidden = false; $('relGrid').innerHTML = similar.map((x) => `<li class="cgrid__item">${F.productCard(x)}</li>`).join(''); }

    const seen = F.storage.get('recent-products', []); const prev = (Array.isArray(seen) ? seen : []).filter((id) => id !== p.id && F.byId(id)).slice(0, 4);
    if (prev.length) { $('rvSec').hidden = false; $('rvGrid').innerHTML = prev.map((id) => `<li class="cgrid__item">${F.productCard(F.byId(id))}</li>`).join(''); }
    F.storage.set('recent-products', [p.id, ...(Array.isArray(seen) ? seen.filter((id) => id !== p.id) : [])].slice(0, 8));
    F.icons(root); F.watchImages(root); F.emit('wishlist');
    if (window.FORME.anim && window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
})();

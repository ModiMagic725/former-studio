/* Product interactions shared across pages: swatches, quick add, quick view. */
(function () {
  'use strict';
  const F = window.FORME;

  function closePickers(except) { document.querySelectorAll('.pcard.is-picking').forEach((c) => { if (c !== except) c.classList.remove('is-picking'); }); }

  function afterAdd(res) {
    if (!res.ok) { F.toast(res.error, { type: 'error' }); return false; }
    F.toast(`${res.product.name} added to your bag`, { action: { label: 'View bag', fn: () => F.cart.openDrawer() } });
    return true;
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.pcard');
    const sw = e.target.closest('[data-swatch]');
    if (sw && card) {
      card.dataset.color = sw.dataset.swatch;
      card.querySelectorAll('[data-swatch]').forEach((b) => b.setAttribute('aria-pressed', b === sw ? 'true' : 'false'));
      return;
    }
    const qa = e.target.closest('[data-quickadd]');
    if (qa && card) {
      const p = F.byId(qa.dataset.quickadd);
      if (p.sizes.length === 1 && p.sizes[0] === 'One size') { afterAdd(F.cart.add(p.id, parseInt(card.dataset.color, 10) || 0, 'One size', 1)); return; }
      closePickers(card); card.classList.add('is-picking');
      const first = card.querySelector('.size-btn:not([disabled])'); if (first) setTimeout(() => first.focus({ preventScroll: true }), 50);
      return;
    }
    const sp = e.target.closest('[data-size-pick]');
    if (sp && card) { if (afterAdd(F.cart.add(card.dataset.id, parseInt(card.dataset.color, 10) || 0, sp.dataset.sizePick, 1))) card.classList.remove('is-picking'); return; }
    if (e.target.closest('[data-sizes-close]')) { closePickers(); return; }
    const qv = e.target.closest('[data-quickview]');
    if (qv) { openQuickView(qv.dataset.quickview, qv); return; }
    if (!e.target.closest('.pcard.is-picking')) closePickers();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePickers(); });

  /* Accordions (shared: PDP, care, shipping) */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.acc__btn'); if (!b) return;
    const open = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', open);
    const pnl = document.getElementById(b.getAttribute('aria-controls')); if (pnl) pnl.classList.toggle('is-open', open);
  });

  /* ---------- Quick view ---------- */
  let qs = null;
  function openQuickView(id, trigger) {
    const p = F.byId(id); if (!p) return;
    qs = { p, color: 0, size: p.sizes.length === 1 ? p.sizes[0] : null, img: 0 };
    renderQV();
    F.overlay.open(document.getElementById('qvModal'), { returnTo: trigger, focus: '.f-modal__close' });
  }
  F.openQuickView = openQuickView;

  function renderQV() {
    const { p } = qs, sold = F.isSold(p), body = document.getElementById('qvBody');
    const wished = F.wishlist.has(p.id);
    body.innerHTML = `<div class="qv">
  <div><div class="media qv__media">${F.img(p.images[qs.img], p.name, { eager: true, w: 800, h: 1000 })}</div></div>
  <div class="qv__info">
    <div><span class="mono soft">${p.id}</span></div>
    <h2>${F.esc(p.name)}</h2>
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${F.priceHtml(p)}${F.labelsFor(p)}</div>
    <p class="soft">${F.esc(p.desc)}</p>
    <div><div class="qv__label"><span>Colour: <b>${F.esc(p.colors[qs.color].name)}</b></span></div>${F.swatchesHtml(p, qs.color, 'data-qv-color')}</div>
    <div><div class="qv__label"><span>Size</span><a class="link-u" style="font-weight:500;font-size:var(--fs-xs)" href="${F.url('pages/size-guide.html')}">Size guide</a></div>
      <div class="size-row" role="group" aria-label="Size">${p.sizes.map((s) => `<button type="button" class="size-btn" data-qv-size="${F.esc(s)}" aria-pressed="${qs.size === s}" ${p.soldOutSizes.includes(s) ? 'disabled' : ''}>${F.esc(s)}</button>`).join('')}</div></div>
    <p class="qv__err" role="alert" id="qvErr"></p>
    <div style="display:flex;gap:10px"><button type="button" class="fbtn fbtn--ink" style="flex:1" data-qv-add ${sold ? 'disabled' : ''}>${sold ? 'Sold out' : 'Add to bag'}</button>
    <button type="button" class="fbtn fbtn--line" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist" style="min-width:52px;padding:0 14px"><i data-lucide="heart"></i></button></div>
    <a class="link-u" href="${F.productUrl(p)}">View full details</a>
  </div></div>`;
    F.icons(body); F.watchImages(body);
  }

  document.addEventListener('click', (e) => {
    if (!qs || !e.target.closest('#qvModal')) return;
    const c = e.target.closest('[data-qv-color]'); if (c) { qs.color = parseInt(c.dataset.qvColor, 10); renderQV(); return; }
    const s = e.target.closest('[data-qv-size]'); if (s) { qs.size = s.dataset.qvSize; renderQV(); return; }
    if (e.target.closest('[data-qv-add]')) {
      if (!qs.size) { document.getElementById('qvErr').textContent = 'Please select a size.'; return; }
      const r = F.cart.add(qs.p.id, qs.color, qs.size, 1);
      if (!r.ok) { document.getElementById('qvErr').textContent = r.error; return; }
      F.overlay.close(document.getElementById('qvModal')); F.cart.openDrawer();
    }
  });
  F.on('wishlist', () => { const m = document.getElementById('qvModal'); if (qs && m && m.classList.contains('is-open')) { const b = m.querySelector('.f-modal__close'); const act = document.activeElement; renderQV(); if (act && act.dataset && act.dataset.wish) m.querySelector('[data-wish]').focus(); else if (b) b.focus(); } });
})();

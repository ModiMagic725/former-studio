/* Wishlist page: variant selection before moving clothing to the bag. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data;
  if (document.body.dataset.page !== 'wishlist') return;
  const pick = {}; /* per-product selected color/size, preserved across re-renders */
  const root = () => document.getElementById('wlRoot');

  function card(p) {
    const s = pick[p.id] || (pick[p.id] = { color: 0, size: p.sizes.length === 1 ? p.sizes[0] : null });
    const sold = F.isSold(p), one = p.sizes.length === 1;
    return `<li class="wcard${sold ? ' is-sold' : ''}" data-id="${p.id}">
  <a class="media wcard__img" href="${F.productUrl(p)}">${F.img(p.images[0], p.name, { w: 800, h: 1000 })}${sold ? '<span class="tag tag--ink" style="position:absolute;left:10px;top:10px">Sold out</span>' : ''}</a>
  <div class="wcard__body"><p class="mono soft">${p.id}</p><h2 class="wcard__name"><a href="${F.productUrl(p)}">${F.esc(p.name)}</a></h2><p>${F.priceHtml(p)}</p>
    <div class="swatches" role="group" aria-label="Colour">${p.colors.map((c, i) => `<button type="button" class="swatch" data-wcolor="${i}" style="background:${c.hex}" aria-label="${F.esc(c.name)}" aria-pressed="${s.color === i}"></button>`).join('')}</div>
    ${sold ? '<p class="soft">Currently unavailable.</p>' : one ? '' : `<div class="size-row" role="group" aria-label="Size for ${F.esc(p.name)}">${p.sizes.map((z) => `<button type="button" class="size-btn" data-wsize="${F.esc(z)}" aria-pressed="${s.size === z}" ${p.soldOutSizes.includes(z) ? 'disabled' : ''}>${F.esc(z)}</button>`).join('')}</div><p class="pdp__err" data-err role="alert"></p>`}
    <div class="wcard__act"><button type="button" class="fbtn fbtn--ink" data-move ${sold ? 'disabled' : ''}>Move to bag</button><button type="button" class="link-u" data-rm>Remove</button></div></div></li>`;
  }
  function render() {
    const ids = F.wishlist.list(), el = root();
    document.getElementById('wlCount').textContent = ids.length;
    if (!ids.length) {
      el.innerHTML = `<section class="state"><p class="mono soft">Wishlist / empty</p><h2 class="display">Nothing saved<br>yet</h2><p class="soft">Tap the heart on anything you like and it will wait for you here.</p><div class="empty__cta"><a class="fbtn fbtn--ink" href="${F.url('pages/shop.html')}">Continue shopping</a><a class="fbtn fbtn--line" href="${F.url('pages/collection.html?c=bestsellers')}">See bestsellers</a></div></section>`; return;
    }
    el.innerHTML = `<ul class="wgrid">${ids.map(F.byId).filter(Boolean).map(card).join('')}</ul><p style="margin-top:40px"><a class="link-u" href="${F.url('pages/shop.html')}">Continue shopping</a></p>`;
    F.icons(el); F.watchImages(el);
  }
  document.addEventListener('DOMContentLoaded', () => {
    render();
    const el = root();
    F.on('wishlist', () => render());
    el.addEventListener('click', (e) => {
      const c = e.target.closest('.wcard'); if (!c) return; const p = F.byId(c.dataset.id), s = pick[p.id];
      const col = e.target.closest('[data-wcolor]'); if (col) { s.color = +col.dataset.wcolor; c.querySelectorAll('[data-wcolor]').forEach((b) => b.setAttribute('aria-pressed', b === col)); return; }
      const sz = e.target.closest('[data-wsize]'); if (sz) { s.size = sz.dataset.wsize; c.querySelectorAll('[data-wsize]').forEach((b) => b.setAttribute('aria-pressed', b === sz)); c.querySelector('[data-err]').textContent = ''; return; }
      if (e.target.closest('[data-rm]')) { F.wishlist.remove(p.id); F.toast(`Removed ${p.name} from your wishlist`); return; }
      if (e.target.closest('[data-move]')) {
        if (!s.size) { const er = c.querySelector('[data-err]'); er.textContent = 'Please select a size.'; const row = c.querySelector('.size-row'); row.classList.remove('is-shake'); void row.offsetWidth; row.classList.add('is-shake'); const f = row.querySelector('.size-btn:not([disabled])'); if (f) f.focus(); return; }
        const r = F.cart.add(p.id, s.color, s.size, 1);
        if (!r.ok) { F.toast(r.error, { type: 'error' }); return; }
        F.wishlist.remove(p.id); F.toast(`${p.name} moved to your bag`, { action: { label: 'View bag', fn: () => F.cart.openDrawer() } });
      }
    });
  });
})();

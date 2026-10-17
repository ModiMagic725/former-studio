/* Cart: state, validation, totals, promo codes, drawer rendering. Frontend demo only, no payment. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data;
  const KEY = 'cart-v1';
  const key = (id, color, size) => [id, color, size].join('|');

  const sanitize = (raw) => {
    const out = { items: [], saved: [], promo: null };
    if (!raw || typeof raw !== 'object') return out;
    const clean = (arr) => (Array.isArray(arr) ? arr : []).map((it) => {
      const p = it && F.byId(it.id);
      if (!p) return null;
      const color = Number.isInteger(it.color) && it.color >= 0 && it.color < p.colors.length ? it.color : 0;
      const size = p.sizes.includes(it.size) ? it.size : null;
      const qty = Math.max(1, Math.min(D.maxPerLine, parseInt(it.qty, 10) || 1));
      return size ? { key: key(p.id, color, size), id: p.id, color, size, qty } : null;
    }).filter(Boolean);
    out.items = clean(raw.items); out.saved = clean(raw.saved);
    out.promo = typeof raw.promo === 'string' && D.promos[raw.promo] ? raw.promo : null;
    return out;
  };
  let state = sanitize(F.storage.get(KEY, null));
  const lastQty = {};
  const save = () => { F.storage.set(KEY, state); F.emit('cart', Cart.totals()); };

  const stockFor = (p, size) => (p.stock === 0 || p.soldOutSizes.includes(size) ? 0 : Math.min(p.stock, D.maxPerLine));

  const Cart = {
    state: () => state,
    stockFor,
    count: () => state.items.reduce((n, i) => n + i.qty, 0),
    available(item) { const p = F.byId(item.id); return !!p && stockFor(p, item.size) > 0; },
    add(id, color, size, qty = 1) {
      const p = F.byId(id);
      if (!p) return { ok: false, error: 'This product is no longer available.' };
      if (!p.sizes.includes(size)) return { ok: false, error: 'Please select a size.' };
      const max = stockFor(p, size);
      if (max === 0) return { ok: false, error: 'That size is sold out.' };
      qty = parseInt(qty, 10); if (!(qty >= 1)) return { ok: false, error: 'Enter a valid quantity.' };
      const k = key(id, color, size);
      const line = state.items.find((i) => i.key === k);
      const next = (line ? line.qty : 0) + qty;
      if (next > max) return { ok: false, error: `Only ${max} available per order for this size.` };
      if (line) line.qty = next; else state.items.push({ key: k, id, color, size, qty });
      Cart.last = { key: k, at: Date.now() };
      save(); return { ok: true, product: p, key: k };
    },
    setQty(k, qty) {
      const line = state.items.find((i) => i.key === k); if (!line) return;
      const max = stockFor(F.byId(line.id), line.size);
      line.qty = Math.max(1, Math.min(max || 1, qty)); save();
    },
    remove(k) { state.items = state.items.filter((i) => i.key !== k); save(); },
    saveForLater(k) { const line = state.items.find((i) => i.key === k); if (!line) return; state.items = state.items.filter((i) => i.key !== k); if (!state.saved.some((s) => s.key === k)) state.saved.push(line); save(); },
    moveToBag(k) { const s = state.saved.find((i) => i.key === k); if (!s) return { ok: false }; const r = Cart.add(s.id, s.color, s.size, s.qty); if (r.ok) { state.saved = state.saved.filter((i) => i.key !== k); save(); } return r; },
    removeSaved(k) { state.saved = state.saved.filter((i) => i.key !== k); save(); },
    applyPromo(code) {
      const c = String(code || '').trim().toUpperCase();
      if (!c) return { ok: false, error: 'Enter a promo code.' };
      const promo = D.promos[c];
      if (!promo) return { ok: false, error: 'That code is not valid. Try FORME10, STUDIO500 or FREESHIP.' };
      const sub = Cart.totals(c).subtotal;
      if (promo.min && sub < promo.min) return { ok: false, error: `${c} needs a bag of at least ${F.money(promo.min)}.` };
      state.promo = c; save(); return { ok: true, promo };
    },
    removePromo() { state.promo = null; save(); },
    clear() { state.items = []; state.promo = null; save(); },
    totals(promoOverride) {
      const items = state.items.filter((i) => Cart.available(i));
      const subtotal = items.reduce((n, i) => n + F.byId(i.id).price * i.qty, 0);
      const code = promoOverride !== undefined ? promoOverride : state.promo;
      const promo = code && D.promos[code];
      let discount = 0, freeShip = false;
      if (promo && !(promo.min && subtotal < promo.min)) {
        if (promo.type === 'percent') discount = Math.round(subtotal * promo.value / 100);
        if (promo.type === 'flat') discount = Math.min(promo.value, subtotal);
        if (promo.type === 'shipping') freeShip = true;
      }
      const after = subtotal - discount;
      const shipping = !items.length || freeShip || after >= D.shipping.freeThreshold ? 0 : D.shipping.flat;
      const toFree = Math.max(0, D.shipping.freeThreshold - after);
      return { subtotal, discount, shipping, total: after + shipping, count: Cart.count(), toFree, promo: promo ? code : null, freeShip, progress: items.length ? Math.min(1, after / D.shipping.freeThreshold) : 0 };
    },
    lineHtml(i, o = {}) {
      const p = F.byId(i.id), c = p.colors[i.color], ok = Cart.available(i), max = stockFor(p, i.size);
      return `<li class="bag-line" data-key="${F.esc(i.key)}">
  <a class="media bag-line__img" href="${F.productUrl(p)}">${F.img(p.images[0], p.name, { w: 168, h: 210 })}</a>
  <div>
    <a class="bag-line__name" href="${F.productUrl(p)}">${F.esc(p.name)}</a>
    <div class="bag-line__meta">${F.esc(c.name)} · ${F.esc(i.size)}</div>
    ${ok ? `<div class="qty" role="group" aria-label="Quantity for ${F.esc(p.name)}"><button type="button" data-qty="-1" aria-label="Decrease quantity" ${i.qty <= 1 ? 'disabled' : ''}>−</button><output aria-live="polite">${i.qty}</output><button type="button" data-qty="1" aria-label="Increase quantity" ${i.qty >= max ? 'disabled' : ''}>+</button></div>` : '<span class="bag-line__flag">Unavailable: not counted in total</span>'}
    <div class="bag-line__actions"><button type="button" data-remove>Remove</button>${o.later === false ? '' : '<button type="button" data-later>Save for later</button>'}</div>
  </div>
  <div class="price">${ok ? F.money(p.price * i.qty) : '—'}</div>
</li>`;
    }
  };
  F.cart = Cart;

  /* ---------- Mini-bag drawer ---------- */
  const drawer = () => document.getElementById('bagDrawer');
  Cart.openDrawer = (o = {}) => { const d = drawer(); if (d) { if (!o.added) Cart.last = null; renderDrawer(); F.overlay.open(d, { focus: '.f-drawer__head [data-close]' }); } };
  function renderDrawer() {
    const d = drawer(); if (!d) return;
    const t = Cart.totals(), body = d.querySelector('.f-drawer__body'), foot = d.querySelector('.f-drawer__foot');
    d.querySelector('[data-bag-title]').textContent = `Your bag (${t.count})`;
    if (!state.items.length) {
      body.innerHTML = `<div class="bag-empty"><h3>Your bag is empty</h3><p>Nothing here yet. Start with the new season.</p><a class="fbtn fbtn--ink" href="${F.url('pages/collection.html?c=new-arrivals')}">Shop new arrivals</a></div>`;
      foot.hidden = true; return;
    }
    foot.hidden = false;
    const recent = Cart.last && Date.now() - Cart.last.at < 6000 ? Cart.last.key : null;
    body.innerHTML = (recent ? '<p class="bag-added" role="status"><i data-lucide="check"></i> Added to your bag</p>' : '') + `<ul>${state.items.map((i) => Cart.lineHtml(i)).join('')}</ul>`;
    if (recent) { const ln = body.querySelector(`.bag-line[data-key="${CSS.escape(recent)}"]`); if (ln) ln.classList.add('is-new'); }
    body.querySelectorAll('.bag-line').forEach((ln) => { const it = state.items.find((i) => i.key === ln.dataset.key); if (it) { if (lastQty[it.key] != null && lastQty[it.key] !== it.qty) ln.querySelector('output').classList.add('bump'); lastQty[it.key] = it.qty; } });
    F.icons(body); F.watchImages(body);
    const msg = t.toFree > 0 ? `You are ${F.money(t.toFree)} away from free shipping` : 'You have free shipping';
    foot.innerHTML = `<div><div class="totals" style="font-weight:500;font-size:var(--fs-sm)"><span>${msg}</span></div><div class="ship-bar${t.toFree === 0 ? ' is-full' : ''}" role="progressbar" aria-label="Progress to free shipping" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(t.progress * 100)}"><span style="width:${t.progress * 100}%"></span></div></div>
<div class="totals"><span>Subtotal</span><span>${F.money(t.subtotal)}</span></div>
<p class="demo-note" style="margin:0">Shipping, promo codes and totals are finalised in your bag. Demo store: no payment is taken.</p>
<a class="fbtn fbtn--ink fbtn--block" href="${F.url('pages/cart.html')}">View bag &amp; checkout</a>`;
  }
  document.addEventListener('click', (e) => {
    const line = e.target.closest('#bagDrawer .bag-line'); if (!line) return;
    const k = line.dataset.key, line_ = state.items.find((i) => i.key === k); if (!line_) return;
    const q = e.target.closest('[data-qty]');
    if (q) { Cart.setQty(k, line_.qty + parseInt(q.dataset.qty, 10)); return; }
    if (e.target.closest('[data-remove]')) { Cart.remove(k); F.toast('Removed from bag'); return; }
    if (e.target.closest('[data-later]')) { Cart.saveForLater(k); F.toast('Saved for later. Find it in your bag.'); }
  });
  F.on('cart', (e) => {
    document.querySelectorAll('[data-cart-count]').forEach((b) => { b.dataset.n = e.detail.count; b.textContent = e.detail.count; });
    if (drawer() && F.overlay.isOpen(drawer())) renderDrawer();
  });
  window.addEventListener('storage', (e) => { if (e.key === 'forme:' + KEY) { state = sanitize(F.storage.get(KEY, null)); F.emit('cart', Cart.totals()); } });
  window.addEventListener('DOMContentLoaded', () => F.emit('cart', Cart.totals()));
})();

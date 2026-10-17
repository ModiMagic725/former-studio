/* Shopping bag page: calm, functional. All figures derive from local state via FORME.cart.totals(). */
(function () {
  'use strict';
  const F = window.FORME, D = F.data, C = () => F.cart;
  if (document.body.dataset.page !== 'cart') return;
  let promoDraft = '', promoMsg = null;
  const root = () => document.getElementById('cartRoot');

  function related() {
    const inBag = new Set(C().state().items.map((i) => i.id));
    let ids = [...new Set(C().state().items.flatMap((i) => F.byId(i.id).related))].filter((id) => !inBag.has(id));
    if (!ids.length) ids = D.products.filter((p) => p.labels.includes('bestseller') && !inBag.has(p.id)).map((p) => p.id);
    return ids.map(F.byId).filter((p) => p && !F.isSold(p)).slice(0, 4);
  }

  function render() {
    const st = C().state(), t = C().totals(), items = st.items, bad = items.filter((i) => !C().available(i));
    const el = root();
    if (!items.length && !st.saved.length) {
      el.innerHTML = `<section class="state wrap"><p class="mono soft">Bag / empty</p><h1 class="display">Your bag<br>is empty</h1><p class="soft">Nothing here yet. Start with the new season, or pick up where you left off.</p>
<div class="empty__cta"><a class="fbtn fbtn--ink" href="${F.url('pages/collection.html?c=new-arrivals')}">Shop new arrivals</a><a class="fbtn fbtn--line" href="${F.url('pages/wishlist.html')}">View wishlist</a></div></section>
<section class="wrap section"><div class="sec-head"><h2 class="display">Start with<br>a bestseller</h2></div><ul class="cgrid" data-cols="4">${D.products.filter((p) => p.labels.includes('bestseller')).slice(0, 4).map((p) => `<li class="cgrid__item">${F.productCard(p)}</li>`).join('')}</ul></section>`;
      F.icons(el); F.watchImages(el); return;
    }
    const promoCode = st.promo, promo = promoCode && D.promos[promoCode];
    const promoInactive = promo && promo.min && t.subtotal < promo.min;
    const shipTxt = t.shipping === 0 ? (items.length ? 'Free' : '—') : F.money(t.shipping);
    el.innerHTML = `
<div class="wrap cart">
  <header class="cart__head"><h1 class="display">Your bag <span class="mono soft">(${t.count})</span></h1><a class="link-u" href="${F.url('pages/shop.html')}">Continue shopping</a></header>
  ${bad.length ? `<div class="notice notice--warn" role="alert"><b>${bad.length} item${bad.length > 1 ? 's are' : ' is'} no longer available.</b> ${bad.length > 1 ? 'They are' : 'It is'} not counted in your total. Remove ${bad.length > 1 ? 'them' : 'it'} or save for later.</div>` : ''}
  <div class="cart__grid">
    <div class="cart__lines">
      ${items.length ? `<ul class="cart__list">${items.map((i) => C().lineHtml(i)).join('')}</ul>` : '<p class="soft" style="padding:24px 0">Your bag is empty. Saved items are below.</p>'}
      ${st.saved.length ? `<div class="cart__saved"><h2 class="mono">Saved for later (${st.saved.length})</h2><ul>${st.saved.map((i) => { const p = F.byId(i.id), ok = C().available(i); return `<li class="bag-line" data-key="${F.esc(i.key)}" data-saved><a class="media bag-line__img" href="${F.productUrl(p)}">${F.img(p.images[0], p.name, { w: 168, h: 210 })}</a><div><a class="bag-line__name" href="${F.productUrl(p)}">${F.esc(p.name)}</a><div class="bag-line__meta">${F.esc(p.colors[i.color].name)} · ${F.esc(i.size)}${ok ? '' : ' · <b style="color:#B3261E">Unavailable</b>'}</div><div class="bag-line__actions"><button type="button" data-movebag ${ok ? '' : 'disabled'}>Move to bag</button><button type="button" data-rmsaved>Remove</button></div></div><div class="price">${F.money(p.price)}</div></li>`; }).join('')}</ul></div>` : ''}
    </div>
    <aside class="cart__sum" aria-label="Order summary"><div class="cart__sum-in">
      <h2 class="mono">Summary</h2>
      <div class="ship"><p>${t.toFree > 0 ? `<b>${F.money(t.toFree)}</b> away from free shipping` : '<b>You have free shipping</b>'}</p><div class="ship-bar${t.toFree === 0 && items.length ? ' is-full' : ''}" role="progressbar" aria-label="Progress to free shipping" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(t.progress * 100)}"><span style="width:${t.progress * 100}%"></span></div></div>
      <form class="promo" id="promoForm" novalidate><label for="promoIn" class="mono">Promo code</label>
        <div class="promo__row"><input id="promoIn" value="${F.esc(promoDraft)}" autocomplete="off" autocapitalize="characters" placeholder="Enter code" ${promoMsg && !promoMsg.ok ? 'aria-invalid="true"' : ''} aria-describedby="promoMsg"><button type="submit" class="fbtn fbtn--line">Apply</button></div>
        <p class="promo__msg ${promoMsg ? (promoMsg.ok ? 'is-ok' : 'is-err') : ''}" id="promoMsg" role="status">${promoMsg ? F.esc(promoMsg.text) : ''}</p>
        ${promoCode ? `<p class="promo__applied"><span class="tag tag--lime">${F.esc(promoCode)}</span> ${promoInactive ? `<span class="soft">Not applied: needs a bag of ${F.money(promo.min)}+</span>` : F.esc(promo.label)} <button type="button" data-promo-x class="link-u" style="font-size:var(--fs-xs)">Remove</button></p>` : `<p class="demo-note">Demo codes: ${Object.keys(D.promos).map((c) => `<button type="button" class="link-u" data-fill="${c}" style="font-weight:600">${c}</button>`).join(', ')}</p>`}
      </form>
      <dl class="sum">
        <div><dt>Subtotal</dt><dd>${F.money(t.subtotal)}</dd></div>
        ${t.discount ? `<div class="sum__d"><dt>Discount (${F.esc(t.promo)})</dt><dd>−${F.money(t.discount)}</dd></div>` : ''}
        <div><dt>Shipping <span class="soft">(estimate)</span></dt><dd>${shipTxt}</dd></div>
        <div class="sum__t"><dt>Total</dt><dd>${F.money(t.total)}</dd></div>
      </dl>
      <p class="demo-note">Shipping rules are a demo: free above ${F.money(D.shipping.freeThreshold)}, otherwise ${F.money(D.shipping.flat)}. No payment is taken on this site.</p>
      <a class="fbtn fbtn--ink fbtn--block" href="${F.url('pages/checkout.html')}" ${t.count === 0 ? 'aria-disabled="true" tabindex="-1"' : ''}>Proceed to checkout</a>
    </div></aside>
  </div>
</div>
${items.length ? `<section class="wrap section"><div class="sec-head"><h2 class="display">Goes well<br>with</h2></div><ul class="cgrid" data-cols="4">${related().map((p) => `<li class="cgrid__item">${F.productCard(p)}</li>`).join('')}</ul></section>` : ''}`;
    F.icons(el); F.watchImages(el);
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    F.on('cart', () => { const a = document.activeElement; const id = a && a.id; render(); if (id) { const n = document.getElementById(id); if (n) n.focus(); } });
    const el = root();
    el.addEventListener('click', (e) => {
      const line = e.target.closest('.bag-line'); const k = line && line.dataset.key;
      if (e.target.closest('[data-qty]') && k) { const it = C().state().items.find((i) => i.key === k); if (it) C().setQty(k, it.qty + parseInt(e.target.closest('[data-qty]').dataset.qty, 10)); return; }
      if (e.target.closest('[data-remove]') && k) { C().remove(k); F.toast('Removed from bag'); return; }
      if (e.target.closest('[data-later]') && k) { C().saveForLater(k); F.toast('Saved for later'); return; }
      if (e.target.closest('[data-movebag]') && k) { const r = C().moveToBag(k); F.toast(r.ok ? 'Moved to bag' : (r.error || 'Could not move this item'), r.ok ? {} : { type: 'error' }); return; }
      if (e.target.closest('[data-rmsaved]') && k) { C().removeSaved(k); return; }
      if (e.target.closest('[data-promo-x]')) { C().removePromo(); promoMsg = { ok: true, text: 'Promo code removed.' }; promoDraft = ''; render(); return; }
      const f = e.target.closest('[data-fill]'); if (f) { promoDraft = f.dataset.fill; const i = document.getElementById('promoIn'); i.value = promoDraft; i.focus(); }
    });
    el.addEventListener('input', (e) => { if (e.target.id === 'promoIn') promoDraft = e.target.value; });
    el.addEventListener('submit', (e) => {
      if (e.target.id !== 'promoForm') return; e.preventDefault();
      const r = C().applyPromo(promoDraft);
      promoMsg = r.ok ? { ok: true, text: `Applied: ${r.promo.label}.` } : { ok: false, text: r.error }; if (r.ok) promoDraft = '';
      render(); const m = document.getElementById('promoIn'); if (m && !r.ok) m.focus();
    });
    document.addEventListener('click', (e) => { const a = e.target.closest('a[aria-disabled="true"]'); if (a) e.preventDefault(); });
  });
})();

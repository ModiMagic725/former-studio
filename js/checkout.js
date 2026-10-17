/* Checkout DEMO. Nothing is sent, charged or booked. No card details are ever collected. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data;
  if (document.body.dataset.page !== 'checkout') return;
  const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
  const EXPRESS = 399;
  const data = { email: '', phone: '', first: '', last: '', addr1: '', addr2: '', city: '', state: '', pin: '', method: 'standard', pay: 'upi' };
  let step = 1, confirmed = null;
  const root = () => document.getElementById('coRoot');

  const V = {
    email: (v) => (!v ? 'Enter your email address.' : !F.validEmail(v) ? 'Enter a valid email, like name@example.com.' : ''),
    phone: (v) => (!v ? 'Enter a mobile number.' : !/^[6-9][0-9]{9}$/.test(v.replace(/[\s-]/g, '')) ? 'Enter a 10-digit Indian mobile number.' : ''),
    first: (v) => (v.trim() ? '' : 'Enter your first name.'), last: (v) => (v.trim() ? '' : 'Enter your last name.'),
    addr1: (v) => (v.trim().length < 5 ? 'Enter your street address.' : ''), city: (v) => (v.trim() ? '' : 'Enter your city.'),
    state: (v) => (v ? '' : 'Select your state.'), pin: (v) => (/^[1-9][0-9]{5}$/.test(v.trim()) ? '' : 'Enter a valid 6-digit PIN code.')
  };
  const FIELDS1 = ['email', 'phone', 'first', 'last', 'addr1', 'city', 'state', 'pin'];

  function totals() {
    const t = F.cart.totals(); const ship = data.method === 'express' ? EXPRESS : t.shipping;
    return Object.assign({}, t, { ship, grand: t.subtotal - t.discount + ship });
  }
  const field = (id, label, o = {}) => `<div class="field${o.cls ? ' ' + o.cls : ''}"><label for="f-${id}">${label}${o.opt ? ' <span class="soft">(optional)</span>' : ''}</label>${o.select ? `<select id="f-${id}" name="${id}" aria-describedby="e-${id}"><option value="">Select</option>${STATES.map((s) => `<option${data[id] === s ? ' selected' : ''}>${s}</option>`).join('')}</select>` : `<input id="f-${id}" name="${id}" value="${F.esc(data[id])}" ${o.type ? `type="${o.type}"` : ''} ${o.mode ? `inputmode="${o.mode}"` : ''} ${o.ac ? `autocomplete="${o.ac}"` : ''} ${o.max ? `maxlength="${o.max}"` : ''} aria-describedby="e-${id}">`}<p class="err" id="e-${id}"></p></div>`;

  function summary() {
    const t = totals(), items = F.cart.state().items.filter((i) => F.cart.available(i));
    return `<aside class="co__sum" aria-label="Order summary"><div class="cart__sum-in"><h2 class="mono">Order summary</h2>
<ul class="co__items">${items.map((i) => { const p = F.byId(i.id); return `<li><span class="media co__thumb">${F.img(p.images[0], p.name, { w: 120, h: 150 })}</span><span><b>${F.esc(p.name)}</b><br><span class="soft" style="font-size:var(--fs-sm)">${F.esc(p.colors[i.color].name)} · ${F.esc(i.size)} · Qty ${i.qty}</span></span><span class="price">${F.money(p.price * i.qty)}</span></li>`; }).join('')}</ul>
<dl class="sum"><div><dt>Subtotal</dt><dd>${F.money(t.subtotal)}</dd></div>${t.discount ? `<div class="sum__d"><dt>Discount (${F.esc(t.promo)})</dt><dd>−${F.money(t.discount)}</dd></div>` : ''}<div><dt>Shipping</dt><dd>${t.ship === 0 ? 'Free' : F.money(t.ship)}</dd></div><div class="sum__t"><dt>Total</dt><dd>${F.money(t.grand)}</dd></div></dl></div></aside>`;
  }
  const banner = '<div class="notice notice--demo" role="note"><b>Frontend demonstration.</b> No real order, payment or delivery booking takes place on this site.</div>';
  const stepper = () => `<ol class="co__steps" aria-label="Checkout progress">${['Details', 'Delivery & payment', 'Review'].map((s, i) => `<li ${step === i + 1 ? 'aria-current="step"' : ''} class="${step > i + 1 ? 'is-done' : ''}"><span class="mono">0${i + 1}</span> ${s}</li>`).join('')}</ol>`;

  function render() {
    const el = root(), items = F.cart.state().items;
    if (confirmed) return confirmation(el);
    if (!items.length) { el.innerHTML = `<section class="state wrap"><p class="mono soft">Checkout / empty</p><h1 class="display">Nothing to<br>check out</h1><p class="soft">Your bag is empty. Add something first.</p><div class="empty__cta"><a class="fbtn fbtn--ink" href="${F.url('pages/shop.html')}">Shop all products</a></div></section>`; return; }
    const bad = items.filter((i) => !F.cart.available(i));
    if (bad.length) { el.innerHTML = `<section class="state wrap"><p class="mono soft">Checkout / unavailable</p><h1 class="display">Check<br>your bag</h1><p class="soft">${bad.length} item${bad.length > 1 ? 's in your bag are' : ' in your bag is'} no longer available. Remove ${bad.length > 1 ? 'them' : 'it'} to continue.</p><div class="empty__cta"><a class="fbtn fbtn--ink" href="${F.url('pages/cart.html')}">Back to bag</a></div></section>`; return; }
    let body = '';
    if (step === 1) body = `<form id="coForm" novalidate><h2 class="co__h">Contact</h2><div class="co__row">${field('email', 'Email', { type: 'email', mode: 'email', ac: 'email' })}${field('phone', 'Mobile number', { type: 'tel', mode: 'tel', ac: 'tel-national', max: 12 })}</div>
<h2 class="co__h">Delivery address</h2><div class="co__row">${field('first', 'First name', { ac: 'given-name' })}${field('last', 'Last name', { ac: 'family-name' })}</div>${field('addr1', 'Address', { ac: 'address-line1' })}${field('addr2', 'Apartment, floor, landmark', { opt: true, ac: 'address-line2' })}
<div class="co__row co__row--3">${field('city', 'City', { ac: 'address-level2' })}${field('state', 'State', { select: true })}${field('pin', 'PIN code', { mode: 'numeric', max: 6, ac: 'postal-code' })}</div>
<div class="co__nav"><a class="link-u" href="${F.url('pages/cart.html')}">← Back to bag</a><button type="submit" class="fbtn fbtn--ink">Continue to delivery</button></div></form>`;
    if (step === 2) { const t = F.cart.totals(); body = `<form id="coForm" novalidate><h2 class="co__h">Delivery method</h2><fieldset class="opts"><legend class="vh">Delivery method</legend>
<label class="opt"><input type="radio" name="method" value="standard" ${data.method === 'standard' ? 'checked' : ''}><span><b>Standard</b><br><span class="soft">3–6 working days (demo assumption)</span></span><span class="price">${t.shipping === 0 ? 'Free' : F.money(t.shipping)}</span></label>
<label class="opt"><input type="radio" name="method" value="express" ${data.method === 'express' ? 'checked' : ''}><span><b>Express</b><br><span class="soft">1–2 working days (demo assumption)</span></span><span class="price">${F.money(EXPRESS)}</span></label></fieldset>
<h2 class="co__h">Payment method <span class="mono soft">demo only</span></h2><fieldset class="opts"><legend class="vh">Payment method</legend>
${[['upi', 'UPI'], ['card', 'Debit or credit card'], ['cod', 'Cash on delivery']].map(([v, l]) => `<label class="opt"><input type="radio" name="pay" value="${v}" ${data.pay === v ? 'checked' : ''}><span><b>${l}</b></span></label>`).join('')}</fieldset>
<p class="notice notice--demo" style="margin-top:12px">This is a selection only. <b>No card, UPI or bank details are collected</b> and no payment is processed.</p>
<div class="co__nav"><button type="button" class="link-u" data-back>← Back to details</button><button type="submit" class="fbtn fbtn--ink">Review order</button></div></form>`; }
    if (step === 3) { const t = totals(); body = `<div id="coForm"><h2 class="co__h">Review</h2><dl class="rev"><div><dt class="mono">Contact</dt><dd><span>${F.esc(data.email)}<br>${F.esc(data.phone)}</span><button type="button" class="link-u" data-edit="1">Edit</button></dd></div>
<div><dt class="mono">Deliver to</dt><dd><span>${F.esc(data.first + ' ' + data.last)}<br>${F.esc(data.addr1)}${data.addr2 ? ', ' + F.esc(data.addr2) : ''}<br>${F.esc(data.city)}, ${F.esc(data.state)} ${F.esc(data.pin)}</span><button type="button" class="link-u" data-edit="1">Edit</button></dd></div>
<div><dt class="mono">Delivery</dt><dd><span>${data.method === 'express' ? 'Express' : 'Standard'}: ${t.ship === 0 ? 'Free' : F.money(t.ship)}</span><button type="button" class="link-u" data-edit="2">Edit</button></dd></div>
<div><dt class="mono">Payment</dt><dd><span>${{ upi: 'UPI', card: 'Debit or credit card', cod: 'Cash on delivery' }[data.pay]} (demo selection)</span><button type="button" class="link-u" data-edit="2">Edit</button></dd></div></dl>
<label class="fcheck co__ack"><input type="checkbox" id="ack"><span class="fcheck__box" aria-hidden="true"></span><span class="fcheck__label">I understand this is a demonstration and no real order will be placed.</span></label><p class="err" id="ackErr" role="alert"></p>
<div class="co__nav"><button type="button" class="link-u" data-back>← Back to delivery</button><button type="button" class="fbtn fbtn--ink" id="confirmBtn">Create demo order</button></div></div>`; }
    el.innerHTML = `<div class="wrap co"><header class="co__head"><h1 class="display">Checkout</h1>${stepper()}</header>${banner}<div class="co__grid"><div class="co__main">${body}</div>${summary()}</div></div>`;
    F.icons(el); F.watchImages(el);
  }

  function confirmation(el) {
    const c = confirmed;
    el.innerHTML = `<section class="wrap conf"><p class="mono conf__ref">Demo order reference <b>${c.ref}</b></p><h1 class="display">Demo order<br>created</h1>
<div class="notice notice--demo" role="status"><b>This was a demonstration.</b> No order was placed, no payment was taken and nothing will be delivered. The reference above was generated in your browser only.</div>
<div class="conf__grid"><div><h2 class="mono">What you "ordered"</h2><ul class="co__items">${c.items.map((i) => `<li><span class="media co__thumb">${F.img(i.img, i.name, { w: 120, h: 150 })}</span><span><b>${F.esc(i.name)}</b><br><span class="soft" style="font-size:var(--fs-sm)">${F.esc(i.color)} · ${F.esc(i.size)} · Qty ${i.qty}</span></span><span class="price">${F.money(i.total)}</span></li>`).join('')}</ul></div>
<div><h2 class="mono">Totals</h2><dl class="sum"><div><dt>Subtotal</dt><dd>${F.money(c.subtotal)}</dd></div>${c.discount ? `<div class="sum__d"><dt>Discount</dt><dd>−${F.money(c.discount)}</dd></div>` : ''}<div><dt>Shipping</dt><dd>${c.ship === 0 ? 'Free' : F.money(c.ship)}</dd></div><div class="sum__t"><dt>Total</dt><dd>${F.money(c.grand)}</dd></div></dl><p class="soft" style="margin-top:10px">Your bag has been cleared as part of this demo.</p></div></div>
<div class="empty__cta" style="justify-content:flex-start"><a class="fbtn fbtn--ink" href="${F.url('pages/shop.html')}">Continue shopping</a><a class="fbtn fbtn--line" href="${F.url('index.html')}">Back to home</a></div></section>`;
    F.icons(el); F.watchImages(el); window.scrollTo(0, 0);
  }

  function validate(keys) {
    let first = null;
    keys.forEach((k) => { const err = V[k](data[k]), n = document.getElementById('e-' + k), i = document.getElementById('f-' + k); if (!n || !i) return; n.textContent = err; if (err) { i.setAttribute('aria-invalid', 'true'); i.closest('.field').classList.remove('is-shake'); void i.offsetWidth; i.closest('.field').classList.add('is-shake'); if (!first) first = i; } else i.removeAttribute('aria-invalid'); });
    if (first) first.focus(); return !first;
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    F.on('cart', () => { if (!confirmed) render(); });
    const el = root();
    el.addEventListener('input', (e) => { const n = e.target.name; if (n && n in data && e.target.type !== 'radio') { data[n] = e.target.value; if (V[n] && e.target.getAttribute('aria-invalid')) { const err = V[n](data[n]); document.getElementById('e-' + n).textContent = err; if (!err) e.target.removeAttribute('aria-invalid'); } } });
    el.addEventListener('change', (e) => { if (e.target.type === 'radio') { data[e.target.name] = e.target.value; if (e.target.name === 'method') { document.querySelector('.co__sum').outerHTML = summary(); F.watchImages(el); } } if (e.target.id === 'ack') document.getElementById('ackErr').textContent = ''; if (e.target.tagName === 'SELECT') data[e.target.name] = e.target.value; });
    el.addEventListener('submit', (e) => {
      e.preventDefault();
      if (step === 1) { if (validate(FIELDS1)) { step = 2; render(); window.scrollTo(0, 0); } }
      else if (step === 2) { step = 3; render(); window.scrollTo(0, 0); }
    });
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-back]')) { step -= 1; render(); window.scrollTo(0, 0); return; }
      const ed = e.target.closest('[data-edit]'); if (ed) { step = +ed.dataset.edit; render(); window.scrollTo(0, 0); return; }
      if (e.target.closest('#confirmBtn')) {
        if (!document.getElementById('ack').checked) { document.getElementById('ackErr').textContent = 'Please confirm that you understand this is a demonstration.'; return; }
        const t = totals(), items = F.cart.state().items.filter((i) => F.cart.available(i)).map((i) => { const p = F.byId(i.id); return { name: p.name, img: p.images[0], color: p.colors[i.color].name, size: i.size, qty: i.qty, total: p.price * i.qty }; });
        confirmed = { ref: 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase(), items, subtotal: t.subtotal, discount: t.discount, ship: t.ship, grand: t.grand };
        F.cart.clear(); render();
      }
    });
  });
})();

/* Customer care (searchable FAQ + contact form), size guide (tabs, product-specific help). Frontend-only. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data, page = document.body.dataset.page;

  const FAQ = [
    ['Orders and delivery', 'How long does delivery take?', 'Our sample policy estimates 3 to 6 working days for standard delivery and 1 to 2 for express. These are demo assumptions, not a courier promise.'],
    ['Orders and delivery', 'When is shipping free?', `Standard shipping is free on bags above ${F.money(D.shipping.freeThreshold)}. Below that it is ${F.money(D.shipping.flat)}. The promo code FREESHIP also removes the standard shipping fee.`],
    ['Orders and delivery', 'Can I change my order after placing it?', 'This is a frontend demo, so no real orders exist. On a live store you would contact customer care as early as possible with your order reference.'],
    ['Returns and exchanges', 'What can I return?', 'Unworn, unwashed items with tags attached can be returned within 7 days of delivery under our sample policy. Final-sale and limited-edition pieces are exchange-only.'],
    ['Returns and exchanges', 'How do exchanges work?', 'Request an exchange for a different size within the return window. Subject to availability, the replacement ships once the original is received.'],
    ['Returns and exchanges', 'How long do refunds take?', 'In this sample policy, refunds are issued to the original payment method within 5 to 7 working days of the return being checked.'],
    ['Payment', 'Which payment methods do you accept?', 'This demo shows UPI, card and cash on delivery as selectable options only. No payment is processed and no card details are collected.'],
    ['Payment', 'Is my payment information stored?', 'No. This site has no backend and never asks for card or bank details.'],
    ['Size and fit', 'How should my clothes fit?', 'Each product page lists its fit (regular, relaxed or oversized) and the model measurements. The size guide explains ease for each fit.'],
    ['Size and fit', 'What if I am between sizes?', 'For regular fits, take the larger size if you prefer room and the smaller if you prefer a close fit. For oversized pieces, size down if you want less drop.'],
    ['Product care', 'How do I wash heavyweight cotton?', 'Machine wash cold, inside out, and line dry. Avoid bleach. Tumble dry on low only if the care label allows.'],
    ['Product care', 'How do I care for wool and mohair?', 'Dry clean or hand wash cold with a wool detergent and dry flat. Do not wring.']
  ];

  if (page === 'care') document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id), list = $('faqList'), groups = [...new Set(FAQ.map((f) => f[0]))];
    function render(q) {
      q = (q || '').trim().toLowerCase();
      const hit = FAQ.map((f, i) => ({ f, i })).filter(({ f }) => !q || (f[1] + ' ' + f[2] + ' ' + f[0]).toLowerCase().includes(q));
      $('faqEmpty').hidden = hit.length > 0; $('faqLive').textContent = `${hit.length} answer${hit.length === 1 ? '' : 's'}`;
      list.innerHTML = groups.map((g) => { const items = hit.filter(({ f }) => f[0] === g); if (!items.length) return ''; return `<section class="faq__g"><h3 class="mono">${g}</h3>${items.map(({ f, i }) => `<div class="acc__item"><h4><button type="button" class="acc__btn" aria-expanded="${!!q && hit.length <= 3}" aria-controls="fq${i}" id="fqb${i}">${F.esc(f[1])}<i aria-hidden="true"></i></button></h4><div class="acc__panel${q && hit.length <= 3 ? ' is-open' : ''}" id="fq${i}" role="region" aria-labelledby="fqb${i}"><div><div class="acc__in"><p>${F.esc(f[2])}</p></div></div></div></div>`).join('')}</section>`; }).join('');
    }
    render(''); $('faqQ').addEventListener('input', F.debounce((e) => render(e.target.value), 120));
    $('faqReset').addEventListener('click', () => { $('faqQ').value = ''; render(''); $('faqQ').focus(); });

    /* Contact form: validates, then confirms locally. Nothing is sent. */
    const form = $('contactForm'), rules = {
      name: (v) => (v.trim().length < 2 ? 'Enter your name.' : ''), email: (v) => (!v.trim() ? 'Enter your email address.' : !F.validEmail(v) ? 'Enter a valid email address.' : ''),
      topic: (v) => (v ? '' : 'Choose a topic.'), message: (v) => (v.trim().length < 10 ? 'Tell us a little more (at least 10 characters).' : '')
    };
    const check = (n) => { const i = form.elements[n], e = $('ce-' + n), err = rules[n](i.value); e.textContent = err; i.toggleAttribute('aria-invalid', !!err); if (err) i.setAttribute('aria-invalid', 'true'); return err; };
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid')) check(e.target.name); });
    form.addEventListener('submit', (e) => {
      e.preventDefault(); let first = null;
      Object.keys(rules).forEach((n) => { if (check(n) && !first) first = form.elements[n]; });
      const ok = $('contactOk'); ok.hidden = true;
      if (first) { first.closest('.field').classList.remove('is-shake'); void first.offsetWidth; first.closest('.field').classList.add('is-shake'); first.focus(); return; }
      ok.hidden = false; ok.innerHTML = `<b>Thanks, ${F.esc(form.elements.name.value.trim())}.</b> This is a frontend demo, so your message was <b>not sent or saved</b> anywhere. On a live store it would reach customer care.`; ok.focus(); form.reset();
    });
  });

  if (page === 'size') document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id), S = window.FORME_SIZES, keys = Object.keys(S);
    const tbl = (k, hl) => { const t = S[k]; return `<p class="soft sg__note">${F.esc(t.note)}</p><div class="tbl-wrap" tabindex="0" role="region" aria-label="${t.label} size table, scrolls horizontally on small screens"><table class="tbl"><caption class="vh">${t.label} size chart in centimetres</caption><thead><tr>${t.cols.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`; };
    $('sgTabs').innerHTML = keys.map((k, i) => `<button type="button" role="tab" id="tab-${k}" aria-selected="${i === 0}" aria-controls="sgPanel" tabindex="${i === 0 ? 0 : -1}" data-tab="${k}">${S[k].label}</button>`).join('');
    const show = (k) => { $('sgTabs').querySelectorAll('[role=tab]').forEach((b) => { const on = b.dataset.tab === k; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; }); $('sgPanel').setAttribute('aria-labelledby', 'tab-' + k); $('sgPanel').innerHTML = tbl(k); };
    show(keys[0]);
    $('sgTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) show(b.dataset.tab); });
    $('sgTabs').addEventListener('keydown', (e) => { const t = [...$('sgTabs').querySelectorAll('[role=tab]')], i = t.indexOf(document.activeElement); if (i < 0) return; let n = null; if (e.key === 'ArrowRight') n = (i + 1) % t.length; if (e.key === 'ArrowLeft') n = (i - 1 + t.length) % t.length; if (e.key === 'Home') n = 0; if (e.key === 'End') n = t.length - 1; if (n != null) { e.preventDefault(); t[n].focus(); show(t[n].dataset.tab); } });
    $('fitList').innerHTML = window.FORME_FITS.map((f, i) => `<li><span class="fit__bar" style="--w:${30 + i * 28}%"></span><div><h3 class="display">${f.name}</h3><p class="mono">Ease ${f.ease} at the chest</p><p>${f.body}</p></div></li>`).join('');
    const sel = $('sgProduct'); sel.innerHTML = '<option value="">Choose a product</option>' + D.products.map((p) => `<option value="${p.id}">${F.esc(p.name)}</option>`).join('');
    sel.addEventListener('change', () => {
      const p = F.byId(sel.value), out = $('sgProdOut'); if (!p) { out.innerHTML = '<p class="soft">Choose a product to see its fit and the right table.</p>'; return; }
      const ks = window.FORME_SIZE_MAP[p.category] || ['tops'];
      out.innerHTML = `<div class="sgp"><p class="mono soft">${p.id}</p><h3 class="display">${F.esc(p.name)}</h3><p><b>Fit:</b> ${F.esc(p.fit)}</p>${p.model ? `<p class="soft">${F.esc(p.model)}</p>` : ''}<p><b>Available sizes:</b> ${p.sizes.filter((s) => !p.soldOutSizes.includes(s)).join(', ') || 'Sold out'}</p><p><a class="link-u" href="${F.productUrl(p)}">View product</a></p></div>`;
      show(ks[0]);
    });
  });
})();

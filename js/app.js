/* FORME core: utilities, safe storage, overlay manager, toasts, image handling, product card renderer. */
(function () {
  'use strict';
  const D = window.FORME_DATA;
  const root = document.body.getAttribute('data-root') || '';
  const F = (window.FORME = { data: D, root });

  F.url = (p) => root + p;
  F.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  F.money = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  F.byId = (id) => D.products.find((p) => p.id === id) || null;
  F.reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  F.debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  F.on = (evt, fn) => document.addEventListener('forme:' + evt, fn);
  F.emit = (evt, detail) => document.dispatchEvent(new CustomEvent('forme:' + evt, { detail }));
  F.icons = (scope) => { try { if (window.lucide) window.lucide.createIcons(scope ? { nameAttr: 'data-lucide', root: scope } : undefined); } catch (e) { /* icons are decorative */ } };
  F.productUrl = (p) => F.url('pages/product.html?id=' + encodeURIComponent(p.id));
  F.isSold = (p) => p.stock === 0 || p.sizes.every((s) => p.soldOutSizes.includes(s));
  F.isSale = (p) => !!p.mrp && p.mrp > p.price;

  /* Storage that never throws and survives malformed JSON */
  F.storage = {
    get(k, fb) { try { const v = localStorage.getItem('forme:' + k); return v === null ? fb : JSON.parse(v); } catch (e) { return fb; } },
    set(k, v) { try { localStorage.setItem('forme:' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    remove(k) { try { localStorage.removeItem('forme:' + k); } catch (e) { /* ignore */ } }
  };
  F.session = {
    get(k) { try { return sessionStorage.getItem('forme:' + k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem('forme:' + k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- Image fallback + loading state ---------- */
  F.fallbackImg = (label) => {
    const t = F.esc((label || 'FORME').slice(0, 38));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#E3DFD5"/><g stroke="#A7A7A2" stroke-width="1" opacity=".55">${Array.from({ length: 24 }, (_, i) => `<path d="M${-1000 + i * 120} 1000L${i * 120} 0"/>`).join('')}</g><text x="400" y="480" text-anchor="middle" font-family="Arial Narrow,Arial,sans-serif" font-weight="900" font-size="120" fill="#151515">FORME</text><text x="400" y="540" text-anchor="middle" font-family="monospace" font-size="22" fill="#151515">${t}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };
  F.img = (src, alt, o = {}) => {
    const lazy = o.eager ? 'eager' : 'lazy';
    const pr = o.priority ? ' fetchpriority="high"' : '';
    return `<img src="${F.esc(src)}" alt="${F.esc(alt)}" loading="${lazy}" decoding="async" width="${o.w || 800}" height="${o.h || 1000}"${pr}${o.cls ? ` class="${o.cls}"` : ''}>`;
  };
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = '1'; t.src = F.fallbackImg(t.alt); t.classList.add('is-fallback'); }
  }, true);
  document.addEventListener('load', (e) => { const t = e.target; if (t && t.tagName === 'IMG') t.classList.add('is-loaded'); }, true);
  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('img[data-k]').forEach((i) => { i.src = D.images.img(i.dataset.k, +i.dataset.w || 1200); }));
  F.watchImages = (scope) => (scope || document).querySelectorAll('img').forEach((i) => { if (i.complete && i.naturalWidth) i.classList.add('is-loaded'); });

  /* ---------- Overlay manager (focus trap, Esc, scroll lock) ---------- */
  const stack = [];
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  F.overlay = {
    open(el, opts = {}) {
      if (!el || stack.some((s) => s.el === el)) return;
      stack.push({ el, returnTo: opts.returnTo || document.activeElement, onClose: opts.onClose });
      el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      const first = opts.focus ? el.querySelector(opts.focus) : el.querySelector('[data-autofocus]') || el.querySelector(FOCUSABLE);
      setTimeout(() => first && first.focus({ preventScroll: true }), 60);
    },
    close(el) {
      const i = stack.findIndex((s) => s.el === el);
      if (i < 0) return;
      const s = stack.splice(i, 1)[0];
      el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
      if (!stack.length) document.body.classList.remove('is-locked');
      if (s.onClose) s.onClose();
      if (s.returnTo && s.returnTo.focus && document.contains(s.returnTo)) s.returnTo.focus({ preventScroll: true });
    },
    closeTop() { if (stack.length) this.close(stack[stack.length - 1].el); },
    isOpen: (el) => stack.some((s) => s.el === el)
  };
  document.addEventListener('keydown', (e) => {
    if (!stack.length) return;
    if (e.key === 'Escape') { e.preventDefault(); F.overlay.closeTop(); return; }
    if (e.key === 'Tab') {
      const el = stack[stack.length - 1].el;
      const f = [...el.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!f.length) return;
      const a = f[0], b = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
      else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
      else if (!el.contains(document.activeElement)) { e.preventDefault(); a.focus(); }
    }
  });
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-close]');
    if (o) { const host = o.closest('.f-overlay, .f-modal, .search, .mnav, .lb, .filters-wrap, .look-drawer'); if (host) F.overlay.close(host); return; }
    if (stack.length) { const top = stack[stack.length - 1].el; if (e.target === top && (top.classList.contains('f-overlay') || top.classList.contains('f-modal') || top.classList.contains('filters-wrap') || top.classList.contains('look-drawer'))) F.overlay.close(top); }
  });

  /* ---------- Toasts ---------- */
  F.toast = (msg, o = {}) => {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.className = 'f-toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'f-toast' + (o.type === 'error' ? ' f-toast--error' : '');
    t.innerHTML = `<span>${F.esc(msg)}</span>` + (o.action ? `<button type="button">${F.esc(o.action.label)}</button>` : '');
    if (o.action) t.querySelector('button').addEventListener('click', () => { o.action.fn(); t.remove(); });
    box.appendChild(t);
    const kill = () => { t.classList.add('is-out'); setTimeout(() => t.remove(), 300); };
    setTimeout(kill, o.ms || 3800);
  };

  /* ---------- Product card ---------- */
  F.labelsFor = (p) => {
    const out = [];
    if (F.isSold(p)) out.push('<span class="tag tag--ink">Sold out</span>');
    else {
      if (p.labels.includes('new')) out.push('<span class="tag tag--lime">New</span>');
      if (p.labels.includes('limited')) out.push('<span class="tag tag--ink">Limited</span>');
      if (p.labels.includes('bestseller')) out.push('<span class="tag">Bestseller</span>');
      if (p.labels.includes('trending')) out.push('<span class="tag">Trending</span>');
      if (F.isSale(p)) out.push('<span class="tag">Sale</span>');
    }
    return out.join('');
  };
  F.priceHtml = (p) => F.isSale(p)
    ? `<span class="price price--sale"><s>${F.money(p.mrp)}</s>${F.money(p.price)}</span>`
    : `<span class="price">${F.money(p.price)}</span>`;
  F.swatchesHtml = (p, sel = 0, attr = 'data-swatch') => `<div class="swatches" role="group" aria-label="Colour">${p.colors.map((c, i) =>
    `<button type="button" class="swatch" ${attr}="${i}" style="background:${c.hex}" aria-label="${F.esc(c.name)}" aria-pressed="${i === sel}" title="${F.esc(c.name)}"></button>`).join('')}</div>`;
  F.productCard = (p, o = {}) => {
    const sold = F.isSold(p);
    const wished = window.FORME.wishlist ? window.FORME.wishlist.has(p.id) : false;
    return `<article class="pcard${sold ? ' pcard--sold' : ''}${p.images[1] ? '' : ' pcard--single'}" data-id="${p.id}" data-color="0">
  <div class="pcard__media">
    <a class="pcard__link" href="${F.productUrl(p)}" aria-label="${F.esc(p.name)}, ${F.money(p.price)}">
      <span class="media" style="position:absolute;inset:0">${F.img(p.images[0], p.name, { cls: 'pcard__img pcard__img--1', w: 800, h: 1000 })}${p.images[1] ? F.img(p.images[1], '', { cls: 'pcard__img pcard__img--2', w: 800, h: 1000 }) : ''}</span>
    </a>
    <div class="pcard__labels">${F.labelsFor(p)}</div>
    <button type="button" class="pcard__wish" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove' : 'Add'} ${F.esc(p.name)} ${wished ? 'from' : 'to'} wishlist"><i data-lucide="heart"></i></button>
    <div class="pcard__quick">
      <button type="button" data-quickadd="${p.id}" ${sold ? 'disabled' : ''}>${sold ? 'Sold out' : 'Quick add'}</button>
      <button type="button" data-quickview="${p.id}" aria-label="Quick view ${F.esc(p.name)}"><i data-lucide="eye"></i></button>
    </div>
    <div class="pcard__sizes" role="group" aria-label="Choose a size for ${F.esc(p.name)}" data-sizes>
      <p><span>Select size</span><button type="button" data-sizes-close>Cancel</button></p>
      <div class="size-row">${p.sizes.map((s) => `<button type="button" class="size-btn" data-size-pick="${F.esc(s)}" ${p.soldOutSizes.includes(s) ? 'disabled aria-label="' + F.esc(s) + ', sold out"' : ''}>${F.esc(s)}</button>`).join('')}</div>
    </div>
  </div>
  <div class="pcard__info">
    <div class="pcard__row"><p class="pcard__name"><a href="${F.productUrl(p)}">${F.esc(p.name)}</a></p>${F.priceHtml(p)}</div>
    <div class="pcard__meta">${F.swatchesHtml(p)}<span class="mono pcard__id">${p.id}</span></div>
  </div>
</article>`;
  };
  F.renderProducts = (el, list, o) => { el.innerHTML = list.map((p) => F.productCard(p, o)).join(''); F.icons(el); F.watchImages(el); };

  /* Wordmark / date helpers */
  F.fmtDate = (iso) => { try { return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return iso; } };
})();

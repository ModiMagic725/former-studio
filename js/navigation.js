/* Shared shell: announcement strip, header, mega menu, mobile nav, footer, drawers, modals. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data, u = F.url;

  const I = (n) => `<i data-lucide="${n}" aria-hidden="true"></i>`;
  const linkOf = (l) => `<li><a href="${u(l[1])}">${F.esc(l[0])}</a></li>`;

  function currentSection() {
    const p = location.pathname, q = new URLSearchParams(location.search);
    if (/journal|article/.test(p)) return 'Journal';
    if (/collection\.html/.test(p)) { const c = q.get('c'); return { women: 'Women', men: 'Men', unisex: 'Unisex' }[c] || 'Collections'; }
    if (/shop\.html/.test(p)) { const g = q.get('gender'); return { women: 'Women', men: 'Men', unisex: 'Unisex' }[g] || 'Collections'; }
    return '';
  }

  function announcement() {
    if (F.session.get('announce-closed') === '1') return '';
    return `<div class="announce on-dark" role="region" aria-label="Announcements" id="announce"><div class="announce__inner">
  <div class="announce__nav"><button type="button" data-ann="-1" aria-label="Previous announcement">${I('chevron-left')}</button><button type="button" data-ann="1" aria-label="Next announcement">${I('chevron-right')}</button></div>
  <div class="announce__msgs">${D.announcements.map((m, i) => `<p class="announce__msg${i === 0 ? ' is-active' : ''}" ${i ? 'aria-hidden="true"' : ''}>${F.esc(m)}</p>`).join('')}</div>
  <button type="button" class="announce__close" data-ann-close aria-label="Close announcements">${I('x')}</button></div></div>`;
  }

  function header() {
    const sec = currentSection();
    const items = D.nav.map((n) => {
      const cur = n.label === sec ? ' aria-current="page"' : '';
      if (!n.cols) return `<li class="nav__item"><a class="nav__link" href="${u(n.href)}"${cur}>${n.label}</a></li>`;
      return `<li class="nav__item"><a class="nav__link" href="${u(n.href)}"${cur} aria-haspopup="true">${n.label}</a>
  <div class="mega" aria-label="${n.label} menu"><div class="wrap mega__inner">
    ${n.cols.map((c) => `<div><p class="mega__h">${c.title}</p><ul>${c.links.map(linkOf).join('')}</ul></div>`).join('')}
    <a class="mega__feature" href="${u(n.feature.href)}"><span class="media">${F.img(n.feature.img, '', { w: 700, h: 525 })}</span><span>${n.feature.label}</span></a>
  </div></div></li>`;
    }).join('');
    return `<header class="header" id="header"><div class="wrap header__bar">
  <div class="header__left"><button type="button" class="icon-btn menu-btn" data-open-menu aria-label="Open menu" aria-expanded="false">${I('menu')}</button>
  <nav class="nav" aria-label="Primary"><ul style="display:flex;gap:inherit">${items}</ul></nav></div>
  <a class="wordmark" href="${u('index.html')}" aria-label="FORME Studio 09, home">FORME<i>/09</i></a>
  <div class="header__actions">
    <button type="button" class="icon-btn" data-open-search aria-label="Search">${I('search')}</button>
    <button type="button" class="icon-btn" data-open-account aria-label="Account">${I('user')}</button>
    <a class="icon-btn" href="${u('pages/wishlist.html')}" aria-label="Wishlist">${I('heart')}<span class="count-badge" data-wishlist-count data-n="0">0</span></a>
    <button type="button" class="icon-btn" data-open-bag aria-label="Open bag">${I('shopping-bag')}<span class="count-badge" data-cart-count data-n="0">0</span></button>
  </div></div></header>`;
  }

  function mobileNav() {
    const body = D.nav.map((n, i) => !n.cols
      ? `<a class="mnav__link" href="${u(n.href)}">${n.label}</a>`
      : `<div><button type="button" class="mnav__toggle" aria-expanded="false" aria-controls="msub${i}">${n.label}${I('plus')}</button>
<div class="mnav__sub" id="msub${i}"><div><a href="${u(n.href)}">Shop all ${n.label.toLowerCase()}</a>${n.cols.flatMap((c) => c.links).filter((l, j, a) => a.findIndex((x) => x[0] === l[0]) === j).map((l) => `<a href="${u(l[1])}">${F.esc(l[0])}</a>`).join('')}</div></div></div>`).join('');
    return `<div class="mnav on-dark" id="mnav" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true">
  <div class="mnav__top"><a class="wordmark" href="${u('index.html')}">FORME<i>/09</i></a><button type="button" class="icon-btn" data-close aria-label="Close menu">${I('x')}</button></div>
  <div class="mnav__body">${body}<div class="mnav__foot"><a href="${u('pages/customer-care.html')}">Customer care</a><a href="${u('pages/size-guide.html')}">Size guide</a><a href="${u('pages/wishlist.html')}">Wishlist</a><a href="${u('pages/about.html')}">About</a><button type="button" data-open-account>Account</button></div></div></div>`;
  }

  function footer() {
    const col = (t, links) => `<div><p class="footer__h">${t}</p><ul>${links.map(linkOf).join('')}</ul></div>`;
    return `<footer class="footer on-dark" id="footer"><div class="wrap">
  <div class="footer__top">
    <div><p class="footer__manifesto">Clothes for people who refuse to be categorised.</p>
      <div class="socials" style="margin-top:24px">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram (opens platform home)">${I('instagram')}</a>
        <a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube (opens platform home)">${I('youtube')}</a>
        <a href="https://x.com/" target="_blank" rel="noopener" aria-label="X (opens platform home)">${I('twitter')}</a></div></div>
    ${col('Shop', [['New arrivals', 'pages/collection.html?c=new-arrivals'], ['Women', 'pages/collection.html?c=women'], ['Men', 'pages/collection.html?c=men'], ['Unisex', 'pages/collection.html?c=unisex'], ['Sale', 'pages/collection.html?c=sale'], ['Lookbook', 'pages/lookbook.html']])}
    ${col('Customer care', [['Customer care', 'pages/customer-care.html'], ['Size guide', 'pages/size-guide.html'], ['Shipping & returns', 'pages/shipping-returns.html'], ['Wishlist', 'pages/wishlist.html'], ['Bag', 'pages/cart.html']])}
    ${col('Studio', [['About', 'pages/about.html'], ['Journal', 'pages/journal.html'], ['Lookbook', 'pages/lookbook.html']])}
    <div class="footer__news"><div><p class="footer__h">Newsletter</p><p style="font-size:var(--fs-md);max-width:30ch">First access to drops and studio notes.</p></div>
      <div>${newsletterForm('footer')}</div></div>
  </div></div>
  <p class="footer__big" aria-hidden="true">FORME</p>
  <div class="footer__bottom"><div class="wrap" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;align-items:center;width:100%">
    <span>© 2026 FORME / STUDIO 09. A fictional brand for a frontend portfolio project.</span>
    <span class="mono">Currency: INR (₹)</span>
    <button type="button" class="to-top" data-to-top>Back to top ${I('arrow-up')}</button></div></div></footer>`;
  }

  function newsletterForm(id) {
    return `<form class="js-newsletter" novalidate data-nl="${id}"><label class="vh" for="nl-${id}">Email address</label>
<div class="nl"><input id="nl-${id}" type="email" name="email" autocomplete="email" placeholder="Your email" aria-describedby="nlm-${id}"><button type="submit">Subscribe</button></div>
<p class="nl-msg" id="nlm-${id}" role="status" aria-live="polite"></p>
<p class="demo-note">Frontend demo: nothing is sent or stored on a server.</p></form>`;
  }
  F.newsletterForm = newsletterForm;

  function overlays() {
    return `
<div class="f-overlay" id="bagDrawer" aria-hidden="true"><div class="f-drawer" role="dialog" aria-modal="true" aria-labelledby="bagTitle">
  <div class="f-drawer__head"><h2 id="bagTitle" data-bag-title>Your bag</h2><button type="button" class="icon-btn" data-close aria-label="Close bag">${I('x')}</button></div>
  <div class="f-drawer__body"></div><div class="f-drawer__foot" hidden></div></div></div>

<div class="f-modal f-modal--wide" id="qvModal" role="dialog" aria-modal="true" aria-label="Quick view" aria-hidden="true"><div class="f-modal__panel"><button type="button" class="icon-btn f-modal__close" data-close aria-label="Close quick view">${I('x')}</button><div id="qvBody"></div></div></div>

<div class="f-modal" id="accountModal" role="dialog" aria-modal="true" aria-labelledby="accTitle" aria-hidden="true"><div class="f-modal__panel"><button type="button" class="icon-btn f-modal__close" data-close aria-label="Close">${I('x')}</button>
  <div class="f-modal__pad"><h2 id="accTitle">Account</h2><p style="margin-bottom:12px">Sign-in is a placeholder. This is a frontend-only demo, so there is no login, no server and no saved profile.</p>
  <p class="soft" style="margin-bottom:20px">Your bag and wishlist are stored in this browser only.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="fbtn fbtn--ink" href="${u('pages/wishlist.html')}">View wishlist</a><a class="fbtn fbtn--line" href="${u('pages/customer-care.html')}">Customer care</a></div></div></div></div>

<div class="search" id="search" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true"><div class="wrap">
  <form class="search__bar" role="search" id="searchForm">${I('search')}<label class="vh" for="searchInput">Search products</label>
  <input class="search__input" id="searchInput" type="text" placeholder="Search" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="searchList" aria-autocomplete="list">
  <button type="button" class="icon-btn" data-search-clear aria-label="Clear search" hidden>${I('delete')}</button>
  <button type="button" class="icon-btn" data-close aria-label="Close search">${I('x')}</button></form>
  <div class="search__grid"><div><section id="searchRecentWrap" hidden><h3>Recent searches</h3><div id="searchRecent"></div></section><section><h3>Trending</h3><div id="searchTrending"></div></section></div>
  <div><div id="searchList" role="listbox" aria-label="Suggestions" class="suggest"></div><div id="searchEmpty" class="search__empty" hidden></div></div></div></div></div>

<div class="f-toasts" id="toasts" role="status" aria-live="polite"></div>`;
  }

  function mount() {
    const h = document.getElementById('site-header'), f = document.getElementById('site-footer');
    if (h) h.outerHTML = `<a class="skip" href="#main">Skip to content</a>${announcement()}${header()}${mobileNav()}`;
    if (f) f.outerHTML = footer();
    document.body.insertAdjacentHTML('beforeend', overlays());
    F.icons(); F.watchImages();
    F.emit('cart', F.cart.totals()); F.emit('wishlist', F.wishlist.list());
  }

  function wire() {
    /* Announcement rotation */
    const ann = document.getElementById('announce');
    if (ann) {
      const msgs = [...ann.querySelectorAll('.announce__msg')]; let i = 0, timer;
      const show = (n) => { i = (n + msgs.length) % msgs.length; msgs.forEach((m, j) => { m.classList.toggle('is-active', j === i); m.setAttribute('aria-hidden', j === i ? 'false' : 'true'); }); };
      const start = () => { stop(); if (!F.reducedMotion()) timer = setInterval(() => show(i + 1), 4800); };
      const stop = () => clearInterval(timer);
      ann.addEventListener('click', (e) => {
        const b = e.target.closest('[data-ann]'); if (b) { show(i + parseInt(b.dataset.ann, 10)); start(); }
        if (e.target.closest('[data-ann-close]')) { stop(); ann.remove(); F.session.set('announce-closed', '1'); }
      });
      ann.addEventListener('mouseenter', stop); ann.addEventListener('mouseleave', start); ann.addEventListener('focusin', stop); ann.addEventListener('focusout', start);
      start();
    }
    /* Sticky header state */
    const hd = document.getElementById('header');
    const onScroll = () => hd.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    /* Mega menu with hover intent + Escape */
    const items = [...document.querySelectorAll('.nav__item')]; let hoverT;
    items.forEach((it) => {
      it.addEventListener('mouseenter', () => { clearTimeout(hoverT); hoverT = setTimeout(() => { items.forEach((x) => x.classList.remove('is-open')); it.classList.remove('is-dismissed'); if (it.querySelector('.mega')) it.classList.add('is-open'); }, 70); });
      it.addEventListener('mouseleave', () => { clearTimeout(hoverT); it.classList.remove('is-open'); });
      it.addEventListener('focusout', (e) => { if (!it.contains(e.relatedTarget)) it.classList.remove('is-dismissed'); });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const it = document.activeElement && document.activeElement.closest('.nav__item');
      if (it) { it.classList.remove('is-open'); it.classList.add('is-dismissed'); const l = it.querySelector('.nav__link'); if (l) l.focus(); }
    });

    /* Mobile nav */
    const mnav = document.getElementById('mnav'), mb = document.querySelector('[data-open-menu]');
    mb.addEventListener('click', () => { mb.setAttribute('aria-expanded', 'true'); F.overlay.open(mnav, { returnTo: mb, onClose: () => mb.setAttribute('aria-expanded', 'false') }); });
    mnav.addEventListener('click', (e) => {
      const t = e.target.closest('.mnav__toggle');
      if (t) { const open = t.getAttribute('aria-expanded') !== 'true'; t.setAttribute('aria-expanded', open); document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-open', open); return; }
      if (e.target.closest('a')) F.overlay.close(mnav);
    });
    window.matchMedia('(min-width: 992px)').addEventListener('change', (m) => { if (m.matches && F.overlay.isOpen(mnav)) F.overlay.close(mnav); });

    /* Floating back-to-top with scroll-progress ring */
    const btt = document.createElement('button'); btt.type = 'button'; btt.className = 'btt'; btt.setAttribute('aria-label', 'Back to top');
    btt.innerHTML = '<svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle class="ring__bg" cx="26" cy="26" r="24"/><circle class="ring__fg" cx="26" cy="26" r="24" stroke-dasharray="150.8" stroke-dashoffset="150.8"/></svg><i data-lucide="arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(btt); F.icons(btt);
    const fg = btt.querySelector('.ring__fg');
    const bt = () => { const h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, scrollY / h) : 0; btt.classList.toggle('is-on', scrollY > 900); fg.style.strokeDashoffset = 150.8 * (1 - p); };
    window.addEventListener('scroll', bt, { passive: true }); bt();
    btt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: F.reducedMotion() ? 'auto' : 'smooth' }); });

    /* Header/page actions */
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-bag]')) F.cart.openDrawer();
      const acc = e.target.closest('[data-open-account]'); if (acc) F.overlay.open(document.getElementById('accountModal'), { returnTo: acc });
      if (e.target.closest('[data-to-top]')) window.scrollTo({ top: 0, behavior: F.reducedMotion() ? 'auto' : 'smooth' });
      if (e.target.closest('#accountModal a')) F.overlay.close(document.getElementById('accountModal'));
    });
  }

  document.addEventListener('DOMContentLoaded', () => { mount(); wire(); });
})();

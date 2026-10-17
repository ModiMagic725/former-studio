/* Lookbook: cinematic chapters, signature pinned horizontal sequence, shop-the-look hotspots + drawer. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data;
  if (document.body.dataset.page !== 'lookbook') return;
  const I = (k, w) => D.images.img(k, w);
  const hs = (list) => list.map(([x, y, id]) => { const p = F.byId(id); return `<button type="button" class="hs" style="left:${x}%;top:${y}%" data-look="${id}" aria-haspopup="dialog" aria-label="Shop the look: ${F.esc(p.name)}"><span></span></button>`; }).join('');
  const frame = (k, alt, spots, w = 1400, h = 1750, eager) => `<span class="media lbf">${F.img(I(k, w), alt, { w, h, eager })}${hs(spots)}</span>`;

  document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);
    /* Chapter 1: pinned horizontal sequence (native horizontal scroll on touch / reduced motion) */
    $('hTrack').innerHTML = `
<div class="hp hp--txt"><p class="mono">Chapter 01 / 03</p><h2 class="display">Lines,<br>redrawn</h2><p>One silhouette, three ways. Shot on a rooftop at 5:40 a.m., the cold made the cloth behave differently, and we kept it.</p><p class="mono hp__hint">Scroll to move through the chapter</p></div>
<figure class="hp hp--img">${frame('camp2', 'Model in a cropped shell jacket and wide trousers on a rooftop', [[48, 34, 'FRM-009'], [56, 72, 'FRM-005']], 1400, 1750, true)}<figcaption class="mono">Look 01. Photography: Aarav Menon. Styling: Ila Rao.</figcaption></figure>
<figure class="hp hp--img">${frame('camp1', 'Woman in a long coat against a pale wall', [[50, 45, 'FRM-011']])}<figcaption class="mono">Look 02. Longline wool coat.</figcaption></figure>
<div class="hp hp--quote"><p class="display">One silhouette.<br>Three ways.</p><p class="mono">Studio 09 / Campaign 09</p></div>
<figure class="hp hp--img">${frame('camp10', 'Man in a coach jacket and raw denim', [[46, 40, 'FRM-010'], [52, 75, 'FRM-007']])}<figcaption class="mono">Look 03. Photography: Aarav Menon. Casting: Studio 09.</figcaption></figure>
<figure class="hp hp--img">${frame('street1', 'Street portrait with a sling bag', [[58, 60, 'FRM-020']])}<figcaption class="mono">Look 04. Courier sling.</figcaption></figure>`;

    /* Chapter 2: asymmetric mosaic */
    $('mosaic').innerHTML = `
<figure class="m m--a" data-clip>${frame('camp3', 'Wool and mohair layers', [[44, 40, 'FRM-011'], [62, 62, 'FRM-014']], 1600, 1900)}<figcaption class="mono">Wool, mohair and a coat that holds its edge. Daylight only.</figcaption></figure>
<figure class="m m--b" data-clip>${frame('camp4', 'Cable knit with tailored trousers', [[50, 45, 'FRM-013']], 1000, 1250)}<figcaption class="mono">Cable crew, quiet colour.</figcaption></figure>
<figure class="m m--c" data-clip>${frame('camp5', 'Pleated trousers in profile', [[52, 60, 'FRM-005']], 1000, 1250)}<figcaption class="mono">Parallel pleat, small stack at the shoe.</figcaption></figure>
<figure class="m m--d" data-clip><span class="media lbf">${F.img(I('camp9', 1400), 'Portrait in the studio', { w: 1400, h: 1000 })}</span><figcaption class="mono">Photography: Aarav Menon. Casting: Studio 09.</figcaption></figure>`;

    /* Chapter 3: full-bleed */
    $('afterFig').innerHTML = `<span class="media lbf lbf--full">${F.img(I('camp7', 2000), 'Satin and chrome under a single light', { w: 2000, h: 1200 })}${hs([[50, 45, 'FRM-015'], [60, 82, 'FRM-024'], [44, 28, 'FRM-025']])}</span>`;

    /* Contact sheet (Swiper) */
    const sheet = [['camp6', 'Shell, tailored trouser'], ['camp8', 'Heavyweight tee in daylight'], ['studio1', 'The studio at 5 a.m.'], ['camp9', 'Between fittings'], ['street1', 'Street, raw denim'], ['camp1', 'Coat, side light'], ['camp2', 'Rooftop, first light'], ['camp3', 'Layered wool']];
    $('sheetWr').innerHTML = sheet.map(([k, c], i) => `<div class="swiper-slide"><figure><span class="media" style="display:block;aspect-ratio:4/5">${F.img(I(k, 800), c, { w: 800, h: 1000 })}</span><figcaption class="mono">Frame ${String(i + 1).padStart(2, '0')}. ${F.esc(c)}</figcaption></figure></div>`).join('');
    F.icons(); F.watchImages();
    if (window.Swiper) new Swiper('#sheetSw', { slidesPerView: 1.4, spaceBetween: 12, freeMode: true, a11y: { enabled: true }, keyboard: { enabled: true, onlyInViewport: true }, navigation: { prevEl: '#shPrev', nextEl: '#shNext' }, breakpoints: { 576: { slidesPerView: 2.2 }, 992: { slidesPerView: 3.4, spaceBetween: 20 }, 1400: { slidesPerView: 4.4 } } });

    /* Hotspot -> product drawer */
    let drawer = null, cur = null;
    function openLook(id, trigger) {
      const p = F.byId(id); if (!p) return; cur = { p, size: p.sizes.length === 1 ? p.sizes[0] : null, color: 0 };
      if (!drawer) { drawer = document.createElement('div'); drawer.className = 'f-overlay look-drawer'; drawer.setAttribute('aria-hidden', 'true'); drawer.innerHTML = '<div class="f-drawer" role="dialog" aria-modal="true" aria-labelledby="ldTitle"><div class="f-drawer__head"><h2 id="ldTitle">Shop the look</h2><button type="button" class="icon-btn" data-close aria-label="Close"><i data-lucide="x"></i></button></div><div class="f-drawer__body" id="ldBody"></div></div>'; document.body.appendChild(drawer); }
      draw(); F.overlay.open(drawer, { returnTo: trigger, focus: '#ldBody .size-btn:not([disabled]), #ldBody a' });
    }
    function draw() {
      const { p } = cur, sold = F.isSold(p);
      $('ldBody').innerHTML = `<div class="ld"><span class="media ld__img" style="display:block;aspect-ratio:4/5">${F.img(p.images[0], p.name, { eager: true, w: 800, h: 1000 })}</span><p class="mono soft" style="margin-top:12px">${p.id}</p><h3 class="ld__n">${F.esc(p.name)}</h3><p>${F.priceHtml(p)} ${F.labelsFor(p)}</p>${F.swatchesHtml(p, cur.color, 'data-ldcolor')}
${sold ? '<p class="soft" style="margin-top:12px">Sold out.</p>' : p.sizes.length === 1 ? '' : `<div class="size-row" role="group" aria-label="Size" style="margin-top:14px">${p.sizes.map((s) => `<button type="button" class="size-btn" data-ldsize="${F.esc(s)}" aria-pressed="${cur.size === s}" ${p.soldOutSizes.includes(s) ? 'disabled' : ''}>${F.esc(s)}</button>`).join('')}</div>`}
<p class="pdp__err" id="ldErr" role="alert"></p><div class="ld__cta"><button type="button" class="fbtn fbtn--ink" style="flex:1" data-ldadd ${sold ? 'disabled' : ''}>${sold ? 'Sold out' : 'Add to bag'}</button><a class="fbtn fbtn--line" href="${F.productUrl(p)}">Details</a></div></div>`;
      F.icons($('ldBody')); F.watchImages($('ldBody'));
    }
    document.addEventListener('click', (e) => {
      const h = e.target.closest('[data-look]'); if (h) { openLook(h.dataset.look, h); return; }
      if (!cur || !e.target.closest('.look-drawer')) return;
      const c = e.target.closest('[data-ldcolor]'); if (c) { cur.color = +c.dataset.ldcolor; draw(); return; }
      const s = e.target.closest('[data-ldsize]'); if (s) { cur.size = s.dataset.ldsize; draw(); return; }
      if (e.target.closest('[data-ldadd]')) {
        if (!cur.size) { $('ldErr').textContent = 'Please select a size.'; return; }
        const r = F.cart.add(cur.p.id, cur.color, cur.size, 1); if (!r.ok) { $('ldErr').textContent = r.error; return; }
        F.overlay.close(drawer); F.cart.openDrawer({ added: true });
      }
    });

    /* Signature sequence: pinned horizontal scroll, desktop + motion allowed only */
    if (window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap, ST = window.ScrollTrigger; gsap.registerPlugin(ST);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
        const sec = $('hSection'), track = $('hTrack'), bar = $('hBar'), cnt = $('hCount');
        sec.classList.add('is-pinned');
        const dist = () => Math.max(0, track.scrollWidth - sec.clientWidth), n = track.children.length;
        const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top 58px', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (s) => { bar.style.transform = `scaleX(${s.progress})`; cnt.textContent = `${String(Math.min(n, Math.floor(s.progress * n) + 1)).padStart(2, '0')} / ${String(n).padStart(2, '0')}`; } } });
        return () => { sec.classList.remove('is-pinned'); bar.style.transform = ''; };
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.lbi__title .ln > span', { yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'power4.out' });
        gsap.from('.lbi__img', { scale: 1.12, duration: 1.8, ease: 'power3.out' });
        gsap.from('.lbi__meta > *', { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.08, delay: 0.6 });
        const img = document.querySelector('.lbf--full img'); if (img) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '#afterSec', start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      window.addEventListener('pagehide', () => mm.revert());
    }
  });
})();

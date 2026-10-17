/* Homepage: renders data-driven sections, Swiper carousels, hotspots, countdown. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data;
  if (document.body.dataset.page !== 'home') return;

  const setImg = (sel, src, alt, srcset) => { const i = document.querySelector(sel); if (!i) return; if (srcset) { i.srcset = srcset; i.sizes = '(max-width: 767px) 100vw, 60vw'; } i.src = src; i.alt = alt; };

  document.addEventListener('DOMContentLoaded', () => {
    /* Static art-directed images, hydrated from the data file so URLs live in one place */
    setImg('#heroImg', D.heroImg, 'Model in an oversized black shell jacket and wide trousers against a pale wall', `${D.heroImgMobile} 1000w, ${D.heroImg} 1800w`);
    setImg('#tileWomen', D.featureTiles.women, 'Woman in a long coat and tailored trousers');
    setImg('#tileMen', D.featureTiles.men, 'Man in a structured jacket and denim');
    setImg('#tileUnisex', D.featureTiles.unisex, 'Two people wearing matching oversized streetwear');
    setImg('#tileAcc', D.featureTiles.accessories, 'Small leather shoulder bag');
    setImg('#manifestoImg', D.manifestoImg, 'Inside the studio: garments on a rail beside a cutting table');
    const dropP = F.byId(D.drop.productId);
    if (dropP) setImg('#dropImg', dropP.images[0], dropP.name);

    /* New season carousel */
    const nsIds = ['FRM-005', 'FRM-002', 'FRM-014', 'FRM-010', 'FRM-022', 'FRM-017', 'FRM-013', 'FRM-009'];
    const nsList = nsIds.map(F.byId).filter(Boolean);
    const wrap = document.getElementById('nsWrapper');
    wrap.innerHTML = nsList.map((p) => `<div class="swiper-slide">${F.productCard(p)}</div>`).join('');

    /* Trending grid (Bootstrap grid) */
    const trend = ['FRM-001', 'FRM-007', 'FRM-011', 'FRM-015', 'FRM-017', 'FRM-020', 'FRM-025', 'FRM-004'].map(F.byId).filter(Boolean);
    document.getElementById('trendGrid').innerHTML = trend.map((p) => `<div class="col-6 col-md-4 col-lg-3">${F.productCard(p)}</div>`).join('');

    /* Aesthetics */
    document.getElementById('aesth').innerHTML = D.aesthetics.map((a) => `<a class="aesth__panel" href="${F.url('pages/collection.html?c=' + a.slug)}" aria-label="Shop ${F.esc(a.title)}"><span class="media">${F.img(a.img, '', { w: 800, h: 1000 })}</span><span class="aesth__in"><h3>${F.esc(a.title)}</h3><p>${F.esc(a.note)}</p></span></a>`).join('');

    /* Journal preview */
    document.getElementById('jgrid').innerHTML = D.journal.slice(0, 3).map((j, i) => `<a class="jcard" href="${F.url('pages/article.html?slug=' + j.slug)}" data-aos="fade-up" data-aos-delay="${i * 90}"><span class="media" style="display:block">${F.img(j.img, '', { w: 900, h: 1100 })}</span>
<div class="jcard__meta mono"><span>${F.esc(j.category)}</span><span>${F.fmtDate(j.date)}</span><span>${j.read} min</span></div><h3>${F.esc(j.title)}</h3><p>${F.esc(j.excerpt)}</p></a>`).join('');

    /* Lookbook */
    document.getElementById('lookWrapper').innerHTML = D.lookbook.map((s, i) => `<div class="swiper-slide"><div class="look__slide">
  <div class="look__fig" data-slide="${i}"><span class="media">${F.img(s.img, s.title + ': campaign photograph', { w: 1600, h: 1000 })}</span>
    ${s.hotspots.map((h, j) => { const p = F.byId(h.pid); return `<button type="button" class="hs" style="left:${h.x}%;top:${h.y}%" data-hs="${i}:${j}" aria-expanded="false" aria-label="Shop the look: ${F.esc(p.name)}"><span></span></button>`; }).join('')}</div>
  <div class="look__cap"><span class="mono" style="color:var(--lime)">Look ${String(i + 1).padStart(2, '0')} / ${String(D.lookbook.length).padStart(2, '0')}</span><h3>${F.esc(s.title)}</h3><p>${F.esc(s.note)}</p><p class="mono">${F.esc(s.credit)}</p><span class="mono">Tap the dots to shop the look</span></div></div></div>`).join('');

    F.icons(); F.watchImages();

    /* Swipers */
    if (window.Swiper) {
      const ctr = document.getElementById('nsCount');
      const pad = (n) => String(n).padStart(2, '0');
      const ns = new Swiper('#nsSwiper', {
        slidesPerView: 1.5, spaceBetween: 12, watchOverflow: true, keyboard: { enabled: true, onlyInViewport: true }, a11y: { enabled: true, slideRole: 'group' },
        navigation: { prevEl: '#nsPrev', nextEl: '#nsNext' },
        breakpoints: { 576: { slidesPerView: 2.3 }, 768: { slidesPerView: 3.1 }, 1200: { slidesPerView: 4.1, spaceBetween: 20 } },
        on: { init(s) { ctr.textContent = `${pad(s.activeIndex + 1)} / ${pad(nsList.length)}`; }, slideChange(s) { ctr.textContent = `${pad(Math.min(s.activeIndex + 1, nsList.length))} / ${pad(nsList.length)}`; } }
      });
      const look = new Swiper('#lookSwiper', {
        slidesPerView: 1, spaceBetween: 24, keyboard: { enabled: true, onlyInViewport: true }, a11y: { enabled: true },
        navigation: { prevEl: '#lookPrev', nextEl: '#lookNext' }, pagination: { el: '#lookPag', clickable: true },
        on: { slideChange() { closePop(); } }
      });
      F.homeSwipers = { ns, look };
    }

    /* Shop-the-look hotspots */
    let pop = null, popBtn = null;
    function closePop(refocus) { if (pop) { pop.remove(); pop = null; } if (popBtn) { popBtn.setAttribute('aria-expanded', 'false'); if (refocus) popBtn.focus(); popBtn = null; } }
    document.getElementById('lookWrapper').addEventListener('click', (e) => {
      if (e.target.closest('.hs-pop__x')) { closePop(true); return; }
      const qv = e.target.closest('[data-hs-qv]'); if (qv) { F.openQuickView(qv.dataset.hsQv, qv); return; }
      const b = e.target.closest('[data-hs]'); if (!b) return;
      if (popBtn === b) { closePop(); return; }
      closePop();
      const [i, j] = b.dataset.hs.split(':').map(Number), h = D.lookbook[i].hotspots[j], p = F.byId(h.pid);
      pop = document.createElement('div'); pop.className = 'hs-pop'; pop.setAttribute('role', 'group'); pop.setAttribute('aria-label', `${p.name} preview`);
      pop.style.left = h.x > 55 ? `calc(${h.x}% - 276px)` : `calc(${h.x}% + 22px)`; pop.style.top = `${Math.min(h.y, 62)}%`;
      pop.innerHTML = `<button type="button" class="hs-pop__x" aria-label="Close preview"><i data-lucide="x"></i></button><span class="media">${F.img(p.images[0], p.name, { eager: true, w: 152, h: 190 })}</span>
<div><b>${F.esc(p.name)}</b>${F.priceHtml(p)}<div class="hs-pop__actions"><a href="${F.productUrl(p)}">View product</a><button type="button" data-hs-qv="${p.id}">Choose size</button></div></div>`;
      b.closest('.look__fig').appendChild(pop); b.setAttribute('aria-expanded', 'true'); popBtn = b; F.icons(pop); F.watchImages(pop);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pop && !document.querySelector('.f-modal.is-open')) closePop(true); });

    /* Countdown to a locally configured deadline */
    const cd = document.getElementById('countdown'), end = new Date(D.drop.deadline).getTime();
    if (cd && Number.isFinite(end)) {
      const tick = () => {
        const ms = end - Date.now();
        if (ms <= 0) { cd.outerHTML = '<p class="mono" style="margin-bottom:24px">The drop window has closed. Remaining pieces are listed below.</p>'; clearInterval(timer); return; }
        const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
        [d, h, m, s].forEach((v, k) => { cd.children[k].querySelector('b').textContent = String(v).padStart(2, '0'); });
      };
      const timer = setInterval(tick, 1000); tick();
    } else if (cd) cd.remove();
  });
})();

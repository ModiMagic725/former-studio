/* Page initialisers for Shop, Collection and Search results. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data, page = document.body.dataset.page;
  if (!['shop', 'collection', 'search'].includes(page)) return;
  const img = (k, w) => D.images.img(k, w);

  document.addEventListener('DOMContentLoaded', () => {
    /* ---------------- SHOP ---------------- */
    if (page === 'shop') {
      F.initCatalog({
        base: () => D.products,
        interrupt: () => `<aside class="interrupt" aria-label="Editorial"><span class="media interrupt__img" style="display:block"><img src="${img('camp6', 1600)}" alt="Outside the Lines campaign photograph" loading="lazy" width="1600" height="900"></span>
<div class="interrupt__txt"><p class="mono">Editorial / Outside the Lines</p><div><h2 class="display">Dress outside<br>the lines</h2><p style="margin-top:10px">A shell over tailoring, a tee under wool. See how the season is worn.</p></div><a class="link-u" href="${F.url('pages/lookbook.html')}">Open the lookbook</a></div></aside>`
      });
    }

    /* ---------------- COLLECTION ---------------- */
    if (page === 'collection') {
      const slug = new URLSearchParams(location.search).get('c'), c = D.collections[slug];
      if (!c) {
        document.getElementById('colMain').hidden = true; const s = document.getElementById('colState'); s.hidden = false;
        document.title = 'Collection not found — FORME / STUDIO 09';
        s.innerHTML = `<section class="state"><p class="mono soft">Error / collection not found</p><h1 class="display">That collection<br>doesn't exist</h1><p class="soft">Try one of these instead.</p><div class="empty__cta">${['new-arrivals', 'women', 'men', 'sale'].map((k) => `<a class="fbtn fbtn--line" href="${F.url('pages/collection.html?c=' + k)}">${D.collections[k].title}</a>`).join('')}<a class="fbtn fbtn--ink" href="${F.url('pages/shop.html')}">Shop all</a></div></section>`;
        const f = document.getElementById('filtersWrap'); if (f) f.remove(); return;
      }
      document.title = `${c.title} — FORME / STUDIO 09`;
      const base = F.collectionProducts(slug);
      document.getElementById('cbTitle').textContent = c.title; document.getElementById('cbIntro').textContent = c.intro;
      document.getElementById('cbImg').innerHTML = F.img(c.img, `${c.title} campaign photograph`, { eager: true, w: 1600, h: 900, priority: true });
      const isAes = ['minimalist', 'street-uniform', 'after-hours', 'soft-structure'].includes(slug);
      document.getElementById('cbCrumbs').innerHTML = `<a href="${F.url('index.html')}">Home</a><span aria-hidden="true">/</span><a href="${F.url('pages/shop.html')}">${isAes ? 'Shop by aesthetic' : 'Collections'}</a><span aria-hidden="true">/</span><span aria-current="page">${F.esc(c.title)}</span>`;
      const cats = [...new Set(base.map((p) => p.category))];
      document.getElementById('cShort').innerHTML = cats.map((k) => `<a class="chip" href="${F.url('pages/collection.html?c=' + slug + '&cat=' + k)}">${D.categories[k]}</a>`).join('') + `<a class="chip" href="${F.url('pages/collection.html?c=' + slug)}">All</a>`;
      const FEAT = { women: 'camp4', men: 'camp6', unisex: 'camp8', 'new-arrivals': 'camp1', bestsellers: 'camp3', essentials: 'camp9', 'limited-edition': 'camp2', sale: 'camp10', minimalist: 'camp1', 'street-uniform': 'camp6', 'after-hours': 'camp2', 'soft-structure': 'camp3' };
      document.getElementById('csTag').textContent = `Edit / ${c.title}`; document.getElementById('csH').innerHTML = `The ${F.esc(c.title)}<br>edit`;
      document.getElementById('csTxt').textContent = `${c.intro} ${base.length} piece${base.length === 1 ? '' : 's'} in this edit.`;
      const ci = document.getElementById('csImg'); ci.src = img(FEAT[slug] || 'camp5', 1400); ci.alt = `${c.title} editorial photograph`;
      const lbi = slug === 'after-hours' ? 2 : slug === 'soft-structure' ? 1 : 0, lb = D.lookbook[lbi];
      document.getElementById('stlFig').innerHTML = `<span class="media" style="position:absolute;inset:0">${F.img(lb.img, `${lb.title} campaign photograph`, { w: 1600, h: 1000 })}</span>${lb.hotspots.map((h) => `<button type="button" class="hs" style="left:${h.x}%;top:${h.y}%" data-qvspot="${h.pid}" aria-haspopup="dialog" aria-label="Shop the look: ${F.esc(F.byId(h.pid).name)}"><span></span></button>`).join('')}`;
      document.addEventListener('click', (e) => { const b = e.target.closest('[data-qvspot]'); if (b) F.openQuickView(b.dataset.qvspot, b); });
      document.getElementById('xlinks').innerHTML = ['new-arrivals', 'women', 'men', 'unisex', 'bestsellers', 'limited-edition', 'sale', 'minimalist'].filter((k) => k !== slug).slice(0, 4).map((k) => `<a href="${F.url('pages/collection.html?c=' + k)}"><span>${D.collections[k].title}</span><span aria-hidden="true">→</span></a>`).join('');
      F.icons(); F.watchImages();
      F.initCatalog({ base: () => base, keep: () => ({ c: slug }), emptyBase: () => `<p class="mono soft">Collection / empty</p><h2 class="display">Nothing here<br>yet</h2><p class="soft">There are no products in this collection right now.</p><div class="empty__cta"><a class="fbtn fbtn--ink" href="${F.url('pages/shop.html')}">Shop all products</a></div>` });
    }

    /* ---------------- SEARCH ---------------- */
    if (page === 'search') {
      const $ = (id) => document.getElementById(id), qs = new URLSearchParams(location.search).get('q') || '';
      $('sPageIn').value = qs;
      const chips = (arr) => arr.map((t) => `<a class="chip" href="${F.searchUrl(t)}">${F.esc(t)}</a>`).join('');
      $('sTrend').innerHTML = chips(D.trending);
      let ctl;
      const sync = (st) => {
        const q = st.q, has = !!q;
        $('sIdle').hidden = has; $('sCatalog').hidden = !has;
        $('sTitle').innerHTML = has ? `Results for<br>“${F.esc(q)}”` : 'Search';
        document.title = has ? `“${q}” — Search — FORME / STUDIO 09` : 'Search — FORME / STUDIO 09';
        if (has) F.recentSearches.add(q);
      };
      ctl = F.initCatalog({
        base: (st) => (st.q ? F.searchProducts(st.q) : []), keep: () => ({}),
        emptyBase: () => { const q = ctl ? ctl.state().q : qs; return `<p class="mono soft">0 results</p><h2 class="display">No results for<br>“${F.esc(q)}”</h2><p class="soft">Check the spelling, or try one of these.</p><div>${chips(D.trending)}</div><div class="empty__cta"><a class="fbtn fbtn--ink" href="${F.url('pages/shop.html')}">Browse all products</a></div>`; },
        onRender: (list, st) => sync(st)
      });
      sync(ctl.state());
      $('sPageForm').addEventListener('submit', (e) => { e.preventDefault(); const v = $('sPageIn').value.trim(); if (!v) { $('sPageIn').focus(); return; } ctl.set({ q: v }); });
    }
  });
})();

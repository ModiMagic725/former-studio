/* Search: local dataset matching + overlay with keyboard navigation + recent/trending. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data, RKEY = 'recent-searches';

  const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, ' ');
  const stem = (t) => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t);
  /* Everyday colour words that map to our palette names */
  const ALIAS = { ink: 'black', bone: 'off-white cream ivory', white: 'white', steel: 'grey gray', 'heather grey': 'grey gray', charcoal: 'dark grey gray', lime: 'neon green yellow', indigo: 'blue navy', 'washed blue': 'blue', cobalt: 'blue', sand: 'beige khaki', olive: 'green khaki', camel: 'brown', tan: 'brown', silver: 'metal chrome' };
  const hay = (p) => norm([p.name, p.colors.map((c) => ALIAS[c.name.toLowerCase()] || '').join(' '), D.categories[p.category], p.category, p.gender, p.colors.map((c) => c.name).join(' '), p.tags.join(' '), p.collection.replace(/-/g, ' '), p.aesthetic.replace(/-/g, ' '), p.labels.join(' '), p.material].join(' '));
  const index = D.products.map((p) => ({ p, h: hay(p), n: norm(p.name) }));

  F.searchProducts = (query) => {
    const toks = norm(query).split(/\s+/).filter(Boolean).map(stem);
    if (!toks.length) return [];
    return index.map(({ p, h, n }) => {
      let score = 0;
      for (const t of toks) { if (!h.includes(t)) return null; score += n.includes(t) ? 3 : 1; if (n.startsWith(t)) score += 2; }
      return { p, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).map((x) => x.p);
  };
  F.searchCategories = (query) => {
    const t = stem(norm(query).trim());
    return t ? Object.entries(D.categories).filter(([k, v]) => norm(v).includes(t) || k.includes(t)) : [];
  };
  F.recentSearches = {
    get: () => { const v = F.storage.get(RKEY, []); return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 6) : []; },
    add(q) { q = q.trim(); if (!q) return; F.storage.set(RKEY, [q, ...this.get().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6)); },
    clear() { F.storage.remove(RKEY); }
  };
  F.searchUrl = (q) => F.url('pages/search.html?q=' + encodeURIComponent(q));

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('search'); if (!root) return;
    const input = root.querySelector('#searchInput'), list = root.querySelector('#searchList'), empty = root.querySelector('#searchEmpty');
    const clearBtn = root.querySelector('[data-search-clear]'), form = root.querySelector('#searchForm');
    let active = -1, opener = null;

    const chips = (arr) => arr.map((t) => `<a class="chip" href="${F.searchUrl(t)}" data-chip="${F.esc(t)}">${F.esc(t)}</a>`).join('');
    function renderIdle() {
      const r = F.recentSearches.get();
      root.querySelector('#searchRecentWrap').hidden = !r.length;
      root.querySelector('#searchRecent').innerHTML = chips(r) + (r.length ? '<button type="button" class="chip" data-clear-recent>Clear</button>' : '');
      root.querySelector('#searchTrending').innerHTML = chips(D.trending);
      list.innerHTML = ''; empty.hidden = true; setActive(-1);
      list.innerHTML = D.products.filter((p) => p.labels.includes('bestseller')).slice(0, 4).map((p, i) => opt(p, i)).join('');
      F.watchImages(list);
    }
    const opt = (p, i) => `<a class="suggest__item" role="option" id="sug-${i}" aria-selected="false" href="${F.productUrl(p)}" data-q><span class="media">${F.img(p.images[0], '', { w: 112, h: 140 })}</span><span><b>${F.esc(p.name)}</b><span>${F.money(p.price)} · ${F.esc(D.categories[p.category])}</span></span></a>`;
    function setActive(i) {
      const opts = [...list.querySelectorAll('[role=option]')];
      active = opts.length ? (i + opts.length) % opts.length : -1; if (i === -1) active = -1;
      opts.forEach((o, j) => o.setAttribute('aria-selected', j === active));
      if (active >= 0) { input.setAttribute('aria-activedescendant', opts[active].id); opts[active].scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
    }
    function update() {
      const q = input.value.trim(); clearBtn.hidden = !input.value;
      if (!q) { renderIdle(); input.setAttribute('aria-expanded', 'false'); return; }
      const prods = F.searchProducts(q), cats = F.searchCategories(q);
      input.setAttribute('aria-expanded', 'true');
      if (!prods.length && !cats.length) {
        list.innerHTML = '';
        empty.hidden = false;
        empty.innerHTML = `<h3 style="font-size:var(--fs-md)">No results for “${F.esc(q)}”</h3><p class="soft" style="margin:6px 0 14px">Check the spelling, or try one of these.</p>${chips(D.trending)}<p style="margin-top:12px"><a class="link-u" href="${F.url('pages/shop.html')}">Browse everything</a></p>`;
        setActive(-1); return;
      }
      empty.hidden = true;
      let i = 0, html = cats.slice(0, 2).map(([k, v]) => `<a class="suggest__item" role="option" id="sug-${i++}" aria-selected="false" href="${F.url('pages/shop.html?cat=' + k)}"><span class="media" style="background:var(--lime)"></span><span><b>${F.esc(v)}</b><span>Browse category</span></span></a>`).join('');
      html += prods.slice(0, 6).map((p) => opt(p, i++)).join('');
      html += `<a class="suggest__item" role="option" id="sug-${i}" aria-selected="false" href="${F.searchUrl(q)}"><span class="media" style="background:var(--ink)"></span><span><b>See all ${prods.length} result${prods.length === 1 ? '' : 's'}</b><span>for “${F.esc(q)}”</span></span></a>`;
      list.innerHTML = html; F.watchImages(list); setActive(-1);
    }
    const open = (trigger) => { opener = trigger; input.value = ''; renderIdle(); F.overlay.open(root, { returnTo: trigger, focus: '#searchInput' }); };
    F.openSearch = open;
    document.addEventListener('click', (e) => { const b = e.target.closest('[data-open-search]'); if (b) open(b); });
    input.addEventListener('input', F.debounce(update, 120));
    input.addEventListener('keydown', (e) => {
      const n = list.querySelectorAll('[role=option]').length;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active <= 0 ? n - 1 : active - 1); }
      else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); F.recentSearches.add(input.value); list.querySelectorAll('[role=option]')[active].click(); }
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); const q = input.value.trim(); if (!q) { input.focus(); return; } F.recentSearches.add(q); location.href = F.searchUrl(q); });
    clearBtn.addEventListener('click', () => { input.value = ''; update(); input.focus(); });
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-clear-recent]')) { F.recentSearches.clear(); renderIdle(); return; }
      const c = e.target.closest('[data-chip]'); if (c) F.recentSearches.add(c.dataset.chip);
      const a = e.target.closest('[data-q]'); if (a && input.value.trim()) F.recentSearches.add(input.value);
    });
  });
})();

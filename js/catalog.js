/* Catalog engine shared by Shop, Collection and Search pages.
   State lives in the URL (shareable); all filtering/sorting runs on the local dataset. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data;
  const SORTS = { featured: 'Featured', newest: 'Newest', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low' };
  const GENDERS = { women: 'Women', men: 'Men', unisex: 'Unisex' };
  const COLLS = { 'outside-the-lines': 'Outside the Lines', essentials: 'Essentials', 'soft-structure': 'Soft Structure', 'after-hours': 'After Hours' };
  const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'One size'];
  const PER_PAGE = 12;

  /* ---------- State <-> URL ---------- */
  function parse(search) {
    const q = new URLSearchParams(search);
    const list = (k, ok) => (q.get(k) || '').split(',').map((s) => s.trim()).filter((s) => s && (!ok || ok(s)));
    const num = (k) => { const v = parseFloat(q.get(k)); return Number.isFinite(v) && v >= 0 ? v : null; };
    return {
      cat: list('cat', (s) => D.categories[s]), gender: list('gender', (s) => GENDERS[s]), size: list('size'), color: list('color'),
      collection: list('collection', (s) => COLLS[s]), min: num('min'), max: num('max'), avail: q.get('avail') === '1', sale: q.get('sale') === '1',
      sort: SORTS[q.get('sort')] ? q.get('sort') : 'featured', view: ['2', '3', '4'].includes(q.get('view')) ? q.get('view') : '3', q: (q.get('q') || '').trim()
    };
  }
  function serialize(st, keep) {
    const q = new URLSearchParams();
    Object.entries(keep || {}).forEach(([k, v]) => v && q.set(k, v));
    if (st.q) q.set('q', st.q);
    ['cat', 'gender', 'size', 'color', 'collection'].forEach((k) => st[k].length && q.set(k, st[k].join(',')));
    if (st.min != null) q.set('min', st.min); if (st.max != null) q.set('max', st.max);
    if (st.avail) q.set('avail', '1'); if (st.sale) q.set('sale', '1');
    if (st.sort !== 'featured') q.set('sort', st.sort); if (st.view !== '3') q.set('view', st.view);
    const s = q.toString(); return s ? '?' + s : '';
  }
  const activeCount = (st) => st.cat.length + st.gender.length + st.size.length + st.color.length + st.collection.length + (st.min != null || st.max != null ? 1 : 0) + (st.avail ? 1 : 0) + (st.sale ? 1 : 0);

  function matches(p, st, skip) {
    if (skip !== 'cat' && st.cat.length && !st.cat.includes(p.category)) return false;
    if (skip !== 'gender' && st.gender.length && !st.gender.some((g) => p.gender === g || (g !== 'unisex' && p.gender === 'unisex'))) return false;
    if (skip !== 'size' && st.size.length && !st.size.some((s) => p.sizes.includes(s) && !p.soldOutSizes.includes(s) && p.stock > 0)) return false;
    if (skip !== 'color' && st.color.length && !st.color.some((c) => p.colors.some((x) => x.name.toLowerCase() === c.toLowerCase()))) return false;
    if (skip !== 'collection' && st.collection.length && !st.collection.includes(p.collection)) return false;
    if (skip !== 'price') { if (st.min != null && p.price < st.min) return false; if (st.max != null && p.price > st.max) return false; }
    if (skip !== 'avail' && st.avail && F.isSold(p)) return false;
    if (skip !== 'sale' && st.sale && !F.isSale(p)) return false;
    return true;
  }
  function sortList(list, sort, relevance) {
    const a = list.slice();
    if (sort === 'price-asc') a.sort((x, y) => x.price - y.price);
    else if (sort === 'price-desc') a.sort((x, y) => y.price - x.price);
    else if (sort === 'newest') a.sort((x, y) => (y.labels.includes('new') - x.labels.includes('new')) || y.id.localeCompare(x.id));
    else if (!relevance) a.sort((x, y) => (y.labels.includes('bestseller') - x.labels.includes('bestseller')) || x.id.localeCompare(y.id));
    return a;
  }
  F.collectionProducts = (slug) => {
    const c = D.collections[slug]; if (!c) return [];
    const r = c.rule;
    return D.products.filter((p) => (!r.gender || r.gender.includes(p.gender)) && (!r.label || p.labels.includes(r.label)) && (!r.collection || p.collection === r.collection) && (!r.aesthetic || p.aesthetic === r.aesthetic) && (!r.sale || F.isSale(p)));
  };
  F.catalogUtil = { parse, serialize, matches, sortList };

  /* ---------- Component ---------- */
  F.initCatalog = function (o) {
    const $ = (id) => document.getElementById(id);
    const grid = $('catGrid'), more = $('catMore'), empty = $('catEmpty'), chips = $('activeChips'), live = $('catLive'), form = $('filtersForm'), wrap = $('filtersWrap'), sortSel = $('sortSelect');
    let st = parse(location.search), shown = PER_PAGE, base = o.base(st), loaded = false;
    if (o.q != null && !st.q) st.q = o.q;

    /* Filter panel */
    const sizes = [...new Set(D.products.flatMap((p) => p.sizes))].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
    const colors = [...new Map(D.products.flatMap((p) => p.colors).map((c) => [c.name.toLowerCase(), c])).values()];
    const checkbox = (name, val, label, extra = '') => `<label class="fcheck"><input type="checkbox" name="${name}" value="${F.esc(val)}" data-facet="${name}"><span class="fcheck__box" aria-hidden="true"></span><span class="fcheck__label">${F.esc(label)}</span><span class="fcheck__n mono" data-count></span></label>${extra}`;
    const group = (title, body, open = true) => `<details class="fgroup"${open ? ' open' : ''}><summary><span>${title}</span><i aria-hidden="true"></i></summary><div class="fgroup__body">${body}</div></details>`;
    form.innerHTML =
      group('Category', Object.entries(D.categories).map(([k, v]) => checkbox('cat', k, v)).join('')) +
      group('For', Object.entries(GENDERS).map(([k, v]) => checkbox('gender', k, v)).join('') + '<p class="fnote">Women and Men include unisex pieces.</p>') +
      group('Size', `<div class="fchips">${sizes.map((s) => `<label class="fchip"><input type="checkbox" name="size" value="${F.esc(s)}" data-facet="size"><span>${F.esc(s)}</span></label>`).join('')}</div>`) +
      group('Colour', `<div class="fswatches">${colors.map((c) => `<label class="fsw" title="${F.esc(c.name)}"><input type="checkbox" name="color" value="${F.esc(c.name)}" data-facet="color"><span class="fsw__dot" style="background:${c.hex}"></span><span class="vh">${F.esc(c.name)}</span></label>`).join('')}</div>`) +
      group('Price (₹)', `<div class="fprice"><label><span class="vh">Minimum price</span><input type="number" inputmode="numeric" min="0" step="100" name="min" placeholder="Min"></label><span aria-hidden="true">–</span><label><span class="vh">Maximum price</span><input type="number" inputmode="numeric" min="0" step="100" name="max" placeholder="Max"></label></div><p class="fnote" id="priceErr" role="alert"></p>`) +
      group('Collection', Object.entries(COLLS).map(([k, v]) => checkbox('collection', k, v)).join('')) +
      group('Availability', checkbox('avail', '1', 'In stock only') + checkbox('sale', '1', 'Sale only'));
    form.querySelectorAll('[name=avail],[name=sale]').forEach((i) => i.removeAttribute('data-facet'));
    sortSel.innerHTML = Object.entries(SORTS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');

    function syncForm() {
      form.querySelectorAll('input[type=checkbox]').forEach((i) => {
        const n = i.name; i.checked = n === 'avail' ? st.avail : n === 'sale' ? st.sale : st[n].some((v) => v.toLowerCase() === i.value.toLowerCase());
      });
      form.elements.min.value = st.min != null ? st.min : ''; form.elements.max.value = st.max != null ? st.max : '';
      sortSel.value = st.sort; grid.dataset.cols = st.view;
      document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === st.view));
    }
    function readForm() {
      const get = (n) => [...form.querySelectorAll(`input[name=${n}]:checked`)].map((i) => i.value);
      st.cat = get('cat'); st.gender = get('gender'); st.size = get('size'); st.color = get('color'); st.collection = get('collection');
      st.avail = form.elements.avail.checked; st.sale = form.elements.sale.checked;
      const mn = parseFloat(form.elements.min.value), mx = parseFloat(form.elements.max.value);
      st.min = Number.isFinite(mn) && mn >= 0 ? mn : null; st.max = Number.isFinite(mx) && mx >= 0 ? mx : null;
      const err = $('priceErr'); err.textContent = '';
      if (st.min != null && st.max != null && st.min > st.max) { err.textContent = 'Minimum price is higher than maximum.'; st.min = st.max = null; }
    }

    function counts() {
      const b = o.base(st);
      form.querySelectorAll('[data-facet]').forEach((i) => {
        const key = i.dataset.facet, val = i.value;
        const probe = Object.assign({}, st, { [key]: [val] });
        const n = b.filter((p) => matches(p, probe, null)).length;
        const lab = i.closest('label'), c = lab.querySelector('[data-count]');
        if (c) c.textContent = n;
        const dead = n === 0 && !i.checked; i.disabled = dead; lab.classList.toggle('is-dead', dead);
      });
    }

    function chipsHtml() {
      const out = [];
      const add = (k, v, label) => out.push(`<button type="button" class="chip-x" data-remove="${k}" data-val="${F.esc(v)}" aria-label="Remove filter: ${F.esc(label)}">${F.esc(label)}<i data-lucide="x" aria-hidden="true"></i></button>`);
      st.cat.forEach((v) => add('cat', v, D.categories[v])); st.gender.forEach((v) => add('gender', v, GENDERS[v])); st.size.forEach((v) => add('size', v, 'Size ' + v));
      st.color.forEach((v) => add('color', v, v)); st.collection.forEach((v) => add('collection', v, COLLS[v]));
      if (st.min != null || st.max != null) add('price', '', `₹${st.min != null ? st.min.toLocaleString('en-IN') : '0'} – ${st.max != null ? '₹' + st.max.toLocaleString('en-IN') : 'any'}`);
      if (st.avail) add('avail', '', 'In stock'); if (st.sale) add('sale', '', 'Sale');
      return out.join('') + (out.length ? '<button type="button" class="chip-clear" data-clear>Clear all</button>' : '');
    }

    function skeleton() { grid.innerHTML = Array.from({ length: 8 }, () => '<li class="skel"><div class="skel__img"></div><div class="skel__l"></div><div class="skel__l skel__l--s"></div></li>').join(''); grid.setAttribute('aria-busy', 'true'); }

    function render(opts = {}) {
      base = o.base(st);
      const list = sortList(base.filter((p) => matches(p, st, null)), st.sort, !!st.q && st.sort === 'featured');
      const n = activeCount(st);
      $('catCount').textContent = list.length; if ($('catTotal')) $('catTotal').textContent = base.length;
      live.textContent = `${list.length} product${list.length === 1 ? '' : 's'}${n ? ', ' + n + ' filter' + (n === 1 ? '' : 's') + ' applied' : ''}`;
      document.querySelectorAll('[data-filter-count]').forEach((b) => { b.textContent = n; b.hidden = !n; });
      chips.innerHTML = chipsHtml(); chips.hidden = !n; F.icons(chips);
      grid.removeAttribute('aria-busy');
      const slice = list.slice(0, shown);
      const items = slice.map((p) => `<li class="cgrid__item">${F.productCard(p)}</li>`);
      if (o.interrupt && slice.length > 6 && !n) items.splice(6, 0, `<li class="cgrid__edit">${o.interrupt()}</li>`);
      grid.innerHTML = items.join(''); F.icons(grid); F.watchImages(grid);
      if (opts.focusIndex != null) { const a = grid.querySelectorAll('.pcard__link')[opts.focusIndex]; if (a) a.focus({ preventScroll: false }); }
      const left = list.length - slice.length;
      more.hidden = left <= 0;
      more.innerHTML = left > 0 ? `<p class="mono" aria-hidden="true">Showing ${slice.length} of ${list.length}</p><div class="more__bar" aria-hidden="true"><span style="width:${(slice.length / list.length) * 100}%"></span></div><button type="button" class="fbtn fbtn--line" data-more>Load ${Math.min(PER_PAGE, left)} more</button>` : '';
      const none = list.length === 0; empty.hidden = !none; grid.hidden = none;
      if (none) empty.innerHTML = base.length === 0 && o.emptyBase ? o.emptyBase() : `<p class="mono soft">0 results</p><h2 class="display">Nothing matches</h2><p class="soft">Try removing a filter or widening the price range.</p><div class="empty__cta">${n ? '<button type="button" class="fbtn fbtn--ink" data-clear>Reset filters</button>' : ''}<a class="fbtn fbtn--line" href="${F.url('pages/shop.html')}">Browse all products</a></div>`;
      if (o.onRender) o.onRender(list, st);
      counts();
      if (window.ScrollTrigger && loaded) window.ScrollTrigger.refresh();
    }

    function commit(push = true) {
      const url = location.pathname + serialize(st, o.keep && o.keep());
      if (url !== location.pathname + location.search) history[push ? 'pushState' : 'replaceState'](null, '', url);
      shown = PER_PAGE; render();
    }

    form.addEventListener('change', (e) => { if (e.target.name === 'min' || e.target.name === 'max') return; readForm(); commit(); });
    form.addEventListener('input', F.debounce((e) => { if (e.target.name === 'min' || e.target.name === 'max') { readForm(); commit(false); } }, 350));
    form.addEventListener('submit', (e) => e.preventDefault());
    sortSel.addEventListener('change', () => { st.sort = sortSel.value; commit(); });
    document.addEventListener('click', (e) => {
      const v = e.target.closest('[data-view]'); if (v) { st.view = v.dataset.view; grid.dataset.cols = st.view; syncForm(); history.replaceState(null, '', location.pathname + serialize(st, o.keep && o.keep())); return; }
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        const k = rm.dataset.remove, val = rm.dataset.val;
        if (k === 'price') st.min = st.max = null; else if (k === 'avail' || k === 'sale') st[k] = false; else st[k] = st[k].filter((x) => x.toLowerCase() !== val.toLowerCase());
        syncForm(); commit(); return;
      }
      if (e.target.closest('[data-clear]')) { Object.assign(st, { cat: [], gender: [], size: [], color: [], collection: [], min: null, max: null, avail: false, sale: false }); syncForm(); commit(); F.toast('Filters cleared'); return; }
      if (e.target.closest('[data-more]')) { const prev = shown; shown += PER_PAGE; render({ focusIndex: prev }); return; }
      if (e.target.closest('[data-filters-open]')) { wrap.hidden = false; F.overlay.open(wrap, { returnTo: e.target.closest('[data-filters-open]'), focus: '#filtersForm summary' }); return; }
      if (e.target.closest('[data-filters-apply]')) F.overlay.close(wrap);
    });
    wrap.addEventListener('click', (e) => { if (e.target === wrap) F.overlay.close(wrap); });
    window.addEventListener('popstate', () => { st = parse(location.search); if (o.q != null && !st.q) st.q = o.q; syncForm(); shown = PER_PAGE; render(); });
    F.on('cart', () => { /* sold-out state can change nothing here; kept for symmetry */ });

    syncForm();
    /* Simulated loading state (first paint only, kept short so shopping is never delayed) */
    skeleton(); empty.hidden = true; more.hidden = true;
    setTimeout(() => { loaded = true; render(); if (o.onReady) o.onReady(); }, F.reducedMotion() ? 0 : 380);
    return { state: () => st, render, set(patch) { Object.assign(st, patch); shown = PER_PAGE; syncForm(); commit(); } };
  };
})();

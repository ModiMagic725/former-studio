/* Journal landing (magazine cover + filterable grid) and article template. */
(function () {
  'use strict';
  const F = window.FORME, D = F.data, page = document.body.dataset.page;
  if (page !== 'journal' && page !== 'article') return;
  const CATS = ['Fashion', 'Styling', 'Materials', 'Culture', 'Behind the Scenes'];
  const ARTS = D.journal.slice().sort((a, b) => b.date.localeCompare(a.date));
  const href = (j) => F.url('pages/article.html?slug=' + j.slug);
  const meta = (j) => `<span>${F.esc(j.category)}</span><span>${F.fmtDate(j.date)}</span><span>${j.read} min read</span>`;

  /* ---------------- Journal landing ---------------- */
  if (page === 'journal') document.addEventListener('DOMContentLoaded', () => {
    const lead = ARTS[0], $ = (id) => document.getElementById(id);
    $('jCover').innerHTML = `<div class="cover__mast"><h1 class="display">The Forme<br>Journal</h1><p class="mono">Issue 09 / October 2026<br>Fashion, materials, culture</p></div>
<div class="cover__main"><a class="cover__lead" href="${href(lead)}"><span class="media cover__img">${F.img(lead.img, lead.title, { eager: true, w: 1400, h: 1750, priority: true })}</span><span class="cover__title display">${F.esc(lead.title)}</span><span class="cover__tag mono">${F.esc(lead.category)} / ${lead.read} min</span></a>
<aside class="cover__lines" aria-label="In this issue"><p class="mono">In this issue</p><ol>${ARTS.slice(1).map((j, i) => `<li><a href="${href(j)}"><span class="mono">0${i + 2}</span><span>${F.esc(j.title)}</span><i class="mono">${F.esc(j.category)}</i></a></li>`).join('')}</ol></aside></div>`;
    F.watchImages($('jCover'));
    $('jCats').innerHTML = ['All', ...CATS].map((c, i) => `<button type="button" class="jcat" data-cat="${c}" aria-pressed="${i === 0}">${c}<sup class="mono">${c === 'All' ? ARTS.length : ARTS.filter((a) => a.category === c).length}</sup></button>`).join('');
    const PAT = [[7, '3 / 2'], [5, '4 / 5'], [4, '4 / 5'], [4, '4 / 5'], [4, '4 / 5'], [5, '4 / 5'], [7, '3 / 2']];
    let cat = 'All', q = '', shown = 4;
    function render() {
      const filtering = cat !== 'All' || q;
      let list = ARTS.filter((a) => (cat === 'All' || a.category === cat) && (!q || (a.title + ' ' + a.excerpt + ' ' + a.category).toLowerCase().includes(q)));
      if (!filtering) list = list.filter((a) => a !== lead);
      const slice = list.slice(0, shown);
      $('jGrid').innerHTML = slice.map((j, i) => { const [span, ar] = PAT[i % PAT.length]; return `<article class="jitem jitem--${span}"><a href="${href(j)}"><span class="media" style="display:block;aspect-ratio:${ar}">${F.img(j.img, '', { w: 1000, h: 1250 })}</span><span class="jitem__meta mono">${meta(j)}</span><h2 class="jitem__t">${F.esc(j.title)}</h2><p class="jitem__x">${F.esc(j.excerpt)}</p></a></article>`; }).join('');
      F.watchImages($('jGrid'));
      $('jEmpty').hidden = list.length > 0; $('jGrid').hidden = !list.length;
      $('jMore').hidden = list.length <= slice.length; $('jMore').textContent = `Load ${Math.min(4, list.length - slice.length)} more`;
      $('jLive').textContent = `${list.length} article${list.length === 1 ? '' : 's'}`;
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }
    $('jCats').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; cat = b.dataset.cat; shown = 4; $('jCats').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b)); render(); });
    $('jSearch').addEventListener('input', F.debounce((e) => { q = e.target.value.trim().toLowerCase(); shown = 4; render(); }, 150));
    $('jMore').addEventListener('click', () => { const prev = shown; shown += 4; render(); const a = $('jGrid').querySelectorAll('article a')[prev]; if (a) a.focus(); });
    $('jReset').addEventListener('click', () => { cat = 'All'; q = ''; $('jSearch').value = ''; shown = 4; $('jCats').querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-pressed', i === 0)); render(); });
    render();
  });

  /* ---------------- Article ---------------- */
  if (page === 'article') document.addEventListener('DOMContentLoaded', () => {
    const slug = new URLSearchParams(location.search).get('slug'), j = D.journal.find((x) => x.slug === slug), body = window.FORME_ARTICLES[slug], root = document.getElementById('artRoot');
    if (!j || !body) {
      document.title = 'Article not found — FORME / STUDIO 09';
      document.getElementById('crumbs').innerHTML = `<a href="${F.url('index.html')}">Home</a><span aria-hidden="true">/</span><a href="${F.url('pages/journal.html')}">Journal</a><span aria-hidden="true">/</span><span aria-current="page">Not found</span>`;
      root.innerHTML = `<section class="state wrap"><p class="mono soft">Error / article not found</p><h1 class="display">We can't find<br>that story</h1><p class="soft">The link may be old. Here is everything we have published.</p><div class="empty__cta"><a class="fbtn fbtn--ink" href="${F.url('pages/journal.html')}">Back to the journal</a></div></section>`; return;
    }
    document.title = `${j.title} — FORME Journal`;
    document.getElementById('crumbs').innerHTML = `<a href="${F.url('index.html')}">Home</a><span aria-hidden="true">/</span><a href="${F.url('pages/journal.html')}">Journal</a><span aria-hidden="true">/</span><a href="${F.url('pages/journal.html')}">${F.esc(j.category)}</a><span aria-hidden="true">/</span><span aria-current="page">${F.esc(j.title)}</span>`;
    const img = (k, w) => D.images.img(k, w);
    const blocks = body.blocks.map((b) => {
      if (b.t === 'h') return `<h2 class="art__h">${F.esc(b.x)}</h2>`;
      if (b.t === 'p') return `<p>${F.esc(b.x)}</p>`;
      if (b.t === 'q') return `<blockquote class="art__q"><p class="display">${F.esc(b.x)}</p><cite class="mono">${F.esc(b.by)}</cite></blockquote>`;
      if (b.t === 'img') return `<figure class="art__fig art__fig--${b.ratio}"><span class="media" data-clip>${F.img(img(b.k, 1600), b.cap, { w: 1600, h: b.ratio === 'tall' ? 2000 : 1000 })}</span><figcaption class="mono">${F.esc(b.cap)}</figcaption></figure>`;
      if (b.t === 'gal') return `<div class="art__gal">${b.items.map((g) => `<figure><span class="media" data-clip>${F.img(img(g.k, 1000), g.cap, { w: 1000, h: 1250 })}</span><figcaption class="mono">${F.esc(g.cap)}</figcaption></figure>`).join('')}</div>`;
      return '';
    }).join('');
    const prods = (body.products || []).map(F.byId).filter(Boolean);
    const others = [...ARTS.filter((a) => a !== j && a.category === j.category), ...ARTS.filter((a) => a !== j && a.category !== j.category)].slice(0, 3);
    const url = location.href.split('#')[0], enc = encodeURIComponent;
    root.innerHTML = `<div class="read-prog" id="readProg" aria-hidden="true"></div>
<header class="art__head wrap"><p class="mono art__meta">${meta(j)}</p><h1 class="art__title display">${F.esc(j.title)}</h1><p class="mono soft">${F.esc(body.byline)}</p></header>
<figure class="art__hero"><span class="media" data-clip>${F.img(j.img, j.title, { eager: true, w: 1800, h: 900, priority: true })}</span></figure>
<div class="art__wrap"><p class="art__intro">${F.esc(body.intro)}</p><div class="art__body">${blocks}</div>
  <div class="art__share"><span class="mono">Share</span><a href="https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(j.title)}" target="_blank" rel="noopener">X</a><a href="https://wa.me/?text=${enc(j.title + ' ' + url)}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:?subject=${enc(j.title)}&body=${enc(url)}">Email</a><button type="button" id="copyLink">Copy link</button></div></div>
${prods.length ? `<section class="wrap section" aria-labelledby="wearH"><div class="sec-head"><h2 class="display" id="wearH">Wear it<br>with</h2><p>Pieces mentioned in this story.</p></div><ul class="cgrid" data-cols="4">${prods.map((p) => `<li class="cgrid__item">${F.productCard(p)}</li>`).join('')}</ul></section>` : ''}
<section class="wrap section" style="padding-top:0" aria-labelledby="moreH"><div class="sec-head"><h2 class="display" id="moreH">Keep<br>reading</h2><a class="link-u" href="${F.url('pages/journal.html')}">← Back to the journal</a></div><div class="jgrid">${others.map((o) => `<a class="jcard" href="${href(o)}"><span class="media" style="display:block">${F.img(o.img, '', { w: 900, h: 1100 })}</span><div class="jcard__meta mono"><span>${F.esc(o.category)}</span><span>${o.read} min</span></div><h3>${F.esc(o.title)}</h3></a>`).join('')}</div></section>`;
    F.icons(root); F.watchImages(root);
    const prog = document.getElementById('readProg');
    const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
    window.addEventListener('scroll', upd, { passive: true }); upd();
    document.getElementById('copyLink').addEventListener('click', async (e) => {
      try { await navigator.clipboard.writeText(url); e.target.textContent = 'Copied'; F.toast('Link copied'); } catch (err) { F.toast('Copy is not available here. Use the address bar.', { type: 'error' }); }
      setTimeout(() => (e.target.textContent = 'Copy link'), 1800);
    });
  });
})();

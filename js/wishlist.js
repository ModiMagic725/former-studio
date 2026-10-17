/* Wishlist: persisted list of product IDs. */
(function () {
  'use strict';
  const F = window.FORME, KEY = 'wishlist-v1';
  const load = () => { const v = F.storage.get(KEY, []); return Array.isArray(v) ? [...new Set(v.filter((id) => typeof id === 'string' && F.byId(id)))] : []; };
  let ids = load();
  const save = () => { F.storage.set(KEY, ids); F.emit('wishlist', ids); };
  const W = F.wishlist = {
    list: () => ids.slice(),
    has: (id) => ids.includes(id),
    toggle(id) { const on = !W.has(id); ids = on ? [...ids, id] : ids.filter((x) => x !== id); save(); return on; },
    remove(id) { ids = ids.filter((x) => x !== id); save(); }
  };
  F.on('wishlist', () => {
    document.querySelectorAll('[data-wishlist-count]').forEach((b) => { b.dataset.n = ids.length; b.textContent = ids.length; });
    document.querySelectorAll('[data-wish]').forEach((b) => {
      const on = W.has(b.dataset.wish), p = F.byId(b.dataset.wish);
      b.setAttribute('aria-pressed', on);
      if (p) b.setAttribute('aria-label', `${on ? 'Remove' : 'Add'} ${p.name} ${on ? 'from' : 'to'} wishlist`);
    });
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-wish]'); if (!b) return;
    e.preventDefault();
    const p = F.byId(b.dataset.wish), on = W.toggle(b.dataset.wish);
    F.toast(on ? `Saved ${p.name} to your wishlist` : `Removed ${p.name} from your wishlist`, on ? { action: { label: 'View', fn: () => (location.href = F.url('pages/wishlist.html')) } } : {});
  });
  window.addEventListener('DOMContentLoaded', () => F.emit('wishlist', ids));
  window.addEventListener('storage', (e) => { if (e.key === 'forme:' + KEY) { ids = load(); F.emit('wishlist', ids); } });
})();

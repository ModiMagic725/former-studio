/* GSAP + ScrollTrigger animation system. Initial hidden states are applied only here (never in CSS),
   so if GSAP fails to load or throws, all content remains visible. */
(function () {
  'use strict';
  const F = window.FORME;
  const A = (F.anim = { ctx: null });

  function splitWords(el) {
    const text = el.textContent.trim(); el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="w" aria-hidden="true">${F.esc(w)}</span>`).join(' ');
    return el.querySelectorAll('.w');
  }

  A.init = function () {
    if (window.AOS) window.AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic', disable: () => F.reducedMotion() });
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    const mm = gsap.matchMedia(); A.ctx = mm;

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      try {
        /* Hero entrance */
        const hero = document.querySelector('.hero');
        if (hero) {
          const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
          tl.from('.hero__media', { clipPath: 'inset(0 0 100% 0)', duration: 1.3 }, 0)
            .from('.hero__title .ln > span', { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.25)
            .from('.hero__meta, .hero__stamp', { autoAlpha: 0, y: -14, duration: 0.7, stagger: 0.1 }, 0.7)
            .from('.hero__foot > *', { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.08 }, 0.9);
        }
        /* Section heads and generic rises */
        gsap.utils.toArray('[data-rise]').forEach((el) => gsap.from(el, { y: 44, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
        /* Image clip reveals */
        gsap.utils.toArray('[data-clip]').forEach((el) => gsap.from(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
        /* Stagger product grids */
        gsap.utils.toArray('[data-stagger]').forEach((grid) => {
          const cards = grid.querySelectorAll('.pcard'); if (!cards.length) return;
          gsap.set(cards, { autoAlpha: 0, y: 28 });
          ST.batch(cards, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', overwrite: true }) });
        });
        /* Manifesto word reveal tied to scroll */
        const mt = document.querySelector('[data-split]');
        if (mt) {
          const words = splitWords(mt);
          gsap.set(words, { opacity: 0.5 });
          gsap.to(words, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: mt, start: 'top 78%', end: 'bottom 52%', scrub: 0.4 } });
        }
        /* Footer wordmark reveal */
        const big = document.querySelector('.footer__big');
        if (big) gsap.from(big, { yPercent: 28, ease: 'none', scrollTrigger: { trigger: '#footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      } catch (err) {
        console.warn('Animation setup failed; showing static layout.', err);
        gsap.set('.hero__media,.hero__title .ln > span,.hero__meta,.hero__stamp,.hero__foot > *,[data-rise],[data-clip],.pcard,.manifesto__text .w', { clearProps: 'all' });
      }
      return () => { /* matchMedia reverts all tweens and triggers created above */ };
    });

    /* Parallax only on larger screens */
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const m = document.querySelector('.hero__media .media');
      if (m) gsap.fromTo(m, { yPercent: -4 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.utils.toArray('[data-parallax]').forEach((el) => gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    });

    const refresh = F.debounce(() => ST.refresh(), 200);
    window.addEventListener('load', () => ST.refresh());
    window.addEventListener('resize', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ST.refresh());
  };
  A.kill = function () { if (A.ctx) { A.ctx.revert(); A.ctx = null; } };
  document.addEventListener('DOMContentLoaded', () => setTimeout(A.init, 0));
})();

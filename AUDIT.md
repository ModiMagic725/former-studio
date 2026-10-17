# Audit report: FORME / STUDIO 09 (frontend only)

Tested in a real headless Chromium (Chrome 131) served locally. The sandbox could not reach the internet, so CDN libraries (same pinned versions) and fonts were served locally, and **all photographs were replaced with neutral stand-ins**. This verifies layout, logic and accessibility. It does NOT verify that the real Unsplash photos load, match the garments, or crop well.

## Issues found and fixed
- **Mobile header: the bag icon was pushed off-screen on every page at phone widths**, so the bag could not be opened. Fixed (account moved into the mobile menu, header grid reworked, fits at 320px).
- My first overflow checks were invalid (body `overflow-x: clip` hides overflow; mobile `innerWidth` expands). Rebuilt the detector, proved it catches an injected overflow, re-ran everything.
- Overflow at 320px: product-card rows, size-guide grid, collection cross-links. Fixed.
- Sticky "Add to bag" bar never appeared after a jump scroll (IntersectionObserver only fires on crossing). Replaced with a scroll check.
- Escape did not close the mega menu (focusout removed the dismiss class). Fixed.
- Trending search "Black jacket" returned zero results (palette says "Ink"). Added colour synonyms; every trending term now returns results.
- Product cards borrowed second photos from other products (fake "alternate views"). Every product now has its own distinct photos; hover swap only exists where a genuine second photo exists (15 products have one photo).
- Hero headline used a blend mode that could not guarantee contrast over photos. Replaced with solid ink type plus an ink block with lime text.
- Contrast: lime tag inheriting pale text, countdown labels, soft grey text, lime-filled numerals, manifesto start opacity. Fixed.
- Semantics: heading order (product names, footer, tiles), `aside role=dialog`, `div > button` inside `dl`, unreadable "/09" tag in mobile menu. Fixed.
- Missing quantity-limit message; sticky header covering focus/anchors (added scroll-padding). Fixed.

## Verified (all passing at the time of packaging)
- 152 automated interaction checks (4 scripts) with 0 failures.
- 24 page/URL variants x 5 widths (320, 375, 768, 1024, 1440): no console errors, no horizontal overflow.
- axe-core (WCAG 2 A/AA + best practice): 0 violations on 16 page types x 2 widths and on 32 interactive states. Two transient findings appeared only mid-animation and disappeared with motion off.
- Persistence across real page reloads (bag, wishlist, promo), no duplicate event handlers, AOS and GSAP never target the same element, reduced-motion disables pinning and entrance animation.

## Pages and interactions tested
All 16 page types plus deep links, empty/not-found states and sold-out products. Bag maths with all three promo codes, checkout validation and the demo confirmation (no payment fields exist, no false claims), filters/sort/URL state/browser back, quick add/view, lightbox, size guide, search overlay and keyboard navigation, focus traps and Escape on every overlay, lookbook pin/hotspots/drawer, forms.

## Remaining limitations
- **Photos are unverified.** Unsplash IDs were chosen blind; some may be broken or show the wrong item. Open `tools/image-check.html` and fix IDs in `js/products.js`. Broken images show a branded placeholder.
- No close-up fabric images exist, so none are shown. Hotspot positions on the lookbook are guesses until real photos are in place.
- Needs internet for CDN libraries, Google Fonts and photos. Without it the page degrades (no icons, carousels or animations; fallback fonts).
- Not tested: real phones, Safari/Firefox, screen readers, real network speed or Lighthouse scores.
- 404 page relative-path caveat (see README).
- Everything is a demo: no backend, accounts, payments, orders or emails. All policies and people are fictional sample content.

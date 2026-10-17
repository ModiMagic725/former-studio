# FORME / STUDIO 09 — frontend-only fashion store

A fictional premium fashion label built as a portfolio project. HTML5, CSS3, vanilla JavaScript, Bootstrap 5 (grid/utilities), GSAP + ScrollTrigger, Swiper, AOS and Lucide icons. No backend, no build step.

## Status

All 16 page types are built: Home, Shop, Collections (12), Product detail, Search, Bag, Checkout demo, Wishlist, Lookbook, Journal, Article (6), About, Size guide, Customer care, Shipping and returns, 404 and empty/error states. See `AUDIT.md` for what was tested and fixed.

## Run locally

Any static server works (opening `index.html` directly also works, but a server is recommended):

```
cd forme
python3 -m http.server 8000
# open http://localhost:8000
```

An internet connection is needed for the CDN libraries, Google Fonts and the Unsplash photos.

## Images — read this first

All image URLs are Unsplash photo IDs listed in one table (`I`) at the top of `js/products.js`. They were chosen without being able to load them in a browser, so **some may be broken or not match the garment**. Broken images show a branded fallback automatically (no layout break). To audit:

1. Serve the project and open `/tools/image-check.html`.
2. Broken IDs are marked red, with the products using them.
3. Replace the ID in the `I` table. Nothing else needs to change.

You can also point any entry at a local file (e.g. `assets/images/tee-1.jpg`) by changing the `U()` helper or the entry itself.

## Structure

```
index.html            Home page
pages/                All other pages
css/                  variables, base, layout, components, pages, animations, responsive
js/products.js        All data: products, collections, nav, journal, lookbook, promos, image IDs
js/app.js             Utilities, storage, overlay manager, toasts, product card renderer
js/cart.js            Cart state, promo codes, totals, mini-bag drawer
js/wishlist.js        Wishlist state
js/components.js      Quick add, quick view, swatches
js/navigation.js      Shared header, mega menu, mobile nav, footer, drawers/modals
js/search.js          Search matching + overlay (keyboard navigable)
js/forms.js           Newsletter validation (frontend demo)
js/home.js            Home page rendering, carousels, hotspots, countdown
js/animations.js      GSAP/ScrollTrigger + AOS, with reduced-motion handling
tools/image-check.html  Image URL audit
```

URL contract used across pages: `shop.html?cat=&gender=&sort=...`, `collection.html?c=<slug>`, `product.html?id=FRM-001`, `search.html?q=`, `article.html?slug=`.

## Demo rules (sample content)

- Free shipping above ₹3,999, otherwise ₹149.
- Promo codes: `FORME10` (10% off), `STUDIO500` (₹500 off above ₹2,999), `FREESHIP` (free shipping).
- Max 5 units per line item; sold-out sizes are disabled; `FRM-018` is fully sold out for demonstration.
- Drop countdown reads `drop.deadline` in `js/products.js`.

## Frontend-only limitations

- No accounts, payments, order placement, email delivery or shipping integration. The account icon opens an explanatory placeholder.
- Newsletter and contact forms validate but send nothing.
- Cart, wishlist, recent searches and the dismissed announcement are stored in your browser (localStorage / sessionStorage) only.
- Brand, people, credits, prices and policies are fictional sample content.
- Three.js is intentionally not used: the hero works better as a typographic, photographic composition.

## Hosting note for the 404 page

`pages/404.html` uses relative asset paths. It renders correctly for mistyped URLs at the site root or inside `/pages/`. On hosts that serve it for deeper unknown paths (e.g. `/a/b/c`), styles may not load; if you host at a domain root, add `<base href="/">` to its `<head>`.

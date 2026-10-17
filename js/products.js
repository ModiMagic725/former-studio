/* FORME / STUDIO 09 — local data layer. Every image URL in the project lives HERE.
   If an image is broken, change it in this file only. Open tools/image-check.html to audit all URLs. */
(function () {
  'use strict';
  const U = (id, w = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

  /* Image pool (Unsplash photo IDs), grouped by garment type. */
  const I = {
    tee1: 'photo-1583743814966-8936f5b7be1a', tee2: 'photo-1576566588028-4147f3842f27', tee3: 'photo-1562157873-818bc0726f68', tee4: 'photo-1503341504253-dff4815485f1',
    shirt1: 'photo-1596755094514-f87e34085b2c', shirt2: 'photo-1602810318383-e386cc2a3ccf', shirt3: 'photo-1620012253295-c15cc3e65df4',
    trouser1: 'photo-1624378439575-d8705ad7ae80', trouser2: 'photo-1473966968600-fa801b869a1a', trouser3: 'photo-1594938298603-c8148c4dae35',
    denim1: 'photo-1542272604-787c3835535d', denim2: 'photo-1541099649105-f69ad21f3246', denim3: 'photo-1604176354204-9268737828e4',
    jacket1: 'photo-1551028719-00167b16eac5', jacket2: 'photo-1591047139829-d91aecb6caea', jacket3: 'photo-1559551409-dadc959f76b8',
    coat1: 'photo-1539533018447-63fcce2678e3', coat2: 'photo-1544022613-e87ca75a784a', parka: 'photo-1544923246-77307dd654cb',
    knit1: 'photo-1620799140408-edc6dcb6d633', knit2: 'photo-1434389677669-e08b4cac3105', knit3: 'photo-1576871337622-98d48d1cf531',
    dress1: 'photo-1515886657613-9f3515b0c78f', dress2: 'photo-1496747611176-843222e1e57c', dress3: 'photo-1572804013309-59a88b7e92f1', dress4: 'photo-1595777457583-95e059d581b8',
    coord1: 'photo-1509631179647-0177331693ae', coord2: 'photo-1485968579580-b6d095142e6e',
    bag1: 'photo-1584917865442-de89df76afd3', bag2: 'photo-1548036328-c9fa89d128fa', bag3: 'photo-1591561954557-26941169b49e',
    cap1: 'photo-1588850561407-ed78c282e89b', cap2: 'photo-1521369909029-2afed882baee', cap3: 'photo-1575428652377-a2d80e2277fc',
    belt1: 'photo-1624222247344-550fb60583dc', belt2: 'photo-1553062407-98eeb64c6a62',
    sun1: 'photo-1572635196237-14b3f281503f',
    camp1: 'photo-1469334031218-e382a71b716b', camp2: 'photo-1529139574466-a303027c1d8b', camp3: 'photo-1539109136881-3be0616acf4b',
    camp4: 'photo-1483985988355-763728e1935b', camp5: 'photo-1445205170230-053b83016050', camp6: 'photo-1490481651871-ab68de25d43d',
    camp7: 'photo-1487222477894-8943e31ef7b2', camp8: 'photo-1558769132-cb1aea458c5e', camp9: 'photo-1534528741775-53994a69daeb',
    camp10: 'photo-1492562080023-ab3db95bfbce', street1: 'photo-1523398002811-999ca8dec234', studio1: 'photo-1558171813-4c088753af8f'
  };
  const img = (k, w) => U(I[k], w);

  const SIZES_TOP = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const SIZES_TOP_S = ['XS', 'S', 'M', 'L', 'XL'];
  const SIZES_W = ['28', '30', '32', '34', '36'];
  const ONE = ['One size'];
  const C = {
    ink: { name: 'Ink', hex: '#151515' }, bone: { name: 'Bone', hex: '#F4F1EA' }, white: { name: 'White', hex: '#FFFFFF' },
    lime: { name: 'Lime', hex: '#D8FF3E' }, steel: { name: 'Steel', hex: '#A7A7A2' }, cobalt: { name: 'Cobalt', hex: '#304FFE' },
    sand: { name: 'Sand', hex: '#C9B99A' }, olive: { name: 'Olive', hex: '#5E6240' }, indigo: { name: 'Indigo', hex: '#27324F' },
    wash: { name: 'Washed blue', hex: '#8FA3BD' }, camel: { name: 'Camel', hex: '#A9794B' }, charcoal: { name: 'Charcoal', hex: '#3A3A3A' },
    tan: { name: 'Tan', hex: '#B07C4F' }, silver: { name: 'Silver', hex: '#C4C6C8' }, grey: { name: 'Heather grey', hex: '#B9B8B3' }
  };
  const CARE_COTTON = 'Machine wash cold, inside out. Do not bleach. Tumble dry low or line dry. Warm iron if needed.';
  const CARE_WOOL = 'Dry clean or hand wash cold with wool detergent. Dry flat. Do not wring.';

  const P = [
    { id: 'FRM-001', slug: 'axis-oversized-tee', name: 'Axis Oversized Tee', category: 'tshirts', gender: 'unisex', price: 2290, mrp: null,
      images: ['tee1','tee2'].map((k) => img(k)), colors: [C.bone, C.ink, C.lime], sizes: SIZES_TOP, stock: 8, soldOutSizes: [],
      desc: 'A boxy, dropped-shoulder tee cut from 240 gsm cotton jersey. The collar is double-stitched so it holds its shape wash after wash.',
      material: '100% combed cotton, 240 gsm', fit: 'Oversized. Take your usual size for the intended drop, size down for a regular fit.', care: CARE_COTTON,
      collection: 'essentials', aesthetic: 'minimalist', labels: ['bestseller'], tags: ['tee', 'basic', 'cotton', 'oversized'], related: ['FRM-002', 'FRM-007', 'FRM-021'], model: 'Model is 182 cm / 72 in and wears size M.' },
    { id: 'FRM-002', slug: 'slab-heavyweight-tee', name: 'Slab Heavyweight Tee', category: 'tshirts', gender: 'men', price: 2490, mrp: null,
      images: ['tee3','tee4'].map((k) => img(k)), colors: [C.ink, C.steel], sizes: SIZES_TOP, stock: 6, soldOutSizes: ['XXL'],
      desc: 'Heavier than our everyday tee, with a ribbed neck and a hem that sits flat. Garment-washed for a soft, lived-in hand from day one.',
      material: '100% cotton, 300 gsm, garment washed', fit: 'Relaxed through the body with a slightly cropped length.', care: CARE_COTTON,
      collection: 'outside-the-lines', aesthetic: 'street-uniform', labels: ['new'], tags: ['tee', 'heavyweight', 'cotton'], related: ['FRM-001', 'FRM-010', 'FRM-007'], model: 'Model is 185 cm / 73 in and wears size L.' },
    { id: 'FRM-003', slug: 'mono-poplin-shirt', name: 'Mono Poplin Shirt', category: 'shirts', gender: 'men', price: 3990, mrp: null,
      images: ['shirt1','shirt2'].map((k) => img(k)), colors: [C.white, C.bone], sizes: SIZES_TOP_S, stock: 7, soldOutSizes: [],
      desc: 'A crisp poplin shirt with a concealed placket and a collar that stands without stiffeners. Worn buttoned to the top or open over a tee.',
      material: '100% cotton poplin', fit: 'Regular fit, easy through the shoulder.', care: CARE_COTTON,
      collection: 'essentials', aesthetic: 'minimalist', labels: [], tags: ['shirt', 'poplin', 'formal', 'cotton'], related: ['FRM-006', 'FRM-004', 'FRM-005'], model: 'Model is 183 cm / 72 in and wears size M.' },
    { id: 'FRM-004', slug: 'drift-camp-shirt', name: 'Drift Camp Shirt', category: 'shirts', gender: 'unisex', price: 3490, mrp: 4290,
      images: ['shirt3'].map((k) => img(k)), colors: [C.sand, C.ink], sizes: SIZES_TOP_S, stock: 5, soldOutSizes: ['XS'],
      desc: 'A short-sleeve camp shirt in a textured cotton-linen weave. Open collar, straight hem, and shell buttons.',
      material: '60% cotton, 40% linen', fit: 'Relaxed. Falls straight from the shoulder.', care: CARE_COTTON,
      collection: 'outside-the-lines', aesthetic: 'street-uniform', labels: [], tags: ['shirt', 'camp', 'linen', 'summer'], related: ['FRM-003', 'FRM-006', 'FRM-001'], model: 'Model is 178 cm / 70 in and wears size S.' },
    { id: 'FRM-005', slug: 'parallel-pleat-trouser', name: 'Parallel Pleat Trouser', category: 'trousers', gender: 'women', price: 4990, mrp: null,
      images: ['trouser1','trouser3'].map((k) => img(k)), colors: [C.ink, C.bone], sizes: SIZES_TOP_S, stock: 6, soldOutSizes: [],
      desc: 'High-rise trousers with double forward pleats and a wide, floor-skimming leg. The waistband is internally rubberised so shirts stay tucked.',
      material: '68% viscose, 28% polyester, 4% elastane', fit: 'High rise, wide leg. Runs true to size.', care: 'Dry clean recommended. Steam to refresh.',
      collection: 'soft-structure', aesthetic: 'soft-structure', labels: ['new'], tags: ['trouser', 'pleated', 'wide-leg', 'tailored'], related: ['FRM-011', 'FRM-003', 'FRM-017'], model: 'Model is 176 cm / 69 in and wears size S.' },
    { id: 'FRM-006', slug: 'column-tailored-trouser', name: 'Column Tailored Trouser', category: 'trousers', gender: 'men', price: 5290, mrp: null,
      images: ['trouser2'].map((k) => img(k)), colors: [C.ink, C.steel], sizes: SIZES_W, stock: 6, soldOutSizes: ['28'],
      desc: 'A straight, uninterrupted column from hip to hem. Flat front, side-adjusters and a clean break over the shoe.',
      material: '97% polyester wool-look blend, 3% elastane', fit: 'Regular rise, straight leg.', care: 'Dry clean recommended.',
      collection: 'soft-structure', aesthetic: 'minimalist', labels: [], tags: ['trouser', 'tailored', 'straight'], related: ['FRM-003', 'FRM-010', 'FRM-023'], model: 'Model is 185 cm / 73 in, waist 32, and wears size 32.' },
    { id: 'FRM-007', slug: 'raw-selvedge-denim', name: 'Raw Selvedge Denim', category: 'denim', gender: 'men', price: 5990, mrp: null,
      images: ['denim1','denim2'].map((k) => img(k)), colors: [C.indigo, C.ink], sizes: SIZES_W, stock: 5, soldOutSizes: [],
      desc: 'Unwashed 13 oz selvedge denim that fades to your own wear pattern. Five-pocket, with a tapered leg and a locking button fly.',
      material: '100% cotton selvedge denim, 13 oz', fit: 'Regular fit, tapered leg. Raw denim shrinks about 3% on the first wash.', care: 'Wash rarely, cold, inside out. Line dry.',
      collection: 'essentials', aesthetic: 'street-uniform', labels: ['bestseller'], tags: ['denim', 'jeans', 'raw', 'selvedge'], related: ['FRM-008', 'FRM-001', 'FRM-010'], model: 'Model is 183 cm / 72 in, waist 32, and wears size 32.' },
    { id: 'FRM-008', slug: 'wide-leg-wash-denim', name: 'Wide-Leg Wash Denim', category: 'denim', gender: 'women', price: 5490, mrp: 6490,
      images: ['denim3'].map((k) => img(k)), colors: [C.wash], sizes: SIZES_W, stock: 4, soldOutSizes: ['36'],
      desc: 'A high-rise wide-leg jean in a stone-washed mid blue. Clean seams, a button fly and a hem that stacks gently on the shoe.',
      material: '100% cotton denim, 11 oz', fit: 'High rise, wide leg. Runs true to size.', care: 'Machine wash cold, inside out. Line dry.',
      collection: 'outside-the-lines', aesthetic: 'street-uniform', labels: [], tags: ['denim', 'jeans', 'wide-leg', 'wash'], related: ['FRM-007', 'FRM-001', 'FRM-015'], model: 'Model is 175 cm / 69 in, waist 28, and wears size 28.' },
    { id: 'FRM-009', slug: 'cropped-shell-jacket', name: 'Cropped Shell Jacket', category: 'jackets', gender: 'unisex', price: 7990, mrp: null,
      images: ['jacket1'].map((k) => img(k)), colors: [C.ink, C.lime], sizes: SIZES_TOP_S, stock: 3, soldOutSizes: ['XL'],
      desc: 'A lightweight, water-resistant shell cut short at the waist. Taped seams, a two-way zip and a hidden stash pocket at the chest.',
      material: 'Nylon ripstop shell, polyester lining', fit: 'Boxy and cropped. Size up for layering.', care: 'Wipe clean or gentle cold wash. Do not tumble dry.',
      collection: 'outside-the-lines', aesthetic: 'street-uniform', labels: ['limited'], tags: ['jacket', 'shell', 'water-resistant', 'cropped'], related: ['FRM-010', 'FRM-012', 'FRM-026'], model: 'Model is 180 cm / 71 in and wears size M.' },
    { id: 'FRM-010', slug: 'tapered-coach-jacket', name: 'Tapered Coach Jacket', category: 'jackets', gender: 'men', price: 6490, mrp: null,
      images: ['jacket2'].map((k) => img(k)), colors: [C.ink, C.bone], sizes: SIZES_TOP_S, stock: 6, soldOutSizes: [],
      desc: 'A snap-front coach jacket in a matte twill, with a ribbed collar and a slightly tapered hem.',
      material: '100% cotton twill, polyester lining', fit: 'Regular fit. Hits at the hip.', care: CARE_COTTON,
      collection: 'outside-the-lines', aesthetic: 'street-uniform', labels: ['new'], tags: ['jacket', 'coach', 'twill'], related: ['FRM-009', 'FRM-002', 'FRM-007'], model: 'Model is 185 cm / 73 in and wears size L.' },
    { id: 'FRM-011', slug: 'longline-wool-coat', name: 'Longline Wool Coat', category: 'outerwear', gender: 'women', price: 11990, mrp: null,
      images: ['coat1','coat2'].map((k) => img(k)), colors: [C.charcoal, C.camel], sizes: ['XS', 'S', 'M', 'L'], stock: 4, soldOutSizes: [],
      desc: 'A single-breasted, knee-length coat with a soft shoulder line and deep pockets. Cut from a dense wool blend for cool evenings.',
      material: '70% wool, 30% polyamide', fit: 'Relaxed through the body. Sized to layer over knitwear.', care: CARE_WOOL,
      collection: 'soft-structure', aesthetic: 'soft-structure', labels: ['bestseller'], tags: ['coat', 'wool', 'longline', 'winter'], related: ['FRM-014', 'FRM-005', 'FRM-013'], model: 'Model is 176 cm / 69 in and wears size S.' },
    { id: 'FRM-012', slug: 'quilted-field-parka', name: 'Quilted Field Parka', category: 'outerwear', gender: 'unisex', price: 9990, mrp: 12490,
      images: ['parka'].map((k) => img(k)), colors: [C.ink, C.olive], sizes: SIZES_TOP_S, stock: 4, soldOutSizes: ['S'],
      desc: 'A quilted parka with a funnel collar, snap storm flap and four utility pockets. Light recycled-fibre fill keeps it warm but never bulky.',
      material: 'Nylon shell, recycled polyester fill', fit: 'Relaxed. Sits below the hip.', care: 'Gentle cold wash. Tumble dry low with dryer balls.',
      collection: 'outside-the-lines', aesthetic: 'street-uniform', labels: [], tags: ['parka', 'quilted', 'winter', 'utility'], related: ['FRM-009', 'FRM-013', 'FRM-011'], model: 'Model is 181 cm / 71 in and wears size M.' },
    { id: 'FRM-013', slug: 'cable-knit-crew', name: 'Cable Knit Crew', category: 'knitwear', gender: 'unisex', price: 4590, mrp: null,
      images: ['knit1','knit3'].map((k) => img(k)), colors: [C.bone, C.ink], sizes: SIZES_TOP_S, stock: 7, soldOutSizes: [],
      desc: 'A chunky crew-neck knit with a continuous cable down the chest. Dense, warm and softer than it looks.',
      material: '55% cotton, 45% acrylic', fit: 'Oversized. Dropped shoulder.', care: CARE_WOOL,
      collection: 'soft-structure', aesthetic: 'minimalist', labels: [], tags: ['knit', 'sweater', 'cable', 'winter'], related: ['FRM-014', 'FRM-011', 'FRM-003'], model: 'Model is 178 cm / 70 in and wears size M.' },
    { id: 'FRM-014', slug: 'mohair-blend-cardigan', name: 'Mohair Blend Cardigan', category: 'knitwear', gender: 'women', price: 5990, mrp: null,
      images: ['knit2'].map((k) => img(k)), colors: [C.grey, C.cobalt], sizes: SIZES_TOP_S, stock: 5, soldOutSizes: [],
      desc: 'A fuzzy, open-knit cardigan with a deep V and horn-effect buttons. Light on the shoulders, warm on the arms.',
      material: '40% mohair, 35% nylon, 25% wool', fit: 'Relaxed. Falls to the hip.', care: CARE_WOOL,
      collection: 'soft-structure', aesthetic: 'soft-structure', labels: ['new'], tags: ['knit', 'cardigan', 'mohair'], related: ['FRM-013', 'FRM-011', 'FRM-005'], model: 'Model is 175 cm / 69 in and wears size S.' },
    { id: 'FRM-015', slug: 'bias-slip-dress', name: 'Bias Slip Dress', category: 'dresses', gender: 'women', price: 4790, mrp: null,
      images: ['dress1','dress3'].map((k) => img(k)), colors: [C.ink, C.bone], sizes: SIZES_TOP_S, stock: 6, soldOutSizes: [],
      desc: 'A bias-cut slip dress in a fluid satin. Adjustable straps, a low back and a midi hem that moves when you do.',
      material: '100% recycled polyester satin', fit: 'Fitted through the bust, flowing below. True to size.', care: 'Hand wash cold. Hang dry. Cool iron.',
      collection: 'after-hours', aesthetic: 'after-hours', labels: ['trending'], tags: ['dress', 'slip', 'satin', 'evening'], related: ['FRM-016', 'FRM-019', 'FRM-014'], model: 'Model is 176 cm / 69 in and wears size S.' },
    { id: 'FRM-016', slug: 'asymmetric-shirt-dress', name: 'Asymmetric Shirt Dress', category: 'dresses', gender: 'women', price: 5290, mrp: 6290,
      images: ['dress2','dress4'].map((k) => img(k)), colors: [C.white, C.ink], sizes: SIZES_TOP_S, stock: 5, soldOutSizes: ['XL'],
      desc: 'A shirt dress with an asymmetric hem and an oversized collar. Belt it at the waist or wear it loose.',
      material: '100% cotton poplin', fit: 'Relaxed. Falls to the knee at the front.', care: CARE_COTTON,
      collection: 'soft-structure', aesthetic: 'minimalist', labels: [], tags: ['dress', 'shirt dress', 'poplin'], related: ['FRM-015', 'FRM-003', 'FRM-023'], model: 'Model is 174 cm / 68 in and wears size S.' },
    { id: 'FRM-017', slug: 'utility-coord-set', name: 'Utility Co-ord Set', category: 'coords', gender: 'women', price: 8490, mrp: null,
      images: ['coord1'].map((k) => img(k)), colors: [C.sand, C.ink], sizes: SIZES_TOP_S, stock: 5, soldOutSizes: [],
      desc: 'A matching overshirt and wide trouser in a washed cotton canvas. Patch pockets, snap closures and an elastic back waist.',
      material: '100% cotton canvas, garment washed', fit: 'Relaxed. The overshirt is cut boxy and the trouser is wide-leg.', care: CARE_COTTON,
      collection: 'outside-the-lines', aesthetic: 'street-uniform', labels: ['bestseller'], tags: ['coord', 'set', 'utility', 'canvas'], related: ['FRM-018', 'FRM-005', 'FRM-004'], model: 'Model is 177 cm / 70 in and wears size S.' },
    { id: 'FRM-018', slug: 'pleated-coord-set', name: 'Pleated Co-ord Set', category: 'coords', gender: 'women', price: 8990, mrp: null,
      images: ['coord2'].map((k) => img(k)), colors: [C.ink, C.steel], sizes: SIZES_TOP_S, stock: 0, soldOutSizes: SIZES_TOP_S,
      desc: 'A sleeveless pleated top with matching wide pleated trousers. Made in a small run and now sold out.',
      material: '100% recycled polyester crepe', fit: 'Regular fit top, wide-leg trouser.', care: 'Hand wash cold. Hang dry.',
      collection: 'after-hours', aesthetic: 'after-hours', labels: ['limited'], tags: ['coord', 'set', 'pleated', 'evening'], related: ['FRM-017', 'FRM-015', 'FRM-005'], model: 'Model is 176 cm / 69 in and wears size S.' },
    { id: 'FRM-019', slug: 'mini-crescent-bag', name: 'Mini Crescent Bag', category: 'bags', gender: 'women', price: 3990, mrp: null,
      images: ['bag1','bag2'].map((k) => img(k)), colors: [C.ink, C.bone], sizes: ONE, stock: 6, soldOutSizes: [],
      desc: 'A small crescent-shaped shoulder bag in pebbled vegan leather. Holds a phone, cards and keys.',
      material: 'Polyurethane vegan leather, cotton lining', fit: '22 × 12 × 6 cm. Strap drop 55 cm.', care: 'Wipe with a damp cloth. Keep out of direct sun.',
      collection: 'after-hours', aesthetic: 'after-hours', labels: [], tags: ['bag', 'shoulder', 'mini', 'vegan leather'], related: ['FRM-020', 'FRM-015', 'FRM-025'], model: '' },
    { id: 'FRM-020', slug: 'courier-sling-bag', name: 'Courier Sling Bag', category: 'bags', gender: 'unisex', price: 3290, mrp: null,
      images: ['bag3'].map((k) => img(k)), colors: [C.ink, C.lime], sizes: ONE, stock: 8, soldOutSizes: [],
      desc: 'A cross-body sling in coated ripstop, with a quick-release buckle, a hidden back pocket and a reflective pull.',
      material: 'Coated nylon ripstop', fit: '30 × 18 × 9 cm. Adjustable strap.', care: 'Wipe clean. Do not machine wash.',
      collection: 'outside-the-lines', aesthetic: 'street-uniform', labels: ['bestseller'], tags: ['bag', 'sling', 'crossbody', 'nylon'], related: ['FRM-019', 'FRM-021', 'FRM-009'], model: '' },
    { id: 'FRM-021', slug: 'panel-cap', name: 'Panel Cap', category: 'caps', gender: 'unisex', price: 1490, mrp: null,
      images: ['cap1','cap2'].map((k) => img(k)), colors: [C.ink, C.bone, C.lime], sizes: ONE, stock: 9, soldOutSizes: [],
      desc: 'A six-panel cap in brushed cotton twill with a curved brim, tonal embroidery and an adjustable metal buckle.',
      material: '100% brushed cotton twill', fit: 'One size. Adjustable strap fits 54 to 60 cm.', care: 'Spot clean only.',
      collection: 'essentials', aesthetic: 'street-uniform', labels: [], tags: ['cap', 'hat', 'twill'], related: ['FRM-022', 'FRM-001', 'FRM-020'], model: '' },
    { id: 'FRM-022', slug: 'washed-dad-cap', name: 'Washed Dad Cap', category: 'caps', gender: 'unisex', price: 1290, mrp: null,
      images: ['cap3'].map((k) => img(k)), colors: [C.sand, C.ink], sizes: ONE, stock: 9, soldOutSizes: [],
      desc: 'An unstructured, low-profile cap with a garment-washed finish and a soft, worn-in brim.',
      material: '100% washed cotton', fit: 'One size. Adjustable strap fits 54 to 60 cm.', care: 'Spot clean only.',
      collection: 'essentials', aesthetic: 'minimalist', labels: ['new'], tags: ['cap', 'hat', 'washed'], related: ['FRM-021', 'FRM-004', 'FRM-002'], model: '' },
    { id: 'FRM-023', slug: 'stitch-leather-belt', name: 'Stitch Leather Belt', category: 'belts', gender: 'unisex', price: 2490, mrp: null,
      images: ['belt1'].map((k) => img(k)), colors: [C.ink, C.tan], sizes: ['S', 'M', 'L'], stock: 7, soldOutSizes: [],
      desc: 'A 3 cm belt in vegetable-tanned leather with a brushed steel buckle and contrast edge stitching.',
      material: 'Vegetable-tanned leather, steel hardware', fit: 'S: 80 cm, M: 90 cm, L: 100 cm total length.', care: 'Wipe with a dry cloth. Condition occasionally.',
      collection: 'essentials', aesthetic: 'minimalist', labels: [], tags: ['belt', 'leather', 'accessory'], related: ['FRM-006', 'FRM-007', 'FRM-024'], model: '' },
    { id: 'FRM-024', slug: 'hardware-chain-belt', name: 'Hardware Chain Belt', category: 'belts', gender: 'unisex', price: 2990, mrp: null,
      images: ['belt2'].map((k) => img(k)), colors: [C.silver], sizes: ['S', 'M', 'L'], stock: 3, soldOutSizes: ['L'],
      desc: 'A chunky chain belt in brushed silver with a lobster clasp. Worn at the waist or slung low over trousers.',
      material: 'Zinc alloy, nickel-free plating', fit: 'Adjustable. S: 85 cm, M: 95 cm, L: 105 cm.', care: 'Wipe dry. Store flat.',
      collection: 'after-hours', aesthetic: 'after-hours', labels: ['limited'], tags: ['belt', 'chain', 'silver', 'accessory'], related: ['FRM-023', 'FRM-025', 'FRM-015'], model: '' },
    { id: 'FRM-025', slug: 'frame-sunglasses', name: 'Frame Sunglasses', category: 'accessories', gender: 'unisex', price: 2790, mrp: null,
      images: ['sun1'].map((k) => img(k)), colors: [C.ink, C.tan], sizes: ONE, stock: 8, soldOutSizes: [],
      desc: 'Thick acetate frames with a flat top bar and smoke lenses. Comes with a soft case.',
      material: 'Acetate frame, UV400 lenses', fit: 'Lens width 52 mm, bridge 20 mm, temple 145 mm.', care: 'Clean with the supplied cloth.',
      collection: 'after-hours', aesthetic: 'after-hours', labels: ['trending'], tags: ['sunglasses', 'eyewear', 'accessory'], related: ['FRM-024', 'FRM-019', 'FRM-021'], model: '' },
    { id: 'FRM-026', slug: 'eclipse-statement-jacket', name: 'Eclipse Statement Jacket', category: 'jackets', gender: 'unisex', price: 14990, mrp: null,
      images: ['jacket3'].map((k) => img(k)), colors: [C.ink, C.lime], sizes: SIZES_TOP_S, stock: 2, soldOutSizes: ['XS'],
      desc: 'Our limited-edition statement piece: a reversible bomber with a matte ink face and a lime lining. Numbered label inside the collar, run of 120.',
      material: 'Nylon twill outer, reversible lining', fit: 'Oversized, cropped body. Size down for a closer fit.', care: 'Dry clean only.',
      collection: 'outside-the-lines', aesthetic: 'after-hours', labels: ['limited'], tags: ['jacket', 'bomber', 'reversible', 'limited edition'], related: ['FRM-009', 'FRM-010', 'FRM-012'], model: 'Model is 182 cm / 72 in and wears size M.' }
  ];

  const CATEGORIES = {
    tshirts: 'T-shirts', shirts: 'Shirts', trousers: 'Trousers', denim: 'Denim', jackets: 'Jackets', outerwear: 'Outerwear',
    knitwear: 'Knitwear', dresses: 'Dresses', coords: 'Co-ord sets', bags: 'Bags', caps: 'Caps', belts: 'Belts', accessories: 'Accessories'
  };

  /* Collection slugs are the contract with pages/collection.html (Phase 2). */
  const COLLECTIONS = {
    women: { title: 'Women', rule: { gender: ['women', 'unisex'] }, img: img('camp1', 1600), intro: 'Soft tailoring, fluid layers and a few hard edges.' },
    men: { title: 'Men', rule: { gender: ['men', 'unisex'] }, img: img('camp10', 1600), intro: 'Structured basics and outerwear built to be worn in.' },
    unisex: { title: 'Unisex', rule: { gender: ['unisex'] }, img: img('street1', 1600), intro: 'One cut, every body. Sized to be shared.' },
    'new-arrivals': { title: 'New arrivals', rule: { label: 'new' }, img: img('camp3', 1600), intro: 'The latest from Outside the Lines.' },
    bestsellers: { title: 'Bestsellers', rule: { label: 'bestseller' }, img: img('camp2', 1600), intro: 'The pieces people keep coming back for.' },
    essentials: { title: 'Essentials', rule: { collection: 'essentials' }, img: img('studio1', 1600), intro: 'The everyday layer, done properly.' },
    'limited-edition': { title: 'Limited edition', rule: { label: 'limited' }, img: img('camp7', 1600), intro: 'Small runs, numbered labels, no restocks.' },
    sale: { title: 'Sale', rule: { sale: true }, img: img('camp6', 1600), intro: 'Selected pieces at reduced prices while sizes last.' },
    minimalist: { title: 'Minimalist', rule: { aesthetic: 'minimalist' }, img: img('camp5', 1600), intro: 'Quiet shapes, tonal colour, nothing extra.' },
    'street-uniform': { title: 'Street Uniform', rule: { aesthetic: 'street-uniform' }, img: img('street1', 1600), intro: 'Workwear, utility and heavyweight cotton.' },
    'after-hours': { title: 'After Hours', rule: { aesthetic: 'after-hours' }, img: img('camp7', 1600), intro: 'Satin, chrome and low light.' },
    'soft-structure': { title: 'Soft Structure', rule: { aesthetic: 'soft-structure' }, img: img('camp4', 1600), intro: 'Tailoring that moves with you.' }
  };

  const NAV = [
    { label: 'Women', href: 'pages/collection.html?c=women', cols: [
      { title: 'Shop by category', links: [['Dresses', 'pages/shop.html?gender=women&cat=dresses'], ['Trousers', 'pages/shop.html?gender=women&cat=trousers'], ['Denim', 'pages/shop.html?gender=women&cat=denim'], ['Knitwear', 'pages/shop.html?gender=women&cat=knitwear'], ['Outerwear', 'pages/shop.html?gender=women&cat=outerwear'], ['Co-ord sets', 'pages/shop.html?gender=women&cat=coords']] },
      { title: 'Edits', links: [['New arrivals', 'pages/collection.html?c=new-arrivals'], ['Bestsellers', 'pages/collection.html?c=bestsellers'], ['After Hours', 'pages/collection.html?c=after-hours'], ['Sale', 'pages/collection.html?c=sale']] }
    ], feature: { img: img('camp1', 700), label: 'Shop all women', href: 'pages/collection.html?c=women' } },
    { label: 'Men', href: 'pages/collection.html?c=men', cols: [
      { title: 'Shop by category', links: [['T-shirts', 'pages/shop.html?gender=men&cat=tshirts'], ['Shirts', 'pages/shop.html?gender=men&cat=shirts'], ['Trousers', 'pages/shop.html?gender=men&cat=trousers'], ['Denim', 'pages/shop.html?gender=men&cat=denim'], ['Jackets', 'pages/shop.html?gender=men&cat=jackets']] },
      { title: 'Edits', links: [['New arrivals', 'pages/collection.html?c=new-arrivals'], ['Street Uniform', 'pages/collection.html?c=street-uniform'], ['Essentials', 'pages/collection.html?c=essentials'], ['Sale', 'pages/collection.html?c=sale']] }
    ], feature: { img: img('camp10', 700), label: 'Shop all men', href: 'pages/collection.html?c=men' } },
    { label: 'Unisex', href: 'pages/collection.html?c=unisex', cols: [
      { title: 'Shop by category', links: [['T-shirts', 'pages/shop.html?gender=unisex&cat=tshirts'], ['Jackets', 'pages/shop.html?gender=unisex&cat=jackets'], ['Knitwear', 'pages/shop.html?gender=unisex&cat=knitwear'], ['Bags', 'pages/shop.html?cat=bags'], ['Caps', 'pages/shop.html?cat=caps'], ['Belts', 'pages/shop.html?cat=belts']] },
      { title: 'Edits', links: [['Limited edition', 'pages/collection.html?c=limited-edition'], ['Minimalist', 'pages/collection.html?c=minimalist'], ['Soft Structure', 'pages/collection.html?c=soft-structure']] }
    ], feature: { img: img('street1', 700), label: 'Shop all unisex', href: 'pages/collection.html?c=unisex' } },
    { label: 'Collections', href: 'pages/shop.html', cols: [
      { title: 'Collections', links: [['New arrivals', 'pages/collection.html?c=new-arrivals'], ['Bestsellers', 'pages/collection.html?c=bestsellers'], ['Essentials', 'pages/collection.html?c=essentials'], ['Limited edition', 'pages/collection.html?c=limited-edition'], ['Sale', 'pages/collection.html?c=sale'], ['Shop all', 'pages/shop.html']] },
      { title: 'Shop by aesthetic', links: [['Minimalist', 'pages/collection.html?c=minimalist'], ['Street Uniform', 'pages/collection.html?c=street-uniform'], ['After Hours', 'pages/collection.html?c=after-hours'], ['Soft Structure', 'pages/collection.html?c=soft-structure']] }
    ], feature: { img: img('camp3', 700), label: 'Read the lookbook', href: 'pages/lookbook.html' } },
    { label: 'Journal', href: 'pages/journal.html' }
  ];

  const AESTHETICS = [
    { slug: 'minimalist', title: 'Minimalist', note: 'Quiet shapes, tonal colour.', img: img('camp5', 800) },
    { slug: 'street-uniform', title: 'Street Uniform', note: 'Workwear and heavy cotton.', img: img('street1', 800) },
    { slug: 'after-hours', title: 'After Hours', note: 'Satin, chrome, low light.', img: img('camp7', 800) },
    { slug: 'soft-structure', title: 'Soft Structure', note: 'Tailoring that moves.', img: img('camp4', 800) }
  ];

  const LOOKBOOK = [
    { id: 'lb1', img: img('camp2', 1600), title: 'Lines, redrawn', credit: 'Photography: Aarav Menon. Styling: Ila Rao.', note: 'Shot on a rooftop at 5:40 a.m. The brief was one silhouette, three ways.',
      hotspots: [{ x: 48, y: 34, pid: 'FRM-009' }, { x: 56, y: 72, pid: 'FRM-005' }] },
    { id: 'lb2', img: img('camp3', 1600), title: 'Soft structure', credit: 'Photography: Aarav Menon. Casting: Studio 09.', note: 'Wool, mohair and a coat that holds its edge. Daylight only, no retouching on the fabric.',
      hotspots: [{ x: 44, y: 40, pid: 'FRM-011' }, { x: 62, y: 62, pid: 'FRM-014' }] },
    { id: 'lb3', img: img('camp7', 1600), title: 'After hours', credit: 'Photography: Meher Kapoor. Set design: Kabir Sen.', note: 'Satin and chrome under one practical light, shot between midnight and two.',
      hotspots: [{ x: 50, y: 45, pid: 'FRM-015' }, { x: 60, y: 82, pid: 'FRM-024' }] }
  ];

  const JOURNAL = [
    { id: 'j1', slug: 'the-case-for-heavyweight-cotton', title: 'The case for heavyweight cotton', category: 'Materials', date: '2026-10-08', read: 6, img: img('camp8', 1400), excerpt: 'Why 300 gsm jersey feels different, and what it means for how a tee ages.' },
    { id: 'j2', slug: 'three-ways-to-wear-a-shell', title: 'Three ways to wear a shell jacket', category: 'Styling', date: '2026-10-01', read: 4, img: img('camp6', 1400), excerpt: 'Over tailoring, over knitwear, and over nothing at all.' },
    { id: 'j3', slug: 'inside-the-studio-at-5-am', title: 'Inside the studio at 5 a.m.', category: 'Behind the Scenes', date: '2026-09-24', read: 8, img: img('studio1', 1400), excerpt: 'A walk through the early-morning shoot for Outside the Lines.' },
    { id: 'j4', slug: 'why-we-stopped-chasing-trends', title: 'Why we stopped chasing trends', category: 'Culture', date: '2026-09-17', read: 5, img: img('camp9', 1400), excerpt: 'Notes on making fewer things, slowly.' },
    { id: 'j5', slug: 'a-field-guide-to-wide-leg-trousers', title: 'A field guide to wide-leg trousers', category: 'Fashion', date: '2026-09-09', read: 5, img: img('camp5', 1400), excerpt: 'Rise, break, and the one fit check that matters.' },
    { id: 'j6', slug: 'how-to-care-for-raw-denim', title: 'How to care for raw denim', category: 'Materials', date: '2026-09-02', read: 7, img: img('street1', 1400), excerpt: 'Wash less, soak once, and let it fade your way.' }
  ];

  window.FORME_DATA = {
    brand: { name: 'FORME', studio: 'STUDIO 09', email: 'care@forme-studio09.example', currency: 'INR' },
    products: P, categories: CATEGORIES, collections: COLLECTIONS, nav: NAV, aesthetics: AESTHETICS, lookbook: LOOKBOOK, journal: JOURNAL,
    images: { I, U, img },
    heroImg: img('camp2', 1800), heroImgMobile: img('camp2', 1000),
    manifestoImg: img('studio1', 1000),
    featureTiles: { women: img('camp1', 1100), men: img('camp10', 1400), unisex: img('street1', 1000), accessories: img('bag1', 900) },
    announcements: ['New collection: Outside the Lines is live', 'Free shipping on orders above ₹3,999', 'Limited drop: Eclipse Statement Jacket, run of 120'],
    shipping: { freeThreshold: 3999, flat: 149 },
    promos: {
      FORME10: { type: 'percent', value: 10, label: '10% off your bag' },
      STUDIO500: { type: 'flat', value: 500, min: 2999, label: '₹500 off orders above ₹2,999' },
      FREESHIP: { type: 'shipping', label: 'Free shipping' }
    },
    maxPerLine: 5,
    trending: ['Oversized tee', 'Denim', 'Black jacket', 'Co-ord set', 'Sling bag'],
    /* Locally configured campaign deadline (IST). Countdown only runs if this is in the future. */
    drop: { name: 'Eclipse Statement Jacket', productId: 'FRM-026', deadline: '2026-11-07T18:30:00+05:30' }
  };
})();

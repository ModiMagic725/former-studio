/* Illustrative sample sizing (cm). Not verified manufacturer measurements. */
(function () {
  'use strict';
  window.FORME_SIZES = {
    tops: { label: 'Tops', note: 'Body measurements in cm. Oversized and relaxed pieces are cut larger than these, see fit definitions.', cols: ['Size', 'Chest', 'Waist', 'Hip', 'Shoulder'],
      rows: [['XS', '82–87', '66–71', '88–93', '42'], ['S', '88–93', '72–77', '94–99', '44'], ['M', '94–99', '78–83', '100–105', '46'], ['L', '100–105', '84–89', '106–111', '48'], ['XL', '106–111', '90–95', '112–117', '50'], ['XXL', '112–117', '96–101', '118–123', '52']] },
    bottoms: { label: 'Bottoms', note: 'Body measurements in cm. Waist sizes match the numeric sizing on trousers.', cols: ['Size', 'Waist', 'Hip', 'Inseam (men)', 'Inseam (women)'],
      rows: [['28', '71', '92', '79', '76'], ['30', '76', '97', '80', '77'], ['32', '81', '102', '81', '78'], ['34', '86', '107', '81', '78'], ['36', '91', '112', '82', '79']] },
    denim: { label: 'Denim', note: 'Garment measurements in cm, laid flat. Raw denim shrinks about 3% on first wash.', cols: ['Size', 'Waist', 'Front rise', 'Thigh', 'Leg opening'],
      rows: [['28', '71', '28', '30', '17'], ['30', '76', '28.5', '31', '17.5'], ['32', '81', '29', '32', '18'], ['34', '86', '29.5', '33', '18.5'], ['36', '91', '30', '34', '19']] },
    dresses: { label: 'Dresses', note: 'Body measurements in cm. Length is measured from the high point of the shoulder.', cols: ['Size', 'Bust', 'Waist', 'Hip', 'Length'],
      rows: [['XS', '82–86', '64–68', '88–92', '112'], ['S', '87–91', '69–73', '93–97', '114'], ['M', '92–96', '74–78', '98–102', '116'], ['L', '97–101', '79–83', '103–107', '118'], ['XL', '102–106', '84–88', '108–112', '120']] },
    accessories: { label: 'Accessories', note: 'Product dimensions in cm.', cols: ['Item', 'Size', 'Measurement', 'Fits'],
      rows: [['Belts', 'S', '80 total length', 'Waist 70–80'], ['Belts', 'M', '90 total length', 'Waist 80–90'], ['Belts', 'L', '100 total length', 'Waist 90–100'], ['Caps', 'One size', '54–60 strap range', 'Head circumference'], ['Mini Crescent Bag', 'One size', '22 × 12 × 6', 'Phone, cards, keys'], ['Courier Sling Bag', 'One size', '30 × 18 × 9', 'Phone, wallet, small items']] }
  };
  window.FORME_FITS = [
    { name: 'Regular', ease: '+6 to 10 cm', body: 'Follows the body with room to move. Sized true.' },
    { name: 'Relaxed', ease: '+10 to 16 cm', body: 'Easy through the body, a little drop at the shoulder.' },
    { name: 'Oversized', ease: '+16 to 24 cm', body: 'Boxy and dropped. Take your usual size for the intended drop, size down for less.' }
  ];
  /* Which table(s) suit which product category */
  window.FORME_SIZE_MAP = { tshirts: ['tops'], shirts: ['tops'], knitwear: ['tops'], jackets: ['tops'], outerwear: ['tops'], coords: ['tops', 'bottoms'], trousers: ['bottoms'], denim: ['denim'], dresses: ['dresses'], bags: ['accessories'], caps: ['accessories'], belts: ['accessories'], accessories: ['accessories'] };
})();

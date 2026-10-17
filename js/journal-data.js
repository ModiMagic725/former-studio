/* Locally authored sample articles (fictional brand content). Block types:
   h = heading, p = paragraph, q = pull quote, img = inline image (k = image key in products.js), gal = captioned gallery. */
(function () {
  'use strict';
  window.FORME_ARTICLES = {
    'the-case-for-heavyweight-cotton': {
      byline: 'Words by Ila Rao', products: ['FRM-002', 'FRM-001'],
      intro: 'Weight is the first thing you feel in a T-shirt and the last thing a product page explains. Here is what 300 gsm actually means, and why we keep coming back to it.',
      blocks: [
        { t: 'h', x: 'What gsm measures' },
        { t: 'p', x: 'GSM stands for grams per square metre. It is the weight of one square metre of finished fabric, and it is the simplest honest number a maker can give you. A light summer tee sits around 140 gsm. Our everyday Axis tee is 240. The Slab is 300.' },
        { t: 'p', x: 'More weight means more cotton in every stitch. That changes three things you can feel: how the fabric hangs away from the body, how well it keeps its edges, and how it behaves after a hundred washes.' },
        { t: 'img', k: 'camp8', cap: 'Fabric weight changes how a garment falls. Shot in natural light, no retouching on the cloth.', ratio: 'wide' },
        { t: 'h', x: 'How it ages' },
        { t: 'p', x: 'Light jersey tends to twist at the side seams and stretch at the neck. Heavier jersey resists both. The ribbed collar on the Slab is double-stitched and cut slightly narrower than the neck opening so it settles back after every wear.' },
        { t: 'p', x: 'It does soften. After the first few washes the surface relaxes and the fabric loses its stiffness, but it keeps its shape. That is the point of garment washing it before it reaches you: you start from the soft part.' },
        { t: 'q', x: 'A heavier tee is not louder. It is just harder to wear out.', by: 'Studio 09 cutting room' },
        { t: 'h', x: 'The trade-offs' },
        { t: 'p', x: 'Heavyweight cotton is warmer, slower to dry and less forgiving in peak summer. If you live somewhere hot, wear the 240 and save the 300 for evenings and layering. We would rather tell you that than sell you the wrong tee.' },
        { t: 'p', x: 'Fit changes too. Dense fabric holds a boxy shape, so we cut the Slab slightly cropped and wide through the body. Size down if you want it closer.' }
      ]
    },
    'three-ways-to-wear-a-shell': {
      byline: 'Words by Meher Kapoor', products: ['FRM-009', 'FRM-006', 'FRM-013', 'FRM-001'],
      intro: 'A shell jacket is the most useful thing in a cool-weather wardrobe and the easiest to get wrong. Three combinations that work, and why.',
      blocks: [
        { t: 'h', x: 'Over tailoring' },
        { t: 'p', x: 'Put the cropped shell over a straight, tailored trouser and a plain shirt. The contrast does the work: sharp lower half, technical upper half. Keep the colours tonal. Ink on ink with the lime lining showing at the cuff is plenty.' },
        { t: 'img', k: 'camp6', cap: 'Shell, column trouser, poplin shirt. One colour, two textures.', ratio: 'tall' },
        { t: 'h', x: 'Over knitwear' },
        { t: 'p', x: 'The shell is cut short and boxy, so a chunky knit underneath should not hang below the hem. Choose a crew with a dense knit and a close neckline, and let a few centimetres of the sweater show at the waist. It reads deliberate rather than accidental.' },
        { t: 'q', x: 'Layering is just proportion. Decide what is long, and keep everything else short.', by: 'Meher Kapoor, styling' },
        { t: 'h', x: 'Over nothing at all' },
        { t: 'p', x: 'Worn alone, zipped halfway over a bare tee, the shell works as a light evening layer. This is the one to try with the Axis tee in bone: the brightness of the tee lifts the dark face of the jacket.' },
        { t: 'p', x: 'The stash pocket at the chest holds a phone or a card holder. Taped seams mean a light shower will not get through, though it is a shell, not a raincoat.' }
      ]
    },
    'inside-the-studio-at-5-am': {
      byline: 'Words by Aarav Menon', products: ['FRM-005', 'FRM-009'],
      intro: 'The Outside the Lines campaign was shot over four mornings, starting before sunrise. A look at how a 5 a.m. call time shaped the clothes, the light and the mood.',
      blocks: [
        { t: 'p', x: 'The first call sheet said 4:30. The crew arrived to a rooftop with no lighting except what was already there: a pale sky, a few sodium lamps below, and a wall that turned from grey to warm in about forty minutes.' },
        { t: 'h', x: 'Why so early' },
        { t: 'p', x: 'We wanted the clothes to look the way they do on an ordinary morning: slightly cold, slightly unplanned. Early light is soft and directional, and it is gone before anyone can over-light the frame. That constraint kept the pictures honest.' },
        { t: 'gal', items: [{ k: 'camp2', cap: 'First light on the roof, 5:40 a.m.' }, { k: 'camp3', cap: 'Wool and mohair, tested against a cold wall.' }] },
        { t: 'h', x: 'What it did to the clothes' },
        { t: 'p', x: 'Cold changes how fabric behaves. The wide trousers held their pleats in a way the studio never showed us, and the shell jacket stiffened just enough to hold the cropped line. We adjusted two hems on set.' },
        { t: 'q', x: 'If it only works under a hundred lights, it does not work.', by: 'Aarav Menon, photography' },
        { t: 'p', x: 'By nine the light had flattened and we stopped. Four mornings, three looks, no retouching on the fabric. Then breakfast.' }
      ]
    },
    'why-we-stopped-chasing-trends': {
      byline: 'Words by the Studio 09 team', products: ['FRM-001', 'FRM-011'],
      intro: 'Making fewer things, slowly, is a harder business decision than it sounds. Some notes on what we gave up and what we got back.',
      blocks: [
        { t: 'p', x: 'For our first two seasons we followed the calendar. Every few weeks something new, every new thing a response to something someone else had just made. It was exhausting and the clothes were fine, which is the worst thing you can say about a garment.' },
        { t: 'h', x: 'What we changed' },
        { t: 'p', x: 'We cut the range by half. We kept the pieces people actually wore, reworked the cut and the cloth, and stopped releasing things we could not explain in one sentence. The Axis tee is still the same tee. It is simply better made than it was.' },
        { t: 'img', k: 'camp9', cap: 'The studio, between fittings.', ratio: 'wide' },
        { t: 'h', x: 'What it costs' },
        { t: 'p', x: 'It costs attention. Fewer launches means fewer reasons to be talked about. We accept that. A smaller range is easier to describe honestly, easier to size and easier to replace when something wears out.' },
        { t: 'q', x: 'We would rather be useful for ten years than interesting for ten days.', by: 'Studio 09' },
        { t: 'p', x: 'Nothing here is a rule. It is just the way we decided to work, and we may change our minds.' }
      ]
    },
    'a-field-guide-to-wide-leg-trousers': {
      byline: 'Words by Ila Rao', products: ['FRM-005', 'FRM-008', 'FRM-006'],
      intro: 'Wide-leg trousers are forgiving until they are not. Rise, break and one fit check will tell you almost everything.',
      blocks: [
        { t: 'h', x: 'Start with the rise' },
        { t: 'p', x: 'A high rise puts the waist at your natural waist and lets the leg fall in one clean line. A mid rise sits lower and works better with a tucked tee or a short top. If a wide trouser feels wrong, the rise is usually the reason.' },
        { t: 'h', x: 'Then the break' },
        { t: 'p', x: 'The break is where the hem meets your shoe. For a wide leg, let it skim the top of the shoe with a small stack, or float just above it if you are wearing something heavy on the foot. A hem that drags is the fastest way to ruin the shape.' },
        { t: 'img', k: 'camp5', cap: 'High-rise pleated trouser with a small stack at the shoe.', ratio: 'tall' },
        { t: 'h', x: 'The one fit check' },
        { t: 'q', x: 'Stand still, then walk. The leg should fall straight both times.', by: 'Ila Rao, styling' },
        { t: 'p', x: 'If the fabric pulls across the hip when you move, size up. If the waist gaps at the back, size down. Our Parallel trouser has a rubberised inner waistband, so a tucked-in shirt stays where you put it.' }
      ]
    },
    'how-to-care-for-raw-denim': {
      byline: 'Words by Kabir Sen', products: ['FRM-007', 'FRM-008'],
      intro: 'Raw denim rewards patience. Wash it less than you think you should, soak it once, and let it fade in the places you actually move.',
      blocks: [
        { t: 'h', x: 'Before the first wear' },
        { t: 'p', x: 'Unwashed denim is stiff and carries extra dye and sizing. Many people soak a new pair once in cool water for around forty minutes, then hang it to dry. This sets the fit and prevents the first wash from shrinking it unevenly. It also shrinks the pair by roughly three percent, so buy it true to size.' },
        { t: 'h', x: 'Wearing it in' },
        { t: 'p', x: 'Wear it often. The fades come from creasing: the whiskers at the hip, the honeycombs behind the knee. There is no shortcut and no correct schedule. Wash when it smells or is dirty, not on a calendar.' },
        { t: 'img', k: 'street1', cap: 'Wear patterns develop where the body moves, so no two pairs fade the same way.', ratio: 'wide' },
        { t: 'h', x: 'Washing' },
        { t: 'p', x: 'Turn them inside out, wash cold on a gentle cycle with a mild detergent, and hang to dry away from direct sun. Avoid the dryer. Heat shrinks cotton and damages the stitching over time.' },
        { t: 'q', x: 'The best pair is the one you stopped thinking about.', by: 'Kabir Sen, studio' }
      ]
    }
  };
})();

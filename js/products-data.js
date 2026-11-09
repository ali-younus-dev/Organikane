/* Organikane product catalogue
 * ---------------------------------------------------------------
 * Add / edit products here. Each product needs:
 *   id        unique slug (also the photo file name, see below)
 *   name      shown on the card
 *   cat       one of the keys in CATEGORIES
 *   mat       one of the keys in MATERIALS
 *   spec      short size / colour line
 *   desc      1–2 sentence description (shown in the product window)
 *   art       which illustration to draw: [functionName, options]
 *   chip      (optional) small size label drawn on the illustration
 *   photo     (optional) path to a real photo; overrides the illustration
 *
 * REAL PHOTOS: save a transparent PNG/WebP (square, ~700px) into images/products/
 * and add  photo:'images/products/your-file.webp'  to that product.
 * It replaces the drawn illustration on the card, in the product window and in the quote.
 * Two products already use your banner photos (bagasse straws, bagasse plates & containers).
 */
window.CATEGORIES = {
  straws:    { label: 'Straws',               tint: '#E6F0D6' },
  cutlery:   { label: 'Cutlery & stirrers',   tint: '#F1E6CE' },
  cups:      { label: 'Cups & cans',          tint: '#DDEBE2' },
  food:      { label: 'Food containers',      tint: '#F2E4D0' },
  paper:     { label: 'Bags & paper',         tint: '#E9EEE2' }
};

window.MATERIALS = {
  paper:    { label: 'Paper',            note: 'Paper-based' },
  bagasse:  { label: 'Sugarcane bagasse', note: 'Sugarcane fibre' },
  wood:     { label: 'Wood',             note: 'Natural wood' },
  kraft:    { label: 'Kraft paper',      note: 'Kraft paper' },
  aluminium:{ label: 'Aluminium',        note: 'Recyclable aluminium' },
  plastic:  { label: 'Food-grade plastic', note: 'Food-grade plastic' }
};

window.PRODUCTS = [
  /* ---------- Straws ---------- */
  { id:'paper-straw-6mm-black', photo:'images/products/paper-straw-6mm-black.webp', cover:true, name:'Paper straws 6 mm, black', cat:'straws', mat:'paper',
    spec:'6 mm · Black', chip:'6 mm',
    desc:'Slim black paper straws for coffee, iced drinks and cocktails. A plastic-free sip.',
    art:['paperStraws',{n:4,w:9,fill:'#232a26',hole:'#0e1210'}] },
  { id:'paper-straw-8mm-black', photo:'images/products/paper-straw-8mm-black.webp', cover:true, name:'Paper straws 8 mm, black', cat:'straws', mat:'paper',
    spec:'8 mm · Black', chip:'8 mm',
    desc:'Wider black paper straws for shakes, smoothies and thick cold drinks.',
    art:['paperStraws',{n:3,w:13,fill:'#232a26',hole:'#0e1210'}] },
  { id:'paper-straw-8mm-white', photo:'images/products/paper-straw-8mm-white.webp', cover:true, name:'Paper straws 8 mm, white', cat:'straws', mat:'paper',
    spec:'8 mm · White', chip:'8 mm',
    desc:'Clean white paper straws that suit every table setting and drink.',
    art:['paperStraws',{n:3,w:13,fill:'#fbfcf9',hole:'#c9d1c5',edge:'#c9d1c5'}] },
  { id:'paper-straw-8mm-red-white', photo:'images/products/paper-straw-8mm-red-white.webp', cover:true, name:'Paper straws 8 mm, red & white stripe', cat:'straws', mat:'paper',
    spec:'8 mm · Red & white stripe', chip:'8 mm',
    desc:'Classic red and white spiral stripe. Cheerful for parties, cafés and kids’ drinks.',
    art:['paperStraws',{n:3,w:13,stripe:true,hole:'#a9b3a5',edge:'#d7ddd3'}] },
  { id:'bagasse-straws-6mm', name:'Bagasse straws 6 mm', cat:'straws', mat:'bagasse',
    spec:'6 mm · Sugarcane fibre', chip:'6 mm', photo:'images/products/bagasse-straws.webp',
    desc:'Straws made from sugarcane fibre, left over after the cane is pressed. Natural look, no plastic.',
    art:['paperStraws',{n:4,w:9,fill:'#e4d3ae',hole:'#8c7448',edge:'#cdb98c'}] },
  { id:'plastic-straws-8mm-straight', photo:'images/products/plastic-straws-8mm-straight.webp', cover:true, name:'Plastic straws 8 mm, straight', cat:'straws', mat:'plastic',
    spec:'8 mm · White & black · Straight', chip:'8 mm',
    desc:'Straight 8 mm straws in white and black for shakes, juices and bubble drinks.',
    art:['plasticStraws',{n:5,w:13}] },
  { id:'plastic-straws-6mm-bendy', photo:'images/products/plastic-straws-6mm-bendy.webp', cover:true, name:'Plastic straws 6 mm, bendy', cat:'straws', mat:'plastic',
    spec:'6 mm · White & black · Bendy', chip:'6 mm',
    desc:'Flexible 6 mm straws in white and black. Easy for children and takeaway drinks.',
    art:['bendyStraws',{}] },
  { id:'paper-wrapped-straws-branded', photo:'images/products/paper-wrapped-straws-branded.webp', cover:true, name:'Paper-wrapped straws with branding', cat:'straws', mat:'paper',
    spec:'Individually wrapped · Your logo',
    desc:'Each straw wrapped in paper printed with your brand. Hygienic, and your logo travels with every drink.',
    art:['wrappedStraws',{}] },

  /* ---------- Cutlery & stirrers ---------- */
  { id:'bagasse-cutlery', photo:'images/products/bagasse-cutlery.webp', cover:true, name:'Bagasse cutlery', cat:'cutlery', mat:'bagasse',
    spec:'Fork · Knife · Spoon',
    desc:'Sturdy cutlery moulded from sugarcane fibre. Fork, knife and spoon for hot and cold food.',
    art:['cutlery',{fill:'#e6d4af',fleck:'#b99c66',edge:'#cdb98c'}] },
  { id:'wooden-cutlery', photo:'images/products/wooden-cutlery.webp', cover:true, name:'Wooden cutlery', cat:'cutlery', mat:'wood',
    spec:'Fork · Knife · Spoon',
    desc:'Smooth natural wooden cutlery for takeaway, events and catering.',
    art:['cutlery',{fill:'#d7ab6c',grain:'#a87a3c',edge:'#bd8f50'}] },
  { id:'plastic-cutlery', name:'Plastic cutlery', cat:'cutlery', mat:'plastic',
    spec:'Fork · Knife · Spoon',
    desc:'Everyday plastic cutlery in white and black for high-volume service.',
    art:['cutlery',{plastic:true}] },
  { id:'wooden-stirrer', photo:'images/products/wooden-stirrer.webp', cover:true, name:'Wooden stirrer', cat:'cutlery', mat:'wood',
    spec:'Hot & cold drinks',
    desc:'Flat wooden stirrers for tea, coffee and sachet drinks.',
    art:['stirrers',{}] },

  /* ---------- Cups & cans ---------- */
  { id:'paper-cup-8oz-double-wall', photo:'images/products/paper-cup-8oz-double-wall.webp', cover:true, name:'Double wall paper cups 8 oz', cat:'cups', mat:'paper',
    spec:'8 oz · Double wall · With lid', chip:'8 oz',
    desc:'Insulated double wall cups that keep hot drinks hot and hands comfortable. No sleeve needed.',
    art:['paperCup',{s:.86,body:'#c69b66',lid:'#f4f6f1',label:'#2f6b3f'}] },
  { id:'paper-cup-12oz-double-wall', photo:'images/products/paper-cup-12oz-double-wall.webp', cover:true, name:'Double wall paper cups 12 oz', cat:'cups', mat:'paper',
    spec:'12 oz · Double wall · With lid', chip:'12 oz',
    desc:'Larger double wall cups for lattes and teas. Comfortable to hold, easy to carry.',
    art:['paperCup',{s:1,body:'#2b332e',lid:'#2b332e',label:'#a6d06e'}] },
  { id:'plastic-cold-cup-12oz', photo:'images/products/plastic-cold-cup-12oz.webp', cover:true, name:'Plastic cold cups 12 oz', cat:'cups', mat:'plastic',
    spec:'12 oz · Clear · Dome lid', chip:'12 oz',
    desc:'Crystal-clear cold cups with a dome lid for iced coffee, tea and juices.',
    art:['coldCup',{y0:108,liquid:'#a5683a'}] },
  { id:'plastic-cold-cup-16oz', photo:'images/products/plastic-cold-cup-16oz.webp', cover:true, name:'Plastic cold cups 16 oz', cat:'cups', mat:'plastic',
    spec:'16 oz · Clear · Dome lid', chip:'16 oz',
    desc:'The larger size for smoothies, frappes and big iced drinks.',
    art:['coldCup',{y0:88,liquid:'#9ccc65'}] },
  { id:'coffee-pet-cans', photo:'images/products/coffee-pet-cans.webp', cover:true, name:'Coffee PET cans', cat:'cups', mat:'plastic',
    spec:'PET · Ready-to-drink',
    desc:'Clear PET cans with an easy-open lid for cold brew and ready-to-drink coffee.',
    art:['petCans',{}] },

  /* ---------- Food containers ---------- */
  { id:'aluminium-container-f1', photo:'images/products/aluminium-container-f1.webp', cover:true, name:'Aluminium container F1', cat:'food', mat:'aluminium',
    spec:'Size F1 · With lid', chip:'F1',
    desc:'Compact aluminium foil container with lid. Holds heat well for takeaway and delivery.',
    art:['foilTray',{W:104,h:70,d:22}] },
  { id:'aluminium-container-f2', photo:'images/products/aluminium-container-f2.webp', cover:true, name:'Aluminium container F2', cat:'food', mat:'aluminium',
    spec:'Size F2 · With lid', chip:'F2',
    desc:'Mid-size aluminium foil container with lid for meals, rice dishes and grills.',
    art:['foilTray',{W:134,h:62,d:24}] },
  { id:'aluminium-container-f3', photo:'images/products/aluminium-container-f3.webp', cover:true, name:'Aluminium container F3', cat:'food', mat:'aluminium',
    spec:'Size F3 · With lid', chip:'F3',
    desc:'Large aluminium foil container with lid for family portions and catering.',
    art:['foilTray',{W:168,h:54,d:26}] },
  { id:'kraft-salad-bowl', photo:'images/products/kraft-salad-bowl.webp', cover:true, name:'Kraft salad bowl', cat:'food', mat:'kraft',
    spec:'Kraft · Clear lid',
    desc:'Round kraft paper bowl with a clear lid for salads, noodles and cold meals.',
    art:['saladBowl',{}] },
  { id:'bagasse-plates-containers', cover:true, name:'Bagasse plates & containers', cat:'food', mat:'bagasse',
    spec:'Plates · Bowls · Containers', photo:'images/products/bagasse-plates-containers.webp',
    desc:'Plates, bowls and lidded containers pressed from sugarcane fibre. Sturdy, stylish and compostable.',
    art:['saladBowl',{}] },
  { id:'kraft-burger-boxes', photo:'images/products/kraft-burger-boxes.webp', cover:true, name:'Kraft burger boxes', cat:'food', mat:'kraft',
    spec:'Kraft · Fold-lid',
    desc:'Kraft paper boxes sized for burgers, sandwiches and wraps.',
    art:['burgerBox',{}] },
  { id:'kraft-dessert-boxes', photo:'images/products/kraft-dessert-boxes.webp', cover:true, name:'Kraft dessert boxes', cat:'food', mat:'kraft',
    spec:'Kraft · Window front',
    desc:'Kraft boxes with a clear window to show off cakes, slices and pastries.',
    art:['dessertBox',{}] },
  { id:'plastic-sauce-dips', photo:'images/products/plastic-sauce-dips.webp', cover:true, name:'Plastic sauce dips', cat:'food', mat:'plastic',
    spec:'Portion cups · With lids',
    desc:'Small portion cups with lids for ketchup, mayo and dips.',
    art:['sauceDips',{}] },

  /* ---------- Bags & paper ---------- */
  { id:'tissue-paper-small', photo:'images/products/tissue-paper-small.webp', cover:true, name:'Tissue paper, small', cat:'paper', mat:'paper',
    spec:'Small', chip:'Small',
    desc:'Soft small-format tissue for tables, trays and takeaway.',
    art:['tissue',{k:.78}] },
  { id:'tissue-paper-large', photo:'images/products/tissue-paper-large.webp', cover:true, name:'Tissue paper, large', cat:'paper', mat:'paper',
    spec:'Large', chip:'Large',
    desc:'Large-format tissue sheets for tables and wrapping.',
    art:['tissue',{k:1.18}] },
  { id:'kraft-takeaway-bags', photo:'images/products/kraft-takeaway-bags.webp', cover:true, name:'Kraft takeaway bags', cat:'paper', mat:'kraft',
    spec:'Kraft · Paper handles',
    desc:'Strong kraft paper bags with paper handles. Can be printed with your logo.',
    art:['kraftBag',{}] },
  { id:'paper-table-mats', photo:'images/products/paper-table-mats.webp', cover:true, name:'Paper table mats', cat:'paper', mat:'paper',
    spec:'Tray & table mats',
    desc:'Paper mats that keep trays and tables clean. Printable with your branding.',
    art:['tableMats',{}] },
  { id:'butter-paper', photo:'images/products/butter-paper.webp', cover:true, name:'Butter paper', cat:'paper', mat:'paper',
    spec:'Greaseproof · Roll & sheets',
    desc:'Greaseproof paper for wrapping and lining burgers, rolls, sweets and baked goods.',
    art:['butterPaper',{}] }
];

/* Why-choose and testimonial copy lives in index.html; contact details in config.js */

/* Organikane product illustrations
 * Each function returns SVG markup for a 240×240 tile. `u` is a unique id used for gradients/clips.
 * Used when a product has no real photo. Draw order: back to front. */
(function () {
  var INK = '#17301B', LEAF = '#3E7A33', LIME = '#8CBC58';

  function shadow(rx) { return '<ellipse cx="120" cy="208" rx="' + (rx || 66) + '" ry="7" fill="' + INK + '" opacity=".13"/>'; }

  /* ---------- straws ---------- */
  function straw(o) {
    var w = o.w, len = o.len, rot = o.rot || 0, cx = o.cx == null ? 120 : o.cx;
    var fill = o.fill, edge = o.edge || 'rgba(0,0,0,.12)', hole = o.hole || '#111';
    return '<g transform="translate(' + cx + ' 206) rotate(' + rot + ')">' +
      '<rect x="' + (-w / 2) + '" y="' + (-len) + '" width="' + w + '" height="' + len + '" rx="1.5" fill="' + fill + '" stroke="' + edge + '" stroke-width="1"/>' +
      '<rect x="' + (-w / 2 + w * .16) + '" y="' + (-len + 8) + '" width="' + (w * .15) + '" height="' + (len - 16) + '" rx="' + (w * .08) + '" fill="#fff" opacity="' + (o.hiOp || .3) + '"/>' +
      '<ellipse cx="0" cy="' + (-len) + '" rx="' + (w / 2) + '" ry="' + (w * .21) + '" fill="' + fill + '" stroke="' + edge + '" stroke-width="1"/>' +
      '<ellipse cx="0" cy="' + (-len) + '" rx="' + (w * .33) + '" ry="' + (w * .13) + '" fill="' + hole + '"/></g>';
  }
  function fan(n, spread) {
    var out = [], i;
    for (i = 0; i < n; i++) out.push(n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1));
    return out;
  }
  function paperStraws(u, o) {
    var angles = fan(o.n, o.n > 3 ? 17 : 13), lens = [138, 152, 146, 134, 142];
    var defs = '', fill = o.fill;
    if (o.stripe) {
      defs = '<defs><pattern id="st-' + u + '" width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">' +
        '<rect width="15" height="15" fill="#fbfcf9"/><rect width="7.5" height="15" fill="#c8452f"/></pattern></defs>';
      fill = 'url(#st-' + u + ')';
    }
    var order = angles.map(function (a, i) { return i; }).sort(function (a, b) { return Math.abs(angles[b]) - Math.abs(angles[a]); });
    var s = order.map(function (i) {
      return straw({ w: o.w, len: lens[i % 5], rot: angles[i], fill: fill, edge: o.edge, hole: o.hole, hiOp: o.stripe ? .18 : .3 });
    }).join('');
    return defs + shadow(54) + '<g class="sway">' + s + '</g>';
  }
  function plasticStraws(u, o) {
    var angles = fan(5, 20), cols = ['#232a26', '#fbfcf9', '#232a26', '#fbfcf9', '#232a26'], s = '';
    var order = [0, 4, 1, 3, 2];
    order.forEach(function (i) {
      var white = cols[i] === '#fbfcf9';
      s += straw({ w: o.w, len: 148 - Math.abs(i - 2) * 4, rot: angles[i], fill: cols[i], edge: white ? '#c9d1c5' : 'rgba(255,255,255,.25)', hole: white ? '#b7c0b3' : '#050605', hiOp: .5 });
    });
    return shadow(56) + '<g class="sway">' + s + '</g>';
  }
  function bendy(cx, rot, fill, edge, w) {
    var ribs = '', ribC = fill === '#fbfcf9' ? '#b9c2b5' : '#000', hole = fill === '#fbfcf9' ? '#b7c0b3' : '#050605';
    for (var i = 0; i < 6; i++) ribs += '<path d="M' + (-w / 2) + ' ' + (-98 - i * 4.4) + ' L' + (w / 2) + ' ' + (-98 - i * 4.4) + '" stroke="' + ribC + '" stroke-width="1.5" opacity=".6"/>';
    return '<g transform="translate(' + cx + ' 206) rotate(' + rot + ')">' +
      '<rect x="' + (-w / 2) + '" y="-122" width="' + w + '" height="122" rx="1.5" fill="' + fill + '" stroke="' + edge + '"/>' +
      ribs +
      '<rect x="' + (-w / 2 + 2) + '" y="-94" width="2.2" height="90" rx="1" fill="#fff" opacity=".4"/>' +
      '<g transform="translate(0 -122) rotate(48)">' +
      '<rect x="' + (-w / 2) + '" y="-50" width="' + w + '" height="50" rx="1.5" fill="' + fill + '" stroke="' + edge + '"/>' +
      '<circle cx="0" cy="0" r="' + (w / 2) + '" fill="' + fill + '"/>' +
      '<ellipse cx="0" cy="-50" rx="' + (w / 2) + '" ry="' + (w * .21) + '" fill="' + fill + '" stroke="' + edge + '"/>' +
      '<ellipse cx="0" cy="-50" rx="' + (w * .33) + '" ry="' + (w * .13) + '" fill="' + hole + '"/></g></g>';
  }
  function bendyStraws() {
    return shadow(56) + '<g class="sway">' +
      bendy(92, -4, '#232a26', 'rgba(255,255,255,.25)', 10) +
      bendy(150, 4, '#232a26', 'rgba(255,255,255,.25)', 10) +
      bendy(120, 0, '#fbfcf9', '#c9d1c5', 10) + '</g>';
  }
  function wrapped(cx, rot, paper, u, len) {
    var w = 17, dots = '';
    for (var y = -len + 34; y < -10; y += 24) {
      dots += '<g transform="translate(0 ' + y + ')"><circle r="4.6" fill="' + LEAF + '"/><path d="M0 -2.6 Q3.4 -.4 0 3 Q-3.4 -.4 0 -2.6Z" fill="#dff0c4"/></g>';
    }
    var tear = '<path d="M' + (-w / 2) + ' ' + (-len + 20) + ' l3 -4 l3 4 l3 -4 l3 4 l3 -4 l' + (w - 15) + ' 4 Z" fill="' + paper + '"/>';
    return '<g transform="translate(' + cx + ' 206) rotate(' + rot + ')">' +
      '<rect x="-4.5" y="' + (-len) + '" width="9" height="30" rx="1.5" fill="#232a26"/>' +
      '<ellipse cx="0" cy="' + (-len) + '" rx="4.5" ry="1.9" fill="#232a26" stroke="rgba(255,255,255,.25)"/><ellipse cx="0" cy="' + (-len) + '" rx="3" ry="1.1" fill="#050605"/>' +
      '<rect x="' + (-w / 2) + '" y="' + (-len + 20) + '" width="' + w + '" height="' + (len - 20) + '" fill="' + paper + '" stroke="rgba(23,48,27,.14)"/>' +
      tear + dots +
      '<rect x="' + (-w / 2 + 3) + '" y="' + (-len + 24) + '" width="2.4" height="' + (len - 30) + '" fill="#fff" opacity=".45"/></g>';
  }
  function wrappedStraws(u) {
    return shadow(56) + '<g class="sway">' + wrapped(86, -13, '#e3c79c', u, 142) + wrapped(154, 13, '#e3c79c', u, 142) + wrapped(120, 0, '#f6f1e3', u, 156) + '</g>';
  }

  /* ---------- cutlery ---------- */
  function utensil(kind, o) {
    var fill = o.fill, edge = o.edge || 'rgba(0,0,0,.14)', deco = '';
    var handle = '<path d="M-4.8 0 Q0 5 4.8 0 L3.4 -98 L-3.4 -98 Z" fill="' + fill + '" stroke="' + edge + '"/>';
    var head;
    if (kind === 'spoon') {
      head = '<ellipse cx="0" cy="-122" rx="19.5" ry="27" fill="' + fill + '" stroke="' + edge + '"/><ellipse cx="0" cy="-124" rx="13" ry="20" fill="#000" opacity=".07"/>';
    } else if (kind === 'fork') {
      var tines = '';
      for (var i = 0; i < 4; i++) tines += '<rect x="' + (-17 + i * 9.6) + '" y="-154" width="5.4" height="42" rx="2.7" fill="' + fill + '" stroke="' + edge + '"/>';
      head = tines + '<path d="M-17 -122 L17 -122 Q17 -100 3.4 -94 L-3.4 -94 Q-17 -100 -17 -122Z" fill="' + fill + '" stroke="' + edge + '"/>';
    } else {
      head = '<path d="M-3.4 -92 L-3.4 -150 Q-3.4 -170 8 -178 L10.5 -178 L10.5 -92 Z" fill="' + fill + '" stroke="' + edge + '"/>';
    }
    if (o.grain) deco = '<path d="M-1.4 -8 L-1 -86 M1.4 -14 L1.8 -80" stroke="' + o.grain + '" stroke-width=".9" opacity=".55" fill="none"/>' +
      (kind === 'knife' ? '<path d="M3 -100 L3.6 -156 M8 -102 L8 -150" stroke="' + o.grain + '" stroke-width=".9" opacity=".5" fill="none"/>' : '<path d="M-6 -118 Q0 -112 6 -118 M-8 -130 Q0 -124 8 -130" stroke="' + o.grain + '" stroke-width=".9" opacity=".45" fill="none"/>');
    if (o.fleck) {
      var d = [[-1.5, -20], [1.5, -44], [-1, -66], [2, -84], [-8, -118], [7, -128], [0, -140], [-5, -132], [6, -108], [7, -150], [-6, -146]];
      deco = d.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".9" fill="' + o.fleck + '"/>'; }).join('');
    }
    var hi = '<rect x="-2.3" y="-92" width="1.6" height="86" rx=".8" fill="#fff" opacity="' + (o.hiOp || .35) + '"/>';
    return handle + head + deco + hi;
  }
  function cutlery(u, o) {
    var items;
    if (o.plastic) {
      items = [
        ['knife', -22, 80, { fill: '#232a26', edge: 'rgba(255,255,255,.2)', hiOp: .28 }],
        ['spoon', 22, 160, { fill: '#232a26', edge: 'rgba(255,255,255,.2)', hiOp: .28 }],
        ['fork', 0, 120, { fill: '#fbfcf9', edge: '#c3cbbf', hiOp: .7 }]
      ];
    } else {
      items = [['knife', -21, 82, o], ['spoon', 21, 158, o], ['fork', 0, 120, o]];
    }
    return shadow(54) + '<g class="sway">' + items.map(function (it) {
      return '<g transform="translate(' + it[2] + ' 206) rotate(' + it[1] + ')">' + utensil(it[0], it[3]) + '</g>';
    }).join('') + '</g>';
  }
  function stirrers() {
    var s = '', a = [-21, -11, 0, 11, 21], L = [140, 150, 156, 150, 140];
    [0, 4, 1, 3, 2].forEach(function (i) {
      s += '<g transform="translate(120 206) rotate(' + a[i] + ')">' +
        '<rect x="-6.5" y="' + (-L[i]) + '" width="13" height="' + L[i] + '" rx="6.5" fill="#d7ab6c" stroke="#bd8f50"/>' +
        '<path d="M-2 -10 L-1.6 ' + (-L[i] + 14) + ' M2.2 -16 L2.6 ' + (-L[i] + 20) + '" stroke="#a87a3c" stroke-width=".9" opacity=".6" fill="none"/>' +
        '<rect x="-4.4" y="' + (-L[i] + 8) + '" width="1.8" height="' + (L[i] - 16) + '" rx=".9" fill="#fff" opacity=".35"/></g>';
    });
    return shadow(50) + '<g class="sway">' + s + '</g>';
  }

  /* ---------- cups ---------- */
  function paperCup(u, o) {
    var body = 'M82 114 L158 114 L147 200 Q146 205 141 205 L99 205 Q94 205 93 200 Z';
    var rip = '', y;
    for (y = 132; y < 205; y += 17) rip += '<path d="M60 ' + y + ' q9 -6 18 0 t18 0 t18 0 t18 0 t18 0 t18 0" fill="none" stroke="#000" stroke-width="2.2" opacity=".16"/><path d="M60 ' + (y + 2.6) + ' q9 -6 18 0 t18 0 t18 0 t18 0 t18 0 t18 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".2"/>';
    var dark = o.lid === '#2b332e';
    return '<defs><clipPath id="cp-' + u + '"><path d="' + body + '"/></clipPath>' +
      '<linearGradient id="cg-' + u + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>' +
      shadow(60) +
      '<g transform="translate(120 206) scale(' + o.s + ') translate(-120 -206)">' +
      '<path d="' + body + '" fill="' + o.body + '"/>' +
      '<g clip-path="url(#cp-' + u + ')">' + rip + '<rect x="70" y="114" width="100" height="92" fill="url(#cg-' + u + ')"/></g>' +
      '<g transform="translate(120 163)"><circle r="15" fill="' + (dark ? '#fff' : '#fff') + '" opacity=".92"/><g transform="translate(0 1)"><path d="M0 -8 Q9 -2 0 9 Q-9 -2 0 -8Z" fill="' + o.label + '"/><path d="M0 -4 L0 9" stroke="#fff" stroke-width="1.3"/></g></g>' +
      '<path d="M90 100 Q90 84 105 84 L135 84 Q150 84 150 100 Z" fill="' + o.lid + '" stroke="rgba(0,0,0,.12)"/>' +
      '<path d="M75 114 L75 107 Q75 99 83 99 L157 99 Q165 99 165 107 L165 114 Z" fill="' + o.lid + '" stroke="rgba(0,0,0,.14)"/>' +
      '<path d="M78 108 L162 108" stroke="#000" opacity=".14"/><ellipse cx="133" cy="91" rx="7" ry="2.4" fill="#000" opacity=".4"/>' +
      '<path d="M97 92 Q99 87 108 87" stroke="#fff" stroke-width="2" fill="none" opacity="' + (dark ? .25 : .7) + '" stroke-linecap="round"/>' +
      '<g class="steam" fill="none" stroke="#8fa896" stroke-width="3.2" stroke-linecap="round"><path d="M112 74 q-7 -9 0 -18 t0 -16"/><path d="M128 72 q-7 -9 0 -18 t0 -16"/><path d="M144 76 q-7 -9 0 -18 t0 -16"/></g></g>';
  }
  function coldCup(u, o) {
    var y0 = o.y0, tw = 44, bw = 31;
    var body = 'M' + (120 - tw) + ' ' + y0 + ' L' + (120 + tw) + ' ' + y0 + ' L' + (120 + bw) + ' 200 Q' + (120 + bw - 1) + ' 205 ' + (120 + bw - 6) + ' 205 L' + (120 - bw + 6) + ' 205 Q' + (120 - bw + 1) + ' 205 ' + (120 - bw) + ' 200 Z';
    var ice = '';
    [[98, 1], [128, 2], [112, 3], [136, 4], [92, 5]].forEach(function (p, i) {
      var cy = y0 + 34 + (i % 3) * 22 + (i > 2 ? 8 : 0);
      ice += '<g class="bob" style="animation-delay:' + (i * -.7) + 's"><rect x="' + (p[0] - 11) + '" y="' + (cy - 11) + '" width="22" height="22" rx="5" transform="rotate(' + (p[1] * 14 - 20) + ' ' + p[0] + ' ' + cy + ')" fill="#fff" opacity=".42" stroke="#fff" stroke-opacity=".6"/></g>';
    });
    var dome = 'M80 ' + (y0 - 2) + ' Q80 ' + (y0 - 36) + ' 120 ' + (y0 - 36) + ' Q160 ' + (y0 - 36) + ' 160 ' + (y0 - 2) + ' Z';
    return '<defs><clipPath id="cc-' + u + '"><path d="' + body + '"/></clipPath>' +
      '<linearGradient id="cl-' + u + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".3" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/></linearGradient></defs>' +
      shadow(56) +
      '<path d="' + body + '" fill="#eef5ee" fill-opacity=".55"/>' +
      '<g clip-path="url(#cc-' + u + ')"><rect x="60" y="' + (y0 + 14) + '" width="120" height="200" fill="' + o.liquid + '" opacity=".92"/>' +
      '<rect x="60" y="' + (y0 + 14) + '" width="120" height="6" fill="#fff" opacity=".35"/>' + ice + '<rect x="60" y="' + y0 + '" width="120" height="200" fill="url(#cl-' + u + ')"/></g>' +
      '<path d="' + body + '" fill="none" stroke="' + INK + '" stroke-opacity=".28" stroke-width="1.6"/>' +
      '<path d="' + dome + '" fill="#f4faf4" fill-opacity=".55" stroke="' + INK + '" stroke-opacity=".28" stroke-width="1.6"/>' +
      '<rect x="74" y="' + (y0 - 5) + '" width="92" height="8" rx="4" fill="#f4faf4" fill-opacity=".8" stroke="' + INK + '" stroke-opacity=".3"/>' +
      '<path d="M96 ' + (y0 - 14) + ' Q98 ' + (y0 - 26) + ' 110 ' + (y0 - 29) + '" stroke="#fff" stroke-width="3" fill="none" opacity=".9" stroke-linecap="round"/>' +
      '<g transform="rotate(7 122 ' + (y0 + 80) + ')"><rect x="117" y="' + (y0 - 56) + '" width="10" height="' + (y0 + 100 - (y0 - 56) - 24) + '" rx="1.5" fill="' + LEAF + '"/><rect x="119.4" y="' + (y0 - 52) + '" width="2" height="' + 90 + '" fill="#fff" opacity=".4"/></g>';
  }
  function petCans() {
    function can(cx, top, liquid, lbl, scale) {
      var h = 205 - top, x = cx - 33;
      return '<g transform="translate(' + cx + ' 205) scale(' + scale + ') translate(' + (-cx) + ' -205)">' +
        '<rect x="' + x + '" y="' + top + '" width="66" height="' + h + '" rx="8" fill="#eef5ee" fill-opacity=".6" stroke="' + INK + '" stroke-opacity=".3" stroke-width="1.6"/>' +
        '<rect x="' + (x + 2) + '" y="' + (top + 34) + '" width="62" height="' + (h - 36) + '" rx="6" fill="' + liquid + '" opacity=".95"/>' +
        '<rect x="' + (x + 2) + '" y="' + (top + 34) + '" width="62" height="5" fill="#fff" opacity=".3"/>' +
        '<rect x="' + (x + 1) + '" y="' + (top + h * .42) + '" width="64" height="' + (h * .3) + '" fill="#d9b183"/>' +
        '<text x="' + cx + '" y="' + (top + h * .42 + h * .19) + '" font-family="Montserrat,sans-serif" font-weight="700" font-size="11" text-anchor="middle" fill="' + INK + '">COFFEE</text>' +
        '<rect x="' + (x - 3) + '" y="' + (top - 6) + '" width="72" height="14" rx="5" fill="#c9d1cc" stroke="#9aa59f"/>' +
        '<ellipse cx="' + cx + '" cy="' + (top - 6) + '" rx="30" ry="6" fill="#dfe5e1" stroke="#9aa59f"/>' +
        '<ellipse cx="' + (cx + 6) + '" cy="' + (top - 6) + '" rx="9" ry="3" fill="none" stroke="#7d8983" stroke-width="2"/>' +
        '<rect x="' + (x + 6) + '" y="' + (top + 40) + '" width="4" height="' + (h - 52) + '" rx="2" fill="#fff" opacity=".45"/></g>';
    }
    return shadow(62) + can(86, 82, '#e9dcc8', 0, .9) + can(142, 60, '#4a2f1c', 0, 1);
  }

  /* ---------- containers ---------- */
  function foilTray(u, o) {
    var W = o.W, h = o.h, d = o.d, x0 = 120 - W / 2, x1 = 120 + W / 2, yT = 202 - h, bi = 8;
    var ridges = '', i, n = Math.round(W / 15);
    for (i = 1; i < n; i++) {
      var tx = x0 + (W / n) * i, bx = x0 + bi + ((W - 2 * bi) / n) * i;
      ridges += '<path d="M' + tx + ' ' + (yT + 7) + ' L' + bx + ' 199" stroke="#7f8a85" stroke-width="1.3" opacity=".45"/><path d="M' + (tx + 2) + ' ' + (yT + 7) + ' L' + (bx + 2) + ' 199" stroke="#fff" stroke-width="1.3" opacity=".55"/>';
    }
    var inset = 8, rice = '';
    [[0, 1], [1, 3], [2, 2], [3, 4], [4, 1], [5, 3]].forEach(function (p) { rice += '<circle cx="' + (x0 + 24 + p[0] * ((W - 56) / 5)) + '" cy="' + (yT - d * .4 + (p[1] % 3) * 3) + '" r="' + (3 + (p[1] % 2)) + '" fill="' + (p[1] > 2 ? '#d64535' : '#7cb342') + '"/>'; });
    var top = 'M' + (x0 + 14) + ' ' + (yT - d) + ' L' + (x1 - 14) + ' ' + (yT - d) + ' L' + (x1 + 2) + ' ' + yT + ' L' + (x0 - 2) + ' ' + yT + ' Z';
    return '<defs><linearGradient id="fg-' + u + '" x1="0" x2="1"><stop offset="0" stop-color="#d7ddd9"/><stop offset=".25" stop-color="#f7f9f7"/><stop offset=".55" stop-color="#b8c1bc"/><stop offset=".8" stop-color="#e9edea"/><stop offset="1" stop-color="#aeb8b2"/></linearGradient></defs>' +
      shadow(W / 2 + 6) +
      '<path d="' + top + '" fill="#c4cbc7" stroke="#8f9a94"/>' +
      '<path d="M' + (x0 + 14 + inset) + ' ' + (yT - d + 5) + ' L' + (x1 - 14 - inset) + ' ' + (yT - d + 5) + ' L' + (x1 - 4) + ' ' + (yT - 3) + ' L' + (x0 + 4) + ' ' + (yT - 3) + ' Z" fill="#e8c46a"/>' +
      '<g>' + rice + '</g>' +
      '<path d="' + top + '" fill="#fff" opacity=".28"/>' +
      '<path d="M' + x0 + ' ' + yT + ' L' + x1 + ' ' + yT + ' L' + (x1 - bi) + ' 202 Q' + (x1 - bi - 1) + ' 205 ' + (x1 - bi - 6) + ' 205 L' + (x0 + bi + 6) + ' 205 Q' + (x0 + bi + 1) + ' 205 ' + (x0 + bi) + ' 202 Z" fill="url(#fg-' + u + ')" stroke="#8f9a94"/>' +
      ridges +
      '<rect x="' + (x0 - 4) + '" y="' + (yT - 3) + '" width="' + (W + 8) + '" height="9" rx="4.5" fill="url(#fg-' + u + ')" stroke="#8f9a94"/>';
  }
  function saladBowl(u) {
    var leaves = '';
    [[84, 118, '#7cb342', -30], [104, 108, '#9ccc65', 10], [126, 110, '#558b2f', 40], [146, 118, '#9ccc65', -10], [96, 124, '#558b2f', 60], [136, 124, '#7cb342', -50], [116, 118, '#aed581', 0]].forEach(function (l) {
      leaves += '<ellipse cx="' + l[0] + '" cy="' + l[1] + '" rx="17" ry="9" transform="rotate(' + l[3] + ' ' + l[0] + ' ' + l[1] + ')" fill="' + l[2] + '" stroke="rgba(23,48,27,.2)"/>';
    });
    return '<defs><linearGradient id="bg-' + u + '" x1="0" x2="1"><stop offset="0" stop-color="#d3a674"/><stop offset=".4" stop-color="#c79a66"/><stop offset="1" stop-color="#a87a4a"/></linearGradient></defs>' +
      shadow(70) +
      '<path d="M44 124 Q48 200 120 204 Q192 200 196 124 Z" fill="url(#bg-' + u + ')"/>' +
      '<ellipse cx="120" cy="124" rx="76" ry="16" fill="#8a6338"/>' + leaves +
      '<circle cx="108" cy="104" r="8" fill="#d64535"/><circle cx="105" cy="101" r="2.4" fill="#fff" opacity=".6"/>' +
      '<circle cx="140" cy="108" r="7.5" fill="#d64535"/><g fill="none" stroke="#b9dca0" stroke-width="3"><circle cx="124" cy="100" r="7"/></g>' +
      '<path d="M46 126 Q120 146 194 126" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>' +
      '<path d="M44 124 Q48 200 120 204 Q192 200 196 124" fill="none" stroke="rgba(0,0,0,.1)"/>' +
      '<g transform="translate(120 170)"><circle r="17" fill="#fff" opacity=".92"/><g><path d="M0 -9 Q10 -2 0 10 Q-10 -2 0 -9Z" fill="' + LEAF + '"/><path d="M0 -4 L0 10" stroke="#fff" stroke-width="1.3"/></g></g>' +
      '<path d="M50 122 Q50 54 120 54 Q190 54 190 122 Z" fill="#f4faf4" fill-opacity=".4" stroke="' + INK + '" stroke-opacity=".25" stroke-width="1.5"/>' +
      '<rect x="46" y="119" width="148" height="8" rx="4" fill="#f4faf4" fill-opacity=".85" stroke="' + INK + '" stroke-opacity=".28"/>' +
      '<path d="M76 108 Q78 78 104 66" stroke="#fff" stroke-width="3.5" fill="none" opacity=".85" stroke-linecap="round"/>';
  }
  function box(x, y, w, h, d, fills) { /* oblique kraft box: front (x,y,w,h), depth d going up-right */
    var dx = d, dy = -d * .55;
    return '<path d="M' + x + ' ' + y + ' L' + (x + w) + ' ' + y + ' L' + (x + w) + ' ' + (y + h) + ' L' + x + ' ' + (y + h) + ' Z" fill="' + fills[0] + '"/>' +
      '<path d="M' + (x + w) + ' ' + y + ' L' + (x + w + dx) + ' ' + (y + dy) + ' L' + (x + w + dx) + ' ' + (y + h + dy) + ' L' + (x + w) + ' ' + (y + h) + ' Z" fill="' + fills[1] + '"/>' +
      '<path d="M' + x + ' ' + y + ' L' + (x + dx) + ' ' + (y + dy) + ' L' + (x + w + dx) + ' ' + (y + dy) + ' L' + (x + w) + ' ' + y + ' Z" fill="' + fills[2] + '"/>';
  }
  function burgerBox() {
    var ink = '#5b3e21';
    return shadow(74) +
      box(44, 118, 110, 84, 44, ['#c9a06c', '#a97b4c', '#dcb685']) +
      '<path d="M44 140 L154 140" stroke="#000" opacity=".12"/><path d="M154 118 L198 94" stroke="#000" opacity=".1"/>' +
      '<rect x="92" y="130" width="14" height="5" rx="2.5" fill="#a97b4c"/>' +
      '<g transform="translate(99 172)" fill="none" stroke="' + ink + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M-26 -4 Q-26 -26 0 -26 Q26 -26 26 -4 Z" fill="' + ink + '" fill-opacity=".14"/><path d="M-30 4 q6 -6 12 0 t12 0 t12 0 t12 0 t12 0"/>' +
      '<path d="M-28 12 L28 12"/><path d="M-26 20 Q-26 28 -18 28 L18 28 Q26 28 26 20 Z" fill="' + ink + '" fill-opacity=".14"/></g>' +
      '<path d="M180 112 L190 107" stroke="#fff" opacity=".25" stroke-width="2"/>';
  }
  function dessertBox() {
    return shadow(70) +
      box(52, 128, 104, 74, 40, ['#c9a06c', '#a97b4c', '#dcb685']) +
      '<rect x="66" y="142" width="76" height="46" rx="9" fill="#f6faf6" opacity=".92" stroke="#fff"/>' +
      '<g transform="translate(104 188)">' +
      '<path d="M-26 0 L-26 -22 L26 -22 L26 0 Z" fill="#f2d39b"/><rect x="-26" y="-13" width="52" height="5" fill="#fff4e0"/>' +
      '<path d="M-26 -22 Q-26 -30 -14 -30 Q-8 -40 2 -32 Q16 -38 20 -30 Q26 -28 26 -22 Z" fill="#fff4e0" stroke="#e9d9bd"/>' +
      '<circle cx="-4" cy="-38" r="5" fill="#d9534f"/><path d="M-4 -43 Q0 -50 5 -48" stroke="#558b2f" stroke-width="2" fill="none"/>' +
      '</g>' +
      '<path d="M72 148 L84 146" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>' +
      '<path d="M52 128 L156 128" stroke="#000" opacity=".1"/>';
  }
  function dip(cx, cy, s, sauce) {
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')">' +
      '<path d="M-26 -36 L26 -36 L19 0 Q18 3 15 3 L-15 3 Q-18 3 -19 0 Z" fill="#eef5ee" fill-opacity=".7" stroke="' + INK + '" stroke-opacity=".3" stroke-width="1.6"/>' +
      '<path d="M-23.6 -22 L23.6 -22 L19 0 Q18 3 15 3 L-15 3 Q-18 3 -19 0 Z" fill="' + sauce + '"/>' +
      '<path d="M-20 -22 Q-8 -28 0 -22 Q10 -28 22 -22" fill="' + sauce + '"/>' +
      '<path d="M-17 -30 L-13 -6" stroke="#fff" stroke-width="2.4" opacity=".7" stroke-linecap="round"/>' +
      '<rect x="-29" y="-42" width="58" height="8" rx="4" fill="#f4faf4" stroke="' + INK + '" stroke-opacity=".3"/>' +
      '<path d="M18 -40 L34 -52 L38 -47 L26 -36Z" fill="#f4faf4" stroke="' + INK + '" stroke-opacity=".3"/></g>';
  }
  function sauceDips() {
    return shadow(70) + dip(80, 156, 1, '#e8b533') + dip(164, 156, 1, '#7cb342') + dip(122, 196, 1.28, '#d1352b');
  }

  /* ---------- bags & paper ---------- */
  function tissue(u, o) {
    var k = o.k, s = 108 * k, pat = '';
    var sheet = function (rot, dx, dy, op) {
      return '<g transform="translate(' + (120 + dx) + ' ' + (150 + dy) + ') rotate(' + rot + ')"><rect x="' + (-s / 2) + '" y="' + (-s / 2) + '" width="' + s + '" height="' + s + '" rx="3" fill="#fff" fill-opacity="' + op + '" stroke="#cdd7c8"/></g>';
    };
    return '<defs><pattern id="tp-' + u + '" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="5.5" cy="5.5" r="1.3" fill="#c3cfbd"/></pattern></defs>' +
      shadow(60 * k) +
      sheet(-10, -6, 6, .75) + sheet(8, 8, 4, .85) + sheet(-3, 0, 0, .96) +
      '<g transform="translate(120 150) rotate(-3)"><rect x="' + (-s / 2 + 6) + '" y="' + (-s / 2 + 6) + '" width="' + (s - 12) + '" height="' + (s - 12) + '" rx="2" fill="url(#tp-' + u + ')"/>' +
      '<path d="M' + (s / 2 - 28) + ' ' + (-s / 2) + ' L' + (s / 2) + ' ' + (-s / 2 + 28) + ' L' + (s / 2) + ' ' + (-s / 2) + ' Z" fill="#e6eee1" stroke="#cdd7c8"/>' +
      '<path d="M' + (-s / 2 + 12) + ' 0 L' + (s / 2 - 12) + ' 0" stroke="#cdd7c8" stroke-dasharray="3 5" opacity=".7"/></g>';
  }
  function kraftBag(u) {
    function bag(x, y, w, h, fill, side, lg) {
      return '<path d="M' + (x + w) + ' ' + y + ' L' + (x + w + 20) + ' ' + (y + 11) + ' L' + (x + w + 20) + ' ' + (y + h - 3) + ' L' + (x + w) + ' ' + (y + h) + ' Z" fill="' + side + '"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="10" fill="#000" opacity=".08"/><path d="M' + x + ' ' + (y + 10) + ' L' + (x + w) + ' ' + (y + 10) + '" stroke="#000" opacity=".12"/>' +
        '<path d="M' + (x + w * .3) + ' ' + (y + 4) + ' Q' + (x + w * .3) + ' ' + (y - 40) + ' ' + (x + w * .5) + ' ' + (y - 40) + ' Q' + (x + w * .7) + ' ' + (y - 40) + ' ' + (x + w * .7) + ' ' + (y + 4) + '" fill="none" stroke="#8d6638" stroke-width="3.4" stroke-linecap="round"/>' +
        '<circle cx="' + (x + w * .3) + '" cy="' + (y + 5) + '" r="3.4" fill="#6f4f2a"/><circle cx="' + (x + w * .7) + '" cy="' + (y + 5) + '" r="3.4" fill="#6f4f2a"/>';
    }
    return shadow(74) +
      bag(48, 96, 78, 108, '#d3ac78', '#b88c58') +
      bag(92, 82, 92, 122, '#c9a06c', '#a97b4c') +
      '<g transform="translate(138 144)"><circle r="19" fill="#fff" opacity=".9"/><g fill="' + LEAF + '"><rect x="-8" y="-11" width="3.6" height="22" rx="1.5"/><rect x="-1.8" y="-14" width="3.6" height="25" rx="1.5"/><rect x="4.4" y="-8" width="3.6" height="19" rx="1.5"/></g><circle r="19" fill="none" stroke="' + LIME + '" stroke-width="1.6"/></g>' +
      '<text x="138" y="182" font-family="Montserrat,sans-serif" font-weight="600" font-size="9.5" letter-spacing=".6" text-anchor="middle" fill="#fff" opacity=".95">organikane</text>';
  }
  function tableMats(u) {
    function mat(dy, top) {
      var p = 'M78 ' + (96 + dy) + ' L182 ' + (96 + dy) + ' L206 ' + (150 + dy) + ' L54 ' + (150 + dy) + ' Z';
      var out = '<path d="M54 ' + (150 + dy) + ' L206 ' + (150 + dy) + ' L206 ' + (155 + dy) + ' L54 ' + (155 + dy) + ' Z" fill="#c8d3c0"/><path d="' + p + '" fill="#fbfcf9" stroke="#cdd7c8"/>';
      if (top) {
        out += '<path d="M86 ' + (104 + dy) + ' L174 ' + (104 + dy) + ' L194 ' + (142 + dy) + ' L66 ' + (142 + dy) + ' Z" fill="none" stroke="' + LIME + '" stroke-width="2.4" stroke-dasharray="1 6" stroke-linecap="round"/>' +
          '<g transform="translate(130 ' + (123 + dy) + ') scale(1 .62)"><circle r="17" fill="none" stroke="' + LEAF + '" stroke-width="2.6"/><g fill="' + LEAF + '"><rect x="-8" y="-10" width="3.4" height="20" rx="1.5"/><rect x="-1.7" y="-13" width="3.4" height="23" rx="1.5"/><rect x="4.6" y="-7" width="3.4" height="17" rx="1.5"/></g></g>';
      }
      return out;
    }
    return shadow(80) + mat(34, false) + mat(24, false) + mat(14, false) + mat(0, true);
  }
  function butterPaper(u) {
    var rings = '';
    for (var i = 1; i < 5; i++) rings += '<ellipse cx="62" cy="136" rx="' + (13 - i * 2) + '" ry="' + (34 - i * 6) + '" fill="none" stroke="#c9b28a" stroke-width=".9" opacity=".7"/>';
    return '<defs><linearGradient id="bp-' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8e6"/><stop offset=".5" stop-color="#efe3c8"/><stop offset="1" stop-color="#d9c8a4"/></linearGradient></defs>' +
      shadow(76) +
      '<path d="M104 170 C140 172 150 188 206 184 L200 200 C150 204 128 192 98 182 Z" fill="#fff8e6" fill-opacity=".85" stroke="#d9c8a4"/>' +
      '<path d="M120 178 C150 182 168 192 198 190" stroke="#d9c8a4" fill="none"/><path d="M132 176 C146 182 158 184 170 183" stroke="#fff" fill="none" opacity=".8"/>' +
      '<g transform="translate(18 0)"><rect x="44" y="104" width="76" height="64" fill="url(#bp-' + u + ')"/>' +
      '<ellipse cx="120" cy="136" rx="13" ry="34" fill="#f3e9d0" stroke="#d9c8a4"/>' +
      '<path d="M44 104 L120 104 M44 168 L120 168" stroke="#d9c8a4"/>' +
      '<ellipse cx="44" cy="136" rx="13" ry="34" fill="#f6eed8" stroke="#d9c8a4"/>' +
      '<g transform="translate(-18 0)">' + rings + '</g>' +
      '<ellipse cx="44" cy="136" rx="4.5" ry="11" fill="#b8956a" stroke="#8d6638" stroke-width=".8"/>' +
      '<rect x="60" y="112" width="3" height="46" rx="1.5" fill="#fff" opacity=".6"/></g>' +
      '<g transform="translate(140 92) rotate(8)"><path d="M0 0 L58 0 L58 70 L0 70 Z" fill="#fff8e6" fill-opacity=".8" stroke="#d9c8a4"/><path d="M8 14 L50 14 M8 26 L40 26" stroke="#d9c8a4" opacity=".7"/></g>';
  }

  var ART = {
    paperStraws: paperStraws, plasticStraws: plasticStraws, bendyStraws: bendyStraws, wrappedStraws: wrappedStraws,
    cutlery: cutlery, stirrers: stirrers, paperCup: paperCup, coldCup: coldCup, petCans: petCans,
    foilTray: foilTray, saladBowl: saladBowl, burgerBox: burgerBox, dessertBox: dessertBox, sauceDips: sauceDips,
    tissue: tissue, kraftBag: kraftBag, tableMats: tableMats, butterPaper: butterPaper
  };

  var seq = 0;
  function uid(p) { return p.id.replace(/[^a-z0-9]/g, '') + (++seq); }

  /* Public: just the drawing (no tile) - used to compose scenes */
  window.artInner = function (p) { return ART[p.art[0]](uid(p), p.art[1] || {}); };

  /* Public: full SVG string for a product tile. opts.bare = transparent, no tile/label */
  window.renderArt = function (p, opts) {
    var fn = ART[p.art[0]], u = uid(p), o = opts || {};
    var label = p.name.replace(/"/g, '');
    if (o.bare) {
      return '<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '">' + fn(u, p.art[1] || {}) + '</svg>';
    }
    var tint = (window.CATEGORIES[p.cat] || {}).tint || '#E6F0D6';
    var chip = '';
    if (p.chip) {
      var w = 14 + p.chip.length * 8.4;
      chip = '<g transform="translate(14 14)"><rect width="' + w + '" height="24" rx="12" fill="' + INK + '"/><text x="' + (w / 2) + '" y="16" font-family="Montserrat,sans-serif" font-weight="700" font-size="11.5" fill="#fff" text-anchor="middle">' + p.chip + '</text></g>';
    }
    return '<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '" preserveAspectRatio="xMidYMid meet">' +
      '<rect width="240" height="240" fill="' + tint + '"/>' +
      '<circle cx="120" cy="136" r="92" fill="#fff" opacity=".42"/>' +
      fn(u, p.art[1] || {}) + chip + '</svg>';
  };
})();

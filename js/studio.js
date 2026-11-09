/* Organikane logo studio: preview a brand name / logo on bag, cup, box and straw wrapper.
   Everything happens in the visitor's browser; nothing is uploaded. */
(function () {
  'use strict';
  var root = document.getElementById('studio'); if (!root) return;
  var S = window.SITE || {};

  var PALETTES = [
    { id: 'kraft',  label: 'Kraft',  sw: '#C9A06C', v: { bag: '#C9A06C', bag2: '#A97B4C', cup: '#D3AC78', lid: '#6f4f2a', box: '#C9A06C', box2: '#A97B4C', box3: '#DCB685', wrap: '#F6F1E3', ink: '#3a2812', accent: '#3E7A33', handle: '#8d6638' } },
    { id: 'white',  label: 'White',  sw: '#F8F8F3', v: { bag: '#F8F8F3', bag2: '#D9DED2', cup: '#FBFCF9', lid: '#E4E9DF', box: '#F8F8F3', box2: '#D5DBCE', box3: '#FFFFFF', wrap: '#FFFFFF', ink: '#2C5A2A', accent: '#3E7A33', handle: '#B9C2B5' } },
    { id: 'forest', label: 'Forest', sw: '#2C5A2A', v: { bag: '#2C5A2A', bag2: '#1E421D', cup: '#2C5A2A', lid: '#17301B', box: '#3E7A33', box2: '#2C5A2A', box3: '#4d8c41', wrap: '#3E7A33', ink: '#FFFFFF', accent: '#8CBC58', handle: '#8CBC58' } },
    { id: 'black',  label: 'Black',  sw: '#232A26', v: { bag: '#2b332e', bag2: '#171c19', cup: '#2b332e', lid: '#171c19', box: '#2b332e', box2: '#171c19', box3: '#3a443e', wrap: '#2b332e', ink: '#FFFFFF', accent: '#8CBC58', handle: '#8CBC58' } }
  ];

  /* a small "your logo here" mark: circle with three bamboo stalks (echoes the Organikane emblem) */
  function mark(cx, cy, r, cls) {
    var k = r / 20;
    return '<g class="ph ' + (cls || '') + '" transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')">' +
      '<circle r="20" fill="none" class="st-accent" style="fill:none;stroke:var(--accent);stroke-width:2.4"/>' +
      '<g class="st-accent"><rect x="-9" y="-11" width="4" height="22" rx="1.6"/><rect x="-2" y="-15" width="4" height="26" rx="1.6"/><rect x="5" y="-8" width="4" height="19" rx="1.6"/></g></g>';
  }
  function logoImg(id, x, y, w, h) {
    return '<image class="logo" data-l="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid meet" style="display:none"/>';
  }
  function txt(id, x, y, base, max, extra) {
    return '<text class="st-ink bn" data-fit="' + max + ',' + base + '" id="' + id + '" x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="600" ' + (extra || '') + '></text>';
  }

  var svg = '<svg id="stSvg" viewBox="0 0 560 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Preview of your brand on a paper bag, cup, box and straw wrapper">' +
    '<defs><filter id="stsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#17301B" flood-opacity=".18"/></filter></defs>' +
    '<ellipse cx="280" cy="372" rx="230" ry="16" fill="#17301B" opacity=".12"/>' +
    /* straw wrapper (back-left) */
    '<g class="s-float" style="--d:-1.2s"><g transform="rotate(-7 74 372)" filter="url(#stsh)">' +
    '<rect x="62" y="84" width="11" height="38" rx="2" fill="#232a26"/>' +
    '<path d="M58 124 l5 -7 l5 7 l5 -7 l5 7 l5 -7 L83 124 Z" class="st-wrap"/>' +
    '<rect x="58" y="122" width="25" height="248" class="st-wrap" stroke="rgba(23,48,27,.18)"/>' +
    '<text class="st-ink bn" data-fit="170,17" id="tW" transform="rotate(-90 76 252)" x="76" y="258" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="600" letter-spacing=".5"></text></g></g>' +
    /* bag */
    '<g class="s-float" style="--d:-.4s"><g filter="url(#stsh)">' +
    '<path d="M300 140 L338 160 L338 360 L300 372 Z" class="st-bag2"/>' +
    '<rect x="112" y="140" width="188" height="232" class="st-bag" stroke="rgba(23,48,27,.14)"/>' +
    '<rect x="112" y="140" width="188" height="22" fill="#000" opacity=".1"/><path d="M112 162 H300" stroke="#000" opacity=".12"/>' +
    '<path d="M158 146 C158 62 254 62 254 146" fill="none" class="st-handle" stroke-width="7" stroke-linecap="round"/>' +
    '<circle cx="158" cy="148" r="5" fill="#000" opacity=".3"/><circle cx="254" cy="148" r="5" fill="#000" opacity=".3"/>' +
    mark(206, 238, 30, 'ph-bag') + logoImg('bag', 166, 200, 80, 80) + txt('tB', 206, 322, 30, 150) + '</g></g>' +
    /* cup */
    '<g class="s-float" style="--d:-2s"><g filter="url(#stsh)">' +
    '<path d="M352 196 L476 196 L458 360 Q457 368 449 368 L379 368 Q371 368 370 360 Z" class="st-cup" stroke="rgba(23,48,27,.16)"/>' +
    '<path d="M344 196 L344 186 Q344 174 356 174 L472 174 Q484 174 484 186 L484 196 Z" class="st-lid" stroke="rgba(23,48,27,.12)"/>' +
    '<path d="M366 174 Q366 150 390 150 L438 150 Q462 150 462 174 Z" class="st-lid" stroke="rgba(23,48,27,.12)"/>' +
    '<ellipse cx="438" cy="160" rx="9" ry="3" fill="#000" opacity=".35"/>' +
    mark(414, 262, 22, 'ph-cup') + logoImg('cup', 380, 226, 68, 68) + txt('tC', 414, 330, 19, 92) + '</g></g>' +
    /* burger box (front, low) */
    '<g class="s-float" style="--d:-3s"><g filter="url(#stsh)">' +
    '<path d="M262 366 L372 366 L402 350 L292 350 Z" class="st-box3"/>' +
    '<rect x="262" y="366" width="110" height="46" class="st-box" stroke="rgba(23,48,27,.14)"/>' +
    '<path d="M372 366 L402 350 L402 394 L372 412 Z" class="st-box2"/>' +
    txt('tX', 317, 396, 15, 90) + '</g></g>' +
    '</svg>';

  var stage = root.querySelector('.studio__stage'); stage.innerHTML = svg;
  var el = document.getElementById('stSvg');
  var nameIn = document.getElementById('stName');
  var sw = root.querySelector('.swatches');
  var fileIn = document.getElementById('stLogo'), rm = document.getElementById('stLogoX');
  var send = document.getElementById('stSend'), noteEl = document.getElementById('stMsg');
  var logoURL = '', pal = PALETTES[0];

  sw.insertAdjacentHTML('beforeend', PALETTES.map(function (p, i) {
    return '<button type="button" class="sw" role="radio" aria-checked="' + (i === 0) + '" data-p="' + p.id + '" aria-label="' + p.label + '" title="' + p.label + '" style="background:' + p.sw + '"></button>';
  }).join(''));

  function fit(t, text) {
    var a = t.getAttribute('data-fit').split(','), max = +a[0], base = +a[1];
    t.textContent = text; t.setAttribute('font-size', base);
    var w = t.getComputedTextLength ? t.getComputedTextLength() : 0;
    if (w > max) t.setAttribute('font-size', Math.max(8, (base * max / w)).toFixed(1));
  }
  function applyPalette() { Object.keys(pal.v).forEach(function (k) { el.style.setProperty('--' + k, pal.v[k]); }); }
  function pop() {
    Array.prototype.forEach.call(el.querySelectorAll('.bn'), function (n) { n.classList.remove('s-pop'); void n.getBBox(); n.classList.add('s-pop'); });
  }
  function render() {
    var name = (nameIn.value || '').trim() || 'Your brand';
    Array.prototype.forEach.call(el.querySelectorAll('.bn'), function (t) { fit(t, name); });
    var has = !!logoURL;
    Array.prototype.forEach.call(el.querySelectorAll('.logo'), function (i) { if (has) i.setAttribute('href', logoURL); i.style.display = has ? '' : 'none'; });
    Array.prototype.forEach.call(el.querySelectorAll('.ph'), function (g) { g.style.display = has ? 'none' : ''; });
    rm.hidden = !has;
  }
  function msg() {
    var n = (nameIn.value || '').trim();
    return 'Hello Organikane, I’d like a custom print on your packaging' + (n ? ' for my brand “' + n + '”' : '') + ' (' + pal.label.toLowerCase() + ' colour). ' + (logoURL ? 'I will send my logo here in the chat.' : 'Please tell me what artwork you need.');
  }

  applyPalette(); render();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);

  nameIn.addEventListener('input', function () { render(); });
  nameIn.addEventListener('change', pop);
  sw.addEventListener('click', function (e) {
    var b = e.target.closest('.sw'); if (!b) return;
    pal = PALETTES.filter(function (p) { return p.id === b.getAttribute('data-p'); })[0];
    Array.prototype.forEach.call(sw.querySelectorAll('.sw'), function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
    applyPalette(); render(); pop();
  });
  fileIn.addEventListener('change', function () {
    var f = fileIn.files && fileIn.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) { noteEl.textContent = 'Please choose an image file (PNG, JPG, SVG or WebP).'; return; }
    if (f.size > 6 * 1024 * 1024) { noteEl.textContent = 'That image is over 6 MB. Try a smaller file.'; return; }
    if (logoURL) URL.revokeObjectURL(logoURL);
    logoURL = URL.createObjectURL(f); noteEl.textContent = ''; render(); pop();
  });
  rm.addEventListener('click', function () { if (logoURL) URL.revokeObjectURL(logoURL); logoURL = ''; fileIn.value = ''; render(); });
  send.addEventListener('click', function (e) { e.preventDefault(); window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(msg()), '_blank', 'noopener'); });
})();

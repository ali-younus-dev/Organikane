/* Organikane site behaviour */
(function () {
  'use strict';
  var S = window.SITE, P = window.PRODUCTS, C = window.CATEGORIES, M = window.MATERIALS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });

  /* ---------- WhatsApp links ---------- */
  function waUrl(text) { return 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(text); }
  $$('[data-wa]').forEach(function (a) {
    a.href = waUrl(a.getAttribute('data-wa'));
    a.target = '_blank'; a.rel = 'noopener';
  });
  $('#phoneLink').href = 'tel:' + S.phoneLink; $('#phoneLink').textContent = S.phoneDisplay;
  $('#mailLink').href = 'mailto:' + S.email; $('#mailLink').textContent = S.email;
  $('#mapLink').href = S.mapsUrl; $('#mapLink').textContent = S.address;
  $('#year').textContent = new Date().getFullYear();
  $('#aboutCount').textContent = P.length;

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2200);
  }

  /* ---------- media (photo if available, else drawn illustration) ---------- */
  function media(p, cls) {
    if (p.photo) return '<img' + (p.cover ? ' class="ph"' : '') + ' src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">';
    return window.renderArt(p);
  }
  function tintOf(p) { return (C[p.cat] || {}).tint || '#F3F6EE'; }

  /* ---------- catalogue ---------- */
  var state = { cat: 'all', mat: 'all', q: '' };
  var chips = $('#chips'), matSel = $('#material'), grid = $('#grid');

  function buildFilters() {
    var html = '<button class="chip" type="button" data-cat="all" aria-pressed="true">All<small>' + P.length + '</small></button>';
    Object.keys(C).forEach(function (k) {
      var n = P.filter(function (p) { return p.cat === k; }).length;
      html += '<button class="chip" type="button" data-cat="' + k + '" aria-pressed="false">' + esc(C[k].label) + '<small>' + n + '</small></button>';
    });
    chips.innerHTML = html;
    var opts = '<option value="all">All materials</option>';
    Object.keys(M).forEach(function (k) { opts += '<option value="' + k + '">' + esc(M[k].label) + '</option>'; });
    matSel.innerHTML = opts;
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    return P.filter(function (p) {
      if (state.cat !== 'all' && p.cat !== state.cat) return false;
      if (state.mat !== 'all' && p.mat !== state.mat) return false;
      if (q && (p.name + ' ' + p.spec + ' ' + p.desc + ' ' + M[p.mat].label + ' ' + C[p.cat].label).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
  }

  function render(animate) {
    var list = filtered();
    grid.classList.toggle('stagger', animate !== false);
    grid.innerHTML = list.map(function (p, idx) {
      var inQ = !!quote[p.id];
      return '<article class="card" data-id="' + p.id + '" style="--i:' + idx + '">' +
        '<button class="card__open" type="button" data-open="' + p.id + '" aria-label="View ' + esc(p.name) + '">' +
        '<div class="card__media" style="background:' + tintOf(p) + '">' + media(p) + '</div>' +
        '<h3 class="card__name">' + esc(p.name) + '</h3>' +
        '<p class="card__spec">' + esc(p.spec) + '</p></button>' +
        '<div class="card__foot"><span class="tag" data-m="' + p.mat + '">' + esc(M[p.mat].note) + '</span>' +
        '<button class="add' + (inQ ? ' is-in' : '') + '" type="button" data-add="' + p.id + '">' + (inQ ? 'In your quote' : 'Add to quote') + '</button></div></article>';
    }).join('');
    $('#empty').hidden = list.length > 0;
    var label = state.cat === 'all' ? 'all products' : C[state.cat].label.toLowerCase();
    $('#resultLine').textContent = list.length === P.length ? 'Showing all ' + P.length + ' products' : 'Showing ' + list.length + ' of ' + P.length + ' (' + label + ')';
  }

  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    state.cat = b.getAttribute('data-cat');
    $$('.chip', chips).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
    render();
  });
  matSel.addEventListener('change', function () { state.mat = matSel.value; render(); });
  $('#search').addEventListener('input', function (e) { state.q = e.target.value; render(false); });
  $('#clearFilters').addEventListener('click', function () {
    state = { cat: 'all', mat: 'all', q: '' }; matSel.value = 'all'; $('#search').value = '';
    $$('.chip', chips).forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-cat') === 'all' ? 'true' : 'false'); });
    render();
  });

  grid.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      var id = add.getAttribute('data-add');
      if (quote[id]) openDrawer(); else addToQuote(id);
      return;
    }
    var open = e.target.closest('[data-open]');
    if (open) openProduct(open.getAttribute('data-open'));
  });

  /* ---------- quote basket ---------- */
  var quote = {}, note = '';
  try { quote = JSON.parse(localStorage.getItem('organikane.quote') || '{}') || {}; note = localStorage.getItem('organikane.note') || ''; } catch (e) { quote = {}; }
  Object.keys(quote).forEach(function (id) { if (!byId[id]) delete quote[id]; });
  function save() { try { localStorage.setItem('organikane.quote', JSON.stringify(quote)); localStorage.setItem('organikane.note', note); } catch (e) { } }

  function addToQuote(id) {
    quote[id] = quote[id] || 1000; save(); sync();
    toast('Added to your quote');
    var b = $('#openQuote'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }
  function count() { return Object.keys(quote).length; }

  function sync() {
    $('#quoteCount').textContent = count();
    $$('.add').forEach(function (b) {
      var inQ = !!quote[b.getAttribute('data-add')];
      b.classList.toggle('is-in', inQ); b.textContent = inQ ? 'In your quote' : 'Add to quote';
    });
    var pa = $('#pdAdd'); if (pa && pa.dataset.id) { var i = !!quote[pa.dataset.id]; pa.textContent = i ? 'In your quote' : 'Add to quote'; }
    var ids = Object.keys(quote);
    $('#qlist').innerHTML = ids.map(function (id) {
      var p = byId[id];
      return '<li class="qitem" data-id="' + id + '"><div class="qitem__img" style="background:' + tintOf(p) + '">' + media(p) + '</div>' +
        '<div><h3>' + esc(p.name) + '</h3><div class="qitem__row">' +
        '<div class="step"><button type="button" data-step="-100" aria-label="Fewer">−</button><input type="number" min="1" value="' + quote[id] + '" aria-label="Quantity for ' + esc(p.name) + '"><button type="button" data-step="100" aria-label="More">+</button></div>' +
        '<button type="button" class="qremove" data-rm="' + id + '">Remove</button></div></div></li>';
    }).join('');
    $('#qempty').hidden = ids.length > 0;
    $('#qnoteWrap').hidden = ids.length === 0;
    $$('.drawer__foot .btn').forEach(function (b) { b.disabled = ids.length === 0; });
    $('#clearQuote').hidden = ids.length === 0;
  }

  $('#qlist').addEventListener('click', function (e) {
    var li = e.target.closest('.qitem'); if (!li) return; var id = li.getAttribute('data-id');
    var st = e.target.closest('[data-step]');
    if (st) { quote[id] = Math.max(1, (parseInt(quote[id], 10) || 0) + parseInt(st.getAttribute('data-step'), 10)); li.querySelector('input').value = quote[id]; save(); return; }
    if (e.target.closest('[data-rm]')) { delete quote[id]; save(); sync(); }
  });
  $('#qlist').addEventListener('input', function (e) {
    if (e.target.tagName !== 'INPUT') return;
    var id = e.target.closest('.qitem').getAttribute('data-id'), v = parseInt(e.target.value, 10);
    if (v > 0) { quote[id] = v; save(); }
  });
  $('#qnote').value = note;
  $('#qnote').addEventListener('input', function (e) { note = e.target.value; save(); });
  $('#clearQuote').addEventListener('click', function () { quote = {}; save(); sync(); });

  function quoteText() {
    var lines = Object.keys(quote).map(function (id, i) { return (i + 1) + '. ' + byId[id].name + ' (' + byId[id].spec + ') - Qty: ' + quote[id]; });
    return 'Hello Organikane, I’d like a quote for:\n\n' + lines.join('\n') + (note.trim() ? '\n\nNotes: ' + note.trim() : '') + '\n\nSent from ' + S.website;
  }
  $('#sendWa').addEventListener('click', function () { window.open(waUrl(quoteText()), '_blank', 'noopener'); });
  $('#sendMail').addEventListener('click', function () {
    window.location.href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent(quoteText());
  });

  /* ---------- drawer (with focus handling) ---------- */
  var drawer = $('#drawer'), scrim = $('#scrim'), lastFocus;
  function openDrawer() {
    lastFocus = document.activeElement;
    scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('on'); });
    drawer.classList.add('on'); drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#closeQuote').focus(); }, 60);
  }
  function closeDrawer() {
    drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); scrim.classList.remove('on');
    setTimeout(function () { scrim.hidden = true; }, 300);
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('#openQuote').addEventListener('click', openDrawer);
  $('#closeQuote').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (!drawer.classList.contains('on')) return;
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') {
      var f = $$('button,input,textarea,a[href]', drawer).filter(function (n) { return !n.disabled && n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- product window ---------- */
  var dlg = $('#pdlg');
  function openProduct(id) {
    var p = byId[id];
    $('#pdMedia').style.background = tintOf(p); $('#pdMedia').innerHTML = media(p);
    $('#pdCat').textContent = C[p.cat].label;
    $('#pdName').textContent = p.name; $('#pdDesc').textContent = p.desc;
    $('#pdSpec').textContent = p.spec; $('#pdMat').textContent = M[p.mat].label;
    $('#pdAdd').dataset.id = id; $('#pdAdd').textContent = quote[id] ? 'In your quote' : 'Add to quote';
    $('#pdAsk').href = waUrl('Hello Organikane, I have a question about: ' + p.name);
    $('#pdAsk').target = '_blank'; $('#pdAsk').rel = 'noopener';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  $('#pdClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  $('#pdAdd').addEventListener('click', function () {
    var id = this.dataset.id;
    if (quote[id]) { dlg.close(); openDrawer(); } else addToQuote(id);
  });

  /* ---------- contact form -> WhatsApp ---------- */
  $('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, n = f.name.value.trim(), ph = f.phone.value.trim(), m = f.msg.value.trim();
    var err = $('#formErr');
    if (!n || !ph || !m) { err.hidden = false; return; }
    err.hidden = true;
    window.open(waUrl('Hello Organikane,\n\n' + m + '\n\nName: ' + n + '\nPhone: ' + ph), '_blank', 'noopener');
  });

  /* ---------- header ---------- */
  var header = $('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var menuBtn = $('#menuBtn'), nav = $('#nav');
  function setMenu(open) { nav.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });

  /* ---------- hero slideshow ---------- */
  (function () {
    var slides = $$('#heroText .slide'), arts = $$('#heroArt .art'), pager = $('#pager'), btns = $$('button', pager);
    var i = 0, timer, dur = (S.slideSeconds || 6.5), reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pager.style.setProperty('--dur', dur + 's');
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      arts.forEach(function (a, k) { a.classList.toggle('is-active', k === i); a.setAttribute('aria-hidden', k === i ? 'false' : 'true'); var im = a.querySelector('img'); if (k === i && im) im.loading = 'eager'; });
      btns.forEach(function (b, k) { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    }
    function start() { if (reduce) { pager.classList.add('static'); return; } stop(); pager.classList.remove('paused'); timer = setTimeout(function () { show(i + 1); start(); }, dur * 1000); }
    function stop() { clearTimeout(timer); }
    btns.forEach(function (b, k) { b.addEventListener('click', function () { show(k); start(); }); });
    var hero = $('.hero');
    hero.addEventListener('mouseenter', function () { stop(); pager.classList.add('paused'); });
    hero.addEventListener('mouseleave', function () { start(); });
    hero.addEventListener('focusin', function () { stop(); pager.classList.add('paused'); });
    hero.addEventListener('focusout', function () { start(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    start();
  })();

  /* ---------- go ---------- */
  buildFilters(); render(); sync();
})();

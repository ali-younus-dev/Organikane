/* Organikane wow layer: cursor follower, why-row photo peek, about text fill, review marquee, header hide, hero scroll-out, footer wordmark */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- about: paragraph fills in word by word as you scroll ---------- */
  var fill = $('.fill'), fw = [];
  if (fill && !reduce) {
    fill.innerHTML = fill.textContent.trim().split(/\s+/).map(function (w) { return '<span class="fw">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>'; }).join(' ');
    fw = $$('.fw', fill);
  }

  /* ---------- reviews: two drifting rows ---------- */
  (function () {
    var grid = $('.voices__grid'); if (!grid) return;
    var q = $$('blockquote', grid); if (q.length < 4) return;
    var half = Math.ceil(q.length / 2), rows = [q.slice(0, half), q.slice(half)];
    grid.innerHTML = ''; grid.classList.add('vq');
    rows.forEach(function (set, i) {
      var row = document.createElement('div'); row.className = 'vq__row' + (i ? ' vq__row--b' : '');
      for (var k = 0; k < 4; k++) set.forEach(function (b) {
        var c = k ? b.cloneNode(true) : b; c.classList.remove('rv'); c.removeAttribute('style');
        if (k) c.setAttribute('aria-hidden', 'true');
        row.appendChild(c);
      });
      grid.appendChild(row);
    });
  })();

  /* ---------- footer wordmark ---------- */
  var word = $('#footWord');
  if (word) {
    if (reduce || !('IntersectionObserver' in window)) word.classList.add('in');
    else new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { word.classList.add('in'); o.disconnect(); } }, { threshold: .4 }).observe(word);
  }

  /* ---------- scroll: header hide, hero scroll-out, about fill ---------- */
  var header = $('.site-header'), menuBtn = $('#menuBtn'), heroIn = $('.hero__in'), hero = $('.hero'), aboutPh = $('.about__fig img.ph-sq');
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight, dy = y - lastY; lastY = y;
    if (header && !reduce) {
      var open = menuBtn && menuBtn.getAttribute('aria-expanded') === 'true';
      if (y < 500 || dy < -4 || open) header.classList.remove('is-hidden');
      else if (dy > 4) header.classList.add('is-hidden');
    }
    if (reduce) return;
    if (heroIn && hero && window.innerWidth > 900) {
      var hh = hero.offsetHeight;
      if (y < hh) { var p = clamp(y / hh, 0, 1); heroIn.style.transform = 'translate3d(0,' + (p * 90).toFixed(1) + 'px,0) scale(' + (1 - p * .06).toFixed(3) + ')'; heroIn.style.opacity = (1 - p * 1.15).toFixed(3); }
    }
    if (fw.length) {
      var r = fill.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        var n = Math.round(clamp((vh * .88 - r.top) / (vh * .5), 0, 1) * fw.length);
        fw.forEach(function (s, i) { s.classList.toggle('on', i < n); });
      }
    }
    if (aboutPh) {
      var ar = aboutPh.getBoundingClientRect();
      if (ar.top < vh && ar.bottom > 0) aboutPh.style.rotate = (clamp((ar.top + ar.height / 2 - vh / 2) / vh, -1, 1) * -5).toFixed(2) + 'deg';
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (!fine || reduce) return;

  /* ---------- cursor follower + photo peek on the why rows ---------- */
  var cur = document.createElement('div'); cur.className = 'cur'; cur.setAttribute('aria-hidden', 'true'); cur.innerHTML = '<span>View</span>';
  document.body.appendChild(cur);
  var peek = document.createElement('div'); peek.className = 'peek'; peek.setAttribute('aria-hidden', 'true');
  var rowsW = $$('.why article[data-peek]'), imgs = rowsW.map(function (a) { var im = new Image(); im.alt = ''; im.src = a.getAttribute('data-peek'); peek.appendChild(im); return im; });
  document.body.appendChild(peek);

  var mx = -100, my = -100, cx = -100, cy = -100, px = -100, py = -100, raf = 0;
  function loop() {
    cx += (mx - cx) * .22; cy += (my - cy) * .22; px += (mx - px) * .12; py += (my - py) * .12;
    cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
    peek.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0) rotate(' + clamp((mx - px) * .06, -9, 9).toFixed(2) + 'deg)';
    raf = (Math.abs(mx - cx) + Math.abs(my - cy) + Math.abs(mx - px) + Math.abs(my - py) > .4) ? requestAnimationFrame(loop) : 0;
  }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (!cur.classList.contains('on')) { cx = px = mx; cy = py = my; cur.classList.add('on'); }
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { cur.classList.remove('on'); });
  document.addEventListener('pointerover', function (e) {
    var t = e.target; if (!t.closest) return;
    var view = t.closest('.lk, .scene, .pc, .card__open');
    cur.classList.toggle('is-view', !!view);
    cur.classList.toggle('is-link', !view && !!t.closest('a, button, .chip, select, input, textarea, label'));
    var row = t.closest('.why article[data-peek]'), i = row ? rowsW.indexOf(row) : -1;
    peek.classList.toggle('on', i > -1);
    if (i > -1) imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
  });
  window.addEventListener('scroll', function () { peek.classList.remove('on'); }, { passive: true });
})();

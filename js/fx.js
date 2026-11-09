/* Organikane motion layer: reveals, hero depth, leaves, ticker, story, scenes, card tilt */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var P = window.PRODUCTS || [], C = window.CATEGORIES || {};
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- hero headline: words rise one by one ---------- */
  $$('#heroText .slide h1, #heroText .slide .h1like').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map(function (w, i) { return '<span class="w" style="--d:' + i + '"><span>' + w + '</span></span>'; }).join(' ');
  });

  /* ---------- ticker ---------- */
  (function () {
    var track = $('#tickerTrack'); if (!track) return;
    var one = P.map(function (p) {
      var tint = (C[p.cat] || {}).tint || '#E6F0D6';
      var tile = p.photo ? '<img src="' + p.photo + '" alt="" loading="lazy" style="width:100%;height:100%;object-fit:' + (p.cover ? 'cover' : 'contain;padding:6px') + '">' : window.renderArt(p, { bare: true });
      return '<li class="tk"><span class="tk__tile" style="background:' + tint + '">' + tile + '</span><span>' + p.name + '</span></li>';
    }).join('');
    track.innerHTML = one + one;
  })();

  /* ---------- reveal on scroll ---------- */
  var revealSel = '.sec-head, .about__copy > *, .about__fig, .story__note, .custom__copy > *, .studio, .why article, .voices blockquote, .join, .contact__info, .contact__form, .scene';
  $$(revealSel).forEach(function (el) {
    el.classList.add('rv');
    var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
    el.style.setProperty('--i', Math.min(sib, 5));
  });
  var photoWipe = $('.about__fig img'); if (photoWipe) photoWipe.classList.add('rv-wipe');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); var w = e.target.querySelector('.rv-wipe'); if (w) w.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    $$('.rv, .rv-wipe').forEach(function (el) { io.observe(el); });
  } else { $$('.rv, .rv-wipe').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- scroll-linked things (one rAF loop) ---------- */
  var bar = $('#progress i'), story = $('#storyTrack'), stages = $$('.stage'), par = $$('[data-par]');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight, doc = document.documentElement;
    if (bar) bar.style.transform = 'scaleX(' + clamp(y / Math.max(1, doc.scrollHeight - vh), 0, 1) + ')';
    if (story) {
      var r = story.getBoundingClientRect(), horizontal = window.innerWidth > 1020;
      var range = horizontal ? vh * .5 : r.height * .9;
      var p = clamp((vh * .78 - r.top) / range, 0, 1);
      story.style.setProperty('--p', p.toFixed(3));
      stages.forEach(function (s, i) { s.classList.toggle('is-on', p >= i / (stages.length - 1) - .001 && r.top < vh * .85); });
    }
    if (!reduce) par.forEach(function (el) {
      var r2 = el.getBoundingClientRect(); if (r2.bottom < -200 || r2.top > vh + 200) return;
      var c = (r2.top + r2.height / 2 - vh / 2) * parseFloat(el.getAttribute('data-par'));
      el.style.transform = 'translate3d(0,' + c.toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- hero: pointer parallax ---------- */
  var hero = $('.hero');
  if (hero && fine && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
    });
    hero.addEventListener('pointerleave', function () { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
  }

  /* ---------- hero: drifting bamboo leaves ---------- */
  (function () {
    var cv = $('#leaves'); if (!cv || reduce || !cv.getContext) return;
    var ctx = cv.getContext('2d'), W = 0, H = 0, L = [], raf = 0, visible = true, t = 0;
    function size() {
      var r = cv.parentNode.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      var n = W < 700 ? 8 : 16; while (L.length < n) L.push(mk(true)); L.length = n;
    }
    function mk(init) {
      return { x: Math.random() * W, y: init ? Math.random() * H : -40, s: 9 + Math.random() * 17, vy: .22 + Math.random() * .5, vx: (Math.random() - .5) * .25,
        r: Math.random() * 6.28, vr: (Math.random() - .5) * .018, ph: Math.random() * 6.28, c: Math.random() < .6 ? '#8CBC58' : '#3E7A33', a: .28 + Math.random() * .42 };
    }
    function leaf(p) {
      var l = p.s, w = p.s * .3;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.moveTo(0, -l); ctx.bezierCurveTo(w * 1.5, -l * .4, w * 1.3, l * .5, 0, l); ctx.bezierCurveTo(-w * 1.3, l * .5, -w * 1.5, -l * .4, 0, -l); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -l * .85); ctx.lineTo(0, l * .85); ctx.stroke();
      ctx.restore();
    }
    function frame() {
      if (!visible) { raf = 0; return; }
      t += .016; ctx.clearRect(0, 0, W, H);
      L.forEach(function (p, i) {
        p.y += p.vy; p.x += p.vx + Math.sin(t * 1.2 + p.ph) * .35; p.r += p.vr + Math.sin(t + p.ph) * .004;
        if (p.y > H + 40 || p.x < -60 || p.x > W + 60) L[i] = mk(false);
        leaf(p);
      });
      raf = requestAnimationFrame(frame);
    }
    function go() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }
    size(); window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; go(); }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else go(); });
    go();
  })();

  /* ---------- product cards: 3D tilt + light sweep ---------- */
  var grid = $('#grid');
  if (grid && fine && !reduce) {
    grid.addEventListener('pointermove', function (e) {
      var m = e.target.closest && e.target.closest('.card__media'); if (!m) return;
      var r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      m.classList.add('tilting');
      m.style.transform = 'perspective(800px) rotateX(' + ((.5 - y) * 9).toFixed(2) + 'deg) rotateY(' + ((x - .5) * 11).toFixed(2) + 'deg) translateZ(0)';
      m.style.setProperty('--gx', (x * 100) + '%'); m.style.setProperty('--gy', (y * 100) + '%');
    });
    grid.addEventListener('pointerout', function (e) {
      var m = e.target.closest && e.target.closest('.card__media'); if (!m) return;
      if (e.relatedTarget && m.contains(e.relatedTarget)) return;
      m.classList.remove('tilting'); m.style.transform = '';
    });
  }
})();

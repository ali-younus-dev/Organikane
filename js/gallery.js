/* Organikane photo layer: pinned lookbook, photo scenes, print showcase, lightbox */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var IMG = 'images/photos/';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbList = [], lbI = 0, lbFrom = null;
  function lbShow(i) {
    lbI = (i + lbList.length) % lbList.length;
    var it = lbList[lbI]; lbImg.src = it.src; lbImg.alt = it.cap; lbCap.textContent = it.cap;
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    var multi = lbList.length > 1; $('#lbPrev').hidden = !multi; $('#lbNext').hidden = !multi;
  }
  function lbOpen(list, i, from) {
    if (!lb || !lb.showModal) return;
    lbList = list; lbFrom = from || null; lbShow(i); lb.showModal(); document.documentElement.style.overflow = 'hidden';
  }
  if (lb) {
    $('#lbClose').addEventListener('click', function () { lb.close(); });
    $('#lbPrev').addEventListener('click', function () { lbShow(lbI - 1); });
    $('#lbNext').addEventListener('click', function () { lbShow(lbI + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') lbShow(lbI - 1); else if (e.key === 'ArrowRight') lbShow(lbI + 1);
    });
    lb.addEventListener('close', function () { document.documentElement.style.overflow = ''; if (lbFrom && lbFrom.focus) lbFrom.focus(); });
  }

  /* ---------- lookbook ---------- */
  var LOOK = [
    ['straws-banner', 1.7778, 'Paper straws in every colour'],
    ['stacks-still-life', 1, 'Plates, trays and wrapped paper'],
    ['cutlery-banner', 1.7778, 'Wooden cutlery with bagasse tableware'],
    ['straws-in-cup', 1, 'Black, white and kraft paper straws'],
    ['tissue-and-mat', 1.7778, 'Tissue, kraft table mats and cutlery'],
    ['wooden-cutlery', 1, 'Wooden cutlery with a branded tag'],
    ['straws-range', 1.7778, 'Paper-wrapped, bendy and straight straws'],
    ['tissue-and-paper', 1, 'Tissue and kraft paper, ready to brand']
  ];
  var look = $('#look'), track = $('#lookTrack');
  if (look && track) {
    var lookList = LOOK.map(function (x) { return { src: IMG + x[0] + '.webp', cap: x[2] }; });
    track.innerHTML = LOOK.map(function (x, i) {
      return '<button type="button" class="lk" style="--ar:' + x[1] + '" data-i="' + i + '" aria-label="' + esc(x[2]) + ', open photo">' +
        '<img src="' + IMG + x[0] + '.webp" alt="" decoding="async" width="' + (x[1] > 1 ? 1376 : 1024) + '" height="' + (x[1] > 1 ? 774 : 1024) + '">' +
        '<span class="lk__n">' + pad2(i + 1) + '</span><span class="lk__cap">' + esc(x[2]) + '</span></button>';
    }).join('');
    $('#lookTot').textContent = pad2(LOOK.length);
    track.addEventListener('click', function (e) {
      var b = e.target.closest('.lk'); if (b) lbOpen(lookList, +b.getAttribute('data-i'), b);
    });
    var bar = $('#lookBar'), now = $('#lookNow'), swipe = false, maxShift = 0, busy = false;
    function measure() {
      swipe = window.innerWidth < 900 || reduce;
      look.classList.toggle('look--swipe', swipe);
      if (swipe) { look.style.height = ''; track.style.transform = ''; return; }
      maxShift = Math.max(0, track.scrollWidth - window.innerWidth);
      look.style.height = (maxShift + window.innerHeight) + 'px';
      tick();
    }
    function tick() {
      busy = false; if (swipe) return;
      var r = look.getBoundingClientRect(), span = Math.max(1, look.offsetHeight - window.innerHeight);
      var p = clamp(-r.top / span, 0, 1);
      track.style.transform = 'translate3d(' + (-p * maxShift).toFixed(1) + 'px,0,0)';
      bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      now.textContent = pad2(Math.round(p * (LOOK.length - 1)) + 1);
    }
    window.addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(tick); } }, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    measure();
  }

  /* ---------- scenes (photo tiles that open the matching category) ---------- */
  var SC = [
    ['cups-and-cans', 'Cafés and coffee shops', 'Cups, lids, straws and cans.', 'cups', 'Shop cups and cans'],
    ['bags-and-sandwiches', 'Takeaway and delivery', 'Bags, boxes, mats and cutlery.', 'paper', 'Shop paper and bags'],
    ['takeaway-table', 'Events and catering', 'Boxes, plates and dips that feed a crowd.', 'food', 'Shop food packaging'],
    ['bag-and-bread', 'Bakeries and sweets', 'Kraft bags, butter paper and tissue.', 'paper', 'Shop paper and bags']
  ];
  var bento = $('#bento');
  if (bento) {
    bento.innerHTML = SC.map(function (s, i) {
      return '<a class="scene rv" href="#products" data-cat="' + s[3] + '" style="--i:' + i + '">' +
        '<img src="' + IMG + s[0] + '.webp" alt="" loading="lazy" decoding="async" width="1376" height="768">' +
        '<div class="scene__txt"><h3>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p><span class="scene__go">' + esc(s[4]) + ' <i aria-hidden="true">→</i></span></div></a>';
    }).join('');
    bento.addEventListener('click', function (e) {
      var a = e.target.closest('.scene'); if (!a) return;
      var chip = $('#chips [data-cat="' + a.getAttribute('data-cat') + '"]');
      if (chip) chip.click();
    });
  }

  /* ---------- printing showcase ---------- */
  var PR = [
    ['bag-and-tub', 'Logo print on products', 'Your logo on bags, tubs, cups and boxes.'],
    ['aluminium-container', 'Label sticking', 'Branded labels on foil containers and lids.'],
    ['wrapped-straws', 'Individual paper wrapping', 'Every straw wrapped and branded.'],
    ['containers-and-sauces', 'Kraft box packing', 'Kraft sleeves that bind and brand each pack.']
  ];
  var pg = $('#printsGrid');
  if (pg) {
    var prList = PR.map(function (x) { return { src: IMG + x[0] + '.webp', cap: x[1] + ': ' + x[2] }; });
    pg.innerHTML = PR.map(function (x, i) {
      return '<button type="button" class="pc rv" data-i="' + i + '" style="--i:' + i + '"><span class="pc__img"><img src="' + IMG + x[0] + '.webp" alt="' + esc(x[1]) + '" loading="lazy" decoding="async" width="1024" height="1024"></span>' +
        '<b>' + esc(x[1]) + '</b><span class="d">' + esc(x[2]) + '</span></button>';
    }).join('');
    pg.addEventListener('click', function (e) { var b = e.target.closest('.pc'); if (b) lbOpen(prList, +b.getAttribute('data-i'), b); });
  }

  /* ---------- reveal for what this file builds ---------- */
  var late = $$('.scene.rv, .pc.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    late.forEach(function (el) { io.observe(el); });
  } else { late.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- count-up numbers in the dark banner ---------- */
  var counts = $$('[data-count]');
  if (counts.length && 'IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, to = +el.getAttribute('data-count'), t0 = performance.now(), dur = 1400;
        (function step(t) { var k = clamp((t - t0) / dur, 0, 1), v = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * v); if (k < 1) requestAnimationFrame(step); })(t0);
      });
    }, { threshold: .6 });
    counts.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  }
})();

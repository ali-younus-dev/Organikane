/* Organikane chapters: iris reveal, stacked panels, fireflies, dandelion seeds, cursor light, marquee skew, magnetic buttons */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- headline word split ---------- */
  function split(el) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.nodeValue.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'), i = document.createElement('span');
            w.className = 'w'; i.textContent = t; i.style.transitionDelay = (.12 + n++ * .07) + 's';
            w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(el);
  }
  $$('.split').forEach(split);

  /* ---------- text reveal for panels + picnic (iris is driven by scroll) ---------- */
  var texts = $$('.panel__in, .fp--picnic .fp__in');
  if (reduce || !('IntersectionObserver' in window)) {
    $$('.fp__in, .panel__in').forEach(function (t) { t.classList.add('in'); });
  } else {
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); tio.unobserve(e.target); } });
    }, { threshold: .35 });
    texts.forEach(function (t) { tio.observe(t); });
  }

  /* ---------- particle fields (fireflies + dandelion seeds) ---------- */
  function field(cv, kind) {
    if (!cv || reduce || !cv.getContext) return null;
    var ctx = cv.getContext('2d'), host = cv.parentNode, W = 0, H = 0, P = [], raf = 0, visible = false, t = 0, ptr = { x: -999, y: -999 };
    var sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
    var sc = sprite.getContext('2d'), g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    if (kind === 'fire') { g.addColorStop(0, 'rgba(255,248,210,1)'); g.addColorStop(.18, 'rgba(255,214,120,.9)'); g.addColorStop(.5, 'rgba(255,170,60,.22)'); g.addColorStop(1, 'rgba(255,170,60,0)'); }
    else { g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(.4, 'rgba(255,250,220,.25)'); g.addColorStop(1, 'rgba(255,250,220,0)'); }
    sc.fillStyle = g; sc.fillRect(0, 0, 64, 64);
    function mk(init) {
      if (kind === 'fire') return { x: Math.random() * W, y: H * (.15 + Math.random() * .8), r: 5 + Math.random() * 11, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .25, ph: Math.random() * 6.28, sp: .6 + Math.random() * 1.4, ox: 0, oy: 0 };
      return { x: init ? Math.random() * W : -30, y: H * (.1 + Math.random() * .8), r: 5 + Math.random() * 10, vx: .35 + Math.random() * .7, vy: -.1 - Math.random() * .35, ph: Math.random() * 6.28, sp: .5 + Math.random(), rot: Math.random() * 6.28 };
    }
    function size() {
      var r = host.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0);
      var n = (kind === 'fire' ? 46 : 22) * (W < 700 ? .5 : 1); n = Math.round(n);
      while (P.length < n) P.push(mk(true)); P.length = n;
    }
    function frame() {
      if (!visible) { raf = 0; return; }
      t += .016; ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
      P.forEach(function (p, i) {
        if (kind === 'fire') {
          p.x += p.vx + Math.sin(t * .8 + p.ph) * .3; p.y += p.vy + Math.cos(t * .7 + p.ph) * .25;
          var dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
          if (d2 < 16900) { var d = Math.sqrt(d2) || 1, f = (130 - d) / 130; p.x += dx / d * f * 3.2; p.y += dy / d * f * 3.2; }
          if (p.x < -30) p.x = W + 30; else if (p.x > W + 30) p.x = -30;
          if (p.y < H * .08) p.vy = Math.abs(p.vy); else if (p.y > H * .96) p.vy = -Math.abs(p.vy);
          var a = .25 + .75 * Math.max(0, Math.sin(t * p.sp + p.ph)), s = p.r * (.7 + a * .6) * 2;
          ctx.globalAlpha = a; ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
        } else {
          p.x += p.vx; p.y += p.vy + Math.sin(t * p.sp + p.ph) * .35; p.rot += .004;
          if (p.x > W + 40 || p.y < -40) { P[i] = mk(false); return; }
          var s2 = p.r * 2.4; ctx.globalAlpha = .55;
          ctx.drawImage(sprite, p.x - s2, p.y - s2, s2 * 2, s2 * 2);
          ctx.globalAlpha = .8; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = .8;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.beginPath(); for (var k = 0; k < 9; k++) { var an = k / 9 * 6.283; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an) * p.r, Math.sin(an) * p.r); } ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, 6.283); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
        }
      });
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    function go() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }
    size(); window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; go(); }).observe(host);
    else { visible = true; go(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else go(); });
    if (fine) {
      host.addEventListener('pointermove', function (e) { var r = host.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; });
      host.addEventListener('pointerleave', function () { ptr.x = ptr.y = -999; });
    }
    return { size: size };
  }
  field($('#fireflies'), 'fire');
  field($('#seeds'), 'seed');

  /* ---------- scroll-linked: iris, stacked panels, picnic zoom, marquee skew ---------- */
  var iris = $('.fp--iris'), irisText = $('#irisText'), panels = $$('.panel'), zoom = $('[data-zoom]'), mq = $$('.mq__row');
  var lastY = window.scrollY, sk = 0, skRaf = 0, ticking = false;
  var ease = function (x) { return x * x * (3 - 2 * x); };

  function onScroll() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    if (!reduce) {
      if (iris) {
        var r = iris.getBoundingClientRect();
        if (r.bottom > -50 && r.top < vh + 50) {
          var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1), o = clamp(p / .55, 0, 1);
          iris.style.setProperty('--ir', (5 + 75 * ease(o)).toFixed(2) + '%');
          iris.style.setProperty('--ip', ease(o).toFixed(3));
          if (irisText) irisText.classList.toggle('in', p > .62);
        }
      }
      panels.forEach(function (pn, i) {
        var nx = panels[i + 1]; if (!nx) return;
        var top = nx.getBoundingClientRect().top;
        pn.style.setProperty('--k', clamp(1 - top / vh, 0, 1).toFixed(3));
      });
      if (zoom) {
        var zr = zoom.parentNode.getBoundingClientRect();
        if (zr.bottom > 0 && zr.top < vh) { var t = clamp((vh - zr.top) / (vh + zr.height), 0, 1); zoom.style.transform = 'scale(' + (1.22 - t * .2).toFixed(3) + ')'; }
      }
      var v = y - lastY; lastY = y;
      if (mq.length && Math.abs(v) > 0) { sk = clamp(sk + v * -.05, -9, 9); if (!skRaf) skRaf = requestAnimationFrame(decay); }
    }
  }
  function decay() {
    sk *= .9; if (Math.abs(sk) < .03) sk = 0;
    mq.forEach(function (m, i) { m.style.setProperty('--sk', ((i ? -1 : 1) * sk).toFixed(2) + 'deg'); });
    skRaf = sk ? requestAnimationFrame(decay) : 0;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- cursor light + image drift on the stacked panels ---------- */
  if (fine && !reduce) {
    panels.forEach(function (pn) {
      pn.addEventListener('pointermove', function (e) {
        var r = pn.getBoundingClientRect();
        pn.style.setProperty('--sx', (e.clientX - r.left).toFixed(0) + 'px');
        pn.style.setProperty('--sy', (e.clientY - r.top).toFixed(0) + 'px');
        pn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
        pn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
        pn.style.setProperty('--sl', 1);
      });
      pn.addEventListener('pointerleave', function () { pn.style.setProperty('--sl', 0); pn.style.setProperty('--mx', 0); pn.style.setProperty('--my', 0); });
    });

    /* ---------- magnetic buttons ---------- */
    $$('.btn--solid, .btn--bamboo, .btn--line').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * .32).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
  }
})();

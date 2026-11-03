/* Phanera – jelenetek, szövegszinkron, nyelvváltó, navigáció.
   Minden [data-scene] egy sticky jelenet; a progress (0..1) a jelenet görgetett része.
   Szöveg-animációk a jelenet simított progresszéhez kötve (így a képsorral szinkronban vannak):
     data-a="a b c d"   átlátszóság 0→1 a..b között, 1→0 c..d között (c, d elhagyható)
     data-words="a b"   szavanként megjelenő mondat (data-blur: életlenből élesre)
     data-light="a b"   szavanként kivilágosodó bekezdés
     data-fill="a b"    vízszintes kitöltés (scaleX)
     data-rise="a b c d" szavanként, maszk mögül felemelkedő cím (be a..b, az egész ki c..d)
     data-step="a b"    kivilágosodó sor (halvány → teljes a..b között; ha van b2, c..d visszahalványul)
     data-nav-hide="a b" a <section>-ön: a nav eltűnik, amíg a jelenet ebben a sávban van
   Szekvencia-paraméterek a <section>-ön:
     data-seq, data-frames (helykitöltő kockaszám), data-hold (a végén kitartott rész),
     data-static (csökkentett mozgásnál mutatott kocka, 0..1), data-fit-mobile (0 contain … 1 cover),
     data-fit-desktop, data-focus="x y" (fókuszpont 0..1). */
(function () {
  'use strict';

  var SEQ = window.PhaneraSeq;
  var doc = document.documentElement;
  var RM = doc.classList.contains('rm');
  var TAU = 0.11;                         // simítás időállandója (s)
  var NAV_H = 52;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  // fizikai belépés: gyors indulás, hosszú lassulás (expo-out); kilépés: puha smoothstep
  function easeOut(t) { t = clamp(t, 0, 1); return t >= 1 ? 1 : (1 - Math.pow(2, -10 * t)) / (1 - Math.pow(2, -10)); }
  function nums(s) { return (s || '').trim().split(/\s+/).map(parseFloat); }

  /* ------------------------------------------------------- szavak szétbontása */
  function splitWords(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push(n);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/([^\S\u00a0]+)/).forEach(function (part) {
        if (!part) return;
        if (/^[^\S\u00a0]+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var sp = document.createElement('span');
        sp.className = 'w'; sp.textContent = part;
        frag.appendChild(sp);
      });
      node.parentNode.replaceChild(frag, node);
    });
    var words = Array.prototype.slice.call(root.querySelectorAll('.w'));
    return words.map(function (w) {
      var l = w.closest('[data-l]');
      return { el: w, lang: l ? l.getAttribute('data-l') : null, line: w.closest('.line'), last: -1 };
    });
  }

  /* -------------------------------------------------------------- jelenetek */
  var scenes = [], navBlocks = [];
  var lang = doc.dataset.lang || 'hu';

  function Scene(el) {
    this.el = el;
    this.name = el.dataset.scene;
    this.stage = el.querySelector('.stage');
    this.top = 0; this.len = 1; this.height = 0;
    this.target = 0; this.cur = 0; this.lastP = -1;
    this.hold = parseFloat(el.dataset.hold || '0');
    this.anims = Array.prototype.map.call(el.querySelectorAll('[data-a]'), function (e) {
      var v = nums(e.dataset.a);
      return { el: e, a: v[0], b: v[1], c: v.length > 2 ? v[2] : 9, d: v.length > 3 ? v[3] : 10, last: -1 };
    });
    this.fills = Array.prototype.map.call(el.querySelectorAll('[data-fill]'), function (e) {
      var v = nums(e.dataset.fill); return { el: e, a: v[0], b: v[1], last: -1 };
    });
    this.wordGroups = [];
    var self = this;
    el.querySelectorAll('[data-words]').forEach(function (e) {
      var v = nums(e.dataset.words);
      self.wordGroups.push({ kind: 'words', a: v[0], b: v[1], blur: e.hasAttribute('data-blur'), words: splitWords(e) });
    });
    el.querySelectorAll('[data-light]').forEach(function (e) {
      var v = nums(e.dataset.light);
      self.wordGroups.push({ kind: 'light', a: v[0], b: v[1], words: splitWords(e) });
    });
    this.rises = [];
    el.querySelectorAll('[data-rise]').forEach(function (e) {
      var v = nums(e.dataset.rise);
      var words = splitWords(e);
      var intro = e.classList.contains('intro-rise'), k = {};
      words.forEach(function (w) {
        if (intro) {
          k[w.lang] = (k[w.lang] || 0) + 1;
          var dl = .2 + .11 * (k[w.lang] - 1);
          // a hero dőlt szava három animációt kap (felemelkedés, előhívás, sodródás) – mindhárom késleltetését ehhez igazítjuk
          w.el.style.animationDelay = w.el.closest('em') ? dl.toFixed(2) + 's, ' + (dl + 1.3).toFixed(2) + 's, ' + (dl + 3.7).toFixed(2) + 's' : dl.toFixed(2) + 's';
        }
        var m = document.createElement('span'); m.className = 'wm';
        w.el.parentNode.insertBefore(m, w.el); m.appendChild(w.el);
      });
      self.rises.push({ el: e, a: v[0], b: v[1], c: v.length > 2 ? v[2] : 9, d: v.length > 3 ? v[3] : 10, words: words, last: -1 });
    });
    this.steps = Array.prototype.map.call(el.querySelectorAll('[data-step]'), function (e) {
      var v = nums(e.dataset.step);
      return { el: e, a: v[0], b: v[1], c: v.length > 2 ? v[2] : 9, d: v.length > 3 ? v[3] : 10, last: -1 };
    });
    var nh = el.dataset.navHide ? nums(el.dataset.navHide) : null;
    this.navHide = nh;
    this.player = null;
    this.badge = el.querySelector('.seq-badge');
  }

  Scene.prototype.apply = function (p, force) {
    var i, o;
    // v3: a jelenet progressze CSS-változóként is (állóképek lassú közelítése, „előhívás”)
    if (force || Math.abs(p - this.lastP) > .0015) { this.lastP = p; this.stage.style.setProperty('--p', p.toFixed(4)); }
    for (i = 0; i < this.anims.length; i++) {
      o = this.anims[i];
      var up = o.b <= o.a ? (p >= o.a ? 1 : 0) : easeOut((p - o.a) / (o.b - o.a));
      var dn = o.d <= o.c ? (p < o.c ? 1 : 0) : 1 - smooth((p - o.c) / (o.d - o.c));
      var v = Math.min(up, dn);
      if (!force && Math.abs(v - o.last) < .002) continue;
      o.last = v;
      var entering = up < dn;
      var y = entering ? (1 - up) * 14 : -(1 - dn) * 10;   // márkakönyv: 8–16 px emelkedés
      var blur = entering ? (1 - up) * 8 : (1 - dn) * 5;
      o.el.style.opacity = v.toFixed(3);
      o.el.style.transform = v >= .999 ? 'none' : 'translate3d(0,' + y.toFixed(2) + 'px,0) scale(' + (.985 + .015 * v).toFixed(4) + ')';
      o.el.style.filter = v >= .999 || v <= .001 ? 'none' : 'blur(' + blur.toFixed(2) + 'px)';
      o.el.style.visibility = v <= .001 ? 'hidden' : '';
    }
    for (i = 0; i < this.rises.length; i++) applyRise(this.rises[i], p, force);
    for (i = 0; i < this.steps.length; i++) {
      o = this.steps[i];
      var su = o.b <= o.a ? (p >= o.a ? 1 : 0) : easeOut((p - o.a) / (o.b - o.a));
      var sd = o.d <= o.c ? (p < o.c ? 1 : 0) : 1 - smooth((p - o.c) / (o.d - o.c));
      var sv = Math.min(su, sd);
      if (!force && Math.abs(sv - o.last) < .002) continue;
      o.last = sv;
      o.el.style.setProperty('--on', sv.toFixed(3));
      o.el.classList.toggle('is-on', sv > .5);
    }
    for (i = 0; i < this.fills.length; i++) {
      o = this.fills[i];
      var f = clamp((p - o.a) / (o.b - o.a), 0, 1);
      if (!force && Math.abs(f - o.last) < .002) continue;
      o.last = f; o.el.style.transform = 'scaleX(' + f.toFixed(3) + ')';
    }
    for (var g = 0; g < this.wordGroups.length; g++) applyWords(this.wordGroups[g], p, force);
  };

  /* maszk mögül felemelkedő szavak: mindegyik a saját alapvonaláról indul, enyhe késleltetéssel */
  function applyRise(r, p, force) {
    var dn = r.d <= r.c ? (p < r.c ? 1 : 0) : 1 - smooth((p - r.c) / (r.d - r.c));
    var key = Math.round(p * 2000) + dn;
    if (!force && key === r.last) return;
    r.last = key;
    var list = r.words.filter(function (w) { return !w.lang || w.lang === lang; });
    var n = list.length, span = r.b - r.a, dur = span * (n > 1 ? .62 : 1), lag = n > 1 ? (span - dur) / (n - 1) : 0;
    list.forEach(function (w, i) {
      var v = r.b <= r.a ? (p >= r.a ? 1 : 0) : easeOut((p - r.a - lag * i) / dur);
      if (Math.abs(v - w.last) < .002 && !force) return;
      w.last = v;
      w.el.style.transform = v >= .999 ? 'none' : 'translate3d(0,' + ((1 - v) * 112).toFixed(2) + '%,0)';
      w.el.style.filter = v >= .999 ? 'none' : 'blur(' + ((1 - v) * 7).toFixed(2) + 'px)';
    });
    r.el.style.opacity = dn.toFixed(3);
    r.el.style.filter = dn >= .999 || dn <= .001 ? 'none' : 'blur(' + ((1 - dn) * 6).toFixed(2) + 'px)';
    r.el.style.transform = dn >= .999 ? 'none' : 'translate3d(0,' + (-(1 - dn) * 18).toFixed(2) + 'px,0)';
    r.el.style.visibility = dn <= .001 || p < r.a ? 'hidden' : '';
  }

  function applyWords(grp, p, force) {
    var list = grp.words.filter(function (w) { return !w.lang || w.lang === lang; });
    // a sortörés plusz szünetet kap: a mondat két fele külön lélegzik
    var slots = [], slot = 0, prevLine = null;
    list.forEach(function (w, i) {
      if (i > 0 && w.line && w.line !== prevLine) slot += 1.6;
      slots.push(slot); slot += 1; prevLine = w.line;
    });
    var total = Math.max(1, slot), span = grp.b - grp.a;
    var dur = grp.kind === 'light' ? span / total * 5 : span / total * 2.4;
    list.forEach(function (w, i) {
      var start = grp.a + span * (slots[i] / total) - (grp.kind === 'light' ? dur * .5 : 0);
      var v = smooth((p - start) / dur);
      if (!force && Math.abs(v - w.last) < .003) return;
      w.last = v;
      if (grp.kind === 'light') {
        w.el.style.opacity = (.16 + .84 * v).toFixed(3);
      } else {
        w.el.style.opacity = v.toFixed(3);
        w.el.style.transform = v >= .999 ? 'none' : 'translate3d(0,' + ((1 - v) * .28).toFixed(3) + 'em,0)';
        if (grp.blur) w.el.style.filter = v >= .999 ? 'none' : 'blur(' + ((1 - v) * 9).toFixed(2) + 'px)';
      }
    });
  }

  /* ------------------------------------------------------------- mérések */
  var vh = window.innerHeight;
  function measure() {
    vh = window.innerHeight;
    var y = window.scrollY;
    scenes.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      s.top = r.top + y;
      s.height = s.el.offsetHeight;
      var stageH = s.stage.offsetHeight || vh;
      s.len = Math.max(1, s.height - stageH);
      if (s.player) s.player.measure();
    });
    navBlocks.forEach(function (b) {
      var r = b.el.getBoundingClientRect();
      b.top = r.top + y; b.bottom = b.top + b.el.offsetHeight;
    });
    navBlocks.sort(function (a, b) { return a.top - b.top; });
    kick(true);
  }

  /* ------------------------------------------------------------ rAF hurok */
  var running = false, lastT = 0, settle = 0, forceNext = false, snap = false;
  var lastPrioT = 0, lastNav = '', lastHide = false;
  function kick(force) {
    if (force) forceNext = true;
    if (!running) { running = true; lastT = 0; requestAnimationFrame(loop); }
  }

  function loop(t) {
    var dt = lastT ? Math.min(.1, (t - lastT) / 1000) : 1 / 60;
    lastT = t;
    var y = window.scrollY;
    var k = 1 - Math.exp(-dt / TAU);
    var moving = false;
    var force = forceNext; forceNext = false;

    for (var i = 0; i < scenes.length; i++) {
      var s = scenes[i];
      var raw = RM ? s.staticP : clamp((y - s.top) / s.len, 0, 1);
      s.target = raw;
      if (snap || RM) s.cur = raw;
      else {
        var d = raw - s.cur;
        if (Math.abs(d) < 1e-4) s.cur = raw; else { s.cur += d * k; moving = true; }
      }
      // will-change (külön réteg a szavaknak) csak a nézet közelében lévő jelenetben – a többi nem foglal rétegmemóriát
      var live = y + vh * 1.6 > s.top && y - vh * .6 < s.top + s.height;
      if (live !== s.live) { s.live = live; s.el.classList.toggle('is-live', live); }
      var visible = y + vh > s.top - 2 && y < s.top + s.height + 2;
      if (!visible && !force) continue;
      try {
        if (s.player && (visible || !s.player.parked)) {   // parkolt (hideg) vásznat nem ébresztünk fel feleslegesen
          var fp = RM ? s.staticP : (s.hold > 0 ? clamp(s.cur / (1 - s.hold), 0, 1) : s.cur);
          s.player.render(fp);
          if (s.player.dirty) moving = true;
        }
        if (!RM) s.apply(s.cur, force);
      } catch (e) { /* egy jelenet hibája sem állíthatja meg a hurkot */ }
    }
    snap = false;

    // navigációs téma (sötét / világos / fehér) – a nav alatti blokk szerint
    var probe = y + NAV_H * .5, theme = lastNav;
    for (var j = 0; j < navBlocks.length; j++) {
      if (probe >= navBlocks[j].top && probe < navBlocks[j].bottom) { theme = navBlocks[j].theme; break; }
    }
    if (theme !== lastNav) { doc.dataset.nav = theme; lastNav = theme; }
    var hide = false;
    for (var h = 0; h < scenes.length; h++) {
      var sh = scenes[h];
      if (sh.navHide && y >= sh.top && y < sh.top + sh.height && sh.cur >= sh.navHide[0] && sh.cur <= sh.navHide[1]) hide = true;
    }
    if (hide !== lastHide) { doc.classList.toggle('nav-hidden', hide); lastHide = hide; }

    // betöltési prioritás: a nézethez közeli képsorok előre (a távoliak felszabadulnak)
    if (t - lastPrioT > 100) { lastPrioT = t; updatePriorities(y); }

    if (moving || force) settle = 0; else settle++;
    if (settle > 20) { running = false; return; }
    requestAnimationFrame(loop);
  }

  var lastPrioY = -1, scrollDir = 1;
  function updatePriorities(y) {
    try {
      if (lastPrioY >= 0 && y !== lastPrioY) scrollDir = y > lastPrioY ? 1 : -1;
      lastPrioY = y;
      scenes.forEach(function (s) {
        if (!s.player) return;
        // előjeles távolság képernyőben: + a nézet alatt, − fölötte, 0 = látható
        var below = s.top - (y + vh), above = y - (s.top + s.height);
        var dist = below > 0 ? below / vh : above > 0 ? -above / vh : 0;
        s.player.seq.setView(dist, dist === 0, scrollDir);
      });
      // a rAF-hurok csak látható oldalon fut: ha ide eljutunk, az oldal látszik (egyes webview-k rosszul jelentik a visibilityState-et)
      if (SEQ) { SEQ.Loader.suspended = false; SEQ.Loader.pump(); }
    } catch (e) {}
  }

  /* ---------------------------------------------------------- nyelvváltó */
  // v5 (2026-11-03): külön URL nyelvenként (/ = HU, /en/ = EN). Kattintásra a cím (URL) is átvált,
  // újratöltés nélkül; a választás csak kattintásra mentődik.
  function setLang(l, byUser) {
    lang = l; doc.dataset.lang = l; doc.lang = l;
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === l));
    });
    document.title = l === 'en' ? 'Phanera One – 405 nm fluorescence imaging | Phanera' : 'Phanera One – fluoreszcens képalkotás 405 nm-en | Phanera';
    try {
      var path = location.pathname, root = path.replace(/en\/(index\.html)?$/, '').replace(/index\.html$/, '');
      if (/\/$/.test(root) && (path === root || path === root + 'index.html' || path === root + 'en/' || path === root + 'en/index.html')) {
        var want = l === 'en' ? root + 'en/' : root;
        if (path !== want) history.replaceState(history.state, '', want + location.search + location.hash);
      }
    } catch (e) {}
    if (byUser) { try { localStorage.setItem('phanera-lang', l); } catch (e) {} }
    measure();
  }

  /* ------------------------------------------------------- belépési pont */
  function init(manifest) {
    document.querySelectorAll('[data-scene]').forEach(function (el) {
      var s = new Scene(el);
      s.staticP = parseFloat(el.dataset.static || '1');
      var canvas = el.querySelector('canvas.seq-canvas');
      var name = el.dataset.seq;
      if (canvas && name && SEQ) {
        var seq = new SEQ.Sequence(name, manifest[name] || null, {
          mobileEntry: manifest[name + '@m'] || null,
          fallbackCount: parseInt(el.dataset.frames || '120', 10),
          firstIndex: 0,
          staticP: s.staticP,
          staticOnly: RM
        });
        s.player = new SEQ.Player(s, canvas, seq);
        // a render háttere dönti el a jelenet tónusát (fehér G3-renderre a hero is világos lesz)
        (function (sc) {
          sc.player.onTone = function (tone) {
            // v3: data-require-tone="dark" – ha a render tónusa nem ez (pl. a hero még fehér high-key kockákkal fut),
            // a vászon rejtve marad, a jelenet a kért tónusban áll (tipográfiai nyitány). Ha a sötét render megjön, magától látszik.
            var req = sc.el.dataset.requireTone;
            if (req) {
              var ok = tone === req;
              sc.stage.classList.toggle('seq-off', !ok);
              if (!ok) { tone = req; sc.stage.style.removeProperty('--bg'); }
            }
            sc.stage.dataset.tone = tone;
            navBlocks.forEach(function (b) { if (b.el === sc.el) b.theme = tone; });
            lastNav = ''; kick(true);
          };
        })(s);
        var prevOnload = seq.onload;
        seq.onload = function (i) { prevOnload(i); kick(); };
        SEQ.Loader.add(seq);
        // csak a vászonra rajzolt helykitöltőnél; a renderelt helykitöltő kockákon saját vízjel van
        if (s.badge && seq.procedural) {
          s.badge.hidden = false;
          s.badge.innerHTML = '<span data-l="hu">Helykitöltő · a végleges renderek ide kerülnek</span><span data-l="en">Placeholder · final renders go here</span>';
        }
      }
      scenes.push(s);
    });
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      if (el === doc) return;
      navBlocks.push({ el: el, theme: el.dataset.nav, top: 0, bottom: 0 });
    });

    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.setLang, true); });
    });
    setLang(lang);

    // megjelenés a nem-sticky blokkokban
    var rev = document.querySelectorAll('.reveal');
    if (!RM && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -12% 0px' });
      rev.forEach(function (e) { io.observe(e); });
    } else rev.forEach(function (e) { e.classList.add('in'); });

    window.addEventListener('scroll', function () { kick(); }, { passive: true });
    if (SEQ) SEQ.Loader.onresume = function () { scenes.forEach(function (s) { if (s.player) s.player.dirty = true; }); kick(true); };
    var rT;
    window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(measure, 80); });
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { clearTimeout(rT); rT = setTimeout(measure, 80); });
      ro.observe(document.body);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    measure();
    doc.classList.add('ready');
    debugJump();
    updatePriorities(window.scrollY);
    kick(true);
  }

  /* előnézeti képernyőképekhez: ?at=<jelenet>:<0..1> – oda görget, simítás nélkül */
  function debugJump() {
    var m = /[?&]at=([a-z]+):([\d.]+)/.exec(location.search);
    if (!m) return;
    var s = scenes.filter(function (x) { return x.name === m[1]; })[0];
    if (!s) {
      var el = document.querySelector(m[1] === 'foot' ? '.foot' : '#' + m[1]);
      if (m[1] === 'foot' && /open/.test(location.search)) { var dd = document.querySelector('.foot details'); if (dd) dd.open = true; }
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + parseFloat(m[2]) * el.offsetHeight - NAV_H);
      document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });
      snap = true; return;
    }
    window.scrollTo(0, s.top + parseFloat(m[2]) * s.len);
    snap = true;
  }

  // ha a képsor-motor nem töltődött be, a szöveg akkor is működjön (képsor nélkül)
  var started = false;
  function safeInit(m) {
    if (started) return; started = true;
    try { init(m || {}); } catch (e) { doc.classList.add('rm', 'ready'); }   // végső tartalék: statikus, olvasható elrendezés
  }
  function start() {
    if (!SEQ) { safeInit({}); return; }
    var p; try { p = SEQ.loadManifest(); } catch (e) { p = null; }
    if (!p || !p.then) { safeInit({}); return; }
    p.then(safeInit, function () { safeInit({}); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

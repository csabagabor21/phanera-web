/* Phanera – görgetésre lejátszott képsor-motor (image sequence scrubbing)

   Szerződés (ne változtasd – más agentek ebbe renderelnek):
     seq/<név>/f_0001.webp …            4 jegyű, 1-től számozott képkockák
     seq/<név>@m/f_0001.webp …          opcionális fél felbontású mobil készlet
     seq/manifest.json                  { "<név>": { "count": N, "w": W, "h": H, "ext": "webp",
                                                     "placeholder": true|false, "mobile": true? } }
   Ha egy névnek nincs bejegyzése, a vászonra rajzolt helykitöltő fut (placeholder.js).

   Memória (v4, 2026-10-29 – iPhone Safari / Messenger / LinkedIn webview tab-kill javítás):
   - SZIGORÚ dekódolt-kocka keret (bájtban): asztal 900 MB, mobil 170 MB, in-app webview 80 MB,
     nagyon kevés memória (deviceMemory ≤ 1 vagy ismételt összeomlás) → „still” mód: jelenetenként 1 kocka.
     A keret sosem lépi túl (a folyamatban lévő dekódolásokat is beszámítjuk).
   - csak a közeli képsor dekódol: látható = „forró” (ablak + ritka kulcskockák), a következő 1,5–3 képernyőn
     belül = „langyos” (belépő kocka + néhány + kulcskockák), a többi = „hideg”: minden kockája felszabadul
     (ImageBitmap.close(), referencia el), és a vászon háttértára 1×1-re zsugorodik.
   - a forró képsoron csúszó ablak az aktuális kocka körül (a görgetés irányába hosszabb) + minden K-adik kocka;
     ha nincs hely, a legkevésbé fontos kockát dobjuk el.
   - dekódolás a vászon tényleges pixelméretére (createImageBitmap resizeWidth/Height), DPR-plafon 2 (webview 1,5),
     a vászon háttértára pixelszámra is korlátos.
   - webview: minden 2. kocka (indexleképezéssel – a kockaszám és az időzítés változatlan).
   - a tömörített webp-ket (kockánként ~5–10 kB) memóriában tartjuk (plafonnal), így az újradekódolás nem megy a hálóra;
     tétlen időben a közeli képsorok tömörített kockái előre letöltődnek.
   - tartalék: createImageBitmap / fetch hibája esetén <img>.decode(); minden API try/catch mögött.
   - ismételt összeomlás-észlelés (sessionStorage): ha az előző betöltés nem jutott el a pagehide-ig, egy szinttel lejjebb lépünk.
   - teszteléshez: ?mem=desktop|mobile|webview|still  · statisztika: PhaneraSeq.stats() */
(function () {
  'use strict';

  var ROOT = 'seq/';
  // Képkocka-verzió: újrarenderelés után emeld meg, különben a böngésző a régi kockákat adja a gyorsítótárból.
  var FRAME_REV = '20261029d';
  var MB = 1048576;
  var DEFAULT_COUNT = 120;

  function pad4(n) { return String(n).padStart(4, '0'); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function mq(q) { try { return !!(window.matchMedia && window.matchMedia(q).matches); } catch (e) { return false; } }

  /* ------------------------------------------------- eszköz-osztály és keret */
  var UA = (navigator && navigator.userAgent) || '';
  var MOBILE = mq('(max-width: 820px), (pointer: coarse) and (max-width: 1100px)');
  var IOS = /iPhone|iPad|iPod/.test(UA) || (/Macintosh/.test(UA) && (navigator.maxTouchPoints || 0) > 1);
  var INAPP = /FBAN|FBAV|FB_IAB|FBIOS|FB4A|Messenger|LinkedInApp|Instagram|Line\/|MicroMessenger|Snapchat|musical_ly|BytedanceWebview|TikTok/i.test(UA) ||
              /Android.*; wv\)/.test(UA);
  var DM = 0; try { DM = +navigator.deviceMemory || 0; } catch (e) {}

  /* összeomlás-hurok észlelése: ha az előző betöltés nem ért el a pagehide-ig, a tab meghalt (iOS jetsam) */
  var CRASHES = 0;
  (function () {
    var ss = null, K = 'phanera-run';
    try { ss = window.sessionStorage; } catch (e) { return; }
    if (!ss) return;
    try {
      var v = JSON.parse(ss.getItem(K) || 'null');
      CRASHES = v && v.open ? (v.n || 0) + 1 : 0;
      var put = function (open) { try { ss.setItem(K, JSON.stringify({ open: open, n: CRASHES, t: Date.now() })); } catch (e) {} };
      put(true);
      window.addEventListener('pagehide', function () { put(false); });
      window.addEventListener('pageshow', function (e) { if (e && e.persisted) put(true); });
    } catch (e) {}
  })();

  var TIERS = ['desktop', 'mobile', 'webview', 'still'];
  var TIER = (function () {
    var m = /[?&]mem=(desktop|mobile|webview|still|static)\b/.exec(location.search);
    if (m) return m[1] === 'static' ? 'still' : m[1];
    var t;
    if (DM && DM <= 1) t = 'still';
    else if (INAPP || (DM && DM <= 2)) t = 'webview';
    else if (MOBILE || IOS) t = 'mobile';
    else t = 'desktop';
    var k = Math.min(TIERS.length - 1, TIERS.indexOf(t) + Math.min(CRASHES, 2));
    return TIERS[k];
  })();
  var P = {
    //        keret (dekódolt bájt)                           DPR   vászon max px  párh.  ritkítás  langyos (vh)  tömörített gyorsítótár
    desktop: { budget: (DM && DM <= 4 ? 480 : 900) * MB,       dpr: 2,   maxPx: 4.2e6, par: 6, sub: 1, warm: 3,   blobCap: 40 * MB, rq: 'high' },
    mobile:  { budget: (DM && DM <= 3 ? 120 : 170) * MB,       dpr: 2,   maxPx: 2.4e6, par: 3, sub: 1, warm: 2.5, blobCap: 24 * MB, rq: 'medium' },
    webview: { budget: 80 * MB,                                dpr: 1.5, maxPx: 1.2e6, par: 2, sub: 2, warm: 1.5, blobCap: 12 * MB, rq: 'medium' },
    still:   { budget: 40 * MB,                                dpr: 1.5, maxPx: 1.2e6, par: 2, sub: 1, warm: 1.5, blobCap: 2 * MB,  rq: 'medium', still: true }
  }[TIER];

  var HAS_CIB = typeof window.createImageBitmap === 'function';
  var FETCH_OK = typeof window.fetch === 'function' && typeof window.Blob === 'function';
  var cibFails = 0, fetchFails = 0;
  var GIF1 = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

  /* első kocka, utolsó, aztán felező lépésközök: 64, 32, 16, 8, 4, 2, 1 */
  function keyOrder(count, first) {
    var seen = new Uint8Array(count), out = [];
    function add(i) { if (i >= 0 && i < count && !seen[i]) { seen[i] = 1; out.push(i); } }
    add(first || 0); add(0); add(count - 1);
    var s = 1; while (s * 2 < count) s *= 2;
    for (; s >= 1; s = s >> 1) for (var i = 0; i < count; i += s) add(i);
    return out;
  }

  function dispose(img) {
    if (!img) return;
    try {
      if (img.close) img.close();
      else { img.onload = img.onerror = null; img.src = GIF1; }
    } catch (e) {}
  }
  function imgBytes(img) {
    var w = img.naturalWidth || img.width || 0, h = img.naturalHeight || img.height || 0;
    return Math.max(1, w * h * 4);
  }

  /* A mobil készlet kétféleképpen adható meg (mindkettőt elfogadjuk):
       a) "<név>": { …, "mobile": true }  → seq/<név>@m/, ugyanaz a képarány, fél felbontás
       b) külön "<név>@m": { count, w, h, … } bejegyzés → saját méret/képarány (pl. álló 720×1000) */
  function Sequence(name, entry, opts) {
    this.name = name;
    var mEntry = opts.mobileEntry;
    this.separateMobile = false;
    if (MOBILE && entry && entry.count > 0 && mEntry && mEntry.count > 0) {
      entry = mEntry; this.separateMobile = true;
    }
    this.entry = entry || null;
    this.procedural = !entry || !(entry.count > 0);
    this.placeholder = this.procedural || entry.placeholder !== false;
    this.count = this.procedural ? (opts.fallbackCount || DEFAULT_COUNT) : entry.count;
    this.fw = this.procedural ? 1920 : (entry.w || 1920);
    this.fh = this.procedural ? 1080 : (entry.h || 1080);
    this.ext = (entry && entry.ext) || 'webp';
    this.useMobileSet = this.separateMobile || (!this.procedural && MOBILE && entry.mobile === true);
    this.dir = name + (this.useMobileSet ? '@m' : '');
    var n = this.count;
    this.frames = new Array(n);
    this.state = new Uint8Array(n);        // 0 nincs · 1 tölt · 2 kész · 3 hiba
    this.bytes = new Float64Array(n);      // a dekódolt kocka tényleges mérete
    this.blobs = new Array(n);             // tömörített webp (kicsi)
    this.pending = new Array(n);           // folyamatban lévő letöltés (Promise)
    this.loaded = 0;
    this.onload = null;
    this.onmode = null;
    this.staticIdx = Math.round(clamp(opts.staticP == null ? 1 : opts.staticP, 0, 1) * (n - 1));
    this.still = !!(P.still || opts.staticOnly);
    this.sub = this.still ? 1 : P.sub;
    this.order = this.procedural ? [] : keyOrder(n, opts.firstIndex || 0);
    this.pf = 0;                           // tétlen előtöltés mutatója az order-ben
    // nézet-állapot (a page.js állítja): előjeles távolság képernyőben (+ lent, − fent), látható-e, görgetési irány
    this.dist = 1e9; this.visible = false; this.scrollDir = 1;
    this.mode = 0;                         // 0 hideg · 1 langyos · 2 forró
    this.cur = -1;                         // a legutóbb kért kocka (forró képsoron)
    this.K = 16;                           // kulcskocka-lépésköz
    this.resize = null;                    // createImageBitmap kicsinyítés a vászon méretére
    this.costSeen = 0;                     // az utolsó dekódolt kocka tényleges bájtmérete
    this.priority = 1e9;                   // (régi API, kompatibilitás)
  }
  Sequence.prototype.url = function (i) {
    return ROOT + this.dir + '/f_' + pad4(i + 1) + '.' + this.ext + '?v=' + FRAME_REV;
  };
  /* ritkított készlet: csak ezek a kockák töltődnek be (az utolsó mindig) */
  Sequence.prototype.allowed = function (i) {
    if (this.still) return i === this.staticIdx;
    return this.sub <= 1 || i % this.sub === 0 || i === this.count - 1;
  };
  /* indexleképezés: a kért kocka → a készlet legközelebbi tagja (az időzítés változatlan) */
  Sequence.prototype.canon = function (i) {
    if (this.still) return this.staticIdx;
    if (this.sub <= 1) return i;
    var last = this.count - 1, j = Math.round(i / this.sub) * this.sub;
    if (j > last || last - i < Math.abs(i - j)) j = last;
    return clamp(j, 0, last);
  };
  Sequence.prototype.estCost = function () {
    if (this.costSeen) return this.costSeen;               // a ténylegesen dekódolt méret (pl. ha a resize nem működött)
    var r = this.resize;
    return (r ? r.resizeWidth * r.resizeHeight : this.fw * this.fh) * 4;
  };
  Sequence.prototype.updateK = function () {
    var fb = P.budget / Math.max(1, this.estCost());          // ennyi kocka férne a keretbe
    var nk = clamp(Math.round(fb * .3), 4, 24);
    var k = Math.max(this.sub, Math.ceil(this.count / nk));
    if (this.sub > 1) k = Math.ceil(k / this.sub) * this.sub;
    this.K = k;
  };
  Sequence.prototype.setView = function (dist, visible, scrollDir) {
    this.dist = dist; this.visible = visible; this.scrollDir = scrollDir || 1;
    this.priority = Math.abs(dist);
    var m = this.procedural ? 0 : visible ? 2 : Math.abs(dist) <= P.warm ? 1 : 0;
    if (m !== this.mode) {
      var was = this.mode; this.mode = m;
      if (m > 0 && was === 0) { for (var i = 0; i < this.count; i++) if (this.state[i] === 3) this.state[i] = 0; }
      if (m === 0) this.cur = -1;
      if (this.onmode) { try { this.onmode(m, was); } catch (e) {} }
    }
  };
  /* régi API (page.js korábbi változata hívta) */
  Sequence.prototype.setFar = function () {};
  /* mennyire kell ez a kocka most (kisebb = fontosabb; Infinity = egyáltalán nem) */
  Sequence.prototype.score = function (i) {
    if (this.mode === 0 || !this.allowed(i)) return Infinity;
    if (this.still) return this.mode === 2 ? 0 : 1 + Math.abs(this.dist);
    var n = this.count, c, base, dir, lim;
    if (this.mode === 2) {
      c = this.cur >= 0 ? this.cur : (this.dist < 0 ? n - 1 : 0);
      base = 0; dir = this.scrollDir; lim = n;
    } else {
      c = this.dist < 0 ? n - 1 : 0;              // ahol belépünk: fentről az elején, lentről a végén
      base = 10 + Math.abs(this.dist) * 6; dir = this.dist < 0 ? -1 : 1; lim = 8 * this.sub;
    }
    var d = i - c, ad = d < 0 ? -d : d;
    var lin = (d * dir >= 0 ? ad : ad * 1.6) / this.sub;
    if (ad > lim) lin = Infinity;
    if (i % this.K === 0 || i === n - 1) lin = Math.min(lin, 3 + 10 * ad / n);
    return base + lin;
  };
  Sequence.prototype.nearest = function (i) {
    if (this.state[i] === 2) return i;
    for (var d = 1; d < this.count; d++) {
      if (i - d >= 0 && this.state[i - d] === 2) return i - d;
      if (i + d < this.count && this.state[i + d] === 2) return i + d;
    }
    return -1;
  };
  /* minden dekódolt kocka elengedése (a tömörített webp marad) */
  Sequence.prototype.release = function () { for (var i = 0; i < this.count; i++) if (this.state[i] === 2) Loader.evict(this, i); };

  /* ------------------------------------------------ tömörített gyorsítótár */
  var Blobs = {
    bytes: 0,
    put: function (s, i, b) {
      if (!b || s.blobs[i]) return;
      var size = b.size || 0;
      if (this.bytes + size > P.blobCap) this.trim(size);
      if (this.bytes + size > P.blobCap) return;            // nincs hely: nem tartjuk meg (a HTTP-gyorsítótár úgyis megvan)
      s.blobs[i] = b; this.bytes += size;
    },
    dropSeq: function (s) {
      for (var i = 0; i < s.count; i++) if (s.blobs[i]) { this.bytes -= s.blobs[i].size || 0; s.blobs[i] = null; }
      s.pf = 0;
    },
    trim: function (need) {
      var list = Loader.seqs.slice().sort(function (a, b) { return Math.abs(b.dist) - Math.abs(a.dist); });
      for (var k = 0; k < list.length && this.bytes + need > P.blobCap; k++) if (list[k].mode !== 2) this.dropSeq(list[k]);
    }
  };

  function fetchBlob(url) {
    if (!FETCH_OK) return Promise.resolve(null);
    var p;
    try { p = window.fetch(url, { cache: 'force-cache', credentials: 'same-origin' }); }
    catch (e) { try { p = window.fetch(url); } catch (e2) { FETCH_OK = false; return Promise.resolve(null); } }
    return p.then(function (r) {
      if (!r.ok) { var er = new Error('HTTP ' + r.status); er.http = true; throw er; }
      return r.blob();
    }).then(function (b) { fetchFails = 0; return b; }, function (e) {
      if (e && e.http) throw e;
      if (++fetchFails >= 3) FETCH_OK = false;               // pl. korlátozott webview → <img> URL-ről
      return null;
    });
  }
  function getBlob(s, i) {
    if (s.blobs[i]) return Promise.resolve(s.blobs[i]);
    if (s.pending[i]) return s.pending[i];
    var p = fetchBlob(s.url(i)).then(function (b) { s.pending[i] = null; Blobs.put(s, i, b); return b; },
                                     function (e) { s.pending[i] = null; throw e; });
    s.pending[i] = p;
    return p;
  }

  function decodeImg(blob, url) {
    return new Promise(function (res, rej) {
      var img = new Image(), obj = null;
      try { img.decoding = 'async'; } catch (e) {}
      function done() { if (obj) { try { URL.revokeObjectURL(obj); } catch (e) {} obj = null; } }
      img.onload = function () {
        var d; try { d = img.decode ? img.decode() : null; } catch (e) { d = null; }
        if (!d || !d.then) { done(); res(img); return; }
        d.then(function () { done(); res(img); }, function () { done(); res(img); });
      };
      img.onerror = function () { done(); rej(new Error('img')); };
      if (blob && window.URL && URL.createObjectURL) { try { obj = URL.createObjectURL(blob); } catch (e) { obj = null; } }
      img.src = obj || url;
    });
  }
  function decode(blob, s, i) {
    if (!HAS_CIB) return decodeImg(blob, s.url(i));
    if (!blob) {   // nincs fetch: <img> URL-ről, majd (ha kell) kicsinyítés bitmapre, hogy a keret ne teljen meg nagy kockákkal
      return decodeImg(null, s.url(i)).then(function (img) {
        if (!s.resize) return img;
        var q; try { q = window.createImageBitmap(img, s.resize); } catch (e) { return img; }
        return q.then(function (bm) { dispose(img); return bm; }, function () { return img; });
      });
    }
    var r = s.resize, p;
    try { p = r ? window.createImageBitmap(blob, r) : window.createImageBitmap(blob); } catch (e) { p = Promise.reject(e); }
    if (r) p = p.then(null, function () { return window.createImageBitmap(blob); });  // a resize-opciók nem mindenhol mennek
    return p.then(function (bm) { cibFails = 0; return bm; }, function () {
      if (++cibFails >= 3) HAS_CIB = false;                     // korlátozott webview: innentől <img>
      return decodeImg(blob, s.url(i));
    });
  }

  /* --------------------------------------------------------------- betöltő */
  var Loader = {
    seqs: [],
    active: 0, net: 0,
    used: 0, reserved: 0,
    started: 0, evicted: 0, peak: 0,
    suspended: false,
    budget: P.budget,
    add: function (s) { this.seqs.push(s); },
    evict: function (s, i) {
      if (s.state[i] !== 2) return;
      dispose(s.frames[i]);
      s.frames[i] = null; s.state[i] = 0; s.loaded--;
      this.used -= s.bytes[i]; s.bytes[i] = 0; this.evicted++;
    },
    dropAll: function () { for (var k = 0; k < this.seqs.length; k++) this.seqs[k].release(); },
    /* a keret fölé sosem megyünk: a legkevésbé fontos kockát dobjuk el */
    enforce: function () {
      if (this.used + this.reserved <= this.budget) return;
      var list = this.loadedList();
      for (var v = 0; v < list.length && this.used + this.reserved > this.budget; v++) this.evict(this.seqs[list[v][1]], list[v][2]);
    },
    loadedList: function () {
      var out = [];
      for (var k = 0; k < this.seqs.length; k++) {
        var s = this.seqs[k]; if (!s.loaded) continue;
        for (var i = 0; i < s.count; i++) if (s.state[i] === 2) out.push([s.score(i), k, i]);
      }
      return out.sort(function (a, b) { return b[0] - a[0]; });   // a legrosszabb elöl
    },
    pump: function () { try { this._pump(); } catch (e) { /* a motor hibája sosem állíthatja meg az oldalt */ } },
    _pump: function () {
      if (this.suspended) return;
      var seqs = this.seqs, k, s, i;
      // 1) ami már egyáltalán nem kell (hideg képsor, ritkításon kívüli kocka), azonnal megy
      for (k = 0; k < seqs.length; k++) {
        s = seqs[k]; s.updateK();
        if (s.loaded) for (i = 0; i < s.count; i++) if (s.state[i] === 2 && s.score(i) === Infinity) this.evict(s, i);
      }
      // 2) jelöltek fontossági sorrendben
      var cand = [];
      for (k = 0; k < seqs.length; k++) {
        s = seqs[k]; if (s.mode === 0 || s.procedural) continue;
        for (i = 0; i < s.count; i++) if (s.state[i] === 0) { var sc = s.score(i); if (sc < Infinity) cand.push([sc, k, i]); }
      }
      if (!cand.length) { this.idle(); return; }
      cand.sort(function (a, b) { return a[0] - b[0]; });
      var victims = null, vp = 0;
      for (var c = 0; c < cand.length && this.active < P.par; c++) {
        s = seqs[cand[c][1]]; i = cand[c][2];
        var cost = s.estCost();
        while (this.used + this.reserved + cost > this.budget) {
          if (!victims) victims = this.loadedList();
          var v = victims[vp];
          if (!v || v[0] <= cand[c][0] + 1) return;             // a keret tele van fontosabb kockákkal
          vp++; this.evict(seqs[v[1]], v[2]);
        }
        this.load(s, i, cost);
      }
    },
    load: function (s, i, est) {
      var self = this, settled = false;
      s.state[i] = 1; this.active++; this.reserved += est; this.started++;
      function fin() { if (!settled) { settled = true; self.reserved -= est; self.active--; } }
      var p;
      try { p = getBlob(s, i).then(function (b) { return decode(b, s, i); }); } catch (e) { p = Promise.reject(e); }
      p.then(function (img) {
        fin();
        if (s.state[i] !== 1 || self.suspended || s.score(i) === Infinity) { dispose(img); if (s.state[i] === 1) s.state[i] = 0; return; }
        s.frames[i] = img; s.state[i] = 2; s.bytes[i] = imgBytes(img); s.loaded++; self.used += s.bytes[i];
        s.costSeen = s.bytes[i];
        self.enforce();
        if (self.used > self.peak) self.peak = self.used;
        if (s.state[i] === 2 && s.onload) { try { s.onload(i); } catch (e) {} }
      }, function () {
        fin();
        if (s.state[i] === 1) s.state[i] = 3;
      }).then(function () { self.pump(); }, function () { self.pump(); });
    },
    /* tétlen idő: a közeli képsorok tömörített kockáinak előtöltése (dekódolás nélkül) */
    idle: function () {
      if (!FETCH_OK || this.suspended || this.net >= 2 || this.active > 0) return;
      if (Blobs.bytes > P.blobCap * .85) return;
      var best = null, bi = -1, bd = Infinity;
      for (var k = 0; k < this.seqs.length; k++) {
        var s = this.seqs[k];
        if (s.procedural) continue;
        var ad = Math.abs(s.dist);
        if (ad > P.warm * 3 || ad >= bd) continue;
        while (s.pf < s.order.length) {
          var j = s.order[s.pf];
          if (!s.blobs[j] && !s.pending[j] && s.allowed(j)) break;
          s.pf++;
        }
        if (s.pf < s.order.length) { best = s; bi = s.order[s.pf]; bd = ad; }
      }
      if (!best) return;
      var self = this; this.net++; best.pf++;
      getBlob(best, bi).then(null, function () {}).then(function () {
        self.net--;
        later(function () { self.pump(); });
      });
    }
  };
  var later = window.requestIdleCallback ? function (f) { window.requestIdleCallback(f, { timeout: 300 }); } : function (f) { setTimeout(f, 40); };

  /* háttérbe kerülve (appváltás, Messenger/LinkedIn) minden dekódolt kockát elengedünk;
     a page.js rAF-hurka (csak látható oldalon fut) újra feloldja, ha a visibilityState téves lenne */
  document.addEventListener('visibilitychange', function () {
    try {
      if (document.hidden) { Loader.suspended = true; Loader.dropAll(); }
      else { Loader.suspended = false; Loader.pump(); if (Loader.onresume) Loader.onresume(); }
    } catch (e) {}
  });

  /* ------------------------------------------------------------ manifest */
  function loadManifestXHR() {
    return new Promise(function (res) {
      try {
        var x = new XMLHttpRequest();
        x.open('GET', ROOT + 'manifest.json?v=' + FRAME_REV + '.' + Date.now(), true);
        x.onload = function () { try { res(x.status >= 200 && x.status < 300 ? JSON.parse(x.responseText) : {}); } catch (e) { res({}); } };
        x.onerror = x.ontimeout = function () { res({}); };
        x.timeout = 15000;
        x.send();
      } catch (e) { res({}); }
    });
  }
  function loadManifest() {
    if (!FETCH_OK) return loadManifestXHR();
    var p;
    try { p = window.fetch(ROOT + 'manifest.json', { cache: 'no-cache' }); } catch (e) { try { p = window.fetch(ROOT + 'manifest.json'); } catch (e2) { return loadManifestXHR(); } }
    return p.then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(null, function () { return loadManifestXHR(); });   // pl. korlátozott webview: XHR-rel még egyszer
  }

  /* ---------------------------------------------- illesztés és rajzolás
     fitT: 0 = contain, 1 = cover; köztes érték = mértani átmenet (mobilon hasznos) */
  function fitRect(cw, ch, fw, fh, fitT, fx, fy, zoom, ay) {
    var contain = Math.min(cw / fw, ch / fh), cover = Math.max(cw / fw, ch / fh);
    var s = contain * Math.pow(cover / contain, fitT) * (zoom || 1);
    var dw = fw * s, dh = fh * s;
    var dx = dw > cw ? clamp(cw / 2 - fx * dw, cw - dw, 0) : (cw - dw) / 2;
    var dy = dh > ch ? clamp(ch / 2 - fy * dh, ch - dh, 0) : (ch - dh) * (ay == null ? .5 : ay);
    return { dx: dx, dy: dy, dw: dw, dh: dh };
  }

  /* ha a kocka nem tölti ki a vásznat, a széleit a jelenet háttérszínébe olvasztjuk */
  function featherEdges(ctx, r, cw, ch, bg) {
    var f = Math.min(r.dw, r.dh) * .12;
    var t = 'rgba(' + bg[0] + ',' + bg[1] + ',' + bg[2] + ',';
    var g;
    if (r.dy > 0.5) {
      ctx.fillStyle = t + '1)'; ctx.fillRect(0, 0, cw, Math.ceil(r.dy)); ctx.fillRect(0, Math.floor(r.dy + r.dh), cw, ch);
      g = ctx.createLinearGradient(0, r.dy, 0, r.dy + f); g.addColorStop(0, t + '1)'); g.addColorStop(1, t + '0)');
      ctx.fillStyle = g; ctx.fillRect(0, r.dy, cw, f);
      g = ctx.createLinearGradient(0, r.dy + r.dh - f, 0, r.dy + r.dh); g.addColorStop(0, t + '0)'); g.addColorStop(1, t + '1)');
      ctx.fillStyle = g; ctx.fillRect(0, r.dy + r.dh - f, cw, f);
    }
    if (r.dx > 0.5) {
      ctx.fillStyle = t + '1)'; ctx.fillRect(0, 0, Math.ceil(r.dx), ch); ctx.fillRect(Math.floor(r.dx + r.dw), 0, cw, ch);
      g = ctx.createLinearGradient(r.dx, 0, r.dx + f, 0); g.addColorStop(0, t + '1)'); g.addColorStop(1, t + '0)');
      ctx.fillStyle = g; ctx.fillRect(r.dx, 0, f, ch);
      g = ctx.createLinearGradient(r.dx + r.dw - f, 0, r.dx + r.dw, 0); g.addColorStop(0, t + '0)'); g.addColorStop(1, t + '1)');
      ctx.fillStyle = g; ctx.fillRect(r.dx + r.dw - f, 0, f, ch);
    }
  }

  function parseRGB(css) {
    var m = String(css || '').match(/\d+(\.\d+)?/g);
    return m && m.length >= 3 ? [Math.round(+m[0]), Math.round(+m[1]), Math.round(+m[2])] : [0, 0, 0];
  }

  /* --------------------------------------------------------------- Player */
  function Player(scene, canvas, seq) {
    this.scene = scene;
    this.canvas = canvas;
    this.ctx = null;
    try { this.ctx = canvas.getContext('2d', { alpha: false }); } catch (e) { this.ctx = null; }
    this.broken = !this.ctx;
    this.seq = seq;
    this.cw = 0; this.ch = 0; this.dpr = 1;
    this.tw = 0; this.th = 0;            // a kívánt háttértár-méret (parkolt vásznon is számoljuk)
    this.parked = true;                  // amíg a képsor hideg, nincs teljes méretű háttértár
    try { canvas.width = 1; canvas.height = 1; } catch (e) {}
    this.lastDrawn = -2;
    this.dirty = true;
    this.bg = [0, 0, 0];
    var el = scene.el;
    this.fitMobile = parseFloat(el.dataset.fitMobile || '0.45');
    // álló képarányú (külön renderelt) mobil készletnél erősebb kitöltés
    if (seq.fh > seq.fw) this.fitMobile = parseFloat(el.dataset.fitMobilePortrait || '0.7');
    if (seq.entry && seq.entry.fit != null) this.fitMobile = seq.entry.fit;
    this.sampled = false;
    this.fitDesktop = parseFloat(el.dataset.fitDesktop || '1');
    // opcionális: kicsinyítés (data-zoom, data-zoom-mobile) és függőleges igazítás (data-align-y 0 fent … 1 lent)
    this.zoom = parseFloat(el.dataset.zoom || '1');
    this.zoomMobile = parseFloat(el.dataset.zoomMobile || '1');
    this.alignY = parseFloat(el.dataset.alignY || '0.5');
    this.onTone = null;
    var fo = (el.dataset.focus || '0.5 0.5').split(/\s+/).map(parseFloat);
    this.fx = fo[0]; this.fy = fo[1];
    if (seq.entry && seq.entry.fx != null) this.fx = seq.entry.fx;
    if (seq.entry && seq.entry.fy != null) this.fy = seq.entry.fy;
    var self = this;
    seq.onload = function (i) {
      // csak akkor rajzolunk újra, ha a most érkezett kocka közelebb van a kívántnál
      if (self.want != null && Math.abs(i - self.want) < Math.abs(self.shownIdx - self.want)) self.dirty = true;
      if (self.shownIdx < 0) self.dirty = true;
    };
    // hideg képsor: a vászon háttértára 1×1-re zsugorodik (egyszerre csak 1–2 teljes képernyős vászon él)
    seq.onmode = function (m) { self.setParked(m === 0); };
    this.shownIdx = -1;
    this.want = null;
    if (this.broken) canvas.style.visibility = 'hidden';
  }
  Player.prototype.fit = function (cw, ch) {
    var s = this.seq, portrait = cw < ch;
    return fitRect(cw, ch, s.fw, s.fh, portrait ? this.fitMobile : this.fitDesktop, this.fx, this.fy, portrait ? this.zoomMobile : this.zoom, this.alignY);
  };
  Player.prototype.setParked = function (p) {
    if (p === this.parked || this.broken) return;
    this.parked = p;
    try {
      if (p) { this.canvas.width = 1; this.canvas.height = 1; this.cw = this.ch = 0; this.shownIdx = -1; this.lastDrawn = -2; }
      else this.measure();
    } catch (e) {}
    this.dirty = true;
  };
  Player.prototype.measure = function () {
    if (this.broken) return;
    try {
      var r = this.canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, P.dpr);
      var px = r.width * r.height * dpr * dpr;
      if (px > P.maxPx) dpr *= Math.sqrt(P.maxPx / px);   // a háttértár pixelszámra is korlátos
      this.dpr = dpr;
      this.tw = Math.max(1, Math.round(r.width * dpr)); this.th = Math.max(1, Math.round(r.height * dpr));
      if (!this.parked && (this.tw !== this.cw || this.th !== this.ch)) {
        this.cw = this.tw; this.ch = this.th;
        this.canvas.width = this.cw; this.canvas.height = this.ch;
        this.dirty = true;
      }
      if (!this.sampled) this.bg = parseRGB(getComputedStyle(this.canvas.parentNode).backgroundColor);
      // dekódolás a vászon tényleges pixelméretére (ha a kocka nagyobb a szükségesnél)
      var s = this.seq;
      if (!s.procedural) {
        var fr = this.fit(this.tw, this.th);
        var need = Math.ceil(fr.dw);
        if (HAS_CIB && need < s.fw * .92 && need > 16) {
          var rw = need, rh = Math.max(1, Math.round(need * s.fh / s.fw));
          if (!s.resize || s.resize.resizeWidth !== rw) { s.resize = { resizeWidth: rw, resizeHeight: rh, resizeQuality: P.rq }; s.costSeen = 0; }
        } else if (s.resize) { s.resize = null; s.costSeen = 0; }
      }
    } catch (e) {}
  };
  Player.prototype.render = function (t) {
    if (this.broken) return;
    try { this._render(t); } catch (e) { this.dirty = false; }
  };
  Player.prototype._render = function (t) {
    if (this.parked) this.setParked(false);
    var s = this.seq, n = s.count;
    var idx = Math.round(clamp(t, 0, 1) * (n - 1));
    if (s.procedural) {
      if (idx === this.lastDrawn && !this.dirty) return;
      var r = this.fit(this.cw, this.ch);
      window.PhaneraPlaceholder.draw(this.ctx, s.name, idx / (n - 1), idx, n, r, this.cw, this.ch, this.dpr);
      this.lastDrawn = idx; this.shownIdx = idx; this.dirty = false;
      return;
    }
    idx = s.canon(idx);
    if (idx !== s.cur) { var big = Math.abs(idx - s.cur) >= Math.max(2, s.sub * 2); s.cur = idx; if (big) Loader.pump(); }
    this.want = idx;
    var j = s.nearest(idx);
    if (j < 0) { // még semmi nincs betöltve: üres háttér
      if (this.dirty) { this.ctx.fillStyle = 'rgb(' + this.bg.join(',') + ')'; this.ctx.fillRect(0, 0, this.cw, this.ch); this.dirty = false; }
      return;
    }
    if (j === this.shownIdx && !this.dirty) return;
    var img = s.frames[j];
    if (!img || !(img.width || img.naturalWidth)) { Loader.evict(s, j); this.dirty = true; return; }   // lezárt / üres kocka
    var rr = this.fit(this.cw, this.ch);
    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (rr.dx > 0 || rr.dy > 0) { ctx.fillStyle = 'rgb(' + this.bg.join(',') + ')'; ctx.fillRect(0, 0, this.cw, this.ch); }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    try { ctx.drawImage(img, rr.dx, rr.dy, rr.dw, rr.dh); }
    catch (e) { Loader.evict(s, j); this.dirty = true; return; }   // pl. közben lezárt bitmap: a következő képkockán újra
    featherEdges(ctx, rr, this.cw, this.ch, this.bg);
    this.shownIdx = j; this.lastDrawn = idx; this.dirty = false;
    if (!this.sampled) this.sampleEdge(img);
  };
  /* a kocka szélének átlagszíne → a jelenet háttere és a szöveg-fátylak színe;
     így a renderek hátteréhez simul a vászon széle, bármilyen színű is */
  Player.prototype.sampleEdge = function (img) {
    this.sampled = true;
    try {
      var c = document.createElement('canvas'); c.width = 16; c.height = 16;
      var x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(img, 0, 0, 16, 16);
      var d = x.getImageData(0, 0, 16, 16).data, r = 0, g = 0, b = 0, a = 0, n = 0;
      for (var yy = 0; yy < 16; yy++) for (var xx = 0; xx < 16; xx++) {
        if (yy !== 0 && yy !== 15 && xx !== 0 && xx !== 15) continue;
        var o = (yy * 16 + xx) * 4; r += d[o]; g += d[o + 1]; b += d[o + 2]; a += d[o + 3]; n++;
      }
      c.width = c.height = 0;
      if (a / n < 250) { this.sampled = false; return; }   // üres/lezárt kocka: nem mintázunk belőle (különben hamis sötét tónus)
      this.bg = [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
      this.canvas.parentNode.style.setProperty('--bg', 'rgb(' + this.bg.join(',') + ')');
      this.dirty = true;
      // a jelenet tónusa a render hátteréből: sötét vagy világos (a szöveg és a nav ehhez igazodik)
      var lum = (0.2126 * this.bg[0] + 0.7152 * this.bg[1] + 0.0722 * this.bg[2]) / 255;
      if (this.onTone) this.onTone(lum < 0.5 ? 'dark' : 'light', this.bg);
    } catch (e) { /* pl. file:// – marad a CSS-háttér */ }
  };

  /* hibakereséshez / tesztekhez */
  function stats() {
    var frames = 0, perSeq = {};
    Loader.seqs.forEach(function (s) { frames += s.loaded; perSeq[s.dir] = s.loaded; });
    return { tier: TIER, budgetMB: Math.round(P.budget / MB), frames: frames, bytes: Loader.used, peakMB: Math.round(Loader.peak / MB),
             reservedMB: Math.round(Loader.reserved / MB), blobMB: +(Blobs.bytes / MB).toFixed(1), started: Loader.started,
             evicted: Loader.evicted, perSeq: perSeq, cib: HAS_CIB, fetch: FETCH_OK, crashes: CRASHES, inapp: INAPP, dm: DM };
  }

  window.PhaneraSeq = {
    MOBILE: MOBILE,
    TIER: TIER,
    MODE: TIER,
    INAPP: INAPP,
    loadManifest: loadManifest,
    Sequence: Sequence,
    Player: Player,
    Loader: Loader,
    keyOrder: keyOrder,
    stats: stats
  };
})();

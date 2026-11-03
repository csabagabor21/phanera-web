/* Phanera – vászonra rajzolt helykitöltő képsorok.
   Akkor fut, ha egy képsornak még nincs bejegyzése a seq/manifest.json-ban.
   Egy 1920×1080-as virtuális képkockába rajzol, amelyet a motor ugyanúgy illeszt
   (cover / contain / fókuszpont), mint a valódi rendereket – így a mobilos kivágás
   már most a végleges viselkedést mutatja. Nem AI-kép: csak vektoros vászonrajz. */
(function () {
  'use strict';
  var VW = 1920, VH = 1080;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(a, b, t) { t = clamp((t - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  function noise(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  var THEME = {
    hero:     { bg: '#070809', dark: true },
    exploded: { bg: '#ececea', dark: false },
    see:      { bg: '#070809', dark: true },
    treat:    { bg: '#070809', dark: true },
    family:   { bg: '#ececea', dark: false },
    finale:   { bg: '#ffffff', dark: false }
  };

  /* ---------- az eszköz oldalnézete (etalon: feszes ezüst búra + grafit gerinc) ---------- */
  function penOutline(L, H) {
    var p = new Path2D();
    p.moveTo(L * .03, -H * .5);
    p.bezierCurveTo(L * .34, -H * .57, L * .6, -H * .52, L * .8, -H * .31);
    p.bezierCurveTo(L * .92, -H * .2, L * .985, -H * .13, L * .998, -H * .035);
    p.bezierCurveTo(L * 1.004, H * .05, L * .985, H * .1, L * .955, H * .12);
    p.bezierCurveTo(L * .8, H * .22, L * .6, H * .5, L * .34, H * .52);
    p.lineTo(L * .03, H * .5);
    p.bezierCurveTo(-L * .006, H * .5, -L * .006, -H * .5, L * .03, -H * .5);
    p.closePath();
    return p;
  }
  function shellRegion(L, H) { // a búra (felső, ezüst) része – az osztóvonal fölött
    var p = new Path2D();
    p.moveTo(-L * .02, -H);
    p.lineTo(L * 1.05, -H);
    p.lineTo(L * 1.05, H * .02);
    p.bezierCurveTo(L * .8, H * .1, L * .45, H * .2, -L * .02, H * .18);
    p.closePath();
    return p;
  }

  // o: { alpha, sweep (0..1 vagy null), dark (háttér sötét-e), clipX: [x0,x1] arányban }
  function drawPen(ctx, x, y, L, rot, o) {
    o = o || {};
    var H = L * .118;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot || 0);
    if (o.flip) ctx.scale(1, -1);
    ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    var outline = penOutline(L, H);
    if (o.clipX) {
      var c = new Path2D();
      c.rect(L * o.clipX[0], -H * 2, L * (o.clipX[1] - o.clipX[0]), H * 4);
      ctx.clip(c);
    }
    // gerinc
    var g = ctx.createLinearGradient(0, -H * .5, 0, H * .55);
    g.addColorStop(0, '#55585e'); g.addColorStop(.55, '#2c2e33'); g.addColorStop(1, '#141518');
    ctx.fillStyle = g; ctx.fill(outline);
    // búra
    ctx.save();
    ctx.clip(outline);
    ctx.clip(shellRegion(L, H));
    var s = ctx.createLinearGradient(0, -H * .55, 0, H * .2);
    s.addColorStop(0, '#f1f1f0'); s.addColorStop(.16, '#dcdddf'); s.addColorStop(.48, '#aeb1b5');
    s.addColorStop(.8, '#7d8086'); s.addColorStop(1, '#5c5f65');
    ctx.fillStyle = s; ctx.fillRect(-L * .05, -H, L * 1.1, H * 2);
    // hosszanti fényvonal a gerinc mentén
    var hl = ctx.createLinearGradient(0, -H * .44, 0, -H * .3);
    hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(.5, 'rgba(255,255,255,.8)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hl; ctx.fillRect(L * .05, -H * .46, L * .78, H * .18);
    // végigfutó fénysáv (hero)
    if (o.sweep != null) {
      var sx = lerp(-.2, 1.2, o.sweep) * L;
      var sw = ctx.createLinearGradient(sx - L * .14, 0, sx + L * .14, 0);
      sw.addColorStop(0, 'rgba(255,255,255,0)'); sw.addColorStop(.5, 'rgba(255,255,255,.75)'); sw.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sw; ctx.fillRect(-L * .05, -H, L * 1.1, H * 2);
    }
    ctx.restore();
    // hátsó véglap (sötét, nemfémes töltőfelület)
    ctx.save();
    ctx.clip(outline);
    ctx.fillStyle = '#16171a';
    ctx.fillRect(-L * .01, -H, L * .045, H * 2);
    ctx.restore();
    // osztóvonal
    ctx.save();
    ctx.clip(outline);
    ctx.beginPath();
    ctx.moveTo(-L * .02, H * .18);
    ctx.bezierCurveTo(L * .45, H * .2, L * .8, H * .1, L * 1.05, H * .02);
    ctx.strokeStyle = o.dark ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,.35)';
    ctx.lineWidth = Math.max(1, L * .002);
    ctx.stroke();
    ctx.restore();
    // perem
    ctx.lineWidth = Math.max(1, L * .0015);
    ctx.strokeStyle = o.dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)';
    ctx.stroke(outline);
    ctx.restore();
  }

  function softShadow(ctx, x, y, rx, ry, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, 'rgba(20,22,26,' + a + ')');
    g.addColorStop(.55, 'rgba(20,22,26,' + a * .35 + ')');
    g.addColorStop(1, 'rgba(20,22,26,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function glow(ctx, x, y, r, color, a) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color.replace('A', a));
    g.addColorStop(1, color.replace('A', 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  /* ---------------------------------------------------------------- jelenetek */
  var scenes = {};

  scenes.hero = function (ctx, t) {
    var a = .14 + .86 * smooth(0, .45, t);
    // halvány fénykör a sötétben
    glow(ctx, 960, 600, 900, 'rgba(120,124,135,A)', .16 * a);
    var rot = lerp(-.32, -.09, easeInOut(clamp(t / .9, 0, 1)));
    var L = lerp(900, 1180, easeInOut(t));
    var x = 960 - Math.cos(rot) * L * .5, y = 660 - Math.sin(rot) * L * .5;
    softShadow(ctx, 960, 760, L * .5, 40, .5 * a);
    drawPen(ctx, x, y, L, rot, { alpha: a, sweep: smooth(.15, .85, t), dark: true });
    // hideg perem-fény az orron
    glow(ctx, x + Math.cos(rot) * L, y + Math.sin(rot) * L, 120, 'rgba(138,109,255,A)', .18 * smooth(.6, 1, t));
  };

  var SEG = [0, .045, .3, .52, .67, .82, 1.0];
  scenes.exploded = function (ctx, t) {
    var e = easeInOut(Math.sin(Math.PI * clamp(t, 0, 1)));
    var L = 1060, H = L * .118, x0 = 960 - L / 2, y0 = 640;
    softShadow(ctx, 960, y0 + 110, 640, 40, .2);
    if (e < .004) { drawPen(ctx, x0, y0, L, 0, {}); return; }
    var n = SEG.length - 1, gap = L * .062;
    // belső alkatrészek (a szétnyíló héjak között emelkednek ki)
    var comps = [
      null,
      { k: 1, draw: function (cx, cy) { // akkucella
        var w = L * .2, h = H * .5;
        var g = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
        g.addColorStop(0, '#5a5d63'); g.addColorStop(.35, '#2a2c31'); g.addColorStop(1, '#121316');
        ctx.fillStyle = g; roundRect(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill();
        ctx.fillStyle = '#c9cbce'; roundRect(ctx, cx + w / 2 - 10, cy - h / 2 + 4, 8, h - 8, 3); ctx.fill();
      } },
      { k: 2, draw: function (cx, cy) { // panel + kamera + 405 nm LED
        var w = L * .19, h = H * .14;
        ctx.fillStyle = '#1f2a26'; roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 4); ctx.fill();
        ctx.fillStyle = '#3a3d42';
        for (var i = 0; i < 5; i++) { roundRect(ctx, cx - w / 2 + 14 + i * 40, cy - h / 2 - 8, 24, 10, 2); ctx.fill(); }
        ctx.fillStyle = '#0c0d0f'; ctx.beginPath(); ctx.arc(cx + w * .36, cy - h / 2 - 12, 13, 0, 7); ctx.fill();
        ctx.fillStyle = '#2b2550'; ctx.beginPath(); ctx.arc(cx + w * .36, cy - h / 2 - 12, 7, 0, 7); ctx.fill();
        glow(ctx, cx + w * .2, cy - h / 2 - 10, 26, 'rgba(138,109,255,A)', .9);
      } },
      { k: 3, draw: function (cx, cy) { // két ventilátor
        for (var i = -1; i <= 1; i += 2) {
          ctx.save(); ctx.translate(cx + i * 40, cy); ctx.scale(.42, 1);
          ctx.fillStyle = '#26282c'; ctx.beginPath(); ctx.arc(0, 0, 44, 0, 7); ctx.fill();
          ctx.strokeStyle = '#4a4d53'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.stroke();
          ctx.restore();
        }
      } },
      { k: 4, draw: function (cx, cy) { // CeraPlas F – kerámia rúd
        var w = L * .11, h = H * .2;
        var g = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
        g.addColorStop(0, '#f6f2ea'); g.addColorStop(1, '#bdb5a6');
        ctx.fillStyle = g; roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 4); ctx.fill();
        ctx.fillStyle = '#9a8f7c'; ctx.fillRect(cx - w * .1, cy - h / 2, w * .2, h);
      } },
      null
    ];
    for (var k = 0; k < n; k++) {
      var dx = (k - (n - 1) / 2) * gap * e;
      if (comps[k]) {
        var cx = x0 + L * (SEG[k] + SEG[k + 1]) / 2 + dx;
        var lift = (k % 2 ? 1 : -1) * H * 1.05 * e;
        ctx.save(); ctx.globalAlpha = smooth(.15, .6, e);
        comps[k].draw(cx, y0 + lift);
        ctx.restore();
      }
      drawPen(ctx, x0 + dx, y0, L, 0, { clipX: [SEG[k], SEG[k + 1]] });
    }
  };

  function seeLayout() { return { px: 1000, py: 150, rot: .62, L: 720, sx: 1420, sy: 820, rx: 330, ry: 96 }; }
  var SPOTS = (function () {
    var r = rng(7), a = [];
    for (var i = 0; i < 18; i++) {
      var ang = r() * Math.PI * 2, rad = Math.sqrt(r()) * .78;
      a.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad, s: 3 + r() * 8, c: r() < .68 ? 'red' : 'cyan', th: .2 + r() * .5 });
    }
    return a;
  })();
  function surface(ctx, l, lit) {
    // sötét, enyhén meleg „szövet”-felület
    ctx.save(); ctx.translate(l.sx, l.sy); ctx.scale(1, l.ry / l.rx);
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, l.rx * 1.6);
    g.addColorStop(0, 'rgba(48,40,44,1)'); g.addColorStop(.6, 'rgba(22,20,23,.9)'); g.addColorStop(1, 'rgba(7,8,9,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, l.rx * 1.6, 0, 7); ctx.fill();
    var u = ctx.createRadialGradient(0, 0, 0, 0, 0, l.rx);
    u.addColorStop(0, 'rgba(110,70,255,' + .42 * lit + ')'); u.addColorStop(1, 'rgba(70,30,255,0)');
    ctx.fillStyle = u; ctx.beginPath(); ctx.arc(0, 0, l.rx, 0, 7); ctx.fill();
    ctx.restore();
  }
  scenes.see = function (ctx, t) {
    var l = seeLayout();
    var lit = smooth(.08, .35, t);
    var nx = l.px + Math.cos(l.rot) * l.L, ny = l.py + Math.sin(l.rot) * l.L;
    surface(ctx, l, lit);
    // fénykúp
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var cone = ctx.createLinearGradient(nx, ny, l.sx, l.sy);
    cone.addColorStop(0, 'rgba(130,100,255,' + .3 * lit + ')'); cone.addColorStop(1, 'rgba(90,45,255,' + .05 * lit + ')');
    ctx.fillStyle = cone;
    ctx.beginPath(); ctx.moveTo(nx - 6, ny - 4);
    ctx.lineTo(l.sx - l.rx * .95, l.sy); ctx.lineTo(l.sx + l.rx * .95, l.sy + 10); ctx.lineTo(nx + 8, ny + 6); ctx.closePath(); ctx.fill();
    // fluoreszkáló foltok
    for (var i = 0; i < SPOTS.length; i++) {
      var s = SPOTS[i], v = smooth(s.th, s.th + .18, t) * lit;
      if (v <= 0) continue;
      var x = l.sx + s.x * l.rx, y = l.sy + s.y * l.ry;
      glow(ctx, x, y, s.s * 3, s.c === 'red' ? 'rgba(255,70,80,A)' : 'rgba(60,230,200,A)', .55 * v);
      glow(ctx, x, y, s.s * .9, s.c === 'red' ? 'rgba(255,150,150,A)' : 'rgba(170,255,235,A)', .7 * v);
    }
    ctx.restore();
    drawPen(ctx, l.px, l.py, l.L, l.rot, { dark: true });
    glow(ctx, nx, ny, 60, 'rgba(150,120,255,A)', .7 * lit);
  };

  scenes.treat = function (ctx, t, f) {
    var px = 1000, py = 230, rot = Math.PI - .55, L = 620;
    var nx = px + Math.cos(rot) * L, ny = py + Math.sin(rot) * L;
    var I = smooth(.12, .38, t) * (1 - .25 * smooth(.88, 1, t));
    var fl = .82 + .18 * noise(f * 1.7);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var dx = Math.cos(rot), dy = Math.sin(rot);
    for (var j = 0; j < 9; j++) {
      var d = j * 26 * I, r = (16 + j * 13) * (.6 + .4 * I);
      glow(ctx, nx + dx * d, ny + dy * d, r * 2.2, 'rgba(90,50,255,A)', .16 * I * fl);
      glow(ctx, nx + dx * d, ny + dy * d, r, 'rgba(170,150,255,A)', .2 * I * fl * (1 - j / 9));
    }
    glow(ctx, nx + dx * 6, ny + dy * 6, 30, 'rgba(235,230,255,A)', .9 * I * fl);
    // sodródó részecskék
    var r = rng(3);
    for (var k = 0; k < 60; k++) {
      var ph = (r() + f * (.004 + r() * .006)) % 1;
      var spread = (r() - .5) * 2;
      var d2 = ph * 330 * I;
      var x = nx + dx * d2 - dy * spread * d2 * .45, y = ny + dy * d2 + dx * spread * d2 * .45;
      ctx.fillStyle = 'rgba(190,175,255,' + (.5 * (1 - ph) * I) + ')';
      ctx.beginPath(); ctx.arc(x, y, 1.6 + r() * 1.6, 0, 7); ctx.fill();
    }
    ctx.restore();
    drawPen(ctx, px, py, L, rot, { dark: true, flip: true });
  };

  scenes.family = function (ctx, t) {
    function item(th, fn) {
      var v = smooth(th, th + .1, t);
      if (v <= 0) return;
      ctx.save(); ctx.globalAlpha = v; ctx.translate(0, (1 - v) * 40); fn(); ctx.restore();
    }
    item(-1, function () { softShadow(ctx, 960, 430, 360, 22, .2); drawPen(ctx, 960 - 360, 365, 720, 0, {}); });
    item(.25, function () { // Dock – fém talp, rajta az eszköz
      softShadow(ctx, 470, 760, 190, 22, .25);
      var g = ctx.createLinearGradient(0, 712, 0, 756);
      g.addColorStop(0, '#f2f2f1'); g.addColorStop(.5, '#b9bbbe'); g.addColorStop(1, '#7c7f84');
      ctx.fillStyle = g; roundRect(ctx, 320, 714, 300, 42, 21); ctx.fill();
      drawPen(ctx, 340, 692, 270, -.03, {});
    });
    item(.5, function () { // Case – nagy kavics
      softShadow(ctx, 960, 768, 220, 22, .25);
      drawPen(ctx, 960 - 215, 718, 430, 0, {});
    });
    item(.75, function () { // Stand – talp, öt rúd, lebegő változatok
      softShadow(ctx, 1460, 772, 190, 20, .22);
      var g = ctx.createLinearGradient(0, 752, 0, 770);
      g.addColorStop(0, '#d5d6d7'); g.addColorStop(1, '#8a8d91');
      ctx.fillStyle = g; roundRect(ctx, 1290, 752, 340, 16, 8); ctx.fill();
      for (var i = 0; i < 5; i++) {
        var x = 1322 + i * 68, h = 90 + i * 22;
        ctx.fillStyle = '#9fa2a6'; ctx.fillRect(x - 2, 752 - h, 4, h);
        drawPen(ctx, x - 56, 752 - h - 18, 112, 0, { alpha: .55 + i * .11 });
      }
    });
  };

  /* királylepke (monarch v2 színei: narancs, fekete erezet és szegély, fehér pöttyök) – nyitott és csukott szárny */
  function wingPath() { // egy oldal, a test a (0,0)-ban, a szárny +x felé
    var p = new Path2D();
    p.moveTo(0, -4);
    p.bezierCurveTo(10, -30, 40, -52, 62, -50);   // elülső szárny él
    p.bezierCurveTo(68, -48, 70, -42, 66, -36);   // lekerekített csúcs
    p.bezierCurveTo(70, -22, 64, -8, 54, 2);
    p.bezierCurveTo(62, 12, 58, 30, 44, 42);      // hátsó szárny
    p.bezierCurveTo(30, 48, 10, 30, 0, 6);
    p.closePath();
    return p;
  }
  var WING = null, INK = '#1d1714';
  function paintWing(ctx, fill) {
    ctx.save();
    ctx.fillStyle = fill; ctx.fill(WING);
    ctx.clip(WING);
    ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.beginPath();   // erezet
    ctx.moveTo(2, -6); ctx.quadraticCurveTo(30, -36, 60, -44);
    ctx.moveTo(4, -2); ctx.quadraticCurveTo(34, -20, 62, -24);
    ctx.moveTo(4, 0); ctx.quadraticCurveTo(32, -4, 54, 2);
    ctx.moveTo(3, 4); ctx.quadraticCurveTo(30, 14, 52, 22);
    ctx.moveTo(2, 6); ctx.quadraticCurveTo(22, 26, 40, 40);
    ctx.stroke();
    ctx.lineWidth = 9; ctx.stroke(WING);                             // fekete szegély
    ctx.fillStyle = '#f4efe6';                                       // fehér pöttyök a szegélyben
    [[56, -46], [63, -37], [66, -26], [63, -14], [57, -4], [59, 12], [55, 24], [47, 36], [38, 42]].forEach(function (d) {
      ctx.beginPath(); ctx.arc(d[0], d[1], 1.5, 0, 7); ctx.fill();
    });
    ctx.restore();
  }
  function drawButterfly(ctx, x, y, size, open, heading, landed) {
    if (!WING) WING = wingPath();
    var sc = size / 60;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(heading);
    ctx.scale(sc, sc);
    var fill = ctx.createLinearGradient(0, -50, 0, 46);
    fill.addColorStop(0, '#f08a24'); fill.addColorStop(1, '#d9661a');
    if (landed) {
      // csukott szárny oldalnézetben: függőlegesen a test fölött
      ctx.save(); ctx.rotate(-Math.PI / 2 + .12); ctx.scale(1, .96);
      paintWing(ctx, fill);
      ctx.restore();
      ctx.fillStyle = INK; roundRect(ctx, -10, -3, 22, 6, 3); ctx.fill();
    } else {
      var sx = .14 + .86 * open;
      for (var side = -1; side <= 1; side += 2) {
        ctx.save(); ctx.scale(side * sx, 1);
        paintWing(ctx, fill);
        ctx.restore();
      }
      ctx.fillStyle = INK; roundRect(ctx, -3, -26, 6, 56, 3); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-1, -26); ctx.quadraticCurveTo(-8, -40, -12, -46); ctx.moveTo(1, -26); ctx.quadraticCurveTo(8, -40, 12, -46); ctx.stroke();
    }
    ctx.restore();
  }
  function bez(p0, p1, p2, p3, u) {
    var m = 1 - u;
    return [m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0],
            m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]];
  }
  scenes.finale = function (ctx, t, f) {
    var L = 820, rot = -.035, px = 960 - L * .5, py = 790;
    softShadow(ctx, 960, py + 64, L * .55, 34, .22);
    drawPen(ctx, px, py, L, rot, {});
    var land = .8;
    // a leszállási pont a búra tetején, kb. az eszköz 58%-ánál
    var lx = px + L * .58, ly = py - L * .118 * .52 + Math.sin(rot) * L * .58 - 6;
    var P0 = [-140, 300], P1 = [520, 40], P2 = [1500, 260], P3 = [lx, ly];
    var u = clamp(t / land, 0, 1), e = 1 - Math.pow(1 - u, 2.2);
    var p = bez(P0, P1, P2, P3, e);
    var wob = (1 - e) * 26;
    var bx = p[0], by = p[1] + Math.sin(u * 22) * wob;
    var q = bez(P0, P1, P2, P3, Math.min(1, e + .01));
    var heading = Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2;
    if (t < land) {
      // árnyék a fehér asztalon – közeledve élesedik
      var near = smooth(.5, 1, u);
      softShadow(ctx, bx, py + 70, 40 - 18 * near, 7, .05 + .12 * near);
      var flap = Math.abs(Math.cos(f * (.95 - .5 * near)));
      drawButterfly(ctx, bx, by, 46, lerp(flap, .55, near * near), lerp(heading, .1, near), false);
    } else {
      var k = smooth(land, land + .05, t);
      softShadow(ctx, lx, py + 58, 18, 5, .16);
      if (k < 1) drawButterfly(ctx, lx, ly, 46, (1 - k) * .55, .1, false);
      else drawButterfly(ctx, lx, ly + 2, 54, 0, 0, true);
    }
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /* ------------------------------------------------------------- belépési pont
     ctx: a vászon kontextusa (identitás-transzformációval)
     rect: a virtuális 1920×1080-as kocka helye a vásznon {dx,dy,dw,dh}
     t: 0..1 a képsorban, f: képkocka-index, n: képkockák száma */
  function draw(ctx, name, t, f, n, rect, cw, ch, dpr) {
    var th = THEME[name] || THEME.hero;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, cw, ch);
    ctx.setTransform(rect.dw / VW, 0, 0, rect.dh / VH, rect.dx, rect.dy);
    var fn = scenes[name];
    if (fn) fn(ctx, t, f);
    // címke: képernyő-koordinátában, hogy mindig olvasható legyen
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '600 10px "Instrument Sans", Helvetica, sans-serif';
    ctx.fillStyle = th.dark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.3)';
    var label = 'HELYKITÖLTŐ · ' + name + ' · f_' + String(f + 1).padStart(4, '0') + ' / ' + String(n).padStart(4, '0');
    ctx.fillText(label, 16, ch / dpr - 18);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  window.PhaneraPlaceholder = { draw: draw, VW: VW, VH: VH, theme: THEME };
})();

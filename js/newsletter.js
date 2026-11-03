/* Phanera – hírlevél-feliratkozás (#hirlevel)
   - A Firebase (app + Firestore Lite, saját tárhelyen: js/vendor/firestore-lite.js) csak akkor töltődik be,
     ha a szakasz a képernyő közelébe ér, vagy az űrlap fókuszt kap. Addig semmilyen külső kapcsolat nincs.
   - Csak írás: addDoc a `newsletter_signups` gyűjteménybe. Olvasás nincs (a szabályok is tiltják).
   - A beleegyező mondat szövege SZÓ SZERINT egyezik a firebase/firestore.rules CONSENT szövegével és a HTML-lel.
     Ha változik, mindhármat egyszerre kell átírni, és a szabályokat újra kell deployolni.
   - Korhatár: külön, alapból üres „Elmúltam 16 éves.” nyilatkozat (#signup-age) nélkül nincs küldés,
     és a szabályok is csak ageConfirmed == true értékkel engednek írást (közvetlen API-írás sem kerülheti meg).
     Születési dátumot nem kérünk és nem tárolunk. Az AGE mondat ugyanilyen hármas egyeztetést igényel. */
(function () {
  'use strict';

  var form = document.getElementById('signup-form');
  if (!form) return;

  var VENDOR = '/js/vendor/firestore-lite.js?v=12.19.0b';
  var CONFIG = {
    apiKey: 'AIzaSyDQIltakM31aM8uS1yCcV8aDAsSMKwnKVs',      // böngészőkulcs: hivatkozó + API szerint korlátozva
    authDomain: 'phanera-web.firebaseapp.com',
    projectId: 'phanera-web',
    appId: '1:228935792603:web:79f3c39089b889cfb759fe'
  };
  var CONSENT = {
    hu: 'Hozzájárulok, hogy a Phanera hírlevelet küldjön a fejlesztésről. Bármikor leiratkozhatok.',
    en: 'I agree to receive Phanera development updates by email. Unsubscribe anytime.'
  };
  var AGE = {
    hu: 'Elmúltam 16 éves.',
    en: 'I am 16 or older.'
  };
  // ugyanaz, mint a szabályokban (kisbetűs, legfeljebb 254 karakter)
  var EMAIL_RE = /^[a-z0-9._%+-]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,24}$/;

  var section = document.getElementById('hirlevel');
  var email = form.querySelector('#signup-email');
  var consent = form.querySelector('#signup-consent');
  var age = form.querySelector('#signup-age');
  var trap = form.querySelector('#signup-website');
  var button = form.querySelector('.signup__submit');
  var status = form.querySelector('.signup__status');

  var MSG = {
    sending: ['Küldés…', 'Sending…'],
    ok: ['Köszönjük, feliratkoztál. Bármikor leiratkozhatsz.', 'Thank you, you’re signed up. You can unsubscribe anytime.'],
    email: ['Adj meg egy érvényes e-mail-címet.', 'Please enter a valid email address.'],
    consent: ['A feliratkozáshoz pipáld be a hozzájárulást.', 'Please tick the consent box to sign up.'],
    age: ['A feliratkozáshoz nyilatkoznod kell, hogy elmúltál 16 éves.', 'Please confirm that you are 16 or older to sign up.'],
    fail: ['Most nem sikerült elküldeni. Próbáld újra egy kicsit később.', 'That didn’t go through. Please try again in a moment.']
  };

  function say(key, state) {
    var m = MSG[key];
    status.innerHTML = '';
    ['hu', 'en'].forEach(function (l, i) {
      var s = document.createElement('span');
      s.setAttribute('data-l', l);
      s.textContent = m[i];
      status.appendChild(s);
    });
    form.setAttribute('data-state', state || '');
  }
  function clearStatus() { status.textContent = ''; form.removeAttribute('data-state'); }

  // ---- lusta betöltés -----------------------------------------------------
  var sdk = null;
  function loadSdk() {
    if (!sdk) {
      var url = new URL(VENDOR, document.baseURI).href;
      sdk = import(url).then(function (m) {
        var app = m.initApp(CONFIG, 'phanera-newsletter');
        return { m: m, db: m.getFirestore(app) };
      });
      sdk.catch(function () { sdk = null; });   // hálózati hiba után a következő próbálkozás újra tölt
    }
    return sdk;
  }
  if ('IntersectionObserver' in window && section) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); loadSdk().catch(function () {}); }
    }, { rootMargin: '600px 0px 600px 0px' });
    io.observe(section);
  }
  form.addEventListener('focusin', function () { loadSdk().catch(function () {}); }, { once: true });

  // ---- ellenőrzés ---------------------------------------------------------
  email.addEventListener('input', function () {
    if (email.getAttribute('aria-invalid') === 'true') { email.removeAttribute('aria-invalid'); clearStatus(); }
  });
  consent.addEventListener('change', function () {
    if (consent.checked && consent.getAttribute('aria-invalid') === 'true') { consent.removeAttribute('aria-invalid'); clearStatus(); }
  });
  age.addEventListener('change', function () {
    if (age.checked && age.getAttribute('aria-invalid') === 'true') { age.removeAttribute('aria-invalid'); clearStatus(); }
  });

  function withTimeout(p, ms) {
    return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); })]);
  }

  var busy = false;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (busy) return;

    var lang = document.documentElement.dataset.lang === 'en' ? 'en' : 'hu';
    var value = (email.value || '').trim().toLowerCase();

    if (!EMAIL_RE.test(value) || value.length > 254) {
      email.setAttribute('aria-invalid', 'true');
      say('email', 'error'); email.focus(); return;
    }
    if (!consent.checked) {
      consent.setAttribute('aria-invalid', 'true');
      say('consent', 'error'); consent.focus(); return;
    }
    if (!age.checked) {
      age.setAttribute('aria-invalid', 'true');
      say('age', 'error'); age.focus(); return;
    }
    // csapda: ember nem látja és nem éri el; ha ki van töltve, úgy teszünk, mintha sikerült volna
    if (trap && trap.value) { form.reset(); say('ok', 'ok'); return; }

    busy = true;
    button.setAttribute('aria-disabled', 'true');   // nem disabled: a fókusz a gombon marad
    form.setAttribute('aria-busy', 'true');
    say('sending', 'sending');

    withTimeout(loadSdk().then(function (f) {
      return f.m.addDoc(f.m.collection(f.db, 'newsletter_signups'), {
        email: value,
        lang: lang,
        consent: true,
        consentText: CONSENT[lang],
        ageConfirmed: true,
        ageText: AGE[lang],
        createdAt: f.m.serverTimestamp(),
        source: 'phanera-site'
      });
    }), 15000).then(function () {
      form.reset();
      say('ok', 'ok');
    }, function () {
      say('fail', 'error');
    }).then(function () {
      busy = false;
      button.removeAttribute('aria-disabled');
      form.removeAttribute('aria-busy');
    });
  });
})();

/* QuantEdge static demo (v0.13.5): loaded only by the GitHub Pages build (make_demo_site.py), never by the installed app.
   It answers the app's API calls from the JSON files in demo/, which the app's own Python code computed offline for a
   fictional stock (DEMO) whose option prices come from a known Heston model. Nothing here downloads market data; pages
   that need the installed app say so. */
(function () {
  'use strict';
  var DIR = 'demo/';
  var LANGS = ['tr', 'en', 'es'];
  var meta = null;
  var NEEDS_APP = {
    tr: 'Bu bölüm kurulu uygulamada çalışır (SEC, TCMB ve canlı veriler bilgisayarında indirilir). Demo yalnızca Opsiyonlar sekmesini kurgusal verilerle gösterir.',
    en: 'This part runs in the installed app (SEC, central bank and live data are downloaded on your computer). The demo shows only the Options tab, with fictional data.',
    es: 'Esta parte funciona en la aplicación instalada (los datos de la SEC, del banco central y en vivo se descargan en tu ordenador). La demo muestra solo la pestaña Opciones, con datos ficticios.'
  };
  // the full showcase (make_demo_site.py --real): the Analysis Lab and the company pages answer from real data stored once
  var FULL = !!window.QE_DEMO_FULL;
  var NEEDS_APP_FULL = {
    tr: 'Bu çevrimiçi vitrinde kaydetme, yayınlama ve dışa aktarma kapalı; bunlar kurulu uygulamada çalışır.',
    en: 'Saving, publishing and exporting are off in this online showcase; they work in the installed app.',
    es: 'En esta vitrina en línea guardar, publicar y exportar están desactivados; funcionan en la aplicación instalada.'
  };
  var LAB_MISSING = {
    tr: 'Bu çevrimiçi vitrinde bu analiz yalnızca şu şirketler için, varsayılan ayarlarla ve geçmiş tarih seçmeden hesaplandı: {sets}. Kurulu uygulama her şirketi canlı hesaplar.',
    en: 'In this online showcase this analysis is stored only for these companies, with the default settings and no point-in-time date: {sets}. The installed app runs any company live.',
    es: 'En esta vitrina en línea este análisis solo está guardado para estas empresas, con los ajustes predeterminados y sin fecha histórica: {sets}. La aplicación instalada calcula cualquier empresa en vivo.'
  };
  var COMPANY_MISSING = {
    tr: 'Bu çevrimiçi vitrinde şirket verisi yalnızca şunlar için var: {list}. Kurulu uygulama her ABD şirketini SEC’den indirir.',
    en: 'In this online showcase company data is stored only for: {list}. The installed app downloads any US company from the SEC.',
    es: 'En esta vitrina en línea solo hay datos de empresa para: {list}. La aplicación instalada descarga cualquier empresa de EE. UU. de la SEC.'
  };
  window.QE_DEMO = { symbol: 'DEMO', full: FULL };

  function lang(q) {
    var l = (q && q.get('language')) || (window.QE_LANG || 'en');
    return LANGS.indexOf(l) >= 0 ? l : 'en';
  }
  function json(obj, status) {
    return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
  }
  function file(name) {
    return realFetch(DIR + name).then(function (r) {
      if (!r.ok) throw new Error('demo file missing: ' + name);
      return r.json();
    });
  }
  function getMeta() {
    return meta ? Promise.resolve(meta) : file('meta.json').then(function (m) { meta = m; return m; });
  }
  function expiryFor(m, want) {
    return want && m.expiries.indexOf(want) >= 0 ? want : m.default_expiry;
  }
  function kindOf(k) { return k === 'put' ? 'put' : 'call'; }
  function needsApp(q) { return (FULL ? NEEDS_APP_FULL : NEEDS_APP)[lang(q)]; }
  // a Lab run is stored only with the catalog's default settings and no point-in-time date
  function defaultSettings(cat, aid, params, asof) {
    if (asof) return false;
    var spec = (cat.analyses || []).find(function (a) { return a.id === aid; }), defs = (spec && spec.params) || {};
    return Object.keys(params || {}).every(function (k) {
      var v = params[k], d = defs[k];
      var blank = function (x) { return x === null || x === undefined || x === ''; };
      return blank(v) ? blank(d) : !blank(d) && Number(v) === Number(d) || String(v) === String(d);
    });
  }
  function labRun(body) {
    var aid = String(body.analysis || ''), l = LANGS.indexOf(body.language) >= 0 ? body.language : 'en';
    var tickers = (body.tickers || []).map(function (t) { return String(t).trim().toUpperCase(); }).filter(Boolean);
    return Promise.all([getMeta(), file('catalog.json')]).then(function (x) {
      var m = x[0], sets = (m.lab || {})[aid] || [];
      var hit = sets.some(function (s) { return s.join(',') === tickers.join(','); }) && defaultSettings(x[1], aid, body.params, body.asof);
      if (hit) return file('lab/' + aid + '__' + tickers.join('_') + '__' + l + '.json').then(json);
      var list = sets.map(function (s) { return s.join(', '); }).join(' · ') || '—';
      return json({ detail: LAB_MISSING[l].replace('{sets}', list) }, 404);
    });
  }

  /* LinkedIn drafts: the composer ran once on real SEC data with slots (make_demo_site.py THESIS_SLOT ...);
     the reader's own thesis, counterargument and name go into those slots here, cleaned as social_research._clean does. */
  var SLOT = { thesis: '[[qe-slot:thesis — your own reading goes here]]', risks: '[[qe-slot:risks — counterargument]]', author: '[[qe-slot:author]]' };
  var LINKEDIN_LIMIT = 3000;
  function chars(s) { return Array.from(String(s)); }
  function clean(s, max) {
    s = String(s || '').replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]+/g, ' ').replace(/\s+/g, ' ').trim();
    return chars(s).slice(0, max).join('');
  }
  var claims = null;
  function claimRules() {
    return claims ? Promise.resolve(claims) : file('claims.json').then(function (c) {
      claims = { advice: c.advice, rules: c.patterns.map(function (p) { return [p[0], new RegExp(p[1], 'giu')]; }) };
      return claims;
    });
  }
  // claim_check.check_claims: every language's patterns, advice in the post's language, reading order
  function checkClaims(texts, l) {
    return claimRules().then(function (c) {
      var text = chars(texts.map(function (t) { return String(t || ''); }).join('\n')).slice(0, 5000).join('');
      var found = [], seen = {}, adv = c.advice[l] || c.advice.en;
      c.rules.forEach(function (r) {
        r[1].lastIndex = 0;
        var m;
        while ((m = r[1].exec(text))) {
          if (m[0] === '') { r[1].lastIndex++; continue; }
          var start = chars(text.slice(0, m.index)).length, phrase = m[0].trim(), key = phrase.toLowerCase() + '@' + start;
          if (seen[key]) continue;
          seen[key] = 1;
          found.push({ phrase: phrase, category: r[0], start: start, suggestion: adv[r[0]] });
        }
      });
      return found.sort(function (a, b) { return a.start - b.start; });
    });
  }
  function fail(msg) { return json({ detail: 'Cannot prepare sourced LinkedIn draft: ' + msg }, 422); }
  function linkedin(body) {
    var l = LANGS.indexOf(body.language) >= 0 ? body.language : 'en', style = String(body.style || 'snapshot');
    var t = String(body.ticker || '').trim().toUpperCase(), peer = String(body.peer || '').trim().toUpperCase();
    var thesis = clean(body.thesis, 900), risks = clean(body.risks, 700), author = clean(body.author, 80);
    if (['snapshot', 'short', 'deep', 'compare'].indexOf(style) < 0) return Promise.resolve(fail('Unsupported language or post length.'));
    return getMeta().then(function (m) {
      var have = (m.companies || []).map(function (c) { return c.ticker; });
      if (have.indexOf(t) < 0 || (style === 'compare' && peer && have.indexOf(peer) < 0))
        return json({ detail: COMPANY_MISSING[l].replace('{list}', have.join(', ')) }, 404);
      if (style === 'short' || style === 'deep') {
        if (chars(thesis).length < 25) return fail('Write your own thesis first (at least 25 characters).');
        if (chars(risks).length < 15) return fail('Add a genuine counterargument or risk (at least 15 characters).');
      }
      if (style === 'compare' && !peer) return fail('Choose a competitor to compare with.');
      if (style === 'compare' && peer === t) return fail('Choose two different companies.');
      var name = 'post/' + t + '__' + (style === 'compare' ? 'compare_' + peer : style) + '__' + l + '.json';
      return Promise.all([file(name), checkClaims([body.thesis, body.risks], l)]).then(function (x) {
        var d = x[0], lines = d.text.split('\n');
        function drop(slot) {  // a block is ['', label, slot]
          var i = lines.indexOf(slot);
          if (i >= 0) lines.splice(Math.max(0, i - 2), i - Math.max(0, i - 2) + 1);
        }
        if (style === 'compare') {  // the comparison keeps the thesis only from 25 characters, the risk only with a thesis
          if (chars(risks).length < 15 || chars(thesis).length < 25) drop(SLOT.risks);
          if (chars(thesis).length < 25) drop(SLOT.thesis);
        }
        if (!author) lines = lines.filter(function (ln) { return ln.indexOf(SLOT.author) < 0; });
        var text = lines.join('\n').split(SLOT.thesis).join(thesis).split(SLOT.risks).join(risks).split(SLOT.author).join(author);
        var n = chars(text).length, warnings = d.warnings.slice();
        if (n > LINKEDIN_LIMIT) warnings.push('Post is ' + n + ' characters; LinkedIn accepts up to ' + LINKEDIN_LIMIT + '. Shorten your thesis or counterargument.');
        return json({ text: text, ticker: d.ticker, fiscal_end: d.fiscal_end, claim_flags: x[1], language: d.language, style: d.style,
          word_count: text.split(/\s+/).filter(Boolean).length, char_count: n, warnings: warnings,
          status: 'DRAFT — VERIFY SOURCES BEFORE LINKEDIN', paid_api_calls: 0 });
      });
    });
  }

  /* /api/v2/<path>?<query>  ->  a Response, or null when the call is not an API call */
  function route(url, init) {
    var u;
    try { u = new URL(url, window.location.href); } catch (e) { return null; }
    var at = u.pathname.indexOf('/api/v2/');
    if (at < 0) return null;
    var path = u.pathname.slice(at + 7), q = u.searchParams, method = ((init && init.method) || 'GET').toUpperCase();
    var body = {};
    try { body = init && init.body ? JSON.parse(init.body) : {}; } catch (e) { body = {}; }
    if (path === '/lab/options/desk') return getMeta().then(function (m) { return file('desk_' + expiryFor(m, q.get('expiry')) + '_' + kindOf(q.get('kind')) + '_' + lang(q) + '.json'); }).then(json);
    if (path === '/lab/options/quote') return getMeta().then(function (m) { return file('desk_' + m.default_expiry + '_call_en.json'); }).then(function (d) {
      return json(Object.assign({ symbol: d.symbol }, d.quote));
    });
    if (path === '/lab/options/heston' && method === 'POST') return getMeta().then(function (m) { return file('heston_' + expiryFor(m, body.expiry) + '_' + kindOf(body.kind) + '.json'); }).then(json);
    if (path === '/lab/options/vix') return file('vix_' + lang(q) + '.json').then(json);
    if (path === '/lab/catalog') return file('catalog.json').then(json);
    if (path === '/config') return getMeta().then(function (m) { return json({ version: m.version, demo: true }); });
    if (path === '/config/evds' && method === 'GET') return Promise.resolve(json({ stored: false }));
    if (path === '/lab/run' && method === 'POST' && FULL) return labRun(body);
    if (path === '/company' && method === 'POST' && FULL) return getMeta().then(function (m) {
      var t = String(body.ticker || '').trim().toUpperCase(), have = (m.companies || []).map(function (c) { return c.ticker; });
      return have.indexOf(t) >= 0 ? file('company/' + t + '.json').then(json)
        : json({ detail: COMPANY_MISSING[lang(q)].replace('{list}', have.join(', ')) }, 404);
    });
    if (path === '/research/linkedin' && method === 'POST' && FULL) return linkedin(body);
    if (path === '/research/claim-check' && method === 'POST' && FULL) return checkClaims([body.text], LANGS.indexOf(body.language) >= 0 ? body.language : 'en').then(function (f) { return json({ flags: f }); });
    if (path === '/companies' && method === 'GET') return getMeta().then(function (m) {
      var s = String(q.get('q') || '').trim().toUpperCase();
      var hits = (m.companies || []).filter(function (c) { return !s || c.ticker.indexOf(s) === 0 || String(c.name).toUpperCase().indexOf(s) >= 0; });
      return json({ results: hits, downloaded: false, count: hits.length });
    });
    if (path === '/companies/directory') return Promise.resolve(json({ detail: needsApp(q) }, 503));
    if ((path === '/library' || path === '/lab/publications' || path === '/lab/reports') && method === 'GET') return Promise.resolve(json({ items: [] }));
    if ((path === '/lab/track-record' || path === '/lab/site/settings') && method === 'GET') return Promise.resolve(json({}));
    return Promise.resolve(json({ detail: needsApp(q) }, 503));
  }

  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var res = route(url, init);
    return res ? res.catch(function (e) { return json({ detail: String(e && e.message || e) }, 503); }) : realFetch(input, init);
  };

  // links and downloads that would go to the server (site preview, ZIP, PDF): nothing to open in the demo, say so
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a || a.getAttribute('href').indexOf('/api/v2/') < 0) return;
    ev.preventDefault();
    window.alert((FULL ? NEEDS_APP_FULL : NEEDS_APP)[LANGS.indexOf(window.QE_LANG) >= 0 ? window.QE_LANG : 'en']);
  }, true);

  // the Options-only demo opens on the Options tab unless a page is named in the address (#options, #about, ...)
  if (!window.location.hash && !FULL) {
    try { window.history.replaceState(null, '', '#options'); } catch (e) { window.location.hash = 'options'; }
  }

  // a thin banner: what this is, the model behind the prices, and where the code lives
  var TEXT = {
    tr: ['Demo', 'Kurgusal veri: DEMO hissesi gerçek değil; opsiyon fiyatları bilinen bir Heston modelinden üretildi (v0 0,05 · κ 1,8 · θ 0,06 · ξ 0,7 · ρ −0,65). “Heston stokastik oynaklık modelini uydur” düğmesi bu sayıları geri bulmaya çalışır. Uygulamanın tamamı bilgisayarda gerçek SEC ve piyasa verileriyle çalışır.', 'Kod'],
    en: ['Demo', 'Fictional data: the DEMO stock is not real; its option prices come from a known Heston model (v0 0.05 · κ 1.8 · θ 0.06 · ξ 0.7 · ρ −0.65). The “Fit the Heston stochastic-volatility model” button tries to find these numbers again. The full app runs on a computer with real SEC and market data.', 'Code'],
    es: ['Demo', 'Datos ficticios: la acción DEMO no es real; sus precios de opciones salen de un modelo de Heston conocido (v0 0,05 · κ 1,8 · θ 0,06 · ξ 0,7 · ρ −0,65). El botón «Ajustar el modelo de volatilidad estocástica de Heston» intenta recuperar estos números. La aplicación completa funciona en un ordenador con datos reales de la SEC y del mercado.', 'Código']
  };
  // a link to the code only when the build names one (make_demo_site.py --code-url): the code may well be private
  function repoLink() {
    var u = meta && meta.code_url;
    return typeof u === 'string' && /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(u) ? u : null;
  }
  var TEXT_FULL = {
    tr: ['Çevrimiçi vitrin', 'Analiz Laboratuvarı gerçek SEC ve piyasa verileriyle {date} tarihinde bir kez hesaplandı (seçili şirketler için). Opsiyonlar sekmesi kurgusal bir hisseyle (bilinen bir Heston modeli) çalışır. Kaydetme ve yayınlama kurulu uygulamada. Yatırım tavsiyesi değildir.', 'Kod'],
    en: ['Online showcase', 'The Analysis Lab was computed once on real SEC and market data on {date} (for selected companies). The Options tab runs on a fictional stock (a known Heston model). Saving and publishing work in the installed app. Not investment advice.', 'Code'],
    es: ['Vitrina en línea', 'El Laboratorio de análisis se calculó una vez con datos reales de la SEC y del mercado el {date} (para empresas seleccionadas). La pestaña Opciones usa una acción ficticia (un modelo de Heston conocido). Guardar y publicar funcionan en la aplicación instalada. No es asesoramiento de inversión.', 'Código']
  };
  function banner() {
    if (document.getElementById('qe-demo-banner')) return;
    var l = LANGS.indexOf(window.QE_LANG) >= 0 ? window.QE_LANG : 'en', t = (FULL ? TEXT_FULL : TEXT)[l].slice();
    t[1] = t[1].replace('{date}', (meta && meta.snapshot_date) || '—');
    var bar = document.createElement('div');
    bar.id = 'qe-demo-banner';
    bar.setAttribute('role', 'note');
    bar.className = 'qe-demo-banner';
    var b = document.createElement('strong'); b.textContent = t[0];
    var s = document.createElement('span'); s.textContent = t[1];
    bar.appendChild(b); bar.appendChild(s);
    var link = repoLink();
    if (link) { var a = document.createElement('a'); a.href = link; a.rel = 'noopener'; a.textContent = t[2]; bar.appendChild(a); }
    document.body.insertBefore(bar, document.body.firstChild);
  }
  var lastLang = null, lastLink = null;
  function refresh() {
    var key = repoLink() + '|' + (meta && meta.snapshot_date);
    if ((window.QE_LANG && window.QE_LANG !== lastLang) || key !== lastLink) {
      lastLang = window.QE_LANG; lastLink = key;
      var old = document.getElementById('qe-demo-banner');
      if (old) old.parentNode.removeChild(old);
    }
    banner();
  }
  document.addEventListener('DOMContentLoaded', function () { getMeta().catch(function () {}); refresh(); setInterval(refresh, 1000); });
})();

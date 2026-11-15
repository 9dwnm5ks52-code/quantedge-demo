/* QuantEdge v0.13.5 — offline help assistant.
 *
 * QEHelpBot(props) is a HookShell component: props.page (current page id), props.setPage(pageId),
 * props.lang ('tr' | 'en' | 'es'). It answers from QE_HELP_KB (help_kb.js) and the "What does this
 * mean?" terms in QE_GLOSSARY (glossary.js). No network, no API key, nothing leaves the computer:
 * matching is deterministic keyword scoring (Turkish-aware folding, prefix and small-typo matches).
 * Answers are plain text with a tiny markdown subset turned into React elements; user text is
 * only ever rendered as a text node.
 */

var QE_HELP_LANGS = { tr: 0, en: 1, es: 2 };
var QE_HELP_PAGES = ['Home', 'Analysis Lab', 'Options', 'Public Site', 'LinkedIn', 'Reports', 'Library', 'Guide', 'About'];

/* Lowercase with Turkish rules, then fold ı/i/ş/ğ/ü/ö/ç and accents to ASCII; punctuation becomes space. */
function qeHelpFold(text) {
  var s = String(text == null ? '' : text);
  s = s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
  s = s.replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  s = s.replace(/ñ/g, 'n');
  s = s.replace(/\b([a-z])\s*\/\s*([a-z])\b/g, '$1$2');  // F/K -> fk, P/E -> pe
  s = s.replace(/(\d)-(?=[a-z])/g, '$1');            // 10-K -> 10k, 20-F -> 20f
  s = s.replace(/['’‘`](?=[a-z])[a-z]*/g, '');        // Turkish suffix after an apostrophe: apple'ı -> apple
  s = s.replace(/[^a-z0-9]+/g, ' ');
  s = s.replace(/\b([a-z]) ([a-z])\b/g, '$1$2');      // 'f k' -> fk, 'p e' -> pe
  return s.trim().replace(/\s+/g, ' ');
}

var QE_HELP_STOP = (function () {
  var words = (
    // Turkish (folded)
    've ile veya bir bu su o mi mu ne nedir neler nelerdir nasil icin gibi ben benim bana beni sen senin siz ' +
    'de da ki ya ama cok en daha hangi hangisi var yok mu misin musun miyim muyum acaba lutfen sey bi biraz ' +
    'her tum kadar sadece ise olan olarak oluyor olur olmak yapilir yaparim yapabilirim yapmaliyim yapiyor yap ' +
    'ederim edilir edebilirim eder etmek neden niye nerede nereden ise yarar yariyor demek ne demek lazim gerek ' +
    'gerekir istiyorum istiyor sey simdi hala zaten bunu buna bunun suna sunu onu ona onun icinde kullanilir ' +
    'kanka abi abla hocam reis yaa lan ' +
    // English
    'the a an is are was be to of in on for how what why do does did i my me you your can could it its this that ' +
    'and or with should would will where which when there any please tell explain mean means use using get ' +
    // Spanish (folded)
    'el la los las un una unos unas de del que como es son en y o por para mi me se lo al cual cuales donde ' +
    'puedo hago hacer sirve significa esto este esta eso tu te'
  ).split(' ');
  var set = {};
  words.forEach(function (w) { if (w) set[w] = true; });
  return set;
})();

function qeHelpTokens(text, keepStop) {
  return qeHelpFold(text).split(' ').filter(function (t) {
    return t.length >= 2 && (keepStop || !QE_HELP_STOP[t]);
  });
}

function qeHelpLev(a, b, cap) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  var prev = [], cur, i, j;
  for (j = 0; j <= b.length; j++) prev[j] = j;
  for (i = 1; i <= a.length; i++) {
    cur = [i];
    var rowMin = i;
    for (j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > cap) return cap + 1;
    prev = cur;
  }
  return prev[b.length];
}

/* Similarity of a question token and an index token: exact 1, prefix (Turkish suffixes) 0.85/0.75, typo 0.7/0.6. */
function qeHelpSim(q, t) {
  if (q === t) return 1;
  var short = q.length <= t.length ? q : t, long = short === q ? t : q;
  if (short.length >= 4 && long.indexOf(short) === 0 && short.length / long.length >= 0.5) return 0.85;
  if (q.length === 3 && t.length === 4 && t.indexOf(q) === 0) return 0.7;   // wac -> wacc
  if (short.length >= 5) {
    var p = 0;
    while (p < short.length && q[p] === t[p]) p++;
    if (p >= 5 && p / long.length >= 0.6) return 0.75;
    if (p >= 6) return 0.75;   // long Turkish suffixes: yayinliyorum ~ yayinla
  }
  if (short.length >= 5 && q[0] === t[0]) {
    var d = qeHelpLev(q, t, 2);
    if (d <= 1) return 0.7;
    if (d === 2 && short.length >= 8) return 0.6;
  }
  return 0;
}

function qeHelpLi(lang) {
  return lang in QE_HELP_LANGS ? QE_HELP_LANGS[lang] : 1;
}

function qeHelpUi(lang) {
  var ui = QE_HELP_KB.ui;
  return ui[lang] || ui.en;
}

function qeHelpPageName(page, lang) {
  var names = QE_HELP_KB.pages[page];
  return names ? names[qeHelpLi(lang)] || names[1] : page;
}

/* All entries: the KB plus one 'term' entry per glossary.js key (text read from QE_GLOSSARY). */
var QE_HELP_INDEX = null;
function qeHelpIndex() {
  if (QE_HELP_INDEX) return QE_HELP_INDEX;
  var entries = QE_HELP_KB.entries.slice();
  var gloss = typeof QE_GLOSSARY === 'object' && QE_GLOSSARY ? QE_GLOSSARY : {};
  Object.keys(gloss).forEach(function (key) {
    var g = gloss[key];
    entries.push({ id: 'term_' + key, type: 'term', term: key, k: (QE_HELP_KB.termAliases[key] || '') + '|' + ['tr', 'en', 'es'].map(function (l) { return g[l] ? g[l][0] : ''; }).join('|'),
      t: ['tr', 'en', 'es'].map(function (l) { return (g[l] || g.en)[0]; }), glossary: true, f: QE_HELP_TERM_FOLLOW[key] });
  });
  var byId = {}, df = {};
  entries.forEach(function (e) {
    byId[e.id] = e;
    var toks = {};
    var add = function (text, w) { qeHelpTokens(text).forEach(function (t) { if (!toks[t] || toks[t] < w) toks[t] = w; }); };
    e.aliases = String(e.k || '').split('|').map(function (a) { return qeHelpTokens(a); }).filter(function (a) { return a.length; });
    e.aliases.forEach(function (a) { a.forEach(function (t) { toks[t] = 3; }); });
    (e.t || []).forEach(function (t) { add(t, 2); });
    qeHelpBodies(e).forEach(function (lines) { add(lines.join(' ').replace(/\*\*|`/g, ' '), 0.4); });
    e.toks = toks;
    Object.keys(toks).forEach(function (t) { df[t] = (df[t] || 0) + 1; });
  });
  var n = entries.length, idf = {};
  Object.keys(df).forEach(function (t) { idf[t] = 1 + Math.log(n / df[t]); });
  QE_HELP_INDEX = { entries: entries, byId: byId, idf: idf };
  return QE_HELP_INDEX;
}

var QE_HELP_TERM_FOLLOW = {
  wacc: ['an_roic_wacc', 'an_reverse_dcf', 'term_dcf'], dcf: ['an_reverse_dcf', 'an_scenarios', 'term_wacc'],
  terminal_growth: ['an_scenarios', 'term_dcf', 'term_wacc'], free_cash_flow: ['an_capital_allocation', 'term_capex', 'an_earnings_quality'],
  cash_conversion: ['an_earnings_quality', 'term_free_cash_flow', 'an_cash_cycle'], operating_margin: ['an_cycle_compare', 'term_net_margin', 'an_dupont'],
  net_margin: ['an_dupont', 'term_operating_margin', 'term_net_income'], sharpe: ['an_portfolio', 'term_volatility', 'term_max_drawdown'],
  max_drawdown: ['an_crisis', 'an_portfolio', 'term_sharpe'], out_of_sample: ['an_strategy_multi', 'an_portfolio', 'term_buy_hold'],
  buy_hold: ['an_strategy_multi', 'term_out_of_sample', 'term_bps'], bps: ['an_strategy_multi', 'term_buy_hold', 'term_out_of_sample'],
  enterprise_value: ['an_comps', 'term_equity_value', 'term_market_cap'], equity_value: ['term_enterprise_value', 'an_scenarios', 'term_diluted_shares'],
  current_ratio: ['an_credit_altman', 'an_piotroski', 'faq_banks'], capex: ['term_free_cash_flow', 'an_capital_allocation', 'an_roic_wacc'],
  cagr: ['term_revenue_growth', 'an_segments', 'an_cycle_compare'], revenue_growth: ['term_cagr', 'an_segments', 'an_reverse_dcf'],
  revenue: ['term_revenue_growth', 'term_net_income', 'an_segments'], net_income: ['term_net_margin', 'an_earnings_quality', 'term_free_cash_flow'],
  ttm: ['term_fiscal_year', 'page_guide', 'term_sec_docs'], fiscal_year: ['term_ttm', 'term_sec_docs', 'an_cycle_compare'],
  diluted_shares: ['term_market_cap', 'term_equity_value', 'an_capital_allocation'],
  form_10k: ['term_form_10q', 'term_sec_docs', 'faq_data_sources'], form_10q: ['term_form_10k', 'term_ttm', 'term_sec_docs']
};

/* Answer lines of an entry, per language [[tr], [en], [es]]. */
function qeHelpBodies(e) {
  if (e.glossary) {
    var g = (typeof QE_GLOSSARY === 'object' && QE_GLOSSARY && QE_GLOSSARY[e.term]) || {};
    return ['tr', 'en', 'es'].map(function (l) {
      var x = g[l] || g.en || ['', '', ''];
      var ex = QE_HELP_KB.ui[l].glossaryExample;
      return ['**' + x[0] + '** – ' + x[1]].concat(x[2] ? ['', '**' + ex + ':** ' + x[2]] : []);
    });
  }
  return e.b || [];
}

function qeHelpEntry(id) { return qeHelpIndex().byId[id] || null; }

/* Title and lines of an entry in a language (Spanish/Turkish fall back to English, then Turkish). */
function qeHelpText(e, lang) {
  var li = qeHelpLi(lang), bodies = qeHelpBodies(e), t = e.t || [];
  var lines = bodies[li] && bodies[li].length ? bodies[li] : bodies[1] || bodies[0] || [];
  return { title: t[li] || t[1] || t[0] || e.id, lines: lines };
}

/* "Should I buy X?" style questions always get the not-advice answer. */
var QE_HELP_ADVICE = /\b(alayim|alalim|alinir mi|almali|almaliyim|alsam|alsak|alir misin|satayim|satmali|satmaliyim|satsam|satilir mi|yatirim yapayim|yatirim yapmali|yukselir mi|duser mi|hedef fiyat|kac olur|kac lira olur|ne zaman alinir|should i (buy|sell|invest)|buy or sell|good (buy|investment)|worth buying|is it a buy|price target|stock tip|debo comprar|deberia comprar|compro|vendo|merece la pena comprar|precio objetivo|almak mantikli|almali mi|alinmali mi|alinmaz mi|hisse iyi mi|hissesi iyi mi|sirket iyi mi|iyi bir hisse|iyi bir yatirim|para kazan[a-z]*|kazandirir mi|hangisini alayim|hangisi alinir|mi yoksa [a-z0-9 ]+ mi|worth it|good stock|is [a-z0-9 ]+ a good (stock|buy)|vale la pena|es buena accion|ganar dinero)\b/;
/* A forecast asked about one stock: "msft olumlu mu", "apple s&p 500ü geçer mi", "msft al mı", "will nvda beat the market".
   The stance words are the Lab's own vocabulary, so the question is about a stock only when a name precedes them
   (not "görüşüm olumlu mu olmalı", not "olumlu mu olumsuz mu seçmeliyim"). */
var QE_HELP_STOCK_VIEW = /\b(?!(?:gorus\w*|secim\w*|secmeli\w*|stance|bu|su|o|mu|mi|ya|yoksa|hangisi|benim|degerlendirme\w*|sonuc\w*|metrik\w*|kriter\w*)\b)[a-z][a-z0-9]* (?:hissesi |hisse )?(?:olumlu|olumsuz|notr) mu\b|\b(?:gecer|yener|asar|gecebilir|yenebilir|gecermi) mi\b|\b(?:al|sat) mi\b|\boutperform\w*|\bbeat (?:the )?(?:s ?p|sp|market|index|nasdaq|bist)|\bsupera(?:ra)? al\b|\bsuperara\b/;
/* "Tesla mı Nvidia mı?": two names offered as a choice, unless both are QuantEdge topics ("beta mı capm mi"). */
var QE_HELP_PICK = /^([a-z0-9]+) mi ([a-z0-9]+) mi$/;

/* Score every entry; returns {entry, score, confident, near:[3 best other entries]}. */
function qeHelpAsk(question, page) {
  var ix = qeHelpIndex();
  var folded = qeHelpFold(question);
  var advice = ix.byId.faq_advice;
  if (advice && (QE_HELP_ADVICE.test(folded) || QE_HELP_STOCK_VIEW.test(folded))) return { entry: advice, score: 99, confident: true, near: [] };
  var pick = QE_HELP_PICK.exec(folded);
  if (advice && pick && pick[1] !== 'degil' && pick[2] !== 'degil') {
    var topical = function (w) {
      return ix.entries.some(function (e) { return e.type !== 'faq' && e.type !== 'chat' && e.aliases.some(function (a) { return a.length === 1 && a[0] === w; }); });
    };
    if (!topical(pick[1]) && !topical(pick[2])) return { entry: advice, score: 99, confident: true, near: [] };
  }
  var qs = qeHelpTokens(question);
  var uniq = [];
  qs.forEach(function (q) { if (uniq.indexOf(q) < 0) uniq.push(q); });
  qs = uniq;
  if (!qs.length) return { entry: null, score: 0, confident: false, near: [] };
  var wantsTerm = /\b(nedir|ne demek|anlami|what is|what are|meaning|define|que es|que son|significa)\b/.test(folded);
  var scored = ix.entries.map(function (e) {
    var sum = 0, matched = 0, hit = {};
    qs.forEach(function (q) {
      var best = 0;
      for (var t in e.toks) {
        var s = qeHelpSim(q, t);
        if (s > 0) {
          if (s >= 0.75 && (!hit[t] || s > hit[t])) hit[t] = s;  // how well the best question word matches this one
          var v = s * e.toks[t] * ix.idf[t];
          if (v > best) best = v;
        }
      }
      if (best > 0) matched++;
      sum += best;
    });
    var bonus = 0;
    e.aliases.forEach(function (a) {
      var all = a.every(function (t) { return hit[t]; });
      if (all) {  // a phrase met word for word counts fully; met only through near spellings ('fiyatı' ~ 'fiyatlar') it counts less
        var b = 1, w = 1;
        a.forEach(function (t) { b += ix.idf[t]; w = Math.min(w, hit[t]); });
        b *= w;
        if (b > bonus) bonus = b;
      }
    });
    var score = (sum + bonus) * (0.4 + 0.6 * matched / qs.length);
    if (page && e.page === page) score *= 1.15;
    if (wantsTerm && e.type === 'term') score *= 1.2;
    if (e.type === 'chat' && qs.length >= 2) score *= 0.3;   // "merhaba, wacc nedir?" is about WACC
    return { e: e, s: score };
  });
  scored.sort(function (a, b) { return b.s - a.s || (a.e.id < b.e.id ? -1 : 1); });
  var top = scored[0];
  var confident = top.s >= 6;
  var near = scored.slice(confident ? 1 : 0, (confident ? 1 : 0) + 3).filter(function (x) { return x.s >= 1.5; }).map(function (x) { return x.e; });
  return { entry: confident ? top.e : null, score: Math.round(top.s * 100) / 100, confident: confident, near: near, best: top.e };
}

/* Markdown-lite -> block list. Lines: '' paragraph break, '- ' bullet, '1. ' step. Inline: **bold**, `code`. */
function qeHelpInline(text) {
  var out = [], re = /\*\*([^*]+)\*\*|`([^`]+)`/g, last = 0, m;
  text = String(text);
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ t: 'text', v: text.slice(last, m.index) });
    out.push(m[1] !== undefined ? { t: 'b', v: m[1] } : { t: 'code', v: m[2] });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}

function qeHelpParse(lines) {
  var blocks = [], cur = null;
  (lines || []).forEach(function (line) {
    var s = String(line);
    var bullet = /^- (.*)$/.exec(s), step = /^\d+\. (.*)$/.exec(s);
    if (!s.trim()) { cur = null; return; }
    if (bullet || step) {
      var kind = bullet ? 'ul' : 'ol';
      if (!cur || cur.type !== kind) { cur = { type: kind, items: [] }; blocks.push(cur); }
      cur.items.push(qeHelpInline((bullet || step)[1]));
      return;
    }
    if (cur && cur.type === 'p') { cur.inl.push({ t: 'br' }); cur.inl = cur.inl.concat(qeHelpInline(s)); return; }
    cur = { type: 'p', inl: qeHelpInline(s) };
    blocks.push(cur);
  });
  return blocks;
}

function qeHelpFill(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] === undefined ? '' : vars[k]; });
}

/* ───────── React rendering (elements only; never as raw markup) ───────── */
function qeHelpRenderInline(inl, keyBase) {
  var e = React.createElement;
  return inl.map(function (x, i) {
    var k = keyBase + '-' + i;
    if (x.t === 'b') return e('strong', { key: k }, x.v);
    if (x.t === 'code') return e('code', { key: k }, x.v);
    if (x.t === 'br') return e('br', { key: k });
    return e('span', { key: k }, x.v);
  });
}

function qeHelpRenderBlocks(blocks) {
  var e = React.createElement;
  return blocks.map(function (b, i) {
    if (b.type === 'p') return e('p', { key: 'b' + i }, qeHelpRenderInline(b.inl, 'p' + i));
    return e(b.type, { key: 'b' + i }, b.items.map(function (it, j) { return e('li', { key: j }, qeHelpRenderInline(it, 'l' + i + '-' + j)); }));
  });
}

function qeHelpIcon(kind) {
  var e = React.createElement;
  var paths = kind === 'close' ? [e('path', { key: 1, d: 'm6 6 12 12M18 6 6 18' })] :
    kind === 'send' ? [e('path', { key: 1, d: 'M4 12 20 4l-6 16-3-7z' }), e('path', { key: 2, d: 'm11 13 9-9' })] :
    kind === 'arrow' ? [e('path', { key: 1, d: 'M5 12h14M13 6l6 6-6 6' })] :
    [e('path', { key: 1, d: 'M4 5h16v11H9l-5 4z' }), e('path', { key: 2, d: 'M9.5 9.2a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.6-.8 1.1v.3' }), e('path', { key: 3, d: 'M12 15.2h.01' })];
  return e('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' }, paths);
}

var QE_HELP_STORE = 'qe.help.chat';

/* Esc closes the panel even when focus is on the page behind it (desktop has no backdrop). HookShell has no
 * effect cleanup, so one document listener is registered once and calls the open panel's close function. */
var QE_HELP_DOC = { close: null };
if (typeof document !== 'undefined' && document && typeof document.addEventListener === 'function') {
  document.addEventListener('keydown', function (ev) {
    if ((ev.key === 'Escape' || ev.key === 'Esc') && typeof QE_HELP_DOC.close === 'function') QE_HELP_DOC.close();
  });
}

function qeHelpLoad() {
  try {
    var raw = window.sessionStorage && window.sessionStorage.getItem(QE_HELP_STORE);
    var v = raw ? JSON.parse(raw) : null;
    if (v && Array.isArray(v.msgs)) return v;
  } catch (_) { }
  return { msgs: [], greeted: null };
}

function QEHelpBot(props) {
  var e = React.createElement;
  var lang = props.lang || (typeof QE_LANG === 'string' ? QE_LANG : 'tr');
  var page = QE_HELP_PAGES.indexOf(props.page) >= 0 ? props.page : 'Home';
  var ui = qeHelpUi(lang);
  var saved = useState(qeHelpLoad)[0];
  var openState = useState(false), open = openState[0], setOpen = openState[1];
  var msgState = useState(saved.msgs), msgs = msgState[0], setMsgs = msgState[1];
  var greetState = useState(saved.greeted), greeted = greetState[0], setGreeted = greetState[1];
  var inputState = useState(''), input = inputState[0], setInput = inputState[1];
  var refs = useState(function () { return {}; })[0];

  useEffect(function () {
    try { window.sessionStorage.setItem(QE_HELP_STORE, JSON.stringify({ msgs: msgs.slice(-60), greeted: greeted })); } catch (_) { }
  }, [msgs, greeted]);
  useEffect(function () { if (open && refs.input) refs.input.focus(); }, [open]);
  // Keep the newest question at the top of the log so its answer is read from the start.
  useEffect(function () {
    var log = refs.log;
    if (!open || !log) return;
    var users = log.querySelectorAll('.qhb-user');
    var last = users.length ? users[users.length - 1] : null;
    log.scrollTop = last ? Math.max(0, last.offsetTop - 8) : 0;
  }, [open, msgs.length]);

  var nextId = function (list) { return list.length ? list[list.length - 1].n + 1 : 1; };
  var push = function (items) {
    setMsgs(function (list) {
      var out = list.slice(), n = nextId(list);
      items.forEach(function (m) { m.n = n++; out.push(m); });
      return out.slice(-60);
    });
  };

  // Greet with suggestions for the current page when the panel opens (again when the page changed).
  useEffect(function () {
    if (open && greeted !== page) { setGreeted(page); push([{ role: 'bot', kind: 'greet', page: page }]); }
  }, [open, page]);
  var doOpen = function () { setOpen(true); };
  var doClose = function () {
    QE_HELP_DOC.close = null;
    setOpen(false);
    setTimeout(function () { if (refs.launcher) refs.launcher.focus(); }, 0);
  };
  var ask = function (text) {
    var q = String(text || '').trim().slice(0, 300);
    if (!q) return;
    var r = qeHelpAsk(q, page);
    push([{ role: 'user', text: q }, r.entry ? { role: 'bot', kind: 'answer', id: r.entry.id } : { role: 'bot', kind: 'unknown', near: r.near.map(function (x) { return x.id; }) }]);
    setInput('');
  };
  var askId = function (id) {
    var en = qeHelpEntry(id);
    if (!en) return;
    push([{ role: 'user', id: id }, { role: 'bot', kind: 'answer', id: id }]);
    if (refs.input) refs.input.focus();
  };
  var go = function (p) {
    if (typeof props.setPage === 'function') props.setPage(p);
    if (typeof window !== 'undefined' && window.innerWidth <= 700) doClose();
  };
  var clear = function () { setMsgs([]); setGreeted(page); push([{ role: 'bot', kind: 'greet', page: page }]); if (refs.input) refs.input.focus(); };

  var onKey = function (ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') { ev.preventDefault(); ev.stopPropagation(); doClose(); return; }
    if (ev.key !== 'Tab' || !refs.panel) return;
    var items = Array.prototype.slice.call(refs.panel.querySelectorAll('button:not([disabled]), textarea, input, a[href]'));
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1], active = document.activeElement;
    if (ev.shiftKey && (active === first || !refs.panel.contains(active))) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && active === last) { ev.preventDefault(); first.focus(); }
  };

  var chips = function (ids, cls) {
    var list = (ids || []).map(qeHelpEntry).filter(Boolean);
    if (!list.length) return null;
    return e('div', { className: 'qhb-chips ' + (cls || '') }, list.map(function (x) {
      return e('button', { key: x.id, type: 'button', className: 'qhb-chip', onClick: function () { askId(x.id); } }, qeHelpText(x, lang).title);
    }));
  };
  var pageButton = function (p, label) {
    return e('button', { key: 'go-' + p, type: 'button', className: 'qhb-action', onClick: function () { go(p); } },
      e('span', null, label || (p === 'Home' && ui.openHome) || qeHelpFill(ui.open, { page: qeHelpPageName(p, lang) })), qeHelpIcon('arrow'));
  };

  var renderBot = function (m) {
    if (m.kind === 'greet') {
      var sug = QE_HELP_KB.pageSuggest[m.page] || QE_HELP_KB.pageSuggest.Home;
      return [e('div', { key: 'g', className: 'qhb-text' }, qeHelpRenderBlocks(qeHelpParse([qeHelpFill(ui.greet, { page: qeHelpPageName(m.page, lang) }), '', ui.greetAsk]))),
        chips(sug)];
    }
    if (m.kind === 'unknown') {
      return [e('div', { key: 'u', className: 'qhb-text' }, qeHelpRenderBlocks(qeHelpParse([ui.unknown]))),
        chips(m.near && m.near.length ? m.near : QE_HELP_KB.pageSuggest[page]),
        e('p', { key: 'ut', className: 'qhb-muted' }, ui.unknownTail)];
    }
    var en = qeHelpEntry(m.id);
    if (!en) return null;
    var tx = qeHelpText(en, lang);
    var lines = tx.lines.slice();
    var pages = (en.go || []).slice();
    if (en.type === 'analysis') {
      lines = lines.concat(['', qeHelpFill(ui.pickInLab, { n: en.n, title: tx.title.replace(/^#\d+\s*/, '') })]);
      if (pages.indexOf('Analysis Lab') < 0) pages.unshift('Analysis Lab');
    } else if (en.type === 'page' && pages.indexOf(en.page) < 0) pages.unshift(en.page);
    var actions = pages.filter(function (p, i) { return QE_HELP_PAGES.indexOf(p) >= 0 && pages.indexOf(p) === i && p !== page; }).slice(0, 2);
    var follow = (en.f || []).filter(function (id) { return id !== en.id; }).slice(0, 3);
    return [
      e('h3', { key: 'h', className: 'qhb-title' }, tx.title),
      e('div', { key: 'x', className: 'qhb-text' }, qeHelpRenderBlocks(qeHelpParse(lines))),
      actions.length ? e('div', { key: 'a', className: 'qhb-actions' }, actions.map(function (p) { return pageButton(p, p === 'Analysis Lab' && en.type === 'analysis' ? ui.openLab : null); })) : null,
      follow.length ? e('div', { key: 'f', className: 'qhb-follow' }, e('span', { className: 'qhb-muted' }, ui.related), chips(follow)) : null
    ];
  };

  var renderMsg = function (m) {
    if (m.role === 'user') {
      var label = m.text !== undefined ? m.text : (qeHelpEntry(m.id) ? qeHelpText(qeHelpEntry(m.id), lang).title : '');
      return e('div', { key: m.n, className: 'qhb-msg qhb-user' }, e('span', { className: 'qhb-sr' }, ui.you + ': '), e('p', null, label));
    }
    return e('div', { key: m.n, className: 'qhb-msg qhb-bot' }, e('span', { className: 'qhb-sr' }, ui.bot + ': '), renderBot(m));
  };

  QE_HELP_DOC.close = open ? doClose : null;
  // Phones: a bottom sheet over a backdrop (modal). Desktop: a side panel, the page stays usable (not modal).
  var modal = typeof window !== 'undefined' && window.innerWidth <= 700;
  if (!open) {
    return e('div', { className: 'qhb-root' },
      e('button', { type: 'button', className: 'qhb-launcher', ref: function (el) { refs.launcher = el; }, onClick: doOpen, 'aria-haspopup': 'dialog', 'aria-expanded': 'false', title: ui.title },
        qeHelpIcon('help'), e('span', { className: 'qhb-launcher-label' }, ui.launcher)));
  }
  return e('div', { className: 'qhb-root' },
    e('div', { className: 'qhb-backdrop', onClick: doClose, 'aria-hidden': 'true' }),
    e('section', { className: 'qhb-panel', role: 'dialog', 'aria-modal': modal ? 'true' : 'false', 'aria-labelledby': 'qhb-title', onKeyDown: onKey, ref: function (el) { refs.panel = el; }, lang: lang },
      e('header', { className: 'qhb-head' },
        e('span', { className: 'qhb-badge', 'aria-hidden': 'true' }, qeHelpIcon('help')),
        e('div', { className: 'qhb-head-text' }, e('h2', { id: 'qhb-title' }, ui.title), e('p', null, ui.sub)),
        e('button', { type: 'button', className: 'qhb-icon-btn', onClick: doClose, 'aria-label': ui.close, title: ui.close }, qeHelpIcon('close'))),
      e('div', { className: 'qhb-log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions', ref: function (el) { refs.log = el; } }, msgs.map(renderMsg)),
      e('form', { className: 'qhb-form', onSubmit: function (ev) { ev.preventDefault(); ask(input); } },
        e('label', { className: 'qhb-sr', htmlFor: 'qhb-input' }, ui.placeholder),
        e('textarea', { id: 'qhb-input', className: 'qhb-input', rows: 1, value: input, maxLength: 300, placeholder: ui.placeholder, ref: function (el) { refs.input = el; },
          onChange: function (ev) { setInput(ev.target.value); },
          onKeyDown: function (ev) { if (ev.key === 'Enter' && !ev.shiftKey && !ev.nativeEvent.isComposing) { ev.preventDefault(); ask(input); } } }),
        e('button', { type: 'submit', className: 'qhb-send', 'aria-label': ui.send, title: ui.send, disabled: !input.trim() }, qeHelpIcon('send'))),
      e('footer', { className: 'qhb-foot' },
        e('span', null, ui.hint + ' · ' + ui.footer),
        e('button', { type: 'button', className: 'qhb-clear', onClick: clear }, ui.clear))));
}

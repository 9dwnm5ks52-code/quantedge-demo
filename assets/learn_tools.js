/* QuantEdge — Learn page tools: try-it calculators, short quizzes and "learned" progress.
 *
 * Each calculator starts on the numbers of its card's worked example (learn_kb.js) and uses the same
 * formula the card describes, so moving a slider shows how the answer reacts. They are teaching aids
 * with made-up numbers, not the Analysis Lab: the Lab reads real filings. Labels are English keys
 * translated in ui_i18n.js. The compute functions are pure, so tests run them in node.
 */
var QE_LEARN_CALC = {
  dupont: {
    inputs: [['ni', 'Net income', 100, 0, 500, 5, 'm'], ['rev', 'Revenue', 1000, 100, 4000, 50, 'm'],
      ['assets', 'Average total assets', 2000, 200, 8000, 100, 'm'], ['equity', 'Average equity', 500, 50, 4000, 50, 'm']],
    run: function (v) {
      var margin = v.ni / v.rev, turn = v.rev / v.assets, mult = v.assets / v.equity;
      return [['Net margin', margin * 100, 'pct'], ['Asset turnover', turn, 'x'], ['Equity multiplier', mult, 'x'], ['ROE', margin * turn * mult * 100, 'pct', true]];
    }
  },
  cash_cycle: {
    inputs: [['rev', 'Revenue', 3650, 500, 10000, 50, 'm'], ['cogs', 'Cost of sales', 2920, 300, 9000, 20, 'm'],
      ['rec', 'Average receivables', 300, 0, 2000, 10, 'm'], ['inv', 'Average inventory', 400, 0, 2000, 10, 'm'], ['pay', 'Average payables', 480, 0, 2000, 10, 'm']],
    run: function (v) {
      var dso = v.rec / v.rev * 365, dio = v.inv / v.cogs * 365, dpo = v.pay / v.cogs * 365;
      return [['DSO', dso, 'days'], ['DIO', dio, 'days'], ['DPO', dpo, 'days'], ['Cash conversion cycle', dso + dio - dpo, 'days', true]];
    }
  },
  earnings_quality: {
    inputs: [['ni', 'Net income', 100, 10, 500, 5, 'm'], ['cfo', 'Operating cash flow', 70, -100, 600, 5, 'm'], ['capex', 'Capital expenditure', 30, 0, 300, 5, 'm'],
      ['a0', 'Total assets, start of year', 400, 50, 3000, 50, 'm'], ['a1', 'Total assets, end of year', 600, 50, 3000, 50, 'm']],
    run: function (v) {
      var accr = (v.ni - v.cfo) / ((v.a0 + v.a1) / 2) * 100;
      return [['Cash conversion', v.cfo / v.ni, 'x', true], ['Accruals ratio', accr, 'pct', false, accr > 10 ? 'Above the 10% flag' : ''], ['FCF ÷ net income', (v.cfo - v.capex) / v.ni, 'x']];
    }
  },
  roic_wacc: {
    inputs: [['ebit', 'EBIT', 200, 0, 1000, 10, 'm'], ['tax', 'Tax rate', 20, 0, 35, 1, 'pct'], ['ic', 'Average invested capital', 800, 100, 5000, 50, 'm'], ['wacc', 'WACC', 9, 2, 25, 0.5, 'pct']],
    run: function (v) {
      var nopat = v.ebit * (1 - v.tax / 100), roic = nopat / v.ic * 100;
      return [['NOPAT', nopat, 'm'], ['ROIC', roic, 'pct'], ['Spread (ROIC − WACC)', roic - v.wacc, 'pts', true]];
    }
  },
  dcf: {
    // the card's engine: 5 years, growth fading from g₀ toward g, FCFF = EBIT(1 − t) + D&A − capex − NWC × ΔRevenue
    fixed: { rev0: 1000, tax: 20, da: 4, capex: 5, nwc: 5, debt: 200, cash: 100, shares: 100 },
    note: 'Kept as in the example: revenue 1,000, tax 20%, D&A 4% and capex 5% of revenue, working capital 5% of extra revenue, debt 200, cash 100, 100 shares.',
    inputs: [['g0', 'Year-1 revenue growth', 10, -10, 40, 0.5, 'pct'], ['margin', 'EBIT margin', 20, 0, 60, 0.5, 'pct'],
      ['wacc', 'WACC', 9, 5, 15, 0.25, 'pct'], ['gt', 'Terminal growth', 3, 0, 5, 0.25, 'pct']],
    run: function (v) {
      var f = QE_LEARN_CALC.dcf.fixed, w = v.wacc / 100, gt = v.gt / 100, rev = f.rev0, pv = 0, fcf = 0;
      if (w - gt < 0.01) return [['Terminal growth must stay at least 1 point below WACC', null, 'note', true]];
      for (var t = 1; t <= 5; t++) {
        var g = v.g0 / 100 + (gt - v.g0 / 100) * (t - 1) / 5, next = rev * (1 + g);
        fcf = next * v.margin / 100 * (1 - f.tax / 100) + next * f.da / 100 - next * f.capex / 100 - f.nwc / 100 * (next - rev);
        pv += fcf / Math.pow(1 + w, t); rev = next;
      }
      var tv = fcf * (1 + gt) / (w - gt) / Math.pow(1 + w, 5), ev = pv + tv;
      return [['Five years of cash flow, today', pv, 'm'], ['Terminal value, today', tv, 'm'], ['Share of value after year 5', tv / ev * 100, 'pct'],
        ['Value per share', (ev - f.debt + f.cash) / f.shares, 'usd', true]];
    }
  },
  reverse_dcf: {
    inputs: [['ev', 'Enterprise value today', 400, 50, 2000, 10, 'm'], ['rev', 'Revenue', 100, 10, 500, 5, 'm'], ['m', 'Free cash flow margin', 20, 2, 50, 0.5, 'pct'],
      ['wacc', 'WACC', 9, 5, 15, 0.25, 'pct'], ['gt', 'Terminal growth', 3, 0, 5, 0.25, 'pct']],
    model: function (g, v) {
      var w = v.wacc / 100, gt = v.gt / 100, m = v.m / 100, s = 0;
      for (var t = 1; t <= 10; t++) s += v.rev * Math.pow(1 + g, t) * m / Math.pow(1 + w, t);
      return s + v.rev * Math.pow(1 + g, 10) * (1 + gt) * m / (w - gt) / Math.pow(1 + w, 10);
    },
    run: function (v) {
      if (v.wacc - v.gt < 1) return [['Terminal growth must stay at least 1 point below WACC', null, 'note', true]];
      var lo = -0.5, hi = 1.5, mod = QE_LEARN_CALC.reverse_dcf.model;
      if (mod(lo, v) > v.ev || mod(hi, v) < v.ev) return [['No growth rate between −50% and +150% matches this value', null, 'note', true]];
      for (var i = 0; i < 80; i++) { var mid = (lo + hi) / 2; if (mod(mid, v) < v.ev) lo = mid; else hi = mid; }
      var g = (lo + hi) / 2;
      return [['Growth the price implies, per year for 10 years', g * 100, 'pct', true], ['Revenue in year 10', v.rev * Math.pow(1 + g, 10), 'm']];
    }
  },
  comps: {
    inputs: [['price', 'Share price', 50, 1, 200, 1, 'usd'], ['shares', 'Shares outstanding', 20, 1, 100, 1, 'mshares'], ['ni', 'Net income (last 12 months)', 40, 1, 300, 1, 'm'],
      ['p1', 'Peer 1 P/E', 15, 2, 80, 1, 'x'], ['p2', 'Peer 2 P/E', 20, 2, 80, 1, 'x'], ['p3', 'Peer 3 P/E', 30, 2, 80, 1, 'x']],
    run: function (v) {
      var pe = v.price * v.shares / v.ni, peers = [v.p1, v.p2, v.p3].sort(function (a, b) { return a - b; }), med = peers[1];
      return [['Market value', v.price * v.shares, 'm'], ['P/E', pe, 'x'], ['Peer median P/E', med, 'x'], ['Gap to peers', (pe / med - 1) * 100, 'pct', true]];
    }
  },
  credit_altman: {
    inputs: [['ta', 'Total assets', 1000, 100, 5000, 50, 'm'], ['wc', 'Working capital', 200, -500, 1500, 10, 'm'], ['re', 'Retained earnings', 300, -1000, 2000, 10, 'm'],
      ['ebit', 'EBIT', 100, -300, 800, 5, 'm'], ['eq', 'Equity', 400, 10, 3000, 10, 'm'], ['tl', 'Total liabilities', 600, 10, 5000, 10, 'm']],
    run: function (v) {
      var z = 6.56 * v.wc / v.ta + 3.26 * v.re / v.ta + 6.72 * v.ebit / v.ta + 1.05 * v.eq / v.tl;
      return [["Z''", z, 'num', true, z > 2.6 ? 'Safe zone (above 2.6)' : z >= 1.1 ? 'Grey zone (1.1–2.6)' : 'Distress zone (below 1.1)']];
    }
  },
  beta: {
    inputs: [['beta', 'Beta', 1.2, -0.5, 3, 0.05, 'num'], ['rf', 'Risk-free rate', 4, 0, 10, 0.25, 'pct'], ['erp', 'Equity risk premium', 5, 2, 9, 0.25, 'pct'],
      ['mkt', 'Market move', 10, -30, 30, 1, 'pct']],
    run: function (v) {
      return [['Cost of equity (CAPM)', v.rf + v.beta * v.erp, 'pct', true], ['Typical move for this share', v.beta * v.mkt, 'pct']];
    }
  },
  options_lab: {
    inputs: [['s', 'Share price', 100, 50, 150, 1, 'usd'], ['k', 'Strike price', 100, 50, 150, 1, 'usd'], ['months', 'Months to expiry', 3, 1, 24, 1, 'months'],
      ['vol', 'Volatility', 20, 5, 100, 1, 'pct'], ['r', 'Risk-free rate', 4, 0, 10, 0.25, 'pct']],
    run: function (v) {
      var T = v.months / 12, sig = v.vol / 100, r = v.r / 100;
      var d1 = (Math.log(v.s / v.k) + (r + sig * sig / 2) * T) / (sig * Math.sqrt(T)), d2 = d1 - sig * Math.sqrt(T), disc = Math.exp(-r * T);
      return [['Call price', v.s * qeNormCdf(d1) - v.k * disc * qeNormCdf(d2), 'usd', true], ['Put price', v.k * disc * qeNormCdf(-d2) - v.s * qeNormCdf(-d1), 'usd', true],
        ['Chance the call ends in the money (risk-neutral)', qeNormCdf(d2) * 100, 'pct']];
    }
  }
};

function qeNormCdf(x) {  // Abramowitz–Stegun 7.1.26 through erf; error below 1e-7, plenty for a teaching tool
  var t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2);
  return x >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

function qeLearnDefaults(id) {
  var v = {};
  QE_LEARN_CALC[id].inputs.forEach(function (i) { v[i[0]] = i[2]; });
  return v;
}

function qeLearnFmt(x, fmt, digits) {
  if (x === null || x === undefined || !isFinite(x)) return '—';
  var loc = QE_LANG === 'en' ? 'en-US' : QE_LANG === 'tr' ? 'tr-TR' : 'es-ES';
  var n = function (d) { return x.toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d }); };
  if (fmt === 'pct') { var p = n(digits === undefined ? 1 : digits); return QE_LANG === 'tr' ? '%' + p : p + (QE_LANG === 'es' ? ' %' : '%'); }
  if (fmt === 'pts') return (x > 0 ? '+' : '') + n(1) + ' ' + L('pts');
  if (fmt === 'x') return n(2) + '×';
  if (fmt === 'days') return n(0) + ' ' + L('days');
  if (fmt === 'months') return n(0) + ' ' + L('months');
  if (fmt === 'usd') return '$' + n(2);
  if (fmt === 'm') return '$' + n(0) + 'M';
  if (fmt === 'mshares') return n(0) + 'M';
  return n(digits === undefined ? 2 : digits);
}

/* Try-it calculator: sliders start on the card's example numbers; "Reset" brings them back. */
function LearnCalc(props) {
  var e = React.createElement, spec = QE_LEARN_CALC[props.id];
  var vals = useState(function () { return qeLearnDefaults(props.id); });
  var v = vals[0], out = spec.run(v);
  return e('div', { className: 'learn-calc' },
    e('div', { className: 'learn-calc-head' }, e('h4', null, L('Try it yourself')),
      e('button', { type: 'button', className: 'tiny-link', onClick: function () { vals[1](qeLearnDefaults(props.id)); } }, L('Reset to the example'))),
    e('p', { className: 'micro muted' }, L('Starts on the example above. Move a slider and watch the result change. Made-up numbers.')),
    e('div', { className: 'learn-calc-grid' },
      e('div', { className: 'learn-calc-inputs' }, spec.inputs.map(function (i) {
        var k = i[0];
        return e('label', { key: k, className: 'learn-slider' },
          e('span', null, L(i[1]), e('b', null, qeLearnFmt(v[k], i[6], i[5] < 0.5 ? 2 : i[5] < 1 ? 1 : 0))),
          e('input', { type: 'range', min: i[3], max: i[4], step: i[5], value: v[k], 'aria-label': L(i[1]),
            onChange: function (ev) { var next = Object.assign({}, v); next[k] = Number(ev.target.value); vals[1](next); } }));
      })),
      e('div', { className: 'learn-calc-out', 'aria-live': 'polite' }, out.map(function (o, j) {
        if (o[2] === 'note') return e('p', { key: j, className: 'learn-calc-note' }, L(o[0]));
        return e('div', { key: j, className: 'learn-calc-res' + (o[3] ? ' is-main' : '') },
          e('span', null, L(o[0])), e('strong', null, qeLearnFmt(o[1], o[2])), o[4] ? e('small', null, L(o[4])) : null);
      }))),
    spec.note && e('p', { className: 'micro muted learn-calc-fixed' }, L(spec.note)));
}

/* Short quiz: pick an answer, see right or wrong with the reason; nothing is stored. */
function LearnQuiz(props) {
  var e = React.createElement, picks = useState({}), qs = props.quiz;
  var right = qs.filter(function (q, i) { return picks[0][i] === q.answer; }).length, done = Object.keys(picks[0]).length;
  return e('div', { className: 'learn-quiz' },
    e('h4', null, L('Check yourself')),
    qs.map(function (q, i) {
      var pick = picks[0][i], answered = pick !== undefined, opts = q.options[QE_LANG] || q.options.en;
      return e('fieldset', { key: i, className: 'learn-q' },
        e('legend', null, (i + 1) + '. ' + qeLearnText(q.q)),
        e('div', { className: 'learn-q-opts' }, opts.map(function (o, j) {
          var cls = 'learn-q-opt' + (answered && j === q.answer ? ' is-right' : '') + (answered && j === pick && j !== q.answer ? ' is-wrong' : '');
          return e('button', { key: j, type: 'button', className: cls, disabled: answered, 'aria-pressed': pick === j,
            onClick: function () { var p = Object.assign({}, picks[0]); p[i] = j; picks[1](p); } }, o);
        })),
        answered && e('p', { className: 'learn-q-why ' + (pick === q.answer ? 'is-right' : 'is-wrong') },
          e('b', null, L(pick === q.answer ? 'Correct.' : 'Not quite.') + ' '), qeLearnText(q.why)));
    }),
    done === qs.length && e('div', { className: 'learn-quiz-end' },
      e('span', null, L('{n} of {m} right').replace('{n}', right).replace('{m}', qs.length)),
      e('button', { type: 'button', className: 'tiny-link', onClick: function () { picks[1]({}); } }, L('Try again'))));
}

/* "Learned" marks, kept in this browser only. */
var QE_LEARN_DONE_KEY = 'qe.learn.done';
function qeLearnDoneRead() {
  try { var x = JSON.parse(window.localStorage.getItem(QE_LEARN_DONE_KEY) || '[]'); return Array.isArray(x) ? x : []; } catch (_) { return []; }
}
function qeLearnDoneWrite(list) {
  try { window.localStorage.setItem(QE_LEARN_DONE_KEY, JSON.stringify(list)); } catch (_) { /* private mode: marks last for this visit */ }
}

/* Glossary terms inside Learn text: the first mention of each known term in a block gets the "?" popover. */
var qeLearnTermIndex = null;
function qeLearnTerms() {
  if (qeLearnTermIndex && qeLearnTermIndex.lang === QE_LANG) return qeLearnTermIndex;
  var forms = [];
  var all = typeof qeGlossaryAll === 'function' ? qeGlossaryAll() : {};
  Object.keys(all).forEach(function (k) {
    var g = all[k], al = typeof QE_GLOSSARY_ALIASES !== 'undefined' && QE_GLOSSARY_ALIASES[k] && QE_GLOSSARY_ALIASES[k][QE_LANG];
    (al || [(g[QE_LANG] || g.en)[0]]).forEach(function (f) { if (f && f.length >= 2) forms.push([f, k]); });  // the listed forms, else the term's own name
  });
  forms.sort(function (a, b) { return b[0].length - a[0].length; });  // longest first: "free cash flow" before "cash flow"
  var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  var W = '[\\p{L}\\p{N}_]';
  var rx = null;
  try {  // look-behind needs Safari 16.4+; without it the text simply stays plain
    // Turkish adds suffixes to a term ("özkaynak kârlılığının"), so there only the start must be a word boundary
    if (forms.length) rx = new RegExp('(?<!' + W + ')(' + forms.map(function (f) { return esc(f[0]); }).join('|') + ')' + (QE_LANG === 'tr' ? '' : '(?!' + W + ')'), 'giu');
  } catch (_) { rx = null; }
  var byForm = {};
  forms.forEach(function (f) { var low = f[0].toLocaleLowerCase(); if (!byForm[low]) byForm[low] = f; });
  qeLearnTermIndex = { lang: QE_LANG, rx: rx, byForm: byForm, word: W };
  return qeLearnTermIndex;
}

/* A short abbreviation (FD, CCC, İNA) counts only written exactly so and as a whole word: never inside "inanç". */
function qeLearnFormOk(form, hit, next) {
  var abbr = form.length <= 5 && form === form.toLocaleUpperCase() && /\p{Lu}/u.test(form);
  if (!abbr) return true;
  return hit === form && !(next && /[\p{L}\p{N}_]/u.test(next));
}

function qeLearnLinkTerms(text, seen) {
  var idx = qeLearnTerms();
  if (!idx.rx || typeof text !== 'string' || typeof Term !== 'function') return text;
  var out = [], last = 0, m, e = React.createElement;
  idx.rx.lastIndex = 0;
  while ((m = idx.rx.exec(text))) {
    var f = idx.byForm[m[0].toLocaleLowerCase()], key = f && f[1];
    if (!key || seen[key] || !qeLearnFormOk(f[0], m[0], text.charAt(m.index + m[0].length))) continue;
    seen[key] = 1;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(e(Term, { key: out.length, k: key }, m[0]));
    last = m.index + m[0].length;
  }
  if (!out.length) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

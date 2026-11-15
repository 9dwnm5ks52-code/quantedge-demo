/* QuantEdge v0.13.5 — Analysis Lab page.
 *
 * One generic renderer for every Lab analysis: the API returns the same shape
 * (findings, tables, charts, notes, sources), so adding an analysis needs no UI work.
 * Each result can become report notes, a LinkedIn draft or a 1200×627 PNG card.
 */
var QE_LAB_GROUPS = [['fundamental', 'Fundamentals'], ['valuation', 'Valuation'], ['risk', 'Risk and credit'], ['quant', 'Quant']];
// v0.13.5: one line under each group heading in the picker
var QE_LAB_GROUP_BLURB = { fundamental: 'The company’s own numbers: growth, margins, cash and returns.', valuation: 'What the share could be worth, and what today’s price assumes.',
  risk: 'Debt, market sensitivity, ownership and the range of outcomes.', quant: 'Prices, statistics and models: tests, portfolios, options.' };
// a small picture of what each analysis does (drawn in the group's colour); the shapes are shared by similar analyses
var QE_LAB_GLYPH = { cycle_compare: 'bars', segments: 'stack', capital_allocation: 'stack', quarterly: 'bars', comps: 'bars', earnings_quality: 'line', roic_wacc: 'line',
  strategy_multi: 'line', dupont: 'tree', cash_cycle: 'cycle', credit_altman: 'gauge', piotroski: 'gauge', reverse_dcf: 'flow', dcf: 'flow', valuation_summary: 'range',
  bank_value: 'flow', scenarios: 'fan', uncertainty: 'fan', implied_move: 'fan', beta: 'scatter', factors: 'scatter', event_study: 'spike', crisis: 'spike',
  portfolio: 'pie', holders: 'pie', insiders: 'people', deal_case: 'merge', turkey_fx: 'swap', ito: 'wave', options_lab: 'smile' };
var QE_LAB_GLYPH_PATHS = {
  bars: ['M4 20V12', 'M9 20V7', 'M14 20V10', 'M19 20V4'], stack: ['M4 20h16', 'M6 16h12', 'M8 12h8', 'M10 8h4'], line: ['M3 18l5-5 4 3 8-9', 'M15 7h5v5'],
  tree: ['M12 4v5', 'M12 9l-6 5', 'M12 9l6 5', 'M6 14v5', 'M18 14v5'], cycle: ['M20 12a8 8 0 1 1-3-6.2', 'M17 3v3h-3'],
  gauge: ['M4 17a8 8 0 0 1 16 0', 'M12 17l4-5'], flow: ['M3 12h11', 'M10 7l5 5-5 5', 'M18 5v14'], range: ['M4 8h10', 'M7 12h12', 'M3 16h8', 'M12 4v16'],
  fan: ['M3 12h4', 'M7 12l13-7', 'M7 12h13', 'M7 12l13 7'], scatter: ['M5 18h.01', 'M8 14h.01', 'M11 15h.01', 'M13 10h.01', 'M17 8h.01', 'M19 5h.01', 'M4 20L20 4'],
  spike: ['M3 14h6l2-9 3 15 2-6h5'], pie: ['M12 3a9 9 0 1 0 9 9h-9z', 'M15 3.5A9 9 0 0 1 20.5 9H15z'],
  people: ['M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6', 'M3 20a5 5 0 0 1 10 0', 'M16 11a3 3 0 1 0 0-6', 'M21 20a5 5 0 0 0-5-5'],
  merge: ['M5 4v5a6 6 0 0 0 6 6h0', 'M19 4v5a6 6 0 0 1-6 6', 'M12 15v5'], swap: ['M4 8h14', 'M15 5l3 3-3 3', 'M20 16H6', 'M9 13l-3 3 3 3'],
  wave: ['M3 14l2-3 2 4 2-6 2 5 2-2 2 4 2-7 2 3 2-1'], smile: ['M3 6c3 12 15 12 18 0', 'M12 15v5'],
  // the home page's own pictures
  pen: ['M4 20h4L19 9l-4-4L4 16z', 'M13 7l4 4'], send: ['M21 3L10 14', 'M21 3l-7 18-4-7-7-4z'], book: ['M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z', 'M4 21V5', 'M9 7h6'],
  compass: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18', 'M15.5 8.5l-2 5-5 2 2-5z']
};
// the group a picker should open on, set by a link elsewhere (the home page's group cards); read once
function qeLabTakeTab() {
  var t = window.QE_LAB_TAB;
  window.QE_LAB_TAB = null;
  return t && (t === 'all' || QE_LAB_GROUPS.some(function (g) { return g[0] === t; })) ? t : 'all';
}
function qeLabShape(shape) {
  var e = React.createElement, paths = QE_LAB_GLYPH_PATHS[shape] || QE_LAB_GLYPH_PATHS.bars;
  return e('svg', { className: 'lab-glyph', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
    paths.map(function (d, i) { return e('path', { key: i, d: d }); }));
}
function qeLabGlyph(id) {
  var e = React.createElement, paths = QE_LAB_GLYPH_PATHS[QE_LAB_GLYPH[id] || 'bars'];
  return e('svg', { className: 'lab-glyph', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
    paths.map(function (d, i) { return e('path', { key: i, d: d }); }));
}
// what is special about an analysis, from the catalog itself (never a claim the catalog does not make)
function qeLabBadges(a) {
  var out = [];
  if (a.id === 'options_lab') out.push(['live', L('LIVE')]);
  if (a.id === 'options_lab' || a.id === 'implied_move') out.push(['', L('Options data')]);
  if (a.id === 'turkey_fx') out.push(['', L('Turkey')]);
  if (a.max_tickers > 1) out.push(['', (a.min_tickers || 1) + '–' + a.max_tickers + ' ' + L('tickers')]);
  return out;
}
var QE_LAB_PARAM_LABELS = {
  wacc_pct: 'WACC %', terminal_pct: 'Terminal growth %', fcf_margin_pct: 'FCF margin % (blank = 3-year average)',
  growth_pct: 'Year-1 growth % (blank = history)', rf_pct: 'Risk-free rate % (blank = today’s 10-year US Treasury)', erp_pct: 'Equity risk premium % (blank = Damodaran’s implied premium)',
  strategy: 'Strategy', fast: 'Fast MA', slow: 'Slow MA', momentum: 'Momentum lookback (days)',
  fee_bps: 'Fee (bps)', slippage_bps: 'Slippage (bps)', train_pct: 'Training %',
  announce_date: 'Announcement date', offer_price: 'Offer price per share ($)',
  target_price_before: "Target's close before the announcement ($)", target_symbol: 'Target symbol (if still listed)',
  fx_revenue_pct: 'Foreign-currency revenue % (KAP annual report, optional)',
  horizon_months: 'Horizon (months)', include_earnings: 'Include earnings days (US stocks)', fat_tails: 'Fat tails (Student-t)', history_drift: 'Use the historical drift (default: zero edge)', expiry: 'Expiry (blank = nearest to 30 days)', strike: 'Strike (blank = at the money)', option_type: 'Option type (call or put)', heston: 'Fit the Heston stochastic-volatility model', adr_ratio: 'Ordinary shares per ADR (foreign companies; blank = 1)',
  ebit_margin_pct: 'Operating margin % (blank = 3-year average)', wacc_override_pct: 'WACC % (blank = build from CAPM)',
  roe_pct: 'ROE % (blank = 3-year average)', peers: 'Peers for multiples (comma separated; blank = suggested from the SEC industry code)'
};
/* Parameters sent as text, not numbers. */
var QE_LAB_TEXT_PARAMS = { strategy: 'select', announce_date: 'date', target_symbol: 'text', peers: 'text', expiry: 'date', option_type: 'select' };
var QE_LAB_COLORS = ['#43d9d2', '#edbc6c', '#9d93f8', '#ee919f', '#8ee6bf', '#7993c8', '#f2a65a', '#c9d8e6'];
/* Optional series "tone" (a band chart such as the #20 fan chart): one hue for the band family so the outer pair,
   the inner pair and the median read as nested ranges; "ref" is a grey dotted reference line (100 = today). */
var QE_LAB_TONES = { mid: { ci: 0, a: 1, dash: null, w: 1.4 }, inner: { ci: 0, a: 0.62, dash: null, w: 1 },
  outer: { ci: 0, a: 0.4, dash: [7, 5], w: 1 }, ref: { ci: 7, a: 0.85, dash: [2, 5], w: 0.7 } };
function qeLabSeriesStyle(s, si) {
  var t = s && Object.prototype.hasOwnProperty.call(QE_LAB_TONES, s.tone) ? QE_LAB_TONES[s.tone] : null;
  return t ? { color: QE_LAB_COLORS[t.ci], css: 'var(--qe-c' + t.ci + ')', alpha: t.a, dash: t.dash, w: t.w }
    : { color: QE_LAB_COLORS[si % QE_LAB_COLORS.length], css: 'var(--qe-c' + (si % QE_LAB_COLORS.length) + ')', alpha: 1, dash: null, w: 1 };
}

/* Table and axis numbers match the public site: a fixed number of decimals per format (so a
   column lines up), trailing zeros kept, and a true minus sign (U+2212). */
var QE_LAB_LOCALE = { tr: 'tr-TR', es: 'es-ES', en: 'en-US' };
function qeLabFixed(v, d) {
  return Math.abs(v).toLocaleString(QE_LAB_LOCALE[QE_LANG] || 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function qeLabSign(v, d) { return v < 0 && qeLabFixed(v, d).replace(/[^1-9]/g, '') ? '−' : ''; }
function qeLabMoneyText(abs, billions, d) {
  var t = qeLabFixed(abs, d);
  if (billions) return QE_LANG === 'en' ? '$' + t + 'B' : QE_LANG === 'es' ? t + ' mil M$' : t + ' milyar $';
  return QE_LANG === 'en' ? '$' + t + 'M' : QE_LANG === 'es' ? t + ' M$' : t + ' milyon $';
}
function labMoney(v) {
  if (v === null || v === undefined || !isFinite(v)) return '—';
  var big = Math.abs(v) >= 1000, d = big ? 1 : 0;
  return qeLabSign(big ? v / 1000 : v, d) + qeLabMoneyText(Math.abs(big ? v / 1000 : v), big, d);
}
function qeLabPct(v, d, sign) {
  var t = qeLabFixed(v, d);
  return QE_LANG === 'tr' ? sign + '%' + t : QE_LANG === 'es' ? sign + t + ' %' : sign + t + '%';
}
function qeLabTrim(t) {
  var sep = QE_LANG === 'en' ? '.' : ',';
  return t.indexOf(sep) >= 0 ? t.replace(/0+$/, '').replace(new RegExp('\\' + sep + '$'), '') : t;
}

function labFormat(v, f) {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v !== 'number' && f !== 'flag') return labL(String(v));
  switch (f) {
    case 'money_m': return labMoney(v);
    case 'pct': return isFinite(v) ? qeLabPct(v, 1, qeLabSign(v, 1)) : '—';
    case 'pts': return isFinite(v) ? (v > 0 ? '+' : qeLabSign(v, 1)) + qeLabFixed(v, 1) + ' ' + L('pts') : '—';
    case 'x': return isFinite(v) ? qeLabSign(v, 2) + qeLabTrim(qeLabFixed(v, 2)) + '×' : '—';
    case 'num': return isFinite(v) ? qeLabSign(v, 2) + qeLabTrim(qeLabFixed(v, 2)) : '—';
    case 'days': return isFinite(v) ? qeLabSign(v, 0) + qeLabFixed(v, 0) + ' ' + L('days') : '—';
    case 'flag': return v === 1 ? '✓' : v === 0 ? '✗' : '–';
    default: return labL(String(v));
  }
}

/* "Nice" axis ticks (0 / 50 / 100 / 150), as on the public site. Returns {ticks, step}. */
function qeLabNiceTicks(lo, hi, target) {
  target = target || 5;
  if (!(hi - lo > Math.max(Math.abs(hi), Math.abs(lo), 1e-300) * 1e-9)) { var p = Math.abs(hi) * 0.1 || 1; lo -= p; hi += p; }
  var raw = (hi - lo) / target, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).filter(function (s) { return s >= raw * (1 - 1e-12); })[0];
  var k0 = Math.floor(lo / step + 1e-9), k1 = Math.ceil(hi / step - 1e-9), ticks = [];
  for (var k = k0; k <= Math.min(k1, k0 + 18); k++) ticks.push(k === 0 ? 0 : +(k * step).toPrecision(12));
  if (ticks.length < 2) ticks.push(ticks[ticks.length - 1] + step);
  return { ticks: ticks, step: step };
}
function qeLabDigits(step) {
  step = Math.abs(step);
  for (var d = 0; d < 7; d++) if (Math.abs(+step.toFixed(d) - step) <= 1e-9 * Math.max(step, 1e-300)) return d;
  return 6;
}
/* Axis label: every tick in one unit, with just the decimals the step needs. */
function qeLabTickLabel(v, fmt, step, maxAbs) {
  if (Math.abs(v) < Math.abs(step) * 1e-9) v = 0;
  var d = qeLabDigits(step), sign = v < 0 ? '−' : '';
  if (fmt === 'money_m') {
    var big = Math.max(Math.abs(maxAbs || 0), Math.abs(step)) >= 1000;
    return sign + qeLabMoneyText(Math.abs(big ? v / 1000 : v), big, big ? qeLabDigits(step / 1000) : d);
  }
  if (fmt === 'pct') return qeLabPct(v, d, sign);
  if (fmt === 'x') return sign + qeLabFixed(v, d) + '×';
  if (fmt === 'pts') return (v > 0 ? '+' : sign) + qeLabFixed(v, d);
  return sign + qeLabFixed(v, d);
}
/* Greedy word wrap into at most `lines` lines of `chars` characters; the last line ends in '…' if cut. */
function qeLabWrapText(text, chars, lines) {
  var words = String(text).split(/\s+/), out = [], cur = '';
  var clip = function (t) { return t.length <= chars ? t : t.slice(0, Math.max(1, chars - 1)).replace(/\s+$/, '') + '…'; };
  for (var i = 0; i < words.length; i++) {
    var w = words[i];
    if (!cur) cur = w; else if (cur.length + 1 + w.length <= chars) cur += ' ' + w; else { out.push(cur); cur = w; }
    if (out.length === lines - 1) { out.push(clip([cur].concat(words.slice(i + 1)).join(' '))); return out.map(clip); }
  }
  if (cur) out.push(cur);
  return out.slice(0, lines).map(clip);
}

/* Source labels come from the API in English; translate the known ones and the "(filed DATE)" suffix. */
function qeLabSource(label) {
  return labL(String(label)).replace(/ 10-K XBRL instance$/, ' ' + L('10-K XBRL instance')).replace(/\(filed (\d{4}-\d{2}-\d{2})\)/, function (_, d) { return '(' + L('filed on') + ' ' + d + ')'; });
}

/* Long daily series show year-month only; ticks are spaced so labels never overlap. */
function qeLabXLabel(label, n) {
  var t = String(label);
  return n > 24 && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t.slice(0, 7) : t.slice(0, 14);
}
function qeLabXTicks(xs, width, charW, gap, endAligned) {
  var n = xs.length; if (!n) return [];
  var longest = Math.max.apply(null, xs.map(function (x) { return qeLabXLabel(x, n).length; }));
  var labelW = longest * charW, fit = Math.max(2, Math.floor(width / (labelW + gap)));
  var step = Math.max(1, Math.ceil(n / fit)), out = [];
  for (var i = 0; i < n; i += step) out.push(i);
  if (out[out.length - 1] !== n - 1) {
    if (n - 1 - out[out.length - 1] < step * 0.6) out.pop();
    out.push(n - 1);
  }
  // a right-aligned last label reaches a full label width to the left: keep the one before it clear
  var slotPx = width / n;
  while (endAligned && out.length > 2 && (n - 1 - out[out.length - 2]) * slotPx < 1.5 * labelW + gap) out.splice(out.length - 2, 1);
  return out;
}

/* SVG chart (no library): lines, grouped bars or horizontal ranges ("football field").
   Design rules: the subject company is drawn in the accent colour and the rest in grey; lines are labelled
   at their end instead of a legend; one hover readout shows every series at that point. */
function qeLabSubjectIndex(c, subjects) {
  var subj = (subjects || [])[0];
  if (!subj || (c.series || []).some(function (s) { return s.tone; })) return -1;
  if (c.series.length >= 2) {
    for (var i = 0; i < c.series.length; i++) if (String(c.series[i].name).toUpperCase() === String(subj).toUpperCase()) return i;
  }
  return -1;
}
// a number never wraps away from its unit in on-screen text ('356,60 $', '21,4 %', '% 21,4'): a no-break space
function qeLabKeepUnits(text) { return typeof text === 'string' ? text.replace(/(\d) ([%$])/g, '$1\u00a0$2').replace(/([%$]) (\d)/g, '$1\u00a0$2') : text; }
// width of a chart label in viewBox units (the SVG scales text and geometry together): measured with the page's font
// when a canvas is available, else the usual 0.6 em per character
var qeLabTextWidth = (function () {
  var ctx = null, fam = null, cache = {};
  return function (text, fs, weight) {
    text = String(text); weight = weight || 400;
    var key = fs + '|' + weight + '|' + text;
    if (cache[key] !== undefined) return cache[key];
    var w = 0;
    try {
      if (ctx === null && typeof document !== 'undefined' && document.createElement) {
        var cv = document.createElement('canvas');
        ctx = (cv && cv.getContext && cv.getContext('2d')) || false;
        fam = typeof getComputedStyle === 'function' && document.body ? getComputedStyle(document.body).fontFamily : 'sans-serif';
      }
      if (ctx) { ctx.font = weight + ' ' + fs + 'px ' + (fam || 'sans-serif'); w = ctx.measureText(text).width; }
    } catch (err) { w = 0; }
    if (!(w > 0)) w = fs * 0.6 * text.length;
    else if (typeof document !== 'undefined' && document.fonts && document.fonts.status !== 'loaded') return w;  // web font still loading: measure again later
    cache[key] = w;
    return w;
  };
})();
function LabChart(props) {
  return React.createElement(HookShell, Object.assign({}, props, { component: LabChartInner }));
}
function LabChartInner(props) {
  var c = props.chart, e = React.createElement;
  var hover = useState(-1);
  if (c.kind === 'range') return qeLabRangeChart(e, c, props);
  var isBar = c.kind === 'bar';
  var narrow = typeof window !== 'undefined' && window.innerWidth <= 600;
  var subjIdx = qeLabSubjectIndex(c, props.subjects);
  // a single bar series over company tickers (e.g. peers): highlight the subject's bar
  var subjBar = isBar && c.series.length === 1 && (props.subjects || []).length > 0 ? c.x.indexOf((props.subjects || [])[0]) : -1;
  var direct = !isBar && c.series.length >= 1 && c.series.length <= 4 && !c.series.some(function (s) { return s.tone; });
  if (direct && narrow) direct = false;  // phones: a legend instead of end labels that would run off the chart
  var W = narrow ? 360 : (props.width || 680), H = narrow ? 260 : 270, top = 18, fs = narrow ? 12 : 11, cw = fs * 0.6;
  var values = [];
  c.series.forEach(function (s) { s.values.forEach(function (v) { if (v !== null && v !== undefined && isFinite(v)) values.push(v); }); });
  if (!values.length || !c.x.length) return null;
  var lo = Math.min.apply(null, values), hi = Math.max.apply(null, values);
  if (isBar) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
  var nice = qeLabNiceTicks(lo, hi, narrow ? 4 : 5), ticks = nice.ticks, maxAbs = Math.max(Math.abs(lo), Math.abs(hi));
  lo = ticks[0]; hi = ticks[ticks.length - 1];
  var tickText = ticks.map(function (v) { return qeLabTickLabel(v, c.fmt, nice.step, maxAbs); });
  var left = 14 + cw * Math.max.apply(null, tickText.map(function (t) { return t.length; }));
  // room on the right for end-of-line labels
  var lastOf = function (s) { for (var k = s.values.length - 1; k >= 0; k--) if (s.values[k] !== null && s.values[k] !== undefined && isFinite(s.values[k])) return k; return -1; };
  var nX = Math.max(c.x.length, 1), labelRoom = W < 600 ? 120 : 170;
  var endLabels = direct ? c.series.map(function (s, si) {
    var k = lastOf(s); return k < 0 ? null : { si: si, k: k, v: s.values[k], name: labL(s.name), val: labFormat(s.values[k], c.fmt), text: labL(s.name) + ' ' + labFormat(s.values[k], c.fmt) };
  }).filter(Boolean) : [];
  // the room a label really has: from 8 units after its last point to the right edge (measured text, not a guess)
  var labelW = function (text) { return qeLabTextWidth(text, fs, 700); };
  var labelNeed = 12 + Math.max.apply(null, endLabels.map(function (l) { return labelW(l.text); }).concat([cw * 4]));
  var right0 = Math.min(labelRoom, labelNeed), slot0 = (W - left - right0) / nX;
  var roomOf = function (l) { return W - 2 - (left + slot0 * (l.k + 0.5) + 8); };
  var legendValues = false;
  if (direct && !narrow && endLabels.some(function (l) { return labelW(l.text) > roomOf(l); })) {
    if (c.series.length > 1 && subjIdx < 0) { direct = false; endLabels = []; legendValues = true; }  // a legend with the end values
    else {  // one series, or the subject against muted peers (a legend cannot tell grey lines apart): shorten the name, keep the value
      endLabels.forEach(function (l) {
        var name = l.name;
        while (name.length > 1 && labelW(l.text) > roomOf(l)) { name = name.slice(0, -1); l.text = name.replace(/\s+$/, '') + '… ' + l.val; }
      });
    }
  }
  var right = direct && !narrow ? right0 : 12;
  var n = c.x.length, slot = (W - left - right) / n;
  var barChars = Math.floor((slot - 6) / cw), wrapBars = isBar && c.x.some(function (x) { return String(x).length > barChars; }) && barChars >= 6;
  var bottom = wrapBars ? 30 + 2 * (fs + 3) : 40;
  var y = function (v) { return top + (hi - v) / (hi - lo) * (H - top - bottom); };
  var xc = function (i) { return left + slot * (i + 0.5); };
  var colorOf = function (si) {
    if (subjIdx >= 0) return si === subjIdx ? 'var(--qe-c0)' : 'var(--qe-chart-muted)';
    return qeLabSeriesStyle(c.series[si], si).css;
  };
  var kids = [];
  ticks.forEach(function (v, t) {
    var yy = y(v);
    kids.push(e('line', { key: 'g' + t, x1: left, x2: W - right, y1: yy, y2: yy, style: { stroke: 'var(--qe-chart-grid)' }, strokeDasharray: v === 0 ? null : '2 5' }));
    kids.push(e('text', { key: 't' + t, x: left - 8, y: yy + 4, style: { fill: 'var(--qe-chart-ink)' }, fontSize: fs, textAnchor: 'end' }, tickText[t]));
  });
  if (lo < 0 && hi > 0) kids.push(e('line', { key: 'zero', x1: left, x2: W - right, y1: y(0), y2: y(0), style: { stroke: 'var(--qe-chart-axis)' } }));
  if (isBar) {
    (wrapBars ? c.x.map(function (_, i) { return i; }) : qeLabXTicks(c.x, W - left - right, cw, 14, false)).forEach(function (i) {
      var x = c.x[i], lines = wrapBars ? qeLabWrapText(x, barChars, 2) : [qeLabXLabel(x, n)];
      kids.push(e('text', { key: 'x' + i, x: xc(i), y: H - bottom + 18, style: { fill: i === subjBar ? 'var(--qe-text)' : 'var(--qe-chart-ink)' }, fontWeight: i === subjBar ? 700 : 400, fontSize: fs, textAnchor: 'middle' },
        e('title', null, String(x)),
        lines.map(function (ln, li) { return e('tspan', { key: li, x: xc(i), dy: li ? fs + 3 : 0 }, ln); })));
    });
    var k = c.series.length, bw = Math.min(42, slot * 0.7 / k);
    c.series.forEach(function (s, si) {
      s.values.forEach(function (v, i) {
        if (v === null || v === undefined || !isFinite(v)) return;
        var x0 = xc(i) - bw * k / 2 + si * bw, y0 = y(Math.max(v, 0)), y1 = y(Math.min(v, 0));
        var fill = subjBar >= 0 ? (i === subjBar ? 'var(--qe-c0)' : 'var(--qe-chart-muted)') : (v < 0 && k === 1 ? 'var(--qe-chart-down)' : colorOf(si));
        kids.push(e('rect', { key: 'b' + si + '-' + i, x: x0, y: y0, width: bw - 2, height: Math.max(y1 - y0, 1), rx: 2, style: { fill: fill },
          opacity: hover[0] >= 0 && hover[0] !== i ? 0.55 : 1 }));
        // value on top of single-series bars when there is room
        if (k === 1 && n <= 12 && bw >= 22) kids.push(e('text', { key: 'bv' + i, x: x0 + (bw - 2) / 2, y: v >= 0 ? y0 - 5 : y1 + fs + 2, textAnchor: 'middle', fontSize: fs - 1,
          style: { fill: i === subjBar ? 'var(--qe-text)' : 'var(--qe-chart-ink)' }, fontWeight: i === subjBar ? 700 : 500 }, qeLabTickLabel(v, c.fmt, nice.step / 10, maxAbs)));
      });
    });
  } else {
    qeLabXTicks(c.x, W - left - right, cw, 14, true).forEach(function (i) {
      kids.push(e('text', { key: 'x' + i, x: xc(i), y: H - bottom + 18, style: { fill: 'var(--qe-chart-ink)' }, fontSize: fs, textAnchor: i === n - 1 && n > 1 ? 'end' : 'middle' }, qeLabXLabel(c.x[i], n)));
    });
    var order = c.series.map(function (_, si) { return si; });
    if (subjIdx >= 0) order.sort(function (a, b) { return (a === subjIdx) - (b === subjIdx); });  // the subject is drawn last, on top
    order.forEach(function (si) {
      var s = c.series[si], d = '', started = false, st = qeLabSeriesStyle(s, si);
      s.values.forEach(function (v, i) {
        if (v === null || v === undefined || !isFinite(v)) { started = false; return; }
        d += (started ? 'L' : 'M') + xc(i).toFixed(1) + ' ' + y(v).toFixed(1) + ' '; started = true;
      });
      var main = subjIdx < 0 || si === subjIdx;
      kids.push(e('path', { key: 'l' + si, d: d, fill: 'none', style: { stroke: colorOf(si) }, strokeOpacity: st.alpha, strokeDasharray: st.dash ? st.dash.join(' ') : undefined,
        strokeWidth: (main ? 2.4 : 1.6) * st.w, strokeLinejoin: 'round', strokeLinecap: 'round' }));
    });
    // end-of-line labels, nudged apart so they never overlap
    var placed = endLabels.map(function (l) { return { l: l, yy: y(l.v) }; }).sort(function (a, b) { return a.yy - b.yy; });
    for (var q = 1; q < placed.length; q++) if (placed[q].yy - placed[q - 1].yy < fs + 2) placed[q].yy = placed[q - 1].yy + fs + 2;
    placed.forEach(function (p) {
      var main = subjIdx < 0 || p.l.si === subjIdx;
      kids.push(e('circle', { key: 'ed' + p.l.si, cx: xc(p.l.k), cy: y(p.l.v), r: 3.2, style: { fill: colorOf(p.l.si) } }));
      kids.push(e('text', { key: 'el' + p.l.si, x: xc(p.l.k) + 8, y: p.yy + 4, fontSize: fs, fontWeight: main ? 700 : 500, style: { fill: main ? 'var(--qe-text)' : 'var(--qe-chart-ink)' } }, p.l.text));
    });
  }
  // hover readout: a column per x value
  var hi_ = hover[0];
  if (hi_ >= 0 && hi_ < n) {
    var lines = c.series.map(function (s, si) { var v = s.values[hi_]; return v === null || v === undefined || !isFinite(v) ? null : { si: si, text: labL(s.name) + ': ' + labFormat(v, c.fmt) }; }).filter(Boolean);
    var bx = xc(hi_), boxW = Math.min(W - 4, Math.max(110, qeLabTextWidth(String(c.x[hi_]), fs, 700) + 20,
      Math.max.apply(null, lines.map(function (l) { return qeLabTextWidth(l.text, fs, 400) + 33; }).concat([0])))), boxH = 22 + lines.length * (fs + 5);
    var tx = bx + 12 + boxW > W ? bx - 12 - boxW : bx + 12;
    tx = Math.max(2, Math.min(W - boxW - 2, tx));  // never past either edge of a compact chart
    if (!isBar) kids.push(e('line', { key: 'hl', x1: bx, x2: bx, y1: top, y2: H - bottom, style: { stroke: 'var(--qe-chart-axis)' }, strokeDasharray: '3 3' }));
    kids.push(e('g', { key: 'tip', pointerEvents: 'none' },
      e('rect', { x: tx, y: top, width: boxW, height: boxH, rx: 6, style: { fill: 'var(--qe-raised)', stroke: 'var(--qe-line)' } }),
      e('text', { x: tx + 10, y: top + 16, fontSize: fs, fontWeight: 700, style: { fill: 'var(--qe-text)' } }, String(c.x[hi_])),
      lines.map(function (l, li) {
        return e('g', { key: li },
          e('rect', { x: tx + 10, y: top + 24 + li * (fs + 5), width: 8, height: 8, rx: 2, style: { fill: colorOf(l.si) } }),
          e('text', { x: tx + 23, y: top + 32 + li * (fs + 5), fontSize: fs, style: { fill: 'var(--qe-text-2)' } }, l.text));
      })));
  }
  for (var hx = 0; hx < n; hx++) {
    kids.push(e('rect', { key: 'h' + hx, x: left + slot * hx, y: top, width: slot, height: H - top - bottom, fill: 'transparent',
      onMouseEnter: (function (i) { return function () { hover[1](i); }; })(hx), onMouseLeave: function () { hover[1](-1); } }));
  }
  var legend = !direct && c.series.length > 1 && !(subjIdx >= 0);
  return e('figure', { className: 'lab-chart exhibit' },
    e('figcaption', null, props.n ? e('span', { className: 'exhibit-label' }, L('Exhibit') + ' ' + props.n) : null, e('span', { className: 'exhibit-title' }, labL(c.title))),
    legend && e('div', { className: 'lab-legend' }, c.series.map(function (s, si) {
      var st = qeLabSeriesStyle(s, si), k = legendValues ? lastOf(s) : -1;
      return e('span', { key: s.name }, e('i', { style: { background: st.css, opacity: st.alpha } }), labL(s.name) + (k >= 0 ? ' ' + labFormat(s.values[k], c.fmt) : ''));
    })),
    subjIdx >= 0 && !direct && e('div', { className: 'lab-legend' }, e('span', null, e('i', { style: { background: 'var(--qe-c0)' } }), labL(c.series[subjIdx].name)),
      e('span', null, e('i', { style: { background: 'var(--qe-chart-muted)' } }), L('Others'))),
    e('div', { className: 'exhibit-body' }, e('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': labL(c.title), onMouseLeave: function () { hover[1](-1); } }, kids)),
    props.source && e('p', { className: 'exhibit-source' }, props.source));
}

/* Football field: one horizontal low–high bar per method, a vertical line at the latest price. */
function qeLabRangeChart(e, c, props) {
  var narrow = typeof window !== 'undefined' && window.innerWidth <= 600;
  var lows = (c.series[0] || { values: [] }).values, highs = (c.series[1] || { values: [] }).values;
  var marker = c.marker && isFinite(c.marker.value) ? c.marker : null;
  var vals = lows.concat(highs).filter(function (v) { return v !== null && v !== undefined && isFinite(v); });
  if (marker) vals.push(marker.value);
  if (!vals.length) return null;
  var fs = narrow ? 12 : 12, cw = fs * 0.58, n = c.x.length;
  var labelW = Math.min(narrow ? 120 : 210, 16 + cw * Math.max.apply(null, c.x.map(function (x) { return labL(String(x)).length; })));
  var W = narrow ? 360 : 680, row = 34, top = 30, bottom = 30, H = top + n * row + bottom, left = labelW + (narrow ? 8 : 52), right = narrow ? 12 : 52;
  var nice = qeLabNiceTicks(Math.min.apply(null, vals), Math.max.apply(null, vals), narrow ? 4 : 6), ticks = nice.ticks;
  var lo = ticks[0], hi = ticks[ticks.length - 1];
  var x = function (v) { return left + (v - lo) / (hi - lo) * (W - left - right); };
  var kids = [];
  ticks.forEach(function (t, k) {
    kids.push(e('line', { key: 'g' + k, x1: x(t), x2: x(t), y1: top - 6, y2: H - bottom, style: { stroke: 'var(--qe-chart-grid)' }, strokeDasharray: '2 5' }));
    kids.push(e('text', { key: 't' + k, x: x(t), y: H - bottom + 18, textAnchor: 'middle', fontSize: fs - 1, style: { fill: 'var(--qe-chart-ink)' } }, qeLabTickLabel(t, c.fmt, nice.step, Math.max(Math.abs(lo), Math.abs(hi)))));
  });
  c.x.forEach(function (name, i) {
    var a = lows[i], b = highs[i], cy = top + i * row + row / 2;
    kids.push(e('text', { key: 'n' + i, x: labelW - 4, y: cy + 4, textAnchor: 'end', fontSize: fs, style: { fill: 'var(--qe-text-2)' } }, labL(String(name))));
    if (a === null || a === undefined || b === null || b === undefined || !isFinite(a) || !isFinite(b)) return;
    var x0 = x(Math.min(a, b)), x1 = x(Math.max(a, b)), inside = marker && marker.value >= Math.min(a, b) && marker.value <= Math.max(a, b);
    kids.push(e('rect', { key: 'r' + i, x: x0, y: cy - 9, width: Math.max(x1 - x0, 3), height: 18, rx: 3, style: { fill: inside ? 'var(--qe-c0)' : 'var(--qe-chart-muted)' } },
      e('title', null, labL(String(name)) + ': ' + labFormat(Math.min(a, b), c.fmt) + ' – ' + labFormat(Math.max(a, b), c.fmt))));
    if (!narrow) {
      kids.push(e('text', { key: 'lo' + i, x: x0 - 5, y: cy + 4, textAnchor: 'end', fontSize: fs - 1.5, style: { fill: 'var(--qe-chart-ink)' } }, labFormat(Math.min(a, b), c.fmt)));
      kids.push(e('text', { key: 'hi' + i, x: x1 + 5, y: cy + 4, fontSize: fs - 1.5, style: { fill: 'var(--qe-chart-ink)' } }, labFormat(Math.max(a, b), c.fmt)));
    }
  });
  if (marker) {
    var mx = x(marker.value);
    kids.push(e('line', { key: 'mk', x1: mx, x2: mx, y1: top - 14, y2: H - bottom, style: { stroke: 'var(--qe-chart-mark)' }, strokeWidth: 2 }));
    kids.push(e('text', { key: 'mkt', x: mx, y: top - 18, textAnchor: mx > W - 120 ? 'end' : mx < left + 80 ? 'start' : 'middle', fontSize: fs, fontWeight: 700,
      style: { fill: 'var(--qe-chart-mark)' } }, labL(marker.name) + ' ' + labFormat(marker.value, c.fmt)));
  }
  return e('figure', { className: 'lab-chart exhibit' },
    e('figcaption', null, props.n ? e('span', { className: 'exhibit-label' }, L('Exhibit') + ' ' + props.n) : null, e('span', { className: 'exhibit-title' }, labL(c.title))),
    e('div', { className: 'lab-legend' }, e('span', null, e('i', { style: { background: 'var(--qe-c0)' } }), L('Range contains the latest price')),
      e('span', null, e('i', { style: { background: 'var(--qe-chart-muted)' } }), L('Range does not contain it'))),
    e('div', { className: 'exhibit-body' }, e('svg', { viewBox: '0 0 ' + W + ' ' + (H + 4), role: 'img', 'aria-label': labL(c.title) }, kids)),
    props.source && e('p', { className: 'exhibit-source' }, props.source));
}

/* "Source: SEC 10-K …; Yahoo Finance. QuantEdge calculations." under every exhibit. */
function qeLabSourceLine(res) {
  var labels = (res.sources || []).map(function (s) { return qeLabSource(s.label); });
  if (!labels.length) return '';
  return L('Source') + ': ' + labels.slice(0, 2).join('; ') + (labels.length > 2 ? '; ' + L('see Sources') : '') + '. ' + L('QuantEdge calculations.');
}

/* Long explanatory text columns ("How it is built", "Source") would stretch a table off screen: their cells become
   numbered notes listed under the table. Same text, same number. */
function qeLabNoteColumns(t) {
  return t.columns.filter(function (c, k) {
    if (k === 0 || c.fmt !== 'text') return false;
    var texts = t.rows.map(function (r) { return typeof r[c.key] === 'string' ? r[c.key] : ''; }).filter(Boolean);
    if (!texts.length) return false;
    var avg = texts.reduce(function (a, x) { return a + x.length; }, 0) / texts.length;
    return avg > 34 && Math.max.apply(null, texts.map(function (x) { return x.length; })) > 50;
  }).map(function (c) { return c.key; });
}
function LabTable(props) {
  var t = props.table, e = React.createElement;
  var numeric = function (c) { return c.fmt !== 'text' && t.rows.some(function (r) { return typeof r[c.key] === 'number'; }); };
  var noteCols = qeLabNoteColumns(t), notes = [], noteIdx = {};
  var noteOf = function (text) {
    if (!(text in noteIdx)) { notes.push(text); noteIdx[text] = notes.length; }
    return noteIdx[text];
  };
  return e('figure', { className: 'lab-table-block exhibit' },
    e('figcaption', null, props.n ? e('span', { className: 'exhibit-label' }, L('Table') + ' ' + props.n) : null, e('span', { className: 'exhibit-title' }, labL(t.title))),
    e('div', { className: 'table-wrap' }, e('table', { className: 'quarterly-table lab-table' + (t.columns.length > 3 ? ' is-cards' : '') },
      e('thead', null, e('tr', null, t.columns.map(function (c) { return e('th', { key: c.key, className: (numeric(c) ? 'num' : '') + (noteCols.indexOf(c.key) >= 0 ? ' note-col' : '') }, labL(c.label)); }))),
      e('tbody', null, t.rows.map(function (r, i) {
        return e('tr', { key: i }, t.columns.map(function (c) {
          var v = r[c.key], cls = (numeric(c) ? 'num ' : '') + (c.fmt === 'flag' ? (v === 1 ? 'up' : v === 0 ? 'down' : '') : '') + (r.ticker === 'Peer median' ? ' lab-median' : '');
          if (noteCols.indexOf(c.key) >= 0 && typeof v === 'string' && v.trim()) {
            var k = noteOf(v);
            return e('td', { key: c.key, className: cls + ' note-col', 'data-label': labL(c.label) }, e('a', { className: 'note-ref', href: '#', title: v, onClick: function (ev) { ev.preventDefault(); } }, k));
          }
          return e('td', { key: c.key, className: cls, 'data-label': labL(c.label) }, labFormat(v, c.fmt));
        }));
      })))),
    notes.length > 0 && e('ol', { className: 'table-notes' }, notes.map(function (text, k) { return e('li', { key: k }, text); })),
    props.source && e('p', { className: 'exhibit-source' }, props.source));
}

function qeLabPostLabel(kind) {
  var w = { tr: { analysis: 'Analiz: ', source: 'Kaynak: ' }, es: { analysis: 'Análisis: ', source: 'Fuente: ' }, en: { analysis: 'Analysis: ', source: 'Source: ' } };
  return (w[QE_LANG] || w.en)[kind];
}

/* LinkedIn text. With commentary (pub = {view, counter, author}) the student's view leads the data,
   and the counterargument follows it; without it the post is the findings only (kept for older callers). */
function qeLabPost(res, pub) {
  var tr = QE_LANG === 'tr', es = QE_LANG === 'es', c = qeLabCommentary(pub), call = pub && pub.call;
  var findings = res.findings.slice(c.view ? 0 : 1, 4), kills = qeCallKills(call).length;
  var build = function (withSources) {
    var lines = [];
    if (c.view) {
      lines.push(c.view, '', qeLabPostLabel('analysis') + labL(res.title) + ' · ' + res.subjects.join(', '));
    } else {
      lines.push(res.findings[0] || L(res.question), '', qeLabPostLabel('analysis') + labL(res.title) + ' · ' + res.subjects.join(', '));
    }
    findings.forEach(function (f) { lines.push('• ' + f); });
    if (c.counter) lines.push('', L('Why I might be wrong') + ': ' + c.counter);
    if (call) lines.push('');
    qeCallLines(call, kills).forEach(function (l) { lines.push(l); });
    lines.push('');
    (res.sources || []).slice(0, withSources).forEach(function (s) { lines.push(qeLabPostLabel('source') + qeLabSource(s.label)); if (s.url) lines.push(s.url); });
    if (withSources) lines.push('');
    lines.push(res.disclaimer ? labL(res.disclaimer) : labL('Educational analysis; not investment advice.'));
    var tags = tr ? '#Finans #HisseAnalizi' : es ? '#Finanzas #AnálisisFinanciero' : '#EquityResearch #FinancialAnalysis';
    lines.push(tags + ' ' + res.subjects.slice(0, 4).map(function (s) { return '#' + String(s).replace(/[^A-Za-z0-9]/g, ''); }).join(' ') + ' #QuantEdge');
    return lines.join('\n');
  };
  // LinkedIn's limit is 3000 characters: drop data bullets first (with a call, all of them), then extra kill
  // criteria and sources beyond the first; the thesis, the risks paragraph and the view line always stay.
  var text = build(3), sources = 3;
  while (text.length > 3000 && findings.length > 1) { findings.pop(); text = build(sources); }
  while (text.length > 3000 && call && findings.length) { findings.pop(); text = build(sources); }
  while (text.length > 3000 && call && kills > 1) { kills--; text = build(sources); }
  while (text.length > 3000 && call && sources > 1) { sources--; text = build(sources); }
  return text;
}

/* 1200×627 PNG card: title, subjects, first chart, three findings, source and date. */
function qeDrawLabCard(canvas, res, author) {
  var W = 1200, H = 627, S = 2, c = canvas.getContext('2d'), font = qeLabFont;
  canvas.width = W * S; canvas.height = H * S; c.setTransform(S, 0, 0, S, 0, 0);
  var g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#081626'); g.addColorStop(1, '#0d2236');
  c.fillStyle = g; c.fillRect(0, 0, W, H); c.strokeStyle = '#24425a'; c.lineWidth = 2; c.strokeRect(1, 1, W - 2, H - 2);
  c.textAlign = 'left';
  c.fillStyle = '#43d9d2'; c.font = font(18, 800); c.fillText('QuantEdge · ' + L('Analysis Lab'), 56, 58);
  c.fillStyle = '#f5faff'; c.font = font(38, 800); c.fillText(labL(res.title), 56, 112);
  c.fillStyle = '#9bb1c6'; c.font = font(20, 600); c.fillText(res.subjects.join(' · ').slice(0, 70), 56, 146);
  var ch = (res.charts || [])[0];
  if (ch) {
    c.fillStyle = '#9bb1c6'; c.font = font(15, 700); c.fillText(labL(ch.title).slice(0, 60), 56, 176);
    qeLabDrawChart(c, ch, 56, 190, 620, 520, { labelSize: 13 });
  }
  var FX = ch ? 660 : 56, FW = W - FX - 56, fy = 210;
  c.fillStyle = '#43d9d2'; c.font = font(15, 800); c.fillText(L('KEY FINDINGS'), FX, 190);
  (res.findings || []).slice(0, 3).forEach(function (f) {
    c.fillStyle = '#e8f1fa'; c.font = font(19, 600);
    fy = qeLabWrap(c, f, FX, fy, FW, 26, 4) + 14;
  });
  c.fillStyle = '#7f97ad'; c.font = font(14, 500);
  var src = (res.sources || [])[0], who = author ? L('By') + ' ' + author + ' · ' : '';
  c.fillText((who + (src ? qeLabSource(src.label) + ' · ' : '') + res.asof + ' · ' + L('Not investment advice')).slice(0, 140), 56, H - 36);
  return canvas;
}

/* The result as a research note: header, Summary, Thesis, numbered exhibits with source lines,
   Risks to the view, then method, sources and disclaimer. The thesis and risks come from the
   publish panel below (props.view / props.counter) and appear here as the student types. */
function LabResult(props) {
  var r = props.res, e = React.createElement, source = qeLabSourceLine(r);
  var view = String(props.view || '').trim(), counter = String(props.counter || '').trim();
  var write = props.onWrite && e('button', { type: 'button', className: 'tiny-link', onClick: props.onWrite }, L('Write it in step 1') + ' ↓');
  var cards = (r.highlights || []).filter(function (h) { return h && h.value; });
  var toc = [['lab-sec-summary', L('Summary')], ['lab-sec-thesis', L('Thesis')]];
  if ((r.charts || []).length) toc.push(['lab-sec-exhibits', L('Charts') + ' (' + r.charts.length + ')']);
  if ((r.tables || []).length) toc.push(['lab-sec-tables', L('Tables') + ' (' + r.tables.length + ')']);
  toc.push(['lab-sec-risks', L('Risks to the view')], ['lab-sec-method', L('Method and limits')], ['lab-sec-sources', L('Sources')]);
  var jump = function (id) { return function (ev) { ev.preventDefault(); var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; };
  return e('article', { className: 'lab-result lab-note', 'aria-label': labL(r.title) },
    e('header', { className: 'note-head' },
      e('div', { className: 'note-kicker' }, L('Research note')),
      e('h3', { className: 'note-title' }, labL(r.title)),
      e('div', { className: 'note-meta' },
        e('span', { className: 'note-tickers' }, r.subjects.map(function (t) { return e('span', { key: t, className: 'ticker-tag' }, t); })),
        e('span', null, L('Data as of') + ' ' + qeDate(r.asof)),
        props.author && e('span', null, L('Prepared by') + ' ' + props.author)),
      r.point_in_time && e('p', { className: 'pit-badge' }, '⏱ ' + L('Point in time') + ': ' + qeDate(r.point_in_time)),
      qeLabQualityView(e, r.quality)),
    cards.length > 0 && e('dl', { className: 'kpi-strip', 'aria-label': L('Key numbers') }, cards.map(function (h, i) {
      return e('div', { key: i, className: 'kpi' + (h.tone ? ' is-' + h.tone : '') },
        e('dt', null, labL(h.label)), e('dd', { className: 'kpi-value' }, h.value), h.note ? e('dd', { className: 'kpi-note' }, h.note) : null);
    })),
    e('div', { className: 'note-grid' },
      e('div', { className: 'note-body' },
        e('section', { className: 'note-summary lab-findings', id: 'lab-sec-summary' },
          e('h4', null, L('Summary')),
          e('ul', null, r.findings.map(function (f, i) { return e('li', { key: i }, qeLabKeepUnits(f)); }))),
        e('section', { className: 'note-callout note-thesis' + (view ? '' : ' is-empty'), id: 'lab-sec-thesis' },
          e('h4', null, L('Thesis')),
          view ? e('p', null, view) : e('p', { className: 'note-placeholder' }, L('Your view goes here. It leads the LinkedIn post and the public page.'), ' ', write)),
        (r.warnings || []).map(function (w, i) { return e(Notice, { key: 'w' + i, type: 'amber' }, w); }),
        (r.charts || []).length > 0 && e('div', { className: 'lab-charts', id: 'lab-sec-exhibits' }, r.charts.map(function (c, i) { return e(LabChart, { key: i, chart: c, n: i + 1, source: source, subjects: r.subjects }); })),
        (r.tables || []).length > 0 && e('div', { className: 'lab-tables', id: 'lab-sec-tables' }, r.tables.map(function (t, i) { return e(LabTable, { key: t.key, table: t, n: i + 1, source: source }); })),
        e('section', { className: 'note-callout note-risks' + (counter ? '' : ' is-empty'), id: 'lab-sec-risks' },
          e('h4', null, L('Risks to the view')),
          counter ? e('p', null, counter) : e('p', { className: 'note-placeholder' }, L('Where could you be wrong? Your counterargument appears here.'), ' ', write)),
        e('footer', { className: 'note-foot' },
          e('div', { className: 'lab-notes', id: 'lab-sec-method' },
            e('h4', null, L('Method and limits')),
            r.notes.map(function (n, i) { return e('p', { key: i }, qeLabKeepUnits(n)); }),
            r.fingerprint && e('p', { className: 'micro muted fingerprint' }, L('Data fingerprint (SHA-256)') + ': ', e('code', null, r.fingerprint)),
            qeLabDataMapView(e, r.quality && r.quality.data_map)),
          e('div', { className: 'lab-sources', id: 'lab-sec-sources' },
            e('h4', null, L('Sources')),
            e('ol', null, (r.sources || []).map(function (s, i) {
              return e('li', { key: i }, s.url ? e('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, qeLabSource(s.label) + ' ↗') : qeLabSource(s.label));
            }))),
          e('p', { className: 'note-disclaimer' }, labL(r.disclaimer)))),
      e('aside', { className: 'note-rail', 'aria-label': L('Contents') },
        e('p', { className: 'rail-title' }, L('Contents')),
        e('ol', null, toc.map(function (t) { return e('li', { key: t[0] }, e('a', { href: '#' + t[0], onClick: jump(t[0]) }, t[1])); })),
        props.onWrite && e('button', { type: 'button', className: 'btn primary rail-publish', onClick: props.onWrite }, L('Write & publish') + ' ↓'))));
}

/* Accent-insensitive lower-case text for the analysis search (TR İ/ı, ş, ç…). */
function qeLabFold(text) {
  return String(text || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').trim();
}

/* While an analysis runs: the steps it goes through (revealed over time with CSS) and a skeleton of the note. */
function qeLabProgress(e, spec) {
  var steps = [];
  if (spec && spec.uses_sec !== false) steps.push(L('Downloading SEC filings'));
  steps.push(L('Reading price history'), L('Calculating'), L('Writing the research note'));
  return e('div', { className: 'lab-progress', role: 'status', 'aria-live': 'polite' },
    e('ol', { className: 'lab-steps' }, steps.map(function (t, i) { return e('li', { key: i, style: { animationDelay: (i * 5) + 's' } }, e('span', { className: 'dot', 'aria-hidden': 'true' }), t); })),
    e('p', { className: 'micro muted' }, L('The first run for a company downloads its filings and can take up to a minute; later runs use the saved copy.')),
    e('div', { className: 'lab-skeleton', 'aria-hidden': 'true' }, e('i', { className: 'sk-title' }), e('div', { className: 'sk-kpis' }, e('i'), e('i'), e('i')), e('i'), e('i'), e('i', { className: 'sk-chart' })));
}

/* Step 1, "Your view": no explicit view (default) or a stance relative to a benchmark, with a horizon,
   an optional proof metric and 1–6 risks with kill criteria. draft = qeCallDraft(...), set(patch). */
function qeCallEditor(e, draft, res, check, set, touched, touch, noise) {
  var subject = qeCallSubject(draft, res), bench = qeCallBenchmark(draft, res);
  touched = touched || {};
  /* Blocking hints show under a field only once the student has worked on it (the locked message in step 2 still lists
     them all); soft notes (e.g. an already reported fiscal year) show as soon as they apply. */
  var group = { horizon: 'horizon', metric: 'metric', risks: 'risks', kill: 'risks' };
  var hintsFor = function (field) {
    var hard = touched[group[field]] ? check.hints.filter(function (h) { return h.field === field; }) : [];
    var soft = (check.notes || []).filter(function (h) { return h.field === field; });
    return hard.map(function (h, i) { return e('p', { key: field + i, className: 'micro call-hint', role: 'status' }, h.text); })
      .concat(soft.map(function (h, i) { return e('p', { key: field + 'n' + i, className: 'micro call-note', role: 'status' }, h.text); }));
  };
  var oneLine = function (t) { return String(t).replace(/\s*\n\s*/g, ' '); };
  var cap = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };
  var setRisk = function (k, patch) {
    touch && touch('risks');
    set({ risks: draft.risks.map(function (r, i) { return i === k ? Object.assign({}, r, patch) : r; }) });
  };
  var setMetric = function (patch) { touch && touch('metric'); set({ metric: Object.assign({}, draft.metric, patch) }); };
  var levelSelect = function (k, field, label) {
    return e('label', { className: 'form-label call-level' }, label,
      e('select', { value: draft.risks[k][field], onChange: function (ev) { var p = {}; p[field] = ev.target.value; setRisk(k, p); } },
        QE_CALL_LEVELS.map(function (v) { return e('option', { key: v, value: v }, qeCallLevel(v, field)); })));
  };
  var chosen = draft.stance !== 'none', subjects = (res && res.subjects) || [];
  var unitName = { '%': '%', '$M': L('$ million'), x: '×', '': L('no unit') };
  return e('fieldset', { className: 'call-block' + (chosen ? ' is-open' : '') },
    e('legend', null, L('Your view') + ' · ' + L('optional')),
    e('p', { className: 'micro muted' }, L('Over the next 6–24 months, do you expect the company’s shares to do better than, about the same as, or worse than an index? Say what would make you drop that view. This is a relative expectation, not a buy/sell recommendation or a price target.')),
    e('div', { className: 'call-stances', role: 'radiogroup', 'aria-label': L('Your view') },
      [['none', L('No explicit view')]].concat(QE_CALL_STANCES.map(function (s) { return [s, cap(qeCallStanceLabel(s, bench))]; })).map(function (o) {
        return e('button', { key: o[0], type: 'button', role: 'radio', 'aria-checked': draft.stance === o[0],
          className: 'call-stance ' + o[0] + (draft.stance === o[0] ? ' is-selected' : ''), onClick: function () { set({ stance: o[0] }); } }, o[1]);
      })),
    chosen && e('div', { className: 'call-body' },
      e('div', { className: 'call-grid' },
        subjects.length > 1 && e('label', { className: 'form-label' }, L('Company'),
          e('select', { value: subject, onChange: function (ev) { set({ subject: ev.target.value }); } }, subjects.map(function (t) { return e('option', { key: t, value: t }, t); }))),
        e('label', { className: 'form-label' }, L('Benchmark index'),
          e('select', { value: bench, onChange: function (ev) { set({ benchmark: ev.target.value }); } },
            QE_CALL_BENCHMARKS.map(function (b) { return e('option', { key: b, value: b }, qeCallBenchName(b) + ' (' + b + ')'); }))),
        e('div', { className: 'form-label' }, e('span', null, L('Horizon')),
          e('div', { className: 'call-seg', role: 'radiogroup', 'aria-label': L('Horizon') }, QE_CALL_HORIZONS.map(function (h) {
            return e('button', { key: h, type: 'button', role: 'radio', 'aria-checked': draft.horizon_months === h, className: draft.horizon_months === h ? 'is-selected' : '',
              onClick: function () { touch && touch('horizon'); set({ horizon_months: h }); } }, h + ' ' + L('months'));
          })),
          hintsFor('horizon'))),
      qeNoiseNode(e, noise, bench),
      e('div', { className: 'call-metric' },
        e('div', { className: 'label-row' }, e('strong', null, L('Proof metric') + ' · ' + L('optional')), e('span', { className: 'micro muted' }, L('The one number that would prove you right.'))),
        e('div', { className: 'call-metric-row' },
          e('input', { className: 'call-metric-label', 'aria-label': L('Metric'), maxLength: QE_CALL_LIMITS.metric[1], value: draft.metric.label, placeholder: L('Example: FY2027 operating margin'),
            onChange: function (ev) { setMetric({ label: ev.target.value }); } }),
          e('select', { 'aria-label': L('Comparison'), value: draft.metric.comparator, onChange: function (ev) { setMetric({ comparator: ev.target.value }); } },
            QE_CALL_COMPARATORS.map(function (c) { return e('option', { key: c, value: c }, QE_CALL_CMP_SIGNS[c]); })),
          e('input', { className: 'call-metric-target', 'aria-label': L('Threshold'), title: L('Threshold'), inputMode: 'decimal', maxLength: 16, value: draft.metric.target, placeholder: '30',
            onChange: function (ev) { setMetric({ target: ev.target.value }); } }),
          e('select', { 'aria-label': L('Unit'), value: draft.metric.unit, onChange: function (ev) { setMetric({ unit: ev.target.value }); } },
            QE_CALL_UNITS.map(function (u) { return e('option', { key: u || 'none', value: u }, unitName[u]); }))),
        hintsFor('metric')),
      e('div', { className: 'call-risks' },
        e('div', { className: 'label-row' }, e('strong', null, L('Risks and kill criteria')), e('span', { className: 'micro muted' }, draft.risks.length + ' / ' + QE_CALL_MAX_RISKS)),
        draft.risks.map(function (r, k) {
          return e('div', { key: k, className: 'call-risk' },
            e('span', { className: 'call-risk-num', 'aria-hidden': 'true' }, k + 1),
            e('div', { className: 'call-risk-fields' },
              e('textarea', { className: 'call-text', rows: 2, 'aria-label': L('Risk') + ' ' + (k + 1), maxLength: QE_CALL_LIMITS.risk[1], value: r.text, placeholder: L('Example: Cloud price competition squeezes margins'),
                onChange: function (ev) { setRisk(k, { text: oneLine(ev.target.value) }); } }),
              e('div', { className: 'call-risk-levels' }, levelSelect(k, 'probability', L('Probability')), levelSelect(k, 'impact', L('Impact'))),
              e('textarea', { className: 'call-text', rows: 2, 'aria-label': L('I drop the view if…') + ' ' + (k + 1), maxLength: QE_CALL_LIMITS.kill, value: r.kill, placeholder: L('Example: segment growth stays below 10% for two quarters in a row'),
                onChange: function (ev) { setRisk(k, { kill: oneLine(ev.target.value) }); } })),
            draft.risks.length > 1 && e('button', { type: 'button', className: 'tiny-link call-remove', 'aria-label': L('Remove risk') + ' ' + (k + 1),
              onClick: function () { set({ risks: draft.risks.filter(function (_, i) { return i !== k; }) }); } }, L('Remove')));
        }),
        draft.risks.length < QE_CALL_MAX_RISKS && e('button', { type: 'button', className: 'tiny-link', onClick: function () { set({ risks: draft.risks.concat([qeCallEmptyRisk()]) }); } }, '+ ' + L('Add risk')),
        hintsFor('risks'), hintsFor('kill')),
      e('p', { className: 'micro call-disclaimer' }, qeCallDisclaimer())));
}

/* The relative noise band under the stance and horizon (loading / ok / failed); null until both are chosen. */
function qeNoiseNode(e, noise, bench) {
  var v = qeNoiseView(noise, bench);
  if (!v) return null;
  return e('div', { className: 'call-noise ' + v.cls, role: 'status', 'aria-live': 'polite' },
    e('strong', null, L('Noise band')),
    v.lines.map(function (t, i) { return e('p', { key: i, className: i === 0 ? 'call-noise-main' : 'micro muted' }, t); }));
}

// a request the browser could not send (server stopped, network down) reads as a sentence, not 'Failed to fetch'
function qeLabNetError(x) {
  var m = String((x && x.message) || x || '');
  return /failed to fetch|load failed|networkerror|network request failed/i.test(m) ? 'Could not reach the local QuantEdge server. Is it still running?' : m;
}
function AnalysisLab(props) {
  var e = React.createElement;
  var st = {
    catalog: useState(null), selected: useState(''), tickers: useState(''), params: useState({}), busy: useState(false),
    error: useState(''), res: useState(null), copied: useState(false), message: useState(''), showPost: useState(false),
    view: useState(''), counter: useState(''), flags: useState([]), carousel: useState(null), building: useState(false),
    siteBusy: useState(false), siteMsg: useState(null), menuOpen: useState(false), call: useState(qeCallDraft(null)),
    callTouched: useState({}), noise: useState(null), menuFilter: useState(''), menuTab: useState(qeLabTakeTab), evds: useState({ stored: null, key: '', msg: '' }), asof: useState('')
  };
  var flagEpoch = useMemo(function () { return { current: 0 }; }, []);
  var selRef = useMemo(function () { return { cur: '' }; }, []);  // read by late callbacks of the options desk
  var runEpoch = useMemo(function () { return { current: 0 }; }, []);  // bumped by every run and every change of analysis
  selRef.cur = st.selected[0];
  var catalog = st.catalog[0], selected = st.selected[0], res = st.res[0];
  function loadCatalog() {
    st.error[1]('');
    request(API + '/lab/catalog').then(function (d) { st.catalog[1](d.analyses || []); }).catch(function (x) { st.error[1](qeLabNetError(x)); });
  }
  useEffect(function () { loadCatalog(); }, []);
  var spec = (catalog || []).find(function (a) { return a.id === selected; });
  var focus = props.focus || '';  // one analysis on a page of its own (the Options tab): no list, full width
  useEffect(function () {
    if (!focus || !catalog || selected) return;
    var a = catalog.find(function (x) { return x.id === focus; });
    if (a) choose(a, true);
  });
  function choose(a, quiet) {
    runEpoch.current++; st.busy[1](false);  // a run still out for the previous analysis is dropped when it answers
    st.selected[1](a.id); st.menuOpen[1](false); st.menuTab[1](a.group); st.tickers[1]((a.example || []).join(', '));  // the tabs follow the chosen analysis's group
    var p = {}; Object.keys(a.params || {}).forEach(function (k) { p[k] = a.params[k] === null ? '' : a.params[k]; });
    st.params[1](p); st.res[1](null); st.error[1](''); st.message[1](''); st.showPost[1](false);
    if (!quiet) setTimeout(function () { var m = document.querySelector('.lab-main'); if (m) m.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  }
  function run(over) {
    if (!spec) return;
    over = over && over.tickers ? over : null;  // the options desk passes its own ticker and parameters
    var list = String(over ? over.tickers : st.tickers[0]).split(/[\s,;]+/).map(function (t) { return t.trim().toUpperCase(); }).filter(Boolean);
    var src = over && over.params ? over.params : st.params[0];
    var params = {};
    Object.keys(src).forEach(function (k) {
      var v = src[k] === null || src[k] === undefined ? '' : src[k];
      params[k] = v === '' ? null : (QE_LAB_TEXT_PARAMS[k] ? String(v).trim() : Number(v));
    });
    st.busy[1](true); st.error[1](''); st.res[1](null); st.message[1](''); st.showPost[1](false);
    var body = { analysis: spec.id, tickers: list, params: params, contact_email: (props.contactEmail || '').trim(), language: QE_LANG,
      asof: spec.supports_asof !== false ? st.asof[0] : '' };
    var epoch = ++runEpoch.current;
    var show = function (sel) { setTimeout(function () { var el = document.querySelector(sel); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150); };
    post(API + '/lab/run', body)
      .then(function (d) {
        if (epoch !== runEpoch.current) return;  // another analysis was chosen, or another run started, meanwhile
        if (d && typeof d === 'object') Object.defineProperty(d, '__request', { value: body, enumerable: false });
        st.res[1](d);
        if (over) show('.lab-result');
      })
      .catch(function (x) {
        if (epoch !== runEpoch.current) return;
        st.error[1](x.message || String(x));
        if (over) show('.lab-run-error');  // started from the desk, far above: bring the message into view
      })
      .then(function () { if (epoch === runEpoch.current) st.busy[1](false); });
  }
  var author = (props.report && props.report.author) || '';
  var callDraft = st.call[0], callCheck = qeCallCheck(callDraft, res);
  var commentary = qeLabCommentary({ view: st.view[0], counter: st.counter[0], author: author });
  var ready = commentary.ok && callCheck.ok;  // a chosen view must also be complete (horizon, a kill criterion, a valid metric)
  var callBody = res && ready ? qeCallBody(callDraft, res) : null, callKey = JSON.stringify(callBody);
  // the carousel's view slide also shows the noise band the panel measured (the POST body sends callBody without it:
  // the server computes and stores its own band)
  var noiseOk = st.noise[0] && st.noise[0].status === 'ok' ? st.noise[0].data : null;
  var pub = { view: st.view[0], counter: st.counter[0], author: author, call: callBody && noiseOk ? Object.assign({}, callBody, { noise: noiseOk }) : callBody };
  var draftKey = res ? 'qe.lab.draft.' + res.id + '.' + res.subjects.join('-') : '';
  useEffect(function () {  // a saved draft for the same analysis and tickers comes back
    if (!draftKey) return;
    var saved = null;
    try { saved = JSON.parse(window.localStorage.getItem(draftKey) || 'null'); } catch (_) {}
    st.view[1](saved && saved.view || ''); st.counter[1](saved && saved.counter || ''); st.call[1](qeCallDraft(saved && saved.call)); st.callTouched[1]({}); st.carousel[1](null); st.siteMsg[1](null);
  }, [draftKey]);
  function setDraft(field, value) {  // field: 'view' | 'counter' | 'call' (the whole call draft)
    st[field][1](value); st.carousel[1](null); st.copied[1](false); st.siteMsg[1](null);  // edited text can be added again
    var next = { view: field === 'view' ? value : st.view[0], counter: field === 'counter' ? value : st.counter[0], call: field === 'call' ? value : st.call[0] };
    try { window.localStorage.setItem(draftKey, JSON.stringify(next)); } catch (_) {}
  }
  function setCall(patch) { setDraft('call', Object.assign({}, st.call[0], patch)); }
  var noiseQuery = qeNoiseQuery(callDraft, res), noiseKey = noiseQuery ? JSON.stringify(noiseQuery) : '';
  var noiseEpoch = useMemo(function () { return { current: 0 }; }, []);
  useEffect(function () {  // the relative noise band of the chosen stance + horizon; informative only, never blocks publishing
    var id = ++noiseEpoch.current;
    if (!noiseQuery) { st.noise[1](null); return; }
    st.noise[1]({ status: 'loading' });
    request(API + qeNoiseUrl(noiseQuery))
      .then(function (d) { if (id === noiseEpoch.current) st.noise[1]({ status: 'ok', data: d }); })
      .catch(function (x) { if (id === noiseEpoch.current) st.noise[1]({ status: 'failed', error: x && x.message }); });
  }, [noiseKey]);
  function touchCall(field) { if (!st.callTouched[0][field]) { var t = Object.assign({}, st.callTouched[0]); t[field] = true; st.callTouched[1](t); } }
  useEffect(function () {  // wording hints, as in the LinkedIn composer; never blocks publishing
    var id = ++flagEpoch.current, text = st.view[0] + '\n' + st.counter[0] + qeCallClaimText(st.call[0]);
    if (!text.trim()) { st.flags[1]([]); return; }
    post(API + '/research/claim-check', { text: text, language: QE_LANG }).then(function (d) { if (id === flagEpoch.current) st.flags[1](d.flags || []); }).catch(function () {});
  }, [st.view[0], st.counter[0], qeCallClaimText(st.call[0]), QE_LANG]);
  var postText = useMemo(function () { return res && ready ? qeLabPost(res, pub) : ''; }, [res, QE_LANG, ready, st.view[0], st.counter[0], author, callKey]);
  var cardUrl = useMemo(function () {
    if (!res || !ready) return '';
    try { var cv = document.createElement('canvas'); qeDrawLabCard(cv, res, author); return cv.toDataURL('image/png'); } catch (_) { return ''; }
  }, [res, QE_LANG, ready, author]);
  function buildCarousel() {
    if (!res || !ready) return;
    st.building[1](true);
    setTimeout(function () {  // let the button show its busy state before the canvas work
      try {
        var out = qeLabCarousel(res, pub, function () { return document.createElement('canvas'); });
        var url = URL.createObjectURL(new Blob([out.pdf], { type: 'application/pdf' }));
        var a = document.createElement('a');
        a.href = url; a.download = 'QuantEdge_' + res.id + '_' + res.subjects.join('-').slice(0, 30) + '_carousel.pdf';
        document.body.appendChild(a); a.click(); a.remove();
        st.carousel[1]({ url: url, previews: out.previews, bytes: out.pdf.length });
      } catch (x) { st.message[1](L('The carousel could not be drawn in this browser.') + ' ' + (x.message || '')); }
      st.building[1](false);
    }, 30);
  }
  function exportXlsx() {  // the same request as the result on screen, returned as a spreadsheet
    if (!res || !res.__request || st.busy[0]) return;
    st.message[1](L('Preparing the spreadsheet…'));
    post(API + '/lab/export.xlsx', res.__request).then(function (blob) {
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = 'QuantEdge_' + res.id + '_' + res.subjects.join('-').slice(0, 30) + '.xlsx';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      st.message[1](res.id === 'dcf' ? L('Spreadsheet saved. The Model sheet is built from formulas: change the yellow cells to test your assumptions.') : L('Spreadsheet saved: one sheet per table.'));
    }).catch(function (x) { st.message[1](x.message || String(x)); });
  }
  function addToNotes() {
    var block = '\n\n' + labL(res.title).toUpperCase() + ' · ' + res.subjects.join(', ') + ' · ' + res.asof + '\n' +
      res.findings.map(function (f) { return '• ' + f; }).join('\n') + '\n' +
      (commentary.view ? L('What I think') + ': ' + commentary.view + '\n' : '') +
      (commentary.counter ? L('Why I might be wrong') + ': ' + commentary.counter + '\n' : '') +
      qeCallLines(callBody).map(function (l) { return l + '\n'; }).join('') +
      (res.sources || []).map(function (s) { return L('Source') + ': ' + qeLabSource(s.label) + (s.url ? ' ' + s.url : ''); }).join('\n');
    if (((props.report && props.report.notes) || '').length + block.length > 8000) { st.message[1](L('Report notes are full; shorten them before adding the comparison.')); return; }
    props.setReport(function (r) { return Object.assign({}, r, { notes: (r.notes || '') + block }); });
    st.message[1](L('Added to your report notes.'));
  }
  /* Public site: an immutable snapshot of this result, in the words shown on screen, plus the student's commentary. */
  var siteLock = useMemo(function () { return { busy: false }; }, []);
  function addToSite() {
    if (!res || !ready || siteLock.busy) return;
    siteLock.busy = true; st.siteBusy[1](true); st.siteMsg[1](null);
    post(API + '/lab/publications', qeLabPublicationBody(res, commentary, callBody))
      .then(function () { st.siteMsg[1]({ ok: true, text: L('Added to your public site.') }); })
      .catch(function (x) { st.siteMsg[1]({ ok: false, text: L(x.message || String(x)) }); })
      .then(function () { siteLock.busy = false; st.siteBusy[1](false); });
  }
  function copy() {
    navigator.clipboard.writeText(postText).then(function () { st.copied[1](true); }).catch(function () { st.message[1](L('Automatic copying is blocked in this browser. Select the text below and copy with Command+C.')); });
  }
  function goWrite() {
    var el = document.getElementById('lab-step-write');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { var t = document.getElementById('lab-view-input'); if (t) t.focus({ preventScroll: true }); }, 350);
  }
  var groupName = function (id) { return L((QE_LAB_GROUPS.find(function (g) { return g[0] === id; }) || [0, ''])[1]); };
  var locked = !ready;
  function output(key, title, desc, action) {
    return e('div', { key: key, className: 'output-card' + (locked ? ' is-locked' : '') },
      e('div', { className: 'output-text' }, e('strong', null, title), e('small', null, desc)), action);
  }
  return e('div', { className: 'lab-layout' + (focus ? ' is-focus' : '') },
    // phones: once an analysis is chosen the list folds into one line, so the form and the note come first
    spec && !focus && e('button', { type: 'button', className: 'lab-menu-toggle', 'aria-expanded': st.menuOpen[0], onClick: function () { st.menuOpen[1](!st.menuOpen[0]); } },
      e('span', null, L('Analysis') + ': ', e('strong', null, L(spec.title))), e('span', { className: 'tiny-link' }, st.menuOpen[0] ? L('Close list') : L('Change analysis'))),
    // v0.13.5: the analyses above the result: category tabs (filter buttons) with counts, a search box, and a card grid
    !focus && e('section', { className: 'panel lab-menu' + (spec && !st.menuOpen[0] ? ' is-folded' : ''), 'aria-label': L('Analyses') },
      catalog && e('div', { className: 'lab-menu-bar' },
        e('div', { className: 'lab-tabs', role: 'group', 'aria-label': L('Analysis groups') },
          [['all', 'All']].concat(QE_LAB_GROUPS).map(function (g) {
            var n = g[0] === 'all' ? catalog.length : catalog.filter(function (a) { return a.group === g[0]; }).length;
            var on = !st.menuFilter[0] && st.menuTab[0] === g[0];
            return e('button', { key: g[0], type: 'button', className: 'lab-tab g-' + g[0] + (on ? ' is-on' : ''), 'aria-pressed': on,
              onClick: function () { st.menuTab[1](g[0]); st.menuFilter[1](''); } }, g[0] !== 'all' && e('i', { className: 'lab-tab-dot', 'aria-hidden': 'true' }), L(g[1]), e('span', { className: 'lab-tab-count' }, n));
          })),
        e('label', { className: 'lab-menu-search' },
          e('span', { className: 'sr-only' }, L('Find an analysis')),
          e('input', { type: 'search', value: st.menuFilter[0], placeholder: L('Find an analysis: DCF, insider, quarter…'), onChange: function (ev) { st.menuFilter[1](ev.target.value); } }))),
      !catalog ? (st.error[0] ? null : e('p', { className: 'micro muted' }, L('Loading…'))) :
      (function () {
        var q = qeLabFold(st.menuFilter[0]), tab = q ? 'all' : st.menuTab[0];  // a search looks through every group
        var groups = QE_LAB_GROUPS.filter(function (g) { return tab === 'all' || g[0] === tab; }).map(function (g) {
          return [g, catalog.filter(function (a) { return a.group === g[0] && (!q || qeLabFold(a.number + ' ' + L(a.title) + ' ' + L(a.question) + ' ' + a.title).indexOf(q) >= 0); })
            .sort(function (x, y) { return x.number - y.number; })];
        }).filter(function (x) { return x[1].length; });
        if (!groups.length) return e('p', { className: 'micro muted lab-none' }, L('No analysis matches this search.'));
        return groups.map(function (x) {
          var g = x[0], items = x[1];
          return e('div', { key: g[0], className: 'lab-group g-' + g[0], role: 'group', 'aria-label': L(g[1]) },
            e('div', { className: 'lab-group-title' }, e('span', null, e('i', { className: 'lab-tab-dot', 'aria-hidden': 'true' }), L(g[1])), e('span', { className: 'lab-group-count' }, items.length)),
            !q && e('p', { className: 'lab-group-blurb' }, L(QE_LAB_GROUP_BLURB[g[0]])),
            e('div', { className: 'lab-cards' }, items.map(function (a) {
              var badges = qeLabBadges(a);
              return e('button', { key: a.id, type: 'button', className: 'lab-item g-' + a.group + (a.id === 'options_lab' ? ' is-featured' : '') + (a.id === selected ? ' is-selected' : ''), 'aria-pressed': a.id === selected, title: L(a.question), onClick: function () { choose(a); } },
                e('span', { className: 'lab-icon' }, qeLabGlyph(a.id)),
                e('span', { className: 'lab-item-text' }, e('span', { className: 'lab-item-num' }, '#' + a.number), e('strong', null, L(a.title)), e('small', null, L(a.question)),
                  badges.length > 0 && e('span', { className: 'lab-badges' }, badges.map(function (b, i) { return e('span', { key: i, className: 'lab-badge' + (b[0] ? ' is-' + b[0] : '') }, b[0] === 'live' && e('i', { 'aria-hidden': 'true' }), b[1]); }))));
            })));
        });
      })()),
    e('section', { className: 'panel lab-main' },
      !spec ? (!catalog && st.error[0] ? e(Group, null, e(Notice, { type: 'amber' }, L(st.error[0])), e(Button, { icon: 'refresh', onClick: loadCatalog }, L('Try again'))) :
        focus ? e('p', { className: 'micro muted' }, L('Loading…')) : e(Blank, { title: L('Pick an analysis'), copy: L('Choose one of the analyses above. Each one answers a single question with SEC filings and historical prices, and shows its sources.') })) :
      e(Group, null,
        e('div', { className: 'lab-spec-head' },
          e('div', { className: 'lab-kicker' }, focus ? L('Analysis #{n} · also in the Analysis Lab').replace('{n}', spec.number) : L('Analysis') + ' ' + spec.number + ' · ' + groupName(spec.group)),
          e('h2', null, L(spec.title)),
          e('p', { className: 'lab-question' }, L(spec.question))),
        spec.id === 'options_lab' && typeof OptionsDesk === 'function' ? e(HookShell, { key: 'options-desk', component: OptionsDesk, symbol: st.tickers[0], busy: st.busy[0], onRun: run,
          setSymbol: function (v) { if (selRef.cur === 'options_lab') st.tickers[1](v); },
          setParams: function (p) { if (selRef.cur === 'options_lab') st.params[1](function (cur) { return Object.assign({}, cur, p); }); } }) :
        e('div', { className: 'lab-inputs' },
          e('div', { className: 'lab-form' },
            e('label', { className: 'form-label' }, spec.max_tickers > 1 ? L('Tickers (comma separated)') + ' · ' + spec.min_tickers + '–' + spec.max_tickers : L('Ticker'),
              e('input', { value: st.tickers[0], onChange: function (ev) { st.tickers[1](ev.target.value.toUpperCase()); }, onKeyDown: function (ev) { if (ev.key === 'Enter') run(); }, placeholder: (spec.example || []).join(', '), spellCheck: false })),
            Object.keys(st.params[0]).map(function (k) {
              var v = st.params[0][k];
              var set = function (val) { var p = Object.assign({}, st.params[0]); p[k] = val; st.params[1](p); };
              return e('label', { key: k, className: 'form-label' }, L(QE_LAB_PARAM_LABELS[k] || k),
                k === 'strategy' ? e('select', { value: v, onChange: function (ev) { set(ev.target.value); } }, ['SMA crossover', 'Momentum'].map(function (o) { return e('option', { key: o, value: o }, L(o)); }))
                  : k === 'horizon_months' ? e('select', { value: String(v), onChange: function (ev) { set(ev.target.value); } }, (spec.id === 'ito' ? ['1', '3', '6', '12', '24'] : ['6', '12', '24']).map(function (o) { return e('option', { key: o, value: o }, o + ' ' + L('months')); }))
                  : (k === 'include_earnings' || k === 'fat_tails' || k === 'history_drift' || k === 'heston') ? e('input', { type: 'checkbox', className: 'lab-check', checked: v === true || v === 1 || v === '1', onChange: function (ev) { set(ev.target.checked); } })
                  : QE_LAB_TEXT_PARAMS[k] ? e('input', { type: QE_LAB_TEXT_PARAMS[k], value: v, spellCheck: false, onChange: function (ev) { set(k === 'target_symbol' || k === 'peers' ? ev.target.value.toUpperCase() : ev.target.value); } })
                  : e('input', { type: 'number', step: 'any', value: v, onChange: function (ev) { set(ev.target.value); } }));
            }),
            spec.supports_asof !== false && e('label', { className: 'form-label' }, L('Point-in-time date (optional)'),
              e('input', { type: 'date', value: st.asof[0], max: new Date(Date.now() - 864e5).toISOString().slice(0, 10), min: '2009-06-01', onChange: function (ev) { st.asof[1](ev.target.value); } }),
              e('span', { className: 'micro muted' }, L('Re-run as it would have looked on that date: filings made before it, prices up to it.'))),
            spec.id === 'turkey_fx' && qeEvdsField(e, st.evds),
            spec.uses_sec !== false && !window.QE_DEMO && e('label', { className: 'form-label' }, L('SEC contact email'),
              e('input', { type: 'email', value: props.contactEmail || '', onChange: function (ev) { props.setContactEmail(ev.target.value); }, placeholder: 'research@example.com' }))),
          e('div', { className: 'social-buttons lab-run' },
            e(Button, { variant: 'primary', icon: 'chart', loading: st.busy[0], onClick: run }, L('Run analysis')),
            e('button', { type: 'button', className: 'tiny-link', onClick: function () { st.tickers[1]((spec.example || []).join(', ')); } }, L('Use the example')))),
        st.busy[0] && qeLabProgress(e, spec),
        st.error[0] && e('div', { className: 'lab-run-error' }, e(Notice, { type: 'amber' }, L(st.error[0]))),
        res && e(Group, null,
          e(LabResult, { res: res, view: commentary.view, counter: commentary.counter, author: author, onWrite: goWrite }),
          e('section', { className: 'lab-actions lab-publish', 'aria-labelledby': 'lab-publish-title' },
            e('div', { className: 'publish-head' },
              e('h3', { id: 'lab-publish-title' }, L('Publish this analysis')),
              e('p', { className: 'micro muted' }, L('A post is yours when it says what you think and where you could be wrong. Both are required before the LinkedIn draft, the image and the carousel unlock.'))),
            e('div', { className: 'publish-step' + (ready ? ' is-done' : ''), id: 'lab-step-write' },
              e('div', { className: 'step-head' },
                e('span', { className: 'step-num', 'aria-hidden': 'true' }, ready ? e(Icon, { name: 'check', size: 15 }) : '1'),
                e('div', null, e('strong', null, L('Step') + ' 1 · ' + L('Write your thesis and risks')), e('small', null, L('Your own words lead every output. The data only supports them.')))),
              e('label', { className: 'form-label' }, L('Your name on the post'),
                e('input', { value: author, maxLength: 80, onChange: function (ev) { var v = ev.target.value; props.setReport(function (r) { return Object.assign({}, r, { author: v }); }); }, placeholder: L('First and last name') })),
              e('label', { className: 'form-label' }, e('span', { className: 'label-row' }, e('span', null, L('Thesis') + ' · ' + L('What I think')), e('span', { className: 'micro ' + (commentary.view.length >= QE_LAB_MIN_VIEW ? 'muted' : 'lab-count-short') }, L('at least') + ' ' + QE_LAB_MIN_VIEW + ' ' + L('characters') + ' · ' + commentary.view.length)),
                e('textarea', { id: 'lab-view-input', className: 'social-input', maxLength: QE_LAB_MAX_VIEW, value: st.view[0], onChange: function (ev) { setDraft('view', ev.target.value); },
                  placeholder: L('Example: Segment growth tells me the cloud business now carries the company. I expect its share to keep rising because...') })),
              e('label', { className: 'form-label' }, e('span', { className: 'label-row' }, e('span', null, L('Risks to the view') + ' · ' + L('Why I might be wrong')), e('span', { className: 'micro ' + (commentary.counter.length >= QE_LAB_MIN_COUNTER ? 'muted' : 'lab-count-short') }, L('at least') + ' ' + QE_LAB_MIN_COUNTER + ' ' + L('characters') + ' · ' + commentary.counter.length)),
                e('textarea', { className: 'social-input social-input-small', maxLength: QE_LAB_MAX_COUNTER, value: st.counter[0], onChange: function (ev) { setDraft('counter', ev.target.value); },
                  placeholder: L('Example: Three years is a short window, and one large contract could explain most of the growth.') })),
              qeCallEditor(e, callDraft, res, callCheck, setCall, st.callTouched[0], touchCall, st.noise[0]),
              st.flags[0].length > 0 && e('div', { className: 'claim-flags', role: 'status' },
                e('strong', null, L('Check your wording before posting')),
                st.flags[0].map(function (f, i) { return e('p', { key: i }, e('mark', null, f.phrase), e('span', { className: 'claim-kind' }, L(f.category)), f.suggestion); }),
                e('small', null, L('These are wording hints, not a judgement of your view. You decide what to post.'))),
              qeLabChecklistView(e, qeLabChecklist(res, commentary, callDraft, st.flags[0]))),
            e('div', { className: 'publish-step' + (locked ? ' is-locked' : '') },
              e('div', { className: 'step-head' },
                e('span', { className: 'step-num', 'aria-hidden': 'true' }, '2'),
                e('div', null, e('strong', null, L('Step') + ' 2 · ' + L('Choose outputs')), e('small', null, L('Each output carries your thesis, the risks and the sources.')))),
              locked && e('p', { className: 'micro lab-locked' }, e(Icon, { name: 'shield', size: 14 }), ' ' + (commentary.ok
                ? L('Finish your view in step 1 to unlock publishing:') + ' ' + callCheck.hints.map(function (h) { return h.text; }).join(' ')
                : L('Write your view and your counterargument to unlock publishing.'))),
              e('div', { className: 'output-grid' },
                output('post', L('LinkedIn post'), L('Plain text that leads with your view, ready to paste.'),
                  e(Button, { icon: 'spark', disabled: !ready, 'aria-expanded': ready && st.showPost[0], onClick: function () { st.showPost[1](!st.showPost[0]); } }, L('LinkedIn draft'))),
                output('carousel', L('Carousel'), L('5–9 slides (PDF) to add to a post as a document.'),
                  e(Button, { icon: 'layout', disabled: !ready, loading: st.building[0], onClick: buildCarousel }, L('Download PDF'))),
                output('image', L('Image'), L('A 1200×627 chart card for a post.'),
                  cardUrl ? e('a', { className: 'btn subtle', href: cardUrl, download: 'QuantEdge_' + res.id + '_' + res.subjects.join('-').slice(0, 30) + '.png' }, e(Icon, { name: 'download', size: 16 }), ' ' + L('Download PNG'))
                    : e(Button, { icon: 'download', disabled: true }, L('Download PNG'))),
                output('site', L('Public site'), L('A permanent page on your site with the full note.'),
                  e(Button, { variant: ready ? 'primary' : 'subtle', icon: 'globe', disabled: !ready || !!(st.siteMsg[0] && st.siteMsg[0].ok), loading: st.siteBusy[0], onClick: addToSite },
                    st.siteMsg[0] && st.siteMsg[0].ok ? L('Added to my site ✓') : L('Add to my public site')))),
              st.siteMsg[0] && e('p', { className: 'micro lab-site-status' + (st.siteMsg[0].ok ? ' is-ok' : ' is-error'), role: 'status' },
                st.siteMsg[0].text,
                st.siteMsg[0].ok && props.setPage && e('button', { type: 'button', className: 'tiny-link', onClick: function () { props.setPage('Public Site'); } }, L('Open my public site') + ' →')),
              ready && st.showPost[0] && e('div', { className: 'lab-post' },
                e('textarea', { className: 'social-post-text', readOnly: true, value: postText, 'aria-label': L('LinkedIn draft') }),
                e('div', { className: 'social-buttons' },
                  e(Button, { variant: 'primary', icon: 'file', onClick: copy }, st.copied[0] ? L('✓ Copied!') : L('Copy for LinkedIn')),
                  e('span', { className: 'micro muted' }, postText.length + ' / 3000 ' + L('characters')))),
              st.carousel[0] && e('div', { className: 'lab-carousel' },
                e('p', { className: 'micro' }, L('Carousel downloaded') + ' · ' + st.carousel[0].previews.length + ' ' + L('slides') + ' · ' +
                  Math.round(st.carousel[0].bytes / 1024) + ' KB. ' + L('On LinkedIn: Start a post → Add a document → choose this PDF and give it a title.'),
                  ' ', e('a', { href: st.carousel[0].url, download: 'QuantEdge_' + res.id + '_carousel.pdf' }, L('Download again'))),
                e('div', { className: 'lab-carousel-strip' }, st.carousel[0].previews.map(function (u, i) { return e('img', { key: i, src: u, alt: L('Slide') + ' ' + (i + 1) }); }))),
              cardUrl && e('details', { className: 'lab-card-details' },
                e('summary', null, L('Preview the image')),
                e('img', { className: 'lab-card-preview', src: cardUrl, alt: L('Chart card for LinkedIn') })),
              e('div', { className: 'publish-more' },
                e('span', { className: 'micro muted' }, L('Writing a longer report?')),
                e('button', { type: 'button', className: 'tiny-link', onClick: addToNotes }, L('Add to report notes')),
                e('span', { className: 'micro muted' }, L('Want to check the numbers yourself?')),
                e('button', { type: 'button', className: 'tiny-link', onClick: exportXlsx }, res.id === 'dcf' ? L('Download the model (.xlsx, with formulas)') : L('Download the tables (.xlsx)'))),
              st.message[0] && e('p', { className: 'micro', role: 'status' }, st.message[0])))))));
}


/* Data-quality badge and its checks (data_quality.py). "Not checked" is never shown as passed. */
function qeLabQualityView(e, q) {
  if (!q || !q.items || !q.items.length) return null;
  var tone = q.failed ? 'is-bad' : q.warnings ? 'is-warn' : q.checked ? 'is-good' : 'is-na';
  var mark = { pass: '✓', warn: '!', fail: '✕', na: '–' };
  return e('details', { className: 'quality ' + tone },
    e('summary', null, e('span', { className: 'quality-dot', 'aria-hidden': 'true' }),
      L('Data quality') + ': ' + q.passed + '/' + q.checked + ' ' + L('checks passed') + (q.warnings ? ' · ' + q.warnings + ' ' + L('warnings') : '')),
    e('ul', null, q.items.map(function (it) {
      return e('li', { key: it.id, className: 'q-' + it.status }, e('span', { className: 'q-mark', 'aria-hidden': 'true' }, mark[it.status] || '–'),
        e('span', null, e('strong', null, L(it.label)), it.status === 'na' ? e('em', null, ' · ' + L('not checked')) : null, it.detail ? e('small', null, it.detail) : null));
    })));
}


/* TCMB EVDS key for the Turkey analysis: stored on this computer only (data/local_keys.json), never published. */
function qeEvdsField(e, slot) {
  var v = slot[0], set = slot[1];
  if (v.stored === null && !v.loading) {
    set(Object.assign({}, v, { loading: true }));
    request(API + '/config/evds').then(function (d) { set({ stored: !!d.stored, key: '', msg: '' }); }).catch(function () { set({ stored: false, key: '', msg: '' }); });
  }
  function save(key) {
    request(API + '/config/evds', { method: 'PUT', body: JSON.stringify({ key: key }) })
      .then(function (d) { set({ stored: !!d.stored, key: '', msg: d.stored ? L('Key saved on this computer.') : L('Key removed.') }); })
      .catch(function (x) { set(Object.assign({}, v, { msg: L(x.message || String(x)) })); });
  }
  return e('div', { className: 'form-label evds-field' },
    e('span', null, L('TCMB EVDS key (optional, free)')),
    v.stored ? e('span', { className: 'micro' }, '✓ ' + L('A key is stored on this computer.') + ' ',
      e('button', { type: 'button', className: 'tiny-link', onClick: function () { save(''); } }, L('Remove')))
      : e('span', { className: 'evds-row' },
        e('input', { type: 'password', autoComplete: 'off', value: v.key, placeholder: L('Paste the API key from your EVDS profile'), onChange: function (ev) { set(Object.assign({}, v, { key: ev.target.value })); } }),
        e('button', { type: 'button', className: 'btn subtle', disabled: !v.key.trim(), onClick: function () { save(v.key.trim()); } }, L('Save'))),
    e('span', { className: 'micro muted' }, L('With it: CPI-adjusted (real) returns and a check against the official exchange rate. Get one free at evds3.tcmb.gov.tr → Profile → API key. It stays on this computer and is never published.')),
    v.msg && e('span', { className: 'micro' }, v.msg));
}


/* Where each figure comes from: field, value, XBRL tag, filing date and a link to the 10-K / 10-Q. */
function qeLabDataMapView(e, rows) {
  if (!rows || !rows.length) return null;
  return e('details', { className: 'data-map' },
    e('summary', null, L('Where the figures come from') + ' (' + rows.length + ')'),
    e('div', { className: 'table-wrap' }, e('table', { className: 'quarterly-table lab-table' },
      e('thead', null, e('tr', null, [L('Item'), L('Value'), L('XBRL tag'), L('Filed'), L('Filing')].map(function (h, i) { return e('th', { key: i }, h); }))),
      e('tbody', null, rows.map(function (r, i) {
        return e('tr', { key: i }, e('td', null, labL(r.field)), e('td', { className: 'num' }, labFormat(r.value_m, 'money_m')),
          e('td', null, e('code', null, r.tag)), e('td', null, qeDate(r.filed)),
          e('td', null, r.url ? e('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer' }, r.accession + ' ↗') : r.accession));
      })))));
}

/* Options desk for analysis #30 (v0.13.5): a live Black–Scholes calculator, the volatility smile, the term structure,
   a strategy payoff builder and the Heston stochastic-volatility fit.

   Server: GET /api/v2/lab/options/desk (live snapshot: quote, chain with implied volatilities, smile, term structure)
           POST /api/v2/lab/options/heston (calibrate the Heston model to the live smiles).
   The calculator itself runs in the browser (QE_BS mirrors lab_bs.py; tests compare the two), so every slider answers
   instantly. Live mode refreshes the snapshot once a minute while the tab is visible. Free data: the stock quote is
   Yahoo's current price, option quotes are delayed about 15 minutes. Nothing here is a recommendation. */

/* ------------------------------------------------------------------ pricing engine (same formulas as lab_bs.py) */
var QE_BS = (function () {
  var SQ2PI = 2.5066282746310002;
  // standard normal CDF to double precision (Hart 1968, as given by West 2005)
  function ncdf(x) {
    var a = Math.abs(x), c, b;
    if (a > 37) c = 0;
    else {
      var ex = Math.exp(-a * a / 2);
      if (a < 7.07106781186547) {
        b = 3.52624965998911e-2 * a + 0.700383064443688;
        b = b * a + 6.37396220353165; b = b * a + 33.912866078383; b = b * a + 112.079291497871;
        b = b * a + 221.213596169931; b = b * a + 220.206867912376;
        c = ex * b;
        b = 8.83883476483184e-2 * a + 1.75566716318264;
        b = b * a + 16.064177579207; b = b * a + 86.7807322029461; b = b * a + 296.564248779674;
        b = b * a + 637.333633378831; b = b * a + 793.826512519948; b = b * a + 440.413735824752;
        c = c / b;
      } else {
        b = a + 0.65; b = a + 4 / b; b = a + 3 / b; b = a + 2 / b; b = a + 1 / b;
        c = ex / b / SQ2PI;
      }
    }
    return x > 0 ? 1 - c : c;
  }
  function npdf(x) { return Math.exp(-0.5 * x * x) / SQ2PI; }
  function price(kind, s, k, t, r, q, sig) {
    var call = kind === 'call';
    if (!(t > 0)) return Math.max(0, call ? s - k : k - s) || 0;
    var df = Math.exp(-r * t), dq = Math.exp(-q * t);
    if (!(sig > 0)) { var f = s * dq - k * df; return Math.max(0, call ? f : -f) || 0; }
    var v = sig * Math.sqrt(t), d1 = (Math.log(s / k) + (r - q + 0.5 * sig * sig) * t) / v, d2 = d1 - v;
    return call ? s * dq * ncdf(d1) - k * df * ncdf(d2) : k * df * ncdf(-d2) - s * dq * ncdf(-d1);
  }
  function greeks(kind, s, k, t, r, q, sig) {
    var call = kind === 'call', value = price(kind, s, k, t, r, q, sig);
    if (!(t > 0) || !(sig > 0)) {  // expired, or zero volatility (the forward decides); same branch as lab_bs.greeks
      var itm, dq0 = 1, th = 0, rh = 0;
      if (!(t > 0)) itm = call ? s > k : s < k;
      else {
        dq0 = Math.exp(-q * t); var df0 = Math.exp(-r * t), fw = s * dq0 - k * df0;
        itm = call ? fw > 0 : fw < 0;
        if (itm) { th = call ? q * s * dq0 - r * k * df0 : r * k * df0 - q * s * dq0; rh = call ? k * t * df0 : -k * t * df0; }
      }
      return { price: value, delta: itm ? (call ? dq0 : -dq0) : 0, gamma: 0, vega: 0, theta: th / 365, rho: rh / 100, d1: null, d2: null, prob_itm: itm ? 1 : 0 };
    }
    var sq = Math.sqrt(t), v = sig * sq, d1 = (Math.log(s / k) + (r - q + 0.5 * sig * sig) * t) / v, d2 = d1 - v;
    var df = Math.exp(-r * t), dq = Math.exp(-q * t), p1 = npdf(d1);
    var gamma = dq * p1 / (s * sig * sq), vega = s * dq * p1 * sq, decay = -s * dq * p1 * sig / (2 * sq), delta, theta, rho, pitm;
    if (call) { delta = dq * ncdf(d1); theta = decay - r * k * df * ncdf(d2) + q * s * dq * ncdf(d1); rho = k * t * df * ncdf(d2); pitm = ncdf(d2); }
    else { delta = -dq * ncdf(-d1); theta = decay + r * k * df * ncdf(-d2) - q * s * dq * ncdf(-d1); rho = -k * t * df * ncdf(-d2); pitm = ncdf(-d2); }
    return { price: value, delta: delta, gamma: gamma, vega: vega / 100, theta: theta / 365, rho: rho / 100, d1: d1, d2: d2, prob_itm: pitm };
  }
  function bounds(kind, s, k, t, r, q) {
    var df = Math.exp(-r * t), dq = Math.exp(-q * t);
    return kind === 'call' ? [Math.max(0, s * dq - k * df), s * dq] : [Math.max(0, k * df - s * dq), k * df];
  }
  function impliedVol(prem, kind, s, k, t, r, q) {
    if (!(prem > 0 && s > 0 && k > 0 && t > 0) || !isFinite(prem + s + k + t + r + q)) return null;
    prem = prem / s; k = k / s; s = 1;  // homogeneous in (S, K, premium): solve in units of S, like lab_bs
    var bd = bounds(kind, s, k, t, r, q);
    if (prem <= bd[0] || prem >= bd[1]) return null;
    var lo = 1e-4, hi = 5, f = function (x) { return price(kind, s, k, t, r, q, x) - prem; };
    if (f(lo) > 0 || f(hi) < 0) return null;
    var x = Math.min(Math.max(Math.sqrt(2 * Math.PI / t) * prem / (s * Math.exp(-q * t)), lo * 1.01), hi * 0.99);
    for (var i = 0; i < 100; i++) {
      var fx = f(x);
      if (Math.abs(fx) < 1e-15) break;  // in units of S
      if (fx > 0) hi = x; else lo = x;
      var d1 = (Math.log(s / k) + (r - q + 0.5 * x * x) * t) / (x * Math.sqrt(t));
      var vg = s * Math.exp(-q * t) * npdf(d1) * Math.sqrt(t);
      var nx = vg > 1e-14 ? x - fx / vg : (lo + hi) / 2;
      if (!(nx > lo && nx < hi)) nx = (lo + hi) / 2;
      if (Math.abs(nx - x) < 1e-13 || hi - lo < 1e-13) { x = nx; break; }
      x = nx;
    }
    var d1b = (Math.log(s / k) + (r - q + 0.5 * x * x) * t) / (x * Math.sqrt(t));
    if (s * Math.exp(-q * t) * npdf(d1b) * Math.sqrt(t) < 1e-8 * s) return null;  // no time value: no volatility to read
    return x;
  }
  // binomial tree with the risk-neutral drift in the nodes (as lab_bs._tree): the up probability stays near 1/2
  function tree(kind, s, k, t, r, q, sig, n, am) {
    var dt = t / n, b = r - q, vol = sig * Math.sqrt(dt), u = Math.exp(b * dt + vol), d = Math.exp(b * dt - vol);
    var p = (Math.exp(b * dt) - d) / (u - d), disc = Math.exp(-r * dt), v = new Float64Array(n + 1), call = kind === 'call', j;
    for (j = 0; j <= n; j++) { var st0 = s * Math.exp(b * t + vol * (2 * j - n)); v[j] = Math.max(call ? st0 - k : k - st0, 0); }
    for (var i = n - 1; i >= 0; i--) {
      for (j = 0; j <= i; j++) {
        var val = disc * (p * v[j + 1] + (1 - p) * v[j]);
        if (am) { var si = s * Math.exp(b * i * dt + vol * (2 * j - i)), ex = call ? si - k : k - si; if (ex > val) val = ex; }
        v[j] = val;
      }
    }
    return v[0];
  }
  function deterministicAmerican(kind, s, k, t, r, q) {  // sigma = 0: best of exercising at 0, T or the interior peak
    var times = [0, t];
    if (r !== q && r * q > 0) { var x = r * k / (q * s); if (x > 0) { var u0 = Math.log(x) / (r - q); if (u0 > 0 && u0 < t) times.push(u0); } }
    var sign = kind === 'call' ? 1 : -1;
    return Math.max(0, Math.max.apply(null, times.map(function (u1) { return Math.exp(-r * u1) * sign * (s * Math.exp((r - q) * u1) - k); })));
  }
  // American value with the European tree as control variate (as lab_bs.american)
  function american(kind, s, k, t, r, q, sig, steps) {
    var euro = price(kind, s, k, t, r, q, sig), intrinsic = Math.max(0, kind === 'call' ? s - k : k - s);
    if (!(t > 0)) return { price: intrinsic, european: euro, premium: 0 };
    if (!(sig > 0)) { var v0 = Math.max(deterministicAmerican(kind, s, k, t, r, q), euro); return { price: v0, european: euro, premium: v0 - euro }; }
    var n = Math.max(steps || 200, 20);
    var am = (tree(kind, s, k, t, r, q, sig, n, true) + tree(kind, s, k, t, r, q, sig, n + 1, true)) / 2;
    var eu = (tree(kind, s, k, t, r, q, sig, n, false) + tree(kind, s, k, t, r, q, sig, n + 1, false)) / 2;
    var val = am <= intrinsic + 1e-12 * Math.max(1, intrinsic) ? intrinsic : Math.max(euro + Math.max(am - eu, 0), intrinsic);
    val = Math.max(val, euro);
    return { price: val, european: euro, premium: val - euro };
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t2 = Math.imul(a ^ a >>> 15, 1 | a);
      t2 = t2 + Math.imul(t2 ^ t2 >>> 7, 61 | t2) ^ t2;
      return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
    };
  }
  // risk-neutral Monte Carlo with antithetic pairs (as lab_bs.monte_carlo): a call is the simulated put plus put–call
  // parity, and the standard error comes from pair averages (two-pass variance)
  function monteCarlo(kind, s, k, t, r, q, sig, n, seed) {
    t = Math.max(t, 0);
    var pairs = Math.max(1, Math.floor((n || 100000) / 2)), rnd = mulberry32(seed || 20261113);
    var drift = (r - q - 0.5 * sig * sig) * t, vol = sig * Math.sqrt(t), disc = Math.exp(-r * t);
    // as lab_bs.monte_carlo: a call in the money or with a heavy tail via the put and parity, else its own payoff
    var viaPut = kind === 'put' || k < s * Math.exp((r - q) * t) || sig * sig * t > 1;
    var carry = kind === 'call' && viaPut ? s * Math.exp(-q * t) - k * disc : 0;
    var vals = new Float64Array(pairs), sum = 0;
    for (var i = 0; i < pairs; i++) {
      var u1 = rnd() || 1e-12, u2 = rnd(), z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      var a = s * Math.exp(drift + vol * z), b = s * Math.exp(drift - vol * z);
      var avg = viaPut ? disc * 0.5 * (Math.max(k - a, 0) + Math.max(k - b, 0)) + carry : disc * 0.5 * (Math.max(a - k, 0) + Math.max(b - k, 0));
      vals[i] = avg; sum += avg;
    }
    var mean = sum / pairs, ss = 0;
    for (var j = 0; j < pairs; j++) { var dv = vals[j] - mean; ss += dv * dv; }
    var se = pairs > 1 ? Math.sqrt(ss / (pairs - 1) / pairs) : NaN;
    return { price: mean, se: se, lo: mean - 1.96 * se, hi: mean + 1.96 * se, n: 2 * pairs };
  }
  // the volatility at which the American tree reproduces a quoted price (null when the price has no time value)
  function americanImpliedVol(premium, kind, s, k, t, r, q, steps) {
    if (!(premium > 0) || !(t > 0)) return null;
    var n = steps || 120, lo = 1e-4, hi = 5;
    var f = function (v) { return american(kind, s, k, t, r, q, v, n).price - premium; };
    var flo = f(lo), fhi = f(hi);
    if (!(flo < 0) || !(fhi > 0)) return null;
    for (var i = 0; i < 60 && hi - lo > 1e-7; i++) { var mid = 0.5 * (lo + hi); if (f(mid) < 0) lo = mid; else hi = mid; }
    return 0.5 * (lo + hi);
  }
  return { ncdf: ncdf, npdf: npdf, price: price, greeks: greeks, bounds: bounds, impliedVol: impliedVol, american: american, americanImpliedVol: americanImpliedVol,
    tree: tree, monteCarlo: monteCarlo, mulberry32: mulberry32 };
})();

/* ------------------------------------------------------------------ formatting */
function qeOptMoney(v, d) {
  if (v === null || v === undefined || !isFinite(v)) return '—';
  var dd = d === undefined ? 2 : d, t = qeLabFixed(v, dd), sg = qeLabSign(v, dd);
  return QE_LANG === 'en' ? sg + '$' + t : sg + t + '\u00a0$';
}
function qeOptPct(v, d, signed) {  // v is a decimal (0.215 -> 21.5%)
  if (v === null || v === undefined || !isFinite(v)) return '—';
  var dd = d === undefined ? 1 : d, sg = qeLabSign(v * 100, dd);
  return qeLabPct(v * 100, dd, signed && v > 0 ? '+' : sg).replace(' %', '\u00a0%');
}
function qeOptNum(v, d) {
  if (v === null || v === undefined || !isFinite(v)) return '—';
  return qeLabSign(v, d) + qeLabFixed(v, d);
}
function qeOptTime(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleTimeString(QE_LAB_LOCALE[QE_LANG] || 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); } catch (x) { return ''; }
}
function qeOptSession(sess) {
  return { REGULAR: L('Market open'), PRE: L('Pre-market'), POST: L('After hours'), CLOSED: L('Market closed') }[sess] || sess;
}

/* ------------------------------------------------------------------ timers (class components: clean up on unmount) */
class QeOptPoller extends React.Component {
  componentDidMount() { this.arm(); }
  componentDidUpdate(prev) { if (prev.active !== this.props.active || prev.token !== this.props.token || prev.ms !== this.props.ms) this.arm(); }
  componentWillUnmount() { this.dead = true; clearTimeout(this.timer); }
  arm() {
    clearTimeout(this.timer);
    if (!this.props.active) return;
    var self = this;
    var tick = function () {
      if (self.dead || !self.props.active) return;
      if (typeof document !== 'undefined' && document.hidden) { self.timer = setTimeout(tick, 5000); return; }  // paused while hidden
      self.props.onTick();
      self.timer = setTimeout(tick, Math.max(self.props.ms || 60000, 1000));  // keeps ticking even if a request fails
    };
    this.timer = setTimeout(tick, Math.max(this.props.ms || 60000, 1000));
  }
  render() { return null; }
}
class QeOptLife extends React.Component {  // tells the desk when it has been unmounted
  componentWillUnmount() { if (this.props.onUnmount) this.props.onUnmount(); }
  render() { return null; }
}
// NYSE calendar, as lab_live.py: full-day holidays and 13:00 early closes (rule-based; one-off closures unknown)
function qeNyseDay(y, m, d) {  // m 1-12; returns {holiday, early}
  var D = function (yy, mm, dd) { return Date.UTC(yy, mm - 1, dd); }, day = 864e5, t = D(y, m, d);
  var wd = function (x) { return new Date(x).getUTCDay(); };  // 0 Sunday
  var nth = function (mm, weekday, n) {  // n-th weekday of a month (0 Sunday); n = -1: the last
    if (n > 0) { var f = D(y, mm, 1); return f + (((weekday - wd(f)) % 7 + 7) % 7 + 7 * (n - 1)) * day; }
    var l = D(y, mm + 1, 1) - day; return l - (((wd(l) - weekday) % 7 + 7) % 7) * day;
  };
  var observed = function (x, newYear) { var w = wd(x); return w === 6 ? (newYear ? null : x - day) : w === 0 ? x + day : x; };
  var a = y % 19, b = Math.floor(y / 100), c = y % 100, e4 = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  var h = (19 * a + b - Math.floor(b / 4) - g + 15) % 30, l7 = (32 + 2 * e4 + 2 * Math.floor(c / 4) - h - c % 4) % 7, mm7 = Math.floor((a + 11 * h + 22 * l7) / 451);
  var easter = D(y, Math.floor((h + l7 - 7 * mm7 + 114) / 31), (h + l7 - 7 * mm7 + 114) % 31 + 1);
  var thanksgiving = nth(11, 4, 4);
  var days = [observed(D(y, 1, 1), true), observed(D(y + 1, 1, 1), true), y >= 2022 ? observed(D(y, 6, 19)) : null, observed(D(y, 7, 4)), observed(D(y, 12, 25)),
    nth(1, 1, 3), nth(2, 1, 3), easter - 2 * day, nth(5, 1, -1), nth(9, 1, 1), thanksgiving];
  var early = t === thanksgiving + day || ((m === 12 && d === 24 || m === 7 && d === 3) && wd(t) >= 1 && wd(t) <= 4);
  return { holiday: days.indexOf(t) >= 0, early: early };
}
// US equity market state from the New York clock: weekends, NYSE holidays and early closes as on the server
function qeUsMarketState(now) {
  try {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now || new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
    var wd = get('weekday'), mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    if (!isFinite(mins) || wd === 'Sat' || wd === 'Sun') return 'CLOSED';
    var cal = qeNyseDay(parseInt(get('year'), 10), parseInt(get('month'), 10), parseInt(get('day'), 10));
    if (cal.holiday) return 'HOLIDAY';
    var close = cal.early ? 780 : 960;
    if (mins >= 570 && mins < close) return 'REGULAR';
    if (mins >= 240 && mins < 570) return 'PRE';
    if (mins >= close && mins < close + 240) return 'POST';
    return 'CLOSED';
  } catch (err) { return null; }
}
// the Options tab's badge, a pill with a word in every state so its meaning shows without hovering: 'LIVE' with a
// pulsing green dot in the regular session; 'CLOSED' outside it (US stock options trade only in the regular session; a
// few ETF options such as SPY until 16:15), with a filled amber dot while the stock trades before or after the session
// and a hollow grey ring when nothing trades (shape as well as colour; phones show only the dot). The
// sentence is a hidden description the tab points at (aria-describedby), so the tab's name stays 'Options LIVE'.
// Checked every minute; a change of state re-fits the top bar.
class QeOptMarketBadge extends React.Component {
  componentDidMount() { var self = this; this.iv = setInterval(function () { self.forceUpdate(); }, 60000); }
  componentDidUpdate() {
    if (this.shown !== this.last) { this.last = this.shown; if (typeof fitTopbar === 'function') window.requestAnimationFrame(fitTopbar); }
  }
  componentWillUnmount() { clearInterval(this.iv); }
  render() {
    var s = window.QE_DEMO ? null : qeUsMarketState();  // the demo's market is frozen on a Friday morning: no real-clock badge
    if (!s) return null;
    if (this.last === undefined) this.last = s;
    this.shown = s;
    var tip = { REGULAR: 'US market open: the stock price is live, option quotes are about 15 minutes delayed', PRE: 'Pre-market: the stock trades, option quotes are from the last session',
      POST: 'After hours: the stock trades, option quotes are from the regular session (a few ETF options such as SPY trade until 16:15)', CLOSED: 'US market closed: the last session’s data', HOLIDAY: 'US exchange holiday: the market is closed today' }[s];
    return React.createElement('b', { className: 'nav-live is-' + (s === 'HOLIDAY' ? 'closed' : s.toLowerCase()), title: L(tip) },
      React.createElement('i', { 'aria-hidden': 'true' }), React.createElement('em', null, L(s === 'REGULAR' ? 'LIVE' : 'CLOSED')),
      React.createElement('span', { id: 'qe-opt-market-desc', className: 'nav-live-desc', hidden: true, style: { display: 'none' } }, L(tip)));  // inline: menu rules such as '.topbar.fit-2 .nav button span{display:inline}' must not show it
  }
}
class QeOptClock extends React.Component {
  componentDidMount() { var self = this; this.iv = setInterval(function () { self.forceUpdate(); }, 1000); }
  componentWillUnmount() { clearInterval(this.iv); }
  render() {
    var next = this.props.next, left = next ? Math.max(0, Math.round((next - Date.now()) / 1000)) : null;
    return React.createElement('span', { className: 'micro muted opt-countdown' }, left === null ? '' : L('next update in') + ' ' + left + ' ' + L('s'));
  }
}

/* ------------------------------------------------------------------ small pieces */
function qeOptSpark(e, bars) {
  if (!bars || bars.length < 2) return null;
  var vals = bars.map(function (b) { return b[1]; }), lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), W = 150, H = 38;
  var span = hi - lo || 1, d = vals.map(function (v, i) { return (i ? 'L' : 'M') + (i / (vals.length - 1) * W).toFixed(1) + ' ' + (H - 3 - (v - lo) / span * (H - 6)).toFixed(1); }).join(' ');
  var up = vals[vals.length - 1] >= vals[0];
  return e('svg', { className: 'opt-spark', viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', 'aria-label': L('Today, 1-minute prices') },
    e('path', { d: d, fill: 'none', style: { stroke: up ? 'var(--qe-chart-up)' : 'var(--qe-chart-down)' }, strokeWidth: 1.6, strokeLinejoin: 'round' }));
}
function qeOptQuote(chain, k, kind) {
  if (!chain) return null;
  for (var i = 0; i < chain.length; i++) if (Math.abs(chain[i].strike - k) < 1e-9) return chain[i][kind] || null;
  return null;
}
// '21,4 %', '356,60 $' and '% 21,4' never break between the number and its unit
function qeOptKeepUnits(text) { return typeof qeLabKeepUnits === 'function' ? qeLabKeepUnits(String(text)) : String(text); }
// the delayed quote carried to the latest stock price: the move since the quotes (on the expiry's option-implied stock
// price, at the contract's own implied volatility) added to the quote, as options_desk does on the server
function qeOptNowcast(d, kind, k, m, last) {
  var sq = d.quote_stock && d.quote_stock.price, sm = d.dividend.s_model, tq = (d.days_quote || d.days) / 365;
  if (!sq || !m || !m.mid || !m.iv) return null;
  return m.mid + QE_BS.price(kind, sm * last / sq, k, tq, d.rate.r, d.dividend.q_used, m.iv) - QE_BS.price(kind, sm, k, tq, d.rate.r, d.dividend.q_used, m.iv);
}
function qeOptDefaults(d) {
  var s = d.selected, m = s.market || {};
  // outside regular hours the quotes belong to the last close: the default time is counted from then, so model = market
  return { s: d.dividend.s_model, k: s.strike, days: d.days_quote || d.days, vol: m.iv || d.atm_iv || s.sigma_used, r: d.rate.r, q: d.dividend.q_used };
}
var QE_OPT_PRESETS = [['single', 'Single option'], ['straddle', 'Long straddle'], ['strangle', 'Long strangle'], ['bull_call', 'Bull call spread'],
  ['bear_put', 'Bear put spread'], ['butterfly', 'Long call butterfly'], ['iron_condor', 'Short iron condor'], ['covered_call', 'Covered call'], ['protective_put', 'Protective put']];
function qeOptPreset(name, strikes, atm, kind, k) {
  if (!strikes || !strikes.length) return [{ kind: kind, k: k, qty: 1 }];
  var near = function (x) { return strikes.reduce(function (b, c) { return Math.abs(c - x) < Math.abs(b - x) ? c : b; }, strikes[0]); };
  var a = near(atm), u5 = near(atm * 1.05), d5 = near(atm * 0.95), u10 = near(atm * 1.1), d10 = near(atm * 0.9);
  switch (name) {
    case 'straddle': return [{ kind: 'call', k: a, qty: 1 }, { kind: 'put', k: a, qty: 1 }];
    case 'strangle': return [{ kind: 'put', k: d5, qty: 1 }, { kind: 'call', k: u5, qty: 1 }];
    case 'bull_call': return [{ kind: 'call', k: a, qty: 1 }, { kind: 'call', k: u5, qty: -1 }];
    case 'bear_put': return [{ kind: 'put', k: a, qty: 1 }, { kind: 'put', k: d5, qty: -1 }];
    case 'butterfly': return [{ kind: 'call', k: d5, qty: 1 }, { kind: 'call', k: a, qty: -2 }, { kind: 'call', k: u5, qty: 1 }];
    case 'iron_condor': return [{ kind: 'put', k: d10, qty: 1 }, { kind: 'put', k: d5, qty: -1 }, { kind: 'call', k: u5, qty: -1 }, { kind: 'call', k: u10, qty: 1 }];
    case 'covered_call': return [{ kind: 'stock', k: 0, qty: 1 }, { kind: 'call', k: u5, qty: -1 }];
    case 'protective_put': return [{ kind: 'stock', k: 0, qty: 1 }, { kind: 'put', k: d5, qty: 1 }];
    default: return [{ kind: kind, k: k, qty: 1 }];
  }
}
// each leg priced from its own quote (mid and implied volatility); the calculator's volatility moves the whole smile in parallel
function qeOptResolveLegs(legs, data, calc, baseVol) {
  var t0 = (data ? data.days : calc.days) / 365;
  return legs.map(function (lg) {
    if (lg.kind === 'stock') return Object.assign({}, lg, { cost: data ? data.dividend.s_model : calc.s, iv: null, basis: 'stock' });
    var qd = data ? qeOptQuote(data.chain, lg.k, lg.kind) : null;
    var iv = qd && qd.iv ? qd.iv : baseVol;
    var cost = qd && qd.mid ? qd.mid : QE_BS.price(lg.kind, data ? data.dividend.s_model : calc.s, lg.k, t0, calc.r, calc.q, iv);
    return Object.assign({}, lg, { cost: cost, iv: iv, basis: qd && qd.mid ? (qd.basis === 'mid' ? 'quote' : 'last') : 'model' });
  });
}
function qeOptStrategy(legs, calc, baseVol) {
  var t = Math.max(calc.days, 0) / 365, shift = calc.vol - baseVol, mult = 100;
  var value = function (lg, x, tt) { return lg.kind === 'stock' ? x : QE_BS.price(lg.kind, x, lg.k, tt, calc.r, calc.q, Math.max(0.005, lg.iv + shift)); };
  var pnl = function (x, tt) { return legs.reduce(function (a, lg) { return a + lg.qty * (value(lg, x, tt) - lg.cost); }, 0); };
  var lo = calc.s * 0.7, hi = calc.s * 1.3, N = 61, xs = [], today = [], expiry = [];
  for (var i = 0; i < N; i++) { var x = lo + (hi - lo) * i / (N - 1); xs.push(x); today.push(pnl(x, t) * mult); expiry.push(pnl(x, 0) * mult); }
  var be = [];
  for (var j = 1; j < N; j++) if ((expiry[j - 1] < 0) !== (expiry[j] < 0)) be.push(xs[j - 1] + (xs[j] - xs[j - 1]) * (0 - expiry[j - 1]) / (expiry[j] - expiry[j - 1]));
  var g = { delta: 0, gamma: 0, vega: 0, theta: 0, rho: 0 };
  legs.forEach(function (lg) {
    if (lg.kind === 'stock') { g.delta += lg.qty; return; }
    var gk = QE_BS.greeks(lg.kind, calc.s, lg.k, t, calc.r, calc.q, Math.max(0.005, lg.iv + shift));
    ['delta', 'gamma', 'vega', 'theta', 'rho'].forEach(function (key) { g[key] += lg.qty * gk[key]; });
  });
  var net = legs.reduce(function (a, lg) { return a + lg.qty * lg.cost; }, 0) * mult;
  return { xs: xs, today: today, expiry: expiry, breakevens: be, greeks: g, net: net, max: Math.max.apply(null, expiry), min: Math.min.apply(null, expiry), now: pnl(calc.s, t) * mult };
}


/* ------------------------------------------------------------------ v0.13.5 cards: scenario grid, surface, report card, VIX */
var QE_OPT_SPOT_MOVES = [-0.2, -0.1, -0.05, -0.02, 0, 0.02, 0.05, 0.1, 0.2];
var QE_OPT_VOL_SHIFTS = [0.15, 0.1, 0.05, 0, -0.05, -0.1, -0.15];  // rows from the top: volatility up first
var QE_OPT_MONEYNESS = [0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2];
var QE_OPT_REASONS = { no_quote: 'no quote', no_price: 'no bid/ask or trade', far_wing: 'too far from the forward', below_min: 'under 2 cents',
  wide_spread: 'bid–ask spread over 60%', no_iv: 'no volatility fits the price' };
// profit/loss of the strategy (one contract = 100 shares) for each stock move and volatility shift, `days` from now:
// the same legs, costs and smile as the payoff chart, so the centre cell today equals its "now" value
function qeOptScenarioGrid(legs, calc, baseVol, days, moves, shifts) {
  var tt = Math.max(calc.days - days, 0) / 365, base = calc.vol - baseVol, mult = 100;
  var value = function (lg, x, dv) { return lg.kind === 'stock' ? x : QE_BS.price(lg.kind, x, lg.k, tt, calc.r, calc.q, Math.max(0.005, lg.iv + base + dv)); };
  var rows = shifts.map(function (dv) {
    return moves.map(function (m) { var x = calc.s * (1 + m); return legs.reduce(function (a, lg) { return a + lg.qty * (value(lg, x, dv) - lg.cost); }, 0) * mult; });
  });
  var big = Math.max.apply(null, [].concat.apply([], rows).map(Math.abs)) || 1;
  return { rows: rows, moves: moves, shifts: shifts, big: big, days: days };
}
// each expiry's two-sided smile read at fixed strike/forward ratios (linear in log-moneyness, never beyond its quotes)
function qeOptSurfaceGrid(surface, cols) {
  return (surface || []).map(function (row) {
    var pts = row.points || [];
    return { expiry: row.expiry, days: row.days, cells: cols.map(function (m) {
      var x = Math.log(m);
      if (pts.length < 2 || x < pts[0][0] - 1e-9 || x > pts[pts.length - 1][0] + 1e-9) return null;
      for (var i = 1; i < pts.length; i++) {
        if (x <= pts[i][0] + 1e-12) { var a = pts[i - 1], b = pts[i]; return b[0] === a[0] ? b[1] : a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
      }
      return null;
    }) };
  });
}
// a cell colour that keeps the number readable in both themes (at most 40% of the colour over the card)
function qeOptHeat(share, color) {
  if (share === null || share === undefined || !isFinite(share)) return undefined;
  return 'color-mix(in srgb, ' + color + ' ' + Math.round(6 + Math.min(1, Math.max(0, share)) * 34) + '%, transparent)';
}
// the model report card: what the data and the models can be trusted for (a check of the inputs, not of the stock)
function qeOptReportRows(data, hs) {
  var qa = data.quality, out = [];
  if (!qa) return out;
  var p = qa.parity || {}, sm = qa.smile || {}, age = qa.age || {};
  if (p.pairs) {
    var w = (p.worst || [])[0];
    out.push({ ok: p.inside_spread / p.pairs >= 0.8, title: L('Put–call parity'),
      text: L('{a} of {b} strike pairs agree with parity within their bid–ask spreads').replace('{a}', p.inside_spread).replace('{b}', p.pairs) +
        (p.bounds ? ' (' + L('above the forward, where an American put can be worth exercising early, only the American bounds are checked') + ')' : '') +
        (w ? '; ' + L('largest gap {x} at strike {k}').replace('{x}', qeOptMoney(Math.abs(w.residual))).replace('{k}', qeOptNum(w.strike, w.strike % 1 ? 2 : 0)) : '') + '.' });
  } else {
    out.push({ ok: false, title: L('Put–call parity'), text: L('No strike has two-sided call and put quotes: parity cannot be checked.') });
  }
  if (qa.flat_rmse_iv !== null && qa.flat_rmse_iv !== undefined) {
    out.push({ ok: null, title: L('One volatility (Black–Scholes)'),
      text: L('misses the smile by {x} volatility points on average ({n} quotes).').replace('{x}', qeOptNum(qa.flat_rmse_iv * 100, 2)).replace('{n}', qa.fit_points) });
  }
  if (hs && hs.rmse_iv) {
    // the selected expiry's own error next to the one-volatility row above when it was in the fit; else the fit's figures, said so
    var own = hs.selected_in_fit && hs.selected_rmse_iv && qa.flat_rmse_iv;
    var err = own ? hs.selected_rmse_iv : hs.rmse_iv, flat = own ? qa.flat_rmse_iv : hs.flat_rmse_iv, ratio = flat / err;
    var cmp = ratio >= 1 ? L('{r}× smaller than one volatility').replace('{r}', qeOptNum(ratio, 1)) : L('{r}× larger than one volatility').replace('{r}', qeOptNum(1 / ratio, 1));
    out.push({ ok: err < flat, title: 'Heston',
      text: (own ? L('fit error {x} points on this expiry, {c} on the same quotes.') : L('fit error {x} points over all the fitted expiries, {c} on those quotes.') + (hs.selected_in_fit === false ? ' ' + L('This expiry was left out of the fit.') : ''))
        .replace('{x}', qeOptNum(err * 100, 2)).replace('{c}', cmp) });
  } else {
    out.push({ ok: null, title: 'Heston', text: L('Fit the model on the smile card to see its error here.') });
  }
  var used = (sm.used_mid || 0) + (sm.used_last || 0);
  var left = Object.keys(QE_OPT_REASONS).filter(function (k) { return sm[k]; }).map(function (k) { return L(QE_OPT_REASONS[k]) + ' ' + sm[k]; });
  out.push({ ok: used >= 5 && (sm.used_last || 0) <= used / 4, title: L('Quotes on the smile'),
    text: L('{u} of {n} strikes ({m} from bid–ask mids, {l} from last trades)').replace('{u}', used).replace('{n}', sm.strikes || 0).replace('{m}', sm.used_mid || 0).replace('{l}', sm.used_last || 0) +
      (left.length ? '; ' + L('left out') + ': ' + left.join(', ') : '') + '.' });
  var ageMin = age.chain_s !== null && age.chain_s !== undefined ? age.chain_s / 60 : null;
  if (window.QE_DEMO) { out.push({ ok: true, title: L('Data age'), text: L('fictional snapshot, no delay') + '.' }); return out; }
  out.push({ ok: !age.chain_stale, title: L('Data age'),
    text: (age.chain_stale ? L('Yahoo could not be reached: the chain is from an earlier download') : ageMin !== null && ageMin < 1 ? L('chain downloaded just now') : L('chain downloaded {x} min ago').replace('{x}', qeOptNum(ageMin || 0, 0))) +
      '; ' + L('option quotes delayed about {n} min').replace('{n}', age.delay_min || 15) + '; ' + qeOptSession(age.session || data.session) + '.' });
  return out;
}

/* ------------------------------------------------------------------ the desk */
function OptionsDesk(props) {
  var e = React.createElement;
  var st = {
    sym: useState((((window.QE_DEMO && window.QE_DEMO.symbol) || props.symbol || 'AAPL').split(/[\s,;]+/)[0] || 'AAPL').toUpperCase()), data: useState(null), loading: useState(false), error: useState(''),
    expiry: useState(''), kind: useState('call'), live: useState(false), follow: useState(true), calc: useState(null), base: useState(null),
    heston: useState(null), hestonBusy: useState(false), hestonErr: useState(''), mc: useState(null), showChain: useState(false),
    preset: useState('single'), legs: useState(null), nextAt: useState(null), fails: useState(0), flash: useState(''), tick: useState(null),
    vix: useState(null), vixBusy: useState(false), vixErr: useState(''), scen: useState({ days: 0, crush: false })
  };
  var ref = useMemo(function () { return { seq: 0, last: null, edits: 0, follow: true, pending: 0, dead: false }; }, []);
  var data = st.data[0], kind = st.kind[0];
  var calc = st.calc[0] || (data ? qeOptDefaults(data) : null);

  function load(opts) {
    opts = opts || {};
    if (ref.dead) return;
    if (opts.silent && ref.pending) return;  // a user load is under way: the minute refresh waits
    var base = opts.silent ? ref.last : null;  // a live refresh renews the snapshot on screen, not what is being typed
    var sym = String(opts.sym || (base ? base.symbol : st.sym[0]) || '').trim().toUpperCase();
    if (!sym) return;
    var exp = opts.expiry !== undefined ? opts.expiry : (base ? base.expiry : st.expiry[0]);
    var kd = opts.kind || st.kind[0];
    var strike = opts.strike !== undefined ? opts.strike : (calc && !opts.fresh ? calc.k : null);
    var seq = ++ref.seq, edits0 = ref.edits;
    if (!opts.silent) { st.loading[1](true); st.error[1](''); ref.pending = seq; }
    var qs = 'symbol=' + encodeURIComponent(sym) + '&language=' + encodeURIComponent(QE_LANG) + '&kind=' + kd + (exp ? '&expiry=' + encodeURIComponent(exp) : '') + (strike ? '&strike=' + strike : '');
    request(API + '/lab/options/desk?' + qs).then(function (d) {
      if (ref.dead || seq !== ref.seq) return;  // the desk is gone, or a newer request replaced this one
      var untouched = ref.edits === edits0;  // the user changed nothing while the request was out
      var prev = ref.last;
      ref.last = d;
      // live history on this page: one point per refresh of the same symbol and expiry
      var hkey = d.symbol + '|' + d.expiry;
      if (ref.hkey !== hkey) { ref.hkey = hkey; ref.hist = []; }
      var lastH = ref.hist[ref.hist.length - 1];
      if (!lastH || lastH.t !== d.now_utc) ref.hist = ref.hist.concat([{ t: d.now_utc, atm: d.atm_iv, iv30: d.iv30, s: d.quote.last }]).slice(-240);
      if (prev && prev.symbol === d.symbol) flashTo(d.quote.last); else ref.shown = d.quote.last;
      var defs = qeOptDefaults(d);  // inputs first: every state change re-renders at once
      if (opts.fresh || (ref.follow && untouched) || !st.calc[0]) { st.calc[1](defs); st.base[1](defs.vol); }
      if (!opts.silent || untouched) st.kind[1](d.selected.kind);
      st.expiry[1](d.expiry); st.data[1](d);
      if (opts.fresh) { st.legs[1](null); st.preset[1]('single'); st.mc[1](null); }
      if (opts.fresh || (prev && (prev.expiry !== d.expiry || prev.symbol !== d.symbol))) {  // a new snapshot: no fit for it yet
        st.heston[1](null); ref.fit = (ref.fit || 0) + 1; st.hestonBusy[1](false); st.hestonErr[1]('');
      }
      st.fails[1](0);
      if (opts.fresh) { ref.follow = true; st.follow[1](true); ref.edits++; }
      st.nextAt[1](Date.now() + (d.live && d.live.poll_s ? d.live.poll_s : 60) * 1000);
      if (props.setSymbol) props.setSymbol(d.symbol);
      if (props.setParams) props.setParams({ expiry: d.expiry, strike: d.selected.strike, option_type: d.selected.kind, heston: true });
    }).catch(function (x) {
      if (ref.dead || seq !== ref.seq) return;
      var fails = opts.silent ? st.fails[0] + 1 : st.fails[0];
      if (opts.silent) st.fails[1](fails); else st.error[1](x.message || String(x));
      if (opts.silent) st.nextAt[1](Date.now() + 60000 * Math.min(4, 1 + fails));  // back off while the source is unavailable
    }).then(function () {
      if (ref.dead) return;
      if (!opts.silent && ref.pending === seq) { ref.pending = 0; st.loading[1](false); }
    });
  }
  useEffect(function () { load({ fresh: true }); }, []);
  function flashTo(price) {  // a short green/red flash when the stock price changes
    if (ref.shown !== undefined && price !== ref.shown && isFinite(price)) {
      st.flash[1](price > ref.shown ? 'is-up' : 'is-down');
      setTimeout(function () { st.flash[1](''); }, 1600);
    }
    ref.shown = price;
  }
  function quoteTick() {  // the fast refresh: the stock price alone, every 15 s, between chain updates
    var d0 = st.data[0];
    if (!d0) return;
    request(API + '/lab/options/quote?symbol=' + encodeURIComponent(d0.symbol)).then(function (q2) {
      var cur = st.data[0];
      if (!cur || q2.symbol !== cur.symbol) return;
      flashTo(q2.last);
      st.tick[1](q2);
    }).catch(function () { /* the minute refresh reports failures */ });
  }

  function setCalc(field, value) {
    var v = parseFloat(value);
    if (!isFinite(v) || !calc) return;
    var next = Object.assign({}, calc); next[field] = v;
    ref.edits++; ref.follow = false;
    st.follow[1](false); st.calc[1](next); st.mc[1](null);
  }
  function pickStrike(k) {
    if (!calc) return;
    ref.edits++;
    var qd = data ? qeOptQuote(data.chain, k, kind) : null;
    st.calc[1](Object.assign({}, calc, qd && qd.iv && st.follow[0] ? { k: k, vol: qd.iv } : { k: k }));
    if (qd && qd.iv && st.follow[0]) st.base[1](qd.iv);
    st.mc[1](null);
    if (props.setParams && data) props.setParams({ expiry: data.expiry, strike: k, option_type: kind, heston: true });
  }
  function pickKind(kd) {
    ref.edits++;
    st.kind[1](kd); st.mc[1](null);
    if (calc && data) {
      var qd = qeOptQuote(data.chain, calc.k, kd);
      if (qd && qd.iv && st.follow[0]) { st.calc[1](Object.assign({}, calc, { vol: qd.iv })); st.base[1](qd.iv); }
      if (props.setParams) props.setParams({ expiry: data.expiry, strike: calc.k, option_type: kd, heston: true });
    }
  }
  function fitHeston() {
    if (!data || st.hestonBusy[0]) return;
    st.hestonBusy[1](true); st.hestonErr[1]('');
    var forSym = data.symbol, forExp = data.expiry, fit = ref.fit = (ref.fit || 0) + 1;
    // the desk may have moved to another expiry or stock while the fit ran: its answer then belongs to nobody
    var current = function () { return !ref.dead && fit === ref.fit && ref.last && ref.last.symbol === forSym && ref.last.expiry === forExp; };
    post(API + '/lab/options/heston', { symbol: forSym, expiry: forExp, strike: calc ? calc.k : null, kind: kind, language: QE_LANG })
      .then(function (h) { if (current() && h.symbol === forSym && h.expiry === forExp) st.heston[1](h); })
      .catch(function (x) { if (current()) st.hestonErr[1](x.message || String(x)); })
      .then(function () { if (!ref.dead && fit === ref.fit) st.hestonBusy[1](false); });
  }
  function loadVix() {  // the Cboe formula on SPY's chain, next to the official index (two chain downloads, on request only)
    if (st.vixBusy[0]) return;
    st.vixBusy[1](true); st.vixErr[1]('');
    request(API + '/lab/options/vix?symbol=SPY&language=' + encodeURIComponent(QE_LANG))
      .then(function (v) { if (!ref.dead) st.vix[1](v); })
      .catch(function (x) { if (!ref.dead) st.vixErr[1](x.message || String(x)); })
      .then(function () { if (!ref.dead) st.vixBusy[1](false); });
  }
  function runMc() {
    if (!calc) return;
    var t = Math.max(calc.days, 0) / 365;
    st.mc[1](Object.assign(QE_BS.monteCarlo(kind, calc.s, calc.k, t, calc.r, calc.q, calc.vol, 100000), { bs: QE_BS.price(kind, calc.s, calc.k, t, calc.r, calc.q, calc.vol) }));
  }
  function writeNote() {
    if (!data || !props.onRun) return;
    var listed = calc && strikes.indexOf(calc.k) >= 0;
    props.onRun({ tickers: data.symbol, params: { expiry: data.expiry, strike: listed ? calc.k : data.selected.strike, option_type: kind, heston: true } });
  }

  // ---- computed figures
  var t = calc ? Math.max(calc.days, 0) / 365 : 0;
  var strikes = data ? data.chain.map(function (x) { return x.strike; }) : [];
  var mkt = data && calc && Math.abs(calc.days - (data.days_quote || data.days)) < 0.05 ? qeOptQuote(data.chain, calc.k, kind) : null;
  var amMid = st.follow[0] && mkt && mkt.mid && mkt.basis === 'mid' ? mkt.mid : null;
  var out = useMemo(function () {
    if (!calc) return null;
    // following the market, the American value is priced at its own (American) implied volatility, so it equals the
    // quote and the early-exercise value is not counted twice; with your own inputs it uses your volatility
    var amVol = amMid ? QE_BS.americanImpliedVol(amMid, kind, calc.s, calc.k, t, calc.r, calc.q, 120) : null;
    return { g: QE_BS.greeks(kind, calc.s, calc.k, t, calc.r, calc.q, calc.vol), am: QE_BS.american(kind, calc.s, calc.k, t, calc.r, calc.q, amVol || calc.vol, 200), amVol: amVol };
  }, [calc, kind, amMid]);
  // the stock price when the quotes were made (from the server), for the nowcast
  var sq = data && data.quote_stock && data.quote_stock.price;
  var baseVol = st.base[0] || (calc ? calc.vol : 0.3);
  var legs = st.legs[0] || (calc ? [{ kind: kind, k: calc.k, qty: 1 }] : []);
  var resolved = calc ? qeOptResolveLegs(legs, data, calc, baseVol) : [];
  if (calc && st.preset[0] === 'single' && !st.legs[0] && resolved[0]) { resolved[0].iv = baseVol; if (!mkt) resolved[0].cost = QE_BS.price(kind, calc.s, calc.k, t, calc.r, calc.q, calc.vol); }
  var strat = calc ? qeOptStrategy(resolved, calc, baseVol) : null;

  // ---- render helpers
  function slider(field, label, min, max, step, shown) {
    var v = calc[field];
    return e('label', { key: field, className: 'opt-slider' },
      e('span', { className: 'opt-slider-head' }, e('span', null, label), e('strong', null, shown)),
      e('input', { type: 'range', min: min, max: max, step: step, value: v, 'aria-label': label, 'aria-valuetext': shown, onChange: function (ev) { setCalc(field, ev.target.value); } }));
  }
  function strikeSlider() {  // steps through the listed strikes only
    var idx = Math.max(0, strikes.reduce(function (b, k, i) { return Math.abs(k - calc.k) < Math.abs(strikes[b] - calc.k) ? i : b; }, 0));
    return e('label', { key: 'k', className: 'opt-slider' },
      e('span', { className: 'opt-slider-head' }, e('span', null, L('Strike')), e('strong', null, qeOptMoney(calc.k))),
      e('input', { type: 'range', min: 0, max: Math.max(strikes.length - 1, 0), step: 1, value: idx, 'aria-label': L('Strike'), 'aria-valuetext': qeOptMoney(calc.k),
        onChange: function (ev) { var k = strikes[parseInt(ev.target.value, 10)]; if (k !== undefined) pickStrike(k); } }));
  }
  function kpi(label, value, note, extra) {
    return e('div', { key: label, className: 'kpi' + (extra || '') }, e('dt', null, label), e('dd', { className: 'kpi-value' }, value), note ? e('dd', { className: 'kpi-note' }, note) : null);
  }

  var head = e('div', { className: 'opt-top' },
    e('label', { className: 'form-label opt-sym' }, L('Ticker'),
      e('input', { value: st.sym[0], spellCheck: false, placeholder: 'AAPL', onChange: function (ev) { st.sym[1](ev.target.value.toUpperCase()); },
        onKeyDown: function (ev) { if (ev.key === 'Enter') load({ sym: ev.target.value, expiry: '', fresh: true }); } })),
    e(Button, { variant: 'primary', icon: 'refresh', loading: st.loading[0], onClick: function () { load({ sym: st.sym[0], expiry: '', fresh: true }); } }, L('Load live options')),
    data && e('label', { className: 'opt-live' },
      e('input', { type: 'checkbox', checked: st.live[0], onChange: function (ev) { st.live[1](ev.target.checked); if (ev.target.checked) load({ silent: true }); } }),
      e('span', null, L('Live (refresh every minute)'))),
    data && st.live[0] && e(QeOptClock, { next: st.nextAt[0] }));

  if (!data) {
    return e('section', { className: 'opt-desk', 'aria-label': L('Options desk') }, e(QeOptLife, { key: 'life', onUnmount: function () { ref.dead = true; } }), head,
      st.error[0] ? e(Notice, { type: 'amber' }, L(st.error[0])) : e('p', { className: 'micro muted' }, st.loading[0] ? L('Downloading the option chain…') : L('Enter a US stock or ETF and load its listed options.')));
  }

  var tk = st.tick[0];
  var q = tk && tk.symbol === data.symbol && String(tk.last_time || '') >= String(data.quote.last_time || '') ? tk : data.quote;
  var sk = data.skew || {}, hv = data.hv || {};
  var status = e('div', { className: 'opt-status' },
    e('span', { className: 'opt-pill is-' + String(data.session).toLowerCase(), role: 'status' }, qeOptSession(data.session)),
    e('span', { className: 'micro' }, data.now_et.slice(11) + ' ' + L('New York') + ' · ' + L('chain') + ' ' + qeOptTime(data.live.fetched_utc || data.now_utc) + (q !== data.quote ? ' · ' + L('stock') + ' ' + qeOptTime(q.now_utc) : '')),
    e('span', { className: 'micro muted' }, L('Stock') + ': ' + q.source + (window.QE_DEMO ? ' · ' + L('fictional snapshot, no delay') : ' · ' + L('options delayed about {n} min').replace('{n}', String(data.live.options_delay_min || 15)) + ' · Yahoo Finance')),
    st.fails[0] > 0 && e('span', { className: 'micro opt-warn', role: 'alert' }, L('Live refresh failed; showing the last snapshot.')));

  var kpis = e('dl', { className: 'kpi-strip opt-kpis', 'aria-label': L('Live market') },
    e('div', { className: 'kpi opt-price ' + st.flash[0] }, e('dt', null, q.name || data.symbol),
      e('dd', { className: 'kpi-value' }, qeOptMoney(q.last)),
      e('dd', { className: 'kpi-note' }, (q.change_pct !== null && q.change_pct !== undefined ? qeOptPct(q.change_pct / 100, 2, true) + ' · ' : '') + (data.session === 'REGULAR' ? L('live') : L('last regular') + ' ' + qeOptMoney(q.s))),
      e('dd', null, qeOptSpark(e, q.bars))),
    kpi(L('At-the-money volatility'), qeOptPct(data.atm_iv), data.expiry + ' · ' + qeOptNum(data.days, 1) + ' ' + L('days')),
    kpi(L('30-day implied volatility'), qeOptPct(data.iv30), hv.d21 ? L('realised 21 days') + ' ' + qeOptPct(hv.d21) : ''),
    kpi(L('Skew (25-delta)'), sk.rr25 !== undefined ? qeOptNum(sk.rr25 * 100, 1) + ' ' + L('pts') : '—', sk.put25 ? L('put') + ' ' + qeOptPct(sk.put25) + ' · ' + L('call') + ' ' + qeOptPct(sk.call25) : ''),
    kpi(L('Risk-free rate'), qeLabPct(data.rate.pct, 2, ''), L('Treasury, matched to the expiry') + ' · ' + L('continuously compounded') + ' ' + qeOptPct(data.rate.r, 2)),
    kpi(L('Forward'), qeOptMoney(data.dividend.forward), data.dividend.forward_basis === 'parity' ? L('from put–call parity') : L('from the dividend yield')));

  var selectors = e('div', { className: 'opt-selectors' },
    e('label', { className: 'form-label' }, L('Expiry'),
      e('select', { value: data.expiry, onChange: function (ev) { load({ sym: data.symbol, expiry: ev.target.value, fresh: true, strike: null }); } },
        data.expiries.map(function (x) { return e('option', { key: x.expiry, value: x.expiry }, x.expiry + ' · ' + qeOptNum(x.days, x.days < 10 ? 1 : 0) + ' ' + L('days')); }))),
    e('label', { className: 'form-label' }, L('Strike'),
      e('select', { value: String(calc.k), onChange: function (ev) { pickStrike(parseFloat(ev.target.value)); } },
        strikes.map(function (k) { return e('option', { key: k, value: String(k) }, qeOptNum(k, k % 1 ? 2 : 0) + (Math.abs(k - data.dividend.forward) === Math.min.apply(null, strikes.map(function (x) { return Math.abs(x - data.dividend.forward); })) ? ' · ATM' : '')); }))),
    e('div', { className: 'form-label' }, e('span', null, L('Option type')),
      e('div', { className: 'opt-toggle', role: 'radiogroup', 'aria-label': L('Option type') },
        ['call', 'put'].map(function (kd) {
          return e('button', { key: kd, type: 'button', role: 'radio', 'aria-checked': kind === kd, tabIndex: kind === kd ? 0 : -1, className: kind === kd ? 'is-selected' : '',
            onClick: function () { pickKind(kd); },
            onKeyDown: function (ev) {
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(ev.key) < 0) return;
              ev.preventDefault();
              var other = kd === 'call' ? 'put' : 'call', box = ev.currentTarget.parentNode;
              pickKind(other);
              var btn = box && box.querySelectorAll('button')[other === 'call' ? 0 : 1];
              if (btn) btn.focus();
            } }, kd === 'call' ? L('Call') : L('Put'));
        }))));

  var g = out.g, am = out.am, model = g.price;
  var calcCard = e('section', { className: 'opt-card opt-calc', 'aria-labelledby': 'opt-calc-title' },
    e('div', { className: 'opt-card-head' }, e('h3', { id: 'opt-calc-title' }, L('Black–Scholes calculator')),
      e('div', { className: 'opt-card-actions' },
        e('button', { type: 'button', className: 'tiny-link', onClick: function () { ref.follow = true; ref.edits++; st.follow[1](true); var d0 = qeOptDefaults(data); d0.k = calc.k; var qd = qeOptQuote(data.chain, calc.k, kind); if (qd && qd.iv) d0.vol = qd.iv; st.calc[1](d0); st.base[1](d0.vol); st.mc[1](null); } }, L('Reset to market')),
        e('button', { type: 'button', className: 'tiny-link', onClick: function () { setCalc('s', q.last); } }, L('Use the latest stock price')))),
    e('p', { className: 'micro muted' }, st.follow[0] ? L('Following the market: inputs update with every refresh.') : L('Your own inputs: live refreshes update the market figures only.')),
    e('div', { className: 'opt-sliders' },
      slider('s', L('Stock price'), +(data.dividend.s_model * 0.5).toFixed(2), +(data.dividend.s_model * 1.5).toFixed(2), 0.01, qeOptMoney(calc.s)),
      strikeSlider(),
      slider('days', L('Days to expiry'), 0, Math.max(730, Math.ceil(data.days)), 0.1, qeOptNum(calc.days, 1)),
      slider('vol', L('Volatility σ'), 0.01, 2, 0.001, qeOptPct(calc.vol)),
      slider('r', L('Risk-free rate r'), -0.01, 0.1, 0.0005, qeOptPct(calc.r, 2)),
      slider('q', L('Dividend yield q'), 0, 0.1, 0.0005, qeOptPct(calc.q, 2))),
    e('div', { className: 'opt-results' },
      e('div', { className: 'opt-big' }, e('span', null, L('Black–Scholes value') + ' (' + (kind === 'call' ? L('call') : L('put')) + ')'), e('strong', null, qeOptMoney(model)),
        e('small', null, L('per share') + ' · ' + qeOptMoney(model * 100) + ' ' + L('per contract'))),
      mkt && (mkt.mid ? e('div', { className: 'opt-big' }, e('span', null, mkt.basis === 'mid' ? L('Market mid (delayed)') : L('Last trade (no bid/ask, may be stale)')), e('strong', null, qeOptMoney(mkt.mid)),
        e('small', null, (mkt.basis === 'mid' ? qeOptMoney(mkt.bid) + ' / ' + qeOptMoney(mkt.ask) : (mkt.last_trade ? String(mkt.last_trade).slice(0, 16).replace('T', ' ') : L('last trade'))) + ' · ' + L('implied volatility') + ' ' + qeOptPct(mkt.iv)))
        : e('div', { className: 'opt-big' }, e('span', null, L('No usable quote')), e('strong', null, '—'),
          e('small', null, L('bid') + ' ' + qeOptMoney(mkt.bid) + ' / ' + L('ask') + ' ' + qeOptMoney(mkt.ask)))),
      mkt && mkt.mid && e('div', { className: 'opt-big' }, e('span', null, L('Model minus market')), e('strong', { className: Math.abs(model - mkt.mid) < 0.005 ? '' : model - mkt.mid > 0 ? 'up' : 'down' }, qeOptMoney(model - mkt.mid)),
        e('small', null, L('a difference in inputs, not a signal'))),
      mkt && mkt.iv && mkt.mid && sq && Math.abs(q.last / sq - 1) > 0.0002 && e('div', { className: 'opt-big opt-nowcast' }, e('span', null, L('Nowcast at the latest stock price')),
        // the move since the quotes, on the expiry's own option-implied stock price, added to the quote
        e('strong', null, qeOptMoney(qeOptNowcast(data, kind, calc.k, mkt, q.last))),
        e('small', null, L('stock') + ' ' + qeOptMoney(q.last) + ' · ' + L('quotes were at') + ' ' + qeOptMoney(sq) + ' · ' + L('same implied volatility'))),
      e('div', { className: 'opt-big' }, e('span', null, L('American (binomial tree)')), e('strong', null, qeOptMoney(am.price)),
        e('small', null, L('early-exercise premium') + ' ' + qeOptMoney(am.premium) + (out.amVol ? ' · ' + L('at the American implied volatility') + ' ' + qeOptPct(out.amVol) : '')))),
    e('table', { className: 'opt-greeks' },
      e('thead', null, e('tr', null, e('th', null, L('Greek')), e('th', { className: 'num' }, L('Per share')), e('th', { className: 'num' }, L('Per contract')), e('th', null, L('Meaning')))),
      e('tbody', null,
        [['Delta', qeOptNum(g.delta, 3), qeOptNum(g.delta * 100, 1), L('change for a $1 rise in the stock')],
         ['Gamma', qeOptNum(g.gamma, 4), qeOptNum(g.gamma * 100, 2), L('change in delta for a $1 rise')],
         ['Vega', qeOptMoney(g.vega), qeOptMoney(g.vega * 100), L('change for +1 volatility point')],
         ['Theta', qeOptMoney(g.theta), qeOptMoney(g.theta * 100), L('change as one day passes')],
         ['Rho', qeOptMoney(g.rho), qeOptMoney(g.rho * 100), L('change for +1 point in rates')]].map(function (row) {
          return e('tr', { key: row[0] }, e('td', null, row[0]), e('td', { className: 'num' }, row[1]), e('td', { className: 'num' }, row[2]), e('td', { className: 'micro' }, row[3]));
        }))),
    e('p', { className: 'micro' }, L('Finishes in the money (risk-neutral N(d₂), ignores the skew)') + ': ' + qeOptPct(g.prob_itm) + ' · ' + L('break-even at expiry') + ': ' +
      qeOptMoney(kind === 'call' ? calc.k + model : calc.k - model) + ' · ±1σ ' + L('move to expiry') + ': ' + qeOptMoney(calc.s * ((st.follow[0] && data.atm_iv) || calc.vol) * Math.sqrt(t))),
    (data.days_quote || data.days) - data.days > 0.01 && e('p', { className: 'micro muted' }, L('Outside regular hours the time to expiry is counted from the last close, when the quotes were made.')),
    e('div', { className: 'opt-row' },
      e('button', { type: 'button', className: 'btn subtle', onClick: runMc }, L('Check with Monte Carlo (100,000 paths)')),
      st.mc[0] && e('span', { className: 'micro' }, L('Monte Carlo') + ' ' + qeOptMoney(st.mc[0].price) + ' (' + qeLabPct(95, 0, '').replace(' %', '\u00a0%') + ': ' + qeOptMoney(st.mc[0].lo) + ' – ' + qeOptMoney(st.mc[0].hi) + ') · Black–Scholes ' + qeOptMoney(st.mc[0].bs) +
        (st.mc[0].bs >= st.mc[0].lo && st.mc[0].bs <= st.mc[0].hi ? ' · ✓ ' + L('inside the interval') : ''))));

  // strategy & payoff chart
  var stratCard = e('section', { className: 'opt-card', 'aria-labelledby': 'opt-strat-title' },
    e('div', { className: 'opt-card-head' }, e('h3', { id: 'opt-strat-title' }, L('Payoff and strategies')),
      e('select', { value: st.preset[0], 'aria-label': L('Strategy'), onChange: function (ev) {
        st.preset[1](ev.target.value);
        st.legs[1](ev.target.value === 'single' ? null : qeOptPreset(ev.target.value, strikes, data.dividend.forward, kind, calc.k));
      } }, QE_OPT_PRESETS.map(function (p) { return e('option', { key: p[0], value: p[0] }, L(p[1])); }))),
    st.legs[0] && e('div', { className: 'opt-legs-wrap' }, e('table', { className: 'opt-legs' },
      e('thead', null, e('tr', null, e('th', null, L('Contracts')), e('th', null, L('Leg')), e('th', { className: 'num' }, L('Strike')), e('th', { className: 'num' }, L('Price')), e('th', { className: 'num' }, L('Implied volatility')))),
      e('tbody', null, resolved.map(function (lg, i) {
        var setLeg = function (patch) { var copy = st.legs[0].slice(); copy[i] = Object.assign({}, copy[i], patch); st.legs[1](copy); };
        return e('tr', { key: i },
          e('td', null, e('span', { className: 'opt-qty' },
            e('button', { type: 'button', 'aria-label': L('Decrease'), onClick: function () { setLeg({ qty: lg.qty - 1 || -1 }); } }, '−'),
            e('strong', null, (lg.qty > 0 ? '+' : '') + lg.qty),
            e('button', { type: 'button', 'aria-label': L('Increase'), onClick: function () { setLeg({ qty: lg.qty + 1 || 1 }); } }, '+'))),
          e('td', null, lg.kind === 'stock' ? L('Stock (100 shares)') : lg.kind === 'call' ? L('Call') : L('Put')),
          e('td', { className: 'num' }, lg.kind === 'stock' ? '—' : e('select', { value: String(lg.k), 'aria-label': L('Strike') + ' · ' + (lg.kind === 'call' ? L('Call') : L('Put')), onChange: function (ev) { setLeg({ k: parseFloat(ev.target.value) }); } },
            strikes.map(function (k) { return e('option', { key: k, value: String(k) }, qeOptNum(k, k % 1 ? 2 : 0)); }))),
          e('td', { className: 'num' }, qeOptMoney(lg.cost) + (lg.basis === 'model' ? ' *' : lg.basis === 'last' ? ' †' : '')),
          e('td', { className: 'num' }, lg.iv ? qeOptPct(lg.iv) : '—'));
      })))),
    e(LabChart, { width: 460, chart: { kind: 'line', title: L('Profit / loss by stock price (one contract = 100 shares)'),
      x: strat.xs.map(function (x) { return qeOptNum(x, x < 20 ? 2 : 0); }),
      series: [{ name: L('Today (model)'), values: strat.today.map(function (v) { return Math.round(v * 100) / 100; }) },
               { name: L('At expiry'), values: strat.expiry.map(function (v) { return Math.round(v * 100) / 100; }) }], fmt: 'num' } }),
    e('p', { className: 'micro' }, (strat.net >= 0 ? L('Net cost') : L('Net credit')) + ': ' + qeOptMoney(Math.abs(strat.net)) + ' · ' + L('best on the chart') + ' ' + qeOptMoney(strat.max) +
      ' · ' + L('worst on the chart') + ' ' + qeOptMoney(strat.min) + (strat.breakevens.length ? ' · ' + L('break-even') + ' ' + strat.breakevens.map(function (b) { return qeOptMoney(b); }).join(', ') : '') +
      ' · Δ ' + qeOptNum(strat.greeks.delta * 100, 1) + ' · Θ ' + qeOptMoney(strat.greeks.theta * 100) + '/' + L('day') + ' · ν ' + qeOptMoney(strat.greeks.vega * 100)),
    e('p', { className: 'micro muted' }, L('Each leg uses its own quote and implied volatility; moving the volatility slider shifts the whole smile. * = no quote, model price; † = last trade, may be stale. An educational payoff diagram, not a trade idea.')));

  // smile & term structure
  var hs = st.heston[0];
  var smile = (data.smile || []).filter(function (p) { return Math.abs(p.logm) <= 0.35; });  // the deep wings are mostly stale last trades
  var interpH = function (k) {
    if (!hs || !hs.grid) return null;
    var ks = hs.grid.strikes, vs = hs.grid.model_iv;
    for (var i = 1; i < ks.length; i++) if (k >= ks[i - 1] && k <= ks[i] && vs[i - 1] && vs[i]) return (vs[i - 1] + (vs[i] - vs[i - 1]) * (k - ks[i - 1]) / (ks[i] - ks[i - 1])) * 100;
    return null;
  };
  var smileSeries = [{ name: L('Market (mid)'), values: smile.map(function (p) { return p.basis === 'mid' ? Math.round(p.iv * 10000) / 100 : null; }) }];
  if (smile.some(function (p) { return p.basis !== 'mid'; })) smileSeries.push({ name: L('Market (last trade)'), values: smile.map(function (p) { return p.basis !== 'mid' ? Math.round(p.iv * 10000) / 100 : null; }) });
  if (data.atm_iv) smileSeries.push({ name: L('Black–Scholes (flat)'), values: smile.map(function () { return Math.round(data.atm_iv * 10000) / 100; }) });
  if (hs) smileSeries.push({ name: 'Heston', values: smile.map(function (p) { var v = interpH(p.strike); return v === null ? null : Math.round(v * 100) / 100; }) });
  var smileCard = e('section', { className: 'opt-card', 'aria-labelledby': 'opt-smile-title' },
    e('div', { className: 'opt-card-head' }, e('h3', { id: 'opt-smile-title' }, L('Volatility smile')),
      e(Button, { variant: hs ? 'subtle' : 'primary', icon: 'spark', loading: st.hestonBusy[0], onClick: fitHeston }, hs ? L('Refit Heston') : L('Fit the Heston stochastic-volatility model'))),
    smile.length > 2 ? e(LabChart, { width: 460, chart: { kind: 'line', title: L('Implied volatility by strike') + ' · ' + data.expiry, x: smile.map(function (p) { return qeOptNum(p.strike, p.strike % 1 ? 1 : 0); }), series: smileSeries, fmt: 'pct' } })
      : e('p', { className: 'micro muted' }, L('Too few quotes to draw the smile for this expiry.')),
    data.days > 90 && (data.smile || []).some(function (p) { return p.early_exercise; }) && e('p', { className: 'micro muted' }, L('Puts on this expiry: the early-exercise value is removed (European-equivalent volatility); the calculator still reprices each quote exactly.')),
    st.hestonErr[0] && e(Notice, { type: 'amber' }, L(st.hestonErr[0])),
    hs && e('div', { className: 'opt-heston' },
      e('p', { className: 'micro' }, L('Heston fit error') + ' ' + qeOptNum(hs.rmse_iv * 100, 2) + ' ' + L('pts') + ' · ' + L('one-volatility Black–Scholes') + ' ' + qeOptNum(hs.flat_rmse_iv * 100, 2) + ' ' + L('pts') +
        ' · ' + hs.points + ' ' + L('options') + ', ' + hs.slices.length + ' ' + L('expiries') + ' · ' + qeOptNum(hs.seconds, 1) + ' ' + L('s')),
      e('dl', { className: 'opt-params' },
        [['√v₀', qeOptPct(hs.vol0), L('volatility now')], ['√θ', qeOptPct(hs.vol_long), L('long-run volatility')], ['κ', qeOptNum(hs.params.kappa, 2) + (hs.kappa_fixed ? ' (' + L('fixed') + ')' : ''), L('mean-reversion speed')],
         ['ξ', qeOptNum(hs.params.xi, 2), L('volatility of volatility')], ['ρ', qeOptNum(hs.params.rho, 2), L('price–volatility correlation')],
         ['Feller', hs.feller ? '✓' : '✗', L('2κθ ≥ ξ²')]].map(function (r0) { return e('div', { key: r0[0] }, e('dt', null, r0[0]), e('dd', null, e('strong', null, r0[1]), e('small', null, r0[2]))); })),
      hs.selected_price !== null && hs.selected_price !== undefined && hs.priced && e('p', { className: 'micro' }, L('Heston value of the selected contract') + ' (' + qeOptNum(hs.priced.strike, 2) + ' ' + (hs.priced.kind === 'call' ? L('call') : L('put')) + '): ' + qeOptMoney(hs.selected_price) +
        (hs.priced.mid ? ' · ' + (hs.priced.basis && hs.priced.basis !== 'mid' ? L('last trade') + (hs.priced.last_trade ? ' (' + String(hs.priced.last_trade).slice(0, 10) + ')' : '') : L('market mid')) + ' ' + qeOptMoney(hs.priced.mid) : '') +
        (hs.priced.early_exercise ? ' (' + L('of which early-exercise value') + ' ≈ ' + qeOptMoney(hs.priced.early_exercise) + '; ' + L('Heston is European') + ')' : '')),
      hs.selected_in_fit === false && e('p', { className: 'micro muted' }, L('This expiry was left out of the fit') +
        ({ short: ' (' + L('under 14 days') + ')', few_quotes: ' (' + L('fewer than 5 strikes with bid and ask') + ')', too_close: ' (' + L('under 2 days to expiry') + ')' }[hs.selected_left_out] || '') +
        '; ' + (hs.selected_rmse_iv !== null && hs.selected_rmse_iv !== undefined ? L('error on it') + ' ' + qeOptNum(hs.selected_rmse_iv * 100, 2) + ' ' + L('pts') : L('no error could be computed on it')))),
    e('p', { className: 'micro muted' }, L('Black–Scholes assumes one volatility for every strike (the flat line). The market’s smile shows it does not hold; a stochastic-volatility model such as Heston explains much of it.')));


  // model report card
  var reportRows = qeOptReportRows(data, hs);
  var reportCard = reportRows.length > 0 && e('section', { className: 'opt-card opt-report', 'aria-labelledby': 'opt-report-title' },
    e('h3', { id: 'opt-report-title' }, L('Model report card')),
    e('ul', { className: 'opt-report-list' }, reportRows.map(function (r0, i) {
      var cls = r0.ok === true ? 'is-ok' : r0.ok === false ? 'is-warn' : 'is-info';
      return e('li', { key: i, className: cls },
        e('span', { className: 'opt-report-mark', 'aria-hidden': 'true' }, r0.ok === true ? '✓' : r0.ok === false ? '!' : 'i'),
        e('div', null, e('span', { className: 'sr-only' }, (r0.ok === true ? L('Good') : r0.ok === false ? L('Check') : L('Note')) + ': '), e('strong', null, r0.title), ' ', qeOptKeepUnits(r0.text)));
    })),
    e('p', { className: 'micro muted' }, L('A check of the quotes and the models, not of the stock.')));

  // the VIX from SPY options, next to the official index
  var vx = st.vix[0];
  var vixShare = vx && vx.terms && vx.terms[0] ? vx.terms[0] : null;
  var demo = !!window.QE_DEMO;
  // the official index next to my calculation; in the demo (no official index for a fictional stock) the model's exact value
  var vxRef = !vx ? null : vx.official ? { label: L('Official VIX'), value: vx.official.value, note: 'Yahoo Finance · ' + qeOptTime(vx.official.time_utc), diff: L('my calculation minus the official index') }
    : vx.reference ? { label: vx.reference.label, value: vx.reference.value, note: L('closed-form value of the Heston model'), diff: L('my calculation minus the true value') } : null;
  var vixCard = e('section', { className: 'opt-card opt-vix', 'aria-labelledby': 'opt-vix-title' },
    e('div', { className: 'opt-card-head' }, e('h3', { id: 'opt-vix-title' }, L('I computed the VIX myself')),
      e(Button, { variant: vx ? 'subtle' : 'primary', icon: 'refresh', loading: st.vixBusy[0], onClick: loadVix }, vx ? L('Compute again') : L(demo ? 'Compute from the demo options' : 'Compute from SPY options'))),
    e('p', { className: 'micro muted' }, L(demo ? 'The Cboe VIX formula run on the demo stock’s options (two expiries around 30 days), next to the model’s true value.' : 'The Cboe VIX formula run on SPY’s listed options (two expiries around 30 days), next to the official index.')),
    st.vixErr[0] && e(Notice, { type: 'amber' }, L(st.vixErr[0])),
    vx && e('div', { className: 'opt-results' },
      e('div', { className: 'opt-big' }, e('span', null, L('My calculation')), e('strong', null, qeOptNum(vx.value, 2)),
        e('small', null, vx.symbol + ' · ' + vx.terms.map(function (x) { return x.expiry + ' (' + qeOptNum(x.days, 1) + ' ' + L('days') + ')'; }).join(' + '))),
      vxRef ? e('div', { className: 'opt-big' }, e('span', null, vxRef.label), e('strong', null, qeOptNum(vxRef.value, 2)), e('small', null, vxRef.note))
        : e('div', { className: 'opt-big' }, e('span', null, L('Official VIX')), e('strong', null, '—'), e('small', null, L('not available right now'))),
      vxRef && e('div', { className: 'opt-big' }, e('span', null, L('Difference')), e('strong', null, (vx.value - vxRef.value >= 0 ? '+' : '−') + qeOptNum(Math.abs(vx.value - vxRef.value), 2) + ' ' + L('pts')),
        e('small', null, vxRef.diff))),
    vx && e('div', { className: 'opt-legs-wrap' }, e('table', { className: 'opt-greeks opt-vix-terms' },
      e('thead', null, e('tr', null, [L('Expiry'), L('Days'), L('Forward'), 'K₀', L('Strikes used'), L('Volatility')].map(function (h, i) { return e('th', { key: i, className: i ? 'num' : '' }, h); }))),
      e('tbody', null, vx.terms.map(function (x) {
        return e('tr', { key: x.expiry }, e('td', null, x.expiry), e('td', { className: 'num' }, qeOptNum(x.days, 1)), e('td', { className: 'num' }, qeOptMoney(x.forward)),
          e('td', { className: 'num' }, qeOptNum(x.k0, x.k0 % 1 ? 1 : 0)), e('td', { className: 'num' }, x.strikes + ' (' + x.puts + ' ' + L('puts') + ', ' + x.calls + ' ' + L('calls') + ')'),
          e('td', { className: 'num' }, qeOptPct(x.vol)));
      })))),
    // each strike's term is ΔK wide: per dollar of strike the curve does not jump where the listed spacing changes
    vixShare && vixShare.contrib && vixShare.contrib.length > 3 && e(LabChart, { width: 460, chart: { kind: 'line', title: L('Share of the variance per $1 of strike') + ' · ' + vixShare.expiry,
      x: vixShare.contrib.map(function (c) { return qeOptNum(c.strike, c.strike % 1 ? 1 : 0); }),
      series: [{ name: L('share of the variance'), values: vixShare.contrib.map(function (c) { return Math.round(c.variance / c.dk / vixShare.sigma2 * 100000) / 1000; }) }], fmt: 'pct' } }),
    vixShare && vixShare.contrib && (function () {
      var part = function (side) { return vixShare.contrib.filter(function (c) { return c.side === side; }).reduce(function (a, c) { return a + c.variance; }, 0) / vixShare.sigma2; };
      var pp = part('put'), cc = part('call');
      return e('p', { className: 'micro' }, qeOptKeepUnits(L('Out-of-the-money puts give {p} of this variance and calls {c}.').replace('{p}', qeOptPct(pp, 0)).replace('{c}', qeOptPct(cc, 0)) +
        (pp > cc ? ' ' + L('The market pays more for protection against falls than for bets on rises.') : '')));
    })(),
    e('details', { className: 'opt-vix-how' }, e('summary', null, L('How it is computed')),
      e('ol', { className: 'opt-vix-steps' },
        [L('Take the two expiries around 30 days (23 to 37 days when listed).'),
         L('For each, the forward comes from put–call parity at the strike where call and put prices are closest; K₀ is the strike just below it.'),
         L('Add up the out-of-the-money options from K₀ outwards, each weighted by ΔK/K²; a strike without a bid is skipped, two in a row end the side.'),
         L('σ² = (2/T) Σ ΔK/K² · e^{RT} · Q(K) − (1/T)(F/K₀ − 1)²'),
         L('Interpolate the two variances to 30 days and annualise: VIX = 100 √σ²₃₀.')].map(function (t0, i) { return e('li', { key: i }, t0); }))),
    vx && e('ul', { className: 'micro muted opt-vix-notes' }, vx.notes.map(function (n0, i) { return e('li', { key: i }, qeOptKeepUnits(n0)); })),
    vx && vx.stale && e('p', { className: 'micro opt-warn' }, L('Some of these quotes are from an earlier download.')));

  // scenario grid: profit/loss for stock moves x volatility shifts
  var ev = data.event_vol;
  var crush = ev && ev.in_selected && ev.drop !== null && ev.drop !== undefined && ev.drop < 0 ? Math.round(ev.drop * 1000) / 1000 : null;  // only a fall is a crush
  if (crush === 0) crush = null;
  var afterDays = crush !== null ? Math.min(Math.ceil(ev.days_to_event + 0.5), Math.max(Math.floor((calc.days - 0.1) * 10) / 10, 0)) : null;
  var sc = st.scen[0];
  var horizons = [[0, L('Today')], [7, L('In a week')], [Math.floor(calc.days / 2), L('Half way to expiry')]].filter(function (h0) { return h0[0] < calc.days; });
  if (afterDays !== null && afterDays > 0) horizons.push([afterDays, L('Day after the results')]);
  // the grid is always computed for a date the select shows: after a change of expiry or days, the latest one still available
  var hDays = horizons.some(function (h0) { return h0[0] === sc.days; }) ? sc.days
    : horizons.reduce(function (best, h0) { return h0[0] <= sc.days && h0[0] > best ? h0[0] : best; }, 0);
  var shifts = QE_OPT_VOL_SHIFTS.slice();
  if (crush !== null && shifts.indexOf(crush) < 0) { shifts.push(crush); shifts.sort(function (a, b) { return b - a; }); }
  var grid = qeOptScenarioGrid(resolved, calc, baseVol, hDays, QE_OPT_SPOT_MOVES, shifts);
  var signedMoney = function (v) { return (v >= 0 ? '+' : '−') + qeOptNum(Math.abs(v), 0); };
  var scenCard = e('section', { className: 'opt-card opt-scenario', 'aria-labelledby': 'opt-scen-title' },
    e('div', { className: 'opt-card-head' }, e('h3', { id: 'opt-scen-title' }, L('Scenario grid')),
      e('select', { value: String(hDays), 'aria-label': L('Scenario date'), onChange: function (ev0) { st.scen[1]({ days: parseFloat(ev0.target.value), crush: false }); } },
        horizons.map(function (h0) { return e('option', { key: h0[1], value: String(h0[0]) }, h0[1] + (h0[0] ? ' (' + qeOptNum(h0[0], h0[0] % 1 ? 1 : 0) + ' ' + L('days') + ')' : '')); }))),
    e('p', { className: 'micro muted' }, L('Profit or loss of the strategy above, in dollars per contract (100 shares), if the stock moves (columns) and implied volatility shifts (rows).')),
    crush !== null && e('div', { className: 'opt-row' },
      e('button', { type: 'button', className: 'btn subtle' + (sc.crush && hDays === afterDays ? ' is-selected' : ''), 'aria-pressed': !!(sc.crush && hDays === afterDays), onClick: function () { st.scen[1]({ days: afterDays, crush: !sc.crush }); } }, L('Volatility crush after the results')),
      e('span', { className: 'micro' }, qeOptKeepUnits(L('The term structure suggests this expiry’s volatility falls by about {x} points once the results are out ({a} → {b}).')
        .replace('{x}', qeOptNum(Math.abs(crush) * 100, 1)).replace('{a}', qeOptPct(data.atm_iv)).replace('{b}', qeOptPct(ev.post_event_vol))))),
    e('div', { className: 'opt-heat-wrap' }, e('table', { className: 'opt-heat' },
      e('caption', { className: 'sr-only' }, L('Scenario grid') + ': ' + L('stock move by column, volatility shift by row')),
      e('thead', null, e('tr', null, e('th', { scope: 'col' }, L('Vol. shift')), grid.moves.map(function (m) { return e('th', { key: m, scope: 'col' }, qeOptPct(m, 0, true)); }))),
      e('tbody', null, grid.rows.map(function (row, i) {
        var dv = grid.shifts[i], isCrush = crush !== null && Math.abs(dv - crush) < 1e-9;
        return e('tr', { key: i, className: isCrush && sc.crush && hDays === afterDays ? 'is-crush' : '' },
          e('th', { scope: 'row' }, (dv > 0 ? '+' : dv < 0 ? '−' : '±') + qeOptNum(Math.abs(dv) * 100, isCrush ? 1 : 0) + ' ' + L('pts') + (isCrush ? ' *' : '')),
          row.map(function (v, j) {
            return e('td', { key: j, className: grid.moves[j] === 0 && dv === 0 ? 'is-now' : '', style: { background: qeOptHeat(Math.abs(v) / grid.big, v >= 0 ? 'var(--qe-chart-up)' : 'var(--qe-chart-down)') } }, signedMoney(v));
          }));
      })))),
    e('p', { className: 'micro muted' }, (crush !== null ? '* ' + L('the shift the term structure implies after the results') + '. ' : '') +
      L('Black–Scholes with each leg’s own volatility; the shift moves the whole smile. Educational, not a trade idea.')));

  // implied volatility surface: one row per expiry, columns at fixed strike/forward ratios
  var surf = qeOptSurfaceGrid(data.surface, QE_OPT_MONEYNESS);
  var surfVals = [].concat.apply([], surf.map(function (r0) { return r0.cells; })).filter(function (v) { return v !== null; });
  var sLo = surfVals.length ? Math.min.apply(null, surfVals) : 0, sHi = surfVals.length ? Math.max.apply(null, surfVals) : 1;
  var surfaceCard = surf.length >= 2 && surfVals.length >= 6 && e('section', { className: 'opt-card opt-surface', 'aria-labelledby': 'opt-surf-title' },
    e('h3', { id: 'opt-surf-title' }, L('Volatility surface')),
    e('p', { className: 'micro muted' }, L('Implied volatility by expiry (rows) and strike as a share of the forward (columns): each row is one smile, each column a term structure.')),
    e('div', { className: 'opt-heat-wrap' }, e('table', { className: 'opt-heat' },
      e('caption', { className: 'sr-only' }, L('Volatility surface')),
      e('thead', null, e('tr', null, e('th', { scope: 'col' }, L('Expiry')), QE_OPT_MONEYNESS.map(function (m) { return e('th', { key: m, scope: 'col' }, qeOptPct(m, 0)); }))),
      e('tbody', null, surf.map(function (r0) {
        return e('tr', { key: r0.expiry, className: r0.expiry === data.expiry ? 'is-selected' : '' },
          e('th', { scope: 'row' }, qeOptNum(r0.days, r0.days < 10 ? 1 : 0) + ' ' + L('days')),
          r0.cells.map(function (v, j) {
            return e('td', { key: j, className: v === null ? 'is-empty' : '', style: { background: v === null ? undefined : qeOptHeat((v - sLo) / ((sHi - sLo) || 1), 'var(--qe-accent)') } }, v === null ? '·' : qeOptPct(v, 1));
          }));
      })))),
    e('p', { className: 'micro muted' }, L('· = no two-sided quote near that strike for that expiry (nothing is extrapolated).')));

  var term = (data.term || []).filter(function (x) { return x.atm_iv; });
  var termCard = term.length >= 2 && e('section', { className: 'opt-card', 'aria-labelledby': 'opt-term-title' },
    e('h3', { id: 'opt-term-title' }, L('Term structure')),
    e(LabChart, { width: 460, chart: { kind: 'line', title: L('At-the-money implied volatility by days to expiry'), x: term.map(function (x) { return qeOptNum(x.days, 0); }),
      series: [{ name: L('At-the-money volatility'), values: term.map(function (x) { return Math.round(x.atm_iv * 10000) / 100; }) },
               { name: L('Forward volatility'), values: term.map(function (x) { return x.fwd_vol ? Math.round(x.fwd_vol * 10000) / 100 : null; }) }], fmt: 'pct' } }));

  var hist = ref.hist || [];
  var histCard = hist.length >= 2 && e('section', { className: 'opt-card', 'aria-labelledby': 'opt-hist-title' },
    e('h3', { id: 'opt-hist-title' }, L('Live history on this page')),
    e(LabChart, { width: 460, chart: { kind: 'line', title: L('Implied volatility at each refresh') + ' · ' + data.expiry, x: hist.map(function (h) { return qeOptTime(h.t).slice(0, 5); }),
      series: [{ name: L('At-the-money volatility'), values: hist.map(function (h) { return h.atm ? Math.round(h.atm * 10000) / 100 : null; }) },
               { name: L('30-day implied volatility'), values: hist.map(function (h) { return h.iv30 ? Math.round(h.iv30 * 10000) / 100 : null; }) }], fmt: 'pct' } }),
    e('p', { className: 'micro muted' }, hist.length + ' ' + L('refreshes since') + ' ' + qeOptTime(hist[0].t) + ' · ' + L('stock') + ' ' + qeOptMoney(hist[0].s) + ' → ' + qeOptMoney(hist[hist.length - 1].s) + '. ' + L('Kept only while this page is open.')));
  var insightCard = e('section', { className: 'opt-card opt-insights', 'aria-labelledby': 'opt-ins-title' },
    e('h3', { id: 'opt-ins-title' }, L('Live reading')),
    e('ul', null, (data.insights || []).map(function (x, i) { return e('li', { key: i }, qeOptKeepUnits(x)); })),
    (data.warnings || []).length > 0 && e('ul', { className: 'opt-warnings' }, data.warnings.map(function (x, i) { return e('li', { key: i }, qeOptKeepUnits(x)); })),
    e('div', { className: 'opt-row' },
      e(Button, { variant: 'primary', icon: 'file', loading: props.busy, onClick: writeNote }, L('Write a research note from this snapshot')),
      e('span', { className: 'micro muted' }, L('The note keeps the market numbers of this moment (not your own slider inputs), with sources, and can be published like every analysis.'))));

  var nearF = data.chain.filter(function (x) { return Math.abs(Math.log(x.strike / data.dividend.forward)) <= 0.2; });
  var chainCard = e('section', { className: 'opt-card' },
    e('button', { type: 'button', className: 'tiny-link', 'aria-expanded': st.showChain[0], onClick: function () { st.showChain[1](!st.showChain[0]); } },
      st.showChain[0] ? L('Hide the option chain') : L('Show the option chain') + ' (' + nearF.length + ')'),
    st.showChain[0] && e('div', { className: 'opt-chain-wrap' }, e('table', { className: 'opt-chain' },
      e('thead', null, e('tr', null, e('th', { colSpan: 4 }, L('Calls')), e('th', null, L('Strike')), e('th', { colSpan: 4 }, L('Puts'))),
        e('tr', null, ['bid', 'ask', 'IV', 'Δ'].map(function (h) { return e('th', { key: 'c' + h, className: 'num' }, L(h)); }), e('th', null, ''),
          ['bid', 'ask', 'IV', 'Δ'].map(function (h) { return e('th', { key: 'p' + h, className: 'num' }, L(h)); }))),
      e('tbody', null, nearF.map(function (x) {
        var c = x.call || {}, p = x.put || {}, sel = Math.abs(x.strike - calc.k) < 1e-9;
        var cell = function (o, key, fmt) { return e('td', { className: 'num' + (o === c ? (x.otm === 'call' ? ' otm' : '') : (x.otm === 'put' ? ' otm' : '')) }, fmt(o[key])); };
        return e('tr', { key: x.strike, className: sel ? 'is-selected' : '', onClick: function () { pickStrike(x.strike); } },
          cell(c, 'bid', qeOptMoney), cell(c, 'ask', qeOptMoney), cell(c, 'iv', function (v) { return qeOptPct(v); }), cell(c, 'delta', function (v) { return qeOptNum(v, 2); }),
          e('th', { scope: 'row', className: 'num' }, e('button', { type: 'button', className: 'opt-strike-btn', 'aria-pressed': sel,
            onClick: function (ev) { ev.stopPropagation(); pickStrike(x.strike); } }, qeOptNum(x.strike, x.strike % 1 ? 2 : 0))),
          cell(p, 'bid', qeOptMoney), cell(p, 'ask', qeOptMoney), cell(p, 'iv', function (v) { return qeOptPct(v); }), cell(p, 'delta', function (v) { return qeOptNum(v, 2); }));
      })))),
    st.showChain[0] && e('p', { className: 'micro muted' }, L('Implied volatilities are solved here from each mid price (Black-76 on the forward). Click a row to price that strike.')));

  return e('section', { className: 'opt-desk', 'aria-label': L('Options desk') },
    e(QeOptLife, { key: 'life', onUnmount: function () { ref.dead = true; } }),
    e(QeOptPoller, { active: st.live[0], ms: (data.live && data.live.poll_s ? data.live.poll_s : 60) * 1000 * (st.fails[0] ? Math.min(4, 1 + st.fails[0]) : 1), token: data.now_utc,
      onTick: function () { load({ silent: true }); } }),
    e(QeOptPoller, { active: st.live[0] && data.session !== 'CLOSED', ms: 15000, token: data.symbol, onTick: quoteTick }),
    head, status, st.error[0] && e(Notice, { type: 'amber' }, L(st.error[0])), kpis, selectors,
    e('div', { className: 'opt-grid' }, e('div', { className: 'opt-col' }, calcCard, reportCard, insightCard, vixCard, histCard), e('div', { className: 'opt-col' }, smileCard, surfaceCard, stratCard, scenCard, termCard)),
    chainCard,
    e('p', { className: 'micro muted opt-foot' }, L('Free data: the stock price is Yahoo’s current quote and option quotes are delayed about 15 minutes; real-time option feeds are paid. Risk-neutral probabilities and model values are pricing quantities, not forecasts. Not investment advice.')));
}

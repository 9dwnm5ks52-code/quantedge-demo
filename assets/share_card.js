/* QuantEdge v0.13.5 — LinkedIn image card (1200×627 PNG), drawn locally on a <canvas>.
 *
 * Only SEC figures already loaded in the browser are drawn: five fiscal years of revenue
 * (bars) and operating margin (line), the latest-year summary and the 10-K source line.
 * A missing value leaves a gap; nothing is estimated. No network request, no upload.
 */
var QE_CARD_WORDS = {
  tr: { sub: 'Yıllık gelir ve faaliyet kâr marjı', rev: 'Gelir', margin: 'Faaliyet kâr marjı', latest: 'Son mali yıl', growth: 'büyüme',
        fcf: 'Serbest nakit akışı', source: 'Kaynak: SEC 10-K', filed: 'sunulma', by: 'Hazırlayan', advice: 'Yatırım tavsiyesi değildir',
        fy: function (y) { return y + ' MY'; } },
  es: { sub: 'Ingresos anuales y margen operativo', rev: 'Ingresos', margin: 'Margen operativo', latest: 'Último ejercicio', growth: 'crecimiento',
        fcf: 'Flujo de caja libre', source: 'Fuente: SEC 10-K', filed: 'presentado', by: 'Elaborado por', advice: 'No es asesoramiento financiero',
        fy: function (y) { return 'Ej. ' + y; } },
  en: { sub: 'Annual revenue and operating margin', rev: 'Revenue', margin: 'Operating margin', latest: 'Latest fiscal year', growth: 'growth',
        fcf: 'Free cash flow', source: 'Source: SEC 10-K', filed: 'filed', by: 'Research by', advice: 'Not investment advice',
        fy: function (y) { return 'FY' + y; } }
};

function qeCardNum(v, lang, digits) {
  return Number(v).toLocaleString({ tr: 'tr-TR', es: 'es-ES', en: 'en-US' }[lang] || 'en-US',
    { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
function qeCardMoney(m, lang) {
  if (m === null || m === undefined || !isFinite(m)) return '—';
  var neg = m < 0 ? '−' : '', v = Math.abs(m), big = v >= 1000, amount = qeCardNum(big ? v / 1000 : v, lang, big ? 1 : 0);
  if (lang === 'tr') return neg + amount + (big ? ' milyar $' : ' milyon $');
  if (lang === 'es') return neg + amount + (big ? ' mil M$' : ' M$');
  return neg + '$' + amount + (big ? 'B' : 'M');
}
function qeCardPct(p, lang, signed) {
  if (p === null || p === undefined || !isFinite(p)) return '—';
  var sign = p < 0 ? '−' : (signed && p > 0 ? '+' : ''), body = qeCardNum(Math.abs(p), lang, 1);
  return lang === 'tr' ? sign + '%' + body : lang === 'es' ? sign + body + ' %' : sign + body + '%';
}

function qeCardDate(iso, lang) {
  var d = new Date(String(iso).slice(0, 10) + 'T12:00:00Z');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString({ tr: 'tr-TR', es: 'es-ES', en: 'en-US' }[lang] || 'en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function qeDrawShareCard(canvas, data) {
  var lang = QE_CARD_WORDS[data.lang] ? data.lang : 'en', w = QE_CARD_WORDS[lang];
  var W = 1200, H = 627, S = 2;
  canvas.width = W * S; canvas.height = H * S;
  var c = canvas.getContext('2d');
  c.setTransform(S, 0, 0, S, 0, 0);
  var font = function (size, weight) { return (weight || 500) + ' ' + size + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif'; };
  // background
  var g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#081626'); g.addColorStop(1, '#0d2236');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.strokeStyle = '#24425a'; c.lineWidth = 2; c.strokeRect(1, 1, W - 2, H - 2);
  // header
  c.fillStyle = '#43d9d2'; c.font = font(18, 800); c.fillText('QuantEdge', 56, 58);
  c.fillStyle = '#9bb1c6'; c.font = font(16, 700); c.textAlign = 'right'; c.fillText('SEC 10-K · ' + data.ticker, W - 56, 58); c.textAlign = 'left';
  c.fillStyle = '#f5faff'; c.font = font(44, 800); c.fillText(data.company + ' (' + data.ticker + ')', 56, 118);
  var rows = (data.history || []).filter(function (r) { return r && r.year; });
  c.fillStyle = '#9bb1c6'; c.font = font(20, 500);
  c.fillText(w.sub + (rows.length ? ' · ' + w.fy(rows[0].year) + '–' + w.fy(rows[rows.length - 1].year) : ''), 56, 154);
  // chart frame
  var X0 = 56, X1 = 760, Y0 = 200, Y1 = 520;
  var revs = rows.map(function (r) { return isFinite(r.revenue_m) ? r.revenue_m : null; });
  var maxR = Math.max.apply(null, revs.filter(function (v) { return v !== null; }).concat([0]));
  var minR = Math.min.apply(null, revs.filter(function (v) { return v !== null; }).concat([0]));
  var BAR_TOP = 350; // bars use 350..520; the margin line uses its own band 228..300 above them
  var span = (maxR - minR) || 1, yOf = function (v) { return Y1 - (v - minR) / span * (Y1 - BAR_TOP); };
  c.strokeStyle = '#2a4459'; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, yOf(0)); c.lineTo(X1, yOf(0)); c.stroke();
  var n = Math.max(rows.length, 1), slot = (X1 - X0) / n, bw = Math.min(84, slot * 0.56);
  rows.forEach(function (r, i) {
    var cx = X0 + slot * (i + 0.5), v = revs[i];
    c.fillStyle = '#9bb1c6'; c.font = font(16, 600); c.textAlign = 'center'; c.fillText(w.fy(r.year), cx, Y1 + 30);
    if (v === null) return;
    var top = yOf(Math.max(v, 0)), bottom = yOf(Math.min(v, 0));
    var bar = c.createLinearGradient(0, top, 0, bottom); bar.addColorStop(0, i === n - 1 ? '#5af0e4' : '#2fb9b3'); bar.addColorStop(1, '#155c66');
    c.fillStyle = bar; c.fillRect(cx - bw / 2, top, bw, Math.max(bottom - top, 2));
    c.fillStyle = '#f5faff'; c.font = font(15, 700); c.fillText(qeCardMoney(v, lang), cx, top - 10);
  });
  // operating margin line (own scale)
  var ms = rows.map(function (r) { return isFinite(r.operating_margin_pct) ? r.operating_margin_pct : null; });
  var known = ms.filter(function (v) { return v !== null; });
  if (known.length >= 2) {
    var mMax = Math.max.apply(null, known), mMin = Math.min.apply(null, known), mSpan = (mMax - mMin) || 1;
    var my = function (v) { return 228 + (mMax - v) / mSpan * 72; };
    c.strokeStyle = '#edbc6c'; c.lineWidth = 3; c.beginPath();
    var started = false;
    ms.forEach(function (v, i) { if (v === null) { started = false; return; } var x = X0 + slot * (i + 0.5); if (started) c.lineTo(x, my(v)); else { c.moveTo(x, my(v)); started = true; } });
    c.stroke();
    ms.forEach(function (v, i) {
      if (v === null) return; var x = X0 + slot * (i + 0.5);
      c.fillStyle = '#edbc6c'; c.beginPath(); c.arc(x, my(v), 5, 0, Math.PI * 2); c.fill();
      c.font = font(14, 700); c.textAlign = 'center'; c.fillText(qeCardPct(v, lang), x, my(v) - 12);
    });
  }
  c.textAlign = 'left';
  // legend
  c.fillStyle = '#2fb9b3'; c.fillRect(X0, 176, 14, 14); c.fillStyle = '#c9d8e6'; c.font = font(15, 600); c.fillText(w.rev, X0 + 22, 188);
  c.fillStyle = '#edbc6c'; c.fillRect(X0 + 140, 182, 22, 3); c.fillStyle = '#c9d8e6'; c.fillText(w.margin, X0 + 170, 188);
  // latest-year panel
  var last = rows[rows.length - 1] || {}, PX = 800, PY = 200;
  c.fillStyle = '#0f2a3d'; c.strokeStyle = '#2b5068'; c.lineWidth = 1.5;
  c.beginPath(); if (c.roundRect) c.roundRect(PX, PY, 344, 320, 16); else c.rect(PX, PY, 344, 320); c.fill(); c.stroke();
  c.fillStyle = '#43d9d2'; c.font = font(15, 800); c.fillText(w.latest.toUpperCase() + (last.year ? ' · ' + w.fy(last.year) : ''), PX + 24, PY + 40);
  var stat = function (label, value, y) {
    c.fillStyle = '#9bb1c6'; c.font = font(15, 600); c.fillText(label, PX + 24, y);
    c.fillStyle = '#f5faff'; c.font = font(30, 800); c.fillText(value, PX + 24, y + 36);
  };
  stat(w.rev + (isFinite(last.revenue_yoy_pct) ? ' · ' + w.growth + ' ' + qeCardPct(last.revenue_yoy_pct, lang, true) : ''), qeCardMoney(last.revenue_m, lang), PY + 82);
  stat(w.margin, qeCardPct(last.operating_margin_pct, lang), PY + 162);
  stat(w.fcf, qeCardMoney(last.fcf_m, lang), PY + 242);
  // footer
  c.fillStyle = '#7f97ad'; c.font = font(15, 500);
  var foot = w.source + (data.filed ? ' (' + w.filed + ' ' + qeCardDate(data.filed, lang) + ')' : '') + (data.author ? ' · ' + w.by + ': ' + data.author : '') + ' · ' + w.advice;
  c.fillText(foot, 56, H - 40);
  return canvas;
}

/* History rows from the /api/v2/company response -> card rows. */
function qeCardData(financial, lang, author) {
  var rows = (financial.history || []).map(function (r) {
    return { year: String(r['Fiscal year ended'] || '').slice(0, 4), revenue_m: r.revenue_m, operating_margin_pct: r.operating_margin_pct,
             revenue_yoy_pct: r.revenue_yoy_pct, fcf_m: r.fcf_m };
  });
  return { lang: lang, ticker: financial.ticker, company: financial.company, history: rows,
           filed: financial.filing ? financial.filing.filed : '', author: author || '' };
}

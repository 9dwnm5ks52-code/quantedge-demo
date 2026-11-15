/* QuantEdge v0.13.5 — publishing an Analysis Lab result.
 *
 * A result is published only with the student's own words: "what I think" and
 * "why I might be wrong" (QE_LAB_MIN_VIEW / QE_LAB_MIN_COUNTER characters).
 * Outputs: LinkedIn text (qeLabPost in lab_ui.js), the 1200×627 PNG card, and a
 * LinkedIn carousel — 1080×1350 slides drawn on canvas, packed into a PDF here
 * (each slide a JPEG page), so Turkish text needs no font files and nothing
 * leaves the computer.
 */
var QE_LAB_MIN_VIEW = 80;
var QE_LAB_MIN_COUNTER = 60;
var QE_LAB_MAX_VIEW = 700;
var QE_LAB_MAX_COUNTER = 500;

function qeLabCommentary(pub) {
  pub = pub || {};
  var view = String(pub.view || '').trim(), counter = String(pub.counter || '').trim();
  return { view: view, counter: counter, author: String(pub.author || '').trim(),
           ok: view.length >= QE_LAB_MIN_VIEW && counter.length >= QE_LAB_MIN_COUNTER };
}

function qeLabFont(size, weight) {
  return (weight || 500) + ' ' + size + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif';
}

/* Lines for `text` at the current font: words wrap, a word wider than the line (a URL) breaks by character,
   and the last kept line gets "…" when the text is cut at maxLines. */
function qeLabLines(c, text, maxW, maxLines) {
  var words = [], lines = [], line = '';
  String(text || '').split(/\s+/).filter(Boolean).forEach(function (w) {
    while (c.measureText(w).width > maxW && w.length > 1) {
      var k = w.length - 1;
      while (k > 1 && c.measureText(w.slice(0, k)).width > maxW) k--;
      words.push(w.slice(0, k)); w = w.slice(k);
    }
    words.push(w);
  });
  words.forEach(function (w) {
    var test = line ? line + ' ' + w : w;
    if (line && c.measureText(test).width > maxW) { lines.push(line); line = w; } else line = test;
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    var last = lines[maxLines - 1];
    while (last.length > 1 && c.measureText(last + '…').width > maxW) last = last.slice(0, -1);
    lines[maxLines - 1] = last.replace(/[\s,;:.]+$/, '') + '…';
  }
  return lines;
}

/* Draw wrapped text; returns the y below the last line. */
function qeLabWrap(c, text, x, y, maxW, lineH, maxLines) {
  var lines = qeLabLines(c, text, maxW, maxLines);
  lines.forEach(function (l, k) { c.fillText(l, x, y + k * lineH); });
  return y + lines.length * lineH;
}

/* Short numbers for slides: 106,8 mlr $ / $106.8B instead of 106,82 milyar $. */
function qeLabShort(v, fmt) {
  if (fmt === 'money_m' && v !== null && v !== undefined && isFinite(v) && Math.abs(v) >= 1000) {
    var b = fmt === 'money_m' ? v / 1000 : v, t = Math.abs(b).toLocaleString(QE_LANG === 'en' ? 'en-US' : QE_LANG === 'es' ? 'es-ES' : 'tr-TR', { maximumFractionDigits: 1 });
    var sign = b < 0 ? '−' : '';
    return QE_LANG === 'en' ? sign + '$' + t + 'B' : QE_LANG === 'es' ? sign + t + ' mM$' : sign + t + ' mlr $';
  }
  return String(labFormat(v, fmt));
}

/* One chart (line or grouped bars) inside the box X0..X1 × Y0..Y1. opts: {labelSize, lineWidth, axis, legend}. */
function qeLabDrawChart(c, ch, X0, Y0, X1, Y1, opts) {
  opts = opts || {};
  if (ch.kind === 'range') return qeLabDrawRange(c, ch, X0, Y0, X1, Y1, opts);
  var vals = [], isRange = false, marker = null;
  ch.series.forEach(function (s) { s.values.forEach(function (v) { if (v !== null && v !== undefined && isFinite(v)) vals.push(v); }); });
  if (marker) vals.push(marker.value);
  if (!vals.length || !ch.x.length) return false;
  var lo = Math.min.apply(null, vals.concat(ch.kind === 'bar' ? [0] : [])), hi = Math.max.apply(null, vals.concat(ch.kind === 'bar' ? [0] : []));
  var labelSize = opts.labelSize || 13;
  var maxAbs = Math.max(Math.abs(lo), Math.abs(hi)), nice = qeLabNiceTicks(lo, hi, 4), ticks = nice.ticks;
  lo = ticks[0]; hi = ticks[ticks.length - 1];
  var tickText = function (v) { return qeLabTickLabel(v, ch.fmt, nice.step, maxAbs); };
  if (opts.axis) {
    c.font = qeLabFont(labelSize, 600);
    var w = Math.max.apply(null, ticks.map(function (v) { return c.measureText(tickText(v)).width; }));
    var axisX = X0 + w;
    X0 = axisX + 14;
  }
  var yy = function (v) { return Y1 - (v - lo) / (hi - lo) * (Y1 - Y0); };
  var n = ch.x.length, slot = (X1 - X0) / n;
  if (opts.axis) {
    c.textAlign = 'right'; c.fillStyle = '#8299AE'; c.strokeStyle = '#24374c'; c.lineWidth = 1;
    ticks.forEach(function (v) {
      c.fillText(tickText(v), axisX, yy(v) + labelSize / 3);
      c.beginPath(); c.moveTo(X0, yy(v)); c.lineTo(X1, yy(v)); c.stroke();
    });
    c.textAlign = 'left';
  }
  if (isRange) {  // low–high bars and a dashed price line
    var lows = (ch.series[0] || { values: [] }).values, highs = (ch.series[1] || { values: [] }).values, rw = Math.min(opts.maxBar || 46, slot * 0.6);
    c.fillStyle = qeLabSeriesStyle(ch.series[0] || {}, 0).color;
    lows.forEach(function (a, i) {
      var b = highs[i];
      if (a === null || a === undefined || b === null || b === undefined || !isFinite(a) || !isFinite(b)) return;
      var top = yy(Math.max(a, b)), bot = yy(Math.min(a, b));
      c.fillRect(X0 + slot * (i + 0.5) - rw / 2, top, rw, Math.max(bot - top, 3));
    });
    if (marker) {
      var my = yy(marker.value);
      c.strokeStyle = '#edbc6c'; c.lineWidth = 3; if (c.setLineDash) c.setLineDash([12, 8]);
      c.beginPath(); c.moveTo(X0, my); c.lineTo(X1, my); c.stroke(); if (c.setLineDash) c.setLineDash([]);
      var mt = labL(marker.name) + ' ' + labFormat(marker.value, ch.fmt);
      c.font = qeLabFont(labelSize, 700); var mw = c.measureText(mt).width;
      c.fillStyle = '#0d1824'; c.fillRect(X1 - mw - 10, my - labelSize * 1.75, mw + 10, labelSize * 1.4);
      c.fillStyle = '#edbc6c'; c.textAlign = 'right'; c.fillText(mt, X1 - 4, my - labelSize * 0.6); c.textAlign = 'left';
    }
  }
  if (!isRange) ch.series.forEach(function (s, si) {
    var st = qeLabSeriesStyle(s, si), color = st.color;
    if (ch.kind === 'bar') {
      var bw = Math.min(opts.maxBar || 46, slot * 0.7 / ch.series.length);
      s.values.forEach(function (v, i) {
        if (v === null || v === undefined || !isFinite(v)) return;
        var x = X0 + slot * (i + 0.5) - bw * ch.series.length / 2 + si * bw, a = yy(Math.max(v, 0)), b = yy(Math.min(v, 0));
        c.fillStyle = v < 0 ? '#ee919f' : color; c.fillRect(x, a, bw - 3, Math.max(b - a, 2));
      });
    } else {
      c.strokeStyle = color; c.lineWidth = (opts.lineWidth || 3) * st.w; c.globalAlpha = st.alpha;
      if (c.setLineDash) c.setLineDash(st.dash ? st.dash.map(function (d) { return d * 2; }) : []);
      c.beginPath(); var on = false;
      s.values.forEach(function (v, i) {
        if (v === null || v === undefined || !isFinite(v)) { on = false; return; }
        var x = X0 + slot * (i + 0.5);
        if (on) c.lineTo(x, yy(v)); else { c.moveTo(x, yy(v)); on = true; }
      });
      c.stroke();
      c.globalAlpha = 1; if (c.setLineDash) c.setLineDash([]);
    }
  });
  c.fillStyle = '#8299AE'; c.font = qeLabFont(labelSize, 600);
  var labelLines = 1;
  if (opts.wrapLabels && (ch.kind === 'bar' || isRange)) {  // category names under bars: up to two lines each
    c.textAlign = 'center';
    ch.x.forEach(function (label, i) {
      var lines = qeLabLines(c, String(label), slot - 10, 2);
      labelLines = Math.max(labelLines, lines.length);
      lines.forEach(function (l, k) { c.fillText(l, X0 + slot * (i + 0.5), Y1 + labelSize * 1.7 + k * labelSize * 1.25); });
    });
  } else {
    qeLabXTicks(ch.x, X1 - X0, labelSize * 0.58, labelSize * 1.4, ch.kind === 'line').forEach(function (i) {
      c.textAlign = ch.kind === 'line' && i === n - 1 && n > 1 ? 'right' : 'center';
      c.fillText(qeLabXLabel(ch.x[i], n), X0 + slot * (i + 0.5), Y1 + labelSize * 1.7);
    });
  }
  c.textAlign = 'left';
  if (opts.legend && !isRange && ch.series.length > 1) {
    var lx = X0, ly = Y1 + labelSize * (2.4 + 1.25 * labelLines);
    c.font = qeLabFont(labelSize + 2, 600);
    ch.series.forEach(function (s, si) {
      var name = labL(s.name), wName = c.measureText(name).width;
      if (lx + wName + 40 > X1) { lx = X0; ly += labelSize * 2; }
      var ls = qeLabSeriesStyle(s, si);
      c.fillStyle = ls.color; c.globalAlpha = ls.alpha; c.fillRect(lx, ly - labelSize + 2, labelSize, labelSize); c.globalAlpha = 1;
      c.fillStyle = '#c9d8e6'; c.fillText(name, lx + labelSize + 8, ly);
      lx += labelSize + 8 + wName + 28;
    });
  }
  return true;
}

/* ------------------------------------------------------------------ carousel slides */
function qeLabSlides(res, pub) {
  var p = qeLabCommentary(pub), slides = ['cover'];
  if ((res.charts || []).length) slides.push('chart');
  slides.push('findings');
  if ((res.tables || []).length && res.tables[0].rows.length) slides.push('table');
  slides.push('view', 'counter');
  if (pub && pub.call) slides.push('call', 'matrix');  // at most 9 slides
  slides.push('sources');
  return slides;
}

/* Upper case for slide headings; Turkish needs its own rule (i → İ, ı → I). */
function qeLabUpper(text) {
  text = String(text || '');
  return QE_LANG === 'tr' && text.toLocaleUpperCase ? text.replace(/i/g, 'İ').replace(/ı/g, 'I').toLocaleUpperCase('tr-TR') : text.toUpperCase();
}

function qeDrawLabSlide(canvas, res, pub, index) {
  var W = 1080, H = 1350, S = 1, c = canvas.getContext('2d'), p = qeLabCommentary(pub);
  var slides = qeLabSlides(res, pub), kind = slides[index], total = slides.length, M = 84, TW = W - 2 * M;
  canvas.width = W * S; canvas.height = H * S; c.setTransform(S, 0, 0, S, 0, 0);
  var g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#081626'); g.addColorStop(1, '#0d2236');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.fillStyle = '#43d9d2'; c.fillRect(0, 0, W, 10);
  c.textAlign = 'left';
  c.fillStyle = '#43d9d2'; c.font = qeLabFont(26, 800); c.fillText('QuantEdge · ' + L('Analysis Lab'), M, 92);
  var title = labL(res.title), y;
  // slide heading: up to 2 lines, never cut mid-word (a "not a forecast" label at the end of a title must survive)
  var heading = function (text, color) {
    c.fillStyle = color || '#43d9d2'; c.font = qeLabFont(30, 800);
    var lines = qeLabLines(c, String(text), TW, 2);
    lines.forEach(function (l, k) { c.fillText(l, M, 190 - (lines.length - 1) * 19 + k * 38); });
    return 250;
  };
  if (kind === 'cover') {
    c.fillStyle = '#f5faff'; c.font = qeLabFont(78, 800);
    y = qeLabWrap(c, title, M, 270, TW, 90, 3);
    c.fillStyle = '#9bb1c6'; c.font = qeLabFont(38, 600); c.fillText(res.subjects.join(' · ').slice(0, 44), M, y + 30);
    c.fillStyle = '#c9d8e6'; c.font = qeLabFont(40, 500);
    y = qeLabWrap(c, L(res.question), M, y + 130, TW, 54, 3);
    var boxY = y + 50;
    c.font = qeLabFont(40, 700);
    var hook = qeLabLines(c, res.findings[0] || '', TW - 24, 5), boxH = hook.length * 54 + 64;
    c.fillStyle = 'rgba(67,217,210,0.10)'; c.fillRect(M - 24, boxY, TW + 48, boxH);
    c.fillStyle = '#43d9d2'; c.fillRect(M - 24, boxY, 8, boxH);
    c.fillStyle = '#f5faff'; c.font = qeLabFont(40, 700);
    hook.forEach(function (l, k) { c.fillText(l, M + 12, boxY + 72 + k * 54); });
    var chartTop = boxY + boxH + 70;
    if ((res.charts || []).length && chartTop < 900) qeLabDrawChart(c, res.charts[0], M, chartTop, W - M, 1110, { labelSize: 20, lineWidth: 4, maxBar: 70, wrapLabels: true });
  } else if (kind === 'chart') {
    var ch = res.charts[0];
    y = heading(qeLabUpper(labL(ch.title)));
    qeLabDrawChart(c, ch, M, y + 40, W - M, 960, { labelSize: 24, lineWidth: 5, axis: true, legend: true, maxBar: 90, wrapLabels: true });
  } else if (kind === 'findings') {
    y = heading(L('KEY FINDINGS'));
    res.findings.slice(0, 4).forEach(function (f, i) {
      c.fillStyle = '#43d9d2'; c.font = qeLabFont(44, 800); c.fillText(String(i + 1), M, y + 40);
      c.fillStyle = '#e8f1fa'; c.font = qeLabFont(36, 600);
      y = qeLabWrap(c, f, M + 64, y + 40, TW - 64, 48, 5) + 46;
    });
  } else if (kind === 'table') {
    var t = res.tables[0], cols = t.columns.slice(0, 4), rows = t.rows.slice(0, 7);
    y = heading(qeLabUpper(labL(t.title)));
    var firstW = cols.length > 1 ? TW * 0.36 : TW, restW = cols.length > 1 ? (TW - firstW) / (cols.length - 1) : 0;
    var colX = function (k) { return k === 0 ? M : M + firstW + (k - 1) * restW; }, colW = function (k) { return k === 0 ? firstW : restW; };
    c.font = qeLabFont(22, 800); c.fillStyle = '#8299AE';
    var headH = 0;
    cols.forEach(function (col, k) { headH = Math.max(headH, qeLabWrap(c, qeLabUpper(labL(col.label)), colX(k), y + 30, colW(k) - 18, 28, 3) - y); });
    y += headH + 50;
    rows.forEach(function (r, ri) {
      c.font = qeLabFont(28, 700);
      var name = qeLabLines(c, String(labFormat(r[cols[0].key], cols[0].fmt)), firstW - 18, 2), rowH = 44 + name.length * 34;
      if (ri % 2 === 0) { c.fillStyle = 'rgba(255,255,255,0.04)'; c.fillRect(M - 16, y - 44, TW + 32, rowH); }
      c.fillStyle = '#e8f1fa';
      name.forEach(function (l, k) { c.fillText(l, M, y + k * 34); });
      cols.slice(1).forEach(function (col, k) {
        var v = qeLabShort(r[col.key], col.fmt), size = 32;
        c.font = qeLabFont(size, 600);
        while (size > 22 && c.measureText(v).width > restW - 18) { size -= 2; c.font = qeLabFont(size, 600); }
        while (v.length > 1 && c.measureText(v).width > restW - 18) v = v.slice(0, -2) + '…';
        c.fillStyle = col.fmt === 'flag' ? (r[col.key] === 1 ? '#8ee6bf' : r[col.key] === 0 ? '#ee919f' : '#c9d8e6') : '#e8f1fa';
        c.fillText(v, colX(k + 1), y);
      });
      y += rowH;
    });
    if (t.rows.length > rows.length || t.columns.length > cols.length) {
      c.fillStyle = '#7f97ad'; c.font = qeLabFont(26, 500); c.fillText(L('Full table in the analysis'), M, y + 20);
    }
  } else if (kind === 'view' || kind === 'counter') {
    var words = kind === 'view' ? p.view : p.counter, size = words.length < 220 ? 56 : words.length < 420 ? 48 : 40;
    y = kind === 'view' ? heading(L('WHAT I THINK')) : heading(L('WHY I MIGHT BE WRONG'), '#edbc6c');
    c.fillStyle = '#f5faff'; c.font = qeLabFont(size, 600);
    qeLabWrap(c, words, M, y + 50, TW, Math.round(size * 1.38), Math.floor(820 / (size * 1.38)));
  } else if (kind === 'call') {
    qeDrawCallSlide(c, pub.call, heading, M, TW);
  } else if (kind === 'matrix') {
    qeDrawMatrixSlide(c, pub.call, heading, M, TW);
  } else {
    y = heading(L('SOURCES AND METHOD'));
    (res.sources || []).slice(0, 4).forEach(function (s) {
      c.fillStyle = '#e8f1fa'; c.font = qeLabFont(32, 700);
      y = qeLabWrap(c, qeLabSource(s.label), M, y + 20, TW, 42, 2);
      if (s.url) { c.fillStyle = '#43d9d2'; c.font = qeLabFont(24, 500); y = qeLabWrap(c, s.url.replace(/^https?:\/\//, ''), M, y + 4, TW, 32, 2); }
      y += 22;
    });
    if ((res.notes || [])[0]) {
      c.fillStyle = '#9bb1c6'; c.font = qeLabFont(28, 500);
      y = qeLabWrap(c, res.notes[0], M, y + 40, TW, 40, 6);
    }
    c.fillStyle = '#edbc6c'; c.font = qeLabFont(28, 700);
    qeLabWrap(c, labL(res.disclaimer) || L('Not investment advice'), M, Math.max(y + 60, 1060), TW, 40, 3);
  }
  // footer
  c.fillStyle = '#24425a'; c.fillRect(M, H - 130, TW, 2);
  c.fillStyle = '#9bb1c6'; c.font = qeLabFont(26, 600);
  var who = p.author ? L('By') + ' ' + p.author + ' · ' : '';
  c.fillText((who + res.asof).slice(0, 60), M, H - 76);
  c.textAlign = 'right';
  c.fillText((index + 1) + '/' + total + (index === 0 ? '  ' + L('Swipe') + ' →' : ''), W - M, H - 76);
  c.textAlign = 'left';
  return canvas;
}

/* ------------------------------------------------------------------ minimal PDF writer */
/* pages: [{jpeg: Uint8Array, width, height}] in pixels. Each page is one full-bleed JPEG at 72 dpi / 2. */
function qeLabPdf(pages) {
  var enc = function (s) { var out = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 255; return out; };
  var chunks = [], length = 0, offsets = [];
  var push = function (part) { var b = typeof part === 'string' ? enc(part) : part; chunks.push(b); length += b.length; };
  var obj = function (num, body) { offsets[num] = length; push(num + ' 0 obj\n'); body.forEach(push); push('\nendobj\n'); };
  push('%PDF-1.4\n%âãÏÓ\n');
  var n = pages.length, kids = [];
  for (var i = 0; i < n; i++) kids.push((3 + i * 3) + ' 0 R');
  obj(1, ['<< /Type /Catalog /Pages 2 0 R >>']);
  obj(2, ['<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + n + ' >>']);
  pages.forEach(function (pg, i) {
    var pageNo = 3 + i * 3, contentNo = pageNo + 1, imageNo = pageNo + 2;
    var w = pg.width / 2, h = pg.height / 2, content = 'q ' + w + ' 0 0 ' + h + ' 0 0 cm /Im0 Do Q';
    obj(pageNo, ['<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + w + ' ' + h + '] /Resources << /XObject << /Im0 ' + imageNo + ' 0 R >> >> /Contents ' + contentNo + ' 0 R >>']);
    obj(contentNo, ['<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream']);
    obj(imageNo, ['<< /Type /XObject /Subtype /Image /Width ' + pg.width + ' /Height ' + pg.height +
                  ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + pg.jpeg.length + ' >>\nstream\n', pg.jpeg, '\nendstream']);
  });
  var count = 3 + n * 3, xref = length;
  var table = 'xref\n0 ' + count + '\n0000000000 65535 f \n';
  for (var k = 1; k < count; k++) table += ('0000000000' + offsets[k]).slice(-10) + ' 00000 n \n';
  push(table + 'trailer\n<< /Size ' + count + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
  var out = new Uint8Array(length), at = 0;
  chunks.forEach(function (b) { out.set(b, at); at += b.length; });
  return out;
}

function qeLabDataUrlBytes(url) {
  var bin = atob(String(url).split(',')[1] || ''), out = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/* Draw every slide, return {pdf: Uint8Array, previews: [jpeg data URLs]}. */
function qeLabCarousel(res, pub, makeCanvas) {
  var pages = [], previews = [];
  qeLabSlides(res, pub).forEach(function (_, i) {
    var cv = makeCanvas();
    qeDrawLabSlide(cv, res, pub, i);
    var url = cv.toDataURL('image/jpeg', 0.92);
    previews.push(url);
    pages.push({ jpeg: qeLabDataUrlBytes(url), width: cv.width, height: cv.height });
  });
  return { pdf: qeLabPdf(pages), previews: previews };
}

/* ------------------------------------------------------------------ public site snapshot */
/* A deep copy of a Lab result with every display string in the interface language, exactly as the page
   shows it (titles, column labels, text cells, chart titles, series names, source labels, disclaimer).
   Numbers are untouched; findings, notes and warnings already arrive localized from the API. */
function qeLabLocalized(res) {
  var out = JSON.parse(JSON.stringify(res || {}));
  if (typeof out.title === 'string') out.title = labL(out.title);
  if (typeof out.question === 'string') out.question = L(out.question);
  if (typeof out.disclaimer === 'string') out.disclaimer = labL(out.disclaimer);
  (out.highlights || []).forEach(function (h) { if (h && typeof h.label === 'string') h.label = labL(h.label); });
  ((out.quality || {}).items || []).forEach(function (it) { if (it && typeof it.label === 'string') it.label = labL(it.label); });
  (out.tables || []).forEach(function (t) {
    if (typeof t.title === 'string') t.title = labL(t.title);
    var textCols = [];
    (t.columns || []).forEach(function (c) {
      if (typeof c.label === 'string') c.label = labL(c.label);
      if (c.fmt === 'text') textCols.push(c.key);
    });
    (t.rows || []).forEach(function (r) {
      textCols.forEach(function (k) { if (typeof r[k] === 'string') r[k] = labL(r[k]); });
    });
  });
  (out.charts || []).forEach(function (ch) {
    if (typeof ch.title === 'string') ch.title = labL(ch.title);
    (ch.series || []).forEach(function (s) { if (typeof s.name === 'string') s.name = labL(s.name); });
  });
  (out.sources || []).forEach(function (s) { if (s && typeof s.label === 'string') s.label = qeLabSource(s.label); });
  return out;
}

/* ------------------------------------------------------------------ explicit view ("call") */
/* An optional, falsifiable view: a stance RELATIVE TO A BENCHMARK (never buy/sell, never a price target),
   a horizon, the one metric that would prove it, and a risk matrix with kill criteria
   ("I drop the view if …"). The server adds prices and review_due at publish time. */
var QE_CALL_STANCES = ['positive', 'neutral', 'negative'];
var QE_CALL_BENCHMARKS = ['SPY', 'QQQ', 'XU100.IS', 'URTH'];
var QE_CALL_BENCH_NAMES = { SPY: 'S&P 500', QQQ: 'Nasdaq 100', 'XU100.IS': 'BIST 100', URTH: 'MSCI World' };
var QE_CALL_HORIZONS = [6, 12, 24];
var QE_CALL_LEVELS = ['low', 'medium', 'high'];
var QE_CALL_COMPARATORS = ['>', '>=', '<', '<='];
var QE_CALL_UNITS = ['%', '$M', 'x', ''];
var QE_CALL_MAX_RISKS = 6;
var QE_CALL_LIMITS = { metric: [8, 120], risk: [10, 200], kill: 160 };
/* Proof-metric guards. A share price, a price target, market value or a valuation multiple (P/E, EV/EBITDA) all move with
   the share price, so they would turn the view into a disguised price target. Business figures that contain the word
   "price" (average selling price, pricing power, "fiyat artışı") stay allowed. */
var QE_CALL_SHARE_PRICE = /hisse\s+fiyat|hedef\s+fiyat|kapanış\s+fiyat|share\s+price|stock\s+price|target\s+price|price\s+target|precio\s+de\s+(?:la\s+)?acci[oó]n|precio\s+objetivo|cotizaci[oó]n|^\s*(?:\p{Lu}{1,5}(?:\.IS)?\s+)?(?:fiyat|price|precio)\p{L}*\s*$/iu;
var QE_CALL_VALUATION = /piyasa\s+değer|market\s*cap|capitalizaci[oó]n|(?<!\p{L})(?:F\s*\/\s*K|P\s*\/\s*E|PD\s*\/\s*DD|P\s*\/\s*B|P\s*\/\s*S)(?!\p{L})|EV\s*\/\s*EBITDA|FD\s*\/\s*FAVÖK|fiyat\s*\/\s*(?:kazanç|defter|satış)|price[\s-]*(?:to|\/)[\s-]*(?:earnings|book|sales)|firma\s+değer|enterprise\s+value|valor\s+de\s+(?:la\s+)?empresa/iu;
/* Kill-criterion and risk guards: a kill criterion is about the company, never "if X, I sell" or a share-price trigger. */
var QE_CALL_TRADE_WORDS = /(?<!geri\s)(?<!dikkate\s)(?<!\p{L})(?:al|sat)(?:arım|ırım|acağım|arız|ırız|acağız|ınır|ılır|ınmalı|ılmalı)(?!\p{L})|(?<!\p{L})hisse\p{L}*\s+(?:al|sat)(?!\p{L})|alım\s+fırsat|pozisyon\p{L}*\s+(?:aç|kapat)|(?<!\p{L})I(?:'ll|’ll|\s+will|\s+would)?\s+(?:sell|buy)(?!\p{L})|(?<!\p{L})(?:close|exit|open)\s+(?:my|the)\s+position|buying\s+opportunity|(?<!\p{L})(?:vendo|compro|vender[ée]|comprar[ée])(?!\p{L})|oportunidad\s+de\s+compra|(?:cierro|cerrar[ée]?)\s+(?:la|mi)\s+posici[oó]n/iu;
var QE_CALL_PRICE_TRIGGER = /\d[\d.,]*\s*(?:dolar|lira|tl|usd|\$)['’]?\p{L}*\s+(?:çık|ol|in|düş|yüksel|gör)|(?<!\p{L})hisse\p{L}*(?:\s+fiyat\p{L}*)?\s+\$?\d|piyasa\s+değer|hisse\s+fiyat|hedef\s+fiyat|share\s+price|stock\s+price|price\s+target|target\s+price|(?<!\p{L})(?:stock|shares?)\s+(?:\p{L}+\s+){0,2}(?:to|below|above|under|over)\s+\$\s?\d|market\s*cap|precio\s+de\s+(?:la\s+)?acci[oó]n|precio\s+objetivo|cotizaci[oó]n|(?<!\p{L})acci[oó]n\s+(?:\p{L}+\s+){0,2}(?:a|de|por\s+debajo\s+de|por\s+encima\s+de)\s+\$\s?\d/iu;

/* The latest fiscal year the analysis already reports (from "FY2026" labels in its tables), or 0. */
function qeCallReportedFY(res) {
  var best = 0, text = '';
  try { text = JSON.stringify((res && res.tables) || []); } catch (_) {}
  text.replace(/FY\s?(\d{4})/gi, function (_, y) { best = Math.max(best, Number(y)); return _; });
  return best;
}

function qeCallBenchName(b) { return QE_CALL_BENCH_NAMES[b] || String(b || ''); }

/* Default benchmark: BIST 100 for an Istanbul listing or the Turkey FX analysis, S&P 500 otherwise. */
function qeCallDefaultBenchmark(subject, res) {
  return /\.IS$/i.test(String(subject || '')) || (res && res.id === 'turkey_fx') ? 'XU100.IS' : 'SPY';
}

function qeCallEmptyRisk() { return { text: '', probability: 'medium', impact: 'medium', kill: '' }; }

/* The editor's draft (also what localStorage keeps). Old drafts have no call: they get "no explicit view". */
function qeCallDraft(saved) {
  saved = saved && typeof saved === 'object' ? saved : {};
  var m = saved.metric && typeof saved.metric === 'object' ? saved.metric : {};
  var risks = Array.isArray(saved.risks) ? saved.risks.slice(0, QE_CALL_MAX_RISKS).map(function (r) {
    r = r && typeof r === 'object' ? r : {};
    return { text: String(r.text || ''), kill: String(r.kill || ''),
             probability: QE_CALL_LEVELS.indexOf(r.probability) >= 0 ? r.probability : 'medium',
             impact: QE_CALL_LEVELS.indexOf(r.impact) >= 0 ? r.impact : 'medium' };
  }) : [];
  return {
    stance: QE_CALL_STANCES.indexOf(saved.stance) >= 0 ? saved.stance : 'none',
    subject: String(saved.subject || ''),
    benchmark: QE_CALL_BENCHMARKS.indexOf(saved.benchmark) >= 0 ? saved.benchmark : '',  // '' = the default for the subject
    horizon_months: QE_CALL_HORIZONS.indexOf(Number(saved.horizon_months)) >= 0 ? Number(saved.horizon_months) : null,
    metric: { label: String(m.label || ''), comparator: QE_CALL_COMPARATORS.indexOf(m.comparator) >= 0 ? m.comparator : '>',
              target: m.target === null || m.target === undefined ? '' : String(m.target), unit: QE_CALL_UNITS.indexOf(m.unit) >= 0 ? m.unit : '%' },
    risks: risks.length ? risks : [qeCallEmptyRisk()]
  };
}

function qeCallSubject(draft, res) {
  var subjects = (res && res.subjects) || [];
  return subjects.indexOf(draft.subject) >= 0 ? draft.subject : (subjects[0] || '');
}
function qeCallBenchmark(draft, res) { return draft.benchmark || qeCallDefaultBenchmark(qeCallSubject(draft, res), res); }

function qeCallNumber(t) {
  var s = String(t === null || t === undefined ? '' : t).trim().replace(/\s/g, '');
  if (!s) return null;
  if (/^[−-]?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '');  // 1.500,5 (Turkish thousands)
  s = s.replace('−', '-').replace(',', '.');
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : null;
}

/* Gate for a chosen view. Returns {ok, hints: [{field, text}]}; "No explicit view" is always ok
   (the thesis/risks rules of qeLabCommentary still apply). Hints are specific, never generic. */
function qeCallCheck(draft, res) {
  draft = qeCallDraft(draft);
  var hints = [], notes = [], add = function (field, text, n) { hints.push({ field: field, text: L(text).replace('{n}', n) }); };
  if (draft.stance === 'none') return { ok: true, hints: [], notes: [] };
  if (!draft.horizon_months) add('horizon', 'Choose a horizon: 6, 12 or 24 months.');
  var m = draft.metric, label = m.label.trim(), target = String(m.target).trim();
  if (label || target) {
    if (label.length < QE_CALL_LIMITS.metric[0]) add('metric', 'Name the metric in at least 8 characters, for example FY2027 operating margin.');
    else if (QE_CALL_VALUATION.test(label)) add('metric', 'Market value and valuation multiples (P/E, EV/EBITDA) move with the share price; choose a business figure (margin, revenue growth, cash flow).');
    else if (QE_CALL_SHARE_PRICE.test(label)) add('metric', 'The proof metric must be a business figure, not a share price.');
    if (qeCallNumber(target) === null) add('metric', 'Enter the threshold as a number, for example 30.');
    var fy = /FY\s?(\d{4})/i.exec(label), reported = qeCallReportedFY(res);
    if (fy && reported && Number(fy[1]) <= reported) {
      notes.push({ field: 'metric', text: L('This year’s result is already reported; pick a period that will be reported within your horizon.') });
    }
  }
  var rows = draft.risks.filter(function (r) { return r.text.trim() || r.kill.trim(); });
  if (!rows.length) add('risks', 'Write at least one risk.');
  draft.risks.forEach(function (r, k) {
    if (!r.text.trim() && !r.kill.trim()) return;
    if (r.text.trim().length < QE_CALL_LIMITS.risk[0]) add('risks', r.text.trim() ? 'Each risk needs at least 10 characters.' : 'A kill criterion needs its risk: write the risk in the same row.');
    if (QE_CALL_TRADE_WORDS.test(r.text)) add('risks', 'Risk {n}: describe what could go wrong for the company, not a buy/sell decision.', k + 1);
    if (QE_CALL_TRADE_WORDS.test(r.kill) || QE_CALL_PRICE_TRIGGER.test(r.kill)) add('kill', 'Risk {n}: base the kill criterion on a company figure, not on the share price or a buy/sell decision.', k + 1);
  });
  if (!rows.some(function (r) { return r.text.trim() && r.kill.trim(); })) add('kill', 'Write at least one kill criterion.');
  var seen = {};
  hints = hints.filter(function (h) { return seen[h.text] ? false : (seen[h.text] = true); });
  return { ok: !hints.length, hints: hints, notes: notes };
}

/* The "call" sent to POST /lab/publications (no price fields: the server sets those). null = no explicit view. */
function qeCallBody(draft, res) {
  draft = qeCallDraft(draft);
  if (draft.stance === 'none') return null;
  var m = draft.metric, label = m.label.trim(), target = qeCallNumber(m.target);
  return {
    stance: draft.stance, subject: qeCallSubject(draft, res), benchmark: qeCallBenchmark(draft, res),
    horizon_months: draft.horizon_months,
    metric: label && target !== null ? { label: label.slice(0, QE_CALL_LIMITS.metric[1]), comparator: m.comparator, target: target, unit: m.unit } : null,
    risks: draft.risks.filter(function (r) { return r.text.trim(); }).slice(0, QE_CALL_MAX_RISKS).map(function (r) {
      return { text: r.text.trim().slice(0, QE_CALL_LIMITS.risk[1]), probability: r.probability, impact: r.impact, kill: r.kill.trim().slice(0, QE_CALL_LIMITS.kill) };
    })
  };
}

/* "S&P 500’e göre olumlu" / "Positive vs S&P 500" / "Positiva frente al S&P 500". */
function qeCallStanceLabel(stance, benchmark, lang) {
  lang = lang || QE_LANG;
  var name = qeCallBenchName(benchmark);
  if (lang === 'tr') return name + '’e göre ' + { positive: 'olumlu', neutral: 'nötr', negative: 'olumsuz' }[stance];
  if (lang === 'es') return { positive: 'Positiva', neutral: 'Neutral', negative: 'Negativa' }[stance] + ' frente al ' + name;
  return { positive: 'Positive', neutral: 'Neutral', negative: 'Negative' }[stance] + ' vs ' + name;
}

/* "12 ay için S&P 500’e göre olumlu" / "Positive vs S&P 500 over 12 months". */
function qeCallViewText(call, lang) {
  lang = lang || QE_LANG;
  var s = qeCallStanceLabel(call.stance, call.benchmark, lang), h = call.horizon_months;
  if (lang === 'tr') return h + ' ay için ' + s;
  if (lang === 'es') return s.charAt(0).toLowerCase() + s.slice(1) + ' a ' + h + ' meses';
  return s.charAt(0).toLowerCase() + s.slice(1) + ' over ' + h + ' months';
}

function qeCallDisclaimer() { return L('This is not investment advice; it is student work. The view is a relative expectation against the benchmark index.'); }

var QE_CALL_CMP_SIGNS = { '>': '>', '>=': '≥', '<': '<', '<=': '≤' };
/* "FY2026 faaliyet marjı > %30" (units follow the interface language). */
function qeCallMetricText(metric) {
  if (!metric) return '';
  var v = Number(metric.target), num;
  if (metric.unit === '%') num = qeLabPct(v, qeLabDigitsOf(v), qeLabSign(v, qeLabDigitsOf(v)));
  else if (metric.unit === '$M') num = labMoney(v);
  else if (metric.unit === 'x') num = qeLabSign(v, 2) + qeLabTrim(qeLabFixed(v, 2)) + '×';
  else num = qeLabSign(v, 2) + qeLabTrim(qeLabFixed(v, 2));
  return metric.label + ' ' + (QE_CALL_CMP_SIGNS[metric.comparator] || metric.comparator) + ' ' + num;
}
function qeLabDigitsOf(v) { var s = String(Math.abs(v)), i = s.indexOf('.'); return i < 0 ? 0 : Math.min(2, s.length - i - 1); }

function qeCallKills(call) { return ((call && call.risks) || []).map(function (r) { return String(r.kill || '').trim(); }).filter(Boolean); }

/* The block that goes into the LinkedIn text and the report notes. kills: how many kill criteria to keep. */
function qeCallLines(call, kills) {
  if (!call) return [];
  var out = [L('My view') + ': ' + qeCallViewText(call) + '.'];
  if (call.metric) out.push(L('My proof metric') + ': ' + qeCallMetricText(call.metric) + '.');
  var k = qeCallKills(call).slice(0, kills === undefined ? QE_CALL_MAX_RISKS : kills);
  if (k.length) out.push(L(k.length > 1 ? 'My kill criteria' : 'My kill criterion') + ': ' + k.map(function (x, i) {
    x = x.replace(/[.;\s]+$/, '');
    return i && !/^\p{Lu}[\p{Lu}\d]/u.test(x) ? x.charAt(0).toLocaleLowerCase(QE_LANG === 'tr' ? 'tr' : undefined) + x.slice(1) : x;
  }).join('; ') + '.');
  out.push(qeCallDisclaimer());
  return out;
}

/* "Düşük/Orta/Yüksek"; Spanish agrees in gender: probabilidad baja, impacto bajo (axis = 'impact'). */
function qeCallLevel(v, axis) {
  var base = { low: 'Low', medium: 'Medium', high: 'High' }[v] || v;
  return axis === 'impact' && QE_LANG !== 'en' ? L(base + ' (impact)') : L(base);
}

var QE_CALL_COLORS = { positive: ['#173d33', '#8ee6bf'], neutral: ['#1d2c45', '#c9d8e6'], negative: ['#3e1f27', '#ee919f'] };

/* "MY VIEW" slide: stance badge, horizon and benchmark, the proof metric, the kill criteria, the disclaimer. */
function qeDrawCallSlide(c, call, heading, M, TW) {
  var y = heading(L('MY VIEW')), col = QE_CALL_COLORS[call.stance] || QE_CALL_COLORS.neutral;
  var badge = qeCallStanceLabel(call.stance, call.benchmark);
  badge = badge.charAt(0).toUpperCase() + badge.slice(1);
  c.font = qeLabFont(52, 800);
  var bw = Math.min(TW, c.measureText(badge).width + 72);
  c.fillStyle = col[0]; c.fillRect(M, y, bw, 100);
  c.fillStyle = col[1]; c.fillRect(M, y, 10, 100);
  c.fillText(qeLabLines(c, badge, TW - 72, 1)[0], M + 40, y + 68);
  y += 160;
  c.fillStyle = '#c9d8e6'; c.font = qeLabFont(34, 600);
  c.fillText((call.horizon_months + ' ' + L('months') + ' · ' + call.subject + ' · ' + L('benchmark') + ': ' + qeCallBenchName(call.benchmark)).slice(0, 56), M, y);
  y += 90;
  if (call.metric) {
    c.fillStyle = '#43d9d2'; c.font = qeLabFont(26, 800); c.fillText(L('PROOF METRIC'), M, y);
    c.fillStyle = '#f5faff'; c.font = qeLabFont(42, 700);
    y = qeLabWrap(c, qeCallMetricText(call.metric), M, y + 60, TW, 54, 2) + 50;
  }
  var kills = qeCallKills(call);
  if (kills.length) {
    c.fillStyle = '#edbc6c'; c.font = qeLabFont(26, 800); c.fillText(L('I DROP THE VIEW IF'), M, y);
    y += 56;
    var killEnd = call.noise && qeNoiseBandText(call.noise.band68) ? 990 : 1060;
    kills.slice(0, 4).forEach(function (k) {
      if (y > killEnd) return;
      c.fillStyle = '#edbc6c'; c.font = qeLabFont(34, 800); c.fillText('×', M, y);
      c.fillStyle = '#e8f1fa'; c.font = qeLabFont(32, 600);
      y = qeLabWrap(c, k, M + 46, y, TW - 46, 42, Math.max(1, Math.min(3, Math.floor((killEnd + 30 - y) / 42)))) + 22;
    });
  }
  // the stored noise band (chance-only range of the gap), so a shared image keeps that context
  var b68 = call.noise ? qeNoiseBandText(call.noise.band68) : '';
  if (b68) {
    c.fillStyle = '#c9d8e6'; c.font = qeLabFont(26, 600);
    y = qeLabWrap(c, L('Noise band (random-walk model, not a forecast): by chance alone the gap stays between {lo} and {hi} points 2 times in 3.')
      .replace('{lo}', b68.split('/')[0]).replace('{hi}', b68.split('/')[1]), M, Math.max(y + 30, 1050), TW, 34, 3) - 20;
  }
  c.fillStyle = '#9bb1c6'; c.font = qeLabFont(24, 600);
  qeLabWrap(c, qeCallDisclaimer(), M, Math.max(y + 30, 1140), TW, 32, 2);
}

/* Risk matrix slide: 3×3 grid laid out like the public site (impact across, probability up: high probability on top),
   numbered risks placed in their cells, then the list. */
function qeDrawMatrixSlide(c, call, heading, M, TW) {
  var y = heading(L('RISK MATRIX')), risks = (call.risks || []).slice(0, QE_CALL_MAX_RISKS);
  var axisW = 70, GX = M + axisW, GW = TW - axisW, cell = GW / 3, GH = cell * 0.62 * 3, ch = GH / 3, GY = y + 10;
  var lvl = function (v) { return Math.max(0, QE_CALL_LEVELS.indexOf(v)); };
  var heat = ['#12263a', '#2a2a1e', '#3e1f27'];
  for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {  // i = impact (left→right), j = probability (bottom→top)
    var score = i + j;
    c.fillStyle = heat[score <= 1 ? 0 : score <= 2 ? 1 : 2];
    c.fillRect(GX + i * cell + 3, GY + (2 - j) * ch + 3, cell - 6, ch - 6);
  }
  c.fillStyle = '#8299AE'; c.font = qeLabFont(22, 700);
  QE_CALL_LEVELS.forEach(function (v, k) {
    c.textAlign = 'center'; c.fillText(qeCallLevel(v, 'impact'), GX + cell * (k + 0.5), GY + GH + 34);
    c.textAlign = 'right'; c.fillText(qeCallLevel(v), GX - 12, GY + (2 - k + 0.5) * ch + 8);
  });
  c.textAlign = 'center'; c.font = qeLabFont(22, 800); c.fillStyle = '#c9d8e6';
  c.fillText(L('IMPACT') + ' →', GX + GW / 2, GY + GH + 72);
  c.textAlign = 'left'; c.fillText('↑ ' + L('PROBABILITY'), M - 10, GY - 18);
  var total = {}, inCell = {}, key = function (r) { return lvl(r.impact) + '-' + lvl(r.probability); };
  risks.forEach(function (r) { total[key(r)] = (total[key(r)] || 0) + 1; });
  risks.forEach(function (r, k) {
    var kk = key(r), n = inCell[kk] = (inCell[kk] || 0) + 1, many = total[kk], row = n > 3 ? 1 : 0, inRow = row ? many - 3 : Math.min(many, 3);
    var pos = (n - 1) % 3, cx = GX + (lvl(r.impact) + 0.5) * cell + (pos - (inRow - 1) / 2) * 58;
    var cy = GY + (2 - lvl(r.probability) + 0.5) * ch + (many > 3 ? (row ? 28 : -28) : 0);
    c.fillStyle = '#43d9d2'; c.beginPath(); c.arc(cx, cy, 24, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#04201f'; c.font = qeLabFont(26, 800); c.textAlign = 'center'; c.fillText(String(k + 1), cx, cy + 9); c.textAlign = 'left';
  });
  y = GY + GH + 130;
  risks.forEach(function (r, k) {
    if (y > 1150) return;
    c.fillStyle = '#43d9d2'; c.font = qeLabFont(28, 800); c.fillText(String(k + 1), M, y);
    c.fillStyle = '#e8f1fa'; c.font = qeLabFont(27, 600);
    y = qeLabWrap(c, r.text, M + 44, y, TW - 44, 36, risks.length > 3 ? 1 : 2);
    if (r.kill && risks.length <= 3) { c.fillStyle = '#edbc6c'; c.font = qeLabFont(23, 600); y = qeLabWrap(c, L('Kill criterion') + ': ' + r.kill, M + 44, y + 2, TW - 44, 32, risks.length > 2 ? 1 : 2); }
    y += 18;
  });
}

/* Text the wording check reads besides the thesis and the risks paragraph. */
function qeCallClaimText(draft) {
  draft = qeCallDraft(draft);
  if (draft.stance === 'none') return '';
  var parts = [draft.metric.label].concat(draft.risks.map(function (r) { return r.text + '\n' + r.kill; }));
  var t = parts.map(function (x) { return String(x || '').trim(); }).filter(Boolean).join('\n');
  return t ? '\n' + t : '';
}

/* Body of POST /lab/publications. "call" is sent only when the student chose a view. */
function qeLabPublicationBody(res, commentary, call) {
  var body = { result: qeLabLocalized(res), view: commentary.view, counter: commentary.counter, author: commentary.author, language: QE_LANG };
  if (call) body.call = call;
  return body;
}

/* Relative noise band of a planned view (GET /lab/noise, noise_band.py): how big a gap between the stock and its
   benchmark chance alone produces over the horizon, under a random-walk (Brownian motion) model with zero assumed
   edge. A range of outcomes under the model, NOT a forecast. Shown inside "Your view"; it never blocks publishing.
   The server computes the same band again at publish time and stores it with the view (client values are ignored). */
var QE_NOISE_CAVEAT = 'Range of outcomes under a random-walk model, not a forecast. Zero assumed edge; volatility from the last 3 years of daily relative returns. Real returns have fat tails, volatility clustering and regime changes; the model can be wrong. The band is for the relative return: when the benchmark moves a lot (e.g. BIST in lira) the gap in points scales with it.';
var QE_NOISE_MAIN = 'By chance alone (random-walk model), over this horizon the gap versus the {b} stays between {lo} and {hi} points about 2 times in 3. A result inside that range cannot be told apart from luck.';

/* The query for a chosen stance and horizon, else null (nothing to ask yet). */
function qeNoiseQuery(draft, res) {
  draft = qeCallDraft(draft);
  if (draft.stance === 'none' || !draft.horizon_months || !res) return null;
  var subject = qeCallSubject(draft, res);
  if (!subject) return null;
  return { subject: subject, benchmark: qeCallBenchmark(draft, res), horizon_months: draft.horizon_months, analysis: res.id || '' };
}

function qeNoiseUrl(q) {
  return '/lab/noise?subject=' + encodeURIComponent(q.subject) + '&benchmark=' + encodeURIComponent(q.benchmark) +
    '&horizon_months=' + encodeURIComponent(q.horizon_months) + '&analysis=' + encodeURIComponent(q.analysis || '');
}

/* '−12/+14' (whole points, typographic minus) from [lo, hi], or '' when malformed. */
function qeNoiseBandText(band) {
  if (!Array.isArray(band) || band.length !== 2 || !isFinite(band[0]) || !isFinite(band[1]) || band[0] === null || band[1] === null) return '';
  // half away from zero (−19.5 → −20), the same rounding as the public site
  var one = function (v) { v = Number(v); var r = Math.round(Math.abs(v)) * (v < 0 ? -1 : 1); return (r < 0 ? '−' : r > 0 ? '+' : '') + Math.abs(r); };
  return one(band[0]) + '/' + one(band[1]);
}

/* The sentences shown for a band: [main sentence, 95% sentence, neutral-band chance, caveat]; [] without a valid band. */
function qeNoiseLines(noise, benchmark) {
  if (!noise || typeof noise !== 'object') return [];
  var b68 = qeNoiseBandText(noise.band68), b95 = qeNoiseBandText(noise.band95);
  if (!b68 || !b95) return [];
  var name = qeCallBenchName(benchmark || noise.benchmark);
  var lo = b68.split('/')[0], hi = b68.split('/')[1];
  var out = [L(QE_NOISE_MAIN).replace('{b}', name).replace('{lo}', lo).replace('{hi}', hi)];
  out.push(L('19 times in 20 the gap stays between {lo} and {hi} points.').replace('{lo}', b95.split('/')[0]).replace('{hi}', b95.split('/')[1]));
  var p = Number(noise.p_within_neutral);
  if (noise.p_within_neutral !== null && noise.p_within_neutral !== undefined && isFinite(p) && p >= 0 && p <= 1) {
    out.push(L('By chance alone, the gap stays within ±5 points (a neutral view’s hit band) about {p}% of the time.').replace('{p}', String(Math.round(p * 100))));
  }
  out.push(L(QE_NOISE_CAVEAT));
  return out;
}

/* What the panel shows for a noise request state: {cls, lines}. state: {status: 'loading'|'ok'|'failed', data, error}. */
function qeNoiseView(state, benchmark) {
  if (!state || !state.status) return null;
  if (state.status === 'loading') return { cls: 'is-loading', lines: [L('Measuring how big a gap chance alone produces…')] };
  if (state.status === 'ok') {
    var lines = qeNoiseLines(state.data, benchmark);
    if (lines.length) return { cls: 'is-ok', lines: lines };
  }
  return { cls: 'is-failed', lines: [L('The noise band could not be computed right now; you can still publish. The server tries again when you publish.')] };
}

/* Pre-publish reviewer checklist: how a research editor would read the note before it goes out.
   Advisory only (the hard gates stay qeLabCommentary + qeCallCheck). Returns {score 0–100, passed, total, items}. */
var QE_CHECK_HORIZON = /\b(\d{1,2}\s*(ay|month|mes)|\d{1,2}\s*(yıl|year|año)|çeyrek|quarter|trimestre|FY\s?\d{4}|20\d{2})/i;
var QE_CHECK_LIMIT = /(varsay|sınır|kısıt|veri|model|örneklem|tek çeyrek|kısa dönem|assum|limit|data|sample|one quarter|short window|supuest|datos|muestra)/i;
var QE_CHECK_BECAUSE = /(çünkü|nedeniyle|sayesinde|bu yüzden|because|driven by|due to|since|porque|debido)/i;
function qeLabChecklist(res, commentary, callDraft, flags) {
  var view = String((commentary && commentary.view) || ''), counter = String((commentary && commentary.counter) || '');
  var draft = qeCallDraft(callDraft), explicit = draft.stance !== 'none';
  var killRows = draft.risks.filter(function (r) { return r.text.trim() && r.kill.trim(); });
  var digitsInRes = /\d/.test(view) && (res && (res.findings || []).length > 0);
  var items = [
    { ok: view.length >= QE_LAB_MIN_VIEW, label: 'The thesis is a full argument', tip: 'Write at least 80 characters: what you think and why.' },
    { ok: /\d/.test(view) && !!digitsInRes, label: 'The thesis uses a number from the analysis', tip: 'Quote one figure from the findings (a margin, a growth rate) so a reader can check it.' },
    { ok: QE_CHECK_BECAUSE.test(view), label: 'The thesis gives a reason', tip: 'Say why: use “because …” and name the driver.' },
    { ok: (explicit && !!draft.horizon_months) || QE_CHECK_HORIZON.test(view), label: 'There is a time frame', tip: 'Say over what period you expect this (e.g. 12 months, FY2027).' },
    { ok: explicit && qeCallCheck(callDraft, res).ok, label: 'There is a falsifiable view', tip: 'Choose an explicit view with a horizon and a metric that would prove it.' },
    { ok: killRows.length >= 1, label: 'There is a kill criterion', tip: 'Write one company figure that would make you drop the view.' },
    { ok: counter.length >= QE_LAB_MIN_COUNTER && (/\d/.test(counter) || counter.split(/[.!?]/).filter(function (s) { return s.trim().length > 15; }).length >= 2),
      label: 'The risks are specific', tip: 'Name at least two concrete risks, ideally with a figure or a date.' },
    { ok: QE_CHECK_LIMIT.test(view + ' ' + counter), label: 'The limits of the data are acknowledged', tip: 'Mention one limit: the assumptions, a short window, or what the data cannot show.' },
    { ok: !(flags && flags.length), label: 'No overclaiming wording', tip: 'Soften the flagged phrases: “certain”, “guaranteed”, “will” become “likely”, “suggests”.' },
    { ok: !!(res && (res.sources || []).length), label: 'Sources are cited', tip: 'The analysis has no sources; run it again with official data.' }
  ];
  var passed = items.filter(function (i) { return i.ok; }).length;
  return { score: Math.round(passed / items.length * 100), passed: passed, total: items.length, items: items };
}
function qeLabChecklistView(e, check) {
  var grade = check.score >= 80 ? 'good' : check.score >= 50 ? 'fair' : 'weak';
  return e('div', { className: 'lab-checklist is-' + grade, role: 'status', 'aria-live': 'polite' },
    e('div', { className: 'lab-checklist-head' },
      e('strong', null, L('Reviewer checklist')),
      e('span', { className: 'lab-checklist-score' }, check.score + '/100 · ' + check.passed + '/' + check.total)),
    e('div', { className: 'lab-checklist-bar', 'aria-hidden': 'true' }, e('i', { style: { width: check.score + '%' } })),
    e('ul', null, check.items.map(function (it, k) {
      return e('li', { key: k, className: it.ok ? 'ok' : 'todo' },
        e('span', { className: 'mark', 'aria-hidden': 'true' }, it.ok ? '✓' : '○'),
        e('span', null, L(it.label), !it.ok && e('small', null, L(it.tip))));
    })),
    e('small', { className: 'micro muted' }, L('Advice from an editor’s point of view, not a grade of your opinion. Publishing only needs the thesis and risks.')));
}


/* Carousel football field: one horizontal low–high bar per method and a vertical line at the latest price. */
function qeLabDrawRange(c, ch, X0, Y0, X1, Y1, opts) {
  var labelSize = opts.labelSize || 13, n = ch.x.length;
  var lows = (ch.series[0] || { values: [] }).values, highs = (ch.series[1] || { values: [] }).values;
  var marker = ch.marker && isFinite(ch.marker.value) ? ch.marker : null;
  var vals = lows.concat(highs).filter(function (v) { return v !== null && v !== undefined && isFinite(v); });
  if (marker) vals.push(marker.value);
  if (!vals.length || !n) return false;
  c.font = qeLabFont(labelSize, 600);
  var names = ch.x.map(function (x) { return labL(String(x)); });
  var nameW = Math.min((X1 - X0) * 0.38, Math.max.apply(null, names.map(function (t) { return c.measureText(t).width; })));
  var PX0 = X0 + nameW + 24, PX1 = X1 - 8, top = Y0 + labelSize * 2.2, bottom = Y1 - labelSize * 2;
  var nice = qeLabNiceTicks(Math.min.apply(null, vals), Math.max.apply(null, vals), 4), ticks = nice.ticks, lo = ticks[0], hi = ticks[ticks.length - 1];
  var xx = function (v) { return PX0 + (v - lo) / (hi - lo) * (PX1 - PX0); };
  var row = (bottom - top) / n;
  c.strokeStyle = '#24374c'; c.lineWidth = 1; c.fillStyle = '#8299AE'; c.textAlign = 'center';
  ticks.forEach(function (t) {
    c.beginPath(); c.moveTo(xx(t), top); c.lineTo(xx(t), bottom); c.stroke();
    c.fillText(qeLabTickLabel(t, ch.fmt, nice.step, Math.max(Math.abs(lo), Math.abs(hi))), xx(t), bottom + labelSize * 1.5);
  });
  names.forEach(function (name, i) {
    var cy = top + row * (i + 0.5), a = lows[i], b = highs[i];
    c.textAlign = 'right'; c.fillStyle = '#c9d8e6'; c.font = qeLabFont(labelSize, 600);
    c.fillText(name.length > 28 ? name.slice(0, 27) + '…' : name, PX0 - 16, cy + labelSize / 3);
    if (a === null || a === undefined || b === null || b === undefined || !isFinite(a) || !isFinite(b)) return;
    var inside = marker && marker.value >= Math.min(a, b) && marker.value <= Math.max(a, b), h = Math.min(row * 0.55, labelSize * 1.6);
    c.fillStyle = inside ? '#43d9d2' : '#3d5266';
    c.fillRect(xx(Math.min(a, b)), cy - h / 2, Math.max(xx(Math.max(a, b)) - xx(Math.min(a, b)), 4), h);
  });
  if (marker) {
    var mx = xx(marker.value);
    c.strokeStyle = '#edbc6c'; c.lineWidth = 3; c.beginPath(); c.moveTo(mx, top - labelSize * 0.6); c.lineTo(mx, bottom); c.stroke();
    c.fillStyle = '#edbc6c'; c.font = qeLabFont(labelSize, 700); c.textAlign = mx > PX1 - 140 ? 'right' : 'center';
    c.fillText(labL(marker.name) + ' ' + labFormat(marker.value, ch.fmt), mx, top - labelSize);
  }
  c.textAlign = 'left';
  return true;
}

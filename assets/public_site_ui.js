/* QuantEdge v0.13.5 — "My public site".
 *
 * The student picks Lab analyses (Analysis Lab → "Add to my public site"); each becomes an
 * immutable snapshot with their own view and counterargument. This page edits the site's
 * name/headline/bio/LinkedIn link, lists the published analyses with a "Was I right?" review
 * timeline, and hands over a static site (preview + ZIP) to upload to GitHub Pages for free.
 * QuantEdge itself stays on this computer; only what is listed here becomes public.
 */
var QE_SITE_VERDICTS = [['held', 'My thesis held'], ['partly', 'Partly'], ['failed', 'It did not hold'], ['too_early', 'Too early to tell']];
var QE_SITE_LANGUAGES = [['tr', 'Türkçe'], ['en', 'English'], ['es', 'Español']];
var QE_SITE_LIMITS = { author: 80, headline: 160, bio: 600, linkedin_url: 200, site_url: 200, note: 1000 };
var QE_SITE_FIELDS = ['author', 'headline', 'bio', 'linkedin_url', 'site_url', 'language'];

function qeSiteVerdictLabel(id) {
  var hit = QE_SITE_VERDICTS.find(function (v) { return v[0] === id; });
  return L(hit ? hit[1] : String(id || ''));
}

/* Form values as the API expects them: trimmed strings, a known language. */
function qeSiteSettingsBody(form) {
  form = form || {};
  var out = {};
  QE_SITE_FIELDS.forEach(function (k) { out[k] = String(form[k] === null || form[k] === undefined ? '' : form[k]).trim(); });
  if (!QE_SITE_LANGUAGES.some(function (l) { return l[0] === out.language; })) out.language = 'tr';
  return out;
}

/* A light check before saving; the API stays the judge (it also checks the host is linkedin.com). */
function qeSiteLinkedInHint(url) {
  var u = String(url || '').trim();
  if (!u) return '';
  if (!/^https:\/\//i.test(u)) return L('The LinkedIn link must start with https://');
  if (!/^https:\/\/([a-z0-9-]+\.)*linkedin\.com(\/|$)/i.test(u)) return L('Use your LinkedIn profile address, for example https://www.linkedin.com/in/your-name');
  return '';
}

/* Today as YYYY-MM-DD in local time; a review is due when review_due <= today. */
function qeSiteToday() {
  var d = new Date();
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}
function qeSiteReviewDue(summary, today) {
  return !!(summary && summary.review_due && String(summary.review_due).slice(0, 10) <= (today || qeSiteToday()));
}

/* Stance badge and review date for a list item (call_summary from GET /lab/publications). */
function qeSiteCallChips(e, summary, today) {
  if (!summary || QE_CALL_STANCES.indexOf(summary.stance) < 0) return null;
  var label = qeCallStanceLabel(summary.stance, summary.benchmark), due = qeSiteReviewDue(summary, today);
  return e('span', { className: 'site-call' },
    e('span', { className: 'call-badge ' + summary.stance }, label.charAt(0).toUpperCase() + label.slice(1) + ' · ' + summary.horizon_months + ' ' + L('months')),
    summary.review_due && e('span', { className: 'site-review-due' + (due ? ' is-due' : '') },
      L('Review date') + ': ' + qeDate(summary.review_due) + (due ? ' · ' + L('due now') : '')),
    e('span', { className: 'site-call-note' }, L('Relative view · not investment advice')));
}

/* The full view as published (detail of one publication), with the prices the server recorded. */
function qeSiteCallDetail(e, call) {
  if (!call || QE_CALL_STANCES.indexOf(call.stance) < 0) return null;
  var price = function (p) { return p && p.symbol ? p.symbol + ' ' + qeLabTrim(qeLabFixed(Number(p.close), 2)) + ' (' + qeDate(p.date) + ')' : ''; };
  var prices = [price(call.price), price(call.benchmark_price)].filter(Boolean);
  return e('div', { className: 'site-call-detail' },
    e('p', null, e('strong', null, L('My view') + ': '), qeCallViewText(call) + '.'),
    call.metric && e('p', null, e('strong', null, L('My proof metric') + ': '), qeCallMetricText(call.metric) + '.'),
    (call.risks || []).length > 0 && e('ul', null, call.risks.map(function (r, i) {
      return e('li', { key: i }, r.text, e('span', { className: 'micro muted' }, ' · ' + L('Probability') + ': ' + qeCallLevel(r.probability) + ' · ' + L('Impact') + ': ' + qeCallLevel(r.impact, 'impact')),
        r.kill && e('span', { className: 'site-kill' }, L('I drop the view if') + ': ' + r.kill));
    })),
    prices.length > 0 && e('p', { className: 'micro muted' }, L('Closing prices at publication') + ': ' + prices.join(' · ')),
    call.price_note && e('p', { className: 'micro muted' }, call.price_note),
    e('p', { className: 'micro call-disclaimer' }, qeCallDisclaimer()));
}

/* Verifiable track record (GET /lab/track-record). The server measures every published view
 * against its benchmark with adjusted closing prices; this page only shows what it returns and
 * never fills a gap with a number of its own. A view is open until its review date; only matured
 * views count towards the hit rate. The student's own "Was I right?" reviews stay separate. */
var QE_TRACK_NEUTRAL_BAND = 5;
var QE_TRACK_METHOD = 'Positive view: a hit if the stock returned more than the benchmark. Negative view: a hit if the stock’s return trailed the benchmark. Neutral view: a hit if the gap stayed within ±{band} percentage points. The gap is the stock’s return minus the benchmark’s, in percentage points; the average “in the view’s direction” flips the sign for negative views and uses the room left inside the ±{band} band for neutral ones. Measured with adjusted closing prices (dividends and splits), in the stock’s own currency against a benchmark in the same currency (BIST shares in TL against BIST 100; BIST 100 is a price index without dividends, so for BIST shares the gap is overstated by roughly the dividend yield). Open views are not counted. Not investment advice; past results do not predict future ones.';
var QE_TRACK_LOCALE = { tr: 'tr-TR', es: 'es-ES', en: 'en-US' };
function qeTrackIsNum(v) { return typeof v === 'number' && isFinite(v); }
function qeTrackFixed(v, d) {
  /* round the exact binary value first (toFixed), like the site generator, so app and site show the same digit */
  return Number(Math.abs(v).toFixed(d)).toLocaleString(QE_TRACK_LOCALE[QE_LANG] || 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function qeTrackSign(v, d) { return v < 0 && /[1-9]/.test(qeTrackFixed(v, d)) ? '−' : v > 0 && /[1-9]/.test(qeTrackFixed(v, d)) ? '+' : ''; }
/* "+3,1 puan" / "−2,0 pts"; null when the server sent no number. */
function qeTrackPtsD(v, d) { return qeTrackIsNum(v) ? qeTrackSign(v, d) + qeTrackFixed(v, d) + ' ' + L('pts') : null; }
function qeTrackPts(v) { return qeTrackPtsD(v, 1); }
/* 2 decimals when the excess is within 0.1 of the hit line (0, or ±band for a neutral view): a neutral miss at
 * 5,04 must not read "+5,0 puan" next to a "±5 is a hit" rule. */
function qeTrackChipDigits(perf, v) {
  var line = perf && perf.stance === 'neutral' ? QE_TRACK_NEUTRAL_BAND : 0;
  return Math.abs(Math.abs(v) - line) < 0.1 ? 2 : 1;
}
/* "%62,5" / "62.5%" / "62,5 %"; signed adds + or −. */
function qeTrackPct(v, signed) {
  if (!qeTrackIsNum(v)) return null;
  var s = signed ? qeTrackSign(v, 1) : (v < 0 && /[1-9]/.test(qeTrackFixed(v, 1)) ? '−' : ''), t = qeTrackFixed(v, 1);
  return QE_LANG === 'tr' ? s + '%' + t : QE_LANG === 'es' ? s + t + ' %' : s + t + '%';
}
function qeTrackBenchName(b) {
  return typeof qeCallBenchName === 'function' ? qeCallBenchName(b) : ({ SPY: 'S&P 500', QQQ: 'Nasdaq 100', 'XU100.IS': 'BIST 100', URTH: 'MSCI World' }[b] || String(b || ''));
}

/* The noise label of a view measured against its stored noise band (noise_band.py): 'within normal noise' /
   'notable' / 'unusual', with 'interim: ' for an open view; '' when the view has no band (old views) or no z yet. */
var QE_NOISE_LABELS = { within: 'within normal noise', notable: 'notable', unusual: 'unusual' };
function qeTrackNoiseLabel(perf) {
  var nz = perf && perf.noise;
  if (!nz || typeof nz !== 'object' || !QE_NOISE_LABELS[nz.label] || !qeTrackIsNum(nz.z)) return '';
  var label = L(QE_NOISE_LABELS[nz.label]);
  return nz.interim ? L('interim') + ': ' + label : label;
}
/* 'z = +1,32' in the interface language */
function qeTrackZ(perf) {
  var nz = perf && perf.noise;
  if (!nz || !qeTrackIsNum(nz.z)) return '';
  return 'z = ' + qeTrackSign(nz.z, 2) + qeTrackFixed(nz.z, 2);
}

/* The status chip of one item: {kind, text, title} or null when the item has no measured view. */
function qeTrackChip(perf, benchmark) {
  if (!perf || typeof perf !== 'object') return null;
  var pts = qeTrackIsNum(perf.excess_pts) ? qeTrackPtsD(perf.excess_pts, qeTrackChipDigits(perf, perf.excess_pts)) : null, kind, label;
  if (perf.status === 'unavailable') {
    return { kind: 'unavailable', text: L('Price unavailable'), title: (perf.notes || []).map(L).join(' · ') || L('Current prices could not be loaded.') };
  }
  if (perf.status === 'open') { kind = 'open'; label = L('In progress'); }
  else if (perf.status === 'matured') {
    kind = perf.outcome === 'hit' ? 'hit' : perf.outcome === 'miss' ? 'miss' : 'matured';
    label = L(kind === 'hit' ? 'Hit' : kind === 'miss' ? 'Missed' : 'Matured');
  } else return null;
  var title = pts ? L('Return vs {bench}, in percentage points').replace('{bench}', qeTrackBenchName(benchmark)) : '';
  if (pts && perf.start_date && perf.end_date) title += ' · ' + qeDate(perf.start_date) + ' → ' + qeDate(perf.end_date);
  /* an open view's number is interim: "Devam ediyor · şimdilik +3,1 puan" */
  var noise = qeTrackNoiseLabel(perf);
  if (noise) title += (title ? ' · ' : '') + qeTrackZ(perf) + ' (' + L('random-walk noise band, not a forecast') + ')';
  return { kind: kind, text: label + (pts ? ' · ' + (kind === 'open' ? L('so far {x}').replace('{x}', pts) : pts) : '') + (noise ? ' · ' + noise : ''), title: title };
}

/* "day 120 of 365"; null without both numbers. */
function qeTrackProgress(perf) {
  if (!perf || !qeTrackIsNum(perf.days_elapsed) || !qeTrackIsNum(perf.days_total) || perf.days_total <= 0) return null;
  var a = Math.max(0, Math.min(perf.days_elapsed, perf.days_total));
  return { pct: Math.round(a / perf.days_total * 100), text: L('day {a} of {b}').replace('{a}', a).replace('{b}', perf.days_total) };
}

/* Scorecard as plain text rows (also used by the tests). data = GET /lab/track-record. */
function qeTrackSummary(data) {
  var sc = (data && data.scorecard) || {}, items = (data && data.items) || [];
  var n = function (v) { return qeTrackIsNum(v) ? v : 0; };
  var out = { withView: n(sc.with_view), open: n(sc.open), matured: n(sc.matured), stats: [], lines: [], best: null, worst: null,
              updated: data && data.as_of ? L('Last updated') + ': ' + qeDate(data.as_of) : '' };
  if (!out.withView) { out.state = 'none'; out.lines.push(L('None of your published analyses has an explicit view yet. Add one in the Analysis Lab (step 1, Your view) and it is measured here automatically.')); return out; }
  var asof = String((data && data.as_of) || '').slice(0, 10), iso = /^\d{4}-\d{2}-\d{2}$/;
  /* views whose review date has passed but that could not be priced: shown, never silently dropped */
  var unpricedDue = qeTrackIsNum(sc.unavailable_due) ? sc.unavailable_due : items.filter(function (it) {
    var d = String(it.review_due || '').slice(0, 10);
    return it.performance && it.performance.status === 'unavailable' && iso.test(d) && asof && d < asof;
  }).length;
  out.unpricedDue = unpricedDue;
  var unavailable = n(sc.unavailable);
  if (unpricedDue) out.lines.push(L('{n} matured view(s) could not be measured because prices were unavailable; they are not in the hit rate.').replace('{n}', unpricedDue));
  if (!out.matured) {
    out.state = 'pending';
    /* only review dates still ahead: a past date is not "the first result" */
    var dues = items.map(function (it) { return String(it.review_due || '').slice(0, 10); })
      .filter(function (d) { return iso.test(d) && (!asof || d >= asof); }).sort();
    out.firstDue = dues[0] || '';
    if (!unpricedDue) out.lines.push(out.firstDue ? L('No view has reached its review date yet; the first result is due on {date}.').replace('{date}', qeDate(out.firstDue))
      : L('No view has reached its review date yet.'));
    out.stats.push([L('Open views'), String(out.open)]);
    if (unavailable) out.stats.push([L('Not measurable (no prices)'), String(unavailable)]);
    return out;
  }
  out.state = 'ready';
  var rate = qeTrackPct(sc.hit_rate_pct);
  out.stats.push([L('Matured'), String(out.matured)], [L('Hits'), String(n(sc.hits))],
    [L('Hit rate'), rate ? rate + ' (' + n(sc.hits) + '/' + out.matured + ')' : '—'],
    [L('Avg. in the view’s direction'), qeTrackPts(sc.avg_view_pts) || '—'], [L('Open views'), String(out.open)]);
  if (unavailable) out.stats.push([L('Not measurable (no prices)'), String(unavailable)]);
  if (qeTrackIsNum(sc.noise_matured) && sc.noise_matured > 0) out.stats.push([L('Hits beyond the noise'), n(sc.beyond_noise_hits) + '/' + sc.noise_matured]);
  if (out.matured < 5) out.lines.push(L('Small sample: with {n} result(s) this rate proves little.').replace('{n}', out.matured));
  /* best/worst are ranked by the server on the margin in the view's direction (a right negative call ranks high) */
  var title = function (x) {
    if (!x || typeof x !== 'object') return null;
    var hit = items.find(function (it) { return it.id && it.id === x.id; }) || {};
    var name = x.title || hit.title || x.subject || hit.subject || '', pts = qeTrackPts(x.view_pts);
    return name && pts ? name + ' · ' + pts : null;
  };
  out.best = title(sc.best); out.worst = title(sc.worst);
  if (out.matured < 2 || (sc.best && sc.worst && sc.best.id && sc.best.id === sc.worst.id)) out.worst = null;
  return out;
}

/* Matured views (or review date passed) without a "Was I right?" written on or after the review date. */
function qeTrackDueItems(data, pubItems) {
  var asof = String((data && data.as_of) || qeSiteToday()).slice(0, 10), pubs = {};
  (pubItems || []).forEach(function (p) { pubs[p.id] = p; });
  return ((data && data.items) || []).filter(function (it) {
    var due = String(it.review_due || '').slice(0, 10), perf = it.performance || {};
    if (!(perf.status === 'matured' || (due && due <= asof))) return false;
    var rv = pubs[it.id] && pubs[it.id].latest_review;
    return !(rv && due && String(rv.created_utc || '').slice(0, 10) >= due);
  });
}

/* "AAPL %12,3 · S&P 500 %4,1 · +8,2 puan (8 Kasım 2025 → 8 Kasım 2026)"; only the numbers the server sent. */
function qeTrackFacts(t) {
  var perf = t && t.performance;
  if (!perf || perf.status === 'unavailable') return '';
  var parts = [], s = qeTrackPct(perf.subject_return_pct, true), b = qeTrackPct(perf.benchmark_return_pct, true), x = qeTrackPts(perf.excess_pts);
  if (s) parts.push((t.subject || '') + ' ' + s);
  if (b) parts.push(qeTrackBenchName(t.benchmark) + ' ' + b);
  if (x) parts.push(L('difference') + ' ' + x);
  if (!parts.length) return '';
  var span = perf.start_date && perf.end_date ? ' (' + qeDate(perf.start_date) + ' → ' + qeDate(perf.end_date) + ')' : '';
  return parts.join(' · ') + span;
}

function qeTrackChipView(e, perf, benchmark) {
  var c = qeTrackChip(perf, benchmark);
  return c && e('span', { className: 'track-chip ' + c.kind, title: c.title || undefined }, c.text);
}

function PublicSite(props) {
  var e = React.createElement;
  var st = {
    settings: useState(null), form: useState(null), saving: useState(false), settingsMsg: useState(null),
    items: useState(null), listError: useState(''), expanded: useState(''), details: useState({}),
    review: useState({ verdict: '', note: '' }), reviewBusy: useState(false), reviewError: useState(''),
    confirmDelete: useState(''), deleting: useState(''), listMsg: useState(''),
    track: useState(null), trackError: useState(''),
    rr: useState({ ids: [], title: '', summary: '', conclusion: '' }), rrBusy: useState(''), rrMsg: useState(null), reports: useState([])
  };
  var lock = useMemo(function () { return { review: false, remove: false, save: false }; }, []);
  var authorHint = (props.report && props.report.author) || '';

  function loadSettings() {
    request(API + '/lab/site/settings').then(function (s) {
      st.settings[1](s);
      var f = qeSiteSettingsBody(s);
      if (!f.author && authorHint) f.author = String(authorHint).trim().slice(0, QE_SITE_LIMITS.author);
      if (!s.author && !s.headline && !s.bio && !s.linkedin_url) f.language = QE_LANG;  // never saved: follow the interface language
      st.form[1](f);
    }).catch(function (x) { st.settingsMsg[1]({ ok: false, text: L(x.message || String(x)) }); st.form[1](qeSiteSettingsBody({ author: authorHint, language: QE_LANG })); });
  }
  function loadList() {
    return request(API + '/lab/publications').then(function (d) { st.items[1](d.items || []); st.listError[1](''); })
      .catch(function (x) { st.listError[1](L(x.message || String(x))); st.items[1](st.items[0] || []); });
  }
  function loadDetail(id) {
    return request(API + '/lab/publications/' + id).then(function (d) {
      st.details[1](function (cur) { var next = Object.assign({}, cur); next[id] = d; return next; });
    }).catch(function (x) { st.reviewError[1](L(x.message || String(x))); });
  }
  /* track === null: loading; false: failed before any data arrived. */
  function loadTrack() {
    return request(API + '/lab/track-record').then(function (d) { st.track[1](d && typeof d === 'object' ? d : {}); st.trackError[1](''); })
      .catch(function (x) { st.trackError[1](L(x.message || String(x))); st.track[1](st.track[0] || false); });
  }
  function loadReports() {
    return request(API + '/lab/reports').then(function (d) { st.reports[1](d.items || []); }).catch(function () {});
  }
  useEffect(function () { loadSettings(); loadList(); loadTrack(); loadReports(); }, []);

  var form = st.form[0], saved = st.settings[0] ? qeSiteSettingsBody(st.settings[0]) : null;
  var dirty = !!(form && saved && QE_SITE_FIELDS.some(function (k) { return String(form[k]).trim() !== saved[k]; }));
  var linkHint = form ? qeSiteLinkedInHint(form.linkedin_url) : '';
  function setField(k, v) {
    st.form[1](function (f) { var next = Object.assign({}, f); next[k] = v; return next; });
    st.settingsMsg[1](null);
  }
  function saveSettings() {
    if (!form || lock.save) return;
    lock.save = true; st.saving[1](true); st.settingsMsg[1](null);
    request(API + '/lab/site/settings', { method: 'PUT', body: JSON.stringify(qeSiteSettingsBody(form)) })
      .then(function (s) { st.settings[1](s); st.form[1](qeSiteSettingsBody(s)); st.settingsMsg[1]({ ok: true, text: L('Site settings saved.') }); })
      .catch(function (x) { st.settingsMsg[1]({ ok: false, text: L(x.message || String(x)) }); })
      .then(function () { lock.save = false; st.saving[1](false); });
  }

  function toggle(id) {
    var open = st.expanded[0] === id ? '' : id;
    st.expanded[1](open); st.review[1]({ verdict: '', note: '' }); st.reviewError[1](''); st.confirmDelete[1]('');
    if (open) loadDetail(open);
  }
  function saveReview(id) {
    var r = st.review[0];
    if (!r.verdict || lock.review) return;
    lock.review = true; st.reviewBusy[1](true); st.reviewError[1]('');
    post(API + '/lab/publications/' + id + '/reviews', { verdict: r.verdict, note: r.note.trim().slice(0, QE_SITE_LIMITS.note) })
      .then(function () { st.review[1]({ verdict: '', note: '' }); return Promise.all([loadList(), loadDetail(id)]); })
      .catch(function (x) { st.reviewError[1](L(x.message || String(x))); })
      .then(function () { lock.review = false; st.reviewBusy[1](false); });
  }
  function remove(item) {
    if (st.confirmDelete[0] !== item.id) { st.confirmDelete[1](item.id); return; }
    if (lock.remove) return;
    lock.remove = true; st.deleting[1](item.id); st.listMsg[1]('');
    request(API + '/lab/publications/' + item.id, { method: 'DELETE' })
      .then(function () {
        st.confirmDelete[1](''); if (st.expanded[0] === item.id) st.expanded[1]('');
        st.listMsg[1](L('Removed from your site. If the site is already online, delete this file in your GitHub repository and upload the new index.html from a fresh ZIP:') + ' a/' + item.slug + '.html');
        return Promise.all([loadList(), loadTrack()]);
      })
      .catch(function (x) { st.listMsg[1](L(x.message || String(x))); })
      .then(function () { lock.remove = false; st.deleting[1](''); });
  }

  var items = st.items[0];
  var companies = {};
  (items || []).forEach(function (it) { (it.subjects || []).forEach(function (s) { companies[s] = true; }); });
  var reviewed = (items || []).filter(function (it) { return it.latest_review; }).length;

  var track = st.track[0], trackById = {};
  ((track && track.items) || []).forEach(function (t) { if (t && t.id) trackById[t.id] = t; });
  function openReview(id) {
    if (st.expanded[0] !== id) toggle(id);
    setTimeout(function () {
      try { var el = document.getElementById('site-item-' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) {}
    }, 0);
  }
  function trackRow(it) {
    var t = trackById[it.id];
    if (!t || !t.performance) return null;
    var perf = t.performance, prog = perf.status === 'open' ? qeTrackProgress(perf) : null, notes = (perf.notes || []).filter(Boolean);
    return e('span', { className: 'track-row' },
      e('span', { className: 'micro muted' }, L('Measured by prices') + ':'),
      qeTrackChipView(e, perf, t.benchmark),
      prog && e('span', { className: 'track-progress', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': prog.pct, 'aria-label': L('Horizon elapsed') },
        e('span', { style: { width: prog.pct + '%' } })),
      prog && e('span', { className: 'micro muted' }, prog.text),
      notes.length > 0 && e('span', { className: 'micro muted track-notes' }, notes.map(L).join(' · ')));
  }
  /* Research report: 2–6 published analyses combined into one document (PDF and a page on the site). */
  function setRR(k, v) { st.rr[1](function (r) { var n = Object.assign({}, r); n[k] = v; return n; }); st.rrMsg[1](null); }
  function toggleRR(id) {
    var ids = st.rr[0].ids.slice(), at = ids.indexOf(id);
    if (at >= 0) ids.splice(at, 1); else if (ids.length < QE_RR.maxPubs) ids.push(id);
    setRR('ids', ids);
  }
  function rrBody() {
    var r = st.rr[0];
    return { title: r.title.trim(), summary: r.summary.trim(), conclusion: r.conclusion.trim(), publication_ids: r.ids,
             author: (form && form.author) || authorHint || '', language: (form && form.language) || QE_LANG };
  }
  function saveBlob(blob, name) {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function rrPdf() {
    if (st.rrBusy[0]) return;
    st.rrBusy[1]('pdf'); st.rrMsg[1](null);
    post(API + '/lab/reports/pdf', rrBody()).then(function (b) { saveBlob(b, 'QuantEdge_Research_Report.pdf'); st.rrMsg[1]({ ok: true, text: L('Draft PDF downloaded. Nothing was published.') }); })
      .catch(function (x) { st.rrMsg[1]({ ok: false, text: L(x.message || String(x)) }); })
      .then(function () { st.rrBusy[1](''); });
  }
  function rrPublish() {
    if (st.rrBusy[0]) return;
    st.rrBusy[1]('save'); st.rrMsg[1](null);
    post(API + '/lab/reports', rrBody()).then(function (d) {
      st.rr[1]({ ids: [], title: '', summary: '', conclusion: '' });
      st.rrMsg[1]({ ok: true, text: L('Report added to your site:') + ' r/' + d.slug + '.html' });
      return loadReports();
    }).catch(function (x) { st.rrMsg[1]({ ok: false, text: L(x.message || String(x)) }); })
      .then(function () { st.rrBusy[1](''); });
  }
  function reportPanel() {
    if (!items || items.length < QE_RR.minPubs) return null;
    var r = st.rr[0], check = qeRRCheck(r);
    var counter = function (text, min) { return e('span', { className: 'micro ' + (text.trim().length >= min ? 'muted' : 'lab-count-short') }, L('at least') + ' ' + min + ' ' + L('characters') + ' · ' + text.trim().length); };
    return e('section', { className: 'panel site-panel rr-panel', 'aria-labelledby': 'rr-title' },
      e('div', { className: 'eyebrow' }, L('ONE COMPANY, SEVERAL ANALYSES')),
      e('h2', { id: 'rr-title' }, L('Research report')),
      e('p', { className: 'micro muted' }, L('Combine 2–6 of your published analyses into one report with your own summary and conclusion: a multi-page PDF to attach to applications and a page on your site.')),
      e('fieldset', { className: 'rr-pick' },
        e('legend', { className: 'form-label' }, L('Analyses in the report') + ' · ' + r.ids.length + '/' + QE_RR.maxPubs),
        items.map(function (it) {
          var on = r.ids.indexOf(it.id) >= 0;
          return e('label', { key: it.id, className: 'rr-item' + (on ? ' is-on' : '') },
            e('input', { type: 'checkbox', checked: on, disabled: !on && r.ids.length >= QE_RR.maxPubs, onChange: function () { toggleRR(it.id); } }),
            e('span', null, on ? e('b', null, (r.ids.indexOf(it.id) + 1) + '. ') : null, it.title, ' · ', (it.subjects || []).join(', ')));
        })),
      e('label', { className: 'form-label' }, L('Report title'),
        e('input', { value: r.title, maxLength: 120, onChange: function (ev) { setRR('title', ev.target.value); }, placeholder: L('Example: Coca-Cola: steady cash, limited growth') })),
      e('label', { className: 'form-label' }, e('span', { className: 'label-row' }, e('span', null, L('Executive summary')), counter(r.summary, QE_RR.summary)),
        e('textarea', { className: 'social-input', maxLength: 3000, value: r.summary, onChange: function (ev) { setRR('summary', ev.target.value); },
          placeholder: L('Three or four sentences: the question, what the analyses show together, and your view.') })),
      e('label', { className: 'form-label' }, e('span', { className: 'label-row' }, e('span', null, L('Conclusion')), counter(r.conclusion, QE_RR.conclusion)),
        e('textarea', { className: 'social-input social-input-small', maxLength: 2000, value: r.conclusion, onChange: function (ev) { setRR('conclusion', ev.target.value); },
          placeholder: L('What you conclude, what would change your mind, and what to watch next.') })),
      !check.ok && e('p', { className: 'micro lab-locked' }, check.hints.map(L).join(' ')),
      e('div', { className: 'social-buttons' },
        e(Button, { icon: 'download', disabled: !check.ok, loading: st.rrBusy[0] === 'pdf', onClick: rrPdf }, L('Download PDF')),
        e(Button, { variant: 'primary', icon: 'globe', disabled: !check.ok, loading: st.rrBusy[0] === 'save', onClick: rrPublish }, L('Add report to my site'))),
      st.rrMsg[0] && e('p', { className: 'micro lab-site-status' + (st.rrMsg[0].ok ? ' is-ok' : ' is-error'), role: 'status' }, st.rrMsg[0].text),
      st.reports[0].length > 0 && e('div', { className: 'track-due' },
        e('strong', null, L('Published reports') + ' (' + st.reports[0].length + ')'),
        e('ul', null, st.reports[0].map(function (rep) {
          return e('li', { key: rep.id }, e('span', { className: 'track-due-title' }, rep.title),
            e('span', { className: 'micro muted' }, rep.publication_ids.length + ' ' + L('analyses') + ' · r/' + rep.slug + '.html'),
            e('a', { className: 'tiny-link', href: API + '/lab/reports/' + rep.id + '/pdf', download: 'QuantEdge_' + rep.slug + '.pdf' }, L('PDF')));
        }))));
  }

  function trackPanel() {
    if (items && !items.length) return null;
    var sum = track ? qeTrackSummary(track) : null, due = track ? qeTrackDueItems(track, items) : [];
    return e('section', { className: 'panel site-panel track-panel', 'aria-labelledby': 'track-title' },
      e('div', { className: 'eyebrow' }, L('MEASURED BY PRICES')),
      e('div', { className: 'track-head' },
        e('h2', { id: 'track-title' }, L('Track record')),
        sum && sum.updated && e('span', { className: 'micro muted' }, sum.updated)),
      track === null && !st.trackError[0] && e('p', { className: 'micro muted' }, L('Loading…')),
      st.trackError[0] && e(Notice, { type: 'amber' }, L('The track record could not be loaded.') + ' ' + st.trackError[0]),
      sum && sum.stats.length > 0 && e('dl', { className: 'track-stats' }, sum.stats.map(function (row, i) {
        return e('div', { key: i }, e('dt', null, row[0]), e('dd', null, row[1]));
      })),
      sum && sum.lines.map(function (line, i) { return e('p', { key: 'l' + i, className: 'micro track-line' }, line); }),
      sum && (sum.best || sum.worst) && e('p', { className: 'micro track-extremes' },
        sum.best && e('span', null, e('strong', null, L('Best') + ': '), sum.best),
        sum.worst && e('span', null, e('strong', null, L('Worst') + ': '), sum.worst)),
      sum && sum.state !== 'none' && e('p', { className: 'micro muted track-method' },
        L(QE_TRACK_METHOD).split('{band}').join(QE_TRACK_NEUTRAL_BAND),
        ' ', L('Your own “Was I right?” reviews are shown separately as “My own review”.')),
      due.length > 0 && e('div', { className: 'track-due' },
        e('strong', null, L('Due for review') + ' (' + due.length + ')'),
        e('p', { className: 'micro muted' }, L('The review date has passed and the prices are in. Now write what you learned: was your reasoning right, or only the result?')),
        e('ul', null, due.map(function (t) {
          return e('li', { key: t.id },
            e('span', { className: 'track-due-title' }, t.title || t.subject || ''),
            qeTrackChipView(e, t.performance, t.benchmark),
            t.review_due && e('span', { className: 'micro muted' }, L('Review date') + ': ' + qeDate(t.review_due)),
            e(Button, { icon: 'check', onClick: function () { openReview(t.id); } }, L('Was I right?')));
        }))),
      qeEarningsChecksView(e, track));
  }

  function reviewChip(rv) {
    return rv ? e('span', { className: 'verdict-chip ' + rv.verdict }, qeSiteVerdictLabel(rv.verdict))
      : e('span', { className: 'verdict-chip site-unreviewed' }, L('Not reviewed yet'));
  }

  function itemView(it) {
    var open = st.expanded[0] === it.id, detail = st.details[0][it.id], r = st.review[0];
    return e('li', { key: it.id, id: 'site-item-' + it.id, className: 'site-item' + (open ? ' is-open' : '') },
      e('div', { className: 'site-item-head' },
        e('div', { className: 'site-item-text' },
          e('strong', null, it.title),
          e('span', { className: 'micro muted' }, (it.subjects || []).join(', ') + ' · ' + qeDate(it.asof) + ' · ' + String(it.language || '').toUpperCase()),
          qeSiteCallChips(e, it.call_summary),
          trackRow(it),
          e('span', { className: 'site-item-review' }, e('span', { className: 'micro muted' }, L('My own review') + ': '), reviewChip(it.latest_review),
            it.review_count > 1 && e('span', { className: 'micro muted' }, ' ' + it.review_count + ' ' + L('reviews')))),
        e('div', { className: 'social-buttons site-item-actions' },
          e('a', { className: 'btn subtle', href: API + '/lab/site/preview/a/' + it.slug + '.html', target: '_blank', rel: 'noopener' }, e(Icon, { name: 'external', size: 16 }), ' ' + L('Preview')),
          e('a', { className: 'btn subtle', href: API + '/lab/publications/' + it.id + '/evidence.zip', title: L('Every data file this note was computed from, with SHA-256 hashes. Kept on this computer.') }, e(Icon, { name: 'download', size: 16 }), ' ' + L('Evidence bundle (ZIP)')),
          e(Button, { icon: 'check', 'aria-expanded': open, onClick: function () { toggle(it.id); } }, L('Was I right?')),
          e(Button, { icon: 'close', loading: st.deleting[0] === it.id, onClick: function () { remove(it); } },
            st.confirmDelete[0] === it.id ? L('Yes, remove it') : L('Remove from site')),
          st.confirmDelete[0] === it.id && e('button', { type: 'button', className: 'tiny-link', onClick: function () { st.confirmDelete[1](''); } }, L('Cancel')))),
      st.confirmDelete[0] === it.id && e('p', { className: 'micro site-warn', role: 'alert' }, L('Click again to remove this analysis from your site. Your reviews of it are deleted too.')),
      open && e('div', { className: 'site-review' },
        e('div', { className: 'eyebrow' }, L('WAS I RIGHT?')),
        e('p', { className: 'micro muted' }, L('Come back after new results and say whether your view held. Every review is added to the page, so visitors see how your thinking developed.')),
        qeTrackFacts(trackById[it.id]) && e('p', { className: 'micro track-facts' }, e('strong', null, L('Measured by prices') + ': '), qeTrackFacts(trackById[it.id])),
        detail && qeSiteCallDetail(e, detail.call),
        !detail ? e('p', { className: 'micro muted' }, L('Loading…')) :
          (detail.reviews || []).length ? e('ol', { className: 'site-timeline' }, detail.reviews.map(function (rv) {
            return e('li', { key: rv.id }, reviewChip(rv), e('span', { className: 'micro muted' }, ' ' + qeDate(rv.created_utc)), rv.note && e('p', null, rv.note));
          })) : e('p', { className: 'micro muted' }, L('Not reviewed yet')),
        e('div', { className: 'verdict-row', role: 'group', 'aria-label': L('Your verdict') }, QE_SITE_VERDICTS.map(function (v) {
          return e('button', { key: v[0], type: 'button', 'aria-pressed': r.verdict === v[0], className: 'verdict ' + v[0] + (r.verdict === v[0] ? ' is-selected' : ''),
            onClick: function () { st.review[1](Object.assign({}, r, { verdict: v[0] })); } }, L(v[1]));
        })),
        e('label', { className: 'form-label' }, L('What happened, and what did you learn? (optional)'),
          e('textarea', { className: 'social-input social-input-small', maxLength: QE_SITE_LIMITS.note, value: r.note, onChange: function (ev) { st.review[1](Object.assign({}, r, { note: ev.target.value })); } }),
          e('span', { className: 'micro muted' }, r.note.length + ' / ' + QE_SITE_LIMITS.note)),
        e('div', { className: 'social-buttons' },
          e(Button, { variant: 'primary', icon: 'save', disabled: !r.verdict, loading: st.reviewBusy[0], onClick: function () { saveReview(it.id); } }, L('Save my verdict'))),
        st.reviewError[0] && e(Notice, { type: 'amber' }, st.reviewError[0])));
  }

  var steps = [
    L('Create a free account at github.com.'),
    L('Create a new public repository, for example named analizler, and tick Add a README file.'),
    L('In the repository choose Add file → Upload files (on an empty repository: the uploading an existing file link).'),
    L('Unzip the downloaded file and drag ALL of its files and folders onto the page.'),
    L('Click Commit changes.'),
    L('Open Settings → Pages. Under Source choose Deploy from a branch, then main and / (root), and click Save.'),
    L('After about a minute your site is live at https://USERNAME.github.io/analizler/ (USERNAME is your GitHub user name).')
  ];

  return e('div', { className: 'site-layout' },
    e('div', { className: 'site-main' },
      trackPanel(),
      reportPanel(),
      e('section', { className: 'panel site-panel' },
        e('div', { className: 'eyebrow' }, L('ABOUT YOU')),
        e('h2', null, L('Site settings')),
        e('p', { className: 'micro muted' }, L('This is the top of your site. Keep it short and true: who you are and what you are curious about.')),
        !form ? e('p', { className: 'micro muted' }, L('Loading…')) : e('div', { className: 'site-form' },
          e('label', { className: 'form-label' }, L('Your name'),
            e('input', { value: form.author, maxLength: QE_SITE_LIMITS.author, onChange: function (ev) { setField('author', ev.target.value); }, placeholder: L('First and last name') })),
          e('label', { className: 'form-label' }, L('Headline'),
            e('input', { value: form.headline, maxLength: QE_SITE_LIMITS.headline, onChange: function (ev) { setField('headline', ev.target.value); }, placeholder: L('Example: High-school student interested in company analysis') })),
          e('label', { className: 'form-label site-wide' }, L('Short bio'),
            e('textarea', { className: 'social-input social-input-small', value: form.bio, maxLength: QE_SITE_LIMITS.bio, onChange: function (ev) { setField('bio', ev.target.value); }, placeholder: L('Example: I study how companies make money, using SEC filings and price history. These analyses are my own practice work.') }),
            e('span', { className: 'micro muted' }, form.bio.length + ' / ' + QE_SITE_LIMITS.bio)),
          e('label', { className: 'form-label' }, L('LinkedIn profile URL (optional)'),
            e('input', { type: 'url', value: form.linkedin_url, maxLength: QE_SITE_LIMITS.linkedin_url, spellCheck: false, onChange: function (ev) { setField('linkedin_url', ev.target.value); }, placeholder: 'https://www.linkedin.com/in/…' }),
            linkHint && e('span', { className: 'micro lab-count-short' }, linkHint)),
          e('label', { className: 'form-label' }, L('Your site address (after it is online)'),
            e('input', { type: 'url', value: form.site_url, maxLength: QE_SITE_LIMITS.site_url, spellCheck: false, onChange: function (ev) { setField('site_url', ev.target.value); }, placeholder: 'https://USERNAME.github.io/analizler/' }),
            e('span', { className: 'micro muted' }, L('Optional. With it, a shared link shows a preview image of the analysis on LinkedIn. Fill it in after step 7, then download the ZIP again.'))),
          e('label', { className: 'form-label' }, L('Site language'),
            e('select', { className: 'site-select', value: form.language, onChange: function (ev) { setField('language', ev.target.value); } },
              QE_SITE_LANGUAGES.map(function (l) { return e('option', { key: l[0], value: l[0] }, l[1]); })),
            e('span', { className: 'micro muted' }, L('Only the home page uses this; each analysis keeps the language it was published in.')),
            (st.items[0] || []).some(function (it) { return it.language && it.language !== form.language; }) &&
              e('span', { className: 'micro lab-count-short' }, L('Some analyses were published in another language, so your site will mix languages.'))),
          e('div', { className: 'social-buttons site-wide' },
            e(Button, { variant: 'primary', icon: 'save', disabled: !!linkHint, loading: st.saving[0], onClick: saveSettings }, L('Save')),
            dirty && e('span', { className: 'micro lab-count-short' }, L('Unsaved changes'))),
          st.settingsMsg[0] && e('p', { className: 'micro site-wide ' + (st.settingsMsg[0].ok ? 'site-ok' : 'site-error'), role: 'status' }, (st.settingsMsg[0].ok ? '✓ ' : '') + st.settingsMsg[0].text))),
      e('section', { className: 'panel site-panel' },
        e('div', { className: 'eyebrow' }, L('ON YOUR SITE')),
        e('h2', null, L('Your published analyses')),
        items && items.length > 0 && e('p', { className: 'micro muted' },
          items.length + ' ' + L(items.length === 1 ? 'analysis' : 'analyses') + ' · ' + Object.keys(companies).length + ' ' + L(Object.keys(companies).length === 1 ? 'company' : 'companies') + ' · ' + reviewed + ' ' + L('reviewed')),
        st.listError[0] && e(Notice, { type: 'amber' }, st.listError[0]),
        st.listMsg[0] && e('p', { className: 'micro', role: 'status' }, st.listMsg[0]),
        items === null ? e('p', { className: 'micro muted' }, L('Loading…')) :
          !items.length ? e(Blank, { title: L('No analyses on your site yet'), copy: L('In the Analysis Lab, run an analysis, write what you think and why you might be wrong, then press Add to my public site.') },
            e(Button, { variant: 'primary', icon: 'model', onClick: function () { props.setPage('Analysis Lab'); } }, L('Open the Analysis Lab'))) :
          e('ul', { className: 'site-items' }, items.map(itemView)))),
    e('aside', { className: 'panel site-panel site-publish' },
      e('div', { className: 'eyebrow' }, L('PUBLISH FOR FREE')),
      e('h2', null, L('Put it online')),
      e('p', { className: 'micro muted' }, L('Your site is a few plain files with no ads and no tracking. GitHub Pages hosts it for free at one link you can put on your CV and LinkedIn.')),
      e('div', { className: 'social-buttons' },
        e('a', { className: 'btn subtle', href: API + '/lab/site/preview/index.html', target: '_blank', rel: 'noopener' }, e(Icon, { name: 'external', size: 16 }), ' ' + L('Preview site')),
        e('a', { className: 'btn primary', href: API + '/lab/site.zip', download: 'QuantEdge_Public_Site.zip' }, e(Icon, { name: 'download', size: 16 }), ' ' + L('Download site (ZIP)'))),
      dirty && e('p', { className: 'micro lab-count-short' }, L('Save your settings first; the preview and the ZIP use the saved version.')),
      items && !items.length && e('p', { className: 'micro lab-count-short' }, L('Add at least one analysis before you publish.')),
      e('strong', { className: 'site-guide-title' }, L('GitHub Pages in 7 steps')),
      e('ol', { className: 'site-guide' }, steps.map(function (s, i) { return e('li', { key: i }, s); })),
      e('p', { className: 'micro muted' }, L('To update the site later: download the ZIP again and upload the files again; GitHub replaces the old ones.')),
      e('p', { className: 'micro muted' }, L('On LinkedIn: Profile → Add section → Featured → Add a link, or Contact info → Website.')),
      e('div', { className: 'claim-flags site-public-note' },
        e('strong', null, L('What becomes public')),
        e('p', null, L('Only the analyses listed on this page, with your view, counterargument and every Was I right? review and note, plus your name, headline, bio and LinkedIn link.')),
        e('p', null, L('QuantEdge itself, your report notes, library drafts and everything else stay on your computer.')),
        e('small', null, L('Your site and its GitHub repository are fully public and can appear in search results; files you delete later stay in the repository history. Educational analysis, not investment advice.')))));
}


/* Earnings checks (GET /lab/track-record → earnings_checks): for published #23 notes, the move options priced vs the actual move. */
function qeEarningsVerdict(c) {
  if (!c || c.status === 'unavailable') return L('Prices could not be read.');
  if (c.status !== 'done') return L('Results not out yet, or the reaction session has not closed.');
  return L({ bigger: 'Bigger than priced', smaller: 'Smaller than priced', in_line: 'About as priced (±20%)' }[c.verdict] || '');
}
function qeEarningsLines(track) {
  var list = (track && track.earnings_checks) || [];
  return list.map(function (c) {
    var priced = '±' + labFormat(c.priced_pct, 'pct').replace(/^[+−-]/, '');
    var parts = [(c.subject || c.title || '') + ' · ' + qeDate(c.earnings_date), L('Priced by options') + ' ' + priced];
    if (c.status === 'done') parts.push(L('Actual move') + ' ' + labFormat(c.actual_pct, 'pct'));
    parts.push(qeEarningsVerdict(c));
    return parts.join(' · ');
  });
}
function qeEarningsChecksView(e, track) {
  var lines = qeEarningsLines(track);
  if (!lines.length) return null;
  return e('div', { className: 'track-due' },
    e('strong', null, L('Earnings checks') + ' (' + lines.length + ')'),
    e('p', { className: 'micro muted' }, L('The size of the move is compared, not its direction.')),
    e('ul', null, lines.map(function (t, i) { return e('li', { key: i }, e('span', { className: 'track-due-title' }, t)); })));
}


/* Research report limits (research_reports.py) and the unlock check. */
var QE_RR = { minPubs: 2, maxPubs: 6, title: 10, summary: 120, conclusion: 80 };
function qeRRCheck(r) {
  var hints = [];
  if (r.ids.length < QE_RR.minPubs) hints.push('Choose at least 2 published analyses.');
  if (r.title.trim().length < QE_RR.title) hints.push('Give the report a title (at least 10 characters).');
  if (r.summary.trim().length < QE_RR.summary) hints.push('Write an executive summary of at least 120 characters.');
  if (r.conclusion.trim().length < QE_RR.conclusion) hints.push('Write a conclusion of at least 80 characters.');
  return { ok: !hints.length, hints: hints };
}

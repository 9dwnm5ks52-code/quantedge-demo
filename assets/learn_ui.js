/* QuantEdge — "Learn" page: what every analysis computes, from which data, and how to read it.
 *
 * Written for someone who does not yet know where to start with company analysis. Each card
 * describes what the Analysis Lab code actually computes (formulas, inputs, steps, limits),
 * with a made-up worked example. The content (three languages) lives in learn_kb.js and is
 * loaded the first time the page opens. Interface labels are English keys in ui_i18n.js.
 */
var QE_LEARN_SECTIONS = [['learn-path', 'Where to start'], ['learn-sources', 'Where the data comes from'], ['learn-analyses', 'Every analysis, explained'], ['learn-glossary', 'Dictionary A–Z']];

function qeLearnText(obj) {  // {en, tr, es} -> the interface language, English when missing
  if (!obj || typeof obj !== 'object') return obj || '';
  return obj[QE_LANG] || obj.en || '';
}

function qeLearnLoad(done) {
  if (window.QE_LEARN) { done(true); return; }
  var me = [].slice.call(document.scripts).filter(function (s) { return /learn_ui\.js/.test(s.src); })[0];
  var tag = document.createElement('script');
  tag.src = me ? me.src.replace(/learn_ui\.js(\?[^/]*)?$/, 'learn_kb.js' + (window.QE_LEARN_V ? '?v=' + window.QE_LEARN_V : '')) : 'assets/learn_kb.js';
  tag.onload = function () { done(!!window.QE_LEARN); };
  tag.onerror = function () { done(false); };
  document.head.appendChild(tag);
}

function qeLearnScroll(id) {
  setTimeout(function () { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
}

function LearnCard(props) {
  var e = React.createElement, c = props.card, t = c[QE_LANG] || c.en, seen = {};
  var lt = function (x) { return typeof qeLearnLinkTerms === 'function' ? qeLearnLinkTerms(x, seen) : x; };  // first mention of a known term gets its "?"
  var list = function (cls, items, ordered) {
    return e(ordered ? 'ol' : 'ul', { className: cls }, (items || []).map(function (x, i) { return e('li', { key: i }, lt(x)); }));
  };
  return e('details', { id: 'learn-' + c.id, className: 'learn-card g-' + c.group, open: props.open, onToggle: function (ev) { props.onToggle(c.id, ev.target.open); } },
    e('summary', null,
      e('span', { className: 'lab-icon', 'aria-hidden': 'true' }, typeof qeLabGlyph === 'function' ? qeLabGlyph(c.id) : null),
      e('span', { className: 'learn-card-head' },
        e('span', { className: 'lab-item-num' }, '#' + c.number + ' · ' + L(c.group_label)),
        e('strong', null, L(c.title), props.done && e('span', { className: 'learn-done-tag' }, '✓ ' + L('Learned'))),
        e('small', null, t.question))),
    e('div', { className: 'learn-card-body' },
      e('p', { className: 'learn-idea' }, lt(t.idea)),
      e('h4', null, L(t.formulas.length > 1 ? 'Formulas' : 'Formula')),
      t.formulas.map(function (f, i) {
        return e('div', { key: i, className: 'learn-formula' },
          e('div', { className: 'learn-formula-name' }, f.name),
          e('code', null, f.expr),
          f.where && f.where.length > 0 && e('dl', null, [].concat.apply([], f.where.map(function (w, j) {  // this React has no Fragment
            return [e('dt', { key: 't' + j }, w[0]), e('dd', { key: 'd' + j }, lt(w[1]))];
          }))));
      }),
      e('h4', null, L('Data it uses')),
      e('div', { className: 'learn-data' }, (t.data || []).map(function (d, i) {
        return e('div', { key: i, className: 'learn-data-row' }, e('strong', null, d[0]), e('span', null, lt(d[1])));
      })),
      e('h4', null, L('Step by step')),
      list('learn-steps', t.steps, true),
      e('div', { className: 'learn-example' }, e('h4', null, L('Worked example (made-up numbers)')), e('p', null, lt(t.example))),
      typeof QE_LEARN_CALC !== 'undefined' && QE_LEARN_CALC[c.id] && e(HookShell, { component: LearnCalc, id: c.id }),
      e('div', { className: 'learn-two' },
        e('div', null, e('h4', null, L('How to read it')), list('learn-read', t.read)),
        e('div', null, e('h4', null, L('Limits and common mistakes')), list('learn-limits', t.limits))),
      c.quiz && c.quiz.length > 0 && typeof LearnQuiz === 'function' && e(HookShell, { component: LearnQuiz, quiz: c.quiz }),
      e('div', { className: 'learn-card-foot' },
        (c.next || []).length > 0 && e('div', { className: 'learn-next' }, e('span', { className: 'micro muted' }, L('Study next')),
          c.next.map(function (id) {
            var n = props.byId[id];
            return n && e('button', { key: id, type: 'button', className: 'learn-chip g-' + n.group, onClick: function () { props.jump(id); } }, L(n.title));
          })),
        e('div', { className: 'learn-foot-actions' },
          e('button', { type: 'button', className: 'learn-done-btn' + (props.done ? ' is-done' : ''), 'aria-pressed': !!props.done, onClick: function () { props.toggleDone(c.id); } },
            props.done ? '✓ ' + L('Learned') : L('Mark as learned')),
          e(Button, { icon: 'model', onClick: function () { props.openLab(c); } }, L('Open in the Analysis Lab'))))));
}

/* Every glossary term, A–Z in the interface language, with a search box. */
function LearnGlossary() {
  var e = React.createElement, q = useState('');
  if (typeof qeGlossaryAll !== 'function') return null;
  var all = qeGlossaryAll();
  var loc = QE_LANG === 'en' ? 'en' : QE_LANG;
  var items = Object.keys(all).map(function (k) { var g = all[k]; return { k: k, t: g[QE_LANG] || g.en }; })
    .sort(function (a, b) { return a.t[0].localeCompare(b.t[0], loc, { sensitivity: 'base' }); });
  var s = q[0].trim().toLocaleLowerCase();
  var shown = s ? items.filter(function (x) { return (x.t[0] + ' ' + x.t[1]).toLocaleLowerCase().indexOf(s) >= 0; }) : items;
  var ex = L('Example');
  return e('section', { id: 'learn-glossary', className: 'panel learn-glossary' },
    e('h2', null, L('Dictionary A–Z')),
    e('p', { className: 'muted' }, L('Every term used in QuantEdge in one place. Terms are also explained where they appear: look for the small “?”.')),
    e('input', { type: 'search', className: 'learn-search', value: q[0], placeholder: L('Search a term, e.g. WACC or beta'), 'aria-label': L('Search the dictionary'),
      onChange: function (ev) { q[1](ev.target.value); } }),
    e('p', { className: 'micro muted' }, L('{n} terms').replace('{n}', shown.length)),
    shown.length === 0 ? e('p', { className: 'micro muted' }, L('No term matches this search.')) :
      e('dl', { className: 'learn-gloss-list' }, [].concat.apply([], shown.map(function (x) {
        return [e('dt', { key: 't' + x.k, id: 'term-' + x.k }, x.t[0]),
          e('dd', { key: 'd' + x.k }, x.t[1], x.t[2] ? e('em', null, ex + ': ' + x.t[2]) : null)];
      }))));
}

function LearnPage(props) {
  var e = React.createElement;
  var ready = useState(!!window.QE_LEARN), failed = useState(false), tab = useState('all'), query = useState(''), open = useState({});
  var done = useState(function () { return typeof qeLearnDoneRead === 'function' ? qeLearnDoneRead() : []; });
  function toggleDone(id) {
    var list = done[0].indexOf(id) >= 0 ? done[0].filter(function (x) { return x !== id; }) : done[0].concat([id]);
    done[1](list);
    if (typeof qeLearnDoneWrite === 'function') qeLearnDoneWrite(list);
  }
  var isDone = function (id) { return done[0].indexOf(id) >= 0; };
  useEffect(function () {
    if (ready[0]) return;
    qeLearnLoad(function (ok) { if (ok) ready[1](true); else failed[1](true); });
  }, []);
  if (failed[0]) return e('section', { className: 'panel' }, e(Notice, { type: 'amber' }, L('The explanations could not be loaded. Refresh the page to try again.')));
  if (!ready[0]) return e('section', { className: 'panel' }, e('p', { className: 'micro muted' }, L('Loading…')));
  var kb = window.QE_LEARN, byId = {};
  kb.cards.forEach(function (c) { byId[c.id] = c; });
  function setOpen(id, val) {
    if (!!open[0][id] === val) return;
    var next = Object.assign({}, open[0]); next[id] = val; open[1](next);
  }
  function jump(id) {
    var c = byId[id];
    if (!c) return;
    if (tab[0] !== 'all' && tab[0] !== c.group) tab[1]('all');
    query[1]('');
    setOpen(id, true);
    qeLearnScroll('learn-' + id);
  }
  function openLab(c) {
    window.QE_LAB_TAB = c.group; window.QE_LAB_PICK = c.id === 'options_lab' ? null : c.id;
    props.setPage(c.id === 'options_lab' ? 'Options' : 'Analysis Lab');
  }
  var q = query[0].trim().toLowerCase();
  var shown = kb.cards.filter(function (c) {
    if (tab[0] !== 'all' && c.group !== tab[0]) return false;
    if (!q) return true;
    var t = c[QE_LANG] || c.en;
    var hay = [L(c.title), c.title, t.question, t.idea].concat(t.formulas.map(function (f) { return f.name + ' ' + f.expr; })).join(' ').toLowerCase();
    return hay.indexOf(q) >= 0;
  });
  var groups = typeof QE_LAB_GROUPS !== 'undefined' ? QE_LAB_GROUPS : [];
  return e(Group, null,
    e('section', { className: 'panel learn-intro' },
      e('h2', null, L('Learn the analyses')),
      e('p', null, L('Every analysis in QuantEdge answers one question. Here you can see how: the formula, where each number comes from, the steps it follows, a worked example with made-up numbers, how to read the result and where it stops being reliable.')),
      e('div', { className: 'learn-jumps' }, QE_LEARN_SECTIONS.map(function (s) {
        return e('button', { key: s[0], type: 'button', className: 'tiny-link', onClick: function () { qeLearnScroll(s[0]); } }, L(s[1]) + ' ↓');
      }))),
    e('section', { id: 'learn-path', className: 'panel learn-path' },
      e('h2', null, L('Where to start')),
      e('p', { className: 'muted' }, qeLearnText(kb.path_intro)),
      (function () {
        var n = kb.cards.filter(function (c) { return isDone(c.id); }).length, pct = Math.round(n / kb.cards.length * 100);
        return e('div', { className: 'learn-progress' },
          e('div', { className: 'learn-progress-text' }, e('strong', null, L('Your progress')),
            e('span', null, L('{n} of {m} analyses learned').replace('{n}', n).replace('{m}', kb.cards.length))),
          e('div', { className: 'learn-progress-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': kb.cards.length, 'aria-valuenow': n, 'aria-label': L('Your progress') },
            e('span', { style: { width: pct + '%' } })),
          e('p', { className: 'micro muted' }, L('Saved in this browser only. Open a card and press “Mark as learned” when you are done.')));
      })(),
      e('ol', { className: 'learn-path-steps' }, kb.path.map(function (s, i) {
        var stepDone = s.ids.filter(isDone).length;
        return e('li', { key: i, className: stepDone === s.ids.length ? 'is-complete' : '' },
          e('div', { className: 'learn-step-head' }, e('strong', null, qeLearnText(s.title)), e('span', { className: 'learn-step-count' }, stepDone + '/' + s.ids.length)),
          e('p', null, qeLearnText(s.text)),
          e('div', { className: 'learn-next' }, s.ids.map(function (id) {
            var n = byId[id];
            return n && e('button', { key: id, type: 'button', className: 'learn-chip g-' + n.group + (isDone(id) ? ' is-done' : ''), onClick: function () { jump(id); } }, (isDone(id) ? '✓ ' : '') + L(n.title));
          })));
      }))),
    e('section', { id: 'learn-sources', className: 'panel learn-sources' },
      e('h2', null, L('Where the data comes from')),
      e('p', { className: 'muted' }, qeLearnText(kb.sources_intro)),
      e('div', { className: 'learn-source-grid' }, kb.sources.map(function (s, i) {
        return e('div', { key: i, className: 'learn-source' },
          e('strong', null, qeLearnText(s.name)),
          e('p', null, qeLearnText(s.what)),
          e('p', { className: 'micro' }, e('b', null, L('Used for') + ': '), qeLearnText(s.used)),
          e('p', { className: 'micro muted' }, e('b', null, L('Keep in mind') + ': '), qeLearnText(s.care)));
      }))),
    e('section', { id: 'learn-analyses', className: 'panel learn-analyses' },
      e('h2', null, L('Every analysis, explained')),
      e('div', { className: 'lab-menu-bar learn-bar' },
        e('div', { className: 'lab-tabs', role: 'group', 'aria-label': L('Groups') },
          [['all', 'All']].concat(groups).map(function (g) {
            var n = g[0] === 'all' ? kb.cards.length : kb.cards.filter(function (c) { return c.group === g[0]; }).length;
            return e('button', { key: g[0], type: 'button', className: 'lab-tab' + (g[0] === 'all' ? '' : ' g-' + g[0]), 'aria-pressed': tab[0] === g[0], onClick: function () { tab[1](g[0]); } },
              L(g[1]), e('span', { className: 'lab-group-count' }, n));
          })),
        e('input', { type: 'search', className: 'learn-search', value: query[0], placeholder: L('Search a term, e.g. WACC or beta'), 'aria-label': L('Search the explanations'),
          onChange: function (ev) { query[1](ev.target.value); } })),
      shown.length === 0 ? e('p', { className: 'micro muted' }, L('No analysis matches this search.')) :
        e('div', { className: 'learn-list' }, shown.map(function (c) {
          return e(LearnCard, { key: c.id, card: c, byId: byId, open: !!open[0][c.id] || (!!q && shown.length <= 3), onToggle: setOpen, jump: jump, openLab: openLab,
            done: isDone(c.id), toggleDone: toggleDone });
        }))),
    e(HookShell, { component: LearnGlossary }),
    e('p', { className: 'micro muted learn-foot' }, L('Educational explanations of how QuantEdge computes each figure. Not investment advice.')));
}

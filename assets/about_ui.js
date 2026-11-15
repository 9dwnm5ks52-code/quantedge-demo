/* QuantEdge — "About" page: what QuantEdge is, what it does and what it cannot do.
 *
 * Written for a 16-18 year old who opens the app for the first time. Every claim here
 * must stay true of the app: the limits below are the ones the Analysis Lab enforces.
 * English strings are the keys; Turkish and Spanish live in ui_i18n.js.
 */
var QE_ABOUT_LOOP = [
  ['Run an analysis', 'Pick one of 30 questions in the Analysis Lab and a company. QuantEdge downloads the official figures and draws the charts and tables.'],
  ['Write your view', 'Write your thesis (at least 80 characters) and the risks to it (at least 60) in your own words. Nothing can be published before both are written.'],
  ['Publish', 'Turn the note into LinkedIn text, a carousel PDF, a PNG image or a page on your own public site.'],
  ['Check back later', 'Months later, open "Was I right?", compare the new figures with what you wrote and give yourself an honest verdict.']
];

var QE_ABOUT_DIFFERENT = [
  ['file', 'Every number has a source', 'Each figure is labelled with where it came from and links to the SEC filing it was taken from. Readers can check you.'],
  ['spark', 'Your view comes first', 'QuantEdge calculates; you think. A note without your own thesis and risks cannot be published.'],
  ['shield', 'Honest about its limits', 'When a figure is missing or an analysis does not fit a company, it says so instead of guessing.'],
  ['info', 'Private by default', 'Your drafts and notes stay on your computer; only requests for public data (SEC filings, prices, interest rates and research datasets) go online.']
];

var QE_ABOUT_CAN = [
  'Any US company that files a 10-K annual report with the SEC: thousands of firms, from Apple and Microsoft to small companies.',
  '30 analyst questions: growth and margins, earnings quality, cash flow, valuation (reverse DCF, multiples, scenarios), risk (Altman Z, beta, Monte Carlo range of outcomes), market tests and a live options lab (Black–Scholes, Heston).',
  'Historical prices from Yahoo Finance, including Borsa İstanbul shares (.IS) for the Turkey lira-vs-dollar and price analyses.',
  'Your own inputs: assumptions you choose and, when needed, a price you type yourself.'
];

var QE_ABOUT_CANNOT = [
  'Foreign companies (20-F / 40-F) outside the Analysis Lab: the Guide, LinkedIn and Reports pages read 10-K reports only.',
  'Banks in the Altman Z and cash conversion cycle analyses: banks do not report the items these need.',
  'BIST companies outside the Turkey FX and price analyses: they do not file with the SEC.',
  'Delisted companies without price history: you type the price yourself.',
  'Trading or real-time quotes: it never places orders, and option quotes are about 15 minutes delayed (refreshed every minute with Live ticked in the Options tab).'
];

var QE_ABOUT_SOURCES = [
  ['SEC EDGAR (companyfacts)', 'The XBRL data inside 10-K annual reports, published free by the US Securities and Exchange Commission. Each figure links back to its filing.'],
  ['Yahoo Finance', 'Historical daily prices, adjusted for splits and dividends. Used for returns, beta, event studies and the Turkey analysis; in the Options tab also the stock price and option quotes (about 15 minutes delayed).'],
  ['Interest rates and research data', 'US Treasury and FRED rates for the risk-free rate, Stooq prices to cross-check Yahoo, Damodaran and Kenneth French datasets for industry and factor figures, and TCMB EVDS (with your own key) for Turkey. Each is downloaded only by the analyses that need it.'],
  ['You', 'Your thesis, your risks, your assumptions and any price you type. These are always labelled as yours, never as official data.']
];

/* "How I built it" (v0.13.5): what runs where, how the numbers are checked, how the work was done. Every number here
   comes from a test in tests/ (named next to it), so the page cannot claim more than the code shows. */
var QE_ABOUT_CHECKS = [
  ['Black–Scholes against the textbook', 'Hull’s worked example (S = 42, K = 40, r = 10%, σ = 20%, six months) gives a call of $4.76 and a put of $0.81; QuantEdge gives $4.7594 and $0.8086.'],
  ['The browser and the server agree', 'The calculator in the browser is tested against the Python engine on 216 cases: the same prices and Greeks to nine significant digits.'],
  ['The VIX formula on a known answer', 'On a Heston model, whose expected variance has a closed form, my implementation of the Cboe VIX formula lands within 0.05 volatility points of it.'],
  ['Heston against one volatility', 'The stochastic-volatility fit explains the market’s smile several times better than a single Black–Scholes volatility; the model report card shows the ratio for every fit.'],
  ['The exchange calendar', 'The market badge and the server agree on holidays and 13:00 early closes on every weekday from 2018 to 2040.'],
  ['More than 800 automated tests', 'They run offline on Python 3.9 and 3.13 on every change (GitHub Actions), with recorded data instead of the internet.']
];
var QE_ABOUT_LEARNED = ['Put–call parity and forward prices', 'Implied volatility and the smile', 'Why one Black–Scholes volatility is not enough, and what stochastic volatility adds',
  'How the Cboe computes the VIX', 'American options and early exercise', 'Testing, code review and honest limits', 'Web security basics: other sites’ requests and DNS rebinding'];
var QE_ABOUT_STACK = ['Python', 'FastAPI', 'NumPy · pandas', 'React 16 (no build step)', 'SQLite', 'pytest', 'GitHub Actions'];

function qeAboutDiagram(e) {
  var box = function (x, y, w, h, title, lines, accent) {
    return e('g', { key: title },
      e('rect', { x: x, y: y, width: w, height: h, rx: 10, className: 'about-arch-box' + (accent ? ' is-accent' : '') }),
      e('text', { x: x + 14, y: y + 26, className: 'about-arch-title' }, title),
      lines.map(function (t, i) { return e('text', { key: i, x: x + 14, y: y + 48 + i * 18, className: 'about-arch-line' }, t); }));
  };
  var arrow = function (x1, y1, x2, y2, label, lx, ly) {
    return e('g', { key: label },
      e('line', { x1: x1, y1: y1, x2: x2, y2: y2, className: 'about-arch-arrow', markerEnd: 'url(#qe-arch-head)', markerStart: 'url(#qe-arch-head)' }),
      e('text', { x: lx, y: ly, className: 'about-arch-label', textAnchor: 'middle' }, label));
  };
  var desc = L('The browser page talks only to a local API on this computer; the API keeps notes, keys and caches in data/ and downloads public data when you ask.');
  return e('svg', { className: 'about-arch', viewBox: '0 0 760 280', role: 'img', 'aria-label': desc },
    e('defs', null,
      e('marker', { id: 'qe-arch-head', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, e('path', { d: 'M0 0 L10 5 L0 10 z', className: 'about-arch-tip' })),
      ),
    box(16, 40, 210, 104, L('Your browser'), ['React 16, ' + L('no build step'), L('Turkish, English, Spanish'), L('help assistant, offline')], false),
    box(276, 40, 210, 104, L('Local API'), ['Python · FastAPI', L('127.0.0.1 only'), L('pricing, analyses, notes')], true),
    box(536, 22, 208, 140, L('Public data'), ['SEC EDGAR', 'Yahoo Finance', L('US Treasury · FRED'), 'Damodaran · K. French', 'TCMB EVDS'], false),
    box(276, 190, 210, 84, L('This computer: data/'), [L('notes and library'), L('keys and caches')], false),
    arrow(230, 92, 272, 92, 'JSON', 251, 82),
    arrow(490, 92, 532, 92, L('on request'), 511, 82),
    arrow(381, 148, 381, 186, '', 0, 0),
    e('text', { x: 392, y: 172, className: 'about-arch-label' }, 'SQLite'));
}

function qeAboutBuilt(e, section) {
  return section('built', 'How I built it', 'A look behind the screens: what runs where, how the numbers are checked, and how I worked with an AI assistant.',
    e('div', { className: 'about-built' },
      e('figure', { className: 'about-built-arch' }, qeAboutDiagram(e),
        e('figcaption', { className: 'micro muted' }, L('The browser page talks only to a local API on this computer; the API keeps notes, keys and caches in data/ and downloads public data when you ask.'))),
      e('div', { className: 'about-built-cols' },
        e('div', null,
          e('h3', null, L('Checked, not assumed')),
          e('ul', { className: 'about-checks' }, QE_ABOUT_CHECKS.map(function (c) {
            return e('li', { key: c[0] }, e('span', { className: 'about-check-mark', 'aria-hidden': 'true' }, '✓'), e('div', null, e('strong', null, L(c[0])), e('p', null, L(c[1]))));
          }))),
        e('div', null,
          e('h3', null, L('How I worked with AI')),
          e('p', null, L('I built QuantEdge together with an AI coding assistant (Claude). I decided what to build and how it should look and behave, tried the versions on my own computer and asked for changes; the assistant wrote most of the code.')),
          e('p', null, L('Nothing shipped on trust: every change had to pass the automated tests, and independent AI reviewers tried to break each feature. The problems they found were fixed and kept as tests.')),
          e('h3', null, L('Topics I worked through')),
          e('ul', { className: 'about-list' }, QE_ABOUT_LEARNED.map(function (t) { return e('li', { key: t }, L(t)); })),
          e('h3', null, L('Safe by design')),
          e('ul', { className: 'about-list' },
            e('li', null, L('The local API answers only this page and scripts on this computer: requests from other web sites and from other host names are refused.')),
            e('li', null, L('No account and no cloud: notes, keys and downloaded data stay in data/, which git ignores.'))),
          e('h3', null, L('Built with')),
          e('ul', { className: 'about-stack' }, QE_ABOUT_STACK.map(function (t) { return e('li', { key: t }, L(t)); }))))));
}

function AboutPage(props) {
  var e = React.createElement;
  var go = function (page) { if (props && typeof props.setPage === 'function') props.setPage(page); };
  var section = function (id, title, lede, body) {
    return e('section', { className: 'about-section', 'aria-labelledby': 'about-' + id },
      e('div', { className: 'about-section-head' },
        e('h2', { id: 'about-' + id }, L(title)),
        lede && e('p', null, L(lede))),
      body);
  };
  return e('div', { className: 'about-page' },
    e('section', { className: 'about-intro', 'aria-labelledby': 'about-what' },
      e('div', { className: 'about-intro-text' },
        e('h2', { id: 'about-what' }, L('What is QuantEdge?')),
        e('p', { className: 'about-lede' }, L('QuantEdge is a research desk that runs on your own computer. It turns official SEC filings and price history into source-based analyses that you write and publish under your own name.')),
        e('p', null, L('Think of it as a lab notebook for companies: the app does the downloading and the arithmetic, shows where every number came from, and leaves the thinking to you.'))),
      e('dl', { className: 'about-facts' },
        [['30', 'analyst questions'], ['10-K', 'official SEC data'], ['4', 'ways to publish'], ['0', 'accounts or API keys']].map(function (f) {
          return e('div', { key: f[1] }, e('dt', null, f[0]), e('dd', null, L(f[1])));
        }))),
    section('loop', 'How it works', 'One analysis at a time, in four steps.',
      e('ol', { className: 'about-loop' }, QE_ABOUT_LOOP.map(function (s, i) {
        return e('li', { key: s[0] },
          e('span', { className: 'about-step-num', 'aria-hidden': 'true' }, i + 1),
          e('div', null, e('strong', null, L(s[0])), e('p', null, L(s[1]))));
      }))),
    section('different', 'What makes it different', null,
      e('ul', { className: 'about-cards' }, QE_ABOUT_DIFFERENT.map(function (c) {
        return e('li', { key: c[1] },
          e('span', { className: 'about-card-icon', 'aria-hidden': 'true' }, e(Icon, { name: c[0], size: 18 })),
          e('strong', null, L(c[1])), e('p', null, L(c[2])));
      }))),
    section('scope', 'What it can and cannot analyse', 'Knowing the limits is part of good research. QuantEdge tells you when one applies.',
      e('div', { className: 'about-scope' },
        e('div', { className: 'about-scope-col is-can' },
          e('h3', null, e(Icon, { name: 'check', size: 16 }), ' ', L('It can analyse')),
          e('ul', null, QE_ABOUT_CAN.map(function (t) { return e('li', { key: t }, L(t)); }))),
        e('div', { className: 'about-scope-col is-cannot' },
          e('h3', null, e(Icon, { name: 'close', size: 16 }), ' ', L('It cannot (yet)')),
          e('ul', null, QE_ABOUT_CANNOT.map(function (t) { return e('li', { key: t }, L(t)); }))))),
    section('sources', 'Where the data comes from', null,
      e('dl', { className: 'about-sources' }, QE_ABOUT_SOURCES.map(function (s) {
        return e('div', { key: s[0] }, e('dt', null, L(s[0])), e('dd', null, L(s[1])));
      }))),
    qeAboutBuilt(e, section),
    e('div', { className: 'about-pair' },
      section('privacy', 'Your privacy', null,
        e('ul', { className: 'about-list' },
          e('li', null, L('QuantEdge runs on this computer. Your drafts, notes and library are saved here, not in a cloud account.')),
          e('li', null, L('The app goes online only to download public data (SEC figures, prices, interest rates, research datasets): when you run an analysis or load data, and when you open the Options tab, which loads a ticker (AAPL unless you type another).')),
          e('li', null, L('The SEC asks automated requests for a contact email. It is sent to the SEC with the request and is not stored in the app.')),
          e('li', null, L('The help assistant works offline too: it answers from a built-in guide, with no AI service and no internet.')),
          e('li', null, L('Only what you publish yourself becomes public: a post you paste, a file you download, the site you upload.')))),
      section('advice', 'Not investment advice', null,
        e('div', { className: 'about-warning' },
          e('p', null, L('QuantEdge is for learning and for showing your research. It never tells you to buy or sell anything, and past figures do not predict future returns.')),
          e('p', null, L('Every output says so, and so should you when you share it.'))))),
    section('who', 'Who it is for', null,
      e('p', { className: 'about-who' }, L('High-school and university students who want to understand how companies work and show it: on a CV, in a university application, in a club or on LinkedIn. You do not need a finance background; the Guide and the "What does this mean?" notes explain each term.'))),
    e('nav', { className: 'about-next', 'aria-label': L('Where to start') },
      e('div', null,
        e('h2', null, L('Where to start')),
        e('p', null, L('Run your first analysis, follow the Guide if the terms are new, or see how your public site will look.'))),
      e('div', { className: 'about-next-actions' },
        e(Button, { variant: 'primary', icon: 'model', onClick: function () { go('Analysis Lab'); } }, L('Open the Analysis Lab')),
        e(Button, { icon: 'spark', onClick: function () { go('Guide'); } }, L('Open the Guide')),
        e(Button, { icon: 'globe', onClick: function () { go('Public Site'); } }, L('Open my public site')))));
}

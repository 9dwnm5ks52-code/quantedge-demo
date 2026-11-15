// @ts-nocheck
/* QuantEdge - write and publish source-based analyses; genuine React UI. All company facts come from source-labelled API responses. */
// The offline vendor is React 16.0 (the only installed React copy in this
// environment). Its UMD runtime predates native hooks. HookShell provides
// isolated component-local state/effect/memo slots on top of React.Component.
// This compatibility layer avoids CDN dependencies and is not a full Hooks polyfill.
let CURRENT_HOOK_SHELL = null;
class HookShell extends React.Component {
    constructor(props) { super(props); this.slots = []; this.cursor = 0; this.effects = []; }
    render() {
        const before = CURRENT_HOOK_SHELL;
        CURRENT_HOOK_SHELL = this;
        this.cursor = 0;
        this.effects = [];
        try {
            return this.props.component(this.props);
        }
        finally {
            CURRENT_HOOK_SHELL = before;
        }
    }
    componentDidMount() { this.flush(); }
    componentDidUpdate() { this.flush(); }
    componentWillUnmount() { this.unmounted = true; } // late responses must not re-render a page that was left
    flush() { const pending = this.effects.slice(); this.effects = []; pending.forEach(fn => fn()); }
}
function useState(initial) {
    const host = CURRENT_HOOK_SHELL;
    if (!host)
        throw Error('useState must be in HookShell');
    const n = host.cursor++;
    if (!(n in host.slots))
        host.slots[n] = typeof initial === 'function' ? initial() : initial;
    return [host.slots[n], function (update) {
            const value = typeof update === 'function' ? update(host.slots[n]) : update;
            if (value !== host.slots[n]) {
                host.slots[n] = value;
                if (!host.unmounted)
                    host.forceUpdate();
            }
        }];
}
function sameDeps(a, b) { return a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i])); }
function useMemo(make, deps) {
    const host = CURRENT_HOOK_SHELL;
    const n = host.cursor++;
    if (!(n in host.slots) || !sameDeps(host.slots[n].deps, deps))
        host.slots[n] = { value: make(), deps: deps && deps.slice() };
    return host.slots[n].value;
}
function useEffect(effect, deps) {
    const host = CURRENT_HOOK_SHELL;
    const n = host.cursor++;
    if (!(n in host.slots) || !sameDeps(host.slots[n], deps)) {
        host.slots[n] = deps && deps.slice();
        host.effects.push(effect);
    }
}
const API = '/api/v2';
/* Theme: the saved choice, else the system setting. Applied before the first render so the page does not flash. */
function qeThemeInitial() {
    try { const t = localStorage.getItem('qe.theme'); if (t === 'light' || t === 'dark') return t; } catch (e) { }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function qeApplyTheme(t) {
    document.documentElement.dataset.theme = t;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f6f4ef' : '#0b1219');
}
qeApplyTheme(qeThemeInitial());
function ThemeSwitch() {
    const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'dark');
    const next = theme === 'light' ? 'dark' : 'light';
    const toggle = () => { qeApplyTheme(next); try { localStorage.setItem('qe.theme', next); } catch (e) { } setTheme(next); window.dispatchEvent(new Event('qe-theme')); };
    const e = React.createElement;
    const icon = theme === 'light'
        ? e('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, e('path', { d: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z' }))
        : e('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, e('circle', { cx: 12, cy: 12, r: 4 }), e('path', { d: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' }));
    const label = L(next === 'light' ? 'Light theme' : 'Dark theme');
    return e('button', { type: 'button', className: 'theme-switch', onClick: toggle, title: label, 'aria-label': label }, icon);
}
const TODAY = new Date().toISOString().slice(0, 10);
async function request(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
    if (!response.ok) {
        let message = `Request failed (${response.status})`;
        try {
            const payload = await response.json();
            message = typeof payload.detail === 'string' ? payload.detail : Array.isArray(payload.detail) ? payload.detail.map(x => x.loc?.slice(-1).join('') + ': ' + x.msg).join(' · ') : message;
        }
        catch (e) { }
        throw new Error(message);
    }
    if ((response.headers.get('content-type') || '').includes('application/json'))
        return response.json();
    return response.blob();
}
const post = (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) });
// v0.13.5: numbers follow the interface language (TR 215,94 milyar $ · %60,4 / ES 215,94 mil M$ · 60,4 % / EN $215.94B · 60.4%).
const QE_NUMBER_LOCALE = { tr: 'tr-TR', es: 'es-ES', en: 'en-US' };
const fmt = (value, digits = 1) => value === null || value === undefined || !Number.isFinite(Number(value)) ? '—' : Number(value).toLocaleString(QE_NUMBER_LOCALE[QE_LANG] || 'en-US', { maximumFractionDigits: digits });
const money = (value) => value === null || value === undefined || !Number.isFinite(Number(value)) ? '—' : (QE_LANG === 'en' ? '$' + fmt(value, 2) : fmt(value, 2) + ' $');
const billion = (value) => {
    if (value === null || value === undefined || !Number.isFinite(Number(value)))
        return '—';
    const amount = fmt(Number(value) / 1000, 2);
    return QE_LANG === 'tr' ? amount + ' milyar $' : QE_LANG === 'es' ? amount + ' mil M$' : '$' + amount + 'B';
};
const percent = (value, digits = 1) => {
    if (value === null || value === undefined || !Number.isFinite(Number(value)))
        return '—';
    const amount = fmt(value, digits);
    return QE_LANG === 'tr' ? (amount.startsWith('-') ? '-%' + amount.slice(1) : '%' + amount) : QE_LANG === 'es' ? amount + ' %' : amount + '%';
};
function Group({ children }) { return children; }
function Icon({ name, size = 18, ...props }) {
    const d = { search: React.createElement(Group, null,
            React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
            React.createElement("path", { d: "m16 16 5 5" })), chevron: React.createElement("path", { d: "m8 10 4 4 4-4" }), arrow: React.createElement(Group, null,
            React.createElement("path", { d: "M5 12h14M13 6l6 6-6 6" })), chart: React.createElement(Group, null,
            React.createElement("path", { d: "M3 3v18h18" }),
            React.createElement("path", { d: "m6 16 5-6 4 3 5-8" })), company: React.createElement(Group, null,
            React.createElement("path", { d: "M4 21V5l8-3 8 3v16" }),
            React.createElement("path", { d: "M9 21v-6h6v6M8 8h1M15 8h1M8 12h1M15 12h1" })), file: React.createElement(Group, null,
            React.createElement("path", { d: "M6 2h8l5 5v15H6z" }),
            React.createElement("path", { d: "M14 2v5h5M9 13h7M9 17h7" })), model: React.createElement(Group, null,
            React.createElement("path", { d: "M3 19V6h18v13zM3 10h18M8 10v9M14 10v9" })), library: React.createElement(Group, null,
            React.createElement("path", { d: "M3 20V4h5v16zM10 20V6h5v14zM17 20V3h4v17z" })), spark: React.createElement(Group, null,
            React.createElement("path", { d: "m12 2 2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1z" })), download: React.createElement(Group, null,
            React.createElement("path", { d: "M12 3v12m-5-5 5 5 5-5M4 18v3h16v-3" })), save: React.createElement(Group, null,
            React.createElement("path", { d: "M4 3h14l3 3v15H4zM8 3v7h9V3M8 21v-7h9v7" })), refresh: React.createElement(Group, null,
            React.createElement("path", { d: "M20 6v5h-5M4 18v-5h5" }),
            React.createElement("path", { d: "M6.5 8a7 7 0 0 1 12-1.8L20 11M4 13l1.5 4A7 7 0 0 0 18 16" })), check: React.createElement("path", { d: "m4 12 5 5L20 6" }), shield: React.createElement(Group, null,
            React.createElement("path", { d: "m12 2 9 4v6c0 6-4.5 9.2-9 10-4.5-.8-9-4-9-10V6z" }),
            React.createElement("path", { d: "m8 12 3 3 5-5" })), clock: React.createElement(Group, null,
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
            React.createElement("path", { d: "M12 7v5l3 2" })), info: React.createElement(Group, null,
            React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
            React.createElement("path", { d: "M12 10v7M12 7h.01" })), close: React.createElement("path", { d: "m5 5 14 14M19 5 5 19" }), globe: React.createElement(Group, null,
            React.createElement("circle", { cx: 12, cy: 12, r: 9 }),
            React.createElement("path", { d: "M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" })), external: React.createElement(Group, null,
            React.createElement("path", { d: "M10 5H5v14h14v-5M14 4h6v6M20 4l-9 9" })), layout: React.createElement(Group, null,
            React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
            React.createElement("path", { d: "M3 10h18M12 10v11" })), menu: React.createElement("path", { d: "M3 6h18M3 12h18M3 18h18" }), expand: React.createElement(Group, null,
            React.createElement("path", { d: "M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" })), sliders: React.createElement(Group, null,
            React.createElement("path", { d: "M4 7h16M4 17h16" }),
            React.createElement("circle", { cx: "9", cy: "7", r: "3", fill: "#081626" }),
            React.createElement("circle", { cx: "16", cy: "17", r: "3", fill: "#081626" })) };
    return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...props }, d[name] || d.info);
}
function Logo() { return React.createElement("div", { className: "logo" },
    React.createElement("span", { className: "logomark" },
        React.createElement("i", null),
        React.createElement("i", null),
        React.createElement("i", null),
        React.createElement("i", null)),
    React.createElement("span", null,
        "Quant",
        React.createElement("strong", null, "Edge"))); }
function Chip({ children, mode = 'neutral' }) { return React.createElement("span", { className: 'chip ' + mode }, children); }
function Button({ children, variant = 'subtle', icon, loading = false, onClick, disabled = false, ...props }) { return React.createElement("button", { className: 'btn ' + variant, onClick: onClick, disabled: disabled || loading, ...props },
    icon && React.createElement(Icon, { name: icon, size: 16 }),
    React.createElement("span", null, loading ? L('Working...') : children)); }
function Blank({ title, copy, children }) { return React.createElement("div", { className: "blank" },
    React.createElement("div", { className: "blank-icon" },
        React.createElement(Icon, { name: "info", size: 20 })),
    React.createElement("strong", null, title),
    React.createElement("p", null, copy),
    children); }
function Notice({ type = 'normal', children }) { return React.createElement("div", { className: 'notice ' + type },
    React.createElement(Icon, { name: type === 'danger' ? 'info' : type === 'success' ? 'check' : 'info', size: 16 }),
    React.createElement("div", null, children)); }
// Pure helpers are reused by the UI and regression tests. Switching a company
// must invalidate old, in-flight requests before their data reaches the screen.
function validTicker(raw) { return /^[A-Z][A-Z0-9.\-]{0,11}$/.test(String(raw || '').trim().toUpperCase()); }
// QuantEdge is a writing and publishing desk; the Analysis Lab is the main tool.
const QE_NAV = [['Home', 'layout'], ['Analysis Lab', 'model'], ['Options', 'chart'], ['Public Site', 'globe'], ['LinkedIn', 'file'], ['Reports', 'file'], ['Library', 'library'], ['Guide', 'spark'], ['About', 'info']];
/* One header band per page: which page this is, what it is for and, where useful, the next step.
   Home keeps its own headline in the hero, so its band carries no h1. */
const QE_PAGE_BAND = {
    Home: { purpose: 'Your desk: what you have published, and where to start the next analysis.', next: 'New here? Read what QuantEdge does, and what it cannot do.', action: ['About', 'What is QuantEdge?'] },
    'Analysis Lab': { title: 'Run an analysis on official data', purpose: 'Analyst tools built on SEC filings and historical prices. Each answers one question and shows its sources.', next: 'Choose a question and a company and run it, then write your thesis and risks: publishing unlocks once both are written.' },
    Options: { title: 'Live options lab', purpose: 'Price a US stock’s listed options with Black–Scholes and the Heston stochastic-volatility model, refreshed live (option quotes are delayed about 15 minutes).', next: 'Type a ticker such as AAPL or SPY and press Enter; tick Live to refresh every minute. When you are ready, write a research note from the snapshot.', action: ['Analysis Lab', 'See all 30 analyses'] },
    'Public Site': { title: 'My public site', purpose: 'Publish chosen analyses as a free website you can link from your CV and LinkedIn.', next: 'Add analyses from the Analysis Lab, preview the site, then download it and upload it to GitHub Pages for free.', action: ['Analysis Lab', 'Open the Analysis Lab'] },
    LinkedIn: { title: 'LinkedIn research posts', purpose: 'Turn your own thesis and official figures into plain text you can paste directly.', next: 'Select a company and load its SEC data first. The post is built on your own thesis, so write that too.' },
    Reports: { title: 'Research publisher', purpose: 'Write research you can stand behind. Export polished, unpublished drafts.', next: 'Write in the Thesis tab, add your sources under Evidence, check the Review tab, then export a PDF or HTML draft.' },
    Library: { title: 'Research library', purpose: 'Every research milestone, saved locally and easy to revisit.', next: 'Open a saved report to read it again, or compare today’s figures with what you wrote.' },
    Guide: { title: 'From curiosity to credible research', purpose: 'One small step at a time. Build a real, source-based research project you can explain and defend.', next: 'Follow the five steps in order; the checklist shows what is still missing before you write the report.' },
    About: { title: 'About QuantEdge', purpose: 'What QuantEdge is, how it works, what it can and cannot analyse, and where your data goes.', next: 'Ready? Start with one analysis in the Lab.', action: ['Analysis Lab', 'Open the Analysis Lab'] }
};
function PageBand({ page, setPage }) {
    const e = React.createElement;
    const meta = QE_PAGE_BAND[page] || { purpose: '' };
    const nav = QE_NAV.find(n => n[0] === page);
    return e('header', { className: 'pagehead pageband' + (meta.title ? '' : ' is-home'), 'aria-label': L('This page') + ': ' + L(page) },
        e('div', { className: 'pageband-text' },
            e('p', { className: 'pageband-where' },
                e(Icon, { name: nav ? nav[1] : 'info', size: 14 }),
                e('span', null, L('This page')),
                e('strong', page === 'LinkedIn' ? { lang: 'en' } : null, L(page))),
            meta.title && e('h1', null, L(meta.title)),
            e('p', { className: 'pageband-purpose' }, L(meta.purpose))),
        meta.next && e('div', { className: 'pageband-next' },
            e('span', { className: 'pageband-next-label' }, L('Next step')),
            e('p', null, L(meta.next)),
            meta.action && e('button', { type: 'button', className: 'tiny-link', onClick: () => setPage(meta.action[0]) }, L(meta.action[1]), e(Icon, { name: 'arrow', size: 14 }))));
}
function makeCommandIndex(ticker) {
    const pages = [['Analysis Lab', 'Open Analysis Lab', 'model'], ['Options', 'Open the live options lab', 'chart'], ['Public Site', 'Open my public site', 'globe'], ['LinkedIn', 'Write a LinkedIn post', 'file'], ['Reports', 'Open Research Publisher', 'file'], ['Library', 'Open Research Library', 'library'], ['Guide', 'Open guided research journey', 'spark'], ['About', 'What is QuantEdge?', 'info']];
    const tools = [['company', 'Load SEC fundamentals', 'company'], ['save', 'Save research draft', 'save']];
    const tickers = ['NVDA', 'AMD', 'AAPL', 'MSFT', 'INTC', 'AVGO'].map(x => ['ticker:' + x, 'Switch to ' + x, 'search']);
    // keywords: the tab's own (translated) name and the English page name, so 'opsiyonlar' or 'options' finds the tab
    return [...pages.map(([id, title, icon]) => ({ id: 'page:' + id, title: L(title), icon, kind: L('Navigate'), keywords: L(id) + ' ' + id })), ...tools.map(([id, title, icon]) => ({ id: 'tool:' + id, title: L(title), icon, kind: L('Action'), keywords: id })), ...tickers.map(([id, title, icon]) => ({ id, title: L('Switch to') + ' ' + id.slice(7), icon, kind: L('Company') }))];
}
function CommandPalette({ query, setQuery, close, commands, onExecute }) {
    // Turkish-aware folding (help_bot.js): 'OPSİYONLAR', 'HAKKIMIZDA' and 'kutuphane' find their tabs too
    const fold = typeof qeHelpFold === 'function' ? qeHelpFold : (s => String(s).trim().toLowerCase());
    const q = fold(query);
    const visible = commands.filter(x => fold(x.title + ' ' + x.kind + ' ' + (x.keywords || '')).includes(q)).slice(0, query.trim() ? 9 : 10);
    return React.createElement("div", { className: "command-shade", onMouseDown: e => { if (e.target === e.currentTarget)
            close(); } },
        React.createElement("div", { className: "command-dialog", role: "dialog", "aria-modal": "true", "aria-label": L("Quick actions") },
            React.createElement("div", { className: "command-search" },
                React.createElement(Icon, { name: "search", size: 22 }),
                React.createElement("input", { id: "qe-command-search", autoFocus: true, "aria-label": L("Find a company or action"), value: query, placeholder: L("Search pages, companies, actions..."), onChange: e => setQuery(e.target.value), onKeyDown: e => { if (e.key === 'Enter' && visible.length)
                        onExecute(visible[0]); if (e.key === 'Escape')
                        close(); } }),
                React.createElement("kbd", null, "ESC")),
            React.createElement("div", { className: "command-results" }, visible.length ? visible.map(x => React.createElement("button", { key: x.id, onClick: () => onExecute(x), className: "command-result" },
                React.createElement("span", { className: "command-result-icon" },
                    React.createElement(Icon, { name: x.icon })),
                React.createElement("strong", null, x.title),
                React.createElement("span", { className: "command-kind" }, x.kind),
                React.createElement(Icon, { name: "arrow", size: 15 }))) : React.createElement("div", { className: "command-empty" }, L("No matching action. Try \u201Clab\u201D, \u201Csave\u201D or \u201CNVDA\u201D."))),
            React.createElement("div", { className: "command-hint" },
                React.createElement("span", null, L("\u21B5 Run first action")),
                React.createElement("span", null, L("\u2318K / Ctrl+K to open from anywhere")))));
}
// This is a completion checklist, never a claim that a reference or a thesis was fact-checked.
function reportChecks(report, financial) {
    const citations = Array.isArray(report.evidence) ? report.evidence : [];
    return [
        ['Report title', String(report.title || '').trim().length >= 12],
        ['Author', String(report.author || '').trim().length >= 2],
        ['Testable thesis', String(report.thesis || '').trim().length >= 60],
        ['Counterarguments', String(report.risks || '').trim().length >= 50],
        ['Catalysts / monitoring', String(report.catalysts || '').trim().length >= 25],
        ['Analyst-entered reference', citations.some(x => x.title && x.claim && /^https?:\/\//i.test(x.url || ''))],
        ['SEC financial history', !!financial?.history?.length],
    ];
}
function ReviewChecklist({ report, financial, mini = false }) {
    const checks = reportChecks(report, financial), done = checks.filter(x => x[1]).length;
    return React.createElement("div", { className: 'quality-review ' + (mini ? 'mini' : ''), "aria-label": L("Draft completeness checklist") },
        React.createElement("div", { className: "quality-review-header" },
            React.createElement("div", null,
                React.createElement("div", { className: "eyebrow" }, L("EDITORIAL REVIEW")),
                React.createElement("strong", null, L("Draft completeness")),
                React.createElement("small", null, L("Not a quality rating or publication approval"))),
            React.createElement("span", null,
                done,
                "/",
                checks.length)),
        React.createElement("div", { className: "quality-meter", role: "progressbar", "aria-valuenow": done, "aria-valuemin": "0", "aria-valuemax": checks.length },
            React.createElement("i", { style: { width: (100 * done / checks.length) + '%' } })),
        React.createElement("div", { className: "quality-check-grid" }, checks.map(([label, ok]) => React.createElement("div", { key: label, className: ok ? 'is-ready' : '' },
            React.createElement("span", { "aria-hidden": "true" }, ok ? '✓' : '○'),
            L(label)))),
        React.createElement("p", null, L("Figures, links and analyst conclusions still require independent human verification before sharing.")));
}
function EvidenceDesk({ report, setReport, mini = false }) {
    const [title, setTitle] = useState(''), [url, setUrl] = useState(''), [claim, setClaim] = useState('');
    const [section, setSection] = useState('Thesis'), [kind, setKind] = useState('SEC filing'), [message, setMessage] = useState('');
    const entries = Array.isArray(report.evidence) ? report.evidence : [];
    function add() {
        const cleanURL = url.trim();
        let parsed;
        try {
            parsed = new URL(cleanURL);
        }
        catch (e) {
            setMessage(L('Add a complete source URL starting with https://'));
            return;
        }
        if (title.trim().length < 3 || claim.trim().length < 5 || !['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname.includes('.') || parsed.username || parsed.password || entries.length >= 20) {
            setMessage(L('Enter a source title, a public http(s) link and the claim it supports (maximum 20).'));
            return;
        }
        setReport(current => ({ ...current, evidence: [...(current.evidence || []), { title: title.trim(), url: cleanURL, claim: claim.trim(), section, kind }] }));
        setTitle('');
        setUrl('');
        setClaim('');
        setMessage(L('Reference added as analyst-entered, not automatically verified.'));
    }
    function remove(index) { setReport(current => ({ ...current, evidence: (current.evidence || []).filter((_, i) => i !== index) })); }
    return React.createElement("section", { className: 'quality-evidence ' + (mini ? 'is-mini' : ''), "aria-label": L("Research evidence ledger") },
        React.createElement("div", { className: "quality-evidence-heading" },
            React.createElement("div", null,
                React.createElement("h3", null,
                    L("Evidence ledger "),
                    React.createElement("span", null,
                        entries.length,
                        L(" references"))),
                React.createElement("p", null, L("Connect a research claim to a source. You supply and verify each reference."))),
            React.createElement("span", { className: "quality-origin" }, L("ANALYST-ENTERED"))),
        entries.length > 0 && React.createElement("div", { className: "quality-entry-list" }, entries.map((entry, i) => React.createElement("div", { className: "quality-entry", key: i },
            React.createElement("div", null,
                React.createElement("strong", null,
                    i + 1,
                    ". ",
                    entry.title),
                React.createElement("small", null,
                    L(entry.section),
                    " \u00B7 ",
                    L(entry.kind),
                    L(" \u00B7 unverified")),
                React.createElement("p", null, entry.claim),
                React.createElement("a", { href: entry.url, target: "_blank", rel: "noopener noreferrer" }, L("Open source \u2197"))),
            React.createElement("button", { onClick: () => remove(i), "aria-label": L('Remove source ') + entry.title, title: L("Remove reference") }, "\u00D7")))),
        React.createElement("div", { className: "quality-evidence-form" },
            React.createElement("label", null,
                L("Source title"),
                React.createElement("input", { "aria-label": L("Evidence source title"), value: title, maxLength: 160, placeholder: L("e.g. FY2026 Form 10-K"), onChange: e => setTitle(e.target.value) })),
            React.createElement("label", null,
                L("Public source link"),
                React.createElement("input", { "aria-label": L("Evidence source URL"), value: url, maxLength: 700, placeholder: "https://www.sec.gov/...", onChange: e => setUrl(e.target.value) })),
            React.createElement("label", { className: "quality-claim" },
                L("Claim this supports"),
                React.createElement("input", { "aria-label": L("Evidence supported claim"), value: claim, maxLength: 500, placeholder: L("e.g. revenue growth in FY2026"), onChange: e => setClaim(e.target.value) })),
            React.createElement("label", null,
                L("Report section"),
                React.createElement("select", { "aria-label": L("Evidence section"), value: section, onChange: e => setSection(e.target.value) }, ['Thesis', 'Risks', 'Catalysts', 'Notes', 'Evidence'].map(x => React.createElement("option", { key: x, value: x }, L(x))))),
            React.createElement("label", null,
                L("Source type"),
                React.createElement("select", { "aria-label": L("Evidence source type"), value: kind, onChange: e => setKind(e.target.value) }, ['SEC filing', 'Company IR', 'Third-party research', 'Other'].map(x => React.createElement("option", { key: x, value: x }, L(x)))))),
        React.createElement("div", { className: "quality-add-row" },
            React.createElement(Button, { onClick: add, icon: "company", variant: "primary" }, L("Add reference")),
            React.createElement("span", { role: "status" }, message || L('Sources are not downloaded or fact-checked by this form.'))));
}
function EditorialPreflight({ report, financial }) {
    const [result, setResult] = useState(null), [pending, setPending] = useState(false), [warning, setWarning] = useState('');
    async function review() {
        setPending(true);
        setWarning('');
        setResult(null);
        try {
            const response = await post(API + '/report/preflight', {
                title: report.title, author: report.author, thesis: report.thesis, risks: report.risks, catalysts: report.catalysts,
                has_sec: !!financial, history: financial?.history || [], evidence: report.evidence || []
            });
            setResult(response);
        }
        catch (e) {
            setWarning(e.message || 'Review was unavailable.');
        }
        finally {
            setPending(false);
        }
    }
    return React.createElement("section", { className: "preflight-studio", "aria-label": L("Editorial publication preflight") },
        React.createElement("div", { className: "eyebrow" }, L("EDITORIAL QUALITY GATE")),
        React.createElement("h3", null, L("Does your research stand up to scrutiny?")),
        React.createElement("p", { className: "muted" }, L("Check which claims have analyst-entered citations, which sections are missing, and whether language sounds too certain. This is a checklist\u2014not automated fact-checking.")),
        React.createElement(Button, { variant: "primary", icon: "shield", onClick: review, loading: pending }, L("Run editorial preflight")),
        warning && React.createElement(Notice, { type: "danger" }, warning),
        result && React.createElement("div", { className: "preflight-results", role: "status" },
            React.createElement("div", { className: "preflight-result-heading" },
                React.createElement("strong", null, result.status),
                React.createElement("span", null,
                    result.basic.completed,
                    "/",
                    result.basic.total,
                    L(" completeness checks"))),
            React.createElement("div", { className: "preflight-coverage" }, Object.entries(result.coverage).map(([name, value]) => React.createElement("div", { key: name, className: value.written && !value.source_links ? 'needs-attention' : '' },
                React.createElement("strong", null, name),
                React.createElement("span", null, value.written ? value.source_links + L(' analyst-entered source link(s)') : L('Not written'))))),
            React.createElement("div", { className: "preflight-notices" }, result.notices.map((item, i) => React.createElement("p", { key: i },
                React.createElement(Icon, { name: "info", size: 15 }),
                item)))));
}
/* v0.13.5: newest quarters from 10-Q filings; Q4 is derived from the 10-K and labelled. */
function QuarterlyPanel({ quarterly }) {
    const rows = (quarterly.quarters || []).slice().reverse();
    const ttm = quarterly.ttm;
    const signed = v => v === null || v === undefined ? '—' : (v > 0 ? '+' : '') + percent(v);
    return React.createElement("section", { className: "panel quarterly-panel" },
        React.createElement("div", { className: "panel-head" },
            React.createElement("div", null,
                React.createElement("div", { className: "eyebrow" }, L("SEC 10-Q · LATEST QUARTERS")),
                React.createElement("h2", null, L("The newest numbers"))),
            ttm && React.createElement("div", { className: "quarterly-ttm" },
                React.createElement("small", null, React.createElement(Term, { k: 'ttm' }, L("Last 12 months"))),
                React.createElement("strong", null, billion(ttm.revenue_m)),
                React.createElement("span", null, L("revenue") + (ttm.operating_margin_pct !== undefined ? ' · ' + L('operating margin') + ' ' + percent(ttm.operating_margin_pct) : '')))),
        React.createElement("div", { className: "table-wrap" },
            React.createElement("table", { className: "quarterly-table" },
                React.createElement("thead", null, React.createElement("tr", null,
                    [[L("Quarter ended"), ''], [L("Revenue"), 'revenue'], [L("vs a year earlier"), 'revenue_growth'], [L("Op. margin"), 'operating_margin'], [L("Source"), 'form_10q']].map(([h, k]) => React.createElement("th", { key: h }, k ? React.createElement(Term, { k }, h) : h)))),
                React.createElement("tbody", null, rows.map(r => React.createElement("tr", { key: r.quarter_end },
                    React.createElement("td", null, r.quarter_end),
                    React.createElement("td", null, billion(r.revenue_m)),
                    React.createElement("td", { className: r.revenue_yoy_pct > 0 ? 'up' : r.revenue_yoy_pct < 0 ? 'down' : '' }, signed(r.revenue_yoy_pct)),
                    React.createElement("td", null, percent(r.operating_margin_pct)),
                    React.createElement("td", null, r.derived ? L('derived: 10-K minus Q1–Q3') : r.form)))))),
        React.createElement("p", { className: "micro muted" }, L("Companies file no 10-Q for the fourth quarter; it is calculated as the fiscal-year total minus the first three quarters. Quarters are not seasonally adjusted.")));
}
/* v0.13.5 'Was I right?': saved SEC snapshot next to today's numbers; the author gives the verdict. */
const QE_VERDICTS = [['held', 'My thesis held'], ['partly', 'Partly'], ['failed', 'It did not hold'], ['too_early', 'Too early to tell']];
const QE_TRACK_LABELS = { revenue_m: 'Revenue', revenue_yoy_pct: 'Revenue growth', operating_margin_pct: 'Operating margin', net_margin_pct: 'Net margin', fcf_m: 'Free cash flow' };
function ThesisCheck({ record, contactEmail, onReviewed }) {
    const [check, setCheck] = useState(null);
    const [working, setWorking] = useState(false);
    const [error, setError] = useState('');
    const [verdict, setVerdict] = useState('');
    const [note, setNote] = useState('');
    const reviews = record.reviews || [];
    const hasSnapshot = !!record.metadata?.snapshot;
    const show = (row, which) => { const v = row[which]; return row.metric.endsWith('_pct') ? percent(v) : billion(v); };
    const change = row => row.change === null || row.change === undefined ? '—' : row.change_unit === 'pts'
        ? (row.change > 0 ? '+' : '') + fmt(row.change, 1) + ' ' + L('pts') : (row.change > 0 ? '+' : '') + percent(row.change);
    async function recheck() {
        setWorking(true); setError('');
        try { setCheck(await post(API + '/library/' + record.id + '/recheck', { contact_email: contactEmail.trim() })); }
        catch (e) { setError(e.message || String(e)); }
        finally { setWorking(false); }
    }
    async function saveReview() {
        setWorking(true); setError('');
        try {
            const evidence = check ? { saved_fiscal_end: check.saved_fiscal_end, current_fiscal_end: check.current_fiscal_end, rows: check.rows } : {};
            const d = await post(API + '/library/' + record.id + '/review', { verdict, note: note.trim(), evidence });
            onReviewed(d.reviews); setVerdict(''); setNote('');
        }
        catch (e) { setError(e.message || String(e)); }
        finally { setWorking(false); }
    }
    return React.createElement("section", { className: "thesis-check" },
        React.createElement("div", { className: "eyebrow" }, L("WAS I RIGHT?")),
        React.createElement("h3", null, L("Compare your saved thesis with newer SEC figures")),
        React.createElement("p", { className: "micro muted" }, L("QuantEdge does not judge your thesis. It puts the figures you wrote from next to today’s; you decide and your verdict is kept.")),
        hasSnapshot ? React.createElement(Button, { icon: "refresh", onClick: recheck, loading: working && !verdict }, L("Compare with today’s figures"))
            : React.createElement(Notice, { type: "amber" }, L("This draft was saved without SEC figures (or before v0.13.5), so there is nothing to compare.")),
        error && React.createElement(Notice, { type: "amber" }, error),
        check && React.createElement(Group, null,
            React.createElement("p", { className: "micro" }, L("Saved from fiscal year ended") + ' ' + check.saved_fiscal_end + ' · ' + L('now') + ' ' + check.current_fiscal_end
                + (check.new_annual_report ? ' · ' + L('a newer 10-K is available') : ' · ' + L('no newer 10-K yet'))),
            React.createElement("div", { className: "table-wrap" }, React.createElement("table", { className: "quarterly-table" },
                React.createElement("thead", null, React.createElement("tr", null, [L("Measure"), L("When saved"), L("Now"), L("Change")].map(h => React.createElement("th", { key: h }, h)))),
                React.createElement("tbody", null, check.rows.map(r => React.createElement("tr", { key: r.metric },
                    React.createElement("td", null, L(QE_TRACK_LABELS[r.metric] || r.metric)),
                    React.createElement("td", null, show(r, 'then')), React.createElement("td", null, show(r, 'now')),
                    React.createElement("td", { className: r.change > 0 ? 'up' : r.change < 0 ? 'down' : '' }, change(r))))))),
            check.latest_quarter && React.createElement("p", { className: "micro" }, L('Latest quarter') + ' (' + check.latest_quarter.quarter_end + '): '
                + billion(check.latest_quarter.revenue_m) + (check.latest_quarter.revenue_yoy_pct !== null ? ' · ' + (check.latest_quarter.revenue_yoy_pct > 0 ? '+' : '') + percent(check.latest_quarter.revenue_yoy_pct) + ' ' + L('vs a year earlier').toLocaleLowerCase(QE_LANG) : '')),
            check.thesis && React.createElement("div", { className: "thesis-quote" }, React.createElement("strong", null, L("Your thesis")), React.createElement("p", null, check.thesis)),
            check.risks && React.createElement("div", { className: "thesis-quote" }, React.createElement("strong", null, L("Your counterargument")), React.createElement("p", null, check.risks)),
            React.createElement("div", { className: "verdict-row", role: "group", "aria-label": L("Your verdict") }, QE_VERDICTS.map(([id, label]) =>
                React.createElement("button", { key: id, type: "button", "aria-pressed": verdict === id, className: 'verdict ' + id + (verdict === id ? ' is-selected' : ''), onClick: () => setVerdict(id) }, L(label)))),
            React.createElement("textarea", { className: "social-input social-input-small", maxLength: 2000, value: note, onChange: e => setNote(e.target.value), placeholder: L("What happened, and what did you learn? (optional)") }),
            React.createElement(Button, { variant: "primary", icon: "save", onClick: saveReview, loading: working && !!verdict, disabled: !verdict }, L("Save my verdict"))),
        reviews.length > 0 && React.createElement("div", { className: "review-history" },
            React.createElement("strong", null, L("Your verdicts")),
            reviews.map(rv => React.createElement("p", { key: rv.id },
                React.createElement("span", { className: 'verdict-chip ' + rv.verdict }, L((QE_VERDICTS.find(v => v[0] === rv.verdict) || [0, rv.verdict])[1])),
                ' ' + qeDate(rv.created_utc) + (rv.note ? ' — ' + rv.note : '')))));
}
// Student-first research journey. A readiness checklist does not grade truth,
// promise admission, or imply a report has been independently reviewed.
// Financial Learning Coach: local-only educational examples. The values below
// are fictional. They are never mixed with SEC figures or exported as findings.
function safeGrowthPercent(previous, current) {
    const a = Number(previous), b = Number(current);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b < 0)
        return null;
    return (b - a) / a * 100;
}
const COACH_CONCEPTS = [
    { id: 'revenue', tr: 'Gelir', en: 'Revenue', simpleTR: 'Şirketin sattığı şeylerden kazandığı toplam para. Masraflar henüz çıkarılmadı.', simpleEN: 'Total money from sales, before costs.', analogyTR: '100 oyuncak × 10 € = 1.000 € satış geliri.', analogyEN: '100 toys × €10 = €1,000 in sales.', lookTR: 'Hangi ürün ya da müşteri bu geliri getiriyor?', lookEN: 'Which products or customers create this sales number?', pitfallTR: 'Gelir yüksek diye kâr da yüksek olmak zorunda değil.', pitfallEN: 'High revenue does not necessarily mean high profit.' },
    { id: 'growth', tr: 'Büyüme', en: 'Growth', simpleTR: 'Gelir geçen yıla göre ne kadar değişti?', simpleEN: 'How sales changed compared with the previous period.', analogyTR: 'Geçen yıl 100, bu yıl 120 ise büyüme %20.', analogyEN: 'If revenue rises from 100 to 120, growth is 20%.', lookTR: 'Aynı uzunluktaki mali yılları karşılaştır.', lookEN: 'Compare fiscal periods of the same length.', pitfallTR: 'Hızlı büyüme tek başına sürdürülebilirlik kanıtı değildir.', pitfallEN: 'Fast growth alone does not prove sustainability.' },
    { id: 'margin', tr: 'Faaliyet kâr marjı', en: 'Operating margin', simpleTR: 'Her 100 € satışın ne kadarının ana faaliyetlerden kâr kaldığını gösterir.', simpleEN: 'Operating profit left from each 100 in sales.', analogyTR: '100 € gelir ve 20 € faaliyet kârı = %20 marj.', analogyEN: '100 revenue and 20 operating profit = 20% margin.', lookTR: 'Marj yıllar içinde artıyor mu, azalıyor mu?', lookEN: 'Is the margin rising or falling across years?', pitfallTR: 'Faaliyet kârı, kasadaki nakit para ile aynı şey değildir.', pitfallEN: 'Operating profit is not the same as cash.' },
    { id: 'fcf', tr: 'Serbest nakit akışı', en: 'Free cash flow', simpleTR: 'Şirketin faaliyetlerden gelen nakdinden yatırım harcamalarını çıkardığında kalan tutar.', simpleEN: 'Operating cash flow minus capital spending.', analogyTR: '50 € faaliyet nakdi − 15 € yatırım = 35 € FCF.', analogyEN: '50 operating cash − 15 capital spending = 35 FCF.', lookTR: 'Şirket büyürken gerçekten nakit de üretiyor mu?', lookEN: 'Is the business generating cash as it grows?', pitfallTR: 'Tek yılın FCF’si büyük yatırımlar nedeniyle geçici olarak düşük olabilir.', pitfallEN: 'Heavy investment can depress FCF in one year.' }
];
function FinanceLearningCoach({ tr }) {
    const [concept, setConcept] = useState('revenue');
    const [before, setBefore] = useState(100);
    const [after, setAfter] = useState(120);
    const [guess, setGuess] = useState('');
    const current = COACH_CONCEPTS.find(x => x.id === concept) || COACH_CONCEPTS[0];
    const result = safeGrowthPercent(before, after);
    const numericGuess = guess.trim() === '' ? null : Number(guess);
    const checked = numericGuess !== null && Number.isFinite(numericGuess) && result !== null;
    const correct = checked && Math.abs(numericGuess - result) <= 0.15;
    return React.createElement("section", { className: "coach-lab", "aria-label": L("Interactive finance coach") },
        React.createElement("div", { className: "coach-lab-head" },
            React.createElement("span", { className: "coach-flag" }, tr ? '2 DAKİKALIK FİNANS KOÇU' : '2-MINUTE FINANCE COACH'),
            React.createElement("strong", null, tr ? 'Önce öğren, sonra kendi yorumunu yaz.' : 'Learn it first. Then explain it yourself.')),
        React.createElement("div", { className: "coach-concepts", role: "group", "aria-label": tr ? 'Finans kavramları' : 'Finance concepts' }, COACH_CONCEPTS.map(c => React.createElement("button", { key: c.id, type: "button", "aria-pressed": c.id === concept, className: c.id === concept ? 'selected' : '', onClick: () => setConcept(c.id) }, tr ? c.tr : c.en))),
        React.createElement("div", { className: "coach-definition" },
            React.createElement("h4", null, tr ? current.tr : current.en),
            React.createElement("p", null, tr ? current.simpleTR : current.simpleEN),
            React.createElement("div", { className: "coach-analogy" },
                tr ? 'Basit örnek' : 'Simple example',
                ": ",
                tr ? current.analogyTR : current.analogyEN),
            React.createElement("div", { className: "coach-thinking" },
                React.createElement("strong", null, tr ? 'Araştırırken sor:' : 'Ask in your research:'),
                " ",
                tr ? current.lookTR : current.lookEN),
            React.createElement("small", null,
                tr ? 'Dikkat: ' : 'Watch out: ',
                tr ? current.pitfallTR : current.pitfallEN)),
        React.createElement("div", { className: "coach-practice" },
            React.createElement("div", null,
                React.createElement("strong", null, tr ? 'Kendin hesapla — tamamen örnek rakamlar' : 'Try the calculation — fictional numbers only'),
                React.createElement("p", null, tr ? 'Bir şirketin geçen yılki ve bu yılki gelirini değiştir. Büyüme yüzdesini tahmin et.' : 'Change prior and current revenue, then calculate growth.')),
            React.createElement("div", { className: "coach-practice-controls" },
                React.createElement("label", null,
                    tr ? 'Önceki gelir' : 'Prior revenue',
                    React.createElement("input", { "aria-label": L("Prior example revenue"), type: "number", min: "1", max: "10000", value: before, onChange: e => { setBefore(e.target.value); setGuess(''); } })),
                React.createElement("label", null,
                    tr ? 'Yeni gelir' : 'New revenue',
                    React.createElement("input", { "aria-label": L("Current example revenue"), type: "number", min: "0", max: "10000", value: after, onChange: e => { setAfter(e.target.value); setGuess(''); } })),
                React.createElement("label", null,
                    tr ? 'Tahminin (%)' : 'Your guess (%)',
                    React.createElement("input", { "aria-label": L("Your growth guess"), type: "number", step: "0.1", value: guess, onChange: e => setGuess(e.target.value), placeholder: "20" }))),
            result === null ? React.createElement("div", { role: "status", className: "coach-result" }, tr ? 'Geçerli rakamlar gir. Önceki gelir sıfırdan büyük olmalı.' : 'Enter valid figures. Prior revenue must be greater than zero.') : React.createElement("div", { role: "status", className: 'coach-result ' + (checked ? (correct ? 'right' : 'tryagain') : '') },
                checked ? (correct ? (tr ? 'Doğru! Güzel hesapladın.' : 'Correct! Nicely calculated.') : (tr ? 'Tekrar dene. Formül: (Yeni − Önceki) ÷ Önceki × 100.' : 'Try again. Formula: (New − Prior) ÷ Prior × 100.')) : (tr ? 'Cevabını yaz; ardından sonucu göreceksin.' : 'Enter a guess to check it.'),
                checked && React.createElement("span", null,
                    tr ? ' Hesaplanan büyüme: ' : ' Calculated growth: ',
                    fmt(result, 2),
                    "%")),
            React.createElement("small", { className: "coach-data-note" }, tr ? 'Bu hesaplama alıştırmasıdır; seçili şirketin SEC verisi değildir.' : 'This is practice, not SEC data for your selected company.')));
}
function WritingCoach({ tr, report, learning }) {
    const thesis = (report.thesis || '').trim();
    const risk = (report.risks || '').trim();
    const interpretation = (learning.financial_insight || '').trim();
    const suggestions = [];
    if (thesis.length < 65)
        suggestions.push(tr ? 'Tezini bir tahmin, neden ve gözlemlenebilir ölçütle somutlaştır.' : 'State a prediction, reason and observable indicator in your thesis.');
    if (!/\d/.test(thesis))
        suggestions.push(tr ? 'Mümkünse bir mali yıl veya ölçülebilir göstergeden söz et; rakam uydurma.' : 'If relevant, cite a fiscal year or measurable indicator—do not invent figures.');
    if (risk.length < 65)
        suggestions.push(tr ? 'Seni yanılttığını gösterecek en az bir somut olay veya veri yaz.' : 'Name one concrete fact or event that would challenge your view.');
    if (interpretation.length < 35)
        suggestions.push(tr ? 'Finansal verinin ne söylediğini kendi cümlenle açıklamayı unutma.' : 'Explain what the reported figures mean in your own words.');
    return React.createElement("div", { className: "coach-writing", "aria-label": L("Writing coach") },
        React.createElement("strong", null, tr ? 'Yazı koçu · Geliştirebileceğin noktalar' : 'Writing coach · Ideas to strengthen your draft'),
        React.createElement("p", null, tr ? 'Bunlar otomatik yazı ipuçlarıdır; iddialarını veya doğruluğunu denetlemez.' : 'These are writing prompts, not fact-checks or a research grade.'),
        React.createElement("ul", null, (suggestions.length ? suggestions : [tr ? 'Metnin yeterince ayrıntılı görünüyor; şimdi iddiaları orijinal kaynaklarla doğrula.' : 'Your draft has detail; now verify every claim against primary documents.']).map((t, i) => React.createElement("li", { key: i }, t))));
}
const GUIDE_STEPS = [['Choose a company', 'Bir şirket seç'], ['Understand the business', 'Şirketi anla'], ['Read the numbers', 'Rakamları oku'], ['Build your argument', 'Kendi görüşünü oluştur'], ['Prove your work', 'Çalışmanı kanıtla']];
function guidedReadiness(symbol, financial, report, learning) {
    const evidence = (report.evidence || []).filter(x => x.title && x.url && x.claim);
    return [
        ['Real company selected', symbol !== 'ALPHA'],
        ['What the business does', learning.business.trim().length >= 35],
        ['SEC financial figures loaded', !!(financial && financial.history && financial.history.length)],
        ['Your interpretation of the numbers', learning.financial_insight.trim().length >= 35],
        ['A testable thesis', report.thesis.trim().length >= 65],
        ['An honest counterargument', report.risks.trim().length >= 65],
        ['Two analyst-entered source links', evidence.length >= 2],
        ['Your research method', learning.research_method.trim().length >= 30],
        ['Your own contribution explained', learning.contribution.trim().length >= 30],
        ['AI use clearly declared', learning.ai_use === 'none' || learning.ai_use === 'assisted']
    ];
}
function GuidedAnalyst({ setLang, symbol, inputTicker, setInputTicker, switchTicker, financial, latest, report, setReport, learning, setLearning, busy, loadCompany, setPage, setReportTab, save, exportReport, contactEmail, setContactEmail }) {
    const [step, setStep] = useState(0);
    const tr = QE_LANG === 'tr'; // Guide copy exists in Turkish and English; Spanish falls back to English
    const readies = guidedReadiness(symbol, financial, report, learning);
    const done = readies.filter(x => x[1]).length;
    const changeLearning = (field, value) => setLearning(x => ({ ...x, [field]: value }));
    const changeReport = (field, value) => setReport(x => ({ ...x, [field]: value }));
    const prompt = (label, hint, field, source = 'learning', height = 110) => React.createElement("label", { className: "guide-field" },
        React.createElement("strong", null, label),
        React.createElement("small", null, hint),
        React.createElement("textarea", { style: { minHeight: height }, value: source === 'learning' ? learning[field] : report[field], onChange: e => source === 'learning' ? changeLearning(field, e.target.value) : changeReport(field, e.target.value) }));
    return React.createElement("div", { className: "guide-layout", "aria-label": L("Guided Analyst research journey") },
        React.createElement("div", { className: "guide-hero" },
            React.createElement("div", { className: "guide-hero-side" },
                React.createElement("span", null,
                    done,
                    " / ",
                    readies.length,
                    " ",
                    tr ? 'araştırma kontrolü' : 'research checks'),
                React.createElement("div", { className: "guide-progress", "aria-label": L("Research completeness"), role: "progressbar", "aria-valuemin": 0, "aria-valuemax": readies.length, "aria-valuenow": done },
                    React.createElement("i", { style: { width: (done / readies.length * 100) + '%' } })))),
        React.createElement("nav", { className: "guide-stepper", "aria-label": L("Research steps") }, GUIDE_STEPS.map(([en, turkish], index) => React.createElement("button", { key: en, type: "button", "aria-current": step === index ? 'step' : undefined, className: step === index ? 'active' : '', onClick: () => setStep(index) },
            React.createElement("span", null, index + 1),
            React.createElement("strong", null, tr ? turkish : en)))),
        React.createElement("div", { className: "guide-main" },
            React.createElement("section", { className: "guide-canvas" },
                React.createElement("div", { className: "coach-next" },
                    React.createElement("span", null, tr ? 'ŞİMDİKİ GÖREVİN' : 'YOUR TASK NOW'),
                    React.createElement("strong", null, tr ? ['Bir şirket seç ve resmî veriyi yükle.', 'Şirketin ürününü ve müşterisini kendi sözlerinle anlat.', 'Önce örnekle öğren, ardından gerçek finansalları açıkla.', 'Bir görüş yaz ve onu yanlış çıkaracak kanıtı düşün.', 'Kaynaklarını, yöntemini ve kendi katkını belgele.'][step] : ['Choose a company and load the official data.', 'Explain the products and customers in your own words.', 'Practice with examples, then interpret the real figures.', 'Make a claim and consider what could disprove it.', 'Document sources, methods and your own contribution.'][step])),
                step === 0 && React.createElement(Group, null,
                    React.createElement("div", { className: "guide-kicker" },
                        "01 / ",
                        tr ? 'BAŞLANGIÇ' : 'START'),
                    React.createElement("h3", null, tr ? 'Hangi şirketi merak ediyorsun?' : 'Which company are you curious about?'),
                    React.createElement("p", { className: "guide-intro" }, tr ? 'Önce bir şirket seç. Fiyat tahmini yapmayacağız; şirketi anlamaya çalışacağız.' : 'Pick one company. We are learning how the business works—not guessing a stock price.'),
                    React.createElement("label", { className: "guide-field" },
                        React.createElement("strong", null, tr ? 'Şirket kodu' : 'Company ticker'),
                        React.createElement("input", { list: "qe-companies", autoComplete: "off", value: inputTicker, onChange: e => setInputTicker(e.target.value.toUpperCase()), onKeyDown: e => { if (e.key === 'Enter')
                                switchTicker(inputTicker); }, placeholder: "NVDA" })),
                    React.createElement("div", { className: "guide-choices" }, ['NVDA', 'AAPL', 'MSFT', 'AMD', 'AVGO', 'INTC'].map(t => React.createElement("button", { key: t, type: "button", onClick: () => switchTicker(t), className: symbol === t ? 'chosen' : '' }, t))),
                    React.createElement("div", { className: "guide-active" },
                        React.createElement("button", { type: "button", className: "guide-apply", onClick: () => switchTicker(inputTicker) }, tr ? 'Bu şirketi seç' : 'Select typed ticker'),
                        " ",
                        tr ? 'Seçili şirket' : 'Selected',
                        ": ",
                        React.createElement("b", null, symbol === 'ALPHA' ? L('No company selected yet (demo only)') : symbol),
                        inputTicker && inputTicker !== symbol && validTicker(inputTicker) && React.createElement("span", { className: "guide-pending" }, " · " + inputTicker + " " + (tr ? 'henüz seçilmedi — Bu şirketi seç’e bas' : 'not selected yet — press Select typed ticker'))),
                    !window.QE_DEMO && React.createElement("label", { className: "guide-field" },
                        React.createElement("strong", null, tr ? 'SEC için iletişim e-postası (isteğe bağlı)' : 'SEC contact email (optional)'),
                        React.createElement("small", null, tr ? 'Canlı SEC isteğinde kimliklendirme için gerekli olabilir. Bu uygulama e-postayı saklamaz.' : 'May be required to identify automated SEC requests. Not saved by this app.'),
                        React.createElement("input", { type: "email", value: contactEmail, onChange: e => setContactEmail(e.target.value), placeholder: "research@example.com" })),
                    React.createElement(Button, { variant: "primary", icon: "company", onClick: loadCompany, loading: busy === 'company', disabled: symbol === 'ALPHA' }, tr ? 'Resmî SEC verilerini yükle' : 'Load official SEC financial facts'),
                    React.createElement("details", null,
                        React.createElement("summary", null, tr ? 'SEC nedir?' : 'What is the SEC?'),
                        tr ? 'ABD şirketlerinin kamuya açıklanan finansal raporlarına ulaşabileceğimiz resmî kaynaktır. Yine de tabloları orijinal raporla karşılaştırmamız gerekir.' : 'A US regulator with company filings. We must still reconcile the numbers to the original filings.')),
                step === 1 && React.createElement(Group, null,
                    React.createElement("div", { className: "guide-kicker" },
                        "02 / ",
                        tr ? 'İŞ MODELİ' : 'THE BUSINESS'),
                    React.createElement("h3", null, tr ? 'Bu şirket para kazanmak için ne yapıyor?' : 'How does this company make money?'),
                    React.createElement("p", { className: "guide-intro" }, tr ? 'Bir arkadaşına anlatır gibi yaz. Ürünü kim alıyor, neden para ödüyor?' : 'Explain it to a friend. Who is the customer? What do they pay for?'),
                    prompt(tr ? 'Şirketin işini kendi sözlerinle anlat' : 'Explain the business in your own words', tr ? 'Kopyalama. Anladığını yaz; emin olmadığın kısımları ayrıca kontrol et.' : 'Use your own thinking; verify uncertain statements.', 'business'),
                    React.createElement("div", { className: "guide-example" },
                        React.createElement("strong", null, tr ? 'Örnek düşünce kalıbı' : 'Simple thinking frame'),
                        React.createElement("p", null, tr ? '“Bu şirket … satıyor. Müşterileri … çünkü … . En önemli gelir kaynağı … olabilir; bunu raporlarından kontrol edeceğim.”' : '“This company sells … to … . Customers pay because … . I think the main revenue driver is … and will check the filings.”'))),
                step === 2 && React.createElement(Group, null,
                    React.createElement("div", { className: "guide-kicker" },
                        "03 / ",
                        tr ? 'GERÇEK RAKAMLAR' : 'REAL NUMBERS'),
                    React.createElement("h3", null, tr ? 'Şirket gerçekten büyüyor mu?' : 'Is the company really growing?'),
                    React.createElement("p", { className: "guide-intro" }, tr ? 'İki sayıyı ezberleme. Rakamın ne anlattığını keşfet.' : 'Do not memorize the numbers. Explain what the change means.'),
                    React.createElement(HookShell, { component: FinanceLearningCoach, tr: tr }),
                    React.createElement("div", { className: "coach-real-divider" },
                        React.createElement("strong", null, tr ? 'Şimdi gerçek şirket verilerine bakalım' : 'Now look at the actual company data'),
                        React.createElement("small", null, tr ? 'Aşağıdaki değerler sadece SEC verileri yüklendiyse gerçek şirket verisidir.' : 'The figures below are real company figures only after SEC data is loaded.')),
                    React.createElement("div", { className: "guide-stats" }, [['Revenue', 'revenue', billion(latest?.revenue_m)], ['Growth', 'revenue_growth', percent(latest?.revenue_yoy_pct)], ['Operating margin', 'operating_margin', percent(latest?.operating_margin_pct)], ['Free cash flow', 'free_cash_flow', billion(latest?.fcf_m)]].map(([k, term, v]) => React.createElement("div", { key: k },
                        React.createElement("small", null, React.createElement(Term, { k: term }, L(k))),
                        React.createElement("strong", null, v)))),
                    financial ? React.createElement("p", { className: "guide-source" },
                        financial.company,
                        " \u00B7 ",
                        financial.source,
                        L(" \u00B7 FY ends "),
                        financial.fiscal_end,
                        " \u00B7 ",
                        tr ? 'Mali yıl ve veri tarihi kontrol edilmeli' : 'Check fiscal periods and filing dates',
                        financial.filing?.url && " \u00B7 ",
                        financial.filing?.url && React.createElement("a", { href: financial.filing.url, target: "_blank", rel: "noopener noreferrer", className: "filing-link" }, L('Open the 10-K filing ↗'))) : React.createElement("div", { className: "guide-example" }, tr ? 'Henüz SEC finansalları yok. Birinci adıma dönüp “Yükle”ye bas.' : 'No SEC financial facts yet. Return to step 1 and load them.'),
                    prompt(tr ? 'Rakamları nasıl yorumluyorsun?' : 'What do the figures tell you?', tr ? 'Örnek: “Gelir arttı ama kâr marjı … . Bu … anlamına gelebilir.”' : 'Example: “Revenue rose but the margin … ; this may suggest … .”', 'financial_insight'),
                    financial?.quarterly?.quarters?.length ? React.createElement(QuarterlyPanel, { quarterly: financial.quarterly }) : null,
                    React.createElement(Button, { onClick: () => setPage('Analysis Lab'), icon: "model" }, L('Go deeper in the Analysis Lab'))),
                step === 3 && React.createElement(Group, null,
                    React.createElement("div", { className: "guide-kicker" },
                        "04 / ",
                        tr ? 'SENİN FİKRİN' : 'YOUR ARGUMENT'),
                    React.createElement("h3", null, tr ? 'Ne düşünüyorsun? Peki ya yanılıyorsan?' : 'What do you think—and what if you are wrong?'),
                    React.createElement("p", { className: "guide-intro" }, tr ? 'Güçlü bir araştırma hem destekleyici kanıtı hem de ters görüşü gösterir.' : 'Strong research explains both supporting evidence and the best counterargument.'),
                    prompt(tr ? 'Araştırma tezin' : 'Your research thesis', tr ? '“Şirketin önümüzdeki yıllarda … avantajını koruyabileceğini düşünüyorum, çünkü …”' : '“I think the company may sustain … because … .”', 'thesis', 'report', 140),
                    prompt(tr ? 'Seni hangi kanıt yanlış çıkarabilir?' : 'What evidence would change your mind?', tr ? 'Rakipler, nakit akışı, maliyetler, düzenlemeler veya yönetim riskleri.' : 'Consider competition, cash flow, margins, regulation or management risks.', 'risks', 'report', 140),
                    React.createElement(WritingCoach, { tr: tr, report: report, learning: learning })),
                step === 4 && React.createElement(Group, null,
                    React.createElement("div", { className: "guide-kicker" },
                        "05 / ",
                        tr ? 'KANIT VE PORTFÖY' : 'EVIDENCE AND PORTFOLIO'),
                    React.createElement("h3", null, tr ? 'Bu araştırmanın gerçekten sana ait olduğunu göster.' : 'Show what you actually did.'),
                    React.createElement("p", { className: "guide-intro" }, tr ? 'İyi bir CV projesi sadece şık görünmez. Yöntemi tekrarlanabilir, kaynakları izlenebilir ve kendi katkın anlaşılırdır.' : 'A meaningful portfolio project has repeatable methods, traceable sources and a clearly documented personal contribution.'),
                    prompt(tr ? 'Araştırma yöntemini anlat' : 'Describe your research method', tr ? 'Hangi kaynakları kullandın? Neyi hesapladın? Neyle karşılaştırdın?' : 'Which sources, calculations and comparisons did you use?', 'research_method'),
                    prompt(tr ? 'Sen hangi kısmı yaptın?' : 'What did YOU personally do?', tr ? 'Analiz, kod, veri temizleme, model, yazım veya test katkını somut anlat.' : 'Specify your own analysis, coding, data cleaning, modelling, writing or testing.', 'contribution'),
                    React.createElement("label", { className: "guide-field" },
                        React.createElement("strong", null, tr ? 'AI kullandın mı?' : 'Did you use generative AI?'),
                        React.createElement("select", { value: learning.ai_use, onChange: e => changeLearning('ai_use', e.target.value) },
                            React.createElement("option", { value: "undisclosed" }, tr ? 'Seç — henüz açıklanmadı' : 'Choose — not declared yet'),
                            React.createElement("option", { value: "none" }, tr ? 'Hayır, bu araştırmada kullanmadım' : 'No generative AI used for this research'),
                            React.createElement("option", { value: "assisted" }, tr ? 'Evet, yardımcı olarak kullandım; bulguları kendim kontrol ettim' : 'Yes, as assistance; I independently checked claims'))),
                    React.createElement("div", { className: "guide-source-note" }, tr ? 'Alıntılarını ve iddialarını kaydetmek için Reports → Evidence ekranını kullan. Bir bağlantı eklemek doğrulamak anlamına gelmez.' : 'Use Reports → Evidence to link claims to documents. Adding a URL does not prove that the claim is true.'),
                    React.createElement(Button, { icon: "file", onClick: () => { setPage('Reports'); setReportTab('Evidence'); } }, tr ? 'Kaynakları ekle ve denetle' : 'Add and review sources')),
                React.createElement("div", { className: "guide-footnav" },
                    React.createElement(Button, { onClick: () => setStep(Math.max(0, step - 1)), disabled: step === 0 }, tr ? 'Geri' : 'Back'),
                    step < 4 ? React.createElement(Button, { variant: "primary", icon: "arrow", onClick: () => setStep(Math.min(4, step + 1)) }, tr ? 'Sonraki adım' : 'Next step') : React.createElement(Button, { variant: "primary", icon: "file", onClick: () => setPage('Reports') }, tr ? 'Raporunu düzenle' : 'Open report studio'))),
            React.createElement("aside", { className: "guide-side" },
                React.createElement("div", { className: "guide-side-head" },
                    React.createElement("span", { className: "eyebrow" }, L("RESEARCH QUALITY / NOT A GRADE")),
                    React.createElement("h3", null, tr ? 'Gerçek kalite kontrolü' : 'Evidence checklist'),
                    React.createElement("p", null, tr ? 'CV veya üniversite kabul puanı değil. Eksikleri bulmak için kontrol listesi.' : 'Not an admissions score. A checklist to help you see what is missing.')),
                React.createElement("details", { className: "coach-checklist" },
                    React.createElement("summary", null, tr ? '10 maddelik araştırma kontrol listesini gör' : 'Show the 10 research checks'),
                    React.createElement("div", { className: "guide-audit" }, readies.map(([label, ok]) => React.createElement("div", { key: label, className: ok ? 'passed' : 'missing' },
                        React.createElement(Icon, { name: ok ? 'check' : 'info', size: 16 }),
                        React.createElement("span", null, label))))),
                React.createElement("div", { className: "guide-side-actions" },
                    React.createElement(Button, { icon: "save", onClick: save, loading: busy === 'save', disabled: symbol === 'ALPHA' || !report.title.trim() || !report.thesis.trim() || !report.risks.trim() }, tr ? 'Taslağı sakla' : 'Save draft'),
                    React.createElement(Button, { variant: "primary", icon: "download", onClick: () => exportReport('pdf'), loading: busy === 'export', disabled: symbol === 'ALPHA' || !report.title.trim() || !report.thesis.trim() || !report.risks.trim() }, tr ? 'PDF taslağı al' : 'Export PDF draft')),
                React.createElement("p", { className: "guide-disclosure" }, tr ? 'Kaynakları ve hesaplamaları insan denetimiyle kontrol et. Tamamlanmış kontrol listesi doğrulanmış rapor anlamına gelmez.' : 'Review original filings yourself. Even a complete checklist is not independent verification.'))));
}
/* v0.14 Home: the core loop (run an analysis, write your view, publish) and the latest publications. */
const HOME_LOOP = [
    ['Run an analysis', 'Pick one of 30 questions. SEC filings and price history are loaded for you, and every figure keeps its source.', 'bars', 'fundamental'],
    ['Write your view', 'Add your thesis and the risks to it in your own words. Nothing can be published until both are written.', 'pen', 'valuation'],
    ['Publish', 'Turn the note into a LinkedIn post, a carousel, an image or a page on your public site.', 'send', 'quant']
];
// v0.13.5: the four analysis groups on the home page, each in its colour (as in the Analysis Lab picker)
const HOME_GROUP_SHAPE = { fundamental: 'bars', valuation: 'flow', risk: 'gauge', quant: 'wave' };
function HomeGroups({ setPage }) {
    const e = React.createElement;
    const [catalog, setCatalog] = useState(null);
    useEffect(() => { request(API + '/lab/catalog').then(d => setCatalog(d.analyses || [])).catch(() => setCatalog([])); }, []);
    if (!catalog || !catalog.length || typeof QE_LAB_GROUPS === 'undefined')
        return null;
    const open = (tab) => { window.QE_LAB_TAB = tab; setPage('Analysis Lab'); };
    const live = catalog.find(a => a.id === 'options_lab');
    return e('section', { className: 'home-groups', 'aria-labelledby': 'home-groups-title' },
        e('div', { className: 'home-groups-head' },
            e('h2', { id: 'home-groups-title' }, L('Explore the analyses')),
            e('button', { type: 'button', className: 'tiny-link', onClick: () => open('all') }, L('See all 30 analyses') + ' →')),
        live && e('button', { type: 'button', className: 'home-feature g-quant', onClick: () => setPage('Options') },
            e('span', { className: 'lab-icon home-feature-icon' }, qeLabGlyph('options_lab')),
            e('span', { className: 'home-feature-text' },
                e('span', { className: 'lab-badges' }, e('span', { className: 'lab-badge is-live' }, e('i', { 'aria-hidden': 'true' }), L('LIVE')), e('span', { className: 'lab-badge' }, L('Featured'))),
                e('strong', null, L('Live options lab')),
                e('span', null, L('Black–Scholes and Heston on live option chains, the volatility surface, a scenario grid, and the VIX recomputed with the Cboe method.'))),
            e(Icon, { name: 'arrow', size: 18 })),
        e('div', { className: 'home-group-grid' }, QE_LAB_GROUPS.map(([g, name]) => {
            const items = catalog.filter(a => a.group === g).sort((x, y) => x.number - y.number);
            return e('button', { key: g, type: 'button', className: 'home-group g-' + g, onClick: () => open(g) },
                e('span', { className: 'home-group-top' },
                    e('span', { className: 'lab-icon' }, qeLabShape(HOME_GROUP_SHAPE[g])),
                    e('span', { className: 'home-group-count' }, e('b', null, items.length), ' ' + L('analyses'))),
                e('strong', null, L(name)),
                e('span', { className: 'home-group-blurb' }, L(QE_LAB_GROUP_BLURB[g])),
                e('span', { className: 'home-group-examples' }, items.slice(0, 3).map(a => e('span', { key: a.id, className: 'lab-badge' }, L(a.title)))),
                e('span', { className: 'home-group-go' }, L('Open') + ' →'));
        })));
}
function HomeDesk({ setPage }) {
    const e = React.createElement;
    const [items, setItems] = useState(null);
    useEffect(() => { request(API + '/lab/publications').then(d => setItems(d.items || [])).catch(() => setItems([])); }, []);
    const recent = (items || []).slice(0, 5);
    return e('div', { className: 'home-desk' },
        e('section', { className: 'home-hero', 'aria-labelledby': 'home-title' },
            e('div', { className: 'home-hero-text' },
                e('h1', { id: 'home-title' }, L('Write and publish analyses you can defend.')),
                e('p', { className: 'home-lede' }, L('Each note starts from SEC filings and price history, puts your own view first, names the risks and lists its sources.')),
                e('div', { className: 'home-cta' },
                    e(Button, { variant: 'primary', icon: 'model', onClick: () => setPage('Analysis Lab') }, L('Start an analysis')),
                    e(Button, { icon: 'chart', onClick: () => setPage('Options') }, L('Live options lab')),
                    e(Button, { icon: 'globe', onClick: () => setPage('Public Site') }, L('Open my public site')))),
            e('ol', { className: 'home-loop', 'aria-label': L('How publishing works') }, HOME_LOOP.map(([title, copy, shape, g], i) => e('li', { key: title, className: 'g-' + g },
                e('span', { className: 'lab-icon home-step-icon', 'aria-hidden': 'true' }, typeof qeLabShape === 'function' ? qeLabShape(shape) : i + 1),
                e('div', null, e('span', { className: 'home-step-label' }, L('Step') + ' ' + (i + 1)), e('strong', null, L(title)), e('p', null, L(copy))))))),
        e(HookShell, { component: HomeGroups, setPage }),
        e('section', { className: 'panel home-pubs', 'aria-labelledby': 'home-pubs-title' },
            e('div', { className: 'home-pubs-head' },
                e('div', null,
                    e('h2', { id: 'home-pubs-title' }, L('Recent publications')),
                    items && items.length > 0 && e('span', { className: 'micro muted' }, items.length + ' ' + L(items.length === 1 ? 'analysis' : 'analyses') + ' ' + L('on your public site'))),
                items && items.length > 0 && e('button', { type: 'button', className: 'tiny-link', onClick: () => setPage('Public Site') }, L('Manage my site') + ' →')),
            items === null ? e('p', { className: 'micro muted' }, L('Loading…')) :
                !recent.length ? e('div', { className: 'home-empty' },
                    e('p', null, L('Nothing published yet. Your first note is one analysis and two short paragraphs away.')),
                    e(Button, { variant: 'primary', icon: 'model', onClick: () => setPage('Analysis Lab') }, L('Start an analysis'))) :
                    e('ul', { className: 'home-pub-list' }, recent.map(it => e('li', { key: it.id },
                        e('div', { className: 'home-pub-text' },
                            e('strong', null, it.title),
                            e('span', { className: 'home-pub-meta' },
                                (it.subjects || []).map(t => e('span', { key: t, className: 'ticker-tag' }, t)),
                                e('span', null, qeDate(it.asof)),
                                it.latest_review ? e('span', { className: 'verdict-chip ' + it.latest_review.verdict }, L((QE_VERDICTS.find(v => v[0] === it.latest_review.verdict) || [0, it.latest_review.verdict])[1])) : e('span', { className: 'verdict-chip site-unreviewed' }, L('Not reviewed yet')))),
                        e('a', { className: 'btn subtle', href: API + '/lab/site/preview/a/' + it.slug + '.html', target: '_blank', rel: 'noopener' }, e(Icon, { name: 'external', size: 15 }), ' ' + L('Preview')))))),
        e('nav', { className: 'home-more', 'aria-label': L('More tools') },
            [['LinkedIn', 'Write a LinkedIn post', 'From your own thesis and SEC figures.', 'send', 'fundamental'], ['Reports', 'Open Research Publisher', 'A longer report as a PDF or HTML draft.', 'book', 'valuation'], ['Guide', 'Open guided research journey', 'New to company research? Start here.', 'compass', 'risk']].map(([pg, title, copy, shape, g]) => e('button', { key: pg, type: 'button', className: 'home-more-link g-' + g, onClick: () => setPage(pg) },
                typeof qeLabShape === 'function' && e('span', { className: 'lab-icon' }, qeLabShape(shape)),
                e('span', { className: 'home-more-text' }, e('strong', null, L(title)), e('span', null, L(copy))), e(Icon, { name: 'arrow', size: 15 })))));
}
/* v0.13.5: keep the top bar from overlapping, whatever the label lengths (Turkish labels are
   longer than English). Step 1 hides the beta pill, avatar and density button; step 2 shows
   navigation icons only. Phones (<=860px) wrap the menu instead, so they skip this. */
function fitTopbar() {
    const bar = document.querySelector('.topbar');
    if (!bar)
        return;
    const steps = ['fit-1', 'fit-1b', 'fit-2', 'fit-3', 'fit-4'];
    steps.forEach(c => bar.classList.remove(c));
    if (window.innerWidth <= 860)
        return;
    const overlaps = () => {
        const nav = bar.querySelector('.nav'), actions = bar.querySelector('.top-actions');
        if (!nav || !actions || !nav.lastElementChild)
            return false;
        const first = nav.firstElementChild.getBoundingClientRect(), last = nav.lastElementChild.getBoundingClientRect(), act = actions.getBoundingClientRect();
        if (last.top > first.top + 4)
            return true; // the menu wraps onto another line
        return last.right > act.left - 12 && last.top < act.bottom; // beside the actions and running into them
    };
    for (const step of steps) {
        if (!overlaps())
            break;
        bar.classList.add(step);
    }
}
window.addEventListener('resize', () => window.requestAnimationFrame(fitTopbar));
// v0.13.5: a page can be named in the address (#options, #about): the static demo opens on the Options tab.
function qeInitialPage() {
    const h = (window.location.hash || '').replace(/^#/, '').toLowerCase().replace(/[-_]+/g, ' ');
    const hit = QE_NAV.find(([label]) => label.toLowerCase() === h);
    return hit ? hit[0] : 'Home';
}
function App() {
    const [page, setPage] = useState(qeInitialPage());
    // v0.13.5: one interface language for every page (see ui_i18n.js).
    const [lang, setLangState] = useState(QE_LANG);
    QE_LANG = lang; // set before children render so L() and page components agree
    function setLang(next) {
        if (QE_LANGS.indexOf(next) < 0)
            return;
        try {
            window.localStorage.setItem('qe.lang', next);
        }
        catch (_) { }
        try {
            document.documentElement.lang = next;
        }
        catch (_) { }
        setLangState(next);
    }
    const [appVersion, setAppVersion] = useState('');
    // Empty on purpose: a pre-filled ticker looked selected while the demo was still active.
    const [inputTicker, setInputTicker] = useState('');
    const [symbol, setSymbol] = useState('ALPHA');
    const [financial, setFinancial] = useState(null);
    const [contactEmail, setContactEmail] = useState('');
    const [busy, setBusy] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [library, setLibrary] = useState([]);
    const [opened, setOpened] = useState(null);
    const [report, setReport] = useState({ title: '', author: '', thesis: '', risks: '', catalysts: '', notes: '', evidence: [] });
    const [reportTab, setReportTab] = useState('Thesis');
    const emptyLearning = { business: '', financial_insight: '', research_method: '', contribution: '', ai_use: 'undisclosed' };
    const [learning, setLearning] = useState(emptyLearning);
    const [reportTemplate, setReportTemplate] = useState('institutional');
    const [peerTicker, setPeerTicker] = useState('AMD');
    // v0.13.5: any SEC company. Suggestions come from the cached SEC ticker directory.
    const [companyHits, setCompanyHits] = useState([]);
    const [directoryInfo, setDirectoryInfo] = useState(null);
    const searchEpoch = useMemo(() => ({ current: 0 }), []);
    function searchCompanies(q) {
        const id = ++searchEpoch.current;
        request(API + '/companies?q=' + encodeURIComponent(String(q || '').trim().slice(0, 60))).then(d => {
            if (id !== searchEpoch.current)
                return;
            setCompanyHits(d.results || []);
            setDirectoryInfo(d);
        }).catch(() => { });
    }
    function downloadDirectory() {
        run('directory', async () => {
            const d = await post(API + '/companies/directory', { contact_email: contactEmail.trim() });
            setDirectoryInfo(d);
            setSuccess(L('SEC company list downloaded') + ' · ' + fmt(d.companies, 0) + ' ' + L('companies'));
            searchCompanies(inputTicker);
        });
    }
    const [compact, setCompact] = useState(true);
    const [readme, setReadme] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);
    const [commandQuery, setCommandQuery] = useState('');
    const requestEpoch = useMemo(() => ({ current: 0 }), []);
    const commands = useMemo(() => makeCommandIndex(symbol), [symbol, lang]);
    useEffect(() => {
        const handler = e => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setCommandOpen(v => !v);
                setCommandQuery('');
            }
            if (e.key === 'Escape')
                setCommandOpen(false);
            if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= String(QE_NAV.length) && !e.altKey) {
                e.preventDefault();
                setPage(QE_NAV[Number(e.key) - 1][0]);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);
    useEffect(() => { request(API + '/config').then(c => setAppVersion(c.version || '')).catch(() => { }); }, []);
    useEffect(() => { window.scrollTo(0, 0); }, [page]);
    useEffect(() => { searchCompanies(inputTicker); }, [inputTicker]);
    useEffect(() => { searchCompanies(peerTicker); }, [peerTicker]);
    useEffect(() => { fitTopbar(); }); // every render: language and page change label widths
    useEffect(() => { if (page === 'Library')
        refreshLibrary(); }, [page]);
    function clear() { setError(''); setSuccess(''); }
    async function run(key, fn) { const epoch = requestEpoch.current; clear(); setBusy(key); try {
        await fn();
    }
    catch (e) {
        if (requestEpoch.current === epoch)
            setError(e.message || String(e));
    }
    finally {
        if (requestEpoch.current === epoch)
            setBusy('');
    } }
    async function refreshLibrary() { try {
        let a = await request(API + '/library');
        setLibrary(a.items || []);
    }
    catch (e) {
        setError(e.message);
    } }
    function switchTicker(next) {
        const clean = String(next || '').trim().toUpperCase();
        if (!validTicker(clean)) {
            setError(L('Enter a valid ticker, e.g. NVDA.'));
            return false;
        }
        if (clean === symbol) {
            setInputTicker(clean);
            setCommandOpen(false);
            clear();
            return true;
        }
        ++requestEpoch.current; // previous requests may resolve but may not change the newly selected company
        setInputTicker(clean);
        setSymbol(clean);
        setFinancial(null);
        setReport(r => ({ title: clean + ' — Company Research', author: r.author, thesis: '', risks: '', catalysts: '', notes: '', evidence: [] }));
        setLearning(emptyLearning);
        clear();
        setCommandOpen(false);
        return true;
    }
    function selectTicker() { switchTicker(inputTicker); }
    function loadCompany() {
        const epoch = requestEpoch.current;
        const target = symbol === 'ALPHA' ? inputTicker.trim().toUpperCase() : symbol;
        if (!validTicker(target)) {
            setError(L('Select a valid company ticker first.'));
            return;
        }
        run('company', async () => {
            const d = await post(API + '/company', { ticker: target, contact_email: contactEmail.trim() });
            if (requestEpoch.current !== epoch)
                return;
            if (d.ticker !== symbol) {
                ++requestEpoch.current;
                setReport(r => ({ ...r, title: d.company + ' — Company Research', thesis: '', risks: '', catalysts: '', notes: '', evidence: [] }));
                setLearning(emptyLearning);
            }
            setFinancial(d);
            setSymbol(d.ticker);
            setInputTicker(d.ticker);
            setReport(r => ({ ...r, title: r.title || d.company + ' — Equity Research' }));
            setSuccess(L('SEC financial history loaded; see company fiscal-year ending date and source audit.'));
        });
    }
    function fullReport() {
        return { business_model: learning.business, financial_interpretation: learning.financial_insight,
            research_method: learning.research_method, personal_contribution: learning.contribution, ai_use: learning.ai_use,
            ticker: symbol === 'ALPHA' ? 'ALPHA' : symbol, company: financial?.company || symbol,
            title: report.title || symbol + ' — Research Draft', author: report.author, thesis: report.thesis, risks: report.risks,
            catalysts: report.catalysts, notes: report.notes, cutoff: financial?.cutoff || TODAY, has_sec: !!financial,
            history: financial?.history || [], sources: financial?.sources || [], evidence: report.evidence || [], template: reportTemplate };
    }
    async function exportReport(kind) { await run('export', async () => { const blob = await post(API + '/report/' + kind, fullReport()); const url = URL.createObjectURL(blob); const el = document.createElement('a'); el.href = url; el.download = `QuantEdge_${symbol}_${reportTemplate}_DRAFT.${kind}`; document.body.appendChild(el); el.click(); el.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000); setSuccess(kind.toUpperCase() + ' ' + L('draft saved to Downloads (unpublished). Verify all sources before sharing.')); }); }
    async function save() { await run('save', async () => { const result = await post(API + '/report/save', fullReport()); setSuccess(L('Draft saved to this computer’s research library') + ' (' + result.id.slice(0, 8) + '…).'); }); }
    function executeCommand(cmd) {
        setCommandOpen(false);
        setCommandQuery('');
        if (cmd.id.startsWith('page:')) {
            setPage(cmd.id.slice(5));
            clear();
            return;
        }
        if (cmd.id.startsWith('ticker:')) {
            switchTicker(cmd.id.slice(7));
            return;
        }
        if (cmd.id === 'tool:company') {
            loadCompany();
            return;
        }
        if (cmd.id === 'tool:save') {
            save();
            return;
        }
    }
    const latest = financial?.history?.[financial.history.length - 1];
    return React.createElement("div", { className: 'app-shell ' + (compact ? 'is-compact' : '') },
        React.createElement("div", { className: "topbar" },
            React.createElement("div", { className: "brandsection" },
                React.createElement(Logo, null),
                React.createElement("div", { className: "nav", role: "tablist", "aria-label": L("Main navigation") },
                    QE_NAV.map(([label, ic]) => React.createElement("button", { role: "tab", "aria-selected": page === label, key: label, title: L(label), "aria-describedby": label === 'Options' && typeof QeOptMarketBadge === 'function' ? 'qe-opt-market-desc' : undefined, className: (page === label ? 'selected' : '') + (label === 'Options' ? ' nav-options' : ''), onClick: () => { setPage(label); clear(); } },
                        React.createElement(Icon, { name: ic, size: 16 }),
                        React.createElement("span", null, L(label)),
                        // the options tab says whether the US market is live: LIVE with a pulsing dot in the session, CLOSED outside it
                        label === 'Options' && typeof QeOptMarketBadge === 'function' && React.createElement(QeOptMarketBadge, null))))),
            React.createElement("div", { className: "top-actions" },
                React.createElement("div", { className: "lang-switch", role: "group", "aria-label": L("Interface language") }, QE_LANGS.map(code => React.createElement("button", { key: code, type: "button", lang: code, "aria-pressed": lang === code, className: lang === code ? 'is-selected' : '', onClick: () => setLang(code) }, code.toUpperCase()))),
                React.createElement("button", { className: "global-search", "aria-label": L("Open quick commands"), title: L("Search commands (Command K)"), onClick: () => { setCommandOpen(true); setCommandQuery(''); } },
                    React.createElement(Icon, { name: "search", size: 16 }),
                    React.createElement("span", null, L("Search actions")),
                    React.createElement("kbd", null, "\u2318 K")),
                React.createElement(HookShell, { component: ThemeSwitch }),
                React.createElement("button", { className: "icon-button", title: L("About data integrity"), "aria-label": L("About data integrity"), "aria-expanded": readme, onClick: () => setReadme(!readme) },
                    React.createElement(Icon, { name: "info" })))),
        React.createElement("datalist", { id: "qe-companies" }, companyHits.map(h => React.createElement("option", { key: h.ticker, value: h.ticker }, h.name))),
        commandOpen && React.createElement(CommandPalette, { query: commandQuery, setQuery: setCommandQuery, close: () => setCommandOpen(false), commands: commands, onExecute: executeCommand }),
        readme && React.createElement("div", { className: "privacy-banner" },
            React.createElement("strong", null, L("QuantEdge is running locally.")),
            " " + L("SEC figures and price history are downloaded only when you ask, and are not reconciled to the original filings. The Options tab loads a ticker (AAPL unless you type another) as soon as it opens: the current stock quote and option quotes delayed about 15 minutes. Saved drafts stay on this computer until you publish them yourself.") + " ",
            React.createElement("button", { onClick: () => setReadme(false) },
                React.createElement(Icon, { name: "close", size: 15 }))),
        React.createElement("main", { className: "workspace" },
            React.createElement(PageBand, { page: page, setPage: setPage }),
            page !== 'Home' && page !== 'Library' && page !== 'Guide' && page !== 'Analysis Lab' && page !== 'Options' && page !== 'Public Site' && page !== 'About' && React.createElement("div", { className: "commandbar" },
                React.createElement("div", { className: "ticker-group" },
                    React.createElement("label", null, L("COMPANY / TICKER")),
                    React.createElement("div", { className: "ticker-entry" },
                        React.createElement(Icon, { name: "search", size: 17 }),
                        React.createElement("input", { list: "qe-companies", autoComplete: "off", value: inputTicker, onChange: e => setInputTicker(e.target.value.toUpperCase()), onKeyDown: e => { if (e.key === 'Enter')
                                selectTicker(); }, maxLength: 12, placeholder: L("e.g. NVDA") }),
                        React.createElement("button", { onClick: selectTicker, className: "tiny-link" },
                            L("Select") + " ",
                            React.createElement(Icon, { name: "arrow", size: 14 })))),
                React.createElement("div", { className: "ribbon-divider" }),
                React.createElement("div", { className: "symbol-status" },
                    React.createElement("small", null, L("ACTIVE RESEARCH CONTEXT")),
                    React.createElement("strong", null, symbol === 'ALPHA' ? L('No company selected yet') : symbol),
                    React.createElement("span", null, inputTicker && inputTicker !== symbol && validTicker(inputTicker) ? inputTicker + ' ' + L('not selected yet — press Select or Enter') : financial ? L('SEC facts loaded · FY') + ' ' + financial.fiscal_end : symbol === 'ALPHA' ? L('Type a ticker and press Select') : L('Data not loaded for this company'))),
                React.createElement("div", { className: "ribbon-divider" }),
                React.createElement("div", { className: "control-actions" },
                    React.createElement(Button, { onClick: loadCompany, loading: busy === 'company', icon: "company" }, L("Load SEC data")),
                    React.createElement(Button, { variant: "primary", icon: "file", onClick: () => setPage('Reports') }, L("Create report")))),
            page !== 'Home' && page !== 'Library' && page !== 'Guide' && page !== 'Analysis Lab' && page !== 'Options' && page !== 'Public Site' && page !== 'About' && !financial && !window.QE_DEMO && React.createElement("div", { className: "sec-contact" },
                React.createElement("span", null,
                    React.createElement(Icon, { name: "shield", size: 15 }),
                    " " + L("SEC identifies automated requests; enter your contact email once before the first SEC download. Not stored in the app.")),
                React.createElement("input", { value: contactEmail, onChange: e => setContactEmail(e.target.value), placeholder: L("Your contact email for SEC (e.g. research@example.com)"), type: "email", "aria-label": L("SEC contact email") }),
                directoryInfo && !directoryInfo.downloaded && React.createElement("div", { className: "directory-hint" },
                    React.createElement("span", null, L("6 featured companies are ready. Download the free SEC list to search 10,000+ US companies.")),
                    React.createElement(Button, { onClick: downloadDirectory, loading: busy === 'directory', disabled: !contactEmail.includes('@'), icon: "download" }, L("Download company list")))),
            (error || success) && React.createElement("div", { className: 'alert ' + (error ? 'bad' : 'good'), role: "status" },
                React.createElement(Icon, { name: error ? 'info' : 'check', size: 16 }),
                React.createElement("span", null, error || success),
                React.createElement("button", { onClick: clear, "aria-label": L("Dismiss") },
                    React.createElement(Icon, { name: "close", size: 15 }))),
            page === 'Home' && React.createElement(HookShell, { component: HomeDesk, setPage: setPage }),
            page === 'Home' && React.createElement("section", { className: "home-intro", "aria-label": L("New to company research?") },
                React.createElement("div", { className: "home-intro-head" },
                    React.createElement("h2", null, L("New to company research?")),
                    React.createElement("p", null, L("The guided path explains a company and its numbers step by step before you write."))),
                React.createElement(HookShell, { component: LandingPage, onNavigate: setPage, selectCompany: switchTicker, searchCompanies: searchCompanies })),
            page === 'Guide' && React.createElement(HookShell, { component: GuidedAnalyst, setLang: setLang, symbol: symbol, inputTicker: inputTicker, setInputTicker: setInputTicker, switchTicker: switchTicker, financial: financial, latest: latest, report: report, setReport: setReport, learning: learning, setLearning: setLearning, busy: busy, loadCompany: loadCompany, contactEmail: contactEmail, setContactEmail: setContactEmail, setPage: setPage, setReportTab: setReportTab, save: save, exportReport: exportReport }),
            page === 'LinkedIn' && React.createElement(HookShell, { component: LinkedInResearchComposer, symbol:symbol, financial:financial, report:report, setReport:setReport, loadCompany:loadCompany, busy:busy, setPage:setPage, peerTicker:peerTicker, setPeerTicker:setPeerTicker, contactEmail:contactEmail }),
            page === 'Analysis Lab' && React.createElement(HookShell, { component: AnalysisLab, contactEmail: contactEmail, setContactEmail: setContactEmail, report: report, setReport: setReport, setPage: setPage }),
            // the live options lab on its own tab: the same desk, research note and publishing steps as analysis #30
            page === 'Options' && React.createElement(HookShell, { key: 'options-page', component: AnalysisLab, focus: 'options_lab', contactEmail: contactEmail, setContactEmail: setContactEmail, report: report, setReport: setReport, setPage: setPage }),
            page === 'Public Site' && React.createElement(HookShell, { component: PublicSite, report: report, setReport: setReport, setPage: setPage }),
            page === 'About' && typeof AboutPage === 'function' && React.createElement(AboutPage, { setPage: setPage }),
            page === 'Reports' && React.createElement("div", { className: "report-layout" },
                React.createElement("section", { className: "panel report-composer" },
                    React.createElement("div", { className: "panel-head" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "eyebrow" }, L("INDEPENDENT RESEARCH / EDITORIAL STUDIO")),
                            React.createElement("h2", null, L("Make your research worth reading."))),
                        React.createElement(Chip, { mode: "amber" }, L("DRAFT \u00B7 PRIVATE"))),
                    React.createElement("div", { className: "report-template-picker", role: "group", "aria-label": L("Report visual style") },
                        React.createElement("div", { className: "report-template-head" },
                            React.createElement("span", null, L("REPORT DESIGN")),
                            React.createElement("small", null, L("Same research, three different publication layouts. All remain private drafts."))),
                        React.createElement("div", { className: "report-template-grid" }, [
                            ['institutional', 'Institutional Research', 'Evidence-first research desk'],
                            ['editorial', 'Editorial Analysis', 'Premium long-form analysis'],
                            ['brief', 'Executive Brief', 'Condensed decision memo']
                        ].map(([id, name, description]) => React.createElement("button", { key: id, type: "button", "aria-pressed": reportTemplate === id, className: 'report-template-choice ' + (reportTemplate === id ? 'selected' : ''), onClick: () => setReportTemplate(id) },
                            React.createElement("strong", null, L(name)),
                            React.createElement("small", null, L(description)),
                            React.createElement("span", { className: "report-template-checked" }, reportTemplate === id ? L('● SELECTED') : L('○ SELECT STYLE')))))),
                    React.createElement("div", { className: "report-tabs" }, ['Thesis', 'Risks', 'Catalysts', 'Notes', 'Evidence', 'Review'].map(x => React.createElement("button", { key: x, onClick: () => setReportTab(x), className: x === reportTab ? 'active' : '' }, L(x)))),
                    React.createElement("div", { className: "report-headfields" },
                        React.createElement("label", { className: "form-label" },
                            L("Report title"),
                            React.createElement("input", { value: report.title, onChange: e => setReport({ ...report, title: e.target.value }), placeholder: L("e.g. NVIDIA \u2014 Business Quality & Risks") })),
                        React.createElement("label", { className: "form-label" },
                            L("Author"),
                            React.createElement("input", { value: report.author, onChange: e => setReport({ ...report, author: e.target.value }), placeholder: L("Your name or research desk") }))),
                    React.createElement("div", { className: "editor-label" },
                        React.createElement("div", null,
                            React.createElement("h3", null, ({ Thesis: L('What is your investment thesis?'), Risks: L('What could invalidate it?'), Catalysts: L('What could change the outlook?'), Notes: L('Your working notes & evidence'), Evidence: L('Which documents support your claims?'), Review: L('What needs human verification before sharing?') })[reportTab]),
                            React.createElement("p", null, ({ Thesis: L('Start with one clear, testable claim—not a recommendation.'), Risks: L('State the strongest counterargument and what would prove you wrong.'), Catalysts: L('Explain possible developments, separating scenarios from observed facts.'), Notes: L('Capture sources, questions and figures to verify before distribution.'), Evidence: L('Map each important claim to a source. Citations are analyst-entered, not auto-verified.'), Review: L('Run a structured preflight review. This does not certify facts or approve publication.') })[reportTab])),
                        React.createElement(Chip, null, L("AUTHOR WRITTEN"))),
                    reportTab === 'Evidence' ? React.createElement(HookShell, { component: EvidenceDesk, report: report, setReport: setReport }) : reportTab === 'Review' ? React.createElement(HookShell, { component: EditorialPreflight, report: report, financial: financial }) : React.createElement(Group, null,
                        React.createElement("textarea", { className: "research-textarea", value: report[reportTab.toLowerCase()], onChange: e => setReport({ ...report, [reportTab.toLowerCase()]: e.target.value }), placeholder: ({ Thesis: L('I am examining whether the company can sustain its growth, given...'), Risks: L('Key risks include...'), Catalysts: L('Potential catalysts include...'), Notes: L('SEC 10-K accession, questions, research notes...') })[reportTab] }),
                        React.createElement("div", { className: "editor-bottom" },
                            React.createElement("span", null,
                                report[reportTab.toLowerCase()].length,
                                L(" characters")),
                            React.createElement("span", null,
                                L("Historical financial evidence: "),
                                financial ? L('SEC loaded') : L('not attached')))),
                    React.createElement(ReviewChecklist, { report: report, financial: financial }),
                    React.createElement("div", { className: "publisher-actions" },
                        React.createElement(Button, { onClick: save, icon: "save", loading: busy === 'save' }, L("Save to Library")),
                        React.createElement(Button, { onClick: () => exportReport('html'), icon: "download", loading: busy === 'export' }, L("Download HTML")),
                        React.createElement(Button, { variant: "primary", onClick: () => exportReport('pdf'), icon: "download", loading: busy === 'export' }, L("Export PDF"))),
                    React.createElement("div", { className: "report-footer" },
                        React.createElement(Icon, { name: "shield", size: 17 }),
                        React.createElement("span", null, L("Exports are unpublished drafts. No automated AI claims, unverified target prices or fictional company data are inserted.")))),
                React.createElement("section", { className: "panel preview-panel" },
                    React.createElement("div", { className: "panel-head" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "eyebrow" }, L("LIVE PREVIEW")),
                            React.createElement("h2", null, ({ institutional: L("Institutional Research"), editorial: L("Editorial Analysis"), brief: L("Executive Brief") })[reportTemplate])),
                        React.createElement(Icon, { name: "file" })),
                    React.createElement("div", { className: "paper-preview report-preview-" + reportTemplate },
                        React.createElement("div", { className: "paper-top" },
                            React.createElement(Logo, null),
                            React.createElement("span", null, L("DRAFT"))),
                        React.createElement("div", { className: "paper-kicker" }, ({ institutional: L("EVIDENCE-LED EQUITY RESEARCH"), editorial: L("THE LONG VIEW / COMPANY INTELLIGENCE"), brief: L("EXECUTIVE BRIEF") })[reportTemplate]),
                        React.createElement("h2", null, report.title || (symbol === 'ALPHA' ? L('Company name — Research Report') : symbol + L(' — Research Report'))),
                        React.createElement("div", { className: "paper-symbol" },
                            symbol === 'ALPHA' ? L('No company selected yet') : (financial?.company && financial.company !== symbol ? financial.company + ' \u00B7 ' : '') + symbol,
                            " \u00B7 ",
                            qeDate(TODAY),
                            report.author ? ' \u00B7 ' + L('Prepared by') + ' ' + report.author : ''),
                        React.createElement("hr", null),
                        React.createElement("div", { className: "paper-section" }, L("Thesis")),
                        React.createElement("p", null, report.thesis || L('Your research thesis will appear here as you type. Start with a clear claim and support it with sources.')),
                        React.createElement("div", { className: "paper-section" }, L("Table") + ' 1 \u00B7 ' + L("Financial snapshot")),
                        financial ? React.createElement("div", { className: "paper-facts" },
                            React.createElement("span", null,
                                L("Revenue "),
                                React.createElement("b", null, billion(latest?.revenue_m))),
                            React.createElement("span", null,
                                L("Net income "),
                                React.createElement("b", null, billion(latest?.net_income_m)))) : React.createElement("div", { className: "paper-placeholder" }, L("Financial data not attached \u2014 no figures invented.")),
                        React.createElement("div", { className: "paper-section" }, L("Risks to the view")),
                        React.createElement("p", null, report.risks || L('State the most important risks to your thesis.')),
                        React.createElement("div", { className: "paper-section" }, L("Sources")),
                        React.createElement("p", null,
                            (report.evidence || []).length,
                            L(" analyst-entered sources. These links have not been independently verified.")),
                        React.createElement("div", { className: "paper-note" }, L("DRAFT \u00B7 HUMAN REVIEW REQUIRED"))),
                    React.createElement("p", { className: "micro muted" },
                        L("Preview: "),
                        ({ institutional: L("Institutional Research"), editorial: L("Editorial Analysis"), brief: L("Executive Brief") })[reportTemplate],
                        L(". PDF and HTML use this same visual theme, with full source and disclosure sections. Draft only.")))),
            page === 'Library' && React.createElement("div", { className: "library-grid" },
                React.createElement("section", { className: "panel" },
                    React.createElement("div", { className: "panel-head" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "eyebrow" }, L("LOCAL RESEARCH ARCHIVE")),
                            React.createElement("h2", null, L("Your saved analyses"))),
                        React.createElement(Button, { icon: "refresh", onClick: refreshLibrary }, L("Refresh"))),
                    library.length > 0 && React.createElement("div", { className: "portfolio-export" },
                        React.createElement("div", null,
                            React.createElement("strong", null, L("Research portfolio page")),
                            React.createElement("small", null, L("All saved analyses and your verdicts on one shareable page. A single HTML file that works offline; add it to your CV or LinkedIn Featured section."))),
                        React.createElement("a", { className: "btn primary", href: API + '/portfolio.html?lang=' + lang + '&author=' + encodeURIComponent(report.author || ''), download: "QuantEdge_Research_Portfolio.html" },
                            React.createElement(Icon, { name: "download", size: 16 }), " " + L("Download portfolio page"))),
                    library.length ? library.map(r => React.createElement("button", { className: 'saved-card ' + (opened?.id === r.id ? 'active' : ''), key: r.id, onClick: () => run('open', async () => setOpened(await request(API + '/library/' + r.id))) },
                        React.createElement("span", null,
                            React.createElement("strong", null, r.title),
                            React.createElement("small", null,
                                r.symbol,
                                r.cutoff ? " \u00B7 " + L("Data") + ": " + qeDate(r.cutoff) : '',
                                r.created_utc ? " \u00B7 " + L("Saved") + ": " + qeDate(r.created_utc) : ''),
                            r.latest_review && React.createElement("span", { className: 'verdict-chip ' + r.latest_review.verdict }, L((QE_VERDICTS.find(v => v[0] === r.latest_review.verdict) || [0, r.latest_review.verdict])[1]))),
                        React.createElement(Icon, { name: "arrow", size: 17 }))) : React.createElement(Blank, { title: L("No research saved yet"), copy: L("Draft a report under Research Publisher, then save it locally. This is a private single-user archive, not cloud storage.") },
                        React.createElement(Button, { variant: "primary", icon: "file", onClick: () => setPage('Reports') }, L("Create first report")))),
                React.createElement("section", { className: "panel library-preview" },
                    React.createElement("div", { className: "panel-head" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "eyebrow" }, L("SAVED SNAPSHOT")),
                            React.createElement("h2", null, opened?.title || L('Select an analysis')))),
                    opened ? React.createElement(Group, null,
                        React.createElement("div", { className: "library-markdown" },
                            React.createElement("pre", null, opened.body_markdown)),
                        React.createElement(Notice, null, L("Saved drafts are snapshots and do not auto-update when market or SEC data changes.")),
                        React.createElement(HookShell, { key: opened.id, component: ThesisCheck, record: opened, contactEmail: contactEmail, onReviewed: reviews => { setOpened({ ...opened, reviews }); refreshLibrary(); } })) : React.createElement(Blank, { title: L("Build a research history"), copy: L("Your finished projects will be searchable here. Click a saved report to read the exact draft that was stored.") }))),
            React.createElement("div", { className: "app-footer" },
                React.createElement("span", null,
                    React.createElement("span", { className: "footdot" }),
                    L(" Local-only \u00B7 Private research prototype \u00B7 No trading") + (appVersion ? ' \u00B7 v' + appVersion : '')),
                React.createElement("span", null, L("Every figure shows its source: SEC filing, price history or your own assumption.")))),
        // Offline help assistant (help_bot.js); the app works the same without it.
        typeof QEHelpBot === 'function' && React.createElement(HookShell, { component: QEHelpBot, page: page, setPage: setPage, lang: QE_LANG }));
}
ReactDOM.render(React.createElement(HookShell, { component: App }), document.getElementById('root'));

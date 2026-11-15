/* QuantEdge v0.13.5 — the short "new to company research?" panel under Home.
   Language comes from the app-wide QE_LANG. Local-only; no network calls of its own. */
const LANDING_WORDS = {
  tr: {
    tickerLabel:'Hisse kodu', tickerPlaceholder:'NVDA, AAPL, MSFT…', start:'Rehberle başla',
    quick:'Örnek şirketler:', learn:'Önce finansı öğren', openLibrary:'Kayıtlı araştırmalarım',
    invalid:'Lütfen NVDA veya AAPL gibi geçerli bir hisse kodu yaz.'
  },
  en: {
    tickerLabel:'Ticker', tickerPlaceholder:'NVDA, AAPL, MSFT…', start:'Start the guide',
    quick:'Example companies:', learn:'Learn finance first', openLibrary:'My saved research',
    invalid:'Enter a valid ticker such as NVDA or AAPL.'
  },
  es: {
    tickerLabel:'Símbolo bursátil', tickerPlaceholder:'NVDA, AAPL, MSFT…', start:'Empezar la guía',
    quick:'Empresas de ejemplo:', learn:'Aprender finanzas primero', openLibrary:'Mis análisis guardados',
    invalid:'Introduce un símbolo válido, como NVDA o AAPL.'
  }
};
function LandingPage({onNavigate, selectCompany, searchCompanies}) {
  const c = LANDING_WORDS[QE_LANG] || LANDING_WORDS.en;
  // Starts empty so nothing looks selected before the user picks a company.
  const [ticker,setTicker] = useState('');
  const [warning,setWarning] = useState('');
  function start() {
    const cleaned = ticker.trim().toUpperCase();
    if (!/^[A-Z][A-Z0-9.\-]{0,11}$/.test(cleaned)) {setWarning(c.invalid);return;}
    setWarning('');
    if(selectCompany(cleaned)) onNavigate('Guide');
  }
  const e = React.createElement;
  return e('div',{className:'landing-root','data-landing':'true'},
    e('form',{className:'landing-company-form',onSubmit:ev=>{ev.preventDefault();start();}},
      e('label',{htmlFor:'landing-company-input'},c.tickerLabel),
      e('div',{className:'landing-form-row'},
        e('input',{id:'landing-company-input',type:'text',list:'qe-companies',value:ticker,onChange:ev=>{setTicker(ev.target.value.toUpperCase());setWarning('');if(searchCompanies)searchCompanies(ev.target.value);},placeholder:c.tickerPlaceholder,autoComplete:'off',maxLength:12,spellCheck:false,'aria-invalid':!!warning,'aria-describedby':warning?'landing-company-error':undefined}),
        e('button',{type:'submit',className:'btn primary'},c.start)),
      warning && e('p',{id:'landing-company-error',className:'landing-input-error',role:'alert'},warning),
      e('div',{className:'landing-ticker-suggest'},e('span',null,c.quick),...['NVDA','AAPL','MSFT','KO'].map(t=>e('button',{key:t,type:'button',onClick:()=>{setTicker(t);setWarning('');},'aria-pressed':ticker===t},t)))),
    e('div',{className:'landing-secondary-actions'},
      e('button',{type:'button',className:'tiny-link',onClick:()=>onNavigate('Guide')},c.learn+' →'),
      e('button',{type:'button',className:'tiny-link',onClick:()=>onNavigate('Library')},c.openLibrary+' →')));
}

/* v0.13.5: local draft shelf. No network, credentials or financial data cache. */
const QEDraftShelf = {
  key: 'quantedge.linkedin.drafts.v1',
  read(storage) {
    try {
      const rows = JSON.parse(storage.getItem(this.key) || '[]');
      return Array.isArray(rows) ? rows.filter(x => x && typeof x.id==='string' && typeof x.symbol==='string' && typeof x.text==='string').slice(0,20) : [];
    } catch (_) { return []; }
  },
  save(storage, draft) {
    const rows = [draft, ...this.read(storage).filter(x=>x.id!==draft.id)].slice(0,20);
    storage.setItem(this.key, JSON.stringify(rows));
    return rows;
  }
};
/* QuantEdge v0.13.5 / free, source-labelled social publishing */
function LinkedInResearchComposer({symbol, financial, report, setReport, loadCompany, busy, setPage, peerTicker='', setPeerTicker=()=>{}, contactEmail=''}) {
  const [language,setLanguage] = useState(()=>QE_LANG);
  const [style,setStyle] = useState('snapshot');
  const [output,setOutput] = useState(null);
  const [working,setWorking] = useState(false);
  const [error,setError] = useState('');
  const [copied,setCopied] = useState(false);
  const [drafts,setDrafts] = useState(()=>{try{return QEDraftShelf.read(localStorage);}catch(_){return [];}});
  const [shelfMessage,setShelfMessage] = useState('');
  function saveDraft() {
    if(!output?.text)return;
    try {
      const draft={id:Date.now().toString(36),symbol,text:output.text,output,language,style,
        thesis:report.thesis||'',risks:report.risks||'',savedAt:new Date().toISOString()};
      setDrafts(QEDraftShelf.save(localStorage,draft));setShelfMessage(L('Saved on this browser.'));
    }catch(_){setShelfMessage(L('Browser storage unavailable or full. Download .txt to keep this draft.'));}
  }
  function restoreDraft(draft) {
    generationEpoch.current++; setWorking(false);
    setLanguage(draft.language||QE_LANG);setStyle(draft.style||'snapshot');
    setReport({...report,thesis:draft.thesis||'',risks:draft.risks||''});
    setOutput(null);setShelfMessage(L('Saved text restored below. Original data may be stale; verify sources before posting.'));
    setRestored(draft);
  }
  const [restored,setRestored]=useState(null);
  // v0.13.5: PNG card for the post, drawn locally from the loaded SEC figures
  const cardUrl=useMemo(()=>{
    if(!financial||!output||style==='compare'||typeof qeDrawShareCard!=='function')return '';
    try{const cv=document.createElement('canvas');qeDrawShareCard(cv,qeCardData(financial,language,report.author));return cv.toDataURL('image/png');}
    catch(_){return '';}
  },[financial,output,language,report.author,style]);
  // v0.13.5: live overclaim hints (wording only; posting is never blocked)
  const [claimFlags,setClaimFlags]=useState([]);
  const claimEpoch=useMemo(()=>({current:0}),[]);
  useEffect(()=>{
    const id=++claimEpoch.current, text=(report.thesis||'')+'\n'+(report.risks||'');
    if(!text.trim()){setClaimFlags([]);return;}
    post(API+'/research/claim-check',{text,language}).then(d=>{if(id===claimEpoch.current)setClaimFlags(d.flags||[]);}).catch(()=>{});
  },[report.thesis,report.risks,language]);
  const generationEpoch=useMemo(()=>({current:0}),[]);
  useEffect(() => { generationEpoch.current++;setOutput(null); setError(''); setCopied(false); },[symbol,report.thesis,report.risks,language,style,peerTicker]);
  async function compose() {
    const epoch=++generationEpoch.current;
    setWorking(true);setError('');setCopied(false);setOutput(null);
    try {
      const d=await post(API+'/research/linkedin',{
        ticker:symbol,thesis:(report.thesis||'').trim(),risks:(report.risks||'').trim(),
        author:report.author||'',language,style,
        ...(style==='compare'?{peer:peerTicker,contact_email:contactEmail}:{})
      });
      if(epoch===generationEpoch.current)setOutput(d);
    } catch(e) {if(epoch===generationEpoch.current)setError(e.message||String(e));}
    finally {if(epoch===generationEpoch.current)setWorking(false);}
  }
  async function copy() {
    if (!output?.text) return;
    try {await navigator.clipboard.writeText(output.text);setCopied(true);setError('');}
    catch(e) { setError(L('Automatic copying is blocked in this browser. Select the text below and copy with Command+C.')); }
  }
  function download() {
    if(!output?.text)return;
    const a=document.createElement('a'), url=URL.createObjectURL(new Blob([output.text],{type:'text/plain;charset=utf-8'}));
    a.href=url;a.download='QuantEdge_'+symbol+'_LinkedIn_DRAFT.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  const e=React.createElement;
  return e('div',{className:'social-layout'},
    e('section',{className:'panel social-compose'},
      e('details',{className:'panel social-drafts'},
        e('summary',null,L('Saved drafts ·')+' '+drafts.filter(d=>d.symbol===symbol).length),
        e('p',{className:'micro muted'},L('Private to this browser profile · last 20 drafts · clearing browser data removes them. Download .txt for a backup.')),
        ...drafts.filter(d=>d.symbol===symbol).map(d=>e('button',{key:d.id,type:'button',className:'social-open',onClick:()=>restoreDraft(d)},d.symbol+' · '+d.style+' · '+new Date(d.savedAt).toLocaleString())),
        restored?.symbol===symbol&&e('div',null,
          e('textarea',{readOnly:true,className:'social-post-text','aria-label':L('Restored saved draft'),value:restored.text}),
          e('p',{className:'micro muted'},L('Saved snapshot — select text and copy. Generate again to use refreshed data.')))),
      shelfMessage&&e('p',{role:'status'},shelfMessage),
      e('p',{className:'muted'},L('Instant Snapshot creates a source-linked factual post with one click. For deeper analyst posts, add your own thesis and counterargument. No AI fees or automatic posting.')),
      e('div',{className:'social-source-bar'},
        e('div',null,e('strong',null,financial?.ticker||(symbol==='ALPHA'?L('No company selected yet'):symbol)),e('span',null,financial ? L('SEC facts loaded · FY')+' '+financial.fiscal_end:symbol==='ALPHA'?L('Type a ticker and press Select'):L('Official SEC data not loaded')),
          financial?.filing?.url&&e('a',{href:financial.filing.url,target:'_blank',rel:'noopener noreferrer',className:'filing-link'},L('Open the 10-K filing ↗'))),
        e(Button,{onClick:loadCompany,icon:'company',loading:busy==='company',disabled:symbol==='ALPHA'},L('Load official figures'))),
      e('div',{className:'social-selectors'},
        e('label',{className:'form-label'},L('Post language'),e('select',{value:language,onChange:ev=>{setLanguage(ev.target.value);setOutput(null);}},
          ...[['en','English'],['tr','Türkçe'],['es','Español']].map(([v,label])=>e('option',{value:v,key:v},label)))),
        e('label',{className:'form-label'},L('LinkedIn format'),e('select',{value:style,onChange:ev=>{setStyle(ev.target.value);setOutput(null);}},
          e('option',{value:'snapshot'},L('Instant SEC data snapshot')),e('option',{value:'short'},L('Personal research insight')),e('option',{value:'deep'},L('Deep analyst note')),e('option',{value:'compare'},L('Peer comparison (two companies)'))))),
      style === 'compare' && e('label',{className:'form-label'},L('Competitor'),
        e('input',{className:'social-input social-input-ticker',list:'qe-companies',autoComplete:'off',maxLength:12,placeholder:L('e.g. NVDA'),value:peerTicker,
          onChange:ev=>{setPeerTicker(ev.target.value.toUpperCase());setOutput(null);}}),
        e('small',{className:'micro muted'},L('Your thesis and counterargument are optional in a comparison. Figures come from both companies’ latest 10-K.'))),
      style !== 'snapshot' && e('div',{className:'social-analysis-fields'},
        e('label',{className:'form-label'},L('Your original thesis'),
          e('textarea',{className:'social-input',maxLength:900,value:report.thesis||'',onChange:ev=>{setReport({...report,thesis:ev.target.value});setOutput(null);},placeholder:L('Example: I am examining whether durable free cash flow could support the company’s reinvestment needs. Here is the evidence I will test...')})),
        e('label',{className:'form-label'},L('Your strongest counterargument'),
          e('textarea',{className:'social-input social-input-small',maxLength:700,value:report.risks||'',onChange:ev=>{setReport({...report,risks:ev.target.value});setOutput(null);},placeholder:L('Explain a realistic reason your hypothesis may be wrong.')}))),
      style!=='snapshot'&&claimFlags.length>0&&e('div',{className:'claim-flags',role:'status'},
        e('strong',null,L('Check your wording before posting')),
        ...claimFlags.map((f,i)=>e('p',{key:i},e('mark',null,f.phrase),e('span',{className:'claim-kind'},L(f.category)),f.suggestion)),
        e('small',null,L('These are wording hints, not a judgement of your view. You decide what to post.'))),
      error&&e('div',{className:'notice amber',role:'alert'},error),
      e('div',{className:'social-buttons'},
        e(Button,{variant:'primary',icon:'spark',loading:working,onClick:compose,disabled:!financial||symbol==='ALPHA'||(style==='compare'&&(!peerTicker.trim()||peerTicker.trim()===symbol))},L('Generate copy-ready post')),
        e(Button,{icon:'file',onClick:()=>setPage('Reports')},L('Full research report'))),
      e('p',{className:'micro muted'},L('A template, not AI-generated market commentary. Read original SEC filings, verify accounting classifications and review every claim before posting.'))),
    e('section',{className:'panel social-preview'},
      e('div',{className:'panel-head'},e('div',null,e('div',{className:'eyebrow'},L('PUBLISHING PREVIEW')),e('h2',null,L('Your LinkedIn post'))),e(Chip,{mode:'amber'},L('UNPUBLISHED DRAFT'))),
      output ? e(Group,null,
        e('div',{className:'social-post-meta'},e('span',null,output.word_count,L(' words')),e('span',{className:(output.char_count||0)>3000?'over-limit':''},(output.char_count||output.text.length)+' / 3000 '+L('characters')),e('span',null,output.fiscal_end,L(' · SEC FY'))),
        e('textarea',{className:'social-post-text',readOnly:true,'aria-label':L('Copy-ready LinkedIn draft'),value:output.text}),
        e('div',{className:'social-buttons'},
          e(Button,{variant:'primary',icon:'file',onClick:copy},copied?L('✓ Copied!'):L('Copy for LinkedIn')),
          e(Button,{icon:'download',onClick:download},L('Save .txt')),
          e(Button,{icon:'file',onClick:saveDraft},L('Keep draft in browser')),
          e('a',{href:'https://www.linkedin.com/feed/',target:'_blank',rel:'noopener noreferrer',className:'social-open'},L('Open LinkedIn ↗'))),
        e('div',{className:'social-warnings'},...(output.warnings||[]).map((x,i)=>e('p',{key:i},L(x)))),
        cardUrl&&e('div',{className:'share-card'},
          e('div',{className:'eyebrow'},L('IMAGE FOR YOUR POST')),
          e('img',{src:cardUrl,alt:L('Chart card for LinkedIn'),width:600,height:314}),
          e('div',{className:'social-buttons'},e('a',{href:cardUrl,download:'QuantEdge_'+symbol+'_LinkedIn.png',className:'btn primary'},L('Download PNG'))),
          e('p',{className:'micro muted'},L('Attach this image to your LinkedIn post. It is drawn on your computer from the SEC figures above; nothing is uploaded.'))))
        : e('div',{className:'social-placeholder'},
          e('h3',null,L('Your research, ready to be read')),
          e('p',null,L('Load free SEC data and generate a factual post instantly. Add your own thesis and counterargument if you want a deeper LinkedIn research note.')),
          e('div',{className:'social-skeleton'},L('Company insight\n\n• Annual revenue\n• Revenue growth\n• Operating margin\n\nYour thesis\nYour counterargument\nSEC source')))));
}

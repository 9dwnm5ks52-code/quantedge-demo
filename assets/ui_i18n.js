/* QuantEdge v0.13.5 — one app-wide interface language.
 *
 * Before v0.13.5 every page kept its own language switch (Home: TR/EN/ES,
 * Guide and Free Data: TR/EN, the rest English only), so choosing Türkçe on
 * one page left the next page in English. Now App owns a single language,
 * stores it in localStorage ('qe.lang') and every page reads QE_LANG.
 *
 * L(text) translates an English interface string. Keys are the English text
 * with surrounding whitespace trimmed; that whitespace is kept around the
 * translation. A missing key falls back to English, never to an empty label.
 * Server data (company names, SEC figures, error details) is not translated.
 */
var QE_LANGS = ['tr', 'en', 'es'];
// a published copy can be pinned to one language (make_demo_site.py --only-lang): no switch is shown then
var QE_FIXED = (typeof window !== 'undefined' && window.QE_FIXED) || {};
// ... or only given a first-visit language and theme (--default-lang): a visitor's own choice still wins
var QE_DEFAULTS = (typeof window !== 'undefined' && window.QE_DEFAULTS) || {};
if (QE_LANGS.indexOf(QE_FIXED.lang) >= 0) QE_LANGS = [QE_FIXED.lang];
var QE_LANG = (function () {
  if (QE_LANGS.length === 1) return QE_LANGS[0];
  try {
    var saved = window.localStorage.getItem('qe.lang');
    return QE_LANGS.indexOf(saved) >= 0 ? saved : QE_LANGS.indexOf(QE_DEFAULTS.lang) >= 0 ? QE_DEFAULTS.lang : 'tr';
  } catch (_) { return QE_LANGS.indexOf(QE_DEFAULTS.lang) >= 0 ? QE_DEFAULTS.lang : 'tr'; }
})();

var QE_TR = {
  // Navigation and top bar
  'Home': 'Ana sayfa', 'Guide': 'Rehber',
  'LinkedIn': 'LinkedIn', 'Reports': 'Raporlar', 'Company': 'Şirket',
  'Valuation': 'Değerleme', 'Library': 'Kütüphane',
  'Search actions': 'Komut ara', 'Search commands (Command K)': 'Komut ara (Command K)',
  'Open quick commands': 'Hızlı komutları aç', 'LOCAL PRIVATE BETA': 'YEREL ÖZEL BETA',
  'Display density': 'Görünüm yoğunluğu', 'About data integrity': 'Veri güvenilirliği hakkında',
  'Interface language': 'Arayüz dili', 'Main navigation': 'Ana menü',
  'QuantEdge is running locally.': 'QuantEdge bilgisayarında yerel olarak çalışıyor.',
  'Dismiss': 'Kapat',

  // Page heads
  'QUANTEDGE / INSTITUTIONAL WORKSPACE': 'QUANTEDGE / ARAŞTIRMA MASASI',
  'Existing Python finance engine connected': 'Python finans motoru bağlı',
  'From curiosity to credible research': 'Meraktan güvenilir araştırmaya',
  'LinkedIn research posts': 'LinkedIn araştırma paylaşımları',
  'Research publisher': 'Rapor stüdyosu',
  'Research library': 'Araştırma kütüphanesi',
  'One small step at a time. Build a real, source-based research project you can explain and defend.': 'Her seferinde küçük bir adım. Açıklayabileceğin ve savunabileceğin, kaynaklı bir araştırma oluştur.',
  'Turn your own thesis and official figures into plain text you can paste directly.': 'Kendi tezini ve resmî rakamları doğrudan yapıştırabileceğin bir metne dönüştür.',
  'Write research you can stand behind. Export polished, unpublished drafts.': 'Arkasında durabileceğin bir araştırma yaz. Yayımlanmamış, düzenli taslaklar indir.',
  'Every research milestone, saved locally and easy to revisit.': 'Tüm araştırma adımların bu bilgisayarda kayıtlı ve tekrar açılabilir.',

  // Company bar (shared by most pages)
  'COMPANY / TICKER': 'ŞİRKET / KOD', 'Select': 'Seç', 'e.g. NVDA': 'ör. NVDA',
  'ACTIVE RESEARCH CONTEXT': 'AKTİF ARAŞTIRMA',
  'No company selected yet': 'Henüz şirket seçilmedi',
  'SEC facts loaded · FY': 'SEC verisi yüklendi · Mali yıl',
  'Data not loaded for this company': 'Bu şirket için veri henüz yüklenmedi',
  'not selected yet — press Select or Enter': 'henüz seçilmedi — Seç’e veya Enter’a bas',
  'Load SEC data': 'SEC verisini yükle', 'Create report': 'Rapor oluştur',
  'SEC identifies automated requests; enter your contact email once before the first SEC download. Not stored in the app.':
    'SEC otomatik istekleri tanımlamak ister; ilk SEC indirmesinden önce iletişim e-postanı bir kez yaz. Uygulama bunu saklamaz.',
  'Your contact email for SEC (e.g. research@example.com)': 'SEC için iletişim e-postan (ör. research@example.com)',
  'SEC contact email': 'SEC iletişim e-postası',
  'Enter a valid ticker, e.g. NVDA.': 'Geçerli bir şirket kodu yaz, ör. NVDA.',
  'Select a valid company ticker first.': 'Önce geçerli bir şirket kodu seç.',
  'SEC financial history loaded; see company fiscal-year ending date and source audit.': 'SEC finansal geçmişi yüklendi; mali yıl sonu ve kaynak bilgisi aşağıda.',

  // Company figures
  'Fiscal year': 'Mali yıl',
  'Annual revenue': 'Yıllık gelir', 'Net income': 'Net kâr',
  'Net margin': 'Net kâr marjı', 'Cash & equivalents': 'Nakit ve benzerleri',

  // Guide
  'No company selected yet (demo only)': 'Henüz şirket seçilmedi (sadece demo)',

  // LinkedIn composer
  'Saved drafts ·': 'Kayıtlı taslaklar ·',
  'Private to this browser profile · last 20 drafts · clearing browser data removes them. Download .txt for a backup.':
    'Sadece bu tarayıcıda · son 20 taslak · tarayıcı verilerini silersen kaybolur. Yedek için .txt indir.',
  'Saved snapshot — select text and copy. Generate again to use refreshed data.': 'Kayıtlı kopya — metni seçip kopyala. Güncel veri için yeniden oluştur.',
  'Restored saved draft': 'Geri yüklenen taslak',
  'Saved on this browser.': 'Bu tarayıcıya kaydedildi.',
  'Browser storage unavailable or full. Download .txt to keep this draft.': 'Tarayıcı depolaması kullanılamıyor veya dolu. Taslağı saklamak için .txt indir.',
  'Saved text restored below. Original data may be stale; verify sources before posting.': 'Kayıtlı metin aşağıda. Veriler eskimiş olabilir; paylaşmadan önce kaynakları kontrol et.',
  'Automatic copying is blocked in this browser. Select the text below and copy with Command+C.': 'Bu tarayıcı otomatik kopyalamayı engelliyor. Aşağıdaki metni seçip Command+C ile kopyala.',
  'RESEARCH → COPY-READY LINKEDIN': 'ARAŞTIRMA → LINKEDIN’E HAZIR METİN',
  'Publish your thinking. Show your sources.': 'Fikrini paylaş. Kaynağını göster.',
  'Instant Snapshot creates a source-linked factual post with one click. For deeper analyst posts, add your own thesis and counterargument. No AI fees or automatic posting.':
    'Hızlı özet, tek tıkla kaynaklı bir paylaşım oluşturur. Daha derin bir analiz için kendi tezini ve karşı görüşünü ekle. Yapay zekâ ücreti veya otomatik paylaşım yok.',
  'Official SEC data not loaded': 'Resmî SEC verisi yüklenmedi', 'Load official figures': 'Resmî rakamları yükle',
  'Post language': 'Paylaşım dili', 'LinkedIn format': 'LinkedIn biçimi',
  'Instant SEC data snapshot': 'Hızlı SEC veri özeti', 'Personal research insight': 'Kişisel araştırma notu', 'Deep analyst note': 'Detaylı analist notu',
  'Your original thesis': 'Kendi tezin',
  'Example: I am examining whether durable free cash flow could support the company’s reinvestment needs. Here is the evidence I will test...':
    'Örnek: Kalıcı serbest nakit akışının şirketin yatırım ihtiyacını karşılayıp karşılayamayacağını inceliyorum. Test edeceğim kanıtlar şunlar...',
  'Your strongest counterargument': 'En güçlü karşı görüşün',
  'Explain a realistic reason your hypothesis may be wrong.': 'Hipotezinin yanlış çıkabileceği gerçekçi bir nedeni yaz.',
  'Generate copy-ready post': 'Paylaşım metnini oluştur', 'Full research report': 'Tam araştırma raporu',
  'A template, not AI-generated market commentary. Read original SEC filings, verify accounting classifications and review every claim before posting.':
    'Bu bir şablondur, yapay zekâ yorumu değildir. Paylaşmadan önce orijinal SEC raporlarını oku ve her iddiayı kontrol et.',
  'PUBLISHING PREVIEW': 'PAYLAŞIM ÖNİZLEMESİ', 'Your LinkedIn post': 'LinkedIn paylaşımın', 'UNPUBLISHED DRAFT': 'YAYIMLANMAMIŞ TASLAK',
  'words': 'kelime', 'characters': 'karakter', '· SEC FY': '· SEC mali yıl',
  'Draft: figures derived from SEC XBRL are not reconciled against original 10-K footnotes.': 'Taslak: SEC XBRL’den alınan rakamlar 10-K dipnotlarıyla karşılaştırılmadı.',
  'User opinion is not an investment recommendation. Verify periods, restatements and URLs before publishing.': 'Kişisel görüş yatırım tavsiyesi değildir. Paylaşmadan önce dönemleri, düzeltmeleri ve linkleri kontrol et.', 'Copy-ready LinkedIn draft': 'Kopyalanmaya hazır LinkedIn taslağı',
  '✓ Copied!': '✓ Kopyalandı!', 'Copy for LinkedIn': 'LinkedIn için kopyala', 'Save .txt': '.txt indir',
  'Keep draft in browser': 'Taslağı tarayıcıda sakla', 'Open LinkedIn ↗': 'LinkedIn’i aç ↗',
  'Your research, ready to be read': 'Araştırman, okunmaya hazır',
  'Load free SEC data and generate a factual post instantly. Add your own thesis and counterargument if you want a deeper LinkedIn research note.':
    'Ücretsiz SEC verisini yükle ve hemen kaynaklı bir paylaşım oluştur. Daha derin bir not için kendi tezini ve karşı görüşünü ekle.',
  'Company insight\n\n• Annual revenue\n• Revenue growth\n• Operating margin\n\nYour thesis\nYour counterargument\nSEC source':
    'Şirket özeti\n\n• Yıllık gelir\n• Gelir büyümesi\n• Faaliyet kâr marjı\n\nSenin tezin\nKarşı görüşün\nSEC kaynağı'
};

var QE_ES = {
  'Home': 'Inicio', 'Guide': 'Guía',
  'Reports': 'Informes', 'Company': 'Empresa', 'Valuation': 'Valoración', 'Library': 'Biblioteca',
  'Search actions': 'Buscar acciones', 'Search commands (Command K)': 'Buscar comandos (Command K)',
  'Open quick commands': 'Abrir comandos rápidos', 'LOCAL PRIVATE BETA': 'BETA LOCAL PRIVADA',
  'Display density': 'Densidad de pantalla', 'About data integrity': 'Sobre la integridad de los datos',
  'Interface language': 'Idioma de la interfaz', 'Main navigation': 'Navegación principal',
  'QuantEdge is running locally.': 'QuantEdge se ejecuta en tu ordenador.',
  'Dismiss': 'Cerrar',
  'QUANTEDGE / INSTITUTIONAL WORKSPACE': 'QUANTEDGE / ESPACIO DE ANÁLISIS',
  'Existing Python finance engine connected': 'Motor financiero de Python conectado',
  'From curiosity to credible research': 'De la curiosidad a un análisis creíble',
  'LinkedIn research posts': 'Publicaciones de análisis para LinkedIn',
  'Research publisher': 'Estudio de informes', 'Research library': 'Biblioteca de análisis',
  'Turn your own thesis and official figures into plain text you can paste directly.': 'Convierte tu tesis y las cifras oficiales en un texto listo para pegar.',
  'COMPANY / TICKER': 'EMPRESA / SÍMBOLO', 'Select': 'Elegir', 'e.g. NVDA': 'p. ej. NVDA', 'ACTIVE RESEARCH CONTEXT': 'ANÁLISIS ACTIVO',
  'No company selected yet': 'Aún no has elegido empresa',
  'SEC facts loaded · FY': 'Datos SEC cargados · Año fiscal',
  'Data not loaded for this company': 'Aún no hay datos de esta empresa',
  'not selected yet — press Select or Enter': 'aún no elegido — pulsa Elegir o Enter',
  'Load SEC data': 'Cargar datos SEC', 'Create report': 'Crear informe',
  'SEC identifies automated requests; enter your contact email once before the first SEC download. Not stored in the app.':
    'La SEC identifica las solicitudes automáticas; escribe tu correo de contacto antes de la primera descarga. La aplicación no lo guarda.',
  'Your contact email for SEC (e.g. research@example.com)': 'Tu correo de contacto para la SEC (p. ej. research@example.com)',
  'Enter a valid ticker, e.g. NVDA.': 'Escribe un símbolo válido, p. ej. NVDA.',
  'Select a valid company ticker first.': 'Primero elige un símbolo válido.',
  'Fiscal year': 'Año fiscal',
  'No company selected yet (demo only)': 'Aún no has elegido empresa (solo demo)',
  'Saved drafts ·': 'Borradores guardados ·', 'Publish your thinking. Show your sources.': 'Comparte tu análisis. Muestra tus fuentes.',
  'Official SEC data not loaded': 'Datos oficiales de la SEC sin cargar', 'Load official figures': 'Cargar cifras oficiales',
  'Post language': 'Idioma de la publicación', 'LinkedIn format': 'Formato de LinkedIn',
  'Your original thesis': 'Tu tesis', 'Your strongest counterargument': 'Tu objeción más fuerte',
  'Generate copy-ready post': 'Generar publicación', 'Full research report': 'Informe completo',
  'PUBLISHING PREVIEW': 'VISTA PREVIA', 'Your LinkedIn post': 'Tu publicación de LinkedIn', 'UNPUBLISHED DRAFT': 'BORRADOR SIN PUBLICAR',
  'words': 'palabras', 'characters': 'caracteres', '✓ Copied!': '✓ ¡Copiado!', 'Copy for LinkedIn': 'Copiar para LinkedIn', 'Save .txt': 'Guardar .txt',
  'Keep draft in browser': 'Guardar en el navegador', 'Open LinkedIn ↗': 'Abrir LinkedIn ↗',
  'Your research, ready to be read': 'Tu análisis, listo para leer'
};

/* v0.13.5: Reports, Library and shared workspace copy (Turkish). Spanish falls back to English on these pages. */
Object.assign(QE_TR, {
  "Find a company or action": "Şirket veya işlem bul",
  "Search pages, companies, actions...": "Sayfa, şirket veya işlem ara...",
  "↵ Run first action": "↵ İlk işlemi çalıştır",
  "⌘K / Ctrl+K to open from anywhere": "Her yerden açmak için ⌘K / Ctrl+K",
  "Quick actions": "Hızlı işlemler",
  "EDITORIAL REVIEW": "EDİTÖRYAL KONTROL",
  "Draft completeness": "Taslak bütünlüğü",
  "Not a quality rating or publication approval": "Kalite puanı veya yayın onayı değildir",
  "Figures, links and analyst conclusions still require independent human verification before sharing.": "Rakamlar, linkler ve vardığın sonuçlar paylaşılmadan önce yine bir insan tarafından kontrol edilmeli.",
  "Draft completeness checklist": "Taslak bütünlük listesi",
  "references": "kaynak",
  "Evidence ledger": "Kanıt defteri",
  "Connect a research claim to a source. You supply and verify each reference.": "Her iddiayı bir kaynağa bağla. Kaynakları sen ekler ve sen doğrularsın.",
  "ANALYST-ENTERED": "SENİN EKLEDİĞİN",
  "· unverified": "· doğrulanmadı",
  "Open source ↗": "Kaynağı aç ↗",
  "Remove source": "Kaynağı kaldır",
  "Remove reference": "Kaynağı kaldır",
  "Evidence source title": "Kaynak başlığı",
  "e.g. FY2026 Form 10-K": "ör. 2026 mali yılı Form 10-K",
  "Source title": "Kaynak başlığı",
  "Evidence source URL": "Kaynak linki",
  "Public source link": "Herkese açık kaynak linki",
  "Evidence supported claim": "Desteklenen iddia",
  "e.g. revenue growth in FY2026": "ör. 2026 mali yılındaki gelir büyümesi",
  "Claim this supports": "Desteklediği iddia",
  "Evidence section": "Rapor bölümü",
  "Report section": "Rapor bölümü",
  "Evidence source type": "Kaynak türü",
  "Source type": "Kaynak türü",
  "Add reference": "Kaynak ekle",
  "Research evidence ledger": "Araştırma kanıt defteri",
  "EDITORIAL QUALITY GATE": "EDİTÖRYAL KALİTE KONTROLÜ",
  "Does your research stand up to scrutiny?": "Araştırman sorgulamaya dayanıyor mu?",
  "Check which claims have analyst-entered citations, which sections are missing, and whether language sounds too certain. This is a checklist—not automated fact-checking.": "Hangi iddiaların kaynağı olduğunu, hangi bölümlerin eksik kaldığını ve dilin fazla kesin olup olmadığını kontrol et. Bu bir kontrol listesidir, otomatik doğrulama değildir.",
  "Run editorial preflight": "Kontrolü çalıştır",
  "completeness checks": "bütünlük kontrolü",
  "Editorial publication preflight": "Yayın öncesi kontrol",
  "Fiscal year ended": "Mali yıl sonu",
  "· FY ends": "· mali yıl sonu",
  "Assets": "Varlıklar",
  "Current ratio": "Cari oran",
  "— Company Research": "— Şirket Araştırması",
  "Research": "Araştırma",
  "Save draft": "Taslağı kaydet",
  "Export PDF": "PDF indir",
  "Comfortable": "Rahat",
  "Prior example revenue": "Önceki örnek gelir",
  "Current example revenue": "Şimdiki örnek gelir",
  "Your growth guess": "Büyüme tahminin",
  "Interactive finance coach": "Etkileşimli finans koçu",
  "Writing coach": "Yazım koçu",
  "QUANTEDGE / GUIDED ANALYST": "QUANTEDGE / REHBERLİ ANALİST",
  "Guide language": "Rehber dili",
  "Research completeness": "Araştırma bütünlüğü",
  "Research steps": "Araştırma adımları",
  "RESEARCH QUALITY / NOT A GRADE": "ARAŞTIRMA KALİTESİ / NOT DEĞİL",
  "Guided Analyst research journey": "Rehberli araştırma yolculuğu",
  "observations": "gözlem",
  "historical observations": "geçmiş gözlem",
  "Language": "Dil",
  "Net income / revenue": "Net kâr / gelir",
  "Fiscal end": "Mali yıl sonu",
  "Revenue ($B)": "Gelir (milyar $)",
  "FCF ($B)": "Serbest nakit (milyar $)",
  "Op. margin": "Faaliyet marjı",
  "Liabilities": "Yükümlülükler",
  "INDEPENDENT RESEARCH / EDITORIAL STUDIO": "BAĞIMSIZ ARAŞTIRMA / RAPOR STÜDYOSU",
  "Make your research worth reading.": "Araştırmanı okunmaya değer kıl.",
  "DRAFT · PRIVATE": "TASLAK · ÖZEL",
  "REPORT DESIGN": "RAPOR TASARIMI",
  "Same research, three different publication layouts. All remain private drafts.": "Aynı araştırma, üç farklı tasarım. Hepsi özel taslak olarak kalır.",
  "Report visual style": "Rapor görsel stili",
  "e.g. NVIDIA — Business Quality & Risks": "ör. NVIDIA — İş Kalitesi ve Riskler",
  "Report title": "Rapor başlığı",
  "Your name or research desk": "Adın veya araştırma ekibin",
  "Author": "Yazar",
  "AUTHOR WRITTEN": "YAZARIN YAZDIĞI",
  "characters": "karakter",
  "Historical financial evidence:": "Geçmiş finansal kanıt:",
  "Save to Library": "Kütüphaneye kaydet",
  "Download HTML": "HTML indir",
  "Exports are unpublished drafts. No automated AI claims, unverified target prices or fictional company data are inserted.": "İndirilen dosyalar yayımlanmamış taslaklardır. Otomatik yapay zekâ iddiası, doğrulanmamış hedef fiyat veya kurgusal şirket verisi eklenmez.",
  "LIVE PREVIEW": "CANLI ÖNİZLEME",
  "Editorial layout": "Editöryal düzen",
  "DRAFT": "TASLAK",
  "01 / INVESTMENT THESIS": "01 / YATIRIM TEZİ",
  "02 / FINANCIAL SNAPSHOT": "02 / FİNANSAL ÖZET",
  "Revenue": "Gelir",
  "Financial data not attached — no figures invented.": "Finansal veri eklenmedi — hiçbir rakam uydurulmaz.",
  "03 / RISKS & COUNTERARGUMENTS": "03 / RİSKLER VE KARŞI GÖRÜŞLER",
  "04 / ANALYST REFERENCE REGISTER": "04 / KAYNAK LİSTESİ",
  "analyst-entered sources. These links have not been independently verified.": "senin eklediğin kaynak. Bu linkler bağımsız olarak doğrulanmadı.",
  "DRAFT · HUMAN REVIEW REQUIRED": "TASLAK · İNSAN KONTROLÜ GEREKLİ",
  "Preview:": "Önizleme:",
  ". PDF and HTML use this same visual theme, with full source and disclosure sections. Draft only.": ". PDF ve HTML aynı tasarımı, tam kaynak ve açıklama bölümleriyle kullanır. Sadece taslak.",
  "LOCAL RESEARCH ARCHIVE": "YEREL ARAŞTIRMA ARŞİVİ",
  "Your saved analyses": "Kayıtlı analizlerin",
  "Refresh": "Yenile",
  "Create first report": "İlk raporunu oluştur",
  "No research saved yet": "Henüz kayıtlı araştırma yok",
  "Draft a report under Research Publisher, then save it locally. This is a private single-user archive, not cloud storage.": "Rapor stüdyosunda bir taslak yaz ve bu bilgisayara kaydet. Bu, buluta değil sadece senin bilgisayarına kaydeden özel bir arşivdir.",
  "SAVED SNAPSHOT": "KAYITLI KOPYA",
  "Saved drafts are snapshots and do not auto-update when market or SEC data changes.": "Kayıtlı taslaklar o anın kopyasıdır; piyasa veya SEC verisi değişince güncellenmez.",
  "Build a research history": "Araştırma geçmişi oluştur",
  "Your finished projects will be searchable here. Click a saved report to read the exact draft that was stored.": "Bitirdiğin çalışmalar burada listelenir. Kaydedilen taslağı okumak için bir rapora tıkla.",
  "Local-only · Private research prototype · No trading": "Sadece yerel · Özel araştırma prototipi · Al-sat yok",
  "Strategy": "Strateji",
  "Momentum lookback (days)": "Momentum dönemi (gün)",
});

Object.assign(QE_TR, {
  "Working...": "Çalışıyor...",
  "Sources are not downloaded or fact-checked by this form.": "Bu form kaynakları indirmez veya doğrulamaz.",
  "analyst-entered source link(s)": "senin eklediğin kaynak linki",
  "Not written": "Yazılmadı",
  "not recorded": "kayıtlı değil",
  "Price: demo": "Fiyat: demo",
  "Price: dated historical": "Fiyat: tarihli geçmiş veri",
  "Not available": "Mevcut değil",
  "● SELECTED": "● SEÇİLDİ",
  "○ SELECT STYLE": "○ BU STİLİ SEÇ",
  "What is your investment thesis?": "Yatırım tezin ne?",
  "What could invalidate it?": "Onu ne geçersiz kılabilir?",
  "What could change the outlook?": "Tabloyu ne değiştirebilir?",
  "Your working notes & evidence": "Çalışma notların ve kanıtların",
  "Which documents support your claims?": "İddialarını hangi belgeler destekliyor?",
  "What needs human verification before sharing?": "Paylaşmadan önce neyin kontrol edilmesi gerekiyor?",
  "Start with one clear, testable claim—not a recommendation.": "Tavsiye değil; açık ve test edilebilir tek bir iddiayla başla.",
  "State the strongest counterargument and what would prove you wrong.": "En güçlü karşı görüşü ve seni neyin yanlış çıkaracağını yaz.",
  "Explain possible developments, separating scenarios from observed facts.": "Olası gelişmeleri anlat; senaryoları gözlenen gerçeklerden ayır.",
  "Capture sources, questions and figures to verify before distribution.": "Paylaşmadan önce kontrol edilecek kaynakları, soruları ve rakamları not al.",
  "Map each important claim to a source. Citations are analyst-entered, not auto-verified.": "Her önemli iddiayı bir kaynağa bağla. Kaynakları sen eklersin; otomatik doğrulanmaz.",
  "Run a structured preflight review. This does not certify facts or approve publication.": "Yapılandırılmış bir ön kontrol yap. Bu, bilgileri onaylamaz veya yayına izin vermez.",
  "I am examining whether the company can sustain its growth, given...": "Şirketin büyümesini sürdürüp sürdüremeyeceğini inceliyorum, çünkü...",
  "Key risks include...": "Başlıca riskler...",
  "Potential catalysts include...": "Olası tetikleyiciler...",
  "SEC 10-K accession, questions, research notes...": "SEC 10-K numarası, sorular, araştırma notları...",
  "SEC loaded": "SEC yüklendi",
  "not attached": "eklenmedi",
  "EVIDENCE-LED EQUITY RESEARCH": "KANITA DAYALI HİSSE ARAŞTIRMASI",
  "THE LONG VIEW / COMPANY INTELLIGENCE": "UZUN VADELİ BAKIŞ / ŞİRKET ANALİZİ",
  "EXECUTIVE BRIEF": "YÖNETİCİ ÖZETİ",
  "— Research Report": "— Araştırma Raporu",
  "Your research thesis will appear here as you type. Start with a clear claim and support it with sources.": "Yazdıkça tezin burada görünecek. Açık bir iddiayla başla ve kaynaklarla destekle.",
  "State the most important risks to your thesis.": "Tezine yönelik en önemli riskleri yaz.",
  "Institutional Research": "Kurumsal Araştırma",
  "Editorial Analysis": "Editöryal Analiz",
  "Executive Brief": "Yönetici Özeti",
  "Select an analysis": "Bir analiz seç",
});

Object.assign(QE_TR, {
  "Thesis": "Tez",
  "Risks": "Riskler",
  "Catalysts": "Tetikleyiciler",
  "Notes": "Notlar",
  "Evidence": "Kanıtlar",
  "Review": "Kontrol",
  "SEC filing": "SEC raporu",
  "Company IR": "Şirket yatırımcı ilişkileri",
  "Third-party research": "Üçüncü taraf araştırma",
  "Other": "Diğer",
  "EBIT margin %": "FVÖK marjı %",
  "WACC %": "WACC %",
  "Terminal growth %": "Uzun vadeli büyüme %",
  "Operating margin (%)": "Faaliyet kâr marjı (%)",
  "WACC (%)": "WACC (%)",
  "Terminal growth (%)": "Uzun vadeli büyüme (%)",
  "Cash ($m)": "Nakit (milyon $)",
  "Debt ($m)": "Borç (milyon $)",
  "Diluted shares (millions)": "Seyreltilmiş hisse sayısı (milyon)",
  "Evidence-first research desk": "Kanıt öncelikli araştırma masası",
  "Premium long-form analysis": "Uzun ve detaylı analiz",
  "Condensed decision memo": "Kısa karar notu",
  "Report title": "Rapor başlığı",
  "Testable thesis": "Test edilebilir tez",
  "Counterarguments": "Karşı görüşler",
  "Catalysts / monitoring": "Tetikleyiciler / takip",
  "Analyst-entered reference": "Eklenmiş kaynak",
  "SEC financial history": "SEC finansal geçmişi",
  "Navigate": "Sayfa",
  "Action": "İşlem",
  "Switch to": "Şirket değiştir:",
  "Open guided research journey": "Rehberli araştırmayı aç",
  "Open Company Intelligence": "Şirket analizini aç",
  "Open Research Publisher": "Rapor stüdyosunu aç",
  "Open Research Library": "Araştırma kütüphanesini aç",
  "Load historical prices": "Geçmiş fiyatları yükle",
  "Load SEC fundamentals": "SEC temel verilerini yükle",
  "Run DCF model": "DCF modelini çalıştır",
  "Save research draft": "Araştırma taslağını kaydet",
  "SMA crossover": "Hareketli ortalama kesişimi",
  "Momentum": "Momentum",
  "Buy and hold": "Al ve tut",
  "Fast MA": "Hızlı ortalama (gün)",
  "Slow MA": "Yavaş ortalama (gün)",
  "Fee (bps)": "Komisyon (baz puan)",
  "Slippage (bps)": "Kayma (baz puan)",
  "Training %": "Eğitim dönemi %",
  "Max drawdown": "En büyük düşüş"
});

Object.assign(QE_TR, {
  "Financial health": "Finansal sağlık",
  "Scenario valuation": "Senaryo değerlemesi",
  "DCF valuation": "DCF değerlemesi",
  "Research draft": "Araştırma taslağı",
});

Object.assign(QE_TR, {
  "Report notes are full; shorten them before adding the comparison.": "Rapor notları dolu; karşılaştırmayı eklemeden önce kısalt.",
  "Add a complete source URL starting with https://": "https:// ile başlayan tam bir kaynak linki ekle",
  "Enter a source title, a public http(s) link and the claim it supports (maximum 20).": "Kaynak başlığı, herkese açık bir http(s) linki ve desteklediği iddiayı yaz (en fazla 20).",
  "Reference added as analyst-entered, not automatically verified.": "Kaynak eklendi; senin eklediğin kaynaklar otomatik doğrulanmaz.",
  "draft saved to Downloads (unpublished). Verify all sources before sharing.": "taslağı İndirilenler klasörüne kaydedildi (yayımlanmadı). Paylaşmadan önce tüm kaynakları kontrol et.",
  "Draft saved to this computer’s research library": "Taslak bu bilgisayardaki araştırma kütüphanesine kaydedildi"
});

Object.assign(QE_TR, {
  "SEC company list downloaded": "SEC şirket listesi indirildi",
  "companies": "şirket",
  "6 featured companies are ready. Download the free SEC list to search 10,000+ US companies.": "6 öne çıkan şirket hazır. 10.000’den fazla ABD şirketinde arama yapmak için ücretsiz SEC listesini indir.",
  "Download company list": "Şirket listesini indir"
});
Object.assign(QE_ES, {
  "SEC company list downloaded": "Lista de empresas de la SEC descargada",
  "companies": "empresas",
  "6 featured companies are ready. Download the free SEC list to search 10,000+ US companies.": "6 empresas destacadas listas. Descarga la lista gratuita de la SEC para buscar entre más de 10.000 empresas de EE. UU.",
  "Download company list": "Descargar lista de empresas"
});

Object.assign(QE_TR, {'Open the 10-K filing ↗': '10-K belgesini aç ↗'});
Object.assign(QE_ES, {'Open the 10-K filing ↗': 'Abrir el formulario 10-K ↗'});

Object.assign(QE_TR, {
  "SEC 10-Q · LATEST QUARTERS": "SEC 10-Q · SON ÇEYREKLER",
  "The newest numbers": "En güncel rakamlar",
  "Last 12 months": "Son 12 ay",
  "revenue": "gelir",
  "operating margin": "faaliyet marjı",
  "Quarter ended": "Çeyrek sonu",
  "vs a year earlier": "Bir yıl öncesine göre",
  "Source": "Kaynak",
  "derived: 10-K minus Q1–Q3": "hesaplandı: 10-K eksi 1.–3. çeyrek",
  "Companies file no 10-Q for the fourth quarter; it is calculated as the fiscal-year total minus the first three quarters. Quarters are not seasonally adjusted.": "Şirketler dördüncü çeyrek için 10-Q vermez; bu çeyrek, yıllık toplamdan ilk üç çeyrek çıkarılarak hesaplanır. Çeyrekler mevsimsellikten arındırılmamıştır."
});
Object.assign(QE_ES, {
  "SEC 10-Q · LATEST QUARTERS": "SEC 10-Q · ÚLTIMOS TRIMESTRES",
  "The newest numbers": "Las cifras más recientes",
  "Last 12 months": "Últimos 12 meses",
  "revenue": "ingresos",
  "operating margin": "margen operativo",
  "Quarter ended": "Fin del trimestre",
  "vs a year earlier": "Frente al año anterior",
  "Source": "Fuente",
  "derived: 10-K minus Q1–Q3": "calculado: 10-K menos T1–T3",
  "Op. margin": "Margen op.",
  "Revenue": "Ingresos",
  "Companies file no 10-Q for the fourth quarter; it is calculated as the fiscal-year total minus the first three quarters. Quarters are not seasonally adjusted.": "Las empresas no presentan 10-Q del cuarto trimestre; se calcula como el total anual menos los tres primeros trimestres. Sin ajuste estacional."
});

Object.assign(QE_TR, {
  "Check your wording before posting": "Paylaşmadan önce ifadelerine bak",
  "certainty": "kesinlik",
  "advice": "tavsiye",
  "price": "fiyat tahmini",
  "These are wording hints, not a judgement of your view. You decide what to post.": "Bunlar sadece ifade önerileri; görüşünün doğru ya da yanlış olduğunu söylemez. Ne paylaşacağına sen karar verirsin."
});
Object.assign(QE_ES, {
  "Check your wording before posting": "Revisa tu redacción antes de publicar",
  "certainty": "certeza",
  "advice": "recomendación",
  "price": "precio",
  "These are wording hints, not a judgement of your view. You decide what to post.": "Son sugerencias de redacción, no un juicio sobre tu opinión. Tú decides qué publicar."
});

Object.assign(QE_TR, {
  "Peer comparison (two companies)": "Rakip karşılaştırması (iki şirket)",
  "Competitor": "Rakip",
  "Your thesis and counterargument are optional in a comparison. Figures come from both companies’ latest 10-K.": "Karşılaştırmada tez ve karşı görüş isteğe bağlıdır. Rakamlar iki şirketin de son 10-K raporundan gelir.",
  "Peer comparison is descriptive and is not an investment recommendation or ranking.": "Karşılaştırma betimleyicidir; yatırım tavsiyesi veya sıralama değildir.",
  "Different fiscal-year ends: direct comparisons are not for identical reporting periods.": "Mali yıl sonları farklı: karşılaştırılan dönemler birebir aynı değil."
});
Object.assign(QE_ES, {
  "Peer comparison (two companies)": "Comparación (dos empresas)",
  "Competitor": "Competidor",
  "Your thesis and counterargument are optional in a comparison. Figures come from both companies’ latest 10-K.": "En una comparación la tesis y la objeción son opcionales. Las cifras vienen del último 10-K de ambas empresas."
});

Object.assign(QE_TR, {
  "IMAGE FOR YOUR POST": "PAYLAŞIMIN İÇİN GÖRSEL",
  "Chart card for LinkedIn": "LinkedIn için grafik kartı",
  "Download PNG": "PNG indir",
  "Attach this image to your LinkedIn post. It is drawn on your computer from the SEC figures above; nothing is uploaded.": "Bu görseli LinkedIn paylaşımına ekle. Yukarıdaki SEC rakamlarından senin bilgisayarında çizilir; hiçbir yere yüklenmez."
});
Object.assign(QE_ES, {
  "IMAGE FOR YOUR POST": "IMAGEN PARA TU PUBLICACIÓN",
  "Chart card for LinkedIn": "Tarjeta gráfica para LinkedIn",
  "Download PNG": "Descargar PNG",
  "Attach this image to your LinkedIn post. It is drawn on your computer from the SEC figures above; nothing is uploaded.": "Adjunta esta imagen a tu publicación. Se dibuja en tu ordenador con las cifras de la SEC; no se sube nada."
});

Object.assign(QE_TR, {
  "WAS I RIGHT?": "HAKLI MIYDIM?",
  "Compare your saved thesis with newer SEC figures": "Kaydettiğin tezi yeni SEC rakamlarıyla karşılaştır",
  "QuantEdge does not judge your thesis. It puts the figures you wrote from next to today’s; you decide and your verdict is kept.": "QuantEdge tezine not vermez. Yazarken baktığın rakamları bugünküyle yan yana koyar; kararı sen verirsin ve kararın saklanır.",
  "Compare with today’s figures": "Bugünkü rakamlarla karşılaştır",
  "This draft was saved without SEC figures (or before v0.13.5), so there is nothing to compare.": "Bu taslak SEC rakamları olmadan (veya v0.13.5’ten önce) kaydedildi; karşılaştırılacak veri yok.",
  "Saved from fiscal year ended": "Kaydedildiğinde mali yıl sonu",
  "now": "şimdi",
  "a newer 10-K is available": "daha yeni bir 10-K var",
  "no newer 10-K yet": "henüz yeni 10-K yok",
  "Measure": "Ölçüt",
  "When saved": "Kaydettiğinde",
  "Now": "Şimdi",
  "Change": "Değişim",
  "pts": "puan",
  "Latest quarter": "En son çeyrek",
  "Your thesis": "Tezin",
  "Your counterargument": "Karşı görüşün",
  "Your verdict": "Kararın",
  "My thesis held": "Tezim tuttu",
  "Partly": "Kısmen tuttu",
  "It did not hold": "Tutmadı",
  "Too early to tell": "Henüz erken",
  "What happened, and what did you learn? (optional)": "Ne oldu, ne öğrendin? (isteğe bağlı)",
  "Save my verdict": "Kararımı kaydet",
  "Your verdicts": "Kararların",
  "Revenue growth": "Gelir büyümesi",
  "Operating margin": "Faaliyet kâr marjı",
  "Net margin": "Net kâr marjı",
  "Free cash flow": "Serbest nakit akışı"
});
Object.assign(QE_ES, {
  "WAS I RIGHT?": "¿TENÍA RAZÓN?",
  "Compare your saved thesis with newer SEC figures": "Compara tu tesis guardada con cifras SEC más recientes",
  "Compare with today’s figures": "Comparar con las cifras de hoy",
  "Measure": "Medida",
  "When saved": "Al guardar",
  "Now": "Ahora",
  "Change": "Cambio",
  "pts": "p.p.",
  "My thesis held": "Mi tesis se cumplió",
  "Partly": "En parte",
  "It did not hold": "No se cumplió",
  "Too early to tell": "Aún es pronto",
  "Save my verdict": "Guardar mi valoración",
  "Your verdicts": "Tus valoraciones"
});

Object.assign(QE_TR, {
  "Research portfolio page": "Araştırma portföyü sayfası",
  "Download portfolio page": "Portföy sayfasını indir",
  "All saved analyses and your verdicts on one shareable page. A single HTML file that works offline; add it to your CV or LinkedIn Featured section.": "Tüm kayıtlı analizlerin ve kararların paylaşılabilir tek bir sayfada. İnternetsiz açılan tek bir HTML dosyası; CV’ne veya LinkedIn “Öne çıkanlar” bölümüne ekleyebilirsin."
});
Object.assign(QE_ES, {
  "Research portfolio page": "Página de portafolio",
  "Download portfolio page": "Descargar portafolio",
  "All saved analyses and your verdicts on one shareable page. A single HTML file that works offline; add it to your CV or LinkedIn Featured section.": "Todos tus análisis y valoraciones en una página para compartir. Un único HTML que funciona sin conexión; añádelo a tu CV o a Destacados de LinkedIn."
});

/* v0.13.5 Analysis Lab */
Object.assign(QE_TR, {
 "% of operating cash flow": "İşletme nakdinin %’si",
 "2020 COVID-19 crash": "2020 COVID-19 çöküşü",
 "2022 rate shock": "2022 faiz şoku",
 "2y weekly": "2 yıl, haftalık",
 "5y monthly": "5 yıl, aylık",
 "5y weekly": "5 yıl, haftalık",
 "Abnormal day 0": "Anormal getiri (0. gün)",
 "Abnormal first-day reaction by release": "Açıklamalara göre ilk gün anormal tepki",
 "Abnormal to day +1": "Anormal (+1. güne kadar)",
 "Abnormal to day +3": "Anormal (+3. güne kadar)",
 "Accruals / assets": "Tahakkuk / varlıklar",
 "Acquisitions": "Satın almalar",
 "Add to report notes": "Rapor notlarına ekle",
 "Added to your report notes.": "Rapor notlarına eklendi.",
 "Alpha (annual)": "Alfa (yıllık)",
 "Altman Z'' over time": "Zaman içinde Altman Z''",
 "Analyses": "Analizler",
 "Analysis Lab": "Analiz Laboratuvarı",
 "Analysis lab": "Analiz laboratuvarı",
 "Analyst tools built on SEC filings and historical prices. Each answers one question and shows its sources.": "SEC raporları ve geçmiş fiyatlarla çalışan analist araçları. Her biri tek bir soruyu yanıtlar ve kaynaklarını gösterir.",
 "Annual growth": "Yıllık büyüme",
 "Annual return": "Yıllık getiri",
 "Asset turnover": "Varlık devir hızı",
 "Asset turnover improved": "Varlık devir hızı arttı",
 "Average": "Ortalama",
 "Average operating cash flow as % of net income": "Ortalama işletme nakdi / net kâr",
 "Back to pre-crisis level": "Kriz öncesi seviyeye dönüş",
 "Base": "Baz",
 "Basis": "Temel",
 "Bear": "Kötü",
 "Bear / base / bull (5-year FCFF DCF)": "Kötü / baz / iyi (5 yıllık FCFF DCF)",
 "Beat buy & hold out-of-sample": "Test dışı dönemde al-tut’u geçti",
 "Best year": "En iyi yıl",
 "Beta": "Beta",
 "Beta and CAPM": "Beta ve CAPM",
 "Bottom": "Dip",
 "Bull": "İyi",
 "Buy & hold (full)": "Al-tut (tüm dönem)",
 "Buy & hold (out-of-sample)": "Al-tut (test dışı)",
 "By year": "Yıllara göre",
 "CAPM cost of equity": "CAPM özkaynak maliyeti",
 "CFO / net income (average)": "İşletme nakdi / net kâr (ortalama)",
 "CFO / net income (latest)": "İşletme nakdi / net kâr (son yıl)",
 "Can the company carry its debt?": "Şirket borcunu taşıyabilir mi?",
 "Capital allocation": "Sermaye tahsisi",
 "Capital expenditure": "Yatırım harcaması",
 "Cash behind the profit": "Kârın arkasındaki nakit",
 "Cash conversion cycle": "Nakit dönüşüm döngüsü",
 "Cash conversion cycle (days)": "Nakit dönüşüm döngüsü (gün)",
 "Choose one of the analyses above. Each one answers a single question with SEC filings and historical prices, and shows its sources.": "Yukarıdaki analizlerden birini seç. Her biri SEC raporları ve geçmiş fiyatlarla tek bir soruyu cevaplar ve kaynaklarını gösterir.",
 "Comparable company multiples": "Çarpan analizi (benzer şirketler)",
 "Credit check and Altman Z": "Kredi kontrolü ve Altman Z",
 "Crisis": "Kriz",
 "Crisis behaviour": "Kriz davranışı",
 "Criteria tested": "Test edilen kriter",
 "Current ratio improved": "Cari oran iyileşti",
 "Days": "Gün",
 "days": "gün",
 "Days from bottom to recovery": "Dipten toparlanmaya gün",
 "Days inventory": "Stok günü",
 "Days payables": "Borç günü",
 "Days sales outstanding": "Alacak tahsil günü",
 "Debt / assets": "Borç / varlıklar",
 "Debt repaid": "Geri ödenen borç",
 "Debt − cash": "Borç − nakit",
 "Difference": "Fark",
 "Dividends": "Temettüler",
 "Does profit really turn into cash?": "Kâr gerçekten nakde dönüşüyor mu?",
 "Does the company create value, or just grow?": "Şirket değer yaratıyor mu, yoksa sadece büyüyor mu?",
 "Does the rule work across many stocks, or was one result luck?": "Kural birçok hissede çalışıyor mu, yoksa tek sonuç şans mıydı?",
 "Downloading SEC filings and prices the first time can take up to a minute.": "SEC raporlarını ve fiyatları ilk kez indirmek bir dakika kadar sürebilir.",
 "DuPont analysis": "DuPont analizi",
 "EV/Sales": "FD/Satış",
 "EV/EBITDA": "FD/FAVÖK",
 "P/E": "F/K",
 "P/B": "PD/DD",
 "Earnings quality": "Kazanç kalitesi",
 "Earnings reaction (event study)": "Bilanço açıklaması etkisi",
 "Educational analysis of reported SEC data; not investment advice.": "Raporlanmış SEC verisiyle yapılmış eğitim amaçlı analizdir; yatırım tavsiyesi değildir.",
 "Enterprise value": "Firma değeri",
 "Equal weight": "Eşit ağırlık",
 "Equity multiplier": "Borç çarpanı (varlık/özkaynak)",
 "Equity risk premium %": "Hisse risk primi %",
 "Equity value": "Özkaynak değeri",
 "F-score": "F-skoru",
 "F-score (out of tested criteria)": "F-skoru (test edilen kriterler üzerinden)",
 "FCF / net income": "Serbest nakit / net kâr",
 "FCF margin % (blank = 3-year average)": "Serbest nakit marjı % (boş = son 3 yıl ortalaması)",
 "FCF yield": "Serbest nakit getirisi",
 "First trading day": "İlk işlem günü",
 "Free-cash-flow margin used": "Kullanılan serbest nakit marjı",
 "Full period": "Tüm dönem",
 "Fundamentals": "Temel analiz",
 "Gross margin improved": "Brüt marj arttı",
 "Growth of 100": "100’ün büyümesi",
 "Growth of 100 over 2 years": "2 yılda 100’ün büyümesi",
 "Honest strategy test": "Dürüst strateji testi",
 "How hard did it fall in a crisis, and how fast did it recover?": "Krizde ne kadar düştü, ne kadar hızlı toparlandı?",
 "How long is cash tied up in receivables and inventory?": "Nakit alacak ve stokta ne kadar bekliyor?",
 "How much does it move with the market?": "Piyasayla ne kadar birlikte hareket ediyor?",
 "How much does the answer depend on the assumptions?": "Sonuç varsayımlara ne kadar bağlı?",
 "Implied annual growth (10 years)": "Fiyatın varsaydığı yıllık büyüme (10 yıl)",
 "Inputs": "Girdiler",
 "Interest coverage": "Faiz karşılama",
 "Invested capital": "Yatırılan sermaye",
 "Is it cheap or expensive relative to its peers?": "Rakiplerine göre ucuz mu, pahalı mı?",
 "Is return on equity driven by margins, efficiency or debt?": "Özkaynak kârlılığı marjdan mı, verimlilikten mi, borçtan mı geliyor?",
 "Item": "Kalem",
 "Largest fall": "En büyük düşüş",
 "Largest fall in each crisis": "Her krizdeki en büyük düşüş",
 "Latest": "Son yıl",
 "LinkedIn draft": "LinkedIn taslağı",
 "Loading…": "Yükleniyor…",
 "Long-term debt / assets fell": "Uzun vadeli borç / varlıklar düştü",
 "Market day 0": "Piyasa (0. gün)",
 "Market value": "Piyasa değeri",
 "Method and limits": "Yöntem ve sınırlar",
 "Minimum variance (fitted on first half)": "Minimum varyans (ilk yarıda belirlendi)",
 "Minimum-variance weights (fitted on the first half only)": "Minimum varyans ağırlıkları (sadece ilk yarıdan)",
 "Model EV": "Model firma değeri",
 "Model enterprise value": "Model firma değeri",
 "Model enterprise value by growth assumption": "Büyüme varsayımına göre model firma değeri",
 "Model value at other growth rates": "Başka büyüme oranlarında model değeri",
 "abnormal return = stock − SPY over the same days": "anormal getiri = hisse − SPY (aynı günler)",
 "return on invested capital": "yatırılan sermayenin getirisi",
 "credit metrics": "kredi göstergeleri",
 "ROE = net margin × asset turnover × equity multiplier": "ROE = net marj × varlık devir hızı × borç çarpanı",
 "Net debt / EBITDA": "Net borç / FAVÖK",
 "Nine tests, latest fiscal year vs the year before": "Dokuz test: son mali yıl ve önceki yıl",
 "No increase in shares": "Hisse sayısı artmadı",
 "Not investment advice": "Yatırım tavsiyesi değildir",
 "Observations": "Gözlem",
 "Operating cash flow": "İşletme nakit akışı",
 "Operating cash flow > 0": "İşletme nakdi > 0",
 "Operating cash flow > net income": "İşletme nakdi > net kâr",
 "Operating margin by fiscal year": "Mali yıllara göre faaliyet marjı",
 "Operating margin through the cycle": "Döngü boyunca faaliyet marjı",
 "Out-of-sample (second half)": "Test dışı (ikinci yarı)",
 "Out-of-sample starts": "Test dışı başlangıcı",
 "Out-of-sample: strategy minus buy-and-hold (pts)": "Test dışı: strateji eksi al-tut (puan)",
 "Fall from the window start and recovery": "Dönem başından düşüş ve toparlanma",
 "Peer median": "Rakip ortancası",
 "Period": "Dönem",
 "Pick an analysis": "Bir analiz seç",
 "Piotroski F-score": "Piotroski F-skoru",
 "Portfolio construction": "Portföy kurma",
 "Position changes": "Pozisyon değişimi",
 "Price": "Fiyat",
 "Quant": "Kantitatif",
 "ROIC vs WACC": "ROIC ve WACC",
 "Regression on SPY (S&P 500 ETF)": "SPY’ye (S&P 500 ETF) göre regresyon",
 "Release (8-K)": "Açıklama (8-K)",
 "Results (annualised)": "Sonuçlar (yıllık)",
 "Return on assets > 0": "Varlık getirisi > 0",
 "Return on assets improved": "Varlık getirisi arttı",
 "Return on equity": "Özkaynak kârlılığı",
 "Return over the window": "Pencere boyunca getiri",
 "Revenue (TTM)": "Gelir (son 12 ay)",
 "Revenue CAGR": "Gelir yıllık bileşik büyüme",
 "Reverse DCF": "Ters DCF",
 "Risk and credit": "Risk ve kredi",
 "Risk-free rate %": "Risksiz faiz %",
 "Run analysis": "Analizi çalıştır",
 "R²": "R²",
 "Scenario": "Senaryo",
 "Scenarios and sensitivity": "Senaryo ve duyarlılık",
 "Sector / cycle comparison": "Sektör / döngü karşılaştırması",
 "Share buybacks": "Hisse geri alımları",
 "Shares outstanding": "Dolaşımdaki hisse",
 "Sharpe": "Sharpe",
 "Sources": "Kaynaklar",
 "Source": "Kaynak",
 "Spread": "Fark",
 "Stock day 0": "Hisse (0. gün)",
 "Strategy (full)": "Strateji (tüm dönem)",
 "Strategy (out-of-sample)": "Strateji (test dışı)",
 "Symbol": "Sembol",
 "Tax rate used": "Kullanılan vergi oranı",
 "Terminal value share": "Devam eden değerin payı",
 "Ticker": "Hisse kodu",
 "Tickers (comma separated)": "Şirket kodları (virgülle)",
 "Timing": "Zamanlama",
 "Total": "Toplam",
 "Use": "Kullanım",
 "Use the example": "Örneği kullan",
 "Uses of cash (5-year total)": "Nakdin kullanımı (5 yıllık toplam)",
 "Uses of cash, 5-year total": "Nakdin kullanımı, 5 yıllık toplam",
 "Valuation multiples": "Değerleme çarpanları",
 "Value": "Değer",
 "Value per share": "Hisse başına değer",
 "Value per share by scenario": "Senaryolara göre hisse başına değer",
 "Value per share: WACC (rows) × terminal growth (columns)": "Hisse başına değer: WACC (satırlar) × uzun vadeli büyüme (sütunlar)",
 "Volatility": "Oynaklık",
 "Volatility (annual)": "Oynaklık (yıllık)",
 "Volatility (pts)": "Oynaklık (puan)",
 "WACC (your input)": "WACC (senin girdin)",
 "WACC / terminal growth": "WACC / uzun vadeli büyüme",
 "Watch items": "Dikkat işaretleri",
 "Weight": "Ağırlık",
 "What does the stock do after results are published?": "Sonuçlar açıklandıktan sonra hisse ne yapıyor?",
 "What growth does today's price assume?": "Bugünkü fiyat nasıl bir büyüme varsayıyor?",
 "Where did the cash go?": "Nakit nereye gitti?",
 "Which mix gives more return for the same risk?": "Hangi karışım aynı riskle daha çok getiri sağlıyor?",
 "Who holds up best through the cycle?": "Döngü boyunca kim daha dayanıklı?",
 "Whose financial health is improving?": "Kimin finansal sağlığı iyileşiyor?",
 "Window": "Pencere",
 "Working-capital days (latest fiscal year)": "İşletme sermayesi günleri (son mali yıl)",
 "Worst year": "En kötü yıl",
 "Worst year date": "En kötü yılın tarihi",
 "Year-1 growth": "1. yıl büyümesi",
 "Year-1 growth % (blank = history)": "1. yıl büyümesi % (boş = geçmiş ortalama)",
 "Z''": "Z''",
 "Zone": "Bölge",
 "after close": "kapanıştan sonra",
 "before/during market": "açılıştan önce/seans içinde",
 "safe": "güvenli",
 "grey": "gri",
 "distress": "riskli",
 "vs latest price": "son fiyata göre",
 "vs today": "bugüne göre",
 "Fiscal year": "Mali yıl",
 "Net margin": "Net kâr marjı",
 "Company": "Şirket",
 "KEY FINDINGS": "ÖNE ÇIKANLAR",
 "USE THIS RESULT": "BU SONUCU KULLAN",
 "Strategy": "Strateji",
 "Annual revenue growth": "Yıllık gelir büyümesi",
 "SMA crossover: strategy vs buy-and-hold": "Hareketli ortalama kesişimi: strateji ve al-tut",
 "Momentum: strategy vs buy-and-hold": "Momentum: strateji ve al-tut",
 "Revenue (FY)": "Gelir (mali yıl)",
 "Yahoo Finance prices (adjusted for splits and dividends)": "Yahoo Finance fiyatları (bölünme ve temettüye göre düzeltilmiş)",
 "Yahoo Finance prices (adjusted closes)": "Yahoo Finance fiyatları (düzeltilmiş kapanışlar)",
 "Yahoo Finance share price": "Yahoo Finance hisse fiyatı",
 "filed on": "yayın tarihi",
 "10-K XBRL instance": "10-K XBRL dosyası",
 "Abnormal return": "Anormal getiri",
 "Announcement date": "Duyuru tarihi",
 "Beat BIST 100 in dollars": "Dolar bazında BIST 100’ü geçti",
 "Cash paid for acquisitions": "Satın almalara ödenen nakit",
 "Correlation": "Korelasyon",
 "Diluted shares (m)": "Seyreltilmiş hisse (milyon)",
 "Dollar return per year": "Yıllık dolar getirisi",
 "FX beta": "Kur betası",
 "Foreign-currency revenue % (KAP annual report, optional)": "Döviz gelir payı % (KAP faaliyet raporu, isteğe bağlı)",
 "Goodwill": "Şerefiye",
 "Goodwill / assets": "Şerefiye / varlıklar",
 "How did the market react, what premium was paid, and what changed afterwards?": "Piyasa nasıl tepki verdi, ne kadar prim ödendi, sonra ne değişti?",
 "How much of the lira return survives in dollars, and how does the stock move with the exchange rate?": "TL getirisinin ne kadarı dolar bazında kalıyor, hisse kurla nasıl hareket ediyor?",
 "KAP — Public Disclosure Platform (annual reports, for the FX revenue share)": "KAP — Kamuyu Aydınlatma Platformu (döviz gelir payı için faaliyet raporları)",
 "M&A case study": "Birleşme ve satın alma vakası",
 "Market (SPY)": "Piyasa (SPY)",
 "Months": "Ay",
 "Offer price per share ($)": "Hisse başına teklif fiyatı ($)",
 "Return in dollars": "Dolar bazında getiri",
 "Return in lira": "TL bazında getiri",
 "Revenue growth per year": "Yıllık gelir büyümesi",
 "Segment": "Bölüm",
 "Segment analysis": "Segment analizi",
 "Segment operating income": "Bölüm faaliyet kârı",
 "Segment operating margin": "Bölüm faaliyet marjı",
 "Share change": "Pay değişimi (puan)",
 "Share of revenue (latest year)": "Gelirdeki payı (son yıl)",
 "Stock": "Hisse",
 "Target symbol (if still listed)": "Hedef şirket kodu (hâlâ işlem görüyorsa)",
 "Target's close before the announcement ($)": "Hedefin duyuru öncesi kapanışı ($)",
 "Total debt": "Toplam borç",
 "Turkey: lira vs dollar returns": "Türkiye: TL ve dolar bazında getiri",
 "USD/TRY change": "Dolar/TL değişimi",
 "Yahoo Finance USD/TRY (USDTRY=X)": "Yahoo Finance Dolar/TL (USDTRY=X)",
 "Which businesses drive revenue, and which are growing?": "Geliri hangi iş kolları taşıyor, hangileri büyüyor?",
 "PUBLISH THIS ANALYSIS": "BU ANALİZİ YAYINLA",
 "A post is yours when it says what you think and where you could be wrong. Both are required before the LinkedIn draft, the image and the carousel unlock.": "Bir gönderi, ne düşündüğünü ve nerede yanılıyor olabileceğini söylediğinde senindir. LinkedIn taslağı, görsel ve carousel açılmadan önce ikisi de zorunlu.",
 "Your name on the post": "Gönderideki adın",
 "First and last name": "Ad ve soyad",
 "What I think": "Ben ne düşünüyorum",
 "Why I might be wrong": "Neden yanılıyor olabilirim",
 "at least": "en az",
 "Example: Segment growth tells me the cloud business now carries the company. I expect its share to keep rising because...": "Örnek: Bölüm büyümesine bakınca şirketi artık bulut işinin taşıdığını düşünüyorum. Payının artmaya devam edeceğini bekliyorum, çünkü...",
 "Example: Three years is a short window, and one large contract could explain most of the growth.": "Örnek: Üç yıl kısa bir dönem; büyümenin çoğunu tek bir büyük sözleşme açıklıyor olabilir.",
 "Write your view and your counterargument to unlock publishing.": "Yayınlamak için tezini ve görüşe yönelik riskleri yaz.",
 "LinkedIn carousel (PDF)": "PDF indir",
 "The carousel could not be drawn in this browser.": "Carousel bu tarayıcıda çizilemedi.",
 "Carousel downloaded": "Carousel indirildi",
 "slides": "sayfa",
 "On LinkedIn: Start a post → Add a document → choose this PDF and give it a title.": "LinkedIn’de: Gönderi başlat → Belge ekle → bu PDF’i seç ve bir başlık ver.",
 "Download again": "Tekrar indir",
 "Slide": "Sayfa",
 "WHAT I THINK": "BEN NE DÜŞÜNÜYORUM",
 "WHY I MIGHT BE WRONG": "NEDEN YANILIYOR OLABİLİRİM",
 "SOURCES AND METHOD": "KAYNAKLAR VE YÖNTEM",
 "Full table in the analysis": "Tablonun tamamı analizde",
 "By": "Hazırlayan:",
 "Swipe": "Kaydır"
});
Object.assign(QE_ES, {
 "Analysis Lab": "Laboratorio de análisis",
 "Analysis lab": "Laboratorio de análisis",
 "Analyst tools built on SEC filings and historical prices. Each answers one question and shows its sources.": "Herramientas de analista basadas en informes de la SEC y precios históricos. Cada una responde una pregunta y muestra sus fuentes.",
 "Run analysis": "Ejecutar análisis",
 "Pick an analysis": "Elige un análisis",
 "KEY FINDINGS": "CONCLUSIONES",
 "Sources": "Fuentes",
 "Method and limits": "Método y límites",
 "Fundamentals": "Fundamentales",
 "Valuation": "Valoración",
 "Risk and credit": "Riesgo y crédito",
 "Quant": "Cuantitativo",
 "Add to report notes": "Añadir a las notas",
 "LinkedIn draft": "Borrador de LinkedIn",
 "USE THIS RESULT": "USA ESTE RESULTADO",
 "Use the example": "Usar el ejemplo",
 "Tickers (comma separated)": "Símbolos (separados por comas)",
 "Sector / cycle comparison": "Comparación sectorial / de ciclo",
 "Who holds up best through the cycle?": "¿Quién resiste mejor a lo largo del ciclo?",
 "Earnings quality": "Calidad de las ganancias",
 "Does profit really turn into cash?": "¿El beneficio se convierte realmente en caja?",
 "Reverse DCF": "DCF inverso",
 "What growth does today's price assume?": "¿Qué crecimiento asume el precio actual?",
 "Scenarios and sensitivity": "Escenarios y sensibilidad",
 "How much does the answer depend on the assumptions?": "¿Cuánto depende el resultado de los supuestos?",
 "Piotroski F-score": "Puntuación F de Piotroski",
 "Whose financial health is improving?": "¿Qué salud financiera está mejorando?",
 "Earnings reaction (event study)": "Reacción a resultados (estudio de eventos)",
 "What does the stock do after results are published?": "¿Qué hace la acción tras publicar resultados?",
 "Honest strategy test": "Prueba honesta de estrategia",
 "Does the rule work across many stocks, or was one result luck?": "¿La regla funciona en muchas acciones o un resultado fue suerte?",
 "Portfolio construction": "Construcción de cartera",
 "Which mix gives more return for the same risk?": "¿Qué combinación da más rentabilidad con el mismo riesgo?",
 "DuPont analysis": "Análisis DuPont",
 "Is return on equity driven by margins, efficiency or debt?": "¿La rentabilidad del patrimonio viene del margen, la eficiencia o la deuda?",
 "Cash conversion cycle": "Ciclo de conversión de caja",
 "How long is cash tied up in receivables and inventory?": "¿Cuánto tiempo queda la caja atrapada en cobros e inventario?",
 "Capital allocation": "Asignación de capital",
 "Where did the cash go?": "¿A dónde fue la caja?",
 "ROIC vs WACC": "ROIC frente a WACC",
 "Does the company create value, or just grow?": "¿La empresa crea valor o solo crece?",
 "Comparable company multiples": "Múltiplos de comparables",
 "Is it cheap or expensive relative to its peers?": "¿Es barata o cara frente a sus pares?",
 "Credit check and Altman Z": "Revisión de crédito y Altman Z",
 "Can the company carry its debt?": "¿Puede la empresa soportar su deuda?",
 "Beta and CAPM": "Beta y CAPM",
 "How much does it move with the market?": "¿Cuánto se mueve con el mercado?",
 "Crisis behaviour": "Comportamiento en crisis",
 "How hard did it fall in a crisis, and how fast did it recover?": "¿Cuánto cayó en una crisis y qué tan rápido se recuperó?",
 "Terminal growth %": "Crecimiento terminal %",
 "FCF margin % (blank = 3-year average)": "Margen de FCF % (vacío = media de 3 años)",
 "Year-1 growth % (blank = history)": "Crecimiento año 1 % (vacío = histórico)",
 "Risk-free rate %": "Tasa libre de riesgo %",
 "Equity risk premium %": "Prima de riesgo de mercado %",
 "Strategy": "Estrategia",
 "Fast MA": "Media rápida",
 "Slow MA": "Media lenta",
 "Momentum lookback (days)": "Ventana de momentum (días)",
 "Fee (bps)": "Comisión (pb)",
 "Slippage (bps)": "Deslizamiento (pb)",
 "Training %": "Entrenamiento %",
 "Ticker": "Símbolo",
 "SEC contact email": "Correo de contacto para la SEC",
 "Download PNG": "Descargar PNG",
 "Copy for LinkedIn": "Copiar para LinkedIn",
 "Added to your report notes.": "Añadido a las notas del informe.",
 "Not investment advice": "No es asesoramiento de inversión",
 "Source": "Fuente",
 "Analyses": "Análisis",
 "Choose one of the analyses above. Each one answers a single question with SEC filings and historical prices, and shows its sources.": "Elige uno de los análisis de arriba. Cada uno responde una sola pregunta con informes de la SEC y precios históricos, y muestra sus fuentes.",
 "Downloading SEC filings and prices the first time can take up to a minute.": "La primera descarga de informes de la SEC y precios puede tardar hasta un minuto.",
 "Chart card for LinkedIn": "Tarjeta de gráfico para LinkedIn",
 "Yahoo Finance prices (adjusted for splits and dividends)": "Precios de Yahoo Finance (ajustados por splits y dividendos)",
 "Yahoo Finance prices (adjusted closes)": "Precios de Yahoo Finance (cierres ajustados)",
 "Yahoo Finance share price": "Precio de la acción en Yahoo Finance",
 "filed on": "presentado el",
 "Segment analysis": "Análisis por segmentos",
 "Which businesses drive revenue, and which are growing?": "¿Qué negocios generan los ingresos y cuáles crecen?",
 "M&A case study": "Caso de fusión y adquisición",
 "How did the market react, what premium was paid, and what changed afterwards?": "¿Cómo reaccionó el mercado, qué prima se pagó y qué cambió después?",
 "Turkey: lira vs dollar returns": "Turquía: rentabilidad en liras y en dólares",
 "How much of the lira return survives in dollars, and how does the stock move with the exchange rate?": "¿Cuánto de la rentabilidad en liras queda en dólares y cómo se mueve la acción con el tipo de cambio?",
 "Announcement date": "Fecha del anuncio",
 "Offer price per share ($)": "Precio de la oferta por acción ($)",
 "Target's close before the announcement ($)": "Cierre de la empresa objetivo antes del anuncio ($)",
 "Target symbol (if still listed)": "Símbolo de la empresa objetivo (si aún cotiza)",
 "Foreign-currency revenue % (KAP annual report, optional)": "Ingresos en divisas % (informe anual KAP, opcional)",
 "10-K XBRL instance": "archivo XBRL del 10-K",
 "PUBLISH THIS ANALYSIS": "PUBLICA ESTE ANÁLISIS",
 "A post is yours when it says what you think and where you could be wrong. Both are required before the LinkedIn draft, the image and the carousel unlock.": "Una publicación es tuya cuando dice lo que piensas y dónde podrías equivocarte. Ambas cosas son obligatorias para desbloquear el borrador, la imagen y el carrusel.",
 "Your name on the post": "Tu nombre en la publicación",
 "First and last name": "Nombre y apellido",
 "What I think": "Lo que pienso",
 "Why I might be wrong": "Por qué podría equivocarme",
 "at least": "al menos",
 "Write your view and your counterargument to unlock publishing.": "Escribe tu opinión y tu contraargumento para desbloquear la publicación.",
 "LinkedIn carousel (PDF)": "Descargar PDF",
 "Carousel downloaded": "Carrusel descargado",
 "slides": "páginas",
 "On LinkedIn: Start a post → Add a document → choose this PDF and give it a title.": "En LinkedIn: Crear publicación → Añadir documento → elige este PDF y ponle un título.",
 "Download again": "Descargar de nuevo",
 "Slide": "Página",
 "WHAT I THINK": "LO QUE PIENSO",
 "WHY I MIGHT BE WRONG": "POR QUÉ PODRÍA EQUIVOCARME",
 "SOURCES AND METHOD": "FUENTES Y MÉTODO",
 "Full table in the analysis": "Tabla completa en el análisis",
 "By": "Por",
 "Swipe": "Desliza",
 "Check your wording before posting": "Revisa tu redacción antes de publicar"
});

/* v0.13.5 Public site (GitHub Pages) */
Object.assign(QE_TR, {
 "Public Site": "Sitem",
 "My public site": "Herkese açık sitem",
 "Open my public site": "Herkese açık sitemi aç",
 "Publish chosen analyses as a free website you can link from your CV and LinkedIn.": "Seçtiğin analizleri CV’ne ve LinkedIn profiline ekleyebileceğin ücretsiz bir web sitesi olarak yayınla.",
 "Add to my public site": "Siteme ekle",
 "Added to your public site.": "Herkese açık sitene eklendi.",
 "ABOUT YOU": "SENİN HAKKINDA",
 "Site settings": "Site ayarları",
 "This is the top of your site. Keep it short and true: who you are and what you are curious about.": "Burası sitenin en üstünde görünür. Kısa ve doğru tut: kimsin ve neyi merak ediyorsun?",
 "Your name": "Adın",
 "Headline": "Başlık",
 "Example: High-school student interested in company analysis": "Örnek: Şirket analizine ilgi duyan lise öğrencisi",
 "Short bio": "Kısa tanıtım",
 "Example: I study how companies make money, using SEC filings and price history. These analyses are my own practice work.": "Örnek: Şirketlerin nasıl para kazandığını SEC belgeleri ve fiyat geçmişiyle inceliyorum. Bu analizler kendi çalışmalarım.",
 "LinkedIn profile URL (optional)": "LinkedIn profil adresi (isteğe bağlı)",
 "The LinkedIn link must start with https://": "LinkedIn bağlantısı https:// ile başlamalı",
 "Use your LinkedIn profile address, for example https://www.linkedin.com/in/your-name": "LinkedIn profil adresini kullan, örneğin https://www.linkedin.com/in/adin-soyadin",
 "Site language": "Site dili",
 "Save": "Kaydet",
 "Unsaved changes": "Kaydedilmemiş değişiklikler var",
 "Site settings saved.": "Site ayarları kaydedildi.",
 "ON YOUR SITE": "SİTENDE",
 "Your published analyses": "Yayınladığın analizler",
 "analyses": "analiz",
 "reviewed": "değerlendirildi",
 "reviews": "değerlendirme",
 "Not reviewed yet": "Henüz değerlendirilmedi",
 "Preview": "Önizle",
 "Was I right?": "Haklı çıktım mı?",
 "Remove from site": "Siteden kaldır",
 "Yes, remove it": "Evet, kaldır",
 "Cancel": "Vazgeç",
 "Click again to remove this analysis from your site. Your reviews of it are deleted too.": "Bu analizi sitenden kaldırmak için bir kez daha tıkla. Ona yazdığın değerlendirmeler de silinir.",
 "Removed from your site. If the site is already online, also delete this file in your GitHub repository:": "Sitenden kaldırıldı. Siten zaten yayındaysa GitHub deposundaki şu dosyayı da sil:",
 "Come back after new results and say whether your view held. Every review is added to the page, so visitors see how your thinking developed.": "Yeni sonuçlar açıklandıktan sonra geri gel ve görüşünün tutup tutmadığını yaz. Her değerlendirme sayfaya eklenir; ziyaretçiler düşüncenin nasıl geliştiğini görür.",
 "No analyses on your site yet": "Sitende henüz analiz yok",
 "In the Analysis Lab, run an analysis, write what you think and why you might be wrong, then press Add to my public site.": "Analiz Laboratuvarı’nda bir analiz çalıştır, ne düşündüğünü ve neden yanılıyor olabileceğini yaz, sonra “Siteme ekle” düğmesine bas.",
 "Open the Analysis Lab": "Analiz Laboratuvarı’nı aç",
 "PUBLISH FOR FREE": "ÜCRETSİZ YAYINLA",
 "Put it online": "İnternete koy",
 "Your site is a few plain files with no ads and no tracking. GitHub Pages hosts it for free at one link you can put on your CV and LinkedIn.": "Siten reklamsız ve takipsiz birkaç basit dosyadan oluşur. GitHub Pages onu ücretsiz yayınlar; CV’ne ve LinkedIn’e tek bir bağlantı eklersin.",
 "Preview site": "Siteyi önizle",
 "Download site (ZIP)": "Siteyi indir (ZIP)",
 "Save your settings first; the preview and the ZIP use the saved version.": "Önce ayarlarını kaydet; önizleme ve ZIP kaydedilmiş hâli kullanır.",
 "Add at least one analysis before you publish.": "Yayınlamadan önce en az bir analiz ekle.",
 "GitHub Pages in 7 steps": "7 adımda GitHub Pages",
 "Create a free account at github.com.": "github.com adresinde ücretsiz bir hesap aç.",
 "Create a new public repository, for example named analizler.": "Yeni bir herkese açık (Public) depo oluştur, örneğin adı analizler olsun.",
 "In the repository choose Add file → Upload files.": "Depoda Add file → Upload files seçeneğine tıkla.",
 "Unzip the downloaded file and drag ALL of its files and folders onto the page.": "İndirdiğin ZIP’i aç ve içindeki TÜM dosya ve klasörleri sayfaya sürükle.",
 "Click Commit changes.": "Commit changes düğmesine tıkla.",
 "Open Settings → Pages. Under Source choose Deploy from a branch, then main and / (root), and click Save.": "Settings → Pages bölümünü aç. Source altında Deploy from a branch, ardından main ve / (root) seç ve Save’e tıkla.",
 "After about a minute your site is live at https://USERNAME.github.io/analizler/ (USERNAME is your GitHub user name).": "Yaklaşık bir dakika sonra siten https://KULLANICIADI.github.io/analizler/ adresinde açılır (KULLANICIADI GitHub kullanıcı adındır).",
 "To update the site later: download the ZIP again and upload the files again; GitHub replaces the old ones.": "Siteyi sonra güncellemek için ZIP’i yeniden indir ve dosyaları tekrar yükle; GitHub eskilerinin yerine koyar.",
 "On LinkedIn: Profile → Add section → Featured → Add a link, or Contact info → Website.": "LinkedIn’de: Profil → Bölüm ekle → Öne çıkanlar → Bağlantı ekle ya da İletişim bilgileri → Web sitesi.",
 "What becomes public": "Neler herkese açık olur?",
 "Only the analyses listed on this page, with your view and counterargument, plus your name, headline, bio and LinkedIn link.": "Yalnızca bu sayfada listelenen analizler (görüşün ve karşı görüşünle birlikte), adın, başlığın, tanıtımın ve LinkedIn bağlantın.",
 "QuantEdge itself, your report notes, library drafts and everything else stay on your computer.": "QuantEdge’in kendisi, rapor notların, kitaplıktaki taslakların ve geri kalan her şey bilgisayarında kalır.",
 "Educational analysis, not investment advice. Anyone with the link can read your site.": "Eğitim amaçlı analizdir, yatırım tavsiyesi değildir. Bağlantıya sahip herkes siteni okuyabilir."
});
Object.assign(QE_ES, {
 "Public Site": "Mi sitio",
 "My public site": "Mi sitio público",
 "Open my public site": "Abrir mi sitio público",
 "Publish chosen analyses as a free website you can link from your CV and LinkedIn.": "Publica los análisis que elijas como un sitio web gratuito que puedes enlazar desde tu CV y LinkedIn.",
 "Add to my public site": "Añadir a mi sitio",
 "Added to your public site.": "Añadido a tu sitio público.",
 "ABOUT YOU": "SOBRE TI",
 "Site settings": "Ajustes del sitio",
 "This is the top of your site. Keep it short and true: who you are and what you are curious about.": "Esto aparece arriba de tu sitio. Breve y verdadero: quién eres y qué te interesa.",
 "Your name": "Tu nombre",
 "Headline": "Titular",
 "Example: High-school student interested in company analysis": "Ejemplo: Estudiante de bachillerato interesado en el análisis de empresas",
 "Short bio": "Biografía breve",
 "Example: I study how companies make money, using SEC filings and price history. These analyses are my own practice work.": "Ejemplo: Estudio cómo ganan dinero las empresas con informes de la SEC e historial de precios. Estos análisis son mi propia práctica.",
 "LinkedIn profile URL (optional)": "URL de tu perfil de LinkedIn (opcional)",
 "The LinkedIn link must start with https://": "El enlace de LinkedIn debe empezar por https://",
 "Use your LinkedIn profile address, for example https://www.linkedin.com/in/your-name": "Usa la dirección de tu perfil de LinkedIn, por ejemplo https://www.linkedin.com/in/tu-nombre",
 "Site language": "Idioma del sitio",
 "Save": "Guardar",
 "Unsaved changes": "Cambios sin guardar",
 "Site settings saved.": "Ajustes del sitio guardados.",
 "ON YOUR SITE": "EN TU SITIO",
 "Your published analyses": "Tus análisis publicados",
 "analyses": "análisis",
 "reviewed": "revisados",
 "reviews": "revisiones",
 "Not reviewed yet": "Aún sin revisar",
 "Preview": "Vista previa",
 "Was I right?": "¿Tenía razón?",
 "Remove from site": "Quitar del sitio",
 "Yes, remove it": "Sí, quitarlo",
 "Cancel": "Cancelar",
 "Click again to remove this analysis from your site. Your reviews of it are deleted too.": "Haz clic otra vez para quitar este análisis de tu sitio. También se borran sus revisiones.",
 "Removed from your site. If the site is already online, also delete this file in your GitHub repository:": "Quitado de tu sitio. Si el sitio ya está en línea, borra también este archivo en tu repositorio de GitHub:",
 "Come back after new results and say whether your view held. Every review is added to the page, so visitors see how your thinking developed.": "Vuelve tras nuevos resultados y di si tu opinión se cumplió. Cada revisión se añade a la página, así se ve cómo evolucionó tu razonamiento.",
 "No analyses on your site yet": "Aún no hay análisis en tu sitio",
 "In the Analysis Lab, run an analysis, write what you think and why you might be wrong, then press Add to my public site.": "En el Laboratorio de análisis, ejecuta un análisis, escribe lo que piensas y por qué podrías equivocarte, y pulsa «Añadir a mi sitio».",
 "Open the Analysis Lab": "Abrir el Laboratorio de análisis",
 "PUBLISH FOR FREE": "PUBLICA GRATIS",
 "Put it online": "Ponlo en línea",
 "Your site is a few plain files with no ads and no tracking. GitHub Pages hosts it for free at one link you can put on your CV and LinkedIn.": "Tu sitio son unos pocos archivos sin anuncios ni rastreo. GitHub Pages lo aloja gratis en un enlace que puedes poner en tu CV y LinkedIn.",
 "Preview site": "Vista previa del sitio",
 "Download site (ZIP)": "Descargar sitio (ZIP)",
 "Save your settings first; the preview and the ZIP use the saved version.": "Guarda primero tus ajustes; la vista previa y el ZIP usan la versión guardada.",
 "Add at least one analysis before you publish.": "Añade al menos un análisis antes de publicar.",
 "GitHub Pages in 7 steps": "GitHub Pages en 7 pasos",
 "Create a free account at github.com.": "Crea una cuenta gratuita en github.com.",
 "Create a new public repository, for example named analizler.": "Crea un repositorio público nuevo, por ejemplo llamado analizler.",
 "In the repository choose Add file → Upload files.": "En el repositorio elige Add file → Upload files.",
 "Unzip the downloaded file and drag ALL of its files and folders onto the page.": "Descomprime el archivo descargado y arrastra TODOS sus archivos y carpetas a la página.",
 "Click Commit changes.": "Pulsa Commit changes.",
 "Open Settings → Pages. Under Source choose Deploy from a branch, then main and / (root), and click Save.": "Abre Settings → Pages. En Source elige Deploy from a branch, luego main y / (root), y pulsa Save.",
 "After about a minute your site is live at https://USERNAME.github.io/analizler/ (USERNAME is your GitHub user name).": "En un minuto aproximadamente tu sitio estará en https://USUARIO.github.io/analizler/ (USUARIO es tu nombre de usuario de GitHub).",
 "To update the site later: download the ZIP again and upload the files again; GitHub replaces the old ones.": "Para actualizarlo: descarga el ZIP de nuevo y vuelve a subir los archivos; GitHub reemplaza los antiguos.",
 "On LinkedIn: Profile → Add section → Featured → Add a link, or Contact info → Website.": "En LinkedIn: Perfil → Añadir sección → Destacados → Añadir enlace, o Información de contacto → Sitio web.",
 "What becomes public": "Qué se hace público",
 "Only the analyses listed on this page, with your view and counterargument, plus your name, headline, bio and LinkedIn link.": "Solo los análisis de esta página, con tu opinión y tu contraargumento, además de tu nombre, titular, biografía y enlace de LinkedIn.",
 "QuantEdge itself, your report notes, library drafts and everything else stay on your computer.": "QuantEdge, tus notas de informe, los borradores de la biblioteca y todo lo demás se quedan en tu ordenador.",
 "Educational analysis, not investment advice. Anyone with the link can read your site.": "Análisis educativo, no asesoramiento financiero. Cualquiera con el enlace puede leer tu sitio.",
 "Loading…": "Cargando…",
 "Your verdict": "Tu valoración",
 "What happened, and what did you learn? (optional)": "¿Qué pasó y qué aprendiste? (opcional)"
});

Object.assign(QE_TR, {
 "Added to my site ✓": "Siteme eklendi ✓",
 "Only the home page uses this; each analysis keeps the language it was published in.": "Bu sadece ana sayfa için geçerli; her analiz yayınlandığı dilde kalır.",
 "Some analyses were published in another language, so your site will mix languages.": "Bazı analizler başka bir dilde yayınlandı; sitende diller karışık görünecek.",
 "Removed from your site. If the site is already online, delete this file in your GitHub repository and upload the new index.html from a fresh ZIP:": "Sitenden kaldırıldı. Site zaten yayındaysa GitHub deposunda bu dosyayı sil ve yeni indirdiğin ZIP’teki index.html’i yükle:",
 "Create a new public repository, for example named analizler, and tick Add a README file.": "Yeni bir herkese açık (Public) depo oluştur, örneğin adı analizler olsun, ve Add a README file kutusunu işaretle.",
 "In the repository choose Add file → Upload files (on an empty repository: the uploading an existing file link).": "Depoda Add file → Upload files seç (boş depoda: uploading an existing file bağlantısı).",
 "Only the analyses listed on this page, with your view, counterargument and every Was I right? review and note, plus your name, headline, bio and LinkedIn link.": "Sadece bu sayfada listelenen analizler; görüşün, karşı görüşün ve her “Haklı çıktım mı?” değerlendirmen ile notu; ayrıca adın, başlığın, kısa tanıtımın ve LinkedIn bağlantın.",
 "Your site and its GitHub repository are fully public and can appear in search results; files you delete later stay in the repository history. Educational analysis, not investment advice.": "Siten ve GitHub deposu tamamen herkese açıktır ve arama sonuçlarında çıkabilir; sonradan sildiğin dosyalar deponun geçmişinde kalır. Eğitim amaçlı analizdir, yatırım tavsiyesi değildir.",
 "analysis": "analiz",
 "company": "şirket",
 "linkedin_url must be an https:// address on linkedin.com (or empty).": "LinkedIn bağlantısı linkedin.com’da bir https:// adresi olmalı (ya da boş bırak).",
 "result is too large to publish (limit 500 KB).": "Bu analiz yayınlamak için fazla büyük (sınır 500 KB)."
});
Object.assign(QE_ES, {
 "Added to my site ✓": "Añadido a mi sitio ✓",
 "Only the home page uses this; each analysis keeps the language it was published in.": "Solo afecta a la página de inicio; cada análisis conserva el idioma en que se publicó.",
 "Some analyses were published in another language, so your site will mix languages.": "Algunos análisis se publicaron en otro idioma, así que tu sitio mezclará idiomas.",
 "Removed from your site. If the site is already online, delete this file in your GitHub repository and upload the new index.html from a fresh ZIP:": "Eliminado de tu sitio. Si ya está en línea, borra este archivo en tu repositorio de GitHub y sube el nuevo index.html de un ZIP recién descargado:",
 "Create a new public repository, for example named analizler, and tick Add a README file.": "Crea un repositorio público nuevo, por ejemplo llamado analisis, y marca Add a README file.",
 "In the repository choose Add file → Upload files (on an empty repository: the uploading an existing file link).": "En el repositorio elige Add file → Upload files (en un repositorio vacío: el enlace uploading an existing file).",
 "Only the analyses listed on this page, with your view, counterargument and every Was I right? review and note, plus your name, headline, bio and LinkedIn link.": "Solo los análisis de esta página, con tu opinión, tu objeción y cada valoración “¿Acerté?” con su nota, además de tu nombre, titular, biografía y enlace de LinkedIn.",
 "Your site and its GitHub repository are fully public and can appear in search results; files you delete later stay in the repository history. Educational analysis, not investment advice.": "Tu sitio y su repositorio de GitHub son totalmente públicos y pueden aparecer en buscadores; los archivos que borres después quedan en el historial del repositorio. Análisis educativo, no es asesoramiento financiero.",
 "analysis": "análisis",
 "company": "empresa",
 "linkedin_url must be an https:// address on linkedin.com (or empty).": "El enlace de LinkedIn debe ser una dirección https:// de linkedin.com (o quedar vacío).",
 "result is too large to publish (limit 500 KB).": "Este análisis es demasiado grande para publicarlo (límite 500 KB)."
});

/* Writing-and-publishing desk: navigation, palette and shell copy. */
Object.assign(QE_TR, {
  'Open Analysis Lab': 'Analiz Laboratuvarı’nı aç',
  'Write a LinkedIn post': 'LinkedIn gönderisi yaz',
  'No matching action. Try “lab”, “save” or “NVDA”.': 'Eşleşen işlem yok. “lab”, “save” veya “NVDA” yazmayı dene.',
  'Go deeper in the Analysis Lab': 'Analiz Laboratuvarı’nda derinleş',
  'SEC figures and price history are downloaded only when you ask, and are not reconciled to the original filings. The Options tab loads a ticker (AAPL unless you type another) as soon as it opens: the current stock quote and option quotes delayed about 15 minutes. Saved drafts stay on this computer until you publish them yourself.':
    'SEC rakamları ve fiyat geçmişi yalnızca sen istediğinde indirilir ve orijinal raporlarla mutabakatı yapılmamıştır. Opsiyonlar sekmesi açılır açılmaz bir kod yükler (başka bir kod yazmadıysan AAPL): hissenin güncel fiyatı ve yaklaşık 15 dakika gecikmeli opsiyon kotasyonları. Kayıtlı taslaklar, sen yayımlayana kadar bu bilgisayarda kalır.',
  'Type a ticker and press Select': 'Bir şirket kodu yaz ve Seç’e bas',
  'Every figure shows its source: SEC filing, price history or your own assumption.': 'Her rakam kaynağını gösterir: SEC raporu, fiyat geçmişi veya kendi varsayımın.'
});
Object.assign(QE_ES, {
  'Open Analysis Lab': 'Abrir el laboratorio de análisis',
  'Write a LinkedIn post': 'Escribir una publicación de LinkedIn',
  'Open Research Publisher': 'Abrir el estudio de informes',
  'Open Research Library': 'Abrir la biblioteca de análisis',
  'Open guided research journey': 'Abrir la guía de investigación',
  'Load SEC fundamentals': 'Cargar datos fundamentales de la SEC',
  'Save research draft': 'Guardar borrador',
  'Navigate': 'Ir a', 'Action': 'Acción', 'Switch to': 'Cambiar a',
  'No matching action. Try “lab”, “save” or “NVDA”.': 'Ninguna acción coincide. Prueba “lab”, “save” o “NVDA”.',
  'Go deeper in the Analysis Lab': 'Profundiza en el laboratorio de análisis',
  'SEC figures and price history are downloaded only when you ask, and are not reconciled to the original filings. The Options tab loads a ticker (AAPL unless you type another) as soon as it opens: the current stock quote and option quotes delayed about 15 minutes. Saved drafts stay on this computer until you publish them yourself.':
    'Las cifras de la SEC y el historial de precios solo se descargan cuando lo pides y no están conciliados con los documentos originales. La pestaña Opciones carga un ticker al abrirse (AAPL si no escribes otro): la cotización actual de la acción y las de opciones con unos 15 minutos de retraso. Los borradores guardados permanecen en este ordenador hasta que tú los publiques.',
  'Type a ticker and press Select': 'Escribe un símbolo y pulsa Elegir',
  'Every figure shows its source: SEC filing, price history or your own assumption.': 'Cada cifra muestra su fuente: documento de la SEC, historial de precios o tu propio supuesto.'
});

function L(text) {
  if (typeof text !== 'string') return text;
  var table = QE_LANG === 'tr' ? QE_TR : QE_LANG === 'es' ? QE_ES : null;
  if (!table) return text;
  var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
  var hit = table[m[2]];
  return hit ? m[1] + hit + m[3] : text;
}

try { document.documentElement.lang = QE_LANG; } catch (_) {}

/* Lab titles often read "Company: description" or "description: AAA vs SPY". Translate the known side. */
function labL(text) {
  if (typeof text !== 'string') return text;
  var whole = L(text);
  if (whole !== text) return whole;
  var i = text.indexOf(': ');
  if (i < 0) return text;
  var left = text.slice(0, i), right = text.slice(i + 2);
  var tl = L(left), trt = L(right);
  if (trt !== right) return left + ': ' + trt;
  if (tl !== left) return tl + ': ' + right;
  return text;
}

/* v0.14 research desk: Home, the Analysis Lab note and its two publishing steps */
Object.assign(QE_TR, {
  'Exhibit': 'Şekil', 'Table': 'Tablo', 'see Sources': 'diğerleri Kaynaklar bölümünde', 'QuantEdge calculations.': 'Hesaplamalar QuantEdge’e aittir.',
  'Research note': 'Araştırma notu', 'Data as of': 'Veri tarihi:', 'Summary': 'Özet', 'Risks to the view': 'Görüşe yönelik riskler',
  'Write it in step 1': '1. adımda yaz',
  'Your view goes here. It leads the LinkedIn post and the public page.': 'Görüşün burada yer alacak. LinkedIn gönderisi ve sitendeki sayfa onunla başlar.',
  'Where could you be wrong? Your counterargument appears here.': 'Nerede yanılıyor olabilirsin? Karşı görüşün burada yer alacak.',
  'Analysis': 'Analiz', 'Publish this analysis': 'Bu analizi yayınla', 'Step': 'Adım',
  'Write your thesis and risks': 'Tezini ve risklerini yaz',
  'Your own words lead every output. The data only supports them.': 'Her çıktı senin cümlelerinle başlar; veriler yalnızca onları destekler.',
  'Choose outputs': 'Çıktıları seç',
  'Each output carries your thesis, the risks and the sources.': 'Her çıktıda tezin, riskler ve kaynaklar yer alır.',
  'LinkedIn post': 'LinkedIn gönderisi', 'Plain text that leads with your view, ready to paste.': 'Görüşünle başlayan, yapıştırmaya hazır düz metin.',
  'Carousel': 'Kaydırmalı gönderi', '5–7 slides (PDF) to add to a post as a document.': 'Gönderiye belge olarak eklenecek 5–7 sayfalık PDF.',
  'Image': 'Görsel', 'A 1200×627 chart card for a post.': 'Gönderi için 1200×627 boyutunda grafik kartı.',
  'Public site': 'Herkese açık site', 'A permanent page on your site with the full note.': 'Notun tamamıyla sitende kalıcı bir sayfa.',
  'Preview the image': 'Görseli önizle', 'Writing a longer report?': 'Daha uzun bir rapor mu yazıyorsun?',
  'QuantEdge research desk': 'QuantEdge araştırma masası',
  'Write and publish analyses you can defend.': 'Arkasında durabileceğin analizler yaz ve yayınla.',
  'Each note starts from SEC filings and price history, puts your own view first, names the risks and lists its sources.': 'Her not SEC belgeleri ve fiyat geçmişiyle başlar; önce senin görüşünü verir, riskleri açıkça yazar ve kaynaklarını listeler.',
  'Start an analysis': 'Analize başla', 'How publishing works': 'Yayınlama nasıl işler',
  'Run an analysis': 'Bir analiz çalıştır',
  'Pick one of 30 questions. SEC filings and price history are loaded for you, and every figure keeps its source.': '30 sorudan birini seç. SEC belgeleri ve fiyat geçmişi senin için yüklenir; her rakam kaynağıyla birlikte gelir.',
  'Write your view': 'Görüşünü yaz',
  'Add your thesis and the risks to it in your own words. Nothing can be published until both are written.': 'Tezini ve ona yönelik riskleri kendi cümlelerinle yaz. İkisi de yazılmadan hiçbir şey yayınlanamaz.',
  'Publish': 'Yayınla',
  'Turn the note into a LinkedIn post, a carousel, an image or a page on your public site.': 'Notunu LinkedIn gönderisine, kaydırmalı gönderiye, görsele ya da sitende bir sayfaya dönüştür.',
  'Recent publications': 'Son yayınlar', 'on your public site': 'sitende yayında', 'Manage my site': 'Siteni yönet',
  'Nothing published yet. Your first note is one analysis and two short paragraphs away.': 'Henüz yayın yok. İlk notun için bir analiz ve iki kısa paragraf yeterli.',
  'More tools': 'Diğer araçlar', 'From your own thesis and SEC figures.': 'Kendi tezin ve SEC rakamlarıyla.',
  'A longer report as a PDF or HTML draft.': 'PDF veya HTML taslak olarak daha uzun bir rapor.',
  'New to company research? Start here.': 'Şirket araştırmasında yeni misin? Buradan başla.',
  'New to company research?': 'Şirket araştırmasında yeni misin?',
  'The guided path explains a company and its numbers step by step before you write.': 'Rehberli yol, yazmaya başlamadan önce bir şirketi ve rakamlarını adım adım anlatır.'
});
Object.assign(QE_ES, {
  'Exhibit': 'Figura', 'Table': 'Tabla', 'see Sources': 'el resto en Fuentes', 'QuantEdge calculations.': 'Cálculos de QuantEdge.',
  'Research note': 'Nota de análisis', 'Data as of': 'Datos a', 'Summary': 'Resumen', 'Thesis': 'Tesis', 'Risks to the view': 'Riesgos de la tesis',
  'Write it in step 1': 'Escríbela en el paso 1',
  'Your view goes here. It leads the LinkedIn post and the public page.': 'Aquí irá tu opinión. Abre la publicación de LinkedIn y la página pública.',
  'Where could you be wrong? Your counterargument appears here.': '¿En qué podrías equivocarte? Aquí aparecerá tu contraargumento.',
  'Analysis': 'Análisis', 'Publish this analysis': 'Publica este análisis', 'Step': 'Paso',
  'Write your thesis and risks': 'Escribe tu tesis y sus riesgos',
  'Your own words lead every output. The data only supports them.': 'Tus palabras encabezan cada formato; los datos solo las respaldan.',
  'Choose outputs': 'Elige los formatos',
  'Each output carries your thesis, the risks and the sources.': 'Cada formato incluye tu tesis, los riesgos y las fuentes.',
  'LinkedIn post': 'Publicación de LinkedIn', 'Plain text that leads with your view, ready to paste.': 'Texto plano que empieza con tu opinión, listo para pegar.',
  'Carousel': 'Carrusel', '5–7 slides (PDF) to add to a post as a document.': 'De 5 a 7 diapositivas en PDF para añadir a una publicación como documento.',
  'Image': 'Imagen', 'A 1200×627 chart card for a post.': 'Una tarjeta con gráfico de 1200×627 para una publicación.',
  'Public site': 'Sitio público', 'A permanent page on your site with the full note.': 'Una página permanente en tu sitio con la nota completa.',
  'Preview the image': 'Ver la imagen', 'Writing a longer report?': '¿Estás escribiendo un informe más largo?',
  'QuantEdge research desk': 'Mesa de análisis QuantEdge',
  'Write and publish analyses you can defend.': 'Escribe y publica análisis que puedas defender.',
  'Each note starts from SEC filings and price history, puts your own view first, names the risks and lists its sources.': 'Cada nota parte de documentos de la SEC y del historial de precios, pone tu opinión primero, nombra los riesgos y cita sus fuentes.',
  'Start an analysis': 'Empezar un análisis', 'How publishing works': 'Cómo se publica',
  'Run an analysis': 'Haz un análisis',
  'Pick one of 30 questions. SEC filings and price history are loaded for you, and every figure keeps its source.': 'Elige una de 30 preguntas. Los documentos de la SEC y el historial de precios se cargan por ti, y cada cifra conserva su fuente.',
  'Write your view': 'Escribe tu opinión',
  'Add your thesis and the risks to it in your own words. Nothing can be published until both are written.': 'Añade tu tesis y sus riesgos con tus propias palabras. No se puede publicar nada hasta escribir ambas cosas.',
  'Publish': 'Publica',
  'Turn the note into a LinkedIn post, a carousel, an image or a page on your public site.': 'Convierte la nota en una publicación de LinkedIn, un carrusel, una imagen o una página de tu sitio público.',
  'Recent publications': 'Publicaciones recientes', 'on your public site': 'en tu sitio público', 'Manage my site': 'Gestionar mi sitio',
  'Nothing published yet. Your first note is one analysis and two short paragraphs away.': 'Aún no has publicado nada. Tu primera nota está a un análisis y dos párrafos cortos.',
  'More tools': 'Más herramientas', 'From your own thesis and SEC figures.': 'A partir de tu tesis y de cifras de la SEC.',
  'A longer report as a PDF or HTML draft.': 'Un informe más largo como borrador en PDF o HTML.',
  'New to company research? Start here.': '¿Eres nuevo en el análisis de empresas? Empieza aquí.',
  'New to company research?': '¿Eres nuevo en el análisis de empresas?',
  'The guided path explains a company and its numbers step by step before you write.': 'La guía explica una empresa y sus cifras paso a paso antes de que escribas.',
  'days': 'días', 'SMA crossover': 'Cruce de medias móviles', 'Momentum': 'Impulso',
  'The carousel could not be drawn in this browser.': 'El carrusel no se pudo dibujar en este navegador.',
  'Report notes are full; shorten them before adding the comparison.': 'Las notas del informe están llenas; acórtalas antes de añadir más.',
  'Automatic copying is blocked in this browser. Select the text below and copy with Command+C.': 'La copia automática está bloqueada en este navegador. Selecciona el texto de abajo y cópialo con Command+C o Ctrl+C.',
  'Example: Segment growth tells me the cloud business now carries the company. I expect its share to keep rising because...': 'Ejemplo: El crecimiento por segmentos me dice que la nube ya sostiene a la empresa. Espero que su peso siga aumentando porque...',
  'Example: Three years is a short window, and one large contract could explain most of the growth.': 'Ejemplo: Tres años es poco tiempo, y un solo contrato grande podría explicar casi todo el crecimiento.'
});

/* Dates read the same in the app as on the public site: "9 Kasım 2026" / "November 9, 2026". */
function qeDate(iso) {
  var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return iso || '';
  try {
    return new Intl.DateTimeFormat(QE_LANG, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])));
  } catch (_) { return m[0]; }
}

/* Review fixes: one term per concept, no placeholder company, labelled dates. */
Object.assign(QE_TR, {
  'Company name — Research Report': 'Şirket adı — Araştırma Raporu',
  'Financial snapshot': 'Finansal görünüm', 'Prepared by': 'Hazırlayan:',
  'Data': 'Veri', 'Saved': 'Kaydedildi'
});
Object.assign(QE_ES, {
  'Company name — Research Report': 'Nombre de la empresa — Informe de análisis',
  'Financial snapshot': 'Panorama financiero', 'Prepared by': 'Elaborado por',
  'Data': 'Datos', 'Saved': 'Guardado'
});
Object.assign(QE_TR, {
  'Educational analysis of historical price data; not investment advice.': 'Geçmiş fiyat verisiyle yapılmış eğitim amaçlı analizdir; yatırım tavsiyesi değildir.',
  'Educational analysis of reported SEC data and historical prices; not investment advice.': 'Raporlanmış SEC verisi ve geçmiş fiyatlarla yapılmış eğitim amaçlı analizdir; yatırım tavsiyesi değildir.',
  'Educational analysis; not investment advice.': 'Eğitim amaçlı analizdir; yatırım tavsiyesi değildir.'
});
Object.assign(QE_ES, {
  'Educational analysis of historical price data; not investment advice.': 'Análisis educativo con precios históricos; no es asesoramiento financiero.',
  'Educational analysis of reported SEC data and historical prices; not investment advice.': 'Análisis educativo con datos de la SEC y precios históricos; no es asesoramiento financiero.',
  'Educational analysis; not investment advice.': 'Análisis educativo; no es asesoramiento financiero.',
  'Educational analysis of reported SEC data; not investment advice.': 'Análisis educativo con datos de la SEC; no es asesoramiento financiero.'
});
Object.assign(QE_TR, {'Download PDF': 'PDF indir'});
Object.assign(QE_ES, {'Download PDF': 'Descargar PDF'});
Object.assign(QE_TR, {'Close list': 'Listeyi kapat', 'Change analysis': 'Analizi değiştir'});
Object.assign(QE_ES, {'Close list': 'Cerrar la lista', 'Change analysis': 'Cambiar de análisis'});

/* About page, the header band on every page and the About entry in the menu */
Object.assign(QE_TR, {
  'About': 'Hakkımızda', 'This page': 'Bu sayfa', 'Next step': 'Sıradaki adım', 'What is QuantEdge?': 'QuantEdge nedir?',
  'Open the Guide': 'Rehberi aç', 'Where to start': 'Nereden başlamalı?',
  'Your desk: what you have published, and where to start the next analysis.': 'Masan: neler yayınladığını gör ve sıradaki analize buradan başla.',
  'New here? Read what QuantEdge does, and what it cannot do.': 'Yeni misin? QuantEdge’in neler yapabildiğini ve neler yapamadığını oku.',
  'Run an analysis on official data': 'Resmî veriyle analiz yap',
  'Choose a question and a company and run it, then write your thesis and risks: publishing unlocks once both are written.': 'Bir soru ve bir şirket seçip analizi çalıştır, sonra tezini ve risklerini yaz: ikisini de yazınca yayınlama açılır.',
  'Add analyses from the Analysis Lab, preview the site, then download it and upload it to GitHub Pages for free.': 'Analiz Laboratuvarı’ndan analiz ekle, siteye göz at, sonra indirip GitHub Pages’e ücretsiz yükle.',
  'Select a company and load its SEC data first. The post is built on your own thesis, so write that too.': 'Önce bir şirket seç ve SEC verisini yükle. Paylaşım senin tezine dayanır; onu da yazmayı unutma.',
  'Write in the Thesis tab, add your sources under Evidence, check the Review tab, then export a PDF or HTML draft.': 'Tez sekmesinde yaz, kaynaklarını Kanıtlar’a ekle, Kontrol sekmesine bak, sonra PDF ya da HTML taslak indir.',
  'Open a saved report to read it again, or compare today’s figures with what you wrote.': 'Kayıtlı bir raporu açıp yeniden oku ya da bugünkü rakamları yazdıklarınla karşılaştır.',
  'Follow the five steps in order; the checklist shows what is still missing before you write the report.': 'Beş adımı sırayla izle; kontrol listesi, raporu yazmadan önce neyin eksik olduğunu gösterir.',
  'About QuantEdge': 'QuantEdge hakkında',
  'What QuantEdge is, how it works, what it can and cannot analyse, and where your data goes.': 'QuantEdge nedir, nasıl çalışır, neleri analiz edebilir, neleri edemez ve verilerin nereye gider?',
  'Ready? Start with one analysis in the Lab.': 'Hazır mısın? Laboratuvarda tek bir analizle başla.',
  // About page
  'QuantEdge is a research desk that runs on your own computer. It turns official SEC filings and price history into source-based analyses that you write and publish under your own name.':
    'QuantEdge kendi bilgisayarında çalışan bir araştırma masası. Resmî SEC belgelerini ve fiyat geçmişini, senin yazıp kendi adınla yayınladığın kaynaklı analizlere dönüştürür.',
  'Think of it as a lab notebook for companies: the app does the downloading and the arithmetic, shows where every number came from, and leaves the thinking to you.':
    'Onu şirketler için bir laboratuvar defteri gibi düşün: veriyi indirmeyi ve hesapları uygulama yapar, her rakamın nereden geldiğini gösterir; düşünmek sana kalır.',
  'analyst questions': 'analist sorusu', 'official SEC data': 'resmî SEC verisi', 'ways to publish': 'yayınlama yolu', 'accounts or API keys': 'hesap ya da API anahtarı',
  'How it works': 'Nasıl çalışır?', 'One analysis at a time, in four steps.': 'Her seferinde tek analiz, dört adımda.',
  'Pick one of 30 questions in the Analysis Lab and a company. QuantEdge downloads the official figures and draws the charts and tables.':
    'Analiz Laboratuvarı’ndaki 30 sorudan birini ve bir şirket seç. QuantEdge resmî rakamları indirir, grafikleri ve tabloları hazırlar.',
  'Write your thesis (at least 80 characters) and the risks to it (at least 60) in your own words. Nothing can be published before both are written.':
    'Tezini (en az 80 karakter) ve ona yönelik riskleri (en az 60 karakter) kendi cümlelerinle yaz. İkisi yazılmadan hiçbir şey yayınlanamaz.',
  'Turn the note into LinkedIn text, a carousel PDF, a PNG image or a page on your own public site.':
    'Notunu LinkedIn metnine, kaydırmalı (carousel) PDF’e, PNG görsele ya da kendi sitende bir sayfaya dönüştür.',
  'Check back later': 'Sonra geri dön',
  'Months later, open "Was I right?", compare the new figures with what you wrote and give yourself an honest verdict.':
    'Aylar sonra “Haklı çıktım mı?” bölümünü aç, yeni rakamları yazdıklarınla karşılaştır ve kendine dürüst bir not ver.',
  'What makes it different': 'Onu farklı kılan ne?',
  'Every number has a source': 'Her rakamın bir kaynağı var',
  'Each figure is labelled with where it came from and links to the SEC filing it was taken from. Readers can check you.':
    'Her rakamın nereden geldiği yazılıdır ve alındığı SEC belgesine bağlantı verir. Okuyanlar seni kontrol edebilir.',
  'Your view comes first': 'Önce senin görüşün',
  'QuantEdge calculates; you think. A note without your own thesis and risks cannot be published.':
    'QuantEdge hesaplar, sen düşünürsün. Kendi tezin ve risklerin olmayan bir not yayınlanamaz.',
  'Honest about its limits': 'Sınırları konusunda dürüst',
  'When a figure is missing or an analysis does not fit a company, it says so instead of guessing.':
    'Bir rakam eksikse ya da analiz o şirkete uymuyorsa tahmin yürütmez, bunu açıkça söyler.',
  'Private by default': 'Varsayılan olarak gizli',
  'Your drafts and notes stay on your computer; only requests for public data (SEC filings, prices, interest rates and research datasets) go online.': 'Taslakların ve notların bilgisayarında kalır; internete yalnızca herkese açık veri istekleri (SEC belgeleri, fiyatlar, faiz oranları ve araştırma veri setleri) gider.',
  'What it can and cannot analyse': 'Neleri analiz edebilir, neleri edemez?',
  'Knowing the limits is part of good research. QuantEdge tells you when one applies.': 'Sınırları bilmek iyi araştırmanın parçasıdır. Bir sınıra takıldığında QuantEdge bunu sana söyler.',
  'It can analyse': 'Analiz edebildikleri', 'It cannot (yet)': 'Edemedikleri (şimdilik)',
  'Any US company that files a 10-K annual report with the SEC: thousands of firms, from Apple and Microsoft to small companies.':
    'SEC’e 10-K yıllık raporu veren her ABD şirketi: Apple ve Microsoft’tan küçük şirketlere kadar binlerce firma.',
  '30 analyst questions: growth and margins, earnings quality, cash flow, valuation (reverse DCF, multiples, scenarios), risk (Altman Z, beta, Monte Carlo range of outcomes), market tests and a live options lab (Black–Scholes, Heston).':
    '30 analist sorusu: büyüme ve marjlar, kazanç kalitesi, nakit akışı, değerleme (ters DCF, çarpanlar, senaryolar), risk (Altman Z, beta, Monte Carlo belirsizlik aralığı), piyasa testleri ve canlı bir opsiyon laboratuvarı (Black–Scholes, Heston).',
  'Historical prices from Yahoo Finance, including Borsa İstanbul shares (.IS) for the Turkey lira-vs-dollar and price analyses.':
    'Yahoo Finance’ten geçmiş fiyatlar; Türkiye TL–dolar ve fiyat analizlerinde Borsa İstanbul hisseleri (.IS) dahil.',
  'Your own inputs: assumptions you choose and, when needed, a price you type yourself.':
    'Kendi girdilerin: seçtiğin varsayımlar ve gerektiğinde kendin yazdığın bir fiyat.',
  'Foreign companies (20-F / 40-F) outside the Analysis Lab: the Guide, LinkedIn and Reports pages read 10-K reports only.':
    'Analiz Laboratuvarı dışında yabancı şirketler (20-F / 40-F): Rehber, LinkedIn ve Raporlar sayfaları yalnızca 10-K raporlarını okur.',
  'Banks in the Altman Z and cash conversion cycle analyses: banks do not report the items these need.':
    'Altman Z ve nakit dönüşüm döngüsü analizlerinde bankalar: bankalar bu analizlerin gerektirdiği kalemleri raporlamaz.',
  'BIST companies outside the Turkey FX and price analyses: they do not file with the SEC.':
    'Türkiye kur ve fiyat analizleri dışında BIST şirketleri: bu şirketler SEC’e belge vermez.',
  'Delisted companies without price history: you type the price yourself.':
    'Borsadan çıkmış, fiyat geçmişi olmayan şirketler: fiyatı kendin yazarsın.',
  'Trading or real-time quotes: it never places orders, and option quotes are about 15 minutes delayed (refreshed every minute with Live ticked in the Options tab).':
    'Alım satım ya da gerçek zamanlı kotasyon: emir vermez; opsiyon kotasyonları yaklaşık 15 dakika gecikmelidir (Opsiyonlar sekmesinde Canlı işaretliyse her dakika yenilenir).',
  'Where the data comes from': 'Veriler nereden geliyor?',
  'SEC EDGAR (companyfacts)': 'SEC EDGAR (companyfacts)',
  'The XBRL data inside 10-K annual reports, published free by the US Securities and Exchange Commission. Each figure links back to its filing.':
    'ABD Menkul Kıymetler ve Borsa Komisyonu’nun (SEC) ücretsiz yayınladığı 10-K yıllık raporlarındaki XBRL verisi. Her rakam kendi belgesine bağlanır.',
  'Historical daily prices, adjusted for splits and dividends. Used for returns, beta, event studies and the Turkey analysis; in the Options tab also the stock price and option quotes (about 15 minutes delayed).':
    'Bölünme ve temettüye göre düzeltilmiş geçmiş günlük fiyatlar. Getiri, beta, olay çalışması ve Türkiye analizinde kullanılır; Opsiyonlar sekmesinde ayrıca hisse fiyatı ve opsiyon kotasyonları (yaklaşık 15 dakika gecikmeli).',
  'You': 'Sen',
  'Your thesis, your risks, your assumptions and any price you type. These are always labelled as yours, never as official data.':
    'Tezin, risklerin, varsayımların ve yazdığın her fiyat. Bunlar her zaman senin girdin olarak işaretlenir, asla resmî veri gibi gösterilmez.',
  'Your privacy': 'Gizliliğin',
  'QuantEdge runs on this computer. Your drafts, notes and library are saved here, not in a cloud account.':
    'QuantEdge bu bilgisayarda çalışır. Taslakların, notların ve kütüphanen bir bulut hesabında değil, burada saklanır.',
  'The app goes online only to download public data (SEC figures, prices, interest rates, research datasets): when you run an analysis or load data, and when you open the Options tab, which loads a ticker (AAPL unless you type another).':
    'Uygulama internete yalnızca herkese açık verileri (SEC rakamları, fiyatlar, faiz oranları, araştırma veri setleri) indirmek için çıkar: bir analiz çalıştırdığında ya da veri yüklediğinde, bir de Opsiyonlar sekmesini açtığında (başka bir kod yazmadıysan AAPL yüklenir).',
  'The SEC asks automated requests for a contact email. It is sent to the SEC with the request and is not stored in the app.':
    'SEC, otomatik isteklerde bir iletişim e-postası ister. Bu e-posta yalnızca istekle birlikte SEC’e gider, uygulamada saklanmaz.',
  'The help assistant works offline too: it answers from a built-in guide, with no AI service and no internet.':
    'Yardım asistanı da çevrimdışı çalışır: yapay zekâ hizmeti ya da internet kullanmadan, uygulamanın içindeki rehberden yanıt verir.',
  'Only what you publish yourself becomes public: a post you paste, a file you download, the site you upload.':
    'Yalnızca kendin yayınladığın şeyler herkese açık olur: yapıştırdığın bir paylaşım, indirdiğin bir dosya, yüklediğin site.',
  'Not investment advice': 'Yatırım tavsiyesi değildir',
  'QuantEdge is for learning and for showing your research. It never tells you to buy or sell anything, and past figures do not predict future returns.':
    'QuantEdge öğrenmek ve araştırmanı göstermek içindir. Sana asla bir şeyi al ya da sat demez; geçmiş rakamlar gelecekteki getirileri öngörmez.',
  'Every output says so, and so should you when you share it.': 'Her çıktıda bu yazar; paylaşırken sen de belirtmelisin.',
  'Who it is for': 'Kimler için?',
  'High-school and university students who want to understand how companies work and show it: on a CV, in a university application, in a club or on LinkedIn. You do not need a finance background; the Guide and the "What does this mean?" notes explain each term.':
    'Şirketlerin nasıl işlediğini anlamak ve bunu göstermek isteyen lise ve üniversite öğrencileri için: özgeçmişte, üniversite başvurusunda, bir kulüpte ya da LinkedIn’de. Finans bilgisi gerekmez; Rehber ve “Bu ne demek?” notları her terimi açıklar.',
  'Run your first analysis, follow the Guide if the terms are new, or see how your public site will look.':
    'İlk analizini çalıştır, terimler yeniyse Rehber’i izle ya da sitenin nasıl görüneceğine bak.'
});
Object.assign(QE_ES, {
  'One small step at a time. Build a real, source-based research project you can explain and defend.': 'Paso a paso. Construye un proyecto de análisis real, con fuentes, que puedas explicar y defender.',
  'Write research you can stand behind. Export polished, unpublished drafts.': 'Escribe un análisis que puedas defender. Exporta borradores cuidados y sin publicar.',
  'Every research milestone, saved locally and easy to revisit.': 'Cada paso de tu investigación, guardado en este ordenador y fácil de volver a abrir.',
  'About': 'Acerca de', 'This page': 'Esta página', 'Next step': 'Siguiente paso', 'What is QuantEdge?': '¿Qué es QuantEdge?',
  'Open the Guide': 'Abrir la guía', 'Where to start': 'Por dónde empezar',
  'Your desk: what you have published, and where to start the next analysis.': 'Tu mesa: lo que has publicado y dónde empezar el siguiente análisis.',
  'New here? Read what QuantEdge does, and what it cannot do.': '¿Eres nuevo? Lee qué hace QuantEdge y qué no puede hacer.',
  'Run an analysis on official data': 'Haz un análisis con datos oficiales',
  'Choose a question and a company and run it, then write your thesis and risks: publishing unlocks once both are written.': 'Elige una pregunta y una empresa y ejecútalo; después escribe tu tesis y sus riesgos: podrás publicar cuando estén escritos.',
  'Add analyses from the Analysis Lab, preview the site, then download it and upload it to GitHub Pages for free.': 'Añade análisis desde el Laboratorio, revisa el sitio y luego descárgalo y súbelo gratis a GitHub Pages.',
  'Select a company and load its SEC data first. The post is built on your own thesis, so write that too.': 'Primero elige una empresa y carga sus datos de la SEC. La publicación se basa en tu tesis, así que escríbela también.',
  'Write in the Thesis tab, add your sources under Evidence, check the Review tab, then export a PDF or HTML draft.': 'Escribe en la pestaña Tesis, añade tus fuentes en Evidencias, revisa la pestaña Revisión y exporta un borrador en PDF o HTML.',
  'Open a saved report to read it again, or compare today’s figures with what you wrote.': 'Abre un informe guardado para releerlo o compara las cifras de hoy con lo que escribiste.',
  'Follow the five steps in order; the checklist shows what is still missing before you write the report.': 'Sigue los cinco pasos en orden; la lista muestra lo que aún falta antes de escribir el informe.',
  'About QuantEdge': 'Acerca de QuantEdge',
  'What QuantEdge is, how it works, what it can and cannot analyse, and where your data goes.': 'Qué es QuantEdge, cómo funciona, qué puede y qué no puede analizar y adónde van tus datos.',
  'Ready? Start with one analysis in the Lab.': '¿Listo? Empieza con un análisis en el Laboratorio.',
  'QuantEdge is a research desk that runs on your own computer. It turns official SEC filings and price history into source-based analyses that you write and publish under your own name.':
    'QuantEdge es una mesa de análisis que funciona en tu propio ordenador. Convierte documentos oficiales de la SEC e historiales de precios en análisis con fuentes que tú escribes y publicas con tu nombre.',
  'Think of it as a lab notebook for companies: the app does the downloading and the arithmetic, shows where every number came from, and leaves the thinking to you.':
    'Piensa en él como un cuaderno de laboratorio para empresas: la aplicación descarga los datos y hace las cuentas, muestra de dónde sale cada número y te deja pensar a ti.',
  'analyst questions': 'preguntas de analista', 'official SEC data': 'datos oficiales de la SEC', 'ways to publish': 'formas de publicar', 'accounts or API keys': 'cuentas o claves de API',
  'How it works': 'Cómo funciona', 'One analysis at a time, in four steps.': 'Un análisis cada vez, en cuatro pasos.',
  'Pick one of 30 questions in the Analysis Lab and a company. QuantEdge downloads the official figures and draws the charts and tables.':
    'Elige una de las 30 preguntas del Laboratorio y una empresa. QuantEdge descarga las cifras oficiales y prepara los gráficos y tablas.',
  'Write your thesis (at least 80 characters) and the risks to it (at least 60) in your own words. Nothing can be published before both are written.':
    'Escribe tu tesis (al menos 80 caracteres) y sus riesgos (al menos 60) con tus palabras. No se puede publicar nada hasta que estén escritos.',
  'Turn the note into LinkedIn text, a carousel PDF, a PNG image or a page on your own public site.':
    'Convierte la nota en un texto para LinkedIn, un carrusel en PDF, una imagen PNG o una página de tu sitio público.',
  'Check back later': 'Vuelve más tarde',
  'Months later, open "Was I right?", compare the new figures with what you wrote and give yourself an honest verdict.':
    'Meses después, abre «¿Tenía razón?», compara las cifras nuevas con lo que escribiste y date un veredicto honesto.',
  'What makes it different': 'Qué lo hace diferente',
  'Every number has a source': 'Cada número tiene su fuente',
  'Each figure is labelled with where it came from and links to the SEC filing it was taken from. Readers can check you.':
    'Cada cifra indica de dónde viene y enlaza al documento de la SEC del que se tomó. Tus lectores pueden comprobarlo.',
  'Your view comes first': 'Primero, tu opinión',
  'QuantEdge calculates; you think. A note without your own thesis and risks cannot be published.':
    'QuantEdge calcula; tú piensas. Una nota sin tu tesis y tus riesgos no se puede publicar.',
  'Honest about its limits': 'Honesto con sus límites',
  'When a figure is missing or an analysis does not fit a company, it says so instead of guessing.':
    'Si falta una cifra o un análisis no encaja con una empresa, lo dice en lugar de adivinar.',
  'Private by default': 'Privado por defecto',
  'Your drafts and notes stay on your computer; only requests for public data (SEC filings, prices, interest rates and research datasets) go online.': 'Tus borradores y notas se quedan en tu ordenador; a internet solo salen solicitudes de datos públicos (documentos de la SEC, precios, tipos de interés y bases de datos de investigación).',
  'What it can and cannot analyse': 'Qué puede y qué no puede analizar',
  'Knowing the limits is part of good research. QuantEdge tells you when one applies.': 'Conocer los límites forma parte de un buen análisis. QuantEdge te avisa cuando uno se aplica.',
  'It can analyse': 'Puede analizar', 'It cannot (yet)': 'No puede (por ahora)',
  'Any US company that files a 10-K annual report with the SEC: thousands of firms, from Apple and Microsoft to small companies.':
    'Cualquier empresa estadounidense que presente el informe anual 10-K ante la SEC: miles de empresas, desde Apple y Microsoft hasta compañías pequeñas.',
  '30 analyst questions: growth and margins, earnings quality, cash flow, valuation (reverse DCF, multiples, scenarios), risk (Altman Z, beta, Monte Carlo range of outcomes), market tests and a live options lab (Black–Scholes, Heston).':
    '30 preguntas de analista: crecimiento y márgenes, calidad de beneficios, flujo de caja, valoración (DCF inverso, múltiplos, escenarios), riesgo (Altman Z, beta, rango de resultados Monte Carlo), pruebas de mercado y un laboratorio de opciones en vivo (Black–Scholes, Heston).',
  'Historical prices from Yahoo Finance, including Borsa İstanbul shares (.IS) for the Turkey lira-vs-dollar and price analyses.':
    'Precios históricos de Yahoo Finance, incluidas acciones de Borsa İstanbul (.IS) para los análisis de Turquía (lira frente a dólar) y de precios.',
  'Your own inputs: assumptions you choose and, when needed, a price you type yourself.':
    'Tus propios datos: los supuestos que elijas y, si hace falta, un precio que escribas tú.',
  'Foreign companies (20-F / 40-F) outside the Analysis Lab: the Guide, LinkedIn and Reports pages read 10-K reports only.':
    'Empresas extranjeras (20-F / 40-F) fuera del Laboratorio de análisis: las páginas Guía, LinkedIn e Informes solo leen informes 10-K.',
  'Banks in the Altman Z and cash conversion cycle analyses: banks do not report the items these need.':
    'Bancos en los análisis de Altman Z y ciclo de conversión de caja: los bancos no publican las partidas que necesitan.',
  'BIST companies outside the Turkey FX and price analyses: they do not file with the SEC.':
    'Empresas de BIST fuera de los análisis de divisa y precios de Turquía: no presentan documentos ante la SEC.',
  'Delisted companies without price history: you type the price yourself.':
    'Empresas excluidas de bolsa sin historial de precios: escribes tú el precio.',
  'Trading or real-time quotes: it never places orders, and option quotes are about 15 minutes delayed (refreshed every minute with Live ticked in the Options tab).':
    'Operar o cotizaciones en tiempo real: no envía órdenes, y las cotizaciones de opciones llevan unos 15 minutos de retraso (se actualizan cada minuto con En vivo marcado en la pestaña Opciones).',
  'Where the data comes from': 'De dónde vienen los datos',
  'The XBRL data inside 10-K annual reports, published free by the US Securities and Exchange Commission. Each figure links back to its filing.':
    'Los datos XBRL de los informes anuales 10-K, publicados gratis por la Comisión de Bolsa y Valores de EE. UU. (SEC). Cada cifra enlaza a su documento.',
  'Historical daily prices, adjusted for splits and dividends. Used for returns, beta, event studies and the Turkey analysis; in the Options tab also the stock price and option quotes (about 15 minutes delayed).':
    'Precios diarios históricos ajustados por desdoblamientos y dividendos. Se usan para rentabilidades, beta, estudios de eventos y el análisis de Turquía; en la pestaña Opciones, también el precio de la acción y las cotizaciones de opciones (con unos 15 minutos de retraso).',
  'You': 'Tú',
  'Your thesis, your risks, your assumptions and any price you type. These are always labelled as yours, never as official data.':
    'Tu tesis, tus riesgos, tus supuestos y cualquier precio que escribas. Siempre se marcan como tuyos, nunca como datos oficiales.',
  'Your privacy': 'Tu privacidad',
  'QuantEdge runs on this computer. Your drafts, notes and library are saved here, not in a cloud account.':
    'QuantEdge funciona en este ordenador. Tus borradores, notas y biblioteca se guardan aquí, no en una cuenta en la nube.',
  'The app goes online only to download public data (SEC figures, prices, interest rates, research datasets): when you run an analysis or load data, and when you open the Options tab, which loads a ticker (AAPL unless you type another).':
    'La aplicación solo se conecta a internet para descargar datos públicos (cifras de la SEC, precios, tipos de interés, bases de datos de investigación): cuando ejecutas un análisis o cargas datos, y cuando abres la pestaña Opciones, que carga un ticker (AAPL si no escribes otro).',
  'The SEC asks automated requests for a contact email. It is sent to the SEC with the request and is not stored in the app.':
    'La SEC pide un correo de contacto en las solicitudes automáticas. Se envía a la SEC con la solicitud y no se guarda en la aplicación.',
  'The help assistant works offline too: it answers from a built-in guide, with no AI service and no internet.':
    'El asistente de ayuda también funciona sin conexión: responde desde una guía integrada, sin servicios de IA ni internet.',
  'Only what you publish yourself becomes public: a post you paste, a file you download, the site you upload.':
    'Solo se hace público lo que publicas tú: una publicación que pegas, un archivo que descargas, el sitio que subes.',
  'QuantEdge is for learning and for showing your research. It never tells you to buy or sell anything, and past figures do not predict future returns.':
    'QuantEdge sirve para aprender y mostrar tu análisis. Nunca te dice que compres o vendas nada, y las cifras pasadas no predicen rentabilidades futuras.',
  'Every output says so, and so should you when you share it.': 'Todos los resultados lo indican, y tú también deberías hacerlo al compartirlos.',
  'Who it is for': 'Para quién es',
  'High-school and university students who want to understand how companies work and show it: on a CV, in a university application, in a club or on LinkedIn. You do not need a finance background; the Guide and the "What does this mean?" notes explain each term.':
    'Para estudiantes de secundaria y universidad que quieren entender cómo funcionan las empresas y demostrarlo: en un CV, en una solicitud universitaria, en un club o en LinkedIn. No necesitas saber de finanzas; la Guía y las notas «¿Qué significa?» explican cada término.',
  'Run your first analysis, follow the Guide if the terms are new, or see how your public site will look.':
    'Ejecuta tu primer análisis, sigue la Guía si los términos son nuevos o mira cómo quedará tu sitio público.'
});

/* Verifiable track record on "My public site" (GET /lab/track-record) */
Object.assign(QE_TR, {
  'MEASURED BY PRICES': 'FİYATLARLA ÖLÇÜLÜR', 'Track record': 'Sicil', 'Last updated': 'Son güncelleme',
  'In progress': 'Devam ediyor', 'Hit': 'İsabet', 'Missed': 'Kaçırdı', 'Matured': 'Vadesi dolan', 'Price unavailable': 'Fiyat alınamadı',
  'Current prices could not be loaded.': 'Güncel fiyat alınamadı.',
  'Return vs {bench}, in percentage points': '{bench} karşısındaki fark, yüzde puan',
  'day {a} of {b}': '{b} günün {a}. günü', 'Horizon elapsed': 'Vadenin geçen kısmı',
  'Measured by prices': 'Fiyatlara göre', 'My own review': 'Kendi değerlendirmem', 'difference': 'fark',
  'Hits': 'İsabet', 'Hit rate': 'İsabet oranı', 'Avg. vs benchmark': 'Endekse göre ort. fark', 'Open views': 'Devam eden görüş',
  'Best': 'En iyi', 'Worst': 'En zayıf',
  'None of your published analyses has an explicit view yet. Add one in the Analysis Lab (step 1, Your view) and it is measured here automatically.':
    'Yayınladığın analizlerin hiçbirinde henüz açık görüş yok. Analiz Laboratuvarı’nda 1. adımda (Görüşün) bir görüş eklersen burada otomatik olarak ölçülür.',
  'No view has reached its review date yet; the first result is due on {date}.': 'Henüz vadesi dolan görüş yok; ilk sonuç {date} tarihinde.',
  'No view has reached its review date yet.': 'Henüz vadesi dolan görüş yok.',
  'The track record could not be loaded.': 'Sicil yüklenemedi.',
  'Positive view: a hit if the stock returned more than the benchmark. Negative view: a hit if the stock’s return trailed the benchmark. Neutral view: a hit if the gap stayed within ±{band} percentage points. The gap is the stock’s return minus the benchmark’s, in percentage points; the average “in the view’s direction” flips the sign for negative views and uses the room left inside the ±{band} band for neutral ones. Measured with adjusted closing prices (dividends and splits), in the stock’s own currency against a benchmark in the same currency (BIST shares in TL against BIST 100; BIST 100 is a price index without dividends, so for BIST shares the gap is overstated by roughly the dividend yield). Open views are not counted. Not investment advice; past results do not predict future ones.':
    'Olumlu görüş: hisse, endeksten daha çok getiri sağladıysa isabet. Olumsuz görüş: hissenin getirisi endeksin gerisinde kaldıysa isabet. Nötr görüş: aradaki fark ±{band} yüzde puanı geçmediyse isabet. Fark, hisse getirisi eksi endeks getirisidir (yüzde puan); “görüş yönünde” ortalamada olumsuz görüşün işareti ters çevrilir, nötr görüşte ±{band} bandına kalan pay kullanılır. Temettü ve bölünmelere göre düzeltilmiş kapanış fiyatlarıyla, hissenin kendi para biriminde ve aynı para birimindeki bir endekse karşı ölçülür (BIST hisseleri TL olarak BIST 100’e karşı; BIST 100 temettüleri içermeyen bir fiyat endeksi olduğundan BIST hisselerinde fark yaklaşık temettü verimi kadar hisse lehine çıkar). Devam eden görüşler hesaba katılmaz. Yatırım tavsiyesi değildir; geçmiş sonuçlar geleceği göstermez.',
  'so far {x}': 'şimdilik {x}', 'Avg. in the view’s direction': 'Görüş yönünde ort. fark', 'Not measurable (no prices)': 'Ölçülemeyen (fiyat yok)',
  '{n} matured view(s) could not be measured because prices were unavailable; they are not in the hit rate.': 'Vadesi dolan {n} görüş fiyat alınamadığı için ölçülemedi; isabet oranına girmedi.',
  'Small sample: with {n} result(s) this rate proves little.': 'Az sayıda sonuç: {n} görüşle bu oran bir şey kanıtlamaz.',
  'Your own “Was I right?” reviews are shown separately as “My own review”.': '“Haklı çıktım mı?” değerlendirmelerin ayrıca “Kendi değerlendirmem” olarak gösterilir.',
  'Due for review': 'Vadesi gelenler',
  'The review date has passed and the prices are in. Now write what you learned: was your reasoning right, or only the result?':
    'Değerlendirme tarihi geçti ve fiyatlar belli. Şimdi ne öğrendiğini yaz: gerekçen mi doğru çıktı, yoksa yalnızca sonuç mu?'
});
Object.assign(QE_ES, {
  'MEASURED BY PRICES': 'MEDIDO CON PRECIOS', 'Track record': 'Historial', 'Last updated': 'Última actualización',
  'In progress': 'En curso', 'Hit': 'Acierto', 'Missed': 'Fallo', 'Matured': 'Vencidas', 'Price unavailable': 'Precio no disponible',
  'Current prices could not be loaded.': 'No se pudieron cargar los precios actuales.',
  'Return vs {bench}, in percentage points': 'Diferencia frente al {bench}, en puntos porcentuales',
  'day {a} of {b}': 'día {a} de {b}', 'Horizon elapsed': 'Parte del horizonte transcurrida',
  'Measured by prices': 'Según los precios', 'My own review': 'Mi propia valoración', 'difference': 'diferencia',
  'Hits': 'Aciertos', 'Hit rate': 'Tasa de acierto', 'Avg. vs benchmark': 'Media frente al índice', 'Open views': 'Opiniones en curso',
  'Best': 'Mejor', 'Worst': 'Más débil',
  'None of your published analyses has an explicit view yet. Add one in the Analysis Lab (step 1, Your view) and it is measured here automatically.':
    'Ninguno de tus análisis publicados tiene todavía una opinión explícita. Añade una en el laboratorio de análisis (paso 1, Tu opinión) y se medirá aquí automáticamente.',
  'No view has reached its review date yet; the first result is due on {date}.': 'Ninguna opinión ha llegado aún a su fecha de revisión; el primer resultado llega el {date}.',
  'No view has reached its review date yet.': 'Ninguna opinión ha llegado aún a su fecha de revisión.',
  'The track record could not be loaded.': 'No se pudo cargar el historial.',
  'Positive view: a hit if the stock returned more than the benchmark. Negative view: a hit if the stock’s return trailed the benchmark. Neutral view: a hit if the gap stayed within ±{band} percentage points. The gap is the stock’s return minus the benchmark’s, in percentage points; the average “in the view’s direction” flips the sign for negative views and uses the room left inside the ±{band} band for neutral ones. Measured with adjusted closing prices (dividends and splits), in the stock’s own currency against a benchmark in the same currency (BIST shares in TL against BIST 100; BIST 100 is a price index without dividends, so for BIST shares the gap is overstated by roughly the dividend yield). Open views are not counted. Not investment advice; past results do not predict future ones.':
    'Opinión positiva: acierta si la acción rindió más que el índice. Opinión negativa: acierta si el rendimiento de la acción quedó por detrás del índice. Opinión neutral: acierta si la diferencia no superó ±{band} puntos porcentuales. La diferencia es el rendimiento de la acción menos el del índice, en puntos porcentuales; la media “a favor de la opinión” invierte el signo en las negativas y usa el margen que queda dentro de la banda de ±{band} en las neutrales. Se mide con cierres ajustados por dividendos y splits, en la moneda de la acción y frente a un índice en la misma moneda (acciones de BIST en liras frente al BIST 100; el BIST 100 es un índice de precios sin dividendos, así que en acciones de BIST la diferencia sale inflada aproximadamente en la rentabilidad por dividendo). Las opiniones en curso no cuentan. No es asesoramiento de inversión; los resultados pasados no predicen los futuros.',
  'so far {x}': 'por ahora {x}', 'Avg. in the view’s direction': 'Margen medio a favor de la opinión', 'Not measurable (no prices)': 'No medibles (sin precios)',
  '{n} matured view(s) could not be measured because prices were unavailable; they are not in the hit rate.': '{n} opinión(es) vencida(s) no se pudieron medir por falta de precios; no cuentan en la tasa de acierto.',
  'Small sample: with {n} result(s) this rate proves little.': 'Muestra pequeña: con {n} resultado(s) esta tasa demuestra poco.',
  'Your own “Was I right?” reviews are shown separately as “My own review”.': 'Tus valoraciones de “¿Acerté?” se muestran aparte como “Mi propia valoración”.',
  'Due for review': 'Pendientes de revisión',
  'The review date has passed and the prices are in. Now write what you learned: was your reasoning right, or only the result?':
    'La fecha de revisión ya pasó y los precios están ahí. Ahora escribe qué aprendiste: ¿acertó tu razonamiento o solo el resultado?'
});

/* Explicit view ("call"): stance against a benchmark, horizon, proof metric, risk matrix and kill criteria.
   Stance labels themselves ("S&P 500’e göre olumlu") are built by qeCallStanceLabel in lab_publish.js. */
Object.assign(QE_TR, {
  'Your view': 'Görüşün', 'optional': 'isteğe bağlı', 'No explicit view': 'Açık bir görüş yok',
  'Over the next 6–24 months, do you expect the company’s shares to do better than, about the same as, or worse than an index? Say what would make you drop that view. This is a relative expectation, not a buy/sell recommendation or a price target.':
    'Önümüzdeki 6–24 ayda şirketin hissesinin bir endekse göre daha iyi, benzer ya da daha zayıf seyredeceğini mi düşünüyorsun? Hangi durumda bu görüşten vazgeçeceğini de yaz. Bu göreli bir beklentidir; al/sat önerisi ya da hedef fiyat değildir.',
  'Benchmark index': 'Kıyaslama endeksi', 'Horizon': 'Vade', 'months': 'ay',
  'Proof metric': 'Kanıt metriği', 'The one number that would prove you right.': 'Haklı olduğunu gösterecek tek rakam.',
  'Metric': 'Metrik', 'Comparison': 'Karşılaştırma', 'Threshold': 'Eşik değer', 'Unit': 'Birim',
  '$ million': 'milyon $', 'no unit': 'birimsiz', 'Example: FY2027 operating margin': 'Örnek: FY2027 faaliyet marjı',
  'Risks and kill criteria': 'Riskler ve vazgeçme kriterleri', 'Risk': 'Risk', 'Probability': 'Olasılık', 'Impact': 'Etki',
  'Low': 'Düşük', 'Medium': 'Orta', 'High': 'Yüksek', 'Low (impact)': 'Düşük', 'Medium (impact)': 'Orta', 'High (impact)': 'Yüksek',
  'Example: segment growth stays below 10% for two quarters in a row': 'Örnek: segment büyümesi iki çeyrek üst üste %10’un altında kalırsa',
  'I drop the view if…': 'Şu olursa görüşümden vazgeçerim…', 'I drop the view if': 'Şu olursa görüşümden vazgeçerim',
  'Example: Cloud price competition squeezes margins': 'Örnek: Bulut fiyat rekabeti marjları daraltır',
  'Add risk': 'Risk ekle', 'Remove': 'Kaldır', 'Remove risk': 'Riski kaldır',
  'Choose a horizon: 6, 12 or 24 months.': 'Bir vade seç: 6, 12 veya 24 ay.',
  'Name the metric in at least 8 characters, for example FY2027 operating margin.': 'Metriği en az 8 karakterle adlandır; örneğin FY2027 faaliyet marjı.',
  'The proof metric must be a business figure, not a share price.': 'Kanıt metriği hisse fiyatı değil, şirketin bir iş göstergesi olmalı.',
  'Market value and valuation multiples (P/E, EV/EBITDA) move with the share price; choose a business figure (margin, revenue growth, cash flow).':
    'Piyasa değeri ve F/K, FD/FAVÖK gibi çarpanlar hisse fiyatına bağlıdır; bir iş göstergesi seç (marj, gelir büyümesi, nakit akışı).',
  'Enter the threshold as a number, for example 30.': 'Eşik değeri sayı olarak yaz; örneğin 30.',
  'This year’s result is already reported; pick a period that will be reported within your horizon.': 'Bu dönemin sonucu zaten açıklandı; vaden içinde açıklanacak bir dönem seç.',
  'Risk {n}: describe what could go wrong for the company, not a buy/sell decision.': 'Risk {n}: al/sat kararını değil, şirket için neyin ters gidebileceğini yaz.',
  'Risk {n}: base the kill criterion on a company figure, not on the share price or a buy/sell decision.': 'Risk {n}: vazgeçme kriteri hisse fiyatına ya da al/sat kararına değil, şirketin bir göstergesine dayanmalı.',
  'Write at least one risk.': 'En az bir risk yaz.',
  'Each risk needs at least 10 characters.': 'Her risk en az 10 karakter olmalı.',
  'A kill criterion needs its risk: write the risk in the same row.': 'Vazgeçme kriterinin riskini de aynı satıra yaz.',
  'Write at least one kill criterion.': 'En az bir vazgeçme kriteri yaz.',
  'Finish your view in step 1 to unlock publishing:': 'Yayınlamak için 1. adımdaki görüşünü tamamla:',
  'This is not investment advice; it is student work. The view is a relative expectation against the benchmark index.':
    'Bu bir yatırım tavsiyesi değildir; öğrenci çalışmasıdır. Görüş, kıyaslama endeksine göre göreli bir beklentidir.',
  'My view': 'Görüşüm', 'My proof metric': 'Kanıt metriğim', 'My kill criterion': 'Vazgeçme kriterim', 'My kill criteria': 'Vazgeçme kriterlerim',
  'MY VIEW': 'GÖRÜŞÜM', 'PROOF METRIC': 'KANIT METRİĞİ', 'I DROP THE VIEW IF': 'ŞU OLURSA GÖRÜŞÜMDEN VAZGEÇERİM',
  'RISK MATRIX': 'RİSK MATRİSİ', 'PROBABILITY': 'OLASILIK', 'IMPACT': 'ETKİ', 'benchmark': 'kıyaslama',
  '5–9 slides (PDF) to add to a post as a document.': 'Gönderiye belge olarak eklenecek 5–9 sayfalık PDF.',
  'Kill criterion': 'Vazgeçme kriteri',
  'Review date': 'Değerlendirme tarihi', 'due now': 'zamanı geldi', 'Relative view · not investment advice': 'Göreli görüş · yatırım tavsiyesi değildir', 'Closing prices at publication': 'Yayın günündeki kapanış fiyatları'
});
Object.assign(QE_ES, {
  'Your view': 'Tu opinión', 'optional': 'opcional', 'No explicit view': 'Sin opinión explícita',
  'Over the next 6–24 months, do you expect the company’s shares to do better than, about the same as, or worse than an index? Say what would make you drop that view. This is a relative expectation, not a buy/sell recommendation or a price target.':
    'En los próximos 6–24 meses, ¿esperas que la acción de la empresa vaya mejor, parecido o peor que un índice? Indica también qué te haría abandonar esa opinión. Es una expectativa relativa, no una recomendación de compra o venta ni un precio objetivo.',
  'Benchmark index': 'Índice de referencia', 'Horizon': 'Horizonte', 'months': 'meses',
  'Proof metric': 'Métrica de prueba', 'The one number that would prove you right.': 'La cifra que demostraría que tienes razón.',
  'Metric': 'Métrica', 'Comparison': 'Comparación', 'Threshold': 'Umbral', 'Unit': 'Unidad',
  '$ million': 'millones de $', 'no unit': 'sin unidad', 'Example: FY2027 operating margin': 'Ejemplo: margen operativo FY2027',
  'Risks and kill criteria': 'Riesgos y criterios de abandono', 'Risk': 'Riesgo', 'Probability': 'Probabilidad', 'Impact': 'Impacto',
  'Low': 'Baja', 'Medium': 'Media', 'High': 'Alta', 'Low (impact)': 'Bajo', 'Medium (impact)': 'Medio', 'High (impact)': 'Alto',
  'Example: segment growth stays below 10% for two quarters in a row': 'Ejemplo: el crecimiento del segmento queda por debajo del 10% dos trimestres seguidos',
  'I drop the view if…': 'Abandono la opinión si…', 'I drop the view if': 'Abandono la opinión si',
  'Example: Cloud price competition squeezes margins': 'Ejemplo: la competencia de precios en la nube reduce los márgenes',
  'Add risk': 'Añadir riesgo', 'Remove': 'Quitar', 'Remove risk': 'Quitar riesgo',
  'Choose a horizon: 6, 12 or 24 months.': 'Elige un horizonte: 6, 12 o 24 meses.',
  'Name the metric in at least 8 characters, for example FY2027 operating margin.': 'Nombra la métrica con al menos 8 caracteres, por ejemplo margen operativo FY2027.',
  'The proof metric must be a business figure, not a share price.': 'La métrica de prueba debe ser una cifra del negocio, no el precio de la acción.',
  'Market value and valuation multiples (P/E, EV/EBITDA) move with the share price; choose a business figure (margin, revenue growth, cash flow).':
    'El valor de mercado y los múltiplos (PER, EV/EBITDA) dependen del precio de la acción; elige una cifra del negocio (margen, crecimiento de ingresos, flujo de caja).',
  'Enter the threshold as a number, for example 30.': 'Escribe el umbral como número, por ejemplo 30.',
  'This year’s result is already reported; pick a period that will be reported within your horizon.': 'El resultado de ese periodo ya se publicó; elige un periodo que se publique dentro de tu horizonte.',
  'Risk {n}: describe what could go wrong for the company, not a buy/sell decision.': 'Riesgo {n}: describe qué podría salir mal para la empresa, no una decisión de compra o venta.',
  'Risk {n}: base the kill criterion on a company figure, not on the share price or a buy/sell decision.': 'Riesgo {n}: basa el criterio de abandono en una cifra de la empresa, no en el precio de la acción ni en una decisión de compra o venta.',
  'Write at least one risk.': 'Escribe al menos un riesgo.',
  'Each risk needs at least 10 characters.': 'Cada riesgo necesita al menos 10 caracteres.',
  'A kill criterion needs its risk: write the risk in the same row.': 'Un criterio de abandono necesita su riesgo: escríbelo en la misma fila.',
  'Write at least one kill criterion.': 'Escribe al menos un criterio de abandono.',
  'Finish your view in step 1 to unlock publishing:': 'Completa tu opinión en el paso 1 para poder publicar:',
  'This is not investment advice; it is student work. The view is a relative expectation against the benchmark index.':
    'Esto no es asesoramiento de inversión; es un trabajo de estudiante. La opinión es una expectativa relativa frente al índice de referencia.',
  'My view': 'Mi opinión', 'My proof metric': 'Mi métrica de prueba', 'My kill criterion': 'Mi criterio de abandono', 'My kill criteria': 'Mis criterios de abandono',
  'MY VIEW': 'MI OPINIÓN', 'PROOF METRIC': 'MÉTRICA DE PRUEBA', 'I DROP THE VIEW IF': 'ABANDONO LA OPINIÓN SI',
  'RISK MATRIX': 'MATRIZ DE RIESGOS', 'PROBABILITY': 'PROBABILIDAD', 'IMPACT': 'IMPACTO', 'benchmark': 'referencia',
  '5–9 slides (PDF) to add to a post as a document.': 'De 5 a 9 diapositivas en PDF para añadir a una publicación como documento.',
  'Kill criterion': 'Criterio de abandono',
  'Review date': 'Fecha de revisión', 'due now': 'toca ahora', 'Relative view · not investment advice': 'Opinión relativa · no es asesoramiento de inversión', 'Closing prices at publication': 'Cierres el día de la publicación'
});

/* v0.13.5 Lab #20: range of outcomes (Monte Carlo) */
Object.assign(QE_TR, {
  "Range of outcomes (Monte Carlo)": "Belirsizlik aralığı (Monte Carlo)",
  "How wide could the price range be over the coming months, and how much do earnings days add to that uncertainty?": "Önümüzdeki aylarda fiyat ne kadar geniş bir aralıkta oynayabilir, bilanço günleri bu belirsizliğe ne katıyor?",
  "Horizon (months)": "Vade (ay)", "Include earnings days (US stocks)": "Bilanço günlerini ekle (ABD hisseleri)",
  'Range of outcomes after 6 months (random-walk model, not a forecast)': '6 ay sonraki sonuç aralığı (rastgele yürüyüş modeli, tahmin değil)',
  'Range of outcomes after 12 months (random-walk model, not a forecast)': '12 ay sonraki sonuç aralığı (rastgele yürüyüş modeli, tahmin değil)',
  'Range of outcomes after 24 months (random-walk model, not a forecast)': '24 ay sonraki sonuç aralığı (rastgele yürüyüş modeli, tahmin değil)',
  'Outcome': 'Sonuç', 'Price (USD)': 'Fiyat ($)', 'Price (TRY)': 'Fiyat (TL)', 'Return vs today': 'Bugüne göre getiri',
  'Without earnings jumps, formula (USD)': 'Bilanço sıçramaları olmadan, formül ($)', 'Without earnings jumps, formula (TRY)': 'Bilanço sıçramaları olmadan, formül (TL)',
  '5th percentile': '5. yüzdelik', '25th percentile': '25. yüzdelik', 'Median (50th)': 'Medyan (50.)', 'Median': 'Medyan',
  '75th percentile': '75. yüzdelik', '95th percentile': '95. yüzdelik', 'Mean (expected value)': 'Ortalama (beklenen değer)',
  'Model inputs and risk measures': 'Model girdileri ve risk ölçüleri',
  "Today's price (last close)": 'Bugünkü fiyat (son kapanış)', 'Probability of ending below today': 'Bugünün altında bitme olasılığı',
  'Probability of touching −20% at any close': 'Herhangi bir kapanışta −%20’ye dokunma olasılığı',
  'Annualised volatility, normal days (3 years)': 'Yıllık oynaklık, normal günler (3 yıl)',
  'Annualised volatility, last 63 trading days (all days)': 'Yıllık oynaklık, son 63 işlem günü (tüm günler)',
  'Excess kurtosis of normal days (normal distribution = 0)': 'Normal günlerin fazla basıklığı (normal dağılım = 0)',
  'Autocorrelation of squared returns, lag 1 (0 = no clustering)': 'Kare getirilerin 1 günlük otokorelasyonu (0 = kümelenme yok)',
  'Daily returns used': 'Kullanılan günlük getiri sayısı',
  'Median absolute move, earnings day': 'Medyan mutlak hareket, bilanço günü', 'Median absolute move, normal day': 'Medyan mutlak hareket, normal gün',
  'Earnings day ÷ normal day': 'Bilanço günü ÷ normal gün', 'Earnings days used (last 3 years)': 'Kullanılan bilanço günleri (son 3 yıl)',
  'Earnings days inside the horizon (projected)': 'Vade içindeki bilanço günleri (öngörülen takvim)',
  'Share of horizon variance from earnings days': 'Vade varyansında bilanço günlerinin payı',
  "Range of outcomes, 100 = today's price (random-walk model, not a forecast)": 'Sonuç aralığı, 100 = bugünkü fiyat (rastgele yürüyüş modeli, tahmin değil)',
  'Earnings-day moves, last 3 years': 'Bilanço günü hareketleri, son 3 yıl', 'Earnings-day move': 'Bilanço günü hareketi',
  'Earnings days taken out of the normal-day sample': 'Normal gün örneğinden çıkarılan bilanço günleri',
  'Reaction day': 'Tepki günü', 'Move that day': 'O günkü hareket',
  '8-K results dates on SEC EDGAR (Item 2.02)': 'SEC EDGAR’daki 8-K bilanço tarihleri (Item 2.02)'
});
Object.assign(QE_ES, {
  'Range of outcomes (Monte Carlo)': 'Rango de resultados (Monte Carlo)',
  'How wide could the price range be over the coming months, and how much do earnings days add to that uncertainty?': '¿En qué rango podría moverse el precio en los próximos meses y cuánto añaden los días de resultados a esa incertidumbre?',
  'Horizon (months)': 'Horizonte (meses)', 'Include earnings days (US stocks)': 'Incluir días de resultados (acciones de EE. UU.)',
  'Range of outcomes after 6 months (random-walk model, not a forecast)': 'Rango de resultados a 6 meses (modelo de paseo aleatorio, no es una previsión)',
  'Range of outcomes after 12 months (random-walk model, not a forecast)': 'Rango de resultados a 12 meses (modelo de paseo aleatorio, no es una previsión)',
  'Range of outcomes after 24 months (random-walk model, not a forecast)': 'Rango de resultados a 24 meses (modelo de paseo aleatorio, no es una previsión)',
  'Outcome': 'Resultado', 'Price (USD)': 'Precio ($)', 'Price (TRY)': 'Precio (TRY)', 'Return vs today': 'Rentabilidad frente a hoy',
  'Without earnings jumps, formula (USD)': 'Sin saltos de resultados, fórmula ($)', 'Without earnings jumps, formula (TRY)': 'Sin saltos de resultados, fórmula (TRY)',
  '5th percentile': 'Percentil 5', '25th percentile': 'Percentil 25', 'Median (50th)': 'Mediana (50)', 'Median': 'Mediana',
  '75th percentile': 'Percentil 75', '95th percentile': 'Percentil 95', 'Mean (expected value)': 'Media (valor esperado)',
  'Model inputs and risk measures': 'Datos del modelo y medidas de riesgo', 'Value': 'Valor', 'Timing': 'Momento',
  'Release (8-K)': 'Publicación (8-K)', 'after close': 'tras el cierre', 'before/during market': 'antes/durante la sesión',
  "Today's price (last close)": 'Precio de hoy (último cierre)', 'Probability of ending below today': 'Probabilidad de terminar por debajo de hoy',
  'Probability of touching −20% at any close': 'Probabilidad de tocar −20 % en algún cierre',
  'Annualised volatility, normal days (3 years)': 'Volatilidad anualizada, días normales (3 años)',
  'Annualised volatility, last 63 trading days (all days)': 'Volatilidad anualizada, últimas 63 sesiones (todos los días)',
  'Excess kurtosis of normal days (normal distribution = 0)': 'Exceso de curtosis de los días normales (distribución normal = 0)',
  'Autocorrelation of squared returns, lag 1 (0 = no clustering)': 'Autocorrelación de rentabilidades al cuadrado, retardo 1 (0 = sin agrupamiento)',
  'Daily returns used': 'Rentabilidades diarias usadas',
  'Median absolute move, earnings day': 'Movimiento absoluto mediano, día de resultados', 'Median absolute move, normal day': 'Movimiento absoluto mediano, día normal',
  'Earnings day ÷ normal day': 'Día de resultados ÷ día normal', 'Earnings days used (last 3 years)': 'Días de resultados usados (últimos 3 años)',
  'Earnings days inside the horizon (projected)': 'Días de resultados dentro del horizonte (proyectados)',
  'Share of horizon variance from earnings days': 'Parte de la varianza del horizonte debida a días de resultados',
  "Range of outcomes, 100 = today's price (random-walk model, not a forecast)": 'Rango de resultados, 100 = precio de hoy (modelo de paseo aleatorio, no es una previsión)',
  'Earnings-day moves, last 3 years': 'Movimientos en días de resultados, últimos 3 años', 'Earnings-day move': 'Movimiento en día de resultados',
  'Earnings days taken out of the normal-day sample': 'Días de resultados excluidos de la muestra de días normales',
  'Reaction day': 'Día de reacción', 'Move that day': 'Movimiento ese día',
  '8-K results dates on SEC EDGAR (Item 2.02)': 'Fechas de resultados 8-K en SEC EDGAR (Item 2.02)'
});

/* Relative noise band (noise_band.py): random-walk range of a view's gap vs its benchmark, not a forecast */
Object.assign(QE_TR, {
  'Noise band': 'Gürültü bandı',
  'Over this horizon, a gap of {lo}/{hi} points versus the {b} happens by chance alone about 2 times in 3. Your view has to explain a bigger gap than that.':
    'Bu vadede {b}’e göre {lo}/{hi} puanlık bir fark, sadece rastlantıyla yaklaşık 3 seferden 2’sinde olur. Görüşünün bundan daha büyük bir farkı açıklaması gerekir.',
  '19 times in 20 the gap stays within {lo}/{hi} points.': '20 seferden 19’unda fark {lo}/{hi} puan içinde kalır.',
  'By chance alone, the gap stays within ±5 points (a neutral view’s hit band) about {p}% of the time.':
    'Sadece rastlantıyla farkın ±5 puan içinde kalma (nötr görüşün isabet bandı) olasılığı yaklaşık %{p}.',
  'Range of outcomes under a random-walk model, not a forecast. Zero assumed edge; volatility from the last 3 years of daily relative returns. Real returns have fat tails, volatility clustering and regime changes; the model can be wrong.':
    'Rastgele yürüyüş modeline göre olası sonuç aralığı, tahmin değil. Varsayılan üstünlük sıfır; oynaklık son 3 yılın göreli günlük getirilerinden. Gerçek getirilerde kalın kuyruklar, oynaklık kümelenmesi ve rejim değişiklikleri vardır; model yanılabilir.',
  'Measuring how big a gap chance alone produces…': 'Sadece rastlantının ne kadar fark yarattığı ölçülüyor…',
  'The noise band could not be computed right now; you can still publish. The server tries again when you publish.':
    'Gürültü bandı şu an hesaplanamadı; yine de yayınlayabilirsin. Sunucu yayın anında tekrar dener.',
  'within normal noise': 'normal gürültü içinde', 'notable': 'dikkat çekici', 'unusual': 'sıra dışı', 'interim': 'ara durum',
  'random-walk noise band, not a forecast': 'rastgele yürüyüş gürültü bandı, tahmin değil',
  'Hits beyond the noise': 'Gürültünün ötesinde isabet'
});
Object.assign(QE_ES, {
  'Noise band': 'Banda de ruido',
  'Over this horizon, a gap of {lo}/{hi} points versus the {b} happens by chance alone about 2 times in 3. Your view has to explain a bigger gap than that.':
    'En este plazo, una diferencia de {lo}/{hi} puntos frente al {b} ocurre solo por azar aproximadamente 2 de cada 3 veces. Tu opinión tiene que explicar una diferencia mayor.',
  '19 times in 20 the gap stays within {lo}/{hi} points.': '19 de cada 20 veces la diferencia queda dentro de {lo}/{hi} puntos.',
  'By chance alone, the gap stays within ±5 points (a neutral view’s hit band) about {p}% of the time.':
    'Solo por azar, la diferencia queda dentro de ±5 puntos (la banda de acierto de una opinión neutral) aproximadamente el {p} % de las veces.',
  'Range of outcomes under a random-walk model, not a forecast. Zero assumed edge; volatility from the last 3 years of daily relative returns. Real returns have fat tails, volatility clustering and regime changes; the model can be wrong.':
    'Rango de resultados bajo un modelo de paseo aleatorio, no una previsión. Ventaja supuesta cero; volatilidad de los rendimientos diarios relativos de los últimos 3 años. Los rendimientos reales tienen colas gruesas, agrupamiento de volatilidad y cambios de régimen; el modelo puede fallar.',
  'Measuring how big a gap chance alone produces…': 'Midiendo qué diferencia produce el azar por sí solo…',
  'The noise band could not be computed right now; you can still publish. The server tries again when you publish.':
    'La banda de ruido no se pudo calcular ahora; puedes publicar igualmente. El servidor lo vuelve a intentar al publicar.',
  'within normal noise': 'dentro del ruido normal', 'notable': 'notable', 'unusual': 'inusual', 'interim': 'provisional',
  'random-walk noise band, not a forecast': 'banda de ruido de paseo aleatorio, no una previsión',
  'Hits beyond the noise': 'Aciertos más allá del ruido'
});
/* v0.13.5 review fixes: #20 plain-language risk rows and reference line; noise band sentences ("between X and Y"),
   the relative-return caveat and the carousel noise line. */
Object.assign(QE_TR, {
  'Fat-tail measure: excess kurtosis of normal days (0 = normal curve; higher = extreme moves more often)':
    'Kalın kuyruk ölçüsü: normal günlerin fazla basıklığı (0 = normal eğri; büyüdükçe uç hareketler sıklaşır)',
  'Volatility-clustering measure: lag-1 autocorrelation of squared returns (0 = none)':
    'Oynaklık kümelenmesi ölçüsü: kare getirilerin 1 günlük otokorelasyonu (0 = yok)',
  "Today's price (100)": 'Bugünkü fiyat (100)',
  'By chance alone (random-walk model), over this horizon the gap versus the {b} stays between {lo} and {hi} points about 2 times in 3. A result inside that range cannot be told apart from luck.':
    'Sadece rastlantıyla (rastgele yürüyüş modeli), bu vadede {b}’e göre fark yaklaşık 3 seferden 2’sinde {lo} ile {hi} puan arasında kalır. Bu aralıktaki bir sonuç şanstan ayırt edilemez.',
  '19 times in 20 the gap stays between {lo} and {hi} points.': '20 seferden 19’unda fark {lo} ile {hi} puan arasında kalır.',
  'Range of outcomes under a random-walk model, not a forecast. Zero assumed edge; volatility from the last 3 years of daily relative returns. Real returns have fat tails, volatility clustering and regime changes; the model can be wrong. The band is for the relative return: when the benchmark moves a lot (e.g. BIST in lira) the gap in points scales with it.':
    'Rastgele yürüyüş modeline göre olası sonuç aralığı, tahmin değil. Varsayılan üstünlük sıfır; oynaklık son 3 yılın göreli günlük getirilerinden. Gerçek getirilerde kalın kuyruklar, oynaklık kümelenmesi ve rejim değişiklikleri vardır; model yanılabilir. Bant göreli getiri içindir: endeks çok hareket ederse (ör. TL bazında BIST) puan farkı da onunla orantılı büyür ya da küçülür.',
  'Noise band (random-walk model, not a forecast): by chance alone the gap stays between {lo} and {hi} points 2 times in 3.':
    'Gürültü bandı (rastgele yürüyüş modeli, tahmin değil): sadece rastlantıyla fark 3 seferden 2’sinde {lo} ile {hi} puan arasında kalır.'
});
Object.assign(QE_ES, {
  'Fat-tail measure: excess kurtosis of normal days (0 = normal curve; higher = extreme moves more often)':
    'Medida de colas gruesas: exceso de curtosis de los días normales (0 = curva normal; más alto = movimientos extremos más frecuentes)',
  'Volatility-clustering measure: lag-1 autocorrelation of squared returns (0 = none)':
    'Medida de agrupamiento de volatilidad: autocorrelación de rentabilidades al cuadrado, retardo 1 (0 = ninguno)',
  "Today's price (100)": 'Precio de hoy (100)',
  'By chance alone (random-walk model), over this horizon the gap versus the {b} stays between {lo} and {hi} points about 2 times in 3. A result inside that range cannot be told apart from luck.':
    'Solo por azar (modelo de paseo aleatorio), en este plazo la diferencia frente al {b} queda entre {lo} y {hi} puntos aproximadamente 2 de cada 3 veces. Un resultado dentro de ese rango no se distingue de la suerte.',
  '19 times in 20 the gap stays between {lo} and {hi} points.': '19 de cada 20 veces la diferencia queda entre {lo} y {hi} puntos.',
  'Range of outcomes under a random-walk model, not a forecast. Zero assumed edge; volatility from the last 3 years of daily relative returns. Real returns have fat tails, volatility clustering and regime changes; the model can be wrong. The band is for the relative return: when the benchmark moves a lot (e.g. BIST in lira) the gap in points scales with it.':
    'Rango de resultados bajo un modelo de paseo aleatorio, no una previsión. Ventaja supuesta cero; volatilidad de los rendimientos diarios relativos de los últimos 3 años. Los rendimientos reales tienen colas gruesas, agrupamiento de volatilidad y cambios de régimen; el modelo puede fallar. La banda es para el rendimiento relativo: si el índice se mueve mucho (p. ej. BIST en liras) la diferencia en puntos crece o se reduce con él.',
  'Noise band (random-walk model, not a forecast): by chance alone the gap stays between {lo} and {hi} points 2 times in 3.':
    'Banda de ruido (modelo de paseo aleatorio, no una previsión): solo por azar la diferencia queda entre {lo} y {hi} puntos 2 de cada 3 veces.'
});

Object.assign(QE_TR, {
 "DCF valuation": "DCF değerlemesi",
 "What is the share worth under my assumptions, and how sensitive is that?": "Kendi varsayımlarımla hisse ne kadar eder, bu sonuç varsayımlara ne kadar duyarlı?",
 "Operating margin % (blank = 3-year average)": "Faaliyet kâr marjı % (boş = son 3 yıl ortalaması)",
 "WACC % (blank = build from CAPM)": "WACC % (boş = CAPM ile hesapla)",
 "Assumptions": "Varsayımlar",
 "Discount rate (WACC) build": "İskonto oranı (WACC) nasıl kuruldu",
 "Five-year free cash flow forecast": "5 yıllık serbest nakit akışı tahmini",
 "From enterprise value to equity value": "Firma değerinden özkaynak değerine",
 "Value per share": "Hisse başına değer",
 "Free cash flow by forecast year": "Tahmin yıllarına göre serbest nakit akışı",
 "Item": "Kalem",
 "Value": "Değer",
 "Type": "Tür",
 "Source": "Kaynak",
 "Fiscal year": "Mali yıl",
 "Revenue growth": "Gelir büyümesi",
 "Revenue": "Gelir",
 "Operating income": "Faaliyet kârı",
 "NOPAT": "Vergi sonrası faaliyet kârı (NOPAT)",
 "D&A": "Amortisman",
 "Capex": "Yatırım harcaması",
 "Change in NWC": "İşletme sermayesi artışı",
 "FCFF": "Serbest nakit akışı (FCFF)",
 "Discount factor": "İskonto çarpanı",
 "Present value": "Bugünkü değer",
 "Reported": "Raporlanan",
 "Calculated": "Hesaplanan",
 "Assumption": "Varsayım",
 "Model output": "Model çıktısı"
});
Object.assign(QE_ES, {
 "DCF valuation": "Valoración DCF",
 "What is the share worth under my assumptions, and how sensitive is that?": "¿Cuánto vale la acción con mis supuestos y qué tan sensible es?",
 "Operating margin % (blank = 3-year average)": "Margen operativo % (vacío = media de 3 años)",
 "WACC % (blank = build from CAPM)": "WACC % (vacío = calcular con CAPM)",
 "Assumptions": "Supuestos",
 "Discount rate (WACC) build": "Construcción de la tasa de descuento (WACC)",
 "Five-year free cash flow forecast": "Previsión de flujo de caja libre a 5 años",
 "From enterprise value to equity value": "Del valor de empresa al valor del patrimonio",
 "Value per share": "Valor por acción",
 "Free cash flow by forecast year": "Flujo de caja libre por año previsto",
 "Item": "Partida",
 "Value": "Valor",
 "Type": "Tipo",
 "Reported": "Reportado",
 "Calculated": "Calculado",
 "Assumption": "Supuesto",
 "Model output": "Resultado del modelo",
 "Discount factor": "Factor de descuento",
 "Present value": "Valor presente",
 "Change in NWC": "Aumento del capital circulante"
});

Object.assign(QE_TR, {
 "Bank and insurer valuation": "Banka ve sigortacı değerlemesi",
 "What is a bank worth given how much it earns on its equity?": "Bir banka, özkaynağı üzerinde ne kadar kazandığına göre ne kadar eder?",
 "Earnings move priced by options": "Opsiyonların fiyatladığı bilanço hareketi",
 "How big a move around the next results is the options market pricing, compared with history?": "Opsiyon piyasası bir sonraki bilanço için ne kadar büyük bir hareket fiyatlıyor, geçmişle kıyaslayınca?",
 "Valuation summary": "Değerleme özeti",
 "Where does the price sit against every valuation method at once?": "Fiyat, bütün değerleme yöntemlerine göre aynı anda nerede duruyor?",
 "ROE % (blank = 3-year average)": "ROE % (boş = son 3 yıl ortalaması)",
 "Peers for multiples (comma separated; blank = suggested from the SEC industry code)": "Çarpanlar için rakipler (virgülle; boş = SEC sektör kodundan öner)",
 "Base vs price": "Baz / fiyat",
 "Call": "Alım (call)",
 "Put": "Satım (put)",
 "Cost of equity": "Özkaynak maliyeti",
 "Cost of equity %": "Özkaynak maliyeti %",
 "Earnings-day moves: past reactions vs what options price now": "Bilanço günü hareketleri: geçmiş tepkiler ve opsiyonların şimdi fiyatladığı",
 "Expiry": "Vade",
 "Fiscal year end": "Mali yıl sonu",
 "How it is built": "Nasıl hesaplandı",
 "Implied volatility": "İma edilen oynaklık",
 "Method": "Yöntem",
 "Move": "Hareket",
 "Option prices used (at the money)": "Kullanılan opsiyon fiyatları (paranın başında)",
 "Past absolute reaction": "Geçmiş mutlak tepki",
 "Past earnings-day reactions": "Geçmiş bilanço günü tepkileri",
 "Peer multiples used": "Kullanılan rakip çarpanları",
 "Price vs range": "Fiyat / aralık",
 "Priced by options": "Opsiyonların fiyatladığı",
 "Priced move vs past reactions": "Fiyatlanan hareket ve geçmiş tepkiler",
 "Quote quality": "Fiyat kalitesi",
 "ROE": "Özkaynak kârlılığı (ROE)",
 "Results date (8-K)": "Bilanço tarihi (8-K)",
 "Return on equity by year": "Yıllara göre özkaynak kârlılığı",
 "Return on equity vs cost of equity": "Özkaynak kârlılığı ve özkaynak maliyeti",
 "Straddle": "Straddle (alım + satım)",
 "Strike": "Kullanım fiyatı",
 "Valuation summary: value per share by method": "Değerleme özeti: yönteme göre hisse başına değer",
 "Value per share by method": "Yönteme göre hisse başına değer",
 "Value per share: cost of equity (rows) × ROE (columns)": "Hisse başına değer: özkaynak maliyeti (satırlar) × ROE (sütunlar)"
});
Object.assign(QE_ES, {
 "Bank and insurer valuation": "Valoración de bancos y aseguradoras",
 "What is a bank worth given how much it earns on its equity?": "¿Cuánto vale un banco según lo que gana sobre su patrimonio?",
 "Earnings move priced by options": "Movimiento de resultados según las opciones",
 "How big a move around the next results is the options market pricing, compared with history?": "¿Qué movimiento alrededor de los próximos resultados descuentan las opciones, frente a la historia?",
 "Valuation summary": "Resumen de valoración",
 "Where does the price sit against every valuation method at once?": "¿Dónde está el precio frente a todos los métodos de valoración a la vez?",
 "ROE % (blank = 3-year average)": "ROE % (vacío = media de 3 años)",
 "Peers for multiples (comma separated; blank = suggested from the SEC industry code)": "Comparables para múltiplos (separados por comas; vacío = sugeridos por el código sectorial de la SEC)",
 "Cost of equity": "Coste del capital",
 "Cost of equity %": "Coste del capital %",
 "Expiry": "Vencimiento",
 "Implied volatility": "Volatilidad implícita",
 "Method": "Método",
 "Move": "Movimiento",
 "Strike": "Precio de ejercicio",
 "Price vs range": "Precio frente al rango",
 "How it is built": "Cómo se calcula",
 "Value per share by method": "Valor por acción por método",
 "Valuation summary: value per share by method": "Resumen de valoración: valor por acción por método",
 "Past earnings-day reactions": "Reacciones pasadas en días de resultados",
 "Priced by options": "Descontado por las opciones",
 "Past absolute reaction": "Reacción absoluta pasada"
});

Object.assign(QE_TR, {
 "Risk-free rate % (blank = today’s 10-year US Treasury)": "Risksiz faiz % (boş = bugünkü 10 yıllık ABD tahvil faizi)"
});
Object.assign(QE_ES, {
 "Risk-free rate % (blank = today’s 10-year US Treasury)": "Tipo libre de riesgo % (vacío = bono del Tesoro de EE. UU. a 10 años de hoy)"
});

Object.assign(QE_TR, {
 "Insider trading (Form 4)": "İçeriden işlemler (Form 4)",
 "What have directors and executives done with their own shares?": "Yöneticiler ve yönetim kurulu üyeleri kendi hisseleriyle ne yaptı?",
 "Institutional ownership (13F)": "Kurumsal sahiplik (13F)",
 "Which big funds own it, and did they buy or sell last quarter?": "Hangi büyük fonlar sahip, geçen çeyrek aldılar mı sattılar mı?",
 "Quarterly results tracker": "Çeyreklik sonuç takibi",
 "How did the latest quarter compare with the prior quarter and a year ago?": "Son çeyrek, bir önceki çeyreğe ve geçen yıla göre nasıldı?",
 "% of shares": "Hisselerin %’si",
 "10b5-1 plan": "10b5-1 planı",
 "Before results": "Bilanço öncesi",
 "Buys": "Alımlar",
 "Sales": "Satışlar",
 "By insider": "Kişiye göre",
 "Change in stake since the prior 13F, top institutions": "Bir önceki 13F’e göre pay değişimi, en büyük kurumlar",
 "Change since prior filing": "Önceki rapora göre değişim",
 "Change vs a year ago": "Geçen yıla göre değişim",
 "Change vs prior": "Önceki çeyreğe göre değişim",
 "Code": "Kod",
 "Count": "Adet",
 "Date": "Tarih",
 "Date reported": "Rapor tarihi",
 "Diluted EPS": "Seyreltilmiş HBK",
 "Discretionary?": "İsteğe bağlı mı?",
 "Filing": "Rapor",
 "Holder": "Sahip",
 "Insider": "İçeriden kişi",
 "Last transaction": "Son işlem",
 "Latest quarter vs prior quarter and a year ago": "Son çeyrek, önceki çeyrek ve geçen yılın aynı çeyreği",
 "Latest transactions": "Son işlemler",
 "Margins by quarter": "Çeyreklere göre marjlar",
 "Meaning": "Anlamı",
 "Net shares bought/sold": "Net alınan/satılan hisse",
 "Open-market buys": "Açık piyasa alımları",
 "Open-market sales": "Açık piyasa satışları",
 "Open-market insider buys and sales by month": "Aylara göre içeriden açık piyasa alım ve satışları",
 "Ownership summary": "Sahiplik özeti",
 "Prior quarter": "Önceki çeyrek",
 "Latest quarter": "Son çeyrek",
 "Quarter by quarter": "Çeyrek çeyrek",
 "Quarter end": "Çeyrek sonu",
 "Revenue by quarter": "Çeyreklere göre gelir",
 "Role": "Görev",
 "Same quarter last year": "Geçen yılın aynı çeyreği",
 "Shares": "Hisse",
 "Shares held after": "İşlem sonrası hisse",
 "Sold, % of direct holding": "Satılan, doğrudan payın %’si",
 "Top institutional holders (13F)": "En büyük kurumsal sahipler (13F)",
 "Top mutual fund holders": "En büyük yatırım fonu sahipleri",
 "Transactions": "İşlem",
 "Transactions by type": "Türe göre işlemler",
 "vs a year ago": "geçen yıla göre",
 "vs prior quarter": "önceki çeyreğe göre"
});
Object.assign(QE_ES, {
 "Insider trading (Form 4)": "Operaciones de directivos (Form 4)",
 "What have directors and executives done with their own shares?": "¿Qué han hecho los consejeros y directivos con sus propias acciones?",
 "Institutional ownership (13F)": "Propiedad institucional (13F)",
 "Which big funds own it, and did they buy or sell last quarter?": "¿Qué grandes fondos la tienen y compraron o vendieron el último trimestre?",
 "Quarterly results tracker": "Seguimiento de resultados trimestrales",
 "How did the latest quarter compare with the prior quarter and a year ago?": "¿Cómo fue el último trimestre frente al anterior y al de hace un año?",
 "Buys": "Compras",
 "Sales": "Ventas",
 "Insider": "Directivo",
 "Holder": "Titular",
 "Role": "Cargo",
 "Date": "Fecha",
 "Shares": "Acciones",
 "Diluted EPS": "BPA diluido",
 "Latest quarter": "Último trimestre",
 "Prior quarter": "Trimestre anterior",
 "Same quarter last year": "Mismo trimestre del año anterior",
 "Revenue by quarter": "Ingresos por trimestre",
 "Margins by quarter": "Márgenes por trimestre",
 "Before results": "Antes de resultados",
 "Top institutional holders (13F)": "Principales titulares institucionales (13F)"
});

Object.assign(QE_TR, {
 "Earnings checks": "Bilanço kontrolleri",
 "Priced by options": "Opsiyonların fiyatladığı",
 "Actual move": "Gerçekleşen hareket",
 "Bigger than priced": "Fiyatlanandan büyük",
 "Smaller than priced": "Fiyatlanandan küçük",
 "About as priced (±20%)": "Fiyatlanana yakın (±%20)",
 "Prices could not be read.": "Fiyat verisi okunamadı.",
 "Results not out yet, or the reaction session has not closed.": "Bilanço henüz açıklanmadı veya tepki günü kapanmadı.",
 "The size of the move is compared, not its direction.": "Hareketin yönü değil, büyüklüğü karşılaştırılır."
});
Object.assign(QE_ES, {
 "Earnings checks": "Controles de resultados",
 "Priced by options": "Descontado por las opciones",
 "Actual move": "Movimiento real",
 "Bigger than priced": "Mayor de lo descontado",
 "Smaller than priced": "Menor de lo descontado",
 "About as priced (±20%)": "Similar a lo descontado (±20%)",
 "Prices could not be read.": "No se pudieron leer los precios.",
 "Results not out yet, or the reaction session has not closed.": "Los resultados aún no se publicaron o la sesión de reacción no ha cerrado.",
 "The size of the move is compared, not its direction.": "Se compara el tamaño del movimiento, no su dirección."
});

Object.assign(QE_TR, {
 "Reviewer checklist": "Editör kontrol listesi",
 "The thesis is a full argument": "Tez tam bir argüman",
 "Write at least 80 characters: what you think and why.": "En az 80 karakter yaz: ne düşündüğünü ve nedenini.",
 "The thesis uses a number from the analysis": "Tez analizden bir rakam kullanıyor",
 "Quote one figure from the findings (a margin, a growth rate) so a reader can check it.": "Bulgulardan bir rakam (marj, büyüme oranı) yaz ki okuyan kontrol edebilsin.",
 "The thesis gives a reason": "Tez bir neden veriyor",
 "Say why: use “because …” and name the driver.": "Nedenini söyle: “çünkü …” de ve itici gücü adlandır.",
 "There is a time frame": "Bir zaman aralığı var",
 "Say over what period you expect this (e.g. 12 months, FY2027).": "Bunu hangi süre içinde beklediğini yaz (ör. 12 ay, FY2027).",
 "There is a falsifiable view": "Yanlışlanabilir bir görüş var",
 "Choose an explicit view with a horizon and a metric that would prove it.": "Süresi ve onu kanıtlayacak bir ölçütü olan net bir görüş seç.",
 "There is a kill criterion": "Bir vazgeçme kriteri var",
 "Write one company figure that would make you drop the view.": "Görüşünden vazgeçmeni sağlayacak bir şirket rakamı yaz.",
 "The risks are specific": "Riskler somut",
 "Name at least two concrete risks, ideally with a figure or a date.": "En az iki somut risk yaz, mümkünse bir rakam veya tarihle.",
 "The limits of the data are acknowledged": "Verinin sınırları kabul ediliyor",
 "Mention one limit: the assumptions, a short window, or what the data cannot show.": "Bir sınırı belirt: varsayımlar, kısa dönem veya verinin gösteremediği şey.",
 "No overclaiming wording": "Abartılı ifade yok",
 "Soften the flagged phrases: “certain”, “guaranteed”, “will” become “likely”, “suggests”.": "İşaretli ifadeleri yumuşat: “kesin”, “garanti”, “olacak” yerine “muhtemel”, “işaret ediyor”.",
 "Sources are cited": "Kaynaklar belirtilmiş",
 "The analysis has no sources; run it again with official data.": "Analizde kaynak yok; resmî veriyle tekrar çalıştır.",
 "Advice from an editor’s point of view, not a grade of your opinion. Publishing only needs the thesis and risks.": "Bir editörün gözünden öneriler; görüşüne verilen bir not değil. Yayınlamak için sadece tez ve riskler gerekir."
});
Object.assign(QE_ES, {
 "Reviewer checklist": "Lista de revisión",
 "The thesis is a full argument": "La tesis es un argumento completo",
 "The thesis uses a number from the analysis": "La tesis usa una cifra del análisis",
 "The thesis gives a reason": "La tesis da una razón",
 "There is a time frame": "Hay un plazo",
 "There is a falsifiable view": "Hay una opinión verificable",
 "There is a kill criterion": "Hay un criterio de abandono",
 "The risks are specific": "Los riesgos son concretos",
 "The limits of the data are acknowledged": "Se reconocen los límites de los datos",
 "No overclaiming wording": "Sin exageraciones",
 "Sources are cited": "Fuentes citadas",
 "Advice from an editor’s point of view, not a grade of your opinion. Publishing only needs the thesis and risks.": "Consejos desde el punto de vista de un editor, no una nota a tu opinión. Para publicar solo se necesitan la tesis y los riesgos."
});

Object.assign(QE_TR, {
 "ONE COMPANY, SEVERAL ANALYSES": "BİR ŞİRKET, BİRKAÇ ANALİZ",
 "Research report": "Araştırma raporu",
 "Combine 2–6 of your published analyses into one report with your own summary and conclusion: a multi-page PDF to attach to applications and a page on your site.": "Yayınladığın 2–6 analizi kendi özetin ve sonucunla tek bir raporda birleştir: başvurulara ekleyebileceğin çok sayfalı bir PDF ve sitende bir sayfa.",
 "Analyses in the report": "Rapordaki analizler",
 "Report title": "Rapor başlığı",
 "Example: Coca-Cola: steady cash, limited growth": "Örnek: Coca-Cola: istikrarlı nakit, sınırlı büyüme",
 "Executive summary": "Yönetici özeti",
 "Three or four sentences: the question, what the analyses show together, and your view.": "Üç dört cümle: soru, analizlerin birlikte ne gösterdiği ve senin görüşün.",
 "Conclusion": "Sonuç",
 "What you conclude, what would change your mind, and what to watch next.": "Vardığın sonuç, fikrini neyin değiştireceği ve bundan sonra neyi izleyeceğin.",
 "Add report to my site": "Raporu siteme ekle",
 "Draft PDF downloaded. Nothing was published.": "Taslak PDF indirildi. Hiçbir şey yayınlanmadı.",
 "Report added to your site:": "Rapor sitene eklendi:",
 "Published reports": "Yayınlanan raporlar",
 "analyses": "analiz",
 "PDF": "PDF",
 "Choose at least 2 published analyses.": "En az 2 yayınlanmış analiz seç.",
 "Give the report a title (at least 10 characters).": "Rapora bir başlık ver (en az 10 karakter).",
 "Write an executive summary of at least 120 characters.": "En az 120 karakterlik bir yönetici özeti yaz.",
 "Write a conclusion of at least 80 characters.": "En az 80 karakterlik bir sonuç yaz.",
 "Choose 2–6 different published analyses.": "2–6 farklı yayınlanmış analiz seç."
});
Object.assign(QE_ES, {
 "ONE COMPANY, SEVERAL ANALYSES": "UNA EMPRESA, VARIOS ANÁLISIS",
 "Research report": "Informe de análisis",
 "Combine 2–6 of your published analyses into one report with your own summary and conclusion: a multi-page PDF to attach to applications and a page on your site.": "Combina 2–6 de tus análisis publicados en un informe con tu resumen y conclusión: un PDF de varias páginas y una página en tu sitio.",
 "Analyses in the report": "Análisis del informe",
 "Report title": "Título del informe",
 "Executive summary": "Resumen ejecutivo",
 "Conclusion": "Conclusión",
 "Add report to my site": "Añadir el informe a mi sitio",
 "Draft PDF downloaded. Nothing was published.": "PDF borrador descargado. No se publicó nada.",
 "Report added to your site:": "Informe añadido a tu sitio:",
 "Published reports": "Informes publicados",
 "analyses": "análisis"
});
Object.assign(QE_ES, {
 "Example: Coca-Cola: steady cash, limited growth": "Ejemplo: Coca-Cola: caja estable, crecimiento limitado",
 "Three or four sentences: the question, what the analyses show together, and your view.": "Tres o cuatro frases: la pregunta, lo que muestran juntos los análisis y tu opinión.",
 "What you conclude, what would change your mind, and what to watch next.": "Qué concluyes, qué te haría cambiar de opinión y qué vigilar después.",
 "PDF": "PDF",
 "Choose at least 2 published analyses.": "Elige al menos 2 análisis publicados.",
 "Give the report a title (at least 10 characters).": "Dale un título al informe (al menos 10 caracteres).",
 "Write an executive summary of at least 120 characters.": "Escribe un resumen ejecutivo de al menos 120 caracteres.",
 "Write a conclusion of at least 80 characters.": "Escribe una conclusión de al menos 80 caracteres.",
 "Choose 2–6 different published analyses.": "Elige 2–6 análisis publicados distintos."
});

Object.assign(QE_TR, { "Light theme": "Aydınlık tema", "Dark theme": "Karanlık tema" });
Object.assign(QE_ES, { "Light theme": "Tema claro", "Dark theme": "Tema oscuro" });

Object.assign(QE_TR, {
 "Key numbers": "Temel rakamlar", "Contents": "İçindekiler", "Charts": "Grafikler", "Tables": "Tablolar", "Write & publish": "Yaz ve yayınla",
 "Find an analysis": "Analiz bul", "Find an analysis: DCF, insider, quarter…": "Analiz bul: DCF, içeriden, çeyrek…",
 "Downloading SEC filings": "SEC belgeleri indiriliyor", "Reading price history": "Fiyat geçmişi okunuyor", "Calculating": "Hesaplanıyor",
 "Writing the research note": "Araştırma notu hazırlanıyor",
 "The first run for a company downloads its filings and can take up to a minute; later runs use the saved copy.": "Bir şirket için ilk çalıştırma belgelerini indirir ve bir dakikaya kadar sürebilir; sonrakiler kayıtlı kopyayı kullanır.",
 "Model value per share": "Hisse başına model değeri", "Latest price": "Son fiyat", "Sensitivity range": "Duyarlılık aralığı", "WACC": "WACC",
 "Return on equity": "Özkaynak kârlılığı", "All methods span": "Bütün yöntemlerin aralığı", "Price inside the range": "Fiyatın aralık içinde olduğu yöntem",
 "Move priced to expiry": "Vadeye kadar fiyatlanan hareket", "Results-day move priced": "Bilanço günü için fiyatlanan", "Past median reaction": "Geçmiş ortanca tepki",
 "Next results": "Sıradaki bilanço", "Revenue vs a year ago": "Gelir, geçen yıla göre", "Operating margin": "Faaliyet marjı",
 "Sales under 10b5-1 plans": "10b5-1 planlı satış payı", "Form 4 filings read": "Okunan Form 4", "Held by institutions": "Kurumların payı",
 "Top holders that added": "Payını artıran büyük sahip", "Top holders that cut": "Payını azaltan büyük sahip", "Middle 50% of outcomes": "Sonuçların ortadaki %50’si",
 "Annual volatility": "Yıllık oynaklık", "Chance of ending lower": "Daha düşük bitme olasılığı", "Base case per share": "Baz senaryo, hisse başına",
 "Bear – bull": "Kötü – iyi senaryo", "Base vs latest price": "Baz / son fiyat"
});
Object.assign(QE_ES, {
 "Key numbers": "Cifras clave", "Contents": "Contenido", "Charts": "Gráficos", "Tables": "Tablas", "Write & publish": "Escribir y publicar",
 "Find an analysis": "Buscar un análisis", "Find an analysis: DCF, insider, quarter…": "Buscar: DCF, directivos, trimestre…",
 "Downloading SEC filings": "Descargando informes de la SEC", "Reading price history": "Leyendo el historial de precios", "Calculating": "Calculando",
 "Writing the research note": "Preparando la nota",
 "The first run for a company downloads its filings and can take up to a minute; later runs use the saved copy.": "La primera ejecución descarga los informes y puede tardar hasta un minuto; las siguientes usan la copia guardada.",
 "Model value per share": "Valor del modelo por acción", "Latest price": "Último precio", "Sensitivity range": "Rango de sensibilidad",
 "Return on equity": "Rentabilidad sobre el patrimonio", "All methods span": "Rango de todos los métodos", "Price inside the range": "Precio dentro del rango",
 "Move priced to expiry": "Movimiento descontado al vencimiento", "Results-day move priced": "Movimiento descontado el día de resultados", "Past median reaction": "Reacción mediana pasada",
 "Next results": "Próximos resultados", "Revenue vs a year ago": "Ingresos frente al año anterior", "Operating margin": "Margen operativo",
 "Sales under 10b5-1 plans": "Ventas bajo planes 10b5-1", "Form 4 filings read": "Form 4 leídos", "Held by institutions": "En manos de instituciones",
 "Top holders that added": "Grandes titulares que aumentaron", "Top holders that cut": "Grandes titulares que redujeron", "Middle 50% of outcomes": "50% central de los resultados",
 "Annual volatility": "Volatilidad anual", "Chance of ending lower": "Probabilidad de terminar más abajo", "Base case per share": "Caso base por acción",
 "Bear – bull": "Pesimista – optimista", "Base vs latest price": "Base frente al último precio"
});
Object.assign(QE_TR, { "Others": "Diğerleri", "Price outside the range": "Fiyat aralığın dışında" });
Object.assign(QE_ES, { "Others": "Otros", "Price outside the range": "Precio fuera del rango", "Price inside the range": "Precio dentro del rango" });
Object.assign(QE_TR, { "Range contains the latest price": "Aralık son fiyatı içeriyor", "Range does not contain it": "Aralık içermiyor" });
Object.assign(QE_ES, { "Range contains the latest price": "El rango incluye el último precio", "Range does not contain it": "No lo incluye" });

Object.assign(QE_TR, {
 "Your site address (after it is online)": "Sitenin adresi (yayına girdikten sonra)",
 "Optional. With it, a shared link shows a preview image of the analysis on LinkedIn. Fill it in after step 7, then download the ZIP again.": "İsteğe bağlı. Yazarsan, paylaştığın link LinkedIn’de analizin önizleme görseliyle görünür. 7. adımdan sonra doldur ve ZIP’i yeniden indir."
});
Object.assign(QE_ES, {
 "Your site address (after it is online)": "Dirección de tu sitio (cuando esté en línea)",
 "Optional. With it, a shared link shows a preview image of the analysis on LinkedIn. Fill it in after step 7, then download the ZIP again.": "Opcional. Con ella, un enlace compartido muestra una imagen de vista previa en LinkedIn. Rellénala tras el paso 7 y descarga de nuevo el ZIP."
});

Object.assign(QE_TR, {
 "Data quality": "Veri kalitesi", "checks passed": "kontrol geçti", "warnings": "uyarı", "not checked": "kontrol edilemedi",
 "Balance sheet adds up": "Bilanço tutuyor", "Quarters add up to year-to-date": "Çeyrekler yıl toplamını tutuyor", "No restated figures": "Sonradan değiştirilmiş rakam yok",
 "Figures are plausible": "Rakamlar makul", "Key lines are reported": "Temel kalemler raporlanmış", "Latest filings are recent": "Son raporlar güncel",
 "Price agrees with a second source": "Fiyat ikinci kaynakla tutarlı", "Data fingerprint (SHA-256)": "Veri parmak izi (SHA-256)"
});
Object.assign(QE_ES, {
 "Data quality": "Calidad de los datos", "checks passed": "controles superados", "warnings": "avisos", "not checked": "no comprobado",
 "Balance sheet adds up": "El balance cuadra", "Quarters add up to year-to-date": "Los trimestres suman el acumulado", "No restated figures": "Sin cifras reexpresadas",
 "Figures are plausible": "Cifras plausibles", "Key lines are reported": "Partidas clave presentes", "Latest filings are recent": "Informes recientes",
 "Price agrees with a second source": "Precio coherente con una segunda fuente", "Data fingerprint (SHA-256)": "Huella de los datos (SHA-256)"
});
Object.assign(QE_TR, { "Equity risk premium % (blank = Damodaran’s implied premium)": "Hisse risk primi % (boş = Damodaran’ın ima edilen primi)",
 "Company vs industry average (Damodaran)": "Şirket ve sektör ortalaması (Damodaran)", "This company": "Bu şirket", "Industry average": "Sektör ortalaması" });
Object.assign(QE_ES, { "Equity risk premium % (blank = Damodaran’s implied premium)": "Prima de riesgo % (vacío = prima implícita de Damodaran)",
 "This company": "Esta empresa", "Industry average": "Media del sector" });

Object.assign(QE_TR, {
 "Factor exposure (Fama–French + momentum)": "Faktör analizi (Fama–French + momentum)",
 "Is it a market, size, value, quality or momentum stock?": "Hisse piyasa, büyüklük, değer, kalite yoksa momentum hissesi mi?",
 "Factor loadings (daily regression)": "Faktör yükleri (günlük regresyon)", "Factor": "Faktör", "Loading": "Yük", "t-statistic": "t istatistiği",
 "Significant (|t| ≥ 2)": "Anlamlı (|t| ≥ 2)", "Factor loadings": "Faktör yükleri", "Return explained by each factor over the window": "Her faktörün dönem boyunca açıkladığı getiri",
 "Contribution": "Katkı", "Market sensitivity (factor model)": "Piyasa duyarlılığı (faktör modeli)", "Explained by the factors (R²)": "Faktörlerin açıkladığı (R²)",
 "Alpha (annual)": "Alfa (yıllık)", "Strongest tilt": "En belirgin eğilim"
});
Object.assign(QE_ES, {
 "Factor exposure (Fama–French + momentum)": "Exposición a factores (Fama–French + momentum)",
 "Is it a market, size, value, quality or momentum stock?": "¿Es una acción de mercado, tamaño, valor, calidad o momentum?",
 "Factor": "Factor", "Loading": "Carga", "Factor loadings": "Cargas factoriales"
});

Object.assign(QE_TR, {
 "TCMB EVDS key (optional, free)": "TCMB EVDS anahtarı (isteğe bağlı, ücretsiz)", "Key saved on this computer.": "Anahtar bu bilgisayara kaydedildi.", "Key removed.": "Anahtar silindi.",
 "A key is stored on this computer.": "Bu bilgisayarda kayıtlı bir anahtar var.", "Remove": "Sil", "Paste the API key from your EVDS profile": "EVDS profilindeki API anahtarını yapıştır",
 "With it: CPI-adjusted (real) returns and a check against the official exchange rate. Get one free at evds3.tcmb.gov.tr → Profile → API key. It stays on this computer and is never published.": "Anahtarla: TÜFE’ye göre reel getiri ve resmî kurla karşılaştırma. Ücretsiz almak için evds3.tcmb.gov.tr → Profil → API anahtarı. Bu bilgisayarda kalır, hiçbir yerde yayınlanmaz.",
 "Real return (CPI)": "Reel getiri (TÜFE)"
});
Object.assign(QE_ES, {
 "TCMB EVDS key (optional, free)": "Clave de TCMB EVDS (opcional, gratuita)", "Key saved on this computer.": "Clave guardada en este ordenador.", "Key removed.": "Clave eliminada.",
 "A key is stored on this computer.": "Hay una clave guardada en este ordenador.", "Remove": "Eliminar", "Paste the API key from your EVDS profile": "Pega la clave API de tu perfil de EVDS",
 "With it: CPI-adjusted (real) returns and a check against the official exchange rate. Get one free at evds3.tcmb.gov.tr → Profile → API key. It stays on this computer and is never published.": "Con ella: rentabilidad real (IPC) y comparación con el tipo oficial. Gratis en evds3.tcmb.gov.tr → Perfil → clave API. Se queda en este ordenador.",
 "Real return (CPI)": "Rentabilidad real (IPC)"
});

Object.assign(QE_TR, { "Point-in-time date (optional)": "Geçmiş tarih (isteğe bağlı)", "Point in time": "Geçmiş tarihli",
 "Re-run as it would have looked on that date: filings made before it, prices up to it.": "O tarihte nasıl görünüyorsa öyle çalışır: sadece o tarihten önceki raporlar ve o güne kadarki fiyatlar." });
Object.assign(QE_ES, { "Point-in-time date (optional)": "Fecha histórica (opcional)", "Point in time": "Fecha histórica",
 "Re-run as it would have looked on that date: filings made before it, prices up to it.": "Se ejecuta como se habría visto ese día: informes anteriores y precios hasta esa fecha." });

Object.assign(QE_TR, { "Free of survivorship bias": "Hayatta kalanlar yanlılığı yok", "t-statistic (HAC)": "t istatistiği (HAC)", "FCF yield (after SBC)": "FCF verimi (SBC sonrası)",
 "FCF margin (after stock-based compensation)": "FCF marjı (hisse bazlı ücretler sonrası)", "Fat tails (Student-t)": "Kalın kuyruklar (Student-t)", "Ordinary shares per ADR (foreign companies; blank = 1)": "ADR başına asıl hisse (yabancı şirketler; boş = 1)" });
Object.assign(QE_ES, { "Free of survivorship bias": "Sin sesgo de supervivencia", "Reporting basis": "Base contable", "Diluted shares (all share classes)": "Acciones diluidas (todas las clases)", "t-statistic (HAC)": "estadístico t (HAC)", "FCF yield (after SBC)": "Rentabilidad FCF (tras SBC)",
 "FCF margin (after stock-based compensation)": "Margen FCF (tras compensación en acciones)", "Fat tails (Student-t)": "Colas gruesas (t de Student)", "Ordinary shares per ADR (foreign companies; blank = 1)": "Acciones ordinarias por ADR (empresas extranjeras; vacío = 1)" });

Object.assign(QE_TR, { "Where the figures come from": "Rakamlar nereden geliyor", "XBRL tag": "XBRL etiketi", "Filed": "Rapor tarihi", "Filing": "Rapor",
 "Price data is current": "Fiyat verisi güncel", "Revenue": "Gelir", "Operating income": "Faaliyet kârı", "Net income": "Net kâr", "Operating cash flow": "Faaliyet nakit akışı",
 "Stock-based compensation": "Hisse bazlı ücretler", "Interest expense": "Faiz gideri", "Total assets": "Toplam varlıklar", "Equity": "Özkaynak", "Cash": "Nakit",
 "Long-term debt": "Uzun vadeli borç", "Current debt": "Kısa vadeli borç", "Minority interests": "Azınlık payları", "Diluted shares": "Seyreltilmiş hisse sayısı", "Diluted shares (all share classes)": "Seyreltilmiş hisse sayısı (tüm hisse sınıfları)", "Reporting basis": "Raporlama esası",
 "Evidence bundle (ZIP)": "Kanıt paketi (ZIP)" });
Object.assign(QE_ES, { "Where the figures come from": "De dónde salen las cifras", "XBRL tag": "Etiqueta XBRL", "Filed": "Presentado", "Filing": "Informe",
 "Price data is current": "Datos de precios actuales", "Evidence bundle (ZIP)": "Paquete de evidencias (ZIP)" });

Object.assign(QE_TR, { "Every data file this note was computed from, with SHA-256 hashes. Kept on this computer.": "Bu notun hesaplandığı bütün veri dosyaları, SHA-256 özetleriyle. Bu bilgisayarda saklanır." });
Object.assign(QE_ES, { "Every data file this note was computed from, with SHA-256 hashes. Kept on this computer.": "Todos los archivos de datos de esta nota, con hashes SHA-256. Se guardan en este ordenador." });

Object.assign(QE_TR, {
 "Local-only · Private research prototype · No trading": "Sadece yerel · Özel araştırma prototipi · Al-sat yok",
 "analyst-entered source link(s)": "analistin girdiği kaynak bağlantısı", "analyst-entered sources. These links have not been independently verified.": "analistin girdiği kaynak. Bu bağlantılar bağımsız olarak doğrulanmadı.",
 "characters": "karakter", "completeness checks": "eksiksizlik kontrolü", "references": "kaynak", " · FY ends ": " · mali yıl sonu ", " · unverified": " · doğrulanmadı",
 " — Research Report": " — Araştırma Raporu", "Evidence ledger ": "Kanıt kaydı ", "Historical financial evidence: ": "Geçmiş finansal kanıt: ", "Net income ": "Net kâr ",
 "Preview: ": "Önizleme: ", "Remove source ": "Kaynağı sil ", "Revenue ": "Gelir ", " words": " kelime", " · SEC FY": " · SEC mali yıl"
});
Object.assign(QE_TR, {
 " Local-only · Private research prototype · No trading": " Sadece yerel · Özel araştırma prototipi · Al-sat yok", " analyst-entered source link(s)": " analistin girdiği kaynak bağlantısı",
 " analyst-entered sources. These links have not been independently verified.": " analistin girdiği kaynak. Bu bağlantılar bağımsız olarak doğrulanmadı.",
 " characters": " karakter", " completeness checks": " eksiksizlik kontrolü", " references": " kaynak",
 "Company insight\n\n• Annual revenue\n• Revenue growth\n• Operating margin\n\nYour thesis\nYour counterargument\nSEC source": "Şirket özeti\n\n• Yıllık gelir\n• Gelir büyümesi\n• Faaliyet marjı\n\nTezin\nKarşı görüşün\nSEC kaynağı"
});

// v0.13.5 spreadsheet export and foreign filers
Object.assign(QE_TR, { "Preparing the spreadsheet…": "Tablo hazırlanıyor…",
  "Spreadsheet saved. The Model sheet is built from formulas: change the yellow cells to test your assumptions.": "Tablo kaydedildi. Model sayfası formüllerle kurulu: varsayımlarını sınamak için sarı hücreleri değiştir.",
  "Spreadsheet saved: one sheet per table.": "Tablo kaydedildi: her tablo ayrı bir sayfada.",
  "Want to check the numbers yourself?": "Rakamları kendin kontrol etmek ister misin?",
  "Download the model (.xlsx, with formulas)": "Modeli indir (.xlsx, formüllü)", "Download the tables (.xlsx)": "Tabloları indir (.xlsx)" });
Object.assign(QE_ES, { "Preparing the spreadsheet…": "Preparando la hoja de cálculo…",
  "Spreadsheet saved. The Model sheet is built from formulas: change the yellow cells to test your assumptions.": "Hoja guardada. La hoja Modelo usa fórmulas: cambia las celdas amarillas para probar tus supuestos.",
  "Spreadsheet saved: one sheet per table.": "Hoja guardada: una hoja por tabla.",
  "Want to check the numbers yourself?": "¿Quieres comprobar los números tú mismo?",
  "Download the model (.xlsx, with formulas)": "Descargar el modelo (.xlsx, con fórmulas)", "Download the tables (.xlsx)": "Descargar las tablas (.xlsx)" });

// v0.13.5 #29 Brownian motion and Itô’s lemma
Object.assign(QE_TR, { "Brownian motion and Itô’s lemma": "Brown hareketi ve Itô lemması", "Does the stock move like the textbook model, and what does Itô’s lemma predict for it?": "Hisse ders kitabındaki model gibi mi hareket ediyor, Itô lemması onun için ne öngörüyor?", "Itô's lemma in the data: average return vs compound return": "Veride Itô lemması: ortalama getiri ve bileşik getiri", "Value": "Değer", "How it is computed": "Nasıl hesaplanır", "Volatility σ (annual)": "Oynaklık σ (yıllık)", "Average simple return (annual, μ estimate)": "Ortalama basit getiri (yıllık, μ tahmini)", "Average log return (annual, μ − σ²/2 estimate)": "Ortalama log getiri (yıllık, μ − σ²/2 tahmini)", "Gap in the data": "Verideki fark", "Itô's prediction σ²/2 (volatility drag)": "Itô’nun tahmini σ²/2 (volatilite sürtünmesi)", "Compound growth (CAGR) over the fit window": "Bileşik büyüme (YBBO), ölçüm dönemi", "Model range of prices at the horizon (geometric Brownian motion, not a forecast)": "Vade sonunda modelin fiyat aralığı (geometrik Brown hareketi, tahmin değil)", "Outcome": "Sonuç", "Return vs today": "Bugüne göre getiri", "Price (TRY)": "Fiyat (TL)", "5th percentile": "5. yüzdelik", "25th percentile": "25. yüzdelik", "Median (50th)": "Medyan (50.)", "75th percentile": "75. yüzdelik", "95th percentile": "95. yüzdelik", "Mean (expected value)": "Ortalama (beklenen değer)", "Simulated paths vs the closed form (10,000 paths, at the horizon)": "Simüle edilmiş yollar ve kapalı formül (10.000 yol, vade sonunda)", "Quantity": "Büyüklük", "Simulated": "Simülasyon", "Formula": "Formül", "Rule": "Kural", "Mean price E[S_T]": "Ortalama fiyat E[S_T]", "Median price": "Medyan fiyat", "Average log return ln(S_T / S₀), %": "Ortalama log getiri ln(S_T / S₀), %", "Without the Itô term (ordinary calculus), %": "Itô terimi olmadan (sıradan analiz), %", "Naive Euler scheme, mean price": "Saf Euler şeması, ortalama fiyat", "Does the stock behave like geometric Brownian motion?": "Hisse geometrik Brown hareketi gibi davranıyor mu?", "Test": "Test", "In the data": "Veride", "Brownian motion predicts": "Brown hareketinin öngörüsü", "z-statistic": "z istatistiği", "Verdict": "Sonuç", "Consistent": "Uyumlu", "Rejected": "Reddedildi", "Variance ratio, 5-day": "Varyans oranı, 5 gün", "Variance ratio, 21-day": "Varyans oranı, 21 gün", "Variance ratio, 63-day": "Varyans oranı, 63 gün", "Skewness": "Çarpıklık", "Excess kurtosis (fat tails)": "Aşırı basıklık (kalın kuyruklar)", "Jarque–Bera normality": "Jarque–Bera normallik testi", "Days beyond 3σ, %": "3σ dışındaki günler, %", "Days beyond 4σ, %": "4σ dışındaki günler, %", "Volatility clustering (autocorrelation of squared returns)": "Oynaklık kümelenmesi (kare getirilerin otokorelasyonu)", "Out of sample: how often did 1-month moves land inside the model range?": "Örneklem dışı: 1 aylık hareketler ne sıklıkla model aralığının içinde kaldı?", "Range": "Aralık", "Model says": "Modelin vaadi", "Actually happened": "Gerçekleşen", "50% range": "%50 aralığı", "90% range": "%90 aralığı", "Fell below the 90% range": "%90 aralığının altına düştü", "Rose above the 90% range": "%90 aralığının üstüne çıktı", "Black–Scholes at-the-money options with the historical σ (theory, not market quotes)": "Geçmiş σ ile başa baş Black–Scholes opsiyonları (teori, piyasa kotasyonu değil)", "Expiry": "Vade", "Risk-free rate": "Risksiz faiz", "Call (USD)": "Alım (USD)", "Put (USD)": "Satım (USD)", "Call (TRY)": "Alım (TL)", "Put (TRY)": "Satım (TL)", "Call, % of price": "Alım, fiyatın %’si", "Call + put, % of price": "Alım + satım, fiyatın %’si", "Rule of thumb 0.8 σ √T": "Kısa yol 0,8 σ √T", "Call delta N(d₁)": "Alım deltası N(d₁)", "Put–call parity error": "Alım–satım paritesi hatası", "1 month": "1 ay", "3 months": "3 ay", "6 months": "6 ay", "12 months": "12 ay", "Model range of prices over the horizon (months), with three simulated paths": "Vade boyunca modelin fiyat aralığı (ay), üç simüle edilmiş yolla", "Median": "Medyan", "Mean": "Ortalama", "Sample path 1": "Örnek yol 1", "Sample path 2": "Örnek yol 2", "Sample path 3": "Örnek yol 3", "Daily returns in standard deviations: the stock vs the normal curve (% of days)": "Standart sapma cinsinden günlük getiriler: hisse ve normal eğri (günlerin %’si)", "Actual days": "Gerçek günler", "Normal (Brownian motion)": "Normal (Brown hareketi)", "Share of 1-month moves inside the model range: promised vs delivered": "Model aralığı içindeki 1 aylık hareketlerin payı: vaat edilen ve gerçekleşen", "Volatility drag σ²/2": "Volatilite sürtünmesi σ²/2", "90% model range": "Modelin %90 aralığı", "90% range hit rate (out of sample)": "%90 aralığının tutma oranı (örneklem dışı)", "Use the historical drift (default: zero edge)": "Geçmiş sürüklenmeyi kullan (varsayılan: sıfır avantaj)", "U.S. Treasury daily par yield curve": "ABD Hazinesi günlük getiri eğrisi" });
Object.assign(QE_ES, { "Brownian motion and Itô’s lemma": "Movimiento browniano y lema de Itô", "Does the stock move like the textbook model, and what does Itô’s lemma predict for it?": "¿Se mueve la acción como el modelo de manual y qué predice el lema de Itô?", "Itô's lemma in the data: average return vs compound return": "El lema de Itô en los datos: rentabilidad media frente a compuesta", "Value": "Valor", "How it is computed": "Cómo se calcula", "Volatility σ (annual)": "Volatilidad σ (anual)", "Average simple return (annual, μ estimate)": "Rentabilidad simple media (anual, estimación de μ)", "Average log return (annual, μ − σ²/2 estimate)": "Rentabilidad logarítmica media (anual, estimación de μ − σ²/2)", "Gap in the data": "Diferencia en los datos", "Itô's prediction σ²/2 (volatility drag)": "Predicción de Itô σ²/2 (lastre de volatilidad)", "Compound growth (CAGR) over the fit window": "Crecimiento compuesto (TCAC) en la ventana", "Model range of prices at the horizon (geometric Brownian motion, not a forecast)": "Rango de precios del modelo al horizonte (movimiento browniano geométrico, no es una previsión)", "Outcome": "Resultado", "Return vs today": "Rentabilidad frente a hoy", "Price (TRY)": "Precio (TRY)", "5th percentile": "Percentil 5", "25th percentile": "Percentil 25", "Median (50th)": "Mediana (50)", "75th percentile": "Percentil 75", "95th percentile": "Percentil 95", "Mean (expected value)": "Media (valor esperado)", "Simulated paths vs the closed form (10,000 paths, at the horizon)": "Trayectorias simuladas frente a la fórmula cerrada (10 000 trayectorias, al horizonte)", "Quantity": "Magnitud", "Simulated": "Simulado", "Formula": "Fórmula", "Rule": "Regla", "Mean price E[S_T]": "Precio medio E[S_T]", "Median price": "Precio mediano", "Average log return ln(S_T / S₀), %": "Rentabilidad logarítmica media ln(S_T / S₀), %", "Without the Itô term (ordinary calculus), %": "Sin el término de Itô (cálculo ordinario), %", "Naive Euler scheme, mean price": "Esquema de Euler simple, precio medio", "Does the stock behave like geometric Brownian motion?": "¿Se comporta la acción como un movimiento browniano geométrico?", "Test": "Prueba", "In the data": "En los datos", "Brownian motion predicts": "Predicción del movimiento browniano", "z-statistic": "estadístico z", "Verdict": "Veredicto", "Consistent": "Compatible", "Rejected": "Rechazado", "Variance ratio, 5-day": "Ratio de varianzas, 5 días", "Variance ratio, 21-day": "Ratio de varianzas, 21 días", "Variance ratio, 63-day": "Ratio de varianzas, 63 días", "Skewness": "Asimetría", "Excess kurtosis (fat tails)": "Curtosis en exceso (colas gruesas)", "Jarque–Bera normality": "Normalidad de Jarque–Bera", "Days beyond 3σ, %": "Días más allá de 3σ, %", "Days beyond 4σ, %": "Días más allá de 4σ, %", "Volatility clustering (autocorrelation of squared returns)": "Agrupamiento de volatilidad (autocorrelación de rentabilidades al cuadrado)", "Out of sample: how often did 1-month moves land inside the model range?": "Fuera de muestra: ¿con qué frecuencia los movimientos de 1 mes quedaron dentro del rango?", "Range": "Rango", "Model says": "Lo que dice el modelo", "Actually happened": "Lo que ocurrió", "50% range": "Rango del 50 %", "90% range": "Rango del 90 %", "Fell below the 90% range": "Cayó por debajo del rango del 90 %", "Rose above the 90% range": "Subió por encima del rango del 90 %", "Black–Scholes at-the-money options with the historical σ (theory, not market quotes)": "Opciones at-the-money de Black–Scholes con la σ histórica (teoría, no cotizaciones)", "Expiry": "Vencimiento", "Risk-free rate": "Tipo libre de riesgo", "Call (USD)": "Call (USD)", "Put (USD)": "Put (USD)", "Call (TRY)": "Call (TRY)", "Put (TRY)": "Put (TRY)", "Call, % of price": "Call, % del precio", "Call + put, % of price": "Call + put, % del precio", "Rule of thumb 0.8 σ √T": "Regla práctica 0,8 σ √T", "Call delta N(d₁)": "Delta del call N(d₁)", "Put–call parity error": "Error de paridad put–call", "1 month": "1 mes", "3 months": "3 meses", "6 months": "6 meses", "12 months": "12 meses", "Model range of prices over the horizon (months), with three simulated paths": "Rango de precios del modelo en el horizonte (meses), con tres trayectorias simuladas", "Median": "Mediana", "Mean": "Media", "Sample path 1": "Trayectoria 1", "Sample path 2": "Trayectoria 2", "Sample path 3": "Trayectoria 3", "Daily returns in standard deviations: the stock vs the normal curve (% of days)": "Rentabilidades diarias en desviaciones típicas: la acción frente a la curva normal (% de días)", "Actual days": "Días reales", "Normal (Brownian motion)": "Normal (movimiento browniano)", "Share of 1-month moves inside the model range: promised vs delivered": "Movimientos de 1 mes dentro del rango: prometido frente a real", "Volatility drag σ²/2": "Lastre de volatilidad σ²/2", "90% model range": "Rango del 90 % del modelo", "90% range hit rate (out of sample)": "Aciertos del rango del 90 % (fuera de muestra)", "Use the historical drift (default: zero edge)": "Usar la deriva histórica (por defecto: sin ventaja)", "U.S. Treasury daily par yield curve": "Curva de rendimientos diaria del Tesoro de EE. UU." });
Object.assign(QE_TR, { "Implied volatility (Black–Scholes, from the straddle)": "İma edilen oynaklık (Black–Scholes, straddle’dan)", "Implied volatility (Yahoo, cross-check)": "İma edilen oynaklık (Yahoo, kontrol)" });
Object.assign(QE_ES, { "Implied volatility (Black–Scholes, from the straddle)": "Volatilidad implícita (Black–Scholes, del straddle)", "Implied volatility (Yahoo, cross-check)": "Volatilidad implícita (Yahoo, verificación)" });
// v0.13.5 #30 options lab
Object.assign(QE_TR, { "2κθ ≥ ξ²": "2κθ ≥ ξ²", "30-day implied volatility": "30 günlük ima edilen oynaklık", "After hours": "Kapanış sonrası", "American (binomial tree)": "Amerikan (binom ağacı)", "At expiry": "Vadede", "At-the-money implied volatility by days to expiry": "Vadeye kalan güne göre başa baş ima edilen oynaklık", "At-the-money volatility": "Başa baş oynaklık", "Bid-ask spread": "Alış-satış farkı", "Black–Scholes": "Black–Scholes", "Black–Scholes (flat)": "Black–Scholes (sabit)", "Black–Scholes (one volatility)": "Black–Scholes (tek oynaklık)", "Black–Scholes assumes one volatility for every strike (the flat line). The market’s smile shows it does not hold; a stochastic-volatility model such as Heston explains much of it.": "Black–Scholes her kullanım fiyatı için tek bir oynaklık varsayar (düz çizgi). Piyasanın gülümsemesi bunun tutmadığını gösteriyor; Heston gibi bir stokastik oynaklık modeli bunun büyük kısmını açıklar.", "Black–Scholes calculator": "Black–Scholes hesaplayıcı", "Black–Scholes value": "Black–Scholes değeri", "Calls": "Alımlar", "Check with Monte Carlo (100,000 paths)": "Monte Carlo ile kontrol et (100.000 yol)", "Contracts": "Adet", "Days to expiry": "Vadeye kalan gün", "Decrease": "Azalt", "Dividend yield q": "Temettü verimi q", "Downloading the option chain…": "Opsiyon zinciri indiriliyor…", "Each leg uses its own quote and implied volatility; moving the volatility slider shifts the whole smile. * = no quote, model price. An educational payoff diagram, not a trade idea.": "Her bacak kendi kotasyonunu ve ima edilen oynaklığını kullanır; oynaklık kaydırıcısı tüm gülümsemeyi kaydırır. * = kotasyon yok, model fiyatı. Eğitim amaçlı bir getiri diyagramıdır, işlem fikri değildir.", "Enter a US stock or ETF and load its listed options.": "Bir ABD hissesi veya ETF yaz ve listelenen opsiyonlarını yükle.", "Expiry (blank = nearest to 30 days)": "Vade (boş = 30 güne en yakın)", "Finishes in the money (risk-neutral N(d₂))": "Vadede para içinde bitme (riske nötr N(d₂))", "Fit the Heston stochastic-volatility model": "Heston stokastik oynaklık modelini uydur", "Following the market: inputs update with every refresh.": "Piyasayı takip ediyor: girdiler her yenilemede güncellenir.", "Forward": "Forward", "Forward from": "Forward kaynağı", "Forward volatility": "Forward oynaklık", "Forward volatility from the previous expiry": "Önceki vadeden forward oynaklık", "Free data: the stock price is Yahoo’s current quote and option quotes are delayed about 15 minutes; real-time option feeds are paid. Risk-neutral probabilities and model values are pricing quantities, not forecasts. Not investment advice.": "Ücretsiz veri: hisse fiyatı Yahoo’nun anlık kotasyonu, opsiyon kotasyonları yaklaşık 15 dakika gecikmeli; gerçek zamanlı opsiyon verisi ücretlidir. Riske nötr olasılıklar ve model değerleri fiyatlama büyüklükleridir, tahmin değildir. Yatırım tavsiyesi değildir.", "Greek": "Greek", "Greeks of the selected contract (Black–Scholes at its implied volatility)": "Seçili kontratın Greek’leri (kendi ima edilen oynaklığıyla Black–Scholes)", "Heston": "Heston", "Heston fit error": "Heston uyum hatası", "Heston stochastic-volatility model fitted to the live smiles": "Canlı gülümsemelere uydurulan Heston stokastik oynaklık modeli", "Heston value of the selected contract": "Seçili kontratın Heston değeri", "Hide the option chain": "Opsiyon zincirini gizle", "How are this stock’s options priced right now, and how far is that from Black–Scholes?": "Bu hissenin opsiyonları şu an nasıl fiyatlanıyor ve bu Black–Scholes’tan ne kadar uzak?", "Implied volatilities are solved here from each mid price (Black-76 on the forward). Click a row to price that strike.": "İma edilen oynaklıklar burada her orta fiyattan çözülür (forward üzerinde Black-76). O strike’ı fiyatlamak için bir satıra tıkla.", "Implied volatility by strike": "Kullanım fiyatına göre ima edilen oynaklık", "Increase": "Artır", "Leg": "Bacak", "Live (refresh every minute)": "Canlı (her dakika yenile)", "Live market": "Canlı piyasa", "Live market snapshot": "Canlı piyasa görüntüsü", "Live reading": "Canlı yorum", "Live refresh failed; showing the last snapshot.": "Canlı yenileme başarısız; son görüntü gösteriliyor.", "Load live options": "Canlı opsiyonları yükle", "Market (last trade)": "Piyasa (son işlem)", "Market (mid)": "Piyasa (orta fiyat)", "Market (out-of-the-money options)": "Piyasa (para dışı opsiyonlar)", "Market closed": "Piyasa kapalı", "Market mid (delayed)": "Piyasa ortası (gecikmeli)", "Market open": "Piyasa açık", "Mid price": "Orta fiyat", "Model minus market": "Model eksi piyasa", "Monte Carlo": "Monte Carlo", "Monte Carlo price converging to Black–Scholes (paths)": "Black–Scholes’a yakınsayan Monte Carlo fiyatı (yol sayısı)", "Net cost": "Net maliyet", "Net credit": "Net alacak", "New York": "New York", "One volatility (Black–Scholes)": "Tek oynaklık (Black–Scholes)", "Open interest": "Açık pozisyon", "Option": "Opsiyon", "Option type": "Opsiyon türü", "Option type (call or put)": "Opsiyon türü (alım veya satım)", "Options desk": "Opsiyon masası", "Options lab: Black–Scholes, the smile and stochastic volatility (live)": "Opsiyon laboratuvarı: Black–Scholes, gülümseme ve stokastik oynaklık (canlı)", "Parameter": "Parametre", "Payoff and strategies": "Getiri ve stratejiler", "Payoff at expiry": "Vadedeki getiri", "Per contract": "Sözleşme başına", "Per contract (100 shares)": "Sözleşme başına (100 hisse)", "Per share": "Hisse başına", "Pre-market": "Açılış öncesi", "Price basis": "Fiyat kaynağı", "Profit / loss by stock price (one contract = 100 shares)": "Hisse fiyatına göre kâr / zarar (bir sözleşme = 100 hisse)", "Puts": "Satımlar", "Refit Heston": "Heston’u yeniden uydur", "Reset to market": "Piyasaya dön", "Risk-free rate r": "Risksiz faiz r", "Selected contract: market quote against the models": "Seçili kontrat: piyasa kotasyonu ve modeller", "Selected option: market mid": "Seçili opsiyon: piyasa ortası", "Selected option: value today (Black–Scholes) and payoff at expiry, by stock price": "Seçili opsiyon: hisse fiyatına göre bugünkü değer (Black–Scholes) ve vadedeki getiri", "Show the option chain": "Opsiyon zincirini göster", "Skew (25-delta risk reversal)": "Çarpıklık (25-delta risk reversal)", "Skew (25-delta)": "Çarpıklık (25-delta)", "Smile points": "Gülümseme noktası", "Source / basis": "Kaynak / esas", "Stock (100 shares)": "Hisse (100 adet)", "Stock price": "Hisse fiyatı", "Strike (blank = at the money)": "Kullanım fiyatı (boş = başa baş)", "Strike vs forward": "Strike / forward", "Term structure": "Vade yapısı", "Term structure of at-the-money implied volatility": "Başa baş ima edilen oynaklığın vade yapısı", "The note keeps the numbers of this moment, with sources, and can be published like every analysis.": "Not, bu anın rakamlarını kaynaklarıyla saklar ve her analiz gibi yayınlanabilir.", "Today (model)": "Bugün (model)", "Today, 1-minute prices": "Bugün, 1 dakikalık fiyatlar", "Too few quotes to draw the smile for this expiry.": "Bu vade için gülümsemeyi çizecek kadar kotasyon yok.", "Treasury, matched to the expiry": "Hazine faizi, vadeye göre", "Use the latest stock price": "Son hisse fiyatını kullan", "Value today": "Bugünkü değer", "Volatility smile": "Oynaklık gülümsemesi", "Volatility smile of the selected expiry (out-of-the-money options)": "Seçili vadenin oynaklık gülümsemesi (para dışı opsiyonlar)", "Volatility smile: the market against Black–Scholes and Heston": "Oynaklık gülümsemesi: piyasa, Black–Scholes ve Heston", "Volatility σ": "Oynaklık σ", "What it means": "Ne anlama gelir", "Write a research note from this snapshot": "Bu görüntüden araştırma notu oluştur", "Yahoo figure": "Yahoo rakamı", "Your own inputs: live refreshes update the market figures only.": "Kendi girdilerin: canlı yenileme sadece piyasa rakamlarını günceller.", "a difference in inputs, not a signal": "girdilerdeki bir fark, sinyal değil", "best on the chart": "grafikteki en iyi", "break-even": "başa baş", "break-even at expiry": "vadede başa baş noktası", "call": "alım", "change as one day passes": "bir gün geçince değişim", "change for +1 point in rates": "faiz +1 puan olunca değişim", "change for +1 volatility point": "oynaklık +1 puan olunca değişim", "change for a $1 rise in the stock": "hisse 1 $ yükselince değişim", "change in delta for a $1 rise": "1 $ yükselişte deltanın değişimi", "day": "gün", "early-exercise premium": "erken kullanım primi", "expiries": "vade", "fixed": "sabit", "from put–call parity": "alım–satım paritesinden", "from the dividend yield": "temettü veriminden", "implied volatility": "ima edilen oynaklık", "inside the interval": "aralığın içinde", "last regular": "son seans", "last trade": "son işlem", "live": "canlı", "long-run volatility": "uzun vadeli oynaklık", "market mid": "piyasa ortası", "mean-reversion speed": "ortalamaya dönüş hızı", "min": "dk", "move to expiry": "vadeye kadar hareket", "next update in": "sonraki güncelleme", "one-volatility Black–Scholes": "tek oynaklıklı Black–Scholes", "options": "opsiyon", "options delayed about": "opsiyonlar yaklaşık", "per contract": "sözleşme başına", "per share": "hisse başına", "price–volatility correlation": "fiyat–oynaklık korelasyonu", "put": "satım", "realised 21 days": "gerçekleşen 21 gün", "s": "sn", "updated": "güncellendi", "volatility now": "şu anki oynaklık", "volatility of volatility": "oynaklığın oynaklığı", "vs market mid": "piyasa ortasına göre", "worst on the chart": "grafikteki en kötü", "Stock": "Hisse", "Strike": "Kullanım fiyatı", "Expiry": "Vade", "Call": "Alım (call)", "Put": "Satım (put)", "Ticker": "Hisse kodu", "bid": "alış", "ask": "satış", "IV": "İO", "Δ": "Δ", "pts": "puan", "days": "gün", "Meaning": "Anlamı", "Price": "Fiyat", "Implied volatility": "İma edilen oynaklık", "Strategy": "Strateji", "Single option": "Tek opsiyon", "Long straddle": "Uzun straddle", "Long strangle": "Uzun strangle", "Bull call spread": "Boğa alım spread’i", "Bear put spread": "Ayı satım spread’i", "Long call butterfly": "Uzun alım kelebeği", "Short iron condor": "Kısa iron condor", "Covered call": "Covered call (hisse + satılan alım)", "Protective put": "Korumalı satım (hisse + satım)", "Measure": "Ölçüt", "Value": "Değer", "Days": "Gün", "Stock price implied by the option quotes": "Opsiyonların ima ettiği hisse fiyatı", "Option quotes": "Opsiyon kotasyonları" });
Object.assign(QE_ES, { "2κθ ≥ ξ²": "2κθ ≥ ξ²", "30-day implied volatility": "Volatilidad implícita a 30 días", "After hours": "Fuera de hora", "American (binomial tree)": "Americana (árbol binomial)", "At expiry": "Al vencimiento", "At-the-money implied volatility by days to expiry": "Volatilidad implícita at-the-money según días al vencimiento", "At-the-money volatility": "Volatilidad at-the-money", "Bid-ask spread": "Diferencial compra-venta", "Black–Scholes": "Black–Scholes", "Black–Scholes (flat)": "Black–Scholes (plana)", "Black–Scholes (one volatility)": "Black–Scholes (una volatilidad)", "Black–Scholes assumes one volatility for every strike (the flat line). The market’s smile shows it does not hold; a stochastic-volatility model such as Heston explains much of it.": "Black–Scholes supone una única volatilidad para todos los precios de ejercicio (la línea plana). La sonrisa del mercado muestra que no se cumple; un modelo de volatilidad estocástica como Heston explica buena parte.", "Black–Scholes calculator": "Calculadora Black–Scholes", "Black–Scholes value": "Valor Black–Scholes", "Calls": "Calls", "Check with Monte Carlo (100,000 paths)": "Comprobar con Monte Carlo (100 000 trayectorias)", "Contracts": "Contratos", "Days to expiry": "Días al vencimiento", "Decrease": "Reducir", "Dividend yield q": "Rentabilidad por dividendo q", "Downloading the option chain…": "Descargando la cadena de opciones…", "Each leg uses its own quote and implied volatility; moving the volatility slider shifts the whole smile. * = no quote, model price. An educational payoff diagram, not a trade idea.": "Cada pata usa su propia cotización y volatilidad implícita; el control de volatilidad desplaza toda la sonrisa. * = sin cotización, precio del modelo. Un diagrama de resultados educativo, no una idea de operación.", "Enter a US stock or ETF and load its listed options.": "Escribe una acción o ETF de EE. UU. y carga sus opciones cotizadas.", "Expiry (blank = nearest to 30 days)": "Vencimiento (vacío = el más cercano a 30 días)", "Finishes in the money (risk-neutral N(d₂))": "Termina dentro del dinero (neutral al riesgo N(d₂))", "Fit the Heston stochastic-volatility model": "Ajustar el modelo de volatilidad estocástica de Heston", "Following the market: inputs update with every refresh.": "Siguiendo al mercado: los datos se actualizan en cada refresco.", "Forward": "Forward", "Forward from": "Forward a partir de", "Forward volatility": "Volatilidad forward", "Forward volatility from the previous expiry": "Volatilidad forward desde el vencimiento anterior", "Free data: the stock price is Yahoo’s current quote and option quotes are delayed about 15 minutes; real-time option feeds are paid. Risk-neutral probabilities and model values are pricing quantities, not forecasts. Not investment advice.": "Datos gratuitos: el precio de la acción es la cotización actual de Yahoo y las opciones tienen unos 15 minutos de retraso; los datos de opciones en tiempo real son de pago. Las probabilidades neutrales al riesgo y los valores del modelo son magnitudes de valoración, no previsiones. No es asesoramiento de inversión.", "Greek": "Griega", "Greeks of the selected contract (Black–Scholes at its implied volatility)": "Griegas del contrato elegido (Black–Scholes con su volatilidad implícita)", "Heston": "Heston", "Heston fit error": "Error de ajuste de Heston", "Heston stochastic-volatility model fitted to the live smiles": "Modelo de volatilidad estocástica de Heston ajustado a las sonrisas en vivo", "Heston value of the selected contract": "Valor Heston del contrato elegido", "Hide the option chain": "Ocultar la cadena de opciones", "How are this stock’s options priced right now, and how far is that from Black–Scholes?": "¿Cómo se valoran ahora las opciones de esta acción y cuánto se alejan de Black–Scholes?", "Implied volatilities are solved here from each mid price (Black-76 on the forward). Click a row to price that strike.": "Las volatilidades implícitas se calculan aquí a partir de cada precio medio (Black-76 sobre el forward). Pulsa una fila para valorar ese precio de ejercicio.", "Implied volatility by strike": "Volatilidad implícita por precio de ejercicio", "Increase": "Aumentar", "Leg": "Pata", "Live (refresh every minute)": "En vivo (refrescar cada minuto)", "Live market": "Mercado en vivo", "Live market snapshot": "Instantánea del mercado en vivo", "Live reading": "Lectura en vivo", "Live refresh failed; showing the last snapshot.": "El refresco en vivo falló; se muestra la última instantánea.", "Load live options": "Cargar opciones en vivo", "Market (last trade)": "Mercado (última operación)", "Market (mid)": "Mercado (medio)", "Market (out-of-the-money options)": "Mercado (opciones fuera del dinero)", "Market closed": "Mercado cerrado", "Market mid (delayed)": "Precio medio de mercado (con retraso)", "Market open": "Mercado abierto", "Mid price": "Precio medio", "Model minus market": "Modelo menos mercado", "Monte Carlo": "Monte Carlo", "Monte Carlo price converging to Black–Scholes (paths)": "Precio Monte Carlo que converge a Black–Scholes (trayectorias)", "Net cost": "Coste neto", "Net credit": "Crédito neto", "New York": "Nueva York", "One volatility (Black–Scholes)": "Una volatilidad (Black–Scholes)", "Open interest": "Interés abierto", "Option": "Opción", "Option type": "Tipo de opción", "Option type (call or put)": "Tipo de opción (call o put)", "Options desk": "Mesa de opciones", "Options lab: Black–Scholes, the smile and stochastic volatility (live)": "Laboratorio de opciones: Black–Scholes, la sonrisa y la volatilidad estocástica (en vivo)", "Parameter": "Parámetro", "Payoff and strategies": "Resultado y estrategias", "Payoff at expiry": "Resultado al vencimiento", "Per contract": "Por contrato", "Per contract (100 shares)": "Por contrato (100 acciones)", "Per share": "Por acción", "Pre-market": "Preapertura", "Price basis": "Base del precio", "Profit / loss by stock price (one contract = 100 shares)": "Beneficio / pérdida según el precio de la acción (un contrato = 100 acciones)", "Puts": "Puts", "Refit Heston": "Reajustar Heston", "Reset to market": "Volver al mercado", "Risk-free rate r": "Tipo libre de riesgo r", "Selected contract: market quote against the models": "Contrato elegido: cotización de mercado frente a los modelos", "Selected option: market mid": "Opción elegida: precio medio", "Selected option: value today (Black–Scholes) and payoff at expiry, by stock price": "Opción elegida: valor hoy (Black–Scholes) y resultado al vencimiento, según el precio de la acción", "Show the option chain": "Mostrar la cadena de opciones", "Skew (25-delta risk reversal)": "Sesgo (risk reversal 25-delta)", "Skew (25-delta)": "Sesgo (25-delta)", "Smile points": "Puntos de la sonrisa", "Source / basis": "Fuente / base", "Stock (100 shares)": "Acción (100 acciones)", "Stock price": "Precio de la acción", "Strike (blank = at the money)": "Precio de ejercicio (vacío = at the money)", "Strike vs forward": "Ejercicio frente al forward", "Term structure": "Estructura temporal", "Term structure of at-the-money implied volatility": "Estructura temporal de la volatilidad implícita at-the-money", "The note keeps the numbers of this moment, with sources, and can be published like every analysis.": "La nota conserva las cifras de este momento, con sus fuentes, y se puede publicar como cualquier análisis.", "Today (model)": "Hoy (modelo)", "Today, 1-minute prices": "Hoy, precios de 1 minuto", "Too few quotes to draw the smile for this expiry.": "No hay suficientes cotizaciones para dibujar la sonrisa de este vencimiento.", "Treasury, matched to the expiry": "Tesoro, según el vencimiento", "Use the latest stock price": "Usar el último precio de la acción", "Value today": "Valor hoy", "Volatility smile": "Sonrisa de volatilidad", "Volatility smile of the selected expiry (out-of-the-money options)": "Sonrisa de volatilidad del vencimiento elegido (opciones fuera del dinero)", "Volatility smile: the market against Black–Scholes and Heston": "Sonrisa de volatilidad: el mercado frente a Black–Scholes y Heston", "Volatility σ": "Volatilidad σ", "What it means": "Qué significa", "Write a research note from this snapshot": "Escribir una nota de análisis con esta instantánea", "Yahoo figure": "Cifra de Yahoo", "Your own inputs: live refreshes update the market figures only.": "Tus propios datos: el refresco en vivo solo actualiza las cifras de mercado.", "a difference in inputs, not a signal": "una diferencia de supuestos, no una señal", "best on the chart": "mejor del gráfico", "break-even": "equilibrio", "break-even at expiry": "equilibrio al vencimiento", "call": "call", "change as one day passes": "cambio al pasar un día", "change for +1 point in rates": "cambio con +1 punto de tipos", "change for +1 volatility point": "cambio con +1 punto de volatilidad", "change for a $1 rise in the stock": "cambio si la acción sube 1 $", "change in delta for a $1 rise": "cambio de la delta si sube 1 $", "day": "día", "early-exercise premium": "prima de ejercicio anticipado", "expiries": "vencimientos", "fixed": "fijo", "from put–call parity": "de la paridad put–call", "from the dividend yield": "de la rentabilidad por dividendo", "implied volatility": "volatilidad implícita", "inside the interval": "dentro del intervalo", "last regular": "última sesión", "last trade": "última operación", "live": "en vivo", "long-run volatility": "volatilidad a largo plazo", "market mid": "precio medio", "mean-reversion speed": "velocidad de reversión", "min": "min", "move to expiry": "movimiento hasta el vencimiento", "next update in": "próxima actualización en", "one-volatility Black–Scholes": "Black–Scholes con una volatilidad", "options": "opciones", "options delayed about": "opciones con un retraso de unos", "per contract": "por contrato", "per share": "por acción", "price–volatility correlation": "correlación precio–volatilidad", "put": "put", "realised 21 days": "realizada 21 días", "s": "s", "updated": "actualizado", "volatility now": "volatilidad actual", "volatility of volatility": "volatilidad de la volatilidad", "vs market mid": "frente al precio medio", "worst on the chart": "peor del gráfico", "Stock": "Acción", "Strike": "Precio de ejercicio", "Expiry": "Vencimiento", "Call": "Call", "Put": "Put", "bid": "compra", "ask": "venta", "IV": "VI", "Δ": "Δ", "days": "días", "Meaning": "Significado", "Price": "Precio", "Implied volatility": "Volatilidad implícita", "Strategy": "Estrategia", "Single option": "Opción simple", "Long straddle": "Straddle comprado", "Long strangle": "Strangle comprado", "Bull call spread": "Bull call spread", "Bear put spread": "Bear put spread", "Long call butterfly": "Mariposa de calls comprada", "Short iron condor": "Iron condor vendido", "Covered call": "Covered call", "Protective put": "Put protectora", "Measure": "Medida", "Value": "Valor", "Basis": "Base", "Days": "Días", "Stock price implied by the option quotes": "Precio de la acción implícito en las opciones", "Option quotes": "Cotizaciones de opciones" });
Object.assign(QE_TR, { "chain": "zincir", "stock": "hisse", "Nowcast at the latest stock price": "Son hisse fiyatıyla anlık tahmin", "quotes were at": "kotasyonlar", "same implied volatility": "aynı ima edilen oynaklık" });
Object.assign(QE_ES, { "chain": "cadena", "stock": "acción", "Nowcast at the latest stock price": "Estimación al último precio de la acción", "quotes were at": "cotizaciones a", "same implied volatility": "misma volatilidad implícita" });
Object.assign(QE_TR, { "Live history on this page": "Bu sayfadaki canlı geçmiş", "Implied volatility at each refresh": "Her yenilemedeki ima edilen oynaklık", "refreshes since": "yenileme, başlangıç", "Kept only while this page is open.": "Sadece bu sayfa açıkken tutulur." });
Object.assign(QE_ES, { "Live history on this page": "Historial en vivo de esta página", "Implied volatility at each refresh": "Volatilidad implícita en cada refresco", "refreshes since": "refrescos desde", "Kept only while this page is open.": "Solo se conserva mientras esta página está abierta." });
Object.assign(QE_TR, { "The note keeps the market numbers of this moment (not your own slider inputs), with sources, and can be published like every analysis.": "Not, bu anın piyasa rakamlarını (kaydırıcılardaki kendi girdilerini değil) kaynaklarıyla saklar ve her analiz gibi yayınlanabilir." });
Object.assign(QE_ES, { "The note keeps the market numbers of this moment (not your own slider inputs), with sources, and can be published like every analysis.": "La nota conserva las cifras de mercado de este momento (no tus propios datos de los controles), con sus fuentes, y se puede publicar como cualquier análisis." });
Object.assign(QE_TR, { "Finishes in the money (risk-neutral N(d₂), ignores the skew)": "Vadede para içinde bitme (riske nötr N(d₂), çarpıklığı hesaba katmaz)", "Outside regular hours the time to expiry is counted from the last close, when the quotes were made.": "Seans dışında vadeye kalan süre, kotasyonların yapıldığı son kapanıştan sayılır.", "Greeks of the selected contract (Black–Scholes at the at-the-money volatility: no usable quote for it)": "Seçili kontratın Greek’leri (başa baş oynaklıkla Black–Scholes: kontratın kullanılabilir kotasyonu yok)", "Greeks of the selected contract (Black–Scholes at realised volatility: no usable option quotes)": "Seçili kontratın Greek’leri (gerçekleşen oynaklıkla Black–Scholes: kullanılabilir opsiyon kotasyonu yok)" });
Object.assign(QE_ES, { "Finishes in the money (risk-neutral N(d₂), ignores the skew)": "Termina dentro del dinero (neutral al riesgo N(d₂), ignora el sesgo)", "Outside regular hours the time to expiry is counted from the last close, when the quotes were made.": "Fuera del horario regular, el tiempo al vencimiento se cuenta desde el último cierre, cuando se hicieron las cotizaciones.", "Greeks of the selected contract (Black–Scholes at the at-the-money volatility: no usable quote for it)": "Griegas del contrato elegido (Black–Scholes con la volatilidad at-the-money: sin cotización utilizable)", "Greeks of the selected contract (Black–Scholes at realised volatility: no usable option quotes)": "Griegas del contrato elegido (Black–Scholes con la volatilidad realizada: sin cotizaciones utilizables)" });
Object.assign(QE_TR, { "Last trade (no bid/ask, may be stale)": "Son işlem (alış/satış yok, eski olabilir)", "options delayed about {n} min": "opsiyonlar yaklaşık {n} dk gecikmeli", "Each leg uses its own quote and implied volatility; moving the volatility slider shifts the whole smile. * = no quote, model price; † = last trade, may be stale. An educational payoff diagram, not a trade idea.": "Her bacak kendi kotasyonunu ve ima edilen oynaklığını kullanır; oynaklık kaydırıcısı tüm gülümsemeyi kaydırır. * = kotasyon yok, model fiyatı; † = son işlem, eski olabilir. Eğitim amaçlı bir getiri diyagramıdır, işlem fikri değildir." });
Object.assign(QE_ES, { "Last trade (no bid/ask, may be stale)": "Última operación (sin compra/venta, puede ser antigua)", "options delayed about {n} min": "opciones con un retraso de unos {n} min", "Each leg uses its own quote and implied volatility; moving the volatility slider shifts the whole smile. * = no quote, model price; † = last trade, may be stale. An educational payoff diagram, not a trade idea.": "Cada pata usa su propia cotización y volatilidad implícita; el control de volatilidad desplaza toda la sonrisa. * = sin cotización, precio del modelo; † = última operación, puede ser antigua. Un diagrama de resultados educativo, no una idea de operación." });
Object.assign(QE_TR, { "continuously compounded": "sürekli bileşik" });
Object.assign(QE_ES, { "continuously compounded": "capitalización continua" });
Object.assign(QE_TR, { "at the American implied volatility": "Amerikan ima edilen oynaklıkla", "This expiry was left out of the fit": "Bu vade uydurmaya dahil değil", "under 14 days": "14 günden kısa", "fewer than 5 strikes with bid and ask": "iki yönlü kotasyonu olan 5 strike yok", "under 2 days to expiry": "vadeye 2 günden az", "error on it": "bu vadedeki hata", "no error could be computed on it": "bu vadede hata hesaplanamadı" });
Object.assign(QE_ES, { "at the American implied volatility": "con la volatilidad implícita americana", "This expiry was left out of the fit": "Este vencimiento quedó fuera del ajuste", "under 14 days": "menos de 14 días", "fewer than 5 strikes with bid and ask": "menos de 5 precios de ejercicio con compra y venta", "under 2 days to expiry": "menos de 2 días al vencimiento", "error on it": "error en él", "no error could be computed on it": "no se pudo calcular su error" });
Object.assign(QE_TR, { "No usable quote": "Kullanılabilir kotasyon yok" });
Object.assign(QE_ES, { "No usable quote": "Sin cotización utilizable" });
Object.assign(QE_TR, { "of which early-exercise value": "bunun erken kullanım değeri", "Heston is European": "Heston Avrupa tipidir" });
Object.assign(QE_ES, { "of which early-exercise value": "de ello, valor de ejercicio anticipado", "Heston is European": "Heston es europeo" });
Object.assign(QE_TR, { "Puts on this expiry: the early-exercise value is removed (European-equivalent volatility); the calculator still reprices each quote exactly.": "Bu vadedeki satımlarda erken kullanım değeri çıkarıldı (Avrupa eşdeğeri oynaklık); hesaplayıcı yine her kotasyonun kendi fiyatını tutturur." });
Object.assign(QE_ES, { "Puts on this expiry: the early-exercise value is removed (European-equivalent volatility); the calculator still reprices each quote exactly.": "Puts de este vencimiento: se descuenta el valor de ejercicio anticipado (volatilidad equivalente europea); la calculadora sigue reproduciendo cada cotización." });
Object.assign(QE_TR, {"Options": "Opsiyonlar", "Live options lab": "Canlı opsiyon laboratuvarı", "Price a US stock’s listed options with Black–Scholes and the Heston stochastic-volatility model, refreshed live (option quotes are delayed about 15 minutes).": "Bir ABD hissesinin listelenen opsiyonlarını Black–Scholes ve Heston stokastik oynaklık modeliyle fiyatla; veriler canlı yenilenir (opsiyon kotasyonları yaklaşık 15 dakika gecikmeli).", "Type a ticker such as AAPL or SPY and press Enter; tick Live to refresh every minute. When you are ready, write a research note from the snapshot.": "AAPL ya da SPY gibi bir kod yazıp Enter’a bas; her dakika yenilemek için Canlı kutusunu işaretle. Hazır olduğunda bu görüntüden bir araştırma notu oluştur.", "See all 30 analyses": "30 analizin hepsini gör", "Open the live options lab": "Canlı opsiyon laboratuvarını aç", "LIVE": "CANLI", "Live": "Canlı", "Pre-market: the stock trades, option quotes are from the last session": "Açılış öncesi: hisse işlem görüyor, opsiyon kotasyonları son seansa ait", "After hours: the stock trades, option quotes are from the regular session (a few ETF options such as SPY trade until 16:15)": "Kapanış sonrası: hisse işlem görüyor, opsiyon kotasyonları normal seansa ait (SPY gibi birkaç ETF opsiyonu 16:15’e kadar işlem görür)", "US market closed: the last session’s data": "ABD piyasası kapalı: son seansın verileri"});
Object.assign(QE_ES, {"Options": "Opciones", "Live options lab": "Laboratorio de opciones en vivo", "Price a US stock’s listed options with Black–Scholes and the Heston stochastic-volatility model, refreshed live (option quotes are delayed about 15 minutes).": "Valora las opciones cotizadas de una acción de EE. UU. con Black–Scholes y el modelo de volatilidad estocástica de Heston, actualizado en vivo (las cotizaciones de opciones llevan unos 15 minutos de retraso).", "Type a ticker such as AAPL or SPY and press Enter; tick Live to refresh every minute. When you are ready, write a research note from the snapshot.": "Escribe un símbolo como AAPL o SPY y pulsa Intro; marca En vivo para refrescar cada minuto. Cuando quieras, escribe una nota de análisis con esa instantánea.", "See all 30 analyses": "Ver los 30 análisis", "Open the live options lab": "Abrir el laboratorio de opciones en vivo", "LIVE": "EN VIVO", "Live": "En vivo", "Pre-market: the stock trades, option quotes are from the last session": "Preapertura: la acción cotiza, las opciones son de la última sesión", "After hours: the stock trades, option quotes are from the regular session (a few ETF options such as SPY trade until 16:15)": "Fuera de hora: la acción cotiza, las opciones son de la sesión regular (algunas opciones de ETF, como SPY, cotizan hasta las 16:15)", "US market closed: the last session’s data": "Mercado de EE. UU. cerrado: datos de la última sesión"});
Object.assign(QE_TR, {"CLOSED": "KAPALI"});
Object.assign(QE_ES, {"CLOSED": "CERRADO"});
Object.assign(QE_TR, {"Analysis #{n} · also in the Analysis Lab": "Analiz #{n} · Analiz Laboratuvarı’nda da var"});
Object.assign(QE_ES, {"Analysis #{n} · also in the Analysis Lab": "Análisis #{n} · también en el Laboratorio de análisis"});
Object.assign(QE_TR, {"US market open: the stock price is live, option quotes are about 15 minutes delayed": "ABD piyasası açık: hisse fiyatı canlı, opsiyon kotasyonları yaklaşık 15 dakika gecikmeli", "US exchange holiday: the market is closed today": "ABD borsa tatili: piyasa bugün kapalı", "Try again": "Tekrar dene"});
Object.assign(QE_ES, {"US market open: the stock price is live, option quotes are about 15 minutes delayed": "Mercado de EE. UU. abierto: el precio de la acción es en vivo, las opciones llevan unos 15 minutos de retraso", "US exchange holiday: the market is closed today": "Festivo bursátil en EE. UU.: el mercado cierra hoy", "Try again": "Reintentar"});
Object.assign(QE_TR, {"Interest rates and research data": "Faiz oranları ve araştırma verileri", "US Treasury and FRED rates for the risk-free rate, Stooq prices to cross-check Yahoo, Damodaran and Kenneth French datasets for industry and factor figures, and TCMB EVDS (with your own key) for Turkey. Each is downloaded only by the analyses that need it.": "Risksiz faiz için ABD Hazinesi ve FRED faizleri, Yahoo’yu çapraz kontrol için Stooq fiyatları, sektör ve faktör rakamları için Damodaran ve Kenneth French veri setleri, Türkiye için TCMB EVDS (kendi anahtarınla). Her biri yalnızca ona ihtiyaç duyan analizlerde indirilir.", "Could not reach the local QuantEdge server. Is it still running?": "Yerel QuantEdge sunucusuna ulaşılamadı. Hâlâ çalışıyor mu?"});
Object.assign(QE_ES, {"Interest rates and research data": "Tipos de interés y datos de investigación", "US Treasury and FRED rates for the risk-free rate, Stooq prices to cross-check Yahoo, Damodaran and Kenneth French datasets for industry and factor figures, and TCMB EVDS (with your own key) for Turkey. Each is downloaded only by the analyses that need it.": "Tipos del Tesoro de EE. UU. y de FRED para el tipo sin riesgo, precios de Stooq para contrastar Yahoo, bases de datos de Damodaran y Kenneth French para cifras sectoriales y de factores, y TCMB EVDS (con tu propia clave) para Turquía. Cada una se descarga solo en los análisis que la necesitan.", "Could not reach the local QuantEdge server. Is it still running?": "No se pudo conectar con el servidor local de QuantEdge. ¿Sigue en marcha?"});
/* v0.13.5 options desk cards: model report card, VIX, scenario grid, volatility surface */
Object.assign(QE_TR, {
  'no quote': 'kotasyon yok', 'no bid/ask or trade': 'alış/satış ya da işlem yok', 'too far from the forward': 'forward’dan çok uzak', 'under 2 cents': '2 sentin altında',
  'bid–ask spread over 60%': 'alış-satış farkı %60’ın üstünde', 'no volatility fits the price': 'fiyata uyan oynaklık yok',
  'Put–call parity': 'Alım–satım paritesi', '{a} of {b} strike pairs agree with parity within their bid–ask spreads': '{b} kullanım fiyatı çiftinin {a} tanesi pariteyle alış-satış aralığı içinde uyuşuyor',
  'largest gap {x} at strike {k}': 'en büyük fark {k} kullanım fiyatında {x}', 'No strike has two-sided call and put quotes: parity cannot be checked.': 'Hiçbir kullanım fiyatında iki yönlü alım ve satım kotasyonu yok: parite kontrol edilemiyor.',
  'One volatility (Black–Scholes)': 'Tek oynaklık (Black–Scholes)', 'misses the smile by {x} volatility points on average ({n} quotes).': 'gülümsemeden ortalama {x} oynaklık puanı uzak ({n} kotasyon).',
  'Fit the model on the smile card to see its error here.': 'Hatasını burada görmek için modeli gülümseme kartından uydur.',
  'Quotes on the smile': 'Gülümsemedeki kotasyonlar', '{u} of {n} strikes ({m} from bid–ask mids, {l} from last trades)': '{n} kullanım fiyatından {u} tanesi ({m} alış-satış ortasından, {l} son işlemden)',
  'left out': 'dışarıda kalanlar', 'Data age': 'Verinin yaşı', 'Yahoo could not be reached: the chain is from an earlier download': 'Yahoo’ya ulaşılamadı: zincir önceki indirmeden',
  'chain downloaded {x} min ago': 'zincir {x} dk önce indirildi', 'option quotes delayed about {n} min': 'opsiyon kotasyonları yaklaşık {n} dk gecikmeli',
  'Model report card': 'Model karnesi', 'Good': 'İyi', 'Check': 'Dikkat', 'Note': 'Bilgi', 'A check of the quotes and the models, not of the stock.': 'Kotasyonların ve modellerin kontrolüdür, hissenin değil.',
  'I computed the VIX myself': 'VIX’i kendim hesapladım', 'Compute again': 'Yeniden hesapla', 'Compute from SPY options': 'SPY opsiyonlarından hesapla',
  'The Cboe VIX formula run on SPY’s listed options (two expiries around 30 days), next to the official index.': 'Cboe’nin VIX formülü SPY’nin listelenen opsiyonlarıyla (30 gün civarındaki iki vade) hesaplanır ve resmî endeksin yanına konur.',
  'My calculation': 'Benim hesabım', 'Official VIX': 'Resmî VIX', 'not available right now': 'şu an alınamıyor', 'my calculation minus the official index': 'benim hesabım eksi resmî endeks',
  'Strikes used': 'Kullanılan kullanım fiyatları', 'puts': 'satım', 'calls': 'alım', 'Share of the variance by strike': 'Kullanım fiyatına göre varyansa katkı', 'share of the variance': 'varyansa katkı',
  'How it is computed': 'Nasıl hesaplanır?', 'Take the two expiries around 30 days (23 to 37 days when listed).': '30 günün iki yanındaki vadeleri al (listelenmişse 23 ile 37 gün arası).',
  'For each, the forward comes from put–call parity at the strike where call and put prices are closest; K₀ is the strike just below it.': 'Her birinde forward, alım ve satım fiyatlarının en yakın olduğu kullanım fiyatında alım–satım paritesinden çıkar; K₀ onun hemen altındaki kullanım fiyatıdır.',
  'Add up the out-of-the-money options from K₀ outwards, each weighted by ΔK/K²; a strike without a bid is skipped, two in a row end the side.': 'K₀’dan dışarı doğru paranın dışındaki opsiyonları ΔK/K² ağırlığıyla topla; alış fiyatı olmayan atlanır, art arda iki tane o tarafı bitirir.',
  'σ² = (2/T) Σ ΔK/K² · e^{RT} · Q(K) − (1/T)(F/K₀ − 1)²': 'σ² = (2/T) Σ ΔK/K² · e^{RT} · Q(K) − (1/T)(F/K₀ − 1)²',
  'Interpolate the two variances to 30 days and annualise: VIX = 100 √σ²₃₀.': 'İki varyansı 30 güne ara değerle taşı ve yıllıklaştır: VIX = 100 √σ²₃₀.',
  'Some of these quotes are from an earlier download.': 'Bu kotasyonların bir kısmı önceki indirmeden.',
  'Today': 'Bugün', 'In a week': 'Bir hafta sonra', 'Half way to expiry': 'Vadenin yarısında', 'Day after the results': 'Bilançodan sonraki gün', 'Scenario grid': 'Senaryo tablosu', 'Scenario date': 'Senaryo günü',
  'Profit or loss of the strategy above, in dollars per contract (100 shares), if the stock moves (columns) and implied volatility shifts (rows).': 'Yukarıdaki stratejinin kâr ya da zararı, sözleşme (100 hisse) başına dolar olarak: hisse hareket ederse (sütunlar) ve ima edilen oynaklık kayarsa (satırlar).',
  'Volatility crush after the results': 'Bilanço sonrası oynaklık çöküşü',
  'The term structure suggests this expiry’s volatility falls by about {x} points once the results are out ({a} → {b}).': 'Vade yapısına göre bilanço açıklanınca bu vadenin oynaklığı yaklaşık {x} puan düşer ({a} → {b}).',
  'stock move by column, volatility shift by row': 'sütunlarda hisse hareketi, satırlarda oynaklık kayması', 'Vol. shift': 'Oynaklık kayması',
  'the shift the term structure implies after the results': 'vade yapısının bilanço sonrası için ima ettiği kayma',
  'Black–Scholes with each leg’s own volatility; the shift moves the whole smile. Educational, not a trade idea.': 'Her bacak kendi oynaklığıyla Black–Scholes; kayma bütün gülümsemeyi taşır. Eğitim amaçlıdır, işlem önerisi değildir.',
  'Volatility surface': 'Oynaklık yüzeyi',
  'Implied volatility by expiry (rows) and strike as a share of the forward (columns): each row is one smile, each column a term structure.': 'Vadeye (satırlar) ve forward’a oranla kullanım fiyatına (sütunlar) göre ima edilen oynaklık: her satır bir gülümseme, her sütun bir vade yapısı.',
  '· = no two-sided quote near that strike for that expiry (nothing is extrapolated).': '· = o vadede o kullanım fiyatının yakınında iki yönlü kotasyon yok (dışarıya doğru tahmin yapılmaz).'
});
Object.assign(QE_ES, {
  'no quote': 'sin cotización', 'no bid/ask or trade': 'sin compra/venta ni operación', 'too far from the forward': 'demasiado lejos del forward', 'under 2 cents': 'menos de 2 centavos',
  'bid–ask spread over 60%': 'diferencial compra-venta superior al 60%', 'no volatility fits the price': 'ninguna volatilidad ajusta el precio',
  'Put–call parity': 'Paridad put–call', '{a} of {b} strike pairs agree with parity within their bid–ask spreads': '{a} de {b} pares de precios de ejercicio cumplen la paridad dentro de su diferencial',
  'largest gap {x} at strike {k}': 'mayor diferencia {x} en el precio de ejercicio {k}', 'No strike has two-sided call and put quotes: parity cannot be checked.': 'Ningún precio de ejercicio tiene cotización de compra y venta en call y put: no se puede comprobar la paridad.',
  'One volatility (Black–Scholes)': 'Una sola volatilidad (Black–Scholes)', 'misses the smile by {x} volatility points on average ({n} quotes).': 'se aleja de la sonrisa {x} puntos de volatilidad de media ({n} cotizaciones).',
  'Fit the model on the smile card to see its error here.': 'Ajusta el modelo en la tarjeta de la sonrisa para ver aquí su error.',
  'Quotes on the smile': 'Cotizaciones en la sonrisa', '{u} of {n} strikes ({m} from bid–ask mids, {l} from last trades)': '{u} de {n} precios de ejercicio ({m} del punto medio, {l} de la última operación)',
  'left out': 'excluidas', 'Data age': 'Antigüedad de los datos', 'Yahoo could not be reached: the chain is from an earlier download': 'No se pudo conectar con Yahoo: la cadena es de una descarga anterior',
  'chain downloaded {x} min ago': 'cadena descargada hace {x} min', 'option quotes delayed about {n} min': 'cotizaciones de opciones con unos {n} min de retraso',
  'Model report card': 'Boletín del modelo', 'Good': 'Bien', 'Check': 'Revisar', 'Note': 'Nota', 'A check of the quotes and the models, not of the stock.': 'Una revisión de las cotizaciones y los modelos, no de la acción.',
  'I computed the VIX myself': 'Calculé el VIX yo mismo', 'Compute again': 'Calcular de nuevo', 'Compute from SPY options': 'Calcular con opciones de SPY',
  'The Cboe VIX formula run on SPY’s listed options (two expiries around 30 days), next to the official index.': 'La fórmula del VIX de Cboe aplicada a las opciones cotizadas de SPY (dos vencimientos en torno a 30 días), junto al índice oficial.',
  'My calculation': 'Mi cálculo', 'Official VIX': 'VIX oficial', 'not available right now': 'no disponible ahora', 'Difference': 'Diferencia', 'my calculation minus the official index': 'mi cálculo menos el índice oficial',
  'Strikes used': 'Precios de ejercicio usados', 'Volatility': 'Volatilidad', 'puts': 'puts', 'calls': 'calls', 'Share of the variance by strike': 'Aporte a la varianza por precio de ejercicio', 'share of the variance': 'aporte a la varianza',
  'How it is computed': 'Cómo se calcula', 'Take the two expiries around 30 days (23 to 37 days when listed).': 'Toma los dos vencimientos en torno a 30 días (de 23 a 37 días si existen).',
  'For each, the forward comes from put–call parity at the strike where call and put prices are closest; K₀ is the strike just below it.': 'En cada uno, el forward sale de la paridad put–call en el precio de ejercicio donde call y put están más cerca; K₀ es el precio de ejercicio justo por debajo.',
  'Add up the out-of-the-money options from K₀ outwards, each weighted by ΔK/K²; a strike without a bid is skipped, two in a row end the side.': 'Suma las opciones fuera del dinero desde K₀ hacia fuera, cada una ponderada por ΔK/K²; se omite una sin precio de compra y dos seguidas terminan ese lado.',
  'σ² = (2/T) Σ ΔK/K² · e^{RT} · Q(K) − (1/T)(F/K₀ − 1)²': 'σ² = (2/T) Σ ΔK/K² · e^{RT} · Q(K) − (1/T)(F/K₀ − 1)²',
  'Interpolate the two variances to 30 days and annualise: VIX = 100 √σ²₃₀.': 'Interpola las dos varianzas a 30 días y anualiza: VIX = 100 √σ²₃₀.',
  'Some of these quotes are from an earlier download.': 'Algunas de estas cotizaciones son de una descarga anterior.',
  'Today': 'Hoy', 'In a week': 'En una semana', 'Half way to expiry': 'A mitad del vencimiento', 'Day after the results': 'Día después de los resultados', 'Scenario grid': 'Tabla de escenarios', 'Scenario date': 'Fecha del escenario',
  'Profit or loss of the strategy above, in dollars per contract (100 shares), if the stock moves (columns) and implied volatility shifts (rows).': 'Beneficio o pérdida de la estrategia de arriba, en dólares por contrato (100 acciones), si la acción se mueve (columnas) y la volatilidad implícita cambia (filas).',
  'Volatility crush after the results': 'Caída de volatilidad tras los resultados',
  'The term structure suggests this expiry’s volatility falls by about {x} points once the results are out ({a} → {b}).': 'La estructura temporal sugiere que la volatilidad de este vencimiento cae unos {x} puntos tras los resultados ({a} → {b}).',
  'stock move by column, volatility shift by row': 'movimiento de la acción por columna, cambio de volatilidad por fila', 'Vol. shift': 'Cambio de vol.',
  'the shift the term structure implies after the results': 'el cambio que implica la estructura temporal tras los resultados',
  'Black–Scholes with each leg’s own volatility; the shift moves the whole smile. Educational, not a trade idea.': 'Black–Scholes con la volatilidad de cada pata; el cambio desplaza toda la sonrisa. Educativo, no es una idea de inversión.',
  'Volatility surface': 'Superficie de volatilidad',
  'Implied volatility by expiry (rows) and strike as a share of the forward (columns): each row is one smile, each column a term structure.': 'Volatilidad implícita por vencimiento (filas) y precio de ejercicio en proporción al forward (columnas): cada fila es una sonrisa y cada columna una estructura temporal.',
  '· = no two-sided quote near that strike for that expiry (nothing is extrapolated).': '· = sin cotización de compra y venta cerca de ese precio en ese vencimiento (no se extrapola).'
});
Object.assign(QE_TR, {'Share of the variance per $1 of strike': '1 $ kullanım fiyatı başına varyansa katkı', 'chain downloaded just now': 'zincir az önce indirildi',
  'Out-of-the-money puts give {p} of this variance and calls {c}.': 'Bu varyansın {p} kadarı paranın dışındaki satım opsiyonlarından, {c} kadarı alımlardan geliyor.',
  'The market pays more for protection against falls than for bets on rises.': 'Piyasa düşüşe karşı korunmaya, yükseliş beklentisinden daha çok ödüyor.'});
Object.assign(QE_ES, {'Share of the variance per $1 of strike': 'Aporte a la varianza por cada $1 de precio de ejercicio', 'chain downloaded just now': 'cadena descargada hace un momento',
  'Out-of-the-money puts give {p} of this variance and calls {c}.': 'Los puts fuera del dinero aportan el {p} de esta varianza y los calls el {c}.',
  'The market pays more for protection against falls than for bets on rises.': 'El mercado paga más por protegerse de las caídas que por apostar a las subidas.'});
/* v0.13.5 About: How I built it */
Object.assign(QE_TR, {
  'How I built it': 'Nasıl yaptım', 'A look behind the screens: what runs where, how the numbers are checked, and how I worked with an AI assistant.': 'Ekranların arkasına kısa bir bakış: ne nerede çalışıyor, sayılar nasıl kontrol ediliyor ve bir yapay zekâ asistanıyla nasıl çalıştım.',
  'Black–Scholes against the textbook': 'Ders kitabına karşı Black–Scholes',
  'Hull’s worked example (S = 42, K = 40, r = 10%, σ = 20%, six months) gives a call of $4.76 and a put of $0.81; QuantEdge gives $4.7594 and $0.8086.': 'Hull’un çözümlü örneği (S = 42, K = 40, r = %10, σ = %20, altı ay) alım için 4,76 $, satım için 0,81 $ verir; QuantEdge 4,7594 $ ve 0,8086 $ buluyor.',
  'The browser and the server agree': 'Tarayıcı ve sunucu aynı sonucu veriyor',
  'The calculator in the browser is tested against the Python engine on 216 cases: the same prices and Greeks to nine significant digits.': 'Tarayıcıdaki hesaplayıcı 216 durumda Python motoruna karşı test edilir: fiyatlar ve Greek’ler dokuz anlamlı basamağa kadar aynı.',
  'The VIX formula on a known answer': 'Cevabı bilinen bir durumda VIX formülü',
  'On a Heston model, whose expected variance has a closed form, my implementation of the Cboe VIX formula lands within 0.05 volatility points of it.': 'Beklenen varyansı kapalı formülle bilinen bir Heston modelinde, Cboe VIX formülünü uygulamam bu değere 0,05 oynaklık puanından daha yakın çıkıyor.',
  'Heston against one volatility': 'Heston’a karşı tek oynaklık',
  'The stochastic-volatility fit explains the market’s smile several times better than a single Black–Scholes volatility; the model report card shows the ratio for every fit.': 'Stokastik oynaklık uydurması piyasanın gülümsemesini tek bir Black–Scholes oynaklığından birkaç kat daha iyi açıklar; model karnesi her uydurmada bu oranı gösterir.',
  'The exchange calendar': 'Borsa takvimi',
  'The market badge and the server agree on holidays and 13:00 early closes on every weekday from 2018 to 2040.': 'Piyasa rozeti ve sunucu, 2018–2040 arasındaki her iş günü için tatillerde ve 13:00 erken kapanışlarında aynı sonucu veriyor.',
  'More than 800 automated tests': '800’den fazla otomatik test',
  'They run offline on Python 3.9 and 3.13 on every change (GitHub Actions), with recorded data instead of the internet.': 'Her değişiklikte Python 3.9 ve 3.13 üzerinde (GitHub Actions) çalışırlar; internet yerine kaydedilmiş veri kullanırlar.',
  'Put–call parity and forward prices': 'Alım–satım paritesi ve forward fiyatlar', 'Implied volatility and the smile': 'İma edilen oynaklık ve gülümseme',
  'Why one Black–Scholes volatility is not enough, and what stochastic volatility adds': 'Tek bir Black–Scholes oynaklığı neden yetmez ve stokastik oynaklık ne katar',
  'How the Cboe computes the VIX': 'Cboe VIX’i nasıl hesaplar', 'American options and early exercise': 'Amerikan opsiyonlar ve erken kullanım',
  'Testing, code review and honest limits': 'Test, kod incelemesi ve dürüst sınırlar', 'Web security basics: other sites’ requests and DNS rebinding': 'Web güvenliğinin temelleri: başka sitelerden gelen istekler ve DNS rebinding',
  'Python': 'Python', 'FastAPI': 'FastAPI', 'NumPy · pandas': 'NumPy · pandas', 'React 16 (no build step)': 'React 16 (derleme adımı yok)', 'SQLite': 'SQLite', 'pytest': 'pytest', 'GitHub Actions': 'GitHub Actions',
  'Your browser': 'Tarayıcın', 'no build step': 'derleme yok', 'Turkish, English, Spanish': 'Türkçe, İngilizce, İspanyolca', 'help assistant, offline': 'yardım asistanı, internetsiz',
  'Local API': 'Yerel API', '127.0.0.1 only': 'yalnızca 127.0.0.1', 'pricing, analyses, notes': 'fiyatlama, analizler, notlar', 'Public data': 'Herkese açık veri',
  'US Treasury · FRED': 'ABD Hazinesi · FRED', 'This computer: data/': 'Bu bilgisayar: data/', 'on request': 'istenince',
  'The browser page talks only to a local API on this computer; the API keeps notes, keys and caches in data/ and downloads public data when you ask.': 'Tarayıcıdaki sayfa yalnızca bu bilgisayardaki yerel API ile konuşur; API notları, anahtarları ve önbelleği data/ içinde tutar ve herkese açık veriyi sen isteyince indirir.',
  'Checked, not assumed': 'Varsayılmadı, kontrol edildi', 'How I worked with AI': 'Yapay zekâyla nasıl çalıştım',
  'I built QuantEdge together with an AI coding assistant (Claude). I decided what to build and how it should look and behave, tried the versions on my own computer and asked for changes; the assistant wrote most of the code.': 'QuantEdge’i bir yapay zekâ kodlama asistanıyla (Claude) birlikte geliştirdim. Neyin yapılacağına, nasıl görünüp nasıl çalışacağına ben karar verdim, sürümleri kendi bilgisayarımda deneyip değişiklik istedim; kodun büyük kısmını asistan yazdı.',
  'Nothing shipped on trust: every change had to pass the automated tests, and independent AI reviewers tried to break each feature. The problems they found were fixed and kept as tests.': 'Hiçbir şey güvene dayanarak yayınlanmadı: her değişiklik otomatik testlerden geçmek zorundaydı ve bağımsız yapay zekâ incelemecileri her özelliği bozmaya çalıştı. Buldukları sorunlar düzeltildi ve test olarak saklandı.',
  'Topics I worked through': 'Üzerinde çalıştığım konular', 'Safe by design': 'Baştan güvenli',
  'The local API answers only this page and scripts on this computer: requests from other web sites and from other host names are refused.': 'Yerel API yalnızca bu sayfaya ve bu bilgisayardaki betiklere cevap verir: başka web sitelerinden ve başka host adlarından gelen istekler reddedilir.',
  'No account and no cloud: notes, keys and downloaded data stay in data/, which git ignores.': 'Hesap yok, bulut yok: notlar, anahtarlar ve indirilen veriler git’in yok saydığı data/ klasöründe kalır.',
  'Built with': 'Kullandıklarım'
});
Object.assign(QE_ES, {
  'How I built it': 'Cómo lo hice', 'A look behind the screens: what runs where, how the numbers are checked, and how I worked with an AI assistant.': 'Un vistazo detrás de las pantallas: qué se ejecuta dónde, cómo se comprueban las cifras y cómo trabajé con un asistente de IA.',
  'Black–Scholes against the textbook': 'Black–Scholes frente al libro de texto',
  'Hull’s worked example (S = 42, K = 40, r = 10%, σ = 20%, six months) gives a call of $4.76 and a put of $0.81; QuantEdge gives $4.7594 and $0.8086.': 'El ejemplo resuelto de Hull (S = 42, K = 40, r = 10%, σ = 20%, seis meses) da una call de 4,76 $ y una put de 0,81 $; QuantEdge obtiene 4,7594 $ y 0,8086 $.',
  'The browser and the server agree': 'El navegador y el servidor coinciden',
  'The calculator in the browser is tested against the Python engine on 216 cases: the same prices and Greeks to nine significant digits.': 'La calculadora del navegador se prueba frente al motor de Python en 216 casos: los mismos precios y griegas hasta nueve cifras significativas.',
  'The VIX formula on a known answer': 'La fórmula del VIX con una respuesta conocida',
  'On a Heston model, whose expected variance has a closed form, my implementation of the Cboe VIX formula lands within 0.05 volatility points of it.': 'En un modelo de Heston, cuya varianza esperada tiene fórmula cerrada, mi implementación de la fórmula del VIX de Cboe queda a menos de 0,05 puntos de volatilidad.',
  'Heston against one volatility': 'Heston frente a una sola volatilidad',
  'The stochastic-volatility fit explains the market’s smile several times better than a single Black–Scholes volatility; the model report card shows the ratio for every fit.': 'El ajuste de volatilidad estocástica explica la sonrisa del mercado varias veces mejor que una sola volatilidad de Black–Scholes; el boletín del modelo muestra la proporción en cada ajuste.',
  'The exchange calendar': 'El calendario bursátil',
  'The market badge and the server agree on holidays and 13:00 early closes on every weekday from 2018 to 2040.': 'La insignia del mercado y el servidor coinciden en festivos y cierres anticipados a las 13:00 en cada día laborable de 2018 a 2040.',
  'More than 800 automated tests': 'Más de 800 pruebas automáticas',
  'They run offline on Python 3.9 and 3.13 on every change (GitHub Actions), with recorded data instead of the internet.': 'Se ejecutan sin conexión en Python 3.9 y 3.13 en cada cambio (GitHub Actions), con datos grabados en lugar de internet.',
  'Put–call parity and forward prices': 'Paridad put–call y precios forward', 'Implied volatility and the smile': 'Volatilidad implícita y la sonrisa',
  'Why one Black–Scholes volatility is not enough, and what stochastic volatility adds': 'Por qué una sola volatilidad de Black–Scholes no basta y qué aporta la volatilidad estocástica',
  'How the Cboe computes the VIX': 'Cómo calcula Cboe el VIX', 'American options and early exercise': 'Opciones americanas y ejercicio anticipado',
  'Testing, code review and honest limits': 'Pruebas, revisión de código y límites honestos', 'Web security basics: other sites’ requests and DNS rebinding': 'Seguridad web básica: peticiones de otros sitios y DNS rebinding',
  'Python': 'Python', 'FastAPI': 'FastAPI', 'NumPy · pandas': 'NumPy · pandas', 'React 16 (no build step)': 'React 16 (sin paso de compilación)', 'SQLite': 'SQLite', 'pytest': 'pytest', 'GitHub Actions': 'GitHub Actions',
  'Your browser': 'Tu navegador', 'no build step': 'sin compilación', 'Turkish, English, Spanish': 'turco, inglés, español', 'help assistant, offline': 'ayuda sin conexión',
  'Local API': 'API local', '127.0.0.1 only': 'solo 127.0.0.1', 'pricing, analyses, notes': 'valoración, análisis, notas', 'Public data': 'Datos públicos',
  'US Treasury · FRED': 'Tesoro de EE. UU. · FRED', 'This computer: data/': 'Este ordenador: data/', 'on request': 'a petición',
  'The browser page talks only to a local API on this computer; the API keeps notes, keys and caches in data/ and downloads public data when you ask.': 'La página del navegador solo habla con una API local en este ordenador; la API guarda notas, claves y cachés en data/ y descarga datos públicos cuando lo pides.',
  'Checked, not assumed': 'Comprobado, no supuesto', 'How I worked with AI': 'Cómo trabajé con la IA',
  'I built QuantEdge together with an AI coding assistant (Claude). I decided what to build and how it should look and behave, tried the versions on my own computer and asked for changes; the assistant wrote most of the code.': 'Desarrollé QuantEdge junto con un asistente de programación con IA (Claude). Yo decidí qué construir y cómo debía verse y comportarse, probé las versiones en mi ordenador y pedí cambios; el asistente escribió la mayor parte del código.',
  'Nothing shipped on trust: every change had to pass the automated tests, and independent AI reviewers tried to break each feature. The problems they found were fixed and kept as tests.': 'Nada se publicó por confianza: cada cambio tenía que pasar las pruebas automáticas y revisores de IA independientes intentaron romper cada función. Los problemas que encontraron se corrigieron y se guardaron como pruebas.',
  'Topics I worked through': 'Temas que trabajé', 'Safe by design': 'Seguro por diseño',
  'The local API answers only this page and scripts on this computer: requests from other web sites and from other host names are refused.': 'La API local solo responde a esta página y a scripts de este ordenador: rechaza peticiones de otros sitios web y de otros nombres de host.',
  'No account and no cloud: notes, keys and downloaded data stay in data/, which git ignores.': 'Sin cuenta ni nube: notas, claves y datos descargados se quedan en data/, que git ignora.',
  'Built with': 'Hecho con'
});
Object.assign(QE_TR, {'notes and library': 'notlar ve kütüphane', 'keys and caches': 'anahtarlar ve önbellek'});
Object.assign(QE_ES, {'notes and library': 'notas y biblioteca', 'keys and caches': 'claves y cachés'});
Object.assign(QE_TR, { "Compute from the demo options": "Demo opsiyonlarından hesapla" });
Object.assign(QE_ES, { "Compute from the demo options": "Calcular con las opciones de la demo" });
Object.assign(QE_TR, { "The Cboe VIX formula run on the demo stock’s options (two expiries around 30 days), next to the model’s true value.": "Cboe VIX formülü demo hissesinin opsiyonlarına uygulandı (30 günü çevreleyen iki vade); yanında modelin gerçek değeri." });
Object.assign(QE_ES, { "The Cboe VIX formula run on the demo stock’s options (two expiries around 30 days), next to the model’s true value.": "La fórmula del VIX de Cboe aplicada a las opciones de la acción de demo (dos vencimientos alrededor de 30 días), junto al valor real del modelo." });
Object.assign(QE_TR, { "closed-form value of the Heston model": "Heston modelinin kapalı formül değeri" });
Object.assign(QE_ES, { "closed-form value of the Heston model": "valor en forma cerrada del modelo de Heston" });
Object.assign(QE_TR, { "my calculation minus the true value": "benim hesabım eksi gerçek değer" });
Object.assign(QE_ES, { "my calculation minus the true value": "mi cálculo menos el valor real" });
Object.assign(QE_TR, { "above the forward, where an American put can be worth exercising early, only the American bounds are checked": "vadeli fiyatın üstünde, Amerikan tipi satım opsiyonunu erken kullanmak değerli olabildiği için yalnızca Amerikan sınırları denetlenir" });
Object.assign(QE_ES, { "above the forward, where an American put can be worth exercising early, only the American bounds are checked": "por encima del forward, donde puede convenir ejercer antes una put americana, solo se comprueban los límites americanos" });
Object.assign(QE_TR, { "{r}× smaller than one volatility": "tek oynaklıktan {r} kat küçük" });
Object.assign(QE_ES, { "{r}× smaller than one volatility": "{r} veces menor que una sola volatilidad" });
Object.assign(QE_TR, { "{r}× larger than one volatility": "tek oynaklıktan {r} kat büyük" });
Object.assign(QE_ES, { "{r}× larger than one volatility": "{r} veces mayor que una sola volatilidad" });
Object.assign(QE_TR, { "fit error {x} points on this expiry, {c} on the same quotes.": "bu vadede uydurma hatası {x} puan; aynı kotasyonlarda {c}." });
Object.assign(QE_ES, { "fit error {x} points on this expiry, {c} on the same quotes.": "error de ajuste {x} puntos en este vencimiento; con las mismas cotizaciones, {c}." });
Object.assign(QE_TR, { "fit error {x} points over all the fitted expiries, {c} on those quotes.": "uydurulan bütün vadelerde uydurma hatası {x} puan; o kotasyonlarda {c}." });
Object.assign(QE_ES, { "fit error {x} points over all the fitted expiries, {c} on those quotes.": "error de ajuste {x} puntos en todos los vencimientos ajustados; con esas cotizaciones, {c}." });
Object.assign(QE_TR, { "This expiry was left out of the fit.": "Bu vade uydurmaya dahil edilmedi." });
Object.assign(QE_ES, { "This expiry was left out of the fit.": "Este vencimiento quedó fuera del ajuste." });
Object.assign(QE_TR, { "fictional snapshot, no delay": "kurgusal anlık görüntü, gecikme yok" });
Object.assign(QE_ES, { "fictional snapshot, no delay": "instantánea ficticia, sin retraso" });
Object.assign(QE_TR, { "All": "Tümü" });
Object.assign(QE_ES, { "All": "Todos" });
Object.assign(QE_TR, { "Analysis groups": "Analiz grupları" });
Object.assign(QE_ES, { "Analysis groups": "Grupos de análisis" });
Object.assign(QE_TR, { "No analysis matches this search.": "Bu aramaya uyan analiz yok." });
Object.assign(QE_ES, { "No analysis matches this search.": "Ningún análisis coincide con esta búsqueda." });
Object.assign(QE_TR, { "The company’s own numbers: growth, margins, cash and returns.": "Şirketin kendi rakamları: büyüme, marjlar, nakit ve getiriler." });
Object.assign(QE_ES, { "The company’s own numbers: growth, margins, cash and returns.": "Las cifras de la propia empresa: crecimiento, márgenes, caja y rentabilidad." });
Object.assign(QE_TR, { "What the share could be worth, and what today’s price assumes.": "Hissenin ne kadar edebileceği ve bugünkü fiyatın neyi varsaydığı." });
Object.assign(QE_ES, { "What the share could be worth, and what today’s price assumes.": "Cuánto podría valer la acción y qué supone el precio de hoy." });
Object.assign(QE_TR, { "Debt, market sensitivity, ownership and the range of outcomes.": "Borç, piyasaya duyarlılık, ortaklık yapısı ve olası sonuçların aralığı." });
Object.assign(QE_ES, { "Debt, market sensitivity, ownership and the range of outcomes.": "Deuda, sensibilidad al mercado, accionistas y rango de resultados." });
Object.assign(QE_TR, { "Prices, statistics and models: tests, portfolios, options.": "Fiyatlar, istatistik ve modeller: testler, portföyler, opsiyonlar." });
Object.assign(QE_ES, { "Prices, statistics and models: tests, portfolios, options.": "Precios, estadística y modelos: pruebas, carteras, opciones." });
Object.assign(QE_TR, { "Options data": "Opsiyon verisi" });
Object.assign(QE_ES, { "Options data": "Datos de opciones" });
Object.assign(QE_TR, { "Turkey": "Türkiye" });
Object.assign(QE_ES, { "Turkey": "Turquía" });
Object.assign(QE_TR, { "tickers": "hisse" });
Object.assign(QE_ES, { "tickers": "símbolos" });
Object.assign(QE_TR, { "Explore the analyses": "Analizleri keşfet" });
Object.assign(QE_ES, { "Explore the analyses": "Explora los análisis" });
Object.assign(QE_TR, { "Featured": "Öne çıkan" });
Object.assign(QE_ES, { "Featured": "Destacado" });
Object.assign(QE_TR, { "Black–Scholes and Heston on live option chains, the volatility surface, a scenario grid, and the VIX recomputed with the Cboe method.": "Canlı opsiyon zincirlerinde Black–Scholes ve Heston, oynaklık yüzeyi, senaryo tablosu ve Cboe yöntemiyle yeniden hesaplanan VIX." });
Object.assign(QE_ES, { "Black–Scholes and Heston on live option chains, the volatility surface, a scenario grid, and the VIX recomputed with the Cboe method.": "Black–Scholes y Heston sobre cadenas de opciones en vivo, la superficie de volatilidad, una tabla de escenarios y el VIX recalculado con el método de Cboe." });
Object.assign(QE_TR, { "Open": "Aç" });
Object.assign(QE_ES, { "Open": "Abrir" });
// v0.13.5 Learn page
Object.assign(QE_TR, {"Learn": "Öğren"});
Object.assign(QE_ES, {"Learn": "Aprende"});
Object.assign(QE_TR, {"Learn the formulas and the data": "Formülleri ve verileri öğren"});
Object.assign(QE_ES, {"Learn the formulas and the data": "Aprende las fórmulas y los datos"});
Object.assign(QE_TR, {"What each analysis computes, where its numbers come from and how to read the result.": "Her analiz ne hesaplıyor, rakamları nereden geliyor ve sonuç nasıl okunur."});
Object.assign(QE_ES, {"What each analysis computes, where its numbers come from and how to read the result.": "Qué calcula cada análisis, de dónde salen sus cifras y cómo leer el resultado."});
Object.assign(QE_TR, {"New to this? Follow “Where to start”, then open any analysis in the Lab.": "Yeni misin? “Nereden başlamalı” adımlarını izle, sonra istediğin analizi Laboratuvar’da aç."});
Object.assign(QE_ES, {"New to this? Follow “Where to start”, then open any analysis in the Lab.": "¿Eres nuevo? Sigue “Por dónde empezar” y luego abre cualquier análisis en el Laboratorio."});
Object.assign(QE_TR, {"Learn the analyses": "Analizleri öğren"});
Object.assign(QE_ES, {"Learn the analyses": "Aprende los análisis"});
Object.assign(QE_TR, {"Every analysis in QuantEdge answers one question. Here you can see how: the formula, where each number comes from, the steps it follows, a worked example with made-up numbers, how to read the result and where it stops being reliable.": "QuantEdge’deki her analiz tek bir soruyu cevaplar. Burada nasıl cevapladığını görürsün: formülü, her rakamın nereden geldiğini, izlediği adımları, uydurma rakamlarla çözülmüş bir örneği, sonucun nasıl okunacağını ve nerede güvenilir olmaktan çıktığını."});
Object.assign(QE_ES, {"Every analysis in QuantEdge answers one question. Here you can see how: the formula, where each number comes from, the steps it follows, a worked example with made-up numbers, how to read the result and where it stops being reliable.": "Cada análisis de QuantEdge responde a una pregunta. Aquí ves cómo: la fórmula, de dónde sale cada cifra, los pasos que sigue, un ejemplo resuelto con cifras inventadas, cómo leer el resultado y dónde deja de ser fiable."});
Object.assign(QE_TR, {"Every analysis, explained": "Her analiz, açıklamalı"});
Object.assign(QE_ES, {"Every analysis, explained": "Cada análisis, explicado"});
Object.assign(QE_TR, {"Formulas": "Formüller"});
Object.assign(QE_ES, {"Formulas": "Fórmulas"});
Object.assign(QE_TR, {"Data it uses": "Kullandığı veriler"});
Object.assign(QE_ES, {"Data it uses": "Datos que usa"});
Object.assign(QE_TR, {"Step by step": "Adım adım"});
Object.assign(QE_ES, {"Step by step": "Paso a paso"});
Object.assign(QE_TR, {"Worked example (made-up numbers)": "Çözümlü örnek (uydurma rakamlar)"});
Object.assign(QE_ES, {"Worked example (made-up numbers)": "Ejemplo resuelto (cifras inventadas)"});
Object.assign(QE_TR, {"How to read it": "Nasıl okunur"});
Object.assign(QE_ES, {"How to read it": "Cómo leerlo"});
Object.assign(QE_TR, {"Limits and common mistakes": "Sınırlar ve sık yapılan hatalar"});
Object.assign(QE_ES, {"Limits and common mistakes": "Límites y errores frecuentes"});
Object.assign(QE_TR, {"Study next": "Sıradaki"});
Object.assign(QE_ES, {"Study next": "Estudia después"});
Object.assign(QE_TR, {"Open in the Analysis Lab": "Analiz Laboratuvarı’nda aç"});
Object.assign(QE_ES, {"Open in the Analysis Lab": "Abrir en el Laboratorio de análisis"});
Object.assign(QE_TR, {"The explanations could not be loaded. Refresh the page to try again.": "Açıklamalar yüklenemedi. Tekrar denemek için sayfayı yenile."});
Object.assign(QE_ES, {"The explanations could not be loaded. Refresh the page to try again.": "No se pudieron cargar las explicaciones. Recarga la página para intentarlo de nuevo."});
Object.assign(QE_TR, {"Used for": "Kullanıldığı yer"});
Object.assign(QE_ES, {"Used for": "Se usa para"});
Object.assign(QE_TR, {"Keep in mind": "Dikkat"});
Object.assign(QE_ES, {"Keep in mind": "Ten en cuenta"});
Object.assign(QE_TR, {"Groups": "Gruplar"});
Object.assign(QE_ES, {"Groups": "Grupos"});
Object.assign(QE_TR, {"Search a term, e.g. WACC or beta": "Bir terim ara, ör. WACC ya da beta"});
Object.assign(QE_ES, {"Search a term, e.g. WACC or beta": "Busca un término, p. ej. WACC o beta"});
Object.assign(QE_TR, {"Search the explanations": "Açıklamalarda ara"});
Object.assign(QE_ES, {"Search the explanations": "Buscar en las explicaciones"});
Object.assign(QE_TR, {"Educational explanations of how QuantEdge computes each figure. Not investment advice.": "QuantEdge’in her rakamı nasıl hesapladığına dair eğitim amaçlı açıklamalar. Yatırım tavsiyesi değildir."});
Object.assign(QE_ES, {"Educational explanations of how QuantEdge computes each figure. Not investment advice.": "Explicaciones educativas de cómo calcula QuantEdge cada cifra. No es asesoramiento de inversión."});
Object.assign(QE_ES, {"Fall from the window start and recovery": "Caída desde el inicio del periodo y recuperación"});
// v0.13.5 Learn page: calculators, quizzes, progress, dictionary
Object.assign(QE_TR, {"Learned": "Öğrendim"});
Object.assign(QE_ES, {"Learned": "Aprendido"});
Object.assign(QE_TR, {"Mark as learned": "Öğrendim olarak işaretle"});
Object.assign(QE_ES, {"Mark as learned": "Marcar como aprendido"});
Object.assign(QE_TR, {"Example": "Örnek"});
Object.assign(QE_ES, {"Example": "Ejemplo"});
Object.assign(QE_TR, {"Dictionary A–Z": "A–Z sözlük"});
Object.assign(QE_ES, {"Dictionary A–Z": "Diccionario A–Z"});
Object.assign(QE_TR, {"Every term used in QuantEdge in one place. Terms are also explained where they appear: look for the small “?”.": "QuantEdge’de geçen bütün terimler tek bir yerde. Terimler geçtikleri yerde de açıklanır: küçük “?” işaretine bak."});
Object.assign(QE_ES, {"Every term used in QuantEdge in one place. Terms are also explained where they appear: look for the small “?”.": "Todos los términos de QuantEdge en un solo lugar. También se explican donde aparecen: busca el pequeño “?”."});
Object.assign(QE_TR, {"Search the dictionary": "Sözlükte ara"});
Object.assign(QE_ES, {"Search the dictionary": "Buscar en el diccionario"});
Object.assign(QE_TR, {"{n} terms": "{n} terim"});
Object.assign(QE_ES, {"{n} terms": "{n} términos"});
Object.assign(QE_TR, {"No term matches this search.": "Bu aramaya uyan terim yok."});
Object.assign(QE_ES, {"No term matches this search.": "Ningún término coincide con esta búsqueda."});
Object.assign(QE_TR, {"Your progress": "İlerlemen"});
Object.assign(QE_ES, {"Your progress": "Tu progreso"});
Object.assign(QE_TR, {"{n} of {m} analyses learned": "{m} analizden {n} tanesi öğrenildi"});
Object.assign(QE_ES, {"{n} of {m} analyses learned": "{n} de {m} análisis aprendidos"});
Object.assign(QE_TR, {"Saved in this browser only. Open a card and press “Mark as learned” when you are done.": "Sadece bu tarayıcıda saklanır. Bir kartı açıp bitirince “Öğrendim olarak işaretle”ye bas."});
Object.assign(QE_ES, {"Saved in this browser only. Open a card and press “Mark as learned” when you are done.": "Solo se guarda en este navegador. Abre una tarjeta y pulsa “Marcar como aprendido” cuando termines."});
Object.assign(QE_TR, {"Try it yourself": "Kendin dene"});
Object.assign(QE_ES, {"Try it yourself": "Pruébalo tú mismo"});
Object.assign(QE_TR, {"Reset to the example": "Örneğe dön"});
Object.assign(QE_ES, {"Reset to the example": "Volver al ejemplo"});
Object.assign(QE_TR, {"Starts on the example above. Move a slider and watch the result change. Made-up numbers.": "Yukarıdaki örnekle başlar. Bir kaydırıcıyı oynat ve sonucun nasıl değiştiğine bak. Rakamlar uydurmadır."});
Object.assign(QE_ES, {"Starts on the example above. Move a slider and watch the result change. Made-up numbers.": "Empieza con el ejemplo de arriba. Mueve un control y mira cómo cambia el resultado. Cifras inventadas."});
Object.assign(QE_TR, {"Check yourself": "Kendini test et"});
Object.assign(QE_ES, {"Check yourself": "Ponte a prueba"});
Object.assign(QE_TR, {"{n} of {m} right": "{m} sorudan {n} doğru"});
Object.assign(QE_ES, {"{n} of {m} right": "{n} de {m} correctas"});
Object.assign(QE_TR, {"Net income": "Net kâr"});
Object.assign(QE_ES, {"Net income": "Beneficio neto"});
Object.assign(QE_TR, {"Average total assets": "Ortalama toplam varlıklar"});
Object.assign(QE_ES, {"Average total assets": "Activo total medio"});
Object.assign(QE_TR, {"Average equity": "Ortalama özkaynak"});
Object.assign(QE_ES, {"Average equity": "Patrimonio medio"});
Object.assign(QE_TR, {"Net margin": "Net kâr marjı"});
Object.assign(QE_ES, {"Net margin": "Margen neto"});
Object.assign(QE_TR, {"Asset turnover": "Varlık devir hızı"});
Object.assign(QE_ES, {"Asset turnover": "Rotación de activos"});
Object.assign(QE_TR, {"Equity multiplier": "Özkaynak çarpanı"});
Object.assign(QE_ES, {"Equity multiplier": "Multiplicador del patrimonio"});
Object.assign(QE_TR, {"ROE": "ROE (özkaynak kârlılığı)"});
Object.assign(QE_ES, {"ROE": "ROE (rentabilidad del patrimonio)"});
Object.assign(QE_TR, {"Cost of sales": "Satışların maliyeti"});
Object.assign(QE_ES, {"Cost of sales": "Coste de ventas"});
Object.assign(QE_TR, {"Average receivables": "Ortalama alacaklar"});
Object.assign(QE_ES, {"Average receivables": "Cuentas por cobrar medias"});
Object.assign(QE_TR, {"Average inventory": "Ortalama stok"});
Object.assign(QE_ES, {"Average inventory": "Inventario medio"});
Object.assign(QE_TR, {"Average payables": "Ortalama borçlar (tedarikçi)"});
Object.assign(QE_ES, {"Average payables": "Cuentas por pagar medias"});
Object.assign(QE_TR, {"DSO": "DSO (tahsilat süresi)"});
Object.assign(QE_ES, {"DSO": "DSO (días de cobro)"});
Object.assign(QE_TR, {"DIO": "DIO (stok süresi)"});
Object.assign(QE_ES, {"DIO": "DIO (días de inventario)"});
Object.assign(QE_TR, {"DPO": "DPO (ödeme süresi)"});
Object.assign(QE_ES, {"DPO": "DPO (días de pago)"});
Object.assign(QE_TR, {"Operating cash flow": "İşletme nakit akışı"});
Object.assign(QE_ES, {"Operating cash flow": "Flujo de caja operativo"});
Object.assign(QE_TR, {"Capital expenditure": "Yatırım harcaması"});
Object.assign(QE_ES, {"Capital expenditure": "Inversión en activos fijos"});
Object.assign(QE_TR, {"Total assets, start of year": "Toplam varlıklar, yıl başı"});
Object.assign(QE_ES, {"Total assets, start of year": "Activo total, inicio del año"});
Object.assign(QE_TR, {"Total assets, end of year": "Toplam varlıklar, yıl sonu"});
Object.assign(QE_ES, {"Total assets, end of year": "Activo total, final del año"});
Object.assign(QE_TR, {"Cash conversion": "Nakde dönüşüm"});
Object.assign(QE_ES, {"Cash conversion": "Conversión en caja"});
Object.assign(QE_TR, {"Accruals ratio": "Tahakkuk oranı"});
Object.assign(QE_ES, {"Accruals ratio": "Ratio de devengos"});
Object.assign(QE_TR, {"FCF ÷ net income": "Serbest nakit akışı ÷ net kâr"});
Object.assign(QE_ES, {"FCF ÷ net income": "Flujo de caja libre ÷ beneficio neto"});
Object.assign(QE_TR, {"EBIT": "FVÖK (EBIT)"});
Object.assign(QE_ES, {"EBIT": "EBIT"});
Object.assign(QE_TR, {"Tax rate": "Vergi oranı"});
Object.assign(QE_ES, {"Tax rate": "Tipo impositivo"});
Object.assign(QE_TR, {"Average invested capital": "Ortalama yatırılan sermaye"});
Object.assign(QE_ES, {"Average invested capital": "Capital invertido medio"});
Object.assign(QE_TR, {"WACC": "WACC (sermaye maliyeti)"});
Object.assign(QE_ES, {"WACC": "WACC (coste de capital)"});
Object.assign(QE_TR, {"NOPAT": "NOPAT (vergi sonrası faaliyet kârı)"});
Object.assign(QE_ES, {"NOPAT": "NOPAT (beneficio operativo tras impuestos)"});
Object.assign(QE_TR, {"ROIC": "ROIC (yatırılan sermaye getirisi)"});
Object.assign(QE_ES, {"ROIC": "ROIC (rentabilidad del capital invertido)"});
Object.assign(QE_TR, {"Spread (ROIC − WACC)": "Fark (ROIC − WACC)"});
Object.assign(QE_ES, {"Spread (ROIC − WACC)": "Diferencial (ROIC − WACC)"});
Object.assign(QE_TR, {"Year-1 revenue growth": "1. yıl gelir büyümesi"});
Object.assign(QE_ES, {"Year-1 revenue growth": "Crecimiento de ingresos del año 1"});
Object.assign(QE_TR, {"EBIT margin": "FVÖK marjı"});
Object.assign(QE_ES, {"EBIT margin": "Margen EBIT"});
Object.assign(QE_TR, {"Terminal growth": "Uç büyüme"});
Object.assign(QE_ES, {"Terminal growth": "Crecimiento terminal"});
Object.assign(QE_TR, {"Five years of cash flow, today": "Beş yıllık nakit akışı, bugünkü değeri"});
Object.assign(QE_ES, {"Five years of cash flow, today": "Cinco años de flujo de caja, valor de hoy"});
Object.assign(QE_TR, {"Terminal value, today": "Uç değer, bugünkü değeri"});
Object.assign(QE_ES, {"Terminal value, today": "Valor terminal, valor de hoy"});
Object.assign(QE_TR, {"Share of value after year 5": "Değerin 5. yıldan sonraki payı"});
Object.assign(QE_ES, {"Share of value after year 5": "Parte del valor después del año 5"});
Object.assign(QE_TR, {"Enterprise value today": "Bugünkü firma değeri"});
Object.assign(QE_ES, {"Enterprise value today": "Valor de empresa hoy"});
Object.assign(QE_TR, {"Free cash flow margin": "Serbest nakit akışı marjı"});
Object.assign(QE_ES, {"Free cash flow margin": "Margen de flujo de caja libre"});
Object.assign(QE_TR, {"Growth the price implies, per year for 10 years": "Fiyatın varsaydığı büyüme, 10 yıl boyunca yıllık"});
Object.assign(QE_ES, {"Growth the price implies, per year for 10 years": "Crecimiento que implica el precio, anual durante 10 años"});
Object.assign(QE_TR, {"Revenue in year 10": "10. yıldaki gelir"});
Object.assign(QE_ES, {"Revenue in year 10": "Ingresos en el año 10"});
Object.assign(QE_TR, {"Share price": "Hisse fiyatı"});
Object.assign(QE_ES, {"Share price": "Precio de la acción"});
Object.assign(QE_TR, {"Shares outstanding": "Dolaşımdaki hisse sayısı"});
Object.assign(QE_ES, {"Shares outstanding": "Acciones en circulación"});
Object.assign(QE_TR, {"Net income (last 12 months)": "Net kâr (son 12 ay)"});
Object.assign(QE_ES, {"Net income (last 12 months)": "Beneficio neto (últimos 12 meses)"});
Object.assign(QE_TR, {"Peer 1 P/E": "Rakip 1 F/K"});
Object.assign(QE_ES, {"Peer 1 P/E": "P/E del competidor 1"});
Object.assign(QE_TR, {"Peer 2 P/E": "Rakip 2 F/K"});
Object.assign(QE_ES, {"Peer 2 P/E": "P/E del competidor 2"});
Object.assign(QE_TR, {"Peer 3 P/E": "Rakip 3 F/K"});
Object.assign(QE_ES, {"Peer 3 P/E": "P/E del competidor 3"});
Object.assign(QE_TR, {"Market value": "Piyasa değeri"});
Object.assign(QE_ES, {"Market value": "Valor de mercado"});
Object.assign(QE_TR, {"P/E": "F/K"});
Object.assign(QE_ES, {"P/E": "P/E"});
Object.assign(QE_TR, {"Peer median P/E": "Rakiplerin medyan F/K’sı"});
Object.assign(QE_ES, {"Peer median P/E": "P/E mediano de los competidores"});
Object.assign(QE_TR, {"Gap to peers": "Rakiplere göre fark"});
Object.assign(QE_ES, {"Gap to peers": "Diferencia frente a competidores"});
Object.assign(QE_TR, {"Total assets": "Toplam varlıklar"});
Object.assign(QE_ES, {"Total assets": "Activo total"});
Object.assign(QE_TR, {"Working capital": "İşletme sermayesi"});
Object.assign(QE_ES, {"Working capital": "Capital circulante"});
Object.assign(QE_TR, {"Retained earnings": "Geçmiş yıl kârları"});
Object.assign(QE_ES, {"Retained earnings": "Beneficios retenidos"});
Object.assign(QE_TR, {"Equity": "Özkaynak"});
Object.assign(QE_ES, {"Equity": "Patrimonio"});
Object.assign(QE_TR, {"Total liabilities": "Toplam yükümlülükler"});
Object.assign(QE_ES, {"Total liabilities": "Pasivo total"});
Object.assign(QE_TR, {"Z''": "Z''"});
Object.assign(QE_ES, {"Z''": "Z''"});
Object.assign(QE_TR, {"Safe zone (above 2.6)": "Güvenli bölge (2,6 üstü)"});
Object.assign(QE_ES, {"Safe zone (above 2.6)": "Zona segura (más de 2,6)"});
Object.assign(QE_TR, {"Grey zone (1.1–2.6)": "Gri bölge (1,1–2,6)"});
Object.assign(QE_ES, {"Grey zone (1.1–2.6)": "Zona gris (1,1–2,6)"});
Object.assign(QE_TR, {"Distress zone (below 1.1)": "Riskli bölge (1,1 altı)"});
Object.assign(QE_ES, {"Distress zone (below 1.1)": "Zona de riesgo (menos de 1,1)"});
Object.assign(QE_TR, {"Beta": "Beta"});
Object.assign(QE_ES, {"Beta": "Beta"});
Object.assign(QE_TR, {"Equity risk premium": "Hisse senedi risk primi"});
Object.assign(QE_ES, {"Equity risk premium": "Prima de riesgo de la renta variable"});
Object.assign(QE_TR, {"Market move": "Piyasa hareketi"});
Object.assign(QE_ES, {"Market move": "Movimiento del mercado"});
Object.assign(QE_TR, {"Cost of equity (CAPM)": "Özkaynak maliyeti (CAPM)"});
Object.assign(QE_ES, {"Cost of equity (CAPM)": "Coste del patrimonio (CAPM)"});
Object.assign(QE_TR, {"Typical move for this share": "Bu hissenin tipik hareketi"});
Object.assign(QE_ES, {"Typical move for this share": "Movimiento típico de esta acción"});
Object.assign(QE_TR, {"Strike price": "Kullanım fiyatı"});
Object.assign(QE_ES, {"Strike price": "Precio de ejercicio"});
Object.assign(QE_TR, {"Months to expiry": "Vadeye kalan ay"});
Object.assign(QE_ES, {"Months to expiry": "Meses hasta el vencimiento"});
Object.assign(QE_TR, {"Call price": "Alım opsiyonu fiyatı"});
Object.assign(QE_ES, {"Call price": "Precio de la call"});
Object.assign(QE_TR, {"Put price": "Satım opsiyonu fiyatı"});
Object.assign(QE_ES, {"Put price": "Precio de la put"});
Object.assign(QE_TR, {"Chance the call ends in the money (risk-neutral)": "Alım opsiyonunun kârda bitme olasılığı (risk-nötr)"});
Object.assign(QE_ES, {"Chance the call ends in the money (risk-neutral)": "Probabilidad de que la call termine dentro del dinero (riesgo neutral)"});
Object.assign(QE_TR, {"Terminal growth must stay at least 1 point below WACC": "Uç büyüme WACC’ın en az 1 puan altında olmalı"});
Object.assign(QE_ES, {"Terminal growth must stay at least 1 point below WACC": "El crecimiento terminal debe quedar al menos 1 punto por debajo del WACC"});
Object.assign(QE_TR, {"No growth rate between −50% and +150% matches this value": "−%50 ile +%150 arasında bu değeri veren bir büyüme oranı yok"});
Object.assign(QE_ES, {"No growth rate between −50% and +150% matches this value": "Ningún crecimiento entre −50 % y +150 % da este valor"});
Object.assign(QE_TR, {"Above the 10% flag": "%10 uyarı sınırının üstünde"});
Object.assign(QE_ES, {"Above the 10% flag": "Por encima del umbral del 10 %"});
Object.assign(QE_TR, {"Not quite.": "Tam değil."});
Object.assign(QE_ES, {"Not quite.": "No exactamente."});
Object.assign(QE_TR, {"Correct.": "Doğru."});
Object.assign(QE_ES, {"Correct.": "Correcto."});
Object.assign(QE_TR, {"Kept as in the example: revenue 1,000, tax 20%, D&A 4% and capex 5% of revenue, working capital 5% of extra revenue, debt 200, cash 100, 100 shares.": "Örnekteki gibi sabit: gelir 1.000, vergi %20, amortisman gelirin %4’ü, yatırım harcaması gelirin %5’i, işletme sermayesi ek gelirin %5’i, borç 200, nakit 100, 100 hisse."});
Object.assign(QE_ES, {"Kept as in the example: revenue 1,000, tax 20%, D&A 4% and capex 5% of revenue, working capital 5% of extra revenue, debt 200, cash 100, 100 shares.": "Fijos como en el ejemplo: ingresos 1.000, impuestos 20 %, amortización 4 % y capex 5 % de los ingresos, capital circulante 5 % de los ingresos adicionales, deuda 200, caja 100, 100 acciones."});

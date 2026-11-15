/* QuantEdge v0.13.5 — knowledge base of the offline help bot (help_bot.js).
 *
 * Everything the assistant can say lives in this file. Nothing is downloaded, no API key is used
 * and no question leaves the computer: help_bot.js matches the question against these entries.
 *
 * Entry fields
 *   id     unique id; type: 'page' | 'analysis' | 'term' | 'faq' | 'chat'
 *   page   page id the entry is about ('Home','Analysis Lab','Learn','Public Site','LinkedIn','Reports','Library','Guide','About')
 *   analysis  Analysis Lab id (lab_api.catalog()), n = its number in the Lab list
 *   k      search phrases separated by '|' (any language; matching folds Turkish letters and accents)
 *   t      title [tr, en, es]
 *   b      answer [tr, en, es]; each is a list of lines. '' = new paragraph, '- ' = bullet,
 *          '1. ' = numbered step, **bold**, `code`. Plain text only: never HTML.
 *   go     pages to offer as buttons; f = follow-up entry ids (2-3)
 * Glossary terms come from glossary.js (QE_GLOSSARY); termAliases only adds the search phrases.
 */
var QE_HELP_KB = {
  version: '0.13.5',

  pages: {
    'Home': ['Ana sayfa', 'Home', 'Inicio'],
    'Analysis Lab': ['Analiz Laboratuvarı', 'Analysis Lab', 'Laboratorio de análisis'],
    'Options': ['Opsiyonlar', 'Options', 'Opciones'],
    'Learn': ['Öğren', 'Learn', 'Aprende'],
    'Public Site': ['Sitem', 'My public site', 'Mi sitio'],
    'LinkedIn': ['LinkedIn', 'LinkedIn', 'LinkedIn'],
    'Reports': ['Raporlar', 'Reports', 'Informes'],
    'Library': ['Kütüphane', 'Library', 'Biblioteca'],
    'Guide': ['Rehber', 'Guide', 'Guía'],
    'About': ['Hakkımızda', 'About', 'Acerca de']
  },

  /* Suggestions shown when the panel opens on a page (entry ids). */
  pageSuggest: {
    'Home': ['page_home', 'faq_first_steps', 'page_about'],
    'Analysis Lab': ['page_lab', 'faq_thesis_required', 'faq_companies'],
    'Learn': ['page_learn', 'faq_data_sources', 'faq_first_steps'],
    'Options': ['page_options', 'faq_desk_cards', 'an_options_lab', 'faq_advice'],
    'Public Site': ['faq_site_publish', 'faq_track_record', 'faq_was_i_right'],
    'LinkedIn': ['page_linkedin', 'faq_carousel', 'faq_overclaim'],
    'Reports': ['page_reports', 'faq_save', 'faq_pdf_report'],
    'Library': ['page_library', 'faq_was_i_right', 'faq_portfolio_page'],
    'Guide': ['page_guide', 'faq_first_steps', 'faq_sec_email'],
    'About': ['page_about', 'faq_privacy', 'faq_advice']
  },

  ui: {
    tr: {
      launcher: 'Yardım', title: 'QuantEdge Yardım', sub: 'Çevrimdışı asistan · sorular bilgisayarından çıkmaz',
      placeholder: 'Sorunu yaz (ör. wacc nedir?)', send: 'Gönder', close: 'Yardımı kapat', clear: 'Sohbeti temizle',
      hint: 'Enter: gönder · Esc: kapat', you: 'Sen', bot: 'Asistan',
      greet: 'Merhaba! Şu an **{page}** sayfasındasın. QuantEdge ile ilgili her şeyi sorabilirsin: sayfalar, 30 analiz, finans terimleri, yayınlama ve hatalar.',
      greetAsk: 'Buradan başlamak istersen:',
      unknown: 'Bunu tam olarak bilmiyorum; uydurmak yerine söylüyorum. Şu konulardan biri işine yarayabilir:',
      unknownTail: 'Soruyu başka kelimelerle de yazabilirsin, ör. “wacc nedir”, “carousel nasıl yüklenir”.',
      related: 'İlgili sorular', open: '{page} sayfasını aç', openHome: 'Ana sayfaya git', openLab: 'Analiz Laboratuvarı’nı aç',
      pickInLab: 'Laboratuvarda üstteki sekmelerden ya da arama kutusundan **#{n} {title}** analizini seç.',
      example: 'Örnek kodlar', footer: 'Eğitim amaçlıdır; yatırım tavsiyesi değildir.', glossaryExample: 'Örnek',
      answerFor: 'Yanıt'
    },
    en: {
      launcher: 'Help', title: 'QuantEdge Help', sub: 'Offline assistant · your questions never leave this computer',
      placeholder: 'Ask, e.g. what is WACC?', send: 'Send', close: 'Close help', clear: 'Clear chat',
      hint: 'Enter: send · Esc: close', you: 'You', bot: 'Assistant',
      greet: 'Hi! You are on the **{page}** page. Ask me anything about QuantEdge: the pages, the 30 analyses, finance terms, publishing and errors.',
      greetAsk: 'Good places to start:',
      unknown: 'I don’t know that one for sure, and I would rather say so than guess. One of these topics may help:',
      unknownTail: 'You can also try other words, e.g. “what is wacc” or “upload a LinkedIn carousel”.',
      related: 'Related questions', open: 'Open {page}', openHome: 'Go to Home', openLab: 'Open the Analysis Lab',
      pickInLab: 'In the Lab, choose **#{n} {title}** from the tabs or the search box at the top.',
      example: 'Example tickers', footer: 'Educational; not investment advice.', glossaryExample: 'Example',
      answerFor: 'Answer'
    },
    es: {
      launcher: 'Ayuda', title: 'Ayuda de QuantEdge', sub: 'Asistente sin conexión · tus preguntas no salen de este ordenador',
      placeholder: 'Pregunta, p. ej. ¿qué es el WACC?', send: 'Enviar', close: 'Cerrar ayuda', clear: 'Borrar chat',
      hint: 'Enter: enviar · Esc: cerrar', you: 'Tú', bot: 'Asistente',
      greet: '¡Hola! Estás en la página **{page}**. Pregúntame lo que quieras sobre QuantEdge: páginas, los 30 análisis, términos financieros, publicación y errores.',
      greetAsk: 'Buenos puntos de partida:',
      unknown: 'No lo sé con seguridad y prefiero decirlo antes que inventar. Quizá te sirva uno de estos temas:',
      unknownTail: 'También puedes probar con otras palabras, p. ej. “qué es el wacc” o “subir un carrusel a LinkedIn”.',
      related: 'Preguntas relacionadas', open: 'Abrir {page}', openHome: 'Ir al inicio', openLab: 'Abrir el Laboratorio de análisis',
      pickInLab: 'En el Laboratorio, elige **#{n} {title}** en las pestañas o el buscador de arriba.',
      example: 'Tickers de ejemplo', footer: 'Educativo; no es asesoramiento de inversión.', glossaryExample: 'Ejemplo',
      answerFor: 'Respuesta'
    }
  },

  /* Extra search phrases for the glossary.js terms (QE_GLOSSARY keys). */
  termAliases: {
    revenue: 'gelir|hasılat|ciro|satışlar|revenue|sales|ingresos|ventas',
    revenue_growth: 'gelir büyümesi|büyüme oranı|satış büyümesi|revenue growth|crecimiento de ingresos',
    operating_margin: 'faaliyet kâr marjı|faaliyet marjı|operasyonel marj|ebit marjı|operating margin|margen operativo',
    net_margin: 'net kâr marjı|net marj|net margin|margen neto',
    net_income: 'net kâr|net gelir|kâr nedir|net income|profit|beneficio neto',
    free_cash_flow: 'serbest nakit akışı|fcf|serbest nakit|free cash flow|flujo de caja libre',
    cash_conversion: 'nakit dönüşümü|nakde dönüşüm oranı|cash conversion|conversión de caja',
    cagr: 'cagr|yıllık bileşik büyüme|bileşik büyüme oranı|compound annual growth|crecimiento anual compuesto',
    ttm: 'ttm|son 12 ay|son on iki ay|trailing twelve months|últimos doce meses',
    fiscal_year: 'mali yıl|hesap yılı|fy|fiscal year|año fiscal|ejercicio fiscal',
    current_ratio: 'cari oran|likidite oranı|current ratio|ratio de liquidez',
    capex: 'capex|yatırım harcaması|sermaye harcaması|capital expenditure|inversión en activos',
    dcf: 'dcf|indirgenmiş nakit akışı|iskontolu nakit akışı|discounted cash flow|flujo de caja descontado',
    wacc: 'wacc|wacc ne|sermaye maliyeti|ağırlıklı ortalama sermaye maliyeti|iskonto oranı|cost of capital|discount rate|coste de capital',
    terminal_growth: 'sonsuz büyüme|terminal büyüme|uç değer büyümesi|terminal growth|crecimiento terminal|crecimiento a perpetuidad',
    enterprise_value: 'firma değeri|şirket değeri|ev|enterprise value|valor de empresa',
    equity_value: 'özkaynak değeri|hisse değeri|equity value|valor del patrimonio',
    diluted_shares: 'seyreltilmiş hisse|hisse sayısı|diluted shares|acciones diluidas',
    sharpe: 'sharpe|sharpe oranı|risk başına getiri|sharpe ratio|ratio de sharpe',
    max_drawdown: 'maksimum düşüş|max drawdown|en büyük düşüş|zirveden düşüş|drawdown|caída máxima',
    buy_hold: 'al ve tut|buy and hold|buy hold|comprar y mantener',
    out_of_sample: 'test dışı dönem|örneklem dışı|out of sample|overfitting|geçmişe uydurma|aşırı uyum|fuera de muestra|sobreajuste',
    form_10k: '10-k|10k|10-k nedir|yıllık rapor|annual report|informe anual',
    form_10q: '10-q|10q|çeyreklik rapor|quarterly report|informe trimestral',
    bps: 'baz puan|bps|basis point|puntos básicos'
  },

  entries: [
    /* ───────────────────────────── pages ───────────────────────────── */
    { id: 'page_home', type: 'page', page: 'Home',
      k: 'ana sayfa|anasayfa|ana sayfa ne işe yarar|giriş sayfası|son yayınlarım|son analizlerim|home page|home|dashboard|inicio|página de inicio',
      t: ['Ana sayfa ne işe yarar?', 'What is the Home page for?', '¿Para qué sirve Inicio?'],
      b: [[
        '**Ana sayfa** QuantEdge’in masası: yayınlama döngüsünü ve son yayınlarını gösterir.',
        '',
        '1. **Analiz çalıştır** – 30 sorudan birini seç; SEC raporları ve fiyat geçmişi senin için yüklenir.',
        '2. **Görüşünü yaz** – tezini ve riskleri kendi cümlelerinle ekle.',
        '3. **Yayınla** – LinkedIn metni, carousel, görsel ya da sitende bir sayfa.',
        '',
        '“Son yayınlar” listesi sitene eklediğin analizleri ve “Haklı çıktım mı?” durumlarını gösterir. **Önizle** ile sayfayı açarsın.'
      ], [
        '**Home** is the QuantEdge desk: it shows the publishing loop and your recent publications.',
        '',
        '1. **Run an analysis** – pick one of 30 questions; SEC filings and price history are loaded for you.',
        '2. **Write your view** – add your thesis and the risks in your own words.',
        '3. **Publish** – a LinkedIn post, a carousel, an image or a page on your public site.',
        '',
        '“Recent publications” lists what you added to your site and each “Was I right?” status. **Preview** opens the page.'
      ], [
        '**Inicio** es el escritorio de QuantEdge: muestra el ciclo de publicación y tus publicaciones recientes.',
        '',
        '1. **Ejecuta un análisis** – elige una de 30 preguntas; los informes de la SEC y los precios se cargan solos.',
        '2. **Escribe tu opinión** – tu tesis y sus riesgos con tus palabras.',
        '3. **Publica** – texto de LinkedIn, carrusel, imagen o una página en tu sitio.',
        '',
        '“Publicaciones recientes” muestra lo que añadiste a tu sitio y el estado de “¿Acerté?”.'
      ]],
      go: ['Analysis Lab', 'Public Site'], f: ['faq_first_steps', 'page_lab', 'page_about'] },

    { id: 'page_options', type: 'page', page: 'Options',
      k: 'opsiyonlar|opsiyonlar sekmesi|opsiyonlar sayfası|opsiyon sayfası|opsiyonlar nerede|opsiyon nerede|canlı opsiyon sekmesi|canlı rozeti|canlı yazısı|kapalı rozeti|kapalı yazısı|rozet|options|options tab|options page|where are the options|live badge|closed badge|opciones|dónde están las opciones|pestaña opciones|página de opciones|insignia en vivo|insignia cerrado|insignia|punto verde|kapalı yazıyor|neden kapalı yazıyor|sarı nokta|turuncu nokta|gri nokta|gri halka|yeşil nokta|yanıp sönen nokta|green dot|amber dot|yellow dot|orange dot|grey dot|gray dot|grey ring|gray ring|punto ámbar|punto gris|anillo gris',
      t: ['Opsiyonlar sekmesi nedir?', 'What is the Options tab?', '¿Qué es la pestaña Opciones?'],
      b: [[
        '**Opsiyonlar** sekmesi, canlı opsiyon laboratuvarını (#30) kendi sayfasında, Analiz Laboratuvarı’nın analiz listesi olmadan açar.',
        '',
        '1. Bir ABD hissesi ya da ETF kodu yaz (ör. AAPL, SPY) ve Enter’a bas.',
        '2. Her dakika yenilemek için **Canlı** kutusunu işaretle; hisse 15 saniyede bir güncellenir.',
        '3. Kaydırıcılarla Black–Scholes değerini ve Greek’leri değiştir, **Heston** düğmesiyle stokastik oynaklık modelini uydur, stratejileri dene.',
        '4. **Bu görüntüden araştırma notu oluştur** ile notu yaz; yayınlama adımları Analiz Laboratuvarı’ndakiyle aynıdır.',
        '',
        'Menüdeki rozet New York saatine göre seansı gösterir: seans açıkken **CANLI** ve yanıp sönen yeşil nokta, seans dışında **KAPALI**. Hisse opsiyonları yalnızca normal seansta (New York saatiyle 09:30–16:00) işlem görür; SPY gibi birkaç ETF opsiyonu 16:15’e kadar sürer. KAPALI yanındaki dolu sarı nokta hissenin seans öncesi ya da sonrası işlem gördüğünü, içi boş gri halka hiçbir işlem olmadığını gösterir (geceleri, hafta sonu ve borsa tatillerinde). Rozet 13:00 erken kapanışları da bilir. Telefonda yalnızca nokta görünür; bilgisayarda rozetin üstüne gelince ayrıntı çıkar. Opsiyon kotasyonları yaklaşık 15 dakika gecikmelidir. Yatırım tavsiyesi değildir.'
      ], [
        'The **Options** tab opens the live options lab (#30) on a page of its own, without the list of analyses.',
        '',
        '1. Type a US stock or ETF ticker (e.g. AAPL, SPY) and press Enter.',
        '2. Tick **Live** to refresh every minute; the stock price updates every 15 seconds.',
        '3. Move the sliders for the Black–Scholes price and Greeks, fit the **Heston** stochastic-volatility model, try strategies.',
        '4. **Write a research note from this snapshot**; publishing works as in the Analysis Lab.',
        '',
        'The badge in the menu follows the New York clock: **LIVE** with a green pulsing dot while the market is open, **CLOSED** outside the session. Stock options trade only in the regular session (9:30–16:00 New York time); a few ETF options such as SPY trade until 16:15. Next to CLOSED, a filled amber dot means the stock trades before or after the session, a hollow grey ring that nothing trades (nights, weekends and exchange holidays). The badge also knows the 13:00 early closes. Phones show only the dot; on a computer, hover over the badge for details. Option quotes are delayed about 15 minutes. Not investment advice.'
      ], [
        'La pestaña **Opciones** abre el laboratorio de opciones en vivo (#30) en su propia página, sin la lista de análisis.',
        '',
        '1. Escribe un símbolo de EE. UU. (p. ej. AAPL, SPY) y pulsa Intro.',
        '2. Marca **En vivo** para refrescar cada minuto; la acción se actualiza cada 15 segundos.',
        '3. Ajusta Black–Scholes y las griegas, ajusta **Heston** y prueba estrategias.',
        '4. **Escribe una nota de análisis con esta instantánea**; la publicación funciona como en el Laboratorio de análisis.',
        '',
        'La insignia del menú sigue el reloj de Nueva York: **EN VIVO** con un punto verde que late con el mercado abierto, **CERRADO** fuera de la sesión. Las opciones sobre acciones solo se negocian en la sesión regular (9:30–16:00, hora de Nueva York); algunas opciones de ETF, como SPY, hasta las 16:15. Junto a CERRADO, un punto ámbar relleno indica que la acción cotiza antes o después de la sesión; un anillo gris hueco, que no hay negociación (noches, fines de semana y festivos). La insignia también conoce los cierres anticipados a las 13:00. En el móvil solo se ve el punto; en el ordenador, pasa el ratón sobre la insignia para ver el detalle. Las cotizaciones de opciones llevan unos 15 minutos de retraso. No es asesoramiento de inversión.'
      ]],
      go: ['Options'], f: ['an_options_lab', 'page_lab', 'faq_advice'] },

    { id: 'page_lab', type: 'page', page: 'Analysis Lab',
      k: 'analiz laboratuvarı|laboratuvar|lab|analiz nasıl yapılır|analiz nasıl çalıştırılır|analizi çalıştır|30 analiz|28 analiz|hangi analizler var|analiz listesi|analysis lab|run analysis|how to run an analysis|laboratorio|ejecutar análisis',
      t: ['Analiz Laboratuvarı nasıl kullanılır?', 'How do I use the Analysis Lab?', '¿Cómo se usa el Laboratorio de análisis?'],
      b: [[
        '**Analiz Laboratuvarı** QuantEdge’in ana aracı: 30 analizin her biri tek bir soruyu SEC raporları ve geçmiş fiyatlarla yanıtlar.',
        '',
        '1. Üstteki sekmelerden bir grup seç (Tümü, Temel analiz, Değerleme, Risk ve kredi, Kantitatif) ya da arama kutusuna yaz, sonra bir analiz kartına tıkla.',
        '2. Şirket kodlarını yaz ya da **Örneği kullan**’a bas (ör. NVDA).',
        '3. SEC verisi indirilecekse **SEC iletişim e-postası** kutusunu doldur (e-posta kaydedilmez; sayfa yenilenince tekrar yazman gerekir).',
        '4. **Analizi çalıştır**. İlk çalıştırma veri indirdiği için ~1 dakika sürebilir.',
        '5. Sonucu oku: öne çıkanlar, grafik, tablo, **Yöntem ve sınırlar** ve kaynaklar.',
        '6. Altta **Bu analizi yayınla**: “Ben ne düşünüyorum” (en az 80 karakter) ve “Neden yanılıyor olabilirim” (en az 60 karakter) kutularını doldur; LinkedIn taslağı, carousel, PNG ve **Siteme ekle** açılır.',
        '',
        '**Sık sorunlar:** 20-F/40-F veren yabancı şirketler çalışır ama rakamlar dolara çevrilir ve ADR oranını senin girmen gerekebilir; bankalarda bazı kalemler yok; BIST kodları sadece Türkiye ve fiyat analizlerinde çalışır.'
      ], [
        'The **Analysis Lab** is the main tool: each of its 30 analyses answers one question with SEC filings and historical prices.',
        '',
        '1. Pick a group in the tabs at the top (All, Fundamentals, Valuation, Risk and credit, Quant) or type in the search box, then click an analysis card.',
        '2. Type tickers or press **Use the example** (e.g. NVDA).',
        '3. The first time, enter your **SEC contact email**.',
        '4. Press **Run analysis**. The first run downloads data and can take about a minute.',
        '5. Read the result: key findings, chart, table, **Method and limits** and sources.',
        '6. Under **Publish this analysis** write “What I think” (at least 80 characters) and “Why I might be wrong” (at least 60). The LinkedIn draft, carousel, PNG and **Add to my public site** unlock.',
        '',
        '**Common problems:** foreign filers (20-F/40-F) work, but their figures are converted to US dollars and you may need to enter the ADR ratio; banks lack some items; BIST tickers only work in the Turkey and price analyses.'
      ], [
        'El **Laboratorio de análisis** es la herramienta principal: cada uno de sus 30 análisis responde una pregunta con informes de la SEC y precios históricos.',
        '',
        '1. Elige un grupo en las pestañas de arriba (o escribe en el buscador) y haz clic en un análisis.',
        '2. Escribe los tickers o pulsa **Usar el ejemplo** (p. ej. NVDA).',
        '3. La primera vez, escribe tu **email de contacto para la SEC**.',
        '4. Pulsa **Ejecutar análisis**. La primera vez descarga datos y puede tardar un minuto.',
        '5. Lee el resultado: hallazgos, gráfico, tabla, **Método y límites** y fuentes.',
        '6. En **Publicar este análisis** escribe tu opinión (mín. 80 caracteres) y por qué podrías equivocarte (mín. 60). Se desbloquean LinkedIn, carrusel, PNG y **Añadir a mi sitio**.',
        '',
        '**Problemas comunes:** las empresas extranjeras (20-F/40-F) funcionan, con cifras convertidas a dólares y quizá el ratio del ADR; a los bancos les faltan partidas; BIST solo en el análisis de Turquía y los de precios.'
      ]],
      go: ['Analysis Lab'], f: ['faq_first_run', 'faq_thesis_required', 'faq_companies'] },

    { id: 'page_site', type: 'page', page: 'Public Site',
      k: 'sitem|herkese açık site|kişisel site|public site|my site|portfolio website|site sayfası|mi sitio|sitio público|sitem kapalı|site is closed|sitio cerrado',
      t: ['Sitem sayfası ne işe yarar?', 'What is the Public Site page?', '¿Para qué sirve Mi sitio?'],
      b: [[
        '**Sitem**, seçtiğin analizleri CV’ne ve LinkedIn profiline koyabileceğin **tek linklik ücretsiz bir siteye** dönüştürür.',
        '',
        '1. Laboratuvarda tez ve riskleri yazıp **Siteme ekle**’ye bas.',
        '2. Burada adını, başlığını, kısa tanıtımını ve (isteğe bağlı) LinkedIn adresini yaz, **Kaydet**.',
        '3. **Siteyi önizle** ile kontrol et, **Siteyi indir (ZIP)**.',
        '4. Sayfadaki 7 adımla GitHub Pages’e yükle.',
        '',
        'Site JavaScript kullanmaz, reklam ve takip yoktur. QuantEdge’in kendisi, taslakların ve notların bilgisayarında kalır; sadece sitedeki analizler herkese açılır.'
      ], [
        '**Public Site** turns the analyses you choose into a **free one-link website** for your CV and LinkedIn profile.',
        '',
        '1. In the Lab write your thesis and risks, then press **Add to my public site**.',
        '2. Here enter your name, headline, short bio and (optional) LinkedIn URL, then **Save**.',
        '3. Check it with **Preview site**, then **Download site (ZIP)**.',
        '4. Follow the 7 steps on the page to put it on GitHub Pages.',
        '',
        'The site uses no JavaScript, ads or tracking. QuantEdge itself, your drafts and notes stay on your computer; only the analyses on the site become public.'
      ], [
        '**Mi sitio** convierte los análisis que elijas en un **sitio web gratuito de un solo enlace** para tu CV y LinkedIn.',
        '',
        '1. En el Laboratorio escribe tesis y riesgos y pulsa **Añadir a mi sitio**.',
        '2. Aquí escribe tu nombre, titular, biografía breve y (opcional) tu URL de LinkedIn y **Guarda**.',
        '3. Revisa con **Vista previa** y **Descarga el sitio (ZIP)**.',
        '4. Sigue los 7 pasos de la página para subirlo a GitHub Pages.',
        '',
        'El sitio no usa JavaScript, anuncios ni rastreo. Solo los análisis del sitio son públicos.'
      ]],
      go: ['Public Site'], f: ['faq_site_publish', 'faq_site_update', 'faq_site_public'] },

    { id: 'page_linkedin', type: 'page', page: 'LinkedIn',
      k: 'linkedin sayfası|linkedin gönderisi|linkedin paylaşımı|linkedin post|linkedin metni|gönderi yaz|post yaz|anlık sec özeti|rakip karşılaştırması|publicación de linkedin',
      t: ['LinkedIn sayfası nasıl kullanılır?', 'How do I use the LinkedIn page?', '¿Cómo se usa la página LinkedIn?'],
      b: [[
        '**LinkedIn** sayfası bir şirketin SEC rakamlarından paylaşıma hazır bir gönderi taslağı hazırlar.',
        '',
        '1. Şirket kodunu yaz ve seç (Enter ya da **Seç**).',
        '2. **Resmî rakamları yükle** ile SEC verisini getir.',
        '3. Biçimi seç: Hızlı SEC veri özeti, kişisel araştırma notu, detaylı analist notu ya da **Rakip karşılaştırması (iki şirket)**.',
        '4. İstersen tezini ve karşı görüşünü ekle, **Paylaşım metnini oluştur**.',
        '5. **LinkedIn için kopyala**, ardından **LinkedIn’i aç** ve yapıştır. Altındaki 1200×627 görseli **PNG indir** ile kaydedip gönderiye ekleyebilirsin.',
        '',
        'Sayaç LinkedIn’in 3000 karakter sınırını gösterir. Taslaklar bu tarayıcıda saklanır (son 20); yedek için **.txt indir**. QuantEdge otomatik paylaşım yapmaz.'
      ], [
        'The **LinkedIn** page drafts a ready-to-paste post from a company’s SEC figures.',
        '',
        '1. Type a ticker and select it (Enter or **Select**).',
        '2. Press **Load official figures** to fetch the SEC data.',
        '3. Choose a format: instant SEC snapshot, personal research insight, deep analyst note or **Peer comparison (two companies)**.',
        '4. Optionally add your thesis and counterargument, then **Generate copy-ready post**.',
        '5. **Copy for LinkedIn**, then **Open LinkedIn** and paste. Save the 1200×627 chart card with **Download PNG** to attach it.',
        '',
        'A counter shows LinkedIn’s 3,000-character limit. Drafts are kept in this browser (last 20); use **Save .txt** for a backup. QuantEdge never posts for you.'
      ], [
        'La página **LinkedIn** prepara un borrador de publicación con las cifras de la SEC de una empresa.',
        '',
        '1. Escribe un ticker y selecciónalo.',
        '2. Pulsa **Cargar cifras oficiales**.',
        '3. Elige el formato: resumen SEC, nota personal, nota detallada o **comparación con un rival**.',
        '4. Si quieres añade tu tesis y contraargumento y genera el texto.',
        '5. **Copia para LinkedIn**, abre LinkedIn y pega. Guarda la tarjeta 1200×627 con **Descargar PNG**.',
        '',
        'El contador muestra el límite de 3.000 caracteres. Los borradores se guardan en este navegador. QuantEdge nunca publica por ti.'
      ]],
      go: ['LinkedIn'], f: ['faq_carousel', 'faq_overclaim', 'faq_png'] },

    { id: 'page_reports', type: 'page', page: 'Reports',
      k: 'raporlar|rapor yaz|uzun rapor|research publisher|araştırma raporu|rapor sayfası|reports|write a report|informes|informe',
      t: ['Raporlar sayfası ne işe yarar?', 'What is the Reports page for?', '¿Para qué sirve Informes?'],
      b: [[
        '**Raporlar** (Rapor stüdyosu) daha uzun bir araştırma raporu yazdığın yer.',
        '',
        '- Sekmeler: **Tez**, **Riskler**, **Tetikleyiciler**, **Notlar**, **Kanıtlar** (her iddiaya kaynak linki) ve **Kontrol** (paylaşmadan önce yapılandırılmış ön kontrol).',
        '- Sağda canlı önizleme; üç farklı tasarım (Kurumsal Araştırma, Editöryal Analiz, Yönetici Özeti).',
        '- **PDF indir** / **HTML indir** ile taslağı dışa aktar; **Kütüphaneye kaydet** ile arşivle.',
        '',
        'Laboratuvardaki **Rapor notlarına ekle** düğmesi analiz sonucunu buraya taşır. Dışa aktarılan dosyalar şimdilik İngilizce hazırlanır ve “taslak” olarak işaretlenir.'
      ], [
        '**Reports** (Research Publisher) is where you write a longer research report.',
        '',
        '- Tabs: **Thesis**, **Risks**, **Catalysts**, **Notes**, **Evidence** (a source link for each claim) and **Review** (a structured preflight check before sharing).',
        '- A live preview on the right with three layouts.',
        '- **Export PDF** / **Download HTML** to export the draft; **Save to Library** to archive it.',
        '',
        '**Add to report notes** in the Lab sends an analysis here. Exports are in English for now and marked as drafts.'
      ], [
        '**Informes** (Research Publisher) es donde escribes un informe más largo.',
        '',
        '- Pestañas: **Tesis**, **Riesgos**, **Catalizadores**, **Notas**, **Evidencia** y **Revisión**.',
        '- Vista previa en vivo con tres diseños.',
        '- Exporta con **PDF** o **HTML** y guarda con **Guardar en la biblioteca**.',
        '',
        '**Añadir a las notas del informe** en el Laboratorio envía un análisis aquí. Las exportaciones salen en inglés por ahora.'
      ]],
      go: ['Reports'], f: ['faq_pdf_report', 'faq_save', 'page_library'] },

    { id: 'page_library', type: 'page', page: 'Library',
      k: 'kütüphane|kayıtlı raporlar|kaydettiklerim|arşiv|library|saved reports|archive|biblioteca|guardados',
      t: ['Kütüphane ne işe yarar?', 'What is the Library for?', '¿Para qué sirve la Biblioteca?'],
      b: [[
        '**Kütüphane**, Raporlar’da **Kütüphaneye kaydet** ile sakladığın taslakların yerel arşivi.',
        '',
        '- Bir kayda tıkla: saklanan taslağın aynısını okursun (kayıtlar anlık görüntüdür, veriler değişse de güncellenmez).',
        '- **Haklı mıydım?** bölümü – **Bugünkü rakamlarla karşılaştır**, sonra kararını kaydet (Tezim tuttu / Kısmen tuttu / Tutmadı / Henüz erken).',
        '- **Portföy sayfasını indir** – bütün kayıtların ve kararların tek bir HTML dosyasında; internetsiz açılır.',
        '',
        'Arşiv tek kullanıcılı ve sadece bu bilgisayarda; bulut depolama değildir.'
      ], [
        'The **Library** is the local archive of drafts you stored with **Save to Library** on the Reports page.',
        '',
        '- Click a record to read the exact stored draft (records are snapshots and do not update when data changes).',
        '- **Was I right?** – **Compare with today’s figures**, then save your verdict (Held / Partly / Did not hold / Too early).',
        '- **Download portfolio page** – all records and verdicts in one HTML file that works offline.',
        '',
        'The archive is single-user and stays on this computer; it is not cloud storage.'
      ], [
        'La **Biblioteca** es el archivo local de los borradores guardados desde Informes.',
        '',
        '- Pulsa un registro para leer el borrador guardado (son instantáneas que no se actualizan).',
        '- **¿Acerté?** – compara con las cifras de hoy y guarda tu veredicto.',
        '- **Descargar página de portafolio** – todo en un único HTML que funciona sin conexión.',
        '',
        'El archivo se queda en este ordenador; no es almacenamiento en la nube.'
      ]],
      go: ['Library', 'Reports'], f: ['faq_was_i_right', 'faq_portfolio_page', 'faq_save'] },

    { id: 'page_guide', type: 'page', page: 'Guide',
      k: 'rehber|rehberli araştırma|çeyreklik veriler|son 8 çeyrek|çeyrek tablosu|quarterly data|last 8 quarters|adım adım|yeni başlayan|acemi|guided analyst|guide|tutorial|step by step|beginner|guía|principiante|paso a paso',
      t: ['Rehber nasıl kullanılır?', 'How does the Guide work?', '¿Cómo funciona la Guía?'],
      b: [[
        '**Rehber**, şirket araştırmasına yeni başlayanlar için adım adım bir yolculuk.',
        '',
        '1. Gerçek bir şirket seç ve işinin ne olduğunu yaz.',
        '2. SEC rakamlarını yükle; 3. adımda son 8 çeyrek ve son 12 ay tablosu çıkar.',
        '3. Rakamları kendi cümlelerinle yorumla.',
        '4. Test edilebilir bir tez ve dürüst bir karşı görüş yaz.',
        '5. En az iki kaynak linki ekle, yöntemini ve kendi katkını açıkla, yapay zekâ kullanımını beyan et.',
        '',
        'Üstteki sayaç kaç adımın hazır olduğunu gösterir. Bittiğinde Raporlar’a geçip PDF/HTML alabilirsin. İspanyolca seçiliyken Rehber İngilizce görünür.'
      ], [
        'The **Guide** is a step-by-step research journey for beginners.',
        '',
        '1. Pick a real company and describe what the business does.',
        '2. Load the SEC figures; step 3 shows the last 8 quarters and the trailing twelve months.',
        '3. Interpret the numbers in your own words.',
        '4. Write a testable thesis and an honest counterargument.',
        '5. Add at least two source links, explain your method and contribution, and declare any AI use.',
        '',
        'The counter at the top shows how many steps are ready. When done, continue in Reports for a PDF/HTML.'
      ], [
        'La **Guía** es un recorrido paso a paso para principiantes.',
        '',
        '1. Elige una empresa real y describe su negocio.',
        '2. Carga las cifras de la SEC (el paso 3 muestra los últimos 8 trimestres).',
        '3. Interpreta las cifras con tus palabras.',
        '4. Escribe una tesis comprobable y un contraargumento honesto.',
        '5. Añade al menos dos fuentes y declara si usaste IA.',
        '',
        'Con el español seleccionado, la Guía se muestra en inglés.'
      ]],
      go: ['Guide'], f: ['faq_first_steps', 'faq_sec_email', 'term_sec_docs'] },

    { id: 'page_about', type: 'page', page: 'About',
      k: 'hakkımızda|quantedge nedir|quantedge ne yapar|quantedge ne işe yarar|bu uygulama ne|bu site ne|bu program nedir|ne işe yarıyor|amacı ne|kim yaptı|about|what is quantedge|what does quantedge do|what is this app|acerca de|qué es quantedge|para qué sirve quantedge',
      t: ['QuantEdge nedir, ne yapar?', 'What is QuantEdge and what does it do?', '¿Qué es QuantEdge y qué hace?'],
      b: [[
        '**QuantEdge**, lise ve üniversite öğrencilerinin **kaynağa dayalı, profesyonel hisse analizleri** yazıp yayınlaması için yerel bir araştırma masası.',
        '',
        '- Rakamlar resmî kaynaklardan gelir: ABD şirketleri için **SEC 10-K** raporları (XBRL), fiyatlar için **Yahoo Finance**.',
        '- 30 analiz, her biri tek bir soruya cevap verir ve yöntemini, sınırlarını ve kaynağını gösterir.',
        '- Yayınlamadan önce **senin görüşün** ve **neden yanılıyor olabileceğin** yazılmak zorunda: veri görüşünü destekler, yerini almaz.',
        '- Çıktılar: LinkedIn metni, carousel PDF, PNG görsel, kişisel site, uzun rapor.',
        '',
        'Uygulama senin bilgisayarında çalışır; hesap, reklam ya da takip yoktur. QuantEdge **yatırım tavsiyesi vermez**; bir eğitim ve araştırma aracıdır.'
      ], [
        '**QuantEdge** is a local research desk for high-school and university students to write and publish **professional, source-based equity analyses**.',
        '',
        '- Figures come from official sources: **SEC 10-K** filings (XBRL) for US companies and **Yahoo Finance** for prices.',
        '- 30 analyses, each answering one question and showing its method, limits and sources.',
        '- Before anything is published, **your view** and **why you might be wrong** must be written: data supports your view, it does not replace it.',
        '- Outputs: LinkedIn text, carousel PDF, PNG image, a personal website, a longer report.',
        '',
        'It runs on your computer, with no account, ads or tracking. QuantEdge **does not give investment advice**; it is an educational research tool.'
      ], [
        '**QuantEdge** es un escritorio de investigación local para que estudiantes escriban y publiquen **análisis bursátiles profesionales basados en fuentes**.',
        '',
        '- Las cifras vienen de fuentes oficiales: informes **10-K de la SEC** y precios de **Yahoo Finance**.',
        '- 30 análisis; cada uno responde una pregunta y muestra método, límites y fuentes.',
        '- Antes de publicar debes escribir **tu opinión** y **por qué podrías equivocarte**.',
        '- Resultados: texto de LinkedIn, carrusel PDF, imagen PNG, sitio personal e informe largo.',
        '',
        'Funciona en tu ordenador, sin cuenta, anuncios ni rastreo. **No es asesoramiento de inversión.**'
      ]],
      go: ['About', 'Analysis Lab'], f: ['faq_privacy', 'faq_data_sources', 'faq_first_steps'] },

    { id: 'page_learn', type: 'page', page: 'Learn',
      k: 'öğren|formül|formüller|formülü ne|nasıl hesaplanıyor|nasıl hesaplanır|hangi veri|veri nereden|nereden başlamalı|nereden başlayayım|açıklama|learn|formula|formulas|how is it calculated|how is it computed|where does the data come from|where to start|aprende|fórmula|fórmulas|cómo se calcula|de dónde salen los datos|por dónde empezar',
      t: ['Öğren sayfası: formüller ve veriler', 'The Learn page: formulas and data', 'La página Aprende: fórmulas y datos'],
      b: [[
        '**Öğren** sayfası, 30 analizin her birinin **ne hesapladığını** anlatır: formülü, her rakamın **nereden geldiğini**, izlediği adımları, uydurma rakamlarla çözülmüş bir örneği, sonucun nasıl okunacağını ve sınırlarını.',
        '',
        '- **Nereden başlamalı:** yeni başlayanlar için beş adımlık bir sıra.',
        '- **Veriler nereden geliyor:** SEC belgeleri, fiyatlar, faizler ve akademik veri setleri; her birinin neye yaradığı ve nelere dikkat etmen gerektiği.',
        '- Her kartın altındaki düğmeyle analizi doğrudan Laboratuvar’da açabilirsin.'
      ], [
        'The **Learn** page explains **what each of the 30 analyses computes**: the formula, **where each number comes from**, the steps, a worked example with made-up numbers, how to read the result and its limits.',
        '',
        '- **Where to start:** a five-step order for beginners.',
        '- **Where the data comes from:** SEC filings, prices, rates and research datasets, what each is used for and what to keep in mind.',
        '- The button under each card opens that analysis straight in the Lab.'
      ], [
        'La página **Aprende** explica **qué calcula cada uno de los 30 análisis**: la fórmula, **de dónde sale cada cifra**, los pasos, un ejemplo resuelto con cifras inventadas, cómo leer el resultado y sus límites.',
        '',
        '- **Por dónde empezar:** un orden de cinco pasos para principiantes.',
        '- **De dónde salen los datos:** documentos de la SEC, precios, tipos de interés y bases académicas, para qué sirve cada uno y qué tener en cuenta.',
        '- El botón bajo cada tarjeta abre ese análisis directamente en el Laboratorio.'
      ]],
      go: ['Learn', 'Analysis Lab'], f: ['faq_data_sources', 'faq_first_steps', 'page_lab'] },

    /* ───────────────────────────── the 30 analyses ───────────────────────────── */
    { id: 'an_cycle_compare', type: 'analysis', analysis: 'cycle_compare', n: 1,
      k: 'döngü karşılaştırması|sektör karşılaştırması|döngüsel şirketler|konjonktür|çelik şirketleri|cycle compare|sector comparison|through the cycle|comparación de ciclo|comparación sectorial',
      t: ['#1 Sektör / döngü karşılaştırması', '#1 Sector / cycle comparison', '#1 Comparación sectorial / de ciclo'],
      b: [[
        '**Soru:** Döngü boyunca en iyi kim dayanıyor?',
        '',
        'Aynı sektördeki 2–5 şirketin yıllar içindeki gelirini ve **faaliyet kâr marjını** yan yana koyar. Kötü yıllarda marjı en az düşen şirket, döngüye en dayanıklı olandır.',
        '',
        '- **Nasıl okunur:** çizgilerin en düşük noktasına ve toparlanma hızına bak; ortalama marj tek başına yeterli değil.',
        '- **Örnek:** NUE, STLD, CLF (çelik).',
        '- **Sınır:** mali yıl sonları şirketten şirkete değişir; bankalarda faaliyet kârı raporlanmadığı için marj boş kalabilir.'
      ], [
        '**Question:** Who holds up best through the cycle?',
        '',
        'It lines up revenue and **operating margin** over the years for 2–5 companies in the same industry. The one whose margin falls least in bad years is the most resilient.',
        '',
        '- **How to read it:** look at each line’s low point and how fast it recovers; the average margin alone is not enough.',
        '- **Example:** NUE, STLD, CLF (steel).',
        '- **Limits:** fiscal years end on different dates; banks do not report operating income, so margins can be blank.'
      ], [
        '**Pregunta:** ¿Quién aguanta mejor el ciclo?',
        '',
        'Compara ingresos y **margen operativo** de 2–5 empresas del mismo sector a lo largo de los años. La que menos cae en los años malos es la más resistente.',
        '',
        '- **Cómo leerlo:** mira el punto más bajo de cada línea y la rapidez de la recuperación.',
        '- **Ejemplo:** NUE, STLD, CLF (acero).',
        '- **Límites:** los años fiscales terminan en fechas distintas; los bancos no reportan beneficio operativo.'
      ]],
      f: ['term_operating_margin', 'an_crisis', 'an_comps'] },

    { id: 'an_earnings_quality', type: 'analysis', analysis: 'earnings_quality', n: 2,
      k: 'kazanç kalitesi|kâr kalitesi|kâr nakde dönüyor mu|tahakkuk oranı|accruals|earnings quality|does profit turn into cash|calidad de beneficios|calidad de las ganancias',
      t: ['#2 Kazanç kalitesi', '#2 Earnings quality', '#2 Calidad de los beneficios'],
      b: [[
        '**Soru:** Kâr gerçekten nakde dönüyor mu?',
        '',
        'Net kârı işletme nakit akışıyla karşılaştırır ve **tahakkuk oranını** hesaplar: (net kâr − işletme nakdi) / ortalama varlık.',
        '',
        '- **Nasıl okunur:** nakit dönüşümü %100’ün üstündeyse kâr nakde iyi dönüyor; tahakkuk oranı %10’un üstündeyse kârın büyük kısmı henüz nakit değil – nedenini araştır (alacak, stok artışı).',
        '- **Örnek:** NVDA, TSLA, KO.',
        '- **Sınır:** tek bir yıl yanıltıcı olabilir; birkaç yılın eğilimine bak.'
      ], [
        '**Question:** Does profit really turn into cash?',
        '',
        'It compares net income with operating cash flow and computes the **accrual ratio**: (net income − operating cash flow) / average assets.',
        '',
        '- **How to read it:** cash conversion above 100% means profit turns into cash well; an accrual ratio above 10% means much of the profit is not cash yet – find out why (receivables, inventory).',
        '- **Example:** NVDA, TSLA, KO.',
        '- **Limits:** one year can mislead; look at the trend over several years.'
      ], [
        '**Pregunta:** ¿El beneficio se convierte de verdad en efectivo?',
        '',
        'Compara el beneficio neto con el flujo de caja operativo y calcula el **ratio de devengo**.',
        '',
        '- **Cómo leerlo:** una conversión de caja superior al 100 % es buena señal; un devengo superior al 10 % pide investigar (cuentas por cobrar, inventario).',
        '- **Ejemplo:** NVDA, TSLA, KO.',
        '- **Límites:** un solo año puede engañar; mira la tendencia.'
      ]],
      f: ['term_cash_conversion', 'term_free_cash_flow', 'an_piotroski'] },

    { id: 'an_segments', type: 'analysis', analysis: 'segments', n: 3,
      k: 'segment analizi|iş kolları|bölüm analizi|segment|coğrafi kırılım|ürün kırılımı|hangi iş büyüyor|segment analysis|business segments|análisis de segmentos|segmentos',
      t: ['#3 Segment analizi', '#3 Segment analysis', '#3 Análisis de segmentos'],
      b: [[
        '**Soru:** Geliri hangi iş kolları taşıyor ve hangileri büyüyor?',
        '',
        '10-K’daki iş kolu, ürün ve coğrafya kırılımını yıllara göre gösterir: her parçanın payı ve büyüme hızı.',
        '',
        '- **Nasıl okunur:** payı artan segment şirketin geleceğini taşıyor olabilir; küçük ama hızlı büyüyen parçaya dikkat et.',
        '- **Örnek:** MSFT (tek şirket).',
        '- **Sınır:** sadece toplamı raporlanan gelire (±%1,5) denk gelen kırılımlar gösterilir; şirket segment tanımını değiştirdiyse seri kopabilir.'
      ], [
        '**Question:** Which businesses drive revenue, and which are growing?',
        '',
        'It shows the 10-K breakdown by business segment, product and geography over the years: each part’s share and growth.',
        '',
        '- **How to read it:** a segment with a rising share may carry the company’s future; watch small but fast-growing parts.',
        '- **Example:** MSFT (one company).',
        '- **Limits:** only breakdowns that add up to reported revenue (±1.5%) are shown; if the company redefined its segments the series can break.'
      ], [
        '**Pregunta:** ¿Qué negocios generan los ingresos y cuáles crecen?',
        '',
        'Muestra el desglose del 10-K por segmento, producto y geografía: peso y crecimiento de cada parte.',
        '',
        '- **Cómo leerlo:** un segmento que gana peso puede ser el futuro de la empresa.',
        '- **Ejemplo:** MSFT.',
        '- **Límites:** solo se muestran desgloses que suman los ingresos (±1,5 %).'
      ]],
      f: ['term_revenue_growth', 'term_sec_docs', 'an_capital_allocation'] },

    { id: 'an_reverse_dcf', type: 'analysis', analysis: 'reverse_dcf', n: 4,
      k: 'ters dcf|tersine dcf|reverse dcf|fiyat hangi büyümeyi varsayıyor|piyasa ne bekliyor|fiyatlanmış büyüme|implied growth|dcf inverso|crecimiento implícito',
      t: ['#4 Ters DCF', '#4 Reverse DCF', '#4 DCF inverso'],
      b: [[
        '**Soru:** Bugünkü fiyat nasıl bir büyüme varsayıyor?',
        '',
        'Normal DCF “şirket ne kadar eder?” diye sorar; **ters DCF** tersini yapar: bugünkü piyasa değerini haklı çıkarmak için gelirin 10 yıl boyunca yılda ne kadar büyümesi gerektiğini bulur.',
        '',
        '- **Nasıl okunur:** çıkan büyümeyi şirketin geçmiş büyümesiyle karşılaştır. Geçmişten çok yüksekse fiyat iyimser bir gelecek varsayıyor demektir.',
        '- **Ayarlar:** WACC (varsayılan %9), sonsuz büyüme (%3), serbest nakit marjı (boş = son 3 yıl ortalaması).',
        '- **Örnek:** NVDA.',
        '- **Sınır:** sonuç WACC ve marj varsayımına çok duyarlıdır; zarar eden ya da negatif nakit akışlı şirkette anlamsızdır.'
      ], [
        '**Question:** What growth does today’s price assume?',
        '',
        'A normal DCF asks “what is it worth?”; a **reverse DCF** works backwards: it finds the yearly revenue growth over 10 years needed to justify today’s market value.',
        '',
        '- **How to read it:** compare the implied growth with the company’s past growth. Far above the past means the price assumes an optimistic future.',
        '- **Settings:** WACC (default 9%), terminal growth (3%), free-cash-flow margin (blank = 3-year average).',
        '- **Example:** NVDA.',
        '- **Limits:** very sensitive to WACC and margin; meaningless for loss-making or cash-burning companies.'
      ], [
        '**Pregunta:** ¿Qué crecimiento asume el precio actual?',
        '',
        'El DCF normal pregunta cuánto vale; el **DCF inverso** calcula qué crecimiento anual de ingresos durante 10 años justifica el valor de mercado actual.',
        '',
        '- **Cómo leerlo:** compara ese crecimiento con el histórico. Si es muy superior, el precio asume un futuro optimista.',
        '- **Ajustes:** WACC (9 %), crecimiento terminal (3 %), margen de flujo libre (vacío = media de 3 años).',
        '- **Ejemplo:** NVDA.',
        '- **Límites:** muy sensible al WACC y al margen.'
      ]],
      f: ['term_dcf', 'term_wacc', 'an_scenarios'] },

    { id: 'an_scenarios', type: 'analysis', analysis: 'scenarios', n: 5,
      k: 'senaryo analizi|senaryolar|duyarlılık tablosu|duyarlılık analizi|iyimser kötümser|scenarios|sensitivity|sensitivity table|bull bear|escenarios|sensibilidad',
      t: ['#5 Senaryo ve duyarlılık', '#5 Scenarios and sensitivity', '#5 Escenarios y sensibilidad'],
      b: [[
        '**Soru:** Cevap varsayımlara ne kadar bağlı?',
        '',
        'Son mali yılın marj, vergi ve yatırım oranlarıyla bir DCF kurar; kötümser / baz / iyimser senaryoları ve WACC × sonsuz büyüme **duyarlılık tablosunu** gösterir.',
        '',
        '- **Nasıl okunur:** tablodaki değerler birbirinden çok uzaksa “değer” tek bir sayı değil, bir aralıktır. Gönderinde aralığı söyle.',
        '- **Ayarlar:** WACC (%9), sonsuz büyüme (%3), büyüme (boş = son yıllardan).',
        '- **Örnek:** AAPL.',
        '- **Sınır:** bir model, gelecek değil; hedef fiyat olarak sunma.'
      ], [
        '**Question:** How much does the answer depend on the assumptions?',
        '',
        'It builds a DCF from the latest fiscal year’s margin, tax and investment rates, and shows bear / base / bull scenarios and a WACC × terminal-growth **sensitivity table**.',
        '',
        '- **How to read it:** if the table’s values are far apart, the “value” is a range, not a number. Say the range in your post.',
        '- **Settings:** WACC (9%), terminal growth (3%), growth (blank = from recent years).',
        '- **Example:** AAPL.',
        '- **Limits:** it is a model, not the future; do not present it as a price target.'
      ], [
        '**Pregunta:** ¿Cuánto depende la respuesta de los supuestos?',
        '',
        'Construye un DCF con los datos del último año fiscal y muestra escenarios pesimista / base / optimista y una **tabla de sensibilidad** WACC × crecimiento terminal.',
        '',
        '- **Cómo leerlo:** si los valores están muy separados, el valor es un rango, no un número.',
        '- **Ejemplo:** AAPL.',
        '- **Límites:** es un modelo, no un precio objetivo.'
      ]],
      f: ['an_reverse_dcf', 'term_terminal_growth', 'faq_params'] },

    { id: 'an_piotroski', type: 'analysis', analysis: 'piotroski', n: 6,
      k: 'piotroski|f skoru|f-score|finansal sağlık|finansal sağlığı iyileşen|piotroski f score|financial health|salud financiera',
      t: ['#6 Piotroski F-skoru', '#6 Piotroski F-score', '#6 Puntuación F de Piotroski'],
      b: [[
        '**Soru:** Kimin finansal sağlığı iyileşiyor?',
        '',
        'Piotroski’nin (2000) 9 basit testi: kârlılık, nakit akışı, borç, likidite, hisse ihracı, marj ve varlık devri. Her test 1 ya da 0.',
        '',
        '- **Nasıl okunur:** 7–9 güçlü, 0–3 zayıf. Toplamdan çok hangi testlerin değiştiğine bak.',
        '- **Örnek:** KO, INTC, NUE, TSLA, NVDA (1–8 şirket).',
        '- **Sınır:** eksik veri olan test sayılmaz ve “–” görünür; bankalarda birçok test uygulanamaz.'
      ], [
        '**Question:** Whose financial health is improving?',
        '',
        'Piotroski’s (2000) 9 simple tests: profitability, cash flow, debt, liquidity, share issuance, margin and asset turnover. Each test scores 1 or 0.',
        '',
        '- **How to read it:** 7–9 is strong, 0–3 weak. Look at which tests changed, not only the total.',
        '- **Example:** KO, INTC, NUE, TSLA, NVDA (1–8 companies).',
        '- **Limits:** tests with missing data are not counted and show “–”; many tests do not apply to banks.'
      ], [
        '**Pregunta:** ¿Qué salud financiera está mejorando?',
        '',
        'Las 9 pruebas de Piotroski (2000); cada una vale 1 o 0.',
        '',
        '- **Cómo leerlo:** 7–9 es fuerte, 0–3 débil. Mira qué pruebas cambiaron.',
        '- **Ejemplo:** KO, INTC, NUE, TSLA, NVDA.',
        '- **Límites:** las pruebas sin datos no cuentan; muchas no se aplican a bancos.'
      ]],
      f: ['an_earnings_quality', 'an_credit_altman', 'term_current_ratio'] },

    { id: 'an_event_study', type: 'analysis', analysis: 'event_study', n: 7,
      k: 'bilanço tepkisi|bilanço açıklaması|kazanç açıklaması tepkisi|olay çalışması|event study|earnings reaction|after results|reacción a resultados|estudio de eventos',
      t: ['#7 Bilanço açıklaması etkisi', '#7 Earnings reaction (event study)', '#7 Reacción a resultados (estudio de eventos)'],
      b: [[
        '**Soru:** Sonuçlar açıklandıktan sonra hisse ne yapıyor?',
        '',
        'SEC 8-K “Item 2.02” dosyalarından açıklama tarihlerini bulur ve her açıklamanın etrafındaki günlerde hissenin piyasaya göre fazladan (anormal) getirisini çizer.',
        '',
        '- **Nasıl okunur:** ortalama tepki ve dağılım birlikte önemli; birkaç büyük sürpriz ortalamayı çekebilir.',
        '- **Örnek:** NVDA (tek şirket).',
        '- **Sınır:** kapanıştan sonra açıklanan sonuçlarda tepki ertesi gündür; beklentiyi (analist tahmini) ölçmez.'
      ], [
        '**Question:** What does the stock do after results are published?',
        '',
        'It finds results dates from SEC 8-K “Item 2.02” filings and plots the stock’s extra (abnormal) return versus the market around each one.',
        '',
        '- **How to read it:** the average reaction and the spread matter together; a few big surprises can pull the average.',
        '- **Example:** NVDA (one company).',
        '- **Limits:** results released after the close react the next day; it does not measure expectations (analyst estimates).'
      ], [
        '**Pregunta:** ¿Qué hace la acción tras publicar resultados?',
        '',
        'Toma las fechas de los 8-K “Item 2.02” de la SEC y muestra la rentabilidad anormal frente al mercado alrededor de cada una.',
        '',
        '- **Cómo leerlo:** importan la media y la dispersión.',
        '- **Ejemplo:** NVDA.',
        '- **Límites:** no mide las expectativas de los analistas.'
      ]],
      f: ['an_beta', 'term_sec_docs', 'an_crisis'] },

    { id: 'an_strategy_multi', type: 'analysis', analysis: 'strategy_multi', n: 8,
      k: 'dürüst strateji testi|strateji testi|backtest|geriye dönük test|hareketli ortalama|sma kesişimi|momentum stratejisi|alım satım kuralı|strategy test|honest strategy test|moving average crossover|prueba de estrategia|backtesting',
      t: ['#8 Dürüst strateji testi', '#8 Honest strategy test', '#8 Prueba honesta de estrategia'],
      b: [[
        '**Soru:** Kural birçok hissede işe yarıyor mu, yoksa tek sonuç şans mıydı?',
        '',
        'Bir alım-satım kuralını (SMA kesişimi 15/50 ya da 20 günlük momentum) 10’a kadar hissede, işlem ücreti (5 bps) ve kayma (5 bps) dahil test eder; verinin ilk %70’i “eğitim”, kalanı **test dışı dönem**.',
        '',
        '- **Nasıl okunur:** kuralı **al ve tut** ile test dışı dönemde karşılaştır; çoğu hissede yeniyorsa şans değil. Tek hissedeki parlak sonuç genelde şanstır.',
        '- **Örnek:** AAPL, MSFT, NVDA, KO, JPM, XOM, WMT, PFE, DIS, INTC.',
        '- **Sınır:** geçmiş performans geleceği garanti etmez; vergi ve likidite dahil değil.'
      ], [
        '**Question:** Does the rule work across many stocks, or was one result luck?',
        '',
        'It tests a trading rule (SMA crossover 15/50 or 20-day momentum) on up to 10 stocks, including fees (5 bps) and slippage (5 bps); the first 70% of the data is “training”, the rest is **out-of-sample**.',
        '',
        '- **How to read it:** compare the rule with **buy and hold** out-of-sample; if it wins on most stocks it is not luck. A great result on one stock is usually luck.',
        '- **Example:** AAPL, MSFT, NVDA, KO, JPM, XOM, WMT, PFE, DIS, INTC.',
        '- **Limits:** past performance does not guarantee the future; taxes and liquidity are not included.'
      ], [
        '**Pregunta:** ¿La regla funciona en muchas acciones o fue suerte?',
        '',
        'Prueba una regla (cruce de medias 15/50 o momentum de 20 días) en hasta 10 acciones, con comisiones y deslizamiento; el último 30 % es **fuera de muestra**.',
        '',
        '- **Cómo leerlo:** compárala con **comprar y mantener** fuera de muestra.',
        '- **Ejemplo:** AAPL, MSFT, NVDA, KO, JPM, XOM, WMT, PFE, DIS, INTC.',
        '- **Límites:** el pasado no garantiza el futuro.'
      ]],
      f: ['term_out_of_sample', 'term_buy_hold', 'term_bps'] },

    { id: 'an_portfolio', type: 'analysis', analysis: 'portfolio', n: 9,
      k: 'portföy kurma|portföy nasıl kurulur|portföy oluşturma|portföy ağırlıkları|minimum varyans|çeşitlendirme|60 40|portfolio construction|portfolio mix|diversification|construcción de cartera|diversificación',
      t: ['#9 Portföy kurma', '#9 Portfolio construction', '#9 Construcción de cartera'],
      b: [[
        '**Soru:** Aynı risk için hangi karışım daha çok getiri veriyor?',
        '',
        '2–10 hisseyle eşit ağırlık, minimum varyans gibi karışımları ve 60/40 (SPY + AGG) karşılaştırmasını yapar. Ağırlıklar verinin ilk yarısında belirlenir, ikinci yarıda test edilir.',
        '',
        '- **Nasıl okunur:** test dışı dönemdeki **Sharpe** ve **maksimum düşüşe** bak; sadece toplam getiri yanıltır.',
        '- **Ayar:** risksiz faiz (varsayılan %0).',
        '- **Örnek:** AAPL, MSFT, KO, JNJ, XOM.',
        '- **Sınır:** işlem maliyeti yok; geçmiş korelasyonlar krizde değişebilir.'
      ], [
        '**Question:** Which mix gives more return for the same risk?',
        '',
        'With 2–10 stocks it compares mixes such as equal weight and minimum variance against a 60/40 (SPY + AGG). Weights are fitted on the first half of the data and tested on the second.',
        '',
        '- **How to read it:** look at out-of-sample **Sharpe** and **max drawdown**; total return alone misleads.',
        '- **Setting:** risk-free rate (default 0%).',
        '- **Example:** AAPL, MSFT, KO, JNJ, XOM.',
        '- **Limits:** no trading costs; past correlations can change in a crisis.'
      ], [
        '**Pregunta:** ¿Qué combinación da más rentabilidad con el mismo riesgo?',
        '',
        'Con 2–10 acciones compara peso igual, mínima varianza y un 60/40 (SPY + AGG). Los pesos se ajustan en la primera mitad y se prueban en la segunda.',
        '',
        '- **Cómo leerlo:** mira el **Sharpe** y la **caída máxima** fuera de muestra.',
        '- **Ejemplo:** AAPL, MSFT, KO, JNJ, XOM.',
        '- **Límites:** sin costes de transacción.'
      ]],
      f: ['term_sharpe', 'term_max_drawdown', 'an_crisis'] },

    { id: 'an_turkey_fx', type: 'analysis', analysis: 'turkey_fx', n: 10,
      k: 'kur riski|kur|döviz|türkiye analizi|tl ve dolar getiri|lira dolar|kur betası|dolar bazında getiri|bist analizi|bist 100|thyao|asels|bimas|turkey fx|lira vs dollar|fx beta|turquía|lira frente al dólar',
      t: ['#10 Türkiye: TL ve dolar bazında getiri', '#10 Turkey: lira vs dollar returns', '#10 Turquía: rentabilidad en liras y en dólares'],
      b: [[
        '**Soru:** TL getirisinin ne kadarı dolar bazında kalıyor ve hisse kurla nasıl hareket ediyor?',
        '',
        'BIST kodunu yaz (ör. THYAO; .IS eklemene gerek yok). Fiyatı dolar/TL kuruyla dolara çevirir, BIST 100 ile karşılaştırır ve **kur betasını** hesaplar.',
        '',
        '- **Nasıl okunur:** kur betası 1’e yakınsa hisse dolar gibi davranıyor (ihracatçı/döviz gelirli şirketlerde beklenir); 0’a yakınsa TL’ye bağlı.',
        '- **Ayar:** döviz gelir payı (isteğe bağlı, KAP faaliyet raporundan) – girersen ölçülen betayla uyumlu mu söyler.',
        '- **Örnek:** THYAO, ASELS, BIMAS (1–5 hisse).',
        '- **Sınır:** sadece fiyat verisi; BIST şirketleri SEC’e rapor vermediği için temel analizler çalışmaz.'
      ], [
        '**Question:** How much of the lira return survives in dollars, and how does the stock move with the exchange rate?',
        '',
        'Type a BIST ticker (e.g. THYAO; no need to add .IS). It converts the price into dollars with USD/TRY, compares it with the BIST 100 and computes an **FX beta**.',
        '',
        '- **How to read it:** an FX beta near 1 means the stock behaves like the dollar (expected for exporters); near 0 means it is tied to the lira.',
        '- **Setting:** foreign-currency revenue share (optional, from the KAP annual report) – it checks whether the measured beta is consistent.',
        '- **Example:** THYAO, ASELS, BIMAS (1–5 stocks).',
        '- **Limits:** price data only; BIST companies do not file with the SEC, so fundamental analyses do not work for them.'
      ], [
        '**Pregunta:** ¿Cuánto del rendimiento en liras sobrevive en dólares?',
        '',
        'Escribe un ticker de BIST (p. ej. THYAO). Convierte el precio a dólares con USD/TRY, lo compara con el BIST 100 y calcula la **beta cambiaria**.',
        '',
        '- **Cómo leerlo:** beta cercana a 1 = se comporta como el dólar (exportadores); cercana a 0 = ligada a la lira.',
        '- **Ejemplo:** THYAO, ASELS, BIMAS.',
        '- **Límites:** solo precios; las empresas de BIST no informan a la SEC.'
      ]],
      f: ['faq_bist', 'an_beta', 'faq_data_sources'] },

    { id: 'an_dupont', type: 'analysis', analysis: 'dupont', n: 11,
      k: 'dupont|dupont analizi|özkaynak kârlılığı ayrıştırma|roe ayrıştırma|roe neden yüksek|dupont analysis|roe breakdown|análisis dupont',
      t: ['#11 DuPont analizi', '#11 DuPont analysis', '#11 Análisis DuPont'],
      b: [[
        '**Soru:** Özkaynak kârlılığını (ROE) marj mı, verimlilik mi, borç mu sürüklüyor?',
        '',
        'ROE’yi üç parçaya ayırır: **net marj × varlık devir hızı × kaldıraç** (varlık / özkaynak).',
        '',
        '- **Nasıl okunur:** ROE yüksek ama çoğu kaldıraçtan geliyorsa risk daha büyük; marjdan geliyorsa daha sağlam.',
        '- **Örnek:** AAPL (tek şirket).',
        '- **Sınır:** geri alımlar yüzünden özkaynak çok küçük ya da negatifse ROE anlamsızlaşır; bu yıllar işaretlenir.'
      ], [
        '**Question:** Is return on equity driven by margins, efficiency or debt?',
        '',
        'It splits ROE into three parts: **net margin × asset turnover × leverage** (assets / equity).',
        '',
        '- **How to read it:** a high ROE that comes mostly from leverage is riskier; one that comes from margin is sturdier.',
        '- **Example:** AAPL (one company).',
        '- **Limits:** if buybacks make equity tiny or negative, ROE loses meaning; those years are flagged.'
      ], [
        '**Pregunta:** ¿El ROE viene del margen, de la eficiencia o de la deuda?',
        '',
        'Divide el ROE en **margen neto × rotación de activos × apalancamiento**.',
        '',
        '- **Cómo leerlo:** un ROE alto por apalancamiento es más arriesgado.',
        '- **Ejemplo:** AAPL.',
        '- **Límites:** con patrimonio negativo el ROE pierde sentido.'
      ]],
      f: ['term_roe', 'term_net_margin', 'an_roic_wacc'] },

    { id: 'an_cash_cycle', type: 'analysis', analysis: 'cash_cycle', n: 12,
      k: 'nakit dönüşüm döngüsü|nakit döngüsü|işletme sermayesi|alacak gün|stok gün|dso dio dpo|cash conversion cycle|working capital|cash cycle|ciclo de conversión de efectivo|capital de trabajo',
      t: ['#12 Nakit dönüşüm döngüsü', '#12 Cash conversion cycle', '#12 Ciclo de conversión de efectivo'],
      b: [[
        '**Soru:** Nakit alacaklarda ve stokta kaç gün bağlı kalıyor?',
        '',
        '**Döngü = DSO + DIO − DPO**: müşteriden tahsilat günü + stokta bekleme günü − tedarikçiye ödeme günü.',
        '',
        '- **Nasıl okunur:** kısa (hatta negatif) döngü iyi: şirket, tedarikçiye ödemeden önce müşteriden parayı alıyor (ör. COST).',
        '- **Örnek:** COST, WMT, AAPL (1–5 şirket).',
        '- **Sınır:** bankalarda ve stok tutmayan hizmet şirketlerinde gerekli kalemler yok; sonuç boş kalabilir.'
      ], [
        '**Question:** How long is cash tied up in receivables and inventory?',
        '',
        '**Cycle = DSO + DIO − DPO**: days to collect from customers + days in inventory − days to pay suppliers.',
        '',
        '- **How to read it:** a short (even negative) cycle is good: the company gets paid before it pays its suppliers (e.g. COST).',
        '- **Example:** COST, WMT, AAPL (1–5 companies).',
        '- **Limits:** banks and service companies without inventory lack the items; the result can be blank.'
      ], [
        '**Pregunta:** ¿Cuántos días queda el efectivo atrapado en cobros e inventario?',
        '',
        '**Ciclo = DSO + DIO − DPO**.',
        '',
        '- **Cómo leerlo:** un ciclo corto (o negativo) es bueno (p. ej. COST).',
        '- **Ejemplo:** COST, WMT, AAPL.',
        '- **Límites:** los bancos no tienen estas partidas.'
      ]],
      f: ['faq_banks', 'term_cash_conversion', 'an_earnings_quality'] },

    { id: 'an_capital_allocation', type: 'analysis', analysis: 'capital_allocation', n: 13,
      k: 'sermaye tahsisi|nakit nereye gitti|geri alım|hisse geri alımı|temettü|satın almalar|capital allocation|where did the cash go|buybacks|dividends|asignación de capital|recompras|dividendos',
      t: ['#13 Sermaye tahsisi', '#13 Capital allocation', '#13 Asignación de capital'],
      b: [[
        '**Soru:** Nakit nereye gitti?',
        '',
        'Nakit akış tablosundan yıllar içinde üretilen nakdin yatırıma, satın almalara, **hisse geri alımına**, **temettüye** ve borç ödemesine nasıl dağıldığını gösterir.',
        '',
        '- **Nasıl okunur:** yönetimin önceliğini görürsün: büyümeye mi yatırıyor, hissedara mı dağıtıyor? Geri alımları hisse fiyatıyla birlikte düşün.',
        '- **Örnek:** AAPL.',
        '- **Sınır:** rakamlar ödenen nakittir, açıklanan program değil.'
      ], [
        '**Question:** Where did the cash go?',
        '',
        'From the cash-flow statement it shows how the cash generated over the years was split between investment, acquisitions, **buybacks**, **dividends** and debt repayment.',
        '',
        '- **How to read it:** you see management’s priority: growth or returning cash? Think about buybacks together with the share price.',
        '- **Example:** AAPL.',
        '- **Limits:** figures are cash paid, not announced programmes.'
      ], [
        '**Pregunta:** ¿Adónde fue el efectivo?',
        '',
        'Muestra cómo se repartió el efectivo entre inversión, adquisiciones, **recompras**, **dividendos** y deuda.',
        '',
        '- **Ejemplo:** AAPL.',
        '- **Límites:** son pagos en efectivo, no programas anunciados.'
      ]],
      f: ['term_free_cash_flow', 'term_capex', 'an_roic_wacc'] },

    { id: 'an_roic_wacc', type: 'analysis', analysis: 'roic_wacc', n: 14,
      k: 'roic wacc|roic ve wacc|roic vs wacc|değer yaratıyor mu|değer yaratma|sadece büyüyor mu|value creation|creates value|crea valor|creación de valor',
      t: ['#14 ROIC ve WACC', '#14 ROIC vs WACC', '#14 ROIC frente a WACC'],
      b: [[
        '**Soru:** Şirket değer mi yaratıyor, yoksa sadece büyüyor mu?',
        '',
        '**ROIC** (yatırılan sermayenin getirisi) ile **WACC** (sermaye maliyeti) karşılaştırılır. ROIC > WACC ise her yatırılan dolar maliyetinden fazla kazandırıyor: büyüme değer yaratıyor.',
        '',
        '- **Nasıl okunur:** aradaki farkın (spread) yıllar içindeki yönüne bak.',
        '- **Ayar:** WACC (varsayılan %9) – şirketin riskine göre değiştir.',
        '- **Örnek:** NVDA.',
        '- **Sınır:** NOPAT efektif vergiyle hesaplanır (yoksa %21); bankalarda yatırılan sermaye anlamlı değildir.'
      ], [
        '**Question:** Does the company create value, or just grow?',
        '',
        'It compares **ROIC** (return on invested capital) with **WACC** (the cost of capital). ROIC > WACC means each invested dollar earns more than it costs: growth creates value.',
        '',
        '- **How to read it:** look at the direction of the spread over the years.',
        '- **Setting:** WACC (default 9%) – adjust for the company’s risk.',
        '- **Example:** NVDA.',
        '- **Limits:** NOPAT uses the effective tax rate (21% if missing); invested capital is not meaningful for banks.'
      ], [
        '**Pregunta:** ¿La empresa crea valor o solo crece?',
        '',
        'Compara el **ROIC** con el **WACC**. Si ROIC > WACC, el crecimiento crea valor.',
        '',
        '- **Ajuste:** WACC (9 %).',
        '- **Ejemplo:** NVDA.',
        '- **Límites:** no tiene sentido en bancos.'
      ]],
      f: ['term_roic', 'term_wacc', 'an_dupont'] },

    { id: 'an_comps', type: 'analysis', analysis: 'comps', n: 15,
      k: 'benzer şirket çarpanları|çarpan analizi|çarpanlar|ucuz mu pahalı mı|rakiplerine göre ucuz|f k oranı karşılaştırma|comps|comparable companies|multiples|peer multiples|cheap or expensive|múltiplos|comparables|barato o caro',
      t: ['#15 Çarpan analizi (benzer şirketler)', '#15 Comparable company multiples', '#15 Múltiplos de comparables'],
      b: [[
        '**Soru:** Rakiplerine göre ucuz mu, pahalı mı?',
        '',
        '2–8 şirket için **F/K**, **FD/FAVÖK**, FD/satış gibi çarpanları ve büyüme/marjı yan yana koyar.',
        '',
        '- **Nasıl okunur:** düşük çarpan tek başına “ucuz” demek değil; daha yavaş büyüyor ya da daha riskli olabilir. Çarpanı büyüme ve marjla birlikte yorumla.',
        '- **Örnek:** NVDA, AMD, INTC, AVGO.',
        '- **Sınır:** piyasa değeri son kapanış × hisse sayısı; zarar eden şirkette F/K gösterilmez.'
      ], [
        '**Question:** Is it cheap or expensive relative to its peers?',
        '',
        'For 2–8 companies it lines up multiples such as **P/E**, **EV/EBITDA** and EV/sales next to growth and margins.',
        '',
        '- **How to read it:** a low multiple alone does not mean “cheap”; the company may grow slower or be riskier. Read multiples with growth and margin.',
        '- **Example:** NVDA, AMD, INTC, AVGO.',
        '- **Limits:** market cap = last close × shares; P/E is not shown for loss-makers.'
      ], [
        '**Pregunta:** ¿Es barata o cara frente a sus rivales?',
        '',
        'Para 2–8 empresas compara **PER**, **VE/EBITDA** y VE/ventas junto con crecimiento y márgenes.',
        '',
        '- **Cómo leerlo:** un múltiplo bajo no significa “barato” por sí solo.',
        '- **Ejemplo:** NVDA, AMD, INTC, AVGO.',
        '- **Límites:** el PER no se muestra si hay pérdidas.'
      ]],
      f: ['term_pe', 'term_enterprise_value', 'an_reverse_dcf'] },

    { id: 'an_deal_case', type: 'analysis', analysis: 'deal_case', n: 16,
      k: 'birleşme vakası|birleşme ve satın alma|satın alma analizi|m&a|ma vakası|teklif primi|duyuru tepkisi|activision|merger|acquisition|deal case|takeover premium|fusiones y adquisiciones|prima de adquisición|prim|prim nedir|prim ne demek|satın alma primi|acquisition premium',
      t: ['#16 Birleşme ve satın alma vakası', '#16 M&A case study', '#16 Caso de fusión o adquisición'],
      b: [[
        '**Soru:** Piyasa nasıl tepki verdi, ne kadar prim ödendi ve sonra ne değişti?',
        '',
        'Alıcı şirketin kodu, duyuru tarihi, teklif fiyatı ve hedefin duyuru öncesi fiyatıyla: duyuru günü anormal getiri (SPY’ye göre), **teklif primi** ve öncesi/sonrası 10-K rakamları.',
        '',
        '- **Örnek:** MSFT – Activision (duyuru 2022-01-18, teklif 95 $, önceki kapanış 65,39 $).',
        '- **Borsadan çıkmış hedef:** çoğu tamamlanmış satın almada hedefin fiyatı artık indirilemez; duyuru öncesi kapanışı birleşme bildiriminden (DEFM14A) ya da haberden **elle yaz**.',
        '- **Sınır:** duyuru borsa kapandıktan sonra yapıldıysa ertesi günü gir; hisse bölünmeleri otomatik düzeltilir.'
      ], [
        '**Question:** How did the market react, what premium was paid, and what changed afterwards?',
        '',
        'With the buyer’s ticker, the announcement date, the offer price and the target’s pre-deal price it shows the abnormal return on the day (vs SPY), the **takeover premium** and before/after 10-K figures.',
        '',
        '- **Example:** MSFT – Activision (announced 2022-01-18, offer $95, prior close $65.39).',
        '- **Delisted target:** for most completed deals the target’s price can no longer be downloaded; **type** the pre-announcement close from the merger proxy (DEFM14A) or the news.',
        '- **Limits:** if the deal was announced after the close, enter the next day; stock splits are adjusted automatically.'
      ], [
        '**Pregunta:** ¿Cómo reaccionó el mercado, qué prima se pagó y qué cambió después?',
        '',
        'Con el ticker del comprador, la fecha, el precio de oferta y el precio previo del objetivo calcula la reacción, la **prima** y las cifras del 10-K antes y después.',
        '',
        '- **Ejemplo:** MSFT – Activision (2022-01-18, oferta 95 $, cierre previo 65,39 $).',
        '- **Objetivo excluido de bolsa:** escribe a mano el precio previo (del DEFM14A o de la prensa).'
      ]],
      f: ['faq_delisted', 'term_sec_docs', 'an_event_study'] },

    { id: 'an_credit_altman', type: 'analysis', analysis: 'credit_altman', n: 17,
      k: 'altman z|altman|z skoru|kredi kontrolü|borcunu taşıyabilir mi|iflas riski|borç riski|faiz karşılama|credit check|bankruptcy risk|can it carry its debt|riesgo de quiebra|crédito',
      t: ['#17 Kredi kontrolü ve Altman Z', '#17 Credit check and Altman Z', '#17 Crédito y Z de Altman'],
      b: [[
        '**Soru:** Şirket borcunu taşıyabilir mi?',
        '',
        'Borç/FAVÖK, faiz karşılama, cari oran gibi kredi göstergeleri ve **Altman Z’’** skoru.',
        '',
        '- **Nasıl okunur:** Z’’ > 2,6 güvenli, 1,1–2,6 gri bölge, < 1,1 riskli. Eğilim tek yıldan önemlidir.',
        '- **Örnek:** F (Ford).',
        '- **Sınır:** bankalar ve sigorta şirketleri dönen varlık ya da faaliyet kârı raporlamaz; Altman bu şirketlere **uygulanmaz**. Finansman kolu olan şirketlerde (Ford gibi) borç yüksek görünür.'
      ], [
        '**Question:** Can the company carry its debt?',
        '',
        'Credit indicators such as debt/EBITDA, interest cover and current ratio, plus the **Altman Z’’** score.',
        '',
        '- **How to read it:** Z’’ > 2.6 safe, 1.1–2.6 grey zone, < 1.1 distressed. The trend matters more than one year.',
        '- **Example:** F (Ford).',
        '- **Limits:** banks and insurers do not report current assets or operating income, so Altman **does not apply** to them. Companies with a finance arm (like Ford) look more indebted.'
      ], [
        '**Pregunta:** ¿Puede la empresa soportar su deuda?',
        '',
        'Indicadores de crédito (deuda/EBITDA, cobertura de intereses, liquidez) y la **Z’’ de Altman**.',
        '',
        '- **Cómo leerlo:** > 2,6 segura, 1,1–2,6 zona gris, < 1,1 en riesgo.',
        '- **Ejemplo:** F (Ford).',
        '- **Límites:** no se aplica a bancos ni aseguradoras.'
      ]],
      f: ['faq_banks', 'term_current_ratio', 'an_piotroski'] },

    { id: 'an_beta', type: 'analysis', analysis: 'beta', n: 18,
      k: 'beta|beta nedir|capm|piyasayla ne kadar hareket ediyor|sistematik risk|beklenen getiri|beta and capm|market beta|beta y capm',
      t: ['#18 Beta ve CAPM', '#18 Beta and CAPM', '#18 Beta y CAPM'],
      b: [[
        '**Soru:** Hisse piyasayla ne kadar birlikte hareket ediyor?',
        '',
        '**Beta** = hisse ile piyasa (S&P 500) getirilerinin kovaryansı / piyasa varyansı. Beta 1,5: piyasa %1 oynayınca hisse ortalama %1,5 oynar. **CAPM** beklenen getiri = risksiz faiz + beta × piyasa risk primi.',
        '',
        '- **Ayarlar:** risksiz faiz (%4), piyasa risk primi (%5).',
        '- **Örnek:** NVDA, KO (1–5 hisse; ETF de olur).',
        '- **Sınır:** beta seçilen pencereye göre değişir; tek bir “doğru” beta yoktur. CAPM bir varsayımdır, tahmin değil.'
      ], [
        '**Question:** How much does it move with the market?',
        '',
        '**Beta** = covariance of the stock’s and the market’s (S&P 500) returns / market variance. A beta of 1.5 means the stock moves 1.5% on average when the market moves 1%. **CAPM** expected return = risk-free rate + beta × equity risk premium.',
        '',
        '- **Settings:** risk-free rate (4%), equity risk premium (5%).',
        '- **Example:** NVDA, KO (1–5 tickers; ETFs work too).',
        '- **Limits:** beta depends on the window; there is no single “true” beta. CAPM is an assumption, not a forecast.'
      ], [
        '**Pregunta:** ¿Cuánto se mueve con el mercado?',
        '',
        '**Beta** = covarianza con el mercado / varianza del mercado. Beta 1,5: si el mercado sube 1 %, la acción sube 1,5 % de media. **CAPM** = tasa libre de riesgo + beta × prima de riesgo.',
        '',
        '- **Ejemplo:** NVDA, KO.',
        '- **Límites:** la beta depende de la ventana elegida.'
      ]],
      f: ['term_wacc', 'an_crisis', 'term_volatility'] },

    { id: 'an_crisis', type: 'analysis', analysis: 'crisis', n: 19,
      k: 'kriz analizi|kriz|kriz davranışı|krizde ne oldu|covid düşüşü|2020 çöküşü|2022 düşüşü|toparlanma süresi|ne kadar düştü|crisis behaviour|crisis behavior|crash|recovery time|comportamiento en crisis|recuperación',
      t: ['#19 Kriz davranışı', '#19 Crisis behaviour', '#19 Comportamiento en crisis'],
      b: [[
        '**Soru:** Krizde ne kadar düştü ve ne kadar hızlı toparlandı?',
        '',
        'İki pencereye bakar: 19 Şub – 23 Mar 2020 (COVID) ve 3 Oca – 12 Eki 2022 (faiz şoku). Her hisse için en büyük düşüşü, S&P 500’e göre farkı ve eski seviyeye dönüş süresini gösterir.',
        '',
        '- **Nasıl okunur:** az düşüp hızlı toparlanan “savunmacı” davranır; ama bir sonraki kriz farklı olabilir.',
        '- **Örnek:** AAPL, KO, XOM, JPM (1–8 hisse).',
        '- **Sınır:** sadece fiyat; iki kriz tüm riskleri temsil etmez.'
      ], [
        '**Question:** How hard did it fall in a crisis, and how fast did it recover?',
        '',
        'It looks at two windows: 19 Feb – 23 Mar 2020 (COVID) and 3 Jan – 12 Oct 2022 (rate shock). For each stock it shows the deepest fall, the gap to the S&P 500 and the time to get back.',
        '',
        '- **How to read it:** falling less and recovering fast is “defensive”, but the next crisis may differ.',
        '- **Example:** AAPL, KO, XOM, JPM (1–8 tickers).',
        '- **Limits:** prices only; two crises do not represent every risk.'
      ], [
        '**Pregunta:** ¿Cuánto cayó en una crisis y qué tan rápido se recuperó?',
        '',
        'Dos ventanas: feb–mar 2020 (COVID) y ene–oct 2022. Muestra la caída máxima, la diferencia con el S&P 500 y el tiempo de recuperación.',
        '',
        '- **Ejemplo:** AAPL, KO, XOM, JPM.',
        '- **Límites:** solo precios.'
      ]],
      f: ['term_max_drawdown', 'an_beta', 'an_portfolio'] },

    { id: 'an_uncertainty', type: 'analysis', analysis: 'uncertainty', n: 20,
      k: 'belirsizlik aralığı|belirsizlik aralığı analizi|sonuç aralığı|fiyat aralığı|fiyat ne kadar oynayabilir|fiyat ne kadar değişebilir|bilanço belirsizliği|bilanço günleri belirsizliğe ne katıyor|bilanço günü neden önemli|bilanço günleri neden önemli|bilanço günü ne kadar oynatır|bilanço günü ne kadar oynar|why do earnings days matter|range of outcomes|price range analysis|uncertainty range|rango de resultados',
      t: ['#20 Belirsizlik aralığı (Monte Carlo)', '#20 Range of outcomes (Monte Carlo)', '#20 Rango de resultados (Monte Carlo)'],
      b: [[
        '**Soru:** Önümüzdeki aylarda fiyat ne kadar geniş bir aralıkta oynayabilir, bilanço günleri bu belirsizliğe ne katıyor?',
        '',
        'Hissenin son 3 yılındaki günlük oynaklığıyla bir **rastgele yürüyüş** (geometrik Brown hareketi) kurar ve 10.000 olası yol simüle eder. ABD hisselerinde SEC 8-K bilanço günleri ayrı tutulur ve hissenin kendi geçmiş bilanço tepkilerinden örneklenerek eklenir. Sonuç bir **tahmin değil, bir sonuç aralığıdır**: model hiçbir avantaj varsaymaz (beklenen getiri sıfır).',
        '',
        '- **Nasıl okunur:** %5–%95 bandı “modelin simüle ettiği sonuçların 10’da 9’u bu aralıkta” demektir (gelecekteki fiyat için bir söz değil); ayrıca bugünün altında bitme ve yolda −%20’ye dokunma olasılığı ile belirsizliğin ne kadarının bilanço günlerinden geldiğini gösterir.',
        '- **Ayarlar:** vade 6, 12 veya 24 ay; bilanço günlerini ekle (açık/kapalı). ABD hisselerinde SEC iletişim e-postası gerekir.',
        '- **Örnek:** NVDA (tek hisse; BIST için THYAO.IS — bilanço sıçraması olmadan, TL cinsinden).',
        '- **Sınır:** kalın kuyruklar, oynaklık kümelenmesi ve rejim değişiklikleri modelde yok; gerçek uç hareketler daha sık olabilir. Al/sat önerisi veya fiyat hedefi değildir.'
      ], [
        '**Question:** How wide could the price range be over the coming months, and how much do earnings days add to that uncertainty?',
        '',
        'It builds a **random walk** (geometric Brownian motion) with the stock’s daily volatility over the last 3 years and simulates 10,000 possible paths. For US stocks, SEC 8-K earnings days are kept apart and added back by sampling the stock’s own past earnings reactions. The result is a **range of outcomes, not a forecast**: the model assumes no edge (zero expected return).',
        '',
        '- **How to read it:** the 5%–95% band means “9 in 10 of the model’s simulated outcomes land here” (not a promise about the future price); it also shows the chance of ending below today, of touching −20% on the way, and how much of the uncertainty comes from earnings days.',
        '- **Settings:** horizon 6, 12 or 24 months; include earnings days (on/off). US stocks need the SEC contact email.',
        '- **Example:** NVDA (one stock; for BIST THYAO.IS — without earnings jumps, in lira).',
        '- **Limits:** fat tails, volatility clustering and regime changes are not in the model; real extreme moves can be more frequent. Not a buy/sell recommendation or a price target.'
      ], [
        '**Pregunta:** ¿En qué rango podría moverse el precio en los próximos meses y cuánto añaden los días de resultados?',
        '',
        'Construye un **paseo aleatorio** (movimiento browniano geométrico) con la volatilidad de los últimos 3 años y simula 10.000 trayectorias; en EE. UU. añade los días de resultados (8-K) muestreando las reacciones pasadas de la propia acción. Es un **rango de resultados, no una previsión**.',
        '',
        '- **Ejemplo:** NVDA; THYAO.IS para BIST.',
        '- **Límites:** colas gruesas, agrupamiento de volatilidad y cambios de régimen; no es una recomendación.'
      ]],
      f: ['term_volatility', 'an_event_study', 'an_beta'] },
    { id: 'an_dcf', type: 'analysis', analysis: 'dcf', n: 21,
      k: 'dcf|dcf analizi|dcf ile değerleme|düz dcf|indirgenmiş nakit akışı|nakit akışı değerlemesi|gerçeğe uygun değer|gerçek değer|fair value|intrinsic value|içsel değer|hisse ne kadar eder|hisse başına değer|model değeri|wacc nasıl hesaplanır|wacc hesaplama|terminal değer|gordon|valoración dcf|valor intrínseco',
      t: ['#21 DCF değerlemesi', '#21 DCF valuation', '#21 Valoración DCF'],
      b: [[
        '**Soru:** Kendi varsayımlarımla hisse ne kadar eder, bu sonuç varsayımlara ne kadar duyarlı?',
        '',
        'Klasik **indirgenmiş nakit akışı (DCF)** modelini adım adım gösterir: 5 yıllık serbest nakit akışı (FCFF) tahmini, CAPM ile kurulan iskonto oranı (WACC), Gordon modeliyle terminal değer, firma değerinden borç düşülüp nakit eklenerek özkaynak değeri ve hisse başına **model değeri**. Her satırda **Tür** yazar: Raporlanan (10-K, fiyat), Hesaplanan, Varsayım (senin seçimin) veya Model çıktısı.',
        '',
        '- **Nasıl okunur:** Önce varsayımlar ve WACC tablosuna bak; sonra tahmin tablosu ve değer köprüsü. Duyarlılık tablosu WACC ve terminal büyüme değişince değerin nasıl oynadığını gösterir; tek rakamdan çok bu aralık önemlidir.',
        '- **Ayarlar:** 1. yıl büyüme (boş = geçmiş büyüme), faaliyet marjı (boş = son 3 yıl), terminal büyüme, WACC (boş = CAPM ile hesapla), risksiz faiz, risk primi. Beta, Blume yöntemiyle 1’e doğru düzeltilir.',
        '- **Örnek:** AAPL, MSFT, KO.',
        '- **Sınır:** Bankalar ve sigortacılar için çalışmaz (borç onların hammaddesi); kiralama yükümlülükleri, azınlık payları ve hisse opsiyonları ayrıca düşülmez. Model değeri **hedef fiyat değildir**: fiyatla farkı, piyasanın senden farklı bir şey varsaydığını gösterir; bunu Ters DCF ile sına.'
      ], [
        '**Question:** What is the share worth under my assumptions, and how sensitive is that?',
        '',
        'It shows a classic **discounted cash flow (DCF)** step by step: a 5-year free cash flow (FCFF) forecast, a discount rate (WACC) built from CAPM, a Gordon terminal value, enterprise value minus debt plus cash = equity value, and a **model value** per share. Every row is labelled **Type**: Reported (10-K, price), Calculated, Assumption (your choice) or Model output.',
        '',
        '- **How to read it:** start with the assumptions and the WACC table, then the forecast and the value bridge. The sensitivity table shows how the value moves with WACC and terminal growth; the range matters more than one number.',
        '- **Settings:** year-1 growth (blank = history), operating margin (blank = last 3 years), terminal growth, WACC (blank = build from CAPM), risk-free rate, equity risk premium. Beta is Blume-adjusted toward 1.',
        '- **Example:** AAPL, MSFT, KO.',
        '- **Limits:** not for banks and insurers (debt is their raw material); leases, minority interests and stock options are not deducted separately. The model value is **not a price target**: a gap to the price means the market assumes something different; test it with the Reverse DCF.'
      ], [
        '**Pregunta:** ¿Cuánto vale la acción con mis supuestos y qué tan sensible es?',
        '',
        'Muestra un **DCF** clásico paso a paso: previsión de flujo de caja libre a 5 años, WACC con CAPM, valor terminal de Gordon, del valor de empresa al valor por acción. Cada fila indica si es dato reportado, cálculo, supuesto o resultado del modelo.',
        '',
        '- **Límites:** no sirve para bancos ni aseguradoras; el valor del modelo no es un precio objetivo.'
      ]],
      f: ['an_reverse_dcf', 'an_scenarios', 'an_roic_wacc'] },
    { id: 'an_bank_value', type: 'analysis', analysis: 'bank_value', n: 22,
      k: 'banka değerlemesi|banka nasıl değerlenir|bankayı değerle|sigorta şirketi değerleme|sigortacı|gerekçeli pd/dd|gerekçeli p/b|justified p/b|pd/dd|p/b|fiyat defter|defter değeri|özkaynak kârlılığı|roe|özkaynak maliyeti|cost of equity|temettü indirgeme|ddm|dividend discount|bank valuation|insurer valuation|valoración de bancos|valor contable',
      t: ['#22 Banka ve sigortacı değerlemesi', '#22 Bank and insurer valuation', '#22 Valoración de bancos y aseguradoras'],
      b: [[
        '**Soru:** Bir banka, özkaynağı üzerinde ne kadar kazandığına göre ne kadar eder?',
        '',
        'Bankalarda borç hammadde olduğu için DCF çalışmaz. Bu analiz **gerekçeli P/B** kullanır: (ROE − g) / (özkaynak maliyeti − g). Banka sermaye maliyetinden fazla kazanıyorsa defter değerinin üstünde değer taşır. Yanında **temettü indirgeme modeli** ve ROE × özkaynak maliyeti duyarlılık tablosu verir.',
        '',
        '- **Nasıl okunur:** Önce ROE ile özkaynak maliyeti arasındaki farka bak; sonra gerekçeli ve piyasa P/B’yi karşılaştır. Fark, piyasanın senden farklı bir ROE veya risk varsaydığını gösterir.',
        '- **Ayarlar:** risksiz faiz, risk primi, uzun vadeli büyüme (boş = ROE × kârın dağıtılmayan kısmı, en fazla %4), ROE (boş = son 3 yıl).',
        '- **Örnek:** JPM, BAC, GS.',
        '- **Sınır:** Defter değerinin kalitesi (kredi karşılıkları, menkul kıymet zararları) belirleyicidir; model değeri **hedef fiyat değildir**.'
      ], [
        '**Question:** What is a bank worth given how much it earns on its equity?',
        '',
        'A DCF does not work for banks because debt is their raw material. This analysis uses the **justified P/B**: (ROE − g) / (cost of equity − g). A bank that earns more than its cost of equity is worth more than book. It adds a **dividend discount model** and a cost-of-equity × ROE sensitivity table.',
        '',
        '- **How to read it:** start with the spread between ROE and cost of equity, then compare the justified and market P/B. A gap means the market assumes a different ROE or risk than you.',
        '- **Settings:** risk-free rate, equity risk premium, long-run growth (blank = ROE × retained share of earnings, at most 4%), ROE (blank = last 3 years).',
        '- **Example:** JPM, BAC, GS.',
        '- **Limits:** the quality of book value (loan-loss provisions, securities losses) decides a lot; the model value is **not a price target**.'
      ], [
        '**Pregunta:** ¿Cuánto vale un banco según lo que gana sobre su patrimonio?',
        '',
        'Usa el **P/VC justificado**: (ROE − g) / (coste del capital − g), más un modelo de descuento de dividendos y una tabla de sensibilidad.',
        '',
        '- **Límites:** depende de la calidad del valor contable; no es un precio objetivo.'
      ]],
      f: ['an_dcf', 'an_valuation_summary', 'an_comps'] },
    { id: 'an_implied_move', type: 'analysis', analysis: 'implied_move', n: 23,
      k: 'opsiyonların fiyatladığı hareket|straddle|ima edilen hareket|beklenen hareket|bilanço hareketi|bilançoda ne kadar oynar|bilanço günü|ima edilen oynaklık|implied volatility|implied move|expected move|earnings move|movimiento implícito',
      t: ['#23 Opsiyonların fiyatladığı bilanço hareketi', '#23 Earnings move priced by options', '#23 Movimiento de resultados según las opciones'],
      b: [[
        '**Soru:** Opsiyon piyasası bir sonraki bilanço için ne kadar büyük bir hareket fiyatlıyor, geçmişle kıyaslayınca?',
        '',
        'Bilançodan sonraki ilk vadedeki **paranın başındaki straddle** (alım + satım opsiyonu) fiyatını hisse fiyatına böler: bu, o vadeye kadar beklenen mutlak harekettir. Bilanço öncesi bir vade de varsa **vade yapısından** sadece bilanço gününün hareketini ayırır. Sonra bunu hissenin son bilançolardaki gerçek tepkileriyle (8-K tarihleri) karşılaştırır.',
        '',
        '- **Nasıl okunur:** Piyasa geçmişten büyük bir hareket fiyatlıyorsa belirsizlik yüksek görülüyor demektir. Bu hareketin **büyüklüğüdür, yönü değil**.',
        '- **Örnek:** NVDA, AAPL, JPM (sadece ABD’de listelenmiş opsiyonlar).',
        '- **Sınır:** Yahoo opsiyon fiyatları gecikmelidir; piyasa kapalıyken son işlem fiyatları eski olabilir; alış-satış farkı geniş olabilir. Bilanço uzaktaysa tahmin kabadır. Tahmin veya tavsiye değildir.'
      ], [
        '**Question:** How big a move around the next results is the options market pricing, compared with history?',
        '',
        'It divides the **at-the-money straddle** (call + put) for the first expiry after the results by the share price: the expected absolute move to that expiry. When there is also an expiry before the results it uses the **term structure** to isolate the results-day move, then compares it with the stock’s actual reactions to past results (8-K dates).',
        '',
        '- **How to read it:** a priced move larger than history means the market sees more uncertainty than usual. It is the **size of the move, not its direction**.',
        '- **Example:** NVDA, AAPL, JPM (US-listed options only).',
        '- **Limits:** Yahoo option quotes are delayed; with the market closed last trades can be stale; spreads can be wide. Far from the results date the estimate is rough. Not a forecast or advice.'
      ], [
        '**Pregunta:** ¿Qué movimiento alrededor de los próximos resultados descuentan las opciones, frente a la historia?',
        '',
        'Divide el **straddle at-the-money** del primer vencimiento tras los resultados entre el precio y lo compara con las reacciones pasadas de la acción.',
        '',
        '- **Límites:** cotizaciones con retraso; es el tamaño del movimiento, no su dirección.'
      ]],
      f: ['an_event_study', 'an_uncertainty', 'term_volatility'] },
    { id: 'an_valuation_summary', type: 'analysis', analysis: 'valuation_summary', n: 24,
      k: 'değerleme özeti|football field|football field grafiği|değerleme grafiği|tüm değerlemeler|değerleme aralığı|adil değer aralığı|hangi yöntem|yöntemleri karşılaştır|52 hafta|52 haftalık|valuation summary|valuation range|resumen de valoración|rango de valoración',
      t: ['#24 Değerleme özeti', '#24 Valuation summary', '#24 Resumen de valoración'],
      b: [[
        '**Soru:** Fiyat, bütün değerleme yöntemlerine göre aynı anda nerede duruyor?',
        '',
        'Analistlerin “football field” dediği grafiği çizer: her yöntem için hisse başına bir **değer aralığı** (DCF, senaryolar, bankalarda banka modeli, isteğe bağlı rakip çarpanları ve 52 haftalık işlem aralığı) ve üstünde **son fiyat çizgisi**.',
        '',
        '- **Nasıl okunur:** Aralıkların örtüştüğü bölgeye ve fiyatın kaç yöntemde aralığın içinde, altında veya üstünde kaldığına bak. Yöntemleri tek bir rakamda birleştirmez.',
        '- **Ayarlar:** “Rakipler” kutusuna 3–6 benzer şirket yazarsan F/K ve FD/FAVÖK (bankalarda P/B) aralıkları eklenir.',
        '- **Örnek:** MSFT (rakipler: AAPL, GOOGL, AMZN, META).',
        '- **Sınır:** Her yöntem kendi varsayılan ayarlarıyla çalışır; ayrıntı için ilgili analizi ayrıca çalıştır. **Hedef fiyat değildir.**'
      ], [
        '**Question:** Where does the price sit against every valuation method at once?',
        '',
        'It draws what analysts call a “football field”: a **value range** per share for each method (DCF, scenarios, the bank model for banks, optional peer multiples and the 52-week trading range) with a **latest-price line** across it.',
        '',
        '- **How to read it:** look at where the ranges overlap and in how many methods the price is inside, below or above the range. It does not blend the methods into one number.',
        '- **Settings:** enter 3–6 similar companies under “Peers” to add P/E and EV/EBITDA ranges (P/B for banks).',
        '- **Example:** MSFT (peers: AAPL, GOOGL, AMZN, META).',
        '- **Limits:** each method runs with its own defaults; run that analysis for details. **Not a price target.**'
      ], [
        '**Pregunta:** ¿Dónde está el precio frente a todos los métodos de valoración a la vez?',
        '',
        'Dibuja un gráfico de rangos (“football field”): un rango de valor por acción por método y una línea con el último precio.',
        '',
        '- **Límites:** cada método usa sus supuestos por defecto; no es un precio objetivo.'
      ]],
      f: ['an_dcf', 'an_scenarios', 'an_comps'] },
    { id: 'an_insiders', type: 'analysis', analysis: 'insiders', n: 25,
      k: 'içeriden|içeriden işlemler|içeriden alım|içeriden satış|insider|insider trading|form 4|yönetici alımı|yönetici satışı|ceo hisse sattı|ceo hisse aldı|10b5-1|toplu alım|cluster buying|operaciones de directivos|compras de directivos',
      t: ['#25 İçeriden işlemler (Form 4)', '#25 Insider trading (Form 4)', '#25 Operaciones de directivos (Form 4)'],
      b: [[
        '**Soru:** Yöneticiler ve yönetim kurulu üyeleri kendi hisseleriyle ne yaptı?',
        '',
        'SEC’e verilen her **Form 4** dosyasını okur: kim, ne zaman, kaç hisse, hangi fiyattan. Sadece **açık piyasadan alım (P)** ve **satış (S)** isteğe bağlıdır; hibe, opsiyon kullanımı, vergi için elde tutma ve bağış ayrı gösterilir. **10b5-1 planlı** satışları, **toplu alımları** (30 günde 3+ kişi) ve bilançodan önceki 30 gündeki işlemleri işaretler.',
        '',
        '- **Nasıl okunur:** Alımlar satışlardan daha bilgilendiricidir; satışların çoğu vergi veya çeşitlendirme içindir.',
        '- **Örnek:** NVDA, JPM, AAPL.',
        '- **Sınır:** Sadece doğrudan payı gösterir; çok işlem yapan şirketlerde son 100 dosya okunur. Bir alım-satım sinyali değildir.'
      ], [
        '**Question:** What have directors and executives done with their own shares?',
        '',
        'It reads every **Form 4** filed with the SEC: who, when, how many shares, at what price. Only **open-market purchases (P)** and **sales (S)** are discretionary; grants, option exercises, tax withholding and gifts are shown separately. It flags **10b5-1 plan** sales, **cluster buying** (3+ insiders in 30 days) and trades in the 30 days before results.',
        '',
        '- **How to read it:** purchases say more than sales; most selling is for taxes or diversification.',
        '- **Example:** NVDA, JPM, AAPL.',
        '- **Limits:** direct holdings only; for busy filers the latest 100 filings are read. Not a trading signal.'
      ], [
        '**Pregunta:** ¿Qué han hecho los directivos con sus propias acciones?',
        '',
        'Lee cada **Form 4** de la SEC; solo las compras (P) y ventas (S) en mercado son discrecionales.',
        '',
        '- **Límites:** solo participación directa; no es una señal.'
      ]],
      f: ['an_holders', 'an_event_study', 'an_quarterly'] },
    { id: 'an_holders', type: 'analysis', analysis: 'holders', n: 26,
      k: 'kurumsal sahiplik|kurumsal yatırımcı|fonlar|hangi fonlar|büyük fonlar|13f|ortaklık yapısı|kimler sahip|hissedarlar|institutional ownership|institutional holders|who owns|fund holders|propiedad institucional|fondos',
      t: ['#26 Kurumsal sahiplik (13F)', '#26 Institutional ownership (13F)', '#26 Propiedad institucional (13F)'],
      b: [[
        '**Soru:** Hangi büyük fonlar sahip, geçen çeyrek aldılar mı sattılar mı?',
        '',
        '100 milyon $’dan fazla yöneten kurumlar her çeyrek SEC’e **Form 13F** verir. Bu analiz Yahoo Finance’in bu raporlardan derlediği özeti kullanır: en büyük 10 kurum ve 10 fon, payları ve bir önceki rapora göre değişim. Kaç kurumun artırdığını, azalttığını sayar.',
        '',
        '- **Nasıl okunur:** Endeks fonları (Vanguard, BlackRock) pasif alır; aktif yöneticilerin hareketi daha anlamlıdır.',
        '- **Örnek:** AAPL, MSFT, KO.',
        '- **Sınır:** 13F çeyrek sonundan 45 güne kadar gecikmeli gelir ve sadece uzun pozisyonları gösterir. Sinyal veya tavsiye değildir.'
      ], [
        '**Question:** Which big funds own it, and did they buy or sell last quarter?',
        '',
        'Institutions managing over $100m file **Form 13F** with the SEC every quarter. This uses Yahoo Finance’s summary of those filings: the top 10 institutions and 10 funds, their stakes and the change since the prior filing, and counts how many added or cut.',
        '',
        '- **How to read it:** index funds (Vanguard, BlackRock) buy passively; moves by active managers say more.',
        '- **Example:** AAPL, MSFT, KO.',
        '- **Limits:** 13F arrives up to 45 days after quarter end and shows long positions only. Not a signal or advice.'
      ], [
        '**Pregunta:** ¿Qué grandes fondos la tienen y compraron o vendieron?',
        '',
        'Resumen de los informes **13F** (vía Yahoo Finance): principales titulares y cambio frente al informe anterior.',
        '',
        '- **Límites:** llega con hasta 45 días de retraso.'
      ]],
      f: ['an_insiders', 'an_comps', 'an_quarterly'] },
    { id: 'an_factors', type: 'analysis', analysis: 'factors', n: 28,
      k: 'faktör|faktör analizi|fama french|fama-french|momentum|değer hissesi|büyüme hissesi|kalite faktörü|smb|hml|rmw|cma|alfa|alpha|factor exposure|factor model|ken french|factores',
      t: ['#28 Faktör analizi (Fama–French + momentum)', '#28 Factor exposure (Fama–French + momentum)', '#28 Exposición a factores'],
      b: [[
        '**Soru:** Hisse piyasa, büyüklük, değer, kalite yoksa momentum hissesi mi?',
        '',
        'Hissenin günlük getirisini Kenneth French’in ücretsiz veri kütüphanesindeki altı faktörle karşılaştırır: **piyasa**, **büyüklük** (küçük − büyük), **değer** (ucuz − pahalı), **kârlılık**, **yatırım** ve **momentum**. Her faktör için bir **yük** (ne kadar o faktör gibi davrandığı) ve anlamlılığını (t ≥ 2) verir; faktörlerin açıklamadığı kısım **alfa**dır.',
        '',
        '- **Nasıl okunur:** Değer yükü negatifse hisse büyüme hissesi gibi davranıyor; momentum yükü pozitifse son dönemin kazananları gibi. Alfa genelde sıfırdan ayırt edilemez.',
        '- **Örnek:** NVDA, KO, JPM.',
        '- **Sınır:** Sadece ABD hisseleri; faktör verisi aylık ve gecikmeli güncellenir. Tahmin değildir.'
      ], [
        '**Question:** Is it a market, size, value, quality or momentum stock?',
        '',
        'It regresses the stock’s daily excess return on six factors from Kenneth French’s free data library: **market**, **size**, **value**, **profitability**, **investment** and **momentum**. Each gets a **loading** and a t-statistic; what the factors do not explain is the **alpha**.',
        '',
        '- **How to read it:** a negative value loading means it behaves like a growth stock; a positive momentum loading like a recent winner. Alpha is rarely distinguishable from zero.',
        '- **Example:** NVDA, KO, JPM.',
        '- **Limits:** US stocks only; the factor data are updated monthly with a lag. Not a forecast.'
      ], [
        '**Pregunta:** ¿Es una acción de mercado, tamaño, valor, calidad o momentum?',
        '',
        'Regresión diaria sobre los seis factores de Fama–French y momentum (Kenneth French Data Library).',
        '',
        '- **Límites:** solo EE. UU.; datos con retraso.'
      ]],
      f: ['an_beta', 'an_uncertainty', 'an_insiders'] },
    { id: 'an_ito', type: 'analysis', analysis: 'ito', n: 29,
      k: 'itô|ito|itô lemması|ito lemma|itos lemma|itô analizi|geometrik brown|geometric brownian|gbm|stokastik analiz|stochastic calculus|volatilite sürtünmesi|volatility drag|black scholes|black-scholes|varyans oranı|variance ratio|lema de itô',
      t: ['#29 Brown hareketi ve Itô lemması', '#29 Brownian motion and Itô’s lemma', '#29 Movimiento browniano y lema de Itô'],
      b: [[
        '**Soru:** Hisse ders kitabındaki modele (geometrik Brown hareketi) uyuyor mu, Itô lemması onun için ne öngörüyor?',
        '',
        'Model: **dS = μS dt + σS dW**. **Itô lemması** ln S’ye uygulanınca (dW)² = dt olduğu için fazladan bir terim çıkar: **d ln S = (μ − σ²/2) dt + σ dW**. Yani ortalama getiri ile bileşik getiri arasında **σ²/2** kadar fark olur (**volatilite sürtünmesi**) ve tipik (medyan) yol ortalama yoldan yavaş büyür.',
        '',
        '- **Ne gösterir:** σ ve sürtünme; verideki fark ile Itô’nun tahmini; model fiyat aralığı ve üç örnek yol; 10.000 yolluk simülasyonun formülle karşılaştırması; varsayım testleri (varyans oranı, çarpıklık, kalın kuyruklar, oynaklık kümelenmesi); örneklem dışı test (%90 aralık geçmişte gerçekten %90 tuttu mu?) ve Itô’dan çıkan **Black–Scholes** opsiyon değerleri.',
        '- **Nasıl okunur:** Sürtünme satırları birbirine yakınsa Itô veride görünüyor demektir. "Reddedildi" yazan testler modelin nerede yanıldığını gösterir; çoğu hissede kalın kuyruklar reddedilir.',
        '- **Örnek:** SPY, NVDA, KO, BTC-USD, THYAO.IS.',
        '- **Sınır:** Sabit σ varsayar; sıçramaları ve kriz dönemlerini küçümser. Tahmin değildir, yatırım tavsiyesi değildir.'
      ], [
        '**Question:** Does the stock move like the textbook model (geometric Brownian motion), and what does Itô’s lemma predict for it?',
        '',
        'Model: **dS = μS dt + σS dW**. Applying **Itô’s lemma** to ln S adds a term because (dW)² = dt: **d ln S = (μ − σ²/2) dt + σ dW**. So the average and the compound return differ by **σ²/2** (**volatility drag**) and the typical (median) path grows slower than the average one.',
        '',
        '- **What it shows:** σ and the drag; the gap in the data vs Itô’s prediction; the model price range with three sample paths; a 10,000-path simulation against the formula; assumption tests (variance ratio, skewness, fat tails, volatility clustering); an out-of-sample test (did the 90% range really hold 90% of the time?) and the **Black–Scholes** option values that follow from Itô.',
        '- **How to read it:** if the two drag rows are close, Itô shows up in the data. Tests marked "Rejected" show where the model fails; fat tails are rejected for most stocks.',
        '- **Example:** SPY, NVDA, KO, BTC-USD, THYAO.IS.',
        '- **Limits:** constant σ; it understates jumps and crises. Not a forecast, not investment advice.'
      ], [
        '**Pregunta:** ¿Se mueve la acción como el modelo de manual (movimiento browniano geométrico) y qué predice el lema de Itô?',
        '',
        'Con el lema de Itô, d ln S = (μ − σ²/2) dt + σ dW: la rentabilidad media y la compuesta difieren en σ²/2. Se contrasta con los datos, se prueba fuera de muestra y se derivan precios de Black–Scholes.',
        '',
        '- **Límites:** σ constante; no es una previsión.'
      ]],
      f: ['an_uncertainty', 'an_implied_move', 'an_factors'] },
    { id: 'an_options_lab', type: 'analysis', analysis: 'options_lab', n: 30,
      k: 'opsiyon laboratuvarı|opsiyon masası|black scholes hesaplayıcı|black-scholes hesaplama|opsiyon fiyatlama|opsiyon fiyatı hesapla|greek|greekler|delta gamma vega theta|ima edilen oynaklık gülümsemesi|volatilite gülümsemesi|oynaklık gülümsemesi|heston|stokastik oynaklık|canlı opsiyon|opsiyon zinciri|straddle|strangle|iron condor|covered call|options lab|option pricing|options desk|black scholes calculator|volatility smile|stochastic volatility|option chain|option greeks|laboratorio de opciones|calculadora black scholes|sonrisa de volatilidad',
      t: ['#30 Opsiyon laboratuvarı: Black–Scholes, gülümseme ve stokastik oynaklık (canlı)', '#30 Options lab: Black–Scholes, the smile and stochastic volatility (live)', '#30 Laboratorio de opciones: Black–Scholes, la sonrisa y la volatilidad estocástica (en vivo)'],
      b: [[
        '**Soru:** Bu hissenin opsiyonları şu an nasıl fiyatlanıyor ve bu Black–Scholes’tan ne kadar uzak?',
        '',
        'Analizi seçince bir **opsiyon masası** açılır: hisse kodunu yaz, **Canlı opsiyonları yükle**’ye bas. Hisse fiyatı (Yahoo anlık), opsiyon zinciri (yaklaşık 15 dk gecikmeli), vadeye göre Hazine faizi ve alım–satım paritesinden forward gelir. **Canlı** kutusunu işaretlersen her dakika yenilenir.',
        '',
        '- **Black–Scholes hesaplayıcı:** hisse fiyatı, strike, vade, oynaklık, faiz ve temettü kaydırıcılarıyla fiyat ve **Greek’ler** (delta, gamma, vega, theta, rho) anında değişir. Piyasa orta fiyatı, Amerikan (binom ağacı) değeri ve Monte Carlo kontrolü yan yanadır.',
        '- **Oynaklık gülümsemesi:** her strike’ın ima edilen oynaklığı. Black–Scholes tek oynaklık varsayar (düz çizgi); **Heston stokastik oynaklık modelini uydur** düğmesi gülümsemeyi açıklayan modeli kalibre eder.',
        '- **Vade yapısı, çarpıklık (25-delta), ima edilen − gerçekleşen oynaklık**, bilanço gibi olayların fiyatlandığı pencereler ve **anlık tahmin** (gecikmeli kotasyonun son hisse fiyatına taşınması) canlı yorumda.',
        '- **Getiri ve stratejiler:** tek opsiyon, straddle, strangle, spread’ler, kelebek, iron condor, covered call; vadedeki ve bugünkü kâr/zarar grafiği.',
        '- **Amerikan opsiyonlar:** ABD hisse opsiyonları vadeden önce kullanılabilir. 90 günden uzun satımlarda bu erken kullanım değeri ağaç modeliyle ayrılır; gülümseme, forward ve Heston bu Avrupa eşdeğeri fiyatlarla çalışır, hesaplayıcı ise her kotasyonun kendi fiyatını tutturur.',
        '- **Bu görüntüden araştırma notu oluştur:** o anın rakamlarını kaynaklarıyla yayınlanabilir bir nota çevirir.',
        '- **Örnek:** AAPL, SPY, NVDA, TSLA (ABD’de opsiyonu işlem gören hisseler ve ETF’ler).',
        '- **Sınır:** ücretsiz veri gecikmelidir; NYSE tatilleri ve 13:00 erken kapanışları kurallardan hesaplanır (tek seferlik kapanışlar bilinmez); riske nötr olasılıklar tahmin değildir. Alım-satım önerisi değildir.'
      ], [
        '**Question:** How are this stock’s options priced right now, and how far is that from Black–Scholes?',
        '',
        'Choosing the analysis opens an **options desk**: type a ticker and press **Load live options**. You get the stock price (Yahoo’s current quote), the option chain (delayed about 15 minutes), the Treasury rate for the expiry and the forward from put–call parity. Tick **Live** to refresh every minute.',
        '',
        '- **Black–Scholes calculator:** sliders for stock price, strike, time, volatility, rate and dividend move the price and the **Greeks** (delta, gamma, vega, theta, rho) instantly, next to the market mid, the American (binomial tree) value and a Monte Carlo check.',
        '- **Volatility smile:** each strike’s implied volatility. Black–Scholes assumes one volatility (the flat line); **Fit the Heston stochastic-volatility model** calibrates a model that explains the smile.',
        '- **Term structure, 25-delta skew, implied minus realised volatility**, windows where events such as results are priced, and a **nowcast** (the delayed quote carried to the latest stock price) in the live reading.',
        '- **Payoff and strategies:** single option, straddle, strangle, spreads, butterfly, iron condor, covered call; profit/loss at expiry and today.',
        '- **American options:** US stock options can be exercised before expiry. For puts beyond 90 days that early-exercise value is taken out with the binomial tree; the smile, the forward and Heston use these European-equivalent prices, while the calculator still reprices each quote exactly.',
        '- **Write a research note from this snapshot:** turns the moment’s numbers, with sources, into a publishable note.',
        '- **Example:** AAPL, SPY, NVDA, TSLA (US stocks and ETFs with listed options).',
        '- **Limits:** free data is delayed; NYSE holidays and 13:00 early closes follow the exchange’s rules (one-off closures are not known); risk-neutral probabilities are not forecasts. Not a trading recommendation.'
      ], [
        '**Pregunta:** ¿Cómo se valoran ahora las opciones de esta acción y cuánto se alejan de Black–Scholes?',
        '',
        'Abre una mesa de opciones en vivo: calculadora Black–Scholes con griegas, sonrisa de volatilidad, ajuste del modelo de Heston, estructura temporal y diagramas de estrategias.',
        '',
        '- **Límites:** datos gratuitos con retraso; los festivos de la NYSE y los cierres anticipados a las 13:00 siguen las reglas de la bolsa (los cierres excepcionales no se conocen); las probabilidades neutrales al riesgo no son previsiones. No es una recomendación.'
      ]],
      go: ['Options', 'Analysis Lab'], f: ['an_ito', 'an_implied_move', 'an_uncertainty'] },
    { id: 'an_quarterly', type: 'analysis', analysis: 'quarterly', n: 27,
      k: 'çeyreklik|çeyrek sonuçları|son çeyrek|çeyrek takibi|10-q|bilanço sonuçları|geçen yılın aynı çeyreği|çeyreklik büyüme|quarterly results|latest quarter|quarter over quarter|year over year|resultados trimestrales|último trimestre',
      t: ['#27 Çeyreklik sonuç takibi', '#27 Quarterly results tracker', '#27 Seguimiento de resultados trimestrales'],
      b: [[
        '**Soru:** Son çeyrek, bir önceki çeyreğe ve geçen yıla göre nasıldı?',
        '',
        'Son 10-Q’dan gelir, faaliyet ve net marj, seyreltilmiş HBK, faaliyet nakit akışı ve serbest nakit akışını alır; **önceki çeyrek** ve **geçen yılın aynı çeyreğiyle** tek tabloda karşılaştırır. Son 9 çeyreği ve yıllık büyümenin hızlanıp yavaşladığını da gösterir.',
        '',
        '- **Nasıl okunur:** Mevsimsellik yüzünden geçen yılın aynı çeyreğiyle kıyas genelde daha anlamlıdır.',
        '- **Örnek:** AAPL, KO, NVDA.',
        '- **Sınır:** 4. çeyrek 10-K yılı eksi ilk üç çeyrektir ve işaretlidir; 4. çeyrek HBK’si boş kalır. Nakit akışı yılbaşından bugüne toplamlardan çıkarılır.'
      ], [
        '**Question:** How did the latest quarter compare with the prior quarter and a year ago?',
        '',
        'From the latest 10-Q it takes revenue, operating and net margin, diluted EPS, operating cash flow and free cash flow, and compares them with the **prior quarter** and the **same quarter last year** in one table. It also shows the last 9 quarters and whether year-over-year growth is speeding up or slowing.',
        '',
        '- **How to read it:** because of seasonality the same quarter last year is usually the fairer comparison.',
        '- **Example:** AAPL, KO, NVDA.',
        '- **Limits:** Q4 is the 10-K year minus Q1–Q3 and is marked; Q4 EPS is left blank. Cash flow is derived from year-to-date totals.'
      ], [
        '**Pregunta:** ¿Cómo fue el último trimestre frente al anterior y al de hace un año?',
        '',
        'Compara ingresos, márgenes, BPA y flujo de caja del último 10-Q con el trimestre anterior y el mismo del año pasado.',
        '',
        '- **Límites:** el 4.º trimestre se deriva del 10-K.'
      ]],
      f: ['an_cycle_compare', 'an_earnings_quality', 'an_uncertainty'] },

    /* ───────────────────────────── extra terms (not in glossary.js) ───────────────────────────── */
    { id: 'term_option', type: 'term',
      k: 'opsiyon|opsiyon nedir|opsiyon ne demek|opsiyon sözleşmesi|alım opsiyonu|satım opsiyonu|call opsiyon|put opsiyon|kullanım fiyatı|option|what is an option|option contract|call option|put option|strike price|opción|qué es una opción|opción de compra|opción de venta|precio de ejercicio|opsiyon primi|option premium|prima de la opción',
      t: ['Opsiyon nedir?', 'What is an option?', '¿Qué es una opción?'],
      b: [[
        '**Opsiyon**, bir hisseyi belirli bir **kullanım fiyatından** (strike) belirli bir **vadeye** kadar alma (**alım opsiyonu**, call) ya da satma (**satım opsiyonu**, put) hakkı veren sözleşmedir. Alıcı bu hak için bir **prim** öder ve hakkı kullanmak zorunda değildir; satıcı ise hak kullanılırsa sözleşmenin gereğini yapmak zorundadır.',
        '',
        '- ABD’de listelenen hisse opsiyonları **Amerikan tipidir**: vadeden önce de kullanılabilir. Bir sözleşme genelde 100 hisse içindir.',
        '- Primi hisse fiyatı, kullanım fiyatı, vadeye kalan süre, faiz, temettü ve en çok da beklenen **oynaklık** belirler; **Black–Scholes** formülü bu bağı kurar.',
        '',
        'Gerçek kotasyonlarla denemek için **Opsiyonlar** sekmesini aç. Eğitim amaçlıdır; yatırım tavsiyesi değildir.'
      ], [
        'An **option** is a contract that gives the right to buy (**call**) or sell (**put**) a stock at a set **strike price** until a set **expiry**. The buyer pays a **premium** for that right and does not have to use it; the seller must honour the contract if it is used.',
        '',
        '- US listed stock options are **American**: they can be exercised before expiry. One contract usually covers 100 shares.',
        '- The premium depends on the stock price, the strike, the time to expiry, interest rates, dividends and above all the expected **volatility**; the **Black–Scholes** formula links them.',
        '',
        'Open the **Options** tab to try it with real quotes. Educational; not investment advice.'
      ], [
        'Una **opción** es un contrato que da el derecho a comprar (**call**) o vender (**put**) una acción a un **precio de ejercicio** fijado hasta un **vencimiento**. El comprador paga una **prima** por ese derecho y no está obligado a usarlo; el vendedor debe cumplir si se ejerce.',
        '',
        '- Las opciones sobre acciones cotizadas en EE. UU. son **americanas**: se pueden ejercer antes del vencimiento. Un contrato suele cubrir 100 acciones.',
        '- La prima depende del precio de la acción, el precio de ejercicio, el plazo, los tipos de interés, los dividendos y, sobre todo, la **volatilidad** esperada; la fórmula de **Black–Scholes** las relaciona.',
        '',
        'Abre la pestaña **Opciones** para probarlo con cotizaciones reales. Educativo; no es asesoramiento de inversión.'
      ]],
      go: ['Options'], f: ['page_options', 'an_options_lab', 'an_implied_move'] },

    { id: 'term_roic', type: 'term',
      k: 'roic|roic nedir|yatırılan sermayenin getirisi|return on invested capital|rentabilidad del capital invertido',
      t: ['ROIC nedir?', 'What is ROIC?', '¿Qué es el ROIC?'],
      b: [[
        '**ROIC** (yatırılan sermayenin getirisi) = vergi sonrası faaliyet kârı (NOPAT) / yatırılan sermaye (özkaynak + borç − nakit).',
        '',
        'Şirketin işine koyulan her 100 $’dan yılda kaç dolar kazandığını gösterir. **WACC**’tan yüksekse büyüme değer yaratır.'
      ], [
        '**ROIC** (return on invested capital) = after-tax operating profit (NOPAT) / invested capital (equity + debt − cash).',
        '',
        'It shows how many dollars a year the business earns per $100 put into it. Above **WACC**, growth creates value.'
      ], [
        '**ROIC** = beneficio operativo después de impuestos (NOPAT) / capital invertido (patrimonio + deuda − caja).',
        '',
        'Si supera el **WACC**, el crecimiento crea valor.'
      ]],
      go: ['Analysis Lab'], f: ['an_roic_wacc', 'term_wacc', 'term_roe'] },

    { id: 'term_roe', type: 'term',
      k: 'roe|roe nedir|özkaynak kârlılığı|özsermaye kârlılığı|return on equity|rentabilidad sobre el patrimonio',
      t: ['ROE nedir?', 'What is ROE?', '¿Qué es el ROE?'],
      b: [[
        '**ROE** (özkaynak kârlılığı) = net kâr / ortalama özkaynak. Hissedarların koyduğu her 100 $ için yılda kaç dolar kâr edildiğini gösterir.',
        '',
        'Yüksek ROE borçla da şişirilebilir; nedenini **DuPont analizi** ile ayrıştır.'
      ], [
        '**ROE** (return on equity) = net income / average shareholders’ equity: profit per $100 of shareholders’ money.',
        '',
        'Debt can inflate ROE; split it with the **DuPont analysis**.'
      ], [
        '**ROE** = beneficio neto / patrimonio medio.',
        '',
        'La deuda puede inflarlo; descompónlo con el **análisis DuPont**.'
      ]],
      f: ['an_dupont', 'term_roic', 'term_net_margin'] },

    { id: 'term_pe', type: 'term',
      k: 'f/k|fk|fiyat kazanç oranı|fk oranı|f/k oranı|pe ratio|p/e|price to earnings|fd favök|ev ebitda|çarpan nedir|per|ratio precio beneficio',
      t: ['F/K ve FD/FAVÖK nedir?', 'What are P/E and EV/EBITDA?', '¿Qué son el PER y VE/EBITDA?'],
      b: [[
        '**F/K** (fiyat/kazanç) = piyasa değeri / net kâr. 25 F/K: yatırımcılar bugünkü yıllık kârın 25 katını ödüyor.',
        '',
        '**FD/FAVÖK** = firma değeri / faiz, vergi ve amortisman öncesi kâr; borcu da hesaba kattığı için farklı borç yapısındaki şirketleri karşılaştırmaya daha uygun.',
        '',
        'Çarpanlar tek başına ucuz/pahalı demez: büyüme ve marjla birlikte oku.'
      ], [
        '**P/E** (price/earnings) = market value / net income. A P/E of 25 means investors pay 25 times this year’s profit.',
        '',
        '**EV/EBITDA** = enterprise value / earnings before interest, tax, depreciation and amortisation; because it includes debt, it compares companies with different debt levels better.',
        '',
        'Multiples alone do not say cheap or expensive: read them with growth and margins.'
      ], [
        '**PER** = valor de mercado / beneficio neto. **VE/EBITDA** = valor de empresa / EBITDA; incluye la deuda.',
        '',
        'Un múltiplo solo no dice si algo es barato: léelo con crecimiento y márgenes.'
      ]],
      f: ['an_comps', 'term_enterprise_value', 'term_market_cap'] },

    { id: 'term_market_cap', type: 'term',
      k: 'piyasa değeri|piyasa kapitalizasyonu|market cap|market capitalization|capitalización bursátil',
      t: ['Piyasa değeri nedir?', 'What is market capitalisation?', '¿Qué es la capitalización bursátil?'],
      b: [[
        '**Piyasa değeri** = hisse fiyatı × dolaşımdaki hisse sayısı. QuantEdge son kapanışı ve son 10-K/10-Q’daki hisse sayısını kullanır.',
        '',
        'Borcu içermez; borç ve nakdi de katan ölçü **firma değeri**dir.'
      ], [
        '**Market capitalisation** = share price × shares outstanding. QuantEdge uses the last close and the share count from the latest 10-K/10-Q.',
        '',
        'It excludes debt; **enterprise value** adds debt and subtracts cash.'
      ], [
        '**Capitalización** = precio × acciones en circulación. No incluye la deuda; el **valor de empresa** sí.'
      ]],
      f: ['term_enterprise_value', 'term_pe', 'term_diluted_shares'] },

    { id: 'term_volatility', type: 'term',
      k: 'oynaklık|volatilite|standart sapma|risk nedir|volatility|standard deviation|volatilidad',
      t: ['Oynaklık (volatilite) nedir?', 'What is volatility?', '¿Qué es la volatilidad?'],
      b: [[
        '**Oynaklık**, getirilerin ortalamadan ne kadar saptığıdır (yıllıklaştırılmış standart sapma). %30 oynaklık: tipik bir yılda fiyat ±%30 civarında dalgalanabilir.',
        '',
        'Sharpe oranının paydasıdır. Düşüşün derinliğini görmek için **maksimum düşüşe** de bak.'
      ], [
        '**Volatility** is how much returns swing around their average (annualised standard deviation). 30% volatility means a typical year can swing about ±30%.',
        '',
        'It is the denominator of the Sharpe ratio. Also look at **max drawdown** for the depth of falls.'
      ], [
        '**Volatilidad**: cuánto oscilan los rendimientos (desviación típica anualizada). Es el denominador del Sharpe.'
      ]],
      f: ['term_sharpe', 'term_max_drawdown', 'an_beta'] },

    { id: 'term_sec_docs', type: 'term',
      k: 'sec nedir|sec raporları|8-k|8k|xbrl|edgar|companyfacts|sec filing|sec filings|what is the sec|qué es la sec|10-k 10-q 8-k',
      t: ['SEC, 10-K, 10-Q, 8-K ve XBRL nedir?', 'What are the SEC, 10-K, 10-Q, 8-K and XBRL?', '¿Qué son la SEC, el 10-K, el 10-Q, el 8-K y XBRL?'],
      b: [[
        '**SEC**, ABD’nin sermaye piyasası düzenleyicisi. Halka açık şirketler raporlarını SEC’in EDGAR sistemine yükler:',
        '',
        '- **10-K** – yıllık rapor (denetlenmiş tablolar, iş kolları, riskler).',
        '- **10-Q** – çeyreklik rapor (ilk üç çeyrek; 4. çeyrek “yıllık − ilk üç çeyrek” olarak hesaplanır).',
        '- **8-K** – önemli olay bildirimi; “Item 2.02” sonuç açıklamasıdır.',
        '- **XBRL** – rakamların makinenin okuyabileceği etiketli hali. QuantEdge rakamları SEC’in XBRL “companyfacts” verisinden alır ve her rakamın hangi 10-K’dan geldiğini linkler.'
      ], [
        'The **SEC** is the US securities regulator. Listed companies file their reports on its EDGAR system:',
        '',
        '- **10-K** – annual report (audited statements, segments, risks).',
        '- **10-Q** – quarterly report (first three quarters; Q4 is computed as “annual − first three quarters”).',
        '- **8-K** – material event notice; “Item 2.02” is a results release.',
        '- **XBRL** – the machine-readable, tagged version of the figures. QuantEdge reads SEC XBRL “companyfacts” and links each figure to the 10-K it came from.'
      ], [
        'La **SEC** es el regulador bursátil de EE. UU.:',
        '',
        '- **10-K** – informe anual. **10-Q** – trimestral. **8-K** – hechos relevantes.',
        '- **XBRL** – cifras etiquetadas legibles por máquina; QuantEdge las lee de “companyfacts” y enlaza cada cifra con su 10-K.'
      ]],
      f: ['faq_data_sources', 'faq_companies', 'faq_sec_email'] },

    /* ───────────────────────────── FAQs ───────────────────────────── */
    { id: 'term_vix', type: 'term',
      k: 'vix|vix nedir|vix ne demek|korku endeksi|vix nasıl hesaplanır|vix hesaplama|vix kartı|what is the vix|fear index|how is the vix computed|qué es el vix|índice del miedo',
      t: ['VIX nedir?', 'What is the VIX?', '¿Qué es el VIX?'],
      b: [[
        '**VIX**, S&P 500 opsiyonlarının fiyatlarından çıkan, önümüzdeki **30 gün** için yıllık beklenen oynaklıktır; piyasada “korku endeksi” diye de bilinir. 20 civarı sakin, 30’un üstü gergin bir piyasa demektir. Tahmin değildir: opsiyon fiyatlarının içindeki beklentidir.',
        '',
        '- Cboe onu, 30 günü çevreleyen iki vadedeki **paranın dışındaki** bütün opsiyonların fiyatlarını ΔK/K² ağırlığıyla toplayarak hesaplar; tek bir modele dayanmaz.',
        '- **Opsiyonlar** sekmesindeki **VIX’i kendim hesapladım** kartı aynı formülü SPY opsiyonlarıyla uygular ve resmî endeksin yanına koyar; farkın nedenleri (SPY Amerikan tipi, gecikmeli kotasyonlar) kartta yazar.',
        '',
        'Eğitim amaçlıdır; yatırım tavsiyesi değildir.'
      ], [
        'The **VIX** is the annualised volatility expected over the next **30 days**, read from S&P 500 option prices; it is often called the “fear index”. Around 20 means a calm market, above 30 a nervous one. It is not a forecast: it is the expectation priced into options.',
        '',
        '- The Cboe computes it by adding up the prices of all **out-of-the-money** options of the two expiries around 30 days, each weighted by ΔK/K²; it relies on no single model.',
        '- The **I computed the VIX myself** card in the **Options** tab runs the same formula on SPY options and puts it next to the official index; the reasons for the gap (SPY options are American, quotes are delayed) are on the card.',
        '',
        'Educational; not investment advice.'
      ], [
        'El **VIX** es la volatilidad anualizada esperada para los próximos **30 días**, extraída de los precios de las opciones del S&P 500 (el “índice del miedo”). La tarjeta **Calculé el VIX yo mismo** de la pestaña **Opciones** aplica la misma fórmula a las opciones de SPY y la compara con el índice oficial. No es asesoramiento de inversión.'
      ]],
      go: ['Options'], f: ['faq_desk_cards', 'page_options', 'term_option'] },

    { id: 'faq_desk_cards', type: 'faq', page: 'Options',
      k: 'model karnesi|model karnesi nedir|oynaklık yüzeyi|volatilite yüzeyi|senaryo tablosu|oynaklık çöküşü|bilanço sonrası oynaklık|oynaklık kayması|model report card|volatility surface|scenario grid|volatility crush|vol crush|boletín del modelo|superficie de volatilidad|tabla de escenarios|caída de volatilidad',
      t: ['Model karnesi, oynaklık yüzeyi ve senaryo tablosu ne gösterir?', 'What do the model report card, the volatility surface and the scenario grid show?', '¿Qué muestran el boletín del modelo, la superficie de volatilidad y la tabla de escenarios?'],
      b: [[
        '**Opsiyonlar** sekmesindeki üç kart:',
        '',
        '- **Model karnesi:** verinin ve modellerin ne kadar güvenilir olduğunu söyler: alım–satım paritesi alış-satış aralığı içinde mi, tek bir Black–Scholes oynaklığı gülümsemeden ne kadar uzak, Heston ne kadar daha iyi, hangi kotasyonlar neden dışarıda kaldı, veri kaç dakikalık. Hissenin değil, girdilerin kontrolüdür.',
        '- **Oynaklık yüzeyi:** her satır bir vadenin gülümsemesi, her sütun forward’a oranla bir kullanım fiyatı. Yukarıdan aşağı okuyunca vade yapısını görürsün. Kotasyon olmayan yere tahmin yazılmaz (·).',
        '- **Senaryo tablosu:** seçtiğin stratejinin kâr/zararı, hisse hareketine (sütunlar) ve oynaklık kaymasına (satırlar) göre. Vadeden önce bilanço varsa **Bilanço sonrası oynaklık çöküşü** düğmesi, vade yapısından tahmin edilen düşüşü gösterir.',
        '',
        'Eğitim amaçlıdır; işlem önerisi değildir.'
      ], [
        'Three cards in the **Options** tab:',
        '',
        '- **Model report card:** how far the data and the models can be trusted: does put–call parity hold within the bid–ask spreads, how far one Black–Scholes volatility is from the smile, how much better Heston does, which quotes were left out and why, how old the data is. It checks the inputs, not the stock.',
        '- **Volatility surface:** each row is one expiry’s smile, each column a strike as a share of the forward; reading down a column gives the term structure. Nothing is written where there is no quote (·).',
        '- **Scenario grid:** the profit or loss of your strategy for stock moves (columns) and volatility shifts (rows). When results fall before the expiry, **Volatility crush after the results** shows the drop the term structure implies.',
        '',
        'Educational; not a trade idea.'
      ], [
        'Tres tarjetas de la pestaña **Opciones**: el **boletín del modelo** (paridad put–call, error de una sola volatilidad y de Heston, cotizaciones excluidas y antigüedad de los datos), la **superficie de volatilidad** (una sonrisa por vencimiento) y la **tabla de escenarios** (beneficio o pérdida según el movimiento de la acción y de la volatilidad, con la caída de volatilidad tras los resultados). Educativo; no es una idea de inversión.'
      ]],
      go: ['Options'], f: ['term_vix', 'page_options', 'an_options_lab'] },

    { id: 'faq_built', type: 'faq',
      k: 'nasıl yapıldı|nasıl geliştirildi|quantedge nasıl yapıldı|kim yaptı|hangi teknolojiler|teknoloji yığını|mimari|nasıl yaptım|how was it built|how was quantedge built|who built it|tech stack|architecture|cómo se hizo|cómo se construyó|arquitectura',
      t: ['QuantEdge nasıl yapıldı?', 'How was QuantEdge built?', '¿Cómo se hizo QuantEdge?'],
      b: [[
        'Hakkımızda sayfasındaki **Nasıl yaptım** bölümü bunu anlatıyor:',
        '',
        '- **Mimari:** tarayıcıdaki sayfa (React 16) yalnızca bu bilgisayardaki yerel API ile (Python, FastAPI) konuşur; notlar, anahtarlar ve önbellek data/ içinde kalır.',
        '- **Doğrulama:** Hull’un ders kitabı örneği, tarayıcı ile sunucunun 216 durumda karşılaştırılması, VIX formülünün Heston modeliyle testi ve 800’den fazla otomatik test.',
        '- **Yapay zekâ:** QuantEdge bir yapay zekâ kodlama asistanıyla (Claude) birlikte geliştirildi; her değişiklik testlerden ve bağımsız incelemelerden geçti.'
      ], [
        'The **How I built it** section on the About page explains it:',
        '',
        '- **Architecture:** the browser page (React 16) talks only to a local API on this computer (Python, FastAPI); notes, keys and caches stay in data/.',
        '- **Checks:** Hull’s textbook example, the browser checked against the server on 216 cases, the VIX formula tested on a Heston model and more than 800 automated tests.',
        '- **AI:** QuantEdge was built together with an AI coding assistant (Claude); every change passed the tests and independent reviews.'
      ], [
        'La sección **Cómo lo hice** de la página Acerca de lo explica: la página del navegador (React 16) solo habla con una API local (Python, FastAPI); las cifras se comprueban con más de 800 pruebas automáticas; QuantEdge se desarrolló junto con un asistente de programación con IA (Claude).'
      ]],
      go: ['About'], f: ['faq_ai', 'faq_privacy', 'page_options'] },

    { id: 'faq_menu', type: 'faq',
      k: 'sekme|sekmeler|hangi sekmeler var|menü|menüde neler var|hangi sayfalar var|tabs|which tabs|menu|what is in the menu|which pages are there|pestañas|qué pestañas hay|menú|qué hay en el menú|qué páginas hay',
      t: ['Menüde hangi sekmeler var?', 'What is in the menu?', '¿Qué hay en el menú?'],
      b: [[
        'Menüdeki sekmeler, soldan sağa:',
        '',
        '1. **Ana sayfa:** yayınladıkların ve sıradaki adım.',
        '2. **Analiz Laboratuvarı:** 30 analiz; her biri tek bir soruyu SEC raporları ve geçmiş fiyatlarla yanıtlar.',
        '3. **Opsiyonlar:** canlı opsiyon laboratuvarı (Black–Scholes, Heston); yanındaki rozet ABD seansını gösterir.',
        '4. **Sitem:** seçtiğin analizlerden herkese açık, ücretsiz bir web sitesi.',
        '5. **LinkedIn:** tezinden ve resmî rakamlardan paylaşım metni.',
        '6. **Raporlar:** araştırma raporu yazma ve taslak indirme.',
        '7. **Kütüphane:** bu bilgisayarda kayıtlı tüm araştırma adımların.',
        '8. **Rehber:** adım adım, kaynaklı bir araştırma projesi.',
        '9. **Hakkımızda:** QuantEdge ne yapar, ne yapamaz, verilerin nereye gider.',
        '',
        'Bir sayfayı hızlıca açmak için **Cmd/Ctrl+K** ile komut paletini aç ve adını yaz.'
      ], [
        'The tabs in the menu, from left to right:',
        '',
        '1. **Home:** what you have published and the next step.',
        '2. **Analysis Lab:** 30 analyses; each answers one question with SEC filings and historical prices.',
        '3. **Options:** the live options lab (Black–Scholes, Heston); its badge shows the US market session.',
        '4. **Public Site:** a free public website made of the analyses you choose.',
        '5. **LinkedIn:** post text built from your thesis and official figures.',
        '6. **Reports:** write a research report and download drafts.',
        '7. **Library:** every research step, saved on this computer.',
        '8. **Guide:** a step-by-step, source-based research project.',
        '9. **About:** what QuantEdge does and cannot do, and where your data goes.',
        '',
        'To open a page quickly, press **Cmd/Ctrl+K** and type its name.'
      ], [
        'Las pestañas del menú, de izquierda a derecha:',
        '',
        '1. **Inicio:** lo que has publicado y el siguiente paso.',
        '2. **Laboratorio de análisis:** 30 análisis; cada uno responde una pregunta con documentos de la SEC y precios históricos.',
        '3. **Opciones:** el laboratorio de opciones en vivo (Black–Scholes, Heston); su insignia muestra la sesión del mercado de EE. UU.',
        '4. **Mi sitio:** una web pública y gratuita con los análisis que elijas.',
        '5. **LinkedIn:** texto para publicar a partir de tu tesis y de cifras oficiales.',
        '6. **Informes:** escribe un informe de análisis y descarga borradores.',
        '7. **Biblioteca:** todos tus pasos de análisis, guardados en este ordenador.',
        '8. **Guía:** un proyecto de análisis con fuentes, paso a paso.',
        '9. **Acerca de:** qué hace QuantEdge, qué no puede hacer y adónde van tus datos.',
        '',
        'Para abrir una página rápido, pulsa **Cmd/Ctrl+K** y escribe su nombre.'
      ]],
      go: ['Analysis Lab', 'Options'], f: ['page_options', 'page_lab', 'faq_first_steps'] },

    { id: 'faq_first_steps', type: 'faq',
      k: 'ilk ne yapmalıyım|ilk ne yapmalı|ilk adım|nereden başlayayım|ödev|ödev yapıyorum|proje ödevi|nereden başlamalıyım|nereden başlarım|ilk analizim|ilk adım|ne yapmalıyım|nasıl başlarım|yeni başladım|ilk kez kullanıyorum|where do i start|getting started|first analysis|first steps|por dónde empiezo|primeros pasos',
      t: ['Nereden başlamalıyım?', 'Where should I start?', '¿Por dónde empiezo?'],
      b: [[
        'İlk notun için en kısa yol:',
        '',
        '1. **Analiz Laboratuvarı**’nı aç ve kolay bir analiz seç (ör. **#11 DuPont** ya da **#2 Kazanç kalitesi**).',
        '2. **Örneği kullan**’a bas, SEC e-postanı yaz, **Analizi çalıştır**.',
        '3. Öne çıkanları ve **Yöntem ve sınırlar**’ı oku; anlamadığın terimde **?** işaretine dokun ya da bana sor.',
        '4. “Ben ne düşünüyorum” ve “Neden yanılıyor olabilirim” kutularını kendi cümlelerinle doldur.',
        '5. LinkedIn taslağını kopyala ya da **Siteme ekle**.',
        '',
        'Şirket araştırmasında tamamen yeniysen önce **Rehber**’i dene.'
      ], [
        'The shortest path to your first note:',
        '',
        '1. Open the **Analysis Lab** and pick an easy analysis (e.g. **#11 DuPont** or **#2 Earnings quality**).',
        '2. Press **Use the example**, enter your SEC email, then **Run analysis**.',
        '3. Read the findings and **Method and limits**; tap the **?** next to a term or ask me.',
        '4. Fill “What I think” and “Why I might be wrong” in your own words.',
        '5. Copy the LinkedIn draft or **Add to my public site**.',
        '',
        'Completely new to company research? Try the **Guide** first.'
      ], [
        'El camino más corto a tu primera nota:',
        '',
        '1. Abre el **Laboratorio** y elige un análisis sencillo (p. ej. **#11 DuPont**).',
        '2. Pulsa **Usar el ejemplo**, escribe tu email para la SEC y **Ejecuta**.',
        '3. Lee los hallazgos y **Método y límites**.',
        '4. Escribe tu opinión y por qué podrías equivocarte.',
        '5. Copia el texto de LinkedIn o **Añade a mi sitio**.'
      ]],
      go: ['Analysis Lab', 'Guide'], f: ['page_lab', 'faq_thesis_required', 'an_dupont'] },

    { id: 'faq_companies', type: 'faq',
      k: 'hangi şirketleri analiz edebilirim|hangi şirket|neleri analiz edebilirim|etf|etf analizi|spy|qqq|fon|neyi analiz edemez|sınırlar|what can quantedge not analyse|what can it not analyze|limitations|qué no puede analizar|hangi şirketler|hangi şirketler çalışır|hangi hisseler|her şirket çalışır mı|şirket listesi|şirket bulunamadı|şirket ekleme|which companies|which stocks work|supported companies|qué empresas|empresas compatibles',
      t: ['Hangi şirketler çalışır?', 'Which companies work?', '¿Qué empresas funcionan?'],
      b: [[
        '- **Çalışır:** SEC’e **10-K** veren her ABD şirketi (10.000’den fazla). Kodu ya da adı yaz (“TSLA”, “coca”).',
        '- **Yabancı şirketler (20-F/40-F, ör. TSMC, Alibaba, ASML):** Analiz Laboratuvarı’nda çalışır; IFRS rakamları okunur ve dolara çevrilir. Hisse başına değerler için ADR oranını (bir ADR kaç hisse) sen girersin. Rehber, LinkedIn ve Raporlar sayfaları yalnızca 10-K okur.',
        '- **Kısmen:** bankalar ve sigortacılar – Altman Z ve nakit döngüsü için gereken kalemler yok; faaliyet kârı raporlamayan şirketlerde (ör. Pfizer, J&J) marj “—” görünür. Rakam uydurulmaz.',
        '- **BIST (Türk) hisseleri:** sadece **#10 Türkiye** ve fiyat analizlerinde (beta, kriz, portföy, strateji testi).',
        '- **ETF ve endeksler** (SPY, QQQ): sadece fiyat analizlerinde.',
        '- **XOM:** SEC listesi şu an bu kodu geçmişi olmayan yeni bir holdinge bağlıyor; SEC verisi isteyen analizlerde boş kalabilir, fiyat analizlerinde çalışır.'
      ], [
        '- **Works:** any US company that files a **10-K** with the SEC (over 10,000). Type the ticker or name (“TSLA”, “coca”).',
        '- **Foreign companies (20-F/40-F, e.g. TSMC, Alibaba, ASML):** work in the Analysis Lab; IFRS figures are read and converted to US dollars. Per-share values need the ADR ratio (ordinary shares per ADR), which you enter. The Guide, LinkedIn and Reports pages read 10-K reports only.',
        '- **Partly:** banks and insurers – the items for Altman Z and the cash cycle are missing; companies that do not report operating income (e.g. Pfizer, J&J) show “—” for margin. Nothing is invented.',
        '- **BIST (Turkish) stocks:** only in **#10 Turkey** and the price analyses (beta, crisis, portfolio, strategy test).',
        '- **ETFs and indices** (SPY, QQQ): price analyses only.',
        '- **XOM:** the SEC list currently maps this ticker to a new holding company with no history; SEC-based analyses can come back empty, price analyses work.'
      ], [
        '- **Funciona:** cualquier empresa de EE. UU. que presente un **10-K** (más de 10.000).',
        '- **Empresas extranjeras (20-F/40-F, TSMC, Alibaba):** funcionan en el Laboratorio de análisis (IFRS, convertidas a dólares; los valores por acción necesitan el ratio del ADR). Guía, LinkedIn e Informes solo leen 10-K.',
        '- **Parcialmente:** bancos y aseguradoras (faltan partidas para Altman y el ciclo de caja).',
        '- **BIST:** solo en **#10 Turquía** y los análisis de precios.',
        '- **XOM:** la SEC asocia hoy el ticker a un holding nuevo sin historial; los análisis de precios funcionan.'
      ]],
      go: ['Analysis Lab'], f: ['faq_20f', 'faq_banks', 'faq_bist'] },

    { id: 'faq_20f', type: 'faq',
      k: 'alibaba hata|alibaba çalışmıyor|tsmc hata|baba|tm|20-f|20f|40-f|yabancı şirketler|abd dışı şirketler|tsmc|alibaba|asml|toyota|avrupa şirketleri|foreign companies|non us companies|empresas extranjeras',
      t: ['Yabancı (20-F veren) şirketler çalışır mı?', 'Do foreign (20-F) companies work?', '¿Funcionan las empresas extranjeras (20-F)?'],
      b: [[
        'ABD dışındaki şirketler SEC’e 10-K yerine **20-F** (Kanada: **40-F**) verir ve rakamlarını çoğunlukla **IFRS** etiketleriyle raporlar.',
        '',
        '- **Analiz Laboratuvarı:** çalışır. IFRS ve US-GAAP rakamları okunur; başka para birimindeki tutarlar her mali yıl sonundaki FRED kuruyla dolara çevrilir ve sonuçta bu yazılır.',
        '- **ADR:** hisse başına değerler için bir ADR’nin kaç hisseye denk geldiğini (**ADR oranı**, ör. Alibaba: 8) sen girersin; girmezsen 1 varsayılır ve uyarı çıkar.',
        '- **Rehber, LinkedIn ve Raporlar** sayfaları yalnızca 10-K okur; bu şirketlerde sebebi ekranda yazar.',
        '',
        'Fiyat analizleri (beta, kriz, portföy, strateji testi) ABD borsasındaki kodlarıyla (ör. TSM) her yerde çalışır.'
      ], [
        'Non-US companies file a **20-F** (Canada: **40-F**) instead of a 10-K, mostly with **IFRS** tags.',
        '',
        '- **Analysis Lab:** works. IFRS and US-GAAP figures are read; amounts in another currency are converted to US dollars at the FRED rate of each fiscal year end, and the result says so.',
        '- **ADR:** per-share values need the number of ordinary shares per ADR (the **ADR ratio**, e.g. Alibaba: 8), which you enter; without it the app assumes 1 and warns.',
        '- The **Guide, LinkedIn and Reports** pages read 10-K reports only; for these companies the screen tells you why.',
        '',
        'Price analyses (beta, crisis, portfolio, strategy test) work everywhere with the US ticker (e.g. TSM).'
      ], [
        'Las empresas extranjeras presentan un **20-F** (Canadá: **40-F**), sobre todo con etiquetas **IFRS**. En el **Laboratorio de análisis** funcionan: las cifras se leen y se convierten a dólares, y los valores por acción necesitan el ratio del ADR (p. ej. Alibaba: 8). Guía, LinkedIn e Informes solo leen 10-K. Los análisis de precios funcionan en todas partes (p. ej. TSM).'
      ]],
      f: ['faq_companies', 'faq_bist', 'term_sec_docs'] },

    { id: 'faq_banks', type: 'faq',
      k: 'bankalar|banka hisseleri|jpm|sigorta şirketleri|bankada altman|banka neden çalışmıyor|banks|bank stocks|insurers|bancos|aseguradoras',
      t: ['Bankalar neden bazı analizlerde çalışmıyor?', 'Why do banks fail in some analyses?', '¿Por qué los bancos fallan en algunos análisis?'],
      b: [[
        'Bankalar ve sigorta şirketleri bilançolarını farklı raporlar: **dönen varlık**, **stok**, **satılan malın maliyeti** ya da **faaliyet kârı** kalemleri yoktur.',
        '',
        '- **Altman Z** ve **nakit dönüşüm döngüsü** bu yüzden uygulanmaz.',
        '- ROIC, marj ve Piotroski’nin bazı testleri boş (“—”) kalabilir.',
        '- Fiyat analizleri (beta, kriz, portföy) bankalarda sorunsuz çalışır (ör. JPM).',
        '',
        'QuantEdge eksik rakamı tahmin etmez; boş kalır ve nedeni yazılır.'
      ], [
        'Banks and insurers report differently: there are no **current assets**, **inventory**, **cost of goods sold** or **operating income** items.',
        '',
        '- **Altman Z** and the **cash conversion cycle** therefore do not apply.',
        '- ROIC, margins and some Piotroski tests can be blank (“—”).',
        '- Price analyses (beta, crisis, portfolio) work fine for banks (e.g. JPM).',
        '',
        'QuantEdge never guesses a missing figure; it stays blank with the reason.'
      ], [
        'Los bancos no reportan activo corriente, inventario ni beneficio operativo: **Altman Z** y el **ciclo de caja** no se aplican. Los análisis de precios sí funcionan (p. ej. JPM).'
      ]],
      f: ['an_credit_altman', 'an_cash_cycle', 'faq_companies'] },

    { id: 'faq_bist', type: 'faq',
      k: 'türk şirketleri|türk şirketleri çalışır mı|türk hisseleri|bist|borsa istanbul|türkiye hisseleri|thy|aselsan|bim|.is|turkish companies|turkish stocks|empresas turcas|bolsa de estambul',
      t: ['Türk (BIST) şirketleri çalışır mı?', 'Do Turkish (BIST) companies work?', '¿Funcionan las empresas turcas (BIST)?'],
      b: [[
        '**Kısmen.** BIST şirketleri SEC’e rapor vermez, bu yüzden SEC verisi isteyen analizler (DuPont, ters DCF, segmentler…) çalışmaz.',
        '',
        '- **#10 Türkiye: TL ve dolar bazında getiri** – BIST kodunu yaz (THYAO, ASELS, BIMAS); dolar/TL kuru ve BIST 100 ile karşılaştırır.',
        '- **Fiyat analizleri** – beta, kriz davranışı, portföy, strateji testi: kodun sonuna **.IS** ekle (ör. THYAO.IS).',
        '',
        'Bilanço rakamları için KAP’taki faaliyet raporlarını kaynak olarak kullanabilirsin.'
      ], [
        '**Partly.** BIST companies do not file with the SEC, so SEC-based analyses (DuPont, reverse DCF, segments…) do not work.',
        '',
        '- **#10 Turkey: lira vs dollar returns** – type the BIST ticker (THYAO, ASELS, BIMAS); it compares with USD/TRY and the BIST 100.',
        '- **Price analyses** – beta, crisis, portfolio, strategy test: add **.IS** to the ticker (e.g. THYAO.IS).',
        '',
        'For financial statements, use the annual reports on KAP as your source.'
      ], [
        '**En parte.** Las empresas de BIST no informan a la SEC.',
        '',
        '- **#10 Turquía** – escribe el ticker (THYAO).',
        '- **Análisis de precios** – añade **.IS** (THYAO.IS).'
      ]],
      go: ['Analysis Lab'], f: ['an_turkey_fx', 'faq_companies', 'an_beta'] },

    { id: 'faq_xom', type: 'faq',
      k: 'xom|exxon|exxonmobil|xom çalışmıyor|xom hata|xom boş|xom no funciona',
      t: ['XOM (Exxon) neden boş geliyor?', 'Why is XOM (Exxon) empty?', '¿Por qué XOM (Exxon) sale vacío?'],
      b: [[
        'SEC’in kod listesi **XOM** kodunu şu an geçmiş raporu olmayan **yeni bir holding şirketine** bağlıyor. Bu yüzden SEC verisi isteyen analizler (DuPont, ROIC, Piotroski…) XOM için boş kalabilir ya da hata verebilir.',
        '',
        'Fiyat analizleri (beta, kriz, portföy, strateji testi) XOM ile çalışır. Enerji sektörü için temel analizde başka bir 10-K veren şirket dene (ör. CVX).'
      ], [
        'The SEC ticker list currently maps **XOM** to a **new holding company with no filing history**. SEC-based analyses (DuPont, ROIC, Piotroski…) can therefore be empty or fail for XOM.',
        '',
        'Price analyses (beta, crisis, portfolio, strategy test) work with XOM. For energy fundamentals try another 10-K filer (e.g. CVX).'
      ], [
        'La lista de la SEC asocia hoy **XOM** a un **holding nuevo sin historial**; los análisis con datos de la SEC pueden salir vacíos. Los de precios funcionan. Prueba CVX para fundamentales.'
      ]],
      f: ['faq_companies', 'faq_no_data', 'an_crisis'] },

    { id: 'faq_first_run', type: 'faq',
      k: 'ne kadar sürer|how long does it take|how long|cuánto tarda|ilk çalıştırma yavaş|çok yavaş|uzun sürüyor|yükleniyor|bekliyor|takıldı|donuyor|analiz bitmiyor|slow|taking long|loading forever|first run|stuck|lento|tarda mucho',
      t: ['Analiz neden uzun sürüyor?', 'Why is the analysis slow?', '¿Por qué tarda el análisis?'],
      b: [[
        'İlk çalıştırmada SEC raporları ve fiyat geçmişi internetten indirilir; bu **yaklaşık 1 dakika** sürebilir. Veriler bilgisayarına kaydedilir, sonraki çalıştırmalar çok daha hızlıdır.',
        '',
        '- 10 hisseli testlerde (strateji, portföy) bekleme daha uzundur.',
        '- 2–3 dakikadan uzun sürerse internet bağlantını ve sunucunun açık olduğu Terminal penceresindeki hata mesajını kontrol et.'
      ], [
        'The first run downloads SEC filings and price history; this can take **about a minute**. The data is saved on your computer, so later runs are much faster.',
        '',
        '- Tests with 10 tickers (strategy, portfolio) take longer.',
        '- If it takes more than 2–3 minutes, check your internet connection and the error message in the Terminal window running the server.'
      ], [
        'La primera vez se descargan los informes de la SEC y los precios: **cerca de un minuto**. Después se guarda en tu ordenador y va más rápido.'
      ]],
      f: ['faq_internet', 'faq_sec_email', 'faq_no_data'] },

    { id: 'faq_sec_email', type: 'faq',
      k: 'sec e-posta|sec email|e-posta neden|email neden istiyor|iletişim e-postası|sec iletişim|user agent|why email|sec contact email|correo para la sec|por qué email',
      t: ['SEC neden e-posta istiyor?', 'Why does it ask for an SEC contact email?', '¿Por qué pide un email para la SEC?'],
      b: [[
        'SEC, verilerini indiren her programın kendini tanıtmasını ister: istekler bir **iletişim e-postası** içermelidir (SEC’in “fair access” kuralı). E-postasız istekler engellenebilir.',
        '',
        '- E-posta sadece SEC’e giden isteklerin başlığına yazılır; QuantEdge onu başka bir yere göndermez, sana mail atılmaz.',
        '- Daha önce indirilmiş şirketler e-postasız da açılır.',
        '- E-posta kaydedilmez: sayfayı yenileyince yeni bir şirket için tekrar yazman gerekir.',
        '- Okul ya da kişisel e-postan yeterli.'
      ], [
        'The SEC asks every program that downloads its data to identify itself: requests must include a **contact email** (the SEC “fair access” rule). Requests without one can be blocked.',
        '',
        '- The email is only put in the header of requests to the SEC; QuantEdge sends it nowhere else and nobody emails you.',
        '- Companies downloaded before open without an email.',
        '- The email is not saved: after a page reload, type it again for a new company.',
        '- Your school or personal email is fine.'
      ], [
        'La SEC exige que los programas que descargan sus datos incluyan un **email de contacto**. Solo se envía a la SEC en la cabecera de la petición; QuantEdge no lo usa para nada más.'
      ]],
      f: ['faq_privacy', 'faq_first_run', 'term_sec_docs'] },

    { id: 'faq_publish', type: 'faq', page: 'Analysis Lab',
      k: 'nasıl yayınlarım|nasıl yayınlıyorum|yayınlamak istiyorum|yayınla|yayınlamak|yayınlama|yayınlıyorum|yayınlarım|yayımla|yayımlamak|nasıl paylaşırım|paylaşıyorum|paylaşmak|post atmak|post at|post atarım|post nasıl atarım|analizimi paylaş|analizi yayınla|publish|how do i publish|how to publish|share my analysis|publicar|cómo publico|compartir mi análisis',
      t: ['Analizimi nasıl yayınlarım?', 'How do I publish my analysis?', '¿Cómo publico mi análisis?'],
      b: [[
        'Yayınlama her zaman **Analiz Laboratuvarı**’nda başlar:',
        '',
        '1. Bir analiz seç, şirket kodunu yaz ve **Analizi çalıştır**.',
        '2. Sonucun altındaki yayınlama bölümünde **Ben ne düşünüyorum** (en az **80** karakter) ve **Neden yanılıyor olabilirim** (en az **60** karakter) kutularını doldur.',
        '3. İkisi dolunca dört çıktı açılır: **LinkedIn taslağı** (**LinkedIn için kopyala**), **Kaydırmalı gönderi (carousel)** PDF’i, **PNG indir** görseli ve **Siteme ekle**.',
        '4. LinkedIn’de paylaşmak için metni yapıştır; kendi sitende göstermek için **Sitem** sayfasından siteyi indirip GitHub Pages’e yükle.',
        '',
        'QuantEdge senin yerine hiçbir yere paylaşım yapmaz; neyi nerede yayınlayacağına sen karar verirsin.'
      ], [
        'Publishing always starts in the **Analysis Lab**:',
        '',
        '1. Pick an analysis, type the ticker and **Run analysis**.',
        '2. Below the result, fill **What I think** (at least **80** characters) and **Why I might be wrong** (at least **60**).',
        '3. Then four outputs unlock: the **LinkedIn draft** (**Copy for LinkedIn**), the **carousel** PDF, the **Download PNG** image and **Add to my public site**.',
        '4. Paste the text on LinkedIn; to show it on your own site, download the site on **My public site** and upload it to GitHub Pages.',
        '',
        'QuantEdge never posts anywhere for you; you decide what goes where.'
      ], [
        'Se publica siempre desde el **Laboratorio de análisis**:',
        '',
        '1. Elige un análisis, escribe el ticker y ejecútalo.',
        '2. Rellena **Lo que pienso** (mín. **80** caracteres) y **Por qué podría equivocarme** (mín. **60**).',
        '3. Se desbloquean cuatro salidas: borrador de LinkedIn, carrusel PDF, imagen PNG y **Añadir a mi sitio**.',
        '4. Pega el texto en LinkedIn o sube tu sitio a GitHub Pages desde **Mi sitio**.'
      ]],
      go: ['Analysis Lab', 'Public Site'], f: ['faq_linkedin_post', 'faq_carousel', 'faq_site_publish'] },

    { id: 'faq_free', type: 'faq', page: 'About',
      k: 'ücretli mi|ücretsiz mi|bedava mı|para veriyor muyum|para ödemem gerekiyor mu|para ödeyecek miyim|fiyatı ne|abonelik|lisans|is it free|does it cost|how much does it cost|subscription|es gratis|gratis|cuánto cuesta|suscripción',
      t: ['QuantEdge ücretli mi?', 'Is QuantEdge free?', '¿QuantEdge es gratis?'],
      b: [[
        'Hayır, ücret yok. QuantEdge kendi bilgisayarında çalışır: abonelik, hesap ya da API anahtarı istemez.',
        '',
        '- Veriler ücretsiz kaynaklardan gelir: SEC EDGAR ve Yahoo Finance.',
        '- Siteni yayınlamak için kullanılan **GitHub Pages** de ücretsizdir.',
        '- Bu yardım asistanı da ücretsiz ve internetsiz çalışır.'
      ], [
        'No, there are no fees. QuantEdge runs on your computer and needs no subscription, account or API key.',
        '',
        '- The data comes from free sources: SEC EDGAR and Yahoo Finance.',
        '- **GitHub Pages**, used to put your site online, is free too.',
        '- This help assistant is free and works offline.'
      ], [
        'Sí, es gratis: sin suscripción, cuenta ni clave de API. Los datos vienen de fuentes gratuitas (SEC EDGAR, Yahoo Finance) y **GitHub Pages** también es gratis.'
      ]],
      go: ['About'], f: ['faq_privacy', 'faq_data_sources', 'faq_site_publish'] },

    { id: 'faq_thesis_required', type: 'faq',
      k: 'buton açılmıyor|buton gri|butonlar gri|siteme ekle yok|siteme ekle gri|siteye ekle butonu yok|siteme ekle açılmıyor|kilitli|linkedin taslağı çıkmıyor|carousel çıkmıyor|png açılmıyor|button disabled|button greyed out|botón desactivado|neden tez zorunlu|tez ve risk neden|ben ne düşünüyorum|neden yanılıyor olabilirim|80 karakter|60 karakter|yayınla butonu kilitli|yayınlama açılmıyor|linkedin taslağı kilitli|karşı görüş|why thesis required|unlock publishing|publish button disabled|por qué la tesis|desbloquear publicación',
      t: ['Tez ve riskleri yazmak neden zorunlu?', 'Why are the thesis and risks required?', '¿Por qué son obligatorias la tesis y los riesgos?'],
      b: [[
        'Yayınlama bölümünde iki kutu var: **Ben ne düşünüyorum** (en az **80** karakter) ve **Neden yanılıyor olabilirim** (en az **60** karakter). İkisi dolmadan LinkedIn taslağı, carousel, PNG ve **Siteme ekle** açılmaz.',
        '',
        'Sebep: bir gönderi, **senin görüşünü** ve **nerede yanılabileceğini** söylediğinde senindir. Veri görüşünü destekler; sadece rakam yığını bir analiz değildir. Karşı görüşü yazmak okuyucuya dürüst olduğunu gösterir ve profesyonel analistlerin de yaptığı şeydir.',
        '',
        'İpucu: tezini test edilebilir yaz (“3 yıl içinde bulut payı %50’yi geçerse…”). Yazdıkların aynı analiz ve kodlar için tarayıcıda saklanır.'
      ], [
        'The publish section has two boxes: **What I think** (at least **80** characters) and **Why I might be wrong** (at least **60**). Until both are filled, the LinkedIn draft, carousel, PNG and **Add to my public site** stay locked.',
        '',
        'Why: a post is yours when it says **what you think** and **where you could be wrong**. Data supports your view; a pile of numbers is not an analysis. Writing the counterargument shows readers you are honest, and it is what professional analysts do.',
        '',
        'Tip: make the thesis testable (“if cloud passes 50% of revenue within 3 years…”). Your text is kept in the browser for the same analysis and tickers.'
      ], [
        'Hay dos cuadros: **Lo que pienso** (mín. **80** caracteres) y **Por qué podría equivocarme** (mín. **60**). Sin ellos no se desbloquean LinkedIn, carrusel, PNG ni **Añadir a mi sitio**.',
        '',
        'Una publicación es tuya cuando dice qué piensas y dónde podrías fallar; los datos solo la apoyan.'
      ]],
      go: ['Analysis Lab'], f: ['faq_overclaim', 'faq_linkedin_post', 'faq_carousel'] },

    { id: 'faq_overclaim', type: 'faq',
      k: 'abartı uyarısı|aşırı iddia|kesinlikle uyarısı|garanti uyarısı|ifadeni kontrol et|paylaşmadan önce ifadelerine bak|sarı uyarı|hemen alın|overclaim|wording warning|check your wording|advertencia de exageración',
      t: ['“Paylaşmadan önce ifadelerine bak” uyarısı nedir?', 'What is the “check your wording” warning?', '¿Qué es el aviso de “revisa tu redacción”?'],
      b: [[
        'Tezinde “kesinlikle”, “garanti”, “hemen alın”, “hedef fiyat”, “asla düşmez” gibi abartılı ifadeler yazarsan QuantEdge seni uyarır ve daha dengeli bir ifade önerir.',
        '',
        '- Uyarı bir **yazım ipucudur**, görüşün hakkında yargı değildir; paylaşmanı **engellemez**.',
        '- Neden önemli: kesin iddialar güvenilirliğini düşürür ve yatırım tavsiyesi gibi okunabilir. “Bence”, “veriler … gösteriyor”, “şu olursa yanılırım” gibi ifadeler daha profesyonel durur.'
      ], [
        'If your thesis says things like “definitely”, “guaranteed”, “buy now”, “price target” or “can’t go down”, QuantEdge warns you and suggests more balanced wording.',
        '',
        '- It is a **wording hint**, not a judgement of your view, and it **does not block** posting.',
        '- Why it matters: absolute claims hurt your credibility and can read like investment advice. “I think”, “the data shows…”, “I am wrong if…” sound more professional.'
      ], [
        'Si escribes “seguro”, “garantizado”, “compra ya” o “precio objetivo”, QuantEdge te avisa y sugiere una redacción más equilibrada. Es una pista, no bloquea la publicación.'
      ]],
      f: ['faq_thesis_required', 'faq_advice', 'faq_linkedin_post'] },

    /* ───────────── explicit view: stance vs benchmark, risk matrix, kill criteria, review date ───────────── */
    { id: 'faq_call_view', type: 'faq', page: 'Analysis Lab',
      k: 'açık görüş|açık görüş nedir|olumlu nötr olumsuz ne demek|görüş kutusu|olumlu nötr olumsuz|olumlu mu olumsuz mu|endekse göre olumlu|s&p 500 e göre olumlu|bist 100 e göre|kıyaslama endeksi|kıyaslama endeksi nedir|benchmark nedir|göreli görüş|görüş seçimi|vade seçimi|6 12 24 ay|explicit view|stance|relative view|positive neutral negative|benchmark|vs s&p 500|opinión explícita|frente al s&p 500|índice de referencia',
      t: ['Açık görüş (olumlu / nötr / olumsuz) nedir?', 'What is an explicit view (positive / neutral / negative)?', '¿Qué es una opinión explícita (positiva / neutral / negativa)?'],
      b: [[
        'Yayınlarken istersen tezini **ölçülebilir bir görüşe** çevirebilirsin. Bu isteğe bağlıdır; seçmezsen analiz eskisi gibi yayınlanır.',
        '',
        '- **Görüş:** şirketin bir **kıyaslama endeksine göre** daha iyi, benzer ya da daha zayıf olacağını düşünüyorsun: **olumlu / nötr / olumsuz**. Örnek: “S&P 500’e göre olumlu”, “BIST 100’e göre olumsuz”.',
        '- **Kıyaslama endeksi:** S&P 500 (SPY), Nasdaq 100 (QQQ), BIST 100 (XU100.IS) veya MSCI World (URTH). Borsa İstanbul hisselerinde varsayılan BIST 100, diğerlerinde S&P 500’dür.',
        '- **Vade:** 6, 12 veya 24 ay. Yayın tarihine eklenir ve **değerlendirme tarihi** olur.',
        '- **Kanıt metriği** (önerilir) ve **risk matrisi** ile **vazgeçme kriterleri**.',
        '',
        'Yayın günü şirketin ve endeksin kapanış fiyatı otomatik kaydedilir, böylece sonradan dürüstçe karşılaştırabilirsin. Görüş **göreli bir beklentidir**; “al” ya da “sat” demek değildir ve hedef fiyat içermez.',
        '',
        'Sitende her görüşün yanında şu not yer alır: “Bu bir yatırım tavsiyesi değildir; öğrenci çalışmasıdır. Görüş, kıyaslama endeksine göre göreli bir beklentidir.”'
      ], [
        'When you publish you can turn your thesis into a **measurable view**. It is optional; without it the analysis is published as before.',
        '',
        '- **Stance:** you expect the company to do better than, about the same as, or worse than a **benchmark index**: **positive / neutral / negative**, e.g. “Positive vs S&P 500”.',
        '- **Benchmark:** S&P 500 (SPY), Nasdaq 100 (QQQ), BIST 100 (XU100.IS) or MSCI World (URTH). Borsa Istanbul stocks default to BIST 100, everything else to the S&P 500.',
        '- **Horizon:** 6, 12 or 24 months, added to the publish date to give the **review date**.',
        '- A **thesis metric** (recommended), a **risk matrix** and **kill criteria**.',
        '',
        'The closing prices of the company and the index on publication day are recorded automatically, so you can compare honestly later. The view is a **relative expectation**: it does not say “buy” or “sell” and has no price target.',
        '',
        'Every view on your site carries the note: “This is not investment advice; it is student work. The view is a relative expectation against the benchmark index.”'
      ], [
        'Al publicar puedes convertir tu tesis en una **opinión medible** (opcional).',
        '',
        '- **Opinión:** positiva, neutral o negativa **frente a un índice de referencia** (S&P 500, Nasdaq 100, BIST 100 o MSCI World), p. ej. “Positiva frente al S&P 500”.',
        '- **Horizonte:** 6, 12 o 24 meses; da la **fecha de revisión**.',
        '- Una **métrica de la tesis**, una **matriz de riesgos** y **criterios de abandono**.',
        '',
        'Se guardan los precios de cierre del día de publicación. Es una expectativa relativa, no una recomendación de compra o venta, y no lleva precio objetivo.'
      ]],
      go: ['Analysis Lab', 'Public Site'], f: ['faq_call_metric', 'faq_call_kill', 'faq_call_no_rating'] },

    { id: 'faq_call_kill', type: 'faq', page: 'Analysis Lab',
      k: 'vazgeçme kriteri|vazgeçme kriterleri|vazgeçme kriteri nedir|vazgeçme kriterim|vazgeçme kriterlerim|vazgeçme kriteri nasıl yazılır|vazgeçme koşulu|vazgeçme koşulları|görüşten vazgeçme|görüşümden ne zaman vazgeçerim|kill criteria|kill criterion|kill kriteri|kill nedir|şu olursa yanılırım|bu görüşten vazgeçerim|i drop the view if|i drop this view if|when am i wrong|stop loss for my thesis|en az bir vazgeçme koşulu|criterios de abandono|abandono esta opinión',
      t: ['Vazgeçme kriteri nedir, nasıl yazılır?', 'What are kill criteria and how do I write them?', '¿Qué son los criterios de abandono?'],
      b: [[
        '**Vazgeçme kriteri**, “Şu olursa görüşümden vazgeçerim” cümlesinin devamıdır. Görüşünün **yanlışlanabilir** olmasını sağlar: neyin seni ikna edeceğini baştan, sonuçları görmeden yazarsın.',
        '',
        'Açık görüş yayınlarken **en az bir** riskin vazgeçme kriteri olmalı (en fazla 160 karakter).',
        '',
        'İyi bir vazgeçme kriteri:',
        '- **Gözlemlenebilir:** bir rakam, bir tarih, bir olay (“iki çeyrek üst üste faaliyet marjı %40’ın altına inerse”).',
        '- **Riske bağlı:** risk matrisindeki bir riskin gerçekleştiğini gösterir.',
        '- **Fiyata değil, işe dayanır:** “hisse düşerse” değil, “bulut büyümesi %20’nin altına inerse”.',
        '- **Al/sat kararı değildir:** “Hisse 300 dolara inerse satarım” gibi bir cümle yatırım kararıdır; Laboratuvar bunu kabul etmez ve şirketin bir göstergesini ister.',
        '',
        'Zayıf örnek: “Şirket kötü giderse.” Güçlü örnek: “FY2027 serbest nakit akışı 50 milyar $’ın altında kalırsa.”',
        '',
        'Değerlendirme tarihi geldiğinde **Haklı çıktım mı?** bölümünde bu kriterlere bakarak dürüst kararını yaz.'
      ], [
        'A **kill criterion** completes the sentence “I drop this view if…”. It makes your view **falsifiable**: you write down, before seeing the outcome, what would change your mind.',
        '',
        'An explicit view needs **at least one** risk with a kill criterion (up to 160 characters).',
        '',
        'A good kill criterion is:',
        '- **Observable:** a number, a date or an event (“operating margin below 40% for two quarters in a row”).',
        '- **Tied to a risk:** it shows that a risk in your risk matrix has happened.',
        '- **About the business, not the price:** not “if the stock falls” but “if cloud growth drops below 20%”.',
        '- **Not a trade:** “I sell if the stock falls to $300” is an investment decision; the Lab does not accept it and asks for a company figure instead.',
        '',
        'Weak: “If the company does badly.” Strong: “If FY2027 free cash flow stays below $50B.”',
        '',
        'When the review date comes, use these criteria to write an honest verdict in **Was I right?**.'
      ], [
        'Un **criterio de abandono** completa la frase “Abandono esta opinión si…”. Hace que tu opinión sea **refutable**.',
        '',
        'Una opinión explícita necesita **al menos uno** (máx. 160 caracteres). Que sea observable (una cifra, una fecha), ligado a un riesgo y sobre el negocio, no sobre el precio: “si el margen operativo baja del 40 % dos trimestres seguidos”.'
      ]],
      go: ['Analysis Lab'], f: ['faq_call_matrix', 'faq_call_review', 'faq_call_view'] },

    { id: 'faq_call_matrix', type: 'faq', page: 'Analysis Lab',
      k: 'risk matrisi|risk matrisi nedir|olasılık ve etki|olasılık etki|olasılık düşük orta yüksek|etki düşük orta yüksek|riskleri nasıl sıralarım|risk sayısı|en fazla altı risk|risk listesi|risk matrix|probability and impact|probability impact grid|how many risks|matriz de riesgos|probabilidad e impacto',
      t: ['Risk matrisi nasıl doldurulur?', 'How do I fill in the risk matrix?', '¿Cómo se rellena la matriz de riesgos?'],
      b: [[
        'Risk matrisi, tezine yönelik riskleri **olasılık** ve **etkiye** göre (düşük / orta / yüksek) 3×3 bir tabloya yerleştirir. Profesyonel araştırma raporlarındaki (ör. CFA Research Challenge) “Riskler” bölümünün kısa hâlidir.',
        '',
        '1. **1–6 risk** yaz; her biri 10–200 karakter. Genel değil, **bu şirkete özgü** olsun (“yapay zekâ yatırımları gelirden hızlı büyür”).',
        '2. Her risk için **olasılık**: bu vadede olma ihtimali. **Etki**: olursa tezini ne kadar bozar.',
        '3. En az bir riske **vazgeçme kriteri** ekle.',
        '',
        'Sitende matris renkli bir tablo olarak görünür: sağ üst köşe (yüksek olasılık, yüksek etki) en çok izlemen gereken risktir. Serbest metin **Neden yanılıyor olabilirim** bölümü de yerinde kalır.',
        '',
        'İpucu: hepsini “yüksek” işaretlemek de, hepsini “düşük” işaretlemek de inandırıcı değildir. Dürüst bir dağılım okuyucuya düşündüğünü gösterir.'
      ], [
        'The risk matrix places the risks to your thesis on a 3×3 grid of **probability** and **impact** (low / medium / high). It is a short form of the Risks section in professional research reports (e.g. the CFA Research Challenge).',
        '',
        '1. Write **1–6 risks**, 10–200 characters each, **specific to this company** (“AI capex grows faster than revenue”).',
        '2. For each: **probability** that it happens within the horizon, and **impact** on your thesis if it does.',
        '3. Give at least one risk a **kill criterion**.',
        '',
        'On your site the matrix is a coloured grid: the top-right corner (high probability, high impact) is the risk to watch most. The free-text **Why I might be wrong** section stays as well.',
        '',
        'Tip: marking everything “high”, or everything “low”, is not convincing. An honest spread shows readers you thought about it.'
      ], [
        'La matriz coloca tus riesgos en una cuadrícula 3×3 de **probabilidad** e **impacto** (bajo / medio / alto).',
        '',
        'Escribe de 1 a 6 riesgos específicos de la empresa (10–200 caracteres), elige probabilidad e impacto y añade al menos un **criterio de abandono**. La esquina superior derecha es el riesgo a vigilar.'
      ]],
      go: ['Analysis Lab'], f: ['faq_call_kill', 'faq_call_view', 'faq_thesis_required'] },

    { id: 'faq_call_review', type: 'faq', page: 'Public Site',
      k: 'değerlendirme tarihi|gözden geçirme|gözden geçirme tarihi|gözden geçirme tarihi nedir|gözden geçirme ne demek|gözden geçirme zamanı geldi|zamanı geldi ne demek|değerlendirme tarihi nedir|değerlendirme tarihi gelen|değerlendirme zamanı|ne zaman değerlendirmeliyim|vade dolunca|vadesi dolan görüşler|yayın günü fiyatı|yayın günü fiyatları|fiyat alınamadı|yayın anında fiyat alınamadı|review date|review due|reviews due|publication day price|price unavailable at publish time|fecha de revisión|revisiones pendientes',
      t: ['Değerlendirme tarihi ve yayın günü fiyatları ne işe yarar?', 'What are the review date and the publication-day prices for?', '¿Para qué sirven la fecha de revisión y los precios del día de publicación?'],
      b: [[
        '**Değerlendirme tarihi** = yayın tarihi + seçtiğin vade (6, 12 veya 24 ay). Ayın son günü kayarsa o ayın son gününe çekilir (31 Ocak + 1 ay = 28 Şubat).',
        '',
        '- Yayınladığın anda QuantEdge şirketin ve kıyaslama endeksinin **son kapanış fiyatını** (düzeltilmiş) tarihiyle kaydeder. Bu kayıt değişmez; sonradan “aslında şunu demiştim” diyemezsin, ki iyi olan da bu.',
        '- İnternet yoksa yayın yine yapılır; görüşün yanında “Yayın anında fiyat alınamadı (ağ)” notu görünür.',
        '- Sitendeki karnede **Değerlendirme tarihi gelen** sayısı, tarihi bugün ya da daha önce olan görüşleri gösterir.',
        '',
        'Tarih geldiğinde **Sitem** sayfasında **Haklı çıktım mı?** ile kararını ve ne öğrendiğini yaz, sonra siteyi yeniden indir. Fiyatlara göre sonucu **Sicil** kendisi hesaplar; senin değerlendirmen ayrıca **Kendi değerlendirmem** olarak görünür.'
      ], [
        'The **review date** = publish date + your horizon (6, 12 or 24 months), moved back to the month end when needed (Jan 31 + 1 month = Feb 28).',
        '',
        '- When you publish, QuantEdge records the **last (adjusted) close** of the company and of the benchmark with its date. The record never changes, so you cannot later claim you said something else, which is the point.',
        '- Without internet the publication still goes through; the view shows “Price unavailable at publish time (network)”.',
        '- On your site, the track record counts the **reviews due**: views whose review date is today or earlier.',
        '',
        'When the date comes, use **Was I right?** on **Public Site** to write your verdict and what you learned, then download the site again. The **track record** computes the price-based result itself; your review appears separately as **My own review**.'
      ], [
        'La **fecha de revisión** = fecha de publicación + horizonte (6, 12 o 24 meses), ajustada al último día del mes si hace falta.',
        '',
        'Al publicar se guarda el último cierre ajustado de la empresa y del índice. Sin internet se publica igual, con una nota. Cuando llegue la fecha, usa **¿Acerté?** para escribir tu valoración.'
      ]],
      go: ['Public Site'], f: ['faq_was_i_right', 'faq_track_record', 'faq_call_kill'] },

    { id: 'faq_track_record', type: 'faq', page: 'Public Site',
      k: 'sicil|sicil nedir|sicilim|sicil kartı|karnem|performans geçmişi|görüşlerim tuttu mu|görüşlerimin sonucu|devam ediyor ne demek|isabet kaçırdı|kaçırdı ne demek|fiyat alınamadı sicil|ölçülemeyen|ölçülemeyen görüş|vadesi gelenler|vadesi dolan görüş yok|track record|my track record|in progress hit missed|due for review|historial|historial de opiniones|pendientes de revisión',
      t: ['Sicil nedir?', 'What is the track record?', '¿Qué es el historial?'],
      b: [[
        '**Sicil**, görüşlerinin fiyatlara göre nasıl sonuçlandığını gösteren karttır. Sitenin ana sayfasında ve **Sitem** sayfasının en üstünde yer alır.',
        '',
        '- QuantEdge her görüşü yayın günündeki fiyattan değerlendirme tarihine (ya da bugüne) kadar ölçer: hissenin getirisi, kıyaslama endeksinin getirisi ve aradaki **fark (puan)**.',
        '- **Devam ediyor · şimdilik +3,1 puan:** vade dolmadı; bu bir **ara sonuçtur**, kesin değildir ve isabet oranına sayılmaz.',
        '- **İsabet / Kaçırdı:** vade doldu ve sonuç kesinleşti.',
        '- **Fiyat alınamadı:** internet yok ya da fiyat bulunamadı; QuantEdge sayı uydurmaz, bir not gösterir. Vadesi dolduğu hâlde ölçülemeyen görüşler kartta **Ölçülemeyen** olarak ayrıca sayılır, gizlenmez.',
        '- **Vadesi gelenler:** değerlendirme tarihi geçmiş ve henüz **Haklı çıktım mı?** yazmadığın görüşler.',
        '',
        'Fiyatlara göre ölçülen sonuç ile senin **Kendi değerlendirmem** notların ayrı tutulur. Henüz vadesi dolan görüş yoksa kart bunu dürüstçe söyler ve ilk sonucun tarihini verir. Yatırım tavsiyesi değildir; geçmiş sonuçlar geleceği göstermez.'
      ], [
        'The **track record** shows how your explicit views turned out against prices. It sits on your site’s home page and at the top of **Public Site**.',
        '',
        '- QuantEdge measures each view from the publication-day price to the review date (or today): the stock’s return, the benchmark’s return and the **difference in points**.',
        '- **In progress · so far +3.1 pts:** the horizon has not ended; this is an **interim** figure, not final, and it does not count towards the hit rate.',
        '- **Hit / Missed:** the horizon has ended and the result is final.',
        '- **Price unavailable:** no internet or no price found; QuantEdge never invents a number, it shows a note. Matured views that could not be measured are counted separately as **Not measurable**, never hidden.',
        '- **Due for review:** views whose review date has passed and that you have not yet reviewed with **Was I right?**.',
        '',
        'The price-based result and your own reviews (**My own review**) are kept apart. If no view has matured yet, the card says so and gives the date of the first result. Not investment advice; past results do not predict future ones.'
      ], [
        'El **historial** muestra cómo resultaron tus opiniones explícitas según los precios: rentabilidad de la acción, del índice y la **diferencia en puntos**.',
        '',
        '- **En curso · por ahora +3,1 p.p.:** cifra provisional; el horizonte no ha terminado y no cuenta para la tasa de acierto.',
        '- **Acierto / Fallo:** el horizonte terminó.',
        '- **Precio no disponible:** no se inventa ninguna cifra.',
        '',
        'Tus valoraciones de **¿Acerté?** se muestran aparte. No es asesoramiento de inversión.'
      ]],
      go: ['Public Site'], f: ['faq_track_hit_rate', 'faq_track_neutral', 'faq_was_i_right'] },

    { id: 'faq_track_hit_rate', type: 'faq', page: 'Public Site',
      k: 'isabet oranı|isabet oranı nasıl hesaplanıyor|isabet oranı nedir|isabet nasıl hesaplanır|ne zaman isabet sayılır|olumlu görüş ne zaman isabet|olumsuz görüş ne zaman isabet|endekse göre fark|endekse göre ortalama fark|görüş yönünde fark|görüş yönünde ortalama fark|puan farkı|yüzde puan|en iyi en zayıf görüş|hit rate|how is the hit rate calculated|when is a view a hit|excess return|percentage points|tasa de acierto|cómo se calcula la tasa de acierto',
      t: ['İsabet oranı nasıl hesaplanıyor?', 'How is the hit rate calculated?', '¿Cómo se calcula la tasa de acierto?'],
      b: [[
        '1. Başlangıç: yayın günündeki (ya da ondan önceki son işlem günündeki) kapanış. Bitiş: değerlendirme tarihi; tarih gelmediyse bugün.',
        '2. Hissenin getirisi ve kıyaslama endeksinin getirisi hesaplanır; **fark = hisse getirisi − endeks getirisi** (yüzde puan).',
        '3. Vade dolunca sonuç belli olur: **olumlu** görüş fark sıfırın üstündeyse, **olumsuz** görüş fark sıfırın altındaysa, **nötr** görüş fark ±5 puan içindeyse **isabet** sayılır.',
        '',
        '**İsabet oranı** = isabetler ÷ vadesi dolan görüşler; kartta “%66,7 (2/3)” gibi sayılarla birlikte yazar. **Görüş yönünde ort. fark** da yalnızca vadesi dolan görüşlerden hesaplanır: olumlu görüşte fark olduğu gibi, olumsuz görüşte işareti ters çevrilmiş olarak, nötr görüşte ±5 bandına kalan pay olarak alınır. Böylece tutmayan bir olumsuz görüş (hisse endeksi geçtiyse) ortalamayı yükseltmez. **En iyi / En zayıf** da bu sayıya göre seçilir. Devam eden görüşler hiçbir zaman sıralamaya ya da orana girmez; böylece iyi giden bir görüşü erken “kazandım” sayamazsın.',
        '',
        'Az sayıda görüşle oran çok oynak olur: 2 görüşten 1 isabet %50 eder ama bir şey kanıtlamaz. 5’ten az sonuç varsa kart bunu ayrıca yazar. Yatırım tavsiyesi değildir; geçmiş sonuçlar geleceği göstermez.'
      ], [
        '1. Start: the close on the publication day (or the last trading day before it). End: the review date, or today if it has not come yet.',
        '2. The stock’s return and the benchmark’s return are computed; **difference = stock return − benchmark return** (percentage points).',
        '3. When the horizon ends the result is final: a **positive** view is a **hit** if the difference is above zero, a **negative** view if it is below zero, a **neutral** view if it is within ±5 points.',
        '',
        '**Hit rate** = hits ÷ matured views, shown with the counts, e.g. “66.7% (2/3)”. The **average in the view’s direction** also uses matured views only: the difference as is for a positive view, with the sign flipped for a negative view, and the room left inside the ±5 band for a neutral view. So a wrong negative call (the stock beat the index) does not lift the average. **Best / Weakest** use the same number. Open views are never ranked or counted, so a view that is going well cannot be called a win early.',
        '',
        'With few views the rate swings a lot: 1 hit out of 2 is 50% and proves little. With fewer than 5 results the card says so. Not investment advice; past results do not predict future ones.'
      ], [
        'Diferencia = rentabilidad de la acción − rentabilidad del índice (puntos porcentuales), desde el cierre del día de publicación hasta la fecha de revisión.',
        '',
        'Positiva acierta si la diferencia es mayor que cero, negativa si es menor que cero y neutral si queda dentro de ±5 puntos. **Tasa de acierto** = aciertos ÷ opiniones vencidas (p. ej. “66,7 % (2/3)”); las opiniones en curso no cuentan. El **margen medio a favor de la opinión** invierte el signo en las negativas, así que una negativa fallida no mejora la media. Con menos de 5 resultados la tasa demuestra poco.'
      ]],
      go: ['Public Site'], f: ['faq_track_neutral', 'faq_track_adjusted', 'faq_track_record'] },

    { id: 'faq_track_neutral', type: 'faq', page: 'Public Site',
      k: 'nötr görüş ne zaman isabet sayılır|nötr görüş isabet|nötr isabet|nötr bant|5 puan|artı eksi 5 puan|nötr ne zaman tutar|endeksle benzer|neutral view hit|when is a neutral view a hit|neutral band|within 5 points|opinión neutral acierto|banda neutral',
      t: ['Nötr görüş ne zaman isabet sayılır?', 'When does a neutral view count as a hit?', '¿Cuándo acierta una opinión neutral?'],
      b: [[
        'Nötr görüş “hisse endeksle **benzer** gidecek” demektir. Vade dolduğunda hisse ile endeks arasındaki fark **±5 puan** içindeyse isabet sayılır.',
        '',
        '- Hisse %12, endeks %9 → fark +3 puan → **isabet**.',
        '- Hisse %2, endeks %9 → fark −7 puan → **kaçırdı**.',
        '',
        'Bu 5 puanlık bant sabittir ve Sicil’deki yöntem notunda yazar; görüşü yayınladıktan sonra değiştirilemez. Bandı dar tutmak, “nötr” seçeneğini her sonucu kapsayan güvenli bir kaçış olmaktan çıkarır.'
      ], [
        'A neutral view says the stock will do **about the same** as the benchmark. When the horizon ends it is a hit if the difference is within **±5 points**.',
        '',
        '- Stock 12%, index 9% → difference +3 points → **hit**.',
        '- Stock 2%, index 9% → difference −7 points → **missed**.',
        '',
        'The 5-point band is fixed and stated in the method note on your site; it cannot change after you publish. A narrow band keeps “neutral” from being a safe answer that fits any outcome.'
      ], [
        'Una opinión neutral acierta si, al vencer el horizonte, la diferencia entre la acción y el índice queda dentro de **±5 puntos** (p. ej. acción 12 %, índice 9 % → +3 puntos → acierto). La banda es fija y figura en la nota de método.'
      ]],
      go: ['Public Site'], f: ['faq_track_hit_rate', 'faq_call_view', 'faq_track_record'] },

    { id: 'faq_track_digest', type: 'faq', page: 'Public Site',
      k: 'kayıt özeti|kayıt özeti ne işe yarar|kayıt özeti nedir|hash|hash nedir|hash ne işe yarar|sha256|sha-256|parmak izi|özet kodu|değiştirilmediğini nasıl kanıtlarım|sonradan değiştirdim mi|eski yayınlarda hash yok|digest|record digest|what is the hash for|prove i did not edit|huella|resumen del registro',
      t: ['Kayıt özeti (hash) ne işe yarar?', 'What is the record digest (hash) for?', '¿Para qué sirve el resumen del registro (hash)?'],
      b: [[
        'Yayınladığın anda QuantEdge şu alanlardan bir **SHA-256 kayıt özeti** üretir ve saklar: kayıt kimliği, yayın zamanı, analiz türü, şirketler, veri tarihi, yazar, görüşün, karşı görüşün ve açık görüş kutusu (yayın günü fiyatları dahil). **Başlık ve analizin sayıları/grafikleri dahil değildir.** Analiz sayfasındaki **Sicil** kutusunda kısa hâli, ayrıntıda tamamı görünür.',
        '',
        '- Bu alanlarda tek bir harf değişse özet tamamen değişir. Böylece görüş metninin sonradan düzeltilmediğini gösterebilirsin. QuantEdge her yayında özeti yeniden kontrol eder; tutmazsa sitede özet yerine “Kayıt yayından sonra değişmiş” yazar.',
        '- Özet tek başına **tarihi** kanıtlamaz. Tarihi kanıtlamak için özetin değiştiremeyeceğin, tarihli bir yerde de bulunması gerekir: örneğin GitHub depondaki commit geçmişi ya da LinkedIn gönderin.',
        '- Bu özellikten önce yayınlanan analizlerde özet **yoktur** ve sonradan eklenmez: bugün hesaplanan bir özet o günü kanıtlamaz.',
        '',
        'Kısacası: özet, görüşünü yayından sonra değiştirmediğini gösteren bir mühürdür; sonucu ise fiyatlar belirler, sen değil.'
      ], [
        'When you publish, QuantEdge computes and stores a **SHA-256 record digest** of these fields: record id, publication time, analysis type, companies, data date, author, your view, counterargument and the explicit view box (including publication-day prices). **The title and the analysis numbers/charts are not included.** The **Track record** box on the article page shows its short form, with the full value in the details.',
        '',
        '- Change a single letter in those fields and the digest changes completely, so you can show the view was not edited later. QuantEdge re-checks it whenever it builds the site; if it no longer matches, the site says “The record changed after publication” instead of showing the digest.',
        '- The digest alone does not prove the **date**. For that it should also appear somewhere dated that you cannot edit, such as your GitHub repository’s commit history or your LinkedIn post.',
        '- Analyses published before this feature have **no** digest and none is added later: a digest computed today would prove nothing about that day.',
        '',
        'In short: the digest is a seal showing you did not change your view after publishing; the result itself is decided by prices, not by you.'
      ], [
        'Al publicar se guarda un **resumen SHA-256** de: id del registro, hora de publicación, tipo de análisis, empresas, fecha de los datos, autor, opinión, objeción y cuadro de opinión explícita. **El título y las cifras del análisis no se incluyen.** Si cambia una sola letra de esos campos, el resumen cambia por completo; si deja de coincidir, el sitio lo indica en lugar de mostrarlo.',
        '',
        'Por sí solo no prueba la fecha: para eso debe aparecer también en un lugar fechado (historial de GitHub o tu publicación de LinkedIn). Los análisis anteriores no tienen resumen y no se añade después.'
      ]],
      go: ['Public Site'], f: ['faq_track_record', 'faq_site_update', 'faq_site_public'] },

    { id: 'faq_track_adjusted', type: 'faq', page: 'Public Site',
      k: 'neden temettü düzeltilmiş fiyat|temettü düzeltilmiş|düzeltilmiş kapanış|düzeltilmiş fiyat nedir|bölünme düzeltmesi|fiyat neden farklı|yayın günü fiyatı değişti|kayıtlı fiyat farklı|neden tl ile|bist tl ile|bist 100 temettü|bist 100 fiyat endeksi|xu100 temettü|getiri endeksi|dolar bazında değil|aynı para birimi|why dividend adjusted|adjusted close|adjusted prices|split adjusted|why is the price different|same currency benchmark|precio ajustado|ajustado por dividendos',
      t: ['Neden temettü düzeltilmiş fiyat kullanılıyor?', 'Why dividend-adjusted prices?', '¿Por qué precios ajustados por dividendos?'],
      b: [[
        'Sicil **toplam getiriyi** ölçmek ister: hisse fiyatındaki değişim artı dağıtılan temettüler. Düzeltilmiş kapanış fiyatı ikisini birlikte gösterir; bölünmeler (split) de hesaba katılır.',
        '',
        '- Temettü dağıtıldığı gün fiyat düşer. Düzeltme olmasa, yüksek temettü ödeyen bir şirket olduğundan kötü görünürdü.',
        '- Her yeni temettüde geçmiş fiyatlar yeniden düzeltilir. Bu yüzden başlangıç fiyatı, yayın günü kaydedilen sayıdan değil, **bugünkü düzeltilmiş serideki** aynı günden alınır. Kayıtlı yayın günü fiyatı biraz farklı görünebilir; bu normaldir.',
        '- Getiriler hissenin **kendi para biriminde** ve aynı para birimindeki endekse karşı hesaplanır: BIST hisseleri TL olarak BIST 100’e karşı, ABD hisseleri dolar olarak S&P 500’e karşı. Böylece kur hareketi sonucu bozmaz.',
        '- **Dikkat (BIST):** BIST 100 temettüleri içermeyen bir **fiyat endeksidir**; hisse getirisi ise temettü dahildir. Bu yüzden BIST hisselerinde fark, yaklaşık hissenin temettü verimi kadar hisse lehine çıkar (olumlu görüşe hafif avantaj, olumsuz görüşe hafif dezavantaj). ABD endeks fonları (SPY, QQQ, URTH) için düzeltilmiş fiyat temettüleri içerir, karşılaştırma eşittir.',
        '',
        'Fiyatlar Yahoo Finance’tan gelir ve resmî kayıt değildir. Yatırım tavsiyesi değildir.'
      ], [
        'The track record measures **total return**: the price change plus dividends paid. The adjusted close captures both, and splits too.',
        '',
        '- On the ex-dividend day the price drops. Without adjustment a high-dividend company would look worse than it did.',
        '- Each new dividend re-adjusts past prices. So the start value comes from the same day in **today’s adjusted series**, not from the number stored on publication day; the stored price on your site may look slightly different, which is expected.',
        '- Returns are in the stock’s **own currency** against a benchmark in the same currency: BIST shares in TL against BIST 100, US shares in dollars against the S&P 500, so currency moves do not distort the result.',
        '- **Caution (BIST):** the BIST 100 is a **price index** without dividends, while the stock’s return includes them. For BIST shares the difference is therefore overstated by roughly the stock’s dividend yield (a slight edge for positive views, a slight handicap for negative ones). For the US index funds (SPY, QQQ, URTH) the adjusted prices include dividends, so the comparison is like for like.',
        '',
        'Prices come from Yahoo Finance and are not an official record. Not investment advice.'
      ], [
        'Se mide la **rentabilidad total**: precio más dividendos, y también los splits. Cada dividendo nuevo reajusta el pasado, por eso el precio inicial se toma de la serie ajustada actual y no del número guardado el día de publicación.',
        '',
        'Las rentabilidades se calculan en la moneda de la acción frente a un índice en la misma moneda (BIST en liras frente al BIST 100). Ojo: el BIST 100 es un índice de precios sin dividendos, así que en acciones de BIST la diferencia sale inflada aproximadamente en la rentabilidad por dividendo. No es asesoramiento de inversión.'
      ]],
      go: ['Public Site'], f: ['faq_track_hit_rate', 'faq_data_sources', 'faq_track_record'] },

    { id: 'faq_call_no_rating', type: 'faq', page: 'Analysis Lab',
      k: 'neden al sat yok|al sat diyemiyorum|neden al sat diyemiyorum|al veya sat yazamıyorum|neden sadece göreli görüş|neden sadece göreli görüş var|neden yalnızca göreli görüş|neden göreli görüş|tavsiye notu|derecelendirme yok|neden hedef yok|fiyat hedefi neden yok|lisanslı değilim|reşit değilim|spk lisansı|finra|why no rating|why only a relative view|why can i not write a rating|no rating|rating|por qué no puedo poner comprar|por qué no hay recomendación',
      t: ['Neden “al / sat” ya da fiyat hedefi yazamıyorum?', 'Why can’t I give a rating or a price target?', '¿Por qué no puedo poner una recomendación o un precio objetivo?'],
      b: [[
        'Çünkü **“al / sat / tut” notu ve fiyat hedefi yatırım tavsiyesidir.** Türkiye’de bunu ancak SPK lisanslı kişiler verebilir; ABD’de de araştırma raporları FINRA 2241 gibi kurallara bağlıdır. Sen bir öğrencisin ve çoğu zaman reşit değilsin; QuantEdge seni bu riske sokmaz.',
        '',
        'Bunun yerine profesyonellerin de kullandığı, öğrenci için güvenli bir biçim var:',
        '- **Göreli görüş:** bir endekse göre olumlu / nötr / olumsuz (“S&P 500’e göre olumlu”). Bir şirketi anlamaya dair bir beklentidir, kimseye işlem önermez.',
        '- **Kanıt metriği:** fiyat değil, işletmenin bir rakamı (“FY2027 faaliyet marjı > %30”).',
        '- **Riskler ve vazgeçme kriterleri:** nerede yanılabileceğini açıkça söylemek.',
        '',
        'Bu biçim seni daha **inandırıcı** da yapar: okuyucu neyi neden düşündüğünü ve neyin seni yanıltacağını görür.'
      ], [
        'Because **a buy / sell / hold rating or a price target is investment advice.** Only licensed people may give it (in Turkey under the Capital Markets Board, in the US research reports follow rules such as FINRA 2241). You are a student and often a minor; QuantEdge keeps you out of that.',
        '',
        'Instead you get a format professionals use too, and that is safe for a student:',
        '- A **relative view:** positive / neutral / negative against an index (“Positive vs S&P 500”). It is an expectation about understanding a company, not a trade suggestion for anyone.',
        '- A **proof metric:** a business number, not a price (“FY2027 operating margin > 30%”).',
        '- **Risks and kill criteria:** saying openly where you could be wrong.',
        '',
        'This also makes you **more credible**: readers see what you think, why, and what would prove you wrong.'
      ], [
        'Porque **una recomendación de comprar o vender o un precio objetivo es asesoramiento de inversión**, y solo pueden darlo personas autorizadas. Eres estudiante y a menudo menor de edad.',
        '',
        'En su lugar: una **opinión relativa** frente a un índice, una **métrica de la tesis** sobre el negocio (no el precio) y **riesgos con criterios de abandono**.'
      ]],
      go: ['Analysis Lab'], f: ['faq_call_view', 'faq_advice', 'faq_overclaim'] },

    { id: 'faq_call_metric', type: 'faq', page: 'Analysis Lab',
      k: 'görüş nasıl yazılır|görüşümü nasıl yazarım|görüşün alanı|kanıt metriği|kanıt metriği nedir|kanıt metriğim|kanıt metriği nasıl seçilir|eşik değer|eşik değer nedir|tezi kanıtlayacak ölçüt|tez ölçütü|tez metriği|iyi bir tez nasıl yazılır|tezimi nasıl ölçerim|ölçülebilir tez|test edilebilir tez|hangi rakam tezimi kanıtlar|faaliyet marjı hedefi|thesis metric|measurable thesis|testable thesis|how do i write a good thesis|one number that proves|métrica de la tesis|tesis medible',
      t: ['İyi bir tez ve kanıt metriği nasıl yazılır?', 'How do I write a good thesis and a thesis metric?', '¿Cómo escribo una buena tesis y su métrica?'],
      b: [[
        '**Kanıt metriği**, tezin doğruysa vade sonunda görmen gereken **tek rakamdır**. Etiket (8–120 karakter), karşılaştırma (>, ≥, <, ≤), eşik değer ve birimden (%, milyon $, ×) oluşur. Eşik değer bir fiyat hedefi değildir; işletmenin bir rakamı için çizdiğin sınırdır.',
        '',
        'Örnekler:',
        '- FY2027 faaliyet marjı > %30',
        '- Net borç / FAVÖK ≤ 2,5×',
        '- FY2027 serbest nakit akışı ≥ 50.000 milyon $',
        '',
        'İyi bir ölçüt:',
        '1. **Kaynaktan okunabilir:** 10-K, 10-Q veya KAP finansallarında yazan bir kalem; dönemi belli ve vaden içinde açıklanacak (FY2027, 2027 2. çeyrek).',
        '2. **Tezinle doğrudan bağlı:** tezin “marjlar artacak” diyorsa ölçüt marjdır; hisse fiyatı, piyasa değeri ya da F/K gibi çarpanlar değil (bunlar hisse fiyatına bağlıdır).',
        '3. **Gerçekten tutmayabilir:** zaten açıklanmış bir dönemin rakamı kanıt değildir (ör. Kasım 2026’da FY2026 marjı). Son değeri ve analizdeki eğilimi kontrol et.',
        '',
        'Tez metninde de aynı mantık: “Bence … çünkü veriler … gösteriyor; … olursa yanılırım.” Fiyat hedefi ya da “al / sat” yazma.'
      ], [
        'The **proof metric** is the **one number** you should see at the end of the horizon if your thesis is right: a label (8–120 characters), a comparison (>, ≥, <, ≤), a threshold and a unit (%, $M, ×). The threshold is not a price target; it is a line drawn for a business figure.',
        '',
        'Examples:',
        '- FY2027 operating margin > 30%',
        '- Net debt / EBITDA ≤ 2.5×',
        '- FY2027 free cash flow ≥ $50,000M',
        '',
        'A good metric is:',
        '1. **Readable from a source:** a line in the 10-K, 10-Q or local filings, with a clear period that will be reported within your horizon (FY2027, Q2 2027).',
        '2. **Directly tied to your thesis:** if the thesis says “margins will expand”, the metric is a margin; not the share price, market value or a multiple such as P/E (those move with the share price).',
        '3. **Able to fail:** a period that is already reported proves nothing (e.g. the FY2026 margin in November 2026). Check the latest value and the trend in the analysis.',
        '',
        'The thesis text follows the same logic: “I think … because the data shows …; I am wrong if …”. No price target, no buy or sell.'
      ], [
        'La **métrica de la tesis** es la **única cifra** que deberías ver al final del horizonte si tienes razón: etiqueta, comparación (>, ≥, <, ≤), objetivo y unidad (%, M$, ×). Ej.: “Margen operativo FY2027 > 30 %”.',
        '',
        'Que salga de una fuente (10-K, 10-Q), esté ligada a tu tesis, se publique dentro de tu horizonte y pueda fallar de verdad. Sin precio objetivo, valor de mercado ni múltiplos como el PER.'
      ]],
      go: ['Analysis Lab'], f: ['faq_call_view', 'faq_call_kill', 'faq_thesis_required'] },

    { id: 'faq_linkedin_post', type: 'faq',
      k: 'kopyalayamıyorum|kopyalamıyor|cómo publico en linkedin|publicar en linkedin|linkedin metni nasıl paylaşılır|linkedinde nasıl paylaşırım|linkedin taslağı|kopyala yapıştır|linkedin için kopyala|kopyalanmıyor|copy for linkedin|share on linkedin|post on linkedin|compartir en linkedin|copiar para linkedin',
      t: ['LinkedIn’de nasıl paylaşırım?', 'How do I post on LinkedIn?', '¿Cómo publico en LinkedIn?'],
      b: [[
        '1. Laboratuvarda tez ve riskleri yaz; **LinkedIn taslağı** açılır. Metin senin görüşünle başlar, rakamlar ve karşı görüşün gelir, kaynak linkleri sonda.',
        '2. **LinkedIn için kopyala**’ya bas.',
        '3. LinkedIn’de **Gönderi başlat**’a tıkla ve yapıştır (Cmd+V).',
        '4. İstersen **PNG indir** ile görseli ya da carousel PDF’ini ekle.',
        '',
        'Kopyalama tarayıcıda engelliyse metni seçip **Cmd+C** ile kopyala. LinkedIn sınırı 3000 karakter. QuantEdge senin yerine paylaşım yapmaz.'
      ], [
        '1. In the Lab write your thesis and risks; the **LinkedIn draft** unlocks. It leads with your view, then the figures and your counterargument, with source links at the end.',
        '2. Press **Copy for LinkedIn**.',
        '3. On LinkedIn click **Start a post** and paste (Cmd+V).',
        '4. Optionally attach the image (**Download PNG**) or the carousel PDF.',
        '',
        'If the browser blocks copying, select the text and press **Cmd+C**. LinkedIn’s limit is 3,000 characters. QuantEdge never posts for you.'
      ], [
        '1. Escribe tesis y riesgos en el Laboratorio; se desbloquea el **borrador de LinkedIn**.',
        '2. Pulsa **Copiar para LinkedIn**.',
        '3. En LinkedIn, **Empezar una publicación** y pega (Cmd+V).',
        '4. Si quieres, adjunta la imagen PNG o el carrusel PDF.'
      ]],
      go: ['Analysis Lab', 'LinkedIn'], f: ['faq_carousel', 'faq_png', 'faq_overclaim'] },

    { id: 'faq_carousel', type: 'faq',
      k: 'carousel|karusel|kaydırmalı gönderi|carousel nasıl yüklenir|linkedin carousel|linkedin pdf|belge ekle|pdf gönderi|slayt|linkedin carousel upload|document post|carrusel|subir carrusel',
      t: ['LinkedIn carousel (PDF) nasıl yüklenir?', 'How do I upload a LinkedIn carousel (PDF)?', '¿Cómo subo un carrusel (PDF) a LinkedIn?'],
      b: [[
        'Carousel, 5–9 sayfalık kaydırmalı bir PDF: kapak, grafik, öne çıkanlar, tablo, görüşün, karşı görüşün ve kaynaklar. Açık görüş seçersen görüş ve risk matrisi sayfaları da eklenir.',
        '',
        '1. Laboratuvarda tez ve riskleri yaz, **Kaydırmalı gönderi (carousel)** kartında **PDF indir**’e bas.',
        '2. LinkedIn’de **Gönderi başlat**’a tıkla.',
        '3. Alttaki **+ / Daha fazla** menüsünden **Belge ekle**’yi seç.',
        '4. İndirdiğin PDF’i seç ve belgeye bir **başlık** ver (kaydırırken görünür).',
        '5. Üstüne kısa bir metin yaz (LinkedIn taslağını kullanabilirsin) ve **Paylaş**.',
        '',
        'Telefonda yüklüyorsan PDF’i önce telefonuna (AirDrop/iCloud) aktar.'
      ], [
        'The carousel is a 5–9 page swipeable PDF: cover, chart, key findings, table, your view, your counterargument and sources. With an explicit view it also gets a view page and a risk-matrix page.',
        '',
        '1. In the Lab write your thesis and risks, then press **Download PDF** under **Carousel**.',
        '2. On LinkedIn click **Start a post**.',
        '3. From the **+ / More** menu choose **Add a document**.',
        '4. Pick the downloaded PDF and give the document a **title** (it shows while swiping).',
        '5. Write a short text on top (the LinkedIn draft works) and **Post**.',
        '',
        'Uploading from a phone? Move the PDF to the phone first (AirDrop/iCloud).'
      ], [
        'El carrusel es un PDF de 5–9 páginas; con una opinión explícita incluye también la página de opinión y la de la matriz de riesgos.',
        '',
        '1. En el Laboratorio pulsa **Descargar PDF** en **Carrusel**.',
        '2. En LinkedIn, **Empezar una publicación**.',
        '3. En **+ / Más**, elige **Añadir un documento**.',
        '4. Selecciona el PDF y ponle un **título**.',
        '5. Escribe un texto breve y **Publica**.'
      ]],
      go: ['Analysis Lab'], f: ['faq_linkedin_post', 'faq_png', 'faq_thesis_required'] },

    { id: 'faq_png', type: 'faq',
      k: 'png|görsel indir|resim indir|grafik kartı|png indir|linkedin görseli|image|chart card|download png|imagen|descargar png',
      t: ['PNG görseli nasıl alırım?', 'How do I get the PNG image?', '¿Cómo obtengo la imagen PNG?'],
      b: [[
        'Laboratuvarda tez ve riskleri yazınca **Görsel** çıktısı açılır: 1200×627 boyutunda, LinkedIn’e uygun bir grafik kartı. **Görseli önizle**, sonra **PNG indir**.',
        '',
        'LinkedIn sayfasındaki gönderilerde de aynı boyutta bir kart vardır. Görsel bilgisayarında çizilir; hiçbir yere yüklenmez.'
      ], [
        'After you write your thesis and risks in the Lab, the **Image** output unlocks: a 1200×627 chart card sized for LinkedIn. **Preview the image**, then **Download PNG**.',
        '',
        'Posts on the LinkedIn page have a card of the same size. The image is drawn on your computer; nothing is uploaded.'
      ], [
        'Tras escribir tesis y riesgos se desbloquea la **Imagen** (1200×627). Pulsa **Descargar PNG**. Se dibuja en tu ordenador.'
      ]],
      f: ['faq_carousel', 'faq_linkedin_post', 'page_linkedin'] },

    { id: 'faq_site_publish', type: 'faq',
      k: 'sitemi nasıl yayınlarım|site nasıl açılır|siteyi internete koy|github pages|github|siteyi yayınla|site yayınlama|web sitesi açmak|kendi sitem|nasıl yayınlarım|how to publish my site|put site online|deploy site|publicar mi sitio|github pages pasos',
      t: ['Sitemi internette nasıl yayınlarım (GitHub Pages)?', 'How do I put my site online (GitHub Pages)?', '¿Cómo publico mi sitio (GitHub Pages)?'],
      b: [[
        'Ücretsiz ve tek linkli: **https://KULLANICIADIN.github.io/analizler/**',
        '',
        '1. **Sitem** sayfasında bilgilerini **Kaydet**, **Siteyi indir (ZIP)**.',
        '2. github.com’da ücretsiz hesap aç.',
        '3. Yeni bir **public** depo oluştur (ör. adı **analizler**) ve **Add a README file** kutusunu işaretle.',
        '4. Depoda **Add file → Upload files**.',
        '5. ZIP’i aç ve içindeki **BÜTÜN** dosya ve klasörleri sayfaya sürükle (ZIP’in kendisini değil).',
        '6. **Commit changes**’e tıkla.',
        '7. **Settings → Pages**: Source = **Deploy from a branch**, **main** ve **/ (root)**, **Save**.',
        '',
        'Yaklaşık 1 dakika sonra site yayında. LinkedIn’e ekle: Profil → Bölüm ekle → **Öne çıkanlar** → Bağlantı ekle.'
      ], [
        'Free, at one link: **https://USERNAME.github.io/analizler/**',
        '',
        '1. On **Public Site** **Save** your details, then **Download site (ZIP)**.',
        '2. Create a free account at github.com.',
        '3. Create a new **public** repository (e.g. named **analizler**) and tick **Add a README file**.',
        '4. In the repository choose **Add file → Upload files**.',
        '5. Unzip and drag **ALL** its files and folders onto the page (not the ZIP itself).',
        '6. Click **Commit changes**.',
        '7. **Settings → Pages**: Source = **Deploy from a branch**, **main** and **/ (root)**, **Save**.',
        '',
        'After about a minute it is live. On LinkedIn: Profile → Add section → **Featured** → Add a link.'
      ], [
        'Gratis, en un enlace: **https://USUARIO.github.io/analizler/**',
        '',
        '1. En **Mi sitio** guarda tus datos y **descarga el ZIP**.',
        '2. Crea una cuenta gratuita en github.com.',
        '3. Crea un repositorio **público** (p. ej. **analizler**) con **Add a README file**.',
        '4. **Add file → Upload files**.',
        '5. Descomprime y arrastra **TODOS** los archivos y carpetas.',
        '6. **Commit changes**.',
        '7. **Settings → Pages**: **Deploy from a branch**, **main**, **/ (root)**, **Save**.'
      ]],
      go: ['Public Site'], f: ['faq_site_update', 'faq_site_public', 'faq_site_remove'] },

    { id: 'faq_site_update', type: 'faq',
      k: 'siteyi güncelle|site güncelleme|yeni analiz ekledim sitede yok|sitem güncellenmiyor|değişiklikler görünmüyor|update site|site not updating|actualizar sitio',
      t: ['Sitemi nasıl güncellerim?', 'How do I update my site?', '¿Cómo actualizo mi sitio?'],
      b: [[
        '1. Yeni analizi Laboratuvardan **Siteme ekle** (ya da Sitem’de bilgilerini değiştirip **Kaydet**).',
        '2. **Siteyi indir (ZIP)** ile yeniden indir.',
        '3. GitHub deposunda **Add file → Upload files**, ZIP’in içindeki her şeyi tekrar sürükle, **Commit changes**. GitHub eskilerin üstüne yazar.',
        '',
        'Değişiklik 1–2 dakikada görünür; görünmezse sayfayı **Cmd+Shift+R** ile yenile. Önizleme ve ZIP **kaydedilmiş** ayarları kullanır, önce Kaydet’e bas.'
      ], [
        '1. Add the new analysis from the Lab with **Add to my public site** (or edit your details on Public Site and **Save**).',
        '2. **Download site (ZIP)** again.',
        '3. In the GitHub repository choose **Add file → Upload files**, drag everything from the ZIP again and **Commit changes**. GitHub replaces the old files.',
        '',
        'Changes show within 1–2 minutes; if not, reload with **Cmd+Shift+R**. Preview and ZIP use the **saved** settings, so press Save first.'
      ], [
        '1. Añade el análisis nuevo o cambia tus datos y **Guarda**.',
        '2. Descarga otra vez el ZIP.',
        '3. En GitHub, **Add file → Upload files**, arrastra todo y **Commit changes**.',
        '',
        'Si no ves el cambio, recarga con **Cmd+Shift+R**.'
      ]],
      go: ['Public Site'], f: ['faq_site_publish', 'faq_site_remove', 'faq_old_version'] },

    { id: 'faq_site_remove', type: 'faq',
      k: 'analizi sil|analizi siteden kaldır|siteden çıkar|yayından kaldır|analiz silme|remove analysis|delete analysis|unpublish|quitar análisis|eliminar análisis',
      t: ['Bir analizi sitemden nasıl kaldırırım?', 'How do I remove an analysis from my site?', '¿Cómo quito un análisis de mi sitio?'],
      b: [[
        '1. **Sitem** sayfasında “Yayınladığın analizler” listesinde analizin yanındaki **Siteden kaldır**’a bas, sonra **Evet, kaldır** ile onayla. O analize yazdığın “Haklı çıktım mı?” değerlendirmeleri de silinir.',
        '2. Site zaten yayındaysa: GitHub deposunda o analizin dosyasını (**a/…html**) sil ve yeni bir ZIP’ten **index.html**’i tekrar yükle.',
        '',
        '**Dikkat:** GitHub deposu herkese açıktır; silinen dosyalar deponun **geçmişinde** kalır.'
      ], [
        '1. On **Public Site**, press **Remove from site** next to the analysis under “Your published analyses”, then confirm with **Yes, remove it**. Its “Was I right?” reviews are deleted too.',
        '2. If the site is already online: delete that analysis’s file (**a/…html**) in your GitHub repository and upload **index.html** again from a fresh ZIP.',
        '',
        '**Note:** the repository is public; deleted files stay in its **history**.'
      ], [
        '1. En **Mi sitio** pulsa **Quitar del sitio** y confirma. También se borran sus revisiones.',
        '2. Si ya está en línea, borra su archivo (**a/…html**) en GitHub y vuelve a subir **index.html** de un ZIP nuevo.',
        '',
        'Los archivos borrados siguen en el historial del repositorio.'
      ]],
      go: ['Public Site'], f: ['faq_site_update', 'faq_site_public', 'faq_was_i_right'] },

    { id: 'faq_site_public', type: 'faq',
      k: 'sitede ne görünür|ne herkese açık|herkes görebilir mi|kimler görür|site gizli mi|what becomes public|who can see my site|is my site public|qué es público',
      t: ['Sitemde neler herkese açık olur?', 'What becomes public on my site?', '¿Qué se hace público en mi sitio?'],
      b: [[
        'Sadece sitede listelenen analizler: görüşün, karşı görüşün, bütün “Haklı çıktım mı?” değerlendirmelerin ve notların; ayrıca adın, başlığın, tanıtımın ve LinkedIn linkin.',
        '',
        'QuantEdge’in kendisi, rapor notların, kütüphane taslakların ve geri kalan her şey bilgisayarında kalır. Site ve GitHub deposu tamamen herkese açıktır ve arama sonuçlarında çıkabilir.'
      ], [
        'Only the analyses listed on your site: your view, counterargument and every “Was I right?” review and note, plus your name, headline, bio and LinkedIn link.',
        '',
        'QuantEdge itself, your report notes, library drafts and everything else stay on your computer. The site and its GitHub repository are fully public and can appear in search results.'
      ], [
        'Solo los análisis del sitio (tu opinión, contraargumento y revisiones) y tu nombre, titular, biografía y LinkedIn. Todo lo demás se queda en tu ordenador.'
      ]],
      f: ['faq_privacy', 'faq_site_remove', 'faq_site_publish'] },

    { id: 'faq_was_i_right', type: 'faq',
      k: 'haklı çıktım mı|haklı mıydım|tezim tuttu mu|tez takibi|değerlendirme yaz|kararımı kaydet|was i right|thesis tracking|verdict|acerté|seguimiento de tesis',
      t: ['“Haklı çıktım mı?” nasıl çalışır?', 'How does “Was I right?” work?', '¿Cómo funciona “¿Acerté?”?'],
      b: [[
        'Aylar sonra tezinin tutup tutmadığını dürüstçe yazdığın bölüm.',
        '',
        '- **Sitedeki analizler:** Sitem sayfasında analizin altındaki **Haklı çıktım mı?** düğmesine bas, kararını seç (Tezim tuttu / Kısmen tuttu / Tutmadı / Henüz erken), ne öğrendiğini yaz, **Kararımı kaydet**. Her değerlendirme sayfaya eklenir; ziyaretçiler düşüncenin nasıl geliştiğini görür.',
        '- **Kütüphanedeki raporlar:** kaydı aç, **Bugünkü rakamlarla karşılaştır**, sonra kararını kaydet.',
        '',
        'Kararlar silinmez (analizi siteden kaldırırsan onunla birlikte gider). Yanıldığını yazmak bir zayıflık değil; araştırmacı olduğunu gösterir.'
      ], [
        'Where you honestly record, months later, whether your thesis held.',
        '',
        '- **Site analyses:** on Public Site, under the analysis, choose your verdict in **Was I right?** (Held / Partly / Did not hold / Too early), write what you learned and **Save my verdict**. Each review is added to the page so visitors see how your thinking developed.',
        '- **Library reports:** open the record, **Compare with today’s figures**, then save your verdict.',
        '',
        'Verdicts are not deleted (unless you remove the analysis from the site). Admitting you were wrong is not a weakness; it shows you are a researcher.'
      ], [
        'Donde registras meses después si tu tesis se cumplió.',
        '',
        '- **En el sitio:** en **¿Acerté?** elige tu veredicto, escribe qué aprendiste y guarda.',
        '- **En la Biblioteca:** abre el registro y **compara con las cifras de hoy**.'
      ]],
      go: ['Public Site', 'Library'], f: ['page_library', 'faq_site_update', 'faq_portfolio_page'] },

    { id: 'faq_save', type: 'faq',
      k: 'kaydetme|nasıl kaydederim|kaydet|yazdıklarım kayboldu|taslaklarım nerede|taslak kaydet|kayıtlar nerede|save|where are my drafts|lost my text|guardar|dónde están mis borradores',
      t: ['Çalışmam nasıl kaydedilir, nerede durur?', 'How is my work saved, and where?', '¿Cómo se guarda mi trabajo y dónde?'],
      b: [[
        '- **Laboratuvar:** tez ve risk metinlerin aynı analiz ve kodlar için **tarayıcıda** otomatik saklanır; analizi tekrar çalıştırınca geri gelir.',
        '- **Sitem:** **Siteme ekle** ile eklenenler ve site ayarları bilgisayarındaki QuantEdge klasörüne kaydedilir.',
        '- **Raporlar → Kütüphaneye kaydet:** uzun rapor bir anlık görüntü olarak **Kütüphane**’ye girer.',
        '- **LinkedIn sayfası:** son 20 taslak bu tarayıcıda; yedek için **.txt indir**.',
        '',
        'Tarayıcı verilerini temizlemek tarayıcıda saklananları siler. Önemli metinleri ayrıca yedekle.'
      ], [
        '- **Lab:** your thesis and risks are kept automatically **in the browser** for the same analysis and tickers; they come back when you run it again.',
        '- **Public Site:** analyses added with **Add to my public site** and site settings are saved in the QuantEdge folder on your computer.',
        '- **Reports → Save to Library:** the long report is stored in the **Library** as a snapshot.',
        '- **LinkedIn page:** the last 20 drafts stay in this browser; **Save .txt** for a backup.',
        '',
        'Clearing browser data removes what is kept in the browser. Back up important text.'
      ], [
        '- **Laboratorio:** tus textos se guardan en el **navegador**.',
        '- **Mi sitio:** se guarda en la carpeta de QuantEdge de tu ordenador.',
        '- **Informes → Guardar en la biblioteca.**',
        '- **LinkedIn:** últimos 20 borradores en el navegador; usa **.txt** como copia.'
      ]],
      f: ['page_library', 'faq_portfolio_page', 'faq_privacy'] },

    { id: 'faq_research_report', type: 'faq',
      k: 'araştırma raporu|rapor oluştur|birden fazla analiz|analizleri birleştir|tek rapor|çok sayfalı pdf|rapor pdf|research report|combine analyses|multi page report|informe de análisis|combinar análisis',
      t: ['Araştırma raporu nasıl yapılır?', 'How do I make a research report?', '¿Cómo hago un informe de análisis?'],
      b: [[
        '**Sitem → Araştırma raporu**: yayınladığın 2–6 analizi seç, bir başlık, en az 120 karakterlik bir **yönetici özeti** ve en az 80 karakterlik bir **sonuç** yaz.',
        '',
        '- **PDF indir**: kapak, özet, her analiz için bir bölüm (bulgular, tez, grafikler, tablolar, riskler), sonuç ve bütün kaynaklarla çok sayfalı bir PDF. Hiçbir şey yayınlanmaz.',
        '- **Raporu siteme ekle**: sitende kalıcı bir r/… sayfası olur; rapor değişmez ve SHA-256 özeti sayfada yazar.',
        '- İpucu: aynı şirket için #24 Değerleme özeti, #21 DCF, #2 Kazanç kalitesi ve #27 Çeyreklik sonuç iyi bir rapor olur.'
      ], [
        '**Public Site → Research report**: pick 2–6 of your published analyses, write a title, an **executive summary** of at least 120 characters and a **conclusion** of at least 80.',
        '',
        '- **Download PDF**: a multi-page PDF with a cover, the summary, one part per analysis (findings, thesis, charts, tables, risks), the conclusion and every source. Nothing is published.',
        '- **Add report to my site**: a permanent r/… page; the report cannot change and its SHA-256 digest is printed on it.',
        '- Tip: for one company, #24 Valuation summary, #21 DCF, #2 Earnings quality and #27 Quarterly tracker make a good report.'
      ], [
        '**Mi sitio → Informe de análisis**: elige 2–6 análisis publicados, escribe un título, un resumen y una conclusión; descarga el PDF o añádelo a tu sitio.'
      ]],
      f: ['faq_portfolio_page', 'an_valuation_summary', 'an_quarterly'] },
    { id: 'faq_portfolio_page', type: 'faq',
      k: 'portföy sayfası|portföy sayfasını indir|cv için sayfa|araştırma portföyü|tek html|portfolio page|research portfolio|cv|üniversite başvurusu|página de portafolio',
      t: ['Portföy sayfası nedir?', 'What is the portfolio page?', '¿Qué es la página de portafolio?'],
      b: [[
        '**Kütüphane → Portföy sayfasını indir**: kayıtlı bütün analizlerin ve “Haklı mıydım?” kararların tek bir HTML dosyasında. İnternetsiz açılır; CV’ne, üniversite başvuruna ya da LinkedIn “Öne çıkanlar”a ekleyebilirsin.',
        '',
        'Herkesin tek linkle görebileceği bir site istiyorsan **Sitem** + GitHub Pages daha uygun.'
      ], [
        '**Library → Download portfolio page**: all saved analyses and “Was I right?” verdicts in one HTML file. It opens offline; add it to your CV, a university application or LinkedIn Featured.',
        '',
        'For a site anyone can open with one link, use **Public Site** + GitHub Pages.'
      ], [
        '**Biblioteca → Descargar página de portafolio**: todo en un único HTML que funciona sin conexión. Para un enlace público usa **Mi sitio**.'
      ]],
      go: ['Library', 'Public Site'], f: ['faq_site_publish', 'page_library', 'faq_was_i_right'] },

    { id: 'faq_pdf_report', type: 'faq',
      k: 'pdf rapor|rapor indir|pdf indir|html indir|raporu dışa aktar|rapor pdf|export pdf|download report|informe pdf|exportar',
      t: ['Uzun raporu PDF olarak nasıl alırım?', 'How do I export a report as PDF?', '¿Cómo exporto un informe en PDF?'],
      b: [[
        '1. **Raporlar** sayfasında başlığı, tezi, riskleri, katalizörleri ve kanıtları doldur (Laboratuvardaki **Rapor notlarına ekle** analiz sonucunu buraya taşır).',
        '2. Sağdan bir tasarım seç.',
        '3. **PDF indir** ya da **HTML indir**. Saklamak için **Kütüphaneye kaydet**.',
        '',
        'Dışa aktarılan raporlar şimdilik İngilizce ve “taslak” olarak işaretli; paylaşmadan önce **Kontrol** sekmesini çalıştır.'
      ], [
        '1. On **Reports** fill in the title, thesis, risks, catalysts and evidence (**Add to report notes** in the Lab sends an analysis here).',
        '2. Choose a layout on the right.',
        '3. **Export PDF** or **Download HTML**. **Save to Library** to keep it.',
        '',
        'Exports are in English for now and marked as drafts; run the **Review** tab before sharing.'
      ], [
        '1. En **Informes** completa título, tesis, riesgos y evidencia.',
        '2. Elige un diseño.',
        '3. **Exportar PDF** o **HTML**; **Guardar en la biblioteca**.'
      ]],
      go: ['Reports'], f: ['page_reports', 'faq_save', 'page_library'] },

    { id: 'faq_lang', type: 'faq',
      k: 'dil değiştir|dili değiştir|ingilizce yap|türkçe yap|ispanyolca|dil seçimi|tr en es|language|change language|switch language|cambiar idioma|idioma',
      t: ['Dili nasıl değiştiririm?', 'How do I change the language?', '¿Cómo cambio el idioma?'],
      b: [[
        'Sağ üstteki **TR / EN / ES** düğmesi bütün sayfaları birlikte değiştirir ve seçimin hatırlanır. Rakamlar da dile göre yazılır (TR: 215,94 milyar $ · %60,4).',
        '',
        'Bilinen sınırlar: İspanyolcada analiz bulguları, Rehber, Raporlar ve Kütüphane içeriği şimdilik İngilizce; indirilen PDF/HTML raporlar İngilizce; sunucu hata mesajları İngilizce kalabilir. Sitedeki her analiz yayınlandığı dilde kalır.'
      ], [
        'The **TR / EN / ES** switch at the top right changes every page at once and is remembered. Numbers follow the language too (EN: $215.94B · 60.4%).',
        '',
        'Known limits: in Spanish, analysis findings, the Guide, Reports and Library content are still in English; downloaded PDF/HTML reports are in English; server error messages may stay in English. Each analysis on your site keeps the language it was published in.'
      ], [
        'El botón **TR / EN / ES** arriba a la derecha cambia todas las páginas y se recuerda.',
        '',
        'Límites: en español, los hallazgos de los análisis, la Guía, Informes y Biblioteca siguen en inglés.'
      ]],
      f: ['faq_data_sources', 'page_about', 'faq_first_steps'] },

    { id: 'faq_data_sources', type: 'faq',
      k: 'veriler nereden|veri kaynağı|veriler güncel mi|veri ne kadar güncel|gecikme|canlı fiyat|fiyatlar nereden|fiyat verisi nereden|yahoo|yahoo finance|kaynaklar|data source|where does the data come from|is the data live|data freshness|fuentes de datos|datos actualizados',
      t: ['Veriler nereden geliyor, ne kadar güncel?', 'Where does the data come from and how fresh is it?', '¿De dónde vienen los datos y qué tan actuales son?'],
      b: [[
        '- **Finansal tablolar:** SEC EDGAR XBRL “companyfacts” – şirketin en son yayınladığı 10-K (ve 10-Q). Her kaynakta yayın tarihi ve 10-K linki yazar.',
        '- **Fiyatlar:** Yahoo Finance, bölünme ve temettüye göre düzeltilmiş **günlük kapanışlar**. Canlı (anlık) fiyat değil; son kapanış.',
        '- **Kur ve BIST:** Yahoo USD/TRY ve BIST 100 (XU100.IS).',
        '- **Açıklama tarihleri:** SEC 8-K “Item 2.02”.',
        '',
        'İndirilen veriler bilgisayarında önbelleğe alınır; her sonucun üstünde **Veri tarihi** yazar. Rakam bulunamazsa uydurulmaz, “—” görünür.'
      ], [
        '- **Financial statements:** SEC EDGAR XBRL “companyfacts” – the company’s latest 10-K (and 10-Q). Each source shows the filing date and a link to the 10-K.',
        '- **Prices:** Yahoo Finance **daily closes**, adjusted for splits and dividends. Not live prices; the last close.',
        '- **FX and BIST:** Yahoo USD/TRY and the BIST 100 (XU100.IS).',
        '- **Results dates:** SEC 8-K “Item 2.02”.',
        '',
        'Downloaded data is cached on your computer; each result shows a **Data as of** date. Missing figures are never invented; they show “—”.'
      ], [
        '- **Estados financieros:** SEC EDGAR XBRL (último 10-K y 10-Q), con fecha y enlace.',
        '- **Precios:** cierres diarios de Yahoo Finance ajustados; no son precios en vivo.',
        '- **Divisa y BIST:** USD/TRY y BIST 100 de Yahoo.',
        '',
        'Cada resultado muestra su fecha de datos. Nada se inventa.'
      ]],
      f: ['term_sec_docs', 'faq_internet', 'faq_privacy'] },

    { id: 'faq_internet', type: 'faq',
      k: 'internet gerekli mi|internetsiz çalışır mı|çevrimdışı|offline|bağlantı hatası|ağ hatası|internet yok|need internet|works offline|connection error|sin conexión|necesita internet',
      t: ['İnternet gerekli mi?', 'Do I need the internet?', '¿Necesito internet?'],
      b: [[
        'QuantEdge bilgisayarında çalışır, ama **yeni veri indirmek** için internet gerekir: SEC raporları ve Yahoo fiyatları. Daha önce indirilen veriler önbellekten gelir.',
        '',
        'Bu yardım asistanı, “Bu ne demek?” açıklamaları, indirilen site ZIP’i ve portföy sayfası **tamamen internetsiz** çalışır. Siteyi GitHub’a yüklemek ve LinkedIn’de paylaşmak için tabii ki internet gerekir.'
      ], [
        'QuantEdge runs on your computer, but **downloading new data** needs the internet: SEC filings and Yahoo prices. Data downloaded before comes from the cache.',
        '',
        'This help assistant, the “What does this mean?” explanations, the downloaded site ZIP and the portfolio page work **fully offline**. Uploading to GitHub and posting on LinkedIn of course need the internet.'
      ], [
        'Para **descargar datos nuevos** (SEC, Yahoo) hace falta internet. Este asistente y las explicaciones funcionan **sin conexión**.'
      ]],
      f: ['faq_bot', 'faq_first_run', 'faq_privacy'] },

    { id: 'faq_privacy', type: 'faq',
      k: 'hesap açmak|hesap açmam lazım mı|kayıt olmak|giriş yapmak|şifre|gizlilik|verilerim güvende mi|kişisel veri|takip ediyor mu|veri toplama|hesap gerekli mi|üyelik|yerel mi|privacy|is my data safe|tracking|do i need an account|privacidad|mis datos',
      t: ['Gizlilik: verilerim nereye gidiyor?', 'Privacy: where does my data go?', 'Privacidad: ¿adónde van mis datos?'],
      b: [[
        'QuantEdge **yerel**, tek kullanıcılı bir uygulama: hesap, bulut, reklam ya da takip yok.',
        '',
        '- Yazdıkların, raporların, kütüphane ve site ayarların bu bilgisayarda kalır.',
        '- İnternete giden tek şeyler: herkese açık veri istekleri (SEC, Yahoo Finance, faiz oranları ve araştırma veri setleri; SEC isteğinde iletişim e-postan).',
        '- Herkese açık olan sadece senin GitHub’a yüklediğin site ve LinkedIn’de paylaştıklarındır.',
        '- Bu yardım asistanı soruları bilgisayarında yanıtlar; hiçbir soru dışarı gönderilmez.'
      ], [
        'QuantEdge is a **local**, single-user app: no account, cloud, ads or tracking.',
        '',
        '- Your writing, reports, library and site settings stay on this computer.',
        '- The only things that go online: requests for public data (SEC, Yahoo Finance, interest rates and research datasets; your contact email in SEC requests).',
        '- Only the site you upload to GitHub and what you post on LinkedIn become public.',
        '- This help assistant answers on your computer; no question is sent anywhere.'
      ], [
        'QuantEdge es **local**: sin cuenta, nube, anuncios ni rastreo. Solo salen peticiones de datos públicos (SEC, Yahoo Finance, tipos de interés y bases de datos de investigación). Este asistente responde en tu ordenador.'
      ]],
      go: ['About'], f: ['faq_sec_email', 'faq_site_public', 'faq_bot'] },

    { id: 'faq_advice', type: 'faq',
      k: 'yatırım tavsiyesi|tavsiye verir misin|hangi hisseyi almalıyım|alayım mı|almalı mıyım|satayım mı|hisse önerisi|hedef fiyat ne|yükselir mi|düşer mi|ne alayım|investment advice|should i buy|should i sell|what should i buy|stock tip|price target|consejo de inversión|debería comprar|qué compro',
      t: ['Yatırım tavsiyesi veriyor musun?', 'Do you give investment advice?', '¿Das consejos de inversión?'],
      b: [[
        '**Hayır – bir hisseyi alman ya da satman gerektiğini söyleyemem.** QuantEdge bir eğitim ve araştırma aracıdır; hiçbir çıktısı yatırım tavsiyesi değildir.',
        '',
        'Ama bir şirketi kendin araştırmana yardım edebilirim:',
        '',
        '1. **#2 Kazanç kalitesi** ve **#11 DuPont** – kâr gerçek mi, neyle geliyor?',
        '2. **#14 ROIC – WACC** – şirket değer yaratıyor mu?',
        '3. **#15 Benzer şirket çarpanları** ve **#4 Ters DCF** – fiyat ne varsayıyor, rakiplere göre nerede?',
        '4. **#17 Altman Z** ve **#19 Kriz davranışı** – riskler neler?',
        '',
        'Sonra kendi görüşünü ve **neden yanılıyor olabileceğini** yaz. İstersen yayınlarken bir endekse göre **açık görüş** (olumlu / nötr / olumsuz) seçebilirsin; bu bir al-sat önerisi değildir.',
        '',
        'Gerçek parayla karar vermeden önce bir velin ya da lisanslı bir danışmanla konuş.'
      ], [
        '**No – I can’t tell you to buy or sell a stock.** QuantEdge is an educational research tool; none of its outputs is investment advice.',
        '',
        'But I can help you research the company yourself:',
        '',
        '1. **#2 Earnings quality** and **#11 DuPont** – is the profit real, and what drives it?',
        '2. **#14 ROIC vs WACC** – does it create value?',
        '3. **#15 Comparable multiples** and **#4 Reverse DCF** – what does the price assume, and how does it compare with peers?',
        '4. **#17 Altman Z** and **#19 Crisis behaviour** – what are the risks?',
        '',
        'Then write your own view and **why you might be wrong**. When you publish you can add an **explicit view** against an index (positive / neutral / negative); it is not a buy or sell call.',
        '',
        'Before any real-money decision, talk to a parent or a licensed adviser.'
      ], [
        '**No: no puedo decirte que compres o vendas una acción.** QuantEdge es una herramienta educativa; nada es asesoramiento de inversión.',
        '',
        'Pero puedo ayudarte a investigar:',
        '',
        '1. **#2 Calidad de beneficios** y **#11 DuPont**.',
        '2. **#14 ROIC frente a WACC**.',
        '3. **#15 Múltiplos** y **#4 DCF inverso**.',
        '4. **#17 Altman Z** y **#19 Crisis**.',
        '',
        'Antes de decidir con dinero real, habla con un adulto o un asesor autorizado.'
      ]],
      go: ['Analysis Lab'], f: ['an_earnings_quality', 'faq_call_no_rating', 'faq_overclaim'] },

    { id: 'faq_start_mac', type: 'faq',
      k: 'nasıl başlatılır|uygulamayı aç|programı çalıştır|mac te nasıl açarım|start command|uvicorn|terminal komutu|kurulum|yükleme|quantedge kurulumu|install|how to start|run the app|launch|cómo iniciar|instalar|sunucu kapalı|sunucu çalışmıyor|localhost kapalı|server closed|server is down|servidor cerrado',
      t: ['QuantEdge’i Mac’te nasıl başlatırım?', 'How do I start QuantEdge on a Mac?', '¿Cómo inicio QuantEdge en un Mac?'],
      b: [[
        '**Kolay yol:** QuantEdge klasöründeki **start.command** dosyasına çift tıkla. Gerekli paketleri kurar ve tarayıcıda **http://127.0.0.1:8775** adresini açar. Terminal penceresi açık kalmalı.',
        '',
        '**Elle:** Terminal’de klasöre gir (`cd` yazıp klasörü pencereye sürükle, Enter) ve:',
        '',
        '- `python3 -m pip install -r requirements-api.txt`',
        '- `python3 -m uvicorn quantedge_api:app --host 127.0.0.1 --port 8775`',
        '',
        'Sonra tarayıcıda http://127.0.0.1:8775 adresini aç. Kapatmak için Terminal’de **Ctrl+C**.'
      ], [
        '**Easy way:** double-click **start.command** in the QuantEdge folder. It installs the packages and opens **http://127.0.0.1:8775** in your browser. Keep the Terminal window open.',
        '',
        '**By hand:** in Terminal go to the folder (type `cd `, drag the folder onto the window, press Enter) and run:',
        '',
        '- `python3 -m pip install -r requirements-api.txt`',
        '- `python3 -m uvicorn quantedge_api:app --host 127.0.0.1 --port 8775`',
        '',
        'Then open http://127.0.0.1:8775. Press **Ctrl+C** in Terminal to stop it.'
      ], [
        '**Fácil:** doble clic en **start.command**; abre **http://127.0.0.1:8775**. Deja abierta la ventana de Terminal.',
        '',
        '**A mano**, en la carpeta:',
        '',
        '- `python3 -m pip install -r requirements-api.txt`',
        '- `python3 -m uvicorn quantedge_api:app --host 127.0.0.1 --port 8775`'
      ]],
      f: ['faq_port_in_use', 'faq_module', 'faq_old_version'] },

    { id: 'faq_port_in_use', type: 'faq',
      k: 'address already in use|adres zaten kullanımda|adres kullanımda|port dolu|port meşgul|errno 48|port kullanımda|port already in use|dirección en uso|puerto ocupado',
      t: ['“Address already in use” hatası', '“Address already in use” error', 'Error “Address already in use”'],
      b: [[
        'Bu, **8775** portunda zaten bir program (çoğunlukla açık kalmış eski bir QuantEdge) çalışıyor demek.',
        '',
        '- **Çözüm 1:** eski Terminal penceresini bul ve **Ctrl+C** ile durdur, sonra tekrar başlat.',
        '- **Çözüm 2:** başka bir port kullan: `--port 8775` yerine `--port 8773` yaz ve tarayıcıda http://127.0.0.1:8773 adresini aç.',
        '- **Çözüm 3:** portu kimin tuttuğunu gör: `lsof -i :8775`, sonra `kill 12345` (12345 yerine çıktıdaki PID numarası).'
      ], [
        'Something is already running on port **8775** (usually an old QuantEdge you left open).',
        '',
        '- **Fix 1:** find the old Terminal window and stop it with **Ctrl+C**, then start again.',
        '- **Fix 2:** use another port: write `--port 8773` instead of `--port 8775` and open http://127.0.0.1:8773.',
        '- **Fix 3:** see who holds the port: `lsof -i :8775`, then `kill 12345` (use the PID number from the output).'
      ], [
        'Ya hay un programa en el puerto **8775** (normalmente un QuantEdge antiguo).',
        '',
        '- Detenlo con **Ctrl+C** en su Terminal, o',
        '- usa otro puerto: `--port 8773` y abre http://127.0.0.1:8773.'
      ]],
      f: ['faq_start_mac', 'faq_old_version', 'faq_module'] },

    { id: 'faq_local_only', type: 'faq',
      k: 'only answers on 127.0.0.1|requests from other web sites|quantedge_allowed_hosts|başka cihazdan aç|telefondan aç|telefondan açılmıyor|başka bilgisayardan|from another device|from my phone|desde otro dispositivo|desde el móvil|dns rebinding',
      t: ['“Only answers on 127.0.0.1” ya da “Requests from other web sites” mesajı', '“Only answers on 127.0.0.1” or “Requests from other web sites” message', 'Mensaje “Only answers on 127.0.0.1” o “Requests from other web sites”'],
      b: [[
        'QuantEdge’in yerel API’sinde giriş yok; bu yüzden yalnızca kendi sayfasına ve bilgisayardaki betiklere (Python istemcisi, not defteri) cevap verir.',
        '',
        '- **Requests from other web sites (403):** tarayıcında açık başka bir site QuantEdge’e arka planda istek göndermeye çalıştı ve engellendi. QuantEdge’i normal kullanırken bunu görmezsin.',
        '- **Only answers on 127.0.0.1 or localhost (400):** uygulamayı başka bir adresle açtın (ör. bilgisayarın ağ adı ya da IP’si). **http://127.0.0.1:8775** adresini kullan.',
        '- Başka bir cihazdan (ör. telefondan) açmak istersen sunucuyu o ada izin vererek başlat: `QUANTEDGE_ALLOWED_HOSTS=bilgisayar-adi.local python3 -m uvicorn quantedge_api:app --host 0.0.0.0 --port 8775`. Bunu yalnızca güvendiğin ev ağında yap.'
      ], [
        'The local QuantEdge API has no login, so it answers only its own page and scripts on this computer (the Python client, notebooks).',
        '',
        '- **Requests from other web sites (403):** another site open in your browser tried to send QuantEdge a request in the background, and it was refused. You will not see this while using QuantEdge normally.',
        '- **Only answers on 127.0.0.1 or localhost (400):** you opened the app under another address (the computer’s network name or IP). Use **http://127.0.0.1:8775**.',
        '- To open it from another device (e.g. your phone), start the server with that name allowed: `QUANTEDGE_ALLOWED_HOSTS=my-mac.local python3 -m uvicorn quantedge_api:app --host 0.0.0.0 --port 8775`. Only do this on a home network you trust.'
      ], [
        'La API local de QuantEdge no tiene inicio de sesión, así que solo responde a su propia página y a los scripts de este ordenador.',
        '',
        '- **Requests from other web sites (403):** otra web abierta en el navegador intentó enviar una petición a QuantEdge y se rechazó.',
        '- **Only answers on 127.0.0.1 or localhost (400):** abriste la app con otra dirección. Usa **http://127.0.0.1:8775**.',
        '- Para abrirla desde otro dispositivo: `QUANTEDGE_ALLOWED_HOSTS=mi-mac.local python3 -m uvicorn quantedge_api:app --host 0.0.0.0 --port 8775`, solo en una red doméstica de confianza.'
      ]],
      f: ['faq_start_mac', 'faq_port_in_use'] },

    { id: 'faq_module', type: 'faq',
      k: 'module not found|modulenotfounderror|no module named|modül bulunamadı|fastapi bulunamadı|uvicorn bulunamadı|pip hatası|python bulunamadı|command not found|paket eksik|módulo no encontrado',
      t: ['“ModuleNotFoundError / No module named …” hatası', '“ModuleNotFoundError / No module named …” error', 'Error “No module named …”'],
      b: [[
        'Gerekli Python paketleri bu Python’a kurulmamış.',
        '',
        '1. QuantEdge klasöründe olduğundan emin ol (`ls` yazınca **quantedge_api.py** görünmeli).',
        '2. `python3 -m pip install -r requirements-api.txt` çalıştır.',
        '3. Sunucuyu **aynı** Python ile başlat: `python3 -m uvicorn quantedge_api:app --host 127.0.0.1 --port 8775`.',
        '',
        '“python3: command not found” görürsen Python 3’ü python.org’dan kur. En kolayı **start.command**’a çift tıklamak; paketleri kendisi kurar.'
      ], [
        'The required Python packages are not installed for this Python.',
        '',
        '1. Make sure you are in the QuantEdge folder (`ls` should show **quantedge_api.py**).',
        '2. Run `python3 -m pip install -r requirements-api.txt`.',
        '3. Start the server with the **same** Python: `python3 -m uvicorn quantedge_api:app --host 127.0.0.1 --port 8775`.',
        '',
        'If you see “python3: command not found”, install Python 3 from python.org. Easiest: double-click **start.command**, which installs the packages itself.'
      ], [
        'Faltan paquetes de Python.',
        '',
        '1. Entra en la carpeta de QuantEdge.',
        '2. `python3 -m pip install -r requirements-api.txt`',
        '3. Inicia con el mismo Python. O haz doble clic en **start.command**.'
      ]],
      f: ['faq_start_mac', 'faq_port_in_use', 'faq_old_version'] },

    { id: 'faq_old_version', type: 'faq',
      k: 'bembeyaz|sayfa bembeyaz|beyaz sayfa|eski sürüm görünüyor|eski versiyon|değişiklikler görünmüyor|sayfa güncellenmiyor|not found hatası|detail not found|yanlış klasör|boş sayfa|beyaz ekran|cmd shift r|önbellek|old version|page not updating|blank page|wrong folder|versión antigua|página en blanco',
      t: ['Eski sürüm ya da “Not Found” görünüyor', 'An old version or “Not Found” shows', 'Aparece una versión antigua o “Not Found”'],
      b: [[
        '- **Eski görünüm:** tarayıcı eski dosyaları önbellekten gösteriyor. **Cmd+Shift+R** ile zorla yenile.',
        '- **Hâlâ eski:** büyük ihtimalle eski bir QuantEdge klasöründen başlatılmış bir sunucu açık. Tüm eski Terminal pencerelerini **Ctrl+C** ile kapat ve yeni klasörden başlat (gerekirse başka port).',
        '- **{"detail":"Not Found"}:** yanlış klasördesin. Klasörde `ls frontend/index.html` çalıştır; dosya yoksa doğru klasöre `cd` ile gir.',
        '- **Boş/beyaz sayfa:** Cmd+Shift+R dene; sürmezse Terminal’deki hata mesajına bak.',
        '',
        'Sürüm numarası sayfanın altında ve `version.py` dosyasında yazar.'
      ], [
        '- **Old look:** the browser shows cached files. Force-reload with **Cmd+Shift+R**.',
        '- **Still old:** most likely a server started from an old QuantEdge folder is still running. Stop every old Terminal window with **Ctrl+C** and start from the new folder (another port if needed).',
        '- **{"detail":"Not Found"}:** you are in the wrong folder. Run `ls frontend/index.html` there; if it is missing, `cd` into the right folder.',
        '- **Blank page:** try Cmd+Shift+R; if it persists, read the error in Terminal.',
        '',
        'The version number is shown at the bottom of the page and in `version.py`.'
      ], [
        '- **Aspecto antiguo:** recarga con **Cmd+Shift+R**.',
        '- **Sigue antiguo:** hay un servidor viejo abierto; ciérralo con **Ctrl+C** y arranca desde la carpeta nueva.',
        '- **{"detail":"Not Found"}:** carpeta equivocada; comprueba `ls frontend/index.html`.'
      ]],
      f: ['faq_start_mac', 'faq_port_in_use', 'faq_module'] },

    { id: 'faq_no_data', type: 'faq',
      k: 'veri bulunamadı|rakam yok|tire görünüyor|boş tablo|grafik boş|hata verdi|analiz hata|şirket bulunamadı|kod bulunamadı|geçersiz kod|ticker hatası|henüz seçilmedi|no data|empty chart|error running analysis|ticker not found|sin datos|error',
      t: ['Analiz hata verdi ya da rakamlar “—”', 'The analysis failed or figures show “—”', 'El análisis falló o las cifras salen “—”'],
      b: [[
        '- **Kodu kontrol et:** ABD kodu mu (AAPL), BIST mi (THYAO)? Kod yazıp seçmediysen “henüz seçilmedi” uyarısı çıkar – **Seç**’e ya da Enter’a bas.',
        '- **Şirket türü:** 20-F veren yabancı şirket, banka/sigorta ya da yeni halka arz olabilir (az yıl veri).',
        '- **“—”:** şirket o kalemi raporlamıyor. QuantEdge rakam uydurmaz.',
        '- **SEC e-postası** yazılı mı? İnternet bağlantın var mı?',
        '- Hata mesajı genelde sebebi söyler (bazen İngilizce). Önce **Örneği kullan** ile çalıştığını doğrula.'
      ], [
        '- **Check the ticker:** a US ticker (AAPL) or BIST (THYAO)? If you typed it but did not select it, a “not selected yet” notice appears – press **Select** or Enter.',
        '- **Company type:** it may be a foreign 20-F filer, a bank/insurer or a recent IPO (few years of data).',
        '- **“—”:** the company does not report that item. QuantEdge never invents figures.',
        '- Is the **SEC email** filled in? Are you online?',
        '- The error message usually says why. First check that **Use the example** works.'
      ], [
        '- **Revisa el ticker** y selecciónalo.',
        '- Puede ser una empresa extranjera (20-F), un banco o una salida a bolsa reciente.',
        '- **“—”:** la empresa no reporta esa partida; nada se inventa.',
        '- ¿Escribiste el email para la SEC? ¿Tienes internet?'
      ]],
      f: ['faq_companies', 'faq_first_run', 'faq_xom'] },

    { id: 'faq_delisted', type: 'faq',
      k: 'borsadan çıkmış|delist|satın alınan şirket fiyatı yok|hedef fiyatı bulunamadı|defm14a|duyuru öncesi fiyat|elle fiyat gir|delisted target|target price missing|excluida de bolsa|precio previo',
      t: ['Birleşmede hedef şirketin fiyatı bulunamıyor', 'The M&A target’s price cannot be found', 'No se encuentra el precio del objetivo en una fusión'],
      b: [[
        'Satın alma tamamlanınca hedef şirket genelde **borsadan çıkar** ve fiyat geçmişi artık indirilemez.',
        '',
        '1. **#16 Birleşme vakası**’nda “hedefin duyuru öncesi fiyatı” kutusuna fiyatı **elle yaz**.',
        '2. Kaynak: birleşme bildirimi (**DEFM14A**, SEC EDGAR’da) ya da güvenilir bir haber.',
        '3. Hedef kodu kutusunu boş bırakabilirsin; prim, yazdığın fiyat ve teklif fiyatıyla hesaplanır.',
        '',
        'Kaynağı yayınlarken belirtmeyi unutma.'
      ], [
        'When a deal completes the target is usually **delisted** and its price history can no longer be downloaded.',
        '',
        '1. In **#16 M&A case study**, **type** the price into “target price before announcement”.',
        '2. Source: the merger proxy (**DEFM14A**, on SEC EDGAR) or a reliable news report.',
        '3. You can leave the target ticker empty; the premium uses your price and the offer price.',
        '',
        'Mention that source when you publish.'
      ], [
        'Tras la compra, el objetivo suele **salir de bolsa**. En **#16** escribe a mano el precio previo (del **DEFM14A** o de la prensa).'
      ]],
      go: ['Analysis Lab'], f: ['an_deal_case', 'term_sec_docs', 'faq_no_data'] },

    { id: 'faq_params', type: 'faq',
      k: 'parametreler|ayarları değiştir|wacc değiştir|varsayımları değiştir|büyüme oranı gir|risksiz faiz|terminal büyüme değiştir|change assumptions|parameters|settings|parámetros|cambiar supuestos',
      t: ['Varsayımları (WACC, büyüme…) nasıl değiştiririm?', 'How do I change assumptions (WACC, growth…)?', '¿Cómo cambio los supuestos (WACC, crecimiento…)?'],
      b: [[
        'Bazı analizlerin kod kutusunun altında ayar alanları var: ters DCF ve senaryolarda **WACC** (%9) ve **sonsuz büyüme** (%3), ROIC’te WACC, beta’da risksiz faiz ve piyasa risk primi, strateji testinde ortalama günleri, ücret ve eğitim payı, birleşmede tarih ve fiyatlar.',
        '',
        'Boş bırakılan alan şirketin kendi verisinden hesaplanır. Değiştirdiğin varsayımı gönderinde **açıkça yaz**; okuyucu sonucun neye bağlı olduğunu bilmeli.'
      ], [
        'Some analyses have settings under the ticker box: **WACC** (9%) and **terminal growth** (3%) in reverse DCF and scenarios, WACC in ROIC, risk-free rate and risk premium in beta, moving-average days, fees and training share in the strategy test, dates and prices in the M&A case.',
        '',
        'A blank field is computed from the company’s own data. **State** any assumption you change in your post; readers need to know what the result depends on.'
      ], [
        'Algunos análisis tienen ajustes bajo la casilla de tickers (WACC, crecimiento terminal, tasa libre de riesgo…). Un campo vacío se calcula con los datos de la empresa. Indica en tu publicación los supuestos que cambies.'
      ]],
      go: ['Analysis Lab'], f: ['term_wacc', 'an_scenarios', 'an_reverse_dcf'] },

    { id: 'faq_example', type: 'faq',
      k: 'örnek kodlar|örneği kullan|hangi kodu yazayım|hangi şirketi seçeyim|örnek şirket|ticker nedir|hisse kodu|use the example|example tickers|what is a ticker|ticker de ejemplo|qué es un ticker',
      t: ['Hangi kodları yazmalıyım? (örnekler)', 'Which tickers should I type? (examples)', '¿Qué tickers escribo? (ejemplos)'],
      b: [[
        '**Hisse kodu (ticker)** borsadaki kısa addır: Apple = AAPL, Coca-Cola = KO, THY = THYAO.',
        '',
        'Her analizde **Örneği kullan** düğmesi o analize uygun kodları doldurur (ör. döngü için NUE, STLD, CLF; çarpanlar için NVDA, AMD, INTC, AVGO). Kodu bilmiyorsan şirket adını yazmaya başla (“coca”); öneriler çıkar.',
        '',
        'Karşılaştırmalarda **aynı sektörden** şirketler seç; farklı iş modelleri karşılaştırmayı anlamsızlaştırır.'
      ], [
        'A **ticker** is the short exchange name: Apple = AAPL, Coca-Cola = KO, Turkish Airlines = THYAO.',
        '',
        'Each analysis has a **Use the example** button that fills suitable tickers (e.g. NUE, STLD, CLF for the cycle; NVDA, AMD, INTC, AVGO for multiples). Don’t know the ticker? Start typing the name (“coca”) and suggestions appear.',
        '',
        'For comparisons pick companies from the **same industry**; different business models make the comparison meaningless.'
      ], [
        'Un **ticker** es el nombre corto en bolsa (Apple = AAPL). El botón **Usar el ejemplo** rellena tickers adecuados. Compara empresas del **mismo sector**.'
      ]],
      go: ['Analysis Lab'], f: ['faq_companies', 'faq_first_steps', 'page_lab'] },

    { id: 'faq_ai', type: 'faq',
      k: 'yapay zeka|yapay zekâ|ai mı|chatgpt|gpt|metni yapay zeka mı yazıyor|otomatik yorum|artificial intelligence|is it ai|llm|inteligencia artificial',
      t: ['QuantEdge yapay zekâ kullanıyor mu?', 'Does QuantEdge use AI?', '¿QuantEdge usa inteligencia artificial?'],
      b: [[
        '**Hayır.** Rakamlar SEC ve Yahoo verilerinden formüllerle hesaplanır; LinkedIn metinleri bu rakamlardan **şablonla** oluşturulur. Yapay zekâ ücreti, API anahtarı ya da otomatik piyasa yorumu yok.',
        '',
        'Bu yardım asistanı da yapay zekâ değil: bu bilgisayardaki hazır bir bilgi tabanında anahtar kelime eşleştirmesi yapar. Bilmediği soruda bunu açıkça söyler.',
        '',
        'Rehber’de kendi çalışmanda yapay zekâ kullandıysan bunu **beyan etmen** istenir.'
      ], [
        '**No.** Figures are computed with formulas from SEC and Yahoo data; LinkedIn texts are built from those figures with **templates**. No AI fees, API keys or automatic market commentary.',
        '',
        'This help assistant is not AI either: it matches keywords against a built-in knowledge base on this computer, and says so when it does not know.',
        '',
        'In the Guide you are asked to **declare** any AI use in your own work.'
      ], [
        '**No.** Las cifras se calculan con fórmulas y los textos con **plantillas**. Este asistente tampoco es IA: busca palabras clave en una base de conocimiento local.'
      ]],
      f: ['faq_bot', 'faq_thesis_required', 'page_about'] },

    { id: 'faq_bot', type: 'faq',
      k: 'sen kimsin|bu bot ne|yardım asistanı|asistan nasıl çalışır|ne yapabilirsin|neler sorabilirim|yardım|help|who are you|what can you do|what can i ask|ayuda|quién eres|qué puedes hacer',
      t: ['Bu yardım asistanı ne yapabilir?', 'What can this help assistant do?', '¿Qué puede hacer este asistente?'],
      b: [[
        'Ben QuantEdge’in **çevrimdışı** yardım asistanıyım. İnternet ya da API anahtarı kullanmam; sorularını bu bilgisayarda, hazır bir bilgi tabanıyla yanıtlarım.',
        '',
        'Bana sorabileceklerin:',
        '',
        '- Sayfalar: “Sitem nasıl kullanılır?”, “Kütüphane ne işe yarar?”',
        '- 30 analiz: “ters dcf ne işe yarar?”, “altman z nasıl okunur?”',
        '- Terimler: “wacc nedir?”, “serbest nakit akışı ne?”',
        '- Yayınlama: “carousel nasıl yüklenir?”, “sitemi nasıl yayınlarım?”',
        '- Hatalar: “address already in use”, “eski sürüm görünüyor”',
        '',
        'Bilmediğim bir şeyse uydurmam; en yakın konuları gösteririm.'
      ], [
        'I am QuantEdge’s **offline** help assistant. I use no internet or API key; I answer on this computer from a built-in knowledge base.',
        '',
        'You can ask me about:',
        '',
        '- Pages: “how do I use Public Site?”, “what is the Library for?”',
        '- The 30 analyses: “what is a reverse DCF for?”, “how to read Altman Z?”',
        '- Terms: “what is WACC?”, “free cash flow?”',
        '- Publishing: “upload a LinkedIn carousel”, “publish my site”',
        '- Errors: “address already in use”, “old version showing”',
        '',
        'If I don’t know something I won’t make it up; I show the closest topics.'
      ], [
        'Soy el asistente **sin conexión** de QuantEdge. No uso internet ni claves de API.',
        '',
        '- Páginas, los 30 análisis, términos, publicación y errores.',
        '',
        'Si no sé algo, no lo invento: te muestro los temas más cercanos.'
      ]],
      f: ['page_about', 'faq_first_steps', 'page_lab'] },

    { id: 'faq_spanish', type: 'faq',
      k: 'ispanyolca bulgular ingilizce|neden ingilizce|ingilizce görünüyor|çeviri eksik|why english|english text|por qué en inglés|traducción',
      t: ['Bazı yazılar neden İngilizce?', 'Why is some text in English?', '¿Por qué hay textos en inglés?'],
      b: [[
        'Arayüz Türkçe, İngilizce ve İspanyolca. Bazı yerler henüz çevrilmedi:',
        '',
        '- İspanyolcada analiz bulguları, Rehber, Raporlar ve Kütüphane içeriği İngilizce.',
        '- İndirilen PDF/HTML raporlar İngilizce.',
        '- Sunucu hata mesajları, şirket adları ve SEC belge adları İngilizce kalabilir (kaynaktan geldiği gibi).'
      ], [
        'The interface is in Turkish, English and Spanish. Some parts are not translated yet:',
        '',
        '- In Spanish, analysis findings, the Guide, Reports and Library content are in English.',
        '- Downloaded PDF/HTML reports are in English.',
        '- Server error messages, company names and SEC document names may stay in English (as they come from the source).'
      ], [
        'Algunas partes aún no están traducidas: en español, los hallazgos de los análisis, la Guía, Informes y Biblioteca; los PDF/HTML descargados; y los mensajes de error del servidor.'
      ]],
      f: ['faq_lang', 'page_reports', 'faq_data_sources'] },

    { id: 'faq_cv', type: 'faq',
      k: 'cv ye ekle|özgeçmiş|linkedin profiline ekle|öne çıkanlar|featured|üniversite başvurusu için|staj başvurusu|add to cv|add to linkedin profile|currículum|perfil de linkedin',
      t: ['Çalışmamı CV’me ve LinkedIn profilime nasıl eklerim?', 'How do I add my work to my CV and LinkedIn profile?', '¿Cómo añado mi trabajo al CV y a LinkedIn?'],
      b: [[
        '1. **Sitem** ile siteni GitHub Pages’te yayınla; adresin **https://KULLANICIADIN.github.io/analizler/** olur.',
        '2. LinkedIn: Profil → **Bölüm ekle → Öne çıkanlar → Bağlantı ekle**, ya da **İletişim bilgileri → Web sitesi**.',
        '3. CV’ne bu linki “Araştırma portföyü” başlığıyla ekle.',
        '',
        'Alternatif: **Kütüphane → Portföy sayfasını indir** ile tek bir HTML dosyası alıp başvuruna ekleyebilirsin.'
      ], [
        '1. Publish your site on GitHub Pages from **Public Site**; the address is **https://USERNAME.github.io/analizler/**.',
        '2. LinkedIn: Profile → **Add section → Featured → Add a link**, or **Contact info → Website**.',
        '3. Put the link on your CV under “Research portfolio”.',
        '',
        'Alternative: **Library → Download portfolio page** gives you one HTML file to attach to an application.'
      ], [
        '1. Publica tu sitio con **Mi sitio** y GitHub Pages.',
        '2. LinkedIn: Perfil → **Añadir sección → Destacados → Añadir enlace**.',
        '3. Añade el enlace a tu CV.'
      ]],
      go: ['Public Site', 'Library'], f: ['faq_site_publish', 'faq_portfolio_page', 'faq_was_i_right'] },

    /* ───────────────────────────── small talk ───────────────────────────── */
    { id: 'chat_hello', type: 'chat',
      k: 'merhaba|selam|selamlar|günaydın|iyi akşamlar|hey|hello|hi|good morning|hola|buenos días',
      t: ['Merhaba', 'Hello', 'Hola'],
      b: [[
        'Merhaba! QuantEdge hakkında ne merak ediyorsan sor: bir sayfanın nasıl kullanıldığı, analizlerden biri, bir finans terimi ya da bir hata mesajı.'
      ], [
        'Hello! Ask me anything about QuantEdge: how a page works, one of the analyses, a finance term or an error message.'
      ], [
        '¡Hola! Pregúntame lo que quieras sobre QuantEdge: una página, un análisis, un término o un error.'
      ]],
      f: ['faq_bot', 'faq_first_steps', 'page_about'] },

    { id: 'chat_thanks', type: 'chat',
      k: 'sağol kanka|teşekkürler kanka|eyvallah kanka|çok sağol|teşekkürler|teşekkür ederim|sağ ol|sağol|eyvallah|süper|harika|thanks|thank you|great|gracias',
      t: ['Teşekkürler', 'Thanks', 'Gracias'],
      b: [[
        'Rica ederim! Başka bir sorun olursa buradayım. İyi analizler.'
      ], [
        'You’re welcome! I’m here if you have another question. Happy researching.'
      ], [
        '¡De nada! Aquí estoy si tienes otra pregunta.'
      ]],
      f: ['faq_first_steps', 'faq_site_publish', 'faq_carousel'] }
  ]
};

/* Relative noise band (noise_band.py) and the ideas behind it: Brownian motion, z score, Monte Carlo. */
QE_HELP_KB.entries.push(
  { id: 'faq_noise_band', type: 'faq', page: 'Analysis Lab',
    k: 'gürültü bandı|gürültü bandı nedir|gürültü|şans payı|rastlantı|sadece rastlantıyla|3 seferden 2|şans ne kadar fark yaratır|noise band|what is the noise band|luck|by chance alone|banda de ruido|qué es la banda de ruido|azar',
    t: ['Gürültü bandı nedir?', 'What is the noise band?', '¿Qué es la banda de ruido?'],
    b: [[
      '**Gürültü bandı**, bir hisse ile kıyaslama endeksi arasında **sadece rastlantıyla** ne kadar fark oluşabileceğini gösterir. Bir **tahmin değildir**: rastgele yürüyüş modeline göre olası sonuç aralığıdır.',
      '',
      '- **Açık görüş** kutusunda yönü ve vadeyi seçince QuantEdge hissenin endekse göre günlük getirisinin son 3 yıldaki oynaklığını ölçer.',
      '- Bu oynaklık vadeye göre büyütülür (karekök kuralı) ve şöyle bir cümle çıkar: “Sadece rastlantıyla, bu vadede S&P 500’e göre fark yaklaşık 3 seferden 2’sinde −19 ile +24 puan arasında kalır.” Bu aralıktaki bir sonuç şanstan ayırt edilemez.',
      '- Model **sıfır üstünlük** varsayar: hissenin endeksten iyi ya da kötü olacağını söylemez. Bant, sonucunu şanstan ayırmak için bir ölçü çubuğudur.',
      '- Bant yayın anında sunucuda bir kez hesaplanır ve görüşle birlikte **değiştirilemez** şekilde saklanır; eski görüşlere sonradan eklenmez.',
      '',
      '**Sınırları:** gerçek getirilerde kalın kuyruklar (büyük günler beklenenden sık), oynaklık kümelenmesi ve rejim değişiklikleri vardır; son 3 yıl gelecek gibi olmayabilir ve model yanılabilir. Yatırım tavsiyesi değildir.'
    ], [
      'The **noise band** shows how big a gap between a stock and its benchmark **chance alone** produces. It is **not a forecast**: it is the range of outcomes under a random-walk model.',
      '',
      '- When you choose a stance and a horizon in **Your view**, QuantEdge measures the volatility of the stock’s daily return relative to the index over the last 3 years.',
      '- That volatility is scaled to the horizon (square-root rule), giving a sentence such as “By chance alone, over this horizon the gap versus the S&P 500 stays between −19 and +24 points about 2 times in 3.” A result inside that range cannot be told apart from luck.',
      '- The model assumes **zero edge**: it does not say the stock will beat or trail the index. The band is a yardstick for telling a result apart from luck.',
      '- The band is computed once by the server at publish time and stored **unchangeably** with the view; older views never get one later.',
      '',
      '**Limits:** real returns have fat tails, volatility clustering and regime changes; the last 3 years may not look like the next, and the model can be wrong. Not investment advice.'
    ], [
      'La **banda de ruido** muestra qué diferencia entre una acción y su índice produce **solo el azar**. **No es una previsión**: es el rango de resultados bajo un modelo de paseo aleatorio.',
      '',
      '- Al elegir postura y plazo en **Tu opinión**, QuantEdge mide la volatilidad del rendimiento diario relativo de los últimos 3 años y la escala al plazo.',
      '- El modelo supone **ventaja cero**; un resultado dentro de la banda no se distingue de la suerte.',
      '- Se calcula una vez al publicar y se guarda sin cambios con la opinión.',
      '',
      '**Límites:** colas gruesas, agrupamiento de volatilidad, cambios de régimen y riesgo de modelo. No es asesoramiento de inversión.'
    ]],
    go: ['Analysis Lab', 'Public Site'], f: ['faq_noise_z', 'faq_brownian', 'faq_call_view'] },

  { id: 'faq_noise_z', type: 'faq', page: 'Public Site',
    k: 'z skoru ne demek|gürültüye göre z|normal gürültü içinde|dikkat çekici|sıra dışı|gürültünün ötesinde isabet|gürültünün ötesinde|what does the z score mean|z score track record|within normal noise|notable|unusual|hits beyond the noise|qué significa la puntuación z|dentro del ruido normal|más allá del ruido',
    t: ['Sicildeki z skoru ne demek?', 'What does the z score in the track record mean?', '¿Qué significa la puntuación z del historial?'],
    b: [[
      '**z skoru**, bir görüşün sonucunu o vadedeki **gürültü bandıyla** karşılaştırır: fark, rastlantının tipik olarak yarattığı farkın kaç katı?',
      '',
      '- Hesap: **z = ln((1 + hisse getirisi) ÷ (1 + endeks getirisi)) ÷ vadenin oynaklığı**: bandın ölçtüğü göreli getirinin logaritması. Endeks çok hareket ettiğinde (ör. TL bazında BIST) puan farkı bandı da onunla orantılı ölçeklenir.',
      '- **|z| < 1: normal gürültü içinde.** Sonuç, sadece rastlantıyla da kolayca oluşabilirdi.',
      '- **1–2: dikkat çekici.** **2’den büyük: sıra dışı.**',
      '- Devam eden görüşte z, geçen süreye göre ölçeklenir ve **ara durum** olarak gösterilir; kesin değildir.',
      '- **Gürültünün ötesinde isabet: x/y** — vadesi dolan ve bandı olan y görüşten, isabet eden ve |z| ≥ 1 olan x tanesi.',
      '',
      'Büyük bir z bile beceriyi **kanıtlamaz**: çok görüş yayınlayan biri şansla da birkaç sıra dışı sonuç görür. z yalnızca şansın payını görünür kılar.'
    ], [
      'The **z score** compares a view’s result with that horizon’s **noise band**: how many times the typical chance gap is the gap?',
      '',
      '- Formula: **z = ln((1 + stock return) ÷ (1 + index return)) ÷ the horizon’s volatility**: the log of the relative return the band measures. When the index moves a lot (e.g. BIST in lira) the band in points scales with it.',
      '- **|z| < 1: within normal noise.** Chance alone could easily have produced it.',
      '- **1–2: notable.** **Above 2: unusual.**',
      '- For an open view z is scaled to the time elapsed and shown as **interim**; it is not final.',
      '- **Hits beyond the noise: x/y** — of the y matured views with a band, x were hits with |z| ≥ 1.',
      '',
      'Even a large z does **not prove** skill: someone who publishes many views will see a few unusual results by luck. z only makes the role of luck visible.'
    ], [
      'La **puntuación z** compara el resultado de una opinión con la **banda de ruido** de su plazo: z = ln((1 + rentabilidad de la acción) ÷ (1 + rentabilidad del índice)) ÷ volatilidad del plazo.',
      '',
      '- **|z| < 1: dentro del ruido normal**; **1–2: notable**; **más de 2: inusual**. En una opinión abierta es **provisional**.',
      '- Una z grande no prueba habilidad; solo muestra el papel del azar.'
    ]],
    go: ['Public Site'], f: ['faq_noise_band', 'faq_track_record', 'faq_brownian'] },

  { id: 'faq_brownian', type: 'faq', page: 'Analysis Lab',
    k: 'brown hareketi|brownian hareket|brownian motion|brown hareketi nedir|rastgele yürüyüş|random walk|wiener süreci|karekök kuralı|movimiento browniano|paseo aleatorio|what is brownian motion|qué es el movimiento browniano',
    t: ['Brown hareketi nedir?', 'What is Brownian motion?', '¿Qué es el movimiento browniano?'],
    b: [[
      '**Brown hareketi** (rastgele yürüyüş), her adımı bir öncekinden bağımsız, rastgele küçük değişimlerden oluşan bir süreçtir. Finansta fiyatların **belirsizliğini** ölçmek için kullanılır, **yönünü tahmin etmek** için değil.',
      '',
      '- Günlük getiriler bağımsız ve oynaklığı σ ise, H günlük toplam (log) getirinin oynaklığı **σ × √H** olur: belirsizlik zamanla büyür ama zamanın karekökü kadar.',
      '- QuantEdge bunu **gürültü bandında** kullanır: hissenin endekse göre günlük getirisinin oynaklığından vadedeki olası fark aralığını hesaplar. Ortalama (beklenen üstünlük) **sıfır** alınır.',
      '- Bu yüzden çıkan bant bir **tahmin değildir**; “hiçbir bilgin yoksa, rastlantı ne kadar fark yaratır?” sorusunun cevabıdır.',
      '',
      '**Sınırları:** gerçek piyasalar modelden ayrılır: kalın kuyruklar (sert düşüş ve sıçramalar), sakin ve fırtınalı dönemlerin kümelenmesi, bilanço açıklaması gibi olay günlerindeki ani hareketler ve rejim değişiklikleri. Model bir ölçü çubuğudur, gerçeğin kendisi değildir.'
    ], [
      '**Brownian motion** (a random walk) is a process made of small random changes, each independent of the last. In finance it is used to measure the **uncertainty** of prices, not to **predict their direction**.',
      '',
      '- If daily returns are independent with volatility σ, the volatility of the total (log) return over H days is **σ × √H**: uncertainty grows with time, but only with its square root.',
      '- QuantEdge uses this in the **noise band**: from the volatility of the stock’s daily return relative to its index it computes the range of gaps over the horizon, with **zero** expected edge.',
      '- So the band is **not a forecast**; it answers “with no information at all, how big a gap does chance produce?”',
      '',
      '**Limits:** real markets depart from the model: fat tails (crashes and jumps), calm and stormy periods clustering, sudden moves on event days such as earnings announcements, and regime changes. The model is a yardstick, not reality.'
    ], [
      'El **movimiento browniano** (paseo aleatorio) es un proceso de pequeños cambios aleatorios e independientes. En finanzas sirve para medir la **incertidumbre** de los precios, no para predecir su dirección.',
      '',
      '- Con volatilidad diaria σ, la volatilidad a H días es **σ × √H**.',
      '- QuantEdge lo usa en la **banda de ruido**, con ventaja esperada **cero**; no es una previsión.',
      '',
      '**Límites:** colas gruesas, agrupamiento de volatilidad, saltos en días de resultados y cambios de régimen.'
    ]],
    go: ['Analysis Lab'], f: ['faq_noise_band', 'faq_monte_carlo', 'faq_noise_z', 'an_ito'] },

  { id: 'faq_monte_carlo', type: 'faq', page: 'Analysis Lab',
    k: 'monte carlo|monte carlo nedir|monte carlo simülasyonu|monte karlo|simülasyon nedir|binlerce senaryo|what is monte carlo|monte carlo simulation|qué es monte carlo|simulación de monte carlo',
    t: ['Monte Carlo nedir?', 'What is Monte Carlo?', '¿Qué es Monte Carlo?'],
    b: [[
      '**Monte Carlo**, bir modelden binlerce rastgele senaryo üretip sonuçların dağılımına bakma yöntemidir. Tek bir cevap değil, **olası sonuçların aralığını** verir.',
      '',
      '- Örnek: rastgele yürüyüş (Brown hareketi) modelinde 10.000 farklı fiyat yolu çizilir; yolların %68’inin ve %95’inin kaldığı aralık okunur.',
      '- QuantEdge’in **gürültü bandı** aynı modelin sonucunu formülle, tam olarak hesaplar (log-normal dağılımın yüzdelikleri); Monte Carlo yeterince senaryoyla aynı sayılara yaklaşır.',
      '- Simülasyon ancak modeli kadar iyidir: girdiği varsayımlar (sıfır üstünlük, sabit oynaklık, normal dağılım) yanlışsa çıktısı da yanlış olur. Kalın kuyruklar ve rejim değişiklikleri çoğu zaman modelde yoktur.',
      '',
      'Sonuç bir **tahmin değildir** ve yatırım tavsiyesi değildir; belirsizliğin büyüklüğünü gösterir.'
    ], [
      '**Monte Carlo** means generating thousands of random scenarios from a model and looking at the distribution of the results. It gives a **range of outcomes**, not one answer.',
      '',
      '- Example: under a random-walk (Brownian motion) model, draw 10,000 price paths and read the range that holds 68% and 95% of them.',
      '- QuantEdge’s **noise band** computes the same model’s answer exactly with a formula (percentiles of a lognormal distribution); Monte Carlo approaches the same numbers with enough scenarios.',
      '- A simulation is only as good as its model: if its assumptions (zero edge, constant volatility, normal returns) are wrong, so is its output. Fat tails and regime changes are often missing.',
      '',
      'The result is **not a forecast** and not investment advice; it shows how large the uncertainty is.'
    ], [
      '**Monte Carlo** consiste en generar miles de escenarios aleatorios con un modelo y mirar la distribución de resultados: un **rango**, no una respuesta.',
      '',
      '- La **banda de ruido** de QuantEdge calcula exactamente el resultado del mismo modelo con una fórmula; Monte Carlo se acerca con suficientes escenarios.',
      '- Una simulación vale lo que su modelo. No es una previsión ni asesoramiento de inversión.'
    ]],
    go: ['Analysis Lab'], f: ['faq_brownian', 'faq_noise_band', 'faq_noise_z'] }
);

/* Terms behind the range-of-outcomes analysis (#20) and its caveats: fat tails, volatility clustering, percentiles. */
QE_HELP_KB.entries.push(
  { id: 'term_fat_tails', type: 'term',
    k: 'kalın kuyruk|kalın kuyruklar|kalın kuyruk nedir|basıklık|fazla basıklık|basıklık nedir|kurtosis|excess kurtosis|fat tails|what are fat tails|colas gruesas|curtosis',
    t: ['Kalın kuyruk (basıklık) nedir?', 'What are fat tails (kurtosis)?', '¿Qué son las colas gruesas (curtosis)?'],
    b: [[
      '**Kalın kuyruk**, çok büyük günlük hareketlerin (aşağı ve yukarı) normal dağılımın söylediğinden **daha sık** olmasıdır.',
      '',
      '- **Fazla basıklık** bunu ölçer: normal dağılımda 0’dır; büyüdükçe uç hareketler sıklaşır. Birçok hissede 2–5 arasıdır.',
      '- Rastgele yürüyüş (Brown hareketi) modeli normal getiriler varsayar; bu yüzden %5 ve %95 uçları gerçekte **daha da uzak** olabilir.',
      '- Analiz #20 bu sayıyı “Kalın kuyruk ölçüsü” satırında gösterir.'
    ], [
      '**Fat tails** means very large daily moves (down and up) happen **more often** than a normal distribution says.',
      '',
      '- **Excess kurtosis** measures it: 0 for a normal distribution; the bigger it is, the more frequent extreme moves are. Many stocks sit between 2 and 5.',
      '- A random-walk (Brownian motion) model assumes normal returns, so the real 5% and 95% ends can be **even further out**.',
      '- Analysis #20 shows this number in its “Fat-tail measure” row.'
    ], [
      '**Colas gruesas**: los movimientos diarios muy grandes ocurren **más a menudo** de lo que dice la distribución normal.',
      '',
      '- El **exceso de curtosis** lo mide (0 en una normal). Los extremos reales del rango pueden estar aún más lejos.'
    ]],
    f: ['term_vol_clustering', 'term_percentile', 'an_uncertainty'] },

  { id: 'term_vol_clustering', type: 'term',
    k: 'oynaklık kümelenmesi|oynaklık kümelenmesi nedir|volatilite kümelenmesi|kümelenme|sakin ve fırtınalı dönemler|volatility clustering|what is volatility clustering|agrupamiento de volatilidad',
    t: ['Oynaklık kümelenmesi nedir?', 'What is volatility clustering?', '¿Qué es el agrupamiento de volatilidad?'],
    b: [[
      '**Oynaklık kümelenmesi**: sakin günler sakin günleri, fırtınalı günler fırtınalı günleri izler. Büyük bir hareketten sonra bir sonraki gün de büyük olma eğilimindedir.',
      '',
      '- **Ölçüsü:** kare getirilerin 1 günlük otokorelasyonu; 0 = kümelenme yok, pozitif = kümelenme var.',
      '- Rastgele yürüyüş modeli tek ve sabit bir oynaklık kullanır; fırtınalı bir dönemin içindeysen gerçek aralık modelinkinden geniş olabilir.',
      '- Analiz #20 son 63 günün oynaklığını 3 yıllık oynaklıkla yan yana gösterir.'
    ], [
      '**Volatility clustering**: calm days follow calm days and stormy days follow stormy days. After a big move, the next day tends to be big as well.',
      '',
      '- **Measure:** the lag-1 autocorrelation of squared returns; 0 = no clustering, positive = clustering.',
      '- A random-walk model uses one constant volatility; inside a stormy spell the real range can be wider than the model’s.',
      '- Analysis #20 shows the last 63 days’ volatility next to the 3-year one.'
    ], [
      '**Agrupamiento de volatilidad**: los días tranquilos siguen a días tranquilos y los agitados a agitados.',
      '',
      '- El modelo de paseo aleatorio usa una sola volatilidad constante; en un periodo agitado el rango real puede ser más amplio.'
    ]],
    f: ['term_fat_tails', 'term_volatility', 'an_uncertainty'] },

  { id: 'term_percentile', type: 'term',
    k: 'yüzdelik|yüzdelik nedir|yüzdelik dilim|persentil|5. yüzdelik|95. yüzdelik|medyan nedir|yelpaze grafiği|percentile|what is a percentile|fan chart|percentil|qué es un percentil',
    t: ['Yüzdelik (persentil) nedir?', 'What is a percentile?', '¿Qué es un percentil?'],
    b: [[
      '**Yüzdelik**, sıralanmış sonuçlarda bir sınırdır: **5. yüzdelik**, sonuçların %5’inin altında kaldığı değerdir; **medyan** (50.) tam ortadır.',
      '',
      '- Analiz #20’nin yelpaze grafiğinde en dış iki çizgi 5. ve 95. yüzdeliktir: modelin simüle ettiği sonuçların **10’da 9’u** bu ikisinin arasında kalır. İçteki 25. ve 75. çizgiler ortadaki yarıyı gösterir.',
      '- Bunlar bir **modelin** sonuçlarıdır, gelecekteki fiyat için bir söz değildir; gerçek uçlar daha uzak olabilir (kalın kuyruklar).'
    ], [
      'A **percentile** is a cut-off in sorted outcomes: the **5th percentile** is the value 5% of outcomes fall below; the **median** (50th) is the middle.',
      '',
      '- In the fan chart of Analysis #20 the two outer lines are the 5th and 95th percentiles: **9 in 10** of the model’s simulated outcomes lie between them. The inner 25th and 75th lines show the middle half.',
      '- These are a **model’s** outcomes, not a promise about the future price; the real ends can be further out (fat tails).'
    ], [
      'Un **percentil** es un corte en los resultados ordenados: el **percentil 5** deja por debajo el 5 % de los resultados; la **mediana** es el 50.',
      '',
      '- En el gráfico de abanico del análisis #20, 9 de cada 10 resultados simulados quedan entre los percentiles 5 y 95. Son resultados de un modelo, no una previsión.'
    ]],
    f: ['term_fat_tails', 'an_uncertainty', 'faq_monte_carlo'] }
);

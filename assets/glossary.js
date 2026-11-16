/* QuantEdge v0.13.5 — "What does this mean?" explanations.
 *
 * <Term k="operating_margin">Operating margin</Term> renders the label followed by a small
 * "?" button. Hover, keyboard focus or a tap shows a one-line definition and an example in
 * the interface language (QE_LANG). Spanish falls back to English if a text is missing.
 */
var QE_GLOSSARY = {
  revenue: {
    tr: ['Gelir', 'Şirketin bir dönemde sattığı ürün ve hizmetlerin toplamı. Kâr değildir; giderler henüz düşülmemiştir.', '100 $’lık satış yapan bir kafenin geliri 100 $’dır, kârı daha azdır.'],
    en: ['Revenue', 'Total sales of goods and services in a period. It is not profit: no costs have been subtracted yet.', 'A café that sells $100 of coffee has $100 of revenue, but less profit.'],
    es: ['Ingresos', 'Total de ventas de productos y servicios en un periodo. No es beneficio: aún no se restan los costes.', 'Una cafetería que vende 100 $ tiene 100 $ de ingresos, pero menos beneficio.']
  },
  revenue_growth: {
    tr: ['Gelir büyümesi', 'Gelirin bir önceki döneme göre yüzde kaç değiştiği.', 'Gelir 100’den 120’ye çıktıysa büyüme %20’dir.'],
    en: ['Revenue growth', 'How much revenue changed versus the previous period, in percent.', 'Revenue going from 100 to 120 is 20% growth.'],
    es: ['Crecimiento de ingresos', 'Cuánto cambiaron los ingresos frente al periodo anterior, en porcentaje.', 'Pasar de 100 a 120 es un crecimiento del 20 %.']
  },
  operating_margin: {
    tr: ['Faaliyet kâr marjı', 'Gelirin ne kadarının, işletme giderleri düşüldükten sonra faaliyet kârı olarak kaldığı. Faiz ve vergi hariçtir.', '%25 marj: her 100 $ gelirden 25 $ faaliyet kârı kalıyor.'],
    en: ['Operating margin', 'Share of revenue left as operating profit after running costs, before interest and tax.', 'A 25% margin means $25 of operating profit per $100 of revenue.'],
    es: ['Margen operativo', 'Parte de los ingresos que queda como beneficio operativo tras los costes, antes de intereses e impuestos.', 'Un margen del 25 % son 25 $ de beneficio operativo por cada 100 $ de ingresos.']
  },
  net_margin: {
    tr: ['Net kâr marjı', 'Tüm giderler, faiz ve vergiler düşüldükten sonra gelirin kâr olarak kalan yüzdesi.', '%10 net marj: her 100 $ gelirden 10 $ net kâr.'],
    en: ['Net margin', 'Share of revenue left as profit after all costs, interest and taxes.', 'A 10% net margin is $10 of net income per $100 of revenue.'],
    es: ['Margen neto', 'Parte de los ingresos que queda como beneficio tras todos los costes, intereses e impuestos.', 'Un margen neto del 10 % son 10 $ por cada 100 $ de ingresos.']
  },
  net_income: {
    tr: ['Net kâr', 'Tüm giderler, faiz ve vergiler düşüldükten sonra kalan kâr. Muhasebe kalemleri yüzünden nakitten farklı olabilir.', ''],
    en: ['Net income', 'Profit after all costs, interest and taxes. Accounting items can make it differ from cash.', ''],
    es: ['Beneficio neto', 'Beneficio tras todos los costes, intereses e impuestos. Puede diferir del efectivo por partidas contables.', '']
  },
  free_cash_flow: {
    tr: ['Serbest nakit akışı', 'İşletme faaliyetlerinden gelen nakitten yatırım harcamalarının (makine, bina, sunucu) düşülmesiyle kalan para.', 'İşletme nakit akışı 50 $, yatırım 20 $ ise serbest nakit akışı 30 $.'],
    en: ['Free cash flow', 'Cash from operations minus capital spending (machines, buildings, servers).', '$50 of operating cash flow minus $20 of capex leaves $30 of free cash flow.'],
    es: ['Flujo de caja libre', 'Efectivo de las operaciones menos la inversión en activos (máquinas, edificios, servidores).', '50 $ de flujo operativo menos 20 $ de inversión dejan 30 $ de flujo libre.']
  },
  cash_conversion: {
    tr: ['Nakit dönüşümü', 'İşletme nakit akışının net kâra oranı. %100’ün üstü, kârın nakde iyi dönüştüğünü gösterir.', ''],
    en: ['Cash conversion', 'Operating cash flow divided by net income. Above 100% means profit is turning into cash.', ''],
    es: ['Conversión de caja', 'Flujo operativo dividido entre beneficio neto. Por encima del 100 % el beneficio se convierte bien en efectivo.', '']
  },
  cagr: {
    tr: ['Yıllık bileşik büyüme', 'Birkaç yıllık büyümenin, her yıl aynı hızda büyümüş gibi yıllık ortalaması.', '100 → 121 iki yılda: yıllık bileşik büyüme %10.'],
    en: ['Compound annual growth', 'The steady yearly rate that would produce the same multi-year growth.', '100 → 121 over two years is 10% compound annual growth.'],
    es: ['Crecimiento anual compuesto', 'La tasa anual constante que produciría el mismo crecimiento en varios años.', '100 → 121 en dos años es un 10 % anual compuesto.']
  },
  ttm: {
    tr: ['Son 12 ay', 'Son dört çeyreğin toplamı. Mali yılın bitmesini beklemeden güncel yıllık tabloyu gösterir.', ''],
    en: ['Last 12 months', 'The sum of the last four quarters: a current annual picture without waiting for the fiscal year to end.', ''],
    es: ['Últimos 12 meses', 'Suma de los últimos cuatro trimestres: una imagen anual actual sin esperar al cierre del ejercicio.', '']
  },
  fiscal_year: {
    tr: ['Mali yıl', 'Şirketin hesaplarını kapattığı 12 aylık dönem. Takvim yılıyla aynı olmak zorunda değildir.', 'NVIDIA’nın mali yılı Ocak sonunda biter.'],
    en: ['Fiscal year', 'The 12-month period a company closes its books on. It need not match the calendar year.', 'NVIDIA’s fiscal year ends in late January.'],
    es: ['Ejercicio fiscal', 'Periodo de 12 meses en el que la empresa cierra sus cuentas. No tiene que coincidir con el año natural.', 'El ejercicio de NVIDIA termina a finales de enero.']
  },
  form_10k: {
    tr: ['10-K', 'ABD’li şirketlerin SEC’e verdiği, denetimden geçmiş yıllık rapor. En güvenilir kaynaktır.', ''],
    en: ['10-K', 'The audited annual report US companies file with the SEC. The most reliable source.', ''],
    es: ['10-K', 'Informe anual auditado que las empresas de EE. UU. presentan ante la SEC. La fuente más fiable.', '']
  },
  form_10q: {
    tr: ['10-Q', 'Çeyreklik rapor; ilk üç çeyrek için verilir ve denetlenmez. Dördüncü çeyrek yıllık 10-K içindedir.', ''],
    en: ['10-Q', 'The quarterly report, filed for the first three quarters and not audited. Q4 sits inside the annual 10-K.', ''],
    es: ['10-Q', 'Informe trimestral de los tres primeros trimestres, sin auditar. El cuarto está dentro del 10-K anual.', '']
  },
  current_ratio: {
    tr: ['Cari oran', 'Dönen varlıkların kısa vadeli borçlara oranı. 1’in altı, bir yıl içindeki borçların kısa vadeli varlıklardan fazla olduğunu gösterir.', ''],
    en: ['Current ratio', 'Current assets divided by current liabilities. Below 1 means short-term debts exceed short-term assets.', ''],
    es: ['Ratio de liquidez', 'Activo corriente dividido entre pasivo corriente. Por debajo de 1, las deudas a corto superan a los activos a corto.', '']
  },
  capex: {
    tr: ['Yatırım harcaması', 'Bina, makine, sunucu gibi uzun ömürlü varlıklara harcanan para (capex).', ''],
    en: ['Capital expenditure', 'Money spent on long-lived assets such as buildings, machines and servers (capex).', ''],
    es: ['Inversión en activos', 'Dinero gastado en activos duraderos como edificios, máquinas o servidores (capex).', '']
  },
  dcf: {
    tr: ['DCF', 'İndirgenmiş nakit akışı: gelecekteki nakit akışlarını bugünkü değere çevirerek şirkete değer biçme yöntemi. Sonuç tamamen varsayımlarına bağlıdır.', ''],
    en: ['DCF', 'Discounted cash flow: values a company by converting future cash flows into today’s money. The result depends entirely on your assumptions.', ''],
    es: ['DCF', 'Flujo de caja descontado: valora una empresa trayendo los flujos futuros a valor de hoy. El resultado depende por completo de tus supuestos.', '']
  },
  wacc: {
    tr: ['WACC', 'Ağırlıklı ortalama sermaye maliyeti: gelecekteki nakdi bugüne çevirirken kullanılan iskonto oranı. Yükseldikçe değer düşer.', ''],
    en: ['WACC', 'Weighted average cost of capital: the discount rate that turns future cash into today’s value. Higher WACC, lower value.', ''],
    es: ['WACC', 'Coste medio ponderado del capital: la tasa que convierte el efectivo futuro en valor de hoy. A mayor WACC, menor valor.', '']
  },
  terminal_growth: {
    tr: ['Uzun vadeli büyüme', 'Tahmin döneminden sonra nakit akışının sonsuza kadar büyüyeceği varsayılan oran. Küçük bir değişiklik sonucu çok etkiler.', ''],
    en: ['Terminal growth', 'The rate cash flow is assumed to grow forever after the forecast years. Small changes move the result a lot.', ''],
    es: ['Crecimiento terminal', 'Tasa a la que se supone que el flujo crece para siempre tras los años de previsión. Pequeños cambios mueven mucho el resultado.', '']
  },
  enterprise_value: {
    tr: ['Firma değeri', 'İşletmenin tamamının değeri: hem hissedarlara hem borç verenlere ait kısım.', ''],
    en: ['Enterprise value', 'The value of the whole business, owed to both shareholders and lenders.', ''],
    es: ['Valor de empresa', 'Valor de todo el negocio, de accionistas y prestamistas.', '']
  },
  equity_value: {
    tr: ['Özkaynak değeri', 'Firma değerinden borç çıkarılıp nakit eklendikten sonra hissedarlara kalan değer.', ''],
    en: ['Equity value', 'What is left for shareholders: enterprise value minus debt plus cash.', ''],
    es: ['Valor del patrimonio', 'Lo que queda para los accionistas: valor de empresa menos deuda más efectivo.', '']
  },
  diluted_shares: {
    tr: ['Seyreltilmiş hisse sayısı', 'Opsiyonlar ve dönüştürülebilir menkul kıymetler dahil toplam hisse sayısı. Hisse başına değeri bulmak için gerekir.', ''],
    en: ['Diluted shares', 'Share count including options and convertible securities. Needed for value per share.', ''],
    es: ['Acciones diluidas', 'Número de acciones incluidas opciones y convertibles. Necesario para el valor por acción.', '']
  },
  sharpe: {
    tr: ['Sharpe oranı', 'Getirinin, katlanılan oynaklığa (riske) oranı. Yüksek olması, birim risk başına daha çok getiri demektir.', ''],
    en: ['Sharpe ratio', 'Return divided by volatility (risk). Higher means more return per unit of risk.', ''],
    es: ['Ratio de Sharpe', 'Rentabilidad dividida entre volatilidad (riesgo). Más alto es más rentabilidad por unidad de riesgo.', '']
  },
  max_drawdown: {
    tr: ['En büyük düşüş', 'Bir zirveden sonraki en derin dip: yatırımın en kötü anda yüzde kaç değer kaybettiği.', '%−30: 100 $ en kötü anda 70 $’a düşmüş.'],
    en: ['Max drawdown', 'The deepest fall from a peak: how much the investment lost at its worst point.', '−30%: $100 fell to $70 at the worst moment.'],
    es: ['Caída máxima', 'La mayor caída desde un máximo: cuánto perdió la inversión en su peor momento.', '−30 %: 100 $ cayeron a 70 $ en el peor momento.']
  },
  buy_hold: {
    tr: ['Al ve tut', 'Başta alıp dönem sonuna kadar hiç satmadan tutmak. Stratejileri karşılaştırmak için ölçüt olarak kullanılır.', ''],
    en: ['Buy and hold', 'Buying at the start and never selling. Used as the benchmark for strategies.', ''],
    es: ['Comprar y mantener', 'Comprar al inicio y no vender nunca. Sirve de referencia para comparar estrategias.', '']
  },
  out_of_sample: {
    tr: ['Test dışı dönem', 'Strateji ayarlanırken kullanılmayan dönem. Sonucun şans eseri olup olmadığını anlamaya yardım eder.', ''],
    en: ['Out-of-sample', 'A period not used while tuning the strategy. Helps tell skill from luck.', ''],
    es: ['Fuera de muestra', 'Periodo no usado al ajustar la estrategia. Ayuda a distinguir habilidad de suerte.', '']
  },
  bps: {
    tr: ['Baz puan', 'Yüzdenin yüzde biri: 100 baz puan = %1.', '5 baz puan komisyon = %0,05.'],
    en: ['Basis points', 'One hundredth of a percent: 100 bps = 1%.', 'A 5 bps fee is 0.05%.'],
    es: ['Puntos básicos', 'Una centésima de punto porcentual: 100 pb = 1 %.', 'Una comisión de 5 pb es un 0,05 %.']
  }
};

// v0.13.5 Learn page: more terms, and the forms in which each term appears in Learn texts (linked to its "?").
// Ambiguous everyday words (option, factor, bölüm …) are left out of the forms on purpose. These terms serve the
// "?" popovers and the Learn dictionary; the help assistant keeps its own tuned set (QE_GLOSSARY).
var QE_GLOSSARY_MORE = ({
 "ebit": {
  "en": [
   "EBIT",
   "Earnings before interest and taxes: profit from running the business. QuantEdge uses reported operating income, or pre-tax income plus interest expense if that is missing.",
   "Revenue $1,000 minus operating costs $800 gives EBIT of $200."
  ],
  "tr": [
   "FVÖK",
   "Faiz ve vergi öncesi kâr: işi yürütmekten gelen kâr. QuantEdge raporlanan faaliyet kârını kullanır; yoksa vergi öncesi kâra faiz giderini ekler.",
   "1.000 $ gelirden 800 $ işletme gideri düşünce FVÖK 200 $ olur."
  ],
  "es": [
   "EBIT",
   "Beneficio antes de intereses e impuestos: lo que gana el negocio con su actividad. QuantEdge usa el resultado operativo publicado o, si falta, el beneficio antes de impuestos más los intereses.",
   "1.000 $ de ingresos menos 800 $ de costes operativos dan un EBIT de 200 $."
  ]
 },
 "ebitda": {
  "en": [
   "EBITDA",
   "EBIT plus depreciation and amortisation (D&A). A rough measure of operating cash profit before spending on new assets.",
   "EBIT $200 plus D&A $50 is EBITDA of $250."
  ],
  "tr": [
   "FAVÖK",
   "FVÖK artı amortisman. Yeni varlıklara harcama yapılmadan önceki faaliyet nakit kârının kaba bir ölçüsüdür.",
   "FVÖK 200 $ + amortisman 50 $ = FAVÖK 250 $."
  ],
  "es": [
   "EBITDA",
   "EBIT más depreciación y amortización (D&A). Una medida aproximada del beneficio operativo en efectivo antes de invertir en activos nuevos.",
   "EBIT de 200 $ más 50 $ de D&A dan un EBITDA de 250 $."
  ]
 },
 "nopat": {
  "en": [
   "NOPAT",
   "Net operating profit after tax: EBIT × (1 − tax rate). The operating profit left as if the company had no debt.",
   "EBIT $200 with a 20% tax rate gives NOPAT of $160."
  ],
  "tr": [
   "NOPAT",
   "Vergi sonrası net faaliyet kârı: FVÖK × (1 − vergi oranı). Şirketin hiç borcu yokmuş gibi kalan faaliyet kârı.",
   "FVÖK 200 $, vergi oranı %20 ise NOPAT 160 $ olur."
  ],
  "es": [
   "NOPAT",
   "Beneficio operativo neto después de impuestos: EBIT × (1 − tipo impositivo). El beneficio operativo que quedaría si la empresa no tuviera deuda.",
   "Un EBIT de 200 $ con un 20 % de impuestos da un NOPAT de 160 $."
  ]
 },
 "roe": {
  "en": [
   "Return on equity (ROE)",
   "Net income divided by shareholders’ equity: how much profit the company makes per dollar the owners have in it.",
   "Net income $15 on equity $100 is an ROE of 15%."
  ],
  "tr": [
   "Özkaynak kârlılığı (ROE)",
   "Net kârın özkaynağa oranı: hissedarların şirkete koyduğu her dolar başına ne kadar kâr edildiği.",
   "100 $ özkaynakla 15 $ net kâr: ROE %15."
  ],
  "es": [
   "Rentabilidad sobre el patrimonio (ROE)",
   "Beneficio neto dividido entre el patrimonio de los accionistas: cuánto gana la empresa por cada dólar de los dueños.",
   "15 $ de beneficio neto sobre 100 $ de patrimonio es un ROE del 15 %."
  ]
 },
 "roa": {
  "en": [
   "Return on assets (ROA)",
   "Net income divided by total assets: how much profit each dollar of assets produces. The F-score uses assets at the start of the year.",
   "Net income $5 on total assets $100 is an ROA of 5%."
  ],
  "tr": [
   "Aktif kârlılığı (ROA)",
   "Net kârın toplam varlıklara oranı: her dolarlık varlığın ne kadar kâr ürettiği. F-skoru yıl başındaki varlıkları kullanır.",
   "100 $ toplam varlıkla 5 $ net kâr: ROA %5."
  ],
  "es": [
   "Rentabilidad sobre activos (ROA)",
   "Beneficio neto dividido entre el activo total: cuánto beneficio produce cada dólar de activos. El F-score usa los activos al inicio del año.",
   "5 $ de beneficio neto sobre 100 $ de activos es un ROA del 5 %."
  ]
 },
 "roic": {
  "en": [
   "Return on invested capital (ROIC)",
   "NOPAT divided by average invested capital: the after-tax operating return on all the money put into the business. Compared with WACC.",
   "NOPAT $160 on invested capital $800 is an ROIC of 20%."
  ],
  "tr": [
   "Yatırılan sermaye getirisi (ROIC)",
   "NOPAT’ın ortalama yatırılan sermayeye oranı: işe konan tüm paranın vergi sonrası faaliyet getirisi. WACC ile karşılaştırılır.",
   "800 $ yatırılan sermayeyle 160 $ NOPAT: ROIC %20."
  ],
  "es": [
   "Rentabilidad sobre el capital invertido (ROIC)",
   "NOPAT dividido entre el capital invertido medio: la rentabilidad operativa después de impuestos de todo el dinero puesto en el negocio. Se compara con el WACC.",
   "160 $ de NOPAT sobre 800 $ de capital invertido es un ROIC del 20 %."
  ]
 },
 "invested_capital": {
  "en": [
   "Invested capital",
   "The money tied up in the business: equity plus long-term and short-term debt, minus cash.",
   "Equity $600 + debt $400 − cash $100 = invested capital of $900."
  ],
  "tr": [
   "Yatırılan sermaye",
   "İşe bağlanmış para: özkaynak artı uzun ve kısa vadeli borç, eksi nakit.",
   "Özkaynak 600 $ + borç 400 $ − nakit 100 $ = yatırılan sermaye 900 $."
  ],
  "es": [
   "Capital invertido",
   "El dinero inmovilizado en el negocio: patrimonio más deuda a largo y corto plazo, menos caja.",
   "Patrimonio 600 $ + deuda 400 $ − caja 100 $ = capital invertido de 900 $."
  ]
 },
 "cost_of_equity": {
  "en": [
   "Cost of equity",
   "The yearly return shareholders are assumed to require. QuantEdge estimates it with CAPM: risk-free rate + beta × equity risk premium.",
   "4% + 1.1 × 5% ≈ 9.5% cost of equity."
  ],
  "tr": [
   "Özkaynak maliyeti",
   "Hissedarların istediği varsayılan yıllık getiri. QuantEdge bunu CAPM ile tahmin eder: risksiz faiz + beta × hisse risk primi.",
   "%4 + 1,1 × %5 ≈ %9,5 özkaynak maliyeti."
  ],
  "es": [
   "Coste del capital propio",
   "La rentabilidad anual que se supone que exigen los accionistas. QuantEdge la estima con el CAPM: tipo sin riesgo + beta × prima de riesgo de mercado.",
   "4 % + 1,1 × 5 % ≈ 9,5 % de coste del capital propio."
  ]
 },
 "cost_of_debt": {
  "en": [
   "Cost of debt",
   "The interest rate the company pays on its borrowing, estimated as interest expense divided by average debt. Tax makes the real cost lower.",
   "Interest $5 on debt $100 is a 5% cost of debt; after 20% tax, 4%."
  ],
  "tr": [
   "Borç maliyeti",
   "Şirketin borçlarına ödediği faiz oranı; faiz giderinin ortalama borca bölünmesiyle tahmin edilir. Vergi etkisi gerçek maliyeti düşürür.",
   "100 $ borca 5 $ faiz: borç maliyeti %5; %20 vergiden sonra %4."
  ],
  "es": [
   "Coste de la deuda",
   "El tipo de interés que paga la empresa por sus préstamos, estimado como gasto por intereses dividido entre la deuda media. Los impuestos bajan el coste real.",
   "5 $ de intereses sobre 100 $ de deuda es un 5 %; tras un 20 % de impuestos, un 4 %."
  ]
 },
 "risk_free_rate": {
  "en": [
   "Risk-free rate",
   "The return on a very safe investment, used as a starting point for required returns. QuantEdge usually takes the 10-year US Treasury yield.",
   "If the 10-year Treasury yields 4%, the risk-free rate is 4%."
  ],
  "tr": [
   "Risksiz faiz",
   "Çok güvenli bir yatırımın getirisi; beklenen getirilerin başlangıç noktası olarak kullanılır. QuantEdge genelde 10 yıllık ABD tahvil faizini alır.",
   "10 yıllık ABD tahvili %4 veriyorsa risksiz faiz %4’tür."
  ],
  "es": [
   "Tipo sin riesgo",
   "La rentabilidad de una inversión muy segura, punto de partida de la rentabilidad exigida. QuantEdge suele usar el rendimiento del bono del Tesoro de EE. UU. a 10 años.",
   "Si el bono a 10 años rinde un 4 %, el tipo sin riesgo es un 4 %."
  ]
 },
 "equity_risk_premium": {
  "en": [
   "Equity risk premium",
   "The extra yearly return investors expect from stocks over the risk-free rate. QuantEdge uses Damodaran’s implied premium for the S&P 500 by default.",
   "Risk-free 4% plus a 5% premium means stocks are expected to earn about 9%."
  ],
  "tr": [
   "Hisse risk primi",
   "Yatırımcıların hisselerden risksiz faizin üstünde beklediği ek yıllık getiri. QuantEdge varsayılan olarak Damodaran’ın S&P 500 için ima edilen primini kullanır.",
   "Risksiz %4 artı %5 prim: hisselerden yaklaşık %9 beklenir."
  ],
  "es": [
   "Prima de riesgo de mercado",
   "La rentabilidad anual extra que se espera de las acciones por encima del tipo sin riesgo. QuantEdge usa por defecto la prima implícita del S&P 500 de Damodaran.",
   "Un 4 % sin riesgo más un 5 % de prima: se esperan cerca de un 9 % de las acciones."
  ]
 },
 "beta": {
  "en": [
   "Beta",
   "How much a stock tends to move when the whole market moves. QuantEdge measures it against SPY, the S&P 500 fund.",
   "Beta 1.5: when SPY moves 1%, the stock tends to move about 1.5%."
  ],
  "tr": [
   "Beta",
   "Tüm piyasa hareket ettiğinde hissenin ne kadar hareket etme eğiliminde olduğu. QuantEdge bunu S&P 500 fonu SPY’a karşı ölçer.",
   "Beta 1,5: SPY %1 oynadığında hisse yaklaşık %1,5 oynar."
  ],
  "es": [
   "Beta",
   "Cuánto tiende a moverse una acción cuando se mueve todo el mercado. QuantEdge la mide frente a SPY, el fondo del S&P 500.",
   "Beta 1,5: si SPY se mueve un 1 %, la acción tiende a moverse un 1,5 %."
  ]
 },
 "capm": {
  "en": [
   "CAPM",
   "Capital asset pricing model: turns beta into a required return. Required return = risk-free rate + beta × equity risk premium.",
   "4% + 1.2 × 5% = 10% a year."
  ],
  "tr": [
   "CAPM",
   "Sermaye varlıklarını fiyatlama modeli: betayı istenen getiriye çevirir. İstenen getiri = risksiz faiz + beta × hisse risk primi.",
   "%4 + 1,2 × %5 = yılda %10."
  ],
  "es": [
   "CAPM",
   "Modelo de valoración de activos de capital: convierte la beta en una rentabilidad exigida. Rentabilidad exigida = tipo sin riesgo + beta × prima de riesgo de mercado.",
   "4 % + 1,2 × 5 % = 10 % al año."
  ]
 },
 "alpha": {
  "en": [
   "Alpha",
   "The part of a stock’s return that the market (or the factors) does not explain. It is a measurement of the past, not a forecast.",
   "Alpha of +2% a year: the stock beat what its beta alone would suggest by 2 points."
  ],
  "tr": [
   "Alfa",
   "Hisse getirisinin piyasanın (veya faktörlerin) açıklamadığı kısmı. Geçmişin ölçümüdür, tahmin değildir.",
   "Yıllık +%2 alfa: hisse, betasının tek başına gösterdiğinden 2 puan iyi gitmiş."
  ],
  "es": [
   "Alfa",
   "La parte de la rentabilidad de una acción que el mercado (o los factores) no explica. Mide el pasado, no es una previsión.",
   "Alfa de +2 % anual: la acción superó en 2 puntos lo que indicaría solo su beta."
  ]
 },
 "volatility": {
  "en": [
   "Volatility",
   "How much returns swing around their average, measured as the standard deviation of returns. Daily figures are annualised with √252.",
   "1% daily volatility is about 16% a year (1% × √252)."
  ],
  "tr": [
   "Oynaklık",
   "Getirilerin ortalama etrafında ne kadar dalgalandığı; getirilerin standart sapmasıyla ölçülür. Günlük değer √252 ile yıllığa çevrilir.",
   "%1 günlük oynaklık yılda yaklaşık %16’dır (%1 × √252)."
  ],
  "es": [
   "Volatilidad",
   "Cuánto oscilan las rentabilidades alrededor de su media, medida como su desviación típica. Las cifras diarias se anualizan con √252.",
   "Un 1 % de volatilidad diaria es cerca de un 16 % anual (1 % × √252)."
  ]
 },
 "standard_deviation": {
  "en": [
   "Standard deviation",
   "A measure of spread: the typical distance of values from their average. Small means the values stay close together.",
   "Margins of 8%, 10% and 12% have a standard deviation of about 1.6 points."
  ],
  "tr": [
   "Standart sapma",
   "Dağılımın ölçüsü: değerlerin ortalamadan tipik uzaklığı. Küçükse değerler birbirine yakın durur.",
   "%8, %10 ve %12 marjların standart sapması yaklaşık 1,6 puandır."
  ],
  "es": [
   "Desviación típica",
   "Una medida de dispersión: la distancia típica de los valores a su media. Si es pequeña, los valores están juntos.",
   "Márgenes del 8 %, 10 % y 12 % tienen una desviación típica de unos 1,6 puntos."
  ]
 },
 "correlation": {
  "en": [
   "Correlation",
   "How closely two series move together, from −1 (opposite) to +1 (in step). 0 means no linear link.",
   "A correlation of 0.9 between two stocks means they mostly rise and fall together."
  ],
  "tr": [
   "Korelasyon",
   "İki serinin ne kadar birlikte hareket ettiği; −1 (zıt) ile +1 (aynı yönde) arasında. 0, doğrusal bir bağ olmadığı demektir.",
   "İki hisse arasında 0,9 korelasyon: çoğunlukla birlikte yükselip düşerler."
  ],
  "es": [
   "Correlación",
   "Cuánto se mueven juntas dos series, de −1 (opuestas) a +1 (a la par). 0 significa que no hay relación lineal.",
   "Una correlación de 0,9 entre dos acciones indica que casi siempre suben y bajan juntas."
  ]
 },
 "log_return": {
  "en": [
   "Log return",
   "The natural log of today’s price divided by yesterday’s, ln(Pt ÷ Pt−1). Close to the simple return for small moves, and log returns add up over time.",
   "A price going from 100 to 101 is a log return of about 0.995%."
  ],
  "tr": [
   "Log getiri",
   "Bugünkü fiyatın dünküne oranının doğal logaritması, ln(Pt ÷ Pt−1). Küçük hareketlerde basit getiriye çok yakındır ve zaman içinde toplanabilir.",
   "Fiyatın 100’den 101’e çıkması yaklaşık %0,995 log getiridir."
  ],
  "es": [
   "Rentabilidad logarítmica",
   "El logaritmo natural del precio de hoy dividido entre el de ayer, ln(Pt ÷ Pt−1). Casi igual a la rentabilidad simple en movimientos pequeños, y se puede sumar en el tiempo.",
   "Pasar de 100 a 101 es una rentabilidad logarítmica de cerca del 0,995 %."
  ]
 },
 "abnormal_return": {
  "en": [
   "Abnormal return",
   "A stock’s return minus the market’s (SPY) return over the same days: the move left after removing what the whole market did.",
   "Stock +5%, SPY +1%: abnormal return +4 points."
  ],
  "tr": [
   "Olağandışı getiri",
   "Hisse getirisinden aynı günlerdeki piyasa (SPY) getirisinin çıkarılması: tüm piyasanın etkisi çıkınca kalan hareket.",
   "Hisse +%5, SPY +%1: olağandışı getiri +4 puan."
  ],
  "es": [
   "Rentabilidad anormal",
   "La rentabilidad de la acción menos la del mercado (SPY) en los mismos días: el movimiento que queda al quitar lo que hizo todo el mercado.",
   "Acción +5 %, SPY +1 %: rentabilidad anormal de +4 puntos."
  ]
 },
 "market_cap": {
  "en": [
   "Market value (market cap)",
   "The stock market’s price for all of a company’s shares: share price × shares outstanding.",
   "100 million shares at $50 is a market value of $5 billion."
  ],
  "tr": [
   "Piyasa değeri",
   "Borsanın şirketin tüm hisselerine biçtiği fiyat: hisse fiyatı × dolaşımdaki hisse sayısı.",
   "50 $’dan 100 milyon hisse: piyasa değeri 5 milyar $."
  ],
  "es": [
   "Capitalización",
   "El precio que la bolsa pone a todas las acciones de la empresa: precio por acción × acciones en circulación.",
   "100 millones de acciones a 50 $ son una capitalización de 5.000 millones de $."
  ]
 },
 "net_debt": {
  "en": [
   "Net debt",
   "Total borrowing minus cash. Negative net debt means the company holds more cash than debt.",
   "Debt $400 minus cash $100 is net debt of $300."
  ],
  "tr": [
   "Net borç",
   "Toplam borçtan nakdin çıkarılması. Negatifse şirketin nakdi borcundan fazladır.",
   "400 $ borç − 100 $ nakit = 300 $ net borç."
  ],
  "es": [
   "Deuda neta",
   "La deuda total menos la caja. Si es negativa, la empresa tiene más efectivo que deuda.",
   "400 $ de deuda menos 100 $ de caja son 300 $ de deuda neta."
  ]
 },
 "working_capital": {
  "en": [
   "Working capital",
   "Current assets minus current liabilities: the short-term money tied up in running the business, such as stock and unpaid customer bills.",
   "Current assets $300 − current liabilities $200 = working capital of $100."
  ],
  "tr": [
   "İşletme sermayesi",
   "Dönen varlıklar eksi kısa vadeli yükümlülükler: stok ve tahsil edilmemiş müşteri faturaları gibi, işi yürütmek için bağlanan kısa vadeli para.",
   "300 $ dönen varlık − 200 $ kısa vadeli yükümlülük = 100 $ işletme sermayesi."
  ],
  "es": [
   "Capital circulante",
   "Activo corriente menos pasivo corriente: el dinero a corto plazo atrapado en la operación, como inventario y facturas de clientes sin cobrar.",
   "300 $ de activo corriente − 200 $ de pasivo corriente = 100 $ de capital circulante."
  ]
 },
 "pe_ratio": {
  "en": [
   "P/E ratio",
   "Price to earnings: market value divided by net income. It shows how many dollars investors pay for each dollar of yearly profit. Not shown when there is a loss.",
   "Market value $2,000 and net income $100 give a P/E of 20."
  ],
  "tr": [
   "F/K oranı",
   "Fiyat/kazanç: piyasa değerinin net kâra oranı. Yatırımcıların her 1 dolarlık yıllık kâr için kaç dolar ödediğini gösterir. Zarar varsa gösterilmez.",
   "2.000 $ piyasa değeri ve 100 $ net kâr: F/K 20."
  ],
  "es": [
   "PER (P/E)",
   "Precio/beneficio: capitalización dividida entre beneficio neto. Indica cuántos dólares pagan los inversores por cada dólar de beneficio anual. No se muestra si hay pérdidas.",
   "2.000 $ de capitalización y 100 $ de beneficio neto dan un P/E de 20."
  ]
 },
 "ev_ebitda": {
  "en": [
   "EV/EBITDA",
   "Enterprise value divided by EBITDA. Because it includes debt, it compares companies with different borrowing more fairly than P/E. It ignores capex.",
   "EV $1,000 and EBITDA $100 give EV/EBITDA of 10×."
  ],
  "tr": [
   "FD/FAVÖK",
   "Firma değerinin FAVÖK’e oranı. Borcu da içerdiği için farklı borçluluktaki şirketleri F/K’dan daha adil karşılaştırır. Yatırım harcamasını görmez.",
   "1.000 $ FD ve 100 $ FAVÖK: FD/FAVÖK 10×."
  ],
  "es": [
   "EV/EBITDA",
   "Valor de empresa dividido entre EBITDA. Como incluye la deuda, compara empresas con distinto endeudamiento mejor que el P/E. No tiene en cuenta el capex.",
   "Un EV de 1.000 $ y un EBITDA de 100 $ dan un EV/EBITDA de 10×."
  ]
 },
 "price_to_book": {
  "en": [
   "Price-to-book (P/B)",
   "Market value divided by shareholders’ equity (book value). Most useful for banks and asset-heavy companies.",
   "Market value $300 and equity $200 give a P/B of 1.5."
  ],
  "tr": [
   "PD/DD",
   "Piyasa değerinin özkaynağa (defter değerine) oranı. En çok bankalar ve varlığı ağır şirketler için işe yarar.",
   "300 $ piyasa değeri ve 200 $ özkaynak: PD/DD 1,5."
  ],
  "es": [
   "Precio/valor contable (P/B)",
   "Capitalización dividida entre el patrimonio (valor contable). Es más útil en bancos y empresas con muchos activos.",
   "300 $ de capitalización y 200 $ de patrimonio dan un P/B de 1,5."
  ]
 },
 "multiples": {
  "en": [
   "Multiples",
   "Ratios that express a price per unit of something, such as per dollar of earnings, sales or book value. Used to compare a company with similar ones.",
   "Peers at 20 times earnings and yours at 30: yours is priced higher per dollar of profit."
  ],
  "tr": [
   "Çarpanlar",
   "Fiyatı bir şeyin birimi başına gösteren oranlar: kazancın, satışın veya defter değerinin doları başına. Şirketi benzerleriyle karşılaştırmak için kullanılır.",
   "Rakipler kazancın 20 katında, seninki 30 katında: seninki kâr başına daha pahalı fiyatlanıyor."
  ],
  "es": [
   "Múltiplos",
   "Ratios que expresan un precio por unidad de algo, como por dólar de beneficio, de ventas o de valor contable. Sirven para comparar una empresa con otras parecidas.",
   "Comparables a 20 veces beneficios y la tuya a 30: la tuya cotiza más cara por dólar de beneficio."
  ]
 },
 "median": {
  "en": [
   "Median",
   "The middle value once the numbers are sorted. Unlike the average, one extreme value barely moves it.",
   "The median of 10, 12 and 50 is 12; the average is 24."
  ],
  "tr": [
   "Medyan (ortanca)",
   "Sayılar sıralandığında ortada kalan değer. Ortalamanın aksine tek bir uç değerden pek etkilenmez.",
   "10, 12 ve 50’nin medyanı 12, ortalaması 24’tür."
  ],
  "es": [
   "Mediana",
   "El valor central cuando los números se ordenan. A diferencia de la media, un valor extremo apenas la mueve.",
   "La mediana de 10, 12 y 50 es 12; la media es 24."
  ]
 },
 "sbc": {
  "en": [
   "Stock-based compensation (SBC)",
   "Pay given to employees in shares or options instead of cash. It costs no cash today but dilutes shareholders, so QuantEdge subtracts it as a real cost.",
   "Cash flow $100 with SBC $20: $80 after SBC."
  ],
  "tr": [
   "Hisse bazlı ücret (SBC)",
   "Çalışanlara nakit yerine hisse veya opsiyonla verilen ücret. Bugün nakit çıkmaz ama hissedarların payını sulandırır; bu yüzden QuantEdge onu gerçek bir maliyet olarak düşer.",
   "100 $ nakit akışı, 20 $ SBC: SBC sonrası 80 $."
  ],
  "es": [
   "Remuneración en acciones (SBC)",
   "Pago a empleados en acciones u opciones en lugar de efectivo. No gasta caja hoy, pero diluye a los accionistas, así que QuantEdge la resta como un coste real.",
   "100 $ de flujo de caja con 20 $ de SBC: 80 $ después de SBC."
  ]
 },
 "accruals": {
  "en": [
   "Accruals ratio",
   "Net income minus operating cash flow, divided by average total assets. Positive means reported profit ran ahead of cash.",
   "Net income $100, operating cash $70, assets $1,000: accruals ratio 3%."
  ],
  "tr": [
   "Tahakkuk oranı",
   "Net kârdan işletme nakit akışının çıkarılıp ortalama toplam varlığa bölünmesi. Pozitifse raporlanan kâr nakdin önüne geçmiş demektir.",
   "Net kâr 100 $, işletme nakdi 70 $, varlık 1.000 $: tahakkuk oranı %3."
  ],
  "es": [
   "Ratio de devengos",
   "Beneficio neto menos flujo de caja operativo, dividido entre el activo total medio. Si es positivo, el beneficio publicado fue por delante del efectivo.",
   "Beneficio neto 100 $, caja operativa 70 $, activos 1.000 $: ratio de devengos del 3 %."
  ]
 },
 "dso": {
  "en": [
   "DSO (days sales outstanding)",
   "How many days, on average, customers take to pay: average receivables ÷ revenue × 365.",
   "Receivables $300 on revenue $3,650 is 30 days."
  ],
  "tr": [
   "DSO (alacak tahsil süresi)",
   "Müşterilerin ortalama kaç günde ödediği: ortalama alacaklar ÷ gelir × 365.",
   "3.650 $ gelire karşı 300 $ alacak: 30 gün."
  ],
  "es": [
   "DSO (días de cobro)",
   "Cuántos días tardan de media los clientes en pagar: cuentas por cobrar medias ÷ ingresos × 365.",
   "300 $ por cobrar con 3.650 $ de ingresos son 30 días."
  ]
 },
 "dio": {
  "en": [
   "DIO (days inventory outstanding)",
   "How many days goods sit in stock before being sold: average inventory ÷ cost of sales × 365.",
   "Inventory $400 with cost of sales $2,920 is 50 days."
  ],
  "tr": [
   "DIO (stokta kalma süresi)",
   "Malların satılmadan önce stokta kaç gün kaldığı: ortalama stok ÷ satılan malın maliyeti × 365.",
   "2.920 $ satılan malın maliyetine karşı 400 $ stok: 50 gün."
  ],
  "es": [
   "DIO (días de inventario)",
   "Cuántos días pasa la mercancía en el almacén antes de venderse: inventario medio ÷ coste de ventas × 365.",
   "400 $ de inventario con 2.920 $ de coste de ventas son 50 días."
  ]
 },
 "dpo": {
  "en": [
   "DPO (days payables outstanding)",
   "How many days the company takes to pay its suppliers: average payables ÷ cost of sales × 365.",
   "Payables $480 with cost of sales $2,920 is 60 days."
  ],
  "tr": [
   "DPO (borç ödeme süresi)",
   "Şirketin tedarikçilerine kaç günde ödediği: ortalama ticari borçlar ÷ satılan malın maliyeti × 365.",
   "2.920 $ satılan malın maliyetine karşı 480 $ ticari borç: 60 gün."
  ],
  "es": [
   "DPO (días de pago)",
   "Cuántos días tarda la empresa en pagar a sus proveedores: cuentas por pagar medias ÷ coste de ventas × 365.",
   "480 $ por pagar con 2.920 $ de coste de ventas son 60 días."
  ]
 },
 "cash_conversion_cycle": {
  "en": [
   "Cash conversion cycle",
   "Days cash is tied up between paying for goods and collecting from customers: DSO + DIO − DPO. Shorter is usually better.",
   "30 + 50 − 60 = a 20-day cycle."
  ],
  "tr": [
   "Nakit dönüşüm döngüsü",
   "Nakdin, mallara ödeme yapılmasıyla müşteriden tahsilat arasında bağlı kaldığı gün sayısı: DSO + DIO − DPO. Genelde kısa olması iyidir.",
   "30 + 50 − 60 = 20 günlük döngü."
  ],
  "es": [
   "Ciclo de conversión de efectivo",
   "Días que el efectivo queda atrapado entre pagar la mercancía y cobrar a los clientes: DSO + DIO − DPO. Más corto suele ser mejor.",
   "30 + 50 − 60 = un ciclo de 20 días."
  ]
 },
 "asset_turnover": {
  "en": [
   "Asset turnover",
   "Revenue divided by average total assets: how many dollars of sales each dollar of assets brings in.",
   "Revenue $1,000 on assets $500 is a turnover of 2×."
  ],
  "tr": [
   "Varlık devir hızı",
   "Gelirin ortalama toplam varlığa oranı: her dolarlık varlığın kaç dolarlık satış getirdiği.",
   "500 $ varlıkla 1.000 $ gelir: devir hızı 2×."
  ],
  "es": [
   "Rotación de activos",
   "Ingresos divididos entre el activo total medio: cuántos dólares de ventas trae cada dólar de activos.",
   "1.000 $ de ingresos con 500 $ de activos es una rotación de 2×."
  ]
 },
 "equity_multiplier": {
  "en": [
   "Equity multiplier",
   "Average total assets divided by average equity, a measure of leverage. Higher means more of the assets are financed with debt, which can lift ROE but adds risk.",
   "Assets $300 on equity $100 is a multiplier of 3×."
  ],
  "tr": [
   "Özkaynak çarpanı",
   "Ortalama toplam varlığın ortalama özkaynağa oranı; kaldıracın bir ölçüsü. Yüksekse varlıkların daha çoğu borçla finanse edilmiştir; bu ROE’yi yükseltebilir ama riski artırır.",
   "100 $ özkaynakla 300 $ varlık: çarpan 3×."
  ],
  "es": [
   "Multiplicador del patrimonio",
   "Activo total medio dividido entre el patrimonio medio, una medida del apalancamiento. Más alto significa más activos financiados con deuda: puede subir el ROE pero añade riesgo.",
   "300 $ de activos con 100 $ de patrimonio es un multiplicador de 3×."
  ]
 },
 "altman_z": {
  "en": [
   "Altman Z-score",
   "A single number that combines a few balance-sheet ratios to flag the risk of financial distress. For the book-value Z'' version, above 2.6 is the safe zone and below 1.1 the risk zone.",
   "A Z'' of 3.0 sits in the safe zone; it is a warning light, not a prediction."
  ],
  "tr": [
   "Altman Z skoru",
   "Birkaç bilanço oranını birleştirip finansal sıkıntı riskine işaret eden tek bir sayı. Defter değerli Z'' sürümünde 2,6 üstü güvenli, 1,1 altı riskli bölgedir.",
   "3,0’lık Z'' güvenli bölgededir; bir uyarı ışığıdır, tahmin değildir."
  ],
  "es": [
   "Z de Altman",
   "Un solo número que combina unas pocas ratios del balance para señalar el riesgo de dificultades financieras. En la versión Z'' con valores contables, más de 2,6 es zona segura y menos de 1,1 zona de riesgo.",
   "Una Z'' de 3,0 está en zona segura; es una luz de aviso, no una predicción."
  ]
 },
 "piotroski_f": {
  "en": [
   "Piotroski F-score",
   "Nine simple yes/no tests on the annual report (profit, cash flow, debt, margins and more), scored 1 for each pass. It shows whether financial health improved versus last year.",
   "8 of 9 tests passed: most signals moved the right way this year."
  ],
  "tr": [
   "Piotroski F-skoru",
   "Yıllık rapor üzerinde dokuz basit evet/hayır testi (kâr, nakit akışı, borç, marj ve diğerleri); geçen her test 1 puan. Finansal sağlığın geçen yıla göre iyileşip iyileşmediğini gösterir.",
   "9 testten 8’i geçti: bu yıl işaretlerin çoğu doğru yöne gitmiş."
  ],
  "es": [
   "F-score de Piotroski",
   "Nueve pruebas sencillas de sí/no sobre el informe anual (beneficio, flujo de caja, deuda, márgenes y más), con 1 punto por cada una superada. Indica si la salud financiera mejoró frente al año anterior.",
   "8 de 9 pruebas superadas: casi todas las señales fueron en la buena dirección este año."
  ]
 },
 "interest_coverage": {
  "en": [
   "Interest coverage",
   "EBIT divided by interest expense: how many times operating profit covers the interest bill. Low coverage means less room if profit falls.",
   "EBIT $100 and interest $20 give coverage of 5×."
  ],
  "tr": [
   "Faiz karşılama oranı",
   "FVÖK’ün faiz giderine oranı: faaliyet kârının faiz faturasını kaç kez karşıladığı. Düşükse kâr düştüğünde hareket alanı azdır.",
   "100 $ FVÖK ve 20 $ faiz: karşılama 5×."
  ],
  "es": [
   "Cobertura de intereses",
   "EBIT dividido entre el gasto por intereses: cuántas veces el beneficio operativo cubre los intereses. Si es baja, hay menos margen si cae el beneficio.",
   "100 $ de EBIT y 20 $ de intereses dan una cobertura de 5×."
  ]
 },
 "dividend": {
  "en": [
   "Dividend",
   "Cash a company pays out to its shareholders, usually from profit, typically every quarter or year.",
   "A $1 dividend per share on 100 shares pays you $100."
  ],
  "tr": [
   "Temettü",
   "Şirketin hissedarlarına, genelde kârdan, çoğunlukla her çeyrek ya da yıl ödediği nakit.",
   "Hisse başına 1 $ temettüyle 100 hisse sana 100 $ öder."
  ],
  "es": [
   "Dividendo",
   "Efectivo que la empresa paga a sus accionistas, normalmente del beneficio, por lo general cada trimestre o cada año.",
   "Un dividendo de 1 $ por acción con 100 acciones te paga 100 $."
  ]
 },
 "buyback": {
  "en": [
   "Share buyback",
   "The company uses cash to buy back its own shares, which lowers the share count. Another way, besides dividends, to return cash to shareholders.",
   "Buying back 5 of 100 shares cuts the count by 5%."
  ],
  "tr": [
   "Hisse geri alımı",
   "Şirketin nakitle kendi hisselerini geri satın alması; hisse sayısı azalır. Temettü dışında hissedarlara nakit iade etmenin bir yolu.",
   "100 hisseden 5’ini geri almak hisse sayısını %5 azaltır."
  ],
  "es": [
   "Recompra de acciones",
   "La empresa usa efectivo para comprar sus propias acciones, lo que reduce su número. Otra forma, además de los dividendos, de devolver caja a los accionistas.",
   "Recomprar 5 de 100 acciones reduce el número un 5 %."
  ]
 },
 "goodwill": {
  "en": [
   "Goodwill",
   "The part of an acquisition price paid above the fair value of the target’s identifiable net assets. It sits on the balance sheet as an asset.",
   "Paying $100 for a company with $70 of net assets creates $30 of goodwill."
  ],
  "tr": [
   "Şerefiye",
   "Bir satın almada hedefin tanımlanabilir net varlıklarının gerçeğe uygun değerinin üstünde ödenen kısım. Bilançoda varlık olarak durur.",
   "70 $ net varlıklı bir şirkete 100 $ ödemek 30 $ şerefiye yaratır."
  ],
  "es": [
   "Fondo de comercio",
   "La parte del precio de una adquisición pagada por encima del valor razonable de los activos netos identificables del objetivo. Figura en el balance como activo.",
   "Pagar 100 $ por una empresa con 70 $ de activos netos crea 30 $ de fondo de comercio."
  ]
 },
 "segment": {
  "en": [
   "Segment",
   "A part of the business that the company reports separately in its 10-K, such as a product line or a region.",
   "A phone maker might report Phones, Services and Wearables as segments."
  ],
  "tr": [
   "Bölüm",
   "Şirketin 10-K’da ayrı raporladığı iş parçası; örneğin bir ürün grubu veya bölge.",
   "Bir telefon üreticisi Telefon, Hizmetler ve Giyilebilir ürünleri ayrı bölümler olarak raporlayabilir."
  ],
  "es": [
   "Segmento",
   "Una parte del negocio que la empresa informa por separado en su 10-K, como una línea de producto o una región.",
   "Un fabricante de móviles puede informar Teléfonos, Servicios y Accesorios como segmentos."
  ]
 },
 "form_8k": {
  "en": [
   "8-K",
   "A short report US companies file with the SEC when something important happens. Item 2.02 is used for results announcements.",
   ""
  ],
  "tr": [
   "8-K",
   "ABD’li şirketlerin önemli bir şey olduğunda SEC’e verdiği kısa rapor. Item 2.02 sonuç açıklamaları için kullanılır.",
   ""
  ],
  "es": [
   "8-K",
   "Informe breve que las empresas de EE. UU. presentan a la SEC cuando ocurre algo importante. El item 2.02 se usa para anunciar resultados.",
   ""
  ]
 },
 "form_4": {
  "en": [
   "Form 4",
   "The SEC filing in which a company’s directors, officers and owners of more than 10% report their trades in its shares, within two business days.",
   ""
  ],
  "tr": [
   "Form 4",
   "Şirketin yönetim kurulu üyeleri, yöneticileri ve %10’dan fazla hisse sahiplerinin şirket hisselerindeki işlemlerini iki iş günü içinde bildirdiği SEC belgesi.",
   ""
  ],
  "es": [
   "Form 4",
   "La declaración ante la SEC en la que consejeros, directivos y dueños de más del 10 % informan de sus operaciones con acciones de la empresa, en dos días hábiles.",
   ""
  ]
 },
 "form_13f": {
  "en": [
   "13F",
   "A quarterly SEC filing in which US investment managers with more than $100 million list their stock holdings. It arrives up to 45 days after the quarter ends.",
   ""
  ],
  "tr": [
   "13F",
   "100 milyon $’dan fazla varlık yöneten ABD’li yatırım kuruluşlarının hisse varlıklarını listelediği çeyreklik SEC belgesi. Çeyrek bittikten 45 güne kadar sonra gelir.",
   ""
  ],
  "es": [
   "13F",
   "Declaración trimestral ante la SEC en la que los gestores de EE. UU. con más de 100 millones de $ enumeran sus acciones. Llega hasta 45 días después del cierre del trimestre.",
   ""
  ]
 },
 "xbrl": {
  "en": [
   "XBRL",
   "A machine-readable format in which every figure in a SEC filing is tagged, so a program can read revenue or debt without guessing.",
   "The tag us-gaap:Revenues marks the revenue figure."
  ],
  "tr": [
   "XBRL",
   "SEC belgelerindeki her rakamın etiketlendiği, bilgisayarın okuyabildiği biçim; böylece bir program geliri veya borcu tahmin etmeden okuyabilir.",
   "us-gaap:Revenues etiketi gelir rakamını işaretler."
  ],
  "es": [
   "XBRL",
   "Formato legible por máquina en el que se etiqueta cada cifra de un documento de la SEC, para que un programa lea los ingresos o la deuda sin adivinar.",
   "La etiqueta us-gaap:Revenues marca la cifra de ingresos."
  ]
 },
 "sec": {
  "en": [
   "SEC",
   "The US Securities and Exchange Commission, the US market regulator. Companies file their 10-K, 10-Q, 8-K and other reports with it on its EDGAR system.",
   ""
  ],
  "tr": [
   "SEC",
   "ABD Menkul Kıymetler ve Borsa Komisyonu, ABD piyasa düzenleyicisi. Şirketler 10-K, 10-Q, 8-K ve diğer raporlarını onun EDGAR sistemine verir.",
   ""
  ],
  "es": [
   "SEC",
   "La Comisión de Bolsa y Valores de EE. UU., el regulador del mercado. Las empresas presentan allí, en su sistema EDGAR, sus 10-K, 10-Q, 8-K y otros informes.",
   ""
  ]
 },
 "option": {
  "en": [
   "Option",
   "A contract giving the right, but not the duty, to buy (call) or sell (put) a share at a fixed strike price until an expiry date.",
   ""
  ],
  "tr": [
   "Opsiyon",
   "Bir hisseyi vade tarihine kadar sabit bir kullanım fiyatından alma (alım) veya satma (satım) hakkı veren, ama zorunluluk getirmeyen sözleşme.",
   ""
  ],
  "es": [
   "Opción",
   "Un contrato que da el derecho, pero no la obligación, de comprar (call) o vender (put) una acción a un precio de ejercicio fijo hasta una fecha de vencimiento.",
   ""
  ]
 },
 "call_option": {
  "en": [
   "Call option",
   "The right to buy a share at the strike price until expiry. It gains value when the share price rises.",
   "Strike $100, share at $110 on expiry: the call is worth $10."
  ],
  "tr": [
   "Alım opsiyonu",
   "Bir hisseyi vadeye kadar kullanım fiyatından satın alma hakkı. Hisse fiyatı yükseldikçe değer kazanır.",
   "Kullanım fiyatı 100 $, vadede hisse 110 $: alım opsiyonu 10 $ eder."
  ],
  "es": [
   "Opción de compra",
   "El derecho a comprar una acción al precio de ejercicio hasta el vencimiento. Gana valor cuando sube el precio de la acción.",
   "Ejercicio 100 $, acción a 110 $ al vencimiento: la call vale 10 $."
  ]
 },
 "put_option": {
  "en": [
   "Put option",
   "The right to sell a share at the strike price until expiry. It gains value when the share price falls.",
   "Strike $100, share at $90 on expiry: the put is worth $10."
  ],
  "tr": [
   "Satım opsiyonu",
   "Bir hisseyi vadeye kadar kullanım fiyatından satma hakkı. Hisse fiyatı düştükçe değer kazanır.",
   "Kullanım fiyatı 100 $, vadede hisse 90 $: satım opsiyonu 10 $ eder."
  ],
  "es": [
   "Opción de venta",
   "El derecho a vender una acción al precio de ejercicio hasta el vencimiento. Gana valor cuando baja el precio de la acción.",
   "Ejercicio 100 $, acción a 90 $ al vencimiento: la put vale 10 $."
  ]
 },
 "strike_price": {
  "en": [
   "Strike price",
   "The fixed price at which an option lets you buy or sell the share.",
   "A call with a $100 strike lets you buy at $100 whatever the market price."
  ],
  "tr": [
   "Kullanım fiyatı",
   "Opsiyonun hisseyi almana veya satmana izin verdiği sabit fiyat.",
   "Kullanım fiyatı 100 $ olan alım opsiyonu, piyasa fiyatı ne olursa olsun 100 $’dan almanı sağlar."
  ],
  "es": [
   "Precio de ejercicio",
   "El precio fijo al que una opción te permite comprar o vender la acción.",
   "Una call con ejercicio de 100 $ te deja comprar a 100 $ sea cual sea el precio de mercado."
  ]
 },
 "expiry": {
  "en": [
   "Expiry",
   "The last date on which an option can be used; after it the option is gone. Each stock has options with several expiries.",
   "An option expiring in 30 days has T = 30 ÷ 365 ≈ 0.08 years left."
  ],
  "tr": [
   "Vade",
   "Opsiyonun kullanılabileceği son tarih; sonrasında opsiyon sona erer. Her hissenin farklı vadeli opsiyonları olur.",
   "30 gün sonra vadesi dolan opsiyonda T = 30 ÷ 365 ≈ 0,08 yıl kalmıştır."
  ],
  "es": [
   "Vencimiento",
   "La última fecha en que se puede usar una opción; después deja de existir. Cada acción tiene opciones con varios vencimientos.",
   "Una opción que vence en 30 días tiene T = 30 ÷ 365 ≈ 0,08 años."
  ]
 },
 "implied_volatility": {
  "en": [
   "Implied volatility",
   "The volatility that makes the Black–Scholes price equal the option’s market price: the size of moves the options market is pricing in.",
   "An implied volatility of 32% a year is about 2% a day (32% ÷ √252)."
  ],
  "tr": [
   "Örtük oynaklık",
   "Black–Scholes fiyatını opsiyonun piyasa fiyatına eşitleyen oynaklık: opsiyon piyasasının fiyatladığı hareket büyüklüğü.",
   "Yıllık %32 örtük oynaklık günde yaklaşık %2’dir (%32 ÷ √252)."
  ],
  "es": [
   "Volatilidad implícita",
   "La volatilidad que iguala el precio de Black–Scholes al precio de mercado de la opción: el tamaño de los movimientos que descuenta el mercado de opciones.",
   "Una volatilidad implícita del 32 % anual es cerca de un 2 % diario (32 % ÷ √252)."
  ]
 },
 "volatility_smile": {
  "en": [
   "Volatility smile",
   "The curve you get when each strike’s implied volatility is plotted. If Black–Scholes were exactly right it would be flat; in practice it bends.",
   "Puts far below the price often show higher implied volatility than options near it."
  ],
  "tr": [
   "Oynaklık gülümsemesi",
   "Her kullanım fiyatının örtük oynaklığı çizildiğinde çıkan eğri. Black–Scholes tam doğru olsaydı düz olurdu; gerçekte bükülür.",
   "Fiyatın çok altındaki satım opsiyonları çoğu zaman fiyata yakın olanlardan daha yüksek örtük oynaklık gösterir."
  ],
  "es": [
   "Sonrisa de volatilidad",
   "La curva que sale al dibujar la volatilidad implícita de cada precio de ejercicio. Si Black–Scholes fuera exacto sería plana; en la práctica se curva.",
   "Las puts muy por debajo del precio suelen tener más volatilidad implícita que las cercanas a él."
  ]
 },
 "black_scholes": {
  "en": [
   "Black–Scholes",
   "The classic formula for pricing an option from share price, strike, time to expiry, interest rate, dividend yield and one constant volatility.",
   ""
  ],
  "tr": [
   "Black–Scholes",
   "Bir opsiyonu hisse fiyatı, kullanım fiyatı, vadeye kalan süre, faiz, temettü verimi ve tek bir sabit oynaklıktan fiyatlayan klasik formül.",
   ""
  ],
  "es": [
   "Black–Scholes",
   "La fórmula clásica para valorar una opción a partir del precio de la acción, el precio de ejercicio, el tiempo al vencimiento, el tipo de interés, el rendimiento por dividendo y una única volatilidad constante.",
   ""
  ]
 },
 "heston": {
  "en": [
   "Heston model",
   "An option model in which volatility itself moves randomly and drifts back to a long-run level. Fitted to the whole smile, unlike a single Black–Scholes volatility.",
   ""
  ],
  "tr": [
   "Heston modeli",
   "Oynaklığın kendisinin de rastgele hareket ettiği ve uzun vadeli bir seviyeye geri döndüğü opsiyon modeli. Tek bir Black–Scholes oynaklığının aksine tüm gülümsemeye uydurulur.",
   ""
  ],
  "es": [
   "Modelo de Heston",
   "Un modelo de opciones en el que la propia volatilidad se mueve al azar y vuelve hacia un nivel de largo plazo. Se ajusta a toda la sonrisa, no a una única volatilidad de Black–Scholes.",
   ""
  ]
 },
 "monte_carlo": {
  "en": [
   "Monte Carlo simulation",
   "Running a model thousands of times with random shocks to see the range of possible outcomes, not a single forecast.",
   "10,000 simulated price paths: the middle 90% end between $70 and $140."
  ],
  "tr": [
   "Monte Carlo simülasyonu",
   "Tek bir tahmin yerine olası sonuçların aralığını görmek için bir modeli rastgele şoklarla binlerce kez çalıştırmak.",
   "10.000 benzetilmiş fiyat yolu: ortadaki %90’ı 70 $ ile 140 $ arasında biter."
  ],
  "es": [
   "Simulación de Monte Carlo",
   "Ejecutar un modelo miles de veces con choques aleatorios para ver el rango de resultados posibles, en lugar de una sola previsión.",
   "10.000 trayectorias simuladas: el 90 % central termina entre 70 $ y 140 $."
  ]
 },
 "brownian_motion": {
  "en": [
   "Brownian motion",
   "A random walk in continuous time. In geometric Brownian motion, the textbook stock model, the price gets a random percentage shock each moment, of typical size σ.",
   ""
  ],
  "tr": [
   "Brown hareketi",
   "Sürekli zamanda rastgele yürüyüş. Ders kitabındaki hisse modeli olan geometrik Brown hareketinde fiyat her an tipik büyüklüğü σ olan rastgele bir yüzde şoku alır.",
   ""
  ],
  "es": [
   "Movimiento browniano",
   "Un paseo aleatorio en tiempo continuo. En el movimiento browniano geométrico, el modelo de manual de una acción, el precio recibe a cada instante un choque porcentual aleatorio de tamaño típico σ.",
   ""
  ]
 },
 "factor": {
  "en": [
   "Factor (Fama–French)",
   "A return series that captures a broad style, such as market, size (small minus big), value (cheap minus expensive), profitability, investment or momentum. A stock’s loading shows how strongly it moves with each.",
   "A size loading of 0.5: the stock tends to rise 0.5% when small stocks beat big ones by 1%."
  ],
  "tr": [
   "Faktör (Fama–French)",
   "Piyasa, büyüklük (küçük eksi büyük), değer (ucuz eksi pahalı), kârlılık, yatırım veya momentum gibi geniş bir tarzı yakalayan getiri serisi. Hissenin yükü her biriyle ne kadar güçlü hareket ettiğini gösterir.",
   "Büyüklük yükü 0,5: küçük şirketler büyükleri %1 geçtiğinde hisse yaklaşık %0,5 yükselir."
  ],
  "es": [
   "Factor (Fama–French)",
   "Una serie de rentabilidades que recoge un estilo amplio, como mercado, tamaño (pequeñas menos grandes), valor (baratas menos caras), rentabilidad, inversión o momentum. La carga de una acción indica con qué fuerza se mueve con cada uno.",
   "Una carga de tamaño de 0,5: la acción tiende a subir un 0,5 % cuando las pequeñas superan a las grandes en un 1 %."
  ]
 },
 "survivorship_bias": {
  "en": [
   "Survivorship bias",
   "Testing only on companies that still exist today, so those that failed or delisted are missing. Results can look better than reality.",
   ""
  ],
  "tr": [
   "Hayatta kalma yanılgısı",
   "Yalnızca bugün hâlâ var olan şirketlerle test yapmak; batanlar veya borsadan çıkanlar eksik kalır. Sonuçlar gerçekte olduğundan iyi görünebilir.",
   ""
  ],
  "es": [
   "Sesgo de supervivencia",
   "Probar solo con empresas que siguen existiendo hoy, de modo que faltan las que quebraron o dejaron de cotizar. Los resultados pueden parecer mejores que la realidad.",
   ""
  ]
 },
 "backtest": {
  "en": [
   "Backtest",
   "Running a trading rule on past prices to see how it would have done. It is not a forecast: a rule that worked in the past may not work later.",
   ""
  ],
  "tr": [
   "Geriye dönük test (backtest)",
   "Bir alım satım kuralını geçmiş fiyatlar üzerinde çalıştırıp nasıl sonuç verirdi diye bakmak. Tahmin değildir: geçmişte işe yarayan kural sonra yaramayabilir.",
   ""
  ],
  "es": [
   "Backtest (prueba histórica)",
   "Aplicar una regla de trading a precios pasados para ver cómo habría funcionado. No es una previsión: una regla que funcionó antes puede no funcionar después.",
   ""
  ]
 },
 "deal_premium": {
  "en": [
   "Offer premium",
   "In a takeover, how much more than the target’s market price the buyer offers: offer price ÷ last close before the announcement − 1.",
   "An offer of $95 for a stock that closed at $65 is a premium of about 46%."
  ],
  "tr": [
   "Teklif primi",
   "Bir satın almada alıcının hedefin piyasa fiyatının ne kadar üstünde teklif verdiği: teklif fiyatı ÷ duyurudan önceki son kapanış − 1.",
   "65 $’dan kapanmış bir hisseye 95 $ teklif yaklaşık %46 primdir."
  ],
  "es": [
   "Prima de la oferta",
   "En una adquisición, cuánto por encima del precio de mercado del objetivo ofrece el comprador: precio ofrecido ÷ último cierre antes del anuncio − 1.",
   "Ofrecer 95 $ por una acción que cerró a 65 $ es una prima de cerca del 46 %."
  ]
 },
 "bisection": {
  "en": [
   "Bisection",
   "A way to solve for an unknown number by halving the search range again and again until the model matches the target.",
   "Looking for growth between 0% and 20%: try 10%, then 5% or 15%, and so on."
  ],
  "tr": [
   "İkiye bölme",
   "Bilinmeyen bir sayıyı, model hedefe eşit olana kadar arama aralığını tekrar tekrar yarıya indirerek bulma yöntemi.",
   "Büyümeyi %0 ile %20 arasında arıyorsan: önce %10’u, sonra %5’i ya da %15’i dene, böyle devam et."
  ],
  "es": [
   "Bisección",
   "Una forma de hallar un número desconocido partiendo el intervalo de búsqueda por la mitad una y otra vez hasta que el modelo coincide con el objetivo.",
   "Si buscas un crecimiento entre 0 % y 20 %: prueba 10 %, luego 5 % o 15 %, y así sucesivamente."
  ]
 },
 "operating_cash_flow": {
  "en": [
   "Operating cash flow (CFO)",
   "Cash that actually came in from running the business during the period, from the cash-flow statement.",
   "Net income $100 but operating cash flow $70: $30 of profit has not yet turned into cash."
  ],
  "tr": [
   "İşletme nakit akışı (İNA)",
   "Dönem içinde işi yürütmekten gerçekten gelen nakit; rakam nakit akış tablosunda yer alır.",
   "Net kâr 100 $, işletme nakit akışı 70 $: kârın 30 $’ı henüz nakde dönmemiş."
  ],
  "es": [
   "Flujo de caja operativo (FCO)",
   "El efectivo que realmente entró por la actividad del negocio en el periodo, según el estado de flujos de efectivo.",
   "Beneficio neto 100 $ pero flujo operativo 70 $: 30 $ del beneficio aún no son efectivo."
  ]
 },
 "book_value": {
  "en": [
   "Book value",
   "Shareholders’ equity as recorded in the accounts: assets minus liabilities. It can differ a lot from market value.",
   "Assets $500 minus liabilities $300 is a book value of $200."
  ],
  "tr": [
   "Defter değeri",
   "Muhasebe kayıtlarındaki özkaynak: varlıklar eksi yükümlülükler. Piyasa değerinden çok farklı olabilir.",
   "500 $ varlık − 300 $ yükümlülük = 200 $ defter değeri."
  ],
  "es": [
   "Valor contable",
   "El patrimonio según la contabilidad: activos menos pasivos. Puede ser muy distinto del valor de mercado.",
   "500 $ de activos menos 300 $ de pasivos son 200 $ de valor contable."
  ]
 },
 "depreciation_amortization": {
  "en": [
   "Depreciation and amortisation (D&A)",
   "The yearly accounting charge that spreads the cost of long-lived assets over their useful life. It lowers profit but is not a cash payment that year.",
   "A $50 machine used for 5 years is charged at $10 a year."
  ],
  "tr": [
   "Amortisman",
   "Uzun ömürlü varlıkların maliyetini kullanım ömrüne yayan yıllık muhasebe gideri. Kârı düşürür ama o yıl nakit ödemesi değildir.",
   "5 yıl kullanılacak 50 $’lık makine için yılda 10 $ amortisman ayrılır."
  ],
  "es": [
   "Depreciación y amortización (D&A)",
   "El cargo contable anual que reparte el coste de los activos duraderos a lo largo de su vida útil. Reduce el beneficio, pero ese año no es un pago en efectivo.",
   "Una máquina de 50 $ usada 5 años se carga a 10 $ por año."
  ]
 },
 "adjusted_close": {
  "en": [
   "Adjusted close",
   "The closing price corrected for dividends and share splits, so returns over time are comparable.",
   "After a 2-for-1 split, an old close of $100 shows as $50."
  ],
  "tr": [
   "Düzeltilmiş kapanış",
   "Temettü ve hisse bölünmelerine göre düzeltilmiş kapanış fiyatı; böylece zaman içindeki getiriler karşılaştırılabilir.",
   "1’e 2 bölünmeden sonra eski 100 $’lık kapanış 50 $ görünür."
  ],
  "es": [
   "Cierre ajustado",
   "El precio de cierre corregido por dividendos y splits, para que las rentabilidades a lo largo del tiempo sean comparables.",
   "Tras un split de 2 por 1, un cierre antiguo de 100 $ aparece como 50 $."
  ]
 },
 "straddle": {
  "en": [
   "Straddle",
   "A call plus a put at the same strike and expiry. It pays off when the stock moves a lot in either direction, so its price shows the size of move the market expects.",
   "Call $3 + put $3 on a $100 stock: a priced move of about 6%."
  ],
  "tr": [
   "Straddle",
   "Aynı kullanım fiyatı ve vadede bir alım artı bir satım opsiyonu. Hisse hangi yöne olursa olsun çok hareket edince kazandırır; fiyatı piyasanın beklediği hareket büyüklüğünü gösterir.",
   "100 $’lık hissede 3 $ alım + 3 $ satım: yaklaşık %6’lık fiyatlanan hareket."
  ],
  "es": [
   "Straddle",
   "Una call más una put con el mismo precio de ejercicio y vencimiento. Gana si la acción se mueve mucho en cualquier dirección, así que su precio muestra el movimiento que espera el mercado.",
   "Call de 3 $ + put de 3 $ en una acción de 100 $: un movimiento valorado de cerca del 6 %."
  ]
 },
 "fcff": {
  "en": [
   "Free cash flow to the firm (FCFF)",
   "Cash the business generates before paying lenders and shareholders: EBIT after tax + D&A − capex − extra working capital.",
   "176 + 44 − 55 − 5 = FCFF of 160."
  ],
  "tr": [
   "Firmaya serbest nakit akışı (FCFF)",
   "İşletmenin borç verenlere ve hissedarlara ödemeden önce ürettiği nakit: vergi sonrası FVÖK + amortisman − yatırım harcaması − ek işletme sermayesi.",
   "176 + 44 − 55 − 5 = 160 FCFF."
  ],
  "es": [
   "Flujo de caja libre de la empresa (FCFF)",
   "La caja que genera el negocio antes de pagar a acreedores y accionistas: EBIT después de impuestos + D&A − capex − capital circulante adicional.",
   "176 + 44 − 55 − 5 = un FCFF de 160."
  ]
 },
 "event_study": {
  "en": [
   "Event study",
   "Measuring how a stock reacted around a dated event, such as results, by comparing its return with the market’s over the same days.",
   ""
  ],
  "tr": [
   "Olay çalışması",
   "Bir hissenin sonuç açıklaması gibi tarihli bir olay etrafında nasıl tepki verdiğini, aynı günlerdeki piyasa getirisiyle karşılaştırarak ölçmek.",
   ""
  ],
  "es": [
   "Estudio de eventos",
   "Medir cómo reaccionó una acción en torno a un hecho con fecha, como los resultados, comparando su rentabilidad con la del mercado en los mismos días.",
   ""
  ]
 }
});
var QE_GLOSSARY_ALIASES = {"revenue":{"en":["revenue","revenues","sales"],"tr":["gelir","hasılat","satışlar"],"es":["ingresos","ventas"]},"revenue_growth":{"en":["revenue growth"],"tr":["gelir büyümesi"],"es":["crecimiento de ingresos"]},"operating_margin":{"en":["operating margin","operating margins"],"tr":["faaliyet marjı","faaliyet marjları","faaliyet kâr marjı"],"es":["margen operativo","márgenes operativos"]},"net_margin":{"en":["net margin"],"tr":["net kâr marjı","net marj"],"es":["margen neto"]},"net_income":{"en":["net income"],"tr":["net kâr"],"es":["beneficio neto"]},"free_cash_flow":{"en":["free cash flow","FCF"],"tr":["serbest nakit akışı","SNA","FCF"],"es":["flujo de caja libre","FCF"]},"cash_conversion":{"en":["cash conversion"],"tr":["nakit dönüşümü"],"es":["conversión en caja","conversión de caja"]},"cagr":{"en":["CAGR","compound annual growth","compound annual growth rate"],"tr":["CAGR","bileşik yıllık büyüme","yıllık bileşik büyüme"],"es":["CAGR","crecimiento anual compuesto","tasa de crecimiento anual compuesta"]},"ttm":{"en":["TTM","trailing twelve months","last 12 months"],"tr":["TTM","son 12 ay"],"es":["TTM","últimos doce meses","últimos 12 meses"]},"fiscal_year":{"en":["fiscal year","fiscal years"],"tr":["mali yıl"],"es":["año fiscal","años fiscales","ejercicio fiscal"]},"form_10k":{"en":["10-K"],"tr":["10-K"],"es":["10-K"]},"form_10q":{"en":["10-Q"],"tr":["10-Q"],"es":["10-Q"]},"current_ratio":{"en":["current ratio"],"tr":["cari oran"],"es":["ratio corriente","ratio de liquidez"]},"capex":{"en":["capex","capital expenditure","capital spending"],"tr":["capex","yatırım harcaması"],"es":["capex","inversión en activos","inversión en capital"]},"dcf":{"en":["DCF","discounted cash flow"],"tr":["DCF","indirgenmiş nakit akışı"],"es":["DCF","flujo de caja descontado"]},"wacc":{"en":["WACC","weighted average cost of capital"],"tr":["WACC","ağırlıklı ortalama sermaye maliyeti"],"es":["WACC","coste medio ponderado del capital"]},"terminal_growth":{"en":["terminal growth"],"tr":["uç büyüme","uç (terminal) büyüme","uzun vadeli büyüme"],"es":["crecimiento terminal"]},"enterprise_value":{"en":["enterprise value","EV"],"tr":["firma değeri","FD"],"es":["valor de empresa","EV"]},"equity_value":{"en":["equity value"],"tr":["özkaynak değeri"],"es":["valor del patrimonio"]},"diluted_shares":{"en":["diluted shares","diluted share count"],"tr":["seyreltilmiş hisse"],"es":["acciones diluidas"]},"sharpe":{"en":["Sharpe ratio","Sharpe"],"tr":["Sharpe oranı","Sharpe"],"es":["ratio de Sharpe","Sharpe"]},"max_drawdown":{"en":["max drawdown","drawdown"],"tr":["maksimum düşüş","en büyük düşüş"],"es":["caída máxima"]},"buy_hold":{"en":["buy and hold","buy-and-hold"],"tr":["al ve tut","al-ve-tut"],"es":["comprar y mantener"]},"out_of_sample":{"en":["out-of-sample","out of sample"],"tr":["test dışı dönem","test dışı"],"es":["fuera de muestra"]},"bps":{"en":["basis points"],"tr":["baz puan"],"es":["puntos básicos"]},"ebit":{"en":["EBIT","earnings before interest and taxes"],"tr":["FVÖK","faiz ve vergi öncesi kâr"],"es":["EBIT","beneficio antes de intereses e impuestos"]},"ebitda":{"en":["EBITDA"],"tr":["FAVÖK","EBITDA"],"es":["EBITDA"]},"nopat":{"en":["NOPAT","net operating profit after tax"],"tr":["NOPAT","vergi sonrası net faaliyet kârı"],"es":["NOPAT","beneficio operativo neto después de impuestos"]},"roe":{"en":["ROE","return on equity"],"tr":["ROE","özkaynak kârlılığı"],"es":["ROE","rentabilidad sobre el patrimonio"]},"roa":{"en":["ROA","return on assets"],"tr":["ROA","aktif kârlılığı"],"es":["ROA","rentabilidad sobre activos"]},"roic":{"en":["ROIC","return on invested capital"],"tr":["ROIC","yatırılan sermaye getirisi"],"es":["ROIC","rentabilidad sobre el capital invertido"]},"invested_capital":{"en":["invested capital"],"tr":["yatırılan sermaye"],"es":["capital invertido"]},"cost_of_equity":{"en":["cost of equity"],"tr":["özkaynak maliyeti"],"es":["coste del capital propio","coste del patrimonio"]},"cost_of_debt":{"en":["cost of debt"],"tr":["borç maliyeti"],"es":["coste de la deuda"]},"risk_free_rate":{"en":["risk-free rate","risk-free"],"tr":["risksiz faiz"],"es":["tipo sin riesgo","tipo libre de riesgo"]},"equity_risk_premium":{"en":["equity risk premium","ERP"],"tr":["hisse risk primi","HRP","ERP"],"es":["prima de riesgo de mercado","prima de riesgo del mercado","PRM","ERP"]},"beta":{"en":["beta"],"tr":["beta"],"es":["beta"]},"capm":{"en":["CAPM","capital asset pricing model"],"tr":["CAPM","sermaye varlıklarını fiyatlama modeli"],"es":["CAPM","modelo de valoración de activos de capital"]},"alpha":{"en":["alpha"],"tr":["alfa"],"es":["alfa"]},"volatility":{"en":["volatility","volatilities"],"tr":["oynaklık","oynaklığı"],"es":["volatilidad","volatilidades"]},"standard_deviation":{"en":["standard deviation"],"tr":["standart sapma"],"es":["desviación típica"]},"correlation":{"en":["correlation","correlations"],"tr":["korelasyon"],"es":["correlación","correlaciones"]},"log_return":{"en":["log return","log returns"],"tr":["log getiri"],"es":["rentabilidad logarítmica","rentabilidades logarítmicas"]},"abnormal_return":{"en":["abnormal return"],"tr":["olağandışı getiri"],"es":["rentabilidad anormal"]},"market_cap":{"en":["market value","market value of equity"],"tr":["piyasa değeri"],"es":["capitalización","valor de mercado"]},"net_debt":{"en":["net debt"],"tr":["net borç"],"es":["deuda neta"]},"working_capital":{"en":["working capital"],"tr":["işletme sermayesi"],"es":["capital circulante","capital de trabajo"]},"pe_ratio":{"en":["P/E","price-to-earnings"],"tr":["F/K","fiyat/kazanç"],"es":["P/E","PER","precio/beneficio"]},"ev_ebitda":{"en":["EV/EBITDA"],"tr":["FD/FAVÖK"],"es":["EV/EBITDA"]},"price_to_book":{"en":["P/B","price-to-book"],"tr":["PD/DD","piyasa değeri/defter değeri"],"es":["P/B","precio/valor contable"]},"multiples":{"en":["multiples"],"tr":["çarpanlar"],"es":["múltiplos","múltiplo"]},"median":{"en":["median","medians"],"tr":["medyan","ortanca"],"es":["mediana","medianas"]},"sbc":{"en":["SBC","stock-based compensation","stock-based pay"],"tr":["SBC","hisse bazlı ücret"],"es":["SBC","remuneración en acciones"]},"accruals":{"en":["accruals ratio","accruals"],"tr":["tahakkuk"],"es":["ratio de devengos","devengos"]},"dso":{"en":["DSO","days sales outstanding"],"tr":["DSO","alacak tahsil süresi"],"es":["DSO"]},"dio":{"en":["DIO","days inventory outstanding"],"tr":["DIO"],"es":["DIO","días de inventario"]},"dpo":{"en":["DPO","days payables outstanding"],"tr":["DPO"],"es":["DPO"]},"cash_conversion_cycle":{"en":["cash conversion cycle","CCC"],"tr":["nakit dönüşüm döngüsü","CCC"],"es":["ciclo de conversión de efectivo","CCC"]},"asset_turnover":{"en":["asset turnover"],"tr":["varlık devir hızı"],"es":["rotación de activos"]},"equity_multiplier":{"en":["equity multiplier"],"tr":["özkaynak çarpanı"],"es":["multiplicador del patrimonio","apalancamiento"]},"altman_z":{"en":["Altman Z","Z''"],"tr":["Altman Z skor","Z''"],"es":["Z de Altman","Z'' de Altman","Z''"]},"piotroski_f":{"en":["Piotroski F-score","F-score"],"tr":["F-skoru"],"es":["F-score"]},"interest_coverage":{"en":["interest coverage"],"tr":["faiz karşılama oranı","faiz karşılama"],"es":["cobertura de intereses"]},"dividend":{"en":["dividend","dividends"],"tr":["temettü"],"es":["dividendo","dividendos"]},"buyback":{"en":["share buybacks","buybacks"],"tr":["hisse geri alım","geri alım"],"es":["recompra","recompras","recompras de acciones"]},"goodwill":{"en":["goodwill"],"tr":["şerefiye"],"es":["fondo de comercio"]},"segment":{"en":["segment","segments"],"tr":[],"es":["segmento","segmentos"]},"form_8k":{"en":["8-K"],"tr":["8-K"],"es":["8-K"]},"form_4":{"en":["Form 4"],"tr":["Form 4"],"es":["Form 4"]},"form_13f":{"en":["13F","Form 13F"],"tr":["13F","Form 13F"],"es":["13F","Form 13F"]},"xbrl":{"en":["XBRL"],"tr":["XBRL"],"es":["XBRL"]},"sec":{"en":["SEC"],"tr":["SEC"],"es":["SEC"]},"option":{"en":[],"tr":[],"es":[]},"call_option":{"en":["call option","calls"],"tr":["alım opsiyonu"],"es":["opción de compra"]},"put_option":{"en":["put option","puts"],"tr":["satım opsiyonu","satım opsiyonları"],"es":["opción de venta"]},"strike_price":{"en":["strike price","strike","strikes"],"tr":["kullanım fiyatı","kullanım fiyatında","kullanım fiyatları"],"es":["precio de ejercicio","precios de ejercicio"]},"expiry":{"en":["expiry","expiries"],"tr":["vade tarihi","vadeye kalan","vadeye kadar"],"es":["vencimiento","vencimientos"]},"implied_volatility":{"en":["implied volatility","implied vol"],"tr":["örtük oynaklık","örtük oynaklığı","ima edilen oynaklık"],"es":["volatilidad implícita","volatilidades implícitas","vol. implícita"]},"volatility_smile":{"en":["smile"],"tr":["gülümseme"],"es":["sonrisa"]},"black_scholes":{"en":["Black–Scholes"],"tr":["Black–Scholes"],"es":["Black–Scholes"]},"heston":{"en":["Heston model","Heston"],"tr":["Heston modeli","Heston"],"es":["modelo de Heston","Heston"]},"monte_carlo":{"en":["Monte Carlo"],"tr":["Monte Carlo"],"es":["Monte Carlo"]},"brownian_motion":{"en":["Brownian motion","geometric Brownian motion"],"tr":["Brown hareketi","geometrik Brown hareketi"],"es":["movimiento browniano","movimiento browniano geométrico"]},"factor":{"en":["Fama–French","Fama/French","factor exposure"],"tr":["Fama–French","Fama/French"],"es":["Fama–French","Fama/French"]},"survivorship_bias":{"en":["survivorship bias"],"tr":["hayatta kalma yanılgısı"],"es":["sesgo de supervivencia"]},"backtest":{"en":["backtest"],"tr":["geriye dönük test","backtest"],"es":["backtest","prueba histórica"]},"deal_premium":{"en":["offer premium"],"tr":["teklif primi"],"es":["prima de la oferta"]},"bisection":{"en":["bisection"],"tr":["ikiye bölme"],"es":["bisección"]},"operating_cash_flow":{"en":["operating cash flow","cash from operations","CFO"],"tr":["işletme faaliyetlerinden nakit akışı","işletme nakit akışı","İNA","CFO"],"es":["flujo de caja operativo","flujo de caja de las operaciones","FCO","CFO"]},"book_value":{"en":["book value","book values"],"tr":["defter değeri"],"es":["valor contable","valores contables"]},"depreciation_amortization":{"en":["D&A","depreciation and amortization","depreciation"],"tr":["amortisman"],"es":["D&A","amortizaciones","depreciación y amortización"]},"adjusted_close":{"en":["adjusted close","adjusted closes","adjusted closing price"],"tr":["düzeltilmiş kapanış"],"es":["cierre ajustado","cierres ajustados"]},"straddle":{"en":["straddle"],"tr":["straddle"],"es":["straddle"]},"fcff":{"en":["FCFF","free cash flow to the firm"],"tr":["FCFF","firmaya serbest nakit akışı"],"es":["FCFF","flujo de caja libre de la empresa"]},"event_study":{"en":["event study"],"tr":["olay çalışması"],"es":["estudio de eventos"]}};

function qeGlossaryAll() {  // the help assistant's terms plus the Learn page's
  return Object.assign({}, QE_GLOSSARY, typeof QE_GLOSSARY_MORE !== 'undefined' ? QE_GLOSSARY_MORE : {});
}

function qeTerm(key) {
  var entry = QE_GLOSSARY[key] || (typeof QE_GLOSSARY_MORE !== 'undefined' && QE_GLOSSARY_MORE[key]);
  if (!entry) return null;
  return entry[QE_LANG] || entry.en;
}

/* Function component (no hooks): label + "?" + popover. CSS shows the popover on hover and focus. */
function Term(props) {
  var t = qeTerm(props.k);
  if (!t) return props.children || null;
  var ask = { tr: 'Bu ne demek?', es: '¿Qué significa?', en: 'What does this mean?' }[QE_LANG] || 'What does this mean?';
  var example = { tr: 'Örnek', es: 'Ejemplo', en: 'Example' }[QE_LANG] || 'Example';
  var e = React.createElement;
  return e('span', { className: 'term' },
    props.children || t[0],
    e('button', { type: 'button', className: 'term-q', 'aria-label': ask + ' ' + t[0], onClick: function (ev) { ev.preventDefault(); ev.stopPropagation(); ev.currentTarget.focus(); } }, '?'),
    e('span', { className: 'term-pop', role: 'tooltip' },
      e('strong', null, t[0]), e('span', null, t[1]),
      t[2] ? e('em', null, example + ': ' + t[2]) : null));
}

/* Keep the popover inside the viewport: measure when it opens and nudge it sideways. */
function qeFitTerm(ev) {
  var term = ev.target && ev.target.closest && ev.target.closest('.term');
  if (!term) return;
  var pop = term.querySelector('.term-pop');
  if (!pop) return;
  pop.style.transform = '';
  if (window.innerWidth <= 700) return; // phones: fixed bottom sheet (CSS)
  var r = pop.getBoundingClientRect();
  if (!r.width) return;
  var dx = 0;
  if (r.right > window.innerWidth - 12) dx = window.innerWidth - 12 - r.right;
  if (r.left + dx < 12) dx = 12 - r.left;
  if (dx) pop.style.transform = 'translateX(' + Math.round(dx) + 'px)';
}
document.addEventListener('mouseover', qeFitTerm);
document.addEventListener('focusin', qeFitTerm);

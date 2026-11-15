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

function qeTerm(key) {
  var entry = QE_GLOSSARY[key];
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

const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
pres.lang = 'he-IL';
pres.rtlMode = true;
pres.title = 'התמודדות עם חוסר ודאות תעסוקתי';

const NAVY = '14213D', AMBER = 'FCA311', LIGHT = 'F4F6FA', GRAY = '6B7280', WHITE = 'FFFFFF', TEAL = '2A9D8F', RED = 'E76F51', INK = '1F2937', CARD = 'EEF2F8';
const F = 'Arial';
const W = 13.33, H = 7.5;

// ---------- helpers ----------
const T = (slide, text, o) => slide.addText(text, { fontFace: F, rtlMode: true, lang: 'he-IL', isTextBox: true, align: 'right', valign: 'top', margin: 0, color: INK, ...o });
function title(slide, text, o = {}) {
  T(slide, text, { x: 0.6, y: 0.35, w: 12.13, h: 0.9, fontSize: 32, bold: true, color: o.color || NAVY, valign: 'middle' });
}
function footer(slide, n, dark = false) {
  T(slide, 'ניהול קריירה בארגונים | הקריה האקדמית אונו', { x: 6.5, y: 7.05, w: 6.23, h: 0.3, fontSize: 10, color: dark ? 'A9B4C8' : GRAY, valign: 'middle' });
  T(slide, String(n), { x: 0.6, y: 7.05, w: 1, h: 0.3, fontSize: 10, color: dark ? 'A9B4C8' : GRAY, align: 'left', valign: 'middle' });
}
function card(slide, x, y, w, h, fill = CARD) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.12, shadow: { type: 'outer', blur: 4, offset: 2, angle: 90, color: '000000', opacity: 0.12 } });
}
function circleNum(slide, x, y, txt, fill = AMBER, color = NAVY, d = 0.55, fs = 18) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  slide.addText(txt, { x, y, w: d, h: d, fontFace: F, fontSize: fs, bold: true, color, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
}
const bullets = (items, o = {}) => items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: o.gap ?? 6, ...o } }));
const NOTE = (slide, txt) => slide.addNotes(txt);
let n = 0;

// ================= 1. Title =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: NAVY };
  s.addShape(pres.shapes.OVAL, { x: -1.5, y: 4.6, w: 5.5, h: 5.5, fill: { color: '1D2E52' }, line: { color: '1D2E52' } });
  s.addShape(pres.shapes.OVAL, { x: 11.4, y: -2.1, w: 3.6, h: 3.6, fill: { color: AMBER }, line: { color: AMBER } });
  T(s, 'עבודה מסכמת בקורס ניהול קריירה בארגונים', { x: 0.8, y: 1.2, w: 9.8, h: 0.5, fontSize: 18, color: 'CAD3E5' });
  T(s, 'התמודדות עם חוסר ודאות תעסוקתי', { x: 0.8, y: 1.8, w: 11.7, h: 1.3, fontSize: 48, bold: true, color: WHITE, valign: 'middle' });
  T(s, 'איך מנהלים קריירה כשהוודאות היחידה היא חוסר הוודאות?', { x: 0.8, y: 3.1, w: 11.7, h: 0.6, fontSize: 22, color: AMBER, italic: true });
  s.addText('Shoss, M. K. (2017). Job insecurity: An integrative review and agenda for future research. Journal of Management, 43(6), 1911–1939.', { x: 0.8, y: 3.85, w: 11.7, h: 0.7, fontFace: F, fontSize: 13, color: 'CAD3E5', align: 'right', valign: 'top', margin: 0, isTextBox: true });
  card(s, 0.8, 4.8, 6.2, 1.75, '1D2E52');
  T(s, 'מגישים/ות', { x: 1.0, y: 4.9, w: 5.8, h: 0.4, fontSize: 14, bold: true, color: AMBER });
  T(s, [
    { text: '[שם מלא]  |  ת.ז. [_________]', options: { breakLine: true } },
    { text: '[שם מלא]  |  ת.ז. [_________]', options: { breakLine: true } },
    { text: '[שם מלא]  |  ת.ז. [_________]  (אם בשלשה)', options: {} },
  ], { x: 1.0, y: 5.3, w: 5.8, h: 1.2, fontSize: 15, color: WHITE, paraSpaceAfter: 4 });
  T(s, [
    { text: 'מרצה: גב\' מורן דבדבני דקל', options: { breakLine: true } },
    { text: 'עוזר הוראה: מר פאר רועי', options: { breakLine: true } },
    { text: 'הפקולטה למנהל עסקים | תשפ"ו, סמסטר 3', options: {} },
  ], { x: 7.3, y: 4.9, w: 5.2, h: 1.6, fontSize: 15, color: 'CAD3E5', paraSpaceAfter: 4 });
  NOTE(s, 'פתיחה (30 שניות): שלום לכולם, אנחנו [שמות]. הנושא שלנו הוא התמודדות עם חוסר ודאות תעסוקתי – נושא שנוגע כמעט לכל אחד בחדר, בין אם בגלל הבינה המלאכותית, המצב בהייטק, המילואים או פשוט ההתחלה של הקריירה.');
}

// ================= 2. Agenda =================
{
  const s = pres.addSlide(); n++;
  title(s, 'מה נעשה ב-10 הדקות הקרובות?');
  const items = [
    ['סקר פתיחה', 'כמה בטוחים אתם בעצם?', '1 דק\''],
    ['למה עכשיו', 'בינה מלאכותית, הייטק, מילואים', '1.5 דק\''],
    ['המאמר', 'הגדרה, 4 מנגנונים, משתנים ממתנים', '2.5 דק\''],
    ['ראיות ותובנות', 'מטא-אנליזה ודעה אישית', '1 דק\''],
    ['סרטון + הפעלה', 'TED וכרטיסי תרחיש', '3 דק\''],
    ['סיכום', 'המסר שלנו לכיתה', '1 דק\''],
  ];
  const cw = 3.85, ch = 2.3, gx = 0.29, x0 = 0.6, y0 = 1.55;
  items.forEach(([h, d, t], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = W - x0 - cw - col * (cw + gx), y = y0 + row * (ch + 0.3);
    card(s, x, y, cw, ch);
    circleNum(s, x + cw - 0.85, y + 0.3, String(i + 1));
    T(s, h, { x: x + 0.3, y: y + 0.3, w: cw - 1.3, h: 0.55, fontSize: 20, bold: true, color: NAVY, valign: 'middle' });
    T(s, d, { x: x + 0.3, y: y + 1.0, w: cw - 0.6, h: 0.7, fontSize: 15, color: INK });
    T(s, t, { x: x + 0.3, y: y + 1.75, w: cw - 0.6, h: 0.4, fontSize: 13, color: TEAL, bold: true });
  });
  footer(s, n);
  NOTE(s, 'מעבר מהיר על המבנה. להדגיש שיש סרטון והפעלה – כדי שהכיתה תישאר ערנית.');
}

// ================= 3. Poll =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: LIGHT };
  title(s, 'סקר פתיחה');
  T(s, 'בסולם 1–5: עד כמה אתם בטוחים שתהיו באותו תפקיד (או באותו מסלול) בעוד שנתיים?', { x: 0.6, y: 1.5, w: 12.13, h: 1.1, fontSize: 26, bold: true, color: NAVY, valign: 'middle' });
  const labels = ['בכלל לא בטוח/ה', 'לא כל כך', 'ככה-ככה', 'די בטוח/ה', 'בטוח/ה מאוד'];
  const cols = ['E76F51', 'F4A261', 'E9C46A', '8AB17D', '2A9D8F'];
  const d = 1.5, gap = 0.6, total = 5 * d + 4 * gap, sx = (W - total) / 2;
  labels.forEach((l, i) => {
    const x = W - sx - d - i * (d + gap); // RTL: 1 on the right
    s.addShape(pres.shapes.OVAL, { x, y: 3.0, w: d, h: d, fill: { color: cols[i] }, line: { color: cols[i] } });
    s.addText(String(i + 1), { x, y: 3.0, w: d, h: d, fontFace: F, fontSize: 40, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    T(s, l, { x: x - 0.3, y: 4.65, w: d + 0.6, h: 0.6, fontSize: 14, align: 'center', color: INK });
  });
  card(s, 0.6, 5.6, 12.13, 1.2, WHITE);
  T(s, 'הצבעה ב-Mentimeter / הרמת ידיים. התוצאות יוצגו על המסך – ונחזור אליהן בסוף.', { x: 0.9, y: 5.75, w: 11.5, h: 0.9, fontSize: 17, color: INK, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'להריץ סקר מנטימטר (או הרמת ידיים). לצלם מסך של התוצאות. לומר: "שימו לב לפיזור – זה בדיוק מה שהמאמר מסביר: אותו שוק, אותה כיתה, תחושות שונות לגמרי".');
}

// ================= 4. Why now =================
{
  const s = pres.addSlide(); n++;
  title(s, 'למה דווקא עכשיו?');
  // right: stat + chart
  card(s, 7.1, 1.45, 5.63, 5.4);
  T(s, '1 מכל 5', { x: 7.3, y: 1.6, w: 5.2, h: 1.0, fontSize: 60, bold: true, color: RED, align: 'center', valign: 'middle' });
  T(s, 'מהמועסקים בישראל עובדים במקצועות "תחליפיים" שבהם הביקוש צפוי לרדת משמעותית עם התרחבות הבינה המלאכותית (בנק ישראל, 2025)', { x: 7.4, y: 2.65, w: 5.0, h: 1.1, fontSize: 14, color: INK, align: 'center' });
  s.addChart(pres.charts.DOUGHNUT, [{ name: 'מועסקים', labels: ['מקצועות תחליפיים', 'שאר המקצועות'], values: [20, 80] }], {
    x: 7.6, y: 3.8, w: 4.6, h: 2.95, holeSize: 55, chartColors: [RED, 'CBD5E1'], showLegend: true, legendPos: 'b', legendFontFace: F, legendFontSize: 12,
    showPercent: true, showValue: false, dataLabelFontFace: F, dataLabelFontSize: 12, dataLabelColor: WHITE, showTitle: false,
  });
  // left: drivers
  const drivers = [
    ['בינה מלאכותית', 'משנה את תוכן התפקיד גם כשהמשרה נשמרת – "איום איכותני"'],
    ['התייעלות בהייטק', 'גלי פיטורים ו"התייעלות AI" בראש סדר היום של מנהלים ב-2026 (TheMarker, 21.6.2026)'],
    ['מילואים ומלחמה', 'חוסר ודאות שמקורו מחוץ לארגון – ממד ישראלי ייחודי'],
    ['צורות העסקה חדשות', 'פרילנס, חוזים זמניים, גיג – חוסר ביטחון הופך ממצב חריג למצב כרוני'],
  ];
  drivers.forEach(([h, d], i) => {
    const y = 1.45 + i * 1.37;
    card(s, 0.6, y, 6.2, 1.2, WHITE);
    circleNum(s, 6.0, y + 0.3, ['🤖', '📉', '🎖️', '🧩'][i], AMBER, NAVY, 0.6, 18);
    T(s, h, { x: 0.8, y: y + 0.12, w: 5.0, h: 0.45, fontSize: 17, bold: true, color: NAVY });
    T(s, d, { x: 0.8, y: y + 0.55, w: 5.0, h: 0.6, fontSize: 12.5, color: INK });
  });
  footer(s, n);
  NOTE(s, 'כתבת עיתון: להציג את הכותרת של TheMarker (21.6.2026) – "הקשיים של מנהלי הייטק ב-2026: גיוס עובדים מתאימים – והתייעלות AI". נתון בנק ישראל: כחמישית מהמועסקים במקצועות תחליפיים. המסר: חוסר ביטחון הוא לא רק "האם אפוטר" אלא "האם התפקיד שלי ישתנה".');
}

// ================= 5. The article =================
{
  const s = pres.addSlide(); n++;
  title(s, 'המאמר שבחרנו');
  card(s, 5.3, 1.45, 7.43, 3.3, NAVY);
  s.addText('Job Insecurity: An Integrative Review and Agenda for Future Research', { x: 5.55, y: 1.6, w: 6.95, h: 0.95, fontFace: F, fontSize: 20, bold: true, color: WHITE, align: 'right', valign: 'middle', margin: 0, isTextBox: true });
  s.addText('Mindy K. Shoss  |  Journal of Management, 43(6), 1911–1939  |  2017', { x: 5.55, y: 2.6, w: 6.95, h: 0.4, fontFace: F, fontSize: 13, color: AMBER, align: 'right', margin: 0, isTextBox: true });
  T(s, bullets([
    'סקירה אינטגרטיבית – מסנתזת עשרות שנות מחקר מניהול, פסיכולוגיה, סוציולוגיה וכלכלה',
    'כתב עת שפיט מהמובילים בעולם בתחום הניהול; המאמר מצוטט מאות פעמים',
    'מטרה: הגדרה ברורה + מסגרת מושגית אחת + אג\'נדה למחקר',
  ]), { x: 5.55, y: 3.05, w: 6.95, h: 1.6, fontSize: 13.5, color: 'E5EAF3' });
  // left: why we chose it
  card(s, 0.6, 1.45, 4.4, 3.3);
  T(s, 'למה בחרנו בו?', { x: 0.85, y: 1.6, w: 3.9, h: 0.5, fontSize: 18, bold: true, color: NAVY });
  T(s, bullets(['עונה על השאלה "למה אנשים שונים מגיבים אחרת לאותו איום"', 'נותן שפה משותפת – מהתחושה האמורפית לרכיבים שאפשר לעבוד איתם', 'מתחבר ל"שלושת סלי הכלים" ול"ממשבר להזדמנות" מהקורס']), { x: 0.85, y: 2.15, w: 3.9, h: 2.5, fontSize: 13.5 });
  // bottom: supporting
  card(s, 0.6, 5.0, 12.13, 1.85, LIGHT);
  T(s, 'מאמר משלים וראיות תומכות', { x: 0.85, y: 5.1, w: 11.6, h: 0.45, fontSize: 16, bold: true, color: TEAL });
  s.addText([
    { text: 'Lee, C., Huang, G.-H., & Ashford, S. J. (2018). Job insecurity and the changing workplace. Annual Review of Organizational Psychology and Organizational Behavior, 5, 335–359.', options: { breakLine: true } },
    { text: 'Jiang, L., & Lavaysse, L. M. (2018). Cognitive and affective job insecurity: A meta-analysis and a primary study. Journal of Management, 44(6), 2307–2342.', options: {} },
  ], { x: 0.85, y: 5.55, w: 11.6, h: 1.2, fontFace: F, fontSize: 12.5, color: INK, align: 'right', valign: 'top', margin: 0, isTextBox: true, paraSpaceAfter: 6 });
  footer(s, n);
  NOTE(s, 'להציג את המאמר במשפט: זו לא סקירה של מחקר אחד אלא "מפה" של כל התחום. מינדי שוס היא חוקרת בפסיכולוגיה ארגונית מאוניברסיטת סנטרל פלורידה. בהגשה בשלשה – להרחיב על המאמר של לי, הואנג ואשפורד: סקירה גלובלית ובין-תרבותית, מדגישה את עולם העבודה המשתנה.');
}

// ================= 6. Definition + 2x2 =================
{
  const s = pres.addSlide(); n++;
  title(s, 'מה זה בכלל חוסר ביטחון תעסוקתי?');
  card(s, 0.6, 1.4, 12.13, 1.25, NAVY);
  T(s, '"איום נתפס על ההמשכיות והיציבות של התעסוקה כפי שהיא נחווית כיום"', { x: 0.9, y: 1.5, w: 11.5, h: 0.6, fontSize: 22, bold: true, color: WHITE, valign: 'middle' });
  s.addText('“a perceived threat to the continuity and stability of employment as it is currently experienced” (Shoss, 2017)', { x: 0.9, y: 2.1, w: 11.5, h: 0.45, fontFace: F, fontSize: 13, italic: true, color: AMBER, align: 'right', margin: 0, isTextBox: true });
  // key components (right column)
  const comps = [['תפיסה', 'סובייקטיבי – שני עובדים, אותו חוזה, תחושה שונה'], ['איום', 'מכוון לעתיד – זה "לפני", לא אחרי'], ['המשכיות ויציבות', 'המשרה עצמה – או מאפייניה'], ['כפי שנחווית כיום', 'המשרה הנוכחית, לא חרדה כללית']];
  comps.forEach(([h, d], i) => {
    const y = 2.9 + i * 1.0;
    circleNum(s, 12.15, y + 0.15, String(i + 1), AMBER, NAVY, 0.5, 15);
    T(s, h, { x: 7.6, y: y + 0.05, w: 4.4, h: 0.4, fontSize: 16, bold: true, color: NAVY });
    T(s, d, { x: 7.6, y: y + 0.45, w: 4.4, h: 0.5, fontSize: 12.5, color: INK });
  });
  // 2x2 matrix (left)
  T(s, 'מוקדי האיום (Threat Foci)', { x: 0.6, y: 2.85, w: 6.4, h: 0.4, fontSize: 15, bold: true, color: TEAL });
  const mx = 0.6, my = 3.3, cw = 2.55, ch = 1.45;
  T(s, 'קוגניטיבי – "עד כמה זה סביר?"', { x: mx + 0.9 + cw + 0.1, y: my, w: cw, h: 0.4, fontSize: 11.5, bold: true, color: GRAY, align: 'center' });
  T(s, 'רגשי – "עד כמה זה מדאיג?"', { x: mx + 0.9, y: my, w: cw, h: 0.4, fontSize: 11.5, bold: true, color: GRAY, align: 'center' });
  T(s, 'כמותי – אובדן המשרה', { x: mx, y: my + 0.45, w: 0.85, h: ch, fontSize: 11.5, bold: true, color: GRAY, valign: 'middle', align: 'center' });
  T(s, 'איכותני – אובדן מאפיינים', { x: mx, y: my + 0.45 + ch + 0.1, w: 0.85, h: ch, fontSize: 11.5, bold: true, color: GRAY, valign: 'middle', align: 'center' });
  const cells = [
    ['"יש סיכוי שיפטרו אותי"', mx + 0.9 + cw + 0.1, my + 0.45, 'FDE2DC'],
    ['"אני דואג/ת ולא ישן/ה בלילה"', mx + 0.9, my + 0.45, 'F9C9BF'],
    ['"התפקיד יישאר אבל ה-AI ישנה אותו"', mx + 0.9 + cw + 0.1, my + 0.45 + ch + 0.1, 'FFF1D6'],
    ['"אני חושש/ת שאאבד את מה שאני אוהב/ת בעבודה"', mx + 0.9, my + 0.45 + ch + 0.1, 'FFE4B3'],
  ];
  cells.forEach(([t, x, y, f]) => {
    card(s, x, y, cw, ch, f);
    T(s, t, { x: x + 0.15, y: y + 0.1, w: cw - 0.3, h: ch - 0.2, fontSize: 13, color: INK, align: 'center', valign: 'middle' });
  });
  footer(s, n);
  NOTE(s, 'ההגדרה בארבעה רכיבים: תפיסה, איום, המשכיות/יציבות, המשרה הנוכחית. הטבלה: כמותי לעומת איכותני, קוגניטיבי לעומת רגשי. להדגיש: בעידן ה-AI האיום האיכותני חשוב לא פחות.');
}

// ================= 7. Model diagram =================
{
  const s = pres.addSlide(); n++;
  title(s, 'המודל של Shoss (2017): מאיפה זה מגיע ולאן זה מוביל');
  // antecedents (right)
  const ax = 9.3, aw = 3.43;
  T(s, 'הגורמים', { x: ax, y: 1.4, w: aw, h: 0.4, fontSize: 15, bold: true, color: TEAL, align: 'center' });
  [['מאקרו', 'מיתון, טכנולוגיה, מלחמה'], ['ארגוני', 'צמצומים, מיזוגים, חוזים זמניים, תקשורת לקויה'], ['אישי', 'אישיות, ותק, השכלה, יכולת תעסוקה']].forEach(([h, d], i) => {
    const y = 1.85 + i * 1.25;
    card(s, ax, y, aw, 1.1, CARD);
    T(s, h, { x: ax + 0.15, y: y + 0.08, w: aw - 0.3, h: 0.4, fontSize: 15, bold: true, color: NAVY });
    T(s, d, { x: ax + 0.15, y: y + 0.48, w: aw - 0.3, h: 0.55, fontSize: 11.5, color: INK });
  });
  // arrow right->center
  s.addShape(pres.shapes.LEFT_ARROW, { x: 8.35, y: 3.2, w: 0.85, h: 0.6, fill: { color: AMBER }, line: { color: AMBER } });
  // center circle
  s.addShape(pres.shapes.OVAL, { x: 5.55, y: 2.35, w: 2.7, h: 2.3, fill: { color: NAVY }, line: { color: NAVY } });
  T(s, 'חוסר ביטחון תעסוקתי', { x: 5.65, y: 2.55, w: 2.5, h: 1.0, fontSize: 18, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  T(s, 'כמותי / איכותני\nקוגניטיבי / רגשי', { x: 5.65, y: 3.5, w: 2.5, h: 0.9, fontSize: 11, color: AMBER, align: 'center', valign: 'middle' });
  // arrow center->left
  s.addShape(pres.shapes.LEFT_ARROW, { x: 4.6, y: 3.2, w: 0.85, h: 0.6, fill: { color: AMBER }, line: { color: AMBER } });
  // mechanisms (left)
  const mx = 0.6, mw = 3.9;
  T(s, '4 מנגנונים → תוצאות', { x: mx, y: 1.4, w: mw, h: 0.4, fontSize: 15, bold: true, color: TEAL, align: 'center' });
  [['לחץ', 'שחיקה, בריאות, משפחה', RED], ['חליפין חברתי', 'ירידה במחויבות ובאמון', RED], ['שימור המשרה', '"להתכופף" – מאמץ ושתיקה', AMBER], ['התמודדות פרואקטיבית', 'למידה, נטוורקינג, תוכנית ב\'', TEAL]].forEach(([h, d, c], i) => {
    const y = 1.85 + i * 0.95;
    card(s, mx, y, mw, 0.82, CARD);
    s.addShape(pres.shapes.OVAL, { x: mx + mw - 0.5, y: y + 0.21, w: 0.4, h: 0.4, fill: { color: c }, line: { color: c } });
    T(s, h, { x: mx + 0.15, y: y + 0.06, w: mw - 0.75, h: 0.38, fontSize: 14, bold: true, color: NAVY });
    T(s, d, { x: mx + 0.15, y: y + 0.42, w: mw - 0.75, h: 0.36, fontSize: 11, color: INK });
  });
  // moderators bar
  card(s, 0.6, 5.75, 12.13, 1.1, 'FFF4DE');
  T(s, 'משתנים ממתנים – מה קובע את עוצמת התגובה?', { x: 0.9, y: 5.8, w: 11.5, h: 0.4, fontSize: 14, bold: true, color: NAVY });
  T(s, 'מאפייני האיום (הסתברות, חומרה, שליטה)   •   פגיעוּת כלכלית (כרית, תלות, יכולת תעסוקה)   •   פגיעוּת פסיכולוגית (מסוגלות, תמיכה, זהות)', { x: 0.9, y: 6.2, w: 11.5, h: 0.55, fontSize: 13, color: INK });
  footer(s, n);
  NOTE(s, 'לקרוא את התרשים מימין לשמאל: גורמים בשלוש רמות יוצרים תחושת חוסר ביטחון; היא מובילה לתוצאות דרך ארבעה מנגנונים; והפס הצהוב למטה – המשתנים הממתנים – מסביר למה אצל אחד זה משתק ואצל אחר זה מניע.');
}

// ================= 8. Four mechanisms =================
{
  const s = pres.addSlide(); n++;
  title(s, 'ארבעת המנגנונים: למה אותו עובד גם "מתכופף" וגם שולח קורות חיים?');
  const mechs = [
    ['לחץ', 'Stress', 'האיום הצפוי מדלדל משאבים (הכנסה, מעמד, זהות) עוד לפני שמשהו קרה → מתח, שחיקה, בעיות שינה, השלכות על המשפחה', RED],
    ['חליפין חברתי', 'Social Exchange', '"אני נותן נאמנות, הארגון אמור לתת ביטחון" – הפרת החוזה הפסיכולוגי → פחות מחויבות, אמון ועזרה לעמיתים', RED],
    ['שימור המשרה', 'Job Preservation', 'עובדים קשה יותר, שותקים, מגיעים חולים, מנהלים רושם – המשרה נשמרת בטווח הקצר, במחיר בריאותי', AMBER],
    ['התמודדות פרואקטיבית', 'Proactive Coping', 'חיפוש עבודה, למידה, רשת קשרים, תוכנית ב\' – המנגנון הבריא, אבל דורש משאבים שהלחץ מדלדל', TEAL],
  ];
  const cw = 2.9, gx = 0.18, x0 = 0.6, y = 1.5, ch = 4.2;
  mechs.forEach(([h, e, d, c], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, WHITE);
    s.addShape(pres.shapes.OVAL, { x: x + cw / 2 - 0.4, y: y + 0.3, w: 0.8, h: 0.8, fill: { color: c }, line: { color: c } });
    s.addText(String(i + 1), { x: x + cw / 2 - 0.4, y: y + 0.3, w: 0.8, h: 0.8, fontFace: F, fontSize: 26, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    T(s, h, { x: x + 0.15, y: y + 1.25, w: cw - 0.3, h: 0.5, fontSize: 15, bold: true, color: NAVY, align: 'center', valign: 'middle' });
    s.addText(e, { x: x + 0.2, y: y + 1.78, w: cw - 0.4, h: 0.35, fontFace: F, fontSize: 12, italic: true, color: GRAY, align: 'center', margin: 0, isTextBox: true });
    T(s, d, { x: x + 0.2, y: y + 2.2, w: cw - 0.4, h: 1.9, fontSize: 12.5, color: INK });
  });
  card(s, 0.6, 5.95, 12.13, 0.9, 'FFF4DE');
  T(s, 'המתח המובנה: הלחץ (1) גוזל בדיוק את המשאבים שהפרואקטיביות (4) צריכה. לכן המטרה בניהול קריירה: לבנות מראש את המשאבים שיאפשרו לבחור ב-4.', { x: 0.9, y: 6.0, w: 11.5, h: 0.8, fontSize: 14, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'דוגמה מהחיים: בזמן צמצומים, עמית עובד עד מאוחר, לא מתלונן – ובמקביל מראיין בחברות אחרות. זה לא סתירה, זה שני מנגנונים שפועלים במקביל. למנהלים: מאמץ מוגבר בתקופת אי-ודאות הוא לא בהכרח מחויבות – לפעמים זה פחד.');
}

// ================= 9. Moderators =================
{
  const s = pres.addSlide(); n++;
  title(s, 'למה לא כולם מגיבים אותו דבר? שלושת המשתנים הממתנים');
  const mods = [
    ['מאפייני האיום', 'Threat Features', ['הסתברות – כמה זה באמת סביר?', 'חומרה – מה אאבד?', 'מיידיות ומשך – מתי, ולכמה זמן?', 'שליטה – מה תלוי בי?'], 'E76F51'],
    ['פגיעוּת כלכלית', 'Economic Vulnerabilities', ['תלות בהכנסה מהמשרה', 'חובות והתחייבויות משפחתיות', 'יכולת תעסוקה (Employability)', 'מצב שוק העבודה ורשת ביטחון'], 'F4A261'],
    ['פגיעוּת פסיכולוגית', 'Psychological Vulnerabilities', ['מסוגלות עצמית וסגנון התמודדות', 'עד כמה הזהות שלי = התפקיד', 'עוגן קריירה של ביטחון (Schein)', 'תמיכה חברתית ומשפחתית'], '2A9D8F'],
  ];
  const cw = 3.9, gx = 0.215, x0 = 0.6, y = 1.5, ch = 4.25;
  mods.forEach(([h, e, items, c], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, WHITE);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 0.25, w: cw - 0.5, h: 0.95, fill: { color: c }, line: { color: c }, rectRadius: 0.1 });
    T(s, h, { x: x + 0.35, y: y + 0.28, w: cw - 0.7, h: 0.5, fontSize: 18, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    s.addText(e, { x: x + 0.35, y: y + 0.75, w: cw - 0.7, h: 0.4, fontFace: F, fontSize: 11.5, italic: true, color: WHITE, align: 'center', margin: 0, isTextBox: true });
    T(s, bullets(items, { gap: 8 }), { x: x + 0.3, y: y + 1.45, w: cw - 0.6, h: 2.7, fontSize: 13.5, color: INK });
  });
  card(s, 0.6, 5.95, 12.13, 0.9, LIGHT);
  T(s, 'החדשות הטובות: רוב המשתנים האלה ניתנים לפיתוח מראש. זה הגשר בין המאמר לבין ניהול קריירה.', { x: 0.9, y: 6.0, w: 11.5, h: 0.8, fontSize: 15, bold: true, color: TEAL, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'כאן נמצאת הבשורה של המאמר לניהול קריירה: על מאפייני האיום השליטה שלנו מוגבלת, אבל על שתי הפגיעויות – כלכלית ופסיכולוגית – אפשר לעבוד כבר עכשיו, בתור סטודנטים.');
}

// ================= 10. Evidence =================
{
  const s = pres.addSlide(); n++;
  title(s, 'מה אומרים המספרים? (Jiang & Lavaysse, 2018)');
  const stats = [['535', 'מדגמים בלתי תלויים במטא-אנליזה'], ['51 / 56', 'תוצאות שנמצאו קשורות באופן מובהק לחוסר ביטחון תעסוקתי'], ['רגש > מחשבה', 'הרכיב הרגשי (דאגה) קשור חזק יותר לתוצאות מהרכיב הקוגניטיבי – ומתווך אותו']];
  const cw = 3.9, gx = 0.215, x0 = 0.6, y = 1.5, ch = 2.6;
  stats.forEach(([b, d], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, i === 2 ? NAVY : WHITE);
    T(s, b, { x: x + 0.2, y: y + 0.25, w: cw - 0.4, h: 1.1, fontSize: i === 2 ? 34 : 48, bold: true, color: i === 2 ? AMBER : RED, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.3, y: y + 1.4, w: cw - 0.6, h: 1.1, fontSize: 14, color: i === 2 ? WHITE : INK, align: 'center' });
  });
  card(s, 0.6, 4.35, 12.13, 2.5, LIGHT);
  T(s, 'המשמעות לניהול קריירה', { x: 0.9, y: 4.45, w: 11.5, h: 0.45, fontSize: 17, bold: true, color: TEAL });
  T(s, bullets([
    'לא המחשבה "ייתכן שאפוטר" פוגעת – אלא הדאגה שהיא מעוררת. שם נמצא המנוף: ויסות רגשי, תמיכה ומסגור מחדש.',
    'המאמר המשלים של לי, הואנג ואשפורד (2018) מוסיף: העוצמה משתנה בין תרבויות ומדינות, ובעולם העבודה החדש חוסר ביטחון הוא מצב כרוני, לא אירוע.',
    'מסקנה: "לא לפחד" זו לא עצה. "לבנות כרית שתאפשר לפעול" – כן.',
  ], { gap: 6 }), { x: 0.9, y: 4.95, w: 11.5, h: 1.85, fontSize: 14, color: INK });
  footer(s, n);
  NOTE(s, 'מטא-אנליזה = מחקר שמאחד סטטיסטית מאות מחקרים. 535 מדגמים, 51 מתוך 56 תוצאות. הממצא החשוב לנו: הרגש מתווך – ולכן עבודה על הדאגה חשובה לא פחות מעבודה על המצב.');
}

// ================= 11. Insights & opinion =================
{
  const s = pres.addSlide(); n++;
  title(s, 'תובנות, ביקורת ודעה אישית');
  card(s, 6.85, 1.45, 5.88, 3.2, 'E8F5F1');
  T(s, '👍 מה אהבנו', { x: 7.1, y: 1.55, w: 5.4, h: 0.5, fontSize: 18, bold: true, color: TEAL });
  T(s, bullets(['בהירות: מתחושה אמורפית לרכיבים שאפשר לעבוד איתם', 'ארבעת המנגנונים הסבירו לנו התנהגויות שראינו בבית ובעבודה', '"רשימת מכולת" של דברים שאפשר לעשות כבר כסטודנטים'], { gap: 6 }), { x: 7.1, y: 2.1, w: 5.4, h: 2.4, fontSize: 13.5 });
  card(s, 0.6, 1.45, 5.88, 3.2, 'FDECEA');
  T(s, '🤔 מה חסר לנו', { x: 0.85, y: 1.55, w: 5.4, h: 0.5, fontSize: 18, bold: true, color: RED });
  T(s, bullets(['תיאורטי – בלי "מה עושים עם זה" (בנינו לבד)', 'נכתב לפני הקורונה ולפני הבינה המלאכותית היוצרת', 'לא מתייחס לאיום שמקורו מחוץ לארגון – מילואים, מלחמה', 'נשען בעיקר על מחקרים מערביים'], { gap: 6 }), { x: 0.85, y: 2.1, w: 5.4, h: 2.4, fontSize: 13.5 });
  card(s, 0.6, 4.9, 12.13, 1.95, NAVY);
  T(s, 'העמדה שלנו', { x: 0.9, y: 5.0, w: 11.5, h: 0.45, fontSize: 17, bold: true, color: AMBER });
  T(s, 'המאמר צודק שחוסר ביטחון הוא בעיקר גורם לחץ מזיק. אבל לאור "ממשבר להזדמנות" והתרבות הישראלית של אלתור, אנחנו מאמינים שמידה של חוסר ודאות יכולה להיות מנוע לצמיחה – בתנאי שיש משאבים. בלי משאבים חוסר ודאות משתק; עם משאבים הוא מניע.', { x: 0.9, y: 5.45, w: 11.5, h: 1.35, fontSize: 14.5, color: WHITE });
  footer(s, n);
  NOTE(s, 'להגיד את הביקורת בקול: המאמר לא מכיר את המציאות הישראלית של 2026. ועם זאת, המסגרת שלו מחזיקה מעמד מצוין – זו בדיוק הסיבה שהשתמשנו בה כדי לבנות כלי.');
}

// ================= 12. Video =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: NAVY };
  title(s, 'סרטון: "3 הסודות של אנשים חסינים" – Lucy Hone, TED', { color: WHITE });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.9, y: 1.6, w: 5.83, h: 3.3, fill: { color: '0B1530' }, line: { color: '0B1530' }, rectRadius: 0.12 });
  s.addShape(pres.shapes.OVAL, { x: 9.2, y: 2.6, w: 1.25, h: 1.25, fill: { color: AMBER }, line: { color: AMBER } });
  s.addText('▶', { x: 9.2, y: 2.6, w: 1.25, h: 1.25, fontFace: F, fontSize: 30, bold: true, color: NAVY, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  s.addText('ted.com/talks/lucy_hone_the_three_secrets_of_resilient_people', { x: 7.1, y: 4.35, w: 5.4, h: 0.4, fontFace: F, fontSize: 11, color: 'CAD3E5', align: 'center', margin: 0, isTextBox: true, hyperlink: { url: 'https://www.ted.com/talks/lucy_hone_the_three_secrets_of_resilient_people' } });
  T(s, 'מה לחפש בקטע (90 שניות):', { x: 0.8, y: 1.6, w: 5.7, h: 0.5, fontSize: 18, bold: true, color: AMBER });
  T(s, bullets(['"דברים רעים קורים" – קבלת חוסר הוודאות כחלק מהחיים (מאפייני האיום)', 'לבחור במה להתמקד – מה בשליטתי (הערכה קוגניטיבית)', '"האם זה עוזר לי או פוגע בי?" – ויסות הרכיב הרגשי'], { gap: 8 }), { x: 0.8, y: 2.15, w: 5.7, h: 2.8, fontSize: 14.5, color: WHITE });
  card(s, 0.8, 5.25, 11.93, 1.5, '1D2E52');
  T(s, 'שאלה לכיתה אחרי הסרטון: איזה מהשלושה הכי קשה לכם ליישם בהקשר של הקריירה? (הרמת ידיים)', { x: 1.05, y: 5.35, w: 11.4, h: 1.3, fontSize: 16, color: WHITE, valign: 'middle' });
  footer(s, n, true);
  NOTE(s, 'להקרין כ-90 שניות (מומלץ מהדקה ~9:30, שבה הון מציגה את שלושת העקרונות; לבדוק את הטיים-קוד מראש). לחבר כל עיקרון לרכיב במודל: קבלת האיום, מיקוד בשליטה, ויסות רגשי. חלופה: Jon Youshaei & Michelle Weise – "How do you prepare for jobs that don\'t exist yet?" (TED).');
}

// ================= 13. Resilience map =================
{
  const s = pres.addSlide(); n++;
  title(s, 'יישום: "מפת החוסן התעסוקתי" – הכלי שבנינו מהמאמר');
  const hdr = { fontFace: F, fontSize: 14, bold: true, color: WHITE, fill: { color: NAVY }, align: 'right', valign: 'middle', rtlMode: true };
  const c = (t, extra = {}) => ({ text: t, options: { fontFace: F, fontSize: 12.5, color: INK, align: 'right', valign: 'middle', rtlMode: true, ...extra } });
  const rows = [
    [{ text: 'פעולות מומלצות', options: hdr }, { text: 'שאלות מנחות', options: hdr }, { text: 'שלב', options: hdr }],
    [c('להחליף שמועות במידע: שיחה עם המנהל, מעקב אחר החברה והענף; להבחין בין איום כמותי לאיכותני'), c('מה ההסתברות? מה החומרה? מתי? מה בשליטתי?'), c('1. הערכת האיום', { bold: true, color: RED })],
    [c('קרן חירום 3–6 חודשים; מקור הכנסה משלים; קו"ח ולינקדאין מעודכנים כל חצי שנה; מיומנויות AI'), c('כמה חודשים אחזיק מעמד? כמה קל למצוא עבודה דומה?'), c('2. הקטנת פגיעוּת כלכלית', { bold: true, color: 'D9822B' })],
    [c('זהות מקצועית שלא תלויה בארגון; רשת תמיכה ומנטור; מסגור מחדש ("זה לא מגדיר אותי"); שגרה וספורט'), c('עד כמה הזהות שלי = התפקיד? למי אפנה? איך אני מגיב/ה ללחץ?'), c('3. הקטנת פגיעוּת פסיכולוגית', { bold: true, color: TEAL })],
    [c('זמן שבועי קבוע ללמידה ולנטוורקינג; יעד למידה שנתי; תוכנית ב\' לפני שצריך אותה'), c('אני "מתכופף/ת" או פועל/ת?'), c('4. בחירת המנגנון: פרואקטיביות', { bold: true, color: NAVY })],
  ];
  s.addTable(rows, { x: 0.6, y: 1.45, w: 12.13, colW: [5.6, 3.6, 2.93], rowH: [0.5, 0.95, 0.95, 0.95, 0.95], border: { type: 'solid', color: 'D1D5DB', pt: 1 }, fill: { color: WHITE }, margin: 0.08 });
  card(s, 0.6, 6.05, 12.13, 0.8, 'FFF4DE');
  T(s, 'מתחבר ל"שלושת סלי הכלים" מהקורס: רשת אנשים = תמיכה, זהות מקצועית = פחות איום איכותני, למידה = יכולת תעסוקה', { x: 0.9, y: 6.1, w: 11.5, h: 0.7, fontSize: 13.5, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'זה הכלי שאנחנו משאירים לכיתה. כל שורה = משתנה ממתן מהמאמר שהפכנו לפעולה. השורה הרביעית היא הבחירה המודעת במנגנון הפרואקטיבי.');
}

// ================= 14. Activity =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: LIGHT };
  title(s, 'הפעלה (2 דקות בזוגות): קיבלתם תרחיש – מלאו את המפה');
  const sc = [
    ['תרחיש א', 'מייל מהמנכ"ל: "התייעלות של 15% ברבעון הקרוב". אין פרטים נוספים. מה תעשו השבוע?', RED],
    ['תרחיש ב', 'הארגון הודיע שמערכת AI תטפל ב-60% מהפניות. התפקיד נשאר – התוכן משתנה. איך תגיבו?', 'D9822B'],
    ['תרחיש ג', 'אתם עצמאיים. הלקוח הגדול (40% מההכנסה) מקפיא פרויקטים "עד שהמצב יתבהר". מה הצעד הראשון?', TEAL],
  ];
  const cw = 3.9, gx = 0.215, x0 = 0.6, y = 1.5, ch = 2.55;
  sc.forEach(([h, d, c], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, WHITE);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 0.25, w: 1.6, h: 0.5, fill: { color: c }, line: { color: c }, rectRadius: 0.1 });
    T(s, h, { x: x + 0.25, y: y + 0.25, w: 1.6, h: 0.5, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.25, y: y + 0.95, w: cw - 0.5, h: 1.5, fontSize: 13.5, color: INK });
  });
  card(s, 0.6, 4.3, 12.13, 2.55, NAVY);
  T(s, 'שלוש שאלות – 40 שניות לכל אחת:', { x: 0.9, y: 4.4, w: 11.5, h: 0.45, fontSize: 17, bold: true, color: AMBER });
  [['1', 'מה האיום בפועל – כמותי או איכותני? ומה בשליטתי?'], ['2', 'איזו פגיעוּת (כלכלית / פסיכולוגית) הכי מטרידה אותי?'], ['3', 'איזו פעולה פרואקטיבית אחת אעשה כבר השבוע?']].forEach(([k, t], i) => {
    const yy = 4.95 + i * 0.6;
    circleNum(s, 11.85, yy + 0.05, k, AMBER, NAVY, 0.45, 14);
    T(s, t, { x: 0.9, y: yy, w: 10.8, h: 0.55, fontSize: 15, color: WHITE, valign: 'middle' });
  });
  footer(s, n);
  NOTE(s, 'לחלק כרטיסים מודפסים (או להשאיר את השקופית). 2 דקות. אחר כך לשמוע 2–3 זוגות. לחבר את התשובות למודל: "שימו לב שרובכם קפצתם ישר לפעולה – זה המנגנון הפרואקטיבי. מי חשב קודם על הכרית הכלכלית?"');
}

// ================= 15. Summary =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: NAVY };
  s.addShape(pres.shapes.OVAL, { x: -1.8, y: -1.8, w: 4.5, h: 4.5, fill: { color: '1D2E52' }, line: { color: '1D2E52' } });
  T(s, 'המסר שלנו לכיתה', { x: 0.8, y: 0.6, w: 11.7, h: 0.7, fontSize: 20, color: 'CAD3E5' });
  T(s, 'את האיום לא תמיד אפשר למנוע.\nאת הכרית שתאפשר לנו לפעול – אפשר לבנות.', { x: 0.8, y: 1.3, w: 11.7, h: 1.9, fontSize: 34, bold: true, color: WHITE, valign: 'middle' });
  const tk = [['חוסר ביטחון = פרשנות', 'איום נתפס, רב-ממדי. מידע במקום שמועות, וגם האיום האיכותני נחשב'], ['4 מנגנונים, בחירה אחת', 'לחץ ושימור משרה שוחקים; פרואקטיביות דורשת משאבים – אז בונים אותם מראש'], ['הרגש הוא המנוף', 'הדאגה מתווכת את הנזק: תמיכה, מסגור מחדש וזהות שלא תלויה בתפקיד']];
  const cw = 3.75, gx = 0.22, x0 = 0.8, y = 3.55, ch = 2.55;
  tk.forEach(([h, d], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, '1D2E52');
    circleNum(s, x + cw - 0.85, y + 0.3, String(i + 1));
    T(s, h, { x: x + 0.25, y: y + 0.3, w: cw - 1.2, h: 0.55, fontSize: 17, bold: true, color: AMBER, valign: 'middle' });
    T(s, d, { x: x + 0.25, y: y + 1.0, w: cw - 0.5, h: 1.45, fontSize: 13.5, color: WHITE });
  });
  T(s, 'תודה! שאלות?', { x: 0.8, y: 6.35, w: 11.7, h: 0.6, fontSize: 22, bold: true, color: WHITE });
  footer(s, n, true);
  NOTE(s, 'לחזור לתוצאות הסקר מהפתיחה: "מי שסימן 1–2: המאמר אומר שזה לא גזירת גורל. מי שסימן 5: יופי, אבל האיום האיכותני קיים גם אצלכם". לסיים במסר ולפתוח לשאלות.');
}

// ================= 16. References =================
{
  const s = pres.addSlide(); n++;
  title(s, 'רשימת מקורות (APA)');
  const refs = [
    'Ashford, S. J., Lee, C., & Bobko, P. (1989). Content, causes, and consequences of job insecurity: A theory-based measure and substantive test. Academy of Management Journal, 32(4), 803–829.',
    'Hellgren, J., Sverke, M., & Isaksson, K. (1999). A two-dimensional approach to job insecurity: Consequences for employee attitudes and well-being. European Journal of Work and Organizational Psychology, 8(2), 179–195.',
    'Hobfoll, S. E. (1989). Conservation of resources: A new attempt at conceptualizing stress. American Psychologist, 44(3), 513–524.',
    'Hone, L. (2019). 3 secrets of resilient people [Video]. TED Conferences. https://www.ted.com/talks/lucy_hone_the_three_secrets_of_resilient_people',
    'Jiang, L., & Lavaysse, L. M. (2018). Cognitive and affective job insecurity: A meta-analysis and a primary study. Journal of Management, 44(6), 2307–2342. https://doi.org/10.1177/0149206318773853',
    'Lazarus, R. S., & Folkman, S. (1984). Stress, appraisal, and coping. Springer.',
    'Lee, C., Huang, G.-H., & Ashford, S. J. (2018). Job insecurity and the changing workplace: Recent developments and the future trends in job insecurity research. Annual Review of Organizational Psychology and Organizational Behavior, 5, 335–359. https://doi.org/10.1146/annurev-orgpsych-032117-104651',
    'Russo, M., Shteigman, A., & Carmeli, A. (2016). Workplace and family support and work–life balance: Implications for individual psychological availability and energy at work. The Journal of Positive Psychology, 11(2), 173–188.',
    'Schein, E. H. (1996). Career anchors revisited: Implications for career development in the 21st century. Academy of Management Executive, 10(4), 80–88.',
    'Shoss, M. K. (2017). Job insecurity: An integrative review and agenda for future research. Journal of Management, 43(6), 1911–1939. https://doi.org/10.1177/0149206317691574',
  ];
  s.addText(refs.map((r, i) => ({ text: r, options: { breakLine: i < refs.length - 1, paraSpaceAfter: 5 } })), { x: 0.6, y: 1.35, w: 12.13, h: 4.6, fontFace: F, fontSize: 10.5, color: INK, align: 'left', valign: 'top', margin: 0, isTextBox: true });
  T(s, [
    { text: 'בנק ישראל (2025). ההשפעה הצפויה של בינה מלאכותית יוצרת על העובדים: השלכות על המדיניות בשוק העבודה (תיבה מתוך דוח בנק ישראל לשנת 2024). https://www.boi.org.il/publications/pressreleases/11-3-25/', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'TheMarker (2026, 21 ביוני). הקשיים של מנהלי הייטק ב-2026: גיוס עובדים מתאימים – והתייעלות AI.', options: {} },
  ], { x: 0.6, y: 6.0, w: 12.13, h: 0.95, fontSize: 10.5, color: INK });
  footer(s, n);
}

const out = process.argv[2] || 'out.pptx';
pres.writeFile({ fileName: out }).then(f => console.log('wrote', f));

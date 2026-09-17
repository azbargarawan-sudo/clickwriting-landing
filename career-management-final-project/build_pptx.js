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
const E = (slide, text, o) => slide.addText(text, { fontFace: F, isTextBox: true, align: 'right', valign: 'top', margin: 0, color: INK, ...o });
function title(slide, text, o = {}) {
  T(slide, text, { x: 0.6, y: 0.35, w: 12.13, h: 0.9, fontSize: 30, bold: true, color: o.color || NAVY, valign: 'middle' });
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
  T(s, 'הלאה או למעלה? מה חוסר ביטחון תעסוקתי עושה לקריירה שלנו', { x: 0.8, y: 3.1, w: 11.7, h: 0.6, fontSize: 22, color: AMBER, italic: true });
  E(s, 'Låstad, L., Pienaar, J., Näswall, K., Richter, A., Hellgren, J., & Sverke, M. (2025). Moving on up now? A meta-analysis of the associations between job insecurity and career-related outcomes. Scandinavian Journal of Work and Organizational Psychology, 10(1), Article 2.', { x: 0.8, y: 3.8, w: 11.7, h: 0.8, fontSize: 12, color: 'CAD3E5' });
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
  NOTE(s, 'פתיחה (30 שניות): שלום לכולם, אנחנו [שמות]. הנושא שלנו הוא התמודדות עם חוסר ודאות תעסוקתי. השאלה שנשאל היום: כשאנחנו מפחדים לאבד את העבודה, זה עושה אותנו טובים יותר או גרוע יותר בניהול הקריירה שלנו? מטא-אנליזה של 237 מחקרים נותנת תשובה.');
}

// ================= 2. Agenda =================
{
  const s = pres.addSlide(); n++;
  title(s, 'מה נעשה ב-10 הדקות הקרובות?');
  const items = [
    ['סקר פתיחה', 'כמה בטוחים אתם בעצם?', '1 דק\''],
    ['למה עכשיו', 'בינה מלאכותית, הייטק, מילואים', '1.5 דק\''],
    ['המאמר', 'השאלה, השיטה, 8 התוצאות', '2.5 דק\''],
    ['מאמר משלים ותובנות', 'בינה מלאכותית וחוסן קריירה', '1 דק\''],
    ['סרטון + הפעלה', 'TED וכרטיסי תרחיש', '3 דק\''],
    ['סיכום', 'המסר שלנו לכיתה', '1 דק\''],
  ];
  const cw = 3.85, ch = 2.3, gx = 0.29, x0 = 0.6, y0 = 1.55;
  items.forEach(([h, d, t], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = W - x0 - cw - col * (cw + gx), y = y0 + row * (ch + 0.3);
    card(s, x, y, cw, ch);
    circleNum(s, x + cw - 0.85, y + 0.3, String(i + 1));
    T(s, h, { x: x + 0.3, y: y + 0.3, w: cw - 1.3, h: 0.55, fontSize: 18, bold: true, color: NAVY, valign: 'middle' });
    T(s, d, { x: x + 0.3, y: y + 1.0, w: cw - 0.6, h: 0.7, fontSize: 15, color: INK });
    T(s, t, { x: x + 0.3, y: y + 1.75, w: cw - 0.6, h: 0.4, fontSize: 13, color: TEAL, bold: true });
  });
  footer(s, n);
  NOTE(s, 'מעבר מהיר על המבנה. להדגיש שיש סרטון והפעלה.');
}

// ================= 3. Poll =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: LIGHT };
  title(s, 'סקר פתיחה');
  T(s, 'בסולם 1 עד 5: עד כמה אתם בטוחים שתהיו באותו תפקיד (או באותו מסלול) בעוד שנתיים?', { x: 0.6, y: 1.5, w: 12.13, h: 1.1, fontSize: 26, bold: true, color: NAVY, valign: 'middle' });
  const labels = ['בכלל לא בטוח/ה', 'לא כל כך', 'ככה-ככה', 'די בטוח/ה', 'בטוח/ה מאוד'];
  const cols = ['E76F51', 'F4A261', 'E9C46A', '8AB17D', '2A9D8F'];
  const d = 1.5, gap = 0.6, total = 5 * d + 4 * gap, sx = (W - total) / 2;
  labels.forEach((l, i) => {
    const x = W - sx - d - i * (d + gap);
    s.addShape(pres.shapes.OVAL, { x, y: 3.0, w: d, h: d, fill: { color: cols[i] }, line: { color: cols[i] } });
    s.addText(String(i + 1), { x, y: 3.0, w: d, h: d, fontFace: F, fontSize: 40, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    T(s, l, { x: x - 0.3, y: 4.65, w: d + 0.6, h: 0.6, fontSize: 14, align: 'center', color: INK });
  });
  card(s, 0.6, 5.6, 12.13, 1.2, WHITE);
  T(s, 'הצבעה ב-Mentimeter או הרמת ידיים. התוצאות יוצגו על המסך ונחזור אליהן בסוף.', { x: 0.9, y: 5.75, w: 11.5, h: 0.9, fontSize: 17, color: INK, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'להריץ סקר מנטימטר (או הרמת ידיים). לצלם מסך של התוצאות. לומר: "שימו לב לפיזור. אותו שוק, אותה כיתה, תחושות שונות לגמרי".');
}

// ================= 4. Why now =================
{
  const s = pres.addSlide(); n++;
  title(s, 'למה דווקא עכשיו?');
  card(s, 7.1, 1.45, 5.63, 5.4);
  T(s, '1 מכל 5', { x: 7.3, y: 1.6, w: 5.2, h: 1.0, fontSize: 60, bold: true, color: RED, align: 'center', valign: 'middle' });
  T(s, 'מהמועסקים בישראל עובדים במקצועות "תחליפיים" שבהם הביקוש צפוי לרדת משמעותית עם התרחבות הבינה המלאכותית (בנק ישראל, 2025)', { x: 7.4, y: 2.65, w: 5.0, h: 1.1, fontSize: 14, color: INK, align: 'center' });
  s.addChart(pres.charts.DOUGHNUT, [{ name: 'מועסקים', labels: ['מקצועות תחליפיים', 'שאר המקצועות'], values: [20, 80] }], {
    x: 7.6, y: 3.8, w: 4.6, h: 2.95, holeSize: 55, chartColors: [RED, 'CBD5E1'], showLegend: true, legendPos: 'b', legendFontFace: F, legendFontSize: 12,
    showPercent: true, showValue: false, dataLabelFontFace: F, dataLabelFontSize: 12, dataLabelColor: WHITE, showTitle: false,
  });
  const drivers = [
    ['בינה מלאכותית', 'משנה את תוכן התפקיד גם כשהמשרה נשמרת. עצם המודעות לה מייצרת חוסר ביטחון (Chung et al., 2025)'],
    ['התייעלות בהייטק', 'גלי פיטורים ו"התייעלות AI" בראש סדר היום של מנהלים ב-2026 ("הקשיים של מנהלי הייטק", 2026)'],
    ['מילואים ומלחמה', 'חוסר ודאות שמקורו מחוץ לארגון. ממד ישראלי ייחודי'],
    ['צורות העסקה חדשות', 'פרילנס, חוזים זמניים, גיג. חוסר ביטחון הופך ממצב חריג למצב כרוני'],
  ];
  drivers.forEach(([h, d], i) => {
    const y = 1.45 + i * 1.37;
    card(s, 0.6, y, 6.2, 1.2, WHITE);
    circleNum(s, 6.0, y + 0.3, ['🤖', '📉', '🎖️', '🧩'][i], AMBER, NAVY, 0.6, 18);
    T(s, h, { x: 0.8, y: y + 0.12, w: 5.0, h: 0.45, fontSize: 17, bold: true, color: NAVY });
    T(s, d, { x: 0.8, y: y + 0.55, w: 5.0, h: 0.6, fontSize: 12.5, color: INK });
  });
  footer(s, n);
  NOTE(s, 'כתבת עיתון: להציג את הכותרת של TheMarker (21.6.2026). נתון בנק ישראל: כחמישית מהמועסקים במקצועות תחליפיים. המסר: חוסר ביטחון הוא לא רק "האם אפוטר" אלא "האם התפקיד שלי ישתנה".');
}

// ================= 5. The article =================
{
  const s = pres.addSlide(); n++;
  title(s, 'המאמר שבחרנו');
  card(s, 5.3, 1.45, 7.43, 3.4, NAVY);
  E(s, 'Moving on Up Now? A Meta-Analysis of the Associations Between Job Insecurity and Career-Related Outcomes', { x: 5.55, y: 1.6, w: 6.95, h: 1.0, fontSize: 19, bold: true, color: WHITE, valign: 'middle' });
  E(s, 'Låstad, Pienaar, Näswall, Richter, Hellgren & Sverke  |  Scandinavian Journal of Work and Organizational Psychology, 10(1)  |  2025', { x: 5.55, y: 2.65, w: 6.95, h: 0.5, fontSize: 12, color: AMBER });
  T(s, bullets([
    'מטא-אנליזה: איחוד סטטיסטי של 237 מחקרים ראשוניים',
    'כתב עת שפיט, גישה פתוחה מלאה (Open Access), הוצאת אוניברסיטת סטוקהולם',
    'המחברים: קבוצת המחקר המובילה בעולם בנושא, שפרסמה את המטא-אנליזה הראשונה בתחום ב-2002',
  ]), { x: 5.55, y: 3.2, w: 6.95, h: 1.6, fontSize: 13, color: 'E5EAF3' });
  card(s, 0.6, 1.45, 4.4, 3.4);
  T(s, 'למה בחרנו בו?', { x: 0.85, y: 1.6, w: 3.9, h: 0.5, fontSize: 18, bold: true, color: NAVY });
  T(s, bullets(['עונה על השאלה שכולנו שואלים: האם הפחד יעשה אותנו טובים יותר?', 'הראשון שבודק מה חוסר ביטחון עושה לקריירה עצמה, לא רק לבריאות', 'זמין לכולם בחינם. אפשר לשלוח לחבר שמפחד מפיטורים']), { x: 0.85, y: 2.15, w: 3.9, h: 2.6, fontSize: 13 });
  card(s, 0.6, 5.1, 12.13, 1.75, LIGHT);
  T(s, 'מאמר משלים (גם הוא 2025, גישה פתוחה) והמסגרת התיאורטית', { x: 0.85, y: 5.2, w: 11.6, h: 0.45, fontSize: 15, bold: true, color: TEAL });
  E(s, [
    { text: 'Chung, Y. W., Im, S., Kim, J. E., & Yun, J. K. (2025). Artificial intelligence awareness, career resilience, job insecurity and behavioural outcomes. Australian Journal of Psychology, 77(1), Article 2559910.', options: { breakLine: true } },
    { text: 'Shoss, M. K. (2017). Job insecurity: An integrative review and agenda for future research. Journal of Management, 43(6), 1911-1939.', options: {} },
  ], { x: 0.85, y: 5.65, w: 11.6, h: 1.1, fontSize: 12, color: INK, paraSpaceAfter: 6 });
  footer(s, n);
  NOTE(s, 'להציג את המאמר במשפט: זו לא סקירה של מחקר אחד אלא איחוד סטטיסטי של 237 מחקרים. מגנוס סברקה ויוהני הלגרן מאוניברסיטת סטוקהולם חוקרים את הנושא כבר 30 שנה. בהגשה בשלשה: להרחיב על המאמר של צ\'ונג ואחרים בשקופית 9.');
}

// ================= 6. The question =================
{
  const s = pres.addSlide(); n++;
  title(s, 'השאלה: כשמפחדים לאבד את העבודה, מתקדמים למעלה או בורחים הלאה?');
  card(s, 0.6, 1.4, 12.13, 1.2, NAVY);
  T(s, 'חוסר ביטחון תעסוקתי = איום נתפס על ההמשכיות ועל היציבות של התעסוקה הנוכחית (Shoss, 2017). סובייקטיבי, מכוון לעתיד, כמותי או איכותני.', { x: 0.9, y: 1.5, w: 11.5, h: 1.0, fontSize: 16, color: WHITE, valign: 'middle' });
  // two competing predictions
  const preds = [
    ['תחזית א: "למעלה" (Moving Up)', 'האיום מדרבן: לומדים מיומנויות חדשות, מחזקים יכולת תעסוקה, מנצלים הזדמנויות. זו ההתמודדות הפרואקטיבית במסגרת של Shoss (2017).', TEAL, '⬆'],
    ['תחזית ב: "הלאה" (Moving On)', 'האיום מדלדל משאבים: לפי תיאוריית שימור המשאבים (Hobfoll, 1989) מגנים על מה שנשאר במקום להשקיע. בורחים, מסתירים ידע, לא מתפתחים.', RED, '➡'],
  ];
  preds.forEach(([h, d, c, ic], i) => {
    const cw = 5.9, x = i === 0 ? W - 0.6 - cw : 0.6, y = 2.9;
    card(s, x, y, cw, 2.7, WHITE);
    s.addShape(pres.shapes.OVAL, { x: x + cw - 1.0, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: c }, line: { color: c } });
    s.addText(ic, { x: x + cw - 1.0, y: y + 0.3, w: 0.7, h: 0.7, fontFace: F, fontSize: 22, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    T(s, h, { x: x + 0.3, y: y + 0.3, w: cw - 1.5, h: 0.7, fontSize: 17, bold: true, color: c, valign: 'middle' });
    T(s, d, { x: x + 0.3, y: y + 1.15, w: cw - 0.6, h: 1.45, fontSize: 13.5, color: INK });
  });
  card(s, 0.6, 5.85, 12.13, 0.95, 'FFF4DE');
  T(s, 'המטא-אנליזה נועדה להכריע: על בסיס כלל הראיות, איזו תגובה שכיחה יותר בפועל? (Låstad et al., 2025)', { x: 0.9, y: 5.9, w: 11.5, h: 0.85, fontSize: 15, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'שתי תחזיות מנוגדות. האינטואיציה של רוב האנשים היא תחזית א: "פחד מחדד". התיאוריה חוזה את ב. עכשיו נראה מה 237 מחקרים אומרים.');
}

// ================= 7. Findings diagram =================
{
  const s = pres.addSlide(); n++;
  title(s, 'הממצאים: 8 תוצאות קריירה, כיוון אחד ברור');
  // center
  s.addShape(pres.shapes.OVAL, { x: 5.4, y: 2.2, w: 2.55, h: 2.2, fill: { color: NAVY }, line: { color: NAVY } });
  T(s, 'חוסר ביטחון תעסוקתי', { x: 5.5, y: 2.5, w: 2.35, h: 0.9, fontSize: 17, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  T(s, '237 מחקרים', { x: 5.5, y: 3.4, w: 2.35, h: 0.5, fontSize: 12, color: AMBER, align: 'center', valign: 'middle' });
  // right: negative ("up" blocked)
  const rx = 8.9, rw = 3.83;
  T(s, '"למעלה" יורד ⬇', { x: rx, y: 1.35, w: rw, h: 0.45, fontSize: 16, bold: true, color: RED, align: 'center' });
  ['שביעות רצון מהקריירה', 'הזדמנויות קריירה נתפסות', 'יכולת תעסוקה נתפסת', 'פיתוח מיומנויות פרואקטיבי'].forEach((t, i) => {
    const y = 1.9 + i * 1.02;
    card(s, rx, y, rw, 0.85, 'FDECEA');
    s.addText('−', { x: rx + rw - 0.75, y: y + 0.17, w: 0.5, h: 0.5, fontFace: F, fontSize: 24, bold: true, color: RED, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    T(s, t, { x: rx + 0.2, y: y + 0.1, w: rw - 1.0, h: 0.65, fontSize: 14, bold: true, color: NAVY, valign: 'middle' });
  });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 8.0, y: 3.0, w: 0.85, h: 0.6, fill: { color: RED }, line: { color: RED } });
  // left: positive ("on")
  const lx = 0.6, lw = 3.83;
  T(s, '"הלאה" עולה ⬆', { x: lx, y: 1.35, w: lw, h: 0.45, fontSize: 16, bold: true, color: 'D9822B', align: 'center' });
  ['כוונת עזיבה של הארגון', 'כוונת עזיבה של המקצוע', 'חיפוש עבודה', 'הסתרת ידע מעמיתים'].forEach((t, i) => {
    const y = 1.9 + i * 1.02;
    card(s, lx, y, lw, 0.85, 'FFF1D6');
    s.addText('+', { x: lx + lw - 0.75, y: y + 0.17, w: 0.5, h: 0.5, fontFace: F, fontSize: 24, bold: true, color: 'D9822B', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    T(s, t, { x: lx + 0.2, y: y + 0.1, w: lw - 1.0, h: 0.65, fontSize: 14, bold: true, color: NAVY, valign: 'middle' });
  });
  s.addShape(pres.shapes.LEFT_ARROW, { x: 4.5, y: 3.0, w: 0.85, h: 0.6, fill: { color: 'D9822B' }, line: { color: 'D9822B' } });
  card(s, 0.6, 6.05, 12.13, 0.8, 'FFF4DE');
  T(s, 'התשובה: הלאה, לא למעלה. הפחד גורם לברוח ולהסתיר, לא להתפתח (Låstad et al., 2025)', { x: 0.9, y: 6.1, w: 11.5, h: 0.7, fontSize: 15, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'לקרוא: מימין, כל מה שקשור להתקדמות למעלה יורד עם חוסר הביטחון. משמאל, כל מה שקשור לבריחה והגנה עולה. לשים לב להסתרת ידע: תגובה רציונלית של עובד שחושב שהידע שלו הוא מה שמגן עליו, והרסנית לארגון.');
}

// ================= 8. Method & moderators =================
{
  const s = pres.addSlide(); n++;
  title(s, 'איך בדקו? ומה משנה את עוצמת הקשר?');
  const stats = [['237', 'מחקרים ראשוניים קודדו ואוחדו סטטיסטית'], ['8', 'תוצאות קריירה בשלוש קבוצות: עמדות, התנהגויות, כוונות'], ['2', 'ממתנים מתודולוגיים: מערך המחקר וסוג המדד']];
  const cw = 3.9, gx = 0.215, x0 = 0.6, y = 1.5, ch = 2.3;
  stats.forEach(([b, d], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, WHITE);
    T(s, b, { x: x + 0.2, y: y + 0.2, w: cw - 0.4, h: 1.0, fontSize: 48, bold: true, color: RED, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.3, y: y + 1.25, w: cw - 0.6, h: 0.95, fontSize: 14, color: INK, align: 'center' });
  });
  const mods = [
    ['מערך המחקר', 'הקשרים חזקים יותר במחקרי חתך מאשר במחקרי אורך. כלומר: הקשר אמיתי, אבל כנראה קטן יותר ממה שמחקר בודד מראה.', TEAL],
    ['סוג המדד', 'קוגניטיבי ("כמה זה סביר"), רגשי ("כמה זה מדאיג") או משולב: השפעה מעורבת, לא אחידה בין התוצאות.', 'D9822B'],
  ];
  mods.forEach(([h, d, c], i) => {
    const w2 = 5.95, x = i === 0 ? W - 0.6 - w2 : 0.6, yy = 4.1;
    card(s, x, yy, w2, 1.75, LIGHT);
    s.addShape(pres.shapes.OVAL, { x: x + w2 - 0.7, y: yy + 0.25, w: 0.4, h: 0.4, fill: { color: c }, line: { color: c } });
    T(s, h, { x: x + 0.3, y: yy + 0.2, w: w2 - 1.2, h: 0.5, fontSize: 16, bold: true, color: NAVY, valign: 'middle' });
    T(s, d, { x: x + 0.3, y: yy + 0.75, w: w2 - 0.6, h: 0.95, fontSize: 13, color: INK });
  });
  card(s, 0.6, 6.05, 12.13, 0.8, 'FFF4DE');
  T(s, 'מגבלות שהמחברים עצמם מציינים: מתאמים ולא סיבתיות, דיווח עצמי, הטיית פרסום אפשרית, מדגמים בעיקר מערביים ואסייתיים', { x: 0.9, y: 6.1, w: 11.5, h: 0.7, fontSize: 13, color: INK, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'מטא-אנליזה = מחקר שמאחד סטטיסטית מחקרים רבים. להסביר בקצרה חתך לעומת אורך: במחקר חתך מודדים הכול באותו רגע, ואז קשרים נראים חזקים יותר. זו כנות של המחברים שאהבנו.');
}

// ================= 9. Complementary article =================
{
  const s = pres.addSlide(); n++;
  title(s, 'המאמר המשלים: הבינה המלאכותית, חוסר הביטחון וחוסן הקריירה');
  E(s, 'Chung, Im, Kim & Yun (2025), Australian Journal of Psychology, Open Access', { x: 0.6, y: 1.25, w: 12.13, h: 0.4, fontSize: 13, italic: true, color: GRAY });
  // flow: AI awareness -> JI -> outcomes (RTL: right to left)
  const boxes = [['מודעות לבינה מלאכותית', '"הטכנולוגיה עלולה להחליף אותי או לשנות את התפקיד"', NAVY], ['חוסר ביטחון תעסוקתי', 'המתווך', RED], ['תוצאות', 'ירידה בביצועי משימה, עלייה בהתנהגות סוטה', 'D9822B']];
  const bw = 3.4, gap = 0.95, x0 = W - 0.6 - bw;
  boxes.forEach(([h, d, c], i) => {
    const x = x0 - i * (bw + gap), y = 1.95;
    card(s, x, y, bw, 1.6, c);
    T(s, h, { x: x + 0.2, y: y + 0.15, w: bw - 0.4, h: 0.6, fontSize: 16, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.2, y: y + 0.8, w: bw - 0.4, h: 0.7, fontSize: 12, color: 'F3F4F6', align: 'center' });
    if (i < 2) s.addShape(pres.shapes.LEFT_ARROW, { x: x - gap + 0.12, y: y + 0.5, w: 0.7, h: 0.6, fill: { color: AMBER }, line: { color: AMBER } });
  });
  // moderator
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 4.05, w: 4.2, h: 0.95, fill: { color: TEAL }, line: { color: TEAL }, rectRadius: 0.1 });
  T(s, 'חוסן קריירה: מחליש את הקשר', { x: 7.1, y: 4.05, w: 4.0, h: 0.95, fontSize: 16, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.UP_ARROW, { x: 8.85, y: 3.6, w: 0.5, h: 0.45, fill: { color: TEAL }, line: { color: TEAL } });
  card(s, 0.6, 5.25, 12.13, 1.6, LIGHT);
  T(s, bullets([
    'מחקר אורך בשלוש נקודות זמן בקרב עובדי משרד במשרה מלאה בדרום קוריאה',
    'עצם המודעות לבינה מלאכותית, עוד לפני שינוי בפועל, מספיקה כדי לייצר חוסר ביטחון',
    'החדשות הטובות: אצל בעלי חוסן קריירה גבוה הקשר חלש יותר. חוסן אפשר לבנות',
  ], { gap: 4 }), { x: 0.9, y: 5.35, w: 11.5, h: 1.45, fontSize: 13.5, color: INK });
  footer(s, n);
  NOTE(s, 'המאמר הזה מסביר מאיפה מגיע חוסר הביטחון של 2026 ומה ממתן אותו. לחבר לסקר הפתיחה: מי שסימן 1 או 2, ייתכן שזו בדיוק המודעות לבינה מלאכותית. בהגשה בזוג אפשר לקצר שקופית זו לחצי דקה.');
}

// ================= 10. Vicious cycle insight =================
{
  const s = pres.addSlide(); n++;
  title(s, 'התובנה המרכזית: מעגל קסמים');
  // cycle: 3 nodes in triangle, RTL reading
  const nodes = [
    ['חוסר ביטחון תעסוקתי', 'האיום על המשרה', 9.4, 1.6, RED],
    ['פחות פיתוח מיומנויות, פחות יכולת תעסוקה', 'מגנים על מה שנשאר במקום להשקיע', 5.0, 3.55, 'D9822B'],
    ['פחות משאבים להתמודד עם האיום הבא', 'ספירלת אובדן (Hobfoll, 1989)', 0.6, 1.6, NAVY],
  ];
  nodes.forEach(([h, d, x, y, c]) => {
    card(s, x, y, 3.35, 1.55, c);
    T(s, h, { x: x + 0.2, y: y + 0.12, w: 2.95, h: 0.8, fontSize: 14.5, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.2, y: y + 0.92, w: 2.95, h: 0.55, fontSize: 11.5, color: 'F3F4F6', align: 'center' });
  });
  s.addShape(pres.shapes.LEFT_ARROW, { x: 8.45, y: 2.95, w: 0.85, h: 0.6, fill: { color: AMBER }, line: { color: AMBER }, rotate: 30 });
  s.addShape(pres.shapes.LEFT_ARROW, { x: 4.0, y: 2.95, w: 0.85, h: 0.6, fill: { color: AMBER }, line: { color: AMBER }, rotate: -30 });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.2, y: 1.95, w: 0.95, h: 0.6, fill: { color: AMBER }, line: { color: AMBER } });
  T(s, 'חוזר להתחלה', { x: 4.3, y: 1.35, w: 4.7, h: 0.5, fontSize: 12, color: GRAY, align: 'center' });
  card(s, 0.6, 5.35, 12.13, 1.5, 'FFF4DE');
  T(s, 'חוסר ביטחון מקטין בדיוק את המשאבים שמגנים מפניו (Låstad et al., 2025). לכן ההשקעה בעצמי צריכה לקרות דווקא כשהיא נראית הכי פחות דחופה: בתקופות של יציבות, לפני שהאיום מגיע.', { x: 0.9, y: 5.45, w: 11.5, h: 1.3, fontSize: 15, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'זה הלב של המסר. הממצאים מראים מעגל: איום, הגנה על משאבים, פחות השקעה בעצמי, ואז פחות משאבים לאיום הבא. הדרך היחידה לצאת היא לשבור את המעגל מראש.');
}

// ================= 11. Insights & opinion =================
{
  const s = pres.addSlide(); n++;
  title(s, 'תובנות, ביקורת ודעה אישית');
  card(s, 6.85, 1.45, 5.88, 3.2, 'E8F5F1');
  T(s, '👍 מה אהבנו', { x: 7.1, y: 1.55, w: 5.4, h: 0.5, fontSize: 18, bold: true, color: TEAL });
  T(s, bullets(['תשובה מבוססת 237 מחקרים לשאלה שכולנו שואלים: האם הפחד מחדד? לא.', 'הכותרת מכניסה את כל המאמר לשלוש מילים', 'כנות לגבי המגבלות של מחקרי חתך', 'זמין לכולם בחינם, אפשר לשלוח לחבר'], { gap: 5 }), { x: 7.1, y: 2.1, w: 5.4, h: 2.4, fontSize: 13 });
  card(s, 0.6, 1.45, 5.88, 3.2, 'FDECEA');
  T(s, '🤔 מה חסר לנו', { x: 0.85, y: 1.55, w: 5.4, h: 0.5, fontSize: 18, bold: true, color: RED });
  T(s, bullets(['מכמת אבל לא אומר מה לעשות. את "מפת החוסן" בנינו לבד', 'לא מבחין בין איום כמותי לאיכותני, וזו ההבחנה של עידן הבינה המלאכותית', 'אין הקשר כמו הישראלי: מלחמה ומילואים, לא רק הארגון'], { gap: 5 }), { x: 0.85, y: 2.1, w: 5.4, h: 2.4, fontSize: 13 });
  card(s, 0.6, 4.9, 12.13, 1.95, NAVY);
  T(s, 'העמדה שלנו', { x: 0.9, y: 5.0, w: 11.5, h: 0.45, fontSize: 17, bold: true, color: AMBER });
  T(s, 'הממצאים מאתגרים את "ממשבר להזדמנות" (דבדבני דקל, 2026ב) ובה בעת מחדדים אותו: משבר הופך להזדמנות רק אצל מי שיש לו משאבים לנצל אותה. בלי משאבים, האיום מייצר בריחה והסתרה. לכן המסר שלנו הוא לא "אל תפחדו", אלא "בנו את הכרית לפני שתצטרכו אותה".', { x: 0.9, y: 5.45, w: 11.5, h: 1.35, fontSize: 14.5, color: WHITE });
  footer(s, n);
  NOTE(s, 'להגיד את הביקורת בקול. ועדיין, זה המאמר שהכי שינה את הדרך שבה אנחנו חושבים על הקריירה שלנו.');
}

// ================= 12. Video =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: NAVY };
  title(s, 'סרטון: "3 הסודות של אנשים חסינים", Lucy Hone, TED', { color: WHITE });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.9, y: 1.6, w: 5.83, h: 3.3, fill: { color: '0B1530' }, line: { color: '0B1530' }, rectRadius: 0.12 });
  s.addShape(pres.shapes.OVAL, { x: 9.2, y: 2.6, w: 1.25, h: 1.25, fill: { color: AMBER }, line: { color: AMBER } });
  s.addText('▶', { x: 9.2, y: 2.6, w: 1.25, h: 1.25, fontFace: F, fontSize: 30, bold: true, color: NAVY, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  s.addText('ted.com/talks/lucy_hone_the_three_secrets_of_resilient_people', { x: 7.1, y: 4.35, w: 5.4, h: 0.4, fontFace: F, fontSize: 11, color: 'CAD3E5', align: 'center', margin: 0, isTextBox: true, hyperlink: { url: 'https://www.ted.com/talks/lucy_hone_the_three_secrets_of_resilient_people' } });
  T(s, 'מה לחפש בקטע (90 שניות):', { x: 0.8, y: 1.6, w: 5.7, h: 0.5, fontSize: 18, bold: true, color: AMBER });
  T(s, bullets(['"דברים רעים קורים": קבלת חוסר הוודאות כחלק מהחיים', 'לבחור במה להתמקד: מה בשליטתי', '"האם זה עוזר לי או פוגע בי?": האם התגובה שלי היא בריחה והסתרה, או התפתחות'], { gap: 8 }), { x: 0.8, y: 2.15, w: 5.7, h: 2.8, fontSize: 14.5, color: WHITE });
  card(s, 0.8, 5.25, 11.93, 1.5, '1D2E52');
  T(s, 'שאלה לכיתה אחרי הסרטון: איזה מהשלושה הכי קשה לכם ליישם בהקשר של הקריירה? (הרמת ידיים)', { x: 1.05, y: 5.35, w: 11.4, h: 1.3, fontSize: 16, color: WHITE, valign: 'middle' });
  footer(s, n, true);
  NOTE(s, 'להקרין כ-90 שניות (לבדוק את הטיים-קוד מראש). לחבר את העיקרון השלישי לממצא: הסתרת ידע וחיפוש עבודה בלבד הן תגובות ש"פוגעות בי" בטווח הארוך; פיתוח מיומנויות "עוזר לי".');
}

// ================= 13. Resilience map =================
{
  const s = pres.addSlide(); n++;
  title(s, 'יישום: "מפת החוסן התעסוקתי", הכלי שבנינו מהמאמרים');
  const hdr = { fontFace: F, fontSize: 14, bold: true, color: WHITE, fill: { color: NAVY }, align: 'right', valign: 'middle', rtlMode: true };
  const c = (t, extra = {}) => ({ text: t, options: { fontFace: F, fontSize: 12, color: INK, align: 'right', valign: 'middle', rtlMode: true, ...extra } });
  const rows = [
    [{ text: 'פעולות מומלצות', options: hdr }, { text: 'שאלות מנחות', options: hdr }, { text: 'שלב', options: hdr }],
    [c('להחליף שמועות במידע: שיחה עם המנהל, מעקב אחר החברה והענף; למפות אילו חלקים בתפקיד הבינה המלאכותית משנה'), c('מה ההסתברות? האיום כמותי (המשרה) או איכותני (התוכן)? מה בשליטתי?'), c('1. הערכת האיום', { bold: true, color: RED })],
    [c('יעד למידה שנתי אחד וזמן שבועי קבוע; מיומנויות AI בתחום העיסוק; קו"ח ופרופיל מעודכנים כל חצי שנה'), c('מה למדתי בשנה האחרונה? אילו מיומנויות מבוקשות חסרות לי?'), c('2. שבירת המעגל: פיתוח מיומנויות', { bold: true, color: 'D9822B' })],
    [c('זהות מקצועית שלא תלויה בארגון; קרן חירום 3 עד 6 חודשים; רשת תמיכה ומנטור'), c('עד כמה הזהות שלי = התפקיד? כמה זמן אחזיק מעמד? למי אפנה?'), c('3. בניית חוסן קריירה', { bold: true, color: TEAL })],
    [c('לשתף ידע במקום להסתיר (בונה מוניטין ורשת); לחפש עבודה רק אחרי שמיפיתי מה אני רוצה לפתח, לא רק ממה אני בורח'), c('אני בורח (חיפוש בלבד), מסתיר (שומר ידע) או מתפתח?'), c('4. בחירת התגובה', { bold: true, color: NAVY })],
  ];
  s.addTable(rows, { x: 0.6, y: 1.45, w: 12.13, colW: [5.6, 3.6, 2.93], rowH: [0.5, 0.95, 0.95, 0.95, 0.95], border: { type: 'solid', color: 'D1D5DB', pt: 1 }, fill: { color: WHITE }, margin: 0.08 });
  card(s, 0.6, 6.05, 12.13, 0.8, 'FFF4DE');
  T(s, 'מתחבר ל"שלושת סלי הכלים" מהקורס (דבדבני דקל, 2026א): התפתחות = שלב 2, זהות מקצועית ורשת אנשים = שלב 3', { x: 0.9, y: 6.1, w: 11.5, h: 0.7, fontSize: 13.5, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'זה הכלי שאנחנו משאירים לכיתה. שלב 2 הוא הלב: לשבור את המעגל על ידי השקעה בפיתוח מיומנויות לפני שהאיום מדלדל את היכולת לעשות זאת.');
}

// ================= 14. Activity =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: LIGHT };
  title(s, 'הפעלה (2 דקות בזוגות): קיבלתם תרחיש, מלאו את המפה');
  const sc = [
    ['תרחיש א', 'מייל מהמנכ"ל: "התייעלות של 15% ברבעון הקרוב". אין פרטים נוספים. מה תעשו השבוע?', RED],
    ['תרחיש ב', 'הארגון הודיע שמערכת AI תטפל ב-60% מהפניות. התפקיד נשאר, התוכן משתנה. איך תגיבו?', 'D9822B'],
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
  T(s, 'שלוש שאלות, 40 שניות לכל אחת:', { x: 0.9, y: 4.4, w: 11.5, h: 0.45, fontSize: 17, bold: true, color: AMBER });
  [['1', 'מה האיום בפועל, כמותי או איכותני? ומה בשליטתי?'], ['2', 'התגובה הראשונה שלי: בריחה, הסתרה או התפתחות?'], ['3', 'איזו פעולה אחת של פיתוח מיומנויות אעשה כבר השבוע?']].forEach(([k, t], i) => {
    const yy = 4.95 + i * 0.6;
    circleNum(s, 11.85, yy + 0.05, k, AMBER, NAVY, 0.45, 14);
    T(s, t, { x: 0.9, y: yy, w: 10.8, h: 0.55, fontSize: 15, color: WHITE, valign: 'middle' });
  });
  footer(s, n);
  NOTE(s, 'לחלק כרטיסים מודפסים (או להשאיר את השקופית). 2 דקות. אחר כך לשמוע 2 עד 3 זוגות. לחבר למאמר: "שימו לב כמה מכם קפצו ישר לחיפוש עבודה. זו בדיוק תגובת ה"הלאה" שהמטא-אנליזה מצאה. מי חשב על מה ללמוד?"');
}

// ================= 15. Summary =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: NAVY };
  s.addShape(pres.shapes.OVAL, { x: -1.8, y: -1.8, w: 4.5, h: 4.5, fill: { color: '1D2E52' }, line: { color: '1D2E52' } });
  T(s, 'המסר שלנו לכיתה', { x: 0.8, y: 0.6, w: 11.7, h: 0.7, fontSize: 20, color: 'CAD3E5' });
  T(s, 'הפחד לא יעשה אותנו טובים יותר.\nאת הכרית שמאפשרת להתפתח תחת איום בונים לפני שצריכים אותה.', { x: 0.8, y: 1.3, w: 11.7, h: 1.9, fontSize: 32, bold: true, color: WHITE, valign: 'middle' });
  const tk = [['הלאה, לא למעלה', '237 מחקרים: חוסר ביטחון מגביר בריחה והסתרת ידע, ומקטין פיתוח מיומנויות ויכולת תעסוקה'], ['מעגל קסמים', 'האיום מדלדל בדיוק את המשאבים שמגנים מפניו. שוברים אותו מראש: יעד למידה שנתי, מיומנויות AI, קרן חירום'], ['חוסן קריירה', 'זהות מקצועית שלא תלויה בארגון, רשת תמיכה ושיתוף ידע מחלישים את הקשר בין האיום לחוסר הביטחון']];
  const cw = 3.75, gx = 0.22, x0 = 0.8, y = 3.55, ch = 2.55;
  tk.forEach(([h, d], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, '1D2E52');
    circleNum(s, x + cw - 0.85, y + 0.3, String(i + 1));
    T(s, h, { x: x + 0.25, y: y + 0.3, w: cw - 1.2, h: 0.55, fontSize: 17, bold: true, color: AMBER, valign: 'middle' });
    T(s, d, { x: x + 0.25, y: y + 1.0, w: cw - 0.5, h: 1.45, fontSize: 13, color: WHITE });
  });
  T(s, 'תודה! שאלות?', { x: 0.8, y: 6.35, w: 11.7, h: 0.6, fontSize: 22, bold: true, color: WHITE });
  footer(s, n, true);
  NOTE(s, 'לחזור לתוצאות הסקר מהפתיחה: "מי שסימן 1 או 2: המאמר אומר שהתגובה הטבעית שלכם תהיה לברוח. עצרו רגע ותשאלו מה ללמוד. מי שסימן 5: יופי, זה הזמן להשקיע, כי עכשיו יש לכם משאבים". לסיים במסר ולפתוח לשאלות.');
}

// ================= 16. References =================
{
  const s = pres.addSlide(); n++;
  title(s, 'רשימת מקורות (APA)');
  const refs = [
    'Chung, Y. W., Im, S., Kim, J. E., & Yun, J. K. (2025). Artificial intelligence awareness, career resilience, job insecurity and behavioural outcomes. Australian Journal of Psychology, 77(1), Article 2559910. https://doi.org/10.1080/00049530.2025.2559910',
    'Hobfoll, S. E. (1989). Conservation of resources: A new attempt at conceptualizing stress. American Psychologist, 44(3), 513-524.',
    'Hone, L. (2019). 3 secrets of resilient people [Video]. TED Conferences. https://www.ted.com/talks/lucy_hone_the_three_secrets_of_resilient_people',
    'Låstad, L., Pienaar, J., Näswall, K., Richter, A., Hellgren, J., & Sverke, M. (2025). Moving on up now? A meta-analysis of the associations between job insecurity and career-related outcomes. Scandinavian Journal of Work and Organizational Psychology, 10(1), Article 2. https://doi.org/10.16993/sjwop.275',
    'Shoss, M. K. (2017). Job insecurity: An integrative review and agenda for future research. Journal of Management, 43(6), 1911-1939. https://doi.org/10.1177/0149206317691574',
    'Sverke, M., Hellgren, J., & Näswall, K. (2002). No security: A meta-analysis and review of job insecurity and its consequences. Journal of Occupational Health Psychology, 7(3), 242-264.',
  ];
  s.addText(refs.map((r, i) => ({ text: r, options: { breakLine: i < refs.length - 1, paraSpaceAfter: 6 } })), { x: 0.6, y: 1.3, w: 12.13, h: 3.4, fontFace: F, fontSize: 11, color: INK, align: 'left', valign: 'top', margin: 0, isTextBox: true });
  T(s, [
    { text: 'בנק ישראל. (2025, 11 במרץ). ההשפעה הצפויה של בינה מלאכותית יוצרת על העובדים: השלכות על המדיניות בשוק העבודה [תיבה מתוך דוח בנק ישראל לשנת 2024]. https://www.boi.org.il/publications/pressreleases/11-3-25/', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'דבדבני דקל, מ\' (2026א). מחזון ורעיון למציאות ממשית [מצגת הרצאה]. ניהול קריירה בארגונים, הקריה האקדמית אונו.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'דבדבני דקל, מ\' (2026ב). עסקים בצל הקורונה: ממשבר להזדמנות, איך עושים את זה? [מצגת הרצאה]. ניהול קריירה בארגונים, הקריה האקדמית אונו.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'הקשיים של מנהלי הייטק ב-2026: גיוס עובדים מתאימים והתייעלות AI. (2026, 21 ביוני). TheMarker.', options: {} },
  ], { x: 0.6, y: 4.9, w: 12.13, h: 2.0, fontSize: 11, color: INK });
  footer(s, n);
}

const out = process.argv[2] || 'out.pptx';
pres.writeFile({ fileName: out }).then(f => console.log('wrote', f));

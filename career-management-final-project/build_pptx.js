const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
pres.lang = 'he-IL';
pres.rtlMode = true;
pres.title = 'התמודדות עם חוסר ודאות תעסוקתי';

const NAVY = '14213D', AMBER = 'FCA311', LIGHT = 'F4F6FA', GRAY = '6B7280', WHITE = 'FFFFFF', TEAL = '2A9D8F', RED = 'E76F51', INK = '1F2937', CARD = 'EEF2F8', ORANGE = 'D9822B';
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
  T(s, 'איך בונים בהירות, שליטה ומשמעות בעבודה כשהסביבה לא יציבה?', { x: 0.8, y: 3.1, w: 11.7, h: 0.6, fontSize: 22, color: AMBER, italic: true });
  E(s, 'Cetkovská, K., Bauer, G. F., & Tušl, M. (2026). The role of needs-based job crafting in strengthening work-related sense of coherence: A two-wave panel study. Scandinavian Journal of Work and Organizational Psychology, 11(1), Article 14.', { x: 0.8, y: 3.8, w: 11.7, h: 0.8, fontSize: 12, color: 'CAD3E5' });
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
  NOTE(s, 'פתיחה (30 שניות): שלום לכולם, אנחנו [שמות]. הנושא שלנו הוא התמודדות עם חוסר ודאות תעסוקתי. במקום לשאול מה אי-הוודאות עושה לנו, נשאל מה אנחנו יכולים לעשות לה: מחקר אורך מ-2026 על 924 עובדים נותן תשובה מפתיעה בפשטותה.');
}

// ================= 2. Agenda =================
{
  const s = pres.addSlide(); n++;
  title(s, 'מה נעשה ב-10 הדקות הקרובות?');
  const items = [
    ['סקר פתיחה', 'ברור? בשליטה? משמעותי?', '1 דק\''],
    ['למה עכשיו', 'בינה מלאכותית, הייטק, מילואים', '1.5 דק\''],
    ['המאמר', 'סלוטוגנזה, 6 צרכים, 924 עובדים', '2.5 דק\''],
    ['מאמר משלים ותובנות', 'בינה מלאכותית וחוסן קריירה', '1 דק\''],
    ['סרטון + הפעלה', 'TED וצורך אחד, פעולה אחת', '3 דק\''],
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
  title(s, 'סקר פתיחה: איך מרגישה לכם העבודה (או הלימודים) עכשיו?');
  T(s, 'בסולם 1 עד 5, שלוש שאלות:', { x: 0.6, y: 1.35, w: 12.13, h: 0.5, fontSize: 18, color: GRAY });
  const qs = [['ברור וצפוי?', 'מובנות', TEAL], ['יש לי מספיק זמן, כלים ותמיכה?', 'ניהוליות', AMBER], ['שווה את המאמץ?', 'משמעותיות', RED]];
  const cw = 3.9, gx = 0.215, x0 = 0.6, y = 2.0, ch = 3.2;
  qs.forEach(([q, k, c], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, WHITE);
    s.addShape(pres.shapes.OVAL, { x: x + cw / 2 - 0.55, y: y + 0.3, w: 1.1, h: 1.1, fill: { color: c }, line: { color: c } });
    s.addText(String(i + 1), { x: x + cw / 2 - 0.55, y: y + 0.3, w: 1.1, h: 1.1, fontFace: F, fontSize: 36, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    T(s, q, { x: x + 0.3, y: y + 1.6, w: cw - 0.6, h: 0.9, fontSize: 20, bold: true, color: NAVY, align: 'center', valign: 'middle' });
    T(s, k, { x: x + 0.3, y: y + 2.55, w: cw - 0.6, h: 0.45, fontSize: 14, color: c, align: 'center', bold: true });
  });
  card(s, 0.6, 5.6, 12.13, 1.2, WHITE);
  T(s, 'הצבעה ב-Mentimeter או הרמת ידיים. אלה שלושת הרכיבים של "תחושת קוהרנטיות בעבודה". נחזור אליהם בסוף.', { x: 0.9, y: 5.75, w: 11.5, h: 0.9, fontSize: 17, color: INK, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'להריץ סקר מנטימטר או הרמת ידיים לכל שאלה. לא להסביר עדיין את המושג, רק לומר שנחזור לזה. לצלם מסך של התוצאות.');
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
    ['דרישות חדשות', 'ניהול עצמי, הסתגלות ויוזמה אישית: מה שעולם העבודה הגמיש דורש (Cetkovská et al., 2026)'],
  ];
  drivers.forEach(([h, d], i) => {
    const y = 1.45 + i * 1.37;
    card(s, 0.6, y, 6.2, 1.2, WHITE);
    circleNum(s, 6.0, y + 0.3, ['🤖', '📉', '🎖️', '🧭'][i], AMBER, NAVY, 0.6, 18);
    T(s, h, { x: 0.8, y: y + 0.12, w: 5.0, h: 0.45, fontSize: 17, bold: true, color: NAVY });
    T(s, d, { x: 0.8, y: y + 0.55, w: 5.0, h: 0.6, fontSize: 12.5, color: INK });
  });
  footer(s, n);
  NOTE(s, 'כתבת עיתון: להציג את הכותרת של TheMarker (21.6.2026). נתון בנק ישראל: כחמישית מהמועסקים במקצועות תחליפיים. המסר: הארגון לא יכול להבטיח ודאות. השאלה היא מה נשאר בידיים שלנו.');
}

// ================= 5. The article =================
{
  const s = pres.addSlide(); n++;
  title(s, 'המאמר שבחרנו');
  card(s, 5.3, 1.45, 7.43, 3.4, NAVY);
  E(s, 'The Role of Needs-Based Job Crafting in Strengthening Work-Related Sense of Coherence: A Two-Wave Panel Study', { x: 5.55, y: 1.6, w: 6.95, h: 1.0, fontSize: 18, bold: true, color: WHITE, valign: 'middle' });
  E(s, 'Cetkovská, Bauer & Tušl  |  Scandinavian Journal of Work and Organizational Psychology, 11(1)  |  2026', { x: 5.55, y: 2.65, w: 6.95, h: 0.5, fontSize: 12, color: AMBER });
  T(s, bullets([
    'מחקר אורך: 924 עובדים בגרמניה ובשווייץ, שתי מדידות בהפרש של חצי שנה',
    'כתב עת שפיט, גישה פתוחה מלאה (Open Access), הוצאת אוניברסיטת סטוקהולם',
    'המחברים: אוניברסיטת קארל בפראג והמרכז לסלוטוגנזה באוניברסיטת ציריך. מימון: הקרן הלאומית השווייצרית למדע',
  ]), { x: 5.55, y: 3.2, w: 6.95, h: 1.6, fontSize: 13, color: 'E5EAF3' });
  card(s, 0.6, 1.45, 4.4, 3.4);
  T(s, 'למה בחרנו בו?', { x: 0.85, y: 1.6, w: 3.9, h: 0.5, fontSize: 18, bold: true, color: NAVY });
  T(s, bullets(['שואל מה עוזר, לא רק מה מזיק', 'נותן כלי שבשליטת העובד, בלי לחכות לארגון', 'מבוסס על רעיון של חוקר שפעל בישראל: אהרן אנטונובסקי מאוניברסיטת בן-גוריון']), { x: 0.85, y: 2.15, w: 3.9, h: 2.6, fontSize: 13 });
  card(s, 0.6, 5.1, 12.13, 1.75, LIGHT);
  T(s, 'מאמר משלים (2025, גישה פתוחה)', { x: 0.85, y: 5.2, w: 11.6, h: 0.45, fontSize: 15, bold: true, color: TEAL });
  E(s, [
    { text: 'Chung, Y. W., Im, S., Kim, J. E., & Yun, J. K. (2025). Artificial intelligence awareness, career resilience, job insecurity and behavioural outcomes. Australian Journal of Psychology, 77(1), Article 2559910.', options: {} },
  ], { x: 0.85, y: 5.65, w: 11.6, h: 1.1, fontSize: 12, color: INK, paraSpaceAfter: 6 });
  footer(s, n);
  NOTE(s, 'להציג את המאמר במשפט: מחקר שעקב אחרי כמעט אלף עובדים במשך חצי שנה ובדק אם מה שהם עושים בתפקיד משנה את איך שהם תופסים אותו. בהגשה בשלשה: להרחיב על צ\'ונג ואחרים בשקופית 9.');
}

// ================= 6. Concepts =================
{
  const s = pres.addSlide(); n++;
  title(s, 'שני מושגים: תחושת קוהרנטיות בעבודה ועיצוב תפקיד מבוסס צרכים');
  // right: work-SOC
  card(s, 6.85, 1.4, 5.88, 5.45, WHITE);
  T(s, 'תחושת קוהרנטיות בעבודה (Work-SOC)', { x: 7.1, y: 1.5, w: 5.4, h: 0.5, fontSize: 17, bold: true, color: NAVY });
  T(s, 'מהגישה הסלוטוגנית של אנטונובסקי, כפי שמובאת במאמר: לא "למה חולים" אלא "איך נשארים בריאים למרות הלחץ"', { x: 7.1, y: 2.0, w: 5.4, h: 0.7, fontSize: 12.5, color: GRAY });
  [['מובנות', 'העבודה מובנית, עקבית וברורה', TEAL, 'קוגניטיבי'], ['ניהוליות', 'יש לי משאבים מספיקים לדרישות', AMBER, 'התנהגותי'], ['משמעותיות', 'העבודה ראויה למחויבות ולמעורבות', RED, 'מוטיבציוני']].forEach(([h, d, c, k], i) => {
    const y = 2.85 + i * 1.3;
    card(s, 7.1, y, 5.4, 1.1, LIGHT);
    s.addShape(pres.shapes.OVAL, { x: 11.85, y: y + 0.3, w: 0.5, h: 0.5, fill: { color: c }, line: { color: c } });
    T(s, h, { x: 7.3, y: y + 0.1, w: 4.4, h: 0.45, fontSize: 16, bold: true, color: NAVY });
    T(s, d + ' (' + k + ')', { x: 7.3, y: y + 0.55, w: 4.4, h: 0.5, fontSize: 12, color: INK });
  });
  // left: NJC / DRAMMA
  card(s, 0.6, 1.4, 5.88, 5.45, WHITE);
  T(s, 'עיצוב תפקיד מבוסס צרכים (NJC)', { x: 0.85, y: 1.5, w: 5.4, h: 0.5, fontSize: 17, bold: true, color: NAVY });
  T(s, 'מאמצים יזומים של העובד לספק שישה צרכים פסיכולוגיים בעבודה (DRAMMA)', { x: 0.85, y: 2.0, w: 5.4, h: 0.7, fontSize: 12.5, color: GRAY });
  T(s, 'צרכי התקרבות: לייצר מצבים חיוביים וצמיחה', { x: 0.85, y: 2.85, w: 5.4, h: 0.4, fontSize: 13, bold: true, color: TEAL });
  const needs = [['אוטונומיה', TEAL], ['מיומנות', TEAL], ['משמעות', TEAL], ['שייכות', TEAL]];
  needs.forEach(([t, c], i) => {
    const x = 6.25 - 0.1 - (i + 1) * 1.32 + 0.1, y = 3.3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.22, h: 0.6, fill: { color: c }, line: { color: c }, rectRadius: 0.1 });
    T(s, t, { x, y, w: 1.22, h: 0.6, fontSize: 13, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  });
  T(s, 'צרכי הימנעות: להפחית מאמץ ולהשיב אנרגיה', { x: 0.85, y: 4.2, w: 5.4, h: 0.4, fontSize: 13, bold: true, color: ORANGE });
  [['ניתוק', ORANGE], ['הרפיה', ORANGE]].forEach(([t, c], i) => {
    const x = 6.25 - (i + 1) * 1.32, y = 4.65;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.22, h: 0.6, fill: { color: c }, line: { color: c }, rectRadius: 0.1 });
    T(s, t, { x, y, w: 1.22, h: 0.6, fontSize: 13, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  });
  T(s, 'דוגמה לפריט: "תכננתי את עבודתי כך שאחווה שליטה"; "ארגנתי את עבודתי כך שאשיג תחושת תכלית במה שאני עושה"', { x: 0.85, y: 5.5, w: 5.4, h: 1.2, fontSize: 12, italic: true, color: INK });
  footer(s, n);
  NOTE(s, 'שני מושגים, ואז השאלה: האם הימני (מה שהעובד עושה) משנה את השמאלי (איך העבודה נתפסת)? להזכיר שאנטונובסקי פעל באוניברסיטת בן-גוריון, ושחוסר ודאות הוא במונחים שלו פגיעה במובנות.');
}

// ================= 7. Model & results diagram =================
{
  const s = pres.addSlide(); n++;
  title(s, 'הממצא: מה שאתם עושים בתפקיד משנה איך הוא נתפס חצי שנה אחר כך');
  // right: NJC approach box with a vertical connector to three straight arrows
  card(s, 9.3, 3.0, 3.43, 1.5, TEAL);
  T(s, 'עיצוב תפקיד לצרכי התקרבות', { x: 9.45, y: 3.05, w: 3.15, h: 0.8, fontSize: 15, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  T(s, 'אוטונומיה, מיומנות, משמעות, שייכות', { x: 9.45, y: 3.8, w: 3.15, h: 0.6, fontSize: 11, color: 'E5F4F1', align: 'center' });
  s.addShape(pres.shapes.LINE, { x: 9.15, y: 2.15, w: 0, h: 3.2, line: { color: TEAL, width: 3 } });
  s.addShape(pres.shapes.LINE, { x: 9.15, y: 3.75, w: 0.15, h: 0, line: { color: TEAL, width: 3 } });
  const comps = [['מובנות', '0.142', TEAL], ['ניהוליות', '0.137', AMBER], ['משמעותיות', '0.166', RED]];
  comps.forEach(([h, b, c], i) => {
    const y = 1.5 + i * 1.6;
    card(s, 0.6, y, 3.4, 1.3, c);
    T(s, h, { x: 0.75, y: y + 0.1, w: 3.1, h: 0.6, fontSize: 17, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    E(s, 'β = ' + b, { x: 0.75, y: y + 0.7, w: 3.1, h: 0.5, fontSize: 14, bold: true, color: WHITE, align: 'center' });
    s.addShape(pres.shapes.LEFT_ARROW, { x: 4.2, y: y + 0.4, w: 4.95, h: 0.5, fill: { color: c }, line: { color: c } });
  });
  E(s, 'p < .01 בכל שלושת הנתיבים, מעבר ליציבות של 0.61 עד 0.70 של המדדים עצמם', { x: 4.2, y: 5.55, w: 4.95, h: 0.4, fontSize: 11, italic: true, color: GRAY, align: 'center' });
  // reverse arrow note
  card(s, 0.6, 6.05, 12.13, 0.8, 'FFF4DE');
  T(s, 'עיצוב לצרכי הימנעות (ניתוק, הרפיה): ללא קשר מובהק לאף רכיב. ובכיוון ההפוך: ניהוליות היום מנבאת עיצוב תפקיד בעוד חצי שנה (β = 0.431). ספירלת רווח (Cetkovská et al., 2026)', { x: 0.9, y: 6.1, w: 11.5, h: 0.7, fontSize: 13, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'לקרוא מימין לשמאל: מי שעיצב את התפקיד סביב אוטונומיה, מיומנות, משמעות ושייכות, תפס את העבודה חצי שנה אחר כך כברורה יותר, בשליטה יותר ומשמעותית יותר, מעבר ליציבות של המדדים עצמם. מי שרק התנתק ונח: שום שינוי בתפיסה. והקו למטה: המשאבים מזינים את היוזמה.');
}

// ================= 8. Method + chart =================
{
  const s = pres.addSlide(); n++;
  title(s, 'איך בדקו? ומה גודל האפקט?');
  const stats = [['924', 'עובדים בגרמניה ובשווייץ, גיל ממוצע 49, מדגם מכסות של האוכלוסייה העובדת'], ['2 × 6', 'שני גלי מדידה בהפרש של שישה חודשים, 80% השלימו את שניהם'], ['9 + 18', 'פריטים: סולם תחושת קוהרנטיות בעבודה וסולם עיצוב תפקיד מבוסס צרכים']];
  const cw = 3.9, gx = 0.215, x0 = 0.6, y = 1.4, ch = 2.1;
  stats.forEach(([b, d], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, WHITE);
    T(s, b, { x: x + 0.2, y: y + 0.15, w: cw - 0.4, h: 0.9, fontSize: 40, bold: true, color: RED, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.3, y: y + 1.1, w: cw - 0.6, h: 0.95, fontSize: 12.5, color: INK, align: 'center' });
  });
  // chart: cross-lagged betas approach vs avoidance
  card(s, 0.6, 3.7, 7.6, 3.15, WHITE);
  s.addChart(pres.charts.BAR, [
    { name: 'עיצוב לצרכי התקרבות', labels: ['מובנות', 'ניהוליות', 'משמעותיות'], values: [0.142, 0.137, 0.166] },
    { name: 'עיצוב לצרכי הימנעות', labels: ['מובנות', 'ניהוליות', 'משמעותיות'], values: [0.077, 0.090, 0.027] },
  ], {
    x: 0.8, y: 3.8, w: 7.2, h: 2.95, barDir: 'col', barGrouping: 'clustered', chartColors: [TEAL, 'B0B7C3'],
    showTitle: true, title: 'מקדם ניבוי מתוקנן (β) של רכיבי תחושת הקוהרנטיות בגל 2', titleFontFace: F, titleFontSize: 12, titleColor: NAVY,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFontFace: F, dataLabelFontSize: 10, dataLabelColor: INK, dataLabelFormatCode: '0.000',
    catAxisLabelFontFace: F, catAxisLabelFontSize: 11, catAxisLabelColor: INK, valAxisLabelFontFace: F, valAxisLabelFontSize: 9, valAxisLabelColor: GRAY,
    valAxisMaxVal: 0.2, valAxisMinVal: 0, valGridLine: { color: 'E5E7EB', size: 0.5 }, catGridLine: { style: 'none' },
    showLegend: true, legendPos: 'b', legendFontFace: F, legendFontSize: 10,
  });
  card(s, 8.4, 3.7, 4.33, 3.15, LIGHT);
  T(s, 'מה זה אומר?', { x: 8.6, y: 3.8, w: 3.95, h: 0.45, fontSize: 15, bold: true, color: TEAL });
  T(s, bullets(['הירוק מובהק, האפור לא: רק עיצוב לצרכי התקרבות משנה את התפיסה', 'אפקטים בינוניים, אבל מעבר ליציבות גבוהה (0.61 עד 0.70) של המדדים עצמם', 'ניתוח פאנל צולב: כיווניות בזמן, לא הוכחת סיבתיות'], { gap: 5 }), { x: 8.6, y: 4.3, w: 3.95, h: 2.5, fontSize: 12, color: INK });
  footer(s, n);
  NOTE(s, 'הגרף: שלוש עמודות ירוקות (התקרבות) מול שלוש אפורות (הימנעות). מקדם 0.14 עד 0.17 נשמע קטן, אבל המדדים האלה יציבים מאוד, ולכן כל שינוי שנשאר אחרי חצי שנה משמעותי. להזכיר בכנות: מתאמים בזמן, לא סיבתיות.');
}

// ================= 9. Complementary article =================
{
  const s = pres.addSlide(); n++;
  title(s, 'המאמר המשלים: הבינה המלאכותית, חוסר הביטחון וחוסן הקריירה');
  E(s, 'Chung, Im, Kim & Yun (2025), Australian Journal of Psychology, Open Access', { x: 0.6, y: 1.25, w: 12.13, h: 0.4, fontSize: 13, italic: true, color: GRAY });
  const boxes = [['מודעות לבינה מלאכותית', '"הטכנולוגיה עלולה להחליף אותי או לשנות את התפקיד"', NAVY], ['חוסר ביטחון תעסוקתי', 'המתווך', RED], ['תוצאות', 'ירידה בביצועי משימה, עלייה בהתנהגות סוטה', ORANGE]];
  const bw = 3.4, gap = 0.95, x0 = W - 0.6 - bw;
  boxes.forEach(([h, d, c], i) => {
    const x = x0 - i * (bw + gap), y = 1.95;
    card(s, x, y, bw, 1.6, c);
    T(s, h, { x: x + 0.2, y: y + 0.15, w: bw - 0.4, h: 0.6, fontSize: 16, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.2, y: y + 0.8, w: bw - 0.4, h: 0.7, fontSize: 12, color: 'F3F4F6', align: 'center' });
    if (i < 2) s.addShape(pres.shapes.LEFT_ARROW, { x: x - gap + 0.12, y: y + 0.5, w: 0.7, h: 0.6, fill: { color: AMBER }, line: { color: AMBER } });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 4.05, w: 4.2, h: 0.95, fill: { color: TEAL }, line: { color: TEAL }, rectRadius: 0.1 });
  T(s, 'חוסן קריירה: מחליש את הקשר', { x: 7.1, y: 4.05, w: 4.0, h: 0.95, fontSize: 16, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.UP_ARROW, { x: 8.85, y: 3.6, w: 0.5, h: 0.45, fill: { color: TEAL }, line: { color: TEAL } });
  card(s, 0.6, 5.25, 12.13, 1.6, LIGHT);
  T(s, bullets([
    'מחקר אורך בשלוש נקודות זמן בקרב עובדי משרד במשרה מלאה בדרום קוריאה',
    'עצם המודעות לבינה מלאכותית, עוד לפני שינוי בפועל, מספיקה כדי לייצר חוסר ביטחון',
    'החיבור למאמר שלנו: המשלים מראה את האיום ואת המשאב שממתן אותו. המרכזי מראה איך בונים משאב כזה בפועל',
  ], { gap: 4 }), { x: 0.9, y: 5.35, w: 11.5, h: 1.45, fontSize: 13.5, color: INK });
  footer(s, n);
  NOTE(s, 'המשלים = האבחנה: מאיפה מגיע חוסר הביטחון של 2026 ומה ממתן אותו. המרכזי = הטיפול: איך בונים את המשאב. בהגשה בזוג אפשר לקצר שקופית זו לחצי דקה.');
}

// ================= 10. Insight: resources first =================
{
  const s = pres.addSlide(); n++;
  title(s, 'התובנה המרכזית: המשאבים קודמים ליוזמה');
  const nodes = [
    ['תחושת ניהוליות', '"יש לי מספיק משאבים"', 9.4, 1.6, AMBER],
    ['עיצוב תפקיד לצרכי התקרבות', 'β = 0.431: המנבא החזק ביותר במודל', 5.0, 3.55, TEAL],
    ['בהירות, שליטה ומשמעות', 'חצי שנה אחר כך', 0.6, 1.6, NAVY],
  ];
  nodes.forEach(([h, d, x, y, c]) => {
    card(s, x, y, 3.35, 1.55, c);
    T(s, h, { x: x + 0.2, y: y + 0.12, w: 2.95, h: 0.8, fontSize: 14.5, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.2, y: y + 0.92, w: 2.95, h: 0.55, fontSize: 11.5, color: 'F3F4F6', align: 'center' });
  });
  s.addShape(pres.shapes.LEFT_ARROW, { x: 8.45, y: 2.95, w: 0.85, h: 0.6, fill: { color: AMBER }, line: { color: AMBER }, rotate: 30 });
  s.addShape(pres.shapes.LEFT_ARROW, { x: 4.0, y: 2.95, w: 0.85, h: 0.6, fill: { color: AMBER }, line: { color: AMBER }, rotate: -30 });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.2, y: 1.95, w: 0.95, h: 0.6, fill: { color: AMBER }, line: { color: AMBER } });
  T(s, 'ספירלת רווח: חוזר להתחלה', { x: 4.3, y: 1.35, w: 4.7, h: 0.5, fontSize: 12, color: GRAY, align: 'center' });
  card(s, 0.6, 5.35, 12.13, 1.5, 'FFF4DE');
  T(s, 'ההיפוך: מי שמרגיש שאין לו מספיק משאבים לא מעצב את תפקידו, אלא מגן על מה שנשאר. והמאמר המשלים מראה שהאיום הטכנולוגי פוגע בביצועים דרך חוסר הביטחון (Chung et al., 2025). לכן בונים ניהוליות בתקופות של יציבות, לא מחכים לאיום.', { x: 0.9, y: 5.45, w: 11.5, h: 1.3, fontSize: 14, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'זה הלב של המסר. הספירלה עובדת לשני הכיוונים: משאבים מולידים יוזמה שמולידה משאבים. אבל בלי משאבים, האיום משתק. לכן העצה "תעצבו את התפקיד" נכונה, אבל צריך לתת אותה לפני שהאיום מגיע.');
}

// ================= 11. Insights & opinion =================
{
  const s = pres.addSlide(); n++;
  title(s, 'תובנות, ביקורת ודעה אישית');
  card(s, 6.85, 1.45, 5.88, 3.2, 'E8F5F1');
  T(s, '👍 מה אהבנו', { x: 7.1, y: 1.55, w: 5.4, h: 0.5, fontSize: 18, bold: true, color: TEAL });
  T(s, bullets(['נקודת המבט: מה עוזר, לא רק מה מזיק. רעיון ישראלי מבן-גוריון', 'פרקטי: שישה צרכים, שאלות פשוטות, פעולות לשבועיים', 'כנות: כמעט עמוד שלם על מגבלות, כולל ממצא שקשה להם להסביר', 'זמין לכולם בחינם'], { gap: 5 }), { x: 7.1, y: 2.1, w: 5.4, h: 2.4, fontSize: 13 });
  card(s, 0.6, 1.45, 5.88, 3.2, 'FDECEA');
  T(s, '🤔 מה חסר לנו', { x: 0.85, y: 1.55, w: 5.4, h: 0.5, fontSize: 18, bold: true, color: RED });
  T(s, bullets(['לא מודד חוסר ביטחון במישרין. את החיבור לנושא בנינו בעצמנו', 'מדגם גרמני-שווייצרי, גיל ממוצע 49, ביטחון סוציאלי גבוה. האם המרחב לעצב תפקיד קיים גם אצלנו?', 'שכירים בתפקיד קיים בלבד. לא מחפשי עבודה, לא עצמאים'], { gap: 5 }), { x: 0.85, y: 2.1, w: 5.4, h: 2.4, fontSize: 13 });
  card(s, 0.6, 4.9, 12.13, 1.95, NAVY);
  T(s, 'העמדה שלנו', { x: 0.9, y: 5.0, w: 11.5, h: 0.45, fontSize: 17, bold: true, color: AMBER });
  T(s, 'המאמר משלים את "ממשבר להזדמנות" (דבדבני דקל, 2026ב): משבר לא הופך להזדמנות מעצמו, אלא כשמישהו מעצב אותו כך. אבל המסר צריך להיות כפול: לעצב את התפקיד עכשיו, כשעוד יש משאבים, ולזכור שמי שמרגיש שאין לו משאבים צריך קודם תמיכה ולא עצות.', { x: 0.9, y: 5.45, w: 11.5, h: 1.35, fontSize: 14.5, color: WHITE });
  footer(s, n);
  NOTE(s, 'להגיד את הביקורת בקול. ועדיין, זה המאמר שנתן לנו הכי הרבה מה לעשות מחר בבוקר.');
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
  T(s, bullets(['"דברים רעים קורים": קבלת חוסר הוודאות כחלק מהחיים', 'לבחור במה להתמקד: מה בשליטתי. זו המובנות והניהוליות', '"האם זה עוזר לי או פוגע בי?": האם אני מעצב את המצב או רק שורד אותו'], { gap: 8 }), { x: 0.8, y: 2.15, w: 5.7, h: 2.8, fontSize: 14.5, color: WHITE });
  card(s, 0.8, 5.25, 11.93, 1.5, '1D2E52');
  T(s, 'שאלה לכיתה אחרי הסרטון: איזה מהשלושה הכי קשה לכם ליישם בהקשר של הקריירה? (הרמת ידיים)', { x: 1.05, y: 5.35, w: 11.4, h: 1.3, fontSize: 16, color: WHITE, valign: 'middle' });
  footer(s, n, true);
  NOTE(s, 'להקרין כ-90 שניות (לבדוק את הטיים-קוד מראש). לחבר: "לבחור במה להתמקד" זה בדיוק לעצב את התפקיד סביב מה שבשליטתי.');
}

// ================= 13. Personal crafting plan =================
{
  const s = pres.addSlide(); n++;
  title(s, 'יישום: תוכנית עיצוב תפקיד אישית לפי ארבעת צרכי ההתקרבות');
  const hdr = { fontFace: F, fontSize: 14, bold: true, color: WHITE, fill: { color: NAVY }, align: 'right', valign: 'middle', rtlMode: true };
  const c = (t, extra = {}) => ({ text: t, options: { fontFace: F, fontSize: 12, color: INK, align: 'right', valign: 'middle', rtlMode: true, ...extra } });
  const rows = [
    [{ text: 'דוגמאות לפעולה בשבועיים הקרובים', options: hdr }, { text: 'שאלה מנחה', options: hdr }, { text: 'הצורך', options: hdr }],
    [c('לקבוע את סדר המשימות של הבוקר; להציע דרך משלי למשימה חוזרת; שעה קבועה ללא הפרעות'), c('באילו החלטות קטנות אני יכול לבחור בעצמי?'), c('אוטונומיה', { bold: true, color: TEAL })],
    [c('משימה אחת מעט מעבר ליכולת; כלי בינה מלאכותית אחד בתחום; לתעד בסוף השבוע דבר אחד שלמדתי'), c('איזה אתגר בגובה הנכון יגרום לי להרגיש שאני מתקדם?'), c('מיומנות', { bold: true, color: AMBER })],
    [c('לזהות למי העבודה שלי עוזרת ולדבר איתו; לנסח במשפט למה התפקיד חשוב; להתנדב למשימה שמתחברת לערכים'), c('איזה חלק בעבודה מתחבר למה שחשוב לי, ואיך מגדילים אותו?'), c('משמעות', { bold: true, color: RED })],
    [c('הפסקת קפה קבועה עם עמית; להציע עזרה לפני שמבקשים; להצטרף לפרויקט חוצה מחלקות'), c('עם מי בעבודה אני רוצה קשר אמיתי יותר?'), c('שייכות', { bold: true, color: NAVY })],
  ];
  s.addTable(rows, { x: 0.6, y: 1.45, w: 12.13, colW: [5.9, 3.9, 2.33], rowH: [0.5, 0.95, 0.95, 0.95, 0.95], border: { type: 'solid', color: 'D1D5DB', pt: 1 }, fill: { color: WHITE }, margin: 0.08 });
  card(s, 0.6, 6.05, 12.13, 0.8, 'FFF4DE');
  T(s, 'מתחבר ל"שלושת סלי הכלים" מהקורס (דבדבני דקל, 2026א): רשת אנשים = שייכות, התפתחות = מיומנות, זהות מקצועית = משמעות. המאמר מוסיף אוטונומיה וראיה אמפירית', { x: 0.9, y: 6.1, w: 11.5, h: 0.7, fontSize: 13, bold: true, color: NAVY, valign: 'middle' });
  footer(s, n);
  NOTE(s, 'זה הכלי שאנחנו משאירים לכיתה. ארבעה צרכים, שאלה אחת לכל צורך, ופעולות שאפשר לעשות גם במשרה סטודנטיאלית. ניתוק והרפיה חשובים להתאוששות, אבל לפי המאמר לא משנים את תפיסת העבודה.');
}

// ================= 14. Activity =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: LIGHT };
  title(s, 'הפעלה (2 דקות): צורך אחד, פעולה אחת, מועד אחד');
  const sc = [
    ['אוטונומיה', 'איזו החלטה קטנה בעבודה או בלימודים אני לוקח לידיים כבר השבוע?', TEAL],
    ['מיומנות', 'איזה אתגר אחד, מעט מעבר ליכולת הנוכחית, אני לוקח על עצמי בשבועיים הקרובים?', AMBER],
    ['משמעות', 'למי העבודה שלי עוזרת, ומתי בפעם האחרונה דיברתי איתו?', RED],
    ['שייכות', 'עם מי בעבודה אני רוצה קשר אמיתי יותר, ומה הצעד הראשון?', NAVY],
  ];
  const cw = 2.9, gx = 0.18, x0 = 0.6, y = 1.5, ch = 2.6;
  sc.forEach(([h, d, c], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, WHITE);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 0.25, w: cw - 0.5, h: 0.55, fill: { color: c }, line: { color: c }, rectRadius: 0.1 });
    T(s, h, { x: x + 0.25, y: y + 0.25, w: cw - 0.5, h: 0.55, fontSize: 15, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, d, { x: x + 0.25, y: y + 1.0, w: cw - 0.5, h: 1.5, fontSize: 13, color: INK });
  });
  card(s, 0.6, 4.35, 12.13, 2.5, NAVY);
  T(s, 'שלושה שלבים:', { x: 0.9, y: 4.45, w: 11.5, h: 0.45, fontSize: 17, bold: true, color: AMBER });
  [['1', 'בוחרים כרטיסייה אחת (30 שניות)'], ['2', 'כותבים פעולה אחת קונקרטית ומועד לביצועה (60 שניות)'], ['3', 'משתפים את השכן במשפט אחד (30 שניות). נשמע 2 עד 3 דוגמאות מהכיתה']].forEach(([k, t], i) => {
    const yy = 5.0 + i * 0.6;
    circleNum(s, 11.85, yy + 0.05, k, AMBER, NAVY, 0.45, 14);
    T(s, t, { x: 0.9, y: yy, w: 10.8, h: 0.55, fontSize: 15, color: WHITE, valign: 'middle' });
  });
  footer(s, n);
  NOTE(s, 'לחלק כרטיסיות מודפסות או להשאיר את השקופית. אחרי השיתוף לחבר לממצא: "פעולות כאלה, לפי המאמר, מנבאות עלייה בבהירות, בשליטה ובמשמעות חצי שנה מאוחר יותר. ושימו לב: אף אחד לא בחר \'לנוח יותר\'. זה נכון, וזה גם מה שהמאמר מצא".');
}

// ================= 15. Summary =================
{
  const s = pres.addSlide(); n++;
  s.background = { color: NAVY };
  s.addShape(pres.shapes.OVAL, { x: -1.8, y: -1.8, w: 4.5, h: 4.5, fill: { color: '1D2E52' }, line: { color: '1D2E52' } });
  T(s, 'המסר שלנו לכיתה', { x: 0.8, y: 0.6, w: 11.7, h: 0.7, fontSize: 20, color: 'CAD3E5' });
  T(s, 'את חוסר הוודאות לא תמיד אפשר למנוע.\nאת הבהירות, השליטה והמשמעות בתוך התפקיד אפשר לבנות.', { x: 0.8, y: 1.3, w: 11.7, h: 1.9, fontSize: 32, bold: true, color: WHITE, valign: 'middle' });
  const tk = [['מה שעושים משנה', '924 עובדים: עיצוב תפקיד לצרכי התקרבות ניבא עבודה מובנת, בשליטה ומשמעותית יותר חצי שנה אחר כך'], ['להתקרב, לא רק להימנע', 'לנוח ולהתנתק חשוב להתאוששות, אבל לא משנה איך העבודה נתפסת'], ['המשאבים קודמים ליוזמה', 'ניהוליות מנבאת עיצוב תפקיד. בונים אותה עכשיו, לפני שהאיום מדלדל אותה']];
  const cw = 3.75, gx = 0.22, x0 = 0.8, y = 3.55, ch = 2.55;
  tk.forEach(([h, d], i) => {
    const x = W - x0 - cw - i * (cw + gx);
    card(s, x, y, cw, ch, '1D2E52');
    circleNum(s, x + cw - 0.85, y + 0.3, String(i + 1));
    T(s, h, { x: x + 0.25, y: y + 0.3, w: cw - 1.2, h: 0.55, fontSize: 16, bold: true, color: AMBER, valign: 'middle' });
    T(s, d, { x: x + 0.25, y: y + 1.0, w: cw - 0.5, h: 1.45, fontSize: 13, color: WHITE });
  });
  T(s, 'תודה! שאלות?', { x: 0.8, y: 6.35, w: 11.7, h: 0.6, fontSize: 22, bold: true, color: WHITE });
  footer(s, n, true);
  NOTE(s, 'לחזור לתוצאות הסקר מהפתיחה: "מי שסימן נמוך בשאלה 1 או 2: המאמר אומר שזה לא גזירת גורל, ושהפעולה שכתבתם עכשיו היא בדיוק הדרך לשנות את זה". לסיים במסר ולפתוח לשאלות.');
}

// ================= 16. References =================
{
  const s = pres.addSlide(); n++;
  title(s, 'רשימת מקורות (APA)');
  const refs = [
    'Cetkovská, K., Bauer, G. F., & Tušl, M. (2026). The role of needs-based job crafting in strengthening work-related sense of coherence: A two-wave panel study. Scandinavian Journal of Work and Organizational Psychology, 11(1), Article 14. https://doi.org/10.16993/sjwop.389',
    'Chung, Y. W., Im, S., Kim, J. E., & Yun, J. K. (2025). Artificial intelligence awareness, career resilience, job insecurity and behavioural outcomes. Australian Journal of Psychology, 77(1), Article 2559910. https://doi.org/10.1080/00049530.2025.2559910',
    'Hone, L. (2019). 3 secrets of resilient people [Video]. TED Conferences. https://www.ted.com/talks/lucy_hone_the_three_secrets_of_resilient_people',
  ];
  s.addText(refs.map((r, i) => ({ text: r, options: { breakLine: i < refs.length - 1, paraSpaceAfter: 6 } })), { x: 0.6, y: 1.3, w: 12.13, h: 3.2, fontFace: F, fontSize: 11, color: INK, align: 'left', valign: 'top', margin: 0, isTextBox: true });
  T(s, [
    { text: 'בנק ישראל. (2025, 11 במרץ). ההשפעה הצפויה של בינה מלאכותית יוצרת על העובדים: השלכות על המדיניות בשוק העבודה [תיבה מתוך דוח בנק ישראל לשנת 2024]. https://www.boi.org.il/publications/pressreleases/11-3-25/', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'דבדבני דקל, מ\' (2026א). מחזון ורעיון למציאות ממשית [מצגת הרצאה]. ניהול קריירה בארגונים, הקריה האקדמית אונו.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'דבדבני דקל, מ\' (2026ב). עסקים בצל הקורונה: ממשבר להזדמנות, איך עושים את זה? [מצגת הרצאה]. ניהול קריירה בארגונים, הקריה האקדמית אונו.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'דבדבני דקל, מ\' (2026ג). ניתוח הסרט "השטן לובשת פראדה" לפי תיאוריות קריירה [מצגת הרצאה]. ניהול קריירה בארגונים, הקריה האקדמית אונו.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'הקשיים של מנהלי הייטק ב-2026: גיוס עובדים מתאימים והתייעלות AI. (2026, 21 ביוני). TheMarker.', options: {} },
  ], { x: 0.6, y: 4.7, w: 12.13, h: 2.2, fontSize: 11, color: INK });
  footer(s, n);
}

const out = process.argv[2] || 'out.pptx';
pres.writeFile({ fileName: out }).then(f => console.log('wrote', f));

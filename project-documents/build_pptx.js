// Project presentation - S.A. Engineering information system (Hebrew, RTL)
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.rtlMode = true;

const TEAL = "0F4C46";      // primary dark teal (matches Figma screens)
const TEAL_MID = "1C7A6F";
const TINT = "EAF4F2";      // light teal tint for cards
const ORANGE = "E8862E";    // accent (screen buttons)
const INK = "1F2937";
const MUTED = "5B6B68";
const WHITE = "FFFFFF";
const F = "Arial";

const W = 13.33, H = 7.5;

function bg(slide, color) { slide.background = { color }; }

function title(slide, txt, opts = {}) {
  slide.addText(txt, Object.assign({
    x: 0.55, y: 0.32, w: W - 1.1, h: 0.85,
    fontFace: F, fontSize: 30, bold: true, color: TEAL,
    align: "right", rtlMode: true, margin: 0,
  }, opts));
}

function pageno(slide, n, footer) {
  slide.addText(String(n), { x: W - 0.75, y: H - 0.5, w: 0.4, h: 0.3, fontFace: F,
    fontSize: 10, color: MUTED, align: "center" });
  if (footer !== false) {
    slide.addText("פרקטיקום בניהול מערכות מידע, תשפ\"ו | ס.א הנדסה | כאמל עואד", {
      x: 0.35, y: H - 0.5, w: 5.6, h: 0.3, fontFace: F, fontSize: 9, color: "9AA7A4",
      align: "left", rtlMode: true, margin: 0 });
  }
}

function card(slide, x, y, w, h, fill) {
  slide.addShape("roundRect", { x, y, w, h, fill: { color: fill || TINT },
    rectRadius: 0.08, line: { type: "none" } });
}

function numCircle(slide, x, y, n, d, color) {
  const dd = d || 0.5;
  slide.addShape("ellipse", { x, y, w: dd, h: dd, fill: { color: color || TEAL }, line: { type: "none" } });
  slide.addText(String(n), { x, y: y - 0.02, w: dd, h: dd, fontFace: F, fontSize: dd >= 0.5 ? 16 : 13,
    bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
}

// ---------------------------------------------------------------- 1. Title
let s = pres.addSlide();
bg(s, TEAL);
s.addText("מערכת מידע לניהול בקשות לקוח,\nשיבוצי עובדים ושכר", {
  x: 0.8, y: 1.35, w: W - 1.6, h: 1.9, fontFace: F, fontSize: 40, bold: true,
  color: WHITE, align: "center", rtlMode: true });
s.addText("חברת ס.א הנדסה | שיקום, תיקון ושיפוץ מבנים", {
  x: 0.8, y: 3.3, w: W - 1.6, h: 0.55, fontFace: F, fontSize: 20, color: "BFE3DC",
  align: "center", rtlMode: true });
s.addShape("line", { x: 5.42, y: 4.15, w: 2.5, h: 0, line: { color: ORANGE, width: 2.5 } });
s.addText([
  { text: "מגיש: כאמל עואד, ת.ז 211901368", options: { breakLine: true } },
  { text: "מנחה: ד\"ר אלי וינטראוב", options: { breakLine: true } },
  { text: "פרקטיקום בניהול מערכות מידע (105002592), תשפ\"ו", options: { breakLine: false } },
], { x: 0.8, y: 4.45, w: W - 1.6, h: 1.5, fontFace: F, fontSize: 16, color: "D9ECE8",
  align: "center", rtlMode: true, paraSpaceAfter: 8 });
s.addText("אוגוסט 2026", { x: 0.8, y: 6.35, w: W - 1.6, h: 0.4, fontFace: F, fontSize: 14,
  color: "9CC9C1", align: "center" });

// ---------------------------------------------------------------- 2. The organization
s = pres.addSlide(); bg(s, WHITE);
title(s, "הארגון: ס.א הנדסה");
s.addImage({ path: "orig/media/image.jpg", x: 0.55, y: 1.35, w: 4.6, h: 5.45, rounding: true });
s.addText("נזק מבני לאחר שריפה, מאתרי העבודה של החברה", { x: 0.55, y: 6.85, w: 4.6, h: 0.35,
  fontFace: F, fontSize: 11, italic: true, color: MUTED, align: "center", rtlMode: true });

const orgRows = [
  ["מה החברה עושה", "שיקום ותיקון מבנים שנפגעו משריפות, נזקי מים, פגיעות טילים; שיפוצים כלליים ופירוק אסבסט מוסמך"],
  ["זמינות", "מענה חירום 24/7: צוות ראשוני יוצא לאתר מיד עם קבלת הדיווח"],
  ["לקוחות", "לקוחות פרטיים, עסקים, ועדי בתים וחברות ביטוח"],
  ["שרשרת העבודה", "שמאות והערכת נזק, הצעת מחיר, שיבוץ עובדים וקבלני משנה, ביצוע ומסירה"],
];
let oy = 1.4;
orgRows.forEach((r, i) => {
  card(s, 5.5, oy, 7.28, 1.22);
  s.addText(r[0], { x: 9.9, y: oy + 0.12, w: 2.72, h: 0.4, fontFace: F, fontSize: 16, bold: true,
    color: TEAL, align: "right", rtlMode: true, margin: 0.06 });
  s.addText(r[1], { x: 5.65, y: oy + 0.5, w: 6.98, h: 0.66, fontFace: F, fontSize: 13,
    color: INK, align: "right", rtlMode: true, valign: "top", margin: 0.06 });
  oy += 1.38;
});
pageno(s, 2);

// ---------------------------------------------------------------- 3. The problem
s = pres.addSlide(); bg(s, WHITE);
title(s, "ניתוח המצב הקיים ובעיותיו");
s.addText("מהראיונות עם בעל החברה והעובדים ומתצפית על יום עבודה עלו ארבע בעיות מרכזיות, כולן תוצאה של ניהול ידני ללא כלי ממוחשב מרכזי:", {
  x: 0.55, y: 1.1, w: W - 1.1, h: 0.45, fontFace: F, fontSize: 16, color: MUTED,
  align: "right", rtlMode: true, margin: 0 });
const pains = [
  ["מידע הולך לאיבוד", "בקשות נרשמות פעמיים או נשכחות, אין תיק לקוח מרוכז"],
  ["שיבוצים משתבשים", "תיאום טלפוני; עובדים וקבלנים לא מתעדכנים בזמן על שינויים"],
  ["כסף מחכה", "הצעת מחיר נבנית 2-3 ימים; חשבוניות ותשלומים במעקב ידני"],
  ["אין תמונת מצב", "להנהלה אין דוחות; חישוב שכר חודשי גוזל יום עבודה שלם"],
];
const pw = 5.9, ph = 2.15;
pains.forEach((p, i) => {
  const x = i % 2 === 0 ? W - 0.55 - pw : W - 0.55 - pw * 2 - 0.4;
  const y = 1.8 + Math.floor(i / 2) * (ph + 0.4);
  card(s, x, y, pw, ph, i === 0 ? "FBEADB" : TINT);
  numCircle(s, x + pw - 0.75, y + 0.25, i + 1, 0.5, i === 0 ? ORANGE : TEAL);
  s.addText(p[0], { x: x + 0.25, y: y + 0.25, w: pw - 1.15, h: 0.5, fontFace: F, fontSize: 18,
    bold: true, color: INK, align: "right", rtlMode: true, valign: "middle", margin: 0 });
  s.addText(p[1], { x: x + 0.25, y: y + 0.95, w: pw - 0.55, h: 1.05, fontFace: F, fontSize: 14,
    color: MUTED, align: "right", rtlMode: true, valign: "top", margin: 0 });
});
pageno(s, 3);

// ---------------------------------------------------------------- 4. Goal + measurable targets
s = pres.addSlide(); bg(s, WHITE);
title(s, "מטרת הפרויקט ויעדים מדידים");
s.addText("מטרת הפרויקט: ניתוח, איפיון ועיצוב של מערכת מידע מרכזית אחת שתנהל את מחזור הטיפול המלא בבקשת לקוח, מקליטת הפנייה ועד החשבונית והשכר, ותספק להנהלה תמונת מצב שוטפת.", {
  x: 0.55, y: 1.15, w: W - 1.1, h: 0.85, fontFace: F, fontSize: 16, color: INK,
  align: "right", rtlMode: true, margin: 0 });
const goalHeader = ["היעד לאחר המערכת", "המצב הקיים", "המדד"];
const goalRows = [
  ["5 דקות", "כ-20 דקות בממוצע", "זמן קליטת בקשה חדשה"],
  ["יום עבודה אחד", "2-3 ימי עבודה", "זמן הכנת הצעת מחיר"],
  ["אפס, רישום מרוכז אחד", "מספר מקרים בחודש", "אובדן או כפילות רישום"],
  ["עדכון מיידי במערכת", "סבב טלפונים, לעיתים באיחור", "עדכון עובד על שיבוץ"],
  ["עד שעה", "יום עבודה מלא", "הפקת דוח שכר חודשי"],
  ["זמינים בכל רגע", "אינם קיימים", "דוחות ניהוליים להנהלה"],
];
const goalData = [
  goalHeader.map(h => ({ text: h, options: { bold: true, color: WHITE, fill: { color: TEAL },
    align: "center", fontSize: 14 } })),
  ...goalRows.map((r, ri) => r.map((c, ci) => ({ text: c, options: {
    color: ci === 0 ? TEAL : INK, bold: ci === 0 || ci === 2,
    fill: { color: ri % 2 === 0 ? "F4FAF8" : WHITE },
    align: ci === 2 ? "right" : "center", fontSize: 13 } }))),
];
s.addTable(goalData, { x: 1.3, y: 2.2, w: W - 2.6, colW: [3.5, 3.6, 3.63],
  fontFace: F, rowH: 0.58, border: { pt: 0.75, color: "D5E3DF" }, valign: "middle", margin: 0.06 });
s.addText("היעדים הוגדרו יחד עם בעל החברה בשלב ההצעה, והם ישמשו למדידת הצלחת המערכת לאחר הטמעתה", {
  x: 0.55, y: 6.45, w: W - 1.1, h: 0.45, fontFace: F, fontSize: 13, italic: true, color: MUTED,
  align: "right", rtlMode: true, margin: 0 });
pageno(s, 4);

// ---------------------------------------------------------------- 5. Scope
s = pres.addSlide(); bg(s, WHITE);
title(s, "תיחום הפרויקט");
const inScope = [
  "קליטת בקשות לקוח (נזק/שיבוץ) וניהול לקוחות",
  "עיבוד בקשה, בדיקת זמינות והצעת מחיר",
  "שיוך עובדים וקבלני משנה לשיבוצים",
  "חשבוניות והזמנות חומר מספקים",
  "חישוב שכר חודשי מתוך השיבוצים",
  "דוחות הנהלה בזמן אמת",
];
const outScope = [
  "פיתוח ותכנות מלא (הפרויקט מסתיים באב-טיפוס)",
  "הנהלת חשבונות מלאה (ייצוא נתונים בלבד)",
  "ממשק ממוחשב ישיר לחברות ביטוח",
  "אפליקציית מובייל ושעון נוכחות",
  "ניהול מלאי מפורט של חומרי בניין",
  "הסבת נתונים היסטוריים",
];
const colW2 = 5.95;
card(s, W - 0.55 - colW2, 1.45, colW2, 5.5, "E9F5EC");
card(s, 0.55, 1.45, colW2, 5.5, "F6EDE9");
s.addText("בתחולת הפרויקט", { x: W - 0.55 - colW2 + 0.3, y: 1.7, w: colW2 - 0.6, h: 0.5,
  fontFace: F, fontSize: 20, bold: true, color: "1A6B3C", align: "right", rtlMode: true, margin: 0 });
s.addText("מחוץ לתחולה", { x: 0.85, y: 1.7, w: colW2 - 0.6, h: 0.5,
  fontFace: F, fontSize: 20, bold: true, color: "A6432C", align: "right", rtlMode: true, margin: 0 });
s.addText(inScope.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < inScope.length - 1 } })),
  { x: W - 0.55 - colW2 + 0.3, y: 2.35, w: colW2 - 0.65, h: 4.4, fontFace: F, fontSize: 15,
    color: INK, align: "right", rtlMode: true, paraSpaceAfter: 12, valign: "top" });
s.addText(outScope.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < outScope.length - 1 } })),
  { x: 0.85, y: 2.35, w: colW2 - 0.65, h: 4.4, fontFace: F, fontSize: 15,
    color: INK, align: "right", rtlMode: true, paraSpaceAfter: 12, valign: "top" });
pageno(s, 5);

// ---------------------------------------------------------------- 6. Methodology
s = pres.addSlide(); bg(s, WHITE);
title(s, "מתודולוגיה: מחזור חיים מלא במודל מפל המים (SDLC)");
const steps = [
  ["ייזום והצעה", "בחירת הארגון, לימוד התהליך, תיחום ותוכנית עבודה", "הצעה אושרה 28.4"],
  ["ניתוח ואיפיון", "ראיונות ותצפית; תרשימי תהליכים, DFD, ERD ורשימת מסכים", "דוח 1 הוגש 31.5"],
  ["עיצוב", "טבלאות ומפתחות, ממשקים, עץ תפריטים ועיצוב מסכים", "דוח 2 הוגש 30.6"],
  ["אב-טיפוס ואימות", "אימות מול בעל החברה ותיקונים", "יולי 2026"],
  ["סיכום והצגה", "מצגת, מסקנות והמלצות, תיק פרויקט", "אוגוסט 2026"],
];
const stw = 2.35, gap = 0.13;
steps.forEach((st, i) => {
  const x = W - 0.55 - stw - i * (stw + gap);
  const y = 1.75;
  card(s, x, y, stw, 3.3, i === 2 ? "FBEADB" : TINT);
  numCircle(s, x + stw / 2 - 0.25, y + 0.25, i + 1, 0.5, i === 2 ? ORANGE : TEAL);
  s.addText(st[0], { x: x + 0.1, y: y + 0.85, w: stw - 0.2, h: 0.65, fontFace: F, fontSize: 15,
    bold: true, color: INK, align: "center", rtlMode: true, margin: 0 });
  s.addText(st[1], { x: x + 0.12, y: y + 1.5, w: stw - 0.24, h: 1.35, fontFace: F, fontSize: 11.5,
    color: MUTED, align: "center", rtlMode: true, valign: "top", margin: 0 });
  s.addText(st[2], { x: x + 0.1, y: y + 2.85, w: stw - 0.2, h: 0.35, fontFace: F, fontSize: 11,
    bold: true, color: i === 2 ? ORANGE : TEAL_MID, align: "center", rtlMode: true, margin: 0 });
});
s.addText("כל שלב מסתיים בתוצר מאושר לפני המעבר לשלב הבא. שיטות איסוף המידע: ראיונות חצי-מובנים, תצפית ישירה וניתוח מסמכים, עם אימות כל תוצר מול בעל החברה.", {
  x: 0.55, y: 5.35, w: W - 1.1, h: 0.7, fontFace: F, fontSize: 14, color: INK,
  align: "right", rtlMode: true, margin: 0 });
s.addText("כלים: draw.io לתרשימים | Figma לעיצוב המסכים | GanttProject לגאנט", {
  x: 0.55, y: 6.15, w: W - 1.1, h: 0.5, fontFace: F, fontSize: 14, bold: true, color: TEAL,
  align: "right", rtlMode: true, margin: 0 });
pageno(s, 6);

// ---------------------------------------------------------------- 7. Gantt
s = pres.addSlide(); bg(s, WHITE);
title(s, "תוכנית העבודה ותרשים הגאנט, סטטוס 30.6.2026");
s.addText("התוכנית כוללת 31 פעילויות בארבעה שלבים, עם תלות בין הפעילויות ומרווחי ביטחון לפני כל הגשה. בירוק: מה שבוצע; בתכלת: המתוכנן להמשך. כל מועדי ההגשה נשמרו.", {
  x: 0.55, y: 1.08, w: W - 1.1, h: 0.6, fontFace: F, fontSize: 14, color: MUTED,
  align: "right", rtlMode: true, margin: 0 });
s.addImage({ path: "gantt_status.png", x: 1.55, y: 1.75, w: 10.23, h: 5.35 });
pageno(s, 7);

// ---------------------------------------------------------------- 8. Analysis: process
s = pres.addSlide(); bg(s, WHITE);
title(s, "איפיון: התהליך הארגוני המרכזי");
s.addImage({ path: "process.png", x: 1.95, y: 1.35, w: 9.43, h: 5.17 });
s.addText("התהליך שמופה בראיונות ובתצפית: מקבלת הפנייה, דרך השמאות והצעת המחיר, ועד הביצוע, המסירה והגבייה. המערכת מתעדת ומנהלת כל תחנה בתהליך; העבודה הפיזית עצמה נשארת מחוץ לתחולה.", {
  x: 0.85, y: 6.6, w: W - 1.7, h: 0.7, fontFace: F, fontSize: 13, color: MUTED,
  align: "center", rtlMode: true, margin: 0 });
pageno(s, 8, false);

// ---------------------------------------------------------------- 9. Analysis: DFD
s = pres.addSlide(); bg(s, WHITE);
title(s, "איפיון: תרשים זרימת הנתונים (DFD)");
card(s, 0.55, 1.4, 3.4, 5.6, TINT);
s.addText("מסלול הבקשה במערכת", { x: 0.75, y: 1.65, w: 3.0, h: 0.6, fontFace: F, fontSize: 16,
  bold: true, color: TEAL, align: "right", rtlMode: true, margin: 0 });
s.addText([
  { text: "קליטת פנייה מהלקוח", options: { bullet: true, breakLine: true } },
  { text: "עיבוד פרטי הנזק / השיבוץ", options: { bullet: true, breakLine: true } },
  { text: "הכנת הצעת מחיר ללקוח", options: { bullet: true, breakLine: true } },
  { text: "אישור: חוזה, שיבוץ ושמירה במערכת", options: { bullet: true, breakLine: true } },
  { text: "דחייה: סגירת התיק ותיעוד", options: { bullet: true, breakLine: false } },
], { x: 0.75, y: 2.35, w: 3.0, h: 4.4, fontFace: F, fontSize: 14, color: INK,
  align: "right", rtlMode: true, paraSpaceAfter: 12, valign: "top" });
s.addImage({ path: "pdfimg/p09_06_1090x608.png", x: 4.25, y: 1.85, w: 8.5, h: 4.74 });
pageno(s, 9);

// ---------------------------------------------------------------- 10. Analysis: ERD
s = pres.addSlide(); bg(s, WHITE);
title(s, "איפיון: מודל הנתונים (ERD)");
s.addImage({ path: "pdfimg/p10_07_1306x758.png", x: 2.2, y: 1.35, w: 8.93, h: 5.18 });
s.addText("התרשים מגדיר את ישויות הליבה, עובדים, אתרים/קבלנים, שיבוצים, חשבוניות ושכר, את תכונותיהן ואת הקשרים ביניהן. בשלב העיצוב נגזר ממנו מבנה הטבלאות והמפתחות שיוצג בהמשך.", {
  x: 0.55, y: 6.7, w: W - 1.1, h: 0.45, fontFace: F, fontSize: 14, italic: true, color: MUTED,
  align: "center", rtlMode: true, margin: 0 });
pageno(s, 10, false);

// ---------------------------------------------------------------- 11. Design: DB tables
s = pres.addSlide(); bg(s, WHITE);
title(s, "עיצוב: טבלאות בסיס הנתונים ומפתחות הגישה");
const tblHeader = ["שדות עיקריים", "מפתחות זרים (FK)", "מפתח ראשי (PK)", "טבלה"];
const tblRows = [
  ["שם, טלפון, מייל, כתובת, סוג לקוח", "אין", "קוד לקוח", "לקוחות"],
  ["סוג, תאריך, תיאור, סטטוס, עלויות", "קוד לקוח, קוד אתר", "מספר בקשה", "בקשות"],
  ["שם אתר, כתובת, איש קשר", "אין", "קוד אתר", "אתרים/קבלנים"],
  ["שם, ת.ז, מקצוע, סוג העסקה", "אין", "קוד עובד", "עובדים"],
  ["תאריכי תחילה וסיום, סטטוס", "קוד עובד, קוד אתר, מס׳ בקשה", "קוד שיבוץ", "שיבוצים"],
  ["תאריך, סוג, סכום, סטטוס תשלום", "קוד אתר, קוד לקוח, קוד ספק", "מספר חשבונית", "חשבוניות והזמנות"],
  ["ימי עבודה, ברוטו, ניכויים, נטו", "קוד עובד", "קוד עובד + חודש", "שכר"],
];
const tableData = [
  tblHeader.map(h => ({ text: h, options: { bold: true, color: WHITE, fill: { color: TEAL },
    align: "center", fontSize: 13 } })),
  ...tblRows.map((r, ri) => r.map((c, ci) => ({ text: c, options: {
    color: INK, fill: { color: ri % 2 === 0 ? "F4FAF8" : WHITE },
    align: ci === 3 ? "right" : "center", bold: ci === 3, fontSize: 12 } }))),
];
s.addTable(tableData, { x: 0.55, y: 1.45, w: W - 1.1, colW: [4.3, 3.2, 2.4, 2.33],
  fontFace: F, rowH: 0.62, border: { pt: 0.75, color: "D5E3DF" }, valign: "middle", margin: 0.06 });
s.addText("המודל חודד בשלב העיצוב: נוספו טבלאות לקוחות ובקשות, ולכל חשבונית הוגדר מספר ייחודי", {
  x: 0.55, y: 6.75, w: W - 1.1, h: 0.45, fontFace: F, fontSize: 13, italic: true, color: MUTED,
  align: "right", rtlMode: true, margin: 0 });
pageno(s, 11);

// ---------------------------------------------------------------- 12. Design: menu tree
s = pres.addSlide(); bg(s, WHITE);
title(s, "עיצוב: עץ התפריטים לפי תפקידי המשתמשים");
s.addImage({ path: "pdfimg/p14_08_1141x652.png", x: 2.15, y: 1.35, w: 9.03, h: 5.16 });
s.addText("חמישה ענפים תפעוליים הנגזרים מהטבלאות ומהתהליך. הגישה נקבעת לפי תפקיד: נציג השירות רואה את ענף הלקוחות, מנהל העבודה גם את העובדים והאתרים, וההנהלה את הכול, כולל שכר וכספים.", {
  x: 0.55, y: 6.7, w: W - 1.1, h: 0.6, fontFace: F, fontSize: 13, color: MUTED,
  align: "center", rtlMode: true, margin: 0 });
pageno(s, 12, false);

// ---------------------------------------------------------------- 13. Design: screens
s = pres.addSlide(); bg(s, WHITE);
title(s, "עיצוב: מסכי המערכת (Figma)");
const shots = [
  ["pdfimg/p15_09_900x695.png", "קליטת בקשה חדשה"],
  ["pdfimg/p16_10_900x646.png", "הצעת מחיר ללקוח"],
  ["pdfimg/p17_12_900x593.png", "שיוך עובד לשיבוץ"],
  ["pdfimg/p18_13_901x724.png", "דוח שכר חודשי"],
];
const iw = 3.62;
shots.forEach((sh, i) => {
  const x = W - 0.55 - iw - (i % 2) * (iw + 2.6);
  const y = 1.3 + Math.floor(i / 2) * 2.98;
  const ih = 2.45;
  s.addImage({ path: sh[0], x, y, w: iw, h: ih, rounding: false, shadow: { type: "outer", blur: 6, offset: 2, angle: 90, color: "9AB5AF", opacity: 0.5 } });
  s.addText(sh[1], { x: x - 2.45, y: y + ih / 2 - 0.3, w: 2.3, h: 0.6, fontFace: F, fontSize: 15,
    bold: true, color: TEAL, align: "right", rtlMode: true, valign: "middle", margin: 0 });
});
s.addText("שני מסכים נוספים: עיבוד בקשה וניהול חשבוניות; כל ששת המסכים עוצבו עיצוב מלא", {
  x: 0.55, y: 7.05, w: W - 1.1, h: 0.38, fontFace: F, fontSize: 12, italic: true, color: MUTED,
  align: "center", rtlMode: true, margin: 0 });
pageno(s, 13, false);

// ---------------------------------------------------------------- 14. Complexity + benefit
s = pres.addSlide(); bg(s, WHITE);
title(s, "מורכבות הפרויקט והתועלת לחברה");
s.addText("מקורות המורכבות", { x: W - 6.6, y: 1.35, w: 6.05, h: 0.5, fontFace: F, fontSize: 19,
  bold: true, color: TEAL, align: "right", rtlMode: true, margin: 0 });
s.addText([
  { text: "שבע טבלאות קשורות ותהליך שחוצה את כל הארגון", options: { bullet: true, breakLine: true } },
  { text: "שישה גורמי חוץ: לקוחות, ביטוח, ספקים, קבלני משנה", options: { bullet: true, breakLine: true } },
  { text: "עבודות רבות במקביל בסביבת חירום", options: { bullet: true, breakLine: true } },
  { text: "ארגון אמיתי: ראיונות, תצפית ואימות בשטח", options: { bullet: true, breakLine: false } },
], { x: W - 6.6, y: 1.95, w: 6.05, h: 2.6, fontFace: F, fontSize: 15, color: INK,
  align: "right", rtlMode: true, paraSpaceAfter: 10, valign: "top" });
s.addText("התועלת במדדים", { x: 0.55, y: 1.35, w: 6.05, h: 0.5, fontFace: F, fontSize: 19,
  bold: true, color: TEAL, align: "right", rtlMode: true, margin: 0 });
s.addText([
  { text: "פחות שעות ניהול ידני ופחות טעויות חיוב", options: { bullet: true, breakLine: true } },
  { text: "גבייה מהירה יותר ותזרים בריא", options: { bullet: true, breakLine: true } },
  { text: "יכולת לטפל ביותר עבודות במקביל", options: { bullet: true, breakLine: true } },
  { text: "שקיפות מלאה להנהלה ולרואה החשבון", options: { bullet: true, breakLine: false } },
], { x: 0.55, y: 1.95, w: 6.05, h: 2.6, fontFace: F, fontSize: 15, color: INK,
  align: "right", rtlMode: true, paraSpaceAfter: 10, valign: "top" });
card(s, 0.55, 4.75, W - 1.1, 2.1, TINT);
s.addText("סטטוס הפרויקט", { x: 0.85, y: 4.95, w: W - 1.7, h: 0.45, fontFace: F, fontSize: 16,
  bold: true, color: TEAL, align: "right", rtlMode: true, margin: 0 });
s.addText("ההצעה, האיפיון והעיצוב הושלמו והוגשו במועדם. אב-הטיפוס אומת מול בעל החברה ביולי, ותיק הפרויקט המלא יוגש עד 31.8.2026.", {
  x: 0.85, y: 5.45, w: W - 1.7, h: 1.2, fontFace: F, fontSize: 15, color: INK,
  align: "right", rtlMode: true, margin: 0 });
pageno(s, 14);

// ---------------------------------------------------------------- 15. Conclusions
s = pres.addSlide(); bg(s, TEAL);
s.addText("מסקנות והמלצות להמשך", { x: 0.8, y: 0.55, w: W - 1.6, h: 0.8, fontFace: F,
  fontSize: 30, bold: true, color: WHITE, align: "right", rtlMode: true, margin: 0 });
s.addText("מסקנות עיקריות", { x: W - 6.85, y: 1.6, w: 6.05, h: 0.5, fontFace: F, fontSize: 18,
  bold: true, color: "F5B87A", align: "right", rtlMode: true, margin: 0 });
s.addText([
  { text: "ראיונות ותצפית בשטח חשפו צרכים שלא עלו מהתיאור הראשוני, ושינו את מודל הנתונים", options: { bullet: true, breakLine: true } },
  { text: "עיגון התוכנית באבני הדרך של הקורס אפשר עמידה בכל המועדים", options: { bullet: true, breakLine: true } },
  { text: "אימות כל תוצר מול בעל החברה חסך תיקונים מאוחרים ויקרים", options: { bullet: true, breakLine: false } },
], { x: W - 6.85, y: 2.2, w: 6.05, h: 3.2, fontFace: F, fontSize: 15, color: "E8F2F0",
  align: "right", rtlMode: true, paraSpaceAfter: 12, valign: "top" });
s.addText("פיתוחים עתידיים מומלצים", { x: 0.8, y: 1.6, w: 5.6, h: 0.5, fontFace: F, fontSize: 18,
  bold: true, color: "F5B87A", align: "right", rtlMode: true, margin: 0 });
s.addText([
  { text: "פיתוח ותכנות המערכת על בסיס העיצוב המאושר", options: { bullet: true, breakLine: true } },
  { text: "פורטל לקוח להגשת בקשה ומעקב סטטוס עצמאי", options: { bullet: true, breakLine: true } },
  { text: "מסך ייעודי לציוד ולחברות העזרה", options: { bullet: true, breakLine: true } },
  { text: "ממשק ישיר לחברות הביטוח ואפליקציה לעובדי השטח", options: { bullet: true, breakLine: false } },
], { x: 0.8, y: 2.2, w: 5.6, h: 3.2, fontFace: F, fontSize: 15, color: "E8F2F0",
  align: "right", rtlMode: true, paraSpaceAfter: 12, valign: "top" });
s.addShape("line", { x: 5.42, y: 5.9, w: 2.5, h: 0, line: { color: ORANGE, width: 2.5 } });
s.addText("תודה על ההקשבה | כאמל עואד", { x: 0.8, y: 6.15, w: W - 1.6, h: 0.6, fontFace: F,
  fontSize: 20, bold: true, color: WHITE, align: "center", rtlMode: true });
pageno(s, 15);

pres.writeFile({ fileName: "presentation.pptx" }).then(() => console.log("presentation.pptx written"));

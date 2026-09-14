const pptxgen = require("pptxgenjs");
const fs = require("fs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.rtlMode = true;
pres.lang = "he-IL";

const NAVY = "1F3A5F", LIGHT = "EAF0F7", ORANGE = "E8892B", INK = "22303F", MUTED = "5B6B7C", WHITE = "FFFFFF";
const FONT = "Arial";
const logo = "image/jpeg;base64," + fs.readFileSync("logo.jpg").toString("base64");

const T = (slide, text, o) => slide.addText(text, Object.assign({ isTextBox: true, fontFace: FONT, rtlMode: true, lang: "he-IL", align: "right", color: INK, margin: 0, valign: "top" }, o));
const title = (slide, text) => T(slide, text, { x: 0.5, y: 0.35, w: 9, h: 0.8, fontSize: 32, bold: true, color: NAVY });
const footer = (slide, n) => {
  T(slide, "רווחה נפשית ולגיטימיות הסגל בקרב אסירים שפוטים", { x: 0.5, y: 5.2, w: 7, h: 0.3, fontSize: 10, color: MUTED });
  slide.addText(String(n), { isTextBox: true, x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: MUTED, align: "left", fontFace: FONT, margin: 0 });
};
const bullets = (arr, o = {}) => arr.map((t, i) => ({ text: t, options: Object.assign({ bullet: true, breakLine: i < arr.length - 1, paraSpaceAfter: 8 }, o) }));

// ---------- 1. title ----------
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.35, fill: { color: WHITE } });
  s.addImage({ data: logo, x: 6.9, y: 0.25, w: 2.6, h: 1.03 });
  T(s, "המכללה האקדמית אשקלון | החוג לקרימינולוגיה", { x: 0.5, y: 0.35, w: 6.2, h: 0.35, fontSize: 14, bold: true, color: NAVY });
  T(s, "סמינריון: תנאי כליאה של אסירים פליליים בישראל ובעולם", { x: 0.5, y: 0.7, w: 6.2, h: 0.3, fontSize: 12, color: MUTED });
  T(s, "מרצה: ד\"ר יוחנן ועקנין", { x: 0.5, y: 0.98, w: 6.2, h: 0.3, fontSize: 12, color: MUTED });
  T(s, "רווחה נפשית ותפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בישראל", { x: 0.6, y: 1.65, w: 8.8, h: 1.1, fontSize: 28, bold: true, color: WHITE, valign: "middle" });
  T(s, "שאלת המחקר: באיזו מידה קיים קשר בין רווחה נפשית לבין תפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בלבד?", { x: 0.6, y: 2.85, w: 8.8, h: 0.9, fontSize: 16, color: "CFDBEA", valign: "middle" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 3.95, w: 8.8, h: 1.2, fill: { color: "2B4C78" }, line: { color: "2B4C78" }, rectRadius: 0.12 });
  T(s, "מגישות:", { x: 0.85, y: 4.05, w: 8.3, h: 0.3, fontSize: 13, bold: true, color: ORANGE });
  T(s, "שם: ______________________   ת.ז.: ______________", { x: 0.85, y: 4.38, w: 8.3, h: 0.32, fontSize: 14, color: WHITE });
  T(s, "שם: ______________________   ת.ז.: ______________", { x: 0.85, y: 4.72, w: 8.3, h: 0.32, fontSize: 14, color: WHITE });
  s.addNotes("שקף פתיחה: להציג את שאלת המחקר ואת המגישות.");
}

// ---------- 2. background ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "רקע");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.3, w: 5.9, h: 3.7, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  T(s, bullets([
    "הסדר באגף אינו מתקיים בכוח בלבד אלא נשען על תחושת האסירים שהמשטר הוגן ושהסגל ראוי לציות (Sparks & Bottoms, 1995).",
    "לגיטימיות: המידה שבה האסיר תופס את הסגל כמכבד, נגיש והוגן בטיפול בבקשותיו.",
    "בישראל כ-80% ממקומות הכליאה היו קטנים מתקן 4.5 מ\"ר לאסיר במאי 2019 (יכימוביץ-כהן, 2020).",
    "בסתיו 2021 נערך סקר תנאי המחיה הראשון בהיקפו בשב\"ס: 2,363 שפוטים ו-1,427 עצורים (ועקנין, 2024).",
    "הסקר מצא שהלגיטימיות ממתנת את הקשר בין תנאי המחיה לשביעות הרצון מפעילויות השיקום.",
    "המחקר הנוכחי בוחן חוט אחד מאותו מערך: הקשר בין רווחה נפשית ללגיטימיות בקרב שפוטים.",
  ]), { x: 0.75, y: 1.5, w: 5.45, h: 3.35, fontSize: 12, color: INK, valign: "top" });
  // right-side stat callouts
  const stat = (y, big, small) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.7, y, w: 2.8, h: 1.1, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.1 });
    s.addText(big, { isTextBox: true, x: 6.8, y: y + 0.08, w: 2.6, h: 0.6, fontSize: 30, bold: true, color: ORANGE, align: "center", fontFace: FONT, margin: 0 });
    T(s, small, { x: 6.8, y: y + 0.68, w: 2.6, h: 0.35, fontSize: 11, color: "CFDBEA", align: "center" });
  };
  stat(1.3, "3,790", "משתתפים בסקר המקורי");
  stat(2.6, "2,379", "שפוטים בניתוח הנוכחי");
  stat(3.9, "9", "תחומי תנאי מחיה בשאלון");
  footer(s, 2);
}

// ---------- 3. literature ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "סקירת ספרות");
  const rows = [
    ["ועקנין (2024)", "סקר שב\"ס, 3,790 כלואים: הלגיטימיות ממתנת את הקשר בין תנאי מחיה לשביעות רצון משיקום; שפוטים גבוהים מעצורים בלגיטימיות."],
    ["Sparks & Bottoms (1995)", "לגיטימיות בבתי סוהר נבנית מהוגנות פרוצדורלית, סדירות השירות ואיכות אנושית בשגרה."],
    ["Brunton-Smith & McCarthy (2016)", "יותר מ-3,000 אסירים באנגליה: ההוגנות הפרוצדורלית היא המנבא החזק ביותר של לגיטימיות."],
    ["Sargeant et al. (2026)", "מערך אורך באוסטרליה: צדק פרוצדורלי מעלה רווחה נפשית, והיחסים עם הסגל מתווכים את הקשר."],
    ["Auty & Liebling (2024)", "518 סקרי MQPL: מתחת לסף 3.05 ביחסי סגל-אסירים עולים בחדות שיעורי האלימות והפגיעה העצמית."],
  ];
  rows.forEach((r, i) => {
    const y = 1.3 + i * 0.76;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y, w: 9, h: 0.66, fill: { color: i % 2 ? WHITE : LIGHT }, line: { color: LIGHT }, rectRadius: 0.08 });
    s.addShape(pres.shapes.OVAL, { x: 8.95, y: y + 0.15, w: 0.36, h: 0.36, fill: { color: ORANGE }, line: { color: ORANGE } });
    s.addText(String(i + 1), { isTextBox: true, x: 8.95, y: y + 0.15, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle", fontFace: FONT, margin: 0 });
    s.addText(r[0], { isTextBox: true, x: 6.55, y: y + 0.08, w: 2.3, h: 0.5, fontSize: 12, bold: true, color: NAVY, align: "right", valign: "middle", fontFace: FONT, margin: 0, rtlMode: true });
    T(s, r[1], { x: 0.7, y: y + 0.06, w: 5.75, h: 0.55, fontSize: 11.5, color: INK, valign: "middle" });
  });
  footer(s, 3);
}

// ---------- 4. research question ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "שאלת המחקר");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.3, w: 9, h: 1.1, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.12 });
  T(s, "באיזו מידה קיים קשר בין רווחה נפשית לבין תפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בלבד?", { x: 0.8, y: 1.4, w: 8.4, h: 0.9, fontSize: 18, bold: true, color: WHITE, valign: "middle" });
  const card = (x, w, head, body) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.65, w, h: 2.35, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
    T(s, head, { x: x + 0.2, y: 2.78, w: w - 0.4, h: 0.4, fontSize: 14, bold: true, color: ORANGE });
    T(s, body, { x: x + 0.2, y: 3.2, w: w - 0.4, h: 1.7, fontSize: 12, color: INK, valign: "top" });
  };
  card(6.6, 2.9, "משתנה תלוי", [
    { text: "לגיטימיות הסגל", options: { bold: true, breakLine: true } },
    { text: "3 פריטים: אפשר לדבר עם הסוהרים, יחס מכבד, טיפול בבקשות. סולם 1 עד 5, α = 0.67", options: {} },
  ]);
  card(3.55, 2.9, "משתנה בלתי תלוי", [
    { text: "רווחה נפשית", options: { bold: true, breakLine: true } },
    { text: "5 פריטים: בריאות גופנית ונפשית, שיפור מאז המאסר, שמחה ושביעות רצון מהחיים. סולם 1 עד 5, α = 0.81", options: {} },
  ]);
  card(0.5, 2.9, "השערה ושיטה", [
    { text: "קשר חיובי מובהק: ככל שהרווחה גבוהה יותר, הלגיטימיות גבוהה יותר.", options: { breakLine: true } },
    { text: "נתונים סינתטיים המבוססים על סקר שב\"ס 2021, שפוטים בלבד (N = 2,379). ניתוח ב-SPSS: תיאורי, מהימנות, מתאם פירסון וספירמן.", options: {} },
  ]);
  footer(s, 4);
}

// ---------- 5. findings: population ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "ממצאים: אוכלוסיית המחקר (N = 2,379)");
  // bar chart: background variables
  s.addChart(pres.charts.BAR, [{
    name: "אחוז מהשפוטים",
    labels: ["גברים", "יהודים", "לא יהודים", "מאסר ראשון", "מאסר שני", "מאסר שלישי ומעלה", "מעל 3 חודשים באגף", "במסלול שיקום"],
    values: [96.8, 47.8, 52.2, 48.8, 22.2, 29.0, 68.3, 20.4],
  }], {
    x: 3.6, y: 1.25, w: 5.9, h: 3.8, barDir: "bar", chartColors: [NAVY],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0.0"%"', dataLabelFontSize: 10, dataLabelColor: INK,
    catAxisLabelFontSize: 11, catAxisLabelColor: INK, catAxisLabelFontFace: FONT, valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showLegend: false, valAxisMaxVal: 110, catAxisOrientation: "maxMin",
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.25, w: 2.9, h: 3.8, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  T(s, "מי הם השפוטים?", { x: 0.7, y: 1.4, w: 2.5, h: 0.4, fontSize: 14, bold: true, color: ORANGE });
  T(s, bullets([
    "גיל ממוצע 37.9 (טווח 18 עד 82)",
    "כמחצית במאסרם הראשון",
    "שני שלישים שוהים באגף מעל שלושה חודשים",
    "77 נשים בלבד (3.2%)",
    "התפלגות דומה לסקר המקורי (ועקנין, 2024)",
  ], { paraSpaceAfter: 6 }), { x: 0.7, y: 1.85, w: 2.55, h: 3.1, fontSize: 12, color: INK });
  footer(s, 5);
}

// ---------- 6. findings: correlation ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "ממצאים: הקשר בין רווחה נפשית ללגיטימיות");
  // big stat
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.5, y: 1.25, w: 3, h: 1.55, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.12 });
  s.addText("r = 0.32", { isTextBox: true, x: 6.6, y: 1.32, w: 2.8, h: 0.75, fontSize: 40, bold: true, color: ORANGE, align: "center", fontFace: FONT, margin: 0 });
  T(s, "מתאם פירסון, p < 0.001, N = 2,344\nספירמן rs = 0.34", { x: 6.6, y: 2.05, w: 2.8, h: 0.65, fontSize: 11, color: "CFDBEA", align: "center" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.5, y: 2.95, w: 3, h: 2.1, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.12 });
  T(s, bullets([
    "ממוצע לגיטימיות 4.24 (SD 0.83); ממוצע רווחה 3.78 (SD 0.87)",
    "קשר חיובי בכל שלושת פריטי הלגיטימיות (0.25 עד 0.29)",
    "הרווחה חולקת עם הלגיטימיות כ-10% מהשונות",
    "ההשערה אוששה: ככל שהרווחה עולה, הלגיטימיות עולה, ולהפך",
  ], { paraSpaceAfter: 5 }), { x: 6.65, y: 3.08, w: 2.75, h: 1.9, fontSize: 11, color: INK });
  // chart: wellbeing by legitimacy level
  s.addChart(pres.charts.BAR, [{
    name: "רווחה נפשית ממוצעת",
    labels: ["לגיטימיות נמוכה (עד 3.5)", "לגיטימיות בינונית (3.5 עד 4.5)", "לגיטימיות גבוהה (מעל 4.5)"],
    values: [3.34, 3.65, 4.05],
  }], {
    x: 0.5, y: 1.25, w: 5.8, h: 3.8, barDir: "col", chartColors: [ORANGE], barGapWidthPct: 60,
    showTitle: true, title: "רווחה נפשית ממוצעת לפי רמת לגיטימיות (סולם 1 עד 5)", titleFontSize: 12, titleColor: NAVY, titleFontFace: FONT,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00", dataLabelFontSize: 12, dataLabelColor: INK,
    catAxisLabelFontSize: 10, catAxisLabelColor: INK, valAxisMinVal: 1, valAxisMaxVal: 5, valAxisLabelFontSize: 10, valAxisLabelColor: MUTED,
    valGridLine: { color: "DDE3EA", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false,
  });
  s.addNotes("פער של כ-0.7 נקודות ברווחה בין הקבוצה הנמוכה לגבוהה, כ-80% מסטיית תקן. n: 427 / 809 / 1,108.");
  footer(s, 6);
}

pres.writeFile({ fileName: "seminar_deck.pptx" }).then(f => console.log("written", f));

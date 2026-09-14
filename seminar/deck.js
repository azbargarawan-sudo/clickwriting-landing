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
const title = (slide, text) => T(slide, text, { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 30, bold: true, color: NAVY });
const sub = (slide, text, x, y, w) => T(slide, text, { x, y, w, h: 0.35, fontSize: 14, bold: true, color: ORANGE });
const para = (slide, text, x, y, w, h, size = 12) => T(slide, text, { x, y, w, h, fontSize: size, color: INK, align: "justify", lineSpacingMultiple: 1.15 });
const footer = (slide, n) => {
  T(slide, "רווחה נפשית ותפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בישראל", { x: 0.5, y: 5.2, w: 7.5, h: 0.3, fontSize: 10, color: MUTED });
  slide.addText(String(n), { isTextBox: true, x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: MUTED, align: "left", fontFace: FONT, margin: 0 });
};

// ---------- 1. title ----------
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.35, fill: { color: WHITE } });
  s.addImage({ data: logo, x: 6.9, y: 0.25, w: 2.6, h: 1.03 });
  T(s, "המכללה האקדמית אשקלון, החוג לקרימינולוגיה", { x: 0.5, y: 0.35, w: 6.2, h: 0.35, fontSize: 14, bold: true, color: NAVY });
  T(s, "סמינריון: תנאי כליאה של אסירים פליליים בישראל ובעולם", { x: 0.5, y: 0.7, w: 6.2, h: 0.3, fontSize: 12, color: MUTED });
  T(s, "מרצה: ד\"ר יוחנן ועקנין", { x: 0.5, y: 0.98, w: 6.2, h: 0.3, fontSize: 12, color: MUTED });
  T(s, "רווחה נפשית ותפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בישראל", { x: 0.6, y: 1.6, w: 8.8, h: 1.05, fontSize: 26, bold: true, color: WHITE, valign: "middle" });
  T(s, "שאלת המחקר: באיזו מידה קיים קשר בין רווחה נפשית לבין תפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בלבד?", { x: 0.6, y: 2.75, w: 8.8, h: 0.9, fontSize: 15, color: "CFDBEA", valign: "middle" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 3.85, w: 8.8, h: 1.2, fill: { color: "2B4C78" }, line: { color: "2B4C78" }, rectRadius: 0.12 });
  T(s, "מגישות:", { x: 0.85, y: 3.95, w: 8.3, h: 0.3, fontSize: 13, bold: true, color: ORANGE });
  T(s, "שם: ______________________   ת.ז.: ______________", { x: 0.85, y: 4.28, w: 8.3, h: 0.32, fontSize: 14, color: WHITE });
  T(s, "שם: ______________________   ת.ז.: ______________", { x: 0.85, y: 4.62, w: 8.3, h: 0.32, fontSize: 14, color: WHITE });
}

// ---------- 2. background ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "רקע");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.15, w: 6.0, h: 3.85, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  sub(s, "לגיטימיות כתנאי לסדר בבית הסוהר", 0.75, 1.3, 5.5);
  para(s, "בית הסוהר הוא מוסד שבו סמכות הסגל כמעט מוחלטת, ובכל זאת הסדר היומיומי באגף תלוי בשיתוף פעולה של האסירים. ספרקס ובוטומס (1995) טענו שסדר בבתי סוהר אינו מתקיים בכוח בלבד אלא נשען על תחושת האסירים שהמשטר הוגן ושמי שמפעיל אותו ראוי לציות. תחושה זו היא הלגיטימיות: המידה שבה האסיר תופס את הסגל כמכבד, כנגיש וכהוגן בטיפול בבקשותיו.", 0.75, 1.7, 5.5, 1.55);
  sub(s, "ההקשר הישראלי", 0.75, 3.3, 5.5);
  para(s, "במאי 2019 כ-80 אחוזים ממקומות הכליאה בישראל היו קטנים מתקן 4.5 מטרים רבועים לאסיר (יכימוביץ-כהן, 2020). על רקע זה נערך בסתיו 2021 סקר תנאי המחיה הראשון בהיקפו בשירות בתי הסוהר, ובו נמצא שהלגיטימיות ממתנת את הקשר בין תנאי המחיה לשביעות הרצון מפעילויות השיקום (ועקנין, 2024). המחקר הנוכחי בוחן מאותו מערך את הקשר הישיר בין רווחה נפשית ללגיטימיות בקרב שפוטים.", 0.75, 3.7, 5.5, 1.3);
  const stat = (y, big, small) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.8, y, w: 2.7, h: 1.12, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.1 });
    s.addText(big, { isTextBox: true, x: 6.9, y: y + 0.08, w: 2.5, h: 0.6, fontSize: 30, bold: true, color: ORANGE, align: "center", fontFace: FONT, margin: 0 });
    T(s, small, { x: 6.9, y: y + 0.7, w: 2.5, h: 0.35, fontSize: 11, color: "CFDBEA", align: "center" });
  };
  stat(1.15, "3,790", "משתתפים בסקר שב\"ס 2021");
  stat(2.52, "2,379", "שפוטים בניתוח הנוכחי");
  stat(3.88, "9", "תחומי תנאי מחיה בשאלון");
  footer(s, 2);
}

// ---------- 3. literature ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "סקירת ספרות");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.15, w: 9, h: 1.85, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  sub(s, "הסתגלות למאסר ורווחה נפשית", 0.75, 1.27, 8.5);
  para(s, "הספרות עברה מתיאור כללי של כאבי המאסר לבחינה של ההבדלים בין בתי סוהר. אוטי וליבלינג (2024) זיהו על בסיס 518 סקרי איכות חיים באנגליה שמתחת לסף של 3.05 ביחסי סגל ואסירים עולים בחדות שיעורי האלימות והפגיעה העצמית, וון גינקן ואחרים (2019) מצאו בקרב 4,538 אסירים בהולנד שתפיסות אישיות של אוטונומיה וביטחון קשורות לרווחה. במערך אורך באוסטרליה הראו סרג'נט ואחרים (2026) שצדק פרוצדורלי מעלה את הרווחה הנפשית, ושהיחסים עם הסגל הם המנגנון המתווך.", 0.75, 1.65, 8.5, 1.3, 11.5);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.15, w: 9, h: 1.9, fill: { color: WHITE }, line: { color: "C9D6E4", width: 1 }, rectRadius: 0.1 });
  sub(s, "לגיטימיות של סגל הכליאה", 0.75, 3.27, 8.5);
  para(s, "ברנטון-סמית ומקארתי (2016) ניתחו סקר של יותר מ-3,000 אסירים באנגליה ובוויילס ומצאו שההוגנות הפרוצדורלית היא המנבא החזק ביותר של לגיטימיות, ופרנקה ואחרים (2010) הראו בניסוי אקראי שדלות סביבתית וחוויות שליליות הן שמכרסמות בלגיטימיות במהלך המאסר. בישראל מצא ועקנין (2024) לגיטימיות גבוהה יחסית, גבוהה יותר בקרב שפוטים מאשר בקרב עצורים, והציע לראות בה כלי ניהולי באגף. הקשר הישיר בין רווחה נפשית ללגיטימיות בקרב שפוטים טרם נבחן, וזהו הפער שהמחקר הנוכחי מבקש למלא.", 0.75, 3.65, 8.5, 1.35, 11.5);
  footer(s, 3);
}

// ---------- 4. research question ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "שאלת המחקר והשערת המחקר");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.15, w: 9, h: 1.0, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.12 });
  T(s, "באיזו מידה קיים קשר בין רווחה נפשית לבין תפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בלבד?", { x: 0.8, y: 1.22, w: 8.4, h: 0.86, fontSize: 17, bold: true, color: WHITE, valign: "middle" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.1, y: 2.35, w: 4.4, h: 2.7, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  sub(s, "משתני המחקר", 5.3, 2.47, 4.0);
  para(s, "המשתנה התלוי הוא תפיסת הלגיטימיות של הסגל, הנמדדת בשלושה פריטים: האפשרות לדבר עם הסוהרים כשמודאגים או עצובים, היחס המכבד של הסוהרים ושביעות הרצון מהטיפול בבקשות (α = 0.67). המשתנה הבלתי תלוי הוא הרווחה הנפשית, הנמדדת בחמישה פריטים של בריאות גופנית ונפשית, שיפור בבריאות מאז המאסר, שמחה ושביעות רצון מהחיים (α = 0.81). שני הסולמות בטווח של 1 עד 5.", 5.3, 2.85, 4.0, 2.15, 11.5);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 2.35, w: 4.4, h: 2.7, fill: { color: WHITE }, line: { color: "C9D6E4", width: 1 }, rectRadius: 0.1 });
  sub(s, "השערה ושיטה", 0.7, 2.47, 4.0);
  para(s, "השערת המחקר היא שיימצא קשר חיובי מובהק בין רווחה נפשית לבין לגיטימיות, כך שככל שהרווחה גבוהה יותר, הלגיטימיות המיוחסת לסגל גבוהה יותר, ולהפך. המחקר הוא מחקר כמותי מתאמי במערך חתך, המבוסס על נתונים סינתטיים שנבנו על פי סקר תנאי המחיה של שב\"ס משנת 2021, וצומצם ל-2,379 שפוטים. הניתוח נערך ב-SPSS וכלל סטטיסטיקה תיאורית, בדיקת מהימנות ומתאמי פירסון וספירמן.", 0.7, 2.85, 4.0, 2.15, 11.5);
  footer(s, 4);
}

// ---------- 5. findings: population ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "ממצאים: אוכלוסיית המחקר");
  s.addChart(pres.charts.BAR, [{
    name: "אחוז מהשפוטים",
    labels: ["גברים", "יהודים", "לא יהודים", "מאסר ראשון", "מאסר שני", "מאסר שלישי ומעלה", "מעל 3 חודשים באגף", "במסלול שיקום"],
    values: [96.8, 47.8, 52.2, 48.8, 22.2, 29.0, 68.3, 20.4],
  }], {
    x: 4.0, y: 1.1, w: 5.5, h: 3.95, barDir: "bar", chartColors: [NAVY],
    showTitle: true, title: "מאפייני הרקע של השפוטים באחוזים (N = 2,379)", titleFontSize: 11, titleColor: NAVY, titleFontFace: FONT,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0.0"%"', dataLabelFontSize: 10, dataLabelColor: INK,
    catAxisLabelFontSize: 10, catAxisLabelColor: INK, catAxisLabelFontFace: FONT, valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showLegend: false, valAxisMaxVal: 115, catAxisOrientation: "maxMin",
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.15, w: 3.3, h: 3.9, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  sub(s, "מי הם השפוטים", 0.7, 1.27, 2.9);
  para(s, "אוכלוסיית המחקר כוללת 2,379 אסירים שפוטים, רובם המכריע גברים, בגיל ממוצע של 37.9 שנים ובטווח של 18 עד 82. מעט יותר ממחציתם לא יהודים, כמחציתם במאסרם הראשון ולמעלה ממחציתם ריצו מאסר קודם. יותר משני שלישים שוהים באגף הנוכחי מעל שלושה חודשים, וכאחד מכל חמישה נמצא במסלול שיקום. ההתפלגות דומה לזו שדווחה בסקר המקורי (ועקנין, 2024).", 0.7, 1.65, 2.9, 3.3, 11.5);
  footer(s, 5);
}

// ---------- 6. findings: correlation ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "ממצאים: הקשר בין רווחה נפשית ללגיטימיות");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.4, y: 1.1, w: 3.1, h: 1.3, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.12 });
  s.addText("r = 0.32", { isTextBox: true, x: 6.5, y: 1.15, w: 2.9, h: 0.7, fontSize: 38, bold: true, color: ORANGE, align: "center", fontFace: FONT, margin: 0 });
  T(s, "מתאם פירסון, p < 0.001, N = 2,344", { x: 6.5, y: 1.88, w: 2.9, h: 0.4, fontSize: 11, color: "CFDBEA", align: "center" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.4, y: 2.55, w: 3.1, h: 2.5, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.12 });
  sub(s, "פירוש הממצא", 6.6, 2.65, 2.7);
  para(s, "נמצא קשר חיובי מובהק ברמה בינונית בין רווחה נפשית ללגיטימיות, ומתאם ספירמן (0.34) קרוב לפירסון. הקשר קיים בכל שלושת פריטי הלגיטימיות, והחזק שבהם הוא האפשרות לדבר עם הסוהרים (0.29). הרווחה חולקת עם הלגיטימיות כעשרה אחוזים מהשונות, וההשערה אוששה.", 6.6, 3.0, 2.7, 2.0, 11);
  s.addChart(pres.charts.BAR, [{
    name: "רווחה נפשית ממוצעת",
    labels: ["לגיטימיות נמוכה (עד 3.5)", "לגיטימיות בינונית (3.5 עד 4.5)", "לגיטימיות גבוהה (מעל 4.5)"],
    values: [3.34, 3.65, 4.05],
  }], {
    x: 0.5, y: 1.1, w: 5.7, h: 2.6, barDir: "col", chartColors: [ORANGE], barGapWidthPct: 60,
    showTitle: true, title: "רווחה נפשית ממוצעת לפי רמת לגיטימיות (סולם 1 עד 5)", titleFontSize: 11, titleColor: NAVY, titleFontFace: FONT,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00", dataLabelFontSize: 11, dataLabelColor: INK,
    catAxisLabelFontSize: 9, catAxisLabelColor: INK, valAxisMinVal: 1, valAxisMaxVal: 5, valAxisLabelFontSize: 9, valAxisLabelColor: MUTED,
    valGridLine: { color: "DDE3EA", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.85, w: 5.7, h: 1.2, fill: { color: WHITE }, line: { color: "C9D6E4", width: 1 }, rectRadius: 0.1 });
  para(s, "ממוצע הלגיטימיות עמד על 4.24 (סטיית תקן 0.83) וממוצע הרווחה הנפשית על 3.78 (סטיית תקן 0.87). השפוטים ברמת הלגיטימיות הנמוכה דיווחו על רווחה ממוצעת של 3.34, ואלו ברמה הגבוהה על 4.05, פער של כ-0.7 נקודות שהוא כ-80 אחוזים מסטיית תקן, בהלימה לממצאים מהולנד, מאנגליה ומאוסטרליה.", 0.7, 3.95, 5.3, 1.05, 11);
  footer(s, 6);
}

pres.writeFile({ fileName: "seminar_deck.pptx" }).then(f => console.log("written", f));

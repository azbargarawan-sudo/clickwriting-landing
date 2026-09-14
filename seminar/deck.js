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
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.15, w: 9, h: 3.9, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  para(s, "בית הסוהר הוא מוסד שבו סמכות הסגל כמעט מוחלטת, ובכל זאת הסדר היומיומי באגף תלוי בשיתוף פעולה של האסירים. ספרקס ובוטומס (1995) טענו שסדר בבתי סוהר אינו מתקיים בכוח בלבד אלא נשען על תחושת האסירים שהמשטר הוגן ושמי שמפעיל אותו ראוי לציות, ותחושה זו היא הלגיטימיות: המידה שבה האסיר תופס את הסגל כמכבד, כנגיש וכהוגן בטיפול בבקשותיו. ההקשר הישראלי מוסיף לשאלה משקל, שכן במאי 2019 כ-80 אחוזים ממקומות הכליאה בישראל היו קטנים מתקן 4.5 מטרים רבועים לאסיר (יכימוביץ-כהן, 2020). על רקע זה נערך בסתיו 2021 סקר תנאי המחיה הראשון בהיקפו בשירות בתי הסוהר, בקרב 2,363 שפוטים ו-1,427 עצורים, ובו נמצא שהלגיטימיות ממתנת את הקשר בין תנאי המחיה לבין שביעות הרצון מפעילויות החינוך, הטיפול והשיקום (ועקנין, 2024). המחקר הנוכחי לוקח מאותו מערך נתונים חוט אחד ובוחן את הקשר הישיר בין רווחתו הנפשית של האסיר לבין האופן שבו הוא תופס את לגיטימיות הסגל, בקרב שפוטים בלבד, משום שלשפוט יש אופק ידוע ושהות ממושכת יותר מול אותו סגל.", 0.8, 1.4, 8.4, 3.4, 14);
  footer(s, 2);
}

// ---------- 3. literature ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "סקירת ספרות");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.15, w: 9, h: 3.9, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  para(s, "הספרות על הסתגלות למאסר עברה מתיאור כללי של כאבי המאסר לבחינה של ההבדלים בין בתי סוהר ובין אסירים. אוטי וליבלינג (2024) זיהו, על בסיס 518 סקרי איכות חיים באנגליה ובוויילס, שמתחת לסף של 3.05 ביחסי סגל ואסירים עולים בחדות שיעורי האלימות והפגיעה העצמית, וון גינקן ואחרים (2019) מצאו בקרב 4,538 אסירים בהולנד שתפיסות אישיות של אוטונומיה וביטחון קשורות לרווחה הנפשית. במערך אורך באוסטרליה הראו סרג'נט ואחרים (2026) שצדק פרוצדורלי מעלה את הרווחה הנפשית ושהיחסים עם הסגל הם המנגנון המתווך. בתחום הלגיטימיות ניתחו ברנטון-סמית ומקארתי (2016) סקר של יותר מ-3,000 אסירים ומצאו שההוגנות הפרוצדורלית היא המנבא החזק ביותר של לגיטימיות, ופרנקה ואחרים (2010) הראו בניסוי אקראי שדלות סביבתית וחוויות שליליות הן שמכרסמות בלגיטימיות במהלך המאסר. בישראל מצא ועקנין (2024) לגיטימיות גבוהה יחסית, גבוהה יותר בקרב שפוטים מאשר בקרב עצורים, והציע לראות בה כלי ניהולי באגף. הקשר הישיר בין רווחה נפשית ללגיטימיות בקרב שפוטים טרם נבחן, וזהו הפער שהמחקר הנוכחי מבקש למלא.", 0.8, 1.35, 8.4, 3.55, 12.5);
  footer(s, 3);
}

// ---------- 4. research question ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "שאלת המחקר");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.15, w: 9, h: 1.0, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.12 });
  T(s, "באיזו מידה קיים קשר בין רווחה נפשית לבין תפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בלבד?", { x: 0.8, y: 1.22, w: 8.4, h: 0.86, fontSize: 17, bold: true, color: WHITE, valign: "middle" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 2.35, w: 9, h: 2.7, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  para(s, "המשתנה התלוי הוא תפיסת הלגיטימיות של הסגל, הנמדדת בשלושה פריטים מתוך שאלון סקר תנאי המחיה: האפשרות לדבר עם הסוהרים כשמודאגים או עצובים, היחס המכבד של הסוהרים ושביעות הרצון מהטיפול בבקשות (α = 0.67). המשתנה הבלתי תלוי הוא הרווחה הנפשית, הנמדדת בחמישה פריטים של בריאות גופנית ונפשית, שיפור בבריאות מאז המאסר, שמחה ושביעות רצון מהחיים בחודש האחרון (α = 0.81), ושני הסולמות נעים בטווח של 1 עד 5. השערת המחקר היא שיימצא קשר חיובי מובהק בין רווחה נפשית לבין לגיטימיות, כך שככל שהרווחה גבוהה יותר, הלגיטימיות המיוחסת לסגל גבוהה יותר, ולהפך. המחקר הוא מחקר כמותי מתאמי במערך חתך, המבוסס על נתונים סינתטיים שנבנו על פי סקר שירות בתי הסוהר משנת 2021 וצומצמו ל-2,379 שפוטים, והניתוח נערך ב-SPSS וכלל סטטיסטיקה תיאורית, בדיקת מהימנות ומתאמי פירסון וספירמן.", 0.8, 2.55, 8.4, 2.35, 13);
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
  para(s, "אוכלוסיית המחקר כוללת 2,379 אסירים שפוטים, רובם המכריע גברים, בגיל ממוצע של 37.9 שנים ובטווח של 18 עד 82. מעט יותר ממחציתם לא יהודים, כמחציתם במאסרם הראשון ולמעלה ממחציתם ריצו מאסר קודם. יותר משני שלישים שוהים באגף הנוכחי מעל שלושה חודשים, וכאחד מכל חמישה נמצא במסלול שיקום. ההתפלגות דומה לזו שדווחה בסקר המקורי (ועקנין, 2024).", 0.7, 1.35, 2.9, 3.55, 12);
  footer(s, 5);
}

// ---------- 6. findings: correlation ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "ממצאים: הקשר בין רווחה נפשית ללגיטימיות");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.6, y: 1.1, w: 2.9, h: 2.6, fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.12 });
  s.addText("r = 0.32", { isTextBox: true, x: 6.7, y: 1.35, w: 2.7, h: 0.8, fontSize: 40, bold: true, color: ORANGE, align: "center", fontFace: FONT, margin: 0 });
  T(s, "מתאם פירסון בין רווחה נפשית ללגיטימיות, p < 0.001, N = 2,344. מתאם ספירמן rs = 0.34.", { x: 6.8, y: 2.25, w: 2.5, h: 1.3, fontSize: 12, color: "CFDBEA", align: "center" });
  s.addChart(pres.charts.BAR, [{
    name: "רווחה נפשית ממוצעת",
    labels: ["לגיטימיות נמוכה (עד 3.5)", "לגיטימיות בינונית (3.5 עד 4.5)", "לגיטימיות גבוהה (מעל 4.5)"],
    values: [3.34, 3.65, 4.05],
  }], {
    x: 0.5, y: 1.1, w: 5.9, h: 2.6, barDir: "col", chartColors: [ORANGE], barGapWidthPct: 60,
    showTitle: true, title: "רווחה נפשית ממוצעת לפי רמת לגיטימיות (סולם 1 עד 5)", titleFontSize: 11, titleColor: NAVY, titleFontFace: FONT,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00", dataLabelFontSize: 11, dataLabelColor: INK,
    catAxisLabelFontSize: 9, catAxisLabelColor: INK, valAxisMinVal: 1, valAxisMaxVal: 5, valAxisLabelFontSize: 9, valAxisLabelColor: MUTED,
    valGridLine: { color: "DDE3EA", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.85, w: 9, h: 1.2, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  para(s, "נמצא קשר חיובי מובהק ברמה בינונית בין רווחה נפשית ללגיטימיות, והוא קיים בכל שלושת פריטי הלגיטימיות, כשהחזק שבהם הוא האפשרות לדבר עם הסוהרים (0.29). ממוצע הלגיטימיות עמד על 4.24 (סטיית תקן 0.83) וממוצע הרווחה על 3.78 (סטיית תקן 0.87), והשפוטים ברמת הלגיטימיות הנמוכה דיווחו על רווחה ממוצעת של 3.34 לעומת 4.05 ברמה הגבוהה, פער של כ-0.7 נקודות שהוא כ-80 אחוזים מסטיית תקן. הרווחה חולקת עם הלגיטימיות כעשרה אחוזים מהשונות, ההשערה אוששה, והממצא עולה בקנה אחד עם המחקרים מהולנד, מאנגליה ומאוסטרליה.", 0.75, 3.95, 8.5, 1.05, 11);
  footer(s, 6);
}

pres.writeFile({ fileName: "seminar_deck.pptx" }).then(f => console.log("written", f));

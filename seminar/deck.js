const pptxgen = require("pptxgenjs");
const fs = require("fs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.rtlMode = true;
pres.lang = "he-IL";

const DEEP = "16375C", NAVY = "2E6BA8", LIGHT = "E4EDF7", ORANGE = "E58220", ORANGE_SOFT = "FBEBD8", INK = "1F2933", MUTED = "5B6B7C", WHITE = "FFFFFF", RULE = "C9D6E4";
const FONT = "Arial";
const logo = "image/jpeg;base64," + fs.readFileSync("logo.jpg").toString("base64");

const RLM = "\u200F"; // right-to-left mark: pins trailing punctuation to the end of the line
const HEB = /[\u0590-\u05FF]/;
const rtl = t => typeof t === "string" && HEB.test(t)
  ? t.split("\n").map(l => (HEB.test(l) ? RLM + l + RLM : l)).join("\n")
  : t;
const T = (slide, text, o) => slide.addText(rtl(text), Object.assign({ isTextBox: true, fontFace: FONT, rtlMode: true, lang: "he-IL", align: "right", color: INK, margin: 0, valign: "top" }, o));
const title = (slide, text) => T(slide, text, { x: 0.5, y: 0.28, w: 9, h: 0.68, fontSize: 30, bold: true, color: NAVY });
const para = (slide, text, x, y, w, h, size = 12) => T(slide, text, { x, y, w, h, fontSize: size, color: INK, align: "justify", lineSpacingMultiple: 1.15 });
const footer = (slide, n) => {
  T(slide, "רווחה נפשית ותפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בישראל", { x: 0.5, y: 5.2, w: 7.5, h: 0.3, fontSize: 10, color: MUTED });
  slide.addText(String(n), { isTextBox: true, x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: MUTED, align: "left", fontFace: FONT, margin: 0 });
};

// RTL table: pass rows in logical order (rightmost column first); rendered reversed.
function rtlTable(slide, header, rows, opts) {
  const cell = (t, o) => ({ text: String(t), options: Object.assign({ fontFace: FONT, rtlMode: true, lang: "he-IL", valign: "middle" }, o) });
  const head = header.map(h => cell(h, { bold: true, color: WHITE, fill: { color: NAVY }, align: "center", fontSize: opts.fontSize || 11 })).reverse();
  const body = rows.map((r, ri) => r.map((c, ci) => cell(c, {
    color: INK, fontSize: opts.fontSize || 11,
    align: ci === 0 ? "right" : "center",
    bold: ci === 0 && opts.boldFirst !== false && String(c).length > 0,
    fill: { color: ri % 2 ? WHITE : LIGHT },
  })).reverse());
  slide.addTable([head, ...body], Object.assign({
    x: opts.x, y: opts.y, w: opts.w, colW: opts.colW.slice().reverse(), rowH: opts.rowH || 0.26,
    border: { type: "solid", color: RULE, pt: 0.75 }, margin: 4, autoPage: false,
  }, opts.table || {}));
}

// ---------- 1. title ----------
{
  const s = pres.addSlide();
  s.background = { color: DEEP };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.35, fill: { color: WHITE } });
  s.addImage({ data: logo, x: 6.9, y: 0.25, w: 2.6, h: 1.03 });
  T(s, "המכללה האקדמית אשקלון, החוג לקרימינולוגיה", { x: 0.5, y: 0.35, w: 6.2, h: 0.35, fontSize: 14, bold: true, color: NAVY });
  T(s, "סמינריון: תנאי כליאה של אסירים פליליים בישראל ובעולם", { x: 0.5, y: 0.7, w: 6.2, h: 0.3, fontSize: 12, color: MUTED });
  T(s, "מרצה: ד\"ר יוחנן ועקנין", { x: 0.5, y: 0.98, w: 6.2, h: 0.3, fontSize: 12, color: MUTED });
  T(s, "רווחה נפשית ותפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בישראל", { x: 0.6, y: 1.6, w: 8.8, h: 1.05, fontSize: 26, bold: true, color: WHITE, valign: "middle" });
  T(s, "שאלת המחקר: באיזו מידה קיים קשר בין רווחה נפשית לבין תפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בלבד?", { x: 0.6, y: 2.75, w: 8.8, h: 0.9, fontSize: 16, bold: true, color: ORANGE, valign: "middle" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 3.85, w: 8.8, h: 1.2, fill: { color: "204B7A" }, line: { color: "204B7A" }, rectRadius: 0.12 });
  T(s, "מגישות:", { x: 0.85, y: 3.95, w: 8.3, h: 0.3, fontSize: 13, bold: true, color: ORANGE });
  T(s, "שם: ______________________   ת.ז.: ______________", { x: 0.85, y: 4.28, w: 8.3, h: 0.32, fontSize: 14, color: WHITE });
  T(s, "שם: ______________________   ת.ז.: ______________", { x: 0.85, y: 4.62, w: 8.3, h: 0.32, fontSize: 14, color: WHITE });
}

// ---------- 2. background ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "רקע");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 3.95, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  para(s, "בית הסוהר הוא מוסד שבו סמכות הסגל כמעט מוחלטת, ובכל זאת הסדר היומיומי באגף תלוי בשיתוף פעולה של האסירים. ספרקס ובוטומס (1995) טענו שסדר בבתי סוהר אינו מתקיים בכוח בלבד אלא נשען על תחושת האסירים שהמשטר הוגן ושמי שמפעיל אותו ראוי לציות, ותחושה זו היא הלגיטימיות: המידה שבה האסיר תופס את הסגל כמכבד, כנגיש וכהוגן בטיפול בבקשותיו. ההקשר הישראלי מוסיף לשאלה משקל, שכן במאי 2019 כ-80 אחוזים ממקומות הכליאה בישראל היו קטנים מתקן 4.5 מטרים רבועים לאסיר (יכימוביץ-כהן, 2020). על רקע זה נערך בסתיו 2021 סקר תנאי המחיה הראשון בהיקפו בשירות בתי הסוהר, בקרב 2,363 שפוטים ו-1,427 עצורים, ובו נמצא שהלגיטימיות ממתנת את הקשר בין תנאי המחיה לבין שביעות הרצון מפעילויות החינוך, הטיפול והשיקום (ועקנין, 2024). המחקר הנוכחי לוקח מאותו מערך נתונים חוט אחד ובוחן את הקשר הישיר בין רווחתו הנפשית של האסיר לבין האופן שבו הוא תופס את לגיטימיות הסגל, בקרב שפוטים בלבד, משום שלשפוט יש אופק ידוע ושהות ממושכת יותר מול אותו סגל.", 0.8, 1.35, 8.4, 3.45, 14);
  footer(s, 2);
}

// ---------- 3. literature ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "סקירת ספרות");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 3.95, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  para(s, "הספרות על הסתגלות למאסר עברה מתיאור כללי של כאבי המאסר לבחינה של ההבדלים בין בתי סוהר ובין אסירים. אוטי וליבלינג (2024) זיהו, על בסיס 518 סקרי איכות חיים באנגליה ובוויילס, שמתחת לסף של 3.05 ביחסי סגל ואסירים עולים בחדות שיעורי האלימות והפגיעה העצמית, וון גינקן ואחרים (2019) מצאו בקרב 4,538 אסירים בהולנד שתפיסות אישיות של אוטונומיה וביטחון קשורות לרווחה הנפשית. במערך אורך באוסטרליה הראו סרג'נט ואחרים (2026) שצדק פרוצדורלי מעלה את הרווחה הנפשית ושהיחסים עם הסגל הם המנגנון המתווך. בתחום הלגיטימיות ניתחו ברנטון-סמית ומקארתי (2016) סקר של יותר מ-3,000 אסירים ומצאו שההוגנות הפרוצדורלית היא המנבא החזק ביותר של לגיטימיות, ופרנקה ואחרים (2010) הראו בניסוי אקראי שדלות סביבתית וחוויות שליליות הן שמכרסמות בלגיטימיות במהלך המאסר. בישראל מצא ועקנין (2024) לגיטימיות גבוהה יחסית, גבוהה יותר בקרב שפוטים מאשר בקרב עצורים, והציע לראות בה כלי ניהולי באגף. הקשר הישיר בין רווחה נפשית ללגיטימיות בקרב שפוטים טרם נבחן, וזהו הפער שהמחקר הנוכחי מבקש למלא.", 0.8, 1.35, 8.4, 3.45, 12.5);
  footer(s, 3);
}

// ---------- 4. research question ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "שאלת המחקר");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 1.0, fill: { color: ORANGE }, line: { color: ORANGE }, rectRadius: 0.12 });
  T(s, "באיזו מידה קיים קשר בין רווחה נפשית לבין תפיסת הלגיטימיות של סגל הכליאה בקרב אסירים שפוטים בלבד?", { x: 0.8, y: 1.17, w: 8.4, h: 0.86, fontSize: 17, bold: true, color: DEEP, valign: "middle" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 2.3, w: 9, h: 2.75, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  para(s, "המשתנה התלוי הוא תפיסת הלגיטימיות של הסגל, הנמדדת בשלושה פריטים מתוך שאלון סקר תנאי המחיה: האפשרות לדבר עם הסוהרים כשמודאגים או עצובים, היחס המכבד של הסוהרים ושביעות הרצון מהטיפול בבקשות (α = 0.67). המשתנה הבלתי תלוי הוא הרווחה הנפשית, הנמדדת בחמישה פריטים של בריאות גופנית ונפשית, שיפור בבריאות מאז המאסר, שמחה ושביעות רצון מהחיים בחודש האחרון (α = 0.81), ושני הסולמות נעים בטווח של 1 עד 5. השערת המחקר היא שיימצא קשר חיובי מובהק בין רווחה נפשית לבין לגיטימיות, כך שככל שהרווחה גבוהה יותר, הלגיטימיות המיוחסת לסגל גבוהה יותר, ולהפך. המחקר הוא מחקר כמותי מתאמי במערך חתך, המבוסס על נתונים סינתטיים שנבנו על פי סקר שירות בתי הסוהר משנת 2021 וצומצמו ל-2,379 שפוטים, והניתוח נערך ב-SPSS וכלל סטטיסטיקה תיאורית, בדיקת מהימנות ומתאמי פירסון וספירמן.", 0.8, 2.5, 8.4, 2.4, 13);
  footer(s, 4);
}

// ---------- 5. findings: population ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "ממצאים: אוכלוסיית המחקר");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 3.95, fill: { color: ORANGE_SOFT }, line: { color: ORANGE_SOFT }, rectRadius: 0.1 });
  para(s, "אוכלוסיית המחקר כוללת 2,379 אסירים פליליים שפוטים, שהם כשני שלישים מכלל המשיבים לסקר. רובם המכריע גברים, 2,302 איש שהם 96.8 אחוזים, ולעומתם 77 נשים בלבד שהן 3.2 אחוזים, והגיל הממוצע עומד על 37.9 שנים בטווח שבין 18 ל-82. מבחינת לאום המדגם מחולק כמעט שווה בשווה, 1,136 יהודים שהם 47.8 אחוזים ו-1,243 שאינם יהודים שהם 52.2 אחוזים. כמחצית מהשפוטים מרצים את מאסרם הראשון, 1,162 איש שהם 48.8 אחוזים, 528 נמצאים במאסרם השני ו-689 במאסר שלישי ומעלה, ומכאן שלמעלה ממחצית האוכלוסייה כבר ריצתה מאסר קודם. רוב השפוטים ותיקים באגף שבו הם שוהים: 1,624 מהם, שהם 68.3 אחוזים, נמצאים בו מעל שלושה חודשים, ורק 755 שהם 31.7 אחוזים הגיעו אליו בשלושת החודשים האחרונים. לבסוף, 486 שפוטים שהם 20.4 אחוזים משתתפים במסלול שיקום. התפלגות זו דומה לזו שדווחה בסקר המקורי, ומכאן שהמדגם משקף את אוכלוסיית האגפים הפליליים בשירות בתי הסוהר (ועקנין, 2024).", 0.8, 1.35, 8.4, 3.45, 13.5);
  footer(s, 5);
}

// ---------- 6. findings: correlation ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  title(s, "ממצאים: הקשר בין רווחה נפשית ללגיטימיות");
  s.addChart(pres.charts.BAR, [{
    name: "רווחה נפשית ממוצעת",
    labels: ["לגיטימיות נמוכה", "לגיטימיות בינונית", "לגיטימיות גבוהה"],
    values: [3.34, 3.65, 4.05],
  }], {
    x: 0.5, y: 1.05, w: 5.3, h: 2.6, barDir: "col", chartColors: [ORANGE], barGapWidthPct: 55,
    showTitle: true, title: "רווחה נפשית ממוצעת לפי רמת לגיטימיות", titleFontSize: 11, titleColor: NAVY, titleFontFace: FONT,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00", dataLabelFontSize: 12, dataLabelColor: INK,
    catAxisLabelFontSize: 10, catAxisLabelColor: INK, catAxisLabelFontFace: FONT,
    valAxisMinVal: 3, valAxisMaxVal: 4.4, valAxisLabelFontSize: 9, valAxisLabelColor: MUTED,
    valGridLine: { color: "DDE3EA", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.95, y: 1.05, w: 3.55, h: 2.6, fill: { color: DEEP }, line: { color: DEEP }, rectRadius: 0.12 });
  s.addText("r = 0.32", { isTextBox: true, x: 6.05, y: 1.22, w: 3.35, h: 0.7, fontSize: 36, bold: true, color: ORANGE, align: "center", fontFace: FONT, margin: 0 });
  T(s, "מתאם פירסון בין רווחה נפשית לבין תפיסת הלגיטימיות של הסגל, מובהק ברמה של p < 0.001 בקרב 2,344 שפוטים. מתאם ספירמן קרוב אליו ועומד על 0.34, ומכאן שההטיה בהתפלגות אינה מעוותת את התמונה.", { x: 6.25, y: 1.98, w: 2.95, h: 1.55, fontSize: 11.5, color: "D4E2F0", align: "justify", lineSpacingMultiple: 1.1 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.8, w: 9, h: 1.25, fill: { color: LIGHT }, line: { color: LIGHT }, rectRadius: 0.1 });
  para(s, "ממוצע הלגיטימיות עמד על 4.24 עם סטיית תקן של 0.83, וממוצע הרווחה הנפשית על 3.78 עם סטיית תקן של 0.87, בסולם שנע בין 1 ל-5. נמצא קשר חיובי מובהק ברמה בינונית בין שני המשתנים, והוא קיים בכל שלושת פריטי הלגיטימיות כשהחזק שבהם הוא האפשרות לדבר עם הסוהרים. השפוטים ברמת הלגיטימיות הנמוכה דיווחו על רווחה ממוצעת של 3.34 לעומת 4.05 ברמה הגבוהה, פער של כ-0.7 נקודות שהוא כ-80 אחוזים מסטיית תקן, ומכאן שהרווחה חולקת עם הלגיטימיות כעשרה אחוזים מהשונות. השערת המחקר אוששה, והממצא עולה בקנה אחד עם המחקרים מהולנד, מאנגליה ומאוסטרליה.", 0.7, 3.92, 8.6, 1.05, 11);
  footer(s, 6);
}

pres.writeFile({ fileName: "seminar_deck.pptx" }).then(f => console.log("written", f));

// Builds the 3-slide final seminar presentation (Hebrew, RTL).
// Run from a directory where pptxgenjs, react, react-dom, react-icons and sharp resolve:
//   NODE_PATH=<node_modules> node build.js <out.pptx>
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

const OUT = process.argv[2] || "היעדרויות-מורים-מצגת-סיום.pptx";

const C = {
  ink: "12343B",     // dominant deep teal
  inkSoft: "1D4A52",
  tint: "E4F0F0",
  mist: "A9D2D5",
  amber: "E9A23B",
  text: "1B2B2E",
  muted: "4F6A6E",
  white: "FFFFFF",
};
const FONT = "Arial";

async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { color: "#" + color, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// RTL text helper
function t(slide, text, o) {
  slide.addText(text, {
    isTextBox: true, fontFace: FONT, rtlMode: true, lang: "he-IL", align: "right",
    valign: "top", margin: 0, ...o,
  });
}

// Icon inside a filled circle
async function iconCircle(slide, Comp, x, y, d, fill, fg) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  const pad = d * 0.25;
  slide.addImage({ data: await icon(Comp, fg), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad });
}

// Slide number badge + small kicker (top right)
function badge(slide, n, kicker, onDark) {
  slide.addShape("ellipse", { x: 12.13, y: 0.45, w: 0.6, h: 0.6, fill: { color: C.amber }, line: { color: C.amber } });
  slide.addText(String(n), {
    isTextBox: true, x: 12.13, y: 0.45, w: 0.6, h: 0.6, align: "center", valign: "middle",
    fontFace: FONT, fontSize: 20, bold: true, color: C.ink, margin: 0,
  });
  t(slide, kicker, { x: 6.5, y: 0.55, w: 5.45, h: 0.4, fontSize: 13, bold: true, color: onDark ? C.amber : C.muted, valign: "middle" });
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.rtlMode = true;
  pres.title = "אסטרטגיות ניהוליות בהתמודדות עם היעדרויות מורים";
  pres.author = "חנון מנסור, אולפת עבד אל חי";

  // Flowing-prose paragraph with an icon marker in the right margin (RTL)
  async function para(s, Comp, y, h, runs, o = {}) {
    const d = 0.5, iconX = o.right - d;
    await iconCircle(s, Comp, iconX, y + 0.02, d, o.iconFill || C.ink, o.iconFg || C.white);
    t(s, runs, { x: o.left, y, w: iconX - 0.25 - o.left, h, fontSize: o.size || 16, color: o.color || C.text, lineSpacingMultiple: 1.15 });
  }

  // ---------------- Slide 1 ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    badge(s, 1, "מה אנחנו מנסים להבין?", true);
    s.addText("חנון מנסור · אולפת עבד אל חי  |  סמינריון בעבודת הניהול ובמנהל חינוך", {
      isTextBox: true, x: 0.6, y: 0.55, w: 5.6, h: 0.4, fontFace: FONT, fontSize: 11, color: C.mist,
      rtlMode: true, align: "left", valign: "middle", margin: 0,
    });
    t(s, "מה קורה בבית הספר כשהמורה לא מגיע?", { x: 0.6, y: 1.25, w: 12.13, h: 0.85, fontSize: 40, bold: true, color: C.white, valign: "middle" });

    const P = { left: 0.6, right: 12.73, size: 17, color: C.white, iconFill: C.amber, iconFg: C.ink };
    await para(s, fa.FaSchool, 2.55, 1.25, [
      { text: "המחקר שלנו עוסק בהיעדרויות מורים, ", options: { bold: true, color: C.amber } },
      { text: "תופעה שמוכרת לכל בית ספר ומתרחשת כמעט בכל יום. ההיעדרות עצמה אינה הבעיה. המורכבות מתחילה ברגע שבו המנהל צריך להחליט בתוך דקות מי ייכנס לכיתה, מה יקרה בשיעור ומי מהצוות ישלם את המחיר." },
    ], P);
    await para(s, fa.FaQuestion, 4.0, 1.25, [
      { text: "לכן אנחנו שואלים: ", options: { color: C.white } },
      { text: "כיצד מנהלי בתי ספר בערים בצפון הארץ מתארים את התמודדותם עם היעדרויות מורים, ואילו אסטרטגיות ושיקולים מנחים את החלטותיהם לשמירה על רצף לימודי?", options: { bold: true, color: C.white } },
    ], P);
    await para(s, fa.FaQuoteRight, 5.2, 1.6, [
      { text: "השאלה הזאת מעסיקה אותנו ", options: { bold: true, color: C.amber } },
      { text: "משום שראינו שאותה היעדרות יכולה להסתיים בשיעור שממשיך כרגיל, או בשעה של השגחה בלבד, וההבדל נקבע בהחלטות של המנהל. המחקר שלנו חשוב כי הוא מאיר את מה שקורה מאחורי הקלעים של ההחלטות האלה, שמשפיעות ישירות על הלמידה של התלמידים." },
    ], P);

    s.addNotes(
`[חנון | כדקה]
בוקר רגיל, שבע וחצי. מורה מתקשרת ואומרת שהיא לא תגיע היום. בתוך כמה דקות המנהל צריך להחליט: מי נכנס לכיתה, מה יקרה בשיעור, ומי מהצוות ישלם את המחיר.

המחקר שלנו עוסק בהיעדרויות מורים. ההיעדרות עצמה היא חלק מהחיים של כל בית ספר. מה שמעניין אותנו הוא מה שהמנהל עושה ברגע הזה.

לכן שאלת המחקר שלנו היא: כיצד מנהלי בתי ספר בערים בצפון הארץ מתארים את התמודדותם עם היעדרויות מורים, ואילו אסטרטגיות ושיקולים מנחים את החלטותיהם לשמירה על רצף לימודי?

השאלה הזאת מעסיקה אותנו כי ראינו שאותה היעדרות יכולה להסתיים בשיעור שממשיך כרגיל, או בשעה של השגחה בלבד. ההבדל תלוי בהחלטות של המנהל.

המחקר שלנו חשוב כי הוא מאיר את מה שקורה מאחורי הקלעים של ההחלטות האלה, שמשפיעות ישירות על הלמידה של התלמידים.
[מעבר לאולפת]`);
  }

  // ---------------- Slide 2 ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    badge(s, 2, "מה אנחנו כבר יודעים ומה עדיין לא?", false);
    t(s, "הספרות שינתה את השאלה שלנו", { x: 0.6, y: 1.15, w: 12.13, h: 0.75, fontSize: 36, bold: true, color: C.ink, valign: "middle" });

    const P = { left: 0.6, right: 12.73, size: 16 };
    await para(s, fa.FaBookOpen, 2.2, 1.1, [
      { text: "הספרות מלמדת שהיעדרויות מורים אינן עניין טכני בלבד: ", options: { bold: true, color: C.ink } },
      { text: "מילר ועמיתיו (2008) וקלוטפלטר ועמיתיו (2009) מצאו שהן פוגעות בהישגי התלמידים, והפגיעה גדלה ככל שההיעדרויות מצטברות. שפירא־לישצ'ינסקי ורוזנבלט (2010) הראו שהמנהל אינו רק מגיב להיעדרות, שכן האקלים שהוא מעצב בבית הספר קשור גם להיקף ההיעדרויות." },
    ], P);
    s.addText("Miller et al., 2008 · Clotfelter et al., 2009 · Shapira-Lishchinsky & Rosenblatt, 2010", {
      isTextBox: true, x: 0.6, y: 3.3, w: 11.38, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted, align: "right", margin: 0,
    });
    await para(s, fa.FaBolt, 3.75, 1.35, [
      { text: "אלא שכאן נוצר מתח: ", options: { bold: true, color: C.ink } },
      { text: "בתיאוריה, רצף לימודי הוא עניין פדגוגי של המשך תוכן, יחסים ושגרה. במציאות, בשבע וחצי בבוקר, המנהל צריך קודם כול שמישהו יהיה בכיתה. רוב המחקרים בודקים כמה מורים נעדרים, מדוע ומה המחיר, ומעט ידוע על מה שהמנהל עושה ושוקל ברגע ההיעדרות עצמו." },
    ], P);

    // Shift in thinking, as a continuous paragraph on a dark panel
    s.addShape("roundRect", { x: 0.6, y: 5.35, w: 12.13, h: 1.25, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    await para(s, fa.FaSyncAlt, 5.5, 0.95, [
      { text: "הקריאה שינתה גם את החשיבה שלנו. ", options: { bold: true, color: C.amber } },
      { text: "בתחילת הדרך ראינו בבעיה עניין לוגיסטי של מציאת ממלא מקום. היום אנחנו מבינים שרצף לימודי הוא פדגוגי, ארגוני ורגשי, ושהמנהל פועל גם לפני ההיעדרות ולא רק אחריה.", options: { color: C.white } },
    ], { left: 0.95, right: 12.43, size: 16, iconFill: C.amber, iconFg: C.ink });

    s.addNotes(
`[אולפת | כדקה ורבע]
מה למדנו מהספרות? קודם כול, שהיעדרויות מורים אינן עניין טכני. מחקרים גדולים, של מילר ועמיתיו ושל קלוטפלטר ועמיתיו, מצאו שהיעדרויות פוגעות בהישגי התלמידים, והפגיעה גדלה ככל שהן מצטברות.

מה שהפתיע אותנו הוא שהמנהל לא רק מגיב להיעדרות. מחקר ישראלי של שפירא־לישצ'ינסקי ורוזנבלט מצא שהאקלים שהמנהל יוצר בבית הספר קשור גם להיקף ההיעדרויות.

אבל כאן נוצר מתח. בתיאוריה, רצף לימודי הוא עניין פדגוגי: שהחומר ימשיך, שהיחסים והשגרה יישמרו. במציאות, בשבע וחצי בבוקר, המנהל צריך קודם כול שמישהו יהיה בכיתה. ורוב המחקרים בודקים כמה מורים נעדרים ולמה, ולא מה המנהל עושה ושוקל ברגע ההיעדרות עצמו.

הקריאה שינתה גם את החשיבה שלנו. בהתחלה חשבנו שהבעיה לוגיסטית, רק למצוא ממלא מקום. היום אנחנו מבינים שרצף הוא פדגוגי, ארגוני ורגשי, ושהמנהל פועל גם לפני ההיעדרות ולא רק אחריה.
[מעבר לחנון]`);
  }

  // ---------------- Slide 3: literature map ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    badge(s, 3, "מפת הספרות", false);
    t(s, "הסיפור התיאורטי שלנו", { x: 0.6, y: 1.15, w: 12.13, h: 0.75, fontSize: 36, bold: true, color: C.ink, valign: "middle" });

    // Concept chain, read right-to-left
    const nodes = [
      [fa.FaUserTimes, "היעדרות מורים"],
      [fa.FaStream, "רצף לימודי"],
      [fa.FaBalanceScale, "קבלת החלטות ניהולית"],
      [fa.FaChessKnight, "אסטרטגיות"],
    ];
    const nW = 2.6, nH = 1.35, nGap = 0.58, nY = 2.2;
    for (let i = 0; i < nodes.length; i++) {
      const x = 12.73 - nW - i * (nW + nGap);
      const last = i === nodes.length - 1;
      s.addShape("roundRect", { x, y: nY, w: nW, h: nH, rectRadius: 0.12, fill: { color: last ? C.ink : C.tint }, line: { color: last ? C.ink : C.tint } });
      await iconCircle(s, nodes[i][0], x + nW / 2 - 0.25, nY + 0.18, 0.5, last ? C.amber : C.ink, last ? C.ink : C.white);
      s.addText(nodes[i][1], {
        isTextBox: true, x: x + 0.1, y: nY + 0.75, w: nW - 0.2, h: 0.45, fontFace: FONT, fontSize: 15, bold: true,
        color: last ? C.white : C.ink, align: "center", valign: "middle", rtlMode: true, margin: 0,
      });
      if (!last) {
        await iconCircle(s, fa.FaArrowLeft, x - nGap / 2 - 0.18, nY + nH / 2 - 0.18, 0.36, C.amber, C.white);
      }
    }

    const P = { left: 0.6, right: 12.73, size: 16 };
    await para(s, fa.FaLayerGroup, 4.1, 1.35, [
      { text: "הסיפור מתחיל בהיעדרות מורים ועובר אל הרצף הלימודי, ", options: { bold: true, color: C.ink } },
      { text: "שאנחנו מבינים בשלושה ממדים: פדגוגי, כלומר המשך התוכן והלמידה; ארגוני, כלומר שיבוץ, מערכת שעות ועומס על הצוות; ורגשי, כלומר היחסים והביטחון של התלמידים עם מבוגר מוכר." },
    ], P);
    await para(s, fa.FaRoute, 5.2, 1.35, [
      { text: "הרצף הזה תלוי בקבלת החלטות ניהולית, ", options: { bold: true, color: C.ink } },
      { text: "שבה המנהל שוקל צרכים מתחרים בזמן קצר ובמשאבים מוגבלים. מתוך ההחלטות האלה נגזרות האסטרטגיות: חלקן מגיבות, כמו ממלא מקום, איחוד כיתות או שעה פרטנית, וחלקן מונעות, כמו מאגר ממלאי מקום קבוע וחומרי עבודה מוכנים מראש." },
    ], P);

    s.addNotes(
`[חנון | כחמישים שניות]
כך נראה הסיפור התיאורטי שלנו, מימין לשמאל.

הוא מתחיל בהיעדרות מורים, ועובר אל המושג המרכזי: רצף לימודי. אנחנו מבינים את הרצף בשלושה ממדים. פדגוגי: שהתוכן והלמידה ממשיכים. ארגוני: שיבוץ, מערכת שעות, והעומס על הצוות שמחליף. ורגשי: שהתלמידים נשארים עם מבוגר מוכר ומרגישים ביטחון.

הרצף הזה תלוי בקבלת החלטות ניהולית. המנהל שוקל צרכים מתחרים, בזמן קצר ובמשאבים מוגבלים.

מתוך ההחלטות האלה נגזרות האסטרטגיות. יש אסטרטגיות מגיבות, כמו ממלא מקום, איחוד כיתות או שעה פרטנית, ויש אסטרטגיות מונעות, כמו מאגר ממלאי מקום קבוע וחומרי עבודה מוכנים מראש. את החוליה האחרונה הזאת, איך בדיוק זה קורה בשטח, אנחנו רוצים לחקור.
[מעבר לאולפת]`);
  }

  // ---------------- Slide 4: field ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    badge(s, 4, "יוצאים לשטח", false);
    t(s, "12 שיחות עם מי שמחליטים בבוקר", { x: 0.6, y: 1.15, w: 12.13, h: 0.75, fontSize: 36, bold: true, color: C.ink, valign: "middle" });

    // Stat panel (left)
    s.addShape("roundRect", { x: 0.6, y: 2.2, w: 2.6, h: 4.6, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    s.addText("12", { isTextBox: true, x: 0.6, y: 3.3, w: 2.6, h: 1.1, fontFace: FONT, fontSize: 66, bold: true, color: C.amber, align: "center", valign: "middle", margin: 0 });
    s.addText([
      { text: "מנהלים ומנהלות", options: { bold: true, fontSize: 16, color: C.white, breakLine: true } },
      { text: "בערים בצפון הארץ", options: { fontSize: 14, color: C.mist } },
    ], { isTextBox: true, x: 0.8, y: 4.5, w: 2.2, h: 1.0, fontFace: FONT, rtlMode: true, align: "center", valign: "top", margin: 0 });

    const P = { left: 3.5, right: 12.73, size: 16 };
    await para(s, fa.FaUsers, 2.2, 1.4, [
      { text: "נשוחח עם 12 מנהלים ומנהלות ", options: { bold: true, color: C.ink } },
      { text: "של בתי ספר בערים בצפון הארץ, יסודיים ועל־יסודיים ובעלי ותק שונה. בחרנו במנהלים כי הם מקבלי ההחלטות בבוקר ההיעדרות, ובערים כדי לבחון את התופעה בהקשר אחיד ולהשוות בין ערים שונות." },
    ], P);
    await para(s, fa.FaSearch, 3.8, 1.4, [
      { text: "בניתוח תמטי של הראיונות ", options: { bold: true, color: C.ink } },
      { text: "נחפש אסטרטגיות מונעות לעומת מגיבות, הבדלים בין היעדרות קצרה לממושכת, ואת האיזון בין פדגוגיה, תקציב, הוגנות כלפי הצוות שמחליף ורווחת המורה הנעדרת." },
    ], P);
    await para(s, fa.FaLightbulb, 5.4, 1.4, [
      { text: "האתגר המרכזי ", options: { bold: true, color: C.ink } },
      { text: "הוא שמנהלים עלולים להציג תמונה יפה מהמציאות, ולכן נבקש דוגמאות מוחשיות. ממצא שיפתיע אותנו: שמה שמנחה את ההחלטה בפועל הוא השקט והסדר ולא הרצף הלימודי." },
    ], P);

    s.addNotes(
`[אולפת | כדקה]
איך נבדוק את זה? נשוחח עם 12 מנהלים ומנהלות של בתי ספר בערים בצפון הארץ, יסודיים ועל־יסודיים, עם ותק שונה. בחרנו במנהלים כי הם מקבלי ההחלטות בבוקר ההיעדרות, ובחרנו בערים כדי לבחון את התופעה בהקשר אחיד ולהשוות בין ערים שונות.

בניתוח הראיונות נחפש תמות: אסטרטגיות מונעות לעומת מגיבות, הבדלים בין היעדרות קצרה לממושכת, ואת האיזון בין פדגוגיה, תקציב, הוגנות כלפי הצוות שמחליף, ורווחת המורה הנעדרת.

האתגר המרכזי: מנהלים עלולים להציג תמונה יפה מהמציאות. לכן נבקש דוגמאות מוחשיות ולא רק עקרונות.

ומה יפתיע אותנו? אם יתברר שמה שמנחה את ההחלטה בפועל הוא השקט והסדר בבית הספר ולא הרצף הלימודי. זה יערער הנחה שלנו.
[מעבר לחנון]`);
  }

  // ---------------- Slide 5: interview ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    badge(s, 5, "איך ייראה הראיון", false);
    t(s, "\"ספר/י לי על הבוקר האחרון שבו מורה לא הגיע\"", { x: 0.6, y: 1.15, w: 12.13, h: 0.75, fontSize: 32, bold: true, color: C.ink, valign: "middle" });

    const P = { left: 0.6, right: 12.73, size: 16 };
    await para(s, fa.FaDoorOpen, 2.2, 0.95, [
      { text: "נפתח בשאלות רקע ", options: { bold: true, color: C.ink } },
      { text: "על בית הספר, על הצוות ועל הדרך של המנהל לתפקיד, כדי ליצור אמון ולהבין את ההקשר שבו מתקבלות ההחלטות." },
    ], P);
    await para(s, fa.FaClock, 3.2, 1.35, [
      { text: "בלב הראיון נבקש סיפור מוחשי: ", options: { bold: true, color: C.ink } },
      { text: "מה עשית באותו בוקר, צעד אחר צעד? מה היה שונה כשההיעדרות נמשכה כמה שבועות? במה התחשבת כשהחלטת מי יחליף? כך נשמע את השיקולים ואת הדילמות, ולא רק את הנוהל הכתוב." },
    ], P);
    await para(s, fa.FaShieldAlt, 4.3, 0.95, [
      { text: "נקפיד על אתיקה: ", options: { bold: true, color: C.ink } },
      { text: "הסכמה מדעת, הקלטה רק באישור, ושמירה על אנונימיות, כך ששמות המנהלים, בתי הספר והערים לא יופיעו בעבודה." },
    ], P);

    s.addShape("roundRect", { x: 0.6, y: 5.75, w: 12.13, h: 1.15, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    t(s, [
      { text: "אם המחקר שלנו יהיה מוצלח, בסופו נבין טוב יותר ", options: { bold: true, color: C.amber } },
      { text: "איך מנהלים מאזנים, בזמן אמת, בין הצורך שמישהו יהיה בכיתה לבין הזכות של התלמידים לרצף לימודי אמיתי.", options: { color: C.white } },
    ], { x: 0.95, y: 5.85, w: 11.43, h: 0.95, fontSize: 17, valign: "middle" });

    s.addNotes(
`[חנון | כארבעים שניות]
איך ייראה הראיון? נפתח בשאלות רקע על בית הספר, על הצוות ועל הדרך של המנהל לתפקיד, כדי ליצור אמון ולהבין את ההקשר.

בלב הראיון נבקש סיפור מוחשי: ספר לי על הבוקר האחרון שבו מורה לא הגיע. מה עשית, צעד אחר צעד? מה היה שונה כשההיעדרות נמשכה כמה שבועות? במה התחשבת כשהחלטת מי יחליף? כך נשמע את השיקולים ואת הדילמות, ולא רק את הנוהל הכתוב.

ונקפיד על אתיקה: הסכמה מדעת, הקלטה רק באישור, ואנונימיות מלאה.

[אולפת | כרבע דקה]
אם המחקר שלנו יהיה מוצלח, בסופו נבין טוב יותר איך מנהלים מאזנים, בזמן אמת, בין הצורך שמישהו יהיה בכיתה לבין הזכות של התלמידים לרצף לימודי אמיתי.
תודה.

[שאלות המשך אפשריות]
למה רק מנהלים? כי השאלה היא על קבלת החלטות, והם אלה שמחליטים. במחקר המשך אפשר לשמוע גם את המורים המחליפים.
למה רק ערים? כדי לבחון את התופעה בהקשר אחיד. בתי ספר בכפרים פועלים בתנאים אחרים, וזה יכול להיות כיוון למחקר המשך.`);
  }

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();

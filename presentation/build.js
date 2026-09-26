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

  // ---------------- Slide 1 ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    badge(s, 1, "מה אנחנו מנסים להבין?", true);
    s.addText("חנון מנסור · אולפת עבד אל חי  |  סמינריון בעבודת הניהול ובמנהל חינוך", {
      isTextBox: true, x: 0.6, y: 0.55, w: 5.6, h: 0.4, fontFace: FONT, fontSize: 11, color: C.mist,
      rtlMode: true, align: "left", valign: "middle", margin: 0,
    });

    t(s, "מה קורה בבית הספר כשהמורה לא מגיע?", { x: 0.6, y: 1.3, w: 12.13, h: 0.85, fontSize: 40, bold: true, color: C.white, valign: "middle" });
    t(s, "הנושא: אסטרטגיות ניהוליות בהתמודדות עם היעדרויות מורים ושמירה על רצף לימודי", { x: 0.6, y: 2.2, w: 12.13, h: 0.45, fontSize: 18, color: C.mist, valign: "middle" });

    // Research question card (right)
    s.addShape("roundRect", { x: 5.0, y: 2.95, w: 7.73, h: 2.3, rectRadius: 0.12, fill: { color: C.inkSoft }, line: { color: C.inkSoft } });
    t(s, "שאלת המחקר", { x: 5.35, y: 3.15, w: 7.03, h: 0.35, fontSize: 14, bold: true, color: C.amber });
    t(s, "כיצד מנהלי בתי ספר בצפון הארץ מתארים את התמודדותם עם היעדרויות מורים, ואילו אסטרטגיות ושיקולים מנחים את החלטותיהם לשמירה על רצף לימודי?",
      { x: 5.35, y: 3.55, w: 7.03, h: 1.5, fontSize: 20, bold: true, color: C.white, lineSpacingMultiple: 1.1 });

    // Why this question (left)
    t(s, "למה דווקא השאלה הזאת?", { x: 0.6, y: 2.95, w: 4.05, h: 0.35, fontSize: 14, bold: true, color: C.amber });
    const why = [
      [fa.FaExchangeAlt, "מי נכנס לכיתה במקום המורה?"],
      [fa.FaBalanceScale, "מי מחליט, ולפי אילו שיקולים?"],
      [fa.FaChalkboardTeacher, "מה קורה לשיעור עצמו?"],
      [fa.FaUsers, "מה המחיר לצוות שמחליף?"],
    ];
    for (let i = 0; i < why.length; i++) {
      const y = 3.42 + i * 0.47;
      await iconCircle(s, why[i][0], 4.27, y, 0.38, C.amber, C.ink);
      t(s, why[i][1], { x: 0.6, y, w: 3.5, h: 0.38, fontSize: 14, color: C.white, valign: "middle" });
    }

    // "Our research matters because..."
    s.addShape("roundRect", { x: 0.6, y: 5.6, w: 12.13, h: 1.25, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.amber, width: 1.5 } });
    await iconCircle(s, fa.FaQuoteRight, 11.95, 5.83, 0.55, C.amber, C.ink);
    t(s, [
      { text: "המחקר שלנו חשוב כי ", options: { bold: true, color: C.amber } },
      { text: "היעדרות מורים קורית כמעט בכל יום, וההחלטה של המנהל באותו בוקר קובעת אם התלמידים יקבלו שיעור אמיתי או רק השגחה.", options: { color: C.white } },
    ], { x: 0.9, y: 5.75, w: 10.85, h: 0.95, fontSize: 18, valign: "middle" });

    s.addNotes(
`[חנון | כדקה ורבע]
בוקר רגיל, 7:30. מורה מתקשרת ואומרת שהיא לא תגיע היום. בתוך כמה דקות המנהל צריך להחליט: מי נכנס לכיתה, מה יקרה בשיעור, ומי ישלם את המחיר.

הנושא שלנו הוא היעדרויות מורים. היעדרות כשלעצמה היא לא הבעיה, היא חלק מהחיים של כל בית ספר. מה שמעניין אותנו הוא מה שהמנהל עושה ברגע הזה.

שאלת המחקר שלנו: כיצד מנהלי בתי ספר בצפון הארץ מתארים את התמודדותם עם היעדרויות מורים, ואילו אסטרטגיות ושיקולים מנחים את החלטותיהם לשמירה על רצף לימודי?

למה דווקא השאלה הזאת? כי בכל בית ספר ראינו שאותה היעדרות יכולה להסתיים בשיעור שממשיך כרגיל, או בשעה של השגחה בלבד. ההבדל תלוי בהחלטות של המנהל.

המחקר שלנו חשוב כי היעדרות מורים קורית כמעט בכל יום, וההחלטה של המנהל באותו בוקר קובעת אם התלמידים יקבלו שיעור אמיתי או רק השגחה.
[מעבר לאולפת]`);
  }

  // ---------------- Slide 2 ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    badge(s, 2, "מה אנחנו כבר יודעים ומה עדיין לא?", false);
    t(s, "הספרות שינתה את השאלה שלנו", { x: 0.6, y: 1.15, w: 12.13, h: 0.75, fontSize: 36, bold: true, color: C.ink, valign: "middle" });

    // Three cards, read right-to-left: known -> tension -> gap
    const cardY = 2.15, cardH = 2.55, cardW = 3.85;
    const xs = [8.88, 4.74, 0.6];
    const cards = [
      { ic: fa.FaBookOpen, head: "מה כבר ידוע", fill: C.tint },
      { ic: fa.FaBolt, head: "איפה המתח", fill: C.tint },
      { ic: fa.FaQuestion, head: "מה עדיין לא ברור", fill: C.tint },
    ];
    for (let i = 0; i < 3; i++) {
      s.addShape("roundRect", { x: xs[i], y: cardY, w: cardW, h: cardH, rectRadius: 0.12, fill: { color: cards[i].fill }, line: { color: cards[i].fill } });
      await iconCircle(s, cards[i].ic, xs[i] + cardW - 0.75, cardY + 0.22, 0.5, C.ink, C.white);
      t(s, cards[i].head, { x: xs[i] + 0.25, y: cardY + 0.25, w: cardW - 1.15, h: 0.45, fontSize: 18, bold: true, color: C.ink, valign: "middle" });
    }
    // chevrons between cards (pointing left = forward in RTL)
    for (const cx of [8.88 - 0.145 - 0.2, 4.74 - 0.145 - 0.2]) {
      await iconCircle(s, fa.FaArrowLeft, cx + 0.025, cardY + cardH / 2 - 0.175, 0.35, C.amber, C.white);
    }

    // Card 1 content
    t(s, [
      { text: "היעדרויות פוגעות בלמידה, במיוחד כשהן מצטברות", options: { bold: true, breakLine: true } },
      { text: "Miller et al., 2008; Clotfelter et al., 2009", options: { fontSize: 10, color: C.muted, rtlMode: false, breakLine: true } },
      { text: " ", options: { fontSize: 6, breakLine: true } },
      { text: "המנהל לא רק מגיב: האקלים שהוא יוצר קשור גם להיקף ההיעדרויות", options: { bold: true, breakLine: true } },
      { text: "Shapira-Lishchinsky & Rosenblatt, 2010", options: { fontSize: 10, color: C.muted, rtlMode: false } },
    ], { x: xs[0] + 0.25, y: cardY + 0.9, w: cardW - 0.5, h: 1.5, fontSize: 13.5, color: C.text });

    // Card 2 content
    t(s, [
      { text: "בתיאוריה: ", options: { bold: true } },
      { text: "רצף לימודי הוא עניין פדגוגי, כלומר המשך תוכן, יחסים ושגרה.", options: { breakLine: true } },
      { text: " ", options: { fontSize: 6, breakLine: true } },
      { text: "במציאות, ב־7:30 בבוקר: ", options: { bold: true } },
      { text: "קודם כול צריך שמישהו יהיה בכיתה.", options: {} },
    ], { x: xs[1] + 0.25, y: cardY + 0.9, w: cardW - 0.5, h: 1.5, fontSize: 13.5, color: C.text });

    // Card 3 content
    t(s, [
      { text: "המחקר בודק בעיקר ", options: {} },
      { text: "כמה ולמה", options: { bold: true } },
      { text: " מורים נעדרים ומה המחיר.", options: { breakLine: true } },
      { text: " ", options: { fontSize: 6, breakLine: true } },
      { text: "מעט ידוע על מה שהמנהל ", options: {} },
      { text: "עושה ושוקל", options: { bold: true } },
      { text: " ברגע ההיעדרות עצמו.", options: {} },
    ], { x: xs[2] + 0.25, y: cardY + 0.9, w: cardW - 0.5, h: 1.5, fontSize: 13.5, color: C.text });

    // Shift in thinking
    s.addShape("roundRect", { x: 0.6, y: 5.05, w: 12.13, h: 1.8, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    t(s, "השינוי בחשיבה שלנו", { x: 0.95, y: 5.2, w: 11.43, h: 0.4, fontSize: 14, bold: true, color: C.amber });
    t(s, [
      { text: "בתחילת הדרך חשבנו", options: { bold: true, color: C.mist, breakLine: true } },
      { text: "שהבעיה לוגיסטית: למצוא ממלא מקום.", options: { color: C.mist } },
    ], { x: 7.35, y: 5.65, w: 5.03, h: 1.0, fontSize: 16, valign: "middle" });
    await iconCircle(s, fa.FaArrowLeft, 6.4, 5.9, 0.5, C.amber, C.ink);
    t(s, [
      { text: "היום אנחנו מבינים", options: { bold: true, color: C.amber, breakLine: true } },
      { text: "שרצף הוא פדגוגי, ארגוני ורגשי, ושהמנהל פועל גם לפני ההיעדרות ולא רק אחריה.", options: { bold: true, color: C.white } },
    ], { x: 0.95, y: 5.65, w: 5.2, h: 1.0, fontSize: 16, valign: "middle" });

    s.addNotes(
`[אולפת | כדקה ושלושת רבעי]
מה למדנו מהספרות? שתי תובנות.

הראשונה: היעדרויות מורים פוגעות בלמידה, והפגיעה גדלה כשההיעדרויות מצטברות. מחקרים גדולים בארצות הברית, של מילר ועמיתיו ושל קלוטפלטר ועמיתיו, הראו קשר בין מספר ימי ההיעדרות של המורה לבין הישגי התלמידים.

השנייה, שהפתיעה אותנו: המנהל לא רק מגיב להיעדרות. מחקר ישראלי של שפירא־לישצ'ינסקי ורוזנבלט מצא שהאקלים שהמנהל יוצר בבית הספר קשור גם להיקף ההיעדרויות.

ואיפה המתח? בתיאוריה, רצף לימודי הוא עניין פדגוגי: שהחומר ימשיך, שהיחסים והשגרה יישמרו. אבל בשבע וחצי בבוקר המנהל צריך קודם כול שמישהו יהיה בכיתה.

והפער: רוב המחקר בודק כמה מורים נעדרים, למה, ומה המחיר. מעט ידוע על מה שהמנהל עושה ושוקל ברגע ההיעדרות עצמו.

זה גם שינה את החשיבה שלנו. בהתחלה חשבנו שהבעיה לוגיסטית, רק למצוא ממלא מקום. היום אנחנו מבינים שרצף הוא פדגוגי, ארגוני ורגשי, ושהמנהל פועל גם לפני ההיעדרות ולא רק אחריה.
[מעבר לחנון]`);
  }

  // ---------------- Slide 3 ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    badge(s, 3, "יוצאים לשטח", false);
    t(s, "12 שיחות עם מי שמחליטים בבוקר", { x: 0.6, y: 1.15, w: 12.13, h: 0.75, fontSize: 36, bold: true, color: C.ink, valign: "middle" });

    // Who panel (right)
    const pX = 9.6, pY = 2.15, pW = 3.13, pH = 3.15;
    s.addShape("roundRect", { x: pX, y: pY, w: pW, h: pH, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    t(s, "את מי נחקור", { x: pX + 0.25, y: pY + 0.2, w: pW - 0.5, h: 0.35, fontSize: 14, bold: true, color: C.amber });
    s.addText("12", { isTextBox: true, x: pX + 0.25, y: pY + 0.5, w: pW - 0.5, h: 0.95, fontFace: FONT, fontSize: 60, bold: true, color: C.white, align: "right", valign: "middle", margin: 0 });
    t(s, [
      { text: "מנהלים ומנהלות", options: { bold: true, fontSize: 16, breakLine: true } },
      { text: "בצפון הארץ, מאזורים ויישובים שונים: עירוני וכפרי, יסודי ועל־יסודי, ותק שונה", options: { fontSize: 12, color: C.mist, breakLine: true } },
      { text: " ", options: { fontSize: 5, breakLine: true } },
      { text: "למה הם? הם מקבלי ההחלטות.", options: { fontSize: 12, color: C.amber, bold: true } },
    ], { x: pX + 0.25, y: pY + 1.6, w: pW - 0.5, h: 1.4, color: C.white });

    // 2x2 grid (read right-to-left)
    const gW = 4.2, gH = 1.5, gap = 0.15;
    const gx = [0.6 + gW + 0.3, 0.6];
    const gy = [2.15, 2.15 + gH + gap];
    const grid = [
      { ic: fa.FaMicrophone, head: "איך נחקור", body: "ראיון חצי מובנה (45 עד 60 דקות). נבקש מכל מנהל: \"ספר/י לי על בוקר אחד של היעדרות\". אחר כך ניתוח תמטי." },
      { ic: fa.FaSearch, head: "מה אנחנו מחפשים", body: "אסטרטגיות מונעות או מגיבות; היעדרות קצרה או ממושכת; שיקולים: פדגוגיה, תקציב, הוגנות לצוות, רווחת המורה." },
      { ic: fa.FaMountain, head: "האתגר הגדול", body: "מנהלים עלולים להציג תמונה יפה מהמציאות, ומה שהם מתארים לא תמיד זהה למה שקורה. קשה גם למצוא זמן ביומן שלהם." },
      { ic: fa.FaLightbulb, head: "מה יפתיע אותנו", body: "אם יתברר שמה שמנחה את ההחלטה הוא בעיקר \"שקט וסדר\" ולא רצף לימודי." },
    ];
    for (let i = 0; i < 4; i++) {
      const x = gx[i % 2], y = gy[Math.floor(i / 2)];
      s.addShape("roundRect", { x, y, w: gW, h: gH, rectRadius: 0.1, fill: { color: C.tint }, line: { color: C.tint } });
      await iconCircle(s, grid[i].ic, x + gW - 0.62, y + 0.17, 0.44, C.ink, C.white);
      t(s, grid[i].head, { x: x + 0.2, y: y + 0.17, w: gW - 0.95, h: 0.44, fontSize: 15, bold: true, color: C.ink, valign: "middle" });
      t(s, grid[i].body, { x: x + 0.2, y: y + 0.66, w: gW - 0.4, h: 0.78, fontSize: 12, color: C.text });
    }

    // Closing sentence
    s.addShape("roundRect", { x: 0.6, y: 5.55, w: 12.13, h: 1.3, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    t(s, [
      { text: "אם המחקר שלנו יהיה מוצלח, בסופו נבין טוב יותר ", options: { bold: true, color: C.amber } },
      { text: "איך מנהלים מאזנים, בזמן אמת, בין הצורך שמישהו יהיה בכיתה לבין הזכות של התלמידים לרצף לימודי אמיתי.", options: { color: C.white } },
    ], { x: 0.95, y: 5.65, w: 11.43, h: 1.1, fontSize: 18, valign: "middle" });

    s.addNotes(
`[חנון | כדקה וחצי]
איך נבדוק את זה? נצא לשטח ונשוחח עם 12 מנהלים ומנהלות מבתי ספר בצפון הארץ. בחרנו בתי ספר מאזורים שונים, עירוניים וכפריים, יסודיים ועל־יסודיים, ומנהלים עם ותק שונה, כדי לראות מגוון של דרכי פעולה. בחרנו במנהלים כי הם מקבלי ההחלטות.

הכלי שלנו הוא ראיון חצי מובנה. נבקש מכל מנהל לתאר בוקר אחד של היעדרות, צעד אחר צעד, ונשאל גם על היעדרות ממושכת. ראיון מאפשר לנו להבין את השיקולים ואת הדילמות, ולא רק את הנוהל הכתוב.

מה נחפש? אסטרטגיות מונעות לעומת אסטרטגיות מגיבות, הבדלים בין היעדרות קצרה לממושכת, ובעיקר את השיקולים: פדגוגיה, תקציב, הוגנות כלפי הצוות שמחליף, ורווחת המורה הנעדרת.

האתגר הגדול: מנהלים עלולים להציג תמונה יפה מהמציאות. לכן נבקש דוגמאות מוחשיות ולא רק עקרונות.

[אולפת | כחצי דקה]
ומה יפתיע אותנו? אם יתברר שמה שמנחה את ההחלטה הוא בעיקר השקט והסדר בבית הספר ולא רצף לימודי. זה יערער הנחה שלנו.

אם המחקר שלנו יהיה מוצלח, בסופו נבין טוב יותר איך מנהלים מאזנים, בזמן אמת, בין הצורך שמישהו יהיה בכיתה לבין הזכות של התלמידים לרצף לימודי אמיתי.
תודה.

[שאלות המשך אפשריות]
למה רק מנהלים? כי השאלה היא על קבלת החלטות, והם אלה שמחליטים. במחקר המשך אפשר לשמוע גם את המורים המחליפים.
למה צפון? יש לנו גישה, ויש בצפון מגוון רחב של יישובים ומגזרים.`);
  }

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();

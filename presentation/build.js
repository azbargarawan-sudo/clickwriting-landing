// Builds the final seminar presentation (Hebrew, RTL, academic register, no icons).
// Run from a directory where pptxgenjs, sharp and jszip resolve:
//   NODE_PATH=<node_modules> node build.js <out.pptx>
const path = require("path");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const JSZip = require("jszip");

const OUT = process.argv[2] || "היעדרויות-מורים-מצגת-סיום.pptx";
const LOGO = path.join(__dirname, "ono-logo.jpg");
// Optional ID numbers for the cover, kept out of git: IDS_FILE=ids.json ({"hanin": "...", "ulfat": "..."})
const IDS = process.env.IDS_FILE ? JSON.parse(require("fs").readFileSync(process.env.IDS_FILE, "utf8")) : {};
const idText = (id) => "ת.ז. " + (id || "______________");

const C = {
  ink: "12343B",     // dominant deep teal
  inkSoft: "1D4A52",
  tint: "E4F0F0",
  mist: "B7D8DB",
  green: "8CC63F",   // Ono accent, used on dark backgrounds only
  greenDark: "4E7A1E",
  text: "1B2B2E",
  muted: "56696C",
  white: "FFFFFF",
};
const FONT = "Arial";

// RTL text helper
function t(slide, text, o) {
  slide.addText(text, {
    isTextBox: true, fontFace: FONT, rtlMode: true, lang: "he-IL", align: "right",
    valign: "top", margin: 0, ...o,
  });
}

// Small section label + slide title
function header(slide, kicker, title, onDark) {
  t(slide, kicker, { x: 0.6, y: 0.5, w: 12.13, h: 0.35, fontSize: 13, bold: true, color: onDark ? C.green : C.greenDark });
  t(slide, title, { x: 0.6, y: 0.9, w: 12.13, h: 0.8, fontSize: 34, bold: true, color: onDark ? C.white : C.ink, valign: "middle" });
}

// Subheading followed by a continuous paragraph
function section(slide, heading, body, o) {
  t(slide, heading, { x: o.x, y: o.y, w: o.w, h: 0.35, fontSize: 15, bold: true, color: o.headColor || C.greenDark });
  t(slide, body, { x: o.x, y: o.y + 0.4, w: o.w, h: o.h, fontSize: o.size || 16, bold: !!o.bold, color: o.color || C.text, lineSpacingMultiple: 1.15 });
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.rtlMode = true;
  pres.title = "אסטרטגיות ניהוליות של מנהלי בתי ספר בהתמודדות עם היעדרויות מורים";
  pres.author = "חנין מנסור, אולפת עבד אל חי";

  // ---------------- Cover ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    const logo = await sharp(LOGO).trim({ threshold: 20 }).png().toBuffer();
    const meta = await sharp(logo).metadata();
    const lh = 1.55, lw = lh * (meta.width / meta.height);
    s.addImage({ data: "image/png;base64," + logo.toString("base64"), x: (13.333 - lw) / 2, y: 0.55, w: lw, h: lh });

    s.addText("סמינריון בעבודת הניהול ובמנהל חינוך", {
      isTextBox: true, x: 0.6, y: 2.45, w: 12.13, h: 0.4, fontFace: FONT, fontSize: 16, color: C.muted, align: "center", rtlMode: true, margin: 0,
    });
    s.addText("אסטרטגיות ניהוליות של מנהלי בתי ספר בהתמודדות עם היעדרויות מורים לשמירה על רצף לימודי", {
      isTextBox: true, x: 1.2, y: 3.0, w: 10.93, h: 1.5, fontFace: FONT, fontSize: 32, bold: true, color: C.ink, align: "center", valign: "middle", rtlMode: true, margin: 0,
    });
    s.addText("פרזנטציית סיום של עבודת הסמינריון", {
      isTextBox: true, x: 0.6, y: 4.6, w: 12.13, h: 0.4, fontFace: FONT, fontSize: 17, color: C.greenDark, bold: true, align: "center", rtlMode: true, margin: 0,
    });

    s.addShape("roundRect", { x: 2.4, y: 5.45, w: 8.53, h: 1.35, rectRadius: 0.12, fill: { color: C.tint }, line: { color: C.tint } });
    // Presenters: heading, then aligned name and ID columns (IDs left blank to fill in)
    const pBox = { isTextBox: true, y: 5.6, h: 1.05, fontFace: FONT, fontSize: 15, color: C.text, valign: "middle", rtlMode: true, margin: 0 };
    s.addText([
      { text: "הוגש על ידי", options: { bold: true, color: C.ink, breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: " ", options: {} },
    ], { ...pBox, x: 5.75, w: 5.0, align: "center" });
    s.addText([
      { text: " ", options: { breakLine: true } },
      { text: "חנין מנסור", options: { breakLine: true } },
      { text: "אולפת עבד אל חי", options: {} },
    ], { ...pBox, x: 8.75, w: 1.85, align: "right" });
    s.addText([
      { text: " ", options: { breakLine: true } },
      { text: idText(IDS.hanin), options: { breakLine: true } },
      { text: idText(IDS.ulfat), options: {} },
    ], { ...pBox, x: 6.4, w: 2.2, align: "right" });
    s.addText([
      { text: "המרצה", options: { bold: true, color: C.ink, breakLine: true } },
      { text: "ד״ר ליאור הלוי", options: { breakLine: true } },
      { text: "תשפ״ז, 2026", options: {} },
    ], { isTextBox: true, x: 2.6, y: 5.6, w: 2.9, h: 1.05, fontFace: FONT, fontSize: 15, color: C.text, align: "center", valign: "middle", rtlMode: true, margin: 0 });

    s.addNotes(
`[חנין | כעשר שניות]
שלום לכולם. אנחנו חנין מנסור ואולפת עבד אל חי, והמחקר שלנו עוסק באסטרטגיות ניהוליות של מנהלי בתי ספר בהתמודדות עם היעדרויות מורים לשמירה על רצף לימודי.`);
  }

  // ---------------- Slide 1: what we are trying to understand ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    header(s, "מה אנחנו מנסים להבין", "היעדרויות מורים ורצף לימודי", true);

    section(s, "הנושא",
      "היעדרויות מורים הן חלק קבוע מהמציאות הארגונית של בתי הספר. הקושי אינו בהיעדרות עצמה אלא בהחלטות שהיא מחייבת. בתוך זמן קצר על המנהל לקבוע מי ייכנס לכיתה, מה יתרחש בשיעור ומה יהיה המחיר עבור הצוות, וכאשר ההיעדרויות מצטברות עליו לשמור על רצף פדגוגי, ארגוני ורגשי ולא רק למצוא ממלא מקום (הלוי, 2026).",
      { x: 0.6, y: 1.9, w: 12.13, h: 1.35, size: 16, color: C.white, headColor: C.green });

    s.addShape("roundRect", { x: 0.6, y: 3.75, w: 12.13, h: 1.55, rectRadius: 0.12, fill: { color: C.inkSoft }, line: { color: C.inkSoft } });
    section(s, "שאלת המחקר",
      "כיצד מנהלי בתי ספר בערים בצפון הארץ מתארים את התמודדותם עם היעדרויות מורים, ואילו אסטרטגיות ושיקולים מנחים את החלטותיהם לשמירה על רצף לימודי?",
      { x: 0.95, y: 3.9, w: 11.43, h: 0.95, size: 20, bold: true, color: C.white, headColor: C.green });

    section(s, "למה דווקא השאלה הזאת",
      "אותה היעדרות יכולה להסתיים בשיעור שממשיך כסדרו או בשעת השגחה בלבד, וההבדל נקבע בהחלטות המנהל. המחקר חשוב משום שהבנת השיקולים שמאחורי ההחלטות האלה עשויה לסייע למנהלים לגבש דרכי פעולה ששומרות על הלמידה.",
      { x: 0.6, y: 5.55, w: 12.13, h: 1.0, size: 16, color: C.white, headColor: C.green });

    s.addNotes(
`[חנין | כדקה]
בוקר רגיל, שבע וחצי. מורה מתקשרת ומודיעה שלא תגיע היום. בתוך כמה דקות המנהל צריך להחליט מי נכנס לכיתה, מה יקרה בשיעור, ומה יהיה המחיר עבור הצוות.

הנושא שלנו הוא היעדרויות מורים. ההיעדרות עצמה היא חלק מהחיים של כל בית ספר. מה שמעניין אותנו הוא ההחלטות שהיא מחייבת, ובמיוחד כשההיעדרויות מצטברות והמנהל צריך לשמור על רצף פדגוגי, ארגוני ורגשי.

שאלת המחקר שלנו: כיצד מנהלי בתי ספר בערים בצפון הארץ מתארים את התמודדותם עם היעדרויות מורים, ואילו אסטרטגיות ושיקולים מנחים את החלטותיהם לשמירה על רצף לימודי?

למה דווקא השאלה הזאת? כי ראינו שאותה היעדרות יכולה להסתיים בשיעור שממשיך כסדרו, או בשעת השגחה בלבד. ההבדל נקבע בהחלטות של המנהל.

המחקר שלנו חשוב כי הבנת השיקולים האלה יכולה לעזור למנהלים לבנות דרכי פעולה ששומרות על הלמידה של התלמידים.
[מעבר לאולפת]`);
  }

  // ---------------- Slide 2: what is known and what is not ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    header(s, "מה אנחנו כבר יודעים ומה עדיין לא", "מה ידוע ומה טרם נבחן", false);

    section(s, "הטענה המרכזית מן הספרות",
      "מילר ואחרים (Miller et al., 2008) וקלוטפלטר ואחרים (Clotfelter et al., 2009) מצאו כי היעדרויות מורים פוגעות בהישגי התלמידים, וכי הפגיעה גדלה ככל שההיעדרויות מצטברות. שפירא־לישצ'ינסקי ורוזנבלט (Shapira-Lishchinsky & Rosenblatt, 2010) הראו כי האקלים האתי בבית הספר קשור להיקף ההיעדרויות מרצון, ומכאן שהמנהל משפיע על התופעה עוד לפני שהיא מתרחשת.",
      { x: 0.6, y: 1.9, w: 12.13, h: 1.4 });
    section(s, "מתח או פער",
      "רוב המחקרים עוסקים בהיקף ההיעדרויות, בגורמיהן ובמחירן. בתיאוריה רצף לימודי הוא עניין פדגוגי, ואילו בשגרת הבוקר המנהל נדרש קודם כול להבטיח נוכחות של מבוגר בכיתה. מעט ידוע על השיקולים שמנחים את המנהל ברגע ההיעדרות עצמו.",
      { x: 0.6, y: 3.7, w: 12.13, h: 1.1 });

    s.addShape("roundRect", { x: 0.6, y: 5.3, w: 12.13, h: 1.55, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    section(s, "שינוי בחשיבה",
      "בתחילת העבודה נתפסה הבעיה כעניין לוגיסטי של מציאת ממלא מקום. הקריאה הובילה להבנה שרצף לימודי הוא פדגוגי, ארגוני ורגשי, ושפעולת המנהל מתחילה עוד לפני ההיעדרות.",
      { x: 0.95, y: 5.45, w: 11.43, h: 0.85, color: C.white, headColor: C.green });

    s.addNotes(
`[אולפת | כדקה ורבע]
מה למדנו מהספרות? מילר ואחרים וקלוטפלטר ואחרים מצאו שהיעדרויות מורים פוגעות בהישגי התלמידים, והפגיעה גדלה ככל שההיעדרויות מצטברות.

מה שהפתיע אותנו הוא המחקר של שפירא־לישצ'ינסקי ורוזנבלט. הם מצאו שהאקלים האתי בבית הספר קשור להיקף ההיעדרויות מרצון. כלומר, המנהל משפיע על התופעה עוד לפני שהיא מתרחשת.

ואיפה המתח? רוב המחקרים בודקים כמה מורים נעדרים, למה, ומה המחיר. בתיאוריה רצף לימודי הוא עניין פדגוגי, אבל בשבע וחצי בבוקר המנהל צריך קודם כול שמישהו יהיה בכיתה. מעט ידוע על מה שהמנהל שוקל ברגע הזה.

הקריאה שינתה גם את החשיבה שלנו. בהתחלה חשבנו שהבעיה לוגיסטית, רק למצוא ממלא מקום. היום אנחנו מבינים שרצף הוא פדגוגי, ארגוני ורגשי, ושהמנהל פועל גם לפני ההיעדרות.
[מעבר לחנין]

[רשימת מקורות, למקרה של שאלה]
הלוי, ל' (2026). המבוא בעבודה סמינריונית איכותנית [מצגת הרצאה]. סמינריון בעבודת הניהול ובמנהל חינוך, הקריה האקדמית אונו.
Clotfelter, C. T., Ladd, H. F., & Vigdor, J. L. (2009). Are teacher absences worth worrying about in the United States? Education Finance and Policy, 4(2), 115-149.
Miller, R. T., Murnane, R. J., & Willett, J. B. (2008). Do teacher absences impact student achievement? Longitudinal evidence from one urban school district. Educational Evaluation and Policy Analysis, 30(2), 181-200.
Shapira-Lishchinsky, O., & Rosenblatt, Z. (2010). School ethical climate and teachers' voluntary absence. Journal of Educational Administration, 48(2), 164-181.`);
  }

  // ---------------- Slide 3: conceptual framework ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    header(s, "מסגרת מושגית", "המושגים המרכזיים והקשרים ביניהם", false);

    const nodes = ["היעדרות מורים", "רצף לימודי", "קבלת החלטות ניהולית", "אסטרטגיות ניהוליות"];
    const nW = 2.75, nH = 0.95, nGap = 0.38, nY = 1.95;
    for (let i = 0; i < nodes.length; i++) {
      const x = 12.73 - nW - i * (nW + nGap);
      const last = i === nodes.length - 1;
      if (!last) s.addShape("line", { x: x - nGap, y: nY + nH / 2, w: nGap, h: 0, line: { color: C.ink, width: 1.5 } });
      s.addShape("roundRect", { x, y: nY, w: nW, h: nH, rectRadius: 0.12, fill: { color: last ? C.ink : C.tint }, line: { color: last ? C.ink : C.tint } });
      s.addText(nodes[i], {
        isTextBox: true, x: x + 0.1, y: nY, w: nW - 0.2, h: nH, fontFace: FONT, fontSize: 16, bold: true,
        color: last ? C.white : C.ink, align: "center", valign: "middle", rtlMode: true, margin: 0,
      });
    }

    section(s, "רצף לימודי",
      "המסגרת נפתחת במושג היעדרות מורים ועוברת אל הרצף הלימודי, המובן כאן בשלושה ממדים. הממד הפדגוגי עוסק בהמשך התוכן והלמידה, הממד הארגוני בשיבוץ, במערכת השעות ובעומס על הצוות, והממד הרגשי ביחסים ובתחושת הביטחון של התלמידים (הלוי, 2026).",
      { x: 0.6, y: 3.25, w: 12.13, h: 1.35 });
    section(s, "מהחלטה לאסטרטגיה",
      "הרצף תלוי בקבלת החלטות ניהולית, שבה המנהל שוקל צרכים מתחרים בזמן קצר ובמשאבים מוגבלים. מההחלטות נגזרות אסטרטגיות מגיבות, כגון ממלא מקום, איחוד כיתות ושעה פרטנית, ואסטרטגיות מונעות, כגון מאגר קבוע של ממלאי מקום וחומרי עבודה שהוכנו מראש.",
      { x: 0.6, y: 5.0, w: 12.13, h: 1.35 });

    s.addNotes(
`[חנין | כחמישים שניות]
כך נראית המסגרת המושגית שלנו, מימין לשמאל.

היא מתחילה בהיעדרות מורים ועוברת אל המושג המרכזי, רצף לימודי. אנחנו מבינים את הרצף בשלושה ממדים. פדגוגי, כלומר שהתוכן והלמידה ממשיכים. ארגוני, כלומר שיבוץ, מערכת שעות, והעומס על הצוות שמחליף. ורגשי, כלומר שהתלמידים נשארים עם מבוגר מוכר ומרגישים ביטחון.

הרצף הזה תלוי בקבלת החלטות ניהולית. המנהל שוקל צרכים מתחרים, בזמן קצר ובמשאבים מוגבלים. מתוך ההחלטות נגזרות אסטרטגיות מגיבות, כמו ממלא מקום או איחוד כיתות, ואסטרטגיות מונעות, כמו מאגר קבוע של ממלאי מקום וחומרי עבודה מוכנים מראש. את החוליה האחרונה הזאת, איך זה קורה בשטח, אנחנו רוצים לחקור.
[מעבר לאולפת]`);
  }

  // ---------------- Slide 4: field, who and how ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    header(s, "יוצאים לשטח", "את מי נחקור ואיך", false);

    s.addShape("roundRect", { x: 0.6, y: 1.95, w: 2.6, h: 4.9, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    s.addText("12", { isTextBox: true, x: 0.6, y: 3.2, w: 2.6, h: 1.1, fontFace: FONT, fontSize: 66, bold: true, color: C.green, align: "center", valign: "middle", margin: 0 });
    s.addText([
      { text: "מנהלים ומנהלות", options: { bold: true, fontSize: 16, color: C.white, breakLine: true } },
      { text: "בערים בצפון הארץ", options: { fontSize: 14, color: C.mist } },
    ], { isTextBox: true, x: 0.8, y: 4.4, w: 2.2, h: 1.0, fontFace: FONT, rtlMode: true, align: "center", valign: "top", margin: 0 });

    const O = { x: 3.5, w: 9.23, size: 15 };
    section(s, "את מי נחקור",
      "המחקר יתבסס על ראיונות עם 12 מנהלים ומנהלות של בתי ספר יסודיים ועל־יסודיים בערים בצפון הארץ, בעלי ותק שונה בתפקיד. המנהלים נבחרו משום שהם מקבלי ההחלטות בעת היעדרות, וההתמקדות בערים מאפשרת לבחון את התופעה בהקשר אחיד ולהשוות בין ערים שונות.",
      { ...O, y: 1.95, h: 1.1 });
    section(s, "איך נחקור",
      "הכלי המרכזי הוא ראיון חצי מובנה. הראיון ייפתח בשאלות רקע על בית הספר ועל הצוות, ובהמשך יתבקשו המנהלים לתאר את הבוקר האחרון שבו מורה נעדר, צעד אחר צעד, ולספר על היעדרות ממושכת. הראיון מאפשר ללמוד על שיקולים ודילמות ולא רק על נהלים כתובים, והנתונים ינותחו בניתוח תמטי.",
      { ...O, y: 3.55, h: 1.4 });
    section(s, "שיקולים אתיים",
      "המשתתפים יחתמו על טופס הסכמה מדעת, הראיונות יוקלטו רק באישורם, ושמות המנהלים, בתי הספר והערים לא יופיעו בעבודה.",
      { ...O, y: 5.15, h: 0.8 });

    s.addNotes(
`[אולפת | כדקה]
איך נבדוק את זה? נשוחח עם 12 מנהלים ומנהלות של בתי ספר יסודיים ועל־יסודיים בערים בצפון הארץ, עם ותק שונה. בחרנו במנהלים כי הם מקבלי ההחלטות בעת היעדרות, ובחרנו בערים כדי לבחון את התופעה בהקשר אחיד ולהשוות בין ערים שונות.

הכלי שלנו הוא ראיון חצי מובנה. נפתח בשאלות רקע על בית הספר ועל הצוות, ואחר כך נבקש מכל מנהל לתאר את הבוקר האחרון שבו מורה נעדר, צעד אחר צעד, ולספר גם על היעדרות ממושכת. כך נשמע את השיקולים ואת הדילמות, ולא רק את הנוהל הכתוב. את הראיונות ננתח בניתוח תמטי.

ונקפיד על אתיקה: הסכמה מדעת, הקלטה רק באישור, ואנונימיות מלאה.
[מעבר לחנין]`);
  }

  // ---------------- Slide 5: field, what we look for ----------------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    header(s, "יוצאים לשטח", "מה נחפש ומה עלול להפתיע", false);

    section(s, "מה אנחנו מחפשים",
      "הניתוח יתמקד באסטרטגיות מונעות לעומת מגיבות, בהבדלים בין היעדרות קצרה לממושכת ובאיזון בין שיקולים פדגוגיים, שיקולי תקציב, הוגנות כלפי הצוות ורווחת המורה הנעדר.",
      { x: 0.6, y: 1.95, w: 12.13, h: 0.85 });
    section(s, "האתגר הגדול",
      "מנהלים עשויים להציג תמונה חיובית מהמציאות, ולכן יתבקשו דוגמאות מוחשיות. גם תיאום זמן עם מנהלים עמוסים צפוי להיות קשה.",
      { x: 0.6, y: 3.2, w: 12.13, h: 0.6 });
    section(s, "מה יפתיע אותנו",
      "ממצא שלפיו ההחלטות מונחות בעיקר על ידי שמירה על שקט וסדר ולא על ידי רצף לימודי יערער את הנחת המוצא.",
      { x: 0.6, y: 4.3, w: 12.13, h: 0.5 });

    s.addShape("roundRect", { x: 0.6, y: 5.55, w: 12.13, h: 1.3, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink } });
    t(s, [
      { text: "אם המחקר שלנו יהיה מוצלח, בסופו נבין טוב יותר ", options: { bold: true, color: C.green } },
      { text: "את האופן שבו מנהלים מאזנים, בזמן אמת, בין הצורך להבטיח נוכחות של מבוגר בכיתה ובין זכותם של התלמידים לרצף לימודי.", options: { color: C.white } },
    ], { x: 0.95, y: 5.65, w: 11.43, h: 1.1, fontSize: 18, valign: "middle", lineSpacingMultiple: 1.1 });

    s.addNotes(
`[חנין | כארבעים שניות]
מה נחפש בראיונות? אסטרטגיות מונעות לעומת מגיבות, הבדלים בין היעדרות קצרה לממושכת, ואת האיזון בין פדגוגיה, תקציב, הוגנות כלפי הצוות שמחליף, ורווחת המורה הנעדר.

האתגר הגדול: מנהלים עלולים להציג תמונה יפה מהמציאות, ולכן נבקש דוגמאות מוחשיות. וגם לא יהיה פשוט למצוא זמן ביומן של מנהלים.

ומה יפתיע אותנו? אם יתברר שמה שמנחה את ההחלטות הוא בעיקר השקט והסדר בבית הספר ולא הרצף הלימודי. זה יערער הנחה שלנו.

[אולפת | כרבע דקה, משפט הסיום]
אם המחקר שלנו יהיה מוצלח, בסופו נבין טוב יותר איך מנהלים מאזנים, בזמן אמת, בין הצורך שמישהו יהיה בכיתה לבין הזכות של התלמידים לרצף לימודי.
תודה.

[שאלות המשך אפשריות]
למה רק מנהלים? כי השאלה היא על קבלת החלטות, והם אלה שמחליטים. במחקר המשך אפשר לשמוע גם את המורים המחליפים.
למה רק ערים? כדי לבחון את התופעה בהקשר אחיד. בתי ספר בכפרים פועלים בתנאים אחרים, וזה יכול להיות כיוון למחקר המשך.
למה ראיונות ולא שאלון? כי אנחנו רוצים להבין שיקולים ודילמות, ואלה עולים מסיפור מוחשי ולא מסימון תשובות.`);
  }

  // pptxgenjs only marks some paragraphs rtl; force every Hebrew paragraph to RTL
  const zip = await JSZip.loadAsync(await pres.write({ outputType: "nodebuffer" }));
  const hebrew = /[֐-׿]/;
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/(slides|notesSlides)\/[^/]+\.xml$/.test(n))) {
    let xml = await zip.file(name).async("string");
    xml = xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (para, inner) => {
      if (!hebrew.test(inner)) return para;
      if (/^<a:pPr\b/.test(inner)) {
        inner = inner.replace(/^<a:pPr\b([^>]*?)(\/?)>/, (m, attrs, slash) =>
          `<a:pPr${attrs.replace(/\s+rtl="[01]"/, "")} rtl="1"${slash}>`);
      } else {
        inner = '<a:pPr rtl="1"/>' + inner;
      }
      // Viewers that ignore rtl="1" (e.g. iOS Quick Look) still honor Unicode
      // embedding marks, so wrap each run in RLE ... PDF.
      inner = inner.replace(/<a:t>([^<]+)<\/a:t>/g, (m, txt) => `<a:t>‫${txt}‬</a:t>`);
      return `<a:p>${inner}</a:p>`;
    });
    zip.file(name, xml);
  }
  require("fs").writeFileSync(OUT, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  console.log("wrote", OUT);
})();

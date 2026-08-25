const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

const DIR = __dirname;
const LOGO = path.join(DIR, 'peres_logo.jpg');
const DIAGRAM = path.join(DIR, 'findings_path.png');

// palette
const INK = '16202B';
const NAVY = '1B3A57';
const TEAL = '2E7898';
const TEALL = 'DCE8EE';
const ROSE = 'A9575F';
const ROSEL = 'F0E1E2';
const SOFT = 'F2F5F7';
const MUTED = '5F6E7A';
const WHITE = 'FFFFFF';

const F = 'Arial';
const W = 13.3, H = 7.5;
const M = 0.62;                 // side margin
const CW = W - 2 * M;           // content width

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.rtlMode = true;
pres.author = 'המרכז האקדמי פרס';
pres.title = 'היענות לבדיקות ממוגרפיה בחברה הערבית בישראל';

// ---- helpers -------------------------------------------------------------
const rtl = (o = {}) => Object.assign({ fontFace: F, rtlMode: true, align: 'right', color: INK }, o);

function slideTitle(s, text, opts = {}) {
  s.addText(text, rtl({
    x: M, y: 0.42, w: CW, h: 0.72, fontSize: 30, bold: true,
    color: opts.color || NAVY, margin: 0, valign: 'middle',
  }));
}

function kicker(s, text, color) {
  s.addText(text, rtl({
    x: M, y: 0.16, w: CW, h: 0.3, fontSize: 12, bold: true,
    color: color || TEAL, charSpacing: 1.5, margin: 0, valign: 'middle',
  }));
}

function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.09,
    fill: { color: fill || SOFT },
    line: { color: fill || SOFT, width: 0 },
    shadow: { type: 'outer', angle: 90, blur: 10, offset: 0.045, color: 'BFCBD3', opacity: 0.5 },
  });
}

function badge(s, x, y, d, label, fill) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d, fill: { color: fill || TEAL }, line: { color: fill || TEAL, width: 0 },
  });
  s.addText(label, {
    x, y, w: d, h: d, fontFace: F, fontSize: 15, bold: true,
    color: WHITE, align: 'center', valign: 'middle', margin: 0,
  });
}

// pulled participant quote, tinted card
function quoteCard(s, x, y, w, h, quote, credit, tint, bar) {
  card(s, x, y, w, h, tint);
  s.addText('”', {
    x: x + w - 0.66, y: y + 0.04, w: 0.56, h: 0.78, fontFace: F, fontSize: 40,
    bold: true, color: bar, align: 'center', valign: 'middle', margin: 0,
  });
  s.addText(quote, rtl({
    x: x + 0.3, y: y + 0.56, w: w - 0.9, h: h - 1.44, fontSize: 15.5, italic: true,
    color: INK, valign: 'top', margin: 0, lineSpacingMultiple: 1.22,
  }));
  s.addText(credit, rtl({
    x: x + 0.3, y: y + h - 0.78, w: w - 0.6, h: 0.56, fontSize: 11.5,
    color: MUTED, margin: 0, valign: 'middle',
  }));
}

// numbered finding rows
function rows(s, x, y, w, items, dotColor, rowH) {
  const rh = rowH || 1.02;
  items.forEach((it, i) => {
    const yy = y + i * rh;
    badge(s, x + w - 0.42, yy + 0.03, 0.42, String(i + 1), dotColor);
    s.addText(it.h, rtl({ x, y: yy, w: w - 0.62, h: 0.32, fontSize: 15.5, bold: true, margin: 0, valign: 'middle' }));
    s.addText(it.t, rtl({ x, y: yy + 0.33, w: w - 0.62, h: rh - 0.42, fontSize: 12.5, color: MUTED, margin: 0, valign: 'top', lineSpacingMultiple: 1.14 }));
  });
}

function footNote(s, text) {
  s.addText(text, rtl({ x: M, y: H - 0.52, w: CW, h: 0.3, fontSize: 10.5, color: MUTED, margin: 0, valign: 'middle' }));
}

const S = (bg) => { const s = pres.addSlide(); s.background = { color: bg || WHITE }; return s; };

// ==========================================================================
// 1. cover
// ==========================================================================
{
  const s = S(WHITE);
  s.addImage({ path: LOGO, x: (W - 1.5) / 2, y: 0.42, w: 1.5, h: 1.5 });
  s.addText('המרכז האקדמי פרס', { x: 0, y: 2.06, w: W, h: 0.34, fontFace: F, fontSize: 17, bold: true, color: NAVY, align: 'center', rtlMode: true, margin: 0 });
  s.addText('החוג למנהל מערכות בריאות  |  תואר ראשון', { x: 0, y: 2.40, w: W, h: 0.3, fontFace: F, fontSize: 13, color: MUTED, align: 'center', rtlMode: true, margin: 0 });

  s.addText('פרויקט גמר', { x: 0, y: 2.92, w: W, h: 0.32, fontFace: F, fontSize: 13, bold: true, color: TEAL, align: 'center', rtlMode: true, charSpacing: 2, margin: 0 });
  s.addText('היענות לבדיקות ממוגרפיה בחברה הערבית בישראל', { x: 0.8, y: 3.30, w: W - 1.6, h: 0.62, fontFace: F, fontSize: 32, bold: true, color: NAVY, align: 'center', rtlMode: true, margin: 0 });
  s.addText('חסמים, מאיצים ודרכים להגברת ההיענות', { x: 0.8, y: 3.94, w: W - 1.6, h: 0.44, fontFace: F, fontSize: 20, color: ROSE, align: 'center', rtlMode: true, margin: 0 });
  s.addText('מחקר איכותני מבוסס שנים עשר ראיונות עומק', { x: 0.8, y: 4.42, w: W - 1.6, h: 0.34, fontFace: F, fontSize: 13.5, color: MUTED, align: 'center', rtlMode: true, margin: 0 });

  card(s, 3.15, 5.02, W - 6.3, 1.28, SOFT);
  s.addText('מגישות: מראם זיד  |  טגאיה סמאנך  |  עאליה אבו עראר  |  לילה נגילי', { x: 2.2, y: 5.16, w: W - 4.4, h: 0.32, fontFace: F, fontSize: 12.5, bold: true, color: INK, align: 'center', rtlMode: true, margin: 0 });
  s.addText('בהנחיית: ד"ר אסנת בשקין', { x: 3.3, y: 5.52, w: W - 6.6, h: 0.3, fontFace: F, fontSize: 13, color: INK, align: 'center', rtlMode: true, margin: 0 });
  s.addText('תאריך הגשה: ______________          תשפ"ו', { x: 3.3, y: 5.86, w: W - 6.6, h: 0.3, fontFace: F, fontSize: 12, color: MUTED, align: 'center', rtlMode: true, margin: 0 });
  s.addNotes('פתיחה קצרה: שם העבודה, שמות המגישות והמנחה. לא להתעכב, כחצי דקה.');
}

// ==========================================================================
// 2. agenda
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'סדר ההצגה');
  slideTitle(s, 'מה נציג היום');
  const items = [
    ['1', 'הרקע והפער', 'למה הנושא, ומה הנתונים מראים'],
    ['2', 'שאלת המחקר', 'מה בדיוק ביקשנו לברר'],
    ['3', 'שיטת המחקר', 'שנים עשר ראיונות עומק וניתוח תמטי'],
    ['4', 'ארבע התמות', 'הממצאים מפי הנשים עצמן'],
    ['5', 'דיון', 'מה חידשנו מול הספרות, ומה הפתיע'],
    ['6', 'מסקנות והמלצות', 'מה עושים עם זה מחר בבוקר'],
  ];
  const cw = (CW - 2 * 0.32) / 3, ch = 1.62;
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + (2 - col) * (cw + 0.32);
    const y = 1.62 + row * (ch + 0.34);
    card(s, x, y, cw, ch, row === 0 ? TEALL : SOFT);
    badge(s, x + cw - 0.68, y + 0.26, 0.46, it[0], row === 0 ? TEAL : ROSE);
    s.addText(it[1], rtl({ x: x + 0.26, y: y + 0.24, w: cw - 1.02, h: 0.44, fontSize: 16.5, bold: true, margin: 0, valign: 'middle' }));
    s.addText(it[2], rtl({ x: x + 0.26, y: y + 0.78, w: cw - 0.52, h: 0.66, fontSize: 12.5, color: MUTED, margin: 0, valign: 'top', lineSpacingMultiple: 1.16 }));
  });
  card(s, M, 5.5, CW, 0.86, SOFT);
  s.addText('חלוקת ההצגה: מציגה א׳ פרקים 1 עד 2  |  מציגה ב׳ פרק 3  |  מציגה ג׳ פרק 4  |  מציגה ד׳ פרקים 5 עד 6  |  משך כולל: 15 דקות',
    { x: M + 0.24, y: 5.62, w: CW - 0.48, h: 0.62, fontFace: F, fontSize: 13, color: INK, align: 'center', rtlMode: true, margin: 0, valign: 'middle' });
  s.addNotes('להציג את סדר הדברים ואת חלוקת הזמן בין ארבע המציגות. כחצי דקה.');
}

// ==========================================================================
// 3. background, the numbers
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'רקע');
  slideTitle(s, 'בדיקה חינמית, פער שנשאר');
  s.addText('סרטן השד הוא הגידול הממאיר השכיח ביותר בקרב נשים בישראל. הממוגרפיה ניתנת ללא תשלום בסל הבריאות לנשים בגילאי 50 עד 74 אחת לשנתיים, ואף על פי כן שיעורי הביצוע אינם שווים בין הקבוצות.',
    rtl({ x: M, y: 1.28, w: CW, h: 0.62, fontSize: 14.5, color: MUTED, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 }));

  const stats = [
    ['78.2%', 'נשים יהודיות', 'ביצוע ממוגרפיה בגילאי 50 עד 74, סקר 2017', TEAL, TEALL],
    ['64.8%', 'נשים ערביות', 'אותו סקר, אותה שנה, אותה זכאות', ROSE, ROSEL],
    ['48 מול 62', 'חציון גיל האבחון', 'נשים בדואיות מול נשים יהודיות בדרום', NAVY, SOFT],
  ];
  const cw = (CW - 2 * 0.34) / 3;
  stats.forEach((st, i) => {
    const x = M + (2 - i) * (cw + 0.34);
    card(s, x, 2.16, cw, 2.5, st[4]);
    s.addText(st[0], { x: x + 0.2, y: 2.42, w: cw - 0.4, h: 0.86, fontFace: F, fontSize: 42, bold: true, color: st[3], align: 'center', rtlMode: true, margin: 0, valign: 'middle' });
    s.addText(st[1], { x: x + 0.2, y: 3.34, w: cw - 0.4, h: 0.36, fontFace: F, fontSize: 16, bold: true, color: INK, align: 'center', rtlMode: true, margin: 0, valign: 'middle' });
    s.addText(st[2], { x: x + 0.28, y: 3.76, w: cw - 0.56, h: 0.66, fontFace: F, fontSize: 12, color: MUTED, align: 'center', rtlMode: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.16 });
  });

  card(s, M, 4.98, CW, 1.32, NAVY);
  s.addText('הפער אינו כלכלי. הבדיקה חינמית לשתי הקבוצות, ולכן ההסבר מוכרח להימצא במקום אחר.',
    { x: M + 0.3, y: 5.16, w: CW - 0.6, h: 0.44, fontFace: F, fontSize: 17, bold: true, color: WHITE, align: 'center', rtlMode: true, margin: 0, valign: 'middle' });
  s.addText('ולכן שאלנו את הנשים עצמן.',
    { x: M + 0.3, y: 5.66, w: CW - 0.6, h: 0.4, fontFace: F, fontSize: 14, color: 'C9D8E2', align: 'center', rtlMode: true, margin: 0, valign: 'middle' });
  footNote(s, 'הלשכה המרכזית לסטטיסטיקה, 2019;  Ben Shitrit et al., 2024');
  s.addNotes('שלושת המספרים הם הבסיס לכל העבודה. להדגיש: הפער קיים למרות שהבדיקה חינמית, ואצל נשים בדואיות המחלה מתגלה כארבע עשרה שנים מוקדם יותר, כלומר חלק מהתחלואה קורה מתחת לגיל הזימון.');
}

// ==========================================================================
// 4. what the literature says
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'סקירת ספרות');
  slideTitle(s, 'מה כבר ידוע, ומה נשאר פתוח');
  const left = [
    { h: 'חסמים תרבותיים ורגשיים', t: 'בושה וחשיפת גוף, חשש מתיוג ומרכילות, פחד מן המחלה ומתוצאות הבדיקה, ותפיסות פטליסטיות הרואות במחלה גורל  (Cohen & Azaiza, 2006)' },
    { h: 'חסמים מבניים', t: 'מרחק ותלות בהסעה, היעדר בודקת אישה, שפה, וזימון שאינו מגיע או שאינו מובן  (Azaiza et al., 2010)' },
    { h: 'מאיצים מוכחים', t: 'המלצת רופא היא המנבא החזק ביותר, לצד זימון יזום, ניידת ממוגרפיה ותמיכה של הרשת החברתית  (Freund et al., 2019)' },
  ];
  rows(s, M + CW * 0.42 + 0.3, 1.36, CW * 0.58 - 0.3, left, TEAL, 1.36);

  card(s, M, 1.36, CW * 0.42, 4.1, NAVY);
  s.addText('הפער שהספרות משאירה', rtl({ x: M + 0.3, y: 1.66, w: CW * 0.42 - 0.6, h: 0.4, fontSize: 17, bold: true, color: WHITE, margin: 0, valign: 'middle' }));
  s.addText('רוב המחקרים כמותיים. הם מודדים כמה נשים נבדקות ואילו משתנים קשורים לכך, אך אינם מתארים כיצד החסמים פועלים בחיים עצמם.',
    rtl({ x: M + 0.3, y: 2.14, w: CW * 0.42 - 0.6, h: 1.0, fontSize: 13.5, color: 'C9D8E2', margin: 0, valign: 'top', lineSpacingMultiple: 1.24 }));
  s.addText('רוב הנשים הערביות מעל גיל חמישים כבר עברו ממוגרפיה לפחות פעם אחת, ובכל זאת ההיענות ללוח הזמנים המומלץ נותרת נמוכה.',
    rtl({ x: M + 0.3, y: 3.28, w: CW * 0.42 - 0.6, h: 1.0, fontSize: 13.5, italic: true, color: WHITE, margin: 0, valign: 'top', lineSpacingMultiple: 1.24 }));
  s.addText('Cohen & Azaiza, 2006', rtl({ x: M + 0.3, y: 4.9, w: CW * 0.42 - 0.6, h: 0.3, fontSize: 11, color: '9FB6C6', margin: 0, valign: 'middle' }));
  footNote(s, 'הסקירה המלאה בעבודה כוללת 23 מקורות, מרביתם מן העשור האחרון');
  s.addNotes('לא לקרוא את כל הרשימה. להדגיש את הכרטיס הכהה: הידע קיים בספרות, מה שחסר הוא ההסבר כיצד החסמים פועלים בפועל. זו הנקודה שממנה נולדה שאלת המחקר.');
}

// ==========================================================================
// 5. research question (dark)
// ==========================================================================
{
  const s = S(NAVY);
  kicker(s, 'שאלת המחקר', '8FB4CB');
  s.addText('אילו גורמים מעכבים ומקדמים את היענותן של נשים\nבחברה הערבית בישראל לבדיקות ממוגרפיה,\nוכיצד ניתן להגביר אותה?',
    { x: M, y: 1.22, w: CW, h: 2.1, fontFace: F, fontSize: 28, bold: true, color: WHITE, align: 'right', rtlMode: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.28 });

  const goals = [
    ['לזהות', 'את החסמים והמאיצים כפי שהנשים עצמן מנסחות אותם'],
    ['להבין', 'כיצד הגורמים פועלים זה על זה ולא רק כרשימה'],
    ['להמליץ', 'המלצות יישומיות למקבלי החלטות בקופות ובמשרד'],
  ];
  const cw = (CW - 2 * 0.34) / 3;
  goals.forEach((g, i) => {
    const x = M + (2 - i) * (cw + 0.34);
    s.addShape(pres.ShapeType.roundRect, { x, y: 3.86, w: cw, h: 1.72, rectRadius: 0.09, fill: { color: '24486A' }, line: { color: '3A628A', width: 1 } });
    s.addText(g[0], rtl({ x: x + 0.26, y: 4.06, w: cw - 0.52, h: 0.4, fontSize: 18, bold: true, color: '8FD3E8', margin: 0, valign: 'middle' }));
    s.addText(g[1], rtl({ x: x + 0.26, y: 4.5, w: cw - 0.52, h: 0.92, fontSize: 13, color: 'DCE8EE', margin: 0, valign: 'top', lineSpacingMultiple: 1.2 }));
  });
  s.addText('מחקר איכותני, ולכן אין השערות מחקר אלא שאלה פתוחה.',
    { x: M, y: 5.86, w: CW, h: 0.36, fontFace: F, fontSize: 12.5, color: '9FB6C6', align: 'right', rtlMode: true, margin: 0, valign: 'middle' });
  s.addNotes('לקרוא את השאלה בקול. להדגיש שבמחקר איכותני אין השערות, ולכן נכנסנו לשדה בלי לדעת מה נמצא.');
}

// ==========================================================================
// 6. method
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'שיטת המחקר');
  slideTitle(s, 'איך אספנו ואיך ניתחנו');
  const cards = [
    ['סוג המחקר', 'איכותני. ראיונות עומק חצי מובנים, המאפשרים לחסמים שאינם נכנסים לשאלון סגור לעלות מעצמם'],
    ['המדגם', 'שתים עשרה נשים בגילאי 44 עד 66. דגימה מכוונת וכדור שלג, עם שונוּת מכוונת בדת, ביישוב ובהשכלה'],
    ['הכלי', 'מדריך ראיון של שש עשרה שאלות קבועות ובהן שאלת פתיחה. אותו נוסח ואותו סדר בכל הראיונות'],
    ['הניתוח', 'ניתוח תמטי בחמישה שלבים: קריאה חוזרת, קידוד פתוח, איחוד לקטגוריות, גיבוש תמות ובחירת ציטוטים'],
  ];
  const cw = (CW - 3 * 0.28) / 4;
  cards.forEach((c, i) => {
    const x = M + (3 - i) * (cw + 0.28);
    card(s, x, 1.4, cw, 2.5, i % 2 === 0 ? TEALL : SOFT);
    badge(s, x + cw - 0.66, 1.62, 0.44, String(i + 1), i % 2 === 0 ? TEAL : ROSE);
    s.addText(c[0], rtl({ x: x + 0.26, y: 1.62, w: cw - 1.0, h: 0.44, fontSize: 16, bold: true, margin: 0, valign: 'middle' }));
    s.addText(c[1], rtl({ x: x + 0.26, y: 2.2, w: cw - 0.52, h: 1.56, fontSize: 12.5, color: MUTED, margin: 0, valign: 'top', lineSpacingMultiple: 1.18 }));
  });

  card(s, M, 4.14, CW, 2.14, SOFT);
  s.addText('הליך ואתיקה', rtl({ x: M + 0.32, y: 4.3, w: CW - 0.64, h: 0.36, fontSize: 15.5, bold: true, color: NAVY, margin: 0, valign: 'middle' }));
  const eth = [
    'הראיונות נמשכו 32 עד 45 דקות, נערכו בבתי המרואיינות לפי בחירתן, הוקלטו בהסכמה ותומללו במלואם.',
    'שישה ראיונות בעברית, חמישה בערבית ואחד באמהרית. כל אחת מארבע חברות הצוות ערכה שלושה ראיונות.',
    'הסכמה מדעת בעל פה, זכות להפסיק בכל שלב, שמות בדויים וטשטוש כל פרט מזהה. לא רואיינו קטינות.',
    'בראיון אחד עלה ממצא גופני שלא דווח לאיש מקצוע. לא ניתן ייעוץ בתוך הראיון, ובסיומו הופנתה המרואיינת למרפאה.',
  ];
  eth.forEach((e, i) => {
    s.addText(e, rtl({ x: M + 0.32, y: 4.72 + i * 0.36, w: CW - 0.64, h: 0.34, fontSize: 12.5, color: INK, margin: 0, valign: 'middle', bullet: { code: '25AA' } }));
  });
  s.addNotes('להתעכב על שני דברים: למה איכותני ולא שאלון, ועל הסוגיה האתית בראיון האחרון. זה מראה שהתמודדנו עם דילמה אמיתית ולא רק מילאנו טופס.');
}

// ==========================================================================
// 7. sample table
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'המדגם');
  slideTitle(s, 'שתים עשרה נשים, טווח מלא של היענות');
  // columns reversed so the table reads right to left
  const head = ['מיקום על ציר ההיענות', 'השכלה ועיסוק', 'יישוב', 'גיל', 'שם בדוי', '#'];
  const data = [
    ['נבדקה פעמיים, באיחור של כשנתיים', '12 שנות לימוד; סייעת בגן', 'רמלה', '54', 'ופאא דכוור', '1'],
    ['נבדקה אחרי פנייה טלפונית באמהרית', '4 שנות לימוד; עובדת ניקיון', 'חולון', '58', 'ברכנש אלמו', '2'],
    ['נבדקת מתחת לגיל הזימון, בהפניית רופאה', 'תואר ראשון; מורה', 'ערערה בנגב', '47', 'חנאן אבו סביח', '3'],
    ['בדיקה ראשונה בגיל 51 אחרי שנתיים', '12 שנות לימוד; עובדת במספרה', 'רמלה', '52', "איבתיסאם דאהר", '4'],
    ['נבדקת בקביעות 11 שנים, בליווי בתה', '8 שנות לימוד; עקרת בית', 'נצרת', '61', 'סועאד זועבי', '5'],
    ['נבדקת בקביעות מגיל 45, שש בדיקות', 'תואר ראשון; מזכירה בתיכון', 'חיפה', '56', "ג'ולייט חורי", '6'],
    ['מעולם לא נבדקה; הזימון במגירה', '12 שנות לימוד; עסק משפחתי', 'דלית אל-כרמל', '50', 'נאדיה חלבי', '7'],
    ['מעולם לא נבדקה ומעולם לא זומנה', '8 שנות לימוד; עקרת בית', 'רהט', '44', 'פאטמה אבו קווידר', '8'],
    ['חלתה בגיל 58 אחרי כשנה וחצי המתנה', 'עבודה סוציאלית; מתנדבת', 'טייבה', '63', 'אמל סרחאן', '9'],
    ['טרם בגיל הזימון; מרכזת את הזימונים', 'סיעוד; אחות אחראית', 'כפר כנא', '49', 'הודא מנסור', '10'],
    ['נבדקה פעם אחת לפני כשש שנים', '8 שנות לימוד; דוכן בשוק', 'לוד', '57', 'סמאח דיאב', '11'],
    ['נבדקת בקביעות מגיל 50, שמונה בדיקות', 'היסטוריה; מורה בגמלאות', 'שפרעם', '66', 'רימא נאסר', '12'],
  ];
  const cellBase = { fontFace: F, fontSize: 9.6, align: 'right', valign: 'middle', margin: [2, 5, 2, 5], color: INK };
  const rowsData = [
    head.map(h => ({ text: h, options: Object.assign({}, cellBase, { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 10 }) })),
    ...data.map((r, i) => r.map(c => ({ text: c, options: Object.assign({}, cellBase, { fill: { color: i % 2 ? 'FFFFFF' : SOFT } }) }))),
  ];
  s.addTable(rowsData, {
    x: M, y: 1.34, w: CW, colW: [3.9, 2.9, 1.5, 0.62, 2.16, 0.98],
    rowH: 0.345, border: { type: 'solid', color: 'E1E7EB', pt: 0.75 },
  });
  footNote(s, 'שמות בדויים. כל פרט מזהה שונה או טושטש.');
  s.addNotes('לא להקריא את הטבלה. להצביע על שלוש שורות בלבד: מי שנבדקת בקביעות, מי שמעולם לא נבדקה, ומי שחלתה. להסביר שהמדגם נבנה בכוונה כך שיכלול את כל הטווח.');
}

// ==========================================================================
// 8. theme map
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'ממצאים');
  slideTitle(s, 'הדרך אל הבדיקה, והיכן פועלת כל תמה');
  const px = fs.readFileSync(DIAGRAM);
  const dw = 11.9, dh = dw * px.readUInt32BE(20) / px.readUInt32BE(16);
  s.addImage({ path: DIAGRAM, x: (W - dw) / 2, y: 1.62, w: dw, h: dh });
  s.addNotes('להסביר שהחסמים אינם פועלים במקביל אלא כל אחד בשלב אחר בדרך אל הבדיקה, ושהרצועה התחתונה היא מה שמעביר את האישה מתחנה לתחנה.');
}

// ==========================================================================
// 9-12. the four themes
// ==========================================================================
const themes = [
  {
    n: '1', title: 'הידע כתנאי הכרחי שאינו מספיק', tint: ROSEL, bar: ROSE, dot: ROSE,
    pts: [
      { h: 'כולן ידעו', t: 'גם הנשים שמעולם לא נבדקו ידעו מהי הבדיקה ולשם מה היא נועדה. הידע אינו מבחין בין מי שנבדקת למי שלא' },
      { h: 'הפחד הוא מלדעת, לא מהבדיקה', t: 'הכאב הוזכר, אך אף מרואיינת לא ייחסה לו את ההימנעות. מה שהרתיע הוא התוצאה' },
      { h: 'דחייה שאינה מגיעה להכרעה', t: 'כל דחייה מוצדקת בפני עצמה, ולכן אין רגע שבו ההחלטה נבחנת מחדש' },
    ],
    q: 'אני לא מפחדת מהמכונה. אני מפחדת מהנייר. ממה שכתוב אחר כך בנייר. הפחד שלי הוא לא לעשות את הבדיקה, הפחד שלי הוא לדעת.',
    c: "איבתיסאם דאהר, בת 52, רמלה  |  נבדקה לראשונה בגיל 51",
    note: 'זו התמה שמפרקת את ההנחה שחוסר מודעות הוא הבעיה. הדוגמה החזקה ביותר היא האחות שמרכזת את הזימונים ואבחנה את עצמה בעצמה כדי לא ללכת.',
  },
  {
    n: '2', title: 'הגוף, הצניעות והמבט של הקהילה', tint: TEALL, bar: TEAL, dot: TEAL,
    pts: [
      { h: 'החסם אינו בחדר, הוא במסדרון', t: 'החשיפה מול בודקת אישה תוארה כרגע קצר. מה שהרתיע הוא שיראו את האישה בדרך אל הבדיקה' },
      { h: 'הבדיקה של האם הופכת לתיק של הבת', t: 'החשש המרכזי הוא מן הפרשנות הקהילתית ומפגיעה במעמד המשפחה ובסיכויי הנישואין' },
      { h: 'בושה אינה תכונה של קבוצה', t: 'שתי מרואיינות דחו את ההסבר לגמרי. הפער בין יישוב קטן לעיר גדולה היה הגדול במחקר' },
    ],
    q: 'אם יראו אותי בתור הזה יגידו שיש לי, ואם יגידו שיש לי אז לבת שלי בת העשרים יגידו שזה במשפחה, ואז מי יבוא לבקש אותה. [...] הבדיקה של האמא הופכת לתיק של הבת.',
    c: 'חנאן אבו סביח, בת 47, ערערה בנגב  |  מצטטת אישה מן התור לניידת',
    note: 'ההבחנה בין החדר למסדרון היא החידוש שלנו כאן. יש לה השלכה תפעולית ישירה על מיקום הניידת ועל שעות התורים.',
  },
  {
    n: '3', title: 'החסמים היומיומיים ומערך הזימון', tint: SOFT, bar: NAVY, dot: NAVY,
    pts: [
      { h: 'מחיר של יום עבודה', t: 'המרואיינות ערכו בקול חשבון מדויק של שעות שאבדו, דמי חניה ומשמרת שצריך להחליף' },
      { h: 'נטל טיפולי ותלות בהסעה', t: 'רישיון נהיגה אינו מספיק כשהרכב אינו זמין. יציאה אחת מן הבית דורשת ארגון של שבוע' },
      { h: 'זימון שאינו מגיע או שאינו נקרא', t: 'כתובות לא מעודכנות, מכתבים שאינם נקראים בשום שפה, ותור שנקבע בשעה בלתי אפשרית' },
    ],
    q: 'אני צריכה להחליף משמרת, זה לא פשוט, ואם אני לא מוצאת מישהי אז אני מפסידה יום. מאתיים ותשעים שקל. אני יודעת שזה נשמע קטן ליד סרטן. אבל בסוף החודש זה לא קטן.',
    c: 'ברכנש אלמו, בת 58, חולון  |  עובדת ניקיון בשכר יומי',
    note: 'זו התמה שהפתיעה אותנו. היא כמעט לא מקבלת מקום בספרות התרבותית, והנשים עצמן אינן מציגות אותה כחסם אלא כעובדת חיים, ולכן היא לא נראית בשאלונים.',
  },
  {
    n: '4', title: 'הפנייה האישית והרשת הנשית', tint: TEALL, bar: TEAL, dot: TEAL,
    pts: [
      { h: 'אותה המלצה, שתי תוצאות', t: 'רופא שאמר את המשפט למסך לא הזיז דבר. רופאה שהרימה טלפון הביאה לבדיקה ראשונה בגיל 51' },
      { h: 'ליווי מנצח שכנוע', t: 'כל מי שנבדקת בקביעות תיארה דמות מלווה. אף אחת מן הנשים שלא נבדקו לא תיארה דמות כזאת' },
      { h: 'אישה שחלתה משפיעה לשני הכיוונים', t: 'עדות של מי שהחלימה מקדמת. מחלה שהסתיימה רע פועלת כבלם ולא כדחף' },
    ],
    q: 'והוא כותב במחשב, ותוך כדי שהוא כותב הוא אמר, וגם ממוגרפיה, את באיחור. לא הרים את הראש. אמר את זה למסך.',
    c: 'ופאא דכוור, בת 54, רמלה  |  לא נבדקה מאז',
    note: 'זו התמה היחידה שכולה מאיצים, וממנה נגזרות רוב ההמלצות. הניגוד בין איבתיסאם ללילה הוא הלב של השקף.',
  },
];

themes.forEach((th) => {
  const s = S(WHITE);
  kicker(s, 'ממצאים  ·  תמה ' + th.n);
  s.addText(th.title, rtl({ x: M, y: 0.42, w: CW - 0.9, h: 0.72, fontSize: 30, bold: true, color: NAVY, margin: 0, valign: 'middle' }));
  badge(s, W - M - 0.72, 0.46, 0.66, th.n, th.bar);

  const colR = CW * 0.53;
  rows(s, M + CW - colR, 1.42, colR, th.pts, th.dot, 1.44);
  quoteCard(s, M, 1.42, CW - colR - 0.36, 4.32, th.q, th.c, th.tint, th.bar);
  s.addNotes(th.note);
});

// ==========================================================================
// 13. what we add to the literature
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'דיון');
  slideTitle(s, 'מה המחקר מוסיף על הספרות');
  const comp = [
    ['הידע', 'ידע נמוך הוא חסם מרכזי', 'הידע קיים כמעט אצל כולן. הפער הוא בין הידע לפעולה, והפחד הוא מן התוצאה ולא מן הבדיקה'],
    ['הבושה', 'חשיפת הגוף בפני איש צוות', 'החשיפה החברתית בדרך אל הבדיקה מרתיעה יותר מן החשיפה הגופנית בחדר'],
    ['הנגישות', 'מרחק ותלות בתחבורה', 'חשבון יומיומי של שעות עבודה ונטל טיפולי, שהנשים אינן מדווחות עליו כחסם'],
  ];
  const hy = 1.4, rh = 1.42;
  s.addText('הנושא', rtl({ x: M + CW - 1.9, y: hy, w: 1.9, h: 0.36, fontSize: 12, bold: true, color: MUTED, margin: 0, valign: 'middle' }));
  s.addText('מה אומרת הספרות', rtl({ x: M + CW - 1.9 - 4.0 - 0.3, y: hy, w: 4.0, h: 0.36, fontSize: 12, bold: true, color: MUTED, margin: 0, valign: 'middle' }));
  s.addText('מה עלה מן הראיונות', rtl({ x: M, y: hy, w: CW - 1.9 - 4.0 - 0.6, h: 0.36, fontSize: 12, bold: true, color: ROSE, margin: 0, valign: 'middle' }));
  comp.forEach((c, i) => {
    const y = hy + 0.44 + i * rh;
    card(s, M, y, CW, rh - 0.18, i % 2 ? SOFT : 'FAFCFD');
    s.addText(c[0], rtl({ x: M + CW - 1.9 - 0.28, y: y + 0.2, w: 1.9, h: 0.5, fontSize: 17, bold: true, color: NAVY, margin: 0, valign: 'middle' }));
    s.addText(c[1], rtl({ x: M + CW - 1.9 - 4.0 - 0.42, y: y + 0.22, w: 4.0, h: 0.82, fontSize: 13, color: MUTED, margin: 0, valign: 'top', lineSpacingMultiple: 1.18 }));
    s.addText(c[2], rtl({ x: M + 0.28, y: y + 0.22, w: CW - 1.9 - 4.0 - 0.9, h: 0.86, fontSize: 13.5, bold: true, color: INK, margin: 0, valign: 'top', lineSpacingMultiple: 1.18 }));
  });
  footNote(s, 'ההשוואה המלאה, כולל הפניות, בפרק הדיון בעבודה');
  s.addNotes('זה השקף שעונה על השאלה מה חידשנו. שלוש שורות, שלושה חידושים. לא להוסיף עליהם.');
}

// ==========================================================================
// 14. surprising finding (dark)
// ==========================================================================
{
  const s = S(NAVY);
  kicker(s, 'ממצא מפתיע', '8FB4CB');
  s.addText('אף מרואיינת לא נימקה את הימנעותה בטעם דתי', {
    x: M, y: 1.1, w: CW, h: 0.94, fontFace: F, fontSize: 30, bold: true, color: WHITE,
    align: 'right', rtlMode: true, margin: 0, valign: 'middle', lineSpacingMultiple: 1.14,
  });
  s.addText('הספרות מתעדת תפיסות פטליסטיות כמנבא מובהק של אי-היענות  (Azaiza et al., 2010). בראיונות שלנו מי שנמנעה נימקה זאת בפחד, בבושה, בהיעדר זמן או בחשש מקרינה. לא בגורל.',
    rtl({ x: M + CW * 0.5, y: 2.2, w: CW * 0.5, h: 1.5, fontSize: 14.5, color: 'C9D8E2', margin: 0, valign: 'top', lineSpacingMultiple: 1.26 }));
  s.addText('נשים אמרו שהכול בידי שמיים וגם נבדקו בקביעות, בלי לראות בכך סתירה.',
    rtl({ x: M + CW * 0.5, y: 3.72, w: CW * 0.5, h: 0.8, fontSize: 14.5, bold: true, color: WHITE, margin: 0, valign: 'top', lineSpacingMultiple: 1.24 }));

  s.addShape(pres.ShapeType.roundRect, { x: M, y: 2.2, w: CW * 0.5 - 0.4, h: 2.32, rectRadius: 0.09, fill: { color: '24486A' }, line: { color: '3A628A', width: 1 } });
  s.addText('”', { x: M + CW * 0.5 - 1.14, y: 2.26, w: 0.64, h: 0.6, fontFace: F, fontSize: 34, bold: true, color: '8FD3E8', align: 'center', valign: 'middle', margin: 0 });
  s.addText('אני לא הולכת לבדיקה במקום אללה, חלילה, אני הולכת בגלל אללה.',
    rtl({ x: M + 0.3, y: 2.88, w: CW * 0.5 - 1.0, h: 1.0, fontSize: 18, italic: true, color: WHITE, margin: 0, valign: 'top', lineSpacingMultiple: 1.22 }));
  s.addText('סועאד זועבי, בת 61, נצרת  |  שמונה שנות לימוד, נבדקת ברצף 11 שנים',
    rtl({ x: M + 0.3, y: 4.02, w: CW * 0.5 - 1.0, h: 0.4, fontSize: 11.5, color: '9FB6C6', margin: 0, valign: 'middle' }));

  s.addText('המשמעות המעשית: קמפיין שמכוון לשינוי תפיסות פטליסטיות עשוי להיות פחות יעיל מהסרת חסמים מעשיים. בזהירות, המדגם קטן ומכוון.',
    { x: M, y: 5.06, w: CW, h: 0.86, fontFace: F, fontSize: 14, color: 'C9D8E2', align: 'right', rtlMode: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.22 });
  s.addNotes('להציג את זה כממצא שהפתיע אותנו ולא כמסקנה חותכת. לומר במפורש שייתכן שהמדגם הקטן אינו לוכד את הפטליזם, ושייתכן שהניסוח הדתי הוא הסבר שנוח למסור לחוקר.');
}

// ==========================================================================
// 15. limitations
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'דיון');
  slideTitle(s, 'מגבלות המחקר');
  const lim = [
    ['מדגם קטן ומכוון', 'שתים עשרה משתתפות. אין להסיק על שכיחות החסמים באוכלוסייה, רק על הצורות שהם לובשים'],
    ['הטיית כדור השלג', 'ייתכן שנשים שהימנעותן עמוקה במיוחד כלל לא הסכימו להתראיין'],
    ['תרגום', 'חמישה ראיונות בערבית ואחד באמהרית תורגמו לעברית, וכל תרגום כרוך באובדן גוון'],
    ['זהות המראיינות', 'סטודנטיות למנהל מערכות בריאות. ייתכן שהזיהוי עודד הצגת עמדה חיובית כלפי הבדיקה'],
  ];
  const cw = (CW - 0.34) / 2, ch = 1.5;
  lim.forEach((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + (1 - col) * (cw + 0.34);
    const y = 1.44 + row * (ch + 0.3);
    card(s, x, y, cw, ch, SOFT);
    badge(s, x + cw - 0.66, y + 0.24, 0.44, String(i + 1), MUTED);
    s.addText(l[0], rtl({ x: x + 0.28, y: y + 0.24, w: cw - 1.02, h: 0.44, fontSize: 16, bold: true, margin: 0, valign: 'middle' }));
    s.addText(l[1], rtl({ x: x + 0.28, y: y + 0.76, w: cw - 0.56, h: 0.62, fontSize: 13, color: MUTED, margin: 0, valign: 'top', lineSpacingMultiple: 1.18 }));
  });
  card(s, M, 4.72, CW, 1.5, TEALL);
  s.addText('כיווני המשך', rtl({ x: M + 0.32, y: 4.86, w: CW - 0.64, h: 0.36, fontSize: 15.5, bold: true, color: NAVY, margin: 0, valign: 'middle' }));
  [
    'בחינה כמותית של משקל החסם היומיומי לצד החסמים התרבותיים המוכרים.',
    'השוואה בין יישובים שבהם פעלה ניידת ממוגרפיה לבין יישובים דומים שבהם לא פעלה.',
    'בחינת ההיענות בקרב נשים מתחת לגיל חמישים בקהילות שבהן חציון גיל האבחון צעיר.',
  ].forEach((t, i) => {
    s.addText(t, rtl({ x: M + 0.32, y: 5.24 + i * 0.32, w: CW - 0.64, h: 0.3, fontSize: 12.5, color: INK, margin: 0, valign: 'middle', bullet: { code: '25AA' } }));
  });
  s.addNotes('לא להתנצל. להציג את המגבלות כמודעות מתודולוגית, ולעבור מהר לכיווני ההמשך.');
}

// ==========================================================================
// 16. conclusions
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'מסקנות');
  slideTitle(s, 'שלוש מסקנות');
  const con = [
    ['החסם התרבותי אמיתי, אך ממוקם אחרת', 'הוא נמצא בדרך אל הבדיקה ולא בחדר הבדיקה, כלומר בחשיפה החברתית ולא בחשיפה הגופנית', ROSE, ROSEL],
    ['קיים חסם מעשי שאינו מדובר', 'המחיר של יום עבודה ושל היעדרות מן הבית, שאינו מדווח בשאלונים משום שאינו נחווה כחסם', NAVY, SOFT],
    ['המאיץ החזק אינו מידע נוסף', 'הוא פנייה אנושית בשם פרטי, ואחריה ליווי ממשי של אדם שלוקח את זה על עצמו', TEAL, TEALL],
  ];
  const cw = (CW - 2 * 0.34) / 3;
  con.forEach((c, i) => {
    const x = M + (2 - i) * (cw + 0.34);
    card(s, x, 1.42, cw, 3.0, c[3]);
    badge(s, x + cw - 0.72, 1.66, 0.5, String(i + 1), c[2]);
    s.addText(c[0], rtl({ x: x + 0.28, y: 2.34, w: cw - 0.56, h: 1.0, fontSize: 18, bold: true, color: NAVY, margin: 0, valign: 'top', lineSpacingMultiple: 1.16 }));
    s.addText(c[1], rtl({ x: x + 0.28, y: 3.36, w: cw - 0.56, h: 0.94, fontSize: 13, color: MUTED, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 }));
  });
  card(s, M, 4.66, CW, 1.4, NAVY);
  s.addText('ההיענות נקבעת במאזן שבין החסמים למאיצים, ולא ברמת הידע.', {
    x: M + 0.3, y: 4.84, w: CW - 0.6, h: 0.46, fontFace: F, fontSize: 19, bold: true, color: WHITE,
    align: 'center', rtlMode: true, margin: 0, valign: 'middle',
  });
  s.addText('ולכן התערבות שכל כולה העברת מידע צפויה להניב תשואה נמוכה.', {
    x: M + 0.3, y: 5.34, w: CW - 0.6, h: 0.4, fontFace: F, fontSize: 13.5, color: 'C9D8E2',
    align: 'center', rtlMode: true, margin: 0, valign: 'middle',
  });
  s.addNotes('שלוש מסקנות בלבד. השורה בכרטיס הכהה היא המשפט שצריך להישאר בראש של המנחה.');
}

// ==========================================================================
// 17. recommendations
// ==========================================================================
{
  const s = S(WHITE);
  kicker(s, 'המלצות יישומיות');
  slideTitle(s, 'מה עושים עם זה מחר בבוקר');

  const groups = [
    {
      t: 'ברמת המרפאה', sub: 'עלות נמוכה, יישום מיידי', color: TEAL, tint: TEALL,
      items: [
        ['רכזת זימונים שמטלפנת', 'דוברת ערבית, שיחה יזומה לכל אישה באיחור. מדד: שיעור ההמרה משיחה לתור'],
        ['התראה לרופא במפגש הקליני', 'התראה אוטומטית בפתיחת ביקור של אישה בגיל הזכאות שאיחרה'],
        ['תורים בשעות שאפשר להגיע אליהן', 'אחר הצהריים וימי שישי, ואישור היעדרות מעבודה למי שהגיעה'],
      ],
    },
    {
      t: 'ברמת הקופה ומשרד הבריאות', sub: 'דורש החלטת מדיניות', color: ROSE, tint: ROSEL,
      items: [
        ['ניידת בלוח קבוע ובמקום דיסקרטי', 'לא אירוע חד-פעמי, ולא בחזית המרפאה, כדי לתת מענה לחשש מן הראות'],
        ['מפגשים ביתיים במקום הרצאות', 'נשים מקומיות שנבדקו, ובהן מי שהחלימה, מנחות מפגשים קטנים'],
        ['הרחבת הזימון לגילאי 45 עד 49', 'בקהילות שבהן חציון גיל האבחון צעיר, ובראשן החברה הבדואית בנגב'],
      ],
    },
  ];
  const cw = (CW - 0.4) / 2;
  groups.forEach((g, gi) => {
    const x = M + (1 - gi) * (cw + 0.4);
    card(s, x, 1.36, cw, 4.66, gi === 0 ? 'FAFCFD' : SOFT);
    s.addText(g.t, rtl({ x: x + 0.28, y: 1.52, w: cw - 0.56, h: 0.38, fontSize: 17, bold: true, color: g.color, margin: 0, valign: 'middle' }));
    s.addText(g.sub, rtl({ x: x + 0.28, y: 1.9, w: cw - 0.56, h: 0.28, fontSize: 11.5, color: MUTED, margin: 0, valign: 'middle' }));
    g.items.forEach((it, i) => {
      const y = 2.32 + i * 1.2;
      badge(s, x + cw - 0.72, y + 0.02, 0.42, String(i + 1), g.color);
      s.addText(it[0], rtl({ x: x + 0.28, y, w: cw - 1.12, h: 0.36, fontSize: 14.5, bold: true, margin: 0, valign: 'middle' }));
      s.addText(it[1], rtl({ x: x + 0.28, y: y + 0.38, w: cw - 0.56, h: 0.68, fontSize: 12, color: MUTED, margin: 0, valign: 'top', lineSpacingMultiple: 1.16 }));
    });
  });
  footNote(s, 'כל ההמלצות נגזרות ישירות מדברי המשתתפות, ולא מן הספרות בלבד');
  s.addNotes('זה השקף החשוב ביותר להערכה, כי החוברת מבקשת יישומיות. להקדיש לו יותר זמן מלשקפים אחרים. לחבר כל המלצה לתמה שממנה היא נולדה.');
}

// ==========================================================================
// 18. closing (dark)
// ==========================================================================
{
  const s = S(NAVY);
  s.addShape(pres.ShapeType.roundRect, { x: (W - 1.34) / 2, y: 1.05, w: 1.34, h: 1.34, rectRadius: 0.16, fill: { color: WHITE }, line: { color: WHITE, width: 0 } });
  s.addImage({ path: LOGO, x: (W - 1.18) / 2, y: 1.13, w: 1.18, h: 1.18 });
  s.addText('תודה', { x: 0, y: 2.72, w: W, h: 0.8, fontFace: F, fontSize: 40, bold: true, color: WHITE, align: 'center', rtlMode: true, margin: 0, valign: 'middle' });
  s.addText('איכותו של מערך איתור מוקדם נמדדת בנשים שהוא מצליח להגיע אליהן,\nולא במספר הנשים שהוא הצליח ליידע.',
    { x: 1.6, y: 3.6, w: W - 3.2, h: 0.96, fontFace: F, fontSize: 16, italic: true, color: 'C9D8E2', align: 'center', rtlMode: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.26 });
  s.addText('שאלות?', { x: 0, y: 4.76, w: W, h: 0.44, fontFace: F, fontSize: 18, bold: true, color: '8FD3E8', align: 'center', rtlMode: true, margin: 0, valign: 'middle' });
  s.addText('המרכז האקדמי פרס  |  החוג למנהל מערכות בריאות  |  בהנחיית ד"ר אסנת בשקין  |  תשפ"ו',
    { x: 0, y: 5.66, w: W, h: 0.34, fontFace: F, fontSize: 11.5, color: '7E96A8', align: 'center', rtlMode: true, margin: 0, valign: 'middle' });
  s.addNotes('לסיים בזמן ולהשאיר מקום לשאלות. המשפט על המסך הוא הניסוח שלנו ולא ציטוט ממקור.');
}

const out = process.argv[2] || path.join(DIR, 'deck.pptx');
pres.writeFile({ fileName: out }).then(() => console.log('wrote', out));

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, PageBreak, Footer, PageNumber, ImageRun,
  AlignmentType, LevelFormat, HeadingLevel, PageOrientation,
} = require('docx');

const DIR = __dirname;
const IV_DIR = path.join(DIR, process.env.IVDIR||'interviews');

const FONT = 'David';
const SZ = 24;          // 12pt
const LINE = 360;       // 1.5 * 240
const MARGIN = 1417;    // 2.5 cm in DXA

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: opts.size || SZ,
    bold: !!opts.bold,
    italics: !!opts.italics,
    underline: opts.underline ? {} : undefined,
    rightToLeft: true,
  });
}

function para(children, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.alignment || AlignmentType.JUSTIFIED,
    spacing: { line: LINE, lineRule: 'auto', after: opts.after === undefined ? 120 : opts.after, before: opts.before || 0 },
    indent: opts.indent,
    keepNext: !!opts.keepNext,
    children: Array.isArray(children) ? children : [children],
    pageBreakBefore: !!opts.pageBreakBefore,
  });
}

function txt(text, opts = {}) {
  return para([run(text, opts)], opts);
}

function blank(n = 1) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(txt('', { after: 0 }));
  return out;
}

// ---------- parse interview files ----------
function parseInterview(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = raw.split(/\r?\n/);
  const iv = { title: '', meta: '', intro: '', qa: [] };
  let pendingQ = null;
  for (const line of lines) {
    const l = line.trim();
    if (!l) continue;
    if (l.startsWith('@@INTERVIEW@@')) iv.title = l.replace('@@INTERVIEW@@', '').trim();
    else if (l.startsWith('@@META@@')) iv.meta = l.replace('@@META@@', '').trim();
    else if (l.startsWith('@@INTRO@@')) iv.intro = l.replace('@@INTRO@@', '').trim();
    else if (l.startsWith('@@Q@@')) pendingQ = l.replace('@@Q@@', '').trim();
    else if (l.startsWith('@@A@@')) {
      iv.qa.push({ q: pendingQ || '', a: l.replace('@@A@@', '').trim() });
      pendingQ = null;
    }
  }
  return iv;
}

const files = fs.readdirSync(IV_DIR).filter(f => /^\d+\.txt$/.test(f)).sort();
const interviews = files.map(f => parseInterview(path.join(IV_DIR, f)));

// ---------- document body ----------
const children = [];

// --- שער ---
children.push(...blank(1));
children.push(new Paragraph({
  bidirectional: true,
  alignment: AlignmentType.CENTER,
  spacing: { line: 240, lineRule: 'auto', after: 200 },
  children: [new ImageRun({ type: 'jpg', data: fs.readFileSync(path.join(DIR, 'peres_logo.jpg')),
                            transformation: { width: 90, height: 90 } })],
}));
children.push(txt('המרכז האקדמי פרס', { alignment: AlignmentType.CENTER, bold: true, size: 28, after: 0 }));
children.push(txt('החוג למנהל מערכות בריאות', { alignment: AlignmentType.CENTER, bold: true, size: 28 }));
children.push(...blank(3));
children.push(txt('נספח: ראיונות עומק', { alignment: AlignmentType.CENTER, bold: true, size: 36, after: 0 }));
children.push(...blank(1));
children.push(txt('היענות לבדיקות ממוגרפיה בישראל,', { alignment: AlignmentType.CENTER, bold: true, size: 28, after: 0 }));
children.push(txt('בדגש על החברה הערבית', { alignment: AlignmentType.CENTER, bold: true, size: 28 }));
children.push(...blank(3));
children.push(txt('עבודה מסכמת במסגרת סמינר', { alignment: AlignmentType.CENTER }));
children.push(...blank(2));
children.push(txt('מגישות:', { alignment: AlignmentType.CENTER, bold: true, after: 0 }));
children.push(txt('מראם זיד        ת.ז. 211794235', { alignment: AlignmentType.CENTER, after: 0 }));
children.push(txt('טגאיה סמאנך        ת.ז. 337622344', { alignment: AlignmentType.CENTER, after: 0 }));
children.push(txt('עאליה אבו עראר        ת.ז. 2114908139', { alignment: AlignmentType.CENTER, after: 0 }));
children.push(txt('לילה נגילי        ת.ז. 214175473', { alignment: AlignmentType.CENTER, after: 120 }));
children.push(...blank(2));
children.push(txt('בהנחיית: ד"ר אסנת בשקין', { alignment: AlignmentType.CENTER }));
children.push(...blank(2));
children.push(txt('תאריך הגשה: ______________     תשפ"ו', { alignment: AlignmentType.CENTER }));

// --- הערה מתודולוגית ---
children.push(txt('הערה מתודולוגית ואתית', { alignment: AlignmentType.RIGHT, bold: true, size: 28, pageBreakBefore: true, keepNext: true, before: 240 }));
[
  'הנספח כולל שנים עשר ראיונות עומק חצי מובנים שנערכו עם נשים בגילאי 44 עד 66 המתגוררות במרכז הארץ, בצפון ובנגב. המדגם נבנה בדגימה מכוונת ובשיטת כדור השלג, מתוך כוונה לכלול שונוּת פנימית רחבה ככל האפשר: נשים מוסלמיות, נוצריות, דרוזיות ובדואיות, לצד אישה יוצאת אתיופיה שנכללה במדגם כדי לאפשר השוואה בין חסמים תרבותיים לבין חסמי שפה ונגישות בקבוצת מיעוט אחרת. המדגם כולל נשים המתגוררות ביישובים ערביים, בערים מעורבות ובפזורה הבדואית, בעלות רמות השכלה שונות, וכן נשים הנמצאות במקומות שונים על ציר ההיענות: כאלה הנבדקות בקביעות, כאלה שנבדקו פעם אחת ולא חזרו, כאלה שמעולם לא נבדקו, ואישה אחת שחלתה במחלה ואובחנה באיחור.',
  'הראיונות נערכו בין החודשים אדר וסיוון תשפ"ו, בבתי המרואיינות, במקומות עבודתן ובמקרה אחד במרפאה, לפי בחירתן. משך כל ראיון נע בין 32 ל-45 דקות. שישה ראיונות נערכו בעברית, חמישה בערבית ואחד באמהרית; הראיונות שלא נערכו בעברית תומללו ותורגמו, ובמקרים שבהם התרגום פגע בניואנס נשמר הביטוי המקורי בסוגריים. מדריך הראיון כלל שש עשרה שאלות קבועות, ובהן שאלת פתיחה כללית, והוא הועבר בסדר אחיד בכל הראיונות תוך מתן מרחב לשאלות הבהרה ולסטיות שיזמו המרואיינות עצמן.',
  'כל המשתתפות נתנו הסכמה מדעת בעל פה לאחר שהוסבר להן מהי מטרת המחקר, כי ההשתתפות בו וולונטרית וכי הן רשאיות להפסיק את הראיון בכל שלב או שלא לענות על שאלה מסוימת. שמות המרואיינות הם שמות בדויים, וכל פרט מזהה שעלול היה לאפשר את זיהוין, ובכללו שמות של בני משפחה, של מקומות עבודה ושל צוותים רפואיים, שונה או טושטש. במקרה אחד, שבו עלה במהלך הראיון ממצא גופני שלא דווח לאיש מקצוע, נמסר למרואיינת בתום הראיון מידע על זכאותה לבדיקה והיא הופנתה למרפאה, וזאת מתוך חובת הזהירות הגוברת על שיקולי המחקר.',
  'בהתאם לכללי הכתיבה האקדמית, דברי המשתתפות מובאים כאן ללא הפניה ביבליוגרפית וללא רישום ברשימת המקורות, שכן מדובר בחומר גלם מקורי שנאסף לצורך עבודה זו. הניתוח התמטי של הראיונות ושילובם עם ממצאי סקירת הספרות מופיעים בגוף העבודה ולא בנספח זה.',
].forEach(p => children.push(txt(p)));

// --- מדריך הראיון ---
children.push(txt('מדריך הראיון', { alignment: AlignmentType.RIGHT, bold: true, size: 28, pageBreakBefore: true, keepNext: true, before: 240 }));
children.push(txt('שש עשרה השאלות הועברו בנוסח זהה ובסדר זהה בכל שנים עשר הראיונות. השאלה הראשונה היא שאלת פתיחה שנועדה ליצור היכרות ולהרפות את המרואיינת לפני המעבר לנושא המחקר.'));
const GUIDE = interviews.length ? interviews[0].qa.map(x => x.q) : [];
GUIDE.forEach((q, i) => {
  children.push(new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: LINE, lineRule: 'auto', after: 80 },
    indent: { right: 400, hanging: 400 },
    children: [run(`${i + 1}. ${q}`)],
  }));
});

// --- הראיונות ---
interviews.forEach((iv, idx) => {
  children.push(txt(iv.title, { alignment: AlignmentType.RIGHT, bold: true, size: 28, pageBreakBefore: true, keepNext: true, before: 240 }));
  children.push(txt(iv.meta, { alignment: AlignmentType.RIGHT, size: 22, italics: true, keepNext: true }));
  children.push(txt(iv.intro, { italics: true }));
  children.push(txt('', { after: 0 }));
  iv.qa.forEach((qa, i) => {
    children.push(new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: LINE, lineRule: 'auto', after: 60, before: 120 },
      keepNext: true,
      children: [run(`ש${i + 1}: ${qa.q}`, { bold: true })],
    }));
    children.push(txt(`ת: ${qa.a}`));
  });
});

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: SZ, rightToLeft: true,
               // tag the complex-script language, so Word proofs the Hebrew
               // against a Hebrew dictionary instead of the Latin default
               language: { value: 'en-US', bidirectional: 'he-IL' } },
        paragraph: { spacing: { line: LINE, lineRule: 'auto' }, alignment: AlignmentType.JUSTIFIED, bidirectional: true },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.CENTER,
          spacing: { line: 240, lineRule: 'auto' },
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, rightToLeft: true })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = process.argv[2] || path.join(DIR, 'interviews.docx');
  fs.writeFileSync(out, buf);
  console.log('wrote', out, buf.length, 'bytes;', interviews.length, 'interviews;', interviews.reduce((s, i) => s + i.qa.length, 0), 'Q&A pairs');
});

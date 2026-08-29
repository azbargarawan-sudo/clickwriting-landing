// בניית מסמך הסמינריון המלא: דף שער, תוכן עניינים אוטומטי, פרקים, הערות שוליים וביבליוגרפיה
const { docx, he, en, finalizeFootnotes, HE_FONT } = require('./lib');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, TableOfContents,
  Footer, PageNumber, PageBreak, HeadingLevel, LevelFormat,
} = docx;
const fs = require('fs');

// סדר הטעינה = סדר המסמך = סדר מספרי הערות השוליים
const { intro } = require('./ch_intro');
const { ch1 } = require('./ch1');
const { ch1b } = require('./ch1b');
const { ch2 } = require('./ch2');
const { ch4 } = require('./ch4');
const { ch3 } = require('./ch3');
const { ch5 } = require('./ch5');
const { chDiscussion } = require('./ch_discussion');
const { conclusion, bibliography } = require('./ch6');

function coverLine(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: opts.after ?? 120 },
    children: [new TextRun({ text, rightToLeft: true, font: HE_FONT, size: opts.size ?? 26, bold: opts.bold ?? false })],
  });
}

const cover = [
  coverLine('', { after: 600 }),
  coverLine('[שם המוסד האקדמי]', { size: 28 }),
  coverLine('הפקולטה למשפטים', { size: 28, after: 900 }),
  coverLine('עבודה סמינריונית', { size: 26, after: 500 }),
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: 'הכרעה בזכויות במקרקעין לא רשומים בסכסוכים פנים משפחתיים בחברה הערבית', rightToLeft: true, font: HE_FONT, size: 44, bold: true })],
  }),
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 900 },
    children: [new TextRun({ text: 'עיון במשפט הישראלי ובמשפט משווה: המשפט המקובל, המשפט המצרי והמשפט השרעי האסלאמי', rightToLeft: true, font: HE_FONT, size: 30 })],
  }),
  coverLine('מגיש/ה: ______________', {}),
  coverLine('מספר זהות: ______________', {}),
  coverLine('שם הקורס: ______________', {}),
  coverLine('בהנחיית: ______________', { after: 700 }),
  coverLine('אלול התשפ"ו • אוגוסט 2026', { after: 700 }),
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'הערות השוליים והביבליוגרפיה ערוכות על פי כללי האזכור האחיד בכתיבה המשפטית (מהדורה שלישית 2021)', rightToLeft: true, font: HE_FONT, size: 20, italics: true })],
  }),
];

function abstractPara(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.BOTH,
    indent: { firstLine: 420 },
    spacing: { line: 360, after: 160 },
    children: [new TextRun({ text, rightToLeft: true, font: HE_FONT, size: 24 })],
  });
}

const abstractSection = [
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: 'תקציר', rightToLeft: true, font: HE_FONT, size: 32, bold: true })],
  }),
  abstractPara(
    'עבודה זו בוחנת כיצד מכריעים בתי המשפט בישראל בזכויות במקרקעין לא רשומים בסכסוכים פנים משפחתיים בחברה הערבית, שבה חלק ניכר מן הקרקעות מוחזק ומועבר מדור לדור על יסוד הסכמות בעל פה, ייפויי כוח בלתי חוזרים ישנים וחלוקות משפחתיות שלא נרשמו ולא דווחו לרשויות המס. העבודה נסבה על שלוש שאלות: מהם הכלים המשפטיים והראייתיים שבהם מתמודדים בתי המשפט עם היעדר הרישום; מהן ההשלכות הכלכליות של התניית הרישום בהסדרת מס לגבי עסקאות היסטוריות שלא דווחו במועדן; ומהו משקלם הראייתי של היתרי בנייה ותשלומי ארנונה כראיה לבעלות. הבירור נערך בשיטה דוקטרינרית ביקורתית, בצירוף עיון משווה פונקציונלי בשלוש שיטות: המשפט המקובל האנגלי, המשפט המצרי והמשפט השרעי האסלאמי.'
  ),
  abstractPara(
    'ממצאי העבודה מלמדים כי הפסיקה פיתחה ארגז כלים עשיר, ובו הזכות שביושר, הכרה בייפוי הכוח הבלתי חוזר כמסמך העסקה וכוויתור על חזרה ממתנה, עקרון תום הלב ו"זעקת ההגינות", והרישיון במקרקעין; ואולם כל אלה הם פתרונות בדיעבד, התלויים בשיקול דעת שיפוטי רחב, והם מכריעים בסכסוך בלא לרפא את הכשל המבני. היתרי הבנייה והארנונה נמצאו ראיות נסיבתיות להחזקה ולהסכמה המשפחתית שבזמן אמת, אך לא ראיות בעלות, ועצם ההישענות עליהן חושפת היפוך תפקידים מוסדי שבו רשויות התכנון והגבייה משמשות רשם בפועל. ואילו "התניית הרישום" בהסדרת המס ההיסטורית נמצאה החסם המבני המרכזי: היא מקימה מלכוד כלכלי רב דורי, שבו עלות ההסדרה גדלה משנה לשנה, והוא המשמר את אי הרישום ומזין את הסכסוכים עצמם.'
  ),
  abstractPara(
    'המבט המשווה מעגן את הממצאים בהקשר רחב: הדין האנגלי מלמד כי ניתן למסגר את ההגנה על המסתמך בעילה סדורה (השתק קנייני) ולקיים מרשם נגיש שאינו כרוך במס; הניסיון המצרי מדגים כיצד צימוד רישום ומס הוליד אי רישום המוני, עד שנותק ברפורמה של שנת 2022; והמשפט השרעי, שעל ברכיו נוצרו דפוסי ההחזקה הנחקרים, מציב את התפיסה וההחזקה הגלויה במרכז ההקניה ומסביר את התודעה הקניינית של הצדדים. מסקנת העבודה היא כי נקודת הכובד חייבת לנוע מן ההכרעה השיפוטית בדיעבד אל הסרת החסמים מראש, בשלושה מישורים משולבים: הסדרה פיסקלית מקילה לעסקאות היסטוריות, השלמת הליכי ההסדר בשיתוף הקהילות, ומסגור דוקטרינרי יציב של ההגנה על המסתמך.'
  ),
];

const tocSection = [
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: 'תוכן עניינים', rightToLeft: true, font: HE_FONT, size: 32, bold: true })],
  }),
  new TableOfContents('תוכן עניינים', { hyperlink: true, headingStyleRange: '1-3' }),
];

const footer = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], font: HE_FONT, size: 20 })],
    }),
  ],
});

const doc = new Document({
  creator: 'עבודה סמינריונית',
  title: 'הכרעה בזכויות במקרקעין לא רשומים בסכסוכים פנים-משפחתיים בחברה הערבית',
  features: { updateFields: true },
  styles: {
    default: {
      document: { run: { font: HE_FONT, size: 24 } },
      footnoteText: { run: { font: HE_FONT, size: 20 } },
    },
  },
  footnotes: finalizeFootnotes(),
  sections: [
    { properties: {}, children: cover },
    { properties: {}, children: abstractSection },
    { properties: {}, children: tocSection },
    {
      properties: {},
      footers: { default: footer },
      children: [
        ...intro,
        ...ch1,
        ...ch1b,
        ...ch2,
        ...ch4,
        ...ch3,
        ...ch5,
        ...chDiscussion,
        ...conclusion,
        ...bibliography,
      ],
    },
  ],
});

Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(__dirname + '/סמינריון-מקרקעין-לא-רשומים.docx', b);
  console.log('written', b.length, 'bytes');
});

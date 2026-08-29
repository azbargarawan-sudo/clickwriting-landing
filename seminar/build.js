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

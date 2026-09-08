const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, Header, PageBreak, ImageRun } = require('docx');

const HEB = 'David', ENG = 'David';
const LINE = 360; // 1.5 spacing

function heb(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.justify ? AlignmentType.JUSTIFIED : AlignmentType.RIGHT,
    spacing: { line: LINE, after: 0 },
    indent: opts.indent,
    children: [new TextRun({ text, font: HEB, size: 24, rightToLeft: true, bold: !!opts.bold, underline: opts.underline ? {} : undefined })],
  });
}
function hebTitle(text) {
  return new Paragraph({
    bidirectional: true, alignment: AlignmentType.CENTER, spacing: { line: LINE, before: 120, after: 120 },
    children: [new TextRun({ text, font: HEB, size: 32, bold: true, rightToLeft: true })],
  });
}
function hebHeading(text) {
  return new Paragraph({
    bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { line: LINE, before: 120, after: 0 },
    children: [new TextRun({ text, font: HEB, size: 26, bold: true, rightToLeft: true })],
  });
}
function hebRef(text) {
  return new Paragraph({
    bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { line: LINE, after: 0 },
    indent: { left: 720, hanging: 720 },
    children: [new TextRun({ text, font: HEB, size: 24, rightToLeft: true })],
  });
}
// English reference with italic segments marked *...*
function engRef(text) {
  const parts = text.split('*');
  const runs = parts.map((p, i) => new TextRun({ text: p, font: ENG, size: 24, italics: i % 2 === 1 }));
  return new Paragraph({
    alignment: AlignmentType.LEFT, spacing: { line: LINE, after: 0 },
    indent: { left: 720, hanging: 720 },
    children: runs,
  });
}

const body = JSON.parse(fs.readFileSync('body.json', 'utf8'));

const firstHeader = new Header({
  children: [
    heb('סלסביל אבו קוידר, ת"ז 215075086', { bold: true }),
    heb('סמינר: תהליכי חזון ומנהיגות בארגונים, מרצה: ד"ר עימאד ג\'ראיסי'),
    heb('נושא המחקר: תפיסות מנהלי בתי ספר בדרום את מנהיגותם החזונית בזמן מלחמת חרבות ברזל'),
    heb('שאלת המחקר: כיצד תופסים מנהלי בתי ספר באזור הדרום את תפקידם המנהיגותי-חזוני בתקופת מלחמת "חרבות ברזל"?'),
  ],
});

const children = [];
children.push(hebTitle('מטלה 4: הרקע התאורטי (סקירת ספרות)'));
for (const sec of body.sections) {
  if (sec.h) children.push(hebHeading(sec.h));
  for (const p of sec.p) children.push(heb(p, { justify: true }));
}
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(hebTitle('רשימת מקורות'));
for (const r of body.refs_he) children.push(hebRef(r));
for (const r of body.refs_en) children.push(engRef(r));

// ---- title page ----
function tp(text, { size = 24, bold = false, before = 0, after = 0 } = {}) {
  return new Paragraph({
    bidirectional: true, alignment: AlignmentType.CENTER,
    spacing: { line: LINE, before, after },
    children: [new TextRun({ text, font: HEB, size, bold, rightToLeft: true })],
  });
}
const logo = new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 400, after: 200 },
  children: [new ImageRun({
    type: 'jpg',
    data: fs.readFileSync('ono-logo.jpg'),
    transformation: { width: 155, height: 155 },
  })],
});
const titlePage = [
  logo,
  tp('הקריה האקדמית אונו', { size: 28, bold: true }),
  tp('הפקולטה למדעי החברה והרוח'),
  tp('סמינר: תהליכי חזון ומנהיגות בארגונים', { before: 300 }),
  tp("מרצה: ד\"ר עימאד ג'ראיסי"),
  tp('הרקע התאורטי', { size: 36, bold: true, before: 700, after: 120 }),
  tp('סקירת ספרות', { size: 28 }),
  tp('תפיסות מנהלי בתי ספר בדרום את מנהיגותם החזונית', { before: 400 }),
  tp('בזמן מלחמת "חרבות ברזל"'),
  tp('מוגש על ידי: סלסביל אבו קוידר', { before: 700 }),
  tp('תעודת זהות: 215075086'),
  tp("כ\"ו באלול התשפ\"ו, 8 בספטמבר 2026", { before: 700 }),
];

const doc = new Document({
  styles: { default: { document: { run: { font: HEB, size: 24 } } } },
  sections: [
    {
      properties: { page: { margin: { top: 1417, bottom: 1417, left: 1417, right: 1417 } } },
      children: titlePage,
    },
    {
      properties: {
        titlePage: true,
        page: { margin: { top: 1417, bottom: 1417, left: 1417, right: 1417 } },
      },
      headers: { first: firstHeader },
      children,
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('הרקע_התאורטי_סלסביל_אבו_קוידר.docx', buf);
  console.log('written');
});

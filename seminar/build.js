// Builds the seminar paper .docx from the chapter files in ./src.
// Usage: node build.js
// Content format (per file, concatenated in order):
//   # Heading 1        ## Heading 2       > block quote
//   %%PAGEBREAK%%      %%TOC%%            %%BIB%%  (bibliography follows: one entry per paragraph, hanging indent)
//   Footnotes inline as [[note text]] ; *italic* and **bold** allowed in notes, bibliography and quotes.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, FootnoteReferenceRun,
  TableOfContents, PageBreak, PageNumber, Footer, TabStopType, LineRuleType, BorderStyle,
} = require('docx');

const FONT = 'David';
const SIZE = 24;        // 12pt
const NOTE_SIZE = 20;   // 10pt
const HEB = /[֐-׿]/;

const cover = {
  university: 'האוניברסיטה הפתוחה',
  faculty: 'המחלקה להיסטוריה, פילוסופיה ומדעי היהדות',
  course: 'קורס 10305 – האנטישמיות במאה ה-19',
  kind: 'עבודה סמינריונית',
  title: 'השפעת פרשת דרייפוס על התפתחות הגותו הציונית של תיאודור הרצל:',
  subtitle: 'מהתבוללות ללאומיות יהודית',
  lines: [
    'מגיש/ה: ____________________',
    'מספר זהות: ____________________',
    'מדריך/ת העבודה: ____________________',
    'מרכזת ההוראה בקורס: ד"ר חגית כהן',
    'תשפ"ו',
  ],
};

// ---------- inline markup ----------
function runs(text, opts = {}) {
  // *italic* and **bold** ; script-aware rtl flag
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  const push = (s, bold, italics) => {
    if (!s) return;
    out.push(new TextRun({
      text: s, font: FONT, size: opts.size || SIZE, bold: bold || opts.bold, italics,
      rightToLeft: HEB.test(s) ? true : (opts.rtlDefault ?? true),
    }));
  };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) push(tok.slice(2, -2), true, false);
    else push(tok.slice(1, -1), false, true);
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return out;
}

const footnotes = {};
let noteId = 0;

function isLatinLed(s) {
  // paragraph direction by dominant script: Hebrew letters vs Latin letters
  const heb = (s.match(/[\u0590-\u05FF]/g) || []).length;
  const lat = (s.match(/[A-Za-z]/g) || []).length;
  return lat > heb;
}

function noteParagraph(text) {
  const ltr = isLatinLed(text);
  return new Paragraph({
    alignment: ltr ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
    bidirectional: !ltr,
    spacing: { line: 240, lineRule: LineRuleType.AUTO, after: 40 },
    children: [new TextRun({ text: ' ', font: FONT, size: NOTE_SIZE }), ...runs(text, { size: NOTE_SIZE, rtlDefault: !ltr })],
  });
}

function bodyChildren(text) {
  // split on [[note]] markers
  const out = [];
  const re = /\[\[([\s\S]+?)\]\]/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    out.push(...runs(text.slice(last, m.index)));
    noteId += 1;
    footnotes[noteId] = { children: [noteParagraph(m[1].trim())] };
    out.push(new FootnoteReferenceRun(noteId));
    last = m.index + m[0].length;
  }
  out.push(...runs(text.slice(last)));
  return out;
}

const body = (text, extra = {}) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  bidirectional: true,
  spacing: { line: 360, lineRule: LineRuleType.AUTO, after: 120 },
  children: bodyChildren(text),
  ...extra,
});

const heading = (text, level) => new Paragraph({
  heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
  bidirectional: true,
  alignment: AlignmentType.RIGHT,
  spacing: { before: level === 1 ? 360 : 240, after: 160, line: 360 },
  children: [new TextRun({ text, font: FONT, size: level === 1 ? 32 : 28, bold: true, rightToLeft: true })],
});

const quote = (text) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  bidirectional: true,
  indent: { left: 720, right: 720 },
  spacing: { line: 276, lineRule: LineRuleType.AUTO, after: 160 },
  children: bodyChildren(text),
});

const bibEntry = (text) => {
  const ltr = isLatinLed(text);
  return new Paragraph({
    alignment: ltr ? AlignmentType.LEFT : AlignmentType.RIGHT,
    bidirectional: !ltr,
    indent: { left: 720, hanging: 720 },
    spacing: { line: 240, lineRule: LineRuleType.AUTO, after: 240 },
    children: runs(text, { rtlDefault: !ltr }),
  });
};

// ---------- parse ----------
const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.txt')).sort();
const text = files.map(f => fs.readFileSync(path.join(srcDir, f), 'utf8')).join('\n\n');
const paras = text.split(/\n\s*\n/).map(s => s.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);

const children = [];
// cover
const cl = (t, size, bold, before = 0) => new Paragraph({
  alignment: AlignmentType.CENTER, bidirectional: true, spacing: { before, after: 120, line: 360 },
  children: [new TextRun({ text: t, font: FONT, size, bold, rightToLeft: true })],
});
children.push(cl(cover.university, 32, true, 1200));
children.push(cl(cover.faculty, 26, false));
children.push(cl(cover.course, 26, false));
children.push(cl(cover.kind, 28, true, 1600));
children.push(cl(cover.title, 34, true, 400));
children.push(cl(cover.subtitle, 30, true));
cover.lines.forEach((l, i) => children.push(cl(l, 26, false, i === 0 ? 2000 : 0)));
children.push(new Paragraph({ children: [new PageBreak()] }));

let inBib = false;
for (const p of paras) {
  if (p === '%%PAGEBREAK%%') { children.push(new Paragraph({ children: [new PageBreak()] })); continue; }
  if (p === '%%TOC%%') {
    children.push(heading('תוכן העניינים', 1));
    children.push(new TableOfContents('תוכן העניינים', { hyperlink: true, headingStyleRange: '1-2' }));
    children.push(new Paragraph({ children: [new PageBreak()] }));
    continue;
  }
  if (p === '%%BIB%%') { inBib = true; continue; }
  if (p.startsWith('## ')) { children.push(heading(p.slice(3), 2)); continue; }
  if (p.startsWith('# ')) { children.push(heading(p.slice(2), 1)); continue; }
  if (p.startsWith('> ')) { children.push(quote(p.slice(2))); continue; }
  children.push(inBib ? bibEntry(p) : body(p));
}

const doc = new Document({
  creator: 'seminar',
  title: cover.title + ' ' + cover.subtitle,
  styles: {
    default: { document: { run: { font: FONT, size: SIZE } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 32, bold: true }, paragraph: { outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 28, bold: true }, paragraph: { outlineLevel: 1 } },
    ],
  },
  features: { updateFields: true },
  footnotes,
  sections: [{
    properties: {
      page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
      titlePage: true,
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 })] })] }),
      first: new Footer({ children: [new Paragraph({ children: [] })] }),
    },
    children,
  }],
});

const outName = process.argv[2] || 'סמינריון - פרשת דרייפוס והרצל.docx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(path.join(__dirname, outName), buf);
  console.log('wrote', outName, 'footnotes:', noteId, 'paragraphs:', paras.length);
});

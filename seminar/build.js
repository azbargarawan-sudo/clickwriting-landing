// בניית קובץ ה-Word של הסמינריון. שימוש: node build.js [toc.json]
const path = require('path');
const fs = require('fs');
const SCRATCH = '/tmp/claude-0/-home-user-clickwriting-landing/a1710a63-b440-5a93-8347-06c27a6385b7/scratchpad';
const docx = require(path.join(SCRATCH, 'node_modules/docx'));
const {
  Document, Packer, Paragraph, TextRun, FootnoteReferenceRun, AlignmentType, HeadingLevel,
  PageBreak, Footer, PageNumber, Table, TableRow, TableCell, WidthType, ShadingType,
  TabStopType, LeaderType, BorderStyle, VerticalAlign,
} = docx;
const { cover, body } = require('./content.js');

const tocPages = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : {};

const HEB_FONT = { ascii: 'Times New Roman', hAnsi: 'Times New Roman', cs: 'David', eastAsia: 'David' };
// שפת ההגהה: עברית לכתב ימין-לשמאל, אנגלית לכתב לטיני, וללא סימון שגיאות כתיב (noProof).
const PROOF = { noProof: true, language: { value: 'en-US', bidirectional: 'he-IL' } };
const BODY = 24; // 12pt
const FN = 20;   // 10pt
const PAGE_W = 11906, MARGIN = 1417, TEXT_W = PAGE_W - 2 * MARGIN;

const isHeb = (ch) => /[֐-׿]/.test(ch);
const isLat = (ch) => /[A-Za-zÀ-ɏ]/.test(ch);

// מפצל טקסט לקטעים לפי כיוון (עברית / לועזית) כדי לבחור גופן ו-rtl לכל קטע.
function segments(text) {
  const out = [];
  let cur = '', curDir = null;
  for (const ch of text) {
    const d = isHeb(ch) ? 'H' : isLat(ch) ? 'L' : null;
    if (d && curDir && d !== curDir) { out.push({ text: cur, dir: curDir }); cur = ''; curDir = d; }
    else if (d && !curDir) { curDir = d; }
    cur += ch;
  }
  if (cur) out.push({ text: cur, dir: curDir || 'H' });
  return out;
}

// מפרק טקסט עם _נטוי_ ו-[[הערה]] לריצות.
function runs(text, opts = {}) {
  const size = opts.size || BODY;
  const res = [];
  const parts = text.split(/(\[\[[\s\S]*?\]\]|_[^_]+_)/g).filter(Boolean);
  for (const part of parts) {
    if (part.startsWith('[[')) {
      const id = addFootnote(part.slice(2, -2));
      res.push(new FootnoteReferenceRun(id));
      continue;
    }
    let italics = false, t = part;
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) { italics = true; t = part.slice(1, -1); }
    for (const seg of segments(t)) {
      res.push(new TextRun({
        text: seg.text, italics, bold: opts.bold, size, sizeComplexScript: size,
        font: HEB_FONT, rightToLeft: seg.dir === 'H', ...PROOF,
      }));
    }
  }
  return res;
}

const footnotes = {};
let fnCounter = 0;
function addFootnote(text) {
  const id = ++fnCounter;
  const ltr = isLat(text.trim()[0]);
  footnotes[id] = {
    children: [new Paragraph({
      bidirectional: !ltr,
      alignment: ltr ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
      spacing: { line: 240, after: 60 },
      children: runs(text, { size: FN }),
    })],
  };
  return id;
}

function para(text, extra = {}) {
  const ltr = extra.ltr === true;
  return new Paragraph({
    bidirectional: !ltr,
    alignment: extra.alignment || (ltr ? AlignmentType.LEFT : AlignmentType.JUSTIFIED),
    spacing: { line: extra.line || 360, after: extra.after ?? 120, before: extra.before ?? 0 },
    indent: extra.indent,
    pageBreakBefore: extra.pageBreakBefore,
    heading: extra.heading,
    keepNext: extra.keepNext,
    children: runs(text, { size: extra.size, bold: extra.bold }),
  });
}

function heading1(text, first) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.CENTER,
    pageBreakBefore: !first, spacing: { before: 0, after: 360, line: 360 }, keepNext: true,
    children: runs(text, { size: 32, bold: true }),
  });
}
function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, bidirectional: true, alignment: AlignmentType.START,
    spacing: { before: 240, after: 120, line: 360 }, keepNext: true,
    children: runs(text, { size: 28, bold: true }),
  });
}

function coverPage() {
  const c = (t, size, bold, after = 200) => new Paragraph({
    bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after, line: 360 },
    children: runs(t, { size, bold }),
  });
  return [
    c(cover.institution, 28, true, 120),
    c(cover.department, 26, false, 1800),
    c(cover.kind, 30, true, 1200),
    c(cover.title1, 36, true, 240),
    c(cover.title2, 32, true, 2000),
    c(cover.course, 24, false, 120),
    c(cover.lecturer, 24, false, 1400),
    c(cover.student, 24, false, 120),
    c(cover.date, 24, false, 0),
  ];
}

function tocPage() {
  const out = [new Paragraph({
    bidirectional: true, alignment: AlignmentType.CENTER, pageBreakBefore: true,
    spacing: { after: 360, line: 360 }, children: runs('תוכן עניינים', { size: 32, bold: true }),
  })];
  for (const b of body) {
    if (b.type !== 'h1' && b.type !== 'h2') continue;
    const pg = tocPages[b.text] != null ? String(tocPages[b.text]) : '';
    out.push(new Paragraph({
      bidirectional: true, alignment: AlignmentType.START,
      spacing: { line: 276, after: 0, before: b.type === 'h1' ? 100 : 0 },
      indent: b.type === 'h2' ? { start: 567 } : undefined,
      tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W, leader: LeaderType.DOT }],
      children: [
        ...runs(b.text, { bold: b.type === 'h1' }),
        new TextRun({ text: '\t' + pg, size: BODY, sizeComplexScript: BODY, font: HEB_FONT, rightToLeft: true, ...PROOF }),
      ],
    }));
  }
  return out;
}

function table(rows) {
  const widths = [1700, 1900, 3472, 2000];
  const border = { style: BorderStyle.SINGLE, size: 4, color: '888888' };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    visuallyRightToLeft: true, columnWidths: widths,
    width: { size: TEXT_W, type: WidthType.DXA },
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0, cantSplit: true,
      children: r.map((cell, j) => new TableCell({
        width: { size: widths[j], type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.CENTER,
        shading: i === 0 ? { type: ShadingType.CLEAR, fill: 'E7E6E6', color: 'auto' } : undefined,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        children: [new Paragraph({
          bidirectional: true, alignment: AlignmentType.START, spacing: { line: 276, after: 0 },
          children: runs(cell, { size: 20, bold: i === 0 }),
        })],
      })),
    })),
  });
}

const bodyChildren = [];
let firstH1 = true;
for (const b of body) {
  switch (b.type) {
    case 'h1': bodyChildren.push(heading1(b.text, firstH1)); firstH1 = false; break;
    case 'h2': bodyChildren.push(heading2(b.text)); break;
    case 'p': bodyChildren.push(para(b.text)); break;
    case 'quote': bodyChildren.push(para(b.text, { indent: { start: 709, end: 709 }, line: 300, after: 200 })); break;
    case 'bibh': bodyChildren.push(para(b.text, { bold: true, size: 26, before: 240, after: 120, keepNext: true, alignment: AlignmentType.START })); break;
    case 'bib': {
      const ltr = isLat(b.text.trim()[0]);
      bodyChildren.push(para(b.text, { ltr, indent: ltr ? { left: 709, hanging: 709 } : { start: 709, hanging: 709 }, line: 276, after: 160 }));
      break;
    }
    case 'table': bodyChildren.push(table(b.rows)); bodyChildren.push(new Paragraph({ spacing: { after: 120 } })); break;
  }
}

const pageProps = { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } };

const doc = new Document({
  creator: 'Seminar',
  title: cover.title2,
  styles: {
    default: { document: { run: { font: HEB_FONT, size: BODY, sizeComplexScript: BODY, ...PROOF } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, font: HEB_FONT }, paragraph: { outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: HEB_FONT }, paragraph: { outlineLevel: 1 } },
    ],
  },
  footnotes,
  sections: [
    { properties: { page: pageProps, bidi: true }, children: [...coverPage(), ...tocPage()] },
    {
      properties: { page: { ...pageProps, pageNumbers: { start: 1 } }, bidi: true },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 22, font: HEB_FONT, ...PROOF })] })] }) },
      children: bodyChildren,
    },
  ],
});

const out = process.argv[3] || path.join(__dirname, 'seminar-donkey-fables.docx');
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('wrote', out, buf.length, 'bytes'); });

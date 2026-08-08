const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, PageBreak, AlignmentType, HeadingLevel,
  Table, TableRow, TableCell, WidthType, ShadingType, Tab, TabStopType, LeaderType,
  Footer, PageNumber, LevelFormat, convertMillimetersToTwip, BorderStyle,
} = require('docx');

const CS_FONT = process.env.CS_FONT || 'Simplified Arabic';
const AR_FONT = { ascii: 'Times New Roman', hAnsi: 'Times New Roman', cs: CS_FONT };
const SIZE = 28;        // 14pt
const LINE = 480;       // double spacing
const IND = 709;        // 1.25 cm
const MARGIN = convertMillimetersToTwip(25);

const run = (text, opts = {}) => new TextRun({
  text, font: AR_FONT, size: SIZE, rightToLeft: true, ...opts,
});

const P = (text) => new Paragraph({
  bidirectional: true,
  alignment: AlignmentType.JUSTIFIED,
  spacing: { line: LINE, after: 0 },
  indent: { firstLine: IND },
  children: [run(text)],
});

const MARK = process.env.TOC_PASS === '1';
let markSeq = 0;
const marks = [];

const H = (text, level, size) => {
  const kids = [run(text, { bold: true, size, color: '000000' })];
  if (MARK) {
    const n = markSeq++; const id = 'ZQ' + String.fromCharCode(65 + Math.floor(n / 26)) + String.fromCharCode(65 + (n % 26));
    marks.push({ id, text });
    kids.push(new TextRun({ text: id, size: 2, font: { ascii: 'Times New Roman' } }));
  }
  return new Paragraph({
    heading: level,
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    pageBreakBefore: level === HeadingLevel.HEADING_1,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 0 : 320, after: 200, line: LINE },
    children: kids,
  });
};

// «...» يحدّد المقاطع التي تُكتب بخطّ مائل حسب APA
const italicRuns = (text, ltr) => text.split(/[«»]/)
  .map((seg, i) => ({ seg, italics: i % 2 === 1 }))
  .filter((o) => o.seg !== '')
  .map((o) => new TextRun({
    text: o.seg,
    italics: o.italics,
    font: ltr ? { ascii: 'Times New Roman', hAnsi: 'Times New Roman' } : AR_FONT,
    size: SIZE,
    rightToLeft: !ltr,
  }));

// عنوان الجدول: رقم الجدول بخطّ عريض، ثم العنوان بخطّ مائل تحته
const CAP = (text) => {
  const [num, ...rest] = text.split(': ');
  const title = rest.join(': ');
  const base = { bidirectional: true, alignment: AlignmentType.RIGHT };
  return [
    new Paragraph({ ...base, spacing: { before: 240, after: 0, line: 240 }, children: [run(num, { bold: true, size: 26 })] }),
    new Paragraph({ ...base, spacing: { before: 0, after: 120, line: 240 }, children: [run(title, { italics: true, size: 26 })] }),
  ];
};

const REF = (text, ltr) => new Paragraph({
  bidirectional: !ltr,
  alignment: ltr ? AlignmentType.LEFT : AlignmentType.RIGHT,
  spacing: { line: LINE, after: 0 },
  indent: { start: IND, hanging: IND },
  children: italicRuns(text, ltr),
});

const LI = (text) => new Paragraph({
  numbering: { reference: 'recs', level: 0 },
  bidirectional: true,
  alignment: AlignmentType.JUSTIFIED,
  spacing: { line: LINE, after: 0 },
  children: [run(text)],
});

const cell = (text, width, header) => new TableCell({
  width: { size: width, type: WidthType.DXA },
  shading: header ? { type: ShadingType.CLEAR, fill: 'E8E8E8', color: 'auto' } : undefined,
  margins: { top: 80, bottom: 80, left: 100, right: 100 },
  children: [new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { line: 240, after: 0 },
    children: [run(text, { size: 24, bold: !!header })],
  })],
});

const TBL = (rows, widths) => {
  const w = widths.slice().reverse();
  return new Table({
    visuallyRightToLeft: true,
    columnWidths: w,
    width: { size: w.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0,
      children: r.slice().reverse().map((c, j) => cell(c, w[j], i === 0)),
    })),
  });
};

// ---------- cover page ----------
const coverLine = (text, opts = {}) => new Paragraph({
  bidirectional: true,
  alignment: AlignmentType.CENTER,
  spacing: { line: 360, after: opts.after === undefined ? 0 : opts.after },
  children: [run(text, { bold: opts.bold, size: opts.size || SIZE })],
});

const cover = [
  coverLine('[اسم المؤسسة الأكاديمية]', { bold: true, size: 30 }),
  coverLine('[اسم البرنامج / القسم]', { after: 480 }),
  coverLine('[اسم الكورس ورقمه]'),
  coverLine('[اسم المحاضرة]', { after: 1400 }),
  coverLine('الذكاء الاصطناعي ودمجه في التعليم', { bold: true, size: 40 }),
  coverLine('تصميم وحدة تعليمية في العلوم للصف الخامس', { bold: true, size: 32 }),
  coverLine('باستخدام أداة Canva', { bold: true, size: 32, after: 240 }),
  coverLine('عمل سيمنار', { after: 1400 }),
  coverLine('إعداد: [الاسم الكامل]'),
  coverLine('رقم الهوية: [__________]', { after: 1200 }),
  coverLine('التاريخ العبري: [__________]'),
  coverLine('التاريخ الميلادي: [__________]'),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- body ----------
const content = require('./content.js');

// ---------- table of contents (static, with real page numbers) ----------
let pageMap = {};
try { pageMap = JSON.parse(fs.readFileSync('pages.json', 'utf8')); } catch (e) { /* first pass */ }

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NO_BORDERS = {
  top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
  insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
};

const tocRow = (text, level) => new TableRow({
  children: [
    new TableCell({
      width: { size: 8000, type: WidthType.DXA },
      borders: NO_BORDERS,
      margins: { top: 30, bottom: 30, left: 0, right: 0 },
      children: [new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { line: 300, after: 0 },
        indent: { start: level === 1 ? 0 : level === 2 ? 280 : 560 },
        children: [run(text, { bold: level === 1, size: level === 1 ? 26 : 24 })],
      })],
    }),
    new TableCell({
      width: { size: 1072, type: WidthType.DXA },
      borders: NO_BORDERS,
      margins: { top: 30, bottom: 30, left: 0, right: 0 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 300, after: 0 },
        children: [run(String(pageMap[text] || ''), { size: 24, bold: level === 1 })],
      })],
    }),
  ],
});

const toc = [
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { after: 400, line: LINE },
    children: [run('فهرس المحتويات', { bold: true, size: 32 })],
  }),
  new Table({
    visuallyRightToLeft: true,
    borders: NO_BORDERS,
    columnWidths: [8000, 1072],
    width: { size: 9072, type: WidthType.DXA },
    rows: content
      .filter((b) => b.t === 'h1' || b.t === 'h2' || b.t === 'h3')
      .map((b) => tocRow(b.x, b.t === 'h1' ? 1 : b.t === 'h2' ? 2 : 3)),
  }),
];
const body = [];
for (const b of content) {
  if (b.t === 'p') body.push(P(b.x));
  else if (b.t === 'h1') body.push(H(b.x, HeadingLevel.HEADING_1, 32));
  else if (b.t === 'h2') body.push(H(b.x, HeadingLevel.HEADING_2, 29));
  else if (b.t === 'h3') body.push(H(b.x, HeadingLevel.HEADING_3, 27));
  else if (b.t === 'cap') body.push(...CAP(b.x));
  else if (b.t === 'tbl') { body.push(TBL(b.rows, b.widths)); body.push(new Paragraph({ spacing: { after: 200 }, children: [] })); }
  else if (b.t === 'ref') body.push(REF(b.x, false));
  else if (b.t === 'refEn') body.push(REF(b.x, true));
  else if (b.t === 'li') body.push(LI(b.x));
}

const doc = new Document({
  numbering: {
    config: [{
      reference: 'recs',
      levels: [{
        level: 0,
        format: LevelFormat.DECIMAL,
        text: '%1.',
        alignment: AlignmentType.START,
        style: { paragraph: { indent: { start: IND, hanging: 360 } } },
      }],
    }],
  },
  styles: {
    default: {
      document: { run: { font: AR_FONT, size: SIZE }, paragraph: { spacing: { line: LINE } } },
    },
  },
  sections: [{
    properties: {
      page: { margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: AR_FONT, size: 24 })],
        })],
      }),
    },
    children: [...cover, ...toc, ...body],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2] || 'seminar.docx', buf);
  if (MARK) fs.writeFileSync('marks.json', JSON.stringify(marks, null, 1));
  console.log('written:', (buf.length / 1024).toFixed(1) + ' KB');
});

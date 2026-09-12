const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, TableOfContents,
  Footer, PageNumber, LevelFormat, TabStopType, VerticalAlign
} = require('docx');

const AR_FONT = process.env.AR_FONT || 'David';
const EN_FONT = process.env.EN_FONT || 'Times New Roman';
const FONT = { ascii: EN_FONT, hAnsi: EN_FONT, cs: AR_FONT, eastAsia: EN_FONT };
const BODY = 28;   // 14pt
const BODY_CS = 26; // 13pt Hebrew
const H1 = 36, H2 = 32, H3 = 30;
const LINE = 360; // 1.5 spacing
const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 1440;
const TABLE_W = PAGE_W - 2 * MARGIN; // 9026

const TITLE = 'רשימת מקורות שפיטים: הוראה מודעת טראומה בישראל (2021–2026)';

function runs(text, opts = {}) {
  // supports **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map(p => {
    const bold = p.startsWith('**') && p.endsWith('**');
    const t = bold ? p.slice(2, -2) : p;
    return new TextRun({
      text: t,
      font: FONT,
      size: opts.size || BODY,
      sizeComplexScript: opts.sizeCs || BODY_CS,
      bold: bold || opts.bold || false,
      boldComplexScript: bold || opts.bold || false,
      rightToLeft: opts.ltr ? false : true,
      italics: opts.italics || false,
      color: opts.color,
    });
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: runs(text, opts),
    bidirectional: !opts.ltr,
    alignment: opts.align || AlignmentType.BOTH,
    heading: opts.heading,
    spacing: { line: opts.line || LINE, before: opts.before || 0, after: opts.after === undefined ? 120 : opts.after },
    indent: opts.indent,
    numbering: opts.numbering,
    keepNext: opts.keepNext,
    pageBreakBefore: opts.pageBreakBefore,
  });
}

function heading(text, level) {
  const map = { 1: [HeadingLevel.HEADING_1, H1, AlignmentType.CENTER, 240], 2: [HeadingLevel.HEADING_2, H2, AlignmentType.RIGHT, 200], 3: [HeadingLevel.HEADING_3, H3, AlignmentType.RIGHT, 160] };
  const [h, size, align, before] = map[level];
  return new Paragraph({
    heading: h,
    bidirectional: true,
    alignment: align,
    keepNext: true,
    spacing: { line: LINE, before, after: 120 },
    children: [new TextRun({ text, font: FONT, size, sizeComplexScript: size + 4, bold: true, boldComplexScript: true, rightToLeft: true })],
  });
}

function cell(text, { header = false, width }) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: header ? { type: ShadingType.CLEAR, fill: 'D9E2F3', color: 'auto' } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: [new Paragraph({
      bidirectional: true,
      alignment: header ? AlignmentType.CENTER : AlignmentType.RIGHT,
      spacing: { line: 276, after: 0 },
      children: [new TextRun({ text, font: FONT, size: 22, sizeComplexScript: 24, bold: header, boldComplexScript: header, rightToLeft: true })],
    })],
  });
}

function table(rows, weights) {
  const n = rows[0].length;
  const w = weights || Array(n).fill(1);
  const sum = w.reduce((a, b) => a + b, 0);
  const widths = w.map(x => Math.round(TABLE_W * x / sum));
  widths[widths.length - 1] += TABLE_W - widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: TABLE_W, type: WidthType.DXA },
    columnWidths: widths,
    visuallyRightToLeft: true,
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0,
      cantSplit: true,
      children: r.map((c, j) => cell(c, { header: i === 0, width: widths[j] })),
    })),
  });
}

// ---------- parse content ----------
const src = fs.readFileSync(path.join(__dirname, 'content.txt'), 'utf8').split('\n');
const body = [];
let numCount = 0;
let inNum = false;
let i = 0;
const numRefs = [];
while (i < src.length) {
  let line = src[i];
  if (line.trim() === '') { inNum = false; i++; continue; }
  if (line === '[[TOC]]') {
    body.push(new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240, line: LINE },
      children: [new TextRun({ text: 'فهرس المحتويات', font: FONT, size: H1, sizeComplexScript: H1 + 4, bold: true, boldComplexScript: true, rightToLeft: true })] }));
    body.push(new TableOfContents('فهرس المحتويات', { hyperlink: true, headingStyleRange: '1-3' }));
    inNum = false; i++; continue;
  }
  if (line === 'PAGEBREAK') { body.push(new Paragraph({ children: [new PageBreak()] })); inNum = false; i++; continue; }
  if (line === 'TABLE') {
    const caption = src[++i];
    const rows = [];
    i++;
    while (src[i] !== 'ENDTABLE') { rows.push(src[i].split(' | ').map(s => s.trim())); i++; }
    i++;
    body.push(para(caption, { bold: true, align: AlignmentType.CENTER, keepNext: true, before: 120, after: 80 }));
    let weights = null;
    if (rows[0].length === 5) weights = [1, 1, 1.3, 1.5, 3];
    if (rows[0].length === 3 && rows[0][0] === 'المحور') weights = [1.3, 3.2, 3];
    if (rows[0].length === 3 && rows[0][0] === 'الموضوع الرئيس') weights = [2, 4, 1.6];
    body.push(table(rows, weights));
    body.push(para('', { after: 120 }));
    inNum = false; continue;
  }
  if (line.startsWith('### ')) { body.push(heading(line.slice(4), 3)); inNum = false; i++; continue; }
  if (line.startsWith('## ')) { body.push(heading(line.slice(3), 2)); inNum = false; i++; continue; }
  if (line.startsWith('# ')) { body.push(heading(line.slice(2), 1)); inNum = false; i++; continue; }
  if (line.startsWith('> ')) {
    body.push(para(line.slice(2), { indent: { left: 720, right: 720 }, after: 160 }));
    inNum = false; i++; continue;
  }
  if (line.startsWith('- ')) {
    body.push(para(line.slice(2), { numbering: { reference: 'bullets', level: 0 } }));
    inNum = false; i++; continue;
  }
  if (/^1\. /.test(line)) {
    if (!inNum) { numCount++; numRefs.push('num' + numCount); inNum = true; }
    body.push(para(line.replace(/^1\. /, ''), { numbering: { reference: 'num' + numCount, level: 0 } }));
    i++; continue;
  }
  if (/^\+\. /.test(line)) { // continue the previous numbered list
    body.push(para(line.replace(/^\+\. /, ''), { numbering: { reference: 'num' + numCount, level: 0 } }));
    inNum = false; i++; continue;
  }
  if (line.startsWith('REFEN ')) {
    body.push(para(line.slice(6), { ltr: true, align: AlignmentType.LEFT, indent: { left: 720, hanging: 720 }, after: 160 }));
    inNum = false; i++; continue;
  }
  if (line.startsWith('REF ')) {
    body.push(para(line.slice(4), { indent: { left: 720, hanging: 720 }, after: 160 }));
    inNum = false; i++; continue;
  }
  body.push(para(line));
  inNum = false; i++;
}

// ---------- cover page ----------
const coverLine = (t, o = {}) => new Paragraph({
  bidirectional: true, alignment: AlignmentType.CENTER,
  spacing: { before: o.before || 0, after: o.after === undefined ? 200 : o.after, line: LINE },
  children: [new TextRun({ text: t, font: FONT, size: o.size || 28, sizeComplexScript: (o.size || 28) + 4, bold: o.bold || false, boldComplexScript: o.bold || false, rightToLeft: true })],
});
const cover = [
  coverLine(TITLE, { bold: true, size: 36, after: 300 }),
  coverLine('מקורות נלווים לספר Becoming Trauma Responsive (Lane, Chow, Hambrick & Earl, 2025)', { size: 26, after: 200 }),
  coverLine('12 מאמרים בעברית ו-9 מאמרים באנגלית, שפיטים, בגישה פתוחה, מחמש השנים האחרונות, בהקשר ישראלי', { size: 26, after: 200 }),
  coverLine('נערך: ספטמבר 2026', { size: 24 }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------- numbering ----------
const numbering = {
  config: [
    { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.RIGHT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ...numRefs.map(ref => ({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.RIGHT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] })),
  ],
};

const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 24 })] })] });

const doc = new Document({
  creator: 'Student',
  title: TITLE,
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: BODY, sizeComplexScript: BODY_CS, rightToLeft: true }, paragraph: { spacing: { line: LINE, after: 120 } } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: H1, bold: true, font: FONT, color: '000000' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: H2, bold: true, font: FONT, color: '000000' }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: H3, bold: true, font: FONT, color: '000000' }, paragraph: { spacing: { before: 160, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering,
  sections: [
    { properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } }, titlePage: true },
      children: cover },
    { properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN }, pageNumbers: { start: 1 } } },
      footers: { default: footer },
      children: body },
  ],
});

const out = process.argv[2] || path.join(__dirname, 'paper.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(out, buf); console.log('wrote', out, buf.length, 'bytes'); });

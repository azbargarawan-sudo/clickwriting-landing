// Builds the seminar paper .docx (Hebrew, RTL) from content files.
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
  TableOfContents, PageBreak, Footer, PageNumber, SectionType, ImageRun,
} = require('docx');
const sizeOf = f => {
  const b = fs.readFileSync(f);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; // PNG IHDR
};
const fs = require('fs');

const HE_FONT = 'David';
const AR_FONT = 'Arial';
const EN_FONT = 'Times New Roman';
const BODY = 24; // 12pt in half-points

function heRun(text, opts = {}) {
  const size = opts.size || BODY;
  return new TextRun({
    text,
    font: HE_FONT,
    size, sizeComplexScript: size,
    rightToLeft: true,
    noProof: true,
    language: { value: 'he-IL', bidirectional: 'he-IL' },
    bold: !!opts.bold, boldComplexScript: !!opts.bold,
    italics: !!opts.italics, italicsComplexScript: !!opts.italics,
    underline: opts.underline ? {} : undefined,
  });
}
function arRun(text, opts = {}) {
  const size = opts.size || BODY;
  return new TextRun({
    text,
    font: AR_FONT,
    size, sizeComplexScript: size,
    rightToLeft: true,
    noProof: true,
    language: { value: 'ar-SA', bidirectional: 'ar-SA' },
    bold: !!opts.bold, boldComplexScript: !!opts.bold,
  });
}
function enRun(text, opts = {}) {
  const size = opts.size || BODY;
  return new TextRun({
    text,
    font: EN_FONT,
    size, sizeComplexScript: size,
    noProof: true,
    language: { value: 'en-US' },
    bold: !!opts.bold,
    italics: !!opts.italics,
  });
}

// Parse **bold** markers inside Hebrew text into runs.
function heRuns(text, opts = {}) {
  const parts = String(text).split('**');
  return parts.map((p, i) => heRun(p, { ...opts, bold: i % 2 === 1 ? true : !!opts.bold }));
}

const SP = { line: 360, lineRule: 'auto', after: 120 }; // 1.5 line spacing

function render(item) {
  switch (item.t) {
    case 'h1':
      return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { before: 360, after: 240, line: 360, lineRule: 'auto' },
        children: [heRun(item.text, { bold: true, size: 32 })],
      });
    case 'h2':
      return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { before: 280, after: 180, line: 360, lineRule: 'auto' },
        children: [heRun(item.text, { bold: true, size: 28 })],
      });
    case 'h3':
      return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { before: 220, after: 140, line: 360, lineRule: 'auto' },
        children: [heRun(item.text, { bold: true, size: 26 })],
      });
    case 'p':
      return new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.BOTH,
        spacing: SP,
        children: heRuns(item.text),
      });
    case 'q': // block quotation, 40+ words, no quotation marks (APA 7)
      return new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.BOTH,
        spacing: { line: 360, lineRule: 'auto', after: 120 },
        indent: { left: 720, right: 720 },
        children: heRuns(item.text),
      });
    case 'ar': // Arabic paragraph (appendices)
      return new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: SP,
        children: [arRun(item.text, item.bold ? { bold: true } : {})],
      });
    case 'refHe':
      return new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.BOTH,
        spacing: { line: 360, lineRule: 'auto', after: 160 },
        indent: { left: 720, hanging: 720 },
        children: heRuns(item.text),
      });
    case 'refEn':
      return new Paragraph({
        bidirectional: false,
        alignment: AlignmentType.LEFT,
        spacing: { line: 360, lineRule: 'auto', after: 160 },
        indent: { left: 720, hanging: 720 },
        children: item.runs
          ? item.runs.map(r => enRun(r.text, r))
          : [enRun(item.text)],
      });
    case 'center':
      return new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, lineRule: 'auto', after: item.after != null ? item.after : 120 },
        children: heRuns(item.text, { size: item.size || BODY, bold: !!item.bold }),
      });
    case 'empty':
      return new Paragraph({ spacing: { after: item.after || 200 }, children: [] });
    case 'img': {
      const file = __dirname + '/' + item.file;
      const { w, h } = sizeOf(file);
      const maxW = item.maxW || 600, maxH = item.maxH || 840;
      const scale = Math.min(maxW / w, maxH / h);
      return new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new ImageRun({
          data: fs.readFileSync(file),
          type: 'png',
          transformation: { width: Math.round(w * scale), height: Math.round(h * scale) },
        })],
      });
    }
    case 'pb':
      return new Paragraph({ children: [new PageBreak()] });
    default:
      throw new Error('unknown item type: ' + item.t);
  }
}

function buildDoc(coverItems, bodyItems) {
  const footer = new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], font: HE_FONT, size: 22 })],
    })],
  });

  const tocBlock = [
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [heRun('תוכן העניינים', { bold: true, size: 32 })],
    }),
    new TableOfContents('תוכן העניינים', {
      hyperlink: true,
      headingStyleRange: '1-2',
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  return new Document({
    features: { updateFields: true },
    styles: {
      default: {
        document: { run: { font: HE_FONT, size: BODY } },
      },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: HE_FONT, size: 32, bold: true, color: '000000' },
          paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: HE_FONT, size: 28, bold: true, color: '000000' },
          paragraph: { spacing: { before: 280, after: 180 }, outlineLevel: 1 } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: HE_FONT, size: 26, bold: true, color: '000000' },
          paragraph: { spacing: { before: 220, after: 140 }, outlineLevel: 2 } },
      ],
    },
    sections: [
      { // cover — no page number
        properties: { titlePage: false, page: { margin: { top: 1417, right: 1417, bottom: 1417, left: 1417 } } },
        children: coverItems.map(render),
      },
      { // TOC + body — with page numbers
        properties: { type: SectionType.NEXT_PAGE, page: { margin: { top: 1417, right: 1417, bottom: 1417, left: 1417 } } },
        footers: { default: footer },
        children: [...tocBlock, ...bodyItems.map(render)],
      },
    ],
  });
}

const cover = require('./content_cover.js');
const body = [
  ...require('./content_intro.js'),
  ...require('./content_lit.js'),
  ...require('./content_method.js'),
  ...require('./content_findings.js'),
  ...require('./content_discussion.js'),
  ...require('./content_summary.js'),
  ...require('./content_biblio.js'),
  ...require('./content_appendix.js'),
];

const doc = buildDoc(cover, body);
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(__dirname + '/seminar.docx', buf);
  console.log('written seminar.docx', buf.length, 'bytes');
});

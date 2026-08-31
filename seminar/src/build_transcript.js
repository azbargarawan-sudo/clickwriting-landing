// Builds the transcript appendix .docx (Hebrew, RTL) — companion file to the seminar.
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
  TableOfContents, PageBreak, Footer, PageNumber, SectionType, ImageRun,
} = require('docx');
const fs = require('fs');
const sizeOf = f => {
  const b = fs.readFileSync(f);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; // PNG IHDR
};

const HE_FONT = 'David';
const AR_FONT = 'Arial';
const BODY = 24; // 12pt

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
function heRuns(text, opts = {}) {
  const parts = String(text).split('**');
  return parts.map((p, i) => heRun(p, { ...opts, bold: i % 2 === 1 ? true : !!opts.bold }));
}

const SP = { line: 360, lineRule: 'auto', after: 120 };

function render(item) {
  switch (item.t) {
    case 'h1':
      return new Paragraph({
        heading: HeadingLevel.HEADING_1, bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { before: 360, after: 240, line: 360, lineRule: 'auto' },
        children: [heRun(item.text, { bold: true, size: 32 })],
      });
    case 'h2':
      return new Paragraph({
        heading: HeadingLevel.HEADING_2, bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { before: 280, after: 180, line: 360, lineRule: 'auto' },
        children: [heRun(item.text, { bold: true, size: 28 })],
      });
    case 'p':
      return new Paragraph({
        bidirectional: true, alignment: AlignmentType.BOTH, spacing: SP,
        children: heRuns(item.text),
      });
    case 'dlg': // transcript line: hanging indent, tighter spacing
      return new Paragraph({
        bidirectional: true, alignment: AlignmentType.RIGHT,
        spacing: { line: 360, lineRule: 'auto', after: 80 },
        indent: { left: 567, hanging: 567 },
        children: heRuns(item.text),
      });
    case 'note': // stage direction / researcher note
      return new Paragraph({
        bidirectional: true, alignment: AlignmentType.RIGHT,
        spacing: { line: 360, lineRule: 'auto', before: 100, after: 100 },
        indent: { left: 567 },
        children: [heRun(item.text, { italics: true })],
      });
    case 'ar':
      return new Paragraph({
        bidirectional: true, alignment: AlignmentType.RIGHT, spacing: SP,
        children: [arRun(item.text)],
      });
    case 'center':
      return new Paragraph({
        bidirectional: true, alignment: AlignmentType.CENTER,
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
        alignment: AlignmentType.CENTER, spacing: { after: 120 },
        children: [new ImageRun({
          data: fs.readFileSync(file), type: 'png',
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

const content = require('./content_transcript.js');
const coverEnd = content.findIndex(i => i.t === 'pb');
const cover = content.slice(0, coverEnd + 1);
const body = content.slice(coverEnd + 1);

const footer = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ children: [PageNumber.CURRENT], font: HE_FONT, size: 22 })],
  })],
});

const doc = new Document({
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: HE_FONT, size: BODY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: HE_FONT, size: 32, bold: true, color: '000000' },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: HE_FONT, size: 28, bold: true, color: '000000' },
        paragraph: { spacing: { before: 280, after: 180 }, outlineLevel: 1 } },
    ],
  },
  sections: [
    { properties: { titlePage: false, page: { margin: { top: 1417, right: 1417, bottom: 1417, left: 1417 } } },
      children: cover.map(render) },
    { properties: { type: SectionType.NEXT_PAGE, page: { margin: { top: 1417, right: 1417, bottom: 1417, left: 1417 } } },
      footers: { default: footer },
      children: [
        new Paragraph({
          bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 240 },
          children: [heRun('תוכן העניינים', { bold: true, size: 32 })],
        }),
        new TableOfContents('תוכן העניינים', { hyperlink: true, headingStyleRange: '1-2' }),
        new Paragraph({ children: [new PageBreak()] }),
        ...body.map(render),
      ] },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(__dirname + '/transcript.docx', buf);
  console.log('written transcript.docx', buf.length, 'bytes');
});

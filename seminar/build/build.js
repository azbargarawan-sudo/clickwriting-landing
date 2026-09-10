const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
        TableOfContents, PageNumber, Footer, LineRuleType } = require('docx');
const blocks = [...require('./content1'), ...require('./content2'), ...require('./content2b'), ...require('./content3')];

const HE = 'David', EN = 'Times New Roman';
const SZ = 24; // 12pt
const LINE = 360; // 1.5
const isLatin = s => /^[A-Za-z0-9(\[]/.test(s);

// split a Hebrew paragraph into runs: Latin segments get Times New Roman
function runs(text, opts = {}) {
  const parts = text.split(/(\([A-Za-z][^()]*[A-Za-z0-9.]\)|[A-Za-z][A-Za-z0-9 .,&'’:;/\-]*[A-Za-z0-9.])/g).filter(Boolean);
  return parts.map(p => new TextRun({
    text: p,
    font: /[A-Za-z]/.test(p) ? EN : HE,
    size: opts.size || SZ,
    bold: opts.bold,
    rightToLeft: !/[A-Za-z]/.test(p),
    highlight: opts.flag ? 'yellow' : undefined,
  }));
}
// runs for an English reference, with journal/volume italic
function enRefRuns(text, it) {
  const i = it ? text.indexOf(it) : -1;
  const seg = i >= 0 ? [[text.slice(0, i), false], [it, true], [text.slice(i + it.length), false]] : [[text, false]];
  return seg.filter(s => s[0]).map(s => new TextRun({ text: s[0], font: EN, size: SZ, italics: s[1] }));
}
function heRefRuns(text, it, flag) {
  const i = it ? text.indexOf(it) : -1;
  const seg = i >= 0 ? [[text.slice(0, i), false], [it, true], [text.slice(i + it.length), false]] : [[text, false]];
  const out = [];
  for (const [s, ital] of seg) {
    if (!s) continue;
    for (const p of s.split(/(https?:\/\/\S+|[A-Z]\d+-[A-Z]\d+|\[[^\]]*\])/g).filter(Boolean)) {
      const latin = /^https?:|^[A-Z]\d/.test(p);
      const ph = /^\[/.test(p);
      out.push(new TextRun({ text: p, font: latin ? EN : HE, size: SZ, italics: ital && !latin, rightToLeft: !latin, highlight: (flag && ph) ? 'yellow' : undefined }));
    }
  }
  return out;
}

const body = [];
const P = (children, extra = {}) => new Paragraph({ bidirectional: true, alignment: AlignmentType.JUSTIFIED,
  spacing: { line: LINE, lineRule: LineRuleType.AUTO, after: 120 }, children, ...extra });

// ---- cover page ----
const cover = (t, o = {}) => new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
  spacing: { line: LINE, before: o.before || 0, after: o.after || 120 },
  children: runs(t, { size: o.size || SZ, bold: o.bold }) });
body.push(cover('הקריה האקדמית אונו', { bold: true, size: 28, before: 600 }));
body.push(cover('הפקולטה למדעי הרוח והחברה'));
body.push(cover('התוכנית לתואר שני בחינוך', { after: 1400 }));
body.push(cover('תרומת הצוות הפרא-רפואי לשיפור התפקודים הניהוליים', { bold: true, size: 32 }));
body.push(cover('בקרב ילדים עם אוטיזם בתפקוד גבוה בגן הילדים', { bold: true, size: 32, after: 400 }));
body.push(cover('עבודה סמינריונית עיונית', { after: 1600 }));
body.push(cover('שם הקורס: סמינר בחינוך המיוחד (7618)'));
body.push(cover('שם המרצה: ד"ר נאילה תלס מחאגנה', { after: 600 }));
body.push(cover('מגישה: הייכל מרווה'));
body.push(cover('ת"ז: 205769862', { after: 600 }));
body.push(cover('תאריך הגשה: ה\' בחשוון תשפ"ז, 16.10.2026'));
body.push(new Paragraph({ children: [new PageBreak()] }));

// ---- TOC ----
body.push(new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after: 240 },
  children: [new TextRun({ text: 'תוכן עניינים', font: HE, size: 32, bold: true, rightToLeft: true })] }));
body.push(new TableOfContents('תוכן עניינים', { hyperlink: true, headingStyleRange: '1-3' }));
body.push(new Paragraph({ children: [new PageBreak()] }));

// ---- body ----
for (const b of blocks) {
  if (b.t === 'pb') { body.push(new Paragraph({ children: [new PageBreak()] })); continue; }
  if (b.t === 'h1') body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT,
      spacing: { before: 240, after: 240, line: LINE }, children: runs(b.x, { bold: true, size: 32 }) }));
  else if (b.t === 'h2') body.push(new Paragraph({ heading: HeadingLevel.HEADING_2, bidirectional: true, alignment: AlignmentType.RIGHT,
      spacing: { before: 240, after: 120, line: LINE }, children: runs(b.x, { bold: true, size: 28 }) }));
  else if (b.t === 'h3') body.push(new Paragraph({ heading: HeadingLevel.HEADING_3, bidirectional: true, alignment: AlignmentType.RIGHT,
      spacing: { before: 120, after: 120, line: LINE }, children: runs(b.x, { bold: true, size: 24 }) }));
  else if (b.t === 'p') body.push(P(runs(b.x), { indent: { firstLine: 567 } }));

  else if (b.t === 'table') {
    const W = [1900, 2000, 1500, 3026, 600];
    const cellP = (txt, hdr) => new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { line: 240, after: 0 },
      children: runs(txt, { size: 20, bold: hdr }) });
    const rows = b.rows.map((r, ri) => new TableRow({ tableHeader: ri === 0, cantSplit: true, children: r.map((c, ci) => new TableCell({
      width: { size: W[ci], type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 80, right: 80 },
      shading: ri === 0 ? { type: ShadingType.CLEAR, fill: 'E7E6E6', color: 'auto' } : undefined,
      children: [cellP(c, ri === 0)] })) }));
    body.push(new Table({ visuallyRightToLeft: true, columnWidths: W, width: { size: W.reduce((a, c) => a + c, 0), type: WidthType.DXA }, rows }));
    body.push(new Paragraph({ children: [] }));
  }
  else if (b.t === 'ref') {
    if (b.lang === 'en') body.push(new Paragraph({ bidirectional: false, alignment: AlignmentType.LEFT,
        spacing: { line: 480, after: 0 }, indent: { start: 720, hanging: 720 }, children: enRefRuns(b.x, b.it) }));
    else body.push(new Paragraph({ bidirectional: true, alignment: AlignmentType.START,
        spacing: { line: 480, after: 0 }, indent: { start: 720, hanging: 720 }, children: heRefRuns(b.x, b.it, b.flag) }));
  }
}

const doc = new Document({
  creator: 'הייכל מרווה',
  title: 'תרומת הצוות הפרא-רפואי לשיפור התפקודים הניהוליים בקרב ילדים עם אוטיזם בתפקוד גבוה בגן הילדים',
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: HE, size: SZ, rightToLeft: true } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: HE, size: 32, bold: true, color: '000000' }, paragraph: { outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: HE, size: 28, bold: true, color: '000000' }, paragraph: { outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: HE, size: 24, bold: true, color: '000000' }, paragraph: { outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } }, bidi: true },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], font: HE, size: 20 })] })] }) },
    children: body,
  }],
});
Packer.toBuffer(doc).then(buf => { fs.writeFileSync('seminar.docx', buf); console.log('written', buf.length); });

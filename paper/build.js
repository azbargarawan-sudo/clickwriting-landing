const fs = require('fs');
const path = require('path');
const D = require('docx');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageBreak, Footer, PageNumber, ImageRun, LevelFormat, Tab, TabStopType,
  LeaderType, convertMillimetersToTwip
} = D;

const FONT = 'David';
const SZ = 28;      // 14pt
const LINE = 360;   // 1.5
const W = convertMillimetersToTwip(160); // content width

const blocks = [
  ...require('./content-1.js'),
  ...require('./content-2.js'),
  ...require('./content-3.js'),
];

let tocPages = {};
try { tocPages = JSON.parse(fs.readFileSync(path.join(__dirname, 'toc-pages.json'), 'utf8')); } catch (e) {}

// כותרות ספרים המודגשות בנטוי בגוף הטקסט
const TITLES = /(געגועי לקיסינג'ר|אוטוקורקט|צינורות \(1992\)|Alone Together)/g;

const run = (text, o = {}) => new TextRun({
  text, font: FONT, size: o.size || SZ,
  rightToLeft: o.ltr ? false : true,
  bold: !!o.bold, italics: !!o.italics, color: o.color,
});

const autoRuns = (text, o = {}) => {
  const parts = text.split(TITLES).filter((s) => s !== '');
  return parts.map((s) => run(s, Object.assign({}, o, { italics: o.italics || TITLES.test(s) && (TITLES.lastIndex = 0, true) })));
};

const base = (children, o = {}) => new Paragraph({
  children,
  bidirectional: o.ltr ? false : true,
  alignment: o.alignment || AlignmentType.JUSTIFIED,
  spacing: { line: LINE, lineRule: 'auto', after: o.after === undefined ? 120 : o.after, before: o.before || 0 },
  indent: o.indent,
  numbering: o.numbering,
  tabStops: o.tabStops,
});

const img = (file, w, h) => new Paragraph({
  bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 200 },
  children: [new ImageRun({ type: 'png', data: fs.readFileSync(path.join(__dirname, file)), transformation: { width: w, height: h } })],
});

// --- איסוף ערכי תוכן העניינים ---
const tocEntries = [];
for (const b of blocks) {
  if ((b.t === 'h1' || b.t === 'h2') && b.x !== 'תוכן העניינים') {
    tocEntries.push({ level: b.t === 'h1' ? 1 : 2, text: b.x });
  }
}

const children = [];
let numCounter = 0;

for (const b of blocks) {
  switch (b.t) {
    case 'title':
      children.push(base([run(b.x, { bold: true, size: 32 })], { alignment: AlignmentType.CENTER, after: 400 })); break;
    case 'title2':
      children.push(base([run(b.x, { bold: true, size: 48 })], { alignment: AlignmentType.CENTER, after: 200 })); break;
    case 'title3':
      children.push(base([run(b.x, { bold: true, size: 32 })], { alignment: AlignmentType.CENTER, after: 120 })); break;
    case 'field':
      children.push(base([run(b.k + '  ', { bold: true }), run(b.v)], { alignment: AlignmentType.CENTER, after: 200 })); break;
    case 'gap':
      children.push(base([run('')], { after: 300 })); break;
    case 'pb':
      children.push(new Paragraph({ children: [new PageBreak()] })); break;
    case 'toc':
      for (const e of tocEntries) {
        const pg = tocPages[e.text] !== undefined ? String(tocPages[e.text]) : '—';
        children.push(new Paragraph({
          bidirectional: true, alignment: AlignmentType.RIGHT,
          spacing: { line: 276, lineRule: 'auto', after: 40 },
          indent: e.level === 2 ? { right: convertMillimetersToTwip(8) } : undefined,
          tabStops: [{ type: TabStopType.LEFT, position: convertMillimetersToTwip(e.level === 2 ? 146 : 154), leader: LeaderType.DOT }],
          children: [
            run(e.text, { bold: e.level === 1, size: e.level === 1 ? 28 : 26 }),
            new TextRun({ children: [new Tab()], font: FONT, size: 26 }),
            new TextRun({ text: pg, font: FONT, size: 26 }),
          ],
        }));
      }
      break;
    case 'h1':
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT,
        spacing: { line: LINE, lineRule: 'auto', before: 360, after: 200 },
        children: [run(b.x, { bold: true, size: 34 })],
      })); break;
    case 'h2':
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2, bidirectional: true, alignment: AlignmentType.RIGHT,
        spacing: { line: LINE, lineRule: 'auto', before: 280, after: 140 },
        children: [run(b.x, { bold: true, size: 30 })],
      })); break;
    case 'p':
      children.push(base(autoRuns(b.x), { indent: { firstLine: convertMillimetersToTwip(8) } })); break;
    case 'sub':
      children.push(base([run(b.x, { bold: true })], { alignment: AlignmentType.RIGHT, before: 160, after: 140 })); break;
    case 'kw':
      children.push(base([run(b.x, { bold: true })], { before: 200 })); break;
    case 'note':
      children.push(base([run(b.x, { italics: true, color: '808080', size: 24 })],
        { indent: { right: convertMillimetersToTwip(6), left: convertMillimetersToTwip(6) } })); break;
    case 'num':
      numCounter++;
      children.push(base([run(numCounter + '. ' + b.x)],
        { indent: { right: convertMillimetersToTwip(10), hanging: convertMillimetersToTwip(6) } })); break;
    case 'bul':
      children.push(base(autoRuns(b.x), { numbering: { reference: 'bullets', level: 0 } })); break;
    case 'ref': {
      const segs = Array.isArray(b.x) ? b.x : [b.x];
      const rs = segs.map((s) => typeof s === 'string'
        ? run(s, { ltr: b.dir === 'ltr' })
        : run(s.i, { italics: true, ltr: b.dir === 'ltr' }));
      children.push(base(rs, {
        ltr: b.dir === 'ltr',
        alignment: b.dir === 'ltr' ? AlignmentType.LEFT : AlignmentType.RIGHT,
        indent: b.dir === 'ltr'
          ? { left: convertMillimetersToTwip(12), hanging: convertMillimetersToTwip(12) }
          : { right: convertMillimetersToTwip(12), hanging: convertMillimetersToTwip(12) },
        after: 160,
      }));
      break;
    }
  }
}

// נספחים
for (const n of [160, 161, 162, 163, 164]) {
  children.push(img('p' + n + '_s.png', 555, 774));
  children.push(base([run('עמוד ' + n, { size: 22 })], { alignment: AlignmentType.CENTER, after: 0 }));
  children.push(new Paragraph({ children: [new PageBreak()] }));
}
children.push(base([run("נספח ב': דף זכויות היוצרים של הקובץ אוטוקורקט (כנרת, זמורה, דביר, 2024).", { bold: true })], { alignment: AlignmentType.RIGHT }));
children.push(img('p-copyright_s.png', 555, 734));
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(base([run("נספח ג': \"שוברים את החזיר\", מתוך אתגר קרת, געגועי לקיסינג'ר (זמורה־ביתן, 1994) – עמודים סרוקים.", { bold: true })], { alignment: AlignmentType.RIGHT }));
children.push(base([run('[יש לצרף כאן את סריקת הסיפור מתוך הקובץ שברשותך.]', { italics: true, color: '808080' })], { alignment: AlignmentType.RIGHT }));

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: FONT, size: SZ }, paragraph: { spacing: { line: LINE, lineRule: 'auto' } } },
      heading1: { run: { font: FONT, size: 34, bold: true, color: '000000' } },
      heading2: { run: { font: FONT, size: 30, bold: true, color: '000000' } },
    },
  },
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.RIGHT,
        style: { paragraph: { indent: { right: convertMillimetersToTwip(10), hanging: convertMillimetersToTwip(5) } } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: { margin: {
        top: convertMillimetersToTwip(25), bottom: convertMillimetersToTwip(25),
        left: convertMillimetersToTwip(25), right: convertMillimetersToTwip(25) } },
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER, bidirectional: true,
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 22 })],
      })] }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(__dirname, 'keret_paper.docx'), buf);
  fs.writeFileSync(path.join(__dirname, 'toc-entries.json'), JSON.stringify(tocEntries, null, 1));
  console.log('written. toc entries:', tocEntries.length, 'paragraphs:', children.length);
});

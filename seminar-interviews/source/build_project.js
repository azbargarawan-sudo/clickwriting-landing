const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Footer, PageNumber, PageBreak,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, ImageRun,
  TableOfContents, AlignmentType, HeadingLevel, TabStopType, LevelFormat,
} = require('docx');

const DIR = __dirname;
const FONT = 'David';
const SZ = 24;            // 12pt
const LINE = 480;         // double spacing (2 * 240)
const MARGIN = 1417;      // 2.5 cm
const TEXT_W = 11906 - 2 * MARGIN;   // usable width in DXA

function run(text, o = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: o.size || SZ,
    bold: !!o.bold,
    italics: !!o.italics,
    rightToLeft: true,
  });
}

function P(text, o = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: o.alignment || AlignmentType.JUSTIFIED,
    spacing: {
      line: o.line || LINE,
      lineRule: 'auto',
      after: o.after === undefined ? 0 : o.after,
      before: o.before || 0,
    },
    indent: o.indent,
    keepNext: !!o.keepNext,
    pageBreakBefore: !!o.pageBreakBefore,
    heading: o.heading,
    children: [run(text, o)],
  });
}

// ---------- content parser ----------
// #1 chapter | #2 subsection | p para | q block quote | c credit
// t| a | b  table row (first consecutive t| block row = header)
// b bullet | x centered | f caption | - blank
function renderLines(lines, out) {
  let tableBuf = [];
  let tableWeights = null;
  const flushTable = () => {
    if (!tableBuf.length) return;
    const cols = tableBuf[0].length;
    const w = (tableWeights && tableWeights.length === cols)
      ? tableWeights : new Array(cols).fill(1);
    const sum = w.reduce((a, b) => a + b, 0);
    const widths = w.map(x => Math.floor(TEXT_W * x / sum));
    widths[cols - 1] = TEXT_W - widths.slice(0, -1).reduce((a, b) => a + b, 0);
    tableWeights = null;
    out.push(new Table({
      visuallyRightToLeft: true,
      columnWidths: widths,
      width: { size: TEXT_W, type: WidthType.DXA },
      rows: tableBuf.map((cells, ri) => new TableRow({
        tableHeader: ri === 0,
        children: cells.map((c, ci) => new TableCell({
          width: { size: widths[ci], type: WidthType.DXA },
          shading: ri === 0 ? { type: ShadingType.CLEAR, fill: 'E8E8E8' } : undefined,
          children: [new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { line: 240, lineRule: 'auto', before: 40, after: 40 },
            children: [run(c, { bold: ri === 0, size: 20 })],
          })],
        })),
      })),
    }));
    out.push(P('', { after: 120 }));
    tableBuf = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (line.startsWith('tW|')) {
      tableWeights = line.slice(3).split(',').map(s => parseFloat(s.trim()));
      continue;
    }
    if (!line.startsWith('t|')) flushTable();
    if (!line) continue;
    if (line.startsWith('#1 ')) {
      out.push(P(line.slice(3), {
        alignment: AlignmentType.RIGHT, bold: true, size: 32,
        pageBreakBefore: true, keepNext: true, after: 240, line: 360,
        heading: HeadingLevel.HEADING_1,
      }));
    } else if (line.startsWith('#2 ')) {
      out.push(P(line.slice(3), {
        alignment: AlignmentType.RIGHT, bold: true, size: 26,
        keepNext: true, before: 240, after: 120, line: 360,
        heading: HeadingLevel.HEADING_2,
      }));
    } else if (line.startsWith('p ')) {
      out.push(P(line.slice(2), { after: 120 }));
    } else if (line.startsWith('q ')) {
      out.push(P(line.slice(2), { indent: { right: 720 }, after: 0, line: LINE }));
    } else if (line.startsWith('c ')) {
      out.push(P(line.slice(2), {
        indent: { right: 720 }, alignment: AlignmentType.RIGHT,
        size: 20, italics: true, after: 160, line: 240,
      }));
    } else if (line.startsWith('r ')) {
      // Hebrew reference entry: hanging indent 1.25 cm, right aligned
      out.push(P(line.slice(2), {
        alignment: AlignmentType.RIGHT, indent: { right: 720, hanging: 720 }, after: 120,
      }));
    } else if (line.startsWith('R ')) {
      // English reference entry: left-to-right paragraph, left aligned, hanging indent
      out.push(new Paragraph({
        bidirectional: false,
        alignment: AlignmentType.LEFT,
        spacing: { line: LINE, lineRule: 'auto', after: 120 },
        indent: { left: 720, hanging: 720 },
        children: [new TextRun({ text: line.slice(2), font: FONT, size: SZ })],
      }));
    } else if (line.startsWith('t|')) {
      tableBuf.push(line.slice(2).split('|').map(s => s.trim()));
    } else if (line.startsWith('n ')) {
      // numbered recommendation: "n כותרת|הסבר". The number comes from Word's
      // own numbering, so it sits on the right of an RTL paragraph; a literal
      // "1-" in the text would reverse to "-1".
      const [head, rest] = line.slice(2).split('|');
      out.push(new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: LINE, lineRule: 'auto', after: 100 },
        indent: { right: 560, hanging: 560 },
        numbering: { reference: 'recs', level: 0 },
        children: [run(head, { bold: true }), run(rest ? ' ' + rest : '')],
      }));
    } else if (line.startsWith('h ')) {
      out.push(P(line.slice(2), {
        alignment: AlignmentType.RIGHT, bold: true, keepNext: true,
        before: 160, after: 80, line: 360,
      }));
    } else if (line.startsWith('b ')) {
      out.push(P('•  ' + line.slice(2), { indent: { right: 400, hanging: 260 }, after: 80 }));
    } else if (line.startsWith('x ')) {
      out.push(P(line.slice(2), { alignment: AlignmentType.CENTER, after: 120 }));
    } else if (line.startsWith('i ')) {
      // i file.png|widthPt   (height derived from the PNG header)
      const [fname, wpt] = line.slice(2).split('|').map(s => s.trim());
      const buf = fs.readFileSync(path.join(DIR, fname));
      const pxW = buf.readUInt32BE(16), pxH = buf.readUInt32BE(20);
      const width = parseFloat(wpt || '430');
      out.push(new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.CENTER,
        spacing: { line: 240, lineRule: 'auto', before: 120, after: 80 },
        children: [new ImageRun({
          type: 'png', data: buf,
          transformation: { width, height: Math.round(width * pxH / pxW) },
        })],
      }));
    } else if (line.startsWith('f ')) {
      out.push(P(line.slice(2), {
        alignment: AlignmentType.CENTER, size: 20, bold: true, after: 160, line: 240,
      }));
    } else if (line === '-') {
      out.push(P('', { after: 0 }));
    } else {
      out.push(P(line, { after: 120 }));
    }
  }
  flushTable();
}

function loadChapter(file) {
  return fs.readFileSync(path.join(DIR, 'chapters', file), 'utf8')
    .split(/\r?\n/)
    .map(l => l.replace(/^### /, '#2 '));
}

// ---------- interviews appendix ----------
function parseInterview(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const iv = { title: '', meta: '', intro: '', qa: [] };
  let q = null;
  for (const l0 of raw.split(/\r?\n/)) {
    const l = l0.trim();
    if (!l) continue;
    if (l.startsWith('@@INTERVIEW@@')) iv.title = l.replace('@@INTERVIEW@@', '').trim();
    else if (l.startsWith('@@META@@')) iv.meta = l.replace('@@META@@', '').trim();
    else if (l.startsWith('@@INTRO@@')) iv.intro = l.replace('@@INTRO@@', '').trim();
    else if (l.startsWith('@@Q@@')) q = l.replace('@@Q@@', '').trim();
    else if (l.startsWith('@@A@@')) { iv.qa.push({ q: q || '', a: l.replace('@@A@@', '').trim() }); q = null; }
  }
  return iv;
}

const ivFiles = fs.readdirSync(path.join(DIR, 'interviews'))
  .filter(f => /^\d+\.txt$/.test(f)).sort();
const interviews = ivFiles.map(f => parseInterview(path.join(DIR, 'interviews', f)));

// ---------- build ----------
const children = [];

// ===== cover =====
const blank = (n, after) => { for (let i = 0; i < n; i++) children.push(P('', { after: after || 0, line: 240 })); };
const LOGO = path.join(DIR, 'peres_logo.jpg');
children.push(new Paragraph({
  bidirectional: true,
  alignment: AlignmentType.CENTER,
  spacing: { line: 240, lineRule: 'auto', before: 240, after: 200 },
  children: [new ImageRun({ type: 'jpg', data: fs.readFileSync(LOGO),
                            transformation: { width: 95, height: 95 } })],
}));
children.push(P('המרכז האקדמי פרס', { alignment: AlignmentType.CENTER, bold: true, size: 28, line: 240, after: 60 }));
children.push(P('החוג למנהל מערכות בריאות', { alignment: AlignmentType.CENTER, bold: true, size: 28, line: 240, after: 60 }));
children.push(P('תואר ראשון במנהל מערכות בריאות', { alignment: AlignmentType.CENTER, size: 24, line: 240 }));
blank(3, 0);
children.push(P('פרויקט גמר', { alignment: AlignmentType.CENTER, bold: true, size: 30, line: 240, after: 200 }));
children.push(P('היענות לבדיקות ממוגרפיה בחברה הערבית בישראל:', { alignment: AlignmentType.CENTER, bold: true, size: 34, line: 300, after: 60 }));
children.push(P('חסמים, מאיצים ודרכים להגברת ההיענות', { alignment: AlignmentType.CENTER, bold: true, size: 34, line: 300 }));
blank(2, 0);
children.push(P('מחקר איכותני מבוסס ראיונות עומק', { alignment: AlignmentType.CENTER, size: 24, line: 240 }));
blank(3, 0);
children.push(P('מגישות:', { alignment: AlignmentType.CENTER, bold: true, line: 240, after: 80 }));
children.push(P('מראם זיד        ת.ז. 211794235', { alignment: AlignmentType.CENTER, line: 240, after: 40 }));
children.push(P('טגאיה סמאנך        ת.ז. 337622344', { alignment: AlignmentType.CENTER, line: 240, after: 40 }));
children.push(P('עאליה אבו עראר        ת.ז. 2114908139', { alignment: AlignmentType.CENTER, line: 240, after: 40 }));
children.push(P('לילה נגילי        ת.ז. 214175473', { alignment: AlignmentType.CENTER, line: 240, after: 0 }));
blank(2, 0);
children.push(P('בהנחיית: ד"ר אסנת בשקין', { alignment: AlignmentType.CENTER, line: 240 }));
blank(2, 0);
children.push(P('תאריך הגשה: ______________          תשפ"ו', { alignment: AlignmentType.CENTER, line: 240 }));

// ===== TOC =====
children.push(P('תוכן עניינים', {
  alignment: AlignmentType.RIGHT, bold: true, size: 32,
  pageBreakBefore: true, keepNext: true, after: 240, line: 360,
}));
children.push(new TableOfContents('תוכן עניינים', { hyperlink: true, headingStyleRange: '1-2' }));
children.push(P('', { after: 0 }));

// ===== chapters =====
for (const f of ['abstract.md', 'intro.md', 'litreview.md', 'method.md', 'findings.md', 'discussion.md', 'conclusions.md', 'references.md']) {
  const p = path.join(DIR, 'chapters', f);
  if (!fs.existsSync(p)) { console.error('MISSING chapter file:', f); continue; }
  renderLines(loadChapter(f), children);
}

// ===== appendix A: interview guide =====
children.push(P("נספח א': מדריך הראיון", {
  alignment: AlignmentType.RIGHT, bold: true, size: 32,
  pageBreakBefore: true, keepNext: true, after: 240, line: 360,
  heading: HeadingLevel.HEADING_1,
}));
children.push(P('שש עשרה השאלות הועברו בנוסח זהה ובסדר זהה בכל שנים עשר הראיונות. שאלה 1 היא שאלת פתיחה שנועדה ליצור היכרות לפני המעבר לנושא המחקר. לצד השאלות הקבועות הוסיפו המראיינות שאלות הבהרה בהתאם לתשובות.', { after: 200 }));
(interviews[0] ? interviews[0].qa.map(x => x.q) : []).forEach((q, i) => {
  children.push(P(`${i + 1}. ${q}`, { indent: { right: 400, hanging: 400 }, after: 100 }));
});

// ===== appendix B: transcripts =====
children.push(P("נספח ב': תמלילי הראיונות", {
  alignment: AlignmentType.RIGHT, bold: true, size: 32,
  pageBreakBefore: true, keepNext: true, after: 240, line: 360,
  heading: HeadingLevel.HEADING_1,
}));
children.push(P('להלן תמלילי שנים עשר הראיונות במלואם. שמות המרואיינות בדויים וכל פרט מזהה שונה או טושטש. דברי המרואיינות מובאים ללא הפניה ביבליוגרפית וללא רישום ברשימת המקורות, שכן מדובר בחומר גלם מקורי שנאסף לצורך עבודה זו.', { after: 200 }));

interviews.forEach((iv) => {
  children.push(P(iv.title, {
    alignment: AlignmentType.RIGHT, bold: true, size: 26,
    pageBreakBefore: true, keepNext: true, before: 120, after: 100, line: 360,
  }));
  children.push(P(iv.meta, { alignment: AlignmentType.RIGHT, size: 20, italics: true, keepNext: true, after: 100, line: 240 }));
  children.push(P(iv.intro, { italics: true, after: 160 }));
  iv.qa.forEach((qa, i) => {
    children.push(P(`ש${i + 1}: ${qa.q}`, { bold: true, before: 120, after: 60, keepNext: true }));
    children.push(P(`ת: ${qa.a}`, { after: 60 }));
  });
});

// ---------- document ----------
const headingStyle = (id, name, size) => ({
  id, name, basedOn: 'Normal', next: 'Normal', quickFormat: true,
  run: { font: FONT, size, bold: true, rightToLeft: true, color: '000000' },
  paragraph: { alignment: AlignmentType.RIGHT, spacing: { line: 360, lineRule: 'auto', before: 240, after: 120 }, bidirectional: true },
});

const doc = new Document({
  features: { updateFields: true },
  numbering: {
    config: [{
      reference: 'recs',
      levels: [{
        level: 0,
        format: LevelFormat.DECIMAL,
        text: '%1-',
        alignment: AlignmentType.RIGHT,
        style: { paragraph: { indent: { right: 560, hanging: 560 } } },
      }],
    }],
  },
  styles: {
    default: {
      document: {
        run: { font: FONT, size: SZ, rightToLeft: true },
        paragraph: { spacing: { line: LINE, lineRule: 'auto' }, alignment: AlignmentType.JUSTIFIED, bidirectional: true },
      },
    },
    paragraphStyles: [
      headingStyle('Heading1', 'heading 1', 32),
      headingStyle('Heading2', 'heading 2', 26),
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.CENTER,
          spacing: { line: 240, lineRule: 'auto' },
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, rightToLeft: true })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = process.argv[2] || path.join(DIR, 'project.docx');
  fs.writeFileSync(out, buf);
  console.log('wrote', out, buf.length, 'bytes;', children.length, 'blocks;', interviews.length, 'interviews');
});

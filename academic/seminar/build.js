// בונה את הסמינריון כקובץ Word עם הערות שוליים לפי כללי האזכור האחיד.
// שימוש: NODE_PATH=<תיקייה שבה מותקן docx> node build.js <קובץ פלט>
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, FootnoteReferenceRun, AlignmentType,
  HeadingLevel, PageNumber, ShadingType, Footer, TableOfContents, LevelFormat, PageBreak,
} = require('docx');
const SRC = require('./sources.js');

const FONT = { ascii: 'Times New Roman', hAnsi: 'Times New Roman', cs: 'David', eastAsia: 'David' };
const BODY = 24;   // 12pt
const NOTE = 20;   // 10pt

// ---------- עיבוד טקסט לריצות ----------
const PLACEHOLDER = /\[(?:עמוד|כרך|עורכים|שנה|פרטי[^\]]*)\]/;
const LATIN = /[A-Za-z][A-Za-z0-9 .,:;&'’()\-\/]*[A-Za-z0-9.)]|[A-Za-z]/g;

// מפצל מחרוזת עם **מודגש**, _נטוי_ ו-[מציין מקום] לריצות.
function runs(text, size, extra = {}) {
  const out = [];
  const re = /\*\*(.+?)\*\*|_(.+?)_|(\[(?:עמוד|כרך|עורכים|שנה|פרטי[^\]]*)\])/g;
  let last = 0, m;
  const push = (t, fmt) => { if (t) out.push(...scriptSplit(t, size, { ...extra, ...fmt })); };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index), {});
    if (m[1] !== undefined) push(m[1], { bold: true });
    else if (m[2] !== undefined) push(m[2], { italics: true });
    else push(m[3], { highlight: 'yellow' });
    last = re.lastIndex;
  }
  push(text.slice(last), {});
  return out;
}

// מפריד בין קטעים לועזיים לקטעים עבריים, כדי שהכיווניות תוצג נכון.
function scriptSplit(t, size, fmt) {
  const res = [];
  const hasHeb = /[֐-׿]/.test(t);
  if (!hasHeb) return [mk(t, size, fmt, false)];
  let last = 0, m;
  LATIN.lastIndex = 0;
  while ((m = LATIN.exec(t))) {
    if (m.index > last) res.push(mk(t.slice(last, m.index), size, fmt, true));
    res.push(mk(m[0], size, fmt, false));
    last = LATIN.lastIndex;
  }
  if (last < t.length) res.push(mk(t.slice(last), size, fmt, true));
  return res;
}

function mk(text, size, fmt, rtl) {
  return new TextRun({
    text, font: FONT, size, sizeComplexScript: size, rightToLeft: rtl,
    bold: fmt.bold, boldComplexScript: fmt.bold,
    italics: fmt.italics, italicsComplexScript: fmt.italics,
    shading: fmt.highlight ? { type: ShadingType.CLEAR, fill: 'FFF200', color: 'auto' } : undefined,
  });
}

// ---------- ציטוטים ----------
const used = new Set();
const firstNote = {};           // key -> מספר ההערה שבה אוזכר לראשונה
const isPage = p => /^[\d\-–,\s]+$/.test(p) || /^\[עמוד\]$/.test(p);
const pinR = p => (isPage(p) ? `בעמ' ${p}` : p);

function full(key, pin) {
  const s = SRC[key];
  if (!s) throw new Error('מקור לא ידוע: ' + key);
  switch (s.type) {
    case 'law':
      if (!pin) return s.text;
      if (s.foreign) return s.text.replace(' (UK)', `, ${pin} (UK)`);
      return `${pin} ל${s.text}`;
    case 'case':
      if (s.rep) return `${s.proc} **${s.parties}**, ${s.rep}${pin ? ', ' + pin : ''} (${s.year})`;
      return `${s.proc} **${s.parties}**${pin ? ', ' + pin : ''} (נבו ${s.date})`;
    case 'fcase':
    case 'other': {
      if (!pin) return s.text;
      const i = s.text.lastIndexOf(' (');
      return i > 0 ? `${s.text.slice(0, i)}, ${pin}${s.text.slice(i)}` : `${s.text}, ${pin}`;
    }
    case 'book':
      pin = pin || (s.needPage ? '[עמוד]' : '');
      return `${s.author} **${s.title}**${s.vol ? ' ' + s.vol : ''}${pin ? ' ' + pin : ''} (${s.year})`;
    case 'article':
      return `${s.author} "${s.title}" **${s.journal}** ${s.vol} ${s.start}${pin ? ', ' + pin : ''} (${s.year})`;
    case 'chapter':
      return `${s.author} "${s.title}" **${s.book}** ${s.start}${pin ? ', ' + pin : ''} (${s.editors}, ${s.year})`;
  }
}

function short(key, pin, n) {
  const s = SRC[key];
  if (s.type === 'law') return full(key, pin);
  pin = pin || (s.needPage ? '[עמוד]' : '');
  let name;
  if (s.type === 'case') name = `${s.shortPrefix || 'עניין'} **${s.short}**`;
  else name = s.short;
  return `${name}, לעיל ה"ש ${firstNote[key]}${pin ? ', ' + pinR(pin) : ''}`;
}

// ---------- הערות שוליים ----------
const footnotes = {};
let fnCount = 0;
let prevSingle = null;          // מקור יחיד של ההערה הקודמת, לצורך "שם"

function makeFootnote(raw) {
  const n = ++fnCount;
  const tokens = [...raw.matchAll(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g)];
  const text = raw.replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, key, pin, offset) => {
    used.add(key);
    const s = SRC[key];
    if (s.type === 'law') return full(key, pin);
    // "שם" רק כשהאזכור פותח את ההערה ומפנה למקור היחיד של ההערה הקודמת
    if (prevSingle === key && raw.slice(0, offset).trim() === '') {
      const p = pin || (s.needPage ? '[עמוד]' : '');
      return 'שם' + (p ? ', ' + pinR(p) : '');
    }
    if (firstNote[key]) return short(key, pin, n);
    firstNote[key] = n;
    return full(key, pin);
  });
  const citeKeys = tokens.map(t => t[1]).filter(k => SRC[k].type !== 'law');
  if (tokens.length === 0 && /^שם/.test(raw.trim())) {
    // הערת "שם" ידנית: המקור הקודם נשאר
  } else if (citeKeys.length === 1 && tokens.length === 1 && !/כמובא/.test(raw)) {
    prevSingle = citeKeys[0];
  } else {
    prevSingle = null;
  }
  footnotes[n] = {
    children: [new Paragraph({
      bidirectional: true, alignment: AlignmentType.BOTH,
      spacing: { after: 40, line: 240 },
      children: runs(' ' + text.trim(), NOTE),
    })],
  };
  return n;
}

// פסקה עם הערות שוליים משובצות {{...}}
function para(text, opts = {}) {
  const children = [];
  const re = /\{\{([\s\S]+?)\}\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    children.push(...runs(text.slice(last, m.index), BODY));
    children.push(new FootnoteReferenceRun(makeFootnote(m[1])));
    last = re.lastIndex;
  }
  children.push(...runs(text.slice(last), BODY));
  return new Paragraph({
    bidirectional: true, alignment: AlignmentType.BOTH,
    spacing: { line: 360, after: 120 },
    indent: opts.firstLine === false ? undefined : { firstLine: 0 },
    children, ...opts.p,
  });
}

function heading(text, level, newPage) {
  const lv = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][level - 1];
  const size = [32, 28, 24][level - 1];
  return new Paragraph({
    heading: lv, bidirectional: true, pageBreakBefore: !!newPage,
    alignment: level === 1 ? AlignmentType.CENTER : AlignmentType.RIGHT,
    spacing: { before: 240, after: 160 },
    children: [mk(text, size, { bold: true }, true)],
  });
}

// ---------- קריאת הטקסט ----------
const body = [];
for (const f of ['text-1.txt', 'text-2.txt', 'text-3.txt']) {
  const blocks = fs.readFileSync(path.join(__dirname, f), 'utf8').split(/\n\s*\n/);
  for (let b of blocks) {
    b = b.trim();
    if (!b) continue;
    if (b.startsWith('### ')) body.push(heading(b.slice(4), 3));
    else if (b.startsWith('## ')) body.push(heading(b.slice(3), 2));
    else if (b.startsWith('# ')) body.push(heading(b.slice(2), 1, true));
    else if (b.startsWith('- ')) {
      for (const line of b.split('\n')) {
        body.push(para(line.replace(/^- /, ''), { p: { numbering: { reference: 'recs', level: 0 } } }));
      }
    } else body.push(para(b.replace(/\n/g, ' ')));
  }
}

// ---------- רשימת מקורות ----------
function bibPara(text) {
  return new Paragraph({
    bidirectional: true, alignment: AlignmentType.BOTH,
    spacing: { line: 276, after: 100 },
    indent: { hanging: 360, left: 360 },
    children: runs(text, BODY),
  });
}
const heSort = (a, b) => a.localeCompare(b, 'he');
const usedKeys = [...used];
const group = (pred) => usedKeys.filter(k => pred(SRC[k]));
const bib = [];
bib.push(heading('רשימת מקורות', 1, true));

const sections = [
  ['חקיקה ישראלית', group(s => s.type === 'law' && !s.foreign), k => SRC[k].text],
  ['חקיקה זרה', group(s => s.type === 'law' && s.foreign), k => SRC[k].text],
  ['פסיקה ישראלית', group(s => s.type === 'case'), k => full(k)],
  ['פסיקה זרה', group(s => s.type === 'fcase'), k => SRC[k].text],
  ['ספרים', group(s => s.type === 'book'), k => full(k)],
  ['מאמרים ופרקים בספרים', group(s => s.type === 'article' || s.type === 'chapter'), k => full(k)],
];
for (const [title, keys, fmt] of sections) {
  if (!keys.length) continue;
  bib.push(heading(title, 2));
  const items = keys.map(fmt);
  const sortKey = (k) => SRC[k].type === 'case' ? SRC[k].parties : (SRC[k].author || SRC[k].text);
  keys.sort((a, b) => heSort(sortKey(a), sortKey(b)));
  for (const k of keys) bib.push(bibPara(fmt(k)));
}
bib.push(heading('מקורות שאוזכרו כמובא במקור אחר', 2));
for (const t of [
  'אהרן ברק "המשטרה וזכויות האזרח" (הרצאה ביום עיון בנושא: זכויות האזרח ואכיפת החוק במסגרת שבוע המשטרה וזכויות האזרח, 1986), כמובא אצל דרומי.',
  'באדי חסייסי ויעל ליטמנוביץ "משילות ויעילות בשיטור מיעוטים בחברות שסועות: נקודת המבט של מפקדי תחנות משטרה על החברה הערבית בישראל" **משפט ומשטרה** 265 (2021), כמובא אצל קדוש נוסבאום.',
  'Badi Hasisi & Ronald Weitzer, _Police Relations with Arabs and Jews in Israel_, 47 BRIT. J. CRIMINOLOGY 728 (2007).',
  'Stephen Halpern, _Police Employee Organizations and Accountability Procedures in Three Cities: Some Reflections on Police Policy-Making_, 8 LAW & SOC\'Y REV. 561 (1974).',
  'Kent Roach, _Models of Civilian Police Review: The Objectives and Mechanisms of Legal and Political Regulation of the Police_, 61 CRIM. L.Q. 29 (2014).',
  'Jason Sunshine & Tom R. Tyler, _The Role of Procedural Justice and Legitimacy in Shaping Public Support for Policing_, 37 LAW & SOC\'Y REV. 513 (2003).',
  'Tom R. Tyler & Jeffrey Fagan, _Legitimacy and Cooperation: Why Do People Help the Police Fight Crime in Their Communities?_, 6 OHIO ST. J. CRIM. L. 231 (2008).',
  'Moule et al. [פרטי המאמר כפי שהם מופיעים בהערת השוליים של הפורום] (2019).',
]) bib.push(bibPara(t));

// ---------- עמוד שער ותוכן עניינים ----------
const center = (t, size, bold, after = 200) => new Paragraph({
  bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after },
  children: runs(t, size, bold ? { bold: true } : {}),
});
const cover = [
  center('[שם המוסד והפקולטה]', 28, true, 120),
  center('סמינריון מונחה במשפט פלילי', 26, false, 120),
  center('המנחה: ד"ר עו"ד גלית אהרון', 26, false, 1600),
  center('רפורמת אמו"ן במשטרת ישראל: בין אפקטיביות עקרונית ליישום בפועל', 36, true, 200),
  center('אכיפה, הפחתת עבריינות ולגיטימציה בקרב צעירים ערבים בני 18 עד 24', 30, false, 1600),
  center('מגיש/ה: [שם מלא]    ת"ז: [מספר]', 26, false, 120),
  center('תשרי התשפ"ז, ספטמבר 2026', 26, false, 120),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after: 240 },
    children: [mk('תוכן עניינים', 32, { bold: true }, true)] }),
  new TableOfContents('תוכן עניינים', { hyperlink: true, headingStyleRange: '1-2' }),
];

const doc = new Document({
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: BODY, sizeComplexScript: BODY, rightToLeft: true } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 32, sizeComplexScript: 32, bold: true, boldComplexScript: true },
        paragraph: { outlineLevel: 0, bidirectional: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 28, sizeComplexScript: 28, bold: true, boldComplexScript: true },
        paragraph: { outlineLevel: 1, bidirectional: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 24, sizeComplexScript: 24, bold: true, boldComplexScript: true },
        paragraph: { outlineLevel: 2, bidirectional: true } },
    ],
  },
  numbering: { config: [{ reference: 'recs', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
    alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  footnotes,
  sections: [{
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 })] })] }) },
    children: [...cover, ...body, ...bib],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = process.argv[2] || 'seminar.docx';
  fs.writeFileSync(out, buf);
  console.log('נכתב', out, '| הערות שוליים:', fnCount, '| מקורות:', used.size);
});

// בונה את הסמינריון כקובץ Word עם הערות שוליים לפי כללי האזכור האחיד.
// שימוש: NODE_PATH=<תיקייה שבה מותקן docx> node build.js <קובץ פלט>
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, FootnoteReferenceRun, AlignmentType,
  HeadingLevel, PageNumber, ShadingType, Footer, TableOfContents, LevelFormat, PageBreak,
} = require('docx');
const SRC = require('./sources.js');

const FONT = { ascii: 'David', hAnsi: 'David', cs: 'David', eastAsia: 'David' };
const BODY = 24;   // 12pt
const NOTE = 20;   // 10pt

// ---------- עיבוד טקסט לריצות ----------
const PLACEHOLDER = /\[(?:עמוד|כרך|עורכים|שנה|תאריך|פרטי[^\]]*)\]/;
// קטע לועזי: אפשר שייפתח במספרים (למשל 34 U.S.C.), אך חייב לכלול אות לטינית.
const LATIN = /(?:[0-9\[][0-9 .,:;§\[\]\-]*)?[A-Za-z][A-Za-z0-9 .,:;&'’()\-\/\[\]§]*[A-Za-z0-9.)\]]|[A-Za-z]/g;

// מפצל מחרוזת עם **מודגש**, _נטוי_ ו-[מציין מקום] לריצות.
function runs(text, size, extra = {}) {
  const out = [];
  const re = /\*\*(.+?)\*\*|_(.+?)_|(\[(?:עמוד|כרך|עורכים|שנה|תאריך|פרטי[^\]]*)\])/g;
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
// סימן LRM בסוף קטע לועזי מצמיד אליו את סימני הפיסוק שבסופו.
const LRM = '\u200E';
function scriptSplit(t, size, fmt) {
  const res = [];
  const hasHeb = /[֐-׿]/.test(t);
  if (!hasHeb) return [mk(/[A-Za-z]/.test(t) ? t + LRM : t, size, fmt, !/[A-Za-z0-9]/.test(t))];
  let last = 0, m;
  LATIN.lastIndex = 0;
  while ((m = LATIN.exec(t))) {
    let seg = m[0];
    // סוגר שאין לו פותח בתוך הקטע הלועזי שייך לטקסט העברי שסביבו
    if (seg.endsWith(')') && (seg.match(/\(/g) || []).length < (seg.match(/\)/g) || []).length) {
      seg = seg.slice(0, -1);
      LATIN.lastIndex -= 1;
    }
    if (m.index > last) res.push(mk(t.slice(last, m.index), size, fmt, true));
    res.push(mk(seg + LRM, size, fmt, false));
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
const isPage = p => /^\d/.test(p) || /^\[עמוד\]$/.test(p);
const pinR = p => (isPage(p) ? `בעמ' ${p}` : /^פס'/.test(p) ? 'ב' + p : p);
// הפניה מדויקת במקור זר, כפי שתופיע בהפניה מקוצרת בעברית
function foreignPin(s, p) {
  if (s.sp) return s.sp + p;
  let m;
  if ((m = p.match(/^§§?\s*(.+)$/))) return `בס' ${m[1]}`;
  if ((m = p.match(/^¶(.+)$/))) return `בפס' ${m[1]}`;
  if ((m = p.match(/^paras?\.\s*(.+)$/))) return `בפס' ${m[1]}`;
  if ((m = p.match(/^recs?\.\s*(.+)$/))) return `בהמלצה ${m[1]}`;
  if (/^[\dxivlc][\dxivlc\-–,\s]*$/.test(p)) return `בעמ' ${p}`;
  return p;
}
function pinShort(key, p) {
  const s = SRC[key];
  return (s.type === 'other' || s.type === 'fcase') ? foreignPin(s, p) : pinR(p);
}

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
      if (pin && pin.startsWith('¶')) pin = `[${pin.slice(1)}]`;   // פסקה בפסק דין אנגלי
      let sep = s.sep || ', ';
      if (pin && sep === ', para. ' && /[-,]/.test(pin)) sep = ', paras. ';
      if (s.text.includes('@')) return s.text.replace('@', pin ? sep + pin : '');
      if (!pin) return s.text;
      const i = s.text.lastIndexOf(' (');
      return i > 0 ? `${s.text.slice(0, i)}, ${pin}${s.text.slice(i)}` : `${s.text}, ${pin}`;
    }
    case 'book':
      pin = pin || (s.needPage ? '[עמוד]' : '');
      return `${s.author} **${s.title}**${s.vol ? ' ' + s.vol : ''}${pin ? ' ' + pin : ''} (${s.year})`;
    case 'article':
      return `${s.author} "${s.title}" **${s.journal}** ${s.vol ? s.vol + ' ' : ''}${s.start}${pin ? ', ' + pin : ''} (${s.year})`;
    case 'report':
      return `${s.author} **${s.title}**${pin ? ' ' + pin : ''} (${s.publisher ? s.publisher + ', ' : ''}${s.year})`;
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
  return `${name}, לעיל ה"ש ${firstNote[key]}${pin ? ', ' + pinShort(key, pin) : ''}`;
}

// ---------- הערות שוליים ----------
const footnotes = {};
let fnCount = 0;
let prevSingle = null;          // מקור יחיד של ההערה הקודמת, לצורך "שם"
let prevPin = null;             // ההפניה המדויקת בהערה הקודמת

function makeFootnote(raw) {
  const n = ++fnCount;
  const tokens = [...raw.matchAll(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g)];
  const text = raw.replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, key, pin, offset) => {
    used.add(key);
    const s = SRC[key];
    if (s.type === 'law' || (s.cat === 'flaw' && !s.text.includes('@'))) return full(key, pin);
    // "שם" רק כשהאזכור פותח את ההערה ומפנה למקור היחיד של ההערה הקודמת
    if (prevSingle === key && raw.slice(0, offset).trim() === '') {
      const p = pin || (s.needPage ? '[עמוד]' : '');
      if (p && p === prevPin) return 'שם';
      return 'שם' + (p ? ', ' + pinShort(key, p) : '');
    }
    if (firstNote[key]) return short(key, pin, n);
    firstNote[key] = n;
    return full(key, pin);
  });
  const citeKeys = tokens.map(t => t[1]).filter(k => SRC[k].type !== 'law');
  const newPin = tokens.length === 1 ? (tokens[0][2] || null) : null;
  if (tokens.length === 0 && /^שם/.test(raw.trim())) {
    // הערת "שם" ידנית: המקור הקודם נשאר
  } else if (citeKeys.length === 1 && tokens.length === 1 && !/כמובא/.test(raw)) {
    prevSingle = citeKeys[0];
    prevPin = newPin;
  } else {
    prevSingle = null;
    prevPin = null;
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
for (const f of ['text-1.txt', 'text-2.txt', 'text-3.txt', 'text-4.txt']) {
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
  const en = !/[֐-׿]/.test(text);
  return new Paragraph({
    bidirectional: !en, alignment: en ? AlignmentType.LEFT : AlignmentType.BOTH,
    spacing: { line: 276, after: 100 },
    indent: { hanging: 360, left: 360 },
    children: runs(text, BODY),
  });
}
const heSort = (a, b) => a.localeCompare(b, 'he');
const enKey = t => t.replace(/[_*]/g, '').replace(/^The /, '');
const usedKeys = [...used];
const group = (pred) => usedKeys.filter(k => pred(SRC[k]));
const bib = [];
bib.push(heading('ביבליוגרפיה', 1, true));

const sections = [
  ['חקיקה ישראלית', group(s => s.type === 'law' && !s.foreign), k => SRC[k].text, false],
  ['פסיקה ישראלית', group(s => s.type === 'case'), k => full(k), false],
  ['ספרים', group(s => s.type === 'book'), k => full(k), false],
  ['מאמרים ופרקים בספרים', group(s => s.type === 'article' || s.type === 'chapter'), k => full(k), false],
  ['דוחות ומסמכים רשמיים', group(s => s.type === 'report'), k => full(k), false],
  ['חקיקה ומסמכים נורמטיביים זרים', group(s => (s.type === 'law' && s.foreign) || (s.type === 'other' && s.cat === 'flaw')), k => full(k), true],
  ['פסיקה זרה', group(s => s.type === 'fcase'), k => full(k), true],
  ['ספרות ודוחות בשפה האנגלית', group(s => s.type === 'other' && s.cat !== 'flaw'), k => full(k), true],
];
for (const [title, keys, fmt, en] of sections) {
  if (!keys.length) continue;
  bib.push(heading(title, 2));
  const sortKey = (k) => SRC[k].type === 'case' ? SRC[k].parties : (SRC[k].author || SRC[k].text);
  if (en) keys.sort((a, b) => enKey(fmt(a)).localeCompare(enKey(fmt(b)), 'en'));
  else keys.sort((a, b) => heSort(sortKey(a), sortKey(b)));
  for (const k of keys) bib.push(bibPara(fmt(k) + '.'));
}

// ---------- עמוד שער ותוכן עניינים ----------
const center = (t, size, bold, after = 200) => new Paragraph({
  bidirectional: true, alignment: AlignmentType.CENTER, spacing: { after },
  children: runs(t, size, bold ? { bold: true } : {}),
});
const cover = [
  center('הפקולטה למשפטים', 30, true, 120),
  center('תואר שני במשפטים (LL.M.)', 26, false, 120),
  center('סמינר מתקדם במשפט הפלילי', 26, false, 1800),
  center('רפורמת אמו"ן במשטרת ישראל:', 38, true, 60),
  center('בין אפקטיביות עקרונית ליישום בפועל', 38, true, 240),
  center('הפחתת עבריינות, אכיפה ולגיטימציה בקרב צעירים ערבים בני 18 עד 24', 28, false, 2000),
  center('מוגש ל: פרופ\' יואב ספיר', 26, false, 120),
  center('מגיש: יזיד גריפאת', 26, false, 120),
  center('תאריך הגשה: [תאריך]', 26, false, 120),
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
    children: [...cover, ...body],   // לפי הנחיות הקורס אין צורך ברשימה ביבליוגרפית
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = process.argv[2] || 'seminar.docx';
  fs.writeFileSync(out, buf);
  console.log('נכתב', out, '| הערות שוליים:', fnCount, '| מקורות:', used.size);
});

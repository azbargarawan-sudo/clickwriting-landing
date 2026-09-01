// עזרי בנייה למסמך סמינריון בעברית (RTL) עם הערות שוליים לפי כללי האזכור האחיד
const docx = require('docx');
const {
  Paragraph, TextRun, HeadingLevel, AlignmentType, FootnoteReferenceRun,
} = docx;

const HE_FONT = 'David';
const EN_FONT = 'Times New Roman';
const BODY_SIZE = 24;   // 12pt
const NOTE_SIZE = 20;   // 10pt

// ---- runs ----
function he(text, opts = {}) {
  return new TextRun({ text, rightToLeft: true, font: HE_FONT, size: BODY_SIZE, ...opts });
}
function en(text, opts = {}) {
  return new TextRun({ text, font: EN_FONT, size: BODY_SIZE, ...opts });
}
function heN(text, opts = {}) { return he(text, { size: NOTE_SIZE, ...opts }); }
function enN(text, opts = {}) { return en(text, { size: NOTE_SIZE, ...opts }); }

// ---- footnotes registry (two-phase: register raw parts, finalize after all chapters) ----
const footnoteParts = {};   // id -> array of parts (string | TextRun | {__ref})
const footnoteKeys = {};    // key -> id
let fnCounter = 0;

/** הפניה פנימית להערת שוליים קודמת: ref('key') → "לעיל ה"ש N" (מוזרק בשלב הסיום) */
function ref(key, opts = {}) { return { __ref: key, opts }; }

/** רישום הערת שוליים; מחזיר FootnoteReferenceRun. key אופציונלי להפניות פנימיות. */
function fnk(key, ...parts) {
  fnCounter += 1;
  footnoteParts[fnCounter] = parts;
  if (key) footnoteKeys[key] = fnCounter;
  return new FootnoteReferenceRun(fnCounter);
}
function fn(...parts) { return fnk(null, ...parts); }

/** בונה את מפת הערות השוליים ל-Document לאחר שכל הפרקים נטענו */
function finalizeFootnotes() {
  const out = {};
  for (const [id, parts] of Object.entries(footnoteParts)) {
    const children = parts.map((p) => {
      if (typeof p === 'string') return heN(p);
      if (p && p.__ref) {
        const target = footnoteKeys[p.__ref];
        if (!target) throw new Error(`Unresolved footnote ref: ${p.__ref}`);
        return heN(`לעיל ה"ש ${target}`, p.opts);
      }
      return p;
    });
    out[id] = { children: [new Paragraph({ bidirectional: true, spacing: { after: 60 }, children })] };
  }
  return out;
}

// ---- paragraphs ----
function p(...items) {
  const children = items.map((it) => (typeof it === 'string' ? he(it) : it));
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.BOTH,
    spacing: { line: 360, after: 160 },
    children,
  });
}
// פסקה עם הזחת שורה ראשונה (גוף העבודה)
function pi(...items) {
  const children = items.map((it) => (typeof it === 'string' ? he(it) : it));
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.BOTH,
    indent: { firstLine: 420 },
    spacing: { line: 360, after: 160 },
    children,
  });
}
// פסקה פותחת (אחרי כותרת): שורה ראשונה מיושרת, בלא הזחה
function pn(...items) {
  const children = items.map((it) => (typeof it === 'string' ? he(it) : it));
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.BOTH,
    spacing: { line: 360, after: 160 },
    children,
  });
}
// ציטוט מובלע
function quote(...items) {
  const children = items.map((it) => (typeof it === 'string' ? he(it, { size: 22 }) : it));
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.BOTH,
    indent: { start: 720, end: 720 },
    spacing: { line: 300, before: 120, after: 160 },
    children,
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    bidirectional: true,
    spacing: { before: 360, after: 240 },
    children: [he(text, { bold: true, size: 32, color: '000000' })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: true,
    spacing: { before: 280, after: 180 },
    children: [he(text, { bold: true, size: 28, color: '000000' })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    bidirectional: true,
    spacing: { before: 220, after: 140 },
    children: [he(text, { bold: true, size: 26, color: '000000' })],
  });
}

// פריט ביבליוגרפיה: שורה עם הזחה תלויה
function bib(...items) {
  const children = items.map((it) => (typeof it === 'string' ? he(it) : it));
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.BOTH,
    indent: { start: 420, hanging: 420 },
    spacing: { line: 300, after: 120 },
    children,
  });
}
// פריט ביבליוגרפיה לועזי (LTR)
function bibEn(...items) {
  const children = items.map((it) => (typeof it === 'string' ? en(it) : it));
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    indent: { start: 420, hanging: 420 },
    spacing: { line: 300, after: 120 },
    children,
  });
}

module.exports = {
  docx, he, en, heN, enN, fn, fnk, ref, finalizeFootnotes,
  p, pi, pn, quote, h1, h2, h3, bib, bibEn, HE_FONT, EN_FONT,
};

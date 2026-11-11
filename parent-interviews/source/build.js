const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Footer, PageNumber,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType,
} = require('docx');

const DIR = __dirname;
const FONT = 'David';
const SZ = 24;        // 12pt
const LINE = 360;     // 1.5 line spacing
const MARGIN = 1417;  // 2.5 cm
const TEXT_W = 11906 - 2 * MARGIN;

const run = (text, o = {}) => new TextRun({
  text, font: FONT, size: o.size || SZ,
  bold: !!o.bold, italics: !!o.italics, rightToLeft: true,
});

const para = (children, o = {}) => new Paragraph({
  bidirectional: true,
  alignment: o.alignment || AlignmentType.JUSTIFIED,
  spacing: { line: LINE, lineRule: 'auto',
             after: o.after === undefined ? 120 : o.after, before: o.before || 0 },
  indent: o.indent,
  keepNext: !!o.keepNext,
  pageBreakBefore: !!o.pageBreakBefore,
  children: Array.isArray(children) ? children : [children],
});

const txt = (t, o = {}) => para([run(t, o)], o);

function parse(file) {
  return fs.readFileSync(path.join(DIR, file), 'utf8')
    .split(/\r?\n/).filter(l => l.trim());
}

const children = [];

// ---------------------------------------------------------------- title page
// the guide does not name the institution, so the cover does not invent one
children.push(txt('קורס: מבוא לעבודה עם הורים', { alignment: AlignmentType.CENTER, bold: true, size: 28 }));
children.push(txt('', { after: 0 }));
children.push(txt('', { after: 0 }));
children.push(txt('נספח ב‏\': תמלילי הראיונות', { alignment: AlignmentType.CENTER, bold: true, size: 36 }));
children.push(txt('שני ראיונות עומק חצי מובנים עם הורים', { alignment: AlignmentType.CENTER, size: 28 }));
children.push(txt('', { after: 0 }));
children.push(txt('', { after: 0 }));
children.push(txt('מגישים:', { alignment: AlignmentType.CENTER, bold: true, after: 0 }));
children.push(txt('רביע אלטורי        ת"ז 209529783', { alignment: AlignmentType.CENTER, after: 0 }));
children.push(txt('רדואן אלטורי        ת"ז 300632767', { alignment: AlignmentType.CENTER }));
children.push(txt('', { after: 0 }));
children.push(txt('תאריך הגשה: ______________', { alignment: AlignmentType.CENTER }));

// ------------------------------------------------------- methodological note
children.push(txt('הערה מתודולוגית ואתית', {
  alignment: AlignmentType.RIGHT, bold: true, size: 28,
  pageBreakBefore: true, keepNext: true, before: 240 }));
[
  'נספח זה כולל את שני הראיונות שנערכו לצורך העבודה, ראיון אחד לכל מגיש, בהתאם למדריך הריאיון המופיע בנספח א‏\'. שני הראיונות הם ראיונות עומק חצי מובנים: עשרים השאלות שבמדריך הועברו בסדר אחיד ובנוסח אחיד בשני הראיונות, ושאלות ההמשך הופעלו באופן גמיש, רק כאשר התשובה הייתה קצרה או כללית, כפי שהמדריך מורה.',
  'שני הראיונות נערכו בערבית מדוברת, בבית המרואיינים ולפי בחירתם, והוקלטו בהסכמה שניתנה בעל פה בתחילת ההקלטה. ההקלטות תומללו מילה במילה ותורגמו לעברית. במקומות שבהם התרגום פגע בניואנס או שבהם הביטוי המקורי נושא משמעות שאין לה מקבילה מדויקת, נשמר הביטוי בערבית בתוך דברי המרואיין ולצידו התרגום. הֲפָסוֹת, חזרות ותיקונים עצמיים של המרואיינים נשמרו, משום שהם חלק מן המשמעות.',
  'המרואיינים קיבלו הסבר על מטרת הראיון, על כך שההקלטה מיועדת לצורכי לימוד בלבד, על זכותם שלא לענות על שאלה ועל זכותם להפסיק בכל רגע. שמות המרואיינים, שמות ילדיהם ושמות שאר בני המשפחה הם שמות בדויים, וכן שונו או טושטשו שם היישוב, שם בית הספר, מקומות העבודה וכל פרט אחר שעלול היה לאפשר זיהוי.',
  'בראיון השני מתאר האב אירוע שבו אחז בכוח ביד בנו. האירוע נכלל בתמליל כלשונו משום שהוא מרכזי להבנת המקרה ומשום שהאב עצמו הביא אותו ביוזמתו, התייחס אליו כאל טעות, ותיאר כיצד ביקש סליחה מבנו. אין מדובר בדיווח על פגיעה מתמשכת, ולא עלה בראיון מידע המחייב דיווח. הנושא נדון עם המרצה טרם הגשת העבודה.',
].forEach(p => children.push(txt(p)));

// ------------------------------------------------------------------ the body
function emit(file) {
  const lines = parse(file);
  let tableRows = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    const widths = [0.32, 0.68];
    children.push(new Table({
      visuallyRightToLeft: true,
      width: { size: TEXT_W, type: WidthType.DXA },
      columnWidths: widths.map(w => Math.round(TEXT_W * w)),
      rows: tableRows.map((cells, ri) => new TableRow({
        children: cells.map((c, ci) => new TableCell({
          width: { size: Math.round(TEXT_W * widths[ci]), type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 108, right: 108 },
          children: [new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { line: 240, lineRule: 'auto', after: 0 },
            children: [run(c, { bold: ri === 0, size: 22 })],
          })],
        })),
      })),
    }));
    children.push(txt('', { after: 0 }));
    tableRows = [];
  };

  for (const line of lines) {
    const tag = line.slice(0, 2);
    const body = line.slice(2).trim();
    if (line.startsWith('T|')) { tableRows.push(line.slice(2).split('|')); continue; }
    flushTable();
    if (tag === 'H1') {
      children.push(txt(body, { alignment: AlignmentType.CENTER, bold: true, size: 32,
                                pageBreakBefore: true, keepNext: true, before: 240 }));
    } else if (tag === 'H2') {
      children.push(txt(body, { alignment: AlignmentType.RIGHT, bold: true, size: 26,
                                keepNext: true, before: 240, after: 80 }));
    } else if (tag === 'M ') {
      children.push(txt(body, { alignment: AlignmentType.CENTER, italics: true, size: 22,
                                keepNext: true }));
    } else if (tag === 'P ') {
      children.push(txt(body, { italics: true, size: 22 }));
    } else if (tag === 'C ') {
      children.push(para([run('"' + body + '"', { italics: true })],
                         { indent: { right: 560, left: 560 }, after: 160 }));
    } else if (tag === 'Q ') {
      children.push(para([run(body, { bold: true })],
                         { before: 160, after: 60, keepNext: true }));
    } else if (tag === 'F ') {
      children.push(para([run(body, { bold: true, size: 22 })],
                         { indent: { right: 400 }, before: 100, after: 60, keepNext: true }));
    } else if (tag === 'A ') {
      children.push(txt(body));
    }
  }
  flushTable();
}

emit('iv1.txt');
emit('iv2.txt');

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: SZ, rightToLeft: true,
               // proof the Hebrew against a Hebrew dictionary, not the Latin default
               language: { value: 'en-US', bidirectional: 'he-IL' } },
        paragraph: { spacing: { line: LINE, lineRule: 'auto' },
                     alignment: AlignmentType.JUSTIFIED, bidirectional: true },
      },
    },
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 },
              margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } },
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        bidirectional: true, alignment: AlignmentType.CENTER,
        spacing: { line: 240, lineRule: 'auto' },
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, rightToLeft: true })],
      })] }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = process.argv[2] || path.join(DIR, 'interviews.docx');
  fs.writeFileSync(out, buf);
  console.log('wrote', out, buf.length, 'bytes;', children.length, 'blocks');
});

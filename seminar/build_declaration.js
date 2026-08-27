const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle,
} = require('docx');

const HEB = /[֐-׿]/;
const LAT = /[A-Za-z]/;

function scriptSegments(text) {
  const segs = [];
  let cur = '', curScript = null;
  for (const ch of text) {
    let s = null;
    if (HEB.test(ch)) s = 'heb';
    else if (LAT.test(ch)) s = 'lat';
    if (s === null) { cur += ch; continue; }
    if (curScript === null) { curScript = s; cur += ch; continue; }
    if (s === curScript) { cur += ch; continue; }
    let carry = '';
    if (curScript === 'heb' && s === 'lat') {
      const m = cur.match(/[(\["']+$/);
      if (m) { carry = m[0]; cur = cur.slice(0, -carry.length); }
    }
    if (cur) segs.push({ text: cur, script: curScript });
    cur = carry + ch; curScript = s;
  }
  if (cur) segs.push({ text: cur, script: curScript || 'heb' });
  return segs;
}

function runsFor(text, opts = {}) {
  const runs = [];
  for (const seg of scriptSegments(text)) {
    const hebrew = seg.script === 'heb';
    runs.push(new TextRun({
      text: seg.text,
      bold: opts.bold || false,
      rightToLeft: hebrew,
      font: hebrew
        ? { ascii: 'David', hAnsi: 'David', cs: 'David' }
        : { ascii: 'Times New Roman', hAnsi: 'Times New Roman', cs: 'Times New Roman' },
      size: opts.size || 24,
      sizeComplexScript: opts.size || 24,
    }));
  }
  return runs;
}

const LINE15 = { line: 360, lineRule: 'auto' };

function P(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { ...LINE15, after: opts.after ?? 120 },
    indent: opts.indent,
    children: runsFor(text, opts),
  });
}
function center(text, opts = {}) {
  return P(text, { ...opts, align: AlignmentType.CENTER });
}

function cell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    children: [new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.RIGHT,
      spacing: { line: 300, lineRule: 'auto', after: 40 },
      children: runsFor(text, opts),
    })],
  });
}

const COLS = [2000, 2600, 3000, 1472];

const table = new Table({
  visuallyRightToLeft: true,
  columnWidths: COLS,
  rows: [
    new TableRow({ children: [
      cell('שם יישום בינה מלאכותית שנעשה בו שימוש', COLS[0], { bold: true }),
      cell('החלק של העבודה שנעשה בו שימוש בבינה המלאכותית', COLS[1], { bold: true }),
      cell('מטרת השימוש', COLS[2], { bold: true }),
      cell('קישור לדרייב לתיעוד המלא של הדיאלוג עם הצ\'אט', COLS[3], { bold: true }),
    ]}),
    new TableRow({ children: [
      cell('Claude (Anthropic)', COLS[0]),
      cell('רשימת המקורות של סקירת הספרות', COLS[1]),
      cell('סידור ועריכה של הרשימה הביבליוגרפית בהתאם לכללי APA מהדורה 7: מבנה הרשומות, סדר אלפביתי, מקורות בעברית לפני מקורות באנגלית, הזחה תלויה והתאמה מלאה בין האזכורים בגוף העבודה לרשימה', COLS[2]),
      cell('[להשלים קישור]', COLS[3]),
    ]}),
  ],
});

const children = [];
children.push(center('הקריה האקדמית אונו', { bold: true, size: 28, after: 60 }));
children.push(center('התמחות תקשוב ולמידה', { size: 24, after: 240 }));
children.push(center('הצהרת שימוש בבינה מלאכותית', { bold: true, size: 30, after: 300 }));
children.push(P('שם הקורס: סמינר'));
children.push(P('שם הסטודנטית: ג\'סיקה אבו קארם'));
children.push(P('ת"ז: 321516262', { after: 240 }));
children.push(P('סימון מצב השימוש בבינה מלאכותית:', { bold: true }));
children.push(P('☐  בהכנת עבודה זו לא נעשה שימוש בבינה מלאכותית.'));
children.push(P('☒  בהכנת עבודה זו נעשה שימוש בבינה מלאכותית באופן הבא:', { after: 200 }));
children.push(table);
children.push(P('', { after: 120 }));
children.push(P('אני מצהירה בזאת כי:', { bold: true }));
children.push(P('שימוש ודיוק במידע:', { bold: true, after: 40 }));
children.push(P('בדקתי את מקורות המידע שהתקבלו מהבינה המלאכותית ואישרתי את דיוקם: עברתי על כל רשומה ברשימת המקורות והשוויתי אותה למאמר המקורי שקראתי.', { indent: { start: 360 } }));
children.push(P('אני מודעת לכך שכלי הבינה המלאכותית עשויים לספק מידע שאינו מדויק או מוטה, ונקטתי צעדים לוודא את אמינות המידע.', { indent: { start: 360 } }));
children.push(P('עיבוד ומקוריות:', { bold: true, after: 40 }));
children.push(P('עיבדתי בעצמי את התכנים שהתקבלו מהבינה המלאכותית.', { indent: { start: 360 } }));
children.push(P('אני מתחייבת שהאחריות על כל התכנים בעבודה חלה עליי בלבד ככותבת עיקרית.', { indent: { start: 360 } }));
children.push(P('ציון מקורות ותיעוד:', { bold: true, after: 40 }));
children.push(P('ציינתי את כל המקורות שבהם נעשה שימוש, בהתאם לכללי APA.', { indent: { start: 360 } }));
children.push(P('צירפתי כנספח תיעוד מלא של כל ההנחיות שלי (הפרומפטים) וכל התשובות מהצ\'אט.', { indent: { start: 360 } }));
children.push(P('יושרה אקדמית ותנאים:', { bold: true, after: 40 }));
children.push(P('אני מתחייבת לשמור על כללי היושרה האקדמית כפי שמפורט במסמך זה.', { indent: { start: 360 } }));
children.push(P('מובן לי כי הפרת כללים אלה, או שימוש לא ראוי בבינה מלאכותית, עלולים להוביל לסנקציות אקדמיות בהתאם לשיקול דעת המרצה.', { indent: { start: 360 }, after: 300 }));
children.push(P('חתימת הסטודנטית: ג\'סיקה אבו קארם'));
children.push(P('תאריך: 27.08.2026'));

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: 'Times New Roman', hAnsi: 'Times New Roman', cs: 'David' },
          size: 24,
          sizeComplexScript: 24,
        },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1417, bottom: 1417, left: 1417, right: 1417 },
        size: { width: 11906, height: 16838 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(process.argv[2] || 'declaration.docx', buf);
  console.log('written', process.argv[2] || 'declaration.docx', buf.length, 'bytes');
});

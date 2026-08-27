const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  LevelFormat, convertMillimetersToTwip,
} = require('docx');

const FONT = 'David';

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: { name: FONT },
    rightToLeft: true,
    size: opts.size || 24,
    bold: opts.bold || false,
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: opts.after !== undefined ? opts.after : 120 },
    children: Array.isArray(text) ? text : [run(text, opts)],
  });
}

function heading(text, level) {
  return new Paragraph({
    bidirectional: true,
    heading: level,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 240, after: 120 },
    children: [run(text, { bold: true, size: level === HeadingLevel.HEADING_1 ? 30 : 26 })],
  });
}

function q(ref, text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: 60 },
    numbering: { reference: ref, level: 0 },
    children: [run(text)],
  });
}

function probe(text) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { line: 360, after: 100 },
    indent: { left: 1080 },
    children: [run('שאלות עזר: ', { bold: true }), run(text)],
  });
}

const numbering = {
  config: [
    { reference: 'qnum', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'themes', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ],
};

// ==================== Document A: appendix of interview questions ====================
const A = [];
A.push(p('נספח: מדריך שאלות הריאיון', { align: AlignmentType.CENTER, bold: true, size: 32, after: 60 }));
A.push(p('סמינריון: שילוב והכלה במרחב החינוכי־חברתי | מרצה: ד"ר אירית דלומי־תורתי', { align: AlignmentType.CENTER, size: 22, after: 0 }));
A.push(p('מגישים: סלסביל אבו זיאד 215345448, אמיר אבו שריקי 325341352', { align: AlignmentType.CENTER, size: 22, after: 240 }));

A.push(heading('נושא המחקר', HeadingLevel.HEADING_2));
A.push(p('תפיסות מורים לגבי עיצוב הזהות החברתית של תלמידים עם צרכים מיוחדים בכיתות משלבות בבתי ספר יסודיים בחברה הבדואית בנגב, לאחר רפורמת תשע"ח (תיקון מס\' 11 לחוק החינוך המיוחד, 2018).'));

A.push(heading('על מבנה המדריך', HeadingLevel.HEADING_2));
A.push(p('המדריך כולל שאלת פתיחה, 16 שאלות בארבעה נושאים מרכזיים שנבחרו מתוך כותרות סקירת הספרות (ארבע שאלות לכל נושא), ושאלת סיכום. השאלות פתוחות, אישיות וקצרות, ואינן מכוונות לתשובה מסוימת. לכל שאלה צורפו שאלות עזר קצרות, לשימוש רק אם התשובה קצרה מדי. אם עומדים על 10 עד 12 שאלות בריאיון עצמו, אפשר להשמיט את השאלה האחרונה בכל נושא לפי זרימת השיחה.'));

A.push(heading('שאלת פתיחה', HeadingLevel.HEADING_1));
A.push(p('ספר/י לי קצת על עצמך: כמה שנים את/ה בהוראה, ומה הביא אותך ללמד בכיתה משלבת?'));

A.push(heading('נושא א: מדיניות ההכלה ויישומה בבית הספר', HeadingLevel.HEADING_1));
A.push(p('(מתוך הפרק: מדיניות ההכלה במערכת החינוך)', { size: 22, after: 60 }));
A.push(q('qnum', 'ספר/י לי איך נראה השילוב של תלמידים עם צרכים מיוחדים בכיתה שלך ביום־יום.'));
A.push(probe('תוכל/י לתאר בוקר רגיל? מי עוד שותף לעבודה איתם?'));
A.push(q('qnum', 'מה השתנה בעבודתך מאז רפורמת תשע"ח (2018), אם בכלל?'));
A.push(probe('במה זה מורגש אצלך בכיתה? תוכל/י לתת דוגמה?'));
A.push(q('qnum', 'מה את/ה יכול/ה לספר מניסיונך על ההכשרה והליווי שאת/ה מקבל/ת בנושא ההכלה?'));
A.push(probe('ממי מגיע הליווי? מה היה עוזר לך?'));
A.push(q('qnum', 'ספר/י לי על שיתוף הפעולה בינך ובין שאר הצוות סביב התלמידים המשולבים.'));
A.push(probe('עם מי את/ה מתייעץ/ת? איך זה נראה בפועל?'));

A.push(heading('נושא ב: הזהות החברתית של התלמידים המשולבים', HeadingLevel.HEADING_1));
A.push(p('(מתוך הפרק: בניית הזהות החברתית של תלמידים עם צרכים מיוחדים)', { size: 22, after: 60 }));
A.push(q('qnum', 'איך לדעתך רואים התלמידים המשולבים את מקומם בכיתה?'));
A.push(probe('ממה את/ה למד/ה על כך? תוכל/י לתת דוגמה?'));
A.push(q('qnum', 'ספר/י לי על תלמיד או תלמידה משולבים שזכורים לך במיוחד ביחסים שלהם עם ילדי הכיתה.'));
A.push(probe('מה קרה שם? איך זה נגמר?'));
A.push(q('qnum', 'מה לדעתך משפיע על האופן שבו תלמיד משולב תופס את עצמו בבית הספר?'));
A.push(probe('מה מהדברים האלה תלוי בכיתה עצמה, לדעתך?'));
A.push(q('qnum', 'איך ילדי הכיתה מתייחסים לתלמידים המשולבים, מניסיונך?'));
A.push(probe('תוכל/י לתאר מצב שממחיש את זה?'));

A.push(heading('נושא ג: שייכות, רגשות וקבלה חברתית', HeadingLevel.HEADING_1));
A.push(p('(מתוך הפרק: ההיבטים הרגשיים והחברתיים של תהליך ההכלה)', { size: 22, after: 60 }));
A.push(q('qnum', 'לפי מה את/ה מזהה שתלמיד משולב מרגיש שייך לכיתה, או להפך?'));
A.push(probe('תוכל/י לתאר סימנים שאת/ה שם/ה לב אליהם?'));
A.push(q('qnum', 'מה את/ה יכול/ה לספר על מה שקורה לתלמידים המשולבים בהפסקות ובפעילויות החברתיות?'));
A.push(probe('עם מי הם נמצאים? מה קורה כשיש פעילות כיתתית?'));
A.push(q('qnum', 'ספר/י לי על רגע שבו תלמיד משולב התמודד עם קושי רגשי או חברתי בכיתה.'));
A.push(probe('מה עשית באותו רגע? מה הרגשת?'));
A.push(q('qnum', 'ספר/י לי על רגע עם תלמיד משולב שהפתיע אותך.'));
A.push(probe('מה קרה שם? למה זה הפתיע אותך?'));

A.push(heading('נושא ד: תפקיד המורה, ההורים והקהילה', HeadingLevel.HEADING_1));
A.push(p('(מתוך הפרק: עמדות המורים ותפקידם בקידום ההכלה)', { size: 22, after: 60 }));
A.push(q('qnum', 'מה לדעתך תפקידך כמורה בחיים החברתיים של תלמיד משולב?'));
A.push(probe('אילו דברים את/ה עושה בפועל בהקשר הזה?'));
A.push(q('qnum', 'איך נראה הקשר שלך עם הורים של תלמידים משולבים? ספר/י לי מניסיונך.'));
A.push(probe('תוכל/י לתאר שיחה אחת שזכורה לך?'));
A.push(q('qnum', 'מה מיוחד לדעתך בשילוב דווקא בבית ספר בחברה הבדואית בנגב?'));
A.push(probe('איך הקהילה מתייחסת לזה? מה היית משנה אם אפשר?'));
A.push(q('qnum', 'מה היית אומר/ת למורה שמתחיל/ה עכשיו ללמד בכיתה משלבת?'));
A.push(probe('מה למדת בעצמך רק מתוך הניסיון?'));

A.push(heading('שאלת סיכום', HeadingLevel.HEADING_1));
A.push(p('האם יש משהו שלא שאלתי אותך וחשוב לך להוסיף?'));

A.push(heading('תזכורת למראיין', HeadingLevel.HEADING_2));
A.push(p('משך הריאיון 45 דקות עד שעה וחצי. להקליט בהסכמה (בזום: מצלמה פתוחה והקלטה), להחתים על מכתב ההסכמה לפני תחילת הריאיון, ולתמלל בסמוך למועד הריאיון. אפשר לשנות את סדר השאלות לפי זרימת השיחה, והעיקר להקשיב ולבקש דוגמאות.'));

// ==================== Document B: submission template for transcript 1 ====================
const B = [];
B.push(p('הגשת תמלול ריאיון 1', { align: AlignmentType.CENTER, bold: true, size: 32, after: 60 }));
B.push(p('סמינריון: שילוב והכלה במרחב החינוכי־חברתי | מרצה: ד"ר אירית דלומי־תורתי', { align: AlignmentType.CENTER, size: 22, after: 240 }));

B.push(heading('שמות המגישים ותאריך', HeadingLevel.HEADING_2));
B.push(p('סלסביל אבו זיאד 215345448, אמיר אבו שריקי 325341352'));
B.push(p('תאריך ההגשה: _____________'));

B.push(heading('נושא המחקר', HeadingLevel.HEADING_2));
B.push(p('תפיסות מורים לגבי עיצוב הזהות החברתית של תלמידים עם צרכים מיוחדים בכיתות משלבות בבתי ספר יסודיים בחברה הבדואית בנגב, לאחר רפורמת תשע"ח (תיקון מס\' 11 לחוק החינוך המיוחד, 2018).'));

B.push(heading('המרואיין/ת', HeadingLevel.HEADING_2));
B.push(p('כינוי (שם בדוי, לפי מכתב ההסכמה): _____________'));
B.push(p('גיל: _______ | ותק בהוראה: _______ | תפקיד: _____________'));
B.push(p('מגזר ומסגרת: מורה בכיתה משלבת בבית ספר יסודי בחברה הבדואית בנגב.'));
B.push(p('הריאיון הוקלט בהסכמת המרואיין/ת, מכתב הסכמה חתום שמור אצל המגישים. תאריך הריאיון: _______ | משך: _______'));

B.push(heading('4–5 נושאים מרכזיים שעלו בריאיון', HeadingLevel.HEADING_2));
B.push(p('(למלא אחרי קריאת התמלול, לפי שלבי חילוץ התמות משיעור 5: קריאת התוכן, סימון יחידות משמעות, מיון לתמות, ובחירת ציטוט קצר לכל תמה.)', { size: 22 }));
for (let i = 0; i < 5; i++) {
  B.push(q('themes', 'נושא: ______________________ | ציטוט לדוגמה מהתמלול: "______________________"'));
}

B.push(heading('התמלול', HeadingLevel.HEADING_2));
B.push(p('כללי התמלול: לתמלל מילה במילה, כולל חזרות, הפסקות וצחוק [בסוגריים מרובעים]. מ׳ = מראיין/ת, מ״א = מרואיין/ת. לשמור על עילום שם: כל שם של אדם, תלמיד או בית ספר מוחלף בכינוי.'));
B.push(p('דוגמה לפורמט בלבד (לא חלק מהריאיון):', { bold: true, after: 60 }));
B.push(p('מ׳: ספר לי קצת על עצמך, כמה שנים אתה בהוראה?'));
B.push(p('מ״א: אני מלמד כבר שתים עשרה שנה [מחייך], התחלתי בתור מורה למתמטיקה ו... איך להגיד, לא תכננתי בכלל להגיע לכיתה משלבת.'));
B.push(p('כאן מתחיל התמלול המלא של הריאיון שנערך והוקלט:', { bold: true }));
B.push(p('מ׳: _____'));
B.push(p('מ״א: _____'));

function buildDoc(children) {
  return new Document({
    numbering: JSON.parse(JSON.stringify(numbering)),
    styles: { default: { document: { run: { font: FONT, size: 24 } } } },
    sections: [{
      properties: {
        page: { margin: { top: convertMillimetersToTwip(25), bottom: convertMillimetersToTwip(25), left: convertMillimetersToTwip(25), right: convertMillimetersToTwip(25) } },
        bidi: true,
      },
      children,
    }],
  });
}

const outDir = process.argv[2] || '.';
Packer.toBuffer(buildDoc(A)).then((buf) => {
  fs.writeFileSync(outDir + '/נספח שאלות הריאיון - מעודכן.docx', buf);
  return Packer.toBuffer(buildDoc(B));
}).then((buf) => {
  fs.writeFileSync(outDir + '/תבנית הגשה - תמלול ריאיון 1.docx', buf);
  console.log('written both');
});

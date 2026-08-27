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
    italics: opts.italics || false,
  });
}

// Basic RTL paragraph
function p(text, opts = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: opts.after !== undefined ? opts.after : 120 },
    ...(opts.numbering ? { numbering: opts.numbering } : {}),
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

function bullet(text, ref, lvl = 0) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: 80 },
    numbering: { reference: ref, level: lvl },
    children: [run(text)],
  });
}

const numbering = {
  config: [
    { reference: 'subq1', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'subq2', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'subq3', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: 'ethics', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ],
};

const children = [];

// ---------- Cover ----------
children.push(p('הקריה האקדמית אונו', { align: AlignmentType.CENTER, bold: true, size: 28, after: 0 }));
children.push(p('סמינריון: שילוב והכלה במרחב החינוכי־חברתי', { align: AlignmentType.CENTER, bold: true, size: 28, after: 0 }));
children.push(p('מרצה: ד"ר אירית דלומי־תורתי', { align: AlignmentType.CENTER, size: 24, after: 0 }));
children.push(p('מגישים: סלסביל אבו זיאד 215345448 | אמיר אבו שריקי 325341352', { align: AlignmentType.CENTER, size: 24, after: 240 }));
children.push(p('מדריך ריאיון חצי־מובנה', { align: AlignmentType.CENTER, bold: true, size: 36, after: 60 }));
children.push(p('תפיסות מורים לגבי עיצוב הזהות החברתית של תלמידים עם צרכים מיוחדים בכיתות משלבות בבתי ספר יסודיים בחברה הבדואית בנגב, לאחר רפורמת תשע"ח (תיקון מס\' 11 לחוק החינוך המיוחד, 2018)', { align: AlignmentType.CENTER, bold: true, size: 26, after: 240 }));

// ---------- שאלת המחקר ----------
children.push(heading('שאלת המחקר', HeadingLevel.HEADING_1));
children.push(p('כיצד תופסים מורים המלמדים בכיתות משלבות בבתי ספר יסודיים בחברה הבדואית בנגב את הזהות החברתית של תלמידים עם צרכים מיוחדים, וכיצד לתפיסתם היא מתעצבת במרחב הבית־ספרי לאחר רפורמת תשע"ח (2018)?'));

// ---------- מבוא ----------
children.push(heading('מבוא למדריך הריאיון', HeadingLevel.HEADING_1));
children.push(p('בעשורים האחרונים חל שינוי מהותי בתפיסת החינוך המיוחד בעולם ובישראל: ממודל של הפרדה למדיניות של הכלה ושילוב, המבוססת על זכותו של כל תלמיד להשתייך לקהילה החינוכית, להשתתף באופן מלא בחיי בית הספר וליהנות משוויון הזדמנויות (UNESCO, 2020; Schuelka & Carrington, 2021). בישראל עוגנה תפיסה זו ברפורמת תשע"ח – תיקון מס\' 11 לחוק החינוך המיוחד (2018) – אשר העבירה את מוקד קבלת ההחלטות אל ההורים וחיזקה את שילובם של תלמידים עם צרכים מיוחדים בכיתות הרגילות. עם זאת, מחקרים עדכניים שנערכו בישראל מלמדים על פער בין המדיניות ליישומה בפועל: מורים תומכים עקרונית בהכלה, אך חשים בדידות מקצועית ומחסור בהכשרה, בליווי ובמשאבים (Huri & Shoshana, 2025; Gal et al., 2025).'));
children.push(p('הצלחת ההכלה אינה נמדדת בעצם הנוכחות בכיתה, אלא באיכות ההשתתפות החברתית ובתחושת השייכות שהתלמיד מפתח. הספרות מצביעה על כך שעמדות המורה וניהול הכיתה שלו משפיעים ישירות על הקבלה החברתית של תלמידים משולבים (Garrote et al., 2020), וכי הזהות החברתית מתעצבת מתוך אינטראקציה מתמשכת עם הסביבה – מורים, חברים לכיתה והאקלים הבית־ספרי (חמי וריץ\', 2019; דיון, 2021). בחברה הערבית בכלל ובחברה הבדואית בנגב בפרט, תלמידים עם מוגבלות עלולים לחוות "הפליה כפולה" – בשל מוגבלותם ובשל השתייכותם לקבוצת מיעוט – לצד מחסור מבני במשאבים ובנגישות (עבאס, 2013; Majadley, 2020). על רקע זה, מטרת הראיונות היא להעמיק בהבנת נקודת מבטם של מורים בבתי ספר בחברה הבדואית בנגב: כיצד הם תופסים את יישום ההכלה לאחר הרפורמה, וכיצד לדעתם מתעצבת הזהות החברתית ותחושת השייכות של תלמידיהם המשולבים (מילשטיין וריבקין, 2013; אבישר, 2016).'));
children.push(p('הריאיון הוא ריאיון עומק חצי־מובנה: שלוש שאלות מרכזיות, ולכל אחת מהן שלוש שאלות המשך (תתי־שאלות). השאלות פתוחות, ואינן מחליפות הקשבה – ניתן לשנות את סדרן בהתאם לזרימת השיחה ולבקש דוגמאות ותיאורי מקרה.'));

// ---------- משתתפים ----------
children.push(heading('משתתפים', HeadingLevel.HEADING_1));
children.push(p('משתתפי המחקר הם מורים ומורות (כבמערך המקורי – ללא שינוי): שני מורים/ות המלמדים בכיתות משלבות בבתי ספר יסודיים בחברה הבדואית בנגב, בעלי ניסיון של שלוש שנים לפחות בהוראת תלמידים עם צרכים מיוחדים בכיתה רגילה, ואשר מלמדים במערכת לאחר יישום רפורמת תשע"ח (2018). הבחירה במורים מאותה קבוצת אוכלוסייה נעשית בהתאם להנחיית המרצה למקד את המחקר בקבוצה מסוימת ולאחר הרפורמה.'));

// ---------- הליך ואתיקה ----------
children.push(heading('הליך ואתיקה', HeadingLevel.HEADING_1));
children.push(bullet('ייערכו שני ראיונות בשבוע–שבועיים הקרובים; מועדי הראיונות ייקבעו טלפונית מראש.', 'ethics'));
children.push(bullet('משך כל ריאיון: 45 דקות עד שעה וחצי. ניתן לקיים בזום – רק עם מצלמה פתוחה והקלטה.', 'ethics'));
children.push(bullet('כל ריאיון יוקלט (בהסכמת המרואיין/ת) ויתומלל בסמוך למועד הריאיון.', 'ethics'));
children.push(bullet('למרואיינים תובטח אנונימיות: שמות ופרטים מזהים יוחלפו בכינויים, והחומרים ישמשו לצורכי הקורס בלבד.', 'ethics'));

// ---------- מהלך הריאיון ----------
children.push(heading('מדריך הריאיון', HeadingLevel.HEADING_1));

children.push(heading('שאלת פתיחה', HeadingLevel.HEADING_2));
children.push(p('ספר/י לי על עצמך ועל עבודתך: כמה שנים את/ה מלמד/ת, אילו מקצועות ושכבות גיל, ומה ניסיונך עם תלמידים עם צרכים מיוחדים בכיתה שלך?'));

children.push(heading('שאלה מרכזית 1: תפיסת ההכלה ויישום רפורמת תשע"ח בבית הספר', HeadingLevel.HEADING_2));
children.push(p('כיצד את/ה תופס/ת את מדיניות ההכלה והשילוב בבית ספרך, מאז רפורמת תשע"ח (תיקון מס\' 11, 2018)?', { bold: true }));
children.push(bullet('מה השתנה בפועל בעבודתך היום־יומית מאז החלת הרפורמה?', 'subq1'));
children.push(bullet('אילו הכשרות, ליווי מקצועי ומשאבים את/ה מקבל/ת לצורך יישום ההכלה – ומה לדעתך חסר?', 'subq1'));
children.push(bullet('אילו אתגרים או הזדמנויות ייחודיים קיימים לדעתך ביישום ההכלה בבתי ספר בחברה הבדואית בנגב?', 'subq1'));

children.push(heading('שאלה מרכזית 2: הזהות החברתית ותחושת השייכות של התלמידים המשולבים', HeadingLevel.HEADING_2));
children.push(p('כיצד, לתפיסתך, מתעצבת הזהות החברתית ותחושת השייכות של תלמידים עם צרכים מיוחדים בכיתתך המשלבת?', { bold: true }));
children.push(bullet('תוכל/י לתאר מקרה שבו תלמיד/ה משולב/ת חווה קבלה חברתית או דחייה חברתית בכיתה? מה קרה, וכיצד פעלת?', 'subq2'));
children.push(bullet('כיצד לדעתך תופסים התלמידים המשולבים את עצמם ואת מקומם בכיתה – בשיעורים, בהפסקות ובפעילויות חברתיות?', 'subq2'));
children.push(bullet('אילו גורמים – יחסי עמיתים, אקלים כיתתי, המשפחה והקהילה – משפיעים לדעתך במיוחד על עיצוב זהותם החברתית?', 'subq2'));

children.push(heading('שאלה מרכזית 3: תפקיד המורה וההקשר התרבותי־קהילתי', HeadingLevel.HEADING_2));
children.push(p('מהו, לתפיסתך, תפקידך כמורה בעיצוב הזהות החברתית של תלמידים משולבים, וכיצד ההקשר התרבותי והקהילתי בחברה הבדואית משפיע על כך?', { bold: true }));
children.push(bullet('אילו פעולות מכוונות את/ה נוקט/ת כדי לקדם קבלה חברתית, השתתפות ותחושת שייכות של תלמידים משולבים?', 'subq3'));
children.push(bullet('כיצד מתנהלים הקשר ושיתוף הפעולה עם ההורים והקהילה סביב שילוב התלמידים, וכיצד הם משפיעים על התלמיד/ה?', 'subq3'));
children.push(bullet('מה לדעתך נדרש – ברמת המורה, בית הספר והמערכת – כדי שתלמידים עם צרכים מיוחדים ירגישו חלק ממש מהכיתה ומהקהילה?', 'subq3'));

children.push(heading('שאלת סיכום', HeadingLevel.HEADING_2));
children.push(p('האם יש משהו חשוב שלא שאלתי אותך, ושהיית רוצה להוסיף על חוויותיך עם שילוב והכלה בכיתתך?'));

// ---------- מקורות ----------
children.push(heading('רשימת מקורות (מתוקנת, APA-7)', HeadingLevel.HEADING_1));
const refs = [
  'אבישר, ג\' (2016). שיתופיות ושיתוף פעולה בין בית ספר מיוחד לבין בית ספר רגיל למטרת יישום שילוב. סחי"ש: סוגיות בחינוך מיוחד ובשילוב, 28, 32–51.',
  'אולניק־שמש, ד\', היימן, ט\' וזוארץ־חנן, מ\' (2020). קורבנות לבריונות ברשת בקרב ילדים צעירים: מאפייני התופעה והקשר לתמיכה חברתית ולתחושת בדידות. עיונים בחינוך, 20, 55–82.',
  'דיון, ב\' (2021). דַּבֵּר עברית ותכלם ערבי (דַּבֵּר ערבית): הנכחת רב־לשוניות והבניית זהות חברתית מעצימה במרחב האקדמי הרב־תרבותי כגשר לפדגוגיה שוויונית, דמוקרטיה, שוויון וסובלנות. ביטאון מכון מופ"ת, 67.',
  'חמי, א\' וריץ\', י\' (2019). התפתחות זהות אישית ותרבותית בקרב בוגרים צעירים שעלו מברית המועצות לשעבר. הייעוץ החינוכי, כא.',
  'חוק חינוך מיוחד (תיקון מס\' 11), התשע"ח–2018.',
  'מילשטיין, א\' וריבקין, ד\' (2013). שילוב ילדים עם צרכים מיוחדים בבתי־ספר רגילים: קידום השילוב ויצירת תרבות בית־ספרית משלבת. מאיירס־ג\'וינט־מכון ברוקדייל.',
  'עבאס, ע\' (עורך). (2013). לשון המופלים פעמיים: האנשים עם מוגבלות בחברה הערבית בישראל (נייר עמדה). אלמנארה – עמותה לקידום אנשים עם מוגבלות.',
];
for (const r of refs) children.push(p(r, { after: 120 }));

const enRefs = [
  'Gal, C., Ryder, C. H., Raveh Amsalem, S., & On, O. (2025). Shaping inclusive classrooms: Key factors influencing teachers’ attitudes toward inclusion of students with special needs. Education Sciences, 15(5), 541. https://doi.org/10.3390/educsci15050541',
  'Garrote, A., Felder, F., Krähenmann, H., Schnepel, S., Sermier Dessemontet, R., & Moser Opitz, E. (2020). Social acceptance in inclusive classrooms: The role of teacher attitudes toward inclusion and classroom management. Frontiers in Education, 5, 582873. https://doi.org/10.3389/feduc.2020.582873',
  'Huri, O., & Shoshana, A. (2025). ‘Where are we in this process’? Teachers’ attitudes regarding the amendment to the special education law in Israel. Journal of Research in Special Educational Needs, 25(1), 71–81. https://doi.org/10.1111/1471-3802.12710',
  'Majadley, E. (2020). Inclusion of children with disabilities from the Palestinian-Arab community in the Israeli education system. Rocznik Pedagogiczny, 43, 197–210.',
  'Schuelka, M. J., & Carrington, S. (Eds.). (2021). Global directions in inclusive education: Conceptualizations, practices, and methodologies for the 21st century. Routledge.',
  'UNESCO. (2020). Global education monitoring report 2020: Inclusion and education – All means all. UNESCO.',
];
for (const r of enRefs) {
  children.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 360, after: 120 },
    indent: { left: 720, hanging: 720 },
    children: [new TextRun({ text: r, font: { name: 'Times New Roman' }, size: 24 })],
  }));
}

const doc = new Document({
  numbering,
  styles: {
    default: {
      document: { run: { font: FONT, size: 24 } },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertMillimetersToTwip(25), bottom: convertMillimetersToTwip(25),
          left: convertMillimetersToTwip(25), right: convertMillimetersToTwip(25),
        },
        textDirection: undefined,
      },
      bidi: true,
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2] || 'interview_guide.docx', buf);
  console.log('written');
});

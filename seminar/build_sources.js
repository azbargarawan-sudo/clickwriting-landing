const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, PageOrientation, HeadingLevel,
} = require('docx');

const HEB = { ascii: 'Times New Roman', hAnsi: 'Times New Roman', cs: 'David', eastAsia: 'David' };
const run = (t, o = {}) => new TextRun({ text: t, font: HEB, size: 20, rightToLeft: true, ...o });
const P = (t, o = {}) => new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { line: 300, after: 100 }, children: [run(t, o.r || {})], ...(o.p || {}) });
const H = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { before: 200, after: 160 }, children: [run(t, { bold: true, size: 30, color: '000000' })] });

function tbl(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const mkCell = (t, i, head) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    shading: head ? { type: ShadingType.CLEAR, fill: 'D9E2F3', color: 'auto' } : undefined,
    children: String(t).split('\n').map(line => new Paragraph({
      bidirectional: !/^[A-Za-z]/.test(line),
      alignment: /^[A-Za-z]/.test(line) ? AlignmentType.LEFT : AlignmentType.RIGHT,
      spacing: { line: 240, after: 40 },
      children: [new TextRun({ text: line, font: HEB, size: head ? 20 : 18, bold: head, rightToLeft: !/^[A-Za-z]/.test(line) })],
    })),
  });
  return new Table({
    visuallyRightToLeft: true,
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [new TableRow({ tableHeader: true, children: headers.map((h, i) => mkCell(h, i, true)) }),
      ...rows.map(r => new TableRow({ children: r.map((t, i) => mkCell(t, i, false)) }))],
  });
}

const EN = [
  ['1', 'Howie, E. K., Joosten, J., Harris, C. J., & Straker, L. M. (2020). Associations between meeting sleep, physical activity or screen time behaviour guidelines and academic performance in Australian school children. BMC Public Health, 20, 520.', 'מחקר חתך, 934 תלמידי כיתות ה-יב, אוסטרליה', 'גישה פתוחה (BMC)\nhttps://doi.org/10.1186/s12889-020-08620-w\nPMC7165394', 'המחקר המרכזי (זה שסוכם במצגת). 74% עמדו בהמלצת שינה, 21% פעילות גופנית, 15% מסכים, 2% בשלושתן. עמידה בהמלצת מסכים: +5.8 במדד הכללי, +7.9 מתמטיקה, +3.8 אנגלית. שעת שינה מאוחרת בסוף שבוע: -3.4.', 'מבוא, 1.5, השערות, שיטה (כלים)', 'מאומת'],
  ['2', 'Saccani, M. S., Ursumando, L., Di Vara, S., Lazzaro, G., Varuzza, C., Vicari, S., & Menghini, D. (2022). Sleep disturbances in children with attentional deficit hyperactivity disorder and specific learning disorders. IJERPH, 19(11), 6411.', 'מחקר השוואתי, 74 ADHD / 78 SLD / 76 משולב, איטליה', 'גישה פתוחה (MDPI, CC BY)\nhttps://doi.org/10.3390/ijerph19116411\nPMC9180075', 'הקבוצה עם תחלואה כפולה הראתה הפרעות שינה רבות יותר, בעיקר קשיי הירדמות ושמירת רצף שינה.', '1.1, 1.3, השערה 5, שיטה (אוכלוסייה)', 'מאומת'],
  ['3', 'Jeffcock, K., & Dimitriou, D. (2025). A community study on sleep characteristics and anxiety symptoms in children with dyslexia. Brain Sciences, 15(7), 711.', 'מחקר קהילתי, הורים ל-160 ילדים 7-13 עם דיסלקציה, בריטניה', 'גישה פתוחה (MDPI)\nhttps://doi.org/10.3390/brainsci15070711\nPMC12293275', '66% ברמה קלינית של הפרעות שינה: עיכוב הירדמות, חרדת שינה, ישנוניות יומית. החרדה לא הסבירה זאת.', 'מבוא, 1.3, השערה 5', 'מאומת'],
  ['4', 'Kocabas, S., Adak, I., Karakus, O. B., & Toksoy, Z. E. (2025). Learning disability as a determinant of digital behavior in adolescents with ADHD: A cross-sectional study. European Child & Adolescent Psychiatry, 34(12), 3999-4007.', 'מחקר חתך, 86 ADHD+LD מול 86 ADHD, גילי 8-17, טורקיה', 'גישה פתוחה\nhttps://doi.org/10.1007/s00787-025-02802-w\nPMC12743106', 'אין הבדל בכמות זמן המסך; קבוצת לקות הלמידה עסקה במגוון מצומצם יותר של פעילויות מסך.', '1.2, 1.7 (שאלה פתוחה)', 'מאומת'],
  ['5', 'Blanchet, M., & Assaiante, C. (2022). Specific learning disorder in children and adolescents, a scoping review on motor impairments and their potential impacts. Children, 9(6), 892.', 'סקירת היקף, 34 מחקרים 1990-2022', 'גישה פתוחה (MDPI)\nhttps://doi.org/10.3390/children9060892\nPMC9222033', 'לתלמידים עם SLD מיומנויות מוטוריות נמוכות; קשר לאורח חיים יושבני; החמרה עם תחלואה נלווית.', 'מבוא, 1.1, 1.4, השערה 5', 'מאומת'],
  ['6', 'Qu, G., Hu, W., Meng, J., Wang, X., Su, W., Liu, H., Ma, S., Sun, C., Huang, C., Lowe, S., & Sun, Y. (2023). Association between screen time and developmental and behavioral problems among children in the United States: Evidence from 2018 to 2020 NSCH. Journal of Psychiatric Research, 161, 140-149.', 'ניתוח סקר לאומי NSCH 2018-2020, ארה"ב', 'לא בגישה פתוחה מלאה (ScienceDirect). תקציר חופשי. לבדוק גישה דרך ספריית המוסד.', 'זמן מסך מופרז קשור לדיווח על לקות למידה, ADHD, אוטיזם ועיכוב התפתחותי; חזק יותר בבנים ובגיל הגן.', 'מבוא, 1.2', 'מאומת (לא OA)'],
  ['7', 'Dai, Y., & Ouyang, N. (2026). Excessive screen time is associated with mental health problems in US children and adolescents: Physical activity and sleep as parallel mediators. Humanities and Social Sciences Communications, 13, 256.', 'ניתוח סקר לאומי, 50,231 ילדים 6-17, ארה"ב', 'גישה פתוחה (Nature portfolio)\nhttps://doi.org/10.1057/s41599-026-06609-1', '4 שעות מסך ומעלה: חרדה aOR 1.45, דיכאון 1.61, ADHD 1.21. פעילות גופנית תיווכה 30.9-38.9%, שעת שינה לא סדירה 18.4-23.9%.', '1.2, השערה 2', 'מאומת'],
  ['8', 'Chen, S., Liang, K., López-Gil, J. F., Drenowatz, C., & Tremblay, M. S. (2024). Association between meeting 24-h movement guidelines and academic performance in a sample of 67,281 Chinese children and adolescents. European Journal of Sport Science, 24(4), 487-498.', 'מחקר חתך, 67,281 תלמידים, סין', 'גישה פתוחה (Wiley)\nhttps://doi.org/10.1002/ejsc.12034\nPMC11235752', 'עמידה בשלוש ההמלצות: OR 1.56 סינית, 1.51 מתמטיקה, 1.73 אנגלית. המלצת המסכים העקבית ביותר.', '1.5, 1.7, השערה 3', 'מאומת'],
  ['9', 'Korcz, A., Krzysztoszek, J., Bronikowski, M., Łopatka, M., & Bojkowski, Ł. (2023). Associations between physical activity, screen time, sleep time and selected academic skills in 8/9-year-old children. BMC Public Health, 23, 1335.', 'מחקר חתך, 114 ילדים בני 8-9, פולין', 'גישה פתוחה (BMC)\nhttps://doi.org/10.1186/s12889-023-16230-5\nPMC10337111', 'MVPA קשור לאינטגרציה חזותית-שמיעתית; אי-עמידה בשינה ובמסכים קשורה למיומנויות יסוד נמוכות לקריאה.', '1.5, שיטה (מערך)', 'מאומת'],
  ['10', 'Lund, L., Sølvhøj, I. N., Danielsen, D., & Andersen, S. (2021). Electronic media use and sleep in children and adolescents in western countries: A systematic review. BMC Public Health, 21, 1598.', 'סקירה שיטתית, גילי 0-15, מדינות מערביות', 'גישה פתוחה (BMC)\nhttps://doi.org/10.1186/s12889-021-11640-9\nPMC8482627', 'שימוש במדיה קשור לשעת שינה מאוחרת, משך שינה קצר ואיכות שינה ירודה.', '1.3, השערה 1', 'מאומת'],
  ['11', 'Santos, R. M. S., Mendes, C. G., Bressani, G. Y. S., Ventura, S. A., Nogueira, Y. J. A., Miranda, D. M., & Romano-Silva, M. A. (2023). The associations between screen time and mental health in adolescents: A systematic review. BMC Psychology, 11, 127.', 'סקירה שיטתית, 50 מחקרים', 'גישה פתוחה (BMC)\nhttps://doi.org/10.1186/s40359-023-01166-7\nPMC10117262', 'סמארטפון המכשיר הנפוץ; שימוש בימי חול קשור לרווחה נמוכה; רשתות חברתיות קשורות לדיכאון בבנות.', '1.2', 'מאומת'],
  ['12', 'Macchitella, L., Marinelli, C. V., Signore, F., Ciavolino, E., & Angelelli, P. (2020). Sleepiness, neuropsychological skills, and scholastic learning in children. Brain Sciences, 10(8), 529.', 'מחקר חתך, 191 תלמידי יסודי, איטליה', 'גישה פתוחה (MDPI)\nhttps://doi.org/10.3390/brainsci10080529\nPMC7464965', 'ישנוניות יומית קשורה לתפקוד נמוך בקריאה, כתיבה, הבנת הנקרא וחשבון.', '1.3', 'מאומת'],
  ['13', 'Wang, T., Li, W., Deng, J., Zhang, Q., Liu, Y., & Zheng, H. (2024). The impact of the physical activity intervention on sleep in children and adolescents with neurodevelopmental disorders: A systematic review and meta-analysis. Frontiers in Neurology, 15, 1438786.', 'מטא-אנליזה של מחקרי התערבות', 'גישה פתוחה (Frontiers)\nhttps://doi.org/10.3389/fneur.2024.1438786\nPMC11347421', 'התערבויות פעילות גופנית שיפרו יעילות, משך ורצף שינה; אפקט גדול יותר מעל 12 שבועות, 3 פעמים בשבוע, מעל שעה.', '1.4', 'מאומת'],
  ['14', 'Ghanamah, R., Eghbaria-Ghanamah, H., Abu-Saleh, N., & Kitany, S. (2023). Parents\' perceptions of changes in sleep duration, physical activity, and sedentary behavior in Arab Israeli children during the COVID-19 outbreak. IJERPH, 20(11), 6041.', 'מחקר חתך, 490 הורים בחברה הערבית בישראל', 'גישה פתוחה (MDPI)\nhttps://doi.org/10.3390/ijerph20116041\nPMC10252515', 'בקורונה: ירידה בפעילות גופנית, עלייה בהתנהגות יושבנית ובמשך שינה, ירידה בעמידה בהמלצות.', '1.6', 'מאומת'],
  ['15', 'Tapia-Serrano, M. A., Sevil-Serrano, J., Sánchez-Miguel, P. A., López-Gil, J. F., Tremblay, M. S., & García-Hermoso, A. (2022). Prevalence of meeting 24-hour movement guidelines from pre-school to adolescence... Journal of Sport and Health Science, 11(4), 427-437.', 'מטא-אנליזה, 387,437 משתתפים, 23 מדינות', 'גישה פתוחה (Elsevier/JSHS)\nhttps://doi.org/10.1016/j.jshs.2022.01.005', 'רוב הילדים ובני הנוער אינם עומדים בשלוש ההמלצות; 1 מכל 5 לא עומד באף אחת; ירידה בגיל ההתבגרות ובבנות.', '1.2', 'מאומת'],
  ['16', 'Vanderloo, L. M., et al. (2025). Screen time among children and youth with disabilities: A systematic review and meta-analysis. Child: Care, Health and Development, 51(4), e70136.', 'סקירה שיטתית ומטא-אנליזה, גילי 0-17 עם מוגבלויות', 'לבדוק גישה\nhttps://doi.org/10.1111/cch.70136', 'מיפוי זמן מסך לפי גיל וסוג מוגבלות. יש להשלים את רשימת המחברים המלאה ואת הממצאים הכמותיים מהמאמר עצמו.', '1.2', 'להשלים מחברים וממצאים'],
  ['17', 'Tremblay, M. S., et al. (2016). Canadian 24-hour movement guidelines for children and youth: An integration of physical activity, sedentary behaviour, and sleep. Applied Physiology, Nutrition, and Metabolism, 41(6, Suppl. 3), S311-S327.', 'מסמך הנחיות (מקור מכונן)', 'גישה פתוחה\nhttps://doi.org/10.1139/apnm-2016-0151', 'ההנחיות המשולבות הראשונות: 60 דקות MVPA, עד שעתיים מסך פנאי, 9-11 / 8-10 שעות שינה.', 'מבוא, 1.2, 1.3, 1.5, שיטה', 'מאומת (לפני 2020, מקור תיאורטי)'],
  ['18', 'Bull, F. C., et al. (2020). World Health Organization 2020 guidelines on physical activity and sedentary behaviour. British Journal of Sports Medicine, 54(24), 1451-1462.', 'מסמך הנחיות ארגון הבריאות העולמי', 'גישה פתוחה (BMJ)\nhttps://doi.org/10.1136/bjsports-2020-102955\nPMC7719906', 'ממוצע 60 דקות ביום MVPA לילדים ומתבגרים; הגבלת זמן יושבני ומסכים.', '1.4, שיטה (כלים)', 'מאומת'],
  ['19', 'Shochat, T., Flint-Bretler, O., & Tzischinsky, O. (2010). Sleep patterns, electronic media exposure and daytime sleep-related behaviours among Israeli adolescents. Acta Paediatrica, 99(9), 1396-1400.', 'מחקר חתך, 470 תלמידי ח-ט, ישראל', 'לא OA (Wiley). תקציר חופשי ב-PubMed 20377536.', 'חשיפה למדיה ומכשירים בחדר השינה קשורים לשינה מאוחרת, קצרה ולישנוניות יומית.', '1.3, 1.6, השערה 1', 'מאומת (מחקר ישראלי ותיק)'],
  ['20', 'American Psychiatric Association. (2022). DSM-5-TR.', 'מדריך אבחוני', 'ספר (ספרייה)', 'הגדרת לקות למידה ספציפית; שכיחות 5-15%.', '1.1', 'מקור סטנדרטי'],
  ['21', 'Drake, C., et al. (2003). The Pediatric Daytime Sleepiness Scale (PDSS). Sleep, 26(4), 455-458.', 'פיתוח כלי מדידה', 'גישה פתוחה\nhttps://doi.org/10.1093/sleep/26.4.455', 'סולם 8 פריטים לישנוניות יומית; אלפא 0.80; קשור להישגים.', 'שיטה (כלים), נספח', 'כלי מחקר'],
  ['22', 'Kowalski, K. C., Crocker, P. R. E., & Donen, R. M. (2004). The PAQ-C and PAQ-A manual. University of Saskatchewan.', 'מדריך כלי מדידה', 'חופשי באתר האוניברסיטה', 'שאלון פעילות גופנית 7 ימים למתבגרים.', 'שיטה (כלים), נספח', 'כלי מחקר'],
];

const HE = [
  ['23', 'אבגר, ע\' (2018). לקויות למידה במערכת החינוך בישראל. הכנסת, מרכז המחקר והמידע.', 'דוח ממ"מ', 'חופשי\nfs.knesset.gov.il (קישור מלא ברשימת המקורות)', 'היקף האוכלוסייה, איתור, אבחון והתאמות; פערים בין מגזרים.', '1.1, 1.6', 'מאומת'],
  ['24', 'איגוד האינטרנט הישראלי (2022). בני נוער, הורים ומסכים בישראל: סקר שימושים ופערים (קיץ 2022).', 'סקר ארצי', 'חופשי\nhttps://www.isoc.org.il/sts-data/screentime_2022', '54% מהנוער היהודי-חילוני 4-8 שעות ביום, 11% מעל 8; בחברה הערבית 67%; יהודי-דתי 41%.', 'מבוא, 1.6, 1.7', 'מאומת'],
  ['25', 'ארן-ארנרייך, י\' (2013, 7 בנובמבר). לקות למידה או הפרעת למידה? אבחון קשיי למידה על פי ה-DSM 5. פסיכולוגיה עברית.', 'מאמר מקצועי מקוון', 'חופשי\nhttps://www.hebpsy.net/articles.asp?id=3043', 'השינוי ממונח "לקות" ל"הפרעה" ב-DSM-5 והשלכותיו על האבחון.', '1.1', 'לאמת את שם המחבר באתר'],
  ['26', 'בק, ה\', טסלר, ר\', מורן, ד\', קולובוב, ט\', והראל-פיש, י\' (2018). מודל רב-רמות להבנת הגורמים המנבאים התנהגויות בריאות... בתנועה, יא(4), 510-533.', 'מאמר שפיט, נתוני HBSC ~7,000 תלמידים', 'חופשי (אתר וינגייט)', 'בנים פעילים יותר מבנות; גורמים ברמת התלמיד ובית הספר מנבאים פעילות.', '1.4, 1.6, שיטה (כלים)', 'מאומת (2018, לפני 2020)'],
  ['27', 'בשארה, ס\', ווייס, י\' (2025). קשר בין תפקודים ניהוליים וידע עולם להבנת הנקרא בקרב תלמידים עם לקויות למידה ותלמידים בלי לקויות למידה. הייעוץ החינוכי.', 'מאמר שפיט, מחקר השוואתי ישראלי', 'חופשי\nshaanan.ac.il (PDF)', 'תפקודים ניהוליים וידע עולם תורמים להבנת הנקרא; פער בתפקודים ניהוליים בלקות למידה.', '1.1, 1.6', 'להשלים גיליון ועמודים'],
  ['28', 'משרד הבריאות (2026). על ילדים ובני נוער ומסכים: המלצות להורים. אפשריבריא.', 'המלצות רשמיות (פורסמו 3.9.2026)', 'חופשי\nefsharibari.health.gov.il', 'ללא מסכים עד גיל 2; עד שעה 2-5; פחות משעתיים 6-9; סמארטפון מגיל 13; רשתות מגיל 15; 28.7% מתלמידי ז-יב 6 שעות ומעלה (HBSC).', 'מבוא, 1.6, 1.7', 'לאמת כותרת ותאריך בעמוד'],
  ['29', 'משרד החינוך, השירות הפסיכולוגי-ייעוצי (ל.ת.). לקויות למידה: הגדרות ותיאוריה. שפ"ינט.', 'עמוד מדיניות רשמי', 'חופשי\nshefi.education.gov.il', 'משרד החינוך מאמץ את הגדרת DSM-5 כבסיס לאבחון.', '1.1', 'לאמת כותרת העמוד'],
];

const extra = [
  ['Tzischinsky, O., et al. (2017). Comparative study shows differences in screen exposure, sleep patterns and sleep disturbances between Jewish and Muslim children in Israel. Acta Paediatrica, 106(10), 1642-1650.', '1,049 ילדים (499 יהודים, 550 מוסלמים), גיל 9. ילדים מוסלמים דיווחו על יותר זמן מסך ויותר הפרעות שינה. לא OA. מתאים אם המדגם מהחברה הערבית.'],
  ['הראל-פיש, י\' ואחרים (2024). נוער בישראל: בריאות, רווחה נפשית וחברתית ודפוסי התנהגויות סיכון, ממצאי HBSC 2023. אוניברסיטת בר-אילן.', 'הדוח הארצי המלא, חופשי באתר משרד החינוך (Youthinisrael23.pdf). לאמת מחברים ושנה. מקור מצוין לנתוני מסכים, שינה ופעילות גופנית לפי מגזר.'],
  ['משרד הבריאות, המרכז הלאומי לבקרת מחלות (2017). סקר מב"ת לנוער 2015-2016: תלמידי כיתות ז-יב.', 'סקר לאומי; כ-30% מתלמידי ז-יב 6 שעות מסך ומעלה. חופשי באתר gov.il.'],
  ['המועצה הלאומית לשלום הילד (2023). ילדים בישראל 2022: לקט נתונים.', 'נתוני רקע על ילדים בישראל. חופשי.'],
  ['Santos et al. (2023) / Lund et al. (2021) – כבר ברשימה', 'לשימוש מורחב בדיון.'],
];

const children = [];
children.push(H('רשימת מקורות למחקר: חשיפה למסכים, שינה ופעילות גופנית בקרב תלמידים עם לקויות למידה'));
children.push(P('סה"כ 29 מקורות בשימוש בעבודה: 22 באנגלית ו-7 בעברית (הדרישה: לפחות 15, מהם לפחות 5 באנגלית). 24 מתוכם משנת 2020 ואילך. רוב המאמרים באנגלית בגישה פתוחה מלאה (PMC / MDPI / BMC / Frontiers). עמודת "סטטוס" מסמנת מה נדרש עוד לאמת מול המאמר המלא. תאריך הכנת הרשימה: ספטמבר 2026.'));
children.push(P('מקורות באנגלית', { r: { bold: true, size: 24 } }));
children.push(tbl(['#', 'רישום APA 7', 'סוג / מדגם', 'גישה וקישור', 'ממצא עיקרי לשימוש', 'היכן בעבודה', 'סטטוס'], EN, [400, 3600, 1700, 2300, 3300, 1500, 1200]));
children.push(new Paragraph({ children: [] }));
children.push(P('מקורות בעברית', { r: { bold: true, size: 24 } }));
children.push(tbl(['#', 'רישום APA 7', 'סוג / מדגם', 'גישה וקישור', 'ממצא עיקרי לשימוש', 'היכן בעבודה', 'סטטוס'], HE, [400, 3600, 1700, 2300, 3300, 1500, 1200]));
children.push(new Paragraph({ children: [] }));
children.push(P('מקורות נוספים לשקול (לא נכללו בעבודה בשלב זה)', { r: { bold: true, size: 24 } }));
children.push(tbl(['מקור', 'הערה'], extra, [6000, 8000]));
children.push(new Paragraph({ children: [] }));
children.push(P('דרך מהירה להוריד את המאמרים המלאים: לכל מאמר עם מספר PMC, להיכנס ל-https://pmc.ncbi.nlm.nih.gov/articles/PMC<המספר>/ ולהוריד PDF. למאמרי MDPI ו-BMC, קישור ה-DOI מוביל ישירות לטקסט המלא.'));

const doc = new Document({
  styles: { default: { document: { run: { font: HEB, size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: 16838, height: 11906, orientation: PageOrientation.LANDSCAPE }, margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
    children,
  }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync('רשימת_מקורות_מסכים_שינה_פעילות_לקויות_למידה.docx', b); console.log('written', b.length); });

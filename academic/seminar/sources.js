// מרשם המקורות לסמינריון, לפי כללי האזכור האחיד בכתיבה המשפטית (מהדורה רביעית, 2021).
// **טקסט** = מודגש, _טקסט_ = נטוי, [..] = פרט חסר שיש להשלים (יסומן בצהוב במסמך).
// type: case (פסק דין), fcase (פסק דין זר), book, article, chapter, law, other.
// cat: קטגוריה ברשימת המקורות.

module.exports = {
  // ---------- חקיקה ----------
  police:   { type: 'law', text: 'פקודת המשטרה [נוסח חדש], התשל"א–1971' },
  arrests:  { type: 'law', text: 'חוק סדר הדין הפלילי (סמכויות אכיפה – מעצרים), התשנ"ו–1996' },
  secpow:   { type: 'law', text: 'חוק סמכויות לשם שמירה על ביטחון הציבור, התשס"ה–2005' },
  penal:    { type: 'law', text: 'חוק העונשין, התשל"ז–1977' },
  idlaw:    { type: 'law', text: 'חוק החזקת תעודת זהות והצגתה, התשמ"ג–1982' },
  stateliab:{ type: 'law', text: 'חוק הנזיקים האזרחיים (אחריות המדינה), התשי"ב–1952' },
  basic:    { type: 'law', text: 'חוק-יסוד: כבוד האדם וחירותו' },
  privacy:  { type: 'law', text: 'חוק הגנת הפרטיות, התשמ"א–1981' },
  pace:     { type: 'law', text: '_Police and Criminal Evidence Act 1984_, c. 60 (UK)', foreign: true },

  // ---------- פסיקה ישראלית ----------
  suissa:   { type: 'case', proc: 'בג"ץ 7074/93', parties: 'סויסא נ\' היועץ המשפטי לממשלה', rep: 'פ"ד מח(2) 749', year: '1994', short: 'סויסא' },
  hcj2605:  { type: 'case', proc: 'בג"ץ 2605/05', parties: 'המרכז האקדמי למשפט ולעסקים, חטיבת זכויות האדם נ\' שר האוצר', rep: 'פ"ד סג(2) 545', year: '2009', short: 'המרכז האקדמי' },
  mana:     { type: 'case', proc: 'בג"ץ 6824/07', parties: 'מנאע נ\' רשות המסים', rep: 'פ"ד סד(2) 479', year: '2010', short: 'מנאע' },
  benhaim:  { type: 'case', proc: 'רע"פ 10141/09', parties: 'בן חיים נ\' מדינת ישראל', rep: 'פ"ד סה(3) 305', year: '2012', short: 'בן חיים' },
  zakin:    { type: 'case', proc: 'בג"ץ 6396/96', parties: 'זקין נ\' ראש עיריית באר-שבע', rep: 'פ"ד נג(3) 289', year: '1999', short: 'זקין' },
  borowitz: { type: 'case', proc: 'ע"פ 4855/02', parties: 'מדינת ישראל נ\' בורוביץ', rep: 'פ"ד נט(6) 776', year: '2005', short: 'בורוביץ' },
  weiss:    { type: 'case', proc: 'ע"א 1678/01', parties: 'מדינת ישראל נ\' וייס', rep: 'פ"ד נח(5) 167', year: '2004', short: 'וייס' },
  matteh:   { type: 'case', proc: 'בג"ץ 2557/05', parties: 'מטה הרוב נ\' משטרת ישראל', rep: 'פ"ד סב(1) 200', year: '2006', short: 'מטה הרוב' },
  boskila:  { type: 'case', proc: 'ע"א 337/81', parties: 'בוסקילה נ\' מדינת ישראל', rep: 'פ"ד לח(3) 337', year: '1984', short: 'בוסקילה' },
  chilef:   { type: 'case', proc: 'בג"ץ 64/91', parties: 'חילף נ\' משטרת ישראל', rep: 'פ"ד מז(5) 653', year: '1993', short: 'חילף' },
  musa:     { type: 'case', proc: 'ע"פ 9878/09', parties: 'מדינת ישראל נ\' מוסא', date: '20.9.2010', short: 'מוסא' },
  sadik:    { type: 'case', proc: 'בג"ץ 8225/07', parties: 'סדיק נ\' מפכ"ל המשטרה', date: '6.7.2009', short: 'סדיק' },
  elhananov:{ type: 'case', proc: 'בג"ץ 8634/08', parties: 'אלחננוב נ\' משטרת ישראל – אגף משאבי אנוש', date: '16.11.2010', short: 'אלחננוב' },
  yosef:    { type: 'case', proc: 'ע"א 3580/06', parties: 'עזבון יוסף נ\' מדינת ישראל', date: '21.3.2011', short: 'יוסף' },
  tebeka:   { type: 'case', proc: 'בג"ץ 4455/19', parties: 'עמותת טבקה – צדק ושוויון ליוצאי אתיופיה נ\' משטרת ישראל', date: '25.1.2021', short: 'טבקה' },
  dnagatz:  { type: 'case', proc: 'דנג"ץ 2707/21', parties: 'משטרת ישראל נ\' עמותת טבקה – צדק ושוויון ליוצאי אתיופיה', date: '29.12.2021', short: 'טבקה', shortPrefix: 'הדיון הנוסף בעניין' },
  kassai:   { type: 'case', proc: 'רע"פ 3829/15', parties: 'קסאי נ\' מדינת ישראל', date: '20.12.2018', short: 'קסאי' },
  zaitsev:  { type: 'case', proc: 'רע"פ 3199/20', parties: 'זייצב נ\' מדינת ישראל', date: '12.8.2021', short: 'זייצב' },
  jabarin:  { type: 'case', proc: 'בג"ץ 5887/17', parties: 'ג\'בארין נ\' משטרת ישראל', date: '25.7.2017', short: 'ג\'בארין' },
  acri244:  { type: 'case', proc: 'בג"ץ 244/23', parties: 'האגודה לזכויות האזרח בישראל נ\' משטרת ישראל', date: '14.12.2025', short: 'האגודה לזכויות האזרח' },
  q8987:    { type: 'case', proc: 'בג"ץ 8987/22', parties: 'התנועה למען איכות השלטון בישראל נ\' הכנסת', date: '2.1.2025', short: 'התנועה למען איכות השלטון' },
  fadida:   { type: 'case', proc: 'בג"ץ 5078/20', parties: 'פדידה נ\' משטרת ישראל – מפקד מחוז ירושלים', date: '19.8.2020', short: 'פדידה' },
  h7839:    { type: 'case', proc: 'בג"ץ 7839/19', parties: 'פלוני נ\' משטרת ישראל', date: '19.10.2020', short: 'פלוני' },
  friedman: { type: 'case', proc: 'בג"ץ 4475/17', parties: 'פרידמן נ\' משטרת ישראל', date: '17.2.2019', short: 'פרידמן' },
  peretz:   { type: 'case', proc: 'ע"פ 6328/12', parties: 'מדינת ישראל נ\' פרץ', date: '10.9.2013', short: 'פרץ' },
  diab:     { type: 'case', proc: 'בג"ץ 1386/22', parties: 'דיאב נ\' מפכ"ל משטרת ישראל', date: '7.11.2022', short: 'דיאב' },
  abbas:    { type: 'case', proc: 'בג"ץ 5442/23', parties: 'עבאס נ\' מפכ"ל משטרת ישראל', date: '20.7.2023', short: 'עבאס' },
  plonim:   { type: 'case', proc: 'ע"א 2394/18', parties: 'פלונים נ\' משטרת ישראל', date: '10.4.2019', short: 'פלונים' },
  bilal:    { type: 'case', proc: 'ע"פ 2165/23', parties: 'מדינת ישראל נ\' בלאל', date: '4.5.2023', short: 'בלאל' },
  kadura:   { type: 'case', proc: 'ע"פ 2482/22', parties: 'מדינת ישראל נ\' קדורה', date: '14.4.2022', short: 'קדורה' },
  sobah:    { type: 'case', proc: 'ע"פ 4406/19', parties: 'מדינת ישראל נ\' סובח', date: '5.11.2019', short: 'סובח' },
  osipov:   { type: 'case', proc: 'ת"פ (שלום חד\') 34366-04-24', parties: 'מדינת ישראל נ\' אוסיפוב', date: '6.3.2025', short: 'אוסיפוב' },

  // ---------- פסיקה זרה ----------
  hill:     { type: 'fcase', text: '_Hill v. Chief Constable of West Yorkshire_ [1989] AC 53 (HL)', short: '_Hill_' },
  kirkham:  { type: 'fcase', text: '_Kirkham v. Chief Constable of the Greater Manchester Police_ [1990] 2 WLR 987 (CA)', short: '_Kirkham_' },
  rigby:    { type: 'fcase', text: '_Rigby v. Chief Constable of Northamptonshire_ [1985] 1 WLR 1242 (QB)', short: '_Rigby_' },
  castle:   { type: 'fcase', text: '_Town of Castle Rock v. Gonzales_, 545 U.S. 748 (2005)', short: '_Castle Rock_' },
  cuffy:    { type: 'fcase', text: '_Cuffy v. City of New York_, 69 N.Y.2d 255 (1987)', short: '_Cuffy_' },
  white:    { type: 'fcase', text: '_White v. Beasley_, 453 Mich. 308 (1996)', short: '_White_' },
  brown:    { type: 'fcase', text: '_Brown v. Texas_, 443 U.S. 47 (1979)', short: '_Brown_' },
  mendenhall:{ type: 'fcase', text: '_United States v. Mendenhall_, 446 U.S. 544 (1980)', short: '_Mendenhall_' },
  miranda:  { type: 'fcase', text: '_Miranda v. Arizona_, 384 U.S. 436 (1966)', short: '_Miranda_' },

  // ---------- מקורות לועזיים שאוזכרו דרך מקור משני ----------
  roach:    { type: 'other', text: 'Kent Roach, _Models of Civilian Police Review: The Objectives and Mechanisms of Legal and Political Regulation of the Police_, 61 CRIM. L.Q. 29 (2014)', short: 'Roach' },

  // ---------- ספרים ----------
  gilad:    { type: 'book', author: 'ישראל גלעד', title: 'דיני נזיקין: גבולות האחריות', vol: 'כרך ב', year: '2012', short: 'גלעד' },
  barak:    { type: 'book', author: 'אהרן ברק', title: 'פרשנות במשפט', vol: 'כרך ג: פרשנות חוקתית', year: '1994', short: 'ברק' },
  barakerez:{ type: 'book', author: 'דפנה ברק-ארז', title: 'משפט מינהלי', vol: 'כרך א', year: '2010', short: 'ברק-ארז' },
  birnhak:  { type: 'book', author: 'מיכאל בירנהק', title: 'פרטיות חוקתית', year: '2023', short: 'בירנהק' },
  kitai:    { type: 'book', author: 'רינת קיטאי סנג\'רו', title: 'הזכות לאי-הפללה עצמית', year: '2026', short: 'קיטאי סנג\'רו' },
  forum:    { type: 'book', author: 'פורום המרצות והמרצים למשפטים למען הדמוקרטיה', title: 'שינויי המשטר בישראל 2023: אסופת ניירות עמדה', year: '2026', short: 'פורום המרצות והמרצים' },
  hardofbook:{ type: 'book', author: 'אסף הרדוף', title: 'סדר הדין הפלילי', vol: 'חלק א', year: '[שנה]', short: 'הרדוף **סדר הדין הפלילי**' },
  padan:    { type: 'article', author: 'ארז פדן', title: 'פרקליטות 3.0: הפרקליטות כפי שהייתה, כפי שהינה וכפי שצריכה להיות', journal: 'מעשי משפט', vol: 'יג', start: '411', year: '2022', short: 'פדן' },
  stern:    { type: 'book', needPage: true, author: 'שי שטרן', title: 'קהילות במשפט', year: '2026', short: 'שטרן' },
  shapira:  { type: 'book', needPage: true, author: 'רון שפירא, איתי ברסלר-גונן ואילנית הלל', title: 'הליכי מעצר: מורה נבוכים', year: '2025', short: 'שפירא, ברסלר-גונן והלל' },

  // ---------- מאמרים ----------
  segal:    { type: 'article', author: 'בעז סגל', title: 'נזיקין של רשויות במבט השוואתי: הפיצוי הנזיקי – מטרה או אמצעי?', journal: 'הפרקליט', vol: 'נו', start: '111', year: 'התשפ"ד', short: 'סגל' },
  dromi:    { type: 'article', author: 'שי דרומי', title: 'מה המחיר של החופש להפגין? ההגנה על זכות ההפגנה בדיני הנזיקין', journal: 'משפטים על אתר', vol: 'כ', start: '207', year: '2025', short: 'דרומי' },
  kadosh:   { type: 'article', author: 'רותם קדוש נוסבאום', title: 'פגיעה בזכויות אדם בשל שימוש משטרתי באמצעים טכנולוגיים למעקב ושיטור מנבא', journal: 'המשפט', vol: 'לא', start: '79', year: 'התשפ"ו', short: 'קדוש נוסבאום' },
  levenkron:{ type: 'article', author: 'נעמי לבנקרון', title: '\'אהיה אני המרטין לותר קינג של המשטרה\': איסור ההתארגנות על השוטרים בישראל והשפעתו על זכויותיהם כעובדים', journal: 'עבודה, חברה ומשפט', vol: 'טז', start: '27', year: '2020', short: 'לבנקרון' },
  sapir:    { type: 'article', author: 'יואב ספיר', title: 'שיח הזכויות, פופוליזם והתגובה לפשיעה בחברה הערבית: על הצורך בהגנה חוקתית משודרגת על זכויות בפלילים', journal: 'משפטים על אתר', vol: '[כרך]', start: '[עמוד]', year: '2022', short: 'ספיר' },
  podam:    { type: 'article', author: 'אפרת פודם, אסף דרעי ושיר טולדנו', title: 'אם לא תמחק יבוא שוטר: דמותו של השוטר בחברה בראי מגמת תביעות הדיבה מצד שוטרים', journal: 'מעשי משפט', vol: 'יד', start: '195', year: '2023', short: 'פודם, דרעי וטולדנו' },
  hardof23: { type: 'article', author: 'אסף הרדוף', title: 'זכות מפלה ופריווילגיות של מדינה: חיסיון לטובת הציבור ונסיגה לטובת התקפה', journal: 'מחקרי משפט', vol: '[כרך]', start: '[עמוד]', year: '2023', short: 'הרדוף "זכות מפלה ופריווילגיות של מדינה"' },

  // ---------- מאמרים בספרים ערוכים ----------
  hardof20: { type: 'chapter', author: 'אסף הרדוף', title: 'ויתור, הידברות, בג"ץ: שחרור חסמים בסדר הדין הפלילי, צמצום הכוח המנהלי והגברת הביקורת השיפוטית', book: 'ספר אליקים רובינשטיין', start: '1817', editors: 'מרים ביטון עורכת', year: '2020', short: 'הרדוף "ויתור, הידברות, בג"ץ"' },
  weisburd: { type: 'chapter', author: 'דיוויד וייסבורד וג\'ון א\' אק', title: 'מה יכולה המשטרה לעשות כדי להפחית פשיעה, אי-סדר ופחד מפשיעה?', book: 'עבריינות וסטייה חברתית: תאוריה ויישום', start: '[עמוד]', editors: '[עורכים]', year: '2022', short: 'וייסבורד ואק' },
  amitai:   { type: 'article', author: 'גילה אמיתי וענבל וילמובסקי', title: 'קרימינולוגיה ביקורתית: עוגנים תיאורטיים ויישום', journal: 'קרימינולוגיה ישראלית', vol: '[כרך]', start: '[עמוד]', year: '2022', short: 'אמיתי ווילמובסקי' },
  harmelin: { type: 'chapter', author: 'איתי הרמלין', title: 'אומרים הסכמה (לחיפוש) יש בעולם. מה זאת הסכמה?', book: '75 שנות עצמאות במשפט: שופטים מספרים על פסקי דין משבעים וחמש שנות שפיטה', start: '[עמוד]', editors: 'דפנה ברק-ארז עורכת ראשית', year: '2023', short: 'הרמלין' },

  // ---------- חקיקה זרה נוספת ----------
  cjpoa:    { type: 'law', text: '_Criminal Justice and Public Order Act 1994_, c. 33 (UK)', foreign: true },
  equality: { type: 'law', text: '_Equality Act 2010_, c. 15 (UK)', foreign: true },

  // ---------- פסיקה ישראלית נוספת ----------
  abuq:     { type: 'case', proc: 'בג"ץ 1504/20', parties: 'אבו אלקיעאן נ\' פרקליט המדינה', date: '20.10.2021', short: 'אבו אלקיעאן' },
  mashaich: { type: 'case', proc: 'רע"פ 2161/21', parties: 'משאיך נ\' מדינת ישראל', date: '18.7.2021', short: 'משאיך' },

  // ---------- דוחות ומסמכים רשמיים ----------
  // report: author **title** pin (publisher, year)
  mev18:    { type: 'report', author: 'מבקר המדינה', title: 'דוח ביקורת מיוחד: התמודדות משטרת ישראל עם החזקת אמצעי לחימה לא חוקיים ואירועי ירי ביישובי החברה הערבית וביישובים מעורבים', year: '2018', short: 'מבקר המדינה **דוח 2018**' },
  mev21:    { type: 'report', author: 'מבקר המדינה', title: 'ביקורת מעקב: התמודדות משטרת ישראל עם החזקת אמצעי לחימה לא חוקיים ואירועי ירי ביישובי החברה הערבית וביישובים מעורבים', year: '2021', short: 'מבקר המדינה **ביקורת מעקב 2021**' },
  ricOver:  { type: 'report', author: 'נורית יכימוביץ-כהן', title: 'סוגיות הקשורות לשיטור יתר ושימוש משטרתי בכוח כלפי קבוצות אוכלוסייה מסוימות', publisher: 'הכנסת, מרכז המחקר והמידע', year: '2025', short: 'יכימוביץ-כהן **שיטור יתר**' },
  ricYouth: { type: 'report', author: 'נורית יכימוביץ-כהן', title: 'פשיעה ועבריינות של צעירים ערבים: נתוני אכיפה', publisher: 'הכנסת, מרכז המחקר והמידע', year: '2025', short: 'יכימוביץ-כהן **צעירים ערבים**' },
  elran:    { type: 'report', author: 'מאיר אלרן, אפרים לביא, מני יצחקי ומוחמד ותד', title: 'המלצות למדיניות התמודדות לאומית עם האלימות והפשיעה בחברה הערבית בישראל', publisher: 'המכון למחקרי ביטחון לאומי', year: '2021', short: 'אלרן ואחרים' },

  // ---------- מאמרים בכתב העת העיקר במחקר ----------
  amonPol:  { type: 'article', author: 'משטרת ישראל, אגף התכנון והארגון', title: 'רפורמת אמו"ן במשטרת ישראל: מרעיון מסדר לשינוי עומק', journal: 'העיקר במחקר', vol: '', start: '11', year: '2017', short: 'משטרת ישראל "רפורמת אמו"ן"' },
  kaisi:    { type: 'article', author: 'יהודה קייסי', title: 'השיטור הקלאסי: הבסיס המחקרי לרפורמת אמו"ן במשטרת ישראל', journal: 'העיקר במחקר', vol: '', start: '13', year: '2017', short: 'קייסי' },
  prop18:   { type: 'article', author: 'דיויד וייסבורד, באדי חסייסי, יעל לטמנוביץ, תומר כרמל ושני תשובה', title: 'מחקר הערכת תכנית אמו"ן: דו"ח מספר 1, סל עבירות פע"ר', journal: 'העיקר במחקר', vol: '', start: '75', year: '2018', short: 'וייסבורד ואחרים "דו"ח מספר 1"' },
  prop20:   { type: 'article', author: 'דיויד וייסבורד, באדי חסייסי, יעל לטמנוביץ, תומר כרמל ושני תשובה', title: 'מחקר הערכת תכנית אמו"ן: סל עבירות פע"ר', journal: 'העיקר במחקר', vol: '', start: '167', year: '2020', short: 'וייסבורד ואחרים "סל עבירות פע"ר"' },
  exec:     { type: 'article', author: 'דייוויד ויסבורד, באדי חסייסי, יעל ליטמנוביץ, תומר כרמל ושני תשובה', title: 'מיסוד שיטור מוכוון בעיות: הערכה של רפורמת אמו"ן בישראל, תקציר מנהלים', journal: 'העיקר במחקר', vol: '', start: '152', year: '2020', short: 'ויסבורד ואחרים "מיסוד שיטור מוכוון בעיות"' },
  chatira:  { type: 'article', author: 'באדי חסייסי ויעל ליטמנוביץ', title: 'חתירה למגע אחר: שיטור החברה הערבית בישראל, נקודת המבט של מפקדי תחנות', journal: 'העיקר במחקר', vol: '', start: '119', year: '2017', short: 'חסייסי וליטמנוביץ' },
  attitudes:{ type: 'article', author: 'באדי חסייסי, טל יונתן-זמיר, דיויד וייסבורד, יעל ליטמנוביץ, טאינה טרכטנברג ועדי דוידוביץ\'', title: 'ניתוח עמדות הציבור כלפי המשטרה בחברה הישראלית: ההשפעה של הוגנות ההליכים, מאפייני הפרט ומאפייני התחנה', journal: 'העיקר במחקר', vol: '', start: '283', year: '2020', short: 'חסייסי ואחרים "עמדות הציבור"' },
  violence: { type: 'article', author: 'באדי חסייסי, יעל ליטמנוביץ, דיויד וייסבורד, שני תשובה וטאינה טרכטנברג', title: 'מחקר הערכת תכנית אמו"ן: עבירות אלימות', journal: 'העיקר במחקר', vol: '', start: '247', year: '2020', short: 'חסייסי ואחרים "עבירות אלימות"' },
  firearms: { type: 'article', author: 'יעל ליטמנוביץ, באדי חסייסי, דיויד וייסבורד ושני תשובה', title: 'מחקר הערכת תכנית אמו"ן: טיפול משטרת ישראל בעבירות ירי בחברה הערבית', journal: 'העיקר במחקר', vol: '', start: '226', year: '2020', short: 'ליטמנוביץ ואחרים' },

  // ---------- מקורות זרים: הסימן @ מציין את מקום ההפניה המדויקת ----------
  // sep: מה שקודם להפניה באזכור המלא (ברירת מחדל ", "). cat: flaw / flit.
  us4:      { type: 'other', cat: 'flaw', text: 'U.S. CONST. amend. IV', short: 'U.S. CONST. amend. IV' },
  s1983:    { type: 'other', cat: 'flaw', text: '42 U.S.C. § 1983', short: '42 U.S.C. § 1983' },
  s12601:   { type: 'other', cat: 'flaw', text: '34 U.S.C. § 12601', short: '34 U.S.C. § 12601' },
  pacecode: { type: 'other', cat: 'flaw', text: 'Home Office, Police and Criminal Evidence Act 1984 Code A: Revised Code of Practice for the Exercise by Police Officers of Statutory Powers of Stop and Search@ (2023)', sep: ', para. ', short: 'PACE Code A', sp: 'בפס\' ' },
  terry:    { type: 'fcase', text: '_Terry v. Ohio_, 392 U.S. 1@ (1968)', short: '_Terry_' },
  whren:    { type: 'fcase', text: '_Whren v. United States_, 517 U.S. 806@ (1996)', short: '_Whren_' },
  wardlow:  { type: 'fcase', text: '_Illinois v. Wardlow_, 528 U.S. 119@ (2000)', short: '_Wardlow_' },
  armstrong:{ type: 'fcase', text: '_United States v. Armstrong_, 517 U.S. 456@ (1996)', short: '_Armstrong_' },
  monell:   { type: 'fcase', text: '_Monell v. Department of Social Services_, 436 U.S. 658@ (1978)', short: '_Monell_' },
  deshaney: { type: 'fcase', text: '_DeShaney v. Winnebago County Department of Social Services_, 489 U.S. 189@ (1989)', short: '_DeShaney_' },
  roberts:  { type: 'fcase', text: '_R (Roberts) v. Commissioner of Police of the Metropolis_ [2015] UKSC 79@', short: '_Roberts_' },
  michael:  { type: 'fcase', text: '_Michael v. Chief Constable of South Wales Police_ [2015] UKSC 2@', short: '_Michael_' },
  dsd:      { type: 'fcase', text: '_Commissioner of Police of the Metropolis v. DSD_ [2018] UKSC 11@', short: '_DSD_' },
  goldstein:{ type: 'other', text: 'Herman Goldstein, _Improving Policing: A Problem-Oriented Approach_, 25 CRIME & DELINQ. 236@ (1979)', short: 'Goldstein' },
  eck:      { type: 'other', text: 'John E. Eck & William Spelman, Problem-Solving: Problem-Oriented Policing in Newport News@ (1987)', sep: ' ', short: 'Eck & Spelman' },
  hinkle:   { type: 'other', text: 'Joshua C. Hinkle, David Weisburd, Cody W. Telep & Kevin Petersen, _Problem-Oriented Policing for Reducing Crime and Disorder: An Updated Systematic Review and Meta-Analysis_, 16 CAMPBELL SYSTEMATIC REVS. e1089@ (2020)', short: 'Hinkle et al.' },
  braga12:  { type: 'other', text: 'Anthony A. Braga, Andrew V. Papachristos & David M. Hureau, _Hot Spots Policing Effects on Crime_, 8 CAMPBELL SYSTEMATIC REVS. 1@ (2012)', short: 'Braga, Papachristos & Hureau' },
  braga19:  { type: 'other', text: 'Anthony A. Braga, David Weisburd & Brandon Turchan, _Focused Deterrence Strategies Effects on Crime: A Systematic Review_, 15 CAMPBELL SYSTEMATIC REVS. e1051@ (2019)', short: 'Braga, Weisburd & Turchan' },
  gaffney:  { type: 'other', text: 'Hannah Gaffney, Darrick Jolliffe & Howard White, Hot Spot Policing: Toolkit Technical Report@ (2022)', sep: ' ', short: 'Gaffney, Jolliffe & White' },
  nas:      { type: 'other', text: 'Proactive Policing: Effects on Crime and Communities@ (David Weisburd & Malay K. Majmundar eds., 2018)', sep: ' ', short: 'Proactive Policing' },
  scott:    { type: 'other', text: 'Michael S. Scott, Focused Deterrence of High-Risk Individuals@ (Problem-Oriented Guides for Police, Response Guide Series No. 13, 2017)', sep: ' ', short: 'Scott' },
  gvi:      { type: 'other', text: 'National Network for Safe Communities, Group Violence Intervention: An Implementation Guide@ (2015)', sep: ' ', short: 'Group Violence Intervention' },
  natapoff: { type: 'other', text: 'Alexandra Natapoff, _Underenforcement_, 75 FORDHAM L. REV. 1715@ (2006)', short: 'Natapoff' },
  bell:     { type: 'other', text: 'Monica C. Bell, _Police Reform and the Dismantling of Legal Estrangement_, 126 YALE L.J. 2054@ (2017)', short: 'Bell' },
  sunshine: { type: 'other', text: 'Jason Sunshine & Tom R. Tyler, _The Role of Procedural Justice and Legitimacy in Shaping Public Support for Policing_, 37 LAW & SOC\'Y REV. 513@ (2003)', short: 'Sunshine & Tyler' },
  tgm:      { type: 'other', text: 'Tom R. Tyler, Phillip Atiba Goff & Robert J. MacCoun, _The Impact of Psychological Science on Policing in the United States: Procedural Justice, Legitimacy, and Effective Law Enforcement_, 16 PSYCHOL. SCI. PUB. INT. 75@ (2015)', short: 'Tyler, Goff & MacCoun' },
  skogan:   { type: 'other', text: 'Wesley G. Skogan, _Asymmetry in the Impact of Encounters with Police_, 16 POLICING & SOC\'Y 99@ (2006)', short: 'Skogan' },
  desmond:  { type: 'other', text: 'Matthew Desmond, Andrew V. Papachristos & David S. Kirk, _Police Violence and Citizen Crime Reporting in the Black Community_, 81 AM. SOCIO. REV. 857@ (2016)', short: 'Desmond, Papachristos & Kirk' },
  hasisi08: { type: 'other', text: 'Badi Hasisi, _Police, Politics, and Culture in a Deeply Divided Society_, 98 J. CRIM. L. & CRIMINOLOGY 1119@ (2008)', short: 'Hasisi' },
  hasisiw:  { type: 'other', text: 'Badi Hasisi & Ronald Weitzer, _Police Relations with Arabs and Jews in Israel_, 47 BRIT. J. CRIMINOLOGY 728@ (2007)', short: 'Hasisi & Weitzer' },
  jzp:      { type: 'other', text: 'Tal Jonathan-Zamir & Gali Perry, _A Landmark in the Study of Proactive Policing: Commentary on Proactive Policing: Effects on Crime and Communities_, 24 JERUSALEM REV. LEGAL STUD. 1@ (2021)', short: 'Jonathan-Zamir & Perry' },
  taskforce:{ type: 'other', text: 'President\'s Task Force on 21st Century Policing, Final Report@ (2015)', sep: ' ', short: 'Final Report' },
  ferguson: { type: 'other', text: 'U.S. Department of Justice, Civil Rights Division, Investigation of the Ferguson Police Department@ (2015)', sep: ' ', short: 'Ferguson Report' },
  floyd:    { type: 'other', text: 'Statement of Interest of the United States@, _Floyd v. City of New York_, No. 08-cv-01034 (S.D.N.Y. June 12, 2013)', sep: ' at ', short: 'Statement of Interest' },
  macpherson:{ type: 'other', text: 'The Stephen Lawrence Inquiry: Report of an Inquiry by Sir William Macpherson of Cluny, Cm 4262-I@ (1999)', short: 'Macpherson Report' },
  hmic:     { type: 'other', text: 'HM Inspectorate of Constabulary and Fire & Rescue Services, Disproportionate Use of Police Powers: A Spotlight on Stop and Search and the Use of Force@ (2021)', sep: ' ', short: 'HMICFRS' },
  dawson:   { type: 'other', text: 'Paul Dawson, Anthony DuGuay, Ryan Flanagan & Abigail McNeill, Investigating Disproportionality in Stop and Search in London@ (2026)', sep: ' ', short: 'Dawson et al.' },
  lammy:    { type: 'other', text: 'David Lammy, The Lammy Review: An Independent Review into the Treatment of, and Outcomes for, Black, Asian and Minority Ethnic Individuals in the Criminal Justice System@ (2017)', sep: ' ', short: 'Lammy Review' },
};

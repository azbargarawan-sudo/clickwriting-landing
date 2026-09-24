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
  padan:    { type: 'book', needPage: true, author: 'ארז פדן', title: 'פרקליטות 3.0: הפרקליטות כפי שהייתה, כפי שהינה וכפי שצריכה להיות', year: '2022', short: 'פדן' },
  stern:    { type: 'book', needPage: true, author: 'שי שטרן', title: 'קהילות במשפט', year: '2026', short: 'שטרן' },
  shapira:  { type: 'book', needPage: true, author: 'רון שפירא, איתי ברסלר-גונן ואילנית הלל', title: 'הליכי מעצר: מורה נבוכים', year: '2025', short: 'שפירא, ברסלר-גונן והלל' },

  // ---------- מאמרים ----------
  segal:    { type: 'article', author: 'בעז סגל', title: 'נזיקין של רשויות במבט השוואתי: הפיצוי הנזיקי – מטרה או אמצעי?', journal: 'הפרקליט', vol: 'נו', start: '111', year: 'התשפ"ד', short: 'סגל' },
  dromi:    { type: 'article', author: 'שי דרומי', title: 'מה המחיר של החופש להפגין? ההגנה על זכות ההפגנה בדיני הנזיקין', journal: 'משפטים על אתר', vol: 'כ', start: '207', year: '2025', short: 'דרומי' },
  kadosh:   { type: 'article', author: 'רותם קדוש נוסבאום', title: 'פגיעה בזכויות אדם בשל שימוש משטרתי באמצעים טכנולוגיים למעקב ושיטור מנבא', journal: 'המשפט', vol: 'לא', start: '79', year: 'התשפ"ו', short: 'קדוש נוסבאום' },
  levenkron:{ type: 'article', author: 'נעמי לבנקרון', title: '\'אהיה אני המרטין לותר קינג של המשטרה\': איסור ההתארגנות על השוטרים בישראל והשפעתו על זכויותיהם כעובדים', journal: 'עבודה, חברה ומשפט', vol: 'טז', start: '27', year: '2020', short: 'לבנקרון' },
  sapir:    { type: 'article', author: 'יואב ספיר', title: 'שיח הזכויות, פופוליזם והתגובה לפשיעה בחברה הערבית: על הצורך בהגנה חוקתית משודרגת על זכויות בפלילים', journal: 'משפטים על אתר', vol: '[כרך]', start: '[עמוד]', year: '2025', short: 'ספיר' },
  podam:    { type: 'article', author: 'אפרת פודם, אסף דרעי ושיר טולדנו', title: 'אם לא תמחק יבוא שוטר: דמותו של השוטר בחברה בראי מגמת תביעות הדיבה מצד שוטרים', journal: 'מעשי משפט', vol: '[כרך]', start: '[עמוד]', year: '2023', short: 'פודם, דרעי וטולדנו' },
  hardof23: { type: 'article', author: 'אסף הרדוף', title: 'זכות מפלה ופריווילגיות של מדינה: חיסיון לטובת הציבור ונסיגה לטובת התקפה', journal: 'מחקרי משפט', vol: '[כרך]', start: '[עמוד]', year: '2023', short: 'הרדוף "זכות מפלה ופריווילגיות של מדינה"' },

  // ---------- מאמרים בספרים ערוכים ----------
  hardof20: { type: 'chapter', author: 'אסף הרדוף', title: 'ויתור, הידברות, בג"ץ: שחרור חסמים בסדר הדין הפלילי, צמצום הכוח המנהלי והגברת הביקורת השיפוטית', book: 'ספר אליקים רובינשטיין', start: '1817', editors: 'מרים ביטון עורכת', year: '2020', short: 'הרדוף "ויתור, הידברות, בג"ץ"' },
  weisburd: { type: 'chapter', author: 'דיוויד וייסבורד וג\'ון א\' אק', title: 'מה יכולה המשטרה לעשות כדי להפחית פשיעה, אי-סדר ופחד מפשיעה?', book: 'עבריינות וסטייה חברתית: תאוריה ויישום', start: '[עמוד]', editors: '[עורכים]', year: '2022', short: 'וייסבורד ואק' },
  amitai:   { type: 'chapter', author: 'גילה אמיתי וענבל וילמובסקי', title: 'קרימינולוגיה ביקורתית: עוגנים תיאורטיים ויישום', book: 'קרימינולוגיה ישראלית', start: '[עמוד]', editors: '[עורכים]', year: '2022', short: 'אמיתי ווילמובסקי' },
  harmelin: { type: 'chapter', author: 'איתי הרמלין', title: 'אומרים הסכמה (לחיפוש) יש בעולם. מה זאת הסכמה?', book: '75 שנות עצמאות במשפט', start: '[עמוד]', editors: '[עורכים]', year: '2023', short: 'הרמלין' },
};

#!/usr/bin/env python3
"""Fill the college's official project template with the mammography project.

Works on the unpacked template in tpl/: replaces the body of each placeholder
with continuous prose, adds the interviewee table and the theme map, and repacks.
"""
import os
import re
import shutil
import zipfile

W = os.path.dirname(os.path.abspath(__file__))
TPL = os.path.join(W, 'tpl')   # unpack template-original.pptx here first
EMU = 914400

INK = None                 # inherit from the template
EMPH = '1F3864'            # dark blue, inside the Office palette the template uses
MUTE = '44546A'            # theme dk2

BODY = 2200                # prose size, fills the placeholder without overflowing
LEAD = 2000


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def run(text, sz=BODY, b=False, i=False, color=None):
    rpr = f'<a:rPr lang="he-IL" sz="{sz}"'
    if b:
        rpr += ' b="1"'
    if i:
        rpr += ' i="1"'
    rpr += ' dirty="0">'
    if color:
        rpr += f'<a:solidFill><a:srgbClr val="{color}"/></a:solidFill>'
    rpr += '<a:cs typeface="+mn-cs"/></a:rPr>'
    return f'<a:r>{rpr}<a:t>{esc(text)}</a:t></a:r>'


def para(runs, algn='just', space_before=600):
    ppr = (f'<a:pPr marL="0" indent="0" algn="{algn}" rtl="1">'
           f'<a:lnSpc><a:spcPct val="100000"/></a:lnSpc>'
           f'<a:spcBef><a:spcPts val="{space_before}"/></a:spcBef>'
           f'<a:buNone/></a:pPr>')
    return f'<a:p>{ppr}{"".join(runs)}</a:p>'


def txbody(paras, autofit=True):
    bp = '<a:bodyPr><a:normAutofit/></a:bodyPr>' if autofit else '<a:bodyPr/>'
    return f'<p:txBody>{bp}<a:lstStyle/>{"".join(paras)}</p:txBody>'


# --- prose helper: a paragraph built from (text, style) segments -------------
def prose(segments, sz=BODY, algn='just', space_before=600):
    runs = []
    for seg in segments:
        if isinstance(seg, str):
            runs.append(run(seg, sz=sz))
        else:
            text, style = seg
            runs.append(run(text, sz=sz,
                            b='b' in style, i='i' in style,
                            color=EMPH if ('b' in style or 'i' in style) else None))
    return para(runs, algn=algn, space_before=space_before)


# ---------------------------------------------------------------- slide text
S = {}

S[2] = [prose([
    'סרטן השד הוא הגידול הממאיר השכיח ביותר בקרב נשים בישראל, ובהיעדר אמצעי ודאי למניעה ראשונית '
    'נשען המאבק בו על גילוי מוקדם. בדיקת הממוגרפיה ניתנת בישראל ללא תשלום במסגרת סל הבריאות '
    'לנשים בגילאי 50 עד 74 אחת לשנתיים, כלומר החסם הכלכלי הוסר זה מכבר. ואף על פי כן, נתוני '
    'הסקר החברתי משנת 2017 מלמדים כי בגילאים אלה ביצעו ממוגרפיה ',
    ('78.2 אחוזים מן הנשים היהודיות לעומת 64.8 אחוזים מן הנשים הערביות', 'b'),
    ', ובקרב האחרונות המחלה מאובחנת לעיתים קרובות יותר בשלב מתקדם. הפער חריף במיוחד בנגב, שבו '
    'חציון גיל האבחון בקרב נשים בדואיות עומד על כ-48 שנים לעומת כ-62 בקרב נשים יהודיות, כך '
    'שחלק ניכר מן התחלואה מתרחש מתחת לגיל שבו תוכנית הסקר מזמנת נשים כלל. ',
    ('הבעיה הניהולית הנגזרת מכאן אינה בעיה של זמינות השירות אלא של ההגעה אליו', 'b'),
    ', ולכן אי אפשר לפתור אותה בהרחבת סל השירותים בלבד.',
])]

S[3] = [prose([
    'שאלת המחקר שהנחתה את הפרויקט היא ',
    ('אילו גורמים מעכבים ומקדמים את היענותן של נשים בחברה הערבית בישראל לבדיקות ממוגרפיה, '
     'וכיצד ניתן להגביר אותה', 'b'),
    '. השאלה נוסחה כשאלה פתוחה ולא כהשערה, משום שהמחקר איכותני ומטרתו לתאר מנגנון ולא לאמוד '
    'את שכיחותו. ממנה נגזרות שלוש מטרות. הראשונה היא לזהות את החסמים ואת המאיצים כפי שהנשים '
    'עצמן מנסחות אותם, ולא כפי שהם מסווגים בספרות. השנייה היא לבחון כיצד הגורמים פועלים זה על '
    'זה, מתוך ההנחה שאישה אינה חווה רשימה של חסמים נפרדים אלא מכשול אחד מורכב. השלישית היא '
    'לגזור מן הממצאים המלצות יישומיות לקופות החולים ולמשרד הבריאות, שכן פרויקט הגמר הוא מסמך '
    'ניהולי ולא מחקרי בלבד. הבחירה לראיין נשים ולא רק אנשי מקצוע נובעת מן העמדה ש',
    ('ההחלטה שלא ללכת לבדיקה היא החלטה בעלת היגיון פנימי', 'b'),
    ', גם כשהיא נראית מבחוץ כהזנחה.',
])]

S[4] = [prose([
    'הספרות מצביעה בעקביות על שלוש משפחות של חסמים. במישור התרבותי והרגשי חוזרים הבושה '
    'והמבוכה מחשיפת הגוף, החשש מפני רכילות ותיוג חברתי, החשש לפגוע במעמד המשפחה ובסיכויי '
    'הנישואין של בנותיה, והפחד מן המחלה ומתוצאות הבדיקה (Cohen & Azaiza, 2006). במישור האמוני '
    'מתועדות תפיסות פטליסטיות הרואות במחלה גורל שאין לשנותו, והן נמצאו כמנבאות מובהקות של '
    'אי-היענות (Azaiza et al., 2010). במישור המבני והמערכתי מזוהים מרחק ותלות בהסעה, היעדר '
    'בודקת אישה, פערי שפה וזימונים שאינם מגיעים או שאינם מובנים (מורן ואבו עבייד, 2018). מנגד, '
    'מחקרים עדכניים מלמדים כי ',
    ('הפערים בתמותה בין הקבוצות מצטמצמים כמעט לחלוטין לאחר תקנון למשתנים חברתיים-כלכליים', 'b'),
    ', ממצא הממקם את שורש הבעיה, וממילא את הפתרון, בתחום המדיניות הציבורית ולא בתחום הביולוגי '
    'או התרבותי הבלתי ניתן לשינוי (Pinchas-Mizrachi & Bouhnik, 2024).',
])]

S[5] = [prose([
    'לצד החסמים מזהה הספרות גורמים מאיצים, ובראשם ',
    ('המלצה אקטיבית של איש מקצוע רפואי', 'b'),
    ', שנמצאה כמנבא המובהק והעקבי ביותר לביצוע הבדיקה, לצד זימון יזום ממוחשב, מכתבי הזמנה '
    'ותזכורות (Freund et al., 2019). התערבויות מותאמות-תרבות, המועברות בשפת הנשים ובאמצעות '
    'דמויות מפתח מן הקהילה ובהן נשים שהחלימו מן המחלה, נמצאו יעילות יותר מקמפיינים חינוכיים '
    'כלליים (Cohen & Azaiza, 2008), וכלים לוגיסטיים כמו ניידת ממוגרפיה הוכיחו יכולת לצמצם '
    'פערים באופן ממשי. מה שנותר פתוח הוא ',
    ('הפער שבין ידע להתנהגות', 'b'),
    ': רוב הנשים הערביות מעל גיל חמישים כבר עברו ממוגרפיה לפחות פעם אחת, ובכל זאת ההיענות ללוח '
    'הזמנים המומלץ נותרת נמוכה (Cohen & Azaiza, 2006). מאחר שרוב המחקרים בתחום כמותיים, הם '
    'מתעדים את שכיחות החסמים אך אינם מתארים כיצד הם פועלים בחיי היומיום, וזהו החלל שהפרויקט '
    'הנוכחי מבקש למלא.',
])]

S[6] = [prose([
    'המסגרת המרכזית בתחום היא מודל האמונות הבריאותיות, המסביר התנהגות מונעת באמצעות תפיסת '
    'הפגיעוּת האישית, תפיסת חומרת המחלה, התועלות הנתפסות מן הבדיקה והחסמים הנתפסים בפניה, לצד '
    'רמזים לפעולה ותחושת מסוגלות (סטרן, 2007). לצידו משמשים מודל שלבי השינוי, המתאים התערבות '
    'לשלב שבו נמצאת האישה, ותיאוריית הפעולה המנומקת, הרואה בכוונה ההתנהגותית תוצר של עמדות '
    'אישיות ושל נורמות חברתיות נתפסות, שנמצאו משמעותיות במיוחד בקרב נשים ערביות מוסלמיות '
    'בישראל (Soskolne et al., 2007). מגבלתם המשותפת היא שפותחו בהקשר מערבי-אינדיבידואליסטי '
    'ואינם לוכדים במלואם משתנים כמו בושה, מבנה משפחה מורחבת ותפיסות דתיות. לפיכך אומצה כאן גם ',
    ('הגישה הסוציו-אקולוגית', 'b'),
    ', הבוחנת את ההתנהגות בארבע רמות המשפיעות זו על זו, האישית, הבין-אישית, הקהילתית '
    'והמערכתית, ומדגישה כי התערבות ברמה אחת בלבד אינה מספיקה (Alatawneh et al., 2024). המודל '
    'שגובש בפרויקט נגזר מגישה זו ומוצג בפרק הממצאים.',
])]

S[7] = [prose([
    'המחקר איכותני ומבוסס על ראיונות עומק חצי מובנים. הבחירה בשיטה נגזרת מאופייה של שאלת '
    'המחקר, שכן חסמים כמו בושה, פחד מלדעת ותפיסות של גורל אינם מתנסחים בקלות בסולם ליקרט והם '
    'עולים לרוב באמצע סיפור על משהו אחר. אוכלוסיית המחקר היא נשים בגיל הרלוונטי לבדיקה או '
    'בסמוך לו, ובמדגם נכללו ',
    ('שתים עשרה נשים בגילאי 44 עד 66', 'b'),
    ' שנבחרו בדגימה מכוונת ובשיטת כדור השלג. המדגם נבנה מתוך הקפדה על שונוּת פנימית, ולכן הוא '
    'כולל נשים מוסלמיות, נוצרייה, דרוזית ובדואיות מיישובים ערביים, מערים מעורבות ומן הנגב, '
    'ברמות השכלה הנעות משמונה שנות לימוד ועד תואר אקדמי, ולצידן אישה יוצאת אתיופיה שנכללה כדי '
    'לאפשר הבחנה בין חסם תרבותי לחסם של שפה ונגישות. כלי המחקר הוא מדריך ראיון בן שש עשרה '
    'שאלות קבועות, והנתונים נאספו בהקלטה ובתמלול מלא של כל ראיון.',
])]

S[8] = [prose([
    'המדגם נבנה כך שיכסה את מלוא הטווח של התנהגות ההיבדקות, מנשים הנבדקות בקביעות ועד נשים '
    'שמעולם לא נבדקו.',
], sz=LEAD, space_before=0)]

S[9] = [prose([
    'מדריך הראיון כולל שש עשרה שאלות פתוחות ובהן שאלת פתיחה כללית שנועדה ליצור היכרות לפני '
    'המעבר לנושא הרגיש, והוא הועבר בנוסח זהה ובסדר זהה בכל שנים עשר הראיונות. השאלות נבנו על '
    'בסיס הממדים שעלו מסקירת הספרות, כך שכל אשכול מכוון לתחום מוכר של חסמים או מאיצים: שאלות '
    'הפתיחה עוסקות בידע ובחוויית הבדיקה בפועל, שאלות האמצע בפחד, בצניעות, במגדר הבודק ובתיוג '
    'החברתי, ולאחריהן שאלות על המשפחה המורחבת, על הממד הדתי, על ההתנהלות מול הקופה ועל המלצת '
    'איש המקצוע. שתי שאלות נוסחו מחדש לאחר ראיון הפיילוט משום שנמצאו מכוונות מדי לתשובה '
    'שלילית. הראיונות נמשכו בין 32 ל-45 דקות, שישה נערכו בעברית, חמישה בערבית ואחד באמהרית, '
    'וכל אחת משלוש חברות הצוות ערכה ארבעה ראיונות. הניתוח נעשה ב',
    ('שיטת הניתוח התמטי בחמישה שלבים', 'b'),
    ', מקריאה חוזרת ללא סימון ועד בחירת ציטוטים תומכים, לרבות ציטוטים הסותרים את התמה. כל '
    'המשתתפות נתנו הסכמה מדעת בעל פה, השמות בדויים וכל פרט מזהה טושטש.',
])]

S[10] = [prose([
    'ארבע התמות אינן רשימה של חסמים נפרדים אלא מערכת אחת, וההיענות בפועל היא תוצר של המאזן '
    'ביניהן.',
], sz=LEAD, space_before=0)]

S[11] = [prose([
    'התמה הראשונה מלמדת כי ',
    ('הידע כמעט אינו מבחין בין נשים שנבדקות לבין נשים שאינן נבדקות', 'b'),
    '. אחת עשרה מתוך שתים עשרה המשתתפות, ובהן גם אלו שמעולם לא נבדקו, ידעו מהי הבדיקה ולשם מה '
    'היא נועדה, ולילה בת ה-54 ניסחה זאת בעצמה: ',
    ('"אני יודעת בדיוק מה צריך לעשות. ובכל זאת עברו שנתיים"', 'i'),
    '. מה שעמד בין הידע לפעולה היה הפחד מן התוצאה ולא מן הבדיקה, ומראם בת ה-52 הבחינה ביניהם '
    'במפורש: ',
    ('"אני לא מפחדת מהמכונה. אני מפחדת מהנייר"', 'i'),
    '. לצידם פעלו האמונה שגוף שאינו כואב אינו זקוק לבדיקה, ומנגנון של דחייה מוצדקת שאינו מגיע '
    'לעולם לנקודת הכרעה. התמה השנייה מראה כי חסם הבושה קיים אך ממוקם אחרת מכפי שמניחה הספרות. '
    'החשיפה בחדר הבדיקה מול בודקת אישה תוארה כרגע קצר, ואילו מה שהרתיע היה החשיפה החברתית '
    'בדרך אל הבדיקה, כפי שתיארה עאליה בת ה-47: ',
    ('"הבדיקה של האמא הופכת לתיק של הבת"', 'i'),
    '.',
])]

S[12] = [prose([
    'התמה השלישית היא הממצא שהפתיע ביותר, משום שהוא כמעט אינו מקבל מקום בספרות התרבותית. '
    'המשתתפות תיארו את היציאה לבדיקה כחשבון יומיומי מדויק של שעות עבודה שאבדו, של הסעה ושל נטל '
    'טיפולי בבית, וטגאיה בת ה-58 העמידה את שני הצדדים זה מול זה: ',
    ('"אני יודעת שזה נשמע קטן ליד סרטן. אבל בסוף החודש זה לא קטן"', 'i'),
    '. מאפיין מרכזי של החסם הזה הוא ש',
    ('הנשים אינן מציגות אותו כחסם אלא כעובדת חיים', 'b'),
    ', ולכן הוא אינו נראה במדדים המבוססים על דיווח עצמי. התמה הרביעית עוסקת כולה במאיצים '
    'ומצביעה על פנייה אישית כגורם החזק ביותר. אותה המלצה עצמה הניבה שתי תוצאות הפוכות בהתאם '
    'לאופן מסירתה, ולילה תיארה את הגרסה שלא פעלה: ',
    ('"לא הרים את הראש. אמר את זה למסך"', 'i'),
    '. לצידה נמצא כי כל המשתתפות הנבדקות בקביעות תיארו דמות מלווה, ואף אחת מן הנשים שלא נבדקו '
    'לא תיארה דמות כזאת.',
])]

S[13] = [prose([
    ('ההיענות אינה נקבעת ברמת הידע אלא ברמת ההתנהלות היומיומית', 'b'),
    '. ההבדל בין אישה הנבדקת בקביעות לבין אישה שמעולם לא נבדקה לא עבר בשאלה מה היא יודעת, אלא '
    'בשלוש שאלות אחרות: אם מישהו פנה אליה אישית, אם היה מי שליווה אותה, ואם היציאה לבדיקה עלתה '
    'לה במחיר שהיא יכולה לשלם. מכאן שתי מסקנות בעלות משמעות ניהולית. הראשונה היא שהחסם התרבותי '
    'אמיתי אך ממוקם בדרך אל הבדיקה ולא בחדר הבדיקה, כלומר בחשיפה החברתית ולא בחשיפה הגופנית, '
    'ולכן התאמה מגדרית של השירות הכרחית אך אינה מספיקה בלי מענה לצורך בדיסקרטיות. השנייה היא '
    'שקיים חסם מעשי שאינו מדובר, המחיר של יום עבודה ושל היעדרות מן הבית, והוא אינו מופיע '
    'בשאלונים מפני שאינו נחווה כחסם אלא כסדר עדיפויות סביר.',
])]

S[14] = [prose([
    'מול הספרות, הממצאים מאשרים את קיומם של החסמים המוכרים אך משנים את מיקומם ואת משקלם. '
    'הטענה שהידע הוא תנאי הכרחי שאינו מספיק (Alatawneh et al., 2024) מקבלת כאן חיזוק ואף '
    'מוקצנת, שכן אצל חלק מן המשתתפות הידע פעל לטובת ההימנעות ולא נגדה. הממצא בדבר מרכזיות '
    'המלצת איש המקצוע (Freund et al., 2019) אושר במלואו, אך הראיונות מחדדים שלא תוכן ההמלצה '
    'הוא המכריע אלא צורתה. הממצא המפתיע ביותר נוגע לממד הדתי: הספרות מייחסת לפטליזם משקל ניכר '
    '(Azaiza et al., 2010), ואילו כאן ',
    ('אף מרואיינת לא נימקה את הימנעותה בטעם דתי', 'b'),
    ', ונשים אמרו שהכול בידי שמיים וגם נבדקו בקביעות בלי לראות בכך סתירה. סועאד בת ה-61 ניסחה '
    'זאת כך: ',
    ('"אני לא הולכת לבדיקה במקום אללה, חלילה, אני הולכת בגלל אללה"', 'i'),
    '. אם הניסוח הדתי משמש לעיתים כהסבר שנוח למסור לחוקר, הרי שהשקעה בשינוי תפיסות פטליסטיות '
    'עשויה להיות פחות יעילה מהסרת חסמים מעשיים.',
])]

S[15] = [prose([
    'ההמלצות נגזרות ישירות מדברי המשתתפות, ומשותף לכולן שהן אינן מנסות לשנות את אמונותיהן של '
    'הנשים אלא ',
    ('להסיר את מה שעומד בין האמונה למעשה', 'b'),
    '. ברמת המרפאה, ובעלות נמוכה יחסית, מומלץ להעמיד רכזת זימונים דוברת ערבית שתפקידה לטלפן '
    'ולא לשלוח מכתבים, ולמדוד את שיעור ההמרה משיחה לתור בפועל; להוסיף למערכת הממוחשבת התראה '
    'לרופא המשפחה בפתיחת כל ביקור של אישה בגיל הזכאות שאיחרה בבדיקה, כך שההמלצה תינתן במפגש '
    'הקליני ולא תישאר תלויה ביוזמת האישה; ולפרוס תורים בשעות אחר הצהריים ובימי שישי לצד אישור '
    'היעדרות מעבודה. ברמת הקופה ומשרד הבריאות מומלץ להפעיל את ניידת הממוגרפיה בלוח שנתי קבוע '
    'ובמיקום דיסקרטי ולא בחזית המרפאה, להכשיר נשים מקומיות שנבדקו להנחיית מפגשים ביתיים קטנים '
    'במקום הרצאות פומביות, ולבחון הרחבה של הזימון היזום לנשים בנות 45 עד 49 בקהילות שבהן '
    'חציון גיל האבחון צעיר.',
])]

S[16] = [prose([
    'למחקר ארבע מגבלות עיקריות. ראשית, המדגם קטן ומכוון, ולכן אין להסיק ממנו על שכיחותם של '
    'החסמים באוכלוסייה אלא רק על הצורות שהם לובשים. שנית, הדגימה בשיטת כדור השלג יצרה הטיה '
    'אפשרית לטובת נשים המוכנות לדבר על הנושא, וייתכן שנשים שהימנעותן עמוקה יותר כלל לא הסכימו '
    'להתראיין. שלישית, שישה ראיונות נערכו בערבית ובאמהרית ותורגמו לעברית, וכל תרגום כרוך '
    'באובדן של גוון. רביעית, שלוש המראיינות הן סטודנטיות למנהל מערכות בריאות, וייתכן שעצם '
    'הזיהוי הזה עודד את המרואיינות להציג עמדה חיובית יותר כלפי הבדיקה מזו שהן מחזיקות. מכאן '
    'שלושה כיווני המשך: בחינה כמותית של משקל החסם היומיומי לצד החסמים התרבותיים, מחקר השוואתי '
    'בין יישובים שבהם פעלה ניידת ממוגרפיה לבין יישובים דומים שבהם לא פעלה, ובחינת ההיענות '
    'בקרב נשים מתחת לגיל חמישים בקהילות שבהן חציון גיל האבחון צעיר.',
])]

NOTES = {
    1: 'פתיחה קצרה: נושא הפרויקט, שמות המגישות והמנחה. כחצי דקה.',
    2: 'להדגיש שהבדיקה חינמית לשתי הקבוצות, ולכן הפער אינו כלכלי. המספרים הם הבסיס לכל העבודה.',
    3: 'לקרוא את שאלת המחקר בקול. להסביר שבמחקר איכותני אין השערות.',
    4: 'לא למנות את כל החסמים. להתעכב על המשפט המודגש בסוף, שהפערים מצטמצמים אחרי תקנון.',
    5: 'המשפט החשוב הוא הפער בין ידע להתנהגות. הוא מוביל ישירות לשאלת המחקר שלנו.',
    6: 'להסביר במשפט אחד למה המודלים הקלאסיים אינם מספיקים כאן ולמה בחרנו בגישה הסוציו-אקולוגית.',
    7: 'להסביר למה איכותני ולא שאלון. להדגיש את השונוּת המכוונת במדגם.',
    8: 'לא להקריא את הטבלה. להצביע על שלוש שורות: מי שנבדקת בקביעות, מי שמעולם לא נבדקה, ומי שחלתה.',
    9: 'להזכיר את הפיילוט ואת הסוגיה האתית. זה מראה התמודדות עם דילמה אמיתית ולא מילוי טופס.',
    10: 'מפת הדרכים לשני השקפים הבאים. לומר את השורה התחתונה: ההיענות היא מאזן כוחות ולא רמת ידע.',
    11: 'להקריא את הציטוטים במלואם. הם הראיה, לא הקישוט.',
    12: 'זו התמה שהפתיעה אותנו. להסביר למה חסם כזה לא נראה בשאלונים.',
    13: 'שלוש השאלות באמצע הפסקה הן הלב של הסיכום.',
    14: 'להציג את הממצא הדתי כהפתעה ולא כמסקנה חותכת, עם הסתייגות על גודל המדגם.',
    15: 'השקף החשוב ביותר להערכה, כי החוברת מבקשת יישומיות. לחבר כל המלצה לתמה שממנה נולדה.',
    16: 'לא להתנצל. להציג את המגבלות כמודעות מתודולוגית ולעבור לכיווני ההמשך.',
}

TABLE_ROWS = [
    ['#', 'שם בדוי', 'גיל', 'יישוב', 'השכלה ועיסוק', 'מיקום על ציר ההיענות'],
    ['1', 'לילה נגילי', '54', 'רמלה', '12 שנות לימוד; סייעת בגן', 'נבדקה פעמיים, באיחור של כשנתיים'],
    ['2', 'טגאיה סמאנך', '58', 'חולון', '4 שנות לימוד; עובדת ניקיון', 'נבדקה אחרי פנייה טלפונית באמהרית'],
    ['3', 'עאליה אבו עראר', '47', 'ערערה בנגב', 'תואר ראשון; מורה', 'נבדקת מתחת לגיל הזימון, בהפניית רופאה'],
    ['4', "מראם ח'טיב", '52', 'רמלה', '12 שנות לימוד; עובדת במספרה', 'בדיקה ראשונה בגיל 51 אחרי שנתיים'],
    ['5', 'סועאד זועבי', '61', 'נצרת', '8 שנות לימוד; עקרת בית', 'נבדקת בקביעות 11 שנים, בליווי בתה'],
    ['6', "ג'ולייט חורי", '56', 'חיפה', 'תואר ראשון; מזכירה בתיכון', 'נבדקת בקביעות מגיל 45, שש בדיקות'],
    ['7', 'נאדיה חלבי', '50', 'דלית אל-כרמל', '12 שנות לימוד; עסק משפחתי', 'מעולם לא נבדקה; הזימון במגירה'],
    ['8', 'פאטמה אבו קווידר', '44', 'רהט', '8 שנות לימוד; עקרת בית', 'מעולם לא נבדקה ומעולם לא זומנה'],
    ['9', 'אמל סרחאן', '63', 'טייבה', 'עבודה סוציאלית; מתנדבת', 'חלתה בגיל 58 אחרי כשנה וחצי המתנה'],
    ['10', 'הודא מנסור', '49', 'כפר כנא', 'סיעוד; אחות אחראית', 'טרם בגיל הזימון; מרכזת את הזימונים'],
    ['11', 'סמאח דיאב', '57', 'לוד', '8 שנות לימוד; דוכן בשוק', 'נבדקה פעם אחת לפני כשש שנים'],
    ['12', 'רימא נאסר', '66', 'שפרעם', 'היסטוריה; מורה בגמלאות', 'נבדקת בקביעות מגיל 50, שמונה בדיקות'],
]
COL_IN = [0.5, 1.75, 0.5, 1.35, 2.9, 4.5]      # inches, sums to 11.5


def table_xml(x_in, y_in):
    grid = ''.join(f'<a:gridCol w="{int(c*EMU)}"/>' for c in COL_IN)
    rows = ''
    for ri, r in enumerate(TABLE_ROWS):
        head = ri == 0
        h = int(0.29 * EMU)
        cells = ''
        for c in r:
            sz = 1000 if head else 950
            bold_attr = ' b="1"' if head else ''
            rpr = f'<a:rPr lang="he-IL" sz="{sz}"{bold_attr} dirty="0">'
            if head:
                rpr += '<a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>'
            rpr += '<a:cs typeface="+mn-cs"/></a:rPr>'
            fill = ('<a:solidFill><a:srgbClr val="1F3864"/></a:solidFill>' if head else
                    ('<a:solidFill><a:srgbClr val="F2F5F7"/></a:solidFill>' if ri % 2 else
                     '<a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>'))
            cells += (
                '<a:tc><a:txBody><a:bodyPr/><a:lstStyle/>'
                '<a:p><a:pPr algn="r" rtl="1"><a:lnSpc><a:spcPct val="100000"/></a:lnSpc>'
                '<a:spcBef><a:spcPts val="0"/></a:spcBef><a:buNone/></a:pPr>'
                f'<a:r>{rpr}<a:t>{esc(c)}</a:t></a:r></a:p></a:txBody>'
                '<a:tcPr marL="45720" marR="45720" marT="18288" marB="18288" anchor="ctr">'
                '<a:lnL w="6350" cmpd="sng"><a:solidFill><a:srgbClr val="D6DCE4"/></a:solidFill></a:lnL>'
                '<a:lnR w="6350" cmpd="sng"><a:solidFill><a:srgbClr val="D6DCE4"/></a:solidFill></a:lnR>'
                '<a:lnT w="6350" cmpd="sng"><a:solidFill><a:srgbClr val="D6DCE4"/></a:solidFill></a:lnT>'
                '<a:lnB w="6350" cmpd="sng"><a:solidFill><a:srgbClr val="D6DCE4"/></a:solidFill></a:lnB>'
                f'{fill}</a:tcPr></a:tc>')
        rows += f'<a:tr h="{h}">{cells}</a:tr>'
    total_h = int(0.29 * EMU) * len(TABLE_ROWS)
    return (
        '<p:graphicFrame><p:nvGraphicFramePr>'
        '<p:cNvPr id="20" name="טבלת המרואיינות"/>'
        '<p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr>'
        '<p:nvPr/></p:nvGraphicFramePr>'
        f'<p:xfrm><a:off x="{int(x_in*EMU)}" y="{int(y_in*EMU)}"/>'
        f'<a:ext cx="{int(sum(COL_IN)*EMU)}" cy="{total_h}"/></p:xfrm>'
        '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">'
        f'<a:tbl><a:tblPr rtl="1" firstRow="1"/><a:tblGrid>{grid}</a:tblGrid>{rows}</a:tbl>'
        '</a:graphicData></a:graphic></p:graphicFrame>')


def pic_xml(rid, x_in, y_in, w_in, h_in):
    return (
        '<p:pic><p:nvPicPr><p:cNvPr id="21" name="מפת התמות"/>'
        '<p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>'
        f'<p:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>'
        f'<p:spPr><a:xfrm><a:off x="{int(x_in*EMU)}" y="{int(y_in*EMU)}"/>'
        f'<a:ext cx="{int(w_in*EMU)}" cy="{int(h_in*EMU)}"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>')


# ------------------------------------------------------------------- surgery
SP_RE = re.compile(r'<p:sp>.*?</p:sp>', re.S)


def set_placeholder(slide_xml, match_fn, new_txbody):
    def repl(m):
        sp = m.group(0)
        ph = re.search(r'<p:ph([^>]*)/>', sp)
        attrs = ph.group(1) if ph else ''
        if not match_fn(attrs):
            return sp
        return re.sub(r'<p:txBody>.*?</p:txBody>', lambda _: new_txbody, sp, flags=re.S)
    return SP_RE.sub(repl, slide_xml)


is_title = lambda a: 'type="title"' in a or 'type="ctrTitle"' in a
is_body = lambda a: 'type=' not in a and 'idx="1"' in a
is_sub = lambda a: 'type="subTitle"' in a


def retitle(slide_xml, size):
    """Normalise the template's section title: trim stray spaces, one size."""
    def repl(m):
        sp = m.group(0)
        ph = re.search(r'<p:ph([^>]*)/>', sp)
        if not ph or not is_title(ph.group(1)):
            return sp
        text = ''.join(re.findall(r'<a:t>([^<]*)</a:t>', sp)).strip()
        text = re.sub(r'\s+', ' ', text)
        body = txbody([para([run(text, sz=size, b=True)], algn='r', space_before=0)], autofit=False)
        return re.sub(r'<p:txBody>.*?</p:txBody>', lambda _: body, sp, flags=re.S)
    return SP_RE.sub(repl, slide_xml)


def shrink_body(slide_xml, y_in, h_in):
    """Give the body placeholder an explicit box, so a table or figure below it
    has room of its own instead of sitting inside the placeholder's area."""
    def repl(m):
        sp = m.group(0)
        ph = re.search(r'<p:ph([^>]*)/>', sp)
        if not ph or not is_body(ph.group(1)):
            return sp
        xfrm = (f'<p:spPr><a:xfrm><a:off x="{int(0.92*EMU)}" y="{int(y_in*EMU)}"/>'
                f'<a:ext cx="{int(11.5*EMU)}" cy="{int(h_in*EMU)}"/></a:xfrm></p:spPr>')
        return re.sub(r'<p:spPr\s*/>|<p:spPr>.*?</p:spPr>', lambda _: xfrm, sp, count=1, flags=re.S)
    return SP_RE.sub(repl, slide_xml)


def add_notes(slide_no, text):
    """Write ppt/notesSlides/notesSlideN.xml and wire it to the slide."""
    nd = os.path.join(TPL, 'ppt', 'notesSlides')
    os.makedirs(os.path.join(nd, '_rels'), exist_ok=True)
    xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<p:notes xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree>'
        '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
        '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
        '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
        '<p:sp><p:nvSpPr><p:cNvPr id="2" name="מציין מיקום טקסט של הערות"/>'
        '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
        '<p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>'
        '<p:spPr><a:xfrm><a:off x="685800" y="685800"/><a:ext cx="5486400" cy="4114800"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>'
        '<p:txBody><a:bodyPr/><a:lstStyle/>'
        f'<a:p><a:pPr algn="r" rtl="1"/><a:r><a:rPr lang="he-IL" sz="1200" dirty="0"/>'
        f'<a:t>{esc(text)}</a:t></a:r></a:p></p:txBody></p:sp>'
        '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>')
    open(os.path.join(nd, f'notesSlide{slide_no}.xml'), 'w', encoding='utf-8').write(xml)
    open(os.path.join(nd, '_rels', f'notesSlide{slide_no}.xml.rels'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        f'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        f'relationships/slide" Target="../slides/slide{slide_no}.xml"/></Relationships>')
    # link from the slide
    rp = os.path.join(TPL, 'ppt', 'slides', '_rels', f'slide{slide_no}.xml.rels')
    s = open(rp, encoding='utf-8').read()
    if 'notesSlide' not in s:
        ids = [int(i) for i in re.findall(r'Id="rId(\d+)"', s)]
        new = f'rId{max(ids)+1}'
        s = s.replace('</Relationships>',
                      f'<Relationship Id="{new}" Type="http://schemas.openxmlformats.org/'
                      f'officeDocument/2006/relationships/notesSlide" '
                      f'Target="../notesSlides/notesSlide{slide_no}.xml"/></Relationships>')
        open(rp, 'w', encoding='utf-8').write(s)


def main():
    # ---- slide 1: cover
    p = os.path.join(TPL, 'ppt', 'slides', 'slide1.xml')
    x = open(p, encoding='utf-8').read()
    cover = txbody([
        para([run('פרויקט גמר בנושא:', sz=1800, b=True, color=MUTE)], algn='ctr', space_before=0),
        para([run('היענות לבדיקות ממוגרפיה בחברה הערבית בישראל', sz=2800, b=True)], algn='ctr', space_before=400),
        para([run('חסמים, מאיצים ודרכים להגברת ההיענות', sz=2200, color=EMPH)], algn='ctr', space_before=200),
        para([run('מחקר איכותני מבוסס שנים עשר ראיונות עומק  |  שנה"ל תשפ"ו', sz=1500, color=MUTE)],
             algn='ctr', space_before=400),
    ], autofit=False)
    x = set_placeholder(x, is_title, cover)
    sub = txbody([
        para([run('מגישות:  [שם מלא]  |  [שם מלא]  |  [שם מלא]', sz=1600, b=True)], algn='ctr', space_before=0),
        para([run('בהנחיית: ד"ר שנהב פרץ', sz=1600)], algn='ctr', space_before=300),
        para([run('המרכז האקדמי פרס  |  החוג למנהל מערכות בריאות', sz=1400, color=MUTE)],
             algn='ctr', space_before=300),
    ], autofit=False)
    x = set_placeholder(x, is_sub, sub)
    open(p, 'w', encoding='utf-8').write(x)

    # ---- slides 2..16: prose bodies + normalised titles
    for n in range(2, 17):
        p = os.path.join(TPL, 'ppt', 'slides', f'slide{n}.xml')
        x = open(p, encoding='utf-8').read()
        x = retitle(x, 4000)
        x = set_placeholder(x, is_body, txbody(S[n]))
        if n in (8, 10):
            x = shrink_body(x, 2.00, 0.74)
        if n == 8:
            x = x.replace('</p:spTree>', table_xml(0.92, 2.85) + '</p:spTree>')
        if n == 10:
            x = x.replace('</p:spTree>', pic_xml('rId3', 1.16, 2.85, 11.03, 11.03 * 913 / 2398)
                          + '</p:spTree>')
        open(p, 'w', encoding='utf-8').write(x)

    # ---- media + rel + content type for the theme map
    shutil.copy(os.path.join(W, 'themes_wide.png'),
                os.path.join(TPL, 'ppt', 'media', 'themes_wide.png'))
    rp = os.path.join(TPL, 'ppt', 'slides', '_rels', 'slide10.xml.rels')
    s = open(rp, encoding='utf-8').read()
    if 'themes_wide' not in s:
        s = s.replace('</Relationships>',
                      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/'
                      'officeDocument/2006/relationships/image" Target="../media/themes_wide.png"/>'
                      '</Relationships>')
        open(rp, 'w', encoding='utf-8').write(s)
    ct = os.path.join(TPL, '[Content_Types].xml')
    s = open(ct, encoding='utf-8').read()
    if 'Extension="png"' not in s:
        s = s.replace('<Default Extension="jpeg"',
                      '<Default Extension="png" ContentType="image/png"/><Default Extension="jpeg"')
    for n in range(1, 17):
        tag = f'/ppt/notesSlides/notesSlide{n}.xml'
        if tag not in s:
            s = s.replace('</Types>',
                          f'<Override PartName="{tag}" ContentType="application/vnd.openxmlformats-'
                          f'officedocument.presentationml.notesSlide+xml"/></Types>')
    open(ct, 'w', encoding='utf-8').write(s)

    # ---- speaker notes
    for n, t in NOTES.items():
        add_notes(n, t)

    # ---- repack
    out = os.path.join(W, 'deck_template.pptx')
    if os.path.exists(out):
        os.remove(out)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(TPL):
            for f in files:
                full = os.path.join(root, f)
                z.write(full, os.path.relpath(full, TPL))
    print('wrote', out)


if __name__ == '__main__':
    main()

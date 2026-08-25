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
TPL = os.path.join(W, 'tpl')
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


def ref_he(text, sz=1200):
    ppr = (f'<a:pPr marL="342900" indent="-342900" algn="r" rtl="1">'
           f'<a:lnSpc><a:spcPct val="95000"/></a:lnSpc>'
           f'<a:spcBef><a:spcPts val="300"/></a:spcBef><a:buNone/></a:pPr>')
    return f'<a:p>{ppr}{run(text, sz=sz)}</a:p>'


def ref_en(text, sz=1200):
    ppr = (f'<a:pPr marL="342900" indent="-342900" algn="l" rtl="0">'
           f'<a:lnSpc><a:spcPct val="95000"/></a:lnSpc>'
           f'<a:spcBef><a:spcPts val="300"/></a:spcBef><a:buNone/></a:pPr>')
    return (f'<a:p>{ppr}<a:r><a:rPr lang="en-US" sz="{sz}" dirty="0"/>'
            f'<a:t>{esc(text)}</a:t></a:r></a:p>')


# ---------------------------------------------------------------- slide text
S = {}

S[2] = [prose([
    'סרטן השד הוא הגידול הממאיר השכיח ביותר בקרב נשים בישראל, ובהיעדר אמצעי ודאי למניעה '
    'ראשונית מתמקד המאמץ הרפואי בגילוי מוקדם. בדיקת הממוגרפיה נכללת בסל הבריאות וניתנת ללא '
    'תשלום לנשים בגילאי 50 עד 74 אחת לשנתיים, ומכאן שחסם העלות אינו רלוונטי בהקשר הישראלי. '
    'חרף זאת מתועד פער מתמשך בשיעורי הביצוע: על פי נתוני הסקר החברתי לשנת 2017 ביצעו '
    'ממוגרפיה ',
    ('78.2% מן הנשים היהודיות לעומת 64.8% מן הנשים הערביות', 'b'),
    ' (הלשכה המרכזית לסטטיסטיקה, 2019). לפער זה נלווה הבדל בשלב האבחון ובגיל שבו הוא מתרחש, '
    'ובקרב נשים בדואיות בנגב עומד חציון גיל האבחון על כ-48 שנים לעומת כ-62 שנים בקרב נשים '
    'יהודיות (Ben Shitrit et al., 2024), כך שחלק ניכר מן התחלואה מתרחש מתחת לגיל הסף של '
    'תוכנית הסקר. ',
    ('הבעיה הניהולית הנגזרת מכך אינה בעיה של זמינות השירות אלא של מימושו בפועל', 'b'),
    '.',
])]

S[3] = [prose([
    'שאלת המחקר היא ',
    ('אילו גורמים מעכבים ומקדמים את היענותן של נשים בחברה הערבית בישראל לבדיקות ממוגרפיה, '
     'וכיצד ניתן להגביר אותה', 'b'),
    '. מאחר שהמחקר איכותני ומטרתו לתאר מנגנון ולא לאמוד את שכיחותו, נוסחה שאלה פתוחה ולא '
    'הוצבו השערות מחקר. משאלה זו נגזרות שלוש מטרות. הראשונה היא זיהוי החסמים והמאיצים כפי '
    'שהם מנוסחים על ידי הנשים עצמן, ולא כפי שהם מסווגים מראש בספרות. השנייה היא בחינת יחסי '
    'הגומלין בין הגורמים, מתוך ההנחה כי הם נחווים כמכשול מצטבר אחד ולא כרשימה של חסמים '
    'נפרדים. השלישית היא גזירת המלצות יישומיות לקופות החולים ולמשרד הבריאות, בהתאם לאופיו '
    'הפרקטי של פרויקט הגמר. הבחירה באוכלוסיית הנשים כמושא הראיון, ולא באנשי מקצוע בלבד, '
    'נשענת על ההנחה כי ',
    ('הימנעות מבדיקה היא התנהגות בעלת היגיון פנימי הניתן לתיאור ולניתוח', 'b'),
    '.',
])]

S[4] = [prose([
    'הספרות המחקרית מזהה שלוש משפחות של חסמים להיענות. במישור התרבותי והרגשי מתועדים הבושה '
    'והמבוכה הכרוכות בחשיפת הגוף, החשש מפני תיוג חברתי ורכילות, החשש לפגיעה במעמד המשפחה '
    'ובסיכויי הנישואין של בנותיה, והפחד מן המחלה ומתוצאות הבדיקה (Cohen & Azaiza, 2006). '
    'במישור האמוני מתועדות תפיסות פטליסטיות הרואות במחלה גורל שאין לשנותו, ואלה נמצאו כמנבאות '
    'מובהקות של אי-היענות (Azaiza et al., 2010). במישור המבני והמערכתי מזוהים מרחק ותלות '
    'בהסעה, היעדר בודקת אישה, פערי שפה וזימונים שאינם מגיעים או שאינם מובנים (מורן ואבו '
    'עבייד, 2018). לצד אלה עולה מן הספרות העדכנית כי ',
    ('הפערים בתמותה בין הקבוצות מצטמצמים ואינם נותרים מובהקים לאחר תקנון למשתנים '
     'סוציו-דמוגרפיים', 'b'),
    ', ממצא הממקם את מקורם של הפערים בתחום המדיניות הציבורית ולא בתחום הביולוגי '
    '(Pinchas-Mizrachi & Bouhnik, 2024).',
])]

S[5] = [prose([
    'לצד החסמים מזוהים בספרות גורמים מאיצים, ובראשם ',
    ('המלצה אקטיבית מצד ספק שירותי הבריאות', 'b'),
    ', שנמצאה כמנבא המובהק והעקבי ביותר לביצוע הבדיקה, לצד זימון יזום ממוחשב, מכתבי הזמנה '
    'ותזכורות (Freund et al., 2019). התערבויות מותאמות-תרבות, המועברות בשפת הנשים ובאמצעות '
    'דמויות מפתח מן הקהילה ובהן נשים ששרדו את המחלה, נמצאו אפקטיביות יותר מקמפיינים חינוכיים '
    'גנריים (Cohen & Azaiza, 2008). הסוגיה שנותרה פתוחה היא ',
    ('הפער שבין ידע להתנהגות', 'b'),
    ': רוב הנשים הערביות מעל גיל חמישים כבר עברו ממוגרפיה לפחות פעם אחת, ואף על פי כן ההיענות '
    'ללוח הזמנים המומלץ נותרת נמוכה (Cohen & Azaiza, 2006). מאחר שמרבית המחקרים בתחום '
    'כמותיים, הם מתעדים את שכיחות החסמים ואת עוצמת הקשר שלהם להיענות, אך אינם מתארים את אופן '
    'פעולתם בפועל, וזהו החלל שהפרויקט הנוכחי מבקש למלא.',
])]

S[6] = [prose([
    'המסגרת התיאורטית המרכזית בתחום היא מודל האמונות הבריאותיות, המסביר התנהגות מונעת '
    'באמצעות תפיסת הפגיעוּת האישית, תפיסת חומרת המחלה, התועלות הנתפסות מן הבדיקה והחסמים '
    'הנתפסים בפניה, לצד רמזים לפעולה ותחושת מסוגלות עצמית (סטרן, 2007). לצידו משמשים מודל '
    'שלבי השינוי, המאפשר התאמת ההתערבות לשלב שבו מצויה האישה, ותיאוריית הפעולה המנומקת, '
    'הרואה בכוונה ההתנהגותית תוצר של עמדות אישיות ושל נורמות חברתיות נתפסות, שנמצאו בעלות כוח '
    'הסבר ניכר בקרב נשים ערביות מוסלמיות בישראל (Soskolne et al., 2007). מגבלתם המשותפת של '
    'מודלים אלה היא שפותחו בהקשר מערבי-אינדיבידואליסטי ואינם לוכדים במלואם משתנים כגון בושה, '
    'מבנה משפחה מורחבת ותפיסות דתיות. לפיכך אומצה כאן גם ',
    ('הגישה הסוציו-אקולוגית', 'b'),
    ', הבוחנת את ההתנהגות בארבע רמות המשפיעות זו על זו, האישית, הבין-אישית, הקהילתית '
    'והמערכתית, ומדגישה כי התערבות ברמה אחת בלבד אינה מספקת (Alatawneh et al., 2024).',
])]

S[7] = [prose([
    'המחקר הוא מחקר איכותני המבוסס על ראיונות עומק חצי מובנים. בחירת השיטה נגזרת מאופייה של '
    'שאלת המחקר, שכן מושגים כגון בושה, חשש מאבחנה ותפיסות של גורל אינם ניתנים למדידה מהימנה '
    'בכלי סגור, והם עולים לרוב באופן עקיף ובלתי מתוכנן במהלך הראיון. אוכלוסיית המחקר מוגדרת '
    'כנשים בגיל הרלוונטי לבדיקה או בסמוך לו, ובמדגם נכללו ',
    ('שתים עשרה נשים בגילאי 44 עד 66', 'b'),
    ' שנבחרו בדגימה מכוונת ובשיטת כדור השלג. המדגם נבנה תוך הקפדה על שונוּת פנימית, והוא כולל '
    'נשים מוסלמיות, נוצרייה, דרוזית ובדואיות מיישובים ערביים, מערים מעורבות ומן הנגב, ברמות '
    'השכלה הנעות משמונה שנות לימוד ועד תואר אקדמי, ולצידן אישה יוצאת אתיופיה שנכללה לצורך '
    'הבחנה בין חסם תרבותי לבין חסם של שפה ונגישות בקבוצת מיעוט אחרת.',
])]

S[8] = [prose([
    'המדגם נבנה כך שיכסה את מלוא הטווח של התנהגות ההיבדקות, מנשים הנבדקות בקביעות ועד נשים '
    'שמעולם לא נבדקו.',
], sz=LEAD, space_before=0)]

S[9] = [prose([
    'כלי המחקר הוא מדריך ראיון חצי מובנה הכולל שש עשרה שאלות פתוחות, ובהן שאלת פתיחה כללית '
    'שנועדה ליצור היכרות בטרם המעבר לנושא הרגיש. המדריך הועבר בנוסח זהה ובסדר זהה בכל שנים '
    'עשר הראיונות. השאלות נגזרו מן הממדים שעלו בסקירת הספרות: האשכול הראשון עוסק בידע '
    'ובחוויית הבדיקה בפועל, השני בפחד, בצניעות, במגדר מבצע הבדיקה ובתיוג החברתי, והשלישי '
    'במשפחה המורחבת, בממד הדתי, בהתנהלות מול קופת החולים ובהמלצת ספק השירות. שתי שאלות נוסחו '
    'מחדש בעקבות ראיון פיילוט, משום שנמצאו מוטות לכיוון תשובה שלילית. הראיונות נמשכו בין 32 '
    'ל-45 דקות, הוקלטו בהסכמה ותומללו במלואם, ונותחו ב',
    ('שיטת הניתוח התמטי בחמישה שלבים', 'b'),
    '. כל המשתתפות נתנו הסכמה מדעת, השמות בדויים וכל פרט מזהה טושטש.',
])]

S[10] = [prose([
    'התרשים מציג את הדרך אל הבדיקה ואת הנקודה שבה כל תמה חוסמת אותה, לצד הגורם המקדם '
    'שנמצא כמעביר את האישה לאורכה.',
], sz=LEAD, space_before=0)]

S[11] = [prose([
    'מן התמה הראשונה עולה כי ',
    ('הידע אינו מבחין בין נשים הנבדקות לבין נשים שאינן נבדקות', 'b'),
    '. אחת עשרה מתוך שתים עשרה המשתתפות, ובהן אלה שמעולם לא נבדקו, ידעו מהי הבדיקה ולשם מה '
    'היא נועדה. לילה, בת 54, ניסחה זאת במפורש: ',
    ('"אני יודעת בדיוק מה צריך לעשות. ובכל זאת עברו שנתיים"', 'i'),
    '. הגורם המעכב שזוהה הוא החשש מפני האבחנה ולא מפני הבדיקה עצמה, כפי שהבחינה מראם, בת 52: ',
    ('"אני לא מפחדת מהמכונה. אני מפחדת מהנייר"', 'i'),
    '. לצידו פעלו התפיסה כי בהיעדר תסמין אין הצדקה לבדיקה, ודפוס של דחייה מוצדקת שאינו מגיע '
    'לכלל הכרעה. התמה השנייה מלמדת כי חסם הבושה קיים אך ממוקם אחרת מכפי שמניחה הספרות: '
    'החשיפה בחדר הבדיקה בפני בודקת אישה תוארה כאירוע קצר, ואילו הגורם המרתיע היה החשיפה '
    'החברתית בדרך אל הבדיקה, כפי שתיארה עאליה, בת 47: ',
    ('"הבדיקה של האמא הופכת לתיק של הבת"', 'i'),
    '.',
])]

S[12] = [prose([
    'התמה השלישית חורגת מן המתועד בספרות התרבותית ומצביעה על חסם מעשי שאינו זוכה להתייחסות '
    'מספקת. המשתתפות תיארו את היציאה לבדיקה כחשבון כלכלי ומשפחתי מפורש של שעות עבודה שאבדו, '
    'של הסעה ושל נטל טיפולי בבית. טגאיה, בת 58, העמידה את שני הצדדים זה מול זה: ',
    ('"אני יודעת שזה נשמע קטן ליד סרטן. אבל בסוף החודש זה לא קטן"', 'i'),
    '. מאפיינו המרכזי של חסם זה הוא ש',
    ('הוא אינו נתפס אצל האישה כחסם אלא כסדר עדיפויות סביר', 'b'),
    ', ולפיכך אינו נלכד במדדים המבוססים על דיווח עצמי. התמה הרביעית עוסקת במאיצים ומצביעה על '
    'הפנייה האישית כגורם המקדם החזק ביותר. אותה המלצה עצמה הניבה תוצאות מנוגדות בהתאם לאופן '
    'מסירתה, ולילה תיארה את הגרסה שלא הובילה לפעולה: ',
    ('"לא הרים את הראש. אמר את זה למסך"', 'i'),
    '. בנוסף נמצא כי כל המשתתפות הנבדקות בקביעות תיארו דמות מלווה, ואילו אף אחת מן הנשים שלא '
    'נבדקו לא תיארה דמות כזאת.',
])]

S[13] = [prose([
    'ממצאי המחקר מלמדים כי ',
    ('ההיענות אינה נקבעת ברמת הידע אלא ברמת ההתנהלות היומיומית', 'b'),
    '. ההבחנה בין אישה הנבדקת בקביעות לבין אישה שאינה נבדקת אינה עוברת בשאלת הידע, אלא בשלושה '
    'תנאים: קיומה של פנייה אישית, קיומה של דמות מלווה, ועלות ההיעדרות הכרוכה ביציאה לבדיקה. '
    'מכאן שתי מסקנות בעלות משמעות ניהולית. הראשונה היא כי החסם התרבותי אמיתי אך ממוקם בדרך אל '
    'הבדיקה ולא בחדר הבדיקה, כלומר בחשיפה החברתית ולא בחשיפה הגופנית, ולפיכך התאמה מגדרית של '
    'השירות היא תנאי הכרחי שאינו מספיק בהיעדר מענה לצורך בדיסקרטיות. השנייה היא כי קיים חסם '
    'מעשי שאינו מתועד די הצורך, הכרוך במחיר של יום עבודה ושל היעדרות מן הבית, ואשר אינו עולה '
    'בשאלונים משום שאינו נחווה כחסם.',
])]

S[14] = [prose([
    'בהשוואה לספרות, הממצאים מאששים את קיומם של החסמים המוכרים אך משנים את מיקומם ואת משקלם '
    'היחסי. הטענה כי הידע הוא תנאי הכרחי שאינו מספיק (Alatawneh et al., 2024) מקבלת חיזוק, '
    'ואף מורחבת, שכן אצל חלק מן המשתתפות תפקד הידע כגורם המסייע להימנעות. הממצא בדבר מרכזיות '
    'המלצת ספק השירות (Freund et al., 2019) אושש במלואו, אולם הראיונות מלמדים כי הגורם המכריע '
    'אינו תוכן ההמלצה אלא אופן מסירתה. ממצא החורג מן הצפוי נוגע לממד הדתי: בעוד שהספרות '
    'מייחסת לפטליזם משקל ניכר (Azaiza et al., 2010), ',
    ('אף אחת מן המשתתפות לא נימקה את הימנעותה בטעם דתי', 'b'),
    ', ומשתתפות שהחזיקו באמונה כי הכול בידי שמיים נבדקו בקביעות בלא שראו בכך סתירה. סועאד, '
    'בת 61, ניסחה זאת כך: ',
    ('"אני לא הולכת לבדיקה במקום אללה, חלילה, אני הולכת בגלל אללה"', 'i'),
    '.',
])]

S[15] = [prose([
    'ההמלצות נגזרות מן הממצאים, ומשותף לכולן שאין הן מכוונות לשינוי אמונותיהן של הנשים אלא ',
    ('להסרת הגורמים החוצצים בין הכוונה לבין הפעולה', 'b'),
    '. ברמת המרפאה, ובעלות נמוכה יחסית, מוצע להעמיד רכזת זימונים דוברת ערבית שתפעל בפנייה '
    'טלפונית יזומה ולא במשלוח מכתבים, ולמדוד את שיעור ההמרה משיחה לתור שנקבע בפועל; לשלב '
    'במערכת הממוחשבת התראה לרופא המשפחה בפתיחת ביקור של אישה בגיל הזכאות שאיחרה בבדיקה, כך '
    'שההמלצה תינתן במפגש הקליני; ולהרחיב את פריסת התורים לשעות אחר הצהריים ולימי שישי לצד '
    'אישור היעדרות מעבודה. ברמת הקופה ומשרד הבריאות מוצע להפעיל את ניידת הממוגרפיה על פי לוח '
    'שנתי קבוע ובמיקום דיסקרטי, להכשיר נשים מקומיות שנבדקו להנחיית מפגשים בהיקף מצומצם, '
    'ולבחון הרחבת הזימון היזום לגילאי 45 עד 49 בקהילות שבהן חציון גיל האבחון צעיר.',
])]

S[16] = [prose([
    'למחקר ארבע מגבלות עיקריות. ראשית, המדגם קטן ומכוון, ולפיכך אין להסיק ממנו על שכיחות '
    'החסמים באוכלוסייה אלא על הצורות שהם לובשים בלבד. שנית, הדגימה בשיטת כדור השלג עלולה '
    'להטות את המדגם לטובת נשים המוכנות לשוחח על הנושא, וייתכן שנשים שהימנעותן עמוקה יותר לא '
    'נכללו בו. שלישית, שישה ראיונות נערכו בערבית ובאמהרית ותורגמו לעברית, ובכל תרגום כרוך '
    'אובדן מסוים של ניואנס. רביעית, זהותן של המראיינות כסטודנטיות למנהל מערכות בריאות עשויה '
    'הייתה לעודד הצגת עמדה חיובית יותר כלפי הבדיקה. מכאן שלושה כיווני מחקר המשך: בחינה כמותית '
    'של משקלו של החסם היומיומי לצד החסמים התרבותיים, מחקר השוואתי בין יישובים שבהם פעלה ניידת '
    'ממוגרפיה לבין יישובים דומים שבהם לא פעלה, ובחינת ההיענות בקרב נשים מתחת לגיל חמישים '
    'בקהילות שבהן חציון גיל האבחון צעיר.',
])]

S[17] = [
    ref_he('הלשכה המרכזית לסטטיסטיקה (2019). נתוני בריאות האישה בישראל: בדיקות סקר לגילוי מוקדם.'),
    ref_he('מורן, ד\' ס\', ואבו עבייד, ס\' (2018). היענות נשים ערביות לבדיקות לאבחון מוקדם של סרטן '
           'השד במדינות ערב ובישראל: מאמר דעה. כתב עת לפיזיותרפיה, 20(2), 25-32.'),
    ref_he('סטרן, כ\' (2007). היענות לביצוע ממוגרפיה לאור מודלים בקידום בריאות. קידום בריאות '
           'בישראל, 1, 34-45.'),
    ref_en('Alatawneh, D., et al. (2024). Knowledge, age, and perceived social barriers regarding '
           'mammography screening among immigrant Arab women in the United States. Journal of '
           "Women's Health, 33(10), 1385-1392."),
    ref_en('Azaiza, F., Cohen, M., Awad, M., & Daoud, F. (2010). Factors associated with low '
           'screening for breast cancer in the Palestinian authority. Cancer, 116(19), 4646-4655.'),
    ref_en('Ben Shitrit, I., Wang, A., Ilan, K., Agassi, R., Abu Freih, S., & Vaynshtein, J. '
           '(2024). Epidemiological, clinical, and pathological characteristics of invasive breast '
           'cancer in Bedouin and Jewish women in southern Israel. BMC Cancer, 24, 310.'),
    ref_en('Cohen, M., & Azaiza, F. (2006). Health beliefs and rates of breast cancer screening '
           "among Arab women. Journal of Women's Health, 15(5), 520-530."),
    ref_en('Cohen, M., & Azaiza, F. (2008). Increasing breast examinations among Arab women using a '
           'tailored culture-based intervention. Behavioral Medicine, 36(3), 92-99.'),
    ref_en('Freund, A., Cohen, M., & Azaiza, F. (2019). Factors associated with routine screening '
           'for the early detection of breast cancer in cultural-ethnic and faith-based '
           'communities. Ethnicity & Health, 24(5), 527-543.'),
    ref_en('Pinchas-Mizrachi, R., & Bouhnik, D. (2024). A retrospective analysis of breast cancer '
           'mortality among Jewish and Muslim Arab women in Israel. Cancers, 16(15), 2763.'),
    ref_en('Soskolne, V., Marie, S., & Manor, O. (2007). Beliefs, recommendations and intentions '
           'are important explanatory factors of mammography screening behavior among Muslim Arab '
           'women in Israel. Health Education Research, 22(5), 665-676.'),
]

TITLES = {17: 'רשימת מקורות'}

NOTES = {
    1: 'הצגת נושא הפרויקט, שמות המגישות והמנחה. כחצי דקה.',
    2: 'להדגיש כי הבדיקה נגישה וחינמית לשתי הקבוצות, ומכאן שהפער אינו מוסבר בחסם כלכלי.',
    3: 'להקריא את שאלת המחקר. לציין כי במחקר איכותני לא מוצבות השערות.',
    4: 'להציג את שלוש משפחות החסמים בקצרה, ולהתעכב על ממצא התקנון הסוציו-דמוגרפי.',
    5: 'הנקודה המרכזית היא הפער בין ידע להתנהגות, המוביל אל שאלת המחקר.',
    6: 'להסביר מדוע המודלים הקלאסיים אינם מספקים בהקשר קולקטיביסטי, ומהי תרומת הגישה הסוציו-אקולוגית.',
    7: 'לנמק את בחירת השיטה האיכותנית ולהדגיש את השונוּת המכוונת שנבנתה במדגם.',
    8: 'אין להקריא את הטבלה. להצביע על שלוש שורות המייצגות את קצות הטווח ואת המקרה של האישה שחלתה.',
    9: 'לציין את ראיון הפיילוט ואת אופן הטיפול בסוגיות האתיות.',
    10: 'להסביר כי החסמים אינם פועלים במקביל אלא כל אחד בשלב אחר בדרך אל הבדיקה, וכי הרצועה התחתונה היא הגורם המעביר את האישה לאורכה.',
    11: 'להקריא את הציטוטים במלואם, בהיותם הראיה האמפירית לתמות.',
    12: 'להדגיש כי מדובר בחסם שאינו מתועד די הצורך בספרות, ולהסביר מדוע אינו נלכד בשאלונים.',
    13: 'שלושת התנאים המפורטים באמצע הפסקה הם ליבת הסיכום.',
    14: 'להציג את הממצא בדבר הממד הדתי כממצא החורג מן הצפוי, בליווי הסתייגות בדבר גודל המדגם.',
    15: 'לקשור כל המלצה לתמה שממנה נגזרה, ולהבחין בין רמת המרפאה לרמת המדיניות.',
    16: 'להציג את המגבלות כמודעות מתודולוגית, ולעבור לכיווני מחקר ההמשך.',
    17: 'שקף המקורות מוצג בקצרה; רשימת המקורות המלאה מופיעה בגוף העבודה.',
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
        '<p:pic><p:nvPicPr><p:cNvPr id="21" name="הדרך אל הבדיקה"/>'
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


def retitle(slide_xml, size, override=None):
    """Normalise the template's section title: trim stray spaces, one size."""
    def repl(m):
        sp = m.group(0)
        ph = re.search(r'<p:ph([^>]*)/>', sp)
        if not ph or not is_title(ph.group(1)):
            return sp
        text = override or ''.join(re.findall(r'<a:t>([^<]*)</a:t>', sp)).strip()
        text = re.sub(r'\s+', ' ', text)
        body = txbody([para([run(text, sz=size, b=True)], algn='r', space_before=0)], autofit=False)
        return re.sub(r'<p:txBody>.*?</p:txBody>', lambda _: body, sp, flags=re.S)
    return SP_RE.sub(repl, slide_xml)


SLDNUM = (
    '<p:sp><p:nvSpPr><p:cNvPr id="31" name="מציין מיקום של מספר שקופית"/>'
    '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
    '<p:nvPr><p:ph type="sldNum" sz="quarter" idx="12"/></p:nvPr></p:nvSpPr>'
    '<p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/>'
    '<a:p><a:pPr algn="l" rtl="0"/>'
    '<a:fld id="{{2D6E5B1F-8A4C-4B71-9E3A-{sn:012d}}}" type="slidenum">'
    '<a:rPr lang="he-IL" sz="1200"/><a:t>{sn}</a:t></a:fld></a:p></p:txBody></p:sp>')


def add_slide_number(slide_xml, n):
    if 'type="sldNum"' in slide_xml:
        return slide_xml
    return slide_xml.replace('</p:spTree>', SLDNUM.format(sn=n) + '</p:spTree>')


LOGO_BOX = (0.30, 0.22, 1.35, 1.35)   # square, so the logo is not stretched


def swap_logo(slide_xml):
    """The template ships another college's logo in a landscape box. Point the
    picture at a square box so the Peres mark keeps its aspect ratio."""
    x, y, w, h = LOGO_BOX
    new = (f'<a:off x="{int(x*EMU)}" y="{int(y*EMU)}"/>'
           f'<a:ext cx="{int(w*EMU)}" cy="{int(h*EMU)}"/>')
    def repl(m):
        pic = m.group(0)
        if 'name="Picture 5"' not in pic:
            return pic
        return re.sub(r'<a:off[^/]*/><a:ext[^/]*/>', lambda _: new, pic, count=1)
    return re.sub(r'<p:pic>.*?</p:pic>', repl, slide_xml, flags=re.S)


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
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        'relationships/notesMaster" Target="../notesMasters/notesMaster1.xml"/>'
        f'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
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


NOTES_MASTER = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<p:notesMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
    'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld>'
    '<p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>'
    '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
    '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
    '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
    '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image Placeholder 1"/>'
    '<p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr>'
    '<p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr>'
    '<p:spPr><a:xfrm><a:off x="1143000" y="685800"/><a:ext cx="4572000" cy="3429000"/></a:xfrm>'
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
    '<a:ln w="12700"><a:solidFill><a:prstClr val="black"/></a:solidFill></a:ln></p:spPr>'
    '<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="he-IL"/></a:p></p:txBody></p:sp>'
    '<p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes Placeholder 2"/>'
    '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
    '<p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>'
    '<p:spPr><a:xfrm><a:off x="685800" y="4343400"/><a:ext cx="5486400" cy="4114800"/></a:xfrm>'
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>'
    '<p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" '
    'rtlCol="0"/><a:lstStyle/><a:p><a:pPr algn="r" rtl="1"/>'
    '<a:endParaRPr lang="he-IL"/></a:p></p:txBody></p:sp>'
    '</p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" '
    'accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" '
    'hlink="hlink" folHlink="folHlink"/><p:notesStyle>'
    '<a:lvl1pPr marL="0" algn="r" defTabSz="914400" rtl="1" eaLnBrk="1" latinLnBrk="0" '
    'hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/>'
    '</a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/>'
    '<a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr></p:notesStyle></p:notesMaster>')


def install_notes_master():
    """A notes slide without a notes master makes PowerPoint refuse the file."""
    nm = os.path.join(TPL, 'ppt', 'notesMasters')
    os.makedirs(os.path.join(nm, '_rels'), exist_ok=True)
    open(os.path.join(nm, 'notesMaster1.xml'), 'w', encoding='utf-8').write(NOTES_MASTER)

    # a notes master gets its own theme part, the way PowerPoint writes it
    t1 = os.path.join(TPL, 'ppt', 'theme', 'theme1.xml')
    t2 = os.path.join(TPL, 'ppt', 'theme', 'theme2.xml')
    theme = open(t1, encoding='utf-8').read()
    theme = re.sub(r'(<a:theme[^>]*name=")[^"]*(")', r'\1Notes Theme\2', theme, count=1)
    open(t2, 'w', encoding='utf-8').write(theme)

    open(os.path.join(nm, '_rels', 'notesMaster1.xml.rels'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
        'relationships/theme" Target="../theme/theme2.xml"/></Relationships>')

    rp = os.path.join(TPL, 'ppt', '_rels', 'presentation.xml.rels')
    r = open(rp, encoding='utf-8').read()
    if 'notesMasters/notesMaster1.xml' not in r:
        r = r.replace('</Relationships>',
                      '<Relationship Id="rId900" Type="http://schemas.openxmlformats.org/'
                      'officeDocument/2006/relationships/notesMaster" '
                      'Target="notesMasters/notesMaster1.xml"/></Relationships>')
        open(rp, 'w', encoding='utf-8').write(r)

    pp = os.path.join(TPL, 'ppt', 'presentation.xml')
    x = open(pp, encoding='utf-8').read()
    if 'notesMasterIdLst' not in x:
        # schema order: sldMasterIdLst, notesMasterIdLst, sldIdLst
        x = x.replace('</p:sldMasterIdLst>',
                      '</p:sldMasterIdLst><p:notesMasterIdLst>'
                      '<p:notesMasterId r:id="rId900"/></p:notesMasterIdLst>')
        open(pp, 'w', encoding='utf-8').write(x)


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
    x = swap_logo(x)
    open(p, 'w', encoding='utf-8').write(x)

    # ---- slides 2..16: prose bodies + normalised titles
    for n in range(2, 18):
        p = os.path.join(TPL, 'ppt', 'slides', f'slide{n}.xml')
        x = open(p, encoding='utf-8').read()
        x = retitle(x, 4000, TITLES.get(n))
        x = set_placeholder(x, is_body, txbody(S[n]))
        if n in (8, 10):
            x = shrink_body(x, 2.00, 0.74)
        if n == 8:
            x = x.replace('</p:spTree>', table_xml(0.92, 2.85) + '</p:spTree>')
        if n == 10:
            x = x.replace('</p:spTree>', pic_xml('rId3', 1.10, 2.82, 11.15, 11.15 * 1020 / 2648)
                          + '</p:spTree>')
        x = add_slide_number(x, n)
        x = swap_logo(x)
        open(p, 'w', encoding='utf-8').write(x)

    # ---- the college logo the template ships is another institution's
    shutil.copy(os.path.join(W, 'peres_logo.jpg'),
                os.path.join(TPL, 'ppt', 'media', 'image1.jpeg'))

    # ---- media + rel + content type for the theme map
    shutil.copy(os.path.join(W, 'findings_path_wide.png'),
                os.path.join(TPL, 'ppt', 'media', 'findings_path_wide.png'))
    rp = os.path.join(TPL, 'ppt', 'slides', '_rels', 'slide10.xml.rels')
    s = open(rp, encoding='utf-8').read()
    if 'findings_path_wide' not in s:
        s = s.replace('</Relationships>',
                      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/'
                      'officeDocument/2006/relationships/image" Target="../media/findings_path_wide.png"/>'
                      '</Relationships>')
        open(rp, 'w', encoding='utf-8').write(s)
    ct = os.path.join(TPL, '[Content_Types].xml')
    s = open(ct, encoding='utf-8').read()
    if 'Extension="png"' not in s:
        s = s.replace('<Default Extension="jpeg"',
                      '<Default Extension="png" ContentType="image/png"/><Default Extension="jpeg"')
    if '/ppt/notesMasters/notesMaster1.xml' not in s:
        s = s.replace('</Types>',
                      '<Override PartName="/ppt/notesMasters/notesMaster1.xml" '
                      'ContentType="application/vnd.openxmlformats-officedocument.'
                      'presentationml.notesMaster+xml"/></Types>')
    if '/ppt/theme/theme2.xml' not in s:
        s = s.replace('</Types>',
                      '<Override PartName="/ppt/theme/theme2.xml" '
                      'ContentType="application/vnd.openxmlformats-officedocument.'
                      'theme+xml"/></Types>')
    for n in range(1, 18):
        tag = f'/ppt/notesSlides/notesSlide{n}.xml'
        if tag not in s:
            s = s.replace('</Types>',
                          f'<Override PartName="{tag}" ContentType="application/vnd.openxmlformats-'
                          f'officedocument.presentationml.notesSlide+xml"/></Types>')
    open(ct, 'w', encoding='utf-8').write(s)

    # ---- speaker notes
    install_notes_master()
    for n, t in NOTES.items():
        add_notes(n, t)

    # ---- repack
    out = os.path.join(W, 'deck_template.pptx')
    if os.path.exists(out):
        os.remove(out)
    parts = []
    for root, _, files in os.walk(TPL):
        for f in files:
            full = os.path.join(root, f)
            parts.append(os.path.relpath(full, TPL).replace(os.sep, '/'))
    parts.sort(key=lambda n: (n != '[Content_Types].xml', n))
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for rel in parts:
            z.write(os.path.join(TPL, rel.replace('/', os.sep)), rel)
    print('wrote', out)


if __name__ == '__main__':
    main()

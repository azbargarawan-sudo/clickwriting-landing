# -*- coding: utf-8 -*-
"""בונה את קובץ עבודה מספר 2 לפי הנחיות הקורס 16459 (ערים ועיור)."""
from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

HEB = "David"
LAT = "Times New Roman"


def set_rtl_paragraph(p):
    pPr = p._p.get_or_add_pPr()
    bidi = pPr.find(qn('w:bidi'))
    if bidi is None:
        bidi = OxmlElement('w:bidi')
        pPr.append(bidi)
    bidi.set(qn('w:val'), '1')


def style_run(run, size=12, bold=False, superscript=False, latin=False):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.name = LAT if latin else HEB
    rPr = run._r.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.insert(0, rFonts)
    rFonts.set(qn('w:ascii'), LAT if latin else HEB)
    rFonts.set(qn('w:hAnsi'), LAT if latin else HEB)
    rFonts.set(qn('w:cs'), HEB)
    szCs = OxmlElement('w:szCs')
    szCs.set(qn('w:val'), str(int(size * 2)))
    rPr.append(szCs)
    if bold:
        rPr.append(OxmlElement('w:bCs'))
    if not latin:
        rPr.append(OxmlElement('w:rtl'))
    if superscript:
        run.font.superscript = True


def para(doc, text='', size=12, bold=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY,
         spacing=2.0, space_after=0, space_before=0):
    p = doc.add_paragraph()
    set_rtl_paragraph(p)
    p.alignment = align
    pf = p.paragraph_format
    pf.line_spacing = spacing
    pf.space_after = Pt(space_after)
    pf.space_before = Pt(space_before)
    if text:
        style_run(p.add_run(text), size=size, bold=bold)
    return p


def T(p, text, size=12, bold=False, latin=False):
    style_run(p.add_run(text), size=size, bold=bold, latin=latin)


def N(p, num, size=12):
    """מספר הערת שוליים, אחרי סימן הפיסוק."""
    style_run(p.add_run(str(num)), size=size, superscript=True)


def add_page_number_footer(section):
    p = section.footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_rtl_paragraph(p)
    p.paragraph_format.line_spacing = 1.0
    run = p.add_run()
    style_run(run, size=12)
    for el, attrs, txt in (('w:fldChar', {'w:fldCharType': 'begin'}, None),
                           ('w:instrText', {'xml:space': 'preserve'}, ' PAGE '),
                           ('w:fldChar', {'w:fldCharType': 'end'}, None)):
        e = OxmlElement(el)
        for k, v in attrs.items():
            e.set(qn(k), v)
        if txt:
            e.text = txt
        run._r.append(e)


doc = Document()

sec = doc.sections[0]
sec.page_height, sec.page_width = Cm(29.7), Cm(21.0)
for attr in ('top_margin', 'bottom_margin', 'left_margin', 'right_margin'):
    setattr(sec, attr, Cm(2.5))
sec._sectPr.append(OxmlElement('w:rtlGutter'))
add_page_number_footer(sec)

normal = doc.styles['Normal']
normal.font.name = HEB
normal.font.size = Pt(12)
normal.element.rPr.rFonts.set(qn('w:cs'), HEB)
normal.element.rPr.rFonts.set(qn('w:ascii'), LAT)
normal.element.rPr.rFonts.set(qn('w:hAnsi'), LAT)

QUESTION = ("תאר, בהתבסס על ספרות המחקר, את מעורבותן של האוכלוסייה היהודית "
            "והאוכלוסייה הערבית בתהליך העיור בארץ-ישראל בשלהי התקופה "
            "העות'מאנית, והצג נתונים כמותיים המבטאים את היקף השפעתן על הערים.")

# ========================= עמוד 1: דף שער =========================
para(doc, spacing=1.0)
para(doc, 'עבודה מספר 2', size=16, bold=True,
     align=WD_ALIGN_PARAGRAPH.CENTER, spacing=1.5, space_after=16)
para(doc, 'שאלת העבודה:', bold=True,
     align=WD_ALIGN_PARAGRAPH.CENTER, spacing=1.5, space_after=6)
para(doc, QUESTION, align=WD_ALIGN_PARAGRAPH.CENTER,
     spacing=1.5, space_after=28)

for label, value in (
    ('שם הקורס:', "ערים ועיור בשלהי התקופה העות'מאנית"),
    ('מספר הקורס:', '16459'),
    ('שם המרצה:', "פרופ' תמיר גורן"),
    ('שם פרטי ומשפחה:', 'שהד בשארה'),
    ('מספר תעודת זהות:', '213181282'),
    ('תאריך הגשה:', '31.7.2026'),
):
    p = para(doc, align=WD_ALIGN_PARAGRAPH.CENTER, spacing=1.5, space_after=4)
    T(p, label + ' ', bold=True)
    T(p, value)

for _ in range(20):
    para(doc, spacing=1.0)

para(doc,
     'הריני מצהיר/ה ומאשר/ת שלא נעשה שימוש בבינה מלאכותית לצורך הכנת עבודה זו.',
     align=WD_ALIGN_PARAGRAPH.CENTER, spacing=1.5)

# ===================== עמודים 2-3: גוף התשובה =====================
doc.add_page_break()

para(doc, "מעורבות האוכלוסייה היהודית והאוכלוסייה הערבית בתהליך העיור",
     size=13, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, spacing=1.5,
     space_after=8)

p = para(doc)
T(p, "תהליך העיור בשלהי התקופה העות'מאנית לא הונע בידי גורם דמוגרפי אחד. "
     "האוכלוסייה היהודית הייתה קטנה בהרבה אך כמעט כולה עירונית, וריכזה את "
     "כובד משקלה בכמה ערים בודדות. האוכלוסייה הערבית הייתה רוב מכריע ורובה "
     "כפרית, ובכל זאת סיפקה לערים את עיקר גידולן הדמוגרפי, את הנהגתן "
     "המוניציפלית ואת מרבית פעילותן הכלכלית.")

para(doc, 'מעורבות האוכלוסייה היהודית', bold=True,
     align=WD_ALIGN_PARAGRAPH.RIGHT, spacing=1.5, space_before=6, space_after=2)

p = para(doc)
T(p, "הסימן המובהק של הנוכחות היהודית היה ריכוזה בעיר. בן-אריה הראה כי הגידול "
     "היהודי בירושלים הוא שהפך אותה לעיר הגדולה בארץ, וכי כבר בשנות השבעים של "
     "המאה התשע-עשרה היוו בה היהודים רוב יחסי.")
N(p, 1)
T(p, " המעורבות התבטאה בראש ובראשונה בבנייה. מהקמת משכנות שאננים ב-1860 ועד "
     "מלחמת העולם הראשונה נוסדו מחוץ לחומות ירושלים עשרות שכונות, ורובן "
     "המכריע יהודיות, ביוזמת חברות בנייה, כוללים ופילנתרופים.")
N(p, 2)
T(p, " ייחודה היה במימונה: היא לא צמחה מן הכלכלה המקומית אלא מהון שהוזרם מחוץ "
     "לארץ, מכספי החלוקה, ממונטיפיורי ומהברון רוטשילד.")
N(p, 3)

p = para(doc)
T(p, "ביפו לבשה המעורבות אופי אחר. חברת אחוזת בית, שנוסדה ב-1906, רכשה קרקע "
     "מצפון לעיר והקימה עליה ב-1909 שכונה מתוכננת מראש ובה חלוקת מגרשים "
     "אחידה, רחובות רחבים ותקנון בנייה מחייב. כץ מדגיש שהייתה זו יחידה עירונית "
     "מתוכננת ולא התרחבות אורגנית של גרעין קיים.")
N(p, 4)
T(p, " דגם דומה הופיע בחיפה עם ייסוד שכונת הרצליה על הכרמל באותה שנה.")
N(p, 5)
T(p, " המעורבות הייתה גם מוסדית: מאז הקמת עיריית ירושלים בשנות השישים ישבו "
     "במועצתה נציגים יהודים לצד מוסלמים ונוצרים, אף שראשות העיר נותרה כל "
     "התקופה בידי משפחות מוסלמיות.")
N(p, 6)

para(doc, 'מעורבות האוכלוסייה הערבית', bold=True,
     align=WD_ALIGN_PARAGRAPH.RIGHT, spacing=1.5, space_before=6, space_after=2)

p = para(doc)
T(p, "גרוסמן חלק על תדמיתה של אוכלוסייה ערבית קפואה ומדולדלת והראה שהיא גדלה "
     "בקצב ניכר ונעה בתוך הארץ.")
N(p, 7)
T(p, " תנועה זו היא שהזינה את ערי החוף. אליהן נהרו פלאחים מן הכפרים, לצד "
     "מהגרים ממצרים שהגיעו בעקבות שלטון אבראהים פאשא, מן החוראן, מלבנון "
     "ומצפון אפריקה. יזבק מראה שצמיחתה של חיפה נשענה כמעט כולה על הגירה ערבית, "
     "פנימית וחיצונית, שהפכה עיירת חוף קטנה לעיר מעורבת בעלת רוב מוסלמי ומיעוט "
     "נוצרי גדול.")
N(p, 8)

p = para(doc)
T(p, "ההנהגה העירונית הייתה ערבית כמעט לחלוטין. משפחות האעיאן החזיקו ברשויות "
     "המקומיות ובמשרות המנהל: בירושלים התחלפו בראשות העיר בני חוסייני, "
     "ח'אלדי, עלמי ודג'אני, ובטבריה מילאה משפחת טברי תפקיד מקביל.")
N(p, 9)
T(p, " גם הכלכלה העירונית נשענה על סוחרים ובעלי מלאכה ערבים: תעשיית הסבון של "
     "שכם, ייצוא השעורה מעזה, ומעל הכול ענף ההדרים של יפו.")
N(p, 10)
T(p, " התעשרותו של מעמד סוחרים זה שינתה את פני השכונות החדשות, ופוקס הראה כיצד "
     "נולדו בעקבותיה טיפוסי בית חדשים, ובהם בית הליואן ובית החלל המרכזי בעל גג "
     "הרעפים.")
N(p, 11)
T(p, " הקרקע שעליה קמו השכונות היהודיות נרכשה מבעלים ערבים, ופועלים ערבים הם "
     "שבנו אותן בפועל.")
N(p, 12)

para(doc, 'נתונים כמותיים', bold=True,
     align=WD_ALIGN_PARAGRAPH.RIGHT, spacing=1.5, space_before=6, space_after=3)

ROWS = [
    ('העיר', 'ראשית המאה ה-19', 'ערב המלחמה', 'ההרכב ב-1914'),
    ('ירושלים', '8,000-10,000', 'כ-70,000', 'כ-45,000 יהודים, כ-25,000 ערבים'),
    ('יפו', '1,000-1,500', 'כ-45,000', 'כ-15,000 יהודים, היתר ערבים'),
    ('חיפה', 'כ-1,000', 'כ-22,000', 'כ-15% יהודים, היתר ערבים'),
    ('עזה', 'כ-8,000', 'כ-40,000', 'ערבית כמעט כולה'),
    ('שכם', 'כ-7,500', 'כ-25,000', 'ערבית כמעט כולה'),
    ('עכו', 'כ-25,000', 'כ-10,000', 'ערבית כמעט כולה'),
]
table = doc.add_table(rows=len(ROWS), cols=4)
table.style = 'Table Grid'
table.alignment = WD_TABLE_ALIGNMENT.CENTER
table._tbl.tblPr.append(OxmlElement('w:bidiVisual'))
WIDTHS = [Cm(2.2), Cm(3.2), Cm(2.8), Cm(7.8)]
for r, data in enumerate(ROWS):
    for c, val in enumerate(data):
        cell = table.cell(r, c)
        cell.width = WIDTHS[c]
        cp = cell.paragraphs[0]
        set_rtl_paragraph(cp)
        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cp.paragraph_format.line_spacing = 1.0
        cp.paragraph_format.space_after = Pt(0)
        cp.paragraph_format.space_before = Pt(0)
        style_run(cp.add_run(val), size=10, bold=(r == 0))

p = para(doc, spacing=1.0, space_before=2, space_after=6,
         align=WD_ALIGN_PARAGRAPH.RIGHT)
T(p, "טבלה 1: אומדני אוכלוסייה בערי ארץ-ישראל המרכזיות, על-פי בן-אריה וקרק.",
  size=10)
N(p, 13, size=10)

p = para(doc)
T(p, "הנתונים מצביעים על שני סוגי השפעה שונים. היהודים מנו ערב המלחמה כ-85,000 "
     "נפש, פחות מ-12 אחוזים מאוכלוסיית הארץ, אך למעלה מ-85 אחוזים מהם ישבו "
     "בערים, ומשקלם בשלוש הערים הגדולות היה גדול לאין ערוך ממשקלם הארצי: "
     "כ-63,000 מתוך כ-137,000 תושבי ירושלים, יפו וחיפה, קרוב למחצית. "
     "האוכלוסייה הערבית מנתה כ-700,000 נפש והייתה עירונית בשיעור של כרבע בלבד, "
     "אך בערכים מוחלטים סיפקה את רוב תושבי הערים ואת כלל אוכלוסייתן של עזה, "
     "שכם, חברון ועכו.")

p = para(doc)
T(p, "גם בכלכלה העירונית ניכר ההבדל. שלושים בתי הבד לסבון בשכם ייצרו ב-1907 "
     "כ-5,000 טונות בשנה, למעלה ממחצית תפוקת הסבון בארץ, ומיפו יוצאו ב-1913 "
     "כ-1.5 מיליון תיבות תפוזים לעומת כ-200,000 בשנות השמונים, מפרדסים "
     "שהשתרעו על כ-30,000 דונם ורובם בבעלות ערבית.")
N(p, 14)
T(p, " השפעתן של שתי האוכלוסיות הייתה אפוא שונה בטיבה. האוכלוסייה הערבית קבעה "
     "את גודלן של הערים ואת אופיין המנהלי והמסחרי, ואילו האוכלוסייה היהודית "
     "קבעה את קצב גידולן של שלוש ערים בלבד, ובהן את צורתן הבנויה ואת דגם "
     "התכנון שלהן.")

# ================= עמוד 4: רשימת הערות השוליים =================
doc.add_page_break()

para(doc, 'ספרות המחקר: רשימת הערות השוליים', size=13, bold=True,
     align=WD_ALIGN_PARAGRAPH.CENTER, spacing=1.5, space_after=8)

B, R = 1, 0  # bold / regular
NOTES = [
    [("יהושע בן-אריה, ", R),
     ('"שנים-עשר היישובים הגדולים בארץ-ישראל במאה התשע-עשרה", ', R),
     ("קתדרה", B), (", 19 (ניסן תשמ\"א), עמ' 83-143.", R)],
    [("רות קרק ומיכל אורן-נורדהיים, ", R),
     ("ירושלים וסביבותיה: רבעים, שכונות וכפרים 1800-1948", B),
     (", ירושלים, אקדמון, 1995, עמ' 65-94.", R)],
    [("יהושע בן-אריה, ", R), ("עיר בראי תקופה: ירושלים החדשה בראשיתה", B),
     (", ירושלים, יד יצחק בן-צבי, 1988, עמ' 472-499.", R)],
    [("יוסי כץ, ", R),
     ('"חברת \'אחוזת בית\' 1906-1909: הנחת היסודות להקמתה של תל אביב", ', R),
     ("קתדרה", B), (", 33 (1984), עמ' 161-191.", R)],
    [("יוסי כץ, ", R),
     ('"הקמתה וראשיתה של שכונת הרצליה: השכונה העברית הראשונה על הכרמל", ', R),
     ("אופקים בגאוגרפיה", B), (", 8 (1983), עמ' 49-56.", R)],
    [("רות קרק, ", R), ('"עיריית ירושלים בשלהי השלטון העות\'מאני", ', R),
     ("קתדרה", B), (", 6 (תשל\"ח), עמ' 74-94.", R)],
    [("דוד גרוסמן, ", R),
     ('"האוכלוסייה הערבית בארץ ישראל בתקופה העות\'מאנית: תדמית ומציאות", ', R),
     ("אופקים בגאוגרפיה", B), (", 68-69 (תשס\"ח), עמ' 6-34.", R)],
    [("מחמוד יזבק, ", R),
     ('"חיפה העות\'מאנית: צמיחה דמוגרפית וריבוי עדתי", ', R),
     ("אופקים בגאוגרפיה", B), (", 73-74 (2009), עמ' 58-76; אלכס כרמל, ", R),
     ("תולדות חיפה בימי התורכים", B),
     (", חיפה, אוניברסיטת חיפה, 2002, עמ' 161-197.", R)],
    [("מוסטפא עבאסי, ", R),
     ('"משפחת טברי והנהגת הקהילה הערבית בטבריה בשלהי התקופה העות\'מאנית '
      'ובתקופת המנדט", ', R), ("קתדרה", B), (", 120 (2006), עמ' 183-200.", R)],
    [("נחום גרוס, ", R),
     ('"תמורות כלכליות בארץ-ישראל בסוף התקופה העות\'מאנית", ', R),
     ("קתדרה", B), (", 2 (תשל\"ז), עמ' 111-125.", R)],
    [("רון פוקס, ", R),
     ('"הבית הערבי הארץ-ישראלי: עיון מחודש, חלק ב: התמורות בתרבות המגורים '
      'במאה התשע-עשרה", ', R), ("קתדרה", B),
     (", 90 (טבת תשנ\"ט), עמ' 53-86.", R)],
    [("בועז לב טוב, ", R),
     ('"שכנים נוכחים: קשרים תרבותיים בין יהודים לערבים בארץ-ישראל בשלהי '
      'התקופה העות\'מאנית", ', R), ("זמנים", B),
     (", 110 (2012), עמ' 42-54.", R)],
    [("בן-אריה, ", R), ('"שנים-עשר היישובים הגדולים", ', R),
     ("עמ' 88-140; רות קרק, ", R),
     ('"ירושלים ויפו במאה הי"ט כערים מזרח תיכוניות מסורתיות", ', R),
     ("מחקרים בגאוגרפיה של ארץ-ישראל", B), (", י (1978), עמ' 75-95.", R)],
    [("גרוס, ", R), ('"תמורות כלכליות", ', R), ("עמ' 118-125; רות קרק, ", R),
     ('"השינוי במעמדן של ערי החוף במאה הי"ט", ', R),
     ("בנימין זאב קדר ואחרים (עורכים), ", R),
     ("פרקים בתולדות המסחר בארץ ישראל", B),
     (", ירושלים, יד יצחק בן-צבי, 1990, עמ' 324-337.", R)],
]

for i, parts in enumerate(NOTES, start=1):
    p = doc.add_paragraph()
    set_rtl_paragraph(p)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = p.paragraph_format
    pf.line_spacing = 1.5
    pf.space_after = Pt(2)
    pf.left_indent = Cm(0.8)
    pf.first_line_indent = Cm(-0.8)
    T(p, "{}. ".format(i))
    for txt, bold in parts:
        T(p, txt, bold=bool(bold))

# --- Word דורש את צאצאי pPr/rPr/sectPr בסדר הסכמה ---
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
ORDER = {
    'pPr': ['pStyle', 'keepNext', 'keepLines', 'pageBreakBefore', 'framePr',
            'widowControl', 'numPr', 'suppressLineNumbers', 'pBdr', 'shd',
            'tabs', 'suppressAutoHyphens', 'kinsoku', 'wordWrap',
            'overflowPunct', 'topLinePunct', 'autoSpaceDE', 'autoSpaceDN',
            'bidi', 'adjustRightInd', 'snapToGrid', 'spacing', 'ind',
            'contextualSpacing', 'mirrorIndents', 'suppressOverlap', 'jc',
            'textDirection', 'textAlignment', 'textboxTightWrap', 'outlineLvl',
            'divId', 'cnfStyle', 'rPr', 'sectPr', 'pPrChange'],
    'rPr': ['rStyle', 'rFonts', 'b', 'bCs', 'i', 'iCs', 'caps', 'smallCaps',
            'strike', 'dstrike', 'outline', 'shadow', 'emboss', 'imprint',
            'noProof', 'snapToGrid', 'vanish', 'webHidden', 'color', 'spacing',
            'w', 'kern', 'position', 'sz', 'szCs', 'highlight', 'u', 'effect',
            'bdr', 'shd', 'fitText', 'vertAlign', 'rtl', 'cs', 'em', 'lang',
            'eastAsianLayout', 'specVanish', 'oMath'],
    'sectPr': ['footnotePr', 'endnotePr', 'type', 'pgSz', 'pgMar', 'paperSrc',
               'pgBorders', 'lnNumType', 'pgNumType', 'cols', 'formProt',
               'vAlign', 'noEndnote', 'titlePg', 'textDirection', 'bidi',
               'rtlGutter', 'docGrid', 'printerSettings', 'sectPrChange'],
}
KEEP_FIRST = ('headerReference', 'footerReference')

roots = [doc.element.body, doc.styles.element]
for s in doc.sections:
    roots += [s.header._element, s.footer._element]
for root in roots:
    for tag, order in ORDER.items():
        for el in root.iter(W + tag):
            children = list(el)
            head = [c for c in children if c.tag.split('}')[-1] in KEEP_FIRST]
            rest = [c for c in children if c not in head]
            rest.sort(key=lambda c: order.index(c.tag.split('}')[-1])
                      if c.tag.split('}')[-1] in order else len(order))
            for c in head + rest:
                el.append(c)

OUT = "/home/user/clickwriting-landing/עבודה_2_ערים_ועיור_שהד_בשארה.docx"
doc.save(OUT)
print("saved:", OUT)

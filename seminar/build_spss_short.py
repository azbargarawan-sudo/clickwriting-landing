# -*- coding: utf-8 -*-
"""SPSS-style output document computed from the SIMULATED dataset (N=65). Also writes .sav and .sps files."""
import numpy as np, pandas as pd, datetime
from scipy import stats
import statsmodels.api as sm
from statsmodels.stats.diagnostic import lilliefors
import pyreadstat
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

df = pd.read_csv('simulated_data_N65_for_JASP.csv')
N = len(df)
STAMP = datetime.datetime.now().strftime('%d-%b-%Y %H:%M:%S').upper()

VLAB = {
 'Group_LD': 'קבוצה (לקות למידה)', 'Gender': 'מין', 'Age': 'גיל', 'Grade': 'כיתה', 'Sector': 'מגזר',
 'ADHD': 'אבחנת הפרעת קשב', 'Accommodations': 'התאמות בלמידה/בחינות', 'Medication': 'טיפול תרופתי לקשב',
 'Screen_Leisure_Avg': 'זמן מסך פנאי יומי ממוצע (שעות)', 'Screen_Leisure_WD': 'זמן מסך פנאי ביום חול (שעות)',
 'Screen_Leisure_WE': 'זמן מסך פנאי בסוף שבוע (שעות)', 'Screen_Bedroom': 'מסך בחדר השינה', 'Screen_BeforeBed': 'מסך לפני השינה',
 'Bedtime_WD': 'שעת שינה ביום חול', 'Sleep_Dur_WD': 'משך שינה ביום חול (שעות)', 'Sleep_Dur_WE': 'משך שינה בסוף שבוע (שעות)',
 'Weekend_Shift': 'איחור שעת השינה בסוף השבוע (שעות)', 'Sleep_Onset': 'זמן הירדמות', 'Sleepiness_Total': 'ישנוניות יומית (סכום 8 פריטים, 0-32)',
 'PA_Days60': 'ימים בשבוע עם 60 דקות פעילות גופנית', 'PA_Hours_Vig': 'שעות פעילות נמרצת בשבוע', 'PA_Freq_Vig': 'תדירות פעילות נמרצת (הפוך)', 'PA_Club': 'חוג/קבוצת ספורט',
 'Grade_Avg': 'ממוצע ציונים', 'Grade_Math': 'ציון מתמטיקה', 'Grade_English': 'ציון אנגלית', 'Func_Total': 'תפקוד יומי בלמידה (ממוצע 5 פריטים, 1-5)',
 'Meet_Screen': 'עמידה בהמלצת מסכים', 'Meet_Sleep': 'עמידה בהמלצת שינה', 'Meet_PA': 'עמידה בהמלצת פעילות גופנית', 'Guidelines_Count': 'מספר המלצות שמתקיימות',
 'Guidelines_Grp': 'מספר המלצות (מקובץ)',
 'S1': 'נרדם/ישנוני בשיעור', 'S2': 'נרדם/ישנוני בשיעורי בית', 'S3': 'ערני רוב היום (הפוך)', 'S3R': 'ערני רוב היום (מהופך)', 'S4': 'עייף ועצבני במהלך היום',
 'S5': 'קשה לקום בבוקר', 'S6': 'חוזר לישון אחרי שהתעורר', 'S7': 'צריך שיעירו אותו', 'S8': 'מרגיש שצריך יותר שינה',
 'F1': 'מצליח להתרכז בשיעורים', 'F2': 'מכין שיעורי בית בזמן', 'F3': 'מגיע בזמן לשיעור הראשון', 'F4': 'מרגיש עייף בשיעורים (הפוך)', 'F4R': 'מרגיש עייף בשיעורים (מהופך)', 'F5': 'מאמין ביכולת להצליח',
}
VALLAB = {
 'Group_LD': {0: 'ללא לקות למידה', 1: 'עם לקות למידה'}, 'Gender': {1: 'בן', 2: 'בת'},
 'Grade': {7: "ז'", 8: "ח'", 9: "ט'", 10: "י'", 11: 'י"א', 12: 'י"ב'}, 'Sector': {1: 'יהודי', 2: 'ערבי', 3: 'דרוזי'},
 'ADHD': {0: 'לא', 1: 'כן'}, 'Accommodations': {0: 'לא', 1: 'כן'}, 'Medication': {0: 'לא', 1: 'כן'},
 'Meet_Screen': {0: 'לא עומד', 1: 'עומד'}, 'Meet_Sleep': {0: 'לא עומד', 1: 'עומד'}, 'Meet_PA': {0: 'לא עומד', 1: 'עומד'},
 'Guidelines_Count': {0: '0', 1: '1', 2: '2', 3: '3'}, 'Guidelines_Grp': {0: 'אף המלצה', 1: 'המלצה אחת', 2: 'שתיים או שלוש'},
 'Screen_Bedroom': {0: 'לא', 1: 'כן'}, 'PA_Club': {0: 'לא', 1: 'לא תחרותי', 2: 'תחרותי'},
}
df['S3R'] = 4 - df['S3']; df['F4R'] = 6 - df['F4']
df['Guidelines_Grp'] = df['Guidelines_Count'].clip(upper=2)

# ---------- number formatting like SPSS ----------
def f(x, d=3):
    if x is None or (isinstance(x, float) and np.isnan(x)): return ''
    s = f"{x:.{d}f}"
    if abs(x) < 1 and d > 0: s = s.replace('0.', '.', 1) if s.startswith('0.') else s.replace('-0.', '-.', 1)
    return s
def fp(p):
    return '<.001' if p < .001 else f(p, 3)
def stars(p): return '**' if p < .01 else ('*' if p < .05 else '')

# ---------- document helpers ----------
doc = Document()
st = doc.styles['Normal']; st.font.name = 'Arial'; st.font.size = Pt(10)
st.element.rPr.rFonts.set(qn('w:eastAsia'), 'Arial'); st.element.rPr.rFonts.set(qn('w:cs'), 'Arial')
for s in doc.sections:
    s.left_margin = s.right_margin = Cm(2); s.top_margin = s.bottom_margin = Cm(2)

def para(text, bold=False, size=10, color=None, align=None, italic=False, space_after=4):
    p = doc.add_paragraph(); r = p.add_run(text); r.bold = bold; r.italic = italic; r.font.size = Pt(size); r.font.name = 'Arial'
    if color: r.font.color.rgb = RGBColor(*color)
    if align: p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    return p
def proc_title(t): para(t, bold=True, size=14, space_after=6)
def tbl_title(t): para(t, bold=True, size=11, space_after=2)
def note(t): para(t, size=8, space_after=8)

def set_cell_border(cell, **kw):
    tcPr = cell._tc.get_or_add_tcPr(); b = OxmlElement('w:tcBorders')
    for edge in ('top', 'left', 'bottom', 'right'):
        v = kw.get(edge)
        if v:
            el = OxmlElement(f'w:{edge}'); el.set(qn('w:val'), v); el.set(qn('w:sz'), '4'); el.set(qn('w:color'), '000000'); b.append(el)
    tcPr.append(b)

def table(rows, header_rows=1, col_widths=None, shade_first_col=True, font_size=9, bold_first_col=True):
    """rows: list of lists of str. header rows get bold + bottom border."""
    ncol = max(len(r) for r in rows)
    t = doc.add_table(rows=len(rows), cols=ncol); t.alignment = WD_TABLE_ALIGNMENT.LEFT
    t.style = 'Table Grid'
    for i, r in enumerate(rows):
        for j in range(ncol):
            v = r[j] if j < len(r) else ''
            c = t.cell(i, j); c.text = ''
            p = c.paragraphs[0]; run = p.add_run(str(v)); run.font.size = Pt(font_size); run.font.name = 'Arial'
            is_head = i < header_rows
            run.bold = is_head or (bold_first_col and j == 0 and str(v) != '')
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if (is_head or j > 0) else WD_ALIGN_PARAGRAPH.LEFT
            if is_head or (shade_first_col and j == 0):
                tcPr = c._tc.get_or_add_tcPr(); sh = OxmlElement('w:shd'); sh.set(qn('w:val'), 'clear'); sh.set(qn('w:color'), 'auto'); sh.set(qn('w:fill'), 'EDEDED'); tcPr.append(sh)
    if col_widths:
        for j, w in enumerate(col_widths):
            for i in range(len(rows)): t.cell(i, j).width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t

def notes_table(syntax, n_rows=N, filt='<none>', cases='Statistics are based on all cases with valid data.', extra=None):
    rows = [['Notes', '', ''],
            ['Output Created', '', STAMP], ['Comments', '', ''],
            ['Input', 'Active Dataset', 'DataSet1'], ['', 'Filter', filt], ['', 'Weight', '<none>'], ['', 'Split File', '<none>'],
            ['', 'N of Rows in Working Data File', str(n_rows)],
            ['Missing Value Handling', 'Definition of Missing', 'User-defined missing values are treated as missing.'], ['', 'Cases Used', cases],
            ['Syntax', '', syntax],
            ['Resources', 'Processor Time', '00:00:00.02'], ['', 'Elapsed Time', '00:00:00.02']]
    if extra: rows += extra
    table(rows, header_rows=1, col_widths=[4.2, 5.0, 8.0], font_size=8)

SYNTAX = []  # collected for the .sps file
def syn(s): SYNTAX.append(s); return s


def rq(title, sub):
    para(title, bold=True, size=13, align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=2)
    para(sub, size=9, italic=True, align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=6)

para('פלטי SPSS לפי שאלות המחקר: חשיפה למסכים, שינה ופעילות גופנית בקרב תלמידים עם לקויות למידה', bold=True, size=14, align=WD_ALIGN_PARAGRAPH.RIGHT)
para('נתונים מדומים לתרגול בלבד (N = 65: 40 עם לקות למידה, 25 ללא). הטבלאות חושבו מקובץ הסימולציה ואינן ממצאי מחקר. הן מדגימות אילו פלטים נדרשים לכל שאלת מחקר ואיך ייראו עם הנתונים האמיתיים.', size=10, color=(192, 0, 0), align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=12)

ld = df[df.Group_LD == 1]; nld = len(ld); g0 = df[df.Group_LD == 0]; g1 = ld

# ---------- 0. sample + reliability ----------
rq('רקע: תיאור המדגם ומהימנות הכלים', 'Frequencies (Group_LD, Gender, Grade) ו-Reliability לשני הסולמות')
for v in ['Group_LD', 'Gender', 'Grade']:
    tbl_title(VLAB[v]); vc = df[v].value_counts().sort_index(); cum = 0
    rows = [['', 'Frequency', 'Percent', 'Cumulative Percent']]
    for k, n in vc.items():
        cum += n; rows.append([VALLAB[v][k], str(n), f(100 * n / N, 1), f(100 * cum / N, 1)])
    rows.append(['Total', str(N), '100.0', ''])
    table(rows, col_widths=[4, 2.2, 2.2, 3])
tbl_title('Reliability Statistics')
rows = [['Scale', "Cronbach's Alpha", 'N of Items', 'N']]
for items, name in ((['S1','S2','S3R','S4','S5','S6','S7','S8'], 'ישנוניות יומית'), (['F1','F2','F3','F4R','F5'], 'תפקוד יומי בלמידה')):
    X = df[items].astype(float); k = len(items); alpha = k/(k-1)*(1 - X.var(ddof=1).sum()/X.sum(axis=1).var(ddof=1))
    rows.append([name, f(alpha), str(k), str(N)])
table(rows, col_widths=[4.5, 3, 2.5, 1.5])

# ---------- RQ1 ----------
rq('שאלת מחקר 1: דפוסי המסכים, השינה והפעילות הגופנית ושיעור העמידה בהמלצות', 'Descriptives לפי קבוצה + Frequencies של משתני העמידה בהמלצות בקבוצת המחקר')
dv = ['Screen_Leisure_Avg', 'Bedtime_WD', 'Sleep_Dur_WD', 'Weekend_Shift', 'Sleepiness_Total', 'PA_Days60']
tbl_title('Descriptive Statistics (Split by Group_LD)')
rows = [['', VLAB['Group_LD'], 'N', 'Minimum', 'Maximum', 'Mean', 'Std. Deviation']]
for v in dv:
    for k, g in ((1, g1), (0, g0)):
        rows.append([VLAB[v] if k == 1 else '', VALLAB['Group_LD'][k], str(len(g)), f(g[v].min(), 2), f(g[v].max(), 2), f(g[v].mean(), 2), f(g[v].std(ddof=1), 3)])
table(rows, col_widths=[5.2, 3, 1.2, 1.8, 1.8, 1.8, 2.2], font_size=8)
tbl_title('עמידה בהמלצות בקבוצת המחקר (Group_LD = 1)')
rows = [['', '', 'Frequency', 'Percent']]
for v in ['Meet_Screen', 'Meet_Sleep', 'Meet_PA']:
    n1 = int(ld[v].sum()); rows.append([VLAB[v], 'עומד', str(n1), f(100 * n1 / nld, 1)]); rows.append(['', 'לא עומד', str(nld - n1), f(100 * (nld - n1) / nld, 1)])
vc = ld['Guidelines_Count'].value_counts().sort_index()
for i, (k, n) in enumerate(vc.items()): rows.append([VLAB['Guidelines_Count'] if i == 0 else '', str(k), str(n), f(100 * n / nld, 1)])
rows.append(['', 'Total', str(nld), '100.0'])
table(rows, col_widths=[5.5, 3, 2.2, 2.2])

# ---------- correlations helper ----------
def corr_table(a_vars, b_vars, sub):
    rows = [['', ''] + [VLAB[b] for b in b_vars]]
    for a in a_vars:
        r1, r2, r3 = [VLAB[a], 'Pearson Correlation'], ['', 'Sig. (2-tailed)'], ['', 'N']
        for b in b_vars:
            r, p = stats.pearsonr(sub[a], sub[b]); r1.append(f(r) + stars(p)); r2.append(fp(p)); r3.append(str(len(sub)))
        rows += [r1, r2, r3]
    table(rows, font_size=8)
    note('**. Correlation is significant at the 0.01 level (2-tailed).  *. Correlation is significant at the 0.05 level (2-tailed).')

# ---------- RQ2 / H1 ----------
rq('שאלת מחקר 2 / השערה 1: חשיפה למסכים ושינה', 'Correlations (Pearson) בקבוצת המחקר בלבד, n = 40. צפוי: מתאם שלילי עם משך השינה, חיובי עם שעת השינה ועם הישנוניות')
tbl_title('Correlations')
corr_table(['Screen_Leisure_Avg', 'Screen_BeforeBed'], ['Sleep_Dur_WD', 'Bedtime_WD', 'Weekend_Shift', 'Sleepiness_Total'], ld)

# ---------- RQ3 / H2 ----------
rq('שאלת מחקר 3 / השערה 2: חשיפה למסכים ופעילות גופנית', 'Correlations (Pearson) בקבוצת המחקר, n = 40. צפוי: מתאם שלילי. שימו לב: PA_Freq_Vig מקודד הפוך (ערך גבוה = פחות פעילות)')
tbl_title('Correlations')
corr_table(['Screen_Leisure_Avg'], ['PA_Days60', 'PA_Hours_Vig', 'PA_Freq_Vig'], ld)

# ---------- RQ4 / H3 ----------
rq('שאלת מחקר 4 / השערה 3: שלוש ההתנהגויות והתפקוד הלימודי', 'Correlations בקבוצת המחקר + Linear Regression (Enter) עם ממוצע הציונים כמשתנה תלוי')
tbl_title('Correlations')
corr_table(['Screen_Leisure_Avg', 'Sleep_Dur_WD', 'Weekend_Shift', 'Sleepiness_Total', 'PA_Days60'], ['Grade_Avg', 'Grade_Math', 'Grade_English', 'Func_Total'], ld)
preds = ['Screen_Leisure_Avg', 'Sleep_Dur_WD', 'Weekend_Shift', 'PA_Days60', 'Sleepiness_Total']
y = ld['Grade_Avg'].astype(float); X = sm.add_constant(ld[preds].astype(float)); m = sm.OLS(y, X).fit()
tbl_title('Model Summary')
table([['Model', 'R', 'R Square', 'Adjusted R Square', 'Std. Error of the Estimate'], ['1', f(np.sqrt(m.rsquared)), f(m.rsquared), f(m.rsquared_adj), f(np.sqrt(m.mse_resid), 4)]], col_widths=[1.5, 2, 2.2, 3, 3.5], shade_first_col=False, bold_first_col=False)
tbl_title('ANOVAᵃ')
table([['Model', '', 'Sum of Squares', 'df', 'Mean Square', 'F', 'Sig.'], ['1', 'Regression', f(m.ess, 3), str(int(m.df_model)), f(m.ess / m.df_model, 3), f(m.fvalue), fp(m.f_pvalue)], ['', 'Residual', f(m.ssr, 3), str(int(m.df_resid)), f(m.mse_resid, 3), '', ''], ['', 'Total', f(m.ess + m.ssr, 3), str(nld - 1), '', '', '']], col_widths=[1.2, 2.5, 2.6, 1.2, 2.4, 1.6, 1.5], font_size=8)
note(f"a. Dependent Variable: {VLAB['Grade_Avg']}. Predictors: (Constant), " + ', '.join(VLAB[p] for p in preds))
tbl_title('Coefficientsᵃ')
rows = [['Model', '', 'Unstandardized B', 'Std. Error', 'Standardized Beta', 't', 'Sig.']]
Xp = ld[preds].astype(float)
for i, name in enumerate(['const'] + preds):
    beta = '' if name == 'const' else f(m.params[name] * Xp[name].std(ddof=1) / y.std(ddof=1))
    rows.append(['1' if i == 0 else '', '(Constant)' if name == 'const' else VLAB[name], f(m.params[name], 3), f(m.bse[name], 3), beta, f(m.tvalues[name]), fp(m.pvalues[name])])
table(rows, col_widths=[1.2, 5.5, 2.2, 2, 2.2, 1.6, 1.5], font_size=8)
note(f"a. Dependent Variable: {VLAB['Grade_Avg']}")

# ---------- H4 ----------
rq('השערה 4: מספר ההמלצות שמתקיימות והתפקוד הלימודי', 'One-Way ANOVA: ממוצע ציונים ותפקוד לימודי לפי מספר ההמלצות (0, 1, 2 ומעלה), כלל המדגם. צפוי: ממוצע גבוה יותר אצל העומדים בשתי המלצות לפחות')
groups = [0, 1, 2]
tbl_title('Descriptives')
rows = [['', VLAB['Guidelines_Grp'], 'N', 'Mean', 'Std. Deviation', 'Std. Error']]
for v in ['Grade_Avg', 'Func_Total']:
    for g in groups:
        s = df[df.Guidelines_Grp == g][v]; rows.append([VLAB[v] if g == 0 else '', VALLAB['Guidelines_Grp'][g], str(len(s)), f(s.mean(), 2), f(s.std(ddof=1), 3), f(s.sem(), 3)])
    rows.append(['', 'Total', str(N), f(df[v].mean(), 2), f(df[v].std(ddof=1), 3), f(df[v].sem(), 3)])
table(rows, col_widths=[5, 3, 1.2, 2, 2.4, 2], font_size=8)
tbl_title('ANOVA')
rows = [['', '', 'Sum of Squares', 'df', 'Mean Square', 'F', 'Sig.']]
for v in ['Grade_Avg', 'Func_Total']:
    samples = [df[df.Guidelines_Grp == g][v].astype(float) for g in groups]; grand = df[v].mean()
    ssb = sum(len(s) * (s.mean() - grand) ** 2 for s in samples); ssw = sum(((s - s.mean()) ** 2).sum() for s in samples)
    F_ = (ssb / 2) / (ssw / (N - 3)); p = 1 - stats.f.cdf(F_, 2, N - 3)
    rows += [[VLAB[v], 'Between Groups', f(ssb, 3), '2', f(ssb / 2, 3), f(F_), fp(p)], ['', 'Within Groups', f(ssw, 3), str(N - 3), f(ssw / (N - 3), 3), '', ''], ['', 'Total', f(ssb + ssw, 3), str(N - 1), '', '', '']]
table(rows, col_widths=[4.5, 2.8, 2.4, 1.2, 2.2, 1.6, 1.5], font_size=8)

# ---------- RQ5 / H5 ----------
rq('שאלת מחקר 5 / השערה 5: הבדלים בין תלמידים עם וללא לקות למידה', 'Independent Samples T-Test לחמישה משתנים + Crosstabs (Chi-Square) לעמידה בהמלצות. צפוי: פחות שינה, יותר ישנוניות ופחות פעילות בקבוצת המחקר; אין השערה מכוונת לגבי כמות המסכים')
tvars = ['Screen_Leisure_Avg', 'Sleep_Dur_WD', 'Sleepiness_Total', 'PA_Days60', 'Grade_Avg', 'Func_Total']
tbl_title('Group Statistics')
rows = [['', VLAB['Group_LD'], 'N', 'Mean', 'Std. Deviation', 'Std. Error Mean']]
for v in tvars:
    for k, g in ((1, g1), (0, g0)): rows.append([VLAB[v] if k == 1 else '', VALLAB['Group_LD'][k], str(len(g)), f(g[v].mean(), 2), f(g[v].std(ddof=1), 3), f(g[v].sem(), 3)])
table(rows, col_widths=[5, 3, 1.2, 2, 2.4, 2.4], font_size=8)
tbl_title('Independent Samples Test')
rows = [['', "Levene's Test", '', 't-test for Equality of Means', '', '', '', '', "Cohen's d"], ['', 'F', 'Sig.', 't', 'df', 'Sig. (2-tailed)', 'Mean Difference', 'Std. Error Difference', '']]
for v in tvars:
    a, b = g1[v].astype(float), g0[v].astype(float); lf, lp = stats.levene(a, b, center='mean'); eq = lp >= .05
    t = stats.ttest_ind(a, b, equal_var=eq); n1, n2 = len(a), len(b); md = a.mean() - b.mean()
    sp = np.sqrt(((n1 - 1) * a.var(ddof=1) + (n2 - 1) * b.var(ddof=1)) / (n1 + n2 - 2))
    se = sp * np.sqrt(1 / n1 + 1 / n2) if eq else np.sqrt(a.var(ddof=1) / n1 + b.var(ddof=1) / n2)
    rows.append([VLAB[v] + ('' if eq else ' (equal variances not assumed)'), f(lf), fp(lp), f(t.statistic), f(t.df, 0 if eq else 3), fp(t.pvalue), f(md, 3), f(se, 3), f(md / sp)])
table(rows, header_rows=2, font_size=7)
note('ההפרש מחושב: קבוצת המחקר פחות קבוצת ההשוואה. כאשר מבחן Levene מובהק, מדווחת שורת Equal variances not assumed.')
tbl_title('Crosstabs: קבוצה × עמידה בהמלצות (Chi-Square)')
rows = [['', 'עם לקות למידה: עומד (%)', 'ללא לקות למידה: עומד (%)', 'Pearson Chi-Square', 'df', 'Asymp. Sig. (2-sided)', "Fisher's Exact Sig. (2-sided)"]]
for v in ['Meet_Screen', 'Meet_Sleep', 'Meet_PA']:
    ct = pd.crosstab(df['Group_LD'], df[v]).reindex(index=[0, 1], columns=[0, 1], fill_value=0)
    chi2, p, dof, exp = stats.chi2_contingency(ct.values, correction=False); _, fe = stats.fisher_exact(ct.values)
    rows.append([VLAB[v], f"{ct.loc[1, 1]} ({100 * ct.loc[1, 1] / ct.loc[1].sum():.1f}%)", f"{ct.loc[0, 1]} ({100 * ct.loc[0, 1] / ct.loc[0].sum():.1f}%)", f(chi2), str(dof), fp(p), fp(fe)])
ct = pd.crosstab(df['Group_LD'], df['Guidelines_Grp']); chi2, p, dof, _ = stats.chi2_contingency(ct.values, correction=False)
rows.append([VLAB['Guidelines_Grp'] + ' (0 / 1 / 2+)', ' / '.join(str(ct.loc[1, c]) for c in ct.columns), ' / '.join(str(ct.loc[0, c]) for c in ct.columns), f(chi2), str(dof), fp(p), ''])
table(rows, font_size=8)
note("כאשר יש תאים עם שכיחות צפויה קטנה מ-5 (למשל עמידה בהמלצת הפעילות הגופנית), מדווחים את מבחן Fisher במקום חי בריבוע.")

para('הערה', bold=True, size=11, align=WD_ALIGN_PARAGRAPH.RIGHT)
para('כל הטבלאות כאן מתקבלות מהרצת קובץ הסינטקס seminar_analysis_syntax.sps על קובץ הנתונים. עם הנתונים האמיתיים, פרק הממצאים ייכתב לפי אותו סדר: שאלה 1 תיאורי, שאלות 2 עד 4 מתאמים ורגרסיה, השערה 4 ניתוח שונות, שאלה 5 מבחני t וחי בריבוע.', size=10, align=WD_ALIGN_PARAGRAPH.RIGHT)
doc.save('פלט_SPSS_לפי_שאלות_המחקר_נתונים_מדומים.docx')
print('ok')

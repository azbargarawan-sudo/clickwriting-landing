# -*- coding: utf-8 -*-
"""Status Gantt as of 30.6.2026: completed vs. planned activities."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.patches import Patch
from matplotlib.lines import Line2D
from datetime import date

D = date
# (name, start, end, milestone, done)  -- actual dates as executed until 30.6
tasks = [
    ("בחירת הארגון ואישור נושא הפרויקט מול המנחה", D(2026,3,23), D(2026,4,1),  False, True),
    ("פגישת היכרות עם בעל החברה",                  D(2026,4,1),  D(2026,4,3),  False, True),
    ("לימוד התהליך הקיים ואיסוף חומר רקע",          D(2026,4,3),  D(2026,4,10), False, True),
    ("כתיבת תיאור הארגון והתהליך הארגוני",          D(2026,4,10), D(2026,4,15), False, True),
    ("הגדרת מטרות, יעדים ותיחום",                   D(2026,4,15), D(2026,4,19), False, True),
    ("כתיבת מתודולוגיה ותוכנית עבודה",              D(2026,4,19), D(2026,4,23), False, True),
    ("הכנת תרשים גאנט ועריכת המסמך",               D(2026,4,23), D(2026,4,27), False, True),
    ("הגשת הצעת הפרויקט",                          D(2026,4,28), D(2026,4,28), True,  True),
    ("ראיונות עם בעל החברה והעובדים",              D(2026,5,1),  D(2026,5,7),  False, True),
    ("תרשים תהליכים ארגוניים",                     D(2026,5,7),  D(2026,5,11), False, True),
    ("תרשים מבנה המערכת וסביבת המערכת",            D(2026,5,11), D(2026,5,16), False, True),
    ("תרשים DFD",                                  D(2026,5,16), D(2026,5,20), False, True),
    ("תרשים ERD מפורט",                            D(2026,5,20), D(2026,5,25), False, True),
    ("רשימת מסכי קלט/פלט והסברים",                 D(2026,5,25), D(2026,5,28), False, True),
    ("עריכה והגשת דוח התקדמות 1",                  D(2026,5,28), D(2026,5,31), False, True),
    ("הגשת דוח התקדמות 1 (איפיון)",                D(2026,5,31), D(2026,5,31), True,  True),
    ("ריאיון השלמה עם רואה החשבון (נוסף)",          D(2026,6,1),  D(2026,6,3),  False, True),
    ("מבנה טבלאות בסיס הנתונים ומפתחות",           D(2026,6,3),  D(2026,6,9),  False, True),
    ("מבנה מפורט של הממשקים החיצוניים",            D(2026,6,9),  D(2026,6,14), False, True),
    ("עץ תפריטים",                                 D(2026,6,14), D(2026,6,18), False, True),
    ("עיצוב מפורט של ששת המסכים (Figma)",          D(2026,6,18), D(2026,6,28), False, True),
    ("עריכה והגשת דוח התקדמות 2",                  D(2026,6,28), D(2026,6,30), False, True),
    ("הגשת דוח התקדמות 2 (עיצוב)",                 D(2026,6,30), D(2026,6,30), True,  True),
    ("אימות התוצרים מול בעל החברה ותיקונים",        D(2026,7,1),  D(2026,7,10), False, False),
    ("הכנת מצגת הפרויקט",                          D(2026,7,10), D(2026,7,24), False, False),
    ("תרגול ההצגה ותיקוני מצגת",                   D(2026,7,24), D(2026,7,30), False, False),
    ("העלאת המצגת לאתר הקורס",                     D(2026,7,31), D(2026,7,31), True,  False),
    ("כתיבת מסקנות, סיכום והמלצות",                D(2026,8,1),  D(2026,8,12), False, False),
    ("הצגת הפרויקט בכיתה",                         D(2026,8,15), D(2026,8,15), True,  False),
    ("הרכבת תיק הפרויקט המלא ועריכה",              D(2026,8,10), D(2026,8,25), False, False),
    ("הגהה סופית, הפקת PDF והגשת התיק",            D(2026,8,25), D(2026,8,31), True,  False),
]

C_DONE, C_PLAN = '#2e8b57', '#9db8d2'
fig, ax = plt.subplots(figsize=(16, 9.2))
ax.set_axisbelow(True)

for i, (name, s, e, ms, done) in enumerate(tasks):
    y = len(tasks) - 1 - i
    if ms:
        ax.plot(mdates.date2num(s), y, marker='D', markersize=10,
                color='#1a7a3a' if done else '#c0392b', zorder=5)
    else:
        ax.barh(y, (e - s).days, left=mdates.date2num(s), height=0.62,
                color=C_DONE if done else C_PLAN,
                edgecolor='white', linewidth=0.5, zorder=4)

labels = [f"{i+1}. {t[0]}" for i, t in enumerate(tasks)]
ax.set_yticks([len(tasks) - 1 - i for i in range(len(tasks))])
ax.set_yticklabels(labels, fontsize=12)
ax.set_ylim(-0.8, len(tasks) - 0.2)

ax.xaxis.set_major_locator(mdates.WeekdayLocator(byweekday=mdates.SU))
ax.xaxis.set_major_formatter(mdates.DateFormatter('%d/%m'))
ax.set_xlim(mdates.date2num(D(2026,3,21)), mdates.date2num(D(2026,9,2)))
ax.grid(axis='x', color='#d9d9d9', linewidth=0.7)
ax.tick_params(axis='x', labelsize=10, rotation=90)

months = [D(2026,4,1), D(2026,5,1), D(2026,6,1), D(2026,7,1), D(2026,8,1), D(2026,9,1)]
for m in months:
    ax.axvline(mdates.date2num(m), color='#8a8a8a', linewidth=1.1, zorder=3)
mstarts = [D(2026,3,21)] + months
mlabels = ['03/2026','04/2026','05/2026','06/2026','07/2026','08/2026']
for i in range(len(mlabels)):
    x0 = mdates.date2num(mstarts[i]); x1 = mdates.date2num(mstarts[i+1])
    ax.text((x0+x1)/2, len(tasks)-0.05, mlabels[i], ha='center', va='bottom',
            fontsize=12, fontweight='bold', color='#333333')

# status line 30.6.2026
xs = mdates.date2num(D(2026,6,30))
ax.axvline(xs, color='#c0392b', linewidth=2.2, linestyle='--', zorder=6)
ax.text(xs, -0.7, ' סטטוס: 30.6.2026', color='#c0392b', fontsize=12,
        fontweight='bold', ha='left', va='bottom')

legend_items = [
    Patch(facecolor=C_DONE, label='בוצע והושלם (עד 30.6.2026)'),
    Patch(facecolor=C_PLAN, label='מתוכנן (יולי-אוגוסט 2026)'),
    Line2D([0],[0], marker='D', color='none', markerfacecolor='#1a7a3a', markersize=10,
           label='אבן דרך שהושלמה'),
    Line2D([0],[0], marker='D', color='none', markerfacecolor='#c0392b', markersize=10,
           label='אבן דרך עתידית'),
]
ax.legend(handles=legend_items, loc='lower left', fontsize=11.5, framealpha=0.95)
ax.set_title('תרשים גאנט מעודכן: סטטוס הפרויקט לתאריך 30.6.2026',
             fontsize=17, fontweight='bold', pad=30)
plt.tight_layout()
plt.savefig('gantt_status.png', dpi=200, bbox_inches='tight')
print('gantt_status.png saved')

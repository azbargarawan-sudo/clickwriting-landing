# -*- coding: utf-8 -*-
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.patches import Patch
from matplotlib.lines import Line2D
from datetime import date

def he(s):
    return s

# (name, start, end, phase, milestone)
D = date
tasks = [
    ("בחירת הארגון ואישור נושא הפרויקט מול המנחה", D(2026,3,23), D(2026,4,1),  0, False),
    ("פגישת היכרות עם בעל החברה",                  D(2026,4,1),  D(2026,4,3),  0, False),
    ("לימוד התהליך הקיים ואיסוף חומר רקע",          D(2026,4,3),  D(2026,4,10), 0, False),
    ("כתיבת תיאור הארגון והתהליך הארגוני",          D(2026,4,10), D(2026,4,15), 0, False),
    ("הגדרת מטרות, יעדים ותיחום",                   D(2026,4,15), D(2026,4,19), 0, False),
    ("כתיבת מתודולוגיה ותוכנית עבודה",              D(2026,4,19), D(2026,4,23), 0, False),
    ("הכנת תרשים גאנט ועריכת המסמך",               D(2026,4,23), D(2026,4,27), 0, False),
    ("הגשת הצעת הפרויקט",                          D(2026,4,28), D(2026,4,28), 0, True),
    ("ראיונות עם בעל החברה והעובדים",              D(2026,5,1),  D(2026,5,7),  1, False),
    ("תרשים תהליכים ארגוניים",                     D(2026,5,7),  D(2026,5,11), 1, False),
    ("תרשים מבנה המערכת וסביבת המערכת",            D(2026,5,11), D(2026,5,16), 1, False),
    ("תרשים DFD",                                  D(2026,5,16), D(2026,5,20), 1, False),
    ("תרשים ERD מפורט",                            D(2026,5,20), D(2026,5,25), 1, False),
    ("רשימת מסכי קלט/פלט והסברים",                 D(2026,5,25), D(2026,5,28), 1, False),
    ("עריכה והגשת דוח התקדמות 1",                  D(2026,5,28), D(2026,5,31), 1, False),
    ("הגשת דוח התקדמות 1 (איפיון)",                D(2026,5,31), D(2026,5,31), 1, True),
    ("מבנה טבלאות בסיס הנתונים ומפתחות",           D(2026,6,1),  D(2026,6,8),  2, False),
    ("מבנה מפורט של הממשקים החיצוניים",            D(2026,6,8),  D(2026,6,14), 2, False),
    ("עץ תפריטים",                                 D(2026,6,14), D(2026,6,18), 2, False),
    ("עיצוב מפורט של ששת המסכים (Figma)",          D(2026,6,18), D(2026,6,26), 2, False),
    ("עריכה והגשת דוח התקדמות 2",                  D(2026,6,26), D(2026,6,30), 2, False),
    ("הגשת דוח התקדמות 2 (עיצוב)",                 D(2026,6,30), D(2026,6,30), 2, True),
    ("אימות התוצרים מול בעל החברה ותיקונים",        D(2026,7,1),  D(2026,7,10), 3, False),
    ("הכנת מצגת הפרויקט",                          D(2026,7,10), D(2026,7,24), 3, False),
    ("תרגול ההצגה ותיקוני מצגת",                   D(2026,7,24), D(2026,7,30), 3, False),
    ("העלאת המצגת לאתר הקורס",                     D(2026,7,31), D(2026,7,31), 3, True),
    ("כתיבת מסקנות, סיכום והמלצות",                D(2026,8,1),  D(2026,8,12), 3, False),
    ("הצגת הפרויקט בכיתה",                         D(2026,8,15), D(2026,8,15), 3, True),
    ("הרכבת תיק הפרויקט המלא ועריכה",              D(2026,8,10), D(2026,8,25), 3, False),
    ("הגהה סופית והפקת PDF",                       D(2026,8,25), D(2026,8,30), 3, False),
    ("הגשת תיק הפרויקט",                           D(2026,8,31), D(2026,8,31), 3, True),
]

phase_colors = ['#2e75b6', '#3fa66a', '#e0a030', '#9467bd']
phase_names = ["שלב א' – ייזום והצעת פרויקט", "שלב ב' – איפיון המערכת",
               "שלב ג' – עיצוב המערכת", "שלב ד' – סיכום, הצגה ותיק פרויקט"]

fig, ax = plt.subplots(figsize=(16, 9.2))
ax.set_axisbelow(True)

for i, (name, s, e, ph, ms) in enumerate(tasks):
    y = len(tasks) - 1 - i
    if ms:
        ax.plot(mdates.date2num(s), y, marker='D', markersize=10,
                color='#c0392b', zorder=5)
    else:
        ax.barh(y, (e - s).days, left=mdates.date2num(s), height=0.62,
                color=phase_colors[ph], edgecolor='white', linewidth=0.5, zorder=4)

labels = []
for i, (name, s, e, ph, ms) in enumerate(tasks):
    n = f"{i+1}. {name}"
    labels.append(he(n))
ax.set_yticks([len(tasks) - 1 - i for i in range(len(tasks))])
ax.set_yticklabels(labels, fontsize=12)
ax.set_ylim(-0.8, len(tasks) - 0.2)

ax.xaxis.set_major_locator(mdates.WeekdayLocator(byweekday=mdates.SU))
ax.xaxis.set_major_formatter(mdates.DateFormatter('%d/%m'))
ax.set_xlim(mdates.date2num(D(2026,3,21)), mdates.date2num(D(2026,9,2)))
ax.grid(axis='x', color='#d9d9d9', linewidth=0.7)
ax.tick_params(axis='x', labelsize=10, rotation=90)

# month separators + labels on top
months = [(D(2026,4,1),'04/2026'),(D(2026,5,1),'05/2026'),(D(2026,6,1),'06/2026'),
          (D(2026,7,1),'07/2026'),(D(2026,8,1),'08/2026'),(D(2026,9,1),'')]
for m, _ in months:
    ax.axvline(mdates.date2num(m), color='#8a8a8a', linewidth=1.1, zorder=3)
mstarts = [D(2026,3,21)] + [m for m,_ in months]
mlabels = ['03/2026','04/2026','05/2026','06/2026','07/2026','08/2026']
for i in range(len(mlabels)):
    x0 = mdates.date2num(mstarts[i]); x1 = mdates.date2num(mstarts[i+1])
    ax.text((x0+x1)/2, len(tasks)-0.05, mlabels[i], ha='center', va='bottom',
            fontsize=12, fontweight='bold', color='#333333')

legend_items = [Patch(facecolor=phase_colors[i], label=he(phase_names[i])) for i in range(4)]
legend_items.append(Line2D([0],[0], marker='D', color='none', markerfacecolor='#c0392b',
                           markersize=10, label=he('אבן דרך (מועד הגשה)')))
ax.legend(handles=legend_items, loc='lower left', fontsize=11.5, framealpha=0.95)

ax.set_title(he('תרשים גאנט – תוכנית עבודה מלאה לפרויקט (מרץ–אוגוסט 2026)'),
             fontsize=17, fontweight='bold', pad=30)
plt.tight_layout()
plt.savefig('gantt.png', dpi=200, bbox_inches='tight')
print('gantt.png saved')

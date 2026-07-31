# -*- coding: utf-8 -*-
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

def box(ax, x, y, w, h, text, fc='#dae8f5', ec='#2e75b6', fs=13, bold=False):
    b = FancyBboxPatch((x - w/2, y - h/2), w, h,
                       boxstyle="round,pad=0.02,rounding_size=0.06",
                       linewidth=1.6, edgecolor=ec, facecolor=fc, zorder=3)
    ax.add_patch(b)
    ax.text(x, y, text, ha='center', va='center', fontsize=fs,
            fontweight='bold' if bold else 'normal', zorder=4, wrap=True)

def arrow(ax, x1, y1, x2, y2, style='-|>', color='#555555'):
    a = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=style, mutation_scale=16,
                        linewidth=1.4, color=color, zorder=2)
    ax.add_patch(a)

# ---------- 1. Org chart ----------
fig, ax = plt.subplots(figsize=(11, 6.2))
ax.set_xlim(0, 10); ax.set_ylim(0, 6.2); ax.axis('off')

box(ax, 5, 5.6, 3.4, 0.75, 'בעלי החברה', fc='#2e75b6', ec='#1f4e79', fs=15, bold=True)
ax.texts[-1].set_color('white')
box(ax, 5, 4.35, 3.0, 0.7, 'מנכ"ל', fc='#bdd7ee', fs=14, bold=True)

y2 = 2.9
box(ax, 1.3, y2, 2.1, 0.95, 'הנהלת חשבונות\n(רואה חשבון)', fs=12)
box(ax, 3.75, y2, 2.1, 0.95, 'שמאות\nוהערכת נזקים', fs=12)
box(ax, 6.25, y2, 2.1, 0.95, 'תפעול וביצוע\n(מנהלי עבודה)', fs=12)
box(ax, 8.7, y2, 2.1, 0.95, 'שירות לקוחות\nוקבלת בקשות', fs=12)

y3 = 1.15
box(ax, 2.5, y3, 2.3, 0.95, 'עובדי החברה\n(בעלי מקצוע)', fc='#e2efda', ec='#548235', fs=12)
box(ax, 5.0, y3, 2.3, 0.95, 'קבלני משנה\nובעלי מקצוע חיצוניים', fc='#e2efda', ec='#548235', fs=12)
box(ax, 7.5, y3, 2.3, 0.95, 'ספקים וחברות עזרה\n(חומרים, ציוד, רכבים)', fc='#e2efda', ec='#548235', fs=12)

arrow(ax, 5, 5.22, 5, 4.72)
for x in (1.3, 3.75, 6.25, 8.7):
    arrow(ax, 5, 4.0, x, y2 + 0.5)
for x in (2.5, 5.0, 7.5):
    arrow(ax, 6.25, y2 - 0.5, x, y3 + 0.5)

ax.set_title('תרשים מבנה ארגוני – ס.א הנדסה', fontsize=16, fontweight='bold', pad=14)
plt.tight_layout()
plt.savefig('orgchart.png', dpi=200, bbox_inches='tight')
plt.close()

# ---------- 2. Process flow ----------
fig, ax = plt.subplots(figsize=(11.5, 7.6))
ax.set_xlim(0, 11.5); ax.set_ylim(0, 7.6); ax.axis('off')

# main flow, two rows (RTL: step 1 at right)
r1y, r2y = 6.0, 3.6
steps_r1 = [
    (10.0, 'קבלת פנייה מלקוח\n(נזק / בקשת שיבוץ)'),
    (7.5,  'רישום הבקשה\nופתיחת תיק נזק'),
    (5.0,  'שליחת צוות ראשוני\nלפינוי ואבטחת האתר'),
    (2.5,  'ביקור שמאי\nוהערכת הנזק'),
]
steps_r2 = [
    (2.5,  'הכנת הצעת מחיר\n(חומרים + עבודה)'),
    (5.0,  'החלטת הלקוח /\nחברת הביטוח'),
    (7.5,  'שיבוץ עובדים,\nחומרים וציוד'),
    (10.0, 'ביצוע התיקון\nובקרת איכות'),
]
for x, t in steps_r1:
    box(ax, x, r1y, 2.2, 1.1, t, fs=12)
for x, t in steps_r2:
    fc = '#fff2cc' if 'החלטת' in t else '#dae8f5'
    ec = '#bf9000' if 'החלטת' in t else '#2e75b6'
    box(ax, x, r2y, 2.2, 1.1, t, fc=fc, ec=ec, fs=12)

box(ax, 10.0, 1.2, 2.4, 1.1, 'מסירת הנכס ללקוח,\nחשבונית וגביית תשלום', fc='#e2efda', ec='#548235', fs=12)
box(ax, 5.0, 1.2, 2.2, 0.95, 'דחייה – סגירת התיק\nותיעוד הסיבה', fc='#f8cecc', ec='#b85450', fs=12)

# arrows row1 (right-to-left)
for i in range(len(steps_r1) - 1):
    arrow(ax, steps_r1[i][0] - 1.12, r1y, steps_r1[i+1][0] + 1.12, r1y)
arrow(ax, 2.5, r1y - 0.58, 2.5, r2y + 0.58)
for i in range(len(steps_r2) - 1):
    arrow(ax, steps_r2[i][0] + 1.12, r2y, steps_r2[i+1][0] - 1.12, r2y)
arrow(ax, 10.0, r2y - 0.58, 10.0, 1.2 + 0.58)
arrow(ax, 5.0, r2y - 0.58, 5.0, 1.2 + 0.5)

ax.text(6.25, r2y + 0.28, 'אישור', fontsize=11, color='#548235', fontweight='bold')
ax.text(5.35, 2.55, 'דחייה', fontsize=11, color='#b85450', fontweight='bold')

ax.set_title('התהליך הארגוני המרכזי – טיפול בבקשת לקוח מקצה לקצה', fontsize=16, fontweight='bold', pad=14)
plt.tight_layout()
plt.savefig('process.png', dpi=200, bbox_inches='tight')
plt.close()
print('diagrams saved')

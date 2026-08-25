import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

FONT = 'DejaVu Sans'
fig, ax = plt.subplots(figsize=(13.2, 4.9), dpi=230)
ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis('off')

def box(x, y, w, h, fc, ec):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.7,rounding_size=1.8",
                                linewidth=1.2, edgecolor=ec, facecolor=fc))

themes = [
    ('#f6e8e8', '#b28585', 'תמה 1', 'הידע כתנאי הכרחי\nשאינו מספיק',
     'הידע קיים גם אצל מי שלא נבדקה\nהפחד הוא מלדעת ולא מהבדיקה\nהיעדר תסמין כהיתר לדחות\nדחייה שאינה מגיעה להכרעה'),
    ('#f0e9f2', '#95809d', 'תמה 2', 'הגוף, הצניעות\nוהמבט של הקהילה',
     'החסם במסדרון ולא בחדר\nמגדר מבצע הבדיקה\nרכילות ותיוג ביישוב\nסרטן כסוד משפחתי'),
    ('#e3eded', '#71938f', 'תמה 3', 'החסמים היומיומיים\nומערך הזימון',
     'מחיר של יום עבודה\nהסעה, נטל טיפולי ותלות\nזימון שאינו מגיע או נקרא\nזמן המתנה לתור'),
    ('#e9efe1', '#7f9468', 'תמה 4', 'הפנייה האישית\nוהרשת הנשית',
     'המלצה בשם פרטי\nליווי מנצח שכנוע\nמי שחלתה ושרדה\nנשים כסוכנות שינוי'),
]

y0, hh, gap = 26, 62, 1.8
w = (100 - 2*1.5 - 3*gap) / 4
for i, (fc, ec, num, title, subs) in enumerate(themes):
    x = 1.5 + i * (w + gap)
    box(x, y0, w, hh, fc, ec)
    cx = x + w/2
    ax.text(cx, y0 + hh - 8, num, ha='center', va='center', fontsize=9.6,
            fontname=FONT, color='#5a5a5a', fontweight='bold')
    ax.text(cx, y0 + hh - 20, title, ha='center', va='center', fontsize=11.2,
            fontname=FONT, color='#1b1b1b', fontweight='bold', linespacing=1.5)
    ax.text(cx, y0 + 18, subs, ha='center', va='center', fontsize=9.0,
            fontname=FONT, color='#3a3a3a', linespacing=1.85)
    ax.plot([cx, cx], [y0, 18], color='#8b939c', lw=1.0, zorder=0)

box(1.5, 2, 97, 16, '#edf0f4', '#68727e')
ax.text(50, 10, 'ההיענות בפועל היא תוצר של מאזן הכוחות בין החסמים למאיצים, ולא של רמת הידע בלבד',
        ha='center', va='center', fontsize=11.6, fontname=FONT, color='#1b1b1b', fontweight='bold')

plt.savefig('/tmp/claude-0/-home-user-clickwriting-landing/2ca03497-42eb-5d34-8079-069f09f39de3/scratchpad/work/themes_wide.png',
            dpi=230, bbox_inches='tight', facecolor='white')
print('ok')

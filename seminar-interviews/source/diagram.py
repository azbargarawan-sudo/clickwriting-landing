import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

FONT = 'DejaVu Sans'
INK = '#1b1b1b'
fig, ax = plt.subplots(figsize=(10.8, 6.6), dpi=220)
ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis('off')

def box(x, y, w, h, text, fc, ec, fs, bold=False):
    ax.add_patch(FancyBboxPatch((x, y), w, h,
        boxstyle="round,pad=0.6,rounding_size=1.6",
        linewidth=1.1, edgecolor=ec, facecolor=fc))
    ax.text(x + w/2, y + h/2, text, ha='center', va='center',
            fontsize=fs, fontname=FONT, color=INK,
            fontweight='bold' if bold else 'normal', linespacing=1.6)

box(10, 85, 80, 12,
    'שאלת המחקר: אילו גורמים מעכבים ומקדמים את היענותן\nשל נשים בחברה הערבית בישראל לבדיקות ממוגרפיה',
    '#edf0f4', '#68727e', 11, bold=True)

themes = [
    ('#f6e8e8', '#b28585', 'תמה 1\nהידע כתנאי הכרחי\nשאינו מספיק',
     'פחד מלדעת\nהיעדר תסמין כהיתר לדחות\nגורל, אמונה ופרשנות דתית\nדחייה מתגלגלת'),
    ('#f0e9f2', '#95809d', 'תמה 2\nהגוף, הצניעות\nוהמבט הקהילתי',
     'חשיפה מול צוות\nמגדר מבצע הבדיקה\nרכילות ותיוג ביישוב\nסרטן כסוד משפחתי'),
    ('#e3eded', '#71938f', 'תמה 3\nהחסמים היומיומיים\nומערך הזימון',
     'מרחק, הסעה ותלות\nאובדן יום עבודה\nנטל טיפולי בבית\nשפה וזימון שאינו מובן'),
    ('#e9efe1', '#7f9468', 'תמה 4\nהפנייה האישית\nוהרשת הנשית',
     'המלצה אישית של מטפל\nליווי של אישה קרובה\nמי שחלתה ושרדה\nנשים כסוכנות שינוי'),
]

xs = [3.0, 27.0, 51.0, 75.0][::-1]   # RTL: theme 1 sits on the right
w = 22.0
for (fc, ec, title, subs), x in zip(themes, xs):
    cx = x + w/2
    ax.plot([cx, cx], [85, 77], color='#8b939c', lw=1.0, zorder=0)
    box(x, 60, w, 17, title, fc, ec, 10.4, bold=True)
    ax.plot([cx, cx], [60, 55], color='#8b939c', lw=1.0, zorder=0)
    box(x, 29, w, 26, subs, '#ffffff', ec, 9.4)
    ax.plot([cx, cx], [29, 20], color='#8b939c', lw=1.0, zorder=0)

box(10, 7, 80, 13,
    'ההיענות בפועל היא תוצר של מאזן הכוחות בין החסמים למאיצים,\nולא של רמת הידע בלבד',
    '#edf0f4', '#68727e', 11, bold=True)

plt.savefig('/tmp/claude-0/-home-user-clickwriting-landing/2ca03497-42eb-5d34-8079-069f09f39de3/scratchpad/work/themes.png',
            dpi=220, bbox_inches='tight', facecolor='white')
print('ok')

"""Findings figure: the path to the mammogram as a chevron flow, and the point
at which each theme blocks it."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, FancyBboxPatch, FancyArrowPatch

FONT = 'DejaVu Sans'
ROSE, PURPLE, TEAL, SLATE, GREEN = '#a4626a', '#7d6c88', '#5c8380', '#69757e', '#6f8a58'

# right to left
STATIONS = [
    ('ידע וזכאות',       ROSE,   'תמה 1',        'הידע קיים כמעט אצל כולן\nואינו מבחין בין מי שנבדקת\nלמי שאינה נבדקת'),
    ('קבלת הזימון',       TEAL,   'תמה 3',        'כתובת שאינה מעודכנת,\nמכתב שאינו נקרא בשום שפה,\nתור בשעה בלתי אפשרית'),
    ('ההחלטה לצאת',      SLATE,  'תמה 1 ותמה 3', 'הפחד מן האבחנה,\nהיעדר תסמין כהיתר לדחות,\nמחיר יום עבודה ונטל טיפולי'),
    ('הדרך אל המכון',    PURPLE, 'תמה 2',        'החשש שיראו אותה בדרך,\nולא החשיפה בחדר הבדיקה,\nשתוארה כרגע קצר'),
    ('חזרה במועד',       ROSE,   'תמה 1',        'דחייה מוצדקת החוזרת על\nעצמה ואינה מגיעה\nלכלל הכרעה'),
]


def build(outfile, figsize, fs_station, fs_tag, fs_body, fs_band):
    fig, ax = plt.subplots(figsize=figsize, dpi=230)
    ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis('off')

    n = len(STATIONS)
    x0, x1 = 4.0, 96.0
    seg = (x1 - x0) / n
    top, bot = 72.0, 86.0
    notch = seg * 0.14

    for i, (name, col, tag, body) in enumerate(STATIONS):
        r = x1 - i * seg                      # right edge of this chevron
        l = r - seg
        pts = [(r, bot), (l + notch, bot), (l, (top + bot) / 2),
               (l + notch, top), (r, top), (r - notch, (top + bot) / 2)]
        if i == 0:
            pts = [(r, bot), (l + notch, bot), (l, (top + bot) / 2), (l + notch, top), (r, top)]
        ax.add_patch(Polygon(pts, closed=True, facecolor=col, edgecolor='white', linewidth=1.6))
        cx = l + seg / 2 + notch * 0.35
        ax.text(cx, (top + bot) / 2, name, ha='center', va='center', fontsize=fs_station,
                fontname=FONT, color='white', fontweight='bold')

        ax.plot([cx, cx], [top, top - 4.5], color=col, lw=1.3)
        ax.text(cx, 62.0, tag, ha='center', va='center', fontsize=fs_tag,
                fontname=FONT, color=col, fontweight='bold')
        ax.text(cx, 48.0, body, ha='center', va='center', fontsize=fs_body,
                fontname=FONT, color='#333333', linespacing=1.85)

    ax.text(x1, 91.5, 'אישה בגיל הזכאות', ha='right', va='center', fontsize=fs_tag,
            fontname=FONT, color='#7a8288')
    ax.text(x0, 91.5, 'בדיקה אחת לשנתיים', ha='left', va='center', fontsize=fs_tag,
            fontname=FONT, color='#7a8288')

    ax.add_patch(FancyBboxPatch((x0, 6), x1 - x0, 22,
                 boxstyle="round,pad=0.6,rounding_size=1.5",
                 facecolor=GREEN, edgecolor=GREEN))
    ax.text((x0 + x1) / 2, 22.0, 'תמה 4  ·  הפנייה האישית והרשת הנשית',
            ha='center', va='center', fontsize=fs_band, fontname=FONT,
            color='white', fontweight='bold')
    ax.text((x0 + x1) / 2, 12.5,
            'פנייה אישית בשם פרטי וליווי של אישה קרובה הם שהעבירו את המשתתפות מתחנה לתחנה.\n'
            'כל הנבדקות בקביעות תיארו דמות מלווה, ואף אחת מן הנשים שלא נבדקו לא תיארה דמות כזאת.',
            ha='center', va='center', fontsize=fs_body, fontname=FONT,
            color='#eef3e8', linespacing=1.9)
    ax.add_patch(FancyArrowPatch((x1 - 2, 32), (x0 + 2, 32), arrowstyle='-|>',
                                 mutation_scale=13, linewidth=1.4, color=GREEN))

    plt.savefig(outfile, dpi=230, bbox_inches='tight', facecolor='white')
    print('wrote', outfile)


W = '/tmp/claude-0/-home-user-clickwriting-landing/2ca03497-42eb-5d34-8079-069f09f39de3/scratchpad/work/'
build(W + 'findings_path_wide.png', (14.8, 5.4), 10.6, 9.2, 8.5, 11.4)
build(W + 'findings_path.png',      (13.6, 5.3), 10.2, 8.8, 8.1, 11.0)

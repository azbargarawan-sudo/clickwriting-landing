"""Findings diagram: the path to the mammogram, and where each theme bites.
Replaces the earlier four-column list with a mechanism picture."""
import sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

FONT = 'DejaVu Sans'
SLATE, LINE = '#3d4b57', '#8b939c'
T1 = ('#f6e8e8', '#b28585')
T2 = ('#f0e9f2', '#95809d')
T3 = ('#e3eded', '#71938f')
T4 = ('#e9efe1', '#7f9468')

# right to left: the first station sits on the right
STATIONS = [
    ('ידע וזכאות',        'תמה 1',      T1, 'הידע קיים כמעט אצל כולן\nואינו מבחין בין מי שנבדקת\nלמי שאינה נבדקת'),
    ('הזימון מגיע ונקרא',  'תמה 3',      T3, 'כתובת שאינה מעודכנת,\nמכתב שאינו נקרא בשום שפה,\nתור בשעה בלתי אפשרית'),
    ('ההחלטה לצאת',       'תמה 1 ותמה 3', ('#eaeeee', '#7e8f95'), 'הפחד מן האבחנה,\nהיעדר תסמין כהיתר לדחות,\nמחיר יום עבודה ונטל טיפולי'),
    ('הדרך אל המכון',     'תמה 2',      T2, 'החשש שיראו אותה בדרך,\nולא החשיפה בחדר הבדיקה,\nשתוארה כרגע קצר'),
    ('חזרה במועד',        'תמה 1',      T1, 'דחייה מוצדקת החוזרת\nעל עצמה ואינה מגיעה\nלכלל הכרעה'),
]

def build(outfile, figsize, fs_station, fs_tag, fs_body, fs_band):
    fig, ax = plt.subplots(figsize=figsize, dpi=230)
    ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis('off')

    def box(x, y, w, h, fc, ec, lw=1.2):
        ax.add_patch(FancyBboxPatch((x, y), w, h,
                     boxstyle="round,pad=0.7,rounding_size=1.7",
                     linewidth=lw, edgecolor=ec, facecolor=fc))

    n = len(STATIONS)
    w, gap = 13.6, 2.8   # leaves room for the entry and exit labels
    total = n * w + (n - 1) * gap
    x0 = (100 - total) / 2
    spine_y, spine_h = 40.0, 11.0

    for i, (name, tag, (fc, ec), body) in enumerate(STATIONS):
        x = x0 + (n - 1 - i) * (w + gap)          # RTL
        cx = x + w / 2
        # barrier card above
        box(x, 57, w, 30, fc, ec)
        ax.text(cx, 83.5, tag, ha='center', va='center', fontsize=fs_tag,
                fontname=FONT, color='#5a5a5a', fontweight='bold')
        ax.text(cx, 70.5, body, ha='center', va='center', fontsize=fs_body,
                fontname=FONT, color='#333333', linespacing=1.8)
        ax.plot([cx, cx], [57, spine_y + spine_h], color=ec, lw=1.1, zorder=0)
        # station on the spine
        box(x, spine_y, w, spine_h, '#eef1f4', SLATE, lw=1.3)
        ax.text(cx, spine_y + spine_h / 2, name, ha='center', va='center',
                fontsize=fs_station, fontname=FONT, color='#1b1b1b', fontweight='bold')
        # arrow to the next station, leftwards
        if i < n - 1:
            xa = x - 0.5
            ax.add_patch(FancyArrowPatch((xa, spine_y + spine_h / 2),
                                         (xa - gap + 1.0, spine_y + spine_h / 2),
                                         arrowstyle='-|>', mutation_scale=11,
                                         linewidth=1.2, color=LINE))

    # the facilitator that carries a woman across the whole path
    box(x0, 8, total, 20, T4[0], T4[1])
    ax.text(x0 + total / 2, 22.5, 'תמה 4  ·  הפנייה האישית והרשת הנשית',
            ha='center', va='center', fontsize=fs_band, fontname=FONT,
            color='#1b1b1b', fontweight='bold')
    ax.text(x0 + total / 2, 14.0,
            'פנייה אישית בשם פרטי וליווי של אישה קרובה הם שהעבירו את המשתתפות מתחנה לתחנה.\n'
            'כל הנבדקות בקביעות תיארו דמות מלווה, ואף אחת מן הנשים שלא נבדקו לא תיארה דמות כזאת.',
            ha='center', va='center', fontsize=fs_body, fontname=FONT,
            color='#333333', linespacing=1.9)
    for i in range(len(STATIONS)):
        x = x0 + i * (w + gap)
        ax.plot([x + w / 2, x + w / 2], [28, spine_y], color=T4[1], lw=1.0,
                linestyle=(0, (3, 3)), zorder=0)

    ax.text(x0 + total + 1.2, spine_y + spine_h / 2, 'אישה\nבגיל הזכאות', ha='left',
            va='center', fontsize=fs_tag, fontname=FONT, color='#5a5a5a', linespacing=1.5)
    ax.text(x0 - 1.2, spine_y + spine_h / 2, 'בדיקה\nאחת לשנתיים', ha='right',
            va='center', fontsize=fs_tag, fontname=FONT, color='#5a5a5a', linespacing=1.5)

    plt.savefig(outfile, dpi=230, bbox_inches='tight', facecolor='white')
    print('wrote', outfile)

W = '/tmp/claude-0/-home-user-clickwriting-landing/2ca03497-42eb-5d34-8079-069f09f39de3/scratchpad/work/'
build(W + 'findings_path_wide.png', (14.6, 5.5), 10.4, 9.0, 8.4, 11.2)
build(W + 'findings_path.png',      (13.4, 5.4), 10.0, 8.6, 8.0, 10.8)

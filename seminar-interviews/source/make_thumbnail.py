#!/usr/bin/env python3
"""Render docProps/thumbnail.jpeg from our own cover.

A pptx carries a preview image, and WhatsApp, Explorer and mail clients show
that image rather than rendering the file. The template's copy showed another
college's logo and an empty cover, so it had to be replaced. matplotlib applies
the bidirectional algorithm, so the Hebrew is passed through unreversed.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

FONT = 'DejaVu Sans'
INK, EMPH, MUTE = '#1a1a1a', '#1F3864', '#44546A'
W_IN, H_IN, DPI = 13.333, 7.5, 96          # the slide's own proportions

LINES = [                                   # y, text, size, colour, bold
    (0.845, 'פרויקט גמר בנושא:',                                  15, MUTE, True),
    (0.755, 'היענות לבדיקות ממוגרפיה בחברה הערבית בישראל',        30, INK,  True),
    (0.672, 'חסמים, מאיצים ודרכים להגברת ההיענות',                21, EMPH, False),
    (0.605, 'מחקר איכותני מבוסס שנים עשר ראיונות עומק, שנה"ל תשפ"ו', 13, MUTE, False),
    (0.492, 'מגישות:',                                            12, MUTE, True),
    (0.436, 'מראם זיד        ת.ז. 211794235',                     12, INK,  False),
    (0.386, 'טגאיה סמאנך        ת.ז. 337622344',                  12, INK,  False),
    (0.336, 'עאליה אבו עראר        ת.ז. 2114908139',              12, INK,  False),
    (0.286, 'לילה נגילי        ת.ז. 214175473',                   12, INK,  False),
    (0.196, 'בהנחיית: ד"ר אסנת בשקין',                            12, INK,  False),
    (0.116, 'המרכז האקדמי פרס, החוג למנהל מערכות בריאות',         11, MUTE, False),
]


def main(out='thumbnail.jpeg'):
    fig = plt.figure(figsize=(W_IN, H_IN), dpi=DPI)
    fig.patch.set_facecolor('white')
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_axis_off()
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)

    for y, text, size, colour, bold in LINES:
        ax.text(0.5, y, text, ha='center', va='center', fontname=FONT,
                fontsize=size, color=colour,
                fontweight='bold' if bold else 'normal')

    # the logo sits where it sits on the slide: top left, square, 1.35"
    logo = mpimg.imread('peres_logo.jpg')
    side = 1.35 / W_IN
    fig.add_axes([0.30 / W_IN, 1 - (0.22 / H_IN) - side * W_IN / H_IN,
                  side, side * W_IN / H_IN]).imshow(logo)
    fig.axes[-1].set_axis_off()

    fig.savefig(out, format='jpeg', dpi=DPI, facecolor='white')
    plt.close(fig)
    print('wrote', out)


if __name__ == '__main__':
    import sys
    main(*sys.argv[1:])

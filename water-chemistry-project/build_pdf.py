"""
Render Water_Chemistry_Report.docx to Water_Chemistry_Report.pdf without any
office suite: walk the .docx in document order (paragraphs + inline images) and
lay it out with reportlab. Unicode sub/superscripts become proper <sub>/<super>
markup; Hebrew header lines are shaped right-to-left with python-bidi.
"""
import os, io
from docx import Document
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn
from PIL import Image as PILImage
from bidi.algorithm import get_display
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph as RLPara,
                                Spacer, Image as RLImage)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = '/usr/share/fonts/truetype/dejavu'
import matplotlib
_MPL = os.path.join(os.path.dirname(matplotlib.__file__), 'mpl-data/fonts/ttf')
_OBLIQUE = f'{_MPL}/DejaVuSans-Oblique.ttf'
if not os.path.exists(_OBLIQUE):
    _OBLIQUE = f'{FONT_DIR}/DejaVuSans.ttf'          # fallback: no true italic
pdfmetrics.registerFont(TTFont('DV', f'{FONT_DIR}/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVB', f'{FONT_DIR}/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DVI', _OBLIQUE))
pdfmetrics.registerFontFamily('DV', normal='DV', bold='DVB', italic='DVI')

# ---- unicode sub/superscript -> markup --------------------------------------
SUB = {'₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6',
       '₇': '7', '₈': '8', '₉': '9', '₊': '+', '₋': '-', '₌': '=',
       'ₐ': 'a', 'ₑ': 'e', 'ₕ': 'h', 'ᵢ': 'i', 'ⱼ': 'j', 'ₖ': 'k', 'ₗ': 'l',
       'ₘ': 'm', 'ₙ': 'n', 'ₒ': 'o', 'ₚ': 'p', 'ᵣ': 'r', 'ₛ': 's', 'ₜ': 't',
       'ᵤ': 'u', 'ᵥ': 'v', 'ₓ': 'x'}
SUP = {'⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6',
       '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-', 'ⁿ': 'n'}
HEB = set(range(0x0590, 0x05FF))


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def to_markup(text):
    """Escape XML and wrap runs of unicode sub/superscripts in <sub>/<super>."""
    out, i, n = [], 0, len(text)
    while i < n:
        ch = text[i]
        if ch == '\n':
            out.append('<br/>'); i += 1
        elif ch in SUB:
            run = ''
            while i < n and text[i] in SUB:
                run += SUB[text[i]]; i += 1
            out.append('<sub>' + esc(run) + '</sub>')
        elif ch in SUP:
            run = ''
            while i < n and text[i] in SUP:
                run += SUP[text[i]]; i += 1
            out.append('<super>' + esc(run) + '</super>')
        else:
            out.append(esc(ch)); i += 1
    return ''.join(out)


def is_hebrew(text):
    return any(ord(c) in HEB for c in text)


# ---- styles -----------------------------------------------------------------
def style(name, **kw):
    base = dict(fontName='DV', fontSize=10.5, leading=14, spaceAfter=6)
    base.update(kw)
    return ParagraphStyle(name, **base)


S_TITLE = style('title', fontName='DVB', fontSize=16, leading=20,
                alignment=TA_CENTER, textColor='#0d1b2a', spaceAfter=4)
S_SUB = style('sub', fontName='DVI', fontSize=11, alignment=TA_CENTER,
              textColor='#555555', spaceAfter=4)
S_INFO = style('info', fontSize=10, alignment=TA_CENTER, spaceAfter=3)
S_HEB = style('heb', fontSize=12, alignment=TA_CENTER, textColor='#1b3a53')
S_HEAD = style('head', fontName='DVB', fontSize=14, leading=18,
               textColor='#1b3a53', spaceBefore=10, spaceAfter=4)
S_BODY = style('body', alignment=TA_LEFT)
S_CAP = style('cap', fontName='DVI', fontSize=9.5, alignment=TA_CENTER,
              textColor='#555555', spaceAfter=10)
S_EQ = style('eq', fontName='DVI', alignment=TA_CENTER)


def render_text(para):
    """Pick a reportlab style + shaped text for a docx paragraph."""
    txt = para.text
    if not txt.strip():
        return Spacer(1, 4)
    runs = para.runs
    sz = runs[0].font.size.pt if (runs and runs[0].font.size) else None
    bold = runs[0].bold if runs else False
    italic = runs[0].italic if runs else False
    align = para.alignment

    if is_hebrew(txt):
        disp = get_display(txt)
        st = S_HEB if not (sz and sz >= 13) else style('hebb', fontName='DVB',
                     fontSize=14, alignment=TA_CENTER, textColor='#1b3a53')
        return RLPara(esc(disp), st)

    mk = to_markup(txt)
    if sz and sz >= 16:
        return RLPara(mk, S_TITLE)
    if sz and sz >= 13 and bold:
        return RLPara(mk, S_HEAD)
    if align == 1 and italic and sz and sz <= 10:      # subtitle / course line
        return RLPara(mk, S_SUB)
    if align == 1 and italic:                          # figure caption
        return RLPara(mk, S_CAP)
    if align == 1:                                     # centered (info / eq)
        return RLPara(mk, S_INFO if not italic else S_EQ)
    if italic:
        return RLPara(mk, style('bodyi', fontName='DVI', alignment=TA_LEFT))
    return RLPara(mk, S_BODY)


def build():
    doc = Document(os.path.join(HERE, 'Water_Chemistry_Report.docx'))
    story, img_idx = [], 0
    for child in doc.element.body.iterchildren():
        if child.tag != qn('w:p'):
            continue
        para = Paragraph(child, doc)
        blips = child.findall('.//' + qn('a:blip'))
        if blips:
            rId = blips[0].get(qn('r:embed'))
            blob = doc.part.related_parts[rId].blob
            im = PILImage.open(io.BytesIO(blob))
            w_in = 2.0 if img_idx == 0 else 5.3        # first image = logo
            img_idx += 1
            h_in = w_in * im.height / im.width
            rimg = RLImage(io.BytesIO(blob), width=w_in * inch, height=h_in * inch)
            rimg.hAlign = 'CENTER'
            story.append(rimg)
            story.append(Spacer(1, 4))
        else:
            story.append(render_text(para))

    out = os.path.join(HERE, 'Water_Chemistry_Report.pdf')
    SimpleDocTemplate(out, pagesize=A4, topMargin=18 * mm, bottomMargin=18 * mm,
                      leftMargin=20 * mm, rightMargin=20 * mm,
                      title='Water Chemistry Report').build(story)
    print('Wrote', out)


if __name__ == '__main__':
    build()

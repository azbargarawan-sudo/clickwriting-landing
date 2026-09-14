# -*- coding: utf-8 -*-
"""Build the seminar paper .docx from a lightly marked-up text file.

Markup (one construct per line):
  #PAGEBREAK            page break
  #TOC                  table-of-contents field
  #COVER ... lines ... #ENDCOVER   centered cover page
  # / ## / ###          headings (levels 1-3)
  | a | b |             table rows; first row = header
  > text                indented block quote (no quotation marks)
  [REF] text            reference entry, hanging indent; Latin refs left-aligned
  [AR] text             Arabic paragraph (RTL, Arabic font)
  [C] text              centered paragraph
  [B] text              bold paragraph
  plain text            justified body paragraph, double spacing
Inline **bold** and *italic* are supported in body/ref/quote lines.
"""
import re
import sys

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt

SRC, OUT = sys.argv[1], sys.argv[2]

doc = Document()

# ---------- page setup ----------
for s in doc.sections:
    s.top_margin = s.bottom_margin = Cm(2.5)
    s.left_margin = s.right_margin = Cm(2.5)

# ---------- base styles ----------
def set_font(style, name, size, bold=None):
    style.font.name = name
    style.font.size = Pt(size)
    if bold is not None:
        style.font.bold = bold
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn('w:rFonts'))
    if rfonts is None:
        rfonts = OxmlElement('w:rFonts')
        rpr.append(rfonts)
    for attr in ('w:ascii', 'w:hAnsi', 'w:cs', 'w:eastAsia'):
        rfonts.set(qn(attr), name)

normal = doc.styles['Normal']
set_font(normal, 'David', 12)
normal.paragraph_format.line_spacing_rule = WD_LINE_SPACING.DOUBLE
normal.paragraph_format.space_after = Pt(0)

# default proofing language for the whole document
_nrpr = normal.element.get_or_add_rPr()
_nlang = OxmlElement('w:lang')
_nlang.set(qn('w:val'), 'en-US')
_nlang.set(qn('w:bidi'), 'he-IL')
_nrpr.append(_nlang)
_nnp = OxmlElement('w:noProof'); _nnp.set(qn('w:val'), '1'); _nrpr.append(_nnp)

for lvl, size in ((1, 18), (2, 15), (3, 13)):
    st = doc.styles[f'Heading {lvl}']
    set_font(st, 'David', size, bold=True)
    st.font.color.rgb = None
    st.paragraph_format.space_before = Pt(18 if lvl == 1 else 12)
    st.paragraph_format.space_after = Pt(6)


def rtl(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    ppr = p._p.get_or_add_pPr()
    bidi = OxmlElement('w:bidi')
    bidi.set(qn('w:val'), '1')
    ppr.append(bidi)
    p.alignment = align
    return p


def ltr(p, align=WD_ALIGN_PARAGRAPH.LEFT):
    ppr = p._p.get_or_add_pPr()
    bidi = OxmlElement('w:bidi')
    bidi.set(qn('w:val'), '0')
    ppr.append(bidi)
    p.alignment = align
    return p


# ---------- language tagging (prevents Word red squiggles) ----------
HE = '\u0590-\u05FF'
AR = '\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF'
LA = 'A-Za-z'
_re_he = re.compile(f'[{HE}]')
_re_ar = re.compile(f'[{AR}]')
_re_la = re.compile(f'[{LA}]')


def _script_of(ch):
    if _re_he.match(ch): return 'he'
    if _re_ar.match(ch): return 'ar'
    if _re_la.match(ch): return 'la'
    return None


def segments(text):
    """Split text into (script, chunk) pairs; neutral chars join the current chunk."""
    out, cur, cur_s = [], '', None
    for ch in text:
        s = _script_of(ch)
        if s is None or s == cur_s or cur_s is None:
            if s is not None and cur_s is None:
                cur_s = s
            cur += ch
        else:
            out.append((cur_s, cur))
            cur, cur_s = ch, s
    if cur:
        out.append((cur_s or 'he', cur))
    return out


def tag_run(run, script, no_proof=False):
    """Set the run's proofing language so Word checks it with the right dictionary."""
    rPr = run._r.get_or_add_rPr()
    lang = OxmlElement('w:lang')
    if script == 'ar':
        lang.set(qn('w:bidi'), 'ar-SA')
        lang.set(qn('w:val'), 'en-US')
    elif script == 'la':
        lang.set(qn('w:val'), 'en-US')
        lang.set(qn('w:bidi'), 'he-IL')
    else:
        lang.set(qn('w:bidi'), 'he-IL')
        lang.set(qn('w:val'), 'en-US')
    rPr.append(lang)
    if script in ('he', 'ar'):
        rtl = OxmlElement('w:rtl'); rtl.set(qn('w:val'), '1'); rPr.append(rtl)
        cs = OxmlElement('w:cs'); rPr.append(cs)
    # every run is marked noProof: Word then draws no red or blue underlines,
    # regardless of which proofing dictionaries are installed on the machine
    np = OxmlElement('w:noProof'); np.set(qn('w:val'), '1'); rPr.append(np)


def add_runs(p, text, font=None, size=None, no_proof=False):
    """Add text with **bold** / *italic* markup, one run per script for correct proofing."""
    tokens = re.split(r'(\*\*.+?\*\*|\*.+?\*)', text)
    for tok in tokens:
        if not tok:
            continue
        bold = tok.startswith('**') and tok.endswith('**')
        ital = not bold and tok.startswith('*') and tok.endswith('*')
        body = tok[2:-2] if bold else (tok[1:-1] if ital else tok)
        for script, chunk in segments(body):
            if not chunk:
                continue
            r = p.add_run(chunk)
            r.bold = bold or None
            r.italic = ital or None
            use_font = font
            if use_font is None and script == 'la':
                use_font = 'Times New Roman'
            if use_font:
                rpr = r._r.get_or_add_rPr()
                rf = rpr.find(qn('w:rFonts'))
                if rf is None:
                    rf = OxmlElement('w:rFonts'); rpr.append(rf)
                for attr in ('w:ascii', 'w:hAnsi', 'w:cs'):
                    rf.set(qn(attr), use_font)
            if size:
                r.font.size = Pt(size)
            tag_run(r, script, no_proof=no_proof)
    return p


def add_field(p, instr):
    r = p.add_run()
    fld_begin = OxmlElement('w:fldChar'); fld_begin.set(qn('w:fldCharType'), 'begin')
    instr_el = OxmlElement('w:instrText'); instr_el.set(qn('xml:space'), 'preserve'); instr_el.text = instr
    fld_sep = OxmlElement('w:fldChar'); fld_sep.set(qn('w:fldCharType'), 'separate')
    txt = OxmlElement('w:t'); txt.text = ' '
    fld_end = OxmlElement('w:fldChar'); fld_end.set(qn('w:fldCharType'), 'end')
    rPr = r._r.get_or_add_rPr()
    np = OxmlElement('w:noProof'); np.set(qn('w:val'), '1'); rPr.append(np)
    for el in (fld_begin, instr_el, fld_sep, txt, fld_end):
        r._r.append(el)


def page_break():
    p = doc.add_paragraph()
    p.add_run().add_break(WD_BREAK.PAGE)


def add_table(rows):
    header, body = rows[0], rows[1:]
    t = doc.add_table(rows=len(rows), cols=len(header))
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    # right-to-left table
    tblPr = t._tbl.tblPr
    bidi = OxmlElement('w:bidiVisual'); bidi.set(qn('w:val'), '1'); tblPr.append(bidi)
    for i, row in enumerate(rows):
        for j, cell_text in enumerate(row):
            cell = t.cell(i, j)
            cell.text = ''
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
            rtl(p, WD_ALIGN_PARAGRAPH.RIGHT)
            add_runs(p, cell_text.strip(), size=11)
            if i == 0:
                for r in p.runs:
                    r.bold = True
    doc.add_paragraph()


# ---------- footer page numbers ----------
footer_p = doc.sections[0].footer.paragraphs[0]
footer_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
add_field(footer_p, 'PAGE')

# ---------- parse ----------
lines = open(SRC, encoding='utf-8').read().split('\n')
i = 0
table_buf = []


def flush_table():
    global table_buf
    if table_buf:
        add_table(table_buf)
        table_buf = []


while i < len(lines):
    line = lines[i].rstrip()
    i += 1
    if line.startswith('|'):
        cells = [c for c in line.strip().strip('|').split('|')]
        if all(re.fullmatch(r'\s*:?-+:?\s*', c) for c in cells):
            continue  # markdown separator row
        table_buf.append(cells)
        continue
    flush_table()
    if not line.strip():
        continue
    if line == '#PAGEBREAK':
        page_break(); continue
    if line == '#TOC':
        p = rtl(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.RIGHT)
        add_field(p, 'TOC \\o "1-3" \\h \\z \\u')
        continue
    if line == '#COVER':
        while i < len(lines) and lines[i].strip() != '#ENDCOVER':
            cl = lines[i].rstrip(); i += 1
            p = rtl(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.CENTER)
            p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
            if cl.startswith('!!'):
                add_runs(p, cl[2:].strip(), size=20)
                for r in p.runs: r.bold = True
            elif cl.startswith('!'):
                add_runs(p, cl[1:].strip(), size=16)
                for r in p.runs: r.bold = True
            else:
                add_runs(p, cl.strip(), size=13)
        i += 1
        continue
    m = re.match(r'^(#{1,3}) (.+)$', line)
    if m:
        lvl = len(m.group(1))
        h = doc.add_heading('', level=lvl)
        rtl(h, WD_ALIGN_PARAGRAPH.RIGHT)
        add_runs(h, m.group(2))
        continue
    if line.startswith('> '):
        p = rtl(doc.add_paragraph())
        p.paragraph_format.right_indent = Cm(1.25)
        p.paragraph_format.left_indent = Cm(1.25)
        add_runs(p, line[2:])
        continue
    if line.startswith('[REF] '):
        text = line[6:]
        is_latin = bool(re.match(r'^[A-Za-z]', text))
        p = doc.add_paragraph()
        if is_latin:
            ltr(p)
            p.paragraph_format.left_indent = Cm(1.25)
            p.paragraph_format.first_line_indent = Cm(-1.25)
            add_runs(p, text, font='Times New Roman', no_proof=True)
        else:
            rtl(p, WD_ALIGN_PARAGRAPH.RIGHT)
            p.paragraph_format.right_indent = Cm(1.25)
            p.paragraph_format.first_line_indent = Cm(-1.25)
            add_runs(p, text, no_proof=True)
        continue
    if line.startswith('[AR] '):
        p = rtl(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.RIGHT)
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        add_runs(p, line[5:], font='Arial', no_proof=True)
        continue
    if line.startswith('[C] '):
        p = rtl(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.CENTER)
        add_runs(p, line[4:])
        continue
    if line.startswith('[B] '):
        p = rtl(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.RIGHT)
        add_runs(p, line[4:])
        for r in p.runs: r.bold = True
        continue
    if line.startswith('[T] '):  # transcript line, 1.5 spacing
        p = rtl(doc.add_paragraph(), WD_ALIGN_PARAGRAPH.RIGHT)
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        add_runs(p, line[4:])
        continue
    p = rtl(doc.add_paragraph())
    add_runs(p, line)

flush_table()

# ask Word to refresh fields (TOC) on open
settings = doc.settings.element
upd = OxmlElement('w:updateFields'); upd.set(qn('w:val'), 'true'); settings.append(upd)

# tell Word the text has already been proofed, so it does not re-flag on open
ps = OxmlElement('w:proofState')
ps.set(qn('w:spelling'), 'clean')
ps.set(qn('w:grammar'), 'clean')
settings.insert(0, ps)
for tag in ('w:doNotDisplayPageBoundaries',):
    pass
_nospell = OxmlElement('w:hideSpellingErrors'); _nospell.set(qn('w:val'), 'true'); settings.append(_nospell)
_nogram = OxmlElement('w:hideGrammaticalErrors'); _nogram.set(qn('w:val'), 'true'); settings.append(_nogram)

# default editing languages for the document
tl = OxmlElement('w:themeFontLang')
tl.set(qn('w:val'), 'en-US')
tl.set(qn('w:bidi'), 'he-IL')
settings.append(tl)

doc.save(OUT)
print('saved', OUT)

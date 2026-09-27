# -*- coding: utf-8 -*-
"""Turn the frames of Chapters 5, 6 and 7 into prose, with every data value highlighted."""
import html
import re
import shutil
import zipfile

import fill_text as T

SRC, DST = "games_20.docx", "games_filled.docx"

RPR = ('<w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" '
       'w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/>'
       '<w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>')
RPR_HL = RPR.replace("</w:rPr>", '<w:highlight w:val="yellow"/></w:rPr>')
PPR = '<w:pPr><w:spacing w:line="480"/><w:ind w:firstLine="720"/></w:pPr>'
WT = re.compile(r"<w:t(?: [^>]*)?>(.*?)</w:t>", re.S)


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))


def runs(text, plain=RPR, hl=RPR_HL):
    """Render text, rendering <<value>> as a highlighted run."""
    out = []
    for i, part in enumerate(re.split(r"<<(.+?)>>", text)):
        if part:
            out.append(f"<w:r>{hl if i % 2 else plain}<w:t xml:space=\"preserve\">{esc(part)}</w:t></w:r>")
    return "".join(out)


def body(text):
    return f"<w:p>{PPR}{runs(text)}</w:p>"


x = zipfile.ZipFile(SRC).read("word/document.xml").decode("utf8")


def paras():
    return [(m.start(), m.end(), html.unescape("".join(WT.findall(m.group(0)))))
            for m in re.finditer(r"<w:p[ >].*?</w:p>", x, re.S)]


def find(anchor):
    hits = [p for p in paras() if p[2].startswith(anchor) or anchor in p[2]]
    assert len(hits) == 1, f"{len(hits)} hits for {anchor[:60]!r}"
    return hits[0]


done = []

# 1. frames -> prose
for anchor, new in T.REPLACE.items():
    s, e, _ = find(anchor)
    x = x[:s] + "".join(body(t) for t in new) + x[e:]
    done.append("prose: " + anchor[:48])

# 2. notes that are spent
for anchor in T.DROP:
    s, e, _ = find(anchor)
    x = x[:s] + x[e:]
    done.append("dropped: " + anchor[:48])

# 3. the note that stays, rewritten
s, e, old = find("Note to the writers (delete before submission): Per Dr. Arshaid")
ppr = re.match(r"<w:p>(<w:pPr>.*?</w:pPr>)", x[s:e], re.S).group(1)
rpr = re.search(r"<w:rPr>.*?</w:rPr>", x[s:e], re.S).group(0)
x = x[:s] + f"<w:p>{ppr}{runs(T.CHAPTER5_NOTE, plain=rpr, hl=rpr)}</w:p>" + x[e:]
done.append("chapter 5 note rewritten")


def in_run(old, new):
    """Replace old text inside the single run that holds it, keeping that run's rPr."""
    global x
    hits = [m for m in re.finditer(r"<w:r>(<w:rPr>.*?</w:rPr>)?(<w:t(?: [^>]*)?>)(.*?)(</w:t>)</w:r>", x, re.S)
            if esc(old) in m.group(3)]
    assert len(hits) == 1, f"{len(hits)} runs hold {old[:50]!r}"
    m = hits[0]
    rpr = m.group(1) or RPR
    hl = rpr.replace("</w:rPr>", '<w:highlight w:val="yellow"/></w:rPr>') if "highlight" not in rpr else rpr
    before, after = m.group(3).split(esc(old), 1)
    parts = []
    if before:
        parts.append(f"<w:r>{rpr}<w:t xml:space=\"preserve\">{before}</w:t></w:r>")
    parts.append(runs(new, plain=rpr, hl=hl))
    if after:
        parts.append(f"<w:r>{rpr}<w:t xml:space=\"preserve\">{after}</w:t></w:r>")
    x = x[:m.start()] + "".join(parts) + x[m.end():]


# 4. the open clauses of the eight recommendations
for old, new in T.CLAUSES:
    in_run(old, new)
    done.append("clause: " + old[:44])

# 5. the findings sentence of the abstract
s, e, _ = find("Reading is the skill through which young EFL learners")
seg = x[s:e]
hit = [m for m in re.finditer(r"<w:r>(<w:rPr>.*?</w:rPr>)?(<w:t(?: [^>]*)?>)(.*?)(</w:t>)</w:r>", seg, re.S)
       if esc(T.ABSTRACT[0]) in m.group(3)]
assert len(hit) == 1, len(hit)
m = hit[0]
rpr = m.group(1) or RPR
plain = rpr.replace('<w:highlight w:val="yellow"/>', "")
seg = seg[:m.start()] + runs(T.ABSTRACT[1], plain=plain, hl=rpr) + seg[m.end():]
x = x[:s] + seg + x[e:]
done.append("abstract findings sentence")


def fill_table(marker, rows, ncols):
    """Write the data cells of the table that holds `marker`, highlighted."""
    global x
    t = re.search(rf"<w:tbl>(?:(?!</w:tbl>).)*?{re.escape(marker)}.*?</w:tbl>", x, re.S)
    assert t, marker
    block = t.group(0)
    trs = re.findall(r"<w:tr[ >].*?</w:tr>", block, re.S)
    for label, *values in rows:
        tr = next(r for r in trs if label in html.unescape("".join(WT.findall(r))))
        new_tr = tr
        cells = re.findall(r"<w:tc>.*?</w:tc>", tr, re.S)
        assert len(cells) == ncols, (label, len(cells))
        for idx, val in enumerate(values, start=1):
            if val is None:
                continue
            cell = cells[idx]
            m = re.search(r"(<w:r>)(<w:rPr>.*?</w:rPr>)?(<w:t(?: [^>]*)?>)(.*?)(</w:t>)(</w:r>)", cell, re.S)
            assert m, (label, idx)
            rpr = m.group(2) or RPR
            hl = rpr.replace("</w:rPr>", '<w:highlight w:val="yellow"/></w:rPr>')
            new_cell = cell[:m.start()] + f"<w:r>{hl}<w:t>{val}</w:t></w:r>" + cell[m.end():]
            new_tr = new_tr.replace(cell, new_cell, 1)
        block = block.replace(tr, new_tr, 1)
    x = x[:t.start()] + block + x[t.end():]
    done.append("table filled: " + marker)


fill_table("Item (question type)", T.TABLE1, 5)
fill_table("Total (of 24)", T.TABLE2, 6)

# 6. the pre-submission checklist
t = re.search(r"<w:tbl>(?:(?!</w:tbl>).)*?What is missing.*?</w:tbl>", x, re.S)
block = t.group(0)
CHECK = {
    "Chapter 5, Results": ("Sections 5.1–5.3 — written out; replace every yellow highlight with your own figures", "draft"),
    "Chapter 6, Discussion": ("Sections 6.1–6.3 — written out; the highlighted figures are the ones to replace", "draft"),
    "Chapter 7 opening summary": ("Start of Chapter 7 — written out; the highlighted figures are the ones to replace", "draft"),
    "The findings sentence in the Abstract": ("Abstract — written out; the highlighted figures are the ones to replace", "draft"),
}
DONE_RUN = ('<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" '
            'w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/>'
            '<w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t xml:space="preserve">%s</w:t></w:r>')
for key, (where, state) in CHECK.items():
    tr = next(r for r in re.findall(r"<w:tr[ >].*?</w:tr>", block, re.S)
              if key in html.unescape("".join(WT.findall(r))))
    cells = re.findall(r"<w:tc>.*?</w:tc>", tr, re.S)
    new_tr = tr
    m = re.search(r"(<w:t(?: [^>]*)?>)(.*?)(</w:t>)", cells[2], re.S)
    new_tr = new_tr.replace(cells[2], cells[2][:m.start()] + m.group(1) + esc(where) + m.group(3) + cells[2][m.end():], 1)
    new_tr = new_tr.replace(
        cells[3],
        re.sub(r"<w:r>(?:(?!</w:r>).)*?<w:t[^>]*> </w:t></w:r>", DONE_RUN % state, cells[3], count=1, flags=re.S), 1)
    block = block.replace(tr, new_tr, 1)
x = x[:t.start()] + block + x[t.end():]
done.append("checklist rows 8–11")

shutil.copy(SRC, DST)
zin = zipfile.ZipFile(SRC)
with zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED) as zo:
    for it in zin.infolist():
        d = zin.read(it.filename)
        if it.filename == "word/document.xml":
            d = x.encode("utf8")
        zo.writestr(it, d)
zin.close()
print("\n".join("  " + s for s in done))
print("wrote", DST)

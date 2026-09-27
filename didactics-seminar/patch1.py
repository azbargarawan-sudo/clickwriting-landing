# -*- coding: utf-8 -*-
"""Set the class size to 20 (10 boys, 10 girls, four teams of five) throughout."""
import re, shutil, zipfile

SRC = "games.docx"
DST = "games_20.docx"

x = zipfile.ZipFile(SRC).read("word/document.xml").decode("utf8")
orig = x
log = []


def rep(old, new, n=1):
    global x
    c = x.count(old)
    assert c == n, f"{c} occurrences (expected {n}) of {old[:70]!r}"
    x = x.replace(old, new)
    log.append(old[:60])


# --- Abstract, Introduction -------------------------------------------------
rep("Twenty-two fourth-grade pupils", "Twenty fourth-grade pupils")

i = x.find(" beginner learners")
j = x.rfind(">22</w:t>", 0, i)
assert j > 0 and i - j < 400
x = x[:j] + ">20</w:t>" + x[j + len(">22</w:t>"):]
log.append("intro: 22 beginner learners")

# --- 4.1 Participants -------------------------------------------------------
rep("The number of participants is set to 22 throughout, the size of the class, in four teams: two of five pupils and two of six. If some pupils are absent on the day, change the number in the Abstract, the Introduction, this section, Section 4.6 (the code range), Table 1, Section 6.3, Section 7.1 and Appendix H.1.",
    "The number of participants is set to 20 throughout, the size of the class, in four mixed-ability teams of five pupils. If some pupils are absent on the day, change the number in the Abstract, the Introduction, this section, Section 4.6 (the code range), Table 1, Section 6.3, Section 7.1 and Appendix H.1.")
rep("The participants were 22 fourth-grade pupils", "The participants were 20 fourth-grade pupils")
rep("The class includes 12 boys and 10 girls", "The class includes 10 boys and 10 girls")
rep("The 22 pupils worked in four mixed-ability teams throughout the game, two of five pupils and two of six.",
    "The 20 pupils worked in four mixed-ability teams of five pupils throughout the game.")

# --- 4.3 The game -----------------------------------------------------------
rep("Pupils are divided into four mixed-ability teams of five or six pupils",
    "Pupils are divided into four mixed-ability teams of five pupils")
rep("Every pupil holds one of five role cards (in a team of six, two pupils share the Reader card), and the cards",
    "Every pupil holds one of five role cards, and the cards")

# --- 4.4 Procedure: the sessions took place in September 2026 ----------------
rep('<w:t xml:space="preserve">June</w:t>', '<w:t xml:space="preserve">September</w:t>')
rep('<w:t xml:space="preserve"> 2026 (20, 23, 26 and 29 June). Each session',
    '<w:t xml:space="preserve"> 2026 (</w:t></w:r>'
    '<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:highlight w:val="yellow"/></w:rPr>'
    '<w:t xml:space="preserve">exact dates of the four sessions</w:t></w:r>'
    '<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>'
    '<w:t xml:space="preserve">). Each session')

# --- 4.6 code range ---------------------------------------------------------
rep("<w:t>S1–S22</w:t>", "<w:t>S1–S20</w:t>")

# --- Chapter 5 note ---------------------------------------------------------
rep("The paper is set to the 22 pupils in the class; if some are absent on the day, update the number.",
    "The paper is set to the 20 pupils in the class.")
rep("with _________ of the 22 pupils answering correctly", "with _________ of the 20 pupils answering correctly")

# --- Table 1 ----------------------------------------------------------------
rep("Comprehension of story elements on the individual response sheet (N = 22)",
    "Comprehension of story elements on the individual response sheet (N = 20)")
tbl = re.search(r"<w:tbl>(?:(?!</w:tbl>).)*?Item \(question type\).*?</w:tbl>", x, re.S)
assert tbl
block = tbl.group(0)
new_block, n = re.subn(r"(<w:t(?: [^>]*)?>)22(</w:t>)", r"\g<1>20\g<2>", block)
assert n == 5, n
x = x[: tbl.start()] + new_block + x[tbl.end():]
log.append(f"Table 1 totals: {n} cells")

# --- 6.3 and 7.1 ------------------------------------------------------------
rep("Nor can 22 pupils in a single class", "Nor can 20 pupils in a single class")
rep("It was carried out in a single class of 22 pupils", "It was carried out in a single class of 20 pupils")

# --- Appendix C -------------------------------------------------------------
rep("Four teams of five or six pupils rotate", "Four teams of five pupils rotate")
rep("Four mixed-ability teams, two of five pupils and two of six. Every pupil holds one role card (in a team of six, two pupils share the Reader card): Reader",
    "Four mixed-ability teams of five pupils. Every pupil holds one role card: Reader")
rep("Role cards, one set of five per team (in a team of six, two pupils share the Reader card)",
    "Role cards, one set of five per team")

# --- Appendix H.1 code sheet: drop the two malformed S21/S22 rows -----------
tbl = re.search(r"<w:tbl>(?:(?!</w:tbl>).)*?>S1</w:t>.*?</w:tbl>", x, re.S)
assert tbl
block = tbl.group(0)
rows = re.findall(r"<w:tr[ >].*?</w:tr>", block, re.S)
assert len(rows) == 10, len(rows)
for bad in (rows[8], rows[7]):
    assert "S21" in bad or "S22" in bad, bad[:200]
    block = block.replace(bad, "", 1)
assert len(re.findall(r"<w:tr[ >].*?</w:tr>", block, re.S)) == 8
x = x[: tbl.start()] + block + x[tbl.end():]
log.append("code sheet: removed S21/S22 rows")

# --- Before Submission checklist -------------------------------------------
tbl = re.search(r"<w:tbl>(?:(?!</w:tbl>).)*?What is missing.*?</w:tbl>", x, re.S)
assert tbl
block = tbl.group(0)
rows = re.findall(r"<w:tr[ >].*?</w:tr>", block, re.S)
assert len(rows) == 15, len(rows)

DONE_RUN = ('<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" '
            'w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/>'
            '<w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr>'
            '<w:t xml:space="preserve">done</w:t></w:r>')


def set_cell(row, idx, text=None, done=False):
    cells = re.findall(r"<w:tc>.*?</w:tc>", row, re.S)
    cell = cells[idx]
    new = cell
    if done:
        new = re.sub(r"<w:r>(?:(?!</w:r>).)*?<w:t[^>]*> </w:t></w:r>", DONE_RUN, new, count=1, flags=re.S)
        assert new != cell, "done cell untouched"
    else:
        m = re.search(r"(<w:t(?: [^>]*)?>)(.*?)(</w:t>)", new, re.S)
        assert m
        new = new[: m.start()] + m.group(1) + text + m.group(3) + new[m.end():]
    return row.replace(cell, new, 1)


def patch_row(i, where=None, done=False):
    global block
    row = re.findall(r"<w:tr[ >].*?</w:tr>", block, re.S)[i]
    new = row
    if where is not None:
        new = set_cell(new, 2, text=where)
    if done:
        new = set_cell(new, 3, done=True)
    block = block.replace(row, new, 1)


patch_row(3, where="Section 4.1 — a state elementary school in Tira; confirm that this is the school", done=True)
patch_row(4, where="Section 4.1 — 10 boys and 10 girls, 20 pupils in four teams of five", done=True)
patch_row(7, where="Section 4.4 — September 2026; the four dates are still highlighted")
patch_row(12, where="Removed from this version. If the course submission box requires a declaration, paste its official wording at the end")
x = x[: tbl.start()] + block + x[tbl.end():]
log.append("checklist rows 3, 4, 7, 12")

# --- write ------------------------------------------------------------------
assert x != orig
shutil.copy(SRC, DST)
zin = zipfile.ZipFile(SRC)
with zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "word/document.xml":
            data = x.encode("utf8")
        zout.writestr(item, data)
print("\n".join("  ok  " + s for s in log))
print("wrote", DST)

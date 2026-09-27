# -*- coding: utf-8 -*-
"""Trim the abstract to length and settle on US spelling."""
import html, re, shutil, zipfile

P = "games_filled.docx"
RPR = ('<w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" '
       'w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/>'
       '<w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>')
RPR_HL = RPR.replace("</w:rPr>", '<w:highlight w:val="yellow"/></w:rPr>')
WT = re.compile(r"<w:t(?: [^>]*)?>(.*?)</w:t>", re.S)
x = zipfile.ZipFile(P).read("word/document.xml").decode("utf8")


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def runs(text):
    return "".join(f'<w:r>{RPR_HL if i % 2 else RPR}<w:t xml:space="preserve">{esc(p)}</w:t></w:r>'
                   for i, p in enumerate(re.split(r"<<(.+?)>>", text)) if p)


def rebuild(anchor, text):
    global x
    hits = [m for m in re.finditer(r"<w:p[ >].*?</w:p>", x, re.S)
            if anchor in html.unescape("".join(WT.findall(m.group(0))))]
    assert len(hits) == 1, f"{len(hits)} hits for {anchor[:50]!r}"
    m = hits[0]
    ppr = re.match(r"<w:p>(<w:pPr>.*?</w:pPr>)", m.group(0), re.S)
    ppr = ppr.group(1) if ppr else ""
    x = x[:m.start()] + f"<w:p>{ppr}{runs(text)}</w:p>" + x[m.end():]


ABSTRACT = (
    "Many fourth-grade EFL learners can read a story aloud without being able to say what it was about. This "
    "paper reports a qualitative, classroom-based study of one attempt to address that gap through an "
    "educational game. Twenty fourth-grade pupils (ages 9–10) in one beginner-level EFL class, whose first "
    "language is Arabic, read a 164-word narrative written for the study and then played \"Colorful Question "
    "Adventure\", a station-based game in which four mixed-ability teams rotate between four tasks: matching "
    "characters to descriptions, choosing the main idea, ordering events, and judging true and false "
    "statements. The rules award a bonus point for showing the line in the text that supports an answer. Data "
    "were collected through a structured observation checklist, individual response sheets, and field notes, "
    "and were analyzed thematically (Braun & Clarke, 2006). Pupils identified the characters accurately, "
    "<<16>> of <<20>> naming all four, while <<11>> chose the main idea and <<7>> explained why a character "
    "cries. Returning to the text, observed at <<10>> of <<16>> station visits, was governed by the task "
    "rather than by the team, and behavioral engagement stood near its ceiling while the talk at the tables "
    "remained mostly in the pupils’ first language. Unlike the questionnaire study on which it builds, which "
    "modeled self-reported motivation among 434 university students (Li et al., 2024), this study does not "
    "claim to measure an effect; its contribution is a description of the gap between behavioral and "
    "cognitive engagement that a score alone would hide (Fredricks et al., 2004)."
)
words = len(re.sub(r"<<|>>", "", ABSTRACT).split())
rebuild("Many fourth-grade EFL learners can read a story aloud" if "Many fourth-grade EFL learners" in x
        else "Reading is the skill through which young EFL learners", ABSTRACT)
rebuild("Note to the writers (delete before submission): An abstract of about",
        f"Note to the writers (delete before submission): An abstract of about 200–250 words is standard; this "
        f"one runs to {words}. Everything in it is drawn from the paper itself. Check whether Dr Hanna-Irsheid "
        f"requires an abstract in Arabic or Hebrew as well.")
print("abstract words:", words)

before = x
x = x.replace("neighbouring", "neighboring").replace("neighbour", "neighbor")
print("spelling fixes:", len(re.findall("neighbour", before)))

zin = zipfile.ZipFile(P)
tmp = P + ".tmp"
with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zo:
    for it in zin.infolist():
        d = zin.read(it.filename)
        if it.filename == "word/document.xml":
            d = x.encode("utf8")
        zo.writestr(it, d)
zin.close()
shutil.move(tmp, P)

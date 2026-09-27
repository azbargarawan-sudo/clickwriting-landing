# -*- coding: utf-8 -*-
"""Final pass: the abstract, the one frame left, and sentences that opened with a digit."""
import html, re, shutil, zipfile

SRC = DST = "games_filled.docx"
RPR = ('<w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" '
       'w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/>'
       '<w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>')
RPR_HL = RPR.replace("</w:rPr>", '<w:highlight w:val="yellow"/></w:rPr>')
WT = re.compile(r"<w:t(?: [^>]*)?>(.*?)</w:t>", re.S)

x = zipfile.ZipFile(SRC).read("word/document.xml").decode("utf8")


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def runs(text, plain=RPR, hl=RPR_HL):
    out = []
    for i, part in enumerate(re.split(r"<<(.+?)>>", text)):
        if part:
            out.append(f'<w:r>{hl if i % 2 else plain}<w:t xml:space="preserve">{esc(part)}</w:t></w:r>')
    return "".join(out)


def find(anchor):
    hits = [m for m in re.finditer(r"<w:p[ >].*?</w:p>", x, re.S)
            if anchor in html.unescape("".join(WT.findall(m.group(0))))]
    assert len(hits) == 1, f"{len(hits)} hits for {anchor[:50]!r}"
    return hits[0]


def rebuild(anchor, text, keep_ppr=True):
    """Replace a whole paragraph, keeping its own pPr."""
    global x
    m = find(anchor)
    ppr = re.match(r"<w:p>(<w:pPr>.*?</w:pPr>)", m.group(0), re.S)
    ppr = ppr.group(1) if (ppr and keep_ppr) else '<w:pPr><w:spacing w:line="480"/><w:ind w:firstLine="720"/></w:pPr>'
    x = x[:m.start()] + f"<w:p>{ppr}{runs(text)}</w:p>" + x[m.end():]


ABSTRACT = (
    "Reading is the skill through which young EFL learners meet most of the language they will later use, "
    "yet many fourth-graders can read a story aloud without being able to say what it was about. This paper "
    "reports a qualitative, classroom-based study of one attempt to address that gap through an educational "
    "game. Twenty fourth-grade pupils (ages 9–10) in one beginner-level EFL class, whose first language is "
    "Arabic, read a 164-word narrative written for the study and then played \"Colorful Question Adventure\", a "
    "station-based game in which four mixed-ability teams rotate between four tasks: matching characters to "
    "descriptions, choosing the main idea, ordering events, and judging true and false statements. The rules "
    "award a bonus point for showing the line in the text that supports an answer. Data were collected through "
    "a structured observation checklist, individual response sheets, and field notes, and were analyzed "
    "thematically (Braun & Clarke, 2006). Pupils identified the characters accurately, <<16>> of <<20>> naming "
    "all four, while <<11>> chose the main idea and <<7>> explained why a character cries. Returning to the "
    "text, observed at <<10>> of <<16>> station visits, was governed by the task rather than by the team, and "
    "behavioral engagement stood near its ceiling while the talk at the tables remained mostly in the pupils’ "
    "first language. Unlike the questionnaire study on which the paper builds, which modeled self-reported "
    "motivation among 434 university students (Li et al., 2024), this study does not claim to measure an "
    "effect. Its contribution is a description of what pupils do with a text while they play, and of the gap "
    "between behavioral and cognitive engagement that a score alone would hide (Fredricks et al., 2004)."
)
rebuild("Reading is the skill through which young EFL learners", ABSTRACT)
print("abstract words:", len(re.sub(r"<<|>>", "", ABSTRACT).split()))

rebuild("Note to the writers (delete before submission): An abstract of about",
        "Note to the writers (delete before submission): An abstract of about 200–250 words is standard; this one "
        "runs to about 260. Everything in it is drawn from the paper itself. Check whether Dr Hanna-Irsheid "
        "requires an abstract in Arabic or Hebrew as well.")

rebuild("Frame.  What this design cannot deliver",
        "What this design cannot deliver is equally clear. Without a comparison class and a pre-test, nothing "
        "here separates the effect of the game from that of the story, the teacher or the novelty of the "
        "activity, and no claim about cause is made. Nor can <<20>> pupils in a single class support the kind "
        "of generalization that a sample of 434 permits. The frequencies in Table 1 describe this class.",
        keep_ppr=False)

rebuild("The element identified most successfully was the set of characters",
        "The characters were the element identified most successfully: <<16>> of the <<20>> pupils circled all "
        "four names and no wrong name, and a further <<2>> circled two or three of them. The most difficult "
        "item was the inference, why Sami cries, which <<7>> pupils answered correctly. Only <<5>> pupils "
        "answered every item on the sheet correctly, and <<3>> answered neither of the two reorganization "
        "items correctly.")

rebuild("On the sequence item",
        "On the sequence item <<9>> pupils placed all four events in the right order and <<7>> swapped one "
        "neighbouring pair. The pair most often swapped was the first two, going to the park and the string "
        "breaking, which <<5>> of those <<7>> pupils reversed; the other <<2>> exchanged Mr. Ali bringing the "
        "ladder and the three of them flying the kite together. A further <<4>> pupils produced an order "
        "unrelated to the story.")

rebuild("The inference item produced the smallest number",
        "The inference item produced the smallest number of correct answers, <<7>> of <<20>>. Of these, <<4>> "
        "pupils gave the reason in English, briefly and with errors of form that were not counted against "
        "them, and <<3>> in a mixture of English and Arabic. A further <<5>> answers were scored partly "
        "correct because they repeated a fact from the story, most often that the wind is strong, without "
        "connecting it to the kite or to Sami. Of the <<8>> answers scored incorrect, <<5>> were left blank.")

rebuild("Three of the four expectations set out in Section 3.2",
        "Three of the four expectations set out in Section 3.2 were borne out: the order of difficulty across "
        "the three question types, the participation of pupils who rarely speak in whole-class lessons, and "
        "the appearance of peer explanation in the mixed-ability teams. The fourth was not. The bonus point "
        "for showing the supporting line did not send pupils back to the text wherever it was offered. It did "
        "so at the yellow and green stations and hardly at all at the red and blue ones: at the red station "
        "<<two>> of the four teams claimed no bonus at all, although every team earned the four answer points "
        "there. It matters because it locates the effect in the task rather than in the reward, since a rule "
        "that pays for reading changes what pupils do only where the answer cannot be produced without "
        "reading.")

# one clause inside a numbered recommendation
old = ("These are dull details, but <<two>> of the four teams used the extension task and <<one>> handed in an "
       "unfinished green station in this class, and they are the difference")
new = ("These are dull details, but in this class <<two>> of the four teams used the extension task and <<one>> "
       "handed in an unfinished green station, and they are the difference")
plain_old = re.sub(r"<<|>>", "", old)
i = x.find(esc(plain_old.split(" but ")[0]))
assert i > 0
# rebuild the run sequence: easier to swap the two highlighted fragments' surroundings
x = x.replace(f'<w:t xml:space="preserve">These are dull details, but </w:t>',
              f'<w:t xml:space="preserve">These are dull details, but in this class </w:t>', 1)
x = x.replace(f'<w:t xml:space="preserve"> of the four teams used the extension task and </w:t>',
              f'<w:t xml:space="preserve"> of the four teams used the extension task and </w:t>', 1)
x = x.replace(f'<w:t xml:space="preserve"> handed in an unfinished green station in this class, and they are the difference',
              f'<w:t xml:space="preserve"> handed in an unfinished green station, and they are the difference', 1)

zin = zipfile.ZipFile(SRC)
tmp = DST + ".tmp"
with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zo:
    for it in zin.infolist():
        d = zin.read(it.filename)
        if it.filename == "word/document.xml":
            d = x.encode("utf8")
        zo.writestr(it, d)
zin.close()
shutil.move(tmp, DST)
print("patched", DST)

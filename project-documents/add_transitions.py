# -*- coding: utf-8 -*-
"""Add slide transitions (special effects) to the generated deck.

PowerPoint stores a transition as a <p:transition> child of <p:sld>, after
<p:clrMapOvr>. pptxgenjs does not expose transitions, so they are injected here.
"""
import re
import shutil
import zipfile
from pathlib import Path

SRC = Path("presentation.pptx")
TMP = Path("pptx_unpacked")

# slide number -> transition XML. Dark section slides get a push, content a fade.
PUSH = '<p:transition spd="slow"><p:push dir="l"/></p:transition>'
FADE = '<p:transition spd="med"><p:fade/></p:transition>'

if TMP.exists():
    shutil.rmtree(TMP)
with zipfile.ZipFile(SRC) as z:
    names = z.namelist()
    z.extractall(TMP)

slides = sorted(
    (p for p in (TMP / "ppt" / "slides").glob("slide*.xml")),
    key=lambda p: int(re.search(r"\d+", p.name).group()),
)
dark = {1, len(slides)}  # cover and closing slide

for p in slides:
    n = int(re.search(r"\d+", p.name).group())
    xml = p.read_text(encoding="utf-8")
    if "<p:transition" in xml:
        continue
    trans = PUSH if n in dark else FADE
    if "</p:clrMapOvr>" in xml:
        xml = xml.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + trans, 1)
    else:
        xml = xml.replace("</p:sld>", trans + "</p:sld>", 1)
    p.write_text(xml, encoding="utf-8")

out = Path("presentation.pptx")
tmp_out = Path("presentation_new.pptx")
with zipfile.ZipFile(tmp_out, "w", zipfile.ZIP_DEFLATED) as z:
    for name in names:  # preserve original part order
        z.write(TMP / name, name)
tmp_out.replace(out)
shutil.rmtree(TMP)
print(f"transitions added to {len(slides)} slides")

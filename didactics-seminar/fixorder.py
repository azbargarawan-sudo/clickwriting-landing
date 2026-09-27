# -*- coding: utf-8 -*-
"""Put <w:pBdr> where the schema expects it, and order its sides top-left-bottom-right."""
import re, shutil, sys, zipfile

BEFORE_PBDR = ("pStyle", "keepNext", "keepLines", "pageBreakBefore", "framePr",
               "widowControl", "numPr", "suppressLineNumbers")
SIDES = ("top", "left", "bottom", "right", "between", "bar")


def fix_pbdr(pbdr: str) -> str:
    kids = re.findall(r"<w:(?:top|left|bottom|right|between|bar)\b[^>]*/>", pbdr)
    kids.sort(key=lambda k: SIDES.index(re.match(r"<w:(\w+)", k).group(1)))
    return "<w:pBdr>" + "".join(kids) + "</w:pBdr>"


def fix_ppr(ppr: str) -> str:
    m = re.search(r"<w:pBdr>.*?</w:pBdr>", ppr, re.S)
    if not m:
        return ppr
    pbdr = fix_pbdr(m.group(0))
    body = ppr[len("<w:pPr>"):-len("</w:pPr>")]
    body = body[: m.start() - len("<w:pPr>")] + body[m.end() - len("<w:pPr>"):]
    pos = 0
    while True:
        nxt = re.match(r"<w:(\w+)\b[^>]*(?:/>|>)", body[pos:])
        if not nxt or nxt.group(1) not in BEFORE_PBDR:
            break
        tag = nxt.group(1)
        if nxt.group(0).endswith("/>"):
            pos += nxt.end()
        else:
            end = body.index(f"</w:{tag}>", pos) + len(f"</w:{tag}>")
            pos = end
    return "<w:pPr>" + body[:pos] + pbdr + body[pos:] + "</w:pPr>"


path = sys.argv[1]
x = zipfile.ZipFile(path).read("word/document.xml").decode("utf8")
x2 = re.sub(r"<w:pPr>.*?</w:pPr>", lambda m: fix_ppr(m.group(0)), x, flags=re.S)
print("pPr blocks changed:", sum(1 for a, b in zip(re.findall(r"<w:pPr>.*?</w:pPr>", x, re.S),
                                                   re.findall(r"<w:pPr>.*?</w:pPr>", x2, re.S)) if a != b))
zin = zipfile.ZipFile(path)
tmp = path + ".tmp"
with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zo:
    for it in zin.infolist():
        d = zin.read(it.filename)
        if it.filename == "word/document.xml":
            d = x2.encode("utf8")
        zo.writestr(it, d)
zin.close()
shutil.move(tmp, path)

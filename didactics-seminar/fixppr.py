# -*- coding: utf-8 -*-
"""Order the direct children of every <w:pPr> as the OOXML schema requires."""
import re, shutil, sys, zipfile

ORDER = ["pStyle", "keepNext", "keepLines", "pageBreakBefore", "framePr", "widowControl",
         "numPr", "suppressLineNumbers", "pBdr", "shd", "tabs", "suppressAutoHyphens",
         "kinsoku", "wordWrap", "overflowPunct", "topLinePunct", "autoSpaceDE",
         "autoSpaceDN", "bidi", "adjustRightInd", "snapToGrid", "spacing", "ind",
         "contextualSpacing", "mirrorIndents", "suppressOverlap", "jc", "textDirection",
         "textAlignment", "textboxTightWrap", "outlineLvl", "divId", "cnfStyle", "rPr",
         "sectPr", "pPrChange"]


def children(body: str):
    out, pos = [], 0
    while pos < len(body):
        m = re.match(r"<w:(\w+)\b[^>]*?(/?)>", body[pos:])
        if not m:
            out.append((None, body[pos:]))
            break
        tag = m.group(1)
        if m.group(2) == "/":
            end = pos + m.end()
        else:
            end = body.index(f"</w:{tag}>", pos) + len(f"</w:{tag}>")
        out.append((tag, body[pos:end]))
        pos = end
    return out


def fix(ppr: str) -> str:
    body = ppr[len("<w:pPr>"):-len("</w:pPr>")]
    kids = children(body)
    if any(t is None for t, _ in kids):
        return ppr
    kids.sort(key=lambda k: ORDER.index(k[0]) if k[0] in ORDER else len(ORDER))
    return "<w:pPr>" + "".join(s for _, s in kids) + "</w:pPr>"


path = sys.argv[1]
x = zipfile.ZipFile(path).read("word/document.xml").decode("utf8")
x2 = re.sub(r"<w:pPr>.*?</w:pPr>", lambda m: fix(m.group(0)), x, flags=re.S)
a = re.findall(r"<w:pPr>.*?</w:pPr>", x, re.S)
b = re.findall(r"<w:pPr>.*?</w:pPr>", x2, re.S)
print("pPr blocks reordered:", sum(1 for p, q in zip(a, b) if p != q))
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

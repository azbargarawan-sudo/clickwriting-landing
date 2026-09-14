"""Set rtlCol="1" on every text body whose paragraphs are RTL.

pptxgenjs always writes rtlCol="0", which makes PowerPoint treat the text body
as left-to-right. A trailing neutral character (the closing period) is then
placed at the visual start of the line instead of its end. This rewrites the
bodyPr of RTL shapes and table cells only, leaving LTR boxes untouched.
"""
import re
import shutil
import sys
import zipfile

SLIDE = re.compile(r"ppt/slides/slide\d+\.xml$")


def fix_block(block: str) -> str:
    """Flip rtlCol on one <p:sp>/<a:tc> block when its paragraphs are RTL."""
    if 'rtl="1"' not in block:
        return block
    block = block.replace('rtlCol="0"', 'rtlCol="1"')
    # Table cells get a bare <a:bodyPr/>, which defaults to rtlCol="0".
    block = block.replace("<a:bodyPr/>", '<a:bodyPr rtlCol="1"/>')
    return block


def fix_xml(xml: str) -> str:
    for tag in ("p:sp", "a:tc"):
        xml = re.sub(
            rf"<{tag}>.*?</{tag}>",
            lambda m: fix_block(m.group(0)),
            xml,
            flags=re.S,
        )
    return xml


def main(path: str) -> None:
    tmp = path + ".tmp"
    with zipfile.ZipFile(path) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        changed = 0
        for item in zin.infolist():
            data = zin.read(item.filename)
            if SLIDE.match(item.filename):
                xml = data.decode("utf8")
                fixed = fix_xml(xml)
                changed += fixed.count('rtlCol="1"')
                data = fixed.encode("utf8")
            zout.writestr(item, data)
    shutil.move(tmp, path)
    print(f"rtlCol=1 applied to {changed} text bodies")


if __name__ == "__main__":
    main(sys.argv[1])

# -*- coding: utf-8 -*-
"""Post-process the built docx: no first-line indent, no spell-check marks, page breaks via pageBreakBefore,
and a pre-filled table of contents (estimated page numbers; Word refreshes them on open)."""
import re, zipfile, math, shutil, sys
SRC = 'עבודה_סמינריונית_סופית_מסכים_שינה_פעילות_גופנית_לקויות_למידה.docx'
zin = zipfile.ZipFile(SRC)
x = zin.read('word/document.xml').decode('utf-8')

# 1. first line of every paragraph flush with the margin
x = x.replace('<w:ind w:firstLine="709"/>', '')

# 2. page breaks: turn "<p><br page/></p>" + next paragraph into pageBreakBefore on that paragraph
x = re.sub(r'<w:p><w:r><w:br w:type="page"/></w:r></w:p><w:p><w:pPr>(<w:pStyle[^>]*/>)?',
           lambda m: '<w:p><w:pPr>' + (m.group(1) or '') + '<w:pageBreakBefore/>', x)

# 3. spell/grammar: mark every run noProof + language he-IL/en-US
def fix_rpr(m):
    inner = m.group(1)
    if 'noProof' not in inner:
        pos = None
        for tag in ('<w:color', '<w:sz ', '<w:szCs', '<w:rtl', '<w:i/>', '<w:iCs'):
            k = inner.find(tag)
            if k != -1 and (pos is None or k < pos): pos = k
        # noProof must come after b/bCs/i/iCs and before color/sz: insert before color/sz if present, else at end
        for tag in ('<w:color', '<w:sz ', '<w:szCs', '<w:rtl'):
            k = inner.find(tag)
            if k != -1: pos = k; break
        else: pos = len(inner)
        inner = inner[:pos] + '<w:noProof/>' + inner[pos:]
    if '<w:lang' not in inner:
        inner = inner + '<w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="he-IL"/>'
    return '<w:rPr>' + inner + '</w:rPr>'
x = re.sub(r'<w:rPr>(.*?)</w:rPr>', fix_rpr, x, flags=re.S)
x = re.sub(r'<w:r>(?!<w:rPr>)', '<w:r><w:rPr><w:noProof/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="he-IL"/></w:rPr>', x)

# 4. estimate page numbers and pre-fill the TOC
body = x[x.index('<w:body>') + 8: x.index('<w:sectPr')]
# top-level blocks: paragraphs, tables, sdt
blocks = re.findall(r'(<w:p>.*?</w:p>|<w:p [^>]*>.*?</w:p>|<w:tbl>.*?</w:tbl>|<w:sdt>.*?</w:sdt>)', body, flags=re.S)
LINES_PER_PAGE, CHARS_PER_LINE = 32.0, 88.0
page, lines, nbreaks = 1, 0.0, 0
entries = []
def newpage():
    global page, lines, nbreaks
    nbreaks += 1
    page = nbreaks + 1 if nbreaks <= 2 else page + 1   # title page = 1, TOC = 2, introduction = 3
    lines = 0.0
for b in blocks:
    if b.startswith('<w:sdt'):  # the TOC field itself
        lines += 0.7 * sum(1 for l,t,p in entries) + 26; continue
    if b.startswith('<w:tbl'):
        rows = re.findall(r'<w:tr[ >].*?</w:tr>', b, flags=re.S)
        ncols = max(1, len(re.findall(r'<w:gridCol', b)))
        tl = 1.0
        for r in rows:
            cells = [re.sub(r'<[^>]+>', '', c) for c in re.findall(r'<w:tc>.*?</w:tc>', r, flags=re.S)]
            longest = max((len(c) for c in cells), default=0)
            tl += max(1, math.ceil(longest / (CHARS_PER_LINE / ncols * 1.15))) * 1.15
        if lines + tl > LINES_PER_PAGE and tl < LINES_PER_PAGE: newpage()
        lines += tl
        while lines > LINES_PER_PAGE: lines -= LINES_PER_PAGE; page += 1
        continue
    if '<w:pageBreakBefore/>' in b: newpage()
    txt = re.sub(r'<[^>]+>', '', b)
    img = re.search(r'<wp:extent cx="\d+" cy="(\d+)"', b)
    if img:
        h_cm = int(img.group(1)) / 360000; tl = h_cm * 10 / 7.9 + 1
    else:
        style = re.search(r'<w:pStyle w:val="(Heading\d)"', b)
        if style:
            lvl = style.group(1)[-1]
            entries.append((int(lvl), txt.strip(), page))
            tl = 2.2 if lvl == '1' else 1.8
        elif not txt.strip():
            tl = 1.0
        else:
            tl = math.ceil(len(txt) / CHARS_PER_LINE) + 0.35
    if lines + tl > LINES_PER_PAGE:
        # paragraph overflows: continue on next page
        rem = lines + tl - LINES_PER_PAGE; page += 1; lines = rem
        if style and lines <= 1.5: pass
    else:
        lines += tl

# build static TOC entries (levels 1-2), RTL, dot leader, right tab at the left margin
toc_paras = []
skip_after_appendix = False
for lvl, text, pg in entries:
    if lvl > 2 or text.strip() == 'תוכן עניינים': continue
    if text.startswith('נספחים'): skip_after_appendix = True
    if skip_after_appendix and lvl == 2 and not text.startswith('נספח'): continue
    ind = '' if lvl == 1 else '<w:ind w:start="440"/>'
    bold = '<w:b/><w:bCs/>' if lvl == 1 else ''
    toc_paras.append(
        f'<w:p><w:pPr><w:bidi/><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9020"/></w:tabs>{ind}<w:spacing w:after="40" w:line="240"/></w:pPr>'
        f'<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="David" w:hAnsi="Times New Roman"/>{bold}<w:noProof/><w:sz w:val="24"/><w:szCs w:val="24"/><w:rtl/><w:lang w:val="en-US" w:bidi="he-IL"/></w:rPr><w:t xml:space="preserve">{text}</w:t></w:r>'
        f'<w:r><w:rPr><w:noProof/></w:rPr><w:tab/></w:r>'
        f'<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="David" w:hAnsi="Times New Roman"/>{bold}<w:noProof/><w:sz w:val="24"/><w:szCs w:val="24"/><w:rtl/></w:rPr><w:t>{pg}</w:t></w:r></w:p>')
x = x.replace('TOC \\h \\o &quot;1-3&quot;', 'TOC \\h \\o &quot;1-2&quot;')
sep = '<w:fldChar w:fldCharType="separate"/></w:r></w:p>'
k = x.index(sep) + len(sep)
x = x[:k] + ''.join(toc_paras) + x[k:]
# drop the italic instruction line under the TOC (no longer needed)
x = re.sub(r'<w:p><w:pPr><w:bidi/><w:jc w:val="right"/></w:pPr><w:r><w:rPr>(?:(?!</w:p>).)*?\(מספרי העמודים מתעדכנים.*?</w:p>', '', x, flags=re.S)

OUT = SRC
tmp = OUT + '.tmp'
with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = x.encode('utf-8') if item.filename == 'word/document.xml' else zin.read(item.filename)
        zout.writestr(item, data)
zin.close(); shutil.move(tmp, OUT)
print('pages estimated: last page', page)
for lvl, t, pg in entries:
    if lvl <= 2: print(f'{"  " * (lvl - 1)}{t[:55]:60s} {pg}')

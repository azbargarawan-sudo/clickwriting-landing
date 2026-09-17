import zipfile, re, sys, shutil, subprocess, os
import pymupdf
SRC = 'out/paper.docx'; OUT = 'out/paper_toc.docx'
D = '/root/.claude/skills/synced/c10e9a46-a3c4-4f91-9f97-cbac23446afd_10dbd6e9-3ecb-43b8-9009-77be22bdf04f/docx/scripts/office/soffice.py'

def render(docx):
    subprocess.run(['python', D, '--headless', '--convert-to', 'pdf', '--outdir', 'out', docx], capture_output=True, timeout=240)
    return pymupdf.open(docx.replace('.docx', '.pdf'))

z = zipfile.ZipFile(SRC); doc = z.read('word/document.xml').decode(); styles = z.read('word/styles.xml').decode()
# headings in order
heads = []
for m in re.finditer(r'<w:p>(.*?)</w:p>', doc, flags=re.S):
    pm = re.search(r'<w:pStyle w:val="Heading([12])"/>', m.group(1))
    if pm:
        txt = ''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', m.group(1))).replace('‎', '')
        if txt.strip() != 'תוכן העניינים':
            heads.append((int(pm.group(1)), txt.strip()))
pdf = render(SRC)
pages = [pg.get_text().replace('‎', '') for pg in pdf]
entries = []
last = 2
for lvl, txt in heads:
    key = re.sub(r'\s+', ' ', txt.split(': ', 1)[-1] if txt.startswith('פרק') else txt)[:25]
    pg = next((i + 1 for i in range(last, len(pages)) if key in re.sub(r'\s+', ' ', pages[i])), None)
    if pg is None:
        pg = next((i + 1 for i in range(2, len(pages)) if key in re.sub(r'\s+', ' ', pages[i])), '?')
    else:
        last = pg - 1
    entries.append((lvl, txt, pg))
for e in entries: print(e)

def esc(t): return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
rpr = '<w:rPr><w:rFonts w:ascii="David" w:hAnsi="David" w:cs="David"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:rtl/></w:rPr>'
def entry_xml(lvl, txt, pg):
    ind = '<w:ind w:left="0" w:right="%d"/>' % (0 if lvl == 1 else 400)
    return ('<w:p><w:pPr><w:pStyle w:val="TOC%d"/><w:tabs><w:tab w:val="left" w:leader="dot" w:pos="8800"/></w:tabs><w:bidi/>'
            '<w:spacing w:line="300" w:lineRule="auto" w:after="40"/>%s</w:pPr>'
            '<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r><w:r>%s<w:tab/><w:t>%s</w:t></w:r></w:p>') % (lvl, ind, rpr, esc(txt), rpr, pg)
cached = ''.join(entry_xml(*e) for e in entries)
# inject cached entries: after the paragraph containing fldChar separate, before paragraph with fldChar end
i_sep = doc.index('w:fldCharType="separate"')
i_pend = doc.index('</w:p>', i_sep) + len('</w:p>')
doc = doc[:i_pend] + cached + doc[i_pend:]
# TOC styles with bidi
toc_styles = ''
for lvl in (1, 2):
    toc_styles += ('<w:style w:type="paragraph" w:styleId="TOC%d"><w:name w:val="toc %d"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="39"/>'
                   '<w:pPr><w:tabs><w:tab w:val="left" w:leader="dot" w:pos="8800"/></w:tabs><w:bidi/><w:spacing w:line="300" w:lineRule="auto" w:after="40"/><w:ind w:right="%d"/></w:pPr>'
                   '<w:rPr><w:rFonts w:ascii="David" w:hAnsi="David" w:cs="David"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>') % (lvl, lvl, 0 if lvl == 1 else 400)
styles = re.sub(r'<w:style w:type="paragraph" w:styleId="TOC[12]">.*?</w:style>', '', styles, flags=re.S)
styles = styles.replace('</w:styles>', toc_styles + '</w:styles>')
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as zo:
    for item in z.infolist():
        data = z.read(item.filename)
        if item.filename == 'word/document.xml': data = doc.encode()
        if item.filename == 'word/styles.xml': data = styles.encode()
        zo.writestr(item, data)
pdf2 = render(OUT)
print('pages', len(pdf2))
pages2 = [pg.get_text().replace('‎', '') for pg in pdf2]
ok = all(pg != '?' and re.sub(r'\s+', ' ', txt.split(': ', 1)[-1] if txt.startswith('פרק') else txt)[:25] in re.sub(r'\s+', ' ', pages2[pg - 1]) for lvl, txt, pg in entries)
print('page numbers still valid:', ok)

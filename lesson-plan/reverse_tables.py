# -*- coding: utf-8 -*-
"""Make RTL tables viewer-proof: drop w:bidiVisual and physically reverse
cell order (and grid columns), so column one of the file is the leftmost
cell in every viewer, including ones that ignore bidiVisual (iOS preview).
Usage: python3 reverse_tables.py in.docx out.docx
"""
import re, sys, shutil, subprocess, os, tempfile

src, dst = sys.argv[1], sys.argv[2]
work = tempfile.mkdtemp(dir='.')
subprocess.run(['unzip', '-qo', src, '-d', work], check=True)
p = os.path.join(work, 'word', 'document.xml')
doc = open(p, encoding='utf-8').read()

def process_table(t):
    if '<w:bidiVisual/>' not in t:
        return t
    out = t.replace('<w:bidiVisual/>', '', 1)
    # right-align the now-LTR table inside the RTL page
    if '<w:jc ' not in out.split('</w:tblPr>')[0]:
        out = out.replace('</w:tblPr>', '<w:tblLayout w:type="fixed"/></w:tblPr>', 1)
    # reverse grid columns
    m = re.search(r'<w:tblGrid>(.*?)</w:tblGrid>', out, re.S)
    if m:
        cols = re.findall(r'<w:gridCol[^>]*/>', m.group(1))
        out = out.replace(m.group(0), '<w:tblGrid>' + ''.join(reversed(cols)) + '</w:tblGrid>', 1)
    # reverse cells in every row
    rows = re.findall(r'<w:tr[ >].*?</w:tr>', out, re.S)
    for r in rows:
        tcs = re.findall(r'<w:tc>.*?</w:tc>', r, re.S)
        if len(tcs) < 2:
            continue
        first = r.find('<w:tc>')
        last = r.rfind('</w:tc>') + len('</w:tc>')
        new_r = r[:first] + ''.join(reversed(tcs)) + r[last:]
        out = out.replace(r, new_r, 1)
    return out

tables = re.findall(r'<w:tbl>.*?</w:tbl>', doc, re.S)
n = 0
for t in tables:
    nt = process_table(t)
    if nt != t:
        doc = doc.replace(t, nt, 1)
        n += 1
open(p, 'w', encoding='utf-8').write(doc)

if os.path.exists(dst):
    os.remove(dst)
subprocess.run(f'cd {work} && zip -qXr ../{dst} .', shell=True, check=True)
shutil.rmtree(work)
print(f'{dst}: reversed {n} tables')

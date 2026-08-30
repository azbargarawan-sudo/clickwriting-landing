# -*- coding: utf-8 -*-
"""Suppress spell/grammar squiggles: docDefaults noProof + hideSpellingErrors
+ proofState clean. Usage: python3 noproof.py file.docx"""
import re, sys, os, subprocess, tempfile, shutil
f = sys.argv[1]
work = tempfile.mkdtemp(dir='.')
subprocess.run(['unzip','-qo',f,'-d',work], check=True)

sp = os.path.join(work,'word','settings.xml')
s = open(sp, encoding='utf-8').read()
add = '<w:hideSpellingErrors/><w:hideGrammaticalErrors/><w:proofState w:spelling="clean" w:grammar="clean"/>'
if 'hideSpellingErrors' not in s:
    m = re.search(r'<w:zoom[^>]*/>', s)
    if m:
        s = s.replace(m.group(0), m.group(0)+add, 1)
    else:
        s = re.sub(r'(<w:settings[^>]*>)', r'\1'+add, s, count=1)
    open(sp,'w',encoding='utf-8').write(s)

stp = os.path.join(work,'word','styles.xml')
st = open(stp, encoding='utf-8').read()
if '<w:noProof/>' not in st:
    if '<w:rPrDefault>' in st:
        # inject noProof after rFonts inside the default rPr (schema: rFonts < noProof < sz)
        m = re.search(r'<w:rPrDefault><w:rPr>(<w:rFonts[^>]*/>)?', st)
        if m:
            st = st[:m.end()] + '<w:noProof/>' + st[m.end():]
    elif '<w:docDefaults>' not in st:
        st = re.sub(r'(<w:styles[^>]*>)',
            r'\1<w:docDefaults><w:rPrDefault><w:rPr><w:noProof/></w:rPr></w:rPrDefault><w:pPrDefault/></w:docDefaults>',
            st, count=1)
    open(stp,'w',encoding='utf-8').write(st)

os.remove(f)
subprocess.run(f'cd {work} && zip -qXr ../{f} .', shell=True, check=True)
shutil.rmtree(work)
print(f, 'proofing suppressed')

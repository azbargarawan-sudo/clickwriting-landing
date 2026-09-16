import subprocess, shutil, os, re, zipfile, pymupdf
from xml.sax.saxutils import escape

txt=''.join(open(f,encoding='utf-8').read() for f in ['content1.js','content2.js','content3.js'])
heads=[(m.group(1), m.group(2).replace("\\'","'")) for m in re.finditer(r"\{t:'(h[123])', x:'((?:[^'\\]|\\.)*)'",txt)]
IND={'h1':0,'h2':360,'h3':720}; STY={'h1':'TOC1','h2':'TOC2','h3':'TOC3'}
RPR='<w:rPr><w:rFonts w:ascii="David" w:hAnsi="David" w:cs="David"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US" w:bidi="he-IL"/>'
def entry(level,title,page):
    return ('<w:p><w:pPr>'+f'<w:pStyle w:val="{STY[level]}"/><w:bidi/>'
            '<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9026"/></w:tabs>'
            f'<w:spacing w:line="240" w:lineRule="auto" w:after="0"/><w:ind w:start="{IND[level]}"/><w:jc w:val="start"/></w:pPr>'
            f'<w:r>{RPR}<w:rtl/></w:rPr><w:t xml:space="preserve">{escape(title)}</w:t></w:r>'
            f'<w:r>{RPR}</w:rPr><w:tab/></w:r>'
            f'<w:r>{RPR}</w:rPr><w:t>{page}</w:t></w:r></w:p>')

def build_with(pages):
    entries=''.join(entry(l,t,p) for (l,t),p in zip(heads,pages)) if pages else ''
    shutil.rmtree('u',ignore_errors=True); os.makedirs('u')
    with zipfile.ZipFile('seminar.docx') as z: z.extractall('u')
    f='u/word/document.xml'; x=open(f,encoding='utf-8').read()
    i=x.find('<w:sdt>'); j=x.find('</w:sdt>',i)+8
    new=('<w:sdt><w:sdtPr><w:docPartObj><w:docPartGallery w:val="Table of Contents"/><w:docPartUnique/></w:docPartObj></w:sdtPr><w:sdtContent>'
         '<w:p><w:pPr><w:bidi/></w:pPr><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r>'
         '<w:r><w:instrText xml:space="preserve"> TOC \\o "1-3" \\h \\z \\u </w:instrText></w:r>'
         '<w:r><w:fldChar w:fldCharType="separate"/></w:r></w:p>'
         + entries +
         '<w:p><w:pPr><w:bidi/></w:pPr><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:sdtContent></w:sdt>')
    x=x[:i]+new+x[j:]
    open(f,'w',encoding='utf-8').write(x)
    # tell Word the text has been proofed, and pin the editing language to Hebrew
    sp='u/word/settings.xml'
    s=open(sp,encoding='utf-8').read()
    if 'proofState' not in s:
        s=s.replace('<w:settings', '<w:settings', 1)
        i=s.index('>', s.index('<w:settings'))+1
        s=s[:i]+'<w:proofState w:spelling="clean" w:grammar="clean"/>'+s[i:]
    if 'themeFontLang' not in s:
        i=s.index('>', s.index('<w:settings'))+1
        s=s[:i]+'<w:themeFontLang w:val="en-US" w:bidi="he-IL"/>'+s[i:]
    open(sp,'w',encoding='utf-8').write(s)
    if os.path.exists('seminar_final.docx'): os.remove('seminar_final.docx')
    with zipfile.ZipFile('seminar.docx') as zin, zipfile.ZipFile('seminar_final.docx','w',zipfile.ZIP_DEFLATED) as zout:
        for it in zin.infolist():
            if it.is_dir(): continue
            zout.writestr(it, open(os.path.join('u',it.filename),'rb').read())

def render():
    os.makedirs('fin',exist_ok=True)
    for p in ('fin/seminar_final.pdf',): 
        if os.path.exists(p): os.remove(p)
    shutil.copy('seminar_final.docx','fin/seminar_final.docx')
    env=dict(os.environ, HOME='/tmp/lo')
    subprocess.run(['soffice','--headless','--convert-to','pdf','--outdir','fin','fin/seminar_final.docx'],
                   env=env, capture_output=True, timeout=600)
    d=pymupdf.open('fin/seminar_final.pdf')
    bm=d.get_toc(); n=len(d); d.close()
    assert len(bm)==len(heads), (len(bm),len(heads))
    return [str(e[2]) for e in bm], n

pages=None
for it in range(6):
    build_with(pages); newpages,n = render()
    print('iter',it,'pages',n,'first/last',newpages[0],newpages[-1])
    if newpages==pages: print('STABLE'); break
    pages=newpages
else:
    print('did not stabilise')

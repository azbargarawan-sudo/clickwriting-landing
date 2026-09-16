import re, zipfile, shutil, os, pymupdf
from xml.sax.saxutils import escape
# headings from content, in order
txt=''.join(open(f,encoding='utf-8').read() for f in ['content1.js','content2.js','content3.js'])
heads=[(m.group(1),m.group(2)) for m in re.finditer(r"\{t:'(h[123])', x:'((?:[^'\\]|\\.)*)'",txt)]
heads=[(h, x.replace("\\'","'")) for h,x in heads]
# page numbers from LO-updated pdf TOC page
d=pymupdf.open('seminar_toc.pdf'); t=d[1].get_text()
pages=[m.group(1) for l in t.splitlines() for m in [re.match(r'^(?:.*?)\.{3,}(\d+)\s*$', l.strip())] if m]
assert len(pages)==len(heads), (len(pages),len(heads))
IND={'h1':0,'h2':360,'h3':720}
def entry(level,title,page):
    return ('<w:p><w:pPr><w:bidi/><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9026"/></w:tabs>'
            f'<w:spacing w:line="360" w:lineRule="auto" w:after="60"/><w:ind w:start="{IND[level]}"/><w:jc w:val="start"/></w:pPr>'
            '<w:r><w:rPr><w:rFonts w:ascii="David" w:hAnsi="David" w:cs="David"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:rtl/></w:rPr>'
            f'<w:t xml:space="preserve">{escape(title)}</w:t></w:r>'
            '<w:r><w:rPr><w:rFonts w:ascii="David" w:hAnsi="David" w:cs="David"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:tab/></w:r>'
            f'<w:r><w:rPr><w:rFonts w:ascii="David" w:hAnsi="David" w:cs="David"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>{page}</w:t></w:r></w:p>')
entries=''.join(entry(l,x,p) for (l,x),p in zip(heads,pages))
shutil.rmtree('u',ignore_errors=True); os.makedirs('u')
with zipfile.ZipFile('seminar.docx') as z: z.extractall('u')
p='u/word/document.xml'; x=open(p,encoding='utf-8').read()
i=x.find('<w:sdt>'); j=x.find('</w:sdt>',i)+8
old=x[i:j]
new=('<w:sdt><w:sdtPr><w:docPartObj><w:docPartGallery w:val="Table of Contents"/><w:docPartUnique/></w:docPartObj></w:sdtPr><w:sdtContent>'
     '<w:p><w:pPr><w:bidi/></w:pPr><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-3" \\h </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r></w:p>'
     + entries +
     '<w:p><w:pPr><w:bidi/></w:pPr><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:sdtContent></w:sdt>')
x=x[:i]+new+x[j:]
open(p,'w',encoding='utf-8').write(x)
# rezip preserving order (mimetype first not required for docx)
if os.path.exists('seminar_final.docx'): os.remove('seminar_final.docx')
with zipfile.ZipFile('seminar.docx') as zin, zipfile.ZipFile('seminar_final.docx','w',zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data=open(os.path.join('u',item.filename),'rb').read() if not item.is_dir() else b''
        if item.is_dir(): continue
        zout.writestr(item, data)
print('entries',len(entries and heads))

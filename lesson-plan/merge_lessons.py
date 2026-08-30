# -*- coding: utf-8 -*-
"""Merge lesson 1 + lesson 3 into one docx with a cover page (logo, submitter)."""
import re, shutil, subprocess, os

shutil.rmtree('fmt_merged', ignore_errors=True)
shutil.copytree('fmt_filled', 'fmt_merged')

# --- embed logo ---
os.makedirs('fmt_merged/word/media', exist_ok=True)
shutil.copy('logo.png', 'fmt_merged/word/media/logo.png')

rels_p = 'fmt_merged/word/_rels/document.xml.rels'
rels = open(rels_p, encoding='utf-8').read()
if 'media/logo.png' not in rels:
    rels = rels.replace('</Relationships>',
        '<Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.png"/></Relationships>')
    open(rels_p, 'w', encoding='utf-8').write(rels)

ct_p = 'fmt_merged/[Content_Types].xml'
ct = open(ct_p, encoding='utf-8').read()
if 'Extension="png"' not in ct:
    ct = ct.replace('</Types>', '<Default Extension="png" ContentType="image/png"/></Types>')
    open(ct_p, 'w', encoding='utf-8').write(ct)

def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def center_para(text, bold=False, size=None, underline=False, after=200):
    rpr = '<w:rPr><w:rFonts w:hint="cs"/>'
    if bold: rpr += '<w:b/><w:bCs/>'
    if underline: rpr += '<w:u w:val="single"/>'
    if size: rpr += f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>'
    rpr += '<w:rtl/></w:rPr>'
    return (f'<w:p><w:pPr><w:bidi/><w:jc w:val="center"/><w:spacing w:after="{after}"/>'
            f'<w:rPr><w:rtl/></w:rPr></w:pPr><w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p>')

EMU = 1333500  # ~3.5 cm
logo_para = (
    '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="400" w:after="300"/></w:pPr>'
    '<w:r><w:rPr><w:noProof/></w:rPr><w:drawing>'
    '<wp:inline distT="0" distB="0" distL="0" distR="0" '
    'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">'
    f'<wp:extent cx="{EMU}" cy="{EMU}"/><wp:docPr id="900" name="logo"/>'
    '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
    '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
    '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
    '<pic:nvPicPr><pic:cNvPr id="900" name="logo.png"/><pic:cNvPicPr/></pic:nvPicPr>'
    '<pic:blipFill><a:blip r:embed="rIdLogo" '
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>'
    '<a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
    f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{EMU}" cy="{EMU}"/></a:xfrm>'
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
    '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>'
)

cover = (
    logo_para
    + center_para('סמינר הקיבוצים, המכללה לחינוך, לטכנולוגיה ולאמנויות', bold=True, size=30, after=400)
    + center_para('מערכי שיעור במתמטיקה', bold=True, size=40, underline=True, after=200)
    + center_para('שיעור 1: המרה, "סוד ההחלפה"; שיעור 3: פריטה, "הסוד בכיוון ההפוך"', size=26, after=500)
    + center_para('המרצה: מאיה קובה שלוש', size=26, after=120)
    + center_para('שם המגישה: הנאדי סאלם', bold=True, size=26, after=120)
    + center_para('ת.ז. 302497789', size=26, after=500)
    + center_para('אלול התשפ"ו, אוגוסט 2026', size=24, after=120)
)

d1 = open('fmt_filled/word/document.xml', encoding='utf-8').read()
d2 = open('fmt_filled2/word/document.xml', encoding='utf-8').read()

def body_inner(d):
    b = d.split('<w:body>', 1)[1].rsplit('</w:body>', 1)[0]
    m = re.search(r'<w:sectPr.*?</w:sectPr>\s*$', b, re.S)
    return (b[:m.start()] if m else b), (m.group(0) if m else '')

b1, sect = body_inner(d1)
b2, _ = body_inner(d2)
pb = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
merged = (d1.split('<w:body>', 1)[0] + '<w:body>' + cover + pb + b1 + pb + b2 + sect
          + '</w:body></w:document>')
open('fmt_merged/word/document.xml', 'w', encoding='utf-8').write(merged)

if os.path.exists('lessons_merged.docx'):
    os.remove('lessons_merged.docx')
subprocess.run('cd fmt_merged && zip -qXr ../lessons_merged.docx .', shell=True, check=True)
print('merged with cover')

# Adds hideSpellingErrors/hideGrammaticalErrors to word/settings.xml (schema-ordered:
# after displayBackgroundShape, before evenAndOddHeaders).
import zipfile, shutil, sys

src = sys.argv[1] if len(sys.argv) > 1 else 'seminar.docx'
tmp = src + '.pp.tmp'
zin = zipfile.ZipFile(src)
zout = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    data = zin.read(item.filename)
    if item.filename == 'word/settings.xml':
        s = data.decode('utf-8')
        if '<w:hideSpellingErrors/>' not in s:
            anchor = '<w:displayBackgroundShape/>'
            assert anchor in s, 'anchor not found in settings.xml'
            s = s.replace(anchor, anchor + '<w:hideSpellingErrors/><w:hideGrammaticalErrors/>', 1)
        data = s.encode('utf-8')
    zout.writestr(item, data)
zout.close(); zin.close()
shutil.move(tmp, src)
print('settings.xml: proofing marks hidden')

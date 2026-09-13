import sys, zipfile, shutil, re
src = sys.argv[1]; tmp = src + '.tmp'
zin = zipfile.ZipFile(src)
zout = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    data = zin.read(item.filename)
    if item.filename == 'word/settings.xml':
        x = data.decode('utf-8')
        if 'hideSpellingErrors' not in x:
            ins = '<w:hideSpellingErrors/><w:hideGrammaticalErrors/>'
            # insert after the last element that precedes hideSpellingErrors in the schema, else right after the opening tag
            m = None
            for tag in ['zoom', 'view', 'writeProtection']:
                m = re.search(r'<w:%s\b[^>]*/>' % tag, x) or re.search(r'<w:%s\b[^>]*>.*?</w:%s>' % (tag, tag), x, re.S)
                if m: break
            if m:
                x = x[:m.end()] + ins + x[m.end():]
            else:
                m = re.search(r'<w:settings\b[^>]*>', x); x = x[:m.end()] + ins + x[m.end():]
        data = x.encode('utf-8')
    zout.writestr(item, data)
zout.close(); zin.close(); shutil.move(tmp, src)
print('patched settings.xml')

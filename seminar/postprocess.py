"""מוסיף ל-settings.xml הסתרה של סימוני שגיאות כתיב ודקדוק, כדי שלא יופיעו קווים אדומים ב-Word."""
import sys, zipfile, shutil, os
src = sys.argv[1]
tmp = src + '.tmp'
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == 'word/settings.xml':
            s = data.decode('utf8')
            marker = '<w:displayBackgroundShape/>'
            assert marker in s and 'hideSpellingErrors' not in s
            s = s.replace(marker, marker + '<w:hideSpellingErrors/><w:hideGrammaticalErrors/>', 1)
            data = s.encode('utf8')
        zout.writestr(item, data)
os.replace(tmp, src)
print('postprocessed', src)

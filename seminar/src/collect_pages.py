"""استخراج رقم صفحة كل عنوان من نسخة PDF تحمل علامات ASCII مؤقتة."""
import json
import re
import subprocess
import sys

pdf = sys.argv[1]
marks = json.load(open('marks.json'))
info = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout
n = int(re.search(r'Pages:\s+(\d+)', info).group(1))

pages = {}
for i in range(1, n + 1):
    txt = subprocess.run(['pdftotext', '-raw', '-f', str(i), '-l', str(i), pdf, '-'],
                         capture_output=True, text=True).stdout
    norm = ''.join(c for c in txt if 'A' <= c <= 'Z')
    for m in marks:
        if m['id'] in norm and m['text'] not in pages:
            pages[m['text']] = i

missing = [m['text'] for m in marks if m['text'] not in pages]
json.dump(pages, open('pages.json', 'w'), ensure_ascii=False, indent=1)
print(f'pagination: {len(pages)}/{len(marks)} headings mapped, {n} pages')
if missing:
    print('MISSING:', missing)
    sys.exit(1)

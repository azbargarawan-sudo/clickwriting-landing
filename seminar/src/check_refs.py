"""تدقيق التوثيق: مطابقة كل أزكار في النص مع قائمة المراجع في الاتجاهين."""
import json
import re
import subprocess

blocks = json.loads(subprocess.run(
    ['node', '-e', 'console.log(JSON.stringify(require("./content.js")))'],
    capture_output=True, text=True, check=True).stdout)

body_types = {'p', 'h1', 'h2', 'h3', 'cap', 'li', 'quote'}
body = '\n'.join(b['x'] for b in blocks if b['t'] in body_types)
for b in blocks:
    if b['t'] == 'tbl':
        body += '\n' + '\n'.join(c for row in b['rows'] for c in row)

refs_ar = [b['x'] for b in blocks if b['t'] == 'ref']
refs_en = [b['x'] for b in blocks if b['t'] == 'refEn']

print(f'مراجع عربية: {len(refs_ar)} | مراجع إنجليزية: {len(refs_en)}')


def ar_key(entry):
    """اسم العائلة الأول قبل الفاصلة أو قبل السنة."""
    m = re.match(r'^([^،(]+)', entry)
    return m.group(1).strip().rstrip('،').split('،')[0].strip()


def en_key(entry):
    return re.match(r'^([A-Za-zÄÖÜäöüÉé\'\-]+)', entry).group(1)

ar_keys = [ar_key(r) for r in refs_ar]
en_keys = [en_key(r) for r in refs_en]

# 1) كل مرجع مذكور في النص؟
unused = []
for r, k in list(zip(refs_ar, ar_keys)) + list(zip(refs_en, en_keys)):
    if k not in body:
        unused.append(k)
print('\nمراجع غير مذكورة في النص:', unused or 'لا يوجد')

# 2) كل أزكار في النص له مرجع؟
cites = re.findall(r'\(([^()]{0,120}?(?:19|20)\d\d[^()]{0,30}?)\)', body)
allkeys = ar_keys + en_keys
orphans = set()
for c in cites:
    if 'ل.ت.' in c:
        continue
    lead = re.split(r'[،,]| و| et al\.| & ', c.strip())[0].strip()
    if not any(lead.startswith(k) or k.startswith(lead) or k in c for k in allkeys):
        orphans.add(c.strip())
print('أزكار بلا مرجع:', sorted(orphans) or 'لا يوجد')

# 3) الترتيب الأبجدي العربي مع تجاهل "ال"
def sortable(k):
    k = re.sub(r'^ال', '', k)
    return k.replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا')

srt = sorted(ar_keys, key=sortable)
print('\nترتيب المراجع العربية:', 'صحيح' if srt == ar_keys else 'غير مرتّب')
if srt != ar_keys:
    for a, b in zip(ar_keys, srt):
        if a != b:
            print(f'  الحالي: {a}   المتوقّع: {b}')

print('ترتيب المراجع الإنجليزية:',
      'صحيح' if sorted(en_keys) == en_keys else f'غير مرتّب {en_keys}')

# 4) فحوص شكلية
print('\nشرطة طويلة (—):', body.count('—'), '| شرطة متوسطة (–):', body.count('–'))
print('ترقيم في قائمة المراجع:',
      sum(1 for r in refs_ar + refs_en if re.match(r'^\s*\d+[.)]', r)))
print('عدد الكلمات في المتن:', len(body.split()))

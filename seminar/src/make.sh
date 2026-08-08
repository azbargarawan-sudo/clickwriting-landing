#!/bin/bash
# بناء المستند: تكرار حساب أرقام الصفحات حتى تستقرّ، ثم البناء النهائي
set -e
cd "$(dirname "$0")"
OUT="${1:-الذكاء الاصطناعي ودمجه في التعليم - سيمنار.docx}"

rm -f pages.json
for i in 1 2 3 4 5; do
  cp -f pages.json pages.prev 2>/dev/null || rm -f pages.prev
  TOC_PASS=1 node build.js mark.docx >/dev/null
  rm -rf outm
  soffice --headless --norestore -env:UserInstallation=file:///tmp/lo_mk1 \
    --convert-to pdf --outdir outm mark.docx >/dev/null 2>&1
  python3 collect_pages.py outm/mark.pdf
  if [ -f pages.prev ] && cmp -s pages.prev pages.json; then
    echo "pagination stable after $i pass(es)"
    break
  fi
done

node build.js "$OUT"
cp "$OUT" check.docx
rm -rf out
soffice --headless --norestore -env:UserInstallation=file:///tmp/lo_mk2 \
  --convert-to pdf --outdir out check.docx >/dev/null 2>&1
MARKED=$(pdfinfo outm/mark.pdf | sed -n 's/^Pages:\s*//p')
FINAL=$(pdfinfo out/check.pdf | sed -n 's/^Pages:\s*//p')
echo "pages: marked=$MARKED final=$FINAL"
[ "$MARKED" = "$FINAL" ] || { echo "WARNING: page count differs between passes"; exit 1; }
pdftoppm -jpeg -r 70 out/check.pdf out/page
echo "done: $OUT ($FINAL pages)"

#!/bin/bash
# Builds both documents and applies the proofing fixes.
set -e
cd "$(dirname "$0")"
node build.js
SUBMISSION="הגשה למנחה: מבוא ופרק ראשון" node build.js "מבוא ופרק ראשון - להגשה.docx" --only=00,01
python3 fix_docx.py "סמינריון - פרשת דרייפוס והרצל.docx"
python3 fix_docx.py "מבוא ופרק ראשון - להגשה.docx"

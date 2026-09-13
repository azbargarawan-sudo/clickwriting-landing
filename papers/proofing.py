"""Post-process a .docx so Word shows no spelling/grammar underlines:
adds <w:hideSpellingErrors/> and <w:hideGrammaticalErrors/> to word/settings.xml."""
import sys, zipfile, shutil, re, os
src = sys.argv[1]
tmp = src + '.tmp'
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == 'word/settings.xml':
            x = data.decode('utf-8')
            if 'hideSpellingErrors' not in x:
                # schema order: these come after (optional) view/zoom/... and before other settings docx-js emits (updateFields, compat, ...)
                m = re.search(r'<w:settings[^>]*>', x)
                head = x[:m.end()]; rest = x[m.end():]
                # keep any leading elements that must precede hideSpellingErrors
                lead = ''
                for tag in ['w:writeProtection','w:view','w:zoom','w:removePersonalInformation','w:removeDateAndTime','w:doNotDisplayPageBoundaries','w:displayBackgroundShape','w:printPostScriptOverText','w:printFractionalCharacterWidth','w:printFormsData','w:embedTrueTypeFonts','w:embedSystemFonts','w:saveSubsetFonts','w:saveFormsData','w:mirrorMargins','w:alignBordersAndEdges','w:bordersDoNotSurroundHeader','w:bordersDoNotSurroundFooter','w:gutterAtTop']:
                    mm = re.match(r'\s*<%s\b[^>]*/>|\s*<%s\b[^>]*>.*?</%s>' % (tag, tag, tag), rest, re.S)
                    if mm:
                        lead += mm.group(0); rest = rest[mm.end():]
                x = head + lead + '<w:hideSpellingErrors/><w:hideGrammaticalErrors/>' + rest
            data = x.encode('utf-8')
        zout.writestr(item, data)
shutil.move(tmp, src)
print('proofing flags added:', os.path.basename(src))

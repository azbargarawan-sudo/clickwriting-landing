#!/usr/bin/env python3
"""Post-process a built .docx: hide spelling/grammar marks and mark every run as no-proof,
inserting the elements where the OOXML schema order expects them."""
import sys, zipfile, re, shutil, os
src = sys.argv[1]
tmp = src + '.tmp'
RPR_BEFORE = ['rStyle', 'rFonts', 'b', 'bCs', 'i', 'iCs', 'caps', 'smallCaps', 'strike', 'dstrike',
              'outline', 'shadow', 'emboss', 'imprint']
SETTINGS_AFTER = ['activeWritingStyle', 'proofState', 'formsDesign', 'attachedTemplate', 'linkStyles',
                  'stylePaneFormatFilter', 'stylePaneSortMethod', 'documentType', 'mailMerge', 'revisionView',
                  'trackRevisions', 'doNotTrackMoves', 'doNotTrackFormatting', 'documentProtection',
                  'autoFormatOverride', 'styleLockTheme', 'styleLockQFSet', 'defaultTabStop', 'autoHyphenation',
                  'consecutiveHyphenLimit', 'hyphenationZone', 'doNotHyphenateCaps', 'showEnvelope',
                  'summaryLength', 'clickAndTypeStyle', 'defaultTableStyle', 'evenAndOddHeaders',
                  'bookFoldRevPrinting', 'bookFoldPrinting', 'bookFoldPrintingSheets',
                  'drawingGridHorizontalSpacing', 'drawingGridVerticalSpacing', 'displayHorizontalDrawingGridEvery',
                  'displayVerticalDrawingGridEvery', 'doNotUseMarginsForDrawingGridOrigin',
                  'drawingGridHorizontalOrigin', 'drawingGridVerticalOrigin', 'doNotShadeFormData',
                  'noPunctuationKerning', 'characterSpacingControl', 'printTwoOnOne', 'strictFirstAndLastChars',
                  'noLineBreaksAfter', 'noLineBreaksBefore', 'savePreviewPicture', 'doNotValidateAgainstSchema',
                  'saveInvalidXml', 'ignoreMixedContent', 'alwaysShowPlaceholderText', 'doNotDemarcateInvalidXml',
                  'saveXmlDataOnly', 'useXSLTWhenSaving', 'saveThroughXslt', 'showXMLTags', 'alwaysMergeEmptyNamespace',
                  'updateFields', 'hdrShapeDefaults', 'footnotePr', 'endnotePr', 'compat', 'docVars', 'rsids',
                  'mathPr', 'attachedSchema', 'themeFontLang', 'clrSchemeMapping', 'doNotIncludeSubdocsInStats',
                  'doNotAutoCompressPictures', 'forceUpgrade', 'captions', 'readModeInkLockDown', 'smartTagType',
                  'schemaLibrary', 'shapeDefaults', 'doNotEmbedSmartTags', 'decimalSymbol', 'listSeparator']

def fix_rpr(m):
    inner = m.group(1).replace('<w:noProof/>', '')
    pos = 0
    # walk the leading elements that must precede noProof
    while True:
        e = re.match(r'<w:(\w+)\b[^>]*?(?:/>|>.*?</w:\1>)', inner[pos:], re.S)
        if e and e.group(1) in RPR_BEFORE:
            pos += e.end()
        else:
            break
    return '<w:rPr>' + inner[:pos] + '<w:noProof/>' + inner[pos:] + '</w:rPr>'

def fix_settings(s):
    if 'hideSpellingErrors' in s:
        return s
    ins = '<w:hideSpellingErrors/><w:hideGrammaticalErrors/>'
    first = None
    for name in SETTINGS_AFTER:
        m = re.search(r'<w:%s\b' % name, s)
        if m and (first is None or m.start() < first):
            first = m.start()
    if first is None:
        return s.replace('</w:settings>', ins + '</w:settings>')
    return s[:first] + ins + s[first:]

with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == 'word/settings.xml':
            data = fix_settings(data.decode('utf-8')).encode('utf-8')
        elif re.match(r'word/(document|footnotes|endnotes|footer\d*|header\d*)\.xml$', item.filename):
            s = data.decode('utf-8')
            s = re.sub(r'<w:r>(?!<w:rPr>)', '<w:r><w:rPr></w:rPr>', s)
            s = re.sub(r'<w:rPr>(.*?)</w:rPr>', fix_rpr, s, flags=re.S)
            data = s.encode('utf-8')
        zout.writestr(item, data)
shutil.move(tmp, src)
print('fixed', os.path.basename(src))

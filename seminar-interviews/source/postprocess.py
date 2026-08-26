#!/usr/bin/env python3
"""Two fixes Word needs that the generator cannot express.

document.xml: <w:bidi/> in the section properties, so Word treats the whole
section as right-to-left.

settings.xml: <w:hideSpellingErrors/> and <w:hideGrammaticalErrors/>, so no
red or blue proofing underline is drawn. The runs carry w:lang with a Hebrew
complex-script language, but a reader whose Word has no Hebrew proofing tools
installed would still see every word underlined; these two settings stop that
whatever dictionaries are present. Both elements belong between
displayBackgroundShape and evenAndOddHeaders in the CT_Settings sequence.
"""
import shutil
import sys
import zipfile

PROOF = ('<w:hideSpellingErrors/><w:hideGrammaticalErrors/>'
         '<w:proofState w:spelling="clean" w:grammar="clean"/>')


def fix_document(xml):
    if '<w:sectPr>' in xml and '<w:bidi/></w:sectPr>' not in xml:
        xml = xml.replace('<w:docGrid', '<w:bidi/><w:docGrid')
    return xml


def fix_settings(xml):
    if 'hideSpellingErrors' in xml:
        return xml
    anchor = '<w:displayBackgroundShape/>'
    if anchor in xml:
        return xml.replace(anchor, anchor + PROOF, 1)
    raise SystemExit('settings.xml: no anchor to insert the proofing settings after')


def main(path):
    tmp = path + '.tmp'
    with zipfile.ZipFile(path) as zin:
        items = [(i, zin.read(i.filename)) for i in zin.infolist()]

    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for info, data in items:
            if info.filename == 'word/document.xml':
                data = fix_document(data.decode('utf-8')).encode('utf-8')
            elif info.filename == 'word/settings.xml':
                data = fix_settings(data.decode('utf-8')).encode('utf-8')
            zout.writestr(info, data)
    shutil.move(tmp, path)
    print('postprocessed', path)


if __name__ == '__main__':
    main(sys.argv[1])

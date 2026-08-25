#!/usr/bin/env python3
"""Inject <w:bidi/> into the section properties so Word treats the whole section
as right-to-left, then rewrite the archive in place."""
import re
import shutil
import sys
import zipfile


def main(path):
    tmp = path + '.tmp'
    with zipfile.ZipFile(path) as zin:
        items = [(i, zin.read(i.filename)) for i in zin.infolist()]

    def fix(data):
        xml = data.decode('utf-8')
        if '<w:sectPr>' in xml and '<w:bidi/></w:sectPr>' not in xml:
            xml = xml.replace('<w:docGrid', '<w:bidi/><w:docGrid')
        return xml.encode('utf-8')

    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for info, data in items:
            if info.filename == 'word/document.xml':
                data = fix(data)
            zout.writestr(info, data)
    shutil.move(tmp, path)
    print('postprocessed', path)


if __name__ == '__main__':
    main(sys.argv[1])

#!/usr/bin/env python3
"""Repack an OOXML file the way Office writes it: [Content_Types].xml first,
no directory entries. Some readers, mobile Office in particular, are strict
about this even though desktop PowerPoint is not."""
import sys, zipfile, shutil, os

src = sys.argv[1]
zin = zipfile.ZipFile(src)
items = [(i, zin.read(i.filename)) for i in zin.infolist() if not i.filename.endswith('/')]
items.sort(key=lambda t: (t[0].filename != '[Content_Types].xml', t[0].filename))
tmp = src + '.tmp'
with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as z:
    for info, data in items:
        z.writestr(info.filename, data)
zin.close()
shutil.move(tmp, src)
print('repacked', src, '->', len(items), 'parts,', 0, 'directory entries')

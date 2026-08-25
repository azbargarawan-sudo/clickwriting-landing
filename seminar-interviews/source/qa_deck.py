import zipfile, re, math, sys
from defusedxml import minidom

EMU_IN = 914400.0
SLIDE_W, SLIDE_H = 13.333, 7.5
path = sys.argv[1]
z = zipfile.ZipFile(path)
names = sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)],
               key=lambda n: int(re.search(r'(\d+)', n.split('/')[-1]).group()))

def txt(node):
    return ''.join(t.firstChild.nodeValue for t in node.getElementsByTagName('a:t') if t.firstChild)

problems = []
for idx, n in enumerate(names, 1):
    doc = minidom.parseString(z.read(n))
    shapes = doc.getElementsByTagName('p:sp') + doc.getElementsByTagName('p:pic')
    for sp in shapes:
        xfrm = sp.getElementsByTagName('a:xfrm')
        if not xfrm: continue
        off = xfrm[0].getElementsByTagName('a:off')[0]
        ext = xfrm[0].getElementsByTagName('a:ext')[0]
        x = int(off.getAttribute('x'))/EMU_IN; y = int(off.getAttribute('y'))/EMU_IN
        w = int(ext.getAttribute('cx'))/EMU_IN; h = int(ext.getAttribute('cy'))/EMU_IN
        t = txt(sp).strip()
        label = (t[:34] or '<shape>')
        if x < -0.01 or y < -0.01 or x+w > SLIDE_W+0.01 or y+h > SLIDE_H+0.01:
            problems.append(f'slide {idx}: OUT OF BOUNDS  x={x:.2f} y={y:.2f} w={w:.2f} h={h:.2f}  "{label}"')
        if not t: continue
        # font size + line spacing
        szs = [int(r.getAttribute('sz')) for r in sp.getElementsByTagName('a:rPr') if r.getAttribute('sz')]
        if not szs:
            szs = [int(r.getAttribute('sz')) for r in sp.getElementsByTagName('a:defRPr') if r.getAttribute('sz')]
        if not szs: continue
        fs = max(szs)/100.0
        lsm = 1.0
        for ls in sp.getElementsByTagName('a:spcPct'):
            lsm = max(lsm, int(ls.getAttribute('val'))/100000.0)
        # subtract text-box insets
        ins = 0.0
        for bp in sp.getElementsByTagName('a:bodyPr'):
            l = bp.getAttribute('lIns'); r = bp.getAttribute('rIns')
            ins = ((int(l) if l else 91440) + (int(r) if r else 91440))/EMU_IN
        usable_pt = max((w - ins), 0.05) * 72
        cpl = max(usable_pt / (0.50*fs), 1)
        lines = 0
        for seg in t.split('\n'):
            lines += max(1, math.ceil(len(seg)/cpl))
        needed = lines * fs * 1.2 * lsm
        avail = h * 72
        if needed > avail * 1.06:
            problems.append(f'slide {idx}: OVERFLOW  need {needed:.0f}pt in {avail:.0f}pt  fs={fs} w={w:.2f} lines={lines}  "{label}"')

print(f'slides: {len(names)}')
if problems:
    print(f'ISSUES: {len(problems)}')
    for p in problems: print('  •', p)
else:
    print('no bounds or overflow issues detected')

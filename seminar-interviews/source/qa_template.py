import zipfile, re, math, sys
from defusedxml import minidom
EMU=914400.0
SW,SH=13.333,7.5
# geometry inherited from the master / layout1 when a slide shape has no xfrm
INHERIT={'title':(0.92,0.40,11.50,1.45), '':(0.92,2.00,11.50,4.76),
         'ctrTitle':(1.67,1.23,10.00,2.61), 'subTitle':(1.67,3.94,10.00,1.81)}
LOGO=(0.30,0.22,1.35,1.35)   # square Peres mark, top-left

z=zipfile.ZipFile(sys.argv[1])
names=sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$',n)],
             key=lambda n:int(re.search(r'(\d+)',n.split('/')[-1]).group()))
issues=[]
for idx,n in enumerate(names,1):
    doc=minidom.parseString(z.read(n))
    boxes=[]
    for sp in doc.getElementsByTagName('p:sp')+doc.getElementsByTagName('p:pic')+doc.getElementsByTagName('p:graphicFrame'):
        ph=sp.getElementsByTagName('p:ph')
        typ=ph[0].getAttribute('type') if ph else None
        xf=sp.getElementsByTagName('a:xfrm') or sp.getElementsByTagName('p:xfrm')
        if xf:
            o=xf[0].getElementsByTagName('a:off')[0]; e=xf[0].getElementsByTagName('a:ext')[0]
            g=(int(o.getAttribute('x'))/EMU,int(o.getAttribute('y'))/EMU,
               int(e.getAttribute('cx'))/EMU,int(e.getAttribute('cy'))/EMU)
        elif typ is not None and typ in INHERIT:
            g=INHERIT[typ]
        else:
            continue
        t=''.join(x.firstChild.nodeValue for x in sp.getElementsByTagName('a:t') if x.firstChild).strip()
        boxes.append((g,t,sp.tagName))
        x,y,w,h=g
        if x<-0.01 or y<-0.01 or x+w>SW+0.01 or y+h>SH+0.01:
            issues.append(f'slide {idx}: OUT OF BOUNDS x={x:.2f} y={y:.2f} w={w:.2f} h={h:.2f} "{t[:26]}"')
        # overflow estimate for text shapes
        if t and sp.tagName=='p:sp':
            need=0.0; fs=0
            for pp in sp.getElementsByTagName('a:p'):
                pszs=[int(r.getAttribute('sz')) for r in pp.getElementsByTagName('a:rPr') if r.getAttribute('sz')]
                if not pszs: continue
                pfs=max(pszs)/100.0; fs=max(fs,pfs)
                ptxt=''.join(x.firstChild.nodeValue for x in pp.getElementsByTagName('a:t') if x.firstChild)
                cpl=max((w-0.2)*72/(0.5*pfs),1)
                need+=max(1,math.ceil(len(ptxt)/cpl))*pfs*1.2
                sb=[int(b.getAttribute('val')) for b in pp.getElementsByTagName('a:spcPts')]
                need+=(sb[0]/100.0 if sb else 0)
            if fs:
                if need > h*72*1.02:
                    issues.append(f'slide {idx}: OVERFLOW need {need:.0f}pt in {h*72:.0f}pt fs={fs} "{t[:26]}"')
        # collision with the fixed logo (only for text that actually renders there)
        if t and sp.tagName=='p:sp' and typ in ('title',):
            szs=[int(r.getAttribute('sz')) for r in sp.getElementsByTagName('a:rPr') if r.getAttribute('sz')]
            fs=max(szs)/100.0 if szs else 44.0
            textw=len(t)*0.5*fs/72
            left=x+w-textw
            logo_right = LOGO[0]+LOGO[2]
            if left < logo_right and y < LOGO[1]+LOGO[3]:
                issues.append(f'slide {idx}: TITLE REACHES LOGO left={left:.2f} logo ends {logo_right:.2f} "{t[:30]}"')
    for i in range(len(boxes)):
        for j in range(i+1,len(boxes)):
            (ax,ay,aw,ah),at,_=boxes[i]; (bx,by,bw,bh),bt,_=boxes[j]
            if not at and not bt: continue
            def is_logo(g): return all(abs(a-b)<0.05 for a,b in zip(g,LOGO))
            if (not at and is_logo(boxes[i][0])) or (not bt and is_logo(boxes[j][0])): continue
            ox=min(ax+aw,bx+bw)-max(ax,bx); oy=min(ay+ah,by+bh)-max(ay,by)
            if ox>0.08 and oy>0.08 and ox*oy>0.10:
                issues.append(f'slide {idx}: OVERLAP {ox*oy:.2f}sq" "{at[:20]}" x "{bt[:20]}"')
print('slides:',len(names))
print('ISSUES:',len(issues) if issues else 'none')
for i in issues: print('  •',i)

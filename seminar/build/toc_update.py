import uno, time, subprocess, sys, os
from com.sun.star.beans import PropertyValue
S=os.getcwd()
proc=subprocess.Popen(['soffice','--headless','--invisible','--norestore','--accept=socket,host=127.0.0.1,port=2002;urp;'],env={**os.environ,'HOME':'/tmp/lo'})
ctx=None
for i in range(40):
    try:
        local=uno.getComponentContext()
        resolver=local.ServiceManager.createInstanceWithContext('com.sun.star.bridge.UnoUrlResolver',local)
        ctx=resolver.resolve('uno:socket,host=127.0.0.1,port=2002;urp;StarOffice.ComponentContext'); break
    except Exception: time.sleep(1)
smgr=ctx.ServiceManager
desktop=smgr.createInstanceWithContext('com.sun.star.frame.Desktop',ctx)
def pv(n,v):
    p=PropertyValue(); p.Name=n; p.Value=v; return p
doc=desktop.loadComponentFromURL(uno.systemPathToFileUrl(S+'/seminar.docx'),'_blank',0,(pv('Hidden',True),))
idx=doc.getDocumentIndexes()
for i in range(idx.getCount()): idx.getByIndex(i).update()
doc.refresh()
for i in range(idx.getCount()): idx.getByIndex(i).update()
doc.storeToURL(uno.systemPathToFileUrl(S+'/seminar_toc.pdf'),(pv('FilterName','writer_pdf_Export'),))
doc.storeToURL(uno.systemPathToFileUrl(S+'/seminar_lo.docx'),(pv('FilterName','MS Word 2007 XML'),))
doc.close(True)
try: desktop.terminate()
except Exception: pass
proc.wait(timeout=30)
print('done')

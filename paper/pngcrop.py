import zlib, struct, sys

def read_png(path):
    d = open(path,'rb').read()
    assert d[:8] == b'\x89PNG\r\n\x1a\n'
    i, idat, hdr, pal = 8, b'', None, {}
    while i < len(d):
        ln = struct.unpack('>I', d[i:i+4])[0]; typ = d[i+4:i+8]; data = d[i+8:i+8+ln]
        if typ == b'IHDR': hdr = struct.unpack('>IIBBBBB', data)
        elif typ == b'IDAT': idat += data
        i += 12 + ln
    return hdr, idat

def crop(src, dst, top, bottom, left=0, right=None):
    (w,h,bd,ct,comp,filt,inter) = read_png(src)[0]
    assert bd == 8 and inter == 0, (bd, ct, inter)
    nch = {0:1, 2:3, 3:1, 4:2, 6:4}[ct]
    raw = zlib.decompress(read_png(src)[1])
    stride = w*nch
    # unfilter
    out = bytearray(); prev = bytearray(stride)
    p = 0
    for y in range(h):
        f = raw[p]; p += 1
        line = bytearray(raw[p:p+stride]); p += stride
        if f == 1:
            for x in range(nch, stride): line[x] = (line[x] + line[x-nch]) & 255
        elif f == 2:
            for x in range(stride): line[x] = (line[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride):
                a = line[x-nch] if x >= nch else 0
                line[x] = (line[x] + ((a + prev[x]) >> 1)) & 255
        elif f == 4:
            for x in range(stride):
                a = line[x-nch] if x >= nch else 0
                b = prev[x]; c = prev[x-nch] if x >= nch else 0
                pa, pb, pc = abs(b-c), abs(a-c), abs(a+b-2*c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        out += line; prev = line
    right = w if right is None else right
    nw, nh = right-left, bottom-top
    body = bytearray()
    for y in range(top, bottom):
        body += b'\x00' + out[y*stride + left*nch : y*stride + right*nch]
    comp_data = zlib.compress(bytes(body), 9)
    def chunk(t, d):
        c = t + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', nw, nh, 8, ct, 0, 0, 0))
    png += chunk(b'IDAT', comp_data) + chunk(b'IEND', b'')
    open(dst,'wb').write(png)
    print(dst, nw, 'x', nh)

if __name__ == '__main__':
    a = sys.argv
    crop(a[1], a[2], int(a[3]), int(a[4]), int(a[5]) if len(a)>5 else 0, int(a[6]) if len(a)>6 else None)

def downsample2(src, dst):
    import zlib, struct
    (w,h,bd,ct,_,_,_) = read_png(src)[0]
    nch = {0:1,2:3,3:1,4:2,6:4}[ct]
    raw = zlib.decompress(read_png(src)[1]); stride = w*nch
    out = bytearray(); prev = bytearray(stride); p = 0
    for y in range(h):
        f = raw[p]; p += 1
        line = bytearray(raw[p:p+stride]); p += stride
        if f == 1:
            for x in range(nch, stride): line[x] = (line[x] + line[x-nch]) & 255
        elif f == 2:
            for x in range(stride): line[x] = (line[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride):
                a = line[x-nch] if x >= nch else 0
                line[x] = (line[x] + ((a + prev[x]) >> 1)) & 255
        elif f == 4:
            for x in range(stride):
                a = line[x-nch] if x >= nch else 0
                b = prev[x]; c = prev[x-nch] if x >= nch else 0
                pa, pb, pc = abs(b-c), abs(a-c), abs(a+b-2*c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        out += line; prev = line
    nw, nh = w//2, h//2
    body = bytearray()
    for y in range(nh):
        r0 = (2*y)*stride; r1 = (2*y+1)*stride
        row = bytearray(b'\x00')
        for x in range(nw):
            o0 = r0 + 2*x*nch; o1 = r1 + 2*x*nch
            for c in range(nch):
                row.append((out[o0+c] + out[o0+nch+c] + out[o1+c] + out[o1+nch+c]) >> 2)
        body += row
    def chunk(t, d):
        cc = t + d
        return struct.pack('>I', len(d)) + cc + struct.pack('>I', zlib.crc32(cc) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', nw, nh, 8, ct, 0,0,0))
    png += chunk(b'IDAT', zlib.compress(bytes(body), 9)) + chunk(b'IEND', b'')
    open(dst,'wb').write(png)
    print(dst, nw, 'x', nh)

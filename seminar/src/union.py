# -*- coding: utf-8 -*-
"""Collect every quoted child utterance from EVERY historical version of the
seminar chapters in git, and report which ones the current transcript does not
contain verbatim. The seminar itself is never modified."""
import re, subprocess, sys, os

REPO = '/home/user/clickwriting-landing'
FILES = ['content_findings.js', 'content_discussion.js', 'content_summary.js',
         'content_intro.js', 'content_method.js', 'content_lit.js']
HERE = os.path.dirname(os.path.abspath(__file__))


def git(*args):
    return subprocess.run(['git'] + list(args), cwd=REPO,
                          capture_output=True, text=True).stdout


def item_texts(src):
    out = []
    for m in re.finditer(r"\{ t: '(\w+)', text: '((?:[^'\\]|\\.)*)' \}", src):
        out.append(m.group(2).replace("\\'", "'"))
    return out


def quotes(src):
    """every double-quoted span inside item texts"""
    res = set()
    for t in item_texts(src):
        for q in re.findall(r'"([^"]{6,})"', t):
            res.add(q.strip())
    return res


def norm(t):
    t = re.sub(r'\*\*', '', t)
    t = re.sub(r'[.,;:!?…"\'׳״()\[\]]', ' ', t)
    t = t.replace('ּ', '').replace('ָ', '')  # strip niqqud that may appear
    t = ''.join(ch for ch in t if not (0x0591 <= ord(ch) <= 0x05c7))
    return re.sub(r'\s+', ' ', t).strip()


tr_items = item_texts(open(os.path.join(HERE, 'content_transcript.js'),
                           encoding='utf-8').read())
tr = []
for t in tr_items:
    m = re.match(r'\*\*([^*:]+):\*\*\s*(.*)', t)
    if m:
        tr.append((m.group(1).strip(), norm(m.group(2))))


def where(q):
    qn = norm(q)
    if not qn:
        return ('EMPTY', [])
    hits = sorted({sp for sp, sq in tr if qn in sq})
    if hits:
        return ('EXACT', hits)
    w = qn.split()
    for n in (7, 5, 4):
        if len(w) < n:
            continue
        probe = ' '.join(w[:n])
        hits = sorted({sp for sp, sq in tr if probe in sq})
        if hits:
            return ('PARTIAL%d' % n, hits)
    return ('MISSING', [])


commits = git('rev-list', 'HEAD').split()
hist = {}   # quote -> set of commits it appeared in
for c in commits:
    for f in FILES:
        src = git('show', '%s:seminar/src/%s' % (c, f))
        if not src:
            continue
        for q in quotes(src):
            hist.setdefault(q, set()).add(c[:7])

current = set()
for f in FILES:
    p = os.path.join(HERE, f)
    if os.path.exists(p):
        current |= quotes(open(p, encoding='utf-8').read())

print('commits scanned: %d | distinct quoted spans across history: %d'
      % (len(commits), len(hist)))

problems = []
for q in sorted(hist):
    st, who = where(q)
    if st != 'EXACT':
        problems.append((q, st, who, sorted(hist[q]), q in current))

print('spans not found verbatim in the transcript: %d\n' % len(problems))
for q, st, who, cs, cur in problems:
    tag = 'CURRENT' if cur else 'old-only'
    print('[%s][%s] %s\n    %s\n    seen in: %s\n' % (st, tag, who or '-', q, ' '.join(cs)))

#!/usr/bin/env python3
"""Israeli Lotto (Mifal HaPais, 6/37 + strong 1-7) history analysis and ticket generator.

Standard library only. See ../SKILL.md for usage.
Every draw is independent and uniformly random; nothing here predicts the next draw.
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import io
import itertools
import json
import math
import random
import sys
import urllib.request
from collections import Counter

MAX_N = 37
PICK = 6
STRONG_MAX = 7
JACKPOT_ODDS = math.comb(MAX_N, PICK) * STRONG_MAX  # 16,273,488
DOWNLOAD_URL = "https://www.pais.co.il/Lotto/lotto_resultsDownload.aspx"
# Community mirror of the official archive (same columns, JSON). Used when pais.co.il is unreachable.
MIRROR_URL = "https://raw.githubusercontent.com/PZABOY/pais-lotto-checker/main/data/lotto.json"
import os
BUNDLED = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "data", "lotto_history.csv")


# ----------------------------------------------------------------------------- data

def download(path: str) -> str:
    req = urllib.request.Request(DOWNLOAD_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    with open(path, "wb") as f:
        f.write(data)
    return path


def download_mirror(path: str) -> str:
    """Fetch the GitHub mirror JSON and write it as a CSV in the official column layout."""
    req = urllib.request.Request(MIRROR_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.loads(r.read().decode("utf-8"))
    items = data["results"] if isinstance(data, dict) else data
    rows = []
    for it in items:
        try:
            rows.append([int(it["הגרלה"]), it["תאריך"]] + [int(it[str(i)]) for i in range(1, 7)] + [int(it["המספר החזק/נוסף"])])
        except (KeyError, ValueError):
            continue
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["הגרלה", "תאריך", "1", "2", "3", "4", "5", "6", "המספר החזק/נוסף"])
        w.writerows(rows)
    return path


def decode(raw: bytes) -> str:
    for enc in ("utf-8-sig", "utf-8", "cp1255", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("latin-1", errors="replace")


def parse_date(s: str) -> dt.date | None:
    s = s.strip()
    for fmt in ("%d/%m/%Y", "%d.%m.%Y", "%Y-%m-%d", "%d/%m/%y"):
        try:
            return dt.datetime.strptime(s, fmt).date()
        except ValueError:
            pass
    return None


def load_draws(path: str) -> list[dict]:
    with open(path, "rb") as f:
        text = decode(f.read())
    rows = list(csv.reader(io.StringIO(text)))
    draws = []
    for row in rows:
        if len(row) < 9:
            continue
        try:
            draw_id = int(row[0].strip())
            nums = sorted(int(x) for x in row[2:8])
            strong = int(row[8].strip())
        except ValueError:
            continue  # header or malformed line
        date = parse_date(row[1])
        if date is None:
            continue
        draws.append({"id": draw_id, "date": date, "nums": nums, "strong": strong})
    if not draws:
        raise SystemExit("No draws parsed. Expected columns: draw_id, date, n1..n6, strong")
    draws.sort(key=lambda d: (d["date"], d["id"]))
    return draws


def current_era(draws: list[dict]) -> list[dict]:
    """Keep only draws after the last one that used a range larger than 1-37 or strong > 7."""
    cutoff = -1
    for i, d in enumerate(draws):
        if max(d["nums"]) > MAX_N or d["strong"] > STRONG_MAX or min(d["nums"]) < 1 or d["strong"] < 1:
            cutoff = i
    kept = draws[cutoff + 1:]
    kept = [d for d in kept if len(set(d["nums"])) == PICK]
    return kept


# ----------------------------------------------------------------------------- stats

def analyze(draws: list[dict], recent: int) -> dict:
    n = len(draws)
    freq = Counter(x for d in draws for x in d["nums"])
    strong_freq = Counter(d["strong"] for d in draws)
    expected = n * PICK / MAX_N
    exp_strong = n / STRONG_MAX

    last_seen = {}
    for i, d in enumerate(draws):
        for x in d["nums"]:
            last_seen[x] = i
    gaps = {x: n - 1 - last_seen.get(x, -1) for x in range(1, MAX_N + 1)}

    recent_draws = draws[-recent:]
    recent_freq = Counter(x for d in recent_draws for x in d["nums"])
    for x in range(1, MAX_N + 1):
        recent_freq.setdefault(x, 0)
        freq.setdefault(x, 0)
    for s in range(1, STRONG_MAX + 1):
        strong_freq.setdefault(s, 0)

    sums = sorted(sum(d["nums"]) for d in draws)
    odd_counts = Counter(sum(1 for x in d["nums"] if x % 2) for d in draws)
    low_counts = Counter(sum(1 for x in d["nums"] if x <= 18) for d in draws)
    consec = sum(1 for d in draws if any(b - a == 1 for a, b in zip(d["nums"], d["nums"][1:])))
    pairs = Counter(p for d in draws for p in itertools.combinations(d["nums"], 2))

    chi = sum((freq[x] - expected) ** 2 / expected for x in range(1, MAX_N + 1))
    chi_strong = sum((strong_freq[s] - exp_strong) ** 2 / exp_strong for s in range(1, STRONG_MAX + 1))

    def pct(p):
        k = max(0, min(len(sums) - 1, int(round(p * (len(sums) - 1)))))
        return sums[k]

    return {
        "count": n,
        "first": draws[0], "last": draws[-1],
        "freq": freq, "expected": expected,
        "strong_freq": strong_freq, "expected_strong": exp_strong,
        "gaps": gaps,
        "recent": recent, "recent_freq": recent_freq,
        "sum_min": sums[0], "sum_max": sums[-1], "sum_p20": pct(0.2), "sum_p50": pct(0.5), "sum_p80": pct(0.8),
        "odd_counts": odd_counts, "low_counts": low_counts,
        "consec_rate": consec / n,
        "top_pairs": pairs.most_common(10),
        "chi": chi, "chi_df": MAX_N - 1,          # critical value at 5%: ~51.0
        "chi_strong": chi_strong, "chi_strong_df": STRONG_MAX - 1,  # critical at 5%: ~12.6
        "drawn_sets": {tuple(d["nums"]) for d in draws},
    }


# ----------------------------------------------------------------------------- tickets

SLIP_COLS = 7  # play-slip layout 1-7 / 8-14 / ... used for column/diagonal check


def slip_pos(x: int) -> tuple[int, int]:
    return (x - 1) // SLIP_COLS, (x - 1) % SLIP_COLS


def is_arithmetic(nums: list[int]) -> bool:
    d = nums[1] - nums[0]
    return all(b - a == d for a, b in zip(nums, nums[1:]))


def unpopular_ok(nums: list[int], st: dict) -> tuple[bool, str]:
    if sum(1 for x in nums if x <= 31) > 3:
        return False, "too many birthday numbers"
    if is_arithmetic(nums):
        return False, "arithmetic sequence"
    if sum(1 for a, b in zip(nums, nums[1:]) if b - a == 1) > 1:
        return False, "consecutive run"
    odd = sum(1 for x in nums if x % 2)
    if not 2 <= odd <= 4:
        return False, "odd/even imbalance"
    s = sum(nums)
    if not st["sum_p20"] <= s <= st["sum_p80"]:
        return False, "sum outside historical middle range"
    rows = {slip_pos(x)[0] for x in nums}
    cols = {slip_pos(x)[1] for x in nums}
    if len(cols) == 1 or len(rows) == 1:
        return False, "single slip column/row"
    diag = {slip_pos(x)[0] - slip_pos(x)[1] for x in nums}
    anti = {slip_pos(x)[0] + slip_pos(x)[1] for x in nums}
    if len(diag) == 1 or len(anti) == 1:
        return False, "slip diagonal"
    if tuple(nums) in st["drawn_sets"]:
        return False, "already drawn in history"
    return True, "passes all unpopularity filters"


def generate(st: dict, k: int, strategy: str, rng: random.Random) -> list[dict]:
    pool = list(range(1, MAX_N + 1))
    if strategy == "hot":
        ranked = sorted(pool, key=lambda x: -st["recent_freq"][x])[:15]
    elif strategy == "cold":
        ranked = sorted(pool, key=lambda x: st["recent_freq"][x])[:15]
    else:
        ranked = pool
    tickets, seen, attempts = [], set(), 0
    while len(tickets) < k and attempts < 200000:
        attempts += 1
        nums = sorted(rng.sample(ranked, PICK))
        if tuple(nums) in seen:
            continue
        if strategy == "unpopular":
            ok, why = unpopular_ok(nums, st)
            if not ok:
                continue
        elif strategy == "random":
            why = "uniform random"
        else:
            why = f"drawn from the 15 {'most' if strategy == 'hot' else 'least'} frequent numbers of the last {st['recent']} draws"
        seen.add(tuple(nums))
        strong_pool = [s for s in range(1, STRONG_MAX + 1) if s not in (3, 7)] if strategy == "unpopular" else list(range(1, STRONG_MAX + 1))
        tickets.append({"nums": nums, "strong": rng.choice(strong_pool), "why": why})
    return tickets


def next_draw_date(today: dt.date) -> dt.date:
    # Draws on Tuesday (1) and Saturday (5)
    for i in range(1, 8):
        d = today + dt.timedelta(days=i)
        if d.weekday() in (1, 5):
            return d
    return today


# ----------------------------------------------------------------------------- report

HE = {
    "title": "# ניתוח לוטו ישראל (מפעל הפיס) – 6 מתוך 37 + מספר חזק",
    "honest": (
        "**האמת קודם:** כל הגרלה אקראית ובלתי תלויה בקודמותיה. הסיכוי לזכות בפרס הראשון הוא "
        f"1 ל-{JACKPOT_ODDS:,} לכל טופס, תמיד, ולא משנה אילו מספרים בוחרים. "
        "הניתוח למטה מתאר מה קרה בעבר. היתרון היחיד שאפשר להשיג הוא לבחור צירופים שפחות אנשים משחקים, "
        "כדי שאם זוכים, מתחלקים בפרס עם פחות אנשים. זה מה שהטפסים המוצעים מנסים לעשות."
    ),
    "data": "## הנתונים", "freq": "## שכיחות כל מספר (כל ההגרלות בעידן 1–37)",
    "hotcold": "## חם / קר", "gaps": "## מספרים שלא יצאו הכי הרבה זמן",
    "strong": "## המספר החזק", "dist": "## מאפייני צירופים זוכים", "pairs": "## הזוגות הנפוצים ביותר",
    "chi": "## מבחן אחידות (חי בריבוע)", "tickets": "## טפסים מוצעים להגרלה הבאה", "next": "## ההגרלה הבאה",
    "resp": "משחק אחראי: לוטו מגיל 18 בלבד. אם המשחק הפך לבעיה, המרכז לטיפול בהימורים *5540 (חינם).",
}
EN = {
    "title": "# Israel Lotto (Mifal HaPais) analysis – 6 of 37 + strong number",
    "honest": (
        "**Honesty first:** every draw is random and independent. The jackpot odds are "
        f"1 in {JACKPOT_ODDS:,} per ticket, always, whatever numbers you pick. "
        "The analysis below describes the past. The only real edge is choosing combinations fewer people play, "
        "so a winning ticket shares the prize with fewer people. That is what the suggested tickets optimize."
    ),
    "data": "## Data", "freq": "## Frequency of each number (all draws in the 1–37 era)",
    "hotcold": "## Hot / cold", "gaps": "## Longest current gaps",
    "strong": "## Strong number", "dist": "## Winning-set characteristics", "pairs": "## Most frequent pairs",
    "chi": "## Uniformity test (chi-square)", "tickets": "## Suggested tickets for the next draw", "next": "## Next draw",
    "resp": "Responsible play: 18+ only. If gambling has become a problem, call *5540 (free) in Israel.",
}


def fmt_ticket(t: dict) -> str:
    return " ".join(f"{x:2d}" for x in t["nums"]) + f"  |  {t['strong']}"


def build_report(st: dict, tickets: list[dict], strategy: str, lang: str, today: dt.date, source: str = "") -> str:
    L = HE if lang == "he" else EN
    out = [L["title"], "", L["honest"], ""]
    out += [L["data"], "", f"- source: {source}",
            f"- {st['count']} draws, {st['first']['date']:%d/%m/%Y} (#{st['first']['id']}) → {st['last']['date']:%d/%m/%Y} (#{st['last']['id']})",
            f"- expected appearances per number: {st['expected']:.1f}", ""]

    out += [L["freq"], "", "| # | count | vs expected | last-{} | gap |".format(st["recent"]), "|---|---|---|---|---|"]
    for x in range(1, MAX_N + 1):
        dev = st["freq"][x] - st["expected"]
        out.append(f"| {x} | {st['freq'][x]} | {dev:+.1f} | {st['recent_freq'][x]} | {st['gaps'][x]} |")
    out.append("")

    hot = sorted(range(1, MAX_N + 1), key=lambda x: -st["recent_freq"][x])[:8]
    cold = sorted(range(1, MAX_N + 1), key=lambda x: st["recent_freq"][x])[:8]
    out += [L["hotcold"], "", f"- last {st['recent']} draws, most frequent: {', '.join(map(str, hot))}",
            f"- last {st['recent']} draws, least frequent: {', '.join(map(str, cold))}", ""]
    longest = sorted(range(1, MAX_N + 1), key=lambda x: -st["gaps"][x])[:8]
    out += [L["gaps"], "", ", ".join(f"{x} ({st['gaps'][x]})" for x in longest), ""]

    out += [L["strong"], "", "| strong | count | vs expected |", "|---|---|---|"]
    for s in range(1, STRONG_MAX + 1):
        out.append(f"| {s} | {st['strong_freq'][s]} | {st['strong_freq'][s] - st['expected_strong']:+.1f} |")
    out.append("")

    n = st["count"]
    out += [L["dist"], "",
            f"- sum of 6 numbers: min {st['sum_min']}, p20 {st['sum_p20']}, median {st['sum_p50']}, p80 {st['sum_p80']}, max {st['sum_max']}",
            "- odd numbers per draw: " + ", ".join(f"{k}: {v / n:.0%}" for k, v in sorted(st["odd_counts"].items())),
            "- low (1–18) numbers per draw: " + ", ".join(f"{k}: {v / n:.0%}" for k, v in sorted(st["low_counts"].items())),
            f"- draws with at least one consecutive pair: {st['consec_rate']:.0%}", ""]

    out += [L["pairs"], "", ", ".join(f"{a}-{b} ({c})" for (a, b), c in st["top_pairs"]), ""]

    verdict_ok = st["chi"] < 51.0
    out += [L["chi"], "",
            f"- numbers: χ² = {st['chi']:.1f} with {st['chi_df']} df (5% critical ≈ 51.0) → "
            + ("consistent with a fair, uniform draw" if verdict_ok else "deviates from uniform at 5% (check data quality before reading anything into it)"),
            f"- strong: χ² = {st['chi_strong']:.1f} with {st['chi_strong_df']} df (5% critical ≈ 12.6) → "
            + ("consistent with uniform" if st["chi_strong"] < 12.6 else "deviates from uniform at 5%"), ""]

    out += [L["tickets"], "", f"strategy: `{strategy}`", ""]
    for i, t in enumerate(tickets, 1):
        out.append(f"{i}. `{fmt_ticket(t)}`  — {t['why']}")
    out.append("")

    nd = next_draw_date(today)
    day = {1: "Tuesday / יום שלישי", 5: "Saturday / מוצאי שבת"}[nd.weekday()]
    out += [L["next"], "", f"- {nd:%d/%m/%Y} ({day})", "", L["resp"], ""]
    return "\n".join(out)


# ----------------------------------------------------------------------------- main

def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--download", action="store_true")
    src.add_argument("--file")
    src.add_argument("--mirror", action="store_true", help="fetch the GitHub mirror of the archive")
    src.add_argument("--bundled", action="store_true", help="use the CSV bundled with the plugin (may be stale)")
    ap.add_argument("--recent", type=int, default=50)
    ap.add_argument("--tickets", type=int, default=5)
    ap.add_argument("--strategy", choices=["unpopular", "hot", "cold", "random"], default="unpopular")
    ap.add_argument("--seed", type=int)
    ap.add_argument("--lang", choices=["he", "en"], default="he")
    ap.add_argument("--out", default="lotto_report.md")
    ap.add_argument("--json", default="lotto_summary.json")
    a = ap.parse_args(argv)

    path = a.file
    source = "user file"
    if a.download:
        try:
            path, source = download("lotto_history.csv"), "pais.co.il official download"
        except Exception as e:  # noqa: BLE001
            print(f"[official download failed: {e}; trying GitHub mirror]", file=sys.stderr)
            a.mirror = True
    if a.mirror:
        try:
            path, source = download_mirror("lotto_history.csv"), f"GitHub mirror {MIRROR_URL}"
        except Exception as e:  # noqa: BLE001
            print(f"[mirror failed: {e}; using bundled CSV]", file=sys.stderr)
            a.bundled = True
    if a.bundled:
        path, source = BUNDLED, "CSV bundled with the plugin"
    print(f"[data source: {source}]", file=sys.stderr)

    all_draws = load_draws(path)
    draws = current_era(all_draws)
    if len(draws) < 50:
        sys.exit(f"Only {len(draws)} draws in the 1-37 era parsed from {len(all_draws)} rows; check the file format.")
    st = analyze(draws, a.recent)
    rng = random.Random(a.seed)
    tickets = generate(st, a.tickets, a.strategy, rng)
    today = dt.date.today()
    report = build_report(st, tickets, a.strategy, a.lang, today, source)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(report)
    summary = {
        "data_source": source,
        "draws_total_rows": len(all_draws), "draws_used": st["count"],
        "first": {"id": st["first"]["id"], "date": st["first"]["date"].isoformat()},
        "last": {"id": st["last"]["id"], "date": st["last"]["date"].isoformat()},
        "jackpot_odds": JACKPOT_ODDS,
        "freq": {str(x): st["freq"][x] for x in range(1, MAX_N + 1)},
        "recent_window": a.recent,
        "recent_freq": {str(x): st["recent_freq"][x] for x in range(1, MAX_N + 1)},
        "gaps": {str(x): st["gaps"][x] for x in range(1, MAX_N + 1)},
        "strong_freq": {str(s): st["strong_freq"][s] for s in range(1, STRONG_MAX + 1)},
        "sum_percentiles": {"p20": st["sum_p20"], "p50": st["sum_p50"], "p80": st["sum_p80"]},
        "chi_square": {"numbers": round(st["chi"], 2), "strong": round(st["chi_strong"], 2)},
        "strategy": a.strategy,
        "tickets": [{"nums": t["nums"], "strong": t["strong"], "why": t["why"]} for t in tickets],
        "next_draw": next_draw_date(today).isoformat(),
    }
    with open(a.json, "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(report)
    print(f"\n[written: {a.out}, {a.json}]")


if __name__ == "__main__":
    main()

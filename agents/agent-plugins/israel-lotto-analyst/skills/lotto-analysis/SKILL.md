---
name: lotto-analysis
description: Statistical analysis of the Israeli Lotto (מפעל הפיס, 6/37 + strong number 1–7) draw history and generation of tickets for the next draw. Use for "לוטו", "מספר חזק", "ניתוח הגרלות", "מספרים לשבת", hot/cold numbers, or any Israeli lottery number request.
---

# Israeli Lotto Analysis

## Script

`scripts/lotto_analyze.py` — Python 3, standard library only.

```
python3 scripts/lotto_analyze.py --download                 # fetch archive from pais.co.il and analyze
python3 scripts/lotto_analyze.py --file Lotto.csv           # analyze a CSV downloaded manually
python3 scripts/lotto_analyze.py --file Lotto.csv --tickets 5 --strategy unpopular --seed 7
python3 scripts/lotto_analyze.py --file Lotto.csv --out report.md --json summary.json
```

Options:

| Flag | Meaning |
|---|---|
| `--download` | Download the official CSV (`lotto_resultsDownload.aspx`) to `lotto_history.csv` |
| `--file PATH` | Use an existing CSV (encoding auto-detected: UTF-8 / Windows-1255) |
| `--mirror` | Fetch the community GitHub mirror of the official archive (`PZABOY/pais-lotto-checker`, JSON, same columns). `--download` falls back to this automatically when pais.co.il is unreachable |
| `--bundled` | Use `data/lotto_history.csv` shipped with the plugin (real archive, draws #1035–#3807, last draw 06/05/2025). Final fallback when offline |
| `--recent N` | Window for hot/cold numbers (default 50 draws) |
| `--tickets K` | Number of tickets to generate (default 5) |
| `--strategy` | `unpopular` (default), `hot`, `cold`, `random` |
| `--seed` | Reproducible picks |
| `--out`, `--json` | Output paths (default `lotto_report.md`, `lotto_summary.json`) |

## Data freshness

The report always prints its data source and the last draw it contains. If the last draw is older than the previous Tuesday/Saturday, say so to the user: the frequencies barely move, but the hot/cold window and gaps are then stale. The official download is the only source guaranteed current.

## CSV format expected

Official file: first row is a header, then one row per draw:
`draw_id, date (dd/mm/yyyy), n1, n2, n3, n4, n5, n6, strong`. Extra columns (e.g. second strong number in special draws) are ignored. Rows whose numbers exceed 37 belong to the older 6/49 or 6/45 formats and are dropped automatically.

## What the report contains

1. Honest odds line (1 : 16,273,488 per ticket) and the "only edge is unpopularity" statement.
2. Data range: first/last draw kept, count.
3. Frequency table 1–37 with expected count and deviation.
4. Hot / cold over the last N draws and the longest current gaps.
5. Strong-number frequency 1–7.
6. Distributions of the winning sets: sum, odd/even split, low(1–18)/high(19–37) split, consecutive-pair rate.
7. Top 10 most frequent pairs.
8. Chi-square uniformity statistic with a plain-language reading.
9. Generated tickets with the reason each passed the filters.
10. Next draw date and responsible-play line.

## `unpopular` strategy filters

A candidate ticket is accepted only if it:
- has at most 3 numbers ≤ 31 (birthday-heavy sets are heavily overplayed);
- is not an arithmetic sequence and has no more than one consecutive pair;
- has between 2 and 4 odd numbers;
- has a sum inside the 20th–80th percentile of historical winning sums;
- does not lie on a single column or diagonal of the play slip (7-column layout);
- does not repeat any previously drawn full set.

The strong number is chosen uniformly at random (all 7 are equally likely; the popular picks 7 and 3 are avoided only for sharing reasons).

## Language

Report is written in Hebrew by default (`--lang he`); `--lang en` for English. Numbers and tables stay identical.

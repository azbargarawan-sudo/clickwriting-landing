---
description: Analyze the full Israeli Lotto history and suggest tickets (6 numbers + strong) for the next draw
argument-hint: [--file Lotto.csv] [--tickets 5] [--strategy unpopular|hot|cold|random]
---

Run the Israel Lotto Analyst on the official draw history.

1. Run `python3 skills/lotto-analysis/scripts/lotto_analyze.py --download $ARGUMENTS`. If the download fails, ask the user for the CSV from https://www.pais.co.il/Lotto/lotto_resultsDownload.aspx and rerun with `--file`.
2. Read `lotto_report.md` and `lotto_summary.json`.
3. Answer in the user's language: the honest odds line first, then the key statistics, then the tickets, then the next draw date and the responsible-play line.

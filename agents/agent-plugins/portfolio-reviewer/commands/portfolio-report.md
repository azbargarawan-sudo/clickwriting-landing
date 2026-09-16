---
description: Build a full portfolio report from an uploaded holdings file (Excel/CSV)
argument-hint: <path to holdings file> [base currency] [markdown|docx]
---

Run the Portfolio Reviewer agent on the holdings file at $ARGUMENTS.

1. Load the file and normalize it with `clean-data-xls`.
2. Follow the `portfolio-reviewer` agent workflow end to end.
3. Save the report, the enriched holdings workbook, and the data log next to the input file.
4. Finish with a five-line summary: total value, top three weights, number of risk flags, number of `[UNSOURCED]` figures, and where the files were saved.

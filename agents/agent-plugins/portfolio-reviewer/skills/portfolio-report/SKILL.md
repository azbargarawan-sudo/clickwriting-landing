---
name: portfolio-report
description: Structure, thresholds, and templates for a periodic stock-portfolio review report built from an investor's holdings file. Use when asked for a "portfolio report", "review my stocks", "تقرير على محفظتي", "تحليل الأسهم اللي عندي", or any full report on the stocks a user owns.
---

# Portfolio Review Report

Produces a complete, sourced review of an investor's stock portfolio. Output is descriptive and analytical, never a recommendation.

## Input file

Accept Excel or CSV. Recognize these columns in any order, any language, any casing (map synonyms):

| Canonical | Synonyms accepted |
|---|---|
| `ticker` | symbol, رمز, code, ISIN (resolve to ticker) |
| `name` | company, الشركة, security |
| `quantity` | qty, shares, units, عدد الأسهم, الكمية |
| `avg_cost` | cost, average price, متوسط التكلفة, سعر الشراء |
| `purchase_date` | date, تاريخ الشراء |
| `currency` | ccy, العملة |
| `exchange` | market, السوق (e.g. NYSE, NASDAQ, TADAWUL, TASE) |

Only `ticker` or `name` is mandatory. Without `quantity` the report skips allocation weights. Without `avg_cost` it skips P&L.

## Report structure

1. **Cover line** — date, number of positions, total value (with pricing date), base currency.
2. **Portfolio summary**
   - Allocation table: position, weight, sector, country, currency, value, unrealized P&L (if available).
   - Concentration: top 3 positions weight, top sector weight, share of one country / currency.
   - Performance since purchase, if dates and cost are available. Never annualize a period shorter than one year.
3. **Risk flags** (only the ones that fire; omit the section if none):
   - Single position > 15% of portfolio.
   - Single sector > 35%.
   - Single currency > 70% (excluding the base currency).
   - Earnings date within 14 days.
   - Two consecutive quarters of declining operating margin.
   - Guidance cut, going-concern language, or rating downgrade in the last 90 days.
4. **Per-stock sections**, ordered by weight. Each section is 150–300 words plus one table:
   - What the company does (two lines).
   - Latest quarter: revenue, operating margin, EPS vs. prior quarter and vs. consensus.
   - Valuation: P/E (TTM and forward), EV/EBITDA, dividend yield, each vs. the stock's 5-year median and vs. peer median from `comps-analysis`.
   - Recent developments (last 30 days), each with a date and source.
   - Key risks: at most three, specific to this company.
   - What changed since the last review (if a prior report is provided; otherwise "first review").
5. **Watchlist** — questions the investor should follow up on (e.g. "Does the 22% weight in one name match your risk tolerance?"). Questions, not instructions.
6. **Data log** — every figure, its source, and its as-of date. Use tags `[FACTSET]`, `[SPGLOBAL]`, `[DALOOPA]`, `[MORNINGSTAR]`, `[FILING]`, `[WEB]`, `[USER FILE]`, `[UNSOURCED]`.

## Language and tone

- Write in the user's language. Keep tickers, column headers, and metric names in English.
- Neutral, factual, no adjectives like "great" or "terrible". Say "operating margin fell from 18.2% to 15.1%", not "margins collapsed".
- Every section ends with its data sources in one line.

## Disclaimer (mandatory, last line of the report)

> This report describes facts, valuation metrics, and risks of the positions in the uploaded file. It is not investment, legal, or tax advice and does not recommend any transaction.

Arabic version when the report is in Arabic:

> هذا التقرير يصف حقائق ومقاييس تقييم ومخاطر المراكز الموجودة في الملف المرفوع. لا يُعد نصيحة استثمارية أو قانونية أو ضريبية ولا يوصي بأي عملية بيع أو شراء.

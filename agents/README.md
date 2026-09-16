# Financial Services Agents

الأجنتات العشرة الجاهزة من Anthropic لقطاع الخدمات المالية، مع الإضافة الأساسية `financial-analysis`
التي تحمل مهارات النمذجة وموصلات البيانات (MCP).

المصدر: https://github.com/anthropics/financial-services (رخصة Apache-2.0، انظر `LICENSE`).

## الأجنتات

| الأجنت | المجلد | الوظيفة |
|---|---|---|
| Pitch Agent | `agent-plugins/pitch-agent` | مقارنات وسوابق و LBO حتى عرض تقديمي كامل |
| Meeting Prep Agent | `agent-plugins/meeting-prep-agent` | ملف تحضيري قبل كل اجتماع عميل |
| Market Researcher | `agent-plugins/market-researcher` | نظرة قطاعية، منافسين، مقارنات، قائمة أفكار |
| Earnings Reviewer | `agent-plugins/earnings-reviewer` | نتائج الشركة والإفصاحات ← تحديث النموذج ← مسودة تقرير |
| Model Builder | `agent-plugins/model-builder` | DCF و LBO ونماذج القوائم الثلاث في Excel |
| Valuation Reviewer | `agent-plugins/valuation-reviewer` | مراجعة تقييمات GP وتجهيز تقارير LP |
| GL Reconciler | `agent-plugins/gl-reconciler` | كشف الفروقات في دفتر الأستاذ وتتبع أسبابها |
| Month-End Closer | `agent-plugins/month-end-closer` | إقفال الشهر: استحقاقات، ترحيلات، تعليق على الفروقات |
| Statement Auditor | `agent-plugins/statement-auditor` | تدقيق كشوف LP قبل التوزيع |
| KYC Screener | `agent-plugins/kyc-screener` | قراءة مستندات الفتح، تشغيل القواعد، رصد النواقص |
| **Israel Lotto Analyst** (חדש, נבנה כאן) | `agent-plugins/israel-lotto-analyst` | ניתוח סטטיסטי של כל הגרלות הלוטו בישראל והצעת טפסים (6 מספרים + מספר חזק) להגרלה הבאה, עם הסיכויים האמיתיים |
| **Portfolio Reviewer** (جديد، مبني هنا) | `agent-plugins/portfolio-reviewer` | ترفع ملف محفظتك (Excel/CSV) ويطلع تقرير كامل لكل سهم وملخص للمحفظة |

## التثبيت في Claude Code

```
claude plugin marketplace add azbargarawan-sudo/clickwriting-landing
claude plugin install financial-analysis@clickwriting-financial-agents
claude plugin install earnings-reviewer@clickwriting-financial-agents
```

استبدل `earnings-reviewer` باسم أي أجنت من الجدول. ثبّت `financial-analysis` أولاً دائماً.

## التثبيت في Claude Cowork

Settings → Plugins → Add plugin، ثم إما لصق رابط هذا الريبو، أو ضغط أي مجلد تحت `agent-plugins/` ورفعه كـ zip.

## مثال: تقرير على أسهم محفظتك

ثبّت `financial-analysis` و `portfolio-reviewer`:

```
claude plugin install portfolio-reviewer@clickwriting-financial-agents
```

ارفع ملف المحفظة (Excel أو CSV فيه على الأقل عمود الرمز أو اسم الشركة، واختيارياً الكمية ومتوسط التكلفة والعملة)، ثم:

```
/portfolio-report holdings.xlsx SAR markdown
```

أو اكتب مباشرة: "هذي محفظتي، اعطني تقرير كامل لكل سهم". الناتج: تقرير بلغتك، ملف Excel بالمراكز مع البيانات المالية، وسجل مصادر لكل رقم.
التقرير وصفي فقط (حقائق، تقييم، مخاطر) ولا يعطي توصيات بيع أو شراء.

البيانات الحية (أسعار، قوائم مالية) تأتي من الموصلات في
`vertical-plugins/financial-analysis/.mcp.json` وأغلبها يحتاج اشتراك أو مفتاح API من المزوّد.

## לוטו ישראל (עברית)

```
claude plugin install israel-lotto-analyst@clickwriting-financial-agents
/lotto --tickets 5
```

הסוכן מוריד את ארכיון ההגרלות הרשמי של מפעל הפיס, מנתח שכיחויות, פערים, מספר חזק, סכומים וזוגות, ומציע טפסים.
אם ההורדה חסומה, מורידים את הקובץ ידנית מ-`https://www.pais.co.il/Lotto/lotto_resultsDownload.aspx` ומריצים `/lotto --file Lotto.csv`.
חשוב: כל הגרלה אקראית, הסיכוי לפרס הראשון הוא 1 ל-16,273,488 לכל טופס בלי קשר לניתוח. היתרון היחיד הוא בחירת צירופים פחות פופולריים כדי לא להתחלק בפרס.

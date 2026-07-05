# Water Chemistry Final Project — Aquatic Carbonate System & Water Acidification

**Course:** Water Chemistry, Ben-Gurion University, Spring 2026 · **Due:** 14.7.2026

A code-based modeling tool for the aqueous carbonate system
(CO₂ / H₂CO₃* – HCO₃⁻ – CO₃²⁻). It computes equilibrium **pH**,
carbonate **speciation**, **total inorganic carbon (Cₜ)** and the **calcite
saturation index (SI)**, and shows how the input parameters control the outcome.

> Topic chosen to be **different** from the lime–soda softening example.

## What's in here

| File | Purpose |
|------|---------|
| `carbonate_system_tool.html` | **Interactive tool** — open in any browser. Sliders for pCO₂, alkalinity, T, ionic strength, Ca; live pH / Cₜ / SI cards and 4 live charts. No install, no internet. |
| `carbonate_system_model.py`  | **Python engine + figure generator.** Run it to reproduce all report figures and the validation table. |
| `carbonate_system_model.txt` | Same code as `.py`, for submission (the assignment asks Python code to be sent as `.txt`). |
| `build_report.py` | Builds the Word report with the figures embedded. |
| `Water_Chemistry_Report.docx` | **The submission document** — Background, Methods, Results & Discussion, Conclusions. Add your names/IDs/emails at the top. |
| `fig1..fig5_*.png` | The five generated figures. |

## How to run

```bash
pip install numpy matplotlib
python carbonate_system_model.py     # prints validation + writes fig1..fig5
python build_report.py               # writes Water_Chemistry_Report.docx
```
Or just double-click `carbonate_system_tool.html`.

## The science (short version)

- **Constants** K₁, K₂, Kₕ, Kₛₚ(calcite), Kᵥ are temperature-dependent
  (Plummer & Busenberg, 1982). Validated at 25 °C: pK₁ = 6.35, pK₂ = 10.33,
  pKₕ = 1.47, pKₛₚ = 8.48.
- **Non-ideality:** Davies equation; the Debye–Hückel *A* is computed from the
  temperature-dependent dielectric constant of water (A ≈ 0.51 at 25 °C).
- **Solver:** the model finds [H⁺] satisfying the alkalinity balance
  `Alk = [HCO₃⁻] + 2[CO₃²⁻] + [OH⁻] − [H⁺]` by bisection over pH.
- **Modes:** *open* (fixed pCO₂ via Henry's law) and *closed* (fixed Cₜ).
- **Saturation:** `SI = log₁₀(a_Ca · a_CO₃ / Kₛₚ)`. SI > 0 → precipitation;
  SI < 0 → dissolution/corrosion.

## Before submitting

1. Fill in the four **emails** at the top of the `.docx` (names and IDs are already
   in). Group: Shada Taha, Abdallah Awad, Lina Awad, Yasmin Nassar.
2. The report uses **4 graphs — one per group member** (Bjerrum, acidification,
   calcite SI, ionic strength). A fifth figure (`fig4_temperature.png`) is also
   generated if you prefer to swap one out.
3. Submit two files: the Word/PDF report and the code
   (`carbonate_system_tool.html` or `carbonate_system_model.txt`).

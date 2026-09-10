* Syntax for the seminar study: screens, sleep and physical activity among students with learning disabilities.
* Run on the real data file (same column structure as the simulated file).

GET FILE='simulated_data_N65.sav'.
DATASET NAME DataSet1 WINDOW=FRONT.

* Reverse-coded items and grouped guideline variable.
COMPUTE S3R=4 - S3.
COMPUTE F4R=6 - F4.
COMPUTE Guidelines_Grp=Guidelines_Count.
RECODE Guidelines_Grp (3=2).
VARIABLE LABELS S3R 'ערני רוב היום (מהופך)' F4R 'מרגיש עייף בשיעורים (מהופך)' Guidelines_Grp 'מספר המלצות (מקובץ)'.
VALUE LABELS Guidelines_Grp 0 'אף המלצה' 1 'המלצה אחת' 2 'שתיים או שלוש'.
EXECUTE.
FREQUENCIES VARIABLES=Group_LD Gender Grade Sector ADHD Accommodations
  /ORDER=ANALYSIS.

DESCRIPTIVES VARIABLES=Screen_Leisure_WD Screen_Leisure_WE Screen_Leisure_Avg Bedtime_WD Sleep_Dur_WD Sleep_Dur_WE Weekend_Shift Sleepiness_Total PA_Days60 PA_Hours_Vig Grade_Avg Grade_Math Grade_English Func_Total
  /STATISTICS=MEAN STDDEV MIN MAX SKEWNESS KURTOSIS.

RELIABILITY
  /VARIABLES=S1 S2 S3R S4 S5 S6 S7 S8
  /SCALE('ישנוניות יומית') ALL
  /MODEL=ALPHA
  /STATISTICS=DESCRIPTIVE CORR SCALE
  /SUMMARY=TOTAL.

RELIABILITY
  /VARIABLES=F1 F2 F3 F4R F5
  /SCALE('תפקוד יומי בלמידה') ALL
  /MODEL=ALPHA
  /STATISTICS=DESCRIPTIVE CORR SCALE
  /SUMMARY=TOTAL.

EXAMINE VARIABLES=Screen_Leisure_Avg Sleep_Dur_WD Weekend_Shift Sleepiness_Total PA_Days60 Grade_Avg Func_Total
  /PLOT HISTOGRAM NPPLOT
  /STATISTICS DESCRIPTIVES
  /MISSING PAIRWISE.

CROSSTABS
  /TABLES=Group_LD BY Meet_Screen Meet_Sleep Meet_PA Guidelines_Grp
  /FORMAT=AVALUE TABLES
  /STATISTICS=CHISQ PHI
  /CELLS=COUNT ROW
  /COUNT ROUND CELL.

USE ALL.
COMPUTE filter_LD=(Group_LD = 1).
FILTER BY filter_LD.
EXECUTE.
CORRELATIONS
  /VARIABLES=Screen_Leisure_Avg Bedtime_WD Sleep_Dur_WD Weekend_Shift Sleepiness_Total PA_Days60 Grade_Avg Func_Total
  /PRINT=TWOTAIL NOSIG
  /STATISTICS DESCRIPTIVES
  /MISSING=PAIRWISE.

NONPAR CORR
  /VARIABLES=Screen_Leisure_Avg Bedtime_WD Sleep_Dur_WD Weekend_Shift Sleepiness_Total PA_Days60 Grade_Avg Func_Total
  /PRINT=SPEARMAN TWOTAIL NOSIG
  /MISSING=PAIRWISE.

FILTER OFF.
USE ALL.
EXECUTE.

T-TEST GROUPS=Group_LD(0 1)
  /MISSING=ANALYSIS
  /VARIABLES=Screen_Leisure_Avg Sleep_Dur_WD Weekend_Shift Sleepiness_Total PA_Days60 Grade_Avg Grade_Math Grade_English Func_Total
  /ES DISPLAY(TRUE)
  /CRITERIA=CI(.95).

ONEWAY Grade_Avg Func_Total BY Guidelines_Grp
  /STATISTICS DESCRIPTIVES HOMOGENEITY WELCH
  /MISSING ANALYSIS
  /POSTHOC=BONFERRONI ALPHA(0.05).

REGRESSION
  /DESCRIPTIVES MEAN STDDEV CORR SIG N
  /MISSING LISTWISE
  /STATISTICS COEFF OUTS CI(95) R ANOVA CHANGE COLLIN TOL
  /CRITERIA=PIN(.05) POUT(.10)
  /NOORIGIN
  /DEPENDENT Grade_Avg
  /METHOD=ENTER Screen_Leisure_Avg Sleep_Dur_WD Weekend_Shift PA_Days60 Sleepiness_Total
  /METHOD=ENTER Group_LD Gender
  /SCATTERPLOT=(*ZRESID ,*ZPRED)
  /RESIDUALS HISTOGRAM(ZRESID) NORMPROB(ZRESID).

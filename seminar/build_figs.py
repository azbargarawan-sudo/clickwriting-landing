import numpy as np, pandas as pd, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
bd = lambda s: s  # matplotlib 3.11 renders Hebrew RTL correctly on its own
plt.rcParams['font.family'] = 'DejaVu Sans'; plt.rcParams['font.size'] = 10
df = pd.read_csv('simulated_data_N65_for_JASP.csv'); ld = df[df.Group_LD == 1]; nl = df[df.Group_LD == 0]
BLUE, ORANGE, INK, GRID = '#2E6FBF', '#E08A2E', '#333333', '#DDDDDD'
def clean(ax):
    ax.set_axisbelow(True)
    for s in ['top', 'right']: ax.spines[s].set_visible(False)
    for s in ['left', 'bottom']: ax.spines[s].set_color('#999999')
    ax.tick_params(colors=INK)
fig, ax = plt.subplots(figsize=(6.2, 4.0), dpi=200)
x, y = ld.Screen_Leisure_Avg.values, ld.Grade_Avg.values
ax.scatter(x, y, s=34, color=BLUE, alpha=.85, edgecolor='white', linewidth=.8, zorder=3)
b1, b0 = np.polyfit(x, y, 1); xs = np.linspace(x.min(), x.max(), 50); ax.plot(xs, b0 + b1 * xs, color=INK, linewidth=1.6, zorder=2)
ax.text(0.98, 0.95, 'r = -0.53, p < 0.001, n = 40', transform=ax.transAxes, ha='right', va='top', fontsize=9, color=INK)
ax.set_xlabel(bd('זמן מסך פנאי יומי ממוצע (שעות)'), color=INK); ax.set_ylabel(bd('ממוצע ציונים'), color=INK)
ax.grid(color=GRID, linewidth=.6, zorder=0); clean(ax); plt.tight_layout(); fig.savefig('fig1_scatter.png'); plt.close(fig)
labels = [bd('זמן מסך עד שעתיים'), bd('משך שינה לפי הגיל'), bd('60 דקות פעילות בכל יום')]
ld_p = [100 * ld[v].mean() for v in ['Meet_Screen', 'Meet_Sleep', 'Meet_PA']]; nl_p = [100 * nl[v].mean() for v in ['Meet_Screen', 'Meet_Sleep', 'Meet_PA']]
fig, ax = plt.subplots(figsize=(6.2, 3.8), dpi=200); xi = np.arange(3); w = 0.36
b1_ = ax.bar(xi - w / 2 - 0.01, ld_p, w, color=BLUE, label=bd('עם לקות למידה (n = 40)'), zorder=3)
b2_ = ax.bar(xi + w / 2 + 0.01, nl_p, w, color=ORANGE, label=bd('ללא לקות למידה (n = 25)'), zorder=3)
for bars in (b1_, b2_):
    for b in bars: ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 1.2, f'{b.get_height():.0f}%', ha='center', va='bottom', fontsize=9, color=INK)
ax.set_xticks(xi); ax.set_xticklabels(labels, color=INK); ax.set_ylabel(bd('אחוז העומדים בהמלצה'), color=INK); ax.set_ylim(0, 70)
ax.yaxis.grid(color=GRID, linewidth=.6, zorder=0); clean(ax); ax.legend(frameon=False, fontsize=9, loc='upper left'); plt.tight_layout(); fig.savefig('fig2_guidelines.png'); plt.close(fig)
g = df.assign(G=df.Guidelines_Count.clip(upper=2)).groupby('G').Grade_Avg.agg(['mean', 'sem', 'count'])
fig, ax = plt.subplots(figsize=(5.2, 3.6), dpi=200)
ax.bar(range(3), g['mean'], 0.55, color=BLUE, yerr=g['sem'], capsize=4, ecolor=INK, zorder=3)
for i, (m, n) in enumerate(zip(g['mean'], g['count'])): ax.text(i, m + 2.2, f'{m:.1f}\n(n = {n})', ha='center', va='bottom', fontsize=9, color=INK)
ax.set_xticks(range(3)); ax.set_xticklabels([bd('אף המלצה'), bd('המלצה אחת'), bd('שתיים או שלוש')], color=INK)
ax.set_ylabel(bd('ממוצע ציונים'), color=INK); ax.set_ylim(60, 92); ax.yaxis.grid(color=GRID, linewidth=.6, zorder=0); clean(ax)
plt.tight_layout(); fig.savefig('fig3_guidelines_grade.png'); plt.close(fig); print('figs ok')

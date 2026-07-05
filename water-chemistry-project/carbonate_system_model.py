"""
=============================================================================
 Aquatic Carbonate System & Water Acidification -- Modeling Tool
 Water Chemistry course, BGU, Spring 2026
=============================================================================

A code-based modeling tool for the aqueous carbonate system. It computes the
equilibrium pH, carbonate speciation (H2CO3*, HCO3-, CO3-2), total inorganic
carbon (C_T), and the calcite saturation index (SI) for a water sample, and
shows how the input parameters (pCO2, alkalinity, temperature, ionic strength,
Ca) control the outcome.

Two operating modes:
  * OPEN system   -> the water is in contact with a gas phase of fixed pCO2
                     (e.g. the atmosphere). [H2CO3*] is set by Henry's law.
  * CLOSED system -> C_T is fixed (no gas exchange).

Physical chemistry
------------------
Acidity constants, the water ion product, Henry's constant for CO2 and the
calcite solubility product are all temperature dependent and are evaluated
with the Plummer & Busenberg (1982) polynomials (T in Kelvin). Non-ideality is
handled with the Davies equation, whose Debye-Hückel A-parameter is itself
computed from the temperature-dependent dielectric constant of water.

Run `python carbonate_system_model.py` to reproduce all report figures and a
short validation table.

NOTE for submission: if submitting the Python option, save this file as .txt.
=============================================================================
"""

import numpy as np
import matplotlib.pyplot as plt


# ----------------------------------------------------------------------------
# 1. Temperature-dependent equilibrium constants  (Plummer & Busenberg, 1982)
# ----------------------------------------------------------------------------
def log10_K1(T):
    """H2CO3* = H+ + HCO3-  (T in Kelvin). Returns log10 K1."""
    return (-356.3094 - 0.06091964 * T + 21834.37 / T
            + 126.8339 * np.log10(T) - 1684915.0 / T ** 2)


def log10_K2(T):
    """HCO3- = H+ + CO3-2  (T in Kelvin). Returns log10 K2."""
    return (-107.8871 - 0.03252849 * T + 5151.79 / T
            + 38.92561 * np.log10(T) - 563713.9 / T ** 2)


def log10_KH(T):
    """CO2(g) + H2O = H2CO3*  Henry constant (mol L-1 atm-1). Returns log10 KH."""
    return (108.3865 + 0.01985076 * T - 6919.53 / T
            - 40.45154 * np.log10(T) + 669365.0 / T ** 2)


def log10_Ksp_calcite(T):
    """CaCO3(calcite) = Ca+2 + CO3-2  (T in Kelvin). Returns log10 Ksp."""
    return (-171.9065 - 0.077993 * T + 2839.319 / T
            + 71.595 * np.log10(T))


def pKw(T):
    """Ion product of water, log10 Kw (Harned & Owen)."""
    return (4470.99 / T - 6.0875 + 0.01706 * T)  # = -log10 Kw


# ----------------------------------------------------------------------------
#  Unit helpers -- "mg/L as CaCO3" convention (course Lecture 1)
# ----------------------------------------------------------------------------
def eqL_to_mgCaCO3(eq_per_L):
    """Alkalinity: eq/L -> mg/L as CaCO3  (x 50,000; Ew(CaCO3)=50 g/eq)."""
    return eq_per_L * 50_000.0


def molL_to_mgCaCO3(mol_per_L):
    """Hardness: mol/L -> mg/L as CaCO3  (x 100,000; Mw(CaCO3)=100 g/mol)."""
    return mol_per_L * 100_000.0


# ----------------------------------------------------------------------------
# 2. Activity coefficients -- Davies equation with T-dependent A parameter
# ----------------------------------------------------------------------------
def dielectric_water(TC):
    """Static dielectric constant of water, TC in Celsius (Malmberg & Maryott)."""
    return 87.740 - 0.40008 * TC + 9.398e-4 * TC ** 2 - 1.410e-6 * TC ** 3


def debye_huckel_A(T):
    """Debye-Hückel A parameter (mol/L)^-0.5 from dielectric constant."""
    TC = T - 273.15
    eps = dielectric_water(TC)
    return 1.82e6 / (eps * T) ** 1.5


def gamma(z, I, T):
    """Davies-equation activity coefficient for an ion of charge z at ionic
    strength I (mol/L) and temperature T (K). Neutral species -> 1."""
    if z == 0 or I <= 0:
        return 1.0
    A = debye_huckel_A(T)
    sqI = np.sqrt(I)
    log_g = -A * z ** 2 * (sqI / (1.0 + sqI) - 0.3 * I)
    return 10.0 ** log_g


# ----------------------------------------------------------------------------
# 3. Core solver
# ----------------------------------------------------------------------------
class CarbonateSystem:
    """
    Inputs
    ------
    T_C   : temperature [deg C]
    I     : ionic strength [mol/L]        (activity corrections)
    Alk   : total alkalinity [eq/L]       (e.g. 2.0e-3 = 2 meq/L)
    Ca    : total calcium [mol/L]         (for calcite saturation only)
    pCO2  : CO2 partial pressure [atm]    (OPEN mode; 400 ppm = 4.0e-4 atm)
    CT    : total inorganic carbon [mol/L](CLOSED mode)
    mode  : 'open' or 'closed'
    """

    def __init__(self, T_C=25.0, I=0.01, Alk=2.0e-3, Ca=1.0e-3,
                 pCO2=400e-6, CT=None, mode='open'):
        self.T = T_C + 273.15
        self.I = I
        self.Alk = Alk
        self.Ca = Ca
        self.pCO2 = pCO2
        self.CT_fixed = CT
        self.mode = mode

        # thermodynamic (activity-based) constants
        self.K1 = 10 ** log10_K1(self.T)
        self.K2 = 10 ** log10_K2(self.T)
        self.KH = 10 ** log10_KH(self.T)
        self.Ksp = 10 ** log10_Ksp_calcite(self.T)
        self.Kw = 10 ** (-pKw(self.T))

        # activity coefficients
        self.g1 = gamma(1, I, self.T)
        self.g2 = gamma(2, I, self.T)

        # conditional (concentration) constants
        self.K1c = self.K1 / self.g1 ** 2
        self.K2c = self.K2 / self.g2
        self.Kwc = self.Kw / self.g1 ** 2

        self.solve()

    # -- alkalinity as a function of [H+] -------------------------------------
    def _alk_from_H(self, H):
        """Carbonate + water alkalinity at proton concentration H (=[H+])."""
        if self.mode == 'open':
            H2CO3 = self.KH * self.pCO2                 # fixed by Henry's law
            HCO3 = self.K1c * H2CO3 / H
            CO3 = self.K2c * HCO3 / H
        else:  # closed: C_T fixed, distribute over species
            a0 = 1.0 / (1 + self.K1c / H + self.K1c * self.K2c / H ** 2)
            HCO3 = self.CT_fixed * a0 * self.K1c / H
            CO3 = self.CT_fixed * a0 * self.K1c * self.K2c / H ** 2
        OH = self.Kwc / H
        return HCO3 + 2 * CO3 + OH - H

    def solve(self):
        """Bisection on pH (of [H+]) so that computed alkalinity == input Alk."""
        lo, hi = 10 ** -1, 10 ** -13          # H range: pH 1..13
        f = lambda H: self._alk_from_H(H) - self.Alk
        for _ in range(200):
            mid = np.sqrt(lo * hi)            # geometric bisection (log pH)
            if f(lo) * f(mid) <= 0:
                hi = mid
            else:
                lo = mid
        H = np.sqrt(lo * hi)
        self.H = H

        # speciation (concentrations)
        if self.mode == 'open':
            self.H2CO3 = self.KH * self.pCO2
        else:
            a0 = 1.0 / (1 + self.K1c / H + self.K1c * self.K2c / H ** 2)
            self.H2CO3 = self.CT_fixed * a0
        self.HCO3 = self.K1c * self.H2CO3 / H
        self.CO3 = self.K2c * self.HCO3 / H
        self.OH = self.Kwc / H
        self.CT = self.H2CO3 + self.HCO3 + self.CO3

        # pH is reported on the activity scale
        self.pH = -np.log10(H * self.g1)

        # calcite saturation index  SI = log10( a_Ca * a_CO3 / Ksp )
        a_Ca = self.Ca * self.g2
        a_CO3 = self.CO3 * self.g2
        self.IAP = a_Ca * a_CO3
        self.SI = np.log10(self.IAP / self.Ksp)
        self.Omega = self.IAP / self.Ksp     # saturation ratio

    # convenience
    def summary(self):
        return (f"mode={self.mode:6s}  T={self.T-273.15:4.1f}C  I={self.I:5.3f}  "
                f"pCO2={self.pCO2*1e6:6.1f}ppm  Alk={self.Alk*1e3:4.2f}meq/L  "
                f"-> pH={self.pH:5.2f}  CT={self.CT*1e3:5.2f}mM  SI={self.SI:+5.2f}")


# ----------------------------------------------------------------------------
# 3b. CCPP -- Calcium Carbonate Precipitation Potential  (a real water-utility
#     stability index: how much CaCO3, in mg/L as CaCO3, will precipitate (+)
#     or dissolve (-) to bring the water to calcite equilibrium, Omega = 1).
# ----------------------------------------------------------------------------
def ccpp(T_C=15, I=0.01, Alk=2.0e-3, Ca=0.8e-3, CT=2.0e-3):
    """Precipitating x mol/L of CaCO3 removes x Ca, x CT and 2x alkalinity.
    Solve for the x that yields Omega = 1 (closed system)."""
    def omega(x):
        cs = CarbonateSystem(T_C=T_C, I=I, Alk=Alk - 2 * x, Ca=max(Ca - x, 1e-9),
                             CT=max(CT - x, 1e-9), mode='closed')
        return cs.Omega
    lo, hi = -0.9 * Ca, 0.99 * Ca             # allow dissolution (x<0)
    for _ in range(100):                      # omega decreases with x
        mid = 0.5 * (lo + hi)
        if omega(mid) > 1:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi) * 100_000.0        # mol/L -> mg/L as CaCO3


# ----------------------------------------------------------------------------
# 3c. Dynamic model -- COUPLED kinetics + gas/liquid mass transfer + 3 phases.
#     A CO2-rich groundwater (equilibrated with high soil pCO2) is exposed to
#     the atmosphere. Two rate processes act simultaneously:
#       * CO2 mass transfer (gas<->liquid):  J = kLa (KH*pCO2_atm - [CO2aq])
#         -> changes C_T but NOT alkalinity.
#       * Calcite precipitation (kinetics):  R = kp (Omega - 1),  Omega>1
#         -> d[Ca]=-R, d[C_T]=-R, d[Alk]=-2R.
#     Integrated explicitly. Demonstrates degassing-driven scaling (travertine
#     / pipe scale), the classic multi-phase, multi-rate carbonate problem.
# ----------------------------------------------------------------------------
def simulate_kinetics(Alk0=4.0e-3, Ca0=2.5e-3, T_C=15, I=0.02,
                      pCO2_soil=30000e-6, pCO2_atm=400e-6,
                      kLa=0.8, kp=6.0e-4, t_end=12.0, n=1200):
    # initial C_T: water equilibrated with high soil CO2 (closed thereafter)
    init = CarbonateSystem(T_C=T_C, I=I, Alk=Alk0, Ca=Ca0,
                           pCO2=pCO2_soil, mode='open')
    KH = init.KH
    CT, Alk, Ca = init.CT, Alk0, Ca0
    dt = t_end / n
    t, pH, CTs, Cas, SI, Om = [], [], [], [], [], []
    for k in range(n + 1):
        cs = CarbonateSystem(T_C=T_C, I=I, Alk=Alk, Ca=max(Ca, 1e-9),
                             CT=max(CT, 1e-9), mode='closed')
        t.append(k * dt); pH.append(cs.pH); CTs.append(CT * 1e3)
        Cas.append(Ca * 1e3); SI.append(cs.SI); Om.append(cs.Omega)
        J = kLa * (KH * pCO2_atm - cs.H2CO3)      # CO2 mass transfer (mol/L/hr)
        R = kp * max(cs.Omega - 1.0, 0.0)         # calcite precip. kinetics
        CT += (J - R) * dt
        Alk += (-2.0 * R) * dt
        Ca += (-R) * dt
    return dict(t=np.array(t), pH=np.array(pH), CT=np.array(CTs),
                Ca=np.array(Cas), SI=np.array(SI), Omega=np.array(Om))


# ----------------------------------------------------------------------------
# 4. Validation
# ----------------------------------------------------------------------------
def validate():
    print("=" * 74)
    print("VALIDATION  (literature-consistent benchmarks)")
    print("=" * 74)
    # pK values at 25 C, I=0
    T = 298.15
    print(f"  25 C, I=0 :  pK1={-log10_K1(T):.2f} (lit 6.35)   "
          f"pK2={-log10_K2(T):.2f} (lit 10.33)")
    print(f"              pKH={-log10_KH(T):.2f} (lit 1.47)   "
          f"pKsp_calcite={-log10_Ksp_calcite(T):.2f} (lit 8.48)")
    print(f"              A(Davies)={debye_huckel_A(T):.3f} (lit 0.509)")
    print("-" * 74)
    # freshwater open to atmosphere
    fw = CarbonateSystem(T_C=25, I=0.005, Alk=2.0e-3, Ca=1.0e-3,
                         pCO2=400e-6, mode='open')
    print("  Freshwater, atm CO2 :", fw.summary(), " (expect pH ~ 8.3)")
    # pre-industrial vs future atmosphere, seawater-like
    for ppm, era in [(280, 'pre-industrial'), (400, 'present'), (1000, 'future')]:
        sw = CarbonateSystem(T_C=25, I=0.7, Alk=2.3e-3, Ca=10.3e-3,
                             pCO2=ppm * 1e-6, mode='open')
        print(f"  Seawater {era:14s}:", sw.summary())
    print("=" * 74)


# ----------------------------------------------------------------------------
# 5. Figures for the report  (one per group member -- pick the ones you need)
# ----------------------------------------------------------------------------
def fig_speciation(T_C=25, I=0.01, outfile='fig1_speciation.png'):
    """Bjerrum plot: carbonate speciation fractions vs pH."""
    cs = CarbonateSystem(T_C=T_C, I=I)
    pH = np.linspace(2, 13, 600)
    H = 10 ** (-pH) / cs.g1
    a0 = 1 / (1 + cs.K1c / H + cs.K1c * cs.K2c / H ** 2)
    a1 = 1 / (H / cs.K1c + 1 + cs.K2c / H)
    a2 = 1 / (H ** 2 / (cs.K1c * cs.K2c) + H / cs.K2c + 1)

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.plot(pH, a0, lw=2.4, label=r'$H_2CO_3^*$ ($\alpha_0$)')
    ax.plot(pH, a1, lw=2.4, label=r'$HCO_3^-$ ($\alpha_1$)')
    ax.plot(pH, a2, lw=2.4, label=r'$CO_3^{2-}$ ($\alpha_2$)')
    for pk, txt in [(-log10_K1(cs.T), 'pK1'), (-log10_K2(cs.T), 'pK2')]:
        ax.axvline(pk, color='0.6', ls='--', lw=1)
        ax.text(pk + 0.1, 0.9, f'{txt}={pk:.2f}', fontsize=8, color='0.4')
    ax.set_xlabel('pH'); ax.set_ylabel('mole fraction of $C_T$')
    ax.set_title(f'Carbonate speciation (Bjerrum plot), T={T_C}$\\degree$C, I={I} M')
    ax.set_xlim(2, 13); ax.set_ylim(0, 1.02); ax.legend(loc='center right')
    ax.grid(alpha=0.3)
    fig.tight_layout(); fig.savefig(outfile, dpi=150); plt.close(fig)
    return outfile


def fig_acidification(Alk=2.0e-3, T_C=15, I=0.01, Ca=0.8e-3,
                      outfile='fig2_acidification.png'):
    """pH and C_T vs atmospheric pCO2 (open system) -- water acidification."""
    ppm = np.logspace(np.log10(150), np.log10(3000), 140)
    pH, CT = [], []
    for p in ppm:
        cs = CarbonateSystem(T_C=T_C, I=I, Alk=Alk, Ca=Ca,
                             pCO2=p * 1e-6, mode='open')
        pH.append(cs.pH); CT.append(cs.CT * 1e3)
    fig, ax1 = plt.subplots(figsize=(7.2, 4.6))
    ax1.plot(ppm, pH, color='#c0392b', lw=2.6)
    ax1.set_xscale('log')
    ax1.set_xlabel('atmospheric $pCO_2$ [ppm]')
    ax1.set_ylabel('pH', color='#c0392b')
    ax1.tick_params(axis='y', labelcolor='#c0392b')
    for p, lab in [(280, 'pre-ind.'), (420, 'today'), (1000, 'RCP8.5 2100')]:
        ax1.axvline(p, color='0.7', ls=':', lw=1)
        ax1.text(p, ax1.get_ylim()[0] + 0.05, lab, rotation=90,
                 va='bottom', ha='right', fontsize=7, color='0.4')
    ax2 = ax1.twinx()
    ax2.plot(ppm, CT, color='#2471a3', lw=2.2, ls='--')
    ax2.set_ylabel('$C_T$ [mmol/L]', color='#2471a3')
    ax2.tick_params(axis='y', labelcolor='#2471a3')
    ax1.set_title(f'Water acidification: fixed Alk={Alk*1e3:.1f} meq/L, T={T_C}$\\degree$C')
    ax1.grid(alpha=0.3)
    fig.tight_layout(); fig.savefig(outfile, dpi=150); plt.close(fig)
    return outfile


def fig_saturation(Alk=2.0e-3, T_C=15, I=0.01, Ca=0.8e-3,
                   outfile='fig3_calcite_SI.png'):
    """Calcite saturation index vs pCO2 -- over/under-saturation threshold."""
    ppm = np.logspace(np.log10(150), np.log10(3000), 140)
    SI = []
    for p in ppm:
        cs = CarbonateSystem(T_C=T_C, I=I, Alk=Alk, Ca=Ca,
                             pCO2=p * 1e-6, mode='open')
        SI.append(cs.SI)
    SI = np.array(SI)
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.plot(ppm, SI, color='#117864', lw=2.6)
    ax.axhline(0, color='k', lw=1)
    ax.fill_between(ppm, 0, SI, where=SI >= 0, color='#a9dfbf', alpha=0.6,
                    label='over-saturated (SI>0): precipitation')
    ax.fill_between(ppm, SI, 0, where=SI < 0, color='#f5b7b1', alpha=0.6,
                    label='under-saturated (SI<0): dissolution')
    ax.set_xscale('log')
    ax.set_xlabel('atmospheric $pCO_2$ [ppm]')
    ax.set_ylabel('Calcite Saturation Index  SI = log$_{10}(\\Omega)$')
    ax.set_title(f'Calcite saturation vs $pCO_2$  (Ca={Ca*1e3:.1f} mM, T={T_C}$\\degree$C)')
    ax.legend(loc='upper right'); ax.grid(alpha=0.3)
    fig.tight_layout(); fig.savefig(outfile, dpi=150); plt.close(fig)
    return outfile


def fig_temperature(Alk=2.0e-3, I=0.01, Ca=0.8e-3, pCO2=400e-6,
                    outfile='fig4_temperature.png'):
    """Effect of temperature on pH and calcite SI (open system)."""
    TC = np.linspace(0, 40, 120)
    pH, SI = [], []
    for t in TC:
        cs = CarbonateSystem(T_C=t, I=I, Alk=Alk, Ca=Ca, pCO2=pCO2, mode='open')
        pH.append(cs.pH); SI.append(cs.SI)
    fig, ax1 = plt.subplots(figsize=(7.2, 4.6))
    ax1.plot(TC, pH, color='#b9770e', lw=2.6)
    ax1.set_xlabel('temperature [$\\degree$C]')
    ax1.set_ylabel('pH', color='#b9770e')
    ax1.tick_params(axis='y', labelcolor='#b9770e')
    ax2 = ax1.twinx()
    ax2.plot(TC, SI, color='#117864', lw=2.2, ls='--')
    ax2.set_ylabel('Calcite SI', color='#117864')
    ax2.tick_params(axis='y', labelcolor='#117864')
    ax1.set_title(f'Temperature effect (open, $pCO_2$={pCO2*1e6:.0f} ppm, '
                  f'Alk={Alk*1e3:.1f} meq/L)')
    ax1.grid(alpha=0.3)
    fig.tight_layout(); fig.savefig(outfile, dpi=150); plt.close(fig)
    return outfile


def fig_ionic_strength(Alk=2.0e-3, T_C=15, Ca=0.8e-3, pCO2=400e-6,
                       outfile='fig5_ionic_strength.png'):
    """Effect of ionic strength on apparent pK's and calcite SI."""
    Ivals = np.linspace(0.0, 0.5, 120)   # Davies eq. is reliable up to ~0.5 M
    pK1c, pK2c, SI = [], [], []
    for I in Ivals:
        cs = CarbonateSystem(T_C=T_C, I=max(I, 1e-6), Alk=Alk, Ca=Ca,
                             pCO2=pCO2, mode='open')
        pK1c.append(-np.log10(cs.K1c)); pK2c.append(-np.log10(cs.K2c))
        SI.append(cs.SI)
    fig, ax1 = plt.subplots(figsize=(7.2, 4.6))
    ax1.plot(Ivals, pK1c, lw=2.4, label="apparent pK1'")
    ax1.plot(Ivals, pK2c, lw=2.4, label="apparent pK2'")
    ax1.set_xlabel('ionic strength I [mol/L]')
    ax1.set_ylabel("apparent p$K'$ (conditional)")
    ax1.legend(loc='center left'); ax1.grid(alpha=0.3)
    ax2 = ax1.twinx()
    ax2.plot(Ivals, SI, color='#117864', lw=2.2, ls='--', label='calcite SI')
    ax2.set_ylabel('Calcite SI', color='#117864')
    ax2.tick_params(axis='y', labelcolor='#117864')
    ax1.set_title(f'Ionic-strength (non-ideality) effect, T={T_C}$\\degree$C')
    fig.tight_layout(); fig.savefig(outfile, dpi=150); plt.close(fig)
    return outfile


def fig_kinetics(outfile='fig6_kinetics.png', **kw):
    """Dynamic run: degassing (mass transfer) + calcite precipitation (kinetics)."""
    r = simulate_kinetics(**kw)
    # transition time where the water first becomes over-saturated (SI crosses 0)
    cross = np.argmax(r['SI'] >= 0) if np.any(r['SI'] >= 0) else None

    fig, ax1 = plt.subplots(figsize=(7.2, 4.6))
    ax1.plot(r['t'], r['pH'], color='#c0392b', lw=2.6, label='pH')
    ax1.set_xlabel('time [h]  (illustrative rate constants)')
    ax1.set_ylabel('pH', color='#c0392b')
    ax1.tick_params(axis='y', labelcolor='#c0392b')

    ax2 = ax1.twinx()
    ax2.plot(r['t'], r['Ca'], color='#2471a3', lw=2.2, ls='--', label='Ca')
    ax2.plot(r['t'], r['CT'], color='#7d3c98', lw=1.8, ls=':', label='$C_T$')
    ax2.set_ylabel('Ca$^{2+}$ / $C_T$ [mmol/L]', color='#2471a3')
    ax2.tick_params(axis='y', labelcolor='#2471a3')

    if cross is not None and cross > 0:
        tc = r['t'][cross]
        ax1.axvline(tc, color='0.5', ls='-', lw=1)
        ax1.annotate('degassing  |  + precipitation',
                     xy=(tc, ax1.get_ylim()[0]), xytext=(tc, ax1.get_ylim()[0]),
                     fontsize=8, color='0.35', ha='center', va='bottom')
        ax1.text(tc, r['pH'][cross], '  SI=0', fontsize=8, color='0.35')

    ax1.set_title('Dynamic model: CO$_2$ degassing (mass transfer) + '
                  'calcite precipitation (kinetics)')
    ax1.grid(alpha=0.3)
    L1, l1 = ax1.get_legend_handles_labels()
    L2, l2 = ax2.get_legend_handles_labels()
    ax1.legend(L1 + L2, l1 + l2, loc='center right', fontsize=9)
    fig.tight_layout(); fig.savefig(outfile, dpi=150); plt.close(fig)
    return outfile


if __name__ == '__main__':
    validate()
    print(f"\n  CCPP (hard supersaturated water) = "
          f"{ccpp(T_C=15, I=0.02, Alk=4e-3, Ca=2.5e-3, CT=4.2e-3):+.1f} mg/L as CaCO3")
    files = [
        fig_speciation(),
        fig_acidification(),
        fig_saturation(),
        fig_temperature(),
        fig_ionic_strength(),
        fig_kinetics(),
    ]
    print("\nFigures written:")
    for f in files:
        print("  -", f)

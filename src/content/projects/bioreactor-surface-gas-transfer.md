---
title: "Headspace gas transfer and composition tracking"
description: "Literature review, surface-transfer correlations and validation status, followed by adjustable oxygen-utilisation scenarios tracking headspace O2 and N2 from ambr250 to 2,000 L."
organization: "Independent project"
publishedDate: "2026-09-17"
period: "2026–present"
tags: ["Gas transfer", "kLa", "Headspace", "Scale-down", "Shake flasks", "Wave bioreactors"]
order: 2
draft: false
---

Gas reaches a bioreactor culture through sparged bubbles and the free surface beneath the headspace. This project compares surface-transfer models with literature measurements, then demonstrates O₂ and N₂ tracking during fed-batch culture at ambr250 and 2,000 L scale.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#literature-review-headspace-and-surface-gas-transfer">Literature review</a></li>
    <li><a href="#surface-transfer-correlation-and-validation">Correlation model and validation</a></li>
    <li><a href="#headspace-gas-composition-tracking">Headspace O₂ and N₂ tracking</a></li>
    <li><a href="#shake-flask-power-and-oxygen-transfer">Shake-flask study</a></li>
    <li><a href="#wave-bioreactors-liquid-and-headspace-response">Wave-bag study</a></li>
  </ol>
</nav>

## Literature review: headspace and surface gas transfer

<span id="measured-surface-transfer-from-02-to-2000-l" aria-hidden="true"></span>

[Bowers (2008), Tables 1 and 4](https://skoge.folk.ntnu.no/prost/proceedings/aiche-2008/data/papers/P118781.pdf) reports a fivefold decrease in surface O₂ and CO₂ coefficients between 8 and 2,000 L. Bench-scale studies report higher coefficients under different operating conditions. The comparison below shows the range of published results; working volume alone does not explain the differences.

<figure class="xdr-figure">
  <a href="/gas-transfer/surface_kla_scale.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the surface transfer scale plot at full size">
    <img src="/gas-transfer/surface_kla_scale.svg" alt="Reported nonsparged gas-transfer coefficients against working volume on logarithmic axes. A point shows Clark's ambr 250 result at 215 mL and 1.10 per hour. Five vertical bars show selected oxygen-transfer ranges for Al-Ramadhani, Wyrobnik, Scargiali, de Lamotte and Schlaich. Connected solid and dashed lines show Bowers oxygen and carbon dioxide coefficients across four vessels." width="760" height="560" loading="lazy" decoding="async" />
  </a>
  <figcaption>Reported nonsparged transfer coefficients against working volume, logarithmic on both axes. Lines connect the Bowers O₂ (solid) and CO₂ (dashed) results. The ambr point is Clark's 215 mL, 300 rpm condition. Vertical bars span selected conditions from the other studies; they are not uncertainty intervals or necessarily each study's complete range.</figcaption>
</figure>

<details class="xdr-details">
  <summary>Measurements, sources and comparison limits</summary>

The Bowers series used DMEM with 10% fetal calf serum and 0.05 vvm headspace air. O₂ coefficients came from dissolved-oxygen recovery after nitrogen sparging; CO₂ coefficients were inferred from pH slopes using carbonate-equilibrium assumptions. Area per volume assumes a flat circular surface.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Surface transfer coefficients measured across four vessel sizes in one study" tabindex="0">

| Working volume | Tank diameter | Agitation | Surface $k_La$, O₂ | Surface $k_La$, CO₂ | Area per volume |
| --- | --- | --- | --- | --- | --- |
| 8 L | 0.20 m | 90 rpm | 0.25 h⁻¹ | 0.15 h⁻¹ | 3.93 m⁻¹ |
| 160 L | 0.61 m | 30 rpm | 0.10 h⁻¹ | 0.08 h⁻¹ | 1.83 m⁻¹ |
| 420 L | 0.80 m | 27 rpm | 0.06 h⁻¹ | 0.04 h⁻¹ | 1.20 m⁻¹ |
| 2,000 L | 1.50 m | 17 rpm | 0.05 h⁻¹ | 0.03 h⁻¹ | 0.88 m⁻¹ |

</div>

Selected figure-derived values are approximate:

- **ambr 250** — approximately 0.92, 1.30 and 1.51 h⁻¹ at 200, 400 and 600 rpm with 10 mL/min of headspace air. These are the Xu experimental values reproduced in [Anand et al. (2024), Figure 6](https://doi.org/10.1016/j.jbiotec.2024.04.013); the original Xu assay working volume remains unresolved. Anand's approximately 12.4 m⁻¹ area per volume describes its CFD interface geometry and does not independently establish the assay geometry. Separately, [Clark (2020), Table B.2, p. 258](https://discovery.ucl.ac.uk/10111802/2/Clark_10111802_Thesis.pdf) reports 1.10 h⁻¹ at 215 mL, 300 rpm, down-pumping and 9 mL/min headspace air with no sparging.
- **0.3 L miniature bioreactor** — approximately 1.33, 1.88 and 2.25 h⁻¹ at 300, 400 and 500 rpm in CD-CHO at 37 °C, with 200 mL/min headspace air ([Al-Ramadhani 2015, Figure 3.9, p. 80](https://discovery.ucl.ac.uk/id/eprint/1460929/2/Al-Ramadhani_Omar_Thesis_Copyright_Removed.pdf)). These are digitized means of three replicates.
- **1 L stirred tank** — approximately 0.31–1.33 h⁻¹ among selected figure means over 50–250 rpm in PBS at 37 °C, with headspace flows of 100–500 mL/min ([Wyrobnik et al. 2025, Figure 3A](https://doi.org/10.1002/bit.70025)).
- **5.4 L unbaffled Rushton** — approximately 0.17 and 0.30 h⁻¹ at 100 and 200 rpm in water at 16 °C ([Scargiali et al. 2013, Figure 4](https://www.aidic.it/cet/13/32/248.pdf)). These are selected low-speed, near-flat-interface conditions; the study also reports higher transfer with a deeper vortex.
- **16.5 L dual Rushton** — approximately 0.14 h⁻¹ at 50 rpm, with 1.58 h⁻¹ reported in the text and Table 1 at 300 rpm ([de Lamotte et al. 2017](https://discovery.ucl.ac.uk/10064111/1/Manuscript_pdf.pdf)). The source's figure and table differ at the upper endpoint, as noted below.

The Xu values are listed here but omitted from the volume plot because their working volume is unresolved. Clark's plotted point uses the volume recorded in its experimental table. The Schlaich bar covers selected up-pumping conditions at 60–90 rpm, 40 L and 10 L/min headspace flow.

Several values were digitized from published figures. The studies differ in medium, temperature, impeller configuration and gas replacement, and some report apparent coefficients from the overall nonsparged response. Their differences cannot be attributed to volume or interface geometry alone.

For de Lamotte, the plotted upper value follows the text and Table 1: 4.4 × 10⁻⁴ s⁻¹, or approximately 1.58 h⁻¹. The 300 rpm marker in Figure 3 appears nearer 2.0 h⁻¹. This unresolved discrepancy limits the precision of comparisons using that point.

Working volume alone is insufficient to describe the surface pathway. Selected up-pumping measurements in a 40 L XDR-200 were approximately 0.90–1.33 h⁻¹ ([Schlaich et al. 2023, Figure 5](https://doi.org/10.1002/btpr.3330)), overlapping the 16.5 L results. Its reported 0.57 m tank diameter gives a calculated planar area per volume of 6.4 m⁻¹ at 40 L, compared with approximately 2.3 m⁻¹ for the 16.5 L tank. This illustrates why fill geometry belongs in the model, although the studies do not isolate its effect from differences in hydrodynamics and operating conditions.

</details>

## Surface-transfer correlation and validation

The surface-renewal model combines transfer velocity with the free-surface area per liquid volume:

$$
k_La = C(\epsilon\nu)^{1/4}Sc^{-n}\frac{A}{V}, \qquad Sc=\frac{\nu}{D}.
$$

Here $\epsilon=P/(\rho V)$ is mean energy dissipation, $\nu$ is kinematic viscosity, and $D$ is gas diffusivity. A transfer rate additionally requires the gas–liquid driving force, $c^*-c$.

<span id="what-a-surface-model-requires" aria-hidden="true"></span>

<details class="xdr-details">
  <summary>Model inputs, coefficient sets and applicability</summary>

<div class="xdr-experiment-plan xdr-data-table xdr-input-table" role="region" aria-label="Inputs required by the surface transfer model and how well each is known" tabindex="0">

| Input | Meaning | Source | How well it is known |
| --- | --- | --- | --- |
| $A$, $V$ | Free-surface area at the working fill and the liquid volume beneath it | Vessel geometry at fill height | The flat circular area is an approximation. The real interface is deformed by the vortex and obstructed by the shaft, probes and dip tubes, none of which I subtract. |
| $\epsilon$ | Dissipation supplied to the correlation, W/kg | Vessel-mean $P/(\rho V)$ with an optional surface-to-mean multiplier | The comparison assumes a multiplier of 1. The coefficient and the location at which dissipation is evaluated must be treated together. |
| $\nu$, $\rho$ | Kinematic viscosity and density at temperature | Water correlations, or measured medium values | Good for water; culture media are generally assumed water-like. |
| $D$ | Diffusivity of each gas, setting $Sc = \nu/D$ | Tabulated at 25 °C with Stokes–Einstein temperature scaling | Good for oxygen. CO₂ and N₂ scale from oxygen through the same Schmidt exponent and inherit its uncertainty. |
| $C$, $n$ | Model constant and Schmidt exponent | Calibration against measured surface transfer | The open question, discussed below. |
| $c^*$, $c$ | Equilibrium and bulk dissolved-gas concentrations, setting the driving force $c^*-c$ | Henry's law at temperature and headspace partial pressure, plus the liquid concentration | Headspace composition can change with surface exchange, sparger exhaust and overlay flow. Molecular CO₂ must be distinguished from total dissolved inorganic carbon. |

</div>

<div class="xdr-experiment-plan xdr-data-table xdr-parameter-table" role="region" aria-label="Published constant and Schmidt exponent pairs for the surface renewal expression" tabindex="0">

| Set | $C$ | $n$ | Basis |
| --- | --- | --- | --- |
| [Lamont & Scott (1970)](https://doi.org/10.1002/aic.690160403) | 0.4 | 1/2 | Eddy-cell model, expressed using near-interface dissipation |
| [Kawase & Moo-Young (1990), Eq. 7](https://www.researchgate.net/publication/280002515_Mass_transfer_at_a_free_surface_in_stirred_tank_bioreactors) | 0.138 | 2/3 | Free-surface correlation using vessel-mean dissipation; Eq. 8 separately cites the 0.13 Calderbank–Moo-Young form |
| Initial provisional fit | 0.210 | 2/3 | Six measurements from two studies, at 16.5 and 40 L, within 10–100 W/m³ |
| Expanded provisional fit | 0.175 | 2/3 | Ten conditions from three studies, adding selected 1 L PBS measurements with assumed water-like properties |
| Current legacy default | 0.175 | 3/4 | Coefficient pair retained by numerical regression fixtures; published experimental provenance has not been established |

</div>

The coefficient and the dissipation definition belong together. The parity fit below uses vessel-mean dissipation and $n=2/3$. The legacy vessel examples use $C=0.175$, $n=3/4$; their two synthetic regression fixtures check numerical consistency, and published experimental provenance for that pair has not been established.

Digitized measurements, reconstructed power, medium properties and projected areas limit the comparison. The four 1 L PBS conditions use water-like properties and the source water-power fit. ambr250 is excluded from parity because matching geometry or other assay inputs remain unresolved; no 2,000 L condition enters the fit. Bowers' printed power of 2.5 mW/m³ remains an unresolved source-unit issue and is excluded from calibration.

The implementation has no lower-turbulence or entrainment guard. In de Lamotte's 22 cm vessel, some low-speed conditions were not fully turbulent; the 300 rpm condition (approximately 448 W/m³) was described as unentrained, with entrainment observed above it.

</details>

<span id="validation-status-and-gas-balance-checks" aria-hidden="true"></span>

### Literature parity and validation status

The expanded fit uses **10 conditions from three studies** within 10–100 W/m³. Fitting one global coefficient with equal study weight in squared logarithmic error gives $C=0.1752$, $n=2/3$, calibration RMSE **0.355 h⁻¹** and agreement $R^2=-0.184$. The positive correlation therefore coexists with substantial disagreement. This is a provisional calibration; it does not establish transferability to 2,000 L or culture media.

<figure class="xdr-figure">
  <a href="/gas-transfer/surface_kla_global_expanded_fit.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the surface-transfer literature calibration parity plot">
    <img src="/gas-transfer/surface_kla_global_expanded_fit.svg" alt="Predicted versus literature surface kLa for ten conditions from three studies, with a 1:1 line. The fitted model underpredicts the 16.5 L measurements, closely follows the 40 L measurements, and overpredicts the 1 L measurements." width="1232" height="1188" loading="lazy" decoding="async" />
  </a>
  <figcaption><strong>Surface-transfer literature parity.</strong> Predicted kLa is on the horizontal axis and measured kLa on the vertical axis. Circles: <a href="https://discovery.ucl.ac.uk/10064111/1/Manuscript_pdf.pdf">de Lamotte (2017)</a>, 16.5 L; diamonds: <a href="https://doi.org/10.1002/btpr.3330">Schlaich (2023)</a>, 40 L; open triangles: <a href="https://doi.org/10.1002/bit.70025">Wyrobnik (2025)</a>, 1 L PBS with additional input assumptions. Legend n counts condition means. R² is agreement (1 − SSE/SST); Pearson r and p describe correlation, with p nominal for these clustered calibration data.</figcaption>
</figure>

<details class="xdr-details">
  <summary>Literature parity with each study held out of calibration</summary>

<figure class="xdr-figure">
  <a href="/gas-transfer/surface_kla_global_expanded_holdout.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the surface-transfer study-holdout parity plot">
    <img src="/gas-transfer/surface_kla_global_expanded_holdout.svg" alt="Ten surface kLa predictions made with each source study excluded from fitting in turn. Prediction errors increase relative to the calibration plot, especially for the 1 L study." width="1232" height="1188" loading="lazy" decoding="async" />
  </a>
  <figcaption><strong>Study-holdout comparison.</strong> Each of the three studies is excluded in turn, and C is fitted using only the other two. The ten held-out predictions give RMSE = 0.582 h⁻¹ and agreement R² = −2.186. Markers and input assumptions match the calibration plot. The reported Pearson p remains nominal for these clustered data. This tests transfer between the included studies; it is not an independent external validation dataset.</figcaption>
</figure>

</details>

<span id="what-the-difference-does-to-a-scale-down-model" aria-hidden="true"></span>

<details class="xdr-details">
  <summary>Illustrative scale comparison: geometry and surface supply</summary>

These illustrative calculations use the legacy pair $C=0.175$, $n=3/4$, water at 37 °C, sparging off, prescribed air composition at 101.325 kPa and a surface-to-mean dissipation ratio of 1. They are separate from the fitted literature comparison.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Modeled surface transfer at each end of the vessel chain" tabindex="0">

| Vessel | Fill | Speed | $P/V$ | Liquid height | Area per volume | Surface $k_La$ |
| --- | --- | --- | --- | --- | --- | --- |
| Sartorius ambr 250 | 0.2 L | 600 rpm | 79.1 W/m³ | 0.072 m | 15.0 m⁻¹ | 2.33 h⁻¹ |
| Applikon 3 L glass | 2 L | 200 rpm | 18.6 W/m³ | 0.157 m | 6.6 m⁻¹ | 0.72 h⁻¹ |
| Xcellerex XDR-2000 | 2,000 L | 100 rpm | 15.3 W/m³ | 1.801 m | 0.58 m⁻¹ | 0.060 h⁻¹ |

</div>

<span id="separating-transfer-velocity-from-geometry" aria-hidden="true"></span>

The ambr-to-XDR surface-kLa ratio is 38.7: an area-per-volume ratio of 25.7 multiplied by a transfer-velocity ratio of 1.51. Geometry supplies the larger difference in this example. At 20 million cells/mL and SOUR 5.5 pmol/(cell day), surface supply at 40% DO covers approximately 6.5% of demand in the ambr and 0.17% in the XDR. The sparger would need to supply the remainder.

- **ambr 250:** 200 mL, 600 rpm, two 26 mm impellers and a vessel-total power number of 1.34, applied once. The vessel profile is an equivalent, capacity-fitted geometry rather than a reconstruction of the cited assays.
- **Applikon 3 L:** 2 L, 200 rpm, one 60 mm impeller and an assumed power number of 1.3. This power number is an input assumption, not a manufacturer measurement.
- **XDR-2000:** 2,000 L, 100 rpm, one 420 mm impeller and a power number of 0.51.

The dry-air oxygen fraction is 0.2095, with water-vapour pressure subtracted at 37 °C. Headspace composition is held fixed; finite overlay flow and oxygen depletion in the headspace are not simulated in this comparison. Projected interface areas do not resolve waves or hardware obstruction.

</details>

<span id="analytical-verification-of-gas-composition-tracking" aria-hidden="true"></span>

<details class="xdr-details">
  <summary>Analytical verification of the headspace gas balance</summary>

For the dynamic headspace calculation, I first check a constant-input case with a known analytical solution. Here $F_i$ is the net molar flow of species $i$ entering the headspace after the assumed uptake, $F=\sum_i F_i$ is total flow, and $N_H$ is the fixed dry-gas inventory. The steady fraction is $y_i^\infty=F_i/F$, and the response time is $\tau=N_H/F$:

$$
\begin{aligned}
N_H\frac{dy_i}{dt}&=F_i-Fy_i, \\
y_i(t)&=y_i^\infty+\left[y_i(0)-y_i^\infty\right]e^{-t/\tau}.
\end{aligned}
$$

The numerical O₂ trajectory differs from this solution by less than **0.000001 percentage points** at both scales. Across the 38 fed-batch scenarios below, the largest whole-system species-balance residual is **2.91 × 10⁻¹⁰ mol**. Checks also cover zero demand, zero gas flow, the fixed-air supply floor, and conservation of the inert air remainder. These are numerical checks; comparison with measured headspace composition remains open.

<figure class="xdr-figure">
  <a href="/gas-transfer/tracking/balance_verification.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the analytical headspace balance check at full size">
    <img src="/gas-transfer/tracking/balance_verification.svg" alt="Numerical oxygen fractions shown as open circles follow analytical exponential curves at 200 mL and 2,000 L. Both approach the same oxygen fraction with different response times." width="1378" height="738" loading="lazy" decoding="async" />
  </a>
  <figcaption><strong>Analytical check of headspace replenishment.</strong> Lines show the exact solution and circles the numerical result, starting from air. Constant VCD is 20 million cells/mL, SOUR is 5.5 pmol/(cell day), and assumed sparger oxygen utilisation is 50%. Air sparge and overlay are each 0.005 vvm; pure O₂ supplies the calculated remainder. At 35.5 °C and 101.325 kPa, the modeled headspaces are 0.150 and 970.33 L, giving response times of 58.69 and 37.97 minutes. This is a mathematical verification, not a comparison with measured headspace gas.</figcaption>
</figure>

</details>

## Headspace gas composition tracking

The demonstration uses the **14-day fed-batch VCD profile and assumed SOUR of 5.5 pmol/(cell day)**. VCD is interpolated from the standard-feed spin-tube measurements in [Dahodwala et al. (2025), Figure 1B and Supplemental File 4](https://doi.org/10.1002/biot.70012), and applied at both scales as an illustrative scenario.

Air sparge and overlay are each fixed at **1 mL/min at 200 mL**, scaled by liquid volume to **10 L/min at 2,000 L** (0.005 vvm per stream). Adjustable utilisation determines the supplemental O₂ feed and the oxygen remaining in the bubbles. The balance assumes uptake is supplied; it does not predict liquid DO or transfer feasibility.

<span id="adjust-utilisation-at-each-scale" aria-hidden="true"></span>

<figure class="xdr-explorer">
  <iframe src="/gas-transfer/tracking/index.html" title="Interactive headspace O2 and N2 tracking with independent oxygen-utilisation controls for ambr250 and 2,000 L" width="900" height="1350" loading="lazy" data-content-height></iframe>
  <figcaption>Adjust oxygen utilisation independently at each scale and select a culture day to inspect headspace composition, supplemental O₂ feed and oxygen carried from bubbles. Both controls start at an illustrative 50%.</figcaption>
</figure>

[Open the explorer at full size](/gas-transfer/tracking/index.html)

<span id="from-oxygen-demand-to-gas-composition" aria-hidden="true"></span>

<details class="xdr-details">
  <summary>How utilisation sets O₂ feed and bubble carryover</summary>

Utilisation $\eta$ is the fraction of the **total sparger O₂** consumed by the culture, including O₂ supplied by sparger air. It does not include overlay oxygen. Uptake is $U=Xq_{O_2}V_L$. Let $F_a$ be sparger air, $F_p$ supplemental pure O₂, and $F_{b,O_2}$ oxygen carried from bubbles into the headspace, all in mol/time:

$$
F_p=\max\!\left(\frac{U}{\eta}-0.2095F_a,\;0\right),
$$

$$
F_{b,O_2}=0.2095F_a+F_p-U.
$$

At low demand, fixed air alone can provide more oxygen than this rule calls for. Pure O₂ stays at zero and realised utilisation falls below the selected value. When supplemental O₂ is needed, lowering utilisation increases both the required O₂ feed and the oxygen carried into the headspace. The headspace balance above then determines the composition and response time.

</details>

<span id="limitations-and-next-steps" aria-hidden="true"></span>

The next experimental check is to compare the simulated O₂/N₂ trajectories with measured exhaust composition and estimate utilisation from an inlet–outlet oxygen balance.


## Shake-flask power and oxygen transfer

The flask study covers 50 mL–3 L sizes, working fill, orbital diameter and shaking speed. **Power results remain under review:** generic baffled P/V lacks a geometry-specific correlation, and unbaffled orbital-range checks are incomplete. The archived power estimates should not be used for scale-up decisions.

[Archived 720-case study](/gas-transfer/shake-flask/index.html) · [Results and applicability notes (CSV)](/gas-transfer/shake-flask/summary.csv)

<details class="xdr-details">
  <summary>Study scope and correlation coverage</summary>

The screening covers 720 conditions: eight nominal sizes from 50 mL to 3 L, baffled and unbaffled, 19/25/50 mm throws, 100–300 rpm and 10/20/30% working fills at 37 °C. Dimensions assume geometric similarity rather than a manufacturer catalog. There are 396 kLa estimates; the remaining 324 conditions are outside the selected correlation's coverage.

<span id="using-rcf-and-pv-for-scale-up" aria-hidden="true"></span>

RCF and orbital diameter together determine rpm. Estimating P/V additionally requires fill, geometry and an applicable power correlation; matching P/V does not establish equal oxygen transfer or local stress.

- **Unbaffled power:** the Büchs correlation applies to conventional flasks moving in phase with the shaker. The implementation checks its size and flow-regime limits; values outside them are labelled extrapolations ([Dinter et al.](https://doi.org/10.1002/bit.28892)).
- **Baffled power:** the current screening relation was used to estimate power in a published application; it was not a direct power measurement. It has no explicit flask-diameter or orbit term. Its size trend at fixed percentage fill comes entirely from changing working volume. Design-specific calibration remains necessary ([Martínez-Hernández et al.](https://doi.org/10.24275/rmiq/Bio725)).
- **Unbaffled oxygen transfer:** the Meier correlation covers 100–450 rpm, 12.5–100 mm orbit, 51–131 mm flask diameter and 2–160 mL fill. Estimates beyond those ranges are flagged. Its oxygen-transfer capacity is converted to $k_La$ using the specified gas conditions and oxygen solubility ([Meier et al.](https://doi.org/10.1016/j.bej.2016.01.014)).
- **Baffled oxygen transfer:** the implemented Schiefelbein response surfaces cover a specific disposable-flask family at 125–500 mL nominal size, 50 mm orbit, 50–250 rpm, 10–40% fill and 30–37 °C. Applying them to the generic geometry shown here is a transfer assumption that requires calibration. The curves are not extended to unsupported sizes or throws ([Schiefelbein et al.](https://doi.org/10.1007/s10529-013-1203-9)).

The flask calculations prescribe interfacial gas composition. Closure resistance, changing flask headspace and liquid DO histories are not simulated.

</details>

## Wave bioreactors: liquid and headspace response

The rocking-bag study couples dissolved O₂, molecular CO₂ and N₂ with the headspace. It applies a transfer correlation measured on Biostat RM bags in PBS with Pluronic to an assumed Cellbag geometry; that transfer remains provisional ([Piontek et al., 2026](https://www.frontiersin.org/journals/bioengineering-and-biotechnology/articles/10.3389/fbioe.2025.1688774/full)). Liquid volume, temperature, pressure and cellular demand are fixed, with no DO controller.

<span id="following-the-headspace-composition" aria-hidden="true"></span>

<figure class="xdr-figure">
  <a href="/gas-transfer/wave-bag/transient_comparison.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the wave-bag dissolved oxygen and headspace comparison at full size">
    <img src="/gas-transfer/wave-bag/transient_comparison.svg" alt="Dissolved oxygen and headspace oxygen and carbon dioxide changes for a 4 L rocking-bag example at 2 and 20 million cells per mL. The baseline approaches 79.55 percent air saturation over 120 minutes; the higher-demand case reaches oxygen depletion at 3.92 minutes. The two columns use different time scales." width="2124" height="1134" loading="lazy" decoding="async" />
  </a>
  <figcaption><strong>Liquid oxygen and headspace response.</strong> A 10 L Cellbag preset at 4 L fill, 24 rpm, ±7°, 37 °C and 300 standard mL/min sweep (20.95% O₂, 5% CO₂, balance N₂), with kLa 11.11 h⁻¹, SOUR 5.5 pmol/(cell day) and respiratory quotient 1. Left: 2 million cells/mL, reaching 79.55% DO after 120 minutes. Right: 20 million cells/mL, reaching oxygen depletion at 3.92 minutes while headspace O₂ is still 20.81%; integration stops there. Lower panels show changes in dry headspace fractions from their initial values. Columns use different time windows.</figcaption>
</figure>

<span id="estimated-power-per-liquid-volume" aria-hidden="true"></span>

The combined maps compare oxygen-supply capacity with cycle-average P/V. **P/V is an uncalibrated energy estimate**, calculated independently of kLa from assumed rectangular geometry and complete dissipation of the available potential energy each half-cycle. It does not resolve wave shape, resonance or peak power.

<figure class="xdr-figure" id="wave-capacity-power-comparison">
  <a href="/gas-transfer/wave-bag/capacity_power_maps.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the combined oxygen-capacity and P/V heatmaps">
    <img src="/gas-transfer/wave-bag/capacity_power_maps.svg" alt="Six aligned heatmaps: oxygen-supply capacity at 40 percent DO in the top row and estimated P/V in the bottom row. Columns show 3, 4 and 5 L liquid fill, with rocking rate and angle on matching axes. Each row has its own units and color scale. White outlined baseline cells are at 24 rpm, plus or minus 7 degrees, and 4 L." width="2520" height="1332" loading="lazy" decoding="async" />
  </a>
  <figcaption><strong>Oxygen capacity and estimated P/V.</strong> The upper row shows capacity at 40% DO (million cells/mL); the lower row shows estimated P/V (W/m³). Columns show 3, 4 and 5 L fill in the same bag. Each row has its own color scale. White outlines mark the baseline: 24 rpm, ±7° and 4 L, with valid values of 5.87 million cells/mL and 27.41 W/m³. Capacity assumes 300 standard mL/min sweep, qO₂ 5.5 pmol/(cell day) and 37 °C. P/V is an uncalibrated cycle-average energy estimate. Each tile is an operating condition, not a position inside the bag.</figcaption>
</figure>

[Open the complete wave-bag study](/gas-transfer/wave-bag/index.html)

<details class="xdr-details">
  <summary>Sweep conditions, numeric P/V and model checks</summary>

<span id="changing-rocking-fill-and-gas-sweep" aria-hidden="true"></span>

The study contains 1,200 steady-state cases and 17 transient runs, varying rocking rate (17–31 rpm), angle (4–10°), liquid fill (3–5 L), sweep (50–1,000 standard mL/min) and cell density (2–20 million/mL). It uses one bag preset. The 75 mechanical conditions span estimated P/V of 5.04–93.88 W/m³.

All other parameters remain at the baseline. Values in the last column follow the same order as the listed settings.

| Parameter varied | Settings | Estimated P/V (W/m³) |
|---|---|---|
| Rocking rate (rpm) | 17, 20, 24, 28, 31 | 19.42, 22.85, 27.41, 31.98, 35.41 |
| Rocking angle (degrees, half-amplitude) | 4, 6, 7, 8, 10 | 8.89, 20.09, 27.41, 35.92, 56.33 |
| Liquid fill (L) | 3, 4, 5 | 36.51, 27.41, 21.93 |

Within this model, increasing fill at fixed bag geometry, rocking rate and angle reduces power per volume. The amount of liquid and its position both enter the potential-energy calculation. This fill trend does not determine the effect of changing nominal bag size; this study uses one 10 L bag.

All 17 trajectories conserve the separate liquid, headspace and combined species inventories within a maximum residual of $1.81\times10^{-15}$ mol in the saved study. This checks numerical bookkeeping; it does not validate the transfer coefficient or assumed bag geometry. Gas fractions use a dry basis, and standard flow refers to 0 °C and 101.325 kPa.

The source oxygen correlation covers 17–31 rpm, 4–10° and 3–5 L fill for the RM10 system. Numerical range coverage does not establish transferability to the Cellbag. CO₂ and N₂ coefficients are scaled from oxygen by diffusivity. CO₂ is modeled as the molecular species without carbonate buffering or pH, and the vent maintains prescribed pressure. No claim is made about sealed-bag pressure or compliance.

[Individual P/V sweep figure](/gas-transfer/wave-bag/ofat_power.svg) · [75 mechanical conditions (CSV)](/gas-transfer/wave-bag/power_conditions.csv) · [1,200 steady-state cases (CSV)](/gas-transfer/wave-bag/summary.csv)

</details>

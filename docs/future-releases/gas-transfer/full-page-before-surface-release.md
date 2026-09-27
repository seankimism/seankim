---
title: "Headspace gas transfer and composition tracking"
description: "Surface gas-transfer measurements across scales and headspace O2 and N2 tracking in ambr 250 and 2,000 L vessels, with shake-flask and wave-bag studies."
organization: "Independent project"
publishedDate: "2026-09-17"
period: "2026–present"
tags: ["Gas transfer", "kLa", "Headspace", "Scale-down", "Shake flasks", "Wave bioreactors"]
order: 2
draft: false
---

I built this model to understand how headspace gas exchange changes with reactor scale. I started with published surface-transfer measurements, then added O₂ and N₂ balances for fed-batch culture at ambr 250 and 2,000 L. The page also covers my shake-flask and wave-bag calculations.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#literature-review-headspace-and-surface-gas-transfer">Literature review</a></li>
    <li><a href="#surface-transfer-correlation-and-validation">Correlation model and validation</a></li>
    <li><a href="#headspace-gas-composition-tracking">Headspace O₂ and N₂ tracking</a></li>
    <li><a href="#shake-flask-power-and-oxygen-transfer">Shake-flask study</a></li>
    <li><a href="#wave-bioreactors-liquid-and-headspace-response">Wave-bag study</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</nav>

## Literature review: headspace and surface gas transfer

<span id="measured-surface-transfer-from-02-to-2000-l" aria-hidden="true"></span>

Bowers reported a fivefold decrease in surface O₂ transfer between 8 and 2,000 L <a href="#ref-1">[1]</a>. The smaller vessels in the studies below generally have higher coefficients, although their agitation, media and gas flows differ. I use this comparison to show the range of reported surface transfer across scales.

<figure class="xdr-figure">
  <a href="/gas-transfer/surface_kla_scale.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the surface transfer scale plot at full size">
    <img src="/gas-transfer/surface_kla_scale.svg" alt="Thirty-two reported surface oxygen-transfer conditions against working volume on logarithmic axes, spanning 13 mL to 2,000 L. Individual colored markers show seven source studies, with separate markers for the two ambr 15 fills. No range bars or Bowers connector are shown. A single gray dotted line slopes downward across the measurements as a visual guide. The legend spans four columns and two rows." width="2023" height="1276" loading="lazy" decoding="async" />
  </a>
  <figcaption>Surface oxygen transfer from 13 mL to 2,000 L. Points show reported conditions; some means overlap. The ambr 15 data are Nienow’s water measurements at 37 °C and 300–1,500 rpm <a href="#ref-2">[2]</a>; the ambr 250 point is Clark’s 215 mL, 300 rpm condition <a href="#ref-3">[3]</a>. The gray dotted line guides the eye across the measurements. CO₂ and de Lamotte data are omitted.</figcaption>
</figure>

The table lists the ambr measurements and four Bowers vessels. Bowers vessel names refer to nominal capacity. I read the Xu oxygen-transfer values and Anand’s area per volume from Anand’s Figure 6, so those values are approximate. Paired ambr 15 values are listed in 13 mL / 15 mL order.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Measured surface transfer coefficients for ambr 15, ambr 250 and the four Bowers vessel sizes" tabindex="0">

| Vessel | Tank dimensions | Agitation | Surface $k_La$, O₂ | Area per volume |
| --- | --- | --- | --- | --- |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 300 rpm | 2.60 / 2.05 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 700 rpm | 4.62 / 3.75 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 1,000 rpm | 6.07 / 4.61 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 1,200 rpm | 6.72 / 5.18 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 1,500 rpm | 7.51 / 6.06 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 250 · Clark <sup><a href="#ref-3">[3]</a></sup> | 0.0678 m | 300 rpm | 1.10 h⁻¹ | ≈16.8 m⁻¹ |
| ambr 250 · Xu / Anand <sup><a href="#ref-4">[4]</a>, <a href="#ref-5">[5]</a></sup> | 0.068 m | 200 rpm | ≈0.92 h⁻¹ | ≈12.4 m⁻¹ |
| ambr 250 · Xu / Anand <sup><a href="#ref-4">[4]</a>, <a href="#ref-5">[5]</a></sup> | 0.068 m | 400 rpm | ≈1.30 h⁻¹ | ≈12.4 m⁻¹ |
| ambr 250 · Xu / Anand <sup><a href="#ref-4">[4]</a>, <a href="#ref-5">[5]</a></sup> | 0.068 m | 600 rpm | ≈1.51 h⁻¹ | ≈12.4 m⁻¹ |
| 15 L · Bowers <sup><a href="#ref-1">[1]</a></sup> | 0.20 m | 90 rpm | 0.25 h⁻¹ | 3.93 m⁻¹ |
| 200 L · Bowers <sup><a href="#ref-1">[1]</a></sup> | 0.61 m | 30 rpm | 0.10 h⁻¹ | 1.83 m⁻¹ |
| 500 L · Bowers <sup><a href="#ref-1">[1]</a></sup> | 0.80 m | 27 rpm | 0.06 h⁻¹ | 1.20 m⁻¹ |
| 2,500 L · Bowers <sup><a href="#ref-1">[1]</a></sup> | 1.50 m | 17 rpm | 0.05 h⁻¹ | 0.88 m⁻¹ |

</div>

Surface $k_La$ generally increases as the reactor gets smaller, making headspace gas exchange more important at small scale. For similar vessel shapes, the free-surface area per liquid volume increases as size decreases; this raises $k_La$ when $k_L$ is comparable. That is why I include headspace composition and gas renewal when comparing oxygen supply and CO₂ removal across scales <a href="#ref-1">[1]</a>. The differences between these studies also reflect agitation, medium and gas flow.

<details class="xdr-details">
  <summary>Measurements, sources and comparison limits</summary>

Bowers used DMEM with 10% fetal calf serum and 0.05 vvm headspace air. O₂ coefficients came from dissolved-oxygen recovery after nitrogen sparging; CO₂ coefficients were inferred from pH slopes using carbonate equilibrium. I calculated A/V as $\pi T^2/(4V)$ at 8, 160, 420 and 2,000 L, assuming a flat circular surface. Vessel dimensions and fills are in Table 1, surface $k_La$ in Table 4, and agitation on p. 3 <a href="#ref-1">[1]</a>.

For ambr 15, I used Nienow’s water measurements at 37 °C without sparging, from the QG = 0 column of Table 2 <a href="#ref-2">[2]</a>. The 28 × 15 mm dimensions are the internal width and depth; the other vessels list diameter. A/V uses the gross planar area of 0.00042 m², with no correction for hardware or surface deformation. The manuscript also reports medium measurements with antifoam in Table 3, which I have kept separate. The water assay used static gassing out after a headspace air purge; a continuous overlay rate is not established. Flow is transitional, and the lower-speed P/V values extrapolate a constant measured power number below the electrical calibration range.

Clark’s ambr 250 condition uses 9 mL/min headspace air, down-pumping and no sparging. The measurement is in Table B.2 (p. 258), and the geometry table (p. 66) gives top and base diameters of 67.8 and 60 mm <a href="#ref-3">[3]</a>. I calculated A/V as $\pi T^2/(4V)$ using the top diameter and 215 mL fill, giving about 16.8 m⁻¹. This gross-area estimate does not correct for taper or hardware at the liquid surface.

Xu’s ambr 250 series uses 10 mL/min headspace air <a href="#ref-4">[4]</a>. I read the $k_La$ values from Anand’s Figure 6, which reproduces the Xu experiments <a href="#ref-5">[5]</a>. Anand’s Section 2.1 and Figures 1 and 6 give a 0.068 m free-surface diameter and about 12.4 m⁻¹ A/V for the CFD configuration. I have not verified that geometry for Xu’s original assay. The assay working volume is not reported in Anand’s reproduction, so I have not inferred it from the CFD geometry.

The following values were read from published figures:

- 0.3 L miniature bioreactor — approximately 1.33, 1.88 and 2.25 h⁻¹ at 300, 400 and 500 rpm in CD-CHO at 37 °C, with 200 mL/min headspace air (Al-Ramadhani 2015, Figure 3.9, p. 80 <a href="#ref-6">[6]</a>). These are digitized means of three replicates.
- 1 L stirred tank — approximately 0.31–1.33 h⁻¹ among selected figure means over 50–250 rpm in PBS at 37 °C, with headspace flows of 100–500 mL/min (Wyrobnik et al. 2025, Figure 3A <a href="#ref-7">[7]</a>).
- 5.4 L unbaffled Rushton — approximately 0.17 and 0.30 h⁻¹ at 100 and 200 rpm in water at 16 °C (Scargiali et al. 2013, Figure 4 <a href="#ref-8">[8]</a>). These are selected low-speed, near-flat-interface conditions; the study also reports higher transfer with a deeper vortex.
- 16.5 L dual Rushton (excluded) — approximately 0.14 h⁻¹ at 50 rpm, with 1.58 h⁻¹ reported in the text and Table 1 at 300 rpm (de Lamotte et al. 2017 <a href="#ref-9">[9]</a>). The source's figure and table differ at the upper endpoint, as noted below.

I included Xu’s measurements in the table but left them off the volume plot because the assay fill is not reported in Anand’s reproduction. Clark’s plotted volume comes from the experimental table. The Schlaich points cover selected up-pumping conditions at 60–90 rpm, 40 L and 10 L/min headspace flow.

Some studies report apparent coefficients from the overall nonsparged response. Differences in medium, temperature, impeller configuration and gas replacement make it difficult to separate geometry from operating conditions. I placed the dotted guide by fitting a straight line in log space to the displayed measurements, giving each paper equal total weight. It shows the overall pattern across these studies, not an isolated effect of volume.

I excluded the six de Lamotte conditions from the current plots and fit after seeing a consistent offset from the model. I kept the measurements in the source inventory. There is also a source discrepancy at 300 rpm: the text and Table 1 give 4.4 × 10⁻⁴ s⁻¹, or about 1.58 h⁻¹, while the Figure 3 marker is nearer 2.0 h⁻¹. That discrepancy alone does not explain the offset across the study.

Schlaich’s selected up-pumping measurements at 40 L were about 0.90–1.33 h⁻¹ <a href="#ref-10">[10]</a>, overlapping the 16.5 L results. The reported 0.57 m tank diameter gives a planar A/V of 6.4 m⁻¹ at 40 L, compared with about 2.3 m⁻¹ for the 16.5 L tank. This is one reason I use geometry at the working fill in the model, while keeping the differences in operating conditions in mind.

</details>

## Surface-transfer correlation and validation

I calculate surface $k_La$ from the liquid-side transfer velocity and free-surface area per liquid volume:

$$
k_La = C(\epsilon\nu)^{1/4}Sc^{-n}\frac{A}{V}, \qquad Sc=\frac{\nu}{D}.
$$

Here $\epsilon=P/(\rho V)$ is the mean energy dissipation, $\nu$ is kinematic viscosity, and $D$ is gas diffusivity. The transfer rate also depends on the gas–liquid driving force, $c^*-c$.

<span id="what-a-surface-model-requires" aria-hidden="true"></span>

<details class="xdr-details">
  <summary>Model inputs, coefficient sets and applicability</summary>

<div class="xdr-experiment-plan xdr-data-table xdr-input-table" role="region" aria-label="Inputs required by the surface transfer model and how well each is known" tabindex="0">

| Input | Meaning | Source | How well it is known |
| --- | --- | --- | --- |
| $A$, $V$ | Free-surface area at the working fill and the liquid volume beneath it | Vessel geometry at fill height | The flat circular area, or rectangular area for ambr 15, is an approximation. The real interface is deformed by the vortex and obstructed by the shaft, probes and dip tubes, none of which I subtract. |
| $\epsilon$ | Dissipation supplied to the correlation, W/kg | Vessel-mean $P/(\rho V)$ with an optional surface-to-mean multiplier | I use a multiplier of 1. Changing the dissipation basis also changes the meaning of the fitted coefficient. |
| $\nu$, $\rho$ | Kinematic viscosity and density at temperature | Water correlations, or measured medium values | Good for water; culture media are generally assumed water-like. |
| $D$ | Diffusivity of each gas, setting $Sc = \nu/D$ | Tabulated at 25 °C with Stokes–Einstein temperature scaling | Good for oxygen. CO₂ and N₂ scale from oxygen through the same Schmidt exponent and inherit its uncertainty. |
| $C$, $n$ | Model constant and Schmidt exponent | Calibration against measured surface transfer | I fit C while holding n at 2/3. |
| $c^*$, $c$ | Equilibrium and bulk dissolved-gas concentrations, setting the driving force $c^*-c$ | Henry's law at temperature and headspace partial pressure, plus the liquid concentration | Headspace composition can change with surface exchange, sparger exhaust and overlay flow. Molecular CO₂ must be distinguished from total dissolved inorganic carbon. |

</div>

<div class="xdr-experiment-plan xdr-data-table xdr-parameter-table" role="region" aria-label="Published constant and Schmidt exponent pairs for the surface renewal expression" tabindex="0">

| Set | $C$ | $n$ | Basis |
| --- | --- | --- | --- |
| Lamont & Scott (1970) <a href="#ref-11">[11]</a> | 0.4 | 1/2 | Eddy-cell model, expressed using near-interface dissipation |
| Kawase & Moo-Young (1990), Eq. 7 <a href="#ref-12">[12]</a> | 0.138 | 2/3 | Free-surface correlation using vessel-mean dissipation; Eq. 8 separately cites the 0.13 Calderbank–Moo-Young form |
| Combined literature fit | 0.1265 | 2/3 | Twenty-four conditions from four studies, including ambr 15; de Lamotte excluded; no power-range restriction and equal total weight per study |
| Current legacy default | 0.175 | 3/4 | Used in the earlier examples; I have not traced this pair to a published experiment |

</div>

I use vessel-mean dissipation and $n=2/3$ for the literature fit. The earlier vessel examples below still use $C=0.175$ and $n=3/4$. Their two synthetic test cases check the calculation, but I have not traced that pair to a published experiment.

Several inputs need approximations. The eight 1 L PBS measurements use water properties and the source’s water-power fit. I included all ten ambr 15 water measurements, both Scargiali water conditions and four Schlaich conditions through 90 rpm. I left out Schlaich’s 100 rpm point because headspace mixing remains uncertain there. The ambr 250 assays lack matched model inputs, and no 2,000 L measurement enters the fit. Bowers prints a power input of 2.5 mW/m³, which I have left unresolved rather than correcting without evidence.

The model does not yet check for low turbulence or gas entrainment. The transitional ambr 15 conditions remain in the fit.

I give each study equal total weight and minimize squared errors in log $k_La$. I calculate RMSE, $R^2$, Pearson r and p in the original $k_La$ units; $R^2$ is $1-\mathrm{SSE}/\mathrm{SST}$. The p values are nominal because conditions from the same study are not independent replicates.

</details>

<span id="validation-status-and-gas-balance-checks" aria-hidden="true"></span>

### Literature parity and validation status

I fitted one coefficient to 24 conditions from four studies, with no P/V cutoff. With $n=2/3$, the fit gives $C=0.1265$, RMSE 0.608 h⁻¹ and $R^2=0.929$. The model tends to underpredict Schlaich and overpredict ambr 15. I still need measurements to test it at 2,000 L and in culture media.

I removed the six de Lamotte conditions <a href="#ref-9">[9]</a> after reviewing their consistent offset from the model. This was a choice made after looking at the results, so the fit and holdout scores describe the four studies I kept.

The fit includes ten ambr 15 water measurements, eight 1 L PBS measurements, two 5.4 L water measurements and four 40 L water measurements. Their reported or reconstructed P/V ranges from 0.31 to 483 W/m³. [Download the inputs and predictions](/gas-transfer/surface_kla_combined_parity.csv).

<figure class="xdr-figure">
  <a href="/gas-transfer/surface_kla_global_expanded_fit.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the surface-transfer literature calibration parity plot">
    <img src="/gas-transfer/surface_kla_global_expanded_fit.svg" alt="Global calibration parity plot for 24 conditions from four studies on shared logarithmic axes, excluding de Lamotte. Filled markers distinguish studies, including all ten ambr 15 water conditions. One coefficient, C equals 0.1265, is fitted without a power-range restriction." width="1584" height="1584" loading="lazy" decoding="async" />
  </a>
  <figcaption>Predicted and measured surface oxygen transfer for ambr 15 <a href="#ref-2">[2]</a>, 1 L <a href="#ref-7">[7]</a>, 5.4 L <a href="#ref-8">[8]</a> and 40 L <a href="#ref-10">[10]</a>.</figcaption>
</figure>

<details class="xdr-details">
  <summary>Literature parity with each study held out of calibration</summary>

I also refitted the model four times, leaving out one study each time and predicting its measurements from the other three. Both ambr 15 fills stay together. This gives RMSE 0.788 h⁻¹ and $R^2=0.881$. It checks transfer between the retained studies; it does not independently test my decision to exclude de Lamotte.

<figure class="xdr-figure">
  <a href="/gas-transfer/surface_kla_global_expanded_holdout.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the surface-transfer study-holdout parity plot">
    <img src="/gas-transfer/surface_kla_global_expanded_holdout.svg" alt="Study-holdout parity plot for 24 retained conditions across four folds. Each entire study is excluded in turn and its conditions are predicted using a coefficient fitted to the other three studies. Both ambr 15 fills are held out together; de Lamotte is excluded throughout." width="1584" height="1584" loading="lazy" decoding="async" />
  </a>
  <figcaption>Predictions with each study left out of the fit. Marker colors and shapes match the plot above.</figcaption>
</figure>

</details>

<span id="what-the-difference-does-to-a-scale-down-model" aria-hidden="true"></span>

<details class="xdr-details">
  <summary>Illustrative scale comparison: geometry and surface supply</summary>

For this earlier scale comparison, I used $C=0.175$, $n=3/4$, water at 37 °C and no sparging. Air composition is fixed at 101.325 kPa, with a surface-to-mean dissipation ratio of 1. These examples have not been recalculated with the literature fit.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Modeled surface transfer at each end of the vessel chain" tabindex="0">

| Vessel | Fill | Speed | $P/V$ | Liquid height | Area per volume | Surface $k_La$ |
| --- | --- | --- | --- | --- | --- | --- |
| Sartorius ambr 250 | 0.2 L | 600 rpm | 79.1 W/m³ | 0.072 m | 15.0 m⁻¹ | 2.33 h⁻¹ |
| Applikon 3 L glass | 2 L | 200 rpm | 18.6 W/m³ | 0.157 m | 6.6 m⁻¹ | 0.72 h⁻¹ |
| Xcellerex XDR-2000 | 2,000 L | 100 rpm | 15.3 W/m³ | 1.801 m | 0.58 m⁻¹ | 0.060 h⁻¹ |

</div>

<span id="separating-transfer-velocity-from-geometry" aria-hidden="true"></span>

Surface $k_La$ is 38.7 times higher in the ambr example than in the XDR: A/V accounts for a factor of 25.7 and transfer velocity for a factor of 1.51. At 20 million cells/mL and SOUR 5.5 pmol/(cell day), surface transfer at 40% DO supplies about 6.5% of oxygen demand in the ambr and 0.17% in the XDR. The sparger would need to supply the rest.

- ambr 250: 200 mL, 600 rpm, two 26 mm impellers and a vessel-total power number of 1.34, applied once. The vessel profile is an equivalent, capacity-fitted geometry rather than a reconstruction of the cited assays.
- Applikon 3 L: 2 L, 200 rpm, one 60 mm impeller and an assumed power number of 1.3. This power number is an input assumption, not a manufacturer measurement.
- XDR-2000: 2,000 L, 100 rpm, one 420 mm impeller and a power number of 0.51.

I use a dry-air oxygen fraction of 0.2095 and subtract water-vapour pressure at 37 °C. Headspace composition is fixed in this comparison, so finite overlay flow and headspace oxygen depletion are not included. The projected surface areas also leave out waves and hardware obstruction.

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

The numerical O₂ result differs from the analytical solution by less than 0.000001 percentage points at both scales. Across 38 fed-batch scenarios, the largest species-balance residual is 2.91 × 10⁻¹⁰ mol. I also checked zero demand, zero gas flow, the fixed-air supply floor and conservation of the inert air remainder. I have not yet compared these trajectories with measured headspace composition.

<figure class="xdr-figure">
  <a href="/gas-transfer/tracking/balance_verification.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the analytical headspace balance check at full size">
    <img src="/gas-transfer/tracking/balance_verification.svg" alt="Numerical oxygen fractions shown as open circles follow analytical exponential curves at 200 mL and 2,000 L. Both approach the same oxygen fraction with different response times." width="1378" height="738" loading="lazy" decoding="async" />
  </a>
  <figcaption>Lines show the analytical solution and circles the numerical result, starting from air. VCD is fixed at 20 million cells/mL, SOUR at 5.5 pmol/(cell day), and sparger oxygen utilisation at 50%. Air sparge and overlay are each 0.005 vvm; pure O₂ supplies the remainder. At 35.5 °C and 101.325 kPa, headspaces of 0.150 and 970.33 L give response times of 58.69 and 37.97 minutes.</figcaption>
</figure>

</details>

## Headspace gas composition tracking

For the fed-batch example, I use a 14-day VCD profile and assume SOUR is 5.5 pmol/(cell day). I interpolated the standard-feed spin-tube measurements from Dahodwala et al., Figure 1B and Supplemental File 4 <a href="#ref-13">[13]</a>, and apply the same profile at both scales.

Air sparge and overlay are each 1 mL/min at 200 mL and 10 L/min at 2,000 L, or 0.005 vvm per stream. Changing the assumed oxygen utilisation changes the pure O₂ feed and the oxygen left in the bubbles. This balance assumes the culture receives its oxygen demand; it does not calculate liquid DO or check whether gas transfer can supply that demand.

<span id="adjust-utilisation-at-each-scale" aria-hidden="true"></span>

<figure class="xdr-explorer">
  <iframe src="/gas-transfer/tracking/index.html" title="Interactive headspace O2 and N2 tracking with independent oxygen-utilisation controls for ambr250 and 2,000 L" width="900" height="1350" loading="lazy" data-content-height></iframe>
  <figcaption>Use the sliders to change oxygen utilisation at each scale and follow headspace composition through the culture. Both scales start at an assumed utilisation of 50%.</figcaption>
</figure>

[Open the explorer at full size](/gas-transfer/tracking/index.html)

<span id="from-oxygen-demand-to-gas-composition" aria-hidden="true"></span>

<details class="xdr-details">
  <summary>How utilisation sets O₂ feed and bubble carryover</summary>

Utilisation $\eta$ is the fraction of the total sparger O₂ consumed by the culture, including O₂ supplied by sparger air. It does not include overlay oxygen. Uptake is $U=Xq_{O_2}V_L$. Let $F_a$ be sparger air, $F_p$ supplemental pure O₂, and $F_{b,O_2}$ oxygen carried from bubbles into the headspace, all in mol/time:

$$
F_p=\max\!\left(\frac{U}{\eta}-0.2095F_a,\;0\right),
$$

$$
F_{b,O_2}=0.2095F_a+F_p-U.
$$

At low demand, the fixed air stream can supply enough oxygen on its own. Pure O₂ feed then stays at zero, and actual utilisation is lower than the slider setting. Once pure O₂ is needed, lowering utilisation increases both its feed rate and the oxygen carried into the headspace.

</details>

<span id="limitations-and-next-steps" aria-hidden="true"></span>

My next step is to compare these O₂/N₂ trajectories with measured exhaust composition and estimate utilisation from an inlet–outlet oxygen balance.


## Shake-flask power and oxygen transfer

I screened 50 mL–3 L shake flasks across fill volume, orbital diameter and shaking speed. The power calculations still need work: the baffled-flask relation is not specific to the assumed geometry, and the unbaffled orbital-range checks are incomplete. I would not use these power estimates for scale-up yet.

[Archived 720-case study](/gas-transfer/shake-flask/index.html) · [Results and applicability notes (CSV)](/gas-transfer/shake-flask/summary.csv)

<details class="xdr-details">
  <summary>Study scope and correlation coverage</summary>

The screen covers 720 conditions: eight nominal sizes from 50 mL to 3 L, baffled and unbaffled, 19/25/50 mm throws, 100–300 rpm and 10/20/30% fills at 37 °C. I scaled the dimensions by geometric similarity. The selected correlations provide 396 $k_La$ estimates; the other 324 conditions fall outside their coverage.

<span id="using-rcf-and-pv-for-scale-up" aria-hidden="true"></span>

RCF and orbital diameter determine rpm. To estimate P/V, I also need the fill, flask geometry and a suitable power correlation. Matching P/V alone does not guarantee the same oxygen transfer or local stress.

- Unbaffled power: I use the Büchs correlation for conventional flasks moving in phase with the shaker, as described by Dinter et al. <a href="#ref-14">[14]</a>. Conditions outside its size and flow-regime limits are flagged as extrapolations.
- Baffled power: the screening relation comes from a published power estimate, with no direct power measurement or explicit flask-diameter or orbit term <a href="#ref-15">[15]</a>. Its size trend at fixed percentage fill comes entirely from working volume. I need geometry-specific calibration before using it for scale-up.
- Unbaffled oxygen transfer: Meier’s correlation covers 100–450 rpm, 12.5–100 mm orbit, 51–131 mm flask diameter and 2–160 mL fill <a href="#ref-16">[16]</a>. I flag extrapolations and convert oxygen-transfer capacity to $k_La$ using the gas conditions and oxygen solubility.
- Baffled oxygen transfer: Schiefelbein’s response surfaces cover a disposable-flask family at 125–500 mL nominal size, 50 mm orbit, 50–250 rpm, 10–40% fill and 30–37 °C <a href="#ref-17">[17]</a>. I keep the calculations within those limits, although applying them to my generic geometry still needs calibration.

I hold interfacial gas composition fixed in the flask calculations. Closure resistance, changing headspace composition and liquid DO histories are not included.

</details>

## Wave bioreactors: liquid and headspace response

For the wave-bag model, I track dissolved O₂, molecular CO₂ and N₂ together with the headspace. I use Piontek’s transfer correlation, measured on Biostat RM bags in PBS with Pluronic, with an assumed Cellbag geometry <a href="#ref-18">[18]</a>. That geometry change still needs validation. Liquid volume, temperature, pressure and cellular demand stay fixed, with no DO controller.

<span id="following-the-headspace-composition" aria-hidden="true"></span>

<figure class="xdr-figure">
  <a href="/gas-transfer/wave-bag/transient_comparison.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the wave-bag dissolved oxygen and headspace comparison at full size">
    <img src="/gas-transfer/wave-bag/transient_comparison.svg" alt="Dissolved oxygen and headspace oxygen and carbon dioxide changes for a 4 L rocking-bag example at 2 and 20 million cells per mL. The baseline approaches 79.55 percent air saturation over 120 minutes; the higher-demand case reaches oxygen depletion at 3.92 minutes. The two columns use different time scales." width="2124" height="1134" loading="lazy" decoding="async" />
  </a>
  <figcaption>A 10 L Cellbag preset at 4 L fill, 24 rpm, ±7°, 37 °C and 300 standard mL/min sweep (20.95% O₂, 5% CO₂, balance N₂). I use kLa 11.11 h⁻¹, SOUR 5.5 pmol/(cell day) and respiratory quotient 1. At 2 million cells/mL (left), DO reaches 79.55% after 120 minutes. At 20 million cells/mL (right), oxygen runs out at 3.92 minutes while headspace O₂ is still 20.81%; the calculation stops there. Lower panels show changes in dry headspace fractions. The columns use different time windows.</figcaption>
</figure>

<span id="estimated-power-per-liquid-volume" aria-hidden="true"></span>

The maps below compare oxygen-supply capacity with estimated cycle-average P/V. I calculate power separately from $k_La$, using a rectangular bag approximation and assuming the available potential energy dissipates each half-cycle. This estimate is uncalibrated and does not resolve wave shape, resonance or peak power.

<figure class="xdr-figure" id="wave-capacity-power-comparison">
  <a href="/gas-transfer/wave-bag/capacity_power_maps.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the combined oxygen-capacity and P/V heatmaps">
    <img src="/gas-transfer/wave-bag/capacity_power_maps.svg" alt="Six aligned heatmaps: oxygen-supply capacity at 40 percent DO in the top row and estimated P/V in the bottom row. Columns show 3, 4 and 5 L liquid fill, with rocking rate and angle on matching axes. Each row has its own units and color scale. White outlined baseline cells are at 24 rpm, plus or minus 7 degrees, and 4 L." width="2520" height="1332" loading="lazy" decoding="async" />
  </a>
  <figcaption>Oxygen-supply capacity at 40% DO is shown above estimated P/V, for 3, 4 and 5 L fill. Each row has its own color scale. White outlines mark the 24 rpm, ±7°, 4 L baseline: 5.87 million cells/mL and 27.41 W/m³. Capacity assumes 300 standard mL/min sweep, qO₂ 5.5 pmol/(cell day) and 37 °C. P/V remains an uncalibrated energy estimate.</figcaption>
</figure>

[Open the complete wave-bag study](/gas-transfer/wave-bag/index.html)

<details class="xdr-details">
  <summary>Sweep conditions, numeric P/V and model checks</summary>

<span id="changing-rocking-fill-and-gas-sweep" aria-hidden="true"></span>

I ran 1,200 steady-state cases and 17 transient cases for one bag preset, varying rocking rate (17–31 rpm), angle (4–10°), fill (3–5 L), sweep (50–1,000 standard mL/min) and cell density (2–20 million/mL). The 75 mechanical conditions span estimated P/V of 5.04–93.88 W/m³.

The table varies one parameter at a time, with the others at baseline. P/V values follow the order of the listed settings.

| Parameter varied | Settings | Estimated P/V (W/m³) |
|---|---|---|
| Rocking rate (rpm) | 17, 20, 24, 28, 31 | 19.42, 22.85, 27.41, 31.98, 35.41 |
| Rocking angle (degrees, half-amplitude) | 4, 6, 7, 8, 10 | 8.89, 20.09, 27.41, 35.92, 56.33 |
| Liquid fill (L) | 3, 4, 5 | 36.51, 27.41, 21.93 |

At fixed bag geometry, rocking rate and angle, increasing fill lowers the estimated P/V. Both the amount of liquid and its position enter the potential-energy calculation. These results cover one 10 L bag, so they do not show how nominal bag size changes power.

The largest liquid, headspace or combined species-balance residual across the 17 runs is $1.81\times10^{-15}$ mol. This checks the mass balances; I still need measurements to validate transfer and geometry. Gas fractions are on a dry basis, and standard flow refers to 0 °C and 101.325 kPa.

The oxygen correlation covers 17–31 rpm, 4–10° and 3–5 L fill for the RM10 system. Staying inside those ranges does not verify its use with the Cellbag geometry. I scale CO₂ and N₂ transfer from oxygen by diffusivity. CO₂ is molecular only, with no carbonate buffering or pH calculation. The vent holds pressure fixed; sealed-bag pressure and compliance are outside this model.

[Individual P/V sweep figure](/gas-transfer/wave-bag/ofat_power.svg) · [75 mechanical conditions (CSV)](/gas-transfer/wave-bag/power_conditions.csv) · [1,200 steady-state cases (CSV)](/gas-transfer/wave-bag/summary.csv)

</details>

## References

<ol class="project-references">
  <li id="ref-1"><span id="surface-table-ref-5" aria-hidden="true"></span>Bowers, J. S. (2008). <a href="https://skoge.folk.ntnu.no/prost/proceedings/aiche-2008/data/papers/P118781.pdf">Sparger and Surface Gas Transfer for Cell Culture Bioreactors</a>. 2008 AIChE Annual Meeting, paper P118781. Tables 1 and 4; agitation on p. 3.</li>
  <li id="ref-2"><span id="surface-table-ref-1" aria-hidden="true"></span>Nienow et al. (2013). <a href="https://repository.lboro.ac.uk/articles/journal_contribution/The_physical_characterisation_of_a_microscale_parallel_bioreactor_platform_with_an_industrial_CHO_cell_line_expressing_an_IgG4/9244370">The physical characterisation of a microscale parallel bioreactor platform with an industrial CHO cell line expressing an IgG4</a>. Biochemical Engineering Journal, 76, 25–36. Author manuscript, Table 2 and Figure 1.</li>
  <li id="ref-3"><span id="surface-table-ref-2" aria-hidden="true"></span>Clark, C. E. (2020). <a href="https://discovery.ucl.ac.uk/10111802/2/Clark_10111802_Thesis.pdf">Characterization and Scalability Assessment of a Parallel Single-Use Bioreactor System for Mammalian Cell Culture</a>. PhD thesis, University College London. Table B.2, p. 258; geometry table, p. 66.</li>
  <li id="ref-4"><span id="surface-table-ref-3" aria-hidden="true"></span>Xu et al. (2017). <a href="https://doi.org/10.1002/btpr.2417">Characterization of TAP Ambr 250 disposable bioreactors, as a reliable scale-down model for biologics process development</a>. Biotechnology Progress, 33, 478–489. Experimental values read from their reproduction in Anand et al. <a href="#ref-5">[5]</a>, Figure 6.</li>
  <li id="ref-5"><span id="surface-table-ref-4" aria-hidden="true"></span>Anand et al. (2024). <a href="https://doi.org/10.1016/j.jbiotec.2024.04.013">An in-silico analysis of hydrodynamics and gas mass transfer characteristics in scale-down models for mammalian cell cultures</a>. Journal of Biotechnology, 388, 96–106. Section 2.1 and Figures 1 and 6.</li>
  <li id="ref-6">Al-Ramadhani, O. (2015). <a href="https://discovery.ucl.ac.uk/id/eprint/1460929/2/Al-Ramadhani_Omar_Thesis_Copyright_Removed.pdf">Design and characterisation of a parallel miniaturised bioreactor system for mammalian cell culture</a>. Doctor of Engineering thesis, University College London. Figure 3.9, p. 80.</li>
  <li id="ref-7">Wyrobnik et al. (2025). <a href="https://doi.org/10.1002/bit.70025">Scalable, High-Density Expansion of Human Mesenchymal Stem Cells on Microcarriers Using the Bach Impeller in Stirred-Tank Reactors</a>. Biotechnology and Bioengineering, 122(10), 2803–2818. Figure 3A.</li>
  <li id="ref-8">Scargiali, F., Busciglio, A., Grisafi, F., &amp; Brucato, A. (2013). <a href="https://www.aidic.it/cet/13/32/248.pdf">Influence of Viscosity on Mass Transfer Performance of Unbaffled Stirred Vessels</a>. Chemical Engineering Transactions, 32, 1483–1488. Figure 4.</li>
  <li id="ref-9">de Lamotte, A., Delafosse, A., Calvo, S., Delvigne, F., &amp; Toye, D. (2017). <a href="https://discovery.ucl.ac.uk/10064111/1/Manuscript_pdf.pdf">Investigating the effects of hydrodynamics and mixing on mass transfer through the free-surface in stirred tank bioreactors</a>. Chemical Engineering Science, 172, 125–142. Table 1 and Figure 3.</li>
  <li id="ref-10">Schlaich et al. (2023). <a href="https://doi.org/10.1002/btpr.3330">Experimental and computational characterization of mass transfer in high turndown bioreactors</a>. Biotechnology Progress, 39(3), e3330. Figure 5.</li>
  <li id="ref-11">Lamont, J. C., &amp; Scott, D. S. (1970). <a href="https://doi.org/10.1002/aic.690160403">An eddy cell model of mass transfer into the surface of a turbulent liquid</a>. AIChE Journal, 16, 513–519.</li>
  <li id="ref-12">Kawase, Y., &amp; Moo-Young, M. (1990). <a href="https://www.researchgate.net/publication/280002515_Mass_transfer_at_a_free_surface_in_stirred_tank_bioreactors">Mass transfer at a free surface in stirred tank bioreactors</a>. Chemical Engineering Research and Design, 68(2), 189–194. Equation 7; author-uploaded paper.</li>
  <li id="ref-13">Dahodwala et al. (2025). <a href="https://doi.org/10.1002/biot.70012">Development and Characterization of the NISTCHO Reference Cell Line</a>. Figure 1B and Supplemental File 4; standard-feed spin-tube measurements.</li>
  <li id="ref-14">Dinter et al. (2025). <a href="https://doi.org/10.1002/bit.28892">Exploration of the Out-of-Phase Phenomenon in Shake Flasks by CFD Calculations of Volumetric Power Input, kLa Value and Shear Rate at Elevated Viscosity</a>. Biotechnology and Bioengineering, 122(3), 509–524.</li>
  <li id="ref-15">Martínez-Hernández et al. (2020). <a href="https://doi.org/10.24275/rmiq/Bio725">Fed-batch cultivation and operational conditions for the production of a recombinant anti-amoebic vaccine in Pichia pastoris system</a>. Revista Mexicana de Ingeniería Química, 19(2), 691–705.</li>
  <li id="ref-16">Meier et al. (2016). <a href="https://doi.org/10.1016/j.bej.2016.01.014">Correlation for the maximum oxygen transfer capacity in shake flasks for a wide range of operating conditions and for different culture media</a>. Biochemical Engineering Journal, 109, 228–235.</li>
  <li id="ref-17">Schiefelbein et al. (2013). <a href="https://doi.org/10.1007/s10529-013-1203-9">Oxygen supply in disposable shake-flasks: prediction of oxygen transfer rate, oxygen saturation and maximum cell concentration during aerobic growth</a>. Biotechnology Letters, 35(8), 1223–1230. Supplementary calculator.</li>
  <li id="ref-18">Piontek et al. (2026). <a href="https://www.frontiersin.org/journals/bioengineering-and-biotechnology/articles/10.3389/fbioe.2025.1688774/full">Modeling and validating of oxygen transport in wave bioreactors: optimized experimental mass transfer method and novel Lattice-Boltzmann CFD approach</a>. Frontiers in Bioengineering and Biotechnology, 13, 1688774. Published January 2026; the DOI and volume carry 2025.</li>
</ol>

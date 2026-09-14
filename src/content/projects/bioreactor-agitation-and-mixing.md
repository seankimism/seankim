---
title: "Bioreactor agitation and mixing"
description: "Agitation and mixing calibration, spatial heating, mesh sensitivity and temperature recovery during feeding across cell-culture bioreactors."
organization: "Independent project"
period: "2026-present"
tags: ["Agitation", "Mixing time", "Heat transfer", "Scale-up"]
order: 0
draft: false
---

Agitation influences the distribution of feed additions and heat within a bioreactor. However, matching rotational speed across scales does not preserve power per volume, tip speed or mixing time. I compared these quantities across cell-culture vessels and calibrated a mixing-time correlation using literature data. I then used the bulk mixing time as an input to a separate heat-transfer model with spatially distributed liquid temperatures. The thermal studies examine heating, mesh resolution, temperature control and top feeding in the ambr 250, a 3 L glass vessel and the XDR-2000.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#power-per-volume-and-other-agitation-metrics">P/V and agitation metrics</a></li>
    <li><a href="#literature-mixing-data">Literature mixing data</a></li>
    <li><a href="#mixing-time-with-vessel-specific-circulation-factors">Vessel-specific mixing model</a></li>
    <li><a href="#comparison-with-a-global-circulation-factor">Global-factor comparison</a></li>
    <li><a href="#applying-bulk-mixing-time-to-liquid-cells">Bulk mixing within the liquid mesh</a></li>
    <li><a href="#heating-with-and-without-agitation">Heating across vessels</a></li>
    <li><a href="#mesh-size-accuracy-and-calculation-time">Mesh size and calculation time</a></li>
    <li><a href="#temperature-control-and-local-gradients">Temperature control</a></li>
    <li><a href="#feeding-and-changing-liquid-volume">Continuous and bolus feeds</a></li>
    <li><a href="#the-original-well-mixed-baseline">Original well-mixed baseline</a></li>
    <li><a href="#conclusion-and-next-steps">Conclusion and next steps</a></li>
    <li><a href="#validation-and-animation-gallery">Validation and animation gallery</a></li>
  </ol>
</nav>

## Power per volume and other agitation metrics

Power input depends on impeller size and speed, fluid density, and a power number specific to the installed configuration. I calculated power per volume alongside tip speed, Reynolds number, and dissipation scales for each vessel. [Kaiser et al. (2017)](https://doi.org/10.1002/elsc.201600096) describe experimental power-number measurements in conventional and single-use bioreactors and their dependence on Reynolds number.

<div class="xdr-experiment-plan" role="region" aria-label="Agitation quantities and their calculation" tabindex="0">

| Quantity | Relation | Definition |
| --- | --- | --- |
| Power input, $P$ | $N_p\rho N^3D^5$ | Mechanical power delivered to the liquid, in W. |
| Power per volume, $P/V$ | $P/V$ | Power per unit liquid volume, in W/m³. |
| Tip speed | $\pi ND$ | Blade-tip velocity, in m/s. |
| Impeller Reynolds number, $Re$ | $\rho ND^2/\mu$ | Ratio of inertial to viscous effects. |
| Mean dissipation rate, $\bar\epsilon$ | $P/(\rho V)$ | Power per unit liquid mass, in W/kg. |
| Kolmogorov length, $\eta$ | $(\nu^3/\bar\epsilon)^{1/4}$ | A characteristic smallest turbulent length based on mean dissipation. |

</div>

Here, $N$ is revolutions per second, $D$ is impeller diameter, $V$ is liquid volume, $\rho$ is density, $\mu$ is dynamic viscosity and $\nu=\mu/\rho$. The power number, $N_p$, depends on whether it describes one impeller or the complete installed set. I used a value representing the complete set in these calculations.

For fixed geometry, density and power number, doubling speed increases power eightfold and tip speed twofold. Consequently, matching P/V across scales does not generally preserve tip speed or mixing time. Use of a constant power number also depends on its applicability to the flow regime and vessel configuration examined.

<span id="where-the-mixing-values-come-from"></span>

## Literature mixing data

I compared predicted mixing times with the literature values listed below. The reported ranges cover the selected operating conditions.

<div class="xdr-experiment-plan" role="region" aria-label="Sources and numerical values used in the mixing parity plots" tabindex="0">

| Dataset | Source and exact location | Selected mixing times |
| --- | --- | --- |
| XDR-200 (1 point) | [Cytiva 29268546AA, Figure 3, p. 2](https://cdn.cytivalifesciences.com/api/public/content/digi-18518-original) | 28 s |
| XDR-500 (4 points) | [Cytiva KA4969250918AN, Figure 3, p. 3](https://cdn.cytivalifesciences.com/api/public/content/digi-18411-original) | 20-48 s |
| XDR-1000 (4 points) | [Cytiva 29242384AA, Figure 3, p. 3](https://cdn.cytivalifesciences.com/api/public/content/digi-18517-pdf) | 42-80 s |
| XDR-2000 (3 points) | [Cytiva 29243481AB, Figure 3, p. 3](https://cdn.cytivalifesciences.com/api/public/content/digi-18410-pdf) | 28-38 s |
| Biostat STR 50-2000 (10 points) | [Dreher et al. (2013), Figure 1b; power in Figure 1a](https://doi.org/10.1186/1753-6561-7-S6-P55) | 8-32 s |
| UniVessel SU 2 L (1 point) | [Barth et al. (2026), Table 2, automated SU measurements](https://doi.org/10.1007/s00253-026-13931-w) | 5.39 s at 1.0 m/s (mean of 24 measurements) |
| UniVessel SU 2 L (1 point) | [De Wilde et al. (2014), Figure 5 and accompanying text](https://www.bioprocessintl.com/single-use/superior-scalability-of-single-use-bioreactors) | 7 s at 0.6 m/s |
| ambr 250 (1 derived value) | [Miranda et al. (2026), section 3.4, Figure 5f, pp. 604–605](https://doi.org/10.1016/j.cherd.2026.01.030) | 4.12 s at 550 rpm, derived from $N t_m = 37.75$ |

</div>

For ambr, I used the installed-pair $N_p=1.34$ ([Sartorius patent, Example 3](https://patents.google.com/patent/US20230399705A1/en)), $N t_m=37.75$, tank diameter 61 mm, impeller diameter 26 mm and liquid-height ratio 1.41 ([Miranda et al., 2026, sections 2.1 and 3.4](https://doi.org/10.1016/j.cherd.2026.01.030)). These inputs give $N t_{95,GN}=30.83$ and $f_c=1.2245$. Pairing the manufacturer power number with the separate down-pumping mixing plateau for a baffled vessel without probe or sparger is a cross-source approximation; the two values were not measured together.

I selected conditions with P/V = 10–100 W/m³ and tip speed ≤ 3 m/s, using reported chart power for STR and calculated power for the other vessels. The derived ambr mixing time at 300 rpm is 7.55 s. Its calculated P/V of 7.96 W/m³ falls below the selection range, so this value was excluded from both parity plots. The retained 4.12 s value was derived from the reported plateau rather than measured independently. Miranda et al. also identify a limitation of the colorimetric method near mixing times below 5 s.

For the other datasets, I calculated mixing numbers as $(\mathrm{rpm}/60)t_{95}$. I used $N_p$ = 0.90, 0.97, 0.89 and 0.51 for XDR-200, XDR-500, XDR-1000 and XDR-2000 (Cytiva, manufacturer-provided inputs, 2024). The public [XDR-500](https://cdn.cytivalifesciences.com/api/public/content/digi-18411-original) and [XDR-1000](https://cdn.cytivalifesciences.com/api/public/content/digi-18517-pdf) characterization notes report approximate plateaus of 0.98 and 0.9, respectively.

XDR tank diameters follow [EP2663629B1, Table 1](https://patents.google.com/patent/EP2663629B1/en); impeller diameters use the XDR-500 and XDR-1000 application-note methods and rounded patent dimensions for XDR-200 and XDR-2000. I used $N_p=1.3$ for the Biostat STR and UniVessel SU impeller pair ([De Wilde et al., 2014](https://www.bioprocessintl.com/single-use/superior-scalability-of-single-use-bioreactors)). The scaled STR geometry and effective cylindrical UniVessel geometry remain approximations.

## Mixing time with vessel-specific circulation factors

I fitted a separate circulation factor for each bioreactor using a common mixing-time correlation. Each factor scales the predicted mixing time while retaining its dependence on speed, power number and geometry. The resulting calibration is specific to the vessel design and the conditions represented in the source data.

$$
t_{95}=f_{c,v}\frac{5.2}{N}\left(\frac{T}{D}\right)^2\left(\frac{H}{T}\right)^{1/2}N_p^{-1/3}
$$

Here, $f_{c,v}$ is the circulation factor for vessel $v$, $N$ is revolutions per second, $T$ is tank diameter, $D$ is impeller diameter, $H$ is liquid height and $N_p$ describes the complete installed impeller set. This height form is reproduced in [Taylor-Pashow et al. (2017), section 2.2, equation 1, printed p. 6](https://sti.srs.gov/fulltext/SRNL-STI-2017-00322.pdf#page=16), with historical attribution to [Grenville and Nienow, chapter 9](https://doi.org/10.1002/0471451452.ch9). Applying it to tall, unbaffled, or multiple-impeller cell-culture vessels is an approximation.

For each vessel, I calculated the factor as the geometric mean of the literature-to-baseline mixing-time ratios. This minimizes squared log residuals with equal weight assigned to each plotted value. The two UniVessel source series share one factor, while the ambr calibration represents one reported mixing-number plateau. I held the resulting 11 factors fixed in subsequent calculations.

<figure class="xdr-figure">
  <a href="/mixing/vessel_specific_circulation_factor_parity.svg?v=39fbecf5be47" target="_blank" rel="noopener noreferrer" aria-label="Open the vessel-specific circulation-factor parity plot at full size">
    <img src="/mixing/vessel_specific_circulation_factor_parity.svg?v=39fbecf5be47" alt="Literature versus predicted mixing time with separate circulation factors for 11 vessels. The axes, vessel markers, compact legend with plotted-point counts, and 1:1 parity line are consistent across both parity plots. R-squared, Pearson r, p and RMSE appear in that order in the upper-left corner. Values below 0.01 are shown as p less than 0.01." width="1872" height="2112" loading="lazy" decoding="async" />
  </a>
  <figcaption>Literature versus predicted mixing time using a separate circulation factor for each vessel: 25 values from 11 vessels selected at reported or calculated P/V = 10-100 W/m<sup>3</sup> and tip speed &le; 3 m/s. STR selection uses reported chart power. The solid line marks 1:1 parity and shading marks 0.8 &le; literature/prediction &le; 1.2; above the line, predictions are too short. Fitted f<sub>c</sub> values are XDR-200: 1.96; XDR-500: 1.56; XDR-1000: 2.39; XDR-2000: 1.12; Biostat STR 50: 0.99; STR 200: 0.75; STR 500: 0.64; STR 1000: 0.80; STR 2000: 0.63; UniVessel SU: 0.92; ambr 250: 1.22. The open pentagon is the ambr 250 value derived from a reported plateau. <a href="/mixing/vessel_specific_circulation_factor_parity.png?v=ae1ba2752b7f" download>Download PNG</a>.</figcaption>
</figure>

The vessel-specific model gave R² = 0.917, RMSE = 5.5 s and mean absolute percentage error = 8.9% for the 25 calibration values. Fitted factors ranged from 0.63 to 2.39. This variation may reflect limitations of the correlation and assumed geometry, together with differences in measurement methods and chart readings. Independent tracer measurements are required to determine how well these factors predict mixing time beyond the calibration conditions.

<span id="what-changes-with-one-global-factor"></span>

## Comparison with a global circulation factor

To examine whether one circulation factor could represent all 11 vessels, I fitted a single global factor to the 25 values. This gave $f_c=1.148$, with R² = 0.240 and RMSE = 16.8 s. The comparison uses the same data, axes and markers as the vessel-specific plot.

<figure class="xdr-figure">
  <a href="/mixing/shared_circulation_factor_parity.svg?v=0a343063b761" target="_blank" rel="noopener noreferrer" aria-label="Open the global circulation-factor parity plot at full size">
    <img src="/mixing/shared_circulation_factor_parity.svg?v=0a343063b761" alt="Literature versus predicted mixing time using one global circulation factor across XDR, Biostat STR, UniVessel SU and ambr 250. A compact legend identifies each vessel series with its plotted-point count and the 1:1 parity line. R-squared, Pearson r, p and RMSE appear in that order in the upper-left corner. Values below 0.01 are shown as p less than 0.01." width="1872" height="2112" loading="lazy" decoding="async" />
  </a>
  <figcaption>Literature versus predicted mixing time using one global circulation factor, f<sub>c</sub> = 1.148, for the same 25 values from 11 vessels. The solid line marks 1:1 parity and shading marks 0.8 &le; literature/prediction &le; 1.2; above the line, predictions are too short. The open pentagon is the ambr 250 value derived from a reported plateau. <a href="/mixing/shared_circulation_factor_parity.png?v=b6996e2fb107" download>Download PNG</a>.</figcaption>
</figure>

<div class="xdr-experiment-plan" role="region" aria-label="Comparison of vessel-specific and shared circulation factors" tabindex="0">

| Approach | R² | RMSE | Mean absolute percentage error |
| --- | --- | --- | --- |
| Individual factor for each of 11 vessels | 0.917 | 5.5 s | 8.9% |
| One global factor, $f_c=1.148$ | 0.240 | 16.8 s | 39.3% |

</div>

Both approaches were evaluated using the calibration data. The vessel-specific model fits 11 factors to 25 values, so its improved agreement partly reflects the larger number of fitted parameters. The fitting objective minimizes log error; RMSE and percentage error describe different aspects of the residuals and need not improve together.

<details class="xdr-details">
  <summary>Statistical interpretation and power-screen sensitivity</summary>

R² is calculated as $1-\sum(t_{lit}-t_{pred})^2/\sum(t_{lit}-\bar t_{lit})^2$ on times in seconds. It is not Pearson $r^2$, despite the logarithmic plot axes. Pearson $r$ describes association; its displayed $p$ tests zero correlation under an independent-pair assumption. The pooled vessel/source groups and reuse of fitting data prevent treating that $p$ as evidence of model validation or agreement with 1:1 parity. The legend's $n$ counts plotted values, not independent experiments.

I also checked equal weighting by vessel and prediction of vessels excluded from the global fit. STR selection used reported chart power; one retained STR-2000 point falls below 10 W/m³ when power is recalculated using the approximate geometry.

</details>

## Applying bulk mixing time to liquid cells

The heat-transfer model accepts one bulk mixing time and retains a separate temperature for each liquid cell. At every integration step, mechanical mixing redistributes heat according to

$$
\begin{aligned}
\left.\frac{dT_i}{dt}\right|_{mix} &= \lambda(T_{bulk}-T_i),\\[6pt]
T_{bulk} &= \frac{\sum_i C_iT_i}{\sum_i C_i},\\[6pt]
C_i &= \rho c_pV_i.
\end{aligned}
$$

This exchange transfers heat from warmer to colder cells while conserving total liquid energy. Every cell uses the same rate $\lambda$; the bulk mixing time is not divided by the number of cells. Wall heating, conduction between neighboring cells and the assumed natural circulation are calculated separately. The heat-transfer model can therefore operate independently of the agitation model when a bulk mixing time is supplied.

I calibrated the rate using a standardized tracer occupying the top 20% of liquid volume and outer 50% of cross-sectional area, or 10% of the liquid. Its normalized initial concentration is 10 in that region and zero elsewhere, with a final mean of 1. Requiring every cell to reach within ±5% of that mean gives

$$
\lambda=\frac{\ln(9/0.05)}{t_{95}}=\frac{\ln(180)}{t_{95}}.
$$

This standardized tracer condition defines the model's mixing-rate calibration; it does not reproduce the injection and probe arrangements of the literature studies. The calibration tests forced relaxation alone. A temperature field generated by feeding is therefore not guaranteed to reach a specified temperature tolerance after $t_{95}$. Each cell exchanges heat with the bulk immediately, without resolving impeller flow paths, transport delays or descending feed plumes.

Switching agitation off sets $\lambda=0$, while molecular conduction and an assumed wall-driven buoyant circulation remain active. The circulation depends on the temperature difference between the outer and inner liquid regions. It does not solve the momentum equations or resolve all possible overturning instabilities. The predicted fields without agitation consequently depend on both mesh size and the assumed circulation.

## Heating with and without agitation

I first compared 30, 60 and 120 liquid cells with prescribed mixing times of 5 s and 30 s, and with agitation off. The liquid started at 4 °C. The XDR used a fixed 40 °C jacket inlet at 50 L/min, while the smaller vessels used an ideal 40 °C wall-contact boundary. I held the liquid-side film coefficient at 300 W/(m² K) to isolate heat redistribution within the liquid. These initial studies do not include an agitation-dependent film correlation or mechanical shaft power as a heat source.

<div class="xdr-experiment-plan" role="region" aria-label="Completed heating and mesh studies" tabindex="0">

| Vessel and working fill | Prescribed mixing conditions | Completed comparisons |
| --- | --- | --- |
| XDR-2000, 1,000 L | Off, 30 s, 5 s | Initial 30/60/120-cell heating and vertical sections; extended mesh study over 8 h |
| XDR-2000, 2,000 L | Off, 30 s, 5 s | Extended mesh study over 16 h; fixed-boundary and PI animations for off/30 s |
| Applikon 3 L vessel, 2 L | Off, 30 s, 5 s | Extended mesh study over 8 h; fixed-boundary and PI animations for off/5 s |
| ambr 250, 200 mL | Off, 30 s, 5 s; additional 10 s study | Initial and extended mesh studies over 2 h; fixed-boundary and PI animations for off/10 s |

</div>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/xdr2000_1000l_vertical_time_montage.png" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/xdr2000_1000l_vertical_time_montage.png" alt="Vertical liquid sections over time at 1,000 L in the XDR-2000, comparing agitation off with 30-second and 5-second bulk mixing." loading="lazy" decoding="async" />
  </a>
  <figcaption>XDR-2000 at 1,000 L, initially at 4 °C, heated with a fixed 40 °C jacket inlet at 50 L/min. Rows show agitation off, 30 s mixing and 5 s mixing, from top to bottom; columns show 0, 30, 60, 180, 335 and 480 minutes. Each section uses 60 liquid cells and a common 4–40 °C scale. Both halves display the same axisymmetric annular cell temperatures. These coarse fields illustrate temperature gradients; their mesh sensitivity is evaluated separately.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/xdr2000_2000l_sensitivity_time_series.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/xdr2000_2000l_sensitivity_time_series.svg" alt="Heating histories and mesh discrepancies at 2,000 L in the XDR-2000 for agitation off, 30-second mixing and 5-second mixing." loading="lazy" decoding="async" />
  </a>
  <figcaption>XDR-2000 at 2,000 L, initially at 4 °C, heated with a fixed 40 °C jacket inlet at 50 L/min over 16 hours. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. The upper row shows bulk temperature; the lower row shows the larger absolute difference from two 15,360-cell reference meshes at each time. The references are refined separately in height and radius; their disagreement is also plotted. The legend identifies cell counts and mesh layouts. Volume remains fixed and no feed is added.</figcaption>
</figure>

<details class="xdr-details">
  <summary>Additional heating curves, vertical sections and animations</summary>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/xdr2000_1000l_comparison.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/xdr2000_1000l_comparison.svg" alt="XDR-2000 at 1,000 L, initially at 4 °C, heated with a fixed 40 °C jacket inlet at 50 L/min. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. The upper row shows bulk temperature with the coldest-to-warmest cell range; the lower row shows the temperature spread. The legend identifies the 30-, 60- and 120-cell meshes." loading="lazy" decoding="async" />
  </a>
  <figcaption>XDR-2000 at 1,000 L, initially at 4 °C, heated with a fixed 40 °C jacket inlet at 50 L/min. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. The upper row shows bulk temperature with the coldest-to-warmest cell range; the lower row shows the temperature spread. The legend identifies the 30-, 60- and 120-cell meshes.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/xdr2000_1000l_warmup_time_series.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/xdr2000_1000l_warmup_time_series.svg" alt="XDR-2000 at 1,000 L, initially at 4 °C, heated with a fixed 40 °C jacket inlet at 50 L/min. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. Lines show bulk temperature and shading spans the coldest and warmest cells. Open circles mark the first bulk crossing of 36.5 °C; curves end there or at the saved simulation limit. This display cutoff does not represent heater shutdown. The legend identifies mesh size." loading="lazy" decoding="async" />
  </a>
  <figcaption>XDR-2000 at 1,000 L, initially at 4 °C, heated with a fixed 40 °C jacket inlet at 50 L/min. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. Lines show bulk temperature and shading spans the coldest and warmest cells. Open circles mark the first bulk crossing of 36.5 °C; curves end there or at the saved simulation limit. This display cutoff does not represent heater shutdown. The legend identifies mesh size.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/xdr2000_1000l_vertical_cross_sections.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/xdr2000_1000l_vertical_cross_sections.svg" alt="XDR-2000 at 1,000 L, initially at 4 °C, heated with a fixed 40 °C jacket inlet at 50 L/min. Vertical sections at 60 minutes. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. Rows show 30, 60 and 120 liquid cells, from top to bottom. Colors represent cell-average temperatures on a common scale. Both halves display the same axisymmetric annular cells; only the filled liquid region is shown." loading="lazy" decoding="async" />
  </a>
  <figcaption>XDR-2000 at 1,000 L, initially at 4 °C, heated with a fixed 40 °C jacket inlet at 50 L/min. Vertical sections at 60 minutes. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. Rows show 30, 60 and 120 liquid cells, from top to bottom. Colors represent cell-average temperatures on a common scale. Both halves display the same axisymmetric annular cells; only the filled liquid region is shown.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/applikon3l_2l_sensitivity_time_series.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/applikon3l_2l_sensitivity_time_series.svg" alt="Applikon 3 L vessel at 2 L, initially at 4 °C, heated with an ideal 40 °C wall-contact boundary over 8 hours. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. The upper row shows bulk temperature; the lower row shows the larger absolute difference from two 15,360-cell reference meshes at each time. The references are refined separately in height and radius; their disagreement is also plotted. The legend identifies cell counts and mesh layouts. Volume remains fixed and no feed is added." loading="lazy" decoding="async" />
  </a>
  <figcaption>Applikon 3 L vessel at 2 L, initially at 4 °C, heated with an ideal 40 °C wall-contact boundary over 8 hours. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. The upper row shows bulk temperature; the lower row shows the larger absolute difference from two 15,360-cell reference meshes at each time. The references are refined separately in height and radius; their disagreement is also plotted. The legend identifies cell counts and mesh layouts. Volume remains fixed and no feed is added.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/ambr250_200ml_comparison.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/ambr250_200ml_comparison.svg" alt="ambr250 at 200 mL, initially at 4 °C, heated with an ideal 40 °C wall-contact boundary. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. The upper row shows bulk temperature with the coldest-to-warmest cell range; the lower row shows the temperature spread. The legend identifies the 30-, 60- and 120-cell meshes." loading="lazy" decoding="async" />
  </a>
  <figcaption>ambr250 at 200 mL, initially at 4 °C, heated with an ideal 40 °C wall-contact boundary. Columns show agitation off, 30 s mixing and 5 s mixing, from left to right. The upper row shows bulk temperature with the coldest-to-warmest cell range; the lower row shows the temperature spread. The legend identifies the 30-, 60- and 120-cell meshes.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/ambr250_200ml_vertical_time_montage.png" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/ambr250_200ml_vertical_time_montage.png" alt="ambr250 at 200 mL, initially at 4 °C, heated with an ideal 40 °C wall-contact boundary. Rows show agitation off, 30 s mixing and 5 s mixing, from top to bottom; columns show 0, 1, 10, 30, 49 and 60 minutes. Each section uses 60 liquid cells and a common 4–40 °C scale. Both halves display the same axisymmetric annular cell temperatures. These coarse fields illustrate temperature gradients; their mesh sensitivity is evaluated separately." loading="lazy" decoding="async" />
  </a>
  <figcaption>ambr250 at 200 mL, initially at 4 °C, heated with an ideal 40 °C wall-contact boundary. Rows show agitation off, 30 s mixing and 5 s mixing, from top to bottom; columns show 0, 1, 10, 30, 49 and 60 minutes. Each section uses 60 liquid cells and a common 4–40 °C scale. Both halves display the same axisymmetric annular cell temperatures. These coarse fields illustrate temperature gradients; their mesh sensitivity is evaluated separately.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/ambr250_200ml_10s_sensitivity_time_series.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/ambr250_200ml_10s_sensitivity_time_series.svg" alt="AMBR at 200 mL, initially at 4 °C, with a prescribed 10 s mixing time and an ideal 40 °C culture-station boundary over 2 hours. The upper panel shows bulk temperature; the lower panel shows the larger absolute difference from two 15,360-cell reference meshes at each time. The references are refined separately in height and radius; their disagreement is also plotted. The legend identifies cell counts and mesh layouts. Volume remains fixed and no feed is added." loading="lazy" decoding="async" />
  </a>
  <figcaption>AMBR at 200 mL, initially at 4 °C, with a prescribed 10 s mixing time and an ideal 40 °C culture-station boundary over 2 hours. The upper panel shows bulk temperature; the lower panel shows the larger absolute difference from two 15,360-cell reference meshes at each time. The references are refined separately in height and radius; their disagreement is also plotted. The legend identifies cell counts and mesh layouts. Volume remains fixed and no feed is added.</figcaption>
</figure>

**Fixed-heating comparison without temperature control**

This supporting comparison isolates the liquid-temperature representation under a fixed thermal input. The original well-mixed model assigns one temperature to the liquid; the finite-mixing and agitation-off cases use 7,680 liquid cells. The three representations use the same wall grid, vessel fill, thermal properties, losses and initial conditions.

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/liquid_uniform_comparison_fixed.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/liquid_uniform_comparison_fixed.svg" alt="Matched fixed-heating comparison of a well-mixed model without mixing time, finite mixing and agitation off in AMBR at 200 mL, Applikon at 2 L and XDR at 2,000 L." loading="lazy" decoding="async" />
  </a>
  <figcaption>Fixed heating from 4 °C: bulk temperature above and warmest-minus-coldest liquid temperature below. The dashed well-mixed baseline has one liquid temperature and no mixing-time parameter, so its temperature spread is zero by construction. Finite mixing uses 10 s for AMBR, 5 s for Applikon and 30 s for XDR; agitation off disables forced redistribution. The bench boundaries remain at 40 °C; XDR retains a 40 °C jacket inlet and 50 L/min flow. Both cell cases use 7,680 liquid cells. These are matched model comparisons, not equipment validation.</figcaption>
</figure>

<div class="xdr-experiment-plan" role="region" aria-label="Time to bulk 36.5 degrees under matched fixed heating" tabindex="0">

| Vessel / working fill | Well-mixed liquid, no mixing time | Finite mixing | Agitation off |
| --- | --- | --- | --- |
| AMBR / 200 mL | 0.79 h | 0.82 h at 10 s | 0.98 h |
| Applikon 3 L / 2 L | 2.18 h | 2.22 h at 5 s | 3.10 h |
| XDR-2000 / 2,000 L | 6.93 h | 7.36 h at 30 s | Not reached within 16 h |

</div>

The table reports the first upward bulk-temperature crossing of 36.5 °C, interpolated between saved samples. Finite mixing increased this warm-up time by 1.9–6.3%. Relative to the well-mixed baseline, finite mixing delayed this crossing by about 1.5 minutes in AMBR, 2.5 minutes in Applikon and 26 minutes in XDR. The cell model also predicted spatial temperature gradients despite the comparatively close bulk-temperature curves.

Fixed-boundary animations: [XDR at 2,000 L, off/30 s](/agitation-thermal/fixed/xdr2000.html) · [Applikon at 2 L, off/5 s](/agitation-thermal/fixed/applikon3l.html) · [AMBR at 200 mL, off/10 s](/agitation-thermal/fixed/ambr250.html).

</details>

## Mesh size, accuracy and calculation time

I extended the initial comparison of 30, 60 and 120 cells to meshes containing 10 to 15,360 cells. Each layout is reported as axial layers × radial rings. The 7,680-cell mesh contains 80 × 96 cells, while the two 15,360-cell reference meshes contain 160 × 96 and 80 × 192 cells. The 7,680-cell mesh is therefore an intermediate resolution within the tested range. Although the cells have equal volume, their physical widths and heights can differ, particularly near curved vessel walls.

I compared temperature histories and target times with both reference meshes and measured runtime in three timing sweeps on the same machine. I selected a maximum bulk-temperature discrepancy ≤ 0.25 °C and a target-time discrepancy ≤ 2% as the numerical acceptance criteria. These thresholds assess agreement between meshes rather than accuracy against experimental measurements. The table identifies the fastest tested layout that met both criteria across agitation off, 5 s and 30 s mixing.

<div class="xdr-experiment-plan" role="region" aria-label="Practical mesh choices across three mixing conditions" tabindex="0">

| Working fill | Fastest measured qualifying layout | Worst median runtime | Maximum bulk / target-time discrepancy |
| --- | --- | --- | --- |
| AMBR, 200 mL | 1,920 cells: 40 × 48 | 0.65 s | 0.179 °C / 1.31% |
| Applikon, 2 L | 3,840 cells: 80 × 48 | 2.02 s | 0.234 °C / 1.74% |
| XDR, 1,000 L | No common qualifying mesh among candidates ≤ 7,680 cells | — | Criteria not met |
| XDR, 2,000 L | No common qualifying mesh among candidates ≤ 7,680 cells | — | Criteria not met |

</div>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/initial_mesh_cost_bulk_accuracy.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/initial_mesh_cost_bulk_accuracy.svg" alt="Bulk-temperature discrepancy against measured runtime for XDR at 1,000 L and AMBR at 200 mL, with explicit axial and radial mesh labels." loading="lazy" decoding="async" />
  </a>
  <figcaption>Calculation time and bulk-temperature discrepancy for the initial XDR and AMBR working fills. Each candidate mesh is compared with both 15,360-cell reference meshes. Runtime depends on the machine, simulated duration and mixing condition.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/operating_mesh_cost_bulk_accuracy.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/operating_mesh_cost_bulk_accuracy.svg" alt="Bulk-temperature discrepancy versus runtime for XDR at 2,000 L and Applikon at 2 L, showing mesh size and the selected accuracy criteria." loading="lazy" decoding="async" />
  </a>
  <figcaption>Calculation time and bulk-temperature discrepancy at 2,000 L in the XDR and 2 L in the 3 L vessel. Each layout is evaluated across off/5 s/30 s mixing conditions. A mesh that meets the criteria under rapid mixing may not meet them with agitation off.</figcaption>
</figure>

The required mesh resolution varied with vessel and mixing condition. For the 2,000 L XDR with 5 s mixing, 960 cells met the numerical criteria, but no common candidate met them across all three conditions. The two finest XDR reference meshes still differed by up to 0.442 °C in bulk temperature at 2,000 L. This difference indicates unresolved numerical sensitivity and cannot be interpreted as a confidence interval for the physical temperature.

These mesh choices were assessed using bulk quantities. Resolving local temperature extremes after feeding may require a finer mesh. Spatial convergence has not been established for the 120-cell feed animations below. Refinement also does not address errors in the assumed natural circulation or global heat exchange.

<details class="xdr-details">
  <summary>Spatial accuracy and refinement direction</summary>

[Initial-fill spatial errors](/agitation-thermal/figures/initial_mesh_cost_spatial_accuracy.svg), [2,000 L / 2 L spatial errors](/agitation-thermal/figures/operating_mesh_cost_spatial_accuracy.svg), [separate axial and radial checks](/agitation-thermal/figures/large_mesh_directional_checks.svg), and runtime by cell count for [the initial fills](/agitation-thermal/figures/initial_mesh_runtime_vs_cells.svg) and [the larger operating fills](/agitation-thermal/figures/operating_mesh_runtime_vs_cells.svg) are available separately. The 3,840-cell Applikon layout 40 × 96 had a similar median runtime to 80 × 48, with lower bulk and target-time discrepancies, illustrating why cell count alone is insufficient.

</details>

## Temperature control and local gradients

I then introduced PI feedback to regulate bulk temperature at 36.5 °C. The XDR controller varies the jacket inlet temperature while retaining jacket-water storage and 50 L/min flow. The bench controllers regulate ideal wall-contact temperatures. All controllers use 20–40 °C boundary limits with modeled sensor and actuator lags. These inputs describe the simulated control systems; they do not represent manufacturer controller settings or predict heater power.

<figure class="agitation-video">
  <div class="youtube-player youtube-player--portrait" data-youtube-id="RQqO05G8K2E" data-youtube-title="PI-controlled heating in the 3 L vessel at 2 L fill with agitation off">
    <button type="button" class="youtube-player__button" aria-label="Play PI-controlled heating in the 3 L vessel at 2 L fill with agitation off">
      <img src="/agitation-thermal/controlled/posters/applikon3l_off.png?v=732117fdf9b2" alt="" loading="lazy" decoding="async" width="640" height="760" />
      <span class="youtube-player__play" aria-hidden="true">▶</span>
    </button>
  </div>
  <figcaption>PI-controlled heating in the 3 L vessel at 2 L fill with agitation off. After 8 hours, the predicted bulk temperature is about 36.51 °C and the coldest source cell is about 30.07 °C. The difference illustrates the limitation of bulk regulation as a measure of thermal uniformity. The 7,680 source cells are displayed as 40 × 48 volume averages, with boundaries marking the display cells. Saved temperatures are interpolated at 25 frames/s with constant progression of simulation time and a fixed 4–40 °C scale.</figcaption>
</figure>

<div class="xdr-experiment-plan" role="region" aria-label="PI-controlled final bulk and coldest-cell temperatures" tabindex="0">

| Vessel / working fill / duration | Off: final bulk / coldest (°C) | Mixed: final bulk / coldest (°C) | Animations |
| --- | --- | --- | --- |
| XDR-2000 / 2,000 L / 16 h | 26.71 / 14.45 | 36.56 / 36.56 at 30 s | [PI](/agitation-thermal/controlled/xdr2000.html) · [Fixed boundary](/agitation-thermal/fixed/xdr2000.html) |
| Applikon 3 L / 2 L / 8 h | 36.51 / 30.07 | 36.50 / 36.11 at 5 s | [PI](/agitation-thermal/controlled/applikon3l.html) · [Fixed boundary](/agitation-thermal/fixed/applikon3l.html) |
| AMBR / 200 mL / 2 h | 36.56 / 35.82 | 36.54 / 36.52 at 10 s | [PI](/agitation-thermal/controlled/ambr250.html) · [Fixed boundary](/agitation-thermal/fixed/ambr250.html) |

</div>

At 2,000 L, the XDR bulk temperature remained about 26.71 °C after 16 hours with agitation off. The selected boundary limit was therefore insufficient to reach the target within the simulation. The ideal bench boundary permits both heat input and heat removal. This differs from the power-limited, heating-only bench model in the [temperature-control project](/projects/bioreactor-temperature-control/).

## Feeding and changing liquid volume

The feed simulations start at 80% of the selected full working volume and warm from 4 °C. The first addition is triggered when bulk temperature crosses 36.5 °C from below. Feed enters from the top and adds both volume and sensible enthalpy. The cell count remains fixed as cell boundaries and wetted wall areas change. Resident liquid is remapped according to the overlap between the previous and updated cells, conserving its energy. The feed initially occupies the added top layer uniformly across radial annuli; an inlet jet is not resolved.

### Continuous feeding

The continuous-feed comparison adds the final 20% of working volume over 30 minutes: 160→200 mL in AMBR, 1.6→2 L in Applikon and 1,600→2,000 L in XDR. The addition equals 25% of the starting volume. I compared 4 °C and 20 °C feed with agitation off and with prescribed mixing times of 10 s, 5 s and 30 s, respectively. These mixing times remain fixed as volume increases; the bolus study below instead holds RPM fixed.

<figure class="agitation-video">
  <div class="youtube-player youtube-player--landscape" data-youtube-id="uxsH2nxGo14" data-youtube-title="AMBR continuous top feeding, comparing 4 and 20 degree feed temperatures">
    <button type="button" class="youtube-player__button" aria-label="Play AMBR continuous top feeding, comparing 4 and 20 degree feed temperatures">
      <img src="/agitation-thermal/continuous/posters/ambr250_agitation_on_top_feed.png?v=e04c0e3e0149" alt="" loading="lazy" decoding="async" width="1080" height="650" />
      <span class="youtube-player__play" aria-hidden="true">▶</span>
    </button>
  </div>
  <figcaption>AMBR continuous feeding with a prescribed 10 s mixing time. A total of 40 mL is added from the top over 30 minutes after the 36.5 °C trigger. Left: 4 °C feed; right: 20 °C feed. Time is measured from the start of feeding, with PI control maintained during addition and recovery. Liquid volume and sensible heat are interpolated between saved updates for the 25-frame/s display. The illustrative 120-cell fields use a common color scale specific to this comparison.</figcaption>
</figure>

The predicted AMBR minimum bulk temperature was about 35.34 °C with 4 °C feed and 35.98 °C with 20 °C feed. The corresponding minima in the mixed XDR were about 30.97 °C and 33.85 °C. Neither XDR case satisfied the sustained ±0.2 °C recovery criterion within the two-hour post-feed observation. The continuous addition is larger than the combined boluses below, which limits direct comparison of their cooling and recovery responses.

The Applikon 5 s cases approached the exact 36.5 °C trigger from below without crossing it within the configured warm-up horizon. Feeding therefore did not start, and the working volume remained 1.6 L. The study also includes agitation-off results and matched no-feed baselines. I examined temporal sensitivity in AMBR by reducing the feed-update interval from 10 to 5 and 2.5 s. This check assesses the time discretization of feeding rather than spatial mesh convergence.

### Three boluses with RPM held fixed

For the bolus comparison, I applied three additions, each equal to 3% of the starting volume, for a total addition of 9%. Boluses occur at the temperature trigger and 30 and 60 minutes later, followed by two hours of recovery. Each bolus is represented as an instantaneous inventory addition. Both vessels start at 30 W/m³. The corresponding RPM is held fixed throughout warm-up, feeding and recovery, while mixing time is recalculated at each updated fill.

<div class="xdr-experiment-plan" role="region" aria-label="Fixed-RPM three-bolus operating inputs" tabindex="0">

| Vessel | Starting → final fill | Each bolus | Fixed RPM | Initial → final $t_{95}$ |
| --- | --- | --- | --- | --- |
| AMBR | 160 → 174.4 mL | 4.8 mL | 402.3 | 5.11 → 5.31 s |
| XDR-2000 | 1,600 → 1,744 L | 48 L | 115.9 | 34.75 → 36.19 s |

</div>

With constant density and power number, fixed RPM maintains constant shaft power as P/V falls from 30 to 27.52 W/m³ in both vessels. The AMBR calculation uses the nominal manufacturer $N_p=1.34$ and fitted $f_c=1.2245$ described above. Applying its 250 mL calibration to the smaller fills and thermal geometry requires extrapolation. The XDR calculation uses $N_p=0.51$ and $f_c=1.1189$, with the selected speed slightly above the calibration range.

<figure class="agitation-video">
  <div class="youtube-player youtube-player--landscape" data-youtube-id="z-HeyuPGuS0" data-youtube-title="AMBR three top boluses at fixed 402.3 rpm, with 4 and 20 degree feeds">
    <button type="button" class="youtube-player__button" aria-label="Play AMBR three top boluses at fixed 402.3 rpm, with 4 and 20 degree feeds">
      <img src="/agitation-thermal/bolus/posters/ambr250_fixed_rpm_three_boluses.png?v=09a87c82dd7f" alt="" loading="lazy" decoding="async" width="1080" height="650" />
      <span class="youtube-player__play" aria-hidden="true">▶</span>
    </button>
  </div>
  <figcaption>AMBR response to three 4.8 mL top boluses at fixed 402.3 rpm. Left: 4 °C feed; right: 20 °C feed. Time is measured from the first bolus. The 120-cell model shows heat redistribution and PI-controlled recovery after each addition. Playback at 25 frames/s interpolates between saved states and slows smoothly around additions. The instantaneous temperature change at each bolus is retained, with the states immediately before and after addition shown at the same simulation time.</figcaption>
</figure>

<figure class="agitation-video">
  <div class="youtube-player youtube-player--landscape" data-youtube-id="CcaWp2ERPKI" data-youtube-title="XDR-2000 three top boluses at fixed 115.9 rpm, with 4 and 20 degree feeds">
    <button type="button" class="youtube-player__button" aria-label="Play XDR-2000 three top boluses at fixed 115.9 rpm, with 4 and 20 degree feeds">
      <img src="/agitation-thermal/bolus/posters/xdr2000_fixed_rpm_three_boluses.png?v=0b5d5cf1b954" alt="" loading="lazy" decoding="async" width="1080" height="650" />
      <span class="youtube-player__play" aria-hidden="true">▶</span>
    </button>
  </div>
  <figcaption>XDR-2000 response to three 48 L top boluses at fixed 115.9 rpm, starting at 1,600 L. Left: 4 °C feed; right: 20 °C feed. Time is measured from the first bolus. Playback uses the same timing and interpolation as AMBR, with a shared 26–38 °C liquid-temperature scale. Bulk recovery is slower under the selected XDR boundary and PI inputs, so cooling accumulates over successive additions. Predicted cold-layer temperatures depend on mesh resolution; they do not represent measurements of a resolved feed plume.</figcaption>
</figure>

<div class="xdr-experiment-plan" role="region" aria-label="Three-bolus cooling and recovery results" tabindex="0">

| Vessel | Minimum bulk, 4 °C / 20 °C feed | Recovery after the last bolus, 4 °C / 20 °C feed |
| --- | --- | --- |
| AMBR | 35.55 / 36.02 °C | About 6 / 3 min |
| XDR-2000 | 34.91 / 35.74 °C | About 71 / 45 min |

</div>

I defined recovery as the first saved sample after which bulk temperature remains within 36.5 ± 0.2 °C through the end of the run, with at least 30 minutes remaining. This gives a sampled estimate of settling time. The immediate bulk-temperature change is determined by the energy balance, and subsequent redistribution follows the shared relaxation rule. Shorter mixing time reduces the modeled temperature contrast, while the controller and thermal boundary determine the rate of bulk-temperature recovery.

<span id="the-original-uniform-liquid-baseline"></span>

## The original well-mixed baseline

The original thermal model assigns one temperature to the entire liquid volume, with separate thermal states for the wall and headspace. Heat transfer through the heating boundary is calculated, while the liquid is assumed to remain well-mixed. The model has no mixing-time input. Heat entering the liquid contributes immediately to its bulk temperature.

A well-mixed model assumes instantaneous heat redistribution and cannot represent cold regions or temperature gradients. In the liquid-cell model, switching agitation off removes forced mixing while retaining spatial temperature differences and the other heat-transport processes.

To isolate the effect of the liquid representation, I compared the original well-mixed assumption with the 7,680-cell model using the same wall grid. I retained the vessel fill, wall and headspace properties, heat-transfer coefficients, losses and initial conditions. The comparison therefore changes the liquid-temperature assumption without changing the wall discretization.

I used PI control at 36.5 °C to assess whether the well-mixed assumption is sufficient for predicting regulated bulk heating. Each liquid representation uses the same controller settings.

<figure class="xdr-figure">
  <a href="/agitation-thermal/figures/liquid_uniform_comparison_pi.svg" target="_blank" rel="noopener noreferrer">
    <img src="/agitation-thermal/figures/liquid_uniform_comparison_pi.svg" alt="PI-controlled comparison of well-mixed liquid without mixing time, finite mixing and agitation off, showing similar regulated bulk temperatures can conceal different local temperature spreads." loading="lazy" decoding="async" />
  </a>
  <figcaption>Matched PI control using the same thermal network, gains, sensor and actuator lags, boundary limits and initial controller states for each liquid representation. The top row shows bulk temperature; the bottom row shows the warmest-minus-coldest cell temperature. The well-mixed baseline assumes one temperature throughout the liquid. All liquids start at 4 °C, with finite mixing times of 10 s for AMBR, 5 s for Applikon and 30 s for XDR. The controllers regulate the thermal boundary within 20–40 °C; XDR retains 50 L/min jacket flow. The agitation-off XDR does not reach the bulk target within 16 hours under these inputs.</figcaption>
</figure>

I assessed PI control using bulk settling within 36.5 ± 0.2 °C, without requiring an exact crossing of 36.5 °C. Settling time is the first saved time after which all remaining samples stay within this band, with at least 30 minutes remaining in the observation window. This criterion applies to sampled bulk temperature and does not require every liquid cell to be within the band.

<div class="xdr-experiment-plan" role="region" aria-label="Bulk settling within 0.2 degrees of the PI target" tabindex="0">

| Vessel / working fill | Well-mixed liquid, no mixing time | Finite mixing | Agitation off |
| --- | --- | --- | --- |
| AMBR / 200 mL | 0.83 h | 0.86 h at 10 s | 1.03 h |
| Applikon 3 L / 2 L | 2.44 h | 2.48 h at 5 s | 3.36 h |
| XDR-2000 / 2,000 L | 7.41 h | 7.86 h at 30 s | Not reached within 16 h |

</div>

The well-mixed Applikon model approached 36.5 °C from below and satisfied the settling criterion without crossing the exact target. Its zero temperature spread follows from the well-mixed assumption. The liquid-cell model predicted a colder region despite regulation of the bulk temperature.

## Conclusion and next steps

The well-mixed model provides a useful first estimate of bulk heating when heat redistribution is fast relative to the heating process. In the agitated PI-controlled cases, the well-mixed and liquid-cell models both reached the bulk settling criterion, although finite mixing delayed settling. The acceptability of this delay depends on the temperature and timing tolerances of the process. Agreement in bulk temperature did not ensure that the entire liquid reached the target temperature. A liquid mesh is therefore useful for examining cold regions, heating without agitation and local cooling after feed addition. The reliability of these predictions depends on the assumed mixing, buoyant circulation and wall heat transfer, in addition to mesh resolution.

I plan to extend this analysis to dissolved oxygen (DO) and nutrient distributions. Local gas transfer, feed addition and cellular consumption may sustain concentration gradients even when temperature is nearly uniform. The next step is to include these sources and sinks in the liquid-cell model, followed by coupling to a mechanistic cell-line model. This would allow me to examine when bulk measurements represent the conditions experienced by cells, and whether the magnitude and duration of local gradients could influence growth, metabolism and productivity.

<span id="validating-each-vessel"></span>

## Validation and animation gallery

The mixing parity plots assess agreement with the fitted literature values. Several values were read from charts, and XDR-200 and AMBR each contribute one selected point. Differences in vessel geometry, internals, tracer method and injection location limit transfer to new conditions. The nominal AMBR inputs also combine two sources, which remains a limitation of that calibration. Independent measurements are needed to evaluate predictive performance.

I checked energy and volume conservation, geometric consistency, solver tolerances, feed-event timing and controller continuity. These checks assess the numerical implementation of the stated equations. Experimental measurements at multiple positions and liquid fills are still required to validate mixing, thermal transport and local feed responses. In particular, the assumed wall-driven circulation and the coarse feed mesh require further evaluation before using the predicted agitation-off fields or local temperature extremes to guide operating decisions.

[Open all thermal animations and figures](/agitation-thermal/index.html) to compare fixed-boundary heating, PI control and top feeding across vessels.

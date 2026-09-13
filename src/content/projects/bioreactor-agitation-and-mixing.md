---
title: "Bioreactor agitation and mixing"
description: "Comparison of power per volume, tip speed, Reynolds number, energy dissipation and mixing time across cell-culture bioreactors."
organization: "Independent project"
period: "2026-present"
tags: ["Agitation", "Mixing time", "Scale-up"]
order: 0
---

Agitation controls the dispersion of additions and the transfer of mechanical energy to the culture. However, matching rotational speed across vessel sizes does not preserve power per volume, tip speed, or mixing time, and the correlations used to predict mixing time were developed for geometries that differ from tall, unbaffled cell-culture vessels. As such, the objective of this project was to compare these quantities across cell-culture bioreactors and to examine whether a common mixing-time correlation, with a circulation factor calibrated for each vessel, recaptures literature mixing times. I (i) calculated power per volume, tip speed, Reynolds number, and dissipation scales for each vessel, (ii) fitted a circulation factor per vessel against 26 literature mixing times from 11 vessels, and (iii) compared this vessel-specific calibration against a single global factor.

Notably, fitting a separate factor to each vessel reproduced the 26 literature values with R² = 0.918 and RMSE = 5.4 s, whereas a single global factor gave R² = 0.255 and RMSE = 16.4 s. Overall, this comparison suggests that a single correlation does not transfer across vessel designs, and that vessel-specific calibration is crucial for predicting mixing time in cell-culture bioreactors.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#power-per-volume-and-other-agitation-metrics">P/V and agitation metrics</a></li>
    <li><a href="#where-the-mixing-values-come-from">Literature mixing data</a></li>
    <li><a href="#mixing-time-with-vessel-specific-circulation-factors">Vessel-specific mixing model</a></li>
    <li><a href="#what-changes-with-one-global-factor">Global-factor comparison</a></li>
    <li><a href="#validating-each-vessel">Calibration limits and validation</a></li>
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

Here, $N$ is revolutions per second, $D$ is impeller diameter, $V$ is liquid volume, $\rho$ is density, $\mu$ is dynamic viscosity and $\nu=\mu/\rho$. The power number, $N_p$, must be defined for either one impeller or the complete installed set; I applied one value for the complete set.

For fixed geometry, density, and power number, doubling speed increases power eightfold but tip speed only twofold, so holding P/V constant across scales does not generally preserve tip speed or mixing time. A constant power number also requires evidence that it applies to the flow regime and vessel configuration examined.

Mean dissipation does not resolve the higher local dissipation near the impeller, and any peak-to-mean multiplier remains an explicit assumption. Similarly, the Kolmogorov length is a turbulence scale rather than a stand-alone cell-damage threshold; [Baldyga and Bourne (1999)](https://www.wiley-vch.de/en/areas-interest/natural-sciences/turbulent-mixing-and-chemical-reactions-978-0-471-98171-8) provide the turbulent-mixing framework.

<span id="where-the-mixing-values-come-from"></span>

## Literature mixing data

I compared predicted mixing times against the literature values below. The time ranges span the selected operating conditions rather than uncertainty intervals, values read from charts are approximate, and the two ambr times derive from a single reported mixing-number plateau.

<div class="xdr-experiment-plan" role="region" aria-label="Sources and numerical values used in the mixing parity plots" tabindex="0">

| Dataset | Source and exact location | Selected mixing times |
| --- | --- | --- |
| XDR-200 (1 point) | [Cytiva 29268546AA, Figure 3, p. 2](https://cdn.cytivalifesciences.com/api/public/content/digi-18518-original) | 28 s; chart reading. |
| XDR-500 (4 points) | [Cytiva KA4969250918AN, Figure 3, p. 3](https://cdn.cytivalifesciences.com/api/public/content/digi-18411-original) | 20-48 s; chart readings. |
| XDR-1000 (4 points) | [Cytiva 29242384AA, Figure 3, p. 3](https://cdn.cytivalifesciences.com/api/public/content/digi-18517-pdf) | 42-80 s; chart readings. |
| XDR-2000 (3 points) | [Cytiva 29243481AB, Figure 3, p. 3](https://cdn.cytivalifesciences.com/api/public/content/digi-18410-pdf) | 28-38 s; chart readings. |
| Biostat STR 50-2000 (10 points) | [Dreher et al. (2013), Figure 1b; power in Figure 1a](https://doi.org/10.1186/1753-6561-7-S6-P55) | 8-32 s; chart readings. |
| UniVessel SU 2 L (1 point) | [Barth et al. (2026), Table 2, automated SU measurements](https://doi.org/10.1007/s00253-026-13931-w) | 5.39 s at 1.0 m/s; reported mean of 24 measurements. |
| UniVessel SU 2 L (1 point) | [De Wilde et al. (2014), Figure 5 and accompanying text](https://www.bioprocessintl.com/single-use/superior-scalability-of-single-use-bioreactors) | 7 s at 0.6 m/s; value reported in text. |
| ambr 250 down-pumping (2 derived values) | [Miranda et al. (2026), section 3.4, Figure 5](https://doi.org/10.1016/j.cherd.2026.01.030) | 11.528 s at 300 rpm and 6.288 s at 550 rpm; both from $N t_m = 57.64$. |

</div>

For ambr, the paper reports $N_p=2.12$ and $N t_m=57.64$ for the baffled down-pumping configuration with a pH probe and sparger line, so the time at 300 rpm is $57.64/(300/60)=11.528$ s. With tank diameter 61 mm, rounded impeller diameter 26 mm, and liquid-height ratio 1.41 from section 2.1/Figure 1, the correlation introduced below gives a baseline mixing number of $N t_{95,GN}=26.4574$, and dividing 57.64 by this baseline gives $f_c=2.18$ ([UCL manuscript](https://discovery.ucl.ac.uk/id/eprint/10220724/1/ambr250.pdf)).

For the other datasets, I calculated mixing numbers as $(\mathrm{rpm}/60)t_{95}$; speeds inferred from tip velocity depend on the assumed impeller diameter. XDR power numbers come from Cytiva customer correspondence dated July 2024 and tank/impeller dimensions from [EP2663629B1, Table 1](https://patents.google.com/patent/EP2663629B1/en), while the total-pair power number of 1.3 for STR/UniVessel follows [De Wilde et al. (2014)](https://www.bioprocessintl.com/single-use/superior-scalability-of-single-use-bioreactors). The scaled STR geometry and effective cylindrical UniVessel geometry remain approximations.

## Mixing time with vessel-specific circulation factors

I fitted a separate circulation factor for each bioreactor using a common mixing-time correlation. More specifically, each factor scales the predicted mixing time while preserving its dependence on speed, power number, and geometry, so the calibration is specific to the vessel design and the conditions represented in its source data.

$$
t_{95}=f_{c,v}\frac{5.2}{N}\left(\frac{T}{D}\right)^2\left(\frac{H}{T}\right)^{1/2}N_p^{-1/3}
$$

Here, $f_{c,v}$ is the circulation factor for vessel $v$, $N$ is revolutions per second, $T$ is tank diameter, $D$ is impeller diameter, $H$ is liquid height and $N_p$ describes the complete installed impeller set. This height form is reproduced in [Taylor-Pashow et al. (2017), section 2.2, equation 1](https://sti.srs.gov/fulltext/SRNL-STI-2017-00322.pdf#page=15), with historical attribution to [Grenville and Nienow, chapter 9](https://doi.org/10.1002/0471451452.ch9). Applying it to tall, unbaffled or multiple-impeller cell-culture vessels is an explicit approximation.

For each vessel, I calculated the factor as the geometric mean of the ratios between literature and baseline mixing times, which minimizes squared log residuals with equal weight per displayed point within that vessel. The two UniVessel source series share one factor because they represent the same vessel design, and the two ambr values contribute the same ratio because they derive from one mixing-number plateau. The resulting 11 factors are fixed for subsequent calculations.

<figure class="xdr-figure">
  <a href="/mixing/vessel_specific_circulation_factor_parity.svg?v=6ed261442258" target="_blank" rel="noopener noreferrer" aria-label="Open the vessel-specific circulation-factor parity plot at full size">
    <img src="/mixing/vessel_specific_circulation_factor_parity.svg?v=6ed261442258" alt="Literature versus predicted mixing time with separate circulation factors for 11 vessels. The axes, vessel markers, compact legend with plotted-point counts, and 1:1 parity line are consistent across both parity plots. R-squared, Pearson r, p and RMSE appear in that order in the upper-left corner. Values below 0.01 are shown as p less than 0.01." width="1872" height="2112" loading="lazy" decoding="async" />
  </a>
  <figcaption>Literature versus predicted mixing time using a separate circulation factor for each vessel: 26 values from 11 vessels at P/V = 10-100 W/m<sup>3</sup> and tip speed &le; 3 m/s. The solid line marks 1:1 parity and shading marks 0.8 &le; literature/prediction &le; 1.2; above the line, predictions are too short. Fitted f<sub>c</sub> values are XDR-200: 1.96; XDR-500: 1.56; XDR-1000: 2.39; XDR-2000: 1.12; Biostat STR 50: 0.99; STR 200: 0.75; STR 500: 0.64; STR 1000: 0.80; STR 2000: 0.63; UniVessel SU: 0.92; ambr 250: 2.18. Open pentagons are the two ambr 250 values derived from one reported plateau. <a href="/mixing/vessel_specific_circulation_factor_parity.png?v=6ed261442258" download>Download PNG</a>.</figcaption>
</figure>

<details class="xdr-details">
  <summary>Statistics and data limitations for both parity plots</summary>

Metrics use untransformed times in seconds. R<sup>2</sup> = 1 &minus; SSE/SST measures prediction agreement with parity, where SSE is the sum of squared prediction errors and SST is the sum of squared deviations of literature times from their mean. r is the Pearson correlation and p is its <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.pearsonr.html">two-sided zero-correlation p-value</a> under independent normal-sample assumptions; values below 0.01 are shown as p &lt; 0.01. Legend n values count plotted points, not independent experimental replicates. Shared sources, derived values, and reuse of the fitting data prevent interpreting these nominal p-values as evidence of independent-sample significance or of parity. XDR-200 has only one fitted point and the ambr values reproduce one plateau, so their exact parity follows from calibration. Chart readings and reconstructed geometry are approximate, and one STR 2000 condition is borderline at the lower power cutoff.

</details>

The vessel-specific model gave **R² = 0.918, RMSE = 5.4 s, and mean absolute percentage error = 8.6%** for the 26 calibration values, with fitted factors ranging from 0.63 to 2.39. Such a wide range indicates that the factors absorb not only the chosen correlation and assumed geometry but most likely also differences in measurement methods and chart readings. However, these are calibration data, and independent tracer measurements are required to evaluate predictive performance.

<span id="what-changes-with-one-global-factor"></span>

## Comparison with a global circulation factor

To evaluate whether one adjustment could represent all 11 vessels, I fitted a single global factor to all 26 points, which gave $f_c=1.20$ with **R² = 0.255 and RMSE = 16.4 s**. The comparison below uses the same data, axes, and markers as the vessel-specific plot.

<figure class="xdr-figure">
  <a href="/mixing/shared_circulation_factor_parity.svg?v=90822e62bcd1" target="_blank" rel="noopener noreferrer" aria-label="Open the global circulation-factor parity plot at full size">
    <img src="/mixing/shared_circulation_factor_parity.svg?v=90822e62bcd1" alt="Literature versus predicted mixing time using one global circulation factor across XDR, Biostat STR, UniVessel SU and ambr 250 down-pumping. A compact legend identifies each vessel series with its plotted-point count and the 1:1 parity line. R-squared, Pearson r, p and RMSE appear in that order in the upper-left corner. Values below 0.01 are shown as p less than 0.01." width="1872" height="2112" loading="lazy" decoding="async" />
  </a>
  <figcaption>Literature versus predicted mixing time using one global circulation factor, f<sub>c</sub> = 1.20, for the same 26 values from 11 vessels. The solid line marks 1:1 parity and shading marks 0.8 &le; literature/prediction &le; 1.2; above the line, predictions are too short. Open pentagons are the two ambr 250 values derived from one reported plateau. Statistics are defined above. <a href="/mixing/shared_circulation_factor_parity.png?v=90822e62bcd1" download>Download PNG</a>.</figcaption>
</figure>

<div class="xdr-experiment-plan" role="region" aria-label="Comparison of vessel-specific and shared circulation factors" tabindex="0">

| Approach | R² | RMSE | Mean absolute percentage error |
| --- | --- | --- | --- |
| **Individual factor for each of 11 vessels** | **0.918** | **5.4 s** | **8.6%** |
| One global factor, $f_c=1.20$ | 0.255 | 16.4 s | 43.5% |

</div>

Both approaches were evaluated on the calibration data, and the vessel-specific model fits 11 factors to 26 values, so its additional flexibility must be considered when comparing errors. In addition, because fitting minimizes log error, reductions in RMSE do not necessarily correspond to reductions in percentage error.

More interestingly, the global factor produced geometric-mean literature/prediction ratios of **1.40 for XDR, 0.62 for STR, 0.77 for UniVessel, and 1.81 for ambr**, where ratios above one indicate underprediction. Such systematic, vessel-family-dependent errors, rather than random scatter, are what support retaining vessel-specific calibration and using the global factor only for comparison.

Assigning equal total weight to each vessel changed the global factor to 1.13, and excluding each vessel from the global fit in turn gave held-out predictions with RMSE 18.2 s and mean absolute percentage error 48.2%, treating the two UniVessel series and the two derived ambr values as single groups. This internal analysis evaluates how the global factor transfers to an excluded vessel; it does not validate the individual factors.

<span id="validating-each-vessel"></span>

## Calibration limits and validation

The model calculates bulk mixing time and the dimensionless mixing number, $N t_{95}$, alongside P/V and the other agitation quantities. However, each fitted factor is specific to its source vessel configuration and operating range, so estimates at different speeds, liquid volumes, or geometries require an assessment of extrapolation.

The limitations of this comparison arise from the calibration data themselves. While the 26 values span 11 vessels from 250 mL to 2,000 L, XDR-200 has one selected point and the ambr factor represents one reported plateau, so their exact parity follows from fitting, and the remaining values are chart readings with approximate geometry. Validation therefore requires repeated tracer measurements across the intended speeds and liquid volumes, with separate runs reserved for calibration and validation, and predictions for a new vessel require evidence from that vessel before they can be described as calibrated. Tracer method, injection location, liquid height, internals, and geometry should be recorded so that residual differences can be interpreted. Such measurements would also help evaluate the uniform-temperature assumption in the separate [temperature-control project](/projects/bioreactor-temperature-control/).

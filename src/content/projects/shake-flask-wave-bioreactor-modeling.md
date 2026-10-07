---
title: "Shake flask and wave bioreactor modeling"
description: "Extending the surface kLa project to orbital shaking and rocking bags: how motion, fill and gas supply affect oxygen transfer."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-09-27"
period: "2026–present"
tags: ["Shake flasks", "Wave bioreactors", "Oxygen transfer", "Scale-down"]
order: 3
draft: true
---

<p class="eyebrow">Project in progress</p>

This project builds on my [surface kLa and headspace gas-transfer work](/projects/bioreactor-surface-gas-transfer/). That project looked at surface oxygen transfer in stirred vessels. Here, I am extending the work to shake flasks and wave bioreactors, where the motion of the vessel brings liquid into contact with the gas above it.

I want to understand how orbit, rocking motion and liquid fill change oxygen supply, and where that supply falls short of cell demand. I have started with published vessel-specific correlations and the same oxygen-solubility and gas-balance framework. The coefficient fitted to the stirred-tank data is not used in these calculations.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#shake-flasks-orbit-speed-and-fill">Shake flasks</a></li>
    <li><a href="#wave-bioreactors-motion-and-oxygen-supply">Wave bioreactors</a></li>
    <li><a href="#when-oxygen-demand-exceeds-supply">Oxygen demand</a></li>
    <li><a href="#what-i-want-to-validate-next">Next steps</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</nav>

## Shake flasks: orbit, speed and fill

For unbaffled glass flasks, I use Meier’s maximum oxygen-transfer correlation and convert it to $k_La$ using water oxygen solubility <a href="#ref-1">[1]</a>. The first comparison holds nominal flask size at 250 mL and changes one operating variable at a time. The assumed maximum inner diameter is 77 mm, with temperature held at 37 °C and osmolality at 0.3 osmol/kg.

<figure class="xdr-figure">

  <a href="/project-previews/shake_flask_orbit_fill.svg/" target="_blank" rel="noopener noreferrer" aria-label="Open this figure at full size">
    <img src="/project-previews/shake_flask_orbit_fill.svg/" alt="Predicted oxygen kLa against shaking speed for an assumed 250 mL unbaffled flask. The left panel compares 19, 25 and 50 mm orbital diameters at 50 mL fill. The right compares 25, 50 and 75 mL liquid fills at 50 mm orbit." width="1716" height="836" loading="lazy" decoding="async" />
  </a>

<figcaption>Estimated oxygen transfer in a 250 mL unbaffled flask using Meier’s correlation <a href="#ref-1">[1]</a>. Orbit means full orbital diameter. Points are model estimates; connecting lines show the calculated trends.</figcaption>
</figure>

At 200 rpm and 50 mL fill, increasing the orbit from 25 to 50 mm raises predicted $k_La$ from 38.2 to 48.1 h⁻¹. Lower fill also increases predicted transfer per liquid volume. These comparisons make orbit and fill useful starting points when matching oxygen supply between flask conditions.

The full study covers 720 combinations of nominal size, baffles, orbit, speed and fill. It includes a separate transfer model based on Schiefelbein’s disposable-flask data and publisher workbook <a href="#ref-2">[2]</a>.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Shake-flask study conditions" tabindex="0">

| Variable | Conditions studied |
| --- | --- |
| Nominal flask size | 50, 100, 125, 250, 500, 1,000, 2,000 and 3,000 mL |
| Flask configuration | Unbaffled glass and generic baffled disposable flasks |
| Orbital diameter | 19, 25 and 50 mm |
| Shaking speed | 100–300 rpm, in 50 rpm steps |
| Liquid fill | 10%, 20% and 30% of nominal volume |
| Oxygen-transfer model | Meier for unbaffled glass <a href="#ref-1">[1]</a>; Schiefelbein for the baffled/disposable cases <a href="#ref-2">[2]</a> |

</div>

The saved study contains 396 numerical $k_La$ estimates and 324 unavailable predictions. Missing predictions stay blank rather than being treated as zero. For example, the disposable-flask model is limited to a 50 mm orbit and its supported size, speed, fill and temperature ranges. Some unbaffled cases exceed Meier’s reported fill or diameter range and are retained as flagged extrapolations; the 250 mL comparison above stays within those bounds.

These are screening calculations using assumed dimensions and flask families; they still need calibration against the vessels I intend to use. The baffled and unbaffled cases use different materials and correlations, so their difference cannot be attributed to baffles alone. Flask headspace oxygen is held fixed, and the model does not yet account for the resistance of the cap or closure.

## Wave bioreactors: motion and oxygen supply

For the rocking-bag study, I use Piontek’s RM10 oxygen-transfer correlation, which relates $k_La$ to rocking rate, angle and liquid volume <a href="#ref-3">[3]</a>. I then couple oxygen transfer to a well-mixed liquid and a gas balance with continuous headspace sweep.

The example uses a nominal 10 L bag with 4 L liquid and 6 L headspace at 37 °C. The baseline is 24 rpm at ±7°, with 300 standard mL/min of inlet gas containing 20.95% O₂ and 5% CO₂, balanced with N₂. Standard flow is referenced to 0 °C and 1 atm; gas fractions are on a dry basis.

<figure class="xdr-figure">

  <a href="/project-previews/wave_capacity_power.svg/" target="_blank" rel="noopener noreferrer" aria-label="Open this figure at full size">
    <img src="/project-previews/wave_capacity_power.svg/" alt="Two maps at 4 L fill showing the effects of rocking rate and angle. The first shows predicted cell-density capacity at 40 percent dissolved oxygen; the second shows the uncalibrated liquid power estimate. Both mark the 24 rpm, 7 degree baseline." width="1716" height="990" loading="lazy" decoding="async" />
  </a>

<figcaption>Predicted capacity at an illustrative 40% DO target and estimated liquid P/V at 4 L fill. Capacity uses 300 standard mL/min sweep and an oxygen uptake rate of 5.5 pmol per cell per day. The outlined marker identifies 24 rpm and 7°.</figcaption>
</figure>

At the baseline, predicted $k_La$ is 11.1 h⁻¹ and the steady oxygen balance supports about 5.87 million cells/mL at 40% DO. This capacity is conditional on the chosen uptake rate and gas supply. It does not represent a growth or productivity prediction.

The power estimate assumes a rectangular 0.40 × 0.35 m liquid footprint and complete dissipation of the change in gravitational potential energy twice per rocking cycle. It gives 27.4 W/m³ at the baseline. I use it to explore mechanical trends; it is uncalibrated and does not represent measured electrical power or local shear.

Piontek’s correlation was developed for Sartorius RM bags in PBS with Pluronic <a href="#ref-3">[3]</a>. Applying it to this assumed Cellbag geometry is provisional, even though the rocking settings and fill fall within the correlation’s numerical range.

## When oxygen demand exceeds supply

I compared two fixed cell densities with the same bag, motion and gas supply. Both runs start at 100% air saturation, with oxygen uptake fixed at 5.5 pmol per cell per day and respiratory quotient set to 1.

<figure class="xdr-figure">

  <a href="/project-previews/wave_oxygen_demand.svg/" target="_blank" rel="noopener noreferrer" aria-label="Open this figure at full size">
    <img src="/project-previews/wave_oxygen_demand.svg/" alt="Dissolved oxygen over time at two fixed cell densities. At 2 million cells per mL, dissolved oxygen approaches about 79.5 percent air saturation over 120 minutes. At 20 million cells per mL, it falls to zero in about 3.92 minutes. The panels use different time windows." width="1716" height="814" loading="lazy" decoding="async" />
  </a>

<figcaption>Simulated dissolved oxygen at 2 and 20 million cells/mL. The panels use different time windows. Dotted lines mark 40% air saturation. The high-demand calculation stops when dissolved oxygen reaches zero.</figcaption>
</figure>

At 2 million cells/mL, DO is 79.5% after 120 minutes. At 20 million cells/mL, oxygen is depleted after 3.92 minutes, while dry headspace oxygen is still 20.81%. Oxygen remains available above the liquid, but transfer into the liquid cannot keep up with the imposed demand. This is the connection I want to carry forward from the surface $k_La$ project: headspace oxygen availability and liquid-side transfer capacity both matter.

These runs hold cell density, temperature and liquid volume fixed. They do not include cell growth or a DO controller.

## What I want to validate next

I want to replace the assumed flask and bag dimensions with measured geometry, compare predicted $k_La$ with experiments across orbit or rocking settings and fill, and check the wave-bag power estimate against measurements. Flask closure resistance and bag sweep rate are also worth testing separately from liquid-side transfer.

For now, the page documents the model structure and the first comparisons. The next step is to establish which predictions hold for the actual vessels and culture conditions.

## References

<ol class="project-references">
  <li id="ref-1">Meier et al. (2016). <a href="https://doi.org/10.1016/j.bej.2016.01.014">Correlation for the maximum oxygen transfer capacity in shake flasks for a wide range of operating conditions and for different culture media</a>. Biochemical Engineering Journal, 109, 228–235.</li>
  <li id="ref-2">Schiefelbein et al. (2013). <a href="https://doi.org/10.1007/s10529-013-1203-9">Oxygen supply in disposable shake-flasks: prediction of oxygen transfer rate, oxygen saturation and maximum cell concentration during aerobic growth</a>. Biotechnology Letters, 35, 1223–1230. Coefficients from the <a href="https://media.springernature.com/original/springer-static/esm/art%3A10.1007%2Fs10529-013-1203-9/MediaObjects/10529_2013_1203_MOESM1_ESM.xlsx">publisher’s supplementary workbook</a>.</li>
  <li id="ref-3">Piontek et al. (2026). <a href="https://doi.org/10.3389/fbioe.2025.1688774">Modeling and validating of oxygen transport in wave bioreactors: optimized experimental mass transfer method and novel Lattice-Boltzmann CFD approach</a>. Frontiers in Bioengineering and Biotechnology, 13, 1688774.</li>
</ol>

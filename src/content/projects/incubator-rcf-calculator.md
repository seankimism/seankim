---
title: "Incubator RCF calculator"
description: "Translate shaking speed between incubators with different orbital diameters using equal nominal orbital acceleration."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-10-04"
period: "2026–present"
tags: ["Tech transfer", "Shake flasks", "Orbital RCF", "Calculator"]
order: 3
draft: false
---

<p class="project-lede">During tech transfer, the same rpm can give different nominal acceleration when incubators use different orbital diameters. This calculator converts a documented source speed and orbit into a receiving speed with equal orbital relative centrifugal force (RCF). Use the result as a starting setting to evaluate at the receiving site.</p>

## Compare source and receiving settings

Enter the source speed, each incubator's full orbital diameter, and the receiving equipment's speed limits. Orbit means the diameter of the shaker platform's circular path, rather than the flask diameter.

For example, **120 rpm on a 25 mm orbit** gives a receiving setting of **85 rpm on a 50 mm orbit**, after rounding to the nearest whole rpm. The calculator checks the receiving speed limits and displays the source and receiving RCF at these settings.

<figure class="xdr-explorer">
  <iframe src="/incubator-rcf/index.html" title="Incubator RCF calculator: match nominal orbital acceleration between source and receiving shaker settings" width="800" height="1100" loading="lazy" data-content-height></iframe>
  <figcaption><a href="/incubator-rcf/index.html" target="_blank" rel="noopener noreferrer">Open the RCF calculator in a full window ↗</a> · <a href="/incubator-rcf/methodology.html" target="_blank" rel="noopener noreferrer">Calculation and sources ↗</a></figcaption>
</figure>

The [calculation and sources](/incubator-rcf/methodology.html) explain the orbital RCF equation, speed conversion and manufacturer guidance. Inputs are calculated in the browser and are not sent to a server.

## Other methods for relating flask scale to rpm

RCF matches nominal shaker acceleration. It does not account for flask size, geometry, working volume or liquid properties. Changing flask scale can change liquid motion and mixing, so **equal RCF alone is not sufficient to transfer a process between different flask scales**. [Kuhner's guidance](https://kuhner.com/wAssets/docs/download/KuhnerNotes/EquipNote_Change-Orbit-Diameter_2025.pdf) illustrates how vessel size changes the liquid environment.

For a scale change, assess a process-relevant criterion such as **power input per liquid volume (P/V, W/m³)**, measured mixing time or oxygen-transfer capacity where relevant. Use measurements or correlations supported for the actual vessels and operating conditions; published P/V relationships have limits on the flask sizes and flow regimes studied. [Dinter et al., section 2.3](https://publications.rwth-aachen.de/record/1000106/files/1000106.pdf) describe one such correlation and its experimental basis. Confirm culture performance at the receiving site before treating the transfer as equivalent.

Several criteria can guide a shake-flask scale change. Each preserves a different feature of the liquid environment, so they can give different receiving speeds. **Moving to a larger flask is different from increasing the working volume in the same flask.** Record the actual inner diameter, working volume, orbit and liquid properties before choosing a criterion.

<div class="flask-methods-table" role="region" aria-label="Shake-flask scaling methods" tabindex="0">
<table>
  <thead><tr><th scope="col">Method</th><th scope="col">Scale to RPM</th></tr></thead>
  <tbody>
    <tr>
      <th scope="row">Constant Reynolds number (Re)</th>
      <td><p>For the same liquid, match the balance of inertial and viscous effects using shaking frequency and inner flask diameter. A larger diameter gives a lower rpm under this criterion.</p><p class="method-source"><a href="https://publications.rwth-aachen.de/record/1000106/files/1000106.pdf">Dinter et al., equations 6–8</a></p></td>
    </tr>
    <tr>
      <th scope="row">Constant measured mixing time</th>
      <td><p>Measure how long each flask and fill takes to reach the same defined degree of homogeneity, then select a receiving rpm that matches that time. Shake-flask mixing-time measurements have been published.</p><p class="method-source"><a href="https://doi.org/10.1016/j.ces.2010.11.001">Tan et al. (2011)</a></p></td>
    </tr>
    <tr>
      <th scope="row">Constant maximum local energy dissipation</th>
      <td><p>Use an applicable correlation or validated vessel model to find the rpm giving the same estimated maximum local dissipation, a stress-related quantity in W/kg. Peter et al. developed a shake-flask correlation from droplet-size experiments.</p><p class="method-source"><a href="https://pubmed.ncbi.nlm.nih.gov/16470882/">Peter et al. (2006)</a></p></td>
    </tr>
    <tr>
      <th scope="row">Constant oxygen-transfer capacity</th>
      <td><p>Match measured or appropriately modeled kLa or maximum oxygen-transfer capacity. Meier&#x27;s correlation includes rpm, working volume, inner diameter, orbit and medium osmolality.</p><p class="method-source"><a href="https://doi.org/10.1016/j.bej.2016.01.014">Meier et al. (2016)</a></p></td>
    </tr>
  </tbody>
</table>
</div>

### A conditional Reynolds scaling example

The published definition is Re = nd²/ν, where **n** is shaking frequency in revolutions per second, **d** is maximum inner flask diameter and **ν** is kinematic viscosity. For the same liquid, matching Re gives:

$$
\frac{\mathrm{rpm}_2}{\mathrm{rpm}_1} = \left(\frac{d_1}{d_2}\right)^2
$$

Subscripts 1 and 2 mean source and receiving conditions. If the flasks are **geometrically similar and operated at the same fill fraction**, diameter scales with the cube root of volume. The relationship can then be written using working liquid volume V:

$$
\frac{\mathrm{rpm}_2}{\mathrm{rpm}_1} = \left(\frac{V_1}{V_2}\right)^{2/3}
$$

Under those assumptions, doubling flask scale and working volume gives approximately **0.63 × the source rpm**. This is an algebraic consequence of the Reynolds definition, **not a validated culture-transfer recipe**. It does not apply to adding more liquid to the same flask, and matching Re does not guarantee the same flow regime. The Reynolds definition and flow-regime considerations are described by [Dinter et al.](https://publications.rwth-aachen.de/record/1000106/files/1000106.pdf).

Orbital RCF has no flask-volume term: at a fixed orbit, matching RCF preserves rpm. A volume-aware transfer therefore needs an additional criterion supported for the actual vessels and conditions, followed by confirmation of culture performance.

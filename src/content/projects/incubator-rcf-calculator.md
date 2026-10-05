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

## Limitations for tech transfer

RCF matches nominal shaker acceleration. It does not account for flask size, geometry, working volume or liquid properties. Changing flask scale can change liquid motion and mixing, so **equal RCF alone is not sufficient to transfer a process between different flask scales**. [Kuhner's guidance](https://kuhner.com/wAssets/docs/download/KuhnerNotes/EquipNote_Change-Orbit-Diameter_2025.pdf) illustrates how vessel size changes the liquid environment.

For a scale change, assess a process-relevant criterion such as **power input per liquid volume (P/V, W/m³)**, measured mixing time or oxygen-transfer capacity where relevant. Use measurements or correlations supported for the actual vessels and operating conditions; published P/V relationships have limits on the flask sizes and flow regimes studied. [Dinter et al., section 2.3](https://publications.rwth-aachen.de/record/1000106/files/1000106.pdf) describe one such correlation and its experimental basis. Confirm culture performance at the receiving site before treating the transfer as equivalent.

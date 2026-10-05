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

<p class="project-lede">During tech transfer, the same rpm can give different nominal acceleration when incubators use different orbital diameters. This calculator converts a documented source speed and orbit into a receiving speed with equal orbital relative centrifugal force (RCF). Use the result as a starting setting to record and evaluate at the receiving site. Matching RCF does not establish equal mixing, oxygen transfer or culture performance.</p>

## Compare source and receiving settings

Enter the source speed, each incubator's full orbital diameter, and the receiving equipment's speed limits. Orbit means the diameter of the shaker platform's circular path, rather than the flask diameter. Flask construction, nominal volume and working fill can be recorded alongside the settings; they do not change the RCF calculation.

For example, **120 rpm on a 25 mm orbit** matches **84.852813742 rpm on a 50 mm orbit**. Rounding to **85 rpm** gives **100.347%** of the source's nominal orbital RCF. The calculator checks whether the receiving speed falls within the entered equipment limits and reports the effect of rounding.

<figure class="xdr-explorer">
  <iframe src="/incubator-rcf/index.html" title="Incubator RCF calculator: match nominal orbital acceleration between source and receiving shaker settings" width="800" height="1100" loading="lazy" data-content-height></iframe>
  <figcaption><a href="/incubator-rcf/index.html" target="_blank" rel="noopener noreferrer">Open the RCF calculator in a full window ↗</a> · <a href="/incubator-rcf/methodology.html" target="_blank" rel="noopener noreferrer">Calculation and sources ↗</a></figcaption>
</figure>

## Record the transfer conditions

Record both incubator models and installed orbits, source and receiving speeds, flask and closure products, working fill, and culture conditions. An RCF match provides a documented comparison of nominal shaker acceleration; evaluate the receiving culture under its actual operating conditions.

The [calculation and sources](/incubator-rcf/methodology.html) explain the orbital RCF equation, speed conversion and manufacturer guidance. Inputs are calculated in the browser and are not sent to a server.

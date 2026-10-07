---
title: "Shake-flask P/V scale-up calculator"
description: "A draft calculator for comparing mean liquid power per volume across supported shake-flask conditions."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-10-06"
period: "2026–present"
tags: ["Shake flasks", "Power per volume", "Tech transfer", "Calculator"]
order: 4
draft: true
---

<p class="eyebrow">Calculator draft · Development preview</p>

The published [incubator RCF calculator](/projects/incubator-rcf-calculator/) matches nominal shaker acceleration. A change in flask size or working volume also changes the liquid environment. This draft explores **mean power input per liquid volume (P/V, W/m³)** as an additional transfer criterion: estimate the source power with a published correlation, then solve for a receiving speed within the tool's stated coverage.

## Compare source and receiving power

The preview starts with an **illustrative glass-flask example**, using entered inner diameters rather than inferring them from nominal capacity. It checks flask construction, conservative operating coverage, liquid behavior, flow conditions and receiving speed limits. Dimensions and liquid properties are example values to replace for the actual vessels and medium.

<figure class="xdr-explorer">
  <iframe src="/project-previews/shake-flask-pv/vessel-agitation.html/" title="Draft shake-flask P/V scale-up calculator: compare source and receiving power per working liquid volume" width="800" height="1100" loading="lazy" data-content-height></iframe>
  <figcaption><a href="/project-previews/shake-flask-pv/vessel-agitation.html/" target="_blank" rel="noopener noreferrer">Open the draft calculator in a full window ↗</a> · <a href="/project-previews/shake-flask-pv/agitation-methodology.html/" target="_blank" rel="noopener noreferrer">P/V calculation and sources ↗</a></figcaption>
</figure>

The numerical route is conservatively limited to conventional unbaffled glass flasks, with additional size, speed, fill, orbit and flow checks. These policy bounds do not establish validation of every combination. The equation has no explicit orbit term; orbit affects the flow checks rather than providing a general correction to power.

The **125 mL plastic reference with 30 mL working volume, 120 rpm and 25 mm orbit** remains a separate case. This model does not establish its P/V or a receiving speed. It needs vessel-specific measured power or an applicable validated model. A desired 30 W/m³ is a target, not a measurement of source power.

## Choosing a transfer criterion

P/V is one engineering comparison, not a universal best rule. A CHO study used matched mean P/V across shaken systems and a stirred reactor; its findings support investigating this criterion within the studied conditions. [Neuss et al. (2025)](https://link.springer.com/article/10.1186/s13036-024-00475-8).

The [published flask-scaling discussion](/projects/incubator-rcf-calculator/#other-methods-for-relating-flask-scale-to-rpm) compares alternatives such as Reynolds number, measured mixing time, local energy dissipation and oxygen-transfer capacity, with their sources.

Only mean P/V is calculated in this draft. Matching it does not establish equal local shear, gas transfer, mixing time or culture performance. Confirm growth, viability and product performance at the receiving site before treating the transfer as equivalent.

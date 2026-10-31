---
title: "Shake-flask baffles and mixing"
description: "An exploratory CFD comparison of startup tracer mixing in plain and four-baffle 250 mL flask models, with paired concentration videos."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-10-31"
period: "2026–present"
tags: ["Shake flasks", "CFD", "Mixing", "Baffle geometry"]
order: 4
draft: true
---

<p class="project-lede">I compared plain and four-baffle shake-flask models to see how baffles change startup mixing under matched conditions. The videos show a passive tracer spreading from a stationary initial tag. The mixing times are preliminary model results.</p>

## Matched flasks and conditions

I used two 250 mL flask families: a DURAN-style glass body with four pressed baffles and a Biofil-style plastic body with four V-folds. Each baffled model has a matching plain control. The internal baffle shapes are assumed research geometries rather than verified replicas of commercial flasks.

<dl class="xdr-conditions">
  <div><dt>Nominal flask size</dt><dd>250 mL</dd></div>
  <div><dt>Water fill</dt><dd>60 mL</dd></div>
  <div><dt>Shaking speed</dt><dd>125 rpm</dd></div>
  <div><dt>Orbit</dt><dd>25 mm diameter</dd></div>
  <div><dt>Temperature</dt><dd>36.5 °C</dd></div>
  <div><dt>Initial tracer tag</dt><dd>1 mL-equivalent of existing water</dd></div>
</dl>

The tag occupies a small central surface region before shaking starts, while the liquid is stationary. It adds no liquid volume or injection jet: total water remains 60 mL. This isolates redistribution of an initial tag; it does not simulate adding a separate feed stream during shaking.

## Surface concentration videos

Each video places **No baffles** on the left and **Four baffles** on the right at matching physical times. Playback is **0.5× speed**. Color represents tracer concentration divided by its uniform reference: **0 is blue, 1 is off-white and 2 is red**. Values at or above 2 saturate red for display; the underlying data are unchanged. The initial tagged region is approximately 60 times the uniform reference.

These views show the exterior liquid surface. A uniform-looking surface does not establish whole-volume mixing; the times below come from liquid-volume metrics.

### DURAN-style glass

<figure class="research-video" id="duran-mixing-video">
  <video controls muted playsinline preload="metadata" width="1920" height="1080" poster="/flask-mixing/duran_poster.jpg" aria-label="DURAN-style startup tracer mixing: no baffles on the left and four baffles on the right">
    <source src="/flask-mixing/duran_plain_vs_baffled.webm" type="video/webm" />
    <source src="/flask-mixing/duran_plain_vs_baffled.mp4" type="video/mp4" />
    <a href="/flask-mixing/duran_plain_vs_baffled.mp4">Download the DURAN comparison video.</a>
  </video>
  <figcaption>Physical time 0–3.24 s, shown in 6.56 s at half speed. The panels share a camera and concentration scale. <a href="/flask-mixing/duran_plain_vs_baffled.mp4">MP4</a> · <a href="/flask-mixing/duran_plain_vs_baffled.webm">WebM</a></figcaption>
</figure>

### Biofil-style plastic

<figure class="research-video" id="biofil-mixing-video">
  <video controls muted playsinline preload="metadata" width="1920" height="1080" poster="/flask-mixing/biofil_poster.jpg" aria-label="Biofil-style startup tracer mixing: no baffles on the left and four baffles on the right">
    <source src="/flask-mixing/biofil_plain_vs_baffled.webm" type="video/webm" />
    <source src="/flask-mixing/biofil_plain_vs_baffled.mp4" type="video/mp4" />
    <a href="/flask-mixing/biofil_plain_vs_baffled.mp4">Download the Biofil comparison video.</a>
  </video>
  <figcaption>Physical time 0–2.88 s, shown in 5.84 s at half speed. Biofil plain uses the completed recovered scalar run. <a href="/flask-mixing/biofil_plain_vs_baffled.mp4">MP4</a> · <a href="/flask-mixing/biofil_plain_vs_baffled.webm">WebM</a></figcaption>
</figure>

## Whole-volume mixing onsets

I define **t95** and **t99** as the first saved times when 95% or 99% of the liquid volume lies within ±5% of the fixed-dose uniform concentration. That condition must then persist for at least **0.96 s**. The onset times have **0.04 s** sampling resolution.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Preliminary whole-volume tracer mixing onsets and saved run endpoints" tabindex="0">

| Model | Baffles | t95, s | t99, s | Saved stop, s |
| --- | --- | ---: | ---: | ---: |
| DURAN-style glass | None | 2.48 | 2.72 | 3.72 |
| DURAN-style glass | Four | 2.16 | 2.24 | 3.24 |
| Biofil-style plastic | None | 2.44 | 2.76 | 3.76 |
| Biofil-style plastic | Four | 1.80 | 1.88 | 2.88 |

</div>

Within these models, four baffles shortened t99 by **17.6%** for the DURAN-style pair and **31.9%** for the Biofil-style pair. Both full plain runs continued beyond their paired video's endpoint to complete the persistence check. The 3.24 s and 2.88 s clips therefore do not show the full 0.96 s confirmation window for the plain cases.

The two families also have different body shapes. Their cross-family difference cannot be attributed to pressed baffles versus V-folds alone.

## Methods and current limits

These are **exploratory saved-flow results**. A time-step-halving check passed, but the replay failed a matched startup concentration-pattern comparison with a coupled pilot: maximum normalized L1 difference **18.94%** and relative L2 difference **19.60%**. These are concentration-field discrepancies, **not measured mixing-time errors**. Absolute mixing-time accuracy and confidence in the ranking remain unvalidated.

The assumed baffle dimensions, mesh and wetting behavior also need sensitivity checks and experimental validation. The results do not establish cell-culture growth, shear safety or oxygen-transfer performance.

<details class="xdr-details">
  <summary>Tracer transport, visualization and recovery details</summary>

I transported a passive scalar through the original saved startup CFD flow. All four scalar runs ended before the first continuation-method handoff, so the later accelerated flow histories were not consumed. Integration used 0.0003125 s steps and a tracer diffusivity of 9 × 10⁻¹⁰ m²/s. The videos render existing saved fields; making the animations does not rerun the flow or tracer calculations.

The uniform reference is $C_\mathrm{ref}(t)=M_0/V_\mathrm{liq}(t)$, where $M_0$ is the fixed initial volume-weighted tracer inventory. The current liquid volume uses water-volume fractions bounded to 0–1 for this normalization. Surface color uses water-fraction-weighted cell-to-point interpolation, $\mathrm{Point}(\alpha C/C_\mathrm{ref})/\mathrm{Point}(\alpha)$, on the liquid region $\mathrm{Point}(\alpha)\geq0.5$.

The first Biofil plain attempt stopped after detecting a tiny inherited liquid-fraction overshoot. A separate recovery bounded only the private source's internal water fraction and adjusted mixture density in the affected cells. Its largest water-volume change was 5.738 × 10⁻¹⁰ of the initial volume. Initial dose and concentration fields were preserved, and the original numerical-health and mixing thresholds stayed in force. The table uses this completed recovery, not the failed attempt.

The DURAN videos contain 82 native snapshots and the Biofil videos 73, at 0.04 s intervals. Each snapshot is repeated twice at 25 fps, with no temporal field interpolation. Including the last snapshot holds it for 0.08 s, which explains the difference between twice the final physical timestamp and the file duration. There is no added experimental footage or synthetic motion.

[Media properties, checksums and study provenance](/flask-mixing/manifest.json).

</details>

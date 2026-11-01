---
title: "Shake-flask baffles and mixing"
description: "An exploratory CFD comparison of startup tracer mixing in plain and four-baffle 250 mL flask models, with paired concentration videos."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-10-31"
period: "October 2026"
tags: ["Shake flasks", "CFD", "Mixing", "Baffle geometry"]
order: 4
draft: false
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

## Flask geometries

These 3D views show the interior-wall model surfaces used to define the CFD domains. Caps, threads and wall thickness are omitted. Each plain flask is paired with the corresponding baffled body, using the same camera and scale. Teal highlights the baffle features.

<figure class="xdr-figure" id="duran-flask-geometries">
  <a href="/flask-mixing/geometry/duran_geometry_comparison.png" target="_blank" rel="noopener noreferrer" aria-label="Open the DURAN-style flask geometry comparison at full size">
    <img src="/flask-mixing/geometry/duran_geometry_comparison.webp" alt="3D interior-wall models of the DURAN-style glass flask: no baffles on the left and four pressed baffles highlighted in teal on the right, with full-flask views above lower-body cutaway details." width="2400" height="1800" loading="lazy" decoding="async" />
  </a>
  <figcaption>DURAN-style glass: <strong>No baffles</strong> on the left and <strong>Four pressed baffles</strong> on the right. The lower cutaway views expose the base geometry for a closer comparison. <a href="/flask-mixing/geometry/duran_geometry_comparison.png">Full-size PNG</a>.</figcaption>
</figure>

<figure class="xdr-figure" id="biofil-flask-geometries">
  <a href="/flask-mixing/geometry/biofil_geometry_comparison.png" target="_blank" rel="noopener noreferrer" aria-label="Open the Biofil-style flask geometry comparison at full size">
    <img src="/flask-mixing/geometry/biofil_geometry_comparison.webp" alt="3D interior-wall models of the Biofil-style plastic flask: no baffles on the left and four V-fold baffles highlighted in teal on the right, with full-flask views above lower-body cutaway details." width="2400" height="1800" loading="lazy" decoding="async" />
  </a>
  <figcaption>Biofil-style plastic: <strong>No baffles</strong> on the left and <strong>Four V-folds</strong> on the right. The lower cutaway views expose the folded base geometry. <a href="/flask-mixing/geometry/biofil_geometry_comparison.png">Full-size PNG</a>.</figcaption>
</figure>

## Surface concentration videos

Each video places **No baffles** on the left and **Four baffles** on the right at matching physical times. Playback is **0.5× speed**. Color represents tracer concentration divided by its uniform reference: **0 is blue, 1 is off-white and 2 is red**. Values at or above 2 saturate red for display; the underlying data are unchanged. The initial tagged region is approximately 60 times the uniform reference.

These views show the exterior liquid surface. A uniform-looking surface does not establish whole-volume mixing; the times below come from liquid-volume metrics.

### DURAN-style glass

<figure class="research-video" id="duran-mixing-video">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="3zvR3yYa11w" data-youtube-title="DURAN-style flask mixing: no baffles vs four baffles | CFD">
    <button type="button" class="youtube-player__button" aria-label="Play DURAN-style startup tracer mixing: no baffles on the left and four baffles on the right">
      <img src="/flask-mixing/duran_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Physical time 0–3.24 s, shown in 6.56 s at half speed. The panels share a camera and concentration scale. <a href="/flask-mixing/duran_plain_vs_baffled.mp4">MP4</a> · <a href="/flask-mixing/duran_plain_vs_baffled.webm">WebM</a> · <a href="https://www.youtube.com/watch?v=3zvR3yYa11w" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>
</figure>

### Biofil-style plastic

<figure class="research-video" id="biofil-mixing-video">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="dXgKskhZURg" data-youtube-title="Biofil-style flask mixing: no baffles vs four V-folds | CFD">
    <button type="button" class="youtube-player__button" aria-label="Play Biofil-style startup tracer mixing: no baffles on the left and four baffles on the right">
      <img src="/flask-mixing/biofil_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Physical time 0–2.88 s, shown in 5.84 s at half speed. Biofil plain uses the completed recovered scalar run. <a href="/flask-mixing/biofil_plain_vs_baffled.mp4">MP4</a> · <a href="/flask-mixing/biofil_plain_vs_baffled.webm">WebM</a> · <a href="https://www.youtube.com/watch?v=dXgKskhZURg" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>
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

## Sneak peek: what I’m working on

I’m preparing stirred-bioreactor models to extend this work beyond shake flasks. These five-second previews show rigid shaft and impeller rotation at an illustrative 60 rpm, ahead of future flow and mixing studies. Each video pairs a vessel overview on the left with an impeller detail on the right.

### ambr 15

<figure class="research-video" id="ambr15-impeller-preview">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="PrsU_MnOX-M" data-youtube-title="ambr 15 impeller rotation | CAD preview">
    <button type="button" class="youtube-player__button" aria-label="Play Supplied ambr 15 project geometry with its shaft and impeller rotating: vessel overview on the left and impeller detail on the right">
      <img src="/bioreactor-preview/ambr15_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Supplied ambr 15 project CAD. The transparent cavity shows the modeled internal boundary. The shaft and impeller rotate while the body and fixed hardware remain stationary. The displayed speed is illustrative, not a culture operating condition. <a href="/bioreactor-preview/ambr15_impeller_spin.mp4">MP4</a> · <a href="https://www.youtube.com/watch?v=PrsU_MnOX-M" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>
</figure>

### ambr 250

<figure class="research-video" id="ambr250-impeller-preview">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="FWAqatsLyxU" data-youtube-title="ambr 250 mammalian impeller rotation | CAD preview">
    <button type="button" class="youtube-player__button" aria-label="Play Supplied ambr 250 project geometry with its shaft and impeller assembly rotating: vessel overview on the left and impeller detail on the right">
      <img src="/bioreactor-preview/ambr250_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Supplied ambr 250 project CAD. The transparent cavity shows the modeled internal boundary. Only the shaft and impellers rotate; the body, baffles, sparger and probes remain stationary. The displayed speed is illustrative, not a culture operating condition. <a href="/bioreactor-preview/ambr250_impeller_spin.mp4">MP4</a> · <a href="https://www.youtube.com/watch?v=FWAqatsLyxU" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>
</figure>

### Glass stirred bioreactor

<figure class="research-video" id="glass-impeller-preview">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="GOw6ksUTgXU" data-youtube-title="Glass bioreactor impeller rotation | CAD preview">
    <button type="button" class="youtube-player__button" aria-label="Play Glass stirred bioreactor geometry with its shaft and three-blade impeller rotating: vessel overview on the left and impeller detail on the right">
      <img src="/bioreactor-preview/glass_vessel_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Getinge / Applikon Bio 3 L display geometry. Five-second geometry-only animation at an illustrative 60 rpm; the vessel and fixed hardware remain stationary. <a href="https://www.getinge.com/assets/content/appliflex-2/Bio_3L.glb">Manufacturer model</a> · <a href="/bioreactor-preview/glass_vessel_impeller_spin.mp4">MP4</a> · <a href="https://www.youtube.com/watch?v=GOw6ksUTgXU" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>
</figure>

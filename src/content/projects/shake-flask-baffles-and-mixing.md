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

I used two 250 mL flask families: one with four pressed baffles and one with four V-fold baffles. Each baffled model has a matching plain control. The internal baffle shapes are assumed research geometries rather than verified replicas of commercial flasks.

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

Rotate and zoom the paired models to compare their shapes. The vertical cutaway starts enabled so you can look inside; adjust its angle and position to inspect the baffles at the base.

### Pressed baffles

<div class="flask-viewer" data-family="glass" aria-label="Interactive pressed-baffle geometry comparison"><p>Enable JavaScript for interactive 3D, or <a href="/flask-mixing/geometry/duran_geometry_comparison.png">view the pressed-baffle geometry comparison image</a>.</p></div>

### V-fold baffles

<div class="flask-viewer" data-family="plastic" aria-label="Interactive V-fold geometry comparison"><p>Enable JavaScript for interactive 3D, or <a href="/flask-mixing/geometry/biofil_geometry_comparison.png">view the V-fold geometry comparison image</a>.</p></div>

These are the exact interior-wall surfaces used to define the CFD domains. Caps, threads and physical wall thickness are omitted. The cutaway exposes the interior for viewing; it leaves the study geometry unchanged.

## Surface concentration videos

Each video places **No baffles** on the left and **Four baffles** on the right at matching physical times. Playback is **0.5× speed**. Color represents tracer concentration divided by its uniform reference: **0 is blue, 1 is off-white and 2 is red**. Values at or above 2 saturate red for display; the underlying data are unchanged. The initial tagged region is approximately 60 times the uniform reference.

These views show the exterior liquid surface. A uniform-looking surface does not establish whole-volume mixing; the times below come from liquid-volume metrics.

### Pressed baffles

<figure class="research-video" id="duran-mixing-video">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="3zvR3yYa11w" data-youtube-title="Pressed-baffle geometry mixing: no baffles vs four pressed baffles | CFD">
    <button type="button" class="youtube-player__button" aria-label="Play pressed-baffle geometry startup tracer mixing: no baffles on the left and four pressed baffles on the right">
      <img src="/flask-mixing/duran_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Physical time 0–3.24 s, shown in 6.56 s at half speed. The panels share a camera and concentration scale. <a href="/flask-mixing/duran_plain_vs_baffled.mp4">MP4</a> · <a href="/flask-mixing/duran_plain_vs_baffled.webm">WebM</a> · <a href="https://www.youtube.com/watch?v=3zvR3yYa11w" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>
</figure>

### V-fold baffles

<figure class="research-video" id="biofil-mixing-video">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="dXgKskhZURg" data-youtube-title="V-fold geometry mixing: no baffles vs four V-fold baffles | CFD">
    <button type="button" class="youtube-player__button" aria-label="Play V-fold geometry startup tracer mixing: no baffles on the left and four V-fold baffles on the right">
      <img src="/flask-mixing/biofil_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Physical time 0–2.88 s, shown in 5.84 s at half speed. The V-fold geometry's plain control uses the completed recovered scalar run. <a href="/flask-mixing/biofil_plain_vs_baffled.mp4">MP4</a> · <a href="/flask-mixing/biofil_plain_vs_baffled.webm">WebM</a> · <a href="https://www.youtube.com/watch?v=dXgKskhZURg" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>
</figure>

## Whole-volume mixing onsets

I define **t95** and **t99** as the first saved times when 95% or 99% of the liquid volume lies within ±5% of the fixed-dose uniform concentration.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Preliminary whole-volume tracer mixing onsets and saved run endpoints" tabindex="0">

| Model | Baffles | t95, s | t99, s | Saved stop, s |
| --- | --- | ---: | ---: | ---: |
| Pressed-baffle geometry | None | 2.48 | 2.72 | 3.72 |
| Pressed-baffle geometry | Four pressed | 2.16 | 2.24 | 3.24 |
| V-fold geometry | None | 2.44 | 2.76 | 3.76 |
| V-fold geometry | Four V-folds | 1.80 | 1.88 | 2.88 |

</div>

<figure class="xdr-figure" id="mixing-progress-graph">
  <a href="/flask-mixing/mixing_comparison.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the whole-volume mixing progress graph at full size">
    <img src="/flask-mixing/mixing_comparison.svg" alt="Mixing curves for all four flask cases: concentration variation above and the percentage of liquid within 5 percent of the uniform reference below." width="1596" height="1444" loading="lazy" decoding="async" />
  </a>
  <figcaption><strong>Mixing after shaking starts.</strong> 60 mL water · 125 rpm · 25 mm orbit diameter · 36.5 °C. The upper panel shows concentration variation (CoV = coefficient of variation); lower values mean more uniform mixing. The lower panel shows the approach to uniform concentration: liquid volume within ±5% of the reference, defined as initial tracer inventory divided by current liquid volume. Dashed lines are plain controls; solid lines have four baffles. Preliminary model results from the existing saved-flow tracer histories; t95 and t99 are listed in the table above. <a href="/flask-mixing/mixing_comparison.png">Download PNG</a>.</figcaption>
</figure>

Within these models, four pressed baffles shortened t99 by **17.6%** for the pressed-baffle pair, and four V-fold baffles shortened it by **31.9%** for the V-fold pair.

The two families also have different body shapes. Their cross-family difference cannot be attributed to pressed baffles versus V-folds alone.

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

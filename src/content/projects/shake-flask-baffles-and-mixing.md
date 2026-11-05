---
title: "Shake-flask baffles and mixing"
description: "A CFD comparison of mixing, local shear and calculated surface kLa in plain and four-baffle 250 mL flask models."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-10-31"
period: "2026–present"
tags: ["Shake flasks", "CFD", "Mixing", "Shear", "Oxygen transfer", "Baffle geometry"]
order: 4
draft: false
---

<p class="project-lede">I built this study to understand how baffle geometry changes liquid motion, mixing and shear in shake flasks. I compared pressed and V-fold baffles with their matching plain controls at the same fill and shaking conditions, then used my surface oxygen-transfer model to explore transfer at the moving interface. The results are preliminary.</p>

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#flask-geometries">Flask geometries</a></li>
    <li><a href="#local-shear">Local shear</a></li>
    <li><a href="#calculated-surface-kla">Calculated surface kLa</a></li>
    <li><a href="#plain-vs-baffled-comparisons">Comparison bars</a></li>
    <li><a href="#surface-concentration-videos">Startup mixing videos</a></li>
    <li><a href="#whole-volume-mixing-onsets">Mixing onsets</a></li>
    <li><a href="#sneak-peek-what-im-working-on">Sneak peek</a></li>
  </ol>
</nav>

## Matched flasks and conditions

I modeled two 250 mL flask shapes, one with four pressed baffles and one with four V-fold baffles. Each has a matching plain control so I can examine the effect of adding baffles within that flask shape. I could not verify the internal baffle dimensions against manufacturer drawings or measurements, so I use these as research geometries.

<dl class="xdr-conditions">
  <div><dt>Nominal flask size</dt><dd>250 mL</dd></div>
  <div><dt>Water fill</dt><dd>60 mL</dd></div>
  <div><dt>Shaking speed</dt><dd>125 rpm</dd></div>
  <div><dt>Orbit</dt><dd>25 mm diameter</dd></div>
  <div><dt>Temperature</dt><dd>36.5 °C</dd></div>
  <div><dt>Initial tracer tag</dt><dd>1 mL-equivalent of existing water</dd></div>
</dl>

For the mixing study, I tagged a small central region at the liquid surface while the flask was stationary, then started shaking. The tag represents 1 mL of the existing water, so the total fill stays at 60 mL. This lets me follow how an initial localized dose spreads without introducing a feed jet or changing the liquid volume.

## Flask geometries

Rotate and zoom the paired models to compare their shapes. The vertical cutaway starts enabled so you can look inside; adjust its angle and position to inspect the baffles at the base.

### Pressed baffles

<div class="flask-viewer" data-family="glass" aria-label="Interactive pressed-baffle geometry comparison"><p>Enable JavaScript for interactive 3D, or <a href="/flask-mixing/geometry/duran_geometry_comparison.png">view the pressed-baffle geometry comparison image</a>.</p></div>

### V-fold baffles

<div class="flask-viewer" data-family="plastic" aria-label="Interactive V-fold geometry comparison"><p>Enable JavaScript for interactive 3D, or <a href="/flask-mixing/geometry/biofil_geometry_comparison.png">view the V-fold geometry comparison image</a>.</p></div>

These interior-wall surfaces define the CFD domains. I omitted caps, threads and physical wall thickness. The cutaway is only a viewing tool; it does not change the geometry used in the simulations.

## Local shear

I calculated resolved equivalent viscous shear stress from the saved CFD velocity fields. The videos show this stress in pascals, with No baffles on the left and Four baffles on the right. Both panels use the same camera and color scale, and playback is at 0.5× speed.

### Pressed baffles

<figure class="research-video" id="pressed-shear-video">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="RNKOYUYAx-4" data-youtube-title="Pressed-baffle flasks: local shear | CFD">
    <button type="button" class="youtube-player__button" aria-label="Play Resolved local shear in pressed flask models: no baffles on the left and four pressed baffles on the right">
      <img src="/flask-mixing/draft-2026-11-04/pressed_shear_plain_vs_baffled_poster.png" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Pressed pair, physical time 0–15.08 s. The colors show the viscous shear resolved by the saved CFD fields. <a href="/flask-mixing/draft-2026-11-04/pressed_shear_plain_vs_baffled.mp4">MP4</a> · <a href="https://www.youtube.com/watch?v=RNKOYUYAx-4" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>.</figcaption>
</figure>

### V-fold baffles

<figure class="research-video" id="v-fold-shear-video">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="8ltH4BbKbk4" data-youtube-title="V-fold flasks: local shear | CFD">
    <button type="button" class="youtube-player__button" aria-label="Play Resolved local shear in V-fold flask models: no baffles on the left and four V-fold baffles on the right">
      <img src="/flask-mixing/draft-2026-11-04/v_fold_shear_plain_vs_baffled_poster.png" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>V-fold pair, physical time 0–11.24 s. Bright regions indicate stronger resolved shear; they are not predictions of cell damage. <a href="/flask-mixing/draft-2026-11-04/v_fold_shear_plain_vs_baffled.mp4">MP4</a> · <a href="https://www.youtube.com/watch?v=8ltH4BbKbk4" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>.</figcaption>
</figure>

## Calculated surface kLa

I used my [surface oxygen-transfer model](/projects/bioreactor-surface-gas-transfer/) to calculate the surface contribution to oxygen transfer. The videos show calculated surface kLa in h⁻¹. These are preliminary model estimates rather than experimentally validated measurements.

I applied the model using local resolved dissipation on the liquid side of the CFD’s diffuse air–water interface. This changes the dissipation basis from the vessel average used in the published model, so both the spatial pattern and the integrated estimate are exploratory. Color appears only on the interface; the rest of the liquid is gray. I did not simulate oxygen concentration or gas-transfer resistance through the flask closure.

### Pressed baffles

<figure class="research-video" id="pressed-local-transfer-video">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="v80xU6WvFfQ" data-youtube-title="Pressed-baffle flasks: calculated surface kLa | CFD">
    <button type="button" class="youtube-player__button" aria-label="Play calculated surface kLa in pressed flask models: no baffles on the left and four pressed baffles on the right">
      <img src="/flask-mixing/draft-2026-11-04/pressed_local_transfer_plain_vs_baffled_poster.png" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>Pressed pair, physical time 0–15.08 s at half speed. Colors show calculated surface kLa on a shared scale. <a href="/flask-mixing/draft-2026-11-04/pressed_local_transfer_plain_vs_baffled.mp4">MP4</a> · <a href="https://www.youtube.com/watch?v=v80xU6WvFfQ" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>.</figcaption>
</figure>

### V-fold baffles

<figure class="research-video" id="v-fold-local-transfer-video">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="V8lXnZm09T8" data-youtube-title="V-fold flasks: calculated surface kLa | CFD">
    <button type="button" class="youtube-player__button" aria-label="Play calculated surface kLa in V-fold flask models: no baffles on the left and four V-fold baffles on the right">
      <img src="/flask-mixing/draft-2026-11-04/v_fold_local_transfer_plain_vs_baffled_poster.png" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
  <figcaption>V-fold pair, physical time 0–11.24 s at half speed. Calculated surface kLa is sensitive to interface thickness and mesh resolution. <a href="/flask-mixing/draft-2026-11-04/v_fold_local_transfer_plain_vs_baffled.mp4">MP4</a> · <a href="https://www.youtube.com/watch?v=V8lXnZm09T8" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>.</figcaption>
</figure>

## Plain vs baffled comparisons

The upper row shows average shear in the liquid. In these preliminary simulations, both baffled models have higher average shear than their plain controls, with a larger change in the V-fold pair.

The lower row shows calculated surface kLa. Both baffled models have higher values than their plain controls, with a larger increase in the pressed pair. Each comparison pairs the baffled flask with its matching plain flask.

<figure class="xdr-figure" id="shear-transfer-comparison">
  <a href="/flask-mixing/draft-2026-11-04/flask_shear_transfer_comparison.svg?v=ebbb3a6de378" target="_blank" rel="noopener noreferrer" aria-label="Open the shear and calculated surface kLa comparison bars at full size">
    <img src="/flask-mixing/draft-2026-11-04/flask_shear_transfer_comparison.svg?v=ebbb3a6de378" alt="Two rows of paired bars compare average liquid shear stress and calculated surface kLa for plain and four-baffle models in the pressed and V-fold flask families." loading="lazy" decoding="async" />
  </a>
  <figcaption>Average liquid shear stress (top, Pa) and calculated surface kLa (bottom, h⁻¹). Gray bars represent plain flasks; blue bars represent flasks with four baffles. <a href="/flask-mixing/draft-2026-11-04/flask_shear_transfer_comparison.png?v=d07a590c43ee">Download PNG</a> · <a href="/flask-mixing/draft-2026-11-04/comparison.csv">Comparison data</a>.</figcaption>
</figure>

## Surface concentration videos

These videos follow the initial tracer tag as shaking starts, with No baffles on the left and Four baffles on the right at matching physical times. Playback is at 0.5× speed. Color shows tracer concentration divided by its uniform reference: 0 is blue, 1 is off-white and 2 is red. Values above 2 remain red, although the initial tagged region is approximately 60 times the uniform reference.

The videos show the liquid surface. I used the full liquid volume to calculate mixing times, because a uniform-looking surface can still hide concentration differences inside the flask.

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

I define t95 and t99 as the first saved times when 95% or 99% of the liquid volume lies within ±5% of the fixed-dose uniform concentration.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Preliminary whole-volume tracer mixing onsets and saved run endpoints" tabindex="0">

| Model | Baffles | t95, s | t99, s | Saved stop, s |
| --- | --- | ---: | ---: | ---: |
| Pressed-baffle geometry | None | 2.48 | 2.72 | 3.72 |
| Pressed-baffle geometry | Four pressed | 2.16 | 2.24 | 3.24 |
| V-fold geometry | None | 2.44 | 2.76 | 3.76 |
| V-fold geometry | Four V-folds | 1.80 | 1.88 | 2.88 |

</div>

<figure class="xdr-figure" id="mixing-progress-graph">
  <a href="/flask-mixing/mixing_comparison.svg?v=b70404a3fddd" target="_blank" rel="noopener noreferrer" aria-label="Open the whole-volume mixing progress graph at full size">
    <img src="/flask-mixing/mixing_comparison.svg?v=b70404a3fddd" alt="Mixing curves for all four flask cases: concentration variation above and the percentage of liquid within 5 percent of the uniform reference below." width="1596" height="1444" loading="lazy" decoding="async" />
  </a>
  <figcaption>Mixing after shaking starts, using 60 mL water at 125 rpm, a 25 mm orbit diameter and 36.5 °C. The upper panel shows concentration variation (CoV = coefficient of variation); lower values mean more uniform mixing. The lower panel shows the percentage of liquid within ±5% of the uniform reference, calculated as initial tracer inventory divided by current liquid volume. Dashed curves are plain controls; solid curves have four baffles. I calculated these preliminary results by transporting the tracer through the previously saved CFD flow fields. The table above lists t95 and t99. <a href="/flask-mixing/mixing_comparison.png?v=08c72ba50c31">Download PNG</a>.</figcaption>
</figure>

In these models, adding four pressed baffles shortened t99 by 17.6% relative to the matching plain flask. Four V-fold baffles shortened it by 31.9% relative to their plain control.

The two flask families also have different body shapes, so I cannot attribute the difference between families to baffle profile alone.

## Sneak peek: what I’m working on

I’m preparing stirred-bioreactor models to extend this work beyond shake flasks. These five-second previews show the shafts and impellers rotating at an illustrative 60 rpm. They are geometry animations, ahead of the flow and mixing studies. Each video pairs a vessel overview on the left with an impeller detail on the right.

### ambr 15

<figure class="research-video" id="ambr15-impeller-preview">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="PrsU_MnOX-M" data-youtube-title="ambr 15 impeller rotation | CAD preview">
    <button type="button" class="youtube-player__button" aria-label="Play Supplied ambr 15 project geometry with its shaft and impeller rotating: vessel overview on the left and impeller detail on the right">
      <img src="/bioreactor-preview/ambr15_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
</figure>

### ambr 250

<figure class="research-video" id="ambr250-impeller-preview">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="FWAqatsLyxU" data-youtube-title="ambr 250 mammalian impeller rotation | CAD preview">
    <button type="button" class="youtube-player__button" aria-label="Play Supplied ambr 250 project geometry with its shaft and impeller assembly rotating: vessel overview on the left and impeller detail on the right">
      <img src="/bioreactor-preview/ambr250_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
</figure>

### Glass stirred bioreactor

<figure class="research-video" id="glass-impeller-preview">
  <div class="youtube-player youtube-player--widescreen" data-youtube-id="GOw6ksUTgXU" data-youtube-title="Glass bioreactor impeller rotation | CAD preview">
    <button type="button" class="youtube-player__button" aria-label="Play Glass stirred bioreactor geometry with its shaft and three-blade impeller rotating: vessel overview on the left and impeller detail on the right">
      <img src="/bioreactor-preview/glass_vessel_poster.jpg" alt="" loading="lazy" decoding="async" width="1920" height="1080" />
      <span class="youtube-player__play" aria-hidden="true">&#9654;</span>
    </button>
  </div>
</figure>

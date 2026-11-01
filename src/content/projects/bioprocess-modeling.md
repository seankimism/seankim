---
title: "Bioprocess modeling"
description: "Modeling temperature control, mixing, and gas transfer to understand how the culture environment changes with bioreactor scale."
organization: "Independent project"
publishedDate: "2026-09-27"
period: "September 2026–present"
tags: ["Bioreactors", "Scale-up", "Heat transfer", "Gas transfer"]
order: -1
draft: false
---

<p class="project-lede">I use models to examine how vessel geometry, operating conditions, and culture demand change the environment cells experience during scale-up. These studies cover temperature control, agitation and mixing, and headspace gas transfer from small-scale vessels to 2,000 L.</p>

## Transport and control across scales

Matching a setpoint at two scales does not mean the cultures experience the same conditions. A larger vessel has different heating and cooling requirements, mixing depends on the impeller and vessel geometry, and the liquid surface contributes more gas transfer per unit volume in smaller vessels.

I built these studies around those differences. I compare model predictions with published measurements where the necessary inputs are available, then use the calculations to examine changes in scale and operating conditions. Each study includes its assumptions, methods, and validation limits.

<nav class="arc-list" aria-label="Bioprocess modeling themes">
  <div class="arc-row"><span class="arc-number">01</span><div><h3><a href="#temperature-control">Temperature control</a></h3><p>How do metabolic heat, vessel heat loss, and feed additions change heating and cooling requirements?</p></div></div>
  <div class="arc-row"><span class="arc-number">02</span><div><h3><a href="#agitation-and-mixing">Agitation and mixing</a></h3><p>How do power input and mixing time change across vessels, and what does that mean for local temperature gradients?</p></div></div>
  <div class="arc-row"><span class="arc-number">03</span><div><h3><a href="#headspace-gas-transfer">Headspace gas transfer</a></h3><p>How does surface oxygen transfer change with scale, and how well can a common correlation describe the measurements?</p></div></div>
  <div class="arc-row"><span class="arc-number">04</span><div><h3><a href="#cho-cell-model-cfd">Cell model and CFD coupling</a></h3><p>How should a CHO cell model respond to the local conditions predicted by CFD, and how can the two be coupled efficiently?</p></div></div>
</nav>

## Modeling studies

<div class="paper-list">
  <article class="paper-card" id="temperature-control">
    <a class="paper-card-figure" href="/projects/bioreactor-temperature-control/" aria-label="Read the temperature-control study"><img src="/xdr2000/xdr2000_mesh_3d.png" alt="Cutaway of the modeled XDR-2000 showing the jacket, steel wall, culture medium, and headspace." width="2400" height="1839" loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Heat transfer · Temperature control</p>
      <h3><a href="/projects/bioreactor-temperature-control/">Bioreactor temperature control: from bench to 2,000 L</a></h3>
      <p>I modeled media warm-up, controller response, metabolic heat, and cold feed additions in ambr 250, a 3 L glass vessel, and the XDR-2000. The calculations show how cooling demand and temperature recovery change with scale, even when the cultures follow the same cell-density profile.</p>
      <p class="paper-card-links"><a href="/projects/bioreactor-temperature-control/">Read study →</a></p>
    </div>
  </article>
  <article class="paper-card" id="agitation-and-mixing">
    <a class="paper-card-figure" href="/projects/bioreactor-agitation-and-mixing/" aria-label="Read the agitation and mixing study"><img src="/mixing/vessel_specific_circulation_factor_parity.svg?v=39fbecf5be47" alt="Literature and predicted mixing times across 11 vessels with separate circulation factors." width="1872" height="2112" loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Agitation · Mixing · Spatial heat transfer</p>
      <h3><a href="/projects/bioreactor-agitation-and-mixing/">Bioreactor agitation and mixing</a></h3>
      <p>I compared power per volume, tip speed, and mixing time across cell-culture vessels, then calibrated a mixing-time correlation against literature measurements. I used bulk mixing time in a separate model of spatial liquid temperatures to examine heating, temperature control, and feed additions.</p>
      <p class="paper-card-links"><a href="/projects/bioreactor-agitation-and-mixing/">Read study →</a></p>
    </div>
  </article>
  <article class="paper-card" id="headspace-gas-transfer">
    <a class="paper-card-figure" href="/projects/bioreactor-surface-gas-transfer/" aria-label="Read the headspace gas-transfer study"><img src="/gas-transfer/surface_kla_scale.svg?v=08c512813e6f" alt="Published surface oxygen-transfer measurements from 13 mL to 2,000 L, with a dotted guide showing the overall decrease with volume." width="2023" height="1276" loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Surface oxygen transfer · Literature calibration</p>
      <h3><a href="/projects/bioreactor-surface-gas-transfer/">Headspace gas transfer</a></h3>
      <p>I compared published surface oxygen-transfer measurements from ambr 15 to 2,000 L and fitted a correlation to 24 conditions from four studies. The comparison examines the contribution of surface area per liquid volume and the growing importance of headspace gas exchange at small scale.</p>
      <p class="paper-card-links"><a href="/projects/bioreactor-surface-gas-transfer/">Read study →</a></p>
    </div>
  </article>
  <article class="paper-card" id="shake-flask-mixing">
    <a class="paper-card-figure" href="/projects/shake-flask-baffles-and-mixing/" aria-label="Read the shake-flask baffles and mixing study"><img src="/flask-mixing/duran_poster.jpg" alt="Paired surface tracer-concentration views of plain and four-baffle DURAN-style flask models during startup mixing." width="1920" height="1080" loading="lazy" decoding="async" /></a>
    <div class="paper-card-body">
      <p class="eyebrow">Shake flasks · CFD · Tracer mixing</p>
      <h3><a href="/projects/shake-flask-baffles-and-mixing/">Shake-flask baffles and mixing</a></h3>
      <p>I compared plain and four-baffle 250 mL flask models at matched shaking conditions. Paired concentration videos show startup mixing, alongside preliminary whole-volume mixing times and the current validation limits.</p>
      <p class="paper-card-links"><a href="/projects/shake-flask-baffles-and-mixing/">Read study →</a></p>
    </div>
  </article>
</div>

## Tech transfer tools

<div class="paper-list">
  <article class="paper-card no-figure" id="incubator-rcf-calculator">
    <div class="paper-card-body">
      <p class="eyebrow">Tech transfer · Orbital shaker settings</p>
      <h3><a href="/projects/incubator-rcf-calculator/">Incubator RCF calculator</a></h3>
      <p>Translate a source shaking speed into a receiving setting with equal nominal orbital acceleration when incubator orbits differ. Use the result as a documented starting point for tech transfer.</p>
      <p class="paper-card-links"><a href="/projects/incubator-rcf-calculator/">Open calculator →</a></p>
    </div>
  </article>
</div>

## Literature reviews

<div class="paper-list">
  <article class="paper-card no-figure" id="cho-cell-model-cfd">
    <div class="paper-card-body">
      <p class="eyebrow">CHO kinetics · Lactate metabolic shift · CFD coupling</p>
      <h3><a href="/projects/cho-cell-model-cfd/">Coupling CHO cell models to CFD: a literature review</a></h3>
      <p>I review how CHO kinetic models can respond to dissolved oxygen, pH and pCO₂, with particular attention to the lactate metabolic shift. I also compare approaches for coupling such models to CFD, from frozen flow fields to compartment models and cell lifelines.</p>
      <p class="paper-card-links"><a href="/projects/cho-cell-model-cfd/">Read review →</a></p>
    </div>
  </article>
</div>

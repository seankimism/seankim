---
title: "Building a mechanistic CHO cell culture model"
description: "Building a CHO fed-batch model to explore how culture conditions change cell growth, metabolism and protein production."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-11-05"
period: "November 2026–present"
tags: ["CHO", "Mechanistic modeling", "Cell metabolism", "Fed-batch", "Literature review"]
order: 6
draft: true
---

<p class="project-lede">I’m building this model to understand how culture conditions change CHO cell growth, metabolism and protein production. I started with a literature review, then built a first version in Python. It follows a fed-batch culture and connects what the cells consume and produce with changes in pH, dissolved CO₂ and osmolality.</p>

This continues my [review of CHO cell models and CFD coupling](/projects/cho-cell-model-cfd/). For now, the model treats the culture as perfectly mixed. Most parameters are placeholders, so the results below show how the model behaves before fitting it to experimental data.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#what-i-took-from-the-literature">What I took from the literature</a></li>
    <li><a href="#what-the-model-does">What the model does</a></li>
    <li><a href="#what-the-first-run-shows">What the first run shows</a></li>
    <li><a href="#what-im-adding-next">What I’m adding next</a></li>
    <li><a href="#how-ill-test-it">How I’ll test it</a></li>
    <li><a href="#connecting-the-model-to-cfd">Connecting the model to CFD</a></li>
    <li><a href="#selected-references">Selected references</a></li>
  </ol>
</nav>

## What I took from the literature

I used the review to decide what to build first and what data I would need to test it. I want enough detail to explain changes in a culture run, with parameters that can be estimated from measurements.

Xing et al. provided a useful starting point: six differential equations and 18 parameters to describe large-scale CHO fed-batch cultures. Six parameters came from culture data, and twelve were fitted using Markov chain Monte Carlo <a href="#ref-1">[1]</a>. I’m starting with that kind of small kinetic model before adding more detail inside the cell.

The culture environment matters too. Goudar et al. measured how respiration changed under different perfusion conditions <a href="#ref-2">[2]</a>. Brunner et al. found that elevated pCO₂ changed lactate behavior in their fed-batch cultures <a href="#ref-3">[3]</a>. These studies help me decide which effects to include. Their measured responses still need to be checked for the cell line and process I want to model.

I also want to account for what the cells experienced earlier. Anane et al. observed culture responses when residence times exceeded about 90 seconds in their dissolved-oxygen scale-down loop <a href="#ref-4">[4]</a>. That timing belongs to their experimental setup, but it gives me a reason to track exposure duration. O’Brien et al. showed how metabolism, growth signaling and the starting state of the cells can contribute to differences in lactate behavior between runs <a href="#ref-5">[5]</a>.

## What the model does

The first version tracks 19 states, including cells, nutrients, metabolites and broth chemistry. As the culture changes, the model recalculates the environment and how quickly the cells grow, consume nutrients and make product. Feed and liquid base additions also increase volume and dilute the broth.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Components implemented in the first-stage CHO model" tabindex="0">

| Component | Current representation |
| --- | --- |
| Cell population | Viable and dead cells, with growth, death and lysis |
| Nutrients and metabolites | Glucose, glutamine, lactate and ammonium, plus a lumped nutrient pool and inhibitor |
| Product | Accumulation of secreted protein as titer |
| Broth chemistry | Total inorganic carbon and a simplified strong-ion balance used to calculate pH and dissolved CO₂ |
| Control and additions | Base and CO₂ addition around a pH deadband, feed boluses, glucose top-ups and optional continuous feeding |
| Oxygen | Prescribed DO profiles or an oxygen-transfer and uptake balance |
| Cellular history | A lactate-switch state and an accumulated hypoxia-exposure state |

</div>

Growth depends on temperature, pH, dissolved oxygen, pCO₂ and osmolality, as well as nutrient availability and byproduct inhibition. Other rates use fewer of these inputs. Oxygen uptake currently depends on temperature, pH and DO; product formation depends on temperature, osmolality and glucose availability.

The feedback between the cells and the broth is what I want to capture. Lactate, ammonium and CO₂ production change pH and the carbonate balance. The controller responds by adding liquid base or sparging CO₂. Base changes volume and ionic composition, while CO₂ changes the inorganic carbon balance. Those changes affect the conditions the cells experience next. For now, the pH calculation uses simplified bicarbonate chemistry; other medium buffers still need to be added.

The model also tracks a switch between lactate production and consumption, plus a state that builds up during low-oxygen exposure and recovers afterward. These are simple ways to represent culture history. The intracellular signaling and redox mechanisms discussed in the review are still future work.

## What the first run shows

This example follows a 14-day fed-batch culture at the conditions below. I’m using it to look at how the different parts of the model interact. The curves use placeholder parameters and have not been fitted to an experimental culture.

<dl class="xdr-conditions">
  <div><dt>Initial volume</dt><dd>1 L</dd></div>
  <div><dt>Initial viable cells</dt><dd>0.5 × 10⁶ cells/mL</dd></div>
  <div><dt>Temperature</dt><dd>37 → 33 °C on day 5</dd></div>
  <div><dt>pH set point</dt><dd>7.0 ± 0.05 deadband</dd></div>
  <div><dt>DO set point</dt><dd>40% air saturation</dd></div>
  <div><dt>Main feed</dt><dd>3% of initial volume daily, days 3–13</dd></div>
</dl>

<figure class="xdr-figure" id="illustrative-culture-output">
  <a href="/cho-mechanistic-model/illustrative_fed_batch.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the illustrative CHO fed-batch model curves at full size">
    <img src="/cho-mechanistic-model/illustrative_fed_batch.svg" alt="Illustrative model curves for viable cell density, product titer, lactate and dissolved CO₂ during a 14-day fed-batch with placeholder parameters." width="960" height="672" loading="lazy" decoding="async" />
  </a>
  <figcaption>Example 14-day fed-batch with placeholder parameters. The panels show viable cell density, product titer, lactate and dissolved CO₂. The run includes glucose top-ups and bicarbonate-base control. <a href="/cho-mechanistic-model/illustrative_fed_batch.png">Download PNG</a> · <a href="/cho-mechanistic-model/illustrative_fed_batch.csv">Example data</a>.</figcaption>
</figure>

The upper-left panel shows viable cell density rising and then declining late in the run. Product keeps accumulating in the upper-right panel, even as cell density falls.

In the lower-left panel, lactate builds up early and is consumed as the model switches behavior. Dissolved CO₂ falls at first, then rises later as respiration, gas transfer and pH control interact. I want to compare all of these curves with measurements, because matching titer alone would leave a lot of the culture behavior unchecked.

I can also compare pH set points, CO₂ stripping, temperature-shift timing, changing DO and base chemistry. The DO-cycling example needs more frequent saved results before I can use its plots to examine the response to each oxygen cycle.

## What I’m adding next

I’m building the model in stages. The first version runs, but fitting it to culture data and testing it on separate runs comes before relying on it for the next layer.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="CHO model development roadmap and validation targets" tabindex="0">

| Stage | Work | Evidence needed |
| --- | --- | --- |
| 1 · Culture kinetics | First-stage simulator implemented; calibration pending | Held-out cell, metabolite, titer and off-gas trajectories |
| 2 · Amino acids | Replace lumped pools with demand, catabolism and secretion terms | Amino-acid and ammonia profiles across feeding conditions |
| 3 · Lactate and exposure history | Refine the metabolic switch, inoculum state and stress memory | Shift timing, non-shifting cultures, and controlled exposure histories |
| 4 · Product quality | Add glycosylation and relevant extracellular quality chemistry | Product-specific glycan and charge-variant measurements |
| 5 · Hybrid refinement | Add data-driven corrections within the mechanistic balances | Predictions for held-out operating conditions with uncertainty |

</div>

For amino acids, I want to separate what goes into cells and product from what is broken down or secreted. The current GS-line option removes extracellular glutamine limitation, but it does not yet model glutamine synthesis or its nitrogen balance. Product quality will need its own measurements and parameters. Published Golgi and nucleotide-sugar models give me a starting point for glycosylation <a href="#ref-6">[6]</a>.

## How I’ll test it

The fitting example uses noisy data generated by the model itself. That helps check whether the fitting process works, but it does not tell me how well the model predicts a real culture. Next, I want to fit experimental runs, starting with growth and death, then nutrient and metabolite rates, and finally product formation.

The four baseline tests passed checks on selected state bounds, pH control, the volume balance and the direction of the CO₂-stripping response. To test predictive performance, I’ll keep complete culture runs separate from the fitting data. I also want controlled changes in operating conditions to check whether the model responds correctly. Sensitivity analysis and experimental design can help identify which parameters the measurements can support <a href="#ref-7">[7]</a>.

## Connecting the model to CFD

My earlier [CFD-coupling review](/projects/cho-cell-model-cfd/) looks at using flow simulations to follow the conditions cells experience as they move through a reactor. This model is the biological part of that idea. It currently sees one bulk environment. The next connection would let it respond to local conditions and exposure histories, with scale-down experiments used to test the combined model.

## Selected references

<ol class="project-references">
  <li id="ref-1">Xing, Z., Bishop, N., Leister, K., and Li, Z. J. (2010). Modeling kinetics of a large-scale fed-batch CHO cell culture by Markov chain Monte Carlo method. <em>Biotechnology Progress</em> 26, 208–219. <a href="https://doi.org/10.1002/btpr.284" target="_blank" rel="noopener noreferrer">doi:10.1002/btpr.284</a>.</li>
  <li id="ref-2">Goudar, C. T., Piret, J. M., and Konstantinov, K. B. (2011). Estimating cell specific oxygen uptake and carbon dioxide production rates for mammalian cells in perfusion culture. <em>Biotechnology Progress</em>. <a href="https://doi.org/10.1002/btpr.646" target="_blank" rel="noopener noreferrer">doi:10.1002/btpr.646</a>.</li>
  <li id="ref-3">Brunner, M., Doppler, P., Klein, T., Herwig, C., and Fricke, J. (2018). Elevated pCO₂ affects the lactate metabolic shift in CHO cell culture processes. <em>Engineering in Life Sciences</em> 18, 204–214. <a href="https://doi.org/10.1002/elsc.201700131" target="_blank" rel="noopener noreferrer">doi:10.1002/elsc.201700131</a>.</li>
  <li id="ref-4">Anane, E., et al. (2021). Scale-down cultivation in mammalian cell bioreactors—The effect of bioreactor mixing time on the response of CHO cells to dissolved oxygen gradients. <em>Biochemical Engineering Journal</em> 166, 107870. <a href="https://doi.org/10.1016/j.bej.2020.107870" target="_blank" rel="noopener noreferrer">doi:10.1016/j.bej.2020.107870</a>.</li>
  <li id="ref-5">O’Brien, C. M., Zhang, Q., Daoutidis, P., and Hu, W.-S. (2021). A hybrid mechanistic-empirical model for in silico mammalian cell bioprocess simulation. <em>Metabolic Engineering</em> 66, 31–40. <a href="https://doi.org/10.1016/j.ymben.2021.03.016" target="_blank" rel="noopener noreferrer">doi:10.1016/j.ymben.2021.03.016</a>.</li>
  <li id="ref-6">Jimenez del Val, I., Nagy, J. M., and Kontoravdi, C. (2011). A dynamic mathematical model for monoclonal antibody N-linked glycosylation and nucleotide sugar donor transport within a maturing Golgi apparatus. <em>Biotechnology Progress</em> 27, 1730–1743. <a href="https://doi.org/10.1002/btpr.688" target="_blank" rel="noopener noreferrer">doi:10.1002/btpr.688</a>.</li>
  <li id="ref-7">Kontoravdi, C., Pistikopoulos, E. N., and Mantalaris, A. (2010). Systematic development of predictive mathematical models for animal cell cultures. <em>Computers &amp; Chemical Engineering</em> 34, 1192–1198. The paper demonstrates the workflow in hybridoma cultures. <a href="https://doi.org/10.1016/j.compchemeng.2010.03.012" target="_blank" rel="noopener noreferrer">doi:10.1016/j.compchemeng.2010.03.012</a>.</li>
</ol>

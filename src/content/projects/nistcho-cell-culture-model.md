---
title: "Mechanistic model of NISTCHO fed-batch culture"
description: "A mechanistic NISTCHO fed-batch model with spin-tube and ambr comparisons and a shared ambr calibration."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-11-19"
period: "November 2026"
tags: ["Cell culture", "CHO metabolism", "Mechanistic modeling", "Model validation"]
order: 4
draft: false
---

<p class="project-lede">Mechanistic cell-culture models combine growth, metabolism, and productivity into a single description that can screen feeding and process conditions before an experiment. However, such models are usually calibrated and judged on data from one laboratory, so how well they transfer between vessels and laboratories remains poorly understood. NISTCHO, the NIST reference CHO cell line, offers an unusual opportunity to examine this transfer, because several groups have published cultures of the same cell line in spin tubes and ambr bioreactors <a href="#ref-1">[1, 2]</a>.</p>

The objective of this project was to build a mechanistic model of NISTCHO fed-batch culture and to test it on cultures it had not seen. I (i) built a reduced reaction network in which each mechanism reproduces a specific feature of the development data, (ii) calibrated it only on designated development cultures, and (iii) predicted held-out spin-tube and ambr cultures.

The released calibration predicted the held-out HIP spin-tube condition within 1–11% of each variable's largest measured value. It predicted about half of the day-5 lactate concentration at both ambr sites. I then refitted the carbon kinetics jointly to the measured glucose and lactate at both sites. The combined fit reproduced day-5 lactate within 0.18 g/L at each site using one set of parameters.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#published-nistcho-data">Published NISTCHO data</a></li>
    <li><a href="#model-structure">Model structure</a></li>
    <li><a href="#calibration-and-held-out-testing">Calibration and testing</a></li>
    <li><a href="#spin-tube-cultures">Spin-tube cultures</a></li>
    <li><a href="#lactate-in-ph-controlled-bioreactors">Lactate in ambr bioreactors</a></li>
    <li><a href="#shared-calibration-on-ambr-15-and-ambr-250">Shared ambr calibration</a></li>
    <li><a href="#coupling-the-nistcho-model-to-cfd">CFD coupling</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</nav>

## Published NISTCHO data

The model draws on two publications that culture the same cell line in different vessels and laboratories. The 2026 feeding study compared four strategies in spin tubes without pH control <a href="#ref-2">[2]</a>. The 2025 reference cell line study ran the same blended feed at two sites, in ambr 15 and ambr 250 bioreactors held at pH 6.9, and also measured glutamine, glutamate, and ammonium <a href="#ref-1">[1]</a>.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Published NISTCHO cultures and their role in calibration and testing" tabindex="0">

| Source | Vessel and control | Cultures | Measurements | Role in this study |
|---|---|---|---|---|
| Feeding-strategy study, 2026 <a href="#ref-2">[2]</a> | Spin tubes (20 mL), no pH control | STD (4), LoG (4), HiF (3), HIP (3) | Daily viable cells, viability, titer, and glucose, with lactate every 48 h | STD, LoG, and HiF fitted, HIP held out |
| Reference cell line, 2025 <a href="#ref-1">[1]</a> | ambr 15 (Site 1) and ambr 250 (Site 2), pH 6.9 | One mean of duplicate vessels per site | Also glutamine, glutamate, and ammonium | Site 1 fitted, Site 2 held out |
| Reference cell line, 2025 <a href="#ref-1">[1]</a> | Spin tubes | Feed 1 alone and the blended feed | Viable cells, viability, and titer | Held out |

</div>

STD and LoG were fed every second day, and glucose ran out late in LoG cultures. HiF and HIP were fed daily, and HIP received small glucose additions triggered by a rise in pH. The 2026 cultures also came from two experiments eight months apart. As such, I included HiF in the development set so that fitting covered both experiments and both feeding schedules, while HIP, which shares HiF's experiment and feeding frequency, differed only in its glucose policy.

## Model structure

The model treats each culture as a well-mixed volume that changes with every recorded feed and sample. Cells occupy three states: active, apoptotic but still intact, and dead. The viable count measured by trypan blue is the sum of the first two, which reproduces the delay between commitment to apoptosis and loss of membrane integrity. The medium carries glucose, lactate, glutamine, glutamate, ammonium, asparagine, and the nitrogen of the remaining amino acids.

Fifteen reactions connect these species and balance nitrogen exactly. Intracellular glutamate and glutamine are held at quasi-steady state, so unlike the earlier model they cannot run dry between feeds. Every simulated culture closes its nitrogen balance to about 10⁻¹⁴ mmol, which confirms that no nitrogen is created or lost numerically.

Each mechanism reproduces a feature of the development data:

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Features of the development data and the mechanism that reproduces each" tabindex="0">

| Feature of the data | Mechanism |
|---|---|
| Glucose uptake fell from about 3.3 to 1.25 pmol/cell/day between 2 and 7 million cells/mL, then leveled at 0.7–1.0 | A brake on growth and glycolysis that builds with cumulative cell-days, plus brake-insensitive basal glycolysis |
| Lactate was produced early and consumed later | Overflow to lactate above an oxidative capacity, with lactate oxidized by the spare capacity |
| LoG consumed lactate three times faster than STD at similar glucose uptake | Glucose represses lactate uptake |
| Glucose uptake on the day after each feed was 1.4–1.5 times that of the following day at equal density | A feed factor that raises glycolysis and is consumed by the cells |
| LoG survived about half a day without carbon on day 7 but not about a day on day 9 | A starvation exposure that builds while carbon is exhausted and commits cells to apoptosis |
| Antibody production fell to 3.7 pg/cell/day once carbon ran out, compared to 23.5 in STD | Antibody synthesis requires carbon at the time of synthesis |
| GS cells exported glutamine early in culture and took it back later | Growth-linked glutamine export with saturable re-uptake |

</div>

In addition, the model can take a dissolved-oxygen input, either as a prescribed profile or from an oxygen balance with a given kLa, and then adds the hypoxia response of my earlier CHO model. A stress state integrates the time spent below about 5% air saturation, so cells respond only after about 90 s of severe hypoxia. This delay matches a scale-down study in which CHO cells accumulated lactate only when their exposure to low dissolved oxygen exceeded 90 s <a href="#ref-3">[3]</a>. At full stress, growth falls by half, glucose uptake rises by half and is converted entirely to lactate, and death rises by 0.3 per day. Antibody productivity is unchanged, as observed in the same study, and specific oxygen uptake is 5.4 pmol/cell/day, within the range measured for CHO cells in perfusion culture <a href="#ref-4">[4]</a>. Unlike the mechanisms above, the remaining values are uncalibrated placeholders, because the NISTCHO data cannot calibrate them. The ambr bioreactors held dissolved oxygen at 40%, and the spin tubes had no oxygen measurement. Without an oxygen input, the model reproduces the calibrated results exactly.

## Calibration and held-out testing

For the released calibration, I fitted STD, LoG, HiF, and Site 1 and held out HIP, Site 2, and the 2025 spin tubes. Residuals were scaled by tolerances declared before scoring. For the spin tubes, the tolerance was the replicate spread of STD and LoG or the assay floor. For the ambr bioreactors, Site 1 was judged on its own duplicate-vessel spread during fitting. The held-out Site 2 used a tolerance based on the difference between the two sites. A variable passed when its scaled error was within twice its tolerance.

Two inputs came directly from the data. First, each experiment's inoculum lag was set from its own day-3 cell count, because seed trains differed between experiments and the day-3 sample was taken before any condition-specific treatment. The day-3 count was therefore an input and was never scored. Second, every sample and feed was placed on the cell counter's time stamps rather than on nominal culture days. This correction mattered, because nominal days were off by up to 4.8 hours, which changed the modeled glucose concentration by 0.49 g/L.

I fitted the parameters by bounded least squares in log space from five starting points. I compared three forms of the density brake and selected cumulative cell-days by the corrected Akaike information criterion (AICc). Then, I fitted the nitrogen reactions on Site 1, the only fitted culture with nitrogen measurements, while holding the carbon kinetics fixed. Whenever I tested a new mechanism, I wrote down the rule for accepting it before running the fit.

## Spin-tube cultures

The fitted spin-tube and Site 1 cultures met their tolerance for 17 of 23 variables. In the spin tubes, the misses were concentrated in HiF, whose viable cells leveled near 19 million cells/mL compared to the measured 22.8, together with its glucose and lactate, and in LoG viable cells. Site 1 missed only glucose and lactate, which the next section examines.

Notably, the held-out HIP condition met its tolerance for all five variables. Its errors were 4% for viable cells, 1% for viability, 6% for titer, 3% for glucose, and 11% for lactate, relative to each variable's largest measured value. The model also predicted HIP better than either naive alternative, the measured HiF or STD means on the same day, for every variable. In contrast, the 2025 spin tubes exposed a limit in late culture. The model reproduced their growth phase but declined too slowly after day 9 and over-predicted late titer, with an RMS error of 0.70 g/L (41% of the largest value) in the Feed 1 tube.

<figure class="xdr-figure">
  <a href="/cho-model/spin_tubes_2026.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the spin-tube comparison at full size">
    <img src="/cho-model/spin_tubes_2026.svg" alt="Four rows of panels for the STD, LoG, HiF, and HIP spin-tube conditions, each showing viable cells, viability, titer, glucose, and lactate over 11 days. Points with shaded bands show the measured replicate means and ranges, and a line shows the model. The HIP row is labelled as held out." width="1950" height="1500" loading="lazy" decoding="async" />
  </a>
  <figcaption>Spin-tube cultures from the 2026 feeding study <a href="#ref-2">[2]</a>. Points show replicate means and shaded bands show the replicate range. STD, LoG, and HiF were fitted, and HIP was held out. Glucose shows the model's feed additions as steps, while the measurements are pre-feed samples. <a href="/cho-model/spin_tubes_2026.png" download>Download PNG</a>.</figcaption>
</figure>

## Lactate in pH-controlled bioreactors

In the released model, spin-tube lactate RMSE was 3–19% of each condition's peak. On day 5, the model predicted 0.95 g/L lactate at Site 1 and 0.76 g/L at Site 2, compared to 1.93 and 1.44 g/L measured. To examine this discrepancy, I estimated net exchange rates between samples after accounting for feed additions and changes in volume. On days 3–5, the Site 1 estimate was 2.02 pmol glucose taken up and 1.61 pmol lactate released per viable cell per day, compared to 1.25 and 0.03 in standard-feed spin tubes. After subtracting half the net lactate release, the residual was 1.21 pmol glucose equivalents per viable cell per day at Site 1 and 1.24 in the tubes. This comparison depends on the assumed glucose dose and does not identify respiratory flux.

I first tested whether the threshold for lactate overflow changes with culture age, and two candidate laws failed the acceptance rule I had set before fitting. In addition, tube acidification at the stated incubator CO₂, inhibition by lactate, and a single vessel factor did not close the uptake gap.

I then tested a labelled ambr setting, a set of seven carbon parameters that acted only in pH-controlled vessels. In these vessels, glycolysis started lower but was braked more slowly, the overflow threshold fell during the first five days, and glucose barely repressed lactate uptake. Selected on Site 1 alone, the setting reduced the Site 1 lactate error from 0.47 to 0.03 g/L and that of the held-out Site 2 from 0.36 to 0.21 g/L. However, the setting described how the ambr cultures differ from the tubes, not why. By the statistical criterion I set before fitting (AICc across all fitted cultures), its seven parameters were also not justified, because the tube data dominate the combined misfit. I therefore left it out of the released model, which reports the ambr lactate gap as its main limitation.

Without the setting, the held-out Site 2 met its tolerance for six of its eight variables, with viability and titer as the exceptions. This tolerance is the difference between the two sites, so passing it shows consistency rather than skill. Indeed, the measured Site 1 trajectory predicted Site 2 at least as well as the model did for every variable except glucose.

<figure class="xdr-figure">
  <a href="/cho-model/ambr_sites_2025.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the ambr site comparison at full size">
    <img src="/cho-model/ambr_sites_2025.svg" alt="Two blocks of panels for ambr 15 and ambr 250, each showing viable cells, viability, titer, glucose, lactate, glutamine, glutamate, and ammonium over 15 days. Points show the published means and a line shows the model. On day 5, measured lactate is about twice the model's value at both sites." width="1560" height="1620" loading="lazy" decoding="async" />
  </a>
  <figcaption><strong>Released model predictions for the two ambr cultures.</strong> The top panels show Site 1 (ambr 15, fitted). The bottom panels show Site 2 (ambr 250, held out). Points show published means from duplicate vessels, and lines show model predictions <a href="#ref-1">[1]</a>. <a href="/cho-model/ambr_sites_2025.png" download>Download PNG</a>.</figcaption>
</figure>

## Shared calibration on ambr 15 and ambr 250

I refitted eight coefficients for glucose uptake and lactate production and consumption to both ambr sites. Each site contributed seven glucose and seven lactate measurements <a href="#ref-1">[1]</a>. The least-squares fit used each site's reported assay variability. Growth, death, antibody production, and nitrogen parameters came from the released calibration. The combined fit predicted day-5 lactate at 1.75 g/L in ambr 15 and 1.50 g/L in ambr 250, compared to 1.93 and 1.44 g/L measured.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Glucose and lactate prediction errors for the combined ambr fit" tabindex="0">

| Evaluation data | Glucose RMSE (g/L) | Lactate RMSE (g/L) |
|---|---:|---:|
| ambr 15 | 0.33 | 0.17 |
| ambr 250 | 0.57 | 0.17 |
| 2026 spin tubes | 0.77 | 0.25 |

</div>

<figure class="xdr-figure">
  <a href="/cho-model/ambr_combined_parity.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the combined ambr parity plot at full size">
    <img src="/cho-model/ambr_combined_parity.svg" alt="Eight parity plots compare measured and predicted glucose, lactate, viable cell density, viability, antibody titer, glutamine, glutamate, and ammonium. Day-5 lactate lies close to the identity line at both ambr sites. The largest viability discrepancies occur in the 2026 spin tubes at low measured viability." width="3036" height="1548" loading="lazy" decoding="async" />
  </a>
  <figcaption><strong>NISTCHO predictions compared to measured data.</strong> The gscho-8 carbon kinetics were fitted to glucose and lactate from ambr 15 and ambr 250. The 677 matched observations include published means for the ambr and 2025 spin-tube runs, with one standard deviation where available, and individual measurements from the 2026 spin tubes <a href="#ref-1">[1, 2]</a>. Panel RMSE follows the legend order, with viability in percentage points. A dash indicates unavailable measurements. <a href="/cho-model/ambr_combined_parity.png" download>Download PNG</a>.</figcaption>
</figure>

## Coupling the NISTCHO model to CFD

I plan to use computational fluid dynamics (CFD) to estimate how liquid moves between regions of the bioreactor. I will use those exchange rates in a compartment model for multi-day fed-batch runs. Before adding the cell kinetics, I will check that the compartments reproduce the CFD tracer histories and compare them with measured mixing where data are available. This approach follows my [literature review on coupling CHO cell models to CFD](/projects/cho-cell-model-cfd/).

In each compartment, the NISTCHO model will use local glucose, lactate, and dissolved oxygen to calculate rates of growth, nutrient uptake, and lactate production or consumption. The cell rates will feed back into the local species balances. I will compare the compartment model with the well-mixed model under the same feeding and aeration conditions to see when spatial gradients change predictions of viable cell density, viability, or lactate. I also plan to track dissolved oxygen along representative cell trajectories, because the model's hypoxia response depends on how long cells experience low oxygen.

## References

<ol class="project-references">
  <li id="ref-1">Dahodwala, H., et al. (2025). <a href="https://doi.org/10.1002/biot.70012">Development and Characterization of the NISTCHO Reference Cell Line</a>. Biotechnology Journal, 20(5), e70012.</li>
  <li id="ref-2">Schäpertöns, V., Hofer, L., Berger, T., et al. (2026). <a href="https://doi.org/10.1038/s41540-026-00686-3">Effects of feeding strategies on culture performance and product quality in NISTCHO</a>. npj Systems Biology and Applications, 12, 67.</li>
  <li id="ref-3">Anane, E., Knudsen, I. M., &amp; Wilson, G. C. (2021). <a href="https://doi.org/10.1016/j.bej.2020.107870">Scale-down cultivation in mammalian cell bioreactors—The effect of bioreactor mixing time on the response of CHO cells to dissolved oxygen gradients</a>. Biochemical Engineering Journal, 166, 107870.</li>
  <li id="ref-4">Goudar, C. T., Piret, J. M., &amp; Konstantinov, K. B. (2011). <a href="https://doi.org/10.1002/btpr.646">Estimating cell specific oxygen uptake and carbon dioxide production rates for mammalian cells in perfusion culture</a>. Biotechnology Progress, 27(5), 1347–1357.</li>
</ol>

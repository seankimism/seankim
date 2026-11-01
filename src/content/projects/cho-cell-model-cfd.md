---
title: "Coupling a CHO cell model to CFD"
description: "A development plan for a CHO kinetic model that responds to local dissolved oxygen, pH and pCO₂, coupled to bioreactor flow through CFD-derived compartments and cell lifelines."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-11-01"
period: "2026–present"
tags: ["CHO", "Mechanistic modeling", "CFD", "Scale-up"]
order: 5
draft: false
---

<p class="project-lede">Most mechanistic models of CHO cell culture assume a perfectly stirred bioreactor without oxygen limitation and with pH under control <a href="#ref-1">[1]</a>. However, these assumptions become less reliable as bioreactor volume increases, and cells may respond to local conditions that a single probe does not measure. The objective of this work is to develop a cell-line model that responds to its local environment and to couple it with flow fields from CFD at a computational cost suitable for a laptop.</p>

This plan builds on my [shake-flask baffles and mixing study](/projects/shake-flask-baffles-and-mixing/), in which I used CFD to compare startup tracer mixing in plain and baffled flask models and began preparing stirred-bioreactor models for future flow studies. The cell model described here is an unstructured kinetic model with explicit environmental dependence, including the shift between lactate production and consumption. Structured metabolism, product quality and population heterogeneity will be considered once this model is calibrated. None of the models described here has been implemented yet. This page documents the proposed approach and the evidence on which it is based.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#gradients-at-production-scale">Gradients at production scale</a></li>
    <li><a href="#model-architecture">Model architecture</a></li>
    <li><a href="#cho-cell-model">CHO cell model</a></li>
    <li><a href="#coupling-with-cfd">Coupling with CFD</a></li>
    <li><a href="#validation-targets">Validation targets</a></li>
    <li><a href="#development-sequence">Development sequence</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</nav>

## Gradients at production scale

Scale-up studies have linked changes in CHO cell performance to conditions that bulk measurements do not capture. These include intermittent hypoxia at 5,000 L <a href="#ref-2">[2]</a>, dissolved oxygen (DO) gradients lasting longer than about 90 s <a href="#ref-3">[3]</a> and regions of elevated pH near base addition <a href="#ref-4">[4]</a>. These studies are summarized in the [validation targets](#validation-targets) below.

Whether such gradients develop depends on the rate of consumption relative to the rate of mixing. In the absence of oxygen supply, the dissolved oxygen in the liquid is consumed within

$$
t_{\mathrm{O_2}}=\frac{c_{\mathrm{O_2}}}{q_{\mathrm{O_2}}X_v},
$$

where $c_{\mathrm{O_2}}$ is the dissolved oxygen concentration, $q_{\mathrm{O_2}}$ is the specific oxygen uptake rate and $X_v$ is the viable cell density.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Time for cells to consume dissolved oxygen at 40% air saturation without supply" tabindex="0">

| Viable cells (10⁶/mL) | Oxygen uptake (mmol/L/h) | Oxygen consumed within (s) |
| --- | --- | --- |
| 10 | 2.3 | 130 |
| 20 | 4.6 | 66 |
| 50 | 11.5 | 26 |
| 100 | 22.9 | 13 |

</div>

The calculation uses $q_{\mathrm{O_2}}$ = 5.5 pmol/(cell·day), which lies within the range Goudar et al. measured in CHO perfusion cultures <a href="#ref-5">[5]</a>. The dissolved oxygen concentration of 0.084 mM corresponds to 40% of the 0.210 mM air-saturation concentration in water at 37 °C <a href="#ref-6">[6]</a>. Oxygen solubility in culture media is somewhat lower, so these times represent upper estimates.

The XDR-2000 mixing times compiled in my [agitation and mixing study](/projects/bioreactor-agitation-and-mixing/) range from 28 to 38 s. Using the rule of thumb that the 95% mixing time corresponds to about four circulation times <a href="#ref-7">[7]</a>, liquid circulates through the vessel approximately every 7–10 s. At typical fed-batch cell densities, dissolved oxygen therefore lasts for several circulations, suggesting that consumption alone produces only modest DO gradients at 2,000 L. Above about 50 million cells/mL, or in larger vessels with longer mixing times, the oxygen in the liquid lasts approximately one mixing time. Local DO then depends on where gas transfer occurs and how long cells remain away from it. Similar considerations apply to pH near base addition and to CO₂ removal.

## Model architecture

<figure class="xdr-figure">
  <a href="/cho-cfd/cho_cfd_coupling.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the coupling diagram at full size">
    <img src="/cho-cfd/cho_cfd_coupling.svg" alt="CFD computes the flow field a few times. In the coupled simulation, a compartment model uses that flow to calculate mass transfer and exchange between zones, and the CHO cell model receives local conditions from each zone and returns rates. The coupled simulation produces catabolic and anabolic predictions." width="960" height="376" loading="lazy" decoding="async" />
  </a>
  <figcaption>Proposed workflow. CFD computes the flow field, which the compartment model uses to calculate mass transfer and exchange between zones. The cell model receives the local conditions in each zone and returns uptake and production rates. Particle tracks through the same flow field provide the exposure histories used by the cell model. The coupled simulation produces catabolic and anabolic predictions. None of these components has been implemented yet.</figcaption>
</figure>

The workflow separates calculations by computational cost. CFD solves the flow field a limited number of times for each vessel and operating condition. Python then uses these solutions to transport species between compartments and to follow simulated cells, and these calculations can be repeated as the biological model changes. The cell model receives local conditions and returns specific rates. It can therefore run unchanged in a well-mixed vessel or in any compartment, independently of vessel geometry and controller settings.

## CHO cell model

The cell model is unstructured, meaning that the culture is represented as a single cell population and metabolism is described by a small number of specific rates. Xing et al. used this approach for 5,000 L fed-batch cultures, with six differential equations and 18 parameters, 12 of which were estimated by Markov chain Monte Carlo (MCMC) from seven runs <a href="#ref-8">[8]</a>. I plan to retain this Bayesian approach because parameter distributions, rather than single best-fit values, can then be propagated through the coupled simulations. Following Ben Yahia et al., I will first define the stoichiometry linking extracellular inputs and outputs, then add kinetic expressions, and finally close the system with bioreactor mass balances <a href="#ref-9">[9]</a>.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="State variables in the cell model and their purpose" tabindex="0">

| State variables | Purpose |
| --- | --- |
| Viable and dead cells | Growth, death and lysis |
| Glucose, glutamine and glutamate | Primary carbon and nitrogen sources; GS cell lines also synthesize glutamine |
| Lactate and ammonium | Inhibitory byproducts; lactate may later be consumed |
| Lumped inhibitor | Other growth-inhibiting byproducts of amino acid metabolism <a href="#ref-10">[10]</a> |
| Exposure memory | Recent exposure to low DO, elevated pH or elevated pCO₂ |
| Product | Titer |
| Osmolality | Increased locally by concentrated feed and base additions |
| Inorganic carbon and strong ions | Determine pCO₂ and pH |

</div>

The specific growth rate is expressed as the product of substrate limitation, inhibition and environmental terms:

$$
\mu=\mu_{\max}\prod_j\frac{S_j}{K_j+S_j}\prod_k\frac{K_{I,k}}{K_{I,k}+I_k}\;f_{\mathrm{DO}}\,f_{\mathrm{pH}}\,f_{\mathrm{CO_2}}\,f_T\,f_{\mathrm{osm}}.
$$

Uptake and secretion rates are related to growth through yield coefficients and maintenance terms, each with its own environmental dependence. These environmental terms are the main difference from most published models, which assume a perfectly stirred bioreactor without oxygen limitation and with controlled pH <a href="#ref-1">[1]</a>. In addition, most studies of mammalian cell metabolism were performed in shake flasks, where pH and DO cannot be controlled <a href="#ref-11">[11]</a>. Estimating the environmental terms therefore requires data from controlled bioreactors.

I will use Monod and inhibition terms as the default rate expressions. Haldane- or Luong-type terms are appropriate for lactate, which acts as both a carbon source and an inhibitor, and switching functions with independently specified transition points and sharpness can represent changes between culture phases <a href="#ref-1">[1]</a>. Sharp switching functions make the equations stiff, which requires an implicit solver.

The lactate metabolic shift requires particular attention. Many CHO fed-batch cultures produce lactate during early growth and consume it later in the culture. Reported triggers of this shift include glucose or glutamine depletion, extracellular lactate concentration, and pH and temperature shifts, with cellular redox state proposed as a common underlying factor <a href="#ref-12">[12]</a>. Zalai et al. controlled the shift over a broad range through the timing of pH and temperature shifts, and associated it mainly with decreasing glycolytic flux <a href="#ref-13">[13]</a>. CO₂ and oxygen also influence the shift. In fed-batch cultures at 150 mmHg pCO₂, Brunner et al. observed no shift to lactate consumption, whereas control cultures at 94 mmHg began consuming lactate at about day 5 <a href="#ref-14">[14]</a>. Okamura et al. found more pronounced lactate consumption at higher DO and low glutamine concentrations, although their model represented DO at only two levels, 50% and 10% <a href="#ref-15">[15]</a>.

Each of these conditions can vary within a large bioreactor, and the shift also depends on the history of the culture. In the glycolysis model of Mulukutla et al., lactate inhibition and Akt signaling reshape two coexisting steady states. As a result, the transition to low glycolytic flux can occur only in certain regions, and the final metabolic state depends on the trajectory of the culture <a href="#ref-16">[16]</a>. Cells circulating through a large bioreactor follow different trajectories through its gradients. The model therefore requires exposure histories in addition to bulk averages.

As a starting point, I will represent the shift as a smooth transition between lactate production and consumption:

$$
q_{\mathrm{Lac}}=(1-\sigma)\,q_{\mathrm{Lac}}^{+}-\sigma\,q_{\mathrm{Lac}}^{-},\qquad \sigma=\frac{1}{1+\exp\left[-(z-z_0)/w\right]}.
$$

Here, $z$ combines glycolytic flux, lactate, glutamine, pH, pCO₂ and DO with an exposure memory, $m$, while $z_0$ and $w$ determine the position and sharpness of the transition. The memory relaxes toward a stress signal, $s$, with time constant $\tau_m$:

$$
\tau_m\frac{dm}{dt}=s(\mathrm{DO},\mathrm{pH},p\mathrm{CO_2})-m.
$$

A single memory state is the simplest formulation in which brief excursions have little effect while sustained exposure alters the response. Anane et al. observed no response to DO gradients until exposure exceeded about 90 s <a href="#ref-3">[3]</a>, which provides an initial estimate. The time constant itself must be determined from oscillation experiments with the cell line of interest.

Before selecting a final formulation, I will evaluate the model of O’Brien et al., which combines a mechanistic metabolic model with submodels for cell growth, signaling and the bioreactor environment <a href="#ref-17">[17]</a>. The model reproduced run-to-run variability in manufacturing data, which was attributed in part to the metabolic state of the inoculum, and represented differences in scale through CO₂ removal capacity. Its MATLAB code is publicly available.

Mulukutla et al. identified nine byproducts of amino acid metabolism that accumulate in fed-batch culture and inhibited growth when added to cultures. Maintaining selected amino acids at 0.5–1 mM during the growth phase reduced their accumulation <a href="#ref-10">[10]</a>. A single lumped inhibitor state can represent their combined effect. In addition, the model should reproduce the stationary-phase behavior reported by Templeton et al., who observed net lactate consumption from the start of the stationary phase and highly oxidative metabolism at peak antibody production <a href="#ref-18">[18]</a>.

pH will be calculated at each step from carbonate, lactate, ammonium and strong-ion totals using electroneutrality, rather than integrated as a separate state. Gas transfer acts on dissolved CO₂ rather than on total inorganic carbon. The model will also report the oxygen uptake rate (OUR) and CO₂ evolution rate (CER). Their ratio, the respiratory quotient (RQ), provides an independent check on the predicted shift. In the fed-batch cultures of Goh et al., RQ was on average above 1 during lactate production and below 1 during lactate consumption <a href="#ref-19">[19]</a>. Finally, the temperature term will connect this model to my [temperature-control study](/projects/bioreactor-temperature-control/), in which cell density is currently prescribed and metabolic heat could be calculated from OUR.

I will calibrate the model using well-mixed, controlled fed-batch cultures at bench scale before introducing spatial variation. Möller et al. found significant differences in parameter estimates between 30 mL shake flasks and 250 mL controlled bioreactors, but none between 250 mL and 2 L, and predicted a 50 L run using the resulting parameter distributions <a href="#ref-20">[20]</a>. González-Hernández and Perré recommend experiments that cover conditions both within and outside industrial operating ranges, include batch and fed-batch cultures, and reserve some runs for validation <a href="#ref-1">[1]</a>. Sensitivity analysis will then be used to restrict the calibration to the most influential parameters.

## Coupling with CFD

Reviews by Wang et al. and Singh et al. describe the challenges of coupling cell models with CFD and compare coupling approaches in terms of computational load <a href="#ref-21">[21]</a>, <a href="#ref-22">[22]</a>. The proposed coupling is feasible because the relevant processes occur on different timescales. As shown above, dissolved oxygen is consumed within seconds to minutes, whereas cell density and most metabolite concentrations change over hours. The slow biological states can therefore be held constant over a short interval while the faster gas and pH fields approach a quasi-steady state, and then updated.

I will also treat cells as passive tracers that follow the liquid. At 20 million cells/mL, cells with a diameter of 15 µm occupy about 3.5% of the liquid volume, so the flow field is held constant as the culture grows.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Approaches for coupling the cell model to CFD, from lowest to highest computational cost" tabindex="0">

| Approach | Information provided | Computational cost | Role in this plan |
| --- | --- | --- | --- |
| Frozen flow with switching between steady states <a href="#ref-23">[23]</a> | Concentration fields for each operating condition, with the flow switching to a new steady state when operating conditions change | Lowest | Initial DO and pH estimates over a complete culture |
| CFD-derived compartment models <a href="#ref-24">[24]</a>, <a href="#ref-25">[25]</a> | Spatial concentrations calculated from exchange flows between zones | Low once the flow is solved | Primary model |
| Lifelines on a frozen flow field <a href="#ref-7">[7]</a>, <a href="#ref-26">[26]</a> | Exposure histories along simulated cell trajectories | Moderate | Input to the exposure memory and design of scale-down experiments |
| Fully transient, two-way CFD | Time-resolved flow, mass transfer and control | High | Not planned; reference case only |

</div>

The proposed workflow consists of five steps:

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Proposed coupling workflow, with the check applied at each step" tabindex="0">

| Step | Calculation | Check |
| --- | --- | --- |
| 1. Flow | Steady rotating-frame CFD at selected agitation rates and fill volumes | Frozen-flow tracer mixing times compared with the measurements compiled in my agitation and mixing study |
| 2. Compartments | Compartment network built from CFD face fluxes, retaining forward and reverse exchange across each boundary | Compartment tracer response compared with the CFD |
| 3. Species | DO, glucose, carbonate species and base transported between compartments in Python, with cell-model rates as sources and sinks | Uniform conditions reproduce the well-mixed result, and species inventories are conserved |
| 4. Lifelines | Massless particles tracked through the frozen flow, with compartment concentrations sampled along each trajectory | Exposure statistics checked for sensitivity to particle number and sampling interval |
| 5. Experiments | Scale-down oscillation experiments designed from the exposure statistics | Exposure memory refitted to the experimental results |

</div>

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Quantities exchanged between the flow model and the cell model" tabindex="0">

| Direction | Exchanged quantities |
| --- | --- |
| Flow model to cell model | DO, pCO₂, pH, glucose, glutamine, lactate, ammonium, temperature and osmolality in each compartment, and exposure histories along each trajectory |
| Cell model to flow model | Oxygen uptake, CO₂ production, nutrient uptake, lactate and ammonium secretion, and the acid production that determines base demand |

</div>

Delafosse et al. developed compartment models of bioreactor mixing from CFD flow fields <a href="#ref-24">[24]</a>. Maldonado de León et al. extended this approach with machine learning, allowing a single compartment model to follow changes in liquid volume and agitation rate during a fed-batch process <a href="#ref-25">[25]</a>. Haringa et al. described five applications of lifelines that correspond closely to this plan: a model response study, lifeline-based scale-down design, numerical verification of the scale-down system, reactor optimization through feed location, and long-term fed-batch simulation <a href="#ref-26">[26]</a>. Their lifelines treated cells as massless tracers, with a discrete random-walk model representing turbulent dispersion, and recorded local conditions every 0.03 s <a href="#ref-7">[7]</a>. These studies modeled microbial fermentations, and this plan applies the same methods to CHO cell culture.

Gas–liquid transfer requires separate treatment. Sieblist et al. found that CO₂ stripping in large cell-culture bioreactors depends mainly on changes in gas composition between the sparger and the headspace, and that the impellers partially recirculate the gas rather than allowing it to pass through in plug flow <a href="#ref-27">[27]</a>. CO₂ removal therefore requires a gas-phase balance along the gas path in addition to a transfer coefficient. The analysis by Gray et al. of a 500 L perfusion bioreactor illustrates the importance of CO₂ removal. Oxygen supply could have supported 2.1 × 10⁷ cells/mL, whereas CO₂ removal limited the predicted cell density to 2.4 × 10⁶ cells/mL <a href="#ref-28">[28]</a>. I will initially prescribe the gas composition and concentrate transfer within the bubble plume, and then add gas-phase balances. Surface transfer will be taken from my [headspace study](/projects/bioreactor-surface-gas-transfer/).

Hydrodynamic stress will be evaluated as a constraint rather than included in the kinetic rates. Neunstoecklin et al. found no effect of hydrodynamic stress on CHO growth, metabolism, productivity or product quality below a maximum stress of 32.4 ± 4.4 Pa in oscillating-stress scale-down devices <a href="#ref-29">[29]</a>. I will compare the maximum stresses predicted by the CFD with this threshold.

## Validation targets

The following published observations provide targets for the coupled model. Because they were obtained with specific cell lines and processes, I will use them as qualitative targets rather than as parameter values.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Published CHO responses the coupled model should reproduce" tabindex="0">

| Observation | Experimental system | Expected model response |
| --- | --- | --- |
| Lower viability and productivity at 5,000 L than at 20 L, attributed to oxidative stress from intermittent hypoxia <a href="#ref-2">[2]</a> | Production-scale and bench-scale fed-batch | Hypoxic exposure at large scale in the coupled DO field |
| No response to DO gradients until loop residence time exceeded 90 s, followed by lactate accumulation and up to 15% lower stationary-phase viable cell density, without a change in productivity <a href="#ref-3">[3]</a> | Stirred-tank bioreactor with a plug-flow loop | Little response to brief excursions and a measurable response to sustained exposure |
| Up to 87% more lactate accumulation, higher glucose uptake and lower stationary-phase cell density at power inputs of 1.5–20.4 W/m³ <a href="#ref-30">[30]</a> | Single multi-compartment scale-down bioreactor | Direction and magnitude of the lactate response to slower mixing |
| Lower growth rate, maximum viable cell density and titer with temporary pH 9.0 zones <a href="#ref-4">[4]</a> | Two-compartment scale-down model of a 10–12 m³ bioreactor | Growth response to elevated pH near base addition |
| Growth inhibition and a large reduction in productivity above 150 mmHg pCO₂ <a href="#ref-28">[28]</a> | CHO perfusion culture | CO₂ accumulation and its effect on growth |
| qO₂ of 5.14–5.77 and qCO₂ of 5.31–6.36 pmol/cell/day, with RQ close to 1 <a href="#ref-5">[5]</a> | Perfusion culture at 36.5 °C, pH 6.8 and 50% DO | Magnitudes of OUR and CER |
| RQ above 1 during lactate production and below 1 during lactate consumption <a href="#ref-19">[19]</a> | Fed-batch cultures at 5 L and 50 L with off-gas mass spectrometry | Timing of the lactate metabolic shift |

</div>

## Development sequence

<div class="xdr-experiment-plan" role="region" aria-label="Development phases, their work and the criterion before the next phase" tabindex="0">

| Phase | Work | Criterion before the next phase |
| --- | --- | --- |
| 1. Cell model in a well-mixed vessel | Kinetic model with environmental terms, lactate metabolic shift and exposure memory; Bayesian calibration using bench-scale fed-batch data, including off-gas, base-addition and Raman measurements, and DO and pH oscillation experiments in a well-mixed vessel and a two-compartment system | Prediction of held-out runs, including OUR, CER and the timing of the lactate shift; memory time constant estimated from the oscillation data |
| 2. Flow and compartments | CFD simulations at selected operating conditions; compartment network derived from face fluxes | Agreement of mixing time and compartment tracer response with the reference data |
| 3. Coupled simulations | Species transport with cell-model rates; particle tracking and exposure statistics | Recovery of the well-mixed result under uniform conditions, species conservation and prediction of the scale-down experiments |

</div>

Each phase concludes with a decision. If the coupled and well-mixed models agree for a given vessel and operating range, the well-mixed model is sufficient for that case, which is itself a useful outcome.

Several extensions are deferred. These include structured metabolism, such as kinetic-metabolic networks and genome-scale models, as well as product quality and impurities, population balance models and machine-learning corrections. Fully transient two-phase CFD will serve only as a reference case.

## References

<ol class="project-references">
  <li id="ref-1">González-Hernández, Y., &amp; Perré, P. (2024). <a href="https://doi.org/10.1016/j.mec.2024.e00232">Building blocks needed for mechanistic modeling of bioprocesses: A critical review based on protein production by CHO cells</a>. Metabolic Engineering Communications, 18, e00232.</li>
  <li id="ref-2">Gao et al. (2016). <a href="https://doi.org/10.1002/biot.201600030">Combined metabolomics and proteomics reveals hypoxia as a cause of lower productivity on scale-up to a 5000-liter CHO bioprocess</a>. Biotechnology Journal, 11(9), 1190–1200.</li>
  <li id="ref-3">Anane, E., Knudsen, I. M., &amp; Wilson, G. C. (2021). <a href="https://doi.org/10.1016/j.bej.2020.107870">Scale-down cultivation in mammalian cell bioreactors—The effect of bioreactor mixing time on the response of CHO cells to dissolved oxygen gradients</a>. Biochemical Engineering Journal, 166, 107870.</li>
  <li id="ref-4">Brunner et al. (2017). <a href="https://doi.org/10.1002/biot.201600633">The impact of pH inhomogeneities on CHO cell physiology and fed-batch process performance – two-compartment scale-down modelling and intracellular pH excursion</a>. Biotechnology Journal, 12(7), 1600633.</li>
  <li id="ref-5">Goudar, C. T., Piret, J. M., &amp; Konstantinov, K. B. (2011). <a href="https://doi.org/10.1002/btpr.646">Estimating cell specific oxygen uptake and carbon dioxide production rates for mammalian cells in perfusion culture</a>. Biotechnology Progress, 27(5), 1347–1357.</li>
  <li id="ref-6">U.S. Geological Survey (2020). <a href="https://doi.org/10.3133/tm9A6.2">Dissolved oxygen</a>. Techniques and Methods, book 9, chapter A6.2. Table 6.2-2, based on Benson and Krause (1980, 1984).</li>
  <li id="ref-7">Haringa et al. (2016). <a href="https://doi.org/10.1002/elsc.201600061">Euler-Lagrange computational fluid dynamics for (bio)reactor scale down: An analysis of organism lifelines</a>. Engineering in Life Sciences, 16(7), 652–663.</li>
  <li id="ref-8">Xing, Z., Bishop, N., Leister, K., &amp; Li, Z. J. (2010). <a href="https://doi.org/10.1002/btpr.284">Modeling kinetics of a large-scale fed-batch CHO cell culture by Markov chain Monte Carlo method</a>. Biotechnology Progress, 26(1), 208–219.</li>
  <li id="ref-9">Ben Yahia, B., Malphettes, L., &amp; Heinzle, E. (2015). <a href="https://doi.org/10.1007/s00253-015-6743-6">Macroscopic modeling of mammalian cell growth and metabolism</a>. Applied Microbiology and Biotechnology, 99(17), 7009–7024.</li>
  <li id="ref-10">Mulukutla et al. (2017). <a href="https://doi.org/10.1002/bit.26313">Identification and control of novel growth inhibitors in fed-batch cultures of Chinese hamster ovary cells</a>. Biotechnology and Bioengineering, 114(8), 1779–1790.</li>
  <li id="ref-11">Reddy, J. V., Raudenbush, K., Papoutsakis, E. T., &amp; Ierapetritou, M. (2023). <a href="https://doi.org/10.1016/j.biotechadv.2023.108179">Cell-culture process optimization via model-based predictions of metabolism and protein glycosylation</a>. Biotechnology Advances, 67, 108179.</li>
  <li id="ref-12">Hartley, F., Walker, T., Chung, V., &amp; Morten, K. (2018). <a href="https://doi.org/10.1002/bit.26603">Mechanisms driving the lactate switch in Chinese hamster ovary cells</a>. Biotechnology and Bioengineering, 115(8), 1890–1903.</li>
  <li id="ref-13">Zalai et al. (2015). <a href="https://doi.org/10.1002/btpr.2179">Combining mechanistic and data-driven approaches to gain process knowledge on the control of the metabolic shift to lactate uptake in a fed-batch CHO process</a>. Biotechnology Progress, 31(6), 1657–1668.</li>
  <li id="ref-14">Brunner et al. (2018). <a href="https://doi.org/10.1002/elsc.201700131">Elevated pCO₂ affects the lactate metabolic shift in CHO cell culture processes</a>. Engineering in Life Sciences, 18(3), 204–214.</li>
  <li id="ref-15">Okamura et al. (2024). <a href="https://doi.org/10.1002/btpr.3486">Modeling of cell cultivation for monoclonal antibody production processes considering lactate metabolic shifts</a>. Biotechnology Progress, 40(6), e3486.</li>
  <li id="ref-16">Mulukutla et al. (2015). <a href="https://doi.org/10.1371/journal.pone.0121561">Multiplicity of steady states in glycolysis and shift of metabolic state in cultured mammalian cells</a>. PLoS ONE, 10(3), e0121561.</li>
  <li id="ref-17">O’Brien, C. M., Zhang, Q., Daoutidis, P., &amp; Hu, W.-S. (2021). <a href="https://doi.org/10.1016/j.ymben.2021.03.016">A hybrid mechanistic-empirical model for in silico mammalian cell bioprocess simulation</a>. Metabolic Engineering, 66, 31–40. Model code in the <a href="https://doi.org/10.13020/kdqb-3023">University of Minnesota Data Repository</a>.</li>
  <li id="ref-18">Templeton, N., Dean, J., Reddy, P., &amp; Young, J. D. (2013). <a href="https://doi.org/10.1002/bit.24858">Peak antibody production is associated with increased oxidative metabolism in an industrially relevant fed-batch CHO cell culture</a>. Biotechnology and Bioengineering, 110(7), 2013–2024.</li>
  <li id="ref-19">Goh et al. (2020). <a href="https://doi.org/10.1007/s00449-019-02242-2">Applications of off-gas mass spectrometry in fed-batch mammalian cell culture</a>. Bioprocess and Biosystems Engineering, 43(3), 483–493.</li>
  <li id="ref-20">Möller et al. (2020). <a href="https://doi.org/10.1016/j.compchemeng.2019.106693">Model uncertainty-based evaluation of process strategies during scale-up of biopharmaceutical processes</a>. Computers &amp; Chemical Engineering, 134, 106693.</li>
  <li id="ref-21">Wang, G., Haringa, C., Noorman, H., Chu, J., &amp; Zhuang, Y. (2020). <a href="https://doi.org/10.1016/j.tibtech.2020.01.009">Developing a computational framework to advance bioprocess scale-up</a>. Trends in Biotechnology, 38(8), 846–856.</li>
  <li id="ref-22">Singh, V. K., Jiménez del Val, I., Glassey, J., &amp; Kavousi, F. (2024). <a href="https://doi.org/10.3390/bioengineering11060546">Integration approaches to model bioreactor hydrodynamics and cellular kinetics for advancing bioprocess optimisation</a>. Bioengineering, 11(6), 546.</li>
  <li id="ref-23">Farzan, P., &amp; Ierapetritou, M. G. (2018). <a href="https://doi.org/10.3390/pr6070082">A framework for the development of integrated and computationally feasible models of large-scale mammalian cell bioreactors</a>. Processes, 6(7), 82.</li>
  <li id="ref-24">Delafosse et al. (2014). <a href="https://doi.org/10.1016/j.ces.2013.11.033">CFD-based compartment model for description of mixing in bioreactors</a>. Chemical Engineering Science, 106, 76–85.</li>
  <li id="ref-25">Maldonado de León, H., Straathof, A. J. J., &amp; Haringa, C. (2025). <a href="https://doi.org/10.1016/j.ces.2025.121396">Dynamic compartment models: Towards a rapid modeling approach for fed-batch fermentations</a>. Chemical Engineering Science, 308, 121396.</li>
  <li id="ref-26">Haringa et al. (2018). <a href="https://doi.org/10.1016/j.ces.2017.09.020">Computational fluid dynamics simulation of an industrial P. chrysogenum fermentation with a coupled 9-pool metabolic model: Towards rational scale-down and design optimization</a>. Chemical Engineering Science, 175, 12–24.</li>
  <li id="ref-27">Sieblist et al. (2011). <a href="https://doi.org/10.1002/biot.201100153">Insights into large-scale cell-culture reactors: II. Gas-phase mixing and CO₂ stripping</a>. Biotechnology Journal, 6(12), 1547–1556.</li>
  <li id="ref-28">Gray et al. (1996). <a href="https://doi.org/10.1007/BF00353925">CO₂ in large-scale and high-density CHO cell perfusion culture</a>. Cytotechnology, 22(1–3), 65–78.</li>
  <li id="ref-29">Neunstoecklin et al. (2015). <a href="https://doi.org/10.1016/j.jbiotec.2014.12.003">Determination of the maximum operating range of hydrodynamic stress in mammalian cell culture</a>. Journal of Biotechnology, 194, 100–109.</li>
  <li id="ref-30">Gaugler, L., Hofmann, S., Schlüter, M., &amp; Takors, R. (2024). <a href="https://doi.org/10.1002/bit.28647">Mimicking CHO large-scale effects in the single multicompartment bioreactor: A new approach to access scale-up behavior</a>. Biotechnology and Bioengineering, 121(4), 1244–1256.</li>
</ol>

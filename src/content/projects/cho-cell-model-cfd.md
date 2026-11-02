---
title: "Coupling CHO cell models to CFD: a literature review"
description: "A review of how CHO kinetic models can respond to local dissolved oxygen, pH and pCO₂, and of approaches for coupling them to bioreactor flow through CFD-derived compartments and cell lifelines."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-11-01"
period: "November 2026"
tags: ["Literature review", "CHO", "Mechanistic modeling", "CFD", "Scale-up"]
order: 5
draft: false
---

<p class="project-lede">Most mechanistic models of Chinese hamster ovary (CHO) cell culture assume a perfectly stirred bioreactor without oxygen limitation and with pH under control <a href="#ref-1">[1]</a>. However, these assumptions become less reliable as bioreactor volume increases, and cells may respond to local conditions that a single probe does not measure. In this review, I examine how CHO kinetic models can represent the local environment and how they can be coupled with computational fluid dynamics (CFD). I focus on reduced approaches that could make repeated culture simulations practical on a laptop; their cost and accuracy still need to be benchmarked for the proposed model.</p>

This review follows from my [shake-flask baffles and mixing study](/projects/shake-flask-baffles-and-mixing/), in which I used CFD to compare startup tracer mixing in plain and baffled flask models and began preparing stirred-bioreactor models for future flow studies. Flow models of this kind predict how dissolved species are transported through a vessel, but not how cells respond to the resulting conditions. I focus on unstructured kinetic models with explicit environmental dependence, including the shift between lactate production and consumption. Detailed structured metabolism, product quality and intrinsic cell-to-cell heterogeneity are outside the scope of the proposed model; differences caused by exposure history are retained.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#gradients-at-production-scale">Gradients at production scale</a></li>
    <li><a href="#cho-kinetic-models">CHO kinetic models</a></li>
    <li><a href="#coupling-with-cfd">Coupling with CFD</a></li>
    <li><a href="#validation-targets">Validation targets</a></li>
    <li><a href="#summary-and-outlook">Summary and outlook</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</nav>

## Gradients at production scale

Scale-up studies have linked changes in CHO cell performance to conditions that bulk measurements do not capture. These include intermittent hypoxia at 5,000 L <a href="#ref-2">[2]</a>, responses to dissolved oxygen (DO) gradients at loop residence times above about 90 s in one scale-down system <a href="#ref-3">[3]</a> and regions of elevated pH near base addition <a href="#ref-4">[4]</a>. These studies are summarized in the [validation targets](#validation-targets) below.

An oxygen-inventory calculation can screen when consumption may compete with mixing. If oxygen supply is absent and uptake stays constant, the time to exhaust the initial dissolved inventory is

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

The calculation uses $q_{\mathrm{O_2}}$ = 5.5 pmol/(cell·day), within the range Goudar et al. measured in perfusion cultures at 36.5 °C, pH 6.8 and 50% DO <a href="#ref-5">[5]</a>. This value is a screening assumption for the table, rather than a calibration for a fed-batch cell line. The initial concentration of 0.084 mM is 40% of the 0.210 mM air-saturation concentration in water at 37 °C <a href="#ref-6">[6]</a>. Medium composition, pressure and gas composition change that inventory, and uptake can fall as DO approaches depletion. The calculated times therefore describe the stated constant-uptake case, not a biological threshold.

The XDR-2000 mixing times compiled in my [agitation and mixing study](/projects/bioreactor-agitation-and-mixing/) range from 28 to 38 s. Haringa et al. report the heuristic that the 95% mixing time spans roughly four circulations, which would suggest a circulation time of 7–10 s here <a href="#ref-7">[7]</a>. They also discuss the limitations of inferring cellular fluctuations from bulk mixing time. This heuristic has not been validated for these XDR conditions, and neither it nor the inventory table establishes the magnitude of local DO gradients at 2,000 L.

The next comparison is between the distribution of times cells spend away from oxygen-transfer regions and the time to reach a declared critical DO. For an initial concentration above that critical value, the same constant-uptake assumptions give $(c_{\mathrm{O_2},0}-c_{\mathrm{O_2},\mathrm{crit}})/(q_{\mathrm{O_2}}X_v)$. Local gas transfer and the longer residence times in that distribution matter alongside mean circulation. At about 50 million cells/mL, the table's 26 s inventory is already slightly shorter than the 28–38 s bulk mixing time, which makes spatial assessment particularly relevant. Feed and base addition and CO₂ removal also require their own local source, transport and response calculations.

## CHO kinetic models

Unstructured models describe cells as lumped biomass without resolving intracellular metabolic pools. Unsegregated models use a population-average cell description. A model can use both assumptions: Xing et al. modeled 5,000 L fed-batch cultures with six differential equations and 18 parameters, six calculated from culture data and 12 estimated by Markov chain Monte Carlo (MCMC) from seven runs <a href="#ref-8">[8]</a>. Bayesian estimation of this kind suits coupled simulations because parameter distributions can be propagated through the spatial model. In the approach reviewed by Ben Yahia et al., the stoichiometry linking extracellular inputs and outputs is defined first, kinetic expressions are then added, and the system is closed with bioreactor mass balances <a href="#ref-9">[9]</a>.

A model that responds to its environment needs cell states and extracellular inventories, including those used to calculate pH and the partial pressure of CO₂ (pCO₂). The following table describes a proposed model interface. Its entries include transported inventories, cell-associated states and calculated outputs; their inclusion should follow the measurements available for calibration.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="State variables of an environment-responsive cell model and their roles" tabindex="0">

| Quantity | Role and representation |
| --- | --- |
| Viable and dead cells | Growth, death and lysis |
| Dissolved oxygen | Transported inventory with gas transfer and cellular uptake |
| Glucose, glutamine and glutamate | Primary carbon and nitrogen sources; glutamine synthetase (GS) cell lines also synthesize glutamine |
| Lactate and ammonium | Inhibitory byproducts; lactate may later be consumed |
| Lumped inhibitor | Other growth-inhibiting byproducts of amino acid metabolism <a href="#ref-10">[10]</a> |
| Exposure memory | Cell-associated state for recent exposure to low DO, elevated pH or elevated pCO₂ |
| Product | Titer |
| Osmolality | Measured or calculated from composition; increased locally by concentrated feed and base additions |
| Inorganic carbon, strong ions and buffer totals | Transported inventories used to calculate pCO₂ and pH |

</div>

The specific growth rate is commonly expressed as a product of substrate limitation and inhibition terms. Environmental dependence can be added as further factors:

$$
\mu=\mu_{\max}\prod_j\frac{S_j}{K_j+S_j}\prod_k\frac{K_{I,k}}{K_{I,k}+I_k}\;f_{\mathrm{DO}}\,f_{\mathrm{pH}}\,f_{\mathrm{CO_2}}\,f_T\,f_{\mathrm{osm}}.
$$

Uptake and secretion rates are related to growth through yield coefficients and maintenance terms, each of which can have its own environmental dependence. Multiplying separate environmental factors assumes that their effects are separable. This is a starting hypothesis to test, especially for pH, pCO₂, bicarbonate and osmolality, which are linked through chemistry and control <a href="#ref-14">[14]</a>. Reddy et al. identify reliance on shake-flask metabolism data as a limitation because many such datasets lack sufficient control of pH, DO and pCO₂ <a href="#ref-11">[11]</a>. Estimating environmental effects therefore requires controlled perturbations that distinguish these interacting variables.

In addition to Monod and simple inhibition terms, González-Hernández and Perré describe Haldane- or Luong-type terms for lactate, which acts as both a carbon source and an inhibitor. They also describe switching functions with independently specified transition points and sharpness, which can represent changes between culture phases <a href="#ref-1">[1]</a>. Sharp transitions can introduce stiffness; solver choice and timestep refinement should be checked for the fitted equations.

The lactate metabolic shift requires particular attention. Many CHO fed-batch cultures produce lactate during early growth and consume it later in the culture. Reported triggers of this shift include glucose or glutamine depletion, extracellular lactate concentration, and pH and temperature shifts, with cellular redox state proposed as a common underlying factor <a href="#ref-12">[12]</a>. Zalai et al. controlled the shift over a broad range through the timing of pH and temperature shifts, and associated it mainly with decreasing glycolytic flux <a href="#ref-13">[13]</a>. CO₂ and oxygen also influence the shift. In fed-batch cultures at 150 mmHg pCO₂, Brunner et al. observed no shift to lactate consumption, whereas control cultures at 94 mmHg began consuming lactate at about day 5 <a href="#ref-14">[14]</a>. Okamura et al. found more pronounced lactate consumption at higher DO and low glutamine concentrations, although their model represented DO at only two levels, 50% and 10% <a href="#ref-15">[15]</a>.

Each of these conditions can vary within a large bioreactor, and the shift can also depend on the history of the culture. In the glycolysis model of Mulukutla et al., lactate inhibition and Akt signaling reshape coexisting steady states. Under some conditions the final metabolic state depends on the trajectory of the culture <a href="#ref-16">[16]</a>. Cells circulating through gradients experience different trajectories, so exposure history is a candidate explanation to test alongside instantaneous local conditions.

As a proposed reduced formulation, I would first test a smooth transition between lactate production and consumption. This phenomenological model is motivated by the reviewed studies; it has not been fitted or validated here:

$$
q_{\mathrm{Lac}}=(1-\sigma)\,q_{\mathrm{Lac}}^{+}-\sigma\,q_{\mathrm{Lac}}^{-},\qquad \sigma=\frac{1}{1+\exp\left[-(z-z_0)/w\right]}.
$$

The nonnegative rates $q_{\mathrm{Lac}}^{+}$ and $q_{\mathrm{Lac}}^{-}$ have units of amount per viable cell per time, with a positive net rate denoting secretion. The consumption rate must approach zero as lactate is depleted. The score $z$ is dimensionless, as are the transition position $z_0$ and positive width $w$. Higher $z$ increases $\sigma$ and shifts weight toward the consumption branch; net consumption occurs when the weighted consumption rate exceeds production.

A candidate score is $z=\sum_j\beta_j\widetilde{x}_j+\beta_m m$, where $\widetilde{x}_j$ are dimensionless scaled inputs and the $\beta$ coefficients have signed, fitted values. When fitting this linear score, fix $w=1$ or impose an equivalent normalization: scaling all coefficients, $z_0$ and $w$ together leaves $\sigma$ unchanged. The inputs should form a small, identifiable subset, with reference values and scales declared for each. A glycolytic-flux term would be assigned a negative coefficient to encode higher flux favoring lactate production, if that relationship is supported by the calibration data. It would also require a measured proxy or an additional model relationship before entering the score. The sign of the memory coefficient depends on the response associated with the chosen stress signal.

The dimensionless memory could relax toward a dimensionless stress signal $s$, defined from scaled DO, pH and pCO₂ inputs, with time constant $\tau_m$:

$$
\tau_m\frac{dm}{dt}=s(\mathrm{DO},\mathrm{pH},p\mathrm{CO_2})-m.
$$

This first-order memory attenuates brief pulses, while the sigmoid controls how steeply that filtered signal changes the rates. Both responses are smooth and impose no exact exposure-duration cutoff. The approximately 90 s PFR residence-time result of Anane et al. motivates pulse and recovery experiments around that duration; it does not identify $\tau_m$, because response onset also depends on excursion severity and the downstream response criterion <a href="#ref-3">[3]</a>. Those experiments would need to vary amplitude, duration, repetition and recovery time for the chosen cell line.

The sigmoid and relaxing memory do not by themselves establish the persistent bistability described by Mulukutla et al. <a href="#ref-16">[16]</a>. Forward and reverse perturbations ending at the same extracellular conditions would test whether delayed adaptation is sufficient or a metabolic state with additional feedback is needed to reproduce hysteresis.

O’Brien et al. took a more detailed approach, combining a mechanistic metabolic model with submodels for cell growth, signaling and the bioreactor environment <a href="#ref-17">[17]</a>. The model reproduced run-to-run variability in manufacturing data, which was attributed in part to the metabolic state of the inoculum, and represented differences in scale through CO₂ removal capacity. Its MATLAB code is publicly available, so it can serve as a reference for simpler formulations.

Mulukutla et al. identified nine byproducts of amino acid metabolism that accumulate in fed-batch culture and inhibited growth when added to cultures. Maintaining selected amino acids at 0.5–1 mM during the growth phase reduced their accumulation <a href="#ref-10">[10]</a>. In an unstructured model, a single lumped inhibitor state can represent their combined effect. Templeton et al. observed net lactate consumption from the start of the stationary phase and highly oxidative metabolism at peak antibody production <a href="#ref-18">[18]</a>. A model of the lactate shift should also reproduce this stationary-phase behavior.

For spatial prediction, pH and pCO₂ need to follow local inventories, gas transfer and control actions. Measured trajectories can still be prescribed when calibrating isolated rate expressions. A chemistry calculation can recover pH from electroneutrality using inorganic carbon, lactate, ammonium, strong ions and the relevant medium-specific buffer totals. Gas transfer acts on dissolved molecular CO₂, with its hydration convention declared, while total inorganic carbon provides the conserved inventory <a href="#ref-34">[34]</a>.

Gas measurements provide another comparison with the model. Define the respiratory quotient as $\mathrm{RQ}=\mathrm{CER}/\mathrm{OUR}$, where CER is the CO₂ evolution rate and OUR is the oxygen uptake rate on the same molar basis. Goh et al. observed average RQ above 1 during lactate production and below 1 during lactate consumption. Their CER was uncorrected for bicarbonate-derived abiotic CO₂ and CO₂ solubility, and feed and antifoam additions disturbed the gas signals <a href="#ref-19">[19]</a>. This association is corroborating evidence. Quantitative validation requires an observation model that distinguishes cellular production from off-gas evolution through liquid carbonate storage, gas transfer, inlet and outlet balances, and measurement delays <a href="#ref-34">[34]</a>. A temperature term would also connect the cell model to my [temperature-control study](/projects/bioreactor-temperature-control/), in which cell density is currently prescribed and metabolic heat could be calculated from OUR.

The reviewed studies support calibrating such a model in well-mixed, controlled fed-batch cultures at bench scale before introducing spatial variation. Möller et al. found significant differences in parameter estimates between 30 mL shake flasks and 250 mL controlled bioreactors, but none between 250 mL and 2 L, and predicted a 50 L run using the resulting parameter distributions <a href="#ref-20">[20]</a>. González-Hernández and Perré recommend experiments that cover conditions both within and outside industrial operating ranges, include batch and fed-batch cultures, and reserve some runs for validation <a href="#ref-1">[1]</a>. Sensitivity analysis can narrow the candidate parameters; identifiability checks are then needed to determine which combinations the measurements can constrain.

The following comparison separates published models from the proposed reduced formulation. O’Brien et al. provide a structured reference for mechanisms that a smaller model may need to approximate.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Comparison of representative CHO models and the proposed reduced formulation" tabindex="0">

| Model | Environmental dependence and lactate treatment | Evidence and implementation |
| --- | --- | --- |
| Xing et al. (2010) <a href="#ref-8">[8]</a> | Compact nutrient and byproduct kinetics; a well-mixed baseline | Six ODEs; seven 5,000 L training runs and two validation datasets with perturbed conditions. No public code link verified here. |
| Okamura et al. (2024) <a href="#ref-15">[15]</a> | Glutamine-dependent sigmoid lactate rate at high DO; constant net rate at low DO. DO represented at 50% and 10%, without a continuous local-DO law | 50 L CHO fed-batch cultures in shaken and stirred tanks. One shaken run fitted and a second predicted; the stirred run was fitted separately. Equations published; no public code link verified here. |
| O’Brien et al. (2021) <a href="#ref-17">[17]</a> | Structured metabolism, growth and signaling coupled to CO₂ accumulation and pH control; inoculum state affects lactate trajectories | Fitted to 12,000 L manufacturing data; CO₂-removal changes explored in simulation. Public model deposit linked in [17]. |
| Sigmoid with relaxing memory, proposed here | Smooth production–consumption transition from a small set of scaled local inputs and cell-associated memory; persistent bistability requires a further mechanism | Uncalibrated candidate. Requires controlled perturbations, exposure and recovery data, and prediction of held-out fed-batch runs. |

</div>

## Coupling with CFD

Reviews by Wang et al. and Singh et al. describe the challenges of coupling cell models with CFD and compare coupling approaches in terms of computational load <a href="#ref-21">[21]</a>, <a href="#ref-22">[22]</a>. Different timescales offer opportunities to reduce cost: oxygen consumption and transport occur over seconds to minutes, while cell density usually changes over hours. Frozen velocity and turbulence fields can still be used to solve transient species transport, controls and cell memory. Holding concentration fields at quasi-steady state is a further approximation that needs a timescale check, particularly during feed and base additions or DO oscillations.

Cells can initially be approximated as flow-following tracers when their inertia and slip relative to the liquid are negligible. This does not establish that the liquid flow remains unchanged during culture. At 20 million cells/mL, spherical cells of 15 µm diameter occupy about 3.5% of the suspension volume; at 100 million cells/mL the same calculation gives about 17.7%. Zhang et al. found that CHO suspension rheology depends on cell volume fraction, with effects on simulated stress and gas transfer under their tested high-density conditions <a href="#ref-31">[31]</a>. Hydrodynamic solutions can therefore be reused only over operating ranges where changes in broth rheology, fill volume, agitation, aeration and gas holdup have been assessed.

The following methods can be combined. Their computational cost depends on resolution, solver settings and the number of cellular states, so the cost descriptions are qualitative.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Compatible approaches for coupling a cell model to CFD and their assumptions" tabindex="0">

| Approach | Information provided | Cost and assumptions | Suited to |
| --- | --- | --- | --- |
| Frozen flow with switching between operating states <a href="#ref-23">[23]</a> | Transient concentration fields using stored hydrodynamic solutions | Avoids repeatedly solving flow; stored states must cover changes in operating conditions and properties | Culture simulations with a limited set of hydrodynamic states |
| CFD-derived compartment models <a href="#ref-24">[24]</a>, <a href="#ref-25">[25]</a> | Species inventories exchanged between mixed zones | Low after flow reduction; transport and local exposure need refinement checks | Repeated coupled culture simulations |
| Cell lifelines or parcels <a href="#ref-7">[7]</a>, <a href="#ref-32">[32]</a> | Exposure histories and cell-associated states along trajectories | Cost grows with parcel number and cellular states; turbulent dispersion must be represented | Memory-dependent rates and scale-down design |
| Fully transient, two-way CFD | Evolving flow, species transport and reaction feedback | High; mesh and timestep resolution remain case-specific | Selected reference calculations |

</div>

Delafosse et al. developed compartment models of bioreactor mixing from CFD flow fields <a href="#ref-24">[24]</a>. Maldonado de León et al. extended this approach with machine learning, allowing a single compartment model to follow changes in liquid volume and agitation rate during a fed-batch process <a href="#ref-25">[25]</a>. In their simulation of an industrial *Penicillium chrysogenum* fermentation, Haringa et al. described five applications of lifelines: a model response study, lifeline-based scale-down design, numerical verification of the scale-down system, reactor optimization through feed location, and long-term fed-batch simulation <a href="#ref-26">[26]</a>. In an earlier study, they treated cells as massless tracers, with a discrete random-walk model representing turbulent dispersion, and recorded local conditions every 0.03 s <a href="#ref-7">[7]</a>.

Direct integration has also been demonstrated for CHO cultures. Dasgupta et al. report simulations combining CFD, CHO kinetics and PID control over 14-day cultures at 250 mL, 1,000 L and 2,000 L, with a tenfold computational improvement from separating fast hydrodynamics and slower cell kinetics <a href="#ref-33">[33]</a>. The abstract establishes a relevant precedent for integrated CHO simulations; it does not establish laptop hardware or held-out prediction errors. Those details require full-text assessment before its cost or validation can be compared quantitatively with the proposed model.

Haringa et al. later combined compartment transport with stochastic parcels carrying intracellular states <a href="#ref-32">[32]</a>. Their penicillin example supplies a direct method for retaining cell history and returning parcel rates to extracellular balances. In an 80-hour chemostat benchmark, a coarse case with 36 compartments and 36 parcels took roughly three minutes; a base case with 156 compartments and 1,000 parcels took about 70 minutes. These are reported costs for that particular microbial model, rather than measured performance for a CHO implementation.

In the proposed structure below, compartments hold extracellular inventories and moving cell parcels carry exposure memory. A parcel represents a weighted number of cells, allowing histories to be retained without simulating every cell.

<figure class="xdr-figure">
  <a href="/cho-cfd/cho_cfd_coupling.svg?v=20261102" target="_blank" rel="noopener noreferrer" aria-label="Open the coupling diagram at full size">
    <img src="/cho-cfd/cho_cfd_coupling.svg?v=20261102" alt="Stored CFD flow fields drive compartment transport. Cell parcels carry exposure memory as they move, receive local conditions, and return biomass-weighted reaction rates to the compartment balances." width="960" height="376" loading="lazy" decoding="async" />
  </a>
  <figcaption>Proposed coupling structure. Stored CFD solutions provide compartment exchange and parcel transport. Each parcel retains its exposure memory while receiving local concentrations; its uptake and production rates are weighted by the viable cells it represents and summed into the compartment balances. Outputs include predicted concentrations, reaction rates and exposure statistics.</figcaption>
</figure>

CFD is solved at selected operating conditions, and the compartment and parcel calculations reuse those solutions. The same cell-rate functions receive local conditions in either a well-mixed vessel or a spatial model. The two models exchange the following quantities.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Quantities exchanged between the flow model and the cell model" tabindex="0">

| Direction | Exchanged quantities |
| --- | --- |
| Transport and chemistry to cell parcels | Local DO, pCO₂, pH, nutrients, byproducts, temperature and osmolality; each parcel advances its own memory |
| Cell parcels to compartment balances | Signed uptake and production rates multiplied by the viable cells represented by each parcel; chemical source terms consistent with charge and species accounting |

</div>

For an extracellular species $\alpha$ in compartment $i$, an illustrative conservative balance is

$$
\begin{aligned}
\frac{d(V_i C_{\alpha,i})}{dt}
&=\sum_j Q_{ji}C_{\alpha,j}-\sum_j Q_{ij}C_{\alpha,i}\\
&\quad+\sum_{p\in i}N_{v,p}q_{\alpha,p}\\
&\quad+\dot n_{\alpha,i}^{\mathrm{feed}}-\dot n_{\alpha,i}^{\mathrm{out}}\\
&\quad+\dot n_{\alpha,i}^{\mathrm{gas}}+V_i r_{\alpha,i}^{\mathrm{abiotic}}.
\end{aligned}
$$

Here $V_i$ is liquid volume, $C_{\alpha,i}$ is concentration and $Q_{ij}$ is intercompartment liquid flow, including any modeled turbulent exchange. Parcel $p$ represents $N_{v,p}$ viable cells and returns a signed specific rate $q_{\alpha,p}$, positive for production and negative for uptake. The external feed, outlet and gas terms have units of amount per time, while $r^{\mathrm{abiotic}}$ is an abiotic reaction rate per volume. Each intercompartment flux appears with opposite signs in its two neighboring balances. Species and elemental audits must account explicitly for gas exchange, feeds, outlets and reaction stoichiometry.

During each coupling interval, the model selects the hydrodynamic state, advances species and parcel transport, evaluates local chemistry and cellular states, and returns the weighted reaction sources. Controller actions then update the gas and addition inputs. These operations must be iterated or substepped when their feedback changes within the interval. Memory moves with the parcel and is not reset when it crosses a compartment boundary. Replacing these histories with one mean memory per compartment is an alternative closure whose effect on nonlinear rates needs testing. Haringa et al. also show why parcel number and compartment transitions can introduce artificial concentration fluctuations, making intracellular-response convergence necessary alongside bulk mixing checks <a href="#ref-32">[32]</a>.

Gas–liquid transfer requires separate treatment. Sieblist et al. found that CO₂ stripping in large cell-culture bioreactors depends mainly on changes in gas composition between the sparger and the headspace, and that the impellers partially recirculate the gas rather than allowing it to pass through in plug flow <a href="#ref-27">[27]</a>. CO₂ removal therefore requires a gas-phase balance along the gas path in addition to a transfer coefficient. For a 500 L perfusion example using pure oxygen at 0.002 vvm through a microporous frit, Gray et al. estimated that oxygen supply could support 2.1 × 10⁷ cells/mL, while CO₂ removal would limit density to 2.4 × 10⁶ cells/mL <a href="#ref-28">[28]</a>. These are conditional transfer-capacity estimates. A coupled model can start from a prescribed gas composition, with transfer concentrated within the bubble plume, and add gas-phase balances later. Surface transfer can be estimated with the correlation from my [headspace study](/projects/bioreactor-surface-gas-transfer/).

Hydrodynamic stress can initially be assessed as an operating constraint. Neunstoecklin et al. found no appreciable effect on the measured performance of their CHO line below 32.4 ± 4.4 Pa in oscillating-stress scale-down devices <a href="#ref-29">[29]</a>. This is a study-specific reference. Comparison with CFD requires the same stress definition and attention to cell line, exposure duration and repetition; wall shear, mean strain-derived stress and turbulent stress estimates are not interchangeable solely because each is expressed in pascals.

Laptop suitability remains an engineering target for this implementation. A benchmark should simulate a declared 14-day culture and report the processor, available memory, use of a GPU, wall time and peak memory. Initial CFD cost should be reported separately from each repeated compartment–parcel simulation. Compartment count, parcel count and coupling interval should be refined against a finer reference until the changes in bulk trajectories, lactate-shift timing and hypoxic exposure statistics fall within predeclared tolerances. Runtime comparisons are useful only alongside those accuracy checks; no laptop runtime has yet been measured for the model proposed here.

## Validation targets

The following published observations provide targets for a coupled model. Because they were obtained with specific cell lines and processes, they are better suited to qualitative comparison than to parameter estimation.

<div class="xdr-experiment-plan xdr-data-table" role="region" aria-label="Published CHO responses a coupled model should reproduce" tabindex="0">

| Observation | Experimental system | Expected model response |
| --- | --- | --- |
| Lower viability and productivity at 5,000 L than at 20 L, attributed to oxidative stress from intermittent hypoxia <a href="#ref-2">[2]</a> | Production-scale and bench-scale fed-batch | Hypoxic exposure at large scale in the coupled DO field |
| Responses to DO gradients above about 90 s loop residence time, including lactate accumulation and up to 15% lower stationary-phase viable cell density, without a change in productivity <a href="#ref-3">[3]</a> | Stirred-tank bioreactor with a plug-flow loop | Study-specific exposure response; onset does not identify a universal threshold or a memory time constant |
| Up to 87% more lactate accumulation relative to the reference reactor, with higher glucose uptake and lower stationary-phase cell density <a href="#ref-30">[30]</a> | Single multi-compartment scale-down bioreactor tested at 1.5, 6.4 and 20.4 W/m³; responses differed across settings | Direction of the lactate response; quantitative comparison requires matching the cell line and operating conditions |
| Lower growth rate, maximum viable cell density and titer with temporary pH 9.0 zones <a href="#ref-4">[4]</a> | Two-compartment scale-down model of a 10–12 m³ bioreactor | Growth response to elevated pH near base addition |
| Growth inhibition and a large reduction in productivity above 150 mmHg pCO₂ <a href="#ref-28">[28]</a> | CHO perfusion culture | CO₂ accumulation and its effect on growth |
| qO₂ of 5.14–5.77 and qCO₂ of 5.31–6.36 pmol/cell/day, with RQ close to 1 <a href="#ref-5">[5]</a> | Perfusion culture at 36.5 °C, pH 6.8 and 50% DO | Context for specific respiration rates under the reported conditions |
| Average RQ above 1 during lactate production and below 1 during lactate consumption <a href="#ref-19">[19]</a> | Fed-batch cultures at 5 L and 50 L; CER uncorrected for bicarbonate-derived CO₂ and CO₂ solubility | Corroborating trend; quantitative comparison needs a gas and carbonate observation model |

</div>

## Summary and outlook

The reviewed studies lead to three conclusions. First, environmental rate expressions need controlled bioreactor data and experiments that distinguish interacting effects <a href="#ref-1">[1]</a>. Second, exposure history can matter, but the approximately 90 s result in one scale-down system does not identify a memory time constant <a href="#ref-3">[3]</a>, and reproducing metabolic hysteresis requires more than a smooth switching function <a href="#ref-16">[16]</a>. Third, hydrodynamic solutions can support repeated reduced simulations when changes in operating conditions and broth properties remain within assessed bounds. Direct CHO integration and compartment–parcel methods provide precedents <a href="#ref-33">[33]</a>, <a href="#ref-32">[32]</a>; the proposed model still needs its own calibration, validation and computational benchmark.

These conclusions suggest a sequence in which the cell model and the flow model are each tested before they are coupled.

<div class="xdr-experiment-plan" role="region" aria-label="Suggested development stages, their work and the test before the next stage" tabindex="0">

| Stage | Work | Test before the next stage |
| --- | --- | --- |
| 1. Cell model in a well-mixed vessel | Fit a small set of environmental terms and a candidate lactate switch using controlled fed-batch data, off-gas and base-addition records, and pulse and recovery experiments. Include Raman measurements where available | Identifiable parameters, prediction of held-out runs and measured gas signals, and evidence for whether delayed adaptation or persistent hysteresis is needed |
| 2. Flow and compartments | CFD at selected agitation rates, fill volumes, aeration and rheological conditions; conservative compartment exchange including the chosen turbulent-dispersion treatment | Agreement with measured tracer responses, agreement between compartment and CFD transport, and assessed bounds for flow reuse |
| 3. Coupled simulations | Transient species balances with parcel-bound memory and viable-cell-weighted reaction sources | Recovery of the well-mixed limit, closure of material balances, convergence with compartment count, parcel count and coupling interval, prediction of held-out scale-down experiments, and a reported runtime and memory benchmark |

</div>

Each stage ends with a decision. If both models reproduce the relevant validation data and agree within predeclared tolerances across the assessed operating range, the well-mixed model may be sufficient for that case. That decision should also account for prediction uncertainty. Once an unstructured model has been tested in this way, detailed structured metabolism, product quality and intrinsic cell-to-cell heterogeneity can be added where the data justify them.

## References

<ol class="project-references">
  <li id="ref-1">González-Hernández &amp; Perré (2024). <a href="https://doi.org/10.1016/j.mec.2024.e00232">Building blocks needed for mechanistic modeling of bioprocesses: A critical review based on protein production by CHO cells</a>. Metabolic Engineering Communications, 18, e00232.</li>
  <li id="ref-2">Gao et al. (2016). <a href="https://doi.org/10.1002/biot.201600030">Combined metabolomics and proteomics reveals hypoxia as a cause of lower productivity on scale-up to a 5000-liter CHO bioprocess</a>. Biotechnology Journal, 11(9), 1190–1200.</li>
  <li id="ref-3">Anane et al. (2021). <a href="https://doi.org/10.1016/j.bej.2020.107870">Scale-down cultivation in mammalian cell bioreactors—The effect of bioreactor mixing time on the response of CHO cells to dissolved oxygen gradients</a>. Biochemical Engineering Journal, 166, 107870.</li>
  <li id="ref-4">Brunner et al. (2017). <a href="https://doi.org/10.1002/biot.201600633">The impact of pH inhomogeneities on CHO cell physiology and fed-batch process performance – two-compartment scale-down modelling and intracellular pH excursion</a>. Biotechnology Journal, 12(7), 1600633.</li>
  <li id="ref-5">Goudar et al. (2011). <a href="https://doi.org/10.1002/btpr.646">Estimating cell specific oxygen uptake and carbon dioxide production rates for mammalian cells in perfusion culture</a>. Biotechnology Progress, 27(5), 1347–1357.</li>
  <li id="ref-6">U.S. Geological Survey (2020). <a href="https://doi.org/10.3133/tm9A6.2">Dissolved oxygen</a>. Techniques and Methods, book 9, chapter A6.2. Table 6.2-2, based on Benson and Krause (1980, 1984).</li>
  <li id="ref-7">Haringa et al. (2016). <a href="https://doi.org/10.1002/elsc.201600061">Euler-Lagrange computational fluid dynamics for (bio)reactor scale down: An analysis of organism lifelines</a>. Engineering in Life Sciences, 16(7), 652–663.</li>
  <li id="ref-8">Xing et al. (2010). <a href="https://doi.org/10.1002/btpr.284">Modeling kinetics of a large-scale fed-batch CHO cell culture by Markov chain Monte Carlo method</a>. Biotechnology Progress, 26(1), 208–219.</li>
  <li id="ref-9">Ben Yahia et al. (2015). <a href="https://doi.org/10.1007/s00253-015-6743-6">Macroscopic modeling of mammalian cell growth and metabolism</a>. Applied Microbiology and Biotechnology, 99(17), 7009–7024.</li>
  <li id="ref-10">Mulukutla et al. (2017). <a href="https://doi.org/10.1002/bit.26313">Identification and control of novel growth inhibitors in fed-batch cultures of Chinese hamster ovary cells</a>. Biotechnology and Bioengineering, 114(8), 1779–1790.</li>
  <li id="ref-11">Reddy et al. (2023). <a href="https://doi.org/10.1016/j.biotechadv.2023.108179">Cell-culture process optimization via model-based predictions of metabolism and protein glycosylation</a>. Biotechnology Advances, 67, 108179.</li>
  <li id="ref-12">Hartley et al. (2018). <a href="https://doi.org/10.1002/bit.26603">Mechanisms driving the lactate switch in Chinese hamster ovary cells</a>. Biotechnology and Bioengineering, 115(8), 1890–1903.</li>
  <li id="ref-13">Zalai et al. (2015). <a href="https://doi.org/10.1002/btpr.2179">Combining mechanistic and data-driven approaches to gain process knowledge on the control of the metabolic shift to lactate uptake in a fed-batch CHO process</a>. Biotechnology Progress, 31(6), 1657–1668.</li>
  <li id="ref-14">Brunner et al. (2018). <a href="https://doi.org/10.1002/elsc.201700131">Elevated pCO₂ affects the lactate metabolic shift in CHO cell culture processes</a>. Engineering in Life Sciences, 18(3), 204–214.</li>
  <li id="ref-15">Okamura et al. (2024). <a href="https://doi.org/10.1002/btpr.3486">Modeling of cell cultivation for monoclonal antibody production processes considering lactate metabolic shifts</a>. Biotechnology Progress, 40(6), e3486.</li>
  <li id="ref-16">Mulukutla et al. (2015). <a href="https://doi.org/10.1371/journal.pone.0121561">Multiplicity of steady states in glycolysis and shift of metabolic state in cultured mammalian cells</a>. PLoS ONE, 10(3), e0121561.</li>
  <li id="ref-17">O’Brien et al. (2021). <a href="https://doi.org/10.1016/j.ymben.2021.03.016">A hybrid mechanistic-empirical model for in silico mammalian cell bioprocess simulation</a>. Metabolic Engineering, 66, 31–40. Model code in the <a href="https://doi.org/10.13020/kdqb-3023">University of Minnesota Data Repository</a>.</li>
  <li id="ref-18">Templeton et al. (2013). <a href="https://doi.org/10.1002/bit.24858">Peak antibody production is associated with increased oxidative metabolism in an industrially relevant fed-batch CHO cell culture</a>. Biotechnology and Bioengineering, 110(7), 2013–2024.</li>
  <li id="ref-19">Goh et al. (2020). <a href="https://doi.org/10.1007/s00449-019-02242-2">Applications of off-gas mass spectrometry in fed-batch mammalian cell culture</a>. Bioprocess and Biosystems Engineering, 43(3), 483–493.</li>
  <li id="ref-20">Möller et al. (2020). <a href="https://doi.org/10.1016/j.compchemeng.2019.106693">Model uncertainty-based evaluation of process strategies during scale-up of biopharmaceutical processes</a>. Computers &amp; Chemical Engineering, 134, 106693.</li>
  <li id="ref-21">Wang et al. (2020). <a href="https://doi.org/10.1016/j.tibtech.2020.01.009">Developing a computational framework to advance bioprocess scale-up</a>. Trends in Biotechnology, 38(8), 846–856.</li>
  <li id="ref-22">Singh et al. (2024). <a href="https://doi.org/10.3390/bioengineering11060546">Integration approaches to model bioreactor hydrodynamics and cellular kinetics for advancing bioprocess optimisation</a>. Bioengineering, 11(6), 546.</li>
  <li id="ref-23">Farzan &amp; Ierapetritou (2018). <a href="https://doi.org/10.3390/pr6070082">A framework for the development of integrated and computationally feasible models of large-scale mammalian cell bioreactors</a>. Processes, 6(7), 82.</li>
  <li id="ref-24">Delafosse et al. (2014). <a href="https://doi.org/10.1016/j.ces.2013.11.033">CFD-based compartment model for description of mixing in bioreactors</a>. Chemical Engineering Science, 106, 76–85.</li>
  <li id="ref-25">Maldonado de León et al. (2025). <a href="https://doi.org/10.1016/j.ces.2025.121396">Dynamic compartment models: Towards a rapid modeling approach for fed-batch fermentations</a>. Chemical Engineering Science, 308, 121396.</li>
  <li id="ref-26">Haringa et al. (2018). <a href="https://doi.org/10.1016/j.ces.2017.09.020">Computational fluid dynamics simulation of an industrial P. chrysogenum fermentation with a coupled 9-pool metabolic model: Towards rational scale-down and design optimization</a>. Chemical Engineering Science, 175, 12–24.</li>
  <li id="ref-27">Sieblist et al. (2011). <a href="https://doi.org/10.1002/biot.201100153">Insights into large-scale cell-culture reactors: II. Gas-phase mixing and CO₂ stripping</a>. Biotechnology Journal, 6(12), 1547–1556.</li>
  <li id="ref-28">Gray et al. (1996). <a href="https://doi.org/10.1007/BF00353925">CO₂ in large-scale and high-density CHO cell perfusion culture</a>. Cytotechnology, 22(1–3), 65–78.</li>
  <li id="ref-29">Neunstoecklin et al. (2015). <a href="https://doi.org/10.1016/j.jbiotec.2014.12.003">Determination of the maximum operating range of hydrodynamic stress in mammalian cell culture</a>. Journal of Biotechnology, 194, 100–109.</li>
  <li id="ref-30">Gaugler et al. (2024). <a href="https://doi.org/10.1002/bit.28647">Mimicking CHO large-scale effects in the single multicompartment bioreactor: A new approach to access scale-up behavior</a>. Biotechnology and Bioengineering, 121(4), 1243–1255.</li>
  <li id="ref-31">Zhang et al. (2025). <a href="https://doi.org/10.1002/biot.70003">Rheology of CHO cell suspensions and its effects on high-density cultivation process and bioreactor design</a>. Biotechnology Journal, 20(3), e70003.</li>
  <li id="ref-32">Haringa et al. (2022). <a href="https://doi.org/10.1002/bit.28094">Stochastic parcel tracking in an Euler–Lagrange compartment model for fast simulation of fermentation processes</a>. Biotechnology and Bioengineering, 119(7), 1849–1860.</li>
  <li id="ref-33">Dasgupta et al. (2025). <a href="https://doi.org/10.1016/j.jbiotec.2025.06.012">Integrative in-silico models for mammalian cell cultures in single-use bioreactors: Bridging hydrodynamics, kinetics, and process control across scales</a>. Journal of Biotechnology, 406, 42–52. Abstract and bibliographic record inspected; full-text validation details and hardware were not assessed here.</li>
  <li id="ref-34">Frahm et al. (2002). <a href="https://doi.org/10.1016/S0168-1656(02)00180-3">Determination of dissolved CO₂ concentration and CO₂ production rate of mammalian cell suspension culture based on off-gas measurement</a>. Journal of Biotechnology, 99(2), 133–148.</li>
</ol>

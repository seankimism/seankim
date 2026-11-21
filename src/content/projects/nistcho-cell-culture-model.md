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
    <li><a href="#governing-equations-and-fitting">Equations and fitting</a></li>
    <li><a href="#calibration-and-held-out-testing">Calibration and testing</a></li>
    <li><a href="#spin-tube-cultures">Spin-tube cultures</a></li>
    <li><a href="#lactate-in-ph-controlled-bioreactors">Lactate in ambr bioreactors</a></li>
    <li><a href="#shared-calibration-on-ambr-15-and-ambr-250">Shared ambr calibration</a></li>
    <li><a href="#coupling-the-nistcho-model-to-cfd">CFD coupling</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</nav>

## Published NISTCHO data

The model draws on two publications that culture the same cell line in different vessels and laboratories. I used four of the spin-tube feeding strategies from the 2026 study, which ran without pH control <a href="#ref-2">[2]</a>. The 2025 reference cell line study ran the same blended feed at two sites, in ambr 15 and ambr 250 bioreactors held at pH 6.9, and also measured glutamine, glutamate, and ammonium <a href="#ref-1">[1]</a>.

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

## Governing equations and fitting

I developed the well-mixed model used on this page by combining material balances with rate laws informed by prior kinetic models of CHO, hybridoma, and yeast cultures and by the NISTCHO measurements. Dahodwala et al. supplied the ambr and 2025 spin-tube measurements, and Schäpertöns et al. supplied the 2026 spin-tube measurements <a href="#ref-1">[1]</a> <a href="#ref-2">[2]</a>.

One consistent choice of solver units is time in days, cell density in cells/L, and solutes in mol/L. On that basis, use mol per active cell per day for solute fluxes and g per active cell per day for antibody production. Use mol of nitrogen per liter for the pooled amino-acid nitrogen. For glucose and lactate, divide the reported concentration in g/L by the molar mass in g/mol before applying the balances, then convert the model outputs back to g/L.

### Cell growth and viability

Earlier CHO models used distinct populations to describe progression through apoptosis, with first-order death and lysis <a href="#ref-5">[5]</a> <a href="#ref-6">[6]</a>. I used an intact but metabolically inactive state to represent the delayed loss of viability after carbon depletion in the LoG spin tubes <a href="#ref-2">[2]</a>.

Let $X_h$, $X_a$, and $X_d$ denote the densities of active, apoptotic, and dead cells. Cells enter apoptosis at rate $k_d$, remain intact for a mean time $\tau_e$, and then enter the dead-cell pool. Dead cells lyse at rate $k_\ell$.

$$
\begin{aligned}
\dot X_h &= (\mu-k_d)X_h,\\
\dot X_a &= k_d X_h-X_a/\tau_e,\\
\dot X_d &= X_a/\tau_e-k_\ell X_d.
\end{aligned}
$$

The viable count is $X_v=X_h+X_a$ and viability is $X_v/(X_v+X_d)$. Only $X_h$ contributes to cellular uptake and production. Start with the inoculum viable density in $X_h$ and calculate $X_d$ from the initial viability. Initialize $X_a$ and the starvation exposure $S$ at zero.

Growth is reduced by an inhibitor $I$ that accumulates with active cell density, an inoculum adaptation factor $A$, and starvation exposure $S$. Ben Yahia et al. linked CHO growth to an inhibitor that accumulates with integrated viable cell density <a href="#ref-7">[7]</a>. In this model, $I$ accumulates with active cell density between feeds and serves as a proxy for inhibition of both growth and glycolysis. The factor $A$ acts as a lag term after inoculation <a href="#ref-8">[8]</a>.

Define a Monod-type saturation function $M(c,K)=c/(K+c)$ and a Hill-type inhibition function $B(z,K,n)=1/[1+(z/K)^n]$, both common in CHO kinetic models <a href="#ref-7">[7]</a> <a href="#ref-9">[9]</a> <a href="#ref-10">[10]</a>. Let $B_\mu$ and $B_g$ be inhibition functions of $I$, with separate coefficients for growth and glycolysis. Let $f_N=M(N,K_N)$, where $N$ is the nitrogen in amino acids other than the explicitly tracked glutamine, glutamate, and asparagine.

$$
\begin{aligned}
\dot I &= X_h, \qquad I(0)=X_h(0)/\mu_{\max},\\
\dot A &= (1-A)/\tau_A,\\
\mu &= \mu_{\max}B_\mu A(1-S)f_N.
\end{aligned}
$$

Glucose $G$ and lactate $L$ contribute to a carbon availability $C=G+L/2$ on a molar basis. The starvation signal is $\sigma=K_s^2/(K_s^2+C^2)$, an inverse saturation term like those used for nutrient-dependent death <a href="#ref-6">[6]</a> <a href="#ref-11">[11]</a>. I introduced the exposure $S$ to represent the delayed death of LoG cultures after carbon depletion <a href="#ref-2">[2]</a>. Exposure builds during carbon depletion and relaxes when carbon becomes available.

$$
\begin{aligned}
\dot S &= \frac{\sigma(1-S)}{\tau_{\mathrm{starve}}}
          -\frac{(1-\sigma)S}{\tau_{\mathrm{recover}}},\\
k_d &= k_{d0}+k_{dI}(1-B_I)+k_{dS}(1-B_S).
\end{aligned}
$$

Here $B_I$ is an inhibition function of $I$ and $B_S$ is one of $S$. Their complements, which are Hill functions <a href="#ref-6">[6]</a>, give the increases in apoptosis with accumulated cell-days <a href="#ref-7">[7]</a> and starvation exposure. The time constants for starvation and recovery are separate.

### Glucose, lactate, and antibody

Glucose uptake $J_G$ combines basal <a href="#ref-9">[9]</a> <a href="#ref-12">[12]</a> and inhibitor-sensitive <a href="#ref-10">[10]</a> terms. I added a feed factor $F$ to represent the transient increase in glucose uptake inferred from the 2026 spin-tube data after nutrient feeds <a href="#ref-2">[2]</a>. The factor enters with the main feed and is consumed in proportion to active cell density. Initialize $F$ at zero and assign a value of one in the main feed and zero in glucose stock and water. Its normalization can be absorbed into the coefficient $\alpha$.

$$
\begin{aligned}
\dot F &= -k_F X_h F,\\
J_G &= (J_0+J_1 B_g)M(G,K_G)(1+\alpha F).
\end{aligned}
$$

The oxidative-capacity term follows overflow models of yeast and hybridoma cultures <a href="#ref-11">[11]</a> <a href="#ref-13">[13]</a>. It also draws on redox-dependent CHO modeling by Nolan and Lee and on Zalai et al.'s observation that the switch to lactate uptake accompanied a decrease in glycolytic flux <a href="#ref-10">[10]</a> <a href="#ref-14">[14]</a>. I represented the switch with a single capacity $J_{\mathrm{ox}}$. Glycolysis near or above this capacity produces lactate, with two moles of lactate per mole of glucose routed to overflow. The softplus function $\phi_\epsilon(z)=\epsilon\ln(1+e^{z/\epsilon})$ provides a smooth approximation to $\max(z,0)$.

Lactate uptake uses spare oxidative capacity <a href="#ref-10">[10]</a>. CHO cultures have been observed to switch to lactate uptake after glucose depletion <a href="#ref-15">[15]</a>. I used a glucose-dependent repression term, in the form used for ethanol uptake in yeast <a href="#ref-13">[13]</a>, to represent the greater lactate uptake inferred for LoG than for STD at similar glucose uptake rates <a href="#ref-2">[2]</a>.

$$
\begin{aligned}
J_{\mathrm{over}} &= \min\!\big[J_G,\phi_\epsilon(J_G-J_{\mathrm{ox}})\big],\\
R &= k_L\phi_\epsilon(J_{\mathrm{ox}}-J_G),\\
J_L &= R\,M(L,K_L)\,[1-M(G,K_R)],\\
\dot G &= -X_h J_G,\\
\dot L &= X_h(2J_{\mathrm{over}}-J_L).
\end{aligned}
$$

The antibody production rate $q_P$ increases as the growth brake engages <a href="#ref-9">[9]</a> <a href="#ref-12">[12]</a> and falls with starvation exposure. The nutrient factor $f_N$ follows Ben Yahia et al. <a href="#ref-7">[7]</a>. I included the factor $1-\sigma$ to represent the drop in antibody productivity inferred from LoG when carbon ran out <a href="#ref-2">[2]</a>. For antibody titer $P$, use compatible mass units for $q_P$ and $P$.

$$
\begin{aligned}
q_P &= [q_0+q_1(1-B_\mu)](1-S)f_N(1-\sigma),\\
\dot P &= X_h q_P.
\end{aligned}
$$

<details class="xdr-details">
  <summary>Nitrogen balances</summary>

I treat the intracellular nitrogen carriers as quasi-steady, following an approach used in dynamic CHO modeling <a href="#ref-10">[10]</a>. The reduced network includes asparagine deamidation as a source of ammonium, a flux identified in the CHOmpact analysis of GS-CHO cultures <a href="#ref-16">[16]</a>. The rate laws below are specific to this model.

Let $Q$, $E$, $U$, and $H$ be extracellular glutamine, glutamate, asparagine, and ammonium. For each nitrogen carrier $j$, compute its demand $D_j=b_j\mu+p_jq_P$ from its contribution per new cell and per unit mass of antibody. The biomass coefficients use CHO composition estimates informed by CHOmpact and measurements from Széliová et al. <a href="#ref-16">[16]</a> <a href="#ref-17">[17]</a>. The product coefficients use the published NISTmAb amino-acid sequence <a href="#ref-18">[18]</a>. Include the biomass amide demand $b_{\mathrm{am}}\mu$ in $D_Q$. This demand returns glutamate to the intracellular pool.

First calculate saturable asparagine uptake $J_U=V_U M(U,K_U)$. The deficit is supplied by asparagine synthetase at rate $s_U=\phi_{\epsilon_N}(D_U-J_U)$. The surplus is deamidated at rate $d_U=\phi_{\epsilon_N}(J_U-D_U)$. Asparagine synthesis consumes a glutamine amide and returns glutamate.

Net glutamine export $J_Q$ combines growth-linked export and saturable uptake. The glutamine synthetase flux $v_{\mathrm{GS}}$ meets that export and the cellular demand. The ammonium availability factor $f_H=M(H,K_H)$ limits export and increases the contribution of intracellular deamination as extracellular ammonium is depleted.

$$
\begin{aligned}
J_Q &= a_Q\mu f_H-b_Q^{\mathrm{up}}M(Q,K_Q),\\
v_{\mathrm{GS}} &= J_Q+D_Q+s_U,\\
J_E &= (a_E+b_E^{\mathrm{up}}\mu)M(E,K_E).
\end{aligned}
$$

The intracellular glutamate deficit $\Delta_E$ is supplied by transamination at rate $v_T=\phi_{\epsilon_N}(\Delta_E)$. A surplus is deaminated at rate $v_D=\phi_{\epsilon_N}(-\Delta_E)$. The remaining amino-acid nitrogen supplies growth, antibody synthesis, and these transfers.

$$
\begin{aligned}
\Delta_E &= D_E+v_{\mathrm{GS}}-J_E-b_{\mathrm{am}}\mu-s_U,\\
v_N &= V_N M(N,K_D)+(1-f_H)(D_Q+s_U),\\
J_N &= D_N+v_T+v_N+s_U-d_U.
\end{aligned}
$$

In the medium, glutamine decays by the first-order law $r_Q=k_Q Q$, consistent with culture-medium measurements by Ozturk and Palsson <a href="#ref-19">[19]</a> and with the CHO model of Xing et al. <a href="#ref-9">[9]</a>. Each glutamine releases one ammonium and leaves one nitrogen in pyroglutamate. The extracellular equations are

$$
\begin{aligned}
\dot U &= -X_hJ_U,\qquad \dot E=-X_hJ_E,\\
\dot N &= -X_hJ_N,\qquad \dot Q=X_hJ_Q-r_Q,\\
\dot H &= X_h(d_U+v_D+v_N-v_{\mathrm{GS}})+r_Q.
\end{aligned}
$$

The net fluxes $J_Q$, $v_{\mathrm{GS}}$, and $J_N$ are signed. Use a smaller smoothing width $\epsilon_N$ for the nitrogen reactions. These equations close the intracellular balances for asparagine, glutamine, glutamate, and the amino donor pool. When checking total nitrogen, keep a ledger of nitrogen entering in feeds, leaving in samples, and incorporated into biomass, antibody, and pyroglutamate.

</details>

### Feed events and calibration

Between events, integrate the rate equations at fixed volume. At a sampling and feeding event, remove the well-mixed sample, leaving volume $V_r=V^--V_s$. The feed updates follow from conservation of volume and of the amount of each species during mixing <a href="#ref-9">[9]</a>. Each feed adds volume $V_f$ at concentration $c_f$.

$$
\begin{aligned}
V^+ &= V_r+\sum_f V_f,\\
c^+ &= \frac{V_r c^-+\sum_f V_f c_f}{V^+}.
\end{aligned}
$$

Apply this update to medium species, cell densities, antibody titer, and inhibitor $I$. Assign zero cells and zero inhibitor to the feeds. The cell states $A$ and $S$ carry over without dilution. Store the state just before the additions for comparison with pre-feed assays.

To top up glucose when $G^+<G_{\mathrm{target}}$, solve the mixing equation for the stock volume and apply it as a second addition.

$$
V_{\mathrm{top}}=V^+\frac{G_{\mathrm{target}}-G^+}{G_{\mathrm{stock}}-G_{\mathrm{target}}}.
$$

1. **Assemble the inputs.** Record sample times, viable density, viability, titer, concentrations, feed composition, feed volumes, and sampling events for each culture. The ambr supplementary workbook provides site means and standard deviations. The spin-tube study reports replicate assays, feed doses, and a supplementary amino-acid composition table. Record assumptions for unpublished ambr inputs, including sampling phase and feed volumes. Use the [ambr study supplement](#ref-1) and the [spin-tube data archive](https://zenodo.org/records/18609042).
2. **Fit the cell and carbon kinetics first.** For each candidate parameter set, solve for each inoculum block's $A(0)$ by matching its mean pre-feed day-3 viable count. Use the closest bound and retain the discrepancy in the objective if the target is outside the attainable range. Fit viable density, viability, titer, glucose, and lactate in the development cultures by bounded least squares in log-parameter space. Scale residuals by replicate spread with a floor for assay precision. Use multiple starting points. For a reported glucose or lactate value of zero, penalize only the amount by which a prediction exceeds the assay floor.
3. **Fit nitrogen and test transfer.** Hold the carbon coefficients fixed while estimating nitrogen rates and the ambr feed amino-acid scale from Site 1. Score the held-out cultures against the same assay definitions. For the shared ambr comparison, refit the glucose and lactate coefficients to both ambr sites and evaluate the spin tubes with those coefficients.

## Calibration and held-out testing

For the released calibration, I fitted STD, LoG, HiF, and Site 1 and held out HIP, Site 2, and the 2025 spin tubes. Residuals were scaled by tolerances declared before scoring. For the spin tubes, the tolerance was the replicate spread of STD and LoG or the assay floor. For the ambr bioreactors, Site 1 was judged on its own duplicate-vessel spread during fitting. The held-out Site 2 used a tolerance based on the difference between the two sites. A variable passed when its scaled error was within twice its tolerance.

Two inputs came directly from the data. First, each experiment's inoculum lag was set from its own day-3 cell count, because seed trains differed between experiments and the day-3 sample was taken before any condition-specific treatment. That count served as the conditioning target. Second, for the 2026 spin tubes, I placed samples and feeds on the cell counter's timestamps. The nominal days differed by up to 4.8 hours, which changed the modeled glucose concentration by 0.49 g/L. The 2025 runs used the reported culture days.

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
  <li id="ref-5">Meshram, M., Naderi, S., McConkey, B., et al. (2012). <a href="https://doi.org/10.1002/bit.24392">Population-based modeling of the progression of apoptosis in mammalian cell culture</a>. Biotechnology and Bioengineering, 109(5), 1193–1204.</li>
  <li id="ref-6">Meshram, M. (2011). <a href="https://uwspace.uwaterloo.ca/handle/10012/6482">Dynamic modeling of apoptosis and its interaction with cell growth in mammalian cell culture</a>. PhD thesis, University of Waterloo.</li>
  <li id="ref-7">Ben Yahia, B., Malphettes, L., &amp; Heinzle, E. (2021). <a href="https://doi.org/10.1016/j.ymben.2021.04.004">Predictive macroscopic modeling of cell growth, metabolism and monoclonal antibody production: Case study of a CHO fed-batch production</a>. Metabolic Engineering, 66, 204–216.</li>
  <li id="ref-8">Mazzoleni, S., Landi, C., Cartenì, F., et al. (2015). <a href="https://doi.org/10.1186/s12934-015-0295-4">A novel process-based model of microbial growth: self-inhibition in <em>Saccharomyces cerevisiae</em> aerobic fed-batch cultures</a>. Microbial Cell Factories, 14, 109.</li>
  <li id="ref-9">Xing, Z., Bishop, N., Leister, K., et al. (2010). <a href="https://doi.org/10.1002/btpr.284">Modeling kinetics of a large-scale fed-batch CHO cell culture by Markov chain Monte Carlo method</a>. Biotechnology Progress, 26(1), 208–219.</li>
  <li id="ref-10">Nolan, R. P., &amp; Lee, K. (2011). <a href="https://doi.org/10.1016/j.ymben.2010.09.003">Dynamic model of CHO cell metabolism</a>. Metabolic Engineering, 13(1), 108–124.</li>
  <li id="ref-11">Amribt, Z., Niu, H., &amp; Bogaerts, P. (2013). <a href="https://doi.org/10.1016/j.bej.2012.11.005">Macroscopic modelling of overflow metabolism and model based optimization of hybridoma cell fed-batch cultures</a>. Biochemical Engineering Journal, 70, 196–209.</li>
  <li id="ref-12">Ben Yahia, B., Gourevitch, B., Malphettes, L., et al. (2017). <a href="https://doi.org/10.1002/bit.26214">Segmented linear modeling of CHO fed-batch culture and its application to large scale production</a>. Biotechnology and Bioengineering, 114(4), 785–797.</li>
  <li id="ref-13">Sonnleitner, B., &amp; Käppeli, O. (1986). <a href="https://doi.org/10.1002/bit.260280620">Growth of <em>Saccharomyces cerevisiae</em> is controlled by its limited respiratory capacity: Formulation and verification of a hypothesis</a>. Biotechnology and Bioengineering, 28(6), 927–937.</li>
  <li id="ref-14">Zalai, D., Koczka, K., Párta, L., et al. (2015). <a href="https://doi.org/10.1002/btpr.2179">Combining mechanistic and data-driven approaches to gain process knowledge on the control of the metabolic shift to lactate uptake in a fed-batch CHO process</a>. Biotechnology Progress, 31(6), 1657–1668.</li>
  <li id="ref-15">Martínez, V. S., Dietmair, S., Quek, L.-E., et al. (2013). <a href="https://doi.org/10.1002/bit.24728">Flux balance analysis of CHO cells before and after a metabolic switch from lactate production to consumption</a>. Biotechnology and Bioengineering, 110(2), 660–666.</li>
  <li id="ref-16">Jiménez del Val, I., Kyriakopoulos, S., Albrecht, S., et al. (2023). <a href="https://doi.org/10.1002/bit.28459">CHOmpact: A reduced metabolic model of Chinese hamster ovary cells with enhanced interpretability</a>. Biotechnology and Bioengineering, 120(9), 2479–2493.</li>
  <li id="ref-17">Széliová, D., Ruckerbauer, D. E., Galleguillos, S. N., et al. (2020). <a href="https://doi.org/10.1016/j.ymben.2020.06.002">What CHO is made of: Variations in the biomass composition of Chinese hamster ovary cell lines</a>. Metabolic Engineering, 61, 288–300.</li>
  <li id="ref-18">National Institute of Standards and Technology (2026). <a href="https://tsapps.nist.gov/srmext/certificates/8671.pdf#page=2">NISTmAb, Humanized IgG1κ Monoclonal Antibody</a>. Reference Material 8671 Information Sheet, Figure 1.</li>
  <li id="ref-19">Ozturk, S. S., &amp; Palsson, B. O. (1990). <a href="https://doi.org/10.1021/bp00002a005">Chemical decomposition of glutamine in cell culture media: effect of media type, pH, and serum concentration</a>. Biotechnology Progress, 6(2), 121–128.</li>
</ol>

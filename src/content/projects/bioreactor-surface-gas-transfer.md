---
title: "Headspace gas transfer"
description: "Published surface oxygen-transfer measurements from ambr 15 to 2,000 L and a correlation fitted to 24 conditions from four studies."
organization: "Independent project"
parentProject: "bioprocess-modeling"
publishedDate: "2026-09-27"
period: "2026–present"
tags: ["Gas transfer", "kLa", "Headspace", "Scale-down"]
order: 2
draft: false
---

I built this model to understand how surface gas transfer changes with reactor scale. I compared published oxygen-transfer measurements from ambr 15 to 2,000 L, then fitted a surface-transfer correlation to the studies with enough information to reconstruct the model inputs.

<nav class="project-outline" aria-label="On this page">
  <p>On this page</p>
  <ol>
    <li><a href="#literature-review-headspace-and-surface-gas-transfer">Literature review</a></li>
    <li><a href="#surface-transfer-correlation-and-validation">Correlation model and validation</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</nav>

## Literature review: headspace and surface gas transfer

<span id="measured-surface-transfer-from-02-to-2000-l" aria-hidden="true"></span>

Bowers reported a fivefold decrease in surface O₂ transfer between 8 and 2,000 L <a href="#ref-1">[1]</a>. The smaller vessels in the studies below generally have higher coefficients, although their agitation, media and gas flows differ. I use this comparison to show the range of reported surface transfer across scales.

<figure class="xdr-figure">
  <a href="/gas-transfer/surface_kla_scale.svg?v=08c512813e6f" target="_blank" rel="noopener noreferrer" aria-label="Open the surface transfer scale plot at full size">
    <img src="/gas-transfer/surface_kla_scale.svg?v=08c512813e6f" alt="Thirty-two reported surface oxygen-transfer conditions against working volume on logarithmic axes, spanning 13 mL to 2,000 L. Individual colored markers show seven source studies, with separate markers for the two ambr 15 fills. No range bars or Bowers connector are shown. A single gray dotted line slopes downward across the measurements as a visual guide. The legend spans four columns and two rows." width="2023" height="1276" loading="lazy" decoding="async" />
  </a>
  <figcaption>Surface oxygen transfer from 13 mL to 2,000 L. Points show reported conditions; some means overlap. The ambr 15 data are Nienow’s water measurements at 37 °C and 300–1,500 rpm <a href="#ref-2">[2]</a>; the ambr 250 point is Clark’s 215 mL, 300 rpm condition <a href="#ref-3">[3]</a>. The gray dotted line guides the eye across the measurements. CO₂ and de Lamotte data are omitted.</figcaption>
</figure>

The table lists the ambr measurements and four Bowers vessels. Bowers vessel names refer to nominal capacity. I read the Xu oxygen-transfer values and Anand’s area per volume from Anand’s Figure 6, so those values are approximate. Paired ambr 15 values are listed in 13 mL / 15 mL order.

<div class="xdr-experiment-plan xdr-data-table xdr-numeric-table" role="region" aria-label="Measured surface transfer coefficients for ambr 15, ambr 250 and the four Bowers vessel sizes" tabindex="0">

| Vessel | Tank dimensions | Agitation | Surface $k_La$, O₂ | Area per volume |
| --- | --- | --- | --- | --- |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 300 rpm | 2.60 / 2.05 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 700 rpm | 4.62 / 3.75 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 1,000 rpm | 6.07 / 4.61 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 1,200 rpm | 6.72 / 5.18 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 15 · Nienow <sup><a href="#ref-2">[2]</a></sup> | 28 × 15 mm | 1,500 rpm | 7.51 / 6.06 h⁻¹ | 32.3 / 28.0 m⁻¹ |
| ambr 250 · Clark <sup><a href="#ref-3">[3]</a></sup> | 0.0678 m | 300 rpm | 1.10 h⁻¹ | ≈16.8 m⁻¹ |
| ambr 250 · Xu / Anand <sup><a href="#ref-4">[4]</a>, <a href="#ref-5">[5]</a></sup> | 0.068 m | 200 rpm | ≈0.92 h⁻¹ | ≈12.4 m⁻¹ |
| ambr 250 · Xu / Anand <sup><a href="#ref-4">[4]</a>, <a href="#ref-5">[5]</a></sup> | 0.068 m | 400 rpm | ≈1.30 h⁻¹ | ≈12.4 m⁻¹ |
| ambr 250 · Xu / Anand <sup><a href="#ref-4">[4]</a>, <a href="#ref-5">[5]</a></sup> | 0.068 m | 600 rpm | ≈1.51 h⁻¹ | ≈12.4 m⁻¹ |
| 15 L · Bowers <sup><a href="#ref-1">[1]</a></sup> | 0.20 m | 90 rpm | 0.25 h⁻¹ | 3.93 m⁻¹ |
| 200 L · Bowers <sup><a href="#ref-1">[1]</a></sup> | 0.61 m | 30 rpm | 0.10 h⁻¹ | 1.83 m⁻¹ |
| 500 L · Bowers <sup><a href="#ref-1">[1]</a></sup> | 0.80 m | 27 rpm | 0.06 h⁻¹ | 1.20 m⁻¹ |
| 2,500 L · Bowers <sup><a href="#ref-1">[1]</a></sup> | 1.50 m | 17 rpm | 0.05 h⁻¹ | 0.88 m⁻¹ |

</div>

Surface $k_La$ generally increases as the reactor gets smaller, making headspace gas exchange more important at small scale. For similar vessel shapes, the free-surface area per liquid volume increases as size decreases; this raises $k_La$ when $k_L$ is comparable. That is why I include headspace composition and gas renewal when comparing oxygen supply and CO₂ removal across scales <a href="#ref-1">[1]</a>. The differences between these studies also reflect agitation, medium and gas flow.

<details class="xdr-details">
  <summary>Measurements, sources and comparison limits</summary>

Bowers used DMEM with 10% fetal calf serum and 0.05 vvm headspace air. O₂ coefficients came from dissolved-oxygen recovery after nitrogen sparging; CO₂ coefficients were inferred from pH slopes using carbonate equilibrium. I calculated A/V as $\pi T^2/(4V)$ at 8, 160, 420 and 2,000 L, assuming a flat circular surface. Vessel dimensions and fills are in Table 1, surface $k_La$ in Table 4, and agitation on p. 3 <a href="#ref-1">[1]</a>.

For ambr 15, I used Nienow’s water measurements at 37 °C without sparging, from the QG = 0 column of Table 2 <a href="#ref-2">[2]</a>. The 28 × 15 mm dimensions are the internal width and depth; the other vessels list diameter. A/V uses the gross planar area of 0.00042 m², with no correction for hardware or surface deformation. The manuscript also reports medium measurements with antifoam in Table 3, which I have kept separate. The water assay used static gassing out after a headspace air purge; a continuous overlay rate is not established. Flow is transitional, and the lower-speed P/V values extrapolate a constant measured power number below the electrical calibration range.

Clark’s ambr 250 condition uses 9 mL/min headspace air, down-pumping and no sparging. The measurement is in Table B.2 (p. 258), and the geometry table (p. 66) gives top and base diameters of 67.8 and 60 mm <a href="#ref-3">[3]</a>. I calculated A/V as $\pi T^2/(4V)$ using the top diameter and 215 mL fill, giving about 16.8 m⁻¹. This gross-area estimate does not correct for taper or hardware at the liquid surface.

Xu’s ambr 250 series uses 10 mL/min headspace air <a href="#ref-4">[4]</a>. I read the $k_La$ values from Anand’s Figure 6, which reproduces the Xu experiments <a href="#ref-5">[5]</a>. Anand’s Section 2.1 and Figures 1 and 6 give a 0.068 m free-surface diameter and about 12.4 m⁻¹ A/V for the CFD configuration. I have not verified that geometry for Xu’s original assay. The assay working volume is not reported in Anand’s reproduction, so I have not inferred it from the CFD geometry.

The following values were read from published figures:

- 0.3 L miniature bioreactor — approximately 1.33, 1.88 and 2.25 h⁻¹ at 300, 400 and 500 rpm in CD-CHO at 37 °C, with 200 mL/min headspace air (Al-Ramadhani 2015, Figure 3.9, p. 80 <a href="#ref-6">[6]</a>). These are digitized means of three replicates.
- 1 L stirred tank — approximately 0.31–1.33 h⁻¹ among selected figure means over 50–250 rpm in PBS at 37 °C, with headspace flows of 100–500 mL/min (Wyrobnik et al. 2025, Figure 3A <a href="#ref-7">[7]</a>).
- 5.4 L unbaffled Rushton — approximately 0.17 and 0.30 h⁻¹ at 100 and 200 rpm in water at 16 °C (Scargiali et al. 2013, Figure 4 <a href="#ref-8">[8]</a>). These are selected low-speed, near-flat-interface conditions; the study also reports higher transfer with a deeper vortex.
- 16.5 L dual Rushton (excluded) — approximately 0.14 h⁻¹ at 50 rpm, with 1.58 h⁻¹ reported in the text and Table 1 at 300 rpm (de Lamotte et al. 2017 <a href="#ref-9">[9]</a>). The source's figure and table differ at the upper endpoint, as noted below.

I included Xu’s measurements in the table but left them off the volume plot because the assay fill is not reported in Anand’s reproduction. Clark’s plotted volume comes from the experimental table. The Schlaich points cover selected up-pumping conditions at 60–90 rpm, 40 L and 10 L/min headspace flow.

Some studies report apparent coefficients from the overall nonsparged response. Differences in medium, temperature, impeller configuration and gas replacement make it difficult to separate geometry from operating conditions. I placed the dotted guide by fitting a straight line in log space to the displayed measurements, giving each paper equal total weight. It shows the overall pattern across these studies, not an isolated effect of volume.

I excluded the six de Lamotte conditions from the current plots and fit after seeing a consistent offset from the model. I kept the measurements in the source inventory. There is also a source discrepancy at 300 rpm: the text and Table 1 give 4.4 × 10⁻⁴ s⁻¹, or about 1.58 h⁻¹, while the Figure 3 marker is nearer 2.0 h⁻¹. That discrepancy alone does not explain the offset across the study.

Schlaich’s selected up-pumping measurements at 40 L were about 0.90–1.33 h⁻¹ <a href="#ref-10">[10]</a>, overlapping the 16.5 L results. The reported 0.57 m tank diameter gives a planar A/V of 6.4 m⁻¹ at 40 L, compared with about 2.3 m⁻¹ for the 16.5 L tank. This is one reason I use geometry at the working fill in the model, while keeping the differences in operating conditions in mind.

</details>

## Surface-transfer correlation and validation

I calculate surface $k_La$ from the liquid-side transfer velocity and free-surface area per liquid volume:

$$
k_La = C(\epsilon\nu)^{1/4}Sc^{-n}\frac{A}{V}, \qquad Sc=\frac{\nu}{D}.
$$

Here $\epsilon=P/(\rho V)$ is the mean energy dissipation, $\nu$ is kinematic viscosity, and $D$ is gas diffusivity. The transfer rate also depends on the gas–liquid driving force, $c^*-c$.

<span id="what-a-surface-model-requires" aria-hidden="true"></span>

<details class="xdr-details">
  <summary>Model inputs, coefficient sets and applicability</summary>

<div class="xdr-experiment-plan xdr-data-table xdr-input-table" role="region" aria-label="Inputs required by the surface transfer model and how well each is known" tabindex="0">

| Input | Meaning | Source | How well it is known |
| --- | --- | --- | --- |
| $A$, $V$ | Free-surface area at the working fill and the liquid volume beneath it | Vessel geometry at fill height | The flat circular area, or rectangular area for ambr 15, is an approximation. The real interface is deformed by the vortex and obstructed by the shaft, probes and dip tubes, none of which I subtract. |
| $\epsilon$ | Dissipation supplied to the correlation, W/kg | Vessel-mean $P/(\rho V)$ with an optional surface-to-mean multiplier | I use a multiplier of 1. Changing the dissipation basis also changes the meaning of the fitted coefficient. |
| $\nu$, $\rho$ | Kinematic viscosity and density at temperature | Water correlations, or measured medium values | Good for water; culture media are generally assumed water-like. |
| $D$ | Diffusivity of each gas, setting $Sc = \nu/D$ | Tabulated at 25 °C with Stokes–Einstein temperature scaling | Good for oxygen. CO₂ and N₂ scale from oxygen through the same Schmidt exponent and inherit its uncertainty. |
| $C$, $n$ | Model constant and Schmidt exponent | Calibration against measured surface transfer | I fit C while holding n at 2/3. |
| $c^*$, $c$ | Equilibrium and bulk dissolved-gas concentrations, setting the driving force $c^*-c$ | Henry's law at temperature and headspace partial pressure, plus the liquid concentration | Headspace composition can change with surface exchange, sparger exhaust and overlay flow. Molecular CO₂ must be distinguished from total dissolved inorganic carbon. |

</div>

<div class="xdr-experiment-plan xdr-data-table xdr-parameter-table" role="region" aria-label="Published constant and Schmidt exponent pairs for the surface renewal expression" tabindex="0">

| Set | $C$ | $n$ | Basis |
| --- | --- | --- | --- |
| Lamont & Scott (1970) <a href="#ref-11">[11]</a> | 0.4 | 1/2 | Eddy-cell model, expressed using near-interface dissipation |
| Kawase & Moo-Young (1990), Eq. 7 <a href="#ref-12">[12]</a> | 0.138 | 2/3 | Free-surface correlation using vessel-mean dissipation; Eq. 8 separately cites the 0.13 Calderbank–Moo-Young form |
| Combined literature fit | 0.1265 | 2/3 | Twenty-four conditions from four studies, including ambr 15; de Lamotte excluded; no power-range restriction and equal total weight per study |

</div>

I use vessel-mean dissipation and $n=2/3$ for the literature fit.

Several inputs need approximations. The eight 1 L PBS measurements use water properties and the source’s water-power fit. I included all ten ambr 15 water measurements, both Scargiali water conditions and four Schlaich conditions through 90 rpm. I left out Schlaich’s 100 rpm point because headspace mixing remains uncertain there. The ambr 250 assays lack matched model inputs, and no 2,000 L measurement enters the fit. Bowers prints a power input of 2.5 mW/m³, which I have left unresolved rather than correcting without evidence.

The model does not yet check for low turbulence or gas entrainment. The transitional ambr 15 conditions remain in the fit.

I give each study equal total weight and minimize squared errors in log $k_La$. I calculate RMSE, $R^2$, Pearson r and p in the original $k_La$ units; $R^2$ is $1-\mathrm{SSE}/\mathrm{SST}$. The p values are nominal because conditions from the same study are not independent replicates.

</details>

<span id="validation-status-and-gas-balance-checks" aria-hidden="true"></span>

### Literature parity and validation status

I fitted one coefficient to 24 conditions from four studies, with no P/V cutoff. With $n=2/3$, the fit gives $C=0.1265$, RMSE 0.608 h⁻¹ and $R^2=0.929$. The model tends to underpredict Schlaich and overpredict ambr 15. I still need measurements to test it at 2,000 L and in culture media.

I removed the six de Lamotte conditions <a href="#ref-9">[9]</a> after reviewing their consistent offset from the model. This was a choice made after looking at the results, so the fit statistics describe the four studies I kept.

The fit includes ten ambr 15 water measurements, eight 1 L PBS measurements, two 5.4 L water measurements and four 40 L water measurements. Their reported or reconstructed P/V ranges from 0.31 to 483 W/m³. [Download the inputs and predictions](/gas-transfer/surface_kla_combined_parity.csv).

<figure class="xdr-figure">
  <a href="/gas-transfer/surface_kla_global_expanded_fit.svg?v=efee84f42b68" target="_blank" rel="noopener noreferrer" aria-label="Open the surface-transfer literature calibration parity plot">
    <img src="/gas-transfer/surface_kla_global_expanded_fit.svg?v=efee84f42b68" alt="Global calibration parity plot for 24 conditions from four studies on shared logarithmic axes, excluding de Lamotte. Filled markers distinguish studies, including all ten ambr 15 water conditions. One coefficient, C equals 0.1265, is fitted without a power-range restriction." width="1584" height="1584" loading="lazy" decoding="async" />
  </a>
  <figcaption>Predicted and measured surface oxygen transfer for ambr 15 <a href="#ref-2">[2]</a>, 1 L <a href="#ref-7">[7]</a>, 5.4 L <a href="#ref-8">[8]</a> and 40 L <a href="#ref-10">[10]</a>.</figcaption>
</figure>

## References

<ol class="project-references">
  <li id="ref-1"><span id="surface-table-ref-5" aria-hidden="true"></span>Bowers, J. S. (2008). <a href="https://skoge.folk.ntnu.no/prost/proceedings/aiche-2008/data/papers/P118781.pdf">Sparger and Surface Gas Transfer for Cell Culture Bioreactors</a>. 2008 AIChE Annual Meeting, paper P118781. Tables 1 and 4; agitation on p. 3.</li>
  <li id="ref-2"><span id="surface-table-ref-1" aria-hidden="true"></span>Nienow et al. (2013). <a href="https://repository.lboro.ac.uk/articles/journal_contribution/The_physical_characterisation_of_a_microscale_parallel_bioreactor_platform_with_an_industrial_CHO_cell_line_expressing_an_IgG4/9244370">The physical characterisation of a microscale parallel bioreactor platform with an industrial CHO cell line expressing an IgG4</a>. Biochemical Engineering Journal, 76, 25–36. Author manuscript, Table 2 and Figure 1.</li>
  <li id="ref-3"><span id="surface-table-ref-2" aria-hidden="true"></span>Clark, C. E. (2020). <a href="https://discovery.ucl.ac.uk/10111802/2/Clark_10111802_Thesis.pdf">Characterization and Scalability Assessment of a Parallel Single-Use Bioreactor System for Mammalian Cell Culture</a>. PhD thesis, University College London. Table B.2, p. 258; geometry table, p. 66.</li>
  <li id="ref-4"><span id="surface-table-ref-3" aria-hidden="true"></span>Xu et al. (2017). <a href="https://doi.org/10.1002/btpr.2417">Characterization of TAP Ambr 250 disposable bioreactors, as a reliable scale-down model for biologics process development</a>. Biotechnology Progress, 33, 478–489. Experimental values read from their reproduction in Anand et al. <a href="#ref-5">[5]</a>, Figure 6.</li>
  <li id="ref-5"><span id="surface-table-ref-4" aria-hidden="true"></span>Anand et al. (2024). <a href="https://doi.org/10.1016/j.jbiotec.2024.04.013">An in-silico analysis of hydrodynamics and gas mass transfer characteristics in scale-down models for mammalian cell cultures</a>. Journal of Biotechnology, 388, 96–106. Section 2.1 and Figures 1 and 6.</li>
  <li id="ref-6">Al-Ramadhani, O. (2015). <a href="https://discovery.ucl.ac.uk/id/eprint/1460929/2/Al-Ramadhani_Omar_Thesis_Copyright_Removed.pdf">Design and characterisation of a parallel miniaturised bioreactor system for mammalian cell culture</a>. Doctor of Engineering thesis, University College London. Figure 3.9, p. 80.</li>
  <li id="ref-7">Wyrobnik et al. (2025). <a href="https://doi.org/10.1002/bit.70025">Scalable, High-Density Expansion of Human Mesenchymal Stem Cells on Microcarriers Using the Bach Impeller in Stirred-Tank Reactors</a>. Biotechnology and Bioengineering, 122(10), 2803–2818. Figure 3A.</li>
  <li id="ref-8">Scargiali, F., Busciglio, A., Grisafi, F., &amp; Brucato, A. (2013). <a href="https://www.aidic.it/cet/13/32/248.pdf">Influence of Viscosity on Mass Transfer Performance of Unbaffled Stirred Vessels</a>. Chemical Engineering Transactions, 32, 1483–1488. Figure 4.</li>
  <li id="ref-9">de Lamotte, A., Delafosse, A., Calvo, S., Delvigne, F., &amp; Toye, D. (2017). <a href="https://discovery.ucl.ac.uk/10064111/1/Manuscript_pdf.pdf">Investigating the effects of hydrodynamics and mixing on mass transfer through the free-surface in stirred tank bioreactors</a>. Chemical Engineering Science, 172, 125–142. Table 1 and Figure 3.</li>
  <li id="ref-10">Schlaich et al. (2023). <a href="https://doi.org/10.1002/btpr.3330">Experimental and computational characterization of mass transfer in high turndown bioreactors</a>. Biotechnology Progress, 39(3), e3330. Figure 5.</li>
  <li id="ref-11">Lamont, J. C., &amp; Scott, D. S. (1970). <a href="https://doi.org/10.1002/aic.690160403">An eddy cell model of mass transfer into the surface of a turbulent liquid</a>. AIChE Journal, 16, 513–519.</li>
  <li id="ref-12">Kawase, Y., &amp; Moo-Young, M. (1990). <a href="https://www.researchgate.net/publication/280002515_Mass_transfer_at_a_free_surface_in_stirred_tank_bioreactors">Mass transfer at a free surface in stirred tank bioreactors</a>. Chemical Engineering Research and Design, 68(2), 189–194. Equation 7; author-uploaded paper.</li>
</ol>

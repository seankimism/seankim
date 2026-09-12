---
title: "Thermal model of a 2,000 L single-use bioreactor"
description: "Building the thermal layer of a cell-culture process model, from media hold heating and experimental validation to control, biological, and physicochemical coupling."
organization: "Independent project"
period: "2026–present"
tags: ["Heat transfer", "Bioreactor modeling", "Thermal simulation"]
order: 0
---

## Problem statement

Temperature connects physicochemical and biological behavior in cell culture, influencing gas solubility, acid–base equilibria, cell growth, and metabolism. Many process models treat temperature as a fixed input, implicitly assuming that the culture reaches and holds the setpoint. That simplification leaves out how the controller adjusts heating and cooling, how quickly the culture responds, and how far it deviates from the setpoint during process disturbances or programmed temperature shifts.

These dynamics depend on both operating conditions and reactor design. Changes in fill volume, feed temperature and addition rate, metabolic activity, and utility conditions can alter the heating or cooling required to maintain culture temperature. For geometrically similar vessels, the heat-transfer area available per unit of culture volume decreases as scale increases, which can slow the thermal response under otherwise comparable conditions. Representing these effects is necessary to understand how process variability translates into temperature deviations and changing demands on the control system. In practice, this means predicting how closely the culture follows a programmed temperature shift, how far its temperature dips during a cold feed addition, and how much heating and cooling margin remains as scale increases.

This project establishes the thermal foundation for simulating these interactions. I chose Cytiva's XDR-2000 L single-use bioreactor (SUB) as an example and represented it with simplified geometry. The model describes heat exchange between the jacket water, steel wall, culture medium, headspace, and surrounding room to predict the thermal response of the vessel and its contents. Heat transfer through the wall includes bag-film and contact resistance. A cascade controller extends this thermal model to heating, holding temperature, and programmed temperature shifts.

The first application is warming the medium during the media hold phase, before inoculation. With no cells present, this case isolates physical heat exchange from metabolic heat generation and provides a starting point for calibrating and validating the thermal model.

## 01 / Start with the vessel

The model connects four parts: circulating jacket water, the steel wall, culture medium, and headspace air. The medium is assumed to be well mixed, with a uniform temperature throughout the liquid. The headspace also has one bulk temperature, while the wall temperature varies with height.

<figure class="xdr-figure">
  <a href="/xdr2000/xdr2000_mesh_3d.png" target="_blank" rel="noopener noreferrer" aria-label="Open the reactor overview figure at full size">
    <img src="/xdr2000/xdr2000_mesh_3d.png" alt="Cutaway of the simplified Cytiva XDR-2000 L SUB model showing the water jacket, steel wall, 1,000 L of culture medium, and headspace air." width="2400" height="1839" decoding="async" fetchpriority="high" />
  </a>
  <figcaption>The modeled vessel is approximately 1.22 m in diameter and 2.73 m high. This cutaway illustrates the 1,000 L case. Select the figure to view it at full size.</figcaption>
</figure>

## 02 / Divide the wall into connected bands

In the 1,000 L case shown here, the steel wall is divided into 185 horizontal bands. Each band represents a complete ring around the vessel, stores heat, and exchanges heat with its neighbors and adjacent compartments. Thermal resistance between neighboring bands determines the heat flow along the wall, while the liquid and headspace remain bulk states.

<figure class="xdr-figure">
  <a href="/xdr2000/xdr2000_mesh_detail.png?v=bf646a3ff40a" target="_blank" rel="noopener noreferrer" aria-label="Open the thermal mesh detail figure at full size">
    <img src="/xdr2000/xdr2000_mesh_detail.png?v=bf646a3ff40a" alt="Reactor cutaway and enlarged mesh detail showing one temperature per circumferential steel band, heat exchange between neighboring bands, nominal 15 mm band height, and 3 mm wall thickness." width="4800" height="2700" loading="lazy" decoding="async" />
  </a>
  <figcaption>The reactor cutaway locates the selected wall bands (left); complete rings and an enlarged wall segment show their connections (right). One temperature is assigned to each steel ring. The mesh uses a nominal band height of 15 mm and a modeled wall thickness of 3 mm.</figcaption>
</figure>

## 03 / Connect the heat-transfer pathways

The wall mesh connects the circulating jacket water to the liquid and headspace through the single-use bag. Below the liquid level, wall bands exchange heat with the culture medium; above it, they exchange heat with headspace air. Both paths include the resistance of the bag film and its contact with the steel wall. Conduction links neighboring steel bands, while the exposed wall and jacket also exchange heat with the room. The bag is represented as a thermal resistance rather than a separate temperature state.

<figure class="xdr-figure">
  <a href="/xdr2000/heat_transfer_interactions.png?v=f1ba715716a9" target="_blank" rel="noopener noreferrer" aria-label="Open the heat-transfer interactions diagram at full size">
    <img src="/xdr2000/heat_transfer_interactions.png?v=f1ba715716a9" alt="Thermal network connecting jacket water, steel wall mesh, culture medium, headspace air, and room. Resistor symbols on the steel-to-liquid and steel-to-headspace paths represent bag-film and contact resistance. Neighboring steel elements exchange heat by conduction." width="3652" height="1584" loading="lazy" decoding="async" />
  </a>
  <figcaption>Resistor symbols represent bag-film and contact resistance. Solid arrows show heat-exchange paths; dashed arrows mark the jacket-water supply and return. The room temperature and water-inlet conditions are model inputs.</figcaption>
</figure>

## 04 / Explore the warm-up

The explorer opens with 1,000 L of medium at 4 °C. Water enters the jacket at a constant 40 °C and 50 L/min, with the room at 20 °C. In this default case, the liquid reaches **36.5 °C after approximately 5 h 34 min**.

<dl class="xdr-conditions" aria-label="Simulation settings and adjustable volume range">
  <div><dt>Culture medium (adjustable volume)</dt><dd>400–2,000 L · 4 °C initially</dd></div>
  <div><dt>Jacket inlet</dt><dd>40 °C · 50 L/min</dd></div>
  <div><dt>Room temperature</dt><dd>20 °C</dd></div>
  <div><dt>Liquid target</dt><dd>36.5 °C</dd></div>
</dl>

Choose a media volume between **400 and 2,000 L** in **1 L increments**, then select **Simulate** to explore its temperature response and vessel view. The inlet, initial-temperature, and room conditions remain the same.

Play the simulation or move the time slider to follow the temperatures. Drag the vessel to rotate the cutaway; the wall colors show the temperature of each steel band. Compare the time to target at different fill volumes.

<figure class="xdr-explorer">
  <iframe src="/xdr2000/index.html" title="Interactive bioreactor heat-transfer simulation: adjustable media volume, rotatable vessel, temperature curves, and time slider" width="800" height="1300" loading="lazy" data-content-height></iframe>
  <figcaption><a href="/xdr2000/index.html" target="_blank" rel="noopener noreferrer">Open the interactive explorer in a full window ↗</a></figcaption>
</figure>

For the default 1,000 L case, the simulated temperatures at eight hours are **38.6 °C in the liquid, 39.6 °C in the jacket water, and 34.0 °C in the headspace**. Heating continues after the target is reached: the 36.5 °C target marks a temperature crossing and does not switch off heating. The values in the explorer update when a different volume is simulated.

The geometry and heat-transfer properties are simplified model inputs. The curves represent simulated temperature responses.

The next article, [Controlling temperature in a 2,000 L single-use bioreactor](/projects/bioreactor-temperature-control/), adds cascade control to this thermal model. Its interactive explorer compares culture and jacket temperatures as controller tuning changes, including heating-only and heating/cooling operation.

## Calibration and experimental validation

The next step is to estimate the uncertain thermal parameters and test predictions against independent cell-free experiments. The proposed plan below separates calibration runs from independent validation experiments. Heating and cooling tests across working volumes, with repeated reference runs, have precedent in [Cytiva's XDR characterization study](https://cdn.cytivalifesciences.com/api/public/content/digi-23201-pdf); the matrix below is a proposed study for this model.

### Measurements

Record synchronized liquid temperatures at multiple positions, jacket inlet and outlet temperatures, jacket flow, accessible wall temperatures, headspace temperature, and room temperature. Also record fill volume, agitation, and bag installation. Check sensor offsets and response times before testing. Spatial liquid measurements would test the assumption that one bulk temperature represents the culture medium.

Use measured jacket conditions as boundary inputs for the thermal model. Replaying measured inlet histories remains a planned extension of the open-loop warm-up model; the controller explorer instead calculates its inlet conditions from the modeled TCU and circulation loop.

### Proposed experiment matrix

<div class="xdr-experiment-plan" role="region" aria-label="Proposed calibration and validation experiment matrix" tabindex="0">

| Experiment | Proposed conditions | Purpose |
| --- | --- | --- |
| Reference calibration | At 1,000 L, perform three independent cycles of heating from 20 to 36.5 °C, an elevated-temperature hold, and cooling to 20 °C. Keep agitation consistent; include a separate bag installation among the repeats. | Fit effective heat-transfer and environmental-loss parameters, and quantify repeatability and bag-contact variability. |
| Jacket-flow sensitivity | At 1,000 L, repeat a heating/cooling cycle at a second flow within the installed unit's operating limits. Log actual inlet conditions and flow. | Test whether the assumed jacket-side transfer adequately represents changes in circulation. Use these data during model development. |
| Independent fill-volume validation | Reserve two heating/cooling cycles each at 400 L and 2,000 L. Freeze the model and fitted parameters before predicting these complete runs. | Test whether parameters estimated at 1,000 L predict heating and cooling at 400 L and 2,000 L in the same vessel, without refitting. |

</div>

Start commissioning with water or a defined aqueous surrogate, then confirm predictions using representative medium and its measured or justified thermal properties. Water-based calibration alone would not establish accuracy for every medium. The proposed temperatures and flow changes would be finalized against the installed temperature-control unit's capability.

## Future directions

The cell-free model provides the starting point for three planned layers of coupling. Each layer would be evaluated against relevant measurements as the simulation expands toward a complete culture process.

### 1. Control and scale

Refine the current cascade-control comparison using measured TCU behavior, sensor response, and separate tuning for heating-only and heating/cooling operation. As biological coupling is introduced, evaluate the controller under a changing metabolic heat load. Extend the model to other reactor scales using the corresponding geometry, heat-transfer parameters, and utility limits. This would allow comparisons of heating and cooling capacity, control response, and conditions under which heat removal may begin to limit the process.

### 2. Biological coupling

Estimate metabolic heat from oxygen uptake rate (OUR), initially using roughly **450–500 kJ of heat released per mol O₂ consumed** as an aerobic approximation. This estimate would need to be checked against cell-specific metabolism, including heat production not captured by oxygen uptake alone. [Gnaiger and Kemp (1990)](https://doi.org/10.1016/0005-2728(90)90164-Y) discuss the relationship between heat production, oxygen consumption, and aerobic and anaerobic contributions in cultured mammalian cells.

Couple this heat source to temperature-dependent growth, death, and productivity kinetics. A temperature shift, such as **36.5 to 33 °C**, could then be simulated as both a thermal operation and a change in cellular behavior.

### 3. Physicochemical coupling

Connect temperature to O₂ and CO₂ solubility, the volumetric mass-transfer coefficient ($k_La$), and CO₂/bicarbonate equilibria and pH. Develop a pCO₂ model as part of this layer, and extend the energy balance to include agitation heat input and evaporative cooling into the headspace. These connections would allow temperature and gas-transfer behavior to evolve together.

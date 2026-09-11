---
title: "Controlling temperature in a 2,000 L single-use bioreactor"
description: "An interactive comparison of culture and jacket temperature responses under cascade control, from heating-only operation to heating and cooling, and the metabolic heat load that decides which one a process needs."
organization: "Independent project"
period: "2026–present"
status: "In progress"
tags: ["Temperature control", "Bioreactor modeling", "Process dynamics"]
order: -1
---

Reaching a culture-temperature target is only part of the control problem. As cells grow, their metabolic heat changes how much heating or cooling is needed to hold that target. This project compares heating-only operation with heating and cooling under cascade control, following the culture and jacket temperatures to identify when turning down the heater is sufficient and when an additional heat-removal path is needed.

The simulation builds on the [thermal model of a simplified Cytiva XDR-2000 L single-use bioreactor](/projects/xdr2000-heat-transfer/). A cell-free explorer introduces controller tuning; published CHO fed-batch and perfusion cell-density profiles then load the same model at a constant temperature target. One number connects the cases: the heat the vessel loses to the room while holding its setpoint. A culture that produces less than that can be held by turning the heater down. A culture that produces more needs cooling.

## Two temperature measurements, two control loops

Both control modes use the same cascade structure. The outer controller compares culture temperature with its setpoint and sets a target for the jacket temperature. The faster inner controller compares jacket temperature with that target and commands a temperature-control unit (TCU). Water recirculates between the TCU and the jacket, and the modeled jacket temperature represents the mixed water there: its response reflects circulation and heat exchange with the vessel, while the culture responds as heat passes through the wall and bag. In heating-only operation the TCU can only add heat, and the minimum heater power is zero. Heating and cooling adds the ability to remove heat from the circulating water. The figures label the two modes "Heating only" and "Heating + cooling".

<figure class="xdr-figure">
  <a href="/xdr2000/bioreactor_thermal_system_3d.png?v=f5eb7f4bffe3" target="_blank" rel="noopener noreferrer" aria-label="Open the reactor and cascade-control rendering at full size">
    <img src="/xdr2000/bioreactor_thermal_system_3d.png?v=f5eb7f4bffe3" alt="Cutaway single-use bioreactor with water jacket, straight supply and return pipes, a heating and cooling unit, and outer culture and inner jacket cascade controllers." width="3120" height="2520" loading="eager" decoding="async" />
  </a>
  <figcaption>The outer loop responds to culture temperature; the inner loop responds to jacket temperature. Dashed lines represent measurement feedback. This rendering shows a 1,000 L fill, with wall and bag layers enlarged for visibility. The TCU housing, 50 L water inventory, piping, and sensor positions are schematic model assumptions.</figcaption>
</figure>

<figure class="xdr-figure">
  <a href="/xdr2000/control_architecture.png?v=c790b73fc081" target="_blank" rel="noopener noreferrer" aria-label="Open the cascade temperature-control diagram at full size">
    <img src="/xdr2000/control_architecture.png?v=c790b73fc081" alt="Cascade temperature-control diagram connecting the culture temperature setpoint, outer culture controller, jacket target, inner jacket controller, heating and cooling unit, circulating jacket water, and reactor, with culture and jacket measurement feedback and metabolic heat entering the culture." width="2160" height="2300" loading="lazy" decoding="async" />
  </a>
  <figcaption>Signal path from the culture setpoint to the TCU. The jacket target is clipped to the permitted range before the inner loop acts on it. The pump circulates water in both modes; with the heater off, heating-only operation can only lose heat to the room. The biological examples add metabolic heat to the culture without changing the control structure.</figcaption>
</figure>

### Operating conditions and equipment limits

Every result on this page shares the settings below. The outer-loop reference tuning is set for each volume; the inner jacket controller keeps one fixed, fast tuning throughout.

<dl class="xdr-conditions" aria-label="Shared model settings and equipment limits">
  <div><dt>Culture volume</dt><dd>2,000 L · explorer also offers 400 and 1,000 L</dd></div>
  <div><dt>Heating and cooling capacity</dt><dd>20 kW each</dd></div>
  <div><dt>Jacket target range</dt><dd>10–40 °C</dd></div>
  <div><dt>Jacket water flow</dt><dd>50 L/min</dd></div>
  <div><dt>Room temperature</dt><dd>20 °C</dd></div>
  <div><dt>Controller sample time</dt><dd>5 s</dd></div>
  <div><dt>Outer-loop reference tuning at 2,000 L</dt><dd>P = 5.3 · T<sub>i</sub> = 132 min</dd></div>
  <div><dt>Hold band</dt><dd>±0.2 °C around the setpoint</dd></div>
</dl>

Holding cell-free medium at 36.5 °C in this model takes about **0.75 kW** of heating at 2,000 L. That is the heat the vessel loses to the 20 °C room through the jacket and exposed wall, and it is the threshold that separates the two case studies below.

## Explore the temperature response

Adjust the proportional gain (P) and integral time (T<sub>i</sub>) of the outer culture controller. Higher P produces a larger jacket-target adjustment for the same temperature error; shorter T<sub>i</sub> strengthens the correction for persistent error. Each slider position is a multiple of the reference tuning for the selected volume, from 0.25× to 3×. The inner jacket controller stays at its reference tuning.

This cell-free example warms medium from 4 to 36.5 °C, holds, then changes the target to 33 °C at 16 hours over a 36-hour run. Compare heating-only operation, which can cool only by passive heat loss, with heating and cooling at 400, 1,000, and 2,000 L. Watch for overshoot after each target change and for how long the culture stays outside the ±0.2 °C band.

At the reference tuning and 2,000 L, the warm-up is limited by the equipment rather than the controller: the heater runs at its 20 kW limit and the supply water at its 40 °C cap for most of the climb, and the culture settles within the band about 7 hours after the start. The two modes are identical until the target drops. Heating and cooling then brings the culture within ±0.2 °C of 33 °C in about 3 hours, while heating-only operation takes about 15 hours because the vessel can only lose heat to the room. The biological comparison below holds a constant target throughout.

<figure class="xdr-explorer">
  <iframe src="/thermal-control/index.html" title="Interactive controller tuning: compare culture and jacket temperature responses while adjusting proportional gain and integral time" width="800" height="1400" loading="lazy" data-content-height></iframe>
  <figcaption><a href="/thermal-control/index.html" target="_blank" rel="noopener noreferrer">Open the temperature-response explorer in a full window ↗</a></figcaption>
</figure>

## Metabolic heat: fed-batch and perfusion

As viable cell density increases, metabolic heat can turn a heating requirement into a cooling requirement. Two published CHO profiles provide different loads for the same 2,000 L thermal model:

- Fed-batch: NISTCHO clone 31 with standard feeding, from Figure 1B and Supplemental File 4 of [Dahodwala and colleagues (2025)](https://doi.org/10.1002/biot.70012). The study reports numerical VCD means and standard deviations from spin-tube cultures, so the density history comes from a much smaller scale than the vessel modeled here. The inoculum is set at 0.3 million cells/mL; the mean peak is near 17.9 million cells/mL on day 9, declining to 11.4 million cells/mL at day 17.
- Perfusion: BRX#A from Figure 1b of [Zhang and colleagues (2024)](https://doi.org/10.1002/bit.28674). The Merck study used a 1.8 L working volume at 36.5 °C. VCD points digitized from the figure rise from an assumed 0.5 million cells/mL inoculum to 102 million cells/mL, then fluctuate and decline to about 50 million cells/mL at day 28.

Straight-line interpolation preserves each profile's timing, peaks, and decline. Both cases use a constant 36.5 °C setpoint, the reference tuning, and the equipment limits above. The cultures are different cell lines and processes; their VCD histories provide two thermal-load scenarios rather than a controlled biological comparison.

Both profiles use an assumed 20 pW of metabolic heat per viable cell, informed by direct CHO320 calorimetry reported by [Guan and Kemp (1999)](https://doi.org/10.1023/A:1008038515285). This is a shared modeling assumption, not a measured rate for either culture. At 2,000 L it gives a peak metabolic heat of about 0.72 kW for fed-batch and 4.08 kW for perfusion. Against the 0.75 kW passive loss, the two loads fall on opposite sides of the line: at 20 pW per cell and 2,000 L, the vessel sheds the heat of about 19 million cells/mL on its own. The fed-batch peak sits just below that density; the perfusion culture passes it around day 6.

Volume remains fixed at 2,000 L. Volume changes from feeding, sampling, or bleeding, and heat exchange with feed and harvest streams, are excluded so that the changing metabolic heat is the only disturbance. The examples replay the published density histories without reproducing the complete fed-batch or perfusion process.

<figure class="xdr-figure">
  <a href="/xdr2000/cho_profile_comparison_20pw.png" target="_blank" rel="noopener noreferrer" aria-label="Open the fed-batch and perfusion cell density and metabolic heat comparison at full size">
    <img src="/xdr2000/cho_profile_comparison_20pw.png" alt="Top: published NISTCHO fed-batch viable cell density peaks near 18 million cells/mL over 17 days, while digitized Merck perfusion viable cell density peaks near 102 million cells/mL over 28 days. Bottom: the corresponding metabolic heat at 20 pW per cell and 2,000 L peaks near 0.7 kW for fed-batch and 4 kW for perfusion." width="1944" height="1116" loading="lazy" decoding="async" />
  </a>
  <figcaption>Viable cell density (top) and the resulting metabolic heat at 20 pW per viable cell and 2,000 L (bottom). Fed-batch shows published NISTCHO means with one-standard-deviation error bars where available; perfusion shows approximate BRX#A readings from the published figure. Lines interpolate between source observations; each profile ends at its last observation.</figcaption>
</figure>

## Fed-batch: the heater backs off as the cells grow

At 20 pW per cell, both control modes hold 36.5 °C throughout the 17-day fed-batch profile; the deviation is a few hundredths of a degree and is not visible at the scale of the ±0.2 °C band. The response shows in the jacket. As metabolic heat rises toward its 0.72 kW peak, the heater backs off and the jacket water settles about 0.6 °C below the culture, so heat flows from the culture through the wall to the jacket and on to the room. With the load within a few percent of the 0.75 kW passive loss, the heater contributes almost nothing at peak density. The two responses overlap because cooling is never called.

<figure class="xdr-figure">
  <a href="/xdr2000/nistcho_fedbatch_temperature_20pw.png" target="_blank" rel="noopener noreferrer" aria-label="Open the constant-temperature fed-batch comparison at full size">
    <img src="/xdr2000/nistcho_fedbatch_temperature_20pw.png" alt="Overlapping culture and jacket temperature responses for heating-only and heating/cooling during a 17-day NISTCHO fed-batch thermal scenario at a constant 36.5 degree setpoint, 2000 L, and 20 pW per viable cell." width="1944" height="1116" loading="lazy" decoding="async" />
  </a>
  <figcaption>Fed-batch at a constant 36.5 °C target, with 20 pW per viable cell and a fixed 2,000 L volume. The two control modes overlap because this case never calls for cooling. The shaded band marks ±0.2 °C around the setpoint; the jacket panel shows the heater backing off as metabolic heat rises and recovering as the culture declines.</figcaption>
</figure>

The margin is thin. This case stays heating-only because its peak load happens to fall just below the modeled passive loss. A modestly higher per-cell heat rate, a warmer room, or a higher peak density would cross the line. The result shows that heating-only operation is sufficient for this particular load, not for fed-batch in general.

## Perfusion: cooling is required

The perfusion case holds a 36.5 °C setpoint for its 28-day observation window. The same 20 pW per cell produces a much larger load because there are many more cells: metabolic heat passes the 0.75 kW passive loss around day 6, near 19 million cells/mL, and peaks above 4 kW. Once the load exceeds what the vessel loses to the room, turning off the heater cannot hold the culture. In heating-only operation the culture leaves the setpoint shortly after day 6 and reaches the 40 °C simulation stop on day 7.7; the run ends there because the source VCD history, measured at 36.5 °C, says nothing about cells that have overheated. With cooling available, the culture stays within the band for the full 28 days while the jacket water falls to about 33 °C to carry the peak load away.

<figure class="xdr-figure">
  <a href="/xdr2000/zhang2024_perfusion_temperature_20pw.png" target="_blank" rel="noopener noreferrer" aria-label="Open the perfusion culture and jacket temperature comparison at full size">
    <img src="/xdr2000/zhang2024_perfusion_temperature_20pw.png" alt="Heating and cooling holds the modeled perfusion culture near 36.5 degrees Celsius as jacket temperature falls toward 33 degrees. Heating-only reaches the 40 degree simulation stop around day 7.7." width="1944" height="1116" loading="lazy" decoding="async" />
  </a>
  <figcaption>Perfusion at a constant 36.5 °C target, with 20 pW per viable cell and a fixed 2,000 L volume. The shaded band marks ±0.2 °C. Heating-only ends at the configured 40 °C culture stop. The source VCD history comes from a culture maintained at 36.5 °C; it does not predict cell survival after simulated overheating.</figcaption>
</figure>

## What decides it: passive heat loss and scale

For a given vessel, room, and setpoint, the passive heat loss is fixed, about 0.75 kW here. Whether a process needs cooling depends on whether its metabolic heat exceeds that value, which comes down to viable cell density, per-cell heat rate, and the volume that shares the loss. Within this vessel the loss barely changes with fill (0.80 kW at 400 L, 0.75 kW at 2,000 L), so the threshold density is set mainly by how many liters share it: about 19 million cells/mL at 2,000 L against roughly 100 million cells/mL at 400 L.

Across scales the effect is stronger. For geometrically similar reactors, heat-transfer area grows with the square of the linear dimension while volume grows with the cube, so a tenfold increase in volume leaves each liter with about $10^{1/3} \approx 2.2$ times less area. A process that holds temperature by turning down the heater at 200 L can therefore need installed cooling at 2,000 L, both to hold the setpoint at peak density and to carry out downward temperature shifts within a useful time.

## Next steps

- Estimate metabolic heat from oxygen uptake rate instead of a fixed 20 pW per cell, following the biological-coupling plan in the [thermal-model article](/projects/xdr2000-heat-transfer/#future-directions).
- Apply the 36.5 to 33 °C shift from the explorer during the fed-batch profile, where heating-only operation has no way to cool 2,000 L on demand.
- Tune heating-only and heating-and-cooling operation separately, and replace the schematic loop with measured TCU behavior and sensor response.
- Extend the comparison to other reactor scales with their own geometry, heat-transfer parameters, and utility limits, to test the area-per-volume argument directly.

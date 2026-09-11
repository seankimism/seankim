---
title: "Controlling temperature in a 2,000 L single-use bioreactor"
description: "An interactive comparison of culture and jacket temperature responses under cascade control, from heating-only operation to active heating and cooling."
organization: "Independent project"
period: "2026–present"
status: "In progress"
tags: ["Temperature control", "Bioreactor modeling", "Process dynamics"]
order: -1
featured: false
---

Reaching a culture-temperature target is only part of the control problem. As cells grow, their metabolic heat changes how much heating or cooling is needed to maintain that target. This project compares heating-only with heating-and-cooling cascade control, following the culture and jacket temperatures to identify when turning down the heater is sufficient and when an additional heat-removal path is needed.

The simulation builds on the [thermal model of a simplified Cytiva XDR-2000 L single-use bioreactor](/projects/xdr2000-heat-transfer/). A cell-free explorer introduces controller tuning, followed by published CHO fed-batch and perfusion cell-density profiles at a constant temperature target. The objective is to test the capabilities of the controllers under different thermal loads.

## Two temperature measurements, two control loops

The outer controller compares culture temperature with its setpoint and adjusts the jacket-temperature target. The faster inner controller uses jacket temperature to adjust a temperature-control unit (TCU). Water recirculates between the TCU and jacket, where incoming water mixes with the water already present.

<figure class="xdr-figure">
  <a href="/xdr2000/bioreactor_thermal_system_3d.png?v=f5eb7f4bffe3" target="_blank" rel="noopener noreferrer" aria-label="Open the reactor and cascade-control rendering at full size">
    <img src="/xdr2000/bioreactor_thermal_system_3d.png?v=f5eb7f4bffe3" alt="Cutaway single-use bioreactor with water jacket, straight supply and return pipes, a heating and cooling unit, and outer culture and inner jacket cascade controllers." width="3120" height="2520" loading="eager" decoding="async" />
  </a>
  <figcaption>The outer loop responds to culture temperature; the inner loop responds to jacket temperature. Dashed lines represent measurement feedback. This rendering shows a 1,000 L fill, with wall and bag layers enlarged for visibility. The TCU housing, 50 L water inventory, piping, and sensor positions are schematic model assumptions.</figcaption>
</figure>

### The control loop

Both control modes use the same cascade structure. The outer controller adjusts the jacket-temperature target from the measured culture temperature; the inner controller adjusts the TCU from the measured jacket temperature. In heating-only operation, the minimum heater power is zero. Heating and cooling adds the ability to remove heat from the circulating water.

<figure class="xdr-figure">
  <a href="/xdr2000/control_architecture.png?v=c790b73fc081" target="_blank" rel="noopener noreferrer" aria-label="Open the cascade temperature-control diagram at full size">
    <img src="/xdr2000/control_architecture.png?v=c790b73fc081" alt="Cascade temperature-control diagram connecting the culture temperature setpoint, outer culture controller, jacket target, inner jacket controller, heating and cooling unit, circulating jacket water, and reactor, with culture and jacket measurement feedback and metabolic heat entering the culture." width="2160" height="2300" loading="lazy" decoding="async" />
  </a>
  <figcaption>The outer loop responds to the culture; the inner loop responds to the jacket. The pump continues circulating water in both modes. When the heater is off, heating-only relies on passive heat loss to the room. The biological examples add metabolic heat to the culture while keeping the same control structure.</figcaption>
</figure>

Following both temperatures shows how controller action reaches the culture. Jacket temperature represents the mixed water in the jacket. Its response reflects circulation and heat exchange with the vessel; the culture responds as heat passes through the wall and bag.

## Explore the temperature response

Adjust proportional gain (P) and integral time for the outer culture controller. Higher P produces a larger adjustment for the same temperature error. Shorter integral time strengthens the correction for persistent error. The inner jacket controller stays at its reference tuning.

This separate cell-free tuning example warms medium from 4 to 36.5 °C, then changes the target to 33 °C at 16 hours. Compare heating-only operation, which relies on passive heat loss to cool, with active heating and cooling at 400, 1,000, and 2,000 L. Both modes use the same selected tuning and operating conditions. The biological comparison below uses a constant target throughout.

<figure class="xdr-explorer">
  <iframe src="/thermal-control/index.html" title="Interactive controller tuning: compare culture and jacket temperature responses while adjusting proportional gain and integral time" width="800" height="1400" loading="lazy" data-content-height></iframe>
  <figcaption><a href="/thermal-control/index.html" target="_blank" rel="noopener noreferrer">Open the temperature-response explorer in a full window ↗</a></figcaption>
</figure>

## Metabolic heat: fed-batch and perfusion

As viable cell density increases, metabolic heat can turn a heating requirement into a cooling requirement. Two published CHO profiles provide different loads for the same 2,000 L thermal model:

- Fed-batch: NISTCHO clone 31 with standard feeding, from Figure 1B and Supplemental File 4 of [Dahodwala and colleagues (2025)](https://doi.org/10.1002/biot.70012). The spin-tube study provides numerical VCD means and standard deviations. The nominal inoculum is 0.3 million cells/mL, with a mean peak near 17.9 million cells/mL on day 9 and a decline toward 11.4 million cells/mL at day 17.
- Perfusion: BRX#A from Figure 1b of [Zhang and colleagues (2024)](https://doi.org/10.1002/bit.28674). The Merck study used a 1.8 L working volume at 36.5 °C. Approximate digitized VCD points rise from a nominal 0.5 million cells/mL to 102 million cells/mL, then fluctuate and decline to about 50 million cells/mL at day 28.

Straight-line interpolation preserves each profile's timing, peaks, and decline. Both cases use a constant 36.5 °C setpoint, the same reference tuning, and the same equipment limits. The cultures are different cell lines and processes; their VCD histories provide two thermal-load scenarios rather than a controlled biological comparison.

Both profiles use an assumed 20 pW of metabolic heat per viable cell, informed by direct CHO320 calorimetry reported by [Guan and Kemp (1999)](https://doi.org/10.1023/A:1008038515285). This is a shared modeling assumption, not a measured rate for either selected culture. At 2,000 L, peak metabolic heat is approximately 0.72 kW for fed-batch and 4.08 kW for perfusion.

Volume remains fixed at 2,000 L throughout both applications. Volume changes from feeding, sampling, or bleeding are excluded because the objective is to test the capabilities of the controllers under changing metabolic heat loads. Feed and harvest heat exchange are also excluded. The examples replay the published density histories without reproducing the complete fed-batch or perfusion process.

<figure class="xdr-figure">
  <a href="/xdr2000/cho_vcd_comparison.png" target="_blank" rel="noopener noreferrer" aria-label="Open the fed-batch and perfusion viable cell density comparison at full size">
    <img src="/xdr2000/cho_vcd_comparison.png" alt="Published NISTCHO fed-batch viable cell density peaks near 18 million cells/mL over 17 days; digitized Merck perfusion viable cell density peaks near 102 million cells/mL over 28 days." width="1944" height="720" loading="lazy" decoding="async" />
  </a>
  <figcaption>Published NISTCHO fed-batch VCD means with one-standard-deviation error bars where available, compared with approximate BRX#A perfusion VCD readings from the published figure. Lines interpolate between source observations; each profile ends at its last observation.</figcaption>
</figure>

## Fed-batch: reducing heating as the cells grow

At the selected 20 pW/cell rate, both controllers maintain 36.5 °C within ±0.2 °C throughout the 17-day fed-batch profile. As metabolic heat increases, the heater supplies less energy. The modeled passive heat loss to the room is sufficient to release the cells' heat without activating cooling, so the two temperature responses overlap.

<figure class="xdr-figure">
  <a href="/xdr2000/nistcho_fedbatch_temperature_20pw.png" target="_blank" rel="noopener noreferrer" aria-label="Open the constant-temperature fed-batch comparison at full size">
    <img src="/xdr2000/nistcho_fedbatch_temperature_20pw.png" alt="Overlapping culture and jacket temperature responses for heating-only and heating/cooling during a 17-day NISTCHO fed-batch thermal scenario at a constant 36.5 degree setpoint, 2000 L, and 20 pW per viable cell." width="1944" height="1116" loading="lazy" decoding="async" />
  </a>
  <figcaption>Fed-batch at a constant 36.5 °C target, with 20 pW per viable cell and a fixed 2,000 L volume. The two controller responses overlap because this case does not call for active cooling. The shaded culture-temperature band marks ±0.2 °C around the setpoint. Volume changes and feed heat exchange are excluded to focus on controller capability.</figcaption>
</figure>

This result depends on the assumed per-cell heat rate and passive heat losses. It demonstrates that heating-only is sufficient for this particular modeled load, rather than establishing that every fed-batch process can operate without cooling.

## Perfusion: adding cooling capacity

The perfusion case holds a 36.5 °C setpoint for its 28-day observation window. The same 20 pW/cell rate produces a much larger total heat load because there are more viable cells. Once that load exceeds passive heat loss to the room, turning off the heater cannot hold the culture temperature: an additional heat-removal path is needed.

<figure class="xdr-figure">
  <a href="/xdr2000/zhang2024_perfusion_temperature_20pw.png" target="_blank" rel="noopener noreferrer" aria-label="Open the perfusion culture and jacket temperature comparison at full size">
    <img src="/xdr2000/zhang2024_perfusion_temperature_20pw.png" alt="Heating and cooling holds the modeled perfusion culture near 36.5 degrees Celsius as jacket temperature falls toward 33 degrees. Heating-only reaches the 40 degree simulation stop around day 7.7." width="1944" height="1116" loading="lazy" decoding="async" />
  </a>
  <figcaption>Perfusion at a constant 36.5 °C target, with 20 pW per viable cell and a fixed 2,000 L volume. The shaded band marks ±0.2 °C. Heating-only ends at the configured 40 °C culture stop. The source VCD history comes from a culture maintained at 36.5 °C; it does not predict cell survival after simulated overheating.</figcaption>
</figure>

In this perfusion example, active cooling is required to maintain the temperature setpoint. Larger reactors need installed cooling capacity when metabolic heat exceeds passive heat loss.

Cooling should also be considered for fed-batch at larger scales, both to carry out downward temperature shifts and to maintain the setpoint as cells generate heat. For geometrically similar reactors, increasing volume reduces the heat-transfer surface area per unit of culture volume, leaving less area available to remove heat from each liter of culture.

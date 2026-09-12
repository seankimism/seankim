# Bench thermal simulation viewer

Open index.html directly, or copy this entire bench-heating folder into your website's public directory.
The page contains its own scripts and precomputed display histories and works offline.

Choose the vessel and scenario; drag the 3D cutaway, play, or scrub time.
Coral outlines identify the heating blanket or holder block; surface colors show temperature.

- Applikon 3 L glass vessel: 2 L medium, 4 C initial medium, 80 C assumed element ceiling.
- ambr 250 vessel: 0.2 L medium, 20 C initial medium, 60 C assumed element ceiling.

- Applikon 3 L glass vessel, Fed-batch with cells, 4 °C feed boluses: 14 days, 2 to 2.36 L, 36.5 C setpoint, 20 pW/cell.
- Applikon 3 L glass vessel, Fed-batch with cells, 20 °C feed boluses: 14 days, 2 to 2.36 L, 36.5 C setpoint, 20 pW/cell.
- Applikon 3 L glass vessel, Perfusion with cells: 28 days, 2 to 2 L, 36.5 C setpoint, 20 pW/cell.
- ambr 250 vessel, Fed-batch with cells, 4 °C feed boluses: 14 days, 0.18 to 0.2124 L, 36.5 C setpoint, 20 pW/cell.
- ambr 250 vessel, Fed-batch with cells, 20 °C feed boluses: 14 days, 0.18 to 0.2124 L, 36.5 C setpoint, 20 pW/cell.
- ambr 250 vessel, Perfusion with cells: 28 days, 0.2 to 0.2 L, 36.5 C setpoint, 20 pW/cell.

Culture scenarios start at controlled equilibrium. The two fed-batch scenarios add cell-free boluses of 3 % of the starting volume every other day from day 2 to day 12 (14 days), at 4 C or 20 C feed temperature; the volume, liquid level, and cumulative feed step at each bolus and the culture temperature dips and recovers.
Fed-batch uses the NISTCHO density history with the cell inventory fixed at the starting volume, so boluses dilute the displayed density; perfusion uses the Zhang BRX#A density history at constant volume with stream enthalpy excluded.
Display frames follow a 15-minute grid plus every saved frame for one hour after each bolus.
Biology is imposed: no nutrient, viability, oxygen-transfer or temperature-feedback prediction. External retention-loop heat exchange is excluded.

Figures are schematic model geometry, not manufacturer CAD. Temperatures are illustrative calculations, not equipment measurements.

Embed using an iframe pointed at bench-heating/index.html, with a descriptive title and sufficient height or scrolling for the culture charts.
The optional PNG/SVG files show the controlled warm-up and each included culture scenario. The manifest lists asset checksums.

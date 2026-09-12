# Bench thermal simulation viewer

Open index.html directly, or copy this entire bench-heating folder into your website's public directory.
The page contains its own scripts and precomputed display histories and works offline.

Choose the vessel and scenario; drag the 3D cutaway, play, or scrub time.
Coral outlines identify the heating blanket or holder block; surface colors show temperature.

- Applikon 3 L glass vessel: 2 L medium, 4 C initial medium, 80 C assumed element ceiling.
- ambr 250 vessel: 0.2 L medium, 20 C initial medium, 60 C assumed element ceiling.

- Applikon 3 L glass vessel, Fed-batch with cells: 17 days, 2 to 2 L, 36.5 C setpoint, 20 pW/cell.
- Applikon 3 L glass vessel, Perfusion with cells: 28 days, 2 to 2 L, 36.5 C setpoint, 20 pW/cell.
- ambr 250 vessel, Fed-batch with cells: 17 days, 0.2 to 0.2 L, 36.5 C setpoint, 20 pW/cell.
- ambr 250 vessel, Perfusion with cells: 28 days, 0.2 to 0.2 L, 36.5 C setpoint, 20 pW/cell.

Culture scenarios start at controlled equilibrium. The default fed-batch and perfusion replays keep the selected volume fixed (2 L and 200 mL in the shipped cases), matching the 2000 L comparison.
Fed-batch uses the NISTCHO density history without dilution; perfusion uses the Zhang BRX#A density history. Both defaults exclude feed-related volume changes and stream enthalpy.
Explicit bolus additions or balanced flow may be supplied through custom process configurations; their displayed histories include those terms.
Biology is imposed: no nutrient, viability, oxygen-transfer or temperature-feedback prediction. External retention-loop heat exchange is excluded.

Figures are schematic model geometry, not manufacturer CAD. Temperatures are illustrative calculations, not equipment measurements.

Embed using an iframe pointed at bench-heating/index.html, with a descriptive title and sufficient height or scrolling for the culture charts.
The optional PNG/SVG files show the controlled warm-up and each included culture scenario. The manifest lists asset checksums.

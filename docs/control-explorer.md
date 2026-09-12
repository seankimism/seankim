# Temperature-controller explorer

`public/thermal-control/` is a results viewer embedded in the combined thermal-model
and temperature-control article at `/projects/bioreactor-temperature-control/`.
The article also retains the model foundation, calibration discussion, and
warm-up explorer from the former heat-transfer project. Its old URL,
`/projects/xdr2000-heat-transfer/`, redirects to the combined article's
`#how-heat-moves-through-the-vessel` section. The redirect uses the configured
deployment base, includes a fallback link, and does not create another project
listing because it is a static route rather than a content entry.
The viewer contains no thermal solver or controller implementation. All
trajectories are computed in the separate modeling repository and exported
through an explicit allowlist of response fields.

Visitors adjust the outer culture controller. The proportional gain and integral
time each have seven available values relative to the fill-specific reference:
0.25, 0.5, 0.75, 1, 1.5, 2, and 3 times the reference value. Integral time is
shown in minutes: smaller values give stronger integral action. The inner jacket
controller retains its reference tuning. The available fill volumes are 400,
1,000, and 2,000 L. Each of the 147 gain/volume combinations contains both the
heating-only and heating/cooling response, for 294 separate simulations.

The shared protocol warms 4 °C medium toward 36.5 °C and changes the target to
33 °C at 16 h. The observation window is 36 h. Culture and jacket temperature
histories are displayed at 60 s intervals, alongside a culture-error plot whose
vertical axis fits both complete responses in the selected time window. Both
control modes are always shown. The interface has no mode selector, time cursor,
performance cards, bottom selection caption, or simulation footer. The current
selection remains visible above the plots. Tuning changes load independently calculated results;
responses are not interpolated between different tuning settings.

The temperature-shift view spans 15–36 h, including one hour before the setpoint
changes at 16 h so visitors can see the preceding hold and the transition.

The article also compares source-derived CHO fed-batch and perfusion loads
through three static results-only exports:

- `public/xdr2000/cho_profile_comparison_20pw.png`: published NISTCHO clone-31
  standard-feed means (Dahodwala 2025, Figure 1B, DOI 10.1002/biot.70012) and
  digitized BRX#A perfusion VCD (Zhang 2024, Figure 1b, DOI 10.1002/bit.28674).
  The upper panel shows VCD in million cells/mL; fed-batch error bars retain
  published standard deviations where available. The lower panel shows the
  corresponding metabolic heat at 20 pW per viable cell and a fixed 2,000 L
  culture volume.
- `public/xdr2000/nistcho_fedbatch_temperature_20pw.png`: the 17-day fed-batch
  controller comparison at a constant 36.5 C. The two responses overlap because
  neither case calls for active cooling at the selected heat rate.
- `public/xdr2000/zhang2024_perfusion_temperature_20pw.png`: the 28-day perfusion
  temperature comparison at the same constant target and per-cell heat rate.
  Heating-only ends at its configured 40 C culture stop; active cooling removes
  heat from the circulating water to hold the target.

The biological application has no temperature shift. A fixed 2,000 L volume is
intentional: the objective is to test controller capabilities under different
metabolic heat loads. Changes from feeding, sampling, and bleeding are not
modeled, and feed/harvest heat exchange is excluded. These are imposed density
histories, not complete fed-batch or perfusion process simulations. The shared
20 pW/cell rate is informed by CHO320 calorimetry (Guan and Kemp 1999, DOI
10.1023/A:1008038515285), not measured for these two selected cultures.

The private entrypoints remain `thermal_control.fedbatch` and
`thermal_control.perfusion`. Their defaults select the 20 pW cases, with outputs in
`output/thermal_control/cho_fedbatch_nistcho2025_20pw/constant_temperature/` and
`output/thermal_control/cho_perfusion_zhang2024_20pw/`. Retain historical 29.9 pW
and shifted runs separately. The source profiles retain
their own inocula, peaks, and observation horizons. Their use at 2,000 L remains
a scenario assumption; uncertainty in heat generation and passive losses must
be considered before drawing conclusions about installed cooling capacity.

`public/xdr2000/control_architecture.png` follows the equipment rendering in the
article. It is a presentation export of the private controller-diagram renderer,
showing the outer/inner cascade loops, water circuit, and metabolic heat input.
It contains no solver equations, internal model parameters, or tuning rules.
Its overall title and scope notes are in the article text and caption.

To regenerate that diagram in the private repository:

```powershell
python -m thermal_control.diagram --presentation --config examples/control/xdr2000_zhang2024_perfusion_20pw.json --output-dir output/thermal_control/article_figures
```

Regenerate and inspect figures privately, then copy only PNG results here. Keep
biological equations, run summaries, and configurations in the modeling repository.
The figures contain axis labels, legends, and functional annotations; titles and
scope notes belong in the article headings and captions. These static comparisons
do not change the cell-free protocol in the interactive tuning catalog.

## Result files and privacy boundary

`catalog.json` lists available settings, visible conditions and gains, and
content-addressed result paths under `results/<version>/`. Each pair has hashes
and sizes for both the gzip artifact and its decoded JSON, so integrity checks
also work when a server applies transparent decompression. The loader validates
the complete schema and selected setting before displaying a response.

The public export contains response outputs, gains, operating conditions, and
assessment metrics, not computational equations. The catalog retains power,
thermal-energy outputs, and assessment metrics for consistency checks, although
the interface displays only temperature trajectories. These metrics use the
5 s controller trace, including stage boundaries. Do not copy simulation
source, full run summaries, internal physical inputs, matrices, or notebooks
into this repository. Compression is a transport choice; keeping the
computational model outside the deployed files is what maintains the
results-only boundary. The response data and user-facing gain values themselves
remain downloadable by visitors.

## Updating the catalog

Generate and verify the complete catalog in the modeling repository. Copy only
its `catalog.json` and matching `results/<version>/` directory into
`public/thermal-control/`. Keep versioned files consistent with the manifest.
The frontend assets are maintained here and should not be replaced by a general
model or website export. The controller rendering is a separate PNG asset under
`public/xdr2000/`.

Run:

```powershell
npm.cmd test
$env:SITE_BASE_PATH='/seankim'
npm.cmd run build
```

The production build checks the warm-up, controller, and bench result exports,
including complete setting coverage, result integrity, schema, operating bounds,
and accidental solver exposure. It also verifies the legacy redirect, its
destination section, and the single merged project listing. Relative asset paths
and the existing Markdown base-path handling support both root deployment and
GitHub Pages subpaths such as `/seankim`.

Before publishing, inspect the standalone explorer and its combined project
article on desktop and mobile, and open the old heat-transfer URL to confirm
that it reaches the retained model section. Exercise gain changes, volume selection, reset, the shift
view, and recovery from failed downloads. Check that both modes remain visible
and the error axis contains the complete response in each time window.

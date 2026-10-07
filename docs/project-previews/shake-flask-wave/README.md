# Shake flask and wave bioreactor draft

The project source is `src/content/projects/shake-flask-wave-bioreactor-modeling.md`.
It is marked `draft: true`. The local bioprocess overview discovers it under
“In progress.” Nothing here is a published result package.

The three SVGs are served in development through the explicit allowlist in
`src/pages/project-previews/[asset].svg.ts`. That endpoint produces no production
routes. Preview image URLs end in `.svg/` to follow the site's trailing-slash
policy. Keep draft figures here rather than in `public/` or imported through
Markdown: both of those asset paths can emit files even when a draft page is
excluded from production.

## Figure sources

The renderer is `bioreactor/plots/shake_flask_wave_project.py` in the neighboring
bioprocess-modeling repository. It reads the saved results in
`docs/future-releases/gas-transfer/assets/`, without solving or refitting a model:

- `shake-flask/summary.csv`: unbaffled 250 mL orbit and fill comparisons.
- `wave-bag/summary.csv`: 4 L capacity and uncalibrated power maps.
- `wave-bag/baseline.json` and `high_demand.json`: fixed-demand DO transients.

From the modeling repository, regenerate with:

```powershell
.venv/Scripts/python.exe -m bioreactor.plots.shake_flask_wave_project --archive-root ../seankim/docs/future-releases/gas-transfer/assets --output-dir output/shake_flask_wave_project
```

The renderer writes SVGs, inspection PNGs and a manifest containing input hashes,
selected cases, figure values and runtime versions. The website copies contain
the standard attribution applied with `watermarkSvg` from
`scripts/watermark-model-figures.mjs`. `manifest.json` records the clean renderer
outputs and the watermarked preview checksums separately. The PNGs remain in the
modeling output directory.

## Preview

Run `npm run dev` in the website repository and open
`/projects/shake-flask-wave-bioreactor-modeling/` under the configured base path.
Review the assumptions and correlations before promoting the page or its assets
into the published project collection.

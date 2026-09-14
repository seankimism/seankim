# Modeling figure attribution

`npm run watermark:figures` applies faint, repeated Sean Kim attribution to original modeling PNG and SVG files. It runs before `npm run dev` and `npm run build`, including after fresh figure exports from the modeling repository. Figure data, dimensions, axis labels and legends are retained. Full-size images and PNG downloads contain the mark.

The scope is `public/agitation-thermal/figures`, `public/bench-heating`, `public/fedbatch-feed`, `public/mixing` and `public/xdr2000`. Published-paper illustrations under `cornell`, portraits, logos and video posters are excluded.

Unmarked copies are backed up by their SHA-256 under ignored `output/figure-originals/` before modification. The modeling repository also retains its source figures. `public/figure-watermarks.json` records source and marked checksums, but contains no scientific datasets or original image bytes. Subsequent runs skip matching files, preventing repeated watermark accumulation. Bench and agitation asset checksums are refreshed after the transformation; scientific result files are not modified.

`node scripts/watermark-model-figures.mjs --check` verifies coverage. `node --test scripts/watermark-model-figures.test.mjs` checks scope, dimensions, geometry retention, raster attribution, backups and idempotence.

Interactive XDR, bench and temperature-control viewers load `public/model-figure-watermark.js`. SVG and canvas rendering functions append attribution after each redraw without intercepting pointer events. When replacing viewer HTML from the modeling templates, retain the helper script and render hooks. Template sources are `website/bioreactor_template.html` and `website/bench_template.html` in the modeling repository.

Watermarks provide attribution and deter casual reuse. They do not prevent screenshots, cropping or deliberate removal, and do not change third-party rights in reproduced material.

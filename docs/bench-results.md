# Bench result release

`public/bench-heating/index.html` embeds a schema-v2 catalog and vessel geometry.
`bench-loader.js` fetches one selected scenario from `results/<sha256>.json.gz`
through the shared `public/result-transport.js`. The catalog records compressed
and decoded lengths and SHA-256 hashes, frame counts, and a version hash of the
catalog core. Only precomputed display histories are downloaded. Selection
changes cancel obsolete requests; failed requests leave the last result visible
and offer a retry. Up to four decoded scenarios are cached.

The canonical template and exporter are in the modeling repository:
`website/bench_template.html`, `website/bench/bench-loader.js`, and
`bioreactor/website/bench_export.py`. Generate there with
`python -m bioreactor.website.bench_export`. Replace the owned bench asset tree
with the complete generated `output/bench_website/public/bench-heating/` tree,
and copy its sibling watermark and result-transport helpers to `public/`.
Keep scientific runs outside the public directory. A fresh export must include
its newly generated manifest; copying files without that manifest is incomplete.

The generated ZIP is a separate offline edition: its `index.html` embeds all
histories, uses no network request for scenarios, and has its own manifest.
Extract the ZIP and open that page directly. Do not copy the offline HTML over
the small published viewer.

After a deliberate import, apply figure watermarks explicitly and review the
changed artifacts. Run `node --test scripts/check-bench-results.test.mjs` and
`npm run build`. The bench check reconstructs the original schema-v1 display
data from every gzip payload and checks the scientific display invariants,
checksums, and exact asset inventory. The modeling suite also checks staged
replacement, full-to-subset exports, download integrity, cancellation, retries,
and offline archive contents.

For browser review, switch among all three vessels and four scenarios, scrub
through a feed bolus, rotate the vessel, and check playback at desktop and narrow
widths. Verify that a failed scenario request preserves the previous plot and
that retry succeeds. Open the generated offline ZIP edition with networking
disabled and exercise the same vessel and scenario menus.

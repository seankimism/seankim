# Current development setup

Clone `seankimism/seankim`, install Node.js 24, and run from the repository root:

```powershell
npm ci
npm test
npm run build
npm run preview
```

The build verifies the existing watermarks and result manifests without rewriting
them. After intentionally importing a fresh model export, run
`npm run watermark:figures`, review its changes, then run tests and build.
An unexpected exported file change must be restored or regenerated; do not update
its checksum just to make validation pass.

Use `SITE_BASE_PATH=/seankim` and `SITE_URL=https://seankimism.github.io` to preview
the GitHub Pages deployment paths. Draft content is visible with `npm run dev`
and omitted from production. Project grouping follows frontmatter metadata.

The website builds from tracked source and public assets. Modeling code lives in
the separate `bioprocess-modeling` repository. A push to this website's `main`
deploys after tests and production checks pass; local builds do not publish.

The [September migration notes](new-laptop-setup.md) are historical recovery
instructions, including optional original-figure backups.

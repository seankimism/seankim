# Shake-flask P/V calculator draft

The project source is `src/content/projects/shake-flask-pv-scale-up.md`, marked
`draft: true`. Its calculator, methods and related RCF navigation are preserved
here as a four-page review snapshot. These files are outside `public/` and are
not a published result package.

The allowlisted endpoint `src/pages/project-previews/shake-flask-pv/[asset].html.ts`
serves these pages only in development. It produces no production routes and
rejects requests outside development. The handler rebases both static links and
the calculator's changing construction links, including the site's base path
and the trailing slash after `.html/`.

Run `npm run dev` and open `/projects/shake-flask-pv-scale-up/` under the configured
base path. The bioprocess overview discovers this draft under "In progress."
The currently published RCF project and its two public HTML pages stay separate
from this preview.

## Source and regeneration

The snapshots were preserved from the local `rcf-site-publish-20261004` review
worktree. They match the calculator templates and solvers in the neighboring
`bioprocess-modeling` repository as recorded in `manifest.json`. The manifest
records source and snapshot SHA-256 hashes and byte sizes. The original bundle
links stay in these files; the development handler adjusts links when serving
them.

From the modeling repository, export into a fresh directory:

```powershell
.venv/Scripts/python.exe -m bioreactor.website.incubator_transfer --output output/incubator_transfer_review/index.html
node --test website/tests/incubator_transfer.mjs website/tests/vessel_agitation.mjs
```

After review, replace all four snapshot HTML files and update the manifest from
their bytes and the six named source files. Run the focused website checks:

```powershell
node --test scripts/shake-flask-pv-preview.test.mjs
```

The P/V calculator is a draft empirical estimate with conservative vessel and
flow coverage. Its glass defaults are illustrative; the plastic reference does
not produce a numerical recommendation. Promotion to public content requires
a separate release decision and review of the actual vessels and conditions.

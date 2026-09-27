# September 2026 migration notes

Historical recovery instructions. For the current checkout, use [setup.md](setup.md).


The `laptop-reset-2026-09-25` branch preserves the local website work from the
September 2026 laptop migration, including the gas-transfer project page and
its figures and interactive viewers. The modeling repository has a recovery
branch with the same name at `https://github.com/seankimism/bioprocess-modeling`.

## Clone and install

Install Git and Node.js 24 (validated with 24.16.0; the package requires at
least 22.12.0). Use a short parent directory on Windows, such as `C:\GitHub`:

```powershell
git clone --branch laptop-reset-2026-09-25 https://github.com/seankimism/seankim.git sean-homepage
cd sean-homepage
npm.cmd ci
npm.cmd test
```

Authenticate to GitHub if prompted. Other remote branches are visible with
`git branch -a`. The package lock records the dependency versions.

## Preview and build

```powershell
$env:SITE_BASE_PATH = '/seankim'
$env:SITE_URL = 'https://seankimism.github.io'
npm.cmd run dev
```

To build the production site and verify its result files:

```powershell
npm.cmd run build
node scripts/watermark-model-figures.mjs --check
```

The website builds from the repository's source and `public/` assets. It does
not need the modeling repository or its saved output folders to build.
`node_modules/`, `.astro/`, and `dist/` are generated locally.

## Original figures and deployment

The ignored `output/figure-originals/` folder contains clean images used when
changing the watermark style. Its 135 files are preserved in the external
reset backup. Current builds use the marked public assets and do not require
those originals. Restore the originals before changing watermark style;
extract the backup separately and copy that data folder into this clone.
Keep the clone's `.git` directory.

Pushing this recovery branch does not deploy the website. The Pages workflow
deploys `main`; merging this branch into `main` would publish its content,
including the gas-transfer article whose frontmatter is `draft: false`.

Before migration, an isolated copy passed 64 tests, a production build with
22 pages and all result checks, and checks for 111 watermarked figures. That
validation used copied installed dependencies; a fresh `npm ci` installation
was not exercised.

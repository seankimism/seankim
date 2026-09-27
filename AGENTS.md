# AGENTS.md

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build, then verify the precomputed explorer results in `dist/`
- `npm run preview` - Preview the build
- `npm test` - Run every test file (`scripts/`, `src/utils/`, `.github/scripts/`)

## Requirements
- Node.js >= 22.12.0

## Architecture
- **Content:** `src/content/` - Markdown with YAML frontmatter: `bio.md`, `cv.md`, `publication-notes.md`, and one file per entry in `projects/` and `publications/`. Schemas live in `src/content.config.ts`.
- **Pages:** `src/pages/` - About (`index.astro`), projects, publications, CV, 404, robots.txt
- **Layouts:** `src/layouts/` - `BaseLayout.astro` (shell, theme, analytics), `BaseDetail.astro` (project and publication pages)
- **Components:** `src/components/` - `LeftSidebar`, `Navbar`, `RightMain`, `Footer`, `CVSection`, `Icon`
- **Config:** `src/config/` - `site.ts` (SITE, THEME_CONFIG, ANALYTICS), `pages.ts`, `navigation.ts`, `social.ts`, `themes.ts`; re-exported from `src/config/index.ts`
- **Types:** `src/types.ts` - config and theme types
- **Styles:** `src/styles/global.css` - all classes, theme tokens, base styles
- **Icons:** `src/assets/icons/*.svg`, loaded by name through `src/assets/icons.ts`
- **Static assets:** `public/` - `xdr2000/` and `thermal-control/` (interactive explorers with precomputed results), `cornell/` (project figures), `files/`, `images/`
- **Build checks:** `scripts/check-*.mjs` verify explorer result manifests after each build
- **Shared checks:** `scripts/result-files.mjs` verifies paths, inventories, sizes and checksums. Keep scientific/schema checks in each explorer's checker. `check-project-hierarchy.mjs` reads project frontmatter and validates listings against the same selection policy as the pages; `check-project-redirect.mjs` separately preserves the legacy XDR URL.
- **Client behavior:** `src/utils/result-frames.mjs` owns result-iframe sizing and Astro navigation cleanup; import it directly in tests.
- **Release:** `.github/workflows/deploy.yml` deploys `main` to GitHub Pages; `scheduled-merge.yml` merges a planned pull request on a set date (see `docs/scheduled-release.md`)

## Key Constraints
- **No `<style>` in `.astro` files** - Use global.css classes
- **Two-column layout:** Left sidebar (sticky profile), right main (scrollable content)
- **Markdown-driven:** All content in `.md` files with YAML frontmatter; project pages may use inline HTML for figures and cards
- **Project grouping:** `parentProject` links a study to its overview. About and Projects list the overview when it is visible; study URLs stay available and link back to the overview. If the parent is absent or an unpublished draft, the studies remain listed.
- **Projects on the About page** are selected automatically: the newest visible overview's `publishedDate` per `organization`, excluding drafts in production. The separate Projects listing retains its manual `order`.
- **Drafts:** a project with `draft: true` renders in `npm run dev` but is excluded from production builds, listings, and the sitemap (`src/utils/content.ts`)
- **Theme config:** `THEME_CONFIG` selects the light and dark palettes from `themes.ts`

## Notes
- Tailwind CSS v4 via `@tailwindcss/vite` (no tailwind.config.js); it supplies the reset and theme tokens, utilities are not used in markup
- LaTeX math rendering via remark-math/rehype-katex
- Analytics via Umami (`umami.websiteId`) in `src/config/site.ts`
- Pull requests run tests and a production build. Deployment and scheduled-release candidates also run all tests before building.
- No lint/typecheck scripts configured

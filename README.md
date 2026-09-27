# Sean Kim — Personal Website

A personal website based on [Academic Portfolio Astro](https://github.com/rubzip/academic-portfolio-astro), customized for Byumsu “Sean” Kim. It includes an About page, project case studies, publications, and an online CV. Content is stored in Markdown.

Each project requires a `publishedDate` in its frontmatter, such as
`publishedDate: "2026-09-14"`. Set this when the page is published and retain it
during routine edits. “Selected work” on About automatically shows the
newest non-draft overview for each `organization`, ordered by publication date.
Use an ISO timestamp if two pages published on the same day need a precise
sequence; equal dates otherwise use the project slug as a stable tie-breaker.
The separate Projects listing continues to use `order` for its curated layout.

Set `parentProject: "bioprocess-modeling"` on a study to group it under that
overview. The study keeps its own URL and gains a return link and breadcrumb
to its parent. About and Projects show the overview; the overview links to
the individual studies. A draft or missing parent leaves its studies listed
individually in production. Drafts are visible in the local development preview.

The initial dates follow the existing page history: Ark and Cornell on September
9, 2026; the temperature-control page on September 11; and the completed
agitation page's publication from draft on September 14.


## New laptop setup

See the [new-laptop setup guide](docs/new-laptop-setup.md) for cloning the recovery branch, installing dependencies, and restoring optional original figures.

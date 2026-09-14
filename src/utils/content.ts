/** Drafts are visible in the dev server but excluded from production builds, listings, and the sitemap. */
export const isPublished = (entry: { data: { draft?: boolean } }): boolean => !(import.meta.env.PROD && entry.data.draft);

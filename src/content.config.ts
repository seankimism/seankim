import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(), author: z.string(), year: z.number(), journal: z.string(),
    category: z.enum(["journal", "chapter", "preprint"]),
    status: z.string().optional(), external_url: z.string().url().optional(),
    doi: z.string().optional(), citation: z.string().optional(),
    description: z.string().optional(), featured: z.boolean().default(false),
    order: z.number().default(0), tags: z.array(z.string()).default([]),
    image: z.string().optional(), imageAlt: z.string().optional(),
    imageWidth: z.number().optional(), imageHeight: z.number().optional(),
  }),
});
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(), description: z.string(), organization: z.string(),
    period: z.string(),
    tags: z.array(z.string()).default([]), order: z.number(),
    /** Drafts render in `npm run dev` but are left out of production builds. */
    draft: z.boolean().default(false),
  }),
});
const bio = defineCollection({
  loader: glob({ pattern: "bio.md", base: "./src/content" }),
  schema: z.object({
    name: z.string(), avatar: z.string().optional(), shortBio: z.string(),
    institution: z.string().optional(), role: z.string().optional(), location: z.string().optional(),
    researchAreas: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
});
const cv = defineCollection({
  loader: glob({ pattern: "cv.md", base: "./src/content" }),
  schema: z.object({
    name: z.string(), title: z.string(),
    experience: z.array(z.object({ role: z.string(), institution: z.string(), period: z.string(), description: z.string() })),
    education: z.array(z.object({ degree: z.string(), institution: z.string(), period: z.string(), thesis: z.string().optional(), description: z.string().optional() })),
    sections: z.array(z.object({
      id: z.string(), title: z.string(),
      entries: z.array(z.object({
        title: z.string(), institution: z.string().optional(), period: z.string().optional(),
        description: z.string().optional(), thesis: z.string().optional(),
        links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
      })),
    })),
  }),
});
const publicationNotes = defineCollection({
  loader: glob({ pattern: "publication-notes.md", base: "./src/content" }),
  schema: z.object({ title: z.string() }),
});
export const collections = { publications, projects, bio, cv, publicationNotes };

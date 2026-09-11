// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeBasePath from './src/utils/rehype-base-path.mjs';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const owner = process.env.GITHUB_REPOSITORY_OWNER || 'seankimism';
const base = process.env.SITE_BASE_PATH ?? (repository && !repository.endsWith('.github.io') ? `/${repository}` : '/');

export default defineConfig({
  site: process.env.SITE_URL || `https://${owner}.github.io`,
  base,
  trailingSlash: 'always',
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex, [rehypeBasePath, { base }]] },
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap()],
});

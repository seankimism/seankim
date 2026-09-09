import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL(`${import.meta.env.BASE_URL.replace(/^\//, '').replace(/\/$/, '')}/sitemap-index.xml`.replace(/^\//, ''), site).href}\n`, { headers: { 'Content-Type': 'text/plain' } });

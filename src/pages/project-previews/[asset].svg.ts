import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';

const assets = new Set([
  'shake_flask_orbit_fill',
  'wave_capacity_power',
  'wave_oxygen_demand',
]);
const directory = new URL('../../../docs/project-previews/shake-flask-wave/', import.meta.url);

// With the site's trailingSlash: 'always', preview links must end in '.svg/'.
export const getStaticPaths: GetStaticPaths = () => import.meta.env.DEV
  ? [...assets].map(asset => ({ params: { asset } }))
  : [];

export const GET: APIRoute = async ({ params }) => {
  if (import.meta.env.PROD || !assets.has(params.asset ?? '')) {
    return new Response(null, { status: 404 });
  }
  const svg = await readFile(new URL(`${params.asset}.svg`, directory), 'utf8');
  return new Response(svg, { headers: {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  } });
};

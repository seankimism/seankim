import { readFile } from 'node:fs/promises';

const directory = new URL('../../docs/project-previews/shake-flask-pv/', import.meta.url);
const assets = Object.freeze(['index', 'methodology', 'vessel-agitation', 'agitation-methodology']);
const bundleLink = /(["'])(index|methodology|vessel-agitation|agitation-methodology)\.html(?=[#"'])/g;

export function previewPaths(development) {
  return development === true ? assets.map(asset => ({ params: { asset } })) : [];
}

export async function servePreview({ development, asset, base = '/' }) {
  if (development !== true || !assets.includes(asset)) {
    return new Response(null, { status: 404 });
  }
  const prefix = base.replace(/\/+$/, '');
  const source = await readFile(new URL(`${asset}.html`, directory), 'utf8');
  // Rebase quoted HTML hrefs and JS literals used by the construction selector.
  // The slash is required by the site's trailingSlash: 'always' setting.
  const html = source.replace(bundleLink, (_, quote, name) =>
    `${quote}${prefix}/project-previews/shake-flask-pv/${name}.html/`);
  return new Response(html, { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow',
  } });
}

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {basePrefix, tags, hasLink} from './project-html.mjs';

const articlePath = '/projects/bioreactor-temperature-control/';
const previousPath = '/projects/xdr2000-heat-transfer/';
const anchor = 'how-heat-moves-through-the-vessel';

export function validateProjectRedirect({redirectHtml, articleHtml, listingHtml, homeHtml}, base = '/') {
  const prefix = basePrefix(base);
  const destination = `${prefix}${articlePath}`;
  const target = `${destination}#${anchor}`;
  const refresh = tags(redirectHtml, 'meta').filter(tag => tag['http-equiv']?.toLowerCase() === 'refresh');
  assert.equal(refresh.length, 1, 'Expected one static refresh');
  assert.equal(refresh[0].content, `0;url=${target}`, 'Legacy redirect has the wrong destination or deployment base');
  assert.ok(tags(redirectHtml, 'a').some(tag => tag.href === target), 'Missing fallback link to the merged section');
  const canonical = tags(redirectHtml, 'link').find(tag => tag.rel === 'canonical');
  assert.ok(canonical, 'Missing canonical link');
  const canonicalUrl = new URL(canonical.href);
  assert.equal(canonicalUrl.pathname, destination);
  assert.equal(canonicalUrl.hash, '');
  assert.ok(articleHtml, 'Missing retained temperature-control study');
  assert.ok([...articleHtml.matchAll(/\bid\s*=\s*(["'])(.*?)\1/g)].some(match => match[2] === anchor), 'Merged article is missing the redirect anchor');
  for (const [label, html] of Object.entries({listingHtml, homeHtml})) {
    assert.ok(!hasLink(html, `${prefix}${previousPath}`), `The legacy project still appears in ${label}`);
  }
  return target;
}

export function checkProjectRedirect(directory = 'dist', base = '/') {
  const root = path.resolve(directory);
  const read = route => readFileSync(path.join(root, route, 'index.html'), 'utf8');
  return validateProjectRedirect({
    redirectHtml: read('projects/xdr2000-heat-transfer'),
    articleHtml: read(articlePath.slice(1)),
    listingHtml: read('projects'),
    homeHtml: read(''),
  }, base);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const base = process.argv[3] ?? process.env.SITE_BASE_PATH ?? (repository && !repository.endsWith('.github.io') ? `/${repository}` : '/');
  console.log(`PASS: legacy project redirects to ${checkProjectRedirect(process.argv[2], base)} with its anchor, canonical URL and fallback link preserved.`);
}

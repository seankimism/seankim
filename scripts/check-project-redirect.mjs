import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const articlePath = '/projects/bioreactor-temperature-control/';
const overviewPath = '/projects/bioprocess-modeling/';
const studyPaths = [articlePath, '/projects/bioreactor-agitation-and-mixing/', '/projects/bioreactor-surface-gas-transfer/'];
const previousPath = '/projects/xdr2000-heat-transfer/';
const anchor = 'how-heat-moves-through-the-vessel';
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g)].map(([, name, , value]) => [name.toLowerCase(), value]));
}
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
// Detail pages wrap their study cards in an outer article; count the cards themselves.
const articles = html => [...html.matchAll(/<article\b[^>]*>(?:(?!<article\b)[\s\S])*?<\/article>/gi)].map(([article]) => article);
const hasLink = (html, href) => tags(html, 'a').some(tag => tag.href === href);

function validateGroupedListing(html, prefix, label) {
  assert.equal(articles(html).filter(article => hasLink(article, `${prefix}${overviewPath}`)).length, 1, `${label} must have exactly one Bioprocess modeling listing`);
  for (const route of studyPaths) {
    assert.ok(!hasLink(html, `${prefix}${route}`), `${label} still lists the child study ${route}`);
  }
  assert.ok(!hasLink(html, `${prefix}${previousPath}`), `The legacy project still appears in ${label}`);
}

export function validateProjectRedirect({redirectHtml, studyHtml, listingHtml, overviewHtml, homeHtml}, base = '/') {
  const prefix = base === '/' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`;
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
  const articleHtml = studyHtml?.[articlePath];
  assert.ok(articleHtml, 'Missing retained temperature-control study');
  assert.ok([...articleHtml.matchAll(/\bid\s*=\s*(["'])(.*?)\1/g)].some(match => match[2] === anchor), 'Merged article is missing the redirect anchor');
  validateGroupedListing(listingHtml, prefix, 'Projects page');
  validateGroupedListing(homeHtml, prefix, 'Home page');
  const cards = articles(overviewHtml);
  const studyCards = new Set();
  for (const route of studyPaths) {
    const matchingCards = cards.filter(card => hasLink(card, `${prefix}${route}`));
    assert.equal(matchingCards.length, 1, `The overview must have exactly one study article for ${route}`);
    studyCards.add(matchingCards[0]);
    const html = studyHtml?.[route];
    assert.ok(html, `Missing retained study ${route}`);
    const studyCanonical = tags(html, 'link').find(tag => tag.rel === 'canonical');
    assert.ok(studyCanonical, `Missing canonical link for retained study ${route}`);
    assert.equal(new URL(studyCanonical.href).pathname, `${prefix}${route}`, `The retained study changed its canonical path: ${route}`);
    assert.ok(tags(html, 'a').some(tag => tag.class?.split(/\s+/).includes('detail-back') && tag.href === `${prefix}${overviewPath}`), `Missing parent back link to the overview from ${route}`);
  }
  assert.equal(studyCards.size, studyPaths.length, 'Each study must have its own overview article');
  return target;
}

export function checkProjectRedirect(directory = 'dist', base = '/') {
  const root = path.resolve(directory);
  const read = route => readFileSync(path.join(root, route, 'index.html'), 'utf8');
  return validateProjectRedirect({
    redirectHtml: read('projects/xdr2000-heat-transfer'),
    studyHtml: Object.fromEntries(studyPaths.map(route => [route, read(route.slice(1))])),
    listingHtml: read('projects'),
    overviewHtml: read(overviewPath.slice(1)),
    homeHtml: read(''),
  }, base);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const base = process.argv[3] ?? process.env.SITE_BASE_PATH ?? (repository && !repository.endsWith('.github.io') ? `/${repository}` : '/');
  console.log(`PASS: legacy project redirects to ${checkProjectRedirect(process.argv[2], base)}; one Bioprocess modeling overview links to all three retained studies.`);
}

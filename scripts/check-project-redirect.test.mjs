import assert from 'node:assert/strict';
import test from 'node:test';
import {validateProjectRedirect} from './check-project-redirect.mjs';

const overviewPath = '/projects/bioprocess-modeling/';
const temperaturePath = '/projects/bioreactor-temperature-control/';
const mixingPath = '/projects/bioreactor-agitation-and-mixing/';
const headspacePath = '/projects/bioreactor-surface-gas-transfer/';
const studyPaths = [temperaturePath, mixingPath, headspacePath];
const anchor = 'how-heat-moves-through-the-vessel';
const entry = href => `<article><h2><a href="${href}">Project</a></h2><a href="${href}">Read project</a></article>`;

function fixture(base) {
  const prefix = base === '/' ? '' : base;
  const destination = `${prefix}${temperaturePath}`;
  return {
    redirectHtml: `<meta content="0;url=${destination}#${anchor}" http-equiv="refresh"><link href="https://example.com${destination}" rel="canonical"><a href="${destination}#${anchor}">Continue</a>`,
    studyHtml: Object.fromEntries(studyPaths.map(route => [route, `<link href="https://example.com${prefix}${route}" rel="canonical"><a class="detail-back" href="${prefix}${overviewPath}">Bioprocess modeling</a><article><h2 id="${anchor}">How heat moves through the vessel</h2></article>`])),
    listingHtml: entry(`${prefix}${overviewPath}`),
    homeHtml: entry(`${prefix}${overviewPath}`),
    // Match the actual detail layout, which wraps the three cards in an article.
    overviewHtml: `<article><h1>Bioprocess modeling</h1>${studyPaths.map(route => entry(`${prefix}${route}`)).join('')}</article>`,
  };
}

for (const base of ['/', '/seankim']) {
  const prefix = base === '/' ? '' : base;

  test(`legacy redirect and grouped studies work at ${base}`, () => {
    assert.equal(validateProjectRedirect(fixture(base), base), `${prefix}${temperaturePath}#${anchor}`);
  });

  test(`redirect validation preserves the anchor, fallback and canonical checks at ${base}`, () => {
    const missingAnchor = fixture(base);
    missingAnchor.studyHtml[temperaturePath] = missingAnchor.studyHtml[temperaturePath].replace(`id="${anchor}"`, 'id="other-section"');
    assert.throws(() => validateProjectRedirect(missingAnchor, base), /missing the redirect anchor/);
    const missingFallback = fixture(base);
    missingFallback.redirectHtml = missingFallback.redirectHtml.replace(/<a[\s\S]*?<\/a>/, '');
    assert.throws(() => validateProjectRedirect(missingFallback, base), /Missing fallback link/);
    const wrongCanonical = fixture(base);
    wrongCanonical.redirectHtml = wrongCanonical.redirectHtml.replace(`https://example.com${prefix}${temperaturePath}`, `https://example.com${prefix}${overviewPath}`);
    assert.throws(() => validateProjectRedirect(wrongCanonical, base), {code: 'ERR_ASSERTION'});
    const canonicalFragment = fixture(base);
    canonicalFragment.redirectHtml = canonicalFragment.redirectHtml.replace(`https://example.com${prefix}${temperaturePath}`, `https://example.com${prefix}${temperaturePath}#${anchor}`);
    assert.throws(() => validateProjectRedirect(canonicalFragment, base), {code: 'ERR_ASSERTION'});
    const duplicateRefresh = fixture(base);
    duplicateRefresh.redirectHtml += `<meta http-equiv="refresh" content="0;url=${prefix}${temperaturePath}#${anchor}">`;
    assert.throws(() => validateProjectRedirect(duplicateRefresh, base), /Expected one static refresh/);
  });

  for (const field of ['listingHtml', 'homeHtml']) {
    test(`grouping catches a missing or duplicate overview in ${field} at ${base}`, () => {
      const missing = fixture(base);
      missing[field] = '';
      assert.throws(() => validateProjectRedirect(missing, base), /exactly one Bioprocess modeling listing/);
      const duplicate = fixture(base);
      duplicate[field] += duplicate[field];
      assert.throws(() => validateProjectRedirect(duplicate, base), /exactly one Bioprocess modeling listing/);
    });

    test(`grouping catches direct child and legacy listings in ${field} at ${base}`, () => {
      for (const route of studyPaths) {
        const duplicateChild = fixture(base);
        duplicateChild[field] += entry(`${prefix}${route}`);
        assert.throws(() => validateProjectRedirect(duplicateChild, base), /still lists the child study/);
      }
      const old = fixture(base);
      old[field] += entry(`${prefix}/projects/xdr2000-heat-transfer/`);
      assert.throws(() => validateProjectRedirect(old, base), /legacy project still appears/);
    });
  }

  test(`overview requires one distinct card per study at ${base}`, () => {
    for (const route of studyPaths) {
      const missing = fixture(base);
      missing.overviewHtml = missing.overviewHtml.replace(entry(`${prefix}${route}`), '');
      assert.throws(() => validateProjectRedirect(missing, base), /exactly one study article/);
      const duplicate = fixture(base);
      duplicate.overviewHtml += entry(`${prefix}${route}`);
      assert.throws(() => validateProjectRedirect(duplicate, base), /exactly one study article/);
    }
    const combined = fixture(base);
    combined.overviewHtml = `<article>${studyPaths.map(route => `<a href="${prefix}${route}">Read study</a>`).join('')}</article>`;
    assert.throws(() => validateProjectRedirect(combined, base), /Each study must have its own overview article/);
  });

  test(`all study pages retain their URLs and parent back links at ${base}`, () => {
    for (const route of studyPaths) {
      const missing = fixture(base);
      delete missing.studyHtml[route];
      assert.throws(() => validateProjectRedirect(missing, base), /Missing retained/);
      const wrongCanonical = fixture(base);
      wrongCanonical.studyHtml[route] = wrongCanonical.studyHtml[route].replace(`https://example.com${prefix}${route}`, `https://example.com${prefix}${overviewPath}`);
      assert.throws(() => validateProjectRedirect(wrongCanonical, base), /changed its canonical path/);
      const wrongParent = fixture(base);
      wrongParent.studyHtml[route] = wrongParent.studyHtml[route].replace(`href="${prefix}${overviewPath}"`, `href="${prefix}/projects/"`);
      assert.throws(() => validateProjectRedirect(wrongParent, base), /Missing parent back link/);
    }
  });
}

test('redirect validation catches a lost deployment base', () => {
  assert.throws(() => validateProjectRedirect(fixture('/'), '/seankim'), /wrong destination or deployment base/);
});

test('grouping catches a lost deployment base in overview cards and parent back links', () => {
  const overview = fixture('/seankim');
  overview.overviewHtml = overview.overviewHtml.replaceAll('/seankim/projects/', '/projects/');
  assert.throws(() => validateProjectRedirect(overview, '/seankim'), /exactly one study article/);
  const parent = fixture('/seankim');
  parent.studyHtml[headspacePath] = parent.studyHtml[headspacePath].replace(`href="/seankim${overviewPath}"`, `href="${overviewPath}"`);
  assert.throws(() => validateProjectRedirect(parent, '/seankim'), /Missing parent back link/);
});

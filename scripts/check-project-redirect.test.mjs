import assert from 'node:assert/strict';
import test from 'node:test';
import {validateProjectRedirect} from './check-project-redirect.mjs';

function fixture(base) {
  const destination = `${base === '/' ? '' : base}/projects/bioreactor-temperature-control/`;
  const anchor = 'how-heat-moves-through-the-vessel';
  return {
    redirectHtml: `<meta content="0;url=${destination}#${anchor}" http-equiv="refresh"><link href="https://example.com${destination}" rel="canonical"><a href="${destination}#${anchor}">Continue</a>`,
    articleHtml: `<h2 id="${anchor}">How heat moves through the vessel</h2>`,
    listingHtml: `<article><h2><a href="${destination}">Bioreactor temperature control</a></h2><a href="${destination}">Read project</a></article>`,
  };
}

for (const base of ['/', '/seankim']) {
  test(`legacy redirect and a single merged listing work at ${base}`, () => {
    assert.equal(validateProjectRedirect(fixture(base), base), `${base === '/' ? '' : base}/projects/bioreactor-temperature-control/#how-heat-moves-through-the-vessel`);
  });
}

test('redirect validation catches a lost deployment base and missing destination anchor', () => {
  assert.throws(() => validateProjectRedirect(fixture('/'), '/seankim'), /wrong destination or deployment base/);
  const data = fixture('/seankim');
  data.articleHtml = '<h2 id="other-section">Other section</h2>';
  assert.throws(() => validateProjectRedirect(data, '/seankim'), /missing the redirect anchor/);
});

test('redirect validation catches duplicate projects and a lingering legacy listing', () => {
  const data = fixture('/');
  data.listingHtml += data.listingHtml;
  assert.throws(() => validateProjectRedirect(data), /exactly one listing/);
  const old = fixture('/');
  old.listingHtml += '<article><a href="/projects/xdr2000-heat-transfer/">Previous project</a></article>';
  assert.throws(() => validateProjectRedirect(old), /legacy project still appears/);
});

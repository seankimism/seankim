import assert from 'node:assert/strict';
import test from 'node:test';
import {validateProjectRedirect} from './check-project-redirect.mjs';

const destination = '/projects/bioreactor-temperature-control/';
const anchor = 'how-heat-moves-through-the-vessel';
function fixture(base) {
  const prefix = base === '/' ? '' : base;
  return {
    redirectHtml: `<meta content="0;url=${prefix}${destination}#${anchor}" http-equiv="refresh"><link href="https://example.com${prefix}${destination}" rel="canonical"><a href="${prefix}${destination}#${anchor}">Continue</a>`,
    articleHtml: `<h2 id="${anchor}">How heat moves through the vessel</h2>`,
    listingHtml: '', homeHtml: '',
  };
}

for (const base of ['/', '/seankim']) {
  const prefix = base === '/' ? '' : base;
  test(`legacy redirect preserves its destination at ${base}`, () => {
    assert.equal(validateProjectRedirect(fixture(base), base), `${prefix}${destination}#${anchor}`);
  });

  test(`redirect validates anchor, fallback, canonical URL and refresh at ${base}`, () => {
    const missingAnchor = fixture(base);
    missingAnchor.articleHtml = '<h2 id="other">Other</h2>';
    assert.throws(() => validateProjectRedirect(missingAnchor, base), /missing the redirect anchor/);
    const missingFallback = fixture(base);
    missingFallback.redirectHtml = missingFallback.redirectHtml.replace(/<a[\s\S]*?<\/a>/, '');
    assert.throws(() => validateProjectRedirect(missingFallback, base), /Missing fallback link/);
    const wrongCanonical = fixture(base);
    wrongCanonical.redirectHtml = wrongCanonical.redirectHtml.replace(`https://example.com${prefix}${destination}`, `https://example.com${prefix}/projects/`);
    assert.throws(() => validateProjectRedirect(wrongCanonical, base), {code: 'ERR_ASSERTION'});
    const canonicalFragment = fixture(base);
    canonicalFragment.redirectHtml = canonicalFragment.redirectHtml.replace(`https://example.com${prefix}${destination}`, `https://example.com${prefix}${destination}#${anchor}`);
    assert.throws(() => validateProjectRedirect(canonicalFragment, base), {code: 'ERR_ASSERTION'});
    const duplicateRefresh = fixture(base);
    duplicateRefresh.redirectHtml += `<meta http-equiv="refresh" content="0;url=${prefix}${destination}#${anchor}">`;
    assert.throws(() => validateProjectRedirect(duplicateRefresh, base), /Expected one static refresh/);
  });

  test(`legacy project stays out of listings at ${base}`, () => {
    for (const field of ['listingHtml', 'homeHtml']) {
      const old = fixture(base);
      old[field] = `<a href="${prefix}/projects/xdr2000-heat-transfer/">Old project</a>`;
      assert.throws(() => validateProjectRedirect(old, base), /legacy project still appears/);
    }
  });
}

test('redirect validation catches a lost deployment base', () => {
  assert.throws(() => validateProjectRedirect(fixture('/'), '/seankim'), /wrong destination or deployment base/);
});

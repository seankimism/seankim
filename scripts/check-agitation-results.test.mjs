import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {checkAgitationResults} from './check-agitation-results.mjs';

test('agitation checks reject altered content and stale unlisted artifacts', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'agitation-release-'));
  try {
    const source = 'verified caption';
    writeFileSync(path.join(root, 'index.html'), source);
    writeFileSync(path.join(root, 'manifest.json'), JSON.stringify({
      scientific_datasets_included: false, artifact_bytes: Buffer.byteLength(source),
      artifacts: {'index.html': {bytes: Buffer.byteLength(source), sha256: createHash('sha256').update(source).digest('hex')}},
    }));
    assert.equal(checkAgitationResults(root), 1);
    writeFileSync(path.join(root, 'index.html'), 'modified caption');
    assert.throws(() => checkAgitationResults(root));
    writeFileSync(path.join(root, 'index.html'), source);
    writeFileSync(path.join(root, 'old.svg'), 'obsolete');
    assert.throws(() => checkAgitationResults(root));
  } finally { rmSync(root, {recursive: true, force: true}); }
});

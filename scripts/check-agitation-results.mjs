import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {readVerifiedFile, assertInventory} from './result-files.mjs';

export function checkAgitationResults(directory = 'public/agitation-thermal') {
  const root = path.resolve(directory);
  const manifest = JSON.parse(readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.scientific_datasets_included, false);
  assert.ok(manifest.artifacts && Object.keys(manifest.artifacts).length > 0);
  assertInventory(root, [...Object.keys(manifest.artifacts), 'manifest.json']);
  let bytes = 0;
  for (const [relative, entry] of Object.entries(manifest.artifacts)) {
    bytes += readVerifiedFile(root, {...entry, path: relative}, relative).length;
  }
  assert.equal(bytes, manifest.artifact_bytes);
  return Object.keys(manifest.artifacts).length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(`PASS: ${checkAgitationResults(process.argv[2])} agitation artifacts and exact inventory.`);
}

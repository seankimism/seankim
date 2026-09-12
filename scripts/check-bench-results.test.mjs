import assert from 'node:assert/strict';
import {cpSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {checkBenchResults, readBenchDisplay, validateBenchDisplay} from './check-bench-results.mjs';

const source = fileURLToPath(new URL('../public/bench-heating', import.meta.url));
const display = () => readBenchDisplay(readFileSync(path.join(source, 'index.html'), 'utf8'));

test('published bench export passes artifact and display checks', () => {
  const result = checkBenchResults(source);
  assert.equal(result.vessels, 2);
  assert.equal(result.scenarios, 6);
});

test('source input injected into otherwise valid display data is rejected', () => {
  const data = display();
  data.vessels[0].scenarios.fed_batch.process.solver_config = {kp_scale: 1};
  assert.throws(() => validateBenchDisplay(data), /Unexpected fields in culture process/);
});

test('an uncontrolled scenario cannot re-enter the public display catalog', () => {
  const data = display();
  data.vessels[0].scenarios.open_loop = structuredClone(data.vessels[0].scenarios.controlled);
  assert.throws(() => validateBenchDisplay(data), /Unexpected fields in default scenarios/);
});

test('misaligned wall bands and a changed default culture volume are rejected', () => {
  const data = display();
  data.vessels[0].scenarios.perfusion.wall_c[2].pop();
  assert.throws(() => validateBenchDisplay(data), /Misaligned wall bands/);
  const other = display();
  other.vessels[0].scenarios.fed_batch.process.volume_l[2] += 0.01;
  assert.throws(() => validateBenchDisplay(other), /volume must remain fixed/);
});

test('a manifest checksum misreport and an escaping path both fail', t => {
  const temporaryRoot = realpathSync(os.tmpdir());
  const directory = mkdtempSync(path.join(temporaryRoot, 'bench-results-test-'));
  assert.equal(path.dirname(realpathSync(directory)), temporaryRoot);
  t.after(() => rmSync(directory, {recursive: true, force: true}));
  cpSync(source, directory, {recursive: true});
  const filename = path.join(directory, 'manifest.json');
  const manifest = JSON.parse(readFileSync(filename, 'utf8'));
  const original = manifest.files[0].sha256;
  manifest.files[0].sha256 = '0'.repeat(64);
  writeFileSync(filename, JSON.stringify(manifest));
  assert.throws(() => checkBenchResults(directory), /Checksum mismatch/);
  manifest.files[0].sha256 = original;
  manifest.files[0].path = '../outside.html';
  writeFileSync(filename, JSON.stringify(manifest));
  assert.throws(() => checkBenchResults(directory), /unsafe asset path/);
});

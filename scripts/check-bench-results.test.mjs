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
  assert.equal(result.vessels, 3);
  assert.equal(result.scenarios, 12);
});

test('source input injected into otherwise valid display data is rejected', () => {
  const data = display();
  data.vessels[0].scenarios.fed_batch_cold_feed.process.solver_config = {kp_scale: 1};
  assert.throws(() => validateBenchDisplay(data), /Unexpected fields in culture process/);
});

test('an uncontrolled scenario cannot re-enter the public display catalog', () => {
  const data = display();
  data.vessels[0].scenarios.open_loop = structuredClone(data.vessels[0].scenarios.controlled);
  assert.throws(() => validateBenchDisplay(data), /Unexpected fields in default scenarios/);
});

test('misaligned wall bands and a changed perfusion volume are rejected', () => {
  const data = display();
  data.vessels[0].scenarios.perfusion.wall_c[2].pop();
  assert.throws(() => validateBenchDisplay(data), /Misaligned wall bands/);
  const other = display();
  other.vessels[0].scenarios.perfusion.process.volume_l[2] += 0.01;
  assert.throws(() => validateBenchDisplay(other), /volume must remain fixed/);
});

test('fed-batch scenarios carry scheduled boluses whose volume balance closes', () => {
  const data = display();
  for (const vessel of data.vessels) {
    for (const name of ['fed_batch_cold_feed', 'fed_batch_warm_feed']) {
      const p = vessel.scenarios[name].process;
      assert.equal(p.flow_model, 'bolus');
      assert.equal(p.inlet_temperature_c, name === 'fed_batch_cold_feed' ? 4 : 20);
      const start = {ambr250: 0.18, applikon3l: 2, xdr2000: 1500}[vessel.id];
      assert.ok(Math.abs(p.volume_l[0] - start) <= 1e-8);
      const steps = p.volume_l.filter((volume, index) => index > 0 && volume > p.volume_l[index - 1]).length;
      assert.equal(steps, 6, 'Six scheduled boluses');
      assert.ok(Math.abs(p.volume_l.at(-1) - start * 1.18) <= 1e-6);
    }
  }
  const broken = display();
  broken.vessels[0].scenarios.fed_batch_cold_feed.process.volume_l[5] += 0.01;
  assert.throws(() => validateBenchDisplay(broken), /volume balance does not close/);
  const unfed = display();
  const p = unfed.vessels[0].scenarios.fed_batch_warm_feed.process;
  p.flow_model = 'excluded';
  assert.throws(() => validateBenchDisplay(unfed), /scheduled feed boluses/);
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

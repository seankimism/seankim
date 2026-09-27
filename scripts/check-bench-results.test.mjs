import assert from 'node:assert/strict';
import {cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {checkBenchResults, loadBenchDisplay, readBenchDisplay, validateBenchDisplay} from './check-bench-results.mjs';
import {checksum} from './result-files.mjs';
import {watermarkFigures} from './watermark-model-figures.mjs';

const source = fileURLToPath(new URL('../public/bench-heating', import.meta.url));
const display = () => loadBenchDisplay(source);

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

test('on-demand catalog rejects invalid decoded lengths and mismatched scenario identities', () => {
  const catalog = () => readBenchDisplay(readFileSync(path.join(source, 'index.html'), 'utf8'));
  const changed = catalog();
  const file = changed.vessels[0].scenarios.controlled;
  // The content address stays valid; the declared decoded length must still match.
  file.json_bytes += 1;
  assert.throws(() => loadBenchDisplay(source, changed), /Size mismatch: decoded/);
  const mismatched = catalog();
  mismatched.vessels[0].scenarios.controlled = mismatched.vessels[1].scenarios.controlled;
  assert.throws(() => loadBenchDisplay(source, mismatched), /incomplete or inconsistent/);
});

test('a newly exported figure remains valid after watermarking records its source', async t => {
  const temporaryRoot = realpathSync(os.tmpdir());
  const root = mkdtempSync(path.join(temporaryRoot, 'bench-watermark-test-'));
  assert.equal(path.dirname(realpathSync(root)), temporaryRoot);
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const directory = path.join(root, 'public/bench-heating');
  mkdirSync(path.dirname(directory));
  cpSync(source, directory, {recursive: true});
  cpSync(path.join(source, '../figure-watermarks.json'), path.join(root, 'public/figure-watermarks.json'));
  const filename = path.join(directory, 'manifest.json');
  const manifest = JSON.parse(readFileSync(filename, 'utf8'));
  const entry = manifest.files.find(file => file.path.endsWith('.svg'));
  const original = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><path d="M20 20L300 250"/></svg>';
  writeFileSync(path.join(directory, entry.path), original);
  Object.assign(entry, {bytes: Buffer.byteLength(original), sha256: checksum(original)});
  delete entry.source_bytes;
  delete entry.source_sha256;
  writeFileSync(filename, JSON.stringify(manifest));
  await watermarkFigures({root});
  const updated = JSON.parse(readFileSync(filename, 'utf8')).files.find(file => file.path === entry.path);
  assert.equal(updated.source_bytes, Buffer.byteLength(original));
  assert.equal(updated.source_sha256, checksum(original));
  assert.equal(checkBenchResults(directory).scenarios, 12);
  delete updated.source_bytes;
  const broken = JSON.parse(readFileSync(filename, 'utf8'));
  broken.files[broken.files.findIndex(file => file.path === entry.path)] = updated;
  writeFileSync(filename, JSON.stringify(broken));
  assert.throws(() => checkBenchResults(directory), /Unexpected fields in manifest file/);
});

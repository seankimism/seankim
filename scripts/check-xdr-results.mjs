import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { validateResult } from '../public/xdr2000/result-loader.js';

const root = path.resolve(process.argv[2] || 'public/xdr2000');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(html, />Simulate<\/button>/);
assert.match(html, /Simulating \$\{fmt\(volume,0\)\} L/);
assert.ok(!/Load results|Loading results|Could not load results/.test(html), 'Implementation language is visible in the explorer.');
const embedded = JSON.parse(html.match(/<script type="application\/json" id="model-data">([\s\S]*?)<\/script>/)[1]);
assert.match(embedded.results_root, /^\.\/results\/[a-f0-9]{12}\/$/);
const {colors, volume_limits_l, results_root, ...defaultResult} = embedded;
validateResult(defaultResult, 1000);
assert.deepEqual(volume_limits_l, {min:400, max:2000});
assert.ok(Object.values(colors).every(value => /^#[a-f\d]{6}$/i.test(value)));
const directory = path.resolve(root, results_root);
const manifest = JSON.parse(readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
assert.equal(manifest.schema_version, 1);
assert.equal(manifest.version, path.basename(directory));
assert.equal(manifest.count, 1601);
assert.equal(manifest.min_volume_l, 400);
assert.equal(manifest.max_volume_l, 2000);
assert.equal(manifest.step_l, 1);
assert.equal(manifest.default_volume_l, 1000);
assert.equal(manifest.format, 'json+gzip');
assert.deepEqual(manifest.files.map(file => file.volume_l), Array.from({length:1601}, (_, i) => i + 400));
assert.deepEqual(readdirSync(directory).sort(), [...manifest.files.map(file => `${file.volume_l}.json.gz`), 'manifest.json'].sort());
let bytes = 0;
for (const file of manifest.files) {
  const buffer = readFileSync(path.join(directory, `${file.volume_l}.json.gz`));
  assert.equal(buffer.length, file.bytes, `Size mismatch at ${file.volume_l} L`);
  assert.equal(createHash('sha256').update(buffer).digest('hex'), file.sha256, `Checksum mismatch at ${file.volume_l} L`);
  const result = validateResult(JSON.parse(gunzipSync(buffer)), file.volume_l);
  assert.equal(result.times_s.at(-1), 28800);
  assert.equal(result.media_c[0], 4);
  assert.equal(result.inlet_c, 40);
  assert.equal(result.flow_l_min, 50);
  assert.equal(result.room_c, 20);
  assert.equal(result.target_c, 36.5);
  if (file.volume_l === 1000) {
    assert.deepEqual(result.times_s, defaultResult.times_s);
    assert.equal(result.bands.length, defaultResult.bands.length);
    assert.ok(Math.abs(result.target_time_s - defaultResult.target_time_s) < 0.001);
    for (const key of Object.keys(result.geometry)) assert.ok(Math.abs(result.geometry[key] - defaultResult.geometry[key]) < 1e-9);
    for (let i = 0; i < result.times_s.length; i++) {
      for (const key of ['media_c', 'water_c', 'air_c']) assert.ok(Math.abs(result[key][i] - defaultResult[key][i]) <= 0.00010000001);
      for (let band = 0; band < result.bands.length; band++) assert.ok(Math.abs(result.steel_c[i][band] - defaultResult.steel_c[i][band]) <= 0.00010000001);
    }
  }
  // Saved target crossings must agree with the neighboring displayed samples.
  if (result.target_time_s !== null) {
    const after = result.times_s.findIndex(time => time >= result.target_time_s);
    assert.ok(after > 0);
    assert.ok(result.media_c[after - 1] <= result.target_c + 0.00005);
    assert.ok(result.media_c[after] >= result.target_c - 0.00005);
  } else {
    assert.ok(result.media_c.every(value => value < result.target_c + 0.00005));
  }
  bytes += buffer.length;
}

function walk(directory) {
  return readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(location) : [location];
  });
}
// Fail the build if a future export accidentally ships the computational model.
const forbidden = /heating-solver-source|solver_config|XDRHeatingSolver|function\s+(?:buildModel|simulate|factor)\s*\(|contact_resistance_m2_k_w|steel_conductivity_w_m_k|capacity_j_k|conductance_w_k/;
const siteFiles = walk(path.dirname(root));
for (const file of siteFiles) {
  if (/\.(?:html|js|json|map|mjs|cjs|py|ts|txt|md|ipynb)$/i.test(file)) assert.ok(!forbidden.test(readFileSync(file, 'utf8')), `Computational source or parameters found in ${file}`);
  if (file.startsWith(root + path.sep)) assert.ok(!/\.(?:py|cjs|wasm|map)$/i.test(file), `Unexpected code artifact: ${file}`);
}
const siteBytes = siteFiles.reduce((sum, file) => sum + statSync(file).size, 0);
assert.ok(siteBytes < 1_000_000_000, 'Published site exceeds the GitHub Pages 1 GB limit.');
console.log(`PASS: all 1,601 volume results, checksums, dimensions, target crossings, and source-exposure checks (${(bytes/1e6).toFixed(1)} MB results; ${(siteBytes/1e6).toFixed(1)} MB site).`);

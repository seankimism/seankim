import assert from 'node:assert/strict';
import {readFileSync, readdirSync, realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {validateCatalog, validateScenario} from '../public/thermal-control/loader.js';

const checksum = bytes => createHash('sha256').update(bytes).digest('hex');
function walk(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const location = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Unexpected symbolic link: ${location}`);
    return entry.isDirectory() ? walk(location) : [location];
  });
}

export function checkControlResults(directory = 'public/thermal-control') {
  const root = realpathSync(path.resolve(directory));
  const catalog = validateCatalog(JSON.parse(readFileSync(path.join(root, 'catalog.json'), 'utf8')));
  assert.deepEqual(catalog.volumes_l, [400, 1000, 2000]);
  assert.deepEqual(catalog.p_scales, [0.25, 0.5, 0.75, 1, 1.5, 2, 3]);
  assert.deepEqual(catalog.i_scales, [0.25, 0.5, 0.75, 1, 1.5, 2, 3]);
  assert.deepEqual(catalog.defaults, {volume_l: 2000, p_index: 3, i_index: 3});
  assert.equal(catalog.files.length, 147);
  assert.deepEqual(catalog.conditions, {
    duration_s: 129600, display_step_s: 60, controller_sample_s: 5,
    initial_culture_c: 4, room_c: 20, jacket_flow_l_min: 50,
    jacket_min_c: 10, jacket_max_c: 40, heating_limit_kw: 20,
    cooling_limit_kw: 20, hold_tolerance_c: 0.2, minimum_hold_s: 3600,
    overshoot_limit_c: 0.8,
    setpoints: [{time_s: 0, temperature_c: 36.5}, {time_s: 57600, temperature_c: 33}],
  });
  let totalBytes = 0;
  for (const file of catalog.files) {
    const location = realpathSync(path.resolve(root, file.path));
    assert.ok(location.startsWith(root + path.sep), 'A result path escapes the public result directory.');
    const bytes = readFileSync(location);
    assert.equal(bytes.length, file.bytes, `Compressed size mismatch: ${file.key}`);
    assert.equal(checksum(bytes), file.sha256, `Compressed checksum mismatch: ${file.key}`);
    const decoded = gunzipSync(bytes, {maxOutputLength: file.json_bytes});
    assert.equal(decoded.length, file.json_bytes, `Decoded size mismatch: ${file.key}`);
    assert.equal(checksum(decoded), file.json_sha256, `Decoded checksum mismatch: ${file.key}`);
    const result = validateScenario(JSON.parse(decoded), catalog, {volume_l: file.volume_l, p_index: file.p_index, i_index: file.i_index});
    assert.equal(result.times_s.length, 2161);
    result.times_s.forEach((time, index) => assert.equal(time, index * 60));
    for (const [mode, response] of Object.entries(result.responses)) {
      assert.ok(response.metrics.maximum_jacket_c <= 40.00001, `Jacket cap exceeded: ${file.key}, ${mode}`);
      assert.ok(response.metrics.maximum_tcu_c <= 40.00001, `TCU cap exceeded: ${file.key}, ${mode}`);
      for (const key of ['heater_energy_kwh', 'cooler_energy_kwh', 'integral_absolute_error_c_h', 'time_outside_band_s']) {
        assert.ok(Math.abs(response.stages.reduce((sum, stage) => sum + stage[key], 0) - response.metrics[key]) <= 0.000003, `Stage totals disagree: ${file.key}, ${mode}, ${key}`);
      }
      for (const key of ['peak_heating_power_w', 'peak_cooling_power_w']) {
        assert.equal(Math.max(...response.stages.map(stage => stage[key])), response.metrics[key]);
      }
      assert.equal(response.metrics.targets_met, response.stages.every(stage => stage.targets_met));
    }
    totalBytes += bytes.length;
  }
  const resultFiles = walk(path.join(root, 'results')).map(location => path.relative(root, location).split(path.sep).join('/'));
  assert.deepEqual(resultFiles.sort(), catalog.files.map(file => file.path).sort(), 'The published result tree contains missing or unlisted artifacts.');
  const permittedAssets = new Set(['index.html', 'explorer.js', 'loader.js', 'explorer.css', 'catalog.json']);
  const forbidden = /heating-solver-source|solver_config|XDRHeatingSolver|function\s+(?:buildModel|simulate|factor)\s*\(|contact_resistance_m2_k_w|steel_conductivity_w_m_k|capacity_j_k|conductance_w_k|physical_inputs|state_matrix|eigenvectors/;
  for (const location of walk(root)) {
    const relative = path.relative(root, location).split(path.sep).join('/');
    if (relative.startsWith('results/')) continue; // Every decoded field was checked against the strict schema above.
    assert.ok(permittedAssets.has(relative), `Unexpected published artifact: ${relative}`);
    assert.ok(!forbidden.test(readFileSync(location, 'utf8')), `Computational model data found in ${relative}`);
  }
  return {count: catalog.files.length, bytes: totalBytes, version: catalog.version};
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = checkControlResults(process.argv[2]);
  console.log(`PASS: ${result.count} paired tuning responses, compressed/decoded checksums, gain selection, stage metrics, and result-only export (${(result.bytes / 1e6).toFixed(1)} MB).`);
}

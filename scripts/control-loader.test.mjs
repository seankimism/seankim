import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync, gunzipSync} from 'node:zlib';
import {mkdtempSync, readFileSync, writeFileSync, cpSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadCatalog, loadScenario, validateCatalog, validateScenario} from '../public/thermal-control/loader.js';
import {checkControlResults} from './check-control-results.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
const clone = value => structuredClone(value);
const defaultSelection = {volume_l: 1000, p_index: 3, i_index: 3};
const stage = (setpoint, start, end) => ({
  setpoint_c: setpoint, start_s: start, end_s: end, settled_after_s: null,
  directional_overshoot_c: 0, final_hold_max_error_c: 1, hold_duration_met: false,
  targets_met: false, integral_absolute_error_c_h: 1, time_outside_band_s: 100,
  heater_energy_kwh: 1, cooler_energy_kwh: 0,
  peak_heating_power_w: 2000, peak_cooling_power_w: 0,
});

function fixture() {
  const scales = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];
  const gains = {outer_kp: 5, outer_ti_min: 100, inner_kp: 10000, inner_ti_min: 3};
  const catalog = {
    schema_version: 1, version: 'a'.repeat(64), volumes_l: [400, 1000, 2000],
    p_scales: scales, i_scales: [...scales], defaults: {...defaultSelection},
    baseline_gains_by_volume: Object.fromEntries([400, 1000, 2000].map(volume => [volume, {...gains}])),
    conditions: {
      duration_s: 129600, display_step_s: 60, controller_sample_s: 5,
      initial_culture_c: 4, room_c: 20, jacket_flow_l_min: 50,
      jacket_min_c: 10, jacket_max_c: 40, heating_limit_kw: 20, cooling_limit_kw: 20,
      hold_tolerance_c: 0.2, minimum_hold_s: 3600, overshoot_limit_c: 0.8,
      setpoints: [{time_s: 0, temperature_c: 36.5}, {time_s: 57600, temperature_c: 33}],
    }, files: [],
  };
  const payloads = new Map();
  for (const volume of catalog.volumes_l) for (let p = 0; p < scales.length; p++) for (let i = 0; i < scales.length; i++) {
    const key = `${volume}L-p${p}-i${i}`;
    const response = {
      culture_c: [4, 36.5, 33], jacket_c: [20, 38, 33], supply_c: [20, 40, 32],
      tcu_c: [20, 40, 31], power_kw: [0, 2, 0],
      stages: [stage(36.5, 0, 57600), stage(33, 57600, 129600)],
      metrics: {
        maximum_jacket_c: 38, maximum_tcu_c: 40, maximum_supply_c: 40,
        heater_energy_kwh: 2, cooler_energy_kwh: 0,
        peak_heating_power_w: 2000, peak_cooling_power_w: 0,
        integral_absolute_error_c_h: 2, time_outside_band_s: 200,
        limited_time_fraction: 0.1, targets_met: false,
      },
    };
    const data = {
      schema_version: 1, key, volume_l: volume, p_index: p, i_index: i,
      gains: {...gains, outer_kp: gains.outer_kp * scales[p], outer_ti_min: gains.outer_ti_min * scales[i]},
      times_s: [0, 57600, 129600], responses: {heating_only: response, heating_cooling: clone(response)},
    };
    const json = Buffer.from(JSON.stringify(data));
    const compressed = gzipSync(json);
    const file = {key, volume_l: volume, p_index: p, i_index: i, path: `results/${catalog.version}/${key}.json.gz`, bytes: compressed.length, sha256: hash(compressed), json_bytes: json.length, json_sha256: hash(json)};
    catalog.files.push(file);
    payloads.set(key, {data, json, compressed});
  }
  return {catalog, payloads};
}

const source = fixture();
async function catalogFor(catalog = source.catalog) {
  return loadCatalog('http://localhost/portfolio/thermal-control/catalog.json', {fetchResult: async () => new Response(JSON.stringify(catalog))});
}
const selectedPayload = selection => source.payloads.get(`${selection.volume_l}L-p${selection.p_index}-i${selection.i_index}`);

test('loads the selected volume and tuning, with verified compressed and decoded payloads', async () => {
  for (const selection of [defaultSelection, {volume_l: 400, p_index: 0, i_index: 6}, {volume_l: 2000, p_index: 6, i_index: 0}]) {
    const catalog = await catalogFor();
    const file = catalog.files.find(item => item.key === selectedPayload(selection).data.key);
    let requested;
    const result = await loadScenario(catalog, selection, {fetchResult: async url => {
      requested = url;
      return new Response(selectedPayload(selection).compressed);
    }});
    assert.equal(requested, `http://localhost/portfolio/thermal-control/${file.path}`);
    assert.deepEqual(result, selectedPayload(selection).data);
    assert.ok(Object.isFrozen(catalog.files[0]) && Object.isFrozen(result.responses.heating_only.culture_c));
  }
});

test('accepts host-decoded JSON only when decoded size and checksum match', async () => {
  const catalog = await catalogFor();
  const payload = selectedPayload(defaultSelection);
  const result = await loadScenario(catalog, defaultSelection, {fetchResult: async () => new Response(payload.json)});
  assert.deepEqual(result, payload.data);
  const damaged = Buffer.from(payload.json);
  damaged[10] ^= 1;
  await assert.rejects(loadScenario(await catalogFor(), defaultSelection, {fetchResult: async () => new Response(damaged)}), /integrity/);
});

test('rejects malformed catalog metadata, incomplete coverage, duplicate keys, and unsafe paths', () => {
  const changes = [
    value => { value.schema_version = 2; },
    value => { value.internal_parameters = {}; },
    value => { value.conditions.private_configuration = {}; },
    value => { value.baseline_gains_by_volume['1000'].hidden_parameter = 1; },
    value => { value.files.pop(); },
    value => { value.files[1] = value.files[0]; },
    value => { value.files[0].sha256 = 'bad'; },
    value => { value.files[0].bytes = -1; },
    value => { value.files[0].json_bytes = 10_000_001; },
    value => { value.files[0].p_index = 99; },
    value => { value.files[0].path = '../secret.json.gz'; },
    value => { value.files[0].path = '/results/file.json.gz'; },
    value => { value.files[0].path = 'https://elsewhere.test/file.json.gz'; },
    value => { value.files[0].path = `results/${value.version}/%2e%2e/file.json.gz`; },
    value => { value.files[0].path += '?redirect=1'; },
    value => { value.conditions.setpoints[1].time_s = 0; },
  ];
  for (const change of changes) {
    const catalog = clone(source.catalog);
    change(catalog);
    assert.throws(() => validateCatalog(catalog));
  }
});

test('rejects cross-origin and unsupported catalog URLs before any fetch', async () => {
  for (const url of ['https://elsewhere.test/catalog.json', 'file:///catalog.json', 'http://user:pass@localhost/catalog.json', './catalog.json?other=1']) {
    await assert.rejects(loadCatalog(url, {fetchResult: () => assert.fail('must not fetch')}), /this website/);
  }
});

test('rejects wrong selection, unknown fields at every result level, malformed traces and metrics', () => {
  const changes = [
    value => { value.volume_l = 400; },
    value => { value.p_index = 4; },
    value => { value.private_configuration = {}; },
    value => { value.gains.internal_tuning = {}; },
    value => { value.gains.outer_ti_min *= 2; },
    value => { value.responses.third_mode = {}; },
    value => { value.responses.heating_only.parameters = {}; },
    value => { value.responses.heating_only.stages[0].hidden_value = 1; },
    value => { value.responses.heating_only.metrics.hidden_value = 1; },
    value => { value.times_s[1] = 0; },
    value => { value.times_s[2] = 129599; },
    value => { value.responses.heating_only.culture_c.pop(); },
    value => { value.responses.heating_only.culture_c[1] = NaN; },
    value => { value.responses.heating_only.culture_c[0] = 20; },
    value => { value.responses.heating_only.power_kw[1] = -0.01; },
    value => { value.responses.heating_cooling.power_kw[1] = -21; },
    value => { value.responses.heating_only.stages[1].start_s = 57601; },
    value => { value.responses.heating_only.stages[0].settled_after_s = -1; },
    value => { value.responses.heating_only.stages[0].hold_duration_met = true; },
    value => { value.responses.heating_only.metrics.limited_time_fraction = 1.01; },
    value => { value.responses.heating_only.metrics.maximum_tcu_c = 39; },
  ];
  for (const change of changes) {
    const data = clone(selectedPayload(defaultSelection).data);
    change(data);
    assert.throws(() => validateScenario(data, source.catalog, defaultSelection));
  }
});

test('rejects invalid selections before fetching and rejects unloaded catalogs', async () => {
  const catalog = await catalogFor();
  for (const selection of [{...defaultSelection, volume_l: 1001}, {...defaultSelection, i_index: 3.5}, {...defaultSelection, p_index: '3'}, {...defaultSelection, extra: true}]) {
    await assert.rejects(loadScenario(catalog, selection, {fetchResult: () => assert.fail('must not fetch')}), /supported/);
  }
  await assert.rejects(loadScenario(source.catalog, defaultSelection), /Load the tuning catalog/);
});

test('failed HTTP and corrupt downloads never enter the cache and can be retried', async () => {
  const payload = selectedPayload(defaultSelection);
  const corrupt = Buffer.from(payload.compressed);
  corrupt[20] ^= 1;
  for (const response of [new Response('missing', {status: 404}), new Response(payload.compressed.subarray(1)), new Response(corrupt)]) {
    const catalog = await catalogFor();
    await assert.rejects(loadScenario(catalog, defaultSelection, {fetchResult: async () => response}));
    const result = await loadScenario(catalog, defaultSelection, {fetchResult: async () => new Response(payload.compressed)});
    assert.deepEqual(result, payload.data);
  }
});

test('rejects mismatched file sizes, checksums, and unexpected redirects', async () => {
  const key = selectedPayload(defaultSelection).data.key;
  for (const field of ['bytes', 'json_bytes', 'sha256', 'json_sha256']) {
    const metadata = clone(source.catalog);
    const file = metadata.files.find(value => value.key === key);
    file[field] = field.includes('bytes') ? file[field] + 1 : 'b'.repeat(64);
    await assert.rejects(loadScenario(await catalogFor(metadata), defaultSelection, {fetchResult: async () => new Response(selectedPayload(defaultSelection).compressed)}));
  }
  const redirected = new Response(selectedPayload(defaultSelection).compressed);
  Object.defineProperty(redirected, 'url', {value: 'https://elsewhere.test/response.json.gz'});
  await assert.rejects(loadScenario(await catalogFor(), defaultSelection, {fetchResult: async () => redirected}), /redirected/);
});

test('aborts before fetching, forwards live cancellation, and does not cache canceled responses', async () => {
  const signal = AbortSignal.abort();
  await assert.rejects(loadCatalog('./catalog.json', {signal, fetchResult: () => assert.fail('must not fetch')}), {name: 'AbortError'});
  const catalog = await catalogFor();
  await assert.rejects(loadScenario(catalog, defaultSelection, {signal, fetchResult: () => assert.fail('must not fetch')}), {name: 'AbortError'});
  const controller = new AbortController();
  await assert.rejects(loadScenario(catalog, defaultSelection, {signal: controller.signal, fetchResult: async (_url, options) => {
    assert.equal(options.signal, controller.signal);
    controller.abort();
    return new Response(selectedPayload(defaultSelection).compressed);
  }}), {name: 'AbortError'});
  await loadScenario(catalog, defaultSelection, {fetchResult: async () => new Response(selectedPayload(defaultSelection).compressed)});
});

test('keeps only eight successful responses and refreshes the least recently used entry', async () => {
  const catalog = await catalogFor();
  let calls = 0;
  const fetchResult = async url => {
    calls++;
    const key = new URL(url).pathname.split('/').at(-1).replace('.json.gz', '');
    return new Response(source.payloads.get(key).compressed);
  };
  const selections = catalog.files.slice(0, 9).map(({volume_l, p_index, i_index}) => ({volume_l, p_index, i_index}));
  for (const selection of selections.slice(0, 8)) await loadScenario(catalog, selection, {fetchResult});
  await loadScenario(catalog, selections[0], {fetchResult});
  assert.equal(calls, 8);
  await loadScenario(catalog, selections[8], {fetchResult});
  await loadScenario(catalog, selections[0], {fetchResult});
  assert.equal(calls, 9);
  await loadScenario(catalog, selections[1], {fetchResult});
  assert.equal(calls, 10);
});

test('the complete exported catalog passes static checks; missing and unlisted files fail', () => {
  const sourceRoot = new URL('../public/thermal-control/', import.meta.url);
  assert.equal(checkControlResults(fileURLToPath(sourceRoot)).count, 147);
  const temporary = mkdtempSync(path.join(tmpdir(), 'thermal-control-export-'));
  try {
    cpSync(sourceRoot, temporary, {recursive: true});
    const catalog = JSON.parse(readFileSync(path.join(temporary, 'catalog.json'), 'utf8'));
    const firstPath = path.join(temporary, catalog.files[0].path);
    const first = readFileSync(firstPath);
    rmSync(firstPath);
    assert.throws(() => checkControlResults(temporary));
    writeFileSync(firstPath, first);
    writeFileSync(path.join(temporary, 'results', 'unlisted.json'), '{}');
    assert.throws(() => checkControlResults(temporary), /unlisted/);
    rmSync(path.join(temporary, 'results', 'unlisted.json'));
    const data = JSON.parse(gunzipSync(first));
    data.responses.heating_only.private_configuration = {hidden: 1};
    const json = Buffer.from(JSON.stringify(data));
    const compressed = gzipSync(json);
    writeFileSync(firstPath, compressed);
    Object.assign(catalog.files[0], {bytes: compressed.length, sha256: hash(compressed), json_bytes: json.length, json_sha256: hash(json)});
    writeFileSync(path.join(temporary, 'catalog.json'), JSON.stringify(catalog));
    assert.throws(() => checkControlResults(temporary), /incomplete or inconsistent/);
  } finally {
    assert.equal(path.dirname(path.resolve(temporary)), path.resolve(tmpdir()));
    assert.ok(path.basename(temporary).startsWith('thermal-control-export-'));
    rmSync(temporary, {recursive: true, force: true});
  }
});

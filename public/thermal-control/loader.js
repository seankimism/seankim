// Download and validate display results. This module performs no thermal calculation.
const catalogKeys = ['schema_version', 'version', 'volumes_l', 'p_scales', 'i_scales', 'defaults', 'baseline_gains_by_volume', 'conditions', 'files'];
const gainKeys = ['outer_kp', 'outer_ti_min', 'inner_kp', 'inner_ti_min'];
const conditionKeys = ['duration_s', 'display_step_s', 'controller_sample_s', 'initial_culture_c', 'room_c', 'jacket_flow_l_min', 'jacket_min_c', 'jacket_max_c', 'heating_limit_kw', 'cooling_limit_kw', 'hold_tolerance_c', 'minimum_hold_s', 'overshoot_limit_c', 'setpoints'];
const fileKeys = ['key', 'volume_l', 'p_index', 'i_index', 'path', 'bytes', 'sha256', 'json_bytes', 'json_sha256'];
const scenarioKeys = ['schema_version', 'key', 'volume_l', 'p_index', 'i_index', 'gains', 'times_s', 'responses'];
const modeKeys = ['culture_c', 'jacket_c', 'supply_c', 'tcu_c', 'power_kw', 'stages', 'metrics'];
const stageKeys = ['setpoint_c', 'start_s', 'end_s', 'settled_after_s', 'directional_overshoot_c', 'final_hold_max_error_c', 'hold_duration_met', 'targets_met', 'integral_absolute_error_c_h', 'time_outside_band_s', 'heater_energy_kwh', 'cooler_energy_kwh', 'peak_heating_power_w', 'peak_cooling_power_w'];
const metricKeys = ['maximum_jacket_c', 'maximum_tcu_c', 'maximum_supply_c', 'heater_energy_kwh', 'cooler_energy_kwh', 'peak_heating_power_w', 'peak_cooling_power_w', 'integral_absolute_error_c_h', 'time_outside_band_s', 'limited_time_fraction', 'targets_met'];
const modes = ['heating_only', 'heating_cooling'];
const contexts = new WeakMap();
const hashPattern = /^[a-f0-9]{64}$/;
const maxBytes = 10_000_000;
const sameKeys = (value, keys) => value !== null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
const positive = value => Number.isFinite(value) && value > 0;
const close = (left, right, tolerance = 0.00001) => Math.abs(left - right) <= tolerance;
const requireValid = (condition, message = 'The saved result is incomplete or inconsistent.') => { if (!condition) throw new Error(message); };
const isIndex = (value, values) => Number.isInteger(value) && value >= 0 && value < values.length;

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
}

export function validateCatalog(catalog) {
  requireValid(sameKeys(catalog, catalogKeys), 'The tuning catalog has an unexpected format.');
  requireValid(catalog.schema_version === 1 && hashPattern.test(catalog.version));
  const {volumes_l: volumes, p_scales: pScales, i_scales: iScales, conditions, defaults} = catalog;
  for (const values of [volumes, pScales, iScales]) {
    requireValid(Array.isArray(values) && values.length > 0 && values.length <= 20 && values.every((value, index) => positive(value) && (index === 0 || value > values[index - 1])));
  }
  requireValid(volumes.every(value => Number.isInteger(value) && value >= 400 && value <= 2000));
  requireValid(sameKeys(defaults, ['volume_l', 'p_index', 'i_index']) && volumes.includes(defaults.volume_l) && isIndex(defaults.p_index, pScales) && isIndex(defaults.i_index, iScales));
  requireValid(sameKeys(catalog.baseline_gains_by_volume, volumes.map(String)));
  for (const gain of Object.values(catalog.baseline_gains_by_volume)) requireValid(sameKeys(gain, gainKeys) && gainKeys.every(key => positive(gain[key])));
  requireValid(sameKeys(conditions, conditionKeys));
  requireValid(conditionKeys.filter(key => key !== 'setpoints').every(key => Number.isFinite(conditions[key])));
  requireValid(positive(conditions.duration_s) && conditions.duration_s <= 604800 && positive(conditions.display_step_s) && positive(conditions.controller_sample_s));
  requireValid(conditions.display_step_s >= conditions.controller_sample_s && conditions.duration_s / conditions.display_step_s <= 10000);
  requireValid(conditions.jacket_max_c > conditions.jacket_min_c && positive(conditions.heating_limit_kw) && positive(conditions.cooling_limit_kw) && positive(conditions.jacket_flow_l_min));
  requireValid(positive(conditions.hold_tolerance_c) && positive(conditions.minimum_hold_s) && conditions.minimum_hold_s <= conditions.duration_s && positive(conditions.overshoot_limit_c));
  requireValid(Array.isArray(conditions.setpoints) && conditions.setpoints.length > 0 && conditions.setpoints.length <= 8);
  conditions.setpoints.forEach((step, index) => requireValid(sameKeys(step, ['time_s', 'temperature_c']) && Number.isFinite(step.temperature_c) && Number.isFinite(step.time_s) && step.time_s < conditions.duration_s && (index === 0 ? step.time_s === 0 : step.time_s > conditions.setpoints[index - 1].time_s)));
  requireValid(Array.isArray(catalog.files) && catalog.files.length === volumes.length * pScales.length * iScales.length);
  const keys = new Set();
  for (const file of catalog.files) {
    requireValid(sameKeys(file, fileKeys) && volumes.includes(file.volume_l) && isIndex(file.p_index, pScales) && isIndex(file.i_index, iScales));
    const key = `${file.volume_l}L-p${file.p_index}-i${file.i_index}`;
    requireValid(file.key === key && !keys.has(key));
    requireValid(file.path === `results/${catalog.version}/${key}.json.gz`, 'The saved result path is invalid.');
    requireValid(['bytes', 'json_bytes'].every(name => Number.isInteger(file[name]) && file[name] > 0 && file[name] <= maxBytes));
    requireValid(hashPattern.test(file.sha256) && hashPattern.test(file.json_sha256));
    keys.add(key);
  }
  return catalog;
}

function selectedFile(catalog, selection) {
  requireValid(sameKeys(selection, ['volume_l', 'p_index', 'i_index']), 'Choose a supported volume and tuning combination.');
  const file = catalog.files.find(entry => entry.volume_l === selection.volume_l && entry.p_index === selection.p_index && entry.i_index === selection.i_index);
  requireValid(file, 'Choose a supported volume and tuning combination.');
  return file;
}

export function validateScenario(result, catalog, selection) {
  const file = selectedFile(catalog, selection);
  requireValid(sameKeys(result, scenarioKeys) && result.schema_version === 1 && ['key', 'volume_l', 'p_index', 'i_index'].every(key => result[key] === file[key]), 'The saved result does not match this tuning combination.');
  requireValid(sameKeys(result.gains, gainKeys) && gainKeys.every(key => positive(result.gains[key])));
  const baseline = catalog.baseline_gains_by_volume[result.volume_l];
  requireValid(close(result.gains.outer_kp, baseline.outer_kp * catalog.p_scales[result.p_index]) && close(result.gains.outer_ti_min, baseline.outer_ti_min * catalog.i_scales[result.i_index]));
  requireValid(close(result.gains.inner_kp, baseline.inner_kp) && close(result.gains.inner_ti_min, baseline.inner_ti_min));
  const {conditions} = catalog;
  const times = result.times_s;
  requireValid(Array.isArray(times) && times.length >= 2 && times.length <= 10001 && times[0] === 0 && times.at(-1) === conditions.duration_s && times.every((time, index) => Number.isFinite(time) && (index === 0 || time > times[index - 1])));
  requireValid(conditions.setpoints.every(step => times.includes(step.time_s)));
  requireValid(sameKeys(result.responses, modes));
  for (const mode of modes) {
    const response = result.responses[mode];
    requireValid(sameKeys(response, modeKeys));
    for (const key of ['culture_c', 'jacket_c', 'supply_c', 'tcu_c', 'power_kw']) requireValid(Array.isArray(response[key]) && response[key].length === times.length && response[key].every(Number.isFinite));
    requireValid(close(response.culture_c[0], conditions.initial_culture_c, 0.0001));
    requireValid(response.power_kw.every(power => power <= conditions.heating_limit_kw + 0.011 && power >= (mode === 'heating_only' ? 0 : -conditions.cooling_limit_kw - 0.011)));
    requireValid(Array.isArray(response.stages) && response.stages.length === conditions.setpoints.length);
    response.stages.forEach((stage, index) => {
      const step = conditions.setpoints[index];
      const end = conditions.setpoints[index + 1]?.time_s ?? conditions.duration_s;
      requireValid(sameKeys(stage, stageKeys) && stage.setpoint_c === step.temperature_c && stage.start_s === step.time_s && stage.end_s === end);
      requireValid(stage.settled_after_s === null || (Number.isFinite(stage.settled_after_s) && stage.settled_after_s >= 0 && stage.settled_after_s <= end - step.time_s));
      requireValid(['hold_duration_met', 'targets_met'].every(key => typeof stage[key] === 'boolean'));
      requireValid(stageKeys.filter(key => !['settled_after_s', 'hold_duration_met', 'targets_met'].includes(key)).every(key => Number.isFinite(stage[key])));
      requireValid(stageKeys.filter(key => !['setpoint_c', 'start_s', 'end_s', 'settled_after_s', 'hold_duration_met', 'targets_met'].includes(key)).every(key => stage[key] >= 0));
      requireValid(stage.time_outside_band_s <= end - step.time_s + 0.00001);
      requireValid(!stage.hold_duration_met || (stage.settled_after_s !== null && end - step.time_s - stage.settled_after_s >= conditions.minimum_hold_s - 0.00001));
      requireValid(!stage.targets_met || (stage.hold_duration_met && stage.directional_overshoot_c <= conditions.overshoot_limit_c + 0.00001 && stage.final_hold_max_error_c <= conditions.hold_tolerance_c + 0.00001));
      if (mode === 'heating_only') requireValid(stage.cooler_energy_kwh === 0 && stage.peak_cooling_power_w === 0);
    });
    const metrics = response.metrics;
    requireValid(sameKeys(metrics, metricKeys) && typeof metrics.targets_met === 'boolean');
    requireValid(metricKeys.filter(key => key !== 'targets_met').every(key => Number.isFinite(metrics[key]) && (key.startsWith('maximum_') || metrics[key] >= 0)));
    requireValid(metrics.limited_time_fraction <= 1 && metrics.time_outside_band_s <= conditions.duration_s + 0.00001);
    for (const [field, metric] of [['jacket_c', 'maximum_jacket_c'], ['tcu_c', 'maximum_tcu_c'], ['supply_c', 'maximum_supply_c']]) requireValid(Math.max(...response[field]) <= metrics[metric] + 0.00011);
    if (mode === 'heating_only') requireValid(metrics.cooler_energy_kwh === 0 && metrics.peak_cooling_power_w === 0);
  }
  return result;
}

function absoluteCatalogUrl(value) {
  const base = globalThis.document?.baseURI ?? globalThis.location?.href ?? 'http://localhost/';
  const url = new URL(value, base);
  requireValid(['http:', 'https:'].includes(url.protocol) && url.origin === new URL(base).origin && !url.username && !url.password && !url.hash && !url.search, 'The tuning catalog must come from this website.');
  return url;
}

async function download(url, {signal, fetchResult}, limit) {
  signal?.throwIfAborted();
  const response = await fetchResult(url.href, {signal, credentials: 'same-origin'});
  requireValid(response.ok, 'The temperature response could not be downloaded. Please try again.');
  requireValid(!response.url || response.url === url.href, 'The result download was redirected unexpectedly.');
  const length = Number(response.headers.get('content-length'));
  requireValid(!Number.isFinite(length) || length <= limit, 'The result download is larger than expected.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  signal?.throwIfAborted();
  requireValid(bytes.length <= limit, 'The result download is larger than expected.');
  return bytes;
}

async function verifyBytes(bytes, length, checksum) {
  requireValid(bytes.length === length, 'The saved response has an unexpected size.');
  requireValid(globalThis.crypto?.subtle, 'Open this page over HTTPS to check the saved responses.');
  const digest = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes));
  requireValid(Array.from(digest, value => value.toString(16).padStart(2, '0')).join('') === checksum, 'The saved response failed its integrity check.');
}

async function unpack(bytes, limit) {
  requireValid(typeof DecompressionStream !== 'undefined', 'Please use a current browser to view the temperature responses.');
  const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      length += value.length;
      requireValid(length <= limit, 'The saved response expands beyond its expected size.');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const decoded = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { decoded.set(chunk, offset); offset += chunk.length; }
  return decoded;
}

export async function loadCatalog(url = './catalog.json', {signal, fetchResult = fetch} = {}) {
  const location = absoluteCatalogUrl(url);
  const bytes = await download(location, {signal, fetchResult}, 1_000_000);
  const catalog = deepFreeze(validateCatalog(JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes))));
  contexts.set(catalog, {root: new URL('./', location), cache: new Map()});
  return catalog;
}

export async function loadScenario(catalog, selection, {signal, fetchResult = fetch} = {}) {
  signal?.throwIfAborted();
  const context = contexts.get(catalog);
  requireValid(context, 'Load the tuning catalog before choosing a response.');
  const file = selectedFile(catalog, selection);
  if (context.cache.has(file.key)) {
    const result = context.cache.get(file.key);
    context.cache.delete(file.key);
    context.cache.set(file.key, result);
    return result;
  }
  let bytes = await download(new URL(file.path, context.root), {signal, fetchResult}, Math.max(file.bytes, file.json_bytes));
  // Hosts may send the stored gzip or decode it through Content-Encoding.
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    await verifyBytes(bytes, file.bytes, file.sha256);
    bytes = await unpack(bytes, file.json_bytes);
  }
  await verifyBytes(bytes, file.json_bytes, file.json_sha256);
  const result = deepFreeze(validateScenario(JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes)), catalog, selection));
  signal?.throwIfAborted();
  context.cache.set(file.key, result);
  if (context.cache.size > 8) context.cache.delete(context.cache.keys().next().value);
  return result;
}

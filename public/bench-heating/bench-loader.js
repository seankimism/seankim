// Display-only scenario loading. Scientific models remain in the modeling repository.
import {loadJson, deepFreeze, ResultCache} from '../result-transport.js';

const modes = ['controlled', 'fed_batch_cold_feed', 'fed_batch_warm_feed', 'perfusion'];
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const keys = (value, fields) => value && !Array.isArray(value) && typeof value === 'object'
  && Object.keys(value).sort().join(' ') === fields.split(' ').sort().join(' ');
const requireValid = condition => {if (!condition) throw new Error('The saved scenario is incomplete or inconsistent.');};
const finiteArray = (values, size) => Array.isArray(values) && values.length === size && values.every(Number.isFinite);
const contexts = new WeakMap();

export function validateCatalog(catalog) {
  requireValid(keys(catalog, 'schema_version version default_vessel default_mode vessels')
    && catalog.schema_version === 2 && hash(catalog.version) && Array.isArray(catalog.vessels)
    && catalog.vessels.length > 0 && catalog.vessels.length <= 3);
  const ids = new Set();
  for (const vessel of catalog.vessels) {
    requireValid(keys(vessel, 'id title volume_l wall_material element_name geometry bands scenarios')
      && ['applikon3l', 'ambr250', 'xdr2000'].includes(vessel.id) && !ids.has(vessel.id));
    ids.add(vessel.id);
    requireValid(['title', 'wall_material', 'element_name'].every(key => typeof vessel[key] === 'string' && vessel[key].length)
      && Number.isFinite(vessel.volume_l) && vessel.volume_l > 0 && Array.isArray(vessel.bands)
      && vessel.bands.length > 0 && vessel.bands.length <= 2000);
    const geometry = vessel.geometry;
    const fields = 'radius_m bottom_head_depth_m cylinder_height_m top_head_depth_m total_height_m liquid_height_m heated_lower_m heated_upper_m';
    requireValid(keys(geometry, fields + (Object.hasOwn(geometry, 'profile_points_m') ? ' profile_points_m' : ''))
      && fields.split(' ').every(key => Number.isFinite(geometry[key])) && geometry.radius_m > 0
      && geometry.liquid_height_m > 0 && geometry.liquid_height_m < geometry.total_height_m);
    if (geometry.profile_points_m) requireValid(Array.isArray(geometry.profile_points_m)
      && geometry.profile_points_m.length >= 2 && geometry.profile_points_m.every(pair => finiteArray(pair, 2)));
    requireValid(vessel.bands.every(band => keys(band, 'lower_m upper_m radius_lower_m radius_upper_m')
      && Object.values(band).every(Number.isFinite) && band.upper_m > band.lower_m));
    requireValid(vessel.scenarios && Object.hasOwn(vessel.scenarios, 'controlled')
      && Object.keys(vessel.scenarios).every(mode => modes.includes(mode)));
    for (const entry of Object.values(vessel.scenarios)) {
      requireValid(keys(entry, 'path bytes sha256 json_bytes json_sha256 frames')
        && hash(entry.sha256) && hash(entry.json_sha256)
        && entry.path === `results/${entry.json_sha256}.json.gz`
        && ['bytes', 'json_bytes', 'frames'].every(key => Number.isSafeInteger(entry[key]) && entry[key] > 0)
        && entry.json_bytes <= 50_000_000 && entry.bytes <= 50_000_000 && entry.frames >= 2 && entry.frames <= 100000);
    }
  }
  requireValid(ids.has(catalog.default_vessel) && modes.includes(catalog.default_mode));
  return catalog;
}

export function validateScenario(payload, vessel, mode) {
  requireValid(keys(payload, 'schema_version vessel_id scenario_id scenario') && payload.schema_version === 1
    && payload.vessel_id === vessel.id && payload.scenario_id === mode);
  const scenario = payload.scenario;
  const hasProcess = mode !== 'controlled';
  requireValid(keys(scenario, 'times_s media_c element_c air_c wall_c power_w target_c hold_tolerance_c target_time_s settled_time_s ceiling_c initial_media_c room_c color_min_c color_max_c' + (hasProcess ? ' process' : '')));
  const size = vessel.scenarios[mode].frames;
  requireValid(finiteArray(scenario.times_s, size) && scenario.times_s[0] === 0
    && scenario.times_s.every((time, i) => i === 0 || time > scenario.times_s[i - 1]));
  for (const field of ['media_c', 'element_c', 'air_c', 'power_w']) requireValid(finiteArray(scenario[field], size));
  requireValid(Array.isArray(scenario.wall_c) && scenario.wall_c.length === size
    && scenario.wall_c.every(row => finiteArray(row, vessel.bands.length)));
  for (const field of ['target_c', 'hold_tolerance_c', 'ceiling_c', 'initial_media_c', 'room_c', 'color_min_c', 'color_max_c']) requireValid(Number.isFinite(scenario[field]));
  for (const field of ['target_time_s', 'settled_time_s']) requireValid(scenario[field] === null
    || Number.isFinite(scenario[field]) && scenario[field] >= 0 && scenario[field] <= scenario.times_s.at(-1));
  requireValid(scenario.color_max_c > scenario.color_min_c);
  if (hasProcess) {
    const process = scenario.process;
    const histories = 'volume_l liquid_height_m vcd_million_ml metabolic_heat_w flow_heat_w inlet_flow_l_day outlet_flow_l_day cumulative_feed_l cumulative_harvest_l';
    const scalars = 'inlet_temperature_c specific_heat_pw_cell maximum_error_c heater_energy_kwh cooler_energy_kwh';
    const texts = 'kind title description profile_source_title profile_source_url time_unit flow_model';
    requireValid(keys(process, `${histories} ${scalars} ${texts}`));
    for (const field of histories.split(' ')) requireValid(finiteArray(process[field], size));
    for (const field of scalars.split(' ')) requireValid(Number.isFinite(process[field]));
    for (const field of texts.split(' ')) requireValid(typeof process[field] === 'string' && process[field].length > 0);
    requireValid(process.kind === (mode === 'perfusion' ? 'perfusion' : 'fed_batch') && process.time_unit === 'days'
      && ['excluded', 'balanced', 'bolus'].includes(process.flow_model) && process.profile_source_url.startsWith('https://doi.org/'));
  }
  return scenario;
}

export async function loadBenchScenario(catalog, vesselId, mode, {signal, fetchResult = fetch} = {}) {
  signal?.throwIfAborted();
  if (!contexts.has(catalog)) {
    validateCatalog(catalog);
    deepFreeze(catalog);
    contexts.set(catalog, new ResultCache(4));
  }
  const vessel = catalog.vessels.find(item => item.id === vesselId);
  requireValid(vessel && modes.includes(mode) && Object.hasOwn(vessel.scenarios, mode));
  const entry = vessel.scenarios[mode], cache = contexts.get(catalog);
  const cached = cache.get(entry.json_sha256);
  if (cached) return cached;
  const payload = await loadJson(new URL(entry.path, import.meta.url), entry, {signal, fetchResult});
  const scenario = deepFreeze(validateScenario(payload, vessel, mode));
  signal?.throwIfAborted();
  cache.set(entry.json_sha256, scenario);
  return scenario;
}

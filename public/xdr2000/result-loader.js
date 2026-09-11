// Loads display data only. Each file is a separately calculated volume scenario.
const fields = [
  'geometry', 'bands', 'times_s', 'media_c', 'water_c', 'air_c', 'steel_c',
  'target_c', 'target_time_s', 'volume_l', 'inlet_c', 'flow_l_min', 'room_c',
  'color_min_c', 'color_max_c',
];
const geometryFields = [
  'radius_m', 'bottom_head_depth_m', 'cylinder_height_m', 'top_head_depth_m',
  'total_height_m', 'liquid_height_m', 'jacket_lower_height_m', 'jacket_upper_height_m',
];
const bandFields = ['lower_m', 'upper_m', 'radius_lower_m', 'radius_upper_m'];
const sameKeys = (value, keys) => value && typeof value === 'object' &&
  Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
const finiteArray = (value, length) => Array.isArray(value) && value.length === length && value.every(Number.isFinite);

export function validateResult(result, volume) {
  const invalid = () => { throw new Error('The saved result is incomplete or does not match this volume.'); };
  if (!Number.isInteger(volume) || volume < 400 || volume > 2000) invalid();
  if (!sameKeys(result, fields) || result.volume_l !== volume) invalid();
  const {geometry, bands, times_s: times, steel_c: steel} = result;
  if (!sameKeys(geometry, geometryFields) || !geometryFields.every(key => Number.isFinite(geometry[key]))) invalid();
  if (geometry.radius_m <= 0 || geometry.liquid_height_m <= 0 || geometry.liquid_height_m >= geometry.total_height_m) invalid();
  if (!Array.isArray(bands) || bands.length === 0 || bands.length > 2000) invalid();
  if (!bands.every((band, i) => sameKeys(band, bandFields) && bandFields.every(key => Number.isFinite(band[key])) &&
    band.upper_m > band.lower_m && band.radius_lower_m >= 0 && band.radius_upper_m >= 0 &&
    (i === 0 ? band.lower_m === 0 : Math.abs(band.lower_m - bands[i - 1].upper_m) < 1e-9))) invalid();
  if (Math.abs(bands.at(-1).upper_m - geometry.total_height_m) > 1e-9) invalid();
  if (!Array.isArray(times) || times.length < 2 || times.length > 100000 || times[0] !== 0 ||
    !times.every((time, i) => Number.isFinite(time) && (i === 0 || time > times[i - 1]))) invalid();
  for (const key of ['media_c', 'water_c', 'air_c']) if (!finiteArray(result[key], times.length)) invalid();
  if (!Array.isArray(steel) || steel.length !== times.length || !steel.every(row => finiteArray(row, bands.length))) invalid();
  for (const key of ['target_c', 'inlet_c', 'flow_l_min', 'room_c', 'color_min_c', 'color_max_c']) {
    if (!Number.isFinite(result[key])) invalid();
  }
  if (result.color_max_c <= result.color_min_c || result.flow_l_min < 0) invalid();
  if (result.target_time_s !== null && (!Number.isFinite(result.target_time_s) || result.target_time_s < 0 || result.target_time_s > times.at(-1))) invalid();
  return result;
}

export async function loadResult(root, volume, {signal, fetchResult = fetch} = {}) {
  if (!Number.isInteger(volume) || volume < 400 || volume > 2000) throw new Error('Choose a whole-liter volume from 400 to 2,000 L.');
  const response = await fetchResult(`${root}${volume}.json.gz`, {signal});
  if (!response.ok) throw new Error('The saved result could not be downloaded.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  let result;
  // Some hosts decode Content-Encoding automatically; accept either transport.
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    if (typeof DecompressionStream === 'undefined') throw new Error('Please use a current browser to load saved results.');
    const decoded = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    result = await new Response(decoded).json();
  } else {
    result = JSON.parse(new TextDecoder().decode(bytes));
  }
  return validateResult(result, volume);
}

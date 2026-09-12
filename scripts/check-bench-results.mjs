import assert from 'node:assert/strict';
import {readFileSync, readdirSync, realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const checksum = bytes => createHash('sha256').update(bytes).digest('hex');
const scenarios = ['controlled', 'fed_batch', 'perfusion'];
const volumes = {applikon3l: 2, ambr250: 0.2};
const keys = (value, expected, label) => {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `Invalid ${label}`);
  assert.deepEqual(Object.keys(value).sort(), expected.split(' ').sort(), `Unexpected fields in ${label}`);
};
const finite = (value, label) => assert.ok(typeof value === 'number' && Number.isFinite(value), `Nonfinite ${label}`);
const text = (value, label) => assert.ok(typeof value === 'string' && value.trim(), `Invalid ${label}`);
function series(values, count, label) {
  assert.ok(Array.isArray(values) && values.length === count, `Misaligned ${label}`);
  values.forEach(value => finite(value, label));
}

export function readBenchDisplay(html) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
    .filter(match => /(?:^|\s)id\s*=\s*(["'])model-data\1/i.test(match[1]));
  assert.equal(scripts.length, 1, 'Expected exactly one embedded model-data script');
  assert.match(scripts[0][1], /(?:^|\s)type\s*=\s*(["'])application\/json\1/i);
  return JSON.parse(scripts[0][2]);
}

export function validateBenchDisplay(data) {
  keys(data, 'schema_version default_vessel default_mode vessels', 'bench catalog');
  assert.equal(data.schema_version, 1);
  assert.ok(Array.isArray(data.vessels));
  assert.deepEqual(data.vessels.map(vessel => vessel.id).sort(), Object.keys(volumes).sort());
  assert.ok(Object.hasOwn(volumes, data.default_vessel));
  assert.ok(scenarios.includes(data.default_mode));
  for (const vessel of data.vessels) {
    keys(vessel, 'id title volume_l wall_material element_name geometry bands scenarios', 'vessel');
    assert.equal(vessel.volume_l, volumes[vessel.id], 'Unexpected default working volume');
    for (const field of ['title', 'wall_material', 'element_name']) text(vessel[field], field);
    const g = vessel.geometry;
    const geometryFields = 'radius_m bottom_head_depth_m cylinder_height_m top_head_depth_m total_height_m liquid_height_m heated_lower_m heated_upper_m';
    keys(g, geometryFields + (Object.hasOwn(g, 'profile_points_m') ? ' profile_points_m' : ''), 'display geometry');
    geometryFields.split(' ').forEach(field => finite(g[field], field));
    assert.ok(g.radius_m > 0 && g.total_height_m > 0);
    assert.ok(g.liquid_height_m > 0 && g.liquid_height_m < g.total_height_m);
    assert.ok(g.heated_lower_m >= 0 && g.heated_lower_m < g.heated_upper_m && g.heated_upper_m <= g.total_height_m);
    for (const field of ['bottom_head_depth_m', 'cylinder_height_m', 'top_head_depth_m']) assert.ok(g[field] >= 0);
    if (Object.hasOwn(g, 'profile_points_m')) {
      assert.ok(Array.isArray(g.profile_points_m) && g.profile_points_m.length >= 2);
      g.profile_points_m.forEach((point, index, points) => {
        series(point, 2, 'radius profile point');
        assert.ok(point[1] > 0 && point[1] <= g.radius_m + 1e-10);
        assert.ok(index === 0 ? point[0] === 0 : point[0] > points[index - 1][0]);
      });
      assert.ok(Math.abs(g.profile_points_m.at(-1)[0] - g.total_height_m) < 1e-10);
    }
    assert.ok(Array.isArray(vessel.bands) && vessel.bands.length > 0);
    let boundary = 0;
    for (const band of vessel.bands) {
      keys(band, 'lower_m upper_m radius_lower_m radius_upper_m', 'wall band');
      Object.values(band).forEach(value => finite(value, 'wall band'));
      assert.ok(Math.abs(band.lower_m - boundary) < 1e-10 && band.upper_m > band.lower_m);
      assert.ok(band.radius_lower_m >= 0 && band.radius_upper_m >= 0);
      assert.ok(Math.max(band.radius_lower_m, band.radius_upper_m) <= g.radius_m + 1e-10);
      boundary = band.upper_m;
    }
    assert.ok(Math.abs(boundary - g.total_height_m) < 1e-10);
    keys(vessel.scenarios, scenarios.join(' '), 'default scenarios');
    for (const [name, scenario] of Object.entries(vessel.scenarios)) {
      const culture = name === 'fed_batch' || name === 'perfusion';
      keys(scenario, 'times_s media_c element_c air_c wall_c power_w target_c hold_tolerance_c target_time_s settled_time_s ceiling_c initial_media_c room_c color_min_c color_max_c' + (culture ? ' process' : ''), 'scenario');
      const times = scenario.times_s;
      assert.ok(Array.isArray(times) && times.length >= 2);
      series(times, times.length, 'times');
      assert.equal(times[0], 0);
      assert.ok(times.every((time, index) => index === 0 || time > times[index - 1]), 'Nonmonotonic display times');
      for (const field of ['media_c', 'element_c', 'air_c', 'power_w']) series(scenario[field], times.length, field);
      assert.ok(Array.isArray(scenario.wall_c) && scenario.wall_c.length === times.length, 'Misaligned wall history');
      scenario.wall_c.forEach(row => series(row, vessel.bands.length, 'wall bands'));
      for (const field of ['target_c', 'hold_tolerance_c', 'ceiling_c', 'initial_media_c', 'room_c', 'color_min_c', 'color_max_c']) finite(scenario[field], field);
      assert.ok(scenario.color_min_c < scenario.color_max_c && scenario.hold_tolerance_c > 0);
      assert.equal(scenario.target_c, 36.5);
      for (const field of ['target_time_s', 'settled_time_s']) {
        if (scenario[field] !== null) {
          finite(scenario[field], field);
          assert.ok(scenario[field] >= 0 && scenario[field] <= times.at(-1));
        }
      }
      if (!culture) continue;
      const p = scenario.process;
      const historyFields = 'volume_l liquid_height_m vcd_million_ml metabolic_heat_w flow_heat_w inlet_flow_l_day outlet_flow_l_day cumulative_feed_l cumulative_harvest_l';
      const scalarFields = 'inlet_temperature_c specific_heat_pw_cell maximum_error_c heater_energy_kwh cooler_energy_kwh';
      const textFields = 'kind title description profile_source_title profile_source_url time_unit flow_model';
      keys(p, `${historyFields} ${scalarFields} ${textFields}`, 'culture process');
      textFields.split(' ').forEach(field => text(p[field], field));
      scalarFields.split(' ').forEach(field => {
        finite(p[field], field);
        if (field !== 'inlet_temperature_c') assert.ok(p[field] >= 0);
      });
      assert.equal(p.kind, name);
      assert.equal(p.time_unit, 'days');
      assert.equal(p.flow_model, 'excluded', 'Default culture replay must exclude stream heat');
      assert.equal(p.specific_heat_pw_cell, 20);
      assert.match(p.profile_source_url, /^https:\/\/doi\.org\/10\./);
      for (const field of historyFields.split(' ')) {
        series(p[field], times.length, field);
        assert.ok(p[field].every(value => value >= 0));
      }
      assert.ok(p.volume_l.every(volume => volume === vessel.volume_l), 'Default culture volume must remain fixed');
      assert.ok(p.liquid_height_m.every(height => Math.abs(height - g.liquid_height_m) <= 1e-8), 'Fixed-volume fill changed');
      for (const field of ['flow_heat_w', 'inlet_flow_l_day', 'outlet_flow_l_day', 'cumulative_feed_l', 'cumulative_harvest_l']) {
        assert.ok(p[field].every(value => value === 0), `Excluded flow contains nonzero ${field}`);
      }
      p.metabolic_heat_w.forEach((heat, index) => {
        const expected = p.vcd_million_ml[index] * p.volume_l[index] * p.specific_heat_pw_cell * 1e-3;
        assert.ok(Math.abs(heat - expected) <= 1e-8 + 1e-7 * Math.abs(expected), 'Cell heat disagrees with displayed density and volume');
      });
    }
  }
  return data;
}

function walk(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const location = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Unexpected symbolic link: ${location}`);
    return entry.isDirectory() ? walk(location) : [location];
  });
}

export function checkBenchResults(directory = 'public/bench-heating') {
  const root = realpathSync(path.resolve(directory));
  const actualFiles = walk(root).map(location => path.relative(root, location).split(path.sep).join('/'));
  const manifest = JSON.parse(readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  keys(manifest, 'schema_version playback temperature_rounding_c vessels files', 'bench manifest');
  assert.equal(manifest.schema_version, 1);
  assert.equal(manifest.temperature_rounding_c, 0.0001);
  text(manifest.playback, 'playback description');
  assert.ok(Array.isArray(manifest.files));
  const permitted = new Set(['index.html', 'README.md']);
  for (const vessel of Object.keys(volumes)) {
    for (const folder of ['', '/fed_batch', '/perfusion']) {
      for (const figure of ['vessel_3d', 'temperature_over_time']) {
        for (const format of ['png', 'svg']) permitted.add(`${vessel}${folder}/${figure}.${format}`);
      }
    }
  }
  let bytes = 0;
  for (const file of manifest.files) {
    keys(file, 'path bytes sha256', 'manifest file');
    assert.ok(permitted.has(file.path), `Unexpected or unsafe asset path: ${file.path}`);
    assert.ok(Number.isSafeInteger(file.bytes) && file.bytes > 0);
    assert.match(file.sha256, /^[a-f0-9]{64}$/);
    const location = realpathSync(path.resolve(root, file.path));
    assert.ok(location.startsWith(root + path.sep), 'An asset path escapes the bench directory');
    const buffer = readFileSync(location);
    assert.equal(buffer.length, file.bytes, `Size mismatch: ${file.path}`);
    assert.equal(checksum(buffer), file.sha256, `Checksum mismatch: ${file.path}`);
    bytes += buffer.length;
  }
  assert.deepEqual(manifest.files.map(file => file.path).sort(), [...permitted].sort(), 'Missing or duplicate manifest assets');
  assert.deepEqual(actualFiles.sort(), [...permitted, 'manifest.json'].sort(), 'Unlisted bench artifacts');
  const forbidden = /heating-solver-source|solver_config|physical_inputs|thermal_config|kp_scale|integral_time_scale|q_o2_pmol_cell_day|steel_conductivity_w_m_k|capacity_j_k|conductance_w_k|state_matrix|eigenvectors/;
  for (const relative of actualFiles.filter(file => /\.(?:html|svg|json|md)$/i.test(file))) {
    assert.ok(!forbidden.test(readFileSync(path.join(root, relative), 'utf8')), `Computational source or parameters found in ${relative}`);
  }
  const data = validateBenchDisplay(readBenchDisplay(readFileSync(path.join(root, 'index.html'), 'utf8')));
  assert.ok(Array.isArray(manifest.vessels));
  assert.deepEqual(manifest.vessels.map(vessel => vessel.id), data.vessels.map(vessel => vessel.id));
  for (const item of manifest.vessels) {
    keys(item, 'id volume_l band_count frames', 'manifest vessel');
    const vessel = data.vessels.find(value => value.id === item.id);
    assert.equal(item.volume_l, vessel.volume_l);
    assert.equal(item.band_count, vessel.bands.length);
    assert.deepEqual(item.frames, Object.fromEntries(Object.entries(vessel.scenarios).map(([name, scenario]) => [name, scenario.times_s.length])));
  }
  return {vessels: data.vessels.length, scenarios: scenarios.length * data.vessels.length, files: actualFiles.length, bytes};
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = checkBenchResults(process.argv[2]);
  console.log(`PASS: ${result.vessels} bench vessels, ${result.scenarios} scenarios, ${result.files} allowlisted assets, checksums, aligned frames, and fixed-volume culture replays (${(result.bytes / 1e6).toFixed(1)} MB).`);
}

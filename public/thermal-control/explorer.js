import { loadCatalog, loadScenario } from './loader.js';

const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const MODES = {
  heating_cooling: { label: 'Heating + cooling', color: '#305c82', dash: '' },
  heating_only: { label: 'Heating only', color: '#ae6039', dash: '7 4' },
};
const PRESETS = { gentle: [1, 5], baseline: [3, 3], aggressive: [5, 1] };
const state = {
  catalog: null, scenario: null, abort: null, revision: 0, timer: null,
  volume: 1000, p: 3, i: 3, view: 'full',
};
const fmt = (value, digits = 1) => Number(value).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
const MODES_TO_SHOW = ['heating_cooling', 'heating_only'];
const svgNode = (tag, attrs = {}, text) => {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
};
const htmlNode = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
function updateRange(input) {
  const percent = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100;
  input.style.setProperty('--progress', `${percent}%`);
}
function windowBounds() {
  const shiftStart = Math.max(0, state.catalog.conditions.setpoints[1].time_s - 3600);
  return [state.view === 'shift' ? shiftStart : 0, state.catalog.conditions.duration_s];
}
function setpointAt(seconds) {
  let value = state.catalog.conditions.setpoints[0].temperature_c;
  for (const item of state.catalog.conditions.setpoints) {
    if (item.time_s > seconds) break;
    value = item.temperature_c;
  }
  return value;
}
function selectionText() {
  const gains = state.scenario.gains;
  return `${fmt(state.volume, 0)} L · P ${fmt(gains.outer_kp, 2)} K/K · integral time ${fmt(gains.outer_ti_min)} min`;
}
function updateGainLabels() {
  if (!state.catalog) return;
  const baseline = state.catalog.baseline_gains_by_volume[String(state.volume)];
  const pScale = state.catalog.p_scales[state.p], iScale = state.catalog.i_scales[state.i];
  $('p-value').textContent = `${fmt(baseline.outer_kp * pScale, 2)} K/K`;
  $('i-value').textContent = `${fmt(baseline.outer_ti_min * iScale)} min`;
  $('p-gain').setAttribute('aria-valuetext', `${fmt(baseline.outer_kp * pScale, 2)} kelvin per kelvin, ${pScale} times baseline`);
  $('i-gain').setAttribute('aria-valuetext', `${fmt(baseline.outer_ti_min * iScale)} minutes, ${iScale} times baseline; lower means stronger integral action`);
  for (const input of [$('p-gain'), $('i-gain')]) updateRange(input);
  for (const button of document.querySelectorAll('[data-preset]')) {
    const [p, i] = PRESETS[button.dataset.preset];
    button.setAttribute('aria-pressed', String(p === state.p && i === state.i));
  }
}
function markPending(message) {
  $('results').hidden = true;
  $('results').setAttribute('aria-busy', 'true');
  $('explorer').dataset.ready = 'false';
  delete $('explorer').dataset.scenarioKey;
  $('status').textContent = message;
  $('status').parentElement.dataset.error = 'false';
  $('retry').hidden = true;
}
function reportError() {
  $('status').textContent = 'This response could not be loaded. Check your connection and try again.';
  $('status').parentElement.dataset.error = 'true';
  $('retry').hidden = false;
  $('results').setAttribute('aria-busy', 'false');
}
function scheduleLoad() {
  updateGainLabels();
  clearTimeout(state.timer);
  state.abort?.abort();
  state.revision += 1;
  markPending('Loading the selected controller response…');
  state.timer = setTimeout(fetchSelection, 300);
}
async function fetchSelection() {
  clearTimeout(state.timer);
  const revision = ++state.revision;
  state.abort?.abort();
  const abort = new AbortController();
  state.abort = abort;
  markPending('Loading the selected controller response…');
  try {
    const scenario = await loadScenario(state.catalog, { volume_l: state.volume, p_index: state.p, i_index: state.i }, { signal: abort.signal });
    if (revision !== state.revision || abort.signal.aborted) return;
    state.scenario = scenario;
    $('results').hidden = false;
    $('results').setAttribute('aria-busy', 'false');
    $('explorer').dataset.ready = 'true';
    $('explorer').dataset.scenarioKey = scenario.key;
    $('status').textContent = `${selectionText()} · outer culture controller`;
    renderAll();
  } catch (error) {
    if (revision !== state.revision || abort.signal.aborted || error.name === 'AbortError') return;
    reportError();
  }
}
function lineKey(color, dash) {
  const key = htmlNode('span', `line-key${dash ? ' dashed' : ''}`);
  key.style.borderColor = color;
  key.setAttribute('aria-hidden', 'true');
  return key;
}
function renderLegend() {
  $('legend').replaceChildren();
  const items = MODES_TO_SHOW.map(mode => MODES[mode]);
  items.push({ label: 'Culture setpoint', color: '#8b9892', dash: '4 4' });
  for (const item of items) {
    const label = htmlNode('span', 'legend-item');
    label.append(lineKey(item.color, item.dash), document.createTextNode(item.label));
    $('legend').append(label);
  }
}
function chartSeries(kind) {
  return MODES_TO_SHOW.map(mode => ({ ...MODES[mode], values: state.scenario.responses[mode][kind === 'jacket' ? 'jacket_c' : 'culture_c'], mode }));
}
function errorAxis(series, start, end) {
  let minimum = -0.2, maximum = 0.2;
  for (const item of series) {
    for (let index = 0; index < state.scenario.times_s.length; index++) {
      const seconds = state.scenario.times_s[index];
      if (seconds < start || seconds > end) continue;
      const error = item.values[index] - setpointAt(seconds);
      minimum = Math.min(minimum, error);
      maximum = Math.max(maximum, error);
      // Include the left side of each instantaneous setpoint change as drawn.
      if (seconds > start && index > 0) {
        const beforeStep = item.values[index] - setpointAt(state.scenario.times_s[index - 1]);
        minimum = Math.min(minimum, beforeStep);
        maximum = Math.max(maximum, beforeStep);
      }
    }
  }
  const padding = Math.max(0.1, (maximum - minimum) * 0.06);
  const rawStep = (maximum - minimum + padding * 2) / 5;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 2.5, 5, 10].find(value => value * magnitude >= rawStep) * magnitude;
  const low = Math.floor((minimum - padding) / step) * step;
  const high = Math.ceil((maximum + padding) / step) * step;
  const ticks = Array.from({ length: Math.round((high - low) / step) + 1 }, (_, index) => low + index * step);
  return { low, high, ticks, digits: Number.isInteger(step) ? 0 : Math.min(3, Math.max(0, -Math.floor(Math.log10(step))) + 1) };
}
function buildPlot(id, kind) {
  const svg = $(id);
  const width = Math.max(260, svg.getBoundingClientRect().width), height = svg.getBoundingClientRect().height;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.querySelectorAll(':scope > :not(title):not(desc)').forEach(node => node.remove());
  const plot = { left: 38, right: width - 13, top: 23, bottom: height - 31 };
  const [start, end] = windowBounds();
  const series = chartSeries(kind);
  let low, high, ticks, digits = 0;
  if (kind === 'error') ({ low, high, ticks, digits } = errorAxis(series, start, end));
  else {
    const values = series.flatMap(item => item.values.filter((_, i) => state.scenario.times_s[i] >= start));
    if (kind === 'temperature') values.push(...state.catalog.conditions.setpoints.map(item => item.temperature_c));
    if (state.view === 'full') { low = 0; high = Math.max(42, Math.ceil(Math.max(...values) / 5) * 5); ticks = [0, 10, 20, 30, 40]; }
    else {
      low = Math.floor(Math.min(...values) - .5); high = Math.ceil(Math.max(...values) + .5);
      const step = high - low <= 7 ? 1 : high - low <= 15 ? 2 : 5;
      ticks = [];
      for (let tick = Math.ceil(low / step) * step; tick <= high; tick += step) ticks.push(tick);
    }
  }
  const x = seconds => plot.left + (seconds - start) / (end - start) * (plot.right - plot.left);
  const y = value => plot.bottom - (value - low) / (high - low) * (plot.bottom - plot.top);
  const add = (tag, attrs, text) => { const node = svgNode(tag, attrs, text); svg.append(node); return node; };
  const defs = add('defs'), clip = svgNode('clipPath', { id: `${id}-clip` });
  clip.append(svgNode('rect', { x: plot.left, y: plot.top, width: plot.right - plot.left, height: plot.bottom - plot.top })); defs.append(clip);
  if (kind === 'error') add('rect', { x: plot.left, y: y(.2), width: plot.right - plot.left, height: y(-.2) - y(.2), fill: '#eaf3ee' });
  for (const tick of ticks) {
    add('line', { x1: plot.left, x2: plot.right, y1: y(tick), y2: y(tick), stroke: tick === 0 && kind !== 'temperature' ? '#ccd6ce' : '#e9eeea', 'stroke-width': 1 });
    add('text', { x: plot.left - 8, y: y(tick) + 3, 'text-anchor': 'end' }, fmt(tick, digits));
  }
  add('text', { x: plot.left, y: 13, class: 'axis-unit' }, '°C');
  const hourStep = width < 450 ? 8 : 4;
  if ((start / 3600) % hourStep !== 0) {
    add('text', { x: plot.left, y: plot.bottom + 17, 'text-anchor': 'middle' }, `${start / 3600}`);
  }
  for (let hour = Math.ceil(start / 3600 / hourStep) * hourStep; hour <= end / 3600; hour += hourStep) {
    if (hour * 3600 !== start && x(hour * 3600) - plot.left < 28) continue;
    add('text', { x: x(hour * 3600), y: plot.bottom + 17, 'text-anchor': 'middle' }, `${hour}`);
  }
  add('text', { x: plot.right, y: height - 3, 'text-anchor': 'end', class: 'axis-unit' }, 'Elapsed time (h)');
  const shift = state.catalog.conditions.setpoints[1].time_s;
  if (shift > start && shift < end) add('line', { x1: x(shift), x2: x(shift), y1: plot.top, y2: plot.bottom, stroke: '#cdd7d0', 'stroke-dasharray': '3 5' });
  if (state.view === 'shift') add('text', { x: x(shift) + 6, y: 13, class: 'axis-unit' }, `Setpoint change · ${shift / 3600} h`);
  const group = add('g', { 'clip-path': `url(#${id}-clip)` });
  if (kind === 'temperature') {
    let path = `M${x(start)},${y(setpointAt(start))}`;
    for (const item of state.catalog.conditions.setpoints) if (item.time_s > start && item.time_s <= end) path += `H${x(item.time_s)}V${y(item.temperature_c)}`;
    path += `H${x(end)}`;
    group.append(svgNode('path', { d: path, fill: 'none', stroke: '#8b9892', 'stroke-width': 1.3, 'stroke-dasharray': '4 4' }));
  }
  for (const item of series) {
    let path = '';
    for (let index = 0; index < state.scenario.times_s.length; index++) {
      const seconds = state.scenario.times_s[index];
      if (seconds < start || seconds > end) continue;
      const reference = kind === 'error' ? setpointAt(seconds) : 0;
      if (kind === 'error' && path && index > 0) {
        const previousReference = setpointAt(state.scenario.times_s[index - 1]);
        if (reference !== previousReference) path += `L${x(seconds).toFixed(2)},${y(item.values[index] - previousReference).toFixed(2)} `;
      }
      const value = item.values[index] - reference;
      path += `${path ? 'L' : 'M'}${x(seconds).toFixed(2)},${y(value).toFixed(2)} `;
    }
    group.append(svgNode('path', { class: 'trace', d: path, stroke: item.color, 'stroke-dasharray': item.dash, 'data-mode': item.mode }));
  }
  window.ModelFigureWatermark.svg(svg, plot);
}
function renderPlots() {
  if (!state.scenario || $('results').hidden) return;
  buildPlot('temperature-chart', 'temperature');
  buildPlot('jacket-chart', 'jacket');
  buildPlot('error-chart', 'error');
}
function renderAll() {
  $('view-full').setAttribute('aria-pressed', String(state.view === 'full'));
  $('view-shift').setAttribute('aria-pressed', String(state.view === 'shift'));
  const chartDescription = `${selectionText()}. Heating and cooling is blue and solid; heating only is orange and dashed. ${state.view === 'full' ? 'Full run from zero to 36 hours.' : 'Temperature shift view from 15 to 36 hours, including one hour before the setpoint changes at 16 hours.'}`;
  $('temperature-description').textContent = `Culture temperatures and culture setpoint. ${chartDescription}`;
  $('jacket-description').textContent = `Mixed jacket water temperatures. ${chartDescription}`;
  $('error-description').textContent = `Culture temperature minus setpoint; the full error range is displayed. The shaded band marks plus or minus 0.2 degrees Celsius. ${chartDescription}`;
  renderLegend(); renderPlots();
}

$('volume').addEventListener('change', event => { state.volume = Number(event.target.value); scheduleLoad(); });
$('p-gain').addEventListener('input', event => { state.p = Number(event.target.value); scheduleLoad(); });
$('i-gain').addEventListener('input', event => { state.i = Number(event.target.value); scheduleLoad(); });
for (const button of document.querySelectorAll('[data-preset]')) button.addEventListener('click', () => {
  [state.p, state.i] = PRESETS[button.dataset.preset]; $('p-gain').value = state.p; $('i-gain').value = state.i; scheduleLoad();
});
$('reset').addEventListener('click', () => { [state.p, state.i] = PRESETS.baseline; $('p-gain').value = state.p; $('i-gain').value = state.i; scheduleLoad(); });
for (const view of ['full', 'shift']) $(`view-${view}`).addEventListener('click', () => { state.view = view; renderAll(); });
$('retry').addEventListener('click', () => state.catalog ? fetchSelection() : initialize());
let resizeFrame;
new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(renderPlots); }).observe($('results'));

async function initialize() {
  markPending('Loading the response library…');
  try {
    state.catalog = await loadCatalog('./catalog.json');
    state.volume = state.catalog.defaults.volume_l; state.p = state.catalog.defaults.p_index; state.i = state.catalog.defaults.i_index;
    $('volume').value = String(state.volume); $('p-gain').value = state.p; $('i-gain').value = state.i;
    for (const control of document.querySelectorAll('.control-card [disabled]')) control.disabled = false;
    updateGainLabels();
    await fetchSelection();
  } catch { reportError(); }
}
initialize();

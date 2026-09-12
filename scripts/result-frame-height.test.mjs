import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {transformSync} from 'esbuild';

const layout = readFileSync(new URL('../src/layouts/BaseDetail.astro', import.meta.url), 'utf8');
const source = layout.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(source, 'BaseDetail includes the iframe sizing script');
const {code} = transformSync(source, {loader: 'ts', format: 'iife'});

function frameFixture(height, loaded = true) {
  const main = {height, getBoundingClientRect() { return {height: this.height}; }};
  const innerDocument = {body: {}, querySelector: selector => selector === 'main' ? main : null};
  const frame = Object.assign(new EventTarget(), {
    src: 'http://localhost:4321/bench-heating/index.html', dataset: {}, style: {},
    contentDocument: loaded ? innerDocument : null,
    contentWindow: {getComputedStyle: () => ({paddingTop: '0px', paddingBottom: '0px'})},
  });
  return {frame, main, load() { frame.contentDocument = innerDocument; frame.dispatchEvent(new Event('load')); }};
}

function boot(frames, readyState = 'complete') {
  const document = Object.assign(new EventTarget(), {
    frames, readyState, querySelectorAll() { return this.frames; },
  });
  const observers = [];
  class ResizeObserver {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  runInNewContext(code, {document, window: {location: {origin: 'http://localhost:4321'}}, URL, ResizeObserver});
  return {document, observers, dispatch: name => document.dispatchEvent(new Event(name))};
}

test('direct page load sizes both result frames without an Astro event and tracks inner resize', () => {
  const thermal = frameFixture(1800);
  const bench = frameFixture(3112.47);
  const app = boot([thermal.frame, bench.frame]);
  assert.equal(thermal.frame.dataset.connected, 'true');
  assert.equal(thermal.frame.style.height, '1802px');
  assert.equal(bench.frame.style.height, '3115px');
  assert.equal(app.observers.length, 2);
  bench.main.height = 1650.2;
  app.observers[1].callback();
  assert.equal(bench.frame.style.height, '1653px');
  app.dispatch('astro:page-load');
  assert.equal(app.observers.length, 2, 'duplicate lifecycle events do not attach duplicate observers');
});

test('DOM readiness and a later lazy iframe load both attach sizing', () => {
  const bench = frameFixture(3112.47, false);
  const app = boot([], 'loading');
  app.document.frames = [bench.frame];
  app.dispatch('DOMContentLoaded');
  assert.equal(bench.frame.dataset.connected, 'true');
  assert.equal(app.observers.length, 0);
  bench.load();
  assert.equal(bench.frame.style.height, '3115px');
  assert.equal(app.observers.length, 1);
});

test('Astro navigation disconnects old observers and can reconnect an existing frame', () => {
  const bench = frameFixture(1600);
  const app = boot([bench.frame]);
  const firstObserver = app.observers[0];
  app.dispatch('astro:before-swap');
  assert.equal(firstObserver.disconnected, true);
  assert.equal(bench.frame.dataset.connected, undefined);
  bench.load();
  assert.equal(app.observers.length, 1, 'the previous load listener is removed on navigation');
  bench.main.height = 3112.47;
  app.dispatch('astro:page-load');
  assert.equal(bench.frame.style.height, '3115px');
  assert.equal(bench.frame.dataset.connected, 'true');
  assert.equal(app.observers.length, 2);
  assert.equal(app.observers[1].disconnected, false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { loadResult, validateResult } from '../public/xdr2000/result-loader.js';

const root = new URL('../public/xdr2000/results/80fe850c4a34/', import.meta.url);
const read = volume => readFileSync(new URL(`${volume}.json.gz`, root));
const result = JSON.parse(gunzipSync(read(1000)));

test('loads exact endpoint and neighboring volumes from compressed responses', async () => {
  for (const volume of [400, 401, 999, 1000, 1001, 1999, 2000]) {
    let requested;
    const loaded = await loadResult('./results/version/', volume, {fetchResult: async url => {
      requested = url;
      return new Response(read(volume));
    }});
    assert.equal(requested, `./results/version/${volume}.json.gz`);
    assert.equal(loaded.volume_l, volume);
    assert.equal(loaded.times_s.at(-1), 28800);
  }
});

test('accepts a response automatically decompressed by the host', async () => {
  const loaded = await loadResult('./', 1000, {fetchResult: async () => new Response(gunzipSync(read(1000)))});
  assert.deepEqual(loaded, result);
});

test('rejects invalid input without requesting a file', async () => {
  for (const volume of [399, 2001, 500.5, NaN, '1000']) {
    await assert.rejects(loadResult('./', volume, {fetchResult: () => assert.fail('must not fetch')}), /whole-liter/);
  }
});

test('rejects missing, damaged, and wrong-volume downloads', async () => {
  await assert.rejects(loadResult('./', 1000, {fetchResult: async () => new Response('missing', {status:404})}), /downloaded/);
  await assert.rejects(loadResult('./', 1000, {fetchResult: async () => new Response('invalid JSON')}));
  await assert.rejects(loadResult('./', 1001, {fetchResult: async () => new Response(read(1000))}), /match this volume/);
});

test('rejects mismatched mesh histories, invalid times, and extra internal fields', () => {
  const incomplete = structuredClone(result);
  incomplete.steel_c[0].pop();
  assert.throws(() => validateResult(incomplete, 1000));
  const unordered = {...result, times_s:[...result.times_s]};
  unordered.times_s[1] = 0;
  assert.throws(() => validateResult(unordered, 1000));
  assert.throws(() => validateResult({...result, private_configuration:{}}, 1000));
  assert.throws(() => validateResult({...result, target_time_s:Infinity}, 1000));
});

test('passes cancellation to the fetch request', async () => {
  const signal = AbortSignal.abort();
  await assert.rejects(loadResult('./', 1000, {signal, fetchResult: async (_url, options) => {
    assert.equal(options.signal, signal);
    options.signal.throwIfAborted();
  }}), {name:'AbortError'});
});

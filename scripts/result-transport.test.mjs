import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {download, loadJson, ResultCache} from '../public/result-transport.js';

const hash = value => createHash('sha256').update(value).digest('hex');
test('bounds streamed downloads even without Content-Length', async () => {
  let canceled = false;
  const body = new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(8)); },
    cancel() { canceled = true; },
  });
  await assert.rejects(download('./response', {fetchResult: async () => new Response(body)}, 10), /size/);
  assert.equal(canceled, true);
});

test('bounds expanded gzip before parsing and verifies uncompressed payloads', async () => {
  const json = Buffer.from(JSON.stringify({values: 'x'.repeat(10000)}));
  const compressed = gzipSync(json);
  const entry = {bytes: compressed.length, sha256: hash(compressed), json_bytes: 100, json_sha256: hash(json)};
  await assert.rejects(loadJson('./response', entry, {fetchResult: async () => new Response(compressed)}), /size/);
  const plain = {bytes: json.length, sha256: hash(json), json_bytes: json.length, json_sha256: hash(json)};
  assert.deepEqual(await loadJson('./response', plain, {fetchResult: async () => new Response(json)}), JSON.parse(json));
});

test('cancellation prevents results from reaching a caller after download', async () => {
  const controller = new AbortController();
  await assert.rejects(download('./response', {signal: controller.signal, fetchResult: async () => {
    controller.abort();
    return new Response('{}');
  }}), {name: 'AbortError'});
});

test('cache evicts least recently used values', () => {
  const cache = new ResultCache(2);
  cache.set('a', 1); cache.set('b', 2); cache.get('a'); cache.set('c', 3);
  assert.equal(cache.get('b'), undefined);
  assert.equal(cache.get('a'), 1);
});

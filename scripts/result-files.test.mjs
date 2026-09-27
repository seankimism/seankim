import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync, mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import os from 'node:os';
import path from 'node:path';
import {assertInventory, checksum, decodeVerifiedGzip, readVerifiedFile, resolveInside, walkFiles} from './result-files.mjs';

function fixture(t) {
  const temporary = realpathSync(os.tmpdir());
  const directory = mkdtempSync(path.join(temporary, 'result-files-test-'));
  assert.equal(path.dirname(realpathSync(directory)), temporary);
  t.after(() => rmSync(directory, {recursive: true, force: true}));
  const root = path.join(directory, 'results');
  mkdirSync(root);
  const decoded = Buffer.from('{"values":[1,2,3]}');
  const compressed = gzipSync(decoded);
  writeFileSync(path.join(root, 'one.json.gz'), compressed);
  return {directory, root, decoded, compressed, file: {path: 'one.json.gz', bytes: compressed.length, sha256: checksum(compressed), json_bytes: decoded.length, json_sha256: checksum(decoded)}};
}

test('shared file checks validate inventories and compressed and decoded content', t => {
  const f = fixture(t);
  assert.deepEqual(readVerifiedFile(f.root, f.file), f.compressed);
  assert.deepEqual(decodeVerifiedGzip(f.compressed, f.file), f.decoded);
  assert.deepEqual(assertInventory(f.root, ['one.json.gz']), ['one.json.gz']);
  assert.throws(() => readVerifiedFile(f.root, {...f.file, sha256: '0'.repeat(64)}), /Checksum mismatch/);
  assert.throws(() => decodeVerifiedGzip(f.compressed, {...f.file, json_sha256: '0'.repeat(64)}), /Checksum mismatch/);
  assert.throws(() => decodeVerifiedGzip(f.compressed, {...f.file, json_bytes: 1}));
  assert.throws(() => assertInventory(f.root, []), /Missing or unlisted/);
  assert.throws(() => assertInventory(f.root, ['one.json.gz', 'one.json.gz']), /Duplicate expected/);
});

test('paths cannot escape their result root and tree walks reject links', t => {
  const f = fixture(t);
  writeFileSync(path.join(f.directory, 'outside.json'), '{}');
  assert.throws(() => resolveInside(f.root, '../outside.json'), /escapes result directory/);
  assert.throws(() => resolveInside(f.root, path.join(f.directory, 'outside.json')), /Invalid relative/);
  const external = path.join(f.directory, 'external');
  mkdirSync(external);
  writeFileSync(path.join(external, 'payload.json'), '{}');
  symlinkSync(external, path.join(f.root, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => walkFiles(f.root), /Unexpected symbolic link/);
  assert.throws(() => resolveInside(f.root, 'linked/payload.json'), /escapes result directory/);
});

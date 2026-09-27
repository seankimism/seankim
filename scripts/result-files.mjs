import assert from 'node:assert/strict';
import {readFileSync, readdirSync, realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import path from 'node:path';

export const checksum = bytes => createHash('sha256').update(bytes).digest('hex');

export function walkFiles(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const location = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Unexpected symbolic link: ${location}`);
    assert.ok(entry.isDirectory() || entry.isFile(), `Unexpected filesystem entry: ${location}`);
    return entry.isDirectory() ? walkFiles(location) : [location];
  });
}

export function resolveInside(directory, relative) {
  assert.ok(typeof relative === 'string' && relative && !path.isAbsolute(relative), `Invalid relative asset path: ${relative}`);
  const root = realpathSync(directory);
  const location = realpathSync(path.resolve(root, relative));
  const resolved = path.relative(root, location);
  assert.ok(resolved && resolved !== '..' && !resolved.startsWith(`..${path.sep}`) && !path.isAbsolute(resolved), `Asset path escapes result directory: ${relative}`);
  return location;
}

function verifyBytes(bytes, expectedBytes, expectedHash, label) {
  assert.ok(Number.isSafeInteger(expectedBytes) && expectedBytes > 0, `Invalid byte count: ${label}`);
  assert.match(expectedHash, /^[a-f0-9]{64}$/, `Invalid checksum: ${label}`);
  assert.equal(bytes.length, expectedBytes, `Size mismatch: ${label}`);
  assert.equal(checksum(bytes), expectedHash, `Checksum mismatch: ${label}`);
}

export function readVerifiedFile(root, file, label = file.path) {
  const bytes = readFileSync(resolveInside(root, file.path));
  verifyBytes(bytes, file.bytes, file.sha256, label);
  return bytes;
}

export function decodeVerifiedGzip(bytes, file, label = file.path) {
  assert.ok(Number.isSafeInteger(file.json_bytes) && file.json_bytes > 0, `Invalid decoded byte count: ${label}`);
  const decoded = gunzipSync(bytes, {maxOutputLength: file.json_bytes});
  verifyBytes(decoded, file.json_bytes, file.json_sha256, `decoded ${label}`);
  return decoded;
}

export function assertInventory(root, expected) {
  assert.equal(new Set(expected).size, expected.length, 'Duplicate expected assets');
  const actual = walkFiles(root).map(location => path.relative(root, location).split(path.sep).join('/'));
  assert.deepEqual(actual.sort(), [...expected].sort(), 'Missing or unlisted result artifacts');
  return actual;
}

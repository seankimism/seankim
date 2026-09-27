// Shared download transport for saved display results; contains no model equations.
const requireValid = (condition, message) => { if (!condition) throw new Error(message); };

async function readBounded(reader, limit, signal) {
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      signal?.throwIfAborted();
      const {done, value} = await reader.read();
      if (done) break;
      length += value.length;
      requireValid(length <= limit, 'The saved response exceeds its expected size.');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

export async function download(url, {signal, fetchResult = fetch} = {}, limit = 1_000_000) {
  signal?.throwIfAborted();
  const address = String(url);
  const response = await fetchResult(address, {signal, credentials: 'same-origin'});
  requireValid(response.ok, 'The saved result could not be downloaded. Please try again.');
  const absolute = new URL(address, globalThis.document?.baseURI ?? globalThis.location?.href ?? 'http://localhost/').href;
  requireValid(!response.url || response.url === absolute, 'The result download was redirected unexpectedly.');
  const length = Number(response.headers.get('content-length'));
  requireValid(!Number.isFinite(length) || length <= limit, 'The result download is larger than expected.');
  const bytes = response.body ? await readBounded(response.body.getReader(), limit, signal)
    : new Uint8Array(await response.arrayBuffer());
  signal?.throwIfAborted();
  requireValid(bytes.length <= limit, 'The result download is larger than expected.');
  return bytes;
}

export async function verifyBytes(bytes, length, checksum) {
  requireValid(bytes.length === length, 'The saved response has an unexpected size.');
  requireValid(globalThis.crypto?.subtle, 'Open this page over HTTPS to check the saved responses.');
  const digest = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes));
  requireValid(Array.from(digest, value => value.toString(16).padStart(2, '0')).join('') === checksum,
    'The saved response failed its integrity check.');
}

export async function unpack(bytes, limit, signal) {
  requireValid(typeof DecompressionStream !== 'undefined', 'Please use a current browser to view the saved responses.');
  return readBounded(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader(), limit, signal);
}

export async function loadJson(url, entry, options = {}) {
  for (const field of ['bytes', 'json_bytes']) {
    requireValid(Number.isSafeInteger(entry[field]) && entry[field] > 0 && entry[field] <= 50_000_000,
      'The saved response has an invalid size limit.');
  }
  for (const field of ['sha256', 'json_sha256']) requireValid(/^[a-f0-9]{64}$/.test(entry[field]), 'Invalid result checksum.');
  let bytes = await download(url, options, Math.max(entry.bytes, entry.json_bytes));
  // Hosts may return the stored gzip or decode it through Content-Encoding.
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    await verifyBytes(bytes, entry.bytes, entry.sha256);
    bytes = await unpack(bytes, entry.json_bytes, options.signal);
  }
  await verifyBytes(bytes, entry.json_bytes, entry.json_sha256);
  options.signal?.throwIfAborted();
  return JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
}

export function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
}

export class ResultCache {
  constructor(limit = 8) { this.limit = limit; this.values = new Map(); }
  get(key) {
    if (!this.values.has(key)) return undefined;
    const value = this.values.get(key);
    this.values.delete(key);
    this.values.set(key, value);
    return value;
  }
  set(key, value) {
    this.values.delete(key);
    this.values.set(key, value);
    if (this.values.size > this.limit) this.values.delete(this.values.keys().next().value);
    return value;
  }
}

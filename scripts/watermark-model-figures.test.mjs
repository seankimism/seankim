import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import { VERSION, isModelFigure, watermarkSvg, watermarkPng, watermarkFigures } from './watermark-model-figures.mjs';

test('only original modeling figures are included', () => {
  assert.equal(isModelFigure('mixing/parity.svg'), true);
  assert.equal(isModelFigure('xdr2000/bench/temperature.png'), true);
  for (const file of ['cornell/paper.png', 'images/sean-kim.jpg', 'favicon.svg',
    'agitation-thermal/controlled/posters/ambr250.png', 'xdr2000/results/scenario.json']) {
    assert.equal(isModelFigure(file), false, file);
  }
});

test('unexpected exported HTML or data fails before watermark updates can rehash it', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'model-export-integrity-'));
  try {
    const directory = path.join(root, 'public/agitation-thermal');
    await mkdir(path.join(directory, 'figures'), {recursive: true});
    const entry = bytes => ({bytes: Buffer.byteLength(bytes), sha256: createHash('sha256').update(bytes).digest('hex')});
    const manifest = {artifacts: {'index.html': entry('original'), 'figures/plot.svg': entry(figure)}};
    await writeFile(path.join(directory, 'index.html'), 'changed!');
    await writeFile(path.join(directory, 'figures/plot.svg'), figure);
    await writeFile(path.join(directory, 'manifest.json'), JSON.stringify(manifest));
    await assert.rejects(watermarkFigures({root}), /Export integrity mismatch/);
    assert.equal(await readFile(path.join(directory, 'figures/plot.svg'), 'utf8'), figure);
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, 'manifest.json'))), manifest);
    await writeFile(path.join(directory, 'index.html'), 'original');
    await watermarkFigures({root});
    const updated = JSON.parse(await readFile(path.join(directory, 'manifest.json')));
    assert.deepEqual(updated.artifacts['index.html'], manifest.artifacts['index.html']);
    assert.equal(updated.artifacts['figures/plot.svg'].source_sha256, manifest.artifacts['figures/plot.svg'].sha256);
    await watermarkFigures({root, check: true});
  } finally { await rm(root, {recursive: true, force: true}); }
});

const figure = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="white"/><path d="M20 280L350 20" stroke="red"/></svg>';
test('SVG watermark preserves plot geometry and is not duplicated', () => {
  const marked = watermarkSvg(figure);
  assert.ok(marked.includes('d="M20 280L350 20"'));
  assert.ok(marked.includes('pointer-events="none"'));
  assert.equal(watermarkSvg(marked), marked);
  assert.equal(watermarkSvg(figure.replace('<path', '\r\n<path')), watermarkSvg(figure.replace('<path', '\n<path')));
  assert.throws(() => watermarkSvg('<svg></svg>'), /viewBox/);
});

test('a watermark style update records the restored original rather than the previous marked figure', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'model-watermark-style-'));
  try {
    const directory = path.join(root, 'public/agitation-thermal');
    const backup = path.join(root, 'output/figure-originals');
    await mkdir(path.join(directory, 'figures'), {recursive: true});
    await mkdir(backup, {recursive: true});
    const hash = bytes => createHash('sha256').update(bytes).digest('hex');
    const marked = watermarkSvg(figure);
    const originalHash = hash(figure);
    const previous = {bytes: Buffer.byteLength(marked), sha256: hash(marked)};
    await writeFile(path.join(directory, 'figures/plot.svg'), marked);
    await writeFile(path.join(backup, `${originalHash}.svg`), figure);
    await writeFile(path.join(directory, 'manifest.json'), JSON.stringify({artifacts: {'figures/plot.svg': previous}}));
    await writeFile(path.join(root, 'public/figure-watermarks.json'), JSON.stringify({version: 'previous-style', files: {
      'agitation-thermal/figures/plot.svg': {...previous, source_sha256: originalHash},
    }}));
    await watermarkFigures({root});
    const updated = JSON.parse(await readFile(path.join(directory, 'manifest.json'))).artifacts['figures/plot.svg'];
    assert.equal(updated.source_bytes, Buffer.byteLength(figure));
    assert.equal(updated.source_sha256, originalHash);
    assert.notEqual(updated.source_sha256, previous.sha256);
    const manifest = JSON.parse(await readFile(path.join(root, 'public/figure-watermarks.json')));
    assert.equal(manifest.attribution, 'Sean Kim · seankimism.github.io/seankim');
    await watermarkFigures({root, check: true});
  } finally { await rm(root, {recursive: true, force: true}); }
});

test('PNG attribution persists in the downloaded pixels without changing dimensions', async () => {
  const original = await sharp(Buffer.from(figure)).png().toBuffer();
  const marked = await watermarkPng(original);
  const a = await sharp(original).metadata();
  const b = await sharp(marked).metadata();
  assert.deepEqual([b.width, b.height], [a.width, a.height]);
  assert.ok(b.xmp.toString().includes(VERSION));
  assert.notDeepEqual(await sharp(marked).raw().toBuffer(), await sharp(original).raw().toBuffer());
  assert.deepEqual(await watermarkPng(marked), marked);
});

test('export preserves private originals, updates checksums and survives repeated builds', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'model-figure-watermark-'));
  try {
    await mkdir(path.join(root, 'public/mixing'), { recursive: true });
    await mkdir(path.join(root, 'public/cornell'), { recursive: true });
    await writeFile(path.join(root, 'public/mixing/parity.svg'), figure);
    await writeFile(path.join(root, 'public/cornell/paper.svg'), figure);
    assert.deepEqual(await watermarkFigures({ root }), { figures: 1, changed: 1 });
    const manifest = JSON.parse(await readFile(path.join(root, 'public/figure-watermarks.json'), 'utf8'));
    const original = path.join(root, 'output/figure-originals', manifest.files['mixing/parity.svg'].source_sha256 + '.svg');
    assert.equal(await readFile(original, 'utf8'), figure);
    assert.equal(await readFile(path.join(root, 'public/cornell/paper.svg'), 'utf8'), figure);
    assert.deepEqual(await watermarkFigures({ root }), { figures: 1, changed: 0 });
    assert.deepEqual(await watermarkFigures({ root, check: true }), { figures: 1, changed: 0 });
    await writeFile(path.join(root, 'public/mixing/parity.svg'), figure);
    await assert.rejects(watermarkFigures({ root, check: true }), /outdated watermark/);
    assert.deepEqual(await watermarkFigures({ root }), { figures: 1, changed: 1 });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

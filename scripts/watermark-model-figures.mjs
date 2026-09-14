import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

export const VERSION = 'sean-kim-model-figure-v4';
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checksum = bytes => createHash('sha256').update(bytes).digest('hex');
const roots = ['agitation-thermal/figures', 'bench-heating', 'fedbatch-feed', 'mixing', 'xdr2000'];
const readJson = async (file, fallback) => JSON.parse(await readFile(file, 'utf8').catch(error => {
  if (error.code === 'ENOENT' && fallback !== undefined) return JSON.stringify(fallback);
  throw error;
}));

export function isModelFigure(relative) {
  return roots.some(root => relative.startsWith(root + '/')) && /\.(png|svg)$/i.test(relative)
    && !relative.includes('/posters/');
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(error => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(path.join(directory, entry.name))
    : entry.isFile() ? [path.join(directory, entry.name)] : []))).flat();
}

export function watermarkMarkup(width, height) {
  if (!(width > 0 && height > 0)) throw new Error('Invalid figure dimensions');
  const landscape = width >= height;
  const xs = landscape ? [.22, .5, .78] : [.29, .71];
  const ys = landscape ? [.28, .69] : [.22, .50, .78];
  const font = Math.min(width, height) * .035;
  const words = xs.flatMap(x => ys.map(y => `<g transform="translate(${(x * width).toFixed(2)} ${(y * height).toFixed(2)}) rotate(-22)"><text x="0" y="0" font-size="${font}" font-weight="600">Sean Kim</text><text x="0" y="${font * .92}" font-size="${font * .55}">seankimism.github.io/seankim</text></g>`)).join('');
  return `<g id="${VERSION}" aria-hidden="true" pointer-events="none" font-family="Arial, sans-serif" text-anchor="middle" fill="#334155" fill-opacity=".12" stroke="white" stroke-opacity=".25" stroke-width="${font * .045}" paint-order="stroke">${words}</g>`;
}

export function watermarkSvg(source) {
  source = source.replace(/\r\n?/g, '\n');
  if (source.includes(`id="${VERSION}"`)) return source;
  const tag = source.match(/<svg\b[^>]*>/)?.[0];
  const viewBox = tag?.match(/viewBox=["']([^"']+)["']/)?.[1].trim().split(/[\s,]+/).map(Number);
  if (!viewBox || viewBox.length !== 4 || viewBox.some(value => !Number.isFinite(value))) {
    throw new Error('Model SVG requires a finite viewBox');
  }
  const [x, y, width, height] = viewBox;
  const mark = `<g transform="translate(${x} ${y})">${watermarkMarkup(width, height)}</g>`;
  if (!/<\/svg>\s*$/.test(source)) throw new Error('Invalid SVG ending');
  return source.replace(/<\/svg>(\s*)$/, `${mark}</svg>$1`);
}

const xmp = `<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:sk="https://seankimism.github.io/seankim/" sk:watermark="${VERSION}"/></rdf:RDF></x:xmpmeta>`;

export async function watermarkPng(source) {
  const metadata = await sharp(source).metadata();
  if (metadata.xmp?.toString().includes(VERSION)) return source;
  const { width, height } = metadata;
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${watermarkMarkup(width, height)}</svg>`);
  return sharp(source).composite([{ input: overlay }]).keepMetadata().withXmp(xmp).png().toBuffer();
}

async function writeJsonIfChanged(file, value) {
  const next = JSON.stringify(value, null, 2) + '\n';
  if (await readFile(file, 'utf8').catch(() => '') !== next) await writeFile(file, next);
}

async function refreshManifests(publicRoot, processed) {
  const benchPath = path.join(publicRoot, 'bench-heating/manifest.json');
  const bench = await readJson(benchPath, null);
  if (bench) {
    for (const file of bench.files) {
      if (file.path !== 'index.html' && !processed.has('bench-heating/' + file.path)) continue;
      const bytes = await readFile(path.join(publicRoot, 'bench-heating', file.path));
      file.bytes = bytes.length;
      file.sha256 = checksum(bytes);
    }
    await writeJsonIfChanged(benchPath, bench);
  }
  const agitationPath = path.join(publicRoot, 'agitation-thermal/manifest.json');
  const agitation = await readJson(agitationPath, null);
  if (agitation) {
    for (const [relative, asset] of Object.entries(agitation.artifacts)) {
      const location = path.join(publicRoot, 'agitation-thermal', relative);
      let bytes = await readFile(location);
      if (/\.(html|svg|json)$/.test(relative)) {
        const normalized = Buffer.from(bytes.toString().replace(/\r\n?/g, '\n'));
        if (!normalized.equals(bytes)) await writeFile(location, normalized);
        bytes = normalized;
      }
      asset.bytes = bytes.length;
      asset.sha256 = checksum(bytes);
    }
    agitation.artifact_bytes = Object.values(agitation.artifacts).reduce((total, asset) => total + asset.bytes, 0);
    await writeJsonIfChanged(agitationPath, agitation);
  }
}

export async function watermarkFigures({ root = repository, check = false } = {}) {
  const publicRoot = path.join(root, 'public');
  const manifestPath = path.join(publicRoot, 'figure-watermarks.json');
  const previous = await readJson(manifestPath, { files: {} });
  const files = (await Promise.all(roots.map(relative => walk(path.join(publicRoot, relative))))).flat().sort();
  const processed = new Set();
  const manifest = { version: VERSION, attribution: 'Sean Kim · seankimism.github.io/seankim',
    scope: 'Original modeling figures; excludes published-paper illustrations, portraits and video posters', files: {} };
  let changed = 0;
  for (const file of files) {
    const relative = path.relative(publicRoot, file).split(path.sep).join('/');
    if (!isModelFigure(relative)) continue;
    processed.add(relative);
    let source = await readFile(file);
    let sourceHash = checksum(source);
    const known = previous.files[relative];
    if (known?.sha256 === sourceHash && previous.version === VERSION) {
      manifest.files[relative] = known;
      continue;
    }
    if (check) throw new Error(`Missing or outdated watermark: ${relative}`);
    if (known?.sha256 === sourceHash) {
      source = await readFile(path.join(root, 'output/figure-originals', known.source_sha256 + path.extname(file)))
        .catch(() => { throw new Error(`Restore the clean modeling export before changing watermark style: ${relative}`); });
      sourceHash = checksum(source);
      if (sourceHash !== known.source_sha256) throw new Error(`Original figure backup checksum mismatch: ${relative}`);
    }
    const result = file.endsWith('.svg') ? Buffer.from(watermarkSvg(source.toString())) : await watermarkPng(source);
    if (result.equals(source)) throw new Error(`Marked figure lacks matching provenance: ${relative}`);
    const backupDirectory = path.join(root, 'output/figure-originals');
    await mkdir(backupDirectory, { recursive: true });
    await writeFile(path.join(backupDirectory, sourceHash + path.extname(file)), source, { flag: 'wx' }).catch(error => {
      if (error.code !== 'EEXIST') throw error;
    });
    await writeFile(file, result);
    manifest.files[relative] = { source_sha256: sourceHash, sha256: checksum(result), bytes: result.length };
    changed++;
  }
  if (check) {
    if (Object.keys(previous.files).length !== processed.size) throw new Error('Watermark inventory is stale');
  } else {
    await writeJsonIfChanged(manifestPath, manifest);
    await refreshManifests(publicRoot, processed);
  }
  return { figures: processed.size, changed };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = await watermarkFigures({ check: process.argv.includes('--check') });
  console.log(`Model figure watermarks: ${result.figures} checked; ${result.changed} updated.`);
}

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { parse } from 'yaml';
import { previewPaths, servePreview } from '../src/utils/shake-flask-pv-preview.mjs';
import { tags } from './project-html.mjs';

const directory = new URL('../docs/project-previews/shake-flask-pv/', import.meta.url);
const filenames = ['index.html', 'methodology.html', 'vessel-agitation.html', 'agitation-methodology.html'];
const previewPrefix = base => `${base.replace(/\/+$/, '')}/project-previews/shake-flask-pv/`;

test('calculator preview emits no production paths and refuses production requests', async () => {
  for (const development of [false, undefined, null, 'true']) {
    assert.deepEqual(previewPaths(development), []);
    for (const filename of filenames) {
      const response = await servePreview({ development, asset: filename.slice(0, -5) });
      assert.equal(response.status, 404);
      assert.equal(await response.text(), '');
    }
  }
  assert.deepEqual(previewPaths(true).map(path => path.params.asset + '.html'), filenames);
});

test('development preview rejects arbitrary paths and unknown snapshots', async () => {
  for (const asset of ['../index', '../../package.json', 'index.html', 'INDEX', '', undefined, 'missing']) {
    assert.equal((await servePreview({ development: true, asset })).status, 404);
  }
});

test('preserved snapshot inventory and byte hashes match the recorded manifest', async () => {
  const manifest = JSON.parse(await readFile(new URL('manifest.json', directory), 'utf8'));
  assert.deepEqual(Object.keys(manifest.snapshot_files), filenames);
  assert.deepEqual((await readdir(directory)).filter(name => name.endsWith('.html')).sort(), [...filenames].sort());
  for (const [filename, expected] of Object.entries(manifest.snapshot_files)) {
    const bytes = await readFile(new URL(filename, directory));
    assert.equal(bytes.length, expected.bytes, filename);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected.sha256, filename);
  }
});

test('P/V project is a draft child and its embedded links use only development routes', async () => {
  const markdown = await readFile(new URL('../src/content/projects/shake-flask-pv-scale-up.md', import.meta.url), 'utf8');
  const metadata = parse(markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  assert.equal(metadata.draft, true);
  assert.equal(metadata.parentProject, 'bioprocess-modeling');
  const frame = tags(markdown, 'iframe')[0];
  assert.equal(frame.src, '/project-previews/shake-flask-pv/vessel-agitation.html/');
  assert.ok(Object.hasOwn(frame, 'data-content-height') || markdown.includes('data-content-height'));
  assert.ok(!markdown.includes('/incubator-rcf/vessel-agitation.html'));
  assert.ok(!markdown.includes('/incubator-rcf/agitation-methodology.html'));
});

function calculatorDocument(html) {
  const elements = new Map();
  for (const match of html.matchAll(/<([\w-]+)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
    const attributes = Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));
    const listeners = new Map();
    elements.set(attributes.id, {
      ...attributes, value: attributes.value ?? '', checked: /\bchecked(?:\s|>)/.test(match[0]),
      hidden: /\bhidden(?:\s|>)/.test(match[0]), dataset: {}, textContent: '',
      addEventListener: (name, callback) => listeners.set(name, callback),
      dispatch: name => listeners.get(name)?.({ preventDefault() {} }),
      replaceChildren(...children) { this.children = children; },
    });
  }
  const form = elements.get('agitation-form');
  form.elements = Object.fromEntries([...elements.values()].filter(element => element.name).map(element => [element.name, element]));
  for (const [id, value] of [['source-flask', 'unbaffled_glass'], ['target-flask', 'unbaffled_glass']]) elements.get(id).value = value;
  const document = { getElementById: id => elements.get(id), createElement: () => ({ textContent: '' }) };
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(([, source]) => source);
  vm.runInNewContext(scripts.join('\n'), { document });
  return { elements, form };
}

for (const base of ['/', '/seankim/', '/seankim']) {
  test(`static calculator navigation and methods fragments resolve at ${base}`, async () => {
    const pages = new Map();
    for (const filename of filenames) {
      const response = await servePreview({ development: true, asset: filename.slice(0, -5), base });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
      pages.set(filename, await response.text());
    }
    for (const [filename, html] of pages) {
      const current = new URL(previewPrefix(base) + filename + '/', 'https://example.com');
      for (const { href } of tags(html, 'a')) {
        if (!href || /^https?:/.test(href)) continue;
        const destination = new URL(href, current);
        assert.ok(destination.pathname.startsWith(previewPrefix(base)), href);
        const targetName = destination.pathname.slice(previewPrefix(base).length, -1);
        assert.ok(pages.has(targetName), href);
        if (destination.hash) {
          const id = destination.hash.slice(1);
          assert.ok(pages.get(targetName).includes(`id="${id}"`), href);
        }
      }
    }
  });

  test(`construction changes retain preview method URLs and hide unsupported results at ${base}`, async () => {
    const response = await servePreview({ development: true, asset: 'vessel-agitation', base });
    const { elements, form } = calculatorDocument(await response.text());
    assert.equal(elements.get('readout').hidden, false);
    assert.ok(Number(elements.get('speed').textContent) > 0);
    assert.equal(elements.get('source-method').href, previewPrefix(base) + 'agitation-methodology.html/#scope');
    elements.get('plastic-reference').dispatch('click');
    assert.equal(elements.get('source-method').href, previewPrefix(base) + 'agitation-methodology.html/#plastic-reference');
    assert.equal(elements.get('target-method').href, previewPrefix(base) + 'agitation-methodology.html/#plastic-reference');
    assert.equal(elements.get('readout').hidden, true);
    assert.equal(elements.get('messages').hidden, false);
    assert.equal(elements.get('source-pv').textContent, '');
    form.elements.sourceFlaskType.value = 'baffled_glass';
    form.dispatch('input');
    assert.equal(elements.get('source-method').href, previewPrefix(base) + 'agitation-methodology.html/#scope');
    elements.get('glass-example').dispatch('click');
    assert.equal(elements.get('readout').hidden, false);
    assert.equal(elements.get('messages').hidden, true);
  });
}

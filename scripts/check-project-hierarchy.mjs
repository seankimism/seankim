import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {parse} from 'yaml';
import {selectNewestProjects, selectProjectOverviews} from '../src/utils/project-selection.mjs';
import {articles, basePrefix, hasLink, tags} from './project-html.mjs';

const projectPath = id => `/projects/${id}/`;
const sourceDirectory = fileURLToPath(new URL('../src/content/projects', import.meta.url));

export function readProjectMetadata(directory = sourceDirectory) {
  const files = readdirSync(directory, {recursive: true}).filter(file => file.endsWith('.md'));
  return files.map(file => {
    const source = readFileSync(path.join(directory, file), 'utf8');
    const header = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    assert.ok(header, `Missing project frontmatter: ${file}`);
    const data = parse(header[1]);
    data.publishedDate = new Date(data.publishedDate);
    assert.ok(Number.isFinite(data.publishedDate.getTime()), `Invalid publication date: ${file}`);
    return {id: file.replace(/\\/g, '/').replace(/\.md$/, ''), data};
  });
}

export function validateProjectHierarchy({entries, pages, listingHtml, homeHtml}, base = '/') {
  const prefix = basePrefix(base);
  const visible = entries.filter(entry => !entry.data.draft);
  const byId = new Map(visible.map(entry => [entry.id, entry]));
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length, 'Duplicate project IDs');
  for (const entry of visible) {
    const visited = new Set([entry.id]);
    let current = entry;
    while (current.data.parentProject && current.data.parentProject !== current.id) {
      const parent = byId.get(current.data.parentProject);
      if (!parent) break;
      assert.ok(!visited.has(parent.id), `Cyclic project parent: ${entry.id}`);
      visited.add(parent.id);
      current = parent;
    }
  }
  for (const [label, html, expected] of [
    ['Projects page', listingHtml, selectProjectOverviews(entries)],
    ['Home page', homeHtml, selectNewestProjects(entries)],
  ]) {
    const selected = new Set(expected.map(entry => entry.id));
    const cards = articles(html);
    for (const entry of entries) {
      const count = cards.filter(card => hasLink(card, `${prefix}${projectPath(entry.id)}`)).length;
      assert.equal(count, selected.has(entry.id) ? 1 : 0, `Unexpected listing count for ${entry.id} on ${label}`);
    }
  }
  const cardsByParent = new Map();
  for (const entry of visible) {
    const html = pages[entry.id];
    assert.ok(html, `Missing retained project ${entry.id}`);
    const canonical = tags(html, 'link').find(tag => tag.rel === 'canonical');
    assert.ok(canonical, `Missing canonical link for ${entry.id}`);
    assert.equal(new URL(canonical.href).pathname, `${prefix}${projectPath(entry.id)}`, `Changed canonical path for ${entry.id}`);
    const parent = entry.data.parentProject !== entry.id && byId.get(entry.data.parentProject);
    const backPath = parent ? projectPath(parent.id) : '/projects/';
    assert.ok(tags(html, 'a').some(tag => tag.class?.split(/\s+/).includes('detail-back') && tag.href === `${prefix}${backPath}`), `Missing parent back link for ${entry.id}`);
    if (!parent) continue;
    const cards = articles(pages[parent.id] || '');
    const matching = cards.filter(card => hasLink(card, `${prefix}${projectPath(entry.id)}`));
    assert.equal(matching.length, 1, `Expected one study article for ${entry.id} in ${parent.id}`);
    const siblings = cardsByParent.get(parent.id) || new Set();
    assert.ok(!siblings.has(matching[0]), `Each study must have its own overview article in ${parent.id}`);
    siblings.add(matching[0]);
    cardsByParent.set(parent.id, siblings);
  }
  return {projects: visible.length, overviews: selectProjectOverviews(entries).length};
}

export function checkProjectHierarchy(directory = 'dist', base = '/', contentDirectory = sourceDirectory) {
  const root = path.resolve(directory);
  const read = route => readFileSync(path.join(root, route, 'index.html'), 'utf8');
  const entries = readProjectMetadata(contentDirectory);
  return validateProjectHierarchy({
    entries,
    pages: Object.fromEntries(entries.filter(entry => !entry.data.draft).map(entry => [entry.id, read(`projects/${entry.id}`)])),
    listingHtml: read('projects'), homeHtml: read(''),
  }, base);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const base = process.argv[3] ?? process.env.SITE_BASE_PATH ?? (repository && !repository.endsWith('.github.io') ? `/${repository}` : '/');
  const result = checkProjectHierarchy(process.argv[2], base);
  console.log(`PASS: ${result.projects} published projects and ${result.overviews} overviews follow content metadata, listing selection and parent links.`);
}

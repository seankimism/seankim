import assert from 'node:assert/strict';
import test from 'node:test';
import {selectNewestProjects, selectProjectOverviews} from '../src/utils/project-selection.mjs';
import {readProjectMetadata, validateProjectHierarchy} from './check-project-hierarchy.mjs';

const entry = (id, extra = {}) => ({id, data: {organization: 'Independent', publishedDate: new Date('2026-09-27'), ...extra}});
const card = href => `<article><h2><a href="${href}">Project</a></h2><a href="${href}">Read project</a></article>`;
function fixture(base, entries = [entry('overview'), entry('study', {parentProject: 'overview'})]) {
  const prefix = base === '/' ? '' : base;
  const visible = entries.filter(item => !item.data.draft);
  const route = id => `${prefix}/projects/${id}/`;
  const visibleIds = new Set(visible.map(item => item.id));
  return {
    entries,
    pages: Object.fromEntries(visible.map(item => {
      const parent = item.data.parentProject;
      const back = parent && parent !== item.id && visibleIds.has(parent) ? route(parent) : `${prefix}/projects/`;
      const children = visible.filter(child => child.data.parentProject === item.id && child.id !== item.id);
      return [item.id, `<link href="https://example.com${route(item.id)}" rel="canonical"><a class="detail-back" href="${back}">Back</a><article><h1>Project</h1>${children.map(child => card(route(child.id))).join('')}</article>`];
    })),
    listingHtml: selectProjectOverviews(entries).map(item => card(route(item.id))).join(''),
    homeHtml: selectNewestProjects(entries).map(item => card(route(item.id))).join(''),
  };
}

test('project metadata uses actual Markdown dates and parent IDs', () => {
  const entries = readProjectMetadata();
  assert.ok(entries.length > 0);
  assert.ok(entries.every(item => item.data.publishedDate instanceof Date));
  assert.ok(entries.some(item => item.data.parentProject));
});

for (const base of ['/', '/seankim']) {
  const prefix = base === '/' ? '' : base;
  test(`published and additional studies follow metadata at ${base}`, () => {
    const entries = [entry('overview'), entry('first', {parentProject: 'overview'}), entry('new-study', {parentProject: 'overview'})];
    assert.deepEqual(validateProjectHierarchy(fixture(base, entries), base), {projects: 3, overviews: 1});
  });

  test(`a newer overview replaces an older overview on About at ${base}`, () => {
    const entries = [entry('older-overview'), entry('study', {parentProject: 'older-overview'}), entry('newest', {publishedDate: new Date('2027-01-01')})];
    const data = fixture(base, entries);
    assert.ok(!data.homeHtml.includes('older-overview'));
    assert.doesNotThrow(() => validateProjectHierarchy(data, base));
  });

  test(`draft and absent parents retain independently listed studies at ${base}`, () => {
    const entries = [entry('draft-parent', {draft: true}), entry('child', {parentProject: 'draft-parent'}), entry('orphan', {parentProject: 'absent'})];
    assert.deepEqual(validateProjectHierarchy(fixture(base, entries), base), {projects: 2, overviews: 2});
  });

  test(`missing, duplicate and direct child listings are rejected at ${base}`, () => {
    for (const field of ['listingHtml', 'homeHtml']) {
      const missing = fixture(base);
      missing[field] = '';
      assert.throws(() => validateProjectHierarchy(missing, base), /listing count/);
      const duplicate = fixture(base);
      duplicate[field] += duplicate[field];
      assert.throws(() => validateProjectHierarchy(duplicate, base), /listing count/);
      const child = fixture(base);
      child[field] += card(`${prefix}/projects/study/`);
      assert.throws(() => validateProjectHierarchy(child, base), /listing count/);
    }
  });

  test(`each study needs a distinct overview card and its parent link at ${base}`, () => {
    const data = fixture(base, [entry('overview'), entry('one', {parentProject: 'overview'}), entry('two', {parentProject: 'overview'})]);
    data.pages.overview = data.pages.overview.replace(card(`${prefix}/projects/one/`), '');
    assert.throws(() => validateProjectHierarchy(data, base), /Expected one study article/);
    const combined = fixture(base, data.entries);
    combined.pages.overview = combined.pages.overview.replace(/<article>[\s\S]*$/, `<article><a href="${prefix}/projects/one/">One</a><a href="${prefix}/projects/two/">Two</a></article>`);
    assert.throws(() => validateProjectHierarchy(combined, base), /own overview article/);
    const wrongParent = fixture(base);
    wrongParent.pages.study = wrongParent.pages.study.replace(`href="${prefix}/projects/overview/"`, `href="${prefix}/projects/"`);
    assert.throws(() => validateProjectHierarchy(wrongParent, base), /Missing parent back link/);
  });
}

test('lost deployment base, missing pages and parent cycles fail', () => {
  assert.throws(() => validateProjectHierarchy(fixture('/'), '/seankim'), /listing count/);
  const missing = fixture('/');
  delete missing.pages.study;
  assert.throws(() => validateProjectHierarchy(missing), /Missing retained project/);
  const cyclic = fixture('/', [entry('one', {parentProject: 'two'}), entry('two', {parentProject: 'one'})]);
  assert.throws(() => validateProjectHierarchy(cyclic), /Cyclic project parent/);
});

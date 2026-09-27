import assert from 'node:assert/strict';
import test from 'node:test';
import { selectNewestProjects, selectProjectOverviews } from './project-selection.mjs';

const project = (id, organization, date, extra = {}) => ({
  id,
  data: { organization, publishedDate: new Date(date), ...extra },
});

test('new publication replaces an older project despite its manual priority', () => {
  const temperature = project('temperature', 'Independent project', '2026-09-11', { order: -1 });
  const agitation = project('agitation', 'Independent project', '2026-09-14', { order: 0 });
  assert.deepEqual(selectNewestProjects([temperature, agitation]), [agitation]);
});

test('each organization contributes its newest published page; drafts do not displace it', () => {
  const entries = [
    project('upcoming', 'Independent project', '2026-09-15', { draft: true }),
    project('cornell-old', 'Cornell University', '2026-09-08'),
    project('ark', 'Ark Biotech', '2026-09-10'),
    project('agitation', 'Independent project', '2026-09-14', { draft: false }),
    project('cornell-new', 'Cornell University', '2026-09-11'),
  ];
  const original = [...entries];
  assert.deepEqual(selectNewestProjects(entries).map(entry => entry.id),
    ['agitation', 'cornell-new', 'ark']);
  assert.deepEqual(entries, original);
});

test('equal publication dates have deterministic selection independent of collection order', () => {
  const a = project('alpha', 'Independent project', '2026-09-14');
  const b = project('beta', 'Independent project', '2026-09-14');
  assert.deepEqual(selectNewestProjects([a, b]), [a]);
  assert.deepEqual(selectNewestProjects([b, a]), [a]);
  assert.deepEqual(selectNewestProjects([]), []);
});

function modelingProjects({ draft = true } = {}) {
  const parentProject = 'bioprocess-modeling';
  const hub = project(parentProject, 'Independent project', '2026-09-27', { draft });
  const studies = [
    project('temperature', 'Independent project', '2026-09-11', { parentProject }),
    project('agitation', 'Independent project', '2026-09-14', { parentProject }),
    project('headspace', 'Independent project', '2026-09-28', { parentProject }),
  ];
  return { hub, studies };
}

test('development preview groups three studies under their draft overview', () => {
  const { hub, studies } = modelingProjects();
  const cornell = project('cornell', 'Cornell University', '2026-09-09');
  const entries = [studies[0], cornell, hub, ...studies.slice(1)];
  const options = { includeDrafts: true };

  assert.deepEqual(selectProjectOverviews(entries, options), [cornell, hub]);
  assert.deepEqual(selectNewestProjects(entries, options), [hub, cornell]);
});

test('production retains studies with a draft parent and selects the newest published study', () => {
  const { hub, studies } = modelingProjects();
  const entries = [hub, ...studies];

  assert.deepEqual(selectProjectOverviews(entries), studies);
  assert.deepEqual(selectNewestProjects(entries), [studies[2]]);
  assert.deepEqual(selectProjectOverviews(entries, { includeDrafts: false }), studies);
});

test('a newer study does not displace its published overview', () => {
  const { hub, studies } = modelingProjects({ draft: false });
  const entries = [...studies, hub];

  assert.deepEqual(selectProjectOverviews(entries), [hub]);
  assert.deepEqual(selectNewestProjects(entries), [hub]);
});

test('a study whose parent is missing remains available in production and preview', () => {
  const study = project('orphan-study', 'Independent project', '2026-09-28', {
    parentProject: 'unavailable-overview',
  });

  for (const options of [{}, { includeDrafts: true }]) {
    assert.deepEqual(selectProjectOverviews([study], options), [study]);
    assert.deepEqual(selectNewestProjects([study], options), [study]);
  }
});

test('overview grouping and newest selection preserve the input collection and metadata', () => {
  const { hub, studies } = modelingProjects();
  const entries = [studies[2], hub, studies[0], studies[1]];
  const original = structuredClone(entries);
  for (const entry of entries) {
    Object.freeze(entry.data);
    Object.freeze(entry);
  }
  Object.freeze(entries);

  for (const options of [{}, { includeDrafts: true }]) {
    selectProjectOverviews(entries, options);
    selectNewestProjects(entries, options);
  }
  assert.deepEqual(entries, original);
});

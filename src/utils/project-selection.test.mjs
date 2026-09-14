import assert from 'node:assert/strict';
import test from 'node:test';
import { selectNewestProjects } from './project-selection.mjs';

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

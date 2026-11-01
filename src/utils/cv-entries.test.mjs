import assert from 'node:assert/strict';
import test from 'node:test';
import { groupByInstitution } from './cv-entries.mjs';

const entry = (title, institution) => ({ title, ...(institution && { institution }) });

test('consecutive entries from one institution share a group, in order', () => {
  const entries = [
    entry('Lead Scientist', 'Lonza Biologics · Portsmouth, NH'),
    entry('Staff Engineer', 'Ark Biotech · Cambridge, MA'),
    entry('Senior Engineer', 'Ark Biotech · Cambridge, MA'),
    entry('Research Associate', 'Ark Biotech · Cambridge, MA'),
    entry('Intern', 'Samsung Electronics · Yongin, South Korea'),
  ];
  const original = structuredClone(entries);
  assert.deepEqual(groupByInstitution(entries), [
    { institution: 'Lonza Biologics · Portsmouth, NH', entries: [entries[0]] },
    { institution: 'Ark Biotech · Cambridge, MA', entries: entries.slice(1, 4) },
    { institution: 'Samsung Electronics · Yongin, South Korea', entries: [entries[4]] },
  ]);
  assert.deepEqual(entries, original);
});

test('entries without an institution stay separate', () => {
  const grouped = groupByInstitution([entry('Global Talent Scholarship'), entry('Journal peer reviewer')]);
  assert.deepEqual(grouped.map(group => group.entries.length), [1, 1]);
});

test('returning to an earlier institution starts a new group', () => {
  const grouped = groupByInstitution([
    entry('Bottomley Research Scholarship', 'Purdue University'),
    entry('Commercialization Fellowship', 'Cornell University'),
    entry('Perrella Scholarship', 'Purdue University'),
  ]);
  assert.deepEqual(grouped.map(group => group.institution),
    ['Purdue University', 'Cornell University', 'Purdue University']);
});

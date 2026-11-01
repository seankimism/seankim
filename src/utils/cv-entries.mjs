/**
 * Group CV entries by institution, keeping their order. Consecutive entries from one
 * institution share a group, so the institution is shown once above their titles.
 * Entries without an institution are never grouped.
 *
 * @template {{ institution?: string }} T
 * @param {readonly T[]} entries
 * @returns {{ institution?: string, entries: T[] }[]}
 */
export function groupByInstitution(entries) {
  const groups = [];
  for (const entry of entries) {
    const group = groups.at(-1);
    if (entry.institution && group?.institution === entry.institution) group.entries.push(entry);
    else groups.push({ institution: entry.institution, entries: [entry] });
  }
  return groups;
}

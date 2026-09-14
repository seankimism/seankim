/**
 * Select the newest published page per organization, newest first.
 * Manual Projects-page order and subsequent edits do not affect this selection.
 *
 * @template {{ id: string, data: { organization: string, publishedDate: Date, draft?: boolean } }} T
 * @param {readonly T[]} entries
 * @returns {T[]}
 */
export function selectNewestProjects(entries) {
  const newestFirst = entries
    .filter(entry => !entry.data.draft)
    .sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime()
      || a.id.localeCompare(b.id));
  const organizations = new Set();
  return newestFirst.filter(entry => {
    if (organizations.has(entry.data.organization)) return false;
    organizations.add(entry.data.organization);
    return true;
  });
}

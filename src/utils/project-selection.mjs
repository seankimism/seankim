/**
 * List project overviews, retaining a study when its parent is unavailable.
 * Draft parents only group studies when explicitly previewing drafts.
 *
 * @template {{ id: string, data: { draft?: boolean, parentProject?: string } }} T
 * @param {readonly T[]} entries
 * @param {{ includeDrafts?: boolean }} options
 * @returns {T[]}
 */
export function selectProjectOverviews(entries, { includeDrafts = false } = {}) {
  const visible = entries.filter(entry => includeDrafts || !entry.data.draft);
  const visibleIds = new Set(visible.map(entry => entry.id));
  return visible.filter(entry => !entry.data.parentProject
    || entry.data.parentProject === entry.id
    || !visibleIds.has(entry.data.parentProject));
}

/**
 * Select the newest visible overview per organization, newest first.
 * Manual Projects-page order and subsequent edits do not affect this selection.
 *
 * @template {{ id: string, data: { organization: string, publishedDate: Date, draft?: boolean, parentProject?: string } }} T
 * @param {readonly T[]} entries
 * @param {{ includeDrafts?: boolean }} options
 * @returns {T[]}
 */
export function selectNewestProjects(entries, options = {}) {
  const newestFirst = selectProjectOverviews(entries, options)
    .sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime()
      || a.id.localeCompare(b.id));
  const organizations = new Set();
  return newestFirst.filter(entry => {
    if (organizations.has(entry.data.organization)) return false;
    organizations.add(entry.data.organization);
    return true;
  });
}

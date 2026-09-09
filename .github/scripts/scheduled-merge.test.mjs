import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseWindow, runRelease, validateConfig, validatePullRequest } from './scheduled-merge.mjs';

const config = Object.freeze({
  repository: 'seankimism/seankim',
  base: 'main',
  pullRequest: 7,
  branch: 'lonza-start-update',
  headSha: 'a'.repeat(40),
  deploymentWorkflow: 'deploy.yml',
  notBefore: '2026-09-28T04:01:00Z',
  expiresAt: '2026-09-29T04:01:00Z',
  displayTime: 'September 28, 2026 at 00:01 America/New_York',
});
const baseSha = 'b'.repeat(40);
const mergeSha = 'c'.repeat(40);

function pullRequest(overrides = {}) {
  return {
    number: config.pullRequest,
    state: 'open',
    draft: false,
    merged: false,
    base: { ref: config.base, repo: { full_name: config.repository } },
    head: { ref: config.branch, sha: config.headSha, repo: { full_name: config.repository } },
    ...overrides,
  };
}

function harness({
  prs = [pullRequest()],
  times = [config.notBefore],
  remoteHead = config.headSha,
  failGit,
  buildError,
  dispatchError,
} = {}) {
  const events = [];
  let reads = 0;
  let clockReads = 0;
  const api = async (path, method = 'GET', body) => {
    events.push({ type: 'api', path, method, body });
    if (method === 'GET') {
      assert.equal(path, `/pulls/${config.pullRequest}`);
      return structuredClone(prs[Math.min(reads++, prs.length - 1)]);
    }
    assert.equal(method, 'POST');
    assert.equal(path, '/actions/workflows/deploy.yml/dispatches');
    if (dispatchError) throw dispatchError;
  };
  const git = (args) => {
    events.push({ type: 'git', args: [...args] });
    const error = failGit?.(args);
    if (error) throw error;
    if (args[0] === 'rev-parse') {
      if (args[1] === 'refs/remotes/origin/main') return `${baseSha}\n`;
      if (args[1] === `refs/remotes/origin/${config.branch}`) return `${remoteHead}\n`;
      if (args[1] === 'HEAD') return `${prs[0].merged ? baseSha : mergeSha}\n`;
      assert.fail(`Unexpected ref: ${args[1]}`);
    }
    return '';
  };
  const build = async () => {
    events.push({ type: 'build' });
    if (buildError) throw buildError;
  };
  return {
    events,
    run: (options = {}) => runRelease({
      config,
      api,
      git,
      build,
      now: () => new Date(times[Math.min(clockReads++, times.length - 1)]),
      log: () => {},
      ...options,
    }),
  };
}

const gitEvents = (events, command) => events.filter(event => event.type === 'git' && event.args[0] === command);
const dispatches = events => events.filter(event => event.type === 'api' && event.method === 'POST');
function assertNoRemoteWrites(events) {
  assert.deepEqual(gitEvents(events, 'push'), []);
  assert.deepEqual(dispatches(events), []);
}

test('configuration limits the release to the intended repository, branch and deployment workflow', () => {
  assert.doesNotThrow(() => validateConfig(config));
  for (const change of [
    { repository: 'someone-else/seankim' },
    { base: 'another-branch' },
    { deploymentWorkflow: 'other.yml' },
    { headSha: 'a'.repeat(7) },
    { expiresAt: '2026-09-30T04:01:00Z' },
    { expiresAt: config.notBefore },
  ]) {
    assert.throws(() => validateConfig({ ...config, ...change }));
  }
});

test('release window includes its first instant and excludes its last instant and later years', () => {
  for (const [time, expected] of [
    ['2026-09-28T04:00:59.999Z', 'not-due'],
    [config.notBefore, 'due'],
    ['2026-09-29T04:00:59.999Z', 'due'],
    [config.expiresAt, 'expired'],
    ['2025-09-28T04:01:00Z', 'not-due'],
    ['2027-09-28T04:01:00Z', 'expired'],
  ]) {
    assert.equal(releaseWindow(config, new Date(time)), expected, time);
  }
  assert.throws(() => releaseWindow(config, new Date('invalid')), /release time/);
});

for (const [time, expected] of [
  ['2026-09-28T04:00:59.999Z', 'not-due'],
  [config.expiresAt, 'expired'],
  ['2025-09-28T04:01:00Z', 'not-due'],
  ['2027-09-28T04:01:00Z', 'expired'],
]) {
  test(`live release performs no API, Git or build operations at ${time}`, async () => {
    const subject = harness({ times: [time] });
    assert.deepEqual(await subject.run(), { status: expected });
    assert.deepEqual(subject.events, []);
  });
}

test('dry run before the publication date builds a candidate without remote writes', async () => {
  const subject = harness({ times: ['2026-09-09T12:00:00Z'] });
  assert.deepEqual(await subject.run({ dryRun: true }), { status: 'dry-run', testedSha: mergeSha });
  assert.equal(subject.events.filter(event => event.type === 'build').length, 1);
  assert.equal(gitEvents(subject.events, 'merge').length, 1);
  assertNoRemoteWrites(subject.events);
});

test('pull request validation rejects a different source repository', () => {
  const pr = pullRequest();
  pr.head.repo.full_name = 'someone-else/seankim';
  assert.throws(() => validatePullRequest(pr, config), /pull request or its commit changed/);
});

for (const [label, pr, message] of [
  ['changed PR commit', pullRequest({ head: { ...pullRequest().head, sha: 'd'.repeat(40) } }), /commit changed/],
  ['closed unmerged PR', pullRequest({ state: 'closed' }), /closed without merging/],
  ['draft PR', pullRequest({ draft: true }), /draft/],
]) {
  test(`${label} stops before local merge or build`, async () => {
    const subject = harness({ prs: [pr] });
    await assert.rejects(subject.run(), message);
    assert.equal(subject.events.length, 1);
    assert.equal(subject.events[0].type, 'api');
    assertNoRemoteWrites(subject.events);
  });
}

test('a remote draft branch change stops before merging or building', async () => {
  const subject = harness({ remoteHead: 'd'.repeat(40) });
  await assert.rejects(subject.run(), /remote draft commit changed/);
  assert.deepEqual(gitEvents(subject.events, 'merge'), []);
  assert.equal(subject.events.some(event => event.type === 'build'), false);
  assertNoRemoteWrites(subject.events);
});

test('merge conflict stops before build, push and deployment', async () => {
  const subject = harness({ failGit: args => args[0] === 'merge' ? new Error('merge conflict') : undefined });
  await assert.rejects(subject.run(), /merge conflict/);
  assert.equal(subject.events.some(event => event.type === 'build'), false);
  assertNoRemoteWrites(subject.events);
});

test('failed candidate build prevents push and deployment', async () => {
  const subject = harness({ buildError: new Error('production build failed') });
  await assert.rejects(subject.run(), /production build failed/);
  assertNoRemoteWrites(subject.events);
});

test('a concurrent main update that rejects the push prevents deployment dispatch', async () => {
  const subject = harness({ failGit: args => args[0] === 'push' ? new Error('non-fast-forward rejection') : undefined });
  await assert.rejects(subject.run(), /non-fast-forward rejection/);
  assert.deepEqual(gitEvents(subject.events, 'push').map(event => event.args), [['push', 'origin', 'HEAD:refs/heads/main']]);
  assert.deepEqual(dispatches(subject.events), []);
});

for (const [label, latestPr, message] of [
  ['cancellation', pullRequest({ state: 'closed' }), /closed without merging/],
  ['changed head', pullRequest({ head: { ...pullRequest().head, sha: 'd'.repeat(40) } }), /commit changed/],
  ['external merge', pullRequest({ state: 'closed', merged: true }), /changed state during validation/],
]) {
  test(`PR ${label} during build is caught by the final recheck`, async () => {
    const subject = harness({ prs: [pullRequest(), latestPr] });
    await assert.rejects(subject.run(), message);
    assert.equal(subject.events.filter(event => event.type === 'build').length, 1);
    assert.equal(subject.events.filter(event => event.type === 'api').length, 2);
    assertNoRemoteWrites(subject.events);
  });
}

test('expiration during build prevents push and deployment', async () => {
  const subject = harness({ times: [config.notBefore, config.expiresAt] });
  await assert.rejects(subject.run(), /window ended during validation/);
  assert.equal(subject.events.filter(event => event.type === 'build').length, 1);
  assertNoRemoteWrites(subject.events);
});

test('expiration during the final PR API request prevents push and deployment', async () => {
  const subject = harness();
  let currentTime = config.notBefore;
  let pullReads = 0;
  await assert.rejects(subject.run({
    now: () => new Date(currentTime),
    api: async (path, method = 'GET', body) => {
      subject.events.push({ type: 'api', path, method, body });
      assert.equal(method, 'GET');
      assert.equal(path, `/pulls/${config.pullRequest}`);
      if (++pullReads === 2) currentTime = config.expiresAt;
      return pullRequest();
    },
  }), /release window ended/i);
  assert.equal(pullReads, 2);
  assertNoRemoteWrites(subject.events);
});

test('successful release builds, rechecks, non-force pushes, then explicitly dispatches deployment', async () => {
  const subject = harness();
  assert.deepEqual(await subject.run(), { status: 'merged', testedSha: mergeSha });
  const buildIndex = subject.events.findIndex(event => event.type === 'build');
  const pushIndex = subject.events.findIndex(event => event.type === 'git' && event.args[0] === 'push');
  const dispatchIndex = subject.events.findIndex(event => event.type === 'api' && event.method === 'POST');
  const pullReads = subject.events.map((event, index) => ({ ...event, index })).filter(event => event.type === 'api' && event.method === 'GET');
  assert.equal(pullReads.length, 2);
  assert.ok(buildIndex < pullReads[1].index);
  assert.ok(pullReads[1].index < pushIndex);
  assert.ok(pushIndex < dispatchIndex);
  assert.deepEqual(gitEvents(subject.events, 'push').map(event => event.args), [['push', 'origin', 'HEAD:refs/heads/main']]);
  assert.deepEqual(dispatches(subject.events), [{
    type: 'api', path: '/actions/workflows/deploy.yml/dispatches', method: 'POST', body: { ref: 'main' },
  }]);
});

test('failed deployment dispatch can be recovered after the PR has merged', async () => {
  const first = harness({ dispatchError: new Error('deployment dispatch unavailable') });
  await assert.rejects(first.run(), /deployment dispatch unavailable/);
  assert.equal(gitEvents(first.events, 'push').length, 1);

  const retry = harness({ prs: [pullRequest({ state: 'closed', merged: true })] });
  assert.deepEqual(await retry.run(), { status: 'deployment-retried', testedSha: baseSha });
  assert.deepEqual(gitEvents(retry.events, 'merge'), []);
  assert.deepEqual(gitEvents(retry.events, 'push'), []);
  assert.deepEqual(gitEvents(retry.events, 'merge-base').map(event => event.args), [['merge-base', '--is-ancestor', config.headSha, baseSha]]);
  assert.equal(retry.events.filter(event => event.type === 'build').length, 1);
  assert.equal(dispatches(retry.events).length, 1);
});

test('already-merged recovery refuses a main branch that no longer contains the pinned commit', async () => {
  const subject = harness({
    prs: [pullRequest({ state: 'closed', merged: true })],
    failGit: args => args[0] === 'merge-base' ? new Error('planned commit is not an ancestor') : undefined,
  });
  await assert.rejects(subject.run(), /not an ancestor/);
  assert.equal(subject.events.some(event => event.type === 'build'), false);
  assertNoRemoteWrites(subject.events);
});

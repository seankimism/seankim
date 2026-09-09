import { appendFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function validateConfig(config) {
  if (config.repository !== 'seankimism/seankim' || config.base !== 'main' ||
      !Number.isInteger(config.pullRequest) || config.pullRequest < 1 ||
      !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(config.branch) ||
      !/^[a-f0-9]{40}$/.test(config.headSha) || config.deploymentWorkflow !== 'deploy.yml') {
    throw new Error('Invalid scheduled release target.');
  }
  const start = Date.parse(config.notBefore);
  const end = Date.parse(config.expiresAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || end - start > 86_400_000) {
    throw new Error('The release must have a valid window of at most 24 hours.');
  }
}

export function releaseWindow(config, now) {
  const time = now.getTime();
  if (!Number.isFinite(time)) throw new Error('Cannot determine the release time.');
  if (time < Date.parse(config.notBefore)) return 'not-due';
  if (time >= Date.parse(config.expiresAt)) return 'expired';
  return 'due';
}

export function validatePullRequest(pr, config) {
  if (pr.number !== config.pullRequest || pr.base?.ref !== config.base ||
      pr.base?.repo?.full_name !== config.repository || pr.head?.ref !== config.branch ||
      pr.head?.repo?.full_name !== config.repository || pr.head?.sha !== config.headSha) {
    throw new Error('The pull request or its commit changed. Review it and update the scheduled release before retrying.');
  }
  if (pr.draft || (pr.state !== 'open' && !pr.merged)) {
    throw new Error('The pull request is a draft or was closed without merging. No publication is allowed.');
  }
}

export async function runRelease({ config, dryRun = false, now = () => new Date(), api, git, build, log = console.log }) {
  validateConfig(config);
  const window = releaseWindow(config, now());
  if (!dryRun && window !== 'due') {
    log(`Release ${window}: authorized window is ${config.notBefore} to ${config.expiresAt}. No changes made.`);
    return { status: window };
  }
  log(dryRun ? 'DRY RUN: local candidate build only; no remote push or deployment.' : `Release due: ${config.displayTime}.`);
  const pullPath = `/pulls/${config.pullRequest}`;
  const pr = await api(pullPath);
  validatePullRequest(pr, config);

  git(['fetch', 'origin']);
  const baseSha = git(['rev-parse', `refs/remotes/origin/${config.base}`]).trim();
  git(['checkout', '--detach', baseSha]);
  if (pr.merged) {
    // A prior attempt may have merged successfully but failed to start deployment.
    git(['merge-base', '--is-ancestor', config.headSha, baseSha]);
    log('The planned commit is already in main; checking deployment recovery.');
  } else {
    const remoteHead = git(['rev-parse', `refs/remotes/origin/${config.branch}`]).trim();
    if (remoteHead !== config.headSha) throw new Error('The remote draft commit changed. Nothing was merged.');
    git(['config', 'user.name', 'github-actions[bot]']);
    git(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
    // A conflict fails here, before any remote update. Never choose ours/theirs.
    git(['merge', '--no-ff', '--no-edit', config.headSha, '-m', `Merge planned portfolio update (#${config.pullRequest})`]);
  }

  await build();
  const testedSha = git(['rev-parse', 'HEAD']).trim();
  if (dryRun) {
    log(`Dry run passed for ${testedSha}. Main and the live website were not changed.`);
    return { status: 'dry-run', testedSha };
  }
  // Builds can take time; the window also applies immediately before publication.
  if (releaseWindow(config, now()) !== 'due') throw new Error('The release window ended during validation. Nothing will be pushed.');
  const latestPr = await api(pullPath);
  validatePullRequest(latestPr, config);
  if (releaseWindow(config, now()) !== 'due') throw new Error('The release window ended during the final pull request check. Nothing will be pushed.');
  if (Boolean(latestPr.merged) !== Boolean(pr.merged)) {
    throw new Error('The pull request changed state during validation. Re-run to inspect the new state.');
  }
  if (!pr.merged) {
    // Non-force push atomically rejects a concurrent advance of main. It publishes
    // the exact merge commit that passed the build, rather than re-merging via API.
    git(['push', 'origin', 'HEAD:refs/heads/main']);
    log(`Merged tested commit ${testedSha}.`);
  }
  // GITHUB_TOKEN pushes do not trigger another push workflow. Dispatch explicitly.
  await api(`/actions/workflows/${config.deploymentWorkflow}/dispatches`, 'POST', { ref: config.base });
  log('GitHub Pages deployment requested. Check the Deploy website to GitHub Pages workflow for its result.');
  return { status: pr.merged ? 'deployment-retried' : 'merged', testedSha };
}

async function main() {
  if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REF !== 'refs/heads/main') {
    throw new Error('Run this release through GitHub Actions on main, not in a local checkout.');
  }
  const config = JSON.parse(readFileSync(new URL('../scheduled-release.json', import.meta.url), 'utf8'));
  if (process.env.GITHUB_REPOSITORY !== config.repository || !process.env.GH_TOKEN) {
    throw new Error('The release repository or GitHub token is missing or incorrect.');
  }
  const log = (message) => {
    console.log(message);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n\n`);
  };
  const git = (args) => {
    try {
      return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
    } catch (error) {
      // Git reports conflict filenames on stdout; retain them in the Actions log.
      if (error.stdout) process.stdout.write(error.stdout);
      throw error;
    }
  };
  const api = async (path, method = 'GET', body) => {
    const response = await fetch(`https://api.github.com/repos/${config.repository}${path}`, {
      method,
      headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) throw new Error(`GitHub ${method} ${path} failed (${response.status}).`);
    return response.status === 204 ? undefined : response.json();
  };
  const build = () => {
    execFileSync('npm', ['ci'], { stdio: 'inherit' });
    execFileSync('npm', ['run', 'build'], { stdio: 'inherit' });
  };
  await runRelease({ config, dryRun: process.env.DRY_RUN === 'true', api, git, build, log });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    const message = `Scheduled release stopped: ${error.message}`;
    console.error(message);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
    process.exitCode = 1;
  });
}

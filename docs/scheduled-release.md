# Scheduled portfolio publication

The prepared update is in [pull request #1](https://github.com/seankimism/seankim/pull/1), from `lonza-start-update` into `main`.

Publication is scheduled for **September 28, 2026 at 12:01 a.m. Eastern daylight time (America/New_York)**, which is **04:01 UTC**. GitHub Actions can start scheduled jobs late, and the build and deployment take additional time. The website will remain unchanged until the scheduled merge and successful deployment.

## How it works

- `.github/workflows/scheduled-merge.yml` runs at 04:01 UTC on September 28.
- `.github/scheduled-release.json` pins the repository, pull request, reviewed commit, and full release timestamps. Its date check prevents publication before September 28, 2026 and prevents the yearly cron expression from publishing in a future year.
- The job fetches current `main` and the draft, creates a normal merge commit, and builds that exact combination.
- Only a clean merge and successful build can be pushed. The push uses no force option, so a concurrent update to `main` rejects it.
- The job explicitly starts `deploy.yml` after pushing. GitHub does not trigger another push workflow for a push made with the job's `GITHUB_TOKEN`.
- Already-merged runs can retry deployment without merging again, provided the reviewed commit is still an ancestor of `main`.
- GitHub Pages deployments are restricted to `main`; manually running its workflow on the draft branch will not publish it.

## Preview or test without publishing

The local draft is in `tmp/lonza-start-draft/`. Run `npm.cmd run dev -- --host 127.0.0.1 --port 4322` in that directory and open <http://127.0.0.1:4322/cv/>.

On GitHub, open **Actions > Scheduled portfolio merge > Run workflow**, choose `main`, and leave **dry_run** checked. This tests the merge and build at any time without pushing or deploying.

## If a conflict or build failure occurs

The job fails before pushing, and the live website stays on its existing version. Open the failed Actions run to inspect the error. Resolve conflicts on `lonza-start-update`, review the resulting diff and build, then update `headSha` in `.github/scheduled-release.json` to the reviewed branch's full commit SHA. Do not force-push over `main` or choose an entire conflicting file without reviewing its contents.

After fixing a problem, run the workflow manually with **dry_run** checked. To publish, run again with **dry_run** unchecked during the authorized window: September 28 at 12:01 a.m. through September 29 at 12:01 a.m. Eastern time. There is one scheduled attempt, with manual retries available during this window. If the window has passed, set a new agreed publication window before retrying.

If merging succeeds but the deployment request fails, rerun the same workflow during the release window. If deployment starts but the Pages build or deployment fails, rerun the failed **Deploy website to GitHub Pages** workflow on `main`.

## Cancel or change the schedule

To cancel, disable **Scheduled portfolio merge** in GitHub Actions or close pull request #1 without merging. If a run is already in progress, cancel that run too. The job checks the pull request again immediately before pushing.

To reschedule, update both the cron expression in `.github/workflows/scheduled-merge.yml` and the `notBefore`/`expiresAt` timestamps in `.github/scheduled-release.json`. Update `displayTime` to match. The release window is limited to 24 hours. Keep the timezone conversion in mind: September's Eastern time is UTC-4.

The draft retains the original **September 2026** employment start month. The publication date controls when the content becomes visible, not the employment dates in the CV or Resume.

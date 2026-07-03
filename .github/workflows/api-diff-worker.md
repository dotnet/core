---
name: API Diff Worker
description: >
  Generate or refresh the public API diff report for a single in-flight .NET
  release milestone (incremental or major-to-major) from real published builds and
  open/update its draft pull request. Invoked per-target by the API Diff Orchestrator
  (workflow_call) or manually (workflow_dispatch).

if: ${{ github.event_name == 'workflow_dispatch' || !github.event.repository.fork }}

permissions:
  actions: read
  contents: read
  pull-requests: read
  issues: read

network:
  allowed:
    - defaults
    - dotnet
    - node
safe-outputs:
  # The maintained api-diff PR is created, updated, and pushed to entirely through
  # native gh-aw safe outputs -- the agent job stays read-only and every write runs in a
  # separate, permission-controlled job. allowed-files restricts every code write to the
  # api-diff report tree plus the two global exclusion files.
  create-pull-request:
    draft: true
    labels: [automation, api-diff]
    base-branch: main
    preserve-branch-name: true
    if-no-changes: "warn"
    # allowed-files is already an exclusive allowlist scoped to the api-diff report tree.
    # The orthogonal protected-files check matches basenames ANYWHERE (not just root-level), so
    # the per-folder api-diff/README.md index trips the default README.md protection. Exclude
    # only README.md so it passes, while every other protected basename (package.json,
    # global.json, the doc *.md files, etc.) stays protected even inside the allowed tree.
    protected-files:
      exclude:
        - README.md
    allowed-files:
      - "release-notes/*/preview/*/api-diff/**"
      - "release-notes/*/*.0/api-diff/**"
      - "release-notes/ApiDiffAttributesToExclude.txt"
      - "release-notes/ApiDiffAssembliesToExclude.txt"
  push-to-pull-request-branch:
    target: "*"
    required-labels: [automation, api-diff]
    if-no-changes: "ignore"
    protected-files:
      exclude:
        - README.md
    allowed-files:
      - "release-notes/*/preview/*/api-diff/**"
      - "release-notes/*/*.0/api-diff/**"
      - "release-notes/ApiDiffAttributesToExclude.txt"
      - "release-notes/ApiDiffAssembliesToExclude.txt"
  update-pull-request:
    target: "*"
    required-labels: [automation, api-diff]
    title: true
    body: true
  add-comment:
    target: "*"
    required-labels: [automation, api-diff]
    max: 1
  mark-pull-request-as-ready-for-review:
    target: "*"
    required-labels: [automation, api-diff]
  noop:
    report-as-issue: false
tools:
  # Full bash: the agent commits the generated reports, runs markdownlint, and fetches /
  # checks out the maintained PR branch. The AWF sandbox + firewall (network.allowed),
  # the read-only agent permissions, and the safe-outputs allow-lists are the boundaries.
  bash: [":*"]
timeout-minutes: 90

# The agent commits generated reports and checks out the maintained PR branch for incremental
# appends. fetch: ["*"] pre-fetches every branch during the credentialed host checkout, so the
# agent reaches the PR branch from an already-local ref -- the agent checkout does not persist
# credentials, so a runtime `git fetch origin <branch>` would otherwise fail.
checkout:
  fetch: ["*"]
  fetch-depth: 0

on:
  permissions: {}
  workflow_dispatch:
    inputs:
      target:
        description: "Single discovery target (JSON) from api-diff-discover.cs."
        required: true
        type: string
  workflow_call:
    inputs:
      target:
        description: "Single discovery target (JSON) from api-diff-discover.cs."
        required: true
        type: string

steps:
  - name: Set up target context and generate the API diff
    shell: bash
    env:
      TARGET: ${{ inputs.target }}
      GH_TOKEN: ${{ github.token }}
      GH_RUN_ID: ${{ github.run_id }}
    run: |
      set -euo pipefail
      bash .github/scripts/api-diff-generate.sh

post-steps:
  # After the agent runs (read-only) but before the native safe-output jobs publish, verify
  # every full-body pull-request write still carries the tracking identity the next run reads
  # back to resume: the `# api-diff:state:begin`/`:end` block, the identity marker, and the
  # current-version / generated-at fields that must match this run's host-authored target.json.
  # A body missing any of these would leave the next run unable to recover its place, so fail
  # before anything is published.
  - name: Validate agent output identity
    run: |
      set -euo pipefail
      out=/tmp/gh-aw/agent_output.json
      tgt=/tmp/gh-aw/agent/target.json
      if [ ! -f "$out" ]; then
        echo "::notice::No agent output to validate"; exit 0
      fi
      if [ ! -f "$tgt" ]; then
        echo "::error::target.json is missing but agent output exists -- refusing to publish"; exit 1
      fi
      t_marker=$(jq -r '.marker' "$tgt")
      t_cur=$(jq -r '.current_version' "$tgt")
      t_genat=$(jq -r '.generated_at' "$tgt")
      # Only full-body PR writes carry the tracking block. Validate create_pull_request and
      # full-replace update_pull_request items with a non-empty body; skip append/prepend
      # updates, comments, branch pushes, and no-ops (partial or bodyless).
      idx=$(jq -r '(.items // []) | to_entries[]
        | select(.value.type=="create_pull_request"
            or (.value.type=="update_pull_request"
                and ((.value.operation // "replace")=="replace")))
        | select((.value.body // "") != "")
        | .key' "$out" 2>/dev/null || true)
      if [ -z "$idx" ]; then
        echo "::notice::No full-body PR-writing items -- nothing to validate"; exit 0
      fi
      rc=0
      while IFS= read -r i; do
        [ -n "$i" ] || continue
        typ=$(jq -r ".items[$i].type" "$out")
        body=$(jq -r ".items[$i].body" "$out")
        miss=""
        # Extract the LAST `# api-diff:state:begin` .. `:state:end` block (the body ends with it),
        # matching each delimiter as a whole yaml-comment line (leading indent / trailing CR
        # tolerated) exactly as the next run's setup script reads it.
        blk=$(printf '%s' "$body" | awk '{t=$0;sub(/\r$/,"",t);gsub(/^[[:space:]]+|[[:space:]]+$/,"",t)} t=="# api-diff:state:begin"{inb=1;buf=$0 ORS;next} inb{buf=buf $0 ORS; if(t=="# api-diff:state:end"){inb=0;last=buf}} END{if(inb)last=buf; printf "%s", last}')
        printf '%s\n' "$body" | awk '{t=$0;sub(/\r$/,"",t);gsub(/^[[:space:]]+|[[:space:]]+$/,"",t)} t=="# api-diff:state:begin"{f=1} END{exit !f}' || miss="$miss begin-marker"
        printf '%s\n' "$body" | awk '{t=$0;sub(/\r$/,"",t);gsub(/^[[:space:]]+|[[:space:]]+$/,"",t)} t=="# api-diff:state:end"{f=1} END{exit !f}' || miss="$miss end-marker"
        [ "$(jq -rn --arg b "$body" --arg m "$t_marker" '($b | gsub("\r";"") | split("\n") | any(gsub("^[ \t]+|[ \t]+$";"") == "# " + $m))')" = "true" ] || miss="$miss identity-marker"
        mf_field() { sed -n "s/^[[:space:]]*[-*+>]*[[:space:]]*$1:[[:space:]]*//p" | head -1 | tr -d '"'\''\r' | sed 's/[[:space:]]*#.*$//; s/[[:space:]]*$//'; }
        [ "$(printf '%s\n' "$blk" | mf_field current-version)" = "$t_cur" ] || miss="$miss current-version"
        [ "$(printf '%s\n' "$blk" | mf_field generated-at)" = "$t_genat" ] || miss="$miss generated-at"
        if [ -n "$miss" ]; then
          echo "::error::$typ item #$i is missing required tracking identity:$miss"
          rc=1
        fi
      done <<< "$idx"
      [ "$rc" -eq 0 ] && echo "Agent output identity validated."
      exit $rc


# ###############################################################
# Select a PAT from the pool and override COPILOT_GITHUB_TOKEN.
# Run agentic jobs in an isolated `copilot-pat-pool` environment.
#
# When org-level billing is available, this will be removed.
# See `shared/pat_pool.README.md` for more information.
# ###############################################################
imports:
  - uses: shared/pat_pool.md
    with:
      environment: copilot-pat-pool

environment: copilot-pat-pool

engine:
  id: copilot
  env:
    COPILOT_GITHUB_TOKEN: |
      ${{ case(
        needs.pat_pool.outputs.pat_number == '0', secrets.COPILOT_PAT_0,
        needs.pat_pool.outputs.pat_number == '1', secrets.COPILOT_PAT_1,
        needs.pat_pool.outputs.pat_number == '2', secrets.COPILOT_PAT_2,
        needs.pat_pool.outputs.pat_number == '3', secrets.COPILOT_PAT_3,
        needs.pat_pool.outputs.pat_number == '4', secrets.COPILOT_PAT_4,
        needs.pat_pool.outputs.pat_number == '5', secrets.COPILOT_PAT_5,
        needs.pat_pool.outputs.pat_number == '6', secrets.COPILOT_PAT_6,
        needs.pat_pool.outputs.pat_number == '7', secrets.COPILOT_PAT_7,
        needs.pat_pool.outputs.pat_number == '8', secrets.COPILOT_PAT_8,
        needs.pat_pool.outputs.pat_number == '9', secrets.COPILOT_PAT_9,
        'NO COPILOT PAT AVAILABLE')
      }}
---

<!-- markdownlint-disable-next-line MD025 -->
# Write API Diff

You maintain a **public API diff report** for one in-flight .NET release diff in this
repository (dotnet/core). The report is factual: the `api-diff` skill's `RunApiDiff.ps1`
already generated it during setup from **real published builds** and staged it into the
working tree. Your job is to publish it as a pull request and keep its description
accurate — not to author prose. **Never merge**; humans merge.

## 1. Read your context

Read `/tmp/gh-aw/agent/target.json`:

- `track` — `incremental` (milestone-over-milestone) or `major-to-major` (cumulative vs prior major)
- `major`, `previous_version_milestone`, `current_version_milestone` — the diff identity (e.g. `11.0`, `10.0-ga`, `11.0-preview.7`)
- `previous_version`/`previous_feed`, `current_version`/`current_feed` — exact build versions + feeds
- `status` — `in-development` (PR stays DRAFT) or `code-complete` (PR is Ready for Review)
- `content_dir` — where the generated reports live
- `temporary_attributes_file` — the per-report `ApiDiffAttributesToExclude.txt` (temporary, diff-scoped)
- `permanent_attributes_file` — the global `release-notes/ApiDiffAttributesToExclude.txt`
- `permanent_assemblies_file` — the global `release-notes/ApiDiffAssembliesToExclude.txt`
- `marker`, `pr_title`, `tldr`, `status_note` — PR identity + description pieces (use verbatim)
- `target_branch` — the branch you publish to (already resolved, including any collision suffix)
- `existing_pr_number` — the open PR to update (empty = open a new one). This may be a PR the
  automation opened earlier **or** one a person bootstrapped and labeled `automation` + `api-diff`
  for the automation to take over; either way, treat it as yours and (re)write the identity marker
  into its body on this refresh.
- `produce` — **if `false`, STOP: emit a `noop` safe output and open no PR**
- `noop` — **if `true`, STOP: nothing changed (build unchanged, same status); emit a `noop` safe output and post no comment**
- `metadata_only` — the build is unchanged but the status flipped (draft→Ready). **Do
  not regenerate reports** (the staged reports are already correct); only
  refresh the body (advancing `generated_at`), flip draft→Ready if `status` is `code-complete`, and
  publish — even when no report file changed.
- `blocked` — a human already owns this diff (a non-automation `api-diff` PR touches this content).
  Treated as a no-op: do nothing.
- `generated_at` — this run's report-generation timestamp, captured before generation began. Stamp it
  into the PR body's yaml block as the new `generated_at`; the post-run validation checks the refreshed
  body carries this exact value.
- `report_count`, `temp_excluded_attributes`

**If `produce` is `false` or `noop` is `true`, emit a single `noop` safe output and otherwise do nothing**:
open/disturb no PR, post no comment. A no-op is the typical scheduled outcome and must be silent.

## 2. Commit the generated reports

The host setup already generated this run's reports into `content_dir` and **positioned the
working tree on the branch you publish to**: detached at the base commit for a **fresh** diff
(`existing_pr_number` empty), or checked out on the maintained PR branch `target_branch` for
an **incremental** update (`existing_pr_number` set). Normalize and commit the reports
(allow-listed paths only):

```bash
# markdownlint --fix the generated reports (collapse blank-line runs first) so the committed
# content is lint-clean.
find "<content_dir>" -type f -name '*.md' -print0 | while IFS= read -r -d '' f; do
  cat -s "$f" > "$f.sq" && mv "$f.sq" "$f"
  npx --yes markdownlint-cli@0.49.0 --config .github/linters/.markdown-lint.yml --fix "$f" >/dev/null 2>&1 || true
done
git add -A -- "<content_dir>" release-notes/ApiDiffAttributesToExclude.txt release-notes/ApiDiffAssembliesToExclude.txt
```

Then commit and, on the fresh path only, create the branch ref the safe output publishes:

```bash
if [ -z "<existing_pr_number>" ]; then
  # Fresh: commit on the detached base and name the branch (no switch, so the patch is only
  # your reports vs the base).
  git commit -m "API diff <previous_version_milestone> -> <current_version_milestone>"
  git branch "<target_branch>" HEAD
else
  # Incremental: the tree is already on <target_branch>; append the delta on top of its tip
  # (never amend/rebase/reset/force -- the branch history only ever grows).
  if git diff --cached --quiet; then
    echo "no report delta this run"
  else
    git commit -m "API diff <previous_version_milestone> -> <current_version_milestone>"
  fi
fi
```

**No-op guard.** On the incremental path, when `git diff --cached --quiet` shows no delta
**and** this is not a `metadata_only` refresh, nothing changed: emit a single `noop` and stop.
On a `metadata_only` refresh with no delta, make no commit but still refresh the body in step 4.

**markdownlint residual.** After `--fix`, run markdownlint once more over the reports
**without** `--fix`; if violations remain, include the `> [!NOTE]` described in step 4 in the
PR body.

Commit **only** the allow-listed files (reports under `content_dir` and the two global
`ApiDiff*ToExclude.txt` files). Do **not** push, switch branches, amend, rebase, or
force-push -- the safe-output jobs own all publishing.

## 3. Publish via native safe outputs

Publish through the native gh-aw safe outputs -- never a hand-rolled `gh pr` call. Use
`pr_title` from `target.json` **verbatim** as the PR title (e.g.
`API diff between .NET 11 Preview 6 and .NET 11 Preview 7`, or `API diff between .NET 10 and
.NET 11` for major-to-major; do not add a milestone to a major-to-major title -- the floating
milestone belongs in the body).

**Fresh** (`existing_pr_number` empty): emit one **`create-pull-request`** with `branch` =
`target_branch`, `title` = `pr_title`, and `body` = the full PR description (see "### PR
description" below). It is created as a draft (policy) and labeled `automation` + `api-diff`
automatically.

**Incremental** (`existing_pr_number` set): emit these, each targeting `existing_pr_number`:

- **`push-to-pull-request-branch`** (`pull_request_number` = `existing_pr_number`) -- pushes
  the commit you appended to the PR branch. Emit it even when there was no report delta this
  run; with no new commit it is a no-op (`if-no-changes: ignore`).
- **`update-pull-request`** (`pull_request_number` = `existing_pr_number`, full-body
  **replace**) -- regenerate the **entire** PR body to the current state (see "### PR
  description") and set the title to `pr_title`. Always refresh the body, even on a
  metadata-only run whose report delta is empty, so the description never goes stale.
- **`add-comment`** (`pull_request_number` = `existing_pr_number`) -- one short summary of
  what changed this run (reports refreshed or metadata-only). At most one.

**Mark Ready** -- when `target.json.status` is `code-complete`, also emit
**`mark-pull-request-as-ready-for-review`** (`pull_request_number` = `existing_pr_number`) so
the finished diff leaves draft. Emit it only when `status` is `code-complete` (never while
`in-development`); it is harmless if the PR is already ready. On a **fresh** PR that is already
`code-complete`, the next scheduled run (which sees it as incremental) performs the flip.

**markdownlint note** -- when markdownlint violations remained after `--fix` (step 3), prepend
a `> [!NOTE]` block to the very top of the PR body (above the TL;DR block below) stating that
markdownlint found issues it could not auto-fix, the reports were published as-is, and the
repo's **markdown-lint CI check will fail** on this PR until a team member resolves them. Omit
it entirely when no violations remained.

### PR description (`body`)

**Start the body with a `> [!NOTE]` block**: the `tldr` from `target.json`, then a blank
quote line, then the `status_note` on its own line (verbatim from `target.json`):

```text
> [!NOTE]
> <tldr from target.json>
>
> <status_note from target.json>
```

Then, succinct and factual:

1. One line: what this diffs — `<previous_version_milestone>` (`previous_version`) -> `<current_version_milestone>` (`current_version`), and the track.
2. **How this was generated** — the `api-diff` skill / `RunApiDiff.ps1`; the exact
   `previous_version`@`previous_feed` and `current_version`@`current_feed`;
   `generated_at`; `report_count` files. For **major-to-major**, note
   it is the cumulative diff vs the prior major and refreshes as the head advances.
3. **Status** — `in-development` (draft while the major is still the in-development
   frontier on `main`) or `code-complete` (Ready for Review, once `main` has forked
   to the next major).
4. **Exclusions applied** — the exclusions now in effect. List **temporary attribute**
   exclusions (`temp_excluded_attributes`), and separately note any **permanent attribute** or
   **permanent assembly** exclusions in the global files. "None." only if all are empty.
5. A fenced ```yaml``` block carrying the machine-managed state, delimited by visible marker comments.
   **The first line inside the block is `# api-diff:state:begin` and the last line is
   `# api-diff:state:end`**; immediately after the begin line comes the identity marker,
   verbatim from `target.json`'s `marker` (i.e. `# <marker>`). All are visible YAML comments, never HTML
   comments (hidden markers trip content scanners). The begin/end lines delimit the state so the next run
   reads it back scoped to this block -- human prose added elsewhere in the body cannot shadow it -- and
   the identity marker is the stable handle the automation uses to find this diff's PR. Emit the begin/end
   lines exactly as shown. All must be present and exact:

   ```yaml
   # api-diff:state:begin
   # <marker from target.json>
   track: "<track>"
   previous-version-milestone: "<previous_version_milestone>"
   current-version-milestone: "<current_version_milestone>"
   previous-version: "<previous_version>"
   current-version: "<current_version>"
   previous-feed: "<previous_feed>"
   current-feed: "<current_feed>"
   status: "<status>"
   report-count: <report_count>
   generated-at: "<generated_at>"
   temporary-attributes-excluded: [<the per-report temporary attribute exclusions, T: form>]
   # api-diff:state:end
   ```

   The `# api-diff:state:begin`/`:end` delimiters, the `# <marker>`, `current-version`, and
   `generated-at` lines are required and machine-parsed; the post-steps validation rejects any
   full-body PR write (create-pull-request / full-replace update-pull-request) whose body is
   missing any of them.

## Invariants

- PRs are **always created as drafts**; flip to Ready for Review (via
  `mark-pull-request-as-ready-for-review`) only when `status` is `code-complete`. Never
  un-ready; never merge.
- `produce == false` **or** `noop == true` **or** `blocked == true` -> emit a `noop`; no PR, no comment.
- `metadata_only == true` -> publish the body/ready refresh even when no report file changed
  (do not treat "no file change" as a no-op); do not regenerate reports.
- Add/modify **only** the allowed files (reports under `content_dir`, the per-report
  `ApiDiffAttributesToExclude.txt` **only when temporary exclusions apply**, and the two global
  `release-notes/ApiDiff*ToExclude.txt` files). One PR per diff, identified by the marker.
- The identity marker lives as a **visible YAML comment** in the body's state block — never an HTML
  comment. The post-steps validation re-checks each full-body PR write against `target.json`
  (body marker / current-version / generated-at) and fails the run on drift.

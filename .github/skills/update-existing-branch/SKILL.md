---
name: update-existing-branch
description: >
  Refresh an existing .NET release-notes milestone branch or PR incrementally.
  Checks whether the VMR ref moved, regenerates `changes.json` only when needed,
  merges the delta into `features.json`, integrates new material into existing
  markdown clusters, and responds to review feedback. USE FOR: reruns on a
  populated release-notes branch. DO NOT USE FOR: first-pass generation of a new
  milestone (use generate-changes, generate-features, and release-notes).
---

# Update Existing Branch

Use this skill when the milestone branch already exists and contains drafted
markdown, `features.json`, reviewer comments, or human edits.

This is the **incremental rerun** stage of the release-notes pipeline. It is the
branch-maintenance equivalent of what `editorial-scoring` is for scoring: the
canonical place to describe how follow-up runs should behave.

## Purpose

Treat the existing branch as the **working baseline**, not as a blank slate.

The goal is to:

1. refresh shipped-change data only when the preview actually moved forward
2. score and write the **delta**, not the whole release again
3. preserve human edits and reviewer-driven rewrites
4. integrate new material into the current story cleanly

## Inputs

Read these before making changes:

1. the current milestone branch and PR
2. the existing `changes.json`, `features.json`, and markdown files
3. `build-metadata.json`, if present
4. unresolved PR review comments and discussion threads

## Process

### 1. Check whether the preview moved forward

Determine whether later `dotnet/dotnet` codeflow commits landed for the same
preview branch or tag since the last run.

If the relevant VMR ref moved forward, regenerate `changes.json`. If it did not,
keep the current file and focus on editorial fixes and comment responses.

Typical signals:

- later commits on `dotnet/dotnet` for `release/<major>.0.1xx-previewN`
- a newer release-branch head than the one captured in `build-metadata.json`
- new source-manifest commits for a component already discussed in the draft

### 2. Compute a delta from the existing files

If you refreshed `changes.json`, compare the old and new files by stable `id`.

Classify changes as:

- **added** — new shipped items not seen in the last run
- **changed** — same `id`, but new evidence, labels, revert state, or reviewer context changes the treatment
- **removed or superseded** — no longer relevant to the current build story, or later evidence shows the original interpretation was wrong
- **unchanged** — keep the prior editorial work

Do **not** treat a refreshed `changes.json` as permission to restart the whole
release from zero.

### 3. Merge into the existing `features.json`

When `features.json` already exists, use it as the editorial baseline and merge
the delta into it.

Preserve prior annotations for unchanged entries, including:

- `score`
- `score_reason`
- `score_breakdown`
- `breaking_changes`
- `reverted_by` / `reverts`
- useful human notes or hand-tuned annotations

Only rescore:

- newly added entries
- materially changed entries
- earlier entries that reviewers explicitly questioned or that new evidence disproved

This should feel like a **delta merge**, not a full rescore.

### 4. Update markdown in place

Use the current draft as the starting point. Prefer **integration** over
duplication.

Examples:

- add a new GC item into an existing **Garbage Collection Performance Improvements** section
- extend an existing **Unsafe Evolution** block instead of creating a second heading
- move a newly demoted item into **Bug fixes** instead of deleting the story without explanation

Keep the existing structure when it still works. Add a new top-level section
only when the delta introduces a genuinely new story.

### 5. Treat review comments as required inputs

Unresolved PR comments are part of the spec for the next run.

- read them before rewriting anything
- answer factual questions with evidence from `changes.json`, VMR refs, API verification, or the final build
- update the markdown when the reviewer is right
- if the reviewer is directionally right but the current build still contains the feature, explain the milestone and branch context clearly

### 6. Default outcome

For an existing release-notes branch, the normal loop is:

1. refresh `changes.json` only if the preview moved forward
2. merge the delta into `features.json`
3. update the existing markdown in place
4. respond to comments and questions
5. push a follow-up commit to the same PR

This keeps the branch stable for reviewers and avoids throwing away already
curated editorial work.

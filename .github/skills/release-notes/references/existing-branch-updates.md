# Existing Branch Updates

How to update a populated milestone branch or PR without effectively starting over.

This is the **incremental rerun** path for `release-notes`. Use it when the
branch already has drafted markdown, reviewer comments, or human edits.

## Core principle

Treat the current branch as the **working baseline**:

- refresh the shipped data when the preview moved forward
- score and write the **delta**, not the whole release again
- preserve human edits, reviewer-driven rewrites, and established clusters

## 1. Check whether the preview moved forward

Before changing the draft, determine whether later `dotnet/dotnet` codeflow
commits landed for the same preview branch or tag since the last run.

If the relevant VMR ref moved forward, regenerate `changes.json`. If it did not,
keep the existing file and focus on comments and editorial refinements.

Typical signals:

- later commits on `dotnet/dotnet` for `release/<major>.0.1xx-previewN`
- a newer release-branch head than the one captured in `build-metadata.json`
- new source-manifest commits for a component that already has a section in the draft

## 2. Compute a delta from the existing files

If you regenerated `changes.json`, compare the old and new files by stable `id`.

Classify entries as:

- **added** — new shipped changes not seen in the last run
- **changed** — same `id`, but new evidence, labels, revert state, or reviewer context affects how it should be handled
- **removed or superseded** — no longer relevant to the current build story, or later evidence shows the original interpretation was wrong
- **unchanged** — keep the prior editorial work

Do **not** treat a refreshed `changes.json` as a reason to rescore everything.

## 3. Merge with the existing `features.json`

When `features.json` already exists, use it as the baseline and merge the delta
into it.

For unchanged entries, preserve existing:

- `score`
- `score_reason`
- `score_breakdown`
- `breaking_changes`
- `reverted_by` / `reverts`
- useful human notes or hand-tuned annotations

Only score:

- newly added entries
- entries whose meaning materially changed
- earlier entries that reviewers explicitly questioned or new evidence disproved

In other words: **delta scoring, not full rescoring**.

## 4. Update markdown in place

Use the current draft as the starting point. Prefer **integration** over
duplication.

Examples:

- add a new GC item into an existing **Garbage Collection Performance Improvements** section
- extend an existing **Unsafe Evolution** block instead of creating a second heading
- move a newly demoted item into **Bug fixes** instead of deleting the story without explanation

Keep the current structure when it still works. Only introduce a new top-level
section when the delta really adds a new story.

## 5. Treat review comments as required inputs

Unresolved PR comments are part of the spec for the next run.

- read them before rewriting anything
- answer factual questions with evidence from `changes.json`, VMR refs, API verification, or the final build
- update the markdown when the reviewer is right
- if the reviewer is directionally right but the current build still contains the feature, explain the milestone/branch context

## 6. Default outcome

For an existing release-notes branch, the default loop is:

1. refresh `changes.json` only if the preview moved forward
2. merge the delta into `features.json`
3. update the existing markdown in place
4. respond to comments and questions
5. push a follow-up commit to the same PR

This keeps the branch stable for reviewers and prevents the agent from throwing
away already-curated editorial work.

---
name: api-diff-validation
description: >
  Validate that a generated API diff matches the APIs actually shipped in a .NET
  build, and that every new API traces to a real change. Uses dotnet-inspect to
  query the build's ref packs and cross-references new APIs against candidate PRs
  to catch missed reverts, renames, and kept-internal APIs before they reach
  release notes. Distinct from the pure api-diff skill, which only generates the
  diff reports.
---

# API Diff Validation

Confirm that the **public APIs claimed by an API diff actually shipped** in the
target build, and that each new API traces to a real PR. This is the verification
layer on top of the pure `api-diff` skill (which only produces the diff reports).

Use it to catch, before release notes are written:

- APIs present in the diff but **missing from the shipped build** (a missed revert,
  a rename, or an API kept internal),
- new APIs with **no implementing PR** (suspicious / mis-attributed).

## Inputs

- A generated API diff for the milestone (the `api-diff/` reports), or the target
  release identity.
- **`build-metadata.json`** — `nuget.source` (the dnceng `dotnet<major>` feed) and
  the ref-pack package versions for the exact build.
- The milestone's `changes.json` / candidate PRs (for cross-referencing).

`dotnet-inspect` is used here as a **tool**, not a separate skill: it reflects over
the real ref packs from the build's feed, so it answers "does this API exist in
*this* build?" authoritatively.

## 1. Point at the right build (never the locally-installed SDK)

Read `build-metadata.json` for the target. Use its `nuget.source` as `$FEED` and
the ref-pack versions (e.g. `Microsoft.NETCore.App.Ref@<version>`) as `$VER`. For
behavior that requires the SDK (rare here), install it side-by-side and scoped —
see the `validate-code-samples` skill. Do **not** trust a machine-wide SDK for
preview work.

## 2. Verify APIs exist with dotnet-inspect

```bash
# Does a new type/member exist in the build's ref pack?
dnx dotnet-inspect -y -- find "*AnyNewLine*" \
  --package "Microsoft.NETCore.App.Ref@${VER}" --source "$FEED"

# Enumerate a type's members to confirm a signature.
dnx dotnet-inspect -y -- member RegexOptions \
  --package "Microsoft.NETCore.App.Ref@${VER}" --source "$FEED" -k field

# Diff the public API between two builds (sanity-check the generated diff).
dnx dotnet-inspect -y -- diff \
  --package "Microsoft.NETCore.App.Ref@${PREV}..${VER}" --source "$FEED"
```

For each API the diff claims is new, confirm it is present. If an API is **missing
from the build**, treat it as a serious signal: it may have been renamed, kept
internal, or reverted after the diff was captured — flag it for exclusion.

## 3. Cross-reference new APIs against candidate PRs

For each new API/namespace in the diff, verify at least one candidate PR (from
`changes.json`) covers it. If an API has **no matching PR**, search for the
implementing PR explicitly before trusting it:

```bash
gh search prs --repo dotnet/<repo> --merged "<distinctive API name>" \
  --json number,title,mergedAt,url
```

If no implementing PR can be found and `dotnet-inspect` cannot confirm the API,
do not document it.

## 4. Detect missed reverts

An API may appear in the diff yet have been **backed out** later. Confirm presence
in the build with `dotnet-inspect` (step 2) and check for a follow-up revert PR:

```bash
gh search prs --repo dotnet/<repo> --state merged \
  "\"This reverts\" <pr-number>" --json number,title,url
```

If the API is absent from the build or a merged revert exists, mark the feature as
reverted (suppress it / score it down in `features.json`).

## 5. Report

Emit a concise verdict per checked API: **present** (with PR), **missing**
(rename/internal/revert — exclude), or **unverified** (describe without naming the
type). Scope the report to the documented/announced surface; do not surface
undocumented deltas.

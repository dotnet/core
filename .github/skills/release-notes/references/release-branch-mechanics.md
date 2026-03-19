# Release Branch Mechanics

How .NET preview releases are built across source repos and the VMR. Understanding this flow is essential for correctly targeting VMR references and interpreting commit history.

## The release flow

Each .NET preview follows this sequence:

1. **Code Complete** — source repos (`dotnet/runtime`, `dotnet/aspnetcore`, etc.) fork a release branch from `main`.
2. **Stabilization** — source repos fix bugs and revert problematic changes on their release branches. New feature work continues on `main`.
3. **VMR fork** — the VMR (`dotnet/dotnet`) forks its own release branch from `main`, typically ~22 hours after source repos fork.
4. **VMR stabilization** — source repo release branch changes flow into the VMR release branch via automated sync commits (`[release/...] Source code updates from dotnet/<repo>`). This continues for days/weeks.
5. **Release** — the VMR release branch tip is tagged (e.g., `v11.0.100-preview.2.26159.112`) and the release ships.

## Branch naming across repos

| Repo | Branch pattern | Example |
|------|---------------|---------|
| `dotnet/runtime` | `release/<MAJOR>.<MINOR>-preview<N>` | `release/11.0-preview2` |
| `dotnet/aspnetcore` | `release/<MAJOR>.<MINOR>-preview<N>` | `release/11.0-preview2` |
| `dotnet/sdk` | `release/<MAJOR>.<MINOR>.1xx-preview<N>` | `release/11.0.1xx-preview2` |
| `dotnet/dotnet` (VMR) | `release/<MAJOR>.<MINOR>.1xx-preview<N>` | `release/11.0.1xx-preview2` |

## Branch topology

Preview release branches are **not linear ancestors** of each other. Each preview forks from `main` independently:

```
main:  ──────[P2 fork]────────────────────[P3 fork]────────────▶
                  │                             │
                  ▼                             ▼
              P2 release branch             P3 release-pr branch
              ├─ 48 stabilization commits   ├─ 1 release prep commit
              └─▶ [P2 tag]                  └─▶ [P3 head]
```

This means:
- The P2 tag is **not** an ancestor of the P3 reference — they diverged from `main` at different points
- `git log <P2-tag>..<P3-ref>` gives a **misleading** commit list (includes divergent history)
- `git diff <P2-tag>..<P3-ref>` gives the **correct code delta** (actual content difference)

## Source repo vs VMR timing

Using .NET 11 Preview 2 as an example:

| Event | Runtime | VMR |
|-------|---------|-----|
| Fork from main | Feb 17 01:19 UTC | Feb 17 23:33 UTC (~22h later) |
| Commits past fork | 2 (both reverts) | 48 (syncs from all source repos) |
| Tag date | Feb 27 | Mar 9 (10 days later) |

The VMR tag comes last because it aggregates stabilization fixes from **all** source repos. Runtime may tag in days, but the VMR waits until all repos' changes are synced and the full product builds.

## VMR stabilization commits

The 48 commits on the VMR P2 release branch are automated syncs from source repo release branches:

```
[release/11.0.1xx-preview2] Source code updates from dotnet/efcore (#5304)
[release/11.0.1xx-preview2] Source code updates from dotnet/fsharp (#4993)
[release/11.0.1xx-preview2] Source code updates from dotnet/winforms (#5003)
[release/11.0.1xx-preview2] Source code updates from dotnet/runtime (#5001)
```

These represent **stabilization fixes** — bug fixes, reverts, and polish applied to the release branch after Code Complete. They are P2 work, not P3 new development.

## VMR reference types

| Reference | Pattern | When it exists | Use for |
|-----------|---------|----------------|---------|
| Release tag | `v11.0.100-preview.2.26159.112` | After release ships | Previous release (base ref) |
| Release-PR branch | `release-pr-11.0.100-preview.3.26168.106` | During release build | Current in-progress release |
| Long-lived branch | `release/11.0.1xx-preview2` | During stabilization | Not used for release notes |
| `darc-release/*` branches | `darc-release/11.0.1xx-preview2-<guid>` | During dependency flow | Not used for release notes |

Tags come in pairs — runtime and SDK versions pointing to the same commit:
- Runtime: `v11.0.0-preview.2.26159.112`
- SDK: `v11.0.100-preview.2.26159.112`

## Finding the previous release tag from release.json

The **exact** previous release version is recorded in this repo's release metadata:

```
release-notes/<MAJOR>.0/preview/<previous-preview>/release.json
→ .release.runtime.version  (e.g., "11.0.0-preview.2.26159.112")
```

Map that version to VMR tags: `v11.0.0-preview.2.26159.112` (runtime) or `v11.0.100-preview.2.26159.112` (SDK).

## Correct comparison strategy

### For commit enumeration (PR discovery)

Find the **fork points on main** and enumerate commits between them:

```bash
P2_FORK=$(git merge-base origin/main <P2-tag>)
P3_FORK=$(git merge-base origin/main origin/<P3-ref>)
git log --oneline $P2_FORK..$P3_FORK
```

This gives the clean list of main-branch commits representing new development work in P3. The P2 stabilization commits (48 in the P2 example) are excluded — they are P2 fixes, not P3 features.

### For code verification (confirming a PR shipped)

Use the actual release references for code-level checks:

```bash
# Verify a specific file has the expected changes at the release ref
git diff <P2-tag>..<P3-ref> -- src/<component>/<file>

# Search for a symbol at the release ref
git grep "<symbol>" origin/<P3-ref> -- src/<component>/
```

### For date range derivation

Extract from the main-branch commit range:

```bash
# Earliest new commit after P2 fork
git log --format="%ci" $P2_FORK..$P3_FORK | tail -1

# Latest commit before P3 fork
git log --format="%ci" $P2_FORK..$P3_FORK | head -1
```

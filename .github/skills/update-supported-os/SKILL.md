---
name: update-supported-os
description: >
  Audit and update supported-os.json/md files to reflect current OS version
  support. Uses the dotnet-release tool for automated verification against
  upstream lifecycle data and markdown regeneration. USE FOR: adding new OS
  versions, moving EOL versions to unsupported, periodic support matrix audits.
  DO NOT USE FOR: os-packages.json changes (use update-os-packages skill),
  editing supported-os.md directly (it is generated from JSON).
---

# Update Supported OS

Audit and update `supported-os.json` files in this repository. These files declare which operating system versions are supported for each .NET release. The corresponding `supported-os.md` files are generated from JSON — never hand-edit them.

## When to use

- A new OS version is released (e.g. Ubuntu 26.04, Fedora 44, Alpine 3.23)
- An OS version reaches end-of-life and should be moved to unsupported
- Periodic audit to ensure the support matrix is current

## Prerequisites — pre-flight checks

Before starting any work, verify all required tools are available. Install anything missing automatically.

### 1. GitHub CLI

```bash
gh --version
```

If not installed, stop and ask the user to install it — the rest of the workflow depends on it.

### 2. Node.js (for markdownlint)

```bash
node --version && npx --version
```

If not available, install via the system package manager:

```bash
# macOS
brew install node

# Linux (Debian/Ubuntu)
sudo apt-get install -y nodejs npm
```

If installation fails, note this to the user and continue — markdownlint will be skipped but CI will catch issues.

### 3. dotnet-release tool

```bash
dotnet-release --version
```

If not installed, install it. GitHub Packages requires `read:packages` scope on the `gh` CLI token.

**Check if the scope is already granted:**

```bash
gh api /user/packages?package_type=nuget --jq '.[0].name' 2>&1
```

If this returns a 403, add the scope:

```bash
gh auth refresh -s read:packages
```

> The authorization prompt lists **all** granted scopes (existing + new), not just the new one — this is expected and not a sign of over-permissioning.

Then configure the NuGet source and install:

```bash
dotnet nuget add source https://nuget.pkg.github.com/richlander/index.json \
  --name github-richlander \
  --username "$(gh api user --jq '.login')" \
  --password "$(gh auth token)" \
  --store-password-in-clear-text

dotnet tool install -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json \
  --version "0.*"
```

In GitHub Actions, `GITHUB_TOKEN` is available automatically with packages access.

## Inputs

The user provides:

- **Versions to audit** — which .NET versions to check (e.g. "8.0+", "10.0 only"), defaults to all active versions
- Optionally, specific distros or OS versions to focus on

## Process

### 1. Verify — check for issues (early out)

Run the verify command for each .NET version to audit:

```bash
dotnet-release verify supported-os <version> release-notes
```

Examples:

```bash
# Check 10.0 against local files
dotnet-release verify supported-os 10.0 release-notes

# Check against live data on GitHub (no local clone needed)
dotnet-release verify supported-os 10.0
```

**Interpret the exit code:**

- **Exit code 0** — No issues found. Stop here — nothing to do.
- **Exit code 2** — Issues found. The report is written to stdout as markdown. Proceed to step 2.

The report uses GitHub callout blocks to categorize issues:

| Callout | Meaning | Action |
| --------- | --------- | -------- |
| `> [!WARNING]` | EOL but still listed as supported | Move to `unsupported-versions` (see ESU exception below) |
| `> [!IMPORTANT]` | Active release not listed | Consider adding to `supported-versions` |
| `> [!TIP]` | Active but listed as unsupported | Verify this is intentional (no action usually needed) |
| `> [!CAUTION]` | Approaching EOL within 3 months | Informational — no immediate action |

> **ESU exception:** Windows versions with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview) remain supported even after their mainstream EOL date. Check the `notes` field in `supported-os.json` — if a version has an ESU note, keep it in `supported-versions` and ignore the WARNING.

See [references/verify-output-example.md](references/verify-output-example.md) for example output.

If all versions return exit code 0, the matrix is current. **Stop here.**

### 2. Determine scope of changes

Act on the verify report automatically — the user will review the resulting PR:

- **WARNING items** (EOL but supported) — always fix: move to `unsupported-versions`. Exception: Windows versions with ESU notes in the JSON stay in `supported-versions`.
- **IMPORTANT items** (missing active releases) — always fix: add to `supported-versions`
- **TIP items** (active but unsupported) — skip, these are intentionally excluded
- **CAUTION items** (approaching EOL) — informational only, no JSON changes needed

Do not prompt the user to confirm individual changes. Apply all WARNING and IMPORTANT fixes, then create a PR for review.

After applying changes, summarize the CAUTION items to the user so they have visibility into what's coming in the next 3 months. Format as a brief list noting which versions are approaching EOL and their dates.

### 3. Apply changes to supported-os.json

For each confirmed change, edit `release-notes/<version>/supported-os.json`:

- **Move EOL versions**: Remove from `supported-versions`, add to `unsupported-versions`
- **Add new versions**: Insert into `supported-versions` (keep sorted, newest first)
- **Update `last-updated`**: Set to today's date (format: `YYYY-MM-DD`)
- Use the `edit` tool for surgical JSON changes
- Versions are strings, not numbers — `"3.22"` not `3.22`

### 4. Regenerate markdown

After updating the JSON, regenerate the markdown file:

```bash
dotnet-release generate supported-os <version> release-notes
```

This overwrites `supported-os.md` with content derived from the updated JSON.

> **Important:** Do not hand-edit `supported-os.md`. It is generated from JSON by the tool. If the markdown output needs to change, update the generator or its [Markout](https://github.com/richlander/markout) template in [dotnet-release](https://github.com/richlander/dotnet-release) instead.

### 5. Run markdownlint

Before committing, verify the generated markdown passes linting:

```bash
npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/<version>/supported-os.md
```

If `npx` is not available (Node.js was not installed during pre-flight), skip this step and note to the user that markdownlint was skipped. CI runs markdownlint via super-linter and will catch any issues.

If linting fails, fix the generator or Markout library — do not patch the markdown by hand.

### 6. Cross-reference with os-packages.json

Check if any newly added distro versions need entries in `os-packages.json`. If so, inform the user to run the `update-os-packages` skill next.

### 7. Validate changes

1. Run verify again to confirm issues are resolved:

   ```bash
   dotnet-release verify supported-os <version> release-notes
   ```

   Expect exit code 0 (or only TIP/CAUTION items remaining).

2. Spot-check the generated markdown renders correctly.

### 8. Cross-repo impact

OS version changes here also affect build and test infrastructure in other repos. After creating the PR in dotnet/core, search for Dockerfiles and Helix YAML files that reference the added or removed OS versions and file issues or PRs in the affected repos.

**Primary repos:**

- [dotnet/dotnet-buildtools-prereqs-docker](https://github.com/dotnet/dotnet-buildtools-prereqs-docker) — container images used for building and testing. New OS versions need new Dockerfiles; EOL versions should be removed.
- [dotnet/runtime](https://github.com/dotnet/runtime) — Helix queue YAML files and pipeline definitions reference OS-specific container images.

**Branches to check in dotnet/runtime:**

Check `main` **and** all active `release/` branches. The set of active release branches corresponds to supported .NET versions (check `releases.md` or `release-notes/releases-index.json` in this repo for the current list).

```bash
# If dotnet/runtime is cloned locally, search across branches:
cd ~/git/runtime
git fetch origin

# Check main
git grep -l "alpine-3.20\|Alpine.320" origin/main -- eng/pipelines/

# Check each active release branch
for branch in origin/release/10.0 origin/release/9.0 origin/release/8.0; do
  echo "=== $branch ==="
  git grep "alpine-3.20\|Alpine.320" "$branch" -- eng/pipelines/ || echo "  (none found)"
done
```

If the repo is not cloned locally, use the GitHub API:

```bash
# Check a specific branch via GitHub API
gh api repos/dotnet/runtime/contents/eng/pipelines/helix-platforms.yml?ref=release/10.0 \
  --jq '.content' | base64 -d | grep -i "alpine.*3.20"
```

> **Why release branches matter:** Per the [OS onboarding guide](https://github.com/dotnet/runtime/blob/main/docs/project/os-onboarding.md), EOL OS references in release branches should be remediated to avoid compliance issues. Alpine is especially prone to needing backports due to its short support window.

**What to search for:**

For **new OS versions**, check if container images and Helix queues exist:

```bash
# In dotnet-buildtools-prereqs-docker — look for Dockerfiles
gh search code "FROM alpine:3.23" --repo dotnet/dotnet-buildtools-prereqs-docker
gh search code "FROM debian:13" --repo dotnet/dotnet-buildtools-prereqs-docker

# In dotnet/runtime — look for Helix queue references (main + release branches)
grep -rn "alpine" eng/pipelines/ # if cloned locally
```

For **removed/EOL OS versions**, check if stale references remain:

```bash
# Search across all branches locally
git grep "alpine-3.20\|Alpine.320" origin/main origin/release/10.0 origin/release/9.0 -- eng/pipelines/
```

**Key files in dotnet/runtime:**

- `eng/pipelines/helix-platforms.yml`
- `eng/pipelines/coreclr/templates/helix-queues-setup.yml`
- `eng/pipelines/installer/helix-queues-setup.yml`
- `eng/pipelines/libraries/helix-queues-setup.yml`
- `eng/pipelines/common/templates/pipeline-with-resources.yml`

**Org-wide search for deprecated OS references:**

After auditing the primary repos, search the entire `dotnet` org for YAML files that still reference deprecated OS versions. Use `gh search code` with sleeps between queries to stay within the 10 req/min rate limit.

Search using three pattern types derived from dotnet/runtime conventions:

1. **Container image tags** — `prereqs:{distro}-{version}` (e.g. `prereqs:debian-11`, `prereqs:ubuntu-20.04`, `prereqs:opensuse-15.5`)
2. **Helix queue names** — `{Distro}.{Version}` with dots, no dashes (e.g. `Debian.11`, `Ubuntu.2004`, `openSUSE.15.5`, `Alpine.321`)
3. **Codenames** — Debian/Ubuntu codenames (e.g. `bullseye`, `focal`, `jammy`)

```bash
# Example: search for Debian 11 references across the org
# Sleep 7s between searches to respect rate limit (10 req/min)
gh search code --owner dotnet --language yaml '"prereqs:debian-11"' --limit 30
sleep 7
gh search code --owner dotnet --language yaml '"Debian.11"' --limit 30
sleep 7
gh search code --owner dotnet --language yaml bullseye --limit 30
sleep 7
```

Skip `dotnet/dotnet` (VMR) — it mirrors source repos so findings there should be addressed in the source repo instead.

After collecting results, verify each finding is still present on the default branch:

```bash
gh api repos/dotnet/{repo}/contents/{path} --jq '.content' | base64 -d | grep -i '{pattern}'
```

**File tracking issues on affected repos:**

File a tracking issue on each affected repo (not just runtime and prereqs). Each issue should:

1. Link back to the parent tracking issues: `dotnet/core` OS tracking issue, `dotnet/runtime` pipeline issue, and `dotnet/dotnet-buildtools-prereqs-docker` container image issue.
2. Include a checklist of specific files to update.
3. Include commit-pinned links to the affected lines (get the HEAD SHA with `gh api repos/dotnet/{repo}/commits/{branch} --jq '.sha'`).
4. End with attribution — note that the issue was generated by GitHub Copilot CLI (include version) via the [`update-supported-os`](https://github.com/dotnet/core/blob/main/.github/skills/update-supported-os/SKILL.md) skill.

Example issue body for a downstream repo:

```markdown
An org-wide audit of the dotnet org against the [.NET supported OS matrix](...) found a reference to {OS version}, which {reached EOL on date / reaches EOL on date}.

Part of [.NET OS Support Tracking](https://github.com/dotnet/core/issues/NNNN). See also: [dotnet/runtime#NNNN](...), [dotnet/dotnet-buildtools-prereqs-docker#NNNN](...).

## Tracking

- [ ] Update `{pattern}` in `{file}`

## Details

https://github.com/dotnet/{repo}/blob/{sha}/{path}
```

**Actions for primary repos:**

File tracking issues on both `dotnet/runtime` and `dotnet/dotnet-buildtools-prereqs-docker` with checklists covering all findings.

**For `dotnet/runtime`** — file a single issue covering `main` and all active release branches:

1. **Start with the high-level view** — a tracking checklist grouped by urgency (EOL now, approaching EOL, cleanup), with each item noting the branch, old → new version, and whether it's a helix (testing) or build image reference.
2. **Include a details section** with commit-pinned links to the specific lines — use bare URLs on their own line so GitHub renders the code inline.
3. **Distinguish helix vs build images** — helix images are for testing, build images are in `pipeline-with-resources.yml` and `platform-matrix.yml`.
4. **End with attribution** — note that the issue was generated by GitHub Copilot CLI (include version) via the [`update-supported-os`](https://github.com/dotnet/core/blob/main/.github/skills/update-supported-os/SKILL.md) skill.

**For `dotnet/dotnet-buildtools-prereqs-docker`** — file a separate issue covering container image cleanup and provisioning:

1. **EOL images to remove** — Dockerfiles for OS versions that are EOL.
2. **Approaching EOL** — images that will need removal soon.
3. **Stale images** — older versions no longer referenced in runtime pipelines. For Alpine, only the latest release + edge should be kept.
4. **New images to provision** — upcoming OS versions that should be provisioned ahead of need. For example, when Fedora N is current, Fedora N+1 images should be created proactively so they're ready before N reaches EOL.

Example checklist format:

```markdown
### EOL — fix now

- [ ] `main` — openSUSE 15.5 → 16.0 (helix)
- [ ] `release/8.0` — Ubuntu 20.04 → 22.04 (build image)

### Approaching EOL — fix within 3 months

- [ ] `main` — Debian 12 (EOL 2026-06-10) → 13 (helix)
```

Reference the [OS onboarding guide](https://github.com/dotnet/runtime/blob/main/docs/project/os-onboarding.md) in the issue body for context.

**Container image guidelines for `dotnet/dotnet-buildtools-prereqs-docker`:**

- **Alpine:** Keep only the latest stable release + edge. Remove older versions once runtime pipelines have moved off them.
- **`-WithNode` variant retired:** The old `-WithNode` Alpine image flavor (e.g. `prereqs:alpine-3.19-WithNode`) has been retired. The standard helix images (e.g. `prereqs:alpine-3.23-helix-amd64`) are the replacement. See [dotnet/dotnet-buildtools-prereqs-docker#990](https://github.com/dotnet/dotnet-buildtools-prereqs-docker/issues/990) for context and [PR #1554](https://github.com/dotnet/dotnet-buildtools-prereqs-docker/pull/1554) which removed the last `WithNode` directories. When proposing replacements for repos still using `-WithNode`, recommend the standard helix image.
- **Fedora:** Provision images for the next Fedora release (N+1) proactively, before the current version (N) reaches EOL. Fedora has a ~13-month lifecycle, so plan ahead.
- **Debian/Ubuntu LTS:** These have long support windows but should still be cleaned up once EOL. When proposing Ubuntu replacements, push forward to the latest LTS (e.g. 26.04), not back to an older one (e.g. 22.04 or 24.04).
- **Windows VM images:** Search for `ImageOverride` in YAML files to find VM pool references. Old images like `1es-windows-2019`, `windows.vs2019.amd64`, and `vmImage: windows-2019` should be updated to current equivalents (e.g. `1es-windows-2022`, `windows.vs2026preview.scout.amd64`).
- Cross-reference `src/<distro>/` directories against what runtime pipelines actually reference to find orphaned images.

### 9. Create PR

1. Create a branch:

   ```bash
   git checkout -b update-supported-os-<date>
   ```

2. Commit all changed files (`supported-os.json` and `supported-os.md` for each version):

   ```bash
   git add release-notes/*/supported-os.json release-notes/*/supported-os.md
   git commit -m "Update supported OS matrix — <summary of changes>"
   ```

3. Push and open a PR:

   ```bash
   gh pr create --title "Update supported OS matrix" --body "<description of changes>"
   ```

## Key facts

- The `id` field in each distribution matches [endoflife.date](https://endoflife.date) product IDs
- Versions are strings, not numbers — `"3.22"` not `3.22`
- `supported-versions` should be ordered newest-first
- `unsupported-versions` tracks previously-supported versions for historical reference
- Non-Linux OS families (Android, Apple, Windows) follow the same structure but use different lifecycle sources
- The `last-updated` field should reflect the date of any change
- Active .NET versions with `supported-os.json`: 8.0, 9.0, 10.0

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

## Prerequisites

The `dotnet-release` tool must be installed. Packages are published to [GitHub Packages](https://github.com/richlander/dotnet-release/packages).

```bash
# GitHub Packages requires authentication — use a GitHub token (PAT or GITHUB_TOKEN)
dotnet tool install -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json \
  --version "0.*"

# Verify
dotnet-release --help
```

> **Note:** GitHub Packages requires authentication even for public repositories. If you get a 401 error, configure credentials for the source:
>
> ```bash
> dotnet nuget add source https://nuget.pkg.github.com/richlander/index.json \
>   --name github-richlander \
>   --username USERNAME \
>   --password "$GITHUB_TOKEN" \
>   --store-password-in-clear-text
> ```
>
> In GitHub Actions, `GITHUB_TOKEN` is available automatically. For local use, create a [personal access token](https://github.com/settings/tokens) with `read:packages` scope.

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
| `> [!WARNING]` | EOL but still listed as "supported" | Move to `unsupported-versions` |
| `> [!IMPORTANT]` | Active release not listed | Consider adding to `supported-versions` |
| `> [!TIP]` | Active but listed as unsupported | Verify this is intentional (no action usually needed) |
| `> [!CAUTION]` | Approaching EOL within 3 months | **GA:** Informational — no immediate action. **Pre-GA:** Remove if EOL is before GA date |

See [references/verify-output-example.md](references/verify-output-example.md) for example output.

If all versions return exit code 0, the matrix is current. **Stop here.**

### 2. Determine scope of changes

First, determine whether this .NET version is **GA** or **pre-GA** (preview/RC). Check `releases.json` for the release type or ask the user. If the version is pre-GA, apply the [preview release rules](#preview-release-rules) below.

Review the verify report and decide which issues to act on:

- **WARNING items** (EOL but still "supported"):
  - **GA release:** Move to `unsupported-versions`.
  - **Pre-GA release:** Remove from `supported-versions` entirely — do not add to `unsupported-versions` (Rule 1).
  - **Exception — Windows ESU:** Do not remove Windows versions covered by [Extended Security Updates (ESU)](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview). The verify tool flags these as EOL based on mainstream support dates, but ESU extends their lifecycle. These entries are updated manually — skip them.
- **IMPORTANT items** (missing active releases):
  - **GA release:** Add unless there's a known reason to exclude.
  - **Pre-GA release:** Only add if the version's EOL date is after GA + 6 months (Rule 2).
- **TIP items** (active but unsupported) — usually intentional, skip unless the user says otherwise
- **CAUTION items** (approaching EOL):
  - **GA release:** Informational only, no JSON changes needed.
  - **Pre-GA release:** If the EOL date is **before** the GA date, remove from `supported-versions` (same rationale as Rule 1 — no users depend on the matrix yet, and the version won't be supported at GA). If the EOL date is **after** GA, no action needed.

Present findings to the user with recommendations before making changes. For pre-GA releases, explain which items are removed (Rule 1), which additions are excluded (Rule 2), and which preview distros qualify for early addition (Rule 3). For Rule 3 candidates, verify that a container image exists at [dotnet/dotnet-buildtools-prereqs-docker](https://github.com/dotnet/dotnet-buildtools-prereqs-docker) before recommending addition.

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

CI runs markdownlint via super-linter. If linting fails, fix the generator or Markout library — do not patch the markdown by hand.

### 6. Cross-reference with os-packages.json

Check if any newly added distro versions need entries in `os-packages.json`. If so, inform the user to run the `update-os-packages` skill next.

### 7. Validate changes

1. Run verify again to confirm issues are resolved:

   ```bash
   dotnet-release verify supported-os <version> release-notes
   ```

   Expect exit code 0 (or only TIP/CAUTION items and ESU-covered WARNING items remaining).

2. Spot-check the generated markdown renders correctly.

### 8. Create PR

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

## Preview release rules

.NET releases go through a preview period before GA (General Availability). During this period, special rules apply to limit documentation cruft at GA and prevent users from deploying to environments that will soon lose support.

### Determining GA date

.NET releases always GA in November. The version number and GA year follow a predictable pattern:

- **Even .NET versions** (10, 12, 14, …) GA in **odd years** — LTS (Long Term Support)
- **Odd .NET versions** (9, 11, 13, …) GA in **even years** — STS (Standard Term Support)

For example: .NET 10 GAs November 2025, .NET 11 GAs November 2026, .NET 12 GAs November 2027.

To confirm, check [`releases-index.json`](https://github.com/dotnet/core/raw/refs/heads/main/release-notes/releases-index.json) for the `release-date` of the target version. If the GA date is not yet populated, use the November convention above.

### Rule 1 — Remove EOL versions during preview (do not track as unsupported)

While a .NET release is in preview, **remove** OS versions that are already EOL from `supported-versions`. Do **not** add them to `unsupported-versions` — the unsupported list is for versions that were supported during a GA release and later went EOL. Since the .NET release hasn't shipped yet, there is no GA history to preserve.

**Rationale:** The `unsupported-versions` list exists as a historical record for users of a shipped release. During preview, no users depend on the support matrix, so EOL versions should simply be removed to keep the document clean at GA.

### Rule 2 — Only add versions supported at GA + 6 months

When considering whether to add a new OS version to `supported-versions`, check whether the version will still be supported (not EOL) at **GA date + 6 months**.

- If the OS version's EOL date is **after** GA + 6 months → **add it**
- If the OS version's EOL date is **before** GA + 6 months → **do not add it**
- If the OS version has no known EOL date (still active with no announced end) → **add it**

**Rationale:** Users should be able to adopt a .NET release at GA and have confidence their OS will remain supported for a reasonable period. Adding OS versions that go EOL shortly after GA creates a "rug-pulling" scenario.

### Rule 3 — Add preview distros that will GA before .NET GA

If a distro version is currently in preview but is expected to GA **before** the .NET GA date, it can be added to `supported-versions` if **all** of the following are true:

1. The distro version is expected to GA **before** the .NET GA date (use the distro's published release schedule or cadence to estimate)
2. It passes Rule 2's EOL check (EOL after GA + 6 months)
3. Preview builds of the distro are publicly available
4. A container image for the distro version exists at [dotnet/dotnet-buildtools-prereqs-docker](https://github.com/dotnet/dotnet-buildtools-prereqs-docker) (required for CI validation)

To check for published images, query the [image-info JSON](https://github.com/dotnet/versions/blob/main/build-info/docker/image-info.dotnet-dotnet-buildtools-prereqs-docker-main.json) which tracks currently active images:

```bash
# Check for published images (preferred — shows currently active images)
curl -sL https://github.com/dotnet/versions/raw/refs/heads/main/build-info/docker/image-info.dotnet-dotnet-buildtools-prereqs-docker-main.json \
  | jq '[.repos[].images[].platforms[].simpleTags[]] | map(select(startswith("<os-name>-<version>"))) | .[]'

# Examples
curl -sL <same-url> | jq '[.repos[].images[].platforms[].simpleTags[]] | map(select(startswith("ubuntu-26.04"))) | .[]'
curl -sL <same-url> | jq '[.repos[].images[].platforms[].simpleTags[]] | map(select(startswith("fedora-44"))) | .[]'
```

You can also check the [full MCR tags list](https://mcr.microsoft.com/v2/dotnet-buildtools/prereqs/tags/list) which includes all ever-published tags:

```bash
curl -s https://mcr.microsoft.com/v2/dotnet-buildtools/prereqs/tags/list \
  | jq '.tags[] | select(startswith("<os-name>-<version>"))'
```

If no published images are found, check whether Dockerfiles exist in the repo (images may be in preparation):

```bash
gh search code "<os-name>/<version>" --repo dotnet/dotnet-buildtools-prereqs-docker
```

For example: `gh search code "fedora/44"` or `gh search code "ubuntu/26.04"`. Do **not** use spaces (e.g. `"ubuntu 26.04"`) — the images are organized by folder path.

If conditions 1–3 are met but there is **no container image** at dotnet-buildtools-prereqs-docker:

- Do **not** add the distro version yet
- Check if a tracking issue already exists at [dotnet/dotnet-buildtools-prereqs-docker](https://github.com/dotnet/dotnet-buildtools-prereqs-docker/issues) for the missing image
- If no issue exists, ask the user whether to create one
- Once the image is available, the distro version can be added in a follow-up update

If the distro GAs **after** .NET GA → **do not add it** yet.

**Rationale:** By the time .NET ships, these distro versions will be fully released. Adding them early ensures the support matrix is complete at GA without requiring a last-minute update. However, we can only validate support for a distro version when we have build infrastructure (container images) for it.

### Examples

.NET 11 (STS, odd version) GAs November 2026. GA + 6 months = May 2027.

**Rule 1 — Remove EOL versions:**

- Alpine 3.20 (EOL 2026-04-01) — **remove** from supported, do not add to unsupported (already EOL, pre-GA)
- Android 13 (EOL 2026-03-02) — **remove** from supported, do not add to unsupported (already EOL, pre-GA)

**Rule 2 — GA + 6 months gate:**

- Alpine 3.21 (EOL 2026-11-01) — **do not add** (EOL before May 2027)
- Alpine 3.23 (EOL 2027-11-01) — **add** (EOL after May 2027)

**Rule 3 — Preview distros:**

- Fedora 44 (preview, expected ~April 2026, EOL ~May 2027) — expected before .NET 11 GA ✅, passes EOL check ✅, preview builds available ✅, prereqs image published ✅ → **add**
- Fedora 44 (same, but Dockerfiles exist in prereqs repo without published images) — expected before GA ✅, passes EOL check ✅, preview builds available ✅, prereqs image not yet published ❌ → **do not add yet**, check/file issue at dotnet-buildtools-prereqs-docker
- Ubuntu 26.04 (preview, expected ~April 2026, EOL ~April 2031) — expected before .NET 11 GA ✅, passes EOL check ✅, preview builds available ✅, prereqs image published ✅ → **add**
- Alpine 3.25 (preview, expected ~December 2026) — **do not add** (will still be preview or just released at .NET 11 GA)

## Key facts

- The `id` field in each distribution matches [endoflife.date](https://endoflife.date) product IDs
- Versions are strings, not numbers — `"3.22"` not `3.22`
- `supported-versions` should be ordered newest-first
- `unsupported-versions` tracks previously-supported versions for historical reference
- Non-Linux OS families (Android, Apple, Windows) follow the same structure but use different lifecycle sources
- The `last-updated` field should reflect the date of any change
- Active .NET versions with `supported-os.json`: 8.0, 9.0, 10.0, 11.0

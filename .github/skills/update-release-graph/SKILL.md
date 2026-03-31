---
name: update-release-graph
description: >
  Update the HAL+JSON release information graph when new .NET releases ship.
  Regenerates index files across the version hierarchy (root → major → patch),
  timeline hierarchy (timeline → year → month), llms.json, and downloads using
  graph generator tools. USE FOR: adding a new patch release to the graph,
  adding a new major version, updating timeline entries after a release,
  refreshing the graph after source data changes.
  DO NOT USE FOR: supported-os.json
  changes (use update-supported-os skill), querying the graph (use
  dotnet-releases skill on release-index branch), editing generated graph files
  by hand (update source data and regenerate).
---

# Update Release Graph

Regenerate the HAL+JSON information graph in `release-notes/`. The graph is a set of interconnected JSON files using [HAL](https://stateless.group/hal_specification.html) `_links` and `_embedded` properties. It is **generated** from source data — never hand-edit the output files.

## Architecture

### Source data (inputs — edit these)

| File | Location | Purpose |
|------|----------|---------|
| `releases.json` | `{ver}/releases.json` | Legacy release list with all patches, SDKs, component versions, download URLs, hashes |
| `release.json` | `{ver}/{patch}/release.json` | Individual patch release data (subset of releases.json entry) |
| `_manifest.json` | `{ver}/_manifest.json` | Lifecycle data and reference links (GA date, EOL date, what's-new, compatibility) |
| `_llms.json` | `_llms.json` (root, optional) | Partial overrides merged into generated llms.json |
| `cve.json` | `timeline/{year}/{month}/cve.json` | CVE disclosure records |

### Generated graph (outputs — do not hand-edit)

```
release-notes/
├── index.json                          ← root: all major versions
├── llms.json                           ← AI entry point: latest patches per supported version
├── {ver}/
│   ├── index.json                      ← major: all patches for this version
│   ├── manifest.json                   ← reference hub: compatibility, OS support, what's-new
│   ├── sdk/
│   │   ├── index.json                  ← SDK version index
│   │   └── sdk-{band}.json            ← per-band SDK history
│   ├── downloads/
│   │   ├── index.json                  ← components + feature bands
│   │   ├── runtime.json                ← per-RID runtime downloads
│   │   ├── sdk.json                    ← per-RID SDK downloads
│   │   ├── sdk-{band}.json            ← per-RID band-specific SDK downloads
│   │   ├── aspnetcore.json             ← per-RID ASP.NET Core downloads
│   │   └── windowsdesktop.json         ← per-RID Windows Desktop downloads
│   └── {patch}/
│       └── index.json                  ← patch detail (immutable after creation)
└── timeline/
    ├── index.json                      ← timeline root: all years
    ├── {year}/
    │   ├── index.json                  ← year: all months with releases
    │   └── {month}/
    │       └── index.json              ← month: all patches released (immutable)
```

### Graph generators

The `dotnet-release` tool includes four graph generation commands:

| Command | Generates | From |
|---------|-----------|------|
| `generate version-index` | Root index, major indexes, patch indexes, manifests, SDK indexes, downloads | `releases.json`, `release.json`, `_manifest.json`, `cve.json` |
| `generate timeline-index` | Timeline root, year indexes, month indexes | Same sources + release calendar |
| `generate llms-index` | `llms.json` | Same sources (supported versions only) |
| `generate indexes` | **All of the above** in one shot | All source data |

All accept the same arguments:

```
dotnet-release generate <type> <input-dir> [output-dir] [--url-root <url>]
```

## When to use

- A new .NET patch release ships (monthly servicing) — source data is updated, graph needs regenerating
- A new .NET major version is added — `_manifest.json` and initial `releases.json` are created
- CVE data changes — `cve.json` files are updated, graph needs refreshing
- A .NET version reaches end-of-life — `_manifest.json` is updated, graph needs regenerating
- Any source data file is modified and the graph should reflect the changes

## Prerequisites

### dotnet-release

The `dotnet-release` tool handles both graph generation and legacy file operations. Packages are published to [GitHub Packages](https://github.com/richlander/dotnet-release/packages).

```bash
dotnet tool install -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json

# Verify — should show graph generation commands
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

### markdownlint

```bash
npm install -g markdownlint-cli
```

## Inputs

The user provides:

- **What changed** — new patch release, new major version, EOL update, CVE refresh, etc.
- **Which source files were updated** — `releases.json`, `release.json`, `_manifest.json`, etc.
- Optionally, a custom `--url-root` for link generation (defaults to the `release-index` branch URL)

## Process — Regenerate after a new patch release

This is the most common operation. Source data (`releases.json`, `release.json`) has been updated with a new patch release.

### 1. Verify source data is ready

Confirm these files exist and are updated:

```bash
# The major version's releases.json must include the new patch
cat release-notes/{ver}/releases.json | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"Latest: {data['releases'][0]['release-version']} ({data['releases'][0]['release-date']})\")"

# The patch directory should exist with release.json
ls release-notes/{ver}/{patch}/
# Expected: release.json, {patch}.md
```

The `_manifest.json` should also be present for the major version:

```bash
cat release-notes/{ver}/_manifest.json | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"Version: {data['version']}, Phase: {data['support_phase']}, EOL: {data.get('eol_date', 'N/A')}\")"
```

### 2. Run the graph generators

The simplest approach is `generate indexes` which runs all three generators in sequence:

```bash
# Generate all graph files in one shot
dotnet-release generate indexes release-notes
```

Or run each generator individually (order matters: version-index → timeline-index → llms-index):

```bash
dotnet-release generate version-index release-notes
dotnet-release generate timeline-index release-notes
dotnet-release generate llms-index release-notes
```

**Custom URL root** (for PR review before merging to release-index):

```bash
dotnet-release generate indexes release-notes --url-root https://raw.githubusercontent.com/dotnet/core/<commit-sha>
```

**Separate output directory** (to inspect output without overwriting source):

```bash
dotnet-release generate indexes release-notes /tmp/graph-output
```

The default URL root is `https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/`.

### 3. Regenerate legacy files

```bash
# Regenerate releases-index.json from releases.json files
dotnet-release generate releases-index release-notes

# Regenerate releases.md
dotnet-release generate releases release-notes
```

### 4. Validate

```bash
# Verify release links and hashes (can take minutes — do not cancel)
dotnet-release verify releases release-notes
# Or for a specific version
dotnet-release verify releases {ver} release-notes
# Skip hash verification for faster iteration
dotnet-release verify releases release-notes --skip-hash

# Lint generated markdown
npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/releases.md
```

**Exit codes for verify:**
- `0` — no issues
- `2` — issues found (report written to stdout as markdown)

### 5. Spot-check the graph

Verify key relationships are correct:

```bash
# Root index lists all versions
python3 -c "
import json
data = json.load(open('release-notes/index.json'))
for r in data['_embedded']['releases']:
    print(f\"{r['version']}: supported={r.get('supported', 'N/A')}\")"

# Major index has the new patch as latest
python3 -c "
import json
data = json.load(open('release-notes/{ver}/index.json'))
print(f\"Latest patch: {data['latest_patch']}\")
print(f\"First embedded: {data['_embedded']['patches'][0]['version']}\")"

# Month timeline includes the patch
python3 -c "
import json
data = json.load(open('release-notes/timeline/{year}/{month}/index.json'))
for ver, patch in data['_embedded']['patches'].items():
    print(f\"{ver}: {patch['version']}\")"

# llms.json is current
python3 -c "
import json
data = json.load(open('release-notes/llms.json'))
for ver, patch in data['_embedded']['patches'].items():
    print(f\"{ver}: {patch['version']} ({patch['date']})\")"
```

### 6. Commit and PR

```bash
git checkout -b update-release-graph-{date}
git add release-notes/
git commit -m "Update release graph — {summary}"
gh pr create --title "Update release graph — {summary}" --body "{description}"
```

## Process — Add a new major version

When a new .NET major version is added (e.g. .NET 11.0):

### 1. Create source data files

Create the `_manifest.json` with lifecycle data and reference links:

```bash
# release-notes/{ver}/_manifest.json
```

```json
{
  "kind": "manifest",
  "title": ".NET {ver} Manifest",
  "version": "{ver}",
  "label": ".NET {ver}",
  "target_framework": "net{ver_no_dot}",
  "release_type": "lts|sts",
  "support_phase": "preview|active",
  "ga_date": "20XX-11-XXTXX:XX:XXZ",
  "eol_date": "20XX-XX-XXTXX:XX:XXZ",
  "_links": {
    "downloads-html": { "href": "https://dotnet.microsoft.com/download/dotnet/{ver}", "title": "...", "type": "text/html" },
    "whats-new-html": { "href": "https://learn.microsoft.com/dotnet/core/whats-new/dotnet-{major}/overview", "title": "...", "type": "text/html" },
    "whats-new": { "href": "https://raw.githubusercontent.com/dotnet/docs/main/docs/core/whats-new/dotnet-{major}/overview.md", "title": "...", "type": "application/markdown" },
    "compatibility-html": { "href": "https://learn.microsoft.com/dotnet/core/compatibility/{ver}", "title": "...", "type": "text/html" }
  }
}
```

Create the initial `releases.json` with the first release entry.

Create the `release.json` in the patch directory.

### 2. Regenerate

Same as the patch release process — run `dotnet-release generate indexes release-notes` → legacy files.

### 3. Verify the new version appears

- In `index.json` root: new version in `_embedded.releases`
- In `timeline/index.json`: version added to the appropriate year's `major_releases`
- In `llms.json`: version in `supported_major_releases` and `_embedded.patches`

## Process — Mark a version EOL

### 1. Update source data

Edit `release-notes/{ver}/_manifest.json`:
- Set `"support_phase": "eol"`
- Set `"supported": false` (if present)

### 2. Regenerate

Run all generators. The tools will:
- Set `supported: false` in root index
- Remove from `llms.json` `supported_major_releases` and `_embedded.patches`
- Update `support_phase` in major index

## Source data conventions

### `_manifest.json` (partial manifest)

This is the **authoritative source** for lifecycle data. The generators merge it with computed data to produce the full `manifest.json`.

Required fields: `kind`, `title`, `version`, `label`, `target_framework`, `release_type`, `support_phase`, `ga_date`, `eol_date`.

The `_links` section contains reference links that are merged into the generated manifest. These are links that cannot be computed (what's-new pages, compatibility docs, release blog, etc.).

### `release.json` (per-patch)

Contains the full release data for a single patch: component versions, download URLs, file hashes. This is a subset of the corresponding entry in `releases.json`.

The generators use `release.json` to:
- Build patch detail indexes with embedded runtime/SDK data
- Generate per-RID download files
- Compute SDK feature band information

### Preview releases

Preview/RC releases are stored in a different directory structure:
- `{ver}/preview/preview1/` for preview.1
- `{ver}/preview/rc1/` for RC1

The generators automatically detect this from the version string (contains `-preview.` or `-rc.`).

After GA, the generators filter previews from `_embedded.patches` in the major index. **RC releases are kept** because they have go-live support.

## Graph conventions

| Convention | Rule |
|------------|------|
| Properties | `snake_case_lower` |
| Link relations | `kebab-case-lower` |
| Dates | ISO 8601 with timezone: `2026-02-10T00:00:00+00:00` |
| Default URL root | `https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/` |
| `$schema` | Injected by generators; points to `schemas/v1/` |
| `kind` | Discriminator: `root`, `major`, `patch`, `month`, `year`, `timeline`, `llms`, `manifest`, `downloads` |

### Mutability

| Index Type | Mutable? | Notes |
|------------|----------|-------|
| Root index | Yes | Updated when versions are added/removed |
| Major index | Yes | Updated monthly with new patches |
| Patch detail | **No** | Frozen after creation |
| Timeline root | Yes | Updated when new years are added |
| Year index | Yes | Updated monthly |
| Month index | **No** | Frozen after creation |
| llms.json | Yes | Updated with every release |
| manifest.json | Rarely | Generated from `_manifest.json` |
| Downloads files | Yes | Updated with new release download URLs |

Immutable files use only `prev-*` links (no `next`). Mutable files use `latest-*` links.

## Key facts

- The graph is **fully generated** — edit source data (`releases.json`, `release.json`, `_manifest.json`), then run the generators
- Never hand-edit generated files (`index.json`, `manifest.json`, `llms.json`, downloads files, timeline indexes)
- `_manifest.json` (with underscore prefix) is the source; `manifest.json` (without prefix) is the generated output
- Similarly, `_llms.json` is optional source overrides; `llms.json` is the generated output
- `releases-index.json` (legacy flat format) is generated by `dotnet-release generate releases-index`
- `releases.md` is generated by `dotnet-release generate releases`
- The generators are idempotent — running them on unchanged source data produces identical output
- When running individually, order matters: `version-index` → `timeline-index` → `llms-index`; `generate indexes` handles this automatically
- All `_links.*.href` values are absolute URLs; the base URL is controlled by `--url-root`
- `_embedded.patches` is an **array** (newest first) in major indexes; an **object** keyed by major version in month indexes
- CVE data in the graph comes from `timeline/{year}/{month}/cve.json`

## Common mistakes

| Mistake | Correction |
|---------|------------|
| Hand-editing `index.json` or other generated files | Edit source data and re-run the generators |
| Hand-editing `manifest.json` | Edit `_manifest.json` and re-run `VersionIndex` |
| Hand-editing `releases-index.json` | Run `dotnet-release generate releases-index release-notes` |
| Hand-editing `releases.md` | Run `dotnet-release generate releases release-notes` |
| Running generators in wrong order | Use `generate indexes` (handles order automatically) or run: version-index → timeline-index → llms-index |
| Missing `_manifest.json` for a version | The generators warn but fall back to `releases.json`; create `_manifest.json` for accurate lifecycle data |
| Missing `release.json` for a patch | Patch detail index will be incomplete; ensure every patch has a `release.json` |
| Editing source data without regenerating | Always run `dotnet-release generate indexes release-notes` after changing source files |
| Forgetting `--url-root` for PR review | Links will use the default release-index branch URL; pass `--url-root` with a commit SHA for verifiable links in PRs |

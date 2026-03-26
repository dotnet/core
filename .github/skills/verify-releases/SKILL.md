---
name: verify-releases
description: >
  Verify release data integrity: URL liveness, file hashes, CDN latest.version
  files, and aka.ms redirect targets. Uses dotnet-release verify and generate
  commands against the local release-notes directory.
  USE FOR: validating that all download links return HTTP 200, verifying SHA512
  hashes match downloaded content, checking CDN latest.version files match
  releases.json, checking aka.ms redirects point to the correct download URLs,
  regenerating releases-index.json and releases.md after source data changes.
  DO NOT USE FOR: editing releases.json or release.json (edit source data
  directly), graph regeneration (use update-release-graph skill), supported-os
  changes (use update-supported-os skill).
---

# Verify Releases

Validate the integrity of release data in `release-notes/`. This skill checks that download URLs are live, file hashes are correct, CDN version files are in sync, and aka.ms short links redirect to the expected targets.

## When to use

- After updating `releases.json` or `release.json` with new patch release data
- After updating `downloads/*.json` with new aka.ms evergreen links
- Before merging a PR that modifies release data
- Periodic validation that CDN state matches repository data
- After regenerating the release graph to verify link consistency

## Prerequisites

### dotnet-release tool

```bash
dotnet tool install -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json \
  --version "0.*"
```

Or run from source:

```bash
cd ~/git/dotnet-release
DOTNET_ROLL_FORWARD=LatestMajor dotnet run --project src/Dotnet.Release.Tools -- <args>
```

## Commands

### Verify release links

Validates URLs, hashes, CDN latest.version files, and aka.ms redirects for all supported (non-EOL) versions:

```bash
dotnet-release verify releases release-notes
```

For a specific major version (includes EOL versions when explicit):

```bash
dotnet-release verify releases 10.0 release-notes
```

For a specific patch version:

```bash
dotnet-release verify releases 10.0.5 release-notes
```

Skip hash verification for faster iteration (URL + CDN + aka.ms checks only):

```bash
dotnet-release verify releases release-notes --skip-hash
dotnet-release verify releases 10.0 release-notes --skip-hash
```

### Generate releases-index.json

Regenerates `release-notes/releases-index.json` from per-version `releases.json` files:

```bash
dotnet-release generate releases-index release-notes
```

### Generate releases.md

Regenerates `release-notes/releases.md` from per-version `releases.json` files:

```bash
dotnet-release generate releases release-notes
```

## What gets verified

### URL liveness (HTTP HEAD)

Every URL in the latest patch release of each supported version is checked with HTTP HEAD:

- Runtime download URLs
- SDK download URLs
- ASP.NET Core download URLs
- Windows Desktop download URLs (when present)
- Symbol package URLs (when present)
- Release notes URLs
- CVE URLs

Runs 16 concurrent requests. Reports any non-200 responses.

### File hash verification (SHA512)

For each file with a `hash` field, the tool downloads the file and computes its SHA512 hash, comparing against the expected value in `releases.json`. Runs 4 concurrent downloads.

Skip with `--skip-hash` for faster validation (useful during iteration).

### CDN latest.version files

The `dotnet-install.sh` script resolves versions from CDN files at `https://builds.dotnet.microsoft.com/dotnet/`. Three files are checked per version:

| File | Expected value |
|------|---------------|
| `Sdk/{version}/latest.version` | `latest-sdk` from `releases.json` |
| `Runtime/{version}/latest.version` | `latest-runtime` from `releases.json` |
| `aspnetcore/Runtime/{version}/latest.version` | ASP.NET Core runtime version from latest patch |

A mismatch means `dotnet-install.sh` would install a different version than what `releases.json` declares as latest.

### aka.ms redirect validation

aka.ms short links are verified from two sources:

1. **`ComponentFile.akams` in `releases.json`** — e.g., the Windows hosting bundle link
2. **`downloads/*.json` evergreen links** — per-RID download links like `aka.ms/dotnet/10.0/dotnet-sdk-linux-x64.tar.gz`

For each aka.ms link, the tool fetches without following redirects and compares the `Location` header against the expected concrete URL in `releases.json`.

If `downloads/*.json` files are not present (older versions), this check is silently skipped.

### Exit codes

| Code | Meaning |
|------|---------|
| `0` | All checks passed |
| `2` | Issues found — markdown report written to stdout |

## Process — Verify after a new patch release

### 1. Quick validation (skip hashes)

```bash
dotnet-release verify releases 10.0 release-notes --skip-hash
```

Review any broken links or redirect mismatches. Fix source data if needed.

### 2. Full validation (with hashes)

```bash
dotnet-release verify releases 10.0 release-notes
```

This downloads every file to verify SHA512 hashes. Can take several minutes per version.

### 3. Regenerate derived files

```bash
dotnet-release generate releases-index release-notes
dotnet-release generate releases release-notes
```

### 4. Commit

```bash
git add release-notes/releases-index.json release-notes/releases.md
git commit -m "Regenerate releases-index.json and releases.md"
```

## Process — Full repo validation

Validate all supported versions:

```bash
dotnet-release verify releases release-notes --skip-hash
```

If all passes, run with hashes:

```bash
dotnet-release verify releases release-notes
```

## Common issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Broken link (404) | URL in releases.json is wrong or CDN hasn't propagated | Verify the URL is correct in source data; CDN propagation can take time after a release |
| Hash mismatch | File content changed after releases.json was authored | Re-download the file and update the hash in releases.json |
| CDN latest.version mismatch | CDN hasn't been updated to reflect the new release | This is an infrastructure issue — the CDN team needs to update the latest.version file |
| aka.ms redirect mismatch | aka.ms link hasn't been updated for the new release | The aka.ms redirect needs to be updated by the redirect owner |
| aka.ms redirects to Bing | aka.ms link was never registered | The aka.ms short link needs to be created |
| `downloads/*.json` not found | Older version without evergreen download files | Expected — the check is silently skipped |

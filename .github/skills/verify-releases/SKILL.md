---
name: verify-releases
description: >
  Validate releases and release links: URL liveness, file hashes, CDN
  latest.version files, and aka.ms redirect targets. Uses dotnet-release verify
  and generate commands against the local release-notes directory.
  USE FOR: validate the latest release, validate release links, validating that
  all download links return HTTP 200, verifying SHA512 hashes match downloaded
  content, checking CDN latest.version files match releases.json, checking
  aka.ms redirects point to the correct download URLs, regenerating
  releases-index.json and releases.md after source data changes.
  DO NOT USE FOR: editing releases.json or release.json (edit source data
  directly), graph regeneration (use update-release-graph skill), supported-os
  changes (use update-supported-os skill).
---

# Verify Releases

Validate .NET release data in `release-notes/` using the `dotnet-release` CLI tool. This skill checks that download URLs are live, file hashes match, CDN latest.version files are current, and aka.ms redirects resolve correctly.

## Prerequisites

### dotnet-release

The `dotnet-release` tool is published to [GitHub Packages](https://github.com/richlander/dotnet-release/packages).

```bash
# Install
dotnet tool install -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json

# Verify — must show "verify releases" in usage output
dotnet-release
```

> **Note:** GitHub Packages requires authentication even for public repositories. If you get a 401 error, configure credentials:
>
> ```bash
> dotnet nuget add source https://nuget.pkg.github.com/richlander/index.json \
>   --name github-richlander \
>   --username USERNAME \
>   --password "$GITHUB_TOKEN" \
>   --store-password-in-clear-text
> ```

**Version check:** If the tool usage output does not include `verify releases` in its command list, the installed version is too old. Update with:

```bash
dotnet tool update -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json
```

## Commands

### Verify all supported versions (full — with hash verification)

Downloads every binary and verifies SHA512 hashes against `releases.json`. This is the most thorough check and takes several minutes.

```bash
dotnet-release verify releases release-notes
```

### Verify all supported versions (quick — skip hashes)

Checks URL liveness, CDN latest.version, and aka.ms redirects only. Much faster — typically under 30 seconds.

```bash
dotnet-release verify releases release-notes --skip-hash
```

### Verify a specific major version

```bash
dotnet-release verify releases 10.0 release-notes
dotnet-release verify releases 10.0 release-notes --skip-hash
```

### Verify a specific patch release

```bash
dotnet-release verify releases 10.0.5 release-notes
```

## What gets verified

| Check | Description | Skippable? |
|-------|-------------|------------|
| **URL liveness** | HTTP HEAD on every download URL in the latest patch of each supported version's `releases.json` | No |
| **SHA512 hashes** | Downloads each binary and computes SHA512, compares against `releases.json` hash | Yes (`--skip-hash`) |
| **CDN latest.version** | Fetches CDN `latest.version` files for SDK, Runtime, and ASP.NET Core Runtime; compares against `releases.json` | No |
| **aka.ms redirects** | Follows aka.ms short URLs and verifies they redirect to the correct download URL | No |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | No issues found — all checks passed |
| `2` | Issues found — markdown report written to stdout |

## Timing expectations

| Scenario | Expected duration |
|----------|-------------------|
| All versions, `--skip-hash` | 10–30 seconds |
| Single version, `--skip-hash` | 5–15 seconds |
| All versions, with hashes | 3–10 minutes (downloads all binaries) |
| Single version, with hashes | 1–3 minutes |

**CRITICAL:** Never cancel the verification command early. Hash verification downloads large binaries and needs time to complete. Set your timeout to at least 10 minutes for full hash verification.

## Process

### 1. Check tool version

Confirm `dotnet-release` is installed and has the `verify releases` command:

```bash
dotnet-release
```

The usage output must include `dotnet-release verify releases [version] [path] [--skip-hash]`. If it does not, update the tool (see Prerequisites).

### 2. Run verification

For a standard validation (recommended for release sign-off):

```bash
cd ~/git/core
dotnet-release verify releases release-notes
```

For a quick check during development:

```bash
dotnet-release verify releases release-notes --skip-hash
```

### 3. Interpret results

**If exit code is 0:** All checks passed. Report the results as a summary table.

**If exit code is 2:** The tool prints a markdown report to stdout listing all failures. Common issues:

| Issue | Likely cause | Fix |
|-------|-------------|-----|
| URL returns non-200 | Binary not yet published to CDN | Wait for CDN propagation, or fix URL in `releases.json` |
| Hash mismatch | Wrong hash in `releases.json`, or file was republished | Re-download and recompute hash, update `releases.json` |
| CDN latest.version mismatch | CDN hasn't been updated for the new release | Wait for CDN update, or escalate |
| aka.ms redirect wrong | Short URL not yet updated | Update aka.ms redirect configuration |

### 4. Report results

Present a summary table with per-version results:

```markdown
## .NET Release Link Verification Report

**Date:** YYYY-MM-DD
**Tool:** `dotnet-release` vX.Y.Z
**Command:** `dotnet-release verify releases release-notes`

| Version | Latest Release | Download URLs | SHA512 Hashes | CDN latest.version | aka.ms | Status |
|---------|---------------|---------------|---------------|-------------------|--------|--------|
| .NET 11.0 | `11.0.0-preview.2` | 82/82 ✅ | 81/81 ✅ | ✅ | 1/1 ✅ | **Pass** |
| .NET 10.0 | `10.0.5` | 85/85 ✅ | 84/84 ✅ | ✅ | 1/1 ✅ | **Pass** |
| .NET 9.0 | `9.0.14` | 56/56 ✅ | 53/53 ✅ | ✅ | 1/1 ✅ | **Pass** |
| .NET 8.0 | `8.0.25` | 55/55 ✅ | 53/53 ✅ | ✅ | 1/1 ✅ | **Pass** |

**Total:** 278 URLs verified, 271 hashes verified, all CDN and aka.ms checks passed.
```

When `--skip-hash` is used, omit the SHA512 Hashes column and note it in the report.

## Regenerating legacy files

After verifying releases, you may also want to regenerate the legacy index and markdown:

```bash
# Regenerate releases-index.json
dotnet-release generate releases-index release-notes

# Regenerate releases.md
dotnet-release generate releases release-notes

# Lint the generated markdown
npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/releases.md
```

## Common mistakes

| Mistake | Correction |
|---------|------------|
| Cancelling verification early | Never cancel — hash downloads need time. Wait for completion. |
| Running with outdated tool version | Check that usage shows `verify releases`. Update if needed. |
| Ignoring exit code 2 | Exit code 2 means issues were found. Read the stdout report. |
| Only running `--skip-hash` for release sign-off | Full hash verification should be run before signing off a release. |
| Running from wrong directory | Run from the repo root so `release-notes` resolves correctly. |

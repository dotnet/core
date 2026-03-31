# Verify Releases — Example Output

## Full verification (with hashes)

Command: `dotnet-release verify releases release-notes`

```
Verifying release links for all supported versions in /Users/rich/git/core/release-notes...
Checking .NET 11.0 (11.0.0-preview.2)...
  82 URLs to check
  82/82 URLs returned 200
  Verifying 81 file hashes...
    Downloading dotnet-apphost-pack-linux-arm.tar.gz... ✅
    Downloading dotnet-apphost-pack-linux-arm64.tar.gz... ✅
    ...
    Downloading dotnet-hosting-win.exe... ✅
  81/81 hashes verified
  Checking latest.version files on CDN...
  ✅ SDK latest.version: 11.0.100-preview.2.26159.112
  ✅ Runtime latest.version: 11.0.0-preview.2.26159.112
  ✅ ASP.NET Core Runtime latest.version: 11.0.0-preview.2.26159.112
  Checking 1 aka.ms redirect(s)...
  1/1 aka.ms redirects verified
Checking .NET 10.0 (10.0.5)...
  85 URLs to check
  85/85 URLs returned 200
  Verifying 84 file hashes...
    ...
  84/84 hashes verified
  Checking latest.version files on CDN...
  ✅ SDK latest.version: 10.0.201
  ✅ Runtime latest.version: 10.0.5
  ✅ ASP.NET Core Runtime latest.version: 10.0.5
  Checking 1 aka.ms redirect(s)...
  1/1 aka.ms redirects verified
Checking .NET 9.0 (9.0.14)...
  56 URLs to check
  56/56 URLs returned 200
  Verifying 53 file hashes...
    ...
  53/53 hashes verified
  Checking latest.version files on CDN...
  ✅ SDK latest.version: 9.0.312
  ✅ Runtime latest.version: 9.0.14
  ✅ ASP.NET Core Runtime latest.version: 9.0.14
  Checking 1 aka.ms redirect(s)...
  1/1 aka.ms redirects verified
Checking .NET 8.0 (8.0.25)...
  55 URLs to check
  55/55 URLs returned 200
  Verifying 53 file hashes...
    ...
  53/53 hashes verified
  Checking latest.version files on CDN...
  ✅ SDK latest.version: 8.0.419
  ✅ Runtime latest.version: 8.0.25
  ✅ ASP.NET Core Runtime latest.version: 8.0.25
  Checking 1 aka.ms redirect(s)...
  1/1 aka.ms redirects verified
No issues found.
```

Exit code: `0`

## Quick verification (skip hashes)

Command: `dotnet-release verify releases release-notes --skip-hash`

```
Verifying release links for all supported versions in /Users/rich/git/core/release-notes...
Checking .NET 11.0 (11.0.0-preview.2)...
  82 URLs to check
  82/82 URLs returned 200
  Checking latest.version files on CDN...
  ✅ SDK latest.version: 11.0.100-preview.2.26159.112
  ✅ Runtime latest.version: 11.0.0-preview.2.26159.112
  ✅ ASP.NET Core Runtime latest.version: 11.0.0-preview.2.26159.112
  Checking 1 aka.ms redirect(s)...
  1/1 aka.ms redirects verified
Checking .NET 10.0 (10.0.5)...
  85 URLs to check
  85/85 URLs returned 200
  Checking latest.version files on CDN...
  ✅ SDK latest.version: 10.0.201
  ✅ Runtime latest.version: 10.0.5
  ✅ ASP.NET Core Runtime latest.version: 10.0.5
  Checking 1 aka.ms redirect(s)...
  1/1 aka.ms redirects verified
Checking .NET 9.0 (9.0.14)...
  56 URLs to check
  56/56 URLs returned 200
  Checking latest.version files on CDN...
  ✅ SDK latest.version: 9.0.312
  ✅ Runtime latest.version: 9.0.14
  ✅ ASP.NET Core Runtime latest.version: 9.0.14
  Checking 1 aka.ms redirect(s)...
  1/1 aka.ms redirects verified
Checking .NET 8.0 (8.0.25)...
  55 URLs to check
  55/55 URLs returned 200
  Checking latest.version files on CDN...
  ✅ SDK latest.version: 8.0.419
  ✅ Runtime latest.version: 8.0.25
  ✅ ASP.NET Core Runtime latest.version: 8.0.25
  Checking 1 aka.ms redirect(s)...
  1/1 aka.ms redirects verified
No issues found.
```

Exit code: `0`

## Expected report format

```markdown
## .NET Release Link Verification Report

**Date:** 2026-03-27
**Tool:** `dotnet-release` v1.1.0
**Command:** `dotnet-release verify releases release-notes`

| Version | Latest Release | Download URLs | SHA512 Hashes | CDN latest.version | aka.ms | Status |
|---------|---------------|---------------|---------------|-------------------|--------|--------|
| .NET 11.0 | `11.0.0-preview.2` | 82/82 ✅ | 81/81 ✅ | ✅ | 1/1 ✅ | **Pass** |
| .NET 10.0 | `10.0.5` | 85/85 ✅ | 84/84 ✅ | ✅ | 1/1 ✅ | **Pass** |
| .NET 9.0 | `9.0.14` | 56/56 ✅ | 53/53 ✅ | ✅ | 1/1 ✅ | **Pass** |
| .NET 8.0 | `8.0.25` | 55/55 ✅ | 53/53 ✅ | ✅ | 1/1 ✅ | **Pass** |

**Total:** 278 URLs verified, 271 hashes verified, all CDN and aka.ms checks passed. **No issues found.**

### Checks Performed
1. **URL liveness** — HTTP HEAD on every download link in `releases.json`
2. **SHA512 hashes** — Downloaded each binary and verified SHA512 against `releases.json`
3. **CDN latest.version** — Cross-validated CDN files against `releases.json`
4. **aka.ms redirects** — Verified short URLs resolve to correct targets
```

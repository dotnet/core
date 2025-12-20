# Project File Analysis (Q5)

Query cost comparison for Q5-Project category tests from [release-graph-eval](https://github.com/dotnet/release-graph-eval).

See [overview.md](../overview.md) for design context, file characteristics, and link relation discovery.

## T13: TFM Support Check

**Query:** "Here's my project file with `<TargetFramework>net7.0</TargetFramework>`. Is my target framework still supported?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `manifest.json` → `target-frameworks.json` per version | **~45 KB** |
| hal-index | `index.json` → `manifest.json` → `target-frameworks.json` per version | **~50 KB** |
| releases-index | `releases-index.json` (string parsing) | **6 KB** |

**llms-index:** Navigate via manifest to target-frameworks for each supported release:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
TFM="net7.0"

# Check each supported release's target-frameworks.json for the TFM
LLMS_DATA=$(curl -s "$LLMS")
SUPPORTED=""

for MANIFEST_HREF in $(echo "$LLMS_DATA" | jq -r '._embedded.latest_patches[]._links.manifest.href'); do
  TFM_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links["target-frameworks"].href')
  MATCH=$(curl -s "$TFM_HREF" | jq -r --arg tfm "$TFM" '.frameworks[] | select(.tfm == $tfm) | .tfm')
  if [ -n "$MATCH" ]; then
    VERSION=$(curl -s "$TFM_HREF" | jq -r '.version')
    SUPPORTED="$VERSION"
    break
  fi
done

if [ -n "$SUPPORTED" ]; then
  echo "$TFM is supported (found in .NET $SUPPORTED)"
else
  echo "$TFM is NOT supported"
fi
# net7.0 is NOT supported
```

**Winner:** Tie (all equivalent with string parsing)

- All schemas can use string parsing for efficiency
- llms-index/hal-index shown here use authoritative TFM data for correctness

**Analysis:**

- **Completeness:** ✅ All schemas can determine support status.
- **Correctness vs efficiency:** llms-index uses authoritative TFM data via `target-frameworks` relation; releases-index uses string parsing.
- **Platform TFMs:** The `target-frameworks` approach correctly handles platform-specific TFMs (e.g., `net10.0-android`) that string parsing would miss.

---

## T14: Package CVE Check

**Query:** "Here's my project file with package references. Have any of my packages had CVEs in the last 6 months?"

```xml
<PackageReference Include="Microsoft.Build" Version="17.10.10" />
<PackageReference Include="Microsoft.Build.Tasks.Core" Version="17.8.10" />
```

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → 6 month cve.json files (via `prev-security`) | **~60 KB** |
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → 6 month cve.json files | **~65 KB** |
| releases-index | N/A | N/A |

**llms-index:** Walk security timeline and check packages in cve.json with version comparison:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

# Package references from project file (name and version)
declare -A PKGS
PKGS["Microsoft.Build"]="17.10.10"
PKGS["Microsoft.Build.Tasks.Core"]="17.8.10"

# Start from the latest security month
MONTH_HREF=$(curl -s "$LLMS" | jq -r '._links["latest-security-month"].href')

# Walk back 6 security months
for i in {1..6}; do
  DATA=$(curl -s "$MONTH_HREF")
  YEAR=$(echo "$DATA" | jq -r '.year')
  MONTH=$(echo "$DATA" | jq -r '.month')
  CVE_HREF=$(echo "$DATA" | jq -r '._links["cve-json"].href // empty')
  
  if [ -n "$CVE_HREF" ]; then
    CVE_DATA=$(curl -s "$CVE_HREF")
    
    for pkg in "${!PKGS[@]}"; do
      ver="${PKGS[$pkg]}"
      # Check vulnerability and get commit diff URLs
      echo "$CVE_DATA" | jq -r --arg pkg "$pkg" --arg ver "$ver" --arg ym "$YEAR-$MONTH" '
        .commits as $all_commits |
        .packages[]? | select(.name == $pkg) |
        if ($ver >= .min_vulnerable and $ver <= .max_vulnerable) then
          "\($ym) | \($pkg)@\($ver) | \(.cve_id) | vulnerable: \(.min_vulnerable)-\(.max_vulnerable) | fixed: \(.fixed)",
          (.commits[]? | "  diff: " + ($all_commits[.].url // "unknown"))
        else
          empty
        end
      '
    done
  fi
  
  MONTH_HREF=$(echo "$DATA" | jq -r '._links["prev-security"].href // empty')
  [ -z "$MONTH_HREF" ] && break
done
# 2025-10 | Microsoft.Build@17.10.10 | CVE-2025-55247 | vulnerable: 17.10.0-17.10.29 | fixed: 17.10.46
#   diff: https://github.com/dotnet/msbuild/commit/aa888d3214e5adb503c48c3bad2bfc6c5aff638a.diff
# 2025-10 | Microsoft.Build.Tasks.Core@17.8.10 | CVE-2025-55247 | vulnerable: 17.8.0-17.8.29 | fixed: 17.8.43
#   diff: https://github.com/dotnet/msbuild/commit/f0cbb13971c30ad15a3f252a8d0171898a01ec11.diff
```

**Winner:** llms-index

- Direct `latest-security-month` link as starting point
- Package-level CVE data with commit diff URLs
- Enables code review of security fixes without relying on nuget.org

**Analysis:**

- **Completeness:** ⚠️ releases-index does not provide package-level CVE data.
- **Version matching:** String comparison works for semver when patch versions have consistent digit counts.
- **Commit diffs:** The `.commits` lookup provides direct links to fix diffs on GitHub.
- **Timeline navigation:** Uses `prev-security` links to efficiently walk security history.

---

## T15: Target Platform Versions

**Query:** "For a .NET MAUI app targeting `net10.0-android` and `net10.0-ios`, what platform SDK versions do these target?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `10.0/manifest.json` → `target-frameworks.json` | **11 KB** |
| hal-index | `index.json` → `10.0/index.json` → `10.0/manifest.json` → `target-frameworks.json` | **14 KB** |
| releases-index | N/A | N/A (not available) |

**llms-index:** Navigate to target-frameworks.json via manifest link:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

# Get target-frameworks.json for .NET 10 via manifest link
MANIFEST_HREF=$(curl -s "$LLMS" | jq -r '._embedded.latest_patches[] | select(.release == "10.0") | ._links.manifest.href')
TFM_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links["target-frameworks"].href')

# Get Android and iOS platform versions
curl -s "$TFM_HREF" | jq -r '.frameworks[] | select(.platform == "android" or .platform == "ios") | "\(.tfm) targets \(.platform_name) \(.platform_version)"'
# net10.0-android targets Android 36.0
# net10.0-ios targets iOS 18.7
```

**Winner:** llms-index

- Direct path via `manifest` link
- Platform-specific TFM data not available in releases-index

**Analysis:**

- **Completeness:** ❌ releases-index does not include target framework data.
- **MAUI context:** Understanding multi-platform project requirements.
- **Version mapping:** Each .NET version targets specific platform SDK versions (Android API level, iOS SDK version).

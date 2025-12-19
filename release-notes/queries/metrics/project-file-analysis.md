# Project File Analysis (Q5)

Query cost comparison for Q5-Project category tests from [release-graph-eval](https://github.com/dotnet/release-graph-eval).

See [overview.md](../overview.md) for design context, file characteristics, and link relation discovery.

## T13: TFM Support Check

**Query:** "Here's my project file with `<TargetFramework>net7.0</TargetFramework>`. Is my target framework still supported?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` | **5 KB** |
| hal-index | `index.json` | **5 KB** |
| releases-index | `releases-index.json` | **6 KB** |

**llms-index:** Check `supported_releases` array directly:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
TFM="net7.0"
VERSION=$(echo "$TFM" | sed 's/net//' | sed 's/\.0$//')  # Extract "7" from "net7.0"

# Check if version is in supported_releases
curl -s "$LLMS" | jq -r --arg v "$VERSION.0" '
  if (.supported_releases | index($v)) then
    "\($v) is supported"
  else
    "\($v) is NOT supported. EOL: " + (._embedded.latest_patches[] | select(.release == $v) | .eol_date // "unknown")
  end
'
# 7.0 is NOT supported. EOL: 2024-05-14
```

**Winner:** llms-index (tie with hal-index)

- Direct array check, no navigation required
- EOL date available from embedded data if not supported

**Analysis:**

- **Completeness:** ✅ All schemas can determine support status.
- **Zero-fetch answers:** Both llms-index and hal-index embed support status in root; releases-index requires enum comparison.
- **Project file parsing:** LLM must extract version from TFM format (net7.0 → 7.0).

---

## T14: Package CVE Check

**Query:** "Here's my project file with package references. Have any of my packages had CVEs in the last 6 months?"

```xml
<PackageReference Include="Microsoft.AspNetCore.Components" Version="8.0.0" />
<PackageReference Include="System.Text.Json" Version="8.0.0" />
<PackageReference Include="System.Formats.Asn1" Version="8.0.0" />
<PackageReference Include="Microsoft.Data.SqlClient" Version="5.1.0" />
```

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → 6 month cve.json files (via `prev-security`) | **47 KB** |
| hal-index | `timeline/index.json` → `timeline/2025/index.json` → 6 month cve.json files | **53 KB** |
| releases-index | All version releases.json files | **2.4 MB** (incomplete) |

**llms-index:** Walk security timeline and check package arrays:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
PACKAGES=("Microsoft.AspNetCore.Components" "System.Text.Json" "System.Formats.Asn1" "Microsoft.Data.SqlClient")

# Start from the latest security month
MONTH_HREF=$(curl -s "$LLMS" | jq -r '._links["latest-security-month"].href')

# Walk back 6 security months, checking package arrays
for i in {1..6}; do
  DATA=$(curl -s "$MONTH_HREF")
  YEAR=$(echo "$DATA" | jq -r '.year')
  MONTH=$(echo "$DATA" | jq -r '.month')
  
  # Check each package against the packages array
  for pkg in "${PACKAGES[@]}"; do
    echo "$DATA" | jq -r --arg pkg "$pkg" --arg ym "$YEAR-$MONTH" '
      .packages[]? | select(.name == $pkg) |
      "\($ym) | \($pkg) | \(.cve_id) | vulnerable: \(.min_vulnerable)-\(.max_vulnerable) | fixed: \(.fixed)"
    '
  done
  
  MONTH_HREF=$(echo "$DATA" | jq -r '._links["prev-security"].href // empty')
  [ -z "$MONTH_HREF" ] && break
done
# 2025-10 | Microsoft.AspNetCore.Components | CVE-2025-XXXXX | vulnerable: 8.0.0-8.0.5 | fixed: 8.0.6
# 2025-08 | System.Text.Json | CVE-2025-XXXXX | vulnerable: 8.0.0-8.0.3 | fixed: 8.0.4
```

**Winner:** llms-index

- Direct `latest-security-month` link as starting point
- Package-level CVE data in `packages[]` array
- **51x smaller** than releases-index (which can't answer package-level queries)

**Analysis:**

- **Completeness:** ⚠️ releases-index only provides product-level CVEs, not package-level.
- **Version matching:** LLM must compare package versions against `min_vulnerable`/`max_vulnerable` ranges.
- **Timeline navigation:** Uses `prev-security` links to efficiently walk security history.

---

## T15: Target Platform Versions

**Query:** "For a .NET MAUI app targeting `net10.0-android` and `net10.0-ios`, what platform SDK versions do these target?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `10.0/index.json` → `target-frameworks.json` | **20 KB** |
| hal-index | `index.json` → `10.0/index.json` → `target-frameworks.json` | **25 KB** |
| releases-index | N/A | N/A (not available) |

**llms-index:** Navigate to target-frameworks.json via release-major link:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"

# Get target-frameworks.json for .NET 10 via release-major link
VERSION_HREF=$(curl -s "$LLMS" | jq -r '._embedded.latest_patches[] | select(.release == "10.0") | ._links["release-major"].href')
TFM_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links["target-frameworks-json"].href')

# Get Android and iOS platform versions
curl -s "$TFM_HREF" | jq -r '.frameworks[] | select(.platform == "android" or .platform == "ios") | "\(.tfm) targets \(.platform | ascii_upcase) \(.platform_version)"'
# net10.0-android targets ANDROID 36.0
# net10.0-ios targets IOS 18.0
```

**Winner:** llms-index

- Direct path via `release-major` link
- Platform-specific TFM data not available in releases-index

**Analysis:**

- **Completeness:** ❌ releases-index does not include target framework data.
- **MAUI context:** Understanding multi-platform project requirements.
- **Version mapping:** Each .NET version targets specific platform SDK versions (Android API level, iOS SDK version).

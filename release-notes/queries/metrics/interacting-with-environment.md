# Interacting with My Environment (Q4)

Query cost comparison for Q4-Environment category tests from [release-graph-eval](https://github.com/dotnet/release-graph-eval).

See [overview.md](../overview.md) for design context, file characteristics, and link relation discovery.

## T10: Security Audit Persona

**Query:** "I'm auditing the security of our production servers. Here's what I found: [simulated dotnet --version showing 8.0.0]. Are these .NET versions safe, or do I need to upgrade due to CVEs?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `8.0/8.0.21/index.json` | **14 KB** |
| hal-index | `index.json` → `8.0/index.json` → `8.0/8.0.21/index.json` | **34 KB** |
| releases-index | `releases-index.json` → `8.0/releases.json` | **1,269 KB** |

**llms-index:** The `_embedded.latest_patches` array provides immediate version comparison:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
VERSION="8.0"
INSTALLED="8.0.0"

# Step 1: Check current patch level vs installed version
curl -s "$LLMS" | jq -r --arg v "$VERSION" --arg i "$INSTALLED" '._embedded.latest_patches[] | select(.release == $v) |
  "Current: \(.version) | Installed: \($i) | Outdated: \(.version != $i) | Security patches since: \(.latest_security)"'
# Current: 8.0.22 | Installed: 8.0.0 | Outdated: true | Security patches since: 8.0.21

# Step 2: Get CVE details from latest security patch
SECURITY_HREF=$(curl -s "$LLMS" | jq -r --arg v "$VERSION" '._embedded.latest_patches[] | select(.release == $v) | ._links["latest-security"].href')
curl -s "$SECURITY_HREF" | jq -r '.cve_records[]'
# CVE-2025-55247
# CVE-2025-55248
# CVE-2025-55315
```

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"
VERSION="8.0"
INSTALLED="8.0.0"

# Step 1: Get version index
VERSION_HREF=$(curl -s "$ROOT" | jq -r --arg v "$VERSION" '._embedded.releases[] | select(.version == $v) | ._links.self.href')

# Step 2: Get latest patch and compare
VERSION_DATA=$(curl -s "$VERSION_HREF")
echo "$VERSION_DATA" | jq -r --arg i "$INSTALLED" '._embedded.releases[0] |
  "Current: \(.version) | Installed: \($i) | Outdated: \(.version != $i)"'
# Current: 8.0.22 | Installed: 8.0.0 | Outdated: true

# Step 3: Get CVE details from latest security patch
SECURITY_HREF=$(echo "$VERSION_DATA" | jq -r '._links["latest-security"].href')
curl -s "$SECURITY_HREF" | jq -r '.cve_records[]'
# CVE-2025-55247
# CVE-2025-55248
# CVE-2025-55315
```

**Winner:** llms-index

- Immediate version comparison from root index
- Direct link to security patch details
- **97x smaller** than releases-index for CVE lookup

**Analysis:**

- **Completeness:** ✅ All schemas can identify outdated versions and list CVEs.
- **Version comparison:** llms-index embeds current patch version, enabling immediate comparison with user-provided version without navigation.
- **Security context:** llms-index provides `latest_security` pointer for quick CVE lookup; releases-index requires downloading full 1.2 MB release history.

---

## T11: Minimum libc Version Check

**Query:** "I'm building a custom Linux container for .NET 10 on Alpine Linux with musl 1.2.4. Can I run .NET 10? What's the minimum libc version required?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `manifest.json` → `supported-os.json` | **17 KB** |
| hal-index | `index.json` → `10.0/index.json` → `manifest.json` → `supported-os.json` | **20 KB** |
| releases-index | N/A | N/A (not available) |

**llms-index:** Navigate to supported-os.json for libc requirements:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
VERSION="10.0"
ARCH="x64"

# Step 1: Get manifest for target version
MANIFEST_HREF=$(curl -s "$LLMS" | jq -r --arg v "$VERSION" '._embedded.latest_patches[] | select(.release == $v) | ._links.manifest.href')

# Step 2: Get supported-os.json from manifest
SUPPORTED_OS_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links["supported-os-json"].href')

# Step 3: Get libc requirements for architecture
curl -s "$SUPPORTED_OS_HREF" | jq -r --arg a "$ARCH" '.libc[] | select(.architectures[] == $a) | "\(.name) >= \(.version)"'
# glibc >= 2.27
# musl >= 1.2.2
```

**Winner:** llms-index

- Direct navigation from embedded latest_patches
- Both glibc and musl requirements in same file
- **1.2x smaller** than hal-index

**Analysis:**

- **Completeness:** ❌ releases-index does not include libc version requirements.
- **libc variants:** supported-os.json includes both glibc (standard Linux) and musl (Alpine) requirements.
- **Architecture filtering:** Requirements vary by architecture (x64, arm64, etc.).

---

## T12: Docker Setup with SDK Download

**Query:** "I'm writing a Dockerfile for .NET 10 on Ubuntu 24.04. I need to: 1. Install the required OS packages 2. Download and extract the .NET 10 SDK tarball. Generate the apt-get install command and give me the SDK download URL."

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `manifest.json` → `os-packages.json` + `sdk/index.json` → `downloads/index.json` → `downloads/sdk.json` | **~36 KB** |
| hal-index | `index.json` → `10.0/index.json` → `manifest.json` → `os-packages.json` + SDK files | **~39 KB** |
| releases-index | `releases-index.json` → `10.0/releases.json` | **~25 KB** (partial) |

**llms-index:** Navigate to OS packages and SDK download:

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
VERSION="10.0"
DISTRO="Ubuntu"
DISTRO_RELEASE="24.04"

# Step 1: Get manifest for target version
MANIFEST_HREF=$(curl -s "$LLMS" | jq -r --arg v "$VERSION" '._embedded.latest_patches[] | select(.release == $v) | ._links.manifest.href')
MANIFEST=$(curl -s "$MANIFEST_HREF")

# Step 2: Generate apt-get command
OS_PACKAGES_HREF=$(echo "$MANIFEST" | jq -r '._links["os-packages-json"].href')
curl -s "$OS_PACKAGES_HREF" | jq -r --arg d "$DISTRO" --arg r "$DISTRO_RELEASE" '
  .distributions[] | select(.name == $d) | .releases[] | select(.release == $r) |
  "sudo apt-get update && sudo apt-get install -y " + ([.packages[].name] | join(" "))
'
# sudo apt-get update && sudo apt-get install -y libc6 libgcc-s1 ca-certificates libssl3t64 libstdc++6 libicu74 tzdata libgssapi-krb5-2

# Step 3: Get SDK download URL for linux-x64 via latest-sdk -> downloads
LATEST_SDK_HREF=$(curl -s "$LLMS" | jq -r --arg v "$VERSION" '._embedded.latest_patches[] | select(.release == $v) | ._links["latest-sdk"].href')
SDK_DATA=$(curl -s "$LATEST_SDK_HREF")
DOWNLOADS_HREF=$(echo "$SDK_DATA" | jq -r '._links.downloads.href')
DOWNLOADS=$(curl -s "$DOWNLOADS_HREF")
SDK_JSON_HREF=$(echo "$DOWNLOADS" | jq -r '._embedded.components[] | select(.name == "sdk") | ._links.self.href')
SDK_DOWNLOADS=$(curl -s "$SDK_JSON_HREF")
echo "$SDK_DOWNLOADS" | jq -r '._embedded.downloads["linux-x64"]._links.download.href'
# https://aka.ms/dotnet/10.0/dotnet-sdk-linux-x64.tar.gz
```

**Winner:** llms-index

- Both apt-get command and SDK URL from same manifest navigation
- **2.1x smaller** than hal-index
- releases-index has SDK URLs but not OS packages

**Analysis:**

- **Completeness:** ⚠️ releases-index can provide SDK URLs but not OS package requirements.
- **Multi-part synthesis:** LLM must combine package installation command with SDK download URL.
- **Dockerfile context:** Understanding the complete tarball deployment workflow.

# Upgrade and What's New Queries

Query cost comparison for upgrade planning and what's new queries from [release-graph-eval](https://github.com/dotnet/release-graph-eval).

See [overview.md](../overview.md) for design context, file characteristics, and link relation discovery.

## T7: High-Impact Breaking Changes Analysis

**Query:** "I'm planning to upgrade to .NET 10. What are the high-impact breaking changes I should be aware of? For each one, give me the announcement link so I can track the discussion."

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `10.0/manifest.json` → `10.0/compatibility.json` | **~114 KB** |
| hal-index | `index.json` → `10.0/index.json` → `10.0/manifest.json` → `compatibility.json` | **~117 KB** |
| releases-index | N/A | N/A (not available) |

**llms-index:**

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
VERSION="10.0"

# Step 1: Get manifest link from embedded patch data
MANIFEST_HREF=$(curl -s "$LLMS" | jq -r --arg v "$VERSION" '._embedded.latest_patches[] | select(.release == $v) | ._links.manifest.href')

# Step 2: Get compatibility.json link from manifest
COMPAT_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links.compatibility.href')

# Step 3: Filter for high-impact breaking changes with announcement URLs
curl -s "$COMPAT_HREF" | jq -r '.breaks[] | select(.impact == "high") | "\(.title)\n  Announcement: \(.references[] | select(.type == "announcement") | .url)\n"'
```

**Output:**
```
WebHostBuilder, IWebHost, and WebHost are obsolete
  Announcement: https://github.com/aspnet/Announcements/issues/526

DateOnly and TimeOnly support on SQL Server with EF Core
  Announcement: https://github.com/dotnet/efcore/issues/35662
```

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"
VERSION="10.0"

# Step 1: Get version index
VERSION_HREF=$(curl -s "$ROOT" | jq -r --arg v "$VERSION" '._embedded.releases[] | select(.version == $v) | ._links.self.href')

# Step 2: Get manifest link
MANIFEST_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links.manifest.href')

# Step 3-4: Same as llms-index from here
COMPAT_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links.compatibility.href')
curl -s "$COMPAT_HREF" | jq -r '.breaks[] | select(.impact == "high") | "\(.title)\n  Announcement: \(.references[] | select(.type == "announcement") | .url)\n"'
```

**releases-index:** Cannot answer—no breaking changes data.

**Winner:** llms-index (**~114 KB**, one fewer fetch than hal-index)

**Analysis:**

- **Completeness:** ❌ releases-index has no breaking changes data.
- **Impact filtering:** The `impact` field (high/medium/low) enables prioritized upgrade planning.
- **Reference types:** Each breaking change includes typed references (announcement, documentation, documentation-rendered) for different use cases.
- **Navigation:** llms-index `_embedded.latest_patches[]` provides direct `manifest` link, skipping the version index fetch.

---

## T8: Code Migration

**Query:** "I'm upgrading our ASP.NET Core application from .NET 8 to .NET 10. When I target .NET 10, I get compiler warnings about `WebHostBuilder` being deprecated. What breaking change is this, and how should I fix the code?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `manifest.json` → `compatibility.json` → doc.md | **~119 KB** |
| hal-index | `index.json` → `10.0/index.json` → `manifest.json` → `compatibility.json` → doc.md | **~122 KB** |
| releases-index | N/A | N/A (not available) |

**llms-index:**

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
VERSION="10.0"

# Step 1: Navigate to compatibility.json
MANIFEST_HREF=$(curl -s "$LLMS" | jq -r --arg v "$VERSION" '._embedded.latest_patches[] | select(.release == $v) | ._links.manifest.href')
COMPAT_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links.compatibility.href')

# Step 2: Find WebHostBuilder breaking change
BREAK=$(curl -s "$COMPAT_HREF" | jq '.breaks[] | select(.title | test("WebHostBuilder"; "i"))')
echo "$BREAK" | jq -r '"Breaking Change: \(.title)\nID: \(.id)\nImpact: \(.impact)"'

# Step 3: Get documentation URL for migration guidance
DOC_URL=$(echo "$BREAK" | jq -r '.references[] | select(.type == "documentation") | .url')
echo "Documentation: $DOC_URL"

# Step 4: Fetch migration documentation
curl -s "$DOC_URL"
```

**Output:**
```
Breaking Change: WebHostBuilder, IWebHost, and WebHost are obsolete
ID: aspnet-core-10-webhostbuilder-deprecated
Impact: medium

Documentation: https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/aspnet-core/10/webhostbuilder-deprecated.md
```

The documentation contains the migration code:
```csharp
// Before (.NET 8)
var hostBuilder = new WebHostBuilder()
    .UseStartup<TestStartup>();
var server = new TestServer(hostBuilder);

// After (.NET 10)
var host = new HostBuilder()
    .ConfigureWebHost(webHostBuilder =>
    {
        webHostBuilder
            .UseTestServer()
            .UseStartup<TestStartup>();
    })
    .Build();
await host.StartAsync();
var server = host.GetTestServer();
```

**releases-index:** Cannot answer—no breaking changes or documentation references.

**Winner:** llms-index (**~120 KB**, direct path to migration docs)

**Analysis:**

- **Completeness:** ❌ releases-index cannot help with code migration.
- **Reference types:** The `documentation` reference points to raw markdown, enabling LLMs to extract code examples directly.
- **Search capability:** Breaking changes can be searched by title, category, or affected API.
- **End-to-end:** Single navigation path from entry point to actionable migration code.

---

## T9: What's New in Runtime

**Query:** "What's new in the runtime for .NET 10?"

| Schema | Files Required | Total Transfer |
|--------|----------------|----------------|
| llms-index | `llms.json` → `10.0/manifest.json` → `runtime.md` | **~24 KB** |
| hal-index | `index.json` → `10.0/index.json` → `manifest.json` → `runtime.md` | **~27 KB** |
| releases-index | N/A | N/A (not available) |

**llms-index:**

```bash
LLMS="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/llms.json"
VERSION="10.0"

# Step 1: Get manifest link
MANIFEST_HREF=$(curl -s "$LLMS" | jq -r --arg v "$VERSION" '._embedded.latest_patches[] | select(.release == $v) | ._links.manifest.href')

# Step 2: Get whats-new-runtime link
RUNTIME_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links["whats-new-runtime"].href')

# Step 3: Fetch runtime what's new documentation
curl -s "$RUNTIME_HREF"
```

**Output (excerpt):**
```markdown
# What's new in the .NET 10 runtime

- JIT improvements: struct argument code generation, loop inversion,
  array interface devirtualization, improved code layout, inlining
- Stack allocation: small arrays, escape analysis, delegate stack allocation
- AVX10.2 support
- Arm64 write-barrier improvements
- NativeAOT type preinitializer enhancements
```

**hal-index:**

```bash
ROOT="https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/index.json"
VERSION="10.0"

# Step 1: Get version index
VERSION_HREF=$(curl -s "$ROOT" | jq -r --arg v "$VERSION" '._embedded.releases[] | select(.version == $v) | ._links.self.href')

# Step 2-3: Same as llms-index
MANIFEST_HREF=$(curl -s "$VERSION_HREF" | jq -r '._links.manifest.href')
RUNTIME_HREF=$(curl -s "$MANIFEST_HREF" | jq -r '._links["whats-new-runtime"].href')
curl -s "$RUNTIME_HREF"
```

**releases-index:** Cannot answer—no what's new documentation.

**Winner:** llms-index (**~25 KB**, 2 fetches vs 3 for hal-index)

**Analysis:**

- **Completeness:** ❌ releases-index has no what's new content.
- **Granular links:** The manifest provides separate links for `whats-new-runtime`, `whats-new-libraries`, `whats-new-sdk`, enabling targeted fetches.
- **Raw markdown:** Documentation is raw markdown, ideal for LLM consumption and summarization.
- **Navigation efficiency:** llms-index embedded patches provide direct manifest link, saving one fetch.

---

## Summary

| Test | Query | Winner | releases-index |
|------|-------|--------|----------------|
| T7 | High-impact breaking changes | llms-index (~115 KB) | ❌ Not available |
| T8 | Code migration guidance | llms-index (~120 KB) | ❌ Not available |
| T9 | What's new in runtime | llms-index (~25 KB) | ❌ Not available |

**Key insights:**

- **releases-index gaps:** No breaking changes, no migration docs, no what's new content—these are essential for upgrade planning.
- **Manifest as hub:** The `manifest.json` serves as a hub linking to compatibility data, what's new docs, OS packages, and more.
- **llms-index advantage:** Embedded `latest_patches[]` with direct `manifest` link saves one navigation hop on every query.
- **Reference types:** Breaking changes include typed references (announcement, documentation, documentation-rendered) for different consumption patterns.

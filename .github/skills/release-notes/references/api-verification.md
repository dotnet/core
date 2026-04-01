# API Verification with dotnet-inspect

Release notes reference specific .NET types, methods, properties, and enums by name. Getting these wrong is worse than omitting them — incorrect API names look authoritative but teach developers something false. Use `dotnet-inspect` to verify every API reference before including it in release notes.

## Why this matters

The agent reads PR titles and descriptions from `changes.json` to understand what shipped. PR titles often use informal or abbreviated names that don't match the actual public API surface. For example:

- A PR titled "Add zstd support" doesn't tell you whether the type is `ZstdCompressionProvider`, `ZstandardCompressionProvider`, or `ZStandardResponseCompressionProvider`
- A PR titled "Add JsonContains" doesn't tell you the return type, parameter types, or whether it's `JsonContains` or `JsonContainsAsync`
- A PR titled "Rename JsonExists" doesn't confirm the new name is `JsonPathExists` vs `JsonExistsPath` vs `JsonPathExistsAsync`

Without verification, the agent will guess — and guesses end up in code samples that don't compile.

## How to use dotnet-inspect

`dotnet-inspect` is available as a Copilot skill. Invoke it with `dotnet-inspect` to get the full command reference and mental model. The tool queries NuGet packages, platform libraries, and local files.

### Installation

The tool runs via `dnx` (like `npx` for .NET). No installation needed — just use:

```bash
dnx dotnet-inspect -y -- <command>
```

### Getting a current SDK for verification

By default, `--platform` queries the locally installed SDK. When writing release notes for Preview N, the local SDK may be Preview N-1 or older — so new APIs won't be found. **Always check what version you're querying:**

```bash
dotnet --version  # e.g., 11.0.100-preview.2.26159.112
```

If the installed SDK is older than the preview you're writing about, download the correct nightly SDK build.

### Finding the right build

Preview releases ship from release branches, not main. By the time you're writing Preview N release notes, main may have moved to Preview N+1 or alpha. You need the **last daily build from main before the branding changed past Preview N**.

The `dotnet11` NuGet feed publishes daily builds of `Microsoft.NETCore.App.Ref` with version strings like `11.0.0-preview.3.26179.102`. Query the feed to find the latest Preview N build:

```bash
# Find the latest preview.3 build number from the nightly feed
curl -s "https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet11/nuget/v3/flat2/microsoft.netcore.app.ref/index.json" \
  | python3 -c "
import json, sys
versions = json.load(sys.stdin)['versions']
p3 = sorted([v for v in versions if 'preview.3' in v],
            key=lambda v: [int(n) for n in v.split('.')[-2:]])
print(p3[-1])
"
# Output: 11.0.0-preview.3.26179.102
```

The SDK tarball version matches the runtime version's build number. Download it from ci.dot.net:

```bash
# The version from the feed query above
VERSION="11.0.100-preview.3.26179.102"

# Download the SDK tarball
curl -Lo /tmp/dotnet-sdk-p3.tar.gz \
  "https://ci.dot.net/public/Sdk/${VERSION}/dotnet-sdk-${VERSION}-osx-arm64.tar.gz"

# Extract to a local directory (don't overwrite the system SDK)
mkdir -p /tmp/dotnet-p3
tar xzf /tmp/dotnet-sdk-p3.tar.gz -C /tmp/dotnet-p3

# Verify
/tmp/dotnet-p3/dotnet --version  # 11.0.100-preview.3.26179.102
```

Then point `dotnet-inspect` at it with `DOTNET_ROOT`:

```bash
DOTNET_ROOT=/tmp/dotnet-p3 dnx dotnet-inspect -y -- find "*AnyNewLine*" --platform
DOTNET_ROOT=/tmp/dotnet-p3 dnx dotnet-inspect -y -- member RegexOptions --platform System.Text.RegularExpressions -k field
```

### Why this matters: stale builds give false negatives

Without the correct build, `dotnet-inspect --platform` queries whatever SDK is installed locally. If you're on Preview 2 and writing Preview 3 notes, every new P3 API will come back "not found" — but that doesn't mean the API was reverted or doesn't exist. It means you're querying stale data.

A false negative on a stale build is indistinguishable from a genuinely reverted API. **Always verify against a build that matches the preview you're writing about.**

**Report the build version.** When writing release notes, note which SDK build you verified against — either as a comment in the markdown or in your working notes. For example: `<!-- Verified against SDK 11.0.100-preview.3.26179.102 -->`

### Common verification patterns

**Find a type by name** — when a PR mentions a new type:

```bash
# Search across ASP.NET Core packages for the zstd type
dnx dotnet-inspect -y -- find "*Zstandard*" --aspnetcore

# Search across all platform libraries
dnx dotnet-inspect -y -- find "*ProcessStartOptions*" --platform
```

**Verify a type's members** — when writing a code sample:

```bash
# See the full API surface of a type
dnx dotnet-inspect -y -- member ZstandardCompressionProvider --aspnetcore

# Check specific method signatures
dnx dotnet-inspect -y -- member JsonSerializer --package System.Text.Json -m Deserialize
```

**Verify an enum value** — when referencing specific options:

```bash
# Check what values an enum has
dnx dotnet-inspect -y -- member RegexOptions --platform -k field
```

**Diff between versions** — when documenting what's new:

```bash
# See what APIs were added between previews
dnx dotnet-inspect -y -- diff --package Microsoft.EntityFrameworkCore@11.0.0-preview.2..11.0.0-preview.3
```

## When to verify

Verify **every** API name that appears in:

- Prose text (e.g., "The new `ProcessStartOptions` class...")
- Code samples (every type, method, and property used)
- Before/after comparisons (both the old and new names)

You do NOT need to verify:

- PR numbers and URLs (these come from `changes.json` and are authoritative)
- General concepts (e.g., "Zstandard compression" as a concept vs `ZstandardCompressionProvider` as a type)
- CLI flags (e.g., `dotnet test --artifacts-path`)

## What to do when verification fails

If `dotnet-inspect` can't find a type:

1. **Check your build version first** — run `dotnet --version` or check `DOTNET_ROOT`. If you're querying a build older than the preview you're writing about, the API may simply not be in that build. Download the correct nightly (see above).
2. **Named differently** — search with a broader pattern (`find "*Zstd*"` instead of the exact name).
3. **Reverted** — check `changes.json` for a revert PR. If the API was added and then reverted in the same preview, it didn't ship. Don't document it.
4. **Internal** — the type may not be public. Don't document internal types in release notes.
5. **Read the PR tests** — when the correct nightly build is unavailable, the PR's test files are ground truth. Tests compile and run against the actual API surface. Derive code samples from test assertions rather than guessing type names.

When in doubt, describe the feature without naming specific types and link to the PR. A correct prose description is always better than a wrong code sample.

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

### Running the tool

The tool runs via `dnx` (like `npx` for .NET). No installation needed:

```bash
dnx dotnet-inspect -y -- <command>
```

### Querying the correct build

When writing release notes for Preview N, the locally installed SDK is often Preview N-1 or older. The `--platform` flag queries the local SDK, so new APIs won't be found. Instead, **query the nightly NuGet packages directly** using `--package` and `--source`.

### Step 1: Generate build metadata

`dotnet-release generate build-metadata` reads the VMR's version info and queries the nightly NuGet feed to find the correct package versions:

```bash
dotnet-release generate build-metadata ~/git/dotnet \
  --base v11.0.0-preview.2.26159.112 \
  --head origin/release/11.0.1xx-preview3 \
  --output build-metadata.json
```

This produces:

```json
{
  "version": "11.0.0-preview.3",
  "base_ref": "v11.0.0-preview.2.26159.112",
  "head_ref": "origin/release/11.0.1xx-preview3",
  "build": {
    "version": "11.0.0-preview.3.26179.102",
    "sdk_version": "11.0.100-preview.3.26179.102",
    "sdk_url": "https://ci.dot.net/public/Sdk/11.0.100-preview.3.26179.102/dotnet-sdk-11.0.100-preview.3.26179.102-{platform}.tar.gz"
  },
  "nuget": {
    "source": "https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet11/nuget/v3/index.json",
    "packages": {
      "Microsoft.NETCore.App.Ref": "11.0.0-preview.3.26179.102",
      "Microsoft.AspNetCore.App.Ref": "11.0.0-preview.3.26179.102",
      "Microsoft.WindowsDesktop.App.Ref": "11.0.0-preview.3.26179.102",
      "Microsoft.EntityFrameworkCore": "11.0.0-preview.3.26179.102"
    }
  }
}
```

### Step 2: Verify APIs against the correct packages

Read the `nuget.source` and `nuget.packages` from `build-metadata.json` and use them directly with `dotnet-inspect`. All queries are pure data — no SDK installation needed.

**Find a type by name:**

```bash
FEED="https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet11/nuget/v3/index.json"
VER="11.0.0-preview.3.26179.102"

# Search the runtime ref pack
dnx dotnet-inspect -y -- find "*AnyNewLine*" --package "Microsoft.NETCore.App.Ref@${VER}" --source "$FEED"

# Search ASP.NET Core ref pack
dnx dotnet-inspect -y -- find "*Zstandard*" --package "Microsoft.AspNetCore.App.Ref@${VER}" --source "$FEED"
```

**Verify a type's members:**

```bash
dnx dotnet-inspect -y -- member RegexOptions --package "Microsoft.NETCore.App.Ref@${VER}" --source "$FEED" -k field
```

**Diff between versions:**

```bash
dnx dotnet-inspect -y -- diff --package "Microsoft.NETCore.App.Ref@11.0.0-preview.2..11.0.0-preview.3" --source "$FEED"
```

### Report what you verified against

Always note the package version in a markdown comment so reviewers know the verification is grounded:

```markdown
<!-- Verified against Microsoft.NETCore.App.Ref@11.0.0-preview.3.26179.102 -->
```

This makes it possible to distinguish "API doesn't exist" from "verified against a stale build."

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

1. **Check your package version first** — are you querying a Preview N-1 package while writing Preview N notes? Find the correct version (see above).
2. **Named differently** — search with a broader pattern (`find "*Zstd*"` instead of the exact name).
3. **Reverted** — check `changes.json` for a revert PR. If the API was added and then reverted in the same preview, it didn't ship. Don't document it.
4. **Internal** — the type may not be public. Don't document internal types in release notes.
5. **Read the PR tests** — the PR's test files are ground truth. Tests compile and run against the actual API surface. Derive code samples from test assertions rather than guessing type names.

When in doubt, describe the feature without naming specific types and link to the PR. A correct prose description is always better than a wrong code sample.

For scoring and feature selection, this is also a **quality bar**: if a change only looks interesting because it seems to add a new API, but you cannot identify that API in the public surface, score it down sharply. That usually means it is internal plumbing, a refactor, or an existing niche surface getting maintenance rather than a real release-note feature.

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
dnx dotnet-inspect -y -- member CompressionLevel --platform -k field
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

If `dotnet-inspect` can't find a type, it may be:

1. **Not yet published** — preview packages may not be on NuGet yet. Leave a `<!-- TODO: verify [TypeName] when preview packages are available -->` placeholder.
2. **Named differently** — search with a broader pattern (`find "*Zstd*"` instead of the exact name).
3. **Internal** — the type may not be public. Don't document internal types in release notes.

When in doubt, describe the feature without naming specific types and link to the PR. A correct prose description is always better than a wrong code sample.

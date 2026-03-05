# Libraries Team Context

## Product

- **Product name**: .NET Libraries
- **Component file**: `libraries.md`
- **Repository**: `dotnet/runtime`

## PR Discovery

Uses the default area-label-scoped approach from [collect-prs.md](collect-prs.md). Search for merged PRs using these area labels (run in parallel batches):

- `area-System.Text.Json`, `area-System.Net.Http`, `area-System.Collections`
- `area-System.IO`, `area-System.IO.Compression`, `area-System.Threading`
- `area-System.Numerics`, `area-System.Runtime`, `area-System.Memory`
- `area-System.Security`, `area-System.Diagnostics`, `area-System.Globalization`
- `area-System.Linq`, `area-System.Reflection`, `area-System.Reflection.Emit`
- `area-System.Formats.*`, `area-System.Net.*`, `area-System.Text.*`
- `area-Microsoft.Extensions.*`, `area-Extensions-*`

**Catch-all prefix**: `area-System` (to catch uncommon area labels)

## Release Branch Verification

Uses the default VMR verification from [verify-release-branch.md](verify-release-branch.md).

- **VMR path**: `src/runtime/`

## Optional steps

- **API diff review**: Yes — follow [api-diff-review.md](api-diff-review.md). The API diff path pattern is `release-notes/<version>/preview/<preview>/api-diff/Microsoft.NETCore.App/`. Cross-reference the API diff with candidate PRs after collection and use it to discover implementing PRs and `api-approved` issues.

## Categorization guidance

### Bug fix grouping

Group bug fixes by their `area-` label (e.g., `area-System.Net.Http` → "System.Net.Http", `area-System.Collections` → "System.Collections"). When a PR has no `area-` label, use the library name instead. When multiple fixes share the same area, list them as indented sub-bullets under a shared top-level bullet. Order areas alphabetically.

Example:

```markdown
- **System.Collections**
  - Fixed integer overflow in `ImmutableArray` range validation ([dotnet/runtime#124042](https://github.com/dotnet/runtime/pull/124042))
- **System.Net.Http**
  - Fixed authenticated proxy credential handling ([dotnet/runtime#123328](https://github.com/dotnet/runtime/pull/123328), reported by [@ptarjan](https://github.com/ptarjan))
  - Fixed edge-case non-ASCII host handling in HTTP logic ([dotnet/runtime#123934](https://github.com/dotnet/runtime/pull/123934))
- **System.Numerics**
  - Fixed `Vector2`/`Vector3` `EqualsAny` returning incorrect results due to hidden padding elements ([dotnet/runtime#123594](https://github.com/dotnet/runtime/pull/123594))
  - Fixed missing early returns in `TensorPrimitives.Round` causing double-rounding ([dotnet/runtime#124280](https://github.com/dotnet/runtime/pull/124280))
```

### General categorization

In addition to the common [categorization tiers](categorize-entries.md):

- PRs labeled `community-contribution` from contributors with valuable features or quality improvements deserve extra consideration for inclusion
- Changes to widely-used libraries (`System.Text.Json`, `System.Net.Http`, `System.Collections`, `System.IO`, `System.Threading`) affect more users than changes to narrower namespaces — when two entries are otherwise similar in impact, prefer the one in the more widely-used library

## Example release notes

Use these as reference for style and depth:

- `release-notes/11.0/preview/preview1/libraries.md`
- `release-notes/10.0/preview/preview1/libraries.md`
- `release-notes/9.0/preview/rc1/libraries.md`

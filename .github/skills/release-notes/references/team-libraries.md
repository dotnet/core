# Libraries Team Context

## Product

- **Product name**: .NET Libraries
- **Component file**: `libraries.md`
- **Repository**: `dotnet/runtime`

## Area labels

Search for merged PRs using these area labels (run in parallel batches):

- `area-System.Text.Json`, `area-System.Net.Http`, `area-System.Collections`
- `area-System.IO`, `area-System.IO.Compression`, `area-System.Threading`
- `area-System.Numerics`, `area-System.Runtime`, `area-System.Memory`
- `area-System.Security`, `area-System.Diagnostics`, `area-System.Globalization`
- `area-System.Linq`, `area-System.Reflection`, `area-System.Reflection.Emit`
- `area-System.Formats.*`, `area-System.Net.*`, `area-System.Text.*`
- `area-Microsoft.Extensions.*`, `area-Extensions-*`

**Catch-all prefix**: `area-System` (to catch uncommon area labels)

## Optional steps

- **API diff review**: Yes — follow [api-diff-review.md](api-diff-review.md). The API diff path pattern is `release-notes/<version>/preview/<preview>/api-diff/Microsoft.NETCore.App/`. Cross-reference the API diff with candidate PRs after collection and use it to discover implementing PRs and `api-approved` issues.
- **VMR path**: `src/runtime/` (for [release branch verification](verify-release-branch.md))

## Categorization guidance

In addition to the common [categorization tiers](categorize-entries.md):

- PRs labeled `community-contribution` from contributors with valuable features or quality improvements deserve extra consideration for inclusion
- Changes to widely-used libraries (`System.Text.Json`, `System.Net.Http`, `System.Collections`, `System.IO`, `System.Threading`) affect more users than changes to narrower namespaces — when two entries are otherwise similar in impact, prefer the one in the more widely-used library

## Example release notes

Use these as reference for style and depth:

- `release-notes/11.0/preview/preview1/libraries.md`
- `release-notes/10.0/preview/preview1/libraries.md`
- `release-notes/9.0/preview/rc1/libraries.md`

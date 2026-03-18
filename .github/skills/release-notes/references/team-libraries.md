# Libraries Team Context

Editorial and categorization overrides for .NET Libraries release notes.

## Product

- **Product name**: .NET Libraries
- **Component file**: `libraries.md`
- **Source repo**: `dotnet/runtime`
- **VMR path**: `src/runtime/src/libraries/`

## PR Search Labels

When searching `dotnet/runtime` for candidate PRs (during the [trace-to-source](trace-to-source.md) reverse search), use these area labels in parallel batches:

- `area-System.Text.Json`, `area-System.Net.Http`, `area-System.Collections`
- `area-System.IO`, `area-System.IO.Compression`, `area-System.Threading`
- `area-System.Numerics`, `area-System.Runtime`, `area-System.Memory`
- `area-System.Security`, `area-System.Diagnostics`, `area-System.Globalization`
- `area-System.Linq`, `area-System.Reflection`, `area-System.Reflection.Emit`
- `area-System.Formats.*`, `area-System.Net.*`, `area-System.Text.*`
- `area-Microsoft.Extensions.*`, `area-Extensions-*`

**Catch-all prefix**: `area-System` (to catch uncommon area labels)

## Optional Steps

- **API diff review**: Cross-reference the API diff at `release-notes/<version>/preview/<preview>/api-diff/Microsoft.NETCore.App/` with candidate PRs. Use API type/method names to discover implementing PRs and `api-approved` issues that may have been missed.

## Categorization

### Bug fix grouping

Group by `area-` label (e.g., `area-System.Net.Http` → "System.Net.Http"). Order alphabetically.

### General guidance

- PRs labeled `community-contribution` with valuable features deserve extra consideration
- Changes to widely-used libraries (`System.Text.Json`, `System.Net.Http`, `System.Collections`, `System.IO`, `System.Threading`) affect more users — prefer these when two entries are otherwise similar in impact

## Example Release Notes

Use these as reference for style and depth:

- `release-notes/11.0/preview/preview1/libraries.md`
- `release-notes/10.0/preview/preview1/libraries.md`

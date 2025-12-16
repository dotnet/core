# Breaking Changes Queries

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

## Navigation Flow (2 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► find version (e.g., "10.0")
            │
            └─► _links["release-manifest"]
                    │
                    ▼
                manifest.json
                    │
                    ├─► _links["compatibility"] ─► breaking changes
                    │
                    └─► _links["target-frameworks"] ─► TFMs
```

## Common Queries

### Breaking changes for .NET X (2 fetches)

1. Fetch `llms.json`
2. Find `_embedded.latest_patches[]` where `release == "X.0"`
3. Follow `_links["release-manifest"]` → manifest.json
4. Follow `_links["compatibility"]` → compatibility.json

### TFMs for .NET X (2 fetches)

Same path, but follow `_links["target-frameworks"]`

## compatibility.json Structure

```json
{
  "breaks": [
    {
      "id": "category-version-short-name",
      "title": "Human-readable title",
      "category": "core-libraries | sdk | aspnet-core | ...",
      "type": "behavioral | source-incompatible | binary-source-incompatible",
      "version_introduced": "10.0",
      "impact": "low | medium | high",
      "references": [
        {
          "type": "documentation",
          "url": "https://raw.githubusercontent.com/dotnet/docs/main/docs/core/compatibility/..."
        },
        {
          "type": "documentation-rendered",
          "url": "https://learn.microsoft.com/dotnet/core/compatibility/..."
        }
      ]
    }
  ]
}
```

## Breaking Change Types

| Type | Meaning |
|------|---------|
| `behavioral` | Runtime behavior changed, source compiles |
| `source-incompatible` | Source won't compile without changes |
| `binary-source-incompatible` | Binary and source compatibility broken |

## Impact Levels

| Impact | Description |
|--------|-------------|
| `low` | Unlikely to affect most apps |
| `medium` | May require code changes |
| `high` | Likely requires migration effort |

## Categories

Common categories in `compatibility.json`:

- `core-libraries` — BCL changes
- `sdk` — dotnet CLI, MSBuild, NuGet
- `aspnet-core` — ASP.NET Core
- `windows-forms` — WinForms
- `wpf` — WPF
- `cryptography` — Security/crypto APIs
- `extensions` — Microsoft.Extensions.*
- `networking` — HTTP, sockets
- `serialization` — JSON, XML serialization

## Documentation Content

The `documentation` links point to raw markdown with these sections:

- Previous behavior / New behavior
- Type of breaking change
- **Reason for change** — Why the change was made
- **Recommended action** — Migration steps with code examples
- Affected APIs

Fetch when you need rationale or detailed migration guidance beyond `required_action`.

## Tips

- Group by `category` for migration planning
- Filter by `impact == "high"` for critical review
- Use `references[]` where `type == "documentation"` for raw markdown (LLM-friendly)
- Use `type == "documentation-rendered"` for HTML view (human-friendly)

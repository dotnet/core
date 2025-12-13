# Breaking Changes Queries

## Navigation Flow (2 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► find version (e.g., "10.0")
            │
            └─► _links["release-major"]
                    │
                    ▼
                X.0/index.json
                    │
                    ├─► _links["compatibility-json"] ─► breaking changes
                    │
                    └─► _links["target-frameworks-json"] ─► TFMs
```

## Common Queries

### Breaking changes for .NET X (2 fetches)

1. Fetch `llms.json`
2. Find `_embedded.latest_patches[]` where `release == "X.0"`
3. Follow `_links["release-major"]` → version index
4. Follow `_links["compatibility-json"]` → compatibility.json

### TFMs for .NET X (2 fetches)

Same path, but follow `_links["target-frameworks-json"]`

## compatibility.json Structure

```json
{
  "breaking_changes": [
    {
      "id": "category-version-short-name",
      "title": "Human-readable title",
      "category": "core-libraries | sdk | aspnet-core | ...",
      "type": "behavioral | source-incompatible | binary-source-incompatible",
      "version_introduced": "10.0",
      "impact": "low | medium | high",
      "references": [
        {
          "type": "documentation-source",
          "url": "https://learn.microsoft.com/..."
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

## Tips

- Group by `category` for migration planning
- Filter by `impact == "high"` for critical review
- Follow `references[].url` for detailed migration guidance

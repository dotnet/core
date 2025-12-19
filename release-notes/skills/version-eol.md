---
name: version-eol
description: EOL versions, support lifecycle, version history, and release types
---

# Version and EOL Queries

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

## Stop Criteria

**For supported versions:** STOP at `llms.json`. All data is in `_embedded.latest_patches[]`.

**For EOL versions:** STOP at the version index (e.g., `6.0/index.json`). It has `eol_date` and links to last security patch.

## Key Distinction

- **Supported versions** → data embedded in `llms.json`
- **EOL versions** → must navigate via `releases-index`

## Supported Versions (1 fetch)

`llms.json` → `_embedded.latest_patches[]` contains all supported versions:

| Field | Description |
|-------|-------------|
| `version` | Current patch (e.g., "10.0.1") |
| `release` | Major version (e.g., "10.0") |
| `release_type` | `lts` or `sts` |
| `eol_date` | End of life date |
| `supported` | Always `true` for these |
| `support_phase` | `active` or `maintenance` |

## EOL Versions (3-5 fetches)

```
llms.json
    │
    └─► _links["releases-index"]
            │
            ▼
        index.json
            │
            └─► _embedded.releases[] ─► find EOL version (e.g., "6.0")
                    │
                    └─► _links["self"]
                            │
                            ▼
                        6.0/index.json ─► eol_date, latest patch
                            │
                            └─► _links["latest-security"]
                                    │
                                    ▼
                                6.0.35/index.json ─► last security CVEs
```

## Common Queries

### When does .NET X go EOL? (1 fetch if supported)

1. Fetch `llms.json`
2. Find `_embedded.latest_patches[]` where `release == "X.0"`
3. Read `eol_date`

### What versions are currently supported? (1 fetch)

1. Fetch `llms.json`
2. All entries in `_embedded.latest_patches[]` are supported

### When did .NET 6 go EOL? (3 fetches)

1. Fetch `llms.json`
2. Follow `_links["releases-index"]`
3. Find `_embedded.releases[]` where `version == "6.0"`
4. Follow `_links["self"]` → 6.0/index.json
5. Read `eol_date`

### Last security patch for EOL version (4-5 fetches)

Continue from above:
6. Follow `_links["latest-security"]` → patch index
7. Read `_embedded.disclosures[]` for CVEs fixed

## Release Types

| Type | Support Duration | Example |
|------|------------------|---------|
| LTS | 3 years | .NET 8, .NET 10 |
| STS | 18 months | .NET 9 |

## Support Phases

| Phase | Description |
|-------|-------------|
| `preview` | Pre-release, not for production |
| `active` | Full support, regular updates |
| `maintenance` | Security fixes only |
| `eol` | No longer supported |

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Navigating to `releases-index` for supported versions | Wastes fetches—`llms.json._embedded.latest_patches[]` has this data |
| Looking for EOL data in `llms.json` | Only supported versions are embedded—use `releases-index` for EOL |
| Fetching version index for just EOL date | `releases-index._embedded.releases[]` already has `eol_date` |

## Tips

- Even-numbered releases are LTS (8, 10, 12...)
- Odd-numbered releases are STS (9, 11, 13...)
- `releases-index` contains ALL versions including EOL
- `llms.json` only embeds currently supported versions

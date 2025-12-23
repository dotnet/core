# HAL Index Schema Documentation

This directory documents the HAL+JSON index schemas used in the .NET release notes graph. The graph provides hypermedia-driven navigation across .NET releases, versions, and security disclosures.

## Design Principles

- **HAL+JSON vocabulary**: All indexes follow the [HAL specification](https://stateless.group/hal_specification.html) with `_links` and `_embedded` properties
- **Immutability**: Most indexes are immutable after creation (no `next` links, only `prev`)
- **Shortcut links**: Cross-graph navigation using `{target}-shortcut` pattern for query ergonomics
- **Currency consistency**: Related data within a file is captured together to ensure consistency
- **Snake case for properties**: Schema fields use `snake_case_lower` for `jq` query ergonomics
- **Kebab case for relations**: Link relations use `kebab-case-lower` following brand/name conventions

## Index Types

### Version Indexes

Navigate .NET releases by version hierarchy.

| Index | Description | Example |
|-------|-------------|---------|
| [releases-index](releases-index.md) | Root index of all .NET major versions | `index.json` |
| [major-version-index](major-version-index.md) | All patches for a major version | `9.0/index.json` |
| [patch-detail-index](patch-detail-index.md) | Detailed patch release information | `9.0/9.0.10/index.json` |

### Timeline Indexes

Navigate .NET releases by time (year/month).

| Index | Description | Example |
|-------|-------------|---------|
| [timeline-index](timeline-index.md) | Root timeline of all years | `timeline/index.json` |
| [year-index](year-index.md) | All months with releases in a year | `timeline/2025/index.json` |
| [month-index](month-index.md) | All patches released in a month | `timeline/2025/10/index.json` |

### Special Indexes

| Index | Description | Example |
|-------|-------------|---------|
| [llms-index](llms-index.md) | AI-optimized entry point | `llms.json` |

## Link Relations

Link naming conventions are documented in [links.md](links.md):

- **Local links**: Navigate within a hierarchy (`prev`, `latest-security`)
- **Shortcut links**: Cross-hierarchy jumps using `{target}-shortcut` pattern

## Shared Types

Common types reused across multiple indexes are documented in [shared-types.md](shared-types.md):

- `HalLink` - Standard HAL link object
- `PatchEntry` - Embedded patch release summary
- `MajorVersionEntry` - Embedded major version summary
- `CveDisclosure` - Security vulnerability disclosure
- `SdkBandEntry` - SDK feature band information

## Navigation Patterns

### Forward Navigation

Start from a root index and follow links to more specific resources:

```
index.json → 9.0/index.json → 9.0/9.0.10/index.json
```

### Backward Navigation

Use `prev` and `prev-security` links to walk backwards through history:

```
9.0/9.0.10/index.json → (prev) → 9.0/9.0.9/index.json
```

### Shortcut Links

Cross-hierarchy jumps using `{target}-shortcut` pattern. See [links.md](links.md) for the full list and design rationale.

## Mutability

| Index Type | Mutability | Notes |
|------------|------------|-------|
| releases-index | Mutable | Updated when new major versions are added |
| major-version-index | Mutable | Updated monthly with new patches |
| patch-detail-index | Immutable | Frozen after release |
| timeline-index | Mutable | Updated when new years are added |
| year-index | Mutable | Updated monthly within the year |
| month-index | Immutable | Frozen after release |
| llms-index | Mutable | Updated with latest patch information |

## Preview Release Handling

Preview releases are filtered from major version indexes after GA to reduce size. RC (release candidate) releases are kept because they have go-live support. This behavior is documented in the [major-version-index](major-version-index.md) specification.

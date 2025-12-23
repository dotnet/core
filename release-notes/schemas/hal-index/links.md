# Link Relations

This document describes the link relation naming conventions used in the .NET release notes HAL graph.

## Naming Philosophy

Link relations are **fully qualified** to be self-documenting. Each relation name explicitly states what it points to, eliminating the need to infer meaning from context.

| Principle | Example |
|-----------|---------|
| Explicit target type | `latest-patch` not `latest` (from major) |
| Explicit scope | `prev-security-patch` not `prev-security` (from patch) |
| Cross-hierarchy marked | `month-shortcut` for hierarchy jumps |

## Sequential Links

Walk backward through a sequence:

| Relation | Context | Description |
|----------|---------|-------------|
| `prev-patch` | Patch | Previous patch in same major version |
| `prev-month` | Month | Previous month in timeline |
| `prev-year` | Year | Previous year in timeline |
| `prev-security-patch` | Patch | Previous patch with security fixes |
| `prev-security-month` | Month | Previous month with security fixes |

Navigation pattern: start from `latest-*` and walk backward via `prev-*` links.

## Currency Links

Point to the most recent or relevant item:

| Relation | Context | Description |
|----------|---------|-------------|
| `latest-major` | Root, Timeline, LLMs | Latest stable major version |
| `latest-lts-major` | Root, Timeline, LLMs | Latest LTS major version |
| `latest-patch` | Major | Latest patch in major version |
| `latest-security-patch` | Major, LLMs patches | Latest patch with security fixes |
| `latest-release` | Year | Latest major version released in year |
| `latest-sdk` | Major, Patch | SDK feature band index |
| `latest-year` | Timeline, LLMs | Most recent year |
| `latest-month` | Year | Most recent month |
| `latest-security-month` | Year, LLMs | Most recent month with CVEs |

## Hierarchy Links

Navigate up within a hierarchy:

| Relation | Context | Description |
|----------|---------|-------------|
| `root` | All indexes | Back to root releases index |
| `major` | Patch | Up to major version index |
| `timeline` | Timeline indexes | Back to timeline root |
| `year` | Month | Up to year index |

## Shortcut Navigation

Shortcuts are cross-hierarchy jumps using the `{target}-shortcut` pattern. They connect the version hierarchy (root → major → patch) with the timeline hierarchy (timeline → year → month).

| Relation | From | To | Description |
|----------|------|-----|-------------|
| `month-shortcut` | Patch, SDK band | Month | Jump to release month in timeline |
| `year-shortcut` | Patch | Year | Jump to release year in timeline |
| `major-shortcut` | Month entry | Major | Jump to major version index |
| `patch-shortcut` | SDK band | Patch | Jump to patch index |

### Why Shortcuts?

Without shortcuts, navigating from a patch to its release month requires:

```
patch → major (up) → root (up) → timeline (cross) → year (down) → month (down)
```

With `month-shortcut`:

```
patch → month (shortcut)
```

Shortcuts optimize common queries like "what else shipped this month?" or "show me the major version for this SDK".

### Hierarchy Boundaries

```
Version Hierarchy          Timeline Hierarchy
─────────────────          ──────────────────
     root ←───────────────────→ timeline
       │                            │
     major ←──────────────────→   year
       │          shortcuts         │
     patch ←──────────────────→  month
```

Any arrow crossing between hierarchies is a shortcut. Vertical arrows within a hierarchy are local navigation.

## Content Links

Some links point to non-HAL resources:

| Relation | Type | Description |
|----------|------|-------------|
| `manifest` | `application/hal+json` | Reference data (compatibility, TFMs) for current context |
| `major-manifest` | `application/hal+json` | Major version manifest (used from patch context in LLMs) |
| `cve-json` | `application/json` | CVE disclosure records |
| `downloads` | `application/hal+json` | Download links index |

These are local links (not shortcuts) because they're associated resources, not hierarchy jumps.

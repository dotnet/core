# LLMs Index

AI-optimized entry point providing quick access to latest releases and security information. Located at `llms.json` in the release-notes directory.

## Purpose

This index is designed for Large Language Model (LLM) consumption, optimizing for:
- **Token efficiency**: Essential information embedded to minimize fetch count
- **Quick security triage**: Latest security info for each supported release
- **Navigation hints**: Links to common next-hop destinations
- **Context loading**: `required_pre_read` for navigation instructions

## Example

```json
{
  "kind": "llms",
  "title": ".NET Release Index for AI",
  "ai_note": "ALWAYS read required_pre_read first. HAL graph—follow _links only, never construct URLs.",
  "human_note": "No support or compatibility is offered for this file. Don't use it for automated workflows. Use index.json instead.",
  "required_pre_read": "https://raw.githubusercontent.com/dotnet/core/release-index/release-notes/skills/dotnet-releases/SKILL.md",
  "latest": "10.0",
  "latest_lts": "10.0",
  "supported_releases": ["10.0", "9.0", "8.0"],
  "_links": {
    "self": { "href": "..." },
    "latest": { "href": "...", "title": "Latest release - .NET 10.0" },
    "latest-lts": { "href": "...", "title": "Latest LTS release - .NET 10.0" },
    "latest-security-month": { "href": "...", "title": "Latest security month - October 2025" },
    "latest-year": { "href": "...", "title": "Latest year - 2025" },
    "root": { "href": "...", "title": ".NET Release Index" },
    "timeline": { "href": "...", "title": ".NET Release Timeline Index" }
  },
  "_embedded": {
    "patches": [ ... ]
  }
}
```

## Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `kind` | string | Yes | Always `"llms"` |
| `title` | string | Yes | Human-readable title |
| `ai_note` | string | No | Instructions for AI consumers |
| `human_note` | string | No | Disclaimer for human readers |
| `required_pre_read` | string | No | URL to navigation instructions (SKILL.md) |
| `latest` | string | No | Latest stable major version |
| `latest_lts` | string | No | Latest LTS major version |
| `supported_releases` | string[] | No | Currently supported major versions |
| `_links` | object | Yes | HAL navigation links |
| `_embedded` | object | No | Embedded latest patch entries |

## Links

| Relation | Required | Description |
|----------|----------|-------------|
| `self` | Yes | Canonical URL of this index |
| `latest` | No | Link to latest major version index |
| `latest-lts` | No | Link to latest LTS major version index |
| `latest-security-month` | No | Link to most recent security month |
| `latest-year` | No | Link to current year timeline |
| `root` | No | Link to version-based root index |
| `timeline` | No | Link to timeline root index |

## Embedded: patches

Array of `LlmsPatchEntry` objects, one per supported release (matches `supported_releases`):

```json
{
  "version": "9.0.11",
  "release": "9.0",
  "release_type": "sts",
  "security": false,
  "support_phase": "active",
  "supported": true,
  "sdk_version": "9.0.308",
  "latest_security": "9.0.10",
  "latest_security_date": "2025-10-14",
  "_links": {
    "self": { "href": "..." },
    "latest-security": { "href": "..." },
    "major-shortcut": { "href": "..." },
    "latest-sdk": { "href": "..." },
    "manifest": { "href": "..." }
  }
}
```

### LlmsPatchEntry Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Latest patch version |
| `release` | string | Yes | Major version (e.g., "9.0") |
| `release_type` | enum | Yes | "lts" or "sts" (denormalized from major) |
| `security` | boolean | Yes | Whether this patch has security fixes |
| `support_phase` | enum | Yes | Current support phase |
| `supported` | boolean | Yes | Whether release is currently supported |
| `sdk_version` | string | Yes | SDK version in this patch |
| `latest_security` | string | Yes | Latest patch with security fixes |
| `latest_security_date` | date | Yes | Date of latest security patch (YYYY-MM-DD) |
| `_links` | object | Yes | Navigation links |

### Patch Entry Links

| Relation | Description |
|----------|-------------|
| `self` | Link to full patch index |
| `latest-security` | Link to latest security patch for this release |
| `major-shortcut` | Link to major version index |
| `latest-sdk` | Link to SDK feature band index |
| `manifest` | Link to reference data (compatibility, TFMs) |

## Mutability

**Mutable** - Updated with each patch release to reflect current state.

## Usage Pattern

1. **Load `required_pre_read`** (SKILL.md) for navigation context
2. **Check `supported_releases`** to identify active versions
3. **Scan `latest_patches`** for security status
4. **Follow links** to detailed indexes as needed

## Navigation Patterns

### Find releases needing security updates

```jq
._embedded.latest_patches | map(select(.security == false and .latest_security != null))
```

### Get latest LTS with security info

```jq
._embedded.latest_patches | map(select(.release == .latest_lts)) | .[0]
```

### Quick security triage

For each patch entry where `security: false`, the `latest_security` and `latest_security_date` fields indicate when the last security update was released.

## Design Notes

- **No `$schema`**: Intentionally omitted to reduce token overhead
- **`ai_note`**: Primary instruction - read SKILL.md first
- **`human_note`**: Discourages non-AI automation (use `index.json` instead)
- **Embedded entries**: Eliminate need to fetch multiple major version indexes
- **`latest_security_*`**: Quick hop to security context when current patch isn't security-related
- **No titles on embedded links**: Parent context provides meaning, saves tokens
- **`manifest` link**: Direct access to compatibility and target framework info

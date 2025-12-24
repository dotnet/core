---
name: version-eol
description: EOL versions, support lifecycle, version history, and release types
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/version-eol/workflows.json
---

# Version and EOL Queries

## First: Supported or EOL?

| Version status | Data source | Fetches |
| -------------- | ----------- | ------- |
| Supported (in `supported_releases`) | `llms.json._embedded.patches["X.0"]` | 0 (already have it) |
| EOL (not in `supported_releases`) | `root` → `_embedded.releases[]` | 1-2 |
| EOL date (any version) | major index (e.g., `8.0/index.json`) | 1-2 |

## Quick Answers

From `llms.json._embedded.patches["X.0"]` (supported versions):

- Is .NET X LTS or STS? → `release_type`
- Current patch version? → `version`
- In maintenance mode? → `support_phase`
- Last security patch? → `latest_security_patch`, `latest_security_patch_date`

## Stop Criteria

**Supported versions:** STOP at `llms.json`. Data is in `_embedded.patches["X.0"]`.

**EOL dates:** STOP at the major index (e.g., `8.0/index.json`).

## Workflows

```json
"supported-version-info": {
  "follow_path": ["kind:llms"],
  "select_embedded": ["patches"],
  "yields": "json"
}
```

```json
"eol-date": {
  "follow_path": ["kind:llms", "root", "{version}"],
  "destination_kind": "major",
  "select_property": ["eol_date"],
  "yields": "json"
}
```

```json
"version-support-extract": {
  "follow_path": ["kind:llms"],
  "select_embedded": ["patches['{version}']"],
  "yields": "json"
}
```

**Example:** Get .NET 8.0 support info:

```text
$._embedded.patches['8.0']
→ { "version": "8.0.22", "release_type": "lts", "support_phase": "active", ... }
```

All workflows: <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/version-eol/workflows.json>

## External Schema: patches

| Field | Description |
| ----- | ----------- |
| `version` | Current patch (e.g., "8.0.22") |
| `release_type` | `lts` or `sts` |
| `support_phase` | `active` or `maintenance` |
| `supported` | Always `true` for embedded versions |
| `sdk_version` | Current SDK version |
| `latest_security_patch` | Last security patch version |
| `latest_security_patch_date` | Date of last security patch |

**Release types:** LTS = 3 years (even: 8, 10, 12), STS = 18 months (odd: 9, 11, 13)

**Support phases:** `preview` → `active` → `maintenance` → `eol`

## Common Mistakes

| Mistake | Why It's Wrong |
| ------- | -------------- |
| Navigating to `root` for supported versions | Wastes fetches—`_embedded.patches` has this data |
| Looking for EOL data in `llms.json` | Only supported versions embedded—use `root` for EOL |
| Fetching version index for just EOL date | `root._embedded.releases[]` already has `eol_date` |

## Tips

- Even-numbered releases are LTS, odd-numbered are STS
- `root` contains ALL versions including EOL
- `llms.json` only embeds currently supported versions

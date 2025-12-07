# SDK Feature Bands Specification

## Overview

The `8.0/sdk/index.json` file provides focused metadata about SDK feature bands. It answers key questions without duplicating download information or maintaining extensive version history.

## Design Goals (Priority Order)

1. **Determine if a feature band is supported** → `support_phase`
2. **Download feature-band-specific artifacts** → Covered by downloads spec, linked via `_links.downloads`
3. **Learn the latest release for a given feature band** → `latest`

Historical releases per feature band are intentionally omitted. This data is voluminous and rarely needed; it can be derived from patch release files if required.

## File Location

```
8.0/sdk/
  index.json           # Feature band metadata (this spec)
```

## File Format

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/schemas/dotnet-sdk-version-index.json",
  "kind": "sdk-index",
  "version": "8.0",
  "title": ".NET SDK 8.0",
  "description": "SDK feature band metadata for .NET 8.0",
  "latest": "8.0.416",
  "latest_security": "8.0.415",
  "latest_feature_band": "8.0.4xx",
  "_links": {
    "self": {
      "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/sdk/index.json",
      "path": "/8.0/sdk/index.json",
      "title": ".NET SDK 8.0",
      "type": "application/hal+json"
    },
    "release-major": {
      "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/index.json",
      "path": "/8.0/index.json",
      "title": ".NET 8.0",
      "type": "application/hal+json"
    },
    "downloads": {
      "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/downloads/index.json",
      "path": "/8.0/downloads/index.json",
      "title": ".NET 8.0 Downloads",
      "type": "application/hal+json"
    }
  },
  "_embedded": {
    "feature_bands": [
      {
        "version": "8.0.4xx",
        "latest": "8.0.416",
        "support_phase": "active",
        "_links": {
          "downloads": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/downloads/sdk-8.0.4xx.json",
            "path": "/8.0/downloads/sdk-8.0.4xx.json",
            "title": ".NET SDK 8.0.4xx Downloads",
            "type": "application/json"
          },
          "release-patch": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/8.0.22/index.json",
            "path": "/8.0/8.0.22/index.json",
            "title": "8.0.22",
            "type": "application/hal+json"
          },
          "release-month": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/timeline/2025/11/index.json",
            "path": "/timeline/2025/11/index.json",
            "title": "2025-11",
            "type": "application/hal+json"
          }
        }
      },
      {
        "version": "8.0.3xx",
        "latest": "8.0.319",
        "support_phase": "active",
        "_links": {
          "downloads": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/downloads/sdk-8.0.3xx.json",
            "path": "/8.0/downloads/sdk-8.0.3xx.json",
            "title": ".NET SDK 8.0.3xx Downloads",
            "type": "application/json"
          },
          "release-patch": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/8.0.22/index.json",
            "path": "/8.0/8.0.22/index.json",
            "title": "8.0.22",
            "type": "application/hal+json"
          },
          "release-month": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/timeline/2025/11/index.json",
            "path": "/timeline/2025/11/index.json",
            "title": "2025-11",
            "type": "application/hal+json"
          }
        }
      },
      {
        "version": "8.0.2xx",
        "latest": "8.0.206",
        "support_phase": "eol",
        "_links": {
          "downloads": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/downloads/sdk-8.0.2xx.json",
            "path": "/8.0/downloads/sdk-8.0.2xx.json",
            "title": ".NET SDK 8.0.2xx Downloads",
            "type": "application/json"
          },
          "release-patch": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/8.0.6/index.json",
            "path": "/8.0/8.0.6/index.json",
            "title": "8.0.6",
            "type": "application/hal+json"
          },
          "release-month": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/timeline/2024/06/index.json",
            "path": "/timeline/2024/06/index.json",
            "title": "2024-06",
            "type": "application/hal+json"
          }
        }
      },
      {
        "version": "8.0.1xx",
        "latest": "8.0.122",
        "support_phase": "active",
        "_links": {
          "downloads": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/downloads/sdk-8.0.1xx.json",
            "path": "/8.0/downloads/sdk-8.0.1xx.json",
            "title": ".NET SDK 8.0.1xx Downloads",
            "type": "application/json"
          },
          "release-patch": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/8.0.22/index.json",
            "path": "/8.0/8.0.22/index.json",
            "title": "8.0.22",
            "type": "application/hal+json"
          },
          "release-month": {
            "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/timeline/2025/11/index.json",
            "path": "/timeline/2025/11/index.json",
            "title": "2025-11",
            "type": "application/hal+json"
          }
        }
      }
    ]
  },
  "_metadata": {
    "schema_version": "1.0",
    "generated_on": "2025-12-06T00:00:00+00:00",
    "generated_by": "VersionIndex"
  }
}
```

## Fields

### Root Level

| Field | Description |
|-------|-------------|
| `version` | Major version (e.g., "8.0") |
| `latest` | Latest SDK version across all feature bands |
| `latest_security` | Latest SDK version that includes a security fix |
| `latest_feature_band` | The feature band containing the latest SDK |

### Feature Band

| Field | Description |
|-------|-------------|
| `version` | Feature band identifier (e.g., "8.0.4xx") |
| `latest` | Latest SDK version in this feature band |
| `support_phase` | Support status: "active" or "eol" |

### Feature Band Links

| Relation | Description |
|----------|-------------|
| `downloads` | Evergreen download links for this feature band |
| `release-patch` | Patch release this SDK version is part of |
| `release-month` | Timeline month when this version was released |

## Migration

This replaces the current `8.0/sdk/index.json` which contains extensive version history in `_embedded.releases`. That data is removed in favor of the focused feature band metadata.

## Notes

- Feature bands are sorted by version in descending order (e.g., 4xx, 3xx, 2xx, 1xx) regardless of support phase
- The `release-patch` link shows which runtime version the SDK targets
- The `release-month` link provides temporal context and links to CVE information for that release

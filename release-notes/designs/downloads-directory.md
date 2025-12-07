# Downloads Directory Specification

## Overview

Each major version directory (e.g., `8.0/`, `9.0/`) will contain a `downloads/` subdirectory with evergreen download links for all .NET components. This separates download concerns from version/release information.

## Directory Structure

```
8.0/downloads/
  index.json           # Index linking to all component download files
  runtime.json         # .NET Runtime downloads
  aspnetcore.json      # ASP.NET Core Runtime downloads
  windowsdesktop.json  # Windows Desktop Runtime downloads (Windows RIDs only)
  sdk.json             # SDK downloads (latest feature band) - fast path
  sdk-8.0.1xx.json     # SDK 1xx feature band downloads
  sdk-8.0.2xx.json     # SDK 2xx feature band downloads (EOL)
  sdk-8.0.3xx.json     # SDK 3xx feature band downloads
  sdk-8.0.4xx.json     # SDK 4xx feature band downloads
```

The `sdk.json` file provides a fast path for the common case of "give me the latest SDK". It uses `aka.ms/dotnet/8.0/` URLs and is semantically equivalent to the current latest feature band file. Clients that need a specific feature band use the `sdk-8.0.Nxx.json` files instead.

## Schemas

Two schemas are used:

- `dotnet-downloads-index.json` - for the `index.json` file
- `dotnet-component-download.json` - for all component download files (runtime, aspnetcore, windowsdesktop, and SDK feature bands)

The `dotnet-component-download.json` schema includes an optional `feature_band` field used only by SDK files. The existing `dotnet-sdk-download.json` schema is deprecated and replaced by `dotnet-component-download.json`.

## File Format

### `index.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/schemas/dotnet-downloads-index.json",
  "kind": "downloads-index",
  "version": "8.0",
  "title": ".NET 8.0 Downloads",
  "description": "Evergreen download links for .NET 8.0 components",
  "_links": {
    "self": { "href": "...", "path": "/8.0/downloads/index.json" },
    "release-major": { "href": "...", "path": "/8.0/index.json" }
  },
  "_embedded": {
    "components": [
      {
        "name": "runtime",
        "title": ".NET Runtime",
        "_links": {
          "self": { "href": "...", "path": "/8.0/downloads/runtime.json" }
        }
      },
      {
        "name": "aspnetcore",
        "title": "ASP.NET Core Runtime",
        "_links": {
          "self": { "href": "...", "path": "/8.0/downloads/aspnetcore.json" }
        }
      },
      {
        "name": "windowsdesktop",
        "title": "Windows Desktop Runtime",
        "_links": {
          "self": { "href": "...", "path": "/8.0/downloads/windowsdesktop.json" }
        }
      },
      {
        "name": "sdk",
        "title": ".NET SDK",
        "_links": {
          "self": { "href": "...", "path": "/8.0/downloads/sdk.json" },
          "sdk-index": { "href": "...", "path": "/8.0/sdk/index.json" }
        }
      }
    ],
    "feature_bands": [
      {
        "version": "8.0.4xx",
        "title": ".NET SDK 8.0.4xx",
        "support_phase": "active",
        "_links": {
          "self": { "href": "...", "path": "/8.0/downloads/sdk-8.0.4xx.json" }
        }
      },
      {
        "version": "8.0.3xx",
        "title": ".NET SDK 8.0.3xx",
        "support_phase": "active",
        "_links": {
          "self": { "href": "...", "path": "/8.0/downloads/sdk-8.0.3xx.json" }
        }
      },
      {
        "version": "8.0.2xx",
        "title": ".NET SDK 8.0.2xx",
        "support_phase": "eol",
        "_links": {
          "self": { "href": "...", "path": "/8.0/downloads/sdk-8.0.2xx.json" }
        }
      },
      {
        "version": "8.0.1xx",
        "title": ".NET SDK 8.0.1xx",
        "support_phase": "active",
        "_links": {
          "self": { "href": "...", "path": "/8.0/downloads/sdk-8.0.1xx.json" }
        }
      }
    ]
  }
}
```

### Component download file (e.g., `runtime.json`)

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/schemas/dotnet-component-download.json",
  "kind": "component-download",
  "component": "runtime",
  "version": "8.0",
  "title": ".NET Runtime 8.0 Downloads",
  "description": "Evergreen download links for .NET Runtime 8.0",
  "_links": {
    "self": { "href": "...", "path": "/8.0/downloads/runtime.json" },
    "downloads-index": { "href": "...", "path": "/8.0/downloads/index.json" },
    "release-major": { "href": "...", "path": "/8.0/index.json" }
  },
  "_embedded": {
    "downloads": {
      "linux-arm": {
        "name": "dotnet-runtime-linux-arm.tar.gz",
        "rid": "linux-arm",
        "os": "linux",
        "arch": "arm",
        "hash_algorithm": "sha512",
        "_links": {
          "download": {
            "href": "https://aka.ms/dotnet/8.0/dotnet-runtime-linux-arm.tar.gz",
            "title": "Download dotnet-runtime-linux-arm.tar.gz"
          },
          "hash": {
            "href": "https://aka.ms/dotnet/8.0/dotnet-runtime-linux-arm.tar.gz.sha512",
            "title": "SHA512 hash file"
          }
        }
      },
      "linux-x64": { "..." : "..." },
      "win-x64": { "..." : "..." }
    }
  }
}
```

### SDK feature band download file (e.g., `sdk-8.0.4xx.json`)

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/schemas/dotnet-component-download.json",
  "kind": "component-download",
  "component": "sdk",
  "version": "8.0",
  "feature_band": "8.0.4xx",
  "title": ".NET SDK 8.0.4xx Downloads",
  "description": "Evergreen download links for .NET SDK 8.0.4xx feature band",
  "_links": {
    "self": { "href": "...", "path": "/8.0/downloads/sdk-8.0.4xx.json" },
    "downloads-index": { "href": "...", "path": "/8.0/downloads/index.json" },
    "sdk-index": { "href": "...", "path": "/8.0/sdk/index.json" },
    "release-major": { "href": "...", "path": "/8.0/index.json" }
  },
  "_embedded": {
    "downloads": {
      "linux-arm": {
        "name": "dotnet-sdk-linux-arm.tar.gz",
        "rid": "linux-arm",
        "os": "linux",
        "arch": "arm",
        "hash_algorithm": "sha512",
        "_links": {
          "download": {
            "href": "https://aka.ms/dotnet/8.0.4xx/dotnet-sdk-linux-arm.tar.gz",
            "title": "Download dotnet-sdk-linux-arm.tar.gz"
          },
          "hash": {
            "href": "https://aka.ms/dotnet/8.0.4xx/dotnet-sdk-linux-arm.tar.gz.sha512",
            "title": "SHA512 hash file"
          }
        }
      },
      "linux-x64": { "..." : "..." },
      "win-x64": { "..." : "..." }
    }
  }
}
```

Note the `feature_band` field. The URLs contain `8.0.4xx` in the path (e.g., `aka.ms/dotnet/8.0.4xx/...`) which redirects to the latest SDK in that specific feature band, rather than the `8.0` path used in `sdk.json`.

### SDK latest download file (`sdk.json`)

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/schemas/dotnet-component-download.json",
  "kind": "component-download",
  "component": "sdk",
  "version": "8.0",
  "title": ".NET SDK 8.0 Downloads",
  "description": "Evergreen download links for .NET SDK 8.0 (latest feature band)",
  "_links": {
    "self": { "href": "...", "path": "/8.0/downloads/sdk.json" },
    "downloads-index": { "href": "...", "path": "/8.0/downloads/index.json" },
    "sdk-index": { "href": "...", "path": "/8.0/sdk/index.json" },
    "release-major": { "href": "...", "path": "/8.0/index.json" }
  },
  "_embedded": {
    "downloads": {
      "linux-arm": {
        "name": "dotnet-sdk-linux-arm.tar.gz",
        "rid": "linux-arm",
        "os": "linux",
        "arch": "arm",
        "hash_algorithm": "sha512",
        "_links": {
          "download": {
            "href": "https://aka.ms/dotnet/8.0/dotnet-sdk-linux-arm.tar.gz",
            "title": "Download dotnet-sdk-linux-arm.tar.gz"
          },
          "hash": {
            "href": "https://aka.ms/dotnet/8.0/dotnet-sdk-linux-arm.tar.gz.sha512",
            "title": "SHA512 hash file"
          }
        }
      },
      "linux-x64": { "..." : "..." },
      "win-x64": { "..." : "..." }
    }
  }
}
```

Note: `sdk.json` has no `feature_band` field and uses `8.0` URLs. It provides a fast path for the most common case.

### Windows Desktop download file (`windowsdesktop.json`)

```json
{
  "$schema": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/schemas/dotnet-component-download.json",
  "kind": "component-download",
  "component": "windowsdesktop",
  "version": "8.0",
  "title": "Windows Desktop Runtime 8.0 Downloads",
  "description": "Evergreen download links for Windows Desktop Runtime 8.0",
  "_links": {
    "self": { "href": "...", "path": "/8.0/downloads/windowsdesktop.json" },
    "downloads-index": { "href": "...", "path": "/8.0/downloads/index.json" },
    "release-major": { "href": "...", "path": "/8.0/index.json" }
  },
  "_embedded": {
    "downloads": {
      "win-arm64": {
        "name": "windowsdesktop-runtime-win-arm64.exe",
        "rid": "win-arm64",
        "os": "win",
        "arch": "arm64",
        "hash_algorithm": "sha512",
        "_links": {
          "download": {
            "href": "https://aka.ms/dotnet/8.0/windowsdesktop-runtime-win-arm64.exe",
            "title": "Download windowsdesktop-runtime-win-arm64.exe"
          },
          "hash": {
            "href": "https://aka.ms/dotnet/8.0/windowsdesktop-runtime-win-arm64.exe.sha512",
            "title": "SHA512 hash file"
          }
        }
      },
      "win-x64": {
        "name": "windowsdesktop-runtime-win-x64.exe",
        "rid": "win-x64",
        "os": "win",
        "arch": "x64",
        "hash_algorithm": "sha512",
        "_links": {
          "download": {
            "href": "https://aka.ms/dotnet/8.0/windowsdesktop-runtime-win-x64.exe",
            "title": "Download windowsdesktop-runtime-win-x64.exe"
          },
          "hash": {
            "href": "https://aka.ms/dotnet/8.0/windowsdesktop-runtime-win-x64.exe.sha512",
            "title": "SHA512 hash file"
          }
        }
      },
      "win-x86": {
        "name": "windowsdesktop-runtime-win-x86.exe",
        "rid": "win-x86",
        "os": "win",
        "arch": "x86",
        "hash_algorithm": "sha512",
        "_links": {
          "download": {
            "href": "https://aka.ms/dotnet/8.0/windowsdesktop-runtime-win-x86.exe",
            "title": "Download windowsdesktop-runtime-win-x86.exe"
          },
          "hash": {
            "href": "https://aka.ms/dotnet/8.0/windowsdesktop-runtime-win-x86.exe.sha512",
            "title": "SHA512 hash file"
          }
        }
      }
    }
  }
}
```

Note: Windows Desktop Runtime only supports Windows, so this file contains only `win-*` RIDs. This file only exists for .NET versions that include the Windows Desktop component (.NET Core 3.0 and later).

## Major Version Index Integration

The `8.0/index.json` major version index should link to the downloads directory:

```json
{
  "_links": {
    "...": "...",
    "downloads": {
      "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/downloads/index.json",
      "path": "/8.0/downloads/index.json",
      "title": ".NET 8.0 Downloads",
      "type": "application/hal+json"
    },
    "sdk-index": {
      "href": "https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/8.0/sdk/index.json",
      "path": "/8.0/sdk/index.json",
      "title": ".NET SDK 8.0",
      "type": "application/hal+json"
    }
  }
}
```

## Migration

The existing `8.0/sdk/sdk-8.0.json` and feature band files move to `8.0/downloads/`. The `8.0/sdk/index.json` file is updated per the SDK Feature Bands spec:

- `_links.downloads` changes from `/8.0/sdk/sdk-8.0.json` to `/8.0/downloads/index.json`
- `feature_bands[]._links.self` changes to `feature_bands[]._links.downloads` pointing to `/8.0/downloads/sdk-8.0.Nxx.json`

## Notes

- All download URLs use evergreen `aka.ms` redirects
- Hash files are also evergreen URLs (`*.sha512`)
- `windowsdesktop.json` only contains Windows RIDs and only exists for versions with Windows Desktop support (.NET Core 3.0+)
- SDK feature band files follow the same schema with `component: "sdk"` and additional `feature_band` field
- EOL feature bands are included (downloads remain available for compatibility)
- Feature bands are sorted by version in descending order (e.g., 4xx, 3xx, 2xx, 1xx) regardless of support phase

## Link Relations

Standard link relation names used:

| Relation | Description |
|----------|-------------|
| `self` | Link to the current resource |
| `downloads` | Link to downloads (from major index or SDK index) |
| `downloads-index` | Back-link to the downloads index (from component files) |
| `sdk-index` | Link to SDK feature band index |
| `release-major` | Link to major version index |

## Runtime Component Versioning

Runtime, ASP.NET Core, and Windows Desktop don't have feature bands. Their evergreen links (`aka.ms/dotnet/8.0/`) always point to the latest patch version. Users needing specific patch versions should use the `release.json` files in patch directories (e.g., `8.0/8.0.22/release.json`).

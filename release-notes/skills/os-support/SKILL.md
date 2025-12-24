---
name: os-support
description: OS packages, distro support, glibc/musl requirements
workflows: https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/os-support/workflows.json
---

# OS Support Queries

## First: Which File?

| Query | File | Path from manifest |
| ----- | ---- | ------------------ |
| Package dependencies | `os-packages.json` | `os-packages-json` |
| Distro support | `supported-os.json` | `supported-os-json` |
| glibc/musl version | `supported-os.json` | `supported-os-json` |

**Pick ONE file** based on your query—don't fetch both.

## Quick Answers

From `supported-os.json`:

- Is Ubuntu 24.04 supported? → `distributions[].releases[]`
- Minimum glibc version? → `libc[?(@.name == 'glibc')]`

From `os-packages.json`:

- What packages for Ubuntu? → `distributions[?(@.name == 'ubuntu')].releases[].packages[]`

## Stop Criteria

**STOP when you have the JSON file.** Parse it—don't fetch anything else.

## Workflows

```json
"os-packages": {
  "follow_path": ["kind:llms", "patches.{version}", "major-manifest", "os-packages-json"],
  "destination_kind": "os-packages",
  "yields": "json"
}
```

```json
"supported-distros": {
  "follow_path": ["kind:llms", "patches.{version}", "major-manifest", "supported-os-json"],
  "destination_kind": "supported-os",
  "yields": "json"
}
```

```json
"distro-packages": {
  "follow_path": ["kind:os-packages"],
  "filter": "$.distributions[?(@.name == '{distro}')].releases[?(@.release == '{release}')].packages",
  "yields": "json"
}
```

**Example:** Get Ubuntu 24.04 packages:

```text
filter: $.distributions[?(@.name == 'ubuntu')].releases[?(@.release == '24.04')].packages
→ ["ca-certificates", "libc6", "libgcc-s1", ...]
```

All workflows: <https://raw.githubusercontent.com/dotnet/core/refs/heads/release-index/release-notes/skills/os-support/workflows.json>

## External Schema: supported-os.json

```json
{
  "distributions": [{
    "name": "ubuntu",
    "releases": [{ "release": "24.04", "name": "Noble Numbat", "architectures": ["x64", "arm64"] }]
  }],
  "libc": [
    { "name": "glibc", "version": "2.27", "architectures": ["x64", "arm64"] },
    { "name": "musl", "version": "1.2.3", "architectures": ["x64", "arm64", "arm32"] }
  ]
}
```

## External Schema: os-packages.json

```json
{
  "distributions": [{
    "name": "ubuntu",
    "package_manager": "apt",
    "releases": [{
      "release": "24.04",
      "packages": ["ca-certificates", "libc6", "libgcc-s1", "libicu74", "libssl3t64", "libstdc++6", "tzdata"]
    }]
  }]
}
```

**Distros:** `ubuntu`, `debian`, `fedora`, `rhel`, `alpine`, `opensuse`

## Common Mistakes

| Mistake | Why It's Wrong |
| ------- | -------------- |
| Looking for `.md` versions | Don't exist—only `.json` |
| Fetching both JSON files | Pick ONE based on query |
| Constructing URLs | Follow `_links` from manifest |

## Tips

- Package names vary by distro version (e.g., `libicu74` vs `libicu72`)
- Alpine uses musl, not glibc
- Newer .NET may drop older distro support—check specific version

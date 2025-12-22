---
name: os-support
description: OS packages, distro support, glibc/musl requirements
---

# OS Packages and Support Queries

## Stop Criteria

**STOP when you have the JSON file.** Parse it—don't fetch anything else.

| Query | File | Path |
|-------|------|------|
| Package deps | `os-packages.json` | `distributions[].releases[].packages[]` |
| Distro support | `supported-os.json` | `distributions[].releases[]` |
| glibc/musl | `supported-os.json` | `libc[]` |

**Pick ONE file** based on your query—don't fetch both.

## Quick Answers (from JSON files)

From `supported-os.json`:
- Is Ubuntu 24.04 supported? → `distributions[].releases[]`
- Minimum glibc version? → `libc[]` where `name == "glibc"`

From `os-packages.json`:
- What packages for Ubuntu? → `distributions[].releases[].packages[]`

## Navigation Flow (2 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► _links["manifest"]
                    │
                    ▼
                manifest.json
                    │
                    ├─► _links["supported-os"] ─► distros, glibc
                    │
                    └─► _links["os-packages"] ─► apt/dnf packages
```

## Common Queries

### Distro support (2 fetches)
`llms.json` → `manifest` → `supported-os` → check `distributions[]`

### Package list (2 fetches)
`llms.json` → `manifest` → `os-packages` → read `distributions[].releases[].packages[]`

### Minimum glibc (2 fetches)
`llms.json` → `manifest` → `supported-os` → filter `libc[]` by `name == "glibc"`

## supported-os.json Structure

```json
{
  "distributions": [
    {
      "name": "ubuntu",
      "releases": [
        {
          "release": "24.04",
          "name": "Noble Numbat",
          "architectures": ["x64", "arm64"]
        }
      ]
    }
  ],
  "libc": [
    {
      "name": "glibc",
      "version": "2.27",
      "architectures": ["x64", "arm64"],
      "source": "ubuntu-18.04"
    },
    {
      "name": "musl",
      "version": "1.2.3",
      "architectures": ["x64", "arm64", "arm32"]
    }
  ]
}
```

## os-packages.json Structure

```json
{
  "distributions": [
    {
      "name": "ubuntu",
      "package_manager": "apt",
      "releases": [
        {
          "release": "24.04",
          "packages": [
            "ca-certificates",
            "libc6",
            "libgcc-s1",
            "libgssapi-krb5-2",
            "libicu74",
            "libssl3t64",
            "libstdc++6",
            "tzdata"
          ]
        }
      ]
    }
  ]
}
```

## Supported Distros

| Distro | Package Manager |
|--------|-----------------|
| `ubuntu` | apt |
| `debian` | apt |
| `fedora` | dnf |
| `rhel` | dnf |
| `alpine` | apk |
| `opensuse` | zypper |

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Looking for `.md` versions | Don't exist—only `.json` |
| Fetching both JSON files | Pick ONE based on query |
| Re-fetching after success | Parse the JSON you have |
| Constructing URLs | Follow `_links` from manifest |

## Tips

- Package names vary by distro version (e.g., `libicu74` vs `libicu72`)
- Alpine uses musl, not glibc
- Newer .NET may drop older distro support—check specific version

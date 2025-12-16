# OS Packages and Support Queries

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

## Stop Criteria

**STOP immediately when you have the JSON file.** The answer is in that file—do not fetch anything else.

| Query Type | Fetch This | Then STOP |
|------------|------------|-----------|
| Package dependencies | `os-packages.json` | Filter `distributions[].releases[].packages[]` |
| Distro support | `supported-os.json` | Check `distributions[].releases[]` |
| glibc/musl version | `supported-os.json` | Read `libc[]` array |

**Do NOT:**
- Look for markdown versions (`.md`)—they don't exist
- Fetch both JSON files—pick ONE based on your query
- Re-fetch the same file—if you have it, parse it

## Navigation Flow (2 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► find version (e.g., "10.0")
            │
            └─► _links["release-manifest"]
                    │
                    ▼
                manifest.json
                    │
                    ├─► _links["supported-os-json"] ─► distros, glibc
                    │
                    └─► _links["os-packages-json"] ─► apt/dnf packages
```

## Common Queries

### Is my distro supported? (2 fetches)

1. Fetch `llms.json`
2. Find `_embedded.latest_patches[]` where `release == "X.0"`
3. Follow `_links["release-manifest"]` → manifest.json
4. Follow `_links["supported-os-json"]` → supported-os.json
5. Check `distributions[]` for your distro

### OS packages for Ubuntu/Debian (2 fetches)

Same path, but follow `_links["os-packages-json"]`:

1. Filter `distributions[]` where `name == "ubuntu"`
2. Find `releases[]` where `release == "24.04"`
3. Read `packages[]` for required apt packages

### Minimum glibc version (2 fetches)

1. Follow path to `supported-os.json`
2. Read `libc[]` array
3. Filter by `name == "glibc"` and `architectures` contains your arch

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

Common distributions in `supported-os.json`:

| Distro | Package Manager |
|--------|-----------------|
| `ubuntu` | apt |
| `debian` | apt |
| `fedora` | dnf |
| `rhel` | dnf |
| `alpine` | apk |
| `opensuse` | zypper |

## Tips

- Package names vary by distro version (e.g., `libicu74` vs `libicu72`)
- Alpine uses musl libc, not glibc
- `architectures` field indicates supported CPU architectures
- Skip `-rendered` links unless you need human-readable markdown

## Key Insight: OS Support Varies by .NET Version

**Newer .NET versions may drop support for older distro releases.** For example, .NET 10 supports fewer Alpine versions than .NET 9. Always check the specific version's `supported-os.json` if exact compatibility matters.

**Package requirements are typically identical** across .NET versions for a given distro/release. But distro *support* is not guaranteed to be the same.

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Re-fetching `os-packages.json` | If you got JSON back, parse it—the data is there |
| Thinking `os-packages.json` "failed" | If fetch succeeded, the answer is in `distributions[].releases[].packages[]` |
| Looking for `.md` versions | Don't exist—JSON files are complete and authoritative |
| Fetching both `supported-os.json` AND `os-packages.json` | Pick ONE based on your query |
| Searching for package info in `supported-os.json` | Wrong file—use `os-packages.json` for package lists |
| Fetching manifests for 8.0, 9.0, AND 10.0 for recent distros | For recent distros (Ubuntu 24.04), one check is usually enough |
| Constructing URLs | URL fabrication—always follow `_links` from the graph |

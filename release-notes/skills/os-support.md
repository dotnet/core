# OS Packages and Support Queries

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

## Stop Criteria

Know when you're done:

| Query Type | Stop When | File Contains |
|------------|-----------|---------------|
| Package dependencies | You have `os-packages.json` | Complete `packages[]` list for each distro/release |
| Distro support | You have `supported-os.json` | All supported `distributions[]` and `libc[]` requirements |
| glibc/musl version | You have `supported-os.json` | `libc[]` array with versions per architecture |

**Do NOT** look for markdown versions (`.md`) of these JSON files—they don't exist. The JSON files are complete and authoritative.

## Navigation Flow (3 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► find version (e.g., "10.0")
            │
            └─► _links["release-major"]
                    │
                    ▼
                X.0/index.json
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

### Is my distro supported? (3 fetches)

1. Fetch `llms.json`
2. Find `_embedded.latest_patches[]` where `release == "X.0"`
3. Follow `_links["release-major"]` → version index
4. Follow `_links["release-manifest"]` → manifest.json
5. Follow `_links["supported-os-json"]` → supported-os.json
6. Check `distributions[]` for your distro

### OS packages for Ubuntu/Debian (3 fetches)

Same path, but follow `_links["os-packages-json"]`:

1. Filter `distributions[]` where `name == "ubuntu"`
2. Find `releases[]` where `release == "24.04"`
3. Read `packages[]` for required apt packages

### Minimum glibc version (3 fetches)

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

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Looking for `os-packages.md` | Doesn't exist—`os-packages.json` has everything |
| Looking for `README.md` | Not part of the graph—follow `_links` only |
| Fetching both `supported-os.json` AND `os-packages.json` | Pick one based on your query (distro support vs packages) |
| Searching for package info in `supported-os.json` | Wrong file—use `os-packages.json` for package lists |

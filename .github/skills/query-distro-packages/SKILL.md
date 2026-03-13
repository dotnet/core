---
name: query-distro-packages
description: >
  Query and document which .NET packages are available in each Linux
  distribution's native archive, backports, and community feeds for a given
  .NET version. Uses the dotnet-release tool to query pkgs.org and
  supplemental feeds. USE FOR: auditing .NET package availability across
  distros, generating distro-packages.json, identifying gaps in package
  coverage. REQUIRES: PKGS_ORG_TOKEN environment variable (Gold+
  subscription).
---

# Query Distro Packages

Query and document which .NET packages (SDK, runtime, ASP.NET Core runtime) are available in each Linux distribution for a given .NET version. Generates `distro-packages.json` files that map package availability across multiple feeds.

This is different from `os-packages.json` (which lists *dependencies* .NET requires) — `distro-packages.json` lists *where to get .NET itself*.

## When to use

- A new .NET version is released and you need to document which distros carry it
- A distro ships or drops a .NET version in their archive
- Periodic audit to keep the availability data current
- You want to understand where users can get .NET packages for a specific distro+version combination

## Background

.NET packages come from multiple sources per distribution:

- **Built-in feed** — the distro's own archive (e.g. `apt install dotnet-sdk-9.0` on Ubuntu)
- **Backports feed** — newer versions backported to LTS distros (Ubuntu-specific via Launchpad PPA)
- **Community feed** — community-maintained packages (Alpine `community` repo, NixOS, Homebrew)
- **Microsoft feed** — packages.microsoft.com (being phased out for newer Ubuntu/Fedora)

Package naming varies by distro:

- Debian/Ubuntu/Fedora: `dotnet-sdk-9.0`, `dotnet-runtime-9.0`, `aspnetcore-runtime-9.0`
- Alpine: `dotnet9-sdk`, `dotnet9-runtime`
- Arch: `dotnet-sdk`, `dotnet-runtime` (unversioned)
- Wolfi: `dotnet-9-sdk`, `dotnet-9-runtime`

## Prerequisites

The `dotnet-release` tool must be installed. Packages are published to [GitHub Packages](https://github.com/richlander/dotnet-release/packages).

```bash
# GitHub Packages requires authentication — use a GitHub token (PAT or GITHUB_TOKEN)
dotnet tool install -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json \
  --version "0.*"

# Verify
dotnet-release --help
```

> **Note:** GitHub Packages requires authentication even for public repositories. If you get a 401 error, configure credentials for the source:
>
> ```bash
> dotnet nuget add source https://nuget.pkg.github.com/richlander/index.json \
>   --name github-richlander \
>   --username USERNAME \
>   --password "$GITHUB_TOKEN" \
>   --store-password-in-clear-text
> ```

A **pkgs.org Gold+ subscription** is required. Set the `PKGS_ORG_TOKEN` environment variable:

```bash
export PKGS_ORG_TOKEN="your-token-here"
```

## Inputs

The user provides:

- **.NET version** — which version to query (e.g. "9.0", "10.0")
- Optionally, specific distros to focus on

## Process

### 1. Determine scope

Read `release-notes/<version>/supported-os.json` to understand which Linux distributions are supported for this .NET version.

### 2. Query package feeds

Run the query command:

```bash
dotnet-release query distro-packages --dotnet-version <version>
```

To write output to a file:

```bash
dotnet-release query distro-packages --dotnet-version <version> --output release-notes/<version>/distro-packages.json
```

The tool queries:

1. **pkgs.org** — searches for .NET packages across all known distributions
2. **Launchpad** — Ubuntu backports PPA
3. **Homebrew** — macOS formula API
4. **NixOS** — Elasticsearch package index

Progress and diagnostics are logged to stderr; the JSON result goes to stdout or the output file.

### 3. Review results

Examine the generated JSON. Key things to look for:

- **Coverage gaps** — supported distros with no packages available
- **Version lag** — distro packages behind the latest .NET patch release
- **Feed availability** — which distros have built-in vs. third-party feeds only
- **New arrivals** — distros that recently added .NET packages

Present a summary to the user showing availability per distro.

### 4. Cross-reference with supported-os.json

Compare results against `release-notes/<version>/supported-os.json`:

- Every supported distro should ideally have packages available somewhere
- Distros with packages but not in supported-os may be candidates for adding
- Flag any discrepancies

### 5. Validate and commit

1. Validate the generated JSON parses correctly:

   ```bash
   python3 -m json.tool release-notes/<version>/distro-packages.json > /dev/null
   ```

2. Show the user a summary of findings
3. On confirmation, commit:

   ```bash
   git add release-notes/<version>/distro-packages.json
   git commit -m "Add distro-packages.json for .NET <version>"
   ```

## Output schema

The generated `distro-packages.json` follows this structure:

```json
{
  "channel-version": "9.0",
  "last-verified": "2026-03-13",
  "components": [
    { "id": "sdk", "name": ".NET SDK" },
    { "id": "runtime", "name": ".NET Runtime" },
    { "id": "aspnetcore-runtime", "name": "ASP.NET Core Runtime" }
  ],
  "distributions": [
    {
      "name": "Ubuntu",
      "releases": [
        {
          "name": "Ubuntu 24.04 LTS",
          "release": "24.04",
          "feeds": {
            "builtin": [
              {
                "component-id": "sdk",
                "package-name": "dotnet-sdk-9.0",
                "version": "9.0.1-1"
              }
            ],
            "backports": [...]
          }
        }
      ]
    }
  ]
}
```

## Key facts

- **Requires `PKGS_ORG_TOKEN`** — a pkgs.org Gold+ subscription API token
- Microsoft is phasing out packages.microsoft.com for Ubuntu 24.04+ and newer Fedora — those distros ship .NET in their own archives
- Ubuntu 22.04 is the last Ubuntu version with Microsoft feed packages
- Alpine packages are in the `community` repo, not `main`, and use `dotnet{major}-{component}` naming
- Package versions in distro feeds may lag behind the latest .NET patch release
- The tool queries 16 distributions: Ubuntu, Alpine, Fedora, RHEL, CentOS Stream, AlmaLinux, Rocky Linux, Oracle Linux, Amazon Linux, OpenMandriva, ALT Linux, Arch Linux, Wolfi, FreeBSD, Homebrew, NixOS
- Rate limiting is built in (300ms between pkgs.org requests)
- This skill generates data about *where to get .NET*; `update-os-packages` manages *what .NET needs to run*
- Active .NET versions: 8.0, 9.0, 10.0

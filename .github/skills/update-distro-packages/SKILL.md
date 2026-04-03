---
name: update-distro-packages
description: >
  Create and update per-distro package files in release-notes/{version}/distros/
  that document .NET runtime dependencies and package availability for each
  Linux distribution. USE FOR: setting up distros/ for a new .NET version,
  updating dependency package names when distro versions change, auditing
  package data. DO NOT USE FOR: supported-os.json changes (use
  update-supported-os skill), os-packages.json (legacy format).
---

# Update Distro Packages

Create and maintain per-distro JSON files in `release-notes/{version}/distros/`. Each file declares the native packages .NET depends on for a specific distribution, scoped to a single .NET version.

## Directory structure

```
release-notes/{version}/distros/
├── dependencies.json    # distro-agnostic dependency list (what .NET needs)
├── index.json           # lists all per-distro file names
├── alpine.json          # per-distro: dependencies with distro-specific names
├── ubuntu.json
├── fedora.json
└── ...
```

## When to use

- A new .NET version needs its `distros/` directory created for the first time
- A distro release is added or removed from the support matrix
- A dependency package name changes (e.g. `libicu74` → `libicu76` on a new Ubuntu)
- Periodic audit to keep dependency data current

## Prerequisites

The `dotnet-release` tool must be installed for markdown generation and package availability queries.

```bash
# Check if already installed
dotnet-release --version
```

If not installed:

```bash
dotnet tool install -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json
```

If already installed, update to latest:

```bash
dotnet tool update -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json
```

## Inputs

The user provides:

- **.NET version** — which version to work on (e.g. "11.0")
- **Task** — what to do: create new distros/ directory, add a distro release, update package names, populate dotnet packages, etc.

Ask the user: **Do you want to update dotnet packages (which .NET packages are available in each distro)?** If so, ask them to provide or set `PKGS_ORG_TOKEN`. This requires a [pkgs.org Gold+ subscription](https://pkgs.org/about/).

## File schemas

### dependencies.json

Distro-agnostic list of packages .NET requires. Updated once per major release — rarely changes.

```json
{
  "channel_version": "11.0",
  "packages": [
    {
      "id": "libc",
      "name": "C Library",
      "required_scenarios": ["all"],
      "references": ["https://..."]
    },
    {
      "id": "openssl",
      "name": "OpenSSL",
      "required_scenarios": ["https", "cryptography"],
      "min_version": "1.1.1",
      "references": ["https://..."]
    }
  ]
}
```

Omit `min_version` and `references` when null/empty.

### index.json

```json
{
  "channel_version": "11.0",
  "distros": [
    "alpine.json",
    "azure_linux.json",
    "ubuntu.json"
  ]
}
```

Alphabetically sorted list of per-distro file names.

### Per-distro files (e.g. ubuntu.json)

Scoped to the .NET version of the parent directory. No `dotnet_versions` field — the version is the directory.

```json
{
  "name": "Ubuntu",
  "install_command": "apt-get install -y {packages}",
  "releases": [
    {
      "name": "Ubuntu 24.04 (Noble Numbat)",
      "release": "24.04",
      "dependencies": [
        { "id": "ca-certificates", "name": "ca-certificates" },
        { "id": "libc", "name": "libc6" },
        { "id": "libicu", "name": "libicu74" },
        { "id": "openssl", "name": "libssl3t64" }
      ]
    }
  ]
}
```

Optional fields on each release (populated by package availability queries):

```json
{
  "dotnet_packages": [
    { "component": "sdk", "name": "dotnet-sdk-11.0" },
    { "component": "runtime", "name": "dotnet-runtime-11.0" }
  ],
  "dotnet_packages_other": {
    "backports": {
      "install_command": "sudo add-apt-repository ppa:dotnet/backports && sudo apt-get update",
      "packages": [
        { "component": "sdk", "name": "dotnet-sdk-11.0" }
      ]
    }
  }
}
```

The `install_command` in `dotnet_packages_other` is the command to **register the feed** — it must be run before packages can be installed with the distro's normal install command. This field is required for every alternative feed entry. See [Known alternative feed commands](#known-alternative-feed-commands) for values.

## Process

### Creating distros/ for a new .NET version

#### 1. Identify source data

Use `os-packages.json` from the same version (if it exists) or the previous .NET version as the source for dependency data:

```bash
cat release-notes/{version}/os-packages.json
# or from a previous version:
cat release-notes/{prev-version}/os-packages.json
```

Also reference `release-notes/{version}/supported-os.json` for the list of supported Linux distributions and versions.

#### 2. Create dependencies.json

Extract the `packages` array from `os-packages.json`. Convert keys to snake_case:

- `required-scenarios` → `required_scenarios`
- `min-version` → `min_version`

This file changes very rarely — it lists what .NET needs, not what distros call things.

#### 3. Create per-distro files

For each distribution in `os-packages.json`:

- **File name**: lowercase distro name, spaces → `_` (e.g. `azure_linux.json`, `centos_stream.json`)
- **`install_command`**: From the distro's `install-commands` — use the last command, format as `{command-root} {command-parts}`, normalize `{packageName}` → `{packages}`
- **`releases`**: One entry per distro release, with `dependencies` sorted alphabetically by `id`
- **Do NOT include** `dotnet_packages` or `dotnet_packages_other` — those are populated separately

The scope of distros/ is broader than `supported-os.json`. Include pre-release distro versions and permanent rolling channels where the package information is helpful:

- **Alpine edge** — always include; it tracks the rolling release
- **Debian sid (Unstable)** — always include
- **Pre-release distro versions** — e.g. Fedora beta, Ubuntu interim release before GA

These are informational — their presence does not imply official .NET support.

#### 4. Create index.json

List all per-distro file names alphabetically.

#### 5. Validate

```bash
# Verify all JSON parses
for f in release-notes/{version}/distros/*.json; do
  python3 -c "import json; json.load(open('$f'))" && echo "OK: $f"
done
```

Confirm every Linux distro in `supported-os.json` has a corresponding file.

#### 6. Generate markdown

Regenerate `dotnet-dependencies.md` from the JSON files:

```bash
dotnet-release generate dotnet-dependencies {version} release-notes
```

This produces `release-notes/{version}/dotnet-dependencies.md` with copy-pasteable install commands for each distro and release. Never hand-edit this file — it is generated from the JSON.

### Updating existing distros/ files

#### Adding a new distro release

1. Check `supported-os.json` for the new release
2. In the distro's JSON file, copy the most recent release entry
3. Update `name`, `release`, and any changed package names (e.g. `libicu74` → `libicu76`)
4. Insert in version order (newest first)

#### Removing a distro release

Delete the release object from the `releases` array. If the entire distro is dropped, delete the file and remove it from `index.json`.

#### Fixing package names

Update the `name` field in the relevant dependency entry. Package names change between distro releases due to shared library versioning (e.g. `libicu70` on Ubuntu 22.04 → `libicu74` on 24.04).

### Populating dotnet packages

This populates `dotnet_packages` and `dotnet_packages_other` in each per-distro file — recording which .NET packages (SDK, runtime, ASP.NET Core) are available in each distro's package feeds.

Requires `PKGS_ORG_TOKEN` to be set.

#### 1. Query package feeds

```bash
export PKGS_ORG_TOKEN=<token>
dotnet-release query distro-packages --dotnet-version {version} --output /tmp/distro-packages.json
```

This queries pkgs.org and supplemental feeds (Ubuntu backports via Launchpad, Homebrew, NixOS) and writes a JSON file with package availability per distro.

#### 2. Read query results

The output file has this structure:

```json
{
  "channel_version": "10.0",
  "last_verified": "2026-03-25",
  "distributions": [
    {
      "name": "Ubuntu",
      "releases": [
        {
          "name": "Ubuntu 24.04",
          "release": "24.04",
          "feeds": {
            "builtin": [
              { "component_id": "sdk", "package_name": "dotnet-sdk-10.0" },
              { "component_id": "runtime", "package_name": "dotnet-runtime-10.0" },
              { "component_id": "aspnetcore-runtime", "package_name": "aspnetcore-runtime-10.0" }
            ],
            "backports": [
              { "component_id": "sdk", "package_name": "dotnet-sdk-10.0" }
            ]
          }
        }
      ]
    }
  ]
}
```

#### 3. Map into per-distro files

For each distro+release in the query results, match it to the corresponding per-distro file and update:

- **`feeds["builtin"]`** → **`dotnet_packages`** (flat list)
- **Any other feed** (e.g. `feeds["backports"]`) → **`dotnet_packages_other["backports"]`**

Field mapping from query → per-distro file:

| Query field | Per-distro field |
|-------------|-----------------|
| `component_id` | `component` |
| `package_name` | `name` |

Every `dotnet_packages_other` entry **must** include an `install_command` — the command to register that feed before packages can be installed. See [Known alternative feed commands](#known-alternative-feed-commands) for the values to use.

Example — if the query returns this for Ubuntu 24.04:

```json
"feeds": {
  "builtin": [
    { "component_id": "sdk", "package_name": "dotnet-sdk-10.0" }
  ],
  "backports": [
    { "component_id": "sdk", "package_name": "dotnet-sdk-10.0" }
  ]
}
```

Then `ubuntu.json` release 24.04 becomes:

```json
{
  "name": "Ubuntu 24.04 (Noble Numbat)",
  "release": "24.04",
  "dependencies": [ ... ],
  "dotnet_packages": [
    { "component": "sdk", "name": "dotnet-sdk-10.0" }
  ],
  "dotnet_packages_other": {
    "backports": {
      "install_command": "sudo add-apt-repository ppa:dotnet/backports && sudo apt-get update",
      "packages": [
        { "component": "sdk", "name": "dotnet-sdk-10.0" }
      ]
    }
  }
}
```

#### 4. Handle distros not in query results

Not all distros appear in the query results (e.g. RHEL packages are in a subscription-only repo). Leave `dotnet_packages` absent for those — do not add an empty list.

#### 5. Query distro package lists directly

pkgs.org may not have data for newly released distro versions yet. When a supported distro release is missing from the query results, check the distro's own package list as a fallback.

**Ubuntu** — query `packages.ubuntu.com` for the release codename:

```bash
curl -s "https://packages.ubuntu.com/{codename}/allpackages?format=txt.gz" \
  | gunzip | grep -i "dotnet.*{major}"
curl -s "https://packages.ubuntu.com/{codename}/allpackages?format=txt.gz" \
  | gunzip | grep -i "aspnetcore.*{major}"
```

For example, to check Ubuntu 26.04 (codename `resolute`) for .NET 10:

```bash
curl -s "https://packages.ubuntu.com/resolute/allpackages?format=txt.gz" \
  | gunzip | grep -iE "(dotnet|aspnetcore).*10"
```

If the packages are found (e.g. `dotnet-sdk-10.0`, `dotnet-runtime-10.0`, `aspnetcore-runtime-10.0` in the `universe` component), add them as `dotnet_packages` for that release.

**Fedora** — query the Bodhi update system and source RPM spec:

```bash
# Check which Fedora releases have dotnet builds
curl -s "https://bodhi.fedoraproject.org/updates/?packages=dotnet{major}.{minor}&rows_per_page=20" \
  | python3 -c "
import sys, json
for u in json.load(sys.stdin).get('updates', []):
    print(f\"{u['release']['name']}: {u['title']} ({u['status']})\")"
```

For example, to check .NET 10.0:

```bash
curl -s "https://bodhi.fedoraproject.org/updates/?packages=dotnet10.0&rows_per_page=20" \
  | python3 -c "
import sys, json
for u in json.load(sys.stdin).get('updates', []):
    print(f\"{u['release']['name']}: {u['title']} ({u['status']})\")"
```

Results show each Fedora release with its build status (e.g. `F44: dotnet10.0-10.0.104-1.fc44 (testing)`). To confirm the subpackage names, check the spec file:

```bash
curl -s "https://src.fedoraproject.org/rpms/dotnet{major}.{minor}/blob/f{release}/f/dotnet{major}.{minor}.spec" \
  | grep -E "^%package|^Name:"
```

Fedora packages follow a consistent naming scheme (`dotnet-sdk-{major}.{minor}`, `dotnet-runtime-{major}.{minor}`, `aspnetcore-runtime-{major}.{minor}`), so this is mainly a confirmation step.

**Other distros** — Alpine packages can be checked at `pkgs.alpinelinux.org`. For most other distros, pkgs.org covers them well. Only fall back to direct queries when pkgs.org is missing data for a release you expect to have packages.

#### 6. Present summary

Show the user a summary of which distros+releases have packages and from which feeds, and flag any gaps (supported distro but no packages found).

### Regenerate markdown

After any JSON changes, regenerate both markdown files:

```bash
dotnet-release generate dotnet-dependencies {version} release-notes
dotnet-release generate dotnet-packages {version} release-notes
```

- `dotnet-dependencies.md` — what OS packages .NET requires (from dependency data)
- `dotnet-packages.md` — where to get .NET packages (from `dotnet_packages` / `dotnet_packages_other` data)

> **Important:** Do not hand-edit these markdown files. They are generated from the distros/ JSON files. If the output needs to change, update the generator or template in [dotnet-release](https://github.com/richlander/dotnet-release).

### Commit

```bash
git add release-notes/{version}/distros/ release-notes/{version}/dotnet-dependencies.md release-notes/{version}/dotnet-packages.md
git commit -m "Update {version} distro packages — <summary>"
```

## Known alternative feed commands

When packages come from a non-builtin feed, the `install_command` field tells users how to register that feed before installing packages. Use the exact commands below.

### Ubuntu backports PPA

Feed name: `backports`

```
sudo add-apt-repository ppa:dotnet/backports && sudo apt-get update
```

This PPA provides .NET packages for older Ubuntu LTS releases that don't carry .NET in the default archive. After registering, packages are installed with the normal `apt-get install` command.

### Microsoft packages.microsoft.com (PMC)

Feed name: `microsoft`

```
wget https://packages.microsoft.com/config/{distro}/{version}/packages-microsoft-prod.deb -O /tmp/packages-microsoft-prod.deb && sudo dpkg -i /tmp/packages-microsoft-prod.deb && rm /tmp/packages-microsoft-prod.deb
```

Replace `{distro}` and `{version}` with the distro name and version (e.g. `ubuntu/22.04`, `debian/12`). Note: Microsoft is phasing out PMC for Ubuntu 24.04+ — prefer the builtin or backports feed when available.

### Other feeds

If the query returns a feed name not listed above, ask the user for the registration command. Do not guess — incorrect feed setup commands are worse than none.

## Key facts

- Files are version-scoped — `release-notes/11.0/distros/ubuntu.json` is about .NET 11.0 on Ubuntu
- Dependencies use an agnostic `id` (e.g. `libicu`) with a distro-specific `name` (e.g. `libicu74`)
- `dependencies.json` is the "what .NET needs" list; per-distro files map those to real package names
- Package names like `libicu` are versioned on Debian/Ubuntu (e.g. `libicu76`) but not on Fedora/RHEL (just `libicu`)
- Alpine uses a different naming scheme for .NET packages: `dotnet{major}-{component}` (e.g. `dotnet9-sdk`)
- Debian/Ubuntu/Fedora use: `dotnet-sdk-{major}.{minor}`, `dotnet-runtime-{major}.{minor}`
- Microsoft is phasing out packages.microsoft.com for Ubuntu 24.04+ and newer Fedora
- `install_command` uses `{packages}` as a placeholder for the package list

## Display name rules

The `name` fields (both top-level distro name and per-release names) must use full display names, **never acronyms**. These names appear in generated markdown and user-facing documentation.

| ❌ Acronym | ✅ Full display name |
|-----------|----------------------|
| RHEL | Red Hat Enterprise Linux |
| SLES | SUSE Linux Enterprise Server |

**Examples:**

- Top-level: `"name": "Red Hat Enterprise Linux"` (not `"RHEL"`)
- Release: `"name": "Red Hat Enterprise Linux 9"` (not `"RHEL 9"`)
- Top-level: `"name": "SUSE Linux Enterprise Server"` (not `"SLES"`)
- Release: `"name": "SUSE Linux Enterprise Server 15.7"` (not `"SLES 15.7"`)

File names (`rhel.json`, `sles.json`) remain short — only the `name` fields inside must use full names. When creating new distro files or adding releases, always verify the display name is the full product name, not an abbreviation.

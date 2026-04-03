---
name: update-os-packages
description: >
  Audit and update os-packages.json/md files that document required Linux
  packages for each .NET release. Uses the dotnet-release tool to verify
  package names against distro archives and regenerate markdown. USE FOR:
  adding packages for new distro versions, fixing incorrect package names,
  periodic package audits. DO NOT USE FOR: supported-os.json changes (use
  update-supported-os skill), editing os-packages.md directly (it is
  generated from JSON).
---

# Update OS Packages

Audit and update `os-packages.json` files in this repository. These files declare which Linux packages are required for each .NET release on each distribution. The corresponding `os-packages.md` files are generated from JSON — never hand-edit them.

The scope of `os-packages.json` is broader than `supported-os.json`. It includes any distro version where the package information is helpful — including pre-release versions of supported distros (e.g. Fedora 44 beta) and permanent unstable channels (Alpine edge, Debian sid).

## When to use

- A new distro version is added to `supported-os.json` and needs package entries
- A pre-release distro version is available and package info would be helpful (e.g. Fedora beta, Ubuntu interim release)
- A package name changes between distro releases (e.g. `libicu74` → `libicu76`)
- An OS version reaches end-of-life and its package entries should be removed
- Periodic audit to verify package names still exist in distro archives

## Prerequisites

The `dotnet-release` tool must be installed. Packages are published to [GitHub Packages](https://github.com/richlander/dotnet-release/packages).

```bash
# GitHub Packages requires authentication — use a GitHub token (PAT or GITHUB_TOKEN)
dotnet tool install -g Dotnet.Release.Tools \
  --add-source https://nuget.pkg.github.com/richlander/index.json

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
>
> In GitHub Actions, `GITHUB_TOKEN` is available automatically. For local use, create a [personal access token](https://github.com/settings/tokens) with `read:packages` scope.

## Inputs

The user provides:

- **Versions to audit** — which .NET versions to check (e.g. "8.0+", "10.0 only"), defaults to all active versions
- Optionally, specific distros or package IDs to focus on

## Process

### 1. Verify — check for issues (early out)

Run the verify command for each .NET version to audit:

```bash
dotnet-release verify os-packages <version> release-notes
```

Examples:

```bash
# Check 10.0 against local files
dotnet-release verify os-packages 10.0 release-notes

# Check against live data on GitHub (no local clone needed)
dotnet-release verify os-packages 10.0
```

**Interpret the exit code:**

- **Exit code 0** — No issues found. Stop here — nothing to do.
- **Exit code 2** — Issues found. The report is written to stdout as markdown. Proceed to step 2.

The verifier checks whether package names in the JSON actually exist in distro archives. It currently supports **Ubuntu** (via Launchpad API) and **Debian** (via packages.debian.org). Other distros are skipped.

The report uses GitHub callout blocks:

| Callout | Meaning | Action |
| --------- | --------- | -------- |
| `> [!WARNING]` | Package name not found in distro archive | Fix the package name or remove the entry |

See [references/verify-output-example.md](references/verify-output-example.md) for example output.

If all versions return exit code 0, the package list is current. **Stop here.**

### 2. Determine scope of changes

Review the verify report and decide which issues to act on:

- **WARNING items** (package not found) — fix by updating the package name or removing the distro release entry if it's no longer supported
- **Skipped distros** — cannot be verified automatically; review manually if the user requests

Present findings to the user with recommendations before making changes.

### 3. Apply changes to os-packages.json

For each confirmed change, edit `release-notes/<version>/os-packages.json`.

#### JSON structure

The file has two main sections:

- **`packages`** — global package definitions (id, name, required-scenarios, references)
- **`distributions`** — per-distro data with install commands and per-release package names

#### Common edits

**Add a new distro release** (e.g. when a version is added to supported-os.json or a pre-release is available):

Copy the most recent release entry for that distro and update:

- `name` — display name (e.g. `"Ubuntu 26.04 LTS (Resolute Raccoon)"`)
- `release` — version string (e.g. `"26.04"`)
- Package names — update any that differ from the previous release

Pre-release versions of supported distros are welcome (e.g. Fedora 44 before GA). The packages list is informational — it does not imply official support.

**Permanent unstable channels** — `Alpine edge` and `Debian sid (Unstable)` are permanent entries that should always be present. They track the rolling release and should have their package names updated when they change, but should never be removed.

```json
{
  "name": "Ubuntu 26.04 LTS (Resolute Raccoon)",
  "release": "26.04",
  "packages": [
    { "id": "libc", "name": "libc6" },
    { "id": "libgcc", "name": "libgcc-s1" },
    { "id": "ca-certificates", "name": "ca-certificates" },
    { "id": "openssl", "name": "libssl3t64" },
    { "id": "libstdc++", "name": "libstdc++6" },
    { "id": "libicu", "name": "libicu76" },
    { "id": "tzdata", "name": "tzdata" },
    { "id": "krb5", "name": "libgssapi-krb5-2" }
  ]
}
```

**Fix a package name** (e.g. `libicu74` → `libicu76`):

Update the `name` field in the relevant release entry. Package names often change between major distro versions due to shared library versioning.

**Remove a distro release** (e.g. when it's removed from supported-os.json):

Delete the release object from the `releases` array for that distribution.

**Key rules:**

- Releases should be ordered newest-first within each distribution
- Each release must include entries for all packages defined in the top-level `packages` array
- The `id` field in each package entry must match a top-level package definition
- Package `name` is the actual package name in the distro's archive (e.g. `libicu74`, not `icu`)

### 4. Regenerate markdown

After updating the JSON, regenerate the markdown file:

```bash
dotnet-release generate os-packages <version> release-notes
```

This overwrites `os-packages.md` with content derived from the updated JSON.

> **Important:** Do not hand-edit `os-packages.md`. It is generated from JSON by the tool. If the markdown output needs to change, update the generator or its [Markout](https://github.com/richlander/markout) template in [dotnet-release](https://github.com/richlander/dotnet-release) instead.

### 5. Run markdownlint

Before committing, verify the generated markdown passes linting:

```bash
npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/<version>/os-packages.md
```

CI runs markdownlint via super-linter. If linting fails, fix the generator or Markout library — do not patch the markdown by hand.

### 6. Validate changes

1. Run verify again to confirm issues are resolved:

   ```bash
   dotnet-release verify os-packages <version> release-notes
   ```

   Expect exit code 0 (or only skipped distros remaining).

2. Spot-check the generated markdown renders correctly — especially the bash install commands.

### 7. Create PR

1. Create a branch:

   ```bash
   git checkout -b update-os-packages-<date>
   ```

2. Commit all changed files (`os-packages.json` and `os-packages.md` for each version):

   ```bash
   git add release-notes/*/os-packages.json release-notes/*/os-packages.md
   git commit -m "Update OS packages — <summary of changes>"
   ```

3. Push and open a PR:

   ```bash
   gh pr create --title "Update OS packages" --body "<description of changes>"
   ```

## Key facts

- The scope of `os-packages.json` is broader than `supported-os.json` — it includes pre-release and unstable versions
- Alpine edge and Debian sid are permanent entries — they should always be present and kept up to date
- Any pre-release version of a supported distro is OK to add (e.g. Fedora beta, Ubuntu interim)
- Package names vary across distro versions — e.g. `libicu74` on Ubuntu 24.04 vs `libicu76` on Ubuntu 26.04
- The verifier only checks Ubuntu and Debian archives; other distros must be reviewed manually
- Install commands are defined per-distribution (not per-release) — all releases of a distro share the same install method
- The `{packageName}` placeholder in install commands is replaced with the actual package list at generation time
- Active .NET versions with `os-packages.json`: 8.0, 9.0, 10.0

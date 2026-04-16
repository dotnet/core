---
name: query-os-support-packages
description: >
  Answer read-only questions about .NET OS support, distro package
  availability, and native dependencies using the release metadata in this
  repository. USE FOR: questions like which .NET versions support Ubuntu
  26.04, which packages are installable via apt or dnf, and which native
  packages are required for manual or self-contained deployments. DO NOT USE
  FOR: updating repository data; use update-supported-os, update-os-packages,
  or update-distro-packages for maintenance.
---

# Query OS Support and Packages

Use this skill to answer read-only questions from the repository's OS support
and Linux package metadata without changing any files.

## When to use

- "Which .NET versions support Ubuntu 26.04?"
- "Which .NET versions can I install via `apt` on Ubuntu 26.04?"
- "What dependencies are required if I install .NET manually?"
- "What native packages are still required for a self-contained deployment?"
- "Is this distro supported, installable, both, or neither?"

## Do not use

- Updating `supported-os.json` / `supported-os.md`
- Updating `os-packages.json` / `os-packages.md`
- Updating `release-notes/{version}/distros/`

For maintenance work, use:

- [`update-supported-os`](../update-supported-os/SKILL.md)
- [`update-os-packages`](../update-os-packages/SKILL.md)
- [`update-distro-packages`](../update-distro-packages/SKILL.md)

## Source precedence

| Question | Primary source | Notes |
| --- | --- | --- |
| Official OS support | `release-notes/<version>/supported-os.json` | The only authoritative source for whether a .NET version officially supports an OS or distro release. |
| Native dependencies, newer schema | `release-notes/<version>/distros/<distro>.json` | Use `releases[].dependencies`. `dotnet-dependencies.md` is a generated view of this data. |
| Package feed availability, newer schema | `release-notes/<version>/distros/<distro>.json` | Use `dotnet_packages` and `dotnet_packages_other`. `dotnet-packages.md` is a generated view of this data. |
| Native dependencies, legacy schema | `release-notes/<version>/os-packages.json` | Use when the version does not have `distros/` data for that question. `os-packages.md` is a generated view. |
| Rendered docs | `supported-os.md`, `dotnet-dependencies.md`, `dotnet-packages.md`, `os-packages.md` | Useful for quoting commands, but prefer JSON as the canonical source. |

## Version-specific schema notes

- **8.0, 9.0, 10.0** may have both `distros/` and `os-packages.*`. For read-only answers, prefer `distros/` for Linux dependencies and package-feed availability, but remember maintenance must keep both schemes in sync.
- **11.0+** uses `distros/` as the Linux package metadata source; there is no companion `os-packages.*` maintenance track.

## Critical rules

1. Never infer **official support** from package data.
2. Never infer **package availability** from `supported-os.json`.
3. Never infer **package availability** from `os-packages.json`. That file documents native dependencies, not which `.NET` packages a distro feed carries.
4. If the repo does not document package-feed availability for a version, say that plainly instead of claiming the packages are unavailable.
5. If a question spans versions that use different schemas, answer each version separately and state which source was used.
6. When the user asks both support and installation questions, split the answer into **Support**, **Packages**, and **Dependencies**.

## Process

### 1. Identify versions in scope

If the user asks "which versions", check the active release directories that could reasonably apply. For package questions, only versions with relevant package metadata can be answered authoritatively from this repo.

### 2. Determine official support

For each version:

1. Open `release-notes/<version>/supported-os.json`.
2. Find the distro or OS entry.
3. Check whether the requested release appears in `supported-versions` or `unsupported-versions`.

Treat that result as authoritative for support status.

### 3. Determine package-feed availability

For Linux distro package-manager questions (`apt`, `dnf`, `zypper`, and so on):

1. Prefer `release-notes/<version>/distros/<distro>.json` when it exists.
2. Find the matching release in `releases[]`.
3. Use:
   - `dotnet_packages` for built-in distro feeds
   - `dotnet_packages_other` for alternative feeds that require a registration step
4. If those fields are absent, the repo may not document package-feed availability for that version or release. Do not infer "not available" from absence alone.

### 4. Determine native dependencies

For manual installs or self-contained deployments:

1. Prefer `release-notes/<version>/distros/<distro>.json` and use `dependencies`.
2. If that schema is not present for the version, fall back to `release-notes/<version>/os-packages.json` and use the distro release's `packages` list.
3. Use the distro's `install_command` only as a formatting template for the package list; do not confuse it with a .NET package feed command.

## Important distinctions

### Support vs packages

A distro release can appear in package metadata without being officially supported. Answer these separately.

### Built-in vs alternative feeds

`dotnet_packages` means the packages are available from the distro's normal package feeds. `dotnet_packages_other` means an extra feed-registration step is required before installation.

### Dependencies vs .NET packages

Native dependencies are OS packages like `libicu`, `libssl`, `libstdc++`, and `tzdata`. They are separate from `.NET` packages like `dotnet-sdk-10.0` or `aspnetcore-runtime-10.0`.

### Linux vs non-Linux

Package and dependency questions are mainly Linux-specific in this repo. For Windows and macOS, `supported-os.json` is usually the only relevant source.

## Output guidance

- Lead with the support answer.
- Then list package-feed availability, if documented.
- Then list native dependencies for manual or self-contained scenarios.
- Call out uncertainty explicitly when the repo has incomplete data for a version.

## Example framing

For a question like "I'm using Ubuntu 26.04. Which .NET versions are supported, which can I install via `apt`, and what dependencies are required for manual install?":

1. Use each version's `supported-os.json` for support.
2. Use `distros/ubuntu.json` for package-feed availability when that file exists.
3. Use `distros/ubuntu.json` or `os-packages.json` for native dependencies.
4. Present support, packages, and dependencies as separate answers so the user can see where the results differ.

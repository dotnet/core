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
| Package feed availability, newer schema | `release-notes/<version>/distros/<distro>.json` | Use `dotnet_packages` for the base/built-in distro feed and `dotnet_packages_other` for additional feed-registration options. `dotnet-packages.md` is a generated view of this data. |
| Native dependencies, legacy schema | `release-notes/<version>/os-packages.json` | Use when the version does not have `distros/` data for that question. `os-packages.md` is a generated view. |
| Rendered docs | `supported-os.md`, `dotnet-dependencies.md`, `dotnet-packages.md`, `os-packages.md` | Useful for quoting commands, but prefer JSON as the canonical source. |

## Version-specific schema notes

- **Supported .NET versions** use a uniform pattern: `supported-os.json` for official support and `distros/<distro>.json` for Linux package-feed availability and native dependencies.
- Because that layout is uniform, many queries can be answered by reading the same small set of JSON fields across versions instead of doing broad discovery or repeated text search.
- **Older .NET versions** may have `supported-os.json` plus legacy `os-packages.json`. That legacy file documents native dependencies only; it does **not** document `.NET` package-feed availability.

## Critical rules

1. Never infer **official support** from package data.
2. Never infer **package availability** from `supported-os.json` or `os-packages.json`.
3. Do not reason from preview/GA status when answering support or package questions; use the documented JSON fields only.
4. If the repo does not document package-feed availability for a version or release, say that plainly instead of claiming the packages are unavailable.
5. Quote package names exactly as documented.
6. When the user asks both support and installation questions, split the answer into **Support**, **Packages**, and **Dependencies**.

## Process

### 1. Classify the query

Before reading anything, identify the minimum data needed:

- **Support only**
- **Package-feed availability only**
- **Native dependencies only**
- **Combined** support/package/dependency question

Also identify the requested scope:

- a **specific .NET version**
- a **set of versions** named by the user
- the **current supported versions** for a distro or distro release

Do not collect package or dependency data for support-only questions, and do not scan every version when the user named one.

### 2. Select the smallest authoritative file set

- **Support** -> `release-notes/<version>/supported-os.json`
- **Package feeds** for supported Linux versions -> `release-notes/<version>/distros/<distro>.json`
- **Dependencies** for supported Linux versions -> `release-notes/<version>/distros/<distro>.json`
- **Dependencies** for older versions without `distros/` data -> `release-notes/<version>/os-packages.json`

If the user named a single version, go straight to that version's files. Enumerate versions only when the scope is broad or unspecified.

### 3. Identify versions in scope

For Linux distro questions about supported .NET versions, start with versions that have both `supported-os.json` and `distros/<distro>.json`. That is the default, richest query set. Only fall back to older versions that use `os-packages.json` when the user explicitly asks about older or out-of-support versions, or when the question is dependency-only.

Because the current supported versions share the same file layout and keys, prefer direct JSON extraction over broad repo-wide text search. Use discovery only to enumerate candidate version directories if you do not already know them; once you have that list, read or script against the matching JSON files directly.

If discovery or text search looks wrong, open representative JSON files directly before concluding the data is absent.

### 4. Determine official support

For support-only questions, this is the fast path: read the distro entry from each `release-notes/<version>/supported-os.json` and stop there unless the user also asked about package feeds or dependencies.

For each version:

1. Open `release-notes/<version>/supported-os.json`.
2. Find the distro or OS entry.
3. Check whether the requested release appears in `supported-versions` or `unsupported-versions`.

Treat that result as authoritative for support status.

### 5. Determine package-feed availability

For Linux distro package-manager questions (`apt`, `dnf`, `zypper`, and so on):

1. Prefer `release-notes/<version>/distros/<distro>.json`.
2. Find the matching release in `releases[]`.
3. Use:
   - `dotnet_packages` for the base distro feed; treat this as built-in package availability
   - `dotnet_packages_other` for alternative feeds that require a registration step
4. If those fields are absent, the repo may not document package-feed availability for that version or release. Do not infer "not available" from absence alone.

### 6. Determine native dependencies

For manual installs or self-contained deployments:

1. Prefer `release-notes/<version>/distros/<distro>.json` and use `dependencies`.
2. If that schema is not present for the version, fall back to `release-notes/<version>/os-packages.json` and use the distro release's `packages` list.
3. Use the distro's `install_command` only as a formatting template for the package list; do not confuse it with a .NET package feed command.

## Important distinctions

### Support vs packages

A distro release can appear in package metadata without being officially supported. Answer these separately.

### Built-in vs alternative feeds

`dotnet_packages` means the packages are available from the distro's base or normal package feeds; treat that as built-in availability. `dotnet_packages_other` means an extra feed-registration step is required before installation.

### Dependencies vs .NET packages

Native dependencies are OS packages like `libicu`, `libssl`, `libstdc++`, and `tzdata`. They are separate from `.NET` packages like `dotnet-sdk-10.0` or `aspnetcore-runtime-10.0`.

## Automation hints

Do not add a checked-in helper script just to answer a read-only question. If ad hoc automation helps, write a one-off `jq`, `python3`, or shell snippet locally and discard it after use.

Prefer JSON-oriented extraction over `rg`/`grep` when you already know which files and fields you need. Favor a single structured pass that emits only the columns needed for the question rather than collecting a superset "just in case."

### Canonical join keys

- **Version**: the `release-notes/<version>/` directory name, such as `8.0`, `9.0`, or `10.0`
- **Distro**: the distro file name and distribution `id`, such as `ubuntu`, `fedora`, or `rhel`
- **Distro release**: the release string, such as `26.04`, `24.04`, or `9`

### Canonical JSON paths

- Official support:
  - `families[]`
  - `families[].distributions[]`
  - distro match: `.id == "<distro>"`
  - status fields: `.supported-versions[]` and `.unsupported-versions[]`
- Newer package/dependency schema:
  - `releases[]`
  - release match: `.release == "<distro-release>"`
  - dependencies: `.dependencies[]`
  - built-in/base feed packages: `.dotnet_packages[]`
  - extra-feed options: `.dotnet_packages_other`
- Legacy dependency schema:
  - use the matching distro and release entry in `os-packages.json`
  - package list comes from that release's `packages[]`

### Generic extraction recipe

1. Normalize the request into:
   - version scope
   - distro id
   - distro release, if any
   - requested facets: support, packages, dependencies
2. Resolve the minimum version set:
   - if the user named a version, use it
   - otherwise enumerate candidate versions once
3. Resolve the minimum file set from the requested facets.
4. Run one ad hoc `jq` or `python3` pass across those files and emit one compact row or object per version.
5. Stop as soon as all requested facets are answered.
6. If a needed field or distro release entry is absent, report that facet as **not documented** rather than inferring absence.

### Good ad hoc output shape

For multi-version questions, script toward a compact row per version, but only include the fields the user asked for:

- version
- support status
- built-in packages
- extra-feed packages and registration command
- dependency package names

## Output guidance

- Lead with the support answer.
- Then list package-feed availability, distinguishing built-in feeds from extra-feed cases.
- Then list native dependencies for manual or self-contained scenarios.
- For multi-version Linux questions, prefer a table. If dependencies are identical across versions, list them once.
- For single-version or single-facet questions, prefer a short direct answer over a full table.
- Call out uncertainty explicitly when the repo has incomplete data for a version.

## Example framing

For a combined Linux distro query:

1. Resolve whether the user asked about one version or many.
2. Use `supported-os.json` for support.
3. Use `distros/<distro>.json` for package-feed availability and dependencies when that schema exists.
4. Only use `os-packages.json` for older dependency-only fallback cases.

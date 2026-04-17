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

Read-only answers about .NET OS support, distro package availability, and
native dependencies from this repo's release metadata. For updating data
files, use [`update-supported-os`](../update-supported-os/SKILL.md),
[`update-os-packages`](../update-os-packages/SKILL.md), or
[`update-distro-packages`](../update-distro-packages/SKILL.md).

## Source precedence

| Question | File | Field |
| --- | --- | --- |
| Official support | `release-notes/<v>/supported-os.json` | `families[].distributions[].{supported,unsupported}-versions` |
| Package feeds (current schema) | `release-notes/<v>/distros/<distro>.json` | `releases[].dotnet_packages` (built-in), `releases[].dotnet_packages_other` (extra-feed) |
| Native dependencies (current schema) | `release-notes/<v>/distros/<distro>.json` | `releases[].dependencies` |
| Native dependencies (legacy) | `release-notes/<v>/os-packages.json` | release entry's `packages[]` (older versions only; does **not** document package-feed availability) |

The `.md` siblings (`supported-os.md`, `dotnet-packages.md`,
`dotnet-dependencies.md`, `os-packages.md`) are generated views — useful for
quoting commands, but JSON is canonical.

## Critical rules

1. Never infer **official support** from package data, or **package
   availability** from support data. A distro release can appear in package
   metadata without being officially supported.
2. Treat the `supported-os.json` lists as authoritative: a release in
   `supported-versions` is supported, a release in `unsupported-versions`
   (or absent from both) is unsupported.
3. Do not substitute preview/GA status for documented JSON fields.
   Preview/GA is only a tiebreaker for null fields (rule 4).
4. When `dotnet_packages` and `dotnet_packages_other` are both null,
   cross-check `releases-index.json` `support-phase`:
   - **Preview** channel → **not yet available** (packages may land before
     GA).
   - **Active** (or other GA) channel with current `distros/<distro>.json`
     data → **not available** from the distro package manager.
   - **No `distros/<distro>.json` for that version, or the file predates the
     distro release** → **not documented**.
5. `dotnet_packages` = built-in/base distro feed.
   `dotnet_packages_other` = extra feed requiring a registration step.
6. Native dependencies (`libicu`, `libssl`, `libstdc++`, `tzdata`, etc.) are
   OS packages, distinct from .NET packages (`dotnet-sdk-10.0`,
   `aspnetcore-runtime-10.0`).
7. The distro's `install_command` is only a formatting template for the
   package list — not a .NET package feed command.
8. Quote package names exactly as documented.
9. For combined questions, split the answer into **Support**, **Packages**,
   and **Dependencies**.

## Process

1. **Classify** — support only, packages only, dependencies only, or
   combined; and the version scope (single, named set, or
   current-supported).
2. **Scope versions** — for current Linux-distro questions, default to
   versions with both `supported-os.json` and `distros/<distro>.json`. Fall
   back to legacy `os-packages.json` only when the user asks about older or
   out-of-support versions, or for dependency-only questions on those
   versions.
3. **Extract** — read the fields named in [Canonical JSON
   paths](#canonical-json-paths). Stop as soon as the question's facets are
   answered — don't collect a superset.

If the user named a single version, go straight to its files; enumerate
versions only when scope is broad. If discovery or text search looks wrong,
open a representative JSON file directly before concluding the data is
absent.

## Canonical join keys

- **Version** — `release-notes/<version>/` directory name (e.g., `8.0`,
  `10.0`)
- **Distro** — file name and `id` (e.g., `ubuntu`, `fedora`, `rhel`)
- **Distro release** — release string (e.g., `26.04`, `9`)

## Canonical JSON paths

- **Official support** in `supported-os.json`:
  - `families[].distributions[]` matched by `.id == "<distro>"`
  - status from `.supported-versions[]` and `.unsupported-versions[]`
- **Current package/dependency schema** in `distros/<distro>.json`:
  - `releases[]` matched by `.release == "<distro-release>"`
  - dependencies: `.dependencies[]`
  - built-in feed: `.dotnet_packages[]`
  - extra-feed options: `.dotnet_packages_other`
- **Legacy dependency schema** in `os-packages.json`:
  - matching distro and release entry's `packages[]`

## Automation

Don't add a checked-in helper script for read-only questions — use a one-off
`jq` / `python3` / shell snippet locally and discard. Prefer a single
structured JSON pass over `rg`/`grep` text scans, emitting only the fields
needed (one compact row per version).

## Output guidance

- Lead with support, then package-feed availability (built-in vs
  extra-feed), then native dependencies.
- For multi-version Linux questions, prefer a table; if dependencies are
  identical across versions, list them once.
- For single-version or single-facet questions, use a short direct answer
  instead of a full table.
- Call out uncertainty when the repo has incomplete data for a version.

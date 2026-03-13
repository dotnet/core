---
name: update-supported-os
description: >
  Audit and update supported-os.json/md files to reflect current OS version
  support. Uses the dotnet-release tool for automated verification against
  upstream lifecycle data and markdown regeneration. USE FOR: adding new OS
  versions, moving EOL versions to unsupported, periodic support matrix audits.
  DO NOT USE FOR: os-packages.json changes (use update-os-packages skill),
  editing supported-os.md directly (it is generated from JSON).
---

# Update Supported OS

Audit and update `supported-os.json` files in this repository. These files declare which operating system versions are supported for each .NET release. The corresponding `supported-os.md` files are generated from JSON — never hand-edit them.

## When to use

- A new OS version is released (e.g. Ubuntu 26.04, Fedora 44, Alpine 3.23)
- An OS version reaches end-of-life and should be moved to unsupported
- Periodic audit to ensure the support matrix is current

## Prerequisites

The `dotnet-release` tool must be installed. Install from [richlander/dotnet-release](https://github.com/richlander/dotnet-release):

```bash
# From a clone of the dotnet-release repo
./install.sh

# Verify
dotnet-release --help
```

## Inputs

The user provides:

- **Versions to audit** — which .NET versions to check (e.g. "8.0+", "10.0 only"), defaults to all active versions
- Optionally, specific distros or OS versions to focus on

## Process

### 1. Verify — check for issues (early out)

Run the verify command for each .NET version to audit:

```bash
dotnet-release verify supported-os <version> release-notes
```

Examples:

```bash
# Check 10.0 against local files
dotnet-release verify supported-os 10.0 release-notes

# Check against live data on GitHub (no local clone needed)
dotnet-release verify supported-os 10.0
```

**Interpret the exit code:**

- **Exit code 0** — No issues found. Stop here — nothing to do.
- **Exit code 2** — Issues found. The report is written to stdout as markdown. Proceed to step 2.

The report uses GitHub callout blocks to categorize issues:

| Callout | Meaning | Action |
| --------- | --------- | -------- |
| `> [!WARNING]` | EOL but still listed as supported | Move to `unsupported-versions` |
| `> [!IMPORTANT]` | Active release not listed | Consider adding to `supported-versions` |
| `> [!TIP]` | Active but listed as unsupported | Verify this is intentional (no action usually needed) |
| `> [!CAUTION]` | Approaching EOL within 3 months | Informational — no immediate action |

See [references/verify-output-example.md](references/verify-output-example.md) for example output.

If all versions return exit code 0, the matrix is current. **Stop here.**

### 2. Determine scope of changes

Review the verify report and decide which issues to act on:

- **WARNING items** (EOL but supported) — always fix these
- **IMPORTANT items** (missing active releases) — add unless there's a known reason to exclude
- **TIP items** (active but unsupported) — usually intentional, skip unless the user says otherwise
- **CAUTION items** (approaching EOL) — informational only, no JSON changes needed

Present findings to the user with recommendations before making changes.

### 3. Apply changes to supported-os.json

For each confirmed change, edit `release-notes/<version>/supported-os.json`:

- **Move EOL versions**: Remove from `supported-versions`, add to `unsupported-versions`
- **Add new versions**: Insert into `supported-versions` (keep sorted, newest first)
- **Update `last-updated`**: Set to today's date (format: `YYYY-MM-DD`)
- Use the `edit` tool for surgical JSON changes
- Versions are strings, not numbers — `"3.22"` not `3.22`

### 4. Regenerate markdown

After updating the JSON, regenerate the markdown file:

```bash
dotnet-release generate supported-os <version> release-notes
```

This overwrites `supported-os.md` with content derived from the updated JSON.

> **Important:** Do not hand-edit `supported-os.md`. It is generated from JSON by the tool. If the markdown output needs to change, update the generator or its [Markout](https://github.com/richlander/markout) template in [dotnet-release](https://github.com/richlander/dotnet-release) instead.

### 5. Run markdownlint

Before committing, verify the generated markdown passes linting:

```bash
npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/<version>/supported-os.md
```

CI runs markdownlint via super-linter. If linting fails, fix the generator or Markout library — do not patch the markdown by hand.

### 6. Cross-reference with os-packages.json

Check if any newly added distro versions need entries in `os-packages.json`. If so, inform the user to run the `update-os-packages` skill next.

### 7. Validate changes

1. Run verify again to confirm issues are resolved:

   ```bash
   dotnet-release verify supported-os <version> release-notes
   ```

   Expect exit code 0 (or only TIP/CAUTION items remaining).

2. Spot-check the generated markdown renders correctly.

### 8. Create PR

1. Create a branch:

   ```bash
   git checkout -b update-supported-os-<date>
   ```

2. Commit all changed files (`supported-os.json` and `supported-os.md` for each version):

   ```bash
   git add release-notes/*/supported-os.json release-notes/*/supported-os.md
   git commit -m "Update supported OS matrix — <summary of changes>"
   ```

3. Push and open a PR:

   ```bash
   gh pr create --title "Update supported OS matrix" --body "<description of changes>"
   ```

## Key facts

- The `id` field in each distribution matches [endoflife.date](https://endoflife.date) product IDs
- Versions are strings, not numbers — `"3.22"` not `3.22`
- `supported-versions` should be ordered newest-first
- `unsupported-versions` tracks previously-supported versions for historical reference
- Non-Linux OS families (Android, Apple, Windows) follow the same structure but use different lifecycle sources
- The `last-updated` field should reflect the date of any change
- Active .NET versions with `supported-os.json`: 8.0, 9.0, 10.0

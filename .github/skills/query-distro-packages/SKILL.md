---
name: query-distro-packages
description: >
  Answer end-user questions about installing .NET on a specific Linux/macOS
  distro by reading the package and dependency data in
  release-notes/{version}/distros/. USE FOR: "what packages do I need for
  .NET on Ubuntu 24.04", "how do I install .NET on Fedora", "what are the
  runtime dependencies for .NET 10 on Alpine". DO NOT USE FOR: creating or
  updating the distro JSON files (use update-distro-packages skill),
  supported-os/EOL/CVE questions (not covered by this skill).
---

# Query Distro Packages

Answer "what do I need to install .NET on {distro}?" style questions by reading the already-published data in `release-notes/{version}/distros/`. This skill only reads that data — it never edits it.

This is the **consumer** counterpart to [`update-distro-packages`](../update-distro-packages/SKILL.md), which produces the files this skill reads. If the data looks wrong or missing, fix it there — not here.

## When to use

- "What packages do I need to install .NET {version} on {distro}?"
- "How do I install .NET on {distro}?"
- "What are the runtime dependencies for .NET on {distro}?"
- Any question where the answer is a copy-pasteable install command plus a package list

## Inputs

From the user's question, extract:

- **Distro** — required (e.g. "Ubuntu", "Fedora", "Alpine"). If missing, ask.
- **Distro release** — optional (e.g. "24.04"). If missing or ambiguous, see step 3.
- **.NET version** — optional (e.g. "10", "11"). If missing, see step 1.

## Process

### 1. Resolve the .NET version

If the user names a version, use it (accept "10", "10.0", ".NET 10" interchangeably, matched against the directory names under `release-notes/`).

If they don't, default to the newest version whose `releases.json` has `"support-phase": "active"` — the current recommended version. Do **not** default to the highest version number: a newer directory can still be `"go-live"` or `"preview"` (a release candidate), which is the wrong recommendation for someone who just wants a working install.

```bash
for f in release-notes/*/releases.json; do
  python3 -c "import json; d=json.load(open('$f')); print(d['channel-version'], d['support-phase'])"
done
```

Only use a preview/go-live version if the user asks for it by name (e.g. "the .NET 11 preview").

### 2. Resolve the distro

Read `release-notes/{version}/distros/index.json` — it maps filenames to display names. Match the user's wording case-insensitively and tolerate partial input ("ubuntu", "Red Hat" → `rhel.json`). If nothing matches, say so and list the available distros — don't guess.

### 3. Resolve the release

Read the matched distro file (e.g. `ubuntu.json`) and look at its `releases[]`:

- Exact release given (e.g. "24.04") → match it directly.
- Partial release given (e.g. "Ubuntu 24") → match only if a single release starts with it; otherwise list the candidates and ask.
- No release given → list the available releases and ask which one. Don't assume the newest — the user needs packages for the OS they already have, not the newest one.

### 4. Compose the answer

From the matched release entry:

- **Dependencies** — the `dependencies[]` list; each `name` is the real package to install. See `../update-distro-packages/SKILL.md` for the full field reference.
- **.NET packages**:
  - `dotnet_packages` present → these come from the distro's built-in feed. Use the top-level `install_command`, with `{packages}` substituted by the dependency + .NET package names, as-is.
  - Only `dotnet_packages_other` present → .NET isn't in the builtin feed. Show that feed's own `install_command` first (it registers the feed), then the normal install command for the packages it lists. Say plainly this is a non-default feed.
  - Neither present → say the package data isn't available for this release (e.g. RHEL's subscription-gated feed) — don't invent a package name.
- **Dependency purpose** (only if the user wants the *why*): cross-reference each dependency `id` against `release-notes/{version}/distros/dependencies.json` for its human name and `required_scenarios`.

## Common failure modes

- **Guessing a package name** when the release or feed data isn't in the JSON — say it's missing instead.
- **Defaulting to the newest version directory** instead of the newest `active` one — recommends release-candidate packages by mistake.
- **Skipping the feed-registration command** when answering from `dotnet_packages_other` — the plain install command fails without it.
- **Assuming "latest release" when no release was given** — ask instead.

## Key facts

- Package names are version-scoped and vary by distro even for the same library — e.g. `libicu74` (Ubuntu 24.04) vs `libicu76` (Ubuntu 25.10) vs unversioned `libicu` (Fedora/RHEL).
- Alpine names .NET packages differently: `dotnet{major}-{component}` (e.g. `dotnet9-sdk`), not `dotnet-sdk-{major}.{minor}`.
- A distro can appear in `index.json` without official .NET support — `update-distro-packages` intentionally includes rolling/pre-release channels (Alpine edge, Debian sid) for informational purposes.

## Output

Give the user:

1. The install command(s), ready to copy-paste (feed registration first, if needed).
2. The list of packages that command installs and why (dependency vs. .NET component).
3. Anything you couldn't answer and why (missing data, ambiguous distro/release) — never a guessed package name.

See [`references/example-queries.md`](references/example-queries.md) for worked examples.

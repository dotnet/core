# Verify Output Example

Example output from `release-notes verify os-packages 10.0 release-notes`:

````markdown
# .NET 10.0 — OS Packages Verification

| Field | Value |
| ----- | ----- |
| Generated | 2026-03-13 19:47 UTC |
| Packages checked | 48 |
| Missing packages | 1 |

## Ubuntu

> [!WARNING]
> Package names not found in distro archive

| Release | Package ID | Package Name |
| ------- | ---------- | ------------ |
| Ubuntu 26.04 LTS (Resolute Raccoon) | libicu | libicu76 |
````

In this example, the verifier checked 48 packages across 4 Ubuntu releases and found
one package name (`libicu76`) that doesn't exist yet in the Ubuntu 26.04 archive.

**Common reasons for missing packages:**

- The distro release is too new and the package hasn't been published yet
- The package was renamed between versions (e.g. `libssl3` → `libssl3t64`)
- A typo in the package name

**Note:** Distros without automated checking (Alpine, Fedora, RHEL, etc.) appear as
"Skipping \<distro\> (no package checker available)" in stderr. Only the issues report
is printed to stdout.

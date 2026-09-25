---
name: validate-code-samples
description: Verify release notes claims by building and running them against the actual .NET build for the milestone. Reads the exact SDK version from build-metadata.json, installs it in a scoped location with the official dotnet-install script, exercises every documented API and code sample, and catches the errors that static API verification cannot see - non-existent JavaScript APIs, inverted defaults, and runtime failures. USE FOR - validating a drafted component's release notes before the PR goes up, checking that documented samples compile and run, confirming a feature is actually reachable in the shipped build. DO NOT USE FOR - generating build-metadata.json or the API diff (use the release-notes workflow and api-diff), confirming a managed API exists in a ref pack (use api-diff-validation), scoring features (use generate-features).
compatibility: Requires the milestone's build-metadata.json, network access to the public .NET build artifacts, and PowerShell or a POSIX shell. Pairs with api-diff-validation, which covers the static half of the same problem.
---

# Validate Code Samples

Build and run what the release notes claim. This is the **runtime verification stage** of the
pipeline, and it is the last line of defence before a component PR goes to its owner.

[`api-verification.md`](../release-notes/references/api-verification.md) covers the *static* half of
this problem: does a managed type or member exist in the ref pack? That check is necessary and
cheap, but it is not sufficient. It cannot see JavaScript APIs, it cannot tell you what a default
value is, and it cannot tell you whether a documented sequence of calls actually works.

## Acquiring a build

Do not test against whatever SDK happens to be on the machine or select a second build from the .NET SDK builds table. The release-notes workflow already generates `build-metadata.json` for the milestone. Use its `build.sdk_version` to install the exact SDK.

If `build-metadata.json` is missing, stop and generate it through the release-notes workflow before validating samples. See [`api-verification.md`](../release-notes/references/api-verification.md). Do not silently substitute the latest SDK from the milestone channel.

### Read the exact SDK version

From the milestone directory:

```powershell
$metadata = Get-Content build-metadata.json -Raw | ConvertFrom-Json
$sdkVersion = $metadata.build.sdk_version
if (-not $sdkVersion) { throw "build.sdk_version is missing from build-metadata.json" }
```

### Confirm the build matches the notes

Each build publishes a commit manifest next to the SDK. Use the RID for the validation machine:

```text
https://ci.dot.net/public/Sdk/{sdk_version}/productCommit-{rid}.json
```

```json
{
  "runtime":    { "commit": "e2c1e00b...", "version": "11.0.0-preview.7.26381.103" },
  "aspnetcore": { "commit": "e2c1e00b...", "version": "11.0.0-preview.7.26381.103" },
  "sdk":        { "commit": "e2c1e00b...", "version": "11.0.100-preview.7.26381.103" }
}
```

Confirm that `sdk.version` matches `build.sdk_version` from `build-metadata.json`. The `sdk.commit` is the exact VMR commit that produced the build. Require `build-metadata.json` to record that same full commit SHA as `head_ref`: a branch name can move, and merely finding the build commit in its history does not prove that `changes.json` covers the same build. If `head_ref` is a branch name or differs from `sdk.commit`, regenerate both `changes.json` and `build-metadata.json` with `--head <sdk.commit>` and their original base and release options. If the change set differs, update `features.json` and the notes too. Verify that the regenerated SDK version and `head_ref` match the selected build; otherwise stop before validating samples.

### Install it scoped, not machine-wide

Use the official public [`dotnet-install`](https://learn.microsoft.com/dotnet/core/tools/dotnet-install-script) script to install the exact version from `build-metadata.json`. Install into a scratch directory, not machine-wide; a global install makes results non-reproducible and can disrupt other work on a shared machine.

```powershell
$root = Join-Path $env:TEMP "dotnet-release-notes-$([guid]::NewGuid())"
$installScript = Join-Path $env:TEMP "dotnet-install-$([guid]::NewGuid()).ps1"
try {
    Invoke-WebRequest https://dot.net/v1/dotnet-install.ps1 -OutFile $installScript
    & $installScript `
        -Version $sdkVersion `
        -AzureFeed https://ci.dot.net/public `
        -InstallDir $root `
        -NoPath
    if ($LASTEXITCODE -ne 0) { throw "dotnet-install failed with exit code $LASTEXITCODE" }
}
finally {
    if (Test-Path $installScript) { Remove-Item $installScript -Force }
}

$env:DOTNET_ROOT = $root
$env:PATH = "$root;$env:PATH"
$installedVersion = & "$root\dotnet.exe" --version
if ($LASTEXITCODE -ne 0 -or $installedVersion -ne $sdkVersion) {
    throw "Expected SDK $sdkVersion, found $installedVersion"
}
$installedVersion
```

On Linux or macOS, set `sdk_version` to `build.sdk_version` from the same metadata and run:

```bash
set -e
: "${sdk_version:?Set sdk_version from build-metadata.json}"
root="$(mktemp -d "${TMPDIR:-/tmp}/dotnet-release-notes.XXXXXX")"
install_script="$(mktemp "${TMPDIR:-/tmp}/dotnet-install.XXXXXX")"
trap 'rm -f "$install_script"' EXIT
curl -fsSL https://dot.net/v1/dotnet-install.sh -o "$install_script"
bash "$install_script" --version "$sdk_version" \
  --azure-feed https://ci.dot.net/public --install-dir "$root" --no-path
export DOTNET_ROOT="$root"
export PATH="$root:$PATH"
installed_version="$("$root/dotnet" --version)"
if [ "$installed_version" != "$sdk_version" ]; then
  printf 'Expected SDK %s, found %s\n' "$sdk_version" "$installed_version" >&2
  exit 1
fi
printf '%s\n' "$installed_version"
```

Check `dotnet --version` from each sample project's directory too: a `global.json` can change SDK resolution there. It must match `build.sdk_version` before trusting the sample results.

## Where samples live

Keep maintained validation samples in this repository under `release-notes/<major>.0/samples/<component>/`, for example `release-notes/11.0/samples/aspnetcore/`. These are executable fixtures primarily for verifying release notes, not a general-purpose or reader-facing samples collection. They do not replace the officially documented samples maintained by the relevant product and documentation teams.

Use one working sample set per major release and component. Upgrade it from preview to preview so API renames, changed defaults, analyzer diagnostics, and runtime regressions surface naturally. Start each major release with a new sample set instead of copying or retargeting scenarios from the previous release. Component owners review changes to their sample set alongside the corresponding release notes.

Prefer a maintained sample when a claim tests runtime behavior, defaults, JavaScript or browser APIs, public feature reachability, or anything worth checking again in the next preview. For a one-off compile check that has no continuing regression value, create an isolated project in a scratch directory and remove it after validation.

Keep expected results with the maintained scenario in a short README, assertion, or script. Do not commit downloaded SDKs, packages, build outputs, certificates, secrets, or generated assets.

## What to validate

Work through the drafted component markdown claim by claim.

1. **Every code sample compiles.** Not "looks plausible" — actually builds against the milestone
   build. A sample that does not compile is worse than no sample.
2. **Every documented default and polarity.** If the notes say a flag defaults to `true`, read the
   value. Renames that invert meaning (`EnableX` becoming `DisableX`) are the highest-risk class of
   change, because the name check passes while the meaning is backwards.
3. **Every JavaScript or browser-facing API.** `dotnet-inspect` cannot see these at all. Serve the
   app and inspect the actual shipped script, or call the API from the page. Never document a JS API
   from a PR description alone.
4. **Every documented endpoint or runtime behavior.** Request it. Record the status code. Build
   success does not imply the page renders.
5. **Feature reachability.** Confirm the feature is reachable through the public surface in the
   shipped build, not merely present in source.

## Recording what you verified

Note the build next to the claim so a reviewer can tell "this is wrong" apart from "this was checked
against a stale build":

```markdown
<!-- Verified against SDK 11.0.100-preview.7.26381.103 (VMR e2c1e00b) -->
```

For samples that assert a specific runtime result, keep the expected result in the sample itself
(a header comment recording the expected HTTP status, for example) so drift shows up the next time
the sample is run.

## When a claim fails validation

Follow the escalation in
[`api-verification.md`](../release-notes/references/api-verification.md) — check the package version,
search for a rename, look for a revert, confirm the member is public. Then:

- **Fix the notes, not the sample**, when the notes describe an API that does not exist. Rewrite the
  section around what actually shipped.
- **Fix the sample, not the notes**, when the notes are right and the sample is stale. A sample
  pinned to the previous preview will fail against a rename that the notes correctly documented.
- **Drop the claim** when neither holds up. A correct prose description with a PR link always beats a
  confident, wrong code sample.

## Notes

- **Do not delegate this to a sub-agent.** Verification depends on reading real command output and
  reacting to it. Summarizing agents reliably report that samples "look correct" - the failures in
  the table above were all found by running the code directly.
- **A maintained sample set is the cheapest way to run this stage.** Upgrading the existing
  component samples to the new build surfaces renames, inverted defaults, and new analyzer
  diagnostics as build errors and warnings, which is exactly the
  [upgrade guidance](../release-notes/references/format-template.md) preview users need.

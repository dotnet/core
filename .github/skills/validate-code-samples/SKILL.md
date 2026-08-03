---
name: validate-code-samples
description: Verify release notes claims by building and running them against the actual .NET build for the milestone. Covers acquiring a scoped SDK from ci.dot.net, exercising every documented API and code sample, and catching the errors that static API verification cannot see - non-existent JavaScript APIs, inverted defaults, and runtime failures. USE FOR - validating a drafted component's release notes before the PR goes up, checking that documented samples compile and run, confirming a feature is actually reachable in the shipped build. DO NOT USE FOR - generating the API diff (use api-diff), confirming a managed API exists in a ref pack (use api-diff-validation), scoring features (use generate-features).
compatibility: Requires a build-metadata.json for the milestone (produced by `release-notes generate build-metadata`) and network access to ci.dot.net. Pairs with api-diff-validation, which covers the static half of the same problem.
---

# Validate Code Samples

Build and run what the release notes claim. This is the **runtime verification stage** of the
pipeline, and it is the last line of defence before a component PR goes to its owner.

[`api-verification.md`](../release-notes/references/api-verification.md) covers the *static* half of
this problem: does a managed type or member exist in the ref pack? That check is necessary and
cheap, but it is not sufficient. It cannot see JavaScript APIs, it cannot tell you what a default
value is, and it cannot tell you whether a documented sequence of calls actually works.

## Acquiring a build

Do not test against whatever SDK happens to be on the machine. Test against the milestone build.

### Preferred: derive the URL from `build-metadata.json`

`release-notes generate build-metadata` already emits an `sdk_url` with a `{platform}` placeholder,
so no scraping is needed. Substitute the platform and download:

```text
https://ci.dot.net/public/Sdk/{sdk_version}/dotnet-sdk-{sdk_version}-win-x64.zip
https://ci.dot.net/public/Sdk/{sdk_version}/dotnet-sdk-{sdk_version}-linux-x64.tar.gz
```

### Other sources

- **<https://github.com/dotnet/dotnet/blob/main/docs/builds-table.md>** — the latest-build table in
  the VMR repo. Use it when there is no `build-metadata.json` yet, or to sanity-check that the
  version you derived is really the current build. It also documents the `dotnet11` NuGet feed
  needed for runtime packs in self-contained scenarios.
- **<https://release.dot.net>** — the human-facing list of builds the team installs from. Fine for a
  person, but prefer a URL derived from `build-metadata.json` for anything scripted.

### Confirm the build matches the notes

Each build publishes a commit manifest next to the SDK:

```text
https://ci.dot.net/public/Sdk/{sdk_version}/productCommit-win-x64.json
```

```json
{
  "runtime":    { "commit": "e2c1e00b...", "version": "11.0.0-preview.7.26381.103" },
  "aspnetcore": { "commit": "e2c1e00b...", "version": "11.0.0-preview.7.26381.103" },
  "sdk":        { "commit": "e2c1e00b...", "version": "11.0.100-preview.7.26381.103" }
}
```

The `commit` is the **VMR commit** the build came from. Check it against the head ref used to
generate `changes.json`. If they disagree, you are validating a different build than the one you
documented, and any "the API is missing" conclusion is unreliable.

### Install it scoped, not machine-wide

Extract the archive to a scratch directory and point the environment at it. Do not install
machine-wide — a global install makes results non-reproducible and can disrupt other work on a
shared machine.

```powershell
$root = "$env:TEMP\dotnet-p7"
Expand-Archive dotnet-sdk-*-win-x64.zip -DestinationPath $root
$env:DOTNET_ROOT = $root
$env:PATH = "$root;$env:PATH"
$env:DOTNET_MULTILEVEL_LOOKUP = "0"
dotnet --version   # confirm this is the milestone build, not the machine SDK
```

Always print `dotnet --version` and confirm it before trusting any result.

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
- **A maintained samples repository is the cheapest way to run this stage.** Upgrading an existing
  set of working samples to the new build surfaces renames, inverted defaults, and new analyzer
  diagnostics as build errors and warnings, which is exactly the
  [upgrade guidance](../release-notes/references/format-template.md) preview users need.

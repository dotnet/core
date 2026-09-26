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

Use `build.sdk_version` from the milestone's existing `build-metadata.json`. If the file or version is missing, generate the metadata through the release-notes workflow before validating samples; see [`api-verification.md`](../release-notes/references/api-verification.md). Do not substitute the machine SDK or a latest-channel build.

Install that exact version into a fresh, empty temporary directory with the official public [`dotnet-install` script](https://learn.microsoft.com/dotnet/core/tools/dotnet-install-script) for the host OS. Pass the exact version (`-Version` or `--version`), the `https://ci.dot.net/public` feed (`-AzureFeed` or `--azure-feed`), and the temporary install directory (`-InstallDir` or `--install-dir`); stop if installation fails. Set `DOTNET_ROOT` to that directory and prepend it to `PATH` for sample builds and runs. Do not install the preview SDK machine-wide.

Verify the installed SDK reports `build.sdk_version`; stop if it does not.

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

Record the last validated SDK version in `release-notes/<major>.0/samples/README.md`. Update it after validating the maintained component sample sets against that SDK. Record observed behavior with the validation evidence so reviewers can distinguish a stale build from an incorrect claim.

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

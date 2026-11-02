---
name: validate-code-samples
description: Build and run release-note features, snippets, and migration examples against the target milestone build in local-only scratch projects. Uses the exact SDK from build-metadata.json. USE FOR - validating documented code and behavior. DO NOT USE FOR - discovering breaking changes by upgrading earlier projects, committing samples, generating build metadata or API diffs (use release-notes and api-diff), static API verification (use api-diff-validation), feature scoring (use generate-features).
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

Create validation samples in a temporary scratch directory outside the checkout. Never commit sample source, projects, validation scripts, fixtures, or supporting assets. Markdown code snippets are allowed.

Do not commit downloaded SDKs, packages, build outputs, certificates, secrets, or generated assets. Stop any processes started for validation and remove the temporary sample projects and downloaded validation artifacts when finished.

## What to validate

- Build or update a sample for every feature in the release notes, even if the notes have no code snippet for it. Run each sample against the milestone build and verify the claimed behavior, such as a browser API call, an endpoint response, or an explicitly stated default or flag polarity. A successful build or startup alone is not enough.
- Test any code snippets from the release notes as part of those samples. Confirm the snippets build, run, and behave as described.
- For migrations identified from API diffs, `changes.json`, PRs, earlier notes, or compatibility guidance, test replacement code and behavior against the target build. Do not reconstruct earlier projects or install earlier builds to discover breaking changes.

## Recording what you verified

Record the exact SDK version, scenarios tested, expected and observed behavior, and failures or unverified claims in the component PR description or a review comment.

## When a claim fails validation

Follow the escalation in
[`api-verification.md`](../release-notes/references/api-verification.md) — check the package version,
search for a rename, look for a revert, confirm the member is public. Then:

- **Fix the notes, not the sample**, when the notes describe an API that does not exist. Rewrite the
  section around what actually shipped.
- **Correct migration guidance** when replacement code or behavior fails validation. Establish the old behavior from source evidence.
- **Drop the claim** when neither holds up. A correct prose description with a PR link always beats a
  confident, wrong code sample.

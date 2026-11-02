---
name: validate-code-samples
description: Validate every release-note feature, its code snippets, and documented migration guidance against the target milestone build using local-only scratch projects. Reads the exact SDK version from build-metadata.json and installs it in a scoped location with the official dotnet-install script. USE FOR - building and running local samples for release-note features, testing documented snippets and behavior, and verifying migration guidance. DO NOT USE FOR - reconstructing and upgrading earlier projects to discover breaking changes, committing sample projects, generating build-metadata.json or the API diff (use the release-notes workflow and api-diff), confirming a managed API exists in a ref pack (use api-diff-validation), scoring features (use generate-features).
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

Create validation samples only in a temporary scratch directory outside the repository checkout. Do not add or commit sample source files, projects, validation scripts, fixtures, or supporting assets to this repository. Code snippets in the Markdown release notes are still appropriate; executable validation projects are local-only.

Validate against the target milestone build. Do not reconstruct earlier projects, install earlier builds, or run preview-to-preview sample upgrades to discover breaking changes. Identify migration candidates from API diffs, `changes.json`, upstream PRs, earlier release notes, and published compatibility guidance, then test the documented replacement code and behavior against the target build.

Do not commit downloaded SDKs, packages, build outputs, certificates, secrets, or generated assets. Stop any processes started for validation and remove the temporary sample projects and downloaded validation artifacts when finished.

## What to validate

- Build or update a sample for every feature in the release notes, even if the notes have no code snippet for it. Run each sample against the milestone build and verify the claimed behavior, such as a browser API call, an endpoint response, or an explicitly stated default or flag polarity. A successful build or startup alone is not enough.
- Test any code snippets from the release notes as part of those samples. Confirm the snippets build, run, and behave as described.
- For migration guidance identified from existing evidence, verify that the documented replacement code and behavior work on the target build. Establish the old behavior from that evidence rather than by recreating an earlier project.

## Recording what you verified

Summarize validation in the component PR description or a review comment: record the exact SDK version, scenarios tested, expected and observed behavior, and any failures or unverified claims. Do not create sample READMEs or commit validation projects or their outputs. Keep reader-facing release notes focused on the verified feature and any necessary migration guidance.

## When a claim fails validation

Follow the escalation in
[`api-verification.md`](../release-notes/references/api-verification.md) — check the package version,
search for a rename, look for a revert, confirm the member is public. Then:

- **Fix the notes, not the sample**, when the notes describe an API that does not exist. Rewrite the
  section around what actually shipped.
- **Correct the migration guidance** when target-build validation shows that the documented replacement code or behavior is wrong. Verify the old behavior from source evidence before documenting the change.
- **Drop the claim** when neither holds up. A correct prose description with a PR link always beats a
  confident, wrong code sample.

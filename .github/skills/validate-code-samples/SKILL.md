---
name: validate-code-samples
description: Validate every release-note feature and its code snippets against the milestone build, and identify preview-to-preview migration steps when updating maintained samples. Reads the exact SDK version from build-metadata.json and installs it in a scoped location with the official dotnet-install script. USE FOR - building and running samples for release-note features, testing documented snippets and behavior, and documenting changes needed to update maintained samples to a new preview. DO NOT USE FOR - generating build-metadata.json or the API diff (use the release-notes workflow and api-diff), confirming a managed API exists in a ref pack (use api-diff-validation), scoring features (use generate-features).
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

Keep samples for release-note features in the maintained component set so they can be rerun in later previews. For one-off compile checks outside feature validation, use a scratch project and remove it afterward.

Do not commit downloaded SDKs, packages, build outputs, certificates, secrets, or generated assets.

## What to validate

- Build or update a sample for every feature in the release notes, even if the notes have no code snippet for it. Run each sample against the milestone build and verify the claimed behavior, such as a browser API call, an endpoint response, or an explicitly stated default or flag polarity. A successful build or startup alone is not enough.
- Test any code snippets from the release notes as part of those samples. Confirm the snippets build, run, and behave as described.
- As you update existing maintained samples to the new preview, note changes required by the new release. Document the resulting preview-to-preview breaking changes and migration steps in the release notes.

## Recording what you verified

Create `release-notes/<major>.0/samples/README.md` when adding maintained samples. Explain their purpose and record the SDK version against which all component sample sets were last validated. Update the version after validating the sets against a new SDK.

In each `<component>/README.md`, describe the component's samples, how to run them, and their expected behavior. Keep it current as the samples change.

## When a claim fails validation

Follow the escalation in
[`api-verification.md`](../release-notes/references/api-verification.md) — check the package version,
search for a rename, look for a revert, confirm the member is public. Then:

- **Fix the notes, not the sample**, when the notes describe an API that does not exist. Rewrite the
  section around what actually shipped.
- **Update the sample and document the migration** when the new release requires changes to an
  existing sample. Explain the preview-to-preview change in the notes.
- **Drop the claim** when neither holds up. A correct prose description with a PR link always beats a
  confident, wrong code sample.

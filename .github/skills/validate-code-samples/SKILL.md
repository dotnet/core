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

Keep temporary validation projects, checkers, and results in session or scratch storage by default.
Validation is required, but committing its artifacts is not.
Add or change maintained repository fixtures only when explicitly requested or already agreed in the task scope.
Existing fixtures do not authorize silent deletion or unrelated expansion.

When maintained fixtures are in scope, keep them under `release-notes/<major>.0/samples/<component>/`, for example `release-notes/11.0/samples/aspnetcore/`. These are executable fixtures primarily for verifying release notes, not a general-purpose or reader-facing samples collection. They do not replace the officially documented samples maintained by the relevant product and documentation teams.

For an agreed maintained set, use one working sample set per major release and component. Upgrade it from preview to preview so API renames, changed defaults, analyzer diagnostics, and runtime regressions surface naturally. Start each major release with a new sample set instead of copying or retargeting scenarios from the previous release. Component owners review changes to their sample set alongside the corresponding release notes.

Otherwise, use scratch copies for upgrade checks without changing repository fixtures.
Remove temporary projects when no longer needed. Keep verification records in session storage.

Do not commit downloaded SDKs, packages, build outputs, certificates, secrets, or generated assets.

## What to validate

- Validate every feature's documented claims, even without a code snippet. Build or update scratch samples unless maintained fixtures are in scope. Run applicable scenarios against the milestone build and verify the claimed behavior, such as a browser API call, an endpoint response, or an explicitly stated default or flag polarity. A successful build or startup alone is not enough.
- Test any code snippets from the release notes as part of those samples. Confirm the snippets build, run, and behave as described.
- Check source-test conditions and expected outcomes. Negative tests, skipped cases, unmet conditions, and test-only integrations do not establish shipped runtime support.
- For grouped performance changes, check representative workloads and source measurements, not one new fixture per implementation PR.
- Do not rerun unrelated benchmarks or builds for prose-only changes.
- During scratch or maintained sample upgrades, record required changes. Document the resulting preview-to-preview breaking changes and migration steps in the release notes.

## Recording what you verified

Record the exact SDK, claim, expected and observed behavior, sources, and limits in session storage.
Keep failed or unavailable checks separate from passed checks. Do not imply verification beyond the evidence.

Only when maintained samples are in scope, create or update `release-notes/<major>.0/samples/README.md`.
Explain their purpose and record the SDK version against which all component sample sets were last validated.
Update the version after validating the sets against a new SDK.

For that maintained set, keep each `<component>/README.md` current with its scenarios, run instructions, and expected behavior.

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

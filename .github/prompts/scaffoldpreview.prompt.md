# Scaffold Release Notes Folder (Preview or RC)

This prompt guides creating the next milestone release-notes folder for a .NET Preview or RC. Supply three inputs when invoking it (no file edits required between runs):

- DOTNET_VERSION (major, e.g. 10, 11)
- MILESTONE_KIND (`preview` or `rc`)
- MILESTONE_NUMBER (preview: 1–7, rc: 1–2)

Only these values should change between cycles. Keep concrete links and historical references intact unless they genuinely change.

## Runtime Derivations

Given inputs:

- Milestone Label = if MILESTONE_KIND=preview → `Preview ${MILESTONE_NUMBER}` else `RC ${MILESTONE_NUMBER}`
- Milestone Prefix = preview → `p${MILESTONE_NUMBER}` ; rc → `rc${MILESTONE_NUMBER}`
- Base Branch = `dotnet${DOTNET_VERSION}-${MilestonePrefix}`
- Target Folder = `release-notes/${DOTNET_VERSION}.0/preview/${MilestonePrefix}`

Example (not baked in): DOTNET_VERSION=10, MILESTONE_KIND=rc, MILESTONE_NUMBER=2 ⇒ Label `RC 2`, Prefix `rc2`.

## Steps

1. Navigate to `release-notes/${DOTNET_VERSION}.0/preview/`.
2. Duplicate the previous milestone folder (prior prefix → new prefix, e.g. `rc1` → `${MilestonePrefix}` or `p6` → `${MilestonePrefix}`).
3. Remove (do NOT copy):
	- `api-diff` directory (if present) – will be regenerated later.
	- `release.json` – create a fresh one if required by process.
4. For each component markdown file, update the heading and milestone label only; preserve existing anchor structure.
5. If there are no new feature items yet, insert a neutral placeholder sentence (e.g. `This ${Milestone Label} release does not introduce new ${Product} features.`) instead of a generic "Something about the feature" line. Avoid duplicating placeholder lines.
6. Run markdown lint: `npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/${DOTNET_VERSION}.0/preview/${MilestonePrefix}/*.md`.
7. Commit on the base milestone branch (`dotnet${DOTNET_VERSION}-${MilestonePrefix}`) with message: `Scaffold .NET ${DOTNET_VERSION} ${Milestone Label} release notes folder`.

## Sample File Template (aspnetcore.md – dynamic)

```markdown
# ASP.NET Core in .NET ${DOTNET_VERSION} ${Milestone Label} - Release Notes

Here's a summary of what's new in ASP.NET Core in this release (add or remove sections as needed).

ASP.NET Core updates in .NET ${DOTNET_VERSION}:

- [What's new in ASP.NET Core in .NET ${DOTNET_VERSION}](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-${DOTNET_VERSION}.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/${DOTNET_VERSION}.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

This ${Milestone Label} release does not contain new ASP.NET Core feature additions.
```

## Conventions (stable across milestones)

- Top-level heading: `# <Product> in .NET <Major> <Milestone Label> - Release Notes`
- Use sentence case for section headings after the H1.
- Keep relative links; avoid hardcoding version unless the doc page is versioned (as above for 10.0 links).
- One blank line between blocks; file ends with a newline.

## After Scaffolding

- Proceed with per-file PR creation using the separate PR creation prompt.
- Do not add real feature text until component owners update their individual PRs.
- Run a Prettier check if any JSON metadata was added: `npx prettier --check "release-notes/${DOTNET_VERSION}.0/**/*.json"`.

No file edits needed between milestones—provide inputs at execution. Leave roadmap issue numbers unless they genuinely change upstream.

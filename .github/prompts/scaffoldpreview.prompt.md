# Scaffold Preview Release Notes Folder

This prompt guides creating the next `.NET Preview` release-notes folder with only the core files needed to start milestone work.

Supply two inputs when invoking it (no file edits required between runs):

- DOTNET_VERSION (major, e.g. 10, 11)
- PREVIEW_NUMBER (1–7)

Only these values should change between cycles. Keep concrete links and historical references intact unless they genuinely change.

## Runtime derivations

Given inputs:

- Milestone Label = `Preview ${PREVIEW_NUMBER}`
- Folder Name = `preview${PREVIEW_NUMBER}`
- Base Branch = `dotnet${DOTNET_VERSION}-p${PREVIEW_NUMBER}`
- Target Folder = `release-notes/${DOTNET_VERSION}.0/preview/preview${PREVIEW_NUMBER}`
- Main Release File = `${DOTNET_VERSION}.0.0-preview.${PREVIEW_NUMBER}.md`

Example (not baked in): DOTNET_VERSION=10, PREVIEW_NUMBER=7 ⇒ folder `preview7`, main file `10.0.0-preview.7.md`.

## Steps

1. Navigate to `release-notes/${DOTNET_VERSION}.0/preview/`.
1. Create `preview${PREVIEW_NUMBER}` if it does not exist.
1. Scaffold only these files in that folder:
   - `${DOTNET_VERSION}.0.0-preview.${PREVIEW_NUMBER}.md`
   - `README.md`
1. Do not scaffold or copy `api-diff` or `release.json`.
1. In the new folder `README.md`, update heading text, milestone label, and the link to:
   - `./${DOTNET_VERSION}.0.0-preview.${PREVIEW_NUMBER}.md`
1. Update the preview root README at `release-notes/${DOTNET_VERSION}.0/preview/README.md` by adding one row for the new preview release linking to `./preview${PREVIEW_NUMBER}/README.md`.
1. Update the version README at `release-notes/${DOTNET_VERSION}.0/README.md`:
   - Add a new row for `Preview ${PREVIEW_NUMBER}` pointing at `preview/preview${PREVIEW_NUMBER}/README.md`.
1. Run markdown lint:
   - `npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/${DOTNET_VERSION}.0/preview/preview${PREVIEW_NUMBER}/*.md`
   - `npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/${DOTNET_VERSION}.0/preview/README.md`
   - `npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/${DOTNET_VERSION}.0/README.md`
1. Commit on branch `dotnet${DOTNET_VERSION}-p${PREVIEW_NUMBER}` with message: `Scaffold .NET ${DOTNET_VERSION} Preview ${PREVIEW_NUMBER} release notes folder`.

## Main file template (${DOTNET_VERSION}.0.0-preview.${PREVIEW_NUMBER}.md)

- Start from the previous preview's main release markdown file and update only version/milestone-specific values.
- Keep existing structure and anchors unless they are invalid for the new preview.

## Folder README template (dynamic)

```markdown
# .NET ${DOTNET_VERSION} Preview ${PREVIEW_NUMBER} - Release Notes

.NET ${DOTNET_VERSION} Preview ${PREVIEW_NUMBER} release notes:

- [Main release notes](./${DOTNET_VERSION}.0.0-preview.${PREVIEW_NUMBER}.md)
```

## Conventions

- Keep links relative where possible.
- Preserve one blank line between markdown blocks.
- Ensure files end with a newline.

No file edits needed between milestones—provide inputs at execution.

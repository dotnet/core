# .NET Core Repository (dotnet/core)

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

This is the official .NET release notes and announcements repository. It is NOT a buildable codebase repository - it contains documentation, release notes, and metadata about .NET releases. You do not build applications here; you maintain release documentation and validate content.

## Working Effectively

### Initial Setup

Set up the validation tools needed for this documentation repository:

```bash
npm install markdownlint-cli markdown-link-check prettier
pip install checkov
```

### Validation Commands

Always run these validation commands before committing changes. All commands have been tested and work correctly:

1. **Markdown linting** (takes ~1 second):

   ```bash
   npx markdownlint --config .github/linters/.markdown-lint.yml *.md
   npx markdownlint --config .github/linters/.markdown-lint.yml release-notes/**/*.md
   ```

2. **Link checking** (takes 30-180 seconds depending on external links - NEVER CANCEL):

   ```bash
   npx markdown-link-check --config .github/workflows/markdown-link-check-config.json README.md
   npx markdown-link-check --config .github/workflows/markdown-link-check-config.json [specific-file].md
   ```

   TIMEOUT WARNING: Set timeout to 5+ minutes for link checking. External links may be slow or blocked by network restrictions.

3. **Security scanning with checkov** (takes ~38 seconds):

   ```bash
   checkov --config-file .checkov.yml --directory . --quiet
   ```

4. **Format checking with prettier** (takes ~5 seconds):

   ```bash
   npx prettier --check --ignore-path .prettierignore .
   ```

   Note: This will show format warnings for most files but will not fail. Format fixing is typically not required unless specifically requested.

### Git Operations

Standard git workflow for documentation changes:

```bash
git --no-pager status
git --no-pager diff
git add [specific-files]
git commit -m "Descriptive commit message"
git push origin [branch-name]
```

## Repository Structure

### Key Directories

- `/release-notes/` - Version-specific release notes organized by major version (8.0/, 9.0/, 10.0/, etc.)
  - Each version has `releases.json`, `supported-os.json`, and markdown files for specific releases
  - `/release-notes/schemas/` - JSON schemas for release metadata
  - `/release-notes/templates/` - Templates for new release notes
- `/Documentation/` - General documentation about .NET Core ecosystem and policies
- `/.github/workflows/` - GitHub Actions for validation (super-linter, markdown-link-check, etc.)
- Root level - Policy documents, README, CONTRIBUTING, and support information

### Important Files

- `README.md` - Main repository landing page with current release information
- `releases.md` - Release schedule and support information
- `release-policies.md` - .NET release and support policies
- `release-notes/releases-index.json` - Master index of all .NET releases
- `CONTRIBUTING.md` - Links to actual contribution guidelines in dotnet/runtime

### Copilot Skills

This repository defines Copilot skills in `/.github/skills/`. Before performing any task, check if a matching skill exists and follow its process. Current skills:

- `libraries-release-notes` - Generate .NET Libraries release notes for a preview release

## Common Tasks

### Adding New Release Notes

1. Navigate to appropriate version directory in `/release-notes/[version]/`
2. Create new markdown file following existing naming convention (e.g., `9.0.8.md`)
3. Update `releases.json` with new release metadata
4. Update root `README.md` if this is a latest patch version
5. Run all validation commands
6. Check that links work and markdown is properly formatted

### Updating Release Metadata

Release metadata is stored in JSON files:

- `release-notes/releases-index.json` - Master index
- `release-notes/[version]/releases.json` - Version-specific releases
- `release-notes/[version]/supported-os.json` - Supported operating systems

Always validate JSON syntax and schema compliance after edits.

### Updating Documentation

1. Edit markdown files in `/Documentation/` or root level
2. Run markdown linting: `npx markdownlint --config .github/linters/.markdown-lint.yml [file]`
3. Check links: `npx markdown-link-check --config .github/workflows/markdown-link-check-config.json [file]`
4. Verify changes don't break existing navigation or references

## Validation Requirements

### Before Every Commit

Always run these validation steps in order:

1. Markdown linting (must pass without errors)
2. Link checking (external links may fail due to network restrictions - this is acceptable)
3. Security scanning with checkov (must pass)
4. Format checking (warnings are acceptable)

### Manual Validation Scenarios

Since this is a documentation repository, manual validation involves:

1. **Link verification**: Navigate to updated pages and verify internal links work
2. **Content accuracy**: Ensure release notes match actual .NET releases
3. **JSON schema validation**: Ensure metadata files follow required schema
4. **Cross-reference checking**: Verify links between release notes and main README are consistent

### CI/CD Integration

The repository uses GitHub Actions workflows:

- `.github/workflows/super-linter.yml` - Runs comprehensive linting
- `.github/workflows/markdown-link-check.yml` - Validates markdown links
- All other workflow files are for issue/PR labeling automation

## Timing Expectations

| Command               | Expected Time  | Timeout Setting |
| --------------------- | -------------- | --------------- |
| markdownlint          | 1 second       | 30 seconds      |
| markdown-link-check   | 30-180 seconds | 5+ minutes      |
| checkov security scan | 38 seconds     | 2 minutes       |
| prettier format check | 5 seconds      | 30 seconds      |

NEVER CANCEL these commands early. Network-dependent operations like link checking may take longer than expected.

## Troubleshooting

### Common Issues

1. **JSON syntax errors**: Use a JSON validator before committing changes to .json files
2. **Broken internal links**: Verify relative paths are correct and files exist
3. **External link failures**: These are often due to network restrictions and may be acceptable
4. **Markdown formatting**: Follow existing patterns in similar files
5. **Schema validation failures**: Ensure JSON metadata follows schemas in `/release-notes/schemas/`

### Network Restrictions

Some external links may fail during link checking due to network restrictions in CI environments. This is expected and acceptable as long as internal links work correctly.

## Related Repositories

This repository links to many other .NET repositories:

- `dotnet/runtime` - Core .NET runtime and libraries
- `dotnet/sdk` - .NET SDK
- `dotnet/aspnetcore` - ASP.NET Core
- See `Documentation/core-repos.md` for complete list

Do not attempt to build, run, or test code here. This repository contains only documentation and metadata about the .NET ecosystem.

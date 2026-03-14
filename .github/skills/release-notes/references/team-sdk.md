# .NET SDK Team Release Notes Context

Team-specific overrides for generating .NET SDK release notes.

## PR Discovery

**Overrides the default label-based approach** in [collect-prs.md](collect-prs.md).

- **Repo**: `dotnet/dotnet`
- focus on PRs that touch the `src/sdk` path, especially those that are codeflow-related or modify/revert SDK code directly in the VMR.

## Content Rules

use the strategies outlined in the dotnet/sdk's .github/skills/generate-release-notes for team-specific guidance on what to include, how to categorize, and how to format entries.

## Sanity-checking PR candidates

VMR branches are the final source of truth - use the VMR to determine candidate SDK PRs for inclusion, even if they don't have the expected labels or aren't linked to the expected milestones. Spot-check that candidate PRs actually shipped in the target preview by verifying their presence in the VMR branch for the preview or release selected.

Once candidates are identified, cross-reference with the dotnet/sdk repo for PR details, linked issues, and design documents.

When getting candidates, ensure that the changes are _only_ in this release - they should not have been included in previous previews. Use the previous release notes for the SDK to check for this, as well as the previous-release' VMR branch.
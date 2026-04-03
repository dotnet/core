---
description: GitHub Agentic Workflows (gh-aw) - Create, debug, and upgrade AI-powered workflows with intelligent prompt routing
disable-model-invocation: true
---

# GitHub Agentic Workflows Agent

This agent helps you work with **GitHub Agentic Workflows (gh-aw)**, a CLI extension for creating AI-powered workflows in natural language using markdown files.

## What This Agent Does

This is a **dispatcher agent** that routes your request to the appropriate specialized prompt based on your task:

- **Creating new workflows**: Routes to `create` prompt
- **Updating existing workflows**: Routes to `update` prompt
- **Debugging workflows**: Routes to `debug` prompt  
- **Upgrading workflows**: Routes to `upgrade-agentic-workflows` prompt
- **Creating report-generating workflows**: Routes to `report` prompt — consult this whenever the workflow posts status updates, audits, analyses, or any structured output as issues, discussions, or comments
- **Creating shared components**: Routes to `create-shared-agentic-workflow` prompt
- **Fixing Dependabot PRs**: Routes to `dependabot` prompt — use this when Dependabot opens PRs that modify generated manifest files (`.github/workflows/package.json`, `.github/workflows/requirements.txt`, `.github/workflows/go.mod`). Never merge those PRs directly; instead update the source `.md` files and rerun `gh aw compile --dependabot` to bundle all fixes
- **Analyzing test coverage**: Routes to `test-coverage` prompt — consult this whenever the workflow reads, analyzes, or reports on test coverage data from PRs or CI runs

Workflows may optionally include:

- **Project tracking / monitoring** (GitHub Projects updates, status reporting)
- **Orchestration / coordination** (one workflow assigning agents or dispatching and coordinating other workflows)

## Files This Applies To

- Workflow files: `.github/workflows/*.md` and `.github/workflows/**/*.md`
- Workflow lock files: `.github/workflows/*.lock.yml`
- Shared components: `.github/workflows/shared/*.md`
- Configuration: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/github-agentic-workflows.md

## Problems This Solves

- **Workflow Creation**: Design secure, validated agentic workflows with proper triggers, tools, and permissions
- **Workflow Debugging**: Analyze logs, identify missing tools, investigate failures, and fix configuration issues
- **Version Upgrades**: Migrate workflows to new gh-aw versions, apply codemods, fix breaking changes
- **Component Design**: Create reusable shared workflow components that wrap MCP servers

## How to Use

When you interact with this agent, it will:

1. **Understand your intent** - Determine what kind of task you're trying to accomplish
2. **Route to the right prompt** - Load the specialized prompt file for your task
3. **Execute the task** - Follow the detailed instructions in the loaded prompt

## Available Prompts

### Create New Workflow
**Load when**: User wants to create a new workflow from scratch, add automation, or design a workflow that doesn't exist yet

**Prompt file**: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/create-agentic-workflow.md

**Use cases**:
- "Create a workflow that triages issues"
- "I need a workflow to label pull requests"
- "Design a weekly research automation"

### Update Existing Workflow  
**Load when**: User wants to modify, improve, or refactor an existing workflow

**Prompt file**: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/update-agentic-workflow.md

**Use cases**:
- "Add web-fetch tool to the issue-classifier workflow"
- "Update the PR reviewer to use discussions instead of issues"
- "Improve the prompt for the weekly-research workflow"

### Debug Workflow  
**Load when**: User needs to investigate, audit, debug, or understand a workflow, troubleshoot issues, analyze logs, or fix errors

**Prompt file**: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/debug-agentic-workflow.md

**Use cases**:
- "Why is this workflow failing?"
- "Analyze the logs for workflow X"
- "Investigate missing tool calls in run #12345"

### Upgrade Agentic Workflows
**Load when**: User wants to upgrade workflows to a new gh-aw version or fix deprecations

**Prompt file**: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/upgrade-agentic-workflows.md

**Use cases**:
- "Upgrade all workflows to the latest version"
- "Fix deprecated fields in workflows"
- "Apply breaking changes from the new release"

### Create a Report-Generating Workflow
**Load when**: The workflow being created or updated produces reports — recurring status updates, audit summaries, analyses, or any structured output posted as a GitHub issue, discussion, or comment

**Prompt file**: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/report.md

**Use cases**:
- "Create a weekly CI health report"
- "Post a daily security audit to Discussions"
- "Add a status update comment to open PRs"

### Create Shared Agentic Workflow
**Load when**: User wants to create a reusable workflow component or wrap an MCP server

**Prompt file**: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/create-shared-agentic-workflow.md

**Use cases**:
- "Create a shared component for Notion integration"
- "Wrap the Slack MCP server as a reusable component"
- "Design a shared workflow for database queries"

### Fix Dependabot PRs
**Load when**: User needs to close or fix open Dependabot PRs that update dependencies in generated manifest files (`.github/workflows/package.json`, `.github/workflows/requirements.txt`, `.github/workflows/go.mod`)

**Prompt file**: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/dependabot.md

**Use cases**:
- "Fix the open Dependabot PRs for npm dependencies"
- "Bundle and close the Dependabot PRs for workflow dependencies"
- "Update @playwright/test to fix the Dependabot PR"

### Analyze Test Coverage
**Load when**: The workflow reads, analyzes, or reports test coverage — whether triggered by a PR, a schedule, or a slash command. Always consult this prompt before designing the coverage data strategy.

**Prompt file**: https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/test-coverage.md

**Use cases**:
- "Create a workflow that comments coverage on PRs"
- "Analyze coverage trends over time"
- "Add a coverage gate that blocks PRs below a threshold"

## Instructions

When a user interacts with you:

1. **Identify the task type** from the user's request
2. **Load the appropriate prompt** from the GitHub repository URLs listed above
3. **Follow the loaded prompt's instructions** exactly
4. **If uncertain**, ask clarifying questions to determine the right prompt

## Quick Reference

```bash
# Initialize repository for agentic workflows
gh aw init

# Generate the lock file for a workflow
gh aw compile [workflow-name]

# Debug workflow runs
gh aw logs [workflow-name]
gh aw audit <run-id>

# Upgrade workflows
gh aw fix --write
gh aw compile --validate
```

## Key Features of gh-aw

- **Natural Language Workflows**: Write workflows in markdown with YAML frontmatter
- **AI Engine Support**: Copilot, Claude, Codex, or custom engines
- **MCP Server Integration**: Connect to Model Context Protocol servers for tools
- **Safe Outputs**: Structured communication between AI and GitHub API
- **Strict Mode**: Security-first validation and sandboxing
- **Shared Components**: Reusable workflow building blocks
- **Repo Memory**: Persistent git-backed storage for agents
- **Sandboxed Execution**: All workflows run in the Agent Workflow Firewall (AWF) sandbox, enabling full `bash` and `edit` tools by default

## Important Notes

- Always reference the instructions file at https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/github-agentic-workflows.md for complete documentation
- Use the MCP tool `agentic-workflows` when running in GitHub Copilot Cloud
- Workflows must be compiled to `.lock.yml` files before running in GitHub Actions
- **Bash tools are enabled by default** - Don't restrict bash commands unnecessarily since workflows are sandboxed by the AWF
- Follow security best practices: minimal permissions, explicit network access, no template injection
- **Network configuration**: Use ecosystem identifiers (`node`, `python`, `go`, etc.) or explicit FQDNs in `network.allowed`. Bare shorthands like `npm` or `pypi` are **not** valid. See https://github.com/github/gh-aw/blob/v0.65.6/.github/aw/network.md for the full list of valid ecosystem identifiers and domain patterns.
- **Single-file output**: When creating a workflow, produce exactly **one** workflow `.md` file. Do not create separate documentation files (architecture docs, runbooks, usage guides, etc.). If documentation is needed, add a brief `## Usage` section inside the workflow file itself.

## Repository-Specific Requirements: Copilot PAT Pool

**⚠️ MANDATORY**: Every agentic workflow in this repository **must** include the `select-copilot-pat` integration. This selects a random Copilot PAT from a numbered pool of secrets to avoid rate-limiting from a single shared PAT. This is a stop-gap workaround until organization-level billing is offered for agentic workflows.

These elements are **not supported through imports**, so they must be copied into the frontmatter of every agentic workflow. See `.github/actions/select-copilot-pat/README.md` for full documentation and `.github/workflows/copilot-echo.md` for a working example.

When **creating** or **updating** an agentic workflow, always include the following three frontmatter blocks. These go between the `---` markers alongside the workflow's other frontmatter (permissions, safe-outputs, etc.).

### Comment block (placed before the steps, inside the `on:` block)

Always include this comment block before the steps to explain the PAT pool override:

```yaml
# ###############################################################
# Override the COPILOT_GITHUB_TOKEN secret usage for the workflow
# with a randomly-selected token from a pool of secrets.
#
# As soon as organization-level billing is offered for Agentic
# Workflows, this stop-gap approach will be removed.
#
# See: /.github/actions/select-copilot-pat/README.md
# ###############################################################
```

### Block 1: Pre-activation steps (nested under `on:`)

Add this under the `on:` key, at the same level as the trigger configuration, immediately after the comment block above:

```yaml
  # Add the pre-activation step of selecting a random PAT from the supplied secrets
  steps:
    - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      name: Checkout the select-copilot-pat action folder
      with:
        persist-credentials: false
        sparse-checkout: .github/actions/select-copilot-pat
        sparse-checkout-cone-mode: true
        fetch-depth: 1

    - id: select-copilot-pat
      name: Select Copilot token from pool
      uses: ./.github/actions/select-copilot-pat
      env:
        SECRET_0: ${{ secrets.COPILOT_PAT_0 }}
        SECRET_1: ${{ secrets.COPILOT_PAT_1 }}
        SECRET_2: ${{ secrets.COPILOT_PAT_2 }}
        SECRET_3: ${{ secrets.COPILOT_PAT_3 }}
        SECRET_4: ${{ secrets.COPILOT_PAT_4 }}
        SECRET_5: ${{ secrets.COPILOT_PAT_5 }}
        SECRET_6: ${{ secrets.COPILOT_PAT_6 }}
        SECRET_7: ${{ secrets.COPILOT_PAT_7 }}
        SECRET_8: ${{ secrets.COPILOT_PAT_8 }}
        SECRET_9: ${{ secrets.COPILOT_PAT_9 }}
```

### Block 2: Pre-activation job outputs (top-level `jobs:`)

```yaml
jobs:
  pre-activation:
    outputs:
      copilot_pat_number: ${{ steps.select-copilot-pat.outputs.copilot_pat_number }}
```

### Block 3: Engine configuration with PAT override (top-level `engine:`)

```yaml
engine:
  id: copilot
  env:
    # We cannot use line breaks in this expression as it leads to a syntax error in the compiled workflow
    # If none of the `COPILOT_PAT_#` secrets were selected, then the default COPILOT_GITHUB_TOKEN is used
    COPILOT_GITHUB_TOKEN: ${{ case(needs.pre_activation.outputs.copilot_pat_number == '0', secrets.COPILOT_PAT_0, needs.pre_activation.outputs.copilot_pat_number == '1', secrets.COPILOT_PAT_1, needs.pre_activation.outputs.copilot_pat_number == '2', secrets.COPILOT_PAT_2, needs.pre_activation.outputs.copilot_pat_number == '3', secrets.COPILOT_PAT_3, needs.pre_activation.outputs.copilot_pat_number == '4', secrets.COPILOT_PAT_4, needs.pre_activation.outputs.copilot_pat_number == '5', secrets.COPILOT_PAT_5, needs.pre_activation.outputs.copilot_pat_number == '6', secrets.COPILOT_PAT_6, needs.pre_activation.outputs.copilot_pat_number == '7', secrets.COPILOT_PAT_7, needs.pre_activation.outputs.copilot_pat_number == '8', secrets.COPILOT_PAT_8, needs.pre_activation.outputs.copilot_pat_number == '9', secrets.COPILOT_PAT_9, secrets.COPILOT_GITHUB_TOKEN) }}
```

**Important notes about the engine block:**
- The `COPILOT_GITHUB_TOKEN` `case()` expression **must** remain on a single line — line breaks cause syntax errors in the compiled workflow.
- If no `COPILOT_PAT_#` secrets are configured, the expression falls back to the default `COPILOT_GITHUB_TOKEN` secret.
- Do **not** specify `engine: copilot` as a simple string — use the object form shown above so the `env:` override can be included.

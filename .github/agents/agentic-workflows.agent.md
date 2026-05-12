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
- **CLI commands and triggering workflows**: Routes to `cli-commands` guide — consult this whenever the user asks how to run, compile, debug, or manage workflows from the command line, or when they need the MCP tool equivalent of a `gh aw` command

Workflows may optionally include:

- **Project tracking / monitoring** (GitHub Projects updates, status reporting)
- **Orchestration / coordination** (one workflow assigning agents or dispatching and coordinating other workflows)

## Files This Applies To

- Workflow files: `.github/workflows/*.md` and `.github/workflows/**/*.md`
- Workflow lock files: `.github/workflows/*.lock.yml`
- Shared components: `.github/workflows/shared/*.md`
- Configuration: [github-agentic-workflows.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/github-agentic-workflows.md)

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

**Prompt file**: [create-agentic-workflow.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/create-agentic-workflow.md)

**Use cases**:

- "Create a workflow that triages issues"
- "I need a workflow to label pull requests"
- "Design a weekly research automation"

### Update Existing Workflow  

**Load when**: User wants to modify, improve, or refactor an existing workflow

**Prompt file**: [update-agentic-workflow.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/update-agentic-workflow.md)

**Use cases**:

- "Add web-fetch tool to the issue-classifier workflow"
- "Update the PR reviewer to use discussions instead of issues"
- "Improve the prompt for the weekly-research workflow"

### Debug Workflow  

**Load when**: User needs to investigate, audit, debug, or understand a workflow, troubleshoot issues, analyze logs, or fix errors

**Prompt file**: [debug-agentic-workflow.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/debug-agentic-workflow.md)

**Use cases**:

- "Why is this workflow failing?"
- "Analyze the logs for workflow X"
- "Investigate missing tool calls in run #12345"

### Upgrade Agentic Workflows

**Load when**: User wants to upgrade workflows to a new gh-aw version or fix deprecations

**Prompt file**: [upgrade-agentic-workflows.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/upgrade-agentic-workflows.md)

**Use cases**:

- "Upgrade all workflows to the latest version"
- "Fix deprecated fields in workflows"
- "Apply breaking changes from the new release"

### Create a Report-Generating Workflow

**Load when**: The workflow being created or updated produces reports — recurring status updates, audit summaries, analyses, or any structured output posted as a GitHub issue, discussion, or comment

**Prompt file**: [report.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/report.md)

**Use cases**:

- "Create a weekly CI health report"
- "Post a daily security audit to Discussions"
- "Add a status update comment to open PRs"

### Create Shared Agentic Workflow

**Load when**: User wants to create a reusable workflow component or wrap an MCP server

**Prompt file**: [create-shared-agentic-workflow.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/create-shared-agentic-workflow.md)

**Use cases**:

- "Create a shared component for Notion integration"
- "Wrap the Slack MCP server as a reusable component"
- "Design a shared workflow for database queries"

### Fix Dependabot PRs

**Load when**: User needs to close or fix open Dependabot PRs that update dependencies in generated manifest files (`.github/workflows/package.json`, `.github/workflows/requirements.txt`, `.github/workflows/go.mod`)

**Prompt file**: [dependabot.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/dependabot.md)

**Use cases**:

- "Fix the open Dependabot PRs for npm dependencies"
- "Bundle and close the Dependabot PRs for workflow dependencies"
- "Update @playwright/test to fix the Dependabot PR"

### Analyze Test Coverage

**Load when**: The workflow reads, analyzes, or reports test coverage — whether triggered by a PR, a schedule, or a slash command. Always consult this prompt before designing the coverage data strategy.

**Prompt file**: [test-coverage.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/test-coverage.md)

**Use cases**:

- "Create a workflow that comments coverage on PRs"
- "Analyze coverage trends over time"
- "Add a coverage gate that blocks PRs below a threshold"

### CLI Commands Reference

**Load when**: The user asks how to run, compile, debug, or manage workflows from the command line; needs the MCP tool equivalent of a `gh aw` command; or is in a restricted environment (e.g., Copilot Cloud) without direct CLI access.

**Reference file**: [cli-commands.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/cli-commands.md)

**Use cases**:

- "How do I trigger workflow X on the main branch?"
- "What's the MCP equivalent of `gh aw logs`?"
- "I'm in Copilot Cloud — how do I compile a workflow?"
- "Show me all available gh aw commands"

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

# Trigger a workflow on demand (preferred over gh workflow run)
gh aw run <workflow-name>             # interactive input collection
gh aw run <workflow-name> --ref main  # run on a specific branch

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

- Always reference the instructions file at [github-agentic-workflows.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/github-agentic-workflows.md) for complete documentation
- Use the MCP tool `agentic-workflows` when running in GitHub Copilot Cloud
- Workflows must be compiled to `.lock.yml` files before running in GitHub Actions
- **Bash tools are enabled by default** - Don't restrict bash commands unnecessarily since workflows are sandboxed by the AWF
- Follow security best practices: minimal permissions, explicit network access, no template injection
- **Network configuration**: Use ecosystem identifiers (`node`, `python`, `go`, etc.) or explicit FQDNs in `network.allowed`. Bare shorthands like `npm` or `pypi` are **not** valid. See [network.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/network.md) for the full list of valid ecosystem identifiers and domain patterns.
- **Single-file output**: When creating a workflow, produce exactly **one** workflow `.md` file. Do not create separate documentation files (architecture docs, runbooks, usage guides, etc.). If documentation is needed, add a brief `## Usage` section inside the workflow file itself.
- **Triggering runs**: Always use `gh aw run <workflow-name>` to trigger a workflow on demand — not `gh workflow run <file>.lock.yml`. `gh aw run` handles workflow resolution by short name, input parsing and validation, and correct run-tracking for agentic workflows. Use `--ref <branch>` to run on a specific branch.
- **CLI commands reference**: For a complete guide on all `gh aw` commands and their MCP tool equivalents (for restricted environments), see [cli-commands.md](https://github.com/github/gh-aw/blob/v0.71.5/.github/aw/cli-commands.md)
- **Repository-specific requirements**: There are multiple sets of repository-specific instructions below that must be respected. They affect workflow authoring, updates, compilation, and reviews.

## Repository-Specific Requirements: Copilot PAT Pool

**⚠️ MANDATORY**: Every agentic workflow in this repository **must** utilize the Copilot PAT Pool as detailed in `.github/workflows/shared/pat_pool.README.md`. This mechanism selects a random Copilot PAT from a numbered pool of secrets to avoid rate-limiting from a single shared PAT.

When **creating** or **updating** an agentic workflow, always include the following frontmatter that integrates the PAT pool. This should be used verbatim when first added.

```yml
# ###############################################################
# Override COPILOT_GITHUB_TOKEN with a random PAT from the pool.
# This stop-gap will be removed when org billing is available.
# See: .github/workflows/shared/pat_pool.README.md for more info.
# ###############################################################
imports:
  - shared/pat_pool.md

engine:
  id: copilot
  env:
    COPILOT_GITHUB_TOKEN: ${{ case(needs.pat_pool.outputs.pat_number == '0', secrets.COPILOT_PAT_0, needs.pat_pool.outputs.pat_number == '1', secrets.COPILOT_PAT_1, needs.pat_pool.outputs.pat_number == '2', secrets.COPILOT_PAT_2, needs.pat_pool.outputs.pat_number == '3', secrets.COPILOT_PAT_3, needs.pat_pool.outputs.pat_number == '4', secrets.COPILOT_PAT_4, needs.pat_pool.outputs.pat_number == '5', secrets.COPILOT_PAT_5, needs.pat_pool.outputs.pat_number == '6', secrets.COPILOT_PAT_6, needs.pat_pool.outputs.pat_number == '7', secrets.COPILOT_PAT_7, needs.pat_pool.outputs.pat_number == '8', secrets.COPILOT_PAT_8, needs.pat_pool.outputs.pat_number == '9', secrets.COPILOT_PAT_9, secrets.COPILOT_GITHUB_TOKEN) }}
```

When the workflow is being updated by hand, the `engine.env.COPILOT_GITHUB_TOKEN` may be reformatted to use a multi-line YAML string for the expression if desired for improved readability.

If other `engine` properties are customized for the workflow, that customization will need to be added into this same `engine` block and hand-editing can rearrange the PAT pool frontmatter and comment for ideal maintainability.

## Repository-Specific Requirements: Schedule Seed

When compiling a workflow that uses **fuzzy scheduling** (e.g., `schedule: weekly on monday around 9:00`), or when recompiling all workflows, always pass the `--schedule-seed` flag with this repository's identity:

```bash
# Single workflow with fuzzy scheduling
gh aw compile .github/workflows/<name>.md --schedule-seed dotnet/core

# Recompile all workflows
gh aw compile --schedule-seed dotnet/core
```

The schedule seed ensures fuzzy schedule times are deterministic for this repository — the same seed always produces the same cron offsets, preventing unnecessary lock file churn across compilations. By default, `gh aw compile` assumes an 'origin' remote or a single remote; by specifying the `--schedule-seed` repo, the times are calculated correctly even when working against a fork or with the remote named differently.

## Repository-Specific Requirements: Frontmatter Ordering

When **creating** or **updating** an agentic workflow's frontmatter, follow this ordering convention. This keeps security-sensitive configuration at the top where it's most visible to maintainers and reviewers, and groups the PAT pool boilerplate at the bottom where it stays out of the way.

### Frontmatter section ordering

Arrange top-level frontmatter keys in this order within the `---` markers:

1. **Descriptive** — `id`, `name`, `description`, etc.
2. **Security** — `permissions`, `safe_outputs`, `network`, `roles`, etc.
3. **Environment** — `resources`, `dependencies`, `runtimes`, `features`, environment variables, `services`, `container`, `checkout`, etc.
4. **Execution** — conditions (`if`), `concurrency`, `bots`/`skip-bots`, triggers (`on`), `jobs`, `engine`, etc.

The PAT pool integration naturally falls into the **Execution** group at the bottom. Keep the PAT pool content together as the last items in the frontmatter.

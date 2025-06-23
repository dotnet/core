# Issue-Labeler Workflows

This repository uses actions from [dotnet/issue-labeler](https://github.com/dotnet/issue-labeler) to predict area labels for issues and pull requests.

The following workflow templates were imported and updated from [dotnet/.github/workflow-templates](https://github.com/dotnet/.github/tree/main/workflow-templates) using
GitHub's UI for adding new workflows. Issue Labeler [Onboarding](https://github.com/dotnet/issue-labeler/wiki/Onboarding) was referenced for the configurations.

1. `labeler-train.yml`
2. `labeler-promote.yml`
3. `labeler-predict-issues.yml`
4. `labeler-cache-retention.yml`

## Repository Configuration

Across these workflows, the following changes were made to configure the issue labeler for this repository:

1. Set `LABEL_PREFIX` to `"area-"`:
    - `labeler-predict-issues.yml`
    - `labeler-train.yml`
2. Set the `DEFAULT_LABEL` value to `"needs-area-label"` to apply a default label when no prediction is made.
    - `labeler-predict-issues.yml`
3. Remove the `EXCLUDED_AUTHORS` value as we do not bypass labeling for any authors' issues/pulls in this repository:
    - `labeler-predict-issues.yml`
    - `labeler-train.yml`
4. Remove the `repository` input for training the models against another repository:
    - `labeler-train.yml`
5. Update the cache retention cron schedule to an arbitrary time of day:
    - `labeler-cache-retention.yml`
6. Remove configuration, inputs, and jobs related to pull requests, as we will only predict labels for issues in this repository:
    - `labeler-train.yml`
    - `labeler-promote.yml`
    - `labeler-cache-retention.yml`

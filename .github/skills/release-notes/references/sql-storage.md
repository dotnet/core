# SQL Schema and Patterns

Use the SQL tool for all structured data storage during the release notes pipeline. Do **not** write intermediate files to disk.

## Core tables

```sql
CREATE TABLE vmr_files (
    path TEXT PRIMARY KEY,
    component TEXT,            -- mapped component name (e.g., 'Libraries', 'Runtime')
    status TEXT,               -- 'added', 'modified', 'removed'
    additions INTEGER DEFAULT 0,
    deletions INTEGER DEFAULT 0
);

CREATE TABLE vmr_commits (
    sha TEXT PRIMARY KEY,
    component TEXT,
    source_repo TEXT,          -- e.g., 'dotnet/runtime'
    source_pr_number INTEGER,
    message TEXT
);

CREATE TABLE prs (
    number INTEGER NOT NULL,
    repo TEXT NOT NULL,         -- e.g., 'dotnet/runtime'
    component TEXT,            -- assigned component
    title TEXT,
    author TEXT,
    author_association TEXT,
    labels TEXT,               -- comma-separated label names
    merged_at TEXT,
    body TEXT,
    reactions INTEGER DEFAULT 0,
    vmr_confirmed INTEGER DEFAULT 0,   -- 1 if confirmed in VMR release branch
    is_candidate INTEGER DEFAULT 0,
    exclusion_reason TEXT,
    is_preview_feedback_fix INTEGER DEFAULT 0,
    feedback_issue_number INTEGER,
    feedback_issue_reactions INTEGER,
    feedback_issue_comments INTEGER,
    feedback_reporter TEXT,
    PRIMARY KEY (number, repo)
);

CREATE TABLE issues (
    number INTEGER NOT NULL,
    repo TEXT NOT NULL,
    title TEXT,
    body TEXT,
    labels TEXT,
    author TEXT,
    created_at TEXT,
    reactions INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    pr_number INTEGER,
    pr_repo TEXT,
    PRIMARY KEY (number, repo)
);

CREATE TABLE reviewers (
    github_login TEXT NOT NULL,
    role TEXT NOT NULL,          -- 'author', 'assignee', 'merged_by', 'coauthor'
    pr_number INTEGER NOT NULL,
    pr_repo TEXT NOT NULL,
    component TEXT,
    area_labels TEXT,
    PRIMARY KEY (github_login, role, pr_number, pr_repo)
);
```

## Common queries

### VMR change summary by component

```sql
SELECT component,
       COUNT(*) AS file_count,
       SUM(additions) AS total_additions,
       SUM(deletions) AS total_deletions
FROM vmr_files
WHERE component IS NOT NULL
GROUP BY component
ORDER BY SUM(additions + deletions) DESC;
```

### Candidate PRs by component

```sql
SELECT * FROM prs
WHERE is_candidate = 1 AND vmr_confirmed = 1
ORDER BY component, merged_at;
```

### Popularity ranking within a component

```sql
SELECT p.number, p.repo, p.title, p.reactions,
       COALESCE(SUM(i.reactions), 0) AS issue_reactions,
       p.reactions + COALESCE(SUM(i.reactions), 0) AS total_reactions
FROM prs p
LEFT JOIN issues i ON i.pr_number = p.number AND i.pr_repo = p.repo
WHERE p.is_candidate = 1 AND p.component = '<component>'
GROUP BY p.number, p.repo
ORDER BY total_reactions DESC;
```

### PRs not confirmed in VMR

```sql
SELECT number, repo, title, exclusion_reason
FROM prs
WHERE vmr_confirmed = 0 AND exclusion_reason IS NOT NULL
ORDER BY repo, number;
```

### Preview feedback fixes ranked by signal

```sql
SELECT p.number, p.repo, p.component, p.title, p.feedback_reporter,
       p.feedback_issue_number, p.feedback_issue_reactions,
       p.feedback_issue_comments,
       (p.feedback_issue_reactions + p.feedback_issue_comments) AS signal_strength
FROM prs p
WHERE p.is_candidate = 1 AND p.is_preview_feedback_fix = 1
ORDER BY signal_strength DESC;
```

### Reviewer suggestions by component

```sql
SELECT
    component,
    github_login,
    COUNT(DISTINCT pr_number) AS pr_count,
    GROUP_CONCAT(DISTINCT role) AS roles
FROM reviewers
WHERE github_login NOT LIKE '%[bot]%'
  AND github_login != 'Copilot'
GROUP BY component, github_login
ORDER BY component, pr_count DESC, github_login;
```

## Usage notes

- Create tables at the start of the pipeline.
- Insert VMR files and commits during the [VMR diff](vmr-diff.md) step.
- Insert PRs during the [trace to source](trace-to-source.md) step. Update `body` and `reactions` during [enrichment](enrich-prs.md).
- Mark candidates with `is_candidate = 1` and `vmr_confirmed = 1` after verification.
- Insert reviewer data during enrichment.

# SQL Schema and Patterns

Use the SQL tool for all structured data storage during the release notes pipeline. Do **not** write intermediate files to disk.

## Core tables

```sql
CREATE TABLE prs (
    number INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    author_association TEXT,
    labels TEXT,           -- comma-separated label names
    merged_at TEXT,
    body TEXT,
    reactions INTEGER DEFAULT 0,
    is_library INTEGER DEFAULT 0,
    is_candidate INTEGER DEFAULT 0
);

CREATE TABLE issues (
    number INTEGER PRIMARY KEY,
    title TEXT,
    body TEXT,
    labels TEXT,
    reactions INTEGER DEFAULT 0,
    pr_number INTEGER     -- the PR that references this issue
);

CREATE TABLE reviewers (
    github_login TEXT NOT NULL,
    role TEXT NOT NULL,          -- 'author', 'assignee', 'merged_by', 'coauthor'
    pr_number INTEGER NOT NULL,
    area_labels TEXT,            -- comma-separated area labels from the PR
    PRIMARY KEY (github_login, role, pr_number)
);
```

## Common queries

### Find candidate PRs

```sql
SELECT * FROM prs WHERE is_candidate = 1 ORDER BY merged_at;
```

### Popularity ranking

```sql
SELECT p.number, p.title, p.reactions,
       COALESCE(SUM(i.reactions), 0) AS issue_reactions,
       p.reactions + COALESCE(SUM(i.reactions), 0) AS total_reactions
FROM prs p
LEFT JOIN issues i ON i.pr_number = p.number
WHERE p.is_candidate = 1
GROUP BY p.number
ORDER BY total_reactions DESC;
```

### PRs by area label

```sql
SELECT * FROM prs
WHERE is_candidate = 1
  AND labels LIKE '%area-System.Text.Json%'
ORDER BY merged_at;
```

### Reviewer suggestions by area

```sql
SELECT
    area_labels,
    github_login,
    COUNT(DISTINCT pr_number) AS pr_count,
    GROUP_CONCAT(DISTINCT role) AS roles
FROM reviewers
WHERE github_login NOT LIKE '%[bot]%'
  AND github_login != 'Copilot'
GROUP BY area_labels, github_login
ORDER BY area_labels, pr_count DESC, github_login;
```

## Usage notes

- Insert PRs as they are discovered during collection. Update `body` and `reactions` during enrichment.
- Mark candidates with `is_candidate = 1` after filtering.
- Insert reviewer data during enrichment (see [suggest-reviewers.md](suggest-reviewers.md)).
- Additional PRs can be added to the candidate list manually by number.

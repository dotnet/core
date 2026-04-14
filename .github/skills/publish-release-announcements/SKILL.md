---
name: publish-release-announcements
description: >
  Create the GitHub release discussion in dotnet/core and the locked mirror
  announcement issue in dotnet/announcements for a .NET preview, RC, or GA
  release. USE FOR: publishing release discussions after release notes exist,
  mirroring a newly created discussion into dotnet/announcements, verifying an
  existing post, and re-running a partially completed publication safely. DO
  NOT USE FOR: writing release notes, generating changes/features.json, or
  retrying create commands blindly after cancellation.
compatibility: Requires gh CLI with permission to query and create discussions and issues across dotnet/core and dotnet/announcements.
---

<!-- markdownlint-disable-next-line MD013 -->

# Publish Release Announcements

Use this skill when the release notes are already published in this repository
and you need to publish the corresponding GitHub discussion and announcements
mirror.

This skill exists because GitHub create mutations are **not idempotent**.
Creating a discussion or issue twice creates duplicates. A canceled tool call or
partial terminal result does **not** prove the create failed.

## Purpose

The goal is to:

1. reuse the previous release's discussion and announcement issue as the exact
   formatting template
2. create at most one new `dotnet/core` discussion for the release
3. create at most one new `dotnet/announcements` mirror issue that links to the
   discussion
4. verify title, body, labels, and lock state after each write

## Inputs

Collect these before creating anything:

1. the release identifier, such as `.NET 11 Preview 3`
2. the release notes directory, such as
   `release-notes/11.0/preview/preview3/`
3. the prior discussion in `dotnet/core`
4. the prior mirror issue in `dotnet/announcements`
5. the new blog announcement URL, if one exists

## Required preflight

Before any create mutation, perform these checks in order.

### 1. Inspect the local release-note surface

Read the target release directory and `README.md` to confirm:

- the release name and preview number
- the component markdown files that actually exist
- the preferred section names and product naming for that release

Do **not** copy links from the previous discussion without checking that the new
files exist.

### 2. Reuse the previous post as a template

Fetch:

- the previous `dotnet/core` discussion body
- the previous `dotnet/announcements` issue body

Preserve the established wording and structure unless the current release notes
or publishing pattern changed.

### 3. Search for existing posts before creating anything

This step is mandatory.

Search `dotnet/core` for an existing discussion matching the target title or
blog/release link. Search `dotnet/announcements` for an existing issue matching
the same release title.

If a matching discussion or issue already exists:

- stop treating the task as a create
- verify and, if needed, update or report on the existing item
- do **not** create another item with the same title

### 4. Treat cancellations as ambiguous success

If a terminal run, tool call, or agent step was canceled after sending a create
command, assume the create may already have succeeded.

The next action must be a search or direct fetch for the expected title, not a
second create attempt.

## Discussion workflow

### 1. Build the new discussion body from the prior template

Update only the release-specific fields:

- title, such as `.NET 11 Preview 3`
- blog announcement URL
- release-note links pointing at the new release directory
- component bullets that reflect the files present for the new release

### 2. Create only after preflight passes

Use `gh api graphql` or another non-interactive `gh` command to create the
discussion.

Capture and report:

- discussion number
- discussion URL
- category name and ID

### 3. Verify immediately after create

Fetch the created discussion and confirm:

- title is correct
- category is correct
- body matches the intended markdown
- links point at the expected release directory

Example verification target:

- `.NET 11 Preview 3` discussion:
   `https://github.com/dotnet/core/discussions/10363`

If verification succeeds, use that discussion URL as the source of truth for the
announcement mirror.

## Announcement issue workflow

### 1. Use the discussion URL in the mirror preamble

The mirror issue should start with the locked-mirror sentence that points to the
new discussion URL.

### 2. Match the existing issue pattern

Reuse the previous release issue as the template for:

- title
- body structure
- labels
- lock behavior

For the current .NET 11 preview pattern, the mirror issue uses the `Preview`
and `.NET 11.0` labels and is locked with reason `resolved`.

### 3. Search again before creating the issue

Even if the discussion is new, the issue might already exist because of a prior
attempt. Search `dotnet/announcements` by exact title before creating.

### 4. Verify and lock

After creation, verify:

- issue number and URL
- labels
- locked state
- `active_lock_reason`

Example verification target:

- `.NET 11 Preview 3` announcement issue:
   `https://github.com/dotnet/announcements/issues/393`

Do not assume the lock succeeded just because the command returned. Query the
issue API and verify `locked: true` and the expected reason.

## Safe retry rules

Follow these rules on every rerun:

1. never retry `createDiscussion` or `gh issue create` until you have searched
   for an existing item with the target title
2. if a create step might have run already, switch to verification mode first
3. capture created URLs immediately and carry them into the next step
4. prefer updating or reporting on an existing post over creating a replacement

## Default outcome

For a normal release publication run:

1. inspect the new release-note directory
2. fetch the previous discussion and issue as templates
3. search both repositories for an existing item with the new release title
4. create the discussion only if no matching discussion exists
5. verify the discussion and capture its URL
6. create the announcements issue only if no matching issue exists
7. lock and verify the issue

This keeps the publication workflow repeatable without producing duplicate
discussions or mirror issues.

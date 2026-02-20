# Process Inputs and Validate Readiness

Collect all required inputs from the user and verify that prerequisite data is available before starting the data pipeline.

## Identify the team

If `$ARGUMENTS` is provided, parse it for the team name and optionally the repository (`owner/repo`). Otherwise, ask the user which team's release notes they are producing.

Once the team is identified, load the team context from `teams/<team>.md`. The team context provides:

- **Product name** — used in headings and descriptions
- **Repositories** — which repos to search for PRs
- **Area labels** — label filters for PR collection
- **Optional steps** — e.g., whether API diff review applies
- **Example release notes** — paths to prior release notes for reference and style

If no team context file exists for the specified team, inform the user and ask them to provide the equivalent configuration (product name, repos, labels) interactively.

## Collect release inputs

Collect inputs **one at a time** — ask a single question, wait for the answer, then ask the next. After each response, acknowledge what has been collected so far and ask for the next missing input:

1. **Preview name** (e.g. ".NET 11 Preview 2")
2. **Start date** — ask: *"What was the Code Complete date for the previous release, `<previous preview name>`?"* (ISO 8601). For **Preview 1**, this is the prior major version's RC1 Code Complete date (the vNext fork point); anything already covered in RC1/RC2/GA release notes will be de-duplicated in the [verify scope](dedup-previous-releases.md) step.
3. **End date** — ask: *"What was the Code Complete date for `<this preview name>`? (If it hasn't occurred yet, provide the expected date.)"* (ISO 8601)
4. **Output file** — path for the release notes markdown. Default: `release-notes/<version>/preview/<preview>/<component>.md` where `<component>` comes from the team context.

## Early validation

If the team context specifies optional steps with prerequisites (e.g., API diff review requires diff files to be present), check for those prerequisites now. See the team context for details on what to check and where to find it.

If any prerequisite is missing:

- **Warn the user immediately**, specifying what is missing and the expected location.
- Explain the impact on quality (e.g., API diffs improve cross-referencing accuracy).
- Ask whether to proceed without it or wait until the prerequisite is available.

Do not defer prerequisite checks to later pipeline steps — surface warnings as soon as inputs are collected so the user can decide early.

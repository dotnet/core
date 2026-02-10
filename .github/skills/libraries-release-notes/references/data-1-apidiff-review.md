# Step 1: Analyze API Diff

## Locate the API diff

Locate and load the `Microsoft.NETCore.App` API diff for the target release. The API diff provides context about which APIs were added or changed and significantly improves the quality of the generated release notes.

The API diff lives under the `release-notes` folder within an `api-diff` subfolder for the target release. For example:
* .NET 10 RC 2: `release-notes/10.0/preview/rc2/api-diff/Microsoft.NETCore.App/10.0-RC2.md`
* .NET 10 GA: `release-notes/10.0/preview/ga/api-diff/Microsoft.NETCore.App/10.0-ga.md`
* .NET 11 Preview 1: `release-notes/11.0/preview/preview1/api-diff/Microsoft.NETCore.App/11.0-preview1.md`

Check the `release-notes/` folder in the current repository clone for the API diff. If it is not present locally, **warn the user** that the release notes generation gains substantial context from the API diff and suggest generating release notes after the API diff is ready. The user may choose to proceed without it, but quality will be reduced.

## Load the API diff

Once the `api-diff` folder is located, load all of the API difference files under the `Microsoft.NETCore.App` subfolder:

```
api-diff/Microsoft.NETCore.App/
```

For example:

```
release-notes/11.0/preview/preview1/api-diff/Microsoft.NETCore.App/
```

Read every diff file in this folder to understand the full set of APIs that have been added or changed in the release. This information is used later to cross-reference with merged PRs and ensure the release notes accurately cover all API surface changes.

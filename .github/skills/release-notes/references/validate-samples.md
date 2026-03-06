# Validate Code Samples

After authoring the release notes, extract all code samples and verify they compile and function correctly. This catches API typos, missing usings, and incorrect signatures before the release notes are published.

## Process

### 1. Set up the samples folder

Determine the samples folder path as a `samples/` directory alongside the output file. For example, if the output file is `release-notes/11.0/preview/preview2/libraries.md`, the samples folder is `release-notes/11.0/preview/preview2/samples/`.

Before creating any sample projects, ensure a `.gitignore` file exists at `release-notes/.gitignore` that excludes all samples folders. If the file does not exist or does not already contain the samples exclusion, create or update it with:

```
# Code sample validation apps created during release notes authoring
**/samples/
.gitignore
```

### 2. Extract code samples

Scan the authored release notes for fenced `csharp` code blocks. For each code block:

1. **Identify the feature** — use the nearest preceding `##` heading as the feature name.
2. **Classify the snippet** — determine whether the snippet is:
   - A **runnable example** — contains executable statements that can be wrapped in a console app (most common).
   - An **API signature** — shows a type/method declaration only; not directly runnable but can be validated as compilable within a stub class.
   - A **fragment** — incomplete code that requires surrounding context to compile (e.g., a lambda expression, a partial method body). These need wrapping in an appropriate context.

### 3. Scaffold console apps

For each feature with code samples, create a [file-based C# program](https://raw.githubusercontent.com/dotnet/docs/refs/heads/main/docs/csharp/fundamentals/tutorials/file-based-programs.md) in the samples folder. File-based programs are single `.cs` files that build and run directly with `dotnet <file>.cs` — no project file required.

```
samples/
  <FeatureSlug>.cs
```

**`<FeatureSlug>.cs`**: Wrap the code sample in a single source file:

```csharp
#:property PublishAot=false
// Sample validation for: <Feature Name>
// Source: <release notes file>

<extracted code, wrapped as needed>
```

The `#:property PublishAot=false` directive is required to ensure the installed SDK is used for building the apps instead of NativeAOT compilation.

- For **runnable examples**: place the code as top-level statements.
- For **API signatures**: place the declaration inside a class and add top-level statements that reference the type to confirm it compiles.
- For **fragments**: wrap in the necessary context (class, method body, etc.) to make the code compilable.
- Add any required `using` directives that the snippet assumes but doesn't include.

If the code sample depends on a NuGet package not included in the default SDK (common for `Microsoft.Extensions.*` or preview packages), add `#:package` directives at the top of the file:

```csharp
#:package Microsoft.Extensions.Configuration@10.0.0-preview.*
```

If multiple code blocks for the same feature are logically sequential, combine them into a single `.cs` file.

**Fallback to project-based apps**: If a sample cannot be validated as a file-based program (e.g., it requires multiple source files, custom MSBuild properties, or project-level configuration beyond what `#:package` supports), fall back to creating a traditional `.csproj` + `Program.cs` pair in a subfolder:

```
samples/
  <feature-slug>/
    <FeatureSlug>.csproj
    Program.cs
```

### 4. Build and run each sample

For each sample:

```bash
dotnet samples/<FeatureSlug>.cs
```

The `dotnet` host builds and runs the file-based program in a single command. For project-based fallback samples, use `dotnet run --project samples/<feature-slug>/`.

- If the build **succeeds** and the program runs without error, the sample is validated.

- If the build **fails**, diagnose the error:
  - **Missing using directive** — add it to the source file and retry.
  - **Wrong API name or signature** — the release notes code sample is incorrect. Fix the code sample in the release notes and rebuild.
  - **Missing package reference** — add a `#:package` directive (or a `<PackageReference>` for project-based fallbacks) and retry.
  - **Requires infrastructure not available locally** (e.g., network service, database, specific OS) — document that the sample was validated as compilable but could not be run. Move on.

- If the run **throws an exception**, evaluate whether the exception is expected (e.g., a `FileNotFoundException` when no test file exists) or indicates a bug in the sample. Fix the release notes code sample if the error reveals an incorrect usage pattern.

### 5. Report results

After validating all samples, present a summary to the user:

| Feature | Build | Run | Notes |
|---------|-------|-----|-------|
| Zstandard compression | ✅ | ✅ | |
| Faster time zone conversions | ✅ | ⚠️ | Expected exception: no tzdata in sandbox |
| ... | | | |

For any sample that required changes to the release notes code, highlight the correction so the user can review it.

### 6. Clean up

The samples folder is excluded from git via the `.gitignore` created in step 1. Leave the samples in place so the user can inspect or re-run them, but they will not be committed.

## Notes

- **SDK availability**: The target .NET SDK version must be installed locally for the samples to build. Check with `dotnet --list-sdks`. If the required SDK is not installed, prompt the user to install a daily build from the [.NET SDK supported platforms builds table](https://github.com/dotnet/dotnet/blob/main/docs/builds-table.md#supported-platforms) — provide this link so they can download the appropriate installer for their platform. Explain that installing the daily build SDK will allow code samples to be validated against the actual build, then **ask the user for confirmation** before proceeding with validation. If the user declines the install, skip validation and note that samples were not verified.
- **Partial validation is acceptable**: Not every snippet can be a fully runnable app (e.g., ASP.NET middleware pipelines, GUI code). For these, validate that the code compiles even if it cannot be executed.
- **Do not modify release notes silently**: If a code sample needs correction, always show the user the original and corrected versions and get confirmation before updating the release notes file.

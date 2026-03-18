# Validate Code Samples

After authoring the release notes, extract all code samples and verify they compile and run. This catches API typos, missing usings, and incorrect signatures before publishing.

## Process

### 1. Set up the samples folder

Determine the samples folder path as a `samples/` directory alongside the output files. For example, if the output directory is `release-notes/11.0/preview/preview3/`, the samples folder is `release-notes/11.0/preview/preview3/samples/`.

Ensure a `.gitignore` at `release-notes/.gitignore` excludes samples folders:

```
# Code sample validation apps created during release notes authoring
**/samples/
.gitignore
```

### 2. Extract code samples

Scan the authored release notes (all component files) for fenced `csharp` code blocks. For each code block:

1. **Identify the feature** — use the nearest preceding `##` heading.
2. **Identify the component** — use the source file name (e.g., `libraries.md` → Libraries).
3. **Classify the snippet**:
   - **Runnable example** — contains executable statements (most common)
   - **API signature** — shows a type/method declaration only
   - **Fragment** — incomplete code needing surrounding context

### 3. Scaffold console apps

For each feature with code samples, create a [file-based C# program](https://raw.githubusercontent.com/dotnet/docs/refs/heads/main/docs/csharp/fundamentals/tutorials/file-based-programs.md):

```
samples/
  <ComponentSlug>-<FeatureSlug>.cs
```

Prefix with the component slug to organize samples across components.

```csharp
#:property PublishAot=false
// Sample validation for: <Feature Name>
// Component: <Component>
// Source: <release notes file>

<extracted code, wrapped as needed>
```

The `#:property PublishAot=false` directive ensures the installed SDK is used instead of NativeAOT.

- **Runnable examples**: place as top-level statements
- **API signatures**: place inside a class, add referencing statements
- **Fragments**: wrap in necessary context
- Add required `using` directives the snippet assumes

For NuGet package dependencies, add `#:package` directives:

```csharp
#:package Microsoft.Extensions.Configuration@10.0.0-preview.*
```

**Fallback to project-based apps**: If a sample cannot work as a file-based program, create a `.csproj` + `Program.cs` in a subfolder.

### 4. Build and run each sample

```bash
dotnet samples/<ComponentSlug>-<FeatureSlug>.cs
```

- **Build succeeds + runs** → validated
- **Build fails** → diagnose: missing using, wrong API name, missing package. Fix the release notes code sample and rebuild.
- **Run throws** → evaluate if expected (e.g., `FileNotFoundException` with no test file) or a bug in the sample

### 5. Report results

| Component | Feature | Build | Run | Notes |
|-----------|---------|-------|-----|-------|
| Libraries | Zstandard compression | ✅ | ✅ | |
| Runtime | Faster time zone conversions | ✅ | ⚠️ | Expected: no tzdata |

Highlight any corrections made to release notes code.

### 6. Clean up

Samples are excluded from git via `.gitignore`. Leave them in place for user inspection.

## Notes

- **SDK availability**: check with `dotnet --list-sdks`. If the required SDK is not installed, prompt the user to install a daily build from the [.NET SDK builds table](https://github.com/dotnet/dotnet/blob/main/docs/builds-table.md#supported-platforms). Ask for confirmation before proceeding.
- **Partial validation is acceptable**: not every snippet can be fully runnable (e.g., ASP.NET middleware, GUI code). Validate that it compiles.
- **Do not modify release notes silently**: always show original and corrected versions to the user before updating.

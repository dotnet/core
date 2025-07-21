# .NET SDK in .NET 10 Preview 6 - Release Notes

This release brings several major improvements to the .NET SDK experience, especially for tool authors and consumers. Below you’ll find detailed explanations, practical examples, and links to in-depth design documentation.

- [CLI](#cli)
  - [Platform-specific .NET Tools](#platform-specific-net-tools)
  - [One-shot tool execution](#one-shot-tool-execution)
  - [The new `dnx` tool execution script](#the-new-dnx-tool-execution-script)
  - [New `--cli-schema` option for CLI introspection](#new---cli-schema-option-for-cli-introspection)
- [File-based apps](#file-based-apps)
  - [Publish support and native AOT](#publish-support-and-native-aot)
  - [File directive syntax changes](#file-directive-syntax-changes)
  - [Referencing projects](#referencing-projects)
  - [App file and directory path available at runtime](#app-file-and-directory-path-available-at-runtime)
  - [Enhanced shebang support](#enhanced-shebang-support)
- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## CLI

### Platform-specific .NET Tools

.NET tools can now be published with support for multiple RuntimeIdentifiers (RIDs) in a single package. Tool authors can bundle binaries for all supported platforms, and the .NET CLI will select the correct one at install or run time. This makes cross-platform tool authoring and distribution much easier.

The [baronfel/multi-rid-tool](https://github.com/baronfel/multi-rid-tool) repository demonstrates this feature with the `toolsay` tool. The README shows several packaging variations:

- **Framework-dependent, platform-agnostic** (classic mode, runs anywhere with .NET 10 installed)
- **Framework-dependent, platform-specific** (smaller, optimized for each platform)
- **Self-contained, platform-specific** (includes the runtime, no .NET installation required)
- **Trimmed, platform-specific** (smaller, trims unused code)
- **AOT-compiled, platform-specific** (maximum performance and smallest deployment)

To build different variations, use:

```bash
dotnet pack -p ToolType=<variation>
```

Where `<variation>` is `agnostic`, `specific`, `self-contained`, `trimmed`, or `aot`.

These new tools are much more like normal Published applications, so any of the ways you can think of publishing an application (self-contained, trimmed, AOT, etc) can apply to them now!

### One-shot tool execution

You can now use the `dotnet tool exec` command to execute a .NET tool without installing it globally or locally. This is especially valuable for CI/CD or ephemeral usage.

- Design doc: [accepted/2025/direct-tool-execution.md](https://github.com/dotnet/designs/blob/main/accepted/2025/direct-tool-execution.md)

```bash
dotnet tool exec --source ./artifacts/package/ toolsay "Hello, World!"
Tool package toolsay@1.0.0 will be downloaded from source <source>.
Proceed? [y/n] (y): y
  _   _          _   _                __        __                 _       _   _
 | | | |   ___  | | | |   ___         \ \      / /   ___    _ __  | |   __| | | |
 | |_| |  / _ \ | | | |  / _ \         \ \ /\ / /   / _ \  | '__| | |  / _` | | |
 |  _  | |  __/ | | | | | (_) |  _      \ V  V /   | (_) | | |    | | | (_| | |_|
 |_| |_|  \___| |_| |_|  \___/  ( )      \_/\_/     \___/  |_|    |_|  \__,_| (_)
                                |/
```

This downloads and runs the specified tool package all in one go. By default, users will be prompted to confirm the download of the tool if it doesn't already exist locally. The latest version of the chosen tool package is used unless an explicit is chosen - for example `dotnet tool exec toolsay@0.1.0`.

One-shot tool execution works seamlessly with local tool manifests as well. If you run a tool from a location containing a `.config/dotnet-tools.json` nearby, the version of the tool in that config will be used instead of the latest version available.

### The new `dnx` tool execution script

Typing `dotnet tool exec` all the time is annoying, so we also added a new `dnx` script to further streamline tool execution. It basically just exists to make using tools as easy as possible - it just forwards all of your arguments along to the `dotnet` CLI for further processing. The actual implementation of the `dnx` command is in the `dotnet` CLI itself, so we can evolve its behavior over time. Today it runs tools, but who knows what the future may hold.

```bash
dnx toolsay "Hello, World!"
Tool package toolsay@1.0.0 will be downloaded from source <source>.
Proceed? [y/n] (y): y
  _   _          _   _                __        __                 _       _   _
 | | | |   ___  | | | |   ___         \ \      / /   ___    _ __  | |   __| | | |
 | |_| |  / _ \ | | | |  / _ \         \ \ /\ / /   / _ \  | '__| | |  / _` | | |
 |  _  | |  __/ | | | | | (_) |  _      \ V  V /   | (_) | | |    | | | (_| | |_|
 |_| |_|  \___| |_| |_|  \___/  ( )      \_/\_/     \___/  |_|    |_|  \__,_| (_)
                                |/
```

### New `--cli-schema` option for CLI introspection

A new option, `--cli-schema`, is available on all CLI commands. When used, it outputs a JSON representation of the CLI command tree for the invoked command or subcommand. This is useful for tool authors, shell integration, and advanced scripting.

- Issue: [Update `--cli-schema` output for consistency](https://github.com/dotnet/sdk/issues/49500)

**Example:**

Running:

```bash
dotnet clean --cli-schema
```

Outputs:

```json
{
  "name": "clean",
  "version": "10.0.100-dev",
  "description": ".NET Clean Command",
  "arguments": {
    "PROJECT | SOLUTION": {
      "description": "The project or solution file to operate on. If a file is not specified, the command will search the current directory for one.",
      "arity": { "minimum": 0, "maximum": null }
    }
  },
  "options": {
    "--artifacts-path": {
      "description": "The artifacts path. All output from the project, including build, publish, and pack output, will go in subfolders under the specified path.",
      "helpName": "ARTIFACTS_DIR"
    },
    // ... additional options truncated for brevity ...
  },
  "subcommands": {}
}
```

The output gives a structured, machine-readable description of the command’s arguments, options, and subcommands.

---

For more details, see the [full list of changes in this release](https://github.com/dotnet/core/pull/9949) and the [baronfel/multi-rid-tool sample repository](https://github.com/baronfel/multi-rid-tool) for hands-on examples of multi-RID tool packaging and usage.

## File-based apps

Preview 6 brings a bunch of updates to the new file-based apps experience in .NET 10, much of it based on the great feedback we've received since announcing the feature in preview 4:

### Publish support and native AOT

File-based apps now support being published to native executables via the `dotnet publish app.cs` command, making it easier than ever to create simple apps that you can redistribute as native executables. Note that this means that all file-based apps now assume they're targeting native AOT by default. If you need to use packages or features that are incompatible with native AOT, you can disable this using the `#:property PublishAot=false` directive in the top of your .cs file. Learn more about [.NET native AOT, including required prequisties, here](https://learn.microsoft.com/dotnet/core/deploying/native-aot/).

### File directive syntax changes

The syntax of the `#:sdk` and `#:property` directives have been updated for consistency and clarity reasons.

The `#:sdk` directive now requires the `@` symbol to separate the SDK ID and version, aligning with the syntax used for the `#:package` directive, e.g. `#:sdk Aspire.AppHost.Sdk@9.3.1`.

The `#:property` directive now requires the `=` symbol to separate the property name and value, to better align it with the syntax found in project files, e.g. `#:property LangVersion=preview`.

### Referencing projects

File-based apps now support referencing projects via the `#:project` directive. The path to the project can be specified with or without the project file. In the case the path is to the project directory, the project file will be automatically located. This was added based on feedback from users wanting to use file-based apps together with existing projects, e.g. for simple samples associated with a class library in a repo:

```csharp
#:project ../ClassLib/ClassLib.csproj

var greeter = new ClassLib.Greeter();
var greeting = greeter.Greet(args.Length > 0 ? args[0] : "World");
Console.WriteLine(greeting);
```

### App file and directory path available at runtime

It's sometimes useful when authoring file-based apps to know at runtime the full path to the application source file and/or directory. This information is now available via the [`System.AppContext.GetData` method](https://learn.microsoft.com/dotnet/api/system.appcontext.getdata) when running file-based apps from source, e.g. `dotnet run app.cs`. The file path is available using the name `"EntryPointFilePath"`, and the directory via the name `"EntryPointFileDirectoryPath"`. Note that this data is not available after the application has been published or converted to a project-based app. Following is an example of using `AppContext` as well as the [`System.Runtime.CompilerServices.CallerFilePath` attribute](https://learn.microsoft.com/dotnet/api/system.runtime.compilerservices.callerfilepathattribute) to obtain the path to the C# source file:

```csharp
#:property LangVersion=preview

Console.WriteLine("From [CallerFilePath] attribute:");
Console.WriteLine($" - Entry-point path: {Path.EntryPointFilePath()}");
Console.WriteLine($" - Entry-point directory: {Path.EntryPointFileDirectoryPath()}");

Console.WriteLine("From AppContext data:");
Console.WriteLine($" - Entry-point path: {AppContext.EntryPointFilePath()}");
Console.WriteLine($" - Entry-point directory: {AppContext.EntryPointFileDirectoryPath()}");

static class PathEntryPointExtensions
{
    extension(Path)
    {
        public static string EntryPointFilePath() => EntryPointImpl();

        public static string EntryPointFileDirectoryPath() => Path.GetDirectoryName(EntryPointImpl()) ?? "";

        private static string EntryPointImpl([System.Runtime.CompilerServices.CallerFilePath] string filePath = "") => filePath;
    }
}

static class AppContextExtensions
{
    extension(AppContext)
    {
        public static string? EntryPointFilePath() => AppContext.GetData("EntryPointFilePath") as string;
        public static string? EntryPointFileDirectoryPath() => AppContext.GetData("EntryPointFileDirectoryPath") as string;
    }
}
```

### Enhanced shebang support

File-based apps support for shebang-based direct shell execution has been enhanced, again based on your feedback.

To avoid the need to specify the exact path to the `dotnet` executable in shebang lines and avoid issues in environments that don't support multiple arguments in shebang directives, `dotnet` now supports directly executing *.cs* files without the need to specify the `run` command, e.g. `dotnet app.cs`. This allows for a shebang line to use the `env` command to run whichever `dotnet` is on the path like this:

```csharp
#!/usr/bin/env dotnet

Console.WriteLine("Hello shebang!");
```

Additionally, the *.cs* file extension can be omitted, allowing for direct execution of extensionless C# files configured with a shebang!

```bash
# 1. Create a single-file C# app with a shebang
cat << 'EOF' > hello.cs
#!/usr/bin/env dotnet
Console.WriteLine("Hello!");
EOF

# 2. Copy it (extensionless) into ~/utils/hello (~/utils is on my PATH)
mkdir -p ~/utils
cp hello.cs ~/utils/hello

# 3. Mark it executable
chmod +x ~/utils/hello

# 4. Run it directly from anywhere
cd ~
hello
```

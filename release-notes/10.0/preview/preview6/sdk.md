# .NET SDK in .NET 10 Preview 6 - Release Notes

This release brings several major improvements to the .NET SDK experience, especially for tool authors and consumers. Below you’ll find detailed explanations, practical examples, and links to in-depth design documentation.

- [CLI](#cli)
  - [Platform-specific .NET Tools](#platform-specific-net-tools)
  - [One-shot tool execution](#one-shot-tool-execution)
  - [The new `dnx` tool execution script](#the-new-dnx-tool-execution-script)
  - [New `--cli-schema` option for CLI introspection](#new---cli-schema-option-for-cli-introspection)
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
-
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

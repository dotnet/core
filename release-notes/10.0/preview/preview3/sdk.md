# .NET SDK in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in the .NET SDK in this preview release:

- [CLI](#cli)
  - [The `--interactive` option is now...interactive](#the---interactive-option-is-nowinteractive)
  - [Native shell completion scripts](#native-shell-completion-scripts)
  - [Support for local SDK installs in `global.json`](#support-for-local-sdk-installs-in-globaljson)
- [Containers](#containers)
  - [Console apps can natively create container images](#console-apps-can-natively-create-container-images)
  - [Explicitly control the image format of containers](#explicitly-control-the-image-format-of-containers)
- [Testing](#testing)
  - [Support for Microsoft Testing Platform in `dotnet test`](#support-for-microsoft-testing-platform-in-dotnet-test)

.NET SDK updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview#net-sdk) documentation

## CLI

### The `--interactive` option is now...interactive

The `--interactive` flag exists on many commands, where it is used to allow or disallow the command to change its behavior based on whether it is running in an interactive terminal or not. The primary use of this flag so far has been to enable commands that use NuGet to use NuGet's credential provider systems to dynamically retrieve credentials during the operation. Today, when using authenticated feeds, if the `--interactive` flag is not set, the command will fail with a message indicating that the command needs to be run with `--interactive` to succeed. This is not a great experience.

Starting in .NET 10.0.100 preview 3, the `--interactive` flag will be enabled by default for all uses of the CLI that we think are interactive - specifically those where the command output hasn't been redirected, as well as those that are not running in an environment that we think is a CI/CD server. This is similar to how the capability detection for the MSBuild Terminal Logger output works, which we introduced in .NET 8. As a result, most uses of the CLI will not need to specify `--interactive` at all to have user-friendly behaviors.

In the future, we will likely be keying more interactive behaviors, like prompting, progress bars, and more, off of this flag as well. This will allow us to make the CLI more user-friendly in interactive scenarios, while still allowing for non-interactive scenarios to work as expected.

If a command should run without any interactive behaviors at all, you can still specify `--interactive false` to disable any interactivity.

### Native shell completion scripts

Today the `dotnet` CLI supports tab-completion for many shells, but actually configuring the shell to trigger the tab-completion is so difficult and un-advertised that most users don't know it exists. In .NET 10, we are introducing a new command, `dotnet completions generate [SHELL]`, which will generate tab-completion scripts for many common shells. In addition, for the most common shells the scripts we generate are _native_ to the shell, meaning that they will be able to use the shell's native tab-completion features. This means that you will get the same experience as if you had written the tab-completion script yourself, but without needing to know how to write it. These native scripts should be much faster than the dynamic completion mechanisms we have used in the past.

In this release, we support the following shells:

| Shell      | Completion type | Additional features                                             |
| ---------- | --------------- | --------------------------------------------------------------- |
| bash       | hybrid          | -                                                               |
| fish       | dynamic         | -                                                               |
| nushell    | dynamic         | -                                                               |
| powershell | hybrid          | Descriptions are available for commands, options, and arguments |
| zsh        | hybrid          | Descriptions are available for commands, options, and arguments |

In this chart, `dynamic` means that the script will call back to the `dotnet` CLI to get the list of commands, options, and arguments. This is the same mechanism we have used in the past. `hybrid` means that the script will use a combination of static and dynamic completion. For example, in `bash`, we will generate a static script for all of the commands and options, but we will still call back to the `dotnet` CLI to get completions for NuGet package names. This allows us to provide a much faster experience than we have in the past for common operations, while still allowing us to provide a full-featured experience.

To use the new scripts, you will need to run the `dotnet completions generate [SHELL]` command. This will generate a script that you can source in your shell. For example, to generate a script for `pwsh`, you could add the following to your `$PROFILE`:

```powershell
dotnet completions script pwsh | out-String | Invoke-Expression -ErrorAction SilentlyContinue
```

This will generate a script that will be run every time you start a new PowerShell session. You can also run the command manually to generate the script and source it in your current session. Similar mechanisms can be used for the other supported shells!

The overall completions-generation mechanisms are pluggable, so if you'd like to see new shells supported or enhancements made to your existing shell's scripts, raise an issue over at dotnet/sdk!

### Support for local SDK installs in `global.json`

Today there are two primary ways to install .NET: 'globally' via installers and packages, and 'locally' via extracting zips or tarballs. As a result, it can be hard to manage 'local' SDK installations on a system that primarily uses 'global' installations. In .NET 10, we are introducing a new feature that allows you to specify multiple places to search for SDK installations via your `global.json` file. To use this feature, two new properties are available in `global.json`:

```json
{
    "sdk": {
        "paths": [ ".dotnet", "$host$" ],
        "errorMessage": "The .NET SDK could not be found, please run ./install.sh."
    }
}
```

- `paths`: These are locations to use when searching for a compatible .NET SDK. Paths can be absolute or relative to the location of the `global.json` file. The special value `$host$` represents the location corresponding to the running dotnet executable.
- `errorMessage`: This is a custom error message to use when a compatible SDK cannot be found.

This new feature can allow for a variety of interesting scenarios - for example trying a new version of the .NET SDK without installing it globally, which would impact the rest of your system. It can also be used to _restrict_ the paths that the SDK will search for installations, which can be useful in CI/CD scenarios where you want to ensure that the SDK is only installed in a specific location. To force this kind of a 'version bubble' you could remove the `$host$` entry from the `paths` array, and then only install the SDK in the specified location.

While it is possible to manage local installations of the SDK today, one big gap in the end to end experience was that users typically had to set environment variables in order to make IDE tooling aware of the local SDK installation. With the lookup information now codified in global.json, it's now trivial for editors like Visual Studio to use the SDK you intended it to use.

Note that this feature requires a native component called the `hostfxr` to be installed from SDK version 10.100 preview 3 or later. This component is installed by default with the .NET SDK, but it means that you won't be able to use this feature _to test preview 3_ - look forward to preview 4 and beyond to really see the benefit.

## Containers

### Console apps can natively create container images

Console apps can now create container images via `dotnet publish /t:PublishContainer` without having to set the `<EnableSdkContainerSupport>` property to `true` in the project file. This brings them into line with the existing behavior for ASP.NET Core apps and Worker SDK apps, which have supported this for a while. If you need to disable this support for any reason, you can set the `<EnableSdkContainerSupport>` property to `false` in the project file.

### Explicitly control the image format of containers

The container images the .NET SDK produces today are either in a Docker-specific format or the more standardized OCI format. Which one our tooling uses is based on two things - if the container is a multi-architecture container, and the format of the base image being used. If the container is a multi-architecture container, we will always use the OCI format. Otherwise, for single-architecture containers, we will use the format of the base image. This means that any container generated using the Microsoft .NET base images will be in the Docker formats. Many users are moving to OCI images across their tooling, and so we have added a new property to the SDK, `<ContainerImageFormat>`, which allows you to explicitly set the format of the container image. This property can be set to `Docker` or `OCI`, and will override the default behavior. This property is only used when building a container image, and will not affect any other operations.

## Testing

### Support for Microsoft Testing Platform in `dotnet test`

Starting with .NET 10 Preview 3, `dotnet test` now natively supports the [Microsoft.Testing.Platform](https://aka.ms/mtp-overview). You can enable this feature by adding the following configuration to your dotnet.config file (which itself is a [draft specification](https://github.com/dotnet/designs/pull/328) that we would love your feedback on):

```ini
[dotnet.test:runner]
name = "Microsoft.Testing.Platform"
```

> [!NOTE]
> The `[dotnet.test:runner]` part will change to `[dotnet.test.runner]` in Preview 4.

For more details, refer to [Testing with `dotnet test`](https://learn.microsoft.com/dotnet/core/testing/unit-testing-with-dotnet-test), which explains how Microsoft.Testing.Platform was integrated with `dotnet test` in .NET 9 and earlier versions, and the reasons behind the new `dotnet test` experience.

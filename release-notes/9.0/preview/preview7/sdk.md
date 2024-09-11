# SDK updates in .NET 9 Preview 7

.NET 9 Preview 7 includes several new SDK features. We focused on the following areas:

* [Container publishing support for insecure registries](#container-publishing-improvements-for-insecure-registries)
* [More consistent environment variables for container publishing](#more-consistent-environment-variables-for-container-publishing)
* [Introduction of Workload Sets for more control over workloads](#introduction-of-workload-sets-for-more-control-over-workloads)
* [Mitigating analyzer mismatch issues aka 'torn SDK'](#mitigating-analyzer-mismatch-issues-aka-torn-sdk)

SDK updates in .NET 7 Preview 7:

- [Release notes](sdk.md)
- [What's new in the .NET Runtime in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 7:

- [Discussion](https://aka.ms/dotnet/9/preview7)
- [Release notes](README.md)
- [Runtime release notes](runtime.md)
- [Libraries release notes](libraries.md)


## Container publishing improvements for insecure registries

The SDK's built-in container publishing support can publish images to container registries, but until this release those registries were required to be secured - they needed HTTPS support and valid certificates for the .NET SDK to work.
Container engines can usually be configured to work with insecure registries as well - meaning registries that do not have TLS configured, or have TLS configured with a certificate that is invalid from the perspective of the container engine. This is a valid use case, but our tooling didn't support this mode of communication.

In this release, [@tmds](https://github.com/tmds) enabled the SDK [to communicate with insecure registries](https://github.com/dotnet/sdk/pull/41506).

Requirements (depending on your environment):

* [Configure the Docker CLI to mark a registry as insecure](https://docs.docker.com/reference/cli/dockerd/#insecure-registries)
* [Configure Podman to mark a registry as insecure](https://podman-desktop.io/docs/containers/registries)
* Use the `DOTNET_CONTAINER_INSECURE_REGISTRIES` environment variable to pass a semicolon-delimited list of registry domains to treat as insecure


## More consistent environment variables for container publishing

[@kasperk81](https://github.com/kasperk81) noticed that the environment variables that the container publish tooling use to control some of the finer aspects of registry communication and security were not aligned with the existing conventions.
Most of the rest of the CLI uses the `DOTNET` 'namespace' for environment variables, but the container tooling used `SDK` instead. They helpfully [unified our environment variables to the `DOTNET` version](https://github.com/dotnet/sdk/pull/41769), while keeping support for the older `SDK` prefix. Going forward, please use the `DOTNET` prefix for environment variables, as we will eventually deprecate the older form.

## Introduction of Workload Sets for more control over workloads

This preview is the first release of Workload Sets - an SDK feature intended to give users more control over the workloads they install and the cadence of change of those installed workloads. Prior to this release, workloads would periodically be updated as new versions of individual workloads were released onto any configured NuGet feeds. Now, after switching to this new opt-in mode of operation, users will stay at a specific single  version of all of their workloads until they make an explicit update gesture.

You can see what mode your SDK installation is in by running `dotnet workload --info`:

```terminal
> dotnet workload --info
Workload version: 9.0.100-manifests.400dd185
Configured to use loose manifests when installing new manifests.
 [aspire]
   Installation Source: VS 17.10.35027.167, VS 17.11.35111.106
   Manifest Version:    8.0.2/8.0.100
   Manifest Path:       C:\Program Files\dotnet\sdk-manifests\8.0.100\microsoft.net.sdk.aspire\8.0.2\WorkloadManifest.json
   Install Type:              Msi
```

In this example, I am in 'manifest' mode, which is what we call the current mode of managing workloads.
The simplest way to opt into the new mode is to add a `--version` option to a `dotnet workload install` or `dotnet workload update` command, but you can also explicitly control your mode of operation using the new `dotnet workload config` command:

```terminal
> dotnet workload config --update-mode workload-set
Successfully updated workload install mode to use workload-set.
```

If you need to change back for any reason, you can run the same command with `manifests` instead of `workload-set`. You can also use `dotnet workload config --update-mode` to check what the current mode of operation is. You can read more about workload sets in [our documentation]().

## Mitigating analyzer mismatch issues aka 'torn SDK'

Many users install the .NET SDK and Visual Studio at different cadences, and while this flexibility is one of our goals, it can lead to problems for tooling that needs to interop between the two environments.

One example of this kind of tooling is Roslyn Analyzers. Analyzer authors have to code for specific versions of Roslyn, but which versions are available and which is used by a given build has been unclear in the past.

We call this kind of mismatch a 'torn SDK'. When you are in this torn state, you might see errors like this:

```bash
>CSC : warning CS9057: The analyzer assembly '..\dotnet\sdk\8.0.200\Sdks\Microsoft.NET.Sdk.Razor\source-generators\Microsoft.CodeAnalysis.Razor.Compiler.SourceGenerators.dll' references version '4.9.0.0' of the compiler, which is newer than the currently running version '4.8.0.0'.
```

Starting in this release, we have adopted a method of detecting and automatically adjusting for this 'torn' state.

You can read more about it [in our documentation for the effort](https://github.com/dotnet/sdk/blob/main/documentation/general/torn-sdk.md).

In short, the SDK's MSBuild logic embeds the version of MSBuild it shipped with, and we can use that information to detect when the SDK is running in an environment other than that version.

When we detect this, the SDK inserts an implicit [PackageDownload](https://learn.microsoft.com/nuget/consume-packages/packagedownload-functionality) of a support package called `Microsoft.Net.Sdk.Compilers.Toolset` that ensures a consistent analyzer experience for users.


# MSBuild in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes new MSBuild features and improvements:

- [Create and extract tar archives](#create-and-extract-tar-archives)
- [MSBuild server APIs move to a stable namespace](#msbuild-server-apis-move-to-a-stable-namespace)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)

## Create and extract tar archives

MSBuild adds inbox `TarDirectory` and `Untar` tasks for .NET builds
([dotnet/msbuild #14451](https://github.com/dotnet/msbuild/pull/14451)).
The tasks are .NET-only because they use `System.Formats.Tar`; they aren't
available in Visual Studio's .NET Framework `MSBuild.exe`.

`TarDirectory` creates an uncompressed tar archive by default and can create a
gzip-compressed archive with `Compression="GZip"`:

```xml
<Target Name="ArchiveOutput" AfterTargets="Publish">
  <TarDirectory
      SourceDirectory="$(PublishDir)"
      DestinationFile="$(ArtifactsPath)\package.tar.gz"
      Compression="GZip"
      Overwrite="true" />
</Target>
```

It also supports `FailIfNotIncremental`, matching the question-mode behavior
of the existing archive tasks. An existing destination produces an error unless
`Overwrite="true"` is set.

`Untar` accepts one or more archives, skips unchanged files by default, and can
optionally overwrite read-only destination files:

```xml
<Target Name="ExtractDependencies">
  <Untar
      SourceFiles="@(DependencyArchives)"
      DestinationFolder="$(IntermediateOutputPath)dependencies"
      SkipUnchangedFiles="true"
      OverwriteReadOnlyFiles="false" />
</Target>
```

## MSBuild server APIs move to a stable namespace

The MSBuild server's public entry points have moved from
`Microsoft.Build.Experimental` to `Microsoft.Build.Server`
([dotnet/msbuild #13964](https://github.com/dotnet/msbuild/pull/13964)):

- `MSBuildClient`
- `MSBuildClientExitResult`
- `MSBuildClientExitType`
- `OutOfProcServerNode`, including its `BuildCallback` delegate

Update source imports and rebuild code that consumes these APIs:

```diff
-using Microsoft.Build.Experimental;
+using Microsoft.Build.Server;
```

This is a binary-breaking namespace move with no forwarding types. Libraries
compiled against the experimental namespace must be recompiled.

## Breaking changes

- **XML tasks prohibit document type definitions by default.** `XmlPeek`,
  `XmlPoke`, and `XslTransformation` now default `ProhibitDtd` to `true` and
  report a DTD-specific error
  ([dotnet/msbuild #14285](https://github.com/dotnet/msbuild/pull/14285)).
  Remove DTDs from build-time XML where possible. For trusted input that still
  requires one, set `ProhibitDtd="false"` explicitly on the task.
- **Change waves 17.10, 17.12, 17.14, and 18.3 are retired.** Their newer
  behaviors are now unconditional
  ([dotnet/msbuild #14551](https://github.com/dotnet/msbuild/pull/14551)).
  This only changes builds that opted out through
  `MSBUILDDISABLEFEATURESFROMVERSION`. A value that names a retired wave is
  clamped to 18.4 and produces warning MSB4272. Update the build to work with
  the current behavior instead of depending on the retired opt-out.

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Event-level task telemetry: diagnostics plumbing intended for telemetry consumers rather than a general build workflow.
  - FileAccessData glob-pattern APIs: specialized extensibility for file-access instrumentation.
  - Directory.Parse.config tolerant parsing: compatibility infrastructure without a broadly applicable project-file feature.
-->

## Bug fixes

- **MSBuild server**
  - [Reset process state between server requests](https://github.com/dotnet/msbuild/pull/14475)
  - [Scope server and coordinator resource names to the current user](https://github.com/dotnet/msbuild/pull/14543)
  - [Give each transient server its own identity](https://github.com/dotnet/msbuild/pull/14647)
- **Build engine**
  - [Fix concurrent BuildCheck callback mutation](https://github.com/dotnet/msbuild/pull/14590)
  - [Keep projects active through post-build telemetry](https://github.com/dotnet/msbuild/pull/14679)
  - [Preserve the XML cache after restore reloads it from disk](https://github.com/dotnet/msbuild/pull/14558)
- **Task host**
  - [Fix file-access reporting for detoured nodes](https://github.com/dotnet/msbuild/pull/14602)
  - [Scope .NET task-host handshake leniency to architecture](https://github.com/dotnet/msbuild/pull/14579)

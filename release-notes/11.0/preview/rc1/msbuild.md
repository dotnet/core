# MSBuild in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes new MSBuild features and improvements:

- [Create and extract tar archives](#create-and-extract-tar-archives)
- [Expose item glob patterns to build tooling](#expose-item-glob-patterns-to-build-tooling)
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
      DestinationFile="$(OutputPath)package.tar.gz"
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

## Expose item glob patterns to build tooling

MSBuild can now expose a project's unevaluated include, exclude, and remove
glob patterns during a regular build
([dotnet/msbuild #14389](https://github.com/dotnet/msbuild/pull/14389)).
This lets build tooling inspect a project's wildcard patterns without hosting
the MSBuild object model or evaluating the project again.

Set `MSBuildProvideItemGlobs` to the item types that the tooling needs. MSBuild
then creates an `MSBuildItemGlob` item for each matching include element:

```xml
<PropertyGroup>
  <MSBuildProvideItemGlobs>Compile;Content</MSBuildProvideItemGlobs>
</PropertyGroup>

<Target Name="ShowItemGlobs">
  <Message
      Importance="high"
      Text="%(MSBuildItemGlob.Identity): include=%(MSBuildItemGlob.Include); exclude=%(MSBuildItemGlob.Exclude); remove=%(MSBuildItemGlob.Remove)" />
</Target>
```

Each item identifies its item type and provides the `Include`, `Exclude`, and
`Remove` metadata. The glob patterns remain unexpanded and retain their project
file order. MSBuild does not create these items when the property is unset.

On the command line, escape the semicolon as `%3B`:

```console
dotnet build /p:MSBuildProvideItemGlobs=Compile%3BContent
```

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

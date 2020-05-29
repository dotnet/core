# Using IL Linker Advanced Features

***Note:*** In 3.0, the linker has shipped as part of the SDK (still marked as "preview"), and the out-of-band nuget package is no longer supported. Please see the new instructions at https://aka.ms/dotnet-illink.

This document describes the more advanced features for the IL Linker and provides more insight into how it functions.

The basic features and instructions for the linker are described in the [Using the .NET IL Linker](linker-instructions.md) document.

## How the linker works

At a high level, the linker uses a mark-and-sweep algorithm to remove unused code: starting from some set of roots in the code (roots can be classes, methods, properties), the linker scans the IL using mono/cecil to look for code that gets called in other functions, classes, and dlls, marking the code that is reachable from the set of roots as it goes. In the sweep phase, the linker will scan through all of the code, removing any parts that weren't marked in the mark phase.

## Limitations

The dynamic features of .NET make it hard for this analysis to catch all cases in which code is called from the set of roots. In particular, reflection enables developers to do things like scan for assemblies at runtime and call their code. In general, it is impossible for the linker to determine exactly which code will get called at runtime, so there will be cases in which the linker removes code that should not be removed. We may add more sophisticated heuristics in the future to catch some common patterns of reflection usage, but the general problem remains, which necessitates a mechanism by which developers can explicitly tell the linker which parts of the code to consider as roots.

## Using the tasks package

The linker tasks package ([ILLink.Tasks](https://dotnet.myget.org/feed/dotnet-core/package/nuget/Illink.Tasks)) contains MSBuild targets that become a part of the referencing project's build, using the [mechanism described in the nuget docs](https://docs.microsoft.com/en-us/nuget/create-packages/creating-a-package#including-msbuild-props-and-targets-in-a-package). When this package is referenced in a project, the publish target is augmented with additional targets that run the linker on the app's assemblies before they are placed in the publish directory.

These targets will run the linker on all managed assemblies that are a part of the app, including dependencies from project references and package references. The linker will attempt to determine which parts of the code (in the project and its dependencies) are unnecessary, and it will remove assemblies or parts of assemblies that it determines to be safe to remove. By default this behavior is fairly conservative: the linker will always keep code in the application and its non-framework dependencies, only removing unused parts of the framework assemblies (this may change in the future as we improve the linker's heuristics).

Even with the current conservative behavior, there may be cases in which the linker removes code that the application expects to be present at runtime. For example, the application may use reflection to load and call code at runtime, and the linker will not be able to catch these cases perfectly. To explicitly tell the linker to keep certain code in the linked output, it is possible to specify additional roots via MSBuild properties and XML root descriptor files.

## Specifying additional roots

Root assemblies can be specified with the `LinkerRootAssemblies` ItemGroup:

```xml
<ItemGroup>
  <LinkerRootAssemblies Include="MyAssembly" />
</ItemGroup>
```

This ItemGroup should contain the logical names of assemblies, not the filenames (so the assembly names should not have extensions).

The linker roots can also be specified at a more granular level using XML root descriptor files, whose format is [documented](https://github.com/mono/linker/tree/master/src/linker#syntax-of-xml-descriptor) in the mono/linker repo. These files should be specified in the LinkerRootDescriptors ItemGroup:

```xml
<ItemGroup>
  <LinkerRootDescriptors Include="path/to/rootDescriptor.xml" />
</ItemGroup>
```

For example, the xml file might be used to root an entire assembly:

```xml
<linker>
  <assembly fullname="AssemblyToRoot" />
</linker>
```

or just a specific type within the assembly:

```xml
<linker>
  <assembly fullname="AssemblyName">
    <type fullname="Type.To.Root" />
  </assembly>
</linker>
```

## For more control

It is also possible to use the link task directly, which may be useful for more complicated builds. To turn off the default behavior introduced by the package, use:

```xml
<PropertyGroup>
  <LinkDuringPublish>false</LinkDuringPublish>
</PropertyGroup>
```

The ILLink task can be invoked just like any other msbuild task. For example, it could be called from a target as follows:

```xml
<Target Name="CustomLinkerExample">
  <ILLink AssemblyPaths="@(AssemblyFilesToLink)"
          RootAssemblyNames="@(LinkerRootAssemblies)"
          RootDescriptorFiles="@(LinkerRootDescriptors)"
          OutputDirectory="output"
          ExtraArgs="-t -c link -l none" />
</Target>
```

Here, the ItemGroups `AssemblyFilesToLink`, `LinkerRootAssemblies`, and `LinkerRootDescriptors` would be defined elsewhere in the project, and the `ExtraArgs` input consists of flags described in the [mono/linker documentation](https://github.com/mono/linker/blob/master/README.md). By default, the `RootAssemblyNames` are rooted as if illink had been called with `-a RootAssemblyName1 -a RootAssemblyName2` ... as arguments, but this behavior is subject to change and should not be relied upon.

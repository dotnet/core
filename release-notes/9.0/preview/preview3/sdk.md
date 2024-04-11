# .NET SDK in .NET 9 Preview 3 - Release Notes

.NET 9 Preview 3 includes several new SDK features. We focused on the following area:

- Terminal Logger

SDK updates in .NET 9 Preview 3:

- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 3:

- [Discussion](https://aka.ms/dotnet/9/preview3)
- [Release notes](./README.md)
- [Runtime release notes](./runtime.md)
- [Libraries release notes](./libraries.md)


## Terminal Logger Usability

In this preview, the Terminal Logger feature learned to summarize the total count of failures and warnings at the end of a build, and it also learned how to show errors that contain newlines. These changes are a direct result of feedback from users in the early preview of .NET 9, so please continue to use Terminal Logger and report your feedback [on the MSBuild repository](https://github.com/dotnet/msbuild/issues).

To show the features in action, here's a quick project file that you can use as a template:

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>

  <Target Name="Error" BeforeTargets="Build">
    <Warning Code="ECLIPSE001" Text="Turn around, bright eyes" />
    <Warning Code="ECLIPSE002" Text="Every now and then I fall apart" />

    <Warning Code="ECLIPSE003" Text="Black Hole Sun, won't you come
  And wash away the rain
    Black Hole Sun, won't you come
      won't you come" />
  </Target>
</Project>

```

Save the project file locally and run `dotnet build -tl` on older SDKs and the new .NET 9 preview 3 release to see the differences. On the .NET 8 SDK, the output is:

```terminal
$ dotnet build -tl
MSBuild version 17.8.5+b5265ef37 for .NET
Restore complete (0.5s)
  multiline-error-example succeeded with warnings (0.2s) → bin\Debug\net8.0\multiline-error-example.dll
    E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(8,5): warning ECLIPSE001: Turn around, bright eyes
    E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(9,5): warning ECLIPSE002: Every now and then I fall apart
    E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(11,5): warning ECLIPSE003: Black Hole Sun, won't you come
E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(11,5): warning ECLIPSE003:   And wash away the rain
E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(11,5): warning ECLIPSE003:     Black Hole Sun, won't you come
E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(11,5): warning ECLIPSE003:       won't you come

Build succeeded with warnings in 0.9s
```

Rendered on my terminal, this looks like

![An MSBuild Build log with 3 warnings - two are single-line, but the third is multi-line. Each line of the multi-line error is a separate line in the log, and each of those lines are prefixed with the full path to the project that caused the warning, the line and column of the warning, and the warning code. Finally, the build summary only shows that there were some warnings, not how many there were.](media/terminallogger-multiline-before.png)

Note how each line of each warning (and error, but we didn't show any here) is a separate line with a full error message prefix. This is very hard to read. In addition, the final build summary just says that there _were_ warnings, not how many there were. This can make it hard to see if a particular build is better or worse than previous builds. Here's the same operation on the .NET 9 preview 3 SDK:

```terminal
> dotnet build -tl
Restore complete (0.4s)
You are using a preview version of .NET. See: https://aka.ms/dotnet-support-policy
  multiline-error-example succeeded with 3 warning(s) (0.2s) → bin\Debug\net8.0\multiline-error-example.dll
    E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(8,5): warning ECLIPSE001: Turn around, bright eyes
    E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(9,5): warning ECLIPSE002: Every now and then I fall apart
    E:\Code\Scratch\multiline-error-example\multiline-error-example.csproj(11,5): warning ECLIPSE003:
      Black Hole Sun, won't you come
        And wash away the rain
          Black Hole Sun, won't you come
            won't you come

Build succeeded with 3 warning(s) in 0.8s
```

Rendered on my terminal, this looks like
![An MSBuild Build log with 3 warnings - two are single-line, but the third is multi-line. Each line of the multi-line error is a separate line in the log with proper spaces handled. There is no long prefix on each of the warning message lines. The final build summary clearly states that there were 3 warnings.](media/terminallogger-multiline-after.png)

In the image, the larger blue box is highlighting that the message lines of the third warning no longer have the repeated long project and location information that cluttered the display in the original version. In addition, the smaller blue box highlights that the build summary clearly shows how many warnings (and errors, if we had any) were generated during the build.

Combined, these features improve the information that is available at-a-glance, and the multi-line support especially is a foundational improvement for future investment in multi-line diagnostics and messages of all kinds. Give the new version of Terminal Logger a try, and remember to let us know your feedback [on the MSBuild repository](https://github.com/dotnet/msbuild/issues).



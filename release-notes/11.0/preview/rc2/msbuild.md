# MSBuild in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 includes a project-evaluation performance improvement:

- [Faster wildcard matching during project evaluation](#faster-wildcard-matching-during-project-evaluation)

## Faster wildcard matching during project evaluation

The .NET SDK uses wildcard patterns during project evaluation. For example, SDK-style projects use patterns such as `**/*.cs` to include source files. In .NET SDK 11.0.100 or Visual Studio 18.12 or later, MSBuild can find matching files faster in projects with many directories and files ([dotnet/msbuild #14663](https://github.com/dotnet/msbuild/pull/14663)).

In benchmarks on Windows, complete project evaluations were 10–13% faster and allocated 16–34% less than with the legacy matcher:

| Directories | Nonmatching files per directory | Evaluation time vs. legacy | Allocation vs. legacy |
| ---: | ---: | ---: | ---: |
| 32 | 8 | 0.89x | 0.73x |
| 32 | 64 | 0.90x | 0.84x |
| 128 | 8 | 0.87x | 0.66x |
| 128 | 64 | 0.90x | 0.84x |

The optimization helps when wildcard include and exclude patterns overlap, a common scenario in SDK-style projects. For example, the SDK includes source files with `**/*.cs` while excluding build-output directories such as `bin` and `obj`. The benchmark results above cover four tested project-evaluation workloads, not all builds.

# F# release-note validation

With SDK `11.0.100-rc.2.26475.137` on `PATH`, run:

```powershell
pwsh -NoProfile -File ./Validate.ps1
```

The script rejects other SDK versions. It builds and runs the fixture with both the default language version and `<LangVersion>preview</LangVersion>`.

| Scenario                                           | Expected result                                                                                                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default-language collection operations             | Correct `List.fold`, `Array.fold`, `Array2D.init`, and attributed custom `fold2` results                                                                                                                |
| `Async.parallelLimit 2` and `Task.parallelLimit 2` | Results in input order, peak active concurrency at most two                                                                                                                                             |
| Preview named arguments                            | Named call runs; positional call reports `FS3923`. Positional call compiles by default                                                                                                                  |
| Preview `reraise`                                  | Async, task, and custom-builder handlers preserve the original exception and stack origin. The article's async example reports `FS3350` by default                                                      |
| Preview runtime-async compiler support             | Source-test-derived intrinsic and custom `runtimeTask` builder samples return 42 across suspension; default-language build reports `FS3350`. The builder is fixture-defined, not shipped in FSharp.Core |
| Preview extension operators and SRTP               | Generic DateTime shifting accepts both built-in TimeSpan and custom MyOffset. Other source-test examples return `"hahaha"` and 8. Default-language build reports `FS0001`/`FS0043`                      |
| Carry-forward preview record constructor           | Constructor returns the expected record under preview; default-language build reports `FS0800`                                                                                                          |
| Default F# 11 closure optimization                 | Attributed helper runs by default; F# 10 language mode reports `FS3350`                                                                                                                                 |
| Char-backed enum bitwise operations                | `FS0001` under default and preview; compiles with F# 10 language mode                                                                                                                                   |
| F# Interactive asynchronous disposal               | Default-language `task` calls `IAsyncDisposable.DisposeAsync`                                                                                                                                           |
| Array2D operations                                 | `create`, `init`, `copy`, `map`, `mapi`, and `rebase` return the expected values                                                                                                                        |
| Assembly metadata trimming                         | Compiled fixture contains its generated `ILLink.Substitutions.xml` resource                                                                                                                             |

The fixture supplies `System.Diagnostics.CodeAnalysis.RequireNamedArgumentsAttribute` as a polyfill because the pinned build does not ship it in the BCL.

To verify the `Array2D` Native AOT claim, run:

```powershell
pwsh -NoProfile -File ./Validate.ps1 -PublishAot
```

This also publishes and runs the small `aot/` project with warnings treated as errors. It requires the host's [Native AOT prerequisites](https://learn.microsoft.com/dotnet/core/deploying/native-aot/#prerequisites). A normal F# build alone does not prove that Native AOT publishing is warning-free.

Performance figures in the article come from the linked PR workloads. This fixture verifies example behavior and language gates; it does not reproduce those benchmarks.

# F# in .NET 11 Preview 6 - Release Notes

<!-- Verified against release-notes/11.0/preview/preview6/changes.json, the F# Preview 6 PR slice, and dotnet/fsharp PR metadata. No new public .NET reference APIs are named. -->

Here's a summary of what's new in F# in this Preview 6 release:

- [Array.init can inline initialization lambdas](#arrayinit-can-inline-initialization-lambdas)
- [Interpolated strings parse next to equals signs](#interpolated-strings-parse-next-to-equals-signs)
- [FSI --quiet keeps restore output off stdout](#fsi---quiet-keeps-restore-output-off-stdout)
- [Signature-file diagnostics catch missing semantic attributes](#signature-file-diagnostics-catch-missing-semantic-attributes)
- [Debug sequence points cover more F# expressions](#debug-sequence-points-cover-more-f-expressions)
- [Bug fixes and other improvements](#bug-fixes-and-other-improvements)
- [Community contributors](#community-contributors)

## Array.init can inline initialization lambdas

`Array.init` now carries the same inline-if-lambda behavior as the lower-level primitive it calls. When the initializer can be inlined, the compiler can avoid creating an extra closure for straightforward array initialization code ([dotnet/fsharp #19869](https://github.com/dotnet/fsharp/pull/19869)). Thank you [@kerams](https://github.com/kerams) for this contribution!

```fsharp
let squares = Array.init 10 (fun index -> index * index)
```

## Interpolated strings parse next to equals signs

Interpolated strings can now appear immediately after `=` without a separating space. This fixes named arguments and expression forms that use regular, verbatim, triple-quoted, and multi-dollar interpolated strings ([dotnet/fsharp #19820](https://github.com/dotnet/fsharp/pull/19820), [dotnet/fsharp #19984](https://github.com/dotnet/fsharp/pull/19984)). Thank you [@edgarfgp](https://github.com/edgarfgp) for these contributions!

```fsharp
type C(?Name: string) =
    member val Name = defaultArg Name "" with get, set

let value = "Preview 6"

let named = C(Name=$"Hello {value}")
let verbatim =$@"{value}"
let multiDollar =$$"""{{value}}"""
```

## FSI --quiet keeps restore output off stdout

When F# Interactive runs with `--quiet`, NuGet restore output is now routed away from stdout. Scripts that intentionally write machine-readable output to stdout can use package references without restore chatter mixing into the stream ([dotnet/fsharp #19808](https://github.com/dotnet/fsharp/pull/19808)).

```fsharp
// script.fsx
#r "nuget: Newtonsoft.Json, 13.0.3"

printfn "ready"
```

```console
dotnet fsi --quiet script.fsx > output.txt
```

## Signature-file diagnostics catch missing semantic attributes

FS3888 now reports consumer-visible attributes that appear in an implementation file but are missing from the corresponding signature file. These attributes affect how downstream code type-checks against the `.fsi` contract, so the diagnostic helps keep the implementation and signature aligned. With the `ErrorOnMissingSignatureAttribute` preview language feature enabled, the diagnostic is an error ([dotnet/fsharp #19880](https://github.com/dotnet/fsharp/pull/19880)).

```fsharp
// Library.fsi
module Library

val parse: string -> int
```

```fsharp
// Library.fs
module Library

[<NoDynamicInvocation>]
let parse text = int text
```

## Debug sequence points cover more F# expressions

The compiler now emits better sequence points for several common debugging scenarios. Breakpoints and stepping are improved for call arguments that need stack-empty debug points, `for` expressions and comprehensions, simple literal bindings, and `if` or `match` conditions ([dotnet/fsharp #19877](https://github.com/dotnet/fsharp/pull/19877), [dotnet/fsharp #19894](https://github.com/dotnet/fsharp/pull/19894), [dotnet/fsharp #19897](https://github.com/dotnet/fsharp/pull/19897), [dotnet/fsharp #19932](https://github.com/dotnet/fsharp/pull/19932)). Thank you [@auduchinok](https://github.com/auduchinok) for these contributions!

```fsharp
for item in items do
    printfn "%A" item

if shouldRun input then
    run input
else
    skip input
```

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - ObsoleteDiagnosticInfo in compiler symbols: useful compiler-service metadata, but no broad end-user workflow was validated for this preview.
  - ParallelCompilation property passing: important MSBuild plumbing, but it is build configuration correctness rather than a user-facing F# feature.
  - Agentic workflow, state-machine, and dependency-update PRs: repository automation and infrastructure changes, not product release-note material.
-->

## Bug fixes and other improvements

### Compiler correctness

- `let _ = &expr` now compiles like an equivalent named binding instead of incorrectly reporting FS0421 ([dotnet/fsharp #19811](https://github.com/dotnet/fsharp/pull/19811)).
- Single-case active pattern names and partial active pattern names now reject non-function bindings ([dotnet/fsharp #19763](https://github.com/dotnet/fsharp/pull/19763)).
- SRTP calls constrained to `member get_Item` now resolve string indexers instead of hitting an internal compiler error ([dotnet/fsharp #19757](https://github.com/dotnet/fsharp/pull/19757)).
- Null refinement in pattern matching now preserves type aliases when possible ([dotnet/fsharp #19745](https://github.com/dotnet/fsharp/pull/19745)).
- Anonymous record type aliases with postfix type operators no longer produce a spurious parse error when the closing `|}` is column-aligned ([dotnet/fsharp #19762](https://github.com/dotnet/fsharp/pull/19762)).
- Quotations no longer expose the compiler's empty-string match lowering in quoted ASTs ([dotnet/fsharp #19923](https://github.com/dotnet/fsharp/pull/19923)).
- Inner recursive functions under `--realsig+` now regain the intended codegen shape, including static lifting and tail calls in cases that previously degraded ([dotnet/fsharp #19882](https://github.com/dotnet/fsharp/pull/19882)).
- `use` bindings with `as` patterns or aliases no longer emit duplicate `Dispose` calls for the same value ([dotnet/fsharp #19858](https://github.com/dotnet/fsharp/pull/19858)).
- Named arguments on indexer setters no longer cause an internal compiler error ([dotnet/fsharp #19851](https://github.com/dotnet/fsharp/pull/19851)).
- Optimized Release builds no longer relocate protected base-field access into illegal IL that can throw `FieldAccessException` at runtime ([dotnet/fsharp #19964](https://github.com/dotnet/fsharp/pull/19964)).
- Computation expressions such as `task { let! ... }` no longer report FS1110 when a generic IL extension method is in scope ([dotnet/fsharp #19938](https://github.com/dotnet/fsharp/pull/19938)).
- Recursive self-reference ref cells are no longer classified as user-written mutable bindings ([dotnet/fsharp #19918](https://github.com/dotnet/fsharp/pull/19918)).

### Diagnostics and tooling

- Reference assembly MVIDs produced with `--refout` are now deterministic across builds ([dotnet/fsharp #19801](https://github.com/dotnet/fsharp/pull/19801)).
- Type names in generic static member access expressions are colorized correctly when the type argument is qualified ([dotnet/fsharp #19800](https://github.com/dotnet/fsharp/pull/19800)).
- XML documentation validation for get/set property pairs now accounts for parameters documented across both accessors ([dotnet/fsharp #19884](https://github.com/dotnet/fsharp/pull/19884)).
- Editor diagnostics in Visual Studio are no longer duplicated by the F# analyzer workaround ([dotnet/fsharp #19812](https://github.com/dotnet/fsharp/pull/19812)).
- FS3261 nullness diagnostics for dot access now pinpoint the receiver and name the member and binding involved ([dotnet/fsharp #19814](https://github.com/dotnet/fsharp/pull/19814)).
- Namespace/type collisions now get a dedicated diagnostic instead of being reported as namespace/module collisions ([dotnet/fsharp #19802](https://github.com/dotnet/fsharp/pull/19802)).
- Format specifier locations in computation expressions are no longer reported twice after desugaring ([dotnet/fsharp #19791](https://github.com/dotnet/fsharp/pull/19791)).
- Wildcard patterns inside `member _.` bodies no longer resolve to the member's synthetic instance identifier in hover and symbol lookup ([dotnet/fsharp #19760](https://github.com/dotnet/fsharp/pull/19760)).
- Empty-bodied computation expressions in pipelines now keep meaningful source ranges, so diagnostics can point to the right source location ([dotnet/fsharp #19849](https://github.com/dotnet/fsharp/pull/19849)).
- QuickParse completion now handles indexed expressions before a dot, such as `a.[0].Data.` and `[1; 2].Length.` ([dotnet/fsharp #19934](https://github.com/dotnet/fsharp/pull/19934)).
- QuickInfo and symbol-use results for overloaded `[<CustomOperation>]` keywords now report the overload chosen by F# overload resolution ([dotnet/fsharp #19865](https://github.com/dotnet/fsharp/pull/19865)).
- Analysis now recovers after a language-version check error instead of leaving the rest of the file in a broken state ([dotnet/fsharp #19970](https://github.com/dotnet/fsharp/pull/19970)). Thank you [@auduchinok](https://github.com/auduchinok)!

### FSI and scripting

- FSI now pretty-prints anonymous records with `{| ... |}` delimiters and struct anonymous records with `struct {| ... |}` ([dotnet/fsharp #19919](https://github.com/dotnet/fsharp/pull/19919)).
- Open-declaration insertion in `.fsx` scripts now places suggested `open` declarations after leading `#r` and `#load` directives ([dotnet/fsharp #19879](https://github.com/dotnet/fsharp/pull/19879)).

## Community contributors

Thank you contributors! ❤️

- [@0101](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3A0101)
- [@abonie](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aabonie)
- [@auduchinok](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aauduchinok)
- [@edgarfgp](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aedgarfgp)
- [@kerams](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Akerams)
- [@majocha](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Amajocha)
- [@techiedesu](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Atechiedesu)

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)

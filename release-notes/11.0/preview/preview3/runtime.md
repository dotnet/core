# .NET Runtime in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new runtime features and performance work:

- [Runtime async is easier to adopt](#runtime-async-is-easier-to-adopt)
- [The JIT keeps shaving off common overhead](#the-jit-keeps-shaving-off-common-overhead)
- [Browser and WebAssembly work continues to cluster into a real story](#browser-and-webassembly-work-continues-to-cluster-into-a-real-story)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Runtime updates in .NET 11:

- [What's new in .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime)

<!-- Verified against Microsoft.NETCore.App.Ref@11.0.0-preview.3.26179.102 -->

## Runtime async is easier to adopt

Preview 2 introduced runtime async as a preview feature. Preview 3 makes it much
more practical to try. The `[RequiresPreviewFeatures]` gate is gone, so a
`net11.0` project no longer needs `<EnablePreviewFeatures>true</EnablePreviewFeatures>`
just to enable `runtime-async=on`
([dotnet/runtime#124488](https://github.com/dotnet/runtime/pull/124488)).

Support for NativeAOT and ReadyToRun also landed in this preview
([dotnet/runtime#123952](https://github.com/dotnet/runtime/pull/123952),
[dotnet/runtime#124203](https://github.com/dotnet/runtime/pull/124203),
[dotnet/runtime#125420](https://github.com/dotnet/runtime/pull/125420)).
Follow-on work reuses continuation objects more aggressively and avoids saving
unchanged locals, which reduces allocation pressure in async-heavy code
([dotnet/runtime#125556](https://github.com/dotnet/runtime/pull/125556),
[dotnet/runtime#125615](https://github.com/dotnet/runtime/pull/125615)).

```diff
 <PropertyGroup>
   <Features>runtime-async=on</Features>
-  <EnablePreviewFeatures>true</EnablePreviewFeatures>
 </PropertyGroup>
```

## The JIT keeps shaving off common overhead

Preview 3 continues the steady JIT work that benefits normal code without any
source changes. Common patterns like multi-target `switch` expressions now fold
into simpler branchless checks
([dotnet/runtime#124567](https://github.com/dotnet/runtime/pull/124567)),
index-from-end access can drop more redundant bounds checks
([dotnet/runtime#124571](https://github.com/dotnet/runtime/pull/124571)), and
`uint` to `float` / `double` casts are faster on pre-AVX-512 x86 hardware
([dotnet/runtime#124114](https://github.com/dotnet/runtime/pull/124114)).

The supporting work in range analysis, common subexpression elimination, and loop
cloning is more technical, but it all points in the same direction: the JIT is
getting better at recognizing the code people already write and emitting tighter
machine code for it.

```csharp
bool isSmall = x is 0 or 1 or 2 or 3 or 4;
int tail = values[^1] + values[^2];
double d = someUint;
```

## Browser and WebAssembly work continues to cluster into a real story

The browser/CoreCLR work in Preview 3 is still a specialist story, but it is now
coherent enough to call out as a group. CoreCLR-in-the-browser can load WebCIL
payloads
([dotnet/runtime#124758](https://github.com/dotnet/runtime/pull/124758),
[dotnet/runtime#124904](https://github.com/dotnet/runtime/pull/124904)), emit
symbols and better stack traces for debugging
([dotnet/runtime#124500](https://github.com/dotnet/runtime/pull/124500),
[dotnet/runtime#124483](https://github.com/dotnet/runtime/pull/124483)), and
marshal `float[]`, `Span<float>`, and `ArraySegment<float>` more directly across
JS boundaries
([dotnet/runtime#123642](https://github.com/dotnet/runtime/pull/123642)).

None of these items is a lead story on its own, but together they make the
browser and WASM experience feel less experimental than it did a few previews
ago.

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - cDAC and diagnostics plumbing: important internal debugger infrastructure, but too insider-focused for public release notes.
  - AVX-512 BMM and several architecture-specific intrinsics: real work for specialists, but not broad enough for a Preview 3 headline.
  - OpenBSD bring-up and other platform-enablement work: welcome progress, but still too narrow for the 80/20 cut.
-->

## Breaking changes

- Unhandled `BackgroundService` exceptions now propagate from the host instead of
  being quietly swallowed
  ([dotnet/runtime#124863](https://github.com/dotnet/runtime/pull/124863)).
- NativeAOT native-library outputs now use the conventional `lib` prefix on
  Unix. If your scripts expected `MyLib.so`, update them to look for
  `libMyLib.so`
  ([dotnet/runtime#124611](https://github.com/dotnet/runtime/pull/124611)).

## Bug fixes

- **JIT**
  - Fixed correctness issues around async save/restore, if-conversion, and
    return-block cloning
    ([dotnet/runtime#125044](https://github.com/dotnet/runtime/pull/125044),
    [dotnet/runtime#125072](https://github.com/dotnet/runtime/pull/125072),
    [dotnet/runtime#124642](https://github.com/dotnet/runtime/pull/124642)).
- **VM / runtime async**
  - Fixed a race leak in runtime-async resumption stubs and a lock-level issue
    that could deadlock under contention
    ([dotnet/runtime#125407](https://github.com/dotnet/runtime/pull/125407),
    [dotnet/runtime#125675](https://github.com/dotnet/runtime/pull/125675)).

## Community contributors

Thank you contributors! ❤️

- [@a74nh](https://github.com/a74nh)
- [@alexcovington](https://github.com/alexcovington)
- [@am11](https://github.com/am11)
- [@benaadams](https://github.com/benaadams)
- [@BoyBaykiller](https://github.com/BoyBaykiller)
- [@filipnavara](https://github.com/filipnavara)
- [@FixBo](https://github.com/FixBo)
- [@gbalykov](https://github.com/gbalykov)
- [@gwr](https://github.com/gwr)
- [@jonathandavies-arm](https://github.com/jonathandavies-arm)
- [@LuckyXu-HF](https://github.com/LuckyXu-HF)
- [@mrvoorhe](https://github.com/mrvoorhe)
- [@Pietrodjaowjao](https://github.com/Pietrodjaowjao)
- [@saucecontrol](https://github.com/saucecontrol)
- [@sethjackson](https://github.com/sethjackson)
- [@shushanhf](https://github.com/shushanhf)
- [@SingleAccretion](https://github.com/SingleAccretion)
- [@SkyShield](https://github.com/SkyShield)
- [@snickolls-arm](https://github.com/snickolls-arm)
- [@tmds](https://github.com/tmds)
- [@tpa95](https://github.com/tpa95)
- [@ylpoonlg](https://github.com/ylpoonlg)
- [@yykkibbb](https://github.com/yykkibbb)

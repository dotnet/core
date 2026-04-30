# WPF in .NET 11 Preview 4 - Release Notes

There are no new user-facing features or improvements in WPF in this release. Most changes in the Preview 4 commit range are VMR source-code syncs, dependency flow updates from `dotnet-wpf-int`, and internal tooling (a `Microsoft.Windows.CsWin32` bump and a CodeQL SSRF suppression in `WpfWebRequestHelper`).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - WeakEventTable.Purge InvalidOperationException fix ([dotnet/wpf #11521](https://github.com/dotnet/wpf/pull/11521)): community fix from @kmaddock. Already documented in the Preview 3 release notes; suppressed here per the preview-to-preview deduplication rule.
  - Suppress CodeQL SM03781 in WpfWebRequestHelper ([dotnet/wpf #11585](https://github.com/dotnet/wpf/pull/11585)): code-analysis annotation only, no user-visible behavior change.
  - Update Microsoft.Windows.CsWin32 to 0.3.269 ([dotnet/wpf #11589](https://github.com/dotnet/wpf/pull/11589)): build-time dependency bump.
  - 25 VMR source-code syncs and dependency flow PRs (e.g. #11483, #11480, #11496, #11491, #11497, #11503, #11505, #11508, #11518, #11526, #11533, #11529, #11536, #11543, #11545, #11547, #11550, #11555, #11560, #11563, #11572, #11574, #11581, #11583, #11595): repo automation, no user-facing change.
-->

## Community contributors

Thank you contributors! ❤️

- [@kmaddock](https://github.com/dotnet/wpf/pulls?q=is%3Apr+is%3Amerged+author%3Akmaddock)

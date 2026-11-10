# .NET MAUI in .NET 11 - Release Notes

These notes cover changes since .NET 11 RC 2 in .NET MAUI, .NET for Android,
and .NET for iOS, Mac Catalyst, macOS, and tvOS. For the full release overview,
see [What's new in .NET MAUI for .NET 11](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-11).

> [!NOTE]
> This draft is based on release-branch source. The final GA workload versions,
> source revisions, and Apple toolchain requirement still need release-owner
> confirmation.

- [Breaking changes and migration](#breaking-changes-and-migration)
- [Upgrading from .NET 10](#upgrading-from-net-10)
- [Updating from previews and release candidates](#updating-from-previews-and-release-candidates)
- [Controls](#controls)
- [Platform features](#platform-features)
- [XAML](#xaml)
- [Prepare for Google Play code optimization requirements](#prepare-for-google-play-code-optimization-requirements)
- [Migrate to the UIKit scene lifecycle on iOS and Mac Catalyst](#migrate-to-the-uikit-scene-lifecycle-on-ios-and-mac-catalyst)
- [Apple platforms](#apple-platforms)
- [Bug fixes](#bug-fixes)
- [Contributors](#contributors)

## Breaking changes and migration

### Upgrading from .NET 10

Direct source calls to
`Android.Runtime.JNINativeWrapper.CreateDelegate(Delegate)` now produce
compiler error `CS0619`. Rebuild older binding sources with the current
.NET for Android binding generator and use its generated JNI callbacks.
Existing compiled bindings retain the public method and implementation
([dotnet/android#13128](https://github.com/dotnet/android/pull/13128)).

For changes introduced earlier in .NET 11, including the runtime transition
and platform minimums, see the
[full .NET MAUI overview](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-11)
and [runtime and compilation guidance](https://learn.microsoft.com/dotnet/maui/deployment/runtimes-compilation?view=net-maui-11.0).

### Updating from previews and release candidates

Compared with RC 2, Android CoreCLR builds now reject an explicit `RunAOTCompilation=false` with
error `XA1044`. This Mono property does not disable CoreCLR ReadyToRun.
Remove it and use `PublishReadyToRun=false` when you intend to disable
ReadyToRun compilation
([dotnet/android#12960](https://github.com/dotnet/android/pull/12960)).

## Controls

### Android Shell creates inactive pages on demand

Android Shell now waits until a tab is first selected before creating its
previously unused `ContentTemplate` page, handler, and navigation host. The
selected page still initializes during startup. This preserves independent
navigation stacks and the existing tab infrastructure while avoiding
construction of pages that the user has not opened
([dotnet/maui#39315](https://github.com/dotnet/maui/pull/39315)).

## Platform features

### Share text with an image preview

`ShareTextRequest.PreviewImage` accepts a `ShareFile` containing an image for
the system share sheet. It applies to text and link sharing on iOS,
Mac Catalyst, and Android 10 (API 29) or later. Other platforms ignore the
property. Leaving it unset preserves existing sharing behavior
([dotnet/maui#38825](https://github.com/dotnet/maui/pull/38825)).

### Request a move during drag and drop

`DataPackageOperation.Move` lets a drop target request a move through
`DragEventArgs.AcceptedOperation`. On iOS and Mac Catalyst, the native drag
session must permit moving. Copy remains the default and is preferred when
both Copy and Move are accepted
([dotnet/maui#39016](https://github.com/dotnet/maui/pull/39016)).

The app remains responsible for updating its data after a successful drop.
This option does not remove source data, move a view, or implement
CollectionView reordering. On Windows, the drag source must also allow Move
through its native `AllowedOperations`; the Android implementation is unchanged.

## XAML

### C# expressions no longer require preview opt-in

```xml
<PropertyGroup>
  <MauiXamlInflator>SourceGen</MauiXamlInflator>
</PropertyGroup>
```

XAML C# expressions no longer require `EnablePreviewFeatures=true`. Source
generation remains required; XamlC and runtime inflation do not support this
syntax. The generator no longer reports `MAUIX2012` for a missing preview
flag. Existing ambiguity checks and restrictions on async lambda event
handlers remain
([dotnet/maui#39384](https://github.com/dotnet/maui/pull/39384)).

This change applies to C# expressions. It does not declare every XAML feature
or XAML Incremental Hot Reload generally available.

XAML updates also keep component identities synchronized when named elements
change or siblings are reordered. Source generation handles nested
`OnPlatform` and `OnIdiom` markup, and diagnostics with
`MauiXamlLineInfo=enable` now point to the physical XAML file, including linked
files
([dotnet/maui#39168](https://github.com/dotnet/maui/pull/39168),
[dotnet/maui#39373](https://github.com/dotnet/maui/pull/39373),
[dotnet/maui#39425](https://github.com/dotnet/maui/pull/39425)).

## Prepare for Google Play code optimization requirements

Starting in February 2027, Google Play requires at least 25% coverage for each
of code optimization, shrinking, and obfuscation. This applies to apps with
more than 10 MB of DEX code and games with more than 50 MB. See the
[Google Play requirements](https://support.google.com/googleplay/android-developer/answer/17492799#dex_code_optimization)
and [original announcement](https://android-developers.googleblog.com/2026/08/app-quality-memory-optimization-secure-onboarding.html).

On .NET 11, enable R8 for Release builds in your `.csproj` file:

```xml
<PropertyGroup Condition=" '$(Configuration)' == 'Release' ">
  <AndroidLinkTool>r8</AndroidLinkTool>
</PropertyGroup>
```

When R8 is enabled, .NET 11 defaults `AndroidR8ObfuscationMode` to
`private-members`. You do not need to set this property unless your project
overrides it. In .NET 10, the default is `disabled`.

These settings apply to Java bytecode (DEX), not managed .NET assemblies.
Test your Release build, then check the optimization, shrinking, and
obfuscation percentages in Google Play Console's **App bundle explorer**.
Confirm that your uploaded bundle meets all three thresholds.

R8 fixes preserve required Java code and fields during incremental builds
and obfuscation
([dotnet/android#12974](https://github.com/dotnet/android/pull/12974),
[dotnet/android#13077](https://github.com/dotnet/android/pull/13077),
[dotnet/android#13239](https://github.com/dotnet/android/pull/13239)).

## Migrate to the UIKit scene lifecycle on iOS and Mac Catalyst

Apps built against the iOS 27 and Mac Catalyst 27 SDKs (Xcode 27) must use the
UIKit scene-based lifecycle
([TN3187](https://developer.apple.com/documentation/technotes/tn3187-migrating-to-the-uikit-scene-based-life-cycle)).
Apps that still use the legacy `UIApplicationDelegate`-only lifecycle crash at
launch on iOS 27 or Mac Catalyst 27 with
`UIScene life cycle is required for apps built with this SDK.`

New .NET MAUI project templates include the required `UIApplicationSceneManifest`
and `SceneDelegate` configuration, and .NET MAUI forwards scene-based App
Actions and `WebAuthenticator` callbacks
([dotnet/maui#38601](https://github.com/dotnet/maui/pull/38601)). Building
against SDK 27.0 or later also checks that the merged `Info.plist` contains a
`UIApplicationSceneManifest` dictionary and reports error `MT7199` when it is
missing ([dotnet/macios#26988](https://github.com/dotnet/macios/pull/26988)).

Updating .NET MAUI packages or workloads does not update existing projects. To
build an existing app with Xcode 27, add a `SceneDelegate` and
`UIApplicationSceneManifest` to your iOS and Mac Catalyst platforms and migrate
any custom lifecycle, deep-link, or App Actions callbacks to scene events. For
step-by-step migration guidance, see
[Migrate to the UIKit scene lifecycle](https://learn.microsoft.com/dotnet/maui/ios/uikit-scene-lifecycle?view=net-maui-11.0)
and
[Get Your .NET MAUI App Ready for Xcode 27](https://devblogs.microsoft.com/dotnet/migrate-dotnet-maui-apps-uikit-scene-lifecycle/).

## Apple platforms

- **Incremental builds** avoid recompiling the registrar for CoreCLR builds
  using the trimmable static registrar on ARM64 and x64 when only assembly
  module version identifiers change. Unchanged registrar type maps retain their
  timestamps, and ReadyToRun builds cache input hashes
  ([dotnet/macios#26824](https://github.com/dotnet/macios/pull/26824),
  [dotnet/macios#26825](https://github.com/dotnet/macios/pull/26825),
  [dotnet/macios#26821](https://github.com/dotnet/macios/pull/26821)).
- **Manifest and entitlements changes** now invalidate the appropriate build,
  native-link, and signing outputs. Mac Catalyst apps are signed again when
  their entitlements change
  ([dotnet/macios#26853](https://github.com/dotnet/macios/pull/26853)).
- **iOS Debug builds from Windows** preserve parameter names in trimmed
  assemblies during Pair to Mac builds, matching Mac-driven builds for
  reflection-based consumers
  ([dotnet/macios#26852](https://github.com/dotnet/macios/pull/26852)).

## Bug fixes

- **.NET for Android**
  - [Preserve Java exports during full trimming with trimmable type maps](https://github.com/dotnet/android/pull/13269)

## Contributors

Thank you to the contributors whose changes are included in the source ranges
reviewed for this draft:

[@dalexsoto](https://github.com/dalexsoto),
[@Dhivya-SF4094](https://github.com/Dhivya-SF4094),
[@edgiardina](https://github.com/edgiardina),
[@HarishwaranVijayakumar](https://github.com/HarishwaranVijayakumar),
[@jfversluis](https://github.com/jfversluis),
[@jonathanpeppers](https://github.com/jonathanpeppers),
[@jsuarezruiz](https://github.com/jsuarezruiz),
[@kevin68](https://github.com/kevin68),
[@kubaflo](https://github.com/kubaflo),
[@mattleibow](https://github.com/mattleibow),
[@morning4coffe-dev](https://github.com/morning4coffe-dev),
[@PureWeen](https://github.com/PureWeen),
[@rolfbjarne](https://github.com/rolfbjarne),
[@Shalini-Ashokan](https://github.com/Shalini-Ashokan),
[@sheiksyedm](https://github.com/sheiksyedm),
[@simonrozsival](https://github.com/simonrozsival),
[@StephaneDelcroix](https://github.com/StephaneDelcroix),
[@SuthiYuvaraj](https://github.com/SuthiYuvaraj),
[@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852),
[@Tamilarasan-Paranthaman](https://github.com/Tamilarasan-Paranthaman),
[@TamilarasanSF4853](https://github.com/TamilarasanSF4853), and
[@Vignesh-SF3580](https://github.com/Vignesh-SF3580).

<!-- Release-owner publication gates, checked 2026-11-03:
  - Confirm the final GA workload set and component package/source revisions.
    No stable .NET 11 mobile release pages/tags were visible in the release/tag
    queries, and stable MAUI Controls/manifest packages were not visible in
    the checked NuGet.org/dotnet11 feed indexes. Stable source branding alone
    is not evidence that a package shipped.
  - Reviewed MAUI candidate: release/11.0.1xx at
    4645bd1707064533ef2fdd0220bb87de36ca928d, compared with public RC 2 tag
    11.0.100-rc.2.26513.2 (d32b79928709cf53b671336dabd0caef5a679fc2).
  - That MAUI revision pins Android 37.2.29 at
    6d4cadfefbeab3fb1bab7a13b968833799fc7c48, compared with public RC 2
    37.2.0-rc.2.84 (801f9ecbab5118b13d21cb52409e507ad4b2feb7).
  - That MAUI revision pins Apple 27.0.12230 at
    e4732a6dcad66fe70491ad3f808db1e3f2a04541, compared with public RC 2 tag
    dotnet-11.0.1xx-rc2-12212 (a75b11fe9cdbd66a6ddb8bfea120d006c1ec1e8d).
    The current Apple release branch also contains later Xcode 27.1/27.2 work.
    Confirm which Apple revision and Xcode version belong to GA before adding
    those changes; they are excluded from this draft.
  - Refresh the selected changes, introduce/revert checks, contributor list,
    and release links against the confirmed final cutoffs.
  - Finalize the linked What's New page. dotnet/docs-maui#3569 remains draft
    and its RC 2 content is not on main. The conceptual C# expressions article
    still describes the RC 2 preview flag, which #39384 removes.
  - The shared build-metadata.json explicitly leaves the installed SDK/VMR
    correlation unverified. It does not establish mobile workload versions.
-->

<!-- Editorial scope:
  - .NET 9 and .NET 10 GA component notes cover final changes and link to
    What's New for the full release. This draft follows that split while
    using the current curated component-note format.
  - MAUI #37674/#39010 and #39247/#39251 were introduced and reverted in
    the reviewed range; no net change is claimed.
  - Stable packaging/API ledger changes are release preparation, not features.
  - The Avalonia template dependency update (#39455) still selects an RC 2
    package in this candidate; no Avalonia GA availability is claimed.
  - Contributor scope is the reviewed RC 2-to-candidate ranges across all
    three mobile repositories, not a full-year contributor rollup.
-->

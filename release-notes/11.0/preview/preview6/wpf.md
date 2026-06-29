# WPF in .NET 11 Preview 6 - Release Notes

<!-- Verified against changes.json and Microsoft.WindowsDesktop.App.Ref P5-to-P6 API diff; no public API changes. -->

There are no new user-facing features in WPF in this release.

## Bug fixes

- **Publishing**
  - Self-contained WPF apps published for Windows now include `ijwhost.dll` as a native asset. This prevents launch failures when the app loads mixed-mode WPF assemblies ([dotnet/wpf #11664](https://github.com/dotnet/wpf/pull/11664)).

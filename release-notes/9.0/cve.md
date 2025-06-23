# .NET 9 CVEs

The .NET Team releases [monthly updates for .NET 9](https://github.com/dotnet/announcements/labels/.NET%209.0) on [Patch Tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday). These updates often include security fixes. If you are on an older version, your app may be vulnerable.

Your app needs to be on the latest .NET 9 patch version to be secure. The longer you wait to upgrade, the greater the exposure to CVEs.

## Which CVEs apply to my app?

Your app may be vulnerable to the following published security [CVEs](https://www.cve.org/) if you are using an older version.

- 9.0.6 (June 2025)
  - [CVE-2025-30399 | .NET Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/362)
- 9.0.5 (May 2025)
  - [CVE-2025-26646 | .NET and Visual Studio Spoofing Vulnerability](https://github.com/dotnet/announcements/issues/356)
- 9.0.4 (April 2025)
  - [CVE-2025-26682 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/352)
- 9.0.3 (March 2025)
  - [CVE-2025-24070 | .NET Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/348)
- 9.0.2 (February 2025)
  - No new CVEs.
- 9.0.1 (January 2025)
  - [CVE-2025-21171 | .NET Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/340)
  - [CVE-2025-21172 | .NET Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/339)
  - [CVE-2025-21173 | .NET Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/337)
  - [CVE-2025-21176 | .NET Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/338)
- 9.0.0 (November 2024)
  - [CVE-2024-43498 | .NET Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/334)
  - [CVE-2024-43499 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/333)

The CVE exposure is cumulative. For example, `8.0.0` users may be vulnerable to the CVEs present in `9.0.0` and newer releases. Similarly, `9.0.3` users may be vulnerable to the CVEs present in `9.0.4` and newer releases. The latest release is not vulnerable to any published CVEs.

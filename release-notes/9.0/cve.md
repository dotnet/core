# .NET 9 CVEs

The .NET Team releases [monthly updates for .NET 9](https://github.com/dotnet/announcements/labels/.NET%209.0) on [Patch Tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday). These updates often include security fixes. If you are on an older version, your app may be vulnerable.

Your app needs to be on the latest .NET 8 patch version to be secure. The longer you wait to upgrade, the greater the exposure to CVEs.

## Which CVEs apply to my app?

Your app may be vulnerable to the following published security [CVEs](https://www.cve.org/) if you are using the given version or older.

- 9.0.0 (November 2024)
  - [CVE-2024-43498 | .NET Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/334)
  - [CVE-2024-43499 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/333)

The CVE exposure is cumulative. For example, `8.0.0` users may be vulnerable to the CVEs present in `9.0.0` and newer releases. Similarly, `9.0.3` users may be vulnerable to the CVEs present in `9.0.4` and newer releases. The latest release is not vulnerable to any published CVEs.

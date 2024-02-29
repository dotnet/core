# .NET 8 CVEs

The .NET Team releases [monthly updates for .NET 8](https://github.com/dotnet/announcements/labels/.NET%208.0) on [Patch Tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday). These updates often include security fixes. If you are on an older version, your app may be vulnerable.

Your app needs to be on the latest .NET 8 patch version to be secure. The longer you wait to upgrade, the greater the exposure to CVEs.

## Which CVEs apply to my app?

Your app may be vulnerable to the following published security [CVEs](https://www.cve.org/) if you are using the given version or older.
- 8.0.2 (February 2024)
  - [CVE-2024-21386 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/295)
  - [CVE-2024-21404 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/296)
- 8.0.1 (January 2024)
  - [CVE-2024-0056 | .NET Information Disclosure Vulnerability](https://github.com/dotnet/announcements/issues/292)
  - [CVE-2024-0057 | .NET Security Feature Bypass Vulnerability](https://github.com/dotnet/announcements/issues/291)
  - [CVE-2024-21319 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/290)
- 8.0.0 (November 2023)
  - [CVE-2023-36049 | .NET Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/287)
  - [CVE-2023-36558 | .NET Security Feature Bypass Vulnerability](https://github.com/dotnet/announcements/issues/288)
  - [CVE-2023-36038 | .NET Security Feature Bypass Vulnerability](https://github.com/dotnet/announcements/issues/286)

The CVE exposure is cumulative. For example, `8.0.0` users may be vulnerable to the CVEs present in `8.0.0` and newer releases. Similarly, `8.0.3` users may be vulnerable to the CVEs present in `8.0.4` and newer releases. The latest release is not vulnerable to any published CVEs.

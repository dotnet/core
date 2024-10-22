# .NET 8 CVEs

The .NET Team releases [monthly updates for .NET 8](https://github.com/dotnet/announcements/labels/.NET%208.0) on [Patch Tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday). These updates often include security fixes. If you are on an older version, your app may be vulnerable.

Your app needs to be on the latest .NET 8 patch version to be secure. The longer you wait to upgrade, the greater the exposure to CVEs.

## Which CVEs apply to my app?

Your app may be vulnerable to the following published security [CVEs](https://www.cve.org/) if you are using the given version or older.

- 8.0.10 (October 2024)
  - [CVE-2024-38229 | .NET Remote Code Execution Vulnerability](https://github.com/dotnet/announcements/issues/326)
  - [CVE-2024-43483 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/327)
  - [CVE-2024-43484 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/328)
  - [CVE-2024-43485 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/329)
- 8.0.8 (August 2024)
  - [CVE-2024-38167 | .NET Information Disclosure Vulnerability](https://github.com/dotnet/announcements/issues/319)
  - [CVE-2024-38168 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/320)
- 8.0.7 (July 2024)
  - [CVE-2024-38095 | .NET Remote code Execution Vulnerability](https://github.com/dotnet/announcements/issues/312)
  - [CVE-2024-35264 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/314)
  - [CVE-2024-30105 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/315)
- 8.0.6 (May 28 2024)
  - No new CVEs.
- 8.0.5 (May 2024)
  - [CVE-2024-30045 | .NET Remote code Execution Vulnerability](https://github.com/dotnet/announcements/issues/307)
  - [CVE-2024-30046 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/308)
- 8.0.4 (April 2024)
  - [CVE-2024-21409 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/303)
- 8.0.3 (March 2024)
  - [CVE-2024-21392 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/299)
  - [CVE-2024-26190 | Microsoft QUIC Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/300)
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

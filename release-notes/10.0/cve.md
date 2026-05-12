# .NET 10 CVEs

The .NET Team releases [monthly updates for .NET 10](https://github.com/dotnet/announcements/labels/.NET%2010.0) on [Patch Tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday). These updates often include security fixes. If you are on an older version, your app may be vulnerable.

Your app needs to be on the latest .NET 10 patch version to be secure. The longer you wait to upgrade, the greater the exposure to CVEs.

## Which CVEs apply to my app?

Your app may be vulnerable to the following published security [CVEs](https://www.cve.org/) if you are using an older version.

- 10.0.8 (May 2026)
  - [CVE-2026-32177 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/created_by/xxx)
  - [CVE-2026-35433 | .NET Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/created_by/xxx)
  - [CVE-2026-32175 | .NET Core Tampering Vulnerability](https://github.com/dotnet/announcements/issues/created_by/xxx)
  - [CVE-2026-42899 | ASP.NET Core Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/created_by/xxx)
- 10.0.7 (April 2026)
  - [CVE-2026-40372 | ASP.NET Core Security Feature Bypass Vulnerability](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-40372) 
- 10.0.6 (April 2026)
  - [CVE-2026-26171 | .NET Denial of Service Vulnerability](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-26171) 
  - [CVE-2026-32203 | .NET Denial of Service Vulnerability](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-32203) 
  - [CVE-2026-33116 | .NET Denial of Service Vulnerability](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-33116) 
  - [CVE-2026-32178 | .NET Spoofing Vulnerability](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-32178) 
- 10.0.5 (March 2026)
  - No new CVEs
- 10.0.4 (March 2026)
  - [CVE-2026-26130 | .NET Denial of Service Vulnerability ](https://github.com/dotnet/announcements/issues/385)
  - [CVE-2026-26127 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/384)
  - [CVE-2026-26131 | .NET Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/386)
- 10.0.3 (February 2026)
  - [CVE-2026-21218 | .NET Security Feature Bypass Vulnerability](https://github.com/dotnet/announcements/issues/380)
- 10.0.2 (January 2026)
  - No new CVEs
- 10.0.1 (December 2025)
  - No new CVEs
- 10.0.0 (November 2025)
  - No new CVEs

The CVE exposure is cumulative. For example, `10.0.0` users may be vulnerable to the CVEs present in `10.0.0` and newer releases. Similarly, `10.0.3` users may be vulnerable to the CVEs present in `10.0.4` and newer releases. The latest release is not vulnerable to any published CVEs.

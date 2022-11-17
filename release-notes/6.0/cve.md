# .NET 6 CVEs

The .NET Team releases [monthly updates for .NET 6](https://github.com/dotnet/announcements/labels/.NET%206.0) on [Patch Tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday). These updates often include security fixes. If you are on an older version, your app may be vulnerable.

Your app needs to be on the latest .NET 6 patch version to be secure. The longer you wait to upgrade, the greater the exposure to CVEs.

## Which CVEs apply to my app?

Your app may be vulnerable to the following published security [CVEs](https://www.cve.org/) if you are using the given version or older.

- 6.0.11 (November 2022)
  - No additional CVEs.
- 6.0.10 (October 2022)
  - No additional CVEs.
- 6.0.9 (September 2022)
  - [CVE 2022-41032 | .NET Core Elevation of Privilege Vulnerability](https://github.com/dotnet/announcements/issues/236)
- 6.0.8 (August 2022)
  - [CVE 2022-38013 | .NET Core Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/234)
- 6.0.7 (July 2022)
  - [CVE 2022-34716 | .NET Core Information Disclosure Vulnerability](https://github.com/dotnet/announcements/issues/232)
- 6.0.6 (June 2022)
  - No additional CVEs.
- 6.0.5 (May 2022)
  - [CVE 2022-30184 | .NET Core Information Disclosure Vulnerability](https://github.com/dotnet/announcements/issues/225)
- 6.0.4 (April 2022)
  - [CVE 2022-29145 | ASP.NET Core Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/222)
  - [CVE 2022-23267 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/221)
  - [ CVE 2022-29117 | .NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/220)
- 6.0.3 (March 2022)
  - No additional CVEs.
- 6.0.2 (February 2022)
  - [CVE-2022-24512 | .NET Remote Code Execution](https://github.com/dotnet/announcements/issues/213)
  - [CVE-2022-24464 | ASP.NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/212)
- 6.0.1 (December 2021
  - [CVE-2022-21986 | ASP.NET Denial of Service Vulnerability](https://github.com/dotnet/announcements/issues/207)
- 6.0.0 (November 2021)
  - [CVE-2021-43877 | ASP.NET Core Elevation of privilege Vulnerability](https://github.com/dotnet/announcements/issues/206)

The CVEs are displayed one month offset from when they were released. For example, the CVE listed with `6.0.0` was disclosed and a fix was published with `6.0.1`. `6.0.1` is not vulnerable to that CVE while `6.0.0` is. As a result, the CVE is listed with `6.0.0`, where it still applies. The same model is used for the other releases. 

The CVE exposure is cumulative. For example, `6.0.0` users may be vulnerable to the CVEs present in `6.0.0` and newer releases. Similarly, `6.0.3` users may be vulnerable to the CVEs present in `6.0.4` and newer releases. The latest release is not vulnerable to any published CVEs.

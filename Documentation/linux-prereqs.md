# Linux System Prerequisites for .NET Core

The following table represents the minimum library requirements to create, and run, a basic "hello world" console or MVC application with .NET Core. This table lists .NET Core Runtime requirements; applications could introduce additional dependencies. 

| Distro         | 2.1                       | 2.2                       | 3.1                       |
| ------------   | ------------------------- | ------------------------- | ------------------------- |
| Ubuntu 19.04   | libicu63, libssl1.1       | libicu63, libssl1.1       | libicu63, libssl1.1       |
| Ubuntu 18.04   | libicu60, openssl1.0      | libicu60, openssl1.0      | libicu60, openssl1.0      |
| Ubuntu 16.04   | libicu55                  | libicu55                  | libicu55                  |
| Debian 10      | libicu63, libssl1.1       | libicu63, libssl1.1       | libicu63, libssl1.1       |
| Debian 9       | libicu57, libssl1.0.2     | libicu57, libssl1.0.2     | libicu57, libssl1.0.2     |
| Fedora 30      | libicu, openssl           | libicu, openssl           | libicu, openssl           |
| Fedora 29      | libicu, openssl           | libicu, openssl           | libicu, openssl           |
| Fedora 28      | libicu, compat-openssl10  | libicu, compat-openssl10  | libicu, compat-openssl10  |
| CentOS 7       | libicu                    | libicu                    | libicu                    |
| OpenSUSE Leap  | libicu                    | libicu                    | libicu                    |
| SLES 15        | libicu                    | libicu                    | libicu                    |
| SLES 12        | libicu                    | libicu                    | libicu                    |
| Alpine Linux   | icu-libs, krb5-libs, libintl, libssl1.1 (Alpine >= 3.9), libssl1.0 (< 3.9), libstdc++, lttng-ust, numactl (optional), zlib | icu-libs, krb5-libs, libintl, libssl1.1 (Alpine >= 3.9), libssl1.0 (< 3.9), libstdc++, lttng-ust, numactl (optional), zlib | icu-libs, krb5-libs, libintl, libssl1.1 (Alpine >= 3.9), libssl1.0 (< 3.9), libstdc++, lttng-ust, numactl (optional), zlib |                    | libicu                    |

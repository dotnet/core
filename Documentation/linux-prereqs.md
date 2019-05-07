# Linux System Prerequisites for .NET Core

The following table represents the minimum library requirements to create, and run, a basic "hello world" console or MVC application with .NET Core. More complex applications could have additional requirements. 


| Distro         | 1.0                                 | 1.1                                 | 2.1                       | 2.2                       |
| ------------   | ----------------------------------- | ----------------------------------- | ------------------------- | ------------------------- |
| Ubuntu 19.04   | -                                   | -                                   | libicu63, libssl1.1       | libicu63, libssl1.1       |
| Ubuntu 18.04   | libunwind8, libicu60, openssl1.0    | libunwind8, libicu60, openssl1.0    | libicu60, openssl1.0      | libicu60, openssl1.0      |
| Ubuntu 16.04   | libunwind8, libicu55                | libunwind8, libicu55                | libicu55                  | libicu55                  |
| Debian 10       | -                                   | -                                  | libicu63, libssl1.1       | libicu63, libssl1.1       |
| Debian 9       | -                                   | -                                   | libicu57, libssl1.0.2     | libicu57, libssl1.0.2     |
| Fedora 30      | -                                   | -                                   | libicu, openssl           | libicu, openssl           |
| Fedora 29      | -                                   | -                                   | libicu, openssl           | libicu, openssl           |
| Fedora 28      | libunwind, libicu, compat-openssl10 | libunwind, libicu, compat-openssl10 | libicu, compat-openssl10  | libicu, compat-openssl10  |
| CentOS 7       | libunwind, libicu                   | libunwind, libicu                   | libicu                    | libicu                    |
| OpenSUSE Leap  | libunwind, libicu                   | libunwind, libicu                   | libicu                    | libicu                    |
| SLES 12        | -                                   | libunwind, libicu                   | libicu                    | libicu                    |
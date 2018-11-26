# Linux System Prerequisites for .NET Core

The following table represents the minimum library requirements to create, and run, a basic "hello world" console or MVC application with .NET Core. More complex applications could have additional requirements. 


| Distro         | 1.0                                 | 1.1                                 | 2.0                                 | 2.1                       |
| ------------   | ----------------------------------- | ----------------------------------- | ----------------------------------- | ------------------------- |
| Ubuntu 18.04   | libunwind8, libicu60, openssl1.0    | libunwind8, libicu60, openssl1.0    | libunwind8, libicu60, openssl1.0    | libicu60, openssl1.0      |
| Ubuntu 16.04   | libunwind8, libicu55                | libunwind8, libicu55                | libunwind8, libicu55                | libicu55                  |
| Ubuntu 14.04   | libunwind8, libicu52                | libunwind8, libicu52                | libunwind8, libicu52                | libicu52                  |
| Debian 9       | -                                   | -                                   | libunwind8, libicu57, libssl1.0.2   | libicu57, libssl1.0.2     |
| Debian 8       | libunwind8                          | libunwind8                          | libunwind8, libicu52, libssl1.0.0   | libicu52, libssl1.0.0     |
| Fedora 28      | libunwind, libicu, compat-openssl10 | libunwind, libicu, compat-openssl10 | libunwind, libicu, compat-openssl10 | libicu, compat-openssl10  |
| Fedora 27      | libunwind, libicu, compat-openssl10 | libunwind, libicu, compat-openssl10 | libunwind, libicu, compat-openssl10 | libicu, compat-openssl10  |
| CentOS 7       | libunwind, libicu                   | libunwind, libicu                   | libunwind, libicu                   | libicu                    |
| OpenSUSE Leap  | libunwind, libicu                   | libunwind, libicu                   | libunwind, libicu                   | libicu                    |
| SLES 12        | -                                   | libunwind, libicu                   | libunwind, libicu                   | libicu                    |
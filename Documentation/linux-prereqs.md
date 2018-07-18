# Linux System Prerequisites for .NET Core

The following table represents the minimum library requirements to create, and run, a basic "hello world" console or MVC application with .NET Core. More complex applications could have additional requirements. 


| Distro       | 1.0                                 | 1.1                                 | 2.0                              | 2.1 |
| ------------ | ----------------------------------- | ----------------------------------- | -------------------------------- | --- |
| Ubuntu 18.04 | libicu60, libunwind8, openssl1.0    | libicu60, libunwind8, openssl1.0    | libicu60, libunwind8, openssl1.0 | |
| Ubuntu 16.04 | libicu55, libunwind8                | libicu55, libunwind8                | libicu55, libunwind8             | |
| Ubuntu 14.04 | libicu52, libunwind8                | libicu52, libunwind8                | libicu52, libunwind8             | |
| Debian 9     | -                                   | -                                   | libicu57, libssl1.0.2            | |
| Debian 8     | libunwind8                          | libunwind8                          | libunwind8                       | |
| Fedora 28    | libicu, libunwind, compat-openssl10 | libicu, libunwind, compat-openssl10 | libicu, compat-openssl10         | |
| Fedora 27    | libicu, libunwind, compat-openssl10 | libicu, libunwind, compat-openssl10 | libicu, compat-openssl10         | |
| CentOS 7     | libicu, libunwind                   | libicu, libunwind                   | libicu                           | |
| OpenSUSE 42  |libicu, libunwind                    | libicu, libunwind                   | libicu                           | |
| SLES 12      | -                                   | libicu, libunwind                   |                                  | |
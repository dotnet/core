# Using the .NET IL Linker

The .NET team has built a linker to reduce the size of .NET Core applications. It is built on top of the excellent and battle-tested [mono linker](https://github.com/mono/linker). The Xamarin tools also use this linker.

In trivial cases, the linker can reduce the size of applications by 50%. The size wins may be more favorable or more moderate for larger applications. The linker removes code in your application and dependent libraries that are not reached by any code paths. It is effectively an application-specific dead code analysis.

In 3.0, the linker has shipped as part of the SDK (still marked as "preview"), and the out-of-band nuget package is no longer supported. Please see the new instructions at https://aka.ms/dotnet-illink.

### Feedback

Please provide feedback on your use of the linker. We are actively looking for feedback to improve the linker. In particular, we are looking for feedback on the following topics:

* Linker throughput.
* Cases where the linker can be more aggressive.
* Cases where the link is too aggressive and causes applications to fail at runtime.
* The linker provided an excellent result for a large application.

Please create issue with your feedback at either [mono/linker](https://github.com/mono/linker) or [dotnet/core](https://github.com/dotnet/core). Also feel free to contact the team at clrlinker@microsoft.com.

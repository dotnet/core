# License information for .NET on Windows

The Windows distribution of .NET contains files that are provided under multiple licenses.
This information is provided to help you understand the license terms that
apply to your use. By using .NET on Windows, you agree to the following license terms.

This document is provided for informative purposes only, and is not itself a license.

The following binaries are licensed with the
[.NET Library License](https://dotnet.microsoft.com/dotnet_library_license.htm)

* coreclr.dll and .NET runtimes included in binaries published as single-file (due to [extra telemetry](https://github.com/dotnet/runtime/blob/main/src/coreclr/vm/dwreport.cpp) included by .NET runtime in Watson crash reports)
* Microsoft.DiaSymReader.Native.{x86|amd64|arm|arm64}.dll (used by .NET runtime and SDK)
* PresentationNative_cor3.dll (used by WPF)
* wpfgfx_cor3.dll (used by WPF)

The following binaries are licensed with the
[Windows SDK License](https://learn.microsoft.com/legal/windows-sdk/license):

* D3DCompiler_47_cor3.dll (used by WPF)

All other binaries and files are licensed with the
[MIT license](https://github.com/dotnet/core/blob/main/LICENSE.TXT).

See [license information](./license-information.md) for information about
other operating systems.

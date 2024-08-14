# .NET 8 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

## .NET Runtime
The .NET Servicing updated released on [July](https://github.com/dotnet/announcements/issues/311) contains a security fix addressed an elevation of privilege vulnerability detailed in CVE [2024-38081](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-38081). The fix changed System.IO.Path.GetTempPath method return value. If windows version exposes the GetTempPath2 Win32 API, this method invokes that API and returns the resolved path. [See the Remarks section](https://learn.microsoft.com/windows/win32/api/fileapi/nf-fileapi-gettemppath2w#remarks) of the [GetTempPath2](https://learn.microsoft.com/windows/win32/api/fileapi/nf-fileapi-gettemppath2w) documentation for more information on how this resolution is performed, including how to control the return value through the use of environment variables. The GetTempPath2 API may not be available on all versions of Windows.

An observable difference between the GetTempPath and GetTempPath2 Win32 APIs is that they return different values for SYSTEM and non-SYSTEM processes. When calling this function from a process running as SYSTEM it will return the path %WINDIR%\SystemTemp, which is inaccessible to non-SYSTEM processes. This return value for SYSTEM processes cannot be overridden by environment variables. For non-SYSTEM processes, GetTempPath2 will behave the same as GetTempPath, respecting the same environment variables to override the return value.

In some scenarios it may be possible to redirect the Temp folder to a different folder using environment variables or other means. Please refer to the official documentation for the [GetTempPath2](https://learn.microsoft.com/windows/win32/api/fileapi/nf-fileapi-gettemppatha) Win32 API for the most up to date information on this behavior.

Please reference to the [System.IO.Path.GetTempPath API](https://learn.microsoft.com/dotnet/api/system.io.path.gettemppath?view=netframework-4.8.1&tabs=windows) for more information.

**Temporary Workaround**

Warning: The opt-out will disable the security fix for the elevation of privilege vulnerability detailed in [CVE 2024-38081](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-38081). The opt-out is only for temporary workaround if you're sure that the software is running in secure environments. Microsoft does not recommend applying this temporary workaround.
  - Option#1: Opt out in a command window by setting the environment variable
	  -- COMPlus_Disable_GetTempPath2=true
  -	Opiton#2: [Opt out globally on the machine by creating a system-wide environment variable and rebooting to ensure all processes observe the change](https://stackoverflow.com/questions/2365307/what-determines-the-return-value-of-path-gettemppath). 
   --	System-wide environment variables can be set by running “sysdm.cpl” from a cmd window, and then navigating to “Advanced -> Environment variables -> System variables -> New”. 

**Resolution**
The API behavior change is by design to address the elevation of privilege vulnerability. Any affected software or application is expected to make code change to adapt to this new design change.

## .NET SDK

### 8.0.2xx SDK is not compatible with 17.8 for some scenarios
Some analyzers and source generators that ship with the SDK took a dependency on a new version of the Roslyn compiler. In Visual Studio and msbuild.exe, .NET projects use the Roslyn version that comes with Visual Studio by default.

**Example error messages**
`Microsoft.CodeAnalysis.Razor.Compiler.SourceGenerators.dll references version '4.9.0.0' of the compiler, which is newer than the currently running version '4.8.0.0'`
`Microsoft.Codeanalysis.CodeStyle.dll references version '4.9.0.0' of the compiler, which is newer than the currently running version '4.8.0.0'`

**Workaround**
1. Use 17.10 which matches the 8.0.2xx SDK
2. Install the 8.0.1xx SDK and use global.json to pin to it if you have multiple SDKs installed
3. Set BuildWithNetFrameworkHostedCompiler=true in your build. This configures the build to use a matching version of the compiler to your SDK version rather than to your VS version so in this case, it'll use a 4.10 version of Roslyn.


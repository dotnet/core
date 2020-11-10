# Portable PDB #

.NET Core introduces a new symbol file (PDB) format - portable PDBs. Unlike traditional PDBs which are Windows-only, portable PDBs can be created and read on all platforms.

## What is a PDB? ##
For anyone not familiar, a PDB file is an auxiliary file produced by a compiler to provide other tools, especially debuggers, information about what is in the main executable file and how it was produced. For example, a debugger reads a PDB to map foo.cs line 12 to the right executable location so that it can set a breakpoint.
The Windows PDB format has been around a long time now (~25 years), and it evolved from other native debugging symbol formats which were even older. It started out its life as a format for native (C/C++) programs. For the first release of the .NET Framework, the Windows PDB format was extended to support .NET.

## Why a new format? ##
While the Windows PDB format has worked okay over the years, with .NET Core the [Roslyn](https://github.com/dotnet/roslyn/wiki/Roslyn%20Overview) team decided it was time to go back to the drawing board and come up with a new format. A few of the reasons:

* The Windows PDB format is complex, and not well documented. This complexity is important for some of the native code scenarios that the format was designed for, but it is unnecessary for the .NET scenarios. The portable format is [open source](https://github.com/dotnet/symreader-portable) and [documented](https://github.com/dotnet/runtime/blob/master/docs/design/specs/PortablePdb-Metadata.md).
* At the time the effort was begun there wasn't a cross-platform library that could read or write the original windows PDB format.
* The Windows PDB format is not a compact representation for managed code. Significant size reductions can be obtained with a new format without losing any information.

## Supported scenarios
Today, neither portable PDBs nor Windows PDBs are supported everywhere so you need to consider where your project will want to be used (or at least debugged) to decide which format to use. If you have a project that you want to be able to use and debug in both formats, you can use different build configurations and build the project twice to support both types of consumer.

Windows PDBs can only be written or read on Windows. All Windows tooling supports them, except for Visual Studio Code (as Visual Studio Code strives for consistent behavior across all platforms), and scenarios where Visual Studio is debugging to a remote Linux/OSX computer (as the PDBs must be read on the remote computer).
Portable PDBs can be read on any operating system, but there are a number of places where they aren't supported yet. Here are a few –

* Older versions of the Visual Studio debugger (versions before VS 2015 Update 2)
* Applications targeting .NET Framework 4.7.1 or earlier<sup><a href="#fn1" id="ref1">1</a></sup>: printing stack traces with mappings back to line numbers (such as in an ASP.NET error page). The name of methods is unaffected, only the source file names and line numbers are unsupported.
* C# Code analysis (aka FxCop), note that this doesn't apply to Roslyn Analyzer
* Some symbol servers (ex: SymbolSource.org [does not](https://github.com/SymbolSource/SymbolSource/issues/7#issuecomment-399747015), nuget.org [does](https://blog.nuget.org/20181116/Improved-debugging-experience-with-the-NuGet-org-symbol-server-and-snupkg.html))
* Running post-compilation build step that consumes or modifies the PDB using older versions of tools such as CCI, CodeContracts.
* Using .NET decompilers such as ildasm or .Net reflector and expecting to see source line mappings or local parameter names
* [MS DIA](https://docs.microsoft.com/previous-versions/visualstudio/visual-studio-2015/debugger/debug-interface-access/debug-interface-access-sdk-reference)-based tools such as WinDBG.

Over time we plan to shrink this list of non-supported scenarios so that portable PDB can become the default choice for most usage needs.



<sup id="fn1">1. When running on .NET Framework 4.7.2 with an app that targets earlier .NET Framework versions we anticipate having an opt-in configuration switch as an additional mechanism to enable support for older applications<a href="#ref1" title="Jump back to footnote 1 in the text.">↩</a></sup>

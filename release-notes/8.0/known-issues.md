# .NET 8 Known Issues

You may encounter the following known issues, which may include workarounds, mitigations, or expected resolution timeframes.

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

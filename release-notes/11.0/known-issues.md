# .NET 11 Known Issues

You may encounter some known issues, which may include workarounds, mitigations, or expected resolution timeframes. Watch this space for any known issues in .NET 11.0.

## Covariant overrides of `Task`/`Task<T>` causes TypeLoadException

Refactoring for the [Runtime-Async](https://github.com/dotnet/runtime/issues/109632) feature caused a bug in Task-returning methods with covariant returns. The bug has been fixed for Preview 2, but the fix did not make Preview 1. 

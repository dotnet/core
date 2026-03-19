# .NET Libraries in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new .NET Libraries features & enhancements:

- [ProcessStartOptions with platform-aware path resolution](#processstartoptions-with-platform-aware-path-resolution)
- [Async handle support for FileStream on Unix](#async-handle-support-for-filestream-on-unix)
- [WebProxy credentials from URI UserInfo](#webproxy-credentials-from-uri-userinfo)
- [Reduced regex backtracking for greedy loops](#reduced-regex-backtracking-for-greedy-loops)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

## Process improvements

Building on the [Process I/O improvements introduced in Preview 1](../preview1/libraries.md#process-io-improvements), Preview 3 adds a new type for safer process launching.

### ProcessStartOptions with platform-aware path resolution

The new `ProcessStartOptions` class provides explicit path resolution with platform-specific semantics when launching processes ([dotnet/runtime#124271](https://github.com/dotnet/runtime/pull/124271)). Unlike `ProcessStartInfo`, `ProcessStartOptions` resolves and validates the executable path at construction time, throwing `FileNotFoundException` if the path cannot be resolved.

```csharp
// Resolves and validates path during construction
var options = new ProcessStartOptions("cmd");
Console.WriteLine(options.FileName); // C:\Windows\System32\cmd.exe

// Lazy-allocated collections
options.Arguments.Add("/c");
options.Arguments.Add("echo test");

// Environment inherits current process, modifiable
options.Environment["MY_VAR"] = "value";
```

Path resolution follows platform conventions — on Windows, it appends `.exe` and searches System32 then PATH; on Unix, it searches PATH only. Current directory is only accessed with an explicit `./` or `.\` prefix.

## Async handle support for FileStream on Unix

`FileStream` now supports non-blocking (`O_NONBLOCK`) handles on Unix ([dotnet/runtime#125377](https://github.com/dotnet/runtime/pull/125377)). Previously, `FileStream` rejected async handles on Unix. This change adds poll-then-read/write support for non-blocking file descriptors, enabling `FileStream` to wrap async pipe and socket handles on Unix.

## WebProxy credentials from URI UserInfo

`WebProxy` now automatically extracts credentials embedded in proxy URIs ([dotnet/runtime#125384](https://github.com/dotnet/runtime/pull/125384)). Previously, credentials in `socks5://user:pass@host:port` URIs were silently ignored, causing SOCKS5 authentication failures and requiring users to set credentials separately.

```csharp
// Credentials are now extracted from the URI automatically
handler.Proxy = new WebProxy("socks5://user:pass@host:1080");

// Explicit credentials still take precedence
handler.Proxy = new WebProxy("socks5://user:pass@host:1080");
handler.Proxy.Credentials = new NetworkCredential("other", "creds"); // wins
```

## Reduced regex backtracking for greedy loops

When a greedy character loop (like `\w+` or `\d+`) is followed by a literal that is part of the loop's character class, backtracking normally requires repeated `LastIndexOf` calls to find viable positions ([dotnet/runtime#125636](https://github.com/dotnet/runtime/pull/125636)). This change detects cases where whatever comes after that literal is disjoint from the loop's class, allowing backtracking to skip directly to the last consumed position rather than searching backward one position at a time.

For example, in the pattern `\b\w+n\b`, the `\w+` loop is followed by `n` (which is in `\w`), and `n` is followed by `\b`. Since the loop only matches word characters, only the very last consumed position can satisfy the word boundary — every earlier position would fail. The engine now skips directly to that position instead of testing each one.

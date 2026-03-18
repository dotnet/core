# .NET Libraries in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new .NET Libraries features & enhancements:

- [Overlapped I/O for Process stdout/stderr on Windows](#overlapped-io-for-process-stdoutstderr-on-windows)
- [Async handle support for FileStream on Unix](#async-handle-support-for-filestream-on-unix)
- [WebProxy credentials from URI UserInfo](#webproxy-credentials-from-uri-userinfo)
- [Reduced regex backtracking for greedy loops](#reduced-regex-backtracking-for-greedy-loops)
- [OpenSSL 4 binding support](#openssl-4-binding-support)

.NET Libraries updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

## Overlapped I/O for Process stdout/stderr on Windows

Building on the [Process I/O improvements introduced in Preview 1](../preview1/libraries.md#process-io-improvements), `System.Diagnostics.Process` now uses overlapped (async) I/O for the parent end of stdout/stderr pipes on Windows ([dotnet/runtime#125643](https://github.com/dotnet/runtime/pull/125643)). Previously, anonymous pipes for stdout/stderr redirection were always synchronous, blocking a thread pool thread per pipe read. The parent's read handle for stdout and stderr is now opened with overlapped I/O unconditionally, while the child's end remains synchronous so that child processes using `GetStdHandle()` continue to work correctly.

Throughput roughly doubles when many processes with redirected stdout run concurrently:

```
Total time (before):  00:00:19.79
Total time (after):   00:00:09.14
```

No code changes are required to benefit from this improvement — any code using `Process.Start` with redirected stdout/stderr will automatically use async I/O on Windows.

## Async handle support for FileStream on Unix

Also building on Preview 1's Process I/O improvements, `FileStream` now supports non-blocking (`O_NONBLOCK`) handles on Unix ([dotnet/runtime#125377](https://github.com/dotnet/runtime/pull/125377)). Previously, `FileStream` rejected async handles on Unix. This change adds poll-then-read/write support for non-blocking file descriptors, enabling `FileStream` to wrap async pipe and socket handles on Unix.

```csharp
// FileStream can now wrap non-blocking pipe handles on Unix
using var stream = new FileStream(asyncPipeHandle, FileAccess.Read);
var buffer = new byte[1024];
int bytesRead = await stream.ReadAsync(buffer);
```

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

## OpenSSL 4 binding support

Portable .NET builds can now bind to OpenSSL 4 at runtime ([dotnet/runtime#125687](https://github.com/dotnet/runtime/pull/125687)). As Linux distributions begin shipping OpenSSL 4.0, .NET applications deployed as portable builds will automatically discover and use the newer OpenSSL version for cryptographic operations, alongside the existing support for OpenSSL 1.x and 3.x.

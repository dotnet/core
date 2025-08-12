# .NET Libraries in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Launch Windows processes in new process group](#launch-windows-processes-in-new-process-group)
- [AES KeyWrap with Padding (IETF RFC 5649)](#aes-keywrap-with-padding-ietf-rfc-5649)
- Post-Quantum Cryptography Updates
  - [ML-DSA](#ml-dsa)
  - [Composite ML-DSA](#composite-ml-dsa)
- [PipeReader support for JSON serializer](#pipereader-support-for-json-serializer)
- Networking
  - [WebSocketStream](#websocketstream)
  - [TLS 1.3 for macOS (client)](#tls-13-for-macos-client)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Launch Windows processes in new process group

For Windows, you can now use `ProcessStartInfo.CreateNewProcessGroup` to launch a process in a separate PG.  This allows you to send isolated signals to child processes which could otherwise take down the parent without proper handling.  Sending signals is convenient to avoid forceful termination.

```csharp
using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;

class Program
{
    static void Main(string[] args)
    {
        bool isChildProcess = args.Length > 0 && args[0] == "child";
        if (!isChildProcess)
        {
            var psi = new ProcessStartInfo
            {
                FileName = Environment.ProcessPath,
                Arguments = "child",
                CreateNewProcessGroup = true,
            };

            using Process process = Process.Start(psi)!;
            Thread.Sleep(5_000);

            GenerateConsoleCtrlEvent(CTRL_C_EVENT, (uint)process.Id);
            process.WaitForExit();

            Console.WriteLine("Child process terminated gracefully, continue with the parent process logic if needed.");
        }
        else
        {
            // If you need to send a CTRL+C, the child process needs to re-enable CTRL+C handling, if you own the code, you can call SetConsoleCtrlHandler(NULL, FALSE).
            // see https://learn.microsoft.com/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw#remarks
            SetConsoleCtrlHandler((IntPtr)null, false);

            Console.WriteLine("Greetings from the child process!  I need to be gracefully terminated, send me a signal!");

            bool stop = false;

            var registration = PosixSignalRegistration.Create(PosixSignal.SIGINT, ctx =>
            {
                stop = true;
                ctx.Cancel = true;
                Console.WriteLine("Received CTRL+C, stopping...");
            });

            StreamWriter sw = File.AppendText("log.txt");
            int i = 0;
            while (!stop)
            {
                Thread.Sleep(1000);
                sw.WriteLine($"{++i}");
                Console.WriteLine($"Logging {i}...");
            }

            // Clean up
            sw.Dispose();
            registration.Dispose();

            Console.WriteLine("Thanks for not killing me!");
        }
    }

    private const int CTRL_C_EVENT = 0;
    private const int CTRL_BREAK_EVENT = 1;

    [DllImport("kernel32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool SetConsoleCtrlHandler(IntPtr handler, [MarshalAs(UnmanagedType.Bool)] bool Add);

    [DllImport("kernel32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool GenerateConsoleCtrlEvent(uint dwCtrlEvent, uint dwProcessGroupId);
}
```

## AES KeyWrap with Padding (IETF RFC 5649)

AES-KWP is an algorithm that is occasionally used in constructions like Cryptographic Message Syntax (CMS) EnvelopedData,
where content is encrypted once, but the decryption key needs to be distributed to multiple parties, each one in a distinct
secret form.

.NET now supports the AES-KWP algorithm via instance methods on the `System.Security.Cryptography.Aes` class:

```csharp
private static byte[] DecryptContent(ReadOnlySpan<byte> kek, ReadOnlySpan<byte> encryptedKey, ReadOnlySpan<byte> ciphertext)
{
    using (Aes aes = Aes.Create())
    {
        aes.SetKey(kek);

        Span<byte> dek = stackalloc byte[256 / 8];
        int length = aes.DecryptKeyWrapPadded(encryptedKey, dek);

        aes.SetKey(dek.Slice(0, length));
        return aes.DecryptCbc(ciphertext);
    }
}
```

## Post-Quantum Cryptography Updates

### ML-DSA

The `System.Security.Cryptography.MLDsa` class gained ease-of-use updates in this release, allowing some common code patterns to be simplified:

```diff
private static byte[] SignData(string privateKeyPath, ReadOnlySpan<byte> data)
{
    using (MLDsa signingKey = MLDsa.ImportFromPem(File.ReadAllBytes(privateKeyPath)))
    {
-       byte[] signature = new byte[signingKey.Algorithm.SignatureSizeInBytes];
-       signingKey.SignData(data, signature);
+       return signingKey.SignData(data);
-       return signature;
    }
}
```

Additionally, this release added support for HashML-DSA, which we call "PreHash" to help distinguish it from "pure" ML-DSA.
As the underlying specification interacts with the Object Identifier (OID) value, the SignPreHash and VerifyPreHash methods
on this `[Experimental]` type take the dotted-decimal OID as a string.
This may evolve as more scenarios using HashML-DSA become well-defined.

```C#
private static byte[] SignPreHashSha3_256(MLDsa signingKey, ReadOnlySpan<byte> data)
{
    const string Sha3_256Oid = "2.16.840.1.101.3.4.2.8";
    return signingKey.SignPreHash(SHA3_256.HashData(data), Sha3_256Oid);
}
```

### Composite ML-DSA

This release also introduces new types to support ietf-lamps-pq-composite-sigs (currently at draft 7),
and an implementation of the primitive methods for RSA variants.

```cs
var algorithm = CompositeMLDsaAlgorithm.MLDsa65WithRSA4096Pss;
using var privateKey = CompositeMLDsa.GenerateKey(algorithm);

byte[] data = [42];
byte[] signature = privateKey.SignData(data);

using var publicKey = CompositeMLDsa.ImportCompositeMLDsaPublicKey(algorithm, privateKey.ExportCompositeMLDsaPublicKey());
Console.WriteLine(publicKey.VerifyData(data, signature)); // True

signature[0] ^= 1; // Tamper with signature
Console.WriteLine(publicKey.VerifyData(data, signature)); // False
```

## PipeReader support for JSON serializer

`JsonSerializer.Deserialize` now supports `PipeReader`, complementing the existing `PipeWriter` support. Previously, deserializing from a `PipeReader` required converting it to a `Stream`, but the new overloads eliminate that step by integrating `PipeReader` directly into the serializer. As a bonus, not having to convert from what you're already holding can yield some efficiency benefits.

This shows the basic usage:

```cs
var pipe = new Pipe();

// Serialize to writer
await JsonSerializer.SerializeAsync(pipe.Writer, new Person("Alice"));
await pipe.Writer.CompleteAsync();

// Deserialize from reader
var result = await JsonSerializer.DeserializeAsync<Person>(pipe.Reader);
await pipe.Reader.CompleteAsync();

Console.WriteLine($"Your name is {result.Name}.");
// Output: Your name is Alice.

record Person(string Name);
```

Here is an example of a producer that produces tokens in chunks and a consumer that receives and displays them.

```cs
var pipe = new Pipe();

// Producer writes to the pipe in chunks
var producerTask = Task.Run(async () =>
{
    async static IAsyncEnumerable<Chunk> GenerateResponse()
    {
        yield return new Chunk("The quick brown fox", DateTime.Now);
        await Task.Delay(500);
        yield return new Chunk(" jumps over", DateTime.Now);
        await Task.Delay(500);
        yield return new Chunk(" the lazy dog.", DateTime.Now);
    }

    await JsonSerializer.SerializeAsync<IAsyncEnumerable<Chunk>>(pipe.Writer, GenerateResponse());
    await pipe.Writer.CompleteAsync();
});

// Consumer reads from the pipe and outputs to console
var consumerTask = Task.Run(async () =>
{
    var thinkingString = "...";
    var clearThinkingString = new string("\b\b\b");
    var lastTimestamp = DateTime.MinValue;

    // Read response to end
    Console.Write(thinkingString);
    await foreach (var chunk in JsonSerializer.DeserializeAsyncEnumerable<Chunk>(pipe.Reader))
    {
        Console.Write(clearThinkingString);
        Console.Write(chunk.Message);
        Console.Write(thinkingString);
        lastTimestamp = DateTime.Now;
    }

    Console.Write(clearThinkingString);
    Console.WriteLine($" Last message sent at {lastTimestamp}.");

    await pipe.Reader.CompleteAsync();
});

await producerTask;
await consumerTask;

record Chunk(string Message, DateTime Timestamp);

// Output (500ms between each line):
// The quick brown fox...
// The quick brown fox jumps over...
// The quick brown fox jumps over the lazy dog. Last message sent at 8/1/2025 6:41:35 PM.
```

Note that all of this is serialized as JSON in the `Pipe` (formatted here for readability):

```json
[
    {
        "Message": "The quick brown fox",
        "Timestamp": "2025-08-01T18:37:27.2930151-07:00"
    },
    {
        "Message": " jumps over",
        "Timestamp": "2025-08-01T18:37:27.8594502-07:00"
    },
    {
        "Message": " the lazy dog.",
        "Timestamp": "2025-08-01T18:37:28.3753669-07:00"
    }
]
```

## Networking

### WebSocketStream

This release introduces `WebSocketStream`, a new API designed to simplify some of the most common—and previously cumbersome—`WebSocket` scenarios in .NET.

Traditional `WebSocket` APIs are low-level and require significant boilerplate: handling buffering and framing, reconstructing messages, managing encoding/decoding, and writing custom wrappers to integrate with streams, channels, or other transport abstractions. These complexities make it difficult to use WebSockets as a transport, especially for apps with streaming or text-based protocols, or event-driven handlers.

**WebSocketStream** addresses these pain points by providing a Stream-based abstraction over a WebSocket. This enables seamless integration with existing APIs for reading, writing, and parsing data, whether binary or text, and reduces the need for manual plumbing.

## Common Usage Patterns

Here are a few examples of how `WebSocketStream` simplifies typical WebSocket workflows:

### 1. Streaming text protocol (e.g., STOMP)

```csharp
using Stream transportStream = WebSocketStream.Create(
    connectedWebSocket, 
    WebSocketMessageType.Text,
    ownsWebSocket: true);
// Integration with Stream-based APIs
// Don't close the stream, as it's also used for writing
using var transportReader = new StreamReader(transportStream, leaveOpen: true); 
var line = await transportReader.ReadLineAsync(cancellationToken); // Automatic UTF-8 and new line handling
transportStream.Dispose(); // Automatic closing handshake handling on `Dispose`
```

### 2. Streaming binary protocol (e.g., AMQP)

```csharp
Stream transportStream = WebSocketStream.Create(
    connectedWebSocket,
    WebSocketMessageType.Binary,
    closeTimeout: TimeSpan.FromSeconds(10));
await message.SerializeToStreamAsync(transportStream, cancellationToken);
var receivePayload = new byte[payloadLength];
await transportStream.ReadExactlyAsync(receivePayload, cancellationToken);
transportStream.Dispose();
// `Dispose` automatically handles closing handshake
```

### 3. Reading a single message as a stream (e.g., JSON deserialization)

```csharp
using Stream messageStream = WebSocketStream.CreateReadableMessageStream(connectedWebSocket, WebSocketMessageType.Text);
// JsonSerializer.DeserializeAsync reads until the end of stream.
var appMessage = await JsonSerializer.DeserializeAsync<AppMessage>(messageStream);
```

### 4. Writing a single message as a stream (e.g., binary serialization)

```csharp
public async Task SendMessageAsync(AppMessage message, CancellationToken cancellationToken)
{
    using Stream messageStream = WebSocketStream.CreateWritableMessageStream(_connectedWebSocket, WebSocketMessageType.Binary);
    foreach (ReadOnlyMemory<byte> chunk in message.SplitToChunks())
    {
        await messageStream.WriteAsync(chunk, cancellationToken);
    }
} // EOM sent on messageStream.Dispose()
```

**WebSocketStream** enables high-level, familiar APIs for common WebSocket consumption and production patterns—reducing friction and making advanced scenarios easier to implement.

### TLS 1.3 for macOS (client)

This release adds client-side TLS 1.3 support on macOS by integrating Apple’s Network.framework into SslStream and HttpClient. Historically, macOS used Secure Transport which doesn’t support TLS 1.3; opting into Network.framework enables TLS 1.3.

Scope and behavior

- macOS only, client-side in this release.
- Opt-in. Existing apps continue to use the current stack unless enabled.
- When enabled, older TLS versions (TLS 1.0 and 1.1) may no longer be available via Network.framework.

How to enable

- AppContext switch in code:

```csharp
// Opt in to Network.framework-backed TLS on Apple platforms
AppContext.SetSwitch("System.Net.Security.UseNetworkFramework", true);

using var client = new HttpClient();
var html = await client.GetStringAsync("https://example.com");
```

- Or environment variable:

```bash
# Opt-in via environment variable (set for the process or machine as appropriate)
DOTNET_SYSTEM_NET_SECURITY_USENETWORKFRAMEWORK=1
# or
DOTNET_SYSTEM_NET_SECURITY_USENETWORKFRAMEWORK=true
```

Notes

- Applies to SslStream and APIs built on it (e.g., HttpClient/HttpMessageHandler).
- Cipher suites are controlled by macOS via Network.framework.
- Underlying stream behavior may differ when Network.framework is enabled (e.g., buffering, read/write completion, cancellation semantics).
- Zero-byte reads: semantics may differ. Avoid relying on zero-length reads for detecting data availability.
- Internationalized domain names (IDN): certain IDN hostnames may be rejected by Network.framework. Prefer ASCII/Punycode (A-label) hostnames or validate names against macOS/Network.framework constraints.
- If your app relies on specific SslStream edge-case behavior, validate it under Network.framework.

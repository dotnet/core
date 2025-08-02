# .NET Libraries in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Launch Windows processes in new process group](#launch-windows-processes-in-new-process-group)
- [AES KeyWrap with Padding (IETF RFC 5649)](#aes-keywrap-with-padding-ietf-rfc-5649)
- [ML-DSA Updates](ml-dsa-updates)
- [PipeReader support for JSON serializer](#pipereader-support-for-json-serializer)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Feature

Something about the feature

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

```C#
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

## ML-DSA Updates

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

This release also introduces new types to support ietf-lamps-pq-composite-sigs (currently at draft 7),
but in Preview 7 they don't have an implementation, just inheritance-model tests.
If you're looking for Composite ML-DSA, come back next release.

## PipeReader support for JSON serializer

New `PipeReader` overloads have been added to `JsonSerializer.Deserialize`, to match the existing `PipeWriter` support. Previously, deserialization required using an intermediate `Stream` which could involve copying data unnecessarily. The new overloads avoid that by integrating directly with the core deserialization logic which should improve performance.

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
    Console.WriteLine($" Last message received at {lastTimestamp}.");

    await pipe.Reader.CompleteAsync();
});

await producerTask;
await consumerTask;

record Chunk(string Message, DateTime Timestamp);

// Output (500ms between each line):
// The quick brown fox...
// The quick brown fox jumps over...
// The quick brown fox jumps over the lazy dog. Last message received at 8/1/2025 6:41:35 PM.
```

Note that all of this is serialized as JSON in the `Pipe` (formatted here for readability):
```
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

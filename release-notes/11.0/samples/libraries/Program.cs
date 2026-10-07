using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;
using System.Formats.Cbor;
using System.Net.Http;
using System.Security.Cryptography;
using System.Security.Cryptography.Pkcs;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Caching.Memory;

ReadOnlyMemory<byte> firstChunk = new byte[] { 0x82, 0x0a };
ReadOnlyMemory<byte> nextChunk = new byte[] { 0x14 };
var reader = new CborReader(firstChunk,
    new CborReaderOptions { ConformanceMode = CborConformanceMode.Lax }, isFinalBlock: false);

reader.ReadStartArray();
int first = reader.ReadInt32();

if (reader.PeekState() == CborReaderState.NeedsMoreData)
{
    if (reader.BytesRemaining == 0)
        reader.SlideData(nextChunk, isFinalBlock: true);
    else
        throw new Exception("Buffer management omitted from the sample.");
}

int second = reader.ReadInt32();
reader.ReadEndArray();
if (first != 10 || second != 20)
{
    throw new Exception("The CBOR chunks did not decode correctly.");
}

var range = new RangeAttribute(1, 10);
if (range.FormatMessage("{0} must be between {1} and {2}", "Value") !=
    "Value must be between 1 and 10")
{
    throw new Exception("The DataAnnotations message template was not formatted.");
}
Console.WriteLine("CBOR streaming and DataAnnotations formatting passed.");

using var handler = new SocketsHttpHandler();
if (handler.InitialHttp2MaxConcurrentStreams != 100)
{
    throw new Exception("The initial HTTP/2 concurrency default is not 100.");
}
handler.InitialHttp2MaxConcurrentStreams = 1;
using var client = new HttpClient(handler);
if (handler.InitialHttp2MaxConcurrentStreams != 1)
{
    throw new Exception("The initial HTTP/2 concurrency setting was not retained.");
}
Console.WriteLine("HTTP/2 initial concurrency configuration passed (no server exchange).");

#pragma warning disable SYSLIB5006 // Opt in to experimental post-quantum APIs.
var algorithm = CompositeMLKemAlgorithm.MLKem768WithECDiffieHellmanP256;
if (CompositeMLKem.IsAlgorithmSupported(algorithm))
{
    using var recipientKey = CompositeMLKem.GenerateKey(algorithm);
    using var senderKey = CompositeMLKem.ImportEncapsulationKey(
        algorithm, recipientKey.ExportEncapsulationKey());
    senderKey.Encapsulate(out byte[] ciphertext, out byte[] senderSecret);
    byte[] recipientSecret = recipientKey.Decapsulate(ciphertext);
    if (!CryptographicOperations.FixedTimeEquals(senderSecret, recipientSecret))
    {
        throw new Exception("The composite ML-KEM shared secrets do not match.");
    }
    Console.WriteLine("Composite ML-KEM round trip passed.");

    using var signer = RSA.Create(2048);
    var subject = new X500DistinguishedName("CN=Composite ML-KEM validation");
    PublicKey publicKey = PublicKey.CreateFromSubjectPublicKeyInfo(
        recipientKey.ExportSubjectPublicKeyInfo(), out _);
    var request = new CertificateRequest(subject, publicKey, HashAlgorithmName.SHA256);
    using var certificate = request.Create(
        subject, X509SignatureGenerator.CreateForRSA(signer, RSASignaturePadding.Pkcs1),
        DateTimeOffset.UtcNow.AddMinutes(-1), DateTimeOffset.UtcNow.AddDays(1),
        RandomNumberGenerator.GetBytes(16));
    using var extracted = certificate.GetCompositeMLKemPublicKey();
    if (extracted is null || !extracted.ExportEncapsulationKey().SequenceEqual(
        recipientKey.ExportEncapsulationKey()))
    {
        throw new Exception("The certificate did not expose its composite ML-KEM public key.");
    }

    foreach (Action operation in new Action[]
    {
        () => { using var key = certificate.GetCompositeMLKemPrivateKey(); },
        () => { using var copy = certificate.CopyWithPrivateKey(recipientKey); }
    })
    {
        try
        {
            operation();
            throw new Exception("A composite ML-KEM certificate private-key operation unexpectedly succeeded.");
        }
        catch (PlatformNotSupportedException)
        {
            Console.WriteLine("The expected composite ML-KEM certificate limitation was observed.");
        }
    }
    Console.WriteLine("Composite ML-KEM certificate public-key access passed.");
}
else
{
    Console.WriteLine("Composite ML-KEM is unavailable on this platform.");
}
#pragma warning restore SYSLIB5006

#pragma warning disable SYSLIB5009 // Opt in to experimental HPKE APIs.
var suite = new HpkeSuite(
    HpkeKem.DHKEM_P256_HKDF_SHA256, HpkeKdf.HKDF_SHA256, HpkeAead.AES_128_GCM);
if (Hpke.IsSupported(suite))
{
    using var recipientKey = Hpke.GenerateKey(suite);
    using var senderKey = Hpke.ImportEncapsulationKey(
        suite, recipientKey.ExportEncapsulationKey());
    senderKey.Seal(new byte[] { 42 }, out byte[] encapsulatedSecret, out byte[] ciphertext);
    byte[] plaintext = recipientKey.Open(encapsulatedSecret, ciphertext);
    if (!plaintext.SequenceEqual(new byte[] { 42 }))
    {
        throw new Exception("HPKE did not recover the original plaintext.");
    }
    Console.WriteLine("HPKE round trip passed.");
}
else
{
    Console.WriteLine("The selected HPKE suite is unavailable on this platform.");
}

foreach (HpkeKem kem in new[]
{
    HpkeKem.MLKEM_512, HpkeKem.MLKEM_768, HpkeKem.MLKEM_1024,
    HpkeKem.MLKEM768_P256, HpkeKem.MLKEM1024_P384
})
{
    if (Hpke.IsSupported(new HpkeSuite(kem, HpkeKdf.HKDF_SHA256, HpkeAead.AES_128_GCM)))
    {
        throw new Exception($"RC 2 unexpectedly supports the post-quantum HPKE suite {kem}.");
    }
}
Console.WriteLine("RC 2 post-quantum HPKE suite limitations confirmed.");
#pragma warning restore SYSLIB5009

if (OperatingSystem.IsWindows() || !MLKem.IsSupported)
{
    Console.WriteLine("ML-KEM CMS round trip skipped: requires non-Windows ML-KEM support.");
}
else
{
    using var privateKey = MLKem.GenerateKey(MLKemAlgorithm.MLKem768);
    using var signer = RSA.Create(2048);
    var subject = new X500DistinguishedName("CN=Release note validation");
    var request = new CertificateRequest(subject, new PublicKey(privateKey), HashAlgorithmName.SHA256);
    using var certificate = request.Create(
        subject, X509SignatureGenerator.CreateForRSA(signer, RSASignaturePadding.Pkcs1),
        DateTimeOffset.UtcNow.AddMinutes(-1), DateTimeOffset.UtcNow.AddDays(1),
        RandomNumberGenerator.GetBytes(16));
    if (!RoundTrip(certificate, privateKey, new byte[] { 42 }).SequenceEqual(new byte[] { 42 }))
    {
        throw new Exception("ML-KEM CMS did not recover the original plaintext.");
    }
    Console.WriteLine("ML-KEM CMS round trip passed.");
}

bool sawHit = false;
bool sawMiss = false;
bool sawSize = false;
using (var listener = new MeterListener())
using (var cache = new MemoryCache(new MemoryCacheOptions
{
    Name = "ReleaseNoteValidation", TrackStatistics = true, SizeLimit = 10
}))
{
    listener.InstrumentPublished = (instrument, meterListener) =>
    {
        if (instrument.Meter.Name == "Microsoft.Extensions.Caching.Memory.MemoryCache")
        {
            meterListener.EnableMeasurementEvents(instrument);
        }
    };
    listener.SetMeasurementEventCallback<long>((instrument, measurement, tags, _) =>
    {
        if (instrument.Name == "dotnet.cache.requests")
        {
            foreach (var tag in tags)
            {
                if (tag.Key == "dotnet.cache.request.type")
                {
                    throw new Exception("MemoryCache emitted the RC 1 request tag.");
                }
                if (tag.Key == "dotnet.cache.request.result")
                {
                    sawHit |= tag.Value is "hit" && measurement == 1;
                    sawMiss |= tag.Value is "miss" && measurement == 1;
                }
            }
        }
        if (instrument.Name == "dotnet.cache.estimated_size")
        {
            if (instrument.Unit != "1" || measurement != 3)
            {
                throw new Exception("MemoryCache size unit or value is incorrect.");
            }
            sawSize = true;
        }
    });
    listener.Start();
    cache.Set("present", 42, new MemoryCacheEntryOptions { Size = 3 });
    cache.TryGetValue("present", out _);
    cache.TryGetValue("missing", out _);
    listener.RecordObservableInstruments();
}
if (!sawHit || !sawMiss || !sawSize)
{
    throw new Exception("The expected MemoryCache measurements were not observed.");
}
Console.WriteLine("MemoryCache RC 2 telemetry names and size unit passed.");

if ((OperatingSystem.IsIOS() && !OperatingSystem.IsMacCatalyst()) || OperatingSystem.IsTvOS())
{
    bool lockingDisabled = !AppContext.TryGetSwitch("System.IO.DisableFileLocking", out bool configured)
        || configured;
    string? environment = Environment.GetEnvironmentVariable("DOTNET_SYSTEM_IO_DISABLEFILELOCKING");
    if (!AppContext.TryGetSwitch("System.IO.DisableFileLocking", out _) && environment is not null)
    {
        lockingDisabled = environment switch
        {
            "1" => true,
            "0" => false,
            _ when bool.TryParse(environment, out bool value) => value,
            _ => throw new ArgumentException("Use 0, 1, false, or true for DOTNET_SYSTEM_IO_DISABLEFILELOCKING.")
        };
    }
    string path = Path.Combine(Path.GetTempPath(), $"file-share-{Guid.NewGuid():N}");
    try
    {
        using var first = new FileStream(path, FileMode.CreateNew, FileAccess.ReadWrite, FileShare.None);
        if (lockingDisabled)
        {
            using var second = new FileStream(path, FileMode.Open, FileAccess.ReadWrite, FileShare.None);
        }
        else
        {
            try
            {
                using var second = new FileStream(path, FileMode.Open, FileAccess.ReadWrite, FileShare.None);
                throw new Exception("FileShare.None was not enforced with locking enabled.");
            }
            catch (IOException)
            {
                Console.WriteLine("The expected sharing violation was observed.");
            }
        }
    }
    finally
    {
        File.Delete(path);
    }
    Console.WriteLine($"iOS/tvOS FileShare behavior passed (locking disabled: {lockingDisabled}).");
}
else
{
    Console.WriteLine("iOS/tvOS file-locking checks skipped: requires a device or simulator.");
}

static byte[] RoundTrip(X509Certificate2 certificate, MLKem privateKey, byte[] data)
{
    var encrypted = new EnvelopedCms(new ContentInfo(data));
    var recipient = CmsRecipient.CreateForKeyEncapsulation(certificate, []);
    encrypted.Encrypt(recipient);

    var decrypted = new EnvelopedCms();
    decrypted.Decode(encrypted.Encode());
    decrypted.Decrypt((KemRecipientInfo)decrypted.RecipientInfos[0], privateKey);
    return decrypted.ContentInfo.Content;
}

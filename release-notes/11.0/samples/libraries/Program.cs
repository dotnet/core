using System.ComponentModel.DataAnnotations;
using System.Formats.Cbor;
using System.Security.Cryptography;

ReadOnlyMemory<byte> firstChunk = new byte[] { 0x82, 0x0a };
ReadOnlyMemory<byte> nextChunk = new byte[] { 0x14 };

var reader = new CborReader(firstChunk,
    new CborReaderOptions { ConformanceMode = CborConformanceMode.Lax }, isFinalBlock: false);
if (reader.ReadStartArray() != 2 || reader.ReadInt32() != 10)
{
    throw new Exception("The first CBOR chunk did not decode correctly.");
}

if (reader.PeekState() == CborReaderState.NeedsMoreData)
    reader.SlideData(nextChunk, isFinalBlock: true);
else
    throw new Exception("The first chunk should require additional data.");
if (reader.ReadInt32() != 20)
{
    throw new Exception("The second CBOR chunk did not decode correctly.");
}
reader.ReadEndArray();

var range = new RangeAttribute(1, 10);
if (range.FormatMessage("{0} must be between {1} and {2}", "Value") !=
    "Value must be between 1 and 10")
{
    throw new Exception("The DataAnnotations message template was not formatted.");
}

// Reflection lets the fixture exercise experimental APIs without hiding compiler diagnostics.
var cryptoAssembly = typeof(SHA256).Assembly;
Type kemType = cryptoAssembly.GetType("System.Security.Cryptography.CompositeMLKem", throwOnError: true)!;
Type algorithmType = cryptoAssembly.GetType("System.Security.Cryptography.CompositeMLKemAlgorithm", throwOnError: true)!;
object algorithm = algorithmType.GetProperty("MLKem768WithECDiffieHellmanP256")!.GetValue(null)!;
bool isSupported = (bool)kemType.GetMethod("IsAlgorithmSupported")!.Invoke(null, [algorithm])!;
if (isSupported)
{
    using var key = (IDisposable)kemType.GetMethod("GenerateKey")!.Invoke(null, [algorithm])!;
    object?[] result = [null, null];
    kemType.GetMethod("Encapsulate", [typeof(byte[]).MakeByRefType(), typeof(byte[]).MakeByRefType()])!
        .Invoke(key, result);
    byte[] ciphertext = (byte[])result[0]!;
    byte[] senderSecret = (byte[])result[1]!;
    byte[] recipientSecret = (byte[])kemType.GetMethod("Decapsulate", [typeof(byte[])])!
        .Invoke(key, [ciphertext])!;
    if (!CryptographicOperations.FixedTimeEquals(senderSecret, recipientSecret))
    {
        throw new Exception("The composite ML-KEM shared secrets do not match.");
    }
    Console.WriteLine("Composite ML-KEM round trip passed.");
}
else
{
    Console.WriteLine("Composite ML-KEM is unavailable on this platform.");
}

Type hpkeType = cryptoAssembly.GetType("System.Security.Cryptography.Hpke", throwOnError: true)!;
Type suiteType = cryptoAssembly.GetType("System.Security.Cryptography.HpkeSuite", throwOnError: true)!;
Type kem = cryptoAssembly.GetType("System.Security.Cryptography.HpkeKem", throwOnError: true)!;
Type kdf = cryptoAssembly.GetType("System.Security.Cryptography.HpkeKdf", throwOnError: true)!;
Type aead = cryptoAssembly.GetType("System.Security.Cryptography.HpkeAead", throwOnError: true)!;
object suite = Activator.CreateInstance(suiteType,
    Enum.Parse(kem, "DHKEM_P256_HKDF_SHA256"),
    Enum.Parse(kdf, "HKDF_SHA256"),
    Enum.Parse(aead, "AES_128_GCM"))!;
if ((bool)hpkeType.GetMethod("IsSupported")!.Invoke(null, [suite])!)
{
    using var key = (IDisposable)hpkeType.GetMethod("GenerateKey")!.Invoke(null, [suite])!;
    object?[] sealedResult = [new byte[] { 42 }, null, null, null, null];
    hpkeType.GetMethod("Seal",
        [typeof(byte[]), typeof(byte[]).MakeByRefType(), typeof(byte[]).MakeByRefType(), typeof(byte[]), typeof(byte[])])!
        .Invoke(key, sealedResult);
    byte[] plaintext = (byte[])hpkeType.GetMethod("Open",
        [typeof(byte[]), typeof(byte[]), typeof(byte[]), typeof(byte[])])!
        .Invoke(key, [sealedResult[1], sealedResult[2], null, null])!;
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

Console.WriteLine("CBOR streaming and DataAnnotations formatting passed.");

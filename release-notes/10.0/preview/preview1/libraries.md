# .NET Libraries in .NET 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes new .NET Libraries features & enhancements:

- [Feature](#feature)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Finding Certificates By Thumbprints Other Than SHA-1

Finding certificates uniquely by thumbprint is a fairly common operation,
but the `X509Certificate2Collection.Find` method (for the `FindByThumbprint` mode) only searches for the SHA-1 Thumbprint value.

Since SHA-2-256 ("SHA256") and SHA-3-256 have the same lengths,
we decided that it wasn't pure goodness to let the Find method find any vaguely matching thumbprints.
Instead, we introduced a new method that accepts the name of the hash algorithm that you want to use for matching.

```C#
X509Certificate2Collection coll = store.Certificates.FindByThumbprint(HashAlgorithmName.SHA256, thumbprint);
Debug.Assert(coll.Count < 2, "Collection has too many matches, has SHA-2 been broken?");
return coll.SingleOrDefault();
```

## Finding PEM-encoded Data in ASCII/UTF-8

The PEM encoding (originally "Privacy Enhanced Mail", but now used widely outside of email) is defined for "text",
which means that the `PemEncoding` class was designed to run on `System.String` and `ReadOnlySpan<char>`.
But, it's quite common (especially on Linux) to have something like a certificate written in a file that uses the ASCII (string) encoding.
Historically, that meant you needed to open the file, convert the bytes to chars (or a string), and then you can use PemEncoding.

Taking advantage of the fact that PEM is only defined for 7-bit ASCII characters, and that 7-bit ASCII has a perfect overlap with single-byte UTF-8 values,
you can now skip the UTF-8/ASCII to char conversion and read the file directly.

```diff
byte[] fileContents = File.ReadAllBytes(path);
-char[] text = Encoding.ASCII.GetString(fileContents);
-PemFields pemFields = PemEncoding.Find(text);
+PemFields pemFields = PemEncoding.Find(fileContents);

-byte[] contents = Base64.DecodeFromChars(text.AsSpan()[pemFields.Base64Data]);
+byte[] contents = Base64.DecodeFromUtf8(fileContents.AsSpan()[pemFields.Base64Data]);
```

## Feature

This is something about the feature

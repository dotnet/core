# How to verifying .NET downloads

After downloading a .NET file, verify it for security by calculating the file's checksum on your computer and comparing it to the original checksum. This will verify the file has not been tampered with or corrupted.

## Examples

The verification process involves a few steps.

1. Download the checksum file for the release into the same directory as the installer you downloaded. Links to the checksum file are found in the Release Notes. 
2. Then, compare the download checksum with the checksum value or file. If there is a match, the download is valid.

We'll use [.NET 7.0.5](https://github.com/dotnet/core/blob/main/release-notes/7.0/7.0.5/7.0.5.md) in the examples.

### Linux and MacOS

#### To see the downloaded file checksum for comparison

`$ sha512sum dotnet-sdk-7.0.203-osx-x64.pkg`

You can then compare the checksum with the value provided after [downloading .NET](https://dot.net)

#### To compare against the checksum file provided for each .NET release

Download checksum file using curl:

```bash
curl -O https://dotnetcli.blob.core.windows.net/dotnet/checksums/7.0.5-sha.txt

```

Verify the checksum matches:

```bash
sha512sum -c 7.0.5-sha.txt --ignore-missing
```

If the output states the file is valid ('OK'), then it's ready to use.

### Windows

#### To see the downloaded file checksum for comparison

- In the cmd prompt - `certutil -hashfile dotnet-sdk-7.0.203-win-x64.exe SHA512`
- In PowerShell - `(Get-FileHash 'dotnet-sdk-7.0.203-win-x64.exe' -Algorithm SHA512).Hash`

You can then compare the checksum with the value provided after [downloading .NET](https://dot.net)

#### To compare against the checksum file provided for each .NET release

You can use PowerShell to perform the the checksum comparison.

Download checksum file using `curl` (_`curl` is an alias of `Invoke-WebRequest`_):

```powershell
curl https://dotnetcli.blob.core.windows.net/dotnet/checksums/7.0.5-sha.txt -OutFile 7.0.5-sha.txt
```

Verify the checksum matches:

```powershell
(Get-Content .\7.0.5-sha.txt | Select-String "dotnet-sdk-7.0.203-win-x64.exe").ToString().Contains((Get-FileHash 'dotnet-sdk-7.0.203-win-x64.exe' -Algorithm SHA512).Hash.ToLower())
```

If the output states the file is valid ('True'), then it's ready to use.

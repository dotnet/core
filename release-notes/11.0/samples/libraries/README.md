# Libraries release-note validation

Run `dotnet run --project Libraries.csproj` with SDK `11.0.100-rc.2.26475.137`.

The sample reads a CBOR array across two chunks and formats a `RangeAttribute` message template. It checks the initial HTTP/2 concurrency default of 100 and configuration to 1; it does not verify a server SETTINGS exchange. It observes MemoryCache hit/miss measurements using `dotnet.cache.request.result` and verifies that the estimated-size unit is `1`.

The strongly typed cryptography examples opt in to `SYSLIB5006` and `SYSLIB5009` only around their experimental APIs. They export public keys to separate sender objects, verify composite ML-KEM shared secrets and an HPKE seal/open round trip, and confirm that RC 2 does not support post-quantum HPKE suites. An ephemeral composite ML-KEM certificate verifies public-key extraction and the expected `PlatformNotSupportedException` from private-key extraction and attachment.

The CMS example generates an ephemeral ML-KEM certificate and verifies an encryption/decryption round trip on non-Windows platforms with ML-KEM support. Windows skips this check because KEM recipients are unsupported there. Unsupported cryptographic algorithms are reported explicitly, not counted as successful round trips.

On an iOS/tvOS device or simulator, the file-sharing check opens two handles with `FileShare.None`. The default permits both opens; setting `System.IO.DisableFileLocking=false` in runtime configuration, or `DOTNET_SYSTEM_IO_DISABLEFILELOCKING=0` before starting the process, should cause a sharing violation. Run once with the default and once with the opt-back-in setting. The check does not simulate OS suspension or termination. Other platforms skip it.

All checks throw on unexpected results. CMS execution on a supported non-Windows host and file-locking execution on iOS/tvOS remain pending; Windows execution cannot validate those platform-specific claims.

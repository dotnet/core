# Query Distro Packages — Worked Examples

These are real lookups run against the current `release-notes/` data, used to validate the skill's process end to end.

## "What packages do I need to install .NET 10 on Ubuntu 24.04?"

Version and release are both given, so steps 1 and 3 are trivial. `ubuntu.json` → release `24.04` has a builtin `dotnet_packages` entry, so the answer uses the plain install command:

```bash
apt-get install -y ca-certificates libgssapi-krb5-2 libc6 libgcc-s1 libicu74 libstdc++6 libssl3t64 tzdata dotnet-sdk-10.0
```

- `dotnet-sdk-10.0` is enough for development (build + run). Swap in `dotnet-runtime-10.0` alone if you only need to run apps, or add `aspnetcore-runtime-10.0` for ASP.NET Core apps — the `component` field on each entry tells you which is which.
- Everything before the `dotnet-*` packages are the native dependencies .NET needs on Ubuntu (ICU for globalization, OpenSSL for TLS, etc.).

## "How do I install .NET on Fedora?"

No version and no release given.

1. **Version**: scan `release-notes/*/releases.json` for `"support-phase": "active"` → `10.0` (11.0 is still `"go-live"`, a release candidate, and 9.0 is `"maintenance"` — not the default).
2. **Distro**: `fedora.json` exists under `release-notes/10.0/distros/`.
3. **Release**: not given, and `fedora.json` has three: Fedora 44, 43, 42. Ambiguous — list them and ask, rather than guessing the newest:

   > Which Fedora release are you on — 44, 43, or 42?

## "What about Ubuntu 22.04?" (continuing the .NET 10 example)

`ubuntu.json` → release `22.04` has no `dotnet_packages`, only `dotnet_packages_other.backports` — .NET isn't in Ubuntu 22.04's default archive. The answer needs the feed registration first:

```bash
sudo apt-get install -y software-properties-common && sudo add-apt-repository ppa:dotnet/backports && sudo apt-get update
apt-get install -y ca-certificates libgssapi-krb5-2 libc6 libgcc-s1 libicu70 libstdc++6 libssl3 tzdata dotnet-sdk-10.0
```

Called out explicitly: this is the `backports` PPA, not the default Ubuntu archive — worth telling the user, since it changes what `apt-get upgrade` will later pull in.

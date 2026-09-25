# Container image updates in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 contains no new user-facing container image features. The
Azure Linux 4.0 image rollout begun in Preview 6 is complete — the remaining
Azure Linux 4.0 tag variants were backported to the Preview 7 branch in
[dotnet/dotnet-docker #7290](https://github.com/dotnet/dotnet-docker/pull/7290) —
and the smaller Native AOT SDK images introduced in Preview 6 are unchanged.

For features that shipped earlier in the release, see the
[Preview 6 container notes](../preview6/containers.md).

The only non-infrastructure change in this preview is a Chisel update to
`v1.4.2` for the distroless image build
([dotnet/dotnet-docker #7298](https://github.com/dotnet/dotnet-docker/pull/7298)).

<!-- No net-new container features shipped between the P6 (2026-07-14) and P7
     (2026-08-11) windows. Merged PRs against dotnet/dotnet-docker in that
     window are #7290 (Azure Linux 4.0 P6 backport), #7295/#7297 (network
     isolation policy, infra), and #7298 (Chisel v1.4.2). Everything else is
     nightly dependency flow. -->

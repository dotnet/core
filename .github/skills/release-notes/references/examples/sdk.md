# SDK Examples

## Container publishing improvements for insecure registries

> Source: [.NET 9 Preview 7 — SDK](../../../../release-notes/9.0/preview/preview7/sdk.md)

Short — problem/solution framing with community attribution and a tight requirements list.

> The SDK's built-in container publishing support can publish images to container registries, but until this release those registries were required to be secured - they needed HTTPS support and valid certificates for the .NET SDK to work.
> Container engines can usually be configured to work with insecure registries as well - meaning registries that do not have TLS configured, or have TLS configured with a certificate that is invalid from the perspective of the container engine. This is a valid use case, but our tooling didn't support this mode of communication.
>
> In this release, [@tmds](https://github.com/tmds) enabled the SDK [to communicate with insecure registries](https://github.com/dotnet/sdk/pull/41506).
>
> Requirements (depending on your environment):
>
> * [Configure the Docker CLI to mark a registry as insecure](https://docs.docker.com/reference/cli/dockerd/#insecure-registries)
> * [Configure Podman to mark a registry as insecure](https://podman-desktop.io/docs/containers/registries)
> * Use the `DOTNET_CONTAINER_INSECURE_REGISTRIES` environment variable to pass a semicolon-delimited list of registry domains to treat as insecure

**Why it works**: the community contributor is credited naturally mid-sentence. The requirements list gives actionable next steps without over-explaining. The reader knows exactly what changed and what to do.

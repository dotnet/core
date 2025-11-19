# .NET Security Group

The .NET upstream project is run by Microsoft and follows Microsoft security reporting and disclosure practices. Microsoft shares vulnerability information with the .NET Security Group (subsequently referred to as the “Group”) prior to public disclosure to enable members to build, validate, and publish packages at the same time as Microsoft.

The overall charter of the Group is to ensure that vulnerability descriptions and patches are consistently and transparently published, enabling users everywhere to deploy patches quickly.

The Group was established in 2016 by Microsoft and Red Hat, in advance of .NET Core 1.0.

See [Announcing the .NET Security Group](https://devblogs.microsoft.com/dotnet/announcing-dotnet-security-group/) for process information.

## Membership

Membership in the Group is limited to companies that distribute or support .NET and that have a track record of careful handling of embargo information. Members must have a non-disclosure agreement with Microsoft and sign a [pre-disclosure collaboration agreement](./dotnet-security-group-agreement.md). Members are added at the discretion of the Group. Member removal is subject to the agreement.

Members:

- Canonical
- HeroDevs
- IBM
- Microsoft
- Red Hat

## Responsibilities

The group is modelled on common open source practices. It is oriented on source as the shared artifact and securing supply chains that rely on supported .NET versions. There is no affordance for sharing source patches for unsupported .NET versions or binaries. Binary sharing establishes a high level of business continuity, which is outside the scope of a program oriented around an open source project.

Members must publish builds for supported .NET versions. They can additionally patch end-of-life .NET versions, however, that activity is outside the scope of the Group. Members who exclusively use early-access source patches to update end-of-life versions may be removed from the program.

Members are expected to be active in `main` or other active branches as an investment in the .NET ecosystem. Doing that demonstrates a strong commitment to the ecosystem and earned community credibility.

## Vulnerability publishing process

Vulnerability information is strictly confidential until the public disclosure. The Group coordinates primarily via regular Teams calls, open to all members.

Process:

- Vulnerabilities are discovered and [privately reported](https://github.com/dotnet/runtime/blob/main/README.md#reporting-security-issues-and-security-bugs) by project engineers, security researchers, or other parties.
- Vulnerabilities are validated and resolved.
- Vulnerability descriptions and patches are shared with Group members via shared git repositories, typically a minimum of 10 business days before publishing. Embargo starts at that time.
- Group members follow their own established vulnerability process. They privately build and validate patches in preparation for publishing patched binaries for their users at the same time as or soon after Microsoft.
- Microsoft publicly publishes [vulnerability disclosures](https://github.com/dotnet/announcements/issues?q=is%3Aissue+is%3Aopen+label%3ASecurity). Embargo ends at that time.
- Group members publicly publish vulnerability disclosures and patched builds to their users via their established means.

The publishing day is almost always [Patch Tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday). The same overall process will be followed in case accelerated action is needed, possibly with shorter timelines.

This process applies to [supported .NET releases](https://github.com/dotnet/core/blob/main/releases.md). Some months may have no security patches.

## Reporting and inquiries

Vulnerability reports should be sent through the [security reporting process](https://github.com/dotnet/runtime/blob/main/README.md#reporting-security-issues-and-security-bugs).

Inquiries about the Group can be sent to [dotnet@microsoft.com](mailto:dotnet@microsoft.com).

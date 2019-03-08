# .NET Core Roadmap

The .NET Core roadmap communicates project priorities for evolving and extending the scope of the product. New product experiences and features will include changes in various [layers of the product](Documentation/core-repos.md), in some combination of the runtime, framework, language compilers and tools. Each component may have its own component-level roadmap that will available in the repo for that component.

The .NET Core team is currently focused on Web, Cloud, Microservices, Containers, and Console applications. We encourage the community to work with us to improve .NET Core for these scenarios and extend it for others.

## Released Versions

* [Latest updates](https://github.com/dotnet/core/blob/master/release-notes/README.md) or [Download archive](https://github.com/dotnet/core/blob/master/release-notes/download-archive.md)

For released versions of the product:

* [Supported OSes](os-lifecycle-policy.md)
* [Release Notes](release-notes/README.md)
* [Support Timelines](microsoft-support.md)

## Upcoming Ship Dates

| Milestone                 | Release Date |
|---------------------------|--------------|
| .NET Core 2.2.x, 2.1.x, 1.x (servicing) | Approximately every 1-2 months or as needed (see also [releases](https://github.com/dotnet/core/blob/master/release-notes/download-archive.md#net-core-21)) |
| .NET Core 3.0 | [Preview releases](https://github.com/dotnet/core/blob/master/release-notes/3.0/README.md) <br/> Final version in second half of 2019 - see [Schedule in Preview 3](https://devblogs.microsoft.com/dotnet/announcing-net-core-3-preview-3) (from 2019/3). Ship date will be announced at the Build 2019 conference. <br/> Previous announcements: [original 2018/5](https://blogs.msdn.microsoft.com/dotnet/2018/05/07/net-core-3-and-support-for-windows-desktop-applications/) and [update 2018/10](https://blogs.msdn.microsoft.com/dotnet/2018/10/04/update-on-net-core-3-0-and-net-framework-4-8/). |

Note: Dates are calendar year (as opposed to fiscal year).

Milestone information is available on most repos, for example [dotnet/corefx milestones](https://github.com/dotnet/corefx/milestones).

## Feedback

The best way to give feedback is to create issues in the [dotnet/core](https://github.com/dotnet/core) repo. You can also create issues in other [.NET Core repos](Documentation/core-repos.md) if you find that to be more appropriate for the topic you want to discuss.

Although mostly obvious, please give us feedback that will give us insight on the following points:

* Existing features are missing some capability or otherwise don't work well enough.
* Missing features that should be added to the product.
* Design choices for a feature that is currently in-progress.

Some important caveats / notes:

* It is best to give design feedback quickly for improvements that are in-development. We're unlikely to hold a feature being part of a release on late feedback.
* We are most likely to include improvements that either have a positive impact on a broad scenario or have very significant positive impact on a niche scenario. This means that we are unlikely to prioritize modest improvements to niche scenarios.
* Compatibility will almost always be given a higher priority than improvements.

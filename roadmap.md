# .NET Release Schedule

This document covers the upcoming release dates for .NET and .NET Core.

If you're looking for the product roadmap, visit <https://aka.ms/dotnet-product-roadmap>.

## Released Versions

* [Latest updates](./release-notes/README.md) or [Download archive](./release-notes/download-archives)

For released versions of the product:

* [Supported operating systems](os-lifecycle-policy.md)
* [Release notes](release-notes/README.md)
* [Support timelines](microsoft-support.md)

## Upcoming Ship Dates

| Milestone                 | Release Date |
|---------------------------|--------------|
| .NET 6.0 | LTS (Long Term Support) release. Approximately every 1-2 months or as needed. |
| .NET 7.0 | STS (Standard Term Support) release. Approximately every 1-2 months or as needed. |
| .NET 8.0 | LTS (Long Term Support) release, scheduled for November 14, 2023 |

Details about longer-term schedule have been announced on May 6th, 2019 in [Introducing .NET 5](https://devblogs.microsoft.com/dotnet/introducing-net-5/) blog post.

Milestone information is available on most repos, for example [dotnet/runtime milestones](https://github.com/dotnet/runtime/milestones).

## Feedback

The best way to give feedback is to create issues in the [dotnet/core](https://github.com/dotnet/core) repo. You can also create issues in other [.NET repos](Documentation/core-repos.md) if you find that to be more appropriate for the topic you want to discuss.

Please give us feedback that will give us insight on the following points:

* Existing features that are missing some capability or otherwise don't work well enough.
* Missing features that should be added to the product.
* Design choices for a feature that is currently in-progress.

Some important caveats / notes:

* It is best to give design feedback quickly for improvements that are in-development. We're unlikely to hold a feature being part of a release on late feedback.
* We are most likely to include improvements that either have a positive impact on a broad scenario or have very significant positive impact on a niche scenario. This means that we are unlikely to prioritize modest improvements to niche scenarios.
* Compatibility will almost always be given a higher priority than improvements.

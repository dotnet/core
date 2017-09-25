# .NET Core Roadmap

The .NET Core roadmap communicates project priorities for evolving and extending the scope of the product. New product experiences and features will include changes in various [layers of the product](Documentation/core-repos.md), in some combination of the runtime, framework, language compilers and tools. Each component may have its own component-level roadmap that will available in the repo for that component.

The .NET Core team is currently focussed on the Web workload and console apps. We encourage the community to work with us to improve web and console apps and to extend .NET Core for other scenarios.

## Released Versions

[.NET Core 2.0](https://github.com/dotnet/core/issues/812) shipped on August 14th, 2017.

For released versions of the product:

* [.NET Core Release Notes](release-notes/README.md)
* [.NET Core Supported OS Lifecycle Policy](os-lifecycle-policy.md).

## Upcoming Ship Dates

| Milestone                 | Release Date |
|---------------------------|--------------|
| .NET Core 2.1 Preview | Q4 2017 |
| .NET Core 2.1 | Q1 2018 |

Note: Dates are always in Calendar Year format (as opposed to Fiscal Year).

Milestone information is available on most repos, for example [dotnet/corefx milestones](https://github.com/dotnet/corefx/milestones).

## .NET Core 2.1 Release

The .NET Core 2.1 project has not yet started. The team is currently working on infastructure improvements to the .NET Core build and release system. .NET Core 2.1 release information will be shared here once planning starts.

## Feedback

The product and the roadmap should align with a broad set of user requests. We listen to feedback in various forums and also actively use the product ourselves for both our engineering system and for [lives sites](https://www.microsoft.com/net) we maintain. We want your feedback to help best direct the efforts of everyone who works on the product.

## Engagement

The best way to give feedback is to create issues in the [dotnet/core](https://github.com/dotnet/core) repo with the [roadmap label](https://github.com/dotnet/core/labels/roadmap). You can also create issues in other [.NET Core repos](Documentation/core-repos.md) if you find that to be more appropriate for the topic you want to discuss.

There are some specific improvements where we would like to get direct feedback

* Existing features are missing some capability or otherwise don't work well enough.
* Missing features that should be added to the product.
* Design choices for a feature that is currently in-progress.

Some important caveats / notes:

* It is best to give design feedback quickly for improvements that have been committed to the current in-development release. We're unlikely to hold a feature being part of a release on late feedback.
* We are most likely to include improvements that either have a positive impact on a broad scenario or have very significant positive impact on a niche scenario.
* Compatibility will almost always be given a higher priority than improvements, other than security.

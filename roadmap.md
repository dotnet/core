# .NET Core Roadmap

The .NET Core roadmap communicates project priorities for evolving and extending the scope of the product. New product experiences and features will include changes in various [layers of the product](Documentation/core-repos.md), in some combination of the runtime, framework, language compilers and tools. Each component may have its own component-level roadmap that will available in the repo for that component.

The .NET Core team is currently focused on Web, Cloud, Microservices, Containers, and Console applications. We encourage the community to work with us to improve .NET Core for these scenarios and extend it for others.

## Released Versions

[.NET Core 2.0](https://github.com/dotnet/core/issues/812) shipped on August 14th, 2017.

For released versions of the product:

* [Supported OSes](os-lifecycle-policy.md)
* [Release Notes](release-notes/README.md)

## Upcoming Ship Dates

| Milestone                 | Release Date |
|---------------------------|--------------|
| .NET Core 2.1 Preview | Q4 2017 |
| .NET Core 2.1 | Q1 2018 |

Note: Dates are calendar year (as opposed to fiscal year).

Milestone information is available on most repos, for example [dotnet/corefx milestones](https://github.com/dotnet/corefx/milestones).

## .NET Core 2.1 Release

The .NET Core 2.1 project has not yet started. The team is currently working on infrastructure improvements to the .NET Core build and release system. .NET Core 2.1 release information will be shared here once planning starts.

## Feedback

The best way to give feedback is to create issues in the [dotnet/core](https://github.com/dotnet/core) repo with the [roadmap label](https://github.com/dotnet/core/labels/roadmap). You can also create issues in other [.NET Core repos](Documentation/core-repos.md) if you find that to be more appropriate for the topic you want to discuss.

Although mostly obvious, please give us feedback that will give us insight on the following points:

* Existing features are missing some capability or otherwise don't work well enough.
* Missing features that should be added to the product.
* Design choices for a feature that is currently in-progress.

Some important caveats / notes:

* It is best to give design feedback quickly for improvements that are in-development. We're unlikely to hold a feature being part of a release on late feedback.
* We are most likely to include improvements that either have a positive impact on a broad scenario or have very significant positive impact on a niche scenario. This means that we are unlikely to prioritize modest improvements to niche scenarios.
* Compatibility will almost always be given a higher priority than improvements.

# .NET security framing guides

This folder contains a set of framing documents guiding the .NET team's security posture. These guides cover how we perform security designs for our components, the contracts these components have with users, and how we assess reported vulnerabilities in these components. They are specific to .NET's unique shape of being a provider of reusable libraries and SDK components rather than a standalone deployed application.

This folder also contains _prototype_ skills used to generate security design documents / threat models and to assess incoming vulnerability reports.

## Primary documents

There are two primary documents located here. These documents serve as the foundation for all other documents present.

[**Baseline security assumptions**](baseline-security-assumptions.md) covers the implicit contract governing consumers' proper use of library components, expected environmental configuration, and the interaction between components in a system. It's the set of things incorporated by reference into all .NET security documentation, even if that documentation never explicitly says so.

[**Vulnerability theory**](vulnerability-theory.md) describes .NET's operating definition of what constitutes a theoretical product vulnerability. Because we define vulnerabilities in terms of excess privilege grants, this can be combined with the baseline document above to derive a non-exhaustive list of behaviors that are categorically _not_ vulnerabilities.

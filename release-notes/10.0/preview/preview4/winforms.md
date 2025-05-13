# Windows Forms in .NET 10 Preview 4 - Release Notes

Here's a summary of what's new in Windows Forms in this preview release:

* [Shared Core Clipboard Functionality with WPF](#shared-core-clipboard-functionality-with-wpf)
* [Bug Fixes](#bug-fixes)
* [Infrastructure and Tooling](#infrastructure-and-tooling)
* [Localization and Documentation](#localization-and-documentation)

## Windows Forms updates in .NET 10

* [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.
* [Issues List for Windows Forms in .NET 10 Preview 4](https://github.com/dotnet/winforms/issues?q=is%3Aclosed+milestone%3A%2210.0+Preview4%22)

---

## Shared Core Clipboard Functionality with WPF

Introduced shared functionality with WPF by moving reusable code into a common library for better code maintainability.

[Share System.Private.Windows.Core with WPF](https://github.com/dotnet/winforms/issues/12179).

## Bug Fixes

* [Fix a series of Analyzer issues.](https://github.com/dotnet/winforms/pull/13333)

* [Fix #13305 Baseline SnapLines disappear in the derived ControlDesigners](https://github.com/dotnet/winforms/pull/13324)

* [InvalidOperationException when dialog containing focused DataGridView is closed](https://github.com/dotnet/winforms/pull/13320) (Fixes #13319)

* [Property grid entry for ShortCut keys should not be up/down scrollable](https://github.com/dotnet/winforms/pull/13280) (Fixes #13279)
* [Ignore case for DESC and ASC in BindingSource.Sort](https://github.com/dotnet/winforms/pull/13283) (Fixes #13278)

## Infrastructure and Tooling

**Enhanced GitHub Workflow Automation** -
Onboarded to a new issue-labeling system based on GitHub workflows to improve automation and self-service capabilities.
[Onboard to the GitHub workflow-based issue-labeler](https://github.com/dotnet/winforms/pull/13101).

**Improved Test Coverage** -
Numerous unit tests were added to improve reliability and ensure comprehensive coverage across components.
[New Unit Tests](https://github.com/dotnet/winforms/issues?q=is%3Aclosed%20milestone%3A%2210.0%20Preview4%22%20label%3A%22area-test%20coverage%22)

## Localization and Documentation

**Translation Updates** -
Reviewed and corrected translations, including fixing the French translation of "(none)."
[Correct translation for "(none)" in French](https://github.com/dotnet/winforms/pull/13162).

---

For the full list of updates, visit the **[10.0 Preview 4 milestone](https://github.com/dotnet/winforms/issues?q=is%3Aclosed+milestone%3A%2210.0+Preview4%22).**

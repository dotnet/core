# Windows Forms in .NET 10 Preview 4 - Release Notes

Here's a summary of what's new in Windows Forms in this preview release:

- [Features and Enhancements](#features-and-enhancements)
- [Bug Fixes](#bug-fixes)
- [Infrastructure and Tooling](#infrastructure-and-tooling)
- [Localization and Documentation](#localization-and-documentation)

## Windows Forms updates in .NET 10

- [What's new in Windows Forms in .NET 10](https://learn.microsoft.com/dotnet/desktop/winforms/whats-new/net100) documentation.
- [Issues List for Windows Forms in .NET 10 Preview 4](https://github.com/dotnet/winforms/issues?q=is%3Aclosed+milestone%3A%2210.0+Preview4%22)

---

## Features and Enhancements

- **Improved Test Coverage**  
  Numerous unit tests were added to improve reliability and ensure comprehensive coverage across components.  
  Example: [Add Unit Test For issue 13305](https://github.com/dotnet/winforms/pull/13343).

- **Localization Testing**  
  Enabled localization tests for translated resources, ensuring better support for international users.  
  Example: [Enable localization testing since all resources are translated](https://github.com/dotnet/winforms/pull/13162).

- **Shared Core Clipboard Functionality with WPF**  
  Introduced shared functionality with WPF by moving reusable code into a common library for better interoperability.  
  Example: [Share System.Private.Windows.Core with WPF](https://github.com/dotnet/winforms/issues/12179).

---

## Bug Fixes

- **Improved ToolStrip Designer Support**  
  Fixed missing "Type Here" placeholders in MenuStrip controls for a better design-time experience.  
  Example: [Missed the "Type Here" item for the MenuStrip control](https://github.com/dotnet/winforms/issues/13077).

- **DataGridView Dialog Exception Fix**  
  Addressed a regression causing exceptions when closing dialogs with focus on DataGridView.  
  Example: [Add _isReleasingDataSource to prevent unnecessary operations on CurrentCell](https://github.com/dotnet/winforms/pull/13320).

- **Resolved SnapLine Issues**  
  Fixed baseline SnapLines not appearing correctly in the design surface.  
  Example: [Fix #13305 - Baseline SnapLines do not appear in DesignSurface](https://github.com/dotnet/winforms/pull/13324).

---

## Infrastructure and Tooling

- **Enhanced GitHub Workflow Automation**  
  Onboarded to a new issue-labeling system based on GitHub workflows to improve automation and self-service capabilities.  
  Example: [Onboard to the GitHub workflow-based issue-labeler](https://github.com/dotnet/winforms/pull/13101).

- **Native Test Adjustments**  
  Updated test projects to conditionally exclude native tests in virtualized environments, improving CI reliability.  
  Example: [Condition out the native tests in VMR](https://github.com/dotnet/winforms/pull/13187).

---

## Localization and Documentation

- **Translation Updates**  
  Reviewed and corrected translations, including fixing the French translation of "(none)."  
  Example: [Correct translation for "(none)" in French](https://github.com/dotnet/winforms/pull/13162).

- **Diagnostics Documentation Updates**  
  Updated lists of diagnostics to clarify changes and enhancements from previous versions.  
  Example: [Update list-of-diagnostics.md](https://github.com/dotnet/winforms/pull/13185).

- **Automated Localization Check-ins**  
  Integrated localized files from translation pipelines to ensure up-to-date multilingual support.  
  Example: [Localized file check-in by OneLocBuild Task](https://github.com/dotnet/winforms/pull/13176).

---

For the full list of updates, visit the [10.0 Preview 4 milestone](https://github.com/dotnet/winforms/issues?q=is%3Aclosed+milestone%3A%2210.0+Preview4%22).

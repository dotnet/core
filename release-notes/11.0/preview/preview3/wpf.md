# WPF in .NET 11 Preview 3 - Release Notes

Here's a summary of what's new in WPF in this Preview 3 release:

- [Bug Fixes](#bug-fixes)

## Bug Fixes

- Fixed an `InvalidOperationException` that occurred when `WeakEventTable.Purge` modified the data table during enumeration with `EnableWeakEventMemoryImprovements` enabled. Table updates are now deferred during purge to avoid invalidating the enumerator.

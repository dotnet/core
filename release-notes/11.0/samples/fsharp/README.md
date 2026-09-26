# F# release-note validation

With SDK `11.0.100-rc.2.26475.137` on `PATH`, run `.\Validate.ps1`. The fixture checks the ordered results and peak concurrency of `Async.parallelLimit 2`, and confirms that `reraise ()` in an async computation-expression handler preserves the original exception and stack trace. It also supplies `RequireNamedArgumentsAttribute` as a polyfill because this build does not ship it in the BCL, runs a marked method using a named argument, and checks that a positional call in the separate `invalid/Invalid.fsproj` reports `FS3923`.

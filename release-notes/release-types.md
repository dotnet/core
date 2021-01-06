# Release Types

Each .NET release is defined as either **Long Term Support (LTS)** or **Current**. The difference is support time frame, as defined below:

* **LTS** releases are supported for three years. They are intended for users that want the stability and lower cost of maintaining an application on a single (major.minor) .NET version for an extended period.
* **Current** releases are supported for (typically) fifteen months. They are intended for users that want to take advantage of the newest features and improvements and to stay on the leading edge of .NET innovation. Current release users need to upgrade to later .NET releases more often to stay in support.

LTS and Current releases have many similarities. The .NET team follows the same software engineering and releases processes for both, including for security, compatibility, and reliability. The same "bug bar" is used to decide if a change is warranted for LTS and Current releases. Monthly patch releases are typical, including adding support for new operating system versions. You need to adopt patch releases to stay in support.

## Release Support Policies

.NET Core releases are supported according to the following policies.

### Long Term Support (LTS) releases

LTS releases are supported for three years after the initial release.

### Current releases

Current releases are supported for three months after a subsequent Current or LTS release.

### Patch updates

Updates are cumulative, with each update built upon all of the updates that preceded it. You need to install the latest update of a given .NET version to remain supported. Updates may include new features, fixes (security and/or non-security), or a combination of both.

### End of support

End of support refers to the date when Microsoft no longer provides fixes, updates, or online technical assistance. As the end of support nears for a given .NET version, we recommend that you move to a newer .NET version, and reduce/remove your use of the given .NET version. After support ends, we recommend that you uninstall a given .NET version if you are no longer using it, or install the latest patch, and accelerate your plans to remove your use of that .NET version.

Your use of out-of-support .NET versions may put your applications, application data, and computing environment at risk.

# .NET Core on Yocto distribution

This document describes how to get .Net apps running on Yocto distribution. 
At this momment the focus is on getting standalone applications running. 
Unless explicitly mentioned, x86_64 and ARM platforms are supported. 

## Getting started with base OS image
Instructions below assume familiarity with Yocto build process. 
Initial testing as been done on 2.2 Morty but it is probably applicable to 
other versions as well. .NET Core 2.0 Preview2 or later should be used.  

add the following lines your local.conf or custom recipe.

* .NET dependencies
```
CORE_IMAGE_EXTRA_INSTALL += "libunwind icu libcurl openssl"
```

* It is strongly recommended to use curl with OpenSSL backend. 
To do that, you can add something like this:

```
PACKAGECONFIG_pn-curl = 'zlib ipv6 ssl'
```

Check curl recipe for comple set of options. For debugging you may also add

```
CORE_IMAGE_EXTRA_INSTALL += "curl" to get command line tool.
```

* Some extra space will be needed for the app. Adjust number below to fit the need. 
This simply adds 1G of extra space. 

```
IMAGE_ROOTFS_EXTRA_SPACE_append += "+ 1000000"
```

On x86_64 .NET uses /lib64/ld-linux-x86-64.so.2. However Yocto defaults everything to /lib.
This can be solved by adding symbolic link `mkdir -p /lib64; ln -sf /lib/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2` or adding following lines to force multi-lib layout similar to desktop Linux distributions.

```
require conf/multilib.conf
MULTILIBS = "multilib:lib64"
DEFAULTTUNE_virtclass-multilib-lib64 = "x86"
```

# Getting the app ready

Write and debug your app. When ready to publish, use:

```
dotnet publish -r <runtime identifier>
```

the identifier is 'linux-x86', 'linux-x64' or 'linux-arm' depending on your target architecture. 
For ARM and more details you can take a look at [RaspberryPiInstructions](RaspberryPiInstructions.md).

Package `bin/Debug/netcoreapp2.0/<runtime identifier>/publish` to your image.
That directory has the native executable binary as well as all needed runtime dependencies. 

After following these steps to configure Yocto, .NET Core applications should run just like they do on other supported Linux distros.




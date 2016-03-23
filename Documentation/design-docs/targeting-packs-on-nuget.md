# Targeting Packs as NuGet Packages for Fun and Profit

We want to create NuGet packages for each of the targeting packs.  Here's a short list of why we'd like to do this:

- Making the lives of library developers easier
- Dealing with a build server for multitargeting code of any kind
- Allowing for easily auto-referencing assemblies for traditional PCL targets
- Providing a way to allow for supporting new targets with PCL profiles and not break everyone's code

A long-term goal is to make this the mechanism Visual Studio uses, as well.

## Let's talk solutions

1. Author NuGet Packages adhering to a particular naming scheme:

   - `Microsoft.TargetingPack.NETFramework.v3.5`
   - `Microsoft.TargetingPack.NETFramework.v4.6.1`
   - `Microsoft.TargetingPack.NETPortable.Profile259`
   - etc.
   
2. Implement a convention where the CLI treats the NuGet package as the replacement directory for framework assemblies.

   - Instead of looking in e.g., `ref/net46`, it looks in the package directory instead.
   - Will prefer targeting packs already installed on the machine if they exist (so as not to screw with VS).
  
3. Have the targeting pack define metadata that informs the build system.

   - This will solve the problem of traditional PCL targets not auto-referencing their reference assemblies.
   - PCL packs will specify what the NuGet TFM for that particular profile is.
   - Allowing targeting packs to specify this info makes the .NET CLI happy.

4. Use this as an avenue for getting rid of `frameworkAssemblies`, instead allowing you to reference directly from the package.

   - This requires NuGet and the existing project system to allow referencing directly from within a package.
   - Reasoning about "additionally pulling in these references from this package" makes the most sense.

5. For now, only worry about English.

   - We don't have a good localization story for .NET Core yet, but it may be important if this is how we supply the data for intellisense in the future.
   
6. For RTM, keep this confined to the CLI.

   - Let's not break Intellisense in VS2015.

## So what gets a targeting pack?

Each version of .NET Framework gets its own targeting pack:

- 2.0
- 3.5
- 4.0
- 4.5
- 4.5.1
- 4.5.2
- 4.6
- 4.6.1
- future versions of .NET Framework

Each PCL profile gets its own targeting pack.

Silverlight 5 gets a targeting pack.

Xamarin targeting packs may be created in the future.

## Show me the ~~money~~ JSON

Here's what the targeting section of JSON.NET's `project.json` file could look like with this implemented.

```javascript
{
   ...
    "frameworks": {
        "net45": {
            "dependencies":{
               "Microsoft.TargetingPack.NETFramework.v4.5":{
                  "version":"1.0.0",
                  "references":[
                     "System.Data",
                     "System.Numerics",
                     "System.Runtime.Serialization",
                     "System.Xml",
                     "System.Xml.Linq"
                  ]
               }
            }
       },
       "net40": {
            "dependencies":{
               "Microsoft.TargetingPack.NETFramework.v4.0":{
                  "version": "1.0.0",
                  "references": [
                     "System.Data",
                     "System.Numerics",
                     "System.Runtime.Serialization",
                     "System.Xml",
                     "System.Xml.Linq"
                  ]
               }
            }
       },
       "net35": {
            "dependencies":{
               "Microsoft.TargetingPack.NETFramework.v3.5":{
                  "version":"1.0.0",
                  "references":[
                     "System.Core",
                     "System.Data",
                     "System.Runtime.Serialization",
                     "System.Xml",
                     "System.Xml.Linq",
                  ]
               }
            }
       },
       "net20": {
            "dependencies":{
               "Microsoft.TargetingPack.NETFramework.v2.0":{
                  "version":"1.0.0",
                  "references": [
                     "System.Data",
                     "System.Xml",
                  ]
               }
            }
       },
       ".NETPortable,Version=v4.5,Profile=Profile259": {
            "compilationOptions": {
                "define": [ "PORTABLE" ]
             },
             "dependencies":{
               "Microsoft.TargetingPack.NETPortable.Profile259":"1.0.0"
            }
       },
       ".NETPortable,Version=v4.0,Profile=Profile328": {
            "compilationOptions": {
                "define": [ "PORTABLE40" ]
            },
            "dependencies":{
               "Microsoft.TargetingPack.NETPortable.Profile328":"1.0.0"
            }
       },
       "netstandard1.0":{
            ...
       }
   }
   ...
}
```

## Targeting Pack Layout

The layout for targeting packs should be very simple - a metadata file and some assemblies.  Here's some examples:

**.NET Framework**
```
/Microsoft.TargetingPack.NETFramework.v4.5
|__metadata.yaml
|__mscorlib.dll
|__System.dll
|__System.Core.dll
|__System.Net.Http.dll
...
```
**.NET Portable**

PCL Profile Package layout:
```
/Microsoft.TargetingPack.NETPortable.Profile259
|__metadata.yaml
|__mscorlib.dll
...
```

## Let's define some metadata

The goal here is to have a data-driven approach for two things:

- Define what gets referenced by default from a targeting pack
- Specify which platforms a particular PCL target supports

The latter is specifically for people authoring NuGet packages.  Today, there is no easy way to reason about which PCL target maps to which targets.  This will allow the proper NuGet TFM (e.g. `platform1+platform2+platform3`) to be generated when the project is built, while still allowing profiles specified in the `project.json` to live on as they have been.

This also has the benefit of being flexible if we come out with a new target that a particular profile needs to support.  All we do is then append the TFM for that platform to the name in the metadata file and update the package.

### Example metadata files

**Note**: I chose YAML here because I think it's simple, but this could be JSON or XML or Pig Latin or whatever we ultimately decide on.

**.NET Framework:**
```yaml
assemblies:
   mscorlib
   System
```

**PCL (per-profile, example: Profile=259)**

Because PCL profiles auto-reference all contract assemblies, no assemblies need to be specified here.  Instead, this defines the aggregate TFM used when building a NuGet package.

```yaml
deploy:
   portable-net45+netcore45+wpa81+wp8
```

## Conflict resolution?  What is this, politics?

You can easily specify contracts in packages that may or may not exist in a targeting pack.  Let's sort this out.

Consider the following `project.json`:

```javascript
{
    "dependencies":{
        "NETStandard.Library":"1.0.0"
    },
    "frameworks":{
        "net45":{
            "dependencies":{
               "Microsoft.TargetingPack.NETFramework.v4.5":"1.0.0"
            }
        },
        "netstandard10":{
            ...
        },
        "netstandard15":{
            ...
        }
    }
}
```

Contracts useful to `net45` are defined both in the set of packages `NETStandard.Library` closes over *and* the contracts referenced by default in the targeting pack `net45` specifies.  So which contracts are picked by the compiler when building `net45`?

**Answer:** Choose the contracts in the targeting pack.  If you specify a targeting pack, the compiler should use the contracts defined there, even if there would appear to be a conflict.  After all, you *did* specify a completely different implementation of .NET as a target, so it's reasonable to assume that you would expect to use the contracts in that targeting pack.

But what if you do something like this?

```javascript
{
    "dependencies":{
        "NETStandard.Library":"1.0.0"
    },
    "frameworks":{
        "net45":{
            "dependencies":{
               "Microsoft.TargetingPack.NETFramework.v4.5":"1.0.0",
               "System.IO":"1.0.0"
            }
        },
        "netstandard10":{
            ...
        },
        "netstandard15":{
            ...
        }
    }
}
```

In this case, the you are specifying a package, `System.IO`, containing contracts that are also defined in the default set of contracts automatically referenced in the targeting pack.  So which contracts are picked by the compiler when building `net45`?

**Answer:** If the version is the same or higher, pick the contracts in the`System.IO` package.  After all, you *did* specify a package specific to that platform, so it's reasonable to assume that it was your intent to use those APIs even if they are also present in a targeting pack.

But what if you did something like this?

```javascript
{
    "dependencies":{
        "NETStandard.Library":"1.0.0"
    },
    "frameworks":{
        "net45":{
            "dependencies":{
               "Microsoft.TargetingPack.NETFramework.v4.5":{
                  "version":"1.0.0",
                  "references":{
                     "System.Net.Http"
                  }
               },
               "System.IO":"1.0.0",
               "System.Net.Http":"1.0.0"
            }
        },
        "netstandard15":{
            ...
        }
    }
}
```

Here you chose to specify that you would like to do the following:

- Additonally Reference `System.Net.Http` from the targeting pack
- Specify a package dependency on the `System.Net.Http` package

Which contracts should the compiler pick when building `net45`?

**Answer**: Take the package, but spit out a warning.  Here there's no reasonable assumption to be made about your intent, but we still prefer a package so long as it's compatible with the target.  You should be notified of this though, so you can clean up your `project.json`.

### None of that made any sense to me

Here's a general set of guidelines:

- If you specify a package within a target, we'll assume you intended to do that
- Packages win over default references if the version is the same or higher

All other rules about dependency resolution apply to the above (e.g., you can't add packages to a PCL profile).  We'll be documenting these rules in [the official docs](http://dotnet.github.io/docs).

## Open Issues

- NuGet and the traditional project system (csproj et al.) will need to allow for referencing stuff from within a package
- NuGet/`dotnet-restore` will have to understand the changes to the `project.json` file
- Other packages - UWP, other `.winmd` related stuff?
- How do we make this the default experience for the next version of Visual Studio?
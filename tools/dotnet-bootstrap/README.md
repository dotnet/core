DOTNET.BOOTSTRAP(1)
### NAME
.NET CLI Bootstrapping Tool - A tool to help you bootstrap the .NET Command Line Tool on unsupported platforms.

### SYNOPSIS
python dotnet.bootstrap.py [-b __build_set__] [-nopatch] [-payload __tarball_path__]

### DESCRIPTION  
dotnet.bootstrap.py is the .NET CLI bootstrapping script (written for Python 2.7) that intends to help developers move to new platforms and "bring up" the required pieces.

There are default settings that intend to hit the 'most cases' scenario. If all is going to plan, you should never need to specify any additional parameters. However
many situations arise where it becomes a necessity or a nice-to-have. Namely, when things go wrong, you want to be able to get in there and fix
up the build, make changes, etc. This is 'development mode' or DevMode for short. In DevMode, NO git commands are executed (ONE EXCEPTION: if the expected repo directories (coreclr, corefx, core-setup, libuv) do not exist, 
we will clone them in). This is to prevent the script from stomping out any changes you have made in the working directory. Additionally, when things do go wrong (inevitably they will), this tool places a shell/batch 
script within the working directory that contains the command line that failed. This is to enable the scenario where you want to 'drill into' a problem.

### EXAMPLES
Intended use,

```
./dotnet.bootstrap.py
```
This will spawn a directory next to the bootstrap script, named after its runtime identifier (the runtime identifier is currently picked from the /os/release and we concatenate the 
VERSION and VERSION_ID values). So on an AMD64 Ubuntu 16.04 machine, the RID is ubuntu.16.04-x64-dotnet 

Any additional runs can be controlled via these command lines, and consequently, any additional runs are going to be in DevMode.

```
./dotnet.bootstrap.py -b corefx libuv
```
This will build only the corefx binaries and coreclr binaries, then patch the files.

If you want to prevent patching (for example, just to re-run a build):

```
./dotnet.bootstrap.py -b corefx coreclr -nopatch
```

Additionally, if you have a tarball of the files that you'd like to produce, consider:

```
./dotnet.bootstrap.py -b corefx coreclr -nopatch -payload ~/downloads/dotnet-dev-build.tar.gz
```

### DEFAULTS

By default, running ./dotnet.bootstrap.py with no additional parameters is equivalent to this command line:
```
./dotnet.bootstrap.py -b corefx coreclr libuv core-setup -payload __dotnet_cli_repository_url__
```

### OPTIONS
*-b __build_set__*

&nbsp;&nbsp;&nbsp;&nbsp;__build_set__ is the space-delimited set of repositories to place. At the moment it is one of these {coreclr, corefx, core-setup, libuv}. 

*-nopatch*

&nbsp;&nbsp;&nbsp;&nbsp;As part of the bootstrapping process, we "patch" (overwrite/replace native binaries) a pre-built version of the CLI.

*-payload __tar_filepath__*

&nbsp;&nbsp;&nbsp;&nbsp;By default dotnet.bootstrap will pull in a pre-built tar file from the CLI repository and patch this. If you want to provide your own binaries to patch
    (from dev builds or something), then specify a path (relative or absolute).

### OVERVIEW
After you run the dotnet.bootstrap, you'll see a directory named after the Runtime Identifier (RID) next to the script, the directory tree looks like this (for example),

```
<RID>
├── bin
│   ├── dotnet
│   ├── host
│   ├── LICENSE.txt
│   ├── sdk
│   ├── shared
│   └── ThirdPartyNotices.txt
├── obj
│   └── dotnet-dev-debian-x64.latest.tar.gz
└── src
    ├── coreclr
    ├── corefx
    ├── core-setup
    └── libuv
```
# Rover
The dotnet CLI bootstrapping tool

## What
Bootstrapping a tool like the dotnet CLI can be a dizzying effort. From a high-level we simply want to replace the native components of a pre-existing CLI with new ones that
have been built on the targetted platform. Unfortunately, from the bottom-up, this means that we need to clone a handful of dotnet repositories, execute particular
command lines with particular arguments and then copy them in to a pre-existing dotnet file. Rover aims to simplify that.

The goal is to place Rover on to the distro of choice, execute it, and then have it do the required steps for you - and then things 'just work'! 

However, things don't always 'just work.' When this is the case Rover hopes to reduce the amount of effort necessary to fix build or script breaks by placing 'repro' shell scripts when there is a failure so that a developer can go in and 'apply pressure' where appropriate. 

## How

There are default settings for each of the rover arguments. If all is going to plan, you should never need to specify any additional parameters. However
many situations arise where it becomes a necessity or a nice-to-have. Namely, when things go wrong, you want to be able to get in there and fix
up the build, make changes, etc. This is 'development mode' or DevMode for short. In DevMode, NO git commands are executed. This is to prevent 
the script from stomping out any changes you have made in the working directory. 

DevMode is triggered if the working directory is pre-existing. Consequently, when things fail in the script, we do not 'clean up' the working directory. We write a repro script
of the command that failed and then we bail out immediately.

Rover has the following command line options:

- -clone [-c] - This defines the set of repositories that we want to clone. This WILL NOT function in DevMode. By default the full clone set is specified as {coreclr, corefx, core-setup, libuv}.

- -build [-b] - This defines the set of repositories we want to build. By default the full build set is specified as {coreclr, corefx, core-setup, libuv}

- -nopatch

- -payload - a path to a local tarball that we will extract and then subsequently patch. If this is not specified, we pull the latest tarball from the dotnet repository.

## Work Flow
Place Rover in a directory. Run it. 

In the event of a failure, we prevent clean-up. If the failure is not a rover script error, there is likely a rover_failure-repro.sh in the directory where the command failed (you are notified on 

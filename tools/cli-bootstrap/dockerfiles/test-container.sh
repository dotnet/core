#!/usr/bin/env bash
# This shell script 'bakes' the docker containers that we depend on. Essentially, it sets up the docker containers in a certain manner where we
# are enabled to run a test case within them.

# to add a new platform to test on, simply create a directory (named anything that isn't already present) with a dockerfile in it. 

function RunPlatform
{
    SELECTED_CONTAINER=$1

    echo "running 'cli-bootstrap:${SELECTED_CONTAINER}'"
    pushd ../dockerfiles/$dir
    
    # copy the bootstrap in to place.
    
    # copy ../../cli.bootstrap.py .

    # this will mount our current directory as the working directory in the docker containers
    docker run -v $PWD:/env/cli-bootstrap cli-bootstrap:$name python cli.bootstrap.py -to . # this will generate the src, obj, and bin directory here.

    # copy test cases to this platform
    # cp ../testing/* testing 
    popd
}

for dir in ../dockerfiles/*/ ; do
    echo "$dir"
    name=${dir%"/"}
    RunPlatform $name
done 
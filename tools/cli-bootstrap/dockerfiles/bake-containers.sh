#!/usr/bin/env bash
# This shell script 'bakes' the docker containers that we depend on. Essentially, it sets up the docker containers in a certain manner where we
# are enabled to run a test case within them.

# specify a single directory name to bake just a single container


function BakePlatform
{
    SELECTED_CONTAINER=$1

    echo "baking 'cli-bootstrap:${SELECTED_CONTAINER}'"
    pushd ${SELECTED_CONTAINER}
    docker build -t "cli-bootstrap:${SELECTED_CONTAINER}" .
    popd
}

# if you don't specify a parameter, we will build all of the platforms in the directory
if [ -z ${1} ]
    then
        for dir in */ ; do
            name=${SELECTED_CONTAINER%"/"}
            BakePlatform $name
        done 
else
    # otherwise, specifying a single directory will cause just that directory to be baked (so long as the directory exists)
    if [ -d "$1" ]
        then
            BakePlatform $1
    else
        echo "The directory $1 could not be found."
    fi
fi



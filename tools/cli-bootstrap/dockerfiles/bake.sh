#!/usr/bin/env bash
for dir in */ ; do
    echo "$dir"
    pushd $dir
    name=${dir%"/"}
    docker build -t "rover:$name" .
    popd
done 
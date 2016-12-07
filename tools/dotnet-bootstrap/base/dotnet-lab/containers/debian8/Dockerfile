#
# Copyright (c) .NET Foundation and contributors. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.
#

# Dockerfile that creates a container suitable to build dotnet-cli
FROM debian:8.0

# Misc Dependencies for build
RUN apt-get update && \
    apt-get -qqy install \
        llvm-3.5 \
	lldb-3.5 \
	lldb-3.5-dev \
        curl \
	uuid-dev \
        unzip \
        gettext \
        sudo && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# This could become a "microsoft/coreclr" image, since it just installs the dependencies for CoreCLR (and stdlib)
RUN apt-get update &&\
    apt-get -qqy install \
        libunwind8 \
	libunwind8-dev \
        libkrb5-3 \
        libicu52 \
	libicu-dev \
        liblttng-ust0 \
	liblttng-ust-dev \
        libssl1.0.0 \
        zlib1g \
	libssl-dev \
	zlib1g-dev \
        libuuid1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Build Prereqs
RUN apt-get update && \
    apt-get -qqy install \
        autogen \
        binutils \
        debhelper \
        build-essential \
        devscripts \
        git \
	automake \
        cmake \
	libkrb5-dev \
	libtool \
	libcurl4-openssl-dev \
        clang-3.5 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Use clang as c++ compiler
RUN update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang++-3.5 100
RUN update-alternatives --set c++ /usr/bin/clang++-3.5

# Set working directory
WORKDIR /opt/code

# Work around https://github.com/dotnet/cli/issues/1582 until Docker releases a
# fix (https://github.com/docker/docker/issues/20818). This workaround allows
# the container to be run with the default seccomp Docker settings by avoiding
# the restart_syscall made by LTTng which causes a failed assertion.
ENV LTTNG_UST_REGISTER_TIMEOUT 0

VOLUME /env/dotnet-bootstrap
WORKDIR /env/dotnet-bootstrap
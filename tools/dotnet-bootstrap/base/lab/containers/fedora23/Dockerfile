#
# Copyright (c) .NET Foundation and contributors. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.
#

# Dockerfile that creates a container suitable to build dotnet-cli
FROM fedora:23

# Install the base toolchain we need to build anything (clang, cmake, make and the like)
# this does not include libraries that we need to compile different projects, we'd like
# them in a different layer.
RUN dnf install -y cmake \
        clang \
        lldb-devel \
        make \
        which && \
    dnf clean all

# Install tools used by the VSO build automation.
RUN dnf install -y git \
        zip \
        tar \
        nodejs \
        findutils \
        npm && \
    dnf clean all && \
    npm install -g azure-cli && \
    npm cache clean

# Dependencies of CoreCLR and CoreFX.
RUN dnf install -y libicu-devel \
        libuuid-devel \
	libtool \
        libcurl-devel \
        openssl-devel \
        libunwind-devel \
        lttng-ust-devel && \
    dnf clean all

# Upgrade NSS, used for SSL, to avoid NuGet restore timeouts.
RUN dnf upgrade -y nss
RUN dnf clean all


# Set working directory
VOLUME /env/dotnet-bootstrap
WORKDIR /env/dotnet-bootstrap

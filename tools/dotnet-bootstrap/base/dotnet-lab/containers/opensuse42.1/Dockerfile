#
# Copyright (c) .NET Foundation and contributors. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.
#

FROM opensuse:42.1

# Install the base toolchain we need to build anything (clang, cmake, make and the like)
# this does not include libraries that we need to compile different projects, we'd like
# them in a different layer.
RUN zypper -n update

RUN zypper -n install binutils \
              python \
	      cmake \
              which \
              gcc \
	      libtool \
	      python-xml \
	      libicu-devel \
	      lldb \
	      lldb-devel \
	      libunwind-devel \
	      libuuid-devel \
              llvm-clang \
              tar \
              ncurses-utils \
              curl \
              git \
              sudo && \
    ln -s /usr/bin/clang++ /usr/bin/clang++-3.5 && \
    zypper clean -a

# Dependencies of CoreCLR and CoreFX.  We need to add an additional repository to get lttng.
RUN zypper addrepo -G http://download.opensuse.org/repositories/devel:/tools:/lttng/openSUSE_13.2/devel:tools:lttng.repo
RUN whereis zypper
RUN zypper refresh
RUN whereis zypper
RUN whereis zypper
RUN zypper -n -q install libunwind
RUN whereis zypper
# we have to force zypper to resolve this dependency because it,
# itself, depends on krb5-mini which needs to be uninstalled (possibly
# uninstalling zypper)
RUN zypper -n -q install --force-resolution krb5-devel 
RUN zypper -n -q install lttng-ust-devel
RUN zypper -n -q install libuuid1
RUN zypper -n -q install libopenssl-devel
RUN zypper -n -q install libopenssl1_0_0
RUN zypper -n -q install libcurl-devel
		      
RUN update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang++ 100
RUN update-alternatives --set c++ /usr/bin/clang++

VOLUME /env/dotnet-bootstrap
WORKDIR /env/dotnet-bootstrap
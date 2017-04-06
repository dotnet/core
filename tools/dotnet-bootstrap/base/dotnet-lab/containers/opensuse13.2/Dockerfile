#
# Copyright (c) .NET Foundation and contributors. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.
#

FROM opensuse:13.2

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
RUN zypper addrepo -G http://download.opensuse.org/repositories/devel:/tools:/lttng/openSUSE_13.2/devel:tools:lttng.repo && \
    zypper refresh && \
    zypper -n remove krb5-mini && \
    zypper -n install libunwind \
                      libicu \
		      krb5-devel \
                      lttng-ust-devel \
                      libuuid1 \
		      libopenssl-devel \
                      libopenssl1_0_0 \
                      libcurl-devel && \
    zypper clean -a

RUN update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang++ 100
RUN update-alternatives --set c++ /usr/bin/clang++

VOLUME /env/dotnet-bootstrap
WORKDIR /env/dotnet-bootstrap
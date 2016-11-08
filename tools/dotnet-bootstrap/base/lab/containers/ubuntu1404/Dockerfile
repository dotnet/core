FROM ubuntu:14.04
MAINTAINER Bryan P. Arant <bryanar@microsoft.com>
RUN apt-get -qqy update
RUN apt-get -qqy install libkrb5-dev build-essential libtool git binutils python automake cmake llvm-3.5 clang-3.5 lldb-3.6 lldb-3.6-dev libunwind8 libunwind8-dev gettext libicu-dev liblttng-ust-dev libcurl4-openssl-dev libssl-dev uuid-dev

# Use clang as c++ compiler
RUN update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang++-3.5 100
RUN update-alternatives --set c++ /usr/bin/clang++-3.5

VOLUME /env/dotnet-bootstrap
WORKDIR /env/dotnet-bootstrap

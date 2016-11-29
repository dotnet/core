FROM centos:7.1.1503
MAINTAINER Bryan P. Arant <bryanar@microsoft.com>
RUN yum -q -y install deltarpm
RUN yum -q -y install epel-release
RUN yum -q -y update
RUN yum -q -y install unzip libunwind8 libunwind8-dev gettext libcurl-devel openssl-devel zlib libicu-devel liblttng-ust lttng-ust-devel libunwind-devel libuuid-devel automake autoconf libtool
RUN yum -q -y install binutils
RUN yum install -y http://mirror.symnds.com/distributions/gf/el/7/plus/x86_64/cmake-3.3.2-1.gf.el7.x86_64.rpm \
	        https://matell.blob.core.windows.net/rpms/clang-3.6.2-1.el7.centos.x86_64.rpm \
	        https://matell.blob.core.windows.net/rpms/clang-libs-3.6.2-1.el7.centos.x86_64.rpm \
	        https://matell.blob.core.windows.net/rpms/lldb-3.6.2-1.el7.centos.x86_64.rpm \
	        https://matell.blob.core.windows.net/rpms/lldb-devel-3.6.2-1.el7.centos.x86_64.rpm \
	        https://matell.blob.core.windows.net/rpms/llvm-3.6.2-1.el7.centos.x86_64.rpm \
	        https://matell.blob.core.windows.net/rpms/llvm-libs-3.6.2-1.el7.centos.x86_64.rpm \
	        which \
	        make

RUN yum -q -y install tar git

RUN update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang++ 100
RUN update-alternatives --set c++ /usr/bin/clang++

RUN yum -q -y install sudo

VOLUME /env/dotnet-bootstrap
WORKDIR /env/dotnet-bootstrap

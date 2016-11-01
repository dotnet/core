FROM opensuse:13.2
MAINTAINER Bryan P. Arant <bryanar@microsoft.com>
RUN apt-get -qqy update
RUN apt-get -qqy install git
RUN apt-get -qqy install python
VOLUME /env/rover
WORKDIR /env/rover
ENTRYPOINT python rover.py
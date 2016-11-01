#!/usr/bin/env python 

import json

from subprocess import call
from subprocess import check_output
from os         import path

# Debian	.deb	    apt, apt-cache, apt-get, dpkg
# Ubuntu	.deb	    apt, apt-cache, apt-get, dpkg
# CentOS	.rpm	    yum
# Fedora	.rpm        dnf
# FreeBSD   Ports,.txz	make, pkg

def Detect(pm_name):
    aptget_check_output = check_output('whereis %s'%(pm_name), shell=True)
    
    if(len(str(aptget_check_output).strip()) > len('%s:'%(pm_name))):
        return True

    return False

if __name__ == "__main__":
    scriptDirectory = path.dirname(path.abspath(__file__))
    dependencies = json.load(open(path.join(scriptDirectory, 'repo-dependencies.json'), mode='r'))

    if Detect('apt-get'):
        print('detected apt-get.')
        for dep in dependencies['apt-get']:
            call('apt-get -qqy install %s'%(str(dep)), shell=True)
    elif Detect('yum'):
        print('detected yum.')

        for dep in dependencies['yum']:
            call('yum -qy install %s'%(str(dep)), shell=True)
    else:
        print('failed to find a compatible package manager.')

        print('TODO: Print list of dependencies, or attempt to fetch them from the web?')

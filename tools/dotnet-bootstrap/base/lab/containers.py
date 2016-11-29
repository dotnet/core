#!/usr/bin/env python 

# This shell script 'bakes' the docker containers that we depend on. Essentially, it sets up the docker containers in a certain manner where we
# are enabled to run a test case within them.

# specify a single directory name to bake just a single container

from shellcall import ShellCall
from shellcall import ContinueOnError
import sys
import os

from sys import argv
from os.path import join
from os.path import dirname
from os.path import realpath
from os import getcwd

from globals import g_override

# interface + data binding for managing the containers.
class Containers:
    _supported_platforms = join(dirname(realpath(__file__)), 'containers') + '/' # our 'list' of current supported platforms are the directories in this directory

    def Bake(self, selected_platform):
        ShellCall("echo baking 'dotnet-bootstrap:%s'"%(selected_platform), lenient=True)
        ShellCall("docker build -t \"dotnet-bootstrap:%s\" ."%(selected_platform), join(self._supported_platforms, selected_platform), lenient=True)

    def CleanContainerFolder(self, container, folderName):
        ShellCall("rm -R -f %s"%(join(self._supported_platforms, container, folderName)), lenient=True)
        
    def CleanAll(self):
        for root, platforms, files in os.walk(self._supported_platforms):
            for platform in platforms:
                self.CleanContainerFolder(platform, "src")
                self.CleanContainerFolder(platform, "obj")
                self.CleanContainerFolder(platform, "bin")
                self.CleanContainerFolder(platform, "testing")
                
            break
        
    def _bakeOverride(self):
        for container in g_override["containers"]:
            try:
                self.Bake(container)
            except ContinueOnError:
                continue
                
                
    def BakeAll(self):
        if g_override:
            self._bakeOverride()
            return
        
        for root, platforms, files in os.walk(self._supported_platforms):
            for platform in platforms: # we keep it explicitly the case that there are no other directories in the cases or containers directories.
                try:
                    self.Bake(platform)
                except ContinueOnError:
                    continue
            break

    def List(self):
        ShellCall('ls -1 %s'%(self._supported_platforms))


def PrintUsage():
    print("TODO: Usage")

if __name__ == '__main__':
    containers = Containers()

    dictionary = { 
        "bake": containers.BakeAll,
        "list": containers.List,
        "clean": containers.CleanAll
    }

    if len(argv) <= 1:
        PrintUsage()
        exit()

    dictionary[argv[1]]()
    

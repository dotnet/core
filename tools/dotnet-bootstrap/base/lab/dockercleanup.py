#!/usr/bin/env python 


from shellcall import ShellCall

# Delete all containers
ShellCall("docker rm $(docker ps -a -q)")
# Delete all images
ShellCall("docker rmi $(docker images -q)")
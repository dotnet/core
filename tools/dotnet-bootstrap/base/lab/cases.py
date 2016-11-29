#!/usr/bin/env python 
import os
import sys

from shellcall import ShellCall
from shellcall import ContinueOnError
from sys       import argv
from os        import getcwd

from os.path   import join, exists, dirname, realpath

from globals import g_override

# interface + data binding for managing the testcases.
class Cases:
    _labPath = dirname(realpath(__file__))
    _supported_containers = join(_labPath, 'containers/') # our 'list' of current supported platforms are the directories in this directory
    _testcases = join(_labPath, 'cases/')
    _continueOnError = True
    _lenient = True

    
    # if current_working_directory = None, then we use the working dir dictated by the dockerfile
    # if none is specified in the dockerfile, then docker uses '/'
    def _docker_compose(self, identifier, local_volume, current_working_directory = None):
        wdir_parameter = None
        
        if current_working_directory:
            wdir_parameter = '-w "%s"'%(current_working_directory)
            
        return 'docker run %s -v %s:/env/dotnet-bootstrap dotnet-bootstrap:%s'%(wdir_parameter, local_volume, identifier)
    
    # Runs a select case
    def RunIn(self, container_name, casename):
        local_mount_location = join(self._supported_containers, container_name)
        testing_destination = join(local_mount_location, "testing/")
        
        ShellCall("echo \"running 'dotnet-bootstrap:%s - testcase: %s'\""%(container_name, casename), lenient = self._lenient)
        
        # copy the bootstrap and test source in to the container working directory (next to the Dockerfile)
        ShellCall('cp %s %s'%(join(self._labPath, '../../dotnet.bootstrap.py'), join(self._supported_containers, container_name)), lenient = self._lenient)
        ShellCall('mkdir -p %s'%(join(testing_destination, casename)), lenient=self._lenient)
        ShellCall('cp -R %s %s'%(join(self._testcases, casename), join(testing_destination, casename)), lenient = self._lenient)
        
        docker_run_cmd = 'docker run -v %s:/env/dotnet-bootstrap dotnet-bootstrap:%s'%(local_mount_location, str(container_name))
        # ^ : This runs docker using the current container directory (with the Dockerfile) as the current working directory.
        # so that anything placed in that directory becomes accessible. 
        # eventually we will copy the tests in to this directory as well (see below)
                        
        # run the bootstrap
        ShellCall('%s python /env/dotnet-bootstrap/dotnet.bootstrap.py -to /env/dotnet-bootstrap/'%(docker_run_cmd), lenient = self._lenient) # this will generate the src, obj, and bin directory here.
                
        # create whatever project file is the latest and greatest (was project.json, and is now named after the directory.csproj)
        ShellCall('%s /env/dotnet-bootstrap/bin/dotnet new -t Console'%(self._docker_compose(container_name, local_mount_location, join("/env/dotnet-bootstrap/testing/", casename))), lenient= self._lenient)
        #ShellCall('ls', cwd=join(testing_destination, casename, casename + '.csproj'))
        
        # confirm that it exists.
        if exists(join(testing_destination, casename, casename + '.csproj')):
            ShellCall('mkdir -p %s'%join(testing_destination, casename, "result"))
            ShellCall('touch %s'%(join(testing_destination, casename, "result", "pass"))) # spawn a result; a failure is when this doesn't exist. If this exists, this is a passing testcase.
            
            ShellCall('cp -R %s/* %s'%(join(self._testcases, casename), join(testing_destination, casename)), lenient= self._lenient)
            # ShellCall('%s /env/dotnet-bootstrap/bin/dotnet restore .'%(self._docker_compose(container_name, local_mount_location, join("/env/dotnet-bootstrap/testing/", casename))), lenient=self._lenient)
            # ShellCall('%s /env/dotnet-bootstrap/bin/dotnet run'%(self._docker_compose(container_name, local_mount_location, join("/env/dotnet-bootstrap/testing/", casename))), lenient=self._lenient)

        self.Report()
        
    def _runOverride(self):
        for container in g_override["containers"]:
            for case in g_override["cases"]:
                try:
                    self.RunIn(container, case)
                except ContinueOnError: # we threw this up with the intention of being OK with moving on.
                    continue
                
    def _status(self, container, case):
        print("CONTAINER - CASE - STATUS")
        target = "%s - %s"%(container, case)
        testing_destination = join(self._supported_containers, container, "testing/")
        if exists(join(testing_destination, case, "result", "pass")):
            print("%s - pass"%(target))
        else:
            print("%s - fail"%(target))
            
            
    def Report(self):
        for container in g_override["containers"]:
            for case in g_override["cases"]:
                    self._status(container, case)
                    
    # runs the full matrix of tests
    def RunAll(self):
        if g_override:
            self._runOverride()
            return
        
        for root, containers, files in os.walk(self._supported_containers):
            for container in containers: # we keep it explicitly the case that there are no other directories in the cases or containers directories.
                for root, cases, files in os.walk(self._testcases):
                    for case in cases:
                        try:
                                self.RunIn(container, case) # runs the full matrix of environments and cases
                        except ContinueOnError:
                            continue
                    break # just walk the top level
            break # just walk the top level.

    def List(self):
        ShellCall('ls -1 %s'%(self._testcases), lenient = self._lenient)

        
    def __init__(self):
        if not exists(self._supported_containers):
            print('no such directory: %s\n'%(self._supported_containers))
            sys.exit()

        if not exists(self._testcases):
            print('no such directory: %s\n'%(self._testcases))
            sys.exit()
            
def PrintUsage():
    print("TODO: Usage")

if __name__ == '__main__':
    testcases = Cases()

    if len(argv) <= 1:
        PrintUsage()
        exit()

    dictionary = { 
        "run": testcases.RunAll,
        "list": testcases.List,
        "report": testcases.Report
    }

    dictionary[argv[1]]()

using System;
using System.IO;

using Lab.Exceptions;
using Newtonsoft.Json.Linq;

using static System.IO.Path;
using static System.IO.File;
using static System.String;
using static System.Console;
using static System.Environment;

using static Lab.Shell;


namespace Lab
{
    // interface + data binding for managing the testcases.
    public class Cases 
    {
        private string _base_path;
        private string  _containers_path;
        private string  _cases_path;
        private bool    _lenient              = true;

        public Cases(string basepath)
        {
            _base_path               = basepath;
            
            // field initializers can't reference other field initializers, so I moved them to the ctor.
            _containers_path        = Combine(basepath, "containers");
            _cases_path             = Combine(basepath, "cases");

            if(!Directory.Exists(_containers_path))
            {
                WriteLine($"no such directory: {_containers_path}\n");
                Exit(-1);
            }

            if(!Directory.Exists(_cases_path))
            {
                WriteLine($"no such directory: {_cases_path}\n");
                Exit(-1);
            }
        }

        // TODO
        public void Run(string casefile)
        {
            // mystery.
        }

        // Runs a select case
        public void RunCase(string container_name, string casename)
        {
            const string BOOTSTRAP_PATH     = "../../dotnet.bootstrap.py";
            
            string testcase_path            = Combine("/env/dotnet-bootstrap/testing/", casename);
            string local_mount_location     = Combine(_containers_path, container_name);
            string testing_destination      = Combine(local_mount_location, "testing");
            
            Call($"echo \"running 'dotnet-bootstrap:{container_name} - testcase: {casename}'\"",                        lenient: _lenient);
            
            // copy the bootstrap and test source in to the container working directory (next to the Dockerfile)
            Call($"cp {Combine(this._base_path, BOOTSTRAP_PATH)} {Combine(this._containers_path, container_name)}",  lenient: _lenient);
            Call($"mkdir -p {Combine(testing_destination, casename)}",                                                  lenient: _lenient);
            Call($"cp -R {Combine(this._cases_path, casename)} {Combine(testing_destination, casename)}",                lenient: _lenient);
 
            string docker_run_cmd = $"docker run -v {local_mount_location}:/env/dotnet-bootstrap dotnet-bootstrap:{container_name}";
            // ^ : This runs docker using the current container directory (with the Dockerfile) as the current working directory.
            // so that anything placed in that directory becomes accessible. 
            // eventually we will copy the tests in to this directory as well (see below)
                            
            // run the bootstrap
            Call($"{docker_run_cmd} python /env/dotnet-bootstrap/dotnet.bootstrap.py -to /env/dotnet-bootstrap/", lenient: _lenient); // this will generate the src, obj, and bin directory here.
                    
            // create whatever project file is the latest and greatest (was project.json, and is now named after the directory.csproj)
            Call($"{_docker_compose(container_name, local_mount_location)} /env/dotnet-bootstrap/bin/dotnet new -t Console", lenient: _lenient);
            // Call('ls', cwd=join(testing_destination, casename, casename + '.csproj'))
            
            // confirm that it exists.
            if(Exists(Combine(testing_destination, casename, casename + ".csproj")))
            {
                Call($"mkdir -p {Combine(testing_destination, casename, "result")}");
                Call($"touch {Combine(testing_destination, casename, "result", "pass")}"); // spawn a result; a failure is when this doesn't exist. If this exists, this is a passing testcase.
                
                Call($"cp -R {Combine(_cases_path, casename)}/* {Combine(testing_destination, casename)}", lenient: _lenient);           
            }

            Report();
        }

        public void Report()
        {
            foreach(var container in Selection.List["containers"])
            {
                foreach(var testcase in Selection.List["cases"])
                {
                    _status(container.ToString(), testcase.ToString()); // TODO: Fix this
                }
            }
        }

        // runs the full matrix of tests
        public void RunAll()
        {
            if(Selection.List.Count > 0)
            {
                _runSelection();
                
                return;
            }

            foreach(var container in Directory.EnumerateDirectories(_containers_path))
            {
                foreach(var testcase in Directory.EnumerateDirectories(_cases_path))
                {
                    try 
                    {
                        RunCase(container, testcase); // runs the full matrix of environments and cases
                    }
                    catch(ContinueOnErrorException e)
                    {
                        continue;
                    }
                }
            }
        
        }

        public void List()
        {
            Call($"ls -1 {_cases_path}", lenient: _lenient);
        }

        #region Privates

        // if current_path_str = None, then we use the working dir dictated by the dockerfile
        // if none is specified in the dockerfile, then docker uses '/'
        private string _docker_compose(string identifier, string local_volume, string current_path_str = "")
        {
            string wdir_parameter = String.Empty;
            
            if(!IsNullOrEmpty(current_path_str))
            {
                wdir_parameter = $"-w \"{current_path_str}\"";
            }

            return $"docker run {wdir_parameter} -v {local_volume}:/env/dotnet-bootstrap dotnet-bootstrap:{identifier}";
        }

        private void _runSelection()
        {
            foreach(var container in Selection.List["containers"])
            {
                foreach(var testcase in Selection.List["cases"])
                {
                    try
                    {    
                        RunCase(container.ToString(), testcase.ToString());  // TODO: This will not work.
                    }
                    catch(ContinueOnErrorException) // we threw this up with the intention of being OK with moving on.
                    {
                        continue;
                    }
                }
            }
        }

        private void _status(string container, string testcase)
        {
            WriteLine("CONTAINER - CASE - STATUS");
            
            string target = $"{container} - {testcase}";
            string testing_destination = Combine(_containers_path, container, "testing");

            if(Exists(Combine(testing_destination, testcase, "result", "pass")))
            {
                WriteLine($"{target} - pass");
            }
            else
            {
                WriteLine($"{target} - fail");
            }
        }       
                
        #endregion
            
    }

}
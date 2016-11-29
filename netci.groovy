// Skeleton of this document was lifted from docs located at dotnet/dotnet-ci 

// Import the utility functionality.
// Defined/Documented at https://github.com/dotnet/dotnet-ci/blob/master/jobs/generation/Utilities.groovy
import jobs.generation.Utilities;

// Defines a the new of the repo, used elsewhere in the file
def project = GithubProject
def branch = GithubBranchName

// Generate the builds for debug and release, commit and PRJob
[true, false].each { isPR -> // Defines a closure over true and false, value assigned to isPR
    ['Release', 'Debug'].each { configuration ->
        // Determine the name for the new job.  The first parameter is the project,
        // the second parameter is the base name for the job, and the last parameter
        // is a boolean indicating whether the job will be a PR job.  If true, the
        // suffix _prtest will be appended.
        def newJobName = Utilities.getFullJobName(project, configuration, isPR)

        // Create a new job with the specified name.  The brace opens a new closure
        // and calls made within that closure apply to the newly created job.
        def newJob = job(newJobName) {
            // This opens the set of build steps that will be run.
            steps {
                // Indicates that a batch script should be run with the build string (see above)
                // Also available is:
                // shell (for unix scripting)
                shell("ls")
		
		shell("python tools/dotnet-bootstrap/base/lab/containers.py bake")
		shell("python tools/dotnet-bootstrap/base/lab/cases.py run")
            }
        }
        
        // not sure if 'Linux' is a valid value.
        Utilities.setMachineAffinity(newJob, 'Ubuntu14.04', 'latest-or-auto')
        
        // This call performs remaining common job setup on the newly created job.
        // It does the following:
        //   1. Sets up source control for the project.
        //   2. Adds standard options for build retention and timeouts
        //   3. Adds standard parameters for PR and push jobs.
        //      These allow PR jobs to be used for simple private testing, for instance.
        // See the documentation for this function to see additional optional parameters.
        Utilities.standardJobSetup(newJob, project, isPR, "*/${branch}")
        
        // The following two calls add triggers for push and PR jobs
        // In Github, the PR trigger will appear as "Windows Debug" and "Windows Release" and will be run
        // by default
        if (isPR) {
            Utilities.addGithubPRTriggerForBranch(newJob, branch, "Ubuntu ${configuration}")
        }
        else {
            Utilities.addGithubPushTrigger(newJob)
        }
    }
}

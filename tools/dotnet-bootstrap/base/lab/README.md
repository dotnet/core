# LAB

## Running The Test Case

1. Bake the containers (build your environments) (`./containers.py bake`)
2. Run the end-to-end testcase (run the e2e test case) (`./cases.py run`)

-- Note that the testcase is a check for the existence of the csproj after it has run the bootstrap tool. If the bootstrap fails to create a dotnet that can successfully create a project, then that would be a failure. Note, however, that this is not a testcase to check if the dotnet tool is running successfully.


## Test Cases
Intended interface for access is the class `Cases` in `cases.py`.

Listing all test cases,
```
./cases.py list
```

Running all test cases in all containers,
```
./cases.py run 
```
## Environments
Docker containers are used as the 'unit of environment.' 

```
./containers.py list
```

```
./containers.py bake
```

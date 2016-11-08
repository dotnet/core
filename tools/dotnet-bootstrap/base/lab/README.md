# LAB

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

Running specific testcase in all containers,
```
./cases.py run e2e  
```

Running specific testcase in specific container,
```
./cases.py run e2e -in debian8
```

## Environments
Docker containers are used as the 'unit of environment.' 

```
./containers.py list
```
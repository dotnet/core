module ClosureOptimizationSamples

let inline fold2
    ([<InlineIfLambda; OptimizeClosureIfNotInlined>] folder: 'State -> 'T1 -> 'T2 -> 'State)
    (state: 'State) (a: 'T1[]) (b: 'T2[]) =
    let mutable s = state
    for i in 0 .. a.Length - 1 do
        s <- folder s a[i] b[i]
    s

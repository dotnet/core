let matrix = Array2D.init 2 3 (fun row column -> row * 10 + column)
let created = Array2D.create 2 3 12
let copied = Array2D.copy matrix
let mapped = Array2D.map ((+) 1) matrix
let indexed = Array2D.mapi (fun row column value -> row + column + value) matrix
let rebased = Array2D.rebase matrix

if matrix[1, 2] <> 12 || created[1, 2] <> 12 || copied[1, 2] <> 12 ||
   mapped[1, 2] <> 13 || indexed[1, 2] <> 15 || rebased[1, 2] <> 12 then
    failwith "Unexpected Array2D result."

System.Console.WriteLine "Array2D operations passed."

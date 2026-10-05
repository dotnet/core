type CharEnum =
    | A = 'a'
    | B = 'b'

let invalidOr = CharEnum.A ||| CharEnum.B
let invalidAnd = CharEnum.A &&& CharEnum.B
let invalidXor = CharEnum.A ^^^ CharEnum.B

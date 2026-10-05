let operation = async {
    try
        failwith "operation failed"
    with _ ->
        reraise ()
}

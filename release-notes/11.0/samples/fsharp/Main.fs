module Main

[<EntryPoint>]
let main _ =
    DefaultSamples.validate ()
#if PREVIEW_SAMPLES
    PreviewSamples.validate ()
    RuntimeAsyncSamples.validate ()
    SrtpSamples.validate ()
    RecordConstructorSamples.validate ()
#endif
    0

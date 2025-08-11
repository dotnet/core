import { EventHandler, AbortSignal } from "./interfaces";
import { EventTargetImpl } from "./EventTargetImpl";
/**
 * Represents a signal object that communicates with a DOM request and abort
 * it through an AbortController.
 */
export declare class AbortSignalImpl extends EventTargetImpl implements AbortSignal {
    _abortedFlag: boolean;
    _abortAlgorithms: Set<(...args: any[]) => any>;
    /**
     * Initializes a new instance of `AbortSignal`.
     */
    private constructor();
    /** @inheritdoc */
    get aborted(): boolean;
    /** @inheritdoc */
    get onabort(): EventHandler;
    set onabort(val: EventHandler);
    /**
     * Creates a new `AbortSignal`.
     */
    static _create(): AbortSignalImpl;
}

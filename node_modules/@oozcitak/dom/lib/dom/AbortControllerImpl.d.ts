import { AbortSignal, AbortController } from "./interfaces";
/**
 * Represents a controller that allows to abort DOM requests.
 */
export declare class AbortControllerImpl implements AbortController {
    _signal: AbortSignal;
    /**
     * Initializes a new instance of `AbortController`.
     */
    constructor();
    /** @inheritdoc */
    get signal(): AbortSignal;
    /** @inheritdoc */
    abort(): void;
}

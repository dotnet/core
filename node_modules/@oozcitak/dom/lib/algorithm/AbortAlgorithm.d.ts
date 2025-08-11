import { AbortSignal } from "../dom/interfaces";
/**
 * Adds an algorithm to the given abort signal.
 *
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */
export declare function abort_add(algorithm: ((...args: any[]) => any), signal: AbortSignal): void;
/**
 * Removes an algorithm from the given abort signal.
 *
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */
export declare function abort_remove(algorithm: ((...args: any[]) => any), signal: AbortSignal): void;
/**
 * Signals abort on the given abort signal.
 *
 * @param signal - abort signal
 */
export declare function abort_signalAbort(signal: AbortSignal): void;

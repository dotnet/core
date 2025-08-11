import { EventListenerOptions, AddEventListenerOptions, EventListenerEntry, EventTarget } from "../dom/interfaces";
/**
 * Flattens the given options argument.
 *
 * @param options - options argument
 */
export declare function eventTarget_flatten(options: EventListenerOptions | boolean): boolean;
/**
 * Flattens the given options argument.
 *
 * @param options - options argument
 */
export declare function eventTarget_flattenMore(options: AddEventListenerOptions | boolean): [boolean, boolean, boolean];
/**
 * Adds a new event listener.
 *
 * @param eventTarget - event target
 * @param listener - event listener
 */
export declare function eventTarget_addEventListener(eventTarget: EventTarget, listener: EventListenerEntry): void;
/**
 * Removes an event listener.
 *
 * @param eventTarget - event target
 * @param listener - event listener
 */
export declare function eventTarget_removeEventListener(eventTarget: EventTarget, listener: EventListenerEntry, index: number): void;
/**
 * Removes all event listeners.
 *
 * @param eventTarget - event target
 */
export declare function eventTarget_removeAllEventListeners(eventTarget: EventTarget): void;

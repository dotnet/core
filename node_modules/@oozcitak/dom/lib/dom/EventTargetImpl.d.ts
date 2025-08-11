import { Event, EventListener, EventTarget, AddEventListenerOptions, EventListenerOptions, EventListenerEntry, EventHandlerEntry } from "./interfaces";
/**
 * Represents a target to which an event can be dispatched.
 */
export declare abstract class EventTargetImpl implements EventTarget {
    private __eventListenerList?;
    get _eventListenerList(): EventListenerEntry[];
    private __eventHandlerMap?;
    get _eventHandlerMap(): {
        [key: string]: EventHandlerEntry;
    };
    /**
     * Initializes a new instance of `EventTarget`.
     */
    constructor();
    /** @inheritdoc */
    addEventListener(type: string, callback: EventListener | null | ((event: Event) => void), options?: AddEventListenerOptions | boolean): void;
    /** @inheritdoc */
    removeEventListener(type: string, callback: EventListener | null | ((event: Event) => void), options?: EventListenerOptions | boolean): void;
    /** @inheritdoc */
    dispatchEvent(event: Event): boolean;
    /** @inheritdoc */
    _getTheParent(event: Event): EventTarget | null;
    /** @inheritdoc */
    _activationBehavior?(event: Event): void;
    /** @inheritdoc */
    _legacyPreActivationBehavior?(event: Event): void;
    /** @inheritdoc */
    _legacyCanceledActivationBehavior?(event: Event): void;
}

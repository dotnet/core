import { PotentialEventTarget, EventPathItem, EventListenerEntry, EventHandler, Event, EventTarget } from "../dom/interfaces";
import { EventImpl } from "../dom/EventImpl";
/**
 * Defines a boolean out variable of a function.
 */
export declare type OutputFlag = {
    value: boolean;
};
/**
 * Sets the canceled flag of an event.
 *
 * @param event - an event
 */
export declare function event_setTheCanceledFlag(event: Event): void;
/**
 * Initializes the value of an event.
 *
 * @param event - an event to initialize
 * @param type - the type of event
 * @param bubbles - whether the event propagates in reverse
 * @param cancelable - whether the event can be cancelled
 */
export declare function event_initialize(event: Event, type: string, bubbles: boolean, cancelable: boolean): void;
/**
 * Creates a new event.
 *
 * @param eventInterface - event interface
 * @param realm - realm
 */
export declare function event_createAnEvent(eventInterface: typeof EventImpl, realm?: any | undefined): Event;
/**
 * Performs event creation steps.
 *
 * @param eventInterface - event interface
 * @param realm - realm
 * @param time - time of occurrance
 * @param dictionary - event attributes
 *
 */
export declare function event_innerEventCreationSteps(eventInterface: typeof EventImpl, realm: any, time: Date, dictionary: {
    [key: string]: any;
}): Event;
/**
 * Dispatches an event to an event target.
 *
 * @param event - the event to dispatch
 * @param target - event target
 * @param legacyTargetOverrideFlag - legacy target override flag
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */
export declare function event_dispatch(event: Event, target: EventTarget, legacyTargetOverrideFlag?: boolean, legacyOutputDidListenersThrowFlag?: OutputFlag): boolean;
/**
 * Appends a new struct to an event's path.
 *
 * @param event - an event
 * @param invocationTarget - the target of the invocation
 * @param shadowAdjustedTarget - shadow-root adjusted event target
 * @param relatedTarget - related event target
 * @param touchTargets - a list of touch targets
 * @param slotInClosedTree - if the target's parent is a closed shadow root
 */
export declare function event_appendToAnEventPath(event: Event, invocationTarget: EventTarget, shadowAdjustedTarget: PotentialEventTarget, relatedTarget: PotentialEventTarget, touchTargets: PotentialEventTarget[], slotInClosedTree: boolean): void;
/**
 * Invokes an event.
 *
 * @param struct - a struct defining event's path
 * @param event - the event to invoke
 * @param phase - event phase
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */
export declare function event_invoke(struct: EventPathItem, event: Event, phase: "capturing" | "bubbling", legacyOutputDidListenersThrowFlag?: OutputFlag): void;
/**
 * Invokes an event.
 *
 * @param event - the event to invoke
 * @param listeners - event listeners
 * @param phase - event phase
 * @param struct - a struct defining event's path
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */
export declare function event_innerInvoke(event: Event, listeners: EventListenerEntry[], phase: "capturing" | "bubbling", struct: EventPathItem, legacyOutputDidListenersThrowFlag?: OutputFlag): boolean;
/**
 * Fires an event at target.
 * @param e - event name
 * @param target - event target
 * @param eventConstructor - an event constructor, with a description of how
 * IDL attributes are to be initialized
 * @param idlAttributes - a dictionary describing how IDL attributes are
 * to be initialized
 * @param legacyTargetOverrideFlag - legacy target override flag
 */
export declare function event_fireAnEvent(e: string, target: EventTarget, eventConstructor?: typeof EventImpl, idlAttributes?: {
    [key: string]: any;
}, legacyTargetOverrideFlag?: boolean): boolean;
/**
 * Creates an event.
 *
 * @param eventInterface - the name of the event interface
 */
export declare function event_createLegacyEvent(eventInterface: string): Event;
/**
 * Getter of an event handler IDL attribute.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
export declare function event_getterEventHandlerIDLAttribute(thisObj: EventTarget, name: string): EventHandler;
/**
 * Setter of an event handler IDL attribute.
 *
 * @param eventTarget - event target
 * @param name - event name
 * @param value - event handler
 */
export declare function event_setterEventHandlerIDLAttribute(thisObj: EventTarget, name: string, value: EventHandler): void;
/**
 * Determines the target of an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
export declare function event_determineTheTargetOfAnEventHandler(eventTarget: EventTarget, name: string): EventTarget | null;
/**
 * Gets the current value of an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
export declare function event_getTheCurrentValueOfAnEventHandler(eventTarget: EventTarget, name: string): EventHandler;
/**
 * Activates an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
export declare function event_activateAnEventHandler(eventTarget: EventTarget, name: string): void;
/**
 * Deactivates an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
export declare function event_deactivateAnEventHandler(eventTarget: EventTarget, name: string): void;

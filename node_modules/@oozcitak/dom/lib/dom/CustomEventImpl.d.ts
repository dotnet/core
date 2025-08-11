import { CustomEventInit, CustomEvent } from "./interfaces";
import { EventImpl } from "./EventImpl";
/**
 * Represents and event that carries custom data.
 */
export declare class CustomEventImpl extends EventImpl implements CustomEvent {
    protected _detail: any;
    /**
     * Initializes a new instance of `CustomEvent`.
     */
    constructor(type: string, eventInit?: CustomEventInit);
    /** @inheritdoc */
    get detail(): any;
    /** @inheritdoc */
    initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, detail?: any): void;
}

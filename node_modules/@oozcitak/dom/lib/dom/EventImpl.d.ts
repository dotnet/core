import { EventInit, EventTarget, EventPhase, PotentialEventTarget, EventPathItem, Event } from "./interfaces";
/**
 * Represents a DOM event.
 */
export declare class EventImpl implements Event {
    static NONE: number;
    static CAPTURING_PHASE: number;
    static AT_TARGET: number;
    static BUBBLING_PHASE: number;
    NONE: number;
    CAPTURING_PHASE: number;
    AT_TARGET: number;
    BUBBLING_PHASE: number;
    _target: PotentialEventTarget;
    _relatedTarget: PotentialEventTarget;
    _touchTargetList: PotentialEventTarget[];
    _path: EventPathItem[];
    _currentTarget: PotentialEventTarget;
    _eventPhase: EventPhase;
    _stopPropagationFlag: boolean;
    _stopImmediatePropagationFlag: boolean;
    _canceledFlag: boolean;
    _inPassiveListenerFlag: boolean;
    _composedFlag: boolean;
    _initializedFlag: boolean;
    _dispatchFlag: boolean;
    _isTrusted: boolean;
    _type: string;
    _bubbles: boolean;
    _cancelable: boolean;
    _timeStamp: number;
    /**
     * Initializes a new instance of `Event`.
     */
    constructor(type: string, eventInit?: EventInit);
    /** @inheritdoc */
    get type(): string;
    /** @inheritdoc */
    get target(): EventTarget | null;
    /** @inheritdoc */
    get srcElement(): EventTarget | null;
    /** @inheritdoc */
    get currentTarget(): EventTarget | null;
    /** @inheritdoc */
    composedPath(): EventTarget[];
    /** @inheritdoc */
    get eventPhase(): EventPhase;
    /** @inheritdoc */
    stopPropagation(): void;
    /** @inheritdoc */
    get cancelBubble(): boolean;
    set cancelBubble(value: boolean);
    /** @inheritdoc */
    stopImmediatePropagation(): void;
    /** @inheritdoc */
    get bubbles(): boolean;
    /** @inheritdoc */
    get cancelable(): boolean;
    /** @inheritdoc */
    get returnValue(): boolean;
    set returnValue(value: boolean);
    /** @inheritdoc */
    preventDefault(): void;
    /** @inheritdoc */
    get defaultPrevented(): boolean;
    /** @inheritdoc */
    get composed(): boolean;
    /** @inheritdoc */
    get isTrusted(): boolean;
    /** @inheritdoc */
    get timeStamp(): number;
    /** @inheritdoc */
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
}

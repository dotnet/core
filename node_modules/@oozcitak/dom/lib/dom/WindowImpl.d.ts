import { Event, Slot, MutationObserver, Document, Window, NodeIterator } from "./interfaces";
import { EventTargetImpl } from "./EventTargetImpl";
import { FixedSizeSet } from "@oozcitak/util";
/**
 * Represents a window containing a DOM document.
 */
export declare class WindowImpl extends EventTargetImpl implements Window {
    _currentEvent?: Event;
    _signalSlots: Set<Slot>;
    _mutationObserverMicrotaskQueued: boolean;
    _mutationObservers: Set<MutationObserver>;
    _associatedDocument: Document;
    _iteratorList: FixedSizeSet<NodeIterator>;
    /**
     * Initializes a new instance of `Window`.
     */
    protected constructor();
    /** @inheritdoc */
    get document(): Document;
    /** @inheritdoc */
    get event(): Event | undefined;
    /**
     * Creates a new window with a blank document.
     */
    static _create(): WindowImpl;
}

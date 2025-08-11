import { Element, ShadowRootMode, Event, EventTarget, ShadowRoot, Document } from "./interfaces";
import { DocumentFragmentImpl } from "./DocumentFragmentImpl";
/**
 * Represents a shadow root.
 */
export declare class ShadowRootImpl extends DocumentFragmentImpl implements ShadowRoot {
    _host: Element;
    _mode: ShadowRootMode;
    /**
     * Initializes a new instance of `ShadowRoot`.
     *
     * @param host - shadow root's host element
     * @param mode - shadow root's mode
     */
    private constructor();
    /** @inheritdoc */
    get mode(): ShadowRootMode;
    /** @inheritdoc */
    get host(): Element;
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    _getTheParent(event: Event): EventTarget | null;
    /**
     * Creates a new `ShadowRoot`.
     *
     * @param document - owner document
     * @param host - shadow root's host element
     */
    static _create(document: Document, host: Element): ShadowRootImpl;
}

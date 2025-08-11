import { Node, MutationObserverInit, MutationRecord, MutationCallback, MutationObserver } from "./interfaces";
/**
 * Represents an object that can be used to observe mutations to the tree of
 * nodes.
 */
export declare class MutationObserverImpl implements MutationObserver {
    _callback: MutationCallback;
    _nodeList: Node[];
    _recordQueue: MutationRecord[];
    /**
     * Initializes a new instance of `MutationObserver`.
     *
     * @param callback - the callback function
     */
    constructor(callback: MutationCallback);
    /** @inheritdoc */
    observe(target: Node, options?: MutationObserverInit): void;
    /** @inheritdoc */
    disconnect(): void;
    /** @inheritdoc */
    takeRecords(): MutationRecord[];
}

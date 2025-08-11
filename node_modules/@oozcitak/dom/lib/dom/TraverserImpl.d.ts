import { Node, NodeFilter, WhatToShow, Traverser } from "./interfaces";
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export declare abstract class TraverserImpl implements Traverser {
    _activeFlag: boolean;
    _root: Node;
    _whatToShow: WhatToShow;
    _filter: NodeFilter | null;
    /**
     * Initializes a new instance of `Traverser`.
     *
     * @param root - root node
     */
    protected constructor(root: Node);
    /** @inheritdoc */
    get root(): Node;
    /** @inheritdoc */
    get whatToShow(): WhatToShow;
    /** @inheritdoc */
    get filter(): NodeFilter | null;
}

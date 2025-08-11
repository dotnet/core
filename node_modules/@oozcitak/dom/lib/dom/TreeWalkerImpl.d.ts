import { Node, TreeWalker } from "./interfaces";
import { TraverserImpl } from "./TraverserImpl";
/**
 * Represents the nodes of a subtree and a position within them.
 */
export declare class TreeWalkerImpl extends TraverserImpl implements TreeWalker {
    _current: Node;
    /**
     * Initializes a new instance of `TreeWalker`.
     */
    private constructor();
    /** @inheritdoc */
    get currentNode(): Node;
    set currentNode(value: Node);
    /** @inheritdoc */
    parentNode(): Node | null;
    /** @inheritdoc */
    firstChild(): Node | null;
    /** @inheritdoc */
    lastChild(): Node | null;
    /** @inheritdoc */
    nextSibling(): Node | null;
    /** @inheritdoc */
    previousNode(): Node | null;
    /** @inheritdoc */
    previousSibling(): Node | null;
    /** @inheritdoc */
    nextNode(): Node | null;
    /**
     * Creates a new `TreeWalker`.
     *
     * @param root - iterator's root node
     * @param current - current node
     */
    static _create(root: Node, current: Node): TreeWalkerImpl;
}

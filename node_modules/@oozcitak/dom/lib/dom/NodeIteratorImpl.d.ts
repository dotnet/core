import { Node, NodeIterator, Collection } from "./interfaces";
import { TraverserImpl } from "./TraverserImpl";
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export declare class NodeIteratorImpl extends TraverserImpl implements NodeIterator {
    _iteratorCollection: Collection;
    _reference: Node;
    _pointerBeforeReference: boolean;
    /**
     * Initializes a new instance of `NodeIterator`.
     */
    private constructor();
    /** @inheritdoc */
    get referenceNode(): Node;
    /** @inheritdoc */
    get pointerBeforeReferenceNode(): boolean;
    /** @inheritdoc */
    nextNode(): Node | null;
    /** @inheritdoc */
    previousNode(): Node | null;
    /** @inheritdoc */
    detach(): void;
    /**
     * Creates a new `NodeIterator`.
     *
     * @param root - iterator's root node
     * @param reference - reference node
     * @param pointerBeforeReference - whether the iterator is before or after the
     * reference node
     */
    static _create(root: Node, reference: Node, pointerBeforeReference: boolean): NodeIteratorImpl;
}

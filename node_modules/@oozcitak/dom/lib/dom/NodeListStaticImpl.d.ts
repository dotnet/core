import { Node, NodeList } from "./interfaces";
/**
 * Represents an ordered list of nodes.
 * This is a static implementation of `NodeList`.
 */
export declare class NodeListStaticImpl implements NodeList {
    _live: boolean;
    _root: Node;
    _filter: ((element: Node) => any);
    _items: Node[];
    _length: number;
    /**
     * Initializes a new instance of `NodeList`.
     *
     * @param root - root node
     */
    private constructor();
    /** @inheritdoc */
    get length(): number;
    /** @inheritdoc */
    item(index: number): Node | null;
    /** @inheritdoc */
    [index: number]: Node | undefined;
    /** @inheritdoc */
    keys(): Iterable<number>;
    /** @inheritdoc */
    values(): Iterable<Node>;
    /** @inheritdoc */
    entries(): Iterable<[number, Node]>;
    /** @inheritdoc */
    [Symbol.iterator](): Iterator<Node>;
    /** @inheritdoc */
    forEach(callback: (node: Node, index: number, list: NodeList) => any, thisArg?: any): void;
    /**
     * Implements a proxy get trap to provide array-like access.
     */
    get(target: NodeListStaticImpl, key: PropertyKey, receiver: any): Node | undefined;
    /**
     * Implements a proxy set trap to provide array-like access.
     */
    set(target: NodeListStaticImpl, key: PropertyKey, value: Node, receiver: any): boolean;
    /**
     * Creates a new `NodeList`.
     *
     * @param root - root node
     * @param items - a list of items to initialize the list
     */
    static _create(root: Node, items: Node[]): NodeListStaticImpl;
}

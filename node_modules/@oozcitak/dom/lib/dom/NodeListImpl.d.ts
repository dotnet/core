import { Node, NodeList } from "./interfaces";
/**
 * Represents an ordered set of nodes.
 */
export declare class NodeListImpl implements NodeList {
    _live: boolean;
    _root: Node;
    _filter: ((node: Node) => any) | null;
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
    forEach(callback: ((node: Node, index: number, list: NodeList) => any), thisArg?: any): void;
    /**
     * Implements a proxy get trap to provide array-like access.
     */
    get(target: NodeList, key: PropertyKey, receiver: any): Node | undefined;
    /**
     * Implements a proxy set trap to provide array-like access.
     */
    set(target: NodeList, key: PropertyKey, value: Node, receiver: any): boolean;
    /**
     * Creates a new `NodeList`.
     *
     * @param root - root node
     */
    static _create(root: Node): NodeListImpl;
}

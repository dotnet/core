import { Node, Element, HTMLCollection } from "./interfaces";
/**
 * Represents a collection of elements.
 */
export declare class HTMLCollectionImpl implements HTMLCollection {
    _live: boolean;
    _root: Node;
    _filter: ((element: Element) => boolean);
    protected static reservedNames: string[];
    /**
     * Initializes a new instance of `HTMLCollection`.
     *
     * @param root - root node
     * @param filter - node filter
     */
    private constructor();
    /** @inheritdoc */
    get length(): number;
    /** @inheritdoc */
    item(index: number): Element | null;
    /** @inheritdoc */
    namedItem(key: string): Element | null;
    /** @inheritdoc */
    [Symbol.iterator](): Iterator<Element>;
    /** @inheritdoc */
    [index: number]: Element | undefined;
    /** @inheritdoc */
    [key: string]: any;
    /**
     * Implements a proxy get trap to provide array-like access.
     */
    get(target: HTMLCollection, key: PropertyKey, receiver: any): Element | null | undefined;
    /**
     * Implements a proxy set trap to provide array-like access.
     */
    set(target: HTMLCollection, key: PropertyKey, value: Element, receiver: any): boolean;
    /**
     * Creates a new `HTMLCollection`.
     *
     * @param root - root node
     * @param filter - node filter
     */
    static _create(root: Node, filter?: ((element: Element) => boolean)): HTMLCollectionImpl;
}

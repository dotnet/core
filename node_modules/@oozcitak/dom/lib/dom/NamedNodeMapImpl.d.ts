import { Element, Attr, NamedNodeMap } from "./interfaces";
/**
 * Represents a collection of attributes.
 */
export declare class NamedNodeMapImpl extends Array<Attr> implements NamedNodeMap {
    _element: Element;
    /**
     * Initializes a new instance of `NamedNodeMap`.
     *
     * @param element - parent element
     */
    private constructor();
    _asArray(): Array<Attr>;
    /** @inheritdoc */
    item(index: number): Attr | null;
    /** @inheritdoc */
    getNamedItem(qualifiedName: string): Attr | null;
    /** @inheritdoc */
    getNamedItemNS(namespace: string | null, localName: string): Attr | null;
    /** @inheritdoc */
    setNamedItem(attr: Attr): Attr | null;
    /** @inheritdoc */
    setNamedItemNS(attr: Attr): Attr | null;
    /** @inheritdoc */
    removeNamedItem(qualifiedName: string): Attr;
    /** @inheritdoc */
    removeNamedItemNS(namespace: string | null, localName: string): Attr;
    /**
     * Creates a new `NamedNodeMap`.
     *
     * @param element - parent element
     */
    static _create(element: Element): NamedNodeMapImpl;
}

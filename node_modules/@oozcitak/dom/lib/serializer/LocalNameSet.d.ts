/**
 * Represents a set of unique attribute namespaceURI and localName pairs.
 * This set will contain tuples of unique attribute namespaceURI and
 * localName pairs, and is populated as each attr is processed. This set is
 * used to [optionally] enforce the well-formed constraint that an element
 * cannot have two attributes with the same namespaceURI and localName.
 * This can occur when two otherwise identical attributes on the same
 * element differ only by their prefix values.
 */
export declare class LocalNameSet {
    private _items;
    private _nullItems;
    /**
     * Adds or replaces a tuple.
     *
     * @param ns - namespace URI
     * @param localName - attribute local name
     */
    set(ns: string | null, localName: string): void;
    /**
     * Determines if the given tuple exists in the set.
     *
     * @param ns - namespace URI
     * @param localName - attribute local name
     */
    has(ns: string | null, localName: string): boolean;
}

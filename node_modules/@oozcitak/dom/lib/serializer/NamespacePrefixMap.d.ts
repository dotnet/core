/**
 * A namespace prefix map is a map that associates namespaceURI and namespace
 * prefix lists, where namespaceURI values are the map's unique keys (which can
 * include the null value representing no namespace), and ordered lists of
 * associated prefix values are the map's key values. The namespace prefix map
 * will be populated by previously seen namespaceURIs and all their previously
 * encountered prefix associations for a given node and its ancestors.
 *
 * _Note:_ The last seen prefix for a given namespaceURI is at the end of its
 * respective list. The list is searched to find potentially matching prefixes,
 * and if no matches are found for the given namespaceURI, then the last prefix
 * in the list is used. See copy a namespace prefix map and retrieve a preferred
 * prefix string for additional details.
 *
 * See: https://w3c.github.io/DOM-Parsing/#the-namespace-prefix-map
 */
export declare class NamespacePrefixMap {
    private _items;
    private _nullItems;
    /**
     * Creates a copy of the map.
     */
    copy(): NamespacePrefixMap;
    /**
     * Retrieves a preferred prefix string from the namespace prefix map.
     *
     * @param preferredPrefix - preferred prefix string
     * @param ns - namespace
     */
    get(preferredPrefix: string | null, ns: string | null): string | null;
    /**
     * Checks if a prefix string is found in the namespace prefix map associated
     * with the given namespace.
     *
     * @param prefix - prefix string
     * @param ns - namespace
     */
    has(prefix: string, ns: string | null): boolean;
    /**
     * Checks if a prefix string is found in the namespace prefix map.
     *
     * @param prefix - prefix string
     */
    hasPrefix(prefix: string): boolean;
    /**
     * Adds a prefix string associated with a namespace to the prefix map.
     *
     * @param prefix - prefix string
     * @param ns - namespace
     */
    set(prefix: string, ns: string | null): void;
}

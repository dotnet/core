/**
 * Validates the given qualified name.
 *
 * @param qualifiedName - qualified name
 */
export declare function namespace_validate(qualifiedName: string): void;
/**
 * Validates and extracts a namespace, prefix and localName from the
 * given namespace and qualified name.
 * See: https://dom.spec.whatwg.org/#validate-and-extract.
 *
 * @param namespace - namespace
 * @param qualifiedName - qualified name
 *
 * @returns a tuple with `namespace`, `prefix` and `localName`.
 */
export declare function namespace_validateAndExtract(namespace: string | null, qualifiedName: string): [string | null, string | null, string];
/**
 * Extracts a prefix and localName from the given qualified name.
 *
 * @param qualifiedName - qualified name
 *
 * @returns an tuple with `prefix` and `localName`.
 */
export declare function namespace_extractQName(qualifiedName: string): [string | null, string];

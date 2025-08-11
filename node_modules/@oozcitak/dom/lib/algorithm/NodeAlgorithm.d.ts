import { Element, Node, Document, HTMLCollection } from "../dom/interfaces";
/**
 * Replaces the contents of the given node with a single text node.
 *
 * @param string - node contents
 * @param parent - a node
 */
export declare function node_stringReplaceAll(str: string, parent: Node): void;
/**
 * Clones a node.
 *
 * @param node - a node to clone
 * @param document - the document to own the cloned node
 * @param cloneChildrenFlag - whether to clone node's children
 */
export declare function node_clone(node: Node, document?: Document | null, cloneChildrenFlag?: boolean): Node;
/**
 * Determines if two nodes can be considered equal.
 *
 * @param a - node to compare
 * @param b - node to compare
 */
export declare function node_equals(a: Node, b: Node): boolean;
/**
 * Returns a collection of elements with the given qualified name which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbytagname
 *
 * @param qualifiedName - qualified name
 * @param root - root node
 */
export declare function node_listOfElementsWithQualifiedName(qualifiedName: string, root: Node): HTMLCollection;
/**
 * Returns a collection of elements with the given namespace which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
 *
 * @param namespace - element namespace
 * @param localName - local name
 * @param root - root node
 */
export declare function node_listOfElementsWithNamespace(namespace: string | null, localName: string, root: Node): HTMLCollection;
/**
 * Returns a collection of elements with the given class names which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbyclassname
 *
 * @param namespace - element namespace
 * @param localName - local name
 * @param root - root node
 */
export declare function node_listOfElementsWithClassNames(classNames: string, root: Node): HTMLCollection;
/**
 * Searches for a namespace prefix associated with the given namespace
 * starting from the given element through its ancestors.
 *
 * @param element - an element node to start searching at
 * @param namespace - namespace to search for
 */
export declare function node_locateANamespacePrefix(element: Element, namespace: string | null): string | null;
/**
 * Searches for a namespace associated with the given namespace prefix
 * starting from the given node through its ancestors.
 *
 * @param node - a node to start searching at
 * @param prefix - namespace prefix to search for
 */
export declare function node_locateANamespace(node: Node, prefix: string | null): string | null;

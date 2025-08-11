import { Node } from "../dom/interfaces";
/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */
export declare function mutation_ensurePreInsertionValidity(node: Node, parent: Node, child: Node | null): void;
/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child, then adopts the node to the tree and inserts it.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */
export declare function mutation_preInsert(node: Node, parent: Node, child: Node | null): Node;
/**
 * Inserts a node into a parent node before the given child node.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 * @param suppressObservers - whether to notify observers
 */
export declare function mutation_insert(node: Node, parent: Node, child: Node | null, suppressObservers?: boolean): void;
/**
 * Appends a node to the children of a parent node.
 *
 * @param node - a node
 * @param parent - the parent to receive node
 */
export declare function mutation_append(node: Node, parent: Node): Node;
/**
 * Replaces a node with another node.
 *
 * @param child - child node to remove
 * @param node - node to insert
 * @param parent - parent node to receive node
 */
export declare function mutation_replace(child: Node, node: Node, parent: Node): Node;
/**
 * Replaces all nodes of a parent with the given node.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 */
export declare function mutation_replaceAll(node: Node | null, parent: Node): void;
/**
 * Ensures pre-removal validity of a child node from a parent, then
 * removes it.
 *
 * @param child - child node to remove
 * @param parent - parent node
 */
export declare function mutation_preRemove(child: Node, parent: Node): Node;
/**
 * Removes a child node from its parent.
 *
 * @param node - node to remove
 * @param parent - parent node
 * @param suppressObservers - whether to notify observers
 */
export declare function mutation_remove(node: Node, parent: Node, suppressObservers?: boolean): void;

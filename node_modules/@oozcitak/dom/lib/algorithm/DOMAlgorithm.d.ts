import { Node, Element, NodeIterator, Document, Event } from "../dom/interfaces";
/**
 * Runs removing steps for node.
 *
 * @param removedNode - removed node
 * @param oldParent - old parent node
 */
export declare function dom_runRemovingSteps(removedNode: Node, oldParent: Node): void;
/**
 * Runs cloning steps for node.
 *
 * @param copy - node clone
 * @param node - node
 * @param document - document to own the cloned node
 * @param cloneChildrenFlag - whether child nodes are cloned
 */
export declare function dom_runCloningSteps(copy: Node, node: Node, document: Document, cloneChildrenFlag: boolean): void;
/**
 * Runs adopting steps for node.
 *
 * @param node - node
 * @param oldDocument - old document
 */
export declare function dom_runAdoptingSteps(node: Node, oldDocument: Document): void;
/**
 * Runs attribute change steps for an element node.
 *
 * @param element - element node owning the attribute
 * @param localName - attribute's local name
 * @param oldValue - attribute's old value
 * @param value - attribute's new value
 * @param namespace - attribute's namespace
 */
export declare function dom_runAttributeChangeSteps(element: Element, localName: string, oldValue: string | null, value: string | null, namespace: string | null): void;
/**
 * Runs insertion steps for a node.
 *
 * @param insertedNode - inserted node
 */
export declare function dom_runInsertionSteps(insertedNode: Node): void;
/**
 * Runs pre-removing steps for a node iterator and node.
 *
 * @param nodeIterator - a node iterator
 * @param toBeRemoved - node to be removed
 */
export declare function dom_runNodeIteratorPreRemovingSteps(nodeIterator: NodeIterator, toBeRemoved: Node): void;
/**
 * Determines if there are any supported tokens defined for the given
 * attribute name.
 *
 * @param attributeName - an attribute name
 */
export declare function dom_hasSupportedTokens(attributeName: string): boolean;
/**
 * Returns the set of supported tokens defined for the given attribute name.
 *
 * @param attributeName - an attribute name
 */
export declare function dom_getSupportedTokens(attributeName: string): Set<string>;
/**
 * Runs event construction steps.
 *
 * @param event - an event
 */
export declare function dom_runEventConstructingSteps(event: Event): void;
/**
 * Runs child text content change steps for a parent node.
 *
 * @param parent - parent node with text node child nodes
 */
export declare function dom_runChildTextContentChangeSteps(parent: Node): void;

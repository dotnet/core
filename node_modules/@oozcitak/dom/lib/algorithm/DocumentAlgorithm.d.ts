import { Element, Document, Node } from "../dom/interfaces";
/**
 * Returns an element interface for the given name and namespace.
 *
 * @param name - element name
 * @param namespace - namespace
 */
export declare function document_elementInterface(name: string, namespace: string | null): (new (...args: any[]) => Element);
/**
 * Creates a new element node.
 * See: https://dom.spec.whatwg.org/#internal-createelementns-steps
 *
 * @param document - owner document
 * @param namespace - element namespace
 * @param qualifiedName - qualified name
 * @param options - element options
 */
export declare function document_internalCreateElementNS(document: Document, namespace: string | null, qualifiedName: string, options?: string | {
    is: string;
}): Element;
/**
 * Removes `node` and its subtree from its document and changes
 * its owner document to `document` so that it can be inserted
 * into `document`.
 *
 * @param node - the node to move
 * @param document - document to receive the node and its subtree
 */
export declare function document_adopt(node: Node, document: Document): void;

import { Node, Document } from "../dom/interfaces";
/**
 * Converts the given nodes or strings into a node (if `nodes` has
 * only one element) or a document fragment.
 *
 * @param nodes - the array of nodes or strings,
 * @param document - owner document
 */
export declare function parentNode_convertNodesIntoANode(nodes: (Node | string)[], document: Document): Node;

import { Element, Node } from "../dom/interfaces";
/**
 * Matches elements with the given selectors.
 *
 * @param selectors - selectors
 * @param node - the node to match against
 */
export declare function selectors_scopeMatchASelectorsString(selectors: string, node: Node): Element[];

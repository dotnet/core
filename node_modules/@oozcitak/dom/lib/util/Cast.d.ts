import { Node } from "../dom/interfaces";
/**
 * Contains type casts for DOM objects.
 */
export declare class Cast {
    /**
     * Casts the given object to a `Node`.
     *
     * @param a - the object to cast
     */
    static asNode(a: any): Node;
}

import { NodeType, Comment, Document } from "./interfaces";
import { CharacterDataImpl } from "./CharacterDataImpl";
/**
 * Represents a comment node.
 */
export declare class CommentImpl extends CharacterDataImpl implements Comment {
    _nodeType: NodeType;
    /**
     * Initializes a new instance of `Comment`.
     *
     * @param data - the text content
     */
    constructor(data?: string);
    /**
     * Creates a new `Comment`.
     *
     * @param document - owner document
     * @param data - node contents
     */
    static _create(document: Document, data?: string): CommentImpl;
}

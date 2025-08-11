import { NodeType, ProcessingInstruction, Document } from "./interfaces";
import { CharacterDataImpl } from "./CharacterDataImpl";
/**
 * Represents a processing instruction node.
 */
export declare class ProcessingInstructionImpl extends CharacterDataImpl implements ProcessingInstruction {
    _nodeType: NodeType;
    _target: string;
    /**
     * Initializes a new instance of `ProcessingInstruction`.
     */
    private constructor();
    /**
     * Gets the target of the {@link ProcessingInstruction} node.
     */
    get target(): string;
    /**
     * Creates a new `ProcessingInstruction`.
     *
     * @param document - owner document
     * @param target - instruction target
     * @param data - node contents
     */
    static _create(document: Document, target: string, data: string): ProcessingInstructionImpl;
}

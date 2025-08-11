import { Node, Range, HowToCompare, DocumentFragment, BoundaryPoint } from "./interfaces";
import { AbstractRangeImpl } from "./AbstractRangeImpl";
/**
 * Represents a live range.
 */
export declare class RangeImpl extends AbstractRangeImpl implements Range {
    static START_TO_START: number;
    static START_TO_END: number;
    static END_TO_END: number;
    static END_TO_START: number;
    START_TO_START: number;
    START_TO_END: number;
    END_TO_END: number;
    END_TO_START: number;
    _start: BoundaryPoint;
    _end: BoundaryPoint;
    /**
     * Initializes a new instance of `Range`.
     */
    constructor();
    /** @inheritdoc */
    get commonAncestorContainer(): Node;
    /** @inheritdoc */
    setStart(node: Node, offset: number): void;
    /** @inheritdoc */
    setEnd(node: Node, offset: number): void;
    /** @inheritdoc */
    setStartBefore(node: Node): void;
    /** @inheritdoc */
    setStartAfter(node: Node): void;
    /** @inheritdoc */
    setEndBefore(node: Node): void;
    /** @inheritdoc */
    setEndAfter(node: Node): void;
    /** @inheritdoc */
    collapse(toStart?: boolean | undefined): void;
    /** @inheritdoc */
    selectNode(node: Node): void;
    /** @inheritdoc */
    selectNodeContents(node: Node): void;
    /** @inheritdoc */
    compareBoundaryPoints(how: HowToCompare, sourceRange: Range): number;
    /** @inheritdoc */
    deleteContents(): void;
    /** @inheritdoc */
    extractContents(): DocumentFragment;
    /** @inheritdoc */
    cloneContents(): DocumentFragment;
    /** @inheritdoc */
    insertNode(node: Node): void;
    /** @inheritdoc */
    surroundContents(newParent: Node): void;
    /** @inheritdoc */
    cloneRange(): Range;
    /** @inheritdoc */
    detach(): void;
    /** @inheritdoc */
    isPointInRange(node: Node, offset: number): boolean;
    /** @inheritdoc */
    comparePoint(node: Node, offset: number): number;
    /** @inheritdoc */
    intersectsNode(node: Node): boolean;
    toString(): string;
    /**
     * Creates a new `Range`.
     *
     * @param start - start point
     * @param end - end point
     */
    static _create(start?: BoundaryPoint, end?: BoundaryPoint): RangeImpl;
}

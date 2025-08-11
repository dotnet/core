import { Node, BoundaryPoint, AbstractRange } from "./interfaces";
/**
 * Represents an abstract range with a start and end boundary point.
 */
export declare abstract class AbstractRangeImpl implements AbstractRange {
    abstract _start: BoundaryPoint;
    abstract _end: BoundaryPoint;
    get _startNode(): Node;
    get _startOffset(): number;
    get _endNode(): Node;
    get _endOffset(): number;
    get _collapsed(): boolean;
    /** @inheritdoc */
    get startContainer(): Node;
    /** @inheritdoc */
    get startOffset(): number;
    /** @inheritdoc */
    get endContainer(): Node;
    /** @inheritdoc */
    get endOffset(): number;
    /** @inheritdoc */
    get collapsed(): boolean;
}

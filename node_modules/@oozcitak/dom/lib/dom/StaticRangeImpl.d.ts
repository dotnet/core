import { AbstractRangeImpl } from "./AbstractRangeImpl";
import { BoundaryPoint, StaticRangeInit, StaticRange } from "./interfaces";
/**
 * Represents a static range.
 */
export declare class StaticRangeImpl extends AbstractRangeImpl implements StaticRange {
    _start: BoundaryPoint;
    _end: BoundaryPoint;
    /**
     * Initializes a new instance of `StaticRange`.
     */
    constructor(init: StaticRangeInit);
}

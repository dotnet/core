import { DOMFeatures, Window, Node, Range } from "./interfaces";
import { CompareCache, FixedSizeSet } from "@oozcitak/util";
/**
 * Represents an object implementing DOM algorithms.
 */
declare class DOMImpl {
    private static _instance;
    private _features;
    private _window;
    private _compareCache;
    private _rangeList;
    /**
     * Initializes a new instance of `DOM`.
     */
    private constructor();
    /**
     * Sets DOM algorithm features.
     *
     * @param features - DOM features supported by algorithms. All features are
     * enabled by default unless explicity disabled.
     */
    setFeatures(features?: Partial<DOMFeatures> | boolean): void;
    /**
     * Gets DOM algorithm features.
     */
    get features(): DOMFeatures;
    /**
     * Gets the DOM window.
     */
    get window(): Window;
    /**
     * Gets the global node compare cache.
     */
    get compareCache(): CompareCache<Node>;
    /**
     * Gets the global range list.
     */
    get rangeList(): FixedSizeSet<Range>;
    /**
     * Returns the instance of `DOM`.
     */
    static get instance(): DOMImpl;
}
/**
 * Represents an object implementing DOM algorithms.
 */
export declare const dom: DOMImpl;
export {};

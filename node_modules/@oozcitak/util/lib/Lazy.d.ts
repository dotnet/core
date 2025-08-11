/**
 * Represents an object with lazy initialization.
 */
export declare class Lazy<T> {
    private _initialized;
    private _initFunc;
    private _value;
    /**
     * Initializes a new instance of `Lazy`.
     *
     * @param initFunc - initializer function
     */
    constructor(initFunc: () => T);
    /**
     * Gets the value of the object.
     */
    get value(): T;
}

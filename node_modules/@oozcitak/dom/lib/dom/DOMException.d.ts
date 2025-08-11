/**
 * Represents the base class of `Error` objects used by this module.
 */
export declare class DOMException extends Error {
    /**
     * Returns the name of the error message.
     */
    readonly name: string;
    /**
     *
     * @param name - message name
     * @param message - error message
     */
    constructor(name: string, message?: string);
}
export declare class DOMStringSizeError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class WrongDocumentError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class NoDataAllowedError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class NoModificationAllowedError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class NotSupportedError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class InUseAttributeError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class InvalidStateError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class InvalidModificationError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class NamespaceError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class InvalidAccessError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class ValidationError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class TypeMismatchError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class SecurityError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class NetworkError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class AbortError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class URLMismatchError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class QuotaExceededError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class TimeoutError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class InvalidNodeTypeError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class DataCloneError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class NotImplementedError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message?: string);
}
export declare class HierarchyRequestError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message?: string);
}
export declare class NotFoundError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message?: string);
}
export declare class IndexSizeError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message?: string);
}
export declare class SyntaxError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message?: string);
}
export declare class InvalidCharacterError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message?: string);
}

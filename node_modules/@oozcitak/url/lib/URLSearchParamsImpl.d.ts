import { URLSearchParams, URL } from "./interfaces";
/**
 * Represents URL query parameters.
 */
export declare class URLSearchParamsImpl implements URLSearchParams {
    _list: [string, string][];
    _urlObject: URL | null;
    /**
     * Initializes a new `URLSearchParams`.
     *
     * @param init - initial values of query parameters
     */
    constructor(init?: string[][] | {
        [key: string]: string;
    } | string);
    /**
     * Runs the update steps.
     */
    _updateSteps(): void;
    /** @inheritdoc */
    append(name: string, value: string): void;
    /** @inheritdoc */
    delete(name: string): void;
    /** @inheritdoc */
    get(name: string): string | null;
    /** @inheritdoc */
    getAll(name: string): string[];
    /** @inheritdoc */
    has(name: string): boolean;
    /** @inheritdoc */
    set(name: string, value: string): void;
    /** @inheritdoc */
    sort(): void;
    /** @inheritdoc */
    [Symbol.iterator](): IterableIterator<[string, string]>;
    /** @inheritdoc */
    toString(): string;
}

import { URL, URLRecord, URLSearchParams } from "./interfaces";
/**
 * Represents an URL.
 */
export declare class URLImpl implements URL {
    _url: URLRecord;
    _queryObject: URLSearchParams;
    /**
     * Initializes a new `URL`.
     *
     * @param url - an URL string
     * @param base - a base URL string
     */
    constructor(url: string, baseURL?: string);
    /** @inheritdoc */
    get href(): string;
    set href(value: string);
    /** @inheritdoc */
    get origin(): string;
    /** @inheritdoc */
    get protocol(): string;
    set protocol(val: string);
    /** @inheritdoc */
    get username(): string;
    set username(val: string);
    /** @inheritdoc */
    get password(): string;
    set password(val: string);
    /** @inheritdoc */
    get host(): string;
    set host(val: string);
    /** @inheritdoc */
    get hostname(): string;
    set hostname(val: string);
    /** @inheritdoc */
    get port(): string;
    set port(val: string);
    /** @inheritdoc */
    get pathname(): string;
    set pathname(val: string);
    /** @inheritdoc */
    get search(): string;
    set search(val: string);
    /** @inheritdoc */
    get searchParams(): URLSearchParams;
    /** @inheritdoc */
    get hash(): string;
    set hash(val: string);
    /** @inheritdoc */
    toJSON(): string;
    /** @inheritdoc */
    toString(): string;
}

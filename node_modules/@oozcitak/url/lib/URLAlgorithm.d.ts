import { URLRecord, ParserState, Host, Origin } from "./interfaces";
/**
 * Sets the callback function for validation errors.
 *
 * @param validationErrorCallback - a callback function to be called when a
 * validation error occurs
 */
export declare function setValidationErrorCallback(validationErrorCallback?: ((message: string) => void)): void;
/**
 * Creates a new URL.
 */
export declare function newURL(): URLRecord;
/**
 * Determines if the scheme is a special scheme.
 *
 * @param scheme - a scheme
 */
export declare function isSpecialScheme(scheme: string): boolean;
/**
 * Determines if the URL has a special scheme.
 *
 * @param url - an URL
 */
export declare function isSpecial(url: URLRecord): boolean;
/**
 * Returns the default port for a special scheme.
 *
 * @param scheme - a scheme
 */
export declare function defaultPort(scheme: string): number | null;
/**
 * Determines if the URL has credentials.
 *
 * @param url - an URL
 */
export declare function includesCredentials(url: URLRecord): boolean;
/**
 * Determines if an URL cannot have credentials.
 *
 * @param url - an URL
 */
export declare function cannotHaveAUsernamePasswordPort(url: URLRecord): boolean;
/**
 * Serializes an URL into a string.
 *
 * @param url - an URL
 */
export declare function urlSerializer(url: URLRecord, excludeFragmentFlag?: boolean): string;
/**
 * Serializes a host into a string.
 *
 * @param host - a host
 */
export declare function hostSerializer(host: Host): string;
/**
 * Serializes an IPv4 address into a string.
 *
 * @param address  - an IPv4 address
 */
export declare function iPv4Serializer(address: number): string;
/**
 * Serializes an IPv6 address into a string.
 *
 * @param address  - an IPv6 address represented as a list of eight numbers
 */
export declare function iPv6Serializer(address: number[]): string;
/**
 * Parses an URL string.
 *
 * @param input - input string
 * @param baseURL - base URL
 * @param encodingOverride - encoding override
 */
export declare function urlParser(input: string, baseURL?: URLRecord, encodingOverride?: string): URLRecord | null;
/**
 * Parses an URL string.
 *
 * @param input - input string
 * @param baseURL - base URL
 * @param encodingOverride - encoding override
 */
export declare function basicURLParser(input: string, baseURL?: URLRecord | null, encodingOverride?: string, url?: URLRecord, stateOverride?: ParserState): URLRecord | null;
/**
 * Sets a URL's username.
 *
 * @param url - a URL
 * @param username - username string
 */
export declare function setTheUsername(url: URLRecord, username: string): void;
/**
 * Sets a URL's password.
 *
 * @param url - a URL
 * @param username - password string
 */
export declare function setThePassword(url: URLRecord, password: string): void;
/**
 * Determines if the string represents a single dot path.
 *
 * @param str - a string
 */
export declare function isSingleDotPathSegment(str: string): boolean;
/**
 * Determines if the string represents a double dot path.
 *
 * @param str - a string
 */
export declare function isDoubleDotPathSegment(str: string): boolean;
/**
 * Shorten's URL's path.
 *
 * @param url - an URL
 */
export declare function shorten(url: URLRecord): void;
/**
 * Determines if a string is a normalized Windows drive letter.
 *
 * @param str - a string
 */
export declare function isNormalizedWindowsDriveLetter(str: string): boolean;
/**
 * Determines if a string is a Windows drive letter.
 *
 * @param str - a string
 */
export declare function isWindowsDriveLetter(str: string): boolean;
/**
 * Determines if a string starts with a Windows drive letter.
 *
 * @param str - a string
 */
export declare function startsWithAWindowsDriveLetter(str: string): boolean;
/**
 * Parses a host string.
 *
 * @param input - input string
 * @param isNotSpecial - `true` if the source URL is not special; otherwise
 * `false`.
 */
export declare function hostParser(input: string, isNotSpecial?: boolean): string | number | number[] | null;
/**
 * Parses a string containing an IP v4 address.
 *
 * @param input - input string
 * @param isNotSpecial - `true` if the source URL is not special; otherwise
 * `false`.
 */
export declare function iPv4NumberParser(input: string, validationErrorFlag?: {
    value: boolean;
}): number | null;
/**
 * Parses a string containing an IP v4 address.
 *
 * @param input - input string
 */
export declare function iPv4Parser(input: string): string | number | null;
/**
 * Parses a string containing an IP v6 address.
 *
 * @param input - input string
 */
export declare function iPv6Parser(input: string): number[] | null;
/**
 * Parses an opaque host string.
 *
 * @param input - a string
 */
export declare function opaqueHostParser(input: string): string | null;
/**
 * Resolves a Blob URL from the user agent's Blob URL store.
 * function is not implemented.
 * See: https://w3c.github.io/FileAPI/#blob-url-resolve
 *
 * @param url - an url
 */
export declare function resolveABlobURL(url: URLRecord): any;
/**
 * Percent encodes a byte.
 *
 * @param value - a byte
 */
export declare function percentEncode(value: number): string;
/**
 * Percent decodes a byte sequence input.
 *
 * @param input - a byte sequence
 */
export declare function percentDecode(input: Uint8Array): Uint8Array;
/**
 * String percent decodes a string.
 *
 * @param input - a string
 */
export declare function stringPercentDecode(input: string): Uint8Array;
/**
 * UTF-8 percent encodes a code point, using a percent encode set.
 *
 * @param codePoint - a code point
 * @param percentEncodeSet - a percent encode set
 */
export declare function utf8PercentEncode(codePoint: string, percentEncodeSet: RegExp): string;
/**
 * Determines if two hosts are considered equal.
 *
 * @param hostA - a host
 * @param hostB - a host
 */
export declare function hostEquals(hostA: Host, hostB: Host): boolean;
/**
 * Determines if two URLs are considered equal.
 *
 * @param urlA - a URL
 * @param urlB - a URL
 * @param excludeFragmentsFlag - whether to ignore fragments while comparing
 */
export declare function urlEquals(urlA: URLRecord, urlB: URLRecord, excludeFragmentsFlag?: boolean): boolean;
/**
 * Parses an `application/x-www-form-urlencoded` string.
 *
 * @param input - a string
 */
export declare function urlEncodedStringParser(input: string): [string, string][];
/**
 * Parses `application/x-www-form-urlencoded` bytes.
 *
 * @param input - a byte sequence
 */
export declare function urlEncodedParser(input: Uint8Array): [string, string][];
/**
 * Serializes `application/x-www-form-urlencoded` bytes.
 *
 * @param input - a byte sequence
 */
export declare function urlEncodedByteSerializer(input: Uint8Array): string;
/**
 * Serializes `application/x-www-form-urlencoded` tuples.
 *
 * @param input - input tuple of name/value pairs
 * @param encodingOverride: encoding override
 */
export declare function urlEncodedSerializer(tuples: [string, string][], encodingOverride?: string): string;
/**
 * Returns a URL's origin.
 *
 * @param url - a URL
 */
export declare function origin(url: URLRecord): Origin;
/**
 * Converts a domain string to ASCII.
 *
 * @param domain - a domain string
 */
export declare function domainToASCII(domain: string, beStrict?: boolean): string | null;
/**
 * Converts a domain string to Unicode.
 *
 * @param domain - a domain string
 */
export declare function domainToUnicode(domain: string, beStrict?: boolean): string;
/**
 * Serializes an origin.
 * function is from the HTML spec:
 * https://html.spec.whatwg.org/#ascii-serialisation-of-an-origin
 *
 * @param origin - an origin
 */
export declare function asciiSerializationOfAnOrigin(origin: Origin): string;

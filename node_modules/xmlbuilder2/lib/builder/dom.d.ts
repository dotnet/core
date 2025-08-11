import { Document } from "@oozcitak/dom/lib/dom/interfaces";
/**
 * Creates an XML document without any child nodes.
 */
export declare function createDocument(): Document;
export declare function sanitizeInput(str: string, replacement?: string | ((char: string, offset: number, str: string) => string)): string;
export declare function sanitizeInput(str: string | null, replacement?: string | ((char: string, offset: number, str: string) => string)): string | null;
export declare function sanitizeInput(str: string | null | undefined, replacement?: string | ((char: string, offset: number, str: string) => string)): string | null | undefined;

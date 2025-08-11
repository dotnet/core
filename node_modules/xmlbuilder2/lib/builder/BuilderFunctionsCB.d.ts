import { XMLBuilderCB, XMLBuilderCBCreateOptions } from '../interfaces';
/**
 * Creates an XML builder which serializes the document in chunks.
 *
 * @param options - callback builder options
 *
 * @returns callback builder
 */
export declare function createCB(options?: XMLBuilderCBCreateOptions): XMLBuilderCB;
/**
 * Creates an XML builder which serializes the fragment in chunks.
 *
 * @param options - callback builder options
 *
 * @returns callback builder
 */
export declare function fragmentCB(options?: XMLBuilderCBCreateOptions): XMLBuilderCB;

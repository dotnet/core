import dns from 'dns';
import util from 'util';
import validator from 'validator';
import ms from 'ms';
import { setTimeout } from 'timers/promises';

// Convert the callback-based dns.resolveMx function into a promise-based one
const resolveMx = util.promisify(dns.resolveMx);

/**
 * Validates an email address against the RFC 5322 standard.
 * 
 * @param {string} email - The email address to validate.
 * @return {boolean} - True if the email address is valid, false otherwise.
 */
const validateRfc5322 = (email) => {
  return typeof email === 'string' && validator.isEmail(email);
};

/**
 * Checks if the domain of an email address has MX (Mail Exchange) records.
 * 
 * @param {string} email - The email address whose MX records are to be checked.
 * @return {Promise<boolean>} - Promise that resolves to true if MX records
 *  exist, false otherwise.
 */
const checkMxRecords = async (email) => {
  const domain = email.split('@')[1];

  try {
    // Delay for testing purposes
    if (process.env.NODE_ENV === 'test') {
      await setTimeout(10); // Simulate a delay in DNS lookup
    }

    const records = await resolveMx(domain);
    return records && records.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * A sophisticated email validator that checks both the format of the email
 * address and the existence of MX records for the domain, depending on the
 * options provided.
 * 
 * @param {string} email - The email address to validate.
 * @param {object} [opts={}] - An object containing options for the validator.
 * @param {boolean} [opts.checkMx=true] - Determines whether to check for MX 
 *  records.
 * @param {string|number} [opts.timeout='10s'] - The time in ms module format,
 *  such as '2000ms' or '10s', after which the MX validation will be aborted.
 *  The default timeout is 10 seconds.
 * @return {Promise<boolean>} - Promise that resolves to true if the email is 
 *  valid, false otherwise.
 */
const emailValidator = async (email, opts = {}) => {
  // Handle the case where opts is a boolean for backward compatibility
  if (typeof opts === 'boolean') {
    opts = { checkMx: opts };
  }

  // Set default values for opts if not provided
  const { checkMx = true, timeout = '10s' } = opts;

  // Convert timeout to milliseconds
  const timeoutMs = typeof timeout === 'string' ? ms(timeout) : timeout;

  // Validate the email format
  if (!validateRfc5322(email)) return false;

  // Check MX records if required
  if (checkMx) {
    const timeoutController = new AbortController();
    const timeoutPromise = setTimeout(timeoutMs, undefined, { signal: timeoutController.signal })
      .then(() => {
        throw new Error('Domain MX lookup timed out');
      });

    const lookupMx = checkMxRecords(email).then((hasMxRecords) => {
      timeoutController.abort();
      return hasMxRecords;
    });

    const hasMxRecords = await Promise.race([lookupMx, timeoutPromise]);
    if (!hasMxRecords) return false;
  }

  return true;
};

export default emailValidator;

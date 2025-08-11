import emailValidator from '../src/index.js';

describe('Email Validator', () => {
  describe('with MX record check', () => {
    test('should validate correct email format and MX record exists', async () => {
      expect(await emailValidator('test@example.com')).toBe(true);
    });

    test('should reject email from domain without MX records', async () => {
      expect(await emailValidator('test@adafwefewsd.com')).toBe(false);
    });

    test('should timeout MX record check with string timeout', async () => {
      await expect(emailValidator('test@example.com', { timeout: '1ms' })).rejects.toThrow(/timed out/);
    });

    test('should timeout MX record check with number timeout', async () => {
      await expect(emailValidator('test@example.com', { timeout: 1 })).rejects.toThrow(/timed out/);
    });

    test('should reject non-string inputs', async () => {
      expect(await emailValidator(undefined)).toBe(false);
      expect(await emailValidator(null)).toBe(false);
      expect(await emailValidator(1234)).toBe(false);
      expect(await emailValidator({})).toBe(false);
    });

    test('should reject email with invalid domain format', async () => {
      expect(await emailValidator('test@invalid-domain')).toBe(false);
    });

    test('should reject email with special characters in domain', async () => {
      expect(await emailValidator('test@exam$ple.com')).toBe(false);
    });

    test('should reject email with spaces', async () => {
      expect(await emailValidator('test @example.com')).toBe(false);
    });

    test('should reject email with double dots in domain', async () => {
      expect(await emailValidator('test@exa..mple.com')).toBe(false);
    });

    test('should validate email with numeric local part', async () => {
      expect(await emailValidator('12345@example.com')).toBe(true);
    });

    test('should validate email with hyphen in domain', async () => {
      expect(await emailValidator('test@exam-ple.com')).toBe(true);
    });

    test('should reject email with underscore in domain', async () => {
      expect(await emailValidator('test@exam_ple.com')).toBe(false);
    });
  });

  describe('without MX record check', () => {
    test('should validate correct email format regardless of MX records', async () => {
      expect(await emailValidator('test@example.com', false)).toBe(true);
    });

    test('should reject incorrect email format regardless of MX records', async () => {
      expect(await emailValidator('invalid-email', false)).toBe(false);
    });

    test('should validate email from domain without MX records', async () => {
      expect(await emailValidator('test@adafwefewsd.com', false)).toBe(true);
    });

    test('should reject non-string inputs', async () => {
      expect(await emailValidator(undefined, false)).toBe(false);
      expect(await emailValidator(null, false)).toBe(false);
      expect(await emailValidator(1234, false)).toBe(false);
      expect(await emailValidator({}, false)).toBe(false);
    });

    test('should reject email with spaces', async () => {
      expect(await emailValidator('test @example.com', false)).toBe(false);
    });

    test('should reject email with double dots in domain', async () => {
      expect(await emailValidator('test@exa..mple.com', false)).toBe(false);
    });

    test('should validate email with numeric local part', async () => {
      expect(await emailValidator('12345@example.com', false)).toBe(true);
    });

    test('should validate email with hyphen in domain', async () => {
      expect(await emailValidator('test@exam-ple.com', false)).toBe(true);
    });

    test('should reject email with underscore in domain', async () => {
      expect(await emailValidator('test@exam_ple.com', false)).toBe(false);
    });
  });

  describe('backward compatibility', () => {
    test('should validate correct email format and MX record exists with boolean opts', async () => {
      expect(await emailValidator('test@example.com', true)).toBe(true);
    });

    test('should validate correct email format without MX record check with boolean opts', async () => {
      expect(await emailValidator('test@example.com', false)).toBe(true);
    });
  });

  describe('options parameter', () => {
    test('should validate correct email format with checkMx set to true', async () => {
      expect(await emailValidator('test@example.com', { checkMx: true })).toBe(true);
    });

    test('should validate correct email format with checkMx set to false', async () => {
      expect(await emailValidator('test@example.com', { checkMx: false })).toBe(true);
    });

    test('should timeout with custom timeout setting as string', async () => {
      await expect(emailValidator('test@example.com', { timeout: '1ms' })).rejects.toThrow(/timed out/);
    });

    test('should timeout with custom timeout setting as number', async () => {
      await expect(emailValidator('test@example.com', { timeout: 1 })).rejects.toThrow(/timed out/);
    });

    test('should validate correct email format with custom timeout setting as string', async () => {
      expect(await emailValidator('test@example.com', { timeout: '5s' })).toBe(true);
    });

    test('should validate correct email format with custom timeout setting as number', async () => {
      expect(await emailValidator('test@example.com', { timeout: 5000 })).toBe(true);
    });

    test('should validate correct email format and MX record exists with both options set', async () => {
      expect(await emailValidator('test@example.com', { checkMx: true, timeout: '5s' })).toBe(true);
    });

    test('should validate correct email format without MX record check and custom timeout', async () => {
      expect(await emailValidator('test@example.com', { checkMx: false, timeout: '5s' })).toBe(true);
    });
  });
});

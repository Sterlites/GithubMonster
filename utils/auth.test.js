import {
  generateApiKey,
  hashApiKey,
  isValidApiKeyFormat,
  verifyApiKey,
  createApiKey,
  revokeApiKey
} from './auth';

describe('Authentication Utilities', () => {
  describe('generateApiKey', () => {
    it('should generate a 64-character hex string', () => {
      const apiKey = generateApiKey();
      expect(apiKey).toHaveLength(64);
      expect(/^[a-f0-9]{64}$/.test(apiKey)).toBe(true);
    });

    it('should generate unique keys', () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('hashApiKey', () => {
    it('should hash an API key consistently', () => {
      const apiKey = 'test_key_1234567890123456789012345678901234567890123456789012';
      const hash1 = hashApiKey(apiKey);
      const hash2 = hashApiKey(apiKey);
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different keys', () => {
      const key1 = 'test_key_1111111111111111111111111111111111111111111111111111';
      const key2 = 'test_key_2222222222222222222222222222222222222222222222222222';
      const hash1 = hashApiKey(key1);
      const hash2 = hashApiKey(key2);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isValidApiKeyFormat', () => {
    it('should validate correct API key format', () => {
      const validKey = 'a'.repeat(64);
      expect(isValidApiKeyFormat(validKey)).toBe(true);
    });

    it('should reject keys that are too short', () => {
      const shortKey = 'a'.repeat(32);
      expect(isValidApiKeyFormat(shortKey)).toBe(false);
    });

    it('should reject keys that are too long', () => {
      const longKey = 'a'.repeat(128);
      expect(isValidApiKeyFormat(longKey)).toBe(false);
    });

    it('should reject keys with invalid characters', () => {
      const invalidKey = 'g'.repeat(64); // 'g' is not a valid hex character
      expect(isValidApiKeyFormat(invalidKey)).toBe(false);
    });

    it('should reject non-string values', () => {
      expect(isValidApiKeyFormat(null)).toBe(false);
      expect(isValidApiKeyFormat(undefined)).toBe(false);
      expect(isValidApiKeyFormat(123)).toBe(false);
    });
  });

  describe('createApiKey', () => {
    it('should create a new API key with metadata', () => {
      const result = createApiKey('Test Key', 'free');
      
      expect(result.apiKey).toBeDefined();
      expect(result.name).toBe('Test Key');
      expect(result.tier).toBe('free');
      expect(result.createdAt).toBeDefined();
      expect(result.rateLimit).toBe(60);
    });

    it('should set different rate limits for different tiers', () => {
      const freeKey = createApiKey('Free Key', 'free');
      const proKey = createApiKey('Pro Key', 'pro');
      
      expect(freeKey.rateLimit).toBe(60);
      expect(proKey.rateLimit).toBe(300);
    });

    it('should allow verification of created key', () => {
      const { apiKey } = createApiKey('Verifiable Key', 'free');
      const verified = verifyApiKey(apiKey);
      
      expect(verified).toBeDefined();
      expect(verified.name).toBe('Verifiable Key');
    });
  });

  describe('verifyApiKey', () => {
    it('should return null for invalid format', () => {
      expect(verifyApiKey('invalid')).toBeNull();
    });

    it('should return null for non-existent key', () => {
      const nonExistentKey = 'a'.repeat(64);
      expect(verifyApiKey(nonExistentKey)).toBeNull();
    });

    it('should verify existing keys', () => {
      const { apiKey } = createApiKey('Existing Key', 'pro');
      const verified = verifyApiKey(apiKey);
      
      expect(verified).toBeDefined();
      expect(verified.tier).toBe('pro');
    });
  });

  describe('revokeApiKey', () => {
    it('should revoke an existing key', () => {
      const { apiKey } = createApiKey('Revocable Key', 'free');
      
      // Verify it exists
      expect(verifyApiKey(apiKey)).toBeDefined();
      
      // Revoke it
      const revoked = revokeApiKey(apiKey);
      expect(revoked).toBe(true);
      
      // Verify it no longer exists
      expect(verifyApiKey(apiKey)).toBeNull();
    });

    it('should return false for non-existent key', () => {
      const nonExistentKey = 'a'.repeat(64);
      const revoked = revokeApiKey(nonExistentKey);
      expect(revoked).toBe(false);
    });
  });
});

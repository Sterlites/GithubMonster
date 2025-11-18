import crypto from 'crypto';
import logger from './logger';

/**
 * Authentication and authorization utilities
 */

/**
 * Generate a new API key
 */
export function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash an API key for storage
 */
export function hashApiKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(apiKey) {
  return typeof apiKey === 'string' && /^[a-f0-9]{64}$/.test(apiKey);
}

/**
 * Simple in-memory API key store (replace with database in production)
 */
const apiKeys = new Map();

// Add a default API key for testing (remove in production)
if (process.env.NODE_ENV === 'development') {
  const testKey = 'test_key_12345678901234567890123456789012345678901234567890123456';
  apiKeys.set(hashApiKey(testKey), {
    name: 'Test Key',
    createdAt: new Date().toISOString(),
    tier: 'free',
    rateLimit: 60
  });
}

/**
 * Verify an API key
 */
export function verifyApiKey(apiKey) {
  if (!apiKey || !isValidApiKeyFormat(apiKey)) {
    return null;
  }
  
  const hashedKey = hashApiKey(apiKey);
  return apiKeys.get(hashedKey) || null;
}

/**
 * Authentication middleware
 * Checks for valid API key or allows public access based on configuration
 */
export function requireAuth(options = {}) {
  const { 
    allowPublic = true, // Allow requests without API key
    requiredTier = null // Require specific tier (e.g., 'pro', 'enterprise')
  } = options;

  return (handler) => {
    return async (req, res) => {
      // Extract API key from header or query parameter
      const apiKey = req.headers['x-api-key'] || 
                     req.headers['authorization']?.replace('Bearer ', '') ||
                     req.query.apiKey;

      // If no API key provided
      if (!apiKey) {
        if (allowPublic) {
          // Allow public access with limited rate limits
          req.auth = { tier: 'public', rateLimit: 10 };
          return handler(req, res);
        } else {
          return res.status(401).json({
            error: 'Authentication required',
            message: 'Please provide a valid API key'
          });
        }
      }

      // Verify API key
      const keyInfo = verifyApiKey(apiKey);
      
      if (!keyInfo) {
        logger.warn('Invalid API key attempt', { 
          ip: req.connection.remoteAddress,
          key: apiKey.substring(0, 8) + '...'
        });
        
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'The provided API key is not valid'
        });
      }

      // Check tier requirement
      if (requiredTier && keyInfo.tier !== requiredTier) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: `This endpoint requires ${requiredTier} tier access`
        });
      }

      // Attach auth info to request
      req.auth = keyInfo;

      // Call the actual handler
      return handler(req, res);
    };
  };
}

/**
 * Create a new API key (admin function)
 */
export function createApiKey(name, tier = 'free') {
  const apiKey = generateApiKey();
  const hashedKey = hashApiKey(apiKey);
  
  const keyInfo = {
    name,
    tier,
    createdAt: new Date().toISOString(),
    rateLimit: tier === 'free' ? 60 : tier === 'pro' ? 300 : 1000
  };
  
  apiKeys.set(hashedKey, keyInfo);
  
  logger.info('API key created', { name, tier });
  
  return {
    apiKey, // Return unhashed key only once
    ...keyInfo
  };
}

/**
 * Revoke an API key
 */
export function revokeApiKey(apiKey) {
  const hashedKey = hashApiKey(apiKey);
  const existed = apiKeys.delete(hashedKey);
  
  if (existed) {
    logger.info('API key revoked', { key: apiKey.substring(0, 8) + '...' });
  }
  
  return existed;
}

/**
 * List all API keys (admin function)
 */
export function listApiKeys() {
  return Array.from(apiKeys.values());
}

export default {
  generateApiKey,
  hashApiKey,
  isValidApiKeyFormat,
  verifyApiKey,
  requireAuth,
  createApiKey,
  revokeApiKey,
  listApiKeys
};

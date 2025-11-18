import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';

// In-memory store for rate limiting (for serverless environments)
const rateLimitStore = new NodeCache({ stdTTL: 60 });

/**
 * Rate limiting middleware factory
 * Creates a rate limiter with specified options
 */
export function createRateLimiter(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    max = 60, // 60 requests per window
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (handler) => {
    return async (req, res) => {
      // Get client identifier (IP or API key)
      const identifier = getClientIdentifier(req);
      
      // Get current request count
      const key = `ratelimit:${identifier}`;
      const current = rateLimitStore.get(key) || { count: 0, resetTime: Date.now() + windowMs };
      
      // Check if window has expired
      if (Date.now() > current.resetTime) {
        current.count = 0;
        current.resetTime = Date.now() + windowMs;
      }
      
      // Check if limit exceeded
      if (current.count >= max) {
        const retryAfter = Math.ceil((current.resetTime - Date.now()) / 1000);
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', current.resetTime);
        res.setHeader('Retry-After', retryAfter);
        
        return res.status(429).json({
          error: message,
          retryAfter: retryAfter
        });
      }
      
      // Increment counter
      current.count++;
      rateLimitStore.set(key, current, Math.ceil(windowMs / 1000));
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - current.count);
      res.setHeader('X-RateLimit-Reset', current.resetTime);
      
      // Call the actual handler
      return handler(req, res);
    };
  };
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(req) {
  // Check for API key first
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (apiKey) {
    return `apikey:${apiKey}`;
  }
  
  // Fall back to IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
  return `ip:${ip}`;
}

/**
 * Preset rate limiters for different use cases
 */
export const rateLimiters = {
  // Strict rate limit for expensive operations
  strict: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Rate limit exceeded for this operation'
  }),
  
  // Standard rate limit for normal API calls
  standard: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Too many requests, please slow down'
  }),
  
  // Lenient rate limit for read-only operations
  lenient: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 120, // 120 requests per minute
    message: 'Rate limit exceeded'
  }),
  
  // Very strict for authentication attempts
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later'
  })
};

export default createRateLimiter;

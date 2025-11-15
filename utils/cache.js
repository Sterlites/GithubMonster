// Initialize Redis connection if available, otherwise use in-memory cache
let redis;
let cache;
let useRedis = false;

// Only initialize on the server side (in API routes)
if (typeof window === 'undefined') {
  // For Next.js API routes, we can safely import server-side dependencies
  // This code will not run in client-side rendering
  try {
    // Dynamically require Redis for server-side usage
    const Redis = require('ioredis');

    if (process.env.REDIS_URL) {
      redis = new Redis(process.env.REDIS_URL);
      useRedis = true;
    } else {
      // Simple in-memory cache for development
      const NodeCache = require('node-cache');
      cache = new NodeCache({ stdTTL: 600, checkperiod: 600 });
    }
  } catch (error) {
    // Fallback to in-memory cache if Redis is not available
    const NodeCache = require('node-cache');
    cache = new NodeCache({ stdTTL: 600, checkperiod: 600 });
  }
} else {
  // In browser environment, we should not be using the cache for API routes
  // but having a fallback in case it's somehow accessed
  cache = new Map();
}

// Cache functions
export async function getCached(key, ttl = 3600) {
  // This function is primarily used in API routes, which only run on the server
  if (typeof window === 'undefined') { // Server-side (API routes)
    if (useRedis && redis) {
      try {
        const cached = await redis.get(key);
        if (cached) {
          return JSON.parse(cached);
        }
        return null;
      } catch (error) {
        console.error('Cache get error:', error);
        return null;
      }
    } else if (cache) {
      return cache.get(key);
    }
  } else {
    // Client-side fallback
    if (cache instanceof Map) {
      const cached = cache.get(key);
      if (cached) {
        const { value } = cached;
        // Note: In Next.js API routes, this code path should not execute
        return value;
      }
    }
  }
  return null;
}

export async function setCache(key, value, ttl = 3600) {
  // This function is primarily used in API routes, which only run on the server
  if (typeof window === 'undefined') { // Server-side (API routes)
    if (useRedis && redis) {
      try {
        await redis.setex(key, ttl, JSON.stringify(value));
      } catch (error) {
        console.error('Cache set error:', error);
      }
    } else if (cache) {
      cache.set(key, value);
    }
  } else {
    // Client-side fallback
    if (cache instanceof Map) {
      cache.set(key, {
        value: value,
        timestamp: Date.now()
      });
    }
  }
}

export function generateCacheKey(repo, tool, params) {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});

  return `${repo}:${tool}:${JSON.stringify(sortedParams)}`;
}

// Default export for compatibility
export default { getCached, setCache, generateCacheKey };
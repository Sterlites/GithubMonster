import Redis from 'ioredis';

// Initialize Redis connection if available, otherwise use in-memory cache
let redis;
let useRedis = false;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  useRedis = true;
} else {
  // Simple in-memory cache for development
  const NodeCache = require('node-cache');
  const cache = new NodeCache({ stdTTL: 600, checkperiod: 600 });

  // In-memory cache functions
  export async function getCached(key, ttl = 3600) {
    return cache.get(key);
  }

  export async function setCache(key, value, ttl = 3600) {
    cache.set(key, value, ttl);
  }

  export function generateCacheKey(repo, tool, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});

    return `${repo}:${tool}:${JSON.stringify(sortedParams)}`;
  }
}

// Redis-based cache implementation
if (useRedis) {
  export async function getCached(key, ttl = 3600) {
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
  }

  export async function setCache(key, value, ttl = 3600) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  export function generateCacheKey(repo, tool, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});

    return `${repo}:${tool}:${JSON.stringify(sortedParams)}`;
  }
}

// Default export for compatibility
export default { getCached, setCache, generateCacheKey };
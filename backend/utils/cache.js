import Redis from 'ioredis';

// Initialize Redis connection if available, otherwise use in-memory cache
let redis;
let useRedis = false;
let cache;

// Initialize caching system
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  useRedis = true;
} else {
  // Simple in-memory cache for development
  const NodeCache = require('node-cache');
  cache = new NodeCache({ stdTTL: 600, checkperiod: 600 });
}

// Cache functions
export async function getCached(key, ttl = 3600) {
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
  } else {
    return cache ? cache.get(key) : null;
  }
}

export async function setCache(key, value, ttl = 3600) {
  if (useRedis && redis) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  } else if (cache) {
    cache.set(key, value, ttl);
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
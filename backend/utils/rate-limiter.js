import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// Initialize Redis if available, otherwise use memory store
let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
}

export const apiLimiter = rateLimit({
  store: redis ? new RedisStore({
    client: redis,
    prefix: 'rate-limit:'
  }) : undefined,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Per-tool rate limiting
export const toolLimiter = (toolName, maxRequests = 20) => {
  return rateLimit({
    store: redis ? new RedisStore({
      client: redis,
      prefix: `rate-limit:${toolName}:`
    }) : undefined,
    windowMs: 60 * 60 * 1000,
    max: maxRequests,
    message: `Too many ${toolName} requests, please try again later`
  });
};

// Specific rate limiters for different tools
export const archaeologyLimiter = toolLimiter('archaeology', 10);
export const learningPathLimiter = toolLimiter('learning-path', 15);
export const techDebtLimiter = toolLimiter('tech-debt', 10);
export const blastRadiusLimiter = toolLimiter('blast-radius', 15);
export const healthScoreLimiter = toolLimiter('health-score', 20);
export const contributionEquityLimiter = toolLimiter('contribution-equity', 15);
export const executiveSummaryLimiter = toolLimiter('executive-summary', 10);
export const visualStoryLimiter = toolLimiter('visual-story', 10);
export const patternMatcherLimiter = toolLimiter('pattern-matcher', 5);
export const unusedPotentialLimiter = toolLimiter('unused-potential', 5);
export const complianceLimiter = toolLimiter('compliance', 5);
export const chaosPredictorLimiter = toolLimiter('chaos-predictor', 5);

// Export default for compatibility
export default {
  apiLimiter,
  toolLimiter,
  archaeologyLimiter,
  learningPathLimiter,
  techDebtLimiter,
  blastRadiusLimiter,
  healthScoreLimiter,
  contributionEquityLimiter,
  executiveSummaryLimiter,
  visualStoryLimiter,
  patternMatcherLimiter,
  unusedPotentialLimiter,
  complianceLimiter,
  chaosPredictorLimiter
};
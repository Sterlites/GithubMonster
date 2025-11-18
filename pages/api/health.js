import { octokit } from './github/proxy';
import logger from '../../utils/logger';

/**
 * Health check endpoint
 * Returns the health status of the application and its dependencies
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {},
    version: process.env.npm_package_version || '1.0.0'
  };

  try {
    // Check GitHub API connectivity
    try {
      await octokit.rateLimit.get();
      health.services.github = {
        status: 'healthy',
        message: 'GitHub API is accessible'
      };
    } catch (error) {
      health.status = 'degraded';
      health.services.github = {
        status: 'unhealthy',
        message: error.message
      };
    }

    // Check Gemini API key presence
    if (process.env.GEMINI_API_KEY) {
      health.services.gemini = {
        status: 'configured',
        message: 'Gemini API key is configured'
      };
    } else {
      health.status = 'degraded';
      health.services.gemini = {
        status: 'not_configured',
        message: 'Gemini API key is missing'
      };
    }

    // Check cache availability
    try {
      const { getCached } = await import('../../utils/cache');
      await getCached('health-check-test');
      health.services.cache = {
        status: 'healthy',
        message: 'Cache is accessible'
      };
    } catch (error) {
      health.status = 'degraded';
      health.services.cache = {
        status: 'degraded',
        message: 'Cache may not be available, using fallback'
      };
    }

    // Check environment variables
    const requiredEnvVars = ['GITHUB_TOKEN', 'GEMINI_API_KEY'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      health.status = 'unhealthy';
      health.services.environment = {
        status: 'unhealthy',
        message: `Missing required environment variables: ${missingEnvVars.join(', ')}`
      };
    } else {
      health.services.environment = {
        status: 'healthy',
        message: 'All required environment variables are set'
      };
    }

    // Add response time
    health.responseTime = Date.now() - startTime;

    // Determine HTTP status code based on health status
    const statusCode = health.status === 'healthy' ? 200 : 
                       health.status === 'degraded' ? 200 : 503;

    return res.status(statusCode).json(health);

  } catch (error) {
    logger.error('Health check failed', error);
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: Date.now() - startTime
    });
  }
}

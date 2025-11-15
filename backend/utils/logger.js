import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'repoinsights-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Helper function to sanitize data before logging
function sanitize(data) {
  if (typeof data === 'string') {
    // Remove sensitive information from strings
    return data
      .replace(/(token|key|secret|password|auth)\s*[:=]\s*["']?[^"'\s]+/gi, '$1: [REDACTED]')
      .replace(/ghp_[a-zA-Z0-9]{36}/g, '[GITHUB_TOKEN_REDACTED]')
      .replace(/sk-[a-zA-Z0-9]{48}/g, '[API_KEY_REDACTED]');
  }
  if (typeof data === 'object') {
    const sanitized = { ...data };
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitize(value);
      }
    }
    return sanitized;
  }
  return data;
}

// Log request information
export function logRequest(method, path, body, ip) {
  logger.info('Request received', {
    method,
    path,
    body: sanitize(body),
    ip
  });
}

// Log successful completion
export function logSuccess(message, additionalData = {}) {
  logger.info(message, additionalData);
}

// Log error
export function logError(message, error, additionalData = {}) {
  logger.error(message, {
    ...additionalData,
    error: error.message,
    stack: error.stack
  });
}

// Log tool usage
export function logToolUsage(toolName, repo, duration, additionalData = {}) {
  logger.info('Tool executed', {
    tool: toolName,
    repo,
    duration,
    ...additionalData
  });
}

export default logger;
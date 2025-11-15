export function sanitizeOutput(data) {
  const sensitivePatterns = [
    /ghp_[a-zA-Z0-9]{36}/g,           // GitHub tokens
    /sk-[a-zA-Z0-9]{48}/g,             // OpenAI keys
    /AIza[0-9A-Za-z-_]{35}/g,          // Google API keys
    /(?:password|token|secret|key)\s*[:=]\s*["']?([^"'\s]+)/gi
  ];

  let sanitized = JSON.stringify(data);

  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return JSON.parse(sanitized);
}

export function verifyGitHubToken(token) {
  // Verify token format
  if (!token || (!token.startsWith('ghp_') && !token.startsWith('github_pat_'))) {
    return false;
  }

  return true;
}

// Sanitize user input
export function sanitizeInput(input) {
  if (typeof input === 'string') {
    // Remove potentially harmful characters/sequences
    return input
      .replace(/(\r\n|\n|\r)/gm, '')  // Remove newlines
      .replace(/'/g, '')              // Remove single quotes
      .replace(/"/g, '')              // Remove double quotes
      .replace(/;/g, '')              // Remove semicolons
      .replace(/--/g, '')             // Remove SQL comment starters
      .replace(/\/\*/g, '')           // Remove SQL comment starters
      .replace(/\*\//g, '')           // Remove SQL comment enders
      .trim();
  }
  return input;
}

// Verify repository name format
export function isValidRepoName(repo) {
  // Format should be owner/repo
  const repoPattern = /^[\w-]+\/[\w-]+$/;
  return repoPattern.test(repo);
}

// Verify that a URL is safe (not pointing to internal services)
export function isSafeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    
    // Block localhost and local network addresses
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '::1',
      '0.0.0.0'
    ];
    
    if (blockedHosts.includes(parsedUrl.hostname)) {
      return false;
    }
    
    // Block private IP ranges
    const privateIpPattern = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/;
    if (privateIpPattern.test(parsedUrl.hostname) || privateIpPattern.test(parsedUrl.host)) {
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid URL
    return false;
  }
}

// Export default for compatibility
export default {
  sanitizeOutput,
  verifyGitHubToken,
  sanitizeInput,
  isValidRepoName,
  isSafeUrl
};
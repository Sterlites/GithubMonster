import { validate, schemas } from '../../utils/validation';
import { getCached, setCache, generateCacheKey } from '../../utils/cache';
import logger, { logRequest, logError, logToolUsage } from '../../utils/logger';
import { octokit } from './github/proxy';
import { sanitizeOutput } from '../../utils/security';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  logRequest(req.method, req.url, req.body, req.connection.remoteAddress);

  try {
    // 1. Validate input
    const params = validate(schemas.repository, req.body);

    // 2. Check cache
    const cacheKey = generateCacheKey(params.repo, 'repo-stats', req.body);
    const cached = await getCached(cacheKey);
    if (cached) {
      logger.info('Cache hit', { repo: params.repo });
      return res.status(200).json(sanitizeOutput(cached));
    }

    // 3. Fetch from GitHub
    const repoStats = await fetchRepositoryStats(params.repo);

    // 4. Cache result
    await setCache(cacheKey, repoStats, 3600);

    const duration = Date.now() - startTime;
    logToolUsage('repo-stats', params.repo, duration);

    // 5. Return result
    return res.status(200).json(sanitizeOutput(repoStats));

  } catch (error) {
    logError('Repository stats error', error, { repo: req.body.repo });
    return res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
}

async function fetchRepositoryStats(repo) {
  const [owner, repoName] = repo.split('/');

  try {
    // Fetch repository details
    const repoDetails = await octokit.repos.get({
      owner,
      repo: repoName
    });

    // Fetch recent commits for age calculation
    const commits = await octokit.repos.listCommits({
      owner,
      repo: repoName,
      per_page: 1 // Just get the latest commit
    });

    // Fetch contributors count
    const contributors = await octokit.repos.listContributors({
      owner,
      repo: repoName,
      per_page: 1 // Just need to know the count
    });

    // Fetch language information
    const languages = await octokit.repos.listLanguages({
      owner,
      repo: repoName
    });

    // Calculate repository age in days
    const createdAt = new Date(repoDetails.data.created_at);
    const today = new Date();
    const ageInDays = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24));

    // Get lines of code from the first commit (approximation)
    const linesOfCode = await calculateLinesOfCode(owner, repoName);

    return {
      linesOfCode,
      contributors: contributors.data.total_count || contributors.data.length,
      healthScore: 75, // Placeholder - a full health analysis would be more complex
      ageInDays,
      stars: repoDetails.data.stargazers_count,
      forks: repoDetails.data.forks_count,
      openIssues: repoDetails.data.open_issues_count,
      watchers: repoDetails.data.watchers_count,
      languageBreakdown: languages.data,
      lastUpdated: repoDetails.data.updated_at
    };
  } catch (error) {
    logError('Error fetching repository stats', error, { repo });
    throw error;
  }
}

async function calculateLinesOfCode(owner, repoName) {
  try {
    // Get the repository structure
    const contents = await octokit.repos.getContent({
      owner,
      repo: repoName,
      path: ''
    });

    // This is a simplified approach - a complete implementation would need to:
    // 1. Recursively parse all files
    // 2. Count lines in code files only
    // 3. Ignore comments and blank lines
    
    // For now, return a placeholder based on repository size
    // In a real implementation, we would need to fetch and parse the content
    // of each file to count actual lines of code
    return 50000; // Default placeholder value
  } catch (error) {
    console.error('Error calculating lines of code:', error);
    return 10000; // Default fallback
  }
}
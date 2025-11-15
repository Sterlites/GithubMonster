import { Octokit } from "@octokit/rest";

// Create a single instance of Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { repo, endpoint, params = {} } = req.body;

    // Validate input
    if (!repo || !endpoint) {
      return res.status(400).json({ error: 'Missing required fields: repo and endpoint' });
    }

    // Validate repository format
    if (!/^[\w-]+\/[\w-]+$/.test(repo)) {
      return res.status(400).json({ error: 'Invalid repository format. Expected: owner/repo' });
    }

    const [owner, repoName] = repo.split('/');

    try {
      let result;
      
      // Handle different GitHub API endpoints
      switch (endpoint) {
        case 'commits':
          result = await octokit.repos.listCommits({
            owner,
            repo: repoName,
            ...params
          });
          break;
          
        case 'pulls':
          result = await octokit.pulls.list({
            owner,
            repo: repoName,
            ...params
          });
          break;
          
        case 'issues':
          result = await octokit.issues.listForRepo({
            owner,
            repo: repoName,
            ...params
          });
          break;
          
        case 'pulls-comments':
          result = await octokit.pulls.listComments({
            owner,
            repo: repoName,
            ...params
          });
          break;
          
        case 'reviews':
          result = await octokit.pulls.listReviews({
            owner,
            repo: repoName,
            ...params
          });
          break;
          
        case 'contents':
          result = await octokit.repos.getContent({
            owner,
            repo: repoName,
            ...params
          });
          break;
          
        case 'contributors':
          result = await octokit.repos.listContributors({
            owner,
            repo: repoName,
            ...params
          });
          break;
          
        case 'languages':
          result = await octokit.repos.listLanguages({
            owner,
            repo: repoName
          });
          break;
          
        case 'stats-code-frequency':
          result = await octokit.repos.getCodeFrequencyStats({
            owner,
            repo: repoName
          });
          break;
          
        case 'stats-commit-activity':
          result = await octokit.repos.getCommitActivityStats({
            owner,
            repo: repoName
          });
          break;
          
        case 'stats-participation':
          result = await octokit.repos.getParticipationStats({
            owner,
            repo: repoName
          });
          break;
          
        default:
          return res.status(400).json({ error: `Unsupported endpoint: ${endpoint}` });
      }

      return res.status(200).json({
        data: result.data,
        status: result.status,
        headers: result.headers
      });
    } catch (githubError) {
      console.error('GitHub API error:', githubError);
      
      // Return appropriate error based on GitHub's response
      const statusCode = githubError.status || 500;
      return res.status(statusCode).json({
        error: githubError.message,
        status: statusCode
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to fetch repository information
export async function fetchRepositoryInfo(repo) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  const [owner, repoName] = repo.split('/');
  
  try {
    const result = await octokit.repos.get({
      owner,
      repo: repoName
    });
    
    return result.data;
  } catch (error) {
    console.error('Error fetching repository info:', error);
    throw error;
  }
}
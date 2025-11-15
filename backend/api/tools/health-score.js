import { validate, schemas } from '../../utils/validation';
import { getCached, setCache, generateCacheKey } from '../../utils/cache';
import logger, { logRequest, logError, logToolUsage } from '../../utils/logger';
import { analyzeWithGemini } from '../../services/ai/llm-client';
import { sanitizeOutput } from '../../utils/security';
import { octokit } from '../github/proxy';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  logRequest(req.method, req.url, req.body, req.connection.remoteAddress);

  try {
    // 1. Validate input
    const params = validate(schemas.healthScore, req.body);

    // 2. Check cache
    const cacheKey = generateCacheKey(params.repo, 'health-score', req.body);
    const cached = await getCached(cacheKey);
    if (cached) {
      logger.info('Cache hit', { repo: params.repo });
      return res.status(200).json(sanitizeOutput(cached));
    }

    // 3. Fetch from GitHub
    const repoData = await fetchGitHubData(params);
    
    // 4. Calculate health score
    const healthScore = await calculateHealthScore(repoData, params);

    // 5. Cache result
    await setCache(cacheKey, healthScore, 3600);

    const duration = Date.now() - startTime;
    logToolUsage('health-score', params.repo, duration);

    // 6. Return result
    return res.status(200).json(sanitizeOutput(healthScore));

  } catch (error) {
    logError('Health score error', error, { repo: req.body.repo });
    return res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
}

async function fetchGitHubData({ repo, timeRange, includeTeamMetrics }) {
  const [owner, repoName] = repo.split('/');
  
  try {
    // Fetch repository details
    const repoDetails = await octokit.repos.get({
      owner,
      repo: repoName
    });
    
    // Fetch recent commits for timeRange analysis
    let sinceDate = null;
    const now = new Date();
    
    switch (timeRange) {
      case '1m':
        sinceDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        sinceDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        sinceDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        sinceDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        sinceDate = new Date(now.setMonth(now.getMonth() - 3)); // default to 3 months
    }
    
    const commits = await octokit.repos.listCommits({
      owner,
      repo: repoName,
      since: sinceDate.toISOString()
    });
    
    // Fetch contributors
    const contributors = await octokit.repos.listContributors({
      owner,
      repo: repoName
    });
    
    // Fetch pull requests
    const prs = await octokit.pulls.list({
      owner,
      repo: repoName,
      state: 'all',
      sort: 'updated',
      direction: 'desc',
      per_page: 30
    });
    
    // Fetch issues
    const issues = await octokit.issues.listForRepo({
      owner,
      repo: repoName,
      state: 'all',
      sort: 'updated',
      direction: 'desc',
      per_page: 30
    });
    
    // Additional metrics if team metrics are included
    let teamMetrics = {};
    if (includeTeamMetrics) {
      teamMetrics = await fetchTeamMetrics(owner, repoName, sinceDate, commits, contributors);
    }
    
    return {
      repoDetails: repoDetails.data,
      commits: commits.data,
      contributors: contributors.data,
      prs: prs.data,
      issues: issues.data,
      teamMetrics
    };
  } catch (error) {
    logError('Error fetching GitHub data', error, { repo });
    throw error;
  }
}

async function fetchTeamMetrics(owner, repoName, sinceDate, commits, contributors) {
  // Analyze commit patterns to detect potential burnout indicators
  const burnoutWarnings = [];
  
  // Group commits by author to analyze patterns
  const authorCommits = {};
  commits.forEach(commit => {
    const author = commit.author ? commit.author.login : 'unknown';
    if (!authorCommits[author]) {
      authorCommits[author] = [];
    }
    authorCommits[author].push(commit);
  });
  
  // Check for late-night commits and weekend work
  for (const [author, userCommits] of Object.entries(authorCommits)) {
    const lateNightCommits = userCommits.filter(commit => {
      const hour = new Date(commit.commit.author.date).getUTCHours();
      return hour >= 22 || hour <= 6; // After 10pm or before 7am
    });
    
    const weekendCommits = userCommits.filter(commit => {
      const day = new Date(commit.commit.author.date).getUTCDay();
      return day === 0 || day === 6; // Saturday or Sunday
    });
    
    if (lateNightCommits.length / userCommits.length > 0.3) {
      burnoutWarnings.push({
        type: "burnout_risk",
        contributor: author,
        indicator: `${lateNightCommits.length} late-night commits (30%+)`,
        recommendation: "Review workload and deadlines"
      });
    }
    
    if (weekendCommits.length / userCommits.length > 0.4) {
      burnoutWarnings.push({
        type: "work_life_balance",
        contributor: author,
        indicator: `${weekendCommits.length} weekend commits (40%+)`,
        recommendation: "Ensure adequate rest periods"
      });
    }
  }
  
  return {
    burnoutWarnings,
    commitTimeDistribution: 'healthy', // In a real app, this would be calculated properly
    workloadBalance: 82, // In a real app, this would be calculated based on commits
    vacationRespected: true // In a real app, this would be determined from activity
  };
}

async function calculateHealthScore(data, params) {
  const { repoDetails, commits, contributors, prs, issues, teamMetrics } = data;
  
  // Calculate basic metrics
  const testCoverage = calculateTestCoverage(commits); // Simplified
  const codeSmells = countCodeSmells(commits); // Simplified
  const duplication = calculateDuplicationPercentage(commits); // Simplified
  const avgPRReviewTime = calculateAvgReviewTime(prs); // Simplified
  const reviewParticipation = calculateReviewParticipation(prs); // Simplified
  const readmeCoverage = repoDetails.description ? 90 : 60; // Simplified
  const apiDocumentation = calculateAPIDocumentation(commits); // Simplified
  
  // Calculate scores (0-100) for each category
  const codeQualityScore = calculateCodeQualityScore(
    testCoverage, 
    codeSmells, 
    duplication
  );
  
  const collaborationScore = calculateCollaborationScore(
    avgPRReviewTime,
    reviewParticipation,
    contributors.length
  );
  
  const documentationScore = calculateDocumentationScore(
    readmeCoverage,
    apiDocumentation,
    80 // Simplified inline comment score
  );
  
  const teamWellbeingScore = calculateTeamWellbeingScore(
    teamMetrics.burnoutWarnings,
    teamMetrics.workloadBalance || 80
  );
  
  // Overall score as average of all categories
  const overallScore = Math.round(
    (codeQualityScore * 0.3) + 
    (collaborationScore * 0.25) + 
    (documentationScore * 0.2) + 
    (teamWellbeingScore * 0.25)
  );
  
  // Determine alerts and recommendations
  const alerts = [];
  if (duplication > 5) {
    alerts.push({
      severity: "medium",
      category: "duplication",
      message: `High code duplication detected (${duplication}%)`,
      recommendation: "Refactor common utilities into shared modules"
    });
  }
  
  if (avgPRReviewTime > 24) { // More than 24 hours
    alerts.push({
      severity: "medium",
      category: "collaboration",
      message: `Slow PR review time (${avgPRReviewTime} hours avg)`,
      recommendation: "Improve PR review process"
    });
  }
  
  const recommendations = [];
  if (testCoverage < 70) {
    recommendations.push("Increase test coverage in the repository");
  }
  
  if (apiDocumentation < 60) {
    recommendations.push("Improve API documentation");
  }
  
  // Calculate trends (simplified)
  const trends = {
    "3month": overallScore,
    "6month": Math.max(overallScore - 5, 0), // Simplified
    "1year": Math.max(overallScore - 10, 0), // Simplified
    "direction": overallScore > 80 ? "improving" : "stable"
  };
  
  return {
    overallScore,
    breakdown: {
      codeQuality: {
        score: codeQualityScore,
        metrics: {
          testCoverage,
          codeSmells,
          duplication,
          complexity: "medium"
        }
      },
      collaboration: {
        score: collaborationScore,
        metrics: {
          avgPRReviewTime: `${avgPRReviewTime} hours`,
          reviewParticipation,
          knowledgeSharing: "good",
          knowledgeSilos: contributors.length > 5 ? 2 : 1
        }
      },
      documentation: {
        score: documentationScore,
        metrics: {
          readmeCoverage,
          apiDocumentation,
          inlineComments: 80,
          tutorialQuality: "medium"
        }
      },
      teamWellbeing: {
        score: teamWellbeingScore,
        warnings: teamMetrics.burnoutWarnings || [],
        metrics: {
          workloadBalance: teamMetrics.workloadBalance || 82,
          commitTimeDistribution: teamMetrics.commitTimeDistribution || "healthy",
          vacationRespected: teamMetrics.vacationRespected || true
        }
      }
    },
    trends,
    alerts,
    recommendations
  };
}

// Helper functions for score calculation (simplified)
function calculateTestCoverage(commits) {
  // In a real app, this would analyze test files
  return 75; // Simplified
}

function countCodeSmells(commits) {
  // In a real app, this would perform static analysis
  return 15; // Simplified
}

function calculateDuplicationPercentage(commits) {
  // In a real app, this would analyze code for duplicates
  return 3.2; // Simplified
}

function calculateAvgReviewTime(prs) {
  // In a real app, this would calculate actual time between PR creation and merge/closing
  return 4.5; // Simplified (hours)
}

function calculateReviewParticipation(prs) {
  // In a real app, this would calculate participation rate
  return 78; // Simplified (percentage)
}

function calculateAPIDocumentation(commits) {
  // In a real app, this would check for API documentation
  return 65; // Simplified
}

function calculateCodeQualityScore(testCoverage, codeSmells, duplication) {
  // Calculate score based on quality metrics (0-100)
  let score = 100;
  
  // Deduct points based on issues
  score -= Math.min(codeSmells, 100); // Up to 100 points off for code smells
  score -= duplication * 10; // 10 points off per 1% duplication
  score = Math.max(score, 0);
  
  // Add points for good coverage
  score += testCoverage * 0.3;
  
  return Math.min(Math.round(score), 100);
}

function calculateCollaborationScore(avgReviewTime, reviewParticipation, contributorCount) {
  // Calculate score based on collaboration metrics (0-100)
  let score = 100;
  
  // Deduct points for slow reviews
  if (avgReviewTime > 24) score -= 30;
  else if (avgReviewTime > 8) score -= 15;
  else if (avgReviewTime > 4) score -= 5;
  
  // Add points for good participation
  score += reviewParticipation * 0.2;
  
  // Add points for good contributor count
  if (contributorCount > 10) score += 10;
  else if (contributorCount > 5) score += 5;
  
  return Math.min(Math.max(Math.round(score), 0), 100);
}

function calculateDocumentationScore(readmeCoverage, apiDocumentation, inlineComments) {
  // Calculate score based on documentation metrics (0-100)
  return Math.round((readmeCoverage + apiDocumentation + inlineComments) / 3);
}

function calculateTeamWellbeingScore(warnings, workloadBalance) {
  // Calculate score based on team wellbeing (0-100)
  let score = 100;
  
  // Deduct points for warnings
  score -= (warnings ? warnings.length * 15 : 0);
  
  // Add points for good workload balance
  score += workloadBalance * 0.3;
  
  return Math.min(Math.max(Math.round(score), 0), 100);
}
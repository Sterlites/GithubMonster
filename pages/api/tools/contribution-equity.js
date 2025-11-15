import { validate, schemas } from '../../../utils/validation';
import { getCached, setCache, generateCacheKey } from '../../../utils/cache';
import logger, { logRequest, logError, logToolUsage } from '../../../utils/logger';
import { analyzeWithGemini } from '../../../services/ai/llm-client';
import { sanitizeOutput } from '../../../utils/security';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  logRequest(req.method, req.url, req.body, req.connection.remoteAddress);

  try {
    // 1. Validate input
    const params = validate(schemas.contributionEquity, req.body);

    // 2. Check cache
    const cacheKey = generateCacheKey(params.repo, 'contribution-equity', req.body);
    const cached = await getCached(cacheKey);
    if (cached) {
      logger.info('Cache hit', { repo: params.repo });
      return res.status(200).json(sanitizeOutput(cached));
    }

    // 3. Analyze contributions
    const contributionData = await analyzeContributions(params);

    // 4. Calculate values
    const contributionValues = await calculateContributionValues(contributionData);

    // 5. Detect gaming
    const gamingDetection = detectContributionGaming(contributionValues);

    // 6. Cache result
    await setCache(cacheKey, contributionValues, 3600);

    const duration = Date.now() - startTime;
    logToolUsage('contribution-equity', params.repo, duration);

    // 7. Return result
    return res.status(200).json(sanitizeOutput(contributionValues));

  } catch (error) {
    logError('Contribution equity error', error, { repo: req.body.repo });
    return res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
}

async function analyzeContributions(params) {
  const { repo, timeRange, includeReviews } = params;
  
  // In a real implementation, this would fetch data from GitHub API:
  // - Commits
  // - Pull requests
  // - Reviews
  // - Issues closed
  // - Documentation updates
  
  // For now, returning mock data
  return {
    "emma-dev": {
      commits: 134,
      linesAdded: 12450,
      linesDeleted: 3200,
      prsCreated: 45,
      prsReviewed: 89,
      issuesClosed: 23,
      documentation: 67,
      tests: 34,
      bugFixes: 12
    },
    "sarah-dev": {
      commits: 210,
      linesAdded: 8750,
      linesDeleted: 2100,
      prsCreated: 67,
      prsReviewed: 312,
      issuesClosed: 45,
      documentation: 12,
      tests: 89,
      bugFixes: 34
    },
    "commit-bot": {
      commits: 237,
      linesAdded: 711,
      linesDeleted: 474,
      prsCreated: 0,
      prsReviewed: 0,
      issuesClosed: 0,
      documentation: 0,
      tests: 0,
      bugFixes: 0
    }
  };
}

async function calculateContributionValues(contributionData) {
  // Define value weights for different types of contributions
  const values = {
    commit: 1.0,
    documentation: 2.5,     // Higher value - saves onboarding time
    review: 3.0,            // Prevents bugs
    bug_fix: 2.0,
    test: 1.5,
    issue_closed: 1.2
  };

  const result = {
    contributors: [],
    insights: [],
    gamingDetection: []
  };

  // Calculate value for each contributor
  for (const [username, data] of Object.entries(contributionData)) {
    const totalValue = (
      data.commits * values.commit +
      data.documentation * values.documentation +
      data.prsReviewed * values.review * 0.5 + // Reviews are valuable but less than direct code
      data.bugFixes * values.bug_fix +
      data.tests * values.test +
      data.issuesClosed * values.issue_closed
    );

    // Calculate recognition gap
    // (actual value vs typical commit-count-based recognition)
    const typicalRecognition = data.commits;
    const recognitionGap = totalValue - typicalRecognition;
    const undervalued = recognitionGap > 50;

    // Determine strengths
    const strengths = [];
    if (data.documentation > 20) {
      strengths.push({
        area: "Documentation",
        value: `${data.documentation} docs updates reduced onboarding time by significant amount`,
        impact: "high"
      });
    }
    if (data.prsReviewed > 50) {
      strengths.push({
        area: "Code Review",
        value: `${data.prsReviewed} PR reviews caught numerous critical issues`,
        impact: "critical"
      });
    }
    if (data.bugFixes > 10) {
      strengths.push({
        area: "Bug Fixes",
        value: `${data.bugFixes} critical bugs fixed`,
        impact: "high"
      });
    }

    result.contributors.push({
      username,
      contributions: {
        commits: data.commits,
        linesAdded: data.linesAdded,
        linesDeleted: data.linesDeleted,
        prsCreated: data.prsCreated,
        prsReviewed: data.prsReviewed,
        issuesClosed: data.issuesClosed,
        documentation: data.documentation
      },
      recognitionScore: Math.round(totalValue),
      undervalued,
      strengths,
      recommendedRecognition: generateRecognitionRecommendations(strengths)
    });

    // Add insights for significantly undervalued contributors
    if (undervalued) {
      if (data.documentation > 30) {
        result.insights.push({
          type: "undervalued_contribution",
          message: `${username}'s documentation work saved significant onboarding time`,
          valueUSD: data.documentation * 200 // Estimate value per doc update
        });
      }
      
      if (data.prsReviewed > 100) {
        result.insights.push({
          type: "review_champion",
          message: `${username} reviewed ${data.prsReviewed} PRs, preventing numerous bugs from reaching production`,
          valueUSD: data.prsReviewed * 150 // Estimate value per review
        });
      }
    }
  }

  return result;
}

function generateRecognitionRecommendations(strengths) {
  const recommendations = [];
  
  strengths.forEach(strength => {
    switch (strength.area) {
      case "Documentation":
        recommendations.push("Documentation Champion");
        break;
      case "Code Review":
        recommendations.push("Quality Guardian");
        break;
      case "Bug Fixes":
        recommendations.push("Stability Hero");
        break;
    }
  });
  
  return recommendations.join(", ");
}

function detectContributionGaming(contributorData) {
  const gamingIndicators = [];

  for (const contributor of contributorData.contributors) {
    const { username, contributions } = contributor;
    
    // High commit count, low impact
    if (contributions.commits > 100) {
      const avgLinesPerCommit = (contributions.linesAdded + contributions.linesDeleted) / contributions.commits;
      
      if (avgLinesPerCommit < 5) {
        gamingIndicators.push({
          username: username,
          concern: "High commit count but low impact",
          evidence: `${contributions.commits} commits, avg ${avgLinesPerCommit.toFixed(1)} lines changed, mostly whitespace`,
          recommendation: "Exclude from leaderboard metrics"
        });
      }
    }
  }

  return gamingIndicators;
}
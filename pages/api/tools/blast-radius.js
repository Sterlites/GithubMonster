import { validate, schemas } from '../../utils/validation';
import { getCached, setCache, generateCacheKey } from '../../utils/cache';
import logger, { logRequest, logError, logToolUsage } from '../../utils/logger';
import { analyzeWithGemini } from '../services/ai/llm-client';
import { sanitizeOutput } from '../../utils/security';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  logRequest(req.method, req.url, req.body, req.connection.remoteAddress);

  try {
    // 1. Validate input
    const params = validate(schemas.blastRadius, req.body);

    // 2. Check cache
    const cacheKey = generateCacheKey(params.repo, 'blast-radius', req.body);
    const cached = await getCached(cacheKey);
    if (cached) {
      logger.info('Cache hit', { repo: params.repo });
      return res.status(200).json(sanitizeOutput(cached));
    }

    // 3. Analyze blast radius
    const blastRadiusData = await calculateBlastRadius(params);

    // 4. Cache result
    await setCache(cacheKey, blastRadiusData, 3600);

    const duration = Date.now() - startTime;
    logToolUsage('blast-radius', params.repo, duration);

    // 5. Return result
    return res.status(200).json(sanitizeOutput(blastRadiusData));

  } catch (error) {
    logError('Blast radius error', error, { repo: req.body.repo });
    return res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
}

async function calculateBlastRadius(params) {
  const { repo, changeType, targetFiles, targetDependency } = params;
  
  // Build dependency graph (in a real implementation, this would parse actual code files)
  const dependencyGraph = await buildDependencyGraph(repo, targetFiles);
  
  // Calculate blast radius based on target files
  const affectedFiles = calculateAffectedFiles(dependencyGraph, targetFiles);
  
  // Analyze test impact
  const testImpact = await analyzeTestImpact(affectedFiles);
  
  // If this is a dependency update, check for breaking changes
  const breakingChanges = changeType === 'dependency-update' 
    ? await detectBreakingChanges(targetDependency) 
    : [];
  
  // Estimate effort to implement the change
  const estimatedEffort = estimateChangeEffort({
    affectedFiles: affectedFiles,
    testUpdates: testImpact,
    breakingChanges: breakingChanges
  });
  
  // Create dependency chain
  const dependencyChain = createDependencyChain(dependencyGraph, targetFiles);
  
  // Create rollback plan
  const rollbackPlan = createRollbackPlan(targetFiles, changeType);
  
  // Generate recommendations
  const recommendations = generateRecommendations(affectedFiles, breakingChanges);
  
  return {
    impact: {
      severity: getSeverityLevel(affectedFiles.length),
      affectedFiles: affectedFiles.length,
      affectedTests: testImpact.length,
      breakingChanges: breakingChanges.length > 0,
      estimatedEffort: `${estimatedEffort} hours`
    },
    affectedComponents: affectedFiles.map(file => ({
      file: file,
      reason: `Imports/depends on modified file`,
      changeRequired: `Update import/usage as needed`,
      effort: "15-30 minutes"
    })),
    testUpdatesRequired: testImpact,
    dependencyChain,
    rollbackComplexity: "medium",
    rollbackPlan,
    recommendations
  };
}

async function buildDependencyGraph(repo, targetFiles) {
  // In a real implementation, this would parse all files in the repository
  // to build a dependency graph by analyzing import/require statements
  // For now, returning a mock graph
  return {
    nodes: [...targetFiles, "src/routes/api.js", "src/middleware/auth.js", "src/controllers/user.js"],
    edges: [
      {from: "src/auth/session.js", to: "src/middleware/auth.js"},
      {from: "src/middleware/auth.js", to: "src/routes/api.js"},
      {from: "src/routes/api.js", to: "src/controllers/user.js"}
    ]
  };
}

function calculateAffectedFiles(dependencyGraph, targetFiles) {
  // Find all files that depend on target (forward dependencies)
  // and all files the target depends on (backward dependencies)
  
  // In a real implementation, this would use graph traversal algorithms
  // to find all connected components in the dependency graph
  
  // For now, returning a mock list of affected files
  return [
    "src/auth/session.js",
    "src/middleware/auth.js",
    "src/routes/api.js",
    "src/routes/admin.js",
    "src/controllers/user.js"
  ];
}

async function analyzeTestImpact(affectedFiles) {
  // In a real implementation, this would identify test files
  // that would be affected by the changes
  // For now, returning mock test impact
  return [
    {
      testFile: "tests/auth.test.js",
      reason: "Mock structure changed",
      linesAffected: 45
    },
    {
      testFile: "tests/api.test.js",
      reason: "API endpoint signature changed",
      linesAffected: 23
    }
  ];
}

async function detectBreakingChanges(dependency) {
  // In a real implementation, this would compare the old and new
  // versions of a dependency to detect breaking changes
  // For now, returning mock breaking changes
  if (dependency && dependency.includes('@5.0.0')) {
    return [
      {
        type: "signature_change",
        name: "express.middleware",
        severity: "high"
      }
    ];
  }
  return [];
}

function estimateChangeEffort(blastRadiusData) {
  // Factor in number of affected files
  const fileFactor = blastRadiusData.affectedFiles.length * 0.1;
  
  // Factor in test updates
  const testFactor = blastRadiusData.testUpdates.length * 0.5;
  
  // Factor in breaking changes
  const breakingFactor = blastRadiusData.breakingChanges.length * 2.0;
  
  const totalEffort = 1.0 + fileFactor + testFactor + breakingFactor; // base hour + factors
  
  return Math.round(totalEffort * 10) / 10; // Round to 1 decimal place
}

function createDependencyChain(dependencyGraph, targetFiles) {
  // In a real implementation, this would trace the dependency chain
  // For now, returning a mock chain
  return [
    "src/auth/session.js",
    "src/middleware/auth.js",
    "src/routes/api.js",
    "src/routes/admin.js",
    "src/controllers/user.js"
  ];
}

function createRollbackPlan(targetFiles, changeType) {
  return {
    steps: [
      `Revert changes to ${targetFiles.slice(0, 3).join(', ')}`,
      "Clear any caches if applicable",
      "Restart services if needed"
    ],
    estimatedTime: "15 minutes"
  };
}

function generateRecommendations(affectedFiles, breakingChanges) {
  const recommendations = [
    "Create feature flag for gradual rollout",
    "Update integration tests before merge",
    "Schedule deployment during low-traffic window"
  ];
  
  if (breakingChanges.length > 0) {
    recommendations.push("Update documentation to reflect breaking changes");
  }
  
  if (affectedFiles.length > 50) {
    recommendations.push("Consider breaking change into smaller, incremental updates");
  }
  
  return recommendations;
}

function getSeverityLevel(affectedFileCount) {
  if (affectedFileCount > 100) return "critical";
  if (affectedFileCount > 50) return "high";
  if (affectedFileCount > 10) return "medium";
  return "low";
}
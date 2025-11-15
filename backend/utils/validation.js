import Joi from 'joi';

export const schemas = {
  repository: Joi.object({
    repo: Joi.string()
      .pattern(/^[\w-]+\/[\w-]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Repository must be in format owner/repo'
      }),
    timeRange: Joi.string()
      .valid('1m', '3m', '6m', '1y', 'all')
      .default('3m'),
    includeIssues: Joi.boolean().default(true),
    includePRs: Joi.boolean().default(true)
  }),

  blastRadius: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    changeType: Joi.string()
      .valid('dependency-update', 'refactor', 'feature')
      .required(),
    targetFiles: Joi.array().items(Joi.string()).min(1),
    targetDependency: Joi.string().when('changeType', {
      is: 'dependency-update',
      then: Joi.required()
    })
  }),

  learningPath: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    experience: Joi.string()
      .valid('beginner', 'intermediate', 'advanced')
      .required(),
    focusArea: Joi.string()
      .valid('backend', 'frontend', 'devops', 'all')
      .default('all'),
    timeCommitment: Joi.string().default('10h/week')
  }),

  techDebt: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    analysisDepth: Joi.string()
      .valid('quick', 'standard', 'full')
      .default('standard'),
    includeTests: Joi.boolean().default(true),
    includeDocs: Joi.boolean().default(true)
  }),

  healthScore: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    includeTeamMetrics: Joi.boolean().default(true),
    timeRange: Joi.string()
      .valid('1m', '3m', '6m', '1y', 'all')
      .default('3m')
  }),

  contributionEquity: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    timeRange: Joi.string()
      .valid('1m', '3m', '6m', '1y', 'all')
      .default('6m'),
    includeReviews: Joi.boolean().default(true)
  }),

  executiveSummary: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    reportType: Joi.string()
      .valid('weekly', 'monthly', 'quarterly', 'annual')
      .default('quarterly'),
    includeFinancials: Joi.boolean().default(true),
    audience: Joi.string()
      .valid('executive', 'technical', 'investor')
      .default('executive')
  }),

  visualStory: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    storyType: Joi.string()
      .valid('feature', 'bugfix', 'refactor', 'release')
      .required(),
    targetCommit: Joi.string().optional(),
    targetPR: Joi.string().optional(),
    audience: Joi.string()
      .valid('product-team', 'customers', 'investors')
      .default('product-team')
  }),

  patternMatcher: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    searchType: Joi.string()
      .valid('architecture', 'implementation', 'antipattern')
      .default('architecture'),
    scope: Joi.string()
      .valid('popular', 'language-specific', 'industry')
      .default('popular'),
    language: Joi.string().default('javascript')
  }),

  unusedPotential: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    analysisType: Joi.string()
      .valid('quick', 'standard', 'full')
      .default('standard'),
    includeMarketResearch: Joi.boolean().default(true)
  }),

  compliance: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    standards: Joi.array().items(
      Joi.string().valid('SOC2', 'HIPAA', 'GDPR', 'ISO27001')
    ).min(1).required(),
    generateReport: Joi.boolean().default(true)
  }),

  chaosPredictor: Joi.object({
    repo: Joi.string().pattern(/^[\w-]+\/[\w-]+$/).required(),
    scope: Joi.string()
      .valid('production', 'staging', 'all')
      .default('production'),
    includeExternal: Joi.boolean().default(true),
    riskTolerance: Joi.string()
      .valid('low', 'medium', 'high')
      .default('low')
  })
};

export function validate(schema, data) {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    throw {
      status: 400,
      message: 'Validation error',
      details: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    };
  }

  return value;
}

// Validation middleware for Express/Next.js
export function validateBody(schema) {
  return (handler) => {
    return async (req, res) => {
      if (req.method !== 'POST') {
        return handler(req, res);
      }
      
      try {
        const validated = validate(schema, req.body);
        req.body = validated;
        return handler(req, res);
      } catch (error) {
        if (error.status === 400) {
          return res.status(400).json({ 
            error: 'Validation failed', 
            details: error.details 
          });
        }
        
        return res.status(500).json({ error: 'Internal server error' });
      }
    };
  };
}

// Export default for compatibility
export default { schemas, validate, validateBody };
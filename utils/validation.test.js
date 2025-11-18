import { validate, schemas } from './validation';

describe('Validation Utilities', () => {
  describe('Repository Schema', () => {
    it('should validate correct repository format', () => {
      const validData = {
        repo: 'facebook/react',
        timeRange: '3m',
        includeIssues: true,
        includePRs: true
      };

      const result = validate(schemas.repository, validData);
      expect(result.repo).toBe('facebook/react');
      expect(result.timeRange).toBe('3m');
    });

    it('should reject invalid repository format', () => {
      const invalidData = {
        repo: 'invalid-repo-format'
      };

      expect(() => validate(schemas.repository, invalidData)).toThrow();
    });

    it('should apply default values', () => {
      const minimalData = {
        repo: 'owner/repo'
      };

      const result = validate(schemas.repository, minimalData);
      expect(result.timeRange).toBe('3m');
      expect(result.includeIssues).toBe(true);
      expect(result.includePRs).toBe(true);
    });

    it('should reject invalid time range', () => {
      const invalidData = {
        repo: 'owner/repo',
        timeRange: 'invalid'
      };

      expect(() => validate(schemas.repository, invalidData)).toThrow();
    });
  });

  describe('Health Score Schema', () => {
    it('should validate health score parameters', () => {
      const validData = {
        repo: 'microsoft/vscode',
        includeTeamMetrics: true,
        timeRange: '6m'
      };

      const result = validate(schemas.healthScore, validData);
      expect(result.repo).toBe('microsoft/vscode');
      expect(result.includeTeamMetrics).toBe(true);
      expect(result.timeRange).toBe('6m');
    });

    it('should apply default values for health score', () => {
      const minimalData = {
        repo: 'owner/repo'
      };

      const result = validate(schemas.healthScore, minimalData);
      expect(result.includeTeamMetrics).toBe(true);
      expect(result.timeRange).toBe('3m');
    });
  });

  describe('Learning Path Schema', () => {
    it('should validate learning path parameters', () => {
      const validData = {
        repo: 'vercel/next.js',
        experience: 'beginner',
        focusArea: 'frontend',
        timeCommitment: '10h/week'
      };

      const result = validate(schemas.learningPath, validData);
      expect(result.experience).toBe('beginner');
      expect(result.focusArea).toBe('frontend');
    });

    it('should reject invalid experience level', () => {
      const invalidData = {
        repo: 'owner/repo',
        experience: 'expert' // Not a valid option
      };

      expect(() => validate(schemas.learningPath, invalidData)).toThrow();
    });
  });

  describe('Blast Radius Schema', () => {
    it('should validate blast radius parameters', () => {
      const validData = {
        repo: 'nodejs/node',
        changeType: 'refactor',
        targetFiles: ['src/index.js', 'src/utils.js']
      };

      const result = validate(schemas.blastRadius, validData);
      expect(result.changeType).toBe('refactor');
      expect(result.targetFiles).toHaveLength(2);
    });

    it('should require targetDependency for dependency updates', () => {
      const invalidData = {
        repo: 'owner/repo',
        changeType: 'dependency-update',
        targetFiles: ['package.json']
        // Missing targetDependency
      };

      expect(() => validate(schemas.blastRadius, invalidData)).toThrow();
    });

    it('should require at least one target file', () => {
      const invalidData = {
        repo: 'owner/repo',
        changeType: 'refactor',
        targetFiles: []
      };

      expect(() => validate(schemas.blastRadius, invalidData)).toThrow();
    });
  });

  describe('Compliance Schema', () => {
    it('should validate compliance parameters', () => {
      const validData = {
        repo: 'company/product',
        standards: ['SOC2', 'GDPR'],
        generateReport: true
      };

      const result = validate(schemas.compliance, validData);
      expect(result.standards).toContain('SOC2');
      expect(result.standards).toContain('GDPR');
    });

    it('should require at least one standard', () => {
      const invalidData = {
        repo: 'owner/repo',
        standards: []
      };

      expect(() => validate(schemas.compliance, invalidData)).toThrow();
    });

    it('should reject invalid standards', () => {
      const invalidData = {
        repo: 'owner/repo',
        standards: ['INVALID_STANDARD']
      };

      expect(() => validate(schemas.compliance, invalidData)).toThrow();
    });
  });
});

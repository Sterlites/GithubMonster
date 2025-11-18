# API Documentation

## Base URL
```
Production: https://githubmonster.vercel.app
Staging: https://staging.githubmonster.vercel.app
Local: http://localhost:3000
```

## Authentication

All API endpoints support optional authentication via API keys. Public access is allowed with reduced rate limits.

### API Key Usage

Include your API key in one of the following ways:

**Header (Recommended):**
```
X-API-Key: your_api_key_here
```

**Authorization Header:**
```
Authorization: Bearer your_api_key_here
```

**Query Parameter:**
```
?apiKey=your_api_key_here
```

### Rate Limits

| Tier | Requests per Minute | Features |
|------|---------------------|----------|
| Public (No Key) | 10 | Basic access |
| Free | 60 | Standard access |
| Pro | 300 | Priority processing |
| Enterprise | 1000 | Dedicated support |

## System Endpoints

### Health Check
Check the health status of the API and its dependencies.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-18T17:50:00.000Z",
  "uptime": 3600,
  "services": {
    "github": {
      "status": "healthy",
      "message": "GitHub API is accessible"
    },
    "gemini": {
      "status": "configured",
      "message": "Gemini API key is configured"
    },
    "cache": {
      "status": "healthy",
      "message": "Cache is accessible"
    },
    "environment": {
      "status": "healthy",
      "message": "All required environment variables are set"
    }
  },
  "responseTime": 45,
  "version": "1.0.0"
}
```

### Metrics
Get Prometheus-formatted metrics for monitoring.

**Endpoint:** `GET /api/metrics`

**Response:** Prometheus text format

---

## Repository Stats

Get comprehensive statistics for a GitHub repository.

**Endpoint:** `POST /api/repo-stats`

**Request Body:**
```json
{
  "repo": "facebook/react",
  "timeRange": "3m",
  "includeIssues": true,
  "includePRs": true
}
```

**Parameters:**
- `repo` (required): Repository in format `owner/repo`
- `timeRange` (optional): `1m`, `3m`, `6m`, `1y`, `all` (default: `3m`)
- `includeIssues` (optional): Include issue metrics (default: `true`)
- `includePRs` (optional): Include PR metrics (default: `true`)

**Response:**
```json
{
  "linesOfCode": 150000,
  "contributors": 1500,
  "healthScore": 87,
  "ageInDays": 3000,
  "stars": 220000,
  "forks": 45000,
  "openIssues": 800,
  "watchers": 8000,
  "languageBreakdown": {
    "JavaScript": 12500000,
    "TypeScript": 3200000,
    "CSS": 450000
  },
  "lastUpdated": "2024-11-18T10:30:00Z"
}
```

---

## Analysis Tools

### 1. CodeArchaeology
Traces architectural decisions across git history.

**Endpoint:** `POST /api/tools/archaeology`

**Request Body:**
```json
{
  "repo": "facebook/react",
  "timeRange": "6m",
  "includeIssues": true,
  "includePRs": true
}
```

**Response:**
```json
{
  "timeline": [
    {
      "date": "2024-03-15T10:30:00Z",
      "type": "commit",
      "title": "Switch to session-based auth",
      "description": "Moved from JWT to sessions after security audit",
      "author": "john-doe",
      "references": ["#234", "PR#456"],
      "files": ["src/auth/session.js"],
      "impact": "high",
      "reasoning": "Security vulnerability CVE-2024-1234"
    }
  ],
  "keyDecisions": [
    {
      "decision": "Database migration",
      "date": "2024-02-20",
      "rationale": "Need for ACID transactions",
      "alternatives": ["MySQL", "CockroachDB"],
      "outcome": "Successful - 40% performance improvement"
    }
  ],
  "metadata": {
    "totalEvents": 15,
    "timespan": "6m",
    "contributors": ["john-doe", "jane-doe"]
  }
}
```

---

### 2. Learning Path Generator
Creates personalized learning paths for new contributors.

**Endpoint:** `POST /api/tools/learning-path`

**Request Body:**
```json
{
  "repo": "vercel/next.js",
  "experience": "beginner",
  "focusArea": "frontend",
  "timeCommitment": "10h/week"
}
```

**Parameters:**
- `experience`: `beginner`, `intermediate`, `advanced`
- `focusArea`: `backend`, `frontend`, `devops`, `all`

---

### 3. Technical Debt ROI Calculator
Quantifies technical debt in business terms.

**Endpoint:** `POST /api/tools/tech-debt`

**Request Body:**
```json
{
  "repo": "microsoft/vscode",
  "analysisDepth": "standard",
  "includeTests": true,
  "includeDocs": true
}
```

**Parameters:**
- `analysisDepth`: `quick`, `standard`, `full`

---

### 4. Blast Radius Simulator
Predicts the impact of code changes.

**Endpoint:** `POST /api/tools/blast-radius`

**Request Body:**
```json
{
  "repo": "nodejs/node",
  "changeType": "refactor",
  "targetFiles": ["src/index.js", "src/utils.js"]
}
```

**Parameters:**
- `changeType`: `dependency-update`, `refactor`, `feature`
- `targetFiles`: Array of file paths
- `targetDependency`: Required if `changeType` is `dependency-update`

---

### 5. Repository Health Score
Comprehensive health analysis with multiple dimensions.

**Endpoint:** `POST /api/tools/health-score`

**Request Body:**
```json
{
  "repo": "tensorflow/tensorflow",
  "includeTeamMetrics": true,
  "timeRange": "3m"
}
```

**Response:**
```json
{
  "overallScore": 87,
  "breakdown": {
    "codeQuality": {
      "score": 92,
      "metrics": {
        "testCoverage": 75,
        "codeSmells": 15,
        "duplication": 3.2,
        "complexity": "medium"
      }
    },
    "collaboration": {
      "score": 85,
      "metrics": {
        "avgPRReviewTime": "4.5 hours",
        "reviewParticipation": 78,
        "knowledgeSharing": "good",
        "knowledgeSilos": 2
      }
    },
    "documentation": {
      "score": 78,
      "metrics": {
        "readmeCoverage": 90,
        "apiDocumentation": 65,
        "inlineComments": 80,
        "tutorialQuality": "medium"
      }
    },
    "teamWellbeing": {
      "score": 88,
      "warnings": [],
      "metrics": {
        "workloadBalance": 82,
        "commitTimeDistribution": "healthy",
        "vacationRespected": true
      }
    }
  },
  "trends": {
    "3month": 87,
    "6month": 82,
    "1year": 77,
    "direction": "improving"
  },
  "alerts": [
    {
      "severity": "medium",
      "category": "duplication",
      "message": "High code duplication detected (5.2%)",
      "recommendation": "Refactor common utilities"
    }
  ],
  "recommendations": [
    "Increase test coverage",
    "Improve API documentation"
  ]
}
```

---

### 6. Contribution Equity Analyzer
Identifies undervalued contributions beyond commits.

**Endpoint:** `POST /api/tools/contribution-equity`

**Request Body:**
```json
{
  "repo": "rust-lang/rust",
  "timeRange": "6m",
  "includeReviews": true
}
```

---

### 7. Executive Summary Generator
Translates technical metrics to business reports.

**Endpoint:** `POST /api/tools/executive-summary`

**Request Body:**
```json
{
  "repo": "kubernetes/kubernetes",
  "reportType": "quarterly",
  "includeFinancials": true,
  "audience": "executive"
}
```

**Parameters:**
- `reportType`: `weekly`, `monthly`, `quarterly`, `annual`
- `audience`: `executive`, `technical`, `investor`

---

### 8. Visual Code Storyteller
Converts code changes into visual narratives.

**Endpoint:** `POST /api/tools/visual-story`

**Request Body:**
```json
{
  "repo": "django/django",
  "storyType": "feature",
  "targetCommit": "abc123",
  "audience": "product-team"
}
```

**Parameters:**
- `storyType`: `feature`, `bugfix`, `refactor`, `release`
- `audience`: `product-team`, `customers`, `investors`

---

### 9. Cross-Repo Pattern Matcher
Discovers patterns across repositories.

**Endpoint:** `POST /api/tools/pattern-matcher`

**Request Body:**
```json
{
  "repo": "rails/rails",
  "searchType": "architecture",
  "scope": "popular",
  "language": "ruby"
}
```

**Parameters:**
- `searchType`: `architecture`, `implementation`, `antipattern`
- `scope`: `popular`, `language-specific`, `industry`

---

### 10. Unused Potential Finder
Identifies monetizable components.

**Endpoint:** `POST /api/tools/unused-potential`

**Request Body:**
```json
{
  "repo": "apache/spark",
  "analysisType": "standard",
  "includeMarketResearch": true
}
```

---

### 11. Compliance Autopilot
Auto-generates compliance audit trails.

**Endpoint:** `POST /api/tools/compliance`

**Request Body:**
```json
{
  "repo": "company/product",
  "standards": ["SOC2", "GDPR", "HIPAA"],
  "generateReport": true
}
```

**Parameters:**
- `standards`: Array of `SOC2`, `HIPAA`, `GDPR`, `ISO27001`

---

### 12. Chaos Engineering Predictor
Predicts failure combinations.

**Endpoint:** `POST /api/tools/chaos-predictor`

**Request Body:**
```json
{
  "repo": "netflix/hystrix",
  "scope": "production",
  "includeExternal": true,
  "riskTolerance": "low"
}
```

**Parameters:**
- `scope`: `production`, `staging`, `all`
- `riskTolerance`: `low`, `medium`, `high`

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "repo",
      "message": "Repository must be in format owner/repo"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1700328000000
```

When rate limited:
```
Retry-After: 30
```

---

## Examples

### cURL Example
```bash
curl -X POST https://githubmonster.vercel.app/api/tools/health-score \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "repo": "facebook/react",
    "includeTeamMetrics": true,
    "timeRange": "3m"
  }'
```

### JavaScript Example
```javascript
const response = await fetch('https://githubmonster.vercel.app/api/tools/health-score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key_here'
  },
  body: JSON.stringify({
    repo: 'facebook/react',
    includeTeamMetrics: true,
    timeRange: '3m'
  })
});

const data = await response.json();
console.log(data);
```

### Python Example
```python
import requests

response = requests.post(
    'https://githubmonster.vercel.app/api/tools/health-score',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': 'your_api_key_here'
    },
    json={
        'repo': 'facebook/react',
        'includeTeamMetrics': True,
        'timeRange': '3m'
    }
)

data = response.json()
print(data)
```

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/your-username/githubmonster/issues
- Email: support@githubmonster.com
- Documentation: https://docs.githubmonster.com

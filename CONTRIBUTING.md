# Contributing to GithubMonster

Thank you for your interest in contributing to GithubMonster! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Node version, etc.)
- **Error messages** and stack traces

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** and motivation
- **Proposed solution** or implementation approach
- **Alternatives considered**
- **Additional context** or mockups

### Pull Requests

1. **Fork the repository** and create your branch from `develop`
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Ensure tests pass** (`npm test`)
6. **Ensure code is formatted** (`npm run format`)
7. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub account
- Google Gemini API key (free)

### Installation

```bash
# Clone your fork
git clone https://github.com/your-username/githubmonster.git
cd githubmonster

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
GITHUB_TOKEN=your_github_token_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

## Coding Standards

### JavaScript Style Guide

We follow standard JavaScript conventions:

- Use **ES6+ features**
- Use **async/await** for asynchronous code
- Use **meaningful variable names**
- Keep functions **small and focused**
- Add **JSDoc comments** for public APIs

### File Organization

```
pages/api/          # API endpoints
  tools/            # Analysis tool endpoints
  github/           # GitHub proxy
utils/              # Utility functions
services/           # External service integrations
  ai/               # AI service clients
```

### Naming Conventions

- **Files**: kebab-case (`health-score.js`)
- **Functions**: camelCase (`calculateHealthScore`)
- **Classes**: PascalCase (`ApiClient`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Code Formatting

We use Prettier for code formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

## Testing

### Writing Tests

- Place tests next to the code they test (`utils/validation.test.js`)
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
```

### Test Coverage

We aim for:
- **80%+ overall coverage**
- **100% coverage** for critical paths
- **All edge cases** covered

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```
feat(health-score): add team wellbeing metrics

fix(cache): resolve Redis connection timeout

docs(api): update authentication examples
```

## Pull Request Process

1. **Update documentation** for any changed functionality
2. **Add tests** for new features
3. **Ensure CI passes** (tests, linting, build)
4. **Request review** from maintainers
5. **Address feedback** promptly
6. **Squash commits** if requested
7. **Wait for approval** before merging

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No new warnings
- [ ] Dependent changes merged

## API Development

### Adding a New Tool

1. Create endpoint in `pages/api/tools/your-tool.js`
2. Add validation schema in `utils/validation.js`
3. Implement core logic
4. Add tests in `pages/api/tools/your-tool.test.js`
5. Update API documentation
6. Add to frontend UI

### Endpoint Template

```javascript
import { validate, schemas } from '../../../utils/validation';
import { getCached, setCache, generateCacheKey } from '../../../utils/cache';
import logger, { logRequest, logError, logToolUsage } from '../../../utils/logger';
import { sanitizeOutput } from '../../../utils/security';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  logRequest(req.method, req.url, req.body, req.connection.remoteAddress);

  try {
    // 1. Validate input
    const params = validate(schemas.yourTool, req.body);
    
    // 2. Check cache
    const cacheKey = generateCacheKey(params.repo, 'your-tool', req.body);
    const cached = await getCached(cacheKey);
    if (cached) {
      return res.status(200).json(sanitizeOutput(cached));
    }

    // 3. Perform analysis
    const result = await performAnalysis(params);

    // 4. Cache result
    await setCache(cacheKey, result, 3600);

    const duration = Date.now() - startTime;
    logToolUsage('your-tool', params.repo, duration);
    
    // 5. Return result
    return res.status(200).json(sanitizeOutput(result));

  } catch (error) {
    logError('Your tool error', error, { repo: req.body.repo });
    return res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
}
```

## Documentation

### Code Comments

- Add JSDoc comments for all public functions
- Explain **why**, not **what**
- Document complex algorithms
- Note any gotchas or edge cases

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Updating dependencies
- Modifying deployment process

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch
4. Run full test suite
5. Create GitHub release
6. Deploy to production

## Getting Help

- **Documentation**: Check README and API docs
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions
- **Contact**: Reach out to maintainers

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to GithubMonster! 🎉

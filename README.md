# RepoInsights - AI-Powered Repository Analysis Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Powered%20by-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

RepoInsights is a comprehensive suite of 12 AI-powered tools that analyze GitHub repositories to provide deep insights into code quality, architecture, team dynamics, and business impact. The backend provides REST APIs that transform complex technical data into actionable insights for developers, managers, and stakeholders.

## 🚀 Demo

Check out the live frontend at: [repoinsights.vercel.app](https://repoinsights.vercel.app)

## ✨ Features

### 12 Powerful Analysis Tools:
- **CodeArchaeology** - Traces architectural decisions across git history
- **Learning Path Generator** - Creates personalized paths for new contributors
- **Technical Debt ROI Calculator** - Quantifies debt in business terms
- **Blast Radius Simulator** - Predicts impact of code changes
- **Repository Health Score** - Comprehensive health analysis
- **Contribution Equity Analyzer** - Identifies undervalued contributions
- **Executive Summary Generator** - Translates metrics to business reports
- **Visual Code Storyteller** - Converts changes into visual narratives
- **Cross-Repo Pattern Matcher** - Discovers patterns across millions of repos
- **Unused Potential Finder** - Identifies monetizable components
- **Compliance Autopilot** - Auto-generates audit trails
- **Chaos Engineering Predictor** - Predicts failure combinations

### Key Benefits:
- 🧠 AI-powered insights using Google Gemini Pro (free API)
- ⚡ Fast responses with intelligent caching
- 🔐 Secure GitHub API integration
- 📊 Comprehensive metrics and visualizations
- 🎯 Business-oriented reporting
- 🛡️ Privacy-focused (no data storage)

## 🛠️ Tech Stack

- **Backend**: Node.js with Next.js API routes
- **AI**: Google Gemini Pro API (free tier)
- **Caching**: Redis / In-memory fallback
- **Validation**: Joi
- **Logging**: Winston
- **Deployment**: Vercel Serverless Functions
- **Security**: Rate limiting, input sanitization

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- GitHub Account
- Google Gemini Pro API Key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/repoinsights.git
   cd repoinsights
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   # GitHub API
   GITHUB_TOKEN=your_github_token_here
   
   # Google Gemini API (free)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Redis for caching (optional)
   # REDIS_URL=redis://localhost:6379
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

### Deploy to Vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/repoinsights)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables Required

- `GITHUB_TOKEN`: GitHub Personal Access Token with repo permissions
- `GEMINI_API_KEY`: Google Gemini Pro API key (free tier available)

### Optional Variables
- `REDIS_URL`: Redis connection string for better caching
- `LOG_LEVEL`: Log level (default: info)
- `NODE_ENV`: Environment (development/production)

## 📡 API Usage

All endpoints follow the pattern: `POST https://your-vercel-url.com/api/tools/[tool-name]`

### Example Request:

```bash
curl -X POST https://your-vercel-url.com/api/tools/health-score \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "facebook/react",
    "includeTeamMetrics": true,
    "timeRange": "3m"
  }'
```

### Authentication

All requests require GitHub authentication via the token set in your environment variables.

## 🛡️ Security

- Input validation with Joi
- Output sanitization to prevent secret leaks
- Rate limiting to prevent abuse
- GitHub token validation
- Secure handling of API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/repoinsights/issues) page
2. Create a new issue with:
   - Tool name
   - Error message
   - Request/response examples
   - Your environment details

## 🙏 Acknowledgments

- Google for Gemini Pro API (free tier)
- GitHub for API access
- Vercel for serverless platform
- All contributors who help maintain this project

## 📊 API Endpoints

| Tool | Endpoint | Description |
|------|----------|-------------|
| CodeArchaeology | `POST /api/tools/archaeology` | Traces architectural decisions |
| Learning Path | `POST /api/tools/learning-path` | Generates learning paths |
| Tech Debt ROI | `POST /api/tools/tech-debt` | Quantifies technical debt |
| Blast Radius | `POST /api/tools/blast-radius` | Predicts change impact |
| Health Score | `POST /api/tools/health-score` | Comprehensive health analysis |
| Contribution Equity | `POST /api/tools/contribution-equity` | Identifies contributions |
| Executive Summary | `POST /api/tools/executive-summary` | Business reports |
| Visual Story | `POST /api/tools/visual-story` | Visual narratives |
| Pattern Matcher | `POST /api/tools/pattern-matcher` | Cross-repo patterns |
| Unused Potential | `POST /api/tools/unused-potential` | Find monetizable assets |
| Compliance | `POST /api/tools/compliance` | Audit trails |
| Chaos Predictor | `POST /api/tools/chaos-predictor` | Failure prediction |

---

**Made with ❤️ for the developer community**

If you find this tool helpful, please give it a ⭐ star!
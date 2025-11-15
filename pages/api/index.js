export default function handler(req, res) {
  res.status(200).json({ 
    message: "GithubMonster API is running!",
    version: "1.0.0",
    tools: [
      "/api/tools/archaeology",
      "/api/tools/learning-path", 
      "/api/tools/tech-debt",
      "/api/tools/blast-radius",
      "/api/tools/health-score",
      "/api/tools/contribution-equity",
      "/api/tools/executive-summary",
      "/api/tools/visual-story",
      "/api/tools/pattern-matcher",
      "/api/tools/unused-potential",
      "/api/tools/compliance",
      "/api/tools/chaos-predictor"
    ],
    documentation: "Visit https://github.com/your-username/githubmonster for API documentation"
  });
}
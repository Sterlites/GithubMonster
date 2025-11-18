import Head from 'next/head';

export default function Home() {
  return (
    <div className="main">
      <Head>
        <title>GithubMonster - GitHub Repository Intelligence</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          *{margin:0;padding:0;box-sizing:border-box}
          :root{--primary:#6366f1;--primary-dark:#4f46e5;--secondary:#ec4899;--success:#10b981;--warning:#f59e0b;--danger:#ef4444;--bg-dark:#0f172a;--bg-medium:#1e293b;--bg-light:#334155;--text-primary:#f1f5f9;--text-secondary:#94a3b8;--glass-bg:rgba(30,41,59,0.7);--glass-border:rgba(148,163,184,0.1)}
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg-dark);color:var(--text-primary);line-height:1.6}
          .animated-bg{position:fixed;inset:0;z-index:-1;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%)}
          .bg-orb{position:absolute;border-radius:50%;filter:blur(100px);opacity:0.3;animation:float 20s infinite ease-in-out}
          .orb-1{width:500px;height:500px;background:var(--primary);top:-250px;right:-250px}
          .orb-2{width:400px;height:400px;background:var(--secondary);bottom:-200px;left:-200px;animation-delay:5s}
          .orb-3{width:300px;height:300px;background:var(--success);top:50%;left:50%;animation-delay:10s}
          @keyframes float{0%,100%{transform:translate(0,0)}33%{transform:translate(50px,-50px)}66%{transform:translate(-50px,50px)}}
          header{background:var(--glass-bg);backdrop-filter:blur(20px);border-bottom:1px solid var(--glass-border);padding:1.5rem 2rem;position:sticky;top:0;z-index:1000;transition:all 0.3s}
          header.scrolled{padding:1rem 2rem;box-shadow:0 4px 30px rgba(0,0,0,0.3)}
          .header-content{max-width:1400px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:2rem;flex-wrap:wrap}
          .logo{display:flex;align-items:center;gap:1rem;font-size:1.5rem;font-weight:700;background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
          .logo-icon{width:40px;height:40px;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;animation:rotate 20s linear infinite}
          @keyframes rotate{to{transform:rotate(360deg)}}
          .search-container{flex:1;max-width:600px;position:relative}
          .search-wrapper{position:relative;display:flex;align-items:center;background:var(--bg-medium);border:2px solid var(--glass-border);border-radius:50px;padding:0.5rem 1rem;transition:all 0.3s}
          .search-wrapper:focus-within{border-color:var(--primary);box-shadow:0 0 0 4px rgba(99,102,241,0.1);transform:translateY(-2px)}
          .search-icon{font-size:1.2rem;color:var(--text-secondary);margin-right:0.75rem}
          #repoInput{flex:1;background:transparent;border:none;outline:none;color:var(--text-primary);font-size:0.95rem;padding:0.5rem 0;font-family:Monaco,monospace}
          #repoInput::placeholder{color:var(--text-secondary)}
          .analyze-btn{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;border:none;padding:0.75rem 1.5rem;border-radius:50px;font-weight:600;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;gap:0.5rem;box-shadow:0 4px 15px rgba(99,102,241,0.3)}
          .analyze-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px rgba(99,102,241,0.4)}
          .analyze-btn:disabled{opacity:0.5;cursor:not-allowed}
          .loading-spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.6s linear infinite}
          @keyframes spin{to{transform:rotate(360deg)}}
          .suggestions{position:absolute;top:100%;left:0;right:0;margin-top:0.5rem;background:var(--bg-medium);border:1px solid var(--glass-border);border-radius:16px;backdrop-filter:blur(20px);overflow:hidden;opacity:0;transform:translateY(-10px);pointer-events:none;transition:all 0.3s;z-index:1000}
          .suggestions.active{opacity:1;transform:translateY(0);pointer-events:all}
          .suggestion-item{padding:1rem 1.5rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:1rem;border-bottom:1px solid var(--glass-border)}
          .suggestion-item:last-child{border-bottom:none}
          .suggestion-item:hover{background:var(--bg-light);padding-left:2rem}
          .suggestion-icon{font-size:1.5rem}
          .suggestion-content{flex:1}
          .suggestion-title{font-weight:600;margin-bottom:0.25rem}
          .suggestion-url{font-size:0.85rem;color:var(--text-secondary);font-family:Monaco,monospace}
          .landing-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 100px);padding:2rem;text-align:center}
          .landing-screen.hidden{display:none}
          .landing-title{font-size:4rem;font-weight:800;margin-bottom:1.5rem;background:linear-gradient(135deg,var(--text-primary),var(--text-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:fadeIn 0.8s}
          .landing-subtitle{font-size:1.5rem;color:var(--text-secondary);max-width:700px;margin-bottom:3rem;animation:fadeIn 0.8s 0.2s backwards}
          @keyframes fadeIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
          .landing-search{width:100%;max-width:700px;animation:fadeIn 0.8s 0.4s backwards}
          .landing-search .search-wrapper{padding:1rem 1.5rem}
          .landing-search #landingInput{font-size:1.1rem}
          .landing-search .analyze-btn{padding:1rem 2rem;font-size:1rem}
          .popular-repos{margin-top:3rem;animation:fadeIn 0.8s 0.6s backwards}
          .popular-title{font-size:1rem;color:var(--text-secondary);margin-bottom:1.5rem;text-transform:uppercase;letter-spacing:2px}
          .repo-chips{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}
          .repo-chip{padding:0.75rem 1.5rem;background:var(--bg-medium);border:1px solid var(--glass-border);border-radius:50px;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;gap:0.5rem;font-family:Monaco,monospace;font-size:0.9rem}
          .repo-chip:hover{background:var(--primary);border-color:var(--primary);transform:translateY(-3px);box-shadow:0 8px 20px rgba(99,102,241,0.3)}
          .main-content{display:none}
          .main-content.active{display:block}
          .repo-info{display:none;align-items:center;gap:1rem;padding:0.75rem 1.5rem;background:var(--bg-medium);border-radius:50px;border:1px solid var(--glass-border)}
          .repo-path{font-family:Monaco,monospace;font-size:0.9rem;color:var(--text-secondary)}
          .change-btn{background:transparent;border:1px solid var(--glass-border);color:var(--text-secondary);padding:0.5rem 1rem;border-radius:50px;cursor:pointer;transition:all 0.3s;font-size:0.85rem}
          .change-btn:hover{border-color:var(--primary);color:var(--primary)}
          .container{max-width:1400px;margin:0 auto;padding:3rem 2rem}
          .hero{text-align:center;padding:4rem 0;margin-bottom:3rem}
          .hero h1{font-size:3.5rem;font-weight:800;margin-bottom:1.5rem}
          .hero p{font-size:1.3rem;color:var(--text-secondary);max-width:700px;margin:0 auto}
          .stats-bar{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;margin-bottom:3rem}
          .stat-card{background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:20px;padding:2rem;text-align:center;transition:all 0.3s;cursor:pointer}
          .stat-card:hover{transform:translateY(-5px);border-color:var(--primary);box-shadow:0 10px 40px rgba(99,102,241,0.2)}
          .stat-value{font-size:2.5rem;font-weight:800;background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:0.5rem}
          .stat-label{color:var(--text-secondary);font-size:0.9rem;text-transform:uppercase;letter-spacing:1px}
          .api-badge{display:inline-block;padding:0.25rem 0.75rem;background:var(--success);color:white;border-radius:50px;font-size:0.7rem;margin-top:0.5rem;font-weight:600}
          .api-badge.mock{background:var(--warning)}
          .tools-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:2rem}
          .tool-card{background:var(--glass-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:24px;padding:2.5rem;transition:all 0.4s;cursor:pointer;position:relative;overflow:hidden}
          .tool-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--primary),var(--secondary));transform:scaleX(0);transition:transform 0.4s}
          .tool-card:hover::before{transform:scaleX(1)}
          .tool-card:hover{transform:translateY(-10px);border-color:var(--primary);box-shadow:0 20px 60px rgba(99,102,241,0.3)}
          .tool-header{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}
          .tool-icon{width:60px;height:60px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;background:linear-gradient(135deg,var(--primary),var(--primary-dark));box-shadow:0 8px 20px rgba(99,102,241,0.3);transition:all 0.3s}
          .tool-card:hover .tool-icon{transform:rotate(10deg) scale(1.1)}
          .tool-title{font-size:1.5rem;font-weight:700;margin-bottom:0.5rem}
          .tool-subtitle{color:var(--text-secondary);font-size:0.9rem}
          .tool-description{color:var(--text-secondary);line-height:1.7;margin-bottom:1.5rem}
          .tool-metrics{display:flex;gap:1rem;margin-bottom:1.5rem}
          .metric{flex:1;padding:1rem;background:var(--bg-medium);border-radius:12px;border:1px solid var(--glass-border);transition:all 0.3s}
          .metric:hover{background:var(--bg-light);transform:scale(1.05)}
          .metric-value{font-size:1.5rem;font-weight:700;margin-bottom:0.25rem}
          .metric-label{font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase}
          .tool-actions{display:flex;gap:1rem;margin-top:1.5rem}
          .btn{flex:1;padding:0.875rem 1.5rem;border:none;border-radius:12px;font-weight:600;cursor:pointer;transition:all 0.3s;font-size:0.95rem;display:flex;align-items:center;justify-content:center;gap:0.5rem}
          .btn-primary{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;box-shadow:0 4px 15px rgba(99,102,241,0.3)}
          .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(99,102,241,0.5)}
          .btn-secondary{background:var(--bg-medium);color:var(--text-primary);border:1px solid var(--glass-border)}
          .btn-secondary:hover{background:var(--bg-light);border-color:var(--primary)}
          .insight-list{list-style:none}
          .insight-item{padding:1rem;margin-bottom:0.75rem;background:var(--bg-medium);border-radius:12px;border-left:4px solid var(--primary);transition:all 0.3s;cursor:pointer;display:flex;align-items:center;gap:1rem}
          .insight-item:hover{background:var(--bg-light);transform:translateX(8px)}
          .insight-icon{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:1.2rem}
          .insight-content{flex:1}
          .insight-title{font-weight:600;margin-bottom:0.25rem}
          .insight-description{font-size:0.85rem;color:var(--text-secondary)}
          .lang-bar{display:flex;height:8px;border-radius:10px;overflow:hidden;margin:1rem 0}
          .lang-segment{height:100%;transition:all 0.3s}
          .lang-legend{display:flex;flex-wrap:wrap;gap:1rem;margin-top:1rem}
          .lang-item{display:flex;align-items:center;gap:0.5rem;font-size:0.85rem}
          .lang-dot{width:12px;height:12px;border-radius:50%}
          .error-msg{background:var(--danger);color:white;padding:1rem;border-radius:12px;margin:1rem 0;display:none}
          .error-msg.show{display:block;animation:shake 0.5s}
          @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
          footer{text-align:center;padding:3rem 2rem;color:var(--text-secondary);border-top:1px solid var(--glass-border);margin-top:4rem}
          .endpoint-info{background:var(--bg-medium);padding:1rem;border-radius:12px;margin:1rem 0;font-family:Monaco,monospace;font-size:0.85rem}
          .endpoint-label{color:var(--primary);font-weight:600;margin-bottom:0.5rem}
          .endpoint-url{color:var(--text-secondary);word-break:break-all}
          @media (max-width:768px){.header-content{flex-direction:column}.search-container{width:100%;max-width:100%}.landing-title{font-size:2.5rem}.tools-grid{grid-template-columns:1fr}.stats-bar{grid-template-columns:repeat(2,1fr)}}
        `}</style>
      </Head>

      <div className="animated-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      <header id="header">
        <div className="header-content">
          <div className="logo"><div className="logo-icon">🔮</div>GithubMonster</div>
          <div className="search-container">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input type="text" id="repoInput" placeholder="Paste GitHub URL or owner/repo..." autoComplete="off" />
              <button className="analyze-btn" id="analyzeBtn" onClick={() => analyze()}><span>⚡</span><span>Analyze</span></button>
            </div>
            <div className="suggestions" id="suggestions">
              <div className="suggestion-item" onClick={() => load('facebook/react')}>
                <span className="suggestion-icon">⚛️</span>
                <div className="suggestion-content"><div className="suggestion-title">React</div><div className="suggestion-url">facebook/react</div></div>
              </div>
              <div className="suggestion-item" onClick={() => load('microsoft/vscode')}>
                <span className="suggestion-icon">💻</span>
                <div className="suggestion-content"><div className="suggestion-title">VS Code</div><div className="suggestion-url">microsoft/vscode</div></div>
              </div>
              <div className="suggestion-item" onClick={() => load('vercel/next.js')}>
                <span className="suggestion-icon">▲</span>
                <div className="suggestion-content"><div className="suggestion-title">Next.js</div><div className="suggestion-url">vercel/next.js</div></div>
              </div>
            </div>
            <div className="error-msg" id="errorMsg"></div>
          </div>
          <div className="repo-info" id="repoInfo">
            <span>📦</span><span className="repo-path" id="repoPath"></span>
            <button className="change-btn" onClick={() => showLanding()}>Change</button>
          </div>
        </div>
      </header>

      <div className="landing-screen" id="landing">
        <h1 className="landing-title">🔮 Repository Intelligence</h1>
        <p className="landing-subtitle">Unlock deep insights from any GitHub repository with AI-powered analysis</p>
        <div className="landing-search">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" id="landingInput" placeholder="https://github.com/browser-use/browser-use" autoComplete="off" />
            <button className="analyze-btn" id="landingBtn" onClick={() => analyzeLanding()}><span>⚡</span><span>Analyze Now</span></button>
          </div>
          <div className="error-msg" id="landingError"></div>
        </div>
        <div className="popular-repos">
          <div className="popular-title">Popular Repositories</div>
          <div className="repo-chips">
            <div className="repo-chip" onClick={() => load('facebook/react')}><span>⚛️</span><span>facebook/react</span></div>
            <div className="repo-chip" onClick={() => load('microsoft/vscode')}><span>💻</span><span>microsoft/vscode</span></div>
            <div className="repo-chip" onClick={() => load('vercel/next.js')}><span>▲</span><span>vercel/next.js</span></div>
            <div className="repo-chip" onClick={() => load('nodejs/node')}><span>🟢</span><span>nodejs/node</span></div>
            <div className="repo-chip" onClick={() => load('tensorflow/tensorflow')}><span>🧠</span><span>tensorflow/tensorflow</span></div>
            <div className="repo-chip" onClick={() => load('browser-use/browser-use')}><span>🌐</span><span>browser-use/browser-use</span></div>
          </div>
        </div>
      </div>

      <div className="main-content" id="main">
        <div className="container">
          <section className="hero">
            <h1>Repository Intelligence Dashboard</h1>
            <p>Advanced analytics and insights powered by AI</p>
          </section>

          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-value" id="loc">0</div>
              <div className="stat-label">Lines of Code</div>
              <span className="api-badge">REAL DATA</span>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="contrib">0</div>
              <div className="stat-label">Contributors</div>
              <span className="api-badge">REAL DATA</span>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="health">0</div>
              <div className="stat-label">Health Score</div>
              <span className="api-badge">REAL DATA</span>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="age">0</div>
              <div className="stat-label">Days Active</div>
              <span className="api-badge">REAL DATA</span>
            </div>
          </div>

          <div className="tool-card" style={{marginBottom:"2rem"}}>
            <div className="tool-header">
              <div className="tool-icon">📊</div>
              <div><h3 className="tool-title">Repository Overview</h3><p className="tool-subtitle">Real GitHub Data</p></div>
            </div>
            <div className="tool-metrics">
              <div className="metric"><div className="metric-value" id="stars">0</div><div className="metric-label">Stars</div></div>
              <div className="metric"><div className="metric-value" id="forks">0</div><div className="metric-label">Forks</div></div>
              <div className="metric"><div className="metric-value" id="issues">0</div><div className="metric-label">Open Issues</div></div>
              <div className="metric"><div className="metric-value" id="watchers">0</div><div className="metric-label">Watchers</div></div>
            </div>
            <div className="lang-bar" id="langBar"></div>
            <div className="lang-legend" id="langLegend"></div>
          </div>

          <div className="tools-grid">
            <div className="tool-card" data-tool="archaeology">
              <div className="tool-header">
                <div className="tool-icon">🏛️</div>
                <div><h3 className="tool-title">CodeArchaeology</h3><p className="tool-subtitle">Decision Evolution Tracker</p></div>
              </div>
              <p className="tool-description">Traces architectural decisions across commits, PRs, and discussions.</p>
              <div className="endpoint-info">
                <div className="endpoint-label">Backend Endpoint:</div>
                <div className="endpoint-url">POST /api/tools/archaeology</div>
              </div>
              <ul className="insight-list">
                <li className="insight-item"><div className="insight-icon">🔄</div><div className="insight-content"><div className="insight-title">Auth System Redesign</div><div className="insight-description">Needs git commit analysis + PR parsing</div></div></li>
                <li className="insight-item"><div className="insight-icon">💾</div><div className="insight-content"><div className="insight-title">Database Migration</div><div className="insight-description">Requires issue tracking integration</div></div></li>
              </ul>
              <div className="tool-actions"><button className="btn btn-primary" onClick={() => showToolModal('archaeology')}>🔍 Run Tool</button><button className="btn btn-secondary">📊 View Report</button></div>
            </div>

            <div className="tool-card" data-tool="learning">
              <div className="tool-header">
                <div className="tool-icon">🎓</div>
                <div><h3 className="tool-title">Learning Path Generator</h3><p className="tool-subtitle">AI-Powered Onboarding</p></div>
              </div>
              <p className="tool-description">AI-generated learning paths for new contributors.</p>
              <div className="endpoint-info">
                <div className="endpoint-label">Backend Endpoint:</div>
                <div className="endpoint-url">POST /api/tools/learning-path</div>
              </div>
              <ul className="insight-list">
                <li className="insight-item"><div className="insight-icon">✅</div><div className="insight-content"><div className="insight-title">Code Complexity Analysis</div><div className="insight-description">Needs AST parsing + AI ranking</div></div></li>
                <li className="insight-item"><div className="insight-icon">✅</div><div className="insight-content"><div className="insight-title">Dependency Graph</div><div className="insight-description">Requires module analysis</div></div></li>
              </ul>
              <div className="tool-actions"><button className="btn btn-primary" onClick={() => showToolModal('learning')}>🚀 Run Tool</button><button className="btn btn-secondary">📝 View Path</button></div>
            </div>

            <div className="tool-card" data-tool="debt">
              <div className="tool-header">
                <div className="tool-icon">💰</div>
                <div><h3 className="tool-title">Technical Debt ROI</h3><p className="tool-subtitle">Business Impact Calculator</p></div>
              </div>
              <p className="tool-description">Quantifies technical debt in business terms.</p>
              <div className="endpoint-info">
                <div className="endpoint-label">Backend Endpoint:</div>
                <div className="endpoint-url">POST /api/tools/tech-debt</div>
              </div>
              <div className="tool-metrics">
                <div className="metric"><div className="metric-value" style={{color:"var(--danger)"}}>API</div><div className="metric-label">SonarQube</div></div>
                <div className="metric"><div className="metric-value" style={{color:"var(--warning)"}}>ML</div><div className="metric-label">Cost Model</div></div>
                <div className="metric"><div className="metric-value" style={{color:"var(--success)"}}>AI</div><div className="metric-label">ROI Calc</div></div>
              </div>
              <div className="tool-actions"><button className="btn btn-primary" onClick={() => showToolModal('debt')}>📈 Run Tool</button><button className="btn btn-secondary">💡 View ROI</button></div>
            </div>

            <div className="tool-card" data-tool="blast">
              <div className="tool-header">
                <div className="tool-icon">💣</div>
                <div><h3 className="tool-title">Blast Radius Simulator</h3><p className="tool-subtitle">Change Impact Predictor</p></div>
              </div>
              <p className="tool-description">Visualize cascade effects before changes.</p>
              <div className="endpoint-info">
                <div className="endpoint-label">Backend Endpoint:</div>
                <div className="endpoint-url">POST /api/tools/blast-radius</div>
              </div>
              <div className="tool-metrics">
                <div className="metric"><div className="metric-value" style={{color:"var(--warning)"}}>Graph</div><div className="metric-label">Dependency</div></div>
                <div className="metric"><div className="metric-value" style={{color:"var(--primary)"}}>AST</div><div className="metric-label">Parser</div></div>
                <div className="metric"><div className="metric-value" style={{color:"var(--success)"}}>ML</div><div className="metric-label">Impact</div></div>
              </div>
              <div className="tool-actions"><button className="btn btn-primary" onClick={() => showToolModal('blast')}>🎯 Run Tool</button><button className="btn btn-secondary">📋 View Impact</button></div>
            </div>

            <div className="tool-card" data-tool="health">
              <div className="tool-header">
                <div className="tool-icon">❤️</div>
                <div><h3 className="tool-title">Health Score</h3><p className="tool-subtitle">Comprehensive Analysis</p></div>
              </div>
              <p className="tool-description">Multi-dimensional repository health assessment.</p>
              <div className="endpoint-info">
                <div className="endpoint-label">Backend Endpoint:</div>
                <div className="endpoint-url">POST /api/tools/health-score</div>
              </div>
              <div className="tool-metrics">
                <div className="metric"><div className="metric-value" style={{color:"var(--success)"}}>87</div><div className="metric-label">Score</div></div>
                <div className="metric"><div className="metric-value" style={{color:"var(--primary)"}}>92</div><div className="metric-label">Code</div></div>
                <div className="metric"><div className="metric-value" style={{color:"var(--warning)"}}>85</div><div className="metric-label">Collab</div></div>
                <div className="metric"><div className="metric-value" style={{color:"var(--secondary)"}}>78</div><div className="metric-label">Docs</div></div>
              </div>
              <div className="tool-actions"><button className="btn btn-primary" onClick={() => showToolModal('health')}>📊 Run Tool</button><button className="btn btn-secondary">📋 View Full</button></div>
            </div>

            <div className="tool-card" data-tool="equity">
              <div className="tool-header">
                <div className="tool-icon">⚖️</div>
                <div><h3 className="tool-title">Contribution Equity</h3><p className="tool-subtitle">Value Recognition</p></div>
              </div>
              <p className="tool-description">Identifies undervalued contributions beyond commits.</p>
              <div className="endpoint-info">
                <div className="endpoint-label">Backend Endpoint:</div>
                <div className="endpoint-url">POST /api/tools/contribution-equity</div>
              </div>
              <ul className="insight-list">
                <li className="insight-item"><div className="insight-icon">📝</div><div className="insight-content"><div className="insight-title">Documentation</div><div className="insight-description">Worth 2.5x regular commits</div></div></li>
                <li className="insight-item"><div className="insight-icon">🔍</div><div className="insight-content"><div className="insight-title">Code Reviews</div><div className="insight-description">Prevents critical bugs</div></div></li>
              </ul>
              <div className="tool-actions"><button className="btn btn-primary" onClick={() => showToolModal('equity')}>🔍 Run Tool</button><button className="btn btn-secondary">🏆 View Scores</button></div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>GithubMonster - AI-Powered Repository Intelligence Platform</p>
        <p>Backend API endpoints available at: POST /api/tools/[tool-name]</p>
      </footer>

      <script dangerouslySetInnerHTML={{__html: `
        // JavaScript functionality for the frontend
        let currentRepo = '';
        const tools = {
          archaeology: { name: 'CodeArchaeology', endpoint: '/api/tools/archaeology' },
          learning: { name: 'Learning Path Generator', endpoint: '/api/tools/learning-path' },
          debt: { name: 'Technical Debt ROI', endpoint: '/api/tools/tech-debt' },
          blast: { name: 'Blast Radius Simulator', endpoint: '/api/tools/blast-radius' },
          health: { name: 'Health Score', endpoint: '/api/tools/health-score' },
          equity: { name: 'Contribution Equity', endpoint: '/api/tools/contribution-equity' }
        };

        // Add event listeners
        document.addEventListener('DOMContentLoaded', function() {
          const header = document.getElementById('header');
          const repoInput = document.getElementById('repoInput');
          const landingInput = document.getElementById('landingInput');

          // Header scroll effect
          window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
              header.classList.add('scrolled');
            } else {
              header.classList.remove('scrolled');
            }
          });

          // Input event handlers for suggestions
          repoInput.addEventListener('input', showSuggestions);
          landingInput.addEventListener('input', showLandingSuggestions);

          // Click outside to hide suggestions
          document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
              document.getElementById('suggestions').classList.remove('active');
            }
          });
        });

        function showSuggestions() {
          const input = document.getElementById('repoInput').value.toLowerCase();
          const suggestions = document.getElementById('suggestions');

          if (input.length > 1) {
            suggestions.classList.add('active');
          } else {
            suggestions.classList.remove('active');
          }
        }

        function showLandingSuggestions() {
          const input = document.getElementById('landingInput').value.toLowerCase();
          const suggestions = document.getElementById('suggestions');

          if (input.length > 1) {
            suggestions.classList.add('active');
          } else {
            suggestions.classList.remove('active');
          }
        }

        function load(repo) {
          document.getElementById('repoInput').value = repo;
          document.getElementById('landingInput').value = repo;
          document.getElementById('suggestions').classList.remove('active');
        }

        async function analyze() {
          const repo = document.getElementById('repoInput').value.trim();
          await runAnalysis(repo);
        }

        async function analyzeLanding() {
          const repo = document.getElementById('landingInput').value.trim();
          await runAnalysis(repo);
        }

        async function runAnalysis(inputRepo) {
          if (!inputRepo) {
            showError('Please enter a repository');
            return;
          }

          // Parse repository from URL or owner/repo format
          let repo = inputRepo.trim();
          
          // If it's a full GitHub URL, extract owner/repo
          if (repo.includes('github.com')) {
            const urlMatch = repo.match(/github\\.com\\/([a-zA-Z0-9_.-]+)\\/([a-zA-Z0-9_.-]+)/);
            if (urlMatch) {
              repo = urlMatch[1] + '/' + urlMatch[2];
            }
          }

          // Validate repository format
          const repoPattern = /^[a-zA-Z0-9_.-]+\\/[a-zA-Z0-9_.-]+$/;
          if (!repoPattern.test(repo)) {
            showError('Invalid repository format. Please use owner/repo format (e.g., facebook/react) or paste a GitHub URL');
            return;
          }

          // Show loading state
          const btn = document.getElementById('analyzeBtn');
          btn.innerHTML = '<span class="loading-spinner"></span><span>Analyzing</span>';
          btn.disabled = true;

          try {
            // Show main content and hide landing
            document.getElementById('landing').classList.add('hidden');
            document.getElementById('main').classList.add('active');
            document.getElementById('repoInfo').style.display = 'flex';
            document.getElementById('repoPath').textContent = repo;
            currentRepo = repo;

            // Call the backend API to get repository statistics
            const response = await fetch('/api/repo-stats', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                repo: repo,
                timeRange: '3m',
                includeIssues: true,
                includePRs: true
              })
            });

            if (!response.ok) {
              throw new Error('API call failed: ' + response.status + ' ' + response.statusText);
            }

            const data = await response.json();

            // Update stats with real data from API
            document.getElementById('loc').textContent = data.linesOfCode.toLocaleString();
            document.getElementById('contrib').textContent = data.contributors;
            document.getElementById('health').textContent = data.healthScore;
            document.getElementById('age').textContent = data.ageInDays;
            document.getElementById('stars').textContent = data.stars.toLocaleString();
            document.getElementById('forks').textContent = data.forks.toLocaleString();
            document.getElementById('issues').textContent = data.openIssues;
            document.getElementById('watchers').textContent = data.watchers;

            // Add language breakdown visualization if available
            if (data.languageBreakdown) {
              renderLanguageBreakdown(data.languageBreakdown);
            }

            // Reset button
            btn.innerHTML = '<span>⚡</span><span>Analyze</span>';
            btn.disabled = false;

          } catch (error) {
            showError(error.message);
            btn.innerHTML = '<span>⚡</span><span>Analyze</span>';
            btn.disabled = false;
          }
        }

        function renderLanguageBreakdown(languages) {
          // Calculate total bytes across all languages
          const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

          // Define colors for common languages (could be expanded)
          const languageColors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'Java': '#b07219',
            'TypeScript': '#2b7489',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'C++': '#f34b7d',
            'C': '#555555',
            'Shell': '#89e051',
            'C#': '#178600',
            'Go': '#00ADD8',
            'Swift': '#ffac45',
            'Rust': '#dea584',
            'Kotlin': '#F18E33',
            'Scala': '#c22d40',
            'R': '#198ce7',
            'Dart': '#00B4AB',
            'Elixir': '#6e4a7e',
            'Vue': '#41b883',
            'Svelte': '#ff3e00'
          };

          // Get language names and sort by size
          const sortedLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5 languages

          // Create the language breakdown visualization
          const langBar = document.getElementById('langBar');
          const langLegend = document.getElementById('langLegend');
          langBar.innerHTML = '';
          langLegend.innerHTML = '';

          if (sortedLanguages.length > 0) {
            // Create the bar
            sortedLanguages.forEach(([lang, bytes]) => {
              const percentage = (bytes / totalBytes) * 100;
              const segment = document.createElement('div');
              segment.className = 'lang-segment';
              segment.style.width = percentage + '%';
              segment.style.backgroundColor = languageColors[lang] || '#888888'; // Default color if not defined
              segment.title = lang + ': ' + percentage.toFixed(1) + '%';
              langBar.appendChild(segment);
            });

            // Create the legend
            sortedLanguages.forEach(([lang, bytes]) => {
              const percentage = (bytes / totalBytes) * 100;
              const langItem = document.createElement('div');
              langItem.className = 'lang-item';

              const langDot = document.createElement('div');
              langDot.className = 'lang-dot';
              langDot.style.backgroundColor = languageColors[lang] || '#888888';

              const langText = document.createElement('span');
              langText.textContent = lang + ' ' + percentage.toFixed(1) + '%';

              langItem.appendChild(langDot);
              langItem.appendChild(langText);
              langLegend.appendChild(langItem);
            });
          } else {
            langBar.textContent = 'No language data available';
          }
        }

        function showError(message) {
          document.getElementById('errorMsg').textContent = message;
          document.getElementById('errorMsg').classList.add('show');
          document.getElementById('landingError').textContent = message;
          document.getElementById('landingError').classList.add('show');

          setTimeout(() => {
            document.getElementById('errorMsg').classList.remove('show');
            document.getElementById('landingError').classList.remove('show');
          }, 5000);
        }

        function showLanding() {
          document.getElementById('main').classList.remove('active');
          document.getElementById('repoInfo').style.display = 'none';
          document.getElementById('landing').classList.remove('hidden');
        }

        async function showToolModal(tool) {
          if (!currentRepo) {
            alert('Please enter a repository first');
            return;
          }

          const toolInfo = tools[tool];
          if (!toolInfo) {
            alert('Unknown tool: ' + tool);
            return;
          }

          const endpoint = toolInfo.endpoint;

          try {
            // Show loading state
            const button = event.target;
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="loading-spinner"></span><span>Running</span>';
            button.disabled = true;

            // Call the API
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                repo: currentRepo,
                // Add common parameters for each tool type
                ...(tool === 'health' && {
                  includeTeamMetrics: true,
                  timeRange: '3m'
                }),
                ...(tool === 'archaeology' && {
                  timeRange: '6m',
                  includeIssues: true,
                  includePRs: true
                }),
                ...(tool === 'learning' && {
                  experience: 'beginner',
                  focusArea: 'all',
                  timeCommitment: '10h/week'
                }),
                ...(tool === 'debt' && {
                  analysisDepth: 'standard',
                  includeTests: true,
                  includeDocs: true
                }),
                ...(tool === 'blast' && {
                  changeType: 'refactor',
                  targetFiles: ['src/index.js']
                }),
                ...(tool === 'equity' && {
                  timeRange: '6m',
                  includeReviews: true
                })
              })
            });

            if (!response.ok) {
              throw new Error('API call failed: ' + response.status + ' ' + response.statusText);
            }

            const result = await response.json();

            // Show a modal with results (simplified implementation)
            alert('Successfully ran ' + toolInfo.name + '!\\n\\nResponse preview:\\n' + JSON.stringify(result, null, 2).substring(0, 200) + '...');

          } catch (error) {
            alert('Error running ' + toolInfo.name + ': ' + error.message);
            console.error('API call failed:', error);
          } finally {
            // Restore button state
            const button = event.target;
            button.innerHTML = originalText;
            button.disabled = false;
          }
        }
      `}} />
    </div>
  );
}
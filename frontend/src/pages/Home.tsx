import "../styles/home.styles.css";

export default function Home() {
    return (
        <div className="home-container">

            {/* Hero Section */}
            <section className="hero-section">
                <span className="hero-tag">Live &amp; Asynchronous Polling</span>
                <h1 className="hero-title">
                    Gather opinions.<br />Make decisions, fast.
                </h1>
                <p className="hero-subtitle">
                    PollFlow is a focused polling platform — create, publish, and analyze responses in minutes. No noise, just answers.
                </p>
                <div className="hero-actions">
                    <p className="btn btn-primary">Create a Poll</p>
                    <p className="btn btn-outline">View Dashboard</p>
                </div>
            </section>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-item">
                    <span className="stat-number">10k+</span>
                    <span className="stat-label">Polls Created</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">Uptime</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">Real-time</span>
                    <span className="stat-label">Analytics</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">2 Modes</span>
                    <span className="stat-label">Auth & Anonymous</span>
                </div>
            </div>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <span className="section-eyebrow">How it works</span>
                    <h2 className="section-title">Simple lifecycle. Clear results.</h2>
                    <p className="section-subtitle">
                        From question to insight in four clean steps.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <span className="feature-step">Step 01</span>
                        <div className="feature-icon">🛠️</div>
                        <h3 className="feature-title">Build Your Poll</h3>
                        <p className="feature-description">
                            Design questions with flexible types — multiple choice, single select, or open text. Set expiry, access modes, and ordering.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-step">Step 02</span>
                        <div className="feature-icon">🚀</div>
                        <h3 className="feature-title">Publish &amp; Share</h3>
                        <p className="feature-description">
                            Go live with one click. Share a clean link with your team, classroom, or community for immediate participation.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-step">Step 03</span>
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Live Analytics</h3>
                        <p className="feature-description">
                            Watch votes stream in real time. Track turnout, response breakdowns, and participation metrics as they happen.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-step">Step 04</span>
                        <div className="feature-icon">📣</div>
                        <h3 className="feature-title">Publish Insights</h3>
                        <p className="feature-description">
                            Summarize results and broadcast final outcomes back to your respondents with a single action.
                        </p>
                    </div>
                </div>
            </section>

            {/* Create Poll CTA */}
            <section className="cta-section">
                <h2 className="cta-title">Ready to launch your next poll?</h2>
                <p className="cta-subtitle">
                    Set up your first poll in seconds and start collecting meaningful feedback immediately.
                </p>
                <p className="btn btn-light">Create Poll Now</p>
            </section>

        </div>
    );
}

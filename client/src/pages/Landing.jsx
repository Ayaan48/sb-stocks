import { Link } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaHistory, FaRocket, FaBriefcase, FaBolt } from 'react-icons/fa';
import './Landing.css';

const features = [
  { icon: <FaChartLine />, title: 'Real-Time Market Data', desc: 'Live US stock prices and market trends for accurate trading simulations.' },
  { icon: <FaHistory />,   title: 'Historical Trends',    desc: 'Access stock performance history to analyze and test strategies effectively.' },
  { icon: <FaBriefcase />, title: 'Virtual Portfolios',   desc: 'Create and manage multiple portfolios with diverse stocks, track P&L.' },
  { icon: <FaBolt />,      title: 'Paper Trading',        desc: 'Practice buying and selling with $10,000 virtual funds — zero financial risk.' },
  { icon: <FaShieldAlt />, title: 'Secure & Private',     desc: 'Your data is encrypted and protected with industry-standard security.' },
  { icon: <FaRocket />,    title: 'Strategy Testing',     desc: 'Refine trading strategies using real market dynamics without real money.' },
];

const Landing = () => (
  <div className="landing">
    <nav className="landing-nav container">
      <div className="brand"><FaChartLine /> SB Stocks</div>
      <div className="nav-cta">
        <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
        <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
      </div>
    </nav>

    <section className="hero">
      <div className="hero-inner container">
        <div className="hero-text">
          <span className="hero-badge">Paper Trading Platform</span>
          <h1>Practice Trading.<br />Build Confidence.</h1>
          <p>
            Simulate buying and selling US stocks with $10,000 in virtual funds.
            Real market data. Zero financial risk.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary">Start Trading Free</Link>
            <Link to="/login"    className="btn btn-outline">Sign In</Link>
          </div>
          <p className="hero-note">No credit card required. Instant access.</p>
        </div>
        <div className="hero-visual">
          <div className="mock-chart">
            <div className="mock-ticker">
              <span className="tick-sym">AAPL</span>
              <span className="tick-price">$189.30</span>
              <span className="tick-change positive">+1.24%</span>
            </div>
            <div className="mock-bars">
              {[40,60,45,80,65,90,75,100,85,110].map((h,i) => (
                <div key={i} className="mock-bar" style={{ height: h + 'px' }} />
              ))}
            </div>
          </div>
          <div className="mock-stats">
            <div className="mock-stat"><span>Portfolio</span><strong>$12,450</strong></div>
            <div className="mock-stat"><span>Today's P&L</span><strong className="positive">+$340</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section className="features-section container">
      <h2>Everything you need to learn trading</h2>
      <p className="features-sub">A complete paper trading platform powered by real market data.</p>
      <div className="grid-3 features-grid">
        {features.map(f => (
          <div key={f.title} className="feature-card card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="cta-section">
      <div className="container">
        <h2>Ready to start your trading journey?</h2>
        <p>Join thousands of traders practicing with SB Stocks.</p>
        <Link to="/register" className="btn btn-primary">Create Free Account</Link>
      </div>
    </section>

    <footer className="landing-footer">
      <p>© 2024 SB Stocks · Paper Trading Platform · For educational purposes only</p>
    </footer>
  </div>
);

export default Landing;

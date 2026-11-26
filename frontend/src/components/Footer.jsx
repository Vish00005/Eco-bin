import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">♻️</div>
            <span className="logo-text">EcoBin</span>
          </div>
          <p className="footer-tagline">
            Making e-waste recycling simple, rewarding, and transparent for everyone.
          </p>
          <p className="footer-motto">🌱 Saving the planet, one device at a time</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/find-bin">Find a Bin</Link>
            </li>
            <li>
              <Link to="/recycle">Drop E-Waste</Link>
            </li>
            <li>
              <Link to="/rewards">Rewards</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <ul className="footer-links">
            <li>
              <a href="/#how-it-works">How It Works</a>
            </li>
            <li>
              <a href="/#items">E-Waste Guide</a>
            </li>
            <li>
              <a href="/#impact">Environmental Impact</a>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul className="footer-contact">
            <li>📧 Ecobin@gmail.com</li>
            <li>📞 +91 1234567890</li>
            <li>📍 Gujarat, India</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 EcoBin. All rights reserved.</p>
        <p>
          Made with YV<sup>2</sup> for a greener future
        </p>
      </div>
    </footer>
  );
}

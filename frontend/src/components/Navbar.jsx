import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          ♻️ EcoBin
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={closeMenu}
            >
              <i className="fa-solid fa-house" /> Home
            </NavLink>
            <NavLink
              to="/find-bin"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={closeMenu}
            >
              <i className="fa-solid fa-location-dot" /> Find Bin
            </NavLink>
            <NavLink
              to="/recycle"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={closeMenu}
            >
              <i className="fa-solid fa-qrcode" /> Recycle
            </NavLink>
            <NavLink
              to="/rewards"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={closeMenu}
            >
              <i className="fa-solid fa-trophy" /> Rewards
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={closeMenu}
            >
              <i className="fa-solid fa-chart-line" /> About Us
            </NavLink>
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <Link className="btn-admin" to="/dashboard" onClick={closeMenu}>
                  Dashboard
                </Link>
                <Link className="btn-profile" to="/profile" onClick={closeMenu}>
                  {user.firstname || "Profile"}
                </Link>
              </>
            ) : (
              <Link className="btn-profile" to="/login" onClick={closeMenu}>
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

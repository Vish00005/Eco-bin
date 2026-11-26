import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

function getPasswordStrength(password) {
  if (!password) {
    return { width: "0%", color: "#6b7280", text: "Password strength", fill: "transparent" };
  }
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 12.5;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;

  if (strength <= 25) return { width: `${strength}%`, fill: "#ef4444", color: "#ef4444", text: "Weak password" };
  if (strength <= 50) return { width: `${strength}%`, fill: "#f59e0b", color: "#f59e0b", text: "Fair password" };
  if (strength <= 75) return { width: `${strength}%`, fill: "#3b82f6", color: "#3b82f6", text: "Good password" };
  return { width: `${strength}%`, fill: "#10b981", color: "#10b981", text: "Strong password" };
}

export default function Login() {
  const [mode, setMode] = useState("login");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const strength = getPasswordStrength(signupData.password);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await login(loginData.email, loginData.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (!err.response) {
        setError("Cannot reach server. Check VITE_API_URL and backend status.");
      } else {
        setError(
          err.response?.data?.error ||
            `Login failed (${err.response.status}). Check VITE_API_URL on Vercel.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        firstname: signupData.firstname,
        lastname: signupData.lastname,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
      });
      setSuccess("Account created successfully!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (!err.response) {
        setError("Cannot reach server. Check VITE_API_URL and backend status.");
      } else {
        setError(
          err.response?.data?.error ||
            `Signup failed (${err.response.status}). Check VITE_API_URL on Vercel.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page" style={{ paddingTop: "70px" }}>
      <div className="container">
        <div className="left-panel">
          <div className="branding">
            <div className="logo">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <rect width="60" height="60" rx="12" fill="url(#gradient1)" />
                <path d="M30 15L20 25H25V35H35V25H40L30 15Z" fill="white" />
                <rect x="18" y="38" width="24" height="6" rx="2" fill="white" />
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="60" y2="60">
                    <stop offset="0%" style={{ stopColor: "#10b981" }} />
                    <stop offset="100%" style={{ stopColor: "#059669" }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>Smart E-Waste Bin System</h1>
            <p className="tagline">
              Revolutionizing electronic waste management through AI and smart technology
            </p>

            <div className="features">
              <div className="feature-item">
                <div className="feature-icon">📍</div>
                <div className="feature-text">
                  <h3>Location-Based Bins</h3>
                  <p>Find the nearest e-waste bin instantly</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <div className="feature-text">
                  <h3>AI-Powered Detection</h3>
                  <p>Automatic waste classification and sorting</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌍</div>
                <div className="feature-text">
                  <h3>Eco-Friendly Impact</h3>
                  <p>Track your environmental contribution</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="form-container">
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {mode === "login" ? (
              <div className="form-wrapper active">
                <div className="form-header">
                  <h2>Welcome Back</h2>
                  <p>Sign in to continue to your account</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="login-email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="login-email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showLoginPass ? "text" : "password"}
                        id="login-password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowLoginPass((v) => !v)}
                      >
                        <i className={`fa-solid ${showLoginPass ? "fa-eye-slash" : "fa-eye"}`} />
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                <div className="form-footer">
                  <p>
                    Don&apos;t have an account?{" "}
                    <a
                      href="#signup"
                      onClick={(e) => {
                        e.preventDefault();
                        setError("");
                        setMode("signup");
                      }}
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="form-wrapper active">
                <div className="form-header">
                  <h2>Create Account</h2>
                  <p>Join us in making the world cleaner</p>
                </div>

                <form onSubmit={handleSignupSubmit} className="auth-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="signup-firstname">First Name</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="signup-firstname"
                          placeholder="John"
                          value={signupData.firstname}
                          onChange={(e) =>
                            setSignupData({ ...signupData, firstname: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="signup-lastname">Last Name</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="signup-lastname"
                          placeholder="Doe"
                          value={signupData.lastname}
                          onChange={(e) =>
                            setSignupData({ ...signupData, lastname: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="signup-email"
                        placeholder="john.doe@example.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-phone">Phone Number</label>
                    <div className="input-wrapper">
                      <input
                        type="tel"
                        id="signup-phone"
                        placeholder="+91 98765 43210"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showSignupPass ? "text" : "password"}
                        id="signup-password"
                        placeholder="Create a strong password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowSignupPass((v) => !v)}
                      >
                        <i className={`fa-solid ${showSignupPass ? "fa-eye-slash" : "fa-eye"}`} />
                      </button>
                    </div>
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{ width: strength.width, background: strength.fill }}
                        />
                      </div>
                      <span className="strength-text" style={{ color: strength.color }}>
                        {strength.text}
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="signup-confirm-password">Confirm Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        id="signup-confirm-password"
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({ ...signupData, confirmPassword: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPass((v) => !v)}
                      >
                        <i className={`fa-solid ${showConfirmPass ? "fa-eye-slash" : "fa-eye"}`} />
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                <div className="form-footer">
                  <p>
                    Already have an account?{" "}
                    <a
                      href="#login"
                      onClick={(e) => {
                        e.preventDefault();
                        setError("");
                        setMode("login");
                      }}
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

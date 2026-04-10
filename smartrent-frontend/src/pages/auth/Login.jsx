import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginApi } from "../../services/authService";
import { ROLES } from "../../utils/constants";
import {
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
} from "react-icons/fa";

/*
 ┌──────────────────────────────────────────────────────┐
 │  TEST CREDENTIALS                                    │
 │  ─────────────────                                   │
 │  Tenant:   tenant@test.com   / password123           │
 │  Landlord: landlord@test.com / password123           │
 │  Admin:    admin@test.com    / password123            │
 └──────────────────────────────────────────────────────┘
*/
const TEST_USERS = {
  "tenant@test.com": {
    id: 100,
    fullName: "Alex Tenant",
    email: "tenant@test.com",
    role: ROLES.TENANT,
    profileImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
  },
  "landlord@test.com": {
    id: 101,
    fullName: "Sarah Landlord",
    email: "landlord@test.com",
    role: ROLES.LANDLORD,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  "admin@test.com": {
    id: 102,
    fullName: "Max Admin",
    email: "admin@test.com",
    role: ROLES.ADMIN,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
};

const TEST_PASSWORD = "password123";
const FAKE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dGVzdC10b2tlbi1wcm9waG9yaWE";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Call actual backend
      const result = await loginApi({ email, password });
      
      // Inject the token and user from backend into the context
      login(result.user, result.token);
      
      // Redirect based on role
      if (result.user.role === ROLES.LANDLORD) {
        navigate("/landlord/dashboard");
      } else if (result.user.role === ROLES.ADMIN) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password. Check the test credentials below."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (email) => {
    setEmail(email);
    setPassword(TEST_PASSWORD);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* ── Left: Branding Panel ── */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <FaBuilding className="auth-brand-logo-icon" />
              <span>Prophoria</span>
            </div>
            <h1 className="auth-brand-headline">
              Premium Living, <br />
              Simplified.
            </h1>
            <p className="auth-brand-text">
              Discover, manage, and experience premium rental properties — all
              in one beautifully crafted platform.
            </p>
          </div>
          <div className="auth-brand-shape auth-brand-shape-1" />
          <div className="auth-brand-shape auth-brand-shape-2" />
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">
              Sign in to your account to continue
            </p>

            {error && (
              <div className="auth-error" id="login-error">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} id="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Email Address
                </label>
                <div className="auth-input-wrapper">
                  <FaEnvelope className="auth-input-icon" />
                  <input
                    type="email"
                    id="login-email"
                    className="form-input auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <FaLock className="auth-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    className="form-input auth-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit-btn"
                disabled={isLoading}
                id="login-submit-btn"
              >
                {isLoading ? (
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                ) : (
                  <>
                    <FaSignInAlt /> Sign In
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              Don't have an account?{" "}
              <Link to="/register" className="auth-switch-link">
                Create Account
              </Link>
            </p>

            {/* ── Test Credentials Box ── */}
            <div className="auth-test-credentials" id="test-credentials">
              <div className="auth-test-header">
                <FaInfoCircle className="auth-test-icon" />
                <span>Quick Login — Test Accounts</span>
              </div>
              <div className="auth-test-accounts">
                <button
                  type="button"
                  className="auth-test-account"
                  onClick={() => quickLogin("tenant@test.com")}
                >
                  <span className="auth-test-role">Tenant</span>
                  <span className="auth-test-email">tenant@test.com</span>
                </button>
                <button
                  type="button"
                  className="auth-test-account"
                  onClick={() => quickLogin("landlord@test.com")}
                >
                  <span className="auth-test-role">Landlord</span>
                  <span className="auth-test-email">landlord@test.com</span>
                </button>
                <button
                  type="button"
                  className="auth-test-account"
                  onClick={() => quickLogin("admin@test.com")}
                >
                  <span className="auth-test-role">Admin</span>
                  <span className="auth-test-email">admin@test.com</span>
                </button>
              </div>
              <p className="auth-test-hint">
                Password for all: <code>password123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

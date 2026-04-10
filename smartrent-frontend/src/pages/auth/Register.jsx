import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { register as registerApi } from "../../services/authService";
import {
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaUser,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerApi(formData);
      login(result.user, result.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <FaBuilding className="auth-brand-logo-icon" />
              <span>Prophoria</span>
            </div>
            <h1 className="auth-brand-headline">
              Join the Premium <br /> Experience
            </h1>
            <p className="auth-brand-text">
              Create an account today to discover exclusive properties tailored perfectly to you.
            </p>
          </div>
          <div className="auth-brand-shape auth-brand-shape-1" />
          <div className="auth-brand-shape auth-brand-shape-2" />
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-subtitle">Register to unlock premium features</p>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="firstName">First Name</label>
                  <div className="auth-input-wrapper">
                    <FaUser className="auth-input-icon" />
                    <input type="text" id="firstName" className="form-input auth-input" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="lastName">Last Name</label>
                  <div className="auth-input-wrapper">
                    <FaUser className="auth-input-icon" />
                    <input type="text" id="lastName" className="form-input auth-input" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <div className="auth-input-wrapper">
                  <FaEnvelope className="auth-input-icon" />
                  <input type="email" id="email" className="form-input auth-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="auth-input-wrapper">
                  <FaLock className="auth-input-icon" />
                  <input type={showPassword ? "text" : "password"} id="password" className="form-input auth-input" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
                  <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit-btn" disabled={isLoading}>
                {isLoading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><FaUserPlus /> Register</>}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?{" "}
              <Link to="/login" className="auth-switch-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

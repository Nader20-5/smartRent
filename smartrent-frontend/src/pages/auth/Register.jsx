import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerService } from "../../services/authService";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "Tenant",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phoneNumber.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await registerService(formData);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.title || err.response?.data ||
        "Registration failed. Please try again.";
      setError(typeof message === "string" ? message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* ═══════ TOP BAR ═══════ */}
      <div className="register-topbar">
        <div className="register-topbar-logo">SmartRent</div>
        <Link to="/login" className="register-topbar-link">
          Already a member? <span>Sign In</span>
        </Link>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="register-content">
        <div className="register-card">
          {/* Card Header */}
          <div className="register-card-header">
            <h1>Create Your Account</h1>
            <p>Join thousands of users finding their perfect rental.</p>
          </div>

          {/* Step Indicator */}
          <div className="register-steps">
            <div className="register-step completed">
              <div className="register-step-number">✓</div>
              <span>Choose Role</span>
            </div>
            <div className="register-step-line active"></div>
            <div className="register-step active">
              <div className="register-step-number">2</div>
              <span>Your Details</span>
            </div>
            <div className="register-step-line"></div>
            <div className="register-step">
              <div className="register-step-number">3</div>
              <span>Done</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="register-card-body">
            {error && (
              <div className="reg-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#dc2626"/>
                  <path d="M8 4.5v4M8 10.5v.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="reg-success">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#16a34a"/>
                  <path d="M5 8.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {success}
              </div>
            )}

            <form className="register-form" onSubmit={handleSubmit}>
              {/* Row 1: Full Name + Role */}
              <div className="register-form-row">
                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="register-fullname">Full Name</label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input id="register-fullname" type="text" name="fullName" className="reg-form-input"
                      placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="register-role">I want to</label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                      </svg>
                    </span>
                    <select id="register-role" name="role" className="reg-form-select"
                      value={formData.role} onChange={handleChange} required>
                      <option value="Tenant">Rent a Property</option>
                      <option value="Landlord">List my Property</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Email + Phone */}
              <div className="register-form-row">
                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="register-email">Email Address</label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>
                      </svg>
                    </span>
                    <input id="register-email" type="email" name="email" className="reg-form-input"
                      placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="register-phone">Phone Number</label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <input id="register-phone" type="tel" name="phoneNumber" className="reg-form-input"
                      placeholder="+1 (555) 000-0000" value={formData.phoneNumber} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Row 3: Password (full width) */}
              <div className="reg-form-group full-width">
                <label className="reg-form-label" htmlFor="register-password">Password</label>
                <div className="reg-input-wrapper">
                  <span className="reg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input id="register-password" type={showPassword ? "text" : "password"} name="password"
                    className="reg-form-input has-right-icon" placeholder="Min. 6 characters"
                    value={formData.password} onChange={handleChange} required />
                  <button type="button" className="reg-input-icon-right"
                    onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="register-btn" disabled={isLoading || !!success} id="register-submit-btn">
                {isLoading ? <span className="reg-spinner"></span> : "Create Account"}
              </button>
            </form>

            <div className="register-terms">
              By creating an account, you agree to our{" "}
              <a href="#terms">Terms of Service</a> and{" "}
              <a href="#privacy">Privacy Policy</a>.
            </div>
          </div>
        </div>

        <div className="register-footer">
          <p className="register-footer-copy">© 2024 SmartRent. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;

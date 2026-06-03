import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Auth.css'
import {
  Briefcase,
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("jobseeker"); // 'jobseeker' | 'employer'
  const [form, setForm] = useState({
    displayName: "",
    company: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (role === "employer" && !form.company.trim()) {
      setError("Please enter your company name.");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        displayName: form.displayName,
        role,
        company: role === "employer" ? form.company : null,
      });
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Briefcase size={22} />
          CareJobs<strong>UK</strong>
        </Link>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join thousands of UK care professionals</p>

        {/* Role selector */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${role === "jobseeker" ? "active" : ""}`}
            onClick={() => setRole("jobseeker")}
          >
            <User size={18} />
            Job Seeker
          </button>
          <button
            type="button"
            className={`role-btn ${role === "employer" ? "active" : ""}`}
            onClick={() => setRole("employer")}
          >
            <Building2 size={18} />
            Employer
          </button>
        </div>

        <div className="role-description">
          {role === "jobseeker"
            ? "🔍 Browse and apply for care jobs across the UK"
            : "📋 Post jobs and find qualified care professionals"}
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>{role === "employer" ? "Contact Name" : "Full Name"}</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                name="displayName"
                type="text"
                placeholder={
                  role === "employer"
                    ? "e.g. Sarah Johnson"
                    : "e.g. James Smith"
                }
                value={form.displayName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {role === "employer" && (
            <div className="auth-field">
              <label>Company / Organisation Name</label>
              <div className="input-wrap">
                <Building2 size={16} className="input-icon" />
                <input
                  name="company"
                  type="text"
                  placeholder="e.g. Sunrise Care Homes"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPwd((p) => !p)}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                name="confirm"
                type={showPwd ? "text" : "password"}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password strength indicators */}
          <div className="pwd-hints">
            <span
              className={form.password.length >= 6 ? "hint-ok" : "hint-muted"}
            >
              <CheckCircle size={12} /> At least 6 characters
            </span>
            <span
              className={/[A-Z]/.test(form.password) ? "hint-ok" : "hint-muted"}
            >
              <CheckCircle size={12} /> Uppercase letter
            </span>
            <span
              className={/[0-9]/.test(form.password) ? "hint-ok" : "hint-muted"}
            >
              <CheckCircle size={12} /> Number
            </span>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin" /> Creating account...
              </>
            ) : (
              `Create ${role === "employer" ? "Employer" : "Job Seeker"} Account`
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function friendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import {  Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import './Auth.css'
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
const [searchParams] = useSearchParams();
const from = searchParams.get('redirect') || location.state?.from || "/";
const redirectParam = searchParams.get('redirect') ? `&redirect=${searchParams.get('redirect')}` : '';
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <img src={logo} alt="CaregiverNetwork" className="auth-logo" />
        </Link>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your CaregiverNetwork account</p>

        {location.state?.message && (
          <div className="auth-info">{location.state.message}</div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
                autoFocus
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="label-row">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Your password"
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

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>New to CaregiverNetwork?</span>
        </div>

        <div className="auth-register-options">
          <Link to={`/register?role=jobseeker${redirectParam}`} className="auth-register-btn jobseeker">
  Register as Job Seeker
</Link>
<Link to={`/register?role=employer${redirectParam}`} className="auth-register-btn employer">
  Register as Employer
</Link>
        </div>

        <p className="auth-switch">
          Or <Link to="/register">create a free account</Link>
        </p>
      </div>
    </div>
  );
}

function friendlyError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a moment and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    default:
      return "Sign in failed. Please check your details and try again.";
  }
}

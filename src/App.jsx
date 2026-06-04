import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import JobDetailPage from "./pages/JobDetailPage";
import PostJobPage from "./pages/PostJobPage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import AccountPage from "./pages/AccountPage";
import bcorp from './assets/bcorportation.png';
import "./App.css";
import JobseekerProfilePage from './pages/JobseekerProfilePage';
import { useState } from "react";
import LegalPage from "./pages/LegalPage";
import { CookieBanner } from "./pages/CookiePage";
import CookiePolicyPage from "./pages/CookiePage";
function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Top row */}
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <p className="footer-brand-name">CaregiverNetwork</p>
            <p className="footer-tagline">The UK's leading healthcare &amp; care jobs board. Helping connect care professionals with the roles they deserve.</p>

            {/* B Corp logo */}
            <div className="footer-bcorp">
            <img src={bcorp} alt="" />
              <span className="footer-bcorp-text">Certified B Corporation</span>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links-col">
            <p className="footer-col-title">For Job Seekers</p>
            <a href="/">Browse Jobs</a>
            <a href="/categories">Job Categories</a>
            <a href="/profile">My Profile</a>
            <a href="/register">Create Account</a>
          </div>

          <div className="footer-links-col">
            <p className="footer-col-title">For Employers</p>
            <a href="/post-job">Post a Job</a>
            <a href="/account">Employer Dashboard</a>
            <a href="#">Pricing</a>
            <a href="#">Contact Us</a>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <p className="footer-col-title">Job Alerts</p>
            <p className="footer-newsletter-text">Get the latest care jobs delivered straight to your inbox.</p>
            {subscribed ? (
              <div className="footer-subscribed">
                ✅ You're subscribed!
              </div>
            ) : (
              <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom row */}
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 CaregiverNetwork. All rights reserved.</p>

          {/* Social icons */}
          <div className="footer-socials">
            {/* Facebook */}
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* Twitter/X */}
            <a href="#" className="social-icon" aria-label="X (Twitter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            {/* TikTok — disabled */}
            <span className="social-icon social-icon--disabled" aria-label="TikTok (coming soon)" title="Coming soon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.04-8.42a8.2 8.2 0 0 0 4.81 1.55V5.01a4.85 4.85 0 0 1-1-.32z"/></svg>
            </span>
            {/* YouTube — disabled */}
            <span className="social-icon social-icon--disabled" aria-label="YouTube (coming soon)" title="Coming soon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
            </span>
          </div>

          <div className="footer-legal">
            <a href="/legal">Privacy Policy</a>
            <a href="/legal">Terms of Use</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <CookieBanner /> 
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/job/:id" element={<JobDetailPage />} />
              <Route path="/post-job" element={<PostJobPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<JobseekerProfilePage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/legal" element={<LegalPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
</>
  );
}
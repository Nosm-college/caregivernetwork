import { useState, useEffect } from "react";
import {
  Cookie,
  CheckCircle2,
  XCircle,
  Settings2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

// ─── Cookie Consent Banner ────────────────────────────────────────────────────
// Drop <CookieBanner /> into your App.jsx root to show the consent banner.
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    performance: false,
    functional: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (!saved) setVisible(true);
  }, []);

  const save = (accepted) => {
    const consent = accepted
      ? { necessary: true, performance: true, functional: true, ts: Date.now() }
      : { necessary: true, ...prefs, ts: Date.now() };
    localStorage.setItem("cookie_consent", JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cb-overlay">
      <div className="cb-banner">
        <div className="cb-top">
          <div className="cb-icon">
            <Cookie size={20} />
          </div>
          <div className="cb-text">
            <strong>We use cookies</strong>
            <p>
              We use strictly necessary cookies to run our site, and optional
              cookies to improve your experience and analyse traffic. See our{" "}
              <a href="/cookie-policy">Cookie Policy</a> for details.
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="cb-details">
            {[
              {
                key: "necessary",
                label: "Strictly Necessary",
                desc: "Required for the site to function. Always on.",
                locked: true,
                on: true,
              },
              {
                key: "performance",
                label: "Performance & Analytics",
                desc: "Help us understand how visitors use the site (page views, errors).",
                locked: false,
              },
              {
                key: "functional",
                label: "Functional",
                desc: "Remember your preferences like saved searches and location.",
                locked: false,
              },
            ].map((c) => (
              <div key={c.key} className="cb-row">
                <div className="cb-row-info">
                  <span className="cb-row-label">{c.label}</span>
                  <span className="cb-row-desc">{c.desc}</span>
                </div>
                <div
                  className={`cb-toggle ${c.locked ? "locked" : prefs[c.key] ? "on" : ""}`}
                  onClick={() => {
                    if (!c.locked)
                      setPrefs((p) => ({ ...p, [c.key]: !p[c.key] }));
                  }}
                >
                  <div className="cb-toggle-knob" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cb-actions">
          <button
            className="cb-btn cb-btn-ghost"
            onClick={() => setShowDetails((s) => !s)}
          >
            <Settings2 size={14} />
            {showDetails ? "Hide options" : "Manage preferences"}
          </button>
          <div className="cb-btn-group">
            <button
              className="cb-btn cb-btn-outline"
              onClick={() => save(false)}
            >
              {showDetails ? "Save my choices" : "Reject optional"}
            </button>
            <button
              className="cb-btn cb-btn-primary"
              onClick={() => save(true)}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cookie Policy Page ───────────────────────────────────────────────────────
const COOKIE_TYPES = [
  {
    id: "necessary",
    label: "Strictly Necessary",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    canDisable: false,
    description:
      "These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions you take such as logging in, setting your privacy preferences, or filling in forms.",
    examples: [
      {
        name: "session_id",
        purpose: "Maintains your login session",
        duration: "Session",
      },
      {
        name: "csrf_token",
        purpose: "Prevents cross-site request forgery attacks",
        duration: "Session",
      },
      {
        name: "cookie_consent",
        purpose: "Stores your cookie preferences",
        duration: "1 year",
      },
    ],
  },
  {
    id: "performance",
    label: "Performance & Analytics",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    canDisable: true,
    description:
      "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and anonymous.",
    examples: [
      {
        name: "_ga",
        purpose: "Google Analytics – distinguishes users",
        duration: "2 years",
      },
      {
        name: "_ga_*",
        purpose: "Google Analytics – maintains session state",
        duration: "2 years",
      },
      {
        name: "_gid",
        purpose: "Google Analytics – distinguishes users (short-lived)",
        duration: "24 hours",
      },
    ],
  },
  {
    id: "functional",
    label: "Functional",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
    canDisable: true,
    description:
      "These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly.",
    examples: [
      {
        name: "saved_search",
        purpose: "Remembers your last search query and filters",
        duration: "30 days",
      },
      {
        name: "location_pref",
        purpose: "Stores your preferred job location",
        duration: "30 days",
      },
      {
        name: "ui_theme",
        purpose: "Remembers display preferences",
        duration: "1 year",
      },
    ],
  },
];

const FAQ = [
  {
    q: "What is a cookie?",
    a: "A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login, language, font size and other display preferences) over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.",
  },
  {
    q: "Do you use any third-party cookies?",
    a: "Yes, we use Google Analytics (a performance cookie) to understand how visitors use our site. Google may set cookies on our behalf. These are subject to Google's own privacy policy. We do not use any advertising or tracking cookies from third parties.",
  },
  {
    q: "How do I manage or delete cookies?",
    a: "You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. You can also manage your preferences on our site using the 'Manage preferences' button in the cookie banner, or by visiting our Cookie Settings page.",
  },
  {
    q: "What happens if I decline optional cookies?",
    a: "If you decline optional cookies the site will still work normally. You may find that some features (like saved searches) behave differently, and we won't be able to measure how our site is used to improve it. Strictly necessary cookies will always remain active.",
  },
  {
    q: "Do you use cookies for advertising?",
    a: "No. We do not currently use any advertising, retargeting, or social media tracking cookies. We have no relationship with advertising networks and your browsing behaviour on our site is not shared for marketing purposes.",
  },
  {
    q: "Is this policy compliant with UK law?",
    a: "Yes. This policy is designed to comply with the Privacy and Electronic Communications Regulations 2003 (PECR), the UK GDPR, and the Data Protection Act 2018. We follow guidance from the Information Commissioner's Office (ICO).",
  },
];

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cp-faq-item ${open ? "open" : ""}`}>
      <button className="cp-faq-trigger" onClick={() => setOpen((s) => !s)}>
        <span>{item.q}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="cp-faq-body">
          <p>{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function CookiePolicyPage() {
  const resetConsent = () => {
    localStorage.removeItem("cookie_consent");
    window.location.reload();
  };

  return (
    <div className="cp-page">
      {/* Hero */}
      <div className="cp-hero">
        <div className="cp-hero-inner">
          <div className="cp-hero-badge">
            <Cookie size={18} />
            <span>Cookie Policy</span>
          </div>
          <h1>How We Use Cookies</h1>
          <p>
            We believe in being fully transparent about how our website uses
            cookies. This page explains what cookies we set, why, and how you
            can control them.
          </p>
          <p className="cp-updated">
            Last updated: 4 June 2025 · Applies to caregivernetwork.co.uk
          </p>
        </div>
        <div className="cp-hero-dots" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="cp-dot"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>

      <div className="cp-container">
        {/* Summary cards */}
        <section className="cp-section">
          <h2 className="cp-section-title">Cookie Categories at a Glance</h2>
          <div className="cp-cards">
            {COOKIE_TYPES.map((type) => (
              <div
                key={type.id}
                className="cp-card"
                style={{ background: type.bg, borderColor: type.border }}
              >
                <div className="cp-card-header">
                  <span className="cp-card-label" style={{ color: type.color }}>
                    {type.label}
                  </span>
                  {type.canDisable ? (
                    <span className="cp-badge cp-badge-optional">Optional</span>
                  ) : (
                    <span className="cp-badge cp-badge-required">
                      Always On
                    </span>
                  )}
                </div>
                <p className="cp-card-desc">{type.description}</p>
                <div className="cp-card-status">
                  {type.canDisable ? (
                    <>
                      <XCircle size={14} style={{ color: "#94a3b8" }} /> Can be
                      disabled
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} style={{ color: type.color }} />{" "}
                      Cannot be disabled
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed tables */}
        <section className="cp-section">
          <h2 className="cp-section-title">Cookie Details</h2>
          {COOKIE_TYPES.map((type) => (
            <div key={type.id} className="cp-table-block">
              <div
                className="cp-table-heading"
                style={{ borderLeftColor: type.color }}
              >
                <span style={{ color: type.color }}>{type.label} Cookies</span>
                {!type.canDisable && (
                  <span className="cp-badge cp-badge-required">Always On</span>
                )}
              </div>
              <div className="cp-table-wrap">
                <table className="cp-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Purpose</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {type.examples.map((ex) => (
                      <tr key={ex.name}>
                        <td>
                          <code>{ex.name}</code>
                        </td>
                        <td>{ex.purpose}</td>
                        <td>{ex.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Legal basis */}
        <section className="cp-section cp-legal-basis">
          <h2 className="cp-section-title">Legal Basis</h2>
          <p>
            Under the Privacy and Electronic Communications Regulations 2003
            (PECR) and UK GDPR, we rely on the following legal bases for setting
            cookies:
          </p>
          <ul>
            <li>
              <strong>Strictly Necessary cookies</strong> — set on the basis of{" "}
              <em>legitimate interests</em> (and in some cases contractual
              necessity) as they are essential for the site to operate. Your
              consent is not required for these.
            </li>
            <li>
              <strong>Performance & Analytics cookies</strong> — set only with
              your <em>explicit consent</em>, obtained through our cookie
              banner.
            </li>
            <li>
              <strong>Functional cookies</strong> — set only with your{" "}
              <em>explicit consent</em>, obtained through our cookie banner.
            </li>
          </ul>
          <p>
            You may withdraw your consent at any time by clicking the button
            below. This will not affect the lawfulness of processing carried out
            before withdrawal.
          </p>
          <button className="cp-manage-btn" onClick={resetConsent}>
            <Settings2 size={16} />
            Manage Cookie Preferences
          </button>
        </section>

        {/* Browser controls */}
        <section className="cp-section">
          <h2 className="cp-section-title">Managing Cookies in Your Browser</h2>
          <p style={{ color: "#475569", marginBottom: "16px" }}>
            You can also control cookies directly through your browser settings.
            Here are links to cookie management instructions for popular
            browsers:
          </p>
          <div className="cp-browser-links">
            {[
              {
                name: "Google Chrome",
                url: "https://support.google.com/chrome/answer/95647",
              },
              {
                name: "Mozilla Firefox",
                url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer",
              },
              {
                name: "Apple Safari",
                url: "https://support.apple.com/en-gb/guide/safari/sfri11471/mac",
              },
              {
                name: "Microsoft Edge",
                url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
              },
            ].map((b) => (
              <a
                key={b.name}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-browser-link"
              >
                {b.name} <ExternalLink size={12} />
              </a>
            ))}
          </div>
          <p className="cp-note">
            Note: Blocking all cookies may affect the functionality of this and
            many other websites you visit. We recommend managing cookies through
            our preference centre rather than blocking them entirely in your
            browser.
          </p>
        </section>

        {/* FAQ */}
        <section className="cp-section">
          <h2 className="cp-section-title">Frequently Asked Questions</h2>
          <div className="cp-faq">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} item={item} />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="cp-contact">
          <Cookie size={24} style={{ color: "#0f4c81" }} />
          <h3>Questions about our Cookie Policy?</h3>
          <p>
            If you have any questions or concerns about how we use cookies,
            please contact our Data Protection Officer:
          </p>
          <p>
            <strong>Email:</strong> privacy@caregivernetwork.co.uk
            <br />
            <strong>ICO Registration:</strong> ZB123456 (placeholder)
            <br />
            <strong>ICO Website:</strong>{" "}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              ico.org.uk <ExternalLink size={12} />
            </a>
          </p>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');

        .cp-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
        }

        /* Hero */
        .cp-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0c3b6e 0%, #1565b8 60%, #1e88e5 100%);
          color: white;
          padding: 64px 24px 56px;
          text-align: center;
        }

        .cp-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 640px;
          margin: 0 auto;
        }

        .cp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 99px;
          padding: 6px 16px;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .cp-hero h1 {
          font-family: 'Lora', serif;
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 700;
          margin: 0 0 16px;
          letter-spacing: -0.5px;
        }

        .cp-hero p {
          font-size: 1rem;
          opacity: 0.85;
          line-height: 1.7;
          margin: 0 0 8px;
        }

        .cp-updated {
          font-size: 0.8rem !important;
          opacity: 0.6 !important;
          font-style: italic;
        }

        .cp-hero-dots {
          position: absolute;
          inset: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          padding: 24px;
          pointer-events: none;
          opacity: 0.12;
        }

        .cp-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        /* Container */
        .cp-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .cp-section-title {
          font-family: 'Lora', serif;
          font-size: 1.375rem;
          font-weight: 700;
          color: #0c3b6e;
          margin: 0 0 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }

        /* Summary cards */
        .cp-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .cp-card {
          border: 1px solid;
          border-radius: 12px;
          padding: 20px;
        }

        .cp-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 8px;
        }

        .cp-card-label {
          font-weight: 700;
          font-size: 0.9375rem;
        }

        .cp-badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 99px;
          white-space: nowrap;
        }

        .cp-badge-required { background: #dcfce7; color: #15803d; }
        .cp-badge-optional { background: #f1f5f9; color: #64748b; }

        .cp-card-desc {
          font-size: 0.8375rem;
          color: #475569;
          line-height: 1.65;
          margin: 0 0 12px;
        }

        .cp-card-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Tables */
        .cp-table-block {
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .cp-table-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #f8fafc;
          border-left: 4px solid;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .cp-table-wrap { overflow-x: auto; }

        .cp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .cp-table th {
          background: #f1f5f9;
          padding: 10px 16px;
          text-align: left;
          font-weight: 600;
          color: #64748b;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cp-table td {
          padding: 10px 16px;
          border-top: 1px solid #f1f5f9;
          color: #334155;
          vertical-align: top;
        }

        .cp-table tr:hover td { background: #f8fafc; }

        .cp-table code {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.8rem;
          color: #0c3b6e;
          font-family: monospace;
        }

        /* Legal basis */
        .cp-legal-basis p {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.75;
          margin: 0 0 12px;
        }

        .cp-legal-basis ul {
          padding-left: 20px;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cp-legal-basis ul li {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.65;
        }

        .cp-manage-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0c3b6e;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
          margin-top: 4px;
        }

        .cp-manage-btn:hover { background: #0f4c81; }

        /* Browser links */
        .cp-browser-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }

        .cp-browser-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #0c3b6e;
          text-decoration: none;
          transition: all 0.15s;
        }

        .cp-browser-link:hover {
          border-color: #93c5fd;
          background: #eff6ff;
        }

        .cp-note {
          font-size: 0.8rem;
          color: #94a3b8;
          font-style: italic;
          line-height: 1.6;
        }

        /* FAQ */
        .cp-faq {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cp-faq-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .cp-faq-item.open {
          box-shadow: 0 4px 12px rgba(12, 59, 110, 0.08);
          border-color: #bfdbfe;
        }

        .cp-faq-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 16px 20px;
          background: none;
          border: none;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          font-family: inherit;
          gap: 16px;
        }

        .cp-faq-item.open .cp-faq-trigger { color: #0c3b6e; }

        .cp-faq-body {
          padding: 0 20px 16px;
          border-top: 1px solid #f1f5f9;
        }

        .cp-faq-body p {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.75;
          margin: 14px 0 0;
        }

        /* Contact */
        .cp-contact {
          background: linear-gradient(135deg, #eff6ff, #ecfdf5);
          border: 1px solid #bfdbfe;
          border-radius: 16px;
          padding: 32px;
          text-align: center;
        }

        .cp-contact h3 {
          font-family: 'Lora', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0c3b6e;
          margin: 12px 0 10px;
        }

        .cp-contact p {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.75;
          margin: 0 0 8px;
        }

        .cp-contact a {
          color: #0c3b6e;
          text-decoration: none;
          font-weight: 500;
        }

        .cp-contact a:hover { text-decoration: underline; }

        /* ── Cookie Banner ──────────────────────────────────────── */
        .cb-overlay {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          padding: 16px;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }

        .cb-banner {
          pointer-events: all;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.14);
          padding: 20px;
          max-width: 680px;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
        }

        .cb-top {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .cb-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          background: #eff6ff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0c3b6e;
        }

        .cb-text strong {
          display: block;
          font-size: 0.9375rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .cb-text p {
          font-size: 0.8375rem;
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        .cb-text a { color: #0c3b6e; font-weight: 500; }

        .cb-details {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cb-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .cb-row-info { flex: 1; }

        .cb-row-label {
          display: block;
          font-size: 0.8375rem;
          font-weight: 600;
          color: #1e293b;
        }

        .cb-row-desc {
          display: block;
          font-size: 0.775rem;
          color: #94a3b8;
          margin-top: 2px;
        }

        .cb-toggle {
          width: 40px;
          height: 22px;
          background: #e2e8f0;
          border-radius: 99px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .cb-toggle.on { background: #0c3b6e; }
        .cb-toggle.locked { background: #16a34a; cursor: not-allowed; opacity: 0.8; }

        .cb-toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .cb-toggle.on .cb-toggle-knob,
        .cb-toggle.locked .cb-toggle-knob {
          transform: translateX(18px);
        }

        .cb-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cb-btn-group { display: flex; gap: 8px; }

        .cb-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8375rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .cb-btn-ghost {
          background: none;
          color: #64748b;
          border-color: transparent;
        }

        .cb-btn-ghost:hover { color: #0c3b6e; background: #f1f5f9; }

        .cb-btn-outline {
          background: white;
          color: #1e293b;
          border-color: #e2e8f0;
        }

        .cb-btn-outline:hover { border-color: #94a3b8; }

        .cb-btn-primary {
          background: #0c3b6e;
          color: white;
          border-color: #0c3b6e;
        }

        .cb-btn-primary:hover { background: #0f4c81; }
      `}</style>
    </div>
  );
}

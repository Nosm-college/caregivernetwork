import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const faqs = [
  {
    q: "How do I post a job vacancy on CareJobs UK?",
    a: "You can post a vacancy by creating an employer account and using our job posting dashboard. For high-volume or enterprise listings, contact our team directly and we'll set you up with a tailored package.",
  },
  {
    q: "I applied for a job — who should I contact about my application?",
    a: "Applications go directly to the hiring employer. We recommend reaching out to them via the contact details on the job listing. Our team doesn't have visibility into individual applications.",
  },
  {
    q: "How do I report an inaccurate or fraudulent listing?",
    a: "Please use the contact form and select 'Report a listing' as your subject. Include the job title and URL and our moderation team will review it within 24 hours.",
  },
  {
    q: "Can I advertise across multiple locations?",
    a: "Yes — our multi-location packages allow you to post a single role visible across several regions simultaneously. Get in touch to discuss pricing.",
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`faq-item ${open ? "open" : ""}`}
      onClick={() => setOpen(!open)}
    >
      <div className="faq-question">
        <span>{item.q}</span>
        <ChevronDown size={18} className="faq-chevron" />
      </div>
      {open && <div className="faq-answer">{item.a}</div>}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addDoc(collection(db, "contacts"), {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving contact form:", err);
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --navy: #0d2137;
          --teal: #0b7b6e;
          --teal-light: #0fa192;
          --cream: #f7f3ee;
          --warm-white: #fdfcfa;
          --border: #e2ddd8;
          --text: #1a2e3b;
          --muted: #6b7f8c;
          --accent: #e85d26;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--warm-white);
          color: var(--text);
          min-height: 100vh;
        }

        /* ── Hero Banner ── */
        .contact-hero {
          background: var(--navy);
          padding: 72px 24px 56px;
          position: relative;
          overflow: hidden;
        }
        .contact-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 80% at 80% 50%, #0b4a5e44, transparent),
                      radial-gradient(ellipse 50% 60% at 10% 80%, #0b7b6e22, transparent);
        }
        .contact-hero-inner {
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .contact-hero-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal-light);
          margin-bottom: 16px;
        }
        .contact-hero h1 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .contact-hero h1 em {
          font-style: italic;
          color: var(--teal-light);
        }
        .contact-hero p {
          color: #a8c0cc;
          font-size: 1.05rem;
          max-width: 520px;
          line-height: 1.65;
        }

        /* ── Info Cards row ── */
        .contact-info-strip {
          background: var(--cream);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
        }
        .contact-info-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .info-card {
          padding: 28px 24px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          border-right: 1px solid var(--border);
        }
        .info-card:last-child { border-right: none; }
        .info-icon {
          width: 40px; height: 40px;
          background: var(--navy);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: var(--teal-light);
        }
        .info-card h4 {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 4px;
        }
        .info-card p {
          font-size: 0.9rem;
          color: var(--text);
          line-height: 1.5;
        }

        /* ── Main two-column layout ── */
        .contact-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 24px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 56px;
          align-items: start;
        }
        @media (max-width: 820px) {
          .contact-main { grid-template-columns: 1fr; gap: 40px; }
        }

        /* ── Form ── */
        .form-section h2 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.9rem;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 8px;
        }
        .form-section > p {
          color: var(--muted);
          font-size: 0.93rem;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .contact-form { display: flex; flex-direction: column; gap: 20px; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 520px) { .form-row { grid-template-columns: 1fr; } }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--navy);
          letter-spacing: 0.03em;
        }
        .field input,
        .field select,
        .field textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.93rem;
          padding: 11px 14px;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          background: #fff;
          color: var(--text);
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          width: 100%;
        }
        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px #0b7b6e18;
        }
        .field textarea { resize: vertical; min-height: 120px; }
        .field select { appearance: none; cursor: pointer; }

        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--teal);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 13px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, transform 0.1s;
          align-self: flex-start;
        }
        .submit-btn:hover { background: var(--teal-light); }
        .submit-btn:active { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success state */
        .success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 48px 32px;
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          gap: 16px;
        }
        .success-state .check-icon { color: var(--teal); }
        .success-state h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem;
          color: var(--navy);
        }
        .success-state p { color: var(--muted); font-size: 0.93rem; line-height: 1.6; }

        /* ── Sidebar ── */
        .contact-sidebar { display: flex; flex-direction: column; gap: 24px; }

        .sidebar-card {
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .sidebar-card-header {
          background: var(--navy);
          padding: 18px 22px;
        }
        .sidebar-card-header h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #fff;
        }
        .sidebar-card-header p {
          font-size: 0.82rem;
          color: #a8c0cc;
          margin-top: 4px;
        }
        .sidebar-card-body { padding: 20px 22px; }

        /* dept list */
        .dept-list { display: flex; flex-direction: column; gap: 14px; }
        .dept-item { display: flex; flex-direction: column; gap: 3px; }
        .dept-item .dept-name {
          font-size: 0.83rem;
          font-weight: 600;
          color: var(--navy);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .dept-item a {
          font-size: 0.9rem;
          color: var(--teal);
          text-decoration: none;
        }
        .dept-item a:hover { text-decoration: underline; }

        /* response time badge */
        .response-badge {
          display: flex;
          gap: 12px;
          align-items: center;
          background: var(--cream);
          border-radius: 8px;
          padding: 14px 16px;
        }
        .response-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px #22c55e30;
        }
        .response-badge p {
          font-size: 0.87rem;
          color: var(--text);
          line-height: 1.45;
        }
        .response-badge strong { color: var(--navy); }

        /* ── FAQ section ── */
        .faq-section {
          background: var(--cream);
          border-top: 1px solid var(--border);
          padding: 64px 24px;
        }
        .faq-inner { max-width: 760px; margin: 0 auto; }
        .faq-inner h2 {
          font-family: 'Fraunces', serif;
          font-size: 1.9rem;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 8px;
        }
        .faq-inner > p {
          color: var(--muted);
          font-size: 0.93rem;
          margin-bottom: 32px;
        }

        .faq-item {
          border: 1.5px solid var(--border);
          border-radius: 10px;
          background: #fff;
          margin-bottom: 10px;
          cursor: pointer;
          transition: border-color 0.18s;
          overflow: hidden;
        }
        .faq-item.open { border-color: var(--teal); }
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          font-weight: 500;
          font-size: 0.95rem;
          gap: 12px;
        }
        .faq-chevron {
          flex-shrink: 0;
          color: var(--muted);
          transition: transform 0.22s;
        }
        .faq-item.open .faq-chevron { transform: rotate(180deg); color: var(--teal); }
        .faq-answer {
          padding: 0 20px 18px;
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.65;
          border-top: 1px solid var(--border);
          padding-top: 14px;
        }

        /* ── Bottom CTA ── */
        .contact-cta {
          background: var(--navy);
          padding: 56px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .contact-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 100% at 50% 100%, #0b7b6e30, transparent);
        }
        .contact-cta-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
        .contact-cta h2 {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem;
          color: #fff;
          margin-bottom: 12px;
        }
        .contact-cta p {
          color: #a8c0cc;
          font-size: 0.95rem;
          margin-bottom: 28px;
          line-height: 1.6;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 13px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.18s;
        }
        .cta-btn:hover { opacity: 0.88; }
      `}</style>

      <div className="contact-page">
        {/* Hero */}
        <div className="contact-hero">
          <div className="contact-hero-inner">
            <p className="contact-hero-label">Get in touch</p>
            <h1>
              We're here to <em>help</em> you
              <br />
              find the right care career.
            </h1>
            <p>
              Whether you're a job seeker, an employer, or just have a question
              — our team is ready to assist.
            </p>
          </div>
        </div>

        {/* Info strip */}
        <div className="contact-info-strip">
          <div className="contact-info-inner">
            <div className="info-card">
              <div className="info-icon">
                <Mail size={18} />
              </div>
              <div>
                <h4>Email us</h4>
                <p>support@caregivernetwork.co.uk</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <Phone size={18} />
              </div>
              <div>
                <h4>Call us</h4>
                <p>0800 123 4567</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <MapPin size={18} />
              </div>
              <div>
                <h4>Our office</h4>
                <p>London, United Kingdom</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <Clock size={18} />
              </div>
              <div>
                <h4>Office hours</h4>
                <p>Mon–Fri, 9am – 5:30pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="contact-main">
          {/* Form */}
          <div className="form-section">
            <h2>Send us a message</h2>
            <p>
              Fill in the form and we'll get back to you within one business
              day.
            </p>

            {submitted ? (
              <div className="success-state">
                <CheckCircle size={48} className="check-icon" />
                <h3>Message received!</h3>
                <p>
                  Thanks for getting in touch. A member of our team will respond
                  to you within one business day.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="name">Full name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jane Smith"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a topic...</option>
                    <option>General enquiry</option>
                    <option>Post a job vacancy</option>
                    <option>Job seeker support</option>
                    <option>Report a listing</option>
                    <option>Billing & accounts</option>
                    <option>Technical issue</option>
                    <option>Partnership enquiry</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <svg
                        className="spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send message
                    </>
                  )}
                </button>
                {error && (
                  <p
                    style={{
                      color: "#c0392b",
                      fontSize: "0.88rem",
                      marginTop: "4px",
                    }}
                  >
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="contact-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3>Team contacts</h3>
                <p>Reach the right department directly</p>
              </div>
              <div className="sidebar-card-body">
                <div className="dept-list">
                  {[
                    { name: "Job Seekers", email: "candidates@caregivernetwork.co.uk" },
                    {
                      name: "Employers & Recruiting",
                      email: "employers@caregivernetwork.co.uk",
                    },
                    {
                      name: "Partnerships",
                      email: "partnerships@caregivernetwork.co.uk",
                    },
                    { name: "Press & Media", email: "press@caregivernetwork.co.uk" },
                  ].map((d) => (
                    <div key={d.name} className="dept-item">
                      <span className="dept-name">{d.name}</span>
                      <a href={`mailto:${d.email}`}>{d.email}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3>Response time</h3>
              </div>
              <div className="sidebar-card-body">
                <div className="response-badge">
                  <div className="response-dot" />
                  <p>
                    <strong>Typically within 1 business day.</strong> During
                    busy periods it may take up to 48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <div className="faq-inner">
            <h2>Frequently asked questions</h2>
            <p>
              Quick answers to common queries — no need to wait for a reply.
            </p>
            {faqs.map((item) => (
              <FAQItem key={item.q} item={item} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="contact-cta">
          <div className="contact-cta-inner">
            <h2>Ready to find your next role?</h2>
            <p>
              Browse thousands of care and healthcare jobs across the UK —
              updated daily.
            </p>
            <a href="/" className="cta-btn">
              Browse all jobs →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

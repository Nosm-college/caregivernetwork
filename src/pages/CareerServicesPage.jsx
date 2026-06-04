import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  Mic2,
  ClipboardCheck,
  Award,
  ChevronRight,
  CheckCircle2,
  Star,
  Clock,
  Users,
  ArrowRight,
  X,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "cv-writing",
    icon: FileText,
    color: "#2563eb",
    colorLight: "#eff6ff",
    badge: "Most Popular",
    title: "CV & Resume Writing",
    tagline: "Stand out from the crowd with a professionally crafted CV",
    description:
      "Our specialist healthcare CV writers know exactly what UK care employers look for. We transform your experience into a compelling, ATS-optimised document that gets you interviews.",
    features: [
      "Written by healthcare recruitment specialists",
      "ATS-optimised for UK care employers",
      "Tailored to your target role & band",
      "LinkedIn profile update included",
      "Unlimited revisions within 14 days",
      "Delivered within 3 working days",
    ],
    plans: [
      { name: "Essential", price: "£49", desc: "Core CV rewrite, 1 revision" },
      {
        name: "Professional",
        price: "£89",
        desc: "Full CV + cover letter, unlimited revisions",
        highlight: true,
      },
      {
        name: "Premium",
        price: "£129",
        desc: "CV + cover letter + LinkedIn optimisation",
      },
    ],
    stats: { rating: "4.9", reviews: "2,400+", turnaround: "3 days" },
  },
  {
    id: "interview-coaching",
    icon: Mic2,
    color: "#059669",
    colorLight: "#ecfdf5",
    badge: "High Demand",
    title: "Interview Coaching",
    tagline: "Walk into every interview with confidence and a clear strategy",
    description:
      "One-to-one coaching sessions with former NHS recruiters and care managers. We run mock interviews, decode common questions, and build the frameworks you need to perform under pressure.",
    features: [
      "1-to-1 sessions with a care sector expert",
      "Mock interviews with real feedback",
      "NHS Band interview preparation",
      "Values-Based Interview (VBI) coaching",
      "Session recording for self-review",
      "Follow-up written feedback report",
    ],
    plans: [
      {
        name: "Single Session",
        price: "£65",
        desc: "60-min 1-to-1, key question prep",
      },
      {
        name: "3-Session Pack",
        price: "£175",
        desc: "Full programme + mock + feedback report",
        highlight: true,
      },
      {
        name: "Intensive",
        price: "£299",
        desc: "6 sessions, unlimited email Q&A, recording",
      },
    ],
    stats: { rating: "4.8", reviews: "1,100+", turnaround: "Same week" },
  },
  {
    id: "skills-assessments",
    icon: ClipboardCheck,
    color: "#7c3aed",
    colorLight: "#f5f3ff",
    badge: "Free Tier",
    title: "Skills Assessments",
    tagline: "Know your strengths — and prove them to employers",
    description:
      "Benchmark your clinical and care competencies against role requirements. Our verified assessments generate a shareable skills passport that you can attach to any application on CaregiverNetwork.",
    features: [
      "Role-specific competency frameworks",
      "Covers clinical, soft & leadership skills",
      "Shareable verified Skills Passport",
      "Gap analysis & learning recommendations",
      "Recognised by 200+ UK care employers",
      "Retake anytime as you upskill",
    ],
    plans: [
      { name: "Free", price: "£0", desc: "3 core assessments, basic passport" },
      {
        name: "Standard",
        price: "£19",
        desc: "Unlimited assessments, full passport + badge",
        highlight: true,
      },
      {
        name: "Team (per user)",
        price: "£12",
        desc: "Employer bulk pricing, dashboard analytics",
      },
    ],
    stats: { rating: "4.7", reviews: "5,800+", turnaround: "Instant" },
  },
  {
    id: "certifications",
    icon: Award,
    color: "#b45309",
    colorLight: "#fffbeb",
    badge: "CPD Accredited",
    title: "Professional Certifications",
    tagline: "Earn CPD-accredited certificates that employers trust",
    description:
      "Short online courses and assessments covering the most in-demand care competencies. All programmes are CPD-accredited and recognised by CQC-regulated employers across the UK.",
    features: [
      "CPD-accredited, CQC-aligned content",
      "Study at your own pace, on any device",
      "Instant digital certificate on completion",
      "Counts toward your Skills Passport",
      "New courses added every month",
      "Funded options available for eligible learners",
    ],
    plans: [
      {
        name: "Single Course",
        price: "£25",
        desc: "One certification, lifetime access",
      },
      {
        name: "Bundle (5 courses)",
        price: "£89",
        desc: "Best value, 5 certs of your choice",
        highlight: true,
      },
      {
        name: "Annual Pass",
        price: "£149/yr",
        desc: "Unlimited courses for 12 months",
      },
    ],
    stats: { rating: "4.8", reviews: "3,200+", turnaround: "Self-paced" },
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <span className="cs-stars">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < Math.floor(Number(rating)) ? "currentColor" : "none"}
          className={
            i < Math.floor(Number(rating)) ? "cs-star-filled" : "cs-star-empty"
          }
        />
      ))}
      <span className="cs-rating-num">{rating}</span>
    </span>
  );
}

function PlanCard({ plan }) {
  return (
    <div
      className={`cs-plan-card ${plan.highlight ? "cs-plan-highlight" : ""}`}
    >
      {plan.highlight && <span className="cs-plan-badge">Best Value</span>}
      <div className="cs-plan-name">{plan.name}</div>
      <div className="cs-plan-price">{plan.price}</div>
      <div className="cs-plan-desc">{plan.desc}</div>
      <button
        className={`cs-plan-btn ${plan.highlight ? "cs-plan-btn-primary" : "cs-plan-btn-secondary"}`}
      >
        Get Started <ArrowRight size={14} />
      </button>
    </div>
  );
}

function ServiceCard({ service, isOpen, onToggle }) {
  const Icon = service.icon;
  return (
    <section className="cs-service-card" id={service.id}>
      {/* Header */}
      <div
        className="cs-service-header"
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <div
          className="cs-service-icon-wrap"
          style={{ background: service.colorLight, color: service.color }}
        >
          <Icon size={28} />
        </div>
        <div className="cs-service-header-text">
          <div className="cs-service-badges">
            <span
              className="cs-badge"
              style={{ background: service.colorLight, color: service.color }}
            >
              {service.badge}
            </span>
          </div>
          <h2 className="cs-service-title">{service.title}</h2>
          <p className="cs-service-tagline">{service.tagline}</p>
        </div>
        <div className="cs-service-stats">
          <StarRating rating={service.stats.rating} />
          <span className="cs-stat">
            <Users size={12} /> {service.stats.reviews}
          </span>
          <span className="cs-stat">
            <Clock size={12} /> {service.stats.turnaround}
          </span>
        </div>
        <button
          className="cs-toggle-btn"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <X size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Expandable body */}
      {isOpen && (
        <div className="cs-service-body">
          <div className="cs-service-body-inner">
            {/* Description + Features */}
            <div className="cs-service-info">
              <p className="cs-service-desc">{service.description}</p>
              <ul className="cs-features">
                {service.features.map((f) => (
                  <li key={f}>
                    <CheckCircle2 size={15} style={{ color: service.color }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plans */}
            <div className="cs-plans">
              <p className="cs-plans-label">Choose a plan</p>
              <div className="cs-plans-grid">
                {service.plans.map((plan) => (
                  <PlanCard key={plan.name} plan={plan} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CareerServicesPage() {
  const [openService, setOpenService] = useState("cv-writing");
  const navigate = useNavigate();

  const toggle = (id) => setOpenService((prev) => (prev === id ? null : id));

  return (
    <div className="cs-page">
      {/* Hero */}
      <div className="cs-hero">
        <div className="cs-hero-inner">
          <span className="cs-hero-eyebrow">Career Development</span>
          <h1 className="cs-hero-title">
            Everything you need to
            <br />
            <em>land your next care role</em>
          </h1>
          <p className="cs-hero-sub">
            From polishing your CV to earning CPD certificates — our expert-led
            services are built exclusively for UK healthcare and care
            professionals.
          </p>
          <div className="cs-hero-pills">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  className={`cs-hero-pill ${openService === s.id ? "active" : ""}`}
                  style={
                    openService === s.id
                      ? {
                          borderColor: s.color,
                          color: s.color,
                          background: s.colorLight,
                        }
                      : {}
                  }
                  onClick={() => {
                    setOpenService(s.id);
                    setTimeout(() => {
                      document
                        .getElementById(s.id)
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }, 50);
                  }}
                >
                  <Icon size={15} />
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="cs-services-list">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isOpen={openService === service.id}
            onToggle={() => toggle(service.id)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="cs-cta-band">
        <div className="cs-cta-inner">
          <h2>Not sure where to start?</h2>
          <p>
            Browse open roles and see which services top applicants are using.
          </p>
          <button className="cs-cta-btn" onClick={() => navigate("/")}>
            Browse Jobs <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scoped styles */}
      <style>{`
        /* ── Page shell ── */
        .cs-page { min-height: 100vh; background: #f8fafc; font-family: inherit; }

        /* ── Hero ── */
        .cs-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%);
          padding: 72px 24px 56px;
          color: #fff;
          text-align: center;
        }
        .cs-hero-inner { max-width: 760px; margin: 0 auto; }
        .cs-hero-eyebrow {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #93c5fd;
          margin-bottom: 16px;
        }
        .cs-hero-title {
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 800;
          line-height: 1.15;
          margin: 0 0 16px;
          color: #fff;
        }
        .cs-hero-title em { color: #60a5fa; font-style: normal; }
        .cs-hero-sub { font-size: 16px; color: #bfdbfe; max-width: 540px; margin: 0 auto 32px; line-height: 1.65; }
        .cs-hero-pills { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .cs-hero-pill {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,.25);
          background: rgba(255,255,255,.08);
          color: #e2e8f0; font-size: 13.5px; font-weight: 500;
          cursor: pointer; transition: all .18s;
        }
        .cs-hero-pill:hover { border-color: rgba(255,255,255,.55); background: rgba(255,255,255,.15); }
        .cs-hero-pill.active { font-weight: 600; }

        /* ── Services list ── */
        .cs-services-list {
          max-width: 900px; margin: 0 auto;
          padding: 40px 24px 16px;
          display: flex; flex-direction: column; gap: 16px;
        }

        /* ── Service card ── */
        .cs-service-card {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          overflow: hidden;
          transition: box-shadow .2s;
        }
        .cs-service-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,.08); }

        .cs-service-header {
          display: flex; align-items: center; gap: 18px;
          padding: 24px 24px;
          flex-wrap: wrap;
        }
        .cs-service-icon-wrap {
          width: 56px; height: 56px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cs-service-header-text { flex: 1; min-width: 200px; }
        .cs-service-badges { margin-bottom: 4px; }
        .cs-badge {
          font-size: 11px; font-weight: 700; letter-spacing: .06em;
          text-transform: uppercase; padding: 3px 8px; border-radius: 50px;
        }
        .cs-service-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 4px 0; }
        .cs-service-tagline { font-size: 14px; color: #64748b; margin: 0; }

        .cs-service-stats {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap; font-size: 12.5px; color: #64748b;
        }
        .cs-stars { display: flex; align-items: center; gap: 2px; }
        .cs-star-filled { color: #f59e0b; }
        .cs-star-empty { color: #d1d5db; }
        .cs-rating-num { font-weight: 700; color: #0f172a; margin-left: 4px; font-size: 13px; }
        .cs-stat { display: flex; align-items: center; gap: 4px; }

        .cs-toggle-btn {
          background: #f1f5f9; border: none; border-radius: 8px;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #475569; flex-shrink: 0;
          transition: background .15s;
        }
        .cs-toggle-btn:hover { background: #e2e8f0; }

        /* ── Service body ── */
        .cs-service-body {
          border-top: 1.5px solid #f1f5f9;
          background: #fafbfc;
        }
        .cs-service-body-inner {
          display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
          padding: 28px 24px 32px;
        }
        @media (max-width: 680px) {
          .cs-service-body-inner { grid-template-columns: 1fr; gap: 24px; }
        }

        .cs-service-desc { font-size: 14.5px; color: #374151; line-height: 1.7; margin: 0 0 18px; }
        .cs-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .cs-features li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; color: #374151; line-height: 1.4; }
        .cs-features li svg { flex-shrink: 0; margin-top: 1px; }

        /* ── Plans ── */
        .cs-plans-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; margin: 0 0 12px; }
        .cs-plans-grid { display: flex; flex-direction: column; gap: 10px; }

        .cs-plan-card {
          position: relative;
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
          padding: 14px 16px; transition: border-color .15s;
        }
        .cs-plan-card:hover { border-color: #94a3b8; }
        .cs-plan-highlight {
          border-color: #2563eb !important;
          background: linear-gradient(135deg, #eff6ff 0%, #fff 100%);
        }
        .cs-plan-badge {
          position: absolute; top: -10px; right: 14px;
          background: #2563eb; color: #fff;
          font-size: 10px; font-weight: 700; letter-spacing: .06em;
          text-transform: uppercase; padding: 3px 9px; border-radius: 50px;
        }
        .cs-plan-name { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .cs-plan-price { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
        .cs-plan-desc { font-size: 12.5px; color: #64748b; margin-bottom: 12px; line-height: 1.4; }

        .cs-plan-btn {
          width: 100%; padding: 9px 12px; border-radius: 8px; font-size: 13.5px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          cursor: pointer; border: none; transition: opacity .15s;
        }
        .cs-plan-btn:hover { opacity: .85; }
        .cs-plan-btn-primary { background: #2563eb; color: #fff; }
        .cs-plan-btn-secondary { background: #f1f5f9; color: #374151; }

        /* ── CTA band ── */
        .cs-cta-band {
          background: linear-gradient(135deg, #1e3a5f, #1e40af);
          margin: 32px 0 0; padding: 56px 24px; text-align: center; color: #fff;
        }
        .cs-cta-inner { max-width: 520px; margin: 0 auto; }
        .cs-cta-band h2 { font-size: 28px; font-weight: 800; margin: 0 0 10px; }
        .cs-cta-band p { color: #bfdbfe; font-size: 15px; margin: 0 0 24px; }
        .cs-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #1e40af; font-weight: 700; font-size: 15px;
          padding: 13px 28px; border-radius: 50px; border: none; cursor: pointer;
          transition: transform .15s, box-shadow .15s;
        }
        .cs-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.2); }
      `}</style>
    </div>
  );
}

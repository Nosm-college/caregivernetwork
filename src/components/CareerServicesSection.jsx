import { useNavigate } from "react-router-dom";
import {
  FileText,
  Mic2,
  ClipboardCheck,
  Award,
  ArrowRight,
} from "lucide-react";

const ITEMS = [
  {
    icon: FileText,
    color: "#2563eb",
    bg: "#eff6ff",
    title: "CV Writing",
    desc: "ATS-optimised CVs by healthcare recruitment specialists.",
    href: "/career-services#cv-writing",
  },
  {
    icon: Mic2,
    color: "#059669",
    bg: "#ecfdf5",
    title: "Interview Coaching",
    desc: "Mock sessions with former NHS recruiters — ace your next interview.",
    href: "/career-services#interview-coaching",
  },
  {
    icon: ClipboardCheck,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Skills Assessments",
    desc: "Benchmark your competencies and earn a shareable Skills Passport.",
    href: "/career-services#skills-assessments",
  },
  {
    icon: Award,
    color: "#b45309",
    bg: "#fffbeb",
    title: "Certifications",
    desc: "CPD-accredited online courses recognised by UK care employers.",
    href: "/career-services#certifications",
  },
];

export default function CareerServicesSection() {
  const navigate = useNavigate();

  return (
    <section className="css-section">
      <div className="css-inner">
        <div className="css-header">
          <div>
            <span className="css-eyebrow">Career Development</span>
            <h2 className="css-title">Go beyond job searching</h2>
            <p className="css-sub">
              Expert tools to help you stand out and grow in the care sector.
            </p>
          </div>
          <button
            className="css-see-all"
            onClick={() => navigate("/career-services")}
          >
            View all services <ArrowRight size={15} />
          </button>
        </div>

        <div className="css-grid">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                className="css-card"
                onClick={() => navigate("/career-services")}
              >
                <div
                  className="css-card-icon"
                  style={{ background: item.bg, color: item.color }}
                >
                  <Icon size={22} />
                </div>
                <div className="css-card-body">
                  <p className="css-card-title">{item.title}</p>
                  <p className="css-card-desc">{item.desc}</p>
                </div>
                <ArrowRight
                  size={15}
                  className="css-card-arrow"
                  style={{ color: item.color }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .css-section {
          padding: 48px 24px;
          background: #fff;
          border-top: 1px solid #f1f5f9;
        }
        .css-inner { max-width: 1100px; margin: 0 auto; }

        .css-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 12px; margin-bottom: 28px;
        }
        .css-eyebrow {
          display: block; font-size: 11.5px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: #2563eb; margin-bottom: 6px;
        }
        .css-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
        .css-sub { font-size: 14px; color: #64748b; margin: 0; }

        .css-see-all {
          display: flex; align-items: center; gap: 6px;
          font-size: 13.5px; font-weight: 600; color: #2563eb;
          background: none; border: 1.5px solid #2563eb; border-radius: 50px;
          padding: 8px 18px; cursor: pointer; white-space: nowrap;
          transition: background .15s, color .15s;
        }
        .css-see-all:hover { background: #2563eb; color: #fff; }

        .css-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .css-card {
          display: flex; align-items: center; gap: 14px;
          background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px;
          padding: 18px 16px; cursor: pointer; text-align: left;
          transition: border-color .18s, box-shadow .18s, transform .18s;
        }
        .css-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 4px 16px rgba(37,99,235,.1);
          transform: translateY(-2px);
        }

        .css-card-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .css-card-body { flex: 1; min-width: 0; }
        .css-card-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
        .css-card-desc { font-size: 12.5px; color: #64748b; margin: 0; line-height: 1.45; }
        .css-card-arrow { flex-shrink: 0; opacity: .7; }
      `}</style>
    </section>
  );
}

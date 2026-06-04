import { useState } from "react";
import { Shield, FileText, ChevronDown, ChevronUp } from "lucide-react";

const SECTIONS = {
  privacy: [
    {
      id: "intro",
      title: "1. Introduction",
      content: `Caregivers Network ("we", "us", or "our") is committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services.

Our registered address is in the United Kingdom. If you have any questions about this policy, please contact our Data Protection Officer at privacy@caregivernetwork.co.uk.`,
    },
    {
      id: "data-collected",
      title: "2. Data We Collect",
      content: `We may collect and process the following categories of personal data:

• Identity & Contact Data: name, email address, phone number, postal address.
• Professional Data: CV/résumé, work history, qualifications, references, and right-to-work documentation.
• Usage Data: pages visited, search queries, job listings viewed, time spent on site, browser type, IP address, and cookie identifiers.
• Communications Data: messages sent through our platform, email correspondence, and support tickets.
• Account Data: login credentials, saved searches, job alerts, and application history.

We do not intentionally collect sensitive special-category data (e.g. health, ethnicity, religion) unless you voluntarily provide it as part of a job application.`,
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Data",
      content: `We process your personal data for the following purposes and legal bases:

• To provide our job-matching service (contractual necessity).
• To connect you with prospective employers and care providers (contractual necessity / legitimate interests).
• To send job alerts, newsletters, and service updates you have opted into (consent).
• To improve and personalise our platform using aggregated analytics (legitimate interests).
• To comply with legal obligations, including right-to-work verification requirements under UK employment law.
• To prevent fraud, abuse, and ensure platform security (legitimate interests).

We will not use your data for automated decision-making that produces significant legal or similarly significant effects without human review.`,
    },
    {
      id: "sharing",
      title: "4. Sharing Your Data",
      content: `We share your data only in the following circumstances:

• With Employers & Recruiters: when you apply for a job or express interest in a vacancy, your application data is shared with the relevant employer.
• With Service Providers: trusted third-party processors (e.g. cloud hosting, email delivery, analytics) who act under strict data processing agreements.
• With Regulators & Law Enforcement: where required by law, court order, or to protect the rights and safety of others.
• Business Transfers: in the event of a merger, acquisition, or asset sale, your data may be transferred subject to equivalent protections.

We do not sell your personal data to third parties for marketing purposes.`,
    },
    {
      id: "retention",
      title: "5. Data Retention",
      content: `We retain your personal data only for as long as necessary:

• Active account data: for the duration of your account plus 2 years after last activity.
• Job application data: up to 6 months after the position is filled, unless you consent to longer retention for future opportunities.
• Analytics and log data: up to 13 months in line with ICO guidance.
• Legal and financial records: up to 7 years as required by UK law.

You may request deletion of your data at any time (see Your Rights below), subject to any overriding legal obligations.`,
    },
    {
      id: "rights",
      title: "6. Your Rights Under UK GDPR",
      content: `You have the following rights regarding your personal data:

• Right of Access: request a copy of the data we hold about you (Subject Access Request).
• Right to Rectification: correct inaccurate or incomplete data.
• Right to Erasure ("Right to be Forgotten"): request deletion where we have no lawful basis to retain it.
• Right to Restriction: limit how we use your data in certain circumstances.
• Right to Data Portability: receive your data in a machine-readable format.
• Right to Object: object to processing based on legitimate interests or for direct marketing.
• Rights Related to Automated Decision-Making: request human review of automated decisions.

To exercise any of these rights, contact us at privacy@caregivernetwork.co.uk. We will respond within 30 days. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.`,
    },
    {
      id: "cookies",
      title: "7. Cookies & Tracking",
      content: `We use cookies and similar technologies to operate our site and improve your experience. Categories include:

• Strictly Necessary: essential for the site to function (e.g. session management). Cannot be disabled.
• Performance & Analytics: help us understand how visitors use the site (e.g. page views, error tracking). Enabled only with your consent.
• Functional: remember your preferences (e.g. saved searches, location). Enabled only with your consent.
• Targeting/Advertising: we do not currently use advertising cookies.

You can manage your cookie preferences through our cookie banner or your browser settings. Note that disabling certain cookies may affect site functionality.`,
    },
    {
      id: "security",
      title: "8. Security",
      content: `We implement appropriate technical and organisational measures to protect your data against unauthorised access, loss, or disclosure. These include encryption in transit (TLS), access controls, regular security assessments, and staff training.

However, no internet transmission is completely secure. If you suspect a data breach, please contact us immediately at security@caregivernetwork.co.uk. We will notify affected individuals and the ICO within 72 hours as required by UK GDPR where applicable.`,
    },
    {
      id: "changes",
      title: "9. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. Material changes will be notified via email or a prominent notice on our website at least 14 days before taking effect. The "Last Updated" date at the top of this page will always reflect the most recent version.

Continued use of our services after changes take effect constitutes acceptance of the updated policy.`,
    },
  ],
  terms: [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: `By accessing or using Caregivers Network (the "Service"), you agree to be bound by these Terms of Use. If you do not agree, please discontinue use immediately.

These terms constitute a legally binding agreement between you and Caregivers Network. We reserve the right to update these terms at any time with notice as described in the Changes section below. Your continued use of the Service after any changes constitutes acceptance.`,
    },
    {
      id: "eligibility",
      title: "2. Eligibility",
      content: `You must be at least 18 years old and legally permitted to work in the United Kingdom (or be actively seeking work in the UK) to use this Service as a job seeker.

Employers and recruiters must be legally registered to operate in the UK and authorised to post the roles they advertise. By posting a vacancy, you confirm the role exists, the salary information is accurate, and you have a lawful right to recruit for it.`,
    },
    {
      id: "accounts",
      title: "3. Accounts & Registration",
      content: `You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You must:

• Provide accurate, current, and complete information during registration.
• Notify us immediately of any unauthorised access or security breach.
• Not share your credentials with any third party.
• Not create multiple accounts or accounts on behalf of others without authorisation.

We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.`,
    },
    {
      id: "job-seeker",
      title: "4. Job Seeker Conduct",
      content: `As a job seeker using our platform, you agree to:

• Provide truthful information in your profile, CV, and applications.
• Not misrepresent your qualifications, experience, or right to work in the UK.
• Use the platform solely to seek legitimate employment opportunities.
• Not use automated tools, bots, or scrapers to access or collect data from the Service.
• Not apply for roles you are clearly ineligible for in bad faith.

The healthcare and care sector requires high standards of conduct. Any misrepresentation of professional qualifications or registration status (e.g. NMC, HCPC) may result in account termination and referral to the relevant regulatory body.`,
    },
    {
      id: "employer",
      title: "5. Employer & Recruiter Conduct",
      content: `Employers and recruiters using our platform agree to:

• Post only genuine, lawful vacancies that exist at time of posting.
• Comply with the Equality Act 2010 — job adverts must not discriminate on protected characteristics.
• Accurately represent salary, location, hours, and contract type.
• Handle candidate data in accordance with UK GDPR and only use it for the stated recruitment purpose.
• Not post roles that require payment from applicants.
• Remove or update listings promptly when a position is filled or withdrawn.

We reserve the right to remove any listing that violates these obligations without refund.`,
    },
    {
      id: "prohibited",
      title: "6. Prohibited Uses",
      content: `You must not use the Service to:

• Post false, misleading, or fraudulent job listings.
• Harvest or scrape personal data of other users.
• Send unsolicited communications (spam) to other users.
• Impersonate any person, organisation, or regulatory body.
• Distribute malware, viruses, or any malicious code.
• Circumvent, disable, or interfere with security features.
• Engage in any activity that violates UK law or regulation, including the Modern Slavery Act 2015, the National Minimum Wage Act 1998, and the Conduct of Employment Agencies and Employment Businesses Regulations 2003.

Violations may result in immediate account suspension, data preservation, and referral to law enforcement.`,
    },
    {
      id: "ip",
      title: "7. Intellectual Property",
      content: `All content on the Service — including but not limited to design, text, graphics, logos, and software — is owned by or licensed to Caregivers Network and protected by UK and international copyright, trademark, and other intellectual property laws.

You may access and use the Service for personal, non-commercial job-seeking or recruitment purposes only. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.

By submitting content (e.g. job listings, profile information) to the Service, you grant us a non-exclusive, royalty-free, worldwide licence to use, display, and distribute that content for the purposes of operating the Service.`,
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      content: `Caregivers Network acts as a platform connecting job seekers and employers. We do not guarantee the accuracy of job listings, the suitability of candidates, or the outcome of any application or hiring process.

To the maximum extent permitted by UK law, we exclude all liability for:

• Loss of employment opportunity or income.
• Reliance on inaccurate or outdated job listings.
• Conduct of employers, recruiters, or other users on the platform.
• Indirect, consequential, or punitive damages of any kind.

Our total liability to you for any claim arising from use of the Service shall not exceed £100 or the amount you paid us in the 12 months preceding the claim, whichever is greater.

Nothing in these terms limits our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded by law.`,
    },
    {
      id: "termination",
      title: "9. Termination",
      content: `You may close your account at any time by contacting us or using the account settings. We may suspend or terminate your access immediately and without notice if you breach these terms, engage in fraudulent activity, or if we are required to do so by law.

Upon termination, your right to use the Service ceases. Provisions that by their nature should survive termination (including intellectual property, limitation of liability, and governing law) will remain in effect.`,
    },
    {
      id: "governing-law",
      title: "10. Governing Law & Disputes",
      content: `These Terms of Use are governed by the laws of England and Wales. Any disputes arising from or relating to these terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of England and Wales.

We encourage you to contact us first to resolve any dispute informally at legal@caregivernetwork.co.uk. We aim to respond within 5 business days.

If you are a consumer, you may also have the right to use the Online Dispute Resolution platform provided by the European Commission (where applicable) or to seek resolution through the UK courts.`,
    },
  ],
};

function AccordionItem({ section, isOpen, onToggle }) {
  return (
    <div className={`legal-accordion-item ${isOpen ? "open" : ""}`}>
      <button className="legal-accordion-trigger" onClick={onToggle}>
        <span>{section.title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="legal-accordion-body">
          {section.content.split("\n\n").map((para, i) => (
            <p key={i} style={{ whiteSpace: "pre-line" }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LegalPage() {
  const [tab, setTab] = useState("privacy");
  const [openSection, setOpenSection] = useState("intro");

  const sections = SECTIONS[tab];

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-hero-icon">
            {tab === "privacy" ? <Shield size={32} /> : <FileText size={32} />}
          </div>
          <h1>{tab === "privacy" ? "Privacy Policy" : "Terms of Use"}</h1>
          <p className="legal-updated">Last updated: 4 June 2025</p>
        </div>
      </div>

      <div className="legal-container">
        {/* Tab switcher */}
        <div className="legal-tabs">
          <button
            className={`legal-tab ${tab === "privacy" ? "active" : ""}`}
            onClick={() => {
              setTab("privacy");
              setOpenSection("intro");
            }}
          >
            <Shield size={16} />
            Privacy Policy
          </button>
          <button
            className={`legal-tab ${tab === "terms" ? "active" : ""}`}
            onClick={() => {
              setTab("terms");
              setOpenSection("acceptance");
            }}
          >
            <FileText size={16} />
            Terms of Use
          </button>
        </div>

        <div className="legal-body">
          {/* Quick nav */}
          <aside className="legal-nav">
            <p className="legal-nav-label">Jump to</p>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    className={openSection === s.id ? "active" : ""}
                    onClick={() => setOpenSection(s.id)}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Accordion */}
          <div className="legal-content">
            {sections.map((s) => (
              <AccordionItem
                key={s.id}
                section={s}
                isOpen={openSection === s.id}
                onToggle={() =>
                  setOpenSection(openSection === s.id ? null : s.id)
                }
              />
            ))}

            <div className="legal-contact-card">
              <h3>Questions or Concerns?</h3>
              <p>
                If you have any questions about our{" "}
                {tab === "privacy" ? "Privacy Policy" : "Terms of Use"}, please
                reach out:
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {tab === "privacy"
                  ? "privacy@caregivernetwork.co.uk"
                  : "legal@caregivernetwork.co.uk"}
                <br />
                <strong>ICO Registration:</strong> ZB123456 (placeholder)
                <br />
                <strong>Address:</strong> Caregivers Network Ltd, [Your Address],
                United Kingdom
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .legal-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Georgia', serif;
        }

        .legal-hero {
          background: linear-gradient(135deg, #0f4c81 0%, #1a73b8 100%);
          color: white;
          padding: 56px 24px 40px;
          text-align: center;
        }

        .legal-hero-inner {
          max-width: 680px;
          margin: 0 auto;
        }

        .legal-hero-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: rgba(255,255,255,0.15);
          border-radius: 16px;
          margin-bottom: 16px;
        }

        .legal-hero h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .legal-updated {
          opacity: 0.75;
          font-size: 0.875rem;
          margin: 0;
          font-style: italic;
        }

        .legal-container {
          max-width: 1080px;
          margin: 0 auto;
          padding: 32px 24px 80px;
        }

        .legal-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0;
        }

        .legal-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .legal-tab:hover { color: #0f4c81; }

        .legal-tab.active {
          color: #0f4c81;
          border-bottom-color: #0f4c81;
        }

        .legal-body {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 40px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .legal-body { grid-template-columns: 1fr; }
          .legal-nav { display: none; }
        }

        .legal-nav {
          position: sticky;
          top: 24px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
        }

        .legal-nav-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          margin: 0 0 12px;
        }

        .legal-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .legal-nav ul li button {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 6px 10px;
          font-size: 0.8125rem;
          color: #475569;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.15s;
          font-family: inherit;
          line-height: 1.4;
        }

        .legal-nav ul li button:hover {
          background: #f1f5f9;
          color: #0f4c81;
        }

        .legal-nav ul li button.active {
          background: #eff6ff;
          color: #0f4c81;
          font-weight: 600;
        }

        .legal-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .legal-accordion-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .legal-accordion-item.open {
          box-shadow: 0 4px 16px rgba(15, 76, 129, 0.08);
          border-color: #bfdbfe;
        }

        .legal-accordion-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 16px 20px;
          background: none;
          border: none;
          text-align: left;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }

        .legal-accordion-trigger:hover { background: #f8fafc; }
        .legal-accordion-item.open .legal-accordion-trigger { color: #0f4c81; }

        .legal-accordion-body {
          padding: 0 20px 20px;
          border-top: 1px solid #f1f5f9;
        }

        .legal-accordion-body p {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.75;
          margin: 14px 0 0;
        }

        .legal-contact-card {
          background: linear-gradient(135deg, #eff6ff, #f0fdf4);
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 24px;
          margin-top: 16px;
        }

        .legal-contact-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f4c81;
          margin: 0 0 10px;
        }

        .legal-contact-card p {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.7;
          margin: 0 0 8px;
        }

        .legal-contact-card p:last-child { margin-bottom: 0; }
      `}</style>
    </div>
  );
}
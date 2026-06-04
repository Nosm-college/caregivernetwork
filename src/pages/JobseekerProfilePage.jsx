import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { uploadToR2, validateFile } from "../utils/r2Upload";
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  GraduationCap,
  Calendar,
  Car,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2,
} from "lucide-react";
import "./JobseekerProfilePage.css";

// ─── Section config ──────────────────────────────────────────
const SECTIONS = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "jobPreferences", label: "Job Preferences", icon: Briefcase },
  {
    id: "experience",
    label: "Experience & Qualifications",
    icon: GraduationCap,
  },
  { id: "availability", label: "Availability", icon: Calendar },
  { id: "transport", label: "Driving & Transport", icon: Car },
  { id: "documents", label: "Documents & Certificates", icon: FileText },
];

const DOC_FIELDS = [
  {
    key: "cv",
    label: "CV / Resume",
    required: true,
    hint: "PDF or Word, max 5MB",
  },
  {
    key: "coverLetter",
    label: "Cover Letter",
    required: false,
    hint: "PDF or Word, max 3MB",
  },
  {
    key: "careCertificate",
    label: "Care Certificate / QQI L5",
    required: false,
    hint: "PDF or image, max 10MB",
  },
  {
    key: "references",
    label: "References",
    required: false,
    hint: "PDF or Word, max 5MB",
  },
];

const ROLE_OPTIONS = [
  "Care Assistant",
  "Support Worker",
  "Senior Carer",
  "Healthcare Assistant",
  "Nurse",
  "Mental Health Support",
  "Domiciliary Carer",
  "Live-in Carer",
  "Nursery Nurse",
  "Social Worker",
  "Occupational Therapist",
  "Physiotherapist",
];

const HOURS_OPTIONS = ["Full-time", "Part-time", "Either"];
const SHIFT_OPTIONS = ["Days", "Nights", "Evenings", "Weekends", "Flexible"];
const NOTICE_OPTIONS = [
  "Immediately",
  "1 week",
  "2 weeks",
  "1 month",
  "3 months",
];
const EXPERIENCE_OPTIONS = [
  "No experience",
  "Under 1 year",
  "1–2 years",
  "3–5 years",
  "5+ years",
];
const QUAL_OPTIONS = [
  "Care Certificate",
  "QQI Level 5",
  "NVQ Level 2",
  "NVQ Level 3",
  "DBS Check (Enhanced)",
  "First Aid",
  "Manual Handling",
  "Medication Trained",
  "Dementia Care",
  "Palliative Care",
  "None yet",
];

const emptyProfile = {
  // personal
  phone: "",
  location: "",
  postcode: "",
  // job prefs
  desiredRoles: [],
  preferredHours: "",
  preferredLocations: "",
  willingToRelocate: false,
  // experience
  yearsExperience: "",
  qualifications: [],
  summary: "",
  // availability
  availableFrom: "",
  shiftPreferences: [],
  noticePeriod: "",
  // transport
  hasDrivingLicence: "",
  hasOwnCar: "",
  willingToTravel: "",
  // documents (URLs stored here)
  documents: {
    cv: null,
    coverLetter: null,
    careCertificate: null,
    references: null,
  },
};

// ─── Component ───────────────────────────────────────────────
export default function JobseekerProfilePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
const navigate = useNavigate();
const applyingToJobId = searchParams.get('applyTo');
  const [profile, setProfile] = useState(emptyProfile);
  const [openSections, setOpenSections] = useState({ personal: true });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error'
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadState, setUploadState] = useState({}); // { [docKey]: { progress, error, uploading } }
  const [completeness, setCompleteness] = useState(0);

  // Load existing profile from Firestore
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists() && snap.data().profile) {
          setProfile({ ...emptyProfile, ...snap.data().profile });
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [user]);

  // Calculate completeness
  useEffect(() => {
    const checks = [
      profile.phone,
      profile.location,
      profile.desiredRoles.length > 0,
      profile.preferredHours,
      profile.yearsExperience,
      profile.summary,
      profile.availableFrom,
      profile.shiftPreferences.length > 0,
      profile.hasDrivingLicence !== "",
      profile.documents.cv,
    ];
    const filled = checks.filter(Boolean).length;
    setCompleteness(Math.round((filled / checks.length) * 100));
  }, [profile]);

  const toggleSection = (id) =>
    setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  const set = (field, value) => setProfile((p) => ({ ...p, [field]: value }));

  const toggleArrayItem = (field, item) =>
    setProfile((p) => {
      const arr = p[field];
      return {
        ...p,
        [field]: arr.includes(item)
          ? arr.filter((x) => x !== item)
          : [...arr, item],
      };
    });

  // Save all text/select answers to Firestore
  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { profile: { ...profile, updatedAt: serverTimestamp() } },
        { merge: true },
      );
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      console.error(e);
      setSaveStatus("error");
    }
    setSaving(false);
  };

  // Upload a document to R2, then save its URL to Firestore
  const handleDocUpload = async (docKey, file) => {
    const validationError = validateFile(file, docKey);
    if (validationError) {
      setUploadState((p) => ({ ...p, [docKey]: { error: validationError } }));
      return;
    }

    setUploadState((p) => ({
      ...p,
      [docKey]: { uploading: true, progress: 0, error: null },
    }));

    try {
      const publicUrl = await uploadToR2(file, user.uid, docKey, (pct) => {
        setUploadState((p) => ({
          ...p,
          [docKey]: { uploading: true, progress: pct },
        }));
      });

      // Save URL to Firestore under the user's profile
      const updatedDocs = { ...profile.documents, [docKey]: publicUrl };
      setProfile((p) => ({ ...p, documents: updatedDocs }));
      await setDoc(
        doc(db, "users", user.uid),
        { profile: { documents: updatedDocs, updatedAt: serverTimestamp() } },
        { merge: true },
      );

      setUploadState((p) => ({
        ...p,
        [docKey]: { uploading: false, progress: 100, error: null },
      }));
    } catch (e) {
      setUploadState((p) => ({
        ...p,
        [docKey]: { uploading: false, error: e.message },
      }));
    }
  };

  const handleDocRemove = async (docKey) => {
    const updatedDocs = { ...profile.documents, [docKey]: null };
    setProfile((p) => ({ ...p, documents: updatedDocs }));
    setUploadState((p) => ({ ...p, [docKey]: {} }));
    await setDoc(
      doc(db, "users", user.uid),
      { profile: { documents: updatedDocs, updatedAt: serverTimestamp() } },
      { merge: true },
    );
  };

  if (loadingProfile) {
    return (
      <div className="profile-loading">
        <Loader2 size={32} className="spin" />
        <p>Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-inner">
          <div className="profile-avatar">
            {user?.displayName?.[0]?.toUpperCase() || "J"}
          </div>
          <div>
            <h1 className="profile-name">
              {user?.displayName || "Your Profile"}
            </h1>
            <p className="profile-email">{user?.email}</p>
          </div>
          <div className="profile-completeness">
            <div className="completeness-ring">
              <svg viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#e8eef5"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="var(--p-teal)"
                  strokeWidth="3"
                  strokeDasharray={`${completeness} ${100 - completeness}`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
              <span>{completeness}%</span>
            </div>
            <div>
              <p className="completeness-label">Profile complete</p>
              {completeness < 100 && (
                <p className="completeness-sub">
                  Fill all sections to stand out
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
{applyingToJobId && (
  <div className="apply-banner">
    <CheckCircle2 size={18} />
    <div>
      <strong>You're applying for a job</strong>
      <p>Complete your profile below, then click Submit Application.</p>
    </div>
    <button
      className="submit-application-btn"
      onClick={async () => {
        await handleSave();
        // Save the application to Firestore
        await setDoc(doc(db, 'applications', `${user.uid}_${applyingToJobId}`), {
          userId: user.uid,
          jobId: applyingToJobId,
          appliedAt: serverTimestamp(),
          status: 'pending',
          cvUrl: profile.documents.cv || null,
        }, { merge: true });
        navigate(`/jobs/${applyingToJobId}?applied=true`);
      }}
    >
      Submit Application →
    </button>
  </div>
)}
      <div className="profile-body">
        {/* Accordion sections */}
        <div className="profile-sections">
          {/* ── 1. Personal Info ── */}
          <Section
            id="personal"
            open={openSections.personal}
            toggle={toggleSection}
          >
            <Field label="Phone Number" icon={Phone}>
              <input
                type="tel"
                placeholder="+44 7700 900000"
                value={profile.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <Field label="Town / City" icon={MapPin}>
              <input
                type="text"
                placeholder="e.g. Manchester"
                value={profile.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </Field>
            <Field label="Postcode" icon={MapPin}>
              <input
                type="text"
                placeholder="e.g. M1 1AE"
                value={profile.postcode}
                onChange={(e) => set("postcode", e.target.value)}
              />
            </Field>
          </Section>

          {/* ── 2. Job Preferences ── */}
          <Section
            id="jobPreferences"
            open={openSections.jobPreferences}
            toggle={toggleSection}
          >
            <Field
              label="Desired Role(s) — select all that apply"
              icon={Briefcase}
            >
              <div className="chip-grid">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`chip ${profile.desiredRoles.includes(r) ? "chip-active" : ""}`}
                    onClick={() => toggleArrayItem("desiredRoles", r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Preferred Hours" icon={Clock}>
              <div className="radio-group">
                {HOURS_OPTIONS.map((h) => (
                  <label key={h} className="radio-label">
                    <input
                      type="radio"
                      name="preferredHours"
                      value={h}
                      checked={profile.preferredHours === h}
                      onChange={() => set("preferredHours", h)}
                    />
                    {h}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Preferred Work Locations" icon={MapPin}>
              <input
                type="text"
                placeholder="e.g. Manchester, Salford, Trafford"
                value={profile.preferredLocations}
                onChange={(e) => set("preferredLocations", e.target.value)}
              />
              <span className="field-hint">
                Separate multiple areas with commas
              </span>
            </Field>
            <Field label="Willing to Relocate?" icon={MapPin}>
              <div className="radio-group">
                {["Yes", "No", "Maybe"].map((v) => (
                  <label key={v} className="radio-label">
                    <input
                      type="radio"
                      name="relocate"
                      value={v}
                      checked={profile.willingToRelocate === v}
                      onChange={() => set("willingToRelocate", v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </Field>
          </Section>

          {/* ── 3. Experience & Qualifications ── */}
          <Section
            id="experience"
            open={openSections.experience}
            toggle={toggleSection}
          >
            <Field label="Years of Care Experience" icon={GraduationCap}>
              <div className="radio-group flex-wrap">
                {EXPERIENCE_OPTIONS.map((e) => (
                  <label key={e} className="radio-label">
                    <input
                      type="radio"
                      name="yearsExperience"
                      value={e}
                      checked={profile.yearsExperience === e}
                      onChange={() => set("yearsExperience", e)}
                    />
                    {e}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Qualifications & Certifications" icon={GraduationCap}>
              <div className="chip-grid">
                {QUAL_OPTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={`chip ${profile.qualifications.includes(q) ? "chip-active" : ""}`}
                    onClick={() => toggleArrayItem("qualifications", q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Personal Statement / Summary" icon={User}>
              <textarea
                rows={5}
                placeholder="Tell employers about yourself, your experience, and why you're passionate about care…"
                value={profile.summary}
                onChange={(e) => set("summary", e.target.value)}
              />
              <span className="field-hint">
                {profile.summary.length} / 1000 characters
              </span>
            </Field>
          </Section>

          {/* ── 4. Availability ── */}
          <Section
            id="availability"
            open={openSections.availability}
            toggle={toggleSection}
          >
            <Field label="Available From" icon={Calendar}>
              <input
                type="date"
                value={profile.availableFrom}
                onChange={(e) => set("availableFrom", e.target.value)}
              />
            </Field>
            <Field
              label="Shift Preferences — select all that apply"
              icon={Clock}
            >
              <div className="chip-grid">
                {SHIFT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip ${profile.shiftPreferences.includes(s) ? "chip-active" : ""}`}
                    onClick={() => toggleArrayItem("shiftPreferences", s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Notice Period" icon={Calendar}>
              <div className="radio-group flex-wrap">
                {NOTICE_OPTIONS.map((n) => (
                  <label key={n} className="radio-label">
                    <input
                      type="radio"
                      name="noticePeriod"
                      value={n}
                      checked={profile.noticePeriod === n}
                      onChange={() => set("noticePeriod", n)}
                    />
                    {n}
                  </label>
                ))}
              </div>
            </Field>
          </Section>

          {/* ── 5. Driving & Transport ── */}
          <Section
            id="transport"
            open={openSections.transport}
            toggle={toggleSection}
          >
            <Field
              label="Do you hold a valid UK/EU driving licence?"
              icon={Car}
            >
              <div className="radio-group">
                {["Yes", "No", "Provisional"].map((v) => (
                  <label key={v} className="radio-label">
                    <input
                      type="radio"
                      name="hasDrivingLicence"
                      value={v}
                      checked={profile.hasDrivingLicence === v}
                      onChange={() => set("hasDrivingLicence", v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Do you have access to your own vehicle?" icon={Car}>
              <div className="radio-group">
                {["Yes", "No"].map((v) => (
                  <label key={v} className="radio-label">
                    <input
                      type="radio"
                      name="hasOwnCar"
                      value={v}
                      checked={profile.hasOwnCar === v}
                      onChange={() => set("hasOwnCar", v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Willing to travel for work?" icon={Car}>
              <div className="radio-group flex-wrap">
                {[
                  "Up to 5 miles",
                  "Up to 10 miles",
                  "Up to 20 miles",
                  "20+ miles",
                  "No preference",
                ].map((v) => (
                  <label key={v} className="radio-label">
                    <input
                      type="radio"
                      name="willingToTravel"
                      value={v}
                      checked={profile.willingToTravel === v}
                      onChange={() => set("willingToTravel", v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </Field>
          </Section>

          {/* ── 6. Documents ── */}
          <Section
            id="documents"
            open={openSections.documents}
            toggle={toggleSection}
          >
            <p className="doc-intro">
              Documents are stored securely. Only employers you apply to can
              view them.
            </p>
            <div className="doc-grid">
              {DOC_FIELDS.map(({ key, label, required, hint }) => {
                const us = uploadState[key] || {};
                const existingUrl = profile.documents[key];
                return (
                  <DocUploader
                    key={key}
                    docKey={key}
                    label={label}
                    required={required}
                    hint={hint}
                    existingUrl={existingUrl}
                    uploadState={us}
                    onUpload={handleDocUpload}
                    onRemove={handleDocRemove}
                  />
                );
              })}
            </div>
          </Section>
        </div>

        {/* Sticky save bar */}
        <div className="save-bar">
          {saveStatus === "success" && (
            <span className="save-msg save-ok">
              <CheckCircle2 size={16} /> Profile saved!
            </span>
          )}
          {saveStatus === "error" && (
            <span className="save-msg save-err">
              <AlertCircle size={16} /> Save failed. Try again.
            </span>
          )}
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={18} className="spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={18} /> Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function Section({ id, open, toggle, children }) {
  const sec = SECTIONS.find((s) => s.id === id);
  const Icon = sec.icon;
  return (
    <div className={`profile-section ${open ? "open" : ""}`}>
      <button className="section-header" onClick={() => toggle(id)}>
        <span className="section-icon">
          <Icon size={18} />
        </span>
        <span className="section-label">{sec.label}</span>
        {open ? (
          <ChevronUp size={18} className="chevron" />
        ) : (
          <ChevronDown size={18} className="chevron" />
        )}
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="profile-field">
      <label className="pf-label">
        {Icon && <Icon size={14} />}
        {label}
      </label>
      <div className="pf-control">{children}</div>
    </div>
  );
}

function DocUploader({
  docKey,
  label,
  required,
  hint,
  existingUrl,
  uploadState,
  onUpload,
  onRemove,
}) {
  const inputRef = useRef();
  const { uploading, progress, error } = uploadState;

  return (
    <div className={`doc-card ${existingUrl ? "doc-uploaded" : ""}`}>
      <div className="doc-card-top">
        <div>
          <p className="doc-label">
            {label}
            {required && <span className="doc-required">Required</span>}
          </p>
          <p className="doc-hint">{hint}</p>
        </div>
        <FileText size={22} className="doc-icon" />
      </div>

      {existingUrl ? (
        <div className="doc-uploaded-row">
          <CheckCircle2 size={16} className="doc-check" />
          <span>Uploaded</span>
          <a
            href={existingUrl}
            target="_blank"
            rel="noreferrer"
            className="doc-view"
          >
            View <ExternalLink size={12} />
          </a>
          <button className="doc-remove" onClick={() => onRemove(docKey)}>
            <Trash2 size={14} />
          </button>
        </div>
      ) : uploading ? (
        <div className="doc-progress">
          <div className="doc-progress-bar">
            <div
              className="doc-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{progress}%</span>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={
              docKey === "careCertificate"
                ? ".pdf,.jpg,.jpeg,.png"
                : ".pdf,.doc,.docx"
            }
            style={{ display: "none" }}
            onChange={(e) =>
              e.target.files[0] && onUpload(docKey, e.target.files[0])
            }
          />
          <button
            className="doc-upload-btn"
            onClick={() => inputRef.current.click()}
          >
            <Upload size={15} /> Choose File
          </button>
        </>
      )}

      {error && (
        <p className="doc-error">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

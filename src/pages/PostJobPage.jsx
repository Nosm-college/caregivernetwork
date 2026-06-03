import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../firebase/jobs';
import { JOB_CATEGORIES, UK_LOCATIONS, CONTRACT_TYPES, SALARY_RANGES } from '../data/categories';
import { Loader2, CheckCircle } from 'lucide-react';

const INITIAL = {
  title: '', company: '', category: '', location: '', contractType: '',
  salary: '', salaryRange: '', description: '', requirements: '', benefits: '',
};

export default function PostJobPage() {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.company || !form.category || !form.location) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').map(s => s.trim()).filter(Boolean),
        benefits: form.benefits.split('\n').map(s => s.trim()).filter(Boolean),
        isVacant: true,
        featured: false,
      };
      const id = await createJob(payload);
      setSuccess(true);
      setTimeout(() => navigate(`/job/${id}`), 2000);
    } catch (err) {
      setError('Failed to post job: ' + err.message);
    }
    setSubmitting(false);
  };

  if (success) return (
    <div className="post-success">
      <CheckCircle size={56} className="success-icon" />
      <h2>Job Posted Successfully!</h2>
      <p>Redirecting to your job listing...</p>
    </div>
  );

  return (
    <div className="post-page">
      <div className="post-inner">
        <div className="post-heading">
          <h1>Post a Job</h1>
          <p>Reach thousands of UK healthcare and care professionals</p>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-row">
            <FormField label="Job Title *" name="title" placeholder="e.g. Care Assistant" value={form.title} onChange={handleChange} />
            <FormField label="Company Name *" name="company" placeholder="e.g. Sunrise Care Homes" value={form.company} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <select name="location" value={form.location} onChange={handleChange} required>
                <option value="">Select location</option>
                {UK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contract Type</label>
              <select name="contractType" value={form.contractType} onChange={handleChange}>
                <option value="">Select contract type</option>
                {CONTRACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Salary Range</label>
              <select name="salaryRange" value={form.salaryRange} onChange={handleChange}>
                <option value="">Select salary range</option>
                {SALARY_RANGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <FormField label="Specific Salary" name="salary" placeholder="e.g. £22,000 or £11.50/hr" value={form.salary} onChange={handleChange} />

          <div className="form-group">
            <label>Job Description *</label>
            <textarea name="description" rows={6} placeholder="Describe the role, responsibilities, and what a typical day looks like..." value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Requirements <span className="hint">(one per line)</span></label>
            <textarea name="requirements" rows={4} placeholder={"NVQ Level 2 preferred\nDBS check required\nFull UK driving licence"} value={form.requirements} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Benefits <span className="hint">(one per line)</span></label>
            <textarea name="benefits" rows={4} placeholder={"28 days holiday\nPension scheme\nFree DBS check"} value={form.benefits} onChange={handleChange} />
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? <><Loader2 size={18} className="spin" /> Posting...</> : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, name, placeholder, value, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type="text" name={name} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

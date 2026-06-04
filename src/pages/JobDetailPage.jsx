import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getJob, incrementViews } from '../firebase/jobs';
import { formatDistanceToNow, format } from 'date-fns';
import { MapPin, Clock, Briefcase, PoundSterling, AlertCircle, ChevronLeft, Eye, CheckCircle, Building2, Share2 } from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
const [searchParams] = useSearchParams();
const applied = searchParams.get('applied');
  useEffect(() => {
    async function load() {
      try {
        const data = await getJob(id);
        setJob(data);
        if (data) incrementViews(id).catch(() => {});
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="detail-loading"><div className="spinner" /></div>;
  if (!job) return <div className="detail-notfound"><h2>Job not found</h2><Link to="/">← Back to jobs</Link></div>;

  const postedDate = job.createdAt?.toDate ? job.createdAt.toDate() : new Date(job.createdAt);
  const closedDate = job.closedAt?.toDate ? job.closedAt.toDate() : null;

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <Link to="/" className="back-link"><ChevronLeft size={16} /> Back to Jobs</Link>

        <div className="detail-layout">
          {/* Main content */}
          <div className="detail-main">
            {!job.isVacant && (
              <div className="closed-alert">
                <AlertCircle size={18} />
                <div>
                  <strong>This position is no longer vacant</strong>
                  {closedDate && <p>Closed on {format(closedDate, 'dd MMMM yyyy')}</p>}
                </div>
              </div>
            )}

            <div className="detail-header">
              <div className="detail-logo">{job.company?.[0]?.toUpperCase() || 'J'}</div>
              <div>
                <h1 className="detail-title">{job.title}</h1>
                <p className="detail-company"><Building2 size={15} /> {job.company}</p>
              </div>
            </div>

            <div className="detail-meta-row">
              <span><MapPin size={14} />{job.location}</span>
              <span><Briefcase size={14} />{job.contractType}</span>
              {job.salary && <span><PoundSterling size={14} />{job.salary}</span>}
              <span><Clock size={14} />Posted {formatDistanceToNow(postedDate, { addSuffix: true })}</span>
              {job.views > 0 && <span><Eye size={14} />{job.views} views</span>}
            </div>

            <div className="detail-section">
              <h2>Job Description</h2>
              <p className="detail-description">{job.description}</p>
            </div>

            {job.requirements?.length > 0 && (
              <div className="detail-section">
                <h2>Requirements</h2>
                <ul className="detail-list">
                  {job.requirements.map((r, i) => (
                    <li key={i}><CheckCircle size={14} className="check-icon" />{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits?.length > 0 && (
              <div className="detail-section">
                <h2>Benefits</h2>
                <ul className="detail-list benefits-list">
                  {job.benefits.map((b, i) => (
                    <li key={i}><CheckCircle size={14} className="check-icon green" />{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="apply-card">
              <div className="apply-card-info">
                <p><strong>Category</strong></p>
                <p className="apply-category">{job.category}</p>
                <hr />
                <p><strong>Location</strong></p>
                <p>{job.location}, UK</p>
                <hr />
                <p><strong>Contract</strong></p>
                <p>{job.contractType}</p>
                {job.salary && (<><hr /><p><strong>Salary</strong></p><p>{job.salary}</p></>)}
                {job.salaryRange && (<><hr /><p><strong>Salary Range</strong></p><p>{job.salaryRange}</p></>)}
                <hr />
                <p><strong>Posted</strong></p>
                <p>{format(postedDate, 'dd MMM yyyy')}</p>
                <hr />
                <p><strong>Status</strong></p>
                <p className={job.isVacant ? 'status-open' : 'status-closed'}>
                  {job.isVacant ? '✅ Actively Hiring' : '🔴 No Longer Vacant'}
                </p>
              </div>
{applied && (
  <div className="apply-success">
    <CheckCircle size={18} /> Application submitted successfully!
  </div>
)}
              {job.isVacant ? (
  <button 
    className="apply-btn-main"
    onClick={() => navigate(`/profile?applyTo=${job.id}`)}
  >
    Apply Now →
  </button>
) : (
                <div className="closed-note">
                  <AlertCircle size={16} />
                  This vacancy has been filled
                </div>
              )}

              <button className="share-btn" onClick={() => navigator.share?.({ title: job.title, url: window.location.href }) || navigator.clipboard.writeText(window.location.href)}>
                <Share2 size={14} /> Share Job
              </button>
            </div>

            <div className="similar-label">
              <Link to={`/?category=${encodeURIComponent(job.category)}`} className="similar-jobs-link">
                View more {job.category} jobs →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

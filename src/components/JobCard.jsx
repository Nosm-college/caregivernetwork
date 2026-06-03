import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, PoundSterling, Star, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function getDaysAgo(timestamp) {
  if (!timestamp) return 'Just posted';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
}

export default function JobCard({ job }) {
  const {
    id, title, company, location, contractType, salary, salaryRange,
    category, isVacant, featured, createdAt, description
  } = job;

  const snippet = description ? description.slice(0, 130) + '...' : '';

  return (
    <Link to={`/job/${id}`} className={`job-card ${!isVacant ? 'job-card--closed' : ''} ${featured ? 'job-card--featured' : ''}`}>
      {featured && isVacant && (
        <span className="featured-badge"><Star size={11} /> Featured</span>
      )}
      {!isVacant && (
        <div className="vacancy-closed-banner">
          <AlertCircle size={14} /> Position No Longer Vacant
        </div>
      )}

      <div className="job-card-header">
        <div className="company-logo">
          {company ? company[0].toUpperCase() : 'J'}
        </div>
        <div>
          <h3 className="job-title">{title}</h3>
          <p className="company-name">{company}</p>
        </div>
      </div>

      <p className="job-snippet">{snippet}</p>

      <div className="job-tags">
        <span className="tag tag--category"><Briefcase size={12} />{category}</span>
        <span className="tag tag--location"><MapPin size={12} />{location}</span>
        {contractType && <span className="tag tag--contract">{contractType}</span>}
        {salary && <span className="tag tag--salary"><PoundSterling size={12} />{salary}</span>}
      </div>

      <div className="job-footer">
        <span className="days-posted"><Clock size={12} /> {getDaysAgo(createdAt)}</span>
        {isVacant
          ? <span className="apply-btn">View & Apply →</span>
          : <span className="closed-label">Closed</span>
        }
      </div>
    </Link>
  );
}

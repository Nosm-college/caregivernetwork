import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AccountPage.css';
import { User, Building2, Mail, Briefcase, LogOut, ChevronRight, Shield, Settings } from 'lucide-react';
export default function AccountPage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const initials = (profile?.displayName || user.displayName || user.email)
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const isEmployer = profile?.role === 'employer';

  return (
    <div className="account-page">
      <div className="account-inner">
        <h1 className="account-heading">My Account</h1>

        {/* Profile Card */}
        <div className="account-card profile-card">
          <div className="account-avatar">{initials}</div>
          <div className="account-info">
            <h2>{profile?.displayName || user.displayName || 'User'}</h2>
            <p className="account-role-badge">
              {isEmployer ? <><Building2 size={13} /> Employer</> : <><User size={13} /> Job Seeker</>}
            </p>
            {isEmployer && profile?.company && (
              <p className="account-company"><Building2 size={14} /> {profile.company}</p>
            )}
            <p className="account-email"><Mail size={14} /> {user.email}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="account-section-title">Quick Actions</div>
        <div className="account-card account-actions">
          {isEmployer && (
            <Link to="/post-job" className="account-action-item">
              <div className="action-icon employer-icon"><Briefcase size={18} /></div>
              <div>
                <p className="action-title">Post a New Job</p>
                <p className="action-sub">Advertise a vacancy to thousands of care professionals</p>
              </div>
              <ChevronRight size={18} className="action-chevron" />
            </Link>
          )}

          <Link to="/" className="account-action-item">
            <div className="action-icon browse-icon"><Briefcase size={18} /></div>
            <div>
              <p className="action-title">Browse Jobs</p>
              <p className="action-sub">Search all available care roles across the UK</p>
            </div>
            <ChevronRight size={18} className="action-chevron" />
          </Link>

          <Link to="/categories" className="account-action-item">
            <div className="action-icon cat-icon"><Settings size={18} /></div>
            <div>
              <p className="action-title">Browse Categories</p>
              <p className="action-sub">Explore all 131 healthcare job categories</p>
            </div>
            <ChevronRight size={18} className="action-chevron" />
          </Link>
        </div>

        {/* Account Details */}
        <div className="account-section-title">Account Details</div>
        <div className="account-card account-details">
          <div className="detail-row">
            <span className="detail-label"><User size={14} /> Full Name</span>
            <span className="detail-value">{profile?.displayName || user.displayName || '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label"><Mail size={14} /> Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label"><Shield size={14} /> Account Type</span>
            <span className="detail-value">{isEmployer ? 'Employer' : 'Job Seeker'}</span>
          </div>
          {isEmployer && profile?.company && (
            <div className="detail-row">
              <span className="detail-label"><Building2 size={14} /> Company</span>
              <span className="detail-value">{profile.company}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label"><Settings size={14} /> Member Since</span>
            <span className="detail-value">
              {profile?.createdAt?.toDate
                ? profile.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            </span>
          </div>
        </div>

        {/* Sign Out */}
        <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
          <LogOut size={16} />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
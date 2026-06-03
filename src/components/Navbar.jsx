import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X, Search, User, LogOut, ChevronDown, Building2, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const dropRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/?search=${encodeURIComponent(searchVal.trim())}`);
  };

  const handleLogout = async () => {
    setDropOpen(false);
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const initials = user
    ? (profile?.displayName || user.displayName || user.email)
        .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const isEmployer = profile?.role === 'employer';
  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || '';
  const companyName = isEmployer && profile?.company ? profile.company : null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <img src="/src/assets/logo.png" alt="CareJobsUK Logo" className="logo" />
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Job title or keyword..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
          <button type="submit"><Search size={16} /></button>
        </form>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/">Browse Jobs</Link>
          <Link to="/categories">Categories</Link>

          {user ? (
            <>
              {isEmployer && (
                <Link to="/post-job" className="btn-post-job">Post a Job</Link>
              )}

              {/* User dropdown */}
              <div className="user-dropdown" ref={dropRef}>
                <button
                  className="user-pill"
                  onClick={() => setDropOpen(p => !p)}
                  aria-expanded={dropOpen}
                >
                  <div className="user-avatar">{initials}</div>
                  <div className="user-pill-info">
                    <span className="user-pill-name">{displayName}</span>
                    {companyName && <span className="user-pill-company">{companyName}</span>}
                  </div>
                  <ChevronDown size={14} className={`drop-arrow ${dropOpen ? 'open' : ''}`} />
                </button>

                {dropOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="drop-name">{displayName}</p>
                      <p className="drop-role">
                        {isEmployer
                          ? <><Building2 size={12} /> Employer{companyName ? ` · ${companyName}` : ''}</>
                          : <><User size={12} /> Job Seeker</>}
                      </p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/account" className="drop-item" onClick={() => setDropOpen(false)}>
                      <Settings size={15} /> My Account
                    </Link>
                    {isEmployer && (
                      <Link to="/post-job" className="drop-item" onClick={() => setDropOpen(false)}>
                        <Briefcase size={15} /> Post a Job
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="drop-item drop-logout" onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-signin">Sign In</Link>
              <Link to="/register" className="btn-post-job">Register</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-search">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            <button type="submit"><Search size={16} /></button>
          </form>

          {user && (
            <div className="mobile-user-info">
              <div className="mobile-avatar">{initials}</div>
              <div>
                <p className="mobile-user-name">{displayName}</p>
                <p className="mobile-user-role">
                  {isEmployer ? `Employer${companyName ? ` · ${companyName}` : ''}` : 'Job Seeker'}
                </p>
              </div>
            </div>
          )}

          <Link to="/" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          <Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>

          {user ? (
            <>
              <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
              {isEmployer && (
                <Link to="/post-job" onClick={() => setMenuOpen(false)} className="btn-post-job-mobile">
                  Post a Job
                </Link>
              )}
              <button className="mobile-logout" onClick={handleLogout}>
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-post-job-mobile">
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

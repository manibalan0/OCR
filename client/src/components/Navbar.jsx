import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, LogOut, LayoutDashboard, Home, Plus, Activity, UserCheck } from 'lucide-react';

const Navbar = ({ onOpenNewComplaint }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'AGENT') return '/agent';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="floating-navbar">
      <Link to="/" className="brand-logo">
        <div className="brand-logo-icon">
          <Shield size={20} />
        </div>
        <span>OmniResolve</span>
      </Link>

      <div className="nav-links-group">
        <Link to="/" className={`nav-pill-link ${isActive('/') ? 'active' : ''}`}>
          <Home size={16} /> Home
        </Link>

        {user && (
          <Link
            to={getDashboardPath()}
            className={`nav-pill-link ${isActive(getDashboardPath()) ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} /> Workspace
          </Link>
        )}

        {user && user.role === 'USER' && (
          <button onClick={onOpenNewComplaint} className="btn-neon-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}>
            <Plus size={16} /> Submit Ticket
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {user ? (
          <div className="user-capsule">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-bright)' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--neon-cyan)', textTransform: 'uppercase' }}>
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                color: 'var(--text-muted)',
                marginLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
                borderRadius: '50%'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn-glass-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn-neon-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

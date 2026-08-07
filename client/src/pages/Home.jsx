import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Zap, Activity, ArrowRight, CheckCircle, MessageSquare, Layers, Lock } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'AGENT') return '/agent';
    return '/dashboard';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Hero Banner Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(37, 99, 235, 0.12)',
            color: 'var(--blue-light)',
            padding: '0.45rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '1.75rem',
            border: '1px solid var(--border-glass)'
          }}
        >
          <Zap size={16} /> OmniResolve Incident Intelligence v2.0
        </div>

        <h1
          style={{
            fontSize: '3.4rem',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            color: '#ffffff'
          }}
        >
          Next-Gen Complaint Desk &{' '}
          <span
            style={{
              background: 'var(--blue-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Resolution Platform
          </span>
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.15rem',
            lineHeight: '1.65',
            marginBottom: '2.5rem',
            maxWidth: '750px',
            margin: '0 auto 2.5rem auto'
          }}
        >
          Empower your enterprise with real-time ticket tracking, instant support room communication, automated workload routing, and executive analytics control.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to={getDashboardPath()} className="btn-neon-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
              Launch Control Workspace <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-neon-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
                Create Account <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-glass-secondary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Live System HUD Ring Ticker */}
      <section className="hud-metrics-grid">
        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#38bdf8' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Uptime Reliability</span>
            <div className="hud-metric-value">99.98%</div>
          </div>
          <div className="hud-metric-icon">
            <Activity size={26} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#10b981' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Avg. Resolution Speed</span>
            <div className="hud-metric-value">1.4 hrs</div>
          </div>
          <div className="hud-metric-icon">
            <Zap size={26} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#f59e0b' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Satisfaction Score</span>
            <div className="hud-metric-value">4.95 / 5</div>
          </div>
          <div className="hud-metric-icon">
            <ShieldCheck size={26} />
          </div>
        </div>
      </section>

      {/* Feature Command Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card glass-card-interactive" style={{ padding: '2rem' }}>
          <div className="hud-metric-icon" style={{ marginBottom: '1.25rem' }}>
            <Layers size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.6rem', color: '#ffffff' }}>
            Multi-View Kanban Workspace
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.55' }}>
            Switch effortlessly between interactive Kanban boards, spatial card grids, and high-density matrix views for instant clarity.
          </p>
        </div>

        <div className="glass-card glass-card-interactive" style={{ padding: '2rem' }}>
          <div className="hud-metric-icon" style={{ marginBottom: '1.25rem', color: '#38bdf8' }}>
            <MessageSquare size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.6rem', color: '#ffffff' }}>
            Instant Resolution Threads
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.55' }}>
            Real-time encrypted web-socket messaging between users and support specialists with direct feedback ratings.
          </p>
        </div>

        <div className="glass-card glass-card-interactive" style={{ padding: '2rem' }}>
          <div className="hud-metric-icon" style={{ marginBottom: '1.25rem', color: '#10b981' }}>
            <Lock size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.6rem', color: '#ffffff' }}>
            Enterprise Role Control
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.55' }}>
            Role-based privilege separation (User, Support Agent, System Admin) with SLA monitors and agent assignment dispatch.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

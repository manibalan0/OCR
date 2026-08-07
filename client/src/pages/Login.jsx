import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserCheck, Headset, Shield, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      if (result.role === 'ADMIN') navigate('/admin');
      else if (result.role === 'AGENT') navigate('/agent');
      else navigate('/dashboard');
    }
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'ADMIN') {
      setEmail('admin@coreresolvedesk.com');
      setPassword('admin123');
    } else if (demoRole === 'AGENT') {
      setEmail('agent@coreresolvedesk.com');
      setPassword('agent123');
    } else {
      setEmail('user@coreresolvedesk.com');
      setPassword('user123');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)', padding: '2rem 1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-logo-icon" style={{ width: '50px', height: '50px', margin: '0 auto 1rem auto', borderRadius: '14px' }}>
            <Shield size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Access OmniResolve Control Center
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="user@coreresolvedesk.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} /> Security Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-neon-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}>
            <LogIn size={18} />
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instant Demo Profiles
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button type="button" onClick={() => handleDemoLogin('USER')} className="btn-glass-secondary" style={{ fontSize: '0.75rem', padding: '0.45rem', justifyContent: 'center' }}>
              <UserCheck size={13} style={{ color: '#10b981' }} /> User
            </button>
            <button type="button" onClick={() => handleDemoLogin('AGENT')} className="btn-glass-secondary" style={{ fontSize: '0.75rem', padding: '0.45rem', justifyContent: 'center' }}>
              <Headset size={13} style={{ color: '#38bdf8' }} /> Agent
            </button>
            <button type="button" onClick={() => handleDemoLogin('ADMIN')} className="btn-glass-secondary" style={{ fontSize: '0.75rem', padding: '0.45rem', justifyContent: 'center' }}>
              <Shield size={13} style={{ color: '#2563eb' }} /> Admin
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--blue-light)', fontWeight: '700' }}>
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

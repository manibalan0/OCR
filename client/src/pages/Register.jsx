import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Shield, User, Mail, Lock, Phone } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('USER');
  const [department, setDepartment] = useState('Technical Support');

  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register({
      name,
      email,
      password,
      phone,
      role,
      department: role === 'AGENT' ? department : ''
    });

    if (result.success) {
      if (result.role === 'ADMIN') navigate('/admin');
      else if (result.role === 'AGENT') navigate('/agent');
      else navigate('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)', padding: '2rem 1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-logo-icon" style={{ width: '50px', height: '50px', margin: '0 auto 1rem auto', borderRadius: '14px' }}>
            <Shield size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Create Platform Account
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Join OmniResolve Incident Network
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Security Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 234 567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">End User</option>
                <option value="AGENT">Support Agent</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          {role === 'AGENT' && (
            <div className="form-group">
              <label className="form-label">Support Department</label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Technical Support">Technical Support</option>
                <option value="Billing Services">Billing Services</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Account Management">Account Management</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-neon-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.75rem' }}>
            <UserPlus size={18} />
            {loading ? 'Registering Account...' : 'Complete Registration'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--blue-light)', fontWeight: '700' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

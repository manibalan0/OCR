import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '../components/StatusBadge';
import { Shield, Users, Headset, Star, CheckCircle, RefreshCw, UserCheck, X, Save, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('complaints');
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, complaintsRes, agentsRes, usersRes, feedbacksRes] = await Promise.all([
        axios.get('/api/complaints/analytics/admin'),
        axios.get('/api/complaints'),
        axios.get('/api/auth/agents'),
        axios.get('/api/auth/users'),
        axios.get('/api/feedback')
      ]);

      setAnalytics(analyticsRes.data);
      setComplaints(complaintsRes.data);
      setAgents(agentsRes.data);
      setUsers(usersRes.data);
      setFeedbacks(feedbacksRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignClick = (c) => {
    setAssigningComplaint(c);
    setSelectedAgentId(c.agentId ? c.agentId._id : '');
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assigningComplaint || !selectedAgentId) return;

    try {
      setAssignLoading(true);
      await axios.put(`/api/complaints/${assigningComplaint._id}/assign`, {
        agentId: selectedAgentId
      });
      setAssignLoading(false);
      setAssigningComplaint(null);
      fetchData();
    } catch (err) {
      setAssignLoading(false);
      console.error(err);
    }
  };

  const summary = analytics?.summary || {};

  return (
    <div>
      {/* Admin Title Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={28} style={{ color: 'var(--blue-light)' }} /> Platform Control & Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Executive Operations, Agent Dispatch, and Satisfaction Governance
          </p>
        </div>
      </div>

      {/* Analytics HUD Grid */}
      <div className="hud-metrics-grid">
        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#2563eb' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Total Platform Complaints</span>
            <div className="hud-metric-value">{summary.totalComplaints || 0}</div>
          </div>
          <div className="hud-metric-icon">
            <BarChart2 size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#f59e0b' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Unassigned / Pending</span>
            <div className="hud-metric-value">{summary.pendingCount || 0}</div>
          </div>
          <div className="hud-metric-icon">
            <RefreshCw size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#38bdf8' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">In Progress</span>
            <div className="hud-metric-value">{summary.inProgressCount || 0}</div>
          </div>
          <div className="hud-metric-icon">
            <Headset size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#10b981' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Resolved</span>
            <div className="hud-metric-value">{summary.resolvedCount || 0}</div>
          </div>
          <div className="hud-metric-icon">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#f59e0b' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Satisfaction Score</span>
            <div className="hud-metric-value">{summary.avgRating || '0.0'} / 5.0</div>
          </div>
          <div className="hud-metric-icon">
            <Star size={24} fill="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Aligned Tabs Header */}
      <div className="workspace-controls" style={{ marginBottom: '1.5rem', padding: '0.5rem 0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`nav-pill-link ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            All Complaints ({complaints.length})
          </button>
          <button
            className={`nav-pill-link ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            <Headset size={14} /> Agents ({agents.length})
          </button>
          <button
            className={`nav-pill-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={14} /> Registered Users ({users.length})
          </button>
          <button
            className={`nav-pill-link ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <Star size={14} /> Reviews ({feedbacks.length})
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'complaints' && (
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Customer</th>
                <th>Assigned Agent</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Dispatch Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--blue-light)', fontWeight: '700' }}>{c.ticketId}</td>
                  <td style={{ fontWeight: '600' }}>{c.title}</td>
                  <td>{c.category}</td>
                  <td>{c.userId?.name}</td>
                  <td>
                    {c.agentId ? (
                      <span style={{ color: '#10b981', fontWeight: '600' }}>{c.agentId.name}</span>
                    ) : (
                      <span style={{ color: '#ef4444', fontWeight: '600' }}>Unassigned</span>
                    )}
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleAssignClick(c)}
                      className="btn-neon-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      <UserCheck size={13} /> {c.agentId ? 'Reassign Agent' : 'Assign Agent'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Agent Name</th>
                <th>Email Address</th>
                <th>Assigned Department</th>
                <th>System Role</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent._id}>
                  <td style={{ fontWeight: '700' }}>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>{agent.department || 'General Support'}</td>
                  <td><span className="status-pill IN_PROGRESS">{agent.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>Contact Phone</th>
                <th>Account Role</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: '600' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td>
                    <span className={`status-pill ${u.role === 'ADMIN' ? 'REJECTED' : u.role === 'AGENT' ? 'IN_PROGRESS' : 'PENDING'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>User Name</th>
                <th>Score</th>
                <th>Resolution Comments</th>
                <th>Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f._id}>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--blue-light)', fontWeight: '700' }}>{f.complaintId?.ticketId}</td>
                  <td>{f.userId?.name}</td>
                  <td style={{ color: '#f59e0b', fontWeight: '700' }}>
                    {f.rating} ★
                  </td>
                  <td>{f.comment || 'No written comment'}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment Drawer */}
      {assigningComplaint && (
        <div className="drawer-backdrop" onClick={() => setAssigningComplaint(null)}>
          <div className="action-drawer" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 className="drawer-title" style={{ fontSize: '1.1rem' }}>Assign Agent to #{assigningComplaint.ticketId}</h3>
              <button onClick={() => setAssigningComplaint(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <form onSubmit={handleAssignSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Support Specialist</label>
                  <select
                    className="form-select"
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Specialist --</option>
                    {agents.map((ag) => (
                      <option key={ag._id} value={ag._id}>
                        {ag.name} ({ag.department || 'General Support'})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                  <button type="button" onClick={() => setAssigningComplaint(null)} className="btn-glass-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={assignLoading} className="btn-neon-primary" style={{ flex: 2, justifyContent: 'center' }}>
                    <Save size={16} />
                    {assignLoading ? 'Assigning...' : 'Confirm Dispatch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ChatModal from '../components/ChatModal';
import { Headset, CheckCircle, Clock, RefreshCw, MessageSquare, Eye, Edit3, X, Save, Search, Filter } from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedChatComplaint, setSelectedChatComplaint] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let url = '/api/complaints?';
      if (statusFilter) url += `status=${statusFilter}`;

      const { data } = await axios.get(url);
      setComplaints(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const handleEditClick = (c) => {
    setEditingComplaint(c);
    setNewStatus(c.status);
    setResolutionNotes(c.resolutionNotes || '');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingComplaint) return;

    try {
      setUpdateLoading(true);
      await axios.put(`/api/complaints/${editingComplaint._id}/status`, {
        status: newStatus,
        resolutionNotes
      });

      setUpdateLoading(false);
      setEditingComplaint(null);
      fetchComplaints();
    } catch (err) {
      setUpdateLoading(false);
      console.error(err);
    }
  };

  const totalAssigned = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Headset size={28} style={{ color: 'var(--blue-light)' }} /> Resolution Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Specialist Workspace &bull; {user?.name} ({user?.department || 'Technical Support'})
          </p>
        </div>
      </div>

      {/* HUD Stats Grid */}
      <div className="hud-metrics-grid">
        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#2563eb' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Assigned Tickets</span>
            <div className="hud-metric-value">{totalAssigned}</div>
          </div>
          <div className="hud-metric-icon">
            <Clock size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#f59e0b' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Pending Action</span>
            <div className="hud-metric-value">{pendingCount}</div>
          </div>
          <div className="hud-metric-icon">
            <Clock size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#38bdf8' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">In Progress</span>
            <div className="hud-metric-value">{inProgressCount}</div>
          </div>
          <div className="hud-metric-icon">
            <RefreshCw size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#10b981' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Resolved</span>
            <div className="hud-metric-value">{resolvedCount}</div>
          </div>
          <div className="hud-metric-icon">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="workspace-controls">
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>Active Queue Matrix</h3>
        <select
          className="form-select"
          style={{ width: '180px', borderRadius: 'var(--radius-pill)', padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Matrix Table */}
      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Resolution Notes</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem' }}>
                  Loading assigned tickets...
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No assigned complaints currently in queue.
                </td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--blue-light)', fontWeight: '700' }}>{c.ticketId}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{c.userId ? c.userId.name : 'Unknown User'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{c.userId?.email}</div>
                  </td>
                  <td>{c.category}</td>
                  <td>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: c.priority === 'Urgent' ? '#ef4444' : c.priority === 'High' ? '#f59e0b' : 'var(--text-muted)' }}>
                      {c.priority}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {c.resolutionNotes || '-'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button onClick={() => handleEditClick(c)} className="btn-neon-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                        <Edit3 size={13} /> Update Status
                      </button>
                      <button onClick={() => setSelectedChatComplaint(c)} className="btn-glass-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}>
                        <MessageSquare size={13} />
                      </button>
                      <Link to={`/complaint/${c._id}`} className="btn-glass-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}>
                        <Eye size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Drawer */}
      {editingComplaint && (
        <div className="drawer-backdrop" onClick={() => setEditingComplaint(null)}>
          <div className="action-drawer" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 className="drawer-title" style={{ fontSize: '1.1rem' }}>Update #{editingComplaint.ticketId}</h3>
              <button onClick={() => setEditingComplaint(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <form onSubmit={handleUpdateSubmit}>
                <div className="form-group">
                  <label className="form-label">Resolution Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Resolution Log Notes</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder="Document resolution steps taken or reason for status update..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                  <button type="button" onClick={() => setEditingComplaint(null)} className="btn-glass-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={updateLoading} className="btn-neon-primary" style={{ flex: 2, justifyContent: 'center' }}>
                    <Save size={16} />
                    {updateLoading ? 'Saving...' : 'Save Resolution Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ChatModal
        isOpen={!!selectedChatComplaint}
        onClose={() => setSelectedChatComplaint(null)}
        complaint={selectedChatComplaint}
      />
    </div>
  );
};

export default AgentDashboard;

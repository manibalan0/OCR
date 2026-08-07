import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import NewComplaintModal from '../components/NewComplaintModal';
import ChatModal from '../components/ChatModal';
import FeedbackModal from '../components/FeedbackModal';
import { Plus, Search, Filter, MessageSquare, Star, Eye, Clock, RefreshCw, CheckCircle, LayoutGrid, Kanban, List } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'grid' | 'matrix'

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedChatComplaint, setSelectedChatComplaint] = useState(null);
  const [selectedFeedbackComplaint, setSelectedFeedbackComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let url = '/api/complaints?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (searchQuery) url += `search=${searchQuery}&`;

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
  }, [statusFilter, searchQuery]);

  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const progressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  const renderKanban = () => {
    const columns = [
      { id: 'Pending', label: 'Pending Review', color: 'var(--status-pending)' },
      { id: 'In Progress', label: 'Active Progress', color: 'var(--blue-light)' },
      { id: 'Resolved', label: 'Resolved Tickets', color: 'var(--status-resolved)' },
      { id: 'Rejected', label: 'Closed / Rejected', color: 'var(--status-rejected)' }
    ];

    return (
      <div className="kanban-board-grid">
        {columns.map((col) => {
          const colComplaints = complaints.filter((c) => c.status === col.id);
          return (
            <div key={col.id} className="kanban-column">
              <div className="kanban-column-header">
                <div className="kanban-column-title" style={{ color: col.color }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                  {col.label}
                </div>
                <span className="count-chip">{colComplaints.length}</span>
              </div>

              {colComplaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-sub)', fontSize: '0.82rem' }}>
                  No tickets in queue
                </div>
              ) : (
                colComplaints.map((c) => (
                  <div key={c._id} className="glass-card ticket-card" style={{ '--accent-color': col.color }}>
                    <div className="ticket-card-header">
                      <span className="ticket-id-tag">{c.ticketId}</span>
                      <StatusBadge status={c.status} />
                    </div>

                    <h4 className="ticket-title">{c.title}</h4>
                    <p className="ticket-description-preview">{c.description}</p>

                    <div className="ticket-meta-footer">
                      <span>{c.category} &bull; {c.priority}</span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <Link to={`/complaint/${c._id}`} className="btn-glass-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}>
                          <Eye size={12} /> Details
                        </Link>
                        <button onClick={() => setSelectedChatComplaint(c)} className="btn-neon-primary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}>
                          <MessageSquare size={12} /> Chat
                        </button>
                        {(c.status === 'Resolved' || c.status === 'Rejected') && (
                          <button onClick={() => setSelectedFeedbackComplaint(c)} className="btn-glass-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', color: '#f59e0b' }}>
                            <Star size={12} /> Rate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderGrid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
      {complaints.map((c) => (
        <div key={c._id} className="glass-card glass-card-interactive" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span className="ticket-id-tag">{c.ticketId}</span>
            <StatusBadge status={c.status} />
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>{c.title}</h4>
          <p className="ticket-description-preview" style={{ marginBottom: '1.2rem' }}>{c.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>{c.category} &bull; {c.priority}</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <Link to={`/complaint/${c._id}`} className="btn-glass-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem' }}>
                <Eye size={13} />
              </Link>
              <button onClick={() => setSelectedChatComplaint(c)} className="btn-neon-primary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem' }}>
                <MessageSquare size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMatrix = () => (
    <div className="matrix-table-wrapper">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Ticket Identifier</th>
            <th>Title Summary</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Assigned Agent</th>
            <th>Status</th>
            <th>Submitted Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--blue-light)', fontWeight: '700' }}>{c.ticketId}</td>
              <td style={{ fontWeight: '600' }}>{c.title}</td>
              <td>{c.category}</td>
              <td>{c.priority}</td>
              <td>{c.agentId ? c.agentId.name : <span style={{ color: 'var(--text-sub)' }}>Unassigned</span>}</td>
              <td><StatusBadge status={c.status} /></td>
              <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                  <Link to={`/complaint/${c._id}`} className="btn-glass-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}>
                    <Eye size={13} />
                  </Link>
                  <button onClick={() => setSelectedChatComplaint(c)} className="btn-neon-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}>
                    <MessageSquare size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            User Workspace
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Active incident dispatch & resolution hub for {user?.name}
          </p>
        </div>
        <button onClick={() => setIsNewModalOpen(true)} className="btn-neon-primary">
          <Plus size={18} /> Dispatch Ticket
        </button>
      </div>

      {/* HUD Metrics Grid */}
      <div className="hud-metrics-grid">
        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#2563eb' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Total Logged</span>
            <div className="hud-metric-value">{totalCount}</div>
          </div>
          <div className="hud-metric-icon">
            <Clock size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#f59e0b' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">Pending Review</span>
            <div className="hud-metric-value">{pendingCount}</div>
          </div>
          <div className="hud-metric-icon">
            <RefreshCw size={24} />
          </div>
        </div>

        <div className="glass-card hud-metric-card" style={{ '--accent-color': '#38bdf8' }}>
          <div className="hud-metric-info">
            <span className="hud-metric-label">In Progress</span>
            <div className="hud-metric-value">{progressCount}</div>
          </div>
          <div className="hud-metric-icon">
            <MessageSquare size={24} />
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

      {/* Aligned Workspace Controls */}
      <div className="workspace-controls">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Filter tickets by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: '160px', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-pill)', fontSize: '0.82rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <div className="view-mode-toggle">
            <button className={`view-mode-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>
              <Kanban size={14} /> Kanban
            </button>
            <button className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <LayoutGrid size={14} /> Grid
            </button>
            <button className={`view-mode-btn ${viewMode === 'matrix' ? 'active' : ''}`} onClick={() => setViewMode('matrix')}>
              <List size={14} /> Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Main Board Container */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading workspace tickets...
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
            No complaint tickets matching filters.
          </p>
          <button onClick={() => setIsNewModalOpen(true)} className="btn-neon-primary">
            <Plus size={16} /> Dispatch First Ticket
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'kanban' && renderKanban()}
          {viewMode === 'grid' && renderGrid()}
          {viewMode === 'matrix' && renderMatrix()}
        </>
      )}

      {/* Drawers & Modals */}
      <NewComplaintModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={() => fetchComplaints()}
      />

      <ChatModal
        isOpen={!!selectedChatComplaint}
        onClose={() => setSelectedChatComplaint(null)}
        complaint={selectedChatComplaint}
      />

      <FeedbackModal
        isOpen={!!selectedFeedbackComplaint}
        onClose={() => setSelectedFeedbackComplaint(null)}
        complaint={selectedFeedbackComplaint}
        onSubmitted={() => fetchComplaints()}
      />
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ChatModal from '../components/ChatModal';
import { ArrowLeft, User, Headset, MessageSquare, Star, Paperclip, CheckCircle, Clock } from 'lucide-react';

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/complaints/${id}`);
        setComplaint(data.complaint);
        setFeedback(data.feedback);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading incident details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>Ticket not found or access denied.</p>
        <Link to="/" className="btn-glass-secondary">
          Return Home
        </Link>
      </div>
    );
  }

  const getBackPath = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'AGENT') return '/agent';
    return '/dashboard';
  };

  const isStepCompleted = (stepName) => {
    const status = complaint.status;
    if (status === 'Resolved') return true;
    if (stepName === 'Submitted') return true;
    if (stepName === 'Assigned' && complaint.agentId) return true;
    if (stepName === 'In Progress' && (status === 'In Progress' || status === 'Resolved')) return true;
    return false;
  };

  const isStepActive = (stepName) => {
    const status = complaint.status;
    if (stepName === 'Submitted' && status === 'Pending') return true;
    if (stepName === 'In Progress' && status === 'In Progress') return true;
    if (stepName === 'Resolved' && status === 'Resolved') return true;
    return false;
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={getBackPath()} className="btn-glass-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Control Hub
        </Link>
      </div>

      {/* Incident Progress Stepper */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Resolution Stepper Timeline
        </h4>
        <div className="timeline-stepper">
          <div className={`timeline-step-node ${isStepCompleted('Submitted') ? 'completed' : ''} ${isStepActive('Submitted') ? 'active' : ''}`}>
            <div className="step-circle"><Clock size={18} /></div>
            <span className="step-label">Submitted</span>
          </div>

          <div className={`timeline-step-node ${isStepCompleted('Assigned') ? 'completed' : ''} ${isStepActive('Assigned') ? 'active' : ''}`}>
            <div className="step-circle"><Headset size={18} /></div>
            <span className="step-label">Assigned</span>
          </div>

          <div className={`timeline-step-node ${isStepCompleted('In Progress') ? 'completed' : ''} ${isStepActive('In Progress') ? 'active' : ''}`}>
            <div className="step-circle"><MessageSquare size={18} /></div>
            <span className="step-label">In Progress</span>
          </div>

          <div className={`timeline-step-node ${isStepCompleted('Resolved') ? 'completed' : ''} ${isStepActive('Resolved') ? 'active' : ''}`}>
            <div className="step-circle"><CheckCircle size={18} /></div>
            <span className="step-label">Resolved</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="ticket-id-tag">{complaint.ticketId}</span>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.4rem', color: '#ffffff' }}>{complaint.title}</h1>
              </div>
              <StatusBadge status={complaint.status} />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span>Category: <strong style={{ color: 'var(--text-bright)' }}>{complaint.category}</strong></span>
              <span>Priority: <strong style={{ color: 'var(--blue-light)' }}>{complaint.priority}</strong></span>
              <span>Logged: <strong style={{ color: 'var(--text-bright)' }}>{new Date(complaint.createdAt).toLocaleDateString()}</strong></span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Incident Description
              </h3>
              <p style={{ color: 'var(--text-main)', lineHeight: '1.65', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {complaint.description}
              </p>
            </div>

            {complaint.attachments && complaint.attachments.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Attached Media</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {complaint.attachments.map((att, idx) => (
                    <a key={idx} href={att} target="_blank" rel="noopener noreferrer" className="btn-glass-secondary" style={{ fontSize: '0.8rem' }}>
                      <Paperclip size={14} /> View File #{idx + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {complaint.resolutionNotes && (
              <div style={{ padding: '1rem 1.25rem', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid var(--border-neon)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--blue-light)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                  Resolution Notes Log
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#ffffff', lineHeight: '1.5' }}>{complaint.resolutionNotes}</p>
              </div>
            )}
          </div>

          {feedback && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                <Star size={18} fill="#f59e0b" style={{ color: '#f59e0b' }} /> Customer Rating Feedback
              </h3>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b', marginBottom: '0.3rem' }}>
                {feedback.rating} / 5.0
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                "{feedback.comment || 'No written feedback'}"
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem', color: '#ffffff' }}>Dispatch Details</h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CUSTOMER ENTITY</div>
              <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', color: '#fff', marginTop: '0.2rem' }}>
                <User size={15} style={{ color: 'var(--blue-light)' }} /> {complaint.userId?.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{complaint.userId?.email}</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ASSIGNED SPECIALIST</div>
              {complaint.agentId ? (
                <div style={{ marginTop: '0.2rem' }}>
                  <div style={{ fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                    <Headset size={15} /> {complaint.agentId.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{complaint.agentId.department}</div>
                </div>
              ) : (
                <div style={{ color: '#ef4444', fontSize: '0.88rem', marginTop: '0.2rem', fontWeight: '600' }}>Unassigned</div>
              )}
            </div>

            <button onClick={() => setIsChatOpen(true)} className="btn-neon-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <MessageSquare size={16} /> Open Resolution Chat
            </button>
          </div>
        </div>
      </div>

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        complaint={complaint}
      />
    </div>
  );
};

export default ComplaintDetail;

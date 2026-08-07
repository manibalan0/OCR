import React, { useState } from 'react';
import axios from 'axios';
import { X, Star, Send, Award } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, complaint, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/api/feedback', {
        complaintId: complaint._id,
        rating,
        comment
      });

      setLoading(false);
      onSubmitted(data);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="action-drawer" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-logo-icon" style={{ width: '36px', height: '36px' }}>
              <Award size={18} />
            </div>
            <h3 className="drawer-title" style={{ fontSize: '1.1rem' }}>Rate Resolution Experience</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--blue-light)', fontFamily: 'JetBrains Mono, monospace' }}>
              {complaint.ticketId}
            </span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-bright)', marginTop: '0.2rem' }}>
              {complaint.title}
            </h4>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <label className="form-label">Satisfaction Score</label>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ color: star <= rating ? '#f59e0b' : 'var(--text-sub)', transition: 'transform 0.2s', transform: star <= rating ? 'scale(1.15)' : 'scale(1)' }}
                  >
                    <Star size={34} fill={star <= rating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Resolution Comments</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="How quickly and effectively was your issue resolved?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
              <button type="button" onClick={onClose} className="btn-glass-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-neon-primary" style={{ flex: 2, justifyContent: 'center' }}>
                <Send size={16} />
                {loading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

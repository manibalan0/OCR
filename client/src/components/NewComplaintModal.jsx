import React, { useState } from 'react';
import axios from 'axios';
import { X, Send, AlertCircle, Sparkles, Paperclip, Tag, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Technical', 'Billing', 'Service Quality', 'Account Management', 'Hardware', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const NewComplaintModal = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [priority, setPriority] = useState('Medium');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const attachments = attachmentUrl ? [attachmentUrl] : [];
      const { data } = await axios.post('/api/complaints', {
        title,
        description,
        category,
        priority,
        attachments
      });

      setLoading(false);
      onCreated(data);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to dispatch ticket');
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="action-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--neon-cyan)' }}>
              <Sparkles size={18} />
            </div>
            <h3 className="drawer-title">Dispatch New Ticket</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        <div className="drawer-body">
          {error && (
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(244, 63, 94, 0.12)', color: 'var(--neon-rose)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.3)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Issue Summary / Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Describe the incident in a few words..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={14} /> Category Selector
              </label>
              <div className="category-pill-picker">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-picker-pill ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={14} /> Priority Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {PRIORITIES.map((prio) => (
                  <button
                    key={prio}
                    type="button"
                    className={`category-picker-pill ${priority === prio ? 'active' : ''}`}
                    style={{ textAlign: 'center', justifyContent: 'center' }}
                    onClick={() => setPriority(prio)}
                  >
                    {prio}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Incident Explanation</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="Provide thorough details, reproduction steps, or log snippets..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Paperclip size={14} /> Supporting Media / Asset URL (Optional)
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/screenshot.png"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" onClick={onClose} className="btn-glass-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-neon-primary" style={{ flex: 2, justifyContent: 'center' }}>
                <Send size={16} />
                {loading ? 'Dispatching...' : 'Dispatch Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewComplaintModal;

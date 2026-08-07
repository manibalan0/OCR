import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { X, Send, MessageSquare, ShieldCheck, User } from 'lucide-react';

let socket;

const ChatModal = ({ isOpen, onClose, complaint }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isOpen || !complaint) return;

    const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
    socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    socket.emit('joinRoom', complaint._id);

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${complaint._id}`);
        setMessages(data);
        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [isOpen, complaint]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen || !complaint) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      await axios.post('/api/messages', {
        complaintId: complaint._id,
        message: newMessage
      });
      setNewMessage('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="action-drawer" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header" style={{ background: 'rgba(8, 13, 26, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-logo-icon" style={{ width: '36px', height: '36px' }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="drawer-title" style={{ fontSize: '1.05rem', lineHeight: '1.2' }}>
                Resolution Room
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--blue-light)', fontFamily: 'JetBrains Mono, monospace' }}>
                {complaint.ticketId} &bull; {complaint.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 75px)', padding: '1.25rem' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingRight: '0.4rem', marginBottom: '1rem' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-sub)', margin: 'auto', fontSize: '0.85rem' }}>
                <p style={{ marginBottom: '0.4rem' }}>No messages in thread yet.</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--blue-light)' }}>Start communicating directly with support agent.</span>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isSelf = msg.senderId === user._id;
                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: isSelf ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isSelf ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', marginBottom: '0.2rem' }}>
                      {msg.senderName} ({msg.senderRole})
                    </span>
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: isSelf ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        background: isSelf ? 'var(--blue-gradient)' : 'rgba(37, 99, 235, 0.12)',
                        border: isSelf ? 'none' : '1px solid var(--border-glass)',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        lineHeight: '1.4'
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
            <input
              type="text"
              className="form-input"
              style={{ borderRadius: 'var(--radius-pill)', paddingLeft: '1.2rem' }}
              placeholder="Type resolution notes or reply..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-neon-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;

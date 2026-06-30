import { useState, useEffect } from 'react';
import { getMyFeedback } from '../api/feedbackAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import { MdSmartToy, MdExpandMore, MdExpandLess } from 'react-icons/md';

const TYPE_COLORS = { MOCK_TEST: 'badge-cyan', CODING: 'badge-purple', APTITUDE: 'badge-easy', RESUME: 'badge-medium' };
const TYPE_ICONS = { MOCK_TEST: '📝', CODING: '💻', APTITUDE: '🧠', RESUME: '📄' };

const AIFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    getMyFeedback().then(r => setFeedbacks(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(139,92,246,0.12)', padding: '0.375rem 1.1rem',
          borderRadius: 100, border: '1px solid rgba(139,92,246,0.3)', marginBottom: '1.25rem' }}>
          <MdSmartToy style={{ color: 'var(--accent-purple)', fontSize: '1rem' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: 'var(--accent-purple)' }}>Gemini AI</span>
        </div>
        <h1 style={{ fontSize: 'calc(1.8rem + 0.8vw)', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          AI <span className="gradient-text glow-text-purple">Feedback</span> History
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.75 }}>
          All your AI-generated feedback, coaching insights, and recommendations — powered by Gemini.
        </p>
      </div>

      <div className="page-container">
      {feedbacks.length === 0
        ? (
          <div className="empty-state">
            <div className="empty-state-icon"><MdSmartToy /></div>
            <h3>No feedback yet</h3>
            <p>Complete tests and request AI feedback to see it here</p>
          </div>
        )
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.map(f => (
              <div key={f.id} className="glass-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setExpanded(p => ({ ...p, [f.id]: !p[f.id] }))}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{TYPE_ICONS[f.contextType]}</span>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className={`badge ${TYPE_COLORS[f.contextType]}`}>{f.contextType}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(f.generatedAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>
                        {f.feedbackText?.substring(0, 120)}...
                      </p>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.25rem', flexShrink: 0 }}>
                    {expanded[f.id] ? <MdExpandLess /> : <MdExpandMore />}
                  </div>
                </div>

                {expanded[f.id] && (
                  <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.8,
                      fontSize: '0.9375rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                      {f.feedbackText}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
      </div>
    </div>
  );
};

export default AIFeedback;
